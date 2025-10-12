'use client'

import React from 'react'
import { AnimatedPage } from '@/components/animated-page'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Mail, Phone, MapPin, Heart, Check, Clock } from 'lucide-react'
import { track } from '@/lib/analytics'
import { motion } from 'framer-motion'

export default function ContactPage() {
  const [copied, setCopied] = React.useState<string | null>(null)

  function copy(text: string) {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(text)
      setTimeout(() => setCopied(null), 1500)
    })
  }

  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    website: '' // honeypot
  })
  const [status, setStatus] = React.useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = React.useState('')

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  async function submitForm(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')
    setErrorMessage('')
    track('contact_submit')

    try {
      const response = await fetch('/api/forms/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          formType: 'contact'
        }),
      })

      const result = await response.json()

      if (response.ok) {
        setStatus('success')
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: '',
          website: ''
        })
      } else {
        setStatus('error')
        setErrorMessage(result.error || 'Nešto nije u redu. Molimo pokušajte ponovo.')
      }
    } catch {
      setStatus('error')
      setErrorMessage('Greška sa mrežom. Proverite konekciju i pokušajte ponovo.')
    }
  }

  return (
    <AnimatedPage>
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 pb-16 relative overflow-hidden">
        {/* Cinematic hero */}
        <section className="relative h-[50vh] md:h-[60vh] overflow-hidden mb-16">
          {/* Background with glassmorphism overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-orange-400/20 via-red-400/20 to-pink-400/20" />
          <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-white/30 to-transparent backdrop-blur-sm" />
          
          {/* Animated background elements */}
          <div className="absolute inset-0 overflow-hidden">
            <motion.div
              className="absolute top-20 left-10 w-32 h-32 bg-orange-300/30 rounded-full blur-2xl"
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.6, 0.3]
              }}
              transition={{ 
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <motion.div
              className="absolute bottom-20 right-10 w-40 h-40 bg-red-300/30 rounded-full blur-2xl"
              animate={{ 
                scale: [1.2, 1, 1.2],
                opacity: [0.4, 0.7, 0.4]
              }}
              transition={{ 
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1
              }}
            />
          </div>

          <div className="relative z-10 h-full flex items-end">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-8">
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="inline-block rounded-3xl bg-white/80 backdrop-blur-md px-8 py-6 shadow-2xl border border-white/20"
              >
                <motion.h1
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="text-4xl sm:text-5xl font-display font-bold text-gray-900 mb-4"
                >
                  Hajde da pričamo o spašavanju pasa
                </motion.h1>
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                  className="flex flex-col sm:flex-row gap-4 items-start sm:items-center"
                >
                  <a 
                    href="mailto:info@doggzy.rs" 
                    className="inline-flex items-center px-6 py-3 rounded-full bg-white text-gray-900 font-medium hover:bg-gray-50 transition-colors shadow-lg hover:scale-105 transform duration-200"
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Pošaljite email
                  </a>
                  <a 
                    href="#form" 
                    className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-orange-500 to-red-500 text-white font-medium hover:from-orange-600 hover:to-red-600 transition-colors shadow-lg hover:scale-105 transform duration-200"
                  >
                    <Heart className="h-4 w-4 mr-2" />
                    Kontaktirajte nas
                  </a>
                  <span className="inline-flex items-center text-sm text-gray-700 bg-white/70 rounded-full px-4 py-2 backdrop-blur-sm">
                    <Clock className="h-4 w-4 mr-1" />
                    Odgovaramo ~2h
                  </span>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
            {/* Left content */}
            <div className="lg:col-span-2 space-y-8 relative z-10">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-3xl sm:text-4xl font-display font-bold mb-4">
                  <span className="bg-gradient-to-r from-gray-900 via-orange-600 to-red-600 bg-clip-text text-transparent">
                    Kontaktirajte nas
                  </span>
                </h2>
                <p className="text-gray-700 text-lg leading-relaxed">
                  Volimo da čujemo od ljubitelja pasa. Javite nam se bilo kada! 
                  Svaka poruka može pokrenuti spašavanje.
                </p>
              </motion.div>

              {/* Story card with glassmorphism */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.4 }}
                className="relative grid grid-cols-1 md:grid-cols-3 gap-0 rounded-3xl overflow-hidden shadow-2xl bg-white/90 backdrop-blur-md border border-white/20"
              >
                <div className="relative h-48 md:h-full md:col-span-1">
                  <div className="w-full h-full bg-gradient-to-br from-orange-200 to-red-200 flex items-center justify-center text-6xl">
                    🐕
                  </div>
                </div>
                <div className="p-8 md:col-span-2">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    Svaka poruka može spasiti život
                  </h3>
                  <p className="text-gray-700 mb-4 leading-relaxed">
                    Bilo da usvajate, hranite, partnerirate ili prijavljujete zlostavljanje—vaša poruka 
                    pokreće spašavanje. Čitamo svaku poruku i obično odgovaramo u roku od nekoliko sati.
                  </p>
                  <p className="text-gray-700 font-medium">
                    Pomogli smo hiljadama pasa da pronađu sigurnost i ljubav. 
                    Recite nam kako možemo pomoći danas.
                  </p>
                </div>
              </motion.div>

              {/* Contact cards with enhanced design */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[{
                  icon: Mail,
                  title: 'Email',
                  text: 'info@doggzy.rs'
                },{
                  icon: Phone,
                  title: 'Telefon',
                  text: '+381 11 123 4567'
                },{
                  icon: MapPin,
                  title: 'Adresa',
                  text: 'Beograd, Srbija'
                }].map((contact, idx) => (
                  <motion.div 
                    key={contact.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 + idx * 0.1 }}
                    whileHover={{ rotate: 2, scale: 1.05 }}
                    className="group relative mx-auto w-full max-w-xs h-64 rounded-3xl bg-white/90 backdrop-blur-md border border-white/20 shadow-xl flex flex-col items-center justify-center text-center overflow-hidden"
                  >
                    {/* Glassmorphism hover effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-400/10 via-red-400/10 to-pink-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {/* Animated border */}
                    <div className="absolute inset-2 rounded-2xl border-2 border-orange-400/20 opacity-0 group-hover:opacity-60 transition-opacity duration-300" />
                    
                    <div className="relative z-10">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 text-white mb-4 shadow-lg group-hover:scale-110 transition-transform duration-200">
                        <contact.icon className="h-8 w-8" />
                      </div>
                      <div className="text-xl font-semibold text-gray-900 mb-2">{contact.title}</div>
                      <div className="text-gray-700 flex items-center justify-center gap-2">
                        <span>{contact.text}</span>
                        {(contact.title === 'Email' || contact.title === 'Telefon') && (
                          <button 
                            onClick={() => copy(contact.text)} 
                            className="text-xs px-3 py-1 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200 hover:scale-105 transform"
                          >
                            Kopiraj
                          </button>
                        )}
                        {copied === contact.text && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="text-green-600"
                          >
                            <Check className="h-4 w-4" />
                          </motion.div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Right form card with glassmorphism */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Card className="relative border-0 shadow-2xl bg-white/95 backdrop-blur-md overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-50/50 to-red-50/50" />
                <CardContent className="relative z-10 p-8 space-y-6" id="form">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Pozdravite se</h3>
                    <p className="text-gray-700">
                      Recite nam kako možemo da pomognemo. Obično odgovaramo u roku od 1-2 radna dana.
                    </p>
                  </div>
                  
                  <form onSubmit={submitForm} className="space-y-4">
                    <div className="space-y-4">
                      <input 
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors bg-white/80 backdrop-blur-sm" 
                        placeholder="Vaše ime" 
                        required 
                      />
                      <input 
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors bg-white/80 backdrop-blur-sm" 
                        placeholder="Email adresa" 
                        type="email" 
                        required 
                      />
                      <input 
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors bg-white/80 backdrop-blur-sm" 
                        placeholder="Naslov" 
                        required 
                      />
                      <textarea 
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors bg-white/80 backdrop-blur-sm resize-none" 
                        rows={4} 
                        placeholder="Vaša poruka" 
                        required 
                      />
                    </div>
                    
                    {/* Honeypot field */}
                    <input
                      name="website"
                      value={formData.website}
                      onChange={handleInputChange}
                      type="text"
                      className="hidden"
                      tabIndex={-1}
                      autoComplete="off"
                    />
                    
                    {status === 'error' && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        className="text-red-600 bg-red-50 p-4 rounded-xl font-medium border border-red-200"
                      >
                        {errorMessage}
                      </motion.div>
                    )}
                    
                    <Button 
                      type="submit" 
                      variant="glow" 
                      className="w-full py-4 text-lg hover:scale-105 transition-transform duration-200"
                      disabled={status === 'loading'}
                    >
                      {status === 'loading' ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          Šalje se...
                        </>
                      ) : (
                        <>
                          <Heart className="h-5 w-5 mr-2" />
                          Pošaljite poruku
                        </>
                      )}
                    </Button>
                  </form>
                  
                  {status === 'success' && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }} 
                      animate={{ opacity: 1, y: 0 }} 
                      className="text-green-700 bg-green-50 p-4 rounded-xl font-medium border border-green-200"
                    >
                      Hvala! Vaša poruka je poslata. Javićemo vam se u roku od 24 sata.
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </AnimatedPage>
  )
}