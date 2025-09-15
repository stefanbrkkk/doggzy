'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { Heart, ShoppingBag, Menu, X, PawPrint } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useLanguage } from '@/contexts/LanguageContext'
import { LanguageSwitcher } from '@/components/language-switcher'
import { motion, AnimatePresence } from 'framer-motion'

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isMoreOpen, setIsMoreOpen] = useState(false)
  const moreRef = useRef<HTMLDivElement | null>(null)
  const { t } = useLanguage()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close More dropdown on outside click
  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (!isMoreOpen) return
      const target = e.target as Node
      if (moreRef.current && !moreRef.current.contains(target)) {
        setIsMoreOpen(false)
      }
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [isMoreOpen])

  const navItems = [
    { label: t.nav.home, href: '/' },
    { label: t.nav.donate, href: '/donate' },
    { label: t.nav.shop, href: '/shop' },
    { label: t.nav.sponsor, href: '/sponsor' },
    { label: t.nav.impact, href: '/impact' },
    { label: t.nav.partners, href: '/partners' },
    { label: t.nav.about, href: '/about' },
  ]

  const moreItems = [
    { label: t.nav.adopt, href: '/adopt' },
    { label: t.nav.foster, href: '/foster' },
    { label: t.nav.careers, href: '/careers' },
    { label: t.nav.report, href: '/report' },
  ]

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-200",
        isScrolled 
          ? "bg-background/95 backdrop-blur-md border-b border-border shadow-lg" 
          : "bg-transparent"
      )}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="relative hover:scale-110 transition-transform duration-200">
              <PawPrint className="h-8 w-8 text-orange-500 group-hover:text-red-500 transition-colors duration-200" />
            </div>
            <span className="font-display text-2xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
              Doggzy
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-2 xl:space-x-4 2xl:space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="relative group font-medium text-foreground/80 hover:text-orange-500 transition-colors duration-200 text-xs xl:text-sm 2xl:text-base whitespace-nowrap px-1"
              >
                {item.label}
                <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-orange-500 to-red-500 group-hover:w-full transition-all duration-200" />
              </Link>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2 xl:space-x-4">
            <LanguageSwitcher />

            {/* Subtle hamburger dropdown moved to actions area */}
            <div className="relative hidden lg:block" ref={moreRef}>
              <button
                className="flex items-center justify-center h-8 w-8 rounded-md hover:bg-accent/60 text-foreground/70 hover:text-foreground transition-colors"
                aria-label="More"
                onClick={() => setIsMoreOpen(!isMoreOpen)}
                onBlur={() => setTimeout(() => setIsMoreOpen(false), 150)}
              >
                <Menu className="h-5 w-5" />
              </button>
              <AnimatePresence>
                {isMoreOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -6, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -6, scale: 0.98 }}
                    transition={{ duration: 0.15, ease: 'easeOut' }}
                    className="absolute right-0 mt-2 w-56 rounded-lg border border-border bg-background/95 backdrop-blur-md shadow-xl p-2 z-50 origin-top-right"
                  >
                    {moreItems.map((item, idx) => (
                      <motion.div
                        key={item.href}
                        initial={{ opacity: 0, x: 8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.02 * idx }}
                      >
                        <Link
                          href={item.href}
                          className="block px-3 py-2 rounded-md text-sm hover:bg-accent hover:text-accent-foreground"
                          onClick={() => setIsMoreOpen(false)}
                        >
                          {item.label}
                        </Link>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            <Link href="/favorites">
              <Button variant="ghost" size="icon" className="relative hover:scale-110 transition-transform duration-200">
                <Heart className="h-4 w-4 xl:h-5 xl:w-5" />
                <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 xl:h-5 xl:w-5 flex items-center justify-center animate-pulse">
                  3
                </div>
              </Button>
            </Link>

            <Link href="/basket">
              <Button variant="ghost" size="icon" className="relative hover:scale-110 transition-transform duration-200">
                <ShoppingBag className="h-4 w-4 xl:h-5 xl:w-5" />
                <div className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full h-4 w-4 xl:h-5 xl:w-5 flex items-center justify-center animate-pulse" style={{ animationDelay: '0.5s' }}>
                  2
                </div>
              </Button>
            </Link>

            <Link href="/donate">
              <Button variant="glow" size="sm" className="hidden sm:flex hover:scale-105 transition-transform duration-200 text-xs xl:text-sm">
                <Heart className="h-3 w-3 xl:h-4 xl:w-4 mr-1 xl:mr-2" />
                {t.nav.donateNow}
              </Button>
            </Link>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden hover:scale-110 transition-transform duration-200"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={cn(
        "lg:hidden bg-background/95 backdrop-blur-md border-t border-border transition-all duration-200 overflow-hidden",
        isMobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
      )}>
        <div className="container mx-auto px-4 py-4 space-y-3">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block py-2 text-base sm:text-lg font-medium text-foreground/80 hover:text-orange-500 transition-colors duration-200 whitespace-nowrap"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          {/* More group on mobile */}
          <div className="pt-2">
            <div className="text-xs uppercase text-foreground/60 mb-2">More</div>
            {moreItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block py-2 text-base sm:text-lg font-medium text-foreground/80 hover:text-orange-500 transition-colors duration-200 whitespace-nowrap"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </div>
          <div className="pt-4 border-t border-border">
            <Link href="/donate">
              <Button variant="glow" className="w-full hover:scale-105 transition-transform duration-200 text-sm sm:text-base">
                <Heart className="h-4 w-4 mr-2" />
                {t.nav.donateNow}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}