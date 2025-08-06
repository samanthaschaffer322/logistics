'use client'

import React, { useState, useEffect } from 'react'
import AuthGuard from '@/components/AuthGuard'
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  Button,
  Input,
  Label
} from '@/components/ui-components'
import { 
  Map, 
  MapPin, 
  Navigation, 
  Truck, 
  Package, 
  Clock,
  BarChart3,
  TrendingUp,
  Users,
  Building,
  Search,
  Filter
} from 'lucide-react'

interface Province {
  id: string
  name: string
  region: 'north' | 'central' | 'south'
  population: number
  area: number
  economicZones: number
  ports: number
  airports: number
  logistics: {
    warehouses: number
    distributionCenters: number
    activeRoutes: number
    monthlyVolume: number
  }
}

interface LogisticsHub {
  id: string
  name: string
  province: string
  type: 'warehouse' | 'port' | 'airport' | 'distribution'
  capacity: number
  utilization: number
  coordinates: { lat: number; lng: number }
}

const VietnamMapPage = () => {
  const [selectedProvince, setSelectedProvince] = useState<Province | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedRegion, setSelectedRegion] = useState<string>('all')
  const [logisticsHubs, setLogisticsHubs] = useState<LogisticsHub[]>([])

  // Sample Vietnam provinces data
  const provinces: Province[] = [
    {
      id: 'hcm',
      name: 'TP. Hồ Chí Minh',
      region: 'south',
      population: 9000000,
      area: 2095,
      economicZones: 15,
      ports: 3,
      airports: 2,
      logistics: {
        warehouses: 450,
        distributionCenters: 85,
        activeRoutes: 1200,
        monthlyVolume: 2500000
      }
    },
    {
      id: 'hanoi',
      name: 'Hà Nội',
      region: 'north',
      population: 8000000,
      area: 3359,
      economicZones: 12,
      ports: 0,
      airports: 1,
      logistics: {
        warehouses: 380,
        distributionCenters: 65,
        activeRoutes: 950,
        monthlyVolume: 1800000
      }
    },
    {
      id: 'danang',
      name: 'Đà Nẵng',
      region: 'central',
      population: 1200000,
      area: 1285,
      economicZones: 8,
      ports: 1,
      airports: 1,
      logistics: {
        warehouses: 120,
        distributionCenters: 25,
        activeRoutes: 350,
        monthlyVolume: 450000
      }
    },
    {
      id: 'haiphong',
      name: 'Hải Phòng',
      region: 'north',
      population: 2000000,
      area: 1523,
      economicZones: 6,
      ports: 2,
      airports: 1,
      logistics: {
        warehouses: 180,
        distributionCenters: 35,
        activeRoutes: 480,
        monthlyVolume: 850000
      }
    },
    {
      id: 'cantho',
      name: 'Cần Thơ',
      region: 'south',
      population: 1200000,
      area: 1409,
      economicZones: 4,
      ports: 1,
      airports: 1,
      logistics: {
        warehouses: 95,
        distributionCenters: 18,
        activeRoutes: 280,
        monthlyVolume: 320000
      }
    },
    {
      id: 'binhduong',
      name: 'Bình Dương',
      region: 'south',
      population: 2500000,
      area: 2695,
      economicZones: 10,
      ports: 0,
      airports: 0,
      logistics: {
        warehouses: 220,
        distributionCenters: 42,
        activeRoutes: 650,
        monthlyVolume: 980000
      }
    }
  ]

  const sampleHubs: LogisticsHub[] = [
    {
      id: 'hub1',
      name: 'Kho trung tâm Tân Thuận',
      province: 'TP. Hồ Chí Minh',
      type: 'warehouse',
      capacity: 50000,
      utilization: 85,
      coordinates: { lat: 10.7378, lng: 106.7230 }
    },
    {
      id: 'hub2',
      name: 'Cảng Cát Lái',
      province: 'TP. Hồ Chí Minh',
      type: 'port',
      capacity: 100000,
      utilization: 92,
      coordinates: { lat: 10.7950, lng: 106.7767 }
    },
    {
      id: 'hub3',
      name: 'Sân bay Nội Bài',
      province: 'Hà Nội',
      type: 'airport',
      capacity: 25000,
      utilization: 78,
      coordinates: { lat: 21.2187, lng: 105.8042 }
    },
    {
      id: 'hub4',
      name: 'Trung tâm phân phối Hà Nội',
      province: 'Hà Nội',
      type: 'distribution',
      capacity: 30000,
      utilization: 88,
      coordinates: { lat: 21.0285, lng: 105.8542 }
    }
  ]

  useEffect(() => {
    setLogisticsHubs(sampleHubs)
  }, [])

  const filteredProvinces = provinces.filter(province => {
    const matchesSearch = province.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRegion = selectedRegion === 'all' || province.region === selectedRegion
    return matchesSearch && matchesRegion
  })

  const getRegionColor = (region: string) => {
    switch (region) {
      case 'north': return 'bg-blue-100 text-blue-800'
      case 'central': return 'bg-green-100 text-green-800'
      case 'south': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getRegionName = (region: string) => {
    switch (region) {
      case 'north': return 'Miền Bắc'
      case 'central': return 'Miền Trung'
      case 'south': return 'Miền Nam'
      default: return region
    }
  }

  const getHubTypeIcon = (type: string) => {
    switch (type) {
      case 'warehouse': return <Building className="w-4 h-4" />
      case 'port': return <Navigation className="w-4 h-4" />
      case 'airport': return <MapPin className="w-4 h-4" />
      case 'distribution': return <Truck className="w-4 h-4" />
      default: return <MapPin className="w-4 h-4" />
    }
  }

  const getHubTypeColor = (type: string) => {
    switch (type) {
      case 'warehouse': return 'bg-blue-100 text-blue-800'
      case 'port': return 'bg-green-100 text-green-800'
      case 'airport': return 'bg-purple-100 text-purple-800'
      case 'distribution': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const totalStats = provinces.reduce((acc, province) => ({
    warehouses: acc.warehouses + province.logistics.warehouses,
    distributionCenters: acc.distributionCenters + province.logistics.distributionCenters,
    activeRoutes: acc.activeRoutes + province.logistics.activeRoutes,
    monthlyVolume: acc.monthlyVolume + province.logistics.monthlyVolume
  }), { warehouses: 0, distributionCenters: 0, activeRoutes: 0, monthlyVolume: 0 })

  return (
    <AuthGuard>
      <div className="min-h-screen bg-slate-900 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Vietnam Logistics Map</h1>
            <p className="text-slate-400">
              Khám phá mạng lưới logistics trên toàn quốc với dữ liệu thời gian thực và phân tích AI
            </p>
          </div>

          {/* Overview Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Building className="w-8 h-8 text-blue-600" />
                  <div>
                    <p className="text-2xl font-bold">{totalStats.warehouses.toLocaleString()}</p>
                    <p className="text-sm text-slate-600">Kho bãi</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Truck className="w-8 h-8 text-green-600" />
                  <div>
                    <p className="text-2xl font-bold">{totalStats.distributionCenters.toLocaleString()}</p>
                    <p className="text-sm text-slate-600">Trung tâm phân phối</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Navigation className="w-8 h-8 text-purple-600" />
                  <div>
                    <p className="text-2xl font-bold">{totalStats.activeRoutes.toLocaleString()}</p>
                    <p className="text-sm text-slate-600">Tuyến đường hoạt động</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Package className="w-8 h-8 text-orange-600" />
                  <div>
                    <p className="text-2xl font-bold">{(totalStats.monthlyVolume / 1000000).toFixed(1)}M</p>
                    <p className="text-sm text-slate-600">Tấn hàng/tháng</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Search and Filter */}
            <div className="lg:col-span-1 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Search className="w-5 h-5" />
                    Tìm kiếm & Lọc
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="search">Tìm tỉnh/thành phố</Label>
                    <Input
                      id="search"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Nhập tên tỉnh/thành phố"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="region">Vùng miền</Label>
                    <select
                      id="region"
                      value={selectedRegion}
                      onChange={(e) => setSelectedRegion(e.target.value)}
                      className="w-full p-2 border rounded-md"
                    >
                      <option value="all">Tất cả vùng miền</option>
                      <option value="north">Miền Bắc</option>
                      <option value="central">Miền Trung</option>
                      <option value="south">Miền Nam</option>
                    </select>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Danh sách tỉnh/thành</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {filteredProvinces.map((province) => (
                      <div
                        key={province.id}
                        onClick={() => setSelectedProvince(province)}
                        className={`p-3 rounded-lg cursor-pointer transition-colors ${
                          selectedProvince?.id === province.id
                            ? 'bg-indigo-100 border-indigo-300'
                            : 'bg-slate-50 hover:bg-slate-100'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">{province.name}</h4>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRegionColor(province.region)}`}>
                            {getRegionName(province.region)}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs text-slate-600">
                          <div>Dân số: {(province.population / 1000000).toFixed(1)}M</div>
                          <div>Kho bãi: {province.logistics.warehouses}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Province Details */}
            <div className="lg:col-span-2 space-y-6">
              {selectedProvince ? (
                <>
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <MapPin className="w-5 h-5" />
                        {selectedProvince.name}
                      </CardTitle>
                      <CardDescription>
                        Thông tin chi tiết về hạ tầng logistics
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        <div className="text-center p-3 bg-blue-50 rounded-lg">
                          <Users className="w-6 h-6 text-blue-600 mx-auto mb-1" />
                          <p className="text-lg font-bold text-blue-600">
                            {(selectedProvince.population / 1000000).toFixed(1)}M
                          </p>
                          <p className="text-xs text-slate-600">Dân số</p>
                        </div>
                        
                        <div className="text-center p-3 bg-green-50 rounded-lg">
                          <Map className="w-6 h-6 text-green-600 mx-auto mb-1" />
                          <p className="text-lg font-bold text-green-600">
                            {selectedProvince.area.toLocaleString()} km²
                          </p>
                          <p className="text-xs text-slate-600">Diện tích</p>
                        </div>
                        
                        <div className="text-center p-3 bg-purple-50 rounded-lg">
                          <Building className="w-6 h-6 text-purple-600 mx-auto mb-1" />
                          <p className="text-lg font-bold text-purple-600">
                            {selectedProvince.economicZones}
                          </p>
                          <p className="text-xs text-slate-600">KCN/KKT</p>
                        </div>
                        
                        <div className="text-center p-3 bg-orange-50 rounded-lg">
                          <TrendingUp className="w-6 h-6 text-orange-600 mx-auto mb-1" />
                          <p className="text-lg font-bold text-orange-600">
                            {(selectedProvince.logistics.monthlyVolume / 1000).toLocaleString()}K
                          </p>
                          <p className="text-xs text-slate-600">Tấn/tháng</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="p-3 border rounded-lg">
                          <p className="text-2xl font-bold text-slate-800">
                            {selectedProvince.logistics.warehouses}
                          </p>
                          <p className="text-sm text-slate-600">Kho bãi</p>
                        </div>
                        
                        <div className="p-3 border rounded-lg">
                          <p className="text-2xl font-bold text-slate-800">
                            {selectedProvince.logistics.distributionCenters}
                          </p>
                          <p className="text-sm text-slate-600">Trung tâm phân phối</p>
                        </div>
                        
                        <div className="p-3 border rounded-lg">
                          <p className="text-2xl font-bold text-slate-800">
                            {selectedProvince.logistics.activeRoutes}
                          </p>
                          <p className="text-sm text-slate-600">Tuyến đường</p>
                        </div>
                        
                        <div className="p-3 border rounded-lg">
                          <p className="text-2xl font-bold text-slate-800">
                            {selectedProvince.ports + selectedProvince.airports}
                          </p>
                          <p className="text-sm text-slate-600">Cảng/Sân bay</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Logistics Hubs</CardTitle>
                      <CardDescription>
                        Các trung tâm logistics chính tại {selectedProvince.name}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {logisticsHubs
                          .filter(hub => hub.province === selectedProvince.name)
                          .map((hub) => (
                            <div key={hub.id} className="flex items-center gap-3 p-3 border rounded-lg">
                              <div className={`p-2 rounded-full ${getHubTypeColor(hub.type)}`}>
                                {getHubTypeIcon(hub.type)}
                              </div>
                              <div className="flex-1">
                                <h4 className="font-medium">{hub.name}</h4>
                                <p className="text-sm text-slate-600">
                                  Công suất: {hub.capacity.toLocaleString()} tấn
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="text-sm font-medium">{hub.utilization}%</p>
                                <p className="text-xs text-slate-500">Sử dụng</p>
                              </div>
                            </div>
                          ))}
                      </div>
                    </CardContent>
                  </Card>
                </>
              ) : (
                <Card>
                  <CardContent className="p-12 text-center">
                    <Map className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                    <h3 className="text-xl font-medium text-slate-600 mb-2">
                      Chọn tỉnh/thành phố
                    </h3>
                    <p className="text-slate-500">
                      Chọn một tỉnh/thành phố từ danh sách bên trái để xem thông tin chi tiết
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  )
}

export default VietnamMapPage
