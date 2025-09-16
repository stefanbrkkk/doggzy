'use client'

import { motion } from 'framer-motion'
import { AnimatedPage, staggerContainer, staggerItem, revealUp } from '@/components/animated-page'
import { HeroSection } from '@/components/hero-section'
import { ImpactStats } from '@/components/impact-stats'
import { SuccessStories } from '@/components/success-stories'
import { GlobalPartners } from '@/components/global-partners'
import { ShopPreview } from '@/components/home/shop-preview'
import { LargeStoryCard } from '@/components/shared/large-story-card'

export default function Home() {
  return (
    <AnimatedPage>
      <motion.div
        initial="initial"
        animate="animate"
        variants={revealUp}
      >
        <HeroSection />
      </motion.div>
      
      <motion.div
        initial="initial"
        whileInView="animate"
        variants={staggerContainer}
        viewport={{ once: true, amount: 0.3 }}
        className="space-y-16 lg:space-y-24"
      >
        <motion.div variants={staggerItem}>
          <ImpactStats />
        </motion.div>
        
        <motion.div variants={staggerItem}>
          <SuccessStories />
        </motion.div>
        
        <motion.div variants={staggerItem}>
          <section className="section">
            <div className="section-container space-y-12">
              <h2 className="text-3xl font-bold text-center gradient-text">Latest Stories</h2>
              <div className="max-w-4xl mx-auto">
                <LargeStoryCard
                  title="Bella's First Day Home"
                  subtitle="💛🐶"
                  quote="She was shy for an hour, then decided the couch was hers."
                  badges={["Adopted", "Family"]}
                  media={{ type: 'image', src: '/api/placeholder/800/600', caption: 'Bella' }}
                  primaryCta={{ label: 'Read full story', onClick: () => { window.location.href = '/sponsor' } }}
                  secondaryCta={{ label: 'Meet similar dogs', onClick: () => { window.location.href = '/sponsor' } }}
                />
              </div>
            </div>
          </section>
        </motion.div>

        <motion.div variants={staggerItem}>
          <ShopPreview />
        </motion.div>

        <motion.div variants={staggerItem}>
          <GlobalPartners />
        </motion.div>
      </motion.div>
    </AnimatedPage>
  )
}