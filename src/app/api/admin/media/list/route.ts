import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { listUploadedFiles } from '@/lib/media/upload'

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

    // Get query parameters
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') as 'stories' | 'dogs' | null
    const slug = searchParams.get('slug')

    if (!type || !slug) {
      return NextResponse.json(
        {
          success: false,
          error: 'Type and slug parameters are required',
          code: 'MISSING_PARAMETERS'
        },
        { status: 400 }
      )
    }

    if (!['stories', 'dogs'].includes(type)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid type parameter. Must be "stories" or "dogs"',
          code: 'INVALID_TYPE'
        },
        { status: 400 }
      )
    }

    // List files
    const files = await listUploadedFiles(type, slug)

    return NextResponse.json({
      success: true,
      data: {
        type,
        slug,
        files,
        count: files.length
      }
    })

  } catch (error) {
    console.error('Media list error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to list media files',
        code: 'LIST_ERROR'
      },
      { status: 500 }
    )
  }
}
