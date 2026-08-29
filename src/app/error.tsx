'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { RotateCcw } from 'lucide-react'
import { cn } from '@/lib/utils'
import { routes } from '@/config/site'
import { Container } from '@/components/ui/section'
import { Button, buttonStyles } from '@/components/ui/button'

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // The digest is the only handle on the server-side stack; keep it visible.
    console.error('Neočekivana greška:', error.digest ?? error.message)
  }, [error])

  return (
    <section className="grid min-h-[70svh] place-items-center py-32">
      <Container size="narrow" className="text-center">
        <h1 className="text-title text-ink">Nešto je puklo</h1>
        <p className="mx-auto mt-5 max-w-md text-lead text-ink-muted">
          Greška je zabeležena. Probaj da osvežiš — ako se ponovi, javi nam se i navedi kod ispod.
        </p>

        {error.digest ? (
          <p data-numeric className="mt-6 text-sm text-ink-subtle">
            Kod: {error.digest}
          </p>
        ) : null}

        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Button size="lg" onClick={reset}>
            <RotateCcw className="h-4 w-4" />
            Pokušaj ponovo
          </Button>
          <Link
            href={routes.home}
            className={cn(buttonStyles({ variant: 'secondary', size: 'lg' }))}
          >
            Na početnu
          </Link>
        </div>
      </Container>
    </section>
  )
}
