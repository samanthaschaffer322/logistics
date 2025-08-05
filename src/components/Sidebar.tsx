'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  Bot, 
  Map, 
  Truck, 
  Package, 
  BarChart3, 
  Settings, 
  FileText,
  Users,
  Warehouse,
  Route,
  ChevronLeft,
  ChevronRight,
  Brain,
  Zap
} from 'lucide-react'

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const pathname = usePathname()

  const menuItems = [
    {
      title: 'Overview',
      items: [
        { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
        { name: 'Analytics', href: '/analytics', icon: BarChart3 },
      ]
    },
    {
      title: 'AI Intelligence',
      items: [
        { name: 'Super AI Assistant', href: '/super-ai', icon: Brain },
        { name: 'AI Optimization', href: '/ai-optimization', icon: Zap },
      ]
    },
    {
      title: 'Operations',
      items: [
        { name: 'Vietnam Map & Routes', href: '/vietnam-map', icon: Map },
        { name: 'Fleet Management', href: '/fleet-management', icon: Truck },
        { name: 'Shipments', href: '/shipments', icon: Package },
        { name: 'Warehouse', href: '/warehouse', icon: Warehouse },
      ]
    },
    {
      title: 'Management',
      items: [
        { name: 'Procurement', href: '/procurement', icon: FileText },
        { name: 'Distribution', href: '/distribution', icon: Route },
        { name: 'Real-time Tracking', href: '/real-time-tracking', icon: Users },
      ]
    },
    {
      title: 'System',
      items: [
        { name: 'Settings', href: '/settings', icon: Settings },
      ]
    }
  ]

  const isActive = (href: string) => pathname === href

  return (
    <div className={`bg-slate-900 text-white transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-64'} min-h-screen flex flex-col`}>
      {/* Header */}
      <div className="p-4 border-b border-slate-700">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                LogiAI
              </span>
            </div>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1 rounded-lg hover:bg-slate-700 transition-colors"
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-6">
        {menuItems.map((section, sectionIndex) => (
          <div key={sectionIndex}>
            {!isCollapsed && (
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                {section.title}
              </h3>
            )}
            <ul className="space-y-1">
              {section.items.map((item, itemIndex) => {
                const Icon = item.icon
                return (
                  <li key={itemIndex}>
                    <Link
                      href={item.href}
                      className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 group ${
                        isActive(item.href)
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                          : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                      }`}
                    >
                      <Icon className={`w-5 h-5 ${isActive(item.href) ? 'text-white' : 'text-slate-400 group-hover:text-white'}`} />
                      {!isCollapsed && (
                        <span className="font-medium">{item.name}</span>
                      )}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-slate-700">
        {!isCollapsed && (
          <div className="text-xs text-slate-400">
            <p className="font-semibold">Enhanced AI Logistics</p>
            <p>Vietnamese Supply Chain</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Sidebar
