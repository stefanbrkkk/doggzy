import { NextRequest, NextResponse } from 'next/server'

// Video metadata for JSON responses
const videoMetadata: Record<string, { 
  title: string
  duration: string
  description: string
  thumbnail: string
}> = {
  'adoption-hero': {
    title: 'Happy Adoption Story',
    duration: '2:30',
    description: 'A heartwarming story of a successful dog adoption',
    thumbnail: '/images/thumbnails/adoption-hero.jpg'
  },
  'foster-hero': {
    title: 'Foster Family Journey', 
    duration: '1:45',
    description: 'Follow a foster family as they care for rescue dogs',
    thumbnail: '/images/thumbnails/foster-hero.jpg'
  },
  'careers-hero': {
    title: 'Join Our Mission',
    duration: '1:20',
    description: 'Learn about careers at Doggzy and our mission',
    thumbnail: '/images/thumbnails/careers-hero.jpg'
  },
  'default': {
    title: 'Doggzy - Saving Dogs Worldwide',
    duration: '3:00',
    description: 'An overview of our global dog rescue mission',
    thumbnail: '/images/thumbnails/default.jpg'
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string[] }> }
) {
  try {
    const { slug } = await params
    
    // Validate slug exists and is not empty
    if (!slug || slug.length === 0) {
      return NextResponse.json(
        { error: 'Invalid request path' },
        { status: 400 }
      )
    }
    
    // Handle video metadata requests
    if (slug[0] === 'video' && slug[1]) {
      const videoName = slug[1]
      const metadata = videoMetadata[videoName] || videoMetadata['default']
      
      return NextResponse.json(metadata, {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
        },
      })
    }
    
    // Handle image placeholder requests (width/height)
    const width = parseInt(slug[0])
    const height = parseInt(slug[1]) || width
    
    // Validate dimensions
    if (isNaN(width) || isNaN(height)) {
      return NextResponse.json(
        { error: 'Invalid dimensions. Use format: /api/placeholder/{width}/{height}' },
        { status: 400 }
      )
    }
    
    if (width > 2000 || height > 2000 || width < 1 || height < 1) {
      return NextResponse.json(
        { error: 'Dimensions must be between 1 and 2000 pixels' },
        { status: 400 }
      )
    }
    
    // Generate optimized SVG placeholder
    const fontSize = Math.min(Math.max(Math.min(width, height) / 20, 12), 24)
    const svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Placeholder image ${width} by ${height} pixels">
  <rect width="100%" height="100%" fill="#f3f4f6" stroke="#e5e7eb" stroke-width="1"/>
  <text x="50%" y="50%" text-anchor="middle" dy=".35em" font-family="system-ui, -apple-system, sans-serif" font-size="${fontSize}" fill="#6b7280" font-weight="500">
    ${width} × ${height}
  </text>
</svg>`
    
    return new NextResponse(svg, {
      status: 200,
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800',
        'X-Content-Type-Options': 'nosniff',
      },
    })
  } catch (error) {
    console.error('Placeholder API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
