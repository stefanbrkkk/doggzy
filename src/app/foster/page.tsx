'use client'

import React from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useLanguage } from '@/contexts/LanguageContext'
import { HandHeart } from 'lucide-react'
import Link from 'next/link'
import { AnimatedPage } from '@/components/animated-page'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { LargeStoryCard } from '@/components/shared/large-story-card'

export default function FosterPage() {
  const { t } = useLanguage()

  const info = [
    { title: t.foster.sections.whyFoster, description: t.foster.sections.whyFosterDesc },
    { title: t.foster.sections.responsibilities, description: t.foster.sections.responsibilitiesDesc },
    { title: t.foster.sections.support, description: t.foster.sections.supportDesc }
  ]

  const faqs = [
    { q: 'How long is a foster placement?', a: 'From 2 weeks to 2 months on average.' },
    { q: 'What if I need help?', a: 'Our coordinators are available and we cover medical costs.' },
    { q: 'Can I adopt my foster?', a: 'Yes, many fosters become forever homes.' }
  ]

  const stories = [
    { name: 'Maya & Bruno', text: 'Bruno stayed with us for 4 weeks before his forever home. Our kids still talk about him!', emoji: '👨‍👩‍👧‍👦🐶', img: '/api/placeholder/600/400' },
    { name: 'Leo & Daisy', text: 'Fostering Daisy taught me patience and the joy of small wins.', emoji: '🧘‍♂️🐕', img: '/api/placeholder/600/400' },
    { name: 'Rita & Max', text: 'We were nervous at first, but the support was amazing.', emoji: '🤝🐶', img: '/api/placeholder/600/400' },
  ]

  const benefits = [
    t.foster.sections.benefits?.lifesaving,
    t.foster.sections.benefits?.flexible,
    t.foster.sections.benefits?.rewarding
  ].filter(Boolean) as string[]

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
      <AnimatedPage>
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge className="mb-6 bg-gradient-to-r from-orange-100 to-red-100 text-orange-800 border-orange-200">
            {t.foster.hero.badge}
          </Badge>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold mb-6">
            <span className="bg-gradient-to-r from-gray-900 via-orange-600 to-red-600 bg-clip-text text-transparent">
              {t.foster.hero.title}
            </span>
            <br />
            <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
              {t.foster.hero.titleHighlight}
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">{t.foster.hero.subtitle}</p>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-6"
            initial="hidden" animate="visible"
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}>
            {info.map((i) => (
              <motion.div key={i.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <Card className="border-0 shadow-md bg-white/90">
                  <CardContent className="p-6">
                    <div className="text-lg font-semibold text-gray-900 mb-2">{i.title}</div>
                    <div className="text-sm text-gray-600">{i.description}</div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
          <div className="mt-8">
            <Link href="/foster/apply">
              <Button variant="glow" size="lg">{t.foster.sections.apply}</Button>
            </Link>
          </div>
          <div className="mt-16 space-y-8">
            <h3 className="text-2xl font-bold">Foster Stories</h3>
            {stories.map((s, idx) => (
              <LargeStoryCard
                key={s.name}
                title={s.name}
                subtitle={s.emoji}
                quote={s.text}
                badges={[idx === 0 ? 'Family' : 'Community']}
                media={{ type: 'image', src: s.img, caption: s.name }}
                primaryCta={{ label: t.foster.sections.apply, onClick: () => { window.location.href = '/foster/apply' } }}
                secondaryCta={{ label: 'Talk to a coordinator', onClick: () => { window.location.href = '/contact' } }}
              />
            ))}
          </div>
          <div className="mt-16">
            <h3 className="text-2xl font-bold mb-6">{t.foster.sections.benefitsTitle}</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {benefits.map((b, idx) => (
                <Card key={`benefit-${idx}`} className="border-0 shadow-md bg-white/90">
                  <CardContent className="p-6">
                    <div className="text-gray-900 font-semibold">{b}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="mt-16">
            <h3 className="text-2xl font-bold mb-6">FAQ</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
        </div>
      </section>

      <section className="py-16 bg-gradient-to-r from-orange-500 to-red-500 text-white text-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold mb-4">{t.sponsor.cta.cantChoose}</h3>
          <Button size="lg" variant="secondary">
            <HandHeart className="h-5 w-5 mr-2" />
            {t.nav.donateNow}
          </Button>
        </div>
      </section>
      </AnimatedPage>
    </div>
  )
}


