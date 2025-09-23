'use client'

import React from 'react'
import { AnimatedPage } from '@/components/animated-page'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useLanguage } from '@/contexts/LanguageContext'
import { AlertTriangle, Phone, Mail } from 'lucide-react'

export default function ReportAbusePage() {
  const { t } = useLanguage()

  const [step, setStep] = React.useState(1)
  const [formData, setFormData] = React.useState({
    // Report details
    description: '',
    location: '',
    date: '',
    time: '',
    ongoing: false,
    animals: '',
    // Contact details
    anonymous: false,
    name: '',
    email: '',
    phone: '',
    website: '' // honeypot
  })
  const [status, setStatus] = React.useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = React.useState('')

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  const handleSubmit = async () => {
    // Prevent double submission
    if (status === 'loading') return
    
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
          formType: 'report'
        }),
      })

      const result = await response.json()

      if (response.ok) {
        setStatus('success')
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
              <div className="mx-auto h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <Mail className="h-8 w-8 text-green-600" />
              </div>
              <h1 className="text-3xl font-bold mb-4">Report Submitted</h1>
              <p className="text-gray-600 mb-6">
                Thank you for your report. We take all reports seriously and will follow up appropriately.
              </p>
              <Button onClick={() => { setStatus('idle'); setStep(1) }} variant="outline">
                Submit Another Report
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
          <div className="text-center max-w-3xl mx-auto mb-10">
            <Badge className="mb-4 bg-gradient-to-r from-orange-100 to-red-100 text-orange-800 border-orange-200">
              <AlertTriangle className="h-4 w-4 mr-2" />
              {t.report.hero.badge}
            </Badge>
            <h1 className="text-4xl font-display font-bold mb-4">
              <span className="bg-gradient-to-r from-gray-900 via-orange-600 to-red-600 bg-clip-text text-transparent">{t.report.hero.title}</span>
              <br />
              <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">{t.report.hero.titleHighlight}</span>
            </h1>
            <p className="text-gray-700">{t.report.hero.subtitle}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Card className="border-0 shadow-md bg-white/90">
              <CardContent className="p-6">
                <div className="text-lg font-semibold mb-2">{t.report.sections.emergencies}</div>
                <p className="text-sm text-gray-600 mb-4">{t.report.sections.emergenciesDesc}</p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm"><Phone className="h-4 w-4 mr-2" />911</Button>
                  <Button variant="outline" size="sm"><Phone className="h-4 w-4 mr-2" />112</Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md bg-white/90 md:col-span-2">
              <CardContent className="p-6">
                <div className="text-lg font-semibold mb-3">{t.report.sections.whatToReport}</div>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  {t.report.sections.whatToReportItems.map((item: string) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          <Card className="border-0 shadow-md bg-white/90">
            <CardContent className="p-6">
              {step === 1 && (
                <div className="grid grid-cols-1 gap-4">
                  <div className="text-lg font-semibold">Describe the situation</div>
                  <textarea 
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="border rounded-md p-3" 
                    rows={5} 
                    placeholder="Describe what you saw, including location, time, and any photos/links"
                    required
                  />
                  <div className="flex justify-end">
                    <Button onClick={() => setStep(2)} disabled={!formData.description.trim()}>Next</Button>
                  </div>
                </div>
              )}
              {step === 2 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="text-lg font-semibold mb-2">Location</div>
                    <input 
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      className="border rounded-md p-3 w-full" 
                      placeholder="City, Country"
                      required
                    />
                  </div>
                  <div>
                    <div className="text-lg font-semibold mb-2">Date</div>
                    <input 
                      name="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      className="border rounded-md p-3 w-full" 
                      type="date"
                      required
                    />
                  </div>
                  <div>
                    <div className="text-lg font-semibold mb-2">Time (optional)</div>
                    <input 
                      name="time"
                      value={formData.time}
                      onChange={handleInputChange}
                      className="border rounded-md p-3 w-full" 
                      type="time"
                    />
                  </div>
                  <div>
                    <div className="text-lg font-semibold mb-2">Animals involved (optional)</div>
                    <input 
                      name="animals"
                      value={formData.animals}
                      onChange={handleInputChange}
                      className="border rounded-md p-3 w-full" 
                      placeholder="e.g., 2 dogs, 1 cat"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="flex items-center gap-2">
                      <input 
                        name="ongoing"
                        type="checkbox" 
                        checked={formData.ongoing}
                        onChange={handleInputChange}
                      />
                      <span>This is an ongoing situation</span>
                    </label>
                  </div>
                  <div className="md:col-span-2 flex justify-between items-center">
                    <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
                    <Button onClick={() => setStep(3)} disabled={!formData.location.trim() || !formData.date}>Next</Button>
                  </div>
                </div>
              )}
              {step === 3 && (
                <div className="grid grid-cols-1 gap-4">
                  <div className="flex items-center justify-between">
                    <div className="text-lg font-semibold">Your details</div>
                    <label className="text-sm flex items-center gap-2">
                      <input 
                        name="anonymous"
                        type="checkbox" 
                        checked={formData.anonymous} 
                        onChange={handleInputChange}
                      /> 
                      Report anonymously
                    </label>
                  </div>
                  {!formData.anonymous && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <input 
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="border rounded-md p-3" 
                        placeholder="Your Name (optional)" 
                      />
                      <input 
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="border rounded-md p-3" 
                        placeholder="Email (optional)"
                        type="email"
                      />
                      <input 
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="border rounded-md p-3" 
                        placeholder="Phone (optional)" 
                      />
                    </div>
                  )}
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
                    <div className="text-red-600 bg-red-50 p-3 rounded-md">
                      {errorMessage}
                    </div>
                  )}
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">{t.report.sections.weFollowUp}</span>
                    <div className="flex gap-2">
                      <Button variant="outline" onClick={() => setStep(2)}>Back</Button>
                      <Button 
                        onClick={handleSubmit} 
                        disabled={status === 'loading'}
                      >
                        {status === 'loading' ? (
                          <>Submitting...</>
                        ) : (
                          <><Mail className="h-4 w-4 mr-2" />{t.report.sections.submitReport}</>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: 'Confidential', desc: 'Your identity is protected; anonymous tips accepted.' },
              { title: 'Reviewed Quickly', desc: 'Reports are triaged within 24-48 hours.' },
              { title: 'Next Steps', desc: 'We coordinate with local authorities and partners.' },
            ].map((i) => (
              <Card key={i.title} className="border-0 shadow-md bg-white/90">
                <CardContent className="p-6">
                  <div className="font-semibold text-gray-900 mb-1">{i.title}</div>
                  <div className="text-gray-700 text-sm">{i.desc}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </AnimatedPage>
  )
}


