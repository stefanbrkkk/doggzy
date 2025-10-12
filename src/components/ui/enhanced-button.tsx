'use client'

import { forwardRef, ButtonHTMLAttributes } from 'react'
import { motion, HTMLMotionProps } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'

interface EnhancedButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type'> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link' | 'glow'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  loading?: boolean
  loadingText?: string
  ripple?: boolean
  type?: 'button' | 'submit' | 'reset'
}

const buttonVariants = {
  default: "bg-primary text-primary-foreground hover:bg-primary/90 micro-bounce",
  destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 micro-bounce",
  outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground micro-float",
  secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 micro-float",
  ghost: "hover:bg-accent hover:text-accent-foreground micro-float",
  link: "text-primary underline-offset-4 hover:underline micro-float",
  glow: "bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600 shadow-lg hover:shadow-xl micro-glow"
}

const sizeVariants = {
  default: "h-10 px-4 py-2",
  sm: "h-9 rounded-md px-3",
  lg: "h-11 rounded-md px-8",
  icon: "h-10 w-10"
}

export const EnhancedButton = forwardRef<
  HTMLButtonElement,
  EnhancedButtonProps & HTMLMotionProps<"button">
>(({
  className,
  variant = 'default',
  size = 'default',
  loading = false,
  loadingText,
  ripple = true,
  children,
  disabled,
  onClick,
  ...props
}, ref) => {
  const isDisabled = disabled || loading

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (ripple && !isDisabled) {
      const button = event.currentTarget
      const rect = button.getBoundingClientRect()
      const size = Math.max(rect.width, rect.height)
      const x = event.clientX - rect.left - size / 2
      const y = event.clientY - rect.top - size / 2
      
      const ripple = document.createElement('span')
      ripple.style.cssText = `
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        transform: scale(0);
        animation: ripple 0.6s linear;
        left: ${x}px;
        top: ${y}px;
        width: ${size}px;
        height: ${size}px;
        pointer-events: none;
      `
      
      button.appendChild(ripple)
      
      setTimeout(() => {
        ripple.remove()
      }, 600)
    }
    
    onClick?.(event)
  }

  return (
    <motion.button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 relative overflow-hidden",
        buttonVariants[variant],
        sizeVariants[size],
        className
      )}
      disabled={isDisabled}
      onClick={handleClick}
      whileHover={{ scale: isDisabled ? 1 : 1.02 }}
      whileTap={{ scale: isDisabled ? 1 : 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      {...props}
    >
      {loading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          {loadingText || 'Loading...'}
        </>
      ) : (
        children
      )}
    </motion.button>
  )
})

EnhancedButton.displayName = "EnhancedButton"

// Add ripple animation to global styles
if (typeof document !== 'undefined') {
  const style = document.createElement('style')
  style.textContent = `
    @keyframes ripple {
      to {
        transform: scale(4);
        opacity: 0;
      }
    }
  `
  document.head.appendChild(style)
}
