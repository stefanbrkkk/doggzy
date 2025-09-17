'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Heart, Play, ArrowRight, Star, Users, Globe } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useLanguage } from '@/contexts/LanguageContext'

export function HeroSection() {
  const [currentStat, setCurrentStat] = useState(0)
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)
  const { t } = useLanguage()

  const stats = [
    { number: "2,847", label: t.home.impact.stats.dogsSaved, icon: Heart },
    { number: "156", label: t.home.impact.stats.partnerShelters, icon: Users },
    { number: "47", label: t.home.impact.stats.countries, icon: Globe },
  ]

  const impactNumbers = [
    { value: 2847, suffix: "+", label: t.home.impact.stats.dogsSaved },
    { value: 156, suffix: "", label: t.home.impact.stats.partnerShelters },
    { value: 47, suffix: "", label: t.home.impact.stats.countries },
    { value: 98, suffix: "%", label: t.home.impact.stats.successRate },
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStat((prev) => (prev + 1) % stats.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [stats.length])

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-orange-50 via-white to-red-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-20 h-20 bg-orange-200/30 dark:bg-orange-500/20 rounded-full blur-xl animate-pulse" />
        <div className="absolute top-40 right-20 w-32 h-32 bg-red-200/20 dark:bg-red-500/15 rounded-full blur-xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-20 left-1/4 w-16 h-16 bg-yellow-200/40 dark:bg-yellow-500/20 rounded-full blur-xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-100 to-red-100 text-orange-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Star className="h-4 w-4 fill-orange-500 text-orange-500" />
              {t.home.hero.badge}
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold leading-tight mb-6">
              <span className="bg-gradient-to-r from-gray-900 via-orange-600 to-red-600 bg-clip-text text-transparent">
                {t.home.hero.title}
              </span>
              <br />
              <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                {t.home.hero.titleHighlight}
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto lg:mx-0">
              {t.home.hero.subtitle}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link href="/donate">
                <Button size="xl" variant="glow" className="group hover:scale-105 transition-transform duration-200">
                  <Heart className="h-5 w-5 mr-2 group-hover:animate-pulse" />
                  {t.home.hero.donateButton}
                  <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                </Button>
              </Link>
              
              <Link href="/about">
                <Button size="xl" variant="outline" className="group hover:scale-105 transition-transform duration-200">
                  <Play className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform duration-200" />
                  {t.home.hero.learnMoreButton}
                </Button>
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="flex items-center justify-center lg:justify-start gap-8 mt-12">
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">{t.home.hero.trustIndicators.rating}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">{t.home.hero.trustIndicators.ratingLabel}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">{t.home.hero.trustIndicators.taxDeductible}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">{t.home.hero.trustIndicators.taxLabel}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{t.home.hero.trustIndicators.successRate}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">{t.home.hero.trustIndicators.successLabel}</div>
              </div>
            </div>
          </div>

          {/* Right Content - Hero Video/Image */}
          <div className="relative">
            {/* Main Hero Card */}
            <Card className="relative overflow-hidden border-0 shadow-2xl bg-gradient-to-br from-orange-50 to-red-50 dark:from-slate-800 dark:to-slate-700 hover:scale-105 transition-transform duration-300">
              <div className="aspect-video bg-gradient-to-br from-orange-100 to-red-100 dark:from-slate-700 dark:to-slate-600 flex items-center justify-center relative">
                {!isVideoPlaying ? (
                  <div
                    className="absolute inset-0 flex items-center justify-center cursor-pointer hover:scale-110 transition-transform duration-200"
                    onClick={() => setIsVideoPlaying(true)}
                  >
                    <div className="w-20 h-20 bg-white/90 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-200">
                      <Play className="h-8 w-8 text-orange-500 ml-1" />
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-full bg-black flex items-center justify-center">
                    <div className="text-white text-center">
                      <div className="mb-4">
                        <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                          <Heart className="h-8 w-8 text-white" />
                        </div>
                        <p className="text-lg mb-2">Watch Our Rescue Mission</p>
                        <p className="text-sm text-gray-300">See how we save lives every day</p>
                      </div>
                      <Button
                        variant="outline"
                        onClick={() => setIsVideoPlaying(false)}
                        className="text-white border-white hover:bg-white hover:text-black transition-colors duration-200"
                      >
                        Close Video
                      </Button>
                    </div>
                  </div>
                )}
                
                {/* Floating Stats */}
                <div className="absolute top-4 right-4 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">
                      {stats[currentStat].number}
                    </div>
                    <div className="text-xs text-gray-600">
                      {stats[currentStat].label}
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Floating Impact Cards */}
            {impactNumbers.map((stat, index) => (
              <div
                key={stat.label}
                className={`absolute bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm rounded-lg p-3 shadow-lg border border-orange-100 dark:border-slate-600 hover:scale-110 transition-transform duration-200 ${
                  index === 0 && "top-4 left-4"
                } ${
                  index === 1 && "top-1/2 -left-4"
                } ${
                  index === 2 && "bottom-4 right-4"
                } ${
                  index === 3 && "bottom-1/2 -right-4"
                }`}
              >
                <div className="text-center">
                  <div className="text-lg font-bold text-orange-600">
                    {stat.value}{stat.suffix}
                  </div>
                  <div className="text-xs text-gray-600">
                    {stat.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="flex flex-col items-center text-gray-400 dark:text-gray-500 animate-bounce">
          <div className="text-sm mb-2">Scroll to see more</div>
          <div className="w-6 h-10 border-2 border-gray-300 dark:border-gray-600 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-gray-400 dark:bg-gray-500 rounded-full mt-2 animate-bounce" />
          </div>
        </div>
      </div>
    </section>
  )
}