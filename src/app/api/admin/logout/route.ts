import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { cookieConfig } from '@/lib/auth'

export async function POST() {
  try {
    // Clear the authentication cookie
    const cookieStore = await cookies()
    cookieStore.delete(cookieConfig.name)
    
    return NextResponse.json({
      success: true,
      message: 'Logged out successfully'
    })
    
  } catch (error) {
    console.error('Logout API error:', error)
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