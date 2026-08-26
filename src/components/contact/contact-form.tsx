'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, Loader2, Send } from 'lucide-react'
import { duration, ease, spring } from '@/lib/motion'
import { contactSchema, type ContactDraft } from '@/lib/schemas'
import { Button } from '@/components/ui/button'
import { Field, Input, Select, Textarea } from '@/components/ui/field'

type Errors = Partial<Record<keyof ContactDraft, string>>

const TOPICS: { value: ContactDraft['topic']; label: string }[] = [
  { value: 'opste', label: 'Opšte pitanje' },
  { value: 'saradnja', label: 'Saradnja' },
  { value: 'sklonište', label: 'Vodim sklonište ili ambulantu' },
  { value: 'mediji', label: 'Mediji' },
  { value: 'donacije', label: 'Donacije' },
]

export function ContactForm() {
  const [values, setValues] = useState<ContactDraft>({
    name: '',
    email: '',
    topic: 'opste',
    message: '',
    company: '',
  })
  const [errors, setErrors] = useState<Errors>({})
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  const set = <K extends keyof ContactDraft>(key: K, value: ContactDraft[K]) => {
    setValues((previous) => ({ ...previous, [key]: value }))
    setErrors((previous) => (previous[key] ? { ...previous, [key]: undefined } : previous))
  }

  const submit = async (event: React.FormEvent) => {
    event.preventDefault()

    // Cleared before validating, not after sending. A failed send left its
    // alert on screen through the next submit, so a form that never reached the
    // network still told the visitor the send had failed.
    setStatus((current) => (current === 'error' ? 'idle' : current))

    const parsed = contactSchema.safeParse(values)
    if (!parsed.success) {
      const next: Errors = {}
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof ContactDraft | undefined
        if (key && !next[key]) next[key] = issue.message
      }
      setErrors(next)
      return
    }

    setStatus('sending')
    try {
      const response = await fetch('/api/kontakt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed.data),
      })
      if (!response.ok) throw new Error(String(response.status))
      setStatus('sent')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'sent') {
    return (
      <div className="flex flex-col items-center gap-5 rounded-5xl border border-line bg-elevated px-8 py-20 text-center">
        <motion.span
          className="grid h-16 w-16 place-items-center rounded-full bg-brand text-brand-ink"
          initial={{ scale: 0, rotate: -30 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={spring.pop}
        >
          <Check className="h-7 w-7" />
        </motion.span>
        <div className="space-y-2">
          <p className="text-headline text-ink">Poruka je poslata</p>
          <p className="text-sm text-ink-muted">Javljamo se u roku od dva radna dana.</p>
        </div>
        <button
          type="button"
          onClick={() => {
            setValues({ name: '', email: '', topic: 'opste', message: '', company: '' })
            setStatus('idle')
          }}
          className="text-sm text-ink-muted underline underline-offset-4 hover:text-ink"
        >
          Pošalji još jednu
        </button>
      </div>
    )
  }

  return (
    <form
      onSubmit={submit}
      noValidate
      className="space-y-5 rounded-5xl border border-line bg-elevated p-6 sm:p-8"
    >
      {/* Honeypot: hidden from people, irresistible to naive bots. */}
      <div aria-hidden="true" className="absolute h-0 w-0 overflow-hidden">
        <label htmlFor="contact-company">Firma</label>
        <input
          id="contact-company"
          tabIndex={-1}
          autoComplete="off"
          value={values.company}
          onChange={(event) => set('company', event.target.value)}
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Ime" required error={errors.name}>
          {({ id, describedBy, invalid }) => (
            <Input
              id={id}
              value={values.name}
              onChange={(event) => set('name', event.target.value)}
              autoComplete="name"
              aria-describedby={describedBy}
              aria-invalid={invalid}
            />
          )}
        </Field>

        <Field label="Email" required error={errors.email}>
          {({ id, describedBy, invalid }) => (
            <Input
              id={id}
              type="email"
              value={values.email}
              onChange={(event) => set('email', event.target.value)}
              autoComplete="email"
              aria-describedby={describedBy}
              aria-invalid={invalid}
            />
          )}
        </Field>
      </div>

      <Field label="Tema" error={errors.topic}>
        {({ id, describedBy }) => (
          <Select
            id={id}
            value={values.topic}
            onChange={(event) => set('topic', event.target.value as ContactDraft['topic'])}
            aria-describedby={describedBy}
          >
            {TOPICS.map((topic) => (
              <option key={topic.value} value={topic.value}>
                {topic.label}
              </option>
            ))}
          </Select>
        )}
      </Field>

      <Field
        label="Poruka"
        required
        error={errors.message}
        hint="Što konkretnije, to brže možemo da odgovorimo."
      >
        {({ id, describedBy, invalid }) => (
          <Textarea
            id={id}
            value={values.message}
            onChange={(event) => set('message', event.target.value)}
            aria-describedby={describedBy}
            aria-invalid={invalid}
          />
        )}
      </Field>

      <AnimatePresence>
        {status === 'error' ? (
          <motion.p
            role="alert"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: duration.fast, ease: ease.swift }}
            className="text-sm text-critical"
          >
            Slanje nije uspelo. Probaj ponovo ili nam piši direktno na zdravo@doggzy.rs.
          </motion.p>
        ) : null}
      </AnimatePresence>

      <Button type="submit" size="lg" full disabled={status === 'sending'}>
        {status === 'sending' ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Šaljem…
          </>
        ) : (
          <>
            <Send className="h-4 w-4" />
            Pošalji poruku
          </>
        )}
      </Button>
    </form>
  )
}
