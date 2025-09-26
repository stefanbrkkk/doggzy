'use client'

import Link from 'next/link'
import { Heart, Play, ArrowRight, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useLanguage } from '@/contexts/LanguageContext'

export function HeroSection() {
  const { t } = useLanguage()

  const impactNumbers = [
    { value: 2847, suffix: "+", label: t.home.impact.stats.dogsSaved },
    { value: 156, suffix: "", label: t.home.impact.stats.partnerShelters },
    { value: 47, suffix: "", label: t.home.impact.stats.countries },
    { value: 98, suffix: "%", label: t.home.impact.stats.successRate },
  ]

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background">
      {/* Subtle background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-32 h-32 bg-neon-primary-dim rounded-full blur-3xl opacity-30 animate-float" />
        <div className="absolute bottom-20 right-10 w-24 h-24 bg-neon-secondary-dim rounded-full blur-2xl opacity-20 animate-float" style={{ animationDelay: '2s' }} />
      </div>

      <div className="container mx-auto container-padding relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-muted text-muted-foreground px-4 py-2 rounded-full text-sm font-medium mb-8">
            <Star className="h-4 w-4 text-neon-primary" />
            {t.home.hero.badge}
          </div>

          {/* Main Headline */}
          <h1 className="text-display text-5xl sm:text-6xl font-bold leading-tight mb-8">
            <span className="text-foreground">
              {t.home.hero.title}
            </span>
            <br />
            <span className="text-glow-primary" style={{ color: 'var(--neon-primary)' }}>
              {t.home.hero.titleHighlight}
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-body text-lg text-muted-foreground mb-12 max-w-2xl mx-auto">
            {t.home.hero.subtitle}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link href="/donate">
              <Button size="xl" variant="glow" className="group">
                <Heart className="h-5 w-5 mr-2" />
                {t.home.hero.donateButton}
                <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
              </Button>
            </Link>
            
            <Link href="/about">
              <Button size="xl" variant="outline" className="group">
                <Play className="h-5 w-5 mr-2" />
                {t.home.hero.learnMoreButton}
              </Button>
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="flex items-center justify-center gap-12">
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">{t.home.hero.trustIndicators.rating}</div>
              <div className="text-sm text-muted-foreground">{t.home.hero.trustIndicators.ratingLabel}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-neon-secondary">{t.home.hero.trustIndicators.taxDeductible}</div>
              <div className="text-sm text-muted-foreground">{t.home.hero.trustIndicators.taxLabel}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-neon-primary">{t.home.hero.trustIndicators.successRate}</div>
              <div className="text-sm text-muted-foreground">{t.home.hero.trustIndicators.successLabel}</div>
            </div>
          </div>
        </div>

        
        {/* Floating Impact Stats */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto">
          {impactNumbers.map((stat) => (
            <div
              key={stat.label}
              className="text-center p-4 rounded-lg bg-card border border-border hover:border-neon-primary/30 transition-all duration-300 hover:-translate-y-1"
            >
              <div className="text-2xl font-bold text-foreground mb-1">
                {stat.value}{stat.suffix}
              </div>
              <div className="text-xs text-muted-foreground">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="flex flex-col items-center text-muted-foreground animate-bounce">
          <div className="text-sm mb-2">Scroll to explore</div>
          <div className="w-6 h-10 border-2 border-muted-foreground/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-neon-primary rounded-full mt-2 animate-bounce" />
          </div>
        </div>
      </div>
    </section>
  )
}