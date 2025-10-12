'use client'

import { GlobalPartners } from '@/components/global-partners'
import { MotionContainer, MotionItem } from '@/components/shared/motion'
import { AnimatedPage } from '@/components/animated-page'

export default function PartnersPage() {
  return (
    <AnimatedPage>
      <div className="min-h-screen">
        <MotionContainer>
          <MotionItem>
            <GlobalPartners />
          </MotionItem>
        </MotionContainer>
      </div>
    </AnimatedPage>
  )
}
