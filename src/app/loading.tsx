import { Heart } from 'lucide-react'

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-red-50">
      <div className="text-center">
        <div className="relative">
          <Heart className="h-12 w-12 text-orange-500 mx-auto mb-4 animate-pulse" />
          <div className="absolute inset-0 h-12 w-12 mx-auto rounded-full border-2 border-orange-200 border-t-orange-500 animate-spin" />
        </div>
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Loading...</h2>
        <p className="text-gray-600 text-sm">Preparing something special for you</p>
      </div>
    </div>
  )
}