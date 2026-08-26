'use client'

import { type ReactNode, useCallback, useEffect, useRef } from 'react'
import { frame, motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion'
import { cn } from '@/lib/utils'
import { spring } from '@/lib/motion'

export interface MagneticProps {
  children: ReactNode
  className?: string
  /** How far the element travels toward the pointer, in pixels. */
  strength?: number
  /** Extra distance beyond the element's own box that still attracts, in pixels. */
  radius?: number
}

/**
 * Pulls its child toward the pointer, then springs it home.
 *
 * The listener is on the window, not the element: attraction has to begin
 * *before* the pointer arrives, and an element-scoped `pointermove` only fires
 * once the pointer is already inside — which makes `radius` meaningless.
 *
 * The bounding box is measured once per scroll/resize and cached, rather than
 * on every pointer event, so tracking the cursor never forces a layout flush.
 * Lenis animates real `scrollY`, so a scroll listener is the correct
 * invalidation signal.
 */
export function Magnetic({ children, className, strength = 18, radius = 90 }: MagneticProps) {
  const reduced = useReducedMotion()
  const ref = useRef<HTMLSpanElement>(null)
  const box = useRef<DOMRect | null>(null)

  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, spring.pointer)
  const springY = useSpring(y, spring.pointer)

  const measure = useCallback(() => {
    box.current = ref.current?.getBoundingClientRect() ?? null
  }, [])

  useEffect(() => {
    if (reduced) return
    // Hover-capable pointers only: on touch there is nothing to attract toward,
    // and a stray move would leave the element stranded off-centre.
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return

    measure()

    const onMove = (event: PointerEvent) => {
      frame.read(() => {
        if (!box.current) measure()
        const rect = box.current
        if (!rect) return

        const centerX = rect.left + rect.width / 2
        const centerY = rect.top + rect.height / 2
        const reach = Math.max(rect.width, rect.height) / 2 + radius

        const dx = event.clientX - centerX
        const dy = event.clientY - centerY
        const distance = Math.hypot(dx, dy)

        if (distance > reach) {
          x.set(0)
          y.set(0)
          return
        }

        // Falls off with distance, so the pull eases in as the pointer nears.
        const falloff = 1 - distance / reach
        x.set((dx / reach) * strength * falloff * 2)
        y.set((dy / reach) * strength * falloff * 2)
      })
    }

    const invalidate = () => {
      box.current = null
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('scroll', invalidate, { passive: true })
    window.addEventListener('resize', invalidate)

    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('scroll', invalidate)
      window.removeEventListener('resize', invalidate)
    }
  }, [measure, radius, reduced, strength, x, y])

  return (
    <motion.span
      ref={ref}
      className={cn('inline-flex', className)}
      style={reduced ? undefined : { x: springX, y: springY }}
    >
      {children}
    </motion.span>
  )
}
