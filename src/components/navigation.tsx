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

    if (isMoreOpen) {
      document.addEventListener('mousedown', onClickOutside)
      return () => document.removeEventListener('mousedown', onClickOutside)
    }
  }, [isMoreOpen])

  // Handle Escape key for both menus
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        if (isMoreOpen) setIsMoreOpen(false)
        if (isMobileMenuOpen) setIsMobileMenuOpen(false)
      }
    }

    if (isMoreOpen || isMobileMenuOpen) {
      document.addEventListener('keydown', onKeyDown)
      return () => document.removeEventListener('keydown', onKeyDown)
    }
  }, [isMoreOpen, isMobileMenuOpen])

  const navItems = [
    { label: t.nav.home, href: '/' },
    { label: t.nav.donate, href: '/donate' },
    { label: t.nav.shop, href: '/shop' },
    { label: t.nav.about, href: '/about' },
    { label: t.nav.contact, href: '/contact' },
  ]

  const moreItems = [
    { label: 'Privatnost', href: '/privacy' },
    { label: 'Uslovi korišćenja', href: '/terms' },
    { label: 'Pristupačnost', href: '/accessibility' },
  ]

  return (
    <>
      {/* Skip to main content link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-[60] bg-primary text-primary-foreground px-4 py-2 rounded-md font-medium"
      >
        Skip to main content
      </a>
      
      <nav
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          isScrolled 
            ? "glass-intense backdrop-blur-2xl border-b border-white/10 shadow-glass-xl" 
            : "bg-transparent"
        )}
        role="navigation"
        aria-label="Main navigation"
      >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative micro-bounce micro-glow animate-float">
              <PawPrint className="h-9 w-9 text-orange-500 group-hover:text-red-500 transition-all duration-300 drop-shadow-lg" />
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-full blur-lg group-hover:blur-xl transition-all duration-300"></div>
            </div>
            <span className="font-display text-2xl lg:text-3xl font-bold bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 bg-clip-text text-transparent animate-gradient-shift">
              Doggzy
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-2 xl:space-x-4 2xl:space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="relative group font-medium text-foreground/80 hover:text-orange-500 transition-all duration-300 text-sm xl:text-base whitespace-nowrap px-3 py-2 rounded-xl micro-float focus-ring backdrop-blur-sm hover:bg-white/5"
              >
                {item.label}
                <div className="absolute -bottom-1 left-1/2 w-0 h-0.5 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 group-hover:w-3/4 group-hover:left-1/8 transition-all duration-300 rounded-full" />
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500/0 via-red-500/0 to-pink-500/0 group-hover:from-orange-500/10 group-hover:via-red-500/10 group-hover:to-pink-500/10 rounded-xl transition-all duration-300" />
              </Link>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2 xl:space-x-4">
            <LanguageSwitcher />

            {/* Subtle hamburger dropdown moved to actions area */}
            <div className="relative hidden lg:block" ref={moreRef}>
              <button
                className="flex items-center justify-center h-8 w-8 rounded-md hover:bg-accent/60 text-foreground/70 hover:text-foreground transition-colors micro-bounce focus-ring"
                aria-label="More navigation options"
                aria-expanded={isMoreOpen}
                aria-haspopup="true"
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
                    className="absolute right-0 mt-2 w-56 rounded-lg glass-card shadow-xl p-2 z-50 origin-top-right"
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
              <Button 
                variant="glass" 
                size="icon" 
                className="relative hover:scale-110 transition-all duration-300 micro-glow"
                aria-label="Favorites (3 items)"
              >
                <Heart className="h-5 w-5 xl:h-6 xl:w-6" />
                <div 
                  className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full h-5 w-5 xl:h-6 xl:w-6 flex items-center justify-center animate-pulse-glow shadow-glow"
                  aria-hidden="true"
                >
                  3
                </div>
              </Button>
            </Link>

            <Link href="/basket">
              <Button 
                variant="glass" 
                size="icon" 
                className="relative hover:scale-110 transition-all duration-300 micro-glow"
                aria-label="Shopping basket (2 items)"
              >
                <ShoppingBag className="h-5 w-5 xl:h-6 xl:w-6" />
                <div 
                  className="absolute -top-1 -right-1 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs rounded-full h-5 w-5 xl:h-6 xl:w-6 flex items-center justify-center animate-pulse-glow shadow-glow" 
                  style={{ animationDelay: '0.5s' }}
                  aria-hidden="true"
                >
                  2
                </div>
              </Button>
            </Link>

            <Link href="/donate">
              <Button variant="glow" size="sm" className="hidden sm:flex hover:scale-105 transition-all duration-300 text-sm xl:text-base font-semibold">
                <Heart className="h-4 w-4 xl:h-5 xl:w-5 mr-2" />
                {t.nav.donateNow}
              </Button>
            </Link>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden hover:scale-110 transition-transform duration-200"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? "Close mobile menu" : "Open mobile menu"}
              aria-expanded={isMobileMenuOpen}
              aria-haspopup="true"
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
        "lg:hidden glass-intense backdrop-blur-2xl border-t border-white/10 transition-all duration-300 overflow-hidden shadow-glass-xl",
        isMobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
      )}>
        <div className="container mx-auto px-4 py-6 space-y-4">
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
    </>
  )
}