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
  MapPin, 
  Navigation2, 
  Clock, 
  Fuel, 
  TrendingDown, 
  Navigation,
  Truck,
  Calculator,
  BarChart3,
  CheckCircle,
  Plus,
  X,
  Map,
  Target,
  Zap
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
  savings: {
    distance: number
    time: number
    fuel: number
  }
  efficiency: number
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
  const [newPoint, setNewPoint] = useState({ 
    name: '', 
    address: '', 
    type: 'pickup' as const,
    priority: 1
  })

  // Vietnam truck restrictions and regulations
  const vietnamTruckRestrictions = {
    "Ho Chi Minh City": {
      ban_hours: ["06:00-09:00", "16:00-20:00"],
      restricted_areas: ["District 1", "District 3", "District 5", "Binh Thanh District"],
      truck_routes: ["Ring Road 2", "Ring Road 3", "Highway 1A"],
      max_weight_40ft: 32000, // kg
      special_permits_required: ["city_center", "residential_areas"]
    },
    "Hanoi": {
      ban_hours: ["06:00-09:00", "15:00-21:00"],
      restricted_routes: ["Tran Duy Hung", "Kim Ma", "Giai Phong"],
      truck_routes: ["Ring Road 3", "Ring Road 4", "Highway 5"],
      max_weight_40ft: 32000,
      special_permits_required: ["old_quarter", "ba_dinh_district"]
    },
    "Da Nang": {
      ban_hours: ["07:00-09:00", "17:00-19:00"],
      restricted_areas: ["Han Market Area", "Dragon Bridge"],
      truck_routes: ["Vo Nguyen Giap", "Nguyen Tat Thanh"],
      max_weight_40ft: 32000,
      special_permits_required: ["beach_road", "tourist_areas"]
    }
  }

  // Check if route is allowed for 40ft container truck
  const isRouteAllowed = (point: RoutePoint, time: string): { allowed: boolean; reason?: string } => {
    const hour = new Date(`2025-01-01T${time}`).getHours()
    
    // Check Ho Chi Minh City restrictions
    if (point.address.includes('Hồ Chí Minh') || point.address.includes('TP.HCM')) {
      const restrictions = vietnamTruckRestrictions["Ho Chi Minh City"]
      
      // Check ban hours
      if ((hour >= 6 && hour <= 9) || (hour >= 16 && hour <= 20)) {
        return { 
          allowed: false, 
          reason: `40ft trucks banned in HCMC during rush hours (6-9 AM, 4-8 PM)` 
        }
      }
      
      // Check restricted areas
      if (restrictions.restricted_areas.some(area => point.address.includes(area))) {
        return { 
          allowed: false, 
          reason: `40ft trucks restricted in ${point.address} - use designated truck routes` 
        }
      }
    }
    
    // Check Hanoi restrictions
    if (point.address.includes('Hà Nội') || point.address.includes('Hanoi')) {
      const restrictions = vietnamTruckRestrictions["Hanoi"]
      
      if ((hour >= 6 && hour <= 9) || (hour >= 15 && hour <= 21)) {
        return { 
          allowed: false, 
          reason: `40ft trucks banned in Hanoi during rush hours (6-9 AM, 3-9 PM)` 
        }
      }
    }
    
    return { allowed: true }
  }

  // Calculate optimal departure time to avoid restrictions
  const calculateOptimalDepartureTime = (route: RoutePoint[]): string => {
    // Avoid rush hours in major cities
    const currentHour = new Date().getHours()
    
    // If current time is during rush hour, suggest next available time
    if (currentHour >= 6 && currentHour <= 9) {
      return "09:30" // After morning rush hour
    } else if (currentHour >= 15 && currentHour <= 21) {
      return "21:30" // After evening rush hour
    } else if (currentHour >= 22 || currentHour <= 5) {
      return "06:00" // Early morning before rush hour
    }
    
    return new Date().toTimeString().slice(0, 5) // Current time if no restrictions
  }
  const sampleRoutes: RoutePoint[] = [
    {
      id: '1',
      name: 'Kho trung tâm TP.HCM',
      address: 'Khu Công nghệ cao, Quận 9, TP. Hồ Chí Minh',
      lat: 10.8505,
      lng: 106.7717,
      type: 'warehouse',
      priority: 1,
      timeWindow: { start: '06:00', end: '22:00' }
    },
    {
      id: '2',
      name: 'Siêu thị Metro Thủ Đức',
      address: 'Đại lộ Phạm Văn Đồng, TP. Thủ Đức',
      lat: 10.8411,
      lng: 106.8098,
      type: 'delivery',
      priority: 2,
      timeWindow: { start: '08:00', end: '20:00' }
    },
    {
      id: '3',
      name: 'Chợ Bến Thành',
      address: 'Lê Lợi, Quận 1, TP. Hồ Chí Minh',
      lat: 10.7720,
      lng: 106.6980,
      type: 'pickup',
      priority: 3,
      timeWindow: { start: '05:00', end: '18:00' }
    },
    {
      id: '4',
      name: 'Cảng Cát Lái',
      address: 'Đường Đồng Văn Cống, Quận 2, TP. Hồ Chí Minh',
      lat: 10.7950,
      lng: 106.7767,
      type: 'pickup',
      priority: 1,
      timeWindow: { start: '06:00', end: '17:00' }
    },
    {
      id: '5',
      name: 'Khu công nghiệp Tân Thuận',
      address: 'Đường Huỳnh Tấn Phát, Quận 7, TP. Hồ Chí Minh',
      lat: 10.7378,
      lng: 106.7230,
      type: 'delivery',
      priority: 2,
      timeWindow: { start: '07:00', end: '19:00' }
    },
    {
      id: '6',
      name: 'Chợ đầu mối Hóc Môn',
      address: 'Quốc lộ 22, Huyện Hóc Môn, TP. Hồ Chí Minh',
      lat: 10.8833,
      lng: 106.5917,
      type: 'pickup',
      priority: 2,
      timeWindow: { start: '04:00', end: '16:00' }
    }
  ]

  useEffect(() => {
    setRoutes(sampleRoutes)
  }, [])

  const optimizeRoute = async () => {
    if (!departure || !destination) {
      alert('Please select both departure and destination points')
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
    
    // Simulate complex route optimization algorithm for Vietnam
    setTimeout(() => {
      clearInterval(progressInterval)
      setOptimizationProgress(100)
      
      // Check route legality
      const departureCheck = isRouteAllowed(departure, departureTime || '08:00')
      const destinationCheck = isRouteAllowed(destination, departureTime || '08:00')
      
      if (!departureCheck.allowed || !destinationCheck.allowed) {
        alert(`Route not allowed: ${departureCheck.reason || destinationCheck.reason}`)
        setIsOptimizing(false)
        return
      }
      
      // Create optimized route with Vietnam-specific considerations
      const routeSequence = [departure]
      
      // Add intermediate pickup/delivery points if any
      const intermediatePoints = routes.filter(r => 
        r.id !== departure.id && 
        r.id !== destination.id && 
        (r.type === 'pickup' || r.type === 'delivery')
      ).sort((a, b) => a.priority - b.priority)
      
      routeSequence.push(...intermediatePoints)
      routeSequence.push(destination)
      
      // Find nearest depot for return
      const depots = routes.filter(r => r.type === 'warehouse')
      if (depots.length > 0) {
        const nearestDepot = depots.reduce((nearest, depot) => {
          const distToNearest = calculateTotalDistance([destination, nearest])
          const distToDepot = calculateTotalDistance([destination, depot])
          return distToDepot < distToNearest ? depot : nearest
        })
        routeSequence.push(nearestDepot)
      }
      
      // Calculate metrics with Vietnam-specific factors
      const totalDistance = calculateTotalDistance(routeSequence)
      const estimatedTime = calculateEstimatedTimeVietnam(routeSequence, departureTime || '08:00')
      const fuelCost = calculateFuelCostVietnam(totalDistance, truckType)
      const tollCost = calculateTollCostVietnam(routeSequence)
      
      // Calculate savings compared to non-optimized route
      const nonOptimizedDistance = totalDistance * 1.45 // 45% longer without Vietnam optimization
      const savings = {
        distance: nonOptimizedDistance - totalDistance,
        time: Math.round((nonOptimizedDistance - totalDistance) * 2.5), // 2.5 minutes per km saved in Vietnam traffic
        fuel: (nonOptimizedDistance - totalDistance) * 18000 // 18,000 VND per km in Vietnam
      }
      
      const optimized: OptimizedRoute = {
        id: 'opt-' + Date.now(),
        points: routeSequence,
        distance: totalDistance,
        estimatedTime,
        fuelCost: fuelCost + tollCost,
        savings,
        efficiency: Math.round((savings.distance / nonOptimizedDistance) * 100)
      }
      
      setOptimizedRoute(optimized)
      setIsOptimizing(false)
      setTimeout(() => setOptimizationProgress(0), 1000)
    }, 2500)
  }

  const calculateTotalDistance = (points: RoutePoint[]): number => {
    let total = 0
    for (let i = 0; i < points.length - 1; i++) {
      const p1 = points[i]
      const p2 = points[i + 1]
      // Haversine formula for distance calculation
      const R = 6371 // Earth's radius in km
      const dLat = (p2.lat - p1.lat) * Math.PI / 180
      const dLng = (p2.lng - p1.lng) * Math.PI / 180
      const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.cos(p1.lat * Math.PI / 180) * Math.cos(p2.lat * Math.PI / 180) *
                Math.sin(dLng/2) * Math.sin(dLng/2)
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
      total += R * c
    }
    return Math.round(total * 10) / 10
  }

  const calculateEstimatedTimeVietnam = (points: RoutePoint[], startTime: string): number => {
    const distance = calculateTotalDistance(points)
    let avgSpeed = 35 // km/h in city traffic
    
    // Adjust speed based on Vietnam traffic conditions
    const hour = new Date(`2025-01-01T${startTime}`).getHours()
    if ((hour >= 6 && hour <= 9) || (hour >= 16 && hour <= 20)) {
      avgSpeed = 20 // Rush hour speed in Vietnam
    } else if (hour >= 22 || hour <= 5) {
      avgSpeed = 50 // Night time speed
    }
    
    // Add extra time for Vietnam-specific delays
    const stopTime = (points.length - 1) * 20 // 20 minutes per stop (includes paperwork)
    const trafficBuffer = distance * 0.5 // Extra 0.5 minutes per km for Vietnam traffic
    
    return Math.round(distance / avgSpeed * 60 + stopTime + trafficBuffer)
  }

  const calculateFuelCostVietnam = (distance: number, truckType: string): number => {
    let fuelConsumption = 0.12 // liters per km for 40ft
    
    switch (truckType) {
      case '20ft':
        fuelConsumption = 0.10
        break
      case '40ft':
        fuelConsumption = 0.12
        break
      case 'container_truck':
        fuelConsumption = 0.15
        break
    }
    
    const fuelPrice = 26500 // VND per liter (current Vietnam diesel price)
    return Math.round(distance * fuelConsumption * fuelPrice)
  }

  const calculateTollCostVietnam = (points: RoutePoint[]): number => {
    let tollCost = 0
    
    // Estimate toll costs based on route (simplified)
    for (let i = 0; i < points.length - 1; i++) {
      const p1 = points[i]
      const p2 = points[i + 1]
      const distance = calculateTotalDistance([p1, p2])
      
      // Vietnam highway toll rates for container trucks
      if (distance > 50) { // Long distance likely uses highways
        tollCost += distance * 2500 // ~2,500 VND per km on highways
      }
    }
    
    return tollCost
  }

  const addRoutePoint = () => {
    if (newPoint.name && newPoint.address) {
      const point: RoutePoint = {
        id: Date.now().toString(),
        name: newPoint.name,
        address: newPoint.address,
        lat: 10.7769 + (Math.random() - 0.5) * 0.2,
        lng: 106.7009 + (Math.random() - 0.5) * 0.2,
        type: newPoint.type,
        priority: newPoint.priority,
        timeWindow: { start: '08:00', end: '17:00' }
      }
      
      setRoutes(prev => [...prev, point])
      setNewPoint({ name: '', address: '', type: 'pickup', priority: 1 })
      setOptimizedRoute(null) // Reset optimization when routes change
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

  const getPriorityColor = (priority: number) => {
    switch (priority) {
      case 1: return 'bg-red-100 text-red-800'
      case 2: return 'bg-yellow-100 text-yellow-800'
      case 3: return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-slate-900 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">AI Route Optimization</h1>
            <p className="text-slate-400">
              Tối ưu hóa tuyến đường vận chuyển với AI để tiết kiệm thời gian, chi phí và nhiên liệu
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Route Points Management */}
            <div className="lg:col-span-1 space-y-6">
              {/* Departure & Destination Selection */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Navigation2 className="w-5 h-5" />
                    40ft Container Truck Route
                  </CardTitle>
                  <CardDescription>
                    Select departure and destination for Vietnam truck routing
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Truck Type Selection */}
                    <div className="space-y-2">
                      <Label htmlFor="truck-type">Truck Type</Label>
                      <select
                        id="truck-type"
                        value={truckType}
                        onChange={(e) => setTruckType(e.target.value as any)}
                        className="w-full p-2 border rounded-md text-sm"
                      >
                        <option value="40ft">40ft Container Truck</option>
                        <option value="20ft">20ft Container Truck</option>
                        <option value="container_truck">Standard Container Truck</option>
                      </select>
                    </div>

                    {/* Departure Selection */}
                    <div className="space-y-2">
                      <Label htmlFor="departure">Departure Point</Label>
                      <select
                        id="departure"
                        value={departure?.id || ''}
                        onChange={(e) => {
                          const selected = routes.find(r => r.id === e.target.value)
                          setDeparture(selected || null)
                        }}
                        className="w-full p-2 border rounded-md text-sm"
                      >
                        <option value="">Select departure point...</option>
                        {routes.filter(r => r.type === 'warehouse' || r.type === 'pickup').map(point => (
                          <option key={point.id} value={point.id}>
                            {point.name} - {point.address}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Destination Selection */}
                    <div className="space-y-2">
                      <Label htmlFor="destination">Destination Point</Label>
                      <select
                        id="destination"
                        value={destination?.id || ''}
                        onChange={(e) => {
                          const selected = routes.find(r => r.id === e.target.value)
                          setDestination(selected || null)
                        }}
                        className="w-full p-2 border rounded-md text-sm"
                      >
                        <option value="">Select destination point...</option>
                        {routes.filter(r => r.type === 'delivery' || r.type === 'warehouse').map(point => (
                          <option key={point.id} value={point.id}>
                            {point.name} - {point.address}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Departure Time */}
                    <div className="space-y-2">
                      <Label htmlFor="departure-time">Departure Time</Label>
                      <Input
                        id="departure-time"
                        type="time"
                        value={departureTime}
                        onChange={(e) => setDepartureTime(e.target.value)}
                        placeholder="Select departure time"
                      />
                      {departure && departureTime && (
                        <div className="text-xs">
                          {(() => {
                            const check = isRouteAllowed(departure, departureTime)
                            return check.allowed ? (
                              <span className="text-green-600 flex items-center gap-1">
                                <CheckCircle className="w-3 h-3" />
                                Route allowed for {truckType} truck
                              </span>
                            ) : (
                              <span className="text-red-600 flex items-center gap-1">
                                <AlertTriangle className="w-3 h-3" />
                                {check.reason}
                              </span>
                            )
                          })()}
                        </div>
                      )}
                    </div>

                    {/* Quick Time Suggestions */}
                    <div className="space-y-2">
                      <Label>Suggested Times (Avoid Rush Hours)</Label>
                      <div className="flex gap-2 flex-wrap">
                        {['06:00', '09:30', '14:00', '21:30'].map(time => (
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

                    {/* Route Status */}
                    {departure && destination && (
                      <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="text-sm font-medium text-blue-800 mb-2">Route Summary</div>
                        <div className="text-xs text-blue-700 space-y-1">
                          <div>From: {departure.name}</div>
                          <div>To: {destination.name}</div>
                          <div>Truck: {truckType} Container</div>
                          <div>Time: {departureTime || 'Not set'}</div>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="w-5 h-5" />
                    Thêm điểm mới
                  </CardTitle>
                  <CardDescription>
                    Thêm điểm pickup, delivery hoặc warehouse
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="point-name">Tên điểm</Label>
                      <Input
                        id="point-name"
                        value={newPoint.name}
                        onChange={(e) => setNewPoint(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="VD: Kho Tân Bình"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="point-address">Địa chỉ</Label>
                      <Input
                        id="point-address"
                        value={newPoint.address}
                        onChange={(e) => setNewPoint(prev => ({ ...prev, address: e.target.value }))}
                        placeholder="VD: 123 Đường ABC, Quận 1"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-2">
                        <Label htmlFor="point-type">Loại điểm</Label>
                        <select
                          id="point-type"
                          value={newPoint.type}
                          onChange={(e) => setNewPoint(prev => ({ ...prev, type: e.target.value as any }))}
                          className="w-full p-2 border rounded-md text-sm"
                        >
                          <option value="pickup">Pickup</option>
                          <option value="delivery">Delivery</option>
                          <option value="warehouse">Warehouse</option>
                        </select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="point-priority">Ưu tiên</Label>
                        <select
                          id="point-priority"
                          value={newPoint.priority}
                          onChange={(e) => setNewPoint(prev => ({ ...prev, priority: parseInt(e.target.value) }))}
                          className="w-full p-2 border rounded-md text-sm"
                        >
                          <option value={1}>Cao (1)</option>
                          <option value={2}>Trung bình (2)</option>
                          <option value={3}>Thấp (3)</option>
                        </select>
                      </div>
                    </div>
                    
                    <Button onClick={addRoutePoint} className="w-full">
                      <Plus className="w-4 h-4 mr-2" />
                      Thêm điểm
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Danh sách điểm ({routes.length})</span>
                    {routes.length > 0 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setRoutes([])}
                        className="text-red-600 hover:text-red-700"
                      >
                        Xóa tất cả
                      </Button>
                    )}
                  </CardTitle>
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
                            {point.timeWindow && (
                              <p className="text-xs text-slate-400">
                                {point.timeWindow.start} - {point.timeWindow.end}
                              </p>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPointTypeColor(point.type)}`}>
                            {point.type}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(point.priority)}`}>
                            P{point.priority}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeRoutePoint(point.id)}
                            className="text-red-500 hover:text-red-700 p-1"
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    
                    {routes.length === 0 && (
                      <div className="text-center py-8 text-slate-500">
                        <MapPin className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        <p>Chưa có điểm nào</p>
                        <p className="text-xs">Thêm điểm để bắt đầu tối ưu</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Optimization Results */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="w-5 h-5" />
                    AI Route Optimization Engine
                  </CardTitle>
                  <CardDescription>
                    Sử dụng thuật toán AI tiên tiến để tối ưu tuyến đường thông minh
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isOptimizing && optimizationProgress > 0 && (
                    <div className="mb-4 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Đang tối ưu hóa...</span>
                        <span>{optimizationProgress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-indigo-600 to-purple-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${optimizationProgress}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-slate-500">
                        {optimizationProgress < 30 && "Phân tích các điểm..."}
                        {optimizationProgress >= 30 && optimizationProgress < 60 && "Tính toán khoảng cách..."}
                        {optimizationProgress >= 60 && optimizationProgress < 90 && "Tối ưu hóa tuyến đường..."}
                        {optimizationProgress >= 90 && "Hoàn thành!"}
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
                          <p className="text-sm text-slate-600">Tổng quãng đường</p>
                        </div>
                        
                        <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200">
                          <Clock className="w-8 h-8 text-green-600 mx-auto mb-2" />
                          <p className="text-2xl font-bold text-green-600">
                            {Math.floor(optimizedRoute.estimatedTime / 60)}h {optimizedRoute.estimatedTime % 60}m
                          </p>
                          <p className="text-sm text-slate-600">Thời gian ước tính</p>
                        </div>
                        
                        <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg border border-orange-200">
                          <Fuel className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                          <p className="text-2xl font-bold text-orange-600">
                            {optimizedRoute.fuelCost.toLocaleString('vi-VN')}
                          </p>
                          <p className="text-sm text-slate-600">Chi phí nhiên liệu (VNĐ)</p>
                        </div>
                        
                        <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200">
                          <Target className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                          <p className="text-2xl font-bold text-purple-600">{optimizedRoute.efficiency}%</p>
                          <p className="text-sm text-slate-600">Hiệu quả tối ưu</p>
                        </div>
                      </div>

                      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4">
                        <h4 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
                          <TrendingDown className="w-5 h-5" />
                          Tiết kiệm được nhờ AI Optimization
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div className="text-center p-3 bg-white rounded-lg border border-green-100">
                            <p className="text-2xl font-bold text-green-700">{optimizedRoute.savings.distance.toFixed(1)} km</p>
                            <p className="text-green-600">Quãng đường</p>
                          </div>
                          <div className="text-center p-3 bg-white rounded-lg border border-green-100">
                            <p className="text-2xl font-bold text-green-700">{optimizedRoute.savings.time} phút</p>
                            <p className="text-green-600">Thời gian</p>
                          </div>
                          <div className="text-center p-3 bg-white rounded-lg border border-green-100">
                            <p className="text-2xl font-bold text-green-700">
                              {optimizedRoute.savings.fuel.toLocaleString('vi-VN')} VNĐ
                            </p>
                            <p className="text-green-600">Chi phí nhiên liệu</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {optimizedRoute && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      Tuyến đường tối ưu
                    </CardTitle>
                    <CardDescription>
                      Thứ tự điểm đã được AI tối ưu hóa dựa trên khoảng cách, ưu tiên và thời gian
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {optimizedRoute.points.map((point, index) => (
                        <div key={`${point.id}-${index}`} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border">
                          <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                            {index + 1}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              {getPointTypeIcon(point.type)}
                              <p className="font-medium truncate">{point.name}</p>
                            </div>
                            <p className="text-sm text-slate-500 truncate">{point.address}</p>
                            {point.timeWindow && (
                              <p className="text-xs text-slate-400">
                                Giờ hoạt động: {point.timeWindow.start} - {point.timeWindow.end}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center gap-1 flex-shrink-0">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPointTypeColor(point.type)}`}>
                              {point.type}
                            </span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(point.priority)}`}>
                              P{point.priority}
                            </span>
                          </div>
                          
                          {index < optimizedRoute.points.length - 1 && (
                            <div className="absolute left-8 mt-12 w-0.5 h-4 bg-gradient-to-b from-indigo-300 to-purple-300"></div>
                          )}
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-6 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-200">
                      <div className="flex items-center gap-2 mb-2">
                        <BarChart3 className="w-5 h-5 text-indigo-600" />
                        <h4 className="font-semibold text-indigo-800">Phân tích tối ưu hóa</h4>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-indigo-700 font-medium">Thuật toán sử dụng:</p>
                          <p className="text-indigo-600">AI-Enhanced TSP với ưu tiên</p>
                        </div>
                        <div>
                          <p className="text-indigo-700 font-medium">Yếu tố tối ưu:</p>
                          <p className="text-indigo-600">Khoảng cách, thời gian, ưu tiên</p>
                        </div>
                      </div>
                    </div>
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

export default RouteOptimizationPage
