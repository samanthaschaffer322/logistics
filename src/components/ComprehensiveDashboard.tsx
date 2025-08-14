'use client'

import React, { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useLanguage } from '@/contexts/LanguageContext'
import LanguageSelector from '@/components/LanguageSelector'
import FunctionalQuickActions from './FunctionalQuickActions'
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
  Zap,
  FileSpreadsheet,
  Navigation,
  Map,
  Globe,
  Shield,
  LogOut,
  Settings,
  Bell,
  Search,
  Plus,
  Filter,
  Download,
  Upload,
  Users,
  Calendar,
  Target,
  Activity,
  Layers,
  Database,
  Cpu,
  Wifi
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, AreaChart, Area
} from 'recharts'

const ComprehensiveDashboard = () => {
  const { user, logout } = useAuth()
  const { t } = useLanguage()
  const [activeTab, setActiveTab] = useState('overview')

  // Sample data for charts
  const performanceData = [
    { name: 'Jan', deliveries: 1200, revenue: 45000, efficiency: 85 },
    { name: 'Feb', deliveries: 1350, revenue: 52000, efficiency: 88 },
    { name: 'Mar', deliveries: 1100, revenue: 41000, efficiency: 82 },
    { name: 'Apr', deliveries: 1450, revenue: 58000, efficiency: 91 },
    { name: 'May', deliveries: 1600, revenue: 62000, efficiency: 94 },
    { name: 'Jun', deliveries: 1750, revenue: 68000, efficiency: 96 }
  ]

  const routeDistribution = [
    { name: 'Ho Chi Minh City', value: 35, color: '#3B82F6' },
    { name: 'Hanoi', value: 25, color: '#10B981' },
    { name: 'Da Nang', value: 20, color: '#F59E0B' },
    { name: 'Can Tho', value: 12, color: '#EF4444' },
    { name: 'Others', value: 8, color: '#8B5CF6' }
  ]

  const stats = [
    { title: 'Total Shipments', value: '2,847', change: '+12.5%', icon: Package, color: 'text-blue-500', bgColor: 'bg-blue-50' },
    { title: 'Active Routes', value: '156', change: '+8.2%', icon: Navigation, color: 'text-green-500', bgColor: 'bg-green-50' },
    { title: 'Fleet Utilization', value: '94.2%', change: '+3.1%', icon: Truck, color: 'text-purple-500', bgColor: 'bg-purple-50' },
    { title: 'Cost Savings', value: '₫2.4M', change: '+15.7%', icon: DollarSign, color: 'text-yellow-500', bgColor: 'bg-yellow-50' },
    { title: 'On-time Delivery', value: '98.5%', change: '+2.3%', icon: Clock, color: 'text-indigo-500', bgColor: 'bg-indigo-50' },
    { title: 'Customer Satisfaction', value: '4.8/5', change: '+0.2', icon: Target, color: 'text-pink-500', bgColor: 'bg-pink-50' }
  ]

  const quickActions = [
    {
      category: 'Route Optimization',
      items: [
        { title: 'Combined Route Optimizer', description: 'Enhanced multi-algorithm optimization with Vietnam map', icon: Navigation, href: '/combined-route-optimizer', color: 'bg-gradient-to-r from-blue-600 to-cyan-600' },
        { title: 'Vietnam Map Routes', description: 'Interactive route planning', icon: Map, href: '/vietnam-map', color: 'bg-gradient-to-r from-green-600 to-emerald-600' }
      ]
    },
    {
      category: 'AI & Analytics',
      items: [
        { title: 'Super AI Assistant', description: 'Intelligent logistics insights', icon: Brain, href: '/super-ai', color: 'bg-gradient-to-r from-purple-600 to-pink-600' },
        { title: 'Analytics Dashboard', description: 'Performance metrics & KPIs', icon: BarChart3, href: '/analytics', color: 'bg-gradient-to-r from-indigo-600 to-purple-600' },
        { title: 'Logistics Operations', description: 'AI-powered operations center', icon: Activity, href: '/logistics-operations', color: 'bg-gradient-to-r from-orange-600 to-red-600' }
      ]
    },
    {
      category: 'Fleet & Shipments',
      items: [
        { title: 'Fleet Management', description: 'Vehicle tracking & maintenance', icon: Truck, href: '/fleet-management', color: 'bg-gradient-to-r from-teal-600 to-cyan-600' },
        { title: 'Shipment Tracking', description: 'Real-time shipment monitoring', icon: Package, href: '/shipments', color: 'bg-gradient-to-r from-blue-600 to-indigo-600' },
        { title: 'Real-time Tracking', description: 'Live GPS tracking system', icon: MapPin, href: '/real-time-tracking', color: 'bg-gradient-to-r from-green-600 to-teal-600' }
      ]
    },
    {
      category: 'Import/Export & Compliance',
      items: [
        { title: 'Import-Export Center', description: 'VNACCS document processing', icon: Globe, href: '/import-export', color: 'bg-gradient-to-r from-emerald-600 to-teal-600' },
        { title: 'Customs Training', description: 'AI fraud detection system', icon: Shield, href: '/customs-training', color: 'bg-gradient-to-r from-red-600 to-pink-600' }
      ]
    },
    {
      category: 'Document & Learning',
      items: [
        { title: 'File Learning System', description: 'Document analysis & insights', icon: Zap, href: '/file-learning', color: 'bg-gradient-to-r from-yellow-600 to-orange-600' },
        { title: 'Automation Planning', description: 'Comprehensive automation roadmap', icon: Settings, href: '/enhanced-optimizer', color: 'bg-gradient-to-r from-gray-600 to-slate-600' }
      ]
    }
  ]

  const recentActivities = [
    { id: 1, type: 'success', message: 'Route HCM-DN-001 optimized successfully', time: '2 minutes ago', icon: CheckCircle },
    { id: 2, type: 'info', message: 'New shipment SH-2024-1247 created', time: '15 minutes ago', icon: Package },
    { id: 3, type: 'warning', message: 'Vehicle VH-001 requires maintenance', time: '1 hour ago', icon: AlertTriangle },
    { id: 4, type: 'success', message: 'AI Assistant processed 45 queries', time: '2 hours ago', icon: Brain },
    { id: 5, type: 'info', message: 'Customs training completed for 12 officers', time: '3 hours ago', icon: Shield }
  ]

  const systemStatus = [
    { name: 'AI Assistant', status: 'online', uptime: '99.9%', icon: Brain },
    { name: 'Route Optimizer', status: 'online', uptime: '99.7%', icon: Navigation },
    { name: 'Database', status: 'online', uptime: '100%', icon: Database },
    { name: 'API Services', status: 'online', uptime: '99.8%', icon: Cpu },
    { name: 'Network', status: 'online', uptime: '99.9%', icon: Wifi }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-sm border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Brain className="h-8 w-8 text-white" />
                <h1 className="text-2xl font-bold text-white">LogiAI</h1>
              </div>
              <Badge variant="secondary" className="bg-green-500/20 text-green-300 border-green-500/30">
                Production
              </Badge>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60" />
                <Input 
                  placeholder="Search..." 
                  className="pl-10 w-64 bg-white/20 backdrop-blur-sm text-white placeholder-white/60 border-white/30 focus:border-white/60"
                />
              </div>
              <Button variant="outline" size="sm" className="bg-white/20 backdrop-blur-sm text-white border-white/30 hover:bg-white/30">
                <Bell className="h-4 w-4" />
              </Button>
              <LanguageSelector />
              <div className="flex items-center gap-2">
                <div className="text-right">
                  <p className="text-sm font-medium text-white">{user?.name}</p>
                  <p className="text-xs text-white/70 capitalize">{user?.role}</p>
                </div>
                <Button variant="outline" size="sm" onClick={logout} className="bg-white/20 backdrop-blur-sm text-white border-white/30 hover:bg-white/30">
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-white/10 backdrop-blur-sm border-white/20">
            <TabsTrigger value="overview" className="text-white data-[state=active]:bg-white/20 data-[state=active]:text-white">Overview</TabsTrigger>
            <TabsTrigger value="operations" className="text-white data-[state=active]:bg-white/20 data-[state=active]:text-white">Operations</TabsTrigger>
            <TabsTrigger value="analytics" className="text-white data-[state=active]:bg-white/20 data-[state=active]:text-white">Analytics</TabsTrigger>
            <TabsTrigger value="fleet" className="text-white data-[state=active]:bg-white/20 data-[state=active]:text-white">Fleet</TabsTrigger>
            <TabsTrigger value="system" className="text-white data-[state=active]:bg-white/20 data-[state=active]:text-white">System</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-blue-600/80 to-purple-600/80 backdrop-blur-sm rounded-lg p-6 text-white border border-white/20">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Welcome back, {user?.name}!</h2>
                  <p className="text-blue-100">Here's your logistics overview for today</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-blue-100">Today</p>
                  <p className="text-lg font-semibold">{new Date().toLocaleDateString()}</p>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {stats.map((stat, index) => (
                <Card key={index} className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-white/80">{stat.title}</p>
                        <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
                        <p className={`text-sm mt-1 ${stat.change.startsWith('+') ? 'text-green-300' : 'text-red-300'}`}>
                          {stat.change} from last month
                        </p>
                      </div>
                      <div className={`p-3 rounded-lg bg-white/20 backdrop-blur-sm`}>
                        <stat.icon className={`h-6 w-6 text-white`} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900">Quick Actions</h3>
                <Button variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add New
                </Button>
              </div>

              {quickActions.map((category, categoryIndex) => (
                <div key={categoryIndex} className="space-y-4">
                  <h4 className="text-lg font-medium text-gray-700 flex items-center gap-2">
                    <Layers className="h-5 w-5" />
                    {category.category}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {category.items.map((action, index) => (
                      <a
                        key={index}
                        href={action.href}
                        className={`${action.color} p-6 rounded-lg text-white hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl group`}
                      >
                        <div className="flex items-center gap-3 mb-3">
                          <action.icon className="h-6 w-6 group-hover:scale-110 transition-transform" />
                          <h5 className="font-semibold">{action.title}</h5>
                        </div>
                        <p className="text-white/90 text-sm">{action.description}</p>
                      </a>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* Operations Tab */}
          <TabsContent value="operations" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Activities */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Recent Activities
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivities.map((activity) => (
                      <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                        <div className={`p-1 rounded-full ${
                          activity.type === 'success' ? 'bg-green-100 text-green-600' :
                          activity.type === 'warning' ? 'bg-yellow-100 text-yellow-600' :
                          'bg-blue-100 text-blue-600'
                        }`}>
                          <activity.icon className="h-4 w-4" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                          <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* System Status */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    System Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {systemStatus.map((system, index) => (
                      <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                        <div className="flex items-center gap-3">
                          <system.icon className="h-5 w-5 text-gray-600" />
                          <span className="font-medium text-gray-900">{system.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="bg-green-100 text-green-800">
                            {system.uptime}
                          </Badge>
                          <div className="flex items-center gap-1">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            <span className="text-sm text-green-600">Online</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Performance Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Performance Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={performanceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="deliveries" stroke="#3B82F6" strokeWidth={2} />
                      <Line type="monotone" dataKey="efficiency" stroke="#10B981" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Route Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle>Route Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={routeDistribution}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {routeDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Fleet Tab */}
          <TabsContent value="fleet" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Truck className="h-5 w-5" />
                    Active Vehicles
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-600">89</div>
                  <p className="text-sm text-gray-600">Currently on routes</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Utilization Rate
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600">94.2%</div>
                  <p className="text-sm text-gray-600">Fleet efficiency</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Avg Delivery Time
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-purple-600">2.4h</div>
                  <p className="text-sm text-gray-600">Per route</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* System Tab */}
          <TabsContent value="system" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>System Health</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>CPU Usage</span>
                      <span className="text-green-600">23%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Memory Usage</span>
                      <span className="text-yellow-600">67%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Storage</span>
                      <span className="text-blue-600">45%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Network</span>
                      <span className="text-green-600">Optimal</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <FunctionalQuickActions />
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

export default ComprehensiveDashboard
