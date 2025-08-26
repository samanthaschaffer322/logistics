'use client'

import React, { useState } from 'react'
import AuthGuard from '@/components/AuthGuard'
import { useLanguage } from '@/contexts/LanguageContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, AreaChart, Area
} from 'recharts'
import { 
  Truck, 
  Users, 
  MapPin, 
  Fuel, 
  Wrench, 
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  Eye,
  Plus,
  Filter,
  Search,
  Activity,
  Target,
  Zap,
  Shield,
  Calendar,
  DollarSign,
  BarChart3,
  PieChart as PieChartIcon
} from 'lucide-react'

interface Vehicle {
  id: string
  licensePlate: string
  type: string
  status: 'active' | 'maintenance' | 'idle'
  driver: string
  location: string
  fuelLevel: number
  mileage: number
  lastService: string
  nextService: string
}

interface Driver {
  id: string
  name: string
  license: string
  status: 'available' | 'driving' | 'rest'
  experience: number
  rating: number
  totalTrips: number
}

const FleetManagementPage: React.FC = () => {
  const { t, language } = useLanguage()
  const [activeTab, setActiveTab] = useState('overview')
  const [searchQuery, setSearchQuery] = useState('')

  // Sample fleet data
  const vehicles: Vehicle[] = [
    {
      id: '1',
      licensePlate: '51A-12345',
      type: 'Container Truck',
      status: 'active',
      driver: 'Nguyen Van A',
      location: 'Cảng Cát Lái',
      fuelLevel: 85,
      mileage: 125000,
      lastService: '2025-07-15',
      nextService: '2025-09-15'
    },
    {
      id: '2',
      licensePlate: '59B-67890',
      type: 'Delivery Van',
      status: 'maintenance',
      driver: 'Tran Thi B',
      location: 'Garage - District 7',
      fuelLevel: 45,
      mileage: 89000,
      lastService: '2025-08-01',
      nextService: '2025-10-01'
    },
    {
      id: '3',
      licensePlate: '50C-11111',
      type: 'Refrigerated Truck',
      status: 'idle',
      driver: 'Le Van C',
      location: 'Depot Binh Duong',
      fuelLevel: 92,
      mileage: 67000,
      lastService: '2025-06-20',
      nextService: '2025-08-20'
    }
  ]

  const drivers: Driver[] = [
    {
      id: '1',
      name: 'Nguyen Van A',
      license: 'B2, C, D',
      status: 'driving',
      experience: 8,
      rating: 4.8,
      totalTrips: 1247
    },
    {
      id: '2',
      name: 'Tran Thi B',
      license: 'B2, C',
      status: 'available',
      experience: 5,
      rating: 4.6,
      totalTrips: 892
    },
    {
      id: '3',
      name: 'Le Van C',
      license: 'B2, C, D, E',
      status: 'rest',
      experience: 12,
      rating: 4.9,
      totalTrips: 2156
    }
  ]

  // Fleet statistics
  const fleetStats = {
    totalVehicles: vehicles.length,
    activeVehicles: vehicles.filter(v => v.status === 'active').length,
    totalDrivers: drivers.length,
    availableDrivers: drivers.filter(d => d.status === 'available').length,
    maintenanceVehicles: vehicles.filter(v => v.status === 'maintenance').length,
    averageFuelLevel: Math.round(vehicles.reduce((sum, v) => sum + v.fuelLevel, 0) / vehicles.length),
    totalMileage: vehicles.reduce((sum, v) => sum + v.mileage, 0),
    averageRating: (drivers.reduce((sum, d) => sum + d.rating, 0) / drivers.length).toFixed(1)
  }

  // Chart data
  const vehicleStatusData = [
    { name: language === 'vi' ? 'Hoạt động' : 'Active', value: fleetStats.activeVehicles, color: '#10b981' },
    { name: language === 'vi' ? 'Bảo trì' : 'Maintenance', value: fleetStats.maintenanceVehicles, color: '#f59e0b' },
    { name: language === 'vi' ? 'Nghỉ' : 'Idle', value: vehicles.filter(v => v.status === 'idle').length, color: '#6b7280' }
  ]

  const performanceData = [
    { month: 'T1', trips: 245, onTime: 92 },
    { month: 'T2', trips: 267, onTime: 94 },
    { month: 'T3', trips: 289, onTime: 91 },
    { month: 'T4', trips: 312, onTime: 95 },
    { month: 'T5', trips: 298, onTime: 93 },
    { month: 'T6', trips: 334, onTime: 96 }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
      case 'driving':
        return 'bg-gradient-to-r from-green-500 to-green-600 text-white'
      case 'maintenance':
        return 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white'
      case 'idle':
      case 'available':
        return 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
      case 'rest':
        return 'bg-gradient-to-r from-gray-500 to-gray-600 text-white'
      default:
        return 'bg-gradient-to-r from-gray-500 to-gray-600 text-white'
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0
    }).format(amount)
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 p-6">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Beautiful Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-teal-500 to-cyan-600 rounded-3xl mb-6 shadow-2xl">
              <Truck className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600 bg-clip-text text-transparent mb-4">
              🚛 {language === 'vi' ? 'Quản lý Đội xe' : 'Fleet Management'}
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              {language === 'vi' ? 'Theo dõi xe & bảo trì thông minh' : 'Smart vehicle tracking & maintenance'}
            </p>
          </div>

          {/* Stunning KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="relative overflow-hidden bg-gradient-to-br from-teal-500 via-teal-600 to-cyan-600 text-white border-0 shadow-2xl hover:shadow-teal-500/25 transition-all duration-300 hover:scale-105">
              <div className="absolute inset-0 bg-gradient-to-r from-teal-400/20 to-transparent"></div>
              <CardContent className="relative p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                    <Truck className="h-8 w-8 text-white" />
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold">{fleetStats.totalVehicles}</div>
                    <div className="text-teal-100 text-sm">{language === 'vi' ? 'Tổng xe' : 'Total Vehicles'}</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-xl font-bold">{fleetStats.activeVehicles} {language === 'vi' ? 'đang hoạt động' : 'active'}</div>
                  <div className="flex items-center text-teal-100">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    <span className="text-sm">+12% {language === 'vi' ? 'so với tháng trước' : 'vs last month'}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 text-white border-0 shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 hover:scale-105">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-transparent"></div>
              <CardContent className="relative p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                    <Users className="h-8 w-8 text-white" />
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold">{fleetStats.totalDrivers}</div>
                    <div className="text-blue-100 text-sm">{language === 'vi' ? 'Tài xế' : 'Drivers'}</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-xl font-bold">{fleetStats.availableDrivers} {language === 'vi' ? 'sẵn sàng' : 'available'}</div>
                  <div className="flex items-center text-blue-100">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    <span className="text-sm">{language === 'vi' ? 'Đánh giá TB:' : 'Avg Rating:'} {fleetStats.averageRating}⭐</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden bg-gradient-to-br from-green-500 via-green-600 to-emerald-600 text-white border-0 shadow-2xl hover:shadow-green-500/25 transition-all duration-300 hover:scale-105">
              <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-transparent"></div>
              <CardContent className="relative p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                    <Fuel className="h-8 w-8 text-white" />
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold">{fleetStats.averageFuelLevel}%</div>
                    <div className="text-green-100 text-sm">{language === 'vi' ? 'Nhiên liệu TB' : 'Avg Fuel'}</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-xl font-bold">{formatCurrency(fleetStats.totalMileage * 2500)}</div>
                  <div className="flex items-center text-green-100">
                    <DollarSign className="h-4 w-4 mr-1" />
                    <span className="text-sm">{language === 'vi' ? 'Chi phí nhiên liệu' : 'Fuel costs'}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden bg-gradient-to-br from-purple-500 via-purple-600 to-pink-600 text-white border-0 shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 hover:scale-105">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-transparent"></div>
              <CardContent className="relative p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                    <Wrench className="h-8 w-8 text-white" />
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold">{fleetStats.maintenanceVehicles}</div>
                    <div className="text-purple-100 text-sm">{language === 'vi' ? 'Đang bảo trì' : 'In Maintenance'}</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-xl font-bold">95% {language === 'vi' ? 'sẵn sàng' : 'uptime'}</div>
                  <div className="flex items-center text-purple-100">
                    <Shield className="h-4 w-4 mr-1" />
                    <span className="text-sm">{language === 'vi' ? 'Hiệu suất cao' : 'High performance'}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          {/* Beautiful Interactive Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
            <TabsList className="grid w-full grid-cols-4 bg-white/80 backdrop-blur-sm shadow-2xl border-2 border-teal-100 rounded-2xl p-2 h-16">
              <TabsTrigger 
                value="overview" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-teal-500 data-[state=active]:to-cyan-500 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl font-semibold transition-all duration-300 h-12"
              >
                <BarChart3 className="h-5 w-5 mr-2" />
                {language === 'vi' ? 'Tổng quan' : 'Overview'}
              </TabsTrigger>
              <TabsTrigger 
                value="vehicles" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl font-semibold transition-all duration-300 h-12"
              >
                <Truck className="h-5 w-5 mr-2" />
                {language === 'vi' ? 'Phương tiện' : 'Vehicles'}
              </TabsTrigger>
              <TabsTrigger 
                value="drivers" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-500 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl font-semibold transition-all duration-300 h-12"
              >
                <Users className="h-5 w-5 mr-2" />
                {language === 'vi' ? 'Tài xế' : 'Drivers'}
              </TabsTrigger>
              <TabsTrigger 
                value="analytics" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl font-semibold transition-all duration-300 h-12"
              >
                <Activity className="h-5 w-5 mr-2" />
                {language === 'vi' ? 'Phân tích' : 'Analytics'}
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Vehicle Status Chart */}
                <Card className="shadow-2xl border-0 bg-gradient-to-br from-white to-teal-50">
                  <CardHeader className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-t-lg">
                    <CardTitle className="flex items-center gap-3 text-xl">
                      <PieChartIcon className="h-6 w-6" />
                      {language === 'vi' ? 'Trạng thái Phương tiện' : 'Vehicle Status'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={vehicleStatusData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, value }) => `${name}: ${value}`}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {vehicleStatusData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Performance Trends */}
                <Card className="shadow-2xl border-0 bg-gradient-to-br from-white to-blue-50">
                  <CardHeader className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-t-lg">
                    <CardTitle className="flex items-center gap-3 text-xl">
                      <BarChart3 className="h-6 w-6" />
                      {language === 'vi' ? 'Hiệu suất Vận chuyển' : 'Performance Trends'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <ResponsiveContainer width="100%" height={300}>
                      <AreaChart data={performanceData}>
                        <defs>
                          <linearGradient id="colorTrips" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis dataKey="month" stroke="#64748b" />
                        <YAxis stroke="#64748b" />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'white', 
                            border: '2px solid #e2e8f0', 
                            borderRadius: '12px',
                            boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
                          }}
                        />
                        <Area type="monotone" dataKey="trips" stroke="#3b82f6" fillOpacity={1} fill="url(#colorTrips)" strokeWidth={3} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Vehicles Tab */}
            <TabsContent value="vehicles" className="space-y-6">
              <Card className="shadow-2xl border-0 bg-gradient-to-br from-white to-blue-50">
                <CardHeader className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-t-lg">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-3 text-xl">
                      <Truck className="h-6 w-6" />
                      {language === 'vi' ? 'Danh sách Phương tiện' : 'Vehicle Fleet'}
                    </CardTitle>
                    <Button className="bg-white/20 hover:bg-white/30 text-white border-white/30">
                      <Plus className="h-4 w-4 mr-2" />
                      {language === 'vi' ? 'Thêm xe' : 'Add Vehicle'}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {vehicles.map((vehicle) => (
                      <Card key={vehicle.id} className="border-2 border-blue-100 hover:shadow-lg transition-all duration-300 bg-gradient-to-r from-white to-blue-50">
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                                  <Truck className="h-6 w-6" />
                                </div>
                                <div>
                                  <h3 className="font-bold text-xl text-gray-800">{vehicle.licensePlate}</h3>
                                  <p className="text-gray-600">{vehicle.type}</p>
                                </div>
                                <Badge className={`${getStatusColor(vehicle.status)} shadow-lg`}>
                                  {vehicle.status === 'active' ? (language === 'vi' ? 'Hoạt động' : 'Active') :
                                   vehicle.status === 'maintenance' ? (language === 'vi' ? 'Bảo trì' : 'Maintenance') :
                                   (language === 'vi' ? 'Nghỉ' : 'Idle')}
                                </Badge>
                              </div>
                              
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                <div>
                                  <span className="text-gray-600 font-medium">{language === 'vi' ? 'Tài xế:' : 'Driver:'}</span>
                                  <p className="font-semibold text-gray-800">{vehicle.driver}</p>
                                </div>
                                <div>
                                  <span className="text-gray-600 font-medium">{language === 'vi' ? 'Vị trí:' : 'Location:'}</span>
                                  <p className="font-semibold text-gray-800">{vehicle.location}</p>
                                </div>
                                <div>
                                  <span className="text-gray-600 font-medium">{language === 'vi' ? 'Nhiên liệu:' : 'Fuel:'}</span>
                                  <p className="font-semibold text-blue-600">{vehicle.fuelLevel}%</p>
                                </div>
                                <div>
                                  <span className="text-gray-600 font-medium">{language === 'vi' ? 'Km đã đi:' : 'Mileage:'}</span>
                                  <p className="font-semibold text-gray-800">{vehicle.mileage.toLocaleString()} km</p>
                                </div>
                              </div>
                              
                              <div className="mt-4 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
                                <div className="flex justify-between text-sm">
                                  <span className="text-gray-600">{language === 'vi' ? 'Bảo trì cuối:' : 'Last Service:'}</span>
                                  <span className="font-medium">{new Date(vehicle.lastService).toLocaleDateString('vi-VN')}</span>
                                </div>
                                <div className="flex justify-between text-sm mt-1">
                                  <span className="text-gray-600">{language === 'vi' ? 'Bảo trì tiếp:' : 'Next Service:'}</span>
                                  <span className="font-medium text-orange-600">{new Date(vehicle.nextService).toLocaleDateString('vi-VN')}</span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex flex-col gap-2 ml-6">
                              <Button className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 shadow-lg">
                                <Eye className="h-4 w-4 mr-2" />
                                {language === 'vi' ? 'Chi tiết' : 'Details'}
                              </Button>
                              <Button variant="outline" className="border-blue-300 text-blue-700 hover:bg-blue-50">
                                <MapPin className="h-4 w-4 mr-2" />
                                {language === 'vi' ? 'Theo dõi' : 'Track'}
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Drivers Tab */}
            <TabsContent value="drivers" className="space-y-6">
              <Card className="shadow-2xl border-0 bg-gradient-to-br from-white to-green-50">
                <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-t-lg">
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <Users className="h-6 w-6" />
                    {language === 'vi' ? 'Đội ngũ Tài xế' : 'Driver Team'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {drivers.map((driver) => (
                      <Card key={driver.id} className="border-2 border-green-100 hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-white to-green-50">
                        <CardContent className="p-6">
                          <div className="text-center mb-4">
                            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-3 shadow-lg">
                              {driver.name.charAt(0)}
                            </div>
                            <h3 className="font-bold text-lg text-gray-800">{driver.name}</h3>
                            <Badge className={`${getStatusColor(driver.status)} shadow-lg mt-2`}>
                              {driver.status === 'driving' ? (language === 'vi' ? 'Đang lái' : 'Driving') :
                               driver.status === 'available' ? (language === 'vi' ? 'Sẵn sàng' : 'Available') :
                               (language === 'vi' ? 'Nghỉ ngơi' : 'Resting')}
                            </Badge>
                          </div>
                          
                          <div className="space-y-3">
                            <div className="flex justify-between items-center p-2 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
                              <span className="text-gray-600 text-sm">{language === 'vi' ? 'Bằng lái:' : 'License:'}</span>
                              <span className="font-semibold text-green-600">{driver.license}</span>
                            </div>
                            <div className="flex justify-between items-center p-2 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
                              <span className="text-gray-600 text-sm">{language === 'vi' ? 'Kinh nghiệm:' : 'Experience:'}</span>
                              <span className="font-semibold text-blue-600">{driver.experience} {language === 'vi' ? 'năm' : 'years'}</span>
                            </div>
                            <div className="flex justify-between items-center p-2 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg">
                              <span className="text-gray-600 text-sm">{language === 'vi' ? 'Đánh giá:' : 'Rating:'}</span>
                              <span className="font-semibold text-orange-600">{driver.rating}⭐</span>
                            </div>
                            <div className="flex justify-between items-center p-2 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
                              <span className="text-gray-600 text-sm">{language === 'vi' ? 'Chuyến đi:' : 'Total Trips:'}</span>
                              <span className="font-semibold text-purple-600">{driver.totalTrips.toLocaleString()}</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="shadow-2xl border-0 bg-gradient-to-br from-white to-purple-50">
                  <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-t-lg">
                    <CardTitle className="flex items-center gap-3 text-xl">
                      <Activity className="h-6 w-6" />
                      {language === 'vi' ? 'Hiệu suất Đội xe' : 'Fleet Performance'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-6">
                      <div className="text-center p-6 bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl">
                        <h3 className="text-3xl font-bold text-purple-600 mb-2">94.5%</h3>
                        <p className="text-gray-700 font-medium">{language === 'vi' ? 'Tỷ lệ đúng giờ' : 'On-time Performance'}</p>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-gray-700">{language === 'vi' ? 'Hiệu suất nhiên liệu' : 'Fuel Efficiency'}</span>
                          <span className="text-lg font-bold text-green-600">8.2L/100km</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div className="bg-gradient-to-r from-green-500 to-emerald-500 h-3 rounded-full" style={{ width: '82%' }}></div>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-gray-700">{language === 'vi' ? 'Độ tin cậy' : 'Reliability'}</span>
                          <span className="text-lg font-bold text-blue-600">96.8%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div className="bg-gradient-to-r from-blue-500 to-indigo-500 h-3 rounded-full" style={{ width: '96.8%' }}></div>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-gray-700">{language === 'vi' ? 'Hài lòng khách hàng' : 'Customer Satisfaction'}</span>
                          <span className="text-lg font-bold text-orange-600">4.7⭐</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div className="bg-gradient-to-r from-orange-500 to-red-500 h-3 rounded-full" style={{ width: '94%' }}></div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-2xl border-0 bg-gradient-to-br from-white to-orange-50">
                  <CardHeader className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-t-lg">
                    <CardTitle className="flex items-center gap-3 text-xl">
                      <Target className="h-6 w-6" />
                      {language === 'vi' ? 'Mục tiêu & KPI' : 'Goals & KPIs'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-6">
                      <div className="text-center p-6 bg-gradient-to-r from-orange-100 to-red-100 rounded-xl">
                        <h3 className="text-3xl font-bold text-orange-600 mb-2">{formatCurrency(125000000)}</h3>
                        <p className="text-gray-700 font-medium">{language === 'vi' ? 'Doanh thu tháng này' : 'Monthly Revenue'}</p>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
                          <h4 className="text-2xl font-bold text-green-600">1,247</h4>
                          <p className="text-sm text-gray-600">{language === 'vi' ? 'Chuyến đi' : 'Total Trips'}</p>
                        </div>
                        <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
                          <h4 className="text-2xl font-bold text-blue-600">98.2%</h4>
                          <p className="text-sm text-gray-600">{language === 'vi' ? 'Hoàn thành' : 'Completion'}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AuthGuard>
  )
}

export default FleetManagementPage
