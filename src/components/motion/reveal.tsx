'use client'

import { type ReactNode } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { duration, ease, viewportOnce } from '@/lib/motion'

type Direction = 'up' | 'down' | 'left' | 'right' | 'none'

const OFFSET: Record<Direction, { x: number; y: number }> = {
  up: { x: 0, y: 32 },
  down: { x: 0, y: -32 },
  left: { x: 40, y: 0 },
  right: { x: -40, y: 0 },
  none: { x: 0, y: 0 },
}

export interface RevealProps {
  children: ReactNode
  className?: string
  /** Which way the element travels in from. */
  direction?: Direction
  delay?: number
  /** Multiplier on the travel distance, for tighter or looser reveals. */
  amount?: number
  blur?: boolean
}

/**
 * The workhorse scroll reveal. Honours `prefers-reduced-motion` by falling back
 * to a plain opacity fade rather than removing the transition entirely, so the
 * page still reads as progressive rather than snapping into place.
 */
export function Reveal({
  children,
  className,
  direction = 'up',
  delay = 0,
  amount = 1,
  blur = false,
}: RevealProps) {
  const reduced = useReducedMotion()
  const offset = OFFSET[direction]

  const hidden = reduced
    ? { opacity: 0 }
    : {
        opacity: 0,
        x: offset.x * amount,
        y: offset.y * amount,
        ...(blur ? { filter: 'blur(10px)' } : {}),
      }

  const visible = reduced
    ? { opacity: 1 }
    : { opacity: 1, x: 0, y: 0, ...(blur ? { filter: 'blur(0px)' } : {}) }

  return (
    <motion.div
      className={cn(className)}
      initial={hidden}
      whileInView={visible}
      viewport={viewportOnce}
      transition={{ duration: duration.slow, ease: ease.outExpo, delay }}
    >
      {children}
    </motion.div>
  )
}
