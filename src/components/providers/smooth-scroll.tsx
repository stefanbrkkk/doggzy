'use client'

import { useEffect, useLayoutEffect, useRef, type ReactNode } from 'react'
import Lenis from 'lenis'
import { cancelFrame, frame } from 'framer-motion'
import { registerScrollDriver } from '@/lib/scroll-lock'

/**
 * Momentum scrolling for the whole document.
 *
 * Lenis animates the real `window.scrollY` rather than transforming a wrapper,
 * so `useScroll`, anchor links, `scrollIntoView` and native scroll restoration
 * all keep working, and Motion's scroll-linked values stay in sync for free.
 *
 * Three deliberate choices:
 *
 * - The instance is constructed here rather than by `<ReactLenis>`. That
 *   component keeps it in React state and hands it over through
 *   `useImperativeHandle`, so `ref.current.lenis` stays empty until React has
 *   flushed another render — during hydration, measured at ~300ms on a busy
 *   machine. For those 300ms Lenis was live, the preloader's lock was already
 *   held, and a wheel landing in the gap moved the page ~60px underneath the
 *   curtain, which then lifted onto mid-hero. Owning the constructor makes the
 *   driver stoppable in the same tick it starts existing. Nothing here used the
 *   React context the component provides.
 * - The tree is never branched on `useReducedMotion()`. Doing that at the app
 *   root re-renders the entire page subtree on hydration for those users. Lenis
 *   respects `prefers-reduced-motion` itself and drops to `lerp: 1`.
 * - The frame loop is Motion's, not a second `requestAnimationFrame`. One
 *   scheduler means Lenis and every animation resolve in the same frame instead
 *   of racing by one.
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null)

  // A layout effect, so the driver is in place before any consumer's passive
  // effect can take a lock — the preloader takes one on mount, and registering
  // later meant its lock had nothing to stop.
  useLayoutEffect(() => {
    const lenis = new Lenis({
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
        node.hasAttribute?.('data-lenis-prevent') || ['TEXTAREA', 'SELECT'].includes(node.nodeName),
    })
    lenisRef.current = lenis

    registerScrollDriver({
      stop: () => {
        lenis.stop()
        return true
      },
      start: () => lenis.start(),
    })

    return () => {
      registerScrollDriver(null)
      lenis.destroy()
      lenisRef.current = null
    }
  }, [])

  useEffect(() => {
    const update = (data: { timestamp: number }) => {
      lenisRef.current?.raf(data.timestamp)
    }

    frame.update(update, true)
    return () => cancelFrame(update)
  }, [])

  return <>{children}</>
}
