'use client'

import { ContactLinks } from '@/components/contact-links'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { User } from '@supabase/supabase-js'
import { LogOut, Check, X, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

export function SiteHeader() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [loggingOut, setLoggingOut] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const router = useRouter()

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        setUser(session?.user || null)
      } catch (error) {
        console.error('Error fetching user:', error)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    getUser()

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null)
    })

    return () => subscription?.unsubscribe()
  }, [])

  // Auto-hide message after 3 seconds
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 3000)
      return () => clearTimeout(timer)
    }
  }, [message])

  const handleLogout = async () => {
    setLoggingOut(true)
    try {
      console.log('[v0] Attempting logout')
      
      // Sign out directly from Supabase on the client
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        console.error('[v0] Logout error:', error)
        setMessage({ type: 'error', text: 'Logout failed. Please try again.' })
        setLoggingOut(false)
        return
      }

      console.log('[v0] Logout successful')
      setMessage({ type: 'success', text: 'Successfully logged out' })
      setUser(null)
      
      // Redirect to home after a short delay
      setTimeout(() => {
        router.push('/')
      }, 1000)
    } catch (error) {
      console.error('[v0] Logout error:', error)
      setMessage({ type: 'error', text: 'An error occurred during logout' })
      setLoggingOut(false)
    }
  }

  return (
    <header className="border-b border-border bg-card/80 backdrop-blur-sm">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3 sm:px-6 sm:py-4">
        <div className="flex items-center gap-3 text-xs text-muted-foreground hidden sm:flex">
          <span className="font-medium">
            Any issues? Reach out to the founder
          </span>
          <ContactLinks />
        </div>
        <div className="ml-auto flex flex-col items-end gap-3">
          {message && (
            <div className={`flex items-center gap-2 text-xs font-medium px-3 py-2 rounded-lg animate-in fade-in slide-in-from-top-2 duration-300 ${
              message.type === 'success' 
                ? 'bg-emerald-500/20 border border-emerald-500/30 text-emerald-700'
                : 'bg-destructive/20 border border-destructive/30 text-destructive'
            }`}>
              {message.type === 'success' ? (
                <Check className="h-4 w-4" />
              ) : (
                <X className="h-4 w-4" />
              )}
              {message.text}
            </div>
          )}
          <div className="flex items-center gap-3">
            <Link
              href="/conversions"
              className="text-sm font-medium transition-colors hover:text-accent flex items-center gap-1.5"
            >
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">My Conversions</span>
            </Link>
            {!loading && user ? (
              <>
                <span className="text-sm font-medium text-foreground hidden md:inline">
                  {user.user_metadata?.full_name || user.email}
                </span>
                <Button
                  onClick={handleLogout}
                  disabled={loggingOut}
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline">{loggingOut ? 'Logging out...' : 'Log out'}</span>
                </Button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="text-sm font-medium transition-colors hover:text-foreground"
                  style={{ color: 'hsl(var(--accent))' }}
                >
                  Log in
                </Link>
                <Link
                  href="/auth/sign-up"
                  className="text-sm font-medium px-3 py-1.5 rounded-lg transition-colors"
                  style={{
                    backgroundColor: 'hsl(var(--accent))',
                    color: 'hsl(var(--accent-foreground))',
                  }}
                >
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
