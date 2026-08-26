'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, Copy, Landmark, Repeat, Zap } from 'lucide-react'
import { cn, formatRsd } from '@/lib/utils'
import { duration, ease, spring } from '@/lib/motion'
import { dogs } from '@/content/dogs'
import { createReference } from '@/lib/schemas'
import { Button } from '@/components/ui/button'
import { Select } from '@/components/ui/field'

const AMOUNTS = [600, 1200, 2600, 5200, 9000, 22000]

/**
 * Each `min` is an invoice that exists on a dog's page, in the accusative so it
 * reads after "pokriva". The figures used to be written from memory, which is
 * how the same named item came to cost 2.600 here and 3.800 in the ledger.
 * `scripts/check-figures.mjs` fails the build if a `min` stops matching a real
 * ledger cost.
 */
const COVERS: { min: number; text: string }[] = [
  { min: 22000, text: 'previjanje rane, osam nedelja' },
  { min: 9600, text: 'kapi za oči za godinu dana' },
  { min: 9000, text: 'sterilizaciju jednog psa' },
  { min: 7400, text: 'antibiotike posle operacije' },
  { min: 6000, text: 'hranu za jednog psa do udomljenja' },
  { min: 5200, text: 'kontrolu kod oftalmologa' },
  { min: 4500, text: 'kontrolni pregled noge' },
  { min: 3800, text: 'vakcinu i čipovanje' },
  { min: 2600, text: 'drugu vakcinu' },
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

  const sponsorable = dogs.filter((dog) => dog.sponsorMonthly > 0)
  const chosenDog = sponsorable.find((dog) => dog.id === target)

  /**
   * What this amount pays for, on the chosen dog's own page.
   *
   * COVERS is the whole site's ledger, so pairing it with a named dog produced
   * sentences like "22.000 RSD pokriva previjanje rane — za Pahulju" when
   * Pahulja's page carries no bandaging at all. Once a dog is picked, the item
   * has to come from that dog's own needs, and it is quoted by its exact label
   * rather than paraphrased — a label lifted verbatim needs no case agreement,
   * and it is the string the reader will find when they go and check.
   */
  const covers = useMemo(() => {
    if (chosenDog) {
      const own = [...chosenDog.needs].sort((a, b) => b.cost - a.cost)
      const match = own.find((need) => effectiveAmount >= need.cost)
      if (match) return `stavku „${match.label}”`
      // Tesla is the one male dog on the sponsorship list, so the possessive
      // cannot be hardcoded.
      return `deo troškova ${chosenDog.sex === 'ženka' ? 'njene' : 'njegove'} nege`
    }
    return COVERS.find((entry) => effectiveAmount >= entry.min)?.text ?? COVERS.at(-1)!.text
  }, [chosenDog, effectiveAmount])

  const purpose = chosenDog
    ? `Donacija za ${chosenDog.nameAccusative}${recurring ? ' (mesečno)' : ''}`
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
        {/* Two columns on the narrowest phones: at 320px a third of the row is
            80px and the widest amount renders 84px, so the figure spilled
            outside its own pill. */}
        <ul className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
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
        {/* One column below `sm`: half of a 320px viewport leaves 49px for the
            label, and „Jednokratno” is 75px — the word painted outside its own
            border. */}
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
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
        {/* The shared control, not a hand-rolled one: this select used to keep
            the OS arrow and a different corner radius from the other two on
            the site. */}
        <Select
          id="donate-target"
          value={target}
          onChange={(event) => {
            setTarget(event.target.value)
            setReference(null)
          }}
          className="mt-3 text-sm"
        >
          <option value="opste">Tamo gde je najpotrebnije</option>
          {sponsorable.map((dog) => (
            <option key={dog.id} value={dog.id}>
              {dog.name} — {dog.city}
            </option>
          ))}
        </Select>
      </div>

      <p
        className="rounded-2xl bg-brand/8 px-4 py-3 text-sm leading-relaxed text-brand-text"
        aria-live="polite"
      >
        {formatRsd(effectiveAmount)}
        {recurring ? ' mesečno' : ''} pokriva {covers}
        {chosenDog ? ` — za ${chosenDog.nameAccusative}` : ''}.
      </p>

      {/* Above the button, not inside the panel it opens. Registration is not
          finished, so the account number below is a placeholder — a visitor
          should know that before they decide to press anything, not after. */}
      <p className="rounded-2xl border border-line bg-sunken px-4 py-3 text-xs leading-relaxed text-ink-muted">
        Registracija udruženja je u toku, pa je broj računa ispod još uvek primer. Piši nam na{' '}
        <a
          href="mailto:zdravo@doggzy.rs"
          className="text-ink underline decoration-line-strong underline-offset-2"
        >
          zdravo@doggzy.rs
        </a>{' '}
        pre uplate da potvrdimo aktuelne podatke.
      </p>

      <Button
        size="lg"
        full
        disabled={effectiveAmount < 100}
        onClick={() => setReference(createReference())}
      >
        <Landmark className="h-4 w-4" />
        {effectiveAmount < 100 ? 'Unesi iznos od bar 100 RSD' : 'Prikaži uputstvo za uplatu'}
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
      {/* `min-w-0`, so the labels wrap instead of pushing the button wider than
          its grid column — at 320px the content ran 20px past the border. */}
      <span className="min-w-0">
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
