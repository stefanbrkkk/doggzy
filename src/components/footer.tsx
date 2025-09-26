'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Mail, 
  PawPrint,
  ArrowRight
} from 'lucide-react'
import React from 'react'

export function Footer() {
  const [email, setEmail] = useState('')

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      alert(`Thank you for subscribing with ${email}!`)
      setEmail('')
    }
  }

  const primaryActions = [
    { label: 'Donate', href: '/donate' },
    { label: 'Adopt', href: '/adopt' },
    { label: 'Shop', href: '/shop' },
  ]

  const quickLinks = [
    { label: 'About', href: '/about' },
    { label: 'Impact', href: '/impact' },
    { label: 'Stories', href: '/stories' },
    { label: 'Partners', href: '/partners' },
  ]

  const legalLinks = [
    { label: 'Privacy', href: '/privacy' },
    { label: 'Terms', href: '/terms' },
    { label: 'Contact', href: '/contact' },
  ]

  return (
    <footer className="bg-background border-t border-border relative overflow-hidden">
      {/* Subtle footer background enhancement */}
      <div className="absolute inset-0 bg-gradient-to-t from-muted/20 via-transparent to-transparent pointer-events-none" />
      <div className="container mx-auto container-padding relative z-10">
        {/* Main Footer Content */}
        <div className="py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand Section */}
            <div className="md:col-span-2">
              <Link href="/" className="flex items-center space-x-2 group mb-4">
                <div className="relative">
                  <PawPrint className="h-6 w-6 text-foreground group-hover:text-neon-primary transition-all duration-300 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-neon-primary-dim rounded-full opacity-0 group-hover:opacity-10 blur-sm transition-all duration-300" />
                </div>
                <span className="font-display text-xl font-bold text-foreground tracking-tight">
                  Doggzy
                </span>
              </Link>
              
              <p className="text-muted-foreground text-sm mb-6 max-w-md">
                Rescuing, rehabilitating, and rehoming dogs in need. Every action saves lives.
              </p>

              {/* Newsletter */}
              <div className="mb-6">
                <form onSubmit={handleNewsletterSubmit} className="flex space-x-2 max-w-sm">
                  <Input
                    type="email"
                    placeholder="Email for updates"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="text-sm flex-1"
                    required
                  />
                  <Button type="submit" size="sm" className="glow-primary group">
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform duration-200" />
                  </Button>
                </form>
              </div>

              {/* Contact */}
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <a href="mailto:care@doggzy.online" className="hover:text-foreground transition-colors duration-200 flex items-center space-x-1">
                  <Mail className="h-4 w-4" />
                  <span>care@doggzy.online</span>
                </a>
              </div>
            </div>

            {/* Primary Actions */}
            <div>
              <h3 className="text-sm font-semibold mb-4 text-foreground">Actions</h3>
              <ul className="space-y-2">
                {primaryActions.map((link) => (
                  <li key={link.href}>
                    <Link 
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 btn-ghost inline-block"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-sm font-semibold mb-4 text-foreground">Explore</h3>
              <ul className="space-y-2">
                {quickLinks.map((link) => (
                  <li key={link.href}>
                    <Link 
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-border">
          <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-4 text-xs text-muted-foreground">
              <span>© 2024 Doggzy</span>
              <span className="px-2 py-1 bg-muted rounded text-xs">501(c)(3)</span>
            </div>
            
            {/* Legal Links - Subtle and dimmed */}
            <div className="flex items-center space-x-4">
              {legalLinks.map((link, index) => (
                <React.Fragment key={link.href}>
                  <Link 
                    href={link.href}
                    className="text-xs text-muted-foreground/70 hover:text-muted-foreground transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                  {index < legalLinks.length - 1 && (
                    <span className="text-muted-foreground/50">·</span>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}