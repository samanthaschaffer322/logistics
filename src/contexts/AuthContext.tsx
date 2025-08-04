'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { validateSecureCredentials, validateSession, invalidateSession, type AuthSession } from '@/lib/auth/secure-credentials'
import { securityLogger } from '@/lib/security/middleware'

interface AuthContextType {
  user: AuthSession | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>
  signOut: () => Promise<void>
  refreshSession: () => Promise<boolean>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthSession | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkSession()
  }, [])

  const checkSession = async () => {
    try {
      const sessionToken = localStorage.getItem('logiai_session_token')
      if (sessionToken) {
        const session = validateSession(sessionToken)
        if (session) {
          setUser(session)
          securityLogger.log({
            type: 'auth_attempt',
            identifier: session.email,
            details: 'Session restored from storage',
            severity: 'low'
          })
        } else {
          // Invalid or expired session
          localStorage.removeItem('logiai_session_token')
          localStorage.removeItem('logiai_user')
          securityLogger.log({
            type: 'auth_attempt',
            identifier: 'unknown',
            details: 'Invalid session token removed',
            severity: 'medium'
          })
        }
      }
    } catch (error) {
      console.error('Error checking session:', error)
      localStorage.removeItem('logiai_session_token')
      localStorage.removeItem('logiai_user')
    } finally {
      setLoading(false)
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true)
      
      // Get client IP (in a real app, this would come from the server)
      const clientIP = 'client_browser'
      
      const result = await validateSecureCredentials(email, password, clientIP)
      
      if (result.success && result.session) {
        // Store session securely
        localStorage.setItem('logiai_session_token', result.session.sessionToken)
        localStorage.setItem('logiai_user', JSON.stringify({
          email: result.session.email,
          role: result.session.role,
          name: result.session.name,
          loginTime: new Date().toISOString()
        }))
        
        setUser(result.session)
        
        securityLogger.log({
          type: 'auth_attempt',
          identifier: email,
          details: 'Successful login from client',
          severity: 'low'
        })
        
        return { error: null }
      } else {
        securityLogger.log({
          type: 'auth_attempt',
          identifier: email,
          details: `Failed login attempt: ${result.error}`,
          severity: 'medium'
        })
        
        return { error: new Error(result.error || 'Authentication failed') }
      }
    } catch (error) {
      securityLogger.log({
        type: 'auth_attempt',
        identifier: email,
        details: `Login error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        severity: 'high'
      })
      
      return { error: error as Error }
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    try {
      const sessionToken = localStorage.getItem('logiai_session_token')
      if (sessionToken) {
        invalidateSession(sessionToken)
      }
      
      localStorage.removeItem('logiai_session_token')
      localStorage.removeItem('logiai_user')
      setUser(null)
      
      securityLogger.log({
        type: 'auth_attempt',
        identifier: user?.email || 'unknown',
        details: 'User logged out',
        severity: 'low'
      })
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const refreshSession = async (): Promise<boolean> => {
    try {
      const sessionToken = localStorage.getItem('logiai_session_token')
      if (!sessionToken) return false

      const session = validateSession(sessionToken)
      if (session) {
        setUser(session)
        return true
      } else {
        // Session expired or invalid
        await signOut()
        return false
      }
    } catch (error) {
      console.error('Error refreshing session:', error)
      await signOut()
      return false
    }
  }

  // Auto-refresh session every 5 minutes
  useEffect(() => {
    if (user) {
      const interval = setInterval(refreshSession, 5 * 60 * 1000)
      return () => clearInterval(interval)
    }
  }, [user])

  const value = {
    user,
    loading,
    signIn,
    signOut,
    refreshSession,
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
