import { NextRequest, NextResponse } from 'next/server'
import { validateFormData, formatValidationErrors, FormType } from '@/lib/form-validation'
import { Resend } from 'resend'

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY)

// Email recipient mapping
const EMAIL_RECIPIENTS = {
  contact: 'contact@doggzy.online',
  adopt: 'adoption@doggzy.online',
  foster: 'adoption@doggzy.online',
  careers: 'care@doggzy.online',
  report: 'reports@doggzy.online'
} as const

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

// Generate email subject based on form type
function generateEmailSubject(formType: FormType, data: Record<string, unknown>): string {
  const name = data.name || data.firstName || 'Anonymous'
  const location = data.location || data.city || ''
  
  switch (formType) {
    case 'contact':
      return `CONTACT: New Message – ${name}`
    case 'adopt':
      return `ADOPT: New Application – ${name}`
    case 'foster':
      return `FOSTER: New Application – ${name}`
    case 'careers':
      return `CAREERS: New Application – ${name} (${data.position || 'Position'})`
    case 'report':
      const urgency = data.urgency === 'immediate' ? '🚨 URGENT' : data.urgency === 'urgent' ? '⚠️ URGENT' : ''
      const reporterName = data.anonymous ? 'Anonymous' : name
      return `REPORT: ${urgency} ${reporterName} – ${location}`.trim()
    default:
      return `FORM: New Submission – ${name}`
  }
}

// Generate HTML email body
function generateEmailHTML(formType: FormType, data: Record<string, unknown>, metadata: any, submissionId: string): string {
  const subject = generateEmailSubject(formType, data)
  
  // Filter out honeypot and sensitive fields
  const filteredData = Object.entries(data).filter(([key]) => 
    !['website', 'formType'].includes(key)
  )
  
  const formTypeLabels = {
    contact: 'Contact Form',
    adopt: 'Adoption Application',
    foster: 'Foster Application', 
    careers: 'Career Application',
    report: 'Abuse Report'
  }
  
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${subject}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
    .header { background: linear-gradient(135deg, #f97316, #dc2626); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
    .content { padding: 20px; background: #fff; }
    .metadata { background: #f8f9fa; padding: 15px; border-radius: 6px; margin-top: 20px; font-size: 0.9em; }
    table { width: 100%; border-collapse: collapse; margin: 15px 0; }
    th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
    th { background-color: #f8f9fa; font-weight: 600; }
    .urgent { border-left: 4px solid #dc2626; padding-left: 16px; }
    .footer { color: #666; font-size: 0.8em; text-align: center; margin-top: 20px; }
  </style>
</head>
<body>
  <div class="header">
    <h1 style="margin: 0; font-size: 24px;">🐕 ${formTypeLabels[formType] || 'Form Submission'}</h1>
    <p style="margin: 5px 0 0 0; opacity: 0.9;">${subject}</p>
  </div>
  
  <div class="content ${formType === 'report' && data.urgency === 'immediate' ? 'urgent' : ''}">
    ${formType === 'report' && data.urgency === 'immediate' ? '<p><strong>🚨 IMMEDIATE ATTENTION REQUIRED</strong></p>' : ''}
    
    <h2>Submission Details</h2>
    <table>
      <thead>
        <tr>
          <th>Field</th>
          <th>Value</th>
        </tr>
      </thead>
      <tbody>
        ${filteredData.map(([key, value]) => {
          const displayKey = key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')
          const displayValue = Array.isArray(value) ? value.join(', ') : 
                              typeof value === 'boolean' ? (value ? 'Yes' : 'No') :
                              value || 'Not provided'
          return `<tr><td><strong>${displayKey}</strong></td><td>${displayValue}</td></tr>`
        }).join('')}
      </tbody>
    </table>
    
    <div class="metadata">
      <h3>Submission Metadata</h3>
      <p><strong>Submission ID:</strong> ${submissionId}</p>
      <p><strong>Timestamp:</strong> ${metadata.timestamp}</p>
      <p><strong>IP Address:</strong> ${metadata.ip}</p>
      <p><strong>User Agent:</strong> ${metadata.userAgent || 'Not provided'}</p>
      <p><strong>Referrer:</strong> ${metadata.referrer || 'Direct'}</p>
    </div>
  </div>
  
  <div class="footer">
    <p>This email was automatically generated by the Doggzy forms system.</p>
  </div>
</body>
</html>`
}

// Send email notification
async function sendEmailNotification(formType: FormType, data: Record<string, unknown>, metadata: any, submissionId: string): Promise<boolean> {
  try {
    if (!process.env.RESEND_API_KEY) {
      console.error('RESEND_API_KEY not configured')
      return false
    }
    
    const recipient = EMAIL_RECIPIENTS[formType] || 'care@doggzy.online'
    const subject = generateEmailSubject(formType, data)
    const htmlContent = generateEmailHTML(formType, data, metadata, submissionId)
    
    // Set reply-to to user's email if provided
    const replyTo = data.email && typeof data.email === 'string' && data.email.includes('@') 
      ? data.email 
      : undefined
    
    const emailResult = await resend.emails.send({
      from: 'Doggzy Forms <no-reply@doggzy.online>',
      to: [recipient],
      replyTo: replyTo,
      subject: subject,
      html: htmlContent,
    })
    
    console.log(`[Email Sent] ${submissionId}:`, {
      to: recipient,
      replyTo: replyTo,
      subject: subject,
      emailId: emailResult.data?.id
    })
    
    return true
  } catch (error) {
    console.error(`[Email Error] ${submissionId}:`, error)
    return false
  }
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
    
    // Log submission
    const logData = validation.data as Record<string, unknown>
    console.log(`[Form Submission] ${submissionId}:`, {
      type: formType,
      name: logData?.name || logData?.firstName,
      email: logData?.email,
      timestamp: submissionData.metadata.timestamp,
      ip,
    })
    
    // Send email notification
    const emailSent = await sendEmailNotification(formType, validation.data as Record<string, unknown>, submissionData.metadata, submissionId)
    if (!emailSent) {
      console.warn(`[Email Failed] ${submissionId}: Email notification failed to send`)
      // Don't fail the entire request if email fails - log and continue
    }
    
    // TODO: In production, also implement:
    // 1. Save to database
    // 2. Send confirmation email to user  
    // 3. Add to CRM/pipeline
    // 4. Trigger any automation workflows
    
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
