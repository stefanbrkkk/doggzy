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
    <div className="space-y-10">
      {/* Enhanced Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between animate-slide-up">
        <div>
          <h1 className="text-4xl lg:text-5xl font-display font-black bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 bg-clip-text text-transparent animate-gradient-shift">
            Kontrolna tabla
          </h1>
          <p className="mt-3 text-lg text-white/70 max-w-2xl">
            Dobrodošli u Doggzy admin panel. Ovde možete upravljati celim sajtom sa naprednim analitikama i alatima.
          </p>
        </div>
        <div className="mt-6 sm:mt-0 flex items-center space-x-4 animate-slide-in-right">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="glass-subtle px-4 py-3 border border-white/20 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-white bg-transparent backdrop-blur-sm"
          >
            <option value="7d" className="bg-slate-800">Poslednih 7 dana</option>
            <option value="30d" className="bg-slate-800">Poslednih 30 dana</option>
            <option value="90d" className="bg-slate-800">Posledjih 90 dana</option>
          </select>
          <Button variant="glass" size="sm" className="hover:scale-105 transition-all duration-300">
            <Calendar className="h-5 w-5 mr-2" />
            Izvoz
          </Button>
        </div>
      </div>

      {/* Enhanced Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: index * 0.15, type: "spring", stiffness: 100 }}
            whileHover={{ scale: 1.05, y: -5 }}
          >
            <Card className="glass-card border border-white/10 shadow-glass-lg hover:shadow-glass-xl transition-all duration-500 group">
              <CardContent className="p-8">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-white/60 uppercase tracking-wider">{stat.label}</p>
                    <p className="text-3xl font-black text-white group-hover:scale-110 transition-transform duration-300">{stat.value}</p>
                    <p className={`text-sm font-medium ${stat.change.startsWith('+') ? 'text-green-400' : 'text-red-400'} flex items-center gap-1`}>
                      <TrendingUp className="h-4 w-4" />
                      {stat.change} od prošlog perioda
                    </p>
                  </div>
                  <div className={`p-4 rounded-2xl glass-subtle group-hover:scale-110 transition-all duration-300 animate-float`} style={{ animationDelay: `${index * 0.5}s` }}>
                    <stat.icon className={`h-8 w-8 ${stat.color} drop-shadow-lg`} />
                  </div>
                </div>
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Enhanced Quick Actions */}
        <div className="lg:col-span-2">
          <Card className="glass-card border border-white/10 shadow-glass-lg">
            <CardHeader className="pb-6">
              <CardTitle className="text-2xl font-bold text-white flex items-center gap-3">
                <div className="p-2 rounded-xl glass-subtle">
                  <Plus className="h-6 w-6 text-orange-400" />
                </div>
                Brze akcije
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {quickActions.map((action, index) => (
                  <motion.a
                    key={action.title}
                    href={action.href}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.05, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                    className="block group"
                  >
                    <div className={`p-8 rounded-2xl bg-gradient-to-br ${action.color} text-white shadow-glow hover:shadow-glow-lg transition-all duration-300 relative overflow-hidden`}>
                      <action.icon className="h-10 w-10 mb-4 group-hover:scale-110 transition-transform duration-300 drop-shadow-lg" />
                      <h3 className="font-bold text-xl mb-2 group-hover:translate-x-1 transition-transform duration-300">{action.title}</h3>
                      <p className="text-white/90 text-sm leading-relaxed">{action.description}</p>
                      {/* Shine effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                    </div>
                  </motion.a>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Enhanced Recent Activity */}
          <Card className="mt-8 glass-card border border-white/10 shadow-glass-lg">
            <CardHeader className="pb-6">
              <CardTitle className="text-2xl font-bold text-white flex items-center gap-3">
                <div className="p-2 rounded-xl glass-subtle">
                  <Clock className="h-6 w-6 text-blue-400 animate-pulse-glow" />
                </div>
                Nedavne aktivnosti
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {recentActivities.map((activity, index) => (
                  <motion.div 
                    key={index} 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start space-x-4 group hover:scale-105 transition-all duration-300"
                  >
                    <div className={`p-3 rounded-2xl glass-subtle ${
                      activity.status === 'success' ? 'border border-green-500/30' :
                      activity.status === 'info' ? 'border border-blue-500/30' : 'border border-gray-500/30'
                    }`}>
                      <div className={`w-3 h-3 rounded-full animate-pulse-glow ${
                        activity.status === 'success' ? 'bg-green-400 shadow-glow' :
                        activity.status === 'info' ? 'bg-blue-400 shadow-glow' : 'bg-gray-400'
                      }`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white group-hover:text-orange-400 transition-colors duration-300">{activity.message}</p>
                      <p className="text-xs text-white/60 flex items-center mt-2">
                        <Clock className="h-4 w-4 mr-2" />
                        {activity.time}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced System Status */}
        <div className="space-y-8">
          <Card className="glass-card border border-white/10 shadow-glass-lg">
            <CardHeader className="pb-6">
              <CardTitle className="text-2xl font-bold text-white flex items-center gap-3">
                <div className="p-2 rounded-xl glass-subtle">
                  <Settings className="h-6 w-6 text-green-400 animate-pulse-glow" />
                </div>
                Status sistema
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between group hover:scale-105 transition-all duration-300">
                <span className="text-sm font-medium text-white/80">Sajt status</span>
                <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-glow animate-pulse-glow">
                  Online
                </Badge>
              </div>
              <div className="flex items-center justify-between group hover:scale-105 transition-all duration-300">
                <span className="text-sm font-medium text-white/80">Baza podataka</span>
                <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-glow animate-pulse-glow">
                  Povezano
                </Badge>
              </div>
              <div className="flex items-center justify-between group hover:scale-105 transition-all duration-300">
                <span className="text-sm font-medium text-white/80">Backup</span>
                <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-glow">
                  Planiran
                </Badge>
              </div>
              <div className="flex items-center justify-between group hover:scale-105 transition-all duration-300">
                <span className="text-sm font-medium text-white/80">Verzija</span>
                <Badge className="glass-subtle border border-white/20 text-white">v1.0.0</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Enhanced Quick Stats */}
          <Card className="glass-card border border-white/10 shadow-glass-lg">
            <CardHeader className="pb-6">
              <CardTitle className="text-2xl font-bold text-white flex items-center gap-3">
                <div className="p-2 rounded-xl glass-subtle">
                  <TrendingUp className="h-6 w-6 text-purple-400 animate-pulse-glow" />
                </div>
                Brze statistike
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between group hover:scale-105 transition-all duration-300">
                <span className="text-sm font-medium text-white/80">Ukupno stranica</span>
                <span className="font-bold text-xl text-white">6</span>
              </div>
              <div className="flex items-center justify-between group hover:scale-105 transition-all duration-300">
                <span className="text-sm font-medium text-white/80">Medijski fajlovi</span>
                <span className="font-bold text-xl text-white">0</span>
              </div>
              <div className="flex items-center justify-between group hover:scale-105 transition-all duration-300">
                <span className="text-sm font-medium text-white/80">Proizvodi</span>
                <span className="font-bold text-xl text-white">0</span>
              </div>
              <div className="flex items-center justify-between group hover:scale-105 transition-all duration-300">
                <span className="text-sm font-medium text-white/80">Poslednje ažuriranje</span>
                <span className="text-sm text-green-400 font-medium animate-pulse-glow">Upravo sada</span>
              </div>
            </CardContent>
          </Card>
        </div>
        </div>
      </div>

      {/* Enhanced Welcome Message */}
      <Card className="glass-card border border-white/10 shadow-glass-xl bg-gradient-to-br from-orange-500/10 via-red-500/10 to-pink-500/10 animate-slide-up">
        <CardContent className="p-10">
          <div className="flex items-start space-x-6">
            <div className="p-4 glass-intense rounded-2xl animate-float">
              <Heart className="h-10 w-10 text-orange-400 animate-pulse-glow" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-3xl text-white mb-4 bg-gradient-to-r from-orange-400 via-red-400 to-pink-400 bg-clip-text text-transparent">
                Dobrodošli u Doggzy Admin Panel!
              </h3>
              <p className="text-white/80 mb-6 text-lg leading-relaxed">
                Vaš sajt je spreman za lansiranje. Možete početi sa dodavanjem sadržaja, 
                slika i proizvoda. Sve promene će se odmah prikazati na sajtu sa najnovijim dizajnom i animacijama.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" variant="glass" className="hover:scale-105 transition-all duration-300">
                  <Eye className="h-5 w-5 mr-3" />
                  Pogledaj sajt
                </Button>
                <Button size="lg" variant="glow" className="hover:scale-105 transition-all duration-300">
                  <Upload className="h-5 w-5 mr-3" />
                  Dodaj medije
                </Button>
              </div>
            </div>
          </div>
          {/* Decorative elements */}
          <div className="absolute top-4 right-4 w-20 h-20 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute bottom-4 left-4 w-16 h-16 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-full blur-xl animate-float"></div>
        </CardContent>
      </Card>
    </div>
  )
}
