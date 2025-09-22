'use client'

import React from 'react'
import Image from 'next/image'
import { AnimatedPage } from '@/components/animated-page'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Mail, Phone, MapPin, Heart, Check } from 'lucide-react'
import { track } from '@/lib/analytics'
import { motion } from 'framer-motion'

export default function ContactPage() {

  const [copied, setCopied] = React.useState<string | null>(null)
  const [sent, setSent] = React.useState(false)

  function copy(text: string) {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(text)
      setTimeout(() => setCopied(null), 1500)
    })
  }

  function submitForm(e: React.FormEvent) {
    e.preventDefault()
    setSent(true)
    track('contact_submit')
    setTimeout(() => setSent(false), 3000)
  }

  return (
    <AnimatedPage>
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 pb-16 relative overflow-hidden">
        {/* Cinematic hero */}
        <section className="relative h-[46vh] md:h-[56vh] overflow-hidden mb-16">
          <video className="absolute inset-0 w-full h-full object-cover" playsInline muted autoPlay loop poster="/api/placeholder/1600/900">
            <source src="/api/placeholder/1600/900" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-white/30 to-transparent" />
          <div className="relative z-10 h-full flex items-end">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-8">
              <div className="inline-block rounded-2xl bg-white/70 backdrop-blur-sm px-5 py-4">
                <motion.h1
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="text-4xl sm:text-5xl font-display font-bold text-black"
                >
                  Let’s talk about saving dogs
                </motion.h1>
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.5 }}
                  className="mt-3 flex gap-3 items-center"
                >
                  <a href="mailto:hello@doggzy.org" className="px-5 py-2.5 rounded-full bg-white text-gray-900 font-medium hover:opacity-90">Email us</a>
                  <a href="/contact#form" className="px-5 py-2.5 rounded-full bg-gradient-to-r from-orange-500 to-red-500 text-white font-medium hover:from-orange-600 hover:to-red-600">Book a 15‑min call</a>
                  <span className="ml-2 text-sm text-gray-700 bg-white/70 rounded-full px-3 py-1">Replies ~2h</span>
                </motion.div>
              </div>
            </div>
          </div>
        </section>
        {/* Rotating info bubbles */}
        <motion.div
          className="hidden lg:block absolute -right-16 top-24 w-80 h-80 rounded-full bg-orange-200/30 blur-2xl"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 30, ease: 'linear' }}
        />
        <motion.div
          className="hidden lg:block absolute right-10 top-48 w-64 h-64 rounded-full bg-red-200/30 blur-2xl"
          animate={{ rotate: -360 }}
          transition={{ repeat: Infinity, duration: 36, ease: 'linear' }}
        />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
            {/* Left content */}
            <div className="lg:col-span-2 space-y-8 relative z-10">
              <div>
                <h1 className="text-4xl sm:text-5xl font-display font-bold mb-3">
                  <span className="bg-gradient-to-r from-gray-900 via-orange-600 to-red-600 bg-clip-text text-transparent">Contact Us</span>
                </h1>
                <p className="text-gray-700 text-lg">We love hearing from fellow dog lovers. Reach out anytime!</p>
              </div>

              {/* Story 1:2 card */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
                className="relative grid grid-cols-1 md:grid-cols-3 gap-0 rounded-2xl overflow-hidden shadow-lg bg-white/90 backdrop-blur-sm border border-gray-200"
              >
                <div className="relative h-44 md:h-full md:col-span-1">
                  <Image src="/api/placeholder/800/800" alt="Rescue dog" fill className="object-cover" />
                </div>
                <div className="p-6 md:p-8 md:col-span-2">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Every message can save a life</h3>
                  <p className="text-gray-700 mb-3">Whether you&apos;re adopting, fostering, partnering, or reporting abuse—your note sets a rescue in motion. We read every message and typically respond within a few hours.</p>
                  <div className="text-gray-700">We’ve helped thousands of dogs find safety and love. Tell us how we can help today.</div>
                </div>
              </motion.div>

              {/* Big circular info cards with all-around lighting */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                {[{
                  icon: Mail,
                  title: 'Email',
                  text: 'hello@doggzy.org'
                },{
                  icon: Phone,
                  title: 'Phone',
                  text: '+1 (555) 123-4567'
                },{
                  icon: MapPin,
                  title: 'Address',
                  text: 'San Francisco, CA'
                }].map((c, idx) => (
                  <motion.div key={c.title}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: 0.2 + idx * 0.05 }}
                    whileHover={{ rotate: 6, scale: 1.02 }}
                    className="group relative mx-auto w-56 h-56 md:w-64 md:h-64 rounded-full bg-white/90 backdrop-blur-sm border border-gray-200 shadow-xl flex flex-col items-center justify-center text-center"
                  >
                    {/* Outward radial outlight on hover */}
                    <div className="pointer-events-none absolute inset-0 rounded-full scale-0 group-hover:scale-110 opacity-0 group-hover:opacity-80 transition duration-300 bg-[radial-gradient(circle_at_center,theme(colors.orange.400/.6),transparent_65%)]" />
                    <div className="pointer-events-none absolute inset-2 rounded-full ring-2 ring-orange-400/30 opacity-0 group-hover:opacity-60 transition duration-300" />
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-orange-500 to-red-500 text-white mb-3 shadow-md">
                      <c.icon className="h-7 w-7" />
                    </div>
                    <div className="text-xl font-semibold text-gray-900">{c.title}</div>
                    <div className="text-gray-700 flex items-center gap-2 mt-1">
                      <span>{c.text}</span>
                      {(c.title === 'Email' || c.title === 'Phone') && (
                        <button onClick={() => copy(c.text)} className="text-xs px-2 py-1 rounded-md bg-gray-100 hover:bg-gray-200">Copy</button>
                      )}
                      {copied === c.text && <Check className="h-4 w-4 text-green-600" />}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Right action card */}
            <Card className="relative z-10 border-0 shadow-2xl bg-white/95">
              <CardContent className="p-8 space-y-5" id="form">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Say Hello</h2>
                <p className="text-gray-700">Tell us how we can help. We typically reply within 1–2 business days.</p>
                <form onSubmit={submitForm} className="grid grid-cols-1 gap-3">
                  <input className="border rounded-lg p-3" placeholder="Your name" required />
                  <input className="border rounded-lg p-3" placeholder="Email" type="email" required />
                  <textarea className="border rounded-lg p-3" rows={4} placeholder="Your message" required />
                  <Button type="submit" variant="glow" className="w-full"><Heart className="h-5 w-5 mr-2" />Send message</Button>
                </form>
                {sent && (
                  <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="text-green-700 font-medium">
                    Thanks! Your message has been sent.
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </div>

          
        </div>
      </div>
    </AnimatedPage>
  )
}


