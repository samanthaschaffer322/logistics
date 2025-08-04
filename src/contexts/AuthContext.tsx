'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { validateCredentials, getCurrentUser, storeUserSession, clearUserSession, type AuthUser } from '@/lib/auth/simple-auth'

interface AuthContextType {
  user: AuthUser | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for existing session on mount
    const checkSession = () => {
      try {
        const currentUser = getCurrentUser()
        if (currentUser) {
          setUser(currentUser)
        }
      } catch (error) {
        console.error('Error checking session:', error)
        clearUserSession()
      } finally {
        setLoading(false)
      }
    }

    checkSession()
  }, [])

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true)
      
      const validatedUser = validateCredentials(email, password)
      
      if (validatedUser) {
        // Store user session
        storeUserSession(validatedUser)
        setUser(validatedUser)
        
        return { error: null }
      } else {
        return { error: new Error('Invalid credentials. Please check your email and password.') }
      }
    } catch (error) {
      console.error('Login error:', error)
      return { error: error as Error }
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    try {
      clearUserSession()
      setUser(null)
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const value = {
    user,
    loading,
    signIn,
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
