'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { routes, secondaryNav, site } from '@/config/site'
import { Logo } from '@/components/ui/logo'
import { Reveal } from '@/components/motion'
import { useReducedMotionSafe } from '@/lib/use-reduced-motion-safe'

const columns = [
  {
    title: 'Pomoć',
    links: [
      { href: routes.report, label: 'Prijavi psa' },
      { href: routes.dogs, label: 'Psi za udomljavanje' },
      { href: routes.donate, label: 'Doniraj' },
      { href: routes.stories, label: 'Priče' },
    ],
  },
  {
    title: 'Prodavnica',
    links: [
      { href: routes.shop, label: 'Svi proizvodi' },
      { href: routes.cart, label: 'Korpa' },
      { href: routes.favorites, label: 'Omiljeno' },
      { href: routes.transparency, label: 'Gde ide profit' },
    ],
  },
  {
    title: 'Doggzy',
    links: [
      { href: routes.about, label: 'O nama' },
      { href: routes.transparency, label: 'Transparentnost' },
      { href: routes.contact, label: 'Kontakt' },
    ],
  },
]

export interface SiteFooterProps {
  /**
   * The copyright year, resolved on the server so both sides render the same
   * one. See the note on `current` below for why this is not read here.
   */
  year: number
}

export function SiteFooter({ year }: SiteFooterProps) {
  const reduced = useReducedMotionSafe()
  const ref = useRef<HTMLElement>(null)

  /**
   * The year, handed in by the server and corrected after mount.
   *
   * Reading the clock in this body instead looks obvious and is wrong twice
   * over. The footer is prerendered, so it would run at build time — a site
   * that is not redeployed over New Year goes on claiming the previous year
   * indefinitely. And the browser reads its own clock, so the two disagree,
   * which is a hydration mismatch of exactly the kind that made React discard
   * the whole document over the generative artwork.
   *
   * `suppressHydrationWarning` is not the fix: it suppresses the *patch* as
   * well as the warning, so the stale text stays on screen — measured, a client
   * whose clock said 2031 kept showing the build's 2026. Taking the year as a
   * prop makes both sides render the same thing, so there is nothing to
   * suppress, and the effect updates it for anyone whose year has since turned.
   */
  const [current, setCurrent] = useState(year)
  useEffect(() => {
    const now = new Date().getFullYear()
    setCurrent((previous) => (previous === now ? previous : now))
  }, [])
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end end'] })

  // The wordmark rises out of the bottom edge as the footer comes into view.
  const wordmarkY = useTransform(scrollYProgress, [0, 1], ['38%', '0%'])
  const wordmarkOpacity = useTransform(scrollYProgress, [0, 0.7], [0, 1])

  return (
    <footer
      ref={ref}
      className="relative isolate mt-20 overflow-hidden border-t border-line bg-surface grain"
    >
      <div
        aria-hidden="true"
        data-decor
        className="pointer-events-none absolute -top-40 left-1/2 h-80 w-[70rem] -translate-x-1/2 rounded-full bg-brand/10 blur-[120px]"
      />

      <div className="mx-auto w-full max-w-[92rem] px-5 pb-8 pt-20 sm:px-8">
        <div className="grid gap-14 lg:grid-cols-[1.2fr_2fr]">
          <div className="space-y-6">
            <Reveal>
              <Logo />
            </Reveal>
            <Reveal delay={0.06}>
              <p className="max-w-sm text-lead text-ink-muted">{site.tagline}</p>
            </Reveal>
            <Reveal delay={0.12}>
              <div className="space-y-1 text-sm text-ink-subtle">
                <p>
                  <a className="transition-colors hover:text-ink" href={`mailto:${site.email}`}>
                    {site.email}
                  </a>
                </p>
                <p>{site.city}</p>
              </div>
            </Reveal>
          </div>

          <div className="grid gap-10 sm:grid-cols-3">
            {columns.map((column, columnIndex) => (
              <Reveal key={column.title} delay={0.06 * columnIndex} className="space-y-4">
                <h2 className="text-2xs font-medium uppercase tracking-[0.22em] text-ink-subtle">
                  {column.title}
                </h2>
                <ul className="space-y-2.5">
                  {column.links.map((link) => (
                    <li key={`${column.title}-${link.href}-${link.label}`}>
                      <FooterLink href={link.href}>{link.label}</FooterLink>
                    </li>
                  ))}
                </ul>
              </Reveal>
            ))}
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-6 border-t border-line pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-ink-subtle">
            © {current} {site.name}. Sva prava zadržana.
          </p>
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {secondaryNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-sm text-ink-subtle transition-colors hover:text-ink"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          {site.social.length > 0 ? (
            <ul className="flex gap-4">
              {site.social.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="text-sm text-ink-subtle transition-colors hover:text-ink"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>

      {/* Oversized wordmark, clipped by the footer edge. Decorative only. */}
      <motion.p
        aria-hidden="true"
        data-decor
        // Scroll-linked motion values are driven by the scroll position, not
        // by a transition, so `MotionConfig reducedMotion="user"` does not
        // touch them. Gating them here is the only thing that stops a 15rem
        // wordmark from sliding for a visitor who asked for no motion.
        //
        // Pinned to the resting values rather than dropped. `reduced` is false
        // on the first client render, so Motion has already written this
        // element's starting values — `opacity: 0`, `y: 38%` — into its inline
        // style; handing it `undefined` next render stops the driver without
        // clearing what it wrote, and the wordmark stayed invisible on all 14
        // routes. Same trap as the one documented in `reveal.tsx`.
        style={reduced ? { y: '0%', opacity: 1 } : { y: wordmarkY, opacity: wordmarkOpacity }}
        className="pointer-events-none select-none px-4 text-center font-display text-[clamp(4rem,17vw,15rem)] font-bold leading-[0.78] tracking-tighter text-ink/[0.055]"
      >
        doggzy
      </motion.p>
    </footer>
  )
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className={cn(
        'group inline-flex items-center gap-1 text-sm text-ink-muted transition-colors hover:text-ink',
      )}
    >
      {children}
      <ArrowUpRight
        aria-hidden="true"
        className="h-3.5 w-3.5 -translate-x-1 opacity-0 transition-all duration-300 ease-out-expo group-hover:translate-x-0 group-hover:opacity-100"
      />
    </Link>
  )
}
