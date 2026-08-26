'use client'

import { type ReactNode, useCallback, useEffect, useRef } from 'react'
import { motion, useMotionTemplate, useMotionValue, useSpring } from 'framer-motion'
import { cn } from '@/lib/utils'
import { spring } from '@/lib/motion'

export interface SpotlightProps {
  children: ReactNode
  className?: string
  /** Radius of the light pool, in pixels. */
  size?: number
  /** Any CSS color; defaults to the brand tone. */
  color?: string
}

/**
 * Wraps content in a border that lights up under the pointer. Purely
 * decorative: the highlight layer is aria-hidden and pointer-events-none, and
 * it stays invisible until the pointer is actually over the element.
 */
export function Spotlight({
  children,
  className,
  size = 380,
  color = 'oklch(0.752 0.176 58 / 0.16)',
}: SpotlightProps) {
  const ref = useRef<HTMLDivElement>(null)
  // Measured once per hover, like TiltCard and Magnetic. Reading a rect inside
  // `pointermove` forces a synchronous layout mid-gesture, and this component
  // is writing style through motion values on the very same frames.
  const rect = useRef<DOMRect | null>(null)
  const x = useMotionValue(-9999)
  const y = useMotionValue(-9999)
  const opacity = useSpring(useMotionValue(0), spring.pointer)

  const background = useMotionTemplate`radial-gradient(${size}px circle at ${x}px ${y}px, ${color}, transparent 72%)`

  const handleEnter = useCallback(() => {
    rect.current = ref.current?.getBoundingClientRect() ?? null
    opacity.set(1)
  }, [opacity])

  const handleLeave = useCallback(() => {
    rect.current = null
    opacity.set(0)
  }, [opacity])

  // Scrolling with the pointer held still fires neither enter nor leave, so a
  // rect cached on enter goes stale by exactly the scroll distance and the
  // light pool detaches from the cursor. Magnetic already invalidates on these.
  useEffect(() => {
    const invalidate = () => {
      rect.current = null
    }
    window.addEventListener('scroll', invalidate, { passive: true })
    window.addEventListener('resize', invalidate)
    return () => {
      window.removeEventListener('scroll', invalidate)
      window.removeEventListener('resize', invalidate)
    }
  }, [])

  const handleMove = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      // A pointer can enter without `pointerenter` firing first — the element
      // scrolling under a stationary cursor is the common case.
      const box = (rect.current ??= ref.current?.getBoundingClientRect() ?? null)
      if (!box) return
      x.set(event.clientX - box.left)
      y.set(event.clientY - box.top)
    },
    [x, y],
  )

  return (
    <div
      ref={ref}
      className={cn('group/spotlight relative isolate', className)}
      onPointerMove={handleMove}
      onPointerEnter={handleEnter}
      onPointerLeave={handleLeave}
    >
      <motion.span
        aria-hidden="true"
        data-decor
        className="pointer-events-none absolute inset-0 -z-10 rounded-[inherit]"
        style={{ background, opacity }}
      />
      {children}
    </div>
  )
}
