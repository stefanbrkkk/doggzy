'use client'

import React from 'react'
import { AnimatedPage } from '@/components/animated-page'
import { UnderglowCard } from '@/components/shared/underglow-card'

export default function CookiesPage() {
  return (
    <AnimatedPage>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Cookie Policy</h1>
          <p className="text-gray-600 mb-6">Last updated: January 2025</p>
          <div className="grid grid-cols-1 gap-6 group">
            <UnderglowCard>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Usage</h2>
              <p className="text-gray-700">We use cookies and similar technologies to improve experience, analyze usage, and personalize content.</p>
            </UnderglowCard>
            <UnderglowCard>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Controls</h2>
              <p className="text-gray-700">You can control cookies through browser settings. Disabling cookies may limit some functionality.</p>
            </UnderglowCard>
            <UnderglowCard>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Analytics</h2>
              <p className="text-gray-700">We use analytics cookies to understand engagement and improve performance.</p>
            </UnderglowCard>
          </div>
        </div>
      </div>
    </AnimatedPage>
  )
}


