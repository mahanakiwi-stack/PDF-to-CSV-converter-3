import { supabase } from '@/lib/supabase'
import { headers } from 'next/headers'
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
})

// Rate limit: 5 signups per hour per IP
const signupRateLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, '1 h'),
  analytics: true,
  prefix: 'signup-rate-limit',
})

// Common disposable email domains
const DISPOSABLE_EMAIL_DOMAINS = new Set([
  'tempmail.com',
  'guerrillamail.com',
  '10minutemail.com',
  'mailinator.com',
  'throwaway.email',
  'fake-mail.com',
  'spam4.me',
  'trashmail.com',
  'yopmail.com',
  'temp-mail.org',
  'maildrop.cc',
  'dispostable.com',
  'tempemail.com',
  'sharklasers.com',
  'grr.la',
  'pokemail.net',
  'fakeinbox.com',
  'emailondeck.com',
  'mailnesia.com',
  '10minemail.com',
])

async function verifyRecaptcha(token: string): Promise<boolean> {
  if (!token) return false
  
  try {
    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${token}`,
    })

    const data = await response.json()
    return data.success && data.score > 0.5
  } catch (error) {
    console.error('[v0] reCAPTCHA verification error:', error)
    return false
  }
}

function isDisposableEmail(email: string): boolean {
  const domain = email.split('@')[1]?.toLowerCase()
  return DISPOSABLE_EMAIL_DOMAINS.has(domain || '')
}

export async function POST(request: Request) {
  console.log('[v0] ===== SIGNUP API CALLED =====')
  console.log('[v0] NEXT_PUBLIC_APP_URL env var:', process.env.NEXT_PUBLIC_APP_URL)
  console.log('[v0] Node env:', process.env.NODE_ENV)
  
  try {
    // Get client IP for rate limiting
    const headersList = await headers()
    const ip = headersList.get('x-forwarded-for')?.split(',')[0]?.trim() || 
               headersList.get('x-real-ip') || 
               'unknown'

    // Rate limit check
    const { success } = await signupRateLimiter.limit(ip)
    if (!success) {
      console.warn('[v0] Signup rate limit exceeded for IP:', ip)
      return Response.json(
        { error: 'Too many signup attempts. Please try again later.' },
        { status: 429 }
      )
    }

    const body = await request.json()
    const { email, password, fullName, recaptchaToken } = body
    console.log('[v0] Received signup request for:', email)

    if (!email || !password || !fullName) {
      return Response.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Verify reCAPTCHA
    const isValidCaptcha = await verifyRecaptcha(recaptchaToken)
    if (!isValidCaptcha) {
      console.warn('[v0] reCAPTCHA verification failed for email:', email)
      return Response.json(
        { error: 'Security verification failed. Please try again.' },
        { status: 400 }
      )
    }

    // Check for disposable email
    if (isDisposableEmail(email)) {
      console.warn('[v0] Disposable email attempted signup:', email)
      return Response.json(
        { error: 'Disposable email addresses are not allowed. Please use a real email address.' },
        { status: 400 }
      )
    }

    const redirectUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/auth/callback`
    console.log('[v0] Signup redirect URL:', redirectUrl)
    console.log('[v0] NEXT_PUBLIC_APP_URL env var:', process.env.NEXT_PUBLIC_APP_URL)

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
        emailRedirectTo: redirectUrl,
      },
    })

    if (error) {
      console.error('[v0] Supabase signup error:', error)
      
      // Check for specific error types and provide friendly messages
      let userMessage = error.message
      const errorLower = error.message?.toLowerCase() || ''
      
      if (errorLower.includes('user already registered') || 
          errorLower.includes('already registered') ||
          errorLower.includes('already exists') ||
          errorLower.includes('duplicate') ||
          errorLower.includes('email already')) {
        userMessage = 'This email is already registered. Please log in instead.'
      } else if (errorLower.includes('password')) {
        userMessage = 'Password does not meet security requirements.'
      } else if (errorLower.includes('invalid email')) {
        userMessage = 'Please enter a valid email address.'
      }
      
      return Response.json(
        { error: userMessage },
        { status: 400 }
      )
    }

    console.log('[v0] Signup successful for email:', email)
    return Response.json({
      user: data.user,
      session: data.session,
    })
  } catch (error) {
    console.error('[v0] Sign up error:', error)
    return Response.json(
      { error: 'An error occurred during sign up' },
      { status: 500 }
    )
  }
}
