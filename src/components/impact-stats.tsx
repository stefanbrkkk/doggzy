'use client'

import React, { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { Heart, Users, Globe, Award, Clock, TrendingUp } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

interface StatItem {
  icon: React.ComponentType<{ className?: string }>
  value: number
  suffix: string
  label: string
  color: string
  description: string
}


function AnimatedCounter({ 
  end, 
  duration = 2000,
  suffix = ""
}: { 
  end: number
  duration?: number
  suffix?: string 
}) {
  const [count, setCount] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (!isVisible) return

    let startTime: number
    const startCount = 0
    const endCount = end

    const updateCount = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4)
      const currentCount = Math.floor(startCount + (endCount - startCount) * easeOutQuart)
      
      setCount(currentCount)

      if (progress < 1) {
        requestAnimationFrame(updateCount)
      } else {
        setCount(endCount)
      }
    }

    requestAnimationFrame(updateCount)
  }, [end, duration, isVisible])

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 500)
    return () => clearTimeout(timer)
  }, [])

  return <span>{count.toLocaleString()}{suffix}</span>
}

function ImpactStats() {
  const { t } = useLanguage()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const stats: StatItem[] = [
    {
      icon: Heart,
      value: 2847,
      suffix: "+",
      label: t.home.impact.stats.dogsSaved,
      color: "from-red-500 to-pink-500",
      description: "This month alone"
    },
    {
      icon: Users,
      value: 156,
      suffix: "",
      label: t.home.impact.stats.partnerShelters,
      color: "from-blue-500 to-cyan-500",
      description: "Across the globe"
    },
    {
      icon: Globe,
      value: 47,
      suffix: "",
      label: t.home.impact.stats.countries,
      color: "from-green-500 to-emerald-500",
      description: "Worldwide reach"
    },
    {
      icon: Award,
      value: 98,
      suffix: "%",
      label: t.home.impact.stats.successRate,
      color: "from-yellow-500 to-orange-500",
      description: "Adoption rate"
    },
    {
      icon: Clock,
      value: 24,
      suffix: "h",
      label: t.home.impact.stats.responseTime,
      color: "from-purple-500 to-indigo-500",
      description: "Emergency rescues"
    },
    {
      icon: TrendingUp,
      value: 45,
      suffix: "%",
      label: t.home.impact.stats.growthRate,
      color: "from-teal-500 to-green-500",
      description: "Year over year"
    }
  ]

  return (
    <section ref={ref} className="section-padding bg-background relative overflow-hidden">
      {/* Minimal background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 w-32 h-32 bg-neon-primary-dim rounded-full blur-3xl opacity-20"
          animate={{
            x: [0, 50, 0],
            y: [0, -25, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <div className="container mx-auto container-padding relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="inline-flex items-center gap-2 bg-muted text-muted-foreground px-4 py-2 rounded-full text-sm font-medium mb-6"
          >
            <Heart className="h-4 w-4 text-neon-primary" />
            Our Impact
          </motion.div>
          
          <h2 className="text-display text-4xl font-bold mb-6 text-foreground">
            {t.home.impact.title}
          </h2>
          
          <p className="text-body text-lg text-muted-foreground max-w-3xl mx-auto">
            {t.home.impact.subtitle}
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ 
                delay: index * 0.1, 
                duration: 0.6,
                type: "spring",
                stiffness: 100
              }}
              whileHover={{ 
                y: -5,
                transition: { duration: 0.2 }
              }}
              className="group relative"
            >
              {/* Premium Card with sophisticated interactions */}
              <div className="card p-8 text-center group-hover:border-neon-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-neon-primary/10">
                {/* Enhanced Icon with glow effect */}
                <motion.div
                  className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br from-muted to-muted/80 text-foreground mb-6 relative overflow-hidden"
                  whileHover={{ scale: 1.1, rotateY: 5 }}
                  transition={{ duration: 0.3, type: 'spring', stiffness: 200 }}
                >
                  <div className="absolute inset-0 bg-neon-primary-dim opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
                  {React.createElement(stat.icon, { className: "h-7 w-7 relative z-10" })}
                </motion.div>

                {/* Enhanced Number with premium typography */}
                <motion.div
                  className="text-4xl font-bold mb-2 text-foreground tracking-tight"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ delay: 0.5 + index * 0.1, type: 'spring', stiffness: 150 }}
                >
                  <span className="bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                    {isInView ? <AnimatedCounter end={stat.value} suffix={stat.suffix} /> : '0'}
                  </span>
                </motion.div>

                {/* Enhanced Label */}
                <h3 className="text-sm font-semibold text-foreground mb-2 tracking-wide">
                  {stat.label}
                </h3>

                {/* Enhanced Description */}
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {stat.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="text-center mt-16"
        >
          <motion.button
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="btn-primary glow-primary inline-flex items-center gap-4 px-8 py-4 rounded-lg text-lg font-semibold"
          >
            <Heart className="h-5 w-5" />
            <span>Be Part of the Impact</span>
            <motion.div
              animate={{ x: [0, 3, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              →
            </motion.div>
          </motion.button>
        </motion.div>
      </div>
    </section>
  )
}

export { ImpactStats }
