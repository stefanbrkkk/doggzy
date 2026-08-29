import { forwardRef } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

/**
 * Button styles are exported separately from the component so anchors and
 * Next.js <Link>s can wear the same skin without an `asChild` polymorphism
 * layer — one class function, no extra runtime.
 */
export const buttonStyles = cva(
  [
    'group/btn relative inline-flex items-center justify-center gap-2 overflow-hidden',
    'font-medium whitespace-nowrap select-none',
    'transition-[transform,box-shadow,background-color,border-color,color] duration-300 ease-out-expo',
    'focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-brand',
    'disabled:pointer-events-none disabled:opacity-45',
    'active:scale-[0.97]',
  ],
  {
    variants: {
      variant: {
        primary: [
          'bg-brand text-brand-ink',
          'shadow-[0_1px_0_0_oklch(1_0_0/0.25)_inset]',
          'hover:shadow-glow hover:-translate-y-0.5',
        ],
        accent: [
          'bg-accent text-brand-ink',
          '[--glow-ring:oklch(0.828_0.126_196/0.34)] [--glow-spread:oklch(0.828_0.126_196/0.42)]',
          'hover:shadow-glow hover:-translate-y-0.5',
        ],
        secondary: [
          'bg-elevated text-ink border border-line',
          'hover:border-line-strong hover:-translate-y-0.5 hover:shadow-lift',
        ],
        outline: [
          'border border-line-strong text-ink bg-transparent',
          'hover:bg-elevated hover:-translate-y-0.5',
        ],
        ghost: ['text-ink-muted hover:text-ink hover:bg-elevated'],
        danger: ['bg-critical text-brand-ink hover:-translate-y-0.5 hover:brightness-110'],
        link: ['text-brand-text underline-offset-4 hover:underline px-0! h-auto!'],
      },
      size: {
        sm: 'h-9 rounded-xl px-3.5 text-sm',
        md: 'h-11 rounded-xl px-5 text-sm',
        lg: 'h-13 rounded-2xl px-7 text-base',
        xl: 'h-16 rounded-3xl px-9 text-lg',
        icon: 'h-11 w-11 rounded-xl',
        'icon-sm': 'h-9 w-9 rounded-lg',
      },
      full: {
        true: 'w-full',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  },
)

export type ButtonVariants = VariantProps<typeof buttonStyles>

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, ButtonVariants {
  /** Sweeps a specular highlight across the face on hover. */
  sheen?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant, size, full, sheen = true, children, type = 'button', ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      className={cn(buttonStyles({ variant, size, full }), className)}
      {...props}
    >
      {sheen ? <Sheen /> : null}
      <span className="relative z-10 inline-flex items-center gap-2">{children}</span>
    </button>
  )
})

/** The moving highlight. Pure transform, so it never triggers layout. */
export function Sheen() {
  return (
    <span
      aria-hidden="true"
      data-decor
      className={cn(
        'pointer-events-none absolute inset-0 -translate-x-full skew-x-12',
        'bg-linear-to-r from-transparent via-white/25 to-transparent',
        'transition-transform duration-700 ease-out-expo',
        'group-hover/btn:translate-x-full',
      )}
    />
  )
}
