'use client'

import React, { useState, useEffect } from 'react'
import AuthGuard from '@/components/AuthGuard'
import { 
  advancedRouteOptimizer, 
  RouteOptimizationRequest, 
  OptimizedRoute, 
  RoutePoint,
  VIETNAM_TRUCK_SPECS 
} from '@/lib/advancedRouteOptimizer'
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
  Lightbulb
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
}

const RouteOptimizationPage = () => {
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

  const vietnamRestrictions = {
    'ho_chi_minh': {
      name: 'Ho Chi Minh City',
      banHours: [
        { start: '06:00', end: '09:00', days: ['mon', 'tue', 'wed', 'thu', 'fri'] },
        { start: '16:00', end: '20:00', days: ['mon', 'tue', 'wed', 'thu', 'fri'] }
      ],
      weightLimit: 10000
    },
    'hanoi': {
      name: 'Hanoi',
      banHours: [
        { start: '06:00', end: '09:00', days: ['mon', 'tue', 'wed', 'thu', 'fri'] },
        { start: '15:00', end: '21:00', days: ['mon', 'tue', 'wed', 'thu', 'fri'] }
      ],
      weightLimit: 8000
    }
  }

  const checkRouteRestrictions = (origin: RoutePoint, destination: RoutePoint, time: string, truck: string) => {
    const violations = []
    const warnings = []
    const alternativeTimes = []
    
    const hour = parseInt(time.split(':')[0])
    const dayOfWeek = new Date().toLocaleDateString('en', { weekday: 'short' }).toLowerCase()
    
    // Check Ho Chi Minh City restrictions
    if (origin.address.includes('Hồ Chí Minh') || destination.address.includes('Hồ Chí Minh')) {
      const hcmRestrictions = vietnamRestrictions.ho_chi_minh
      
      hcmRestrictions.banHours.forEach(ban => {
        const startHour = parseInt(ban.start.split(':')[0])
        const endHour = parseInt(ban.end.split(':')[0])
        
        if (ban.days.includes(dayOfWeek) && hour >= startHour && hour <= endHour) {
          violations.push(`40ft trucks banned in HCMC from ${ban.start} to ${ban.end}`)
        }
      })
      
      if (vietnamTruckSpecs[truck as keyof typeof vietnamTruckSpecs].weight > hcmRestrictions.weightLimit) {
        warnings.push('Truck weight exceeds inner city limit. Use ring roads.')
      }
    }
    
    // Check Hanoi restrictions
    if (origin.address.includes('Hà Nội') || destination.address.includes('Hanoi')) {
      const hanoiRestrictions = vietnamRestrictions.hanoi
      
      hanoiRestrictions.banHours.forEach(ban => {
        const startHour = parseInt(ban.start.split(':')[0])
        const endHour = parseInt(ban.end.split(':')[0])
        
        if (ban.days.includes(dayOfWeek) && hour >= startHour && hour <= endHour) {
          violations.push(`40ft trucks banned in Hanoi from ${ban.start} to ${ban.end}`)
        }
      })
    }
    
    // Suggest alternative times
    if (violations.length > 0) {
      alternativeTimes.push('05:30', '09:30', '14:00', '21:30')
    }
    
    return { violations, warnings, alternativeTimes }
  }
  const sampleRoutes: RoutePoint[] = [
    // Major Warehouses & Depots
    {
      id: '1',
      name: 'Sinovl Tan Van Depot',
      address: 'Khu công nghiệp Tân Vạn, Biên Hòa, Đồng Nai',
      lat: 10.9447,
      lng: 106.8197,
      type: 'warehouse',
      priority: 1,
      timeWindow: { start: '06:00', end: '22:00' }
    },
    {
      id: '2',
      name: 'Kho trung tâm TP.HCM',
      address: 'Khu Công nghệ cao, Quận 9, TP. Hồ Chí Minh',
      lat: 10.8505,
      lng: 106.7717,
      type: 'warehouse',
      priority: 1,
      timeWindow: { start: '06:00', end: '22:00' }
    },
    {
      id: '3',
      name: 'Depot Hà Nội',
      address: 'KCN Thăng Long, Hà Nội',
      lat: 21.0285,
      lng: 105.8542,
      type: 'warehouse',
      priority: 1,
      timeWindow: { start: '06:00', end: '22:00' }
    },
    {
      id: '4',
      name: 'Depot Đà Nẵng',
      address: 'KCN Hòa Khánh, Đà Nẵng',
      lat: 16.0471,
      lng: 108.2068,
      type: 'warehouse',
      priority: 1,
      timeWindow: { start: '06:00', end: '22:00' }
    },
    {
      id: '5',
      name: 'Depot Cần Thơ',
      address: 'KCN Trà Nóc, Cần Thơ',
      lat: 10.0452,
      lng: 105.7469,
      type: 'warehouse',
      priority: 1,
      timeWindow: { start: '06:00', end: '22:00' }
    },
    
    // Major Ports
    {
      id: '6',
      name: 'Cảng Cái Mép',
      address: 'Cảng Cái Mép, Bà Rịa - Vũng Tàu',
      lat: 10.5833,
      lng: 107.0833,
      type: 'pickup',
      priority: 1,
      timeWindow: { start: '06:00', end: '18:00' }
    },
    {
      id: '7',
      name: 'Cảng Cát Lái',
      address: 'Đường Đồng Văn Cống, Quận 2, TP. Hồ Chí Minh',
      lat: 10.7950,
      lng: 106.7767,
      type: 'pickup',
      priority: 1,
      timeWindow: { start: '06:00', end: '17:00' }
    },
    {
      id: '8',
      name: 'Cảng Hải Phòng',
      address: 'Cảng Hải Phòng, Hải Phòng',
      lat: 20.8449,
      lng: 106.6881,
      type: 'pickup',
      priority: 1,
      timeWindow: { start: '06:00', end: '18:00' }
    },
    
    // Industrial Zones
    {
      id: '9',
      name: 'KCN Tân Thuận',
      address: 'Đường Huỳnh Tấn Phát, Quận 7, TP. Hồ Chí Minh',
      lat: 10.7378,
      lng: 106.7230,
      type: 'delivery',
      priority: 2,
      timeWindow: { start: '07:00', end: '19:00' }
    },
    {
      id: '10',
      name: 'KCN VSIP Bình Dương',
      address: 'KCN Việt Nam - Singapore, Bình Dương',
      lat: 10.9804,
      lng: 106.6519,
      type: 'delivery',
      priority: 2,
      timeWindow: { start: '07:00', end: '19:00' }
    },
    {
      id: '11',
      name: 'KCN Long Hậu',
      address: 'KCN Long Hậu, Long An',
      lat: 10.6833,
      lng: 106.4167,
      type: 'delivery',
      priority: 2,
      timeWindow: { start: '07:00', end: '19:00' }
    },
    
    // Major Markets & Distribution Centers
    {
      id: '12',
      name: 'Chợ đầu mối Hóc Môn',
      address: 'Quốc lộ 22, Huyện Hóc Môn, TP. Hồ Chí Minh',
      lat: 10.8833,
      lng: 106.5917,
      type: 'pickup',
      priority: 2,
      timeWindow: { start: '04:00', end: '16:00' }
    },
    {
      id: '13',
      name: 'Chợ đầu mối Thủ Đức',
      address: 'Đại lộ Phạm Văn Đồng, TP. Thủ Đức',
      lat: 10.8411,
      lng: 106.8098,
      type: 'pickup',
      priority: 2,
      timeWindow: { start: '05:00', end: '17:00' }
    },
    {
      id: '14',
      name: 'Chợ Long Biên',
      address: 'Chợ Long Biên, Hà Nội',
      lat: 21.0358,
      lng: 105.8542,
      type: 'pickup',
      priority: 2,
      timeWindow: { start: '04:00', end: '16:00' }
    },
    
    // Retail & Commercial Centers
    {
      id: '15',
      name: 'Siêu thị Metro Thủ Đức',
      address: 'Đại lộ Phạm Văn Đồng, TP. Thủ Đức',
      lat: 10.8411,
      lng: 106.8098,
      type: 'delivery',
      priority: 3,
      timeWindow: { start: '08:00', end: '20:00' }
    },
    {
      id: '16',
      name: 'Big C Miền Đông',
      address: 'Xa lộ Hà Nội, Quận 2, TP. Hồ Chí Minh',
      lat: 10.8017,
      lng: 106.7442,
      type: 'delivery',
      priority: 3,
      timeWindow: { start: '08:00', end: '20:00' }
    },
    {
      id: '17',
      name: 'Lotte Mart Hà Nội',
      address: 'Số 7 Nguyễn Văn Linh, Hà Nội',
      lat: 21.0285,
      lng: 105.8542,
      type: 'delivery',
      priority: 3,
      timeWindow: { start: '08:00', end: '20:00' }
    },
    
    // Regional Centers
    {
      id: '18',
      name: 'Trung tâm phân phối Nha Trang',
      address: 'KCN Suối Dầu, Nha Trang, Khánh Hòa',
      lat: 12.2388,
      lng: 109.1967,
      type: 'delivery',
      priority: 2,
      timeWindow: { start: '07:00', end: '19:00' }
    },
    {
      id: '19',
      name: 'Trung tâm phân phối Vũng Tàu',
      address: 'KCN Phú Mỹ, Bà Rịa - Vũng Tàu',
      lat: 10.5417,
      lng: 107.2431,
      type: 'delivery',
      priority: 2,
      timeWindow: { start: '07:00', end: '19:00' }
    },
    {
      id: '20',
      name: 'Trung tâm phân phối Huế',
      address: 'KCN Phú Bài, Thừa Thiên Huế',
      lat: 16.4637,
      lng: 107.5909,
      type: 'delivery',
      priority: 2,
      timeWindow: { start: '07:00', end: '19:00' }
    }
  ]

  useEffect(() => {
    setRoutes(sampleRoutes)
  }, [])

  // Automatic depot optimization
  const findNearestDepot = (origin: RoutePoint, destination: RoutePoint): RoutePoint | null => {
    const depots = routes.filter(r => r.type === 'warehouse')
    if (depots.length === 0) return null
    
    let nearestDepot = depots[0]
    let minTotalDistance = calculateDistance(origin, depots[0]) + calculateDistance(depots[0], destination)
    
    depots.forEach(depot => {
      const totalDistance = calculateDistance(origin, depot) + calculateDistance(depot, destination)
      if (totalDistance < minTotalDistance) {
        minTotalDistance = totalDistance
        nearestDepot = depot
      }
    })
    
    return nearestDepot
  }

  // Auto-optimize route when both points are selected
  useEffect(() => {
    if (departure && destination && departure.id !== destination.id) {
      const nearestDepot = findNearestDepot(departure, destination)
      if (nearestDepot && nearestDepot.id !== departure.id && nearestDepot.id !== destination.id) {
        // Auto-suggest depot optimization
        console.log(`Suggested depot for optimization: ${nearestDepot.name}`)
      }
    }
  }, [departure, destination, routes])

  const optimizeRoute = async () => {
    if (!departure || !destination) {
      alert('Vui lòng chọn cả điểm xuất phát và điểm đến')
      return
    }
    
    setIsOptimizing(true)
    setOptimizationProgress(0)
    
    // Simulate AI optimization with progress updates
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
      // Find nearest depot for optimization
      const nearestDepot = findNearestDepot(departure, destination)
      const directDistance = calculateDistance(departure, destination)
      
      let optimizedDistance = directDistance
      let optimizedPoints = [departure, destination]
      let depotOptimization = false
      
      // Check if using depot is more efficient
      if (nearestDepot && nearestDepot.id !== departure.id && nearestDepot.id !== destination.id) {
        const depotDistance = calculateDistance(departure, nearestDepot) + calculateDistance(nearestDepot, destination)
        if (depotDistance < directDistance * 1.2) { // Allow 20% tolerance for depot benefits
          optimizedDistance = depotDistance
          optimizedPoints = [departure, nearestDepot, destination]
          depotOptimization = true
        }
      }
      
      // Calculate comprehensive route data
      const estimatedTime = Math.round(optimizedDistance / 60 * 60) // Assuming 60km/h average
      const fuelCost = Math.round(optimizedDistance * vietnamTruckSpecs[truckType].fuel / 100 * 25000) // 25k VND per liter
      const tollCost = Math.round(optimizedDistance * 2500) // 2.5k VND per km
      const totalCost = fuelCost + tollCost
      const co2Emission = Math.round(optimizedDistance * vietnamTruckSpecs[truckType].fuel / 100 * 2.6) // 2.6kg CO2 per liter
      
      // Traffic analysis
      const isRushHourTime = isRushHour(departureTime)
      const trafficAnalysis = {
        congestionLevel: isRushHourTime ? 'high' : 'low' as 'low' | 'medium' | 'high',
        delayMinutes: isRushHourTime ? 45 : 15,
        rushHourImpact: isRushHourTime
      }
      
      // Route restrictions
      const restrictions = checkRouteRestrictions(departure, destination, departureTime, truckType)
      
      const optimizedRoute: OptimizedRoute = {
        id: `route_${Date.now()}`,
        points: optimizedPoints,
        distance: optimizedDistance,
        estimatedTime: estimatedTime + trafficAnalysis.delayMinutes,
        fuelCost,
        tollCost,
        totalCost,
        co2Emission,
        savings: {
          distance: depotOptimization ? Math.max(0, directDistance - optimizedDistance) : 0,
          time: depotOptimization ? 30 : 0, // Depot consolidation saves time
          fuel: depotOptimization ? Math.round((directDistance - optimizedDistance) * vietnamTruckSpecs[truckType].fuel / 100 * 25000) : 0
        },
        efficiency: Math.round((1 - (optimizedDistance / Math.max(directDistance, optimizedDistance))) * 100),
        restrictions,
        trafficAnalysis
      }
      
      clearInterval(progressInterval)
      setOptimizationProgress(100)
      setOptimizedRoute(optimizedRoute)
      
      setTimeout(() => setOptimizationProgress(0), 1000)
    } catch (error) {
      console.error('Route optimization failed:', error)
      alert(`Tối ưu tuyến đường thất bại: ${error}`)
    } finally {
      setIsOptimizing(false)
    }
  }

  const calculateDistance = (point1: RoutePoint, point2: RoutePoint): number => {
    const R = 6371 // Earth's radius in km
    const dLat = (point2.lat - point1.lat) * Math.PI / 180
    const dLng = (point2.lng - point1.lng) * Math.PI / 180
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(point1.lat * Math.PI / 180) * Math.cos(point2.lat * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    return R * c
  }

  const isRushHour = (time: string): boolean => {
    if (!time) return false
    const hour = parseInt(time.split(':')[0])
    return (hour >= 6 && hour <= 9) || (hour >= 16 && hour <= 20)
  }

  const addCustomOrigin = () => {
    if (customOrigin.name && customOrigin.address && customOrigin.lat && customOrigin.lng) {
      const point: RoutePoint = {
        id: 'custom-origin-' + Date.now(),
        name: customOrigin.name,
        address: customOrigin.address,
        lat: parseFloat(customOrigin.lat),
        lng: parseFloat(customOrigin.lng),
        type: 'warehouse',
        priority: 1,
        timeWindow: { start: '06:00', end: '22:00' }
      }
      
      setRoutes(prev => [...prev, point])
      setDeparture(point)
      setCustomOrigin({ name: '', address: '', lat: '', lng: '' })
    }
  }

  const addCustomDestination = () => {
    if (customDestination.name && customDestination.address && customDestination.lat && customDestination.lng) {
      const point: RoutePoint = {
        id: 'custom-dest-' + Date.now(),
        name: customDestination.name,
        address: customDestination.address,
        lat: parseFloat(customDestination.lat),
        lng: parseFloat(customDestination.lng),
        type: 'delivery',
        priority: 1,
        timeWindow: { start: '08:00', end: '18:00' }
      }
      
      setRoutes(prev => [...prev, point])
      setDestination(point)
      setCustomDestination({ name: '', address: '', lat: '', lng: '' })
    }
  }

  const removeRoutePoint = (id: string) => {
    setRoutes(prev => prev.filter(r => r.id !== id))
    setOptimizedRoute(null)
  }

  const getPointTypeColor = (type: string) => {
    switch (type) {
      case 'warehouse': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'pickup': return 'bg-green-100 text-green-800 border-green-200'
      case 'delivery': return 'bg-orange-100 text-orange-800 border-orange-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getPointTypeIcon = (type: string) => {
    switch (type) {
      case 'warehouse': return <MapPin className="w-4 h-4" />
      case 'pickup': return <Navigation className="w-4 h-4" />
      case 'delivery': return <Truck className="w-4 h-4" />
      default: return <MapPin className="w-4 h-4" />
    }
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-slate-900 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">AI Route Optimization for 40ft Container Trucks</h1>
            <p className="text-slate-400">
              Advanced truck routing with Vietnam road constraints, traffic analysis, and fuel optimization
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Route Configuration */}
            <div className="lg:col-span-1 space-y-6">
              {/* Truck Configuration */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Truck className="w-5 h-5" />
                    Truck Configuration
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="truck-type">Truck Type</Label>
                      <select
                        id="truck-type"
                        value={truckType}
                        onChange={(e) => setTruckType(e.target.value as any)}
                        className="w-full p-2 border rounded-md text-sm"
                      >
                        <option value="40ft">40ft Container Truck (32,000kg)</option>
                        <option value="20ft">20ft Container Truck (24,000kg)</option>
                        <option value="container_truck">Standard Container Truck (35,000kg)</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="departure">Departure Point</Label>
                      <div className="relative">
                        <select
                          id="departure"
                          value={departure?.id || ''}
                          onChange={(e) => {
                            const selected = routes.find(r => r.id === e.target.value)
                            setDeparture(selected || null)
                            setOptimizedRoute(null) // Reset optimization when changing points
                          }}
                          className="w-full p-4 border-2 rounded-lg text-base bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm hover:border-indigo-300 transition-colors"
                          style={{ fontSize: '16px', lineHeight: '1.5' }}
                        >
                          <option value="" style={{ padding: '8px', fontSize: '16px' }}>🚛 Chọn điểm xuất phát...</option>
                          <optgroup label="📦 Kho hàng & Depot" style={{ fontSize: '16px', fontWeight: 'bold', color: '#4F46E5' }}>
                            {routes.filter(r => r.type === 'warehouse').map(point => (
                              <option key={point.id} value={point.id} style={{ padding: '8px', fontSize: '15px', lineHeight: '1.4' }}>
                                📦 {point.name} - {point.address}
                              </option>
                            ))}
                          </optgroup>
                          <optgroup label="📍 Điểm lấy hàng" style={{ fontSize: '16px', fontWeight: 'bold', color: '#059669' }}>
                            {routes.filter(r => r.type === 'pickup').map(point => (
                              <option key={point.id} value={point.id} style={{ padding: '8px', fontSize: '15px', lineHeight: '1.4' }}>
                                📍 {point.name} - {point.address}
                              </option>
                            ))}
                          </optgroup>
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                      {departure && (
                        <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-sm">
                          ✅ <strong>Điểm xuất phát:</strong> {departure.name}
                          <br />📍 <strong>Địa chỉ:</strong> {departure.address}
                          <br />🕒 <strong>Giờ hoạt động:</strong> {departure.timeWindow?.start} - {departure.timeWindow?.end}
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="destination">Destination Point</Label>
                      <div className="relative">
                        <select
                          id="destination"
                          value={destination?.id || ''}
                          onChange={(e) => {
                            const selected = routes.find(r => r.id === e.target.value)
                            setDestination(selected || null)
                            setOptimizedRoute(null) // Reset optimization when changing points
                          }}
                          className="w-full p-4 border-2 rounded-lg text-base bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm hover:border-indigo-300 transition-colors"
                          style={{ fontSize: '16px', lineHeight: '1.5' }}
                        >
                          <option value="" style={{ padding: '8px', fontSize: '16px' }}>🎯 Chọn điểm đến...</option>
                          <optgroup label="🏭 Kho hàng & Depot" style={{ fontSize: '16px', fontWeight: 'bold', color: '#4F46E5' }}>
                            {routes.filter(r => r.type === 'warehouse').map(point => (
                              <option key={point.id} value={point.id} style={{ padding: '8px', fontSize: '15px', lineHeight: '1.4' }}>
                                🏭 {point.name} - {point.address}
                              </option>
                            ))}
                          </optgroup>
                          <optgroup label="🚚 Điểm giao hàng" style={{ fontSize: '16px', fontWeight: 'bold', color: '#DC2626' }}>
                            {routes.filter(r => r.type === 'delivery').map(point => (
                              <option key={point.id} value={point.id} style={{ padding: '8px', fontSize: '15px', lineHeight: '1.4' }}>
                                🚚 {point.name} - {point.address}
                              </option>
                            ))}
                          </optgroup>
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                      {destination && (
                        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm">
                          ✅ <strong>Điểm đến:</strong> {destination.name}
                          <br />📍 <strong>Địa chỉ:</strong> {destination.address}
                          <br />🕒 <strong>Giờ hoạt động:</strong> {destination.timeWindow?.start} - {destination.timeWindow?.end}
                        </div>
                      )}
                    </div>

                    {/* Nearest Depot Display */}
                    {departure && destination && departure.id !== destination.id && (
                      <div className="space-y-2">
                        <Label>Nearest Depot Optimization</Label>
                        {(() => {
                          const nearestDepot = findNearestDepot(departure, destination)
                          if (nearestDepot && nearestDepot.id !== departure.id && nearestDepot.id !== destination.id) {
                            const directDistance = calculateDistance(departure, destination)
                            const depotDistance = calculateDistance(departure, nearestDepot) + calculateDistance(nearestDepot, destination)
                            const savings = directDistance - depotDistance
                            
                            return (
                              <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg text-sm">
                                <div className="flex items-center gap-2 mb-2">
                                  <MapPin className="w-4 h-4 text-purple-600" />
                                  <strong className="text-purple-800">Suggested Depot: {nearestDepot.name}</strong>
                                </div>
                                <div className="grid grid-cols-2 gap-4 text-xs">
                                  <div>
                                    <div className="text-gray-600">Direct Route:</div>
                                    <div className="font-medium">{directDistance.toFixed(1)} km</div>
                                  </div>
                                  <div>
                                    <div className="text-gray-600">Via Depot:</div>
                                    <div className="font-medium">{depotDistance.toFixed(1)} km</div>
                                  </div>
                                </div>
                                {savings > 0 ? (
                                  <div className="mt-2 text-green-700 font-medium">
                                    💰 Savings: {savings.toFixed(1)} km ({(savings * 7000).toLocaleString()} VNĐ)
                                  </div>
                                ) : (
                                  <div className="mt-2 text-orange-700 font-medium">
                                    ⚠️ Direct route is more efficient
                                  </div>
                                )}
                              </div>
                            )
                          }
                          return (
                            <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-600">
                              No depot optimization available for this route
                            </div>
                          )
                        })()}
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="departure-time">Departure Time</Label>
                      <Input
                        id="departure-time"
                        type="time"
                        value={departureTime}
                        onChange={(e) => setDepartureTime(e.target.value)}
                        placeholder="Select departure time"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Quick Time Suggestions</Label>
                      <div className="flex gap-2 flex-wrap">
                        {['05:30', '09:30', '14:00', '21:30'].map(time => (
                          <Button
                            key={time}
                            variant="outline"
                            size="sm"
                            onClick={() => setDepartureTime(time)}
                            className="text-xs"
                          >
                            {time}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Custom Origin Input */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="w-5 h-5" />
                    Add Custom Origin
                  </CardTitle>
                  <CardDescription>
                    Enter custom pickup location with coordinates
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="origin-name">Location Name</Label>
                      <Input
                        id="origin-name"
                        value={customOrigin.name}
                        onChange={(e) => setCustomOrigin(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="e.g., My Warehouse"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="origin-address">Address</Label>
                      <Input
                        id="origin-address"
                        value={customOrigin.address}
                        onChange={(e) => setCustomOrigin(prev => ({ ...prev, address: e.target.value }))}
                        placeholder="e.g., 123 Nguyen Van Linh, District 7, HCMC"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-2">
                        <Label htmlFor="origin-lat">Latitude</Label>
                        <Input
                          id="origin-lat"
                          value={customOrigin.lat}
                          onChange={(e) => setCustomOrigin(prev => ({ ...prev, lat: e.target.value }))}
                          placeholder="10.7378"
                          type="number"
                          step="0.000001"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="origin-lng">Longitude</Label>
                        <Input
                          id="origin-lng"
                          value={customOrigin.lng}
                          onChange={(e) => setCustomOrigin(prev => ({ ...prev, lng: e.target.value }))}
                          placeholder="106.7230"
                          type="number"
                          step="0.000001"
                        />
                      </div>
                    </div>
                    
                    <Button onClick={addCustomOrigin} className="w-full">
                      <Plus className="w-4 h-4 mr-2" />
                      Add as Origin
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Custom Destination Input */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Add Custom Destination
                  </CardTitle>
                  <CardDescription>
                    Enter custom delivery location with coordinates
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="dest-name">Location Name</Label>
                      <Input
                        id="dest-name"
                        value={customDestination.name}
                        onChange={(e) => setCustomDestination(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="e.g., Customer Location"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="dest-address">Address</Label>
                      <Input
                        id="dest-address"
                        value={customDestination.address}
                        onChange={(e) => setCustomDestination(prev => ({ ...prev, address: e.target.value }))}
                        placeholder="e.g., 456 Le Loi, District 1, HCMC"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-2">
                        <Label htmlFor="dest-lat">Latitude</Label>
                        <Input
                          id="dest-lat"
                          value={customDestination.lat}
                          onChange={(e) => setCustomDestination(prev => ({ ...prev, lat: e.target.value }))}
                          placeholder="10.7720"
                          type="number"
                          step="0.000001"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="dest-lng">Longitude</Label>
                        <Input
                          id="dest-lng"
                          value={customDestination.lng}
                          onChange={(e) => setCustomDestination(prev => ({ ...prev, lng: e.target.value }))}
                          placeholder="106.6980"
                          type="number"
                          step="0.000001"
                        />
                      </div>
                    </div>
                    
                    <Button onClick={addCustomDestination} className="w-full">
                      <Target className="w-4 h-4 mr-2" />
                      Add as Destination
                    </Button>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Available Route Points ({routes.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 max-h-80 overflow-y-auto">
                    {routes.map((point) => (
                      <div key={point.id} className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg">
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          {getPointTypeIcon(point.type)}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{point.name}</p>
                            <p className="text-xs text-slate-500 truncate">{point.address}</p>
                          </div>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPointTypeColor(point.type)}`}>
                          {point.type}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Map and Results */}
            <div className="lg:col-span-2 space-y-6">
              {/* Interactive Map Placeholder */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Map className="w-5 h-5" />
                    Vietnam Truck Route Map
                  </CardTitle>
                  <CardDescription>
                    Interactive map showing route optimization and restrictions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="relative bg-slate-100 rounded-lg h-96 flex items-center justify-center">
                    <div className="text-center">
                      <Map className="w-16 h-16 mx-auto mb-4 text-slate-400" />
                      <h3 className="text-lg font-semibold text-slate-600 mb-2">Interactive Route Map</h3>
                      <p className="text-slate-500 mb-4">
                        {departure && destination ? 
                          `Route: ${departure.name} → ${destination.name}` :
                          'Select departure and destination to view route'
                        }
                      </p>
                      {optimizedRoute && (
                        <div className="bg-white p-4 rounded-lg shadow-sm">
                          <div className="text-sm text-slate-600 space-y-1">
                            <div>📍 Distance: {optimizedRoute.distance} km</div>
                            <div>⏱️ Time: {Math.floor(optimizedRoute.estimatedTime / 60)}h {optimizedRoute.estimatedTime % 60}m</div>
                            <div>🚛 Truck: {truckType} Container</div>
                            <div>⛽ Fuel: {(optimizedRoute.distance * vietnamTruckSpecs[truckType].fuel / 100).toFixed(1)}L</div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Optimization Engine */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="w-5 h-5" />
                    AI Route Optimization Engine
                  </CardTitle>
                  <CardDescription>
                    Advanced routing with Vietnam truck regulations and traffic analysis
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isOptimizing && optimizationProgress > 0 && (
                    <div className="mb-4 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Optimizing route...</span>
                        <span>{optimizationProgress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-indigo-600 to-purple-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${optimizationProgress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                  
                  <Button 
                    onClick={optimizeRoute}
                    disabled={!departure || !destination || isOptimizing}
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                    size="lg"
                  >
                    {isOptimizing ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Optimizing Vietnam Route...
                      </>
                    ) : (
                      <>
                        <Calculator className="w-4 h-4 mr-2" />
                        Optimize 40ft Truck Route
                      </>
                    )}
                  </Button>

                  {(!departure || !destination) && (
                    <p className="text-sm text-slate-500 text-center mt-2">
                      Select departure and destination points to optimize
                    </p>
                  )}

                  {optimizedRoute && (
                    <div className="mt-6 space-y-4">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                          <Map className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                          <p className="text-2xl font-bold text-blue-600">{optimizedRoute.distance} km</p>
                          <p className="text-sm text-slate-600">Total Distance</p>
                        </div>
                        
                        <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200">
                          <Clock className="w-8 h-8 text-green-600 mx-auto mb-2" />
                          <p className="text-2xl font-bold text-green-600">
                            {Math.floor(optimizedRoute.estimatedTime / 60)}h {optimizedRoute.estimatedTime % 60}m
                          </p>
                          <p className="text-sm text-slate-600">Estimated Time</p>
                        </div>
                        
                        <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg border border-orange-200">
                          <Fuel className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                          <p className="text-2xl font-bold text-orange-600">
                            {optimizedRoute.totalCost.toLocaleString('vi-VN')}
                          </p>
                          <p className="text-sm text-slate-600">Total Cost (VNĐ)</p>
                        </div>
                        
                        <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200">
                          <Target className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                          <p className="text-2xl font-bold text-purple-600">{optimizedRoute.co2Emission} kg</p>
                          <p className="text-sm text-slate-600">CO2 Emissions</p>
                        </div>
                      </div>

                      {/* Cost Breakdown */}
                      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4">
                        <h4 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
                          <Calculator className="w-5 h-5" />
                          Detailed Cost Analysis
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div className="text-center p-3 bg-white rounded-lg border border-green-100">
                            <p className="text-2xl font-bold text-green-700">{optimizedRoute.fuelCost.toLocaleString('vi-VN')} VNĐ</p>
                            <p className="text-green-600">Fuel Cost</p>
                          </div>
                          <div className="text-center p-3 bg-white rounded-lg border border-green-100">
                            <p className="text-2xl font-bold text-green-700">{optimizedRoute.tollCost.toLocaleString('vi-VN')} VNĐ</p>
                            <p className="text-green-600">Toll Cost</p>
                          </div>
                          <div className="text-center p-3 bg-white rounded-lg border border-green-100">
                            <p className="text-2xl font-bold text-green-700">
                              {optimizedRoute.savings.fuel.toLocaleString('vi-VN')} VNĐ
                            </p>
                            <p className="text-green-600">Savings</p>
                          </div>
                        </div>
                      </div>

                      {/* Traffic Analysis */}
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
                        <h4 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
                          <Activity className="w-5 h-5" />
                          Traffic Analysis
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div className="text-center p-3 bg-white rounded-lg border border-blue-100">
                            <p className="text-lg font-bold text-blue-700 capitalize">{optimizedRoute.trafficAnalysis.congestionLevel}</p>
                            <p className="text-blue-600">Congestion Level</p>
                          </div>
                          <div className="text-center p-3 bg-white rounded-lg border border-blue-100">
                            <p className="text-lg font-bold text-blue-700">{optimizedRoute.trafficAnalysis.delayMinutes} min</p>
                            <p className="text-blue-600">Traffic Delay</p>
                          </div>
                          <div className="text-center p-3 bg-white rounded-lg border border-blue-100">
                            <p className="text-lg font-bold text-blue-700">{optimizedRoute.trafficAnalysis.rushHourImpact ? 'Yes' : 'No'}</p>
                            <p className="text-blue-600">Rush Hour Impact</p>
                          </div>
                        </div>
                      </div>

                      {/* Restrictions and Warnings */}
                      {(optimizedRoute.restrictions.violations.length > 0 || optimizedRoute.restrictions.warnings.length > 0) && (
                        <div className="space-y-3">
                          {optimizedRoute.restrictions.violations.length > 0 && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                              <h4 className="font-semibold text-red-800 mb-2 flex items-center gap-2">
                                <AlertTriangle className="w-5 h-5" />
                                Route Violations
                              </h4>
                              <div className="space-y-2">
                                {optimizedRoute.restrictions.violations.map((violation, index) => (
                                  <div key={index} className="text-sm text-red-700 bg-white p-2 rounded border border-red-100">
                                    {violation}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {optimizedRoute.restrictions.warnings.length > 0 && (
                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                              <h4 className="font-semibold text-yellow-800 mb-2">Warnings</h4>
                              <div className="space-y-1">
                                {optimizedRoute.restrictions.warnings.map((warning, index) => (
                                  <div key={index} className="text-sm text-yellow-700">• {warning}</div>
                                ))}
                              </div>
                            </div>
                          )}

                          {optimizedRoute.restrictions.alternativeTimes.length > 0 && (
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                              <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
                                <Clock className="w-5 h-5" />
                                Suggested Alternative Times
                              </h4>
                              <div className="flex gap-2 flex-wrap">
                                {optimizedRoute.restrictions.alternativeTimes.map((time, index) => (
                                  <Button
                                    key={index}
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setDepartureTime(time)}
                                    className="text-xs"
                                  >
                                    {time}
                                  </Button>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  )
}

export default RouteOptimizationPage
