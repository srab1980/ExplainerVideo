// Core data models for StoryVid Storyboard Creator

export type AnimationType = 'fade' | 'slide' | 'zoom' | 'bounce'

export type LayoutStyle =
  | 'horizontal-row'
  | 'vertical-stack'
  | 'grid-2x2'
  | 'grid-3x3'
  | 'centered-large'
  | 'side-by-side'
  | 'scattered'
  | 'editorial'

export type IllustrationSize = 'small' | 'medium' | 'large' | 'extra-large'

export type TextPosition =
  | 'overlay-bottom'
  | 'overlay-top'
  | 'top'
  | 'bottom'
  | 'left'
  | 'right'

export type IconLibrary = 'lucide' | 'heroicons'

export interface Illustration {
  id: string
  library: IconLibrary
  iconName: string
  keyword: string
  color: string
  size: IllustrationSize
  position: { x: number; y: number }
  rotation: number
  aspectRatio: number
}

export interface LayoutConfig {
  style: LayoutStyle
  illustrationSize: IllustrationSize
  textPosition: TextPosition
}

export interface Scene {
  id: string
  order: number
  text: string
  keywords: string[]
  duration: number
  illustrations: Illustration[]
  animation: AnimationType
  layout: LayoutConfig
}

export interface Project {
  id: string
  title: string
  script: string
  scenes: Scene[]
  createdAt: number
  updatedAt: number
}

// API types for scene generation
export interface GenerateScenesRequest {
  script: string
  maxScenes?: number
}

export interface SuggestedIcon {
  library: IconLibrary
  name: string
}

export interface GeneratedScene {
  text: string
  keywords: string[]
  suggestedIcons: SuggestedIcon[]
  animation: AnimationType
  duration: number
}

export interface GenerateScenesResponse {
  scenes: GeneratedScene[]
}

// Auto-save status
export type AutoSaveStatus = 'idle' | 'saving' | 'saved' | 'error'

// Zustand store state
export interface ProjectStore {
  currentProject: Project | null
  activeSceneId: string | null
  isGenerating: boolean
  isEditorOpen: boolean
  autoSaveStatus: AutoSaveStatus

  // Actions
  createProject: (title: string) => void
  loadProject: (id: string) => void
  updateScript: (script: string) => void
  generateScenes: (script: string) => Promise<void>
  addScene: (scene: Scene) => void
  updateScene: (id: string, updates: Partial<Scene>) => void
  deleteScene: (id: string) => void
  reorderScenes: (fromIndex: number, toIndex: number) => void
  setActiveScene: (id: string | null) => void
  openEditor: () => void
  closeEditor: () => void
  saveToLocalStorage: () => void
  autoGenerateIllustrations: (sceneId: string) => Promise<void>
}
