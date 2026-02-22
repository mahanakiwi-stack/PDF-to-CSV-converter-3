import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: Request) {
  try {
    console.log('[v0] Cleanup API called')
    
    // Verify the request has the cleanup token (for security)
    const authHeader = request.headers.get('authorization')
    const cleanupToken = process.env.CLEANUP_TOKEN
    
    if (cleanupToken && authHeader !== `Bearer ${cleanupToken}`) {
      console.log('[v0] Unauthorized cleanup request')
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Calculate timestamp for 24 hours ago
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
    
    console.log('[v0] Deleting conversions older than:', twentyFourHoursAgo)

    const { data, error, count } = await supabase
      .from('conversions')
      .delete()
      .lt('created_at', twentyFourHoursAgo)
      .select('id', { count: 'exact' })

    if (error) {
      console.error('[v0] Cleanup error:', error)
      return NextResponse.json(
        { error: 'Failed to cleanup conversions' },
        { status: 400 }
      )
    }

    console.log('[v0] Deleted conversions:', count)
    return NextResponse.json({ 
      success: true, 
      message: `Deleted ${count} conversions older than 24 hours` 
    })
  } catch (err: unknown) {
    console.error('[v0] Cleanup error:', err)
    return NextResponse.json(
      { error: 'An error occurred during cleanup' },
      { status: 500 }
    )
  }
}
