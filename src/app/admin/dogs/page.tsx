'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Plus, 
  Edit, 
  Eye, 
  Trash2,
  Search,
  Heart,
  Calendar,
  MapPin,
  MoreVertical
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { AnimatedPage } from '@/components/animated-page'
import Link from 'next/link'

interface DogProfile {
  id: string
  name: string
  slug: string
  breed: string
  age: string
  description: string
  status: 'draft' | 'published'
  adoptionStatus: 'available' | 'pending' | 'adopted'
  location: {
    city: string
    state: string
    country: string
  }
  tags: string[]
  createdAt: string
  updatedAt: string
}

export default function AdminDogs() {
  const [dogs, setDogs] = useState<DogProfile[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'available' | 'pending' | 'adopted'>('all')

  // Load dog profiles
  useEffect(() => {
    const loadDogs = async () => {
      try {
        setIsLoading(true)
        const response = await fetch('/api/admin/dogs')
        const data = await response.json()
        
        if (data.success) {
          setDogs(data.data.items)
        }
      } catch (error) {
        console.error('Failed to load dog profiles:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadDogs()
  }, [])

  // Filter dogs
  const filteredDogs = dogs.filter(dog => {
    const matchesSearch = dog.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         dog.breed.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         dog.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         dog.location.city.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || dog.adoptionStatus === statusFilter
    
    return matchesSearch && matchesStatus
  })

  const handleDeleteDog = async (id: string) => {
    if (!confirm('Are you sure you want to delete this dog profile?')) return
    
    try {
      const response = await fetch(`/api/admin/dogs/${id}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        setDogs(dogs.filter(d => d.id !== id))
      }
    } catch (error) {
      console.error('Failed to delete dog profile:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 border-2 border-muted-foreground/30 border-t-neon-secondary rounded-full animate-spin" />
          <span className="text-muted-foreground">Loading dog profiles...</span>
        </div>
      </div>
    )
  }

  return (
    <AnimatedPage>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="bg-card border-b border-border">
          <div className="container mx-auto container-padding py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-display text-3xl font-bold text-foreground">Manage Dogs</h1>
                <p className="text-body text-muted-foreground">Create and edit dog profiles</p>
              </div>
              <Link href="/admin/dogs/new">
                <Button variant="glow" className="glow-secondary group">
                  <Plus className="h-4 w-4 mr-2 group-hover:rotate-90 transition-transform duration-300" />
                  New Dog Profile
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <div className="container mx-auto container-padding py-8">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search dogs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant={statusFilter === 'all' ? 'default' : 'outline'}
                onClick={() => setStatusFilter('all')}
                size="sm"
              >
                All ({dogs.length})
              </Button>
              <Button
                variant={statusFilter === 'available' ? 'default' : 'outline'}
                onClick={() => setStatusFilter('available')}
                size="sm"
              >
                Available ({dogs.filter(d => d.adoptionStatus === 'available').length})
              </Button>
              <Button
                variant={statusFilter === 'pending' ? 'default' : 'outline'}
                onClick={() => setStatusFilter('pending')}
                size="sm"
              >
                Pending ({dogs.filter(d => d.adoptionStatus === 'pending').length})
              </Button>
              <Button
                variant={statusFilter === 'adopted' ? 'default' : 'outline'}
                onClick={() => setStatusFilter('adopted')}
                size="sm"
              >
                Adopted ({dogs.filter(d => d.adoptionStatus === 'adopted').length})
              </Button>
            </div>
          </div>

          {/* Dogs Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDogs.length > 0 ? (
              filteredDogs.map((dog, index) => (
                <motion.div
                  key={dog.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.3 }}
                  className="card p-6 hover:border-neon-secondary/30 transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-foreground mb-1">{dog.name}</h3>
                      <p className="text-sm text-muted-foreground">{dog.breed} • {dog.age}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                    {dog.description}
                  </p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      dog.adoptionStatus === 'available' ? 'bg-neon-secondary/20 text-neon-secondary border border-neon-secondary/30' :
                      dog.adoptionStatus === 'pending' ? 'bg-neon-accent/20 text-neon-accent border border-neon-accent/30' :
                      'bg-muted text-muted-foreground border border-border'
                    }`}>
                      {dog.adoptionStatus}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      dog.status === 'published' 
                        ? 'bg-neon-primary/20 text-neon-primary border border-neon-primary/30'
                        : 'bg-muted text-muted-foreground border border-border'
                    }`}>
                      {dog.status}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {dog.location.city}, {dog.location.state}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(dog.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                      <Link href={`/dogs/${dog.slug}`} target="_blank">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Link href={`/admin/dogs/${dog.id}/edit`}>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleDeleteDog(dog.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full">
                <div className="card p-12 text-center">
                  <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">No dog profiles found</h3>
                  <p className="text-muted-foreground mb-6">
                    {searchTerm || statusFilter !== 'all' 
                      ? 'Try adjusting your search or filters'
                      : 'Create your first dog profile to get started'
                    }
                  </p>
                  <Link href="/admin/dogs/new">
                    <Button variant="glow" className="glow-secondary">
                      <Plus className="h-4 w-4 mr-2" />
                      Create First Profile
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AnimatedPage>
  )
}