'use client'

import { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'
import { motion } from 'framer-motion'
import { Moon, Sun } from 'lucide-react'
import { cn } from '@/lib/utils'
import { spring } from '@/lib/motion'

/**
 * Two-state theme switch.
 *
 * Everything theme-dependent — the icon, the knob position, the accessible
 * name — is held at a neutral value until after mount. The resolved theme is
 * only knowable on the client, and React does not repair attribute differences
 * during hydration: it keeps the server value and warns. That silently froze
 * `aria-label` at "switch to light" forever, even while the button worked.
 * Deferring past hydration turns the swap into an ordinary update, which React
 * does apply.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  const isDark = resolvedTheme !== 'light'
  const label = mounted ? (isDark ? 'Uključi svetlu temu' : 'Uključi tamnu temu') : 'Promeni temu'

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label={label}
      aria-pressed={mounted ? !isDark : undefined}
      className={cn(
        'relative inline-flex h-9 w-16 items-center rounded-full border border-line bg-sunken px-1',
        'transition-colors duration-300 hover:border-line-strong',
        'focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-brand',
        className,
      )}
    >
      <motion.span
        aria-hidden="true"
        className="grid h-7 w-7 place-items-center rounded-full bg-brand text-brand-ink"
        animate={{ x: mounted && !isDark ? 28 : 0 }}
        transition={spring.pop}
      >
        {mounted && !isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      </motion.span>
    </button>
  )
}
