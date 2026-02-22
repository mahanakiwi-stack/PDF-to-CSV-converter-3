import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: Request) {
  try {
    // Get user_id from query params
    const { searchParams } = new URL(request.url)
    const user_id = searchParams.get('user_id')
    
    console.log('[v0] Conversions list API called - user_id:', user_id)
    
    if (!user_id) {
      console.log('[v0] No user_id provided')
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { data, error } = await supabase
      .from('conversions')
      .select('*')
      .eq('user_id', user_id)
      .order('created_at', { ascending: false })

    console.log('[v0] Conversions list query - error:', error, 'data count:', data?.length)

    if (error) {
      console.log('[v0] Conversions list query error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch conversions' },
        { status: 400 }
      )
    }

    console.log('[v0] Conversions list returning', data?.length, 'results')
    return NextResponse.json({ success: true, data })
  } catch (err: unknown) {
    console.error('[v0] Conversions list error:', err)
    return NextResponse.json(
      { error: 'An error occurred' },
      { status: 500 }
    )
  }
}
