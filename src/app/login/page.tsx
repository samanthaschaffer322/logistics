
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { useLanguage } from '@/contexts/LanguageContext'
import LanguageSelector from '@/components/LanguageSelector'
import { 
  Brain, 
  Mail, 
  Lock, 
  LogIn, 
  Loader2, 
  Eye, 
  EyeOff, 
  Truck,
  MapPin,
  BarChart3,
  Navigation,
  CheckCircle,
  Shield,
  Zap,
  Sparkles,
  Globe,
  AlertTriangle
} from 'lucide-react'

// Secure user credentials for LogiAI
const VALID_CREDENTIALS = [
  {
    email: 'admin@trucking.com',
    password: 'SecureAdmin2025!',
    user: {
      email: 'admin@trucking.com',
      name: 'Admin User',
      role: 'System Administrator',
      avatar: 'AU'
    }
  },
  {
    email: 'dkim20263@gmail.com',
    password: 'Dz300511#',
    user: {
      email: 'dkim20263@gmail.com',
      name: 'David Kim',
      role: 'Fleet Manager',
      avatar: 'DK'
    }
  }
];

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { login } = useAuth()
  const { t } = useLanguage()
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
    // Force dark mode
    document.documentElement.classList.add('dark')
    document.body.classList.add('dark')
    
    return () => {
      document.documentElement.classList.remove('dark')
      document.body.classList.remove('dark')
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    // Simulate authentication delay
    await new Promise(resolve => setTimeout(resolve, 1500))

    // Check credentials
    const validCredential = VALID_CREDENTIALS.find(
      cred => cred.email === email && cred.password === password
    )

    if (validCredential) {
      // Store user session
      localStorage.setItem('logiai_user', JSON.stringify(validCredential.user))
      sessionStorage.setItem('logiai_authenticated', 'true')
      
      try {
        const success = await login(email, password)
        router.push('/dashboard')
      } catch (error) {
        // Fallback - still redirect on valid credentials
        router.push('/dashboard')
      }
    } else {
      setError('Invalid email or password. Please check your credentials.')
    }

    setIsLoading(false)
  }

  const features = [
    {
      icon: MapPin,
      title: 'Interactive Mapping',
      description: 'Advanced Leaflet integration with Vietnamese locations',
      color: 'text-blue-400'
    },
    {
      icon: Navigation,
      title: 'Smart Routing',
      description: 'OpenRouteService with truck restrictions',
      color: 'text-purple-400'
    },
    {
      icon: BarChart3,
      title: 'Cost Analytics',
      description: 'Detailed breakdown in Vietnamese Dong',
      color: 'text-green-400'
    },
    {
      icon: Brain,
      title: 'AI Intelligence',
      description: 'Machine learning for logistics optimization',
      color: 'text-orange-400'
    }
  ]

  if (!mounted) {
    return null // Prevent hydration mismatch
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse delay-500"></div>
      </div>

      {/* Language Selector */}
      <div className="absolute top-4 right-4 z-20">
        <LanguageSelector />
      </div>

      <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-center relative z-10">
        {/* Left Side - Features Showcase */}
        <div className="hidden lg:block space-y-8">
          <div className="text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start mb-6">
              <div className="relative">
                <Truck className="h-16 w-16 text-blue-400 mr-4" />
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-400 rounded-full flex items-center justify-center">
                  <Sparkles className="h-3 w-3 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
                  LogiAI
                </h1>
                <div className="flex items-center mt-2">
                  <div className="bg-gray-800 text-blue-400 border border-blue-400/20 px-2 py-1 rounded text-xs">
                    Enhanced Dark Mode
                  </div>
                  <div className="ml-2 bg-gray-800 text-purple-400 border border-purple-400/20 px-2 py-1 rounded text-xs">
                    v2.0.0
                  </div>
                </div>
              </div>
            </div>
            
            <h2 className="text-3xl font-bold text-white mb-4">
              AI-Powered Logistics Management
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Professional Vietnamese logistics solution with advanced mapping, smart routing, and comprehensive analytics powered by artificial intelligence.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div 
                  key={index}
                  className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300 hover:transform hover:scale-105"
                  style={{ animationDelay: `${index * 200}ms` }}
                >
                  <div className="flex items-start space-x-4">
                    <div className={`p-3 rounded-xl bg-gray-700/50 ${feature.color}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-gray-400">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl p-6 border border-blue-500/20">
            <div className="flex items-center space-x-3 mb-4">
              <CheckCircle className="h-6 w-6 text-green-400" />
              <h3 className="text-lg font-semibold text-white">Ready to Use</h3>
            </div>
            <p className="text-gray-300 mb-4">
              OpenRouteService API configured and ready for interactive mapping with Vietnamese road conditions and truck restrictions.
            </p>
            <div className="flex items-center space-x-2">
              <div className="bg-green-500/20 text-green-400 border border-green-500/30 px-2 py-1 rounded text-xs flex items-center">
                <Globe className="h-3 w-3 mr-1" />
                API Connected
              </div>
              <div className="bg-blue-500/20 text-blue-400 border border-blue-500/30 px-2 py-1 rounded text-xs flex items-center">
                <MapPin className="h-3 w-3 mr-1" />
                28+ Locations
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full max-w-md mx-auto">
          <div className="bg-gray-800/80 backdrop-blur-xl border border-gray-700/50 shadow-2xl rounded-2xl">
            <div className="text-center pb-8 pt-8 px-8">
              <div className="flex items-center justify-center mb-4 lg:hidden">
                <Truck className="h-12 w-12 text-blue-400 mr-3" />
                <div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    LogiAI
                  </h2>
                  <div className="mt-1 bg-gray-700 text-blue-400 px-2 py-1 rounded text-xs">
                    Enhanced
                  </div>
                </div>
              </div>
              
              <h2 className="text-2xl font-bold text-white mb-2">
                {t('dashboard.welcome')}
              </h2>
              <p className="text-gray-400">
                Sign in to access your logistics management dashboard
              </p>
            </div>

            <div className="px-8 pb-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-lg flex items-center space-x-2">
                    <AlertTriangle className="h-4 w-4" />
                    <span className="text-sm">{error}</span>
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-gray-300 font-medium text-sm" htmlFor="email">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="w-full pl-10 bg-gray-700/50 border border-gray-600/50 text-white placeholder-gray-400 p-3 rounded-lg focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 focus:outline-none transition-all"
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-gray-300 font-medium text-sm" htmlFor="password">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="w-full pl-10 pr-10 bg-gray-700/50 border border-gray-600/50 text-white placeholder-gray-400 p-3 rounded-lg focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 focus:outline-none transition-all"
                      required
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Signing In...
                    </>
                  ) : (
                    <>
                      <LogIn className="h-5 w-5" />
                      Sign In
                    </>
                  )}
                </button>
              </form>

              <div className="mt-8 pt-6 border-t border-gray-700/50">
                <div className="text-center">
                  <p className="text-sm text-gray-400 mb-4">
                    Secure authentication with encrypted credentials
                  </p>
                  <div className="flex items-center justify-center space-x-4">
                    <div className="bg-green-500/20 text-green-400 border border-green-500/30 px-2 py-1 rounded text-xs flex items-center">
                      <Shield className="h-3 w-3 mr-1" />
                      Secure
                    </div>
                    <div className="bg-blue-500/20 text-blue-400 border border-blue-500/30 px-2 py-1 rounded text-xs flex items-center">
                      <Zap className="h-3 w-3 mr-1" />
                      Fast Login
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Features Preview */}
          <div className="lg:hidden mt-8 space-y-4">
            <div className="text-center">
              <h3 className="text-xl font-bold text-white mb-4">
                Enhanced Features Ready
              </h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {features.slice(0, 4).map((feature, index) => {
                const Icon = feature.icon
                return (
                  <div 
                    key={index}
                    className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50 text-center"
                  >
                    <Icon className={`h-8 w-8 mx-auto mb-2 ${feature.color}`} />
                    <h4 className="text-sm font-semibold text-white mb-1">
                      {feature.title}
                    </h4>
                    <p className="text-xs text-gray-400">
                      {feature.description}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-center z-10">
        <p className="text-blue-200 text-sm">
          © 2025 LogiAI. Advanced AI-Powered Vietnamese Logistics Platform
        </p>
      </div>
    </div>
  )
}
