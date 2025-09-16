'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Heart, 
  Users, 
  Globe, 
  Award, 
  Shield, 
  Star,
  ArrowRight,
  PawPrint,
  Target,
  Lightbulb,
  HandHeart
} from 'lucide-react'
import React from 'react'
import { MotionContainer, MotionItem } from '@/components/shared/motion'
import { useLanguage } from '@/contexts/LanguageContext'
import { AnimatedPage } from '@/components/animated-page'

export default function AboutPage() {
  const { t } = useLanguage()
  
  const stats = [
    { icon: Heart, value: "15,000+", label: t.about.stats.livesSaved },
    { icon: Users, value: "500+", label: t.about.stats.partnerShelters },
    { icon: Globe, value: "47", label: t.about.stats.countries },
    { icon: Award, value: "98%", label: t.about.stats.successRate },
  ]

  const values = [
    {
      icon: Heart,
      title: t.about.values.compassionFirst.title,
      description: t.about.values.compassionFirst.description
    },
    {
      icon: Shield,
      title: t.about.values.transparency.title,
      description: t.about.values.transparency.description
    },
    {
      icon: Users,
      title: t.about.values.community.title,
      description: t.about.values.community.description
    },
    {
      icon: Award,
      title: t.about.values.excellence.title,
      description: t.about.values.excellence.description
    }
  ]

  const team = [
    {
      name: "Sarah Johnson",
      role: "Founder & CEO",
      image: "👩‍💼",
      bio: "Former veterinary technician with 15+ years of rescue experience. Founded Doggzy after witnessing the need for better coordination in rescue efforts."
    },
    {
      name: "Mike Rodriguez",
      role: "Rescue Operations Director",
      image: "👨‍⚕️",
      bio: "Former search and rescue specialist who brings military precision to our rescue operations and emergency response efforts."
    },
    {
      name: "Dr. Emily Chen",
      role: "Chief Veterinary Officer",
      image: "👩‍⚕️",
      bio: "Licensed veterinarian with specialization in emergency medicine and rehabilitation. Ensures every dog receives the best possible care."
    },
    {
      name: "David Park",
      role: "Community Outreach Manager",
      image: "👨‍💻",
      bio: "Former marketing executive who left corporate life to help build our global network of partners and supporters."
    }
  ]

  const milestones = [
    {
      year: "2020",
      title: "Doggzy Founded",
      description: "Started as a small local rescue organization in San Francisco"
    },
    {
      year: "2021",
      title: "First 1,000 Rescues",
      description: "Reached our first major milestone of 1,000 dogs rescued and rehomed"
    },
    {
      year: "2022",
      title: "Global Expansion",
      description: "Expanded to 10 countries with 50+ partner shelters"
    },
    {
      year: "2023",
      title: "10,000 Lives Saved",
      description: "Celebrated saving our 10,000th dog and launched our online platform"
    },
    {
      year: "2024",
      title: "15,000+ Rescues",
      description: "Current milestone with operations in 47 countries worldwide"
    }
  ]

  return (
    <AnimatedPage>
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
      {/* Hero Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 right-10 w-32 h-32 bg-orange-200/20 rounded-full blur-2xl animate-pulse" />
          <div className="absolute bottom-20 left-10 w-40 h-40 bg-red-200/20 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="mb-6 bg-gradient-to-r from-orange-100 to-red-100 text-orange-800 border-orange-200 hover:scale-105 transition-transform duration-200">
              <Heart className="h-4 w-4 mr-2" />
              {t.about.hero.badge}
            </Badge>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold mb-6">
              <span className="bg-gradient-to-r from-gray-900 via-orange-600 to-red-600 bg-clip-text text-transparent">
                {t.about.hero.title}
              </span>
              <br />
              <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                {t.about.hero.titleHighlight}
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              {t.about.hero.subtitle}
            </p>

            {/* Stats */}
            <MotionContainer className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              {stats.map((stat) => (
                <MotionItem key={stat.label}>
                  <div className="text-center hover:scale-105 transition-transform duration-200">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 text-white mb-4 hover:scale-110 transition-transform duration-200">
                      {React.createElement(stat.icon, { className: "h-8 w-8" })}
                    </div>
                    <div className="text-3xl font-bold text-orange-600 mb-2">
                      {stat.value}
                    </div>
                    <div className="text-gray-600 font-medium">
                      {stat.label}
                    </div>
                  </div>
                </MotionItem>
              ))}
            </MotionContainer>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                  {t.about.story.title}
                </span>
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                {t.about.story.description1}
              </p>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                {t.about.story.description2}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" variant="glow" className="hover:scale-105 transition-transform duration-200">
                  <Heart className="h-5 w-5 mr-2" />
                  {t.about.story.joinMission}
                </Button>
                <Button size="lg" variant="outline" className="hover:scale-105 transition-transform duration-200">
                  <ArrowRight className="h-5 w-5 mr-2" />
                  {t.about.story.learnMore}
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-orange-100 to-red-100 rounded-3xl flex items-center justify-center text-8xl">
                🐕
              </div>
              <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-orange-500 rounded-full flex items-center justify-center text-white text-2xl hover:scale-110 transition-transform duration-200">
                ❤️
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-20 bg-gradient-to-br from-orange-50 to-red-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              <span className="bg-gradient-to-r from-gray-900 via-orange-600 to-red-600 bg-clip-text text-transparent">
                {t.about.values.title}
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t.about.values.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={value.title} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm hover:scale-105 group">
                <CardContent className="p-6 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 text-white mb-4 hover:scale-110 transition-transform duration-200">
                    {React.createElement(value.icon, { className: "h-8 w-8" })}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-orange-600 transition-colors duration-200">
                    {value.title}
                  </h3>
                  <p className="text-gray-600">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Our Team */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              <span className="bg-gradient-to-r from-gray-900 via-orange-600 to-red-600 bg-clip-text text-transparent">
                {t.about.team.title}
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t.about.team.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <Card key={member.name} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm hover:scale-105 group">
                <CardContent className="p-6 text-center">
                  <div className="text-6xl mb-4">{member.image}</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors duration-200">
                    {member.name}
                  </h3>
                  <p className="text-orange-600 font-medium mb-3">
                    {member.role}
                  </p>
                  <p className="text-gray-600 text-sm">
                    {member.bio}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 bg-gradient-to-br from-orange-50 to-red-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              <span className="bg-gradient-to-r from-gray-900 via-orange-600 to-red-600 bg-clip-text text-transparent">
                {t.about.journey.title}
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t.about.journey.subtitle}
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              {milestones.map((milestone, index) => (
                <div key={milestone.year} className="flex items-start space-x-6 hover:scale-105 transition-transform duration-200">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white font-bold text-lg hover:scale-110 transition-transform duration-200">
                      {milestone.year}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {milestone.title}
                    </h3>
                    <p className="text-gray-600">
                      {milestone.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-orange-500 to-red-500 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              {t.about.cta.title}
            </h2>
            <p className="text-xl text-orange-100 mb-8">
              {t.about.cta.subtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="hover:scale-105 transition-transform duration-200">
                <Heart className="h-5 w-5 mr-2" />
                {t.about.cta.donateNow}
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-orange-600 hover:scale-105 transition-all duration-200">
                <Users className="h-5 w-5 mr-2" />
                {t.about.cta.volunteer}
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
    </AnimatedPage>
  )
}