/**
 * Motion Tokens for Consistent Animations
 * 
 * This file contains standardized animation tokens that align with our
 * minimal design system. All animations should use these tokens for consistency.
 */

export const motionTokens = {
  // Duration tokens
  duration: {
    instant: 0,
    fast: 150,
    normal: 300,
    slow: 500,
  },

  // Easing functions
  easing: {
    linear: 'linear',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  },

  // Common animation variants for Framer Motion
  variants: {
    // Fade animations
    fadeIn: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
    },

    // Slide animations
    slideUp: {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -20 },
    },

    slideDown: {
      initial: { opacity: 0, y: -20 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: 20 },
    },

    slideInLeft: {
      initial: { opacity: 0, x: -20 },
      animate: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: -20 },
    },

    slideInRight: {
      initial: { opacity: 0, x: 20 },
      animate: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: 20 },
    },

    // Scale animations
    scaleIn: {
      initial: { opacity: 0, scale: 0.95 },
      animate: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 0.95 },
    },

    // Stagger container for lists
    staggerContainer: {
      animate: {
        transition: {
          staggerChildren: 0.1,
        },
      },
    },

    // Stagger item for list items
    staggerItem: {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
    },
  },

  // Hover effects
  hover: {
    lift: {
      y: -2,
      transition: { duration: 0.15, ease: 'easeOut' },
    },

    liftMore: {
      y: -5,
      transition: { duration: 0.15, ease: 'easeOut' },
    },

    scale: {
      scale: 1.02,
      transition: { duration: 0.15, ease: 'easeOut' },
    },

    glow: {
      boxShadow: '0 0 20px hsl(var(--neon-primary-glow))',
      transition: { duration: 0.3, ease: 'easeOut' },
    },
  },

  // Tap/active effects
  tap: {
    scale: {
      scale: 0.98,
      transition: { duration: 0.1, ease: 'easeOut' },
    },
  },

  // Page transitions
  pageTransition: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: {
      duration: 0.3,
      ease: 'easeOut',
    },
  },

  // Reduced motion variants (for accessibility)
  reducedMotion: {
    fadeIn: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
    },

    slideUp: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
    },

    slideDown: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
    },

    scaleIn: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
    },
  },
}

// Transition presets
export const transitions = {
  fast: {
    duration: motionTokens.duration.fast / 1000,
    ease: motionTokens.easing.easeOut,
  },

  normal: {
    duration: motionTokens.duration.normal / 1000,
    ease: motionTokens.easing.easeOut,
  },

  slow: {
    duration: motionTokens.duration.slow / 1000,
    ease: motionTokens.easing.easeOut,
  },

  bounce: {
    duration: motionTokens.duration.normal / 1000,
    ease: motionTokens.easing.bounce,
  },
}

// Spring configurations
export const springs = {
  gentle: {
    type: 'spring',
    stiffness: 100,
    damping: 15,
  },

  bouncy: {
    type: 'spring',
    stiffness: 200,
    damping: 10,
  },

  stiff: {
    type: 'spring',
    stiffness: 300,
    damping: 20,
  },
}

// Utility function to get motion variants based on reduced motion preference
export const getMotionVariants = (prefersReducedMotion: boolean) => {
  return prefersReducedMotion ? motionTokens.reducedMotion : motionTokens.variants
}

// Hook to check for reduced motion preference
export const useReducedMotion = () => {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

// Utility function for consistent stagger animations
export const createStaggerVariants = (staggerDelay: number = 0.1) => ({
  container: {
    animate: {
      transition: {
        staggerChildren: staggerDelay,
      },
    },
  },
  item: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
  },
})

// Common animation combinations
export const animations = {
  // Subtle entrance for cards
  cardEntrance: {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: transitions.normal,
  },

  // Button press feedback
  buttonPress: {
    whileHover: motionTokens.hover.lift,
    whileTap: motionTokens.tap.scale,
  },

  // Floating animation for background elements
  float: {
    y: [0, -10, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },

  // Pulse animation for important elements
  pulse: {
    scale: [1, 1.05, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },

  // Glow pulse for neon effects
  glowPulse: {
    boxShadow: [
      '0 0 20px hsl(var(--neon-primary-dim))',
      '0 0 40px hsl(var(--neon-primary-glow))',
      '0 0 20px hsl(var(--neon-primary-dim))',
    ],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
}