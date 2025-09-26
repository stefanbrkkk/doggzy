'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Home, RefreshCw, AlertTriangle, Heart } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error)
  }, [error])

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-2xl mx-auto text-center"
      >
        <div className="card p-12">
            {/* Error Animation */}
            <motion.div
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="mb-8"
            >
              <div className="w-20 h-20 mx-auto mb-4 bg-destructive rounded-full flex items-center justify-center text-destructive-foreground">
                <AlertTriangle className="h-10 w-10" />
              </div>
              <motion.div
                animate={{ rotate: [0, -5, 5, 0] }}
                transition={{ repeat: Infinity, duration: 3, delay: 1 }}
                className="text-4xl"
              >
                😔
              </motion.div>
            </motion.div>

            {/* Content */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <h1 className="text-display text-3xl font-bold text-foreground mb-4">
                Something went wrong!
              </h1>
              <p className="text-body text-lg text-muted-foreground mb-8 leading-relaxed">
                We&apos;re sorry, but something unexpected happened. Our team has been notified 
                and is working to fix the issue. Please try again in a moment.
              </p>

              {/* Error Details (Development Only) */}
              {process.env.NODE_ENV === 'development' && (
                <div className="mb-8 p-4 bg-destructive/10 border border-destructive/30 rounded-lg text-left">
                  <h3 className="text-sm font-semibold text-destructive mb-2">Error Details:</h3>
                  <code className="text-xs text-destructive break-all">
                    {error.message}
                  </code>
                  {error.digest && (
                    <div className="mt-2">
                      <span className="text-xs text-destructive/80">Digest: {error.digest}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                <Button 
                  size="lg" 
                  variant="glow" 
                  onClick={reset}
                  className="group"
                >
                  <RefreshCw className="h-5 w-5 mr-2 group-hover:rotate-180 transition-transform duration-500" />
                  Try Again
                </Button>
                <Link href="/">
                  <Button size="lg" variant="outline" className="group">
                    <Home className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
                    Go Home
                  </Button>
                </Link>
              </div>

              {/* Help Section */}
              <div className="border-t border-border pt-8">
                <p className="text-sm text-muted-foreground mb-4">
                  If this problem persists, please let us know:
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  <Link href="/contact">
                    <Button variant="ghost" size="sm" className="text-neon-primary hover:text-neon-primary">
                      Contact Support
                    </Button>
                  </Link>
                  <Link href="/report">
                    <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                      Report Issue
                    </Button>
                  </Link>
                  <Link href="/donate">
                    <Button variant="ghost" size="sm" className="text-neon-secondary hover:text-neon-secondary">
                      <Heart className="h-4 w-4 mr-1" />
                      Support Our Mission
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
        </div>
      </motion.div>
    </div>
  )
}
