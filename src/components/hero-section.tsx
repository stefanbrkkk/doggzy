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
    { number: "Uskoro", label: "Spašenih pasa", icon: Heart },
    { number: "Uskoro", label: "Partner skloništa", icon: Users },
    { number: "Uskoro", label: "Zemlje", icon: Globe },
  ]

  const impactNumbers = [
    { value: 0, suffix: "", label: "Spašenih pasa" },
    { value: 0, suffix: "", label: "Partner skloništa" },
    { value: 1, suffix: "", label: "Zemlje" },
    { value: 0, suffix: "%", label: "Stopa uspeha" },
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStat((prev) => (prev + 1) % stats.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [stats.length])

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-orange-50/50 via-white/80 to-red-50/50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Animated gradient orbs */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-orange-400/30 to-red-400/30 rounded-full blur-2xl animate-float" />
        <div className="absolute top-40 right-20 w-48 h-48 bg-gradient-to-r from-red-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-gradient-to-r from-yellow-400/40 to-orange-400/40 rounded-full blur-xl animate-particle-float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/3 right-1/3 w-20 h-20 bg-gradient-to-r from-pink-400/25 to-purple-400/25 rounded-full blur-xl animate-float" style={{ animationDelay: '3s' }} />
        
        {/* Mesh gradient overlay */}
        <div className="absolute inset-0 bg-mesh-gradient opacity-5 animate-gradient-shift" />
        
        {/* Glass morphism backdrop */}
        <div className="absolute inset-0 glass-subtle" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left">
            {/* Enhanced Badge */}
            <div className="inline-flex items-center gap-3 glass-intense px-6 py-3 rounded-2xl text-sm font-semibold mb-8 animate-bounce-in border border-white/20 shadow-glass">
              <Star className="h-5 w-5 fill-orange-500 text-orange-500 animate-pulse-glow" />
              <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                {t.home.hero.badge}
              </span>
            </div>

            {/* Enhanced Main Headline */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-display font-black leading-tight mb-8 animate-slide-up">
              <span className="bg-gradient-to-r from-gray-900 via-orange-600 to-red-600 bg-clip-text text-transparent animate-gradient-shift bg-size-200">
                {t.home.hero.title}
              </span>
              <br />
              <span className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 bg-clip-text text-transparent animate-gradient-shift bg-size-200 drop-shadow-lg">
                {t.home.hero.titleHighlight}
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto lg:mx-0">
              {t.home.hero.subtitle}
            </p>

            {/* Enhanced CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start animate-slide-in-left">
              <Link href="/donate">
                <Button size="xl" variant="glow" className="group hover:scale-110 transition-all duration-300 shadow-glow-lg">
                  <Heart className="h-6 w-6 mr-3 group-hover:animate-wiggle" />
                  {t.home.hero.donateButton}
                  <ArrowRight className="h-6 w-6 ml-3 group-hover:translate-x-2 transition-transform duration-300" />
                </Button>
              </Link>
              
              <Link href="/about">
                <Button size="xl" variant="glass" className="group hover:scale-110 transition-all duration-300 backdrop-blur-xl">
                  <Play className="h-6 w-6 mr-3 group-hover:scale-125 transition-transform duration-300" />
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

          {/* Right Content - Enhanced Hero Video/Image */}
          <div className="relative animate-slide-in-right">
            {/* Main Hero Card with 3D Effects */}
            <Card className="relative overflow-hidden border-0 shadow-glass-xl glass-card hover:scale-105 hover:rotate-1 transition-all duration-500 transform-gpu perspective-1000 animate-float">
              <div className="aspect-video bg-gradient-to-br from-orange-100/50 to-red-100/50 dark:from-slate-700 dark:to-slate-600 flex items-center justify-center relative backdrop-blur-sm">
                {/* 3D Background Effect */}
                <div className="absolute inset-0 bg-mesh-gradient opacity-20 animate-gradient-shift"></div>
                {!isVideoPlaying ? (
                  <div
                    className="absolute inset-0 flex items-center justify-center cursor-pointer group"
                    onClick={() => setIsVideoPlaying(true)}
                  >
                    <div className="w-24 h-24 glass-intense rounded-full flex items-center justify-center shadow-glow hover:scale-125 transition-all duration-300 animate-pulse-glow border border-white/30">
                      <Play className="h-10 w-10 text-white ml-1 group-hover:scale-110 transition-transform duration-300" />
                    </div>
                    {/* Ripple effect */}
                    <div className="absolute inset-0 rounded-full border-2 border-white/20 animate-ping"></div>
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
                
                {/* Enhanced Floating Stats */}
                <div className="absolute top-4 right-4 glass-intense backdrop-blur-xl rounded-2xl p-4 shadow-glass-lg border border-white/20 animate-bounce-in hover:scale-110 transition-all duration-300">
                  <div className="text-center">
                    <div className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent animate-pulse-glow">
                      {stats[currentStat].number}
                    </div>
                    <div className="text-xs text-white/80 font-medium">
                      {stats[currentStat].label}
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Enhanced Floating Impact Cards */}
            {impactNumbers.map((stat, index) => (
              <div
                key={stat.label}
                className={`absolute glass-card backdrop-blur-xl rounded-2xl p-4 shadow-glass-lg border border-white/10 hover:scale-125 hover:rotate-3 transition-all duration-500 animate-particle-float ${
                  index === 0 && "top-4 left-4 animate-bounce-in"
                } ${
                  index === 1 && "top-1/2 -left-6 animate-slide-in-left"
                } ${
                  index === 2 && "bottom-4 right-4 animate-slide-in-right"
                } ${
                  index === 3 && "bottom-1/2 -right-6 animate-float"
                }`}
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="text-center">
                  <div className="text-xl font-bold bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 bg-clip-text text-transparent animate-gradient-shift">
                    {stat.value}{stat.suffix}
                  </div>
                  <div className="text-xs text-white/70 font-medium">
                    {stat.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Enhanced Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-float">
        <div className="flex flex-col items-center text-white/60 group cursor-pointer">
          <div className="text-sm mb-3 font-medium group-hover:text-white/80 transition-colors duration-300">Scroll to see more</div>
          <div className="w-8 h-12 border-2 border-white/30 rounded-full flex justify-center glass-subtle group-hover:border-white/50 transition-all duration-300">
            <div className="w-1.5 h-4 bg-gradient-to-b from-orange-500 to-red-500 rounded-full mt-2 animate-bounce group-hover:animate-pulse-glow" />
          </div>
          {/* Glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
      </div>
    </section>
  )
}