'use client'

import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { duration, ease, viewportOnce } from '@/lib/motion'
import { useReducedMotionSafe } from '@/lib/use-reduced-motion-safe'

export interface LineRevealProps {
  children: ReactNode
  className?: string
  delay?: number
  /** See <SplitText>: `view` on scroll, `mount` straight away, `hold` stays masked. */
  trigger?: 'view' | 'mount' | 'hold'
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
export function LineReveal({ children, className, delay = 0, trigger = 'view' }: LineRevealProps) {
  const reduced = useReducedMotionSafe()

  if (reduced) {
    return <span className={cn('block', className)}>{children}</span>
  }

  const animationProps =
    trigger === 'view'
      ? { whileInView: { y: '0%' }, viewport: viewportOnce }
      : { animate: { y: trigger === 'mount' ? '0%' : '112%' } }

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
