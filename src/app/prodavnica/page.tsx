import type { Metadata } from 'next'
import { Leaf, Recycle, Truck } from 'lucide-react'
import { pageMetadata } from '@/lib/metadata'
import { routes } from '@/config/site'
import { Container, Eyebrow } from '@/components/ui/section'
import { Reveal } from '@/components/motion'
import { ShopClient } from '@/components/shop/shop-client'

export const metadata: Metadata = pageMetadata({
  title: 'Prodavnica',
  description:
    'Oprema, ležajevi i igračke za pse. Sav profit ide u negu pasa — na svakom proizvodu piše koju stavku pokriva.',
  path: routes.shop,
})

const PROMISES = [
  { icon: Recycle, title: '100% profita', body: 'Ide u lečenje, hranu i transport pasa.' },
  { icon: Truck, title: 'Besplatna dostava', body: 'Za porudžbine preko 6.000 RSD.' },
  { icon: Leaf, title: 'Bez suvišne plastike', body: 'Pakujemo u karton i papir.' },
]

export default function ShopPage() {
  return (
    <>
      <section className="relative isolate grain overflow-hidden pb-14 pt-36 sm:pt-44">
        <div
          aria-hidden="true"
          data-decor
          className="pointer-events-none absolute inset-x-0 -top-32 -z-10 h-[30rem] bg-[radial-gradient(55%_60%_at_50%_0%,var(--wash-cool),transparent_70%)] opacity-[var(--wash-opacity)]"
        />

        <Container>
          <div className="max-w-3xl">
            <Reveal direction="up" amount={0.4}>
              <Eyebrow>Prodavnica</Eyebrow>
            </Reveal>
            <Reveal direction="up" delay={0.06}>
              <h1 className="mt-5 text-display text-ink">
                Kupovina koja <span className="text-gradient">plaća račun</span>
              </h1>
            </Reveal>
            <Reveal direction="up" delay={0.12}>
              <p className="mt-6 text-lead text-ink-muted">
                Nema marže koja negde nestane. Na svakom proizvodu piše tačno koju stavku iz nege
                pokriva profit od prodaje.
              </p>
            </Reveal>
          </div>

          <ul className="mt-14 grid gap-px overflow-hidden rounded-4xl border border-line bg-rule sm:grid-cols-3">
            {PROMISES.map((promise, index) => {
              const Icon = promise.icon
              return (
                <li key={promise.title} className="bg-elevated p-6">
                  <Reveal delay={index * 0.06}>
                    <Icon className="h-5 w-5 text-brand" aria-hidden="true" />
                    <h2 className="mt-4 text-sm font-medium text-ink">{promise.title}</h2>
                    <p className="mt-1 text-sm text-ink-muted">{promise.body}</p>
                  </Reveal>
                </li>
              )
            })}
          </ul>
        </Container>
      </section>

      <section className="pb-section">
        <Container>
          <ShopClient />
        </Container>
      </section>
    </>
  )
}
