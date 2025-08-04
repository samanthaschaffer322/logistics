'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
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
  Search
} from 'lucide-react'
import { useTranslation } from '@/lib/i18n/useTranslation'
import { FleetManagementSystem, Vehicle, Driver, VehicleDocument } from '@/lib/fleet-management/fleet-system'

export default function FleetManagementPage() {
  const { t, locale } = useTranslation()
  const [fleetSystem] = useState(() => new FleetManagementSystem())
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [drivers, setDrivers] = useState<Driver[]>([])
  const [fleetStats, setFleetStats] = useState<{
    vehicles: { total: number; available: number };
    drivers: { total: number; available: number };
    performance: { averageOnTime: number; totalTrips: number };
    maintenance: { upcomingServices: number; criticalIssues: number };
  } | null>(null)
  const [selectedTab, setSelectedTab] = useState<'vehicles' | 'drivers' | 'maintenance'>('vehicles')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadFleetData()
  }, [])

  const loadFleetData = () => {
    setVehicles(fleetSystem.getVehicles())
    setDrivers(fleetSystem.getDrivers())
    setFleetStats(fleetSystem.getFleetStats())
    setLoading(false)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800'
      case 'in_transit': return 'bg-blue-100 text-blue-800'
      case 'maintenance': return 'bg-yellow-100 text-yellow-800'
      case 'offline': return 'bg-gray-100 text-gray-800'
      case 'driving': return 'bg-blue-100 text-blue-800'
      case 'resting': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'available': return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'in_transit': case 'driving': return <Truck className="h-4 w-4 text-blue-600" />
      case 'maintenance': return <Wrench className="h-4 w-4 text-yellow-600" />
      case 'offline': return <Clock className="h-4 w-4 text-gray-600" />
      case 'resting': return <Users className="h-4 w-4 text-purple-600" />
      default: return <AlertTriangle className="h-4 w-4 text-gray-600" />
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-lg">{t('common.loading')}</span>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Truck className="mr-3 h-8 w-8 text-blue-600" />
            {locale === 'vi' ? 'Quản lý Đội xe' : 'Fleet Management'}
          </h1>
          <p className="text-gray-600 mt-2">
            {locale === 'vi' 
              ? 'Quản lý xe tải, tài xế và theo dõi hoạt động đội xe'
              : 'Manage vehicles, drivers, and track fleet operations'
            }
          </p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center">
          <Plus className="mr-2 h-4 w-4" />
          {locale === 'vi' ? 'Thêm xe' : 'Add Vehicle'}
        </button>
      </div>

      {/* Fleet Statistics */}
      {fleetStats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Truck className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    {locale === 'vi' ? 'Tổng số xe' : 'Total Vehicles'}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">{fleetStats.vehicles.total}</p>
                  <p className="text-xs text-green-600">
                    {fleetStats.vehicles.available} {locale === 'vi' ? 'sẵn sàng' : 'available'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    {locale === 'vi' ? 'Tổng tài xế' : 'Total Drivers'}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">{fleetStats.drivers.total}</p>
                  <p className="text-xs text-green-600">
                    {fleetStats.drivers.available} {locale === 'vi' ? 'sẵn sàng' : 'available'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    {locale === 'vi' ? 'Tỷ lệ đúng giờ' : 'On-Time Rate'}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {Math.round(fleetStats.performance.averageOnTime)}%
                  </p>
                  <p className="text-xs text-blue-600">
                    {fleetStats.performance.totalTrips.toLocaleString()} {locale === 'vi' ? 'chuyến' : 'trips'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <AlertTriangle className="h-8 w-8 text-orange-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    {locale === 'vi' ? 'Cần bảo trì' : 'Needs Maintenance'}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">{fleetStats.maintenance.upcomingServices}</p>
                  <p className="text-xs text-red-600">
                    {fleetStats.maintenance.criticalIssues} {locale === 'vi' ? 'khẩn cấp' : 'critical'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { key: 'vehicles', label: locale === 'vi' ? 'Xe tải' : 'Vehicles', icon: Truck },
            { key: 'drivers', label: locale === 'vi' ? 'Tài xế' : 'Drivers', icon: Users },
            { key: 'maintenance', label: locale === 'vi' ? 'Bảo trì' : 'Maintenance', icon: Wrench }
          ].map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.key}
                onClick={() => setSelectedTab(tab.key as any)}
                className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                  selectedTab === tab.key
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="mr-2 h-4 w-4" />
                {tab.label}
              </button>
            )
          })}
        </nav>
      </div>

      {/* Tab Content */}
      {selectedTab === 'vehicles' && (
        <VehiclesTab vehicles={vehicles} locale={locale} getStatusColor={getStatusColor} getStatusIcon={getStatusIcon} />
      )}
      
      {selectedTab === 'drivers' && (
        <DriversTab drivers={drivers} locale={locale} getStatusColor={getStatusColor} getStatusIcon={getStatusIcon} />
      )}
      
      {selectedTab === 'maintenance' && (
        <MaintenanceTab vehicles={vehicles} locale={locale} fleetSystem={fleetSystem} />
      )}
    </div>
  )
}

// Vehicles Tab Component
function VehiclesTab({ 
  vehicles, 
  locale, 
  getStatusColor, 
  getStatusIcon 
}: {
  vehicles: Vehicle[];
  locale: string;
  getStatusColor: (status: string) => string;
  getStatusIcon: (status: string) => React.JSX.Element;
}) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">
          {locale === 'vi' ? 'Danh sách Xe tải' : 'Vehicle Fleet'}
        </h2>
        <div className="flex space-x-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder={locale === 'vi' ? 'Tìm kiếm xe...' : 'Search vehicles...'}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button className="flex items-center px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Filter className="mr-2 h-4 w-4" />
            {locale === 'vi' ? 'Lọc' : 'Filter'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {vehicles.map((vehicle: Vehicle) => (
          <Card key={vehicle.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <div className="bg-blue-100 p-3 rounded-lg mr-4">
                    <Truck className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900">{vehicle.plateNumber}</h3>
                    <p className="text-gray-600">{vehicle.make} {vehicle.model} ({vehicle.year})</p>
                  </div>
                </div>
                <div className="flex items-center">
                  {getStatusIcon(vehicle.status)}
                  <span className={`ml-2 px-2 py-1 text-xs rounded-full ${getStatusColor(vehicle.status)}`}>
                    {locale === 'vi' 
                      ? (vehicle.status === 'available' ? 'Sẵn sàng' : 
                         vehicle.status === 'in_transit' ? 'Đang vận chuyển' :
                         vehicle.status === 'maintenance' ? 'Bảo trì' : 'Ngoại tuyến')
                      : vehicle.status.replace('_', ' ').toUpperCase()
                    }
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      {locale === 'vi' ? 'Vị trí' : 'Location'}
                    </p>
                    <p className="text-sm text-gray-600">{vehicle.location.address}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Fuel className="h-4 w-4 text-gray-400 mr-2" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      {locale === 'vi' ? 'Nhiên liệu' : 'Fuel'}
                    </p>
                    <p className="text-sm text-gray-600">{vehicle.fuel.level}%</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="text-sm text-gray-600">
                  <span className="font-medium">{locale === 'vi' ? 'Tải trọng:' : 'Capacity:'}</span> {vehicle.capacity.weight.toLocaleString()}kg
                </div>
                <button className="flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium">
                  <Eye className="mr-1 h-4 w-4" />
                  {locale === 'vi' ? 'Chi tiết' : 'Details'}
                </button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

// Drivers Tab Component  
function DriversTab({ 
  drivers, 
  locale, 
  getStatusColor, 
  getStatusIcon 
}: {
  drivers: Driver[];
  locale: string;
  getStatusColor: (status: string) => string;
  getStatusIcon: (status: string) => React.JSX.Element;
}) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">
          {locale === 'vi' ? 'Danh sách Tài xế' : 'Driver List'}
        </h2>
        <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center">
          <Plus className="mr-2 h-4 w-4" />
          {locale === 'vi' ? 'Thêm tài xế' : 'Add Driver'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {drivers.map((driver: Driver) => (
          <Card key={driver.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <div className="bg-green-100 p-3 rounded-lg mr-4">
                    <Users className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900">{driver.name}</h3>
                    <p className="text-gray-600">{driver.phone}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  {getStatusIcon(driver.status)}
                  <span className={`ml-2 px-2 py-1 text-xs rounded-full ${getStatusColor(driver.status)}`}>
                    {locale === 'vi' 
                      ? (driver.status === 'available' ? 'Sẵn sàng' : 
                         driver.status === 'driving' ? 'Đang lái xe' :
                         driver.status === 'resting' ? 'Nghỉ ngơi' : 'Ngoại tuyến')
                      : driver.status.replace('_', ' ').toUpperCase()
                    }
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    {locale === 'vi' ? 'Đánh giá' : 'Rating'}
                  </p>
                  <p className="text-sm text-gray-600">⭐ {driver.performance.rating}/5.0</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    {locale === 'vi' ? 'Chuyến đi' : 'Total Trips'}
                  </p>
                  <p className="text-sm text-gray-600">{driver.performance.totalTrips.toLocaleString()}</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="text-sm text-gray-600">
                  <span className="font-medium">{locale === 'vi' ? 'Giờ làm:' : 'Hours:'}</span> {driver.workingHours.totalToday}h/{driver.workingHours.maxDaily}h
                </div>
                <button className="flex items-center text-green-600 hover:text-green-800 text-sm font-medium">
                  <Eye className="mr-1 h-4 w-4" />
                  {locale === 'vi' ? 'Chi tiết' : 'Details'}
                </button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

// Maintenance Tab Component
function MaintenanceTab({ 
  vehicles, 
  locale, 
  fleetSystem 
}: {
  vehicles: Vehicle[];
  locale: string;
  fleetSystem: FleetManagementSystem;
}) {
  const maintenanceVehicles = fleetSystem.getVehiclesNeedingMaintenance()
  const expiringDocs = fleetSystem.getExpiringDocuments()

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Wrench className="mr-2 h-5 w-5" />
              {locale === 'vi' ? 'Xe cần Bảo trì' : 'Vehicles Needing Maintenance'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {maintenanceVehicles.length > 0 ? (
              <div className="space-y-3">
                {maintenanceVehicles.map((vehicle: Vehicle) => (
                  <div key={vehicle.id} className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{vehicle.plateNumber}</p>
                      <p className="text-sm text-gray-600">{vehicle.make} {vehicle.model}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-yellow-800">
                        {Math.ceil((vehicle.maintenance.nextService.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} {locale === 'vi' ? 'ngày' : 'days'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">
                {locale === 'vi' ? 'Không có xe nào cần bảo trì' : 'No vehicles need maintenance'}
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="mr-2 h-5 w-5" />
              {locale === 'vi' ? 'Giấy tờ sắp hết hạn' : 'Expiring Documents'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {expiringDocs.length > 0 ? (
              <div className="space-y-3">
                {expiringDocs.slice(0, 5).map((item: { entity: Vehicle | Driver, document: VehicleDocument, type: 'vehicle' | 'driver' }, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">
                        {item.type === 'vehicle' ? (item.entity as Vehicle).plateNumber : (item.entity as Driver).name}
                      </p>
                      <p className="text-sm text-gray-600">{item.document.type}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-red-800">
                        {item.document.expiryDate.toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">
                {locale === 'vi' ? 'Không có giấy tờ nào sắp hết hạn' : 'No documents expiring soon'}
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
