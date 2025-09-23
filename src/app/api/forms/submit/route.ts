import { NextRequest, NextResponse } from 'next/server'
import { validateFormData, formatValidationErrors, FormType } from '@/lib/form-validation'
import { Resend } from 'resend'

// Force Node.js runtime for Resend
export const runtime = 'nodejs'

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY)

// Email recipient mapping
const EMAIL_RECIPIENTS = {
  contact: 'contact@doggzy.online',
  adopt: 'adoption@doggzy.online',
  foster: 'adoption@doggzy.online',
  careers: 'care@doggzy.online',
  report: 'reports@doggzy.online',
} as const

// Get recipient email with fallback
function getRecipientEmail(formType: FormType): string {
  return EMAIL_RECIPIENTS[formType] || 'care@doggzy.online'
}

// Generate subject line
function generateSubject(formType: FormType, data: Record<string, unknown>): string {
  const name = data.name || data.firstName || 'Someone'
  const subjects = {
    contact: `CONTACT: ${data.subject || 'New Message'} - ${name}`,
    adopt: `ADOPT: New Application - ${name}`,
    foster: `FOSTER: New Application - ${name}`,
    careers: `CAREERS: ${data.position || 'Application'} - ${name}`,
    report: `REPORT: ${data.anonymous ? 'Anonymous' : name} - ${data.location}`,
  }
  return subjects[formType] || `FORM: ${formType.toUpperCase()} - ${name}`
}

// Generate HTML email content
function generateEmailHTML(formType: FormType, data: Record<string, unknown>, metadata: any): string {
  const formattedData = Object.entries(data)
    .filter(([key]) => key !== 'website') // Exclude honeypot
    .map(([key, value]) => {
      const label = key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')
      return `<tr><td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #eee;">${label}:</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${value || 'Not provided'}</td></tr>`
    })
    .join('')

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Form Submission - ${formType.toUpperCase()}</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #f97316, #dc2626); padding: 20px; text-align: center; margin-bottom: 20px;">
          <h1 style="color: white; margin: 0; font-size: 24px;">New ${formType.toUpperCase()} Form Submission</h1>
        </div>
        
        <div style="background: #f9f9f9; padding: 20px; margin-bottom: 20px; border-radius: 8px;">
          <h2 style="margin-top: 0; color: #333;">Submission Details</h2>
          <table style="width: 100%; border-collapse: collapse;">
            ${formattedData}
          </table>
        </div>
        
        <div style="background: #f0f0f0; padding: 15px; border-radius: 8px; font-size: 12px; color: #666;">
          <h3 style="margin-top: 0; color: #333;">Metadata</h3>
          <p><strong>Submission ID:</strong> ${metadata.id}</p>
          <p><strong>Timestamp:</strong> ${metadata.timestamp}</p>
          <p><strong>IP Address:</strong> ${metadata.ip}</p>
          <p><strong>User Agent:</strong> ${metadata.userAgent || 'Not provided'}</p>
          <p><strong>Referrer:</strong> ${metadata.referrer || 'Direct'}</p>
        </div>
        
        <div style="text-align: center; margin-top: 20px; padding: 20px; border-top: 1px solid #eee;">
          <p style="color: #666; font-size: 12px;">This email was generated automatically from the Doggzy website form submission system.</p>
        </div>
      </body>
    </html>
  `
}

// Send email via Resend
async function sendNotificationEmail(formType: FormType, data: Record<string, unknown>, metadata: any): Promise<void> {
  const recipientEmail = getRecipientEmail(formType)
  const subject = generateSubject(formType, data)
  const htmlContent = generateEmailHTML(formType, data, metadata)
  const userEmail = data.email as string
  
  const emailData = {
    from: 'Doggzy Forms <no-reply@doggzy.online>',
    to: recipientEmail,
    subject,
    html: htmlContent,
    ...(userEmail && { replyTo: userEmail }),
  }

  const { error } = await resend.emails.send(emailData)
  
  if (error) {
    console.error('Email sending failed:', error)
    throw new Error('Failed to send notification email')
  }
}

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
        id: submissionId,
        ip,
        userAgent: request.headers.get('user-agent'),
        timestamp: new Date().toISOString(),
        referrer: request.headers.get('referer'),
      }
    }
    
    // Log submission
    const logData = validation.data as Record<string, unknown>
    console.log(`[Form Submission] ${submissionId}:`, {
      type: formType,
      name: logData?.name || logData?.firstName,
      email: logData?.email,
      timestamp: submissionData.metadata.timestamp,
      ip,
    })
    
    // Send notification email
    try {
      await sendNotificationEmail(formType, logData, submissionData.metadata)
      console.log(`[Email Sent] ${submissionId}: Notification sent to ${getRecipientEmail(formType)}`)
    } catch (emailError) {
      console.error(`[Email Failed] ${submissionId}:`, emailError)
      
      // Return error response if email fails
      return NextResponse.json(
        { 
          success: false,
          error: 'Unable to process your submission at this time. Please try again later.',
          code: 'EMAIL_DELIVERY_FAILED'
        },
        { status: 500 }
      )
    }
    
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
