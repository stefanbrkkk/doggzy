'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { AnimatePresence, motion } from 'framer-motion'
import { BadgeCheck, CircleAlert } from 'lucide-react'
import { cn, formatDate, formatRsd } from '@/lib/utils'
import { spring } from '@/lib/motion'
import { routes } from '@/config/site'
import type { TimelineEvent, TimelineType } from '@/content/dogs'

export interface LedgerEntry extends TimelineEvent {
  dogName: string
  dogSlug: string
}

const TYPE_LABELS: Record<TimelineType, string> = {
  prijava: 'Prijava',
  vet: 'Veterinar',
  donacija: 'Donacija',
  nega: 'Nega',
  udomljenje: 'Udomljenje',
}

type Filter = 'sve' | 'troskovi' | 'donacije' | 'nepotvrdjeno'

const FILTERS: { value: Filter; label: string }[] = [
  { value: 'sve', label: 'Sve' },
  { value: 'troskovi', label: 'Troškovi' },
  { value: 'donacije', label: 'Donacije' },
  { value: 'nepotvrdjeno', label: 'Nepotvrđeno' },
]

/**
 * The combined ledger.
 *
 * Rendered as a real <table> so the relationship between date, dog, entry and
 * amount survives a screen reader, with the row layout collapsing to stacked
 * blocks on narrow screens through CSS rather than a second markup path.
 */
export function LedgerTable({ events }: { events: LedgerEntry[] }) {
  const [filter, setFilter] = useState<Filter>('sve')

  const rows = useMemo(() => {
    const sorted = [...events].sort((a, b) => (a.date < b.date ? 1 : -1))

    switch (filter) {
      case 'troskovi':
        return sorted.filter(
          (event) => event.type !== 'donacija' && typeof event.amount === 'number',
        )
      case 'donacije':
        return sorted.filter((event) => event.type === 'donacija')
      case 'nepotvrdjeno':
        return sorted.filter((event) => !event.verified)
      default:
        return sorted
    }
  }, [events, filter])

  return (
    <div className="space-y-5">
      <ul className="flex flex-wrap gap-1.5">
        {FILTERS.map((option) => {
          const active = filter === option.value
          return (
            <li key={option.value}>
              <button
                type="button"
                onClick={() => setFilter(option.value)}
                aria-pressed={active}
                className={cn(
                  'relative rounded-full border border-line px-4 py-2 text-sm transition-colors',
                  // 38px of visual, 44px of target — the row's own gap keeps
                  // neighbouring areas from overlapping.
                  "before:absolute before:-inset-1 before:content-['']",
                  active ? 'border-transparent text-brand-ink' : 'text-ink-muted hover:text-ink',
                )}
              >
                {active ? (
                  <motion.span
                    layoutId="ledger-pill"
                    className="absolute inset-0 rounded-full bg-brand"
                    transition={spring.surface}
                  />
                ) : null}
                <span className="relative z-10">{option.label}</span>
              </button>
            </li>
          )
        })}
      </ul>

      <div className="overflow-hidden rounded-4xl border border-line">
        <table className="w-full border-collapse text-left">
          <caption className="sr-only">Hronološki pregled troškova i donacija po psu</caption>
          {/* Hidden outright below `sm`, where the rows stack: `sr-only` would
              absolutely position the thead, and an absolutely positioned
              table-internal box is blockified, which costs the columnheader
              roles it was meant to preserve. The stacked layout carries its
              column names in <Label> instead — see the note there. */}
          <thead className="hidden sm:table-header-group">
            <tr className="border-b border-line bg-elevated">
              <Th>Datum</Th>
              <Th>Pas</Th>
              <Th>Unos</Th>
              <Th className="text-right">Iznos</Th>
              <Th>Dokaz</Th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence initial={false} mode="popLayout">
              {rows.map((row) => (
                <motion.tr
                  key={`${row.dogSlug}-${row.date}-${row.title}`}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={spring.surface}
                  className="block border-b border-line bg-surface last:border-0 sm:table-row"
                >
                  <Td className="text-ink-subtle">
                    <Label>Datum</Label>
                    <time dateTime={row.date}>{formatDate(row.date)}</time>
                  </Td>
                  <Td>
                    <Label>Pas</Label>
                    <Link
                      href={routes.dog(row.dogSlug)}
                      className="text-ink transition-colors hover:text-brand-text"
                    >
                      {row.dogName}
                    </Link>
                  </Td>
                  <Td>
                    <Label>Unos</Label>
                    <span className="block text-ink">{row.title}</span>
                    <span className="mt-0.5 block text-xs text-ink-subtle">
                      {TYPE_LABELS[row.type]} · {row.note}
                    </span>
                  </Td>
                  <Td className="sm:text-right">
                    <Label>Iznos</Label>
                    {typeof row.amount === 'number' ? (
                      <span
                        data-numeric
                        className={cn(row.type === 'donacija' ? 'text-brand-text' : 'text-ink')}
                      >
                        {row.type === 'donacija' ? '+' : '−'} {formatRsd(row.amount)}
                      </span>
                    ) : (
                      <span className="text-ink-subtle">—</span>
                    )}
                  </Td>
                  <Td>
                    <Label>Dokaz</Label>
                    <span
                      className={cn(
                        'inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-2xs',
                        row.verified
                          ? 'border-positive/30 bg-positive/10 text-positive'
                          : 'border-line bg-elevated text-ink-subtle',
                      )}
                    >
                      {row.verified ? (
                        <BadgeCheck className="h-3 w-3" aria-hidden="true" />
                      ) : (
                        <CircleAlert className="h-3 w-3" aria-hidden="true" />
                      )}
                      {row.verified ? 'Potvrđeno' : 'Nepotvrđeno'}
                    </span>
                  </Td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </div>
  )
}

function Th({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <th
      scope="col"
      className={cn(
        'px-5 py-3.5 text-2xs font-medium uppercase tracking-widest text-ink-subtle',
        className,
      )}
    >
      {children}
    </th>
  )
}

function Td({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <td
      className={cn(
        'block px-5 py-2 align-top text-sm first:pt-4 last:pb-4 sm:table-cell sm:py-4',
        className,
      )}
    >
      {children}
    </td>
  )
}

/**
 * Column name shown only in the stacked mobile layout.
 *
 * Not `aria-hidden`: below `sm` the `<thead>` is `display: none`, so without
 * this every cell in the table is announced with no column name at all. Above
 * `sm` this element is itself hidden and the real headers take over, so the
 * name is never announced twice.
 */
function Label({ children }: { children: React.ReactNode }) {
  return (
    <span className="mb-0.5 block text-2xs uppercase tracking-widest text-ink-subtle sm:hidden">
      {children}
    </span>
  )
}
