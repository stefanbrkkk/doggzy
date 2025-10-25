// Accessibility utilities and helpers

export interface AccessibilityOptions {
  reducedMotion?: boolean
  highContrast?: boolean
  fontSize?: 'small' | 'medium' | 'large'
  focusVisible?: boolean
}

// Check user preferences for reduced motion
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

// Check user preferences for high contrast
export function prefersHighContrast(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-contrast: high)').matches
}

// Check user preferences for dark mode
export function prefersDarkMode(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

// Focus management utilities
export class FocusManager {
  private static instance: FocusManager
  private focusStack: HTMLElement[] = []

  static getInstance(): FocusManager {
    if (!FocusManager.instance) {
      FocusManager.instance = new FocusManager()
    }
    return FocusManager.instance
  }

  // Trap focus within an element
  trapFocus(element: HTMLElement): void {
    const focusableElements = this.getFocusableElements(element)
    if (focusableElements.length === 0) return

    const firstElement = focusableElements[0]
    const lastElement = focusableElements[focusableElements.length - 1]

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault()
            lastElement.focus()
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault()
            firstElement.focus()
          }
        }
      }
    }

    element.addEventListener('keydown', handleKeyDown)
    firstElement.focus()

    // Return cleanup function
    return () => {
      element.removeEventListener('keydown', handleKeyDown)
    }
  }

  // Get all focusable elements within a container
  getFocusableElements(container: HTMLElement): HTMLElement[] {
    const focusableSelectors = [
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      'a[href]',
      '[tabindex]:not([tabindex="-1"])',
      '[contenteditable="true"]'
    ].join(', ')

    return Array.from(container.querySelectorAll(focusableSelectors))
  }

  // Save current focus and restore later
  saveFocus(): void {
    const activeElement = document.activeElement as HTMLElement
    if (activeElement) {
      this.focusStack.push(activeElement)
    }
  }

  restoreFocus(): void {
    const element = this.focusStack.pop()
    if (element) {
      element.focus()
    }
  }
}

// ARIA live region announcer
export class LiveAnnouncer {
  private static instance: LiveAnnouncer
  private liveRegion: HTMLElement | null = null

  static getInstance(): LiveAnnouncer {
    if (!LiveAnnouncer.instance) {
      LiveAnnouncer.instance = new LiveAnnouncer()
    }
    return LiveAnnouncer.instance
  }

  private createLiveRegion(): HTMLElement {
    const region = document.createElement('div')
    region.setAttribute('aria-live', 'polite')
    region.setAttribute('aria-atomic', 'true')
    region.style.position = 'absolute'
    region.style.left = '-10000px'
    region.style.width = '1px'
    region.style.height = '1px'
    region.style.overflow = 'hidden'
    document.body.appendChild(region)
    return region
  }

  announce(message: string, priority: 'polite' | 'assertive' = 'polite'): void {
    if (!this.liveRegion) {
      this.liveRegion = this.createLiveRegion()
    }

    this.liveRegion.setAttribute('aria-live', priority)
    this.liveRegion.textContent = message

    // Clear after announcement
    setTimeout(() => {
      if (this.liveRegion) {
        this.liveRegion.textContent = ''
      }
    }, 1000)
  }
}

// Color contrast utilities
export function getContrastRatio(color1: string, color2: string): number {
  const getLuminance = (color: string): number => {
    const rgb = hexToRgb(color)
    if (!rgb) return 0

    const [r, g, b] = [rgb.r, rgb.g, rgb.b].map(c => {
      c = c / 255
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
    })

    return 0.2126 * r + 0.7152 * g + 0.0722 * b
  }

  const lum1 = getLuminance(color1)
  const lum2 = getLuminance(color2)
  const brightest = Math.max(lum1, lum2)
  const darkest = Math.min(lum1, lum2)

  return (brightest + 0.05) / (darkest + 0.05)
}

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null
}

// Check if contrast ratio meets WCAG guidelines
export function meetsContrastRequirement(
  color1: string, 
  color2: string, 
  level: 'AA' | 'AAA' = 'AA',
  size: 'normal' | 'large' = 'normal'
): boolean {
  const ratio = getContrastRatio(color1, color2)
  
  if (level === 'AAA') {
    return size === 'large' ? ratio >= 4.5 : ratio >= 7
  } else {
    return size === 'large' ? ratio >= 3 : ratio >= 4.5
  }
}

// Keyboard navigation helpers
export function handleArrowKeyNavigation(
  event: KeyboardEvent,
  items: HTMLElement[],
  currentIndex: number,
  orientation: 'horizontal' | 'vertical' = 'horizontal'
): number {
  const { key } = event
  let newIndex = currentIndex

  if (orientation === 'horizontal') {
    if (key === 'ArrowLeft') {
      newIndex = currentIndex > 0 ? currentIndex - 1 : items.length - 1
    } else if (key === 'ArrowRight') {
      newIndex = currentIndex < items.length - 1 ? currentIndex + 1 : 0
    }
  } else {
    if (key === 'ArrowUp') {
      newIndex = currentIndex > 0 ? currentIndex - 1 : items.length - 1
    } else if (key === 'ArrowDown') {
      newIndex = currentIndex < items.length - 1 ? currentIndex + 1 : 0
    }
  }

  if (newIndex !== currentIndex) {
    event.preventDefault()
    items[newIndex]?.focus()
  }

  return newIndex
}

// Screen reader utilities
export function announceToScreenReader(message: string): void {
  const announcer = LiveAnnouncer.getInstance()
  announcer.announce(message)
}

// Skip link utilities
export function createSkipLink(targetId: string, text: string): HTMLElement {
  const skipLink = document.createElement('a')
  skipLink.href = `#${targetId}`
  skipLink.textContent = text
  skipLink.className = 'sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50 bg-primary text-primary-foreground px-4 py-2 rounded-md font-medium'
  
  return skipLink
}

// Validate form accessibility
export function validateFormAccessibility(form: HTMLFormElement): string[] {
  const issues: string[] = []
  
  // Check for labels
  const inputs = form.querySelectorAll('input, select, textarea')
  inputs.forEach(input => {
    const id = input.getAttribute('id')
    const ariaLabel = input.getAttribute('aria-label')
    const ariaLabelledBy = input.getAttribute('aria-labelledby')
    
    if (!id || (!ariaLabel && !ariaLabelledBy && !form.querySelector(`label[for="${id}"]`))) {
      issues.push(`Input missing proper label: ${input.tagName}`)
    }
  })
  
  // Check for fieldsets with legends
  const fieldsets = form.querySelectorAll('fieldset')
  fieldsets.forEach(fieldset => {
    if (!fieldset.querySelector('legend')) {
      issues.push('Fieldset missing legend')
    }
  })
  
  return issues
}

// Initialize accessibility features
export function initializeAccessibility(): void {
  // Add focus-visible polyfill behavior
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      document.body.classList.add('keyboard-navigation')
    }
  })
  
  document.addEventListener('mousedown', () => {
    document.body.classList.remove('keyboard-navigation')
  })
  
  // Respect user preferences
  if (prefersReducedMotion()) {
    document.documentElement.style.setProperty('--animation-duration', '0.01ms')
  }
  
  if (prefersHighContrast()) {
    document.documentElement.classList.add('high-contrast')
  }
}
