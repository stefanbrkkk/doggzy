import { NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import { join } from 'path'

// Get version from package.json
async function getVersion(): Promise<string> {
  try {
    const packagePath = join(process.cwd(), 'package.json')
    const packageJson = await readFile(packagePath, 'utf-8')
    const { version } = JSON.parse(packageJson)
    return version || '1.0.0'
  } catch {
    return '1.0.0'
  }
}

export async function GET() {
  try {
    const memoryUsage = process.memoryUsage()
    const version = await getVersion()
    
    // Basic health check
    const healthData = {
      status: 'healthy' as const,
      timestamp: new Date().toISOString(),
      uptime: Math.round(process.uptime()),
      environment: process.env.NODE_ENV || 'development',
      version,
      node: process.version,
      platform: process.platform,
      checks: {
        api: 'ok' as const,
        memory: {
          used: Math.round(memoryUsage.heapUsed / 1024 / 1024),
          total: Math.round(memoryUsage.heapTotal / 1024 / 1024),
          external: Math.round(memoryUsage.external / 1024 / 1024),
          rss: Math.round(memoryUsage.rss / 1024 / 1024),
        },
        // TODO: Add database connectivity check when implemented
        // database: await checkDatabaseConnection(),
        // TODO: Add external service checks (email, payment processors)
        // services: await checkExternalServices(),
      },
      services: {
        forms: 'operational' as const,
        placeholder: 'operational' as const,
        // TODO: Add more service status checks
      }
    }

    return NextResponse.json(healthData, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
        'X-Content-Type-Options': 'nosniff',
      },
    })
  } catch (error) {
    console.error('Health check failed:', error)
    
    return NextResponse.json(
      { 
        status: 'unhealthy' as const,
        timestamp: new Date().toISOString(),
        error: 'Health check failed',
        uptime: Math.round(process.uptime()),
        version: await getVersion().catch(() => '1.0.0')
      },
      { 
        status: 503,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'X-Content-Type-Options': 'nosniff',
        },
      }
    )
  }
}
