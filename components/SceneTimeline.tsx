'use client'

import { Plus } from 'lucide-react'
import { v4 as uuidv4 } from 'uuid'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import SceneCard from './SceneCard'
import useProjectStore from '@/store/useProjectStore'
import type { Scene } from '@/types'

export default function SceneTimeline() {
  const {
    currentProject,
    activeSceneId,
    setActiveScene,
    addScene,
    deleteScene,
    openEditor,
  } = useProjectStore()

  const scenes = currentProject?.scenes || []

  const handleAddScene = () => {
    const newScene: Scene = {
      id: uuidv4(),
      order: scenes.length,
      text: 'New scene text',
      keywords: [],
      duration: 5,
      illustrations: [],
      animation: 'fade',
      layout: {
        style: 'horizontal-row',
        illustrationSize: 'medium',
        textPosition: 'overlay-bottom',
      },
    }
    addScene(newScene)
    setActiveScene(newScene.id)
  }

  const handleEditScene = (sceneId: string) => {
    setActiveScene(sceneId)
    openEditor()
  }

  if (!currentProject) {
    return (
      <div className="flex flex-col h-full">
        <div className="p-4">
          <h2 className="text-2xl font-semibold">Timeline</h2>
        </div>
        <div className="flex-1 flex items-center justify-center text-center p-6">
          <p className="text-muted-foreground">
            No project loaded
          </p>
        </div>
      </div>
    )
  }

  if (scenes.length === 0) {
    return (
      <div className="flex flex-col h-full">
        <div className="p-4">
          <h2 className="text-2xl font-semibold">Timeline</h2>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center text-center p-6 gap-4">
          <p className="text-muted-foreground max-w-xs">
            No scenes yet. Generate scenes from your script to get started.
          </p>
          <div className="flex items-center gap-2 text-muted-foreground">
            <div className="h-px w-12 bg-border" />
            <span className="text-xs">or</span>
            <div className="h-px w-12 bg-border" />
          </div>
          <Button onClick={handleAddScene} variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Scene Manually
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Timeline</h2>
        <Badge variant="outline">{scenes.length} Scenes</Badge>
      </div>

      <ScrollArea className="flex-1 px-4">
        <div className="space-y-3 pb-4">
          {scenes.map((scene, index) => (
            <SceneCard
              key={scene.id}
              scene={scene}
              sceneNumber={index + 1}
              isActive={scene.id === activeSceneId}
              onSelect={setActiveScene}
              onEdit={handleEditScene}
              onDelete={deleteScene}
            />
          ))}
        </div>
      </ScrollArea>

      <div className="p-4 border-t border-border">
        <Button onClick={handleAddScene} variant="outline" className="w-full" size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Scene
        </Button>
      </div>
    </div>
  )
}
