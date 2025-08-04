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
  Route,
  LogOut, 
  Menu, 
  X,
  User
} from 'lucide-react'

const navigationItems = [
  { 
    key: 'dashboard', 
    href: '/dashboard', 
    icon: LayoutDashboard,
    translationKey: 'navigation.dashboard'
  },
  { 
    key: 'shipments', 
    href: '/shipments', 
    icon: Send,
    translationKey: 'navigation.shipments'
  },
  { 
    key: 'warehouse', 
    href: '/warehouse', 
    icon: Package,
    translationKey: 'navigation.warehouse'
  },
  { 
    key: 'transportation', 
    href: '/transportation', 
    icon: Truck,
    translationKey: 'navigation.transportation'
  },
  { 
    key: 'vietnam-map', 
    href: '/vietnam-map', 
    icon: MapPin,
    translationKey: 'navigation.vietnamMap'
  },
  { 
    key: 'ai-optimization', 
    href: '/ai-optimization', 
    icon: TrendingUp,
    translationKey: 'navigation.aiOptimization'
  },
  { 
    key: 'ai-assistant', 
    href: '/ai-assistant', 
    icon: Brain,
    translationKey: 'navigation.aiAssistant'
  },
  { 
    key: 'file-learning', 
    href: '/file-learning', 
    icon: FileText,
    translationKey: 'navigation.fileLearning'
  }
]

export default function Navigation() {
  const pathname = usePathname()
  const { user, signOut } = useAuth()
  const { t, locale } = useTranslation()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleSignOut = async () => {
    await signOut()
    window.location.href = '/login'
  }

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link href="/dashboard" className="flex items-center">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Truck className="h-6 w-6 text-white" />
              </div>
              <span className="ml-3 text-xl font-bold text-gray-900">LogiAI</span>
              <span className="ml-2 text-sm text-gray-500">
                {locale === 'vi' ? 'Logistics AI' : 'AI Logistics'}
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navigationItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              
              return (
                <Link
                  key={item.key}
                  href={item.href}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {t(item.translationKey)}
                </Link>
              )
            })}
          </div>

          {/* User Menu and Language Switcher */}
          <div className="flex items-center space-x-4">
            {/* Language Switcher */}
            <LanguageSwitcher />

            {/* User Menu */}
            <div className="flex items-center space-x-3">
              <div className="flex items-center">
                <User className="h-4 w-4 text-gray-600 mr-2" />
                <span className="text-sm font-medium text-gray-700">
                  {user?.name || 'User'}
                </span>
              </div>
              
              <button
                onClick={handleSignOut}
                className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-red-600 transition-colors"
              >
                <LogOut className="h-4 w-4 mr-2" />
                {t('navigation.logout')}
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
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
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-50 border-t border-gray-200">
            {navigationItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              
              return (
                <Link
                  key={item.key}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center px-3 py-2 rounded-md text-base font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="h-5 w-5 mr-3" />
                  {t(item.translationKey)}
                </Link>
              )
            })}
            
            {/* Mobile User Actions */}
            <div className="border-t border-gray-200 pt-3 mt-3">
              <div className="flex items-center px-3 py-2">
                <User className="h-5 w-5 text-gray-600 mr-3" />
                <span className="text-base font-medium text-gray-700">
                  {user?.name || 'User'}
                </span>
              </div>
              
              <button
                onClick={handleSignOut}
                className="flex items-center w-full px-3 py-2 text-base font-medium text-gray-600 hover:text-red-600 transition-colors"
              >
                <LogOut className="h-5 w-5 mr-3" />
                {t('navigation.logout')}
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
