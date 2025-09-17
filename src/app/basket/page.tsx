'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ShoppingCart, Heart, Plus, Minus, Trash2, ArrowLeft, CreditCard } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'

interface CartItem {
  id: string
  name: string
  price: number
  originalPrice?: number
  image: string
  quantity: number
  category: string
  inStock: boolean
}

// Mock cart data
const initialCartItems: CartItem[] = [
  {
    id: '1',
    name: 'Custom Dog Portrait Hoodie',
    price: 45,
    originalPrice: 65,
    image: '/api/placeholder/400/400',
    quantity: 1,
    category: 'Apparel',
    inStock: true
  },
  {
    id: '4',
    name: 'Rescue Dog T-Shirt',
    price: 25,
    image: '/api/placeholder/400/400',
    quantity: 2,
    category: 'Apparel',
    inStock: true
  }
]

export default function BasketPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>(initialCartItems)
  const [isProcessing, setIsProcessing] = useState(false)

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(id)
      return
    }
    setCartItems(prev => 
      prev.map(item => 
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    )
  }

  const removeItem = (id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id))
  }

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const discount = cartItems.reduce((sum, item) => {
    if (item.originalPrice) {
      return sum + ((item.originalPrice - item.price) * item.quantity)
    }
    return sum
  }, 0)
  const shipping = subtotal >= 50 ? 0 : 9.99
  const tax = subtotal * 0.08 // 8% tax
  const total = subtotal + shipping + tax

  const handleCheckout = async () => {
    setIsProcessing(true)
    // Simulate checkout process
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsProcessing(false)
    // In a real app, this would redirect to payment processor
    console.log('Checkout completed!')
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
              Your Shopping Cart
            </motion.div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold leading-tight mb-6">
              <span className="bg-gradient-to-r from-gray-900 via-orange-600 to-red-600 bg-clip-text text-transparent">
                Shopping
              </span>
              <br />
              <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                Cart
              </span>
            </h1>
            
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
              Review your items and complete your purchase to help save more dogs in need.
            </p>
          </motion.div>

          {/* Back to Shop */}
          <div className="flex justify-center mb-8">
            <Link href="/shop">
              <Button variant="outline" className="group">
                <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Cart Content */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {cartItems.length > 0 ? (
            <div className="grid lg:grid-cols-3 gap-12">
              {/* Cart Items */}
              <div className="lg:col-span-2">
                <div className="space-y-6">
                  {cartItems.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.5 }}
                    >
                      <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/90 backdrop-blur-sm">
                        <CardContent className="p-6">
                          <div className="flex items-center gap-6">
                            {/* Product Image */}
                            <div className="w-24 h-24 bg-gradient-to-br from-orange-100 to-red-100 rounded-lg flex items-center justify-center text-3xl">
                              🐕
                            </div>

                            {/* Product Details */}
                            <div className="flex-1">
                              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                {item.name}
                              </h3>
                              <div className="flex items-center gap-2 mb-2">
                                <Badge variant="secondary" className="text-xs">
                                  {item.category}
                                </Badge>
                                {item.inStock ? (
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
                              
                              {/* Price */}
                              <div className="flex items-center gap-2">
                                <span className="text-xl font-bold text-orange-600">
                                  ${item.price}
                                </span>
                                {item.originalPrice && (
                                  <span className="text-lg text-gray-500 line-through">
                                    ${item.originalPrice}
                                  </span>
                                )}
                                {item.originalPrice && (
                                  <Badge className="bg-red-500 text-white border-0">
                                    -{Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)}%
                                  </Badge>
                                )}
                              </div>
                            </div>

                            {/* Quantity Controls */}
                            <div className="flex items-center gap-3">
                              <div className="flex items-center gap-2 border border-gray-200 rounded-lg">
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="w-8 h-8"
                                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                >
                                  <Minus className="h-4 w-4" />
                                </Button>
                                <span className="w-8 text-center font-semibold">
                                  {item.quantity}
                                </span>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="w-8 h-8"
                                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                >
                                  <Plus className="h-4 w-4" />
                                </Button>
                              </div>

                              {/* Remove Button */}
                              <Button
                                size="icon"
                                variant="ghost"
                                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                onClick={() => removeItem(item.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                >
                  <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm sticky top-24">
                    <CardContent className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h3>
                      
                      <div className="space-y-4 mb-6">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Subtotal</span>
                          <span className="font-semibold">${subtotal.toFixed(2)}</span>
                        </div>
                        
                        {discount > 0 && (
                          <div className="flex justify-between text-green-600">
                            <span>Discount</span>
                            <span>-${discount.toFixed(2)}</span>
                          </div>
                        )}
                        
                        <div className="flex justify-between">
                          <span className="text-gray-600">Shipping</span>
                          <span className="font-semibold">
                            {shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}
                          </span>
                        </div>
                        
                        <div className="flex justify-between">
                          <span className="text-gray-600">Tax</span>
                          <span className="font-semibold">${tax.toFixed(2)}</span>
                        </div>
                        
                        <div className="border-t border-gray-200 pt-4">
                          <div className="flex justify-between text-lg font-bold">
                            <span>Total</span>
                            <span>${total.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>

                      {shipping > 0 && (
                        <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-6">
                          <p className="text-sm text-orange-800">
                            Add ${(50 - subtotal).toFixed(2)} more for free shipping!
                          </p>
                        </div>
                      )}

                      <Button
                        className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white py-4 text-lg font-semibold"
                        onClick={handleCheckout}
                        disabled={isProcessing || cartItems.some(item => !item.inStock)}
                      >
                        {isProcessing ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                            Processing...
                          </>
                        ) : (
                          <>
                            <CreditCard className="h-5 w-5 mr-2" />
                            Proceed to Checkout
                          </>
                        )}
                      </Button>

                      <div className="mt-4 text-center">
                        <p className="text-sm text-gray-600">
                          <Heart className="h-4 w-4 inline mr-1" />
                          100% of profits go to rescue dogs
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <div className="text-6xl mb-4">🛒</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h3>
              <p className="text-gray-600 mb-6">
                Start adding items to your cart to help save dogs in need
              </p>
              <Link href="/shop">
                <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white">
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Start Shopping
                </Button>
              </Link>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  )
}
