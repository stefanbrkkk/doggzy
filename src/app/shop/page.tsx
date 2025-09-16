'use client'

import React, { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Search, Filter, ShoppingCart, Heart, Star, Truck, Shield, Leaf } from 'lucide-react'
import { ProductCard } from '@/components/shop/product-card'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useLanguage } from '@/contexts/LanguageContext'

import { products } from '@/components/shop/products.data'
import { track } from '@/lib/analytics'

const categories = ['All', 'Apparel', 'Technology', 'Furniture', 'Accessories', 'Food', 'Travel', 'Toys', 'Grooming']

export default function ShopPage() {
  const { t } = useLanguage()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [sortBy, setSortBy] = useState('popular')
  const [cartItems, setCartItems] = useState<string[]>([])
  const [wishlistItems, setWishlistItems] = useState<string[]>([])
  const [quickViewProduct, setQuickViewProduct] = useState<typeof products[0] | null>(null)
  const [loading, setLoading] = useState(false)
  const [ecoOnly, setEcoOnly] = useState(false)
  const [bestOnly, setBestOnly] = useState(false)
  const [inStockOnly, setInStockOnly] = useState(false)
  // Simulate brief loading on filter/sort/search changes for skeletons
  React.useEffect(() => {
    setLoading(true)
    const id = setTimeout(() => setLoading(false), 250)
    return () => clearTimeout(id)
  }, [searchQuery, selectedCategory, sortBy, ecoOnly, bestOnly, inStockOnly])

  const sortOptions = [
    { value: 'popular', label: t.shop.filters.sortPopular },
    { value: 'price-low', label: t.shop.filters.sortPriceLow },
    { value: 'price-high', label: t.shop.filters.sortPriceHigh },
    { value: 'rating', label: t.shop.filters.sortRating },
    { value: 'newest', label: t.shop.filters.sortNewest }
  ]

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

    // Additional toggles
    if (ecoOnly) filtered = filtered.filter(p => p.isEcoFriendly)
    if (bestOnly) filtered = filtered.filter(p => p.isBestSeller)
    if (inStockOnly) filtered = filtered.filter(p => p.inStock)

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
    track('add_to_cart', { id: product.id, name: product.name, price: product.price })
  }

  const handleAddToWishlist = (product: typeof products[0]) => {
    setWishlistItems(prev => 
      prev.includes(product.id) 
        ? prev.filter(id => id !== product.id)
        : [...prev, product.id]
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
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
              {t.shop.hero.badge}
            </motion.div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold leading-tight mb-6">
              <span className="bg-gradient-to-r from-gray-900 via-orange-600 to-red-600 bg-clip-text text-transparent">
                {t.shop.hero.title}
              </span>
              <br />
              <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                {t.shop.hero.titleHighlight}
              </span>
            </h1>
            
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-200 max-w-3xl mx-auto">
              {t.shop.hero.subtitle}
            </p>
          </motion.div>

          {/* Trust Indicators */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {[
              {
                icon: Leaf,
                title: t.shop.features.ecoFriendly,
                description: t.shop.features.ecoFriendlyDesc
              },
              {
                icon: Shield,
                title: "30-Day Guarantee",
                description: "Full money-back guarantee on all purchases"
              },
              {
                icon: Truck,
                title: t.shop.features.freeShipping,
                description: t.shop.features.freeShippingDesc
              }
            ].map((feature, index) => (
              <div
                key={feature.title}
                className="hover:transform hover:-translate-y-1 transition-transform duration-200"
              >
                <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm">
                  <CardContent className="p-6 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 text-white mb-4 hover:scale-110 transition-transform duration-200">
                      {React.createElement(feature.icon, { className: "h-8 w-8" })}
                    </div>
                    <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </div>
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
                placeholder={t.shop.filters.searchPlaceholder}
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
          {/* Toggles */}
          <div className="mt-4 flex gap-2 flex-wrap">
            <Button variant={ecoOnly ? 'default' : 'outline'} size="sm" className={ecoOnly ? 'bg-emerald-500 hover:bg-emerald-600' : ''} onClick={() => setEcoOnly(v => !v)}>Eco-Friendly</Button>
            <Button variant={bestOnly ? 'default' : 'outline'} size="sm" className={bestOnly ? 'bg-yellow-500 hover:bg-yellow-600' : ''} onClick={() => setBestOnly(v => !v)}>Best Seller</Button>
            <Button variant={inStockOnly ? 'default' : 'outline'} size="sm" className={inStockOnly ? 'bg-blue-500 hover:bg-blue-600' : ''} onClick={() => setInStockOnly(v => !v)}>In Stock</Button>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Results Count */}
          <div className="flex items-center justify-between mb-8">
            <p className="text-gray-600 dark:text-gray-300">
              {t.shop.filters.showingResults.replace('{count}', filteredAndSortedProducts.length.toString()).replace('{total}', products.length.toString())}
            </p>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 dark:text-gray-300">Cart:</span>
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
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="rounded-2xl overflow-hidden shadow-sm border border-gray-200 bg-white">
                  <div className="animate-pulse">
                    <div className="aspect-square bg-gray-200" />
                    <div className="p-4 space-y-3">
                      <div className="h-4 bg-gray-200 rounded w-3/4" />
                      <div className="h-3 bg-gray-100 rounded w-full" />
                      <div className="h-3 bg-gray-100 rounded w-5/6" />
                      <div className="h-5 bg-gray-200 rounded w-1/3" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredAndSortedProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredAndSortedProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.08, duration: 0.45 }}
                >
                  <ProductCard
                    product={product}
                    onAddToCart={handleAddToCart}
                    onAddToWishlist={handleAddToWishlist}
                    onQuickView={(p) => setQuickViewProduct(p)}
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
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{t.shop.filters.noProductsFound}</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                {t.shop.filters.tryAdjustingSearch}
              </p>
              <Button
                onClick={() => {
                  setSearchQuery('')
                  setSelectedCategory('All')
                  setSortBy('popular')
                  track('shop_clear_filters')
                }}
                className="bg-orange-500 hover:bg-orange-600"
              >
                {t.shop.filters.clearFilters}
              </Button>
            </motion.div>
          )}
        </div>
      </section>

      {/* Quick View Side-Sheet */}
      {quickViewProduct && (
        <motion.div
          className="fixed inset-0 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-black/40" onClick={() => setQuickViewProduct(null)} />
          <motion.div
            className="absolute right-0 top-0 h-full w-full sm:w-[420px] bg-white dark:bg-slate-900 shadow-2xl p-6 overflow-y-auto"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 260, damping: 28 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">{quickViewProduct.name}</h3>
              <button onClick={() => setQuickViewProduct(null)} className="text-gray-500 hover:text-gray-900">✕</button>
            </div>
            <div className="aspect-square rounded-xl bg-gradient-to-br from-orange-100 to-red-100 mb-4" />
            <p className="text-gray-700 dark:text-gray-300 mb-4">{quickViewProduct.description}</p>
            <div className="flex items-center gap-2 mb-6">
              <span className="text-2xl font-bold text-orange-600">${quickViewProduct.price}</span>
              {quickViewProduct.originalPrice && (
                <span className="text-lg text-gray-500 line-through">${quickViewProduct.originalPrice}</span>
              )}
            </div>
            <div className="grid grid-cols-2 gap-2 mb-6">
              {quickViewProduct.tags.map(tag => (
                <span key={tag} className="text-xs px-2 py-1 rounded-md bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300">{tag}</span>
              ))}
            </div>
            <div className="flex gap-3">
              <Button className="bg-gradient-to-r from-orange-500 to-red-500 text-white" onClick={() => { handleAddToCart(quickViewProduct); setQuickViewProduct(null) }}>
                <ShoppingCart className="h-4 w-4 mr-2" /> Add to Cart
              </Button>
              <Button variant="outline" onClick={() => setQuickViewProduct(null)}>Close</Button>
            </div>
          </motion.div>
        </motion.div>
      )}

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
                <Button 
                  onClick={() => {
                    const productsSection = document.querySelector('section:nth-of-type(3)')
                    if (productsSection) {
                      productsSection.scrollIntoView({ behavior: 'smooth' })
                    }
                  }}
                  className="bg-white text-orange-500 px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-100 transition-colors duration-300 shadow-lg"
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Start Shopping
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  variant="outline" 
                  onClick={() => window.location.href = '/about'}
                  className="border-white text-white hover:bg-white hover:text-orange-500 px-8 py-4 rounded-full text-lg font-semibold transition-colors duration-300"
                >
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

