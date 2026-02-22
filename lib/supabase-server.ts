import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

export async function getServerUser() {
  try {
    const cookieStore = await cookies()
    
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    
    if (!supabaseUrl || !supabaseAnonKey) {
      console.error('[v0] Missing Supabase credentials')
      return null
    }
    
    // Get all cookies to debug
    const allCookies = cookieStore.getAll()
    const cookieNames = allCookies.map(c => c.name)
    console.log('[v0] Available cookies:', cookieNames)
    
    // Supabase stores the session in sb-{projectId}-auth-token or similar
    // Try to find the auth token cookie
    let authToken = null
    for (const cookie of allCookies) {
      if (cookie.name.includes('auth') || cookie.name.includes('sb')) {
        console.log('[v0] Found potential auth cookie:', cookie.name)
        authToken = cookie.value
        break
      }
    }
    
    if (!authToken) {
      console.log('[v0] No auth token found in cookies')
      return null
    }
    
    // Create a client with the auth token
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false,
      },
      global: {
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      },
    })
    
    // Get the user from the auth token
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error) {
      console.log('[v0] getServerUser - error getting user:', error.message)
      return null
    }
    
    console.log('[v0] getServerUser - found authenticated user:', user?.id)
    return user
  } catch (error) {
    console.error('[v0] Error in getServerUser:', error)
    return null
  }
}
