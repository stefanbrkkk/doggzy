'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Heart, PawPrint, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function Footer() {
  const currentYear = new Date().getFullYear()

  const footerSections = [
    {
      title: 'Get Involved',
      links: [
        { label: 'Donate Now', href: '/donate' },
        { label: 'Sponsor a Dog', href: '/sponsor' },
        { label: 'Volunteer', href: '/volunteer' },
        { label: 'Partner with Us', href: '/partners' },
        { label: 'Fundraise', href: '/fundraise' }
      ]
    },
    {
      title: 'Shop & Support',
      links: [
        { label: 'Shop Merchandise', href: '/shop' },
        { label: 'Gift Cards', href: '/gift-cards' },
        { label: 'Corporate Gifts', href: '/corporate' },
        { label: 'Bulk Orders', href: '/bulk' },
        { label: 'Returns & Exchanges', href: '/returns' }
      ]
    },
    {
      title: 'Learn More',
      links: [
        { label: 'Our Mission', href: '/about' },
        { label: 'Success Stories', href: '/stories' },
        { label: 'Impact Report', href: '/impact' },
        { label: 'News & Updates', href: '/news' },
        { label: 'FAQ', href: '/faq' }
      ]
    },
    {
      title: 'Resources',
      links: [
        { label: 'Adoption Guide', href: '/adoption-guide' },
        { label: 'Pet Care Tips', href: '/pet-care' },
        { label: 'Emergency Resources', href: '/emergency' },
        { label: 'Vet Directory', href: '/vet-directory' },
        { label: 'Training Resources', href: '/training' }
      ]
    }
  ]

  const legalLinks = [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Cookie Policy', href: '/cookies' },
    { label: 'Accessibility', href: '/accessibility' },
    { label: 'Annual Report', href: '/annual-report' }
  ]

  const socialLinks = [
    { icon: Facebook, href: 'https://facebook.com/doggzy', label: 'Facebook' },
    { icon: Twitter, href: 'https://twitter.com/doggzy', label: 'Twitter' },
    { icon: Instagram, href: 'https://instagram.com/doggzy', label: 'Instagram' },
    { icon: Youtube, href: 'https://youtube.com/doggzy', label: 'YouTube' }
  ]

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-orange-900 text-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-20 left-10 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-40 h-40 bg-red-500/10 rounded-full blur-3xl"
          animate={{
            x: [0, -80, 0],
            y: [0, 60, 0],
            scale: [1, 0.8, 1],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 3,
          }}
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Newsletter Signup */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="py-16 border-b border-gray-700"
        >
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500/20 to-red-500/20 text-orange-300 px-4 py-2 rounded-full text-sm font-medium mb-6"
            >
              <Heart className="h-4 w-4 fill-orange-500 text-orange-500" />
              Stay Connected
            </motion.div>
            
            <h2 className="text-3xl sm:text-4xl font-display font-bold mb-4">
              Join Our Mission
            </h2>
            
            <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
              Get updates on rescue dogs, success stories, and ways to help. 
              Together, we can save more lives.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg border border-gray-600 bg-gray-800 text-white placeholder-gray-400 focus:border-orange-500 focus:ring-orange-500 focus:outline-none"
              />
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-3 rounded-lg">
                  Subscribe
                </Button>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Main Footer Content */}
        <div className="py-16">
          <div className="grid lg:grid-cols-6 gap-8">
            {/* Brand Section */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <Link href="/" className="flex items-center space-x-2 mb-6 group">
                  <motion.div
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                    className="relative"
                  >
                    <PawPrint className="h-8 w-8 text-orange-500 group-hover:text-red-500 transition-colors duration-300" />
                    <motion.div
                      className="absolute inset-0 bg-orange-500/20 rounded-full blur-xl"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  </motion.div>
                  <span className="font-display text-2xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                    Doggzy
                  </span>
                </Link>

                <p className="text-gray-300 mb-6 leading-relaxed">
                  We're on a mission to rescue, rehabilitate, and rehome dogs worldwide. 
                  Every donation and purchase directly saves lives and creates happy endings.
                </p>

                {/* Contact Info */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-orange-500" />
                    <span className="text-gray-300">info@doggzy.org</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-orange-500" />
                    <span className="text-gray-300">+1 (555) 123-4567</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-orange-500" />
                    <span className="text-gray-300">Global Network</span>
                  </div>
                </div>

                {/* Social Links */}
                <div className="flex gap-4">
                  {socialLinks.map((social) => (
                    <motion.a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-orange-500 transition-colors duration-300"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <social.icon className="h-5 w-5" />
                    </motion.a>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Footer Links */}
            {footerSections.map((section, index) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index, duration: 0.6 }}
                viewport={{ once: true }}
              >
                <h3 className="text-lg font-semibold mb-4 text-white">
                  {section.title}
                </h3>
                <ul className="space-y-3">
                  {section.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-gray-300 hover:text-orange-400 transition-colors duration-300 text-sm"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom Section */}
        <div className="py-8 border-t border-gray-700">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            {/* Legal Links */}
            <div className="flex flex-wrap items-center gap-6">
              {legalLinks.map((link, index) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-gray-400 hover:text-orange-400 transition-colors duration-300 text-sm"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Copyright */}
            <div className="flex items-center gap-4 text-gray-400 text-sm">
              <span>© {currentYear} Doggzy. All rights reserved.</span>
              <div className="flex items-center gap-1">
                <Heart className="h-4 w-4 fill-red-500 text-red-500" />
                <span>Made with love for rescue dogs</span>
              </div>
            </div>
          </div>

          {/* Compliance Badges */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            viewport={{ once: true }}
            className="flex flex-wrap items-center justify-center gap-6 mt-8 pt-8 border-t border-gray-700"
          >
            <div className="flex items-center gap-2 bg-green-500/20 text-green-300 px-4 py-2 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm font-medium">501(c)(3) Tax Deductible</span>
            </div>
            <div className="flex items-center gap-2 bg-blue-500/20 text-blue-300 px-4 py-2 rounded-lg">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-sm font-medium">GDPR Compliant</span>
            </div>
            <div className="flex items-center gap-2 bg-orange-500/20 text-orange-300 px-4 py-2 rounded-lg">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <span className="text-sm font-medium">PCI Compliant</span>
            </div>
            <div className="flex items-center gap-2 bg-purple-500/20 text-purple-300 px-4 py-2 rounded-lg">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span className="text-sm font-medium">SSL Secured</span>
            </div>
          </motion.div>
        </div>
      </div>
    </footer>
  )
}
