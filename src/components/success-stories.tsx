'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Heart, Star, Calendar, MapPin, ArrowRight, Play } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface SuccessStory {
  id: string
  dogName: string
  beforeImage: string
  afterImage: string
  rescueDate: string
  adoptionDate: string
  location: string
  age: string
  breed: string
  story: string
  medicalTreatment: string[]
  adopterName: string
  rating: number
  testimonial: string
  videoUrl?: string
}

const successStories: SuccessStory[] = [
  {
    id: '1',
    dogName: 'Luna',
    beforeImage: '/api/placeholder/400/400',
    afterImage: '/api/placeholder/400/400',
    rescueDate: '2023-08-15',
    adoptionDate: '2023-12-10',
    location: 'Austin, TX',
    age: '2 years',
    breed: 'Labrador Mix',
    story: 'Luna was found abandoned in a parking lot, severely malnourished and terrified of humans. Through months of patient care and rehabilitation, she transformed into a confident, loving companion.',
    medicalTreatment: ['Malnutrition Treatment', 'Behavioral Therapy', 'Vaccinations', 'Spay Surgery'],
    adopterName: 'Sarah & Mike Johnson',
    rating: 5,
    testimonial: 'Luna has brought so much joy to our family. She\'s the most loving dog we\'ve ever had, and we can\'t imagine life without her.',
    videoUrl: 'https://example.com/luna-story'
  },
  {
    id: '2',
    dogName: 'Max',
    beforeImage: '/api/placeholder/400/400',
    afterImage: '/api/placeholder/400/400',
    rescueDate: '2023-09-22',
    adoptionDate: '2024-01-15',
    location: 'Miami, FL',
    age: '5 years',
    breed: 'German Shepherd',
    story: 'Max was surrendered due to his owner\'s health issues. Despite being a senior dog, he proved that age is just a number and found his perfect retirement home.',
    medicalTreatment: ['Dental Cleaning', 'Arthritis Management', 'Senior Wellness Check'],
    adopterName: 'Robert Chen',
    rating: 5,
    testimonial: 'Max is such a gentleman. He\'s brought so much calm and wisdom to our home. Senior dogs have so much love to give.',
    videoUrl: 'https://example.com/max-story'
  },
  {
    id: '3',
    dogName: 'Bella',
    beforeImage: '/api/placeholder/400/400',
    afterImage: '/api/placeholder/400/400',
    rescueDate: '2023-07-03',
    adoptionDate: '2023-10-28',
    location: 'Seattle, WA',
    age: '1 year',
    breed: 'Beagle Mix',
    story: 'Bella was rescued from a hoarding situation with 20 other dogs. She was the shyest of the bunch but with time and love, she blossomed into a playful, confident pup.',
    medicalTreatment: ['Heartworm Treatment', 'Socialization Training', 'Spay Surgery'],
    adopterName: 'Emily Rodriguez',
    rating: 5,
    testimonial: 'Bella is my best friend. She\'s so smart and funny. I\'m so grateful to Doggzy for saving her and bringing us together.',
    videoUrl: 'https://example.com/bella-story'
  }
]

export function SuccessStories() {
  const [selectedStory, setSelectedStory] = useState<SuccessStory | null>(null)
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false)

  return (
    <section className="py-20 bg-gradient-to-br from-green-50 via-white to-blue-50 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-20 right-10 w-32 h-32 bg-green-200/30 rounded-full blur-3xl"
          animate={{
            x: [0, -100, 0],
            y: [0, 50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-20 left-10 w-40 h-40 bg-blue-200/20 rounded-full blur-3xl"
          animate={{
            x: [0, 80, 0],
            y: [0, -60, 0],
            scale: [1, 0.8, 1],
          }}
          transition={{
            duration: 10,
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
            className="inline-flex items-center gap-2 bg-gradient-to-r from-green-100 to-blue-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium mb-6"
          >
            <Heart className="h-4 w-4 fill-green-500 text-green-500" />
            Happy Endings
          </motion.div>
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold mb-6">
            <span className="bg-gradient-to-r from-gray-900 to-green-600 bg-clip-text text-transparent">
              Success Stories
            </span>
          </h2>
          
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Every rescue dog has a story. See how love, care, and compassion transform lives 
            and create beautiful happy endings.
          </p>
        </motion.div>

        {/* Stories Grid */}
        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {successStories.map((story, index) => (
            <motion.div
              key={story.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ 
                delay: index * 0.2, 
                duration: 0.6,
                type: "spring",
                stiffness: 100
              }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
              className="group cursor-pointer"
              onClick={() => setSelectedStory(story)}
            >
              <Card className="border-0 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden bg-white/90 backdrop-blur-sm">
                {/* Before/After Images */}
                <div className="relative h-64 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                    <div className="text-6xl">🐕</div>
                  </div>
                  
                  {/* Before Badge */}
                  <div className="absolute top-4 left-4">
                    <div className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                      Before
                    </div>
                  </div>

                  {/* After Badge */}
                  <div className="absolute top-4 right-4">
                    <div className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                      After
                    </div>
                  </div>

                  {/* Play Button */}
                  <motion.div
                    className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    whileHover={{ scale: 1.1 }}
                  >
                    <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center shadow-lg">
                      <Play className="h-6 w-6 text-green-500 ml-1" />
                    </div>
                  </motion.div>

                  {/* Story Badge */}
                  <div className="absolute bottom-4 left-4">
                    <div className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-gray-700">
                      Success Story
                    </div>
                  </div>
                </div>

                <CardContent className="p-6">
                  {/* Dog Info */}
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-1 group-hover:text-green-600 transition-colors">
                        {story.dogName}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>{story.age} old</span>
                        <span>•</span>
                        <span>{story.breed}</span>
                      </div>
                    </div>
                    <div className="flex items-center">
                      {[...Array(story.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </div>

                  {/* Location */}
                  <div className="flex items-center gap-2 mb-4 text-sm text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <span>{story.location}</span>
                  </div>

                  {/* Timeline */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <Calendar className="h-5 w-5 text-red-500 mx-auto mb-1" />
                      <div className="text-sm font-semibold text-gray-900">Rescued</div>
                      <div className="text-xs text-gray-600">
                        {new Date(story.rescueDate).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <Heart className="h-5 w-5 text-green-500 mx-auto mb-1" />
                      <div className="text-sm font-semibold text-gray-900">Adopted</div>
                      <div className="text-xs text-gray-600">
                        {new Date(story.adoptionDate).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  {/* Story Preview */}
                  <p className="text-gray-700 text-sm mb-4 line-clamp-3">
                    {story.story}
                  </p>

                  {/* Adopter */}
                  <div className="bg-green-50 rounded-lg p-4 mb-4">
                    <div className="text-sm font-medium text-green-800 mb-1">
                      Adopted by {story.adopterName}
                    </div>
                    <p className="text-sm text-green-700 italic">
                      "{story.testimonial}"
                    </p>
                  </div>

                  {/* Treatment Tags */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {story.medicalTreatment.slice(0, 3).map((treatment) => (
                      <span
                        key={treatment}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        {treatment}
                      </span>
                    ))}
                    {story.medicalTreatment.length > 3 && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        +{story.medicalTreatment.length - 3} more
                      </span>
                    )}
                  </div>

                  {/* View Story Button */}
                  <Button className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white group">
                    Read Full Story
                    <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-4 bg-gradient-to-r from-green-500 to-blue-500 text-white px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Heart className="h-6 w-6" />
            <span className="text-lg font-semibold">Help Create More Happy Endings</span>
            <motion.div
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              →
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* Story Detail Modal */}
      {selectedStory && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedStory(null)}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-8">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">
                    {selectedStory.dogName}'s Story
                  </h2>
                  <div className="flex items-center gap-4 text-gray-600">
                    <span>{selectedStory.age} • {selectedStory.breed}</span>
                    <span>•</span>
                    <span>{selectedStory.location}</span>
                  </div>
                </div>
                <Button
                  variant="outline"
                  onClick={() => setSelectedStory(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ×
                </Button>
              </div>

              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Before & After</h3>
                  <div className="space-y-4">
                    <div className="bg-gray-100 rounded-lg p-4">
                      <div className="text-sm font-medium text-gray-700 mb-2">Before Rescue</div>
                      <div className="text-4xl">🐕</div>
                    </div>
                    <div className="bg-green-100 rounded-lg p-4">
                      <div className="text-sm font-medium text-green-700 mb-2">After Recovery</div>
                      <div className="text-4xl">🐕</div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">Timeline</h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <div>
                        <div className="font-medium">Rescued</div>
                        <div className="text-sm text-gray-600">
                          {new Date(selectedStory.rescueDate).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <div>
                        <div className="font-medium">Adopted</div>
                        <div className="text-sm text-gray-600">
                          {new Date(selectedStory.adoptionDate).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3">The Story</h3>
                  <p className="text-gray-700 leading-relaxed">
                    {selectedStory.story}
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">Medical Treatment</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedStory.medicalTreatment.map((treatment) => (
                      <span
                        key={treatment}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                      >
                        {treatment}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">Adopter Testimonial</h3>
                  <div className="bg-green-50 rounded-lg p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <Heart className="h-5 w-5 text-green-500" />
                      <span className="font-medium text-green-800">
                        {selectedStory.adopterName}
                      </span>
                    </div>
                    <p className="text-green-700 italic">
                      "{selectedStory.testimonial}"
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </section>
  )
}
