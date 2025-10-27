import type { LayoutConfig, Illustration, LayoutStyle } from '@/types'

// Canvas dimensions (16:9 aspect ratio)
const CANVAS_WIDTH = 1600
const CANVAS_HEIGHT = 900

// Size multipliers
const SIZE_MULTIPLIERS = {
  'small': 0.6,
  'medium': 1.0,
  'large': 1.5,
  'extra-large': 2.0,
}

// Calculate illustration positions based on layout style
export function calculateIllustrationPositions(
  layout: LayoutConfig,
  illustrations: Illustration[],
  canvasWidth: number = CANVAS_WIDTH,
  canvasHeight: number = CANVAS_HEIGHT
): Illustration[] {
  if (illustrations.length === 0) return []

  const style = layout.style
  const count = illustrations.length

  switch (style) {
    case 'horizontal-row':
      return layoutHorizontalRow(illustrations, canvasWidth, canvasHeight)
    case 'vertical-stack':
      return layoutVerticalStack(illustrations, canvasWidth, canvasHeight)
    case 'grid-2x2':
      return layoutGrid(illustrations, 2, canvasWidth, canvasHeight)
    case 'grid-3x3':
      return layoutGrid(illustrations, 3, canvasWidth, canvasHeight)
    case 'centered-large':
      return layoutCentered(illustrations, canvasWidth, canvasHeight)
    case 'side-by-side':
      return layoutSideBySide(illustrations, canvasWidth, canvasHeight)
    case 'scattered':
      return layoutScattered(illustrations, canvasWidth, canvasHeight)
    case 'editorial':
      return layoutEditorial(illustrations, canvasWidth, canvasHeight)
    default:
      return layoutHorizontalRow(illustrations, canvasWidth, canvasHeight)
  }
}

function layoutHorizontalRow(
  illustrations: Illustration[],
  canvasWidth: number,
  canvasHeight: number
): Illustration[] {
  const padding = canvasWidth * 0.1
  const gap = canvasWidth * 0.05
  const availableWidth = canvasWidth - padding * 2 - gap * (illustrations.length - 1)
  const itemWidth = availableWidth / illustrations.length

  return illustrations.map((ill, index) => ({
    ...ill,
    position: {
      x: padding + index * (itemWidth + gap),
      y: canvasHeight / 2,
    },
  }))
}

function layoutVerticalStack(
  illustrations: Illustration[],
  canvasWidth: number,
  canvasHeight: number
): Illustration[] {
  const padding = canvasHeight * 0.15
  const gap = canvasHeight * 0.08
  const availableHeight = canvasHeight - padding * 2 - gap * (illustrations.length - 1)
  const itemHeight = availableHeight / illustrations.length

  return illustrations.map((ill, index) => ({
    ...ill,
    position: {
      x: canvasWidth / 2,
      y: padding + index * (itemHeight + gap),
    },
  }))
}

function layoutGrid(
  illustrations: Illustration[],
  columns: number,
  canvasWidth: number,
  canvasHeight: number
): Illustration[] {
  const padding = canvasWidth * 0.1
  const gap = canvasWidth * 0.05
  const cellWidth = (canvasWidth - padding * 2 - gap * (columns - 1)) / columns
  const cellHeight = (canvasHeight - padding * 2 - gap * (columns - 1)) / columns

  return illustrations.map((ill, index) => {
    const col = index % columns
    const row = Math.floor(index / columns)

    return {
      ...ill,
      position: {
        x: padding + col * (cellWidth + gap) + cellWidth / 2,
        y: padding + row * (cellHeight + gap) + cellHeight / 2,
      },
    }
  })
}

function layoutCentered(
  illustrations: Illustration[],
  canvasWidth: number,
  canvasHeight: number
): Illustration[] {
  return illustrations.map((ill) => ({
    ...ill,
    position: {
      x: canvasWidth / 2,
      y: canvasHeight / 2,
    },
  }))
}

function layoutSideBySide(
  illustrations: Illustration[],
  canvasWidth: number,
  canvasHeight: number
): Illustration[] {
  const padding = canvasWidth * 0.1
  const gap = canvasWidth * 0.1

  if (illustrations.length === 1) {
    return layoutCentered(illustrations, canvasWidth, canvasHeight)
  }

  if (illustrations.length === 2) {
    return [
      {
        ...illustrations[0],
        position: {
          x: canvasWidth / 4,
          y: canvasHeight / 2,
        },
      },
      {
        ...illustrations[1],
        position: {
          x: (canvasWidth * 3) / 4,
          y: canvasHeight / 2,
        },
      },
    ]
  }

  // More than 2: split left/right
  const leftCount = Math.ceil(illustrations.length / 2)
  const left = illustrations.slice(0, leftCount)
  const right = illustrations.slice(leftCount)

  return [
    ...layoutVerticalStack(left, canvasWidth / 2, canvasHeight).map((ill) => ({
      ...ill,
      position: {
        x: ill.position.x / 2,
        y: ill.position.y,
      },
    })),
    ...layoutVerticalStack(right, canvasWidth / 2, canvasHeight).map((ill) => ({
      ...ill,
      position: {
        x: canvasWidth / 2 + ill.position.x / 2,
        y: ill.position.y,
      },
    })),
  ]
}

function layoutScattered(
  illustrations: Illustration[],
  canvasWidth: number,
  canvasHeight: number
): Illustration[] {
  const padding = 0.15
  const minDistance = 100

  return illustrations.map((ill, index) => {
    // Use saved random positions if they exist
    if (ill.position.x !== 0 || ill.position.y !== 0) {
      return ill
    }

    // Generate new random positions with collision avoidance
    let x, y
    let attempts = 0
    const maxAttempts = 50

    do {
      x = padding * canvasWidth + Math.random() * (canvasWidth * (1 - 2 * padding))
      y = padding * canvasHeight + Math.random() * (canvasHeight * (1 - 2 * padding))
      attempts++
    } while (
      attempts < maxAttempts &&
      illustrations.slice(0, index).some((other) => {
        const dx = x - other.position.x
        const dy = y - other.position.y
        return Math.sqrt(dx * dx + dy * dy) < minDistance
      })
    )

    return {
      ...ill,
      position: { x, y },
    }
  })
}

function layoutEditorial(
  illustrations: Illustration[],
  canvasWidth: number,
  canvasHeight: number
): Illustration[] {
  if (illustrations.length === 0) return []

  const padding = canvasWidth * 0.08
  const gap = canvasWidth * 0.06

  if (illustrations.length === 1) {
    return layoutCentered(illustrations, canvasWidth, canvasHeight)
  }

  // First illustration is large on the left (60% width)
  const focal = {
    ...illustrations[0],
    position: {
      x: canvasWidth * 0.3,
      y: canvasHeight / 2,
    },
  }

  // Others stack vertically on the right
  const others = illustrations.slice(1)
  const rightX = canvasWidth * 0.75
  const stackHeight = canvasHeight - padding * 2
  const itemHeight = stackHeight / others.length
  const itemGap = gap / 2

  const stacked = others.map((ill, index) => ({
    ...ill,
    position: {
      x: rightX,
      y: padding + index * itemHeight + itemHeight / 2,
    },
  }))

  return [focal, ...stacked]
}

// Get icon size in pixels based on size setting
export function getIconSize(size: 'small' | 'medium' | 'large' | 'extra-large'): number {
  const baseSize = 64
  return baseSize * SIZE_MULTIPLIERS[size]
}
