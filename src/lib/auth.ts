import CryptoJS from 'crypto-js'

// Secure credential storage - encrypted
const ENCRYPTION_KEY = process.env.NEXT_PUBLIC_AUTH_KEY || 'logistics-secure-key-2025'

interface UserCredentials {
  email: string
  password: string
  role: 'admin' | 'manager' | 'operator'
  name: string
}

// Authorized users with correct credentials
const AUTHORIZED_USERS: UserCredentials[] = [
  {
    email: 'admin@trucking.com',
    password: 'SecureAdmin2025!',
    role: 'admin',
    name: 'Admin User'
  },
  {
    email: 'dkim20263@gmail.com',
    password: 'Dz300511#',
    role: 'manager',
    name: 'David Kim'
  }
]

export const authenticateUser = (email: string, password: string): UserCredentials | null => {
  const user = AUTHORIZED_USERS.find(
    u => u.email === email && u.password === password
  )
  
  if (user) {
    // Return user without password
    const { password: _, ...userWithoutPassword } = user
    return userWithoutPassword as UserCredentials
  }
  
  return null
}

export const encryptUserSession = (user: Omit<UserCredentials, 'password'>): string => {
  const userString = JSON.stringify(user)
  return CryptoJS.AES.encrypt(userString, ENCRYPTION_KEY).toString()
}

export const decryptUserSession = (encryptedData: string): Omit<UserCredentials, 'password'> | null => {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedData, ENCRYPTION_KEY)
    const decryptedData = bytes.toString(CryptoJS.enc.Utf8)
    return JSON.parse(decryptedData)
  } catch (error) {
    return null
  }
}

export const isAuthenticated = (): boolean => {
  if (typeof window === 'undefined') return false
  
  // Check both session storage and local storage for authentication
  const sessionAuth = sessionStorage.getItem('logiai_authenticated')
  const localUser = localStorage.getItem('logiai_user')
  const encryptedSession = localStorage.getItem('userSession')
  
  // If any authentication method is valid, user is authenticated
  if (sessionAuth === 'true' && localUser) return true
  if (encryptedSession && decryptUserSession(encryptedSession)) return true
  
  return false
}

export const getCurrentUser = (): Omit<UserCredentials, 'password'> | null => {
  if (typeof window === 'undefined') return null
  
  // Try to get user from localStorage first (from login page)
  const localUser = localStorage.getItem('logiai_user')
  if (localUser) {
    try {
      return JSON.parse(localUser)
    } catch (error) {
      console.error('Error parsing local user:', error)
    }
  }
  
  // Fallback to encrypted session
  const encryptedSession = localStorage.getItem('userSession')
  if (!encryptedSession) return null
  
  return decryptUserSession(encryptedSession)
}

export const logout = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('userSession')
    localStorage.removeItem('isAuthenticated')
    localStorage.removeItem('logiai_user')
    sessionStorage.removeItem('logiai_authenticated')
  }
}
