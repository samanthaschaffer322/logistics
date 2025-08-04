'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
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
  const [attempts, setAttempts] = useState(0)
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
        setAttempts(prev => prev + 1)
        
        // Show additional security warning after multiple failed attempts
        if (attempts >= 2) {
          setError(prev => prev + ' ' + (locale === 'vi' 
            ? 'Nhiều lần đăng nhập thất bại. Tài khoản có thể bị khóa tạm thời.'
            : 'Multiple failed attempts. Account may be temporarily locked.'))
        }
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Language Switcher */}
        <div className="flex justify-end mb-4">
          <LanguageSwitcher />
        </div>

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
              {t('auth.secureAccess')}
            </CardTitle>
            <CardDescription className="text-center">
              {t('auth.enterCredentials')}
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Field */}
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-gray-700">
                  {t('auth.email')}
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={locale === 'vi' ? 'Nhập email được ủy quyền' : 'Enter your authorized email'}
                  required
                  disabled={isLoading}
                />
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-gray-700">
                  {t('auth.password')}
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

              {/* Security Warning for Multiple Attempts */}
              {attempts >= 3 && (
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                  <div className="flex items-start">
                    <Shield className="h-4 w-4 text-orange-600 mt-0.5 mr-2 flex-shrink-0" />
                    <div className="text-sm text-orange-700">
                      <p className="font-medium">
                        {locale === 'vi' ? 'Cảnh báo bảo mật' : 'Security Warning'}
                      </p>
                      <p>
                        {locale === 'vi' 
                          ? 'Quá nhiều lần thử đăng nhập. Tài khoản có thể bị khóa sau 5 lần thất bại.'
                          : 'Too many login attempts. Account may be locked after 5 failures.'
                        }
                      </p>
                    </div>
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
                    {t('auth.signIn')}
                  </>
                )}
              </button>
            </form>

            {/* Demo Credentials */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-start">
                <Shield className="h-5 w-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-blue-800 mb-2">
                    {locale === 'vi' ? 'Thông tin đăng nhập demo:' : 'Demo Login Credentials:'}
                  </p>
                  <div className="text-xs text-blue-700 space-y-1">
                    <p><strong>Admin 1:</strong> samathaschaffer322@gmail.com / admin@trucking.com</p>
                    <p><strong>Admin 2:</strong> dkim20263@gmail.com / Dz300511#</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Security Notice */}
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-start">
                <Shield className="h-5 w-5 text-gray-400 mt-0.5 mr-2 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-600">
                    <strong>{t('auth.securityNotice')}:</strong> {t('auth.restrictedAccess')}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {locale === 'vi' 
                      ? 'Hệ thống được bảo vệ bằng mã hóa cấp doanh nghiệp và giám sát bảo mật thời gian thực.'
                      : 'System protected with enterprise-grade encryption and real-time security monitoring.'
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
          <p className="text-xs text-gray-400 mt-1">
            {locale === 'vi' 
              ? 'Được bảo vệ bởi bảo mật cấp doanh nghiệp'
              : 'Protected by Enterprise-Grade Security'
            }
          </p>
        </div>
      </div>
    </div>
  )
}
