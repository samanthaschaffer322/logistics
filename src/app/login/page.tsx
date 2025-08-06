'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  Button,
  Input,
  Label
} from '@/components/ui-components'
import { Brain, Mail, Lock, LogIn, AlertCircle } from 'lucide-react'
import { authenticateUser, encryptUserSession } from '@/lib/auth'

const LoginPage = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      // Authenticate user with secure credentials
      const user = authenticateUser(email, password)
      
      if (user) {
        // Create encrypted session
        const encryptedSession = encryptUserSession(user)
        
        // Store encrypted session
        localStorage.setItem('userSession', encryptedSession)
        localStorage.setItem('isAuthenticated', 'true')
        localStorage.setItem('userEmail', email)
        localStorage.setItem('userRole', user.role)
        
        // Redirect to dashboard
        router.push('/dashboard')
      } else {
        setError('Invalid credentials. Access denied.')
      }
    } catch (error) {
      setError('Authentication failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mb-4">
            <Brain className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            LogiAI
          </CardTitle>
          <CardDescription>
            Enhanced AI-Powered Vietnamese Logistics Management
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md text-red-700">
                <AlertCircle className="w-4 h-4" />
                <span className="text-sm">{error}</span>
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>
            
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Signing in...
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4 mr-2" />
                  Sign In
                </>
              )}
            </Button>
          </form>
          
          <div className="mt-6 p-4 bg-slate-50 rounded-lg">
            <p className="text-xs text-slate-600 text-center">
              Secure authentication system with encrypted sessions
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default LoginPage
