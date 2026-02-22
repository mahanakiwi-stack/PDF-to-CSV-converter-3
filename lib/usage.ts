import { supabase } from '@/lib/supabase'
import { getServiceRoleClient } from '@/lib/supabase-service'
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

// Initialize Redis only if credentials are available
const redis = process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN
  ? new Redis({
      url: process.env.KV_REST_API_URL,
      token: process.env.KV_REST_API_TOKEN,
    })
  : null

const ANON_DAILY_LIMIT = 2
const FREE_DAILY_LIMIT = 5

// Test user with unlimited conversions - replace with your test user ID
const TEST_USER_ID = process.env.NEXT_PUBLIC_TEST_USER_ID

export interface UsageInfo {
  used: number
  limit: number
  remaining: number
  isAuthenticated: boolean
  tier: 'free' | 'pro'
}

export async function getUsageInfo(sessionId?: string, user?: any): Promise<UsageInfo> {
  try {
    let currentUser = user

    if (!currentUser) {
      const {
        data: { user: clientUser },
      } = await supabase.auth.getUser()
      currentUser = clientUser
    }

    if (!currentUser) {
      // Anonymous user
      if (!redis) {
        return {
          used: 0,
          limit: ANON_DAILY_LIMIT,
          remaining: ANON_DAILY_LIMIT,
          isAuthenticated: false,
          tier: 'free',
        }
      }

      try {
        // Use session-specific key for anonymous users
        const anonKey = sessionId ? `anon-usage:${sessionId}` : `anon-usage`
        const result = await redis.get(anonKey)
        const used = result ? parseInt(result as string, 10) : 0
        
        return {
          used,
          limit: ANON_DAILY_LIMIT,
          remaining: Math.max(0, ANON_DAILY_LIMIT - used),
          isAuthenticated: false,
          tier: 'free',
        }
      } catch {
        return {
          used: 0,
          limit: ANON_DAILY_LIMIT,
          remaining: ANON_DAILY_LIMIT,
          isAuthenticated: false,
          tier: 'free',
        }
      }
    }

    // Check if this is a test user with unlimited conversions
    console.log('[v0] TEST_USER_ID from env:', TEST_USER_ID)
    console.log('[v0] currentUser.id:', currentUser.id)
    console.log('[v0] User is test user?', TEST_USER_ID && currentUser.id === TEST_USER_ID)
    
    if (TEST_USER_ID && currentUser.id === TEST_USER_ID) {
      console.log('[v0] Test user detected - granting unlimited conversions')
      return {
        used: 0,
        limit: 999999,
        remaining: 999999,
        isAuthenticated: true,
        tier: 'pro',
      }
    }

    // Authenticated user - use Redis for tracking (same as anonymous users)
    if (!redis) {
      return {
        used: 0,
        limit: FREE_DAILY_LIMIT,
        remaining: FREE_DAILY_LIMIT,
        isAuthenticated: true,
        tier: 'free',
      }
    }

    try {
      // Use user ID as the key for authenticated users
      const userKey = `user-usage:${currentUser.id}`
      const result = await redis.get(userKey)
      const used = result ? parseInt(result as string, 10) : 0

      return {
        used,
        limit: FREE_DAILY_LIMIT,
        remaining: Math.max(0, FREE_DAILY_LIMIT - used),
        isAuthenticated: true,
        tier: 'free',
      }
    } catch (error) {
      console.error('[v0] getUsageInfo - redis error:', error)
      return {
        used: 0,
        limit: FREE_DAILY_LIMIT,
        remaining: FREE_DAILY_LIMIT,
        isAuthenticated: true,
        tier: 'free',
      }
    }
  } catch (error) {
    console.error('[v0] Error getting usage:', error)
    return {
      used: 0,
      limit: FREE_DAILY_LIMIT,
      remaining: FREE_DAILY_LIMIT,
      isAuthenticated: false,
      tier: 'free',
    }
  }
}

export async function checkAndRecordUsage(
  pageCount: number,
  user?: any,
  sessionId?: string,
  fileData?: { fileName: string; transactionCount: number; csvData: string }
): Promise<{ success: boolean; usage?: UsageInfo; error?: string }> {
  try {
    if (!user) {
      // Anonymous user - rate limit
      if (!redis) {
        return {
          success: true,
          usage: {
            used: 0,
            limit: ANON_DAILY_LIMIT,
            remaining: ANON_DAILY_LIMIT,
            isAuthenticated: false,
            tier: 'free',
          },
        }
      }

      try {
        const anonKey = sessionId ? `anon-usage:${sessionId}` : `anon-usage`
        const current = await redis.get(anonKey)
        const used = current ? parseInt(current as string, 10) : 0

        // Check if adding pageCount would exceed limit
        if (used + pageCount > ANON_DAILY_LIMIT) {
          return {
            success: false,
            error: `Daily limit reached. You have ${Math.max(0, ANON_DAILY_LIMIT - used)} pages remaining today.`,
            usage: {
              used,
              limit: ANON_DAILY_LIMIT,
              remaining: Math.max(0, ANON_DAILY_LIMIT - used),
              isAuthenticated: false,
              tier: 'free',
            },
          }
        }

        // Increment usage and set expiry to 24 hours
        const newUsed = used + pageCount
        await redis.setex(anonKey, 86400, newUsed.toString())

        return {
          success: true,
          usage: {
            used: newUsed,
            limit: ANON_DAILY_LIMIT,
            remaining: Math.max(0, ANON_DAILY_LIMIT - newUsed),
            isAuthenticated: false,
            tier: 'free',
          },
        }
      } catch (error) {
        console.error('[v0] Rate limit error:', error)
        return {
          success: true,
          usage: {
            used: 0,
            limit: ANON_DAILY_LIMIT,
            remaining: ANON_DAILY_LIMIT,
            isAuthenticated: false,
            tier: 'free',
          },
        }
      }
    }

    // Check if this is a test user with unlimited conversions
    if (TEST_USER_ID && user.id === TEST_USER_ID) {
      return {
        success: true,
        usage: {
          used: 0,
          limit: 999999,
          remaining: 999999,
          isAuthenticated: true,
          tier: 'pro',
        },
      }
    }

    // Authenticated user - use Redis for tracking (same as anonymous, but with user-specific key)
    if (!redis) {
      return {
        used: 0,
        limit: FREE_DAILY_LIMIT,
        remaining: FREE_DAILY_LIMIT,
        isAuthenticated: true,
        tier: 'free',
      }
    }

    try {
      // Use user ID as the key for authenticated users
      const userKey = `user-usage:${user.id}`
      const current = await redis.get(userKey)
      const used = current ? parseInt(current as string, 10) : 0

      const limit = FREE_DAILY_LIMIT

      // Check if adding pageCount would exceed limit
      if (used + pageCount > limit) {
        return {
          success: false,
          error: `Daily limit reached. You have ${Math.max(0, limit - used)} pages remaining today.`,
          usage: {
            used,
            limit,
            remaining: Math.max(0, limit - used),
            isAuthenticated: true,
            tier: 'free',
          },
        }
      }

      // Increment usage and set expiry to 24 hours
      const newUsed = used + pageCount
      await redis.setex(userKey, 86400, newUsed.toString())

      return {
        success: true,
        usage: {
          used: newUsed,
          limit,
          remaining: Math.max(0, limit - newUsed),
          isAuthenticated: true,
          tier: 'free',
        },
      }
    } catch (error) {
      console.error('[v0] Rate limit error:', error)
      return {
        success: false,
        error: 'Failed to check usage',
      }
    }
  } catch (error) {
    console.error('[v0] Error in checkAndRecordUsage:', error)
    return {
      success: false,
      error: 'Failed to check usage',
    }
  }
}
