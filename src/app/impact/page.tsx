'use client'

import { motion } from 'framer-motion'
import { Heart, Users, Globe, Award, TrendingUp, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'

export default function ImpactPage() {
  const impactStats = [
    { 
      number: "50,000+", 
      label: "Dogs Rescued", 
      icon: Heart,
      description: "Lives saved and transformed through our rescue efforts",
      color: "from-red-500 to-pink-500"
    },
    { 
      number: "156", 
      label: "Partner Shelters", 
      icon: Users,
      description: "Trusted organizations working with us globally",
      color: "from-blue-500 to-cyan-500"
    },
    { 
      number: "47", 
      label: "Countries", 
      icon: Globe,
      description: "Nations where we have active rescue operations",
      color: "from-green-500 to-emerald-500"
    },
    { 
      number: "98%", 
      label: "Success Rate", 
      icon: Award,
      description: "Dogs successfully rehabilitated and rehomed",
      color: "from-yellow-500 to-orange-500"
    }
  ]

  const monthlyGoals = [
    { title: "Emergency Rescues", current: 247, target: 300, color: "bg-red-500" },
    { title: "Medical Treatments", current: 189, target: 250, color: "bg-blue-500" },
    { title: "Successful Adoptions", current: 156, target: 200, color: "bg-green-500" },
    { title: "New Partnerships", current: 8, target: 12, color: "bg-purple-500" }
  ]

  const recentAchievements = [
    {
      title: "Hurricane Relief Operation",
      description: "Rescued 47 dogs during Hurricane Ian in Florida",
      date: "September 2024",
      impact: "47 dogs saved"
    },
    {
      title: "Puppy Mill Raid",
      description: "Collaborated with authorities to shut down illegal breeding operation",
      date: "August 2024",
      impact: "23 dogs rescued"
    },
    {
      title: "International Rescue",
      description: "Coordinated rescue of 15 dogs from high-kill shelter in Mexico",
      date: "July 2024",
      impact: "15 dogs saved"
    },
    {
      title: "Medical Fund Campaign",
      description: "Raised $50,000 for emergency medical treatments",
      date: "June 2024",
      impact: "127 dogs treated"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
      {/* Hero Section */}
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
              <TrendingUp className="h-4 w-4 fill-orange-500 text-orange-500" />
              Real Impact, Real Results
            </motion.div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold leading-tight mb-6">
              <span className="bg-gradient-to-r from-gray-900 via-orange-600 to-red-600 bg-clip-text text-transparent">
                Our
              </span>
              <br />
              <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                Impact
              </span>
            </h1>
            
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
              See the real difference we're making in the lives of dogs worldwide. 
              Every number represents a life saved, a family made whole, and hope restored.
            </p>
          </motion.div>

          {/* Impact Stats */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {impactStats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
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
                      {stat.number}
                    </div>
                    <div className="text-lg font-semibold text-gray-700 mb-2">
                      {stat.label}
                    </div>
                    <div className="text-sm text-gray-600">
                      {stat.description}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Monthly Goals */}
      <section className="py-20 bg-white/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-display font-bold mb-6">
              <span className="bg-gradient-to-r from-gray-900 to-orange-600 bg-clip-text text-transparent">
                This Month's Goals
              </span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              We set ambitious monthly targets to ensure we're always pushing forward in our mission.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {monthlyGoals.map((goal, index) => (
              <motion.div
                key={goal.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/90 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold text-gray-900">
                        {goal.title}
                      </h3>
                      <span className="text-2xl font-bold text-gray-700">
                        {goal.current}/{goal.target}
                      </span>
                    </div>
                    <Progress 
                      value={(goal.current / goal.target) * 100} 
                      className="h-3 mb-2"
                    />
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>{Math.round((goal.current / goal.target) * 100)}% Complete</span>
                      <span>{goal.target - goal.current} remaining</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Achievements */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-display font-bold mb-6">
              <span className="bg-gradient-to-r from-gray-900 to-orange-600 bg-clip-text text-transparent">
                Recent Achievements
              </span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Here are some of our recent successes that showcase the impact of your support.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {recentAchievements.map((achievement, index) => (
              <motion.div
                key={achievement.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/90 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                          {achievement.title}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                          <Calendar className="h-4 w-4" />
                          <span>{achievement.date}</span>
                        </div>
                      </div>
                      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        {achievement.impact}
                      </div>
                    </div>
                    <p className="text-gray-600">
                      {achievement.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
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
              Help Us Make Even Greater Impact
            </h2>
            <p className="text-xl mb-8 max-w-3xl mx-auto opacity-90">
              Your support directly enables these life-saving operations. 
              Every donation helps us reach more dogs and create more happy endings.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button className="bg-white text-orange-500 px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-100 transition-colors duration-300 shadow-lg">
                  <Heart className="h-5 w-5 mr-2" />
                  Donate Now
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button variant="outline" className="border-white text-white hover:bg-white hover:text-orange-500 px-8 py-4 rounded-full text-lg font-semibold transition-colors duration-300">
                  View Success Stories
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
