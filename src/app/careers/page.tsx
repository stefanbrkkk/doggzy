'use client'

import React from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useLanguage } from '@/contexts/LanguageContext'
import { Briefcase, Heart } from 'lucide-react'
import Link from 'next/link'
import { AnimatedPage } from '@/components/animated-page'
import { motion } from 'framer-motion'
import Image from 'next/image'

export default function CareersPage() {
  const { t } = useLanguage()

  const sampleOpenings = [
    { title: 'Frontend Engineer', location: 'Remote', type: 'Full-time' },
    { title: 'Partnerships Manager', location: 'Remote', type: 'Full-time' },
    { title: 'Volunteer Coordinator', location: 'Remote', type: 'Part-time' }
  ]

  const faqs = [
    { q: 'Is Doggzy remote-first?', a: 'Yes, we are remote-first with occasional in-person retreats.' },
    { q: 'Do you offer learning budgets?', a: 'We provide a learning budget and encourage continuous growth.' },
    { q: 'How do I apply?', a: 'Use the Apply buttons to submit your application; our team responds within a week.' }
  ]

  const volunteerRoles = [
    { title: 'Event Volunteer', desc: 'Help at adoption events and outreach.', emoji: '🎪' },
    { title: 'Transport Driver', desc: 'Drive dogs to fosters and appointments.', emoji: '🚐' },
    { title: 'Content Creator', desc: 'Create social posts and stories.', emoji: '📝' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
      <AnimatedPage>
      <section className="py-20 relative overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="mb-6 bg-gradient-to-r from-orange-100 to-red-100 text-orange-800 border-orange-200">
              <Briefcase className="h-4 w-4 mr-2" />
              {t.careers.hero.badge}
            </Badge>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold mb-6">
              <span className="bg-gradient-to-r from-gray-900 via-orange-600 to-red-600 bg-clip-text text-transparent">
                {t.careers.hero.title}
              </span>
              <br />
              <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                {t.careers.hero.titleHighlight}
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">{t.careers.hero.subtitle}</p>
          </div>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-6">{t.careers.sections.openings}</h2>
          <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-6"
            initial="hidden" animate="visible"
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}>
            {sampleOpenings.map((job) => (
              <motion.div key={job.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <Card className="border-0 shadow-md bg-white/90">
                  <CardContent className="p-6">
                    <div className="text-lg font-semibold text-gray-900 mb-2">{job.title}</div>
                    <div className="text-sm text-gray-600 mb-4">{job.location} • {job.type}</div>
                    <Link href="/careers/apply">
                      <Button variant="glow" size="sm">{t.common.apply ?? 'Apply'}</Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="py-12 bg-gradient-to-br from-orange-50 to-red-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-4">{t.careers.sections.culture}</h2>
          <p className="text-gray-700 max-w-3xl">{t.careers.sections.cultureDesc}</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            {[t.careers.sections.benefitsList.impact, t.careers.sections.benefitsList.flexibility, t.careers.sections.benefitsList.growth].map((b) => (
              <Card key={b} className="border-0 shadow-md bg-white/90">
                <CardContent className="p-6">
                  <div className="text-gray-900 font-semibold">{b}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-10">
            <h3 className="text-xl font-bold mb-4">FAQ</h3>
            <div className="space-y-4">
              {faqs.map((f) => (
                <Card key={f.q} className="border-0 shadow-md bg-white/90">
                  <CardContent className="p-6">
                    <div className="font-semibold text-gray-900 mb-1">{f.q}</div>
                    <div className="text-gray-700 text-sm">{f.a}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="mt-10">
            <h3 className="text-xl font-bold mb-4">Volunteer Opportunities</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {volunteerRoles.map((r) => (
                <Card key={r.title} className="border-0 shadow-md bg-white/90 hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="text-2xl mb-2">{r.emoji}</div>
                    <div className="font-semibold text-gray-900">{r.title}</div>
                    <div className="text-sm text-gray-700 mb-3">{r.desc}</div>
                    <Link href="/careers/apply">
                      <Button size="sm" variant="outline">I’m Interested</Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-r from-orange-500 to-red-500 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-3xl font-bold mb-4">{t.careers.sections.apply}</h3>
          <Link href="/careers/apply">
            <Button size="lg" variant="secondary">
              <Heart className="h-5 w-5 mr-2" />
              {t.careers.sections.apply}
            </Button>
          </Link>
        </div>
      </section>
      </AnimatedPage>
    </div>
  )
}


