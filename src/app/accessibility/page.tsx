'use client'

export const dynamic = 'force-dynamic'

import React from 'react'
import { AnimatedPage } from '@/components/animated-page'
import { UnderglowCard } from '@/components/shared/underglow-card'

export default function AccessibilityPage() {
  return (
    <AnimatedPage>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Accessibility Statement</h1>
          <p className="text-gray-600 mb-6">Last updated: January 2025</p>
          <div className="grid grid-cols-1 gap-6 group">
            <UnderglowCard>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Commitment</h2>
              <p className="text-gray-700">We are committed to making our website accessible to everyone, including people with disabilities.</p>
            </UnderglowCard>
            <UnderglowCard>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Standards</h2>
              <p className="text-gray-700">We follow WCAG 2.1 AA guidelines where feasible and continuously improve our practices.</p>
            </UnderglowCard>
            <UnderglowCard>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Feedback</h2>
              <p className="text-gray-700">If you encounter barriers, please contact us so we can address them promptly.</p>
            </UnderglowCard>
          </div>
        </div>
      </div>
    </AnimatedPage>
  )
}


