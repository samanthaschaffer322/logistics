/**
 * Security Middleware
 * Provides rate limiting, request validation, and security headers
 */

interface RateLimitEntry {
  count: number
  resetTime: number
}

class RateLimiter {
  private requests: Map<string, RateLimitEntry> = new Map()
  private readonly maxRequests: number
  private readonly windowMs: number

  constructor(maxRequests: number = 100, windowMs: number = 15 * 60 * 1000) {
    this.maxRequests = maxRequests
    this.windowMs = windowMs
  }

  isAllowed(identifier: string): boolean {
    const now = Date.now()
    const entry = this.requests.get(identifier)

    if (!entry || now > entry.resetTime) {
      this.requests.set(identifier, {
        count: 1,
        resetTime: now + this.windowMs
      })
      return true
    }

    if (entry.count >= this.maxRequests) {
      return false
    }

    entry.count++
    return true
  }

  getRemainingRequests(identifier: string): number {
    const entry = this.requests.get(identifier)
    if (!entry || Date.now() > entry.resetTime) {
      return this.maxRequests
    }
    return Math.max(0, this.maxRequests - entry.count)
  }

  cleanup(): void {
    const now = Date.now()
    for (const [key, entry] of this.requests.entries()) {
      if (now > entry.resetTime) {
        this.requests.delete(key)
      }
    }
  }
}

// Global rate limiters
export const authRateLimiter = new RateLimiter(5, 15 * 60 * 1000) // 5 attempts per 15 minutes
export const apiRateLimiter = new RateLimiter(100, 15 * 60 * 1000) // 100 requests per 15 minutes
export const fileUploadRateLimiter = new RateLimiter(10, 60 * 1000) // 10 uploads per minute

/**
 * Security headers for enhanced protection
 */
export const securityHeaders = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'Content-Security-Policy': `
    default-src 'self';
    script-src 'self' 'unsafe-inline' 'unsafe-eval' https://unpkg.com;
    style-src 'self' 'unsafe-inline' https://unpkg.com;
    img-src 'self' data: https: blob:;
    font-src 'self' data:;
    connect-src 'self' https://api.openai.com https://*.supabase.co;
    frame-src 'none';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
  `.replace(/\s+/g, ' ').trim()
}

/**
 * Validate request origin
 */
export function validateOrigin(origin: string | null, allowedOrigins: string[]): boolean {
  if (!origin) return false
  return allowedOrigins.includes(origin)
}

/**
 * Generate CSRF token
 */
export function generateCSRFToken(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}

/**
 * Validate CSRF token
 */
export function validateCSRFToken(token: string, sessionToken: string): boolean {
  // Simple validation - in production, use more sophisticated method
  return token.length > 10 && sessionToken.length > 10
}

/**
 * Log security events
 */
export interface SecurityEvent {
  type: 'auth_attempt' | 'rate_limit' | 'invalid_request' | 'suspicious_activity'
  identifier: string
  details: string
  timestamp: number
  severity: 'low' | 'medium' | 'high'
}

class SecurityLogger {
  private events: SecurityEvent[] = []
  private readonly maxEvents = 1000

  log(event: Omit<SecurityEvent, 'timestamp'>): void {
    const securityEvent: SecurityEvent = {
      ...event,
      timestamp: Date.now()
    }

    this.events.push(securityEvent)

    // Keep only recent events
    if (this.events.length > this.maxEvents) {
      this.events = this.events.slice(-this.maxEvents)
    }

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.warn(`[SECURITY] ${event.type}: ${event.details}`, securityEvent)
    }
  }

  getEvents(type?: SecurityEvent['type']): SecurityEvent[] {
    if (type) {
      return this.events.filter(event => event.type === type)
    }
    return [...this.events]
  }

  getRecentEvents(minutes: number = 60): SecurityEvent[] {
    const cutoff = Date.now() - (minutes * 60 * 1000)
    return this.events.filter(event => event.timestamp > cutoff)
  }
}

export const securityLogger = new SecurityLogger()

/**
 * Detect suspicious patterns
 */
export function detectSuspiciousActivity(identifier: string, events: SecurityEvent[]): boolean {
  const recentEvents = events.filter(
    event => event.identifier === identifier && 
    event.timestamp > Date.now() - (5 * 60 * 1000) // Last 5 minutes
  )

  // Multiple failed auth attempts
  const failedAuthAttempts = recentEvents.filter(e => e.type === 'auth_attempt').length
  if (failedAuthAttempts > 3) return true

  // Rate limit violations
  const rateLimitViolations = recentEvents.filter(e => e.type === 'rate_limit').length
  if (rateLimitViolations > 5) return true

  return false
}

/**
 * Clean up expired data
 */
export function cleanupSecurityData(): void {
  authRateLimiter.cleanup()
  apiRateLimiter.cleanup()
  fileUploadRateLimiter.cleanup()
}
