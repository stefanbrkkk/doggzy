'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
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
  TrendingUp,
  Calendar,
  MapPin
} from 'lucide-react'
import React from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import { AnimatedPage } from '@/components/animated-page'

export default function ImpactPage() {
  const { t } = useLanguage()
  
  const globalStats = [
    { icon: Heart, value: "15,000+", label: t.impact.globalStats.livesSaved, change: "+2,500 this year" },
    { icon: Users, value: "500+", label: t.impact.globalStats.partnerShelters, change: "+50 new partners" },
    { icon: Globe, value: "47", label: t.impact.globalStats.countries, change: "+12 new countries" },
    { icon: Award, value: "98%", label: t.impact.globalStats.successRate, change: "Maintained 98%" },
  ]

  const monthlyImpact = [
    { month: "January", rescues: 1200, adoptions: 1100, medical: 800 },
    { month: "February", rescues: 1350, adoptions: 1250, medical: 950 },
    { month: "March", rescues: 1500, adoptions: 1400, medical: 1100 },
    { month: "April", rescues: 1650, adoptions: 1550, medical: 1200 },
    { month: "May", rescues: 1800, adoptions: 1700, medical: 1350 },
    { month: "June", rescues: 2000, adoptions: 1900, medical: 1500 },
  ]

  const topRegions = [
    { region: "North America", rescues: 8500, percentage: 57 },
    { region: "Europe", rescues: 3200, percentage: 21 },
    { region: "Asia", rescues: 1800, percentage: 12 },
    { region: "South America", rescues: 1000, percentage: 7 },
    { region: "Africa", rescues: 500, percentage: 3 },
  ]

  const successStories = [
    {
      name: "Bella",
      location: "Los Angeles, CA",
      story: "Rescued from a hoarding situation with 20 other dogs. After 6 months of rehabilitation, she was adopted by a loving family and now works as a therapy dog.",
      impact: "Now helps 50+ children weekly",
      image: "🐕"
    },
    {
      name: "Max",
      location: "Austin, TX",
      story: "Found abandoned with severe injuries. Our medical team performed life-saving surgery, and he was adopted by a search and rescue team.",
      impact: "Has helped find 12 missing persons",
      image: "🐕‍🦺"
    },
    {
      name: "Luna",
      location: "Seattle, WA",
      story: "Senior dog surrendered due to owner's health issues. We found her a perfect retirement home with a senior couple.",
      impact: "Bringing joy to elderly community",
      image: "🐕"
    }
  ]

  const goals = [
    {
      title: "Rescue 20,000 Dogs",
      current: 15000,
      target: 20000,
      description: "Our goal to rescue 20,000 dogs by end of 2024"
    },
    {
      title: "Expand to 60 Countries",
      current: 47,
      target: 60,
      description: "Growing our global network to reach more dogs in need"
    },
    {
      title: "500 Partner Shelters",
      current: 500,
      target: 500,
      description: "Maintaining our network of verified partner organizations"
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
              <TrendingUp className="h-4 w-4 mr-2" />
              {t.impact.hero.badge}
            </Badge>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold mb-6">
              <span className="bg-gradient-to-r from-gray-900 via-orange-600 to-red-600 bg-clip-text text-transparent">
                {t.impact.hero.title}
              </span>
              <br />
              <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                {t.impact.hero.titleHighlight}
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              {t.impact.hero.subtitle}
            </p>
          </div>
        </div>
      </section>

      {/* Global Stats */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              <span className="bg-gradient-to-r from-gray-900 via-orange-600 to-red-600 bg-clip-text text-transparent">
                {t.impact.globalImpact.title}
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t.impact.globalImpact.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {globalStats.map((stat, index) => (
              <Card key={stat.label} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm hover:scale-105 group">
                <CardContent className="p-6 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 text-white mb-4 hover:scale-110 transition-transform duration-200">
                    {React.createElement(stat.icon, { className: "h-8 w-8" })}
                  </div>
                  <div className="text-3xl font-bold text-orange-600 mb-2">
                    {stat.value}
                  </div>
                  <div className="text-gray-600 font-medium mb-2">
                    {stat.label}
                  </div>
                  <div className="text-sm text-green-600 font-medium">
                    {stat.change}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Monthly Progress */}
      <section className="py-20 bg-gradient-to-br from-orange-50 to-red-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              <span className="bg-gradient-to-r from-gray-900 via-orange-600 to-red-600 bg-clip-text text-transparent">
                {t.impact.monthlyProgress.title}
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t.impact.monthlyProgress.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Chart Area */}
            <div className="space-y-6">
              {monthlyImpact.map((month, index) => (
                <Card key={month.month} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm hover:scale-105">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-bold text-gray-900">{month.month}</h3>
                      <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                        {month.rescues} total rescues
                      </Badge>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Adoptions</span>
                          <span>{month.adoptions}</span>
                        </div>
                        <Progress value={(month.adoptions / month.rescues) * 100} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Medical Care</span>
                          <span>{month.medical}</span>
                        </div>
                        <Progress value={(month.medical / month.rescues) * 100} className="h-2" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Regional Breakdown */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-8">{t.impact.regionalImpact.title}</h3>
              <div className="space-y-6">
                {topRegions.map((region, index) => (
                  <Card key={region.region} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm hover:scale-105">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <MapPin className="h-5 w-5 text-orange-500" />
                          <span className="font-medium text-gray-900">{region.region}</span>
                        </div>
                        <span className="text-2xl font-bold text-orange-600">{region.rescues.toLocaleString()}</span>
                      </div>
                      <Progress value={region.percentage} className="h-3" />
                      <div className="text-sm text-gray-600 mt-2">
                        {region.percentage}% of total rescues
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              <span className="bg-gradient-to-r from-gray-900 via-orange-600 to-red-600 bg-clip-text text-transparent">
                {t.impact.successStories.title}
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t.impact.successStories.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {successStories.map((story, index) => (
              <Card key={story.name} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm hover:scale-105 group">
                <CardContent className="p-6 text-center">
                  <div className="text-6xl mb-4">{story.image}</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors duration-200">
                    {story.name}
                  </h3>
                  <p className="text-sm text-gray-500 mb-4">
                    {story.location}
                  </p>
                  <p className="text-gray-600 mb-4 text-sm">
                    {story.story}
                  </p>
                  <Badge variant="secondary" className="bg-green-100 text-green-800 hover:scale-105 transition-transform duration-200">
                    {story.impact}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Goals & Progress */}
      <section className="py-20 bg-gradient-to-br from-orange-50 to-red-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              <span className="bg-gradient-to-r from-gray-900 via-orange-600 to-red-600 bg-clip-text text-transparent">
                {t.impact.goals.title}
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t.impact.goals.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {goals.map((goal, index) => (
              <Card key={goal.title} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm hover:scale-105">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    {goal.title}
                  </h3>
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span>Progress</span>
                      <span>{goal.current.toLocaleString()} / {goal.target.toLocaleString()}</span>
                    </div>
                    <Progress value={(goal.current / goal.target) * 100} className="h-3" />
                  </div>
                  <p className="text-gray-600 text-sm">
                    {goal.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-orange-500 to-red-500 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              {t.impact.cta.title}
            </h2>
            <p className="text-xl text-orange-100 mb-8">
              {t.impact.cta.subtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="hover:scale-105 transition-transform duration-200">
                <Heart className="h-5 w-5 mr-2" />
                {t.impact.cta.donateNow}
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-orange-600 hover:scale-105 transition-all duration-200">
                <ArrowRight className="h-5 w-5 mr-2" />
                {t.impact.cta.shopForCause}
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
    </AnimatedPage>
  )
}