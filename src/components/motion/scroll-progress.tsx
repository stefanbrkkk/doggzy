'use client'

import { motion, useScroll, useSpring } from 'framer-motion'
import { spring } from '@/lib/motion'

/**
 * The site-wide reading-progress hairline, pinned to the very top of the
 * viewport above the header. Uses scaleX on a fixed element, so it never
 * triggers layout while scrolling. Story pages rely on this one too — a second
 * bar at the same origin only stacks into a two-tone line.
 */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, spring.scroll)

  return (
    <motion.div
      aria-hidden="true"
      data-decor
      className="pointer-events-none fixed inset-x-0 top-0 z-[70] h-px origin-left bg-linear-to-r from-brand via-[var(--gradient-3)] to-[var(--gradient-4)]"
      style={{ scaleX }}
    />
  )
}
