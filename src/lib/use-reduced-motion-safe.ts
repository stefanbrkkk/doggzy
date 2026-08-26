'use client'

import { useEffect, useState } from 'react'
import { useReducedMotion } from 'framer-motion'

/**
 * `useReducedMotion()` that is safe to branch the tree on.
 *
 * Motion's hook reads `matchMedia` synchronously, so it is `false` on the
 * server and `true` on a reduced-motion client's very first render. Any
 * component that returns a *different element tree* for the two — plain text
 * instead of split glyphs, a div instead of a motion.div — therefore fails
 * hydration and React throws away the server HTML for that subtree.
 *
 * Holding the value at `false` until after mount makes the first client render
 * match the server exactly; the real preference applies on the next render,
 * before anything has had time to animate.
 *
 * For components that only vary *props* (a transition, a style), use Motion's
 * hook directly — that case hydrates fine and this one costs an extra render.
 */
export function useReducedMotionSafe(): boolean {
  const reduced = useReducedMotion()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  return mounted && Boolean(reduced)
}
