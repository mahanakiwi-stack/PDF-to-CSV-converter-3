import { NextRequest, NextResponse } from 'next/server'
import { getUsageInfo } from '@/lib/usage'
import { getOrCreateAnonSessionId } from '@/lib/session'

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId')
    
    let user = null
    let sessionId = null
    
    // If userId is provided, use authenticated user flow
    if (userId) {
      user = { id: userId }
    } else {
      // Anonymous user - get session ID from server-side cookie
      sessionId = await getOrCreateAnonSessionId()
    }
    
    const usage = await getUsageInfo(sessionId || undefined, user)
    return NextResponse.json(usage)
  } catch (error) {
    console.error('Error getting usage:', error)
    return NextResponse.json(
      { error: 'Failed to get usage info' },
      { status: 500 }
    )
  }
}
