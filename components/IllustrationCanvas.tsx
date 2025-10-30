'use client'

import { motion } from 'framer-motion'
import { getIconComponent } from '@/lib/icons'
import { calculateIllustrationPositions, getIconSize } from '@/lib/layout'
import { getAnimationVariants, getStaggerDelay } from '@/lib/animations'
import type { Scene } from '@/types'

interface IllustrationCanvasProps {
  scene: Scene
  animate?: boolean
  width?: number
  height?: number
}

export default function IllustrationCanvas({
  scene,
  animate = true,
  width = 1600,
  height = 900,
}: IllustrationCanvasProps) {
  // Calculate positions for all illustrations
  const positionedIllustrations = calculateIllustrationPositions(
    scene.layout,
    scene.illustrations,
    width,
    height
  )

  // Get animation variants
  const animationVariants = getAnimationVariants(scene.animation)

  if (positionedIllustrations.length === 0) {
    return null
  }

  return (
    <div className="relative w-full h-full">
      {positionedIllustrations.map((illustration, index) => {
        const IconComponent = getIconComponent(
          illustration.library,
          illustration.iconName
        )
        const iconSize = getIconSize(illustration.size)

        // Calculate dimensions with aspect ratio
        const width = iconSize * illustration.aspectRatio
        const height = iconSize

        const style = {
          position: 'absolute' as const,
          left: `${(illustration.position.x / 1600) * 100}%`,
          top: `${(illustration.position.y / 900) * 100}%`,
          transform: `translate(-50%, -50%) rotate(${illustration.rotation}deg)`,
          color: illustration.color,
          width: `${width}px`,
          height: `${height}px`,
        }

        if (animate) {
          return (
            <motion.div
              key={illustration.id}
              style={style}
              variants={animationVariants}
              initial="hidden"
              animate="visible"
              transition={{
                ...animationVariants.visible.transition,
                delay: getStaggerDelay(scene.animation, index),
              }}
            >
              <IconComponent className="w-full h-full" />
            </motion.div>
          )
        }

        return (
          <div key={illustration.id} style={style}>
            <IconComponent className="w-full h-full" />
          </div>
        )
      })}
    </div>
  )
}
