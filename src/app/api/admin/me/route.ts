import { NextRequest, NextResponse } from 'next/server'

export async function GET(_request: NextRequest) {
  try {
    // Mock user data - replace with real implementation later
    const mockUser = {
      id: '1',
      email: 'admin@doggzy.org',
      role: 'admin',
      name: 'Admin User'
    }

    return NextResponse.json({
      success: true,
      data: mockUser
    })
  } catch (error) {
    console.error('Get user error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to get user data'
      },
      { status: 500 }
    )
  }
}