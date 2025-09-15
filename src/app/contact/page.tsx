'use client'

import React from 'react'
import Image from 'next/image'
import { AnimatedPage } from '@/components/animated-page'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Mail, Phone, MapPin, Heart } from 'lucide-react'

export default function ContactPage() {
  const gallery = [
    '/api/placeholder/600/400',
    '/api/placeholder/600/400',
    '/api/placeholder/600/400',
    '/api/placeholder/600/400',
  ]

  return (
    <AnimatedPage>
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2 space-y-8">
              <h1 className="text-3xl font-bold">Contact Us</h1>
              <p className="text-gray-700">We love hearing from fellow dog lovers. Reach out anytime!</p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {gallery.map((src, i) => (
                  <div key={i} className="relative h-28 md:h-32 rounded-xl overflow-hidden">
                    <Image src={src} alt={`Cute dog ${i+1}`} fill className="object-cover" />
                  </div>
                ))}
              </div>
            </div>

            <Card className="border-0 shadow-lg bg-white/95">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-3 text-gray-800"><Mail className="h-5 w-5 text-orange-500" /> hello@doggzy.org</div>
                <div className="flex items-center gap-3 text-gray-800"><Phone className="h-5 w-5 text-orange-500" /> +1 (555) 123-4567</div>
                <div className="flex items-center gap-3 text-gray-800"><MapPin className="h-5 w-5 text-orange-500" /> San Francisco, CA</div>
                <Button variant="glow" className="w-full"><Heart className="h-5 w-5 mr-2" />Send us a note</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AnimatedPage>
  )
}


