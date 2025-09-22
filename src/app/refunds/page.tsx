'use client'

export const dynamic = 'force-dynamic'

import React from 'react'
import { AnimatedPage } from '@/components/animated-page'
import { UnderglowCard } from '@/components/shared/underglow-card'

export default function RefundsPage() {
  return (
    <AnimatedPage>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Refund Policy</h1>
          <p className="text-gray-600 mb-6">Last updated: January 2025</p>
          <div className="grid grid-cols-1 gap-6 group">
            <UnderglowCard>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Donations</h2>
              <p className="text-gray-700">Donations are generally non-refundable. If made in error, contact us within 14 days with transaction details.</p>
            </UnderglowCard>
            <UnderglowCard>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Shop Returns</h2>
              <p className="text-gray-700">Items may be returned within 30 days in original condition for a refund or exchange, per shop terms.</p>
            </UnderglowCard>
            <UnderglowCard>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Refund Method</h2>
              <p className="text-gray-700">Approved refunds are issued to the original payment method.</p>
            </UnderglowCard>
          </div>
        </div>
      </div>
    </AnimatedPage>
  )
}


