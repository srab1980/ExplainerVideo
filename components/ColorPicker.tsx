'use client'

import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ColorPickerProps {
  value: string
  onChange: (color: string) => void
}

// Preset colors mapped to emotions/themes
const PRESET_COLORS = [
  { color: '#6b21a8', label: 'Creativity' }, // Deep Purple
  { color: '#0891b2', label: 'Calm' }, // Teal
  { color: '#f97316', label: 'Warm' }, // Coral/Orange
  { color: '#f59e0b', label: 'Energetic' }, // Amber
  { color: '#ef4444', label: 'Urgent' }, // Red
  { color: '#3b82f6', label: 'Trust' }, // Blue
  { color: '#10b981', label: 'Health' }, // Green
  { color: '#ec4899', label: 'Compassionate' }, // Pink
  { color: '#f97316', label: 'Friendly' }, // Orange
  { color: '#6b7280', label: 'Neutral' }, // Gray
  { color: '#1f2937', label: 'Strong' }, // Black/Dark Gray
  { color: '#eab308', label: 'Optimistic' }, // Yellow
]

export default function ColorPicker({ value, onChange }: ColorPickerProps) {
  return (
    <div className="space-y-3">
      {/* Preset palette */}
      <div className="grid grid-cols-6 gap-2">
        {PRESET_COLORS.map((preset) => (
          <button
            key={preset.color}
            onClick={() => onChange(preset.color)}
            className={cn(
              "relative w-10 h-10 rounded-full border-2 transition-all hover:scale-110",
              value.toLowerCase() === preset.color.toLowerCase()
                ? "border-foreground shadow-md scale-110"
                : "border-transparent"
            )}
            style={{ backgroundColor: preset.color }}
            title={preset.label}
          >
            {value.toLowerCase() === preset.color.toLowerCase() && (
              <Check className="absolute inset-0 m-auto h-5 w-5 text-white drop-shadow-md" />
            )}
          </button>
        ))}
      </div>

      {/* Custom color input */}
      <div className="flex items-center gap-2">
        <label htmlFor="custom-color" className="text-sm text-muted-foreground">
          Custom:
        </label>
        <input
          id="custom-color"
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-10 w-20 rounded-md border border-border cursor-pointer"
        />
        <span className="text-sm font-mono text-muted-foreground">
          {value.toUpperCase()}
        </span>
      </div>
    </div>
  )
}
