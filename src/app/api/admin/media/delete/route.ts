import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { deleteUploadedFile } from '@/lib/media/upload'
import { z } from 'zod'

const DeleteMediaSchema = z.object({
  type: z.enum(['stories', 'dogs']),
  slug: z.string().min(1, 'Slug is required'),
  filename: z.string().min(1, 'Filename is required'),
})

export async function DELETE(request: NextRequest) {
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
    const validation = DeleteMediaSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid delete request',
          code: 'VALIDATION_ERROR',
          fieldErrors: validation.error.flatten().fieldErrors
        },
        { status: 400 }
      )
    }

    const { type, slug, filename } = validation.data

    // Delete file
    const deleted = await deleteUploadedFile(type, slug, filename)

    if (!deleted) {
      return NextResponse.json(
        {
          success: false,
          error: 'File not found or could not be deleted',
          code: 'DELETE_FAILED'
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'File deleted successfully',
      data: {
        type,
        slug,
        filename
      }
    })

  } catch (error) {
    console.error('Media delete error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete media file',
        code: 'DELETE_ERROR'
      },
      { status: 500 }
    )
  }
}