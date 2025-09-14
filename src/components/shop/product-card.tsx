'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Heart, ShoppingCart, Star, Eye, Truck, Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface Product {
  id: string
  name: string
  price: number
  originalPrice?: number
  image: string
  rating: number
  reviewCount: number
  category: string
  tags: string[]
  description: string
  inStock: boolean
  isEcoFriendly?: boolean
  isBestSeller?: boolean
  isNew?: boolean
}

interface ProductCardProps {
  product: Product
  onAddToCart: (product: Product) => void
  onAddToWishlist: (product: Product) => void
}

export function ProductCard({ product, onAddToCart, onAddToWishlist }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)

  const discountPercentage = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -10 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group"
    >
      <Card className="border-0 shadow-lg hover:shadow-2xl dark:hover:shadow-white/10 transition-all duration-300 overflow-hidden bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm group">
        {/* Product Image */}
        <div className="relative overflow-hidden">
          <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 dark:from-slate-700 dark:to-slate-600 flex items-center justify-center">
            {!imageLoaded && (
              <div className="w-16 h-16 bg-gradient-to-br from-orange-200 to-red-200 rounded-full animate-pulse" />
            )}
            <motion.div
              className={cn(
                "w-full h-full bg-gradient-to-br from-orange-100 to-red-100 flex items-center justify-center text-6xl",
                imageLoaded ? "opacity-100" : "opacity-0"
              )}
              animate={{ scale: isHovered ? 1.1 : 1 }}
              transition={{ duration: 0.3 }}
              onAnimationComplete={() => setImageLoaded(true)}
            >
              🐕
            </motion.div>
          </div>

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {product.isNew && (
              <Badge className="bg-green-500 text-white border-0">
                New
              </Badge>
            )}
            {product.isBestSeller && (
              <Badge className="bg-yellow-500 text-white border-0">
                Best Seller
              </Badge>
            )}
            {product.isEcoFriendly && (
              <Badge className="bg-emerald-500 text-white border-0">
                Eco-Friendly
              </Badge>
            )}
            {discountPercentage > 0 && (
              <Badge className="bg-red-500 text-white border-0">
                -{discountPercentage}%
              </Badge>
            )}
          </div>

          {/* Quick Actions */}
          <motion.div
            className="absolute top-3 right-3 flex flex-col gap-2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ 
              opacity: isHovered ? 1 : 0, 
              x: isHovered ? 0 : 20 
            }}
            transition={{ duration: 0.3 }}
          >
            <Button
              size="icon"
              variant="secondary"
              className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white shadow-lg"
              onClick={() => onAddToWishlist(product)}
            >
              <Heart className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="secondary"
              className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white shadow-lg"
            >
              <Eye className="h-4 w-4" />
            </Button>
          </motion.div>

          {/* Category Tag */}
          <div className="absolute bottom-3 left-3">
            <Badge variant="secondary" className="bg-white/90 text-gray-700">
              {product.category}
            </Badge>
          </div>
        </div>

        <CardContent className="p-6">
          {/* Rating */}
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    "h-4 w-4",
                    i < Math.floor(product.rating)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                  )}
                />
              ))}
            </div>
            <span className="text-sm text-gray-600 dark:text-gray-300">
              ({product.reviewCount})
            </span>
          </div>

          {/* Product Name */}
          <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-orange-600 dark:text-white transition-colors">
            {product.name}
          </h3>

          {/* Description */}
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
            {product.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1 mb-4">
            {product.tags.slice(0, 2).map((tag) => (
              <Badge
                key={tag}
                variant="outline"
                className="text-xs border-gray-200 dark:border-slate-600 text-gray-600 dark:text-gray-300"
              >
                {tag}
              </Badge>
            ))}
          </div>

          {/* Price */}
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl font-bold text-orange-600 dark:text-orange-400">
              ${product.price}
            </span>
            {product.originalPrice && (
              <span className="text-lg text-gray-500 dark:text-gray-400 line-through">
                ${product.originalPrice}
              </span>
            )}
          </div>

          {/* Stock Status */}
          <div className="flex items-center gap-2 mb-4">
            {product.inStock ? (
              <div className="flex items-center gap-1 text-green-600 text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                In Stock
              </div>
            ) : (
              <div className="flex items-center gap-1 text-red-600 text-sm">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                Out of Stock
              </div>
            )}
          </div>
        </CardContent>

        <CardFooter className="p-6 pt-0">
          <Button
            className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
            disabled={!product.inStock}
            onClick={() => onAddToCart(product)}
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            {product.inStock ? 'Add to Cart' : 'Out of Stock'}
          </Button>
        </CardFooter>

        {/* Hover Overlay */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          initial={false}
          animate={{ opacity: isHovered ? 1 : 0 }}
        />

        {/* Shipping Info */}
        <motion.div
          className="absolute bottom-20 left-6 right-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ 
            opacity: isHovered ? 1 : 0, 
            y: isHovered ? 0 : 20 
          }}
          transition={{ duration: 0.3 }}
        >
          <div className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm rounded-lg p-3 shadow-lg">
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
              <Truck className="h-4 w-4 text-green-500" />
              <span>Free shipping on orders over $50</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 mt-1">
              <Shield className="h-4 w-4 text-blue-500" />
              <span>30-day money-back guarantee</span>
            </div>
          </div>
        </motion.div>
      </Card>
    </motion.div>
  )
}

