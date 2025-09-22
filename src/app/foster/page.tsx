'use client'

export const dynamic = 'force-dynamic'

import React from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useLanguage } from '@/contexts/LanguageContext'
import { HandHeart, Play, Users, Clock, MapPin, Star, CheckCircle, ArrowRight, Filter, Search, Camera, Phone, Mail, Heart, Shield, Home, Calendar } from 'lucide-react'
import Link from 'next/link'
import { AnimatedPage } from '@/components/animated-page'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { LargeStoryCard } from '@/components/shared/large-story-card'
import { MediaLightbox } from '@/components/shared/media-lightbox'
import { StickyCTA } from '@/components/shared/sticky-cta'
import { AnimatedCounter } from '@/components/shared/animated-counter'
import { track } from '@/lib/analytics'

export default function FosterPage() {
  const { t } = useLanguage()
  const [activeQuizStep, setActiveQuizStep] = React.useState(0)
  const [quizAnswers, setQuizAnswers] = React.useState<Record<string, string>>({})
  const [showQuizResults, setShowQuizResults] = React.useState(false)
  const [selectedFosterType, setSelectedFosterType] = React.useState('')
  const [showVideo, setShowVideo] = React.useState(false)

  const fosterStats = {
    totalFostered: 1247,
    thisMonth: 89,
    averageDays: 28,
    successRate: 94
  }

  const fosterQuizQuestions = [
    {
      question: "What's your living situation?",
      options: ["Apartment", "House with yard", "Farm/Rural", "Condo"]
    },
    {
      question: "How much time can you dedicate daily?",
      options: ["1-2 hours", "3-4 hours", "5-6 hours", "Full-time care"]
    },
    {
      question: "Experience with dogs?",
      options: ["First-time", "Some experience", "Very experienced", "Professional"]
    },
    {
      question: "Preferred foster type?",
      options: ["Puppies", "Adult dogs", "Senior dogs", "Special needs"]
    }
  ]

  const fosterTypes = [
    {
      id: 1,
      name: "Puppy Foster",
      description: "Care for young puppies until they're ready for adoption",
      duration: "2-8 weeks",
      requirements: ["Puppy-proof home", "Flexible schedule", "Patience"],
      support: ["24/7 vet line", "Training resources", "Supply kit"],
      icon: "🐕‍🦺",
      urgent: false
    },
    {
      id: 2,
      name: "Medical Foster",
      description: "Provide specialized care for dogs recovering from surgery or illness",
      duration: "2-12 weeks",
      requirements: ["Medical experience preferred", "Quiet environment", "Administer medication"],
      support: ["Vet consultations", "Medical supplies", "Training"],
      icon: "🏥",
      urgent: true
    },
    {
      id: 3,
      name: "Senior Foster",
      description: "Give comfort and love to older dogs in their golden years",
      duration: "Ongoing",
      requirements: ["Gentle approach", "Low-activity lifestyle", "Compassion"],
      support: ["Senior care guide", "Mobility aids", "End-of-life support"],
      icon: "👴",
      urgent: false
    }
  ]

  const fosterProcess = [
    { step: 1, title: "Apply & Interview", description: "Complete application and virtual home visit", icon: CheckCircle },
    { step: 2, title: "Training", description: "Attend foster orientation and training sessions", icon: Users },
    { step: 3, title: "First Placement", description: "Receive your first foster dog with full support", icon: Heart },
    { step: 4, title: "Ongoing Support", description: "24/7 support and regular check-ins", icon: Phone },
    { step: 5, title: "Adoption Day", description: "Help your foster find their forever home", icon: Star }
  ]

  const successStories = [
    {
      name: "Sarah & Luna's Journey",
      story: "Luna came to us as a scared, malnourished puppy. Through 6 weeks of love, proper nutrition, and training, she transformed into a confident, happy dog. Seeing her go to her forever family was the most rewarding experience.",
      beforeImg: '/api/placeholder/300/300',
      afterImg: '/api/placeholder/300/300',
      fosterDuration: "6 weeks",
      video: '/api/placeholder/600/400',
      type: "Puppy Foster"
    },
    {
      name: "Mike & Buddy's Recovery",
      story: "Buddy needed post-surgery care after being hit by a car. As a medical foster, I provided the specialized care he needed. The vet said my care was crucial to his full recovery. Now he's running and playing with his new family.",
      beforeImg: '/api/placeholder/300/300',
      afterImg: '/api/placeholder/300/300',
      fosterDuration: "8 weeks",
      video: '/api/placeholder/600/400',
      type: "Medical Foster"
    }
  ]

  const supportResources = [
    {
      title: "24/7 Support Line",
      description: "Always available for questions and emergencies",
      icon: Phone,
      contact: "1-800-FOSTER"
    },
    {
      title: "Veterinary Care",
      description: "All medical expenses covered by the shelter",
      icon: Shield,
      contact: "Partner vet network"
    },
    {
      title: "Supply Kit",
      description: "Food, toys, bedding, and basic supplies provided",
      icon: Home,
      contact: "Delivered to your door"
    },
    {
      title: "Training Resources",
      description: "Access to behaviorists and training materials",
      icon: Users,
      contact: "Online and in-person"
    }
  ]

  const faqs = [
    { q: 'How long is a foster placement?', a: 'From 2 weeks to 2 months on average.' },
    { q: 'What if I need help?', a: 'Our coordinators are available and we cover medical costs.' },
    { q: 'Can I adopt my foster?', a: 'Yes, many fosters become forever homes.' }
  ]

  const [lightboxOpen, setLightboxOpen] = React.useState(false)
  const [lightboxMedia, setLightboxMedia] = React.useState<{type:'image'|'video'; src:string; poster?:string; caption?:string} | undefined>()

  const benefits = [
    t.foster.sections.benefits?.lifesaving,
    t.foster.sections.benefits?.flexible,
    t.foster.sections.benefits?.rewarding
  ].filter(Boolean) as string[]

  const handleQuizNext = () => {
    if (activeQuizStep < fosterQuizQuestions.length - 1) {
      setActiveQuizStep(activeQuizStep + 1)
    } else {
      setShowQuizResults(true)
      track('foster_quiz_completed', { answers: quizAnswers })
    }
  }

  const handleQuizAnswer = (answer: string) => {
    setQuizAnswers(prev => ({
      ...prev,
      [activeQuizStep]: answer
    }))
  }

  const getMatchedFosterTypes = () => {
    return fosterTypes.filter(type => {
      const preference = quizAnswers[3]
      if (preference && preference.includes("Puppies") && type.name !== "Puppy Foster") return false
      if (preference && preference.includes("Special needs") && type.name !== "Medical Foster") return false
      if (preference && preference.includes("Senior") && type.name !== "Senior Foster") return false
      return true
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
      <AnimatedPage>
        {/* Hero Section with Video */}
        <section className="py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent z-10" />
          <div className="absolute inset-0">
            <video 
              autoPlay 
              muted 
              loop 
              className="w-full h-full object-cover opacity-30"
              poster="/api/placeholder/1200/600"
            >
              <source src="/api/placeholder/video/foster-hero" type="video/mp4" />
            </video>
          </div>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
            <div className="text-center max-w-4xl mx-auto">
              <Badge className="mb-6 bg-gradient-to-r from-orange-100 to-red-100 text-orange-800 border-orange-200">
                {t.foster.hero.badge}
              </Badge>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold mb-6">
                <span className="bg-gradient-to-r from-gray-900 via-orange-600 to-red-600 bg-clip-text text-transparent">
                  {t.foster.hero.title}
                </span>
                <br />
                <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                  {t.foster.hero.titleHighlight}
                </span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">{t.foster.hero.subtitle}</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  variant="glow"
                  onClick={() => setShowVideo(true)}
                  className="group"
                >
                  <Play className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
                  Watch Foster Stories
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  onClick={() => setActiveQuizStep(0)}
                >
                  Find My Foster Match
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Live Foster Counter */}
        <section className="py-12 bg-white border-y border-gray-100">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="group"
              >
                <div className="text-3xl font-bold text-orange-600 mb-2">
                  <AnimatedCounter value={fosterStats.totalFostered} />
                </div>
                <div className="text-sm text-gray-600">Dogs Fostered</div>
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="group"
              >
                <div className="text-3xl font-bold text-red-600 mb-2">
                  <AnimatedCounter value={fosterStats.thisMonth} />
                </div>
                <div className="text-sm text-gray-600">This Month</div>
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="group"
              >
                <div className="text-3xl font-bold text-green-600 mb-2">
                  <AnimatedCounter value={fosterStats.averageDays} />
                </div>
                <div className="text-sm text-gray-600">Avg. Foster Days</div>
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="group"
              >
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  <AnimatedCounter value={`${fosterStats.successRate}%`} />
                </div>
                <div className="text-sm text-gray-600">Success Rate</div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Interactive Foster Matching Quiz */}
        <AnimatePresence>
          {activeQuizStep >= 0 && !showQuizResults && (
            <section className="py-16 bg-gradient-to-br from-orange-50 to-red-50">
              <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="max-w-2xl mx-auto"
                >
                  <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Find Your Perfect Foster Match</h2>
                    <div className="flex justify-center mb-4">
                      {fosterQuizQuestions.map((_, index) => (
                        <div
                          key={index}
                          className={`w-3 h-3 rounded-full mx-1 ${
                            index <= activeQuizStep ? 'bg-orange-500' : 'bg-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-gray-600">Question {activeQuizStep + 1} of {fosterQuizQuestions.length}</p>
                  </div>
                  
                  <Card className="border-0 shadow-lg bg-white/95">
                    <CardContent className="p-8">
                      <h3 className="text-xl font-semibold text-gray-900 mb-6">
                        {fosterQuizQuestions[activeQuizStep].question}
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {fosterQuizQuestions[activeQuizStep].options.map((option) => (
                          <Button
                            key={option}
                            variant={quizAnswers[activeQuizStep] === option ? "default" : "outline"}
                            className="h-12 text-left justify-start"
                            onClick={() => handleQuizAnswer(option)}
                          >
                            {option}
                          </Button>
                        ))}
                      </div>
                      <div className="flex justify-between mt-8">
                        <Button
                          variant="outline"
                          onClick={() => setActiveQuizStep(Math.max(0, activeQuizStep - 1))}
                          disabled={activeQuizStep === 0}
                        >
                          Previous
                        </Button>
                        <Button
                          onClick={handleQuizNext}
                          disabled={!quizAnswers[activeQuizStep]}
                          className="bg-gradient-to-r from-orange-500 to-red-500"
                        >
                          {activeQuizStep === fosterQuizQuestions.length - 1 ? 'See Results' : 'Next'}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </section>
          )}
        </AnimatePresence>

        {/* Quiz Results */}
        <AnimatePresence>
          {showQuizResults && (
            <section className="py-16 bg-gradient-to-br from-green-50 to-blue-50">
              <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="max-w-4xl mx-auto text-center"
                >
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">Your Perfect Foster Matches</h2>
                  <p className="text-gray-600 mb-8">Based on your preferences, here are foster opportunities that might be perfect for you:</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {getMatchedFosterTypes().map((type) => (
                      <motion.div
                        key={type.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="group"
                      >
                        <Card className="border-0 shadow-lg bg-white/95 overflow-hidden hover:shadow-xl transition-shadow">
                          <CardContent className="p-6">
                            <div className="text-4xl mb-4 text-center">{type.icon}</div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">{type.name}</h3>
                            <p className="text-gray-600 mb-2">{type.duration}</p>
                            <p className="text-sm text-gray-700 mb-4">{type.description}</p>
                            <div className="space-y-2 mb-4">
                              <div className="text-xs font-semibold text-gray-900">Requirements:</div>
                              {type.requirements.map((req) => (
                                <div key={req} className="text-xs text-gray-600">• {req}</div>
                              ))}
                            </div>
                            <div className="flex justify-between items-center">
                              {type.urgent && (
                                <Badge className="bg-red-500 text-white text-xs">Urgent Need</Badge>
                              )}
                              <Button size="sm" onClick={() => setSelectedFosterType(type.name)}>
                                Learn More
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                  
                  <div className="mt-8">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowQuizResults(false)
                        setActiveQuizStep(0)
                        setQuizAnswers({})
                      }}
                    >
                      Retake Quiz
                    </Button>
                  </div>
                </motion.div>
              </div>
            </section>
          )}
        </AnimatePresence>

        {/* Foster Process Timeline */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Foster Process</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                We provide comprehensive support throughout your fostering journey
              </p>
            </div>
            
            <div className="relative">
              <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-200 transform -translate-y-1/2 hidden md:block" />
              <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
                {fosterProcess.map((step, index) => (
                  <motion.div
                    key={step.step}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="relative text-center group"
                  >
                    <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
                      <step.icon className="h-8 w-8" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{step.title}</h3>
                    <p className="text-sm text-gray-600">{step.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Support Resources */}
        <section className="py-16 bg-gradient-to-br from-orange-50 to-red-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Comprehensive Support</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                We provide everything you need to be a successful foster parent
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {supportResources.map((resource, idx) => (
                <motion.div
                  key={resource.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="group"
                >
                  <Card className="border-0 shadow-lg bg-white/95 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                    <CardContent className="p-6 text-center">
                      <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
                        <resource.icon className="h-8 w-8" />
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">{resource.title}</h3>
                      <p className="text-sm text-gray-600 mb-3">{resource.description}</p>
                      <div className="text-xs font-semibold text-orange-600">{resource.contact}</div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Enhanced Success Stories */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Foster Success Stories</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Real transformations, real impact, real love
              </p>
            </div>
            
            <div className="space-y-12">
              {successStories.map((story, idx) => (
                <motion.div
                  key={story.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.2 }}
                  className="group"
                >
                  <Card className="border-0 shadow-lg bg-white/95 overflow-hidden hover:shadow-xl transition-shadow">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                      <div className="relative h-64 lg:h-full">
                        <Image
                          src={story.afterImg}
                          alt={story.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                        <div className="absolute bottom-4 left-4 text-white">
                          <Badge className="bg-white/20 text-white border-white/30">
                            {story.fosterDuration}
                          </Badge>
                        </div>
                      </div>
                      <div className="p-8 flex flex-col justify-center">
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">{story.name}</h3>
                        <p className="text-gray-700 mb-6 leading-relaxed">&quot;{story.story}&quot;</p>
                        <div className="flex gap-4">
                          <Button 
                            size="sm"
                            onClick={() => {
                              setLightboxMedia({ type: 'video', src: story.video, caption: story.name })
                              setLightboxOpen(true)
                            }}
                            className="group/btn"
                          >
                            <Play className="h-4 w-4 mr-2 group-hover/btn:scale-110 transition-transform" />
                            Watch Video
                          </Button>
                          <Button variant="outline" size="sm">
                            Read Full Story
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Enhanced Benefits Section */}
        <section className="py-16 bg-gradient-to-br from-gray-50 to-orange-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Foster?</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Discover the incredible benefits of fostering a dog in need
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {benefits.map((benefit, idx) => (
                <motion.div
                  key={`benefit-${idx}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="group"
                >
                  <Card className="border-0 shadow-lg bg-white/95 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                    <CardContent className="p-8 text-center">
                      <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
                        <HandHeart className="h-8 w-8" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-4">{benefit}</h3>
                      <p className="text-gray-600">
                        {benefit === benefits[0] && "Save a life and make room for another dog in need"}
                        {benefit === benefits[1] && "Flexible commitment that fits your lifestyle"}
                        {benefit === benefits[2] && "Experience the joy of helping dogs find their forever homes"}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Enhanced FAQ Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Everything you need to know about fostering
              </p>
            </div>
            
            <div className="max-w-3xl mx-auto space-y-6">
              {faqs.map((faq, idx) => (
                <motion.div
                  key={faq.q}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <Card className="border-0 shadow-md bg-white/95 hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">{faq.q}</h3>
                      <p className="text-gray-700">{faq.a}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-orange-500 to-red-500 text-white text-center">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h3 className="text-3xl font-bold mb-4">{t.sponsor.cta.cantChoose}</h3>
            <Button size="lg" variant="secondary">
              <HandHeart className="h-5 w-5 mr-2" />
              {t.nav.donateNow}
            </Button>
          </div>
        </section>

        {/* Sticky CTA and Media Lightbox */}
        <StickyCTA actions={[
          { label: t.foster.sections.apply, onClick: () => { window.location.href = '/foster/apply' } },
          { label: 'Talk to a coordinator', onClick: () => { window.location.href = '/contact' }, variant: 'secondary' },
        ]} />
        <MediaLightbox open={lightboxOpen} media={lightboxMedia} onClose={() => setLightboxOpen(false)} />
      </AnimatedPage>
    </div>
  )
}


