'use client'

import { type ReactNode, useCallback, useRef, useState } from 'react'
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from 'framer-motion'
import { cn } from '@/lib/utils'
import { spring } from '@/lib/motion'

export interface TiltCardProps {
  children: ReactNode
  className?: string
  /** Maximum rotation on each axis, in degrees. */
  max?: number
  /** Lift toward the viewer on hover, in pixels. */
  lift?: number
  /** Draw a specular highlight that tracks the pointer. */
  glare?: boolean
  /** Perspective distance; smaller values exaggerate the 3D effect. */
  perspective?: number
}

/**
 * A card that rotates in 3D toward the pointer, with an optional specular
 * sweep. Rotation is driven by springs so the card keeps moving for a beat
 * after the pointer stops, which is what makes it read as physical.
 *
 * Perspective is set with Motion's `transformPerspective` on the animated
 * element itself. A wrapper carrying `perspective` cannot work here: the
 * natural wrapper is `display: contents`, which generates no box, so the
 * property is dropped and the rotation flattens into a 2D skew.
 */
export function TiltCard({
  children,
  className,
  max = 9,
  lift = 14,
  glare = true,
  perspective = 900,
}: TiltCardProps) {
  const reduced = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const rect = useRef<DOMRect | null>(null)
  const [hovered, setHovered] = useState(false)

  const rotateX = useSpring(useMotionValue(0), spring.pointer)
  const rotateY = useSpring(useMotionValue(0), spring.pointer)
  const glareX = useMotionValue(50)
  const glareY = useMotionValue(50)
  const glareOpacity = useSpring(useMotionValue(0), spring.pointer)

  const glareBackground = useMotionTemplate`radial-gradient(circle at ${glareX}% ${glareY}%, oklch(1 0 0 / 0.22), transparent 55%)`

  const handleEnter = useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== 'mouse') return
    // Measured once per hover rather than per move: reading a rect mid-gesture
    // forces a synchronous layout on every pointer event.
    rect.current = ref.current?.getBoundingClientRect() ?? null
    setHovered(true)
  }, [])

  const handleMove = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (event.pointerType !== 'mouse') return
      const box = rect.current
      if (!box) return

      const px = (event.clientX - box.left) / box.width
      const py = (event.clientY - box.top) / box.height

      rotateY.set((px - 0.5) * 2 * max)
      rotateX.set((0.5 - py) * 2 * max)
      glareX.set(px * 100)
      glareY.set(py * 100)
      glareOpacity.set(1)
    },
    [glareOpacity, glareX, glareY, max, rotateX, rotateY],
  )

  const handleLeave = useCallback(() => {
    setHovered(false)
    rect.current = null
    rotateX.set(0)
    rotateY.set(0)
    glareOpacity.set(0)
  }, [glareOpacity, rotateX, rotateY])

  if (reduced) {
    return <div className={cn('relative', className)}>{children}</div>
  }

  return (
    <motion.div
      ref={ref}
      className={cn('relative [transform-style:preserve-3d]', className)}
      style={{ rotateX, rotateY, transformPerspective: perspective }}
      animate={{ z: hovered ? lift : 0 }}
      transition={spring.surface}
      onPointerEnter={handleEnter}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      onPointerCancel={handleLeave}
    >
      {children}
      {glare ? (
        <motion.span
          aria-hidden="true"
          data-decor
          className="pointer-events-none absolute inset-0 rounded-[inherit] mix-blend-plus-lighter"
          style={{ background: glareBackground, opacity: glareOpacity }}
        />
      ) : null}
    </motion.div>
  )
}
