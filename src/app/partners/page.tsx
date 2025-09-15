'use client'

import { GlobalPartners } from '@/components/global-partners'
import { AnimatedPage } from '@/components/animated-page'

export default function PartnersPage() {
  return (
    <AnimatedPage>
      <div className="min-h-screen">
        <GlobalPartners />
      </div>
    </AnimatedPage>
  )
}
