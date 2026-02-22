import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      user_id,
      file_name,
      page_count,
      transaction_count,
      processing_mode,
      csv_data,
    } = body

    if (!user_id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { data, error } = await supabase
      .from('conversions')
      .insert({
        user_id,
        file_name,
        page_count,
        transaction_count,
        mode: processing_mode,
        csv_data,
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json(
        { error: error.message || 'Failed to save conversion' },
        { status: 400 }
      )
    }

    return NextResponse.json({ success: true, data })
  } catch (err: unknown) {
    console.error('Save conversion error:', err)
    return NextResponse.json(
      { error: 'An error occurred' },
      { status: 500 }
    )
  }
}
