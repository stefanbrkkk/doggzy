import { HeroSection } from '@/components/hero-section'
import { ImpactStats } from '@/components/impact-stats'
import { SuccessStories } from '@/components/success-stories'
import { GlobalPartners } from '@/components/global-partners'

export default function Home() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <ImpactStats />
      <SuccessStories />
      <GlobalPartners />
    </div>
  )
}