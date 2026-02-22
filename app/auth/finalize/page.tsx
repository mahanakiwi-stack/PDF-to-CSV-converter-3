'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Loader2 } from 'lucide-react'

export default function FinalizeAuthPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(true)

  useEffect(() => {
    const finalizeAuth = async () => {
      try {
        console.log('[v0] Finalizing auth on client side')
        console.log('[v0] Full URL:', window.location.href)
        console.log('[v0] Hash:', window.location.hash)

        // Get the hash fragment which contains the session data
        const hash = window.location.hash.substring(1) // Remove the # prefix
        
        if (!hash) {
          console.error('[v0] No hash fragment found')
          setError('Invalid or expired verification link')
          setIsProcessing(false)
          return
        }

        // Supabase's session verification automatically handles the hash
        // Just check if we have a session now
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()
        
        console.log('[v0] Session after hash processing:', session ? 'found' : 'not found')
        
        if (sessionError) {
          console.error('[v0] Session error:', sessionError)
          setError(sessionError.message)
          setIsProcessing(false)
          return
        }

        if (session) {
          console.log('[v0] Email verification successful!')
          // Redirect to dashboard
          router.push('/dashboard')
        } else {
          console.error('[v0] No session found after verification')
          setError('Failed to verify email. Please try again.')
          setIsProcessing(false)
        }
      } catch (error) {
        console.error('[v0] Error finalizing auth:', error)
        setError(error instanceof Error ? error.message : 'An unexpected error occurred')
        setIsProcessing(false)
      }
    }

    finalizeAuth()
  }, [router])

  if (isProcessing) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-accent" />
          <p className="text-muted-foreground">Verifying your email...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <p className="text-destructive">Error: {error}</p>
          <a href="/auth/login" className="text-accent hover:underline">
            Back to login
          </a>
        </div>
      </div>
    )
  }

  return null
}
