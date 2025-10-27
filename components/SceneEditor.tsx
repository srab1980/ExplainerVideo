'use client'

import { useState } from 'react'
import { Sparkles, Palette, Zap, LayoutGrid, FileText, Trash2 } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import ColorPicker from './ColorPicker'
import AssetStore from './AssetStore'
import IllustrationCanvas from './IllustrationCanvas'
import useProjectStore from '@/store/useProjectStore'
import type { Scene, AnimationType, LayoutStyle, IllustrationSize, TextPosition, IconLibrary } from '@/types'

interface SceneEditorProps {
  sceneId: string | null
  isOpen: boolean
  onClose: () => void
}

export default function SceneEditor({ sceneId, isOpen, onClose }: SceneEditorProps) {
  const { currentProject, updateScene, autoGenerateIllustrations } = useProjectStore()
  const [assetStoreOpen, setAssetStoreOpen] = useState(false)
  const [editingIllustrationIndex, setEditingIllustrationIndex] = useState<number | null>(null)

  if (!sceneId || !currentProject) return null

  const scene = currentProject.scenes.find((s) => s.id === sceneId)
  if (!scene) return null

  const sceneIndex = currentProject.scenes.findIndex((s) => s.id === sceneId)

  const handleSceneUpdate = (updates: Partial<Scene>) => {
    updateScene(sceneId, updates)
  }

  const handleAutoGenerateIllustrations = async () => {
    await autoGenerateIllustrations(sceneId)
  }

  const handleChangeIllustrationIcon = (illustrationIndex: number) => {
    setEditingIllustrationIndex(illustrationIndex)
    setAssetStoreOpen(true)
  }

  const handleIconSelect = (library: IconLibrary, iconName: string) => {
    if (editingIllustrationIndex !== null) {
      const updatedIllustrations = [...scene.illustrations]
      updatedIllustrations[editingIllustrationIndex] = {
        ...updatedIllustrations[editingIllustrationIndex],
        library,
        iconName,
      }
      handleSceneUpdate({ illustrations: updatedIllustrations })
    }
  }

  const handleRemoveIllustration = (index: number) => {
    const updatedIllustrations = scene.illustrations.filter((_, i) => i !== index)
    handleSceneUpdate({ illustrations: updatedIllustrations })
  }

  const handleUpdateIllustrationColor = (index: number, color: string) => {
    const updatedIllustrations = [...scene.illustrations]
    updatedIllustrations[index] = {
      ...updatedIllustrations[index],
      color,
    }
    handleSceneUpdate({ illustrations: updatedIllustrations })
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>Edit Scene {sceneIndex + 1}</DialogTitle>
          </DialogHeader>

          <Tabs defaultValue="content" className="flex-1 flex flex-col overflow-hidden">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="content">
                <FileText className="h-4 w-4 mr-2" />
                Content
              </TabsTrigger>
              <TabsTrigger value="layout">
                <LayoutGrid className="h-4 w-4 mr-2" />
                Layout
              </TabsTrigger>
              <TabsTrigger value="animation">
                <Zap className="h-4 w-4 mr-2" />
                Animation
              </TabsTrigger>
              <TabsTrigger value="illustration">
                <Palette className="h-4 w-4 mr-2" />
                Illustrations
              </TabsTrigger>
            </TabsList>

            {/* Content Tab */}
            <TabsContent value="content" className="flex-1 overflow-auto space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Scene Text</label>
                <Textarea
                  value={scene.text}
                  onChange={(e) => handleSceneUpdate({ text: e.target.value })}
                  className="min-h-[150px]"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Duration (seconds)</label>
                <Input
                  type="number"
                  value={scene.duration}
                  onChange={(e) => handleSceneUpdate({ duration: parseInt(e.target.value) || 5 })}
                  min={1}
                  max={30}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Keywords</label>
                <div className="flex flex-wrap gap-2">
                  {scene.keywords.map((keyword, idx) => (
                    <Badge key={idx} variant="secondary">
                      {keyword}
                    </Badge>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Layout Tab */}
            <TabsContent value="layout" className="flex-1 overflow-auto space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Layout Style</label>
                <Select
                  value={scene.layout.style}
                  onValueChange={(value: LayoutStyle) =>
                    handleSceneUpdate({ layout: { ...scene.layout, style: value } })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="horizontal-row">Horizontal Row</SelectItem>
                    <SelectItem value="vertical-stack">Vertical Stack</SelectItem>
                    <SelectItem value="grid-2x2">Grid 2×2</SelectItem>
                    <SelectItem value="grid-3x3">Grid 3×3</SelectItem>
                    <SelectItem value="centered-large">Centered Large</SelectItem>
                    <SelectItem value="side-by-side">Side by Side</SelectItem>
                    <SelectItem value="scattered">Scattered</SelectItem>
                    <SelectItem value="editorial">Editorial</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Illustration Size</label>
                <Select
                  value={scene.layout.illustrationSize}
                  onValueChange={(value: IllustrationSize) =>
                    handleSceneUpdate({ layout: { ...scene.layout, illustrationSize: value } })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">Small</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="large">Large</SelectItem>
                    <SelectItem value="extra-large">Extra Large</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Text Position</label>
                <Select
                  value={scene.layout.textPosition}
                  onValueChange={(value: TextPosition) =>
                    handleSceneUpdate({ layout: { ...scene.layout, textPosition: value } })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="overlay-bottom">Overlay Bottom</SelectItem>
                    <SelectItem value="overlay-top">Overlay Top</SelectItem>
                    <SelectItem value="top">Top</SelectItem>
                    <SelectItem value="bottom">Bottom</SelectItem>
                    <SelectItem value="left">Left</SelectItem>
                    <SelectItem value="right">Right</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Preview */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Preview</label>
                <div className="w-full aspect-video bg-muted rounded-lg overflow-hidden relative">
                  <IllustrationCanvas scene={scene} animate={false} />
                </div>
              </div>
            </TabsContent>

            {/* Animation Tab */}
            <TabsContent value="animation" className="flex-1 overflow-auto space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Animation Type</label>
                <Select
                  value={scene.animation}
                  onValueChange={(value: AnimationType) => handleSceneUpdate({ animation: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fade">Fade (Calm, Informational)</SelectItem>
                    <SelectItem value="slide">Slide (Sequential, Narrative)</SelectItem>
                    <SelectItem value="zoom">Zoom (Emphasis, Important)</SelectItem>
                    <SelectItem value="bounce">Bounce (Playful, Energetic)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Animation Preview */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Preview with Animation</label>
                <div className="w-full aspect-video bg-muted rounded-lg overflow-hidden relative">
                  <IllustrationCanvas scene={scene} animate={true} />
                </div>
              </div>
            </TabsContent>

            {/* Illustration Tab */}
            <TabsContent value="illustration" className="flex-1 overflow-auto space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Current Illustrations</label>
                <Button
                  onClick={handleAutoGenerateIllustrations}
                  variant="outline"
                  size="sm"
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  Auto Generate
                </Button>
              </div>

              {scene.illustrations.length === 0 ? (
                <div className="flex items-center justify-center py-12 border-2 border-dashed border-border rounded-lg">
                  <p className="text-muted-foreground">
                    No illustrations yet. Click "Auto Generate" or add them manually.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {scene.illustrations.map((illustration, index) => (
                    <div
                      key={illustration.id}
                      className="p-4 border border-border rounded-lg space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <Badge variant="outline">{illustration.keyword}</Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveIllustration(index)}
                          className="text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="flex items-center gap-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleChangeIllustrationIcon(index)}
                        >
                          Change Icon
                        </Button>
                        <span className="text-sm text-muted-foreground">
                          {illustration.library} • {illustration.iconName}
                        </span>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">Color</label>
                        <ColorPicker
                          value={illustration.color}
                          onChange={(color) => handleUpdateIllustrationColor(index, color)}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button onClick={onClose} variant="outline">
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Asset Store Dialog */}
      {editingIllustrationIndex !== null && (
        <AssetStore
          keyword={scene.illustrations[editingIllustrationIndex]?.keyword || ''}
          isOpen={assetStoreOpen}
          onSelect={handleIconSelect}
          onClose={() => {
            setAssetStoreOpen(false)
            setEditingIllustrationIndex(null)
          }}
        />
      )}
    </>
  )
}
