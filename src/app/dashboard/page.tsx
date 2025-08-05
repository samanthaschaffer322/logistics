'use client'

import React, { useState, useEffect } from 'react'
import Layout from '@/components/Layout'
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  Button,
  Badge,
  Progress
} from '@/components/ui-components'
import { 
  LayoutDashboard,
  TrendingUp,
  Package,
  Truck,
  MapPin,
  DollarSign,
  Clock,
  AlertTriangle,
  CheckCircle,
  Brain,
  Zap,
  BarChart3,
  Users,
  Route
} from 'lucide-react'

interface DashboardStats {
  totalShipments: number
  activeRoutes: number
  totalRevenue: number
  onTimeDelivery: number
  fuelEfficiency: number
  aiOptimizations: number
}

const DashboardPage = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalShipments: 0,
    activeRoutes: 0,
    totalRevenue: 0,
    onTimeDelivery: 0,
    fuelEfficiency: 0,
    aiOptimizations: 0
  })

  const [recentActivities, setRecentActivities] = useState([
    {
      id: 1,
      type: 'shipment',
      title: 'New shipment from HCMC to Hanoi',
      time: '2 minutes ago',
      status: 'active'
    },
    {
      id: 2,
      type: 'optimization',
      title: 'AI optimized route for Truck VN-001',
      time: '15 minutes ago',
      status: 'completed'
    },
    {
      id: 3,
      type: 'alert',
      title: 'Weather alert for Da Nang route',
      time: '1 hour ago',
      status: 'warning'
    },
    {
      id: 4,
      type: 'delivery',
      title: 'Delivery completed to Hai Phong',
      time: '2 hours ago',
      status: 'completed'
    }
  ])

  useEffect(() => {
    // Simulate loading dashboard data
    const timer = setTimeout(() => {
      setStats({
        totalShipments: 1247,
        activeRoutes: 23,
        totalRevenue: 2850000000, // VND
        onTimeDelivery: 94.5,
        fuelEfficiency: 87.2,
        aiOptimizations: 156
      })
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      notation: 'compact'
    }).format(amount)
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'shipment': return <Package className="w-4 h-4 text-blue-600" />
      case 'optimization': return <Zap className="w-4 h-4 text-yellow-600" />
      case 'alert': return <AlertTriangle className="w-4 h-4 text-red-600" />
      case 'delivery': return <CheckCircle className="w-4 h-4 text-green-600" />
      default: return <Clock className="w-4 h-4 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-blue-100 text-blue-800'
      case 'completed': return 'bg-green-100 text-green-800'
      case 'warning': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <LayoutDashboard className="w-8 h-8 text-blue-600" />
              Dashboard
            </h1>
            <p className="text-gray-600 mt-1">
              Real-time logistics operations overview
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              All Systems Operational
            </Badge>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Brain className="w-4 h-4 mr-2" />
              AI Insights
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Shipments</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.totalShipments.toLocaleString()}
                  </p>
                </div>
                <Package className="w-8 h-8 text-blue-600" />
              </div>
              <div className="mt-2">
                <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">
                  +12% from last month
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Routes</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.activeRoutes}</p>
                </div>
                <Route className="w-8 h-8 text-green-600" />
              </div>
              <div className="mt-2">
                <Badge variant="secondary" className="bg-blue-100 text-blue-800 text-xs">
                  Real-time tracking
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(stats.totalRevenue)}
                  </p>
                </div>
                <DollarSign className="w-8 h-8 text-yellow-600" />
              </div>
              <div className="mt-2">
                <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">
                  +8% this quarter
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">On-Time Delivery</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.onTimeDelivery}%</p>
                </div>
                <Clock className="w-8 h-8 text-purple-600" />
              </div>
              <div className="mt-2">
                <Progress value={stats.onTimeDelivery} className="h-2" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Fuel Efficiency</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.fuelEfficiency}%</p>
                </div>
                <Truck className="w-8 h-8 text-red-600" />
              </div>
              <div className="mt-2">
                <Progress value={stats.fuelEfficiency} className="h-2" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">AI Optimizations</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.aiOptimizations}</p>
                </div>
                <Brain className="w-8 h-8 text-indigo-600" />
              </div>
              <div className="mt-2">
                <Badge variant="secondary" className="bg-purple-100 text-purple-800 text-xs">
                  This week
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activities */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-blue-600" />
                  Recent Activities
                </CardTitle>
                <CardDescription>
                  Latest updates from your logistics operations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                      {getActivityIcon(activity.type)}
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{activity.title}</p>
                        <p className="text-sm text-gray-600">{activity.time}</p>
                      </div>
                      <Badge className={getStatusColor(activity.status)}>
                        {activity.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-yellow-600" />
                  Quick Actions
                </CardTitle>
                <CardDescription>
                  Frequently used operations
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start bg-blue-600 hover:bg-blue-700">
                  <Brain className="w-4 h-4 mr-2" />
                  Super AI Assistant
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <MapPin className="w-4 h-4 mr-2" />
                  Plan New Route
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Package className="w-4 h-4 mr-2" />
                  Create Shipment
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Truck className="w-4 h-4 mr-2" />
                  Track Vehicle
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  View Analytics
                </Button>
              </CardContent>
            </Card>

            {/* System Status */}
            <Card className="mt-4">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  System Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">AI Systems</span>
                  <Badge className="bg-green-100 text-green-800">Online</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">GPS Tracking</span>
                  <Badge className="bg-green-100 text-green-800">Active</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Route Optimization</span>
                  <Badge className="bg-green-100 text-green-800">Running</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Data Sync</span>
                  <Badge className="bg-yellow-100 text-yellow-800">Syncing</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Performance Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-600" />
                Performance Trends
              </CardTitle>
              <CardDescription>
                Key metrics over the last 30 days
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">Delivery Success Rate</span>
                    <span className="text-sm font-medium">94.5%</span>
                  </div>
                  <Progress value={94.5} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">Route Optimization</span>
                    <span className="text-sm font-medium">87.2%</span>
                  </div>
                  <Progress value={87.2} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">Cost Efficiency</span>
                    <span className="text-sm font-medium">91.8%</span>
                  </div>
                  <Progress value={91.8} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">Customer Satisfaction</span>
                    <span className="text-sm font-medium">96.3%</span>
                  </div>
                  <Progress value={96.3} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-blue-600" />
                Active Routes Overview
              </CardTitle>
              <CardDescription>
                Current logistics operations across Vietnam
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">HCMC → Hanoi</p>
                    <p className="text-sm text-gray-600">Truck VN-001 • 65% complete</p>
                  </div>
                  <Badge className="bg-blue-100 text-blue-800">In Transit</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">Da Nang → Hai Phong</p>
                    <p className="text-sm text-gray-600">Van VN-002 • 90% complete</p>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Near Delivery</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">Can Tho → Nha Trang</p>
                    <p className="text-sm text-gray-600">Truck VN-003 • Weather delay</p>
                  </div>
                  <Badge className="bg-yellow-100 text-yellow-800">Delayed</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  )
}

export default DashboardPage
