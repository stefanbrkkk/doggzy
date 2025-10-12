'use client'

import { useState, useRef, useEffect, ReactNode } from 'react'
import { motion } from 'framer-motion'

interface LazySectionProps {
  children: ReactNode
  className?: string
  threshold?: number
  rootMargin?: string
  triggerOnce?: boolean
  fallback?: ReactNode
  delay?: number
}

export function LazySection({
  children,
  className,
  threshold = 0.1,
  rootMargin = '50px',
  triggerOnce = true,
  fallback,
  delay = 0
}: LazySectionProps) {
  const [isInView, setIsInView] = useState(false)
  const [hasTriggered, setHasTriggered] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            setIsInView(true)
            if (triggerOnce) {
              setHasTriggered(true)
              observer.disconnect()
            }
          }, delay)
        } else if (!triggerOnce && !hasTriggered) {
          setIsInView(false)
        }
      },
      {
        threshold,
        rootMargin
      }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [threshold, rootMargin, triggerOnce, hasTriggered, delay])

  return (
    <div ref={sectionRef} className={className}>
      {isInView ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          {children}
        </motion.div>
      ) : (
        fallback || <SectionSkeleton />
      )}
    </div>
  )
}

// Default skeleton for sections
function SectionSkeleton() {
  return (
    <div className="animate-pulse space-y-4 py-8">
      <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="space-y-3">
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Lazy loading hook for custom components
export function useInView(options?: {
  threshold?: number
  rootMargin?: string
  triggerOnce?: boolean
}) {
  const [isInView, setIsInView] = useState(false)
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          if (options?.triggerOnce) {
            observer.disconnect()
          }
        } else if (!options?.triggerOnce) {
          setIsInView(false)
        }
      },
      {
        threshold: options?.threshold || 0.1,
        rootMargin: options?.rootMargin || '50px'
      }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [options])

  return { ref, isInView }
}
