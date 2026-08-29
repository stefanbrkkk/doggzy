import type { Metadata } from 'next'
import { pageMetadata } from '@/lib/metadata'
import { routes } from '@/config/site'
import { Container, Eyebrow } from '@/components/ui/section'
import { CartPage } from '@/components/shop/cart-page'
import { Reveal } from '@/components/motion'

export const metadata: Metadata = pageMetadata({
  title: 'Korpa',
  description: 'Pregled korpe i slanje porudžbine našem timu.',
  path: routes.cart,
  robots: { index: false, follow: true },
})

export default function BasketPage() {
  return (
    <section className="pb-section pt-32 sm:pt-40">
      <Container>
        <Reveal direction="up" amount={0.4}>
          <Eyebrow>Korpa</Eyebrow>
        </Reveal>
        <Reveal direction="up" delay={0.06}>
          <h1 className="mt-5 text-title text-ink">Tvoja porudžbina</h1>
        </Reveal>

        <div className="mt-12">
          <CartPage />
        </div>
      </Container>
    </section>
  )
}
