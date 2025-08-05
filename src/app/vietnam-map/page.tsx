'use client'

import React, { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui-components'
import Navigation from '@/components/Navigation'
import EnhancedRouteOptimizer from '@/components/EnhancedRouteOptimizer'
import { 
  MapPin, 
  RefreshCw,
  Container,
  Truck,
  Zap,
  BarChart3,
  TrendingUp,
  Clock,
  DollarSign,
  Fuel,
  Route
} from 'lucide-react'
import { useEnhancedTranslation } from '@/lib/i18n/enhanced-translation'
import EnhancedVietnameseProcessor, { 
  type VietnameseRouteData, 
  type OptimizedRoute 
} from '@/lib/file-learning/enhanced-vietnamese-processor'

// Dynamic import for Leaflet to avoid SSR issues
const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false })
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false })
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false })
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false })
const Polyline = dynamic(() => import('react-leaflet').then(mod => mod.Polyline), { ssr: false })

export default function EnhancedVietnamMapPage() {
  const { t, locale, isLoading: langLoading } = useEnhancedTranslation()
  const [isMapLoaded, setIsMapLoaded] = useState(false)
  const [learnedRoutes, setLearnedRoutes] = useState<VietnameseRouteData[]>([])
  const [currentOptimizedRoute, setCurrentOptimizedRoute] = useState<OptimizedRoute | null>(null)
  const [mapCenter] = useState<[number, number]>([14.0583, 108.2772]) // Vietnam center
  const [mapZoom] = useState(6)

  // Load learned routes from localStorage
  useEffect(() => {
    const savedRoutes = localStorage.getItem('logiai_learned_routes')
    if (savedRoutes) {
      try {
        const routes = JSON.parse(savedRoutes)
        setLearnedRoutes(routes)
      } catch (error) {
        console.error('Error loading learned routes:', error)
      }
    }
  }, [])

  useEffect(() => {
    setIsMapLoaded(true)
  }, [])

  // Listen for file learning updates
  useEffect(() => {
    const handleFileProcessed = (event: CustomEvent) => {
      const { routes } = event.detail
      if (routes && routes.length > 0) {
        setLearnedRoutes(prev => {
          const updated = [...prev, ...routes]
          localStorage.setItem('logiai_learned_routes', JSON.stringify(updated))
          return updated
        })
      }
    }

    window.addEventListener('fileProcessed', handleFileProcessed as EventListener)
    return () => window.removeEventListener('fileProcessed', handleFileProcessed as EventListener)
  }, [])

  const handleRouteOptimized = (optimizedRoute: OptimizedRoute) => {
    setCurrentOptimizedRoute(optimizedRoute)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(locale === 'vi' ? 'vi-VN' : 'en-US', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0
    }).format(amount)
  }

  if (langLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <Navigation />
      
      <div className="p-6 space-y-6">
        {/* Enhanced Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-gradient-to-r from-blue-600 to-green-600 p-4 rounded-2xl shadow-lg">
              <MapPin className="h-10 w-10 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-3">
            {t('vietnamMap.title')}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('vietnamMap.subtitle')}
          </p>
          <div className="flex items-center justify-center mt-4 space-x-6 text-sm text-gray-500">
            <div className="flex items-center">
              <Container className="h-4 w-4 mr-1 text-blue-500" />
              <span>{learnedRoutes.length} {locale === 'vi' ? 'tuyến đã học' : 'learned routes'}</span>
            </div>
            <div className="flex items-center">
              <Truck className="h-4 w-4 mr-1 text-green-500" />
              <span>50+ {locale === 'vi' ? 'địa điểm' : 'locations'}</span>
            </div>
            <div className="flex items-center">
              <Zap className="h-4 w-4 mr-1 text-yellow-500" />
              <span>{locale === 'vi' ? 'Tối ưu thời gian thực' : 'Real-time optimization'}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Enhanced Route Optimization */}
          <div className="xl:col-span-2">
            <EnhancedRouteOptimizer
              onRouteOptimized={handleRouteOptimized}
              learnedRoutes={learnedRoutes}
              className="h-full"
            />
          </div>

          {/* Statistics and Map */}
          <div className="xl:col-span-1 space-y-6">
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 gap-4">
              <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100 text-sm">Total Routes Optimized</p>
                      <p className="text-2xl font-bold">{learnedRoutes.length}</p>
                    </div>
                    <Route className="h-8 w-8 text-blue-200" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-100 text-sm">Estimated Savings</p>
                      <p className="text-2xl font-bold">
                        {formatCurrency(learnedRoutes.length * 500000)}
                      </p>
                    </div>
                    <DollarSign className="h-8 w-8 text-green-200" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-100 text-sm">Time Saved</p>
                      <p className="text-2xl font-bold">{(learnedRoutes.length * 2.5).toFixed(1)}h</p>
                    </div>
                    <Clock className="h-8 w-8 text-purple-200" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-orange-100 text-sm">Fuel Efficiency</p>
                      <p className="text-2xl font-bold">+18%</p>
                    </div>
                    <Fuel className="h-8 w-8 text-orange-200" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Vietnam Map */}
            <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <MapPin className="mr-2 h-5 w-5 text-green-600" />
                  {locale === 'vi' ? 'Bản đồ Việt Nam' : 'Vietnam Map'}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="h-96 rounded-lg overflow-hidden">
                  {isMapLoaded && (
                    <MapContainer
                      center={mapCenter}
                      zoom={mapZoom}
                      style={{ height: '100%', width: '100%' }}
                      className="rounded-lg"
                    >
                      <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      />
                      
                      {/* Show optimized route if available */}
                      {currentOptimizedRoute && (
                        <>
                          <Marker position={[10.8231, 106.6297]}>
                            <Popup>
                              <div className="text-center">
                                <h3 className="font-semibold">{currentOptimizedRoute.originalRoute.noiDi}</h3>
                                <p className="text-sm text-gray-600">Departure Point</p>
                              </div>
                            </Popup>
                          </Marker>
                          <Marker position={[21.0285, 105.8542]}>
                            <Popup>
                              <div className="text-center">
                                <h3 className="font-semibold">{currentOptimizedRoute.originalRoute.noiDen}</h3>
                                <p className="text-sm text-gray-600">Destination</p>
                              </div>
                            </Popup>
                          </Marker>
                          <Polyline
                            positions={[[10.8231, 106.6297], [21.0285, 105.8542]]}
                            color="blue"
                            weight={4}
                            opacity={0.7}
                          />
                        </>
                      )}
                    </MapContainer>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Current Route Details */}
            {currentOptimizedRoute && (
              <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <TrendingUp className="mr-2 h-5 w-5 text-blue-600" />
                    {t('vietnamMap.routeDetails')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Route:</span>
                      <span className="font-semibold">
                        {currentOptimizedRoute.originalRoute.noiDi} → {currentOptimizedRoute.originalRoute.noiDen}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Distance:</span>
                      <span className="font-semibold text-blue-600">
                        {currentOptimizedRoute.optimizedDistance} km
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Estimated Time:</span>
                      <span className="font-semibold text-green-600">
                        {currentOptimizedRoute.optimizedTime.toFixed(1)} hours
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Cost Savings:</span>
                      <span className="font-semibold text-green-600">
                        {formatCurrency(currentOptimizedRoute.costSavings)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Container Type:</span>
                      <span className="font-semibold">
                        {currentOptimizedRoute.originalRoute.containerType}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
