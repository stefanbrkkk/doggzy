import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { dogProfileAdapter } from '@/lib/storage/file-adapter'
import { validateCreateDogProfile, formatValidationErrors } from '@/lib/validation/content'
import type { ContentFilters, ContentSortOptions } from '@/lib/types/content'

// GET /api/admin/dogs - List all dog profiles with filters
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
      search: searchParams.get('search') || undefined,
      limit: parseInt(searchParams.get('limit') || '20'),
      offset: parseInt(searchParams.get('offset') || '0'),
    }

    const sort: ContentSortOptions = {
      field: (searchParams.get('sortField') as ContentSortOptions['field']) || 'updatedAt',
      direction: (searchParams.get('sortDirection') as 'asc' | 'desc') || 'desc',
    }

    // Get dog profiles
    const result = await dogProfileAdapter.getAll(filters, sort)

    return NextResponse.json({
      success: true,
      data: result
    })

  } catch (error) {
    console.error('Dog profiles list error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch dog profiles',
        code: 'FETCH_ERROR'
      },
      { status: 500 }
    )
  }
}

// POST /api/admin/dogs - Create new dog profile
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
    
    // Validate dog profile data
    const validation = validateCreateDogProfile(body)
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

    // Create dog profile
    const dogProfile = await dogProfileAdapter.create(validation.data)

    return NextResponse.json({
      success: true,
      message: 'Dog profile created successfully',
      data: dogProfile
    }, { status: 201 })

  } catch (error) {
    console.error('Dog profile creation error:', error)
    
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
        error: 'Failed to create dog profile',
        code: 'CREATE_ERROR'
      },
      { status: 500 }
    )
  }
}
