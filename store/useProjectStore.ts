import { create } from 'zustand'
import { v4 as uuidv4 } from 'uuid'
import type {
  Project,
  Scene,
  ProjectStore,
  AutoSaveStatus,
  GenerateScenesResponse,
} from '@/types'

// Debounce helper
let autoSaveTimeout: NodeJS.Timeout | null = null

const useProjectStore = create<ProjectStore>((set, get) => ({
  currentProject: null,
  activeSceneId: null,
  isGenerating: false,
  isEditorOpen: false,
  autoSaveStatus: 'idle',

  createProject: (title: string) => {
    const project: Project = {
      id: uuidv4(),
      title,
      script: '',
      scenes: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }
    set({ currentProject: project, activeSceneId: null })
    get().saveToLocalStorage()
  },

  loadProject: (id: string) => {
    try {
      const stored = localStorage.getItem(`storyvid-project-${id}`)
      if (stored) {
        const project: Project = JSON.parse(stored)
        set({
          currentProject: project,
          activeSceneId: project.scenes[0]?.id || null,
        })
      }
    } catch (error) {
      console.error('Failed to load project:', error)
      set({ autoSaveStatus: 'error' })
    }
  },

  updateScript: (script: string) => {
    const { currentProject } = get()
    if (!currentProject) return

    // Sanitize script (remove control characters except newlines/tabs)
    const sanitizedScript = script.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')

    set({
      currentProject: {
        ...currentProject,
        script: sanitizedScript,
        updatedAt: Date.now(),
      },
    })
    get().saveToLocalStorage()
  },

  generateScenes: async (script: string) => {
    set({ isGenerating: true })

    try {
      const response = await fetch('/api/generate-scenes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ script, maxScenes: 20 }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate scenes')
      }

      const data: GenerateScenesResponse = await response.json()

      const { currentProject } = get()
      if (!currentProject) return

      // Convert generated scenes to Scene objects
      const scenes: Scene[] = data.scenes.map((genScene, index) => ({
        id: uuidv4(),
        order: index,
        text: genScene.text,
        keywords: genScene.keywords,
        duration: genScene.duration,
        illustrations: genScene.suggestedIcons.slice(0, 3).map((icon, idx) => ({
          id: uuidv4(),
          library: icon.library,
          iconName: icon.name,
          keyword: genScene.keywords[idx] || genScene.keywords[0],
          color: getDefaultColorForKeyword(genScene.keywords[idx] || ''),
          size: 'medium' as const,
          position: { x: 0, y: 0 },
          rotation: Math.random() * 10 - 5,
          aspectRatio: 0.8 + Math.random() * 0.6,
        })),
        animation: genScene.animation,
        layout: {
          style: 'horizontal-row',
          illustrationSize: 'medium',
          textPosition: 'overlay-bottom',
        },
      }))

      set({
        currentProject: {
          ...currentProject,
          scenes,
          updatedAt: Date.now(),
        },
        activeSceneId: scenes[0]?.id || null,
        isGenerating: false,
      })

      get().saveToLocalStorage()
    } catch (error) {
      console.error('Scene generation failed:', error)
      set({ isGenerating: false, autoSaveStatus: 'error' })
    }
  },

  addScene: (scene: Scene) => {
    const { currentProject } = get()
    if (!currentProject) return

    const newScenes = [...currentProject.scenes, scene]
    set({
      currentProject: {
        ...currentProject,
        scenes: newScenes,
        updatedAt: Date.now(),
      },
    })
    get().saveToLocalStorage()
  },

  updateScene: (id: string, updates: Partial<Scene>) => {
    const { currentProject } = get()
    if (!currentProject) return

    const updatedScenes = currentProject.scenes.map((scene) =>
      scene.id === id ? { ...scene, ...updates } : scene
    )

    set({
      currentProject: {
        ...currentProject,
        scenes: updatedScenes,
        updatedAt: Date.now(),
      },
    })
    get().saveToLocalStorage()
  },

  deleteScene: (id: string) => {
    const { currentProject, activeSceneId } = get()
    if (!currentProject) return

    const filteredScenes = currentProject.scenes.filter((scene) => scene.id !== id)
    const newActiveId = activeSceneId === id ? filteredScenes[0]?.id || null : activeSceneId

    set({
      currentProject: {
        ...currentProject,
        scenes: filteredScenes,
        updatedAt: Date.now(),
      },
      activeSceneId: newActiveId,
    })
    get().saveToLocalStorage()
  },

  reorderScenes: (fromIndex: number, toIndex: number) => {
    const { currentProject } = get()
    if (!currentProject) return

    const scenes = [...currentProject.scenes]
    const [movedScene] = scenes.splice(fromIndex, 1)
    scenes.splice(toIndex, 0, movedScene)

    // Update order property
    const reorderedScenes = scenes.map((scene, index) => ({
      ...scene,
      order: index,
    }))

    set({
      currentProject: {
        ...currentProject,
        scenes: reorderedScenes,
        updatedAt: Date.now(),
      },
    })
    get().saveToLocalStorage()
  },

  setActiveScene: (id: string | null) => {
    set({ activeSceneId: id })
  },

  openEditor: () => {
    set({ isEditorOpen: true })
  },

  closeEditor: () => {
    set({ isEditorOpen: false })
  },

  saveToLocalStorage: () => {
    // Debounce auto-save by 1 second
    if (autoSaveTimeout) {
      clearTimeout(autoSaveTimeout)
    }

    set({ autoSaveStatus: 'saving' })

    autoSaveTimeout = setTimeout(() => {
      try {
        const { currentProject } = get()
        if (!currentProject) return

        localStorage.setItem(
          `storyvid-project-${currentProject.id}`,
          JSON.stringify(currentProject)
        )

        // Update project list
        const projectsList = JSON.parse(
          localStorage.getItem('storyvid-projects') || '[]'
        )
        const existingIndex = projectsList.findIndex(
          (p: any) => p.id === currentProject.id
        )
        const projectMeta = {
          id: currentProject.id,
          title: currentProject.title,
          updatedAt: currentProject.updatedAt,
        }

        if (existingIndex >= 0) {
          projectsList[existingIndex] = projectMeta
        } else {
          projectsList.push(projectMeta)
        }

        localStorage.setItem('storyvid-projects', JSON.stringify(projectsList))

        set({ autoSaveStatus: 'saved' })

        // Auto-hide "saved" indicator after 2 seconds
        setTimeout(() => {
          if (get().autoSaveStatus === 'saved') {
            set({ autoSaveStatus: 'idle' })
          }
        }, 2000)
      } catch (error) {
        console.error('Failed to save project:', error)
        set({ autoSaveStatus: 'error' })
      }
    }, 1000)
  },

  autoGenerateIllustrations: async (sceneId: string) => {
    const { currentProject } = get()
    if (!currentProject) return

    const scene = currentProject.scenes.find((s) => s.id === sceneId)
    if (!scene) return

    try {
      // Call AI to regenerate illustrations for this scene
      const response = await fetch('/api/generate-scenes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ script: scene.text, maxScenes: 1 }),
      })

      if (!response.ok) throw new Error('Failed to generate illustrations')

      const data: GenerateScenesResponse = await response.json()
      const genScene = data.scenes[0]

      if (genScene) {
        const newIllustrations = genScene.suggestedIcons.slice(0, 3).map((icon, idx) => ({
          id: uuidv4(),
          library: icon.library,
          iconName: icon.name,
          keyword: genScene.keywords[idx] || genScene.keywords[0],
          color: getDefaultColorForKeyword(genScene.keywords[idx] || ''),
          size: 'medium' as const,
          position: { x: 0, y: 0 },
          rotation: Math.random() * 10 - 5,
          aspectRatio: 0.8 + Math.random() * 0.6,
        }))

        get().updateScene(sceneId, {
          illustrations: newIllustrations,
          keywords: genScene.keywords,
          animation: genScene.animation,
        })
      }
    } catch (error) {
      console.error('Failed to auto-generate illustrations:', error)
    }
  },
}))

// Helper function to assign default colors based on keywords
function getDefaultColorForKeyword(keyword: string): string {
  const lowerKeyword = keyword.toLowerCase()

  // Medical/Health
  if (lowerKeyword.includes('heart') || lowerKeyword.includes('health')) return '#10b981' // Green
  if (lowerKeyword.includes('pill') || lowerKeyword.includes('medication')) return '#3b82f6' // Blue
  if (lowerKeyword.includes('emergency') || lowerKeyword.includes('urgent')) return '#ef4444' // Red

  // Finance
  if (lowerKeyword.includes('money') || lowerKeyword.includes('dollar') || lowerKeyword.includes('cost')) return '#f59e0b' // Amber
  if (lowerKeyword.includes('save') || lowerKeyword.includes('saving')) return '#10b981' // Green

  // Technology
  if (lowerKeyword.includes('tech') || lowerKeyword.includes('digital') || lowerKeyword.includes('computer')) return '#6366f1' // Indigo

  // Communication
  if (lowerKeyword.includes('phone') || lowerKeyword.includes('message')) return '#06b6d4' // Cyan

  // Default to primary color
  return '#6b21a8' // Deep Purple
}

export default useProjectStore
