import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { blogStoryAdapter } from '@/lib/storage/file-adapter'
import { validateCreateBlogStory, formatValidationErrors } from '@/lib/validation/content'
import type { ContentFilters, ContentSortOptions } from '@/lib/types/content'

// GET /api/admin/stories - List all stories with filters
export async function GET(request: NextRequest) {
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

    // Parse query parameters
    const { searchParams } = new URL(request.url)
    
    const filters: ContentFilters = {
      status: (searchParams.get('status') as 'draft' | 'published' | 'all') || 'all',
      featured: searchParams.get('featured') === 'true' ? true : 
                searchParams.get('featured') === 'false' ? false : undefined,
      tags: searchParams.get('tags')?.split(',').filter(Boolean) || [],
      category: searchParams.get('category') || undefined,
      search: searchParams.get('search') || undefined,
      limit: parseInt(searchParams.get('limit') || '20'),
      offset: parseInt(searchParams.get('offset') || '0'),
    }

    const sort: ContentSortOptions = {
      field: (searchParams.get('sortField') as ContentSortOptions['field']) || 'updatedAt',
      direction: (searchParams.get('sortDirection') as 'asc' | 'desc') || 'desc',
    }

    // Get stories
    const result = await blogStoryAdapter.getAll(filters, sort)

    return NextResponse.json({
      success: true,
      data: result
    })

  } catch (error) {
    console.error('Stories list error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch stories',
        code: 'FETCH_ERROR'
      },
      { status: 500 }
    )
  }
}

// POST /api/admin/stories - Create new story
export async function POST(request: NextRequest) {
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

    // Parse request body
    const body = await request.json()
    
    // Validate story data
    const validation = validateCreateBlogStory(body)
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

    // Create story
    const story = await blogStoryAdapter.create(validation.data)

    return NextResponse.json({
      success: true,
      message: 'Story created successfully',
      data: story
    }, { status: 201 })

  } catch (error) {
    console.error('Story creation error:', error)
    
    if (error instanceof Error) {
      if (error.message.includes('slug')) {
        return NextResponse.json(
          {
            success: false,
            error: error.message,
            code: 'SLUG_ERROR'
          },
          { status: 400 }
        )
      }
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create story',
        code: 'CREATE_ERROR'
      },
      { status: 500 }
    )
  }
}
