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
      if (typeof window !== 'undefined') {
        setIsScrolled(window.scrollY > 50)
      }
    }
    
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', handleScroll)
      return () => window.removeEventListener('scroll', handleScroll)
    }
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

    if (isMoreOpen && typeof document !== 'undefined') {
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

    if ((isMoreOpen || isMobileMenuOpen) && typeof document !== 'undefined') {
      document.addEventListener('keydown', onKeyDown)
      return () => document.removeEventListener('keydown', onKeyDown)
    }
  }, [isMoreOpen, isMobileMenuOpen])

  const navItems = [
    { label: t.nav.home, href: '/' },
    { label: t.nav.donate, href: '/donate' },
    { label: t.nav.shop, href: '/shop' },
    { label: t.nav.stories, href: '/stories' },
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
            ? "bg-background/95 backdrop-blur-md border-b border-border shadow-lg shadow-foreground/5" 
            : "bg-transparent"
        )}
        role="navigation"
        aria-label="Main navigation"
      >
      <div className="container mx-auto container-padding">
        <div className="flex items-center justify-between h-16">
          {/* Premium logo with enhanced interactions */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="relative">
              <PawPrint className="h-6 w-6 text-foreground group-hover:text-neon-primary transition-all duration-300 group-hover:scale-110" />
              <div className="absolute inset-0 bg-neon-primary-dim rounded-full opacity-0 group-hover:opacity-20 blur-sm transition-all duration-300" />
            </div>
            <span className="font-display text-xl font-bold text-foreground tracking-tight">
              Doggzy
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="btn-ghost relative text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200"
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-3">
            <LanguageSwitcher />

            {/* More dropdown - minimal */}
            <div className="relative hidden lg:block" ref={moreRef}>
              <button
                className="btn-ghost h-8 w-8 rounded-md text-muted-foreground hover:text-foreground"
                aria-label="More navigation options"
                aria-expanded={isMoreOpen}
                aria-haspopup="true"
                onClick={() => setIsMoreOpen(!isMoreOpen)}
              >
                <Menu className="h-4 w-4" />
              </button>
              <AnimatePresence>
                {isMoreOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -6, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -6, scale: 0.98 }}
                    transition={{ duration: 0.15, ease: 'easeOut' }}
                    className="absolute right-0 mt-2 w-48 card p-2 z-50"
                  >
                    {moreItems.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="block px-3 py-2 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors duration-200"
                        onClick={() => setIsMoreOpen(false)}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            <Link href="/favorites">
              <Button 
                variant="ghost" 
                size="icon" 
                className="relative"
                aria-label="Favorites (3 items)"
              >
                <Heart className="h-4 w-4" />
                <div 
                  className="absolute -top-1 -right-1 bg-neon-primary text-black text-xs rounded-full h-4 w-4 flex items-center justify-center font-semibold"
                  aria-hidden="true"
                >
                  3
                </div>
              </Button>
            </Link>

            <Link href="/basket">
              <Button 
                variant="ghost" 
                size="icon" 
                className="relative"
                aria-label="Shopping basket (2 items)"
              >
                <ShoppingBag className="h-4 w-4" />
                <div 
                  className="absolute -top-1 -right-1 bg-neon-secondary text-black text-xs rounded-full h-4 w-4 flex items-center justify-center font-semibold"
                  aria-hidden="true"
                >
                  2
                </div>
              </Button>
            </Link>

            <Link href="/donate">
              <Button variant="glow" size="sm" className="hidden sm:flex">
                <Heart className="h-4 w-4 mr-2" />
                {t.nav.donateNow}
              </Button>
            </Link>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? "Close mobile menu" : "Open mobile menu"}
              aria-expanded={isMobileMenuOpen}
              aria-haspopup="true"
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={cn(
        "lg:hidden bg-background/95 backdrop-blur-md border-t border-border transition-all duration-300 overflow-hidden",
        isMobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
      )}>
        <div className="container mx-auto container-padding py-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block py-3 text-base font-medium text-muted-foreground hover:text-foreground transition-colors duration-200"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          
          <div className="pt-2 border-t border-border mt-4">
            <div className="text-xs uppercase text-muted-foreground mb-2">More</div>
            {moreItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </div>
          
          <div className="pt-4 border-t border-border">
            <Link href="/donate">
              <Button variant="glow" className="w-full">
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