'use client'

import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Play, Pause, Download, Edit } from 'lucide-react'

interface Scene {
  id: string
  text: string
  keywords: string[]
  animation: string
  duration: number
}

interface PreviewPanelProps {
  scenes: Scene[]
  currentSceneIndex: number
  onSceneChange: (index: number) => void
  onEdit: (sceneIndex: number) => void
  isPlaying?: boolean
  onPlay?: () => void
  onPause?: () => void
}

export default function PreviewPanel({
  scenes,
  currentSceneIndex,
  onSceneChange,
  onEdit,
  isPlaying = false,
  onPlay,
  onPause,
}: PreviewPanelProps) {
  const [isAnimated, setIsAnimated] = useState(true)
  const [animationType, setAnimationType] = useState('fade')

  if (scenes.length === 0) {
    return (
      <div className="card">
        <h3>Preview</h3>
        <div className="flex items-center justify-center h-96 text-muted-foreground">
          <div className="text-center">
            <div className="text-2xl mb-2">📹</div>
            <p>No scenes to preview yet</p>
            <p className="text-sm">Generate scenes from your script to see the preview</p>
          </div>
        </div>
      </div>
    )
  }

  const currentScene = scenes[currentSceneIndex]

  const handlePrev = () => {
    const prevIndex = currentSceneIndex > 0 ? currentSceneIndex - 1 : scenes.length - 1
    onSceneChange(prevIndex)
  }

  const handleNext = () => {
    const nextIndex = currentSceneIndex < scenes.length - 1 ? currentSceneIndex + 1 : 0
    onSceneChange(nextIndex)
  }

  const handleExport = () => {
    const storyboardData = {
      title: 'StoryVid Storyboard',
      created: new Date().toISOString(),
      totalDuration: scenes.reduce((sum, scene) => sum + scene.duration, 0),
      scenes: scenes.map((scene, index) => ({
        sceneNumber: index + 1,
        text: scene.text,
        keywords: scene.keywords,
        animation: scene.animation,
        duration: scene.duration,
      }))
    }

    const blob = new Blob([JSON.stringify(storyboardData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'storyboard.json'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const getAnimationClass = (type: string) => {
    switch (type) {
      case 'fade':
        return 'animate-pulse'
      case 'slide':
        return 'animate-slide-in-left'
      case 'zoom':
        return 'animate-bounce-in'
      case 'bounce':
        return 'animate-bounce'
      default:
        return 'animate-fade-in'
    }
  }

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-4">
        <h3>Preview</h3>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            Scene {currentSceneIndex + 1} of {scenes.length}
          </span>
          <button
            onClick={() => setIsAnimated(!isAnimated)}
            className="text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded"
          >
            {isAnimated ? 'Static' : 'Animated'}
          </button>
        </div>
      </div>

      {/* Video Preview Area */}
      <div className="relative bg-black rounded-lg overflow-hidden mb-4" style={{ aspectRatio: '16/9' }}>
        <div className="absolute inset-0 flex items-center justify-center">
          {currentScene && (
            <div className={`text-white text-center p-8 ${isAnimated && getAnimationClass(currentScene.animation)}`}>
              <div className="mb-4">
                {/* Icon preview based on animation type */}
                <div className={`text-4xl mb-4 ${isAnimated ? 'animate-pulse' : ''}`}>
                  {currentScene.animation === 'fade' && '🌟'}
                  {currentScene.animation === 'slide' && '➡️'}
                  {currentScene.animation === 'zoom' && '🔍'}
                  {currentScene.animation === 'bounce' && '⚡'}
                </div>
              </div>
              <h4 className="text-xl font-semibold mb-2">Scene {currentSceneIndex + 1}</h4>
              <p className="text-lg mb-4">{currentScene.text}</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {currentScene.keywords.map((keyword, idx) => (
                  <span
                    key={idx}
                    className="bg-white/20 text-white px-3 py-1 rounded-full text-sm"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Scene Navigation */}
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={handlePrev}
          className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </button>

        <div className="flex items-center gap-2">
          {!isPlaying ? (
            <button
              onClick={onPlay}
              className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded transition-colors"
            >
              <Play className="w-4 h-4" />
              Play All
            </button>
          ) : (
            <button
              onClick={onPause}
              className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded transition-colors"
            >
              <Pause className="w-4 h-4" />
              Pause
            </button>
          )}
        </div>

        <button
          onClick={handleNext}
          className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded transition-colors"
        >
          Next
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Scene Actions */}
      <div className="flex justify-between items-center">
        <button
          onClick={() => onEdit(currentSceneIndex)}
          className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded transition-colors"
        >
          <Edit className="w-4 h-4" />
          Edit Scene
        </button>

        <button
          onClick={handleExport}
          className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white px-3 py-2 rounded transition-colors"
        >
          <Download className="w-4 h-4" />
          Export Storyboard
        </button>
      </div>

      {/* Progress Indicator */}
      <div className="mt-4">
        <div className="flex justify-between text-sm text-muted-foreground mb-1">
          <span>Progress</span>
          <span>{currentSceneIndex + 1} / {scenes.length}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentSceneIndex + 1) / scenes.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  )
}
