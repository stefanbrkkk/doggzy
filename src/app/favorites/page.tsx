'use client'

import { useState, useEffect } from 'react'
import { Heart, ShoppingCart, Star, Eye, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import Link from 'next/link'

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

// Mock favorite products data
const favoriteProducts: Product[] = [
  {
    id: '1',
    name: 'Custom Dog Portrait Hoodie',
    price: 45,
    originalPrice: 65,
    image: '/api/placeholder/400/400',
    rating: 4.9,
    reviewCount: 234,
    category: 'Apparel',
    tags: ['Custom', 'Organic Cotton', 'Personalized'],
    description: 'High-quality hoodie with your dog\'s portrait printed on it. Made from organic cotton.',
    inStock: true,
    isEcoFriendly: true,
    isBestSeller: true
  },
  {
    id: '4',
    name: 'Rescue Dog T-Shirt',
    price: 25,
    image: '/api/placeholder/400/400',
    rating: 4.9,
    reviewCount: 445,
    category: 'Apparel',
    tags: ['Cause', 'Comfortable', 'Unisex'],
    description: 'Show your support for rescue dogs with this comfortable, cause-driven t-shirt.',
    inStock: true,
    isBestSeller: true
  },
  {
    id: '6',
    name: 'Organic Dog Treats Pack',
    price: 18,
    image: '/api/placeholder/400/400',
    rating: 4.9,
    reviewCount: 567,
    category: 'Food',
    tags: ['Organic', 'Grain-Free', 'Healthy'],
    description: 'Premium organic dog treats made with natural ingredients and no artificial preservatives.',
    inStock: true,
    isEcoFriendly: true,
    isBestSeller: true
  }
]

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<Product[]>(favoriteProducts)
  const [cartItems, setCartItems] = useState<string[]>([])

  const handleAddToCart = (product: Product) => {
    setCartItems(prev => [...prev, product.id])
    console.log(`Added ${product.name} to cart`)
  }

  const handleRemoveFromFavorites = (productId: string) => {
    setFavorites(prev => prev.filter(p => p.id !== productId))
  }

  const handleAddToWishlist = (product: Product) => {
    // This would toggle the product in/out of favorites
    handleRemoveFromFavorites(product.id)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
      {/* Header */}
      <section className="relative py-20 overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-red-100 to-pink-100 text-red-800 px-4 py-2 rounded-full text-sm font-medium mb-6 hover:scale-105 transition-transform duration-200">
              <Heart className="h-4 w-4 fill-red-500 text-red-500" />
              Your Favorite Items
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold leading-tight mb-6">
              <span className="bg-gradient-to-r from-gray-900 via-red-600 to-pink-600 bg-clip-text text-transparent">
                My
              </span>
              <br />
              <span className="bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent">
                Favorites
              </span>
            </h1>
            
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
              Your saved items that support our rescue mission. 
              Every purchase helps save more dogs in need.
            </p>
          </div>

          {/* Back to Shop */}
          <div className="flex justify-center mb-8">
            <Link href="/shop">
              <Button variant="outline" className="group hover:scale-105 transition-transform duration-200">
                <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
                Back to Shop
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Favorites Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {favorites.length > 0 ? (
            <>
              {/* Results Count */}
              <div className="flex items-center justify-between mb-8">
                <p className="text-gray-600">
                  {favorites.length} favorite item{favorites.length !== 1 ? 's' : ''}
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Cart:</span>
                  <div className="flex items-center gap-1 bg-orange-500 text-white px-3 py-1 rounded-full text-sm">
                    <ShoppingCart className="h-4 w-4" />
                    {cartItems.length}
                  </div>
                </div>
              </div>

              {/* Products */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {favorites.map((product, index) => (
                  <div
                    key={product.id}
                    className="group hover:scale-105 transition-transform duration-200"
                  >
                    <Card className="border-0 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden bg-white/90 backdrop-blur-sm">
                      {/* Product Image */}
                      <div className="relative overflow-hidden">
                        <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                          <div className="w-full h-full bg-gradient-to-br from-red-100 to-pink-100 flex items-center justify-center text-6xl">
                            🐕
                          </div>
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
                        </div>

                        {/* Quick Actions */}
                        <div className="absolute top-3 right-3 flex flex-col gap-2">
                          <Button
                            size="icon"
                            variant="secondary"
                            className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white shadow-lg"
                            onClick={() => handleAddToWishlist(product)}
                          >
                            <Heart className="h-4 w-4 fill-red-500 text-red-500" />
                          </Button>
                          <Button
                            size="icon"
                            variant="secondary"
                            className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white shadow-lg"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>

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
                          <span className="text-sm text-gray-600">
                            ({product.reviewCount})
                          </span>
                        </div>

                        {/* Product Name */}
                        <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-red-600 transition-colors">
                          {product.name}
                        </h3>

                        {/* Description */}
                        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                          {product.description}
                        </p>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-1 mb-4">
                          {product.tags.slice(0, 2).map((tag) => (
                            <Badge
                              key={tag}
                              variant="outline"
                              className="text-xs border-gray-200 text-gray-600"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>

                        {/* Price */}
                        <div className="flex items-center gap-2 mb-4">
                          <span className="text-2xl font-bold text-red-600">
                            ${product.price}
                          </span>
                          {product.originalPrice && (
                            <span className="text-lg text-gray-500 line-through">
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
                        <div className="flex gap-2 w-full">
                          <Button
                            className="flex-1 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white"
                            disabled={!product.inStock}
                            onClick={() => handleAddToCart(product)}
                          >
                            <ShoppingCart className="h-4 w-4 mr-2" />
                            Add to Cart
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => handleRemoveFromFavorites(product.id)}
                            className="px-3"
                          >
                            <Heart className="h-4 w-4 fill-red-500 text-red-500" />
                          </Button>
                        </div>
                      </CardFooter>
                    </Card>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">💔</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">No favorites yet</h3>
              <p className="text-gray-600 mb-6">
                Start adding items to your favorites by browsing our shop
              </p>
              <Link href="/shop">
                <Button className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white">
                  <Heart className="h-4 w-4 mr-2" />
                  Start Shopping
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
