'use client'

import React, { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { Heart, Users, Globe, Award } from 'lucide-react'

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
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const stats: StatItem[] = [
    {
      icon: Heart,
      value: 0,
      suffix: "",
      label: "Spašenih pasa",
      color: "from-red-500 to-pink-500",
      description: "Uskoro počinjemo"
    },
    {
      icon: Users,
      value: 0,
      suffix: "",
      label: "Partner skloništa",
      color: "from-blue-500 to-cyan-500",
      description: "Širom sveta"
    },
    {
      icon: Globe,
      value: 1,
      suffix: "",
      label: "Zemlje",
      color: "from-green-500 to-emerald-500",
      description: "Počinjemo u Srbiji"
    },
    {
      icon: Award,
      value: 0,
      suffix: "%",
      label: "Stopa uspeha",
      color: "from-yellow-500 to-orange-500",
      description: "Uskoro"
    }
  ]

  return (
    <section className="py-20 bg-gradient-to-br from-orange-50 via-white to-red-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-32 h-32 bg-orange-200/20 rounded-full blur-2xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-red-200/20 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-yellow-200/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold mb-6">
            <span className="bg-gradient-to-r from-gray-900 via-orange-600 to-red-600 bg-clip-text text-transparent">
              Naš uticaj u brojkama
            </span>
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-200 max-w-3xl mx-auto leading-relaxed">
            Svaki broj predstavlja promenjen život, porodicu koja se ponovo okupila i vraćenu nadu. 
            Pridružite se našoj misiji spašavanja pasa u Srbiji.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div ref={ref} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              className="group relative"
            >
              <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200/50 hover:scale-105 text-center overflow-hidden">
                {/* Background Gradient */}
                <motion.div
                  className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-5 group-hover:opacity-10 transition-opacity duration-300 rounded-2xl`}
                  whileHover={{ scale: 1.05 }}
                />

                {/* Icon */}
                <motion.div
                  className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${stat.color} text-white mb-4 shadow-lg hover:scale-110 transition-transform duration-200`}
                  whileHover={{ rotate: 5 }}
                >
                  <stat.icon className="h-8 w-8" />
                </motion.div>

                {/* Number */}
                <motion.div
                  className="text-4xl lg:text-5xl font-bold mb-2 relative z-10"
                  initial={{ opacity: 0 }}
                  animate={isInView ? { opacity: 1 } : {}}
                  transition={{ delay: 0.5 + index * 0.1 }}
                >
                  <span className={`bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                    {isInView ? <AnimatedCounter end={stat.value} suffix={stat.suffix} /> : '0'}
                  </span>
                </motion.div>

                {/* Label */}
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 relative z-10">
                  {stat.label}
                </h3>

                {/* Description */}
                <p className="text-sm text-gray-600 dark:text-gray-300 relative z-10">
                  {stat.description}
                </p>

                {/* Hover Effect */}
                <motion.div
                  className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-2xl`}
                  whileHover={{ scale: 1.05 }}
                />
              </div>

            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-8 text-white relative overflow-hidden hover:scale-105 transition-transform duration-300">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-600/20 to-red-600/20" />
            <div className="relative z-10">
              <h3 className="text-2xl md:text-3xl font-bold mb-4">
                Budite deo naše priče
              </h3>
              <p className="text-orange-100 mb-6 max-w-2xl mx-auto">
                Svaka donacija i kupovina direktno doprinosi ovim brojevima. 
                Pomozite nam da počnemo našu misiju spašavanja pasa u Srbiji.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.a 
                  href="/donate"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center justify-center px-8 py-4 bg-white text-orange-600 rounded-full font-semibold hover:bg-gray-100 transition-colors duration-200 shadow-lg"
                >
                  <Heart className="h-5 w-5 mr-2" />
                  Doniraj sada
                </motion.a>
                <motion.a 
                  href="/shop"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white rounded-full font-semibold hover:bg-white hover:text-orange-600 transition-colors duration-200"
                >
                  Kupuj za dobru stvar
                </motion.a>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export { ImpactStats }