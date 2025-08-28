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
  const [activeView, setActiveView] = useState('dashboard')
  const [routes, setRoutes] = useState<FleetbaseRoute[]>([])
  const [selectedRoute, setSelectedRoute] = useState<any>(null)
  const [optimizing, setOptimizing] = useState(false)

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
                          <div className="p-4 bg-blue-50 rounded-xl">
                            <div className="flex items-center gap-2 mb-2">
                              <MapPin className="h-5 w-5 text-blue-600" />
                              <span className="font-semibold text-gray-700">{language === 'vi' ? 'Quãng đường' : 'Distance'}</span>
                            </div>
                            <p className="text-gray-800 font-bold text-lg">{route.distance} km</p>
                          </div>

                          <div className="p-4 bg-green-50 rounded-xl">
                            <div className="flex items-center gap-2 mb-2">
                              <Clock className="h-5 w-5 text-green-600" />
                              <span className="font-semibold text-gray-700">{language === 'vi' ? 'Thời gian' : 'Duration'}</span>
                            </div>
                            <p className="text-gray-800 font-bold text-lg">{Math.round(route.duration/60)}h {route.duration%60}m</p>
                          </div>

                          <div className="p-4 bg-purple-50 rounded-xl">
                            <div className="flex items-center gap-2 mb-2">
                              <DollarSign className="h-5 w-5 text-purple-600" />
                              <span className="font-semibold text-gray-700">{language === 'vi' ? 'Chi phí' : 'Cost'}</span>
                            </div>
                            <p className="text-gray-800 font-bold text-lg">{(route.cost/1000000).toFixed(1)}M ₫</p>
                          </div>

                          <div className="p-4 bg-orange-50 rounded-xl">
                            <div className="flex items-center gap-2 mb-2">
                              <Target className="h-5 w-5 text-orange-600" />
                              <span className="font-semibold text-gray-700">{language === 'vi' ? 'Hiệu quả' : 'Efficiency'}</span>
                            </div>
                            <p className="text-gray-800 font-bold text-lg">{route.efficiency}%</p>
                          </div>
                        </div>

                        <div className="flex gap-4 mt-4">
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
