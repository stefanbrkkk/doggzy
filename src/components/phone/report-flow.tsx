'use client'

import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Camera,
  Check,
  Crosshair,
  Loader2,
  MapPin,
  PawPrint,
  Search,
  X,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { duration, ease, spring } from '@/lib/motion'
import { reportSchema, type ReportDraft, type ReportKind } from '@/lib/schemas'
import { MiniMap } from './mini-map'
import { useReducedMotionSafe } from '@/lib/use-reduced-motion-safe'

const KINDS: {
  value: ReportKind
  label: string
  hint: string
  icon: typeof Search
  tone: string
}[] = [
  {
    value: 'nestao',
    label: 'Nestao mi je pas',
    hint: 'Objavljujemo potragu u tvom kraju',
    icon: Search,
    tone: 'text-brand-text',
  },
  {
    value: 'pronadjen',
    label: 'Našao sam psa',
    hint: 'Uparujemo sa prijavama nestalih',
    icon: PawPrint,
    tone: 'text-accent-text',
  },
  {
    value: 'ugrozen',
    label: 'Pas je u opasnosti',
    hint: 'Prosleđujemo najbližoj ekipi',
    icon: AlertTriangle,
    tone: 'text-critical',
  },
]

const SIZES = ['Mali', 'Srednji', 'Veliki'] as const
const COLORS = ['Crn', 'Beo', 'Braon', 'Riđ', 'Šaren', 'Siv'] as const

interface FormState {
  kind: ReportKind | null
  location: string
  size: string
  colors: string[]
  description: string
  contactName: string
  contactValue: string
}

const EMPTY: FormState = {
  kind: null,
  location: '',
  size: '',
  colors: [],
  description: '',
  contactName: '',
  contactValue: '',
}

const STEP_TITLES = ['Šta se dešava?', 'Gde?', 'Kako izgleda?', 'Kako da te dobijemo?', 'Poslato']

export interface ReportFlowProps {
  /** Called with the validated draft. Should resolve to a case reference. */
  onSubmit?: (draft: ReportDraft, photo: File | null) => Promise<string>
  className?: string
}

/**
 * The lost/found/endangered dog report, as a five-step app.
 *
 * Runs inside <PhoneFrame> but is a plain accessible form: every step is a
 * fieldset with a legend, step changes are announced through a live region,
 * focus follows the visible step, and nothing depends on the pointer.
 */
export function ReportFlow({ onSubmit, className }: ReportFlowProps) {
  const reduced = useReducedMotionSafe()
  const liveId = useId()

  const [step, setStep] = useState(0)
  const [direction, setDirection] = useState<1 | -1>(1)
  const [form, setForm] = useState<FormState>(EMPTY)
  const [photo, setPhoto] = useState<File | null>(null)
  const [photoUrl, setPhotoUrl] = useState<string | null>(null)
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({})
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [reference, setReference] = useState<string | null>(null)
  const [locating, setLocating] = useState(false)

  const headingRef = useRef<HTMLParagraphElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const didMount = useRef(false)

  useEffect(() => {
    return () => {
      if (photoUrl) URL.revokeObjectURL(photoUrl)
    }
  }, [photoUrl])

  // Move focus and reset the scroll position when the step *changes*.
  // Deliberately skipped on mount: focusing here on first paint would pull the
  // viewport down to the phone and past the hero.
  useEffect(() => {
    if (!didMount.current) {
      didMount.current = true
      return
    }
    headingRef.current?.focus({ preventScroll: true })
    scrollRef.current?.scrollTo({ top: 0 })
  }, [step])

  const set = useCallback(<K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((previous) => ({ ...previous, [key]: value }))
    setErrors((previous) => (previous[key] ? { ...previous, [key]: undefined } : previous))
  }, [])

  /** Validates only the fields the current step owns. */
  const validateStep = useCallback(
    (index: number): boolean => {
      const next: Partial<Record<keyof FormState, string>> = {}

      if (index === 0 && !form.kind) next.kind = 'Izaberi jednu opciju.'
      if (index === 1) {
        const result = reportSchema.shape.location.safeParse(form.location)
        if (!result.success) next.location = result.error.issues[0]?.message
      }
      if (index === 2) {
        const size = reportSchema.shape.size.safeParse(form.size)
        if (!size.success) next.size = size.error.issues[0]?.message
        const colors = reportSchema.shape.colors.safeParse(form.colors)
        if (!colors.success) next.colors = colors.error.issues[0]?.message
        const description = reportSchema.shape.description.safeParse(form.description)
        if (!description.success) next.description = description.error.issues[0]?.message
      }
      if (index === 3) {
        const name = reportSchema.shape.contactName.safeParse(form.contactName)
        if (!name.success) next.contactName = name.error.issues[0]?.message
        const value = reportSchema.shape.contactValue.safeParse(form.contactValue)
        if (!value.success) next.contactValue = value.error.issues[0]?.message
      }

      setErrors(next)
      return Object.keys(next).length === 0
    },
    [form],
  )

  const goNext = useCallback(async () => {
    if (!validateStep(step)) return

    if (step < 3) {
      setDirection(1)
      setStep((current) => current + 1)
      return
    }

    const parsed = reportSchema.safeParse(form)
    if (!parsed.success) return

    setStatus('sending')
    try {
      const result = onSubmit
        ? await onSubmit(parsed.data, photo)
        : `DG-${Math.random().toString(36).slice(2, 7).toUpperCase()}`
      setReference(result)
      setStatus('sent')
      setDirection(1)
      setStep(4)
    } catch {
      setStatus('error')
    }
  }, [form, onSubmit, photo, step, validateStep])

  const goBack = useCallback(() => {
    setDirection(-1)
    // Also clears a failed send: without this, stepping back and forward again
    // still showed the old error above an untouched form.
    setStatus((current) => (current === 'error' ? 'idle' : current))
    setStep((current) => Math.max(0, current - 1))
  }, [])

  const useMyLocation = useCallback(() => {
    if (!('geolocation' in navigator)) {
      setErrors((previous) => ({ ...previous, location: 'Uređaj ne deli lokaciju.' }))
      return
    }
    setLocating(true)
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        set('location', `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`)
        setLocating(false)
      },
      () => {
        setLocating(false)
        setErrors((previous) => ({
          ...previous,
          location: 'Nismo dobili lokaciju. Upiši je ručno.',
        }))
      },
      { enableHighAccuracy: true, timeout: 8000 },
    )
  }, [set])

  const reset = useCallback(() => {
    setForm(EMPTY)
    setPhoto(null)
    if (photoUrl) URL.revokeObjectURL(photoUrl)
    setPhotoUrl(null)
    setReference(null)
    setStatus('idle')
    setDirection(-1)
    setStep(0)
  }, [photoUrl])

  const variants = useMemo(
    () => ({
      enter: (dir: number) => (reduced ? { opacity: 0 } : { opacity: 0, x: dir * 40 }),
      center: reduced
        ? { opacity: 1, transition: { duration: duration.fast } }
        : { opacity: 1, x: 0, transition: { duration: duration.base, ease: ease.outExpo } },
      exit: (dir: number) =>
        reduced
          ? { opacity: 0, transition: { duration: duration.instant } }
          : { opacity: 0, x: dir * -40, transition: { duration: duration.fast, ease: ease.swift } },
    }),
    [reduced],
  )

  return (
    <div className={cn('flex h-full flex-col', className)}>
      <ProgressRail step={step} />

      {/* The live region and the focus target are separate elements. Combining
          them makes several screen-reader/browser pairs announce the step
          twice — once for the focus move, once for the live update. */}
      <p id={liveId} aria-live="polite" className="sr-only">
        {`Korak ${Math.min(step + 1, STEP_TITLES.length)} od ${STEP_TITLES.length}: ${STEP_TITLES[step]}`}
      </p>
      <p
        ref={headingRef}
        tabIndex={-1}
        className="px-5 pb-1 pt-3 text-[13px] font-medium text-ink outline-none"
      >
        {STEP_TITLES[step]}
      </p>

      {/* `justify-center` on the track, not `h-full` on the panel. The device is
          a fixed 9:19.5, and on /prijava the tallest step still leaves ~340px
          under it — top-anchored that reads as an unfinished screen, centred it
          reads as breathing room. `my-auto` yields as soon as a step is taller
          than the track, so the flow still scrolls on short viewports. */}
      <div
        ref={scrollRef}
        className="flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain px-5 pb-3"
      >
        <AnimatePresence mode="wait" custom={direction} initial={false}>
          <motion.div
            key={step}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            className="my-auto w-full shrink-0"
          >
            {step === 0 ? (
              <StepKind
                value={form.kind}
                error={errors.kind}
                onChange={(kind) => set('kind', kind)}
              />
            ) : null}

            {step === 1 ? (
              <StepLocation
                value={form.location}
                error={errors.location}
                locating={locating}
                onChange={(value) => set('location', value)}
                onLocate={useMyLocation}
              />
            ) : null}

            {step === 2 ? (
              <StepAppearance
                form={form}
                errors={errors}
                photoUrl={photoUrl}
                onSize={(size) => set('size', size)}
                onToggleColor={(color) =>
                  set(
                    'colors',
                    form.colors.includes(color)
                      ? form.colors.filter((c) => c !== color)
                      : [...form.colors, color],
                  )
                }
                onDescription={(value) => set('description', value)}
                onPhoto={(file) => {
                  if (photoUrl) URL.revokeObjectURL(photoUrl)
                  setPhoto(file)
                  setPhotoUrl(file ? URL.createObjectURL(file) : null)
                }}
              />
            ) : null}

            {step === 3 ? (
              <StepContact
                form={form}
                errors={errors}
                status={status}
                onName={(value) => set('contactName', value)}
                onValue={(value) => set('contactValue', value)}
              />
            ) : null}

            {step === 4 ? <StepDone reference={reference} onReset={reset} /> : null}
          </motion.div>
        </AnimatePresence>
      </div>

      {step < 4 ? (
        <div className="flex items-center gap-2 border-t border-line px-4 py-3">
          {step > 0 ? (
            <button
              type="button"
              onClick={goBack}
              className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-line text-ink-muted transition-colors hover:bg-elevated hover:text-ink"
              aria-label="Nazad"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
          ) : null}
          <button
            type="button"
            onClick={goNext}
            disabled={status === 'sending'}
            className="group/next flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-brand text-sm font-medium text-brand-ink transition-[transform,filter] hover:brightness-110 active:scale-[0.98] disabled:opacity-60"
          >
            {status === 'sending' ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Šaljem…
              </>
            ) : (
              <>
                {step === 3 ? 'Pošalji prijavu' : 'Dalje'}
                <ArrowRight className="h-4 w-4 transition-transform duration-300 ease-out-expo group-hover/next:translate-x-1" />
              </>
            )}
          </button>
        </div>
      ) : null}
    </div>
  )
}

function ProgressRail({ step }: { step: number }) {
  return (
    <div
      className="flex gap-1.5 px-5 pt-1"
      role="progressbar"
      aria-valuemin={1}
      aria-valuemax={5}
      aria-valuenow={step + 1}
      aria-label="Napredak prijave"
    >
      {STEP_TITLES.map((title, index) => (
        <span key={title} className="h-1 flex-1 overflow-hidden rounded-full bg-line-strong">
          <motion.span
            className="block h-full origin-left rounded-full bg-brand"
            initial={false}
            animate={{ scaleX: index <= step ? 1 : 0 }}
            transition={{ duration: duration.base, ease: ease.outExpo }}
          />
        </span>
      ))}
    </div>
  )
}

/**
 * Field error.
 *
 * Carries an id so the control it belongs to can point at it with
 * `aria-describedby`: `role="alert"` announces the message once when it
 * appears, but a screen-reader user who tabs back to the field afterwards has
 * no way to hear it again without the association.
 */
function FieldError({ id, children }: { id?: string; children?: string }) {
  if (!children) return null
  return (
    <p id={id} role="alert" className="mt-1.5 text-xs text-critical">
      {children}
    </p>
  )
}

/**
 * The phone's own control sizing, but the design system's states.
 *
 * `aria-invalid` is set on every input here, and without the variant the field
 * kept a neutral border while a red message appeared underneath it — the site's
 * error state missing from the site's flagship interaction.
 */
const inputClass = [
  'w-full rounded-xl border border-line-interactive bg-sunken px-3.5 py-2.5 text-sm text-ink',
  'placeholder:text-ink-subtle',
  'transition-[border-color,box-shadow] duration-200 ease-swift',
  'focus:border-brand focus:outline-none focus:ring-4 focus:ring-brand/15',
  'aria-invalid:border-critical aria-invalid:ring-4 aria-invalid:ring-critical/15',
].join(' ')

function StepKind({
  value,
  error,
  onChange,
}: {
  value: ReportKind | null
  error?: string
  onChange: (kind: ReportKind) => void
}) {
  return (
    <fieldset className="space-y-2.5">
      <legend className="sr-only">Tip prijave</legend>
      {KINDS.map((kind) => {
        const Icon = kind.icon
        const active = value === kind.value
        return (
          <button
            key={kind.value}
            type="button"
            onClick={() => onChange(kind.value)}
            aria-pressed={active}
            className={cn(
              'flex w-full items-center gap-3 rounded-2xl border p-3 text-left transition-colors',
              active
                ? 'border-brand bg-brand/10'
                : 'border-line bg-elevated hover:border-line-strong',
            )}
          >
            <span
              className={cn(
                'grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-sunken',
                kind.tone,
              )}
            >
              <Icon className="h-[18px] w-[18px]" />
            </span>
            <span className="min-w-0">
              <span className="block text-sm font-medium text-ink">{kind.label}</span>
              <span className="block text-xs text-ink-subtle">{kind.hint}</span>
            </span>
            <AnimatePresence>
              {active ? (
                <motion.span
                  className="ml-auto grid h-6 w-6 shrink-0 place-items-center rounded-full bg-brand text-brand-ink"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  transition={spring.pop}
                >
                  <Check className="h-3.5 w-3.5" />
                </motion.span>
              ) : null}
            </AnimatePresence>
          </button>
        )
      })}
      <FieldError>{error}</FieldError>
    </fieldset>
  )
}

function StepLocation({
  value,
  error,
  locating,
  onChange,
  onLocate,
}: {
  value: string
  error?: string
  locating: boolean
  onChange: (value: string) => void
  onLocate: () => void
}) {
  return (
    <fieldset className="space-y-3">
      <legend className="sr-only">Lokacija</legend>

      <div className="overflow-hidden rounded-2xl border border-line">
        <MiniMap active={value.length > 0} />
      </div>

      <div>
        <label htmlFor="report-location" className="sr-only">
          Naselje, ulica ili koordinate
        </label>
        <div className="relative">
          <MapPin
            aria-hidden="true"
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-subtle"
          />
          <input
            id="report-location"
            value={value}
            onChange={(event) => onChange(event.target.value)}
            placeholder="Npr. Vračar, Njegoševa"
            aria-invalid={Boolean(error)}
            aria-describedby={error ? 'report-location-error' : undefined}
            className={cn(inputClass, 'pl-9')}
          />
        </div>
        <FieldError id="report-location-error">{error}</FieldError>
      </div>

      <button
        type="button"
        onClick={onLocate}
        disabled={locating}
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-line py-2.5 text-sm text-ink-muted transition-colors hover:border-line-strong hover:text-ink disabled:opacity-60"
      >
        {locating ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Crosshair className="h-4 w-4" />
        )}
        Koristi moju lokaciju
      </button>
    </fieldset>
  )
}

function StepAppearance({
  form,
  errors,
  photoUrl,
  onSize,
  onToggleColor,
  onDescription,
  onPhoto,
}: {
  form: FormState
  errors: Partial<Record<keyof FormState, string>>
  photoUrl: string | null
  onSize: (size: string) => void
  onToggleColor: (color: string) => void
  onDescription: (value: string) => void
  onPhoto: (file: File | null) => void
}) {
  return (
    <div className="space-y-4">
      <fieldset>
        <legend className="mb-2 text-xs font-medium text-ink-muted">Veličina</legend>
        <div className="flex gap-2">
          {SIZES.map((size) => (
            <Chip key={size} active={form.size === size} onClick={() => onSize(size)}>
              {size}
            </Chip>
          ))}
        </div>
        <FieldError>{errors.size}</FieldError>
      </fieldset>

      <fieldset>
        <legend className="mb-2 text-xs font-medium text-ink-muted">Boja</legend>
        <div className="flex flex-wrap gap-2">
          {COLORS.map((color) => (
            <Chip
              key={color}
              active={form.colors.includes(color)}
              onClick={() => onToggleColor(color)}
            >
              {color}
            </Chip>
          ))}
        </div>
        <FieldError>{errors.colors}</FieldError>
      </fieldset>

      <div>
        <label htmlFor="report-photo" className="mb-2 block text-xs font-medium text-ink-muted">
          Fotografija (nije obavezna)
        </label>
        {photoUrl ? (
          <div className="relative overflow-hidden rounded-2xl border border-line">
            {/* Preview of a locally selected file; never uploaded until submit. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={photoUrl}
              alt="Izabrana fotografija psa"
              className="h-32 w-full object-cover"
            />
            <button
              type="button"
              onClick={() => onPhoto(null)}
              aria-label="Ukloni fotografiju"
              className="absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-full bg-black/60 text-white backdrop-blur"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ) : (
          <label
            htmlFor="report-photo"
            className="group relative flex h-24 cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-2xl border border-dashed border-line-strong text-sm text-ink-subtle transition-colors hover:border-brand hover:text-ink"
          >
            <Camera className="h-4 w-4" />
            Dodaj fotografiju
            <span
              aria-hidden="true"
              data-decor
              className="pointer-events-none absolute inset-x-0 top-0 h-8 bg-linear-to-b from-brand/25 to-transparent animate-scan"
            />
          </label>
        )}
        <input
          id="report-photo"
          type="file"
          accept="image/*"
          capture="environment"
          className="sr-only"
          onChange={(event) => {
            onPhoto(event.target.files?.[0] ?? null)
            // Cleared so choosing the *same* file again still fires a change
            // event. Otherwise removing a photo and re-picking it does nothing.
            event.target.value = ''
          }}
        />
      </div>

      <div>
        <label
          htmlFor="report-description"
          className="mb-2 block text-xs font-medium text-ink-muted"
        >
          Opis
        </label>
        <textarea
          id="report-description"
          rows={3}
          value={form.description}
          onChange={(event) => onDescription(event.target.value)}
          placeholder="Rasa, ogrlica, ponašanje, kad je poslednji put viđen…"
          aria-invalid={Boolean(errors.description)}
          aria-describedby={errors.description ? 'report-description-error' : undefined}
          className={cn(inputClass, 'resize-none')}
        />
        <FieldError id="report-description-error">{errors.description}</FieldError>
      </div>
    </div>
  )
}

function StepContact({
  form,
  errors,
  status,
  onName,
  onValue,
}: {
  form: FormState
  errors: Partial<Record<keyof FormState, string>>
  status: 'idle' | 'sending' | 'sent' | 'error'
  onName: (value: string) => void
  onValue: (value: string) => void
}) {
  return (
    <fieldset className="space-y-4">
      <legend className="sr-only">Kontakt</legend>

      <div>
        <label htmlFor="report-name" className="mb-2 block text-xs font-medium text-ink-muted">
          Ime
        </label>
        <input
          id="report-name"
          value={form.contactName}
          onChange={(event) => onName(event.target.value)}
          autoComplete="given-name"
          aria-invalid={Boolean(errors.contactName)}
          aria-describedby={errors.contactName ? 'report-name-error' : undefined}
          className={inputClass}
        />
        <FieldError id="report-name-error">{errors.contactName}</FieldError>
      </div>

      <div>
        <label htmlFor="report-contact" className="mb-2 block text-xs font-medium text-ink-muted">
          Telefon ili email
        </label>
        <input
          id="report-contact"
          value={form.contactValue}
          onChange={(event) => onValue(event.target.value)}
          autoComplete="tel"
          inputMode="tel"
          aria-invalid={Boolean(errors.contactValue)}
          aria-describedby={errors.contactValue ? 'report-contact-error' : undefined}
          className={inputClass}
        />
        <FieldError id="report-contact-error">{errors.contactValue}</FieldError>
      </div>

      <p className="rounded-xl bg-elevated p-3 text-xs leading-relaxed text-ink-subtle">
        Kontakt vidi samo naš tim. Javno se objavljuju samo opis, lokacija i fotografija.
      </p>

      {status === 'error' ? (
        <p role="alert" className="text-xs text-critical">
          Slanje nije uspelo. Pokušaj ponovo za koji trenutak.
        </p>
      ) : null}
    </fieldset>
  )
}

function StepDone({ reference, onReset }: { reference: string | null; onReset: () => void }) {
  const reduced = useReducedMotionSafe()

  return (
    <div className="flex h-full flex-col items-center justify-center gap-5 pb-6 text-center">
      <div className="relative grid h-20 w-20 place-items-center">
        {/* MotionConfig's reduced-motion handling suppresses transforms but not
            an infinite opacity keyframe, so the rings are skipped outright. */}
        {reduced
          ? null
          : [0, 0.7].map((delay) => (
              <motion.span
                key={delay}
                className="absolute inset-0 rounded-full border border-brand/40"
                animate={{ scale: [1, 1.9], opacity: [0.8, 0] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: ease.outQuart, delay }}
              />
            ))}
        <motion.span
          className="grid h-14 w-14 place-items-center rounded-full bg-brand text-brand-ink"
          initial={{ scale: 0, rotate: -30 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={spring.pop}
        >
          <Check className="h-6 w-6" />
        </motion.span>
      </div>

      <div className="space-y-1.5">
        <p className="text-base font-medium text-ink">Prijava je primljena</p>
        <p className="text-xs leading-relaxed text-ink-subtle">
          Javljamo se u roku od 2 sata. Ako je pas u neposrednoj opasnosti, zovi i 112.
        </p>
      </div>

      {reference ? (
        <p className="rounded-xl border border-line bg-elevated px-4 py-2">
          <span className="block text-[10px] uppercase tracking-widest text-ink-subtle">
            Broj prijave
          </span>
          <span data-numeric className="text-sm text-ink">
            {reference}
          </span>
        </p>
      ) : null}

      <button
        type="button"
        onClick={onReset}
        className="text-xs text-ink-muted underline underline-offset-4 hover:text-ink"
      >
        Pošalji još jednu prijavu
      </button>
    </div>
  )
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        // The chip reads ~30px tall by design; the pseudo-element grows the
        // touch target to ~46px without changing the layout, so the row still
        // fits inside a phone-width column.
        'relative inline-flex min-h-[30px] items-center rounded-full border px-3.5 text-xs transition-colors',
        "after:absolute after:inset-x-0 after:-inset-y-2 after:content-['']",
        active
          ? 'border-brand bg-brand text-brand-ink'
          : 'border-line bg-elevated text-ink-muted hover:border-line-strong hover:text-ink',
      )}
    >
      {children}
    </button>
  )
}
