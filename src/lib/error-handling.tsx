// Enhanced error handling and monitoring

export interface ErrorInfo {
  message: string
  stack?: string
  componentStack?: string
  errorBoundary?: string
  timestamp: number
  url: string
  userAgent: string
  userId?: string
}

export class ErrorLogger {
  private static instance: ErrorLogger
  private errors: ErrorInfo[] = []

  static getInstance(): ErrorLogger {
    if (!ErrorLogger.instance) {
      ErrorLogger.instance = new ErrorLogger()
    }
    return ErrorLogger.instance
  }

  logError(error: Error, errorInfo?: any): void {
    const errorData: ErrorInfo = {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo?.componentStack,
      errorBoundary: errorInfo?.errorBoundary,
      timestamp: Date.now(),
      url: typeof window !== 'undefined' ? window.location.href : '',
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : '',
    }

    this.errors.push(errorData)

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error logged:', errorData)
    }

    // Send to monitoring service in production
    if (process.env.NODE_ENV === 'production') {
      this.sendToMonitoringService(errorData)
    }
  }

  private async sendToMonitoringService(errorData: ErrorInfo): Promise<void> {
    try {
      // Example: Send to Sentry, LogRocket, or custom endpoint
      await fetch('/api/errors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(errorData),
      })
    } catch (err) {
      console.error('Failed to send error to monitoring service:', err)
    }
  }

  getErrors(): ErrorInfo[] {
    return [...this.errors]
  }

  clearErrors(): void {
    this.errors = []
  }
}

// React Error Boundary Component
export class ErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ComponentType<{ error: Error }> },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: any) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: any) {
    const logger = ErrorLogger.getInstance()
    logger.logError(error, {
      ...errorInfo,
      errorBoundary: this.constructor.name,
    })
  }

  render() {
    if (this.state.hasError) {
      const Fallback = this.props.fallback || DefaultErrorFallback
      return <Fallback error={this.state.error!} />
    }

    return this.props.children
  }
}

// Default error fallback component
function DefaultErrorFallback({ error }: { error: Error }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20">
      <div className="max-w-md mx-auto text-center p-8">
        <div className="mb-6">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Oops! Something went wrong
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            We're sorry for the inconvenience. Please try refreshing the page or contact support if the problem persists.
          </p>
        </div>
        
        <div className="space-y-3">
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-orange-600 hover:to-red-600 transition-all duration-300"
          >
            Refresh Page
          </button>
          <button
            onClick={() => window.location.href = '/'}
            className="w-full bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300"
          >
            Go Home
          </button>
        </div>
        
        {process.env.NODE_ENV === 'development' && (
          <details className="mt-6 text-left">
            <summary className="cursor-pointer text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">
              Error Details (Development)
            </summary>
            <pre className="mt-2 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg text-xs text-gray-800 dark:text-gray-200 overflow-auto">
              {error.stack}
            </pre>
          </details>
        )}
      </div>
    </div>
  )
}

// Form validation helpers
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function validatePhone(phone: string): boolean {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/
  return phoneRegex.test(phone.replace(/\s/g, ''))
}

export function validateRequired(value: string): boolean {
  return value.trim().length > 0
}

// API error handling
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

export async function handleApiResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new ApiError(
      errorData.message || `HTTP ${response.status}: ${response.statusText}`,
      response.status,
      errorData.code
    )
  }
  
  return response.json()
}

// Retry mechanism for failed requests
export async function retryAsync<T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  delay = 1000
): Promise<T> {
  let lastError: Error
  
  for (let i = 0; i <= maxRetries; i++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error as Error
      
      if (i === maxRetries) {
        throw lastError
      }
      
      // Exponential backoff
      await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)))
    }
  }
  
  throw lastError!
}

// Global error handler setup
export function setupGlobalErrorHandling(): void {
  if (typeof window === 'undefined') return
  
  const logger = ErrorLogger.getInstance()
  
  // Handle unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    logger.logError(new Error(`Unhandled Promise Rejection: ${event.reason}`))
    event.preventDefault()
  })
  
  // Handle JavaScript errors
  window.addEventListener('error', (event) => {
    logger.logError(new Error(event.message), {
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
    })
  })
  
  // Handle resource loading errors
  window.addEventListener('error', (event) => {
    if (event.target !== window) {
      logger.logError(new Error(`Resource loading error: ${(event.target as any)?.src || 'Unknown resource'}`))
    }
  }, true)
}

import React from 'react'