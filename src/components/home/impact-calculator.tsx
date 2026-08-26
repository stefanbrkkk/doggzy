'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, Check, FileText } from 'lucide-react'
import { cn, formatRsd } from '@/lib/utils'
import { duration, ease, spring } from '@/lib/motion'
import { routes } from '@/config/site'
import { ledgerLineItems } from '@/content/dogs'
import { buttonStyles } from '@/components/ui/button'
import { Container, Eyebrow } from '@/components/ui/section'
import { Reveal } from '@/components/motion'

/**
 * The list is the dog ledgers, not a copy of them.
 *
 * The heading below promises these are real invoices already published on a
 * dog's page. Typing them out separately is how the calculator came to quote a
 * price no ledger contained, so it reads them instead.
 */
const LINE_ITEMS = ledgerLineItems()

/** Slider stops: every real invoice, plus a couple of rounder figures. */
const STEPS = [...new Set([...LINE_ITEMS.map((item) => item.cost), 1200, 25000])].sort(
  (a, b) => a - b,
)

export function ImpactCalculator() {
  const [index, setIndex] = useState(Math.floor(STEPS.length / 2))
  const amount = STEPS[index]

  const { covered, next } = useMemo(() => {
    const covered = LINE_ITEMS.filter((item) => item.cost <= amount)
    const next = LINE_ITEMS.find((item) => item.cost > amount)
    return { covered, next }
  }, [amount])

  const best = covered.at(-1)

  return (
    <section className="relative overflow-hidden py-section">
      <div
        aria-hidden="true"
        data-decor
        className="pointer-events-none absolute left-1/2 top-1/2 h-[36rem] w-[36rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-iris-500/8 blur-[130px]"
      />

      <Container>
        <div className="grid gap-14 lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:gap-20">
          <div className="space-y-5">
            <Reveal direction="up" amount={0.4}>
              <Eyebrow>Transparentnost</Eyebrow>
            </Reveal>
            <Reveal direction="up" delay={0.06}>
              <h2 className="text-title text-ink">Prevuci i vidi šta tvoj novac plaća</h2>
            </Reveal>
            <Reveal direction="up" delay={0.12}>
              <p className="text-lead text-ink-muted">
                Ovo nisu procene. Svaka stavka je račun koji već stoji na stranici psa pored njenog
                imena — otvori je i proveri.
              </p>
            </Reveal>

            <Reveal direction="up" delay={0.18} className="pt-4">
              <div className="space-y-6 rounded-4xl border border-line bg-elevated p-6 sm:p-8">
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <label
                      htmlFor="impact-amount"
                      className="text-2xs uppercase tracking-[0.2em] text-ink-subtle"
                    >
                      Iznos donacije
                    </label>
                    {/* No aria-live here: the slider's own aria-valuetext is
                        already announced on every change, and a live region on
                        the mirrored value made each arrow key speak twice. */}
                    <p data-numeric className="mt-1 text-title leading-none text-gradient">
                      {formatRsd(amount)}
                    </p>
                  </div>
                </div>

                <input
                  id="impact-amount"
                  type="range"
                  min={0}
                  max={STEPS.length - 1}
                  step={1}
                  value={index}
                  onChange={(event) => setIndex(Number(event.target.value))}
                  aria-valuetext={`${formatRsd(amount)} — ${
                    best ? `${best.label}, ${best.dogName}` : 'ispod prve stavke'
                  }`}
                  className={cn(
                    'h-2 w-full cursor-pointer appearance-none rounded-full bg-sunken outline-none',
                    'focus-visible:ring-4 focus-visible:ring-brand/25',
                    '[&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:appearance-none',
                    '[&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-brand',
                    '[&::-webkit-slider-thumb]:shadow-[0_0_0_4px_var(--canvas),0_4px_14px_oklch(0_0_0/0.45)]',
                    '[&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:duration-200',
                    'hover:[&::-webkit-slider-thumb]:scale-110 active:[&::-webkit-slider-thumb]:scale-95',
                    '[&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:rounded-full',
                    '[&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-brand',
                  )}
                  style={{
                    background: `linear-gradient(to right, var(--brand) ${(index / (STEPS.length - 1)) * 100}%, var(--sunken) ${(index / (STEPS.length - 1)) * 100}%)`,
                  }}
                />

                <div className="flex items-center justify-between text-2xs text-ink-subtle">
                  <span data-numeric>{formatRsd(STEPS[0])}</span>
                  <span data-numeric>{formatRsd(STEPS.at(-1)!)}</span>
                </div>

                <Link
                  href={routes.donate}
                  className={cn(buttonStyles({ size: 'lg', full: true }), 'group/give')}
                >
                  Doniraj {formatRsd(amount)}
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 ease-out-expo group-hover/give:translate-x-1" />
                </Link>
              </div>
            </Reveal>
          </div>

          <Reveal direction="up" delay={0.1}>
            <Receipt covered={covered} next={next} amount={amount} />
          </Reveal>
        </div>
      </Container>
    </section>
  )
}

function Receipt({
  covered,
  next,
  amount,
}: {
  covered: typeof LINE_ITEMS
  next?: (typeof LINE_ITEMS)[number]
  amount: number
}) {
  return (
    <div className="relative">
      <div className="rounded-4xl border border-line bg-surface p-6 shadow-lift-lg sm:p-8 grain">
        <header className="flex items-center justify-between border-b border-dashed border-rule pb-4">
          <span className="flex items-center gap-2 text-sm font-medium text-ink">
            <FileText className="h-4 w-4 text-brand" aria-hidden="true" />
            Šta {formatRsd(amount)} pokriva
          </span>
          <span data-numeric className="text-2xs uppercase tracking-widest text-ink-subtle">
            {covered.length}/{LINE_ITEMS.length}
          </span>
        </header>

        <ul className="space-y-0.5 py-4">
          {LINE_ITEMS.map((item) => {
            const isCovered = item.cost <= amount
            return (
              <li
                key={`${item.dogSlug}-${item.label}`}
                className="flex items-center gap-3 rounded-lg px-1 py-2 transition-colors"
              >
                <span
                  className={cn(
                    'grid h-5 w-5 shrink-0 place-items-center rounded-full border transition-colors duration-300',
                    isCovered
                      ? 'border-brand bg-brand text-brand-ink'
                      : 'border-line text-transparent',
                  )}
                  aria-hidden="true"
                >
                  <AnimatePresence>
                    {isCovered ? (
                      <motion.span
                        initial={{ scale: 0, rotate: -40 }}
                        animate={{ scale: 1, rotate: 0 }}
                        exit={{ scale: 0 }}
                        transition={spring.pop}
                      >
                        <Check className="h-3 w-3" />
                      </motion.span>
                    ) : null}
                  </AnimatePresence>
                </span>

                <span
                  className={cn(
                    'min-w-0 flex-1 text-sm transition-colors duration-300',
                    isCovered ? 'text-ink' : 'text-ink-subtle',
                  )}
                >
                  {item.label}{' '}
                  <Link
                    href={routes.dog(item.dogSlug)}
                    className="text-ink-subtle underline decoration-line-strong underline-offset-2 transition-colors hover:text-ink"
                  >
                    {item.dogName}
                  </Link>
                </span>

                <span
                  data-numeric
                  className={cn(
                    'shrink-0 text-sm transition-colors duration-300',
                    isCovered ? 'text-ink' : 'text-ink-subtle',
                  )}
                >
                  {formatRsd(item.cost)}
                </span>
              </li>
            )
          })}
        </ul>

        <footer className="border-t border-dashed border-rule pt-4">
          <AnimatePresence mode="wait">
            <motion.p
              key={next ? `${next.dogSlug}-${next.label}` : 'all'}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: duration.fast, ease: ease.swift }}
              className="text-sm text-ink-muted"
            >
              {next ? (
                <>
                  Još <strong className="text-ink">{formatRsd(next.cost - amount)}</strong> do
                  stavke „{next.label}”.
                </>
              ) : (
                <span className="text-positive">
                  Ovim iznosom pokrivena je cela lista — uključujući operaciju.
                </span>
              )}
            </motion.p>
          </AnimatePresence>
        </footer>
      </div>

      {/* Torn edge */}
      <div
        aria-hidden="true"
        data-decor
        className="h-4 w-full [background:radial-gradient(circle_at_8px_0,transparent_8px,var(--surface)_8px)] [background-size:16px_16px] [background-position:0_-8px] [clip-path:inset(0_1px_0_1px)]"
      />
    </div>
  )
}
