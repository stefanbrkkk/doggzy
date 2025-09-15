'use client'

import React from 'react'
import { AnimatedPage } from '@/components/animated-page'

export default function TermsPage() {
  return (
    <AnimatedPage>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Terms of Service</h1>
          <p className="text-gray-600 mb-6">Last updated: January 2025</p>
          <div className="space-y-4 text-gray-700">
            <p>By accessing and using this website, you agree to these Terms of Service. If you do not agree, please discontinue use.</p>
            <p>Donations and purchases are subject to our Refund Policy. Some features may require an account; you are responsible for maintaining the confidentiality of your account.</p>
            <p>We may update these terms from time to time. Continued use constitutes acceptance of the updated terms.</p>
            <p>If you have questions about these terms, please contact us.</p>
          </div>
        </div>
      </div>
    </AnimatedPage>
  )
}


