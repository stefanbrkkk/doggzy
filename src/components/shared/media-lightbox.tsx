'use client'

import React, { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

type Media = { type: 'image' | 'video'; src: string; poster?: string; caption?: string }

interface MediaLightboxProps {
  open: boolean
  media?: Media
  onClose: () => void
}

export function MediaLightbox({ open, media, onClose }: MediaLightboxProps) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    if (open) document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && media && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="relative max-w-5xl w-full mx-4"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 240, damping: 20 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full bg-black rounded-xl overflow-hidden">
              {media.type === 'image' ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={media.src} alt={media.caption || ''} className="w-full h-auto" />
              ) : (
                <video className="w-full h-auto" controls autoPlay poster={media.poster}>
                  <source src={media.src} />
                </video>
              )}
            </div>
            {media.caption && (
              <div className="mt-3 text-sm text-white/90">{media.caption}</div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}


