'use client'

import { useState, useEffect } from 'react'
import { motion, useAnimation } from 'framer-motion'
import { Heart, Play, ArrowRight, Star, Users, Globe } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'

export function HeroSection() {
  const [currentStat, setCurrentStat] = useState(0)
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)
  const controls = useAnimation()

  const stats = [
    { number: "2,847", label: "Dogs Saved This Month", icon: Heart },
    { number: "156", label: "Partner Shelters", icon: Users },
    { number: "47", label: "Countries Worldwide", icon: Globe },
  ]

  const impactNumbers = [
    { value: 2847, suffix: "+", label: "Lives Saved" },
    { value: 156, suffix: "", label: "Partner Shelters" },
    { value: 47, suffix: "", label: "Countries" },
    { value: 98, suffix: "%", label: "Success Rate" },
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStat((prev) => (prev + 1) % stats.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [stats.length])

  useEffect(() => {
    controls.start({
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" }
    })
  }, [controls])

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-orange-50 via-white to-red-50">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-20 left-10 w-20 h-20 bg-orange-200/30 rounded-full blur-xl"
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute top-40 right-20 w-32 h-32 bg-red-200/20 rounded-full blur-xl"
          animate={{
            x: [0, -80, 0],
            y: [0, 60, 0],
            scale: [1, 0.8, 1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        />
        <motion.div
          className="absolute bottom-20 left-1/4 w-16 h-16 bg-yellow-200/40 rounded-full blur-xl"
          animate={{
            x: [0, 60, 0],
            y: [0, -80, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 4,
          }}
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center lg:text-left"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-100 to-red-100 text-orange-800 px-4 py-2 rounded-full text-sm font-medium mb-6"
            >
              <Star className="h-4 w-4 fill-orange-500 text-orange-500" />
              Trusted by 50,000+ Donors Worldwide
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold leading-tight mb-6"
            >
              <span className="bg-gradient-to-r from-gray-900 via-orange-600 to-red-600 bg-clip-text text-transparent">
                Every Dog Deserves
              </span>
              <br />
              <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                A Happy Ending
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-lg sm:text-xl text-gray-600 mb-8 max-w-2xl mx-auto lg:mx-0"
            >
              Join our global movement to rescue, rehabilitate, and rehome dogs in need. 
              Every donation and purchase directly saves lives and creates miracles.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button size="xl" variant="glow" className="group">
                  <Heart className="h-5 w-5 mr-2 group-hover:animate-pulse" />
                  Donate Now
                  <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </motion.div>
              
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button size="xl" variant="outline" className="group">
                  <Play className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
                  Watch Our Story
                </Button>
              </motion.div>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="flex items-center justify-center lg:justify-start gap-8 mt-12"
            >
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">4.9★</div>
                <div className="text-sm text-gray-500">Trustpilot</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">501(c)(3)</div>
                <div className="text-sm text-gray-500">Tax Deductible</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">98%</div>
                <div className="text-sm text-gray-500">Success Rate</div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Content - Hero Video/Image */}
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="relative"
          >
            {/* Main Hero Card */}
            <Card className="relative overflow-hidden border-0 shadow-2xl bg-gradient-to-br from-orange-50 to-red-50">
              <div className="aspect-video bg-gradient-to-br from-orange-100 to-red-100 flex items-center justify-center relative">
                {!isVideoPlaying ? (
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="absolute inset-0 flex items-center justify-center cursor-pointer"
                    onClick={() => setIsVideoPlaying(true)}
                  >
                    <motion.div
                      className="w-20 h-20 bg-white/90 rounded-full flex items-center justify-center shadow-lg"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Play className="h-8 w-8 text-orange-500 ml-1" />
                    </motion.div>
                  </motion.div>
                ) : (
                  <div className="w-full h-full bg-black flex items-center justify-center">
                    <div className="text-white text-center">
                      <p className="text-lg mb-4">Video would play here</p>
                      <Button
                        variant="outline"
                        onClick={() => setIsVideoPlaying(false)}
                        className="text-white border-white hover:bg-white hover:text-black"
                      >
                        Close Video
                      </Button>
                    </div>
                  </div>
                )}
                
                {/* Floating Stats */}
                <motion.div
                  className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8, duration: 0.5 }}
                >
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">
                      {stats[currentStat].number}
                    </div>
                    <div className="text-xs text-gray-600">
                      {stats[currentStat].label}
                    </div>
                  </div>
                </motion.div>
              </div>
            </Card>

            {/* Floating Impact Cards */}
            {impactNumbers.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 50, x: index % 2 === 0 ? -50 : 50 }}
                animate={{ opacity: 1, y: 0, x: 0 }}
                transition={{ 
                  delay: 1 + index * 0.2, 
                  duration: 0.6,
                  type: "spring",
                  stiffness: 100
                }}
                className={cn(
                  "absolute bg-white/95 backdrop-blur-sm rounded-lg p-3 shadow-lg border border-orange-100",
                  index === 0 && "top-4 left-4",
                  index === 1 && "top-1/2 -left-4",
                  index === 2 && "bottom-4 right-4",
                  index === 3 && "bottom-1/2 -right-4"
                )}
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <div className="text-center">
                  <div className="text-lg font-bold text-orange-600">
                    {stat.value}{stat.suffix}
                  </div>
                  <div className="text-xs text-gray-600">
                    {stat.label}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex flex-col items-center text-gray-400"
        >
          <div className="text-sm mb-2">Scroll to see more</div>
          <div className="w-6 h-10 border-2 border-gray-300 rounded-full flex justify-center">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1 h-3 bg-gray-400 rounded-full mt-2"
            />
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}
