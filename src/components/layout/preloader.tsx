'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, animate, motion } from 'framer-motion'
import { duration, ease } from '@/lib/motion'
import { lockScroll, safeStorage } from '@/lib/scroll-lock'
import { LogoMark } from '@/components/ui/logo'
import { ENTRANCE_CUE } from '@/lib/use-entrance-cue'
import { useReducedMotionSafe } from '@/lib/use-reduced-motion-safe'

const SESSION_KEY = 'doggzy.visited'
const PANELS = 6

/**
 * Hard deadline for the curtain, measured from navigation start rather than
 * from mount.
 *
 * The obvious version of this — a `setTimeout` inside the effect — cannot
 * bound anything, because the effect does not run until the bundle has
 * downloaded, parsed and hydrated. On a 150 kbps link that is 35 seconds, and
 * a "3 second ceiling" written that way becomes "hydration + 3s": the visitor
 * stares at an opaque panel covering a page that finished rendering long ago.
 * `performance.now()` in the effect is time since navigation start, so
 * comparing against it makes the deadline absolute — this effect can only ever
 * shorten the curtain, never extend it.
 */
const DEADLINE_MS = 3000

/** Minimum time the bar is on screen, so it never flashes 0 → 100. */
const MIN_VISIBLE_MS = 620

/**
 * First-visit curtain.
 *
 * The overlay is server-rendered so there is never a flash of unstyled page
 * behind it. A tiny inline script in <head> adds `.preloaded` to <html> when
 * this session has already seen it, and CSS hides the overlay before first
 * paint — so returning visitors pay nothing.
 *
 * Three things can retire it, and the site stays usable if any two fail:
 * React (the normal path), the absolute deadline above, and a CSS animation in
 * globals.css that runs on the server-rendered node whether or not the bundle
 * ever loads.
 */
export function Preloader() {
  const reduced = useReducedMotionSafe()
  const [open, setOpen] = useState(true)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const root = document.documentElement

    /** Retire the curtain without animating it. */
    const skip = () => {
      root.classList.add('preloaded')
      safeStorage.set('session', SESSION_KEY, '1')
      setOpen(false)
    }

    if (root.classList.contains('preloaded')) {
      setOpen(false)
      return
    }

    // Hydration itself already outlasted the curtain's budget, or the visitor
    // asked for no motion. Either way there is nothing left to reveal.
    if (reduced || performance.now() >= DEADLINE_MS) {
      skip()
      return
    }

    const releaseScroll = lockScroll()
    const mountedAt = performance.now()

    let finished = false
    const controls = animate(0, 90, {
      duration: 1.1,
      ease: ease.outExpo,
      onUpdate: setProgress,
    })

    const finish = () => {
      if (finished) return
      finished = true
      controls.stop()
      animate(90, 100, {
        duration: 0.32,
        ease: ease.outQuart,
        onUpdate: setProgress,
        onComplete: () => {
          window.setTimeout(() => {
            root.classList.add('preloaded')
            safeStorage.set('session', SESSION_KEY, '1')
            releaseScroll()
            setOpen(false)
            // The hero waits for this before starting its entrance, so its
            // choreography is not spent behind an opaque panel.
            window.dispatchEvent(new Event(ENTRANCE_CUE))
          }, 90)
        },
      })
    }

    /** Never before the bar has visibly travelled, never past the deadline. */
    const scheduleFinish = () => {
      const now = performance.now()
      const floor = mountedAt + MIN_VISIBLE_MS
      return window.setTimeout(finish, Math.max(0, Math.min(floor, DEADLINE_MS) - now))
    }

    let pending = 0
    if (document.readyState === 'complete') {
      pending = scheduleFinish()
    } else {
      window.addEventListener('load', () => (pending = scheduleFinish()), { once: true })
    }
    const ceiling = window.setTimeout(finish, Math.max(0, DEADLINE_MS - performance.now()))

    return () => {
      controls.stop()
      window.clearTimeout(ceiling)
      window.clearTimeout(pending)
      releaseScroll()
    }
  }, [reduced])

  return (
    <AnimatePresence>
      {open ? (
        <div data-preloader className="fixed inset-0 z-[300] grid place-items-center">
          {/* One announcement, not a stream. `role="status"` lives on this span
              alone: on the container it made the whole overlay a live region,
              and the counter below re-renders dozens of times, so a screen
              reader read out "Doggzy 077", "Doggzy 086", "Doggzy 090"… The
              visual progress block is aria-hidden for the same reason. */}
          <span role="status" className="sr-only">
            Sajt se učitava
          </span>
          {/* The curtain itself: vertical panels that lift in a stagger. */}
          <div className="absolute inset-0 flex">
            {Array.from({ length: PANELS }).map((_, index) => (
              <motion.div
                key={index}
                className="h-full flex-1 bg-canvas"
                initial={{ y: 0 }}
                exit={{ y: '-102%' }}
                transition={{
                  duration: duration.epic,
                  ease: ease.inOutQuart,
                  delay: index * 0.055,
                }}
              />
            ))}
          </div>

          <motion.div
            aria-hidden="true"
            className="relative flex flex-col items-center gap-8"
            exit={{ opacity: 0, y: -24, transition: { duration: duration.fast, ease: ease.swift } }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.7, rotate: -12 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: duration.slow, ease: ease.outExpo }}
            >
              <LogoMark className="h-14 w-14" />
            </motion.div>

            <div className="flex w-[min(78vw,26rem)] flex-col gap-3">
              <div className="flex items-baseline justify-between">
                <span className="text-2xs uppercase tracking-[0.3em] text-ink-subtle">Doggzy</span>
                <span data-numeric className="text-sm text-ink-muted">
                  {Math.round(progress).toString().padStart(3, '0')}
                </span>
              </div>
              <div className="h-px w-full overflow-hidden bg-line-strong">
                <motion.div
                  className="h-full origin-left bg-linear-to-r from-brand to-iris-400"
                  style={{ scaleX: progress / 100 }}
                />
              </div>
            </div>
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  )
}

/**
 * Runs before first paint. Keeps returning visitors from seeing the curtain at
 * all, and gives the CSS a hook to hide it without waiting for React.
 */
export const preloaderScript = `(function(){try{if(sessionStorage.getItem('${SESSION_KEY}')){document.documentElement.classList.add('preloaded')}}catch(e){}})();`
