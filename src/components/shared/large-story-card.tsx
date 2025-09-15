'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'

type Media = {
  type: 'image' | 'video'
  src: string
  poster?: string
  caption?: string
}

interface LargeStoryCardProps {
  title: string
  subtitle?: string
  quote?: string
  badges?: string[]
  media: Media
  primaryCta?: { label: string; onClick: () => void }
  secondaryCta?: { label: string; onClick: () => void }
  onOpenLightbox?: (media: Media) => void
}

const itemVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } }
}

export function LargeStoryCard({ title, subtitle, quote, badges = [], media, primaryCta, secondaryCta, onOpenLightbox }: LargeStoryCardProps) {
  const [isHover, setIsHover] = useState(false)

  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-2 gap-0 overflow-hidden rounded-2xl bg-white/90 backdrop-blur-sm shadow-lg"
      variants={itemVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ y: -6, scale: 1.01 }}
      onHoverStart={() => setIsHover(true)}
      onHoverEnd={() => setIsHover(false)}
    >
      {/* Media */}
      <div className="relative h-64 md:h-full min-h-[16rem] cursor-pointer" onClick={() => onOpenLightbox && onOpenLightbox(media)}>
        {media.type === 'image' ? (
          <Image src={media.src} alt={media.caption || title} fill className="object-cover" />
        ) : (
          <motion.video
            className="absolute inset-0 h-full w-full object-cover"
            muted
            playsInline
            controls={false}
            poster={media.poster}
            autoPlay={false}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <source src={media.src} />
          </motion.video>
        )}
        <motion.div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent"
          initial={{ opacity: 0.6 }}
          animate={{ opacity: isHover ? 0.8 : 0.6 }}
          transition={{ duration: 0.2 }}
        />
      </div>

      {/* Content */}
      <div className="p-6 md:p-8">
        <div className="space-x-2 mb-3">
          {badges.map((b) => (
            <span key={b} className="inline-block text-xs px-2 py-1 rounded-full bg-orange-100 text-orange-800">{b}</span>
          ))}
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-1">{title}</h3>
        {subtitle && <p className="text-sm text-gray-600 mb-3">{subtitle}</p>}
        {quote && <p className="text-gray-800 mb-4">“{quote}”</p>}
        <div className="flex flex-wrap gap-3">
          {primaryCta && (
            <Button onClick={primaryCta.onClick} variant="glow">{primaryCta.label}</Button>
          )}
          {secondaryCta && (
            <Button onClick={secondaryCta.onClick} variant="outline">{secondaryCta.label}</Button>
          )}
        </div>
      </div>
    </motion.div>
  )
}


