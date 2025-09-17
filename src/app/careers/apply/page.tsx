'use client'

import React, { Suspense } from 'react'
import { AnimatedPage } from '@/components/animated-page'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useSearchParams } from 'next/navigation'

function ApplyForm() {
  const params = useSearchParams()
  const role = params.get('role') || 'Role'

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-6">Apply for {role}</h1>
        <Card className="border-0 shadow-md bg-white/90">
          <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input placeholder="Full Name" />
            <Input placeholder="Email" />
            <Input placeholder="Phone" />
            <Input placeholder="Location" />
            <Input placeholder="Years of Experience" className="md:col-span-2" />
            <textarea 
              placeholder="Why are you interested in this role?" 
              className="md:col-span-2 p-3 border rounded-md min-h-32"
            />
            <textarea 
              placeholder="Tell us about relevant experience" 
              className="md:col-span-2 p-3 border rounded-md min-h-32"
            />
            <div className="md:col-span-2">
              <Button className="w-full bg-gradient-to-r from-orange-500 to-red-500">
                Submit Application
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function CareersApplyPage() {
  return (
    <AnimatedPage>
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
        <ApplyForm />
      </Suspense>
    </AnimatedPage>
  )
}