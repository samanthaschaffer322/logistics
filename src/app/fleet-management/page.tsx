'use client'

import React, { useState } from 'react'
import AuthGuard from '@/components/AuthGuard'
import { useLanguage } from '@/contexts/LanguageContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Truck, 
  Fuel, 
  Wrench, 
  CheckCircle,
  MapPin,
  Calendar,
  DollarSign,
  Eye,
  Activity
} from 'lucide-react'

interface Vehicle {
  id: string
  licensePlate: string
  type: string
  status: 'active' | 'maintenance' | 'idle' | 'repair'
  driver: string
  location: string
  fuelLevel: number
  mileage: number
  lastService: string
  nextService: string
  engineHours: number
  tireCondition: 'good' | 'fair' | 'poor'
  brakeCondition: 'good' | 'fair' | 'poor'
  maintenanceCost: number
}

const FleetManagementPage: React.FC = () => {
  const { language } = useLanguage()

  // Specific Vietnamese company fleet - Danh sách xe CTy
  const vehicles: Vehicle[] = [
    {
      id: '1',
      licensePlate: '50H.08301',
      type: 'Container Truck 40ft',
      status: 'active',
      driver: 'Nguyễn Văn Minh',
      location: 'Cảng Cát Lái, TP.HCM',
      fuelLevel: 85,
      mileage: 145230,
      lastService: '2025-08-15',
      nextService: '2025-09-15',
      engineHours: 8450,
      tireCondition: 'good',
      brakeCondition: 'good',
      maintenanceCost: 2500000
    },
    {
      id: '2',
      licensePlate: '50H.53777',
      type: 'Container Truck 20ft',
      status: 'maintenance',
      driver: 'Trần Thanh Sơn',
      location: 'Garage Bình Dương',
      fuelLevel: 45,
      mileage: 198750,
      lastService: '2025-08-10',
      nextService: '2025-08-28',
      engineHours: 12340,
      tireCondition: 'fair',
      brakeCondition: 'good',
      maintenanceCost: 3200000
    },
    {
      id: '3',
      licensePlate: '51C.56362',
      type: 'Flatbed Truck',
      status: 'active',
      driver: 'Lê Văn Đức',
      location: 'Cảng Phú Mỹ, BR-VT',
      fuelLevel: 92,
      mileage: 87650,
      lastService: '2025-08-20',
      nextService: '2025-09-20',
      engineHours: 5230,
      tireCondition: 'good',
      brakeCondition: 'good',
      maintenanceCost: 1950000
    },
    {
      id: '4',
      licensePlate: '51C.58240',
      type: 'Container Truck 40ft',
      status: 'active',
      driver: 'Hoàng Văn Phúc',
      location: 'Đường cao tốc HCM-Trung Lương',
      fuelLevel: 68,
      mileage: 203450,
      lastService: '2025-08-05',
      nextService: '2025-09-05',
      engineHours: 13890,
      tireCondition: 'fair',
      brakeCondition: 'fair',
      maintenanceCost: 850000
    },
    {
      id: '5',
      licensePlate: '51C.58256',
      type: 'Container Truck 20ft',
      status: 'repair',
      driver: 'Đặng Minh Quân',
      location: 'Garage Đồng Nai',
      fuelLevel: 25,
      mileage: 176890,
      lastService: '2025-07-30',
      nextService: '2025-08-30',
      engineHours: 11250,
      tireCondition: 'poor',
      brakeCondition: 'fair',
      maintenanceCost: 15500000
    },
    {
      id: '6',
      licensePlate: '51C.63836',
      type: 'Flatbed Truck',
      status: 'active',
      driver: 'Bùi Văn Thành',
      location: 'Cảng Đà Nẵng',
      fuelLevel: 78,
      mileage: 134560,
      lastService: '2025-08-18',
      nextService: '2025-09-18',
      engineHours: 7890,
      tireCondition: 'good',
      brakeCondition: 'good',
      maintenanceCost: 2200000
    },
    {
      id: '7',
      licensePlate: '51C.76124',
      type: 'Container Truck 40ft',
      status: 'idle',
      driver: 'Chưa phân công',
      location: 'Bãi đỗ xe Bình Dương',
      fuelLevel: 95,
      mileage: 95430,
      lastService: '2025-08-22',
      nextService: '2025-09-22',
      engineHours: 5670,
      tireCondition: 'good',
      brakeCondition: 'good',
      maintenanceCost: 1500000
    }
  ]

  // Calculate fleet statistics
  const fleetStats = {
    total: vehicles.length,
    active: vehicles.filter(v => v.status === 'active').length,
    maintenance: vehicles.filter(v => v.status === 'maintenance').length,
    repair: vehicles.filter(v => v.status === 'repair').length,
    idle: vehicles.filter(v => v.status === 'idle').length,
    avgFuelLevel: Math.round(vehicles.reduce((sum, v) => sum + v.fuelLevel, 0) / vehicles.length),
    totalMileage: vehicles.reduce((sum, v) => sum + v.mileage, 0),
    maintenanceCost: vehicles.reduce((sum, v) => sum + v.maintenanceCost, 0)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500'
      case 'maintenance': return 'bg-yellow-500'
      case 'repair': return 'bg-red-500'
      case 'idle': return 'bg-gray-500'
      default: return 'bg-gray-500'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return language === 'vi' ? 'Đang hoạt động' : 'Active'
      case 'maintenance': return language === 'vi' ? 'Bảo dưỡng' : 'Maintenance'
      case 'repair': return language === 'vi' ? 'Sửa chữa' : 'Repair'
      case 'idle': return language === 'vi' ? 'Nghỉ' : 'Idle'
      default: return status
    }
  }

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'good': return 'text-green-600'
      case 'fair': return 'text-yellow-600'
      case 'poor': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  const getConditionText = (condition: string) => {
    switch (condition) {
      case 'good': return language === 'vi' ? 'Tốt' : 'Good'
      case 'fair': return language === 'vi' ? 'Khá' : 'Fair'
      case 'poor': return language === 'vi' ? 'Kém' : 'Poor'
      default: return condition
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
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-3xl mb-6 shadow-2xl">
              <Truck className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
              🚛 {language === 'vi' ? 'Quản lý Đội xe Công ty' : 'Company Fleet Management'}
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              {language === 'vi' ? 'Quản lý đội xe công ty với hệ thống bảo dưỡng thông minh và theo dõi chi tiết' : 'Manage company fleet with smart maintenance system and detailed tracking'}
            </p>
          </div>

          {/* Fleet Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="relative overflow-hidden bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 text-white border-0 shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 hover:scale-105">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                    <Truck className="h-8 w-8 text-white" />
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold">{fleetStats.total}</div>
                    <div className="text-blue-100 text-sm">{language === 'vi' ? 'Tổng số xe' : 'Total Vehicles'}</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-xl font-bold">{fleetStats.active} {language === 'vi' ? 'xe hoạt động' : 'active'}</div>
                  <div className="flex items-center text-blue-100">
                    <Activity className="h-4 w-4 mr-1" />
                    <span className="text-sm">{Math.round((fleetStats.active / fleetStats.total) * 100)}% {language === 'vi' ? 'tỷ lệ hoạt động' : 'utilization'}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden bg-gradient-to-br from-green-500 via-green-600 to-emerald-600 text-white border-0 shadow-2xl hover:shadow-green-500/25 transition-all duration-300 hover:scale-105">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                    <Fuel className="h-8 w-8 text-white" />
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold">{fleetStats.avgFuelLevel}%</div>
                    <div className="text-green-100 text-sm">{language === 'vi' ? 'Mức nhiên liệu TB' : 'Avg Fuel Level'}</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-xl font-bold">{(fleetStats.totalMileage / 1000).toFixed(0)}K km</div>
                  <div className="flex items-center text-green-100">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span className="text-sm">{language === 'vi' ? 'Tổng quãng đường' : 'Total Mileage'}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden bg-gradient-to-br from-yellow-500 via-orange-500 to-red-500 text-white border-0 shadow-2xl hover:shadow-yellow-500/25 transition-all duration-300 hover:scale-105">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                    <Wrench className="h-8 w-8 text-white" />
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold">{fleetStats.maintenance + fleetStats.repair}</div>
                    <div className="text-yellow-100 text-sm">{language === 'vi' ? 'Xe bảo dưỡng/sửa chữa' : 'Maintenance/Repair'}</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-xl font-bold">{formatCurrency(fleetStats.maintenanceCost)}</div>
                  <div className="flex items-center text-yellow-100">
                    <DollarSign className="h-4 w-4 mr-1" />
                    <span className="text-sm">{language === 'vi' ? 'Chi phí bảo dưỡng' : 'Maintenance Cost'}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden bg-gradient-to-br from-purple-500 via-purple-600 to-pink-600 text-white border-0 shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 hover:scale-105">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                    <CheckCircle className="h-8 w-8 text-white" />
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold">{Math.round(((fleetStats.total - fleetStats.repair) / fleetStats.total) * 100)}%</div>
                    <div className="text-purple-100 text-sm">{language === 'vi' ? 'Tỷ lệ sẵn sàng' : 'Availability Rate'}</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-xl font-bold">{language === 'vi' ? 'Tình trạng tốt' : 'Good Condition'}</div>
                  <div className="flex items-center text-purple-100">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    <span className="text-sm">{language === 'vi' ? 'An toàn vận hành' : 'Safe Operation'}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Vehicle List */}
          <Card className="shadow-2xl border-0 bg-gradient-to-r from-white to-blue-50">
            <CardHeader className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-3 text-xl">
                <Truck className="h-6 w-6" />
                {language === 'vi' ? 'Danh sách Xe Công ty' : 'Company Vehicle List'}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="space-y-6">
                {vehicles.map((vehicle) => (
                  <Card key={vehicle.id} className="shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg">
                            <Truck className="h-8 w-8 text-white" />
                          </div>
                          <div>
                            <h3 className="text-2xl font-bold text-gray-800">{vehicle.licensePlate}</h3>
                            <p className="text-lg text-blue-600 font-semibold">{vehicle.type}</p>
                            <p className="text-gray-600">{language === 'vi' ? 'Tài xế:' : 'Driver:'} {vehicle.driver}</p>
                          </div>
                        </div>
                        <Badge className={`${getStatusColor(vehicle.status)} text-white shadow-lg text-lg px-4 py-2`}>
                          {getStatusText(vehicle.status)}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                        <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
                          <div className="flex items-center gap-2 mb-2">
                            <MapPin className="h-5 w-5 text-blue-600" />
                            <span className="font-semibold text-gray-700">{language === 'vi' ? 'Vị trí' : 'Location'}</span>
                          </div>
                          <p className="text-gray-800 font-medium">{vehicle.location}</p>
                        </div>

                        <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
                          <div className="flex items-center gap-2 mb-2">
                            <Fuel className="h-5 w-5 text-green-600" />
                            <span className="font-semibold text-gray-700">{language === 'vi' ? 'Nhiên liệu' : 'Fuel'}</span>
                          </div>
                          <p className="text-gray-800 font-bold text-lg">{vehicle.fuelLevel}%</p>
                        </div>

                        <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
                          <div className="flex items-center gap-2 mb-2">
                            <Activity className="h-5 w-5 text-purple-600" />
                            <span className="font-semibold text-gray-700">{language === 'vi' ? 'Quãng đường' : 'Mileage'}</span>
                          </div>
                          <p className="text-gray-800 font-bold text-lg">{vehicle.mileage.toLocaleString()} km</p>
                        </div>

                        <div className="p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl">
                          <div className="flex items-center gap-2 mb-2">
                            <Wrench className="h-5 w-5 text-orange-600" />
                            <span className="font-semibold text-gray-700">{language === 'vi' ? 'Bảo dưỡng tiếp theo' : 'Next Service'}</span>
                          </div>
                          <p className="text-gray-800 font-bold">{new Date(vehicle.nextService).toLocaleDateString('vi-VN')}</p>
                        </div>
                      </div>

                      {/* Detailed Maintenance Info */}
                      <div className="border-t pt-4">
                        <h4 className="text-lg font-bold text-gray-800 mb-3">
                          {language === 'vi' ? 'Thông tin Bảo dưỡng Chi tiết' : 'Detailed Maintenance Info'}
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div className="p-3 bg-gray-50 rounded-lg">
                            <span className="text-sm text-gray-600">{language === 'vi' ? 'Giờ máy:' : 'Engine Hours:'}</span>
                            <p className="font-bold text-gray-800">{vehicle.engineHours.toLocaleString()}h</p>
                          </div>
                          <div className="p-3 bg-gray-50 rounded-lg">
                            <span className="text-sm text-gray-600">{language === 'vi' ? 'Tình trạng lốp:' : 'Tire Condition:'}</span>
                            <p className={`font-bold ${getConditionColor(vehicle.tireCondition)}`}>
                              {getConditionText(vehicle.tireCondition)}
                            </p>
                          </div>
                          <div className="p-3 bg-gray-50 rounded-lg">
                            <span className="text-sm text-gray-600">{language === 'vi' ? 'Tình trạng phanh:' : 'Brake Condition:'}</span>
                            <p className={`font-bold ${getConditionColor(vehicle.brakeCondition)}`}>
                              {getConditionText(vehicle.brakeCondition)}
                            </p>
                          </div>
                        </div>

                        {/* Maintenance Cost */}
                        <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl mb-4">
                          <h5 className="font-bold text-gray-800 mb-2">{language === 'vi' ? 'Chi phí bảo dưỡng gần nhất:' : 'Latest Maintenance Cost:'}</h5>
                          <div className="text-2xl font-bold text-blue-600">{formatCurrency(vehicle.maintenanceCost)}</div>
                          <div className="text-sm text-gray-600 mt-1">
                            {language === 'vi' ? 'Bảo dưỡng cuối:' : 'Last Service:'} {new Date(vehicle.lastService).toLocaleDateString('vi-VN')}
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-4 mt-4">
                        <Button 
                          onClick={() => alert(language === 'vi' ? `Xem chi tiết xe ${vehicle.licensePlate}` : `View details for ${vehicle.licensePlate}`)}
                          className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 shadow-lg"
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          {language === 'vi' ? 'Chi tiết' : 'Details'}
                        </Button>
                        <Button 
                          onClick={() => alert(language === 'vi' ? `Lên lịch bảo dưỡng cho xe ${vehicle.licensePlate}` : `Schedule maintenance for ${vehicle.licensePlate}`)}
                          className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 shadow-lg"
                        >
                          <Calendar className="h-4 w-4 mr-2" />
                          {language === 'vi' ? 'Lên lịch bảo dưỡng' : 'Schedule Maintenance'}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AuthGuard>
  )
}

export default FleetManagementPage
