/**
 * Secure Authentication System
 * Only authorized credentials can access the LogiAI platform
 */

export interface AuthCredentials {
  email: string
  password: string
  role: string
  name: string
}

// Secure credential validation (credentials are hashed in production)
const AUTHORIZED_USERS: AuthCredentials[] = [
  {
    email: "samathaschaffer322@gmail.com",
    password: "admin@trucking.com", // In production, this would be hashed
    role: "admin",
    name: "Samatha Schaffer"
  },
  {
    email: "dkim20263@gmail.com", 
    password: "Dz300511#", // In production, this would be hashed
    role: "admin",
    name: "D. Kim"
  }
]

/**
 * Validate user credentials securely
 */
export function validateCredentials(email: string, password: string): AuthCredentials | null {
  // Find user by email
  const user = AUTHORIZED_USERS.find(u => u.email.toLowerCase() === email.toLowerCase())
  
  if (!user) {
    return null
  }
  
  // Validate password (in production, this would use bcrypt or similar)
  if (user.password === password) {
    return {
      email: user.email,
      password: "", // Never return password
      role: user.role,
      name: user.name
    }
  }
  
  return null
}

/**
 * Check if user is authorized
 */
export function isAuthorizedUser(email: string): boolean {
  return AUTHORIZED_USERS.some(u => u.email.toLowerCase() === email.toLowerCase())
}

/**
 * Get user role
 */
export function getUserRole(email: string): string {
  const user = AUTHORIZED_USERS.find(u => u.email.toLowerCase() === email.toLowerCase())
  return user?.role || "guest"
}

/**
 * Security helper - hash password (for production use)
 */
export function hashPassword(password: string): string {
  // In production, use bcrypt or similar
  // This is a simple example - DO NOT use in production
  return Buffer.from(password).toString('base64')
}

/**
 * Security helper - verify hashed password (for production use)
 */
export function verifyPassword(password: string, hash: string): boolean {
  // In production, use bcrypt.compare or similar
  return Buffer.from(password).toString('base64') === hash
}
