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
import { Brain, Mail, Lock, LogIn, AlertCircle, Globe, Truck, BarChart3, MapPin } from 'lucide-react'
import { authenticateUser, encryptUserSession } from '@/lib/auth'
import { useLanguage } from '@/contexts/LanguageContext'

const LoginPage = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const { language, setLanguage, t } = useLanguage()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const user = authenticateUser(email, password)
      
      if (user) {
        const encryptedSession = encryptUserSession(user)
        
        localStorage.setItem('userSession', encryptedSession)
        localStorage.setItem('isAuthenticated', 'true')
        localStorage.setItem('userEmail', email)
        localStorage.setItem('userRole', user.role)
        
        router.push('/dashboard')
      } else {
        setError(t('login.invalidCredentials'))
      }
    } catch (error) {
      setError(t('login.authFailed'))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-20 h-20 border-2 border-blue-300 rounded-full"></div>
        <div className="absolute top-32 right-20 w-16 h-16 border-2 border-indigo-300 rounded-full"></div>
        <div className="absolute bottom-20 left-32 w-24 h-24 border-2 border-purple-300 rounded-full"></div>
        <div className="absolute bottom-32 right-16 w-12 h-12 border-2 border-blue-300 rounded-full"></div>
      </div>

      {/* Language Switcher */}
      <div className="absolute top-6 right-6 z-10">
        <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg">
          <Globe className="w-4 h-4 text-slate-600" />
          <button
            onClick={() => setLanguage('en')}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
              language === 'en' 
                ? 'bg-indigo-600 text-white shadow-md' 
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            EN
          </button>
          <button
            onClick={() => setLanguage('vi')}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
              language === 'vi' 
                ? 'bg-indigo-600 text-white shadow-md' 
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            VI
          </button>
        </div>
      </div>

      <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Left Side - Branding */}
        <div className="hidden lg:block space-y-8">
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  LogiAI
                </h1>
                <p className="text-slate-600 font-medium">
                  {t('login.subtitle')}
                </p>
              </div>
            </div>
            
            <p className="text-xl text-slate-700 leading-relaxed">
              {t('login.description')}
            </p>
          </div>

          {/* Features */}
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-white/20">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <Truck className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-800">{t('login.features.routing')}</h3>
                <p className="text-sm text-slate-600">{t('login.features.routingDesc')}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-white/20">
              <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-800">{t('login.features.analytics')}</h3>
                <p className="text-sm text-slate-600">{t('login.features.analyticsDesc')}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-white/20">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-800">{t('login.features.vietnam')}</h3>
                <p className="text-sm text-slate-600">{t('login.features.vietnamDesc')}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="flex items-center justify-center">
          <Card className="w-full max-w-md bg-white/80 backdrop-blur-xl border-0 shadow-2xl">
            <CardHeader className="text-center pb-8">
              <div className="lg:hidden flex items-center justify-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  LogiAI
                </h1>
              </div>
              
              <CardTitle className="text-2xl font-bold text-slate-800 mb-2">
                {t('login.welcome')}
              </CardTitle>
              <CardDescription className="text-slate-600">
                {t('login.signInDesc')}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <form onSubmit={handleLogin} className="space-y-5">
                {error && (
                  <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <span className="text-sm font-medium">{error}</span>
                  </div>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-slate-700 font-medium">
                    {t('login.email')}
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder={t('login.emailPlaceholder')}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-12 h-12 border-slate-200 focus:border-indigo-500 focus:ring-indigo-500 rounded-xl bg-white/50"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-slate-700 font-medium">
                    {t('login.password')}
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <Input
                      id="password"
                      type="password"
                      placeholder={t('login.passwordPlaceholder')}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-12 h-12 border-slate-200 focus:border-indigo-500 focus:ring-indigo-500 rounded-xl bg-white/50"
                      required
                    />
                  </div>
                </div>
                
                <Button
                  type="submit"
                  className="w-full h-12 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                      {t('login.signingIn')}
                    </>
                  ) : (
                    <>
                      <LogIn className="w-5 h-5 mr-3" />
                      {t('login.signIn')}
                    </>
                  )}
                </Button>
              </form>
              
              <div className="pt-6 border-t border-slate-200">
                <div className="text-center">
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {t('login.securityNote')}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
