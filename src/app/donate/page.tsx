import { DonationForm } from '@/components/donation/donation-form'
import { ImpactStats } from '@/components/impact-stats'
import { motion } from 'framer-motion'
import { Heart, Shield, Globe, Users } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

export default function DonatePage() {
  const features = [
    {
      icon: Shield,
      title: "Secure & Tax-Deductible",
      description: "All donations are processed securely through Stripe and are tax-deductible under 501(c)(3)"
    },
    {
      icon: Globe,
      title: "Global Impact",
      description: "Your donation helps rescue dogs across 47 countries through our partner network"
    },
    {
      icon: Users,
      title: "Transparent Use",
      description: "98% of donations go directly to rescue operations, medical care, and rehabilitation"
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
              <Heart className="h-4 w-4 fill-orange-500 text-orange-500" />
              Make a Difference Today
            </motion.div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold leading-tight mb-6">
              <span className="bg-gradient-to-r from-gray-900 via-orange-600 to-red-600 bg-clip-text text-transparent">
                Save a Life
              </span>
              <br />
              <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                Make a Donation
              </span>
            </h1>
            
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
              Every dollar you donate goes directly to rescuing, rehabilitating, and rehoming dogs in need. 
              Join thousands of compassionate donors making miracles happen every day.
            </p>
          </motion.div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1, duration: 0.6 }}
                whileHover={{ y: -5 }}
              >
                <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm">
                  <CardContent className="p-6 text-center">
                    <motion.div
                      className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 text-white mb-4"
                      whileHover={{ rotate: 360, scale: 1.1 }}
                      transition={{ duration: 0.6 }}
                    >
                      <feature.icon className="h-8 w-8" />
                    </motion.div>
                    <h3 className="text-xl font-bold mb-2 text-gray-900">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Donation Form */}
          <DonationForm />
        </div>
      </section>

      {/* Impact Stats */}
      <ImpactStats />

      {/* Urgent Rescue Section */}
      <section className="py-20 bg-gradient-to-r from-red-500 to-orange-500 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-display font-bold mb-6">
              Urgent: Dogs Need Your Help Right Now
            </h2>
            <p className="text-xl mb-8 max-w-3xl mx-auto opacity-90">
              Every day, hundreds of dogs are abandoned, abused, or left to die. 
              Your donation today could literally save a life tomorrow.
            </p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <button className="bg-white text-orange-500 px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-100 transition-colors duration-300 shadow-lg">
                <Heart className="h-5 w-5 inline mr-2" />
                Donate Now - Save a Life
              </button>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
