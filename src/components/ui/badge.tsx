import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

export const badgeStyles = cva(
  'inline-flex items-center gap-1.5 rounded-full border font-medium whitespace-nowrap',
  {
    variants: {
      tone: {
        neutral: 'border-line bg-elevated text-ink-muted',
        brand: 'border-brand/30 bg-brand/10 text-brand-text',
        accent: 'border-accent/30 bg-accent/10 text-accent-text',
        positive: 'border-positive/30 bg-positive/10 text-positive',
        critical: 'border-critical/30 bg-critical/10 text-critical',
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
