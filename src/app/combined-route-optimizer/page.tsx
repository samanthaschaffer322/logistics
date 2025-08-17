'use client'

import React, { useState, useEffect } from 'react'
import AuthGuard from '@/components/AuthGuard'
import { useLanguage } from '@/contexts/LanguageContext'
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  Button,
  Input,
  Label,
  Badge
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
  Filter,
  Navigation2,
  Fuel,
  Calculator,
  Zap,
  Anchor,
  Warehouse,
  Factory,
  DollarSign,
  Globe,
  Plane,
  Ship,
  ArrowRight,
  CheckCircle,
  AlertTriangle,
  Info,
  Settings
} from 'lucide-react'
import {
  ENHANCED_VIETNAM_LOCATIONS,
  calculateEnhancedRoute,
  searchEnhancedLocations,
  getLocationsByType,
  getLocationsByRegion,
  type EnhancedLocation,
  type RouteCalculation
} from '@/lib/enhancedVietnameseLocations'

const CombinedRouteOptimizer = () => {
  const { t } = useLanguage()
  const [fromLocation, setFromLocation] = useState<string>('')
  const [toLocation, setToLocation] = useState<string>('')
  const [vehicleType, setVehicleType] = useState<'20ft' | '40ft' | 'truck' | 'van'>('20ft')
  const [optimizeFor, setOptimizeFor] = useState<'cost' | 'time' | 'distance'>('cost')
  const [routeResult, setRouteResult] = useState<RouteCalculation | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredLocations, setFilteredLocations] = useState<EnhancedLocation[]>(ENHANCED_VIETNAM_LOCATIONS)
  const [isCalculating, setIsCalculating] = useState(false)

  useEffect(() => {
    let filtered = ENHANCED_VIETNAM_LOCATIONS

    // Apply search filter
    if (searchQuery) {
      filtered = searchEnhancedLocations(searchQuery)
    }

    setFilteredLocations(filtered)
  }, [searchQuery])

  const handleCalculateRoute = async () => {
    if (!fromLocation || !toLocation) {
      alert('Vui lòng chọn điểm xuất phát và điểm đến')
      return
    }

    setIsCalculating(true)
    
    // Simulate calculation delay for better UX
    await new Promise(resolve => setTimeout(resolve, 1500))

    try {
      const result = calculateEnhancedRoute(fromLocation, toLocation, vehicleType)
      setRouteResult(result)
    } catch (error) {
      console.error('Route calculation error:', error)
      alert('Có lỗi xảy ra khi tính toán tuyến đường')
    } finally {
      setIsCalculating(false)
    }
  }

  const getLocationIcon = (type: EnhancedLocation['type']) => {
    switch (type) {
      case 'port': return <Anchor className="w-4 h-4" />
      case 'city': return <Building className="w-4 h-4" />
      case 'industrial_zone': return <Factory className="w-4 h-4" />
      case 'airport': return <Plane className="w-4 h-4" />
      case 'border_gate': return <Globe className="w-4 h-4" />
      default: return <MapPin className="w-4 h-4" />
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount)
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-4">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center">
                <Navigation className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Tối Ưu Tuyến Đường Tổng Hợp
                </h1>
                <p className="text-xl text-slate-300 mt-2">
                  Hệ thống tối ưu hóa tuyến đường thông minh với bản đồ Việt Nam chi tiết
                </p>
              </div>
            </div>
            
            <div className="flex items-center justify-center gap-4">
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30 px-4 py-2">
                <CheckCircle className="w-4 h-4 mr-2" />
                28+ Cảng biển
              </Badge>
              <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 px-4 py-2">
                <MapPin className="w-4 h-4 mr-2" />
                50+ Thành phố
              </Badge>
              <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 px-4 py-2">
                <Factory className="w-4 h-4 mr-2" />
                15+ KCN
              </Badge>
              <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 px-4 py-2">
                <Plane className="w-4 h-4 mr-2" />
                10+ Sân bay
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Route Configuration Panel */}
            <div className="lg:col-span-1 space-y-6">
              <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-white">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                      <Settings className="w-4 h-4 text-white" />
                    </div>
                    Cấu Hình Tối Ưu
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* From Location */}
                  <div className="space-y-2">
                    <Label className="text-slate-200 font-medium">Điểm xuất phát</Label>
                    <select 
                      value={fromLocation} 
                      onChange={(e) => setFromLocation(e.target.value)}
                      className="w-full bg-slate-700/50 border border-slate-600/50 text-white rounded-lg p-3"
                    >
                      <option value="">Chọn điểm xuất phát...</option>
                      {filteredLocations.map((location) => (
                        <option key={location.id} value={location.id}>
                          {location.name} ({location.type})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* To Location */}
                  <div className="space-y-2">
                    <Label className="text-slate-200 font-medium">Điểm đến</Label>
                    <select 
                      value={toLocation} 
                      onChange={(e) => setToLocation(e.target.value)}
                      className="w-full bg-slate-700/50 border border-slate-600/50 text-white rounded-lg p-3"
                    >
                      <option value="">Chọn điểm đến...</option>
                      {filteredLocations.map((location) => (
                        <option key={location.id} value={location.id}>
                          {location.name} ({location.type})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Vehicle Type */}
                  <div className="space-y-2">
                    <Label className="text-slate-200 font-medium">Loại xe</Label>
                    <select 
                      value={vehicleType} 
                      onChange={(e) => setVehicleType(e.target.value as '20ft' | '40ft' | 'truck' | 'van')}
                      className="w-full bg-slate-700/50 border border-slate-600/50 text-white rounded-lg p-3"
                    >
                      <option value="20ft">20ft Container</option>
                      <option value="40ft">40ft Container</option>
                      <option value="truck">Xe tải thường</option>
                      <option value="van">Xe van</option>
                    </select>
                  </div>

                  {/* Optimize For */}
                  <div className="space-y-2">
                    <Label className="text-slate-200 font-medium">Tối ưu cho</Label>
                    <select 
                      value={optimizeFor} 
                      onChange={(e) => setOptimizeFor(e.target.value as 'cost' | 'time' | 'distance')}
                      className="w-full bg-slate-700/50 border border-slate-600/50 text-white rounded-lg p-3"
                    >
                      <option value="cost">Chi phí</option>
                      <option value="time">Thời gian</option>
                      <option value="distance">Khoảng cách</option>
                    </select>
                  </div>

                  {/* Calculate Button */}
                  <Button 
                    onClick={handleCalculateRoute}
                    disabled={isCalculating || !fromLocation || !toLocation}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold py-3 rounded-xl"
                  >
                    {isCalculating ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Đang tính toán...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Calculator className="w-4 h-4" />
                        Tối Ưu AI
                      </div>
                    )}
                  </Button>
                </CardContent>
              </Card>

              {/* Search */}
              <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-white">
                    <Filter className="w-5 h-5" />
                    Tìm kiếm địa điểm
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                    <Input
                      placeholder="Tìm kiếm địa điểm..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 bg-slate-700/50 border-slate-600/50 text-white placeholder-slate-400"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Results and Map Area */}
            <div className="lg:col-span-2 space-y-6">
              {/* Route Results */}
              {routeResult && (
                <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50 shadow-xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-white">
                      <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                        <CheckCircle className="w-4 h-4 text-white" />
                      </div>
                      Kết quả tối ưu hóa
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                      <div className="bg-slate-700/30 rounded-xl p-4 text-center">
                        <Navigation className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-white">{routeResult.distance} km</div>
                        <div className="text-slate-400 text-sm">Khoảng cách</div>
                      </div>
                      <div className="bg-slate-700/30 rounded-xl p-4 text-center">
                        <Clock className="w-8 h-8 text-green-400 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-white">{routeResult.duration}h</div>
                        <div className="text-slate-400 text-sm">Thời gian</div>
                      </div>
                      <div className="bg-slate-700/30 rounded-xl p-4 text-center">
                        <Fuel className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-white">{formatCurrency(routeResult.fuelCost)}</div>
                        <div className="text-slate-400 text-sm">Chi phí nhiên liệu</div>
                      </div>
                      <div className="bg-slate-700/30 rounded-xl p-4 text-center">
                        <DollarSign className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-white">{formatCurrency(routeResult.totalCost)}</div>
                        <div className="text-slate-400 text-sm">Tổng chi phí</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-slate-700/30 rounded-xl p-4">
                        <h4 className="text-white font-semibold mb-2 flex items-center gap-2">
                          <Info className="w-4 h-4" />
                          Thông tin tuyến đường
                        </h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-slate-400">Tình trạng đường:</span>
                            <Badge className={`text-xs ${
                              routeResult.roadConditions === 'excellent' ? 'bg-green-500/20 text-green-400' :
                              routeResult.roadConditions === 'good' ? 'bg-blue-500/20 text-blue-400' :
                              routeResult.roadConditions === 'fair' ? 'bg-yellow-500/20 text-yellow-400' :
                              'bg-red-500/20 text-red-400'
                            }`}>
                              {routeResult.roadConditions === 'excellent' ? 'Xuất sắc' :
                               routeResult.roadConditions === 'good' ? 'Tốt' :
                               routeResult.roadConditions === 'fair' ? 'Khá' : 'Kém'}
                            </Badge>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Chi phí cầu đường:</span>
                            <span className="text-white">{formatCurrency(routeResult.tollCost)}</span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-slate-700/30 rounded-xl p-4">
                        <h4 className="text-white font-semibold mb-2 flex items-center gap-2">
                          <Navigation className="w-4 h-4" />
                          Tuyến đường
                        </h4>
                        <div className="space-y-2">
                          {routeResult.route.map((location, index) => (
                            <div key={index} className="flex items-center gap-2 text-sm">
                              {index === 0 ? (
                                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                              ) : (
                                <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                              )}
                              <span className="text-white">{location}</span>
                              {index < routeResult.route.length - 1 && (
                                <ArrowRight className="w-3 h-3 text-slate-400 ml-auto" />
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Vietnam Map Placeholder */}
              <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-white">
                    <Map className="w-5 h-5" />
                    Bản đồ Việt Nam tương tác
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-slate-700/30 rounded-xl p-8 text-center min-h-[400px] flex items-center justify-center">
                    <div className="text-center">
                      <Map className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-white mb-2">Bản đồ tương tác</h3>
                      <p className="text-slate-400 mb-4">
                        Bản đồ Việt Nam chi tiết với {ENHANCED_VIETNAM_LOCATIONS.length} địa điểm
                      </p>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="bg-slate-600/30 rounded-lg p-3">
                          <Anchor className="w-6 h-6 text-blue-400 mx-auto mb-1" />
                          <div className="text-white font-medium">{getLocationsByType('port').length}</div>
                          <div className="text-slate-400">Cảng biển</div>
                        </div>
                        <div className="bg-slate-600/30 rounded-lg p-3">
                          <Building className="w-6 h-6 text-green-400 mx-auto mb-1" />
                          <div className="text-white font-medium">{getLocationsByType('city').length}</div>
                          <div className="text-slate-400">Thành phố</div>
                        </div>
                        <div className="bg-slate-600/30 rounded-lg p-3">
                          <Factory className="w-6 h-6 text-purple-400 mx-auto mb-1" />
                          <div className="text-white font-medium">{getLocationsByType('industrial_zone').length}</div>
                          <div className="text-slate-400">KCN</div>
                        </div>
                        <div className="bg-slate-600/30 rounded-lg p-3">
                          <Plane className="w-6 h-6 text-yellow-400 mx-auto mb-1" />
                          <div className="text-white font-medium">{getLocationsByType('airport').length}</div>
                          <div className="text-slate-400">Sân bay</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  )
}

export default CombinedRouteOptimizer
