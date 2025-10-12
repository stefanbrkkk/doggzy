'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Heart, 
  Users, 
  ShoppingBag, 
  TrendingUp,
  Plus,
  Upload,
  Edit,
  Eye,
  Calendar,
  Clock
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default function AdminDashboard() {
  const [timeRange, setTimeRange] = useState('7d')

  const stats = [
    { 
      label: 'Ukupne donacije', 
      value: '0 RSD', 
      change: '+0%', 
      icon: Heart, 
      color: 'text-red-500',
      bgColor: 'bg-red-50'
    },
    { 
      label: 'Spašeni psi', 
      value: '0', 
      change: '+0%', 
      icon: Users, 
      color: 'text-blue-500',
      bgColor: 'bg-blue-50'
    },
    { 
      label: 'Prodati proizvodi', 
      value: '0', 
      change: '+0%', 
      icon: ShoppingBag, 
      color: 'text-green-500',
      bgColor: 'bg-green-50'
    },
    { 
      label: 'Mesečni rast', 
      value: '0%', 
      change: '+0%', 
      icon: TrendingUp, 
      color: 'text-purple-500',
      bgColor: 'bg-purple-50'
    }
  ]

  const recentActivities = [
    { 
      type: 'system', 
      message: 'Admin panel je kreiran', 
      time: 'Upravo sada', 
      status: 'success'
    },
    { 
      type: 'system', 
      message: 'Sajt je spreman za lansiranje', 
      time: 'Pre 5 minuta', 
      status: 'info'
    }
  ]

  const quickActions = [
    {
      title: 'Dodaj medije',
      description: 'Otpremi slike i videe',
      icon: Upload,
      href: '/admin/media',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      title: 'Uredi sadržaj',
      description: 'Ažuriraj tekstove stranica',
      icon: Edit,
      href: '/admin/content',
      color: 'from-green-500 to-emerald-500'
    },
    {
      title: 'Dodaj proizvod',
      description: 'Novi proizvod u prodavnicu',
      icon: Plus,
      href: '/admin/products',
      color: 'from-orange-500 to-red-500'
    }
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Kontrolna tabla</h1>
          <p className="mt-2 text-gray-600">
            Dobrodošli u Doggzy admin panel. Ovde možete upravljati celim sajtom.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex items-center space-x-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          >
            <option value="7d">Poslednih 7 dana</option>
            <option value="30d">Poslednih 30 dana</option>
            <option value="90d">Poslednih 90 dana</option>
          </select>
          <Button variant="outline" size="sm">
            <Calendar className="h-4 w-4 mr-2" />
            Izvoz
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="hover:shadow-lg transition-shadow duration-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                    <p className={`text-sm mt-1 ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                      {stat.change} od prošlog perioda
                    </p>
                  </div>
                  <div className={`p-3 rounded-full ${stat.bgColor}`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Actions */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Brze akcije</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {quickActions.map((action) => (
                  <motion.a
                    key={action.title}
                    href={action.href}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="block"
                  >
                    <div className={`p-6 rounded-xl bg-gradient-to-r ${action.color} text-white hover:shadow-lg transition-shadow duration-200`}>
                      <action.icon className="h-8 w-8 mb-3" />
                      <h3 className="font-semibold text-lg mb-1">{action.title}</h3>
                      <p className="text-white/80 text-sm">{action.description}</p>
                    </div>
                  </motion.a>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Nedavne aktivnosti</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className={`p-2 rounded-full ${
                      activity.status === 'success' ? 'bg-green-100' :
                      activity.status === 'info' ? 'bg-blue-100' : 'bg-gray-100'
                    }`}>
                      <div className={`w-2 h-2 rounded-full ${
                        activity.status === 'success' ? 'bg-green-500' :
                        activity.status === 'info' ? 'bg-blue-500' : 'bg-gray-500'
                      }`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900">{activity.message}</p>
                      <p className="text-xs text-gray-500 flex items-center mt-1">
                        <Clock className="h-3 w-3 mr-1" />
                        {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* System Status */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Status sistema</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Sajt status</span>
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  Online
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Baza podataka</span>
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  Povezano
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Backup</span>
                <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                  Planiran
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Verzija</span>
                <Badge variant="outline">v1.0.0</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Brze statistike</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Ukupno stranica</span>
                <span className="font-medium">6</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Medijski fajlovi</span>
                <span className="font-medium">0</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Proizvodi</span>
                <span className="font-medium">0</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Poslednje ažuriranje</span>
                <span className="text-sm text-gray-500">Upravo sada</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Welcome Message */}
      <Card className="bg-gradient-to-r from-orange-50 to-red-50 border-orange-200">
        <CardContent className="p-6">
          <div className="flex items-start space-x-4">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Heart className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Dobrodošli u Doggzy Admin Panel!
              </h3>
              <p className="text-gray-700 mb-4">
                Vaš sajt je spreman za lansiranje. Možete početi sa dodavanjem sadržaja, 
                slika i proizvoda. Sve promene će se odmah prikazati na sajtu.
              </p>
              <div className="flex flex-wrap gap-2">
                <Button size="sm" variant="outline">
                  <Eye className="h-4 w-4 mr-2" />
                  Pogledaj sajt
                </Button>
                <Button size="sm" variant="outline">
                  <Upload className="h-4 w-4 mr-2" />
                  Dodaj medije
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
