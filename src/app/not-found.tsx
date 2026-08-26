import Link from 'next/link'
import { cn } from '@/lib/utils'
import { routes } from '@/config/site'
import { Container } from '@/components/ui/section'
import { buttonStyles } from '@/components/ui/button'

export default function NotFound() {
  return (
    <section className="grid min-h-[70svh] place-items-center py-32">
      <Container size="narrow" className="text-center">
        <p data-numeric className="text-hero leading-none text-gradient">
          404
        </p>
        <h1 className="mt-6 text-title text-ink">Ova stranica ne postoji</h1>
        <p className="mx-auto mt-5 max-w-md text-lead text-ink-muted">
          Možda je link zastareo, a možda smo je premestili dok smo prepravljali sajt.
        </p>

        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Link href={routes.home} className={cn(buttonStyles({ size: 'lg' }))}>
            Nazad na početnu
          </Link>
          <Link
            href={routes.report}
            className={cn(buttonStyles({ variant: 'secondary', size: 'lg' }))}
          >
            Prijavi psa
          </Link>
        </div>
      </Container>
    </section>
  )
}
