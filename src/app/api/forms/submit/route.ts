import { NextRequest, NextResponse } from 'next/server'

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

function validateFormData(data: Record<string, unknown>, formType: string): { valid: boolean; errors: string[] } {
  const errors: string[] = []
  
  // Common validations
  if (!data.name || typeof data.name !== 'string' || data.name.trim().length < 2) {
    errors.push('Name is required and must be at least 2 characters')
  }
  
  if (!data.email || typeof data.email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.push('Valid email is required')
  }
  
  // Honeypot check
  if (data.website) {
    errors.push('Bot detected')
  }
  
  // Form-specific validations
  switch (formType) {
    case 'adopt':
    case 'foster':
      if (!data.experience || typeof data.experience !== 'string') {
        errors.push('Experience level is required')
      }
      break
    case 'careers':
      if (!data.position || typeof data.position !== 'string') {
        errors.push('Position is required')
      }
      break
  }
  
  return { valid: errors.length === 0, errors }
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
    if (!rateLimit(ip)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      )
    }
    
    // Parse and validate content length
    const contentLength = request.headers.get('content-length')
    if (contentLength && parseInt(contentLength) > 10000) { // 10KB limit
      return NextResponse.json(
        { error: 'Request too large' },
        { status: 413 }
      )
    }
    
    const body = await request.json()
    const formType = body.formType || 'general'
    
    // Validate form data
    const validation = validateFormData(body, formType)
    if (!validation.valid) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.errors },
        { status: 422 }
      )
    }
    
    // Sanitize input (basic)
    const sanitizedData = {
      ...body,
      name: body.name?.trim().substring(0, 100),
      email: body.email?.trim().toLowerCase().substring(0, 255),
      message: body.message?.trim().substring(0, 2000),
    }
    
    // Generate submission ID
    const submissionId = `${formType}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    // Log submission (in production, you'd save to database and send email)
    console.log(`[Form Submission] ${submissionId}:`, {
      type: formType,
      name: sanitizedData.name,
      email: sanitizedData.email,
      timestamp: new Date().toISOString(),
      ip,
    })
    
    // In production, you would:
    // 1. Save to database
    // 2. Send notification email to team
    // 3. Send confirmation email to user
    // 4. Add to CRM/pipeline
    
    return NextResponse.json({
      id: submissionId,
      status: 'received',
      message: 'Thank you for your submission! We\'ll be in touch soon.',
    }, {
      status: 200,
      headers: {
        'Cache-Control': 'no-store',
      },
    })
    
  } catch (error) {
    console.error('Form submission error:', error)
    return NextResponse.json(
      { error: 'Internal server error. Please try again.' },
      { status: 500 }
    )
  }
}