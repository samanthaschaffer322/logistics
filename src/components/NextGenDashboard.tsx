'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useLanguage } from '@/contexts/LanguageContext'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Brain, BarChart3, MapPin, Truck, Package, DollarSign, TrendingUp, Clock, 
  CheckCircle, AlertTriangle, Zap, Navigation, Activity, Users, Calendar,
  Target, Database, Cpu, Wifi, ArrowRight, Search, Bell, Settings, LogOut,
  Plus, Filter, Download, Upload, Globe, Shield, Layers, Mail, FileSpreadsheet
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, AreaChart, Area, RadarChart, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts'

const NextGenDashboard = () => {
  const { user, logout } = useAuth()
  const { t, language } = useLanguage()
  const [activeTab, setActiveTab] = useState('overview')
  const [searchQuery, setSearchQuery] = useState('')
  const [realTimeData, setRealTimeData] = useState({
    activeShipments: 2847,
    onTimeDelivery: 98.5,
    fleetUtilization: 94.2,
    costSavings: 2400000
  })

  // Real-time data simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setRealTimeData(prev => ({
        activeShipments: prev.activeShipments + Math.floor(Math.random() * 10 - 5),
        onTimeDelivery: Math.min(100, prev.onTimeDelivery + (Math.random() - 0.5) * 0.1),
        fleetUtilization: Math.min(100, prev.fleetUtilization + (Math.random() - 0.5) * 0.5),
        costSavings: prev.costSavings + Math.floor(Math.random() * 10000 - 5000)
      }))
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const performanceData = [
    { name: 'Jan', deliveries: 1200, revenue: 45000, efficiency: 85, aiOptimization: 78 },
    { name: 'Feb', deliveries: 1350, revenue: 52000, efficiency: 88, aiOptimization: 82 },
    { name: 'Mar', deliveries: 1100, revenue: 41000, efficiency: 82, aiOptimization: 85 },
    { name: 'Apr', deliveries: 1450, revenue: 58000, efficiency: 91, aiOptimization: 89 },
    { name: 'May', deliveries: 1600, revenue: 62000, efficiency: 94, aiOptimization: 92 },
    { name: 'Jun', deliveries: 1750, revenue: 68000, efficiency: 96, aiOptimization: 95 }
  ]

  const aiInsights = [
    {
      type: 'optimization',
      title: language === 'vi' ? 'Tối ưu hóa tuyến đường' : 'Route Optimization',
      description: language === 'vi' ? 'AI đã tối ưu 15 tuyến đường, tiết kiệm 12% chi phí nhiên liệu' : 'AI optimized 15 routes, saving 12% fuel costs',
      impact: '+12%',
      color: 'text-green-500'
    },
    {
      type: 'prediction',
      title: language === 'vi' ? 'Dự đoán nhu cầu' : 'Demand Prediction',
      description: language === 'vi' ? 'Dự báo tăng 25% nhu cầu vận chuyển tuần tới' : 'Predicting 25% increase in shipping demand next week',
      impact: '+25%',
      color: 'text-blue-500'
    },
    {
      type: 'maintenance',
      title: language === 'vi' ? 'Bảo trì dự đoán' : 'Predictive Maintenance',
      description: language === 'vi' ? '3 xe cần bảo trì trong 5 ngày tới' : '3 vehicles need maintenance in next 5 days',
      impact: '3 vehicles',
      color: 'text-orange-500'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Enhanced Header with AI Status */}
      <header className="bg-slate-800/60 backdrop-blur-xl border-b border-slate-700/50 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-6">
              <motion.div 
                className="flex items-center gap-3"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full blur opacity-40 animate-pulse"></div>
                  <div className="relative bg-slate-700 p-3 rounded-full">
                    <Brain className="h-8 w-8 text-blue-400" />
                  </div>
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                    LogiAI v4.0
                  </h1>
                  <p className="text-xs text-slate-400 font-medium">
                    {language === 'vi' ? 'Nền tảng Logistics Thông minh Thế hệ mới' : 'Next-Gen Intelligent Logistics Platform'}
                  </p>
                </div>
              </motion.div>
              
              <div className="flex items-center gap-3">
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30 px-3 py-1 font-medium animate-pulse">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                  AI Active
                </Badge>
                <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 px-3 py-1 font-medium">
                  Enhanced v4.0
                </Badge>
                <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 px-3 py-1 font-medium">
                  Real-time
                </Badge>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="h-5 w-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" />
                <Input 
                  placeholder={language === 'vi' ? 'Tìm kiếm với AI...' : 'Search with AI...'} 
                  className="pl-12 pr-4 w-80 bg-slate-700/50 text-white placeholder-slate-400 border-slate-600/50 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 rounded-xl h-12 text-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <Button variant="outline" size="sm" className="bg-slate-700/50 text-slate-300 border-slate-600/50 hover:bg-slate-600/50 hover:text-white rounded-xl h-12 px-4">
                <Bell className="h-5 w-5" />
                <Badge className="ml-2 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">3</Badge>
              </Button>
              
              <div className="flex items-center gap-3 bg-slate-700/30 rounded-xl p-2">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold">
                    {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="text-right">
                  <p className="text-sm font-semibold text-white">{user?.name}</p>
                  <p className="text-xs text-slate-400 capitalize">{user?.role}</p>
                </div>
                <Button variant="outline" size="sm" onClick={logout} className="bg-red-500/20 text-red-400 border-red-500/30 hover:bg-red-500/30">
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* AI Insights Banner */}
      <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 backdrop-blur-sm border-b border-purple-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Brain className="h-6 w-6 text-purple-400" />
              <span className="text-white font-medium">
                {language === 'vi' ? 'Thông tin AI thời gian thực' : 'Real-time AI Insights'}
              </span>
            </div>
            <div className="flex items-center gap-6">
              {aiInsights.map((insight, index) => (
                <motion.div 
                  key={index}
                  className="flex items-center gap-2"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className={`text-sm ${insight.color} font-semibold`}>{insight.impact}</div>
                  <div className="text-xs text-slate-300">{insight.title}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-5 bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-2 h-16">
            <TabsTrigger value="overview" className="text-slate-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white rounded-xl font-semibold h-12">
              <BarChart3 className="w-4 h-4 mr-2" />
              {language === 'vi' ? 'Tổng quan AI' : 'AI Overview'}
            </TabsTrigger>
            <TabsTrigger value="operations" className="text-slate-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white rounded-xl font-semibold h-12">
              <Activity className="w-4 h-4 mr-2" />
              {language === 'vi' ? 'Vận hành thông minh' : 'Smart Operations'}
            </TabsTrigger>
            <TabsTrigger value="analytics" className="text-slate-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white rounded-xl font-semibold h-12">
              <TrendingUp className="w-4 h-4 mr-2" />
              {language === 'vi' ? 'Phân tích AI' : 'AI Analytics'}
            </TabsTrigger>
            <TabsTrigger value="fleet" className="text-slate-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white rounded-xl font-semibold h-12">
              <Truck className="w-4 h-4 mr-2" />
              {language === 'vi' ? 'Đội xe AI' : 'AI Fleet'}
            </TabsTrigger>
            <TabsTrigger value="predictions" className="text-slate-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white rounded-xl font-semibold h-12">
              <Brain className="w-4 h-4 mr-2" />
              {language === 'vi' ? 'Dự đoán AI' : 'AI Predictions'}
            </TabsTrigger>
          </TabsList>

          {/* Enhanced Overview Tab */}
          <TabsContent value="overview" className="space-y-8">
            {/* Real-time Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="bg-gradient-to-br from-blue-600/20 to-blue-800/20 border-blue-500/30 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-blue-200 text-sm font-medium">Active Shipments</p>
                        <p className="text-3xl font-bold text-white">{realTimeData.activeShipments.toLocaleString()}</p>
                        <p className="text-green-400 text-sm">+12.5% from last month</p>
                      </div>
                      <Package className="h-12 w-12 text-blue-400" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <Card className="bg-gradient-to-br from-green-600/20 to-green-800/20 border-green-500/30 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-green-200 text-sm font-medium">On-time Delivery</p>
                        <p className="text-3xl font-bold text-white">{realTimeData.onTimeDelivery.toFixed(1)}%</p>
                        <p className="text-green-400 text-sm">+2.3% improvement</p>
                      </div>
                      <Clock className="h-12 w-12 text-green-400" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Card className="bg-gradient-to-br from-purple-600/20 to-purple-800/20 border-purple-500/30 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-purple-200 text-sm font-medium">Fleet Utilization</p>
                        <p className="text-3xl font-bold text-white">{realTimeData.fleetUtilization.toFixed(1)}%</p>
                        <p className="text-green-400 text-sm">+3.1% efficiency</p>
                      </div>
                      <Truck className="h-12 w-12 text-purple-400" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <Card className="bg-gradient-to-br from-yellow-600/20 to-yellow-800/20 border-yellow-500/30 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-yellow-200 text-sm font-medium">Cost Savings</p>
                        <p className="text-3xl font-bold text-white">₫{(realTimeData.costSavings / 1000000).toFixed(1)}M</p>
                        <p className="text-green-400 text-sm">+15.7% this month</p>
                      </div>
                      <DollarSign className="h-12 w-12 text-yellow-400" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

export default NextGenDashboard
