'use client'

import React from 'react'
import { AnimatedPage } from '@/components/animated-page'

export default function AccessibilityPage() {
  return (
    <AnimatedPage>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Accessibility Statement</h1>
          <p className="text-gray-600 mb-6">Last updated: January 2025</p>
          <div className="space-y-4 text-gray-700">
            <p>We are committed to making our website accessible to everyone, including people with disabilities.</p>
            <p>We follow WCAG 2.1 AA guidelines where feasible and continuously improve our accessibility practices.</p>
            <p>If you encounter accessibility barriers, please contact us and we will work to address them promptly.</p>
          </div>
        </div>
      </div>
    </AnimatedPage>
  )
}


