import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Basic validation
    if (!body.email || !body.password) {
      return NextResponse.json(
        {
          success: false,
          error: 'Email and password are required'
        },
        { status: 400 }
      )
    }

    // Mock authentication - replace with real implementation later
    // For now, accept any email/password combination
    const mockUser = {
      id: '1',
      email: body.email,
      role: 'admin'
    }

    return NextResponse.json({
      success: true,
      message: 'Login successful',
      data: mockUser
    })

  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Login failed'
      },
      { status: 500 }
    )
  }
}