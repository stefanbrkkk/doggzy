import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { 
  LoginSchema, 
  verifyCredentials, 
  createToken, 
  checkRateLimit,
  cookieConfig 
} from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const forwarded = request.headers.get('x-forwarded-for')
    const ip = forwarded ? forwarded.split(',')[0].trim() : 
              request.headers.get('x-real-ip') || 
              'unknown'
    
    // Check rate limit
    const rateLimit = checkRateLimit(ip)
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Too many login attempts. Please try again in 15 minutes.',
          code: 'RATE_LIMIT_EXCEEDED'
        },
        { status: 429 }
      )
    }
    
    // Parse and validate request body
    const body = await request.json()
    const parseResult = LoginSchema.safeParse(body)
    
    if (!parseResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid login credentials format',
          code: 'VALIDATION_ERROR',
          fieldErrors: parseResult.error.flatten().fieldErrors
        },
        { status: 400 }
      )
    }
    
    const credentials = parseResult.data
    
    // Verify credentials
    const isValid = await verifyCredentials(credentials)
    
    if (!isValid) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid email or password',
          code: 'INVALID_CREDENTIALS',
          remaining: rateLimit.remaining - 1
        },
        { status: 401 }
      )
    }
    
    // Create JWT token
    const token = await createToken({
      email: credentials.email,
      role: 'admin'
    })
    
    // Set HTTP-only cookie
    const cookieStore = await cookies()
    cookieStore.set(cookieConfig.name, token, {
      httpOnly: cookieConfig.httpOnly,
      secure: cookieConfig.secure,
      sameSite: cookieConfig.sameSite,
      maxAge: cookieConfig.maxAge,
      path: cookieConfig.path,
    })
    
    return NextResponse.json({
      success: true,
      message: 'Login successful',
      user: {
        email: credentials.email,
        role: 'admin'
      }
    })
    
  } catch (error) {
    console.error('Login API error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        code: 'INTERNAL_ERROR'
      },
      { status: 500 }
    )
  }
}