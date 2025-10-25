import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 relative overflow-hidden group",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 text-white hover:from-orange-600 hover:via-red-600 hover:to-pink-600 hover:scale-105 hover:shadow-glow active:scale-95 animate-gradient-shift",
        destructive:
          "bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 hover:scale-105 hover:shadow-lg hover:shadow-red-500/50 active:scale-95",
        outline:
          "border-2 border-orange-500/30 bg-transparent backdrop-blur-sm hover:border-orange-500 hover:bg-orange-500/10 hover:scale-105 hover:shadow-glow text-foreground",
        secondary:
          "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-900 hover:from-gray-200 hover:to-gray-300 hover:scale-105 dark:from-gray-800 dark:to-gray-700 dark:text-white dark:hover:from-gray-700 dark:hover:to-gray-600",
        ghost: "hover:bg-accent/50 hover:text-accent-foreground hover:scale-105 backdrop-blur-sm",
        link: "text-orange-500 underline-offset-4 hover:underline hover:text-orange-600 transition-colors",
        glow: "bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 text-white shadow-glow hover:shadow-glow-lg hover:scale-110 animate-pulse-glow relative before:absolute before:inset-0 before:bg-gradient-to-r before:from-white/20 before:via-transparent before:to-transparent before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-700",
        glass: "glass text-white hover:glass-intense hover:scale-105 hover:shadow-glass-lg backdrop-blur-md border border-white/20",
        gradient: "bg-mesh-gradient text-white hover:scale-105 hover:shadow-xl animate-gradient-shift",
        neo: "bg-gradient-to-br from-white to-gray-100 text-gray-900 shadow-lg hover:shadow-xl hover:scale-105 border border-gray-200/50 dark:from-gray-800 dark:to-gray-900 dark:text-white dark:border-gray-700/50",
      },
      size: {
        default: "h-11 px-6 py-2 text-sm",
        sm: "h-9 rounded-lg px-4 text-xs",
        lg: "h-13 rounded-xl px-10 text-base font-semibold",
        xl: "h-16 rounded-2xl px-12 text-lg font-bold",
        icon: "h-11 w-11 rounded-xl",
        "icon-sm": "h-9 w-9 rounded-lg",
        "icon-lg": "h-13 w-13 rounded-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
