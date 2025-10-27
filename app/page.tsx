'use client'

import { useEffect } from 'react'
import { Separator } from '@/components/ui/separator'
import ScriptInput from '@/components/ScriptInput'
import PreviewCanvas from '@/components/PreviewCanvas'
import SceneTimeline from '@/components/SceneTimeline'
import AutoSaveIndicator from '@/components/AutoSaveIndicator'
import useProjectStore from '@/store/useProjectStore'

export default function Home() {
  const { currentProject, createProject } = useProjectStore()

  useEffect(() => {
    // Initialize project on first load
    if (!currentProject) {
      createProject('Untitled Project')
    }
  }, [currentProject, createProject])

  return (
    <main className="h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="border-b border-border p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">StoryVid</h1>
            <p className="text-sm text-muted-foreground mt-1">
              AI-powered storyboard creator for explainer videos
            </p>
          </div>
          <AutoSaveIndicator />
        </div>
      </header>

      {/* Main content */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full grid grid-cols-1 md:grid-cols-[25%_50%_25%] gap-0">
          {/* Left panel: Script Input */}
          <div className="border-r border-border p-6 overflow-auto">
            <ScriptInput />
          </div>

          {/* Center panel: Preview Canvas */}
          <div className="border-r border-border overflow-auto">
            <PreviewCanvas />
          </div>

          {/* Right panel: Scene Timeline */}
          <div className="overflow-auto">
            <SceneTimeline />
          </div>
        </div>
      </div>
    </main>
  )
}
