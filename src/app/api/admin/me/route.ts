import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser(request)
    
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: 'Not authenticated',
          code: 'NOT_AUTHENTICATED'
        },
        { status: 401 }
      )
    }
    
    return NextResponse.json({
      success: true,
      user: {
        email: user.email,
        role: user.role
      }
    })
    
  } catch (error) {
    console.error('Get user API error:', error)
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