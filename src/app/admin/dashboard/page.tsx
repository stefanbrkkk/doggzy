'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  PawPrint,
  FileText,
  Heart,
  TrendingUp,
  Calendar,
  Plus,
  Eye,
  LogOut,
  BarChart3,
  Image as ImageIcon
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AnimatedPage } from '@/components/animated-page'
import Link from 'next/link'

interface DashboardStats {
  totalStories: number
  publishedStories: number
  draftStories: number
  totalDogs: number
  availableDogs: number
  adoptedDogs: number
  recentActivity: Array<{
    type: 'story' | 'dog' | 'adoption'
    message: string
    time: string
    status?: string
  }>
}

export default function AdminDashboard() {
  const router = useRouter()
  const [stats, setStats] = useState<DashboardStats>({
    totalStories: 0,
    publishedStories: 0,
    draftStories: 0,
    totalDogs: 0,
    availableDogs: 0,
    adoptedDogs: 0,
    recentActivity: []
  })
  const [user, setUser] = useState<{ email: string; role: string } | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Load dashboard data
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setIsLoading(true)
        
        // Get current user
        const userResponse = await fetch('/api/admin/me')
        if (userResponse.ok) {
          const userData = await userResponse.json()
          setUser(userData.user)
        }

        // Load stories stats
        const storiesResponse = await fetch('/api/admin/stories?limit=100')
        const storiesData = await storiesResponse.json()
        
        // Load dogs stats  
        const dogsResponse = await fetch('/api/admin/dogs?limit=100')
        const dogsData = await dogsResponse.json()

        if (storiesData.success && dogsData.success) {
          const stories = storiesData.data.items
          const dogs = dogsData.data.items

          setStats({
            totalStories: stories.length,
            publishedStories: stories.filter((s: { status: string }) => s.status === 'published').length,
            draftStories: stories.filter((s: { status: string }) => s.status === 'draft').length,
            totalDogs: dogs.length,
            availableDogs: dogs.filter((d: { adoptionStatus: string }) => d.adoptionStatus === 'available').length,
            adoptedDogs: dogs.filter((d: { adoptionStatus: string }) => d.adoptionStatus === 'adopted').length,
            recentActivity: [
              ...stories.slice(0, 3).map((s: { title: string; status: string; updatedAt: string }) => ({
                type: 'story' as const,
                message: `Story "${s.title}" ${s.status === 'published' ? 'published' : 'saved as draft'}`,
                time: new Date(s.updatedAt).toLocaleDateString(),
                status: s.status
              })),
              ...dogs.slice(0, 3).map((d: { name: string; status: string; adoptionStatus: string; updatedAt: string }) => ({
                type: 'dog' as const,
                message: `${d.name} profile ${d.status === 'published' ? 'published' : 'saved as draft'}`,
                time: new Date(d.updatedAt).toLocaleDateString(),
                status: d.adoptionStatus
              }))
            ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 6)
          })
        }
      } catch (error) {
        console.error('Failed to load dashboard data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadDashboardData()
  }, [])

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' })
      router.push('/admin/login')
      router.refresh()
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  const statCards = [
    {
      title: 'Total Stories',
      value: stats.totalStories.toString(),
      subtitle: `${stats.publishedStories} published, ${stats.draftStories} drafts`,
      icon: FileText,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Dog Profiles',
      value: stats.totalDogs.toString(),
      subtitle: `${stats.availableDogs} available, ${stats.adoptedDogs} adopted`,
      icon: Heart,
      color: 'text-red-500',
      bgColor: 'bg-red-50'
    },
    {
      title: 'Published Content',
      value: (stats.publishedStories + stats.totalDogs).toString(),
      subtitle: 'Live on website',
      icon: TrendingUp,
      color: 'text-green-500',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Content Health',
      value: `${Math.round((stats.publishedStories + stats.totalDogs) / Math.max(stats.totalStories + stats.totalDogs, 1) * 100)}%`,
      subtitle: 'Published vs drafts',
      icon: BarChart3,
      color: 'text-purple-500',
      bgColor: 'bg-purple-50'
    }
  ]

  const quickActions = [
    {
      label: 'New Story',
      href: '/admin/stories/new',
      icon: FileText,
      description: 'Create a new blog story'
    },
    {
      label: 'New Dog Profile',
      href: '/admin/dogs/new',
      icon: Heart,
      description: 'Add a new rescue dog'
    },
    {
      label: 'Upload Media',
      href: '/admin/media',
      icon: ImageIcon,
      description: 'Manage images and media'
    },
    {
      label: 'View Site',
      href: '/',
      icon: Eye,
      description: 'Preview public website',
      external: true
    }
  ]

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 border-2 border-muted-foreground/30 border-t-neon-primary rounded-full animate-spin" />
          <span className="text-muted-foreground">Loading dashboard...</span>
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
              <div className="flex items-center gap-4">
                <Link href="/admin/dashboard" className="flex items-center gap-2 group">
                  <div className="p-2 bg-primary text-primary-foreground rounded-xl glow-primary">
                    <PawPrint className="h-6 w-6" />
                  </div>
                  <div>
                    <h1 className="text-display text-2xl font-bold text-foreground">Admin Dashboard</h1>
                    <p className="text-sm text-muted-foreground">Manage your Doggzy content</p>
                  </div>
                </Link>
              </div>
              
              <div className="flex items-center gap-4">
                {user && (
                  <div className="text-right hidden sm:block">
                    <p className="text-sm font-medium text-foreground">{user.email}</p>
                    <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
                  </div>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="flex items-center gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline">Logout</span>
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto container-padding py-8">
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {statCards.map((stat, index) => (
                <motion.div
                  key={stat.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  whileHover={{ y: -2 }}
                >
                  <div className="card p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-muted-foreground mb-1">{stat.title}</p>
                        <p className="text-3xl font-bold text-foreground mb-1">{stat.value}</p>
                        <p className="text-xs text-muted-foreground">{stat.subtitle}</p>
                      </div>
                      <div className="p-3 rounded-xl bg-muted">
                        <stat.icon className="h-6 w-6 text-foreground" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Quick Actions */}
              <div className="lg:col-span-2">
                <div className="card">
                  <div className="p-6 border-b border-border">
                    <h3 className="flex items-center gap-2 text-lg font-semibold text-foreground">
                      <Plus className="h-5 w-5" />
                      Quick Actions
                    </h3>
                  </div>
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {quickActions.map((action, index) => (
                        <motion.div
                          key={action.label}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.3 + index * 0.1 }}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Link
                            href={action.href}
                            target={action.external ? '_blank' : undefined}
                            rel={action.external ? 'noopener noreferrer' : undefined}
                            className="block p-4 rounded-lg border border-border hover:border-neon-primary/30 hover:bg-muted/50 transition-all duration-200 group"
                          >
                            <div className="flex items-start gap-3">
                              <div className="p-2 bg-muted group-hover:bg-muted/80 rounded-lg transition-colors">
                                <action.icon className="h-5 w-5 text-muted-foreground group-hover:text-foreground" />
                              </div>
                              <div>
                                <h3 className="font-medium text-foreground">
                                  {action.label}
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                  {action.description}
                                </p>
                              </div>
                            </div>
                          </Link>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div>
                <div className="card">
                  <div className="p-6 border-b border-border">
                    <h3 className="flex items-center gap-2 text-lg font-semibold text-foreground">
                      <Calendar className="h-5 w-5" />
                      Recent Activity
                    </h3>
                  </div>
                  <div className="p-6">
                    <div className="space-y-4">
                      {stats.recentActivity.length > 0 ? (
                        stats.recentActivity.map((activity, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5 + index * 0.1 }}
                            className="flex items-start gap-3 p-3 bg-muted rounded-lg"
                          >
                            <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                              activity.type === 'story' ? 'bg-neon-primary' :
                              activity.type === 'dog' ? 'bg-neon-secondary' : 'bg-neon-accent'
                            }`} />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-foreground leading-tight">
                                {activity.message}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                            </div>
                          </motion.div>
                        ))
                      ) : (
                        <div className="text-center py-8">
                          <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                          <p className="text-sm text-muted-foreground">No recent activity</p>
                          <p className="text-xs text-muted-foreground/70">Create some content to see updates here</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                whileHover={{ y: -4 }}
              >
                <Link href="/admin/stories">
                  <div className="card p-8 text-center group cursor-pointer hover:border-neon-primary/30 transition-all duration-300">
                      <FileText className="h-16 w-16 text-neon-primary mx-auto mb-4 group-hover:scale-110 transition-transform" />
                      <h3 className="text-xl font-semibold text-foreground mb-2">Manage Stories</h3>
                      <p className="text-muted-foreground mb-4">Create and edit blog stories</p>
                      <div className="flex justify-center gap-4 text-sm text-muted-foreground">
                        <span>{stats.totalStories} total</span>
                        <span>{stats.publishedStories} published</span>
                      </div>
                  </div>
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                whileHover={{ y: -4 }}
              >
                <Link href="/admin/dogs">
                  <div className="card p-8 text-center group cursor-pointer hover:border-neon-secondary/30 transition-all duration-300">
                    <Heart className="h-16 w-16 text-neon-secondary mx-auto mb-4 group-hover:scale-110 transition-transform" />
                    <h3 className="text-xl font-semibold text-foreground mb-2">Manage Dogs</h3>
                    <p className="text-muted-foreground mb-4">Create and edit dog profiles</p>
                    <div className="flex justify-center gap-4 text-sm text-muted-foreground">
                      <span>{stats.totalDogs} total</span>
                      <span>{stats.availableDogs} available</span>
                    </div>
                  </div>
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
                whileHover={{ y: -4 }}
              >
                <Link href="/admin/media">
                  <div className="card p-8 text-center group cursor-pointer hover:border-neon-accent/30 transition-all duration-300">
                    <ImageIcon className="h-16 w-16 text-neon-accent mx-auto mb-4 group-hover:scale-110 transition-transform" />
                    <h3 className="text-xl font-semibold text-foreground mb-2">Media Library</h3>
                    <p className="text-muted-foreground mb-4">Upload and manage images</p>
                    <div className="flex justify-center gap-4 text-sm text-muted-foreground">
                      <span>Images & files</span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </AnimatedPage>
  )
}
