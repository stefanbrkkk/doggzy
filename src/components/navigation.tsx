'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Heart, ShoppingBag, Menu, X, PawPrint } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useLanguage } from '@/contexts/LanguageContext'
import { LanguageSwitcher } from '@/components/language-switcher'

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { t } = useLanguage()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navItems = [
    { label: t.nav.home, href: '/' },
    { label: t.nav.donate, href: '/donate' },
    { label: t.nav.shop, href: '/shop' },
    { label: t.nav.sponsor, href: '/sponsor' },
    { label: t.nav.impact, href: '/impact' },
    { label: t.nav.partners, href: '/partners' },
    { label: t.nav.about, href: '/about' },
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
          <div className="hidden lg:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="relative group font-medium text-foreground/80 hover:text-orange-500 transition-colors duration-200"
              >
                {item.label}
                <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-orange-500 to-red-500 group-hover:w-full transition-all duration-200" />
              </Link>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-4">
            <LanguageSwitcher />
            
            <Link href="/favorites">
              <Button variant="ghost" size="icon" className="relative hover:scale-110 transition-transform duration-200">
                <Heart className="h-5 w-5" />
                <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                  3
                </div>
              </Button>
            </Link>

            <Link href="/basket">
              <Button variant="ghost" size="icon" className="relative hover:scale-110 transition-transform duration-200">
                <ShoppingBag className="h-5 w-5" />
                <div className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse" style={{ animationDelay: '0.5s' }}>
                  2
                </div>
              </Button>
            </Link>

            <Link href="/donate">
              <Button variant="glow" size="sm" className="hidden sm:flex hover:scale-105 transition-transform duration-200">
                <Heart className="h-4 w-4 mr-2" />
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
        <div className="container mx-auto px-4 py-4 space-y-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block py-2 text-lg font-medium text-foreground/80 hover:text-orange-500 transition-colors duration-200"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <div className="pt-4 border-t border-border">
            <Link href="/donate">
              <Button variant="glow" className="w-full hover:scale-105 transition-transform duration-200">
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