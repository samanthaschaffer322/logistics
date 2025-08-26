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
  Package,
  Truck,
  MapPin,
  Clock,
  CheckCircle,
  AlertTriangle,
  Search,
  Filter,
  Plus,
  Eye,
  Navigation,
  Calendar,
  DollarSign,
  User,
  Phone,
  Mail,
  FileText,
  BarChart3
} from 'lucide-react'

interface Shipment {
  id: string
  trackingNumber: string
  client: string
  company: string
  origin: string
  destination: string
  status: 'in-transit' | 'delivered' | 'pending' | 'delayed'
  value: number
  weight: number
  estimatedDelivery: string
  actualDelivery?: string
  driver: string
  vehicle: string
  progress: number
}

const ShipmentManagementPage: React.FC = () => {
  const { language } = useLanguage()
  const [activeTab, setActiveTab] = useState('overview')
  const [searchQuery, setSearchQuery] = useState('')

  // Realistic Vietnamese logistics shipment data
  const shipments: Shipment[] = [
    {
      id: '1',
      trackingNumber: 'VN-LOG-2025-001247',
      client: 'Nguyen Van Duc',
      company: 'Duc Thanh Import Export Co., Ltd',
      origin: 'Cảng Cát Lái, TP.HCM',
      destination: 'Kho Nội Bài, Hà Nội',
      status: 'in-transit',
      value: 125000000, // 125 million VND
      weight: 15.5, // tons
      estimatedDelivery: '2025-08-27',
      driver: 'Tran Van Minh',
      vehicle: '51A-12345',
      progress: 65
    },
    {
      id: '2',
      trackingNumber: 'VN-LOG-2025-001248',
      client: 'Le Thi Hong',
      company: 'Hong Phat Trading Corporation',
      origin: 'Khu CN Binh Duong',
      destination: 'Cảng Đà Nẵng',
      status: 'delivered',
      value: 89500000, // 89.5 million VND
      weight: 12.3,
      estimatedDelivery: '2025-08-25',
      actualDelivery: '2025-08-25',
      driver: 'Pham Thanh Son',
      vehicle: '59B-67890',
      progress: 100
    },
    {
      id: '3',
      trackingNumber: 'VN-LOG-2025-001249',
      client: 'Vo Minh Tam',
      company: 'Tam Thinh Logistics Services',
      origin: 'Cảng Hải Phòng',
      destination: 'KCN Long Biên, Hà Nội',
      status: 'pending',
      value: 67800000, // 67.8 million VND
      weight: 8.7,
      estimatedDelivery: '2025-08-29',
      driver: 'Nguyen Duc Huy',
      vehicle: '30C-11111',
      progress: 0
    },
    {
      id: '4',
      trackingNumber: 'VN-LOG-2025-001250',
      client: 'Dang Thi Mai',
      company: 'Mai Phuong International Trade',
      origin: 'Cảng Cần Thơ',
      destination: 'Chợ Lớn, TP.HCM',
      status: 'delayed',
      value: 156200000, // 156.2 million VND
      weight: 22.1,
      estimatedDelivery: '2025-08-26',
      driver: 'Le Van Duc',
      vehicle: '50D-22222',
      progress: 35
    },
    {
      id: '5',
      trackingNumber: 'VN-LOG-2025-001251',
      client: 'Hoang Van Phuc',
      company: 'Phuc Thinh Manufacturing Ltd',
      origin: 'KCN Đồng Nai',
      destination: 'Cảng Quy Nhon',
      status: 'in-transit',
      value: 198700000, // 198.7 million VND
      weight: 18.9,
      estimatedDelivery: '2025-08-28',
      driver: 'Bui Thanh Tung',
      vehicle: '61E-33333',
      progress: 78
    }
  ]

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-gradient-to-r from-green-500 to-green-600 text-white'
      case 'in-transit':
        return 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
      case 'pending':
        return 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white'
      case 'delayed':
        return 'bg-gradient-to-r from-red-500 to-red-600 text-white'
      default:
        return 'bg-gradient-to-r from-gray-500 to-gray-600 text-white'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'delivered':
        return language === 'vi' ? 'Đã giao' : 'Delivered'
      case 'in-transit':
        return language === 'vi' ? 'Đang vận chuyển' : 'In Transit'
      case 'pending':
        return language === 'vi' ? 'Chờ xử lý' : 'Pending'
      case 'delayed':
        return language === 'vi' ? 'Chậm trễ' : 'Delayed'
      default:
        return status
    }
  }

  // Calculate statistics
  const stats = {
    total: shipments.length,
    inTransit: shipments.filter(s => s.status === 'in-transit').length,
    delivered: shipments.filter(s => s.status === 'delivered').length,
    delayed: shipments.filter(s => s.status === 'delayed').length,
    totalValue: shipments.reduce((sum, s) => sum + s.value, 0),
    totalWeight: shipments.reduce((sum, s) => sum + s.weight, 0)
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 p-6">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Beautiful Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-3xl mb-6 shadow-2xl">
              <Package className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
              📦 {language === 'vi' ? 'Quản lý Lô hàng' : 'Shipment Management'}
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              {language === 'vi' ? 'Theo dõi và quản lý lô hàng thông minh với giao diện đẹp' : 'Smart shipment tracking and management with beautiful interface'}
            </p>
          </div>

          {/* Stunning KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="relative overflow-hidden bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 text-white border-0 shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 hover:scale-105">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-transparent"></div>
              <CardContent className="relative p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                    <Package className="h-8 w-8 text-white" />
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold">{stats.total}</div>
                    <div className="text-blue-100 text-sm">{language === 'vi' ? 'Tổng lô hàng' : 'Total Shipments'}</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-xl font-bold">{formatCurrency(stats.totalValue)}</div>
                  <div className="flex items-center text-blue-100">
                    <DollarSign className="h-4 w-4 mr-1" />
                    <span className="text-sm">{language === 'vi' ? 'Tổng giá trị' : 'Total Value'}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden bg-gradient-to-br from-green-500 via-green-600 to-emerald-600 text-white border-0 shadow-2xl hover:shadow-green-500/25 transition-all duration-300 hover:scale-105">
              <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-transparent"></div>
              <CardContent className="relative p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                    <CheckCircle className="h-8 w-8 text-white" />
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold">{stats.delivered}</div>
                    <div className="text-green-100 text-sm">{language === 'vi' ? 'Đã giao' : 'Delivered'}</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-xl font-bold">{Math.round((stats.delivered / stats.total) * 100)}%</div>
                  <div className="flex items-center text-green-100">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    <span className="text-sm">{language === 'vi' ? 'Tỷ lệ thành công' : 'Success Rate'}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden bg-gradient-to-br from-orange-500 via-orange-600 to-red-600 text-white border-0 shadow-2xl hover:shadow-orange-500/25 transition-all duration-300 hover:scale-105">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-400/20 to-transparent"></div>
              <CardContent className="relative p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                    <Truck className="h-8 w-8 text-white" />
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold">{stats.inTransit}</div>
                    <div className="text-orange-100 text-sm">{language === 'vi' ? 'Đang vận chuyển' : 'In Transit'}</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-xl font-bold">{stats.totalWeight.toFixed(1)} {language === 'vi' ? 'tấn' : 'tons'}</div>
                  <div className="flex items-center text-orange-100">
                    <Package className="h-4 w-4 mr-1" />
                    <span className="text-sm">{language === 'vi' ? 'Tổng trọng lượng' : 'Total Weight'}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden bg-gradient-to-br from-purple-500 via-purple-600 to-pink-600 text-white border-0 shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 hover:scale-105">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-transparent"></div>
              <CardContent className="relative p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                    <AlertTriangle className="h-8 w-8 text-white" />
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold">{stats.delayed}</div>
                    <div className="text-purple-100 text-sm">{language === 'vi' ? 'Chậm trễ' : 'Delayed'}</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-xl font-bold">{language === 'vi' ? 'Cần xử lý' : 'Needs Attention'}</div>
                  <div className="flex items-center text-purple-100">
                    <Clock className="h-4 w-4 mr-1" />
                    <span className="text-sm">{language === 'vi' ? 'Ưu tiên cao' : 'High Priority'}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search and Filter */}
          <Card className="shadow-2xl border-0 bg-gradient-to-r from-white to-blue-50">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    placeholder={language === 'vi' ? 'Tìm kiếm theo mã vận đơn, khách hàng...' : 'Search by tracking number, client...'}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 h-12 text-lg border-2 border-blue-200 focus:border-blue-500"
                  />
                </div>
                <div className="flex gap-3">
                  <Button className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 shadow-lg h-12 px-6">
                    <Filter className="h-5 w-5 mr-2" />
                    {language === 'vi' ? 'Lọc' : 'Filter'}
                  </Button>
                  <Button className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 shadow-lg h-12 px-6">
                    <Plus className="h-5 w-5 mr-2" />
                    {language === 'vi' ? 'Tạo mới' : 'Create New'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Beautiful Shipment List */}
          <div className="space-y-6">
            {shipments.map((shipment) => (
              <Card key={shipment.id} className="shadow-2xl border-0 bg-gradient-to-r from-white to-blue-50 hover:shadow-blue-500/10 transition-all duration-300">
                <CardContent className="p-8">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg">
                        <Package className="h-8 w-8 text-white" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-gray-800">{shipment.trackingNumber}</h3>
                        <p className="text-lg text-blue-600 font-semibold">{shipment.client}</p>
                        <p className="text-gray-600">{shipment.company}</p>
                      </div>
                    </div>
                    <Badge className={`${getStatusColor(shipment.status)} shadow-lg text-lg px-4 py-2`}>
                      {getStatusText(shipment.status)}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                    <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
                      <div className="flex items-center gap-2 mb-2">
                        <MapPin className="h-5 w-5 text-blue-600" />
                        <span className="font-semibold text-gray-700">{language === 'vi' ? 'Xuất phát' : 'Origin'}</span>
                      </div>
                      <p className="text-gray-800 font-medium">{shipment.origin}</p>
                    </div>

                    <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
                      <div className="flex items-center gap-2 mb-2">
                        <Navigation className="h-5 w-5 text-green-600" />
                        <span className="font-semibold text-gray-700">{language === 'vi' ? 'Đích đến' : 'Destination'}</span>
                      </div>
                      <p className="text-gray-800 font-medium">{shipment.destination}</p>
                    </div>

                    <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
                      <div className="flex items-center gap-2 mb-2">
                        <DollarSign className="h-5 w-5 text-purple-600" />
                        <span className="font-semibold text-gray-700">{language === 'vi' ? 'Giá trị' : 'Value'}</span>
                      </div>
                      <p className="text-gray-800 font-bold text-lg">{formatCurrency(shipment.value)}</p>
                    </div>

                    <div className="p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl">
                      <div className="flex items-center gap-2 mb-2">
                        <Package className="h-5 w-5 text-orange-600" />
                        <span className="font-semibold text-gray-700">{language === 'vi' ? 'Trọng lượng' : 'Weight'}</span>
                      </div>
                      <p className="text-gray-800 font-bold text-lg">{shipment.weight} {language === 'vi' ? 'tấn' : 'tons'}</p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold text-gray-700">{language === 'vi' ? 'Tiến độ vận chuyển' : 'Delivery Progress'}</span>
                      <span className="font-bold text-blue-600">{shipment.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-4 shadow-inner">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-indigo-500 h-4 rounded-full shadow-lg transition-all duration-500" 
                        style={{ width: `${shipment.progress}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        <span>{language === 'vi' ? 'Tài xế:' : 'Driver:'} {shipment.driver}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Truck className="h-4 w-4" />
                        <span>{language === 'vi' ? 'Xe:' : 'Vehicle:'} {shipment.vehicle}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>{language === 'vi' ? 'Dự kiến:' : 'ETA:'} {new Date(shipment.estimatedDelivery).toLocaleDateString('vi-VN')}</span>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Button 
                        className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 shadow-lg"
                        onClick={() => alert(`${language === 'vi' ? 'Xem chi tiết' : 'View details'}: ${shipment.trackingNumber}`)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        {language === 'vi' ? 'Chi tiết' : 'Details'}
                      </Button>
                      <Button 
                        variant="outline"
                        className="border-blue-300 text-blue-700 hover:bg-blue-50"
                        onClick={() => alert(`${language === 'vi' ? 'Theo dõi' : 'Track'}: ${shipment.trackingNumber}`)}
                      >
                        <MapPin className="h-4 w-4 mr-2" />
                        {language === 'vi' ? 'Theo dõi' : 'Track'}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </AuthGuard>
  )
}

export default ShipmentManagementPage
