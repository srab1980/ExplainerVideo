'use client'

import { Check, Loader2, AlertCircle } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import useProjectStore from '@/store/useProjectStore'

export default function AutoSaveIndicator() {
  const { autoSaveStatus } = useProjectStore()

  if (autoSaveStatus === 'idle') {
    return null
  }

  const variants = {
    saving: {
      icon: <Loader2 className="h-3 w-3 animate-spin" />,
      text: 'Saving...',
      className: 'bg-amber/20 text-amber-foreground border-amber',
    },
    saved: {
      icon: <Check className="h-3 w-3" />,
      text: 'Saved',
      className: 'bg-green-500/20 text-green-600 border-green-500/30',
    },
    error: {
      icon: <AlertCircle className="h-3 w-3" />,
      text: 'Save failed',
      className: 'bg-destructive/20 text-destructive border-destructive/30',
    },
  }

  const variant = variants[autoSaveStatus]

  return (
    <Badge variant="outline" className={`flex items-center gap-1.5 ${variant.className}`}>
      {variant.icon}
      <span className="text-xs">{variant.text}</span>
    </Badge>
  )
}
