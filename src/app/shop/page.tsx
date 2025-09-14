'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Search, Filter, ShoppingCart, Heart, Star, Truck, Shield, Leaf } from 'lucide-react'
import { ProductCard } from '@/components/shop/product-card'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

// Mock product data
const products = [
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
    id: '2',
    name: 'GPS Dog Collar Pro',
    price: 89,
    image: '/api/placeholder/400/400',
    rating: 4.7,
    reviewCount: 156,
    category: 'Technology',
    tags: ['GPS', 'Waterproof', 'Long Battery'],
    description: 'Advanced GPS tracking collar with real-time location updates and health monitoring.',
    inStock: true,
    isNew: true
  },
  {
    id: '3',
    name: 'Eco-Friendly Dog Bed',
    price: 75,
    originalPrice: 95,
    image: '/api/placeholder/400/400',
    rating: 4.8,
    reviewCount: 189,
    category: 'Furniture',
    tags: ['Recycled Materials', 'Memory Foam', 'Machine Washable'],
    description: 'Sustainable dog bed made from recycled materials with memory foam support.',
    inStock: true,
    isEcoFriendly: true
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
    id: '5',
    name: 'Smart Water Bottle',
    price: 35,
    image: '/api/placeholder/400/400',
    rating: 4.6,
    reviewCount: 98,
    category: 'Accessories',
    tags: ['Smart', 'BPA-Free', 'Portable'],
    description: 'Smart water bottle that tracks your dog\'s hydration and reminds you to refill.',
    inStock: true,
    isNew: true
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

const categories = ['All', 'Apparel', 'Technology', 'Furniture', 'Accessories', 'Food']
const sortOptions = [
  { value: 'popular', label: 'Most Popular' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'newest', label: 'Newest First' }
]

export default function ShopPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [sortBy, setSortBy] = useState('popular')
  const [cartItems, setCartItems] = useState<string[]>([])
  const [wishlistItems, setWishlistItems] = useState<string[]>([])

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(product => product.category === selectedCategory)
    }

    // Sort products
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price)
        break
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price)
        break
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating)
        break
      case 'newest':
        filtered.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0))
        break
      default: // popular
        filtered.sort((a, b) => b.reviewCount - a.reviewCount)
    }

    return filtered
  }, [searchQuery, selectedCategory, sortBy])

  const handleAddToCart = (product: typeof products[0]) => {
    setCartItems(prev => [...prev, product.id])
    // Show success message
    console.log(`Added ${product.name} to cart`)
  }

  const handleAddToWishlist = (product: typeof products[0]) => {
    setWishlistItems(prev => 
      prev.includes(product.id) 
        ? prev.filter(id => id !== product.id)
        : [...prev, product.id]
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
      {/* Header */}
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
              <ShoppingCart className="h-4 w-4 fill-orange-500 text-orange-500" />
              100% Profits Go to Rescue Dogs
            </motion.div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold leading-tight mb-6">
              <span className="bg-gradient-to-r from-gray-900 via-orange-600 to-red-600 bg-clip-text text-transparent">
                Shop to
              </span>
              <br />
              <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                Save Lives
              </span>
            </h1>
            
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
              Every purchase directly supports our rescue operations. From custom portraits to eco-friendly accessories, 
              shop with purpose and help save dogs worldwide.
            </p>
          </motion.div>

          {/* Trust Indicators */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {[
              {
                icon: Leaf,
                title: "Eco-Friendly Products",
                description: "Sustainable materials and ethical production"
              },
              {
                icon: Shield,
                title: "30-Day Guarantee",
                description: "Full money-back guarantee on all purchases"
              },
              {
                icon: Truck,
                title: "Free Shipping",
                description: "Free shipping on orders over $50"
              }
            ].map((feature, index) => (
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
        </div>
      </section>

      {/* Filters and Search */}
      <section className="py-8 bg-white/50 backdrop-blur-sm sticky top-20 z-40 border-b border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-3 rounded-xl border-gray-200 focus:border-orange-500 focus:ring-orange-500"
              />
            </div>

            {/* Category Filter */}
            <div className="flex gap-2 flex-wrap">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className={selectedCategory === category ? "bg-orange-500 hover:bg-orange-600" : ""}
                >
                  {category}
                </Button>
              ))}
            </div>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-orange-500 bg-white"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Results Count */}
          <div className="flex items-center justify-between mb-8">
            <p className="text-gray-600">
              Showing {filteredAndSortedProducts.length} of {products.length} products
            </p>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Cart:</span>
              <div className="flex items-center gap-1 bg-orange-500 text-white px-3 py-1 rounded-full text-sm">
                <ShoppingCart className="h-4 w-4" />
                {cartItems.length}
              </div>
              <div className="flex items-center gap-1 bg-red-500 text-white px-3 py-1 rounded-full text-sm">
                <Heart className="h-4 w-4" />
                {wishlistItems.length}
              </div>
            </div>
          </div>

          {/* Products */}
          {filteredAndSortedProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredAndSortedProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                >
                  <ProductCard
                    product={product}
                    onAddToCart={handleAddToCart}
                    onAddToWishlist={handleAddToWishlist}
                  />
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-600 mb-6">
                Try adjusting your search or filter criteria
              </p>
              <Button
                onClick={() => {
                  setSearchQuery('')
                  setSelectedCategory('All')
                  setSortBy('popular')
                }}
                className="bg-orange-500 hover:bg-orange-600"
              >
                Clear Filters
              </Button>
            </motion.div>
          )}
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
              Shop with Purpose
            </h2>
            <p className="text-xl mb-8 max-w-3xl mx-auto opacity-90">
              Every purchase you make helps rescue, rehabilitate, and rehome dogs in need. 
              Join thousands of compassionate shoppers making a difference.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button className="bg-white text-orange-500 px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-100 transition-colors duration-300 shadow-lg">
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Start Shopping
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button variant="outline" className="border-white text-white hover:bg-white hover:text-orange-500 px-8 py-4 rounded-full text-lg font-semibold transition-colors duration-300">
                  <Heart className="h-5 w-5 mr-2" />
                  Learn About Our Mission
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

// Input component (simple implementation)
function Input({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    />
  )
}
