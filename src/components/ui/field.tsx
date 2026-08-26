'use client'

import { forwardRef, useId } from 'react'
import { cn } from '@/lib/utils'

const control = [
  'w-full rounded-xl border border-line-interactive bg-sunken px-4 text-ink',
  'placeholder:text-ink-subtle',
  'transition-[border-color,box-shadow,background-color] duration-200 ease-swift',
  'hover:border-line-strong',
  'focus:border-brand focus:outline-none focus:ring-4 focus:ring-brand/15',
  'disabled:cursor-not-allowed disabled:opacity-50',
  'aria-invalid:border-critical aria-invalid:ring-critical/15',
].join(' ')

interface FieldShellProps {
  label: string
  hint?: string
  error?: string
  required?: boolean
  /** Visually hides the label but keeps it for assistive tech. */
  hideLabel?: boolean
  className?: string
  children: (props: {
    id: string
    describedBy: string | undefined
    invalid: boolean
  }) => React.ReactNode
}

/**
 * Owns the label/hint/error wiring so every control in the app announces
 * itself identically: one id, one `aria-describedby`, one `aria-invalid`.
 */
export function Field({
  label,
  hint,
  error,
  required,
  hideLabel,
  className,
  children,
}: FieldShellProps) {
  const id = useId()
  const hintId = hint ? `${id}-hint` : undefined
  const errorId = error ? `${id}-error` : undefined
  const describedBy = [errorId, hintId].filter(Boolean).join(' ') || undefined

  return (
    <div className={cn('space-y-2', className)}>
      <label
        htmlFor={id}
        className={cn('block text-sm font-medium text-ink', hideLabel && 'sr-only')}
      >
        {label}
        {required ? (
          <span className="ml-1 text-brand-text" aria-hidden="true">
            *
          </span>
        ) : null}
      </label>

      {children({ id, describedBy, invalid: Boolean(error) })}

      {error ? (
        <p id={errorId} className="text-sm text-critical" role="alert">
          {error}
        </p>
      ) : hint ? (
        <p id={hintId} className="text-sm text-ink-subtle">
          {hint}
        </p>
      ) : null}
    </div>
  )
}

export const Input = forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  function Input({ className, ...props }, ref) {
    return <input ref={ref} className={cn(control, 'h-12', className)} {...props} />
  },
)

export const Textarea = forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(function Textarea({ className, rows = 5, ...props }, ref) {
  return (
    <textarea
      ref={ref}
      rows={rows}
      className={cn(control, 'py-3 leading-relaxed', className)}
      {...props}
    />
  )
})

export const Select = forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement>>(
  function Select({ className, children, ...props }, ref) {
    return (
      <select ref={ref} className={cn(control, 'h-12 appearance-none pr-10', className)} {...props}>
        {children}
      </select>
    )
  },
)
