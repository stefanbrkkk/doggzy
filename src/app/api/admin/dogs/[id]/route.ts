import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { dogProfileAdapter } from '@/lib/storage/file-adapter'
import { validateUpdateDogProfile, formatValidationErrors } from '@/lib/validation/content'

// GET /api/admin/dogs/[id] - Get dog profile by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check authentication
    const user = await getCurrentUser(request)
    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Unauthorized access',
          code: 'UNAUTHORIZED'
        },
        { status: 401 }
      )
    }

    const { id } = await params
    const dogProfile = await dogProfileAdapter.getById(id)

    if (!dogProfile) {
      return NextResponse.json(
        {
          success: false,
          error: 'Dog profile not found',
          code: 'NOT_FOUND'
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: dogProfile
    })

  } catch (error) {
    console.error('Dog profile fetch error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch dog profile',
        code: 'FETCH_ERROR'
      },
      { status: 500 }
    )
  }
}

// PUT /api/admin/dogs/[id] - Update dog profile
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check authentication
    const user = await getCurrentUser(request)
    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Unauthorized access',
          code: 'UNAUTHORIZED'
        },
        { status: 401 }
      )
    }

    const { id } = await params
    
    // Check if dog profile exists
    const existingDogProfile = await dogProfileAdapter.getById(id)
    if (!existingDogProfile) {
      return NextResponse.json(
        {
          success: false,
          error: 'Dog profile not found',
          code: 'NOT_FOUND'
        },
        { status: 404 }
      )
    }

    // Parse request body
    const body = await request.json()
    const updateData = { ...body, id }
    
    // Validate dog profile data
    const validation = validateUpdateDogProfile(updateData)
    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid dog profile data',
          code: 'VALIDATION_ERROR',
          fieldErrors: formatValidationErrors(validation.errors)
        },
        { status: 400 }
      )
    }

    // Update dog profile
    const updatedDogProfile = await dogProfileAdapter.update(id, validation.data)

    return NextResponse.json({
      success: true,
      message: 'Dog profile updated successfully',
      data: updatedDogProfile
    })

  } catch (error) {
    console.error('Dog profile update error:', error)
    
    if (error instanceof Error) {
      if (error.message.includes('slug') || error.message.includes('not found')) {
        return NextResponse.json(
          {
            success: false,
            error: error.message,
            code: 'UPDATE_ERROR'
          },
          { status: 400 }
        )
      }
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update dog profile',
        code: 'UPDATE_ERROR'
      },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/dogs/[id] - Delete dog profile
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check authentication
    const user = await getCurrentUser(request)
    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Unauthorized access',
          code: 'UNAUTHORIZED'
        },
        { status: 401 }
      )
    }

    const { id } = await params
    
    // Check if dog profile exists
    const existingDogProfile = await dogProfileAdapter.getById(id)
    if (!existingDogProfile) {
      return NextResponse.json(
        {
          success: false,
          error: 'Dog profile not found',
          code: 'NOT_FOUND'
        },
        { status: 404 }
      )
    }

    // Delete dog profile
    const deleted = await dogProfileAdapter.delete(id)

    if (!deleted) {
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to delete dog profile',
          code: 'DELETE_FAILED'
        },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Dog profile deleted successfully',
      data: { id }
    })

  } catch (error) {
    console.error('Dog profile deletion error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete dog profile',
        code: 'DELETE_ERROR'
      },
      { status: 500 }
    )
  }
}