'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  Heart, 
  Mail, 
  Phone, 
  MapPin, 
  Facebook, 
  Twitter, 
  Instagram, 
  Youtube,
  PawPrint,
  ArrowRight,
  Shield,
  Award,
  Users
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

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Youtube, href: '#', label: 'YouTube' },
  ]

  const quickLinks = [
    { label: 'About Us', href: '/about' },
    { label: 'Our Impact', href: '/impact' },
    { label: 'Partners', href: '/partners' },
    { label: 'Success Stories', href: '/success-stories' },
    { label: 'Volunteer', href: '/volunteer' },
    { label: 'Careers', href: '/careers' },
  ]

  const supportLinks = [
    { label: 'Donate', href: '/donate' },
    { label: 'Shop', href: '/shop' },
    { label: 'Sponsor a Pet', href: '/sponsor' },
    { label: 'Adopt', href: '/adopt' },
    { label: 'Foster', href: '/foster' },
    { label: 'Report Abuse', href: '/report' },
  ]

  const legalLinks = [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Cookie Policy', href: '/cookies' },
    { label: 'Refund Policy', href: '/refunds' },
    { label: 'Accessibility', href: '/accessibility' },
    { label: 'Contact Us', href: '/contact' },
  ]

  const features = [
    {
      icon: Shield,
      title: "Secure Donations",
      description: "Your donations are protected with bank-level security"
    },
    {
      icon: Award,
      title: "Tax Deductible",
      description: "501(c)(3) certified - all donations are tax deductible"
    },
    {
      icon: Users,
      title: "Transparent Impact",
      description: "See exactly how your donations are making a difference"
    }
  ]

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 w-32 h-32 bg-orange-500/10 rounded-full blur-2xl animate-pulse" />
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-red-500/10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-yellow-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Main Footer Content */}
        <div className="py-16">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
            {/* Brand Section */}
            <div className="lg:col-span-1">
              <Link href="/" className="flex items-center space-x-2 group mb-6">
                <div className="relative hover:scale-110 transition-transform duration-200">
                  <PawPrint className="h-8 w-8 text-orange-500 group-hover:text-red-500 transition-colors duration-200" />
                </div>
                <span className="font-display text-2xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                  Doggzy
                </span>
              </Link>
              
              <p className="text-gray-300 mb-6 leading-relaxed">
                Dedicated to rescuing, rehabilitating, and rehoming dogs in need. 
                Every donation and purchase directly saves lives and creates miracles.
              </p>

              {/* Contact Info */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center space-x-3 text-gray-300 hover:text-orange-400 transition-colors duration-200">
                  <Mail className="h-5 w-5 text-orange-500" />
                  <span>hello@doggzy.org</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-300 hover:text-orange-400 transition-colors duration-200">
                  <Phone className="h-5 w-5 text-orange-500" />
                  <span>1-800-DOGGZY-1</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-300 hover:text-orange-400 transition-colors duration-200">
                  <MapPin className="h-5 w-5 text-orange-500" />
                  <span>San Francisco, CA</span>
                </div>
              </div>

              {/* Social Links */}
              <div className="flex space-x-4">
                {socialLinks.map((social) => (
                  <Link
                    key={social.label}
                    href={social.href}
                    className="p-2 bg-gray-800 rounded-lg hover:bg-orange-500 hover:scale-110 transition-all duration-200"
                    aria-label={social.label}
                  >
                    {React.createElement(social.icon, { className: "h-5 w-5" })}
                  </Link>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold mb-6 text-orange-400">Quick Links</h3>
              <ul className="space-y-3">
                {quickLinks.map((link) => (
                  <li key={link.href}>
                    <Link 
                      href={link.href}
                      className="text-gray-300 hover:text-orange-400 transition-colors duration-200 hover:translate-x-1 transform inline-block"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support Links */}
            <div>
              <h3 className="text-lg font-semibold mb-6 text-orange-400">Get Involved</h3>
              <ul className="space-y-3">
                {supportLinks.map((link) => (
                  <li key={link.href}>
                    <Link 
                      href={link.href}
                      className="text-gray-300 hover:text-orange-400 transition-colors duration-200 hover:translate-x-1 transform inline-block"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Newsletter & Legal */}
            <div>
              <h3 className="text-lg font-semibold mb-6 text-orange-400">Stay Connected</h3>
              
              {/* Newsletter */}
              <form onSubmit={handleNewsletterSubmit} className="mb-6">
                <div className="flex space-x-2">
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-orange-500 focus:ring-orange-500"
                    required
                  />
                  <Button type="submit" variant="glow" size="sm" className="hover:scale-105 transition-transform duration-200">
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-sm text-gray-400 mt-2">
                  Get updates on our rescue efforts and success stories
                </p>
              </form>

              {/* Legal Links */}
              <div className="space-y-3">
                {legalLinks.map((link) => (
                  <div key={link.href}>
                    <Link 
                      href={link.href}
                      className="text-sm text-gray-400 hover:text-orange-400 transition-colors duration-200 hover:translate-x-1 transform inline-block"
                    >
                      {link.label}
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="py-12 border-t border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={feature.title} className="text-center hover:scale-105 transition-transform duration-200">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 text-white mb-4 hover:scale-110 transition-transform duration-200">
                  {React.createElement(feature.icon, { className: "h-8 w-8" })}
                </div>
                <h4 className="text-lg font-semibold mb-2 text-orange-400">
                  {feature.title}
                </h4>
                <p className="text-gray-300 text-sm">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="py-12 border-t border-gray-700">
          <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-8 text-center relative overflow-hidden hover:scale-105 transition-transform duration-300">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-600/20 to-red-600/20" />
            <div className="relative z-10">
              <h3 className="text-2xl md:text-3xl font-bold mb-4">
                Help Create More Happy Endings
              </h3>
              <p className="text-orange-100 mb-6 max-w-2xl mx-auto">
                Every donation and purchase directly supports rescue operations, medical care, 
                and finding loving homes for dogs in need.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/donate">
                  <Button size="lg" variant="secondary" className="hover:scale-105 transition-transform duration-200">
                    <Heart className="h-5 w-5 mr-2" />
                    Donate Now
                  </Button>
                </Link>
                <Link href="/shop">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-orange-600 hover:scale-105 transition-all duration-200">
                    <ArrowRight className="h-5 w-5 mr-2" />
                    Shop for a Cause
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-gray-700">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4">
              <p className="text-gray-400 text-sm">
                © 2024 Doggzy. All rights reserved.
              </p>
              <Badge variant="secondary" className="bg-green-100 text-green-800 hover:scale-105 transition-transform duration-200">
                501(c)(3) Non-Profit
              </Badge>
            </div>
            
            <div className="flex items-center space-x-6">
              <p className="text-gray-400 text-sm">
                Made with <Heart className="h-4 w-4 text-red-500 inline mx-1" /> for dogs everywhere
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}