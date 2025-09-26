'use client'

import { motion } from 'framer-motion'
import { lazy, Suspense } from 'react'
import { HeroSection } from '@/components/hero-section'
import { ImpactStats } from '@/components/impact-stats'
import { motionTokens } from '@/lib/motion-tokens'

// Optimized lazy loading for below-the-fold components
const SuccessStories = lazy(() => import('@/components/success-stories').then(m => ({ default: m.SuccessStories })))
const GlobalPartners = lazy(() => import('@/components/global-partners').then(m => ({ default: m.GlobalPartners })))
const ShopPreview = lazy(() => import('@/components/home/shop-preview').then(m => ({ default: m.ShopPreview })))
const LargeStoryCard = lazy(() => import('@/components/shared/large-story-card').then(m => ({ default: m.LargeStoryCard })))

// Enhanced loading component with skeleton
const SectionLoader = ({ showSkeleton = true }: { showSkeleton?: boolean }) => (
  <div className="section-padding flex items-center justify-center">
    {showSkeleton ? (
      <div className="w-full max-w-4xl animate-pulse">
        <div className="h-8 bg-muted rounded mb-4"></div>
        <div className="h-4 bg-muted rounded mb-2 w-3/4"></div>
        <div className="h-4 bg-muted rounded mb-2 w-1/2"></div>
        <div className="h-4 bg-muted rounded w-2/3"></div>
      </div>
    ) : (
      <div className="animate-pulse text-muted-foreground">Loading...</div>
    )}
  </div>
)

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Above-the-fold content - loaded immediately */}
      <motion.div
        variants={motionTokens.variants.fadeIn}
        initial="initial"
        animate="animate"
        transition={{ duration: 0.6 }}
      >
        <HeroSection />
      </motion.div>
      
      <motion.div
        variants={motionTokens.variants.slideUp}
        initial="initial"
        whileInView="animate"
        transition={{ duration: 0.4 }}
        viewport={{ once: true, margin: "-100px" }}
      >
        <ImpactStats />
      </motion.div>
      
      {/* Below-the-fold content - lazy loaded with enhanced skeleton */}
      <Suspense fallback={<SectionLoader showSkeleton={true} />}>
        <motion.div
          variants={motionTokens.variants.slideUp}
          initial="initial"
          whileInView="animate"
          transition={{ duration: 0.4 }}
          viewport={{ once: true, margin: "-50px" }}
        >
          <SuccessStories />
        </motion.div>
      </Suspense>
      
      <Suspense fallback={<SectionLoader showSkeleton={true} />}>
        <motion.div
          variants={motionTokens.variants.slideUp}
          initial="initial"
          whileInView="animate"
          transition={{ duration: 0.4 }}
          viewport={{ once: true, margin: "-50px" }}
        >
          <section className="section-padding">
            <div className="container mx-auto container-padding space-y-8">
              <h2 className="text-display text-3xl font-bold text-foreground">Latest Stories</h2>
              <LargeStoryCard
                title="Bella's First Day Home"
                subtitle="💛🐶"
                quote="She was shy for an hour, then decided the couch was hers."
                badges={["Adopted", "Family"]}
                media={{ type: 'image', src: '/api/placeholder/800/600', caption: 'Bella - A happy rescued dog in her new home' }}
                primaryCta={{ label: 'Read full story', onClick: () => { window.location.href = '/sponsor' } }}
                secondaryCta={{ label: 'Meet similar dogs', onClick: () => { window.location.href = '/sponsor' } }}
              />
            </div>
          </section>
        </motion.div>
      </Suspense>

      <Suspense fallback={<SectionLoader showSkeleton={true} />}>
        <motion.div
          variants={motionTokens.variants.slideUp}
          initial="initial"
          whileInView="animate"
          transition={{ duration: 0.4 }}
          viewport={{ once: true, margin: "-50px" }}
        >
          <ShopPreview />
        </motion.div>
      </Suspense>

      <Suspense fallback={<SectionLoader showSkeleton={true} />}>
        <motion.div
          variants={motionTokens.variants.slideUp}
          initial="initial"
          whileInView="animate"
          transition={{ duration: 0.4 }}
          viewport={{ once: true, margin: "-50px" }}
        >
          <GlobalPartners />
        </motion.div>
      </Suspense>
    </div>
  )
}