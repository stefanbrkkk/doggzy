'use client'

import React from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useLanguage } from '@/contexts/LanguageContext'
import { Briefcase, Heart, Play, Users, Award, Coffee, Globe } from 'lucide-react'
import Link from 'next/link'
import { AnimatedPage } from '@/components/animated-page'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { MediaLightbox } from '@/components/shared/media-lightbox'
import { StickyCTA } from '@/components/shared/sticky-cta'
import { AnimatedCounter } from '@/components/shared/animated-counter'
import { track } from '@/lib/analytics'

export default function CareersPage() {
  const { t } = useLanguage()
  const [activeQuizStep, setActiveQuizStep] = React.useState(0)
  const [quizAnswers, setQuizAnswers] = React.useState<Record<string, string>>({})
  const [showQuizResults, setShowQuizResults] = React.useState(false)

  const companyStats = {
    totalEmployees: 47,
    thisYear: 12,
    averageTenure: 2.3,
    satisfactionRate: 96
  }

  const jobMatchingQuiz = [
    {
      question: "What's your primary interest?",
      options: ["Technology & Engineering", "Marketing & Growth", "Operations & Support", "Leadership & Strategy"]
    },
    {
      question: "Preferred work style?",
      options: ["Remote-first", "Hybrid", "Office-based", "Flexible"]
    },
    {
      question: "Experience level?",
      options: ["Entry-level", "Mid-level", "Senior", "Executive"]
    },
    {
      question: "What motivates you most?",
      options: ["Making an impact", "Learning & growth", "Work-life balance", "Building something new"]
    }
  ]

  const sampleOpenings = [
    { 
      title: 'Frontend Engineer', 
      location: 'Remote', 
      type: 'Full-time', 
      dept: 'Engineering', 
      salary: '$90k–$130k', 
      emoji: '💻', 
      bullets: ['Build delightful UIs', 'Collaborate with designers', 'Optimize performance'],
      description: 'Join our engineering team to build beautiful, accessible interfaces that help connect dogs with loving families.',
      requirements: ['3+ years React/Next.js', 'TypeScript experience', 'Passion for animal welfare'],
      benefits: ['Health insurance', '401k matching', 'Learning budget', 'Flexible PTO']
    },
    { 
      title: 'Partnerships Manager', 
      location: 'Remote', 
      type: 'Full-time', 
      dept: 'Growth', 
      salary: '$80k–$120k', 
      emoji: '🤝', 
      bullets: ['Grow partner network', 'Manage pipelines', 'Negotiate agreements'],
      description: 'Help us expand our network of veterinary partners, pet stores, and animal welfare organizations.',
      requirements: ['2+ years partnership experience', 'Strong communication skills', 'CRM experience'],
      benefits: ['Health insurance', '401k matching', 'Learning budget', 'Flexible PTO']
    },
    { 
      title: 'Volunteer Coordinator', 
      location: 'Remote', 
      type: 'Part-time', 
      dept: 'Operations', 
      salary: 'Hourly', 
      emoji: '📅', 
      bullets: ['Schedule volunteers', 'Coordinate events', 'Support onboarding'],
      description: 'Coordinate our amazing volunteer network and help organize adoption events and community outreach.',
      requirements: ['Event planning experience', 'Volunteer management', 'Passion for community building'],
      benefits: ['Flexible schedule', 'Community impact', 'Skill development', 'Networking opportunities']
    }
  ]

  const employeeTestimonials = [
    {
      name: "Sarah Chen",
      role: "Frontend Engineer",
      tenure: "2 years",
      quote: "Working at Doggzy has been incredible. I get to use my technical skills to make a real difference in animal welfare. The team is supportive, the mission is meaningful, and I've grown so much as a developer.",
      video: '/api/placeholder/600/400',
      image: '/api/placeholder/300/300',
      dayInLife: [
        "Morning standup with the team",
        "Code review and pair programming",
        "Lunch with colleagues (virtual or in-person)",
        "Feature development and testing",
        "End-of-day reflection and planning"
      ]
    },
    {
      name: "Marcus Rodriguez",
      role: "Partnerships Manager",
      tenure: "1.5 years",
      quote: "Every partnership I build directly helps more dogs find homes. The impact is immediate and visible. Plus, the remote-first culture gives me the flexibility to travel while still being productive.",
      video: '/api/placeholder/600/400',
      image: '/api/placeholder/300/300',
      dayInLife: [
        "Check partnership metrics and KPIs",
        "Outreach to potential new partners",
        "Strategy meeting with growth team",
        "Partner calls and relationship building",
        "Documentation and follow-up"
      ]
    }
  ]

  const companyCulture = [
    {
      title: "Mission-Driven",
      description: "Every decision we make is guided by our commitment to animal welfare",
      icon: Heart,
      examples: ["Monthly impact reports", "Volunteer time off", "Adoption success celebrations"]
    },
    {
      title: "Remote-First",
      description: "Work from anywhere with flexible hours and async communication",
      icon: Globe,
      examples: ["Home office stipend", "Co-working space access", "Annual team retreats"]
    },
    {
      title: "Growth-Oriented",
      description: "Continuous learning and development opportunities for everyone",
      icon: Award,
      examples: ["Learning budget", "Conference attendance", "Mentorship programs"]
    }
  ]


  const faqs = [
    { q: 'Is Doggzy remote-first?', a: 'Yes, we are remote-first with occasional in-person retreats.' },
    { q: 'Do you offer learning budgets?', a: 'We provide a learning budget and encourage continuous growth.' },
    { q: 'How do I apply?', a: 'Use the Apply buttons to submit your application; our team responds within a week.' }
  ]


  const [lightboxOpen, setLightboxOpen] = React.useState(false)
  const [lightboxMedia, setLightboxMedia] = React.useState<{type:'image'|'video'; src:string; poster?:string; caption?:string} | undefined>()


  const handleQuizNext = () => {
    if (activeQuizStep < jobMatchingQuiz.length - 1) {
      setActiveQuizStep(activeQuizStep + 1)
    } else {
      setShowQuizResults(true)
      track('careers_quiz_completed', { 
        answers_count: Object.keys(quizAnswers).length,
        quiz_completed: true
      })
    }
  }

  const handleQuizAnswer = (answer: string) => {
    setQuizAnswers(prev => ({
      ...prev,
      [activeQuizStep]: answer
    }))
  }

  const getMatchedJobs = () => {
    return sampleOpenings.filter(job => {
      const interest = quizAnswers[0]
      if (interest && interest.includes("Technology") && job.dept !== "Engineering") return false
      if (interest && interest.includes("Marketing") && job.dept !== "Growth") return false
      if (interest && interest.includes("Operations") && job.dept !== "Operations") return false
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
              <source src="/api/placeholder/video/careers-hero" type="video/mp4" />
            </video>
          </div>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
            <div className="text-center max-w-4xl mx-auto">
              <Badge className="mb-6 bg-gradient-to-r from-orange-100 to-red-100 text-orange-800 border-orange-200">
                <Briefcase className="h-4 w-4 mr-2" />
                {t.careers.hero.badge}
              </Badge>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold mb-6">
                <span className="bg-gradient-to-r from-gray-900 via-orange-600 to-red-600 bg-clip-text text-transparent">
                  {t.careers.hero.title}
                </span>
                <br />
                <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                  {t.careers.hero.titleHighlight}
                </span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">{t.careers.hero.subtitle}</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  variant="glow"
                  onClick={() => {
                    setLightboxMedia({ type: 'video', src: '/api/placeholder/video/team-stories', caption: 'Team Stories' })
                    setLightboxOpen(true)
                    track('hero_video_clicked', { page: 'careers', video: 'team_stories' })
                  }}
                  className="group"
                >
                  <Play className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
                  Watch Team Stories
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  onClick={() => setActiveQuizStep(0)}
                >
                  Find My Perfect Role
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Company Stats Counter */}
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
                  <AnimatedCounter value={companyStats.totalEmployees} />
                </div>
                <div className="text-sm text-gray-600">Team Members</div>
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="group"
              >
                <div className="text-3xl font-bold text-red-600 mb-2">
                  <AnimatedCounter value={companyStats.thisYear} />
                </div>
                <div className="text-sm text-gray-600">Hired This Year</div>
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="group"
              >
                <div className="text-3xl font-bold text-green-600 mb-2">
                  <AnimatedCounter value={`${companyStats.averageTenure} years`} />
                </div>
                <div className="text-sm text-gray-600">Avg. Tenure</div>
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="group"
              >
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  <AnimatedCounter value={`${companyStats.satisfactionRate}%`} />
                </div>
                <div className="text-sm text-gray-600">Job Satisfaction</div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Interactive Job Matching Quiz */}
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
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Find Your Perfect Role</h2>
                    <div className="flex justify-center mb-4">
                      {jobMatchingQuiz.map((_, index) => (
                        <div
                          key={index}
                          className={`w-3 h-3 rounded-full mx-1 ${
                            index <= activeQuizStep ? 'bg-orange-500' : 'bg-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-gray-600">Question {activeQuizStep + 1} of {jobMatchingQuiz.length}</p>
                  </div>
                  
                  <Card className="border-0 shadow-lg bg-white/95">
                    <CardContent className="p-8">
                      <h3 className="text-xl font-semibold text-gray-900 mb-6">
                        {jobMatchingQuiz[activeQuizStep].question}
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {jobMatchingQuiz[activeQuizStep].options.map((option) => (
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
                          {activeQuizStep === jobMatchingQuiz.length - 1 ? 'See Results' : 'Next'}
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
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">Your Perfect Role Matches</h2>
                  <p className="text-gray-600 mb-8">Based on your preferences, here are roles that might be perfect for you:</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {getMatchedJobs().map((job) => (
                      <motion.div
                        key={job.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="group"
                      >
                        <Card className="border-0 shadow-lg bg-white/95 overflow-hidden hover:shadow-xl transition-shadow">
                          <CardContent className="p-6">
                            <div className="text-4xl mb-4 text-center">{job.emoji}</div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">{job.title}</h3>
                            <p className="text-gray-600 mb-2">{job.dept} • {job.location} • {job.type}</p>
                            <p className="text-sm text-gray-700 mb-4">{job.description}</p>
                            <div className="space-y-2 mb-4">
                              <div className="text-xs font-semibold text-gray-900">Requirements:</div>
                              {job.requirements.map((req) => (
                                <div key={req} className="text-xs text-gray-600">• {req}</div>
                              ))}
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="font-semibold text-orange-600">{job.salary}</span>
                              <Button size="sm">
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
                        track('careers_quiz_retaken', { page: 'careers' })
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

        {/* Enhanced Job Openings */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Current Openings</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Join our mission-driven team and help us connect more dogs with loving families
              </p>
            </div>
            
            <div className="space-y-8">
              {sampleOpenings.map((job, idx) => (
                <motion.div
                  key={job.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="group"
                >
                  <Card className="border-0 shadow-lg bg-white/95 overflow-hidden hover:shadow-xl transition-shadow">
                    <CardContent className="p-0">
                      <div className="grid grid-cols-1 md:grid-cols-3">
                        <div className="p-6 md:p-8 bg-gradient-to-br from-orange-50 to-red-50 border-r border-border/50">
                          <div className="text-4xl mb-3">{job.emoji}</div>
                          <div className="text-2xl font-bold text-gray-900 mb-1">{job.title}</div>
                          <div className="text-sm text-gray-600 mb-2">{job.dept} • {job.location} • {job.type}</div>
                          <div className="text-sm font-medium text-orange-700">{job.salary}</div>
                        </div>
                        <div className="p-6 md:p-8 md:col-span-2 flex flex-col justify-between">
                          <div className="space-y-4">
                            <p className="text-gray-700">{job.description}</p>
                            <div>
                              <div className="font-semibold text-gray-900 mb-2">Day in the life</div>
                              <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
                                {job.bullets.map((b) => <li key={b}>{b}</li>)}
                              </ul>
                            </div>
                          </div>
                          <div className="mt-6 flex flex-wrap gap-3">
                            <Link href={`/careers/apply?role=${encodeURIComponent(job.title)}`}>
                              <Button variant="glow" size="sm">Apply</Button>
                            </Link>
                            <Link href="/contact">
                              <Button variant="outline" size="sm">Ask Recruiting</Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Employee Testimonials & Day in Life */}
        <section className="py-16 bg-gradient-to-br from-orange-50 to-red-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Hear from real employees about their experience working at Doggzy
              </p>
            </div>
            
            <div className="space-y-12">
              {employeeTestimonials.map((employee, idx) => (
                <motion.div
                  key={employee.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.2 }}
                  className="group"
                >
                  <Card className="border-0 shadow-lg bg-white/95 overflow-hidden hover:shadow-xl transition-shadow">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                      <div className="relative h-64 lg:h-full">
                        <Image
                          src={employee.image}
                          alt={employee.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                        <div className="absolute bottom-4 left-4 text-white">
                          <Badge className="bg-white/20 text-white border-white/30">
                            {employee.tenure}
                          </Badge>
                        </div>
                      </div>
                      <div className="p-8 flex flex-col justify-center">
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">{employee.name}</h3>
                        <p className="text-orange-600 font-semibold mb-4">{employee.role}</p>
                        <p className="text-gray-700 mb-6 leading-relaxed">&quot;{employee.quote}&quot;</p>
                        <div className="space-y-2 mb-6">
                          <div className="text-sm font-semibold text-gray-900">Day in the life:</div>
                          {employee.dayInLife.map((activity, i) => (
                            <div key={i} className="text-sm text-gray-600">• {activity}</div>
                          ))}
                        </div>
                        <div className="flex gap-4">
                          <Button 
                            size="sm"
                            onClick={() => {
                              setLightboxMedia({ type: 'video', src: employee.video, caption: employee.name })
                              setLightboxOpen(true)
                            }}
                            className="group/btn"
                          >
                            <Play className="h-4 w-4 mr-2 group-hover/btn:scale-110 transition-transform" />
                            Watch Video
                          </Button>
                          <Button variant="outline" size="sm">
                            Learn More
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

        {/* Company Culture Showcase */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Culture</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                What makes Doggzy a special place to work
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {companyCulture.map((culture, idx) => (
                <motion.div
                  key={culture.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="group"
                >
                  <Card className="border-0 shadow-lg bg-white/95 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                    <CardContent className="p-8 text-center">
                      <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
                        <culture.icon className="h-8 w-8" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-4">{culture.title}</h3>
                      <p className="text-gray-600 mb-4">{culture.description}</p>
                      <div className="space-y-2">
                        {culture.examples.map((example, i) => (
                          <div key={i} className="text-sm text-gray-500">• {example}</div>
                        ))}
                      </div>
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
                Everything you need to know about working at Doggzy
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

        {/* Enhanced Volunteer Opportunities */}
        <section className="py-20 bg-gradient-to-br from-orange-50 via-white to-red-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <Badge className="mb-6 bg-gradient-to-r from-orange-100 to-red-100 text-orange-800 border-orange-200">
                <Users className="h-4 w-4 mr-2" />
                Community Impact
              </Badge>
              <h2 className="text-4xl sm:text-5xl font-display font-bold mb-6">
                <span className="bg-gradient-to-r from-gray-900 via-orange-600 to-red-600 bg-clip-text text-transparent">
                  Volunteer Opportunities
                </span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Join our passionate community of volunteers and make a real difference in the lives of dogs and their families. Every hour you give creates lasting impact.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {[
                {
                  title: 'Event Volunteer',
                  desc: 'Help at adoption events, fundraisers, and community outreach programs. Perfect for people who love meeting new faces and spreading awareness.',
                  emoji: '🎪',
                  timeCommitment: '2-4 hours per event',
                  skills: ['Communication', 'Event planning', 'Customer service'],
                  impact: 'Help 20+ dogs find homes per event'
                },
                {
                  title: 'Transport Driver',
                  desc: 'Drive dogs to foster homes, veterinary appointments, and adoption events. Essential role for our rescue operations.',
                  emoji: '🚐',
                  timeCommitment: 'Flexible scheduling',
                  skills: ['Driving', 'Animal handling', 'Reliability'],
                  impact: 'Save 50+ dogs monthly through transport'
                },
                {
                  title: 'Content Creator',
                  desc: 'Create compelling social media posts, write success stories, and help us share our mission with the world.',
                  emoji: '📝',
                  timeCommitment: '5-10 hours per week',
                  skills: ['Writing', 'Social media', 'Photography'],
                  impact: 'Reach 10,000+ people monthly'
                },
                {
                  title: 'Foster Coordinator',
                  desc: 'Match dogs with foster families, provide support to foster parents, and ensure smooth transitions.',
                  emoji: '🏠',
                  timeCommitment: '10-15 hours per week',
                  skills: ['Organization', 'Communication', 'Problem solving'],
                  impact: 'Coordinate 100+ foster placements'
                },
                {
                  title: 'Veterinary Assistant',
                  desc: 'Assist with medical care, health checks, and rehabilitation of rescued dogs. Great for vet students or animal lovers.',
                  emoji: '🩺',
                  timeCommitment: '4-8 hours per week',
                  skills: ['Animal care', 'Medical knowledge', 'Compassion'],
                  impact: 'Provide care for 200+ dogs annually'
                },
                {
                  title: 'Community Outreach',
                  desc: 'Build relationships with local businesses, schools, and organizations to expand our network and impact.',
                  emoji: '🤝',
                  timeCommitment: '6-12 hours per week',
                  skills: ['Networking', 'Public speaking', 'Relationship building'],
                  impact: 'Establish 20+ new partnerships yearly'
                }
              ].map((role, idx) => (
                <motion.div
                  key={role.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="group"
                >
                  <Card className="border-0 shadow-lg bg-white/95 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 h-full">
                    <CardContent className="p-8 h-full flex flex-col">
                      <div className="text-center mb-6">
                        <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">{role.emoji}</div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">{role.title}</h3>
                        <Badge variant="outline" className="text-orange-600 border-orange-200">
                          {role.timeCommitment}
                        </Badge>
                      </div>
                      
                      <p className="text-gray-600 mb-6 flex-grow leading-relaxed">{role.desc}</p>
                      
                      <div className="space-y-4 mb-6">
                        <div>
                          <div className="text-sm font-semibold text-gray-900 mb-2">Skills needed:</div>
                          <div className="flex flex-wrap gap-2">
                            {role.skills.map((skill) => (
                              <Badge key={skill} variant="secondary" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="p-3 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg">
                          <div className="text-sm font-semibold text-orange-800 mb-1">Impact:</div>
                          <div className="text-sm text-orange-700">{role.impact}</div>
                        </div>
                      </div>
                      
                      <div className="mt-auto">
                        <Link href="/careers/apply">
                          <Button 
                            size="sm" 
                            className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white group-hover:scale-105 transition-all duration-300"
                          >
                            <Heart className="h-4 w-4 mr-2" />
                            I&apos;m Interested
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
            
            {/* Volunteer Benefits */}
            <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
              <div className="text-center mb-8">
                <h3 className="text-3xl font-bold text-gray-900 mb-4">Why Volunteer with Doggzy?</h3>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Join a community that values your time and provides meaningful experiences
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { icon: Heart, title: 'Make Real Impact', desc: 'See the direct results of your efforts in dogs&apos; lives' },
                  { icon: Users, title: 'Join Community', desc: 'Connect with like-minded animal lovers and advocates' },
                  { icon: Award, title: 'Gain Experience', desc: 'Develop skills in animal care, event planning, and more' },
                  { icon: Coffee, title: 'Flexible Schedule', desc: 'Volunteer on your own time with various commitment levels' }
                ].map((benefit, idx) => (
                  <motion.div
                    key={benefit.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="text-center"
                  >
                    <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white shadow-lg">
                      <benefit.icon className="h-8 w-8" />
                    </div>
                    <h4 className="text-lg font-bold text-gray-900 mb-2">{benefit.title}</h4>
                    <p className="text-gray-600 text-sm">{benefit.desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-orange-500 to-red-500 text-white text-center">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h3 className="text-3xl font-bold mb-4">{t.careers.sections.apply}</h3>
            <Link href="/careers/apply">
              <Button size="lg" variant="secondary">
                <Heart className="h-5 w-5 mr-2" />
                {t.careers.sections.apply}
              </Button>
            </Link>
          </div>
        </section>

        {/* Sticky CTA and Media Lightbox */}
        <StickyCTA actions={[
          { label: t.careers.sections.apply, onClick: () => { window.location.href = '/careers/apply' } },
          { label: 'Ask Recruiting', onClick: () => { window.location.href = '/contact' }, variant: 'secondary' },
        ]} />
        <MediaLightbox open={lightboxOpen} media={lightboxMedia} onClose={() => setLightboxOpen(false)} />
      </AnimatedPage>
    </div>
  )
}


