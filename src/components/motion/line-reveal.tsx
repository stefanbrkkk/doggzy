'use client'

import type { ReactNode } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { duration, ease, viewportOnce } from '@/lib/motion'

export interface LineRevealProps {
  children: ReactNode
  className?: string
  delay?: number
  /** Reveal on mount instead of waiting for the viewport. */
  immediate?: boolean
}

/**
 * Lifts a whole line out from behind a mask.
 *
 * Unlike <SplitText>, the text stays in a single element. That matters for
 * gradient type: `background-clip: text` is clipped to the box that owns the
 * background, and per-glyph wrappers with their own transforms break it — the
 * text renders transparent over nothing and disappears. Anything using
 * `text-gradient` should reveal with this instead.
 */
export function LineReveal({ children, className, delay = 0, immediate = false }: LineRevealProps) {
  const reduced = useReducedMotion()

  if (reduced) {
    return <span className={cn('block', className)}>{children}</span>
  }

  const animationProps = immediate
    ? { animate: { y: '0%' } }
    : { whileInView: { y: '0%' }, viewport: viewportOnce }

  return (
    <span className="block overflow-hidden [clip-path:inset(-0.3em_-0.2em_-0.2em)]">
      <motion.span
        className={cn('block', className)}
        initial={{ y: '112%' }}
        transition={{ duration: duration.epic, ease: ease.outExpo, delay }}
        {...animationProps}
      >
        {children}
      </motion.span>
    </span>
  )
}
