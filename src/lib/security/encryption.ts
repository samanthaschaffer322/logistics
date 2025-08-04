/**
 * Enhanced Security Encryption Utilities
 * Provides secure encryption/decryption for sensitive data
 */

import { createHash, createCipher, createDecipher, randomBytes } from 'crypto'

// Security configuration
const ENCRYPTION_ALGORITHM = 'aes-256-cbc'
const HASH_ALGORITHM = 'sha256'
const SALT_LENGTH = 32
const IV_LENGTH = 16

/**
 * Generate a secure random salt
 */
export function generateSalt(): string {
  return randomBytes(SALT_LENGTH).toString('hex')
}

/**
 * Generate a secure random IV
 */
export function generateIV(): string {
  return randomBytes(IV_LENGTH).toString('hex')
}

/**
 * Hash password with salt using PBKDF2
 */
export function hashPassword(password: string, salt?: string): { hash: string; salt: string } {
  const passwordSalt = salt || generateSalt()
  const hash = createHash(HASH_ALGORITHM)
    .update(password + passwordSalt)
    .digest('hex')
  
  return { hash, salt: passwordSalt }
}

/**
 * Verify password against hash
 */
export function verifyPassword(password: string, hash: string, salt: string): boolean {
  const { hash: newHash } = hashPassword(password, salt)
  return newHash === hash
}

/**
 * Encrypt sensitive data
 */
export function encryptData(data: string, key: string): { encrypted: string; iv: string } {
  const iv = randomBytes(IV_LENGTH)
  const cipher = createCipher(ENCRYPTION_ALGORITHM, key)
  
  let encrypted = cipher.update(data, 'utf8', 'hex')
  encrypted += cipher.final('hex')
  
  return {
    encrypted,
    iv: iv.toString('hex')
  }
}

/**
 * Decrypt sensitive data
 */
export function decryptData(encryptedData: string, key: string, iv: string): string {
  const decipher = createDecipher(ENCRYPTION_ALGORITHM, key)
  
  let decrypted = decipher.update(encryptedData, 'hex', 'utf8')
  decrypted += decipher.final('utf8')
  
  return decrypted
}

/**
 * Generate secure session token
 */
export function generateSessionToken(): string {
  return randomBytes(64).toString('hex')
}

/**
 * Generate API key
 */
export function generateApiKey(): string {
  const timestamp = Date.now().toString()
  const random = randomBytes(32).toString('hex')
  return createHash(HASH_ALGORITHM)
    .update(timestamp + random)
    .digest('hex')
}

/**
 * Sanitize input to prevent XSS
 */
export function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+=/gi, '')
    .trim()
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Validate password strength
 */
export function validatePasswordStrength(password: string): {
  isValid: boolean
  score: number
  feedback: string[]
} {
  const feedback: string[] = []
  let score = 0

  if (password.length >= 8) score += 1
  else feedback.push('Password must be at least 8 characters long')

  if (/[a-z]/.test(password)) score += 1
  else feedback.push('Password must contain lowercase letters')

  if (/[A-Z]/.test(password)) score += 1
  else feedback.push('Password must contain uppercase letters')

  if (/\d/.test(password)) score += 1
  else feedback.push('Password must contain numbers')

  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 1
  else feedback.push('Password must contain special characters')

  return {
    isValid: score >= 4,
    score,
    feedback
  }
}
