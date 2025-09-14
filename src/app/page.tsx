import { HeroSection } from '@/components/hero-section'
import { ImpactStats } from '@/components/impact-stats'

export default function Home() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <ImpactStats />
    </div>
  )
}