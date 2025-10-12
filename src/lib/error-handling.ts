// Comprehensive error handling system with Serbian messages
/* eslint-disable @typescript-eslint/no-explicit-any */

export interface AppError {
  code: string
  message: string
  details?: any
  timestamp: number
  userId?: string
  context?: Record<string, any>
}

export class DoggzyError extends Error {
  public code: string
  public details?: any
  public timestamp: number
  public userId?: string
  public context?: Record<string, any>

  constructor(
    code: string,
    message: string,
    details?: any,
    context?: Record<string, any>
  ) {
    super(message)
    this.name = 'DoggzyError'
    this.code = code
    this.details = details
    this.timestamp = Date.now()
    this.context = context
  }

  toJSON(): AppError {
    return {
      code: this.code,
      message: this.message,
      details: this.details,
      timestamp: this.timestamp,
      userId: this.userId,
      context: this.context
    }
  }
}

// Serbian error messages
export const errorMessages = {
  // Network errors
  NETWORK_ERROR: 'Greška sa mrežom. Proverite internetsku konekciju.',
  TIMEOUT_ERROR: 'Zahtev je istekao. Molimo pokušajte ponovo.',
  SERVER_ERROR: 'Greška na serveru. Molimo pokušajte kasnije.',
  
  // Authentication errors
  AUTH_REQUIRED: 'Potrebna je prijava za pristup ovoj stranici.',
  AUTH_INVALID: 'Neispravni podaci za prijavu.',
  AUTH_EXPIRED: 'Sesija je istekla. Molimo prijavite se ponovo.',
  AUTH_FORBIDDEN: 'Nemate dozvolu za ovu akciju.',
  
  // Form validation errors
  VALIDATION_ERROR: 'Molimo proverite unete podatke.',
  REQUIRED_FIELD: 'Ovo polje je obavezno.',
  INVALID_EMAIL: 'Molimo unesite validnu email adresu.',
  INVALID_PHONE: 'Molimo unesite valjan broj telefona.',
  PASSWORD_TOO_SHORT: 'Lozinka mora imati najmanje 8 karaktera.',
  PASSWORDS_DONT_MATCH: 'Lozinke se ne poklapaju.',
  
  // File upload errors
  FILE_TOO_LARGE: 'Fajl je prevelik. Maksimalna veličina je {maxSize}MB.',
  INVALID_FILE_TYPE: 'Nepodržan tip fajla. Dozvoljeni tipovi: {allowedTypes}.',
  UPLOAD_FAILED: 'Otpremanje fajla nije uspelo. Molimo pokušajte ponovo.',
  
  // Content errors
  CONTENT_NOT_FOUND: 'Traženi sadržaj nije pronađen.',
  CONTENT_UNAVAILABLE: 'Sadržaj trenutno nije dostupan.',
  
  // Payment errors
  PAYMENT_FAILED: 'Plaćanje nije uspelo. Molimo pokušajte ponovo.',
  PAYMENT_DECLINED: 'Plaćanje je odbačeno. Proverite podatke kartice.',
  PAYMENT_PROCESSING: 'Plaćanje se obrađuje...',
  
  // Product errors
  PRODUCT_NOT_FOUND: 'Proizvod nije pronađen.',
  OUT_OF_STOCK: 'Proizvod trenutno nije na stanju.',
  INVALID_QUANTITY: 'Neispravna količina.',
  
  // Contact form errors
  CONTACT_SEND_FAILED: 'Slanje poruke nije uspelo. Molimo pokušajte ponovo.',
  SPAM_DETECTED: 'Poruka je označena kao spam. Molimo kontaktirajte nas direktno.',
  
  // Admin errors
  ADMIN_ACCESS_REQUIRED: 'Potreban je administratorski pristup.',
  ADMIN_ACTION_FAILED: 'Administratorska akcija nije uspela.',
  
  // Generic errors
  UNKNOWN_ERROR: 'Došlo je do neočekivane greške.',
  TRY_AGAIN_LATER: 'Molimo pokušajte kasnije.',
  CONTACT_SUPPORT: 'Ako se problem nastavi, kontaktirajte podršku.'
} as const

export type ErrorCode = keyof typeof errorMessages

// Error severity levels
export enum ErrorSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

// Error categories for better organization
export enum ErrorCategory {
  NETWORK = 'network',
  AUTH = 'auth',
  VALIDATION = 'validation',
  UPLOAD = 'upload',
  CONTENT = 'content',
  PAYMENT = 'payment',
  ADMIN = 'admin',
  SYSTEM = 'system'
}

// Error handler class
export class ErrorHandler {
  private static instance: ErrorHandler
  private errorLog: AppError[] = []
  private maxLogSize = 100

  static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler()
    }
    return ErrorHandler.instance
  }

  // Handle different types of errors
  handle(error: unknown, context?: Record<string, any>): DoggzyError {
    let appError: DoggzyError

    if (error instanceof DoggzyError) {
      appError = error
    } else if (error instanceof Error) {
      appError = new DoggzyError(
        'UNKNOWN_ERROR',
        error.message || errorMessages.UNKNOWN_ERROR,
        error,
        context
      )
    } else {
      appError = new DoggzyError(
        'UNKNOWN_ERROR',
        errorMessages.UNKNOWN_ERROR,
        error,
        context
      )
    }

    // Log the error
    this.log(appError)

    // Report critical errors
    if (this.isCritical(appError)) {
      this.reportError(appError)
    }

    return appError
  }

  // Log error to internal storage
  private log(error: DoggzyError): void {
    this.errorLog.push(error.toJSON())

    // Keep log size manageable
    if (this.errorLog.length > this.maxLogSize) {
      this.errorLog.shift()
    }

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('DoggzyError:', error.toJSON())
    }
  }

  // Check if error is critical
  private isCritical(error: DoggzyError): boolean {
    const criticalCodes = [
      'SERVER_ERROR',
      'PAYMENT_FAILED',
      'ADMIN_ACTION_FAILED'
    ]
    return criticalCodes.includes(error.code)
  }

  // Report error to external service (implement as needed)
  private reportError(error: DoggzyError): void {
    // In production, you might send to Sentry, LogRocket, etc.
    console.error('Critical error reported:', error.toJSON())
  }

  // Get user-friendly error message
  getUserMessage(error: DoggzyError): string {
    const message = errorMessages[error.code as ErrorCode]
    
    if (!message) {
      return errorMessages.UNKNOWN_ERROR
    }

    // Replace placeholders if any
    if (error.details && typeof message === 'string') {
      return message.replace(/\{(\w+)\}/g, (match, key) => {
        return error.details[key] || match
      })
    }

    return message
  }

  // Get error logs (for admin panel)
  getErrorLogs(): AppError[] {
    return [...this.errorLog]
  }

  // Clear error logs
  clearLogs(): void {
    this.errorLog = []
  }
}

// Global error handler instance
export const errorHandler = ErrorHandler.getInstance()

// Utility functions for common error scenarios
export function createValidationError(field: string, message?: string): DoggzyError {
  return new DoggzyError(
    'VALIDATION_ERROR',
    message || errorMessages.VALIDATION_ERROR,
    { field },
    { type: 'validation' }
  )
}

export function createNetworkError(url: string, status?: number): DoggzyError {
  return new DoggzyError(
    status && status >= 500 ? 'SERVER_ERROR' : 'NETWORK_ERROR',
    status && status >= 500 ? errorMessages.SERVER_ERROR : errorMessages.NETWORK_ERROR,
    { url, status },
    { type: 'network' }
  )
}

export function createAuthError(type: 'required' | 'invalid' | 'expired' | 'forbidden'): DoggzyError {
  const codes = {
    required: 'AUTH_REQUIRED',
    invalid: 'AUTH_INVALID',
    expired: 'AUTH_EXPIRED',
    forbidden: 'AUTH_FORBIDDEN'
  }
  
  const code = codes[type] as ErrorCode
  return new DoggzyError(code, errorMessages[code], { type }, { type: 'auth' })
}

export function createUploadError(type: 'size' | 'type' | 'failed', details?: any): DoggzyError {
  const codes = {
    size: 'FILE_TOO_LARGE',
    type: 'INVALID_FILE_TYPE', 
    failed: 'UPLOAD_FAILED'
  }
  
  const code = codes[type] as ErrorCode
  return new DoggzyError(code, errorMessages[code], details, { type: 'upload' })
}

// Error boundary helper for React components
export function handleComponentError(error: Error, errorInfo: any): void {
  const appError = new DoggzyError(
    'COMPONENT_ERROR',
    'Greška u komponenti',
    { error: error.message, errorInfo },
    { type: 'component' }
  )
  
  errorHandler.handle(appError)
}

// Async error wrapper
export function withErrorHandling<T extends any[], R>(
  fn: (...args: T) => Promise<R>
) {
  return async (...args: T): Promise<R> => {
    try {
      return await fn(...args)
    } catch (error) {
      throw errorHandler.handle(error, { function: fn.name, args })
    }
  }
}

// Form error helper
export function getFieldError(errors: Record<string, any>, field: string): string | undefined {
  const error = errors[field]
  if (!error) return undefined
  
  if (typeof error === 'string') return error
  if (error.message) return error.message
  
  return errorMessages.VALIDATION_ERROR
}

// Initialize error handling
if (typeof window !== 'undefined') {
  // Global error handler for unhandled errors
  window.addEventListener('error', (event) => {
    errorHandler.handle(event.error, { type: 'global', filename: event.filename, lineno: event.lineno })
  })

  // Global handler for unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    errorHandler.handle(event.reason, { type: 'promise' })
  })
}
