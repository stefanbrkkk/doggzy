'use client'

import React from 'react'
import { AnimatedPage } from '@/components/animated-page'
import { UnderglowCard } from '@/components/shared/underglow-card'

export default function TermsPage() {
  return (
    <AnimatedPage>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Terms of Service</h1>
          <p className="text-gray-600 mb-6">Last updated: January 2025</p>
          <div className="grid grid-cols-1 gap-6 group">
            <UnderglowCard>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Agreement to Terms</h2>
              <p className="text-gray-700">By using this site, you agree to these Terms of Service. If you do not agree, discontinue use.</p>
            </UnderglowCard>
            <UnderglowCard>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Accounts & Security</h2>
              <p className="text-gray-700">Some features may require an account. Keep your credentials confidential; you are responsible for all activity under your account.</p>
            </UnderglowCard>
            <UnderglowCard>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Donations & Purchases</h2>
              <p className="text-gray-700">Transactions are subject to our Refund Policy and processed securely by trusted providers.</p>
            </UnderglowCard>
            <UnderglowCard>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Changes to Terms</h2>
              <p className="text-gray-700">We may update these terms periodically. Continued use constitutes acceptance of changes.</p>
            </UnderglowCard>
          </div>
        </div>
      </div>
    </AnimatedPage>
  )
}


