'use client'

import React from 'react'
import Layout from '@/components/Layout'
import { 
  Brain, 
  BarChart3, 
  MapPin, 
  Truck, 
  Package, 
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertTriangle,
  Zap
} from 'lucide-react'

const DashboardPage = () => {
  const stats = [
    { title: 'Active Shipments', value: '1,247', change: '+12%', icon: Package, color: 'text-blue-400' },
    { title: 'Total Revenue', value: '₫2.4B', change: '+8%', icon: DollarSign, color: 'text-green-400' },
    { title: 'Fleet Vehicles', value: '89', change: '+3%', icon: Truck, color: 'text-purple-400' },
    { title: 'Delivery Rate', value: '98.2%', change: '+0.5%', icon: TrendingUp, color: 'text-indigo-400' }
  ]

  const recentActivities = [
    { id: 1, type: 'shipment', message: 'Shipment #SH-2024-001 delivered to Hanoi', time: '2 minutes ago', status: 'success' },
    { id: 2, type: 'route', message: 'New optimized route calculated for HCMC-Da Nang', time: '15 minutes ago', status: 'info' },
    { id: 3, type: 'alert', message: 'Weather alert: Heavy rain expected in Central Vietnam', time: '1 hour ago', status: 'warning' },
    { id: 4, type: 'ai', message: 'AI Assistant processed 23 logistics queries', time: '2 hours ago', status: 'success' }
  ]

  const quickActions = [
    { title: 'Super AI Assistant', description: 'Get intelligent logistics insights', icon: Brain, href: '/super-ai', color: 'bg-gradient-to-r from-purple-600 to-pink-600' },
    { title: 'Route Optimization', description: 'Optimize delivery routes', icon: MapPin, href: '/vietnam-map', color: 'bg-gradient-to-r from-blue-600 to-cyan-600' },
    { title: 'Analytics Dashboard', description: 'View performance metrics', icon: BarChart3, href: '/analytics', color: 'bg-gradient-to-r from-green-600 to-emerald-600' },
    { title: 'File Learning', description: 'Upload and analyze documents', icon: Zap, href: '/file-learning', color: 'bg-gradient-to-r from-orange-600 to-red-600' }
  ]

  return (
    <Layout>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold gradient-text">
              LogiAI Dashboard
            </h1>
            <p className="text-slate-400 mt-2">
              AI-powered Vietnamese logistics management platform
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="px-4 py-2 bg-green-500/20 text-green-400 rounded-xl border border-green-500/30">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                System Online
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div key={index} className="dark-card p-6 hover:scale-105 transition-transform duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">{stat.title}</p>
                  <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
                  <p className={`text-sm mt-1 ${stat.change.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                    {stat.change} from last month
                  </p>
                </div>
                <div className={`p-3 rounded-xl bg-slate-800/50 ${stat.color}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map((action, index) => (
            <a
              key={index}
              href={action.href}
              className={`${action.color} p-6 rounded-xl text-white hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl`}
            >
              <div className="flex items-center gap-3 mb-3">
                <action.icon className="w-6 h-6" />
                <h3 className="font-semibold">{action.title}</h3>
              </div>
              <p className="text-white/80 text-sm">{action.description}</p>
            </a>
          ))}
        </div>

        {/* Recent Activities */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="dark-card p-6">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-indigo-400" />
              Recent Activities
            </h3>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg bg-slate-800/30 hover:bg-slate-800/50 transition-colors">
                  <div className={`p-1 rounded-full ${
                    activity.status === 'success' ? 'bg-green-500/20 text-green-400' :
                    activity.status === 'warning' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-blue-500/20 text-blue-400'
                  }`}>
                    {activity.status === 'success' ? <CheckCircle className="w-4 h-4" /> :
                     activity.status === 'warning' ? <AlertTriangle className="w-4 h-4" /> :
                     <Clock className="w-4 h-4" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-white text-sm">{activity.message}</p>
                    <p className="text-slate-400 text-xs mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* System Status */}
          <div className="dark-card p-6">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-400" />
              System Status
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800/30">
                <span className="text-white">AI Assistant</span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-green-400 text-sm">Online</span>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800/30">
                <span className="text-white">Route Optimizer</span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-green-400 text-sm">Active</span>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800/30">
                <span className="text-white">OpenAI Integration</span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-green-400 text-sm">Connected</span>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800/30">
                <span className="text-white">Database</span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-green-400 text-sm">Healthy</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Welcome Message */}
        <div className="dark-card p-8 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold gradient-text mb-4">
              Welcome to LogiAI Platform
            </h2>
            <p className="text-slate-300 mb-6">
              Your comprehensive AI-powered logistics management solution for Vietnamese supply chain operations. 
              Get started by exploring our intelligent features designed specifically for the Vietnamese market.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a href="/super-ai" className="gradient-button">
                Try AI Assistant
              </a>
              <a href="/vietnam-map" className="dark-button">
                Explore Vietnam Map
              </a>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default DashboardPage
