'use client'

import { type ReactNode, useRef } from 'react'
import { motion, useInView, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { cn } from '@/lib/utils'

export interface ParallaxProps {
  children: ReactNode
  className?: string
  /** Positive drifts slower than the page, negative drifts faster. */
  speed?: number
  /** Total travel in pixels across the element's full scroll pass. */
  distance?: number
  axis?: 'x' | 'y'
  /** Scale the element up slightly as it passes the viewport centre. */
  zoom?: boolean
}

/**
 * Scroll-linked drift, measured against the element's own pass through the
 * viewport rather than the page, so a layer behaves the same wherever it sits.
 *
 * `scrollYProgress` is transformed directly. Wrapping it in `useSpring` adds a
 * second smoothing pass on top of Lenis and forces Motion off the browser's
 * native scroll timeline — that combination is what makes parallax feel like it
 * is lagging behind the page.
 *
 * `will-change` is scoped to the in-view window: a promoted layer per parallax
 * element, held for the life of the page, is slower than none at all.
 */
export function Parallax({
  children,
  className,
  speed = 1,
  distance = 90,
  axis = 'y',
  zoom = false,
}: ParallaxProps) {
  const reduced = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { margin: '20% 0px 20% 0px' })

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  const travel = distance * speed
  const offset = useTransform(scrollYProgress, [0, 1], [travel, -travel])
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1, zoom ? 1.08 : 1, 1])

  if (reduced) {
    return (
      <div ref={ref} className={cn(className)}>
        {children}
      </div>
    )
  }

  return (
    <motion.div
      ref={ref}
      className={cn(className)}
      style={{
        ...(axis === 'y' ? { y: offset } : { x: offset }),
        scale,
        willChange: inView ? 'transform' : 'auto',
      }}
    >
      {children}
    </motion.div>
  )
}
