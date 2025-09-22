import { useState, useCallback } from 'react'
import { FormType } from './form-validation'

export interface FormSubmissionResponse {
  success: boolean
  id?: string
  message?: string
  timestamp?: string
  error?: string
  code?: string
  fieldErrors?: Record<string, string[]>
}

export interface UseFormOptions {
  onSuccess?: (response: FormSubmissionResponse) => void
  onError?: (response: FormSubmissionResponse) => void
}

export interface UseFormReturn {
  isSubmitting: boolean
  isSuccess: boolean
  error: string | null
  fieldErrors: Record<string, string[]>
  submitForm: (formType: FormType, data: Record<string, unknown>) => Promise<void>
  reset: () => void
}

export function useForm(options: UseFormOptions = {}): UseFormReturn {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({})

  const reset = useCallback(() => {
    setIsSubmitting(false)
    setIsSuccess(false)
    setError(null)
    setFieldErrors({})
  }, [])

  const submitForm = useCallback(async (formType: FormType, data: Record<string, unknown>) => {
    setIsSubmitting(true)
    setError(null)
    setFieldErrors({})
    setIsSuccess(false)

    try {
      const response = await fetch('/api/forms/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          formType,
          ...data,
        }),
      })

      const result: FormSubmissionResponse = await response.json()

      if (result.success) {
        setIsSuccess(true)
        options.onSuccess?.(result)
      } else {
        setError(result.error || 'An error occurred')
        if (result.fieldErrors) {
          setFieldErrors(result.fieldErrors)
        }
        options.onError?.(result)
      }
    } catch {
      const errorMessage = 'Network error. Please check your connection and try again.'
      setError(errorMessage)
      options.onError?.({
        success: false,
        error: errorMessage,
        code: 'NETWORK_ERROR'
      })
    } finally {
      setIsSubmitting(false)
    }
  }, [options])

  return {
    isSubmitting,
    isSuccess,
    error,
    fieldErrors,
    submitForm,
    reset,
  }
}

// Utility to get field error message
export function getFieldError(fieldErrors: Record<string, string[]>, fieldName: string): string | undefined {
  const errors = fieldErrors[fieldName]
  return errors && errors.length > 0 ? errors[0] : undefined
}

// Utility to check if field has error
export function hasFieldError(fieldErrors: Record<string, string[]>, fieldName: string): boolean {
  return fieldName in fieldErrors && fieldErrors[fieldName].length > 0
}
