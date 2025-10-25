import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Mock story - replace with real implementation later
    const mockStory = {
      id,
      title: 'Bella\'s New Home',
      excerpt: 'A heartwarming story of rescue and love',
      content: 'Bella was found on the streets...',
      status: 'published',
      featured: true,
      images: ['/api/placeholder/400/300'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    return NextResponse.json({
      success: true,
      data: mockStory
    })
  } catch (error) {
    console.error('Story fetch error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch story'
      },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
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

    // Mock update - replace with real implementation later
    const updatedStory = {
      id,
      ...body,
      updatedAt: new Date().toISOString()
    }

    return NextResponse.json({
      success: true,
      message: 'Story updated successfully',
      data: updatedStory
    })
  } catch (error) {
    console.error('Story update error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update story'
      },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Mock deletion - replace with real implementation later
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
        error: 'Failed to delete story'
      },
      { status: 500 }
    )
  }
}