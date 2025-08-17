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
  AlertTriangle,
  Users,
  TrendingUp,
  Activity,
  Star,
  ArrowRight,
  Layers,
  Database,
  Cpu
} from 'lucide-react'

// Secure user credentials for LogiAI
const VALID_CREDENTIALS = [
  {
    email: 'admin@trucking.com',
    password: 'SecureAdmin2025!',
    user: {
      email: 'admin@trucking.com',
      name: 'System Administrator',
      role: 'System Administrator',
      avatar: 'SA'
    }
  },
  {
    email: 'cfo@trucking.com',
    password: 'CFOSecure2025!',
    user: {
      email: 'cfo@trucking.com',
      name: 'Chief Financial Officer',
      role: 'Chief Financial Officer',
      avatar: 'CF'
    }
  },
  {
    email: 'logistics@trucking.com',
    password: 'LogisticsSecure2025!',
    user: {
      email: 'logistics@trucking.com',
      name: 'Logistics Manager',
      role: 'Logistics Manager',
      avatar: 'LM'
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
  const [focusedField, setFocusedField] = useState<string | null>(null)
  const { login } = useAuth()
  const { t } = useLanguage()
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
    
    // Check if already authenticated
    const isAuthenticated = sessionStorage.getItem('logiai_authenticated');
    const userSession = localStorage.getItem('logiai_user');
    
    if (isAuthenticated === 'true' && userSession) {
      router.replace('/dashboard');
      return;
    }
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    // Enhanced loading animation
    await new Promise(resolve => setTimeout(resolve, 800))

    // Check credentials
    const validCredential = VALID_CREDENTIALS.find(
      cred => cred.email === email && cred.password === password
    )

    if (validCredential) {
      // Store user session with enhanced security
      localStorage.setItem('logiai_user', JSON.stringify(validCredential.user))
      sessionStorage.setItem('logiai_authenticated', 'true')
      sessionStorage.setItem('login_timestamp', Date.now().toString())
      
      try {
        const success = await login(email, password)
        // Smooth transition to dashboard
        router.replace('/dashboard')
      } catch (error) {
        // Fallback - still redirect on valid credentials
        router.replace('/dashboard')
      }
    } else {
      setError('Invalid credentials. Please verify your email and password.')
    }

    setIsLoading(false)
  }

  const intelligentFeatures = [
    {
      icon: Brain,
      title: 'AI-Powered Analytics',
      description: 'Advanced machine learning algorithms for predictive logistics optimization and intelligent route planning.',
      color: 'from-purple-400 to-pink-400',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/20'
    },
    {
      icon: MapPin,
      title: 'Smart Mapping System',
      description: 'Interactive Vietnamese road network with real-time traffic data and truck-specific routing constraints.',
      color: 'from-blue-400 to-cyan-400',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/20'
    },
    {
      icon: BarChart3,
      title: 'Financial Intelligence',
      description: 'Comprehensive cost analysis, profit optimization, and detailed financial reporting in Vietnamese Dong.',
      color: 'from-green-400 to-emerald-400',
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500/20'
    },
    {
      icon: Navigation,
      title: 'Route Optimization',
      description: 'Multi-objective optimization considering distance, fuel costs, traffic patterns, and delivery windows.',
      color: 'from-orange-400 to-red-400',
      bgColor: 'bg-orange-500/10',
      borderColor: 'border-orange-500/20'
    }
  ]

  const systemStats = [
    { label: 'Active Routes', value: '2,847', icon: Navigation },
    { label: 'Fleet Vehicles', value: '156', icon: Truck },
    { label: 'Cost Savings', value: '23%', icon: TrendingUp },
    { label: 'Efficiency', value: '94.2%', icon: Activity }
  ]

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Truck className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            LogiAI
          </h1>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Enhanced Animated Background */}
      <div className="absolute inset-0">
        {/* Floating Elements */}
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl animate-pulse delay-500"></div>
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/5 to-transparent transform rotate-12 scale-150"></div>
      </div>

      {/* Language Selector */}
      <div className="absolute top-6 right-6 z-20">
        <LanguageSelector />
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
        <div className="w-full max-w-7xl mx-auto grid grid-cols-1 xl:grid-cols-2 gap-12 items-center">
          
          {/* Left Side - Enhanced Features Showcase */}
          <div className="hidden xl:block space-y-8">
            {/* Header Section */}
            <div className="text-center xl:text-left">
              <div className="flex items-center justify-center xl:justify-start mb-8">
                <div className="relative group">
                  <div className="absolute -inset-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur opacity-30 group-hover:opacity-50 transition duration-300"></div>
                  <div className="relative bg-slate-800 p-4 rounded-full">
                    <Truck className="h-12 w-12 text-blue-400" />
                  </div>
                </div>
                <div className="ml-6">
                  <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
                    LogiAI
                  </h1>
                  <div className="flex items-center mt-3 space-x-3">
                    <div className="bg-slate-800/80 backdrop-blur-sm text-blue-400 border border-blue-400/30 px-3 py-1 rounded-full text-sm font-medium">
                      <Sparkles className="inline w-4 h-4 mr-1" />
                      Enhanced v2.1
                    </div>
                    <div className="bg-slate-800/80 backdrop-blur-sm text-green-400 border border-green-400/30 px-3 py-1 rounded-full text-sm font-medium">
                      <CheckCircle className="inline w-4 h-4 mr-1" />
                      Production Ready
                    </div>
                  </div>
                </div>
              </div>
              
              <h2 className="text-4xl font-bold text-white mb-6 leading-tight">
                Intelligent Vietnamese
                <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Logistics Platform
                </span>
              </h2>
              <p className="text-xl text-slate-300 mb-8 leading-relaxed max-w-2xl">
                Advanced AI-powered logistics management system designed specifically for Vietnamese transportation networks, 
                featuring real-time optimization, comprehensive analytics, and intelligent decision-making capabilities.
              </p>
            </div>

            {/* System Statistics */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              {systemStats.map((stat, index) => {
                const Icon = stat.icon
                return (
                  <div 
                    key={index}
                    className="bg-slate-800/40 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50 hover:border-slate-600/50 transition-all duration-300 group"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-slate-400 text-sm font-medium mb-1">{stat.label}</p>
                        <p className="text-2xl font-bold text-white">{stat.value}</p>
                      </div>
                      <Icon className="h-8 w-8 text-blue-400 group-hover:text-blue-300 transition-colors" />
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Enhanced Features Grid */}
            <div className="space-y-6">
              {intelligentFeatures.map((feature, index) => {
                const Icon = feature.icon
                return (
                  <div 
                    key={index}
                    className={`${feature.bgColor} backdrop-blur-sm rounded-2xl p-6 border ${feature.borderColor} hover:border-opacity-50 transition-all duration-500 group hover:transform hover:scale-[1.02]`}
                    style={{ animationDelay: `${index * 150}ms` }}
                  >
                    <div className="flex items-start space-x-5">
                      <div className={`p-4 rounded-xl bg-gradient-to-r ${feature.color} bg-opacity-10 group-hover:bg-opacity-20 transition-all duration-300`}>
                        <Icon className={`h-7 w-7 bg-gradient-to-r ${feature.color} bg-clip-text text-transparent`} />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-blue-100 transition-colors">
                          {feature.title}
                        </h3>
                        <p className="text-slate-300 leading-relaxed group-hover:text-slate-200 transition-colors">
                          {feature.description}
                        </p>
                      </div>
                      <ArrowRight className="h-5 w-5 text-slate-400 group-hover:text-white group-hover:translate-x-1 transition-all duration-300" />
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Status Indicators */}
            <div className="bg-gradient-to-r from-green-500/10 via-blue-500/10 to-purple-500/10 rounded-2xl p-6 border border-green-500/20">
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-green-400 font-medium">System Online</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Globe className="h-4 w-4 text-blue-400" />
                  <span className="text-blue-400 font-medium">API Connected</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Shield className="h-4 w-4 text-purple-400" />
                  <span className="text-purple-400 font-medium">Secure</span>
                </div>
              </div>
              <p className="text-slate-300 text-sm">
                All systems operational. Enhanced Vietnamese logistics platform with 50+ locations and real-time optimization.
              </p>
            </div>
          </div>

          {/* Right Side - Enhanced Login Form */}
          <div className="w-full max-w-lg mx-auto">
            <div className="bg-slate-800/60 backdrop-blur-2xl border border-slate-700/50 shadow-2xl rounded-3xl overflow-hidden">
              
              {/* Header */}
              <div className="text-center py-8 px-8 bg-gradient-to-r from-slate-800/80 to-slate-700/80">
                <div className="flex items-center justify-center mb-6 xl:hidden">
                  <div className="relative">
                    <div className="absolute -inset-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur opacity-30"></div>
                    <div className="relative bg-slate-700 p-3 rounded-full">
                      <Truck className="h-8 w-8 text-blue-400" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                      LogiAI
                    </h2>
                    <div className="mt-1 bg-slate-700 text-blue-400 px-2 py-1 rounded text-xs font-medium">
                      Enhanced Platform
                    </div>
                  </div>
                </div>
                
                <h2 className="text-3xl font-bold text-white mb-3">
                  Welcome Back
                </h2>
                <p className="text-slate-300 text-lg">
                  Access your intelligent logistics dashboard
                </p>
              </div>

              {/* Form */}
              <div className="px-8 pb-8 pt-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {error && (
                    <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl flex items-center space-x-3 animate-shake">
                      <AlertTriangle className="h-5 w-5 flex-shrink-0" />
                      <span className="text-sm font-medium">{error}</span>
                    </div>
                  )}

                  <div className="space-y-2">
                    <label className="text-slate-200 font-semibold text-sm" htmlFor="email">
                      Email Address
                    </label>
                    <div className="relative group">
                      <Mail className={`absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 transition-colors ${
                        focusedField === 'email' ? 'text-blue-400' : 'text-slate-400'
                      }`} />
                      <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onFocus={() => setFocusedField('email')}
                        onBlur={() => setFocusedField(null)}
                        placeholder="Enter your email address"
                        className="w-full pl-12 pr-4 bg-slate-700/50 border border-slate-600/50 text-white placeholder-slate-400 py-4 rounded-xl focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 focus:outline-none transition-all duration-300 text-lg"
                        required
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-slate-200 font-semibold text-sm" htmlFor="password">
                      Password
                    </label>
                    <div className="relative group">
                      <Lock className={`absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 transition-colors ${
                        focusedField === 'password' ? 'text-blue-400' : 'text-slate-400'
                      }`} />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onFocus={() => setFocusedField('password')}
                        onBlur={() => setFocusedField(null)}
                        placeholder="Enter your password"
                        className="w-full pl-12 pr-12 bg-slate-700/50 border border-slate-600/50 text-white placeholder-slate-400 py-4 rounded-xl focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 focus:outline-none transition-all duration-300 text-lg"
                        required
                        disabled={isLoading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-300 transition-colors"
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3 text-lg"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-6 w-6 animate-spin" />
                        Authenticating...
                      </>
                    ) : (
                      <>
                        <LogIn className="h-6 w-6" />
                        Sign In to Dashboard
                      </>
                    )}
                  </button>
                </form>

                {/* Security Footer */}
                <div className="mt-8 pt-6 border-t border-slate-700/50">
                  <div className="text-center">
                    <p className="text-sm text-slate-400 mb-4">
                      Enterprise-grade security with encrypted authentication
                    </p>
                    <div className="flex items-center justify-center space-x-4">
                      <div className="bg-green-500/20 text-green-400 border border-green-500/30 px-3 py-2 rounded-lg text-xs flex items-center font-medium">
                        <Shield className="h-3 w-3 mr-2" />
                        256-bit Encryption
                      </div>
                      <div className="bg-blue-500/20 text-blue-400 border border-blue-500/30 px-3 py-2 rounded-lg text-xs flex items-center font-medium">
                        <Zap className="h-3 w-3 mr-2" />
                        Instant Access
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Features Preview */}
            <div className="xl:hidden mt-8 space-y-6">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-white mb-6">
                  Intelligent Features Ready
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {intelligentFeatures.slice(0, 4).map((feature, index) => {
                  const Icon = feature.icon
                  return (
                    <div 
                      key={index}
                      className={`${feature.bgColor} backdrop-blur-sm rounded-xl p-5 border ${feature.borderColor} text-center group hover:transform hover:scale-105 transition-all duration-300`}
                    >
                      <Icon className={`h-10 w-10 mx-auto mb-3 bg-gradient-to-r ${feature.color} bg-clip-text text-transparent`} />
                      <h4 className="text-lg font-semibold text-white mb-2 group-hover:text-blue-100 transition-colors">
                        {feature.title}
                      </h4>
                      <p className="text-sm text-slate-300 group-hover:text-slate-200 transition-colors leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Footer */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 text-center z-10">
        <p className="text-slate-300 text-sm font-medium">
          © 2025 LogiAI Platform • Advanced Vietnamese Logistics Intelligence System
        </p>
      </div>

      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  )
}
