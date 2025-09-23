import { NextRequest } from 'next/server'
import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import { z } from 'zod'

// Environment validation
const AuthEnvSchema = z.object({
  ADMIN_EMAIL: z.string().email('Invalid admin email format'),
  ADMIN_PASSWORD: z.string().min(8, 'Admin password must be at least 8 characters'),
  JWT_SECRET: z.string().min(32, 'JWT secret must be at least 32 characters'),
})

// Validate auth environment variables
export function validateAuthEnv() {
  try {
    return AuthEnvSchema.parse({
      ADMIN_EMAIL: process.env.ADMIN_EMAIL,
      ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
      JWT_SECRET: process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET,
    })
  } catch (error) {
    console.error('Auth environment validation failed:', error)
    throw new Error('Invalid auth environment configuration')
  }
}

// Login credentials schema
export const LoginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
})

export type LoginCredentials = z.infer<typeof LoginSchema>

// JWT payload type
export interface JWTPayload {
  email: string
  role: 'admin'
  iat?: number
  exp?: number
}

// Create JWT token
export async function createToken(payload: Omit<JWTPayload, 'iat' | 'exp'>): Promise<string> {
  const env = validateAuthEnv()
  const secret = new TextEncoder().encode(env.JWT_SECRET)
  
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(secret)
}

// Verify JWT token
export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const env = validateAuthEnv()
    const secret = new TextEncoder().encode(env.JWT_SECRET)
    
    const { payload } = await jwtVerify(token, secret)
    return payload as unknown as JWTPayload
  } catch (error) {
    console.error('Token verification failed:', error)
    return null
  }
}

// Verify login credentials
export async function verifyCredentials(credentials: LoginCredentials): Promise<boolean> {
  try {
    const env = validateAuthEnv()
    
    // Simple credential check - in production you'd hash passwords
    return credentials.email === env.ADMIN_EMAIL && credentials.password === env.ADMIN_PASSWORD
  } catch (error) {
    console.error('Credential verification failed:', error)
    return false
  }
}

// Get current user from request
export async function getCurrentUser(request?: NextRequest): Promise<JWTPayload | null> {
  try {
    let token: string | undefined
    
    if (request) {
      // Server-side: get from request cookies
      token = request.cookies.get('admin-token')?.value
    } else {
      // Server component: get from cookies()
      const cookieStore = await cookies()
      token = cookieStore.get('admin-token')?.value
    }
    
    if (!token) return null
    
    return await verifyToken(token)
  } catch (error) {
    console.error('Failed to get current user:', error)
    return null
  }
}

// Check if user is authenticated
export async function isAuthenticated(request?: NextRequest): Promise<boolean> {
  const user = await getCurrentUser(request)
  return !!user && user.role === 'admin'
}

// Rate limiting for login attempts
const loginAttempts = new Map<string, { count: number; lastAttempt: number }>()

export function checkRateLimit(ip: string): { allowed: boolean; remaining: number } {
  const now = Date.now()
  const windowMs = 15 * 60 * 1000 // 15 minutes
  const maxAttempts = 5
  
  const current = loginAttempts.get(ip)
  
  if (!current || now - current.lastAttempt > windowMs) {
    // Reset or initialize
    loginAttempts.set(ip, { count: 1, lastAttempt: now })
    return { allowed: true, remaining: maxAttempts - 1 }
  }
  
  if (current.count >= maxAttempts) {
    return { allowed: false, remaining: 0 }
  }
  
  // Increment attempt
  current.count++
  current.lastAttempt = now
  loginAttempts.set(ip, current)
  
  return { allowed: true, remaining: maxAttempts - current.count }
}

// Clean up old rate limit entries (call periodically)
export function cleanupRateLimit() {
  const now = Date.now()
  const windowMs = 15 * 60 * 1000
  
  for (const [ip, data] of loginAttempts.entries()) {
    if (now - data.lastAttempt > windowMs) {
      loginAttempts.delete(ip)
    }
  }
}

// Cookie configuration
export const cookieConfig = {
  name: 'admin-token',
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  maxAge: 24 * 60 * 60, // 24 hours
  path: '/',
}
