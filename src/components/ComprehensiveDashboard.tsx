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
  Wifi,
  ArrowRight
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
    { title: 'Total Shipments', value: '2,847', change: '+12.5%', icon: Package, color: 'text-blue-500' },
    { title: 'Active Routes', value: '156', change: '+8.2%', icon: Navigation, color: 'text-green-500' },
    { title: 'Fleet Utilization', value: '94.2%', change: '+3.1%', icon: Truck, color: 'text-purple-500' },
    { title: 'Cost Savings', value: '₫2.4M', change: '+15.7%', icon: DollarSign, color: 'text-yellow-500' },
    { title: 'On-time Delivery', value: '98.5%', change: '+2.3%', icon: Clock, color: 'text-indigo-500' },
    { title: 'Customer Satisfaction', value: '4.8/5', change: '+0.2', icon: Target, color: 'text-pink-500' }
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Enhanced Header */}
      <header className="bg-slate-800/60 backdrop-blur-xl border-b border-slate-700/50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur opacity-30"></div>
                  <div className="relative bg-slate-700 p-2 rounded-full">
                    <Brain className="h-8 w-8 text-blue-400" />
                  </div>
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    LogiAI
                  </h1>
                  <p className="text-xs text-slate-400 font-medium">
                    {t('dashboard.overview')}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30 px-3 py-1 font-medium">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                  {t('status.online')}
                </Badge>
                <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 px-3 py-1 font-medium">
                  Enhanced v2.1
                </Badge>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="h-5 w-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" />
                <Input 
                  placeholder={t('common.search') + "..."} 
                  className="pl-12 pr-4 w-80 bg-slate-700/50 text-white placeholder-slate-400 border-slate-600/50 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 rounded-xl h-12 text-sm"
                />
              </div>
              
              <Button 
                variant="outline" 
                size="sm" 
                className="bg-slate-700/50 text-slate-300 border-slate-600/50 hover:bg-slate-600/50 hover:text-white rounded-xl h-12 px-4"
              >
                <Bell className="h-5 w-5" />
              </Button>
              
              <LanguageSelector />
              
              <div className="flex items-center gap-3 bg-slate-700/30 rounded-xl p-2">
                <div className="text-right">
                  <p className="text-sm font-semibold text-white">{user?.name}</p>
                  <p className="text-xs text-slate-400 capitalize">{user?.role}</p>
                </div>
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase()}
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={logout} 
                  className="bg-red-500/20 text-red-400 border-red-500/30 hover:bg-red-500/30 hover:text-red-300 rounded-lg h-8 px-3"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Enhanced Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-5 bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-2 h-14">
            <TabsTrigger 
              value="overview" 
              className="text-slate-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white rounded-xl font-semibold transition-all duration-300 h-10"
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              {t('nav.overview')}
            </TabsTrigger>
            <TabsTrigger 
              value="operations" 
              className="text-slate-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white rounded-xl font-semibold transition-all duration-300 h-10"
            >
              <Activity className="w-4 h-4 mr-2" />
              {t('nav.operations')}
            </TabsTrigger>
            <TabsTrigger 
              value="analytics" 
              className="text-slate-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white rounded-xl font-semibold transition-all duration-300 h-10"
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              {t('nav.analytics')}
            </TabsTrigger>
            <TabsTrigger 
              value="fleet" 
              className="text-slate-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white rounded-xl font-semibold transition-all duration-300 h-10"
            >
              <Truck className="w-4 h-4 mr-2" />
              {t('nav.fleet')}
            </TabsTrigger>
            <TabsTrigger 
              value="system" 
              className="text-slate-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white rounded-xl font-semibold transition-all duration-300 h-10"
            >
              <Settings className="w-4 h-4 mr-2" />
              {t('nav.system')}
            </TabsTrigger>
          </TabsList>

          {/* Enhanced Overview Tab */}
          <TabsContent value="overview" className="space-y-8">
            {/* Enhanced Welcome Section */}
            <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm rounded-2xl p-8 text-white border border-blue-500/20 shadow-xl">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center">
                      <Brain className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold mb-2">Welcome back, {user?.name}!</h2>
                      <p className="text-lg text-blue-100 opacity-90">
                        Your intelligent logistics command center is ready. Monitor operations, optimize routes, and drive efficiency.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 mt-6">
                    <div className="flex items-center gap-2 bg-green-500/20 px-4 py-2 rounded-xl border border-green-500/30">
                      <CheckCircle className="w-5 h-5 text-green-400" />
                      <span className="text-green-100 font-medium">All Systems Operational</span>
                    </div>
                    <div className="flex items-center gap-2 bg-blue-500/20 px-4 py-2 rounded-xl border border-blue-500/30">
                      <Zap className="w-5 h-5 text-blue-400" />
                      <span className="text-blue-100 font-medium">AI Assistant Active</span>
                    </div>
                    <div className="flex items-center gap-2 bg-purple-500/20 px-4 py-2 rounded-xl border border-purple-500/30">
                      <Globe className="w-5 h-5 text-purple-400" />
                      <span className="text-purple-100 font-medium">Real-time Data</span>
                    </div>
                  </div>
                </div>
                <div className="hidden lg:block">
                  <div className="text-right">
                    <p className="text-4xl font-bold text-white mb-2">
                      {new Date().toLocaleDateString('vi-VN', { 
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                    <p className="text-xl text-blue-100">
                      {new Date().toLocaleTimeString('vi-VN', { 
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {stats.map((stat, index) => {
                const Icon = stat.icon
                return (
                  <Card key={index} className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50 hover:border-slate-600/50 transition-all duration-300 group hover:transform hover:scale-105 shadow-lg">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="text-slate-400 text-sm font-medium mb-2">{stat.title}</p>
                          <p className="text-3xl font-bold text-white mb-1">{stat.value}</p>
                          <div className="flex items-center gap-2">
                            <span className={`text-sm font-semibold ${
                              stat.change.startsWith('+') ? 'text-green-400' : 'text-red-400'
                            }`}>
                              {stat.change}
                            </span>
                            <span className="text-slate-500 text-xs">vs last month</span>
                          </div>
                        </div>
                        <div className={`p-4 rounded-2xl ${stat.color.replace('text-', 'bg-').replace('-500', '-500/20')} group-hover:scale-110 transition-transform duration-300`}>
                          <Icon className={`w-8 h-8 ${stat.color}`} />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            {/* Enhanced Quick Actions */}
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                    <Zap className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">Quick Actions</h3>
                    <p className="text-slate-400">Access key features and tools instantly</p>
                  </div>
                </div>
                <Button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-xl px-6 py-3 font-semibold">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Custom Action
                </Button>
              </div>

              {quickActions.map((category, categoryIndex) => (
                <div key={categoryIndex} className="space-y-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 bg-slate-700/50 rounded-lg flex items-center justify-center">
                      <Layers className="h-4 w-4 text-slate-400" />
                    </div>
                    <h4 className="text-xl font-semibold text-white">{category.category}</h4>
                    <div className="flex-1 h-px bg-gradient-to-r from-slate-700 to-transparent"></div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {category.items.map((action, index) => (
                      <a
                        key={index}
                        href={action.href}
                        className="group relative overflow-hidden bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 hover:border-slate-600/50 rounded-2xl p-6 transition-all duration-300 hover:transform hover:scale-105 hover:shadow-2xl"
                      >
                        {/* Gradient Overlay */}
                        <div className={`absolute inset-0 ${action.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-2xl`}></div>
                        
                        {/* Content */}
                        <div className="relative z-10">
                          <div className="flex items-center gap-4 mb-4">
                            <div className={`p-3 rounded-xl ${action.color} bg-opacity-20 group-hover:bg-opacity-30 transition-all duration-300`}>
                              <action.icon className="h-6 w-6 text-white group-hover:scale-110 transition-transform duration-300" />
                            </div>
                            <div className="flex-1">
                              <h5 className="font-semibold text-white text-lg group-hover:text-blue-100 transition-colors">
                                {action.title}
                              </h5>
                            </div>
                          </div>
                          <p className="text-slate-300 group-hover:text-slate-200 transition-colors leading-relaxed">
                            {action.description}
                          </p>
                          
                          {/* Action Indicator */}
                          <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-700/50">
                            <span className="text-xs text-slate-500 font-medium">Click to access</span>
                            <div className="w-6 h-6 bg-slate-700/50 rounded-full flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                              <ArrowRight className="w-3 h-3 text-slate-400 group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all duration-300" />
                            </div>
                          </div>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* Enhanced Operations Tab */}
          <TabsContent value="operations" className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Enhanced Recent Activities */}
              <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50 shadow-xl">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-3 text-white text-xl">
                    <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                      <Activity className="h-5 w-5 text-white" />
                    </div>
                    Recent Activities
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {recentActivities.map((activity) => {
                    const Icon = activity.icon
                    return (
                      <div key={activity.id} className="flex items-start gap-4 p-4 rounded-xl bg-slate-700/30 hover:bg-slate-700/50 transition-all duration-300 group">
                        <div className={`p-2 rounded-lg ${
                          activity.type === 'success' ? 'bg-green-500/20 text-green-400' :
                          activity.type === 'warning' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-blue-500/20 text-blue-400'
                        }`}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="flex-1">
                          <p className="text-white font-medium group-hover:text-blue-100 transition-colors">
                            {activity.message}
                          </p>
                          <p className="text-slate-400 text-sm mt-1">{activity.time}</p>
                        </div>
                      </div>
                    )
                  })}
                </CardContent>
              </Card>

              {/* Enhanced System Status */}
              <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50 shadow-xl">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-3 text-white text-xl">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                      <Shield className="h-5 w-5 text-white" />
                    </div>
                    System Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {systemStatus.map((system, index) => {
                    const Icon = system.icon
                    return (
                      <div key={index} className="flex items-center justify-between p-4 rounded-xl bg-slate-700/30 hover:bg-slate-700/50 transition-all duration-300 group">
                        <div className="flex items-center gap-3">
                          <Icon className="h-5 w-5 text-blue-400" />
                          <span className="text-white font-medium">{system.name}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-slate-400 text-sm">{system.uptime}</span>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                            <span className="text-green-400 text-sm font-medium">Online</span>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </CardContent>
              </Card>
            </div>

            {/* Operations Control Panel */}
            <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50 shadow-xl">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-white text-xl">
                  <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                    <Settings className="h-5 w-5 text-white" />
                  </div>
                  Operations Control Panel
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Button className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-xl py-6 font-semibold">
                    <Truck className="w-5 h-5 mr-2" />
                    Fleet Status
                  </Button>
                  <Button className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-xl py-6 font-semibold">
                    <Package className="w-5 h-5 mr-2" />
                    Shipments
                  </Button>
                  <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl py-6 font-semibold">
                    <Navigation className="w-5 h-5 mr-2" />
                    Routes
                  </Button>
                  <Button className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white rounded-xl py-6 font-semibold">
                    <AlertTriangle className="w-5 h-5 mr-2" />
                    Alerts
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Enhanced Analytics Tab */}
          <TabsContent value="analytics" className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Enhanced Performance Chart */}
              <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50 shadow-xl">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-3 text-white text-xl">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                      <TrendingUp className="h-5 w-5 text-white" />
                    </div>
                    Performance Trends
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={performanceData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                      <XAxis dataKey="name" stroke="#94a3b8" />
                      <YAxis stroke="#94a3b8" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1e293b', 
                          border: '1px solid #475569',
                          borderRadius: '12px',
                          color: '#f1f5f9'
                        }} 
                      />
                      <Line type="monotone" dataKey="deliveries" stroke="#3B82F6" strokeWidth={3} dot={{ fill: '#3B82F6', strokeWidth: 2, r: 6 }} />
                      <Line type="monotone" dataKey="efficiency" stroke="#10B981" strokeWidth={3} dot={{ fill: '#10B981', strokeWidth: 2, r: 6 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Enhanced Route Distribution */}
              <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50 shadow-xl">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-3 text-white text-xl">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                      <MapPin className="h-5 w-5 text-white" />
                    </div>
                    Route Distribution
                  </CardTitle>
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
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        stroke="#1e293b"
                        strokeWidth={2}
                      >
                        {routeDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1e293b', 
                          border: '1px solid #475569',
                          borderRadius: '12px',
                          color: '#f1f5f9'
                        }} 
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Revenue Chart */}
            <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50 shadow-xl">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-white text-xl">
                  <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                    <DollarSign className="h-5 w-5 text-white" />
                  </div>
                  Revenue Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <AreaChart data={performanceData}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="name" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1e293b', 
                        border: '1px solid #475569',
                        borderRadius: '12px',
                        color: '#f1f5f9'
                      }} 
                    />
                    <Area 
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="#10B981" 
                      strokeWidth={3}
                      fillOpacity={1} 
                      fill="url(#colorRevenue)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Enhanced Fleet Tab */}
          <TabsContent value="fleet" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50 shadow-xl group hover:transform hover:scale-105 transition-all duration-300">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-3 text-white">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Truck className="h-5 w-5 text-white" />
                    </div>
                    Active Vehicles
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-blue-400 mb-2">89</div>
                  <p className="text-slate-400">Currently on routes</p>
                  <div className="mt-4 flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-green-400 text-sm font-medium">All operational</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50 shadow-xl group hover:transform hover:scale-105 transition-all duration-300">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-3 text-white">
                    <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <CheckCircle className="h-5 w-5 text-white" />
                    </div>
                    Maintenance Due
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-yellow-400 mb-2">12</div>
                  <p className="text-slate-400">Vehicles scheduled</p>
                  <div className="mt-4 flex items-center gap-2">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                    <span className="text-yellow-400 text-sm font-medium">Attention needed</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50 shadow-xl group hover:transform hover:scale-105 transition-all duration-300">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-3 text-white">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <TrendingUp className="h-5 w-5 text-white" />
                    </div>
                    Fuel Efficiency
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-purple-400 mb-2">94.2%</div>
                  <p className="text-slate-400">Average efficiency</p>
                  <div className="mt-4 flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                    <span className="text-purple-400 text-sm font-medium">Excellent performance</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Fleet Performance Chart */}
            <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50 shadow-xl">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-white text-xl">
                  <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                    <BarChart3 className="h-5 w-5 text-white" />
                  </div>
                  Fleet Performance Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="name" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1e293b', 
                        border: '1px solid #475569',
                        borderRadius: '12px',
                        color: '#f1f5f9'
                      }} 
                    />
                    <Bar dataKey="deliveries" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="efficiency" fill="#10B981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Fleet Management Actions */}
            <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50 shadow-xl">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-white text-xl">
                  <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center">
                    <Settings className="h-5 w-5 text-white" />
                  </div>
                  Fleet Management Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Button className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-xl py-6 font-semibold">
                    <Plus className="w-5 h-5 mr-2" />
                    Add Vehicle
                  </Button>
                  <Button className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-xl py-6 font-semibold">
                    <Calendar className="w-5 h-5 mr-2" />
                    Schedule Maintenance
                  </Button>
                  <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl py-6 font-semibold">
                    <MapPin className="w-5 h-5 mr-2" />
                    Track Location
                  </Button>
                  <Button className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white rounded-xl py-6 font-semibold">
                    <Download className="w-5 h-5 mr-2" />
                    Export Report
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Enhanced System Tab */}
          <TabsContent value="system" className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* System Health */}
              <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50 shadow-xl">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-3 text-white text-xl">
                    <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                      <Shield className="h-5 w-5 text-white" />
                    </div>
                    System Health
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {systemStatus.map((system, index) => {
                    const Icon = system.icon
                    return (
                      <div key={index} className="flex items-center justify-between p-4 rounded-xl bg-slate-700/30 hover:bg-slate-700/50 transition-all duration-300 group">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-slate-600/50 rounded-lg flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                            <Icon className="h-5 w-5 text-blue-400" />
                          </div>
                          <div>
                            <span className="text-white font-semibold text-lg">{system.name}</span>
                            <p className="text-slate-400 text-sm">Uptime: {system.uptime}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2 bg-green-500/20 px-3 py-1 rounded-lg border border-green-500/30">
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                            <span className="text-green-400 text-sm font-medium">Online</span>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </CardContent>
              </Card>

              {/* System Configuration */}
              <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50 shadow-xl">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-3 text-white text-xl">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                      <Settings className="h-5 w-5 text-white" />
                    </div>
                    Quick Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-xl py-3 font-semibold">
                      <Database className="w-4 h-4 mr-2" />
                      Database Backup
                    </Button>
                    <Button className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-xl py-3 font-semibold">
                      <Download className="w-4 h-4 mr-2" />
                      Export Reports
                    </Button>
                    <Button className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-xl py-3 font-semibold">
                      <Upload className="w-4 h-4 mr-2" />
                      Import Data
                    </Button>
                    <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl py-3 font-semibold">
                      <Users className="w-4 h-4 mr-2" />
                      User Management
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* System Performance Metrics */}
            <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50 shadow-xl">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-white text-xl">
                  <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center">
                    <Activity className="h-5 w-5 text-white" />
                  </div>
                  System Performance Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="text-center p-4 bg-slate-700/30 rounded-xl">
                    <div className="text-3xl font-bold text-blue-400 mb-2">99.9%</div>
                    <p className="text-slate-400 text-sm">System Uptime</p>
                  </div>
                  <div className="text-center p-4 bg-slate-700/30 rounded-xl">
                    <div className="text-3xl font-bold text-green-400 mb-2">2.1s</div>
                    <p className="text-slate-400 text-sm">Response Time</p>
                  </div>
                  <div className="text-center p-4 bg-slate-700/30 rounded-xl">
                    <div className="text-3xl font-bold text-purple-400 mb-2">45GB</div>
                    <p className="text-slate-400 text-sm">Storage Used</p>
                  </div>
                  <div className="text-center p-4 bg-slate-700/30 rounded-xl">
                    <div className="text-3xl font-bold text-yellow-400 mb-2">1,247</div>
                    <p className="text-slate-400 text-sm">Active Sessions</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

export default ComprehensiveDashboard
