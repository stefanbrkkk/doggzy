import { NextRequest, NextResponse } from 'next/server'
import { validateFormData, formatValidationErrors, FormType } from '@/lib/form-validation'

// Simple in-memory rate limiting
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

function rateLimit(ip: string, maxRequests = 10, windowMs = 60000): boolean {
  const now = Date.now()
  const windowStart = now - windowMs
  
  const current = rateLimitMap.get(ip)
  if (!current || current.resetTime < windowStart) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs })
    return true
  }
  
  if (current.count >= maxRequests) {
    return false
  }
  
  current.count++
  return true
}

// Sanitize string input
function sanitizeString(input: unknown, maxLength: number = 1000): string {
  if (typeof input !== 'string') return ''
  return input.trim().substring(0, maxLength)
}

// Sanitize form data
function sanitizeFormData(data: Record<string, unknown>): Record<string, unknown> {
  const sanitized: Record<string, unknown> = {}
  
  for (const [key, value] of Object.entries(data)) {
    if (typeof value === 'string') {
      sanitized[key] = sanitizeString(value, key === 'message' || key === 'description' ? 2000 : 500)
    } else if (typeof value === 'boolean' || typeof value === 'number') {
      sanitized[key] = value
    } else if (Array.isArray(value)) {
      sanitized[key] = value.map(item => typeof item === 'string' ? sanitizeString(item, 100) : item)
    } else {
      sanitized[key] = value
    }
  }
  
  return sanitized
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
    if (!rateLimit(ip)) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Too many requests. Please try again later.',
          code: 'RATE_LIMIT_EXCEEDED'
        },
        { status: 429 }
      )
    }
    
    // Parse and validate content length
    const contentLength = request.headers.get('content-length')
    if (contentLength && parseInt(contentLength) > 50000) { // 50KB limit
      return NextResponse.json(
        { 
          success: false,
          error: 'Request too large. Please reduce the amount of information.',
          code: 'REQUEST_TOO_LARGE'
        },
        { status: 413 }
      )
    }
    
    const body = await request.json()
    const formType = body.formType as FormType
    
    // Validate form type
    if (!formType || !['contact', 'adopt', 'foster', 'careers', 'report'].includes(formType)) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Invalid form type.',
          code: 'INVALID_FORM_TYPE'
        },
        { status: 400 }
      )
    }
    
    // Sanitize input first
    const sanitizedData = sanitizeFormData(body)
    
    // Validate form data with Zod schemas
    const validation = validateFormData(sanitizedData, formType)
    if (!validation.success) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Validation failed. Please check your input.',
          code: 'VALIDATION_ERROR',
          fieldErrors: formatValidationErrors(validation.errors!)
        },
        { status: 422 }
      )
    }
    
    // Generate submission ID
    const submissionId = `${formType}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    // Prepare submission data
    const submissionData = {
      id: submissionId,
      formType,
      data: validation.data,
      metadata: {
        ip,
        userAgent: request.headers.get('user-agent'),
        timestamp: new Date().toISOString(),
        referrer: request.headers.get('referer'),
      }
    }
    
    // Log submission (in production, you'd save to database and send email)
    const logData = validation.data as Record<string, unknown>
    console.log(`[Form Submission] ${submissionId}:`, {
      type: formType,
      name: logData?.name || logData?.firstName,
      email: logData?.email,
      timestamp: submissionData.metadata.timestamp,
      ip,
    })
    
    // TODO: In production, implement:
    // 1. Save to database
    // 2. Send notification email to team
    // 3. Send confirmation email to user
    // 4. Add to CRM/pipeline
    // 5. Trigger any automation workflows
    
    // Form-specific success messages
    const successMessages = {
      contact: 'Thank you for contacting us! We\'ll get back to you within 24 hours.',
      adopt: 'Thank you for your adoption application! We\'ll review it and contact you within 48 hours.',
      foster: 'Thank you for your foster application! We\'ll be in touch soon with next steps.',
      careers: 'Thank you for your job application! We\'ll review it and get back to you soon.',
      report: 'Thank you for your report. We take all reports seriously and will follow up appropriately.'
    }
    
    return NextResponse.json({
      success: true,
      id: submissionId,
      message: successMessages[formType],
      timestamp: submissionData.metadata.timestamp
    }, {
      status: 200,
      headers: {
        'Cache-Control': 'no-store',
        'Content-Type': 'application/json',
      },
    })
    
  } catch (error) {
    console.error('Form submission error:', error)
    
    // Don't expose internal errors to client
    return NextResponse.json(
      { 
        success: false,
        error: 'An unexpected error occurred. Please try again.',
        code: 'INTERNAL_ERROR'
      },
      { status: 500 }
    )
  }
}
