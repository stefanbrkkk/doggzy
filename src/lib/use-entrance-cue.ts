'use client'

import { useEffect, useState } from 'react'

/**
 * Dispatched on `window` when the preloader releases the page.
 *
 * `detail.curtain` says whether panels are actually lifting as it fires — the
 * reduced-motion and past-deadline paths retire the overlay without animating
 * it, and an entrance that waited for a curtain that never moved would just be
 * late.
 */
export const ENTRANCE_CUE = 'doggzy:entrance'

export type EntranceCueEvent = CustomEvent<{ curtain: boolean }>

/**
 * Seconds added to every beat of a gated entrance when it had to wait for the
 * curtain. The panels lift over ~1.15s with `inOutQuart`, so they are past
 * halfway at ~0.6s — starting the first beat at 0.45s hands the reveal over
 * while the curtain is still moving instead of leaving a dead gap.
 */
const HANDOFF = 0.45

/** If nothing releases the entrance — a crashed preloader — start it anyway. */
const FAILSAFE_MS = 4000

export interface EntranceCue {
  /** Whether the entrance may start. */
  ready: boolean
  /** Seconds to add to each beat's delay. Zero when nothing had to be waited for. */
  lead: number
}

/**
 * Gates a mount entrance on the first-visit curtain being gone.
 *
 * Without this the hero's whole choreography — the glyph rise, the masked line
 * reveal, the phone settling in — runs and finishes underneath an opaque panel,
 * and what the first-time visitor actually sees is a static hero appearing all
 * at once. Returning visitors have `.preloaded` on <html> before first paint,
 * so for them this is true on the first client render with no lead at all.
 */
export function useEntranceCue(): EntranceCue {
  const [cue, setCue] = useState<EntranceCue>({ ready: false, lead: 0 })

  useEffect(() => {
    const root = document.documentElement
    if (root.classList.contains('preloaded')) {
      setCue({ ready: true, lead: 0 })
      return
    }

    const onCue = (event: Event) => {
      const curtain = (event as EntranceCueEvent).detail?.curtain ?? false
      setCue({ ready: true, lead: curtain ? HANDOFF : 0 })
    }
    window.addEventListener(ENTRANCE_CUE, onCue, { once: true })

    // Belt and braces: the class is the state, the event is only the hint that
    // carries the handoff. Watching it means no future path that retires the
    // overlay can leave an entrance stranded at its `hidden` offset.
    const observer = new MutationObserver(() => {
      if (root.classList.contains('preloaded')) setCue({ ready: true, lead: 0 })
    })
    observer.observe(root, { attributes: true, attributeFilter: ['class'] })

    const failsafe = window.setTimeout(() => setCue({ ready: true, lead: 0 }), FAILSAFE_MS)

    return () => {
      window.removeEventListener(ENTRANCE_CUE, onCue)
      observer.disconnect()
      window.clearTimeout(failsafe)
    }
  }, [])

  return cue
}
