import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const logData = await request.json()
    
    // Enhanced server-side logging
    console.error('Client Error Report:', JSON.stringify({
      ...logData,
      serverTimestamp: new Date().toISOString(),
      ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
      userAgent: request.headers.get('user-agent'),
      referer: request.headers.get('referer'),
      vercelRegion: process.env.VERCEL_REGION,
      vercelUrl: process.env.VERCEL_URL,
    }, null, 2))

    // In production, send to external monitoring services:
    // - Sentry: Sentry.captureException(logData.error)
    // - DataDog: client.increment('app.error', 1, tags)
    // - New Relic: recordCustomEvent('ClientError', logData)
    // - LogRocket: LogRocket.captureException(logData.error)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error logging endpoint failed:', error)
    return NextResponse.json({ success: false, error: 'Logging failed' }, { status: 500 })
  }
}

// Health check endpoint
export async function GET() {
  return NextResponse.json({ 
    status: 'ok',
    timestamp: new Date().toISOString(),
    region: process.env.VERCEL_REGION || 'unknown',
  })
}
