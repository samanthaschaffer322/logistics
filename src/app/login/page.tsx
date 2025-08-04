'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { LogIn, Eye, EyeOff, Shield, Truck, AlertTriangle, Copy, CheckCircle } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useTranslation } from '@/lib/i18n/useTranslation'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import { getDemoCredentials } from '@/lib/auth/simple-auth'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [copiedCredential, setCopiedCredential] = useState<string | null>(null)
  const router = useRouter()
  const { signIn } = useAuth()
  const { t, locale } = useTranslation()

  const demoCredentials = getDemoCredentials()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const result = await signIn(email, password)
      
      if (result.error) {
        setError(result.error.message)
      } else {
        // Successful login - redirect to dashboard
        router.push('/dashboard')
      }
    } catch (error) {
      console.error('Login error:', error)
      setError(locale === 'vi' 
        ? 'Đã xảy ra lỗi trong quá trình đăng nhập. Vui lòng thử lại.'
        : 'An error occurred during login. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedCredential(type)
      setTimeout(() => setCopiedCredential(null), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  const fillCredentials = (email: string, password: string) => {
    setEmail(email)
    setPassword(password)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Language Switcher */}
        <div className="flex justify-end mb-4">
          <LanguageSwitcher />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Login Form */}
          <div>
            {/* Logo and Title */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center mb-4">
                <div className="bg-blue-600 p-3 rounded-full">
                  <Truck className="h-8 w-8 text-white" />
                </div>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">LogiAI</h1>
              <p className="text-gray-600">
                {locale === 'vi' 
                  ? 'Nền tảng Quản lý Logistics được hỗ trợ bởi AI'
                  : 'AI-Powered Logistics Management Platform'
                }
              </p>
            </div>

            {/* Login Card */}
            <Card className="shadow-xl border-0">
              <CardHeader className="space-y-1 pb-6">
                <CardTitle className="text-2xl font-bold text-center flex items-center justify-center">
                  <Shield className="mr-2 h-5 w-5 text-blue-600" />
                  {locale === 'vi' ? 'Đăng nhập an toàn' : 'Secure Login'}
                </CardTitle>
                <CardDescription className="text-center">
                  {locale === 'vi' 
                    ? 'Nhập thông tin đăng nhập của bạn'
                    : 'Enter your login credentials'
                  }
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Email Field */}
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium text-gray-700">
                      {locale === 'vi' ? 'Email' : 'Email'}
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder={locale === 'vi' ? 'Nhập email của bạn' : 'Enter your email'}
                      required
                      disabled={isLoading}
                    />
                  </div>

                  {/* Password Field */}
                  <div className="space-y-2">
                    <label htmlFor="password" className="text-sm font-medium text-gray-700">
                      {locale === 'vi' ? 'Mật khẩu' : 'Password'}
                    </label>
                    <div className="relative">
                      <input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder={locale === 'vi' ? 'Nhập mật khẩu' : 'Enter your password'}
                        required
                        disabled={isLoading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        disabled={isLoading}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-gray-400" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Error Message */}
                  {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                      <div className="flex items-start">
                        <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5 mr-2 flex-shrink-0" />
                        <p className="text-sm text-red-600">{error}</p>
                      </div>
                    </div>
                  )}

                  {/* Login Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
                  >
                    {isLoading ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                      <>
                        <LogIn className="mr-2 h-4 w-4" />
                        {locale === 'vi' ? 'Đăng nhập' : 'Sign In'}
                      </>
                    )}
                  </button>
                </form>

                {/* Security Notice */}
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-start">
                    <Shield className="h-5 w-5 text-gray-400 mt-0.5 mr-2 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-gray-600">
                        <strong>{locale === 'vi' ? 'Thông báo bảo mật' : 'Security Notice'}:</strong>{' '}
                        {locale === 'vi' 
                          ? 'Hệ thống được bảo vệ bằng mã hóa cấp doanh nghiệp.'
                          : 'System protected with enterprise-grade encryption.'
                        }
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Demo Credentials Panel */}
          <div>
            <Card className="shadow-xl border-0 bg-gradient-to-br from-green-50 to-emerald-50">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-green-800 flex items-center">
                  <CheckCircle className="mr-2 h-5 w-5" />
                  {locale === 'vi' ? 'Thông tin đăng nhập Demo' : 'Demo Login Credentials'}
                </CardTitle>
                <CardDescription className="text-green-700">
                  {locale === 'vi' 
                    ? 'Sử dụng các thông tin đăng nhập sau để truy cập hệ thống'
                    : 'Use the following credentials to access the system'
                  }
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {demoCredentials.map((credential, index) => (
                  <div key={index} className="bg-white rounded-lg p-4 border border-green-200">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-900">
                        {locale === 'vi' ? `Tài khoản Admin ${index + 1}` : `Admin Account ${index + 1}`}
                      </h3>
                      <button
                        onClick={() => fillCredentials(credential.email, credential.password)}
                        className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200 transition-colors"
                      >
                        {locale === 'vi' ? 'Sử dụng' : 'Use'}
                      </button>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">
                          {locale === 'vi' ? 'Email:' : 'Email:'}
                        </span>
                        <div className="flex items-center">
                          <code className="text-xs bg-gray-100 px-2 py-1 rounded mr-2">
                            {credential.email}
                          </code>
                          <button
                            onClick={() => copyToClipboard(credential.email, `email-${index}`)}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            {copiedCredential === `email-${index}` ? (
                              <CheckCircle className="h-3 w-3 text-green-500" />
                            ) : (
                              <Copy className="h-3 w-3" />
                            )}
                          </button>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">
                          {locale === 'vi' ? 'Mật khẩu:' : 'Password:'}
                        </span>
                        <div className="flex items-center">
                          <code className="text-xs bg-gray-100 px-2 py-1 rounded mr-2">
                            {credential.password}
                          </code>
                          <button
                            onClick={() => copyToClipboard(credential.password, `password-${index}`)}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            {copiedCredential === `password-${index}` ? (
                              <CheckCircle className="h-3 w-3 text-green-500" />
                            ) : (
                              <Copy className="h-3 w-3" />
                            )}
                          </button>
                        </div>
                      </div>
                      
                      <div className="text-xs text-gray-500">
                        {locale === 'vi' ? 'Người dùng:' : 'User:'} {credential.name}
                      </div>
                    </div>
                  </div>
                ))}

                {/* Quick Instructions */}
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <h4 className="font-semibold text-blue-800 mb-2">
                    {locale === 'vi' ? 'Hướng dẫn nhanh:' : 'Quick Instructions:'}
                  </h4>
                  <ol className="text-sm text-blue-700 space-y-1">
                    <li>
                      1. {locale === 'vi' 
                        ? 'Nhấp "Sử dụng" để tự động điền thông tin'
                        : 'Click "Use" to auto-fill credentials'
                      }
                    </li>
                    <li>
                      2. {locale === 'vi' 
                        ? 'Hoặc sao chép và dán thủ công'
                        : 'Or copy and paste manually'
                      }
                    </li>
                    <li>
                      3. {locale === 'vi' 
                        ? 'Nhấp "Đăng nhập" để truy cập hệ thống'
                        : 'Click "Sign In" to access the system'
                      }
                    </li>
                  </ol>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            © 2024 LogiAI. {locale === 'vi' 
              ? 'Nền tảng Quản lý Logistics Nâng cao được hỗ trợ bởi AI.'
              : 'Advanced AI-Powered Logistics Management Platform.'
            }
          </p>
        </div>
      </div>
    </div>
  )
}
