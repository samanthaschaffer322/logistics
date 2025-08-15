'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { useEnhancedTranslation } from '@/lib/i18n/enhanced-translation'
import LanguageSwitcher from './LanguageSwitcher'
import { 
  LayoutDashboard, 
  Package, 
  Truck, 
  Send, 
  TrendingUp, 
  Brain, 
  FileText, 
  MapPin,
  LogOut, 
  Menu, 
  X,
  Shield,
  Navigation,
  User,
  ShoppingCart,
  Shield,
  ChevronDown,
  Zap,
  Globe,
  RefreshCw
} from 'lucide-react'

const navigationItems = [
  { 
    key: 'dashboard', 
    href: '/dashboard', 
    icon: LayoutDashboard,
    translationKey: 'navigation.dashboard',
    color: 'blue'
  },
  { 
    key: 'ai-assistant', 
    href: '/ai-assistant', 
    icon: Brain,
    translationKey: 'navigation.aiAssistant',
    color: 'purple'
  },
  { 
    key: 'enhanced-ai', 
    href: '/enhanced-ai', 
    icon: Zap,
    translationKey: 'navigation.enhancedAI',
    color: 'indigo'
  },
  { 
    key: 'fleet-management', 
    href: '/fleet-management', 
    icon: Truck,
    translationKey: 'navigation.fleetManagement',
    color: 'green'
  },
  { 
    key: 'real-time-tracking', 
    href: '/real-time-tracking', 
    icon: MapPin,
    translationKey: 'navigation.realTimeTracking',
    color: 'purple'
  },
  { 
    key: 'shipments', 
    href: '/shipments', 
    icon: Package,
    translationKey: 'navigation.shipments',
    color: 'orange'
  },
  { 
    key: 'warehouse', 
    href: '/warehouse', 
    icon: Shield,
    translationKey: 'navigation.warehouse',
    color: 'indigo'
  },
  { 
    key: 'transportation', 
    href: '/transportation', 
    icon: Send,
    translationKey: 'navigation.transportation',
    color: 'red'
  },
  { 
    key: 'procurement', 
    href: '/procurement', 
    icon: ShoppingCart,
    translationKey: 'navigation.procurement',
    color: 'pink'
  },
  { 
    key: 'distribution', 
    href: '/distribution', 
    icon: TrendingUp,
    translationKey: 'navigation.distribution',
    color: 'teal'
  },
  { 
    key: 'comprehensive-route-optimizer', 
    href: '/comprehensive-route-optimizer', 
    icon: Navigation,
    translationKey: 'navigation.comprehensiveRouteOptimizer',
    color: 'indigo'
  },
  { 
    key: 'vietnam-map', 
    href: '/vietnam-map', 
    icon: MapPin,
    translationKey: 'navigation.vietnamMap',
    color: 'emerald'
  },
  { 
    key: 'ai-optimization', 
    href: '/ai-optimization', 
    icon: Zap,
    translationKey: 'navigation.aiOptimization',
    color: 'yellow'
  },
  { 
    key: 'ai-assistant', 
    href: '/ai-assistant', 
    icon: Brain,
    translationKey: 'navigation.aiAssistant',
    color: 'violet'
  },
  { 
    key: 'file-learning', 
    href: '/file-learning', 
    icon: FileText,
    translationKey: 'navigation.fileLearning',
    color: 'cyan'
  },
  { 
    key: 'customs-training', 
    href: '/customs-training', 
    icon: Shield,
    translationKey: 'navigation.customsTraining',
    color: 'blue'
  },
  { 
    key: 'enhanced-route-optimization', 
    href: '/enhanced-route-optimization', 
    icon: Navigation,
    translationKey: 'navigation.enhancedRouteOptimization',
    color: 'green'
  },
  { 
    key: 'combined-route-optimizer', 
    href: '/combined-route-optimizer', 
    icon: Navigation,
    translationKey: 'navigation.combinedRouteOptimizer',
    color: 'emerald'
  },
  { 
    key: 'ai-financial', 
    href: '/ai-financial', 
    icon: Brain,
    translationKey: 'navigation.aiFinancial',
    color: 'purple'
  },
  { 
    key: 'ui-enhancements', 
    href: '/ui-enhancements', 
    icon: Zap,
    translationKey: 'navigation.uiEnhancements',
    color: 'indigo'
  }
]

export default function Navigation() {
  const pathname = usePathname()
  const { user, signOut } = useAuth()
  const { t, locale, isLoading } = useEnhancedTranslation()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [showMoreItems, setShowMoreItems] = useState(false)

  const getColorClasses = (color: string, isActive: boolean) => {
    const colorMap: { [key: string]: { active: string; inactive: string } } = {
      blue: { active: 'bg-blue-100 text-blue-700 border-blue-300', inactive: 'text-gray-600 hover:text-blue-600 hover:bg-blue-50' },
      green: { active: 'bg-green-100 text-green-700 border-green-300', inactive: 'text-gray-600 hover:text-green-600 hover:bg-green-50' },
      purple: { active: 'bg-purple-100 text-purple-700 border-purple-300', inactive: 'text-gray-600 hover:text-purple-600 hover:bg-purple-50' },
      orange: { active: 'bg-orange-100 text-orange-700 border-orange-300', inactive: 'text-gray-600 hover:text-orange-600 hover:bg-orange-50' },
      indigo: { active: 'bg-indigo-100 text-indigo-700 border-indigo-300', inactive: 'text-gray-600 hover:text-indigo-600 hover:bg-indigo-50' },
      red: { active: 'bg-red-100 text-red-700 border-red-300', inactive: 'text-gray-600 hover:text-red-600 hover:bg-red-50' },
      pink: { active: 'bg-pink-100 text-pink-700 border-pink-300', inactive: 'text-gray-600 hover:text-pink-600 hover:bg-pink-50' },
      teal: { active: 'bg-teal-100 text-teal-700 border-teal-300', inactive: 'text-gray-600 hover:text-teal-600 hover:bg-teal-50' },
      emerald: { active: 'bg-emerald-100 text-emerald-700 border-emerald-300', inactive: 'text-gray-600 hover:text-emerald-600 hover:bg-emerald-50' },
      yellow: { active: 'bg-yellow-100 text-yellow-700 border-yellow-300', inactive: 'text-gray-600 hover:text-yellow-600 hover:bg-yellow-50' },
      violet: { active: 'bg-violet-100 text-violet-700 border-violet-300', inactive: 'text-gray-600 hover:text-violet-600 hover:bg-violet-50' },
      cyan: { active: 'bg-cyan-100 text-cyan-700 border-cyan-300', inactive: 'text-gray-600 hover:text-cyan-600 hover:bg-cyan-50' }
    }
    return isActive ? colorMap[color]?.active || colorMap.blue.active : colorMap[color]?.inactive || colorMap.blue.inactive
  }

  const visibleItems = navigationItems.slice(0, 8)
  const moreItems = navigationItems.slice(8)

  if (isLoading) {
    return (
      <nav className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <RefreshCw className="h-6 w-6 animate-spin text-blue-600" />
              <span className="ml-2 text-gray-600">Loading...</span>
            </div>
          </div>
        </div>
      </nav>
    )
  }

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link href="/dashboard" className="flex items-center space-x-2">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
                <Truck className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                LogiAI
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {visibleItems.map((item) => {
              const isActive = pathname === item.href
              const Icon = item.icon
              return (
                <Link
                  key={item.key}
                  href={item.href}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 border ${getColorClasses(item.color, isActive)}`}
                >
                  <div className="flex items-center space-x-2">
                    <Icon className="h-4 w-4" />
                    <span className="hidden xl:block">{t(item.translationKey)}</span>
                  </div>
                </Link>
              )
            })}

            {/* More Items Dropdown */}
            {moreItems.length > 0 && (
              <div className="relative">
                <button
                  onClick={() => setShowMoreItems(!showMoreItems)}
                  className="px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 text-gray-600 hover:text-gray-800 hover:bg-gray-50 flex items-center space-x-1"
                >
                  <span>{t('navigation.more')}</span>
                  <ChevronDown className={`h-4 w-4 transition-transform ${showMoreItems ? 'rotate-180' : ''}`} />
                </button>

                {showMoreItems && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    {moreItems.map((item) => {
                      const isActive = pathname === item.href
                      const Icon = item.icon
                      return (
                        <Link
                          key={item.key}
                          href={item.href}
                          className={`flex items-center space-x-3 px-4 py-2 text-sm transition-colors ${
                            isActive 
                              ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-500' 
                              : 'text-gray-700 hover:bg-gray-50'
                          }`}
                          onClick={() => setShowMoreItems(false)}
                        >
                          <Icon className="h-4 w-4" />
                          <span>{t(item.translationKey)}</span>
                        </Link>
                      )
                    })}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Side - Language Switcher and User Menu */}
          <div className="flex items-center space-x-4">
            {/* Enhanced Language Switcher */}
            <LanguageSwitcher variant="compact" showLabel={false} />

            {/* User Menu */}
            <div className="flex items-center space-x-3">
              <div className="hidden md:block text-right">
                <p className="text-sm font-medium text-gray-900">{user?.email}</p>
                <p className="text-xs text-gray-500">{locale === 'vi' ? 'Quản trị viên' : 'Administrator'}</p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-2 rounded-full">
                  <User className="h-4 w-4 text-white" />
                </div>
                <button
                  onClick={signOut}
                  className="text-gray-500 hover:text-red-600 transition-colors"
                  title={t('navigation.logout')}
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-gray-600 hover:text-gray-800 hover:bg-gray-100"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 py-4">
            <div className="space-y-2">
              {navigationItems.map((item) => {
                const isActive = pathname === item.href
                const Icon = item.icon
                return (
                  <Link
                    key={item.key}
                    href={item.href}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                      isActive 
                        ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-500' 
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{t(item.translationKey)}</span>
                  </Link>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
