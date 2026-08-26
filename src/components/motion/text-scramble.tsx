'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useInView, useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/utils'

const GLYPHS = 'ABČĆDĐEFGHIJKLMNOPRSŠTUVZŽ0123456789/\\<>[]{}#*+'

export interface TextScrambleProps {
  children: string
  className?: string
  /** Milliseconds between frames. Lower is more frantic. */
  frameMs?: number
  /** Re-run the scramble whenever the pointer enters. */
  scrambleOnHover?: boolean
}

/**
 * Resolves text out of noise, one character at a time. Renders an inline-block
 * <span>; wrap it in whatever heading level the context calls for.
 *
 * The animation runs on a timer rather than per-frame so it stays legible and
 * cheap. The real string is exposed via aria-label; the scrambling glyphs are
 * hidden from assistive tech.
 */
export function TextScramble({
  children,
  className,
  frameMs = 34,
  scrambleOnHover = true,
}: TextScrambleProps) {
  const reduced = useReducedMotion()
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '0px 0px -10% 0px' })
  const [output, setOutput] = useState(children)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const stop = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }, [])

  const run = useCallback(() => {
    if (reduced) {
      setOutput(children)
      return
    }
    stop()

    const target = children
    let frame = 0
    // Each character locks in after its own small delay, so the string
    // resolves left-to-right instead of all at once.
    const lockFrames = target.split('').map((_, i) => i * 1.6 + 6)

    timerRef.current = setInterval(() => {
      frame += 1
      let done = true
      const next = target
        .split('')
        .map((char, i) => {
          if (char === ' ') return ' '
          if (frame >= lockFrames[i]) return char
          done = false
          return GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
        })
        .join('')

      setOutput(next)
      if (done) stop()
    }, frameMs)
  }, [children, frameMs, reduced, stop])

  useEffect(() => {
    if (inView) run()
    return stop
  }, [inView, run, stop])

  return (
    <span
      ref={ref}
      className={cn('inline-block', className)}
      aria-label={children}
      onPointerEnter={scrambleOnHover ? run : undefined}
    >
      <span aria-hidden="true">{output}</span>
    </span>
  )
}
