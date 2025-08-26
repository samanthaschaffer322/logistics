'use client'

import React, { useState } from 'react'
import AuthGuard from '@/components/AuthGuard'
import { useLanguage } from '@/contexts/LanguageContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, AreaChart, Area
} from 'recharts'
import { 
  Activity,
  BarChart3,
  TrendingUp,
  DollarSign,
  Package,
  Truck,
  Clock,
  Target,
  Users,
  MapPin,
  Zap,
  CheckCircle,
  AlertTriangle,
  Download,
  FileText,
  RefreshCw,
  Calendar,
  Globe
} from 'lucide-react'

const LogisticsOperationsPage: React.FC = () => {
  const { t, language } = useLanguage()
  const [activeTab, setActiveTab] = useState('overview')
  const [isExporting, setIsExporting] = useState(false)

  // Sample data for charts
  const revenueData = [
    { month: language === 'vi' ? 'T1' : 'Jan', revenue: 2100000000, profit: 420000000 },
    { month: language === 'vi' ? 'T2' : 'Feb', revenue: 2250000000, profit: 450000000 },
    { month: language === 'vi' ? 'T3' : 'Mar', revenue: 2180000000, profit: 436000000 },
    { month: language === 'vi' ? 'T4' : 'Apr', revenue: 2350000000, profit: 470000000 },
    { month: language === 'vi' ? 'T5' : 'May', revenue: 2420000000, profit: 484000000 },
    { month: language === 'vi' ? 'T6' : 'Jun', revenue: 2450000000, profit: 490000000 }
  ]

  const performanceData = [
    { name: language === 'vi' ? 'Đúng giờ' : 'On-time', value: 94.2, color: '#10b981' },
    { name: language === 'vi' ? 'Chậm' : 'Delayed', value: 4.8, color: '#f59e0b' },
    { name: language === 'vi' ? 'Hủy' : 'Cancelled', value: 1.0, color: '#ef4444' }
  ]

  const routeData = [
    { route: 'TP.HCM - Hà Nội', efficiency: 92, trips: 245 },
    { route: 'TP.HCM - Đà Nẵng', efficiency: 88, trips: 189 },
    { route: 'TP.HCM - Cần Thơ', efficiency: 95, trips: 156 },
    { route: 'Hà Nội - Hải Phòng', efficiency: 91, trips: 134 },
    { route: 'Đà Nẵng - Huế', efficiency: 89, trips: 98 }
  ]

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000000) {
      return `${(amount / 1000000000).toFixed(1)}B ₫`
    } else if (amount >= 1000000) {
      return `${(amount / 1000000).toFixed(0)}M ₫`
    }
    return `${amount.toLocaleString('vi-VN')} ₫`
  }

  const handleExport = (type: 'pdf' | 'excel') => {
    setIsExporting(true)
    
    // Show immediate feedback
    alert(language === 'vi' 
      ? `📊 Đang chuẩn bị xuất ${type.toUpperCase()}...\n⏳ Vui lòng đợi trong giây lát.` 
      : `📊 Preparing ${type.toUpperCase()} export...\n⏳ Please wait a moment.`
    )
    
    setTimeout(() => {
      setIsExporting(false)
      
      // Create and download file
      const data = `LogiAI Analytics Report - ${type.toUpperCase()}\n` +
                  `Generated: ${new Date().toLocaleString('vi-VN')}\n\n` +
                  `Revenue: ${formatCurrency(2450000000)}\n` +
                  `Profit: ${formatCurrency(490000000)}\n` +
                  `Deliveries: 1,247\n` +
                  `On-time Rate: 94.2%\n\n` +
                  `Vietnamese Logistics Performance Report\n` +
                  `© LogiAI - Smart Logistics Management`
      
      const blob = new Blob([data], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `logiai-analytics-${type}-${new Date().toISOString().split('T')[0]}.txt`
      link.click()
      URL.revokeObjectURL(url)
      
      alert(language === 'vi' 
        ? `✅ Xuất ${type.toUpperCase()} thành công!\n📁 File đã được tải xuống.` 
        : `✅ ${type.toUpperCase()} exported successfully!\n📁 File has been downloaded.`
      )
    }, 2000)
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 p-6">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Beautiful Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-orange-500 to-red-600 rounded-3xl mb-6 shadow-2xl">
              <Activity className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 bg-clip-text text-transparent mb-4">
              📊 {language === 'vi' ? 'Bảng điều khiển phân tích' : 'Analytics Dashboard'}
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              {language === 'vi' ? 'Số liệu hiệu suất & KPI' : 'Performance Metrics & KPIs'}
            </p>
          </div>

          {/* Export Buttons */}
          <div className="flex justify-center gap-4 mb-8">
            <Button 
              onClick={() => handleExport('pdf')} 
              disabled={isExporting}
              className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-lg"
            >
              <FileText className="h-4 w-4 mr-2" />
              {language === 'vi' ? 'Xuất PDF' : 'Export PDF'}
            </Button>
            
            <Button 
              onClick={() => handleExport('excel')} 
              disabled={isExporting}
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-lg"
            >
              <Download className="h-4 w-4 mr-2" />
              {language === 'vi' ? 'Xuất Excel' : 'Export Excel'}
            </Button>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="relative overflow-hidden bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 text-white border-0 shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 hover:scale-105">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-transparent"></div>
              <CardContent className="relative p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                    <DollarSign className="h-8 w-8 text-white" />
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold">{formatCurrency(2450000000)}</div>
                    <div className="text-blue-100 text-sm">{language === 'vi' ? 'Doanh thu' : 'Revenue'}</div>
                  </div>
                </div>
                <div className="flex items-center text-blue-100">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  <span className="text-sm">+12.5% {language === 'vi' ? 'so với tháng trước' : 'vs last month'}</span>
                </div>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden bg-gradient-to-br from-green-500 via-green-600 to-emerald-600 text-white border-0 shadow-2xl hover:shadow-green-500/25 transition-all duration-300 hover:scale-105">
              <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-transparent"></div>
              <CardContent className="relative p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                    <Target className="h-8 w-8 text-white" />
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold">{formatCurrency(490000000)}</div>
                    <div className="text-green-100 text-sm">{language === 'vi' ? 'Lợi nhuận' : 'Profit'}</div>
                  </div>
                </div>
                <div className="flex items-center text-green-100">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  <span className="text-sm">+8.3% {language === 'vi' ? 'so với tháng trước' : 'vs last month'}</span>
                </div>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden bg-gradient-to-br from-purple-500 via-purple-600 to-pink-600 text-white border-0 shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 hover:scale-105">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-transparent"></div>
              <CardContent className="relative p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                    <Package className="h-8 w-8 text-white" />
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold">1,247</div>
                    <div className="text-purple-100 text-sm">{language === 'vi' ? 'Giao hàng' : 'Deliveries'}</div>
                  </div>
                </div>
                <div className="flex items-center text-purple-100">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  <span className="text-sm">+15.2% {language === 'vi' ? 'so với tháng trước' : 'vs last month'}</span>
                </div>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden bg-gradient-to-br from-orange-500 via-orange-600 to-red-600 text-white border-0 shadow-2xl hover:shadow-orange-500/25 transition-all duration-300 hover:scale-105">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-400/20 to-transparent"></div>
              <CardContent className="relative p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                    <Clock className="h-8 w-8 text-white" />
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold">94.2%</div>
                    <div className="text-orange-100 text-sm">{language === 'vi' ? 'Đúng giờ' : 'On-time Rate'}</div>
                  </div>
                </div>
                <div className="flex items-center text-orange-100">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  <span className="text-sm">+2.1% {language === 'vi' ? 'so với tháng trước' : 'vs last month'}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts Section */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
            <TabsList className="grid w-full grid-cols-3 bg-white/80 backdrop-blur-sm shadow-2xl border-2 border-orange-100 rounded-2xl p-2 h-16">
              <TabsTrigger 
                value="overview" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl font-semibold transition-all duration-300 h-12"
              >
                <BarChart3 className="h-5 w-5 mr-2" />
                {language === 'vi' ? 'Tổng quan' : 'Overview'}
              </TabsTrigger>
              <TabsTrigger 
                value="performance" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl font-semibold transition-all duration-300 h-12"
              >
                <Activity className="h-5 w-5 mr-2" />
                {language === 'vi' ? 'Hiệu suất' : 'Performance'}
              </TabsTrigger>
              <TabsTrigger 
                value="routes" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl font-semibold transition-all duration-300 h-12"
              >
                <MapPin className="h-5 w-5 mr-2" />
                {language === 'vi' ? 'Tuyến đường' : 'Routes'}
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="shadow-2xl border-0 bg-gradient-to-br from-white to-orange-50">
                  <CardHeader className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-t-lg">
                    <CardTitle className="flex items-center gap-3 text-xl">
                      <BarChart3 className="h-6 w-6" />
                      {language === 'vi' ? 'Xu hướng Doanh thu' : 'Revenue Trends'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <ResponsiveContainer width="100%" height={300}>
                      <AreaChart data={revenueData}>
                        <defs>
                          <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis dataKey="month" stroke="#64748b" />
                        <YAxis tickFormatter={(value) => formatCurrency(value)} stroke="#64748b" />
                        <Tooltip formatter={(value) => [formatCurrency(Number(value)), language === 'vi' ? 'Doanh thu' : 'Revenue']} />
                        <Area type="monotone" dataKey="revenue" stroke="#3b82f6" fillOpacity={1} fill="url(#colorRevenue)" strokeWidth={3} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card className="shadow-2xl border-0 bg-gradient-to-br from-white to-purple-50">
                  <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-t-lg">
                    <CardTitle className="flex items-center gap-3 text-xl">
                      <Target className="h-6 w-6" />
                      {language === 'vi' ? 'Hiệu suất Giao hàng' : 'Delivery Performance'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={performanceData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, value }) => `${name}: ${value}%`}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {performanceData.map((entry, index) => (
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

            {/* Performance Tab */}
            <TabsContent value="performance" className="space-y-6">
              <Card className="shadow-2xl border-0 bg-gradient-to-br from-white to-purple-50">
                <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-t-lg">
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <Activity className="h-6 w-6" />
                    {language === 'vi' ? 'Hiệu suất theo Tháng' : 'Monthly Performance'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={revenueData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="month" stroke="#64748b" />
                      <YAxis tickFormatter={(value) => formatCurrency(value)} stroke="#64748b" />
                      <Tooltip formatter={(value) => [formatCurrency(Number(value)), language === 'vi' ? 'Doanh thu' : 'Revenue']} />
                      <Line type="monotone" dataKey="revenue" stroke="#8b5cf6" strokeWidth={3} dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 6 }} />
                      <Line type="monotone" dataKey="profit" stroke="#10b981" strokeWidth={3} dot={{ fill: '#10b981', strokeWidth: 2, r: 6 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Routes Tab */}
            <TabsContent value="routes" className="space-y-6">
              <Card className="shadow-2xl border-0 bg-gradient-to-br from-white to-blue-50">
                <CardHeader className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-t-lg">
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <MapPin className="h-6 w-6" />
                    {language === 'vi' ? 'Hiệu quả Tuyến đường' : 'Route Efficiency'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={routeData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="route" stroke="#64748b" />
                      <YAxis stroke="#64748b" />
                      <Tooltip formatter={(value) => [`${value}%`, language === 'vi' ? 'Hiệu quả' : 'Efficiency']} />
                      <Bar dataKey="efficiency" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="shadow-lg border-0 bg-gradient-to-br from-green-50 to-green-100">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-green-800">
                      {language === 'vi' ? 'Tóm tắt Điều hành' : 'Operations Summary'}
                    </h3>
                    <p className="text-green-600 mt-2">
                      {language === 'vi' ? 'Hệ thống hoạt động bình thường' : 'System operating normally'}
                    </p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0 bg-gradient-to-br from-blue-50 to-blue-100">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-blue-800">
                      {language === 'vi' ? 'Theo dõi lô hàng' : 'Shipment Tracking'}
                    </h3>
                    <p className="text-blue-600 mt-2">
                      {language === 'vi' ? 'Theo dõi 1,247 lô hàng' : 'Tracking 1,247 shipments'}
                    </p>
                  </div>
                  <Package className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0 bg-gradient-to-br from-purple-50 to-purple-100">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-purple-800">
                      {language === 'vi' ? 'Giám sát lô hàng thời gian thực' : 'Real-time Monitoring'}
                    </h3>
                    <p className="text-purple-600 mt-2">
                      {language === 'vi' ? 'Giám sát thời gian thực hoạt động' : 'Real-time monitoring active'}
                    </p>
                  </div>
                  <Activity className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AuthGuard>
  )
}

export default LogisticsOperationsPage
