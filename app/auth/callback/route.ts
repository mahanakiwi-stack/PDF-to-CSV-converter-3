import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const origin = request.headers.get('origin')
  
  // Fallback to NEXT_PUBLIC_APP_URL if origin is not available
  const baseUrl = origin || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  
  console.log('[v0] Auth callback received')
  console.log('[v0] Full URL:', request.url)
  console.log('[v0] Code:', code ? 'present' : 'missing')
  console.log('[v0] Base URL:', baseUrl)

  if (code) {
    console.log('[v0] Attempting code exchange...')
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (error) {
      console.error('[v0] Exchange code error:', error)
      return NextResponse.redirect(`${baseUrl}/auth/error?message=${encodeURIComponent(error.message)}`)
    }
    
    console.log('[v0] Code exchange successful, redirecting to dashboard')
    return NextResponse.redirect(`${baseUrl}/dashboard`)
  }

  // Supabase email verification redirects use hash fragment with session data
  // The access_token, refresh_token, etc. are in the hash, not query params
  // We need to redirect to a client component that can read the hash and set the session
  console.log('[v0] No code parameter found, redirecting to finalize auth')
  return NextResponse.redirect(`${baseUrl}/auth/finalize`)
}
