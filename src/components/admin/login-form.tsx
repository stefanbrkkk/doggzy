'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Loader2, LogIn } from 'lucide-react'
import { duration, ease } from '@/lib/motion'
import { Button } from '@/components/ui/button'
import { Field, Input } from '@/components/ui/field'
import { LogoMark } from '@/components/ui/logo'

export function AdminLoginForm({ configured }: { configured: boolean }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const next = searchParams.get('dalje')

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

  const submit = async (event: React.FormEvent) => {
    event.preventDefault()
    setPending(true)
    setError(null)

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = (await response.json()) as { error?: string }

      if (!response.ok) {
        setError(data.error ?? 'Prijava nije uspela.')
        setPassword('')
        return
      }

      // `refresh()` re-runs the middleware so the new cookie is picked up.
      router.replace(next && next.startsWith('/admin') ? next : '/admin')
      router.refresh()
    } catch {
      setError('Mreža ne odgovara. Pokušaj ponovo.')
    } finally {
      setPending(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: duration.slow, ease: ease.outExpo }}
      className="rounded-5xl border border-line bg-elevated p-8"
    >
      <div className="flex flex-col items-center gap-4 text-center">
        <LogoMark className="h-11 w-11" />
        <div>
          <h1 className="text-headline text-ink">Doggzy admin</h1>
          <p className="mt-1 text-sm text-ink-muted">Pristup samo za tim.</p>
        </div>
      </div>

      {!configured ? (
        <div className="mt-7 rounded-2xl border border-critical/25 bg-critical/8 p-4 text-sm leading-relaxed text-ink">
          Prijava nije podešena na ovom okruženju. Potrebne su promenljive{' '}
          <code className="font-mono text-xs">AUTH_SECRET</code>,{' '}
          <code className="font-mono text-xs">ADMIN_EMAIL</code> i{' '}
          <code className="font-mono text-xs">ADMIN_PASSWORD_HASH</code>. Heš se generiše sa{' '}
          <code className="font-mono text-xs">npm run admin:hash</code>.
        </div>
      ) : null}

      <form onSubmit={submit} noValidate className="mt-7 space-y-5">
        <Field label="Email" required>
          {({ id }) => (
            <Input
              id={id}
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="username"
              required
              disabled={!configured}
            />
          )}
        </Field>

        <Field label="Lozinka" required>
          {({ id }) => (
            <div className="relative">
              <Input
                id={id}
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="current-password"
                required
                disabled={!configured}
                className="pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                aria-label={showPassword ? 'Sakrij lozinku' : 'Prikaži lozinku'}
                className="absolute right-1.5 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-lg text-ink-subtle transition-colors hover:text-ink"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          )}
        </Field>

        {error ? (
          <p role="alert" className="text-sm text-critical">
            {error}
          </p>
        ) : null}

        <Button type="submit" size="lg" full disabled={pending || !configured}>
          {pending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Prijavljujem…
            </>
          ) : (
            <>
              <LogIn className="h-4 w-4" />
              Prijavi se
            </>
          )}
        </Button>
      </form>
    </motion.div>
  )
}
