'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  Image, 
  FileText, 
  ShoppingBag, 
  Settings,
  Menu,
  X,
  PawPrint
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const navigation = [
  {
    name: 'Kontrolna tabla',
    href: '/admin',
    icon: LayoutDashboard,
  },
  {
    name: 'Mediji',
    href: '/admin/media',
    icon: Image,
  },
  {
    name: 'Sadržaj',
    href: '/admin/content',
    icon: FileText,
  },
  {
    name: 'Proizvodi',
    href: '/admin/products',
    icon: ShoppingBag,
  },
  {
    name: 'Podešavanja',
    href: '/admin/settings',
    icon: Settings,
  },
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Enhanced Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 glass-dark backdrop-blur-xl lg:hidden animate-slide-in-left"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Enhanced Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-72 glass-card backdrop-blur-2xl shadow-glass-xl border-r border-white/10 transform transition-all duration-500 ease-in-out lg:translate-x-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        <div className="flex h-20 items-center justify-between px-6 border-b border-white/10 glass-subtle">
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative animate-float">
              <PawPrint className="h-10 w-10 text-orange-500 group-hover:text-red-500 transition-all duration-300 drop-shadow-lg" />
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-full blur-lg group-hover:blur-xl transition-all duration-300"></div>
            </div>
            <span className="font-display text-2xl font-bold bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 bg-clip-text text-transparent animate-gradient-shift">
              Doggzy Admin
            </span>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-6 w-6" />
          </Button>
        </div>

        <nav className="mt-8 px-4">
          <div className="space-y-2">
            {navigation.map((item, index) => {
              const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href))
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "group flex items-center px-4 py-3 text-sm font-medium rounded-2xl transition-all duration-300 relative overflow-hidden",
                    isActive
                      ? "glass-intense text-white shadow-glow border border-orange-500/30"
                      : "text-white/70 hover:glass-subtle hover:text-white hover:scale-105"
                  )}
                  onClick={() => setSidebarOpen(false)}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <item.icon
                    className={cn(
                      "mr-4 h-6 w-6 transition-all duration-300",
                      isActive ? "text-orange-400 animate-pulse-glow" : "text-white/60 group-hover:text-orange-400 group-hover:scale-110"
                    )}
                  />
                  {item.name}
                  {isActive && (
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-2xl animate-gradient-shift"></div>
                  )}
                </Link>
              )
            })}
          </div>
        </nav>

        {/* Enhanced User info */}
        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-white/10 glass-subtle">
          <div className="flex items-center space-x-4 animate-slide-in-left">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 flex items-center justify-center text-white text-lg font-bold shadow-glow animate-pulse-glow">
              A
            </div>
            <div className="text-sm">
              <p className="font-semibold text-white">Administrator</p>
              <p className="text-white/60">admin@doggzy.rs</p>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Main content */}
      <div className="lg:pl-72">
        {/* Enhanced Top bar */}
        <div className="sticky top-0 z-10 glass-intense backdrop-blur-2xl shadow-glass border-b border-white/10">
          <div className="flex h-20 items-center justify-between px-8">
            <Button
              variant="glass"
              size="icon"
              className="lg:hidden hover:scale-110 transition-all duration-300"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </Button>
            
            <div className="flex items-center space-x-6">
              <div className="glass-subtle px-4 py-2 rounded-xl">
                <span className="text-sm text-white/80 font-medium">
                  Poslednja aktivnost: Danas u 14:30
                </span>
              </div>
              <div className="h-3 w-3 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full animate-pulse-glow shadow-glow"></div>
            </div>
          </div>
        </div>

        {/* Enhanced Page content */}
        <main className="p-8 min-h-screen">
          <div className="animate-slide-up">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
