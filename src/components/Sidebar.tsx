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
  Zap,
  Activity
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
        { name: 'File Learning Engine', href: '/file-learning', icon: FileText },
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
        { name: 'Real-time Tracking', href: '/real-time-tracking', icon: Activity },
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
    <div className={`dark-sidebar transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-64'} min-h-screen flex flex-col relative`}>
      {/* Header */}
      <div className="p-4 border-b border-slate-700/50">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center space-x-3 animate-fade-in">
              <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg glow-effect">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="font-bold text-xl gradient-text text-shadow">
                  LogiAI
                </span>
                <p className="text-xs text-slate-400">Enhanced AI Logistics</p>
              </div>
            </div>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-lg hover:bg-slate-800/50 transition-all duration-300 text-slate-400 hover:text-white"
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-6 overflow-y-auto">
        {menuItems.map((section, sectionIndex) => (
          <div key={sectionIndex} className="animate-fade-in" style={{ animationDelay: `${sectionIndex * 0.1}s` }}>
            {!isCollapsed && (
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 px-2">
                {section.title}
              </h3>
            )}
            <ul className="space-y-1">
              {section.items.map((item, itemIndex) => {
                const Icon = item.icon
                const active = isActive(item.href)
                return (
                  <li key={itemIndex}>
                    <Link
                      href={item.href}
                      className={`nav-item ${active ? 'active' : ''}`}
                      title={isCollapsed ? item.name : undefined}
                    >
                      <Icon className={`w-5 h-5 ${active ? 'text-white' : 'text-slate-400 group-hover:text-white'} transition-colors duration-300`} />
                      {!isCollapsed && (
                        <span className="font-medium text-sm">{item.name}</span>
                      )}
                      {active && !isCollapsed && (
                        <div className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse-glow"></div>
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
      <div className="p-4 border-t border-slate-700/50">
        {!isCollapsed && (
          <div className="glass-effect rounded-xl p-3 animate-fade-in">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-white">System Status</p>
                <p className="text-xs text-emerald-400">All systems operational</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Sidebar
