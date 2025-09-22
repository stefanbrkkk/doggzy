import { NextResponse } from 'next/server'

export async function GET() {
  const startTime = Date.now()
  
  try {
    return NextResponse.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptimeSeconds: process.uptime(),
      version: process.env.npm_package_version || 'unknown',
      commit: process.env.VERCEL_GIT_COMMIT_SHA || process.env.GITHUB_SHA || 'unknown',
      responseTime: Date.now() - startTime
    }, {
      status: 200,
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      },
    })
  } catch (error) {
    console.error('Health check error:', error)
    return NextResponse.json({
      status: 'error',
      timestamp: new Date().toISOString(),
      error: 'Internal server error'
    }, {
      status: 500,
      headers: {
        'Cache-Control': 'no-store',
      },
    })
  }
}