'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, animate, motion, useReducedMotion } from 'framer-motion'
import { duration, ease } from '@/lib/motion'
import { LogoMark } from '@/components/ui/logo'

const SESSION_KEY = 'doggzy.visited'
const PANELS = 6

/**
 * First-visit curtain.
 *
 * The overlay is server-rendered so there is never a flash of unstyled page
 * behind it. A tiny inline script in <head> adds `.preloaded` to <html> when
 * this session has already seen it, and CSS hides the overlay before first
 * paint — so returning visitors pay nothing.
 *
 * Progress is real: it eases to 90% while the document is still loading and
 * only completes once `window.load` fires (or a 3s ceiling, so a stalled
 * third-party asset can never trap the visitor behind the curtain).
 */
export function Preloader() {
  const reduced = useReducedMotion()
  const [open, setOpen] = useState(true)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const root = document.documentElement

    if (root.classList.contains('preloaded')) {
      setOpen(false)
      return
    }

    if (reduced) {
      root.classList.add('preloaded')
      sessionStorage.setItem(SESSION_KEY, '1')
      setOpen(false)
      return
    }

    // Captured, not assumed: another component may already own the scroll lock.
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

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
            sessionStorage.setItem(SESSION_KEY, '1')
            document.body.style.overflow = previousOverflow
            setOpen(false)
          }, 180)
        },
      })
    }

    if (document.readyState === 'complete') {
      window.setTimeout(finish, 900)
    } else {
      window.addEventListener('load', finish, { once: true })
    }
    const ceiling = window.setTimeout(finish, 3000)

    return () => {
      controls.stop()
      window.clearTimeout(ceiling)
      window.removeEventListener('load', finish)
      document.body.style.overflow = previousOverflow
    }
  }, [reduced])

  return (
    <AnimatePresence>
      {open ? (
        <div
          data-preloader
          className="fixed inset-0 z-[300] grid place-items-center"
          role="status"
          aria-live="polite"
          aria-label="Sajt se učitava"
        >
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
