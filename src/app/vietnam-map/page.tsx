'use client'

import React, { useState, useEffect, useRef } from 'react'
import Layout from '@/components/Layout'
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  Button,
  Input,
  Badge
} from '@/components/ui-components'
import { 
  Map, 
  Navigation, 
  MapPin, 
  Route, 
  Clock, 
  DollarSign, 
  Fuel, 
  AlertTriangle,
  CheckCircle,
  Truck,
  Calculator,
  Zap,
  Search,
  Warehouse,
  TrendingUp,
  Target
} from 'lucide-react'
import { RouteOptimizer, Location, OptimizedRoute, RouteOptimizationRequest } from '@/lib/routeOptimizer'

const VietnamMapPage = () => {
  const [departure, setDeparture] = useState('')
  const [destination, setDestination] = useState('')
  const [vehicleType, setVehicleType] = useState<'truck' | 'van' | 'car'>('truck')
  const [optimizedRoute, setOptimizedRoute] = useState<OptimizedRoute | null>(null)
  const [isCalculating, setIsCalculating] = useState(false)
  const [departureResults, setDepartureResults] = useState<Location[]>([])
  const [destinationResults, setDestinationResults] = useState<Location[]>([])
  const [showDepartureResults, setShowDepartureResults] = useState(false)
  const [showDestinationResults, setShowDestinationResults] = useState(false)
  const [selectedDeparture, setSelectedDeparture] = useState<Location | null>(null)
  const [selectedDestination, setSelectedDestination] = useState<Location | null>(null)
  const [availableDepots, setAvailableDepots] = useState<Location[]>([])
  const [popularRoutes, setPopularRoutes] = useState<Array<{departure: string, destination: string, frequency: number}>>([])

  const departureInputRef = useRef<HTMLInputElement>(null)
  const destinationInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setAvailableDepots(RouteOptimizer.getAvailableDepots())
    setPopularRoutes(RouteOptimizer.getPopularRoutes())
  }, [])

  const handleDepartureSearch = (query: string) => {
    setDeparture(query)
    if (query.length > 1) {
      const results = RouteOptimizer.searchLocations(query)
      setDepartureResults(results)
      setShowDepartureResults(true)
    } else {
      setShowDepartureResults(false)
    }
  }

  const handleDestinationSearch = (query: string) => {
    setDestination(query)
    if (query.length > 1) {
      const results = RouteOptimizer.searchLocations(query)
      setDestinationResults(results)
      setShowDestinationResults(true)
    } else {
      setShowDestinationResults(false)
    }
  }

  const selectDeparture = (location: Location) => {
    setSelectedDeparture(location)
    setDeparture(location.name)
    setShowDepartureResults(false)
  }

  const selectDestination = (location: Location) => {
    setSelectedDestination(location)
    setDestination(location.name)
    setShowDestinationResults(false)
  }

  const calculateOptimalRoute = async () => {
    if (!selectedDeparture || !selectedDestination) {
      alert('Vui lòng chọn điểm đi và điểm đến')
      return
    }

    setIsCalculating(true)
    
    try {
      const request: RouteOptimizationRequest = {
        departure: selectedDeparture,
        destination: selectedDestination,
        depots: availableDepots,
        vehicleType: vehicleType
      }

      const route = await RouteOptimizer.optimizeRoute(request)
      setOptimizedRoute(route)
    } catch (error) {
      console.error('Error calculating route:', error)
      alert('Có lỗi xảy ra khi tính toán tuyến đường')
    }
    
    setIsCalculating(false)
  }

  const setQuickRoute = (dep: string, dest: string) => {
    const depLocation = RouteOptimizer.searchLocations(dep)[0]
    const destLocation = RouteOptimizer.searchLocations(dest)[0]
    
    if (depLocation && destLocation) {
      setSelectedDeparture(depLocation)
      setSelectedDestination(destLocation)
      setDeparture(depLocation.name)
      setDestination(destLocation.name)
    }
  }

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low': return 'badge-success'
      case 'medium': return 'badge-warning'
      case 'high': return 'badge-error'
      default: return 'badge-info'
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount)
  }

  const getVehicleIcon = (type: string) => {
    switch (type) {
      case 'truck': return <Truck className="w-4 h-4" />
      case 'van': return <Truck className="w-4 h-4" />
      default: return <Truck className="w-4 h-4" />
    }
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold gradient-text flex items-center gap-3">
              <Map className="w-8 h-8 text-indigo-400" />
              Vietnam Map & Route Optimization
            </h1>
            <p className="text-slate-400 mt-1">
              Tối ưu hóa tuyến đường thông minh với AI cho logistics Việt Nam
            </p>
          </div>
          <Badge className="badge-info">
            AI-Powered Routing
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Route Planning Panel */}
          <div className="lg:col-span-1 space-y-4">
            <Card className="dark-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Navigation className="w-5 h-5 text-indigo-400" />
                  Lập kế hoạch tuyến đường
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Nhập điểm đi và điểm đến để tính toán tuyến đường tối ưu
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative">
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Điểm khởi hành
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                      ref={departureInputRef}
                      value={departure}
                      onChange={(e) => handleDepartureSearch(e.target.value)}
                      placeholder="Nhập tên thành phố (VD: TP. Hồ Chí Minh)"
                      className="dark-input pl-10"
                    />
                  </div>
                  {showDepartureResults && departureResults.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-slate-800 border border-slate-700 rounded-xl shadow-xl max-h-60 overflow-y-auto">
                      {departureResults.map((location, index) => (
                        <button
                          key={index}
                          onClick={() => selectDeparture(location)}
                          className="w-full text-left px-4 py-3 hover:bg-slate-700 flex items-center gap-3 transition-colors"
                        >
                          <MapPin className="w-4 h-4 text-indigo-400" />
                          <div>
                            <div className="font-medium text-white">{location.name}</div>
                            <div className="text-sm text-slate-400">{location.address}</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="relative">
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Điểm đến
                  </label>
                  <div className="relative">
                    <Target className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                      ref={destinationInputRef}
                      value={destination}
                      onChange={(e) => handleDestinationSearch(e.target.value)}
                      placeholder="Nhập điểm đến (VD: Hà Nội)"
                      className="dark-input pl-10"
                    />
                  </div>
                  {showDestinationResults && destinationResults.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-slate-800 border border-slate-700 rounded-xl shadow-xl max-h-60 overflow-y-auto">
                      {destinationResults.map((location, index) => (
                        <button
                          key={index}
                          onClick={() => selectDestination(location)}
                          className="w-full text-left px-4 py-3 hover:bg-slate-700 flex items-center gap-3 transition-colors"
                        >
                          <MapPin className="w-4 h-4 text-red-400" />
                          <div>
                            <div className="font-medium text-white">{location.name}</div>
                            <div className="text-sm text-slate-400">{location.address}</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Loại phương tiện
                  </label>
                  <select
                    value={vehicleType}
                    onChange={(e) => setVehicleType(e.target.value as 'truck' | 'van' | 'car')}
                    className="dark-input w-full"
                  >
                    <option value="truck">Xe tải (Nặng)</option>
                    <option value="van">Xe van (Trung bình)</option>
                    <option value="car">Xe con (Nhẹ)</option>
                  </select>
                </div>

                <Button
                  onClick={calculateOptimalRoute}
                  disabled={isCalculating || !selectedDeparture || !selectedDestination}
                  className="gradient-button w-full"
                >
                  {isCalculating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Đang tính toán...
                    </>
                  ) : (
                    <>
                      <Route className="w-4 h-4 mr-2" />
                      Tính toán tuyến đường tối ưu
                    </>
                  )}
                </Button>

                {/* Popular Routes */}
                <div className="space-y-2">
                  <p className="text-sm font-medium text-slate-300">Tuyến đường phổ biến:</p>
                  <div className="grid grid-cols-1 gap-2">
                    {popularRoutes.slice(0, 4).map((route, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        onClick={() => setQuickRoute(route.departure, route.destination)}
                        className="dark-button text-left justify-start"
                      >
                        <div className="flex items-center justify-between w-full">
                          <span className="text-sm">{route.departure} → {route.destination}</span>
                          <Badge className="badge-info text-xs">
                            {route.frequency}%
                          </Badge>
                        </div>
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Route Results */}
            {optimizedRoute && (
              <Card className="dark-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Calculator className="w-5 h-5 text-emerald-400" />
                    Kết quả phân tích
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-indigo-500/10 rounded-xl border border-indigo-500/20">
                      <MapPin className="w-5 h-5 text-indigo-400 mx-auto mb-1" />
                      <p className="text-sm text-slate-400">Khoảng cách</p>
                      <p className="font-bold text-indigo-400">{optimizedRoute.distance} km</p>
                    </div>
                    <div className="text-center p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                      <Clock className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
                      <p className="text-sm text-slate-400">Thời gian</p>
                      <p className="font-bold text-emerald-400">{optimizedRoute.duration} giờ</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-400">Chi phí xăng:</span>
                      <span className="font-medium text-white">{formatCurrency(optimizedRoute.cost.fuel)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-400">Phí cầu đường:</span>
                      <span className="font-medium text-white">{formatCurrency(optimizedRoute.cost.tolls)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-400">Chi phí lái xe:</span>
                      <span className="font-medium text-white">{formatCurrency(optimizedRoute.cost.driver)}</span>
                    </div>
                    <div className="flex justify-between items-center border-t border-slate-700 pt-2">
                      <span className="font-medium text-white">Tổng chi phí:</span>
                      <span className="font-bold text-lg gradient-text">
                        {formatCurrency(optimizedRoute.cost.total)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-400">Mức độ rủi ro:</span>
                    <Badge className={getRiskColor(optimizedRoute.riskLevel)}>
                      {optimizedRoute.riskLevel === 'low' ? 'Thấp' : 
                       optimizedRoute.riskLevel === 'medium' ? 'Trung bình' : 'Cao'}
                    </Badge>
                  </div>

                  {/* Waypoints */}
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-slate-300">Điểm dừng:</p>
                    {optimizedRoute.waypoints.map((waypoint, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        {index === 0 ? (
                          <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                        ) : index === optimizedRoute.waypoints.length - 1 ? (
                          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        ) : (
                          <Warehouse className="w-3 h-3 text-amber-400" />
                        )}
                        <span className="text-slate-300">{waypoint.name}</span>
                        {waypoint.type === 'depot' && (
                          <Badge className="badge-warning text-xs">Kho</Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Map Display */}
          <div className="lg:col-span-2">
            <Card className="dark-card h-[600px]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Map className="w-5 h-5 text-indigo-400" />
                  Bản đồ Việt Nam tương tác
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Hiển thị tuyến đường trực quan với dữ liệu logistics thời gian thực
                </CardDescription>
              </CardHeader>
              <CardContent className="h-full p-0">
                <div className="w-full h-full bg-gradient-to-br from-slate-900 to-slate-800 rounded-b-xl flex items-center justify-center relative overflow-hidden">
                  {/* Enhanced Vietnam Map Representation */}
                  <div className="relative w-full h-full flex items-center justify-center">
                    <div className="text-center space-y-4">
                      <div className="w-80 h-[480px] bg-gradient-to-b from-slate-700 to-slate-800 rounded-2xl relative mx-auto shadow-2xl border border-slate-600">
                        {/* Vietnam shape with enhanced styling */}
                        <div className="absolute inset-0 bg-gradient-to-b from-slate-600 to-slate-700 rounded-2xl overflow-hidden">
                          {/* Major cities markers with enhanced styling */}
                          <div className="absolute top-12 left-1/2 transform -translate-x-1/2">
                            <div className={`w-4 h-4 rounded-full shadow-lg ${selectedDeparture?.name === 'Hà Nội' || selectedDestination?.name === 'Hà Nội' ? 'bg-gradient-to-r from-indigo-500 to-purple-500 animate-pulse-glow' : 'bg-red-500'}`}></div>
                            <span className="text-xs font-medium text-white absolute -bottom-6 left-1/2 transform -translate-x-1/2 whitespace-nowrap bg-slate-800 px-2 py-1 rounded">
                              Hà Nội
                            </span>
                          </div>
                          <div className="absolute bottom-12 right-12">
                            <div className={`w-4 h-4 rounded-full shadow-lg ${selectedDeparture?.name === 'TP. Hồ Chí Minh' || selectedDestination?.name === 'TP. Hồ Chí Minh' ? 'bg-gradient-to-r from-indigo-500 to-purple-500 animate-pulse-glow' : 'bg-red-500'}`}></div>
                            <span className="text-xs font-medium text-white absolute -bottom-6 left-1/2 transform -translate-x-1/2 whitespace-nowrap bg-slate-800 px-2 py-1 rounded">
                              TP.HCM
                            </span>
                          </div>
                          <div className="absolute top-1/2 right-6 transform -translate-y-1/2">
                            <div className={`w-4 h-4 rounded-full shadow-lg ${selectedDeparture?.name === 'Đà Nẵng' || selectedDestination?.name === 'Đà Nẵng' ? 'bg-gradient-to-r from-indigo-500 to-purple-500 animate-pulse-glow' : 'bg-red-500'}`}></div>
                            <span className="text-xs font-medium text-white absolute -bottom-6 left-1/2 transform -translate-x-1/2 whitespace-nowrap bg-slate-800 px-2 py-1 rounded">
                              Đà Nẵng
                            </span>
                          </div>
                          
                          {/* Depot markers */}
                          {availableDepots.slice(0, 3).map((depot, index) => (
                            <div key={index} className={`absolute w-3 h-3 bg-amber-400 rounded-full shadow-lg ${optimizedRoute?.waypoints.some(wp => wp.name === depot.name) ? 'animate-pulse-glow' : ''}`} 
                                 style={{ 
                                   top: `${20 + index * 15}%`, 
                                   left: `${30 + index * 20}%` 
                                 }}>
                              <span className="text-xs font-medium text-white absolute -bottom-6 left-1/2 transform -translate-x-1/2 whitespace-nowrap bg-slate-800 px-2 py-1 rounded">
                                {depot.name}
                              </span>
                            </div>
                          ))}
                          
                          {/* Route line if both locations are set */}
                          {selectedDeparture && selectedDestination && optimizedRoute && (
                            <div className="absolute inset-0">
                              <svg className="w-full h-full">
                                <defs>
                                  <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="#6366f1" />
                                    <stop offset="100%" stopColor="#8b5cf6" />
                                  </linearGradient>
                                </defs>
                                <path
                                  d="M 160 80 Q 200 200 240 360"
                                  stroke="url(#routeGradient)"
                                  strokeWidth="4"
                                  fill="none"
                                  strokeDasharray="8,4"
                                  className="animate-pulse"
                                />
                                {/* Waypoint indicators */}
                                {optimizedRoute.waypoints.length > 2 && (
                                  <circle cx="200" cy="200" r="6" fill="#f59e0b" className="animate-pulse" />
                                )}
                              </svg>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {!selectedDeparture || !selectedDestination ? (
                        <div className="text-slate-400">
                          <MapPin className="w-8 h-8 mx-auto mb-2" />
                          <p className="font-medium">Chọn điểm đi và điểm đến</p>
                          <p className="text-sm">để xem trực quan hóa tuyến đường</p>
                        </div>
                      ) : optimizedRoute ? (
                        <div className="glass-effect rounded-xl p-4 shadow-xl max-w-sm mx-auto">
                          <div className="flex items-center gap-2 mb-2">
                            <CheckCircle className="w-5 h-5 text-emerald-400" />
                            <span className="font-medium text-white">Tuyến đường đã tính toán</span>
                          </div>
                          <p className="text-sm text-slate-300">
                            {selectedDeparture.name} → {selectedDestination.name}
                          </p>
                          <div className="flex items-center gap-4 mt-2">
                            <p className="text-lg font-bold gradient-text">
                              {optimizedRoute.distance} km
                            </p>
                            <p className="text-lg font-bold text-emerald-400">
                              {optimizedRoute.duration} giờ
                            </p>
                          </div>
                          {optimizedRoute.waypoints.length > 2 && (
                            <p className="text-xs text-amber-400 mt-1">
                              Qua {optimizedRoute.waypoints.length - 2} kho trung chuyển
                            </p>
                          )}
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* AI Recommendations */}
        {optimizedRoute && (
          <Card className="dark-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Zap className="w-5 h-5 text-yellow-400" />
                Đề xuất tối ưu hóa AI
              </CardTitle>
              <CardDescription className="text-slate-400">
                Thông tin chi tiết thông minh và đề xuất tối ưu hóa cho tuyến đường của bạn
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {optimizedRoute.recommendations.map((rec, index) => (
                  <div key={index} className="flex items-start gap-3 p-4 bg-gradient-to-r from-yellow-500/10 to-amber-500/10 rounded-xl border border-yellow-500/20">
                    <Zap className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-slate-300">{rec}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Available Depots */}
        <Card className="dark-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Warehouse className="w-5 h-5 text-amber-400" />
              Kho và trung tâm logistics có sẵn
            </CardTitle>
            <CardDescription className="text-slate-400">
              Mạng lưới kho bãi và trung tâm phân phối trên toàn quốc
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {availableDepots.map((depot, index) => (
                <div key={index} className="p-4 bg-slate-800/30 rounded-xl border border-slate-700/50 hover:border-amber-500/30 transition-colors">
                  <div className="flex items-center gap-2 mb-2">
                    <Warehouse className="w-4 h-4 text-amber-400" />
                    <h4 className="font-medium text-white">{depot.name}</h4>
                  </div>
                  <p className="text-sm text-slate-400">{depot.address}</p>
                  <Badge className="badge-warning mt-2 text-xs">
                    Kho trung chuyển
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}

export default VietnamMapPage
