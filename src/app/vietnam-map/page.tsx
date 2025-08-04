'use client'

import React, { useState, useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { 
  MapPin, 
  Navigation, 
  Truck, 
  Clock, 
  DollarSign, 
  Fuel, 
  AlertTriangle,
  Route,
  Settings,
  Play,
  RefreshCw
} from 'lucide-react'
import { useTranslation } from '@/lib/i18n/useTranslation'
import { vietnamLocations, VietnamLocation } from '@/lib/vietnam-map/data'
import { VietnamRouteOptimizer, RouteOptimizationRequest, OptimizedRoute } from '@/lib/vietnam-map/route-optimizer'

// Dynamic import for Leaflet to avoid SSR issues
const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false })
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false })
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false })
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false })
const Polyline = dynamic(() => import('react-leaflet').then(mod => mod.Polyline), { ssr: false })

interface RouteFormData {
  departure: string
  destination: string
  containerType: '20ft' | '40ft' | '45ft'
  cargoWeight: number
  priority: 'cost' | 'time' | 'fuel' | 'balanced'
  avoidTolls: boolean
  avoidRushHour: boolean
  departureTime: string
}

export default function VietnamMapPage() {
  const { t, locale } = useTranslation()
  const [isMapLoaded, setIsMapLoaded] = useState(false)
  const [routeOptimizer] = useState(() => new VietnamRouteOptimizer())
  const [optimizedRoute, setOptimizedRoute] = useState<OptimizedRoute | null>(null)
  const [isOptimizing, setIsOptimizing] = useState(false)
  const [selectedLocation, setSelectedLocation] = useState<VietnamLocation | null>(null)
  const [routeForm, setRouteForm] = useState<RouteFormData>({
    departure: '',
    destination: '',
    containerType: '40ft',
    cargoWeight: 20,
    priority: 'balanced',
    avoidTolls: false,
    avoidRushHour: true,
    departureTime: new Date().toISOString().slice(0, 16)
  })

  useEffect(() => {
    setIsMapLoaded(true)
  }, [])

  const handleOptimizeRoute = async () => {
    if (!routeForm.departure || !routeForm.destination) {
      alert(locale === 'vi' ? 'Vui lòng chọn điểm đi và điểm đến' : 'Please select departure and destination')
      return
    }

    setIsOptimizing(true)
    try {
      const request: RouteOptimizationRequest = {
        departure: routeForm.departure,
        destination: routeForm.destination,
        containerType: routeForm.containerType,
        cargoWeight: routeForm.cargoWeight,
        priority: routeForm.priority,
        avoidTolls: routeForm.avoidTolls,
        avoidRushHour: routeForm.avoidRushHour,
        departureTime: new Date(routeForm.departureTime)
      }

      const result = await routeOptimizer.optimizeRoute(request)
      setOptimizedRoute(result)
    } catch (error) {
      console.error('Route optimization error:', error)
      alert(locale === 'vi' ? 'Lỗi tối ưu tuyến đường' : 'Route optimization error')
    } finally {
      setIsOptimizing(false)
    }
  }

  const getLocationIcon = (location: VietnamLocation) => {
    switch (location.type) {
      case 'port': return '🚢'
      case 'depot': return '🏭'
      case 'industrial_zone': return '🏗️'
      default: return '🏙️'
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(locale === 'vi' ? 'vi-VN' : 'en-US', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    if (locale === 'vi') {
      return `${hours}h ${mins}p`
    }
    return `${hours}h ${mins}m`
  }

  if (!isMapLoaded) {
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
            <MapPin className="mr-3 h-8 w-8 text-green-600" />
            {locale === 'vi' ? 'Bản đồ Việt Nam & Tối ưu Tuyến đường' : 'Vietnam Map & Route Optimization'}
          </h1>
          <p className="text-gray-600 mt-2">
            {locale === 'vi' 
              ? 'Tối ưu tuyến đường cho container 40ft với AI thông minh'
              : 'AI-powered route optimization for 40ft containers'
            }
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Route Optimization Panel */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Route className="mr-2 h-5 w-5" />
                {locale === 'vi' ? 'Tối ưu Tuyến đường' : 'Route Optimization'}
              </CardTitle>
              <CardDescription>
                {locale === 'vi' 
                  ? 'Tìm tuyến đường tối ưu cho container 40ft'
                  : 'Find optimal routes for 40ft containers'
                }
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Departure Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {locale === 'vi' ? 'Điểm đi' : 'Departure'}
                </label>
                <select
                  value={routeForm.departure}
                  onChange={(e) => setRouteForm(prev => ({ ...prev, departure: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">{locale === 'vi' ? 'Chọn điểm đi' : 'Select departure'}</option>
                  {vietnamLocations.map(location => (
                    <option key={location.id} value={location.id}>
                      {getLocationIcon(location)} {locale === 'vi' ? location.nameVi : location.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Destination Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {locale === 'vi' ? 'Điểm đến' : 'Destination'}
                </label>
                <select
                  value={routeForm.destination}
                  onChange={(e) => setRouteForm(prev => ({ ...prev, destination: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">{locale === 'vi' ? 'Chọn điểm đến' : 'Select destination'}</option>
                  {vietnamLocations.map(location => (
                    <option key={location.id} value={location.id}>
                      {getLocationIcon(location)} {locale === 'vi' ? location.nameVi : location.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Container Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {locale === 'vi' ? 'Loại container' : 'Container Type'}
                </label>
                <select
                  value={routeForm.containerType}
                  onChange={(e) => setRouteForm(prev => ({ ...prev, containerType: e.target.value as any }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="20ft">20ft Container</option>
                  <option value="40ft">40ft Container</option>
                  <option value="45ft">45ft Container</option>
                </select>
              </div>

              {/* Cargo Weight */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {locale === 'vi' ? 'Trọng lượng hàng (tấn)' : 'Cargo Weight (tons)'}
                </label>
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={routeForm.cargoWeight}
                  onChange={(e) => setRouteForm(prev => ({ ...prev, cargoWeight: parseInt(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Priority */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {locale === 'vi' ? 'Ưu tiên' : 'Priority'}
                </label>
                <select
                  value={routeForm.priority}
                  onChange={(e) => setRouteForm(prev => ({ ...prev, priority: e.target.value as any }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="balanced">{locale === 'vi' ? 'Cân bằng' : 'Balanced'}</option>
                  <option value="cost">{locale === 'vi' ? 'Chi phí thấp' : 'Lowest Cost'}</option>
                  <option value="time">{locale === 'vi' ? 'Thời gian ngắn' : 'Fastest Time'}</option>
                  <option value="fuel">{locale === 'vi' ? 'Tiết kiệm nhiên liệu' : 'Fuel Efficient'}</option>
                </select>
              </div>

              {/* Options */}
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={routeForm.avoidTolls}
                    onChange={(e) => setRouteForm(prev => ({ ...prev, avoidTolls: e.target.checked }))}
                    className="mr-2"
                  />
                  <span className="text-sm">{locale === 'vi' ? 'Tránh trạm thu phí' : 'Avoid tolls'}</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={routeForm.avoidRushHour}
                    onChange={(e) => setRouteForm(prev => ({ ...prev, avoidRushHour: e.target.checked }))}
                    className="mr-2"
                  />
                  <span className="text-sm">{locale === 'vi' ? 'Tránh giờ cao điểm' : 'Avoid rush hour'}</span>
                </label>
              </div>

              {/* Departure Time */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {locale === 'vi' ? 'Thời gian khởi hành' : 'Departure Time'}
                </label>
                <input
                  type="datetime-local"
                  value={routeForm.departureTime}
                  onChange={(e) => setRouteForm(prev => ({ ...prev, departureTime: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Optimize Button */}
              <button
                onClick={handleOptimizeRoute}
                disabled={isOptimizing || !routeForm.departure || !routeForm.destination}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isOptimizing ? (
                  <RefreshCw className="animate-spin mr-2 h-4 w-4" />
                ) : (
                  <Navigation className="mr-2 h-4 w-4" />
                )}
                {isOptimizing 
                  ? (locale === 'vi' ? 'Đang tối ưu...' : 'Optimizing...') 
                  : (locale === 'vi' ? 'Tối ưu tuyến đường' : 'Optimize Route')
                }
              </button>
            </CardContent>
          </Card>

          {/* Route Results */}
          {optimizedRoute && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Truck className="mr-2 h-5 w-5" />
                  {locale === 'vi' ? 'Tuyến đường tối ưu' : 'Optimized Route'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Route Summary */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <Clock className="h-6 w-6 text-blue-600 mx-auto mb-1" />
                    <p className="text-sm text-gray-600">{locale === 'vi' ? 'Thời gian' : 'Duration'}</p>
                    <p className="font-bold">{formatDuration(optimizedRoute.totalDuration)}</p>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <Navigation className="h-6 w-6 text-green-600 mx-auto mb-1" />
                    <p className="text-sm text-gray-600">{locale === 'vi' ? 'Khoảng cách' : 'Distance'}</p>
                    <p className="font-bold">{optimizedRoute.totalDistance} km</p>
                  </div>
                  <div className="text-center p-3 bg-yellow-50 rounded-lg">
                    <DollarSign className="h-6 w-6 text-yellow-600 mx-auto mb-1" />
                    <p className="text-sm text-gray-600">{locale === 'vi' ? 'Chi phí' : 'Total Cost'}</p>
                    <p className="font-bold">{formatCurrency(optimizedRoute.totalCost)}</p>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <Fuel className="h-6 w-6 text-purple-600 mx-auto mb-1" />
                    <p className="text-sm text-gray-600">{locale === 'vi' ? 'Nhiên liệu' : 'Fuel Cost'}</p>
                    <p className="font-bold">{formatCurrency(optimizedRoute.fuelCost)}</p>
                  </div>
                </div>

                {/* Confidence Score */}
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">{locale === 'vi' ? 'Độ tin cậy' : 'Confidence'}</span>
                    <span className="text-sm font-bold">{Math.round(optimizedRoute.confidence * 100)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${optimizedRoute.confidence * 100}%` }}
                    ></div>
                  </div>
                </div>

                {/* Warnings */}
                {optimizedRoute.warnings.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-medium text-orange-800 flex items-center">
                      <AlertTriangle className="mr-2 h-4 w-4" />
                      {locale === 'vi' ? 'Cảnh báo' : 'Warnings'}
                    </h4>
                    {optimizedRoute.warnings.map((warning, index) => (
                      <div key={index} className="p-2 bg-orange-50 border border-orange-200 rounded text-sm text-orange-800">
                        {warning}
                      </div>
                    ))}
                  </div>
                )}

                {/* Recommendations */}
                {optimizedRoute.recommendations.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-medium text-blue-800">
                      {locale === 'vi' ? 'Khuyến nghị' : 'Recommendations'}
                    </h4>
                    {optimizedRoute.recommendations.map((rec, index) => (
                      <div key={index} className="p-2 bg-blue-50 border border-blue-200 rounded text-sm text-blue-800">
                        {rec}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Map Display */}
        <div className="lg:col-span-2">
          <Card className="h-[800px]">
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="mr-2 h-5 w-5" />
                {locale === 'vi' ? 'Bản đồ Việt Nam' : 'Vietnam Map'}
              </CardTitle>
            </CardHeader>
            <CardContent className="h-full p-0">
              <div className="h-full rounded-lg overflow-hidden">
                <MapContainer
                  center={[16.0544, 108.2022]} // Center of Vietnam
                  zoom={6}
                  style={{ height: '100%', width: '100%' }}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  
                  {/* Location Markers */}
                  {vietnamLocations.map(location => (
                    <Marker
                      key={location.id}
                      position={[location.lat, location.lng]}
                      eventHandlers={{
                        click: () => setSelectedLocation(location)
                      }}
                    >
                      <Popup>
                        <div className="p-2">
                          <h3 className="font-bold">
                            {getLocationIcon(location)} {locale === 'vi' ? location.nameVi : location.name}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {locale === 'vi' ? location.provinceVi : location.province}
                          </p>
                          <p className="text-sm">
                            {locale === 'vi' ? 'Loại: ' : 'Type: '}
                            <span className="capitalize">{location.type.replace('_', ' ')}</span>
                          </p>
                          {location.containerCapacity && (
                            <p className="text-sm">
                              {locale === 'vi' ? 'Sức chứa: ' : 'Capacity: '}
                              {location.containerCapacity.toLocaleString()} containers
                            </p>
                          )}
                          <p className="text-sm">
                            40ft {locale === 'vi' ? 'truy cập: ' : 'access: '}
                            <span className={location.truckAccess40ft ? 'text-green-600' : 'text-red-600'}>
                              {location.truckAccess40ft 
                                ? (locale === 'vi' ? 'Có' : 'Yes') 
                                : (locale === 'vi' ? 'Không' : 'No')
                              }
                            </span>
                          </p>
                        </div>
                      </Popup>
                    </Marker>
                  ))}

                  {/* Route Visualization */}
                  {optimizedRoute && optimizedRoute.waypoints.length > 1 && (
                    <Polyline
                      positions={optimizedRoute.waypoints.map(wp => [wp.location.lat, wp.location.lng])}
                      color="blue"
                      weight={4}
                      opacity={0.7}
                    />
                  )}
                </MapContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
