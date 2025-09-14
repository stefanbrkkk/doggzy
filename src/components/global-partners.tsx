'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Heart, Users, Globe, Shield, Award, Star } from 'lucide-react'
import React from 'react'
import { useLanguage } from '@/contexts/LanguageContext'

export function GlobalPartners() {
  const { t } = useLanguage()
  
  const stats = [
    { icon: Heart, value: "2,847", label: t.partners.livesSavedThisMonth },
    { icon: Users, value: "156", label: t.partners.partnerShelters },
    { icon: Globe, value: "47", label: t.partners.countriesWorldwide },
  ]

  const partners = [
    {
      name: "Paws & Hearts Rescue",
      location: "Los Angeles, CA",
      logo: "🏠",
      description: "Leading rescue organization with 15+ years of experience",
      impact: "2,500+ dogs rescued",
      rating: 4.9
    },
    {
      name: "Second Chance Sanctuary",
      location: "Austin, TX", 
      logo: "❤️",
      description: "Specializing in senior and special needs dogs",
      impact: "1,200+ senior dogs helped",
      rating: 4.8
    },
    {
      name: "Hope for Paws",
      location: "Miami, FL",
      logo: "🌟",
      description: "Emergency rescue and medical care specialists",
      impact: "3,000+ emergency rescues",
      rating: 4.9
    },
    {
      name: "Furry Friends Foundation",
      location: "Seattle, WA",
      logo: "🐾",
      description: "Community-focused rescue and adoption center",
      impact: "1,800+ successful adoptions",
      rating: 4.7
    },
    {
      name: "Rescue Rangers",
      location: "Denver, CO",
      logo: "🚁",
      description: "Mountain rescue and wilderness dog recovery",
      impact: "500+ mountain rescues",
      rating: 4.8
    },
    {
      name: "Safe Haven Rescue",
      location: "Portland, OR",
      logo: "🏡",
      description: "Foster-based rescue with comprehensive care",
      impact: "2,200+ dogs fostered",
      rating: 4.9
    }
  ]

  const features = [
    {
      icon: Shield,
      title: t.partners.verifiedPartners,
      description: t.partners.verifiedPartnersDesc
    },
    {
      icon: Award,
      title: t.partners.provenImpact,
      description: t.partners.provenImpactDesc
    },
    {
      icon: Star,
      title: t.partners.communityTrust,
      description: t.partners.communityTrustDesc
    }
  ]

  return (
    <section className="py-20 bg-gradient-to-br from-orange-50 via-white to-red-50 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-10 w-32 h-32 bg-orange-200/20 rounded-full blur-2xl animate-pulse" />
        <div className="absolute bottom-20 left-10 w-40 h-40 bg-red-200/20 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-yellow-200/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-gradient-to-r from-orange-100 to-red-100 text-orange-800 border-orange-200 hover:scale-105 transition-transform duration-200">
            <Globe className="h-4 w-4 mr-2" />
            {t.partners.globalNetwork}
          </Badge>
          
          <h2 className="text-4xl sm:text-5xl font-display font-bold mb-6">
            <span className="bg-gradient-to-r from-gray-900 via-orange-600 to-red-600 bg-clip-text text-transparent">
              {t.partners.trustedPartners}
            </span>
            <br />
            <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
              {t.partners.worldwide}
            </span>
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            {t.partners.joinNetwork}
          </p>

          {/* Impact Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-2xl mx-auto">
            {stats.map((stat, index) => (
              <div key={stat.label} className="text-center hover:scale-105 transition-transform duration-200">
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
            ))}
          </div>
        </div>

        {/* Partners Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {partners.map((partner, index) => (
            <Card key={partner.name} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm hover:scale-105 group">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="text-4xl">{partner.logo}</div>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    <span className="text-sm font-medium text-gray-600">
                      {partner.rating}
                    </span>
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors duration-200">
                  {partner.name}
                </h3>
                
                <p className="text-sm text-gray-500 mb-3">
                  {partner.location}
                </p>
                
                <p className="text-gray-600 mb-4">
                  {partner.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-orange-600">
                    {partner.impact}
                  </span>
                  <Badge variant="secondary" className="bg-orange-100 text-orange-800 hover:scale-105 transition-transform duration-200">
                    {t.partners.verified}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {features.map((feature, index) => (
            <div key={feature.title} className="text-center hover:scale-105 transition-transform duration-200">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 text-white mb-4 hover:scale-110 transition-transform duration-200">
                {React.createElement(feature.icon, { className: "h-8 w-8" })}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-3xl p-8 md:p-12 text-white relative overflow-hidden hover:scale-105 transition-transform duration-300">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-600/20 to-red-600/20" />
            <div className="relative z-10">
              <h3 className="text-3xl md:text-4xl font-bold mb-4">
                {t.partners.joinGlobalNetwork}
              </h3>
              <p className="text-xl text-orange-100 mb-8 max-w-2xl mx-auto">
                {t.partners.becomePartner}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/partners">
                  <Button size="lg" variant="secondary" className="hover:scale-105 transition-transform duration-200">
                    <Globe className="h-5 w-5 mr-2" />
                    {t.partners.viewAllPartners}
                  </Button>
                </Link>
                <Link href="/partners">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-orange-600 hover:scale-105 transition-all duration-200">
                    <Heart className="h-5 w-5 mr-2" />
                    {t.partners.becomeAPartner}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}