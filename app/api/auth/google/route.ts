import { supabase } from '@/lib/supabase'

export async function POST(request: Request) {
  try {
    const origin = request.headers.get('origin') || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${origin}/auth/callback`,
      },
    })

    if (error) {
      console.error('[v0] Google OAuth error:', error)
      return Response.json(
        { error: 'Failed to initiate Google sign in' },
        { status: 400 }
      )
    }

    return Response.json({
      url: data.url,
    })
  } catch (error) {
    console.error('[v0] Google OAuth endpoint error:', error)
    return Response.json(
      { error: 'An error occurred during Google sign up' },
      { status: 500 }
    )
  }
}
