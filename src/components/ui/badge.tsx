import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

/**
 * Opaque fills, not tinted ones.
 *
 * A badge is usually sitting on a card's generative artwork rather than on a
 * flat surface, and a 10% fill let that artwork through as the effective
 * background — so the contrast the token pair promises was never what landed on
 * screen. Measured over the covers in the light theme: `Traži dom` 3.55:1,
 * `Udomljen` 3.51:1, `bestseler` 3.44:1, all against the 4.5:1 that 11px type
 * needs; `Nestala` failed in the dark theme too, at 4.20:1. The `neutral` tone,
 * the one already opaque, measured 7.39:1 in the same row — which is the proof.
 *
 * Mixing into `--elevated` keeps the appearance where the parent already is
 * elevated (an opaque 12% mix and a 10% tint over the same colour are within a
 * hair of each other) and only changes what happens over artwork, which is
 * exactly where it was wrong.
 */
export const badgeStyles = cva(
  'inline-flex items-center gap-1.5 rounded-full border font-medium whitespace-nowrap',
  {
    variants: {
      tone: {
        neutral: 'border-line bg-elevated text-ink-muted',
        brand:
          'border-brand/30 bg-[color-mix(in_oklch,var(--elevated)_88%,var(--brand))] text-brand-text',
        accent:
          'border-accent/30 bg-[color-mix(in_oklch,var(--elevated)_88%,var(--accent))] text-accent-text',
        positive:
          'border-positive/30 bg-[color-mix(in_oklch,var(--elevated)_88%,var(--positive))] text-positive',
        critical:
          'border-critical/30 bg-[color-mix(in_oklch,var(--elevated)_88%,var(--critical))] text-critical',
      },
      size: {
        sm: 'px-2 py-0.5 text-2xs uppercase tracking-widest',
        md: 'px-3 py-1 text-xs',
        lg: 'px-4 py-1.5 text-sm',
      },
    },
    defaultVariants: { tone: 'neutral', size: 'md' },
  },
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeStyles> {}

export function Badge({ className, tone, size, ...props }: BadgeProps) {
  return <span className={cn(badgeStyles({ tone, size }), className)} {...props} />
}
