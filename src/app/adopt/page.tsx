'use client'

import React from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useLanguage } from '@/contexts/LanguageContext'
import { Heart } from 'lucide-react'
import Link from 'next/link'
import { AnimatedPage } from '@/components/animated-page'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { LargeStoryCard } from '@/components/shared/large-story-card'
import { MediaLightbox } from '@/components/shared/media-lightbox'
import { StickyCTA } from '@/components/shared/sticky-cta'

export default function AdoptPage() {
  const { t } = useLanguage()

  const steps = [
    { title: t.adopt.sections.process, description: t.adopt.sections.processDesc },
    { title: t.adopt.sections.requirements, description: t.adopt.sections.requirementsDesc },
    { title: t.adopt.sections.availableDogs, description: t.adopt.sections.availableDogsDesc }
  ]

  const faqs = [
    { q: 'How long does adoption take?', a: 'Typically 1-2 weeks, depending on fit and checks.' },
    { q: 'Do you allow out-of-area adoptions?', a: 'Yes, with virtual checks and transport coordination.' },
    { q: 'What costs are involved?', a: 'Adoption fees cover vaccines, microchip, and initial care.' }
  ]

  const stories = [
    { name: 'Bella & Nina', text: "We adopted Bella last spring. She was shy at first, but quickly became our daughter Nina's best friend.", emoji: '👧🐶', img: '/api/placeholder/600/400' },
    { name: 'Sam & Rocky', text: 'Rocky gave me a reason to get outside and meet my neighbors. Best decision ever.', emoji: '🚶‍♂️🐕', img: '/api/placeholder/600/400' },
    { name: 'Ava & Luna', text: 'Luna helped me through a tough year. Adopting her changed both of our lives.', emoji: '💛🐶', img: '/api/placeholder/600/400' },
  ]

  const [lightboxOpen, setLightboxOpen] = React.useState(false)
  const [lightboxMedia, setLightboxMedia] = React.useState<{type:'image'|'video'; src:string; poster?:string; caption?:string} | undefined>()

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
      <AnimatedPage>
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge className="mb-6 bg-gradient-to-r from-orange-100 to-red-100 text-orange-800 border-orange-200">
            {t.adopt.hero.badge}
          </Badge>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold mb-6">
            <span className="bg-gradient-to-r from-gray-900 via-orange-600 to-red-600 bg-clip-text text-transparent">
              {t.adopt.hero.title}
            </span>
            <br />
            <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
              {t.adopt.hero.titleHighlight}
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">{t.adopt.hero.subtitle}</p>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-6"
            initial="hidden" animate="visible"
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}>
            {steps.map((s) => (
              <motion.div key={s.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <Card className="border-0 shadow-md bg-white/90">
                  <CardContent className="p-6">
                    <div className="text-lg font-semibold text-gray-900 mb-2">{s.title}</div>
                    <div className="text-sm text-gray-600">{s.description}</div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
          <div className="mt-8">
            <Link href="/adopt/apply">
              <Button variant="glow" size="lg">{t.adopt.sections.apply}</Button>
            </Link>
          </div>
          <div className="mt-16 space-y-8">
            <h3 className="text-2xl font-bold">Adoption Stories</h3>
            {stories.map((s, idx) => (
              <LargeStoryCard
                key={s.name}
                title={s.name}
                subtitle={s.emoji}
                quote={s.text}
                badges={[idx === 0 ? 'Family' : 'Community']}
                media={{ type: 'image', src: s.img, caption: s.name }}
                primaryCta={{ label: 'Read full story', onClick: () => { window.location.href = '/sponsor' } }}
                secondaryCta={{ label: 'Meet similar dogs', onClick: () => { window.location.href = '/sponsor' } }}
                onOpenLightbox={(m) => { setLightboxMedia(m); setLightboxOpen(true) }}
              />
            ))}
          </div>
          <div className="mt-16">
            <h3 className="text-2xl font-bold mb-6">{t.adopt.sections.benefitsTitle}</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[t.adopt.sections.benefits.saveLife, t.adopt.sections.benefits.companionship, t.adopt.sections.benefits.community].map((b) => (
                <Card key={b} className="border-0 shadow-md bg-white/90">
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
            <Heart className="h-5 w-5 mr-2" />
            {t.nav.donateNow}
          </Button>
        </div>
      </section>
      <StickyCTA actions={[
        { label: t.adopt.sections.apply, onClick: () => { window.location.href = '/adopt/apply' } },
        { label: 'Book a call', onClick: () => { window.location.href = '/contact' }, variant: 'secondary' },
      ]} />
      <MediaLightbox open={lightboxOpen} media={lightboxMedia} onClose={() => setLightboxOpen(false)} />
      </AnimatedPage>
    </div>
  )
}


