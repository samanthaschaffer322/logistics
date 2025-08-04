'use client'

import React, { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Package, Truck, Send, ShoppingCart, AlertTriangle, TrendingUp, Brain, FileText, Shield, Users, Clock, CheckCircle } from 'lucide-react'
import Navigation from '@/components/Navigation'

interface DashboardStats {
  totalInventory: number
  lowStockItems: number
  activeVehicles: number
  pendingOrders: number
  pendingProcurement: number
  uploadedFiles: number
  aiInsights: number
  activeSessions: number
  securityEvents: number
}

export default function DashboardPage() {
  const { user } = useAuth()
  const [stats, setStats] = useState<DashboardStats>({
    totalInventory: 1250,
    lowStockItems: 23,
    activeVehicles: 15,
    pendingOrders: 42,
    pendingProcurement: 8,
    uploadedFiles: 12,
    aiInsights: 34,
    activeSessions: 2,
    securityEvents: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="p-6">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-lg">Loading dashboard...</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="p-6 space-y-6">
        {/* Welcome Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back, {user?.name || 'User'}!
            </h1>
            <p className="text-gray-600 mt-1">
              Here&apos;s what&apos;s happening with your logistics operations today.
            </p>
            <div className="flex items-center mt-2 text-sm text-gray-500">
              <Shield className="h-4 w-4 mr-1" />
              <span>System secure and operational</span>
              <Users className="h-4 w-4 ml-4 mr-1" />
              <span>{stats.activeSessions} active sessions</span>
              <CheckCircle className="h-4 w-4 ml-4 mr-1 text-green-500" />
              <span>All systems online</span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Last updated</p>
            <p className="text-sm font-medium">{new Date().toLocaleString()}</p>
            <div className="flex items-center mt-1 text-xs text-green-600">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse"></div>
              <span>Live data</span>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-blue-500">
            <CardContent className="p-6">
              <div className="flex items-center">
                <Package className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Inventory</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalInventory.toLocaleString()}</p>
                  <p className="text-xs text-green-600 mt-1">+5.2% from last month</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-orange-500">
            <CardContent className="p-6">
              <div className="flex items-center">
                <AlertTriangle className="h-8 w-8 text-orange-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Low Stock Items</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.lowStockItems}</p>
                  <p className="text-xs text-orange-600 mt-1">Requires attention</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-green-500">
            <CardContent className="p-6">
              <div className="flex items-center">
                <Truck className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Active Vehicles</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.activeVehicles}</p>
                  <p className="text-xs text-green-600 mt-1">All operational</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-purple-500">
            <CardContent className="p-6">
              <div className="flex items-center">
                <Send className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Pending Orders</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.pendingOrders}</p>
                  <p className="text-xs text-blue-600 mt-1">Processing</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* AI & Advanced Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-indigo-500">
            <CardContent className="p-6">
              <div className="flex items-center">
                <FileText className="h-8 w-8 text-indigo-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Files Processed</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.uploadedFiles}</p>
                  <p className="text-xs text-gray-500 mt-1">AI analyzed</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-pink-500">
            <CardContent className="p-6">
              <div className="flex items-center">
                <Brain className="h-8 w-8 text-pink-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">AI Insights</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.aiInsights}</p>
                  <p className="text-xs text-gray-500 mt-1">Generated</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-cyan-500">
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-cyan-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Active Users</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.activeSessions}</p>
                  <p className="text-xs text-green-600 mt-1">Online now</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-emerald-500">
            <CardContent className="p-6">
              <div className="flex items-center">
                <Shield className="h-8 w-8 text-emerald-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Security Status</p>
                  <p className="text-2xl font-bold text-gray-900">Secure</p>
                  <p className="text-xs text-green-600 mt-1">All systems protected</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Feature Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* System Status */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center">
                <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
                System Status
              </CardTitle>
              <CardDescription>
                All logistics modules are operational
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { name: 'Fleet Management', status: 'Online', color: 'green' },
                  { name: 'Real-time Tracking', status: 'Online', color: 'green' },
                  { name: 'AI Assistant', status: 'Online', color: 'green' },
                  { name: 'File Learning', status: 'Online', color: 'green' },
                  { name: 'Vietnam Map', status: 'Online', color: 'green' },
                  { name: 'Warehouse System', status: 'Online', color: 'green' }
                ].map((system, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium text-gray-900">{system.name}</span>
                    <div className="flex items-center">
                      <div className={`w-2 h-2 bg-${system.color}-500 rounded-full mr-2`}></div>
                      <span className={`text-sm text-${system.color}-600`}>{system.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="mr-2 h-5 w-5" />
                Recent Activity
              </CardTitle>
              <CardDescription>
                Latest system activities and updates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { action: 'User logged in successfully', time: '2 minutes ago', icon: Shield },
                  { action: 'Fleet vehicle #15 updated location', time: '5 minutes ago', icon: Truck },
                  { action: 'New shipment order created', time: '12 minutes ago', icon: Send },
                  { action: 'AI analysis completed for inventory', time: '18 minutes ago', icon: Brain },
                  { action: 'Warehouse stock levels updated', time: '25 minutes ago', icon: Package }
                ].map((activity, index) => {
                  const Icon = activity.icon
                  return (
                    <div key={index} className="flex items-start p-3 bg-gray-50 rounded-lg">
                      <Icon className="h-4 w-4 text-gray-600 mt-0.5 mr-3 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Access key features and common tasks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { href: '/ai-assistant', icon: Brain, title: 'AI Assistant', desc: 'Get logistics insights', color: 'purple' },
                { href: '/file-learning', icon: FileText, title: 'File Learning', desc: 'Upload & analyze files', color: 'indigo' },
                { href: '/fleet-management', icon: Truck, title: 'Fleet Management', desc: 'Manage vehicles', color: 'green' },
                { href: '/real-time-tracking', icon: TrendingUp, title: 'Live Tracking', desc: 'Monitor shipments', color: 'blue' },
                { href: '/shipments', icon: Send, title: 'Shipments', desc: 'Manage deliveries', color: 'orange' },
                { href: '/warehouse', icon: Package, title: 'Warehouse', desc: 'Inventory control', color: 'cyan' },
                { href: '/procurement', icon: ShoppingCart, title: 'Procurement', desc: 'Purchase orders', color: 'pink' },
                { href: '/vietnam-map', icon: TrendingUp, title: 'Vietnam Map', desc: 'Geographic insights', color: 'emerald' }
              ].map((action, index) => {
                const Icon = action.icon
                return (
                  <a
                    key={index}
                    href={action.href}
                    className={`flex items-center p-4 bg-${action.color}-50 rounded-lg hover:bg-${action.color}-100 transition-colors group`}
                  >
                    <Icon className={`h-6 w-6 text-${action.color}-600 mr-3 group-hover:scale-110 transition-transform`} />
                    <div>
                      <p className="font-medium text-gray-900">{action.title}</p>
                      <p className="text-sm text-gray-600">{action.desc}</p>
                    </div>
                  </a>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
