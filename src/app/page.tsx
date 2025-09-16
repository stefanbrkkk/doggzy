'use client'

import { motion } from 'framer-motion'
import { HeroSection } from '@/components/hero-section'
import { ImpactStats } from '@/components/impact-stats'
import { SuccessStories } from '@/components/success-stories'
import { GlobalPartners } from '@/components/global-partners'
import { ShopPreview } from '@/components/home/shop-preview'
import { LargeStoryCard } from '@/components/shared/large-story-card'

export default function Home() {
  return (
    <div className="min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <HeroSection />
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <ImpactStats />
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <SuccessStories />
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <section className="py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <h2 className="text-3xl font-display font-bold">Latest Stories</h2>
            <LargeStoryCard
              title="Bella’s First Day Home"
              subtitle="💛🐶"
              quote="She was shy for an hour, then decided the couch was hers."
              badges={["Adopted", "Family"]}
              media={{ type: 'image', src: '/api/placeholder/800/600', caption: 'Bella' }}
              primaryCta={{ label: 'Read full story', onClick: () => { window.location.href = '/sponsor' } }}
              secondaryCta={{ label: 'Meet similar dogs', onClick: () => { window.location.href = '/sponsor' } }}
            />
          </div>
        </section>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <ShopPreview />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <GlobalPartners />
      </motion.div>
    </div>
  )
}