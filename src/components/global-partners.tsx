'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Heart, Users, Globe, Shield, Award, Star } from 'lucide-react'
import React from 'react'

export function GlobalPartners() {
  const stats = [
    { icon: Heart, value: "0", label: "Spašenih života ovog meseca" },
    { icon: Users, value: "0", label: "Partner skloništa" },
    { icon: Globe, value: "1", label: "Zemlje" },
  ]

  const partners = [
    {
      name: "Uskoro - Prvi partner",
      location: "Beograd, Srbija",
      logo: "🏠",
      description: "Tražimo partnere za spašavanje pasa u Srbiji",
      impact: "Uskoro počinjemo",
      rating: 0
    }
  ]

  const features = [
    {
      icon: Shield,
      title: "Verifikovani partneri",
      description: "Svi partneri su temeljno proveravani i sertifikovani"
    },
    {
      icon: Award,
      title: "Dokazan uticaj",
      description: "Istorija uspešnih spašavanja i usvajanja"
    },
    {
      icon: Users,
      title: "Poverenje zajednice",
      description: "Visoko ocenjeni od strane lokalnih zajednica"
    }
  ]

  return (
    <section className="py-20 bg-gradient-to-br from-orange-50 via-white to-red-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-10 w-32 h-32 bg-orange-200/20 rounded-full blur-2xl animate-pulse" />
        <div className="absolute bottom-20 left-10 w-40 h-40 bg-red-200/20 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge className="mb-6 bg-gradient-to-r from-orange-100 to-red-100 text-orange-800 border-orange-200 hover:scale-105 transition-transform duration-200">
            <Globe className="h-4 w-4 mr-2" />
            Globalna mreža
          </Badge>
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold mb-6">
            <span className="bg-gradient-to-r from-gray-900 via-orange-600 to-red-600 bg-clip-text text-transparent">
              Pouzdani partneri
            </span>
            <br />
            <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
              Širom sveta
            </span>
          </h2>
          
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-200 max-w-3xl mx-auto leading-relaxed">
            Pridružite se našoj mreži verifikovanih organizacija za spašavanje i azila koji rade zajedno 
            da spašavaju pse i stvaraju srećne završetke širom sveta.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center hover:scale-105 transition-transform duration-200">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 text-white mb-4 hover:scale-110 transition-transform duration-200">
                <stat.icon className="h-8 w-8" />
              </div>
              <div className="text-3xl font-bold text-orange-600 mb-2">
                {stat.value}
              </div>
              <div className="text-gray-600 dark:text-gray-300 font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Partners Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {partners.map((partner) => (
            <Card key={partner.name} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm hover:scale-105 group">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="text-4xl">{partner.logo}</div>
                  <div className="flex items-center gap-1">
                    {partner.rating > 0 ? (
                      <>
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                        <span className="text-sm font-medium text-gray-600">{partner.rating}</span>
                      </>
                    ) : (
                      <span className="text-sm text-gray-500">Uskoro</span>
                    )}
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-orange-600 transition-colors duration-200">
                  {partner.name}
                </h3>
                
                <p className="text-orange-600 font-medium mb-3 flex items-center">
                  <Globe className="h-4 w-4 mr-1" />
                  {partner.location}
                </p>
                
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {partner.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    {partner.impact}
                  </Badge>
                  <Badge variant="outline" className="border-orange-200 text-orange-600">
                    Verifikovano
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {features.map((feature) => (
            <div key={feature.title} className="text-center hover:scale-105 transition-transform duration-200">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 text-white mb-4 hover:scale-110 transition-transform duration-200">
                <feature.icon className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-8 text-white relative overflow-hidden hover:scale-105 transition-transform duration-300">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-600/20 to-red-600/20" />
            <div className="relative z-10">
              <h3 className="text-2xl md:text-3xl font-bold mb-4">
                Pridružite se našoj globalnoj mreži
              </h3>
              <p className="text-orange-100 mb-6 max-w-2xl mx-auto">
                Postanite verifikovani partner i pomozite nam da zajedno spasimo više života. 
                Pridružite se hiljadama organizacija koje prave razliku širom sveta.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/contact">
                  <Button size="lg" variant="secondary" className="hover:scale-105 transition-transform duration-200">
                    <Users className="h-5 w-5 mr-2" />
                    Postanite partner
                  </Button>
                </Link>
                <Link href="/about">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-orange-600 hover:scale-105 transition-all duration-200">
                    Saznajte više
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