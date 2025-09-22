'use client'

import React, { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

type Media = { type: 'image' | 'video'; src: string; poster?: string; caption?: string }

interface MediaLightboxProps {
  open: boolean
  media?: Media
  onClose: () => void
}

export function MediaLightbox({ open, media, onClose }: MediaLightboxProps) {
  const previousActiveElement = useRef<Element | null>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (open) {
      // Store the currently focused element
      previousActiveElement.current = document.activeElement
      // Focus the close button when modal opens
      setTimeout(() => closeButtonRef.current?.focus(), 100)
    } else {
      // Restore focus to the previously focused element
      if (previousActiveElement.current) {
        (previousActiveElement.current as HTMLElement).focus()
      }
    }
  }, [open])

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
          role="dialog"
          aria-modal="true"
          aria-label={media.caption || `${media.type} viewer`}
        >
          <motion.div
            className="relative max-w-5xl w-full mx-4"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 240, damping: 20 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              ref={closeButtonRef}
              onClick={onClose}
              className="absolute -top-12 right-0 z-10 w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-colors duration-200"
              aria-label="Close viewer"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="relative w-full bg-black rounded-xl overflow-hidden">
              {media.type === 'image' ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img 
                  src={media.src} 
                  alt={media.caption || 'Lightbox image'} 
                  className="w-full h-auto" 
                />
              ) : (
                <video 
                  className="w-full h-auto" 
                  controls 
                  autoPlay 
                  poster={media.poster}
                  aria-label={media.caption || 'Lightbox video'}
                >
                  <source src={media.src} />
                  Your browser does not support the video tag.
                </video>
              )}
            </div>
            {media.caption && (
              <div className="mt-3 text-sm text-white/90" role="caption">
                {media.caption}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}


