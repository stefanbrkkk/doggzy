'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Home, ArrowLeft, Heart, Search } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-2xl mx-auto text-center"
      >
        <Card className="border-0 shadow-xl bg-white/95 backdrop-blur-sm">
          <CardContent className="p-12">
            {/* 404 Animation */}
            <motion.div
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="mb-8"
            >
              <div className="text-8xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                404
              </div>
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ repeat: Infinity, duration: 2, delay: 1 }}
                className="text-4xl mt-4"
              >
                🐕
              </motion.div>
            </motion.div>

            {/* Content */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Oops! This pup ran away
              </h1>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                The page you&apos;re looking for seems to have wandered off. Don&apos;t worry though - 
                there are plenty of other amazing things to explore on our site!
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                <Link href="/">
                  <Button size="lg" variant="glow" className="group">
                    <Home className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
                    Go Home
                  </Button>
                </Link>
                <Button 
                  size="lg" 
                  variant="outline" 
                  onClick={() => window.history.back()}
                  className="group"
                >
                  <ArrowLeft className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform" />
                  Go Back
                </Button>
              </div>

              {/* Quick Links */}
              <div className="border-t border-gray-200 pt-8">
                <p className="text-sm text-gray-500 mb-4">Or explore these popular pages:</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  <Link href="/adopt">
                    <Button variant="ghost" size="sm" className="text-orange-600 hover:text-orange-700">
                      <Heart className="h-4 w-4 mr-1" />
                      Adopt a Dog
                    </Button>
                  </Link>
                  <Link href="/donate">
                    <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                      <Heart className="h-4 w-4 mr-1" />
                      Make a Donation
                    </Button>
                  </Link>
                  <Link href="/shop">
                    <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                      <Search className="h-4 w-4 mr-1" />
                      Browse Shop
                    </Button>
                  </Link>
                  <Link href="/about">
                    <Button variant="ghost" size="sm" className="text-green-600 hover:text-green-700">
                      About Us
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}