'use client'

import React, { useState, useEffect } from 'react'
import AuthGuard from '@/components/AuthGuard'
import TruckRouteMap from '@/components/TruckRouteMap'
import { truckRoutingEngine, RouteRequest, RouteResponse, VIETNAM_TRUCK_SPECS } from '@/lib/truckRoutingEngine'
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
  Activity
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

const RouteOptimizationPage = () => {
  const [routes, setRoutes] = useState<RoutePoint[]>([])
  const [optimizedRoute, setOptimizedRoute] = useState<RouteResponse | null>(null)
  const [isOptimizing, setIsOptimizing] = useState(false)
  const [optimizationProgress, setOptimizationProgress] = useState(0)
  const [departure, setDeparture] = useState<RoutePoint | null>(null)
  const [destination, setDestination] = useState<RoutePoint | null>(null)
  const [truckType, setTruckType] = useState<'20ft' | '40ft' | 'container_truck'>('40ft')
  const [departureTime, setDepartureTime] = useState('')
  const [showMap, setShowMap] = useState(true)
  const [newPoint, setNewPoint] = useState({ 
    name: '', 
    address: '', 
    type: 'pickup' as const,
    priority: 1
  })

  // Enhanced Vietnamese locations with more detail
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
    
    try {
      // Use the new truck routing engine
      const routeRequest: RouteRequest = {
        origin: {
          lat: departure.lat,
          lng: departure.lng,
          address: departure.address,
          name: departure.name,
          type: 'origin'
        },
        destination: {
          lat: destination.lat,
          lng: destination.lng,
          address: destination.address,
          name: destination.name,
          type: 'destination'
        },
        truck_specs: VIETNAM_TRUCK_SPECS[truckType],
        departure_time: departureTime ? 
          new Date(`2025-08-07T${departureTime}:00`).toISOString() : 
          new Date().toISOString(),
        stops: routes.filter(r => r.id !== departure.id && r.id !== destination.id)
          .map(r => ({
            lat: r.lat,
            lng: r.lng,
            address: r.address,
            name: r.name,
            type: 'stop' as const
          }))
      }

      const routeResponse = await truckRoutingEngine.calculateRoute(routeRequest)
      
      clearInterval(progressInterval)
      setOptimizationProgress(100)
      setOptimizedRoute(routeResponse)
      
      setTimeout(() => setOptimizationProgress(0), 1000)
    } catch (error) {
      console.error('Route optimization failed:', error)
      alert('Route optimization failed. Please try again.')
    } finally {
      setIsOptimizing(false)
    }
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
      setOptimizedRoute(null)
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

              {/* Route Points List */}
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
              {/* Interactive Map */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Map className="w-5 h-5" />
                    Vietnam Truck Route Map
                  </CardTitle>
                  <CardDescription>
                    High-detail map with truck restrictions, depots, and optimized routes
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="relative">
                    <TruckRouteMap
                      origin={departure ? {
                        lat: departure.lat,
                        lng: departure.lng,
                        address: departure.address,
                        name: departure.name,
                        type: 'origin'
                      } : undefined}
                      destination={destination ? {
                        lat: destination.lat,
                        lng: destination.lng,
                        address: destination.address,
                        name: destination.name,
                        type: 'destination'
                      } : undefined}
                      route={optimizedRoute}
                      showRestrictions={true}
                      showDepots={true}
                      className="w-full h-96"
                    />
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

                  {/* Results */}
                  {optimizedRoute && (
                    <div className="mt-6 space-y-4">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                          <Map className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                          <p className="text-2xl font-bold text-blue-600">{optimizedRoute.route.distance_km.toFixed(1)} km</p>
                          <p className="text-sm text-slate-600">Total Distance</p>
                        </div>
                        
                        <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200">
                          <Clock className="w-8 h-8 text-green-600 mx-auto mb-2" />
                          <p className="text-2xl font-bold text-green-600">
                            {Math.floor((optimizedRoute.route.duration_minutes + optimizedRoute.traffic_analysis.delay_minutes) / 60)}h {Math.round((optimizedRoute.route.duration_minutes + optimizedRoute.traffic_analysis.delay_minutes) % 60)}m
                          </p>
                          <p className="text-sm text-slate-600">Estimated Time</p>
                        </div>
                        
                        <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg border border-orange-200">
                          <Fuel className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                          <p className="text-2xl font-bold text-orange-600">
                            {optimizedRoute.cost_analysis.total_cost_vnd.toLocaleString('vi-VN')}
                          </p>
                          <p className="text-sm text-slate-600">Total Cost (VNĐ)</p>
                        </div>
                        
                        <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200">
                          <Target className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                          <p className="text-2xl font-bold text-purple-600">{optimizedRoute.cost_analysis.co2_emission_kg} kg</p>
                          <p className="text-sm text-slate-600">CO2 Emissions</p>
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
                                    <div className="font-medium">{violation.location}</div>
                                    <div>{violation.description}</div>
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
