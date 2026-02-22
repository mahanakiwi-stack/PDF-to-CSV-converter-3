import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: Request) {
  try {
    console.log('[v0] Logout API called')
    
    // Sign out from Supabase
    const { error } = await supabase.auth.signOut()
    
    if (error) {
      console.error('[v0] Logout error:', error.message)
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 400 }
      )
    }

    console.log('[v0] Logout successful')
    return NextResponse.json(
      { success: true, message: 'Successfully logged out' },
      { status: 200 }
    )
  } catch (err: unknown) {
    console.error('[v0] Logout error:', err)
    return NextResponse.json(
      { success: false, error: 'An error occurred during logout' },
      { status: 500 }
    )
  }
}
