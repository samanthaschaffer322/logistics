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
  Shield
} from 'lucide-react'

const navigationItems = [
  { 
    key: 'dashboard', 
    href: '/dashboard', 
    icon: LayoutDashboard,
    label: 'Dashboard'
  },
  { 
    key: 'fleet-management', 
    href: '/fleet-management', 
    icon: Truck,
    label: 'Fleet Management'
  },
  { 
    key: 'real-time-tracking', 
    href: '/real-time-tracking', 
    icon: MapPin,
    label: 'Real-Time Tracking'
  },
  { 
    key: 'shipments', 
    href: '/shipments', 
    icon: Send,
    label: 'Shipments'
  },
  { 
    key: 'warehouse', 
    href: '/warehouse', 
    icon: Package,
    label: 'Warehouse'
  },
  { 
    key: 'transportation', 
    href: '/transportation', 
    icon: Truck,
    label: 'Transportation'
  },
  { 
    key: 'procurement', 
    href: '/procurement', 
    icon: ShoppingCart,
    label: 'Procurement'
  },
  { 
    key: 'distribution', 
    href: '/distribution', 
    icon: Send,
    label: 'Distribution'
  },
  { 
    key: 'vietnam-map', 
    href: '/vietnam-map', 
    icon: MapPin,
    label: 'Vietnam Map'
  },
  { 
    key: 'ai-optimization', 
    href: '/ai-optimization', 
    icon: TrendingUp,
    label: 'AI Optimization'
  },
  { 
    key: 'ai-assistant', 
    href: '/ai-assistant', 
    icon: Brain,
    label: 'AI Assistant'
  },
  { 
    key: 'file-learning', 
    href: '/file-learning', 
    icon: FileText,
    label: 'File Learning'
  }
]

export default function Navigation() {
  const pathname = usePathname()
  const { user, signOut } = useAuth()
  const { locale } = useTranslation()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleSignOut = async () => {
    await signOut()
    window.location.href = '/login'
  }

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
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
          <div className="hidden lg:flex items-center space-x-1">
            {navigationItems.slice(0, 6).map((item) => {
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
                  {item.label}
                </Link>
              )
            })}
            
            {/* More dropdown for additional items */}
            <div className="relative group">
              <button className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50">
                More
                <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <div className="py-1">
                  {navigationItems.slice(6).map((item) => {
                    const Icon = item.icon
                    const isActive = pathname === item.href
                    
                    return (
                      <Link
                        key={item.key}
                        href={item.href}
                        className={`flex items-center px-4 py-2 text-sm transition-colors ${
                          isActive
                            ? 'bg-blue-100 text-blue-700'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <Icon className="h-4 w-4 mr-3" />
                        {item.label}
                      </Link>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* User Menu and Language Switcher */}
          <div className="flex items-center space-x-4">
            {/* Language Switcher */}
            <LanguageSwitcher />

            {/* User Info */}
            <div className="hidden md:flex items-center space-x-3">
              <div className="flex items-center">
                <div className="bg-blue-100 p-2 rounded-full">
                  <User className="h-4 w-4 text-blue-600" />
                </div>
                <div className="ml-2">
                  <p className="text-sm font-medium text-gray-700">
                    {user?.name || 'User'}
                  </p>
                  <p className="text-xs text-gray-500">
                    {user?.role || 'Admin'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center text-xs text-green-600">
                <Shield className="h-3 w-3 mr-1" />
                <span>Secure</span>
              </div>
              
              <button
                onClick={handleSignOut}
                className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-red-600 transition-colors"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="lg:hidden">
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
        <div className="lg:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-50 border-t border-gray-200 max-h-96 overflow-y-auto">
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
                  {item.label}
                </Link>
              )
            })}
            
            {/* Mobile User Actions */}
            <div className="border-t border-gray-200 pt-3 mt-3">
              <div className="flex items-center px-3 py-2">
                <User className="h-5 w-5 text-gray-600 mr-3" />
                <div>
                  <p className="text-base font-medium text-gray-700">
                    {user?.name || 'User'}
                  </p>
                  <p className="text-sm text-gray-500">
                    {user?.role || 'Admin'}
                  </p>
                </div>
              </div>
              
              <button
                onClick={handleSignOut}
                className="flex items-center w-full px-3 py-2 text-base font-medium text-gray-600 hover:text-red-600 transition-colors"
              >
                <LogOut className="h-5 w-5 mr-3" />
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
