'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import {
  LayoutDashboard,
  Package,
  Truck,
  Send,
  ShoppingCart,
  Users,
  FileText,
  LogOut,
  Brain,
  MessageSquare,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navigationItems = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
    roles: ['admin', 'warehouse', 'transport', 'distribution', 'procurement'],
  },
  {
    name: 'Warehouse',
    href: '/warehouse',
    icon: Package,
    roles: ['admin', 'warehouse'],
  },
  {
    name: 'Transportation',
    href: '/transportation',
    icon: Truck,
    roles: ['admin', 'transport'],
  },
  {
    name: 'Distribution',
    href: '/distribution',
    icon: Send,
    roles: ['admin', 'distribution'],
  },
  {
    name: 'Procurement',
    href: '/procurement',
    icon: ShoppingCart,
    roles: ['admin', 'procurement'],
  },
  {
    name: 'AI Optimization',
    href: '/ai-optimization',
    icon: Brain,
    roles: ['admin', 'warehouse', 'transport', 'distribution', 'procurement'],
  },
  {
    name: 'AI Assistant',
    href: '/ai-assistant',
    icon: MessageSquare,
    roles: ['admin', 'warehouse', 'transport', 'distribution', 'procurement'],
  },
  {
    name: 'File Learning',
    href: '/file-learning',
    icon: FileText,
    roles: ['admin'],
  },
  {
    name: 'Users',
    href: '/users',
    icon: Users,
    roles: ['admin'],
  },
]

export default function Navigation() {
  const pathname = usePathname()
  const { userRole, signOut } = useAuth()

  const filteredItems = navigationItems.filter((item) =>
    item.roles.includes(userRole as string)
  )

  return (
    <nav className="bg-white shadow-sm border-r border-gray-200 w-64 min-h-screen">
      <div className="p-6">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">LA</span>
          </div>
          <span className="text-xl font-bold text-gray-900">LogiAI</span>
        </div>
      </div>

      <div className="px-3">
        <ul className="space-y-1">
          {filteredItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href

            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
                    isActive
                      ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  )}
                >
                  <Icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              </li>
            )
          })}
        </ul>
      </div>

      <div className="absolute bottom-0 w-64 p-3">
        <button
          onClick={signOut}
          className="flex items-center w-full px-3 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50 hover:text-gray-900 transition-colors"
        >
          <LogOut className="mr-3 h-5 w-5" />
          Sign Out
        </button>
      </div>
    </nav>
  )
}
