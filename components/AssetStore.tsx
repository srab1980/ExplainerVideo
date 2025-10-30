'use client'

import { useState, useMemo } from 'react'
import { Search, X } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { searchIcons, getIconComponent, LUCIDE_ICONS, HEROICONS } from '@/lib/icons'
import type { IconLibrary } from '@/types'

interface AssetStoreProps {
  keyword: string
  isOpen: boolean
  onSelect: (library: IconLibrary, iconName: string) => void
  onClose: () => void
}

export default function AssetStore({
  keyword,
  isOpen,
  onSelect,
  onClose,
}: AssetStoreProps) {
  const [searchQuery, setSearchQuery] = useState(keyword)
  const [activeTab, setActiveTab] = useState<IconLibrary>('lucide')

  // Search results
  const searchResults = useMemo(() => {
    return searchIcons(searchQuery)
  }, [searchQuery])

  const lucideResults = searchResults.filter((icon) => icon.library === 'lucide')
  const heroiconsResults = searchResults.filter((icon) => icon.library === 'heroicons')

  const handleIconSelect = (library: IconLibrary, iconName: string) => {
    onSelect(library, iconName)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Choose Illustration</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search icons..."
              className="pl-9"
            />
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as IconLibrary)}>
            <TabsList className="w-full">
              <TabsTrigger value="lucide" className="flex-1">
                <Badge variant="outline" className="mr-2 bg-blue-500/10 text-blue-600 border-blue-500/20">
                  Lucide
                </Badge>
                {lucideResults.length} icons
              </TabsTrigger>
              <TabsTrigger value="heroicons" className="flex-1">
                <Badge variant="outline" className="mr-2 bg-purple-500/10 text-purple-600 border-purple-500/20">
                  Heroicons
                </Badge>
                {heroiconsResults.length} icons
              </TabsTrigger>
            </TabsList>

            <TabsContent value="lucide" className="mt-4">
              <IconGrid
                icons={lucideResults}
                library="lucide"
                onSelect={handleIconSelect}
              />
            </TabsContent>

            <TabsContent value="heroicons" className="mt-4">
              <IconGrid
                icons={heroiconsResults}
                library="heroicons"
                onSelect={handleIconSelect}
              />
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  )
}

interface IconGridProps {
  icons: Array<{ name: string; library: IconLibrary }>
  library: IconLibrary
  onSelect: (library: IconLibrary, iconName: string) => void
}

function IconGrid({ icons, library, onSelect }: IconGridProps) {
  if (icons.length === 0) {
    return (
      <div className="flex items-center justify-center py-12 text-muted-foreground">
        No icons found. Try a different search term.
      </div>
    )
  }

  return (
    <ScrollArea className="h-[400px]">
      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2 p-2">
        {icons.map((icon) => {
          const IconComponent = getIconComponent(library, icon.name)

          return (
            <button
              key={icon.name}
              onClick={() => onSelect(library, icon.name)}
              className="flex flex-col items-center justify-center gap-2 p-3 rounded-lg hover:bg-muted transition-colors group"
            >
              <div className="w-8 h-8 flex items-center justify-center group-hover:scale-110 transition-transform">
                <IconComponent className="w-full h-full" />
              </div>
              <span className="text-[10px] text-muted-foreground text-center leading-tight">
                {icon.name}
              </span>
            </button>
          )
        })}
      </div>
    </ScrollArea>
  )
}
