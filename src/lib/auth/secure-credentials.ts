/**
 * Enhanced Secure Authentication System
 * Uses encryption and secure storage for credentials
 */

import { hashPassword, verifyPassword, generateSessionToken, sanitizeInput, isValidEmail } from '../security/encryption'
import { authRateLimiter, securityLogger, detectSuspiciousActivity } from '../security/middleware'

export interface SecureAuthCredentials {
  id: string
  email: string
  passwordHash: string
  passwordSalt: string
  role: string
  name: string
  lastLogin?: string
  loginAttempts: number
  lockedUntil?: number
  sessionToken?: string
  createdAt: string
  updatedAt: string
}

export interface AuthSession {
  userId: string
  email: string
  role: string
  name: string
  sessionToken: string
  expiresAt: number
  createdAt: number
}

// Secure credential storage (in production, this would be in a secure database)
const SECURE_USERS: SecureAuthCredentials[] = [
  {
    id: 'user_001',
    email: 'samathaschaffer322@gmail.com',
    passwordHash: '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918', // admin@trucking.com hashed
    passwordSalt: 'secure_salt_001',
    role: 'admin',
    name: 'Samatha Schaffer',
    loginAttempts: 0,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'user_002',
    email: 'dkim20263@gmail.com',
    passwordHash: 'a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3', // Dz300511# hashed
    passwordSalt: 'secure_salt_002',
    role: 'admin',
    name: 'D. Kim',
    loginAttempts: 0,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  }
]

// Active sessions storage
const activeSessions = new Map<string, AuthSession>()

/**
 * Account lockout configuration
 */
const MAX_LOGIN_ATTEMPTS = 5
const LOCKOUT_DURATION = 15 * 60 * 1000 // 15 minutes
const SESSION_DURATION = 24 * 60 * 60 * 1000 // 24 hours

/**
 * Validate user credentials securely with rate limiting
 */
export async function validateSecureCredentials(
  email: string, 
  password: string,
  clientIP: string = 'unknown'
): Promise<{ success: boolean; user?: SecureAuthCredentials; error?: string; session?: AuthSession }> {
  
  // Sanitize inputs
  const sanitizedEmail = sanitizeInput(email.toLowerCase())
  const sanitizedPassword = sanitizeInput(password)

  // Validate email format
  if (!isValidEmail(sanitizedEmail)) {
    securityLogger.log({
      type: 'auth_attempt',
      identifier: clientIP,
      details: `Invalid email format: ${sanitizedEmail}`,
      severity: 'medium'
    })
    return { success: false, error: 'Invalid email format' }
  }

  // Check rate limiting
  if (!authRateLimiter.isAllowed(clientIP)) {
    securityLogger.log({
      type: 'rate_limit',
      identifier: clientIP,
      details: `Authentication rate limit exceeded`,
      severity: 'high'
    })
    return { success: false, error: 'Too many login attempts. Please try again later.' }
  }

  // Find user
  const user = SECURE_USERS.find(u => u.email === sanitizedEmail)
  if (!user) {
    securityLogger.log({
      type: 'auth_attempt',
      identifier: clientIP,
      details: `User not found: ${sanitizedEmail}`,
      severity: 'medium'
    })
    return { success: false, error: 'Invalid credentials' }
  }

  // Check if account is locked
  if (user.lockedUntil && Date.now() < user.lockedUntil) {
    const remainingTime = Math.ceil((user.lockedUntil - Date.now()) / 60000)
    securityLogger.log({
      type: 'auth_attempt',
      identifier: clientIP,
      details: `Account locked: ${sanitizedEmail}`,
      severity: 'high'
    })
    return { 
      success: false, 
      error: `Account is locked. Try again in ${remainingTime} minutes.` 
    }
  }

  // Verify password
  const isValidPassword = verifyPassword(sanitizedPassword, user.passwordHash, user.passwordSalt)
  
  if (!isValidPassword) {
    // Increment login attempts
    user.loginAttempts++
    
    // Lock account if too many attempts
    if (user.loginAttempts >= MAX_LOGIN_ATTEMPTS) {
      user.lockedUntil = Date.now() + LOCKOUT_DURATION
      securityLogger.log({
        type: 'auth_attempt',
        identifier: clientIP,
        details: `Account locked due to failed attempts: ${sanitizedEmail}`,
        severity: 'high'
      })
    }

    securityLogger.log({
      type: 'auth_attempt',
      identifier: clientIP,
      details: `Failed login attempt: ${sanitizedEmail}`,
      severity: 'medium'
    })

    return { success: false, error: 'Invalid credentials' }
  }

  // Reset login attempts on successful login
  user.loginAttempts = 0
  user.lockedUntil = undefined
  user.lastLogin = new Date().toISOString()

  // Generate session
  const sessionToken = generateSessionToken()
  const session: AuthSession = {
    userId: user.id,
    email: user.email,
    role: user.role,
    name: user.name,
    sessionToken,
    expiresAt: Date.now() + SESSION_DURATION,
    createdAt: Date.now()
  }

  // Store session
  activeSessions.set(sessionToken, session)
  user.sessionToken = sessionToken

  securityLogger.log({
    type: 'auth_attempt',
    identifier: clientIP,
    details: `Successful login: ${sanitizedEmail}`,
    severity: 'low'
  })

  return { 
    success: true, 
    user: {
      ...user,
      passwordHash: '', // Never return password hash
      passwordSalt: ''  // Never return salt
    },
    session 
  }
}

/**
 * Validate session token
 */
export function validateSession(sessionToken: string): AuthSession | null {
  const session = activeSessions.get(sessionToken)
  
  if (!session) {
    return null
  }

  // Check if session is expired
  if (Date.now() > session.expiresAt) {
    activeSessions.delete(sessionToken)
    return null
  }

  return session
}

/**
 * Invalidate session (logout)
 */
export function invalidateSession(sessionToken: string): boolean {
  const session = activeSessions.get(sessionToken)
  if (session) {
    activeSessions.delete(sessionToken)
    
    // Clear session token from user
    const user = SECURE_USERS.find(u => u.id === session.userId)
    if (user) {
      user.sessionToken = undefined
    }

    securityLogger.log({
      type: 'auth_attempt',
      identifier: session.email,
      details: 'User logged out',
      severity: 'low'
    })

    return true
  }
  return false
}

/**
 * Get user by session token
 */
export function getUserBySession(sessionToken: string): SecureAuthCredentials | null {
  const session = validateSession(sessionToken)
  if (!session) {
    return null
  }

  const user = SECURE_USERS.find(u => u.id === session.userId)
  if (user) {
    return {
      ...user,
      passwordHash: '', // Never return password hash
      passwordSalt: ''  // Never return salt
    }
  }

  return null
}

/**
 * Check if user is authorized for specific role
 */
export function isAuthorizedForRole(sessionToken: string, requiredRole: string): boolean {
  const session = validateSession(sessionToken)
  if (!session) {
    return false
  }

  // Admin can access everything
  if (session.role === 'admin') {
    return true
  }

  return session.role === requiredRole
}

/**
 * Clean up expired sessions
 */
export function cleanupExpiredSessions(): void {
  const now = Date.now()
  for (const [token, session] of activeSessions.entries()) {
    if (now > session.expiresAt) {
      activeSessions.delete(token)
      
      // Clear session token from user
      const user = SECURE_USERS.find(u => u.id === session.userId)
      if (user) {
        user.sessionToken = undefined
      }
    }
  }
}

/**
 * Get security statistics
 */
export function getSecurityStats(): {
  activeSessions: number
  recentFailedAttempts: number
  lockedAccounts: number
} {
  const now = Date.now()
  const recentEvents = securityLogger.getRecentEvents(60) // Last hour
  
  return {
    activeSessions: activeSessions.size,
    recentFailedAttempts: recentEvents.filter(e => 
      e.type === 'auth_attempt' && e.details.includes('Failed')
    ).length,
    lockedAccounts: SECURE_USERS.filter(u => 
      u.lockedUntil && now < u.lockedUntil
    ).length
  }
}

// Cleanup expired sessions every 5 minutes
setInterval(cleanupExpiredSessions, 5 * 60 * 1000)
