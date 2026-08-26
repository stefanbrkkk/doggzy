'use client'

import { useRef, useState } from 'react'
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'framer-motion'
import { BadgeCheck, HeartPulse, Radio, Siren } from 'lucide-react'
import { cn } from '@/lib/utils'
import { duration, ease } from '@/lib/motion'
import { Container, Eyebrow } from '@/components/ui/section'
import { Reveal } from '@/components/motion'

const STEPS = [
  {
    icon: Siren,
    title: 'Prijaviš',
    lead: 'Jedan minut, sa telefona.',
    body: 'Tip prijave, lokacija, opis, fotografija. Bez naloga, bez registracije. Prijava odmah ide dežurnom u tvom gradu.',
    stat: '5 koraka',
    statLabel: 'Toliko traje prijava',
  },
  {
    icon: Radio,
    title: 'Reagujemo',
    lead: 'Prosleđujemo najbližoj ekipi.',
    body: 'Prijava ide skloništu ili volonterima koji rade u tvom kraju. Ako je pas u neposrednoj opasnosti, prijava se označava kao hitna.',
    stat: 'Isti dan',
    statLabel: 'Cilj za hitne prijave',
  },
  {
    icon: HeartPulse,
    title: 'Lečimo i udomljavamo',
    lead: 'Veterinar, oporavak, dom.',
    body: 'Pas ulazi u evidenciju sa svojom stranicom. Tu stoje nalazi, troškovi i status — od prvog pregleda do dana kad ode kući.',
    stat: 'Svaki pas',
    statLabel: 'Dobija javnu stranicu',
  },
  {
    icon: BadgeCheck,
    title: 'Objavljujemo račun',
    lead: 'Stavku po stavku.',
    body: 'Svaki trošak dobija datum, iznos i dokaz. Ono što nema račun stoji označeno kao nepotvrđeno — ne brišemo razliku, prikazujemo je.',
    stat: 'Bez izuzetka',
    statLabel: 'Troškovi su javni',
  },
]

export function HowItWorks() {
  const reduced = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })

  useMotionValueEvent(scrollYProgress, 'change', (value) => {
    // Split the scroll pass into equal bands, one per step.
    const index = Math.min(STEPS.length - 1, Math.floor(value * STEPS.length))
    setActive(index)
  })

  const railScale = useTransform(scrollYProgress, [0, 1], [0, 1])

  return (
    <section id="kako-radi" className="relative">
      {/* The header stays in normal flow. Pinning it too would eat a third of
          the stage on a laptop and leave the steps cramped against the top. */}
      <Container className="pt-section">
        <Header />
      </Container>

      {/* Reduced motion gets a plain stacked list — no pinning, no scroll math. */}
      {reduced ? (
        <Container className="space-y-12 py-16">
          <ol className="space-y-10">
            {STEPS.map((step, index) => (
              <li key={step.title}>
                <StepCopy step={step} index={index} />
              </li>
            ))}
          </ol>
        </Container>
      ) : (
        <div ref={ref} style={{ height: `${STEPS.length * 85}vh` }} className="mt-10">
          <div className="sticky top-0 flex min-h-svh items-center overflow-hidden py-20">
            <Container className="w-full">
              <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-20">
                <div className="flex gap-6">
                  <div className="relative mt-1.5 w-px shrink-0 bg-line">
                    <motion.span
                      className="absolute inset-x-0 top-0 origin-top bg-brand"
                      style={{ scaleY: railScale, height: '100%' }}
                    />
                  </div>

                  <ol className="flex-1 space-y-8">
                    {STEPS.map((step, index) => (
                      <li key={step.title}>
                        <motion.div
                          animate={{
                            opacity: index === active ? 1 : 0.32,
                            x: index === active ? 0 : -4,
                          }}
                          transition={{ duration: duration.base, ease: ease.outExpo }}
                        >
                          <StepCopy step={step} index={index} compact />
                        </motion.div>
                      </li>
                    ))}
                  </ol>
                </div>

                <CardStack active={active} />
              </div>
            </Container>
          </div>
        </div>
      )}
    </section>
  )
}

function Header() {
  return (
    <div className="max-w-2xl space-y-4">
      <Reveal direction="up" amount={0.4}>
        <Eyebrow>Kako radi</Eyebrow>
      </Reveal>
      <Reveal direction="up" delay={0.06}>
        <h2 className="text-title text-ink">Od prijave do objavljenog računa</h2>
      </Reveal>
      <Reveal direction="up" delay={0.12}>
        <p className="text-lead text-ink-muted">
          Četiri koraka. Nijedan se ne dešava iza zatvorenih vrata.
        </p>
      </Reveal>
    </div>
  )
}

function StepCopy({
  step,
  index,
  compact = false,
}: {
  step: (typeof STEPS)[number]
  index: number
  compact?: boolean
}) {
  const Icon = step.icon
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3">
        <span data-numeric className="text-2xs text-ink-subtle">
          {String(index + 1).padStart(2, '0')}
        </span>
        <Icon className="h-4 w-4 text-brand" aria-hidden="true" />
        <h3 className="text-headline text-ink">{step.title}</h3>
      </div>
      <p className="text-sm font-medium text-brand-text">{step.lead}</p>
      <p className={cn('text-sm leading-relaxed text-ink-muted', compact && 'max-w-md')}>
        {step.body}
      </p>
    </div>
  )
}

/**
 * Stacked cards. The active card sits on top at full scale; the rest fan out
 * behind it. Only transform and opacity change, so the whole stack composites
 * on the GPU.
 */
function CardStack({ active }: { active: number }) {
  return (
    <div className="relative mx-auto h-[19rem] w-full max-w-md" aria-hidden="true">
      {STEPS.map((step, index) => {
        const offset = index - active
        const Icon = step.icon

        return (
          <motion.div
            key={step.title}
            className="absolute inset-0 flex flex-col justify-between rounded-4xl border border-line bg-elevated p-7 shadow-lift-lg"
            animate={{
              y: offset * 18,
              scale: 1 - Math.abs(offset) * 0.05,
              opacity: offset < 0 ? 0 : offset > 2 ? 0 : 1 - offset * 0.18,
              rotate: offset * -1.4,
            }}
            transition={{ duration: duration.slow, ease: ease.outExpo }}
            style={{ zIndex: STEPS.length - Math.abs(offset) }}
          >
            <div className="flex items-start justify-between">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand/12 text-brand">
                <Icon className="h-5 w-5" />
              </span>
              <span data-numeric className="text-2xs uppercase tracking-widest text-ink-subtle">
                {String(index + 1).padStart(2, '0')} / {String(STEPS.length).padStart(2, '0')}
              </span>
            </div>

            <div className="space-y-2">
              <p className="text-title leading-[1.02] text-balance text-gradient">{step.stat}</p>
              <p className="text-sm text-ink-muted">{step.statLabel}</p>
            </div>

            {/* Segmented rail: shows how far through the four steps this card sits. */}
            <div className="flex gap-1.5">
              {STEPS.map((other, dot) => (
                <span
                  key={other.title}
                  className={cn(
                    'h-1 flex-1 rounded-full transition-colors duration-500',
                    dot <= index ? 'bg-brand' : 'bg-line-strong',
                  )}
                />
              ))}
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}
