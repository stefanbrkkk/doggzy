'use client'

import Link from 'next/link'
import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion'
import { ArrowRight, ChevronDown, Heart } from 'lucide-react'
import { cn } from '@/lib/utils'
import { duration, ease, spring } from '@/lib/motion'
import { routes } from '@/config/site'
import { buttonStyles } from '@/components/ui/button'
import { LineReveal, Magnetic, SplitText } from '@/components/motion'
import { AuroraField } from '@/components/visuals/aurora-field'
import { PhoneFrame } from '@/components/phone/phone-frame'
import { ReportFlow } from '@/components/phone/report-flow'
import { submitReport } from '@/lib/report-client'

const TRUST = [
  { value: 'Beograd, Novi Sad, Niš', label: 'Gde smo sada' },
  { value: '100%', label: 'Profita prodavnice ide u negu' },
  { value: 'Svaka stavka', label: 'Ima račun na stranici psa' },
]

export function Hero() {
  const reduced = useReducedMotion()
  const ref = useRef<HTMLElement>(null)

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const smooth = useSpring(scrollYProgress, spring.scroll)
  const copyY = useTransform(smooth, [0, 1], ['0%', '32%'])
  const copyOpacity = useTransform(smooth, [0, 0.65], [1, 0])
  const phoneY = useTransform(smooth, [0, 1], ['0%', '-14%'])
  const backdropScale = useTransform(smooth, [0, 1], [1, 1.18])

  return (
    <section
      ref={ref}
      className="relative isolate grain flex min-h-[100svh] items-center overflow-hidden pb-24 pt-32 sm:pb-28 lg:pt-36"
    >
      {/* Living backdrop. The CSS gradient below survives if WebGL does not. */}
      <div aria-hidden="true" data-decor className="absolute inset-0 -z-20 bg-canvas">
        <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_78%_18%,var(--wash-warm)_0%,transparent_55%),radial-gradient(90%_70%_at_12%_82%,var(--wash-cool)_0%,transparent_60%)] opacity-[var(--wash-opacity)]" />
        <motion.div
          style={reduced ? undefined : { scale: backdropScale }}
          className="absolute inset-0 opacity-70"
        >
          <AuroraField />
        </motion.div>
        <div className="absolute inset-0 bg-linear-to-b from-canvas/85 via-canvas/40 to-canvas" />
      </div>

      {/* Survey grid: reads as a map graticule behind everything. */}
      <div
        aria-hidden="true"
        data-decor
        className="absolute inset-0 -z-10 mask-fade-b opacity-[0.18] [background-image:linear-gradient(var(--line-strong)_1px,transparent_1px),linear-gradient(90deg,var(--line-strong)_1px,transparent_1px)] [background-size:64px_64px]"
      />

      <div className="mx-auto grid w-full max-w-[92rem] gap-16 px-5 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-10">
        <motion.div
          style={reduced ? undefined : { y: copyY, opacity: copyOpacity }}
          className="max-w-2xl"
        >
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: duration.slow, ease: ease.outExpo, delay: 0.15 }}
            className="inline-flex items-center gap-2.5 rounded-full border border-line bg-elevated/70 px-3.5 py-1.5 text-2xs uppercase tracking-[0.18em] text-ink-muted backdrop-blur"
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full rounded-full bg-brand animate-pulse-ring" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-brand" />
            </span>
            Prijava radi 24/7
          </motion.p>

          <h1 className="mt-7 text-hero text-ink">
            <SplitText immediate delay={0.28}>
              Svaki dinar
            </SplitText>
            <LineReveal immediate delay={0.46} className="text-gradient">
              ima ime.
            </LineReveal>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: duration.slow, ease: ease.outExpo, delay: 0.72 }}
            className="mt-7 max-w-xl text-lead text-ink-muted"
          >
            Prijavi nestalog ili ugroženog psa za jedan minut. Doniraj i vidi tačno koji je račun
            plaćen tvojim novcem. Kupi nešto psu — profit ide u negu.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: duration.slow, ease: ease.outExpo, delay: 0.84 }}
            className="mt-9 flex flex-wrap items-center gap-3"
          >
            <Magnetic strength={14}>
              <Link href={routes.report} className={cn(buttonStyles({ size: 'lg' }), 'group/cta')}>
                Prijavi psa
                <ArrowRight className="h-4 w-4 transition-transform duration-300 ease-out-expo group-hover/cta:translate-x-1" />
              </Link>
            </Magnetic>
            <Magnetic strength={10}>
              <Link
                href={routes.donate}
                className={cn(buttonStyles({ variant: 'secondary', size: 'lg' }))}
              >
                <Heart className="h-4 w-4" />
                Doniraj
              </Link>
            </Magnetic>
          </motion.div>

          <motion.dl
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: duration.slow, delay: 1 }}
            className="mt-12 grid gap-x-8 gap-y-5 border-t border-line pt-7 sm:grid-cols-3"
          >
            {TRUST.map((item) => (
              <div key={item.label}>
                <dt className="text-sm font-medium text-ink">{item.value}</dt>
                <dd className="mt-0.5 text-xs text-ink-subtle">{item.label}</dd>
              </div>
            ))}
          </motion.dl>
        </motion.div>

        <motion.div
          style={reduced ? undefined : { y: phoneY }}
          initial={{ opacity: 0, y: 48, rotateX: 12 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ duration: 1.1, ease: ease.outExpo, delay: 0.4 }}
          className="justify-self-center lg:justify-self-end"
        >
          <div className="mb-5 flex items-center justify-center gap-2 lg:justify-end">
            <span
              className="h-px w-8 bg-linear-to-r from-transparent to-brand"
              aria-hidden="true"
            />
            <p className="text-2xs uppercase tracking-[0.2em] text-ink-subtle">
              Probaj — prijava je stvarna
            </p>
          </div>
          <PhoneFrame label="Prijava psa">
            <ReportFlow onSubmit={submitReport} />
          </PhoneFrame>
        </motion.div>
      </div>

      <motion.a
        href="#kako-radi"
        aria-label="Idi na sledeću sekciju"
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-1.5 text-ink-subtle transition-colors hover:text-ink lg:flex"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: duration.slow }}
      >
        <span className="text-2xs uppercase tracking-[0.2em]">Skroluj</span>
        <ChevronDown className="h-4 w-4 animate-float" />
      </motion.a>
    </section>
  )
}
