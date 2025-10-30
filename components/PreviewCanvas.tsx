'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import IllustrationCanvas from './IllustrationCanvas'
import useProjectStore from '@/store/useProjectStore'

export default function PreviewCanvas() {
  const { currentProject, activeSceneId, setActiveScene } = useProjectStore()

  if (!currentProject || !currentProject.scenes || currentProject.scenes.length === 0) {
    return (
      <div className="flex flex-col h-full">
        <div className="p-4">
          <h2 className="text-2xl font-semibold">Preview</h2>
        </div>
        <div className="flex-1 flex items-center justify-center bg-muted rounded-lg mx-4 mb-4">
          <p className="text-muted-foreground">Select a scene to preview</p>
        </div>
      </div>
    )
  }

  const activeSceneIndex = currentProject.scenes.findIndex(
    (s) => s.id === activeSceneId
  )
  const activeScene = activeSceneIndex >= 0 ? currentProject.scenes[activeSceneIndex] : null

  const goToPrevScene = () => {
    if (activeSceneIndex > 0) {
      setActiveScene(currentProject.scenes[activeSceneIndex - 1].id)
    } else {
      // Wrap to last scene
      setActiveScene(currentProject.scenes[currentProject.scenes.length - 1].id)
    }
  }

  const goToNextScene = () => {
    if (activeSceneIndex < currentProject.scenes.length - 1) {
      setActiveScene(currentProject.scenes[activeSceneIndex + 1].id)
    } else {
      // Wrap to first scene
      setActiveScene(currentProject.scenes[0].id)
    }
  }

  if (!activeScene) {
    return (
      <div className="flex flex-col h-full">
        <div className="p-4">
          <h2 className="text-2xl font-semibold">Preview</h2>
        </div>
        <div className="flex-1 flex items-center justify-center bg-muted rounded-lg mx-4 mb-4">
          <p className="text-muted-foreground">Select a scene to preview</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Preview</h2>
        <Badge variant="outline">
          Scene {activeSceneIndex + 1} of {currentProject.scenes.length}
        </Badge>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 pb-4">
        <div className="relative w-full max-w-4xl">
          {/* 16:9 aspect ratio container */}
          <div className="relative w-full aspect-[16/9] bg-card border border-border rounded-lg shadow-lg overflow-hidden">
            {/* Navigation arrows */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-background/80 backdrop-blur-sm hover:bg-background/90"
              onClick={goToPrevScene}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-background/80 backdrop-blur-sm hover:bg-background/90"
              onClick={goToNextScene}
            >
              <ChevronRight className="h-5 w-5" />
            </Button>

            {/* Canvas content */}
            <div className="absolute inset-0">
              {/* Illustrations */}
              {activeScene.illustrations.length > 0 && (
                <IllustrationCanvas scene={activeScene} animate={true} />
              )}

              {/* Scene text overlay */}
              <div
                className={`
                  absolute inset-x-0
                  ${activeScene.layout.textPosition === 'overlay-bottom' ? 'bottom-0' : ''}
                  ${activeScene.layout.textPosition === 'overlay-top' ? 'top-0' : ''}
                  ${activeScene.layout.textPosition === 'bottom' ? 'bottom-0' : ''}
                  ${activeScene.layout.textPosition === 'top' ? 'top-0' : ''}
                  ${activeScene.layout.textPosition.startsWith('overlay') ? 'bg-black/60 text-white' : 'bg-transparent'}
                  px-8 py-4
                `}
              >
                <p className="text-base leading-relaxed text-center">{activeScene.text}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
