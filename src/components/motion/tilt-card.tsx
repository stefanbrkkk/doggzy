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
  /** Content that is NOT transformed: buttons, links, anything clickable. */
  children: ReactNode
  /** Content that tilts. Should be decorative — imagery, gradients, artwork. */
  layer: ReactNode
  className?: string
  /** Class applied to the transformed layer. */
  layerClassName?: string
  /** Maximum rotation on each axis, in degrees. */
  max?: number
  /** How far the layer lifts toward the viewer on hover, in pixels. */
  lift?: number
  /** Draw a specular highlight that tracks the pointer. */
  glare?: boolean
  /** Perspective distance; smaller values exaggerate the effect. */
  perspective?: number
}

/**
 * Tilts a decorative layer toward the pointer while leaving interactive
 * children where they are.
 *
 * The split matters. Transforming the whole card looks the same but moves every
 * control inside it: measured on the catalogue, a button covering the artwork
 * only hit-tested across the top third of its own bounding box once the card
 * was tilted, so pointing at the lower half of a card silently missed. Sensing
 * on the wrapper and transforming only the artwork keeps the effect and makes
 * the targets stable.
 *
 * Perspective is set with Motion's `transformPerspective` on the layer itself:
 * the natural wrapper for a CSS `perspective` would be `display: contents`,
 * which generates no box, so the property is dropped and the rotation
 * flattens into a 2D skew.
 */
export function TiltCard({
  children,
  layer,
  className,
  layerClassName,
  max = 8,
  lift = 12,
  glare = true,
  perspective = 900,
}: TiltCardProps) {
  const reduced = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const box = useRef<DOMRect | null>(null)
  const [hovered, setHovered] = useState(false)

  const rotateX = useSpring(useMotionValue(0), spring.pointer)
  const rotateY = useSpring(useMotionValue(0), spring.pointer)
  const glareX = useMotionValue(50)
  const glareY = useMotionValue(50)
  const glareOpacity = useSpring(useMotionValue(0), spring.pointer)

  const glareBackground = useMotionTemplate`radial-gradient(circle at ${glareX}% ${glareY}%, oklch(1 0 0 / 0.2), transparent 55%)`

  const handleEnter = useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== 'mouse') return
    // Measured once per hover: reading a rect on every pointer event forces a
    // synchronous layout mid-gesture.
    box.current = ref.current?.getBoundingClientRect() ?? null
    setHovered(true)
  }, [])

  const handleMove = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (event.pointerType !== 'mouse') return
      const rect = box.current
      if (!rect) return

      const px = (event.clientX - rect.left) / rect.width
      const py = (event.clientY - rect.top) / rect.height

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
    box.current = null
    rotateX.set(0)
    rotateY.set(0)
    glareOpacity.set(0)
  }, [glareOpacity, rotateX, rotateY])

  if (reduced) {
    return (
      <div className={cn('relative', className)}>
        <div className={cn(layerClassName)}>{layer}</div>
        {children}
      </div>
    )
  }

  return (
    <div
      ref={ref}
      className={cn('relative', className)}
      onPointerEnter={handleEnter}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      onPointerCancel={handleLeave}
    >
      <motion.div
        aria-hidden="true"
        className={cn('pointer-events-none', layerClassName)}
        style={{ rotateX, rotateY, transformPerspective: perspective }}
        animate={{ z: hovered ? lift : 0 }}
        transition={spring.surface}
      >
        {layer}
        {glare ? (
          <motion.span
            data-decor
            className="pointer-events-none absolute inset-0 rounded-[inherit] mix-blend-plus-lighter"
            style={{ background: glareBackground, opacity: glareOpacity }}
          />
        ) : null}
      </motion.div>

      {children}
    </div>
  )
}
