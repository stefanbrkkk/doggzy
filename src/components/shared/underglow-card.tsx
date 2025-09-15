'use client'

import React from 'react'
import { motion } from 'framer-motion'

export function UnderglowCard({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="relative rounded-2xl bg-white/90 backdrop-blur-sm border border-gray-200 shadow-md hover:shadow-xl transition-shadow"
    >
      <div className="absolute inset-x-4 -bottom-2 h-4 rounded-full bg-gradient-to-r from-orange-400/40 to-red-400/40 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="p-6">
        {children}
      </div>
    </motion.div>
  )
}


