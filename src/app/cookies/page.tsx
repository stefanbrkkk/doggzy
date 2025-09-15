'use client'

import React from 'react'
import { AnimatedPage } from '@/components/animated-page'

export default function CookiesPage() {
  return (
    <AnimatedPage>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Cookie Policy</h1>
          <p className="text-gray-600 mb-6">Last updated: January 2025</p>
          <div className="space-y-4 text-gray-700">
            <p>We use cookies and similar technologies to improve your experience, analyze usage, and personalize content.</p>
            <p>You can control cookies through your browser settings. Disabling cookies may limit some site functionality.</p>
            <p>We use analytics cookies to understand how visitors interact with our site to improve performance.</p>
          </div>
        </div>
      </div>
    </AnimatedPage>
  )
}


