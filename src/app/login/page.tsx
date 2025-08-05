'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { LogIn, Eye, EyeOff, Shield, Truck, AlertTriangle } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useTranslation } from '@/lib/i18n/useTranslation'
import LanguageSwitcher from '@/components/LanguageSwitcher'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const { signIn } = useAuth()
  const { t, locale } = useTranslation()

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Language Switcher */}
        <div className="flex justify-end mb-6">
          <LanguageSwitcher />
        </div>

        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 rounded-2xl shadow-lg">
              <Truck className="h-10 w-10 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
            LogiAI
          </h1>
          <p className="text-gray-600 text-lg">
            {locale === 'vi' 
              ? 'Nền tảng Quản lý Logistics được hỗ trợ bởi AI'
              : 'AI-Powered Logistics Management Platform'
            }
          </p>
        </div>

        {/* Login Card */}
        <Card className="shadow-2xl border-0 backdrop-blur-sm bg-white/90">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-2xl font-bold text-center flex items-center justify-center">
              <Shield className="mr-2 h-6 w-6 text-blue-600" />
              {locale === 'vi' ? 'Đăng nhập an toàn' : 'Secure Login'}
            </CardTitle>
            <CardDescription className="text-center text-gray-600">
              {locale === 'vi' 
                ? 'Nhập thông tin đăng nhập của bạn để truy cập hệ thống'
                : 'Enter your credentials to access the system'
              }
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email Field */}
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-semibold text-gray-700">
                  {locale === 'vi' ? 'Địa chỉ Email' : 'Email Address'}
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                  placeholder={locale === 'vi' ? 'Nhập địa chỉ email của bạn' : 'Enter your email address'}
                  required
                  disabled={isLoading}
                />
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-semibold text-gray-700">
                  {locale === 'vi' ? 'Mật khẩu' : 'Password'}
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                    placeholder={locale === 'vi' ? 'Nhập mật khẩu của bạn' : 'Enter your password'}
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                  <div className="flex items-start">
                    <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
                    <p className="text-sm text-red-700 font-medium">{error}</p>
                  </div>
                </div>
              )}

              {/* Login Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-xl hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <>
                    <LogIn className="mr-2 h-5 w-5" />
                    {locale === 'vi' ? 'Đăng nhập' : 'Sign In'}
                  </>
                )}
              </button>
            </form>

            {/* Security Notice */}
            <div className="mt-6 p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border border-gray-200">
              <div className="flex items-start">
                <Shield className="h-5 w-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-gray-800 mb-1">
                    {locale === 'vi' ? 'Bảo mật doanh nghiệp' : 'Enterprise Security'}
                  </p>
                  <p className="text-xs text-gray-600">
                    {locale === 'vi' 
                      ? 'Hệ thống được bảo vệ bằng mã hóa cấp doanh nghiệp và xác thực đa lớp.'
                      : 'System protected with enterprise-grade encryption and multi-layer authentication.'
                    }
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

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
