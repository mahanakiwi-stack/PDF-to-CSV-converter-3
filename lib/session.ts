import { cookies } from 'next/headers'

// Create or get a persistent anonymous session ID via HTTP-only cookie
export async function getOrCreateAnonSessionId() {
  const cookieStore = await cookies()
  let sessionId = cookieStore.get('anon_session_id')?.value

  if (!sessionId) {
    // Generate a new session ID
    sessionId = 'anon_' + Math.random().toString(36).substr(2, 9)
    
    // Set as HTTP-only cookie that persists for 24 hours
    cookieStore.set('anon_session_id', sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 86400, // 24 hours
      path: '/',
    })
  }

  return sessionId
}
