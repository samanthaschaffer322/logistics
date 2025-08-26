'use client'

import React, { useState, useEffect } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, AreaChart, Area, RadialBarChart, RadialBar
} from 'recharts'
import { 
  TrendingUp, 
  TrendingDown,
  DollarSign, 
  Truck, 
  Package, 
  Clock,
  Target,
  Activity,
  Users,
  MapPin,
  Fuel,
  AlertTriangle,
  CheckCircle,
  Download,
  FileText,
  BarChart3,
  PieChart as PieChartIcon,
  Calendar,
  Globe,
  Zap,
  Shield
} from 'lucide-react'

interface AnalyticsData {
  revenue: number
  costs: number
  profit: number
  deliveries: number
  onTimeRate: number
  fuelEfficiency: number
  customerSatisfaction: number
  activeVehicles: number
}

interface ChartData {
  name: string
  value: number
  change?: number
  color?: string
}

const EnhancedAnalyticsDashboard: React.FC = () => {
  const { t, language } = useLanguage()
  const [activeTab, setActiveTab] = useState('overview')
  const [timeRange, setTimeRange] = useState('month')
  const [isLoading, setIsLoading] = useState(false)

  // Sample analytics data
  const analyticsData: AnalyticsData = {
    revenue: 2450000000, // 2.45 billion VND
    costs: 1890000000,   // 1.89 billion VND
    profit: 560000000,   // 560 million VND
    deliveries: 1247,
    onTimeRate: 94.2,
    fuelEfficiency: 87.5,
    customerSatisfaction: 4.8,
    activeVehicles: 156
  }

  // Performance metrics data
  const performanceData: ChartData[] = [
    { name: language === 'vi' ? 'T1' : 'Jan', value: 2100000000, change: 12.5 },
    { name: language === 'vi' ? 'T2' : 'Feb', value: 2250000000, change: 7.1 },
    { name: language === 'vi' ? 'T3' : 'Mar', value: 2180000000, change: -3.1 },
    { name: language === 'vi' ? 'T4' : 'Apr', value: 2350000000, change: 7.8 },
    { name: language === 'vi' ? 'T5' : 'May', value: 2420000000, change: 3.0 },
    { name: language === 'vi' ? 'T6' : 'Jun', value: 2450000000, change: 1.2 }
  ]

  // Route efficiency data
  const routeData: ChartData[] = [
    { name: 'TP.HCM - Hà Nội', value: 92, color: '#3b82f6' },
    { name: 'TP.HCM - Đà Nẵng', value: 88, color: '#10b981' },
    { name: 'TP.HCM - Cần Thơ', value: 95, color: '#f59e0b' },
    { name: 'Hà Nội - Hải Phòng', value: 91, color: '#ef4444' },
    { name: 'Đà Nẵng - Huế', value: 89, color: '#8b5cf6' }
  ]

  // Vehicle performance data
  const vehicleData: ChartData[] = [
    { name: language === 'vi' ? 'Container' : 'Container', value: 45, color: '#3b82f6' },
    { name: language === 'vi' ? 'Xe tải' : 'Truck', value: 32, color: '#10b981' },
    { name: language === 'vi' ? 'Van' : 'Van', value: 28, color: '#f59e0b' },
    { name: language === 'vi' ? 'Xe đông lạnh' : 'Refrigerated', value: 15, color: '#ef4444' }
  ]

  // KPI data for radial charts
  const kpiData = [
    { name: 'On-time', value: analyticsData.onTimeRate, fill: '#10b981' },
    { name: 'Efficiency', value: analyticsData.fuelEfficiency, fill: '#3b82f6' },
    { name: 'Satisfaction', value: analyticsData.customerSatisfaction * 20, fill: '#f59e0b' }
  ]

  const formatCurrency = (value: number) => {
    if (value >= 1000000000) {
      return `${(value / 1000000000).toFixed(1)}B ₫`
    } else if (value >= 1000000) {
      return `${(value / 1000000).toFixed(0)}M ₫`
    }
    return `${value.toLocaleString('vi-VN')} ₫`
  }

  const handleExport = (type: 'pdf' | 'excel') => {
    setIsLoading(true)
    // Simulate export process
    setTimeout(() => {
      setIsLoading(false)
      alert(language === 'vi' 
        ? `Xuất ${type.toUpperCase()} thành công!` 
        : `${type.toUpperCase()} exported successfully!`
      )
    }, 2000)
  }

  return (
    <div className="space-y-6 p-6 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {t('automation.title')}
          </h1>
          <p className="text-gray-600 mt-1">{t('automation.subtitle')}</p>
        </div>
        
        <div className="flex items-center gap-3">
          <select 
            value={timeRange} 
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="week">{language === 'vi' ? 'Tuần này' : 'This Week'}</option>
            <option value="month">{language === 'vi' ? 'Tháng này' : 'This Month'}</option>
            <option value="quarter">{language === 'vi' ? 'Quý này' : 'This Quarter'}</option>
            <option value="year">{language === 'vi' ? 'Năm này' : 'This Year'}</option>
          </select>
          
          <Button 
            onClick={() => handleExport('pdf')} 
            disabled={isLoading}
            className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
          >
            <FileText className="h-4 w-4 mr-2" />
            {t('automation.exportPDF')}
          </Button>
          
          <Button 
            onClick={() => handleExport('excel')} 
            disabled={isLoading}
            className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
          >
            <Download className="h-4 w-4 mr-2" />
            {t('automation.exportExcel')}
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-lg hover:shadow-xl transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">
                  {language === 'vi' ? 'Doanh thu' : 'Revenue'}
                </p>
                <p className="text-2xl font-bold">{formatCurrency(analyticsData.revenue)}</p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  <span className="text-sm">+12.5%</span>
                </div>
              </div>
              <DollarSign className="h-8 w-8 text-blue-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0 shadow-lg hover:shadow-xl transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">
                  {language === 'vi' ? 'Lợi nhuận' : 'Profit'}
                </p>
                <p className="text-2xl font-bold">{formatCurrency(analyticsData.profit)}</p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  <span className="text-sm">+8.3%</span>
                </div>
              </div>
              <Target className="h-8 w-8 text-green-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 shadow-lg hover:shadow-xl transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium">
                  {language === 'vi' ? 'Giao hàng' : 'Deliveries'}
                </p>
                <p className="text-2xl font-bold">{analyticsData.deliveries.toLocaleString()}</p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  <span className="text-sm">+15.2%</span>
                </div>
              </div>
              <Package className="h-8 w-8 text-purple-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0 shadow-lg hover:shadow-xl transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm font-medium">
                  {language === 'vi' ? 'Đúng giờ' : 'On-time Rate'}
                </p>
                <p className="text-2xl font-bold">{analyticsData.onTimeRate}%</p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  <span className="text-sm">+2.1%</span>
                </div>
              </div>
              <Clock className="h-8 w-8 text-orange-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-white shadow-sm border">
          <TabsTrigger value="overview" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
            <BarChart3 className="h-4 w-4 mr-2" />
            {language === 'vi' ? 'Tổng quan' : 'Overview'}
          </TabsTrigger>
          <TabsTrigger value="performance" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
            <Activity className="h-4 w-4 mr-2" />
            {language === 'vi' ? 'Hiệu suất' : 'Performance'}
          </TabsTrigger>
          <TabsTrigger value="routes" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
            <MapPin className="h-4 w-4 mr-2" />
            {language === 'vi' ? 'Tuyến đường' : 'Routes'}
          </TabsTrigger>
          <TabsTrigger value="vehicles" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
            <Truck className="h-4 w-4 mr-2" />
            {language === 'vi' ? 'Phương tiện' : 'Vehicles'}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-blue-600" />
                  {language === 'vi' ? 'Xu hướng Doanh thu' : 'Revenue Trend'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis tickFormatter={(value) => formatCurrency(value)} />
                    <Tooltip formatter={(value) => [formatCurrency(Number(value)), language === 'vi' ? 'Doanh thu' : 'Revenue']} />
                    <Area type="monotone" dataKey="value" stroke="#3b82f6" fill="url(#colorRevenue)" />
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-green-600" />
                  {language === 'vi' ? 'Chỉ số KPI' : 'KPI Metrics'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RadialBarChart cx="50%" cy="50%" innerRadius="20%" outerRadius="90%" data={kpiData}>
                    <RadialBar dataKey="value" cornerRadius={10} fill="#8884d8" />
                    <Tooltip />
                  </RadialBarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-purple-600" />
                {language === 'vi' ? 'Hiệu suất theo Tháng' : 'Monthly Performance'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis tickFormatter={(value) => formatCurrency(value)} />
                  <Tooltip formatter={(value) => [formatCurrency(Number(value)), language === 'vi' ? 'Doanh thu' : 'Revenue']} />
                  <Line type="monotone" dataKey="value" stroke="#8b5cf6" strokeWidth={3} dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="routes" className="space-y-6">
          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-orange-600" />
                {language === 'vi' ? 'Hiệu quả Tuyến đường' : 'Route Efficiency'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={routeData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value}%`, language === 'vi' ? 'Hiệu quả' : 'Efficiency']} />
                  <Bar dataKey="value" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vehicles" className="space-y-6">
          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5 text-red-600" />
                {language === 'vi' ? 'Phân bố Phương tiện' : 'Vehicle Distribution'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                  <Pie
                    data={vehicleData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {vehicleData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-lg border-0 bg-gradient-to-br from-green-50 to-green-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-green-800">
                  {t('automation.summary')}
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
                  {t('automation.tracking')}
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
                  {t('automation.monitoring')}
                </h3>
                <p className="text-purple-600 mt-2">
                  {language === 'vi' ? 'Giám sát thời gian thực' : 'Real-time monitoring active'}
                </p>
              </div>
              <Activity className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default EnhancedAnalyticsDashboard
