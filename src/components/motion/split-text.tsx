'use client'

import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { glyphRise, stagger as staggerVariants, viewportOnce } from '@/lib/motion'
import { useReducedMotionSafe } from '@/lib/use-reduced-motion-safe'

export interface SplitTextProps {
  children: string
  className?: string
  /** `char` gives the kinetic reveal; `word` is calmer and cheaper. */
  by?: 'char' | 'word'
  delay?: number
  stagger?: number
  /**
   * `view` (default) reveals when scrolled into view, `mount` reveals straight
   * away, and `hold` stays masked until it is switched to `mount` — that last
   * one is how the hero keeps its entrance from playing behind the preloader.
   */
  trigger?: 'view' | 'mount' | 'hold'
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span' | 'div'
}

/**
 * Splits text into animated glyphs that rise out of a clipping mask.
 *
 * Splitting uses `Intl.Segmenter` at grapheme granularity, not `Array.from`.
 * Code-point iteration tears apart combining accents (č as c + caron), ZWJ
 * sequences and flags — and Serbian text is full of the first kind.
 *
 * Accessibility: the glyphs are `aria-hidden` and the full string is exposed
 * once via `aria-label`, so assistive tech reads a sentence rather than a
 * stream of letters.
 *
 * For gradient text use <LineReveal>: `background-clip: text` cannot paint
 * across per-glyph wrappers that carry their own transforms.
 */
export function SplitText({
  children,
  className,
  by = 'char',
  delay = 0,
  stagger,
  trigger = 'view',
  as: Tag = 'span',
}: SplitTextProps) {
  const reduced = useReducedMotionSafe()
  const step = stagger ?? (by === 'char' ? 0.018 : 0.05)

  // Keys are derived here, never from a counter mutated during render — that
  // is unsafe once React can re-enter a render pass.
  const words = useMemo(() => {
    const segmenter =
      typeof Intl !== 'undefined' && 'Segmenter' in Intl
        ? new Intl.Segmenter('sr', { granularity: 'grapheme' })
        : null

    return children.split(' ').map((word, wordIndex) => ({
      word,
      key: `${wordIndex}-${word}`,
      graphemes: segmenter
        ? Array.from(segmenter.segment(word), (entry, index) => ({
            char: entry.segment,
            key: `${wordIndex}-${index}`,
          }))
        : Array.from(word, (char, index) => ({ char, key: `${wordIndex}-${index}` })),
    }))
  }, [children])

  if (reduced) {
    return <Tag className={className}>{children}</Tag>
  }

  const container = staggerVariants(step, delay)

  const animationProps =
    trigger === 'view'
      ? { whileInView: 'visible' as const, viewport: viewportOnce }
      : { animate: trigger === 'mount' ? ('visible' as const) : ('hidden' as const) }

  return (
    <Tag className={cn('inline', className)} aria-label={children}>
      <motion.span
        className="inline"
        aria-hidden="true"
        initial="hidden"
        variants={container}
        {...animationProps}
      >
        {words.map((entry, wordIndex) => (
          <span key={entry.key}>
            <span className="inline-block overflow-hidden align-bottom [clip-path:inset(-0.25em_-0.15em_-0.15em)]">
              {by === 'char' ? (
                <span className="inline-block">
                  {entry.graphemes.map((grapheme) => (
                    <motion.span key={grapheme.key} className="inline-block" variants={glyphRise}>
                      {grapheme.char}
                    </motion.span>
                  ))}
                </span>
              ) : (
                <motion.span className="inline-block" variants={glyphRise}>
                  {entry.word}
                </motion.span>
              )}
            </span>
            {wordIndex < words.length - 1 ? ' ' : null}
          </span>
        ))}
      </motion.span>
    </Tag>
  )
}
