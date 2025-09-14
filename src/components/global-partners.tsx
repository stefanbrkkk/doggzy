'use client'

import React, { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { MapPin, Users, Heart, Globe, ArrowRight, Star, Phone, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface Partner {
  id: string
  name: string
  location: string
  country: string
  coordinates: [number, number]
  dogsRescued: number
  rating: number
  established: string
  specialties: string[]
  contact: {
    phone?: string
    email?: string
    website?: string
  }
  description: string
  image: string
}

const partners: Partner[] = [
  {
    id: '1',
    name: 'Los Angeles Rescue Center',
    location: 'Los Angeles, CA',
    country: 'United States',
    coordinates: [-118.2437, 34.0522],
    dogsRescued: 1247,
    rating: 4.9,
    established: '2018',
    specialties: ['Emergency Rescue', 'Senior Dogs', 'Special Needs'],
    contact: {
      phone: '+1 (555) 123-4567',
      email: 'info@larescue.org',
      website: 'larescue.org'
    },
    description: 'Leading rescue organization specializing in emergency situations and senior dog care.',
    image: '/api/placeholder/300/200'
  },
  {
    id: '2',
    name: 'Austin Paws & Hearts',
    location: 'Austin, TX',
    country: 'United States',
    coordinates: [-97.7431, 30.2672],
    dogsRescued: 892,
    rating: 4.8,
    established: '2019',
    specialties: ['Puppy Mills', 'Behavioral Rehabilitation', 'Adoption Services'],
    contact: {
      phone: '+1 (555) 987-6543',
      email: 'contact@austinpaws.org',
      website: 'austinpaws.org'
    },
    description: 'Comprehensive rescue services with focus on behavioral rehabilitation and adoption.',
    image: '/api/placeholder/300/200'
  },
  {
    id: '3',
    name: 'Miami Coastal Rescue',
    location: 'Miami, FL',
    country: 'United States',
    coordinates: [-80.1918, 25.7617],
    dogsRescued: 1563,
    rating: 4.9,
    established: '2017',
    specialties: ['Hurricane Relief', 'Coastal Rescue', 'Large Dogs'],
    contact: {
      phone: '+1 (555) 456-7890',
      email: 'rescue@miamicoastal.org',
      website: 'miamicoastal.org'
    },
    description: 'Specialized in hurricane relief and coastal rescue operations.',
    image: '/api/placeholder/300/200'
  },
  {
    id: '4',
    name: 'Seattle Rainy Day Rescue',
    location: 'Seattle, WA',
    country: 'United States',
    coordinates: [-122.3321, 47.6062],
    dogsRescued: 734,
    rating: 4.7,
    established: '2020',
    specialties: ['Small Dogs', 'Indoor Rehabilitation', 'Senior Care'],
    contact: {
      phone: '+1 (555) 321-9876',
      email: 'hello@seattlerainyday.org',
      website: 'seattlerainyday.org'
    },
    description: 'Focus on small dogs and indoor rehabilitation programs.',
    image: '/api/placeholder/300/200'
  },
  {
    id: '5',
    name: 'Toronto Canine Sanctuary',
    location: 'Toronto, ON',
    country: 'Canada',
    coordinates: [-79.3832, 43.6532],
    dogsRescued: 1123,
    rating: 4.8,
    established: '2016',
    specialties: ['International Rescue', 'Medical Care', 'Training Programs'],
    contact: {
      phone: '+1 (416) 555-0123',
      email: 'info@torontosanctuary.ca',
      website: 'torontosanctuary.ca'
    },
    description: 'International rescue operations with comprehensive medical care.',
    image: '/api/placeholder/300/200'
  },
  {
    id: '6',
    name: 'London Bridge Rescue',
    location: 'London, UK',
    country: 'United Kingdom',
    coordinates: [-0.1276, 51.5074],
    dogsRescued: 987,
    rating: 4.6,
    established: '2019',
    specialties: ['Urban Rescue', 'Behavioral Issues', 'Rehoming Services'],
    contact: {
      phone: '+44 20 7123 4567',
      email: 'contact@londonbridge.org.uk',
      website: 'londonbridge.org.uk'
    },
    description: 'Urban rescue specialist with focus on behavioral rehabilitation.',
    image: '/api/placeholder/300/200'
  },
  {
    id: '7',
    name: 'Sydney Harbour Rescue',
    location: 'Sydney, NSW',
    country: 'Australia',
    coordinates: [151.2093, -33.8688],
    dogsRescued: 1456,
    rating: 4.9,
    established: '2018',
    specialties: ['Wildlife Integration', 'Beach Rescue', 'Large Scale Operations'],
    contact: {
      phone: '+61 2 9123 4567',
      email: 'rescue@sydneyharbour.org.au',
      website: 'sydneyharbour.org.au'
    },
    description: 'Large-scale rescue operations with wildlife integration programs.',
    image: '/api/placeholder/300/200'
  },
  {
    id: '8',
    name: 'Tokyo Urban Rescue',
    location: 'Tokyo, Japan',
    country: 'Japan',
    coordinates: [139.6917, 35.6895],
    dogsRescued: 623,
    rating: 4.7,
    established: '2021',
    specialties: ['Urban Environments', 'Cultural Integration', 'Small Dogs'],
    contact: {
      phone: '+81 3-1234-5678',
      email: 'info@tokyorescue.jp',
      website: 'tokyorescue.jp'
    },
    description: 'Urban rescue specialist adapting to Japanese culture and urban environments.',
    image: '/api/placeholder/300/200'
  }
]

export function GlobalPartners() {
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null)
  const [hoveredPartner, setHoveredPartner] = useState<string | null>(null)
  const mapRef = useRef<HTMLDivElement>(null)

  const totalDogsRescued = partners.reduce((sum, partner) => sum + partner.dogsRescued, 0)
  const totalPartners = partners.length
  const countries = [...new Set(partners.map(p => p.country))].length

  return (
    <section className="py-20 bg-gradient-to-br from-blue-50 via-white to-indigo-50 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-20 left-10 w-32 h-32 bg-blue-200/30 rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-40 h-40 bg-indigo-200/20 rounded-full blur-3xl"
          animate={{
            x: [0, -80, 0],
            y: [0, 60, 0],
            scale: [1, 0.8, 1],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 3,
          }}
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-6"
          >
            <Globe className="h-4 w-4 fill-blue-500 text-blue-500" />
            Global Network
          </motion.div>
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold mb-6">
            <span className="bg-gradient-to-r from-gray-900 to-blue-600 bg-clip-text text-transparent">
              Our Global
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent">
              Partner Network
            </span>
          </h2>
          
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Working with {totalPartners} trusted rescue partners across {countries} countries to save dogs worldwide. 
            Together, we've rescued over {totalDogsRescued.toLocaleString()} dogs and counting.
          </p>
        </motion.div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {[
            {
              icon: Users,
              value: totalPartners.toString(),
              label: 'Partner Organizations',
              color: 'from-blue-500 to-cyan-500'
            },
            {
              icon: Globe,
              value: countries.toString(),
              label: 'Countries',
              color: 'from-indigo-500 to-purple-500'
            },
            {
              icon: Heart,
              value: totalDogsRescued.toLocaleString(),
              label: 'Dogs Rescued',
              color: 'from-green-500 to-emerald-500'
            }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1, duration: 0.6 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
            >
              <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm">
                <CardContent className="p-6 text-center">
                  <motion.div
                    className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${stat.color} text-white mb-4`}
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                  >
                    {React.createElement(stat.icon, { className: "h-8 w-8" })}
                  </motion.div>
                  <div className="text-3xl font-bold text-gray-900 mb-2">
                    {stat.value}
                  </div>
                  <div className="text-gray-600">
                    {stat.label}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Map and Partners */}
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Interactive Map */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative"
          >
            <Card className="border-0 shadow-xl bg-gradient-to-br from-blue-50 to-indigo-50 overflow-hidden">
              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                  Partner Locations
                </h3>
                
                {/* Simplified Map */}
                <div 
                  ref={mapRef}
                  className="relative h-96 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl overflow-hidden"
                >
                  {/* Map Background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-200/50 to-indigo-200/50">
                    <div className="absolute inset-0 opacity-20">
                      {/* Simplified world map pattern */}
                      <div className="grid grid-cols-8 grid-rows-4 h-full">
                        {[...Array(32)].map((_, i) => (
                          <motion.div
                            key={i}
                            className="border border-blue-300/30"
                            animate={{
                              opacity: [0.3, 0.6, 0.3],
                            }}
                            transition={{
                              duration: 3,
                              repeat: Infinity,
                              delay: i * 0.1,
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Partner Markers */}
                  {partners.map((partner, index) => {
                    // Simplified positioning for demo
                    const x = 20 + (index % 4) * 20
                    const y = 20 + Math.floor(index / 4) * 20
                    
                    return (
                      <motion.div
                        key={partner.id}
                        className="absolute"
                        style={{
                          left: `${x}%`,
                          top: `${y}%`,
                          transform: 'translate(-50%, -50%)'
                        }}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: index * 0.1, duration: 0.5 }}
                        whileHover={{ scale: 1.2 }}
                        onHoverStart={() => setHoveredPartner(partner.id)}
                        onHoverEnd={() => setHoveredPartner(null)}
                        onClick={() => setSelectedPartner(partner)}
                      >
                        <motion.div
                          className={cn(
                            "w-6 h-6 rounded-full border-2 border-white shadow-lg cursor-pointer",
                            hoveredPartner === partner.id || selectedPartner?.id === partner.id
                              ? "bg-red-500 scale-125"
                              : "bg-orange-500"
                          )}
                          animate={{
                            boxShadow: [
                              "0 0 0 0 rgba(249, 115, 22, 0.7)",
                              "0 0 0 10px rgba(249, 115, 22, 0)",
                              "0 0 0 0 rgba(249, 115, 22, 0)"
                            ]
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            delay: index * 0.2
                          }}
                        >
                          <div className="w-full h-full rounded-full bg-white/20 flex items-center justify-center">
                            <Heart className="h-3 w-3 text-white fill-white" />
                          </div>
                        </motion.div>
                      </motion.div>
                    )
                  })}
                </div>

                {/* Map Legend */}
                <div className="mt-6 flex items-center justify-center gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
                    <span className="text-gray-600">Partner Location</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                    <span className="text-gray-600">Selected</span>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Partners List */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            {partners.slice(0, 6).map((partner, index) => (
              <motion.div
                key={partner.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                whileHover={{ x: 10 }}
                className="cursor-pointer"
                onClick={() => setSelectedPartner(partner)}
              >
                <Card className={cn(
                  "border-0 shadow-md hover:shadow-lg transition-all duration-300 bg-white/90 backdrop-blur-sm",
                  selectedPartner?.id === partner.id && "ring-2 ring-blue-500 shadow-xl"
                )}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold text-gray-900">
                            {partner.name}
                          </h4>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm text-gray-600">
                              {partner.rating}
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            <span>{partner.location}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Heart className="h-4 w-4" />
                            <span>{partner.dogsRescued} saved</span>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-1 mb-2">
                          {partner.specialties.slice(0, 2).map((specialty) => (
                            <span
                              key={specialty}
                              className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                            >
                              {specialty}
                            </span>
                          ))}
                        </div>

                        <p className="text-sm text-gray-700 line-clamp-2">
                          {partner.description}
                        </p>
                      </div>
                      
                      <motion.div
                        className="ml-4"
                        whileHover={{ scale: 1.1 }}
                      >
                        <ArrowRight className="h-5 w-5 text-gray-400" />
                      </motion.div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              viewport={{ once: true }}
            >
              <Link href="/partners">
                <Button className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white">
                  View All Partners
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <Link href="/partners">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-4 bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
            >
              <Globe className="h-6 w-6" />
              <span className="text-lg font-semibold">Join Our Global Network</span>
              <motion.div
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                →
              </motion.div>
            </motion.div>
          </Link>
        </motion.div>
      </div>

      {/* Partner Detail Modal */}
      {selectedPartner && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedPartner(null)}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-8">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {selectedPartner.name}
                  </h2>
                  <div className="flex items-center gap-4 text-gray-600">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>{selectedPartner.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span>{selectedPartner.rating}</span>
                    </div>
                  </div>
                </div>
                <Button
                  variant="outline"
                  onClick={() => setSelectedPartner(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ×
                </Button>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="font-semibold mb-3">Statistics</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Dogs Rescued:</span>
                      <span className="font-semibold">{selectedPartner.dogsRescued.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Established:</span>
                      <span className="font-semibold">{selectedPartner.established}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Rating:</span>
                      <span className="font-semibold">{selectedPartner.rating}/5</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Contact</h3>
                  <div className="space-y-2">
                    {selectedPartner.contact.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-gray-500" />
                        <span className="text-sm">{selectedPartner.contact.phone}</span>
                      </div>
                    )}
                    {selectedPartner.contact.email && (
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-gray-500" />
                        <span className="text-sm">{selectedPartner.contact.email}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-3">Specialties</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedPartner.specialties.map((specialty) => (
                      <span
                        key={specialty}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">About</h3>
                  <p className="text-gray-700">
                    {selectedPartner.description}
                  </p>
                </div>
              </div>

              <div className="mt-6 flex gap-4">
                <Button className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600">
                  Contact Partner
                </Button>
                <Button variant="outline" className="flex-1">
                  View Website
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </section>
  )
}
