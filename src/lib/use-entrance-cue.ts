'use client'

import { useEffect, useState } from 'react'

/** Dispatched on `window` when the preloader's curtain has cleared. */
export const ENTRANCE_CUE = 'doggzy:entrance'

/**
 * Seconds added to every beat of a gated entrance when it had to wait for the
 * curtain. The panels lift over ~1.15s with `inOutQuart`, so they are past
 * halfway at ~0.6s — starting the first beat at 0.45s hands the reveal over
 * while the curtain is still moving instead of leaving a dead gap.
 */
const HANDOFF = 0.45

/** If the cue never arrives — a crashed preloader — release the entrance anyway. */
const FAILSAFE_MS = 4500

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
    if (document.documentElement.classList.contains('preloaded')) {
      setCue({ ready: true, lead: 0 })
      return
    }

    const onCue = () => setCue({ ready: true, lead: HANDOFF })
    window.addEventListener(ENTRANCE_CUE, onCue, { once: true })
    const failsafe = window.setTimeout(() => setCue({ ready: true, lead: 0 }), FAILSAFE_MS)

    return () => {
      window.removeEventListener(ENTRANCE_CUE, onCue)
      window.clearTimeout(failsafe)
    }
  }, [])

  return cue
}
