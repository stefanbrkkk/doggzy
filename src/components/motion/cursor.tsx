'use client'

import { useEffect, useRef, useState } from 'react'
import {
  AnimatePresence,
  frame,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from 'framer-motion'
import { spring } from '@/lib/motion'

type CursorState = 'idle' | 'focus' | 'expand' | 'hide'

const HIT_SELECTOR = '[data-cursor], a, button, input, textarea, select, [role="button"]'

/**
 * A trailing ring that follows the pointer and reacts to what is under it.
 *
 * Elements opt in with `data-cursor="expand" | "hide"` (plus an optional
 * `data-cursor-label`); anything interactive gets the compact "focus" state for
 * free.
 *
 * Performance: the hit test runs at most once per frame, and React state is
 * only touched when the resolved target actually changes — a naive
 * `closest()` + `setState` on every `pointermove` re-renders at pointer rate.
 * Position never goes through React at all; it is written straight to motion
 * values.
 *
 * Never rendered on coarse pointers or for reduced-motion users, and the real
 * system cursor is left alone, so this is additive rather than a replacement.
 */
export function Cursor() {
  const reduced = useReducedMotion()
  const [enabled, setEnabled] = useState(false)
  const [visible, setVisible] = useState(false)
  const [state, setState] = useState<CursorState>('idle')
  const [label, setLabel] = useState<string | null>(null)

  const lastTarget = useRef<Element | null>(null)

  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const ringX = useSpring(x, spring.pointer)
  const ringY = useSpring(y, spring.pointer)

  useEffect(() => {
    if (reduced) return
    const query = window.matchMedia('(hover: hover) and (pointer: fine)')
    const apply = () => setEnabled(query.matches)
    apply()
    query.addEventListener('change', apply)
    return () => query.removeEventListener('change', apply)
  }, [reduced])

  useEffect(() => {
    if (!enabled) return

    let queued = false
    let pending: PointerEvent | null = null

    const resolve = () => {
      queued = false
      const event = pending
      if (!event) return

      const target = event.target as Element | null
      const hit = target?.closest?.(HIT_SELECTOR) ?? null

      // Same element as last frame: nothing about the visual state can differ.
      if (hit === lastTarget.current) return
      lastTarget.current = hit

      if (!hit) {
        setState('idle')
        setLabel(null)
        return
      }

      const explicit = hit.getAttribute('data-cursor')
      setLabel(hit.getAttribute('data-cursor-label'))
      setState(explicit === 'expand' || explicit === 'hide' ? explicit : 'focus')
    }

    const onMove = (event: PointerEvent) => {
      x.set(event.clientX)
      y.set(event.clientY)
      if (!visible) setVisible(true)

      pending = event
      if (!queued) {
        queued = true
        frame.read(resolve)
      }
    }

    const onLeave = () => setVisible(false)

    window.addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('pointerleave', onLeave)
    return () => {
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerleave', onLeave)
    }
  }, [enabled, visible, x, y])

  if (!enabled) return null

  const size = state === 'expand' ? 72 : state === 'focus' ? 44 : 26

  return (
    <AnimatePresence>
      {visible && state !== 'hide' ? (
        <motion.div
          aria-hidden="true"
          data-decor
          className="pointer-events-none fixed left-0 top-0 z-[200] mix-blend-difference"
          style={{ x: ringX, y: ringY }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="flex items-center justify-center rounded-full border border-white/80"
            animate={{
              width: size,
              height: size,
              marginLeft: -size / 2,
              marginTop: -size / 2,
              backgroundColor: state === 'expand' ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0)',
            }}
            transition={spring.surface}
          >
            {label && state === 'expand' ? (
              <span className="text-2xs font-medium uppercase tracking-widest text-black">
                {label}
              </span>
            ) : null}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
