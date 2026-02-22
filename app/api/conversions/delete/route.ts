import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function DELETE(request: Request) {
  try {
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const conversionId = searchParams.get('id')

    if (!conversionId) {
      return NextResponse.json(
        { error: 'Conversion ID required' },
        { status: 400 }
      )
    }

    const { error } = await supabase
      .from('conversions')
      .delete()
      .eq('id', conversionId)
      .eq('user_id', session.user.id)

    if (error) {
      console.error('[v0] Error deleting conversion:', error)
      return NextResponse.json(
        { error: 'Failed to delete conversion' },
        { status: 400 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (err: unknown) {
    console.error('[v0] Delete conversion error:', err)
    return NextResponse.json(
      { error: 'An error occurred' },
      { status: 500 }
    )
  }
}
