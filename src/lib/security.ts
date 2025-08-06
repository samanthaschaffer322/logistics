// Comprehensive Security Layer for Logistics Application
import CryptoJS from 'crypto-js'

// Security configuration
const SECURITY_CONFIG = {
  encryption: {
    algorithm: 'AES',
    keySize: 256,
    iterations: 10000
  },
  session: {
    timeout: 30 * 60 * 1000, // 30 minutes
    maxAttempts: 5,
    lockoutDuration: 15 * 60 * 1000 // 15 minutes
  },
  validation: {
    maxFileSize: 50 * 1024 * 1024, // 50MB
    allowedFileTypes: ['.xlsx', '.xls', '.csv', '.pdf'],
    maxFilesPerUpload: 10
  },
  rateLimit: {
    maxRequests: 100,
    windowMs: 15 * 60 * 1000 // 15 minutes
  }
}

// Input sanitization and validation
export class SecurityValidator {
  
  // Sanitize user input to prevent XSS
  static sanitizeInput(input: string): string {
    if (typeof input !== 'string') return ''
    
    return input
      .replace(/[<>]/g, '') // Remove potential HTML tags
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/on\w+=/gi, '') // Remove event handlers
      .replace(/script/gi, '') // Remove script references
      .trim()
      .substring(0, 1000) // Limit length
  }

  // Validate coordinates
  static validateCoordinates(lat: number, lng: number): boolean {
    return (
      typeof lat === 'number' &&
      typeof lng === 'number' &&
      lat >= -90 && lat <= 90 &&
      lng >= -180 && lng <= 180 &&
      !isNaN(lat) && !isNaN(lng)
    )
  }

  // Validate file upload
  static validateFile(file: File): { valid: boolean; error?: string } {
    // Check file size
    if (file.size > SECURITY_CONFIG.validation.maxFileSize) {
      return { valid: false, error: 'File size exceeds 50MB limit' }
    }

    // Check file type
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase()
    if (!SECURITY_CONFIG.validation.allowedFileTypes.includes(fileExtension)) {
      return { valid: false, error: 'File type not allowed. Only Excel, CSV, and PDF files are permitted.' }
    }

    // Check file name for malicious patterns
    if (this.containsMaliciousPatterns(file.name)) {
      return { valid: false, error: 'File name contains invalid characters' }
    }

    return { valid: true }
  }

  // Check for malicious patterns in file names
  private static containsMaliciousPatterns(filename: string): boolean {
    const maliciousPatterns = [
      /\.\./,  // Directory traversal
      /[<>:"|?*]/,  // Invalid filename characters
      /^(con|prn|aux|nul|com[1-9]|lpt[1-9])$/i,  // Windows reserved names
      /\.(exe|bat|cmd|scr|pif|com|dll)$/i  // Executable extensions
    ]

    return maliciousPatterns.some(pattern => pattern.test(filename))
  }

  // Validate Vietnamese logistics data
  static validateLogisticsData(data: any): { valid: boolean; errors: string[] } {
    const errors: string[] = []

    // Required fields validation
    if (!data.origin || typeof data.origin !== 'string') {
      errors.push('Origin is required and must be a string')
    }

    if (!data.destination || typeof data.destination !== 'string') {
      errors.push('Destination is required and must be a string')
    }

    // Optional numeric fields validation
    if (data.weight !== undefined && (typeof data.weight !== 'number' || data.weight < 0)) {
      errors.push('Weight must be a positive number')
    }

    if (data.distance !== undefined && (typeof data.distance !== 'number' || data.distance < 0)) {
      errors.push('Distance must be a positive number')
    }

    if (data.cost !== undefined && (typeof data.cost !== 'number' || data.cost < 0)) {
      errors.push('Cost must be a positive number')
    }

    // Date validation
    if (data.date && !this.isValidDate(data.date)) {
      errors.push('Invalid date format')
    }

    return { valid: errors.length === 0, errors }
  }

  private static isValidDate(dateString: string): boolean {
    const date = new Date(dateString)
    return date instanceof Date && !isNaN(date.getTime())
  }
}

// Data encryption and decryption
export class DataEncryption {
  private static secretKey = process.env.NEXT_PUBLIC_ENCRYPTION_KEY || 'default-key-change-in-production'

  // Encrypt sensitive data
  static encrypt(data: string): string {
    try {
      const encrypted = CryptoJS.AES.encrypt(data, this.secretKey).toString()
      return encrypted
    } catch (error) {
      console.error('Encryption failed:', error)
      throw new Error('Data encryption failed')
    }
  }

  // Decrypt sensitive data
  static decrypt(encryptedData: string): string {
    try {
      const bytes = CryptoJS.AES.decrypt(encryptedData, this.secretKey)
      const decrypted = bytes.toString(CryptoJS.enc.Utf8)
      return decrypted
    } catch (error) {
      console.error('Decryption failed:', error)
      throw new Error('Data decryption failed')
    }
  }

  // Hash sensitive data (one-way)
  static hash(data: string): string {
    return CryptoJS.SHA256(data).toString()
  }

  // Generate secure random token
  static generateToken(): string {
    return CryptoJS.lib.WordArray.random(32).toString()
  }
}

// Session management
export class SessionManager {
  private static sessions = new Map<string, {
    userId: string
    createdAt: number
    lastActivity: number
    attempts: number
  }>()

  // Create new session
  static createSession(userId: string): string {
    const sessionId = DataEncryption.generateToken()
    const now = Date.now()

    this.sessions.set(sessionId, {
      userId,
      createdAt: now,
      lastActivity: now,
      attempts: 0
    })

    // Clean up old sessions
    this.cleanupSessions()

    return sessionId
  }

  // Validate session
  static validateSession(sessionId: string): boolean {
    const session = this.sessions.get(sessionId)
    if (!session) return false

    const now = Date.now()
    
    // Check if session expired
    if (now - session.lastActivity > SECURITY_CONFIG.session.timeout) {
      this.sessions.delete(sessionId)
      return false
    }

    // Update last activity
    session.lastActivity = now
    return true
  }

  // Record failed attempt
  static recordFailedAttempt(sessionId: string): boolean {
    const session = this.sessions.get(sessionId)
    if (!session) return false

    session.attempts++

    // Lock session if too many attempts
    if (session.attempts >= SECURITY_CONFIG.session.maxAttempts) {
      this.sessions.delete(sessionId)
      return false
    }

    return true
  }

  // Clean up expired sessions
  private static cleanupSessions(): void {
    const now = Date.now()
    
    for (const [sessionId, session] of this.sessions.entries()) {
      if (now - session.lastActivity > SECURITY_CONFIG.session.timeout) {
        this.sessions.delete(sessionId)
      }
    }
  }

  // Destroy session
  static destroySession(sessionId: string): void {
    this.sessions.delete(sessionId)
  }
}

// Rate limiting
export class RateLimiter {
  private static requests = new Map<string, {
    count: number
    resetTime: number
  }>()

  // Check if request is allowed
  static isAllowed(identifier: string): boolean {
    const now = Date.now()
    const request = this.requests.get(identifier)

    if (!request || now > request.resetTime) {
      // Reset or create new entry
      this.requests.set(identifier, {
        count: 1,
        resetTime: now + SECURITY_CONFIG.rateLimit.windowMs
      })
      return true
    }

    if (request.count >= SECURITY_CONFIG.rateLimit.maxRequests) {
      return false
    }

    request.count++
    return true
  }

  // Get remaining requests
  static getRemainingRequests(identifier: string): number {
    const request = this.requests.get(identifier)
    if (!request || Date.now() > request.resetTime) {
      return SECURITY_CONFIG.rateLimit.maxRequests
    }

    return Math.max(0, SECURITY_CONFIG.rateLimit.maxRequests - request.count)
  }
}

// Audit logging
export class AuditLogger {
  private static logs: Array<{
    timestamp: number
    action: string
    userId?: string
    details: any
    ipAddress?: string
    userAgent?: string
  }> = []

  // Log security event
  static logSecurityEvent(action: string, details: any, userId?: string): void {
    this.logs.push({
      timestamp: Date.now(),
      action,
      userId,
      details,
      ipAddress: this.getClientIP(),
      userAgent: this.getUserAgent()
    })

    // Keep only last 1000 logs in memory
    if (this.logs.length > 1000) {
      this.logs = this.logs.slice(-1000)
    }

    // In production, send to secure logging service
    console.log(`[SECURITY] ${action}:`, details)
  }

  // Get recent security logs
  static getRecentLogs(limit: number = 100): typeof this.logs {
    return this.logs.slice(-limit)
  }

  private static getClientIP(): string {
    // In production, extract from request headers
    return 'unknown'
  }

  private static getUserAgent(): string {
    // In production, extract from request headers
    return typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown'
  }
}

// Content Security Policy
export class CSPManager {
  // Generate CSP header
  static generateCSP(): string {
    const csp = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.tailwindcss.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: https:",
      "connect-src 'self' https://api.logistics-eik.pages.dev",
      "frame-src 'none'",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'"
    ]

    return csp.join('; ')
  }
}

// Security middleware
export class SecurityMiddleware {
  // Apply security headers
  static applySecurityHeaders(response: any): void {
    response.headers = {
      ...response.headers,
      'Content-Security-Policy': CSPManager.generateCSP(),
      'X-Frame-Options': 'DENY',
      'X-Content-Type-Options': 'nosniff',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains'
    }
  }

  // Validate request
  static validateRequest(request: any): { valid: boolean; error?: string } {
    // Check rate limiting
    const clientId = request.ip || 'unknown'
    if (!RateLimiter.isAllowed(clientId)) {
      AuditLogger.logSecurityEvent('RATE_LIMIT_EXCEEDED', { clientId })
      return { valid: false, error: 'Rate limit exceeded' }
    }

    // Validate content type for file uploads
    if (request.method === 'POST' && request.headers['content-type']?.includes('multipart/form-data')) {
      // Additional validation for file uploads
      return { valid: true }
    }

    return { valid: true }
  }
}

// Main security manager
export class SecurityManager {
  // Initialize security
  static initialize(): void {
    // Set up periodic cleanup
    setInterval(() => {
      SessionManager['cleanupSessions']()
    }, 5 * 60 * 1000) // Every 5 minutes

    AuditLogger.logSecurityEvent('SECURITY_INITIALIZED', {
      timestamp: new Date().toISOString()
    })
  }

  // Secure file processing
  static async secureFileProcessing(files: File[]): Promise<{ valid: boolean; errors: string[] }> {
    const errors: string[] = []

    // Validate file count
    if (files.length > SECURITY_CONFIG.validation.maxFilesPerUpload) {
      errors.push(`Maximum ${SECURITY_CONFIG.validation.maxFilesPerUpload} files allowed per upload`)
    }

    // Validate each file
    for (const file of files) {
      const validation = SecurityValidator.validateFile(file)
      if (!validation.valid) {
        errors.push(`${file.name}: ${validation.error}`)
      }
    }

    if (errors.length > 0) {
      AuditLogger.logSecurityEvent('FILE_VALIDATION_FAILED', { errors, fileCount: files.length })
    }

    return { valid: errors.length === 0, errors }
  }

  // Secure data processing
  static secureDataProcessing(data: any[]): { valid: boolean; errors: string[] } {
    const errors: string[] = []

    for (let i = 0; i < data.length; i++) {
      const validation = SecurityValidator.validateLogisticsData(data[i])
      if (!validation.valid) {
        errors.push(`Record ${i + 1}: ${validation.errors.join(', ')}`)
      }
    }

    return { valid: errors.length === 0, errors }
  }

  // Get security status
  static getSecurityStatus(): {
    activeSessions: number
    recentLogs: number
    rateLimitStatus: string
    lastSecurityCheck: string
  } {
    return {
      activeSessions: SessionManager['sessions'].size,
      recentLogs: AuditLogger.getRecentLogs(10).length,
      rateLimitStatus: 'active',
      lastSecurityCheck: new Date().toISOString()
    }
  }
}

// Initialize security on module load
if (typeof window !== 'undefined') {
  SecurityManager.initialize()
}

export default SecurityManager
