import Link from 'next/link'
import { Heart, Home, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export const dynamic = 'force-dynamic'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-red-50 p-4">
      <Card className="w-full max-w-md text-center">
        <CardContent className="p-8">
          <div className="mb-6">
            <Heart className="h-16 w-16 text-orange-500 mx-auto mb-4" />
            <h1 className="text-6xl font-bold text-gray-900 mb-2">404</h1>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Page Not Found</h2>
            <p className="text-gray-600 mb-8">
              Oops! It looks like this page has wandered off like a lost puppy. 
              Let&apos;s get you back to safety.
            </p>
          </div>
          
          <div className="space-y-3">
            <Link href="/" passHref>
              <Button className="w-full gap-2">
                <Home className="h-4 w-4" />
                Go Home
              </Button>
            </Link>
            
            <Link href="/" passHref>
              <Button 
                variant="outline" 
                className="w-full gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Go Back
              </Button>
            </Link>
          </div>
          
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500 mb-4">
              Need help? Here are some popular pages:
            </p>
            <div className="space-y-2">
              <Link href="/adopt" className="block text-sm text-orange-600 hover:text-orange-700">
                Adopt a Dog
              </Link>
              <Link href="/donate" className="block text-sm text-orange-600 hover:text-orange-700">
                Make a Donation
              </Link>
              <Link href="/contact" className="block text-sm text-orange-600 hover:text-orange-700">
                Contact Us
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}