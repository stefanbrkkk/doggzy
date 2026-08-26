'use client'

import { useEffect, useLayoutEffect, useRef, type ReactNode } from 'react'
import { ReactLenis, type LenisRef } from 'lenis/react'
import { cancelFrame, frame } from 'framer-motion'
import { registerScrollDriver } from '@/lib/scroll-lock'

/**
 * Momentum scrolling for the whole document.
 *
 * Lenis animates the real `window.scrollY` rather than transforming a wrapper,
 * so `useScroll`, anchor links, `scrollIntoView` and native scroll restoration
 * all keep working, and Motion's scroll-linked values stay in sync for free.
 *
 * Two deliberate choices:
 *
 * - The tree is never branched on `useReducedMotion()`. Doing that at the app
 *   root re-renders the entire page subtree on hydration for those users. Lenis
 *   respects `prefers-reduced-motion` itself and drops to `lerp: 1`.
 * - The frame loop is Motion's, not a second `requestAnimationFrame`. One
 *   scheduler means Lenis and every animation resolve in the same frame instead
 *   of racing by one.
 * - The instance is handed to `lockScroll`. A modal that only sets
 *   `body { overflow: hidden }` does not stop Lenis, which drives `scrollY`
 *   programmatically — so every overlay scrolled the page behind it.
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const lenisRef = useRef<LenisRef>(null)

  useEffect(() => {
    const update = (data: { timestamp: number }) => {
      lenisRef.current?.lenis?.raf(data.timestamp)
    }

    frame.update(update, true)
    return () => cancelFrame(update)
  }, [])

  // A layout effect, so the driver is in place before any consumer's passive
  // effect can take a lock — the preloader takes one on mount, and registering
  // later meant its lock had nothing to stop. Looked up at call time rather
  // than captured: ReactLenis attaches the instance to the ref.
  const register = () =>
    registerScrollDriver({
      stop: () => {
        const lenis = lenisRef.current?.lenis
        if (!lenis) return false
        lenis.stop()
        return true
      },
      start: () => lenisRef.current?.lenis?.start(),
    })

  useLayoutEffect(() => {
    register()
    return () => registerScrollDriver(null)
  }, [])

  return (
    <ReactLenis
      root
      ref={lenisRef}
      options={{
        autoRaf: false,
        lerp: 0.1,
        wheelMultiplier: 1,
        smoothWheel: true,
        // Native touch momentum already feels right; syncing it fights the OS.
        syncTouch: false,
        // Without this, in-page hash links jump while everything else glides.
        anchors: true,
        // Let scrollable children (cart drawer, textareas, selects) keep their
        // own wheel events instead of Lenis swallowing them.
        allowNestedScroll: true,
        prevent: (node) =>
          node.hasAttribute?.('data-lenis-prevent') ||
          ['TEXTAREA', 'SELECT'].includes(node.nodeName),
      }}
    >
      {children}
    </ReactLenis>
  )
}
