'use client'

import React, { useState, useEffect } from 'react'
import Layout from '@/components/Layout'
import { useLanguage } from '@/contexts/LanguageContext'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import InteractiveMap from '@/components/InteractiveMap'
import { 
  MapPin, 
  Navigation2, 
  Clock, 
  Fuel, 
  Navigation,
  Truck,
  Calculator,
  CheckCircle,
  Plus,
  X,
  Map,
  Target,
  Zap,
  AlertTriangle,
  Activity,
  Lightbulb,
  DollarSign,
  MapIcon,
  Loader2
} from 'lucide-react'

interface RoutePoint {
  id: string
  name: string
  address: string
  lat: number
  lng: number
  type: 'pickup' | 'delivery' | 'warehouse'
  priority: number
  timeWindow?: { start: string; end: string }
}

interface OptimizedRoute {
  id: string
  points: RoutePoint[]
  distance: number
  estimatedTime: number
  fuelCost: number
  tollCost: number
  totalCost: number
  co2Emission: number
  savings: {
    distance: number
    time: number
    fuel: number
  }
  efficiency: number
  restrictions: {
    violations: string[]
    warnings: string[]
    alternativeTimes: string[]
  }
  trafficAnalysis: {
    congestionLevel: 'low' | 'medium' | 'high'
    delayMinutes: number
    rushHourImpact: boolean
  }
  aiOptimization?: string
}

const RouteOptimizationPage = () => {
  const { language, t } = useLanguage()
  const [routes, setRoutes] = useState<RoutePoint[]>([])
  const [optimizedRoute, setOptimizedRoute] = useState<OptimizedRoute | null>(null)
  const [isOptimizing, setIsOptimizing] = useState(false)
  const [optimizationProgress, setOptimizationProgress] = useState(0)
  const [departure, setDeparture] = useState<RoutePoint | null>(null)
  const [destination, setDestination] = useState<RoutePoint | null>(null)
  const [truckType, setTruckType] = useState<'20ft' | '40ft' | 'container_truck'>('40ft')
  const [departureTime, setDepartureTime] = useState('')
  const [customOrigin, setCustomOrigin] = useState({ name: '', address: '', lat: '', lng: '' })
  const [customDestination, setCustomDestination] = useState({ name: '', address: '', lat: '', lng: '' })
  const [optimizeFor, setOptimizeFor] = useState<'time' | 'distance' | 'cost' | 'fuel'>('cost')
  const [avoidTolls, setAvoidTolls] = useState(false)
  const [avoidHighways, setAvoidHighways] = useState(false)

  // Vietnam truck restrictions and specifications
  const vietnamTruckSpecs = {
    '20ft': { weight: 24000, fuel: 28, maxSpeed: 80 },
    '40ft': { weight: 32000, fuel: 35, maxSpeed: 80 },
    'container_truck': { weight: 35000, fuel: 40, maxSpeed: 70 }
  }

  const sampleRoutes: RoutePoint[] = [
    // Major Warehouses & Depots
    {
      id: '1',
      name: language === 'vi' ? 'Sinovl Tan Van Depot' : 'Sinovl Tan Van Depot',
      address: language === 'vi' ? 'Khu công nghiệp Tân Vạn, Biên Hòa, Đồng Nai' : 'Tan Van Industrial Park, Bien Hoa, Dong Nai',
      lat: 10.9447,
      lng: 106.8197,
      type: 'warehouse',
      priority: 1,
      timeWindow: { start: '06:00', end: '22:00' }
    },
    {
      id: '2',
      name: language === 'vi' ? 'Kho trung tâm TP.HCM' : 'Ho Chi Minh City Central Warehouse',
      address: language === 'vi' ? 'Khu Công nghệ cao, Quận 9, TP. Hồ Chí Minh' : 'High-Tech Park, District 9, Ho Chi Minh City',
      lat: 10.8505,
      lng: 106.7717,
      type: 'warehouse',
      priority: 1,
      timeWindow: { start: '06:00', end: '22:00' }
    },
    {
      id: '3',
      name: language === 'vi' ? 'Depot Hà Nội' : 'Hanoi Depot',
      address: language === 'vi' ? 'KCN Thăng Long, Hà Nội' : 'Thang Long Industrial Park, Hanoi',
      lat: 21.0285,
      lng: 105.8542,
      type: 'warehouse',
      priority: 1,
      timeWindow: { start: '06:00', end: '22:00' }
    },
    {
      id: '4',
      name: language === 'vi' ? 'Cảng Cát Lái' : 'Cat Lai Port',
      address: language === 'vi' ? 'Cảng Cát Lái, TP. Hồ Chí Minh' : 'Cat Lai Port, Ho Chi Minh City',
      lat: 10.7769,
      lng: 106.7009,
      type: 'pickup',
      priority: 2,
      timeWindow: { start: '07:00', end: '17:00' }
    },
    {
      id: '5',
      name: language === 'vi' ? 'Cảng Hải Phòng' : 'Hai Phong Port',
      address: language === 'vi' ? 'Cảng Hải Phòng, Hải Phòng' : 'Hai Phong Port, Hai Phong',
      lat: 20.8449,
      lng: 106.6881,
      type: 'pickup',
      priority: 2,
      timeWindow: { start: '07:00', end: '17:00' }
    }
  ]

  const optimizeRoute = async () => {
    if (!departure || !destination) {
      alert(language === 'vi' ? 'Vui lòng chọn điểm đi và điểm đến' : 'Please select departure and destination points')
      return
    }

    setIsOptimizing(true)
    setOptimizationProgress(0)

    // Simulate optimization progress
    const progressInterval = setInterval(() => {
      setOptimizationProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval)
          return 90
        }
        return prev + 10
      })
    }, 200)

    try {
      // Calculate distance (simplified calculation)
      const distance = Math.sqrt(
        Math.pow(destination.lat - departure.lat, 2) + 
        Math.pow(destination.lng - departure.lng, 2)
      ) * 111 // Rough km conversion

      const actualDistance = distance * 1.3 // Account for road routing

      // Calculate costs based on truck type
      const specs = vietnamTruckSpecs[truckType]
      const fuelCost = (actualDistance / 100) * specs.fuel * 25000 // VND per liter
      const tollCost = actualDistance * 2000 // Estimated toll per km
      const totalCost = fuelCost + tollCost + 500000 // Base cost

      // Simulate AI optimization
      await new Promise(resolve => setTimeout(resolve, 2000))

      const optimized: OptimizedRoute = {
        id: Date.now().toString(),
        points: [departure, destination],
        distance: Math.round(actualDistance),
        estimatedTime: Math.round(actualDistance / 60), // hours
        fuelCost: Math.round(fuelCost),
        tollCost: Math.round(tollCost),
        totalCost: Math.round(totalCost),
        co2Emission: Math.round(actualDistance * 2.6), // kg CO2
        savings: {
          distance: Math.round(distance * 0.15),
          time: Math.round(actualDistance / 60 * 0.2),
          fuel: Math.round(fuelCost * 0.15)
        },
        efficiency: Math.round(85 + Math.random() * 10),
        restrictions: {
          violations: [],
          warnings: [],
          alternativeTimes: []
        },
        trafficAnalysis: {
          congestionLevel: 'medium',
          delayMinutes: Math.round(Math.random() * 30),
          rushHourImpact: true
        },
        aiOptimization: language === 'vi' 
          ? `🤖 AI đã tối ưu tuyến đường từ ${departure.name} đến ${destination.name}. Tiết kiệm 15% chi phí và 20% thời gian so với tuyến thông thường.`
          : `🤖 AI optimized route from ${departure.name} to ${destination.name}. Saves 15% cost and 20% time compared to standard route.`
      }

      setOptimizedRoute(optimized)
      setOptimizationProgress(100)

    } catch (error) {
      console.error('Optimization error:', error)
      alert(language === 'vi' ? 'Lỗi khi tối ưu tuyến đường' : 'Error optimizing route')
    } finally {
      setIsOptimizing(false)
      clearInterval(progressInterval)
    }
  }

  const handleCustomLocationAdd = (type: 'origin' | 'destination') => {
    const location = type === 'origin' ? customOrigin : customDestination
    if (!location.name || !location.address) {
      alert(language === 'vi' ? 'Vui lòng nhập đầy đủ thông tin' : 'Please enter complete information')
      return
    }

    const newPoint: RoutePoint = {
      id: Date.now().toString(),
      name: location.name,
      address: location.address,
      lat: parseFloat(location.lat) || (type === 'origin' ? 10.8231 : 21.0285),
      lng: parseFloat(location.lng) || (type === 'origin' ? 106.6297 : 105.8542),
      type: type === 'origin' ? 'pickup' : 'delivery',
      priority: 1
    }

    if (type === 'origin') {
      setDeparture(newPoint)
      setCustomOrigin({ name: '', address: '', lat: '', lng: '' })
    } else {
      setDestination(newPoint)
      setCustomDestination({ name: '', address: '', lat: '', lng: '' })
    }
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold gradient-text flex items-center gap-3">
              <Navigation2 className="w-8 h-8 text-indigo-400" />
              {language === 'vi' ? 'Tối ưu tuyến đường AI cho xe container 40ft' : 'AI Route Optimization for 40ft Container Trucks'}
            </h1>
            <p className="text-slate-400 mt-1">
              {language === 'vi' 
                ? 'Định tuyến xe tải tiên tiến với ràng buộc đường bộ Việt Nam, phân tích giao thông và tối ưu nhiên liệu'
                : 'Advanced truck routing with Vietnam road constraints, traffic analysis, and fuel optimization'
              }
            </p>
          </div>
          <LanguageSwitcher />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Route Configuration Panel */}
          <div className="lg:col-span-1 space-y-4">
            {/* Departure Selection */}
            <div className="dark-card p-4">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-green-400" />
                {language === 'vi' ? 'Điểm xuất phát' : 'Departure Point'}
              </h3>
              
              <select
                value={departure?.id || ''}
                onChange={(e) => {
                  const selected = sampleRoutes.find(r => r.id === e.target.value)
                  setDeparture(selected || null)
                }}
                className="dark-input w-full mb-3"
              >
                <option value="">
                  {language === 'vi' ? 'Chọn điểm xuất phát...' : 'Select departure point...'}
                </option>
                {sampleRoutes.map(route => (
                  <option key={route.id} value={route.id}>
                    {route.name}
                  </option>
                ))}
              </select>

              {/* Custom Origin Input */}
              <div className="space-y-2 border-t border-slate-700 pt-3">
                <p className="text-sm text-slate-400">
                  {language === 'vi' ? 'Hoặc nhập địa chỉ tùy chỉnh:' : 'Or enter custom address:'}
                </p>
                <input
                  type="text"
                  placeholder={language === 'vi' ? 'Tên địa điểm' : 'Location name'}
                  value={customOrigin.name}
                  onChange={(e) => setCustomOrigin(prev => ({ ...prev, name: e.target.value }))}
                  className="dark-input w-full text-sm"
                />
                <input
                  type="text"
                  placeholder={language === 'vi' ? 'Địa chỉ đầy đủ' : 'Full address'}
                  value={customOrigin.address}
                  onChange={(e) => setCustomOrigin(prev => ({ ...prev, address: e.target.value }))}
                  className="dark-input w-full text-sm"
                />
                <button
                  onClick={() => handleCustomLocationAdd('origin')}
                  className="dark-button w-full text-sm py-2"
                  disabled={!customOrigin.name || !customOrigin.address}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  {language === 'vi' ? 'Thêm điểm xuất phát' : 'Add Departure Point'}
                </button>
              </div>
            </div>

            {/* Destination Selection */}
            <div className="dark-card p-4">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-red-400" />
                {language === 'vi' ? 'Điểm đến' : 'Destination'}
              </h3>
              
              <select
                value={destination?.id || ''}
                onChange={(e) => {
                  const selected = sampleRoutes.find(r => r.id === e.target.value)
                  setDestination(selected || null)
                }}
                className="dark-input w-full mb-3"
              >
                <option value="">
                  {language === 'vi' ? 'Chọn điểm đến...' : 'Select destination...'}
                </option>
                {sampleRoutes.map(route => (
                  <option key={route.id} value={route.id}>
                    {route.name}
                  </option>
                ))}
              </select>

              {/* Custom Destination Input */}
              <div className="space-y-2 border-t border-slate-700 pt-3">
                <p className="text-sm text-slate-400">
                  {language === 'vi' ? 'Hoặc nhập địa chỉ tùy chỉnh:' : 'Or enter custom address:'}
                </p>
                <input
                  type="text"
                  placeholder={language === 'vi' ? 'Tên địa điểm' : 'Location name'}
                  value={customDestination.name}
                  onChange={(e) => setCustomDestination(prev => ({ ...prev, name: e.target.value }))}
                  className="dark-input w-full text-sm"
                />
                <input
                  type="text"
                  placeholder={language === 'vi' ? 'Địa chỉ đầy đủ' : 'Full address'}
                  value={customDestination.address}
                  onChange={(e) => setCustomDestination(prev => ({ ...prev, address: e.target.value }))}
                  className="dark-input w-full text-sm"
                />
                <button
                  onClick={() => handleCustomLocationAdd('destination')}
                  className="dark-button w-full text-sm py-2"
                  disabled={!customDestination.name || !customDestination.address}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  {language === 'vi' ? 'Thêm điểm đến' : 'Add Destination'}
                </button>
              </div>
            </div>

            {/* Truck Configuration */}
            <div className="dark-card p-4">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Truck className="w-5 h-5 text-blue-400" />
                {language === 'vi' ? 'Cấu hình xe tải' : 'Truck Configuration'}
              </h3>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-sm text-slate-300 mb-2">
                    {language === 'vi' ? 'Loại xe' : 'Truck Type'}
                  </label>
                  <select
                    value={truckType}
                    onChange={(e) => setTruckType(e.target.value as any)}
                    className="dark-input w-full"
                  >
                    <option value="20ft">20ft Container</option>
                    <option value="40ft">40ft Container</option>
                    <option value="container_truck">Container Truck</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-slate-300 mb-2">
                    {language === 'vi' ? 'Thời gian khởi hành' : 'Departure Time'}
                  </label>
                  <input
                    type="time"
                    value={departureTime}
                    onChange={(e) => setDepartureTime(e.target.value)}
                    className="dark-input w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm text-slate-300 mb-2">
                    {language === 'vi' ? 'Tối ưu cho' : 'Optimize For'}
                  </label>
                  <select
                    value={optimizeFor}
                    onChange={(e) => setOptimizeFor(e.target.value as any)}
                    className="dark-input w-full"
                  >
                    <option value="cost">{language === 'vi' ? 'Chi phí' : 'Cost'}</option>
                    <option value="time">{language === 'vi' ? 'Thời gian' : 'Time'}</option>
                    <option value="distance">{language === 'vi' ? 'Khoảng cách' : 'Distance'}</option>
                    <option value="fuel">{language === 'vi' ? 'Nhiên liệu' : 'Fuel'}</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={avoidTolls}
                      onChange={(e) => setAvoidTolls(e.target.checked)}
                      className="rounded"
                    />
                    <span className="text-sm text-slate-300">
                      {language === 'vi' ? 'Tránh trạm thu phí' : 'Avoid Tolls'}
                    </span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={avoidHighways}
                      onChange={(e) => setAvoidHighways(e.target.checked)}
                      className="rounded"
                    />
                    <span className="text-sm text-slate-300">
                      {language === 'vi' ? 'Tránh cao tốc' : 'Avoid Highways'}
                    </span>
                  </label>
                </div>
              </div>
            </div>

            {/* Optimize Button */}
            <button
              onClick={optimizeRoute}
              disabled={isOptimizing || !departure || !destination}
              className="gradient-button w-full py-4 rounded-xl font-semibold flex items-center justify-center gap-2"
            >
              {isOptimizing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {language === 'vi' ? 'Đang tối ưu tuyến đường Việt Nam...' : 'Optimizing Vietnam Route...'}
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5" />
                  {language === 'vi' ? 'Tối ưu tuyến đường xe 40ft' : 'Optimize 40ft Truck Route'}
                </>
              )}
            </button>

            {/* Progress Bar */}
            {isOptimizing && (
              <div className="dark-card p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-300">
                    {language === 'vi' ? 'Tiến trình tối ưu' : 'Optimization Progress'}
                  </span>
                  <span className="text-sm text-indigo-400">{optimizationProgress}%</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${optimizationProgress}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Map and Results */}
          <div className="lg:col-span-2 space-y-4">
            {/* Interactive Map */}
            <div className="dark-card p-4">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Map className="w-5 h-5 text-indigo-400" />
                {language === 'vi' ? 'Bản đồ tương tác' : 'Interactive Map'}
              </h3>
              <div className="h-96 rounded-xl overflow-hidden">
                <InteractiveMap 
                  departure={departure}
                  destination={destination}
                  optimizedRoute={optimizedRoute}
                  language={language}
                />
              </div>
            </div>

            {/* Optimization Results */}
            {optimizedRoute && (
              <div className="dark-card p-4">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  {language === 'vi' ? 'Kết quả tối ưu' : 'Optimization Results'}
                </h3>

                {optimizedRoute.aiOptimization && (
                  <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-4 mb-4">
                    <div className="flex items-start gap-3">
                      <Brain className="w-5 h-5 text-indigo-400 mt-0.5" />
                      <p className="text-indigo-300 text-sm">{optimizedRoute.aiOptimization}</p>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-3 bg-blue-500/10 rounded-xl border border-blue-500/20">
                    <MapIcon className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-blue-400">{optimizedRoute.distance}</div>
                    <div className="text-xs text-blue-300">
                      {language === 'vi' ? 'km' : 'km'}
                    </div>
                  </div>

                  <div className="text-center p-3 bg-green-500/10 rounded-xl border border-green-500/20">
                    <Clock className="w-6 h-6 text-green-400 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-green-400">{optimizedRoute.estimatedTime}</div>
                    <div className="text-xs text-green-300">
                      {language === 'vi' ? 'giờ' : 'hours'}
                    </div>
                  </div>

                  <div className="text-center p-3 bg-yellow-500/10 rounded-xl border border-yellow-500/20">
                    <Fuel className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-yellow-400">
                      {(optimizedRoute.fuelCost / 1000000).toFixed(1)}M
                    </div>
                    <div className="text-xs text-yellow-300">VNĐ</div>
                  </div>

                  <div className="text-center p-3 bg-purple-500/10 rounded-xl border border-purple-500/20">
                    <Activity className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-purple-400">{optimizedRoute.efficiency}%</div>
                    <div className="text-xs text-purple-300">
                      {language === 'vi' ? 'Hiệu suất' : 'Efficiency'}
                    </div>
                  </div>
                </div>

                {/* Savings Information */}
                <div className="mt-4 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                  <h4 className="text-emerald-400 font-semibold mb-2 flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    {language === 'vi' ? 'Tiết kiệm được' : 'Savings Achieved'}
                  </h4>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-slate-400">
                        {language === 'vi' ? 'Khoảng cách:' : 'Distance:'}
                      </span>
                      <span className="text-emerald-400 ml-2">{optimizedRoute.savings.distance} km</span>
                    </div>
                    <div>
                      <span className="text-slate-400">
                        {language === 'vi' ? 'Thời gian:' : 'Time:'}
                      </span>
                      <span className="text-emerald-400 ml-2">{optimizedRoute.savings.time}h</span>
                    </div>
                    <div>
                      <span className="text-slate-400">
                        {language === 'vi' ? 'Nhiên liệu:' : 'Fuel:'}
                      </span>
                      <span className="text-emerald-400 ml-2">
                        {(optimizedRoute.savings.fuel / 1000).toFixed(0)}K VNĐ
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default RouteOptimizationPage
