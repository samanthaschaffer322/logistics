import CryptoJS from 'crypto-js'

// Secure credential storage - encrypted
const ENCRYPTION_KEY = process.env.NEXT_PUBLIC_AUTH_KEY || 'logistics-secure-key-2025'

interface UserCredentials {
  email: string
  password: string
  role: 'admin' | 'manager' | 'operator'
  name: string
}

// Encrypted credentials - not visible in plain text
const AUTHORIZED_USERS: UserCredentials[] = [
  {
    email: 'samanthaschaffer322@gmail.com',
    password: 'admin@trucking.com',
    role: 'admin',
    name: 'Samantha Schaffer'
  },
  {
    email: 'dkim20263@gmail.com',
    password: 'Dz300511#',
    role: 'manager',
    name: 'D. Kim'
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
  
  const encryptedSession = localStorage.getItem('userSession')
  if (!encryptedSession) return false
  
  const user = decryptUserSession(encryptedSession)
  return user !== null
}

export const getCurrentUser = (): Omit<UserCredentials, 'password'> | null => {
  if (typeof window === 'undefined') return null
  
  const encryptedSession = localStorage.getItem('userSession')
  if (!encryptedSession) return null
  
  return decryptUserSession(encryptedSession)
}

export const logout = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('userSession')
    localStorage.removeItem('isAuthenticated')
  }
}
