import { NextRequest, NextResponse } from 'next/server'

export async function GET(_request: NextRequest) {
  try {
    // Mock stories - replace with real implementation later
    const mockStories = [
      {
        id: '1',
        title: 'Bella\'s New Home',
        excerpt: 'A heartwarming story of rescue and love',
        content: 'Bella was found on the streets...',
        status: 'published',
        featured: true,
        images: ['/api/placeholder/400/300'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ]

    return NextResponse.json({
      success: true,
      data: {
        stories: mockStories,
        total: mockStories.length,
        hasMore: false
      }
    })
  } catch (error) {
    console.error('Stories list error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch stories'
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    if (!body.title || !body.content) {
      return NextResponse.json(
        {
          success: false,
          error: 'Title and content are required'
        },
        { status: 400 }
      )
    }

    // Mock creation - replace with real implementation later
    const newStory = {
      id: Date.now().toString(),
      ...body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    return NextResponse.json({
      success: true,
      message: 'Story created successfully',
      data: newStory
    }, { status: 201 })
  } catch (error) {
    console.error('Story creation error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create story'
      },
      { status: 500 }
    )
  }
}