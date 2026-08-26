import type { Metadata } from 'next'
import { routes } from '@/config/site'
import { Container, Eyebrow } from '@/components/ui/section'
import { FavoritesList } from '@/components/shop/favorites-list'
import { Reveal } from '@/components/motion'

export const metadata: Metadata = {
  title: 'Omiljeno',
  description: 'Proizvodi koje si sačuvao za kasnije.',
  alternates: { canonical: routes.favorites },
  robots: { index: false, follow: true },
}

export default function FavoritesPage() {
  return (
    <section className="pb-section pt-32 sm:pt-40">
      <Container>
        <Reveal direction="up" amount={0.4}>
          <Eyebrow>Omiljeno</Eyebrow>
        </Reveal>
        <Reveal direction="up" delay={0.06}>
          <h1 className="mt-5 text-title text-ink">Sačuvano za kasnije</h1>
        </Reveal>
        <Reveal direction="up" delay={0.12}>
          <p className="mt-4 max-w-xl text-lead text-ink-muted">
            Lista se čuva u ovom pregledaču. Ne šalje se nigde i ne traži nalog.
          </p>
        </Reveal>

        <div className="mt-12">
          <FavoritesList />
        </div>
      </Container>
    </section>
  )
}
