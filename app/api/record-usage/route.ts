import { NextRequest, NextResponse } from 'next/server'
import { checkAndRecordUsage } from '@/lib/usage'
import { supabase } from '@/lib/supabase'
import { transactionsToCSV } from '@/lib/csv'
import { getOrCreateAnonSessionId } from '@/lib/session'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { pageCount, fileName, transactionCount = 0, csvData, mode = 'ai', userId } = body

    // Create a user object from userId if provided (authenticated user from frontend)
    // Otherwise it will be treated as anonymous
    const user = userId ? { id: userId } : null

    // For anonymous users, get the session ID from server-side cookie
    let sessionId = null
    if (!user) {
      sessionId = await getOrCreateAnonSessionId()
    }

    const usageResult = await checkAndRecordUsage(pageCount || 1, user, sessionId, {
      fileName: fileName || 'statement.pdf',
      transactionCount,
      csvData: csvData || '',
    })

    if (!usageResult.success) {
      return NextResponse.json(
        { error: usageResult.error, usage: usageResult.usage },
        { status: 429 }
      )
    }

    return NextResponse.json({ usage: usageResult.usage })
  } catch (error) {
    console.error('Error recording usage:', error)
    return NextResponse.json(
      { error: 'Failed to record usage' },
      { status: 500 }
    )
  }
}
