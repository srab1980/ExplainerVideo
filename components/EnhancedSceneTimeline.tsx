'use client'

import { useState } from 'react'
import { Plus, GripVertical, Edit, Trash2, Eye } from 'lucide-react'

interface Scene {
  id: string
  text: string
  keywords: string[]
  animation: string
  duration: number
}

interface SceneCardProps {
  scene: Scene
  index: number
  isSelected: boolean
  onEdit: (index: number) => void
  onDelete: (index: number) => void
  onSelect: (index: number) => void
}

function SceneCard({ scene, index, isSelected, onEdit, onDelete, onSelect }: SceneCardProps) {
  const [isDragging, setIsDragging] = useState(false)

  const getAnimationIcon = (animation: string) => {
    switch (animation) {
      case 'fade': return '🌟'
      case 'slide': return '➡️'
      case 'zoom': return '🔍'
      case 'bounce': return '⚡'
      default: return '🎬'
    }
  }

  return (
    <div
      className={`scene-card ${isSelected ? 'selected' : ''}`}
      draggable
      onClick={() => onSelect(index)}
      onDragStart={() => setIsDragging(true)}
      onDragEnd={() => setIsDragging(false)}
    >
      <div className="scene-card-header">
        <div className="scene-number">
          #{index + 1}
        </div>
        <div className="scene-duration">
          {scene.duration}s
        </div>
        <div className="scene-animation">
          {getAnimationIcon(scene.animation)}
        </div>
      </div>

      <div className="scene-card-body">
        <p className="scene-text">{scene.text}</p>
        <div className="scene-keywords">
          {scene.keywords.slice(0, 3).map((keyword, idx) => (
            <span key={idx} className="keyword-tag">
              {keyword}
            </span>
          ))}
        </div>
      </div>

      <div className="scene-card-actions">
        <button
          className="action-btn edit"
          onClick={(e) => {
            e.stopPropagation()
            onEdit(index)
          }}
          title="Edit scene"
        >
          <Edit className="w-3 h-3" />
        </button>
        <button
          className="action-btn delete"
          onClick={(e) => {
            e.stopPropagation()
            if (confirm(`Delete scene ${index + 1}?`)) {
              onDelete(index)
            }
          }}
          title="Delete scene"
        >
          <Trash2 className="w-3 h-3" />
        </button>
      </div>

      <div className="drag-handle">
        <GripVertical className="w-4 h-4" />
      </div>
    </div>
  )
}

interface SceneTimelineProps {
  scenes: Scene[]
  currentSceneIndex: number
  onSceneChange: (index: number) => void
  onEdit: (index: number) => void
  onSceneReorder: (scenes: Scene[]) => void
  onAddScene: (scene: Omit<Scene, 'id'>) => void
}

export default function EnhancedSceneTimeline({
  scenes,
  currentSceneIndex,
  onSceneChange,
  onEdit,
  onSceneReorder,
  onAddScene,
}: SceneTimelineProps) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)

  const handleDragStart = (index: number) => {
    setDraggedIndex(index)
  }

  const handleDragOver = (index: number) => {
    setDragOverIndex(index)
  }

  const handleDragLeave = () => {
    setDragOverIndex(null)
  }

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault()
    e.stopPropagation()

    if (draggedIndex === null || draggedIndex === dropIndex) return

    const newScenes = [...scenes]
    const [draggedScene] = newScenes.splice(draggedIndex, 1)
    newScenes.splice(dropIndex, 0, draggedScene)

    onSceneReorder(newScenes)
    setDraggedIndex(null)
    setDragOverIndex(null)
  }

  const handleDragEnd = () => {
    setDraggedIndex(null)
    setDragOverIndex(null)
  }

  const handleAddScene = () => {
    const newScene: Omit<Scene, 'id'> = {
      text: 'New scene',
      keywords: [],
      animation: 'fade',
      duration: 5,
    }
    onAddScene(newScene)
  }

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-4">
        <h3>Timeline</h3>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            {scenes.length} scenes
          </span>
          <button
            onClick={handleAddScene}
            className="flex items-center gap-1 bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm transition-colors"
          >
            <Plus className="w-3 h-3" />
            Add Scene
          </button>
        </div>
      </div>

      {scenes.length === 0 ? (
        <div className="empty-state">
          <div className="text-4xl mb-2">📋</div>
          <p>No scenes yet</p>
          <p className="text-sm text-muted-foreground">
            Generate scenes from your script to get started
          </p>
        </div>
      ) : (
        <div className="scene-list">
          {scenes.map((scene, index) => (
            <div
              key={scene.id}
              className={`scene-list-item ${dragOverIndex === index ? 'drag-over' : ''}`}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragOver={() => handleDragOver(index)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, index)}
              onDragEnd={handleDragEnd}
            >
              <SceneCard
                scene={scene}
                index={index}
                isSelected={index === currentSceneIndex}
                onSelect={onSceneChange}
                onEdit={onEdit}
                onDelete={(idx) => {
                  const newScenes = scenes.filter((_, i) => i !== idx)
                  onSceneReorder(newScenes)
                }}
              />
            </div>
          ))}
        </div>
      )}

      {/* Scene Overview */}
      {scenes.length > 0 && (
        <div className="scene-overview">
          <h4>Overview</h4>
          <div className="overview-stats">
            <div className="stat-item">
              <span className="stat-label">Total Duration:</span>
              <span className="stat-value">
                {scenes.reduce((sum, scene) => sum + scene.duration, 0)}s
              </span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Average:</span>
              <span className="stat-value">
                {(scenes.reduce((sum, scene) => sum + scene.duration, 0) / scenes.length).toFixed(1)}s
              </span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Animations:</span>
              <div className="stat-value">
                {scenes.reduce((counts, scene) => {
                  counts[scene.animation] = (counts[scene.animation] || 0) + 1
                  return counts
                }, {} as Record<string, number>)}

                Object.entries(counts).map(([type, count]) => (
                  <span key={type} className="animation-stat">
                    {getAnimationIcon(type)} {count}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
