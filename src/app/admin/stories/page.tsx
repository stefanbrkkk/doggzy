'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Plus, 
  Edit, 
  Eye, 
  Trash2,
  Search,
  FileText,
  Calendar,
  Tag
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { AnimatedPage } from '@/components/animated-page'
import Link from 'next/link'

interface Story {
  id: string
  title: string
  slug: string
  summary: string
  status: 'draft' | 'published'
  tags: string[]
  createdAt: string
  updatedAt: string
  publishedAt?: string
  readingTime: number
}

export default function AdminStories() {
  const [stories, setStories] = useState<Story[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'draft' | 'published'>('all')

  // Load stories
  useEffect(() => {
    const loadStories = async () => {
      try {
        setIsLoading(true)
        const response = await fetch('/api/admin/stories')
        const data = await response.json()
        
        if (data.success) {
          setStories(data.data.items)
        }
      } catch (error) {
        console.error('Failed to load stories:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadStories()
  }, [])

  // Filter stories
  const filteredStories = stories.filter(story => {
    const matchesSearch = story.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         story.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         story.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesStatus = statusFilter === 'all' || story.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  const handleDeleteStory = async (id: string) => {
    if (!confirm('Are you sure you want to delete this story?')) return
    
    try {
      const response = await fetch(`/api/admin/stories/${id}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        setStories(stories.filter(s => s.id !== id))
      }
    } catch (error) {
      console.error('Failed to delete story:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 border-2 border-muted-foreground/30 border-t-neon-primary rounded-full animate-spin" />
          <span className="text-muted-foreground">Loading stories...</span>
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
                <h1 className="text-display text-3xl font-bold text-foreground">Manage Stories</h1>
                <p className="text-body text-muted-foreground">Create and edit blog stories</p>
              </div>
              <Link href="/admin/stories/new">
                <Button variant="glow" className="glow-primary">
                  <Plus className="h-4 w-4 mr-2" />
                  New Story
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
                  placeholder="Search stories..."
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
                All ({stories.length})
              </Button>
              <Button
                variant={statusFilter === 'published' ? 'default' : 'outline'}
                onClick={() => setStatusFilter('published')}
                size="sm"
              >
                Published ({stories.filter(s => s.status === 'published').length})
              </Button>
              <Button
                variant={statusFilter === 'draft' ? 'default' : 'outline'}
                onClick={() => setStatusFilter('draft')}
                size="sm"
              >
                Drafts ({stories.filter(s => s.status === 'draft').length})
              </Button>
            </div>
          </div>

          {/* Stories List */}
          <div className="space-y-4">
            {filteredStories.length > 0 ? (
              filteredStories.map((story, index) => (
                <motion.div
                  key={story.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.3 }}
                  className="card p-6 hover:border-neon-primary/30 transition-all duration-300"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-foreground">{story.title}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          story.status === 'published' 
                            ? 'bg-neon-secondary/20 text-neon-secondary border border-neon-secondary/30'
                            : 'bg-neon-accent/20 text-neon-accent border border-neon-accent/30'
                        }`}>
                          {story.status}
                        </span>
                      </div>
                      
                      <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                        {story.summary}
                      </p>
                      
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(story.updatedAt).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <FileText className="h-3 w-3" />
                          {story.readingTime} min read
                        </span>
                        {story.tags.length > 0 && (
                          <span className="flex items-center gap-1">
                            <Tag className="h-3 w-3" />
                            {story.tags.slice(0, 2).join(', ')}
                            {story.tags.length > 2 && ` +${story.tags.length - 2}`}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Link href={`/stories/${story.slug}`} target="_blank">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Link href={`/admin/stories/${story.id}/edit`}>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDeleteStory(story.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="card p-12 text-center">
                <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">No stories found</h3>
                <p className="text-muted-foreground mb-6">
                  {searchTerm || statusFilter !== 'all' 
                    ? 'Try adjusting your search or filters'
                    : 'Create your first story to get started'
                  }
                </p>
                <Link href="/admin/stories/new">
                  <Button variant="glow">
                    <Plus className="h-4 w-4 mr-2" />
                    Create First Story
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </AnimatedPage>
  )
}