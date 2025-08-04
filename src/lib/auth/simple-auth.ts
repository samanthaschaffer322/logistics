/**
 * Simple Authentication System
 * Working credentials for immediate login functionality
 */

export interface AuthUser {
  email: string
  name: string
  role: string
  loginTime: string
}

// Demo credentials that work immediately
const DEMO_USERS = [
  {
    email: "samathaschaffer322@gmail.com",
    password: "admin@trucking.com",
    name: "Samatha Schaffer",
    role: "admin"
  },
  {
    email: "dkim20263@gmail.com", 
    password: "Dz300511#",
    name: "D. Kim",
    role: "admin"
  }
]

/**
 * Simple credential validation
 */
export function validateCredentials(email: string, password: string): AuthUser | null {
  const user = DEMO_USERS.find(u => 
    u.email.toLowerCase() === email.toLowerCase() && 
    u.password === password
  )
  
  if (user) {
    return {
      email: user.email,
      name: user.name,
      role: user.role,
      loginTime: new Date().toISOString()
    }
  }
  
  return null
}

/**
 * Check if user is logged in
 */
export function getCurrentUser(): AuthUser | null {
  try {
    const userData = localStorage.getItem('logiai_user')
    if (userData) {
      return JSON.parse(userData)
    }
  } catch (error) {
    console.error('Error getting current user:', error)
    localStorage.removeItem('logiai_user')
  }
  return null
}

/**
 * Store user session
 */
export function storeUserSession(user: AuthUser): void {
  localStorage.setItem('logiai_user', JSON.stringify(user))
}

/**
 * Clear user session
 */
export function clearUserSession(): void {
  localStorage.removeItem('logiai_user')
  localStorage.removeItem('logiai_session_token')
}

/**
 * Get demo credentials for display
 */
export function getDemoCredentials() {
  return DEMO_USERS.map(user => ({
    email: user.email,
    password: user.password,
    name: user.name
  }))
}
