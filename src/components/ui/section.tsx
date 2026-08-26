import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { Reveal } from '@/components/motion'

export function Container({
  children,
  className,
  size = 'default',
}: {
  children: ReactNode
  className?: string
  size?: 'narrow' | 'default' | 'wide'
}) {
  return (
    <div
      className={cn(
        'mx-auto w-full px-5 sm:px-8',
        size === 'narrow' && 'max-w-3xl',
        size === 'default' && 'max-w-6xl',
        size === 'wide' && 'max-w-[92rem]',
        className,
      )}
    >
      {children}
    </div>
  )
}

export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p
      className={cn(
        'inline-flex items-center gap-2.5 text-2xs font-medium uppercase tracking-[0.22em] text-ink-subtle',
        className,
      )}
    >
      <span aria-hidden="true" className="h-px w-8 bg-linear-to-r from-brand to-transparent" />
      {children}
    </p>
  )
}

export function SectionHeader({
  eyebrow,
  title,
  lead,
  align = 'left',
  className,
  action,
}: {
  eyebrow?: string
  title: ReactNode
  lead?: ReactNode
  align?: 'left' | 'center'
  className?: string
  action?: ReactNode
}) {
  return (
    <div
      className={cn(
        'flex flex-col gap-6',
        align === 'center' && 'items-center text-center',
        action && 'md:flex-row md:items-end md:justify-between',
        className,
      )}
    >
      <div className={cn('max-w-2xl space-y-4', align === 'center' && 'mx-auto')}>
        {eyebrow ? (
          <Reveal direction="up" amount={0.4}>
            <Eyebrow>{eyebrow}</Eyebrow>
          </Reveal>
        ) : null}
        <Reveal direction="up" delay={0.06}>
          <h2 className="text-title text-ink">{title}</h2>
        </Reveal>
        {lead ? (
          <Reveal direction="up" delay={0.12}>
            <p className="text-lead text-ink-muted">{lead}</p>
          </Reveal>
        ) : null}
      </div>
      {action ? (
        <Reveal direction="up" delay={0.18} className="shrink-0">
          {action}
        </Reveal>
      ) : null}
    </div>
  )
}
