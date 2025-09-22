'use client'

import React, { useState } from 'react'
import { AnimatedPage } from '@/components/animated-page'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useLanguage } from '@/contexts/LanguageContext'
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react'

export default function FosterApplyPage() {
  const { t } = useLanguage()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    experience: '',
    message: '',
    website: '' // honeypot
  })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    setErrorMessage('')

    try {
      const response = await fetch('/api/forms/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          formType: 'foster'
        }),
      })

      const result = await response.json()

      if (response.ok) {
        setStatus('success')
        setFormData({
          name: '',
          email: '',
          phone: '',
          location: '',
          experience: '',
          message: '',
          website: ''
        })
      } else {
        setStatus('error')
        setErrorMessage(result.error || 'Something went wrong. Please try again.')
      }
      } catch {
        setStatus('error')
        setErrorMessage('Network error. Please check your connection and try again.')
      }
  }

  if (status === 'success') {
    return (
      <AnimatedPage>
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-md mx-auto text-center">
              <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
              <h1 className="text-3xl font-bold mb-4">Application Submitted!</h1>
              <p className="text-gray-600 mb-6">
                Thank you for your interest in fostering! We&apos;ll review your application and contact you within 2-3 business days to discuss next steps.
              </p>
              <Button 
                onClick={() => setStatus('idle')} 
                variant="outline"
              >
                Submit Another Application
              </Button>
            </div>
          </div>
        </div>
      </AnimatedPage>
    )
  }

  return (
    <AnimatedPage>
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold mb-6">{t.foster.sections.apply}</h1>
          <Card className="border-0 shadow-md bg-white/90">
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input 
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Full Name *" 
                  required
                />
                <Input 
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Email *" 
                  type="email" 
                  required
                />
                <Input 
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Phone" 
                />
                <Input 
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="City, Country" 
                />
                <div className="md:col-span-2">
                  <select
                    name="experience"
                    value={formData.experience}
                    onChange={handleInputChange}
                    className="w-full border rounded-md p-3 bg-white"
                    required
                  >
                    <option value="">Foster Experience Level *</option>
                    <option value="first-time">First-time foster</option>
                    <option value="some">Some fostering experience</option>
                    <option value="experienced">Very experienced foster</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <textarea 
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    className="w-full border rounded-md p-3" 
                    rows={4} 
                    placeholder="Tell us about your home setup, availability, and what type of fostering you're interested in..."
                  />
                </div>
                {/* Honeypot field */}
                <input
                  name="website"
                  value={formData.website}
                  onChange={handleInputChange}
                  type="text"
                  className="hidden"
                  tabIndex={-1}
                  autoComplete="off"
                />
                {status === 'error' && (
                  <div className="md:col-span-2 flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-md">
                    <AlertCircle className="h-5 w-5" />
                    <span>{errorMessage}</span>
                  </div>
                )}
                <div className="md:col-span-2">
                  <Button 
                    type="submit" 
                    variant="glow" 
                    disabled={status === 'loading'}
                    className="w-full"
                  >
                    {status === 'loading' ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      t.common.submit
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </AnimatedPage>
  )
}


