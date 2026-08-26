import type { Metadata } from 'next'
import { Hero } from '@/components/home/hero'
import { Ticker } from '@/components/home/ticker'
import { HowItWorks } from '@/components/home/how-it-works'
import { ImpactCalculator } from '@/components/home/impact-calculator'
import { DogsRail } from '@/components/home/dogs-rail'
import { ShopTeaser } from '@/components/home/shop-teaser'
import { StoryFeature } from '@/components/home/story-feature'
import { ClosingCta } from '@/components/home/closing-cta'

export const metadata: Metadata = {
  alternates: { canonical: '/' },
}

export default function HomePage() {
  return (
    <>
      <Hero />
      <Ticker />
      <HowItWorks />
      <ImpactCalculator />
      <DogsRail />
      <ShopTeaser />
      <StoryFeature />
      <ClosingCta />
    </>
  )
}
