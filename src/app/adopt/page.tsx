'use client'

import React from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useLanguage } from '@/contexts/LanguageContext'
import { Heart, Play, Users, Clock, MapPin, Star, CheckCircle, ArrowRight, Filter, Search, Camera, Phone, Mail } from 'lucide-react'
import Link from 'next/link'
import { AnimatedPage } from '@/components/animated-page'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { LargeStoryCard } from '@/components/shared/large-story-card'
import { MediaLightbox } from '@/components/shared/media-lightbox'
import { StickyCTA } from '@/components/shared/sticky-cta'
import { AnimatedCounter } from '@/components/shared/animated-counter'
import { track } from '@/lib/analytics'

export default function AdoptPage() {
  const { t } = useLanguage()
  const [activeQuizStep, setActiveQuizStep] = React.useState(0)
  const [quizAnswers, setQuizAnswers] = React.useState<Record<string, string>>({})
  const [showQuizResults, setShowQuizResults] = React.useState(false)
  const [selectedDog, setSelectedDog] = React.useState<any>(null)
  const [filterAge, setFilterAge] = React.useState('')
  const [filterSize, setFilterSize] = React.useState('')
  const [showVideo, setShowVideo] = React.useState(false)

  const adoptionStats = {
    totalAdopted: 2847,
    thisMonth: 156,
    averageDays: 12,
    successRate: 98
  }

  const quizQuestions = [
    {
      question: "What's your living situation?",
      options: ["Apartment", "House with yard", "Farm/Rural", "Condo"]
    },
    {
      question: "How active are you?",
      options: ["Very active", "Moderately active", "Prefer indoor activities", "Mixed"]
    },
    {
      question: "Experience with dogs?",
      options: ["First-time owner", "Some experience", "Very experienced", "Professional"]
    },
    {
      question: "Preferred size?",
      options: ["Small (under 25lbs)", "Medium (25-60lbs)", "Large (60-90lbs)", "Giant (90lbs+)"]
    }
  ]

  const availableDogs = [
    {
      id: 1,
      name: "Bella",
      breed: "Golden Retriever Mix",
      age: "2 years",
      size: "Medium",
      location: "Foster Home",
      description: "Sweet, gentle, great with kids and other dogs. Loves fetch and cuddles.",
      images: ['/api/placeholder/400/400', '/api/placeholder/400/300'],
      personality: ["Gentle", "Playful", "Social"],
      urgent: false,
      adoptionFee: 250,
      medicalInfo: "Up to date on vaccines, spayed, microchipped"
    },
    {
      id: 2,
      name: "Max",
      breed: "German Shepherd",
      age: "4 years",
      size: "Large",
      location: "Main Shelter",
      description: "Loyal, intelligent, needs experienced owner. Great guard dog.",
      images: ['/api/placeholder/400/400', '/api/placeholder/400/300'],
      personality: ["Loyal", "Protective", "Smart"],
      urgent: true,
      adoptionFee: 200,
      medicalInfo: "Needs ongoing medication for hip dysplasia"
    },
    {
      id: 3,
      name: "Luna",
      breed: "Pit Bull Terrier",
      age: "1 year",
      size: "Medium",
      location: "Foster Home",
      description: "Energetic puppy, very affectionate, learning basic commands.",
      images: ['/api/placeholder/400/400', '/api/placeholder/400/300'],
      personality: ["Energetic", "Affectionate", "Learning"],
      urgent: false,
      adoptionFee: 300,
      medicalInfo: "Recently vaccinated, spayed, healthy"
    }
  ]

  const adoptionProcess = [
    { step: 1, title: "Browse & Match", description: "Find your perfect companion using our matching system", icon: Search },
    { step: 2, title: "Meet & Greet", description: "Schedule a visit to meet your potential new family member", icon: Heart },
    { step: 3, title: "Application", description: "Complete our comprehensive adoption application", icon: CheckCircle },
    { step: 4, title: "Home Check", description: "Quick virtual or in-person home assessment", icon: MapPin },
    { step: 5, title: "Welcome Home", description: "Take your new best friend home!", icon: Star }
  ]

  const successStories = [
    {
      name: "Bella & The Johnson Family",
      story: "After losing our previous dog, we weren't sure we were ready. But when we saw Bella's photo, something clicked. The matching quiz suggested we'd be perfect together, and they were right! Bella has brought so much joy back into our home.",
      beforeImg: '/api/placeholder/300/300',
      afterImg: '/api/placeholder/300/300',
      adoptionDate: "March 2024",
      video: '/api/placeholder/600/400'
    },
    {
      name: "Rocky & Sarah",
      story: "As a single professional, I needed a companion who could handle my busy schedule but still be loving. Rocky has been the perfect balance - independent enough when I'm at work, but always ready for weekend adventures.",
      beforeImg: '/api/placeholder/300/300',
      afterImg: '/api/placeholder/300/300',
      adoptionDate: "January 2024",
      video: '/api/placeholder/600/400'
    }
  ]

  const faqs = [
    { q: 'How long does adoption take?', a: 'Typically 1-2 weeks, depending on fit and checks.' },
    { q: 'Do you allow out-of-area adoptions?', a: 'Yes, with virtual checks and transport coordination.' },
    { q: 'What costs are involved?', a: 'Adoption fees cover vaccines, microchip, and initial care.' }
  ]

  const [lightboxOpen, setLightboxOpen] = React.useState(false)
  const [lightboxMedia, setLightboxMedia] = React.useState<{type:'image'|'video'; src:string; poster?:string; caption?:string} | undefined>()

  const benefits = [
    t.adopt.sections.benefits?.saveLife,
    t.adopt.sections.benefits?.companionship,
    t.adopt.sections.benefits?.community
  ].filter(Boolean) as string[]

  const handleQuizNext = () => {
    if (activeQuizStep < quizQuestions.length - 1) {
      setActiveQuizStep(activeQuizStep + 1)
    } else {
      setShowQuizResults(true)
      track('adoption_quiz_completed', { answers: quizAnswers })
    }
  }

  const handleQuizAnswer = (answer: string) => {
    setQuizAnswers(prev => ({
      ...prev,
      [activeQuizStep]: answer
    }))
  }

  const getMatchedDogs = () => {
    return availableDogs.filter(dog => {
      const sizePreference = quizAnswers[3]
      if (sizePreference && sizePreference.includes("Small") && dog.size !== "Small") return false
      if (sizePreference && sizePreference.includes("Large") && dog.size !== "Large") return false
      return true
    })
  }

  const filteredDogs = availableDogs.filter(dog => {
    if (filterAge && !dog.age.includes(filterAge)) return false
    if (filterSize && dog.size !== filterSize) return false
    return true
  })

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
              <source src="/api/placeholder/video/adoption-hero" type="video/mp4" />
            </video>
          </div>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
            <div className="text-center max-w-4xl mx-auto">
              <Badge className="mb-6 bg-gradient-to-r from-orange-100 to-red-100 text-orange-800 border-orange-200">
                {t.adopt.hero.badge}
              </Badge>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold mb-6">
                <span className="bg-gradient-to-r from-gray-900 via-orange-600 to-red-600 bg-clip-text text-transparent">
                  {t.adopt.hero.title}
                </span>
                <br />
                <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                  {t.adopt.hero.titleHighlight}
                </span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">{t.adopt.hero.subtitle}</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  variant="glow"
                  onClick={() => setShowVideo(true)}
                  className="group"
                >
                  <Play className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
                  Watch Success Stories
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  onClick={() => setActiveQuizStep(0)}
                >
                  Find My Perfect Match
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Live Adoption Counter */}
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
                  <AnimatedCounter value={adoptionStats.totalAdopted} />
                </div>
                <div className="text-sm text-gray-600">Dogs Adopted</div>
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="group"
              >
                <div className="text-3xl font-bold text-red-600 mb-2">
                  <AnimatedCounter value={adoptionStats.thisMonth} />
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
                  <AnimatedCounter value={adoptionStats.averageDays} />
                </div>
                <div className="text-sm text-gray-600">Avg. Days to Adopt</div>
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="group"
              >
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  <AnimatedCounter value={`${adoptionStats.successRate}%`} />
                </div>
                <div className="text-sm text-gray-600">Success Rate</div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Interactive Pet Matching Quiz */}
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
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Find Your Perfect Match</h2>
                    <div className="flex justify-center mb-4">
                      {quizQuestions.map((_, index) => (
                        <div
                          key={index}
                          className={`w-3 h-3 rounded-full mx-1 ${
                            index <= activeQuizStep ? 'bg-orange-500' : 'bg-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-gray-600">Question {activeQuizStep + 1} of {quizQuestions.length}</p>
                  </div>
                  
                  <Card className="border-0 shadow-lg bg-white/95">
                    <CardContent className="p-8">
                      <h3 className="text-xl font-semibold text-gray-900 mb-6">
                        {quizQuestions[activeQuizStep].question}
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {quizQuestions[activeQuizStep].options.map((option) => (
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
                          {activeQuizStep === quizQuestions.length - 1 ? 'See Results' : 'Next'}
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
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">Your Perfect Matches</h2>
                  <p className="text-gray-600 mb-8">Based on your preferences, here are dogs that might be perfect for you:</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {getMatchedDogs().map((dog) => (
                      <motion.div
                        key={dog.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="group"
                      >
                        <Card className="border-0 shadow-lg bg-white/95 overflow-hidden hover:shadow-xl transition-shadow">
                          <div className="relative">
                            <Image
                              src={dog.images[0]}
                              alt={dog.name}
                              width={400}
                              height={300}
                              className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            {dog.urgent && (
                              <Badge className="absolute top-2 right-2 bg-red-500 text-white">
                                Urgent
                              </Badge>
                            )}
                          </div>
                          <CardContent className="p-6">
                            <h3 className="text-xl font-bold text-gray-900 mb-2">{dog.name}</h3>
                            <p className="text-gray-600 mb-2">{dog.breed} • {dog.age} • {dog.size}</p>
                            <p className="text-sm text-gray-700 mb-4">{dog.description}</p>
                            <div className="flex flex-wrap gap-2 mb-4">
                              {dog.personality.map((trait) => (
                                <Badge key={trait} variant="secondary" className="text-xs">
                                  {trait}
                                </Badge>
                              ))}
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="font-semibold text-orange-600">${dog.adoptionFee}</span>
                              <Button size="sm" onClick={() => setSelectedDog(dog)}>
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

        {/* Adoption Process Timeline */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Adoption Process</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                We've streamlined our process to make finding your perfect companion as smooth as possible
              </p>
            </div>
            
            <div className="relative">
              <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-200 transform -translate-y-1/2 hidden md:block" />
              <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
                {adoptionProcess.map((step, index) => (
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
        {/* Enhanced Success Stories */}
        <section className="py-16 bg-gradient-to-br from-orange-50 to-red-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Success Stories</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Real families, real transformations, real love stories
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
                            {story.adoptionDate}
                          </Badge>
                        </div>
                      </div>
                      <div className="p-8 flex flex-col justify-center">
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">{story.name}</h3>
                        <p className="text-gray-700 mb-6 leading-relaxed">"{story.story}"</p>
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
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Adopt?</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Discover the incredible benefits of giving a dog a second chance at life
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
                        <Heart className="h-8 w-8" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-4">{benefit}</h3>
                      <p className="text-gray-600">
                        {benefit === benefits[0] && "Save a life and make room for another dog in need"}
                        {benefit === benefits[1] && "Experience unconditional love and companionship every day"}
                        {benefit === benefits[2] && "Join a community of caring pet owners and animal lovers"}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Enhanced FAQ Section */}
        <section className="py-16 bg-gradient-to-br from-gray-50 to-orange-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Everything you need to know about our adoption process
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
              <Heart className="h-5 w-5 mr-2" />
              {t.nav.donateNow}
            </Button>
          </div>
        </section>

        {/* Sticky CTA and Media Lightbox */}
        <StickyCTA actions={[
          { label: t.adopt.sections.apply, onClick: () => { window.location.href = '/adopt/apply' } },
          { label: 'Book a call', onClick: () => { window.location.href = '/contact' }, variant: 'secondary' },
        ]} />
        <MediaLightbox open={lightboxOpen} media={lightboxMedia} onClose={() => setLightboxOpen(false)} />
      </AnimatedPage>
    </div>
  )
}


