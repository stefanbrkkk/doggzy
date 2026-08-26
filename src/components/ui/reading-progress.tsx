'use client'

import { motion, useScroll, useSpring } from 'framer-motion'
import { spring } from '@/lib/motion'

/**
 * Article reading progress. Sits just under the header rather than at the very
 * top, so it does not stack with the site-wide scroll indicator.
 */
export function ReadingProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, spring.scroll)

  return (
    <motion.div
      aria-hidden="true"
      data-decor
      className="pointer-events-none fixed inset-x-0 top-0 z-[65] h-0.5 origin-left bg-brand/70"
      style={{ scaleX }}
    />
  )
}
