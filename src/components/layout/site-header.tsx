'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
} from 'framer-motion'
import { Heart, Menu, ShoppingBag, X } from 'lucide-react'
import { cn, plural } from '@/lib/utils'
import { duration, ease, spring } from '@/lib/motion'
import { primaryNav, routes, secondaryNav } from '@/config/site'
import { useShop } from '@/lib/store/shop-store'
import { Logo } from '@/components/ui/logo'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { Button, buttonStyles } from '@/components/ui/button'
import { Magnetic } from '@/components/motion'

export function SiteHeader() {
  const pathname = usePathname()
  const reduced = useReducedMotion()
  const { itemCount, favoriteIds, hydrated, openCart } = useShop()

  const [condensed, setCondensed] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  const { scrollY } = useScroll()

  useMotionValueEvent(scrollY, 'change', (latest) => {
    const previous = scrollY.getPrevious() ?? 0
    setCondensed(latest > 24)
    // Only hide once well past the hero, and never while the menu is open.
    setHidden(latest > 420 && latest > previous && !menuOpen)
  })

  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  useEffect(() => {
    if (!menuOpen) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false)
    }
    document.addEventListener('keydown', onKey)

    return () => {
      document.body.style.overflow = previous
      document.removeEventListener('keydown', onKey)
    }
  }, [menuOpen])

  const isActive = (href: string) =>
    href === routes.home ? pathname === href : pathname.startsWith(href)

  return (
    <>
      <motion.header
        className="fixed inset-x-0 top-0 z-[80] px-3 pt-3 sm:px-5 sm:pt-4"
        animate={{ y: hidden && !reduced ? '-140%' : '0%' }}
        transition={{ duration: duration.base, ease: ease.outExpo }}
      >
        <nav
          aria-label="Glavna navigacija"
          className={cn(
            'mx-auto flex max-w-[92rem] items-center gap-3 rounded-2xl px-3 py-2.5 sm:gap-4 sm:px-4',
            'transition-[background-color,border-color,box-shadow,backdrop-filter] duration-500 ease-out-expo',
            condensed
              ? 'glass-strong border border-line shadow-lift'
              : 'border border-transparent bg-transparent',
          )}
        >
          <Link
            href={routes.home}
            className="shrink-0 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
            aria-label="Doggzy — početna"
          >
            <Logo animated={!reduced} />
          </Link>

          <ul className="ml-2 hidden items-center gap-1 lg:flex">
            {primaryNav.map((item) => {
              const active = isActive(item.href)
              return (
                <li key={item.href} className="relative">
                  <Link
                    href={item.href}
                    aria-current={active ? 'page' : undefined}
                    className={cn(
                      'relative block rounded-xl px-3.5 py-2 text-sm transition-colors duration-200',
                      active ? 'text-ink' : 'text-ink-muted hover:text-ink',
                    )}
                  >
                    {active ? (
                      <motion.span
                        layoutId="nav-active"
                        className="absolute inset-0 rounded-xl bg-elevated"
                        transition={spring.surface}
                      />
                    ) : null}
                    <span className="relative z-10">{item.label}</span>
                  </Link>
                </li>
              )
            })}
          </ul>

          <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
            <ThemeToggle className="hidden sm:inline-flex" />

            <IconLink
              href={routes.favorites}
              label="Omiljeni proizvodi"
              count={hydrated ? favoriteIds.length : 0}
            >
              <Heart className="h-[18px] w-[18px]" />
            </IconLink>

            <button
              type="button"
              data-cart-target
              onClick={openCart}
              aria-label={
                hydrated && itemCount
                  ? `Korpa, ${itemCount} ${plural(itemCount, 'stavka', 'stavke', 'stavki')}`
                  : 'Korpa, prazna'
              }
              className="relative grid h-10 w-10 place-items-center rounded-xl text-ink-muted transition-colors hover:bg-elevated hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
            >
              <ShoppingBag className="h-[18px] w-[18px]" />
              <CountBadge count={hydrated ? itemCount : 0} />
            </button>

            <Magnetic className="hidden sm:inline-flex" strength={10}>
              <Link href={routes.donate} className={cn(buttonStyles({ size: 'sm' }))}>
                <Heart className="h-4 w-4" />
                Doniraj
              </Link>
            </Magnetic>

            <Button
              variant="ghost"
              size="icon"
              sheen={false}
              className="lg:hidden"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? 'Zatvori meni' : 'Otvori meni'}
              onClick={() => setMenuOpen((open) => !open)}
            >
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {menuOpen ? (
          <motion.div
            id="mobile-menu"
            className="fixed inset-0 z-[75] bg-canvas/97 backdrop-blur-2xl lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: duration.fast }}
          >
            <div className="flex h-full flex-col justify-between px-6 pb-10 pt-28">
              <ul className="space-y-1">
                {primaryNav.map((item, index) => (
                  <motion.li
                    key={item.href}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: 0.05 + index * 0.055,
                      duration: duration.base,
                      ease: ease.outExpo,
                    }}
                  >
                    <Link
                      href={item.href}
                      className="block border-b border-line py-4 text-headline text-ink"
                    >
                      {item.label}
                      <span className="mt-1 block text-sm font-normal text-ink-subtle">
                        {item.description}
                      </span>
                    </Link>
                  </motion.li>
                ))}
              </ul>

              <motion.div
                className="space-y-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: duration.base, ease: ease.outExpo }}
              >
                <div className="flex flex-wrap gap-x-5 gap-y-2">
                  {secondaryNav.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="text-sm text-ink-subtle hover:text-ink"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
                <div className="flex items-center gap-3">
                  <Link
                    href={routes.donate}
                    className={cn(buttonStyles({ size: 'lg', full: true }))}
                  >
                    <Heart className="h-4 w-4" />
                    Doniraj
                  </Link>
                  <ThemeToggle />
                </div>
              </motion.div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  )
}

function IconLink({
  href,
  label,
  count,
  children,
}: {
  href: string
  label: string
  count: number
  children: React.ReactNode
}) {
  return (
    <Link
      href={href}
      aria-label={count ? `${label}, ${count}` : label}
      className="relative grid h-10 w-10 place-items-center rounded-xl text-ink-muted transition-colors hover:bg-elevated hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
    >
      {children}
      <CountBadge count={count} />
    </Link>
  )
}

/** Only mounts once there is something to count, so it can spring in. */
function CountBadge({ count }: { count: number }) {
  return (
    <AnimatePresence>
      {count > 0 ? (
        <motion.span
          key="badge"
          aria-hidden="true"
          data-numeric
          className="absolute -right-0.5 -top-0.5 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-brand px-1 text-[10px] font-semibold text-brand-ink"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={spring.pop}
        >
          {count > 99 ? '99+' : count}
        </motion.span>
      ) : null}
    </AnimatePresence>
  )
}
