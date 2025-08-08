'use client'

import Link from 'next/link'
import { useLanguage } from '@/contexts/LanguageContext'
import LanguageSelector from '@/components/LanguageSelector'
import { Brain, Zap, Globe, TrendingUp, Truck, BarChart3 } from 'lucide-react'

export default function HomePage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
      {/* Header with Language Selector */}
      <header className="absolute top-4 right-4 z-10">
        <LanguageSelector />
      </header>

      {/* Hero Section */}
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="text-center max-w-4xl mx-auto">
          <div className="mb-8">
            <Brain className="h-16 w-16 text-blue-400 mx-auto mb-4" />
            <h1 className="text-5xl font-bold text-white mb-4">
              {t('dashboard.welcome')}
            </h1>
            <p className="text-xl text-blue-200 mb-8 max-w-2xl mx-auto">
              {t('dashboard.subtitle')}
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
              <Zap className="h-8 w-8 text-yellow-400 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-white mb-2">
                {t('route.enhancedTitle')}
              </h3>
              <p className="text-blue-200 text-sm">
                AI-powered route optimization with multiple algorithms
              </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
              <Truck className="h-8 w-8 text-green-400 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-white mb-2">
                {t('fleet.title')}
              </h3>
              <p className="text-blue-200 text-sm">
                Complete fleet management with real-time tracking
              </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
              <BarChart3 className="h-8 w-8 text-purple-400 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-white mb-2">
                {t('analytics.title')}
              </h3>
              <p className="text-blue-200 text-sm">
                Advanced analytics and performance insights
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link 
              href="/enhanced-optimizer" 
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center gap-2"
            >
              <Brain className="h-5 w-5" />
              {t('route.enhancedTitle')}
            </Link>
            
            <Link 
              href="/dashboard" 
              className="bg-white/20 backdrop-blur-sm text-white px-8 py-4 rounded-lg font-semibold hover:bg-white/30 transition-all duration-300 border border-white/30 flex items-center gap-2"
            >
              <TrendingUp className="h-5 w-5" />
              {t('nav.dashboard')}
            </Link>
          </div>

          {/* Performance Stats */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400 mb-2">25%</div>
              <div className="text-sm text-blue-200">Distance Reduction</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400 mb-2">30%</div>
              <div className="text-sm text-blue-200">Time Improvement</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-400 mb-2">40%</div>
              <div className="text-sm text-blue-200">Cost Savings</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400 mb-2">95%</div>
              <div className="text-sm text-blue-200">Satisfaction Rate</div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Navigation */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="flex gap-4">
          <Link href="/route-optimization" className="text-blue-300 hover:text-white transition-colors">
            {t('nav.routeOptimization')}
          </Link>
          <span className="text-blue-500">•</span>
          <Link href="/fleet-management" className="text-blue-300 hover:text-white transition-colors">
            {t('nav.fleetManagement')}
          </Link>
          <span className="text-blue-500">•</span>
          <Link href="/analytics" className="text-blue-300 hover:text-white transition-colors">
            {t('nav.analytics')}
          </Link>
        </div>
      </div>
    </div>
  )
}