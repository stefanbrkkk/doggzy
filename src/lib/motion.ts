import { stagger as staggerDelay } from 'framer-motion'
import type { Transition, Variants } from 'framer-motion'

/**
 * The site's motion vocabulary. Components never hand-tune a duration or a
 * cubic-bezier — they pick a token from here, so everything on the page
 * decelerates with the same physical character.
 */

type Bezier = [number, number, number, number]

export const ease = {
  /** Long, luxurious deceleration. The house easing for entrances. */
  outExpo: [0.16, 1, 0.3, 1] as Bezier,
  outQuart: [0.25, 1, 0.5, 1] as Bezier,
  inOutQuart: [0.76, 0, 0.24, 1] as Bezier,
  swift: [0.4, 0, 0.2, 1] as Bezier,
  /** Slight overshoot. Only for things that should feel physical (chips, toggles). */
  backOut: [0.34, 1.56, 0.64, 1] as Bezier,
} as const

export const duration = {
  instant: 0.12,
  fast: 0.24,
  base: 0.42,
  slow: 0.72,
  epic: 1.15,
} as const

export const spring = {
  /** Cursor followers and magnetic pulls: fast, barely any wobble. */
  pointer: { type: 'spring', stiffness: 380, damping: 34, mass: 0.6 },
  /** UI surfaces entering: settles in ~450ms with a hint of life. */
  surface: { type: 'spring', stiffness: 240, damping: 28, mass: 0.9 },
  /** Drawers and sheets: heavier, more deliberate. */
  sheet: { type: 'spring', stiffness: 300, damping: 34, mass: 1.1 },
  /** Scroll-linked smoothing. Overdamped so it never oscillates on scroll. */
  scroll: { stiffness: 120, damping: 30, restDelta: 0.001 },
  /** Bouncy affordances: hearts, badges, counters. */
  pop: { type: 'spring', stiffness: 520, damping: 20, mass: 0.7 },
} as const satisfies Record<string, Transition | Record<string, number>>

export const transition = {
  base: { duration: duration.base, ease: ease.outExpo },
  fast: { duration: duration.fast, ease: ease.swift },
  slow: { duration: duration.slow, ease: ease.outExpo },
} as const satisfies Record<string, Transition>

/** Default viewport config: fire once, slightly before the element is centred. */
export const viewportOnce = { once: true, margin: '0px 0px -12% 0px' } as const

/**
 * Vertical rise used by nearly every section. `distance` is in pixels so the
 * travel stays constant across breakpoints instead of scaling with the box.
 */
export function rise(distance = 28, delay = 0): Variants {
  return {
    hidden: { opacity: 0, y: distance },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: duration.slow, ease: ease.outExpo, delay },
    },
  }
}

export function fade(delay = 0): Variants {
  return {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: duration.slow, ease: ease.outQuart, delay } },
  }
}

export function scaleIn(from = 0.94, delay = 0): Variants {
  return {
    hidden: { opacity: 0, scale: from },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: duration.slow, ease: ease.outExpo, delay },
    },
  }
}

/**
 * Parent variant that cascades its children. Pair with `rise()` on each child.
 *
 * Uses `delayChildren: stagger(...)` rather than the older `staggerChildren`
 * number, which Motion deprecated in 12.22 — and which cannot express a
 * starting point other than the first child.
 */
export function stagger(
  each = 0.07,
  startDelay = 0,
  from: 'first' | 'last' | 'center' = 'first',
): Variants {
  return {
    hidden: {},
    visible: {
      transition: { delayChildren: staggerDelay(each, { startDelay, from }) },
    },
  }
}

/** Character/word reveal used by <SplitText>. Clipped by an overflow-hidden parent. */
export const glyphRise: Variants = {
  hidden: { y: '110%', opacity: 0 },
  visible: {
    y: '0%',
    opacity: 1,
    transition: { duration: duration.epic, ease: ease.outExpo },
  },
}

/** Cross-fade + slide used by step machines (the phone flow, checkout, filters). */
export function slideStep(direction: 1 | -1): Variants {
  return {
    enter: { opacity: 0, x: 28 * direction, filter: 'blur(6px)' },
    center: {
      opacity: 1,
      x: 0,
      filter: 'blur(0px)',
      transition: { duration: duration.base, ease: ease.outExpo },
    },
    exit: {
      opacity: 0,
      x: -28 * direction,
      filter: 'blur(6px)',
      transition: { duration: duration.fast, ease: ease.swift },
    },
  }
}
