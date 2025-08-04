'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { validateCredentials, getUserRole, type AuthCredentials } from '@/lib/auth/credentials'

interface AuthContextType {
  user: AuthCredentials | null
  userRole: string | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>
  signUp: (email: string, password: string, role: string) => Promise<{ error: Error | null }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthCredentials | null>(null)
  const [userRole, setUserRole] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for existing session
    const checkSession = () => {
      try {
        const storedUser = localStorage.getItem('logiai_user')
        if (storedUser) {
          const userData = JSON.parse(storedUser)
          setUser(userData)
          setUserRole(userData.role)
        }
      } catch (error) {
        console.error('Error checking session:', error)
        localStorage.removeItem('logiai_user')
      } finally {
        setLoading(false)
      }
    }

    checkSession()
  }, [])

  const signIn = async (email: string, password: string) => {
    try {
      const validatedUser = validateCredentials(email, password)
      
      if (validatedUser) {
        const userData = {
          email: validatedUser.email,
          role: validatedUser.role,
          name: validatedUser.name,
          loginTime: new Date().toISOString()
        }
        
        // Store session
        localStorage.setItem('logiai_user', JSON.stringify(userData))
        
        setUser(validatedUser)
        setUserRole(validatedUser.role)
        
        return { error: null }
      } else {
        return { error: new Error('Invalid credentials. Access denied.') }
      }
    } catch (error) {
      return { error: error as Error }
    }
  }

  const signUp = async (email: string, password: string, role: string) => {
    // Sign up is disabled - only authorized users can access
    return { error: new Error('Registration is not available. This platform is restricted to authorized personnel only.') }
  }

  const signOut = async () => {
    try {
      localStorage.removeItem('logiai_user')
      setUser(null)
      setUserRole(null)
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const value = {
    user,
    userRole,
    loading,
    signIn,
    signUp,
    signOut,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
