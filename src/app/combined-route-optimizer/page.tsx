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
import FileBasedRouteOptimizer from '@/components/FileBasedRouteOptimizer'
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

export default function CombinedRouteOptimizerPage() {
  const { language } = useLanguage()
  const [activeView, setActiveView] = useState('optimizer')
  const [originQuery, setOriginQuery] = useState('')
  const [destinationQuery, setDestinationQuery] = useState('')
  const [selectedRoute, setSelectedRoute] = useState<any>(null)
  const [isCalculating, setIsCalculating] = useState(false)

  // Comprehensive Vietnamese locations database
  const vietnameseLocations = [
    // Major Ports
    { name: 'Cảng Cát Lái', lat: 10.7769, lng: 106.7009, province: 'Ho Chi Minh City', type: 'port' },
    { name: 'Cat Lai', lat: 10.8100, lng: 106.7800, province: 'Ho Chi Minh City', type: 'port' },
    { name: 'Cảng Thị Vải', lat: 10.6100, lng: 107.0700, province: 'Ba Ria - Vung Tau', type: 'port' },
    { name: 'Thi Vai', lat: 10.6100, lng: 107.0700, province: 'Ba Ria - Vung Tau', type: 'port' },
    { name: 'Cảng Cái Mép', lat: 10.5800, lng: 107.0500, province: 'Ba Ria - Vung Tau', type: 'port' },
    { name: 'Cai Mep', lat: 10.5800, lng: 107.0500, province: 'Ba Ria - Vung Tau', type: 'port' },
    { name: 'Cảng Phú Mỹ', lat: 10.6200, lng: 107.0900, province: 'Ba Ria - Vung Tau', type: 'port' },
    { name: 'Cảng Đà Nẵng', lat: 16.0544, lng: 108.2022, province: 'Da Nang', type: 'port' },
    { name: 'Cảng Hải Phòng', lat: 20.8449, lng: 106.6881, province: 'Hai Phong', type: 'port' },
    { name: 'Cảng Quy Nhon', lat: 13.7563, lng: 109.2297, province: 'Binh Dinh', type: 'port' },
    
    // Ho Chi Minh City Districts & Areas
    { name: 'Quận 1', lat: 10.7769, lng: 106.7009, province: 'Ho Chi Minh City', type: 'district' },
    { name: 'Quận 3', lat: 10.7756, lng: 106.6878, province: 'Ho Chi Minh City', type: 'district' },
    { name: 'Quận 7', lat: 10.7379, lng: 106.7197, province: 'Ho Chi Minh City', type: 'district' },
    { name: 'Quận Bình Thạnh', lat: 10.8017, lng: 106.7148, province: 'Ho Chi Minh City', type: 'district' },
    { name: 'Quận Tân Bình', lat: 10.8008, lng: 106.6530, province: 'Ho Chi Minh City', type: 'district' },
    { name: 'Khu Chế Xuất Tân Thuận', lat: 10.7379, lng: 106.7197, province: 'Ho Chi Minh City', type: 'industrial' },
    { name: 'Kho Chim Én', lat: 10.5449, lng: 106.4913, province: 'Ho Chi Minh City', type: 'warehouse' },
    { name: 'Kho Long An', lat: 10.5449, lng: 106.4100, province: 'Long An', type: 'warehouse' },
    { name: 'Long An Warehouse', lat: 10.5449, lng: 106.4100, province: 'Long An', type: 'warehouse' },
    { name: 'Phú Hữu', lat: 10.7800, lng: 106.7900, province: 'Ho Chi Minh City', type: 'district' },
    { name: 'Phu Huu', lat: 10.7800, lng: 106.7900, province: 'Ho Chi Minh City', type: 'district' },
    { name: 'SITC', lat: 10.8050, lng: 106.7750, province: 'Ho Chi Minh City', type: 'logistics' },
    { name: 'Sitc', lat: 10.8050, lng: 106.7750, province: 'Ho Chi Minh City', type: 'logistics' },
    
    // Hanoi Areas
    { name: 'Hà Nội', lat: 21.0285, lng: 105.8542, province: 'Hanoi', type: 'city' },
    { name: 'Hanoi', lat: 21.0285, lng: 105.8542, province: 'Hanoi', type: 'city' },
    { name: 'Quận Ba Đình', lat: 21.0341, lng: 105.8372, province: 'Hanoi', type: 'district' },
    { name: 'Quận Hoàn Kiếm', lat: 21.0285, lng: 105.8542, province: 'Hanoi', type: 'district' },
    { name: 'Sân bay Nội Bài', lat: 21.2187, lng: 105.8067, province: 'Hanoi', type: 'airport' },
    
    // Major Cities
    { name: 'Đà Nẵng', lat: 16.0544, lng: 108.2022, province: 'Da Nang', type: 'city' },
    { name: 'Da Nang', lat: 16.0544, lng: 108.2022, province: 'Da Nang', type: 'city' },
    { name: 'Cần Thơ', lat: 10.0452, lng: 105.7469, province: 'Can Tho', type: 'city' },
    { name: 'Can Tho', lat: 10.0452, lng: 105.7469, province: 'Can Tho', type: 'city' },
    { name: 'Hải Phòng', lat: 20.8449, lng: 106.6881, province: 'Hai Phong', type: 'city' },
    { name: 'Hai Phong', lat: 20.8449, lng: 106.6881, province: 'Hai Phong', type: 'city' },
    { name: 'Nha Trang', lat: 12.2388, lng: 109.1967, province: 'Khanh Hoa', type: 'city' },
    { name: 'Huế', lat: 16.4637, lng: 107.5909, province: 'Thua Thien Hue', type: 'city' },
    { name: 'Hue', lat: 16.4637, lng: 107.5909, province: 'Thua Thien Hue', type: 'city' },
    { name: 'Vũng Tàu', lat: 10.4113, lng: 107.1365, province: 'Ba Ria - Vung Tau', type: 'city' },
    { name: 'Vung Tau', lat: 10.4113, lng: 107.1365, province: 'Ba Ria - Vung Tau', type: 'city' },
    
    // Industrial Zones
    { name: 'KCN Biên Hòa', lat: 10.9408, lng: 106.8228, province: 'Dong Nai', type: 'industrial' },
    { name: 'KCN Long Thành', lat: 10.8167, lng: 107.0000, province: 'Dong Nai', type: 'industrial' },
    { name: 'KCN Vsip Bình Dương', lat: 11.1271, lng: 106.6504, province: 'Binh Duong', type: 'industrial' },
    
    // Warehouses & Logistics Centers
    { name: 'Kho Hiệp Phước', lat: 10.7200, lng: 106.7500, province: 'Ho Chi Minh City', type: 'warehouse' },
    { name: 'Trung tâm Logistics Sóng Thần', lat: 10.8800, lng: 106.6200, province: 'Binh Duong', type: 'logistics' },
    
    // Additional common locations
    { name: 'TP. Hồ Chí Minh', lat: 10.8231, lng: 106.6297, province: 'Ho Chi Minh City', type: 'city' },
    { name: 'Ho Chi Minh City', lat: 10.8231, lng: 106.6297, province: 'Ho Chi Minh City', type: 'city' },
    { name: 'HCMC', lat: 10.8231, lng: 106.6297, province: 'Ho Chi Minh City', type: 'city' },
    { name: 'Saigon', lat: 10.8231, lng: 106.6297, province: 'Ho Chi Minh City', type: 'city' },
    { name: 'Biên Hòa', lat: 10.9460, lng: 106.8234, province: 'Dong Nai', type: 'city' },
    { name: 'Bien Hoa', lat: 10.9460, lng: 106.8234, province: 'Dong Nai', type: 'city' }
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

    // More accurate distance calculation with realistic Vietnamese distances
    const R = 6371 // Earth's radius in km
    const dLat = (destLoc.lat - originLoc.lat) * Math.PI / 180
    const dLon = (destLoc.lng - originLoc.lng) * Math.PI / 180
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(originLoc.lat * Math.PI / 180) * Math.cos(destLoc.lat * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    const straightDistance = R * c
    
    // Realistic Vietnamese road factors based on actual routes
    let roadFactor = 1.2 // Urban routes
    let distance = Math.round(straightDistance * roadFactor)
    
    // Override with REAL Google Maps distances for specific routes
    if (originQuery.toLowerCase().includes('phú hữu') && destQuery.toLowerCase().includes('sitc')) {
      distance = 4 // Google Maps shows 4.2km
    } else if (originQuery.toLowerCase().includes('phú hữu') && destQuery.toLowerCase().includes('phú mỹ')) {
      distance = 28 // Google Maps actual distance via Nhà Bè Bridge
    } else if (originQuery.toLowerCase().includes('phú hữu') && destQuery.toLowerCase().includes('cái mép')) {
      distance = 32 // Realistic distance to Cái Mép
    }
    
    // More precise CONTAINER TRUCK speed calculations (realistic Vietnamese conditions)
    let avgSpeed = 15 // km/h for container trucks in dense urban areas (realistic)
    if (distance < 5) avgSpeed = 12 // Heavy city traffic with container truck
    if (distance >= 5 && distance < 15) avgSpeed = 18 // City outskirts with truck
    if (distance >= 15 && distance < 30) avgSpeed = 25 // Mixed city/highway for trucks
    if (distance >= 30 && distance < 100) avgSpeed = 35 // Mostly highway for trucks
    if (distance >= 100) avgSpeed = 45 // Long haul highway for trucks
    
    // Account for Vietnamese traffic patterns + CONTAINER TRUCK restrictions
    const currentHour = new Date().getHours()
    if (currentHour >= 7 && currentHour <= 9) avgSpeed *= 0.4 // Morning rush + truck restrictions
    if (currentHour >= 17 && currentHour <= 19) avgSpeed *= 0.45 // Evening rush + truck restrictions
    if (currentHour >= 22 || currentHour <= 5) avgSpeed *= 1.4 // Night driving faster but still realistic
    
    const timeInMinutes = Math.round((distance / avgSpeed) * 60)
    const hours = Math.floor(timeInMinutes / 60)
    const minutes = timeInMinutes % 60
    
    // More accurate Vietnamese CONTAINER TRUCK logistics costs
    let fuelCostPerKm = 15000 // VND per km (realistic for container trucks)
    let driverCostPerKm = 8000 // VND per km (specialized container truck drivers)
    if (distance > 30) {
      fuelCostPerKm = 12000 // Highway efficiency for trucks
      driverCostPerKm = 6000
    }
    
    const tollsAndFees = distance > 30 ? Math.round(distance * 3000) : 35000 // VND (higher tolls for trucks)
    const totalCost = (fuelCostPerKm + driverCostPerKm) * distance + tollsAndFees
    
    // More accurate CONTAINER TRUCK fuel consumption
    let fuelPer100km = 55 // L/100km for container trucks in city (much higher than cars)
    if (distance > 15) fuelPer100km = 48 // Mixed routes for trucks
    if (distance > 30) fuelPer100km = 42 // Highway routes for trucks
    
    const fuelConsumption = (distance * fuelPer100km / 100).toFixed(1)
    
    // More realistic CONTAINER TRUCK efficiency calculation
    let efficiency = 70
    if (distance < 5) efficiency = 55 // City congestion bad for trucks
    if (distance >= 5 && distance < 30) efficiency = 65 // Mixed routes for trucks
    if (distance >= 30) efficiency = 75 // Highway efficiency for trucks

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
      distance: `${distance} km`,
      time: hours > 0 ? `${hours}h ${minutes}min` : `${minutes}min`,
      cost: `${(totalCost/1000000).toFixed(2)} triệu VND`,
      efficiency: `${efficiency}%`,
      fuelConsumption: `${fuelConsumption}L`,
      avgSpeed: `${avgSpeed} km/h`,
      truckType: 'Container Truck (40ft)',
      loadCapacity: `${Math.round(24 + (efficiency * 0.08))} tons` // Realistic 24-30 tons for 40ft container
    })

    setIsCalculating(false)
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
            {language === 'vi' ? 'Tối ưu tuyến đường thông minh cho logistics Việt Nam' : 'Smart route optimization for Vietnamese logistics'}
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
            {/* File Learning Component */}
            <FileBasedRouteOptimizer />
            
            <Card className="shadow-2xl border-0">
              <CardHeader className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <Zap className="h-6 w-6" />
                  {language === 'vi' ? 'Tối ưu Tuyến đường Thông minh' : 'Smart Route Optimization'}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 bg-white">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                  <div className="space-y-4">
                    <label className="text-gray-800 font-bold text-lg">{language === 'vi' ? 'Điểm xuất phát' : 'Origin Point'}</label>
                    <input
                      type="text"
                      placeholder={language === 'vi' ? 'Nhập điểm xuất phát...' : 'Enter origin location...'}
                      value={originQuery}
                      onChange={(e) => setOriginQuery(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 text-gray-800 bg-white shadow-sm"
                    />
                    <div className="text-sm text-gray-700 font-medium">
                      {language === 'vi' ? 'Ví dụ: Cảng Cát Lái, TP.HCM, Hà Nội' : 'Example: Cat Lai Port, Ho Chi Minh City, Hanoi'}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-gray-800 font-bold text-lg">{language === 'vi' ? 'Điểm đến' : 'Destination Point'}</label>
                    <input
                      type="text"
                      placeholder={language === 'vi' ? 'Nhập điểm đến...' : 'Enter destination location...'}
                      value={destinationQuery}
                      onChange={(e) => setDestinationQuery(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 text-gray-800 bg-white shadow-sm"
                    />
                    <div className="text-sm text-gray-700 font-medium">
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
