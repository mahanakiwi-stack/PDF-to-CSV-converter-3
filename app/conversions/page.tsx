'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { Download, Trash2, ChevronLeft, FileText, Calendar, FileJson } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface Conversion {
  id: string
  file_name: string
  transaction_count: number
  mode: 'ai' | 'local'
  created_at: string
  csv_data: string
}

// Helper function to convert a string to a UUID v5 - defined outside component
const stringToUUID = async (str: string): Promise<string> => {
  try {
    // Create a namespace UUID for our app
    const NAMESPACE = '6ba7b810-9dad-11d1-80b4-00c04fd430c8' // DNS namespace
    
    // Simple implementation of UUID v5 using SHA-1
    const utf8 = new TextEncoder().encode(`${NAMESPACE}${str}`)
    const hashBuffer = await crypto.subtle.digest('SHA-1', utf8)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
    
    // Format as UUID v5
    return `${hashHex.slice(0, 8)}-${hashHex.slice(8, 12)}-5${hashHex.slice(13, 16)}-${((parseInt(hashHex.slice(16, 18), 16) & 0x3f) | 0x80).toString(16).padStart(2, '0')}${hashHex.slice(18, 20)}-${hashHex.slice(20, 32)}`
  } catch (error) {
    console.error('[v0] Error in stringToUUID:', error)
    // Fallback: use a simpler hash-based UUID
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash
    }
    const hashStr = Math.abs(hash).toString(16).padStart(32, '0')
    return `${hashStr.slice(0, 8)}-${hashStr.slice(8, 12)}-${hashStr.slice(12, 16)}-${hashStr.slice(16, 20)}-${hashStr.slice(20, 32)}`
  }
}

export default function ConversionsPage() {
  const [conversions, setConversions] = useState<Conversion[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    const fetchUserAndConversions = async () => {
      try {
        // Check if user is logged in
        const { data: { session } } = await supabase.auth.getSession()
        
        let userId: string | null = null
        
        if (session?.user) {
          // Authenticated user
          setUser(session.user)
          userId = session.user.id
        } else {
          // Anonymous user - check for stored session ID and convert to UUID
          if (typeof window !== 'undefined') {
            const anonSessionId = localStorage.getItem('anon_session_id')
            console.log('[v0] Conversions page - anonSessionId:', anonSessionId)
            if (anonSessionId) {
              userId = await stringToUUID(anonSessionId)
              console.log('[v0] Conversions page - converted to UUID:', userId)
            }
          }
          
          if (!userId) {
            console.log('[v0] Conversions page - no userId, showing empty')
            setConversions([])
            setLoading(false)
            return
          }
        }

        // Fetch conversions with user_id
        console.log('[v0] Conversions page - fetching with userId:', userId)
        const response = await fetch(`/api/conversions/list?user_id=${userId}`)
        const data = await response.json()
        console.log('[v0] Conversions page - API response:', data)

        if (data.success) {
          console.log('[v0] Conversions page - found', data.data?.length || 0, 'conversions')
          setConversions(data.data || [])
        } else {
          console.log('[v0] Conversions page - API error:', data)
        }
      } catch (error) {
        console.error('[v0] Error fetching conversions:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchUserAndConversions()
  }, [])

  const handleDownloadCSV = (conversion: Conversion) => {
    const element = document.createElement('a')
    const file = new Blob([conversion.csv_data], { type: 'text/csv' })
    element.href = URL.createObjectURL(file)
    element.download = conversion.file_name.replace('.pdf', '.csv')
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this conversion?')) return

    try {
      const response = await fetch(`/api/conversions/delete?id=${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setConversions(conversions.filter(c => c.id !== id))
      }
    } catch (error) {
      console.error('[v0] Error deleting conversion:', error)
    }
  }

  const handleDeleteAll = async () => {
    if (!confirm('Are you sure you want to delete all conversions? This action cannot be undone.')) return

    try {
      // Get user ID (same logic as in fetchUserAndConversions)
      const { data: { session } } = await supabase.auth.getSession()
      let userId: string | null = null
      
      if (session?.user) {
        userId = session.user.id
      } else {
        if (typeof window !== 'undefined') {
          const anonSessionId = localStorage.getItem('anon_session_id')
          if (anonSessionId) {
            userId = await stringToUUID(anonSessionId)
          }
        }
      }

      if (!userId) return

      const response = await fetch(`/api/conversions/delete-all?user_id=${userId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setConversions([])
      }
    } catch (error) {
      console.error('[v0] Error deleting all conversions:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="h-8 w-8 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground">Loading your conversions...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 p-4 md:p-6">
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Back Button */}
        <Link href="/">
          <Button
            variant="ghost"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Back</span>
          </Button>
        </Link>

        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">My Conversions</h1>
              <p className="text-muted-foreground mt-1">
                View and download your previously converted bank statements
              </p>
            </div>
            {conversions.length > 0 && (
              <Button
                onClick={handleDeleteAll}
                variant="outline"
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Clear All
              </Button>
            )}
          </div>
        </div>

        {/* Empty State */}
        {conversions.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12 space-y-3">
              <FileText className="h-12 w-12 text-muted-foreground/30" />
              <div className="text-center space-y-1">
                <p className="font-semibold text-foreground">No conversions yet</p>
                <p className="text-sm text-muted-foreground">
                  Convert a bank statement to see it here
                </p>
              </div>
              <Link href="/">
                <Button className="mt-4">
                  Convert a Statement
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          /* Conversions List */
          <div className="grid gap-4 md:grid-cols-2">
            {conversions.map((conversion) => (
              <Card key={conversion.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-200">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-base truncate">
                        {conversion.file_name}
                      </CardTitle>
                      <CardDescription className="text-xs mt-1">
                        {conversion.transaction_count} transactions
                      </CardDescription>
                    </div>
                    <span className="text-xs font-medium px-2 py-1 rounded-full bg-accent/10 text-accent whitespace-nowrap">
                      {conversion.mode === 'ai' ? 'AI-Powered' : 'Local'}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>
                        {new Date(conversion.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>
                        {new Date(conversion.created_at).toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button
                      onClick={() => handleDownloadCSV(conversion)}
                      size="sm"
                      className="flex-1 flex items-center justify-center gap-2"
                    >
                      <Download className="h-4 w-4" />
                      <span>Download</span>
                    </Button>
                    <Button
                      onClick={() => handleDelete(conversion.id)}
                      variant="outline"
                      size="sm"
                      className="flex items-center justify-center gap-2"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
