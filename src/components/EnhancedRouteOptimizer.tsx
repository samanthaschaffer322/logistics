'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useEnhancedTranslation } from '@/lib/i18n/enhanced-translation'
import { 
  MapPin, 
  Navigation as NavigationIcon, 
  Truck, 
  Clock, 
  DollarSign, 
  Fuel, 
  AlertTriangle,
  Route,
  Settings,
  Play,
  RefreshCw,
  Container,
  Timer,
  TrendingUp,
  Zap,
  CheckCircle,
  XCircle,
  Info,
  Download,
  Share2,
  Target,
  BarChart3,
  Layers
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui-components'
import EnhancedVietnameseProcessor, { 
  type VietnameseRouteData, 
  type DepotLocation, 
  type OptimizedRoute 
} from '@/lib/file-learning/enhanced-vietnamese-processor'

interface RouteOptimizerProps {
  onRouteOptimized?: (route: OptimizedRoute) => void
  learnedRoutes?: VietnameseRouteData[]
  className?: string
}

interface OptimizationSettings {
  priority: 'cost' | 'time' | 'fuel' | 'balanced'
  avoidTolls: boolean
  avoidRushHour: boolean
  includeEmptyReturn: boolean
  containerType: '20ft' | '40ft' | '45ft'
  maxDetourDistance: number
  fuelEfficiencyMode: boolean
}

export default function EnhancedRouteOptimizer({ 
  onRouteOptimized, 
  learnedRoutes = [],
  className = '' 
}: RouteOptimizerProps) {
  const { t, locale } = useEnhancedTranslation()
  const [isOptimizing, setIsOptimizing] = useState(false)
  const [optimizedRoutes, setOptimizedRoutes] = useState<OptimizedRoute[]>([])
  const [selectedRoute, setSelectedRoute] = useState<VietnameseRouteData | null>(null)
  const [showSettings, setShowSettings] = useState(false)
  const [departureQuery, setDepartureQuery] = useState('')
  const [destinationQuery, setDestinationQuery] = useState('')
  const [departureSuggestions, setDepartureSuggestions] = useState<DepotLocation[]>([])
  const [destinationSuggestions, setDestinationSuggestions] = useState<DepotLocation[]>([])
  const [selectedDeparture, setSelectedDeparture] = useState<DepotLocation | null>(null)
  const [selectedDestination, setSelectedDestination] = useState<DepotLocation | null>(null)
  
  const [settings, setSettings] = useState<OptimizationSettings>({
    priority: 'balanced',
    avoidTolls: false,
    avoidRushHour: true,
    includeEmptyReturn: true,
    containerType: '40ft',
    maxDetourDistance: 50,
    fuelEfficiencyMode: true
  })

  // Real-time location suggestions
  useEffect(() => {
    if (departureQuery.length >= 2) {
      const suggestions = EnhancedVietnameseProcessor.getLocationSuggestions(departureQuery)
      setDepartureSuggestions(suggestions)
    } else {
      setDepartureSuggestions([])
    }
  }, [departureQuery])

  useEffect(() => {
    if (destinationQuery.length >= 2) {
      const suggestions = EnhancedVietnameseProcessor.getLocationSuggestions(destinationQuery)
      setDestinationSuggestions(suggestions)
    } else {
      setDestinationSuggestions([])
    }
  }, [destinationQuery])

  const handleOptimizeRoute = useCallback(async () => {
    if (!selectedDeparture || !selectedDestination) {
      alert(t('vietnamMap.selectDeparture') + ' và ' + t('vietnamMap.selectDestination'))
      return
    }

    setIsOptimizing(true)
    
    try {
      // Create a route from selected locations
      const route: VietnameseRouteData = {
        id: `route-${Date.now()}`,
        noiDi: selectedDeparture.ten,
        noiDen: selectedDestination.ten,
        noiHaRong: '',
        containerType: settings.containerType,
        taiXe: '',
        phuongTien: '',
        ngayVanChuyen: new Date(),
        quangDuong: calculateDistance(selectedDeparture.toaDo, selectedDestination.toaDo),
        chiPhiNhienLieu: 0,
        thoiGianVanChuyen: 0,
        ghiChu: `Optimized route with ${settings.priority} priority`,
        trangThai: 'pending'
      }

      // Simulate optimization process
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const optimizedRoute = EnhancedVietnameseProcessor.optimizeRoute(route)
      
      // Apply settings-based optimizations
      if (settings.fuelEfficiencyMode) {
        optimizedRoute.fuelSavings *= 1.2
      }
      
      if (settings.avoidRushHour && optimizedRoute.rushHourRestrictions) {
        optimizedRoute.optimizedTime *= 0.8 // Better time savings
      }

      setOptimizedRoutes(prev => [optimizedRoute, ...prev.slice(0, 4)]) // Keep last 5 routes
      onRouteOptimized?.(optimizedRoute)
      
    } catch (error) {
      console.error('Route optimization error:', error)
      alert(locale === 'vi' ? 'Lỗi tối ưu tuyến đường' : 'Route optimization error')
    } finally {
      setIsOptimizing(false)
    }
  }, [selectedDeparture, selectedDestination, settings, t, locale, onRouteOptimized])

  const handleBulkOptimization = useCallback(async () => {
    if (learnedRoutes.length === 0) {
      alert(locale === 'vi' ? 'Không có tuyến đường nào để tối ưu' : 'No routes to optimize')
      return
    }

    setIsOptimizing(true)
    
    try {
      const optimizedBatch: OptimizedRoute[] = []
      
      for (const route of learnedRoutes.slice(0, 10)) { // Optimize first 10 routes
        await new Promise(resolve => setTimeout(resolve, 500)) // Simulate processing
        const optimized = EnhancedVietnameseProcessor.optimizeRoute(route)
        optimizedBatch.push(optimized)
      }
      
      setOptimizedRoutes(optimizedBatch)
      
    } catch (error) {
      console.error('Bulk optimization error:', error)
    } finally {
      setIsOptimizing(false)
    }
  }, [learnedRoutes, locale])

  const calculateDistance = (point1: { lat: number; lng: number }, point2: { lat: number; lng: number }): number => {
    // Haversine formula for distance calculation
    const R = 6371 // Earth's radius in km
    const dLat = (point2.lat - point1.lat) * Math.PI / 180
    const dLng = (point2.lng - point1.lng) * Math.PI / 180
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(point1.lat * Math.PI / 180) * Math.cos(point2.lat * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    return Math.round(R * c)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(locale === 'vi' ? 'vi-VN' : 'en-US', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0
    }).format(amount)
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Route Input Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="h-5 w-5 text-blue-600" />
            <span>{t('vietnamMap.routeOptimization')}</span>
          </CardTitle>
          <CardDescription>
            {t('vietnamMap.findOptimalRoutes')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Location Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Departure Location */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin className="h-4 w-4 inline mr-1" />
                {t('vietnamMap.departure')}
              </label>
              <input
                type="text"
                value={departureQuery}
                onChange={(e) => setDepartureQuery(e.target.value)}
                placeholder={t('vietnamMap.selectDeparture')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {departureSuggestions.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {departureSuggestions.map((location) => (
                    <button
                      key={location.id}
                      onClick={() => {
                        setSelectedDeparture(location)
                        setDepartureQuery(location.ten)
                        setDepartureSuggestions([])
                      }}
                      className="w-full px-3 py-2 text-left hover:bg-blue-50 border-b border-gray-100 last:border-b-0"
                    >
                      <div className="font-medium">{location.ten}</div>
                      <div className="text-sm text-gray-500">{location.diaChi}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Destination Location */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <NavigationIcon className="h-4 w-4 inline mr-1" />
                {t('vietnamMap.destination')}
              </label>
              <input
                type="text"
                value={destinationQuery}
                onChange={(e) => setDestinationQuery(e.target.value)}
                placeholder={t('vietnamMap.selectDestination')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {destinationSuggestions.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {destinationSuggestions.map((location) => (
                    <button
                      key={location.id}
                      onClick={() => {
                        setSelectedDestination(location)
                        setDestinationQuery(location.ten)
                        setDestinationSuggestions([])
                      }}
                      className="w-full px-3 py-2 text-left hover:bg-blue-50 border-b border-gray-100 last:border-b-0"
                    >
                      <div className="font-medium">{location.ten}</div>
                      <div className="text-sm text-gray-500">{location.diaChi}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Quick Settings */}
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center space-x-2">
              <Container className="h-4 w-4 text-gray-500" />
              <select
                value={settings.containerType}
                onChange={(e) => setSettings(prev => ({ ...prev, containerType: e.target.value as any }))}
                className="px-3 py-1 border border-gray-300 rounded text-sm"
              >
                <option value="20ft">20ft Container</option>
                <option value="40ft">40ft Container</option>
                <option value="45ft">45ft Container</option>
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="avoidRushHour"
                checked={settings.avoidRushHour}
                onChange={(e) => setSettings(prev => ({ ...prev, avoidRushHour: e.target.checked }))}
                className="rounded"
              />
              <label htmlFor="avoidRushHour" className="text-sm text-gray-700">
                {t('vietnamMap.avoidRushHour')}
              </label>
            </div>

            <button
              onClick={() => setShowSettings(!showSettings)}
              className="flex items-center space-x-1 px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
            >
              <Settings className="h-4 w-4" />
              <span>Advanced</span>
            </button>
          </div>

          {/* Advanced Settings */}
          {showSettings && (
            <div className="border-t pt-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('vietnamMap.priority')}
                  </label>
                  <select
                    value={settings.priority}
                    onChange={(e) => setSettings(prev => ({ ...prev, priority: e.target.value as any }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="balanced">Balanced</option>
                    <option value="cost">Cost Optimized</option>
                    <option value="time">Time Optimized</option>
                    <option value="fuel">Fuel Optimized</option>
                  </select>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="avoidTolls"
                    checked={settings.avoidTolls}
                    onChange={(e) => setSettings(prev => ({ ...prev, avoidTolls: e.target.checked }))}
                    className="rounded"
                  />
                  <label htmlFor="avoidTolls" className="text-sm text-gray-700">
                    {t('vietnamMap.avoidTolls')}
                  </label>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="fuelEfficiency"
                    checked={settings.fuelEfficiencyMode}
                    onChange={(e) => setSettings(prev => ({ ...prev, fuelEfficiencyMode: e.target.checked }))}
                    className="rounded"
                  />
                  <label htmlFor="fuelEfficiency" className="text-sm text-gray-700">
                    Fuel Efficiency Mode
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleOptimizeRoute}
              disabled={isOptimizing || !selectedDeparture || !selectedDestination}
              className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isOptimizing ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <Play className="h-4 w-4" />
              )}
              <span>{isOptimizing ? t('vietnamMap.optimizing') : t('vietnamMap.optimizeRoute')}</span>
            </button>

            {learnedRoutes.length > 0 && (
              <button
                onClick={handleBulkOptimization}
                disabled={isOptimizing}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
              >
                <Layers className="h-4 w-4" />
                <span>Optimize All ({learnedRoutes.length})</span>
              </button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Optimization Results */}
      {optimizedRoutes.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-green-600" />
              <span>{t('vietnamMap.routeResults')}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {optimizedRoutes.map((route, index) => (
                <div key={route.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold text-sm">
                        {index + 1}
                      </div>
                      <div>
                        <h4 className="font-medium">
                          {route.originalRoute.noiDi} → {route.originalRoute.noiDen}
                        </h4>
                        <p className="text-sm text-gray-500">
                          {route.originalRoute.containerType} • {route.trafficConditions} traffic
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-gray-400 hover:text-blue-600">
                        <Download className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-green-600">
                        <Share2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="flex items-center justify-center space-x-1 text-blue-600 mb-1">
                        <Route className="h-4 w-4" />
                        <span className="text-sm font-medium">Distance</span>
                      </div>
                      <div className="text-lg font-semibold">{route.optimizedDistance} km</div>
                      <div className="text-xs text-green-600">
                        -{((route.originalRoute.quangDuong - route.optimizedDistance) / route.originalRoute.quangDuong * 100).toFixed(1)}%
                      </div>
                    </div>

                    <div className="text-center">
                      <div className="flex items-center justify-center space-x-1 text-purple-600 mb-1">
                        <Clock className="h-4 w-4" />
                        <span className="text-sm font-medium">Time</span>
                      </div>
                      <div className="text-lg font-semibold">{route.optimizedTime.toFixed(1)}h</div>
                      <div className="text-xs text-green-600">
                        -{((route.originalRoute.thoiGianVanChuyen - route.optimizedTime) / route.originalRoute.thoiGianVanChuyen * 100 || 10).toFixed(1)}%
                      </div>
                    </div>

                    <div className="text-center">
                      <div className="flex items-center justify-center space-x-1 text-green-600 mb-1">
                        <Fuel className="h-4 w-4" />
                        <span className="text-sm font-medium">Fuel Saved</span>
                      </div>
                      <div className="text-lg font-semibold">{formatCurrency(route.fuelSavings)}</div>
                      <div className="text-xs text-green-600">
                        {((route.fuelSavings / (route.originalRoute.chiPhiNhienLieu || 1000000)) * 100).toFixed(1)}%
                      </div>
                    </div>

                    <div className="text-center">
                      <div className="flex items-center justify-center space-x-1 text-orange-600 mb-1">
                        <DollarSign className="h-4 w-4" />
                        <span className="text-sm font-medium">Total Saved</span>
                      </div>
                      <div className="text-lg font-semibold">{formatCurrency(route.costSavings)}</div>
                      <div className="text-xs text-green-600">
                        {((route.costSavings / (route.originalRoute.chiPhiNhienLieu || 1000000)) * 100).toFixed(1)}%
                      </div>
                    </div>
                  </div>

                  {/* Container Restrictions */}
                  {route.containerRestrictions.length > 0 && (
                    <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <AlertTriangle className="h-4 w-4 text-yellow-600" />
                        <span className="text-sm font-medium text-yellow-800">Container Restrictions</span>
                      </div>
                      <ul className="text-xs text-yellow-700 space-y-1">
                        {route.containerRestrictions.map((restriction, idx) => (
                          <li key={idx}>• {restriction}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Recommended Depots */}
                  {route.recommendedDepots.length > 0 && (
                    <div className="mt-3">
                      <h5 className="text-sm font-medium text-gray-700 mb-2">Recommended Depots:</h5>
                      <div className="flex flex-wrap gap-2">
                        {route.recommendedDepots.slice(0, 3).map((depot) => (
                          <span
                            key={depot.id}
                            className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                          >
                            {depot.ten}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
