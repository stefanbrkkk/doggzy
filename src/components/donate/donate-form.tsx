'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, Copy, Landmark, Repeat, Zap } from 'lucide-react'
import { cn, formatRsd } from '@/lib/utils'
import { duration, ease, spring } from '@/lib/motion'
import { dogs } from '@/content/dogs'
import { createReference } from '@/lib/schemas'
import { Button } from '@/components/ui/button'

const AMOUNTS = [600, 1200, 2600, 5200, 8500, 18400]

const COVERS: { min: number; text: string }[] = [
  { min: 18400, text: 'operaciju loše zaraslog preloma' },
  { min: 8500, text: 'sterilizaciju jednog psa' },
  { min: 5200, text: 'oftalmološki pregled' },
  { min: 2600, text: 'vakcinu i čipovanje' },
  { min: 1200, text: 'hranu za jednog psa na nedelju dana' },
  { min: 600, text: 'hranu za jednog psa na tri dana' },
  { min: 0, text: 'deo troškova nege' },
]

/**
 * Donation flow.
 *
 * Card processing is not connected yet, so this does not pretend to take a
 * payment. It builds a real bank-transfer instruction with a generated
 * reference number — the standard way of paying in Serbia — which is something
 * a visitor can actually act on today.
 */
export function DonateForm() {
  const [amount, setAmount] = useState(2600)
  const [custom, setCustom] = useState('')
  const [recurring, setRecurring] = useState(false)
  const [target, setTarget] = useState<'opste' | string>('opste')
  const [reference, setReference] = useState<string | null>(null)
  const [copied, setCopied] = useState<string | null>(null)
  const copyTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(
    () => () => {
      if (copyTimer.current) clearTimeout(copyTimer.current)
    },
    [],
  )

  const effectiveAmount = custom ? Math.max(0, Number(custom.replace(/\D/g, ''))) : amount

  const covers = useMemo(
    () => COVERS.find((entry) => effectiveAmount >= entry.min)?.text ?? COVERS.at(-1)!.text,
    [effectiveAmount],
  )

  const sponsorable = dogs.filter((dog) => dog.sponsorMonthly > 0)
  const chosenDog = sponsorable.find((dog) => dog.id === target)

  const purpose = chosenDog
    ? `Donacija ${chosenDog.name}${recurring ? ' (mesečno)' : ''}`
    : `Donacija${recurring ? ' (mesečno)' : ''}`

  const copy = async (value: string, key: string) => {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(key)
      // Replaced rather than stacked: without clearing, copying a second field
      // let the first field's timer cut the new confirmation short.
      if (copyTimer.current) clearTimeout(copyTimer.current)
      copyTimer.current = setTimeout(() => setCopied(null), 1800)
    } catch {
      // Clipboard is unavailable (insecure context, denied permission) — the
      // value is on screen and selectable, so there is nothing to recover from.
    }
  }

  return (
    <div className="space-y-6 rounded-5xl border border-line bg-elevated p-6 sm:p-8">
      <fieldset>
        <legend className="text-sm font-medium text-ink">Koliko?</legend>
        <ul className="mt-4 grid grid-cols-3 gap-2">
          {AMOUNTS.map((value) => {
            const active = !custom && amount === value
            return (
              <li key={value}>
                <button
                  type="button"
                  onClick={() => {
                    setAmount(value)
                    setCustom('')
                    setReference(null)
                  }}
                  aria-pressed={active}
                  className={cn(
                    'relative w-full rounded-2xl border py-3.5 text-sm transition-colors',
                    active
                      ? 'border-brand text-brand-ink'
                      : 'border-line bg-sunken text-ink-muted hover:border-line-strong hover:text-ink',
                  )}
                >
                  {active ? (
                    <motion.span
                      layoutId="donate-amount-pill"
                      className="absolute inset-0 rounded-2xl bg-brand"
                      transition={spring.surface}
                    />
                  ) : null}
                  <span data-numeric className="relative z-10">
                    {formatRsd(value)}
                  </span>
                </button>
              </li>
            )
          })}
        </ul>

        <div className="mt-3">
          <label htmlFor="donate-custom" className="sr-only">
            Drugi iznos u dinarima
          </label>
          <input
            id="donate-custom"
            inputMode="numeric"
            value={custom}
            onChange={(event) => {
              setCustom(event.target.value.replace(/\D/g, ''))
              setReference(null)
            }}
            placeholder="Drugi iznos (RSD)"
            className="h-12 w-full rounded-2xl border border-line-interactive bg-sunken px-4 text-sm text-ink placeholder:text-ink-subtle focus:border-brand focus:outline-none focus:ring-4 focus:ring-brand/15"
          />
        </div>
      </fieldset>

      <fieldset>
        <legend className="text-sm font-medium text-ink">Koliko često?</legend>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <FrequencyOption
            active={!recurring}
            onClick={() => setRecurring(false)}
            icon={Zap}
            title="Jednokratno"
            hint="Jedna uplata"
          />
          <FrequencyOption
            active={recurring}
            onClick={() => setRecurring(true)}
            icon={Repeat}
            title="Mesečno"
            hint="Trajni nalog"
          />
        </div>
      </fieldset>

      <div>
        <label htmlFor="donate-target" className="text-sm font-medium text-ink">
          Kome?
        </label>
        <select
          id="donate-target"
          value={target}
          onChange={(event) => {
            setTarget(event.target.value)
            setReference(null)
          }}
          className="mt-3 h-12 w-full rounded-2xl border border-line-interactive bg-sunken px-4 text-sm text-ink focus:border-brand focus:outline-none focus:ring-4 focus:ring-brand/15"
        >
          <option value="opste">Tamo gde je najpotrebnije</option>
          {sponsorable.map((dog) => (
            <option key={dog.id} value={dog.id}>
              {dog.name} — {dog.city}
            </option>
          ))}
        </select>
      </div>

      <p
        className="rounded-2xl bg-brand/8 px-4 py-3 text-sm leading-relaxed text-brand-text"
        aria-live="polite"
      >
        {formatRsd(effectiveAmount)}
        {recurring ? ' mesečno' : ''} pokriva {covers}
        {chosenDog ? ` — za ${chosenDog.name}` : ''}.
      </p>

      <Button
        size="lg"
        full
        disabled={effectiveAmount < 100}
        onClick={() => setReference(createReference())}
      >
        <Landmark className="h-4 w-4" />
        {effectiveAmount < 100 ? 'Unesi iznos od bar 100 RSD' : 'Prikaži podatke za uplatu'}
      </Button>

      <AnimatePresence>
        {reference ? (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: duration.base, ease: ease.outExpo }}
            className="overflow-hidden"
          >
            <div className="space-y-3 rounded-3xl border border-line-interactive bg-sunken p-5">
              <p className="text-2xs uppercase tracking-[0.2em] text-ink-subtle">
                Podaci za uplatu
              </p>

              <CopyRow
                label="Primalac"
                value="Doggzy — udruženje građana"
                onCopy={copy}
                copied={copied}
                copyKey="primalac"
              />
              <CopyRow
                label="Račun"
                value="160-0000000000000-00"
                onCopy={copy}
                copied={copied}
                copyKey="racun"
                numeric
              />
              <CopyRow
                label="Iznos"
                value={String(effectiveAmount)}
                onCopy={copy}
                copied={copied}
                copyKey="iznos"
                numeric
              />
              <CopyRow
                label="Svrha"
                value={purpose}
                onCopy={copy}
                copied={copied}
                copyKey="svrha"
              />
              <CopyRow
                label="Poziv na broj"
                value={reference}
                onCopy={copy}
                copied={copied}
                copyKey="poziv"
                numeric
              />

              <p className="pt-2 text-xs leading-relaxed text-ink-subtle">
                Poziv na broj nam govori na šta se uplata odnosi, pa je unosimo u dnevnik psa. Broj
                računa je primer dok se registracija ne završi — pre uplate nam piši na
                zdravo@doggzy.rs da potvrdimo aktuelne podatke.
              </p>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}

function FrequencyOption({
  active,
  onClick,
  icon: Icon,
  title,
  hint,
}: {
  active: boolean
  onClick: () => void
  icon: typeof Zap
  title: string
  hint: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        'flex items-center gap-3 rounded-2xl border p-3.5 text-left transition-colors',
        active ? 'border-brand bg-brand/10' : 'border-line bg-sunken hover:border-line-strong',
      )}
    >
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-elevated text-brand">
        <Icon className="h-4 w-4" aria-hidden="true" />
      </span>
      <span>
        <span className="block text-sm text-ink">{title}</span>
        <span className="block text-xs text-ink-subtle">{hint}</span>
      </span>
    </button>
  )
}

function CopyRow({
  label,
  value,
  onCopy,
  copied,
  copyKey,
  numeric = false,
}: {
  label: string
  value: string
  onCopy: (value: string, key: string) => void
  copied: string | null
  copyKey: string
  numeric?: boolean
}) {
  const isCopied = copied === copyKey
  return (
    <div className="flex items-center justify-between gap-4 border-t border-line pt-3 first-of-type:border-0 first-of-type:pt-0">
      <div className="min-w-0">
        <p className="text-xs text-ink-subtle">{label}</p>
        <p {...(numeric ? { 'data-numeric': '' } : {})} className="truncate text-sm text-ink">
          {value}
        </p>
      </div>
      <button
        type="button"
        onClick={() => onCopy(value, copyKey)}
        aria-label={`Kopiraj: ${label}`}
        className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-line text-ink-muted transition-colors hover:border-line-strong hover:text-ink"
      >
        {isCopied ? <Check className="h-4 w-4 text-positive" /> : <Copy className="h-4 w-4" />}
      </button>
    </div>
  )
}
