'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
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
            <div className="absolute inset-0 flex items-center justify-center p-8">
              <div className="text-center space-y-4">
                {/* Placeholder for illustrations - will be replaced with IllustrationCanvas */}
                {activeScene.illustrations.length > 0 && (
                  <div className="flex items-center justify-center gap-4 mb-6">
                    {activeScene.illustrations.map((illustration, idx) => (
                      <div
                        key={illustration.id}
                        className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center"
                        style={{ backgroundColor: illustration.color + '20' }}
                      >
                        <span className="text-xs text-muted-foreground">
                          {illustration.keyword}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Scene text */}
                <div
                  className={`
                    px-6 py-4 rounded-lg
                    ${activeScene.layout.textPosition.startsWith('overlay')
                      ? 'bg-black/60 text-white'
                      : 'bg-background/80 text-foreground'}
                  `}
                >
                  <p className="text-base leading-relaxed">{activeScene.text}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
