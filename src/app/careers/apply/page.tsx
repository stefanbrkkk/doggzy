'use client'

import React, { Suspense } from 'react'
import { AnimatedPage } from '@/components/animated-page'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useSearchParams } from 'next/navigation'

function CareersApplyForm() {
  const params = useSearchParams()
  const role = params.get('role') || 'Role'

  return (
    <AnimatedPage>
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold mb-6">Apply for {role}</h1>
          <Card className="border-0 shadow-md bg-white/90">
            <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input placeholder="Full Name" />
              <Input placeholder="Email" type="email" />
              <Input placeholder="LinkedIn / Portfolio" />
              <Input placeholder="Location" />
              <div className="md:col-span-2">
                <textarea className="w-full border rounded-md p-3" rows={5} placeholder="Why do you want to join?" />
              </div>
              <div className="md:col-span-2">
                <Button variant="glow">Submit Application</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AnimatedPage>
  )
}

export default function CareersApplyPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CareersApplyForm />
    </Suspense>
  )
}
