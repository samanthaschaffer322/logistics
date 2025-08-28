'use client'

import React, { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { useLanguage } from '@/contexts/LanguageContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Navigation, 
  MapPin, 
  Truck, 
  Clock, 
  DollarSign, 
  Target,
  Zap,
  BarChart3,
  CheckCircle
} from 'lucide-react'
import { EnhancedRouteCalculator } from '@/utils/enhancedRouteCalculator'

// Dynamic import for Leaflet map to avoid SSR issues
const LeafletRouteMap = dynamic(() => import('@/components/LeafletRouteMap'), {
  ssr: false,
  loading: () => (
    <div style={{
      height: '400px',
      background: 'rgba(30, 41, 59, 0.8)',
      borderRadius: '15px',
      border: '2px solid rgba(139, 92, 246, 0.3)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column'
    }}>
      <div style={{ fontSize: '48px', marginBottom: '15px' }}>🗺️</div>
      <div style={{ color: '#8b5cf6', fontSize: '18px', fontWeight: 'bold' }}>Loading Interactive Map...</div>
    </div>
  )
})

interface FleetbaseRoute {
  id: string
  name: string
  origin: { name: string; lat: number; lng: number; address: string; province: string }
  destination: { name: string; lat: number; lng: number; address: string; province: string }
  distance: number
  duration: number
  cost: number
  efficiency: number
  status: 'active' | 'completed' | 'pending' | 'cancelled'
  driver?: string
  vehicle?: string
  cargo?: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
  weather: 'clear' | 'rain' | 'storm' | 'fog'
  traffic: 'light' | 'moderate' | 'heavy' | 'severe'
}

export default function CombinedRouteOptimizerPage() {
  const { language } = useLanguage()
  const [activeView, setActiveView] = useState('optimizer')
  const [originQuery, setOriginQuery] = useState('')
  const [destinationQuery, setDestinationQuery] = useState('')
  const [routes, setRoutes] = useState<FleetbaseRoute[]>([])
  const [selectedRoute, setSelectedRoute] = useState<any>(null)
  const [optimizing, setOptimizing] = useState(false)
  const [isCalculating, setIsCalculating] = useState(false)

  // Comprehensive Vietnamese locations
  const vietnameseLocations = [
    // Major Ports
    { name: 'Cảng Cát Lái', lat: 10.8100, lng: 106.7800, province: 'Ho Chi Minh City', type: 'port' },
    { name: 'Cảng Thị Vải', lat: 10.6100, lng: 107.0700, province: 'Ba Ria - Vung Tau', type: 'port' },
    { name: 'Cảng Phú Mỹ', lat: 10.6200, lng: 107.0900, province: 'Ba Ria - Vung Tau', type: 'port' },
    { name: 'Cảng Đà Nẵng', lat: 16.0544, lng: 108.2022, province: 'Da Nang', type: 'port' },
    { name: 'Cảng Hải Phòng', lat: 20.8449, lng: 106.6881, province: 'Hai Phong', type: 'port' },
    
    // Major Cities
    { name: 'TP. Hồ Chí Minh', lat: 10.8231, lng: 106.6297, province: 'Ho Chi Minh City', type: 'city' },
    { name: 'Hà Nội', lat: 21.0285, lng: 105.8542, province: 'Hanoi', type: 'city' },
    { name: 'Đà Nẵng', lat: 16.0544, lng: 108.2022, province: 'Da Nang', type: 'city' },
    { name: 'Cần Thơ', lat: 10.0452, lng: 105.7469, province: 'Can Tho', type: 'city' },
    { name: 'Biên Hòa', lat: 10.9460, lng: 106.8234, province: 'Dong Nai', type: 'city' },
    { name: 'Nha Trang', lat: 12.2388, lng: 109.1967, province: 'Khanh Hoa', type: 'city' }
  ]

  const searchLocations = (query: string) => {
    if (!query.trim()) return []
    
    const normalizedQuery = query.toLowerCase()
      .replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a')
      .replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e')
      .replace(/ì|í|ị|ỉ|ĩ/g, 'i')
      .replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o')
      .replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u')
      .replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y')
      .replace(/đ/g, 'd')
    
    return vietnameseLocations.filter(location => {
      const normalizedName = location.name.toLowerCase()
        .replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a')
        .replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e')
        .replace(/ì|í|ị|ỉ|ĩ/g, 'i')
        .replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o')
        .replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u')
        .replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y')
        .replace(/đ/g, 'd')
      
      return normalizedName.includes(normalizedQuery) || 
             location.province.toLowerCase().includes(normalizedQuery)
    }).slice(0, 5)
  }

  const calculateRoute = async () => {
    if (!originQuery.trim() || !destinationQuery.trim()) {
      alert(language === 'vi' ? 'Vui lòng nhập điểm xuất phát và điểm đến' : 'Please enter both origin and destination locations')
      return
    }

    setIsCalculating(true)
    await new Promise(resolve => setTimeout(resolve, 2000))

    const originResults = searchLocations(originQuery)
    const destResults = searchLocations(destinationQuery)

    if (originResults.length === 0 || destResults.length === 0) {
      alert(language === 'vi' ? 'Không tìm thấy địa điểm. Vui lòng thử lại.' : 'Could not find locations. Please try again.')
      setIsCalculating(false)
      return
    }

    const originLoc = originResults[0]
    const destLoc = destResults[0]

    // Calculate distance using Haversine formula
    const R = 6371
    const dLat = (destLoc.lat - originLoc.lat) * Math.PI / 180
    const dLon = (destLoc.lng - originLoc.lng) * Math.PI / 180
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(originLoc.lat * Math.PI / 180) * Math.cos(destLoc.lat * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    const distance = Math.round(R * c)

    // Enhanced calculations with Vietnamese logistics factors
    const factors = EnhancedRouteCalculator.getCurrentConditions()
    const optimizedResult = EnhancedRouteCalculator.calculateEnhancedRoute(
      originLoc.name,
      destLoc.name,
      distance,
      factors
    )

    setSelectedRoute({
      origin: { ...originLoc, province: originLoc.province },
      destination: { ...destLoc, province: destLoc.province },
      distance: `${optimizedResult.actualDistance} km`,
      time: `${Math.round(optimizedResult.actualTime/60)}h ${optimizedResult.actualTime%60}min`,
      cost: `${(optimizedResult.actualCost / 1000000).toFixed(3)} triệu VND`,
      efficiency: `${optimizedResult.efficiency}%`,
      fuelConsumption: `${optimizedResult.actualFuelConsumption.toFixed(1)}L`,
      avgSpeed: `${Math.round(distance / (optimizedResult.actualTime/60))} km/h`,
      truckType: 'Container Truck (40ft)',
      loadCapacity: '33 tons'
    })

    setIsCalculating(false)
  }

  // Vietnamese ports and locations
  const vietnamesePorts = [
    { name: 'Cảng Cát Lái', lat: 10.8100, lng: 106.7800, address: 'Cat Lai Port, Ho Chi Minh City', province: 'Ho Chi Minh City' },
    { name: 'Cảng Thị Vải', lat: 10.6100, lng: 107.0700, address: 'Thi Vai Port, Ba Ria - Vung Tau', province: 'Ba Ria - Vung Tau' },
    { name: 'Cảng Phú Mỹ', lat: 10.6200, lng: 107.0900, address: 'Phu My Port, Ba Ria - Vung Tau', province: 'Ba Ria - Vung Tau' },
    { name: 'Cảng Đà Nẵng', lat: 16.0544, lng: 108.2022, address: 'Da Nang Port, Da Nang City', province: 'Da Nang City' },
    { name: 'Cảng Hải Phòng', lat: 20.8449, lng: 106.6881, address: 'Hai Phong Port, Hai Phong City', province: 'Hai Phong City' }
  ]

  // Initialize with sample routes
  useEffect(() => {
    const sampleRoutes: FleetbaseRoute[] = [
      {
        id: 'route-001',
        name: 'Container Export Route',
        origin: vietnamesePorts[1], // Thị Vải
        destination: vietnamesePorts[0], // Cát Lái
        distance: 85,
        duration: 150,
        cost: 4200000,
        efficiency: 78,
        status: 'active',
        driver: 'Nguyễn Văn Minh',
        vehicle: '50H.08301',
        cargo: 'Container 40ft - Electronics',
        priority: 'high',
        weather: 'clear',
        traffic: 'moderate'
      },
      {
        id: 'route-002',
        name: 'Import Cargo Route',
        origin: vietnamesePorts[0], // Cát Lái
        destination: vietnamesePorts[3], // Đà Nẵng
        distance: 965,
        duration: 720,
        cost: 28500000,
        efficiency: 85,
        status: 'pending',
        driver: 'Trần Thanh Sơn',
        vehicle: '51C.56362',
        cargo: 'Container 20ft - Textiles',
        priority: 'medium',
        weather: 'rain',
        traffic: 'light'
      }
    ]
    setRoutes(sampleRoutes)
  }, [])

  const optimizeRoute = async (route: FleetbaseRoute) => {
    setOptimizing(true)
    
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const factors = EnhancedRouteCalculator.getCurrentConditions()
    const optimizedResult = EnhancedRouteCalculator.calculateEnhancedRoute(
      route.origin.name,
      route.destination.name,
      route.distance,
      factors
    )
    
    const optimizedRoute: FleetbaseRoute = {
      ...route,
      distance: optimizedResult.actualDistance,
      duration: optimizedResult.actualTime,
      cost: optimizedResult.actualCost,
      efficiency: optimizedResult.efficiency,
      weather: factors.weather,
      traffic: factors.trafficLevel,
      status: 'active'
    }
    
    setRoutes(prev => prev.map(r => r.id === route.id ? optimizedRoute : r))
    setSelectedRoute({
      origin: route.origin,
      destination: route.destination,
      distance: `${optimizedResult.actualDistance}km`,
      time: `${Math.round(optimizedResult.actualTime/60)}h ${optimizedResult.actualTime%60}m`
    })
    setOptimizing(false)
    
    alert(language === 'vi' 
      ? `🚛 Tối ưu tuyến đường thành công!\n📍 ${route.name}\n🛣️ ${optimizedResult.actualDistance}km\n⏱️ ${Math.round(optimizedResult.actualTime/60)}h ${optimizedResult.actualTime%60}m\n💰 ${optimizedResult.actualCost.toLocaleString('vi-VN')} VND\n⚡ Hiệu quả: ${optimizedResult.efficiency}%` 
      : `🚛 Route optimization successful!\n📍 ${route.name}\n🛣️ ${optimizedResult.actualDistance}km\n⏱️ ${Math.round(optimizedResult.actualTime/60)}h ${optimizedResult.actualTime%60}m\n💰 ${optimizedResult.actualCost.toLocaleString()} VND\n⚡ Efficiency: ${optimizedResult.efficiency}%`
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500'
      case 'completed': return 'bg-blue-500'
      case 'pending': return 'bg-yellow-500'
      case 'cancelled': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500'
      case 'high': return 'bg-orange-500'
      case 'medium': return 'bg-yellow-500'
      case 'low': return 'bg-green-500'
      default: return 'bg-gray-500'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-3xl mb-6 shadow-2xl">
            <Navigation className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 bg-clip-text text-transparent mb-4">
            🚛 {language === 'vi' ? 'Combined Route Optimizer Pro' : 'Combined Route Optimizer Pro'}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {language === 'vi' ? 'Tối ưu tuyến đường thông minh với công nghệ Fleetbase cho logistics Việt Nam' : 'Smart route optimization with Fleetbase technology for Vietnamese logistics'}
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-2xl p-2 shadow-xl border border-gray-200">
            <div className="flex gap-2">
              <Button
                onClick={() => setActiveView('optimizer')}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  activeView === 'optimizer'
                    ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-lg'
                    : 'bg-transparent text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Zap className="h-4 w-4 mr-2" />
                {language === 'vi' ? 'Tối ưu tuyến' : 'Route Optimizer'}
              </Button>
              <Button
                onClick={() => setActiveView('dashboard')}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  activeView === 'dashboard'
                    ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-lg'
                    : 'bg-transparent text-gray-600 hover:bg-gray-100'
                }`}
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                {language === 'vi' ? 'Dashboard' : 'Dashboard'}
              </Button>
              <Button
                onClick={() => setActiveView('routes')}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  activeView === 'routes'
                    ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-lg'
                    : 'bg-transparent text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Truck className="h-4 w-4 mr-2" />
                {language === 'vi' ? 'Quản lý Tuyến' : 'Route Management'}
              </Button>
              <Button
                onClick={() => setActiveView('map')}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  activeView === 'map'
                    ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-lg'
                    : 'bg-transparent text-gray-600 hover:bg-gray-100'
                }`}
              >
                <MapPin className="h-4 w-4 mr-2" />
                {language === 'vi' ? 'Bản đồ' : 'Map View'}
              </Button>
            </div>
          </div>
        </div>

        {/* Route Optimizer View */}
        {activeView === 'optimizer' && (
          <div className="space-y-8">
            <Card className="shadow-2xl border-0">
              <CardHeader className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <Zap className="h-6 w-6" />
                  {language === 'vi' ? 'Tối ưu Tuyến đường Thông minh' : 'Smart Route Optimization'}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                  <div className="space-y-4">
                    <label className="text-gray-700 font-semibold text-lg">{language === 'vi' ? 'Điểm xuất phát' : 'Origin Point'}</label>
                    <input
                      type="text"
                      placeholder={language === 'vi' ? 'Nhập điểm xuất phát...' : 'Enter origin location...'}
                      value={originQuery}
                      onChange={(e) => setOriginQuery(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 text-gray-800"
                    />
                    <div className="text-sm text-gray-600">
                      {language === 'vi' ? 'Ví dụ: Cảng Cát Lái, TP.HCM, Hà Nội' : 'Example: Cat Lai Port, Ho Chi Minh City, Hanoi'}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-gray-700 font-semibold text-lg">{language === 'vi' ? 'Điểm đến' : 'Destination Point'}</label>
                    <input
                      type="text"
                      placeholder={language === 'vi' ? 'Nhập điểm đến...' : 'Enter destination location...'}
                      value={destinationQuery}
                      onChange={(e) => setDestinationQuery(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 text-gray-800"
                    />
                    <div className="text-sm text-gray-600">
                      {language === 'vi' ? 'Ví dụ: Cảng Thị Vải, Đà Nẵng, Cần Thơ' : 'Example: Thi Vai Port, Da Nang, Can Tho'}
                    </div>
                  </div>
                </div>

                <div className="flex justify-center mb-8">
                  <Button 
                    onClick={calculateRoute}
                    disabled={isCalculating}
                    className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-2xl transform hover:scale-105 transition-all duration-300"
                  >
                    <Zap className="h-5 w-5 mr-3" />
                    {isCalculating ? (language === 'vi' ? 'Đang tính toán...' : 'Calculating...') : (language === 'vi' ? 'Tối ưu Tuyến đường' : 'Optimize Route')}
                  </Button>
                </div>

                {/* Route Results */}
                {selectedRoute && (
                  <div className="bg-white rounded-2xl p-8 border-2 border-gray-200 shadow-xl">
                    <h3 className="text-2xl font-bold mb-6 text-center text-gray-800">🚛 {language === 'vi' ? 'Kết quả Tối ưu' : 'Optimization Results'}</h3>
                    
                    {/* Main Metrics */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                      <div className="text-center p-4 bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl shadow-lg">
                        <div className="text-2xl font-bold">{selectedRoute.time}</div>
                        <div className="text-sm text-green-100">{language === 'vi' ? 'Thời gian' : 'Travel Time'}</div>
                      </div>
                      <div className="text-center p-4 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl shadow-lg">
                        <div className="text-2xl font-bold">{selectedRoute.distance}</div>
                        <div className="text-sm text-blue-100">{language === 'vi' ? 'Quãng đường' : 'Distance'}</div>
                      </div>
                      <div className="text-center p-4 bg-gradient-to-br from-yellow-500 to-yellow-600 text-white rounded-xl shadow-lg">
                        <div className="text-xl font-bold">{selectedRoute.cost}</div>
                        <div className="text-sm text-yellow-100">{language === 'vi' ? 'Chi phí' : 'Total Cost'}</div>
                      </div>
                      <div className="text-center p-4 bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl shadow-lg">
                        <div className="text-2xl font-bold">{selectedRoute.efficiency}</div>
                        <div className="text-sm text-purple-100">{language === 'vi' ? 'Hiệu quả' : 'Efficiency'}</div>
                      </div>
                    </div>

                    {/* Route Details */}
                    <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-6 mb-6 border border-gray-200">
                      <div className="text-xl font-bold text-gray-800 mb-2">
                        📍 {selectedRoute.origin.name} → {selectedRoute.destination.name}
                      </div>
                      <div className="text-gray-700 font-medium">
                        {language === 'vi' ? 'Từ' : 'From'}: {selectedRoute.origin.province} | {language === 'vi' ? 'Đến' : 'To'}: {selectedRoute.destination.province}
                      </div>
                    </div>

                    {/* Additional Metrics */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div className="text-center p-4 bg-gradient-to-br from-red-500 to-red-600 text-white rounded-lg shadow-md">
                        <div className="text-lg font-bold">{selectedRoute.fuelConsumption}</div>
                        <div className="text-sm text-red-100">{language === 'vi' ? 'Nhiên liệu' : 'Fuel'}</div>
                      </div>
                      <div className="text-center p-4 bg-gradient-to-br from-indigo-500 to-indigo-600 text-white rounded-lg shadow-md">
                        <div className="text-lg font-bold">{selectedRoute.avgSpeed}</div>
                        <div className="text-sm text-indigo-100">{language === 'vi' ? 'Tốc độ TB' : 'Avg Speed'}</div>
                      </div>
                      <div className="text-center p-4 bg-gradient-to-br from-cyan-500 to-cyan-600 text-white rounded-lg shadow-md">
                        <div className="text-sm font-bold">{selectedRoute.truckType}</div>
                        <div className="text-xs text-cyan-100">{language === 'vi' ? 'Loại xe' : 'Vehicle'}</div>
                      </div>
                      <div className="text-center p-4 bg-gradient-to-br from-emerald-500 to-emerald-600 text-white rounded-lg shadow-md">
                        <div className="text-lg font-bold">{selectedRoute.loadCapacity}</div>
                        <div className="text-sm text-emerald-100">{language === 'vi' ? 'Tải trọng' : 'Capacity'}</div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Interactive Map */}
            {selectedRoute && (
              <Card className="shadow-2xl border-0">
                <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-t-lg">
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <MapPin className="h-6 w-6" />
                    {language === 'vi' ? 'Bản đồ Tuyến đường' : 'Route Map'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <LeafletRouteMap selectedRoute={selectedRoute} />
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Dashboard View */}
        {activeView === 'dashboard' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="bg-gradient-to-br from-green-500 to-emerald-600 text-white border-0 shadow-2xl">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-100 text-sm">{language === 'vi' ? 'Tuyến đường hoạt động' : 'Active Routes'}</p>
                      <p className="text-3xl font-bold">{routes.filter(r => r.status === 'active').length}</p>
                    </div>
                    <Navigation className="h-8 w-8 text-green-100" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white border-0 shadow-2xl">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100 text-sm">{language === 'vi' ? 'Hiệu quả trung bình' : 'Avg Efficiency'}</p>
                      <p className="text-3xl font-bold">{Math.round(routes.reduce((sum, r) => sum + r.efficiency, 0) / routes.length)}%</p>
                    </div>
                    <Target className="h-8 w-8 text-blue-100" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-500 to-pink-600 text-white border-0 shadow-2xl">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-100 text-sm">{language === 'vi' ? 'Tổng quãng đường' : 'Total Distance'}</p>
                      <p className="text-3xl font-bold">{routes.reduce((sum, r) => sum + r.distance, 0)}km</p>
                    </div>
                    <MapPin className="h-8 w-8 text-purple-100" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-orange-500 to-red-600 text-white border-0 shadow-2xl">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-orange-100 text-sm">{language === 'vi' ? 'Tổng chi phí' : 'Total Cost'}</p>
                      <p className="text-2xl font-bold">{(routes.reduce((sum, r) => sum + r.cost, 0) / 1000000).toFixed(1)}M ₫</p>
                    </div>
                    <DollarSign className="h-8 w-8 text-orange-100" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Route Management View */}
        {activeView === 'routes' && (
          <div className="space-y-6">
            <Card className="shadow-2xl border-0">
              <CardHeader className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <Truck className="h-6 w-6" />
                  {language === 'vi' ? 'Quản lý Tuyến đường' : 'Route Management'}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <div className="space-y-6">
                  {routes.map((route) => (
                    <Card key={route.id} className="border-2 border-gray-200 hover:shadow-xl transition-all duration-300">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg">
                              <Navigation className="h-8 w-8 text-white" />
                            </div>
                            <div>
                              <h3 className="text-xl font-bold text-gray-800">{route.name}</h3>
                              <p className="text-gray-600">{route.origin.name} → {route.destination.name}</p>
                              <div className="flex gap-2 mt-2">
                                <Badge className={`${getStatusColor(route.status)} text-white`}>
                                  {route.status}
                                </Badge>
                                <Badge className={`${getPriorityColor(route.priority)} text-white`}>
                                  {route.priority}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                          <div className="p-4 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl shadow-lg">
                            <div className="flex items-center gap-2 mb-2">
                              <MapPin className="h-5 w-5 text-white" />
                              <span className="font-semibold text-blue-100">{language === 'vi' ? 'Quãng đường' : 'Distance'}</span>
                            </div>
                            <p className="text-white font-bold text-lg">{route.distance} km</p>
                          </div>

                          <div className="p-4 bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl shadow-lg">
                            <div className="flex items-center gap-2 mb-2">
                              <Clock className="h-5 w-5 text-white" />
                              <span className="font-semibold text-green-100">{language === 'vi' ? 'Thời gian' : 'Duration'}</span>
                            </div>
                            <p className="text-white font-bold text-lg">{Math.round(route.duration/60)}h {route.duration%60}m</p>
                          </div>

                          <div className="p-4 bg-gradient-to-br from-yellow-500 to-yellow-600 text-white rounded-xl shadow-lg">
                            <div className="flex items-center gap-2 mb-2">
                              <DollarSign className="h-5 w-5 text-white" />
                              <span className="font-semibold text-yellow-100">{language === 'vi' ? 'Chi phí' : 'Cost'}</span>
                            </div>
                            <p className="text-white font-bold text-lg">{(route.cost/1000000).toFixed(1)}M ₫</p>
                          </div>

                          <div className="p-4 bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl shadow-lg">
                            <div className="flex items-center gap-2 mb-2">
                              <Target className="h-5 w-5 text-white" />
                              <span className="font-semibold text-purple-100">{language === 'vi' ? 'Hiệu quả' : 'Efficiency'}</span>
                            </div>
                            <p className="text-white font-bold text-lg">{route.efficiency}%</p>
                          </div>
                        </div>

                        {/* Additional Metrics - Red, Indigo, Cyan, Emerald gradients */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                          <div className="p-4 bg-gradient-to-br from-red-500 to-red-600 text-white rounded-xl shadow-lg">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-sm font-semibold text-red-100">{language === 'vi' ? 'Nhiên liệu' : 'Fuel'}</span>
                            </div>
                            <p className="text-white font-bold text-lg">{(route.distance * 0.08).toFixed(1)}L</p>
                          </div>
                          <div className="p-4 bg-gradient-to-br from-indigo-500 to-indigo-600 text-white rounded-xl shadow-lg">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-sm font-semibold text-indigo-100">{language === 'vi' ? 'Tốc độ TB' : 'Avg Speed'}</span>
                            </div>
                            <p className="text-white font-bold text-lg">{Math.round(route.distance / (route.duration/60))} km/h</p>
                          </div>
                          <div className="p-4 bg-gradient-to-br from-cyan-500 to-cyan-600 text-white rounded-xl shadow-lg">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-sm font-semibold text-cyan-100">{language === 'vi' ? 'Phương tiện' : 'Vehicle'}</span>
                            </div>
                            <p className="text-white font-bold text-lg">{route.vehicle}</p>
                          </div>
                          <div className="p-4 bg-gradient-to-br from-emerald-500 to-emerald-600 text-white rounded-xl shadow-lg">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-sm font-semibold text-emerald-100">{language === 'vi' ? 'Tải trọng' : 'Capacity'}</span>
                            </div>
                            <p className="text-white font-bold text-lg">85%</p>
                          </div>
                        </div>

                        <div className="border-t pt-4">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div className="p-3 bg-white rounded-lg border border-gray-300 shadow-sm">
                              <span className="text-sm font-bold text-gray-900">{language === 'vi' ? 'Tài xế:' : 'Driver:'}</span>
                              <p className="font-bold text-gray-900 text-lg">{route.driver}</p>
                            </div>
                            <div className="p-3 bg-white rounded-lg border border-gray-300 shadow-sm">
                              <span className="text-sm font-bold text-gray-900">{language === 'vi' ? 'Xe:' : 'Vehicle:'}</span>
                              <p className="font-bold text-gray-900 text-lg">{route.vehicle}</p>
                            </div>
                            <div className="p-3 bg-white rounded-lg border border-gray-300 shadow-sm">
                              <span className="text-sm font-bold text-gray-900">{language === 'vi' ? 'Hàng hóa:' : 'Cargo:'}</span>
                              <p className="font-bold text-gray-900 text-lg">{route.cargo}</p>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div className="p-3 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                              <span className="text-sm font-bold text-blue-800">{language === 'vi' ? 'Thời tiết:' : 'Weather:'}</span>
                              <p className="font-bold text-blue-900 text-lg capitalize">{route.weather}</p>
                            </div>
                            <div className="p-3 bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg border border-orange-200">
                              <span className="text-sm font-bold text-orange-800">{language === 'vi' ? 'Giao thông:' : 'Traffic:'}</span>
                              <p className="font-bold text-orange-900 text-lg capitalize">{route.traffic}</p>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2 mt-4">
                          <Button 
                            onClick={() => optimizeRoute(route)}
                            disabled={optimizing}
                            className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 shadow-lg"
                          >
                            <Zap className="h-4 w-4 mr-2" />
                            {optimizing ? (language === 'vi' ? 'Đang tối ưu...' : 'Optimizing...') : (language === 'vi' ? 'Tối ưu tuyến đường' : 'Optimize Route')}
                          </Button>
                          <Button 
                            onClick={() => {
                              setSelectedRoute({
                                origin: route.origin,
                                destination: route.destination,
                                distance: `${route.distance}km`,
                                time: `${Math.round(route.duration/60)}h ${route.duration%60}m`
                              })
                              setActiveView('map')
                            }}
                            className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 shadow-lg"
                          >
                            <MapPin className="h-4 w-4 mr-2" />
                            {language === 'vi' ? 'Xem bản đồ' : 'View Map'}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Map View */}
        {activeView === 'map' && (
          <div className="space-y-6">
            <Card className="shadow-2xl border-0">
              <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <MapPin className="h-6 w-6" />
                  {language === 'vi' ? 'Bản đồ Tuyến đường' : 'Route Map'}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <LeafletRouteMap selectedRoute={selectedRoute} />
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
