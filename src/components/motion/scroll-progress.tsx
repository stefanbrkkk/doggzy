'use client'

import { motion, useScroll, useSpring } from 'framer-motion'
import { spring } from '@/lib/motion'
import { useReducedMotionSafe } from '@/lib/use-reduced-motion-safe'

/**
 * The site-wide reading-progress hairline, pinned to the very top of the
 * viewport above the header. Uses scaleX on a fixed element, so it never
 * triggers layout while scrolling. Story pages rely on this one too — a second
 * bar at the same origin only stacks into a two-tone line.
 *
 * `MotionConfig reducedMotion="user"` governs transitions, not MotionValue
 * springs, so the smoothing here is invisible to it: measured, the bar went on
 * easing for ~1.5s after the scroll had stopped, for a visitor who asked for no
 * motion. Both values are subscribed unconditionally — hooks cannot be
 * conditional — and the raw progress is used when the smoothing is unwanted,
 * which tracks the scroll 1:1 with no tail.
 */
export function ScrollProgress() {
  const reduced = useReducedMotionSafe()
  const { scrollYProgress } = useScroll()
  const smoothed = useSpring(scrollYProgress, spring.scroll)

  return (
    <motion.div
      aria-hidden="true"
      data-decor
      className="pointer-events-none fixed inset-x-0 top-0 z-[70] h-px origin-left bg-linear-to-r from-brand via-[var(--gradient-3)] to-[var(--gradient-4)]"
      style={{ scaleX: reduced ? scrollYProgress : smoothed }}
    />
  )
}
