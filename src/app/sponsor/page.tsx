'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Heart, Filter, Search, MapPin, Calendar, Users, DollarSign, Camera, MessageCircle } from 'lucide-react'
import { PetCard } from '@/components/sponsor/pet-card'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

// Mock pet data
const pets = [
  {
    id: '1',
    name: 'Buddy',
    age: '3 years',
    breed: 'Golden Retriever Mix',
    location: 'Los Angeles, CA',
    rescueDate: '2024-01-15',
    targetAmount: 2500,
    raisedAmount: 1850,
    sponsorCount: 23,
    image: '/api/placeholder/400/400',
    status: 'urgent' as const,
    description: 'Buddy was found abandoned with severe malnutrition and needs urgent medical care. He\'s a gentle soul who loves people and other dogs.',
    medicalNeeds: ['Surgery', 'Physical Therapy', 'Special Diet'],
    personality: ['Friendly', 'Gentle', 'Playful'],
    progress: 74,
    daysInCare: 45,
    lastUpdate: '2 days ago',
    updates: [
      {
        date: '2024-01-20',
        title: 'Surgery Scheduled',
        description: 'Buddy\'s surgery has been scheduled for next week. We\'re 74% to our goal!',
        image: '/api/placeholder/300/200'
      }
    ]
  },
  {
    id: '2',
    name: 'Luna',
    age: '5 months',
    breed: 'Labrador Mix',
    location: 'Austin, TX',
    rescueDate: '2024-01-10',
    targetAmount: 1800,
    raisedAmount: 1200,
    sponsorCount: 18,
    image: '/api/placeholder/400/400',
    status: 'recovering' as const,
    description: 'Luna is a sweet puppy who was rescued from a hoarding situation. She\'s learning to trust humans again and needs ongoing care.',
    medicalNeeds: ['Vaccinations', 'Deworming', 'Behavioral Training'],
    personality: ['Shy', 'Sweet', 'Curious'],
    progress: 67,
    daysInCare: 38,
    lastUpdate: '1 day ago',
    updates: [
      {
        date: '2024-01-22',
        title: 'Great Progress!',
        description: 'Luna is making wonderful progress with her socialization. She now approaches volunteers willingly!',
        image: '/api/placeholder/300/200'
      }
    ]
  },
  {
    id: '3',
    name: 'Max',
    age: '7 years',
    breed: 'German Shepherd',
    location: 'Miami, FL',
    rescueDate: '2023-12-20',
    targetAmount: 3000,
    raisedAmount: 2950,
    sponsorCount: 45,
    image: '/api/placeholder/400/400',
    status: 'ready' as const,
    description: 'Max is a senior dog who was surrendered due to his owner\'s health issues. He\'s healthy and ready for his forever home.',
    medicalNeeds: ['Dental Cleaning'],
    personality: ['Calm', 'Loyal', 'Well-trained'],
    progress: 98,
    daysInCare: 55,
    lastUpdate: '3 hours ago',
    updates: [
      {
        date: '2024-01-23',
        title: 'Almost Ready!',
        description: 'Max is nearly ready for adoption! Just need to complete his dental cleaning.',
        image: '/api/placeholder/300/200'
      }
    ]
  },
  {
    id: '4',
    name: 'Bella',
    age: '2 years',
    breed: 'Beagle Mix',
    location: 'Seattle, WA',
    rescueDate: '2024-01-05',
    targetAmount: 2200,
    raisedAmount: 2200,
    sponsorCount: 32,
    image: '/api/placeholder/400/400',
    status: 'adopted' as const,
    description: 'Bella was found as a stray and needed treatment for heartworm. She\'s now healthy and has found her forever home!',
    medicalNeeds: [],
    personality: ['Energetic', 'Affectionate', 'Smart'],
    progress: 100,
    daysInCare: 60,
    lastUpdate: '1 week ago',
    updates: [
      {
        date: '2024-01-16',
        title: 'Adopted! 🎉',
        description: 'Bella has found her forever home with the Johnson family! Thank you to all her sponsors.',
        image: '/api/placeholder/300/200'
      }
    ]
  },
  {
    id: '5',
    name: 'Rocky',
    age: '4 years',
    breed: 'Pit Bull Mix',
    location: 'Denver, CO',
    rescueDate: '2024-01-18',
    targetAmount: 3500,
    raisedAmount: 890,
    sponsorCount: 12,
    image: '/api/placeholder/400/400',
    status: 'urgent' as const,
    description: 'Rocky was hit by a car and needs extensive surgery. He\'s a fighter with a big heart who deserves a second chance.',
    medicalNeeds: ['Emergency Surgery', 'Physical Therapy', 'Pain Management'],
    personality: ['Brave', 'Loving', 'Strong'],
    progress: 25,
    daysInCare: 12,
    lastUpdate: '5 hours ago',
    updates: [
      {
        date: '2024-01-23',
        title: 'Surgery Complete',
        description: 'Rocky\'s emergency surgery was successful! Now he needs help with recovery and physical therapy.',
        image: '/api/placeholder/300/200'
      }
    ]
  },
  {
    id: '6',
    name: 'Coco',
    age: '1 year',
    breed: 'Chihuahua Mix',
    location: 'Portland, OR',
    rescueDate: '2024-01-12',
    targetAmount: 1500,
    raisedAmount: 1125,
    sponsorCount: 15,
    image: '/api/placeholder/400/400',
    status: 'recovering' as const,
    description: 'Coco is a tiny dog with a big personality. She was rescued from a puppy mill and is learning what it means to be loved.',
    medicalNeeds: ['Spay Surgery', 'Dental Work'],
    personality: ['Feisty', 'Affectionate', 'Playful'],
    progress: 75,
    daysInCare: 28,
    lastUpdate: '1 day ago',
    updates: [
      {
        date: '2024-01-22',
        title: 'Growing Stronger',
        description: 'Coco is gaining weight and confidence! She loves playing with the other small dogs.',
        image: '/api/placeholder/300/200'
      }
    ]
  }
]

const statusOptions = ['All', 'Urgent', 'Recovering', 'Ready', 'Adopted']
const sortOptions = [
  { value: 'urgent', label: 'Most Urgent First' },
  { value: 'progress', label: 'Lowest Progress' },
  { value: 'newest', label: 'Recently Rescued' },
  { value: 'sponsors', label: 'Most Sponsored' },
  { value: 'amount', label: 'Highest Goal' }
]

export default function SponsorPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('All')
  const [sortBy, setSortBy] = useState('urgent')

  const filteredAndSortedPets = useMemo(() => {
    let filtered = pets

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(pet =>
        pet.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pet.breed.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pet.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pet.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Filter by status
    if (selectedStatus !== 'All') {
      const statusMap = {
        'Urgent': 'urgent',
        'Recovering': 'recovering',
        'Ready': 'ready',
        'Adopted': 'adopted'
      }
      filtered = filtered.filter(pet => pet.status === statusMap[selectedStatus as keyof typeof statusMap])
    }

    // Sort pets
    switch (sortBy) {
      case 'progress':
        filtered.sort((a, b) => a.progress - b.progress)
        break
      case 'newest':
        filtered.sort((a, b) => new Date(b.rescueDate).getTime() - new Date(a.rescueDate).getTime())
        break
      case 'sponsors':
        filtered.sort((a, b) => b.sponsorCount - a.sponsorCount)
        break
      case 'amount':
        filtered.sort((a, b) => b.targetAmount - a.targetAmount)
        break
      default: // urgent
        const urgencyOrder = { urgent: 0, recovering: 1, ready: 2, adopted: 3 }
        filtered.sort((a, b) => urgencyOrder[a.status] - urgencyOrder[b.status])
    }

    return filtered
  }, [searchQuery, selectedStatus, sortBy])

  const handleSponsor = (pet: typeof pets[0]) => {
    console.log(`Sponsoring ${pet.name}`)
    // Redirect to donation form with pet pre-selected
  }

  const handleViewDetails = (pet: typeof pets[0]) => {
    console.log(`Viewing details for ${pet.name}`)
    // Open pet detail modal or navigate to pet page
  }

  const totalRaised = pets.reduce((sum, pet) => sum + pet.raisedAmount, 0)
  const totalGoal = pets.reduce((sum, pet) => sum + pet.targetAmount, 0)
  const totalSponsors = pets.reduce((sum, pet) => sum + pet.sponsorCount, 0)
  const urgentPets = pets.filter(pet => pet.status === 'urgent').length

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
      {/* Header */}
      <section className="relative py-20 overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-100 to-red-100 text-orange-800 px-4 py-2 rounded-full text-sm font-medium mb-6"
            >
              <Heart className="h-4 w-4 fill-orange-500 text-orange-500" />
              Sponsor a Rescue Dog
            </motion.div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold leading-tight mb-6">
              <span className="bg-gradient-to-r from-gray-900 via-orange-600 to-red-600 bg-clip-text text-transparent">
                Change a Life
              </span>
              <br />
              <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                Sponsor a Dog
              </span>
            </h1>
            
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
              Every dog deserves a second chance. Sponsor a rescue dog and follow their journey 
              from rescue to recovery to their forever home.
            </p>
          </motion.div>

          {/* Stats */}
          <div className="grid md:grid-cols-4 gap-8 mb-16">
            {[
              {
                icon: DollarSign,
                value: `$${totalRaised.toLocaleString()}`,
                label: 'Total Raised',
                color: 'from-green-500 to-emerald-500'
              },
              {
                icon: Heart,
                value: totalSponsors.toString(),
                label: 'Active Sponsors',
                color: 'from-red-500 to-pink-500'
              },
              {
                icon: Users,
                value: pets.length.toString(),
                label: 'Dogs in Care',
                color: 'from-blue-500 to-cyan-500'
              },
              {
                icon: Calendar,
                value: urgentPets.toString(),
                label: 'Urgent Cases',
                color: 'from-orange-500 to-red-500'
              }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1, duration: 0.6 }}
                whileHover={{ y: -5 }}
              >
                <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm">
                  <CardContent className="p-6 text-center">
                    <motion.div
                      className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${stat.color} text-white mb-4`}
                      whileHover={{ rotate: 360, scale: 1.1 }}
                      transition={{ duration: 0.6 }}
                    >
                      <stat.icon className="h-8 w-8" />
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
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 bg-white/50 backdrop-blur-sm sticky top-20 z-40 border-b border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Search dogs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-3 rounded-xl border-gray-200 focus:border-orange-500 focus:ring-orange-500"
              />
            </div>

            {/* Status Filter */}
            <div className="flex gap-2 flex-wrap">
              {statusOptions.map((status) => (
                <Button
                  key={status}
                  variant={selectedStatus === status ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedStatus(status)}
                  className={selectedStatus === status ? "bg-orange-500 hover:bg-orange-600" : ""}
                >
                  {status}
                </Button>
              ))}
            </div>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-orange-500 bg-white"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* Dogs Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Results Count */}
          <div className="flex items-center justify-between mb-8">
            <p className="text-gray-600">
              Showing {filteredAndSortedPets.length} of {pets.length} dogs
            </p>
            <div className="text-sm text-gray-600">
              Total goal: <span className="font-semibold text-orange-600">
                ${totalGoal.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Dogs */}
          {filteredAndSortedPets.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredAndSortedPets.map((pet, index) => (
                <motion.div
                  key={pet.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                >
                  <PetCard
                    pet={pet}
                    onSponsor={handleSponsor}
                    onViewDetails={handleViewDetails}
                  />
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">No dogs found</h3>
              <p className="text-gray-600 mb-6">
                Try adjusting your search or filter criteria
              </p>
              <Button
                onClick={() => {
                  setSearchQuery('')
                  setSelectedStatus('All')
                  setSortBy('urgent')
                }}
                className="bg-orange-500 hover:bg-orange-600"
              >
                Clear Filters
              </Button>
            </motion.div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-orange-500 to-red-500 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-display font-bold mb-6">
              Can't Choose? Sponsor Multiple Dogs!
            </h2>
            <p className="text-xl mb-8 max-w-3xl mx-auto opacity-90">
              Many of our rescue dogs need ongoing support. You can sponsor multiple dogs 
              or set up recurring donations to help even more lives.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button className="bg-white text-orange-500 px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-100 transition-colors duration-300 shadow-lg">
                  <Heart className="h-5 w-5 mr-2" />
                  Sponsor Multiple Dogs
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button variant="outline" className="border-white text-white hover:bg-white hover:text-orange-500 px-8 py-4 rounded-full text-lg font-semibold transition-colors duration-300">
                  <Users className="h-5 w-5 mr-2" />
                  Learn About Sponsorship
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

