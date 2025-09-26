'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Plus, 
  Edit, 
  Eye, 
  Upload, 
  Save, 
  Users, 
  Heart, 
  ShoppingBag, 
  Globe,
  BarChart3,
  Settings,
  FileText,
  Image,
  Calendar
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview')
  const [isEditing, setIsEditing] = useState(false)

  const stats = [
    { label: 'Total Donations', value: '$124,567', icon: Heart, color: 'text-red-500' },
    { label: 'Dogs Rescued', value: '2,847', icon: Users, color: 'text-blue-500' },
    { label: 'Products Sold', value: '1,234', icon: ShoppingBag, color: 'text-green-500' },
    { label: 'Active Sponsors', value: '456', icon: Globe, color: 'text-purple-500' }
  ]

  const recentActivities = [
    { type: 'donation', message: 'New donation of $50 from John Doe', time: '2 minutes ago', amount: '$50' },
    { type: 'rescue', message: 'Luna was successfully rescued in Austin, TX', time: '15 minutes ago', amount: null },
    { type: 'purchase', message: 'Custom dog portrait hoodie sold', time: '1 hour ago', amount: '$45' },
    { type: 'sponsor', message: 'New sponsor for Max (German Shepherd)', time: '2 hours ago', amount: '$25/month' }
  ]

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'dogs', label: 'Rescue Dogs', icon: Heart },
    { id: 'products', label: 'Products', icon: ShoppingBag },
    { id: 'content', label: 'Content', icon: FileText },
    { id: 'settings', label: 'Settings', icon: Settings }
  ]

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            whileHover={{ y: -5 }}
          >
            <div className="card p-6 hover:-translate-y-1 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                </div>
                <div className="p-3 rounded-full bg-muted">
                  <stat.icon className="h-6 w-6 text-foreground" />
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="card">
        <div className="p-6 border-b border-border">
          <h3 className="flex items-center gap-2 text-lg font-semibold text-foreground">
            <Calendar className="h-5 w-5" />
            Recent Activity
          </h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="flex items-center justify-between p-4 bg-muted rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${
                    activity.type === 'donation' ? 'bg-neon-secondary' :
                    activity.type === 'rescue' ? 'bg-neon-primary' :
                    activity.type === 'purchase' ? 'bg-neon-accent' : 'bg-foreground'
                  }`} />
                  <div>
                    <p className="font-medium text-foreground">{activity.message}</p>
                    <p className="text-sm text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
                {activity.amount && (
                  <span className="font-semibold text-neon-secondary">{activity.amount}</span>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <div className="p-6 border-b border-border">
          <h3 className="text-lg font-semibold text-foreground">Quick Actions</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>
              <Button className="w-full" variant="glow">
                <Plus className="h-4 w-4 mr-2" />
                Add New Dog
              </Button>
            </motion.div>
            <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>
              <Button variant="outline" className="w-full">
                <Upload className="h-4 w-4 mr-2" />
                Upload Story
              </Button>
            </motion.div>
            <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>
              <Button variant="outline" className="w-full">
                {/* eslint-disable-next-line jsx-a11y/alt-text */}
                <Image className="h-4 w-4 mr-2" />
                Add Product
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )

  const renderContent = () => (
    <div className="space-y-6">
      <div className="card">
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground">Content Management</h3>
            <Button onClick={() => setIsEditing(!isEditing)} variant={isEditing ? 'glow' : 'outline'}>
              {isEditing ? <Save className="h-4 w-4 mr-2" /> : <Edit className="h-4 w-4 mr-2" />}
              {isEditing ? 'Save Changes' : 'Edit Mode'}
            </Button>
          </div>
        </div>
        <div className="p-6">
          <div className="space-y-6">
            {/* Homepage Hero */}
            <div className="p-6 border border-border rounded-lg bg-muted/30">
              <h3 className="text-lg font-semibold mb-4 text-foreground">Homepage Hero Section</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Main Headline
                  </label>
                  <Input
                    defaultValue="Every Dog Deserves A Happy Ending"
                    disabled={!isEditing}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Subtitle
                  </label>
                  <textarea
                    defaultValue="Join our global movement to rescue, rehabilitate, and rehome dogs in need. Every donation and purchase directly saves lives and creates miracles."
                    disabled={!isEditing}
                    className="w-full p-3 border border-border rounded-lg bg-background text-foreground focus:border-neon-primary focus:ring-0"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Hero Video URL
                  </label>
                  <Input
                    defaultValue="https://example.com/hero-video.mp4"
                    disabled={!isEditing}
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            {/* Success Stories */}
            <div className="p-6 border border-border rounded-lg bg-muted/30">
              <h3 className="text-lg font-semibold mb-4 text-foreground">Success Stories</h3>
              <div className="space-y-4">
                {[
                  { name: 'Luna', location: 'Austin, TX', status: 'Published' },
                  { name: 'Max', location: 'Miami, FL', status: 'Draft' },
                  { name: 'Bella', location: 'Seattle, WA', status: 'Published' }
                ].map((story, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-background rounded-lg border border-border">
                    <div>
                      <h4 className="font-medium text-foreground">{story.name}&apos;s Story</h4>
                      <p className="text-sm text-muted-foreground">{story.location}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        story.status === 'Published' 
                          ? 'bg-neon-secondary/20 text-neon-secondary border border-neon-secondary/30' 
                          : 'bg-neon-accent/20 text-neon-accent border border-neon-accent/30'
                      }`}>
                        {story.status}
                      </span>
                      <Button size="sm" variant="outline">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Impact Statistics */}
            <div className="p-6 border border-border rounded-lg bg-muted/30">
              <h3 className="text-lg font-semibold mb-4 text-foreground">Impact Statistics</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Dogs Saved This Month
                  </label>
                  <Input
                    defaultValue="2,847"
                    disabled={!isEditing}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Partner Shelters
                  </label>
                  <Input
                    defaultValue="156"
                    disabled={!isEditing}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Countries
                  </label>
                  <Input
                    defaultValue="47"
                    disabled={!isEditing}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Success Rate
                  </label>
                  <Input
                    defaultValue="98%"
                    disabled={!isEditing}
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border">
        <div className="container mx-auto container-padding py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-display text-3xl font-bold text-foreground">Admin Dashboard</h1>
              <p className="text-body text-muted-foreground">Manage your Doggzy content and operations</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium text-foreground">Admin User</p>
                <p className="text-sm text-muted-foreground">admin@doggzy.org</p>
              </div>
              <div className="w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-semibold">
                A
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto container-padding py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64">
            <div className="card p-6">
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors duration-200 ${
                      activeTab === tab.id
                        ? 'bg-primary text-primary-foreground glow-primary'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    }`}
                  >
                    <tab.icon className="h-5 w-5" />
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {activeTab === 'overview' && renderOverview()}
              {activeTab === 'content' && renderContent()}
              {activeTab === 'dogs' && (
                <div className="card">
                  <div className="p-8 text-center">
                    <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-foreground mb-2">Rescue Dogs Management</h3>
                    <p className="text-muted-foreground">Manage rescue dog profiles, updates, and adoption status.</p>
                  </div>
                </div>
              )}
              {activeTab === 'products' && (
                <div className="card">
                  <div className="p-8 text-center">
                    <ShoppingBag className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-foreground mb-2">Product Management</h3>
                    <p className="text-muted-foreground">Manage merchandise, pricing, and inventory.</p>
                  </div>
                </div>
              )}
              {activeTab === 'settings' && (
                <div className="card">
                  <div className="p-8 text-center">
                    <Settings className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-foreground mb-2">Settings</h3>
                    <p className="text-muted-foreground">Configure website settings, integrations, and preferences.</p>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
