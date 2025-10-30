import type { AnimationType } from '@/types'

// Framer Motion animation variants for each animation type

export const FADE_ANIMATION = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: 'easeInOut',
    },
  },
}

export const SLIDE_ANIMATION = {
  hidden: { opacity: 0, x: -50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.7,
      ease: 'easeOut',
    },
  },
}

export const ZOOM_ANIMATION = {
  hidden: { opacity: 0, scale: 0.5 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 20,
    },
  },
}

export const BOUNCE_ANIMATION = {
  hidden: { opacity: 0, y: -100 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 200,
      damping: 15,
    },
  },
}

// Get animation variants by type
export function getAnimationVariants(type: AnimationType) {
  switch (type) {
    case 'fade':
      return FADE_ANIMATION
    case 'slide':
      return SLIDE_ANIMATION
    case 'zoom':
      return ZOOM_ANIMATION
    case 'bounce':
      return BOUNCE_ANIMATION
    default:
      return FADE_ANIMATION
  }
}

// Stagger delay for multiple illustrations
export function getStaggerDelay(animationType: AnimationType, index: number): number {
  const delays = {
    fade: 0.1,
    slide: 0.15,
    zoom: 0.1,
    bounce: 0.12,
  }

  return delays[animationType] * index
}

// Container animation for wrapping multiple animated items
export const CONTAINER_ANIMATION = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
}
