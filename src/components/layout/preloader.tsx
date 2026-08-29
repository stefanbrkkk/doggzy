'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
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
/**
 * `curtain` — on screen. `lifting` — panels animating away. `gone` — unmounted.
 *
 * Three states rather than a boolean, because two different things retire this
 * overlay and only one of them should be animated. `lifting` hands the node to
 * `AnimatePresence` for its exit; `gone` returns `null` from the component, so
 * `AnimatePresence` unmounts with it and the node leaves the DOM in that same
 * commit. A boolean could only ever express the animated one, and the paths
 * that must not animate — a returning visitor inside the session, anyone who
 * asked for reduced motion — sat under a full-viewport `display: none` overlay
 * for the 1.4s the panel lift would have taken.
 */
type Phase = 'curtain' | 'lifting' | 'gone'

export function Preloader() {
  const reduced = useReducedMotionSafe()
  const [phase, setPhase] = useState<Phase>('curtain')
  const [progress, setProgress] = useState(0)
  /**
   * Released when the panels have finished lifting, not when they start.
   * Moving to `lifting` only begins a ~1.4s exit, and releasing there left the
   * page scrollable while the curtain still covered it.
   */
  const releaseScrollRef = useRef<(() => void) | null>(null)

  /**
   * Gives scrolling back. Safe to call from the effect's cleanup.
   *
   * Deliberately does NOT stamp `.preloaded`. It used to, and because
   * `useReducedMotionSafe()` flips false → true on mount, a reduced-motion
   * visitor's effect always re-runs once — so the cleanup stamped the class
   * before the re-run, the re-run took the "already preloaded" early return
   * instead of `skip()`, and `skip()` is the only branch that writes the
   * session flag. Those visitors then saw the opaque curtain on every single
   * load, which is precisely what the flag exists to prevent.
   */
  const releaseScrollLock = useCallback(() => {
    document.documentElement.style.overflow = ''
    releaseScrollRef.current?.()
    releaseScrollRef.current = null
  }, [])

  /** The panels have finished lifting: only now may the class hide it. */
  const retireCurtain = useCallback(() => {
    document.documentElement.classList.add('preloaded')
    setPhase('gone')
    releaseScrollLock()
  }, [releaseScrollLock])

  useEffect(() => {
    const root = document.documentElement
    // Hands the bar back from the CSS sweep that has been running since first
    // paint. See the note in globals.css: until this class lands there is no
    // progress to report, so the bar is indeterminate and the counter hidden.
    root.classList.add('preloader-live')

    /** Lets a gated entrance start. `curtain` says whether panels are lifting. */
    const release = (curtain: boolean) => {
      window.dispatchEvent(new CustomEvent(ENTRANCE_CUE, { detail: { curtain } }))
    }

    /** Retire the curtain without animating it. */
    const skip = () => {
      root.style.overflow = ''
      root.classList.add('preloaded')
      safeStorage.set('session', SESSION_KEY, '1')
      setPhase('gone')
      release(false)
    }

    // Already retired earlier in this session: the inline script hid it before
    // first paint, so there is nothing to reveal and nothing to animate away.
    if (root.classList.contains('preloaded')) {
      root.style.overflow = ''
      setPhase('gone')
      return
    }

    // Hydration itself already outlasted the curtain's budget, or the visitor
    // asked for no motion. Either way there is nothing left to reveal.
    if (reduced || performance.now() >= DEADLINE_MS) {
      skip()
      return
    }

    releaseScrollRef.current = lockScroll()
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
            // `preloaded` is added by `onExitComplete`, not here. The CSS rule
            // it drives is `display: none !important` on the overlay, so adding
            // it before the lift starts un-rendered the node in the same tick
            // the 1.4s panel lift was supposed to begin — the whole reveal
            // played on a box nobody could see, and the visitor got a hard cut.
            safeStorage.set('session', SESSION_KEY, '1')
            setPhase('lifting')
            // The hero waits for this before starting its entrance, so its
            // choreography is not spent behind an opaque panel.
            release(true)
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
    const onLoad = () => {
      pending = scheduleFinish()
    }
    if (document.readyState === 'complete') {
      pending = scheduleFinish()
    } else {
      window.addEventListener('load', onLoad, { once: true })
    }
    const ceiling = window.setTimeout(finish, Math.max(0, DEADLINE_MS - performance.now()))

    return () => {
      controls.stop()
      window.clearTimeout(ceiling)
      window.clearTimeout(pending)
      window.removeEventListener('load', onLoad)
      releaseScrollLock()
    }
  }, [reduced, releaseScrollLock])

  // Not `AnimatePresence` with a `null` child: unmounting the whole thing is
  // what makes `gone` synchronous, because there is no exit left to wait for.
  if (phase === 'gone') return null

  return (
    <AnimatePresence onExitComplete={retireCurtain}>
      {phase === 'curtain' ? (
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
                // Read by the E2E suite, which asserts that a reduced-motion
                // visitor never sees a panel move: the difference between a
                // curtain that lifted and one that was simply dropped is
                // invisible from outside the page.
                data-preloader-panel
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
                <span data-numeric data-count className="text-sm text-ink-muted">
                  {Math.round(progress).toString().padStart(3, '0')}
                </span>
              </div>
              <div className="h-px w-full overflow-hidden bg-line-strong">
                <motion.div
                  data-progress
                  className="h-full origin-left bg-linear-to-r from-brand to-[var(--gradient-3)]"
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
 * Runs before first paint.
 *
 * Two jobs. It keeps returning visitors from seeing the curtain at all, and it
 * locks scrolling for everyone else — the curtain is server-rendered and on
 * screen from first paint, but `lockScroll` cannot run until hydration, and
 * Lenis was happily scrolling the page underneath it in the meantime. The
 * component clears the inline style when it retires the curtain; the timeout is
 * the failsafe for a bundle that never arrives, and outlives the CSS animation
 * that hides the overlay so the two cannot leave a locked, empty page.
 */
export const preloaderScript = `(function(){var d=document.documentElement;try{if(sessionStorage.getItem('${SESSION_KEY}')){d.classList.add('preloaded');return}}catch(e){}d.style.overflow='clip';setTimeout(function(){d.style.overflow=''},${DEADLINE_MS + 2500});})();`
