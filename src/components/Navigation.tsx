'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { useTranslation } from '@/lib/i18n/useTranslation'
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
  User,
  ShoppingCart,
  Shield,
  ChevronDown,
  Zap
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
    icon: Send,
    translationKey: 'navigation.shipments',
    color: 'orange'
  },
  { 
    key: 'warehouse', 
    href: '/warehouse', 
    icon: Package,
    translationKey: 'navigation.warehouse',
    color: 'cyan'
  },
  { 
    key: 'transportation', 
    href: '/transportation', 
    icon: Truck,
    translationKey: 'navigation.transportation',
    color: 'indigo'
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
    icon: Send,
    translationKey: 'navigation.distribution',
    color: 'emerald'
  },
  { 
    key: 'vietnam-map', 
    href: '/vietnam-map', 
    icon: MapPin,
    translationKey: 'navigation.vietnamMap',
    color: 'red'
  },
  { 
    key: 'ai-optimization', 
    href: '/ai-optimization', 
    icon: TrendingUp,
    translationKey: 'navigation.aiOptimization',
    color: 'violet'
  },
  { 
    key: 'ai-assistant', 
    href: '/ai-assistant', 
    icon: Brain,
    translationKey: 'navigation.aiAssistant',
    color: 'rose'
  },
  { 
    key: 'file-learning', 
    href: '/file-learning', 
    icon: FileText,
    translationKey: 'navigation.fileLearning',
    color: 'amber'
  }
]

export default function Navigation() {
  const pathname = usePathname()
  const { user, signOut } = useAuth()
  const { t, locale } = useTranslation()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isMoreDropdownOpen, setIsMoreDropdownOpen] = useState(false)

  const handleSignOut = async () => {
    await signOut()
    window.location.href = '/login'
  }

  const primaryItems = navigationItems.slice(0, 6)
  const moreItems = navigationItems.slice(6)

  return (
    <nav className="bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link href="/dashboard" className="flex items-center group">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                <Truck className="h-6 w-6 text-white" />
              </div>
              <div className="ml-3">
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  LogiAI
                </span>
                <div className="flex items-center text-xs text-gray-500 mt-0.5">
                  <Zap className="h-3 w-3 mr-1" />
                  <span>{locale === 'vi' ? 'Logistics AI' : 'AI Logistics'}</span>
                </div>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {primaryItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              
              return (
                <Link
                  key={item.key}
                  href={item.href}
                  className={`group flex items-center px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? `bg-gradient-to-r from-${item.color}-100 to-${item.color}-50 text-${item.color}-700 shadow-md`
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Icon className={`h-4 w-4 mr-2 transition-transform duration-200 group-hover:scale-110 ${
                    isActive ? `text-${item.color}-600` : ''
                  }`} />
                  <span className="whitespace-nowrap">{t(item.translationKey)}</span>
                </Link>
              )
            })}
            
            {/* More dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsMoreDropdownOpen(!isMoreDropdownOpen)}
                className="flex items-center px-3 py-2 rounded-xl text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-all duration-200"
              >
                {t('navigation.more')}
                <ChevronDown className={`ml-1 h-4 w-4 transition-transform duration-200 ${
                  isMoreDropdownOpen ? 'rotate-180' : ''
                }`} />
              </button>
              
              {isMoreDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl ring-1 ring-black ring-opacity-5 border border-gray-100 overflow-hidden">
                  <div className="py-2">
                    {moreItems.map((item) => {
                      const Icon = item.icon
                      const isActive = pathname === item.href
                      
                      return (
                        <Link
                          key={item.key}
                          href={item.href}
                          onClick={() => setIsMoreDropdownOpen(false)}
                          className={`group flex items-center px-4 py-3 text-sm transition-all duration-200 ${
                            isActive
                              ? `bg-gradient-to-r from-${item.color}-50 to-${item.color}-25 text-${item.color}-700 border-r-2 border-${item.color}-500`
                              : 'text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          <Icon className={`h-4 w-4 mr-3 transition-transform duration-200 group-hover:scale-110 ${
                            isActive ? `text-${item.color}-600` : `text-gray-400 group-hover:text-${item.color}-500`
                          }`} />
                          <span>{t(item.translationKey)}</span>
                        </Link>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* User Menu and Language Switcher */}
          <div className="flex items-center space-x-4">
            {/* Language Switcher */}
            <LanguageSwitcher />

            {/* User Info */}
            <div className="hidden md:flex items-center space-x-3">
              <div className="flex items-center bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl px-3 py-2">
                <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-2 rounded-lg">
                  <User className="h-4 w-4 text-white" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-semibold text-gray-800">
                    {user?.name || 'User'}
                  </p>
                  <div className="flex items-center text-xs text-gray-500">
                    <Shield className="h-3 w-3 mr-1" />
                    <span>{user?.role || 'Admin'}</span>
                  </div>
                </div>
              </div>
              
              <button
                onClick={handleSignOut}
                className="flex items-center px-4 py-2 text-sm font-medium text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 group"
              >
                <LogOut className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform duration-200" />
                {t('navigation.logout')}
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="lg:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 transition-all duration-200"
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gradient-to-b from-white to-gray-50 max-h-96 overflow-y-auto">
            {navigationItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              
              return (
                <Link
                  key={item.key}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`group flex items-center px-4 py-3 rounded-xl text-base font-medium transition-all duration-200 ${
                    isActive
                      ? `bg-gradient-to-r from-${item.color}-100 to-${item.color}-50 text-${item.color}-700 shadow-md`
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <Icon className={`h-5 w-5 mr-3 transition-transform duration-200 group-hover:scale-110 ${
                    isActive ? `text-${item.color}-600` : ''
                  }`} />
                  <span>{t(item.translationKey)}</span>
                </Link>
              )
            })}
            
            {/* Mobile User Actions */}
            <div className="border-t border-gray-200 pt-4 mt-4">
              <div className="flex items-center px-4 py-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl mb-3">
                <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-2 rounded-lg">
                  <User className="h-5 w-5 text-white" />
                </div>
                <div className="ml-3">
                  <p className="text-base font-semibold text-gray-800">
                    {user?.name || 'User'}
                  </p>
                  <div className="flex items-center text-sm text-gray-500">
                    <Shield className="h-3 w-3 mr-1" />
                    <span>{user?.role || 'Admin'}</span>
                  </div>
                </div>
              </div>
              
              <button
                onClick={handleSignOut}
                className="flex items-center w-full px-4 py-3 text-base font-medium text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 group"
              >
                <LogOut className="h-5 w-5 mr-3 group-hover:scale-110 transition-transform duration-200" />
                {t('navigation.logout')}
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
