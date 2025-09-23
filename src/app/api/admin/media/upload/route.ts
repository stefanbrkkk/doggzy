import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { 
  MediaUploadSchema,
  saveUploadedFile,
  createMediaItem,
  defaultMediaConfig 
} from '@/lib/media/upload'
import { formatValidationErrors } from '@/lib/validation/content'

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

    // Parse form data
    const formData = await request.formData()
    const file = formData.get('file') as File
    const type = formData.get('type') as string
    const slug = formData.get('slug') as string
    const alt = formData.get('alt') as string
    const caption = formData.get('caption') as string | null

    // Validate required fields
    if (!file) {
      return NextResponse.json(
        {
          success: false,
          error: 'No file provided',
          code: 'MISSING_FILE'
        },
        { status: 400 }
      )
    }

    // Validate upload data
    const uploadData = {
      file,
      type,
      slug,
      alt,
      caption: caption || undefined,
    }

    const validation = MediaUploadSchema.safeParse(uploadData)
    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid upload data',
          code: 'VALIDATION_ERROR',
          fieldErrors: formatValidationErrors(validation.error)
        },
        { status: 400 }
      )
    }

    const validatedData = validation.data

    // Save uploaded file
    const uploadResult = await saveUploadedFile(
      file,
      validatedData.type,
      validatedData.slug,
      defaultMediaConfig
    )

    // Create media item
    const mediaItem = createMediaItem(
      uploadResult,
      validatedData.alt,
      validatedData.caption
    )

    return NextResponse.json({
      success: true,
      message: 'File uploaded successfully',
      data: {
        mediaItem,
        file: {
          filename: uploadResult.filename,
          url: uploadResult.url,
          size: uploadResult.size,
        }
      }
    })

  } catch (error) {
    console.error('Media upload error:', error)
    
    // Handle specific error types
    if (error instanceof Error) {
      if (error.message.includes('File type') || error.message.includes('File size')) {
        return NextResponse.json(
          {
            success: false,
            error: error.message,
            code: 'INVALID_FILE'
          },
          { status: 400 }
        )
      }
    }

    return NextResponse.json(
      {
        success: false,
        error: 'File upload failed',
        code: 'UPLOAD_ERROR'
      },
      { status: 500 }
    )
  }
}
