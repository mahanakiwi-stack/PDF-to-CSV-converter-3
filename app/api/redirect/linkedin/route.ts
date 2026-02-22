import { headers } from 'next/headers'
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
})

// Aggressive rate limit: 10 requests per minute for redirect attempts
const redirectLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, '60 s'),
  analytics: true,
})

// Stricter limit: 3 failed reCAPTCHA attempts per hour
const recaptchaLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(3, '3600 s'),
  analytics: true,
})

export async function GET(req: Request) {
  try {
    const headersList = await headers()
    const ip = headersList.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 
               headersList.get('x-real-ip') ?? 
               'unknown'

    const { searchParams } = new URL(req.url)
    const recaptchaToken = searchParams.get('token')

    // Check redirect rate limit
    const redirectLimit = await redirectLimiter.limit(`linkedin-redirect:${ip}`)
    
    // If rate limit exceeded, require reCAPTCHA
    if (!redirectLimit.success) {
      // Check if they're trying to bypass with reCAPTCHA
      if (!recaptchaToken) {
        return Response.json(
          { error: 'Too many redirect attempts. Please verify you are human.', requiresRecaptcha: true },
          { status: 429 }
        )
      }

      // Verify reCAPTCHA token
      const recaptchaResponse = await fetch(
        'https://www.google.com/recaptcha/api/siteverify',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${recaptchaToken}`,
        }
      )

      const recaptchaData = await recaptchaResponse.json()

      // Check reCAPTCHA verification
      if (!recaptchaData.success || recaptchaData.score < 0.5) {
        // Track failed reCAPTCHA attempts
        const captchaLimit = await recaptchaLimiter.limit(`linkedin-captcha-fail:${ip}`)
        if (!captchaLimit.success) {
          return Response.json(
            { error: 'Too many failed verification attempts. Please try again later.' },
            { status: 429 }
          )
        }

        return Response.json(
          { error: 'reCAPTCHA verification failed. Please try again.' },
          { status: 400 }
        )
      }

      // reCAPTCHA passed, allow redirect
      return Response.json({
        redirect: 'https://www.linkedin.com/in/ryan-vergottini-504951154',
      })
    }

    // Normal traffic - allow redirect without reCAPTCHA
    return Response.json({
      redirect: 'https://www.linkedin.com/in/ryan-vergottini-504951154',
    })
  } catch (error) {
    console.error('LinkedIn redirect error:', error)
    return Response.json(
      { error: 'Failed to process redirect request.' },
      { status: 500 }
    )
  }
}
