'use client'

import { Palette, Zap, Pencil, X, GripVertical } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { Scene } from '@/types'

interface SceneCardProps {
  scene: Scene
  isActive: boolean
  sceneNumber: number
  onSelect: (sceneId: string) => void
  onEdit: (sceneId: string) => void
  onDelete: (sceneId: string) => void
}

export default function SceneCard({
  scene,
  isActive,
  sceneNumber,
  onSelect,
  onEdit,
  onDelete,
}: SceneCardProps) {
  const hasIllustrations = scene.illustrations && scene.illustrations.length > 0
  const hasAnimation = scene.animation && scene.animation !== 'fade'

  return (
    <Card
      className={`
        relative p-4 cursor-pointer transition-all hover:shadow-md group
        ${isActive ? 'border-l-4 border-l-accent bg-muted shadow-md' : ''}
      `}
      onClick={() => onSelect(scene.id)}
    >
      {/* Drag handle */}
      <div className="absolute left-1 top-1/2 -translate-y-1/2 opacity-40 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing">
        <GripVertical className="h-4 w-4 text-muted-foreground" />
      </div>

      <div className="flex flex-col gap-3 pl-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <Badge variant="outline" className="text-xs">
            Scene {sceneNumber}
          </Badge>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={(e) => {
                e.stopPropagation()
                onEdit(scene.id)
              }}
            >
              <Pencil className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-destructive hover:text-destructive"
              onClick={(e) => {
                e.stopPropagation()
                if (confirm('Delete this scene?')) {
                  onDelete(scene.id)
                }
              }}
            >
              <X className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>

        {/* Scene text (truncated) */}
        <p className="text-sm leading-relaxed line-clamp-2">
          {scene.text}
        </p>

        {/* Keywords */}
        {scene.keywords && scene.keywords.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {scene.keywords.slice(0, 3).map((keyword, idx) => (
              <Badge
                key={idx}
                variant="secondary"
                className="text-xs bg-secondary/50"
              >
                {keyword}
              </Badge>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{scene.duration}s</span>
          <div className="flex items-center gap-2">
            {hasIllustrations && (
              <Palette className="h-3.5 w-3.5 text-secondary" />
            )}
            {hasAnimation && (
              <Zap className="h-3.5 w-3.5 text-amber" />
            )}
          </div>
        </div>
      </div>
    </Card>
  )
}
