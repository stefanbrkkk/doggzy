'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Upload, 
  Save, 
  X, 
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/90 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-full bg-gray-100 ${stat.color}`}>
                    <stat.icon className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Recent Activity */}
      <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${
                    activity.type === 'donation' ? 'bg-green-500' :
                    activity.type === 'rescue' ? 'bg-blue-500' :
                    activity.type === 'purchase' ? 'bg-orange-500' : 'bg-purple-500'
                  }`} />
                  <div>
                    <p className="font-medium text-gray-900">{activity.message}</p>
                    <p className="text-sm text-gray-500">{activity.time}</p>
                  </div>
                </div>
                {activity.amount && (
                  <span className="font-semibold text-green-600">{activity.amount}</span>
                )}
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600">
                <Plus className="h-4 w-4 mr-2" />
                Add New Dog
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button variant="outline" className="w-full">
                <Upload className="h-4 w-4 mr-2" />
                Upload Story
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button variant="outline" className="w-full">
                <Image className="h-4 w-4 mr-2" />
                Add Product
              </Button>
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderContent = () => (
    <div className="space-y-6">
      <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Content Management</span>
            <Button onClick={() => setIsEditing(!isEditing)}>
              {isEditing ? <Save className="h-4 w-4 mr-2" /> : <Edit className="h-4 w-4 mr-2" />}
              {isEditing ? 'Save Changes' : 'Edit Mode'}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Homepage Hero */}
            <div className="p-6 border border-gray-200 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Homepage Hero Section</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Main Headline
                  </label>
                  <Input
                    defaultValue="Every Dog Deserves A Happy Ending"
                    disabled={!isEditing}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subtitle
                  </label>
                  <textarea
                    defaultValue="Join our global movement to rescue, rehabilitate, and rehome dogs in need. Every donation and purchase directly saves lives and creates miracles."
                    disabled={!isEditing}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
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
            <div className="p-6 border border-gray-200 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Success Stories</h3>
              <div className="space-y-4">
                {[
                  { name: 'Luna', location: 'Austin, TX', status: 'Published' },
                  { name: 'Max', location: 'Miami, FL', status: 'Draft' },
                  { name: 'Bella', location: 'Seattle, WA', status: 'Published' }
                ].map((story, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-medium">{story.name}&apos;s Story</h4>
                      <p className="text-sm text-gray-600">{story.location}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        story.status === 'Published' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
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
            <div className="p-6 border border-gray-200 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Impact Statistics</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dogs Saved This Month
                  </label>
                  <Input
                    defaultValue="2,847"
                    disabled={!isEditing}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Partner Shelters
                  </label>
                  <Input
                    defaultValue="156"
                    disabled={!isEditing}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Countries
                  </label>
                  <Input
                    defaultValue="47"
                    disabled={!isEditing}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
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
        </CardContent>
      </Card>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-orange-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600">Manage your Doggzy content and operations</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">Admin User</p>
                <p className="text-sm text-gray-500">admin@doggzy.org</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white font-semibold">
                A
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64">
            <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
              <CardContent className="p-6">
                <nav className="space-y-2">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors duration-200 ${
                        activeTab === tab.id
                          ? 'bg-orange-500 text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <tab.icon className="h-5 w-5" />
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </CardContent>
            </Card>
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
                <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
                  <CardContent className="p-8 text-center">
                    <Heart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Rescue Dogs Management</h3>
                    <p className="text-gray-600">Manage rescue dog profiles, updates, and adoption status.</p>
                  </CardContent>
                </Card>
              )}
              {activeTab === 'products' && (
                <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
                  <CardContent className="p-8 text-center">
                    <ShoppingBag className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Product Management</h3>
                    <p className="text-gray-600">Manage merchandise, pricing, and inventory.</p>
                  </CardContent>
                </Card>
              )}
              {activeTab === 'settings' && (
                <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
                  <CardContent className="p-8 text-center">
                    <Settings className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Settings</h3>
                    <p className="text-gray-600">Configure website settings, integrations, and preferences.</p>
                  </CardContent>
                </Card>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

