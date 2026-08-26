'use client'

import { type ReactNode, useCallback, useRef } from 'react'
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
  const x = useMotionValue(-9999)
  const y = useMotionValue(-9999)
  const opacity = useSpring(useMotionValue(0), spring.pointer)

  const background = useMotionTemplate`radial-gradient(${size}px circle at ${x}px ${y}px, ${color}, transparent 72%)`

  const handleMove = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      const element = ref.current
      if (!element) return
      const rect = element.getBoundingClientRect()
      x.set(event.clientX - rect.left)
      y.set(event.clientY - rect.top)
    },
    [x, y],
  )

  return (
    <div
      ref={ref}
      className={cn('group/spotlight relative isolate', className)}
      onPointerMove={handleMove}
      onPointerEnter={() => opacity.set(1)}
      onPointerLeave={() => opacity.set(0)}
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
