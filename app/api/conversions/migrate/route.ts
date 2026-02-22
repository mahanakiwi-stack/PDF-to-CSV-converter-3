import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: Request) {
  try {
    console.log('[v0] Conversion migration endpoint called')
    
    const body = await request.json()
    const { from_user_id, to_user_id } = body

    if (!from_user_id || !to_user_id) {
      console.error('[v0] Missing from_user_id or to_user_id')
      return NextResponse.json(
        { error: 'Missing user IDs' },
        { status: 400 }
      )
    }

    console.log('[v0] Migrating conversions from', from_user_id, 'to', to_user_id)

    // Update all conversions from the anonymous session ID to the new user ID
    const { data, error } = await supabase
      .from('conversions')
      .update({ user_id: to_user_id })
      .eq('user_id', from_user_id)
      .select()

    if (error) {
      console.error('[v0] Migration error:', error)
      return NextResponse.json(
        { error: 'Failed to migrate conversions' },
        { status: 400 }
      )
    }

    console.log('[v0] Migrated', data?.length || 0, 'conversions')
    return NextResponse.json({ 
      success: true, 
      migrated: data?.length || 0 
    })
  } catch (err: unknown) {
    console.error('[v0] Migration error:', err)
    return NextResponse.json(
      { error: 'An error occurred' },
      { status: 500 }
    )
  }
}
