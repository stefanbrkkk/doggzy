import { NextRequest, NextResponse } from 'next/server'

export async function GET(_request: NextRequest) {
  try {
    // Mock media files - replace with real implementation later
    const mockFiles = [
      {
        id: '1',
        name: 'hero-image.jpg',
        type: 'image',
        size: '2.4 MB',
        url: '/api/placeholder/800/600',
        uploadDate: new Date().toISOString(),
        category: 'hero'
      },
      {
        id: '2',
        name: 'dog-portrait.jpg',
        type: 'image',
        size: '1.8 MB',
        url: '/api/placeholder/400/300',
        uploadDate: new Date().toISOString(),
        category: 'dogs'
      }
    ]

    return NextResponse.json({
      success: true,
      data: mockFiles
    })
  } catch (error) {
    console.error('Media list error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to list media files'
      },
      { status: 500 }
    )
  }
}