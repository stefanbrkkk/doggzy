'use client'

import React from 'react'
import { AnimatedPage } from '@/components/animated-page'

export default function RefundsPage() {
  return (
    <AnimatedPage>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Refund Policy</h1>
          <p className="text-gray-600 mb-6">Last updated: January 2025</p>
          <div className="space-y-4 text-gray-700">
            <p>Donations are generally non-refundable. If you believe a donation was made in error, please contact us within 14 days with the transaction details.</p>
            <p>For shop purchases, items may be returned within 30 days in original condition for a refund or exchange, subject to our shop terms.</p>
            <p>Refunds will be issued to the original payment method once approved.</p>
          </div>
        </div>
      </div>
    </AnimatedPage>
  )
}


