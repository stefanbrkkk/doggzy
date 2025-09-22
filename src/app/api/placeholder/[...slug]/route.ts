import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string[] }> }
) {
  try {
    const { slug } = await params
    
    // Handle video requests
    if (slug[0] === 'video') {
      const videoName = slug[1] || 'default'
      
      // Map video names to local files
      const videoMap: Record<string, string> = {
        'adoption-hero': '/videos/adoption-hero.mp4',
        'foster-hero': '/videos/foster-hero.mp4',
        'careers-hero': '/videos/careers-hero.mp4',
        'adoption-success': '/videos/adoption-success.mp4',
        'foster-success': '/videos/foster-success.mp4',
        'team-stories': '/videos/team-stories.mp4',
      }
      
      const videoPath = videoMap[videoName] || '/videos/default.mp4'
      
      // For now, return a simple response since we don't have actual video files
      return new NextResponse(
        JSON.stringify({ message: `Video placeholder for ${videoName}`, path: videoPath }),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800',
          },
        }
      )
    }
    
    // Handle image requests (width/height)
    const width = parseInt(slug[0]) || 400
    const height = parseInt(slug[1]) || 400
    
    // Validate dimensions
    if (width > 2000 || height > 2000 || width < 1 || height < 1) {
      return new NextResponse('Invalid dimensions', { status: 400 })
    }
    
    // Generate a simple SVG placeholder
    const svg = `
      <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#f3f4f6"/>
        <text x="50%" y="50%" text-anchor="middle" dy=".3em" font-family="Arial, sans-serif" font-size="16" fill="#6b7280">
          ${width}×${height}
        </text>
      </svg>
    `
    
    return new NextResponse(svg, {
      status: 200,
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800',
      },
    })
  } catch (error) {
    console.error('Placeholder API error:', error)
    return new NextResponse('Internal Server Error', { status: 502 })
  }
}
