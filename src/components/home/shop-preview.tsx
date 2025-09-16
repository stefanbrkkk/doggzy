'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { products } from '@/components/shop/products.data'
import { ShoppingCart } from 'lucide-react'
import Link from 'next/link'

export function ShopPreview() {
  const items = products.slice(0, 8)
  return (
    <section className="py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-display font-bold">Featured Shop</h2>
          <Link href="/shop" className="text-orange-600 hover:text-red-600 flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" /> Visit Shop
          </Link>
        </div>
        <div className="relative overflow-hidden">
          <motion.div
            className="flex gap-6"
            initial={{ x: 0 }}
            animate={{ x: ['0%', '-50%'] }}
            transition={{ duration: 20, ease: 'linear', repeat: Infinity }}
          >
            {[...items, ...items].map((p) => (
              <div key={`${p.id}-${Math.random()}`} className="min-w-[220px] max-w-[220px] rounded-2xl bg-white/90 backdrop-blur-sm border border-gray-200 shadow-md p-4">
                <div className="aspect-square rounded-xl bg-gradient-to-br from-orange-100 to-red-100 mb-3" />
                <div className="font-semibold text-gray-900 truncate">{p.name}</div>
                <div className="text-orange-600 font-bold">${p.price}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}


