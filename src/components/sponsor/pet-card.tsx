'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Heart, MapPin, Calendar, Users, DollarSign, Camera, MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

export interface Pet {
  id: string
  name: string
  age: string
  breed: string
  location: string
  rescueDate: string
  targetAmount: number
  raisedAmount: number
  sponsorCount: number
  image: string
  status: 'urgent' | 'recovering' | 'ready' | 'adopted'
  description: string
  medicalNeeds: string[]
  personality: string[]
  progress: number
  daysInCare: number
  lastUpdate: string
  updates: {
    date: string
    title: string
    description: string
    image?: string
  }[]
}

interface PetCardProps {
  pet: Pet
  onSponsor: (pet: Pet) => void
  onViewDetails: (pet: Pet) => void
}

export function PetCard({ pet, onSponsor, onViewDetails }: PetCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  const statusColors = {
    urgent: 'bg-red-500',
    recovering: 'bg-yellow-500',
    ready: 'bg-green-500',
    adopted: 'bg-blue-500'
  }

  const statusLabels = {
    urgent: 'Urgent Care',
    recovering: 'Recovering',
    ready: 'Ready for Adoption',
    adopted: 'Adopted!'
  }

  const getProgressColor = (progress: number) => {
    if (progress < 30) return 'bg-red-500'
    if (progress < 70) return 'bg-yellow-500'
    return 'bg-green-500'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -10 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group"
    >
      <Card className="border-0 shadow-lg hover:shadow-2xl dark:hover:shadow-white/10 transition-all duration-300 overflow-hidden bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm group">
        {/* Pet Image */}
        <div className="relative overflow-hidden">
          <div className="aspect-square bg-gradient-to-br from-orange-100 to-red-100 dark:from-slate-700 dark:to-slate-600 flex items-center justify-center">
            <motion.div
              className="w-full h-full bg-gradient-to-br from-orange-200 to-red-200 dark:from-slate-600 dark:to-slate-500 flex items-center justify-center text-8xl"
              animate={{ scale: isHovered ? 1.1 : 1 }}
              transition={{ duration: 0.3 }}
            >
              🐕
            </motion.div>
          </div>

          {/* Status Badge */}
          <div className="absolute top-4 left-4">
            <Badge className={cn("text-white border-0", statusColors[pet.status])}>
              {statusLabels[pet.status]}
            </Badge>
          </div>

          {/* Days in Care */}
          <div className="absolute top-4 right-4">
            <Badge variant="secondary" className="bg-white/90 dark:bg-slate-700/90 text-gray-700 dark:text-gray-200">
              {pet.daysInCare} days
            </Badge>
          </div>

          {/* Urgent Overlay */}
          {pet.status === 'urgent' && (
            <motion.div
              className="absolute inset-0 bg-red-500/20 flex items-center justify-center"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <div className="text-white text-center">
                <Heart className="h-8 w-8 mx-auto mb-2 fill-red-500" />
                <div className="text-sm font-semibold">URGENT CARE NEEDED</div>
              </div>
            </motion.div>
          )}

          {/* Quick Actions */}
          <motion.div
            className="absolute bottom-4 right-4 flex gap-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ 
              opacity: isHovered ? 1 : 0, 
              y: isHovered ? 0 : 20 
            }}
            transition={{ duration: 0.3 }}
          >
            <Button
              size="icon"
              variant="secondary"
              className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white shadow-lg"
              onClick={() => onViewDetails(pet)}
            >
              <Camera className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="secondary"
              className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white shadow-lg"
            >
              <MessageCircle className="h-4 w-4" />
            </Button>
          </motion.div>
        </div>

        <CardContent className="p-6">
          {/* Pet Info */}
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1 group-hover:text-orange-600 transition-colors">
                {pet.name}
              </h3>
              <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-300">
                <span>{pet.age} old</span>
                <span>•</span>
                <span>{pet.breed}</span>
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="flex items-center gap-2 mb-4 text-sm text-gray-600 dark:text-gray-300">
            <MapPin className="h-4 w-4" />
            <span>{pet.location}</span>
          </div>

          {/* Description */}
          <p className="text-gray-700 dark:text-gray-300 mb-4 line-clamp-3">
            {pet.description}
          </p>

          {/* Medical Needs */}
          {pet.medicalNeeds.length > 0 && (
            <div className="mb-4">
              <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Medical Needs:</div>
              <div className="flex flex-wrap gap-1">
                {pet.medicalNeeds.slice(0, 3).map((need) => (
                  <Badge key={need} variant="outline" className="text-xs border-red-200 text-red-600">
                    {need}
                  </Badge>
                ))}
                {pet.medicalNeeds.length > 3 && (
                  <Badge variant="outline" className="text-xs border-gray-200 text-gray-600">
                    +{pet.medicalNeeds.length - 3} more
                  </Badge>
                )}
              </div>
            </div>
          )}

          {/* Personality */}
          <div className="mb-4">
            <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Personality:</div>
            <div className="flex flex-wrap gap-1">
              {pet.personality.slice(0, 3).map((trait) => (
                <Badge key={trait} variant="outline" className="text-xs border-blue-200 text-blue-600">
                  {trait}
                </Badge>
              ))}
            </div>
          </div>

          {/* Progress */}
          <div className="mb-4">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-gray-700 dark:text-gray-300">Fundraising Progress</span>
              <span className="font-semibold text-orange-600 dark:text-orange-400">
                {pet.progress}%
              </span>
            </div>
            <Progress 
              value={pet.progress} 
              className="h-2"
              // Custom styling for progress bar color
              style={{
                background: `linear-gradient(to right, ${getProgressColor(pet.progress)} ${pet.progress}%, #e5e7eb ${pet.progress}%)`
              }}
            />
            <div className="flex items-center justify-between text-sm mt-2 text-gray-600 dark:text-gray-300">
              <span>${pet.raisedAmount.toLocaleString()} raised</span>
              <span>${pet.targetAmount.toLocaleString()} goal</span>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="text-center p-3 bg-gray-50 dark:bg-slate-700 rounded-lg">
              <Users className="h-5 w-5 text-orange-500 mx-auto mb-1" />
              <div className="text-lg font-semibold text-gray-900 dark:text-white">{pet.sponsorCount}</div>
              <div className="text-xs text-gray-600 dark:text-gray-300">Sponsors</div>
            </div>
            <div className="text-center p-3 bg-gray-50 dark:bg-slate-700 rounded-lg">
              <Calendar className="h-5 w-5 text-green-500 mx-auto mb-1" />
              <div className="text-lg font-semibold text-gray-900 dark:text-white">{pet.daysInCare}</div>
              <div className="text-xs text-gray-600 dark:text-gray-300">Days in Care</div>
            </div>
          </div>

          {/* Last Update */}
          <div className="text-xs text-gray-500 mb-4">
            Last update: {pet.lastUpdate}
          </div>
        </CardContent>

        <CardFooter className="p-6 pt-0">
          <div className="flex gap-3 w-full">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => onViewDetails(pet)}
            >
              View Details
            </Button>
            <Button
              className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
              onClick={() => onSponsor(pet)}
            >
              <Heart className="h-4 w-4 mr-2" />
              Sponsor Now
            </Button>
          </div>
        </CardFooter>

        {/* Hover Overlay */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          initial={false}
          animate={{ opacity: isHovered ? 1 : 0 }}
        />
      </Card>
    </motion.div>
  )
}


