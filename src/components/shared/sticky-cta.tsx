'use client'

import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface StickyCTAProps {
  actions: { label: string; onClick: () => void; variant?: 'primary' | 'secondary' }[]
}

export function StickyCTA({ actions }: StickyCTAProps) {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 320)
    onScroll()
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed bottom-4 left-0 right-0 z-40"
          initial={{ y: 64, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 64, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 24 }}
        >
          <div className="mx-auto max-w-3xl rounded-full bg-white/90 backdrop-blur-md shadow-lg border border-border px-3 py-2 flex items-center justify-center gap-3">
            {actions.map((a) => (
              <button
                key={a.label}
                onClick={a.onClick}
                className={
                  a.variant === 'secondary'
                    ? 'px-4 py-2 rounded-full border border-orange-300 text-orange-700 hover:bg-orange-50'
                    : 'px-4 py-2 rounded-full bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600'
                }
              >
                {a.label}
              </button>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}


