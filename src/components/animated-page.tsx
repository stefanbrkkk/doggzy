'use client'

import React from 'react'
import { motion } from 'framer-motion'

interface AnimatedPageProps {
  children: React.ReactNode
}

export function AnimatedPage({ children }: AnimatedPageProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {children}
    </motion.div>
  )
}


