import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { blogStoryAdapter } from '@/lib/storage/file-adapter'
import { validateUpdateBlogStory, formatValidationErrors } from '@/lib/validation/content'

// GET /api/admin/stories/[id] - Get story by ID
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
    const story = await blogStoryAdapter.getById(id)

    if (!story) {
      return NextResponse.json(
        {
          success: false,
          error: 'Story not found',
          code: 'NOT_FOUND'
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: story
    })

  } catch (error) {
    console.error('Story fetch error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch story',
        code: 'FETCH_ERROR'
      },
      { status: 500 }
    )
  }
}

// PUT /api/admin/stories/[id] - Update story
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
    
    // Check if story exists
    const existingStory = await blogStoryAdapter.getById(id)
    if (!existingStory) {
      return NextResponse.json(
        {
          success: false,
          error: 'Story not found',
          code: 'NOT_FOUND'
        },
        { status: 404 }
      )
    }

    // Parse request body
    const body = await request.json()
    const updateData = { ...body, id }
    
    // Validate story data
    const validation = validateUpdateBlogStory(updateData)
    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid story data',
          code: 'VALIDATION_ERROR',
          fieldErrors: formatValidationErrors(validation.errors)
        },
        { status: 400 }
      )
    }

    // Update story
    const updatedStory = await blogStoryAdapter.update(id, validation.data)

    return NextResponse.json({
      success: true,
      message: 'Story updated successfully',
      data: updatedStory
    })

  } catch (error) {
    console.error('Story update error:', error)
    
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
        error: 'Failed to update story',
        code: 'UPDATE_ERROR'
      },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/stories/[id] - Delete story
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
    
    // Check if story exists
    const existingStory = await blogStoryAdapter.getById(id)
    if (!existingStory) {
      return NextResponse.json(
        {
          success: false,
          error: 'Story not found',
          code: 'NOT_FOUND'
        },
        { status: 404 }
      )
    }

    // Delete story
    const deleted = await blogStoryAdapter.delete(id)

    if (!deleted) {
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to delete story',
          code: 'DELETE_FAILED'
        },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Story deleted successfully',
      data: { id }
    })

  } catch (error) {
    console.error('Story deletion error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete story',
        code: 'DELETE_ERROR'
      },
      { status: 500 }
    )
  }
}
