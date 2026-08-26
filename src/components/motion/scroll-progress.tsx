'use client'

import { motion, useScroll, useSpring } from 'framer-motion'
import { spring } from '@/lib/motion'

/**
 * A hairline reading-progress bar pinned under the header. Uses scaleX on a
 * fixed element, so it never triggers layout while scrolling.
 */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, spring.scroll)

  return (
    <motion.div
      aria-hidden="true"
      data-decor
      className="pointer-events-none fixed inset-x-0 top-0 z-[70] h-px origin-left bg-linear-to-r from-brand via-iris-400 to-signal-400"
      style={{ scaleX }}
    />
  )
}
