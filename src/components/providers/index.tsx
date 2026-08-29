'use client'

import type { ReactNode } from 'react'
import { MotionConfig } from 'framer-motion'
import { ThemeProvider } from 'next-themes'
import { ShopProvider } from '@/lib/store/shop-store'
import { SmoothScroll } from './smooth-scroll'

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
      disableTransitionOnChange
      themes={['dark', 'light']}
    >
      {/* `reducedMotion="user"` makes every motion component in the tree honour
          the OS setting without each one checking for itself. */}
      <MotionConfig reducedMotion="user">
        <ShopProvider>
          <SmoothScroll>{children}</SmoothScroll>
        </ShopProvider>
      </MotionConfig>
    </ThemeProvider>
  )
}
