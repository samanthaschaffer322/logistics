'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

interface User {
  id: string
  name: string
  email: string
  role: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    // For static export, return a default auth state
    return {
      user: {
        id: '1',
        name: 'Demo User',
        email: 'demo@logiai.com',
        role: 'admin'
      },
      login: async () => true,
      logout: () => {},
      isLoading: false
    }
  }
  return context
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // For demo purposes, set a default user
    setUser({
      id: '1',
      name: 'Demo User',
      email: 'demo@logiai.com',
      role: 'admin'
    })
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)
    
    // Simulate login
    setTimeout(() => {
      setUser({
        id: '1',
        name: 'Demo User',
        email: email,
        role: 'admin'
      })
      setIsLoading(false)
    }, 1000)
    
    return true
  }

  const logout = () => {
    setUser(null)
  }

  const value = {
    user,
    login,
    logout,
    isLoading
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
