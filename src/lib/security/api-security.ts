/**
 * API Security Middleware for Next.js
 * Provides comprehensive security for API routes
 */

import { NextRequest, NextResponse } from 'next/server'
import { validateSession } from '../auth/secure-credentials'
import { apiRateLimiter, securityHeaders, securityLogger } from './middleware'
import { sanitizeInput } from './encryption'

export interface SecurityConfig {
  requireAuth?: boolean
  requiredRole?: string
  rateLimit?: boolean
  validateCSRF?: boolean
  allowedMethods?: string[]
  maxBodySize?: number
}

/**
 * Secure API wrapper with comprehensive security checks
 */
export function withSecurity(
  handler: (req: NextRequest, context: any) => Promise<NextResponse>,
  config: SecurityConfig = {}
) {
  return async (req: NextRequest, context: any): Promise<NextResponse> => {
    const clientIP = getClientIP(req)
    const userAgent = req.headers.get('user-agent') || 'unknown'
    
    try {
      // Apply security headers
      const response = NextResponse.next()
      Object.entries(securityHeaders).forEach(([key, value]) => {
        response.headers.set(key, value)
      })

      // Check allowed methods
      if (config.allowedMethods && !config.allowedMethods.includes(req.method)) {
        securityLogger.log({
          type: 'invalid_request',
          identifier: clientIP,
          details: `Method not allowed: ${req.method}`,
          severity: 'medium'
        })
        return NextResponse.json(
          { error: 'Method not allowed' },
          { status: 405, headers: response.headers }
        )
      }

      // Rate limiting
      if (config.rateLimit !== false && !apiRateLimiter.isAllowed(clientIP)) {
        securityLogger.log({
          type: 'rate_limit',
          identifier: clientIP,
          details: 'API rate limit exceeded',
          severity: 'high'
        })
        return NextResponse.json(
          { error: 'Rate limit exceeded' },
          { status: 429, headers: response.headers }
        )
      }

      // Body size validation
      if (config.maxBodySize && req.body) {
        const contentLength = req.headers.get('content-length')
        if (contentLength && parseInt(contentLength) > config.maxBodySize) {
          securityLogger.log({
            type: 'invalid_request',
            identifier: clientIP,
            details: `Request body too large: ${contentLength}`,
            severity: 'medium'
          })
          return NextResponse.json(
            { error: 'Request body too large' },
            { status: 413, headers: response.headers }
          )
        }
      }

      // Authentication check
      if (config.requireAuth) {
        const authHeader = req.headers.get('authorization')
        const sessionToken = authHeader?.replace('Bearer ', '') || 
                           req.cookies.get('session_token')?.value

        if (!sessionToken) {
          securityLogger.log({
            type: 'auth_attempt',
            identifier: clientIP,
            details: 'Missing authentication token',
            severity: 'medium'
          })
          return NextResponse.json(
            { error: 'Authentication required' },
            { status: 401, headers: response.headers }
          )
        }

        const session = validateSession(sessionToken)
        if (!session) {
          securityLogger.log({
            type: 'auth_attempt',
            identifier: clientIP,
            details: 'Invalid or expired session token',
            severity: 'medium'
          })
          return NextResponse.json(
            { error: 'Invalid or expired session' },
            { status: 401, headers: response.headers }
          )
        }

        // Role-based access control
        if (config.requiredRole && session.role !== 'admin' && session.role !== config.requiredRole) {
          securityLogger.log({
            type: 'auth_attempt',
            identifier: clientIP,
            details: `Insufficient permissions: required ${config.requiredRole}, has ${session.role}`,
            severity: 'high'
          })
          return NextResponse.json(
            { error: 'Insufficient permissions' },
            { status: 403, headers: response.headers }
          )
        }

        // Add user context to request
        ;(req as any).user = session
      }

      // CSRF validation for state-changing operations
      if (config.validateCSRF && ['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method)) {
        const csrfToken = req.headers.get('x-csrf-token')
        const sessionToken = req.headers.get('authorization')?.replace('Bearer ', '')

        if (!csrfToken || !sessionToken) {
          securityLogger.log({
            type: 'invalid_request',
            identifier: clientIP,
            details: 'Missing CSRF token',
            severity: 'high'
          })
          return NextResponse.json(
            { error: 'CSRF token required' },
            { status: 403, headers: response.headers }
          )
        }
      }

      // Input sanitization for JSON requests
      if (req.headers.get('content-type')?.includes('application/json')) {
        try {
          const body = await req.json()
          const sanitizedBody = sanitizeRequestBody(body)
          ;(req as any).sanitizedBody = sanitizedBody
        } catch (error) {
          securityLogger.log({
            type: 'invalid_request',
            identifier: clientIP,
            details: 'Invalid JSON in request body',
            severity: 'medium'
          })
          return NextResponse.json(
            { error: 'Invalid JSON' },
            { status: 400, headers: response.headers }
          )
        }
      }

      // Call the actual handler
      const result = await handler(req, context)
      
      // Add security headers to response
      Object.entries(securityHeaders).forEach(([key, value]) => {
        result.headers.set(key, value)
      })

      return result

    } catch (error) {
      securityLogger.log({
        type: 'invalid_request',
        identifier: clientIP,
        details: `API error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        severity: 'high'
      })

      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      )
    }
  }
}

/**
 * Get client IP address
 */
function getClientIP(req: NextRequest): string {
  const forwarded = req.headers.get('x-forwarded-for')
  const realIP = req.headers.get('x-real-ip')
  const remoteAddr = req.headers.get('remote-addr')
  
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }
  
  return realIP || remoteAddr || 'unknown'
}

/**
 * Sanitize request body recursively
 */
function sanitizeRequestBody(obj: any): any {
  if (typeof obj === 'string') {
    return sanitizeInput(obj)
  }
  
  if (Array.isArray(obj)) {
    return obj.map(sanitizeRequestBody)
  }
  
  if (obj && typeof obj === 'object') {
    const sanitized: any = {}
    for (const [key, value] of Object.entries(obj)) {
      sanitized[sanitizeInput(key)] = sanitizeRequestBody(value)
    }
    return sanitized
  }
  
  return obj
}

/**
 * Validate file upload security
 */
export function validateFileUpload(file: File): { valid: boolean; error?: string } {
  const maxSize = 10 * 1024 * 1024 // 10MB
  const allowedTypes = [
    'application/pdf',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/csv',
    'image/jpeg',
    'image/png',
    'image/gif'
  ]

  if (file.size > maxSize) {
    return { valid: false, error: 'File size exceeds 10MB limit' }
  }

  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: 'File type not allowed' }
  }

  // Check for suspicious file names
  const suspiciousPatterns = [
    /\.exe$/i,
    /\.bat$/i,
    /\.cmd$/i,
    /\.scr$/i,
    /\.vbs$/i,
    /\.js$/i,
    /\.php$/i,
    /\.asp$/i,
    /\.jsp$/i
  ]

  if (suspiciousPatterns.some(pattern => pattern.test(file.name))) {
    return { valid: false, error: 'Suspicious file extension detected' }
  }

  return { valid: true }
}

/**
 * Generate secure API response
 */
export function createSecureResponse(data: any, status: number = 200): NextResponse {
  const response = NextResponse.json(data, { status })
  
  // Add security headers
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value)
  })

  // Add timestamp for debugging
  response.headers.set('X-Response-Time', new Date().toISOString())
  
  return response
}

/**
 * Log API access
 */
export function logAPIAccess(req: NextRequest, response: NextResponse): void {
  const clientIP = getClientIP(req)
  const userAgent = req.headers.get('user-agent') || 'unknown'
  const method = req.method
  const url = req.url
  const status = response.status

  securityLogger.log({
    type: 'auth_attempt',
    identifier: clientIP,
    details: `API Access: ${method} ${url} - Status: ${status} - UA: ${userAgent}`,
    severity: 'low'
  })
}
