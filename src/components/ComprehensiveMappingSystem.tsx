'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { 
  MapPin, 
  Navigation, 
  Truck, 
  GitBranch as Route, 
  Search,
  Target,
  Zap,
  BarChart3,
  Clock,
  DollarSign,
  Fuel,
  Leaf,
  Download,
  RefreshCw,
  Settings,
  TrendingUp,
  Globe,
  Activity
} from 'lucide-react'

interface LocationData {
  id: string
  name: string
  address: string
  lat: number
  lng: number
  type: 'depot' | 'customer' | 'pickup' | 'delivery' | 'warehouse' | 'port'
  status: 'active' | 'inactive'
  capacity?: number
  operatingHours?: string
  region?: string
}

interface RouteData {
  id: string
  name: string
  origin: LocationData
  destination: LocationData
  waypoints: LocationData[]
  distance: number
  duration: number
  cost: number
  efficiency: number
  status: 'active' | 'planned' | 'completed'
  fuelConsumption?: number
  co2Emissions?: number
}

interface MappingSystemProps {
  className?: string
}

const ComprehensiveMappingSystem: React.FC<MappingSystemProps> = ({ className }) => {
  const [activeTab, setActiveTab] = useState('overview')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(null)
  const [routes, setRoutes] = useState<RouteData[]>([])
  const [locations, setLocations] = useState<LocationData[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [mapCenter, setMapCenter] = useState({ lat: 10.8231, lng: 106.6297 }) // Ho Chi Minh City

  // Comprehensive Vietnamese locations database
  const vietnameseLocations: LocationData[] = [
    {
      id: 'depot-hcm-main',
      name: 'Depot Chính TP.HCM',
      address: 'Quận 7, TP. Hồ Chí Minh',
      lat: 10.7379,
      lng: 106.7017,
      type: 'depot',
      status: 'active',
      capacity: 50,
      operatingHours: '06:00 - 22:00',
      region: 'South'
    },
    {
      id: 'warehouse-binh-duong',
      name: 'Kho Bình Dương',
      address: 'Thủ Dầu Một, Bình Dương',
      lat: 10.9804,
      lng: 106.6519,
      type: 'warehouse',
      status: 'active',
      capacity: 100,
      operatingHours: '24/7',
      region: 'South'
    },
    {
      id: 'customer-dong-nai',
      name: 'Khách hàng Đồng Nai',
      address: 'Biên Hòa, Đồng Nai',
      lat: 10.9460,
      lng: 106.8420,
      type: 'customer',
      status: 'active',
      region: 'South'
    },
    {
      id: 'port-cat-lai',
      name: 'Cảng Cát Lái',
      address: 'Quận 2, TP. Hồ Chí Minh',
      lat: 10.8067,
      lng: 106.7784,
      type: 'port',
      status: 'active',
      operatingHours: '06:00 - 18:00',
      region: 'South'
    },
    {
      id: 'depot-can-tho',
      name: 'Depot Cần Thơ',
      address: 'Ninh Kiều, Cần Thơ',
      lat: 10.0452,
      lng: 105.7469,
      type: 'depot',
      status: 'active',
      capacity: 30,
      operatingHours: '06:00 - 20:00',
      region: 'Mekong Delta'
    },
    {
      id: 'warehouse-hanoi',
      name: 'Kho Hà Nội',
      address: 'Long Biên, Hà Nội',
      lat: 21.0285,
      lng: 105.8542,
      type: 'warehouse',
      status: 'active',
      capacity: 80,
      operatingHours: '24/7',
      region: 'North'
    },
    {
      id: 'port-hai-phong',
      name: 'Cảng Hải Phòng',
      address: 'Hải Phòng',
      lat: 20.8449,
      lng: 106.6881,
      type: 'port',
      status: 'active',
      operatingHours: '24/7',
      region: 'North'
    },
    {
      id: 'depot-da-nang',
      name: 'Depot Đà Nẵng',
      address: 'Hải Châu, Đà Nẵng',
      lat: 16.0544,
      lng: 108.2022,
      type: 'depot',
      status: 'active',
      capacity: 40,
      operatingHours: '06:00 - 20:00',
      region: 'Central'
    }
  ]

  useEffect(() => {
    setLocations(vietnameseLocations)
    generateSampleRoutes()
  }, [])

  const generateSampleRoutes = useCallback(() => {
    const sampleRoutes: RouteData[] = [
      {
        id: 'route-hcm-bd-dn',
        name: 'TP.HCM - Bình Dương - Đồng Nai',
        origin: vietnameseLocations[0],
        destination: vietnameseLocations[2],
        waypoints: [vietnameseLocations[1]],
        distance: 85.5,
        duration: 120,
        cost: 850000,
        efficiency: 92,
        status: 'active',
        fuelConsumption: 12.5,
        co2Emissions: 28.4
      },
      {
        id: 'route-cat-lai-hcm',
        name: 'Cảng Cát Lái - Depot TP.HCM',
        origin: vietnameseLocations[3],
        destination: vietnameseLocations[0],
        waypoints: [],
        distance: 25.3,
        duration: 45,
        cost: 320000,
        efficiency: 88,
        status: 'completed',
        fuelConsumption: 8.2,
        co2Emissions: 18.6
      },
      {
        id: 'route-hcm-can-tho',
        name: 'TP.HCM - Cần Thơ',
        origin: vietnameseLocations[0],
        destination: vietnameseLocations[4],
        waypoints: [],
        distance: 169.2,
        duration: 180,
        cost: 1200000,
        efficiency: 85,
        status: 'planned',
        fuelConsumption: 22.8,
        co2Emissions: 51.7
      },
      {
        id: 'route-hanoi-hai-phong',
        name: 'Hà Nội - Hải Phòng',
        origin: vietnameseLocations[5],
        destination: vietnameseLocations[6],
        waypoints: [],
        distance: 102.5,
        duration: 135,
        cost: 750000,
        efficiency: 89,
        status: 'active',
        fuelConsumption: 15.8,
        co2Emissions: 35.9
      }
    ]
    setRoutes(sampleRoutes)
  }, [])

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl">
              <Globe className="h-6 w-6 text-white" />
            </div>
            LogiAI Comprehensive Mapping System
          </h2>
          <p className="text-gray-600 mt-2">
            Advanced Vietnamese logistics mapping with AI-powered route optimization
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={() => setIsLoading(true)}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Data
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-700">Total Locations</p>
                <p className="text-2xl font-bold text-blue-900">{locations.length}</p>
                <p className="text-xs text-blue-600 mt-1">Across Vietnam</p>
              </div>
              <MapPin className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-700">Active Routes</p>
                <p className="text-2xl font-bold text-green-900">
                  {routes.filter(r => r.status === 'active').length}
                </p>
                <p className="text-xs text-green-600 mt-1">Real-time tracking</p>
              </div>
              <Route className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-700">Total Distance</p>
                <p className="text-2xl font-bold text-purple-900">
                  {routes.reduce((sum, route) => sum + route.distance, 0).toFixed(1)} km
                </p>
                <p className="text-xs text-purple-600 mt-1">Optimized routes</p>
              </div>
              <Navigation className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-700">Avg Efficiency</p>
                <p className="text-2xl font-bold text-orange-900">
                  {routes.length > 0 ? (routes.reduce((sum, route) => sum + route.efficiency, 0) / routes.length).toFixed(0) : 0}%
                </p>
                <p className="text-xs text-orange-600 mt-1">AI optimized</p>
              </div>
              <TrendingUp className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 bg-gray-100 p-1 rounded-xl">
          <TabsTrigger value="overview" className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">
            <BarChart3 className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="route-optimizer" className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">
            <Zap className="h-4 w-4" />
            Route Optimizer
          </TabsTrigger>
          <TabsTrigger value="fleet-tracking" className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">
            <Truck className="h-4 w-4" />
            Fleet Tracking
          </TabsTrigger>
          <TabsTrigger value="depot-network" className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">
            <Target className="h-4 w-4" />
            Depot Network
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">
            <Activity className="h-4 w-4" />
            Analytics
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Location Search & Management */}
            <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-gray-50">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Search className="h-5 w-5 text-blue-600" />
                  Vietnamese Location Management
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Tìm kiếm địa điểm Việt Nam..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 border-gray-200 focus:border-blue-500"
                  />
                  <Button variant="outline" size="sm" className="px-3">
                    <Search className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {locations
                    .filter(location => 
                      location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      location.address.toLowerCase().includes(searchQuery.toLowerCase())
                    )
                    .map((location) => (
                    <div
                      key={location.id}
                      className="p-3 border border-gray-200 rounded-lg hover:bg-blue-50 cursor-pointer transition-colors"
                      onClick={() => setSelectedLocation(location)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900">{location.name}</h4>
                          <p className="text-sm text-gray-600">{location.address}</p>
                          {location.region && (
                            <p className="text-xs text-blue-600 mt-1">📍 {location.region}</p>
                          )}
                        </div>
                        <Badge 
                          className={`${
                            location.type === 'depot' ? 'bg-blue-100 text-blue-800' :
                            location.type === 'warehouse' ? 'bg-green-100 text-green-800' :
                            location.type === 'customer' ? 'bg-purple-100 text-purple-800' :
                            location.type === 'port' ? 'bg-orange-100 text-orange-800' :
                            'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {location.type}
                        </Badge>
                      </div>
                      {location.operatingHours && (
                        <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {location.operatingHours}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Route Overview */}
            <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-gray-50">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Route className="h-5 w-5 text-green-600" />
                  Active Route Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {routes.map((route) => (
                    <div key={route.id} className="p-4 border border-gray-200 rounded-lg bg-white">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium text-gray-900">{route.name}</h4>
                        <Badge 
                          className={`${
                            route.status === 'active' ? 'bg-green-100 text-green-800' :
                            route.status === 'planned' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {route.status}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="flex items-center gap-2">
                          <Navigation className="h-3 w-3 text-gray-400" />
                          <span>{route.distance} km</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-3 w-3 text-gray-400" />
                          <span>{route.duration} min</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-3 w-3 text-gray-400" />
                          <span>{route.cost.toLocaleString('vi-VN')} ₫</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <TrendingUp className="h-3 w-3 text-gray-400" />
                          <span>{route.efficiency}% efficiency</span>
                        </div>
                        {route.fuelConsumption && (
                          <div className="flex items-center gap-2">
                            <Fuel className="h-3 w-3 text-gray-400" />
                            <span>{route.fuelConsumption}L</span>
                          </div>
                        )}
                        {route.co2Emissions && (
                          <div className="flex items-center gap-2">
                            <Leaf className="h-3 w-3 text-gray-400" />
                            <span>{route.co2Emissions}kg CO₂</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Route Optimizer Tab */}
        <TabsContent value="route-optimizer" className="space-y-6">
          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-yellow-600" />
                AI-Powered Route Optimization
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Advanced Route Optimizer</h3>
                <p className="text-gray-600 mb-6">
                  AI-powered optimization with Vietnamese traffic patterns and logistics constraints
                </p>
                <Button className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600">
                  Launch Route Optimizer
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Fleet Tracking Tab */}
        <TabsContent value="fleet-tracking" className="space-y-6">
          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5 text-blue-600" />
                Real-time Fleet Tracking
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Truck className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Fleet Management System</h3>
                <p className="text-gray-600 mb-6">
                  Real-time tracking and monitoring of your Vietnamese logistics fleet
                </p>
                <Button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600">
                  View Fleet Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Depot Network Tab */}
        <TabsContent value="depot-network" className="space-y-6">
          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-green-600" />
                Vietnamese Depot Network
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-blue-900">Northern Region</h4>
                  <p className="text-2xl font-bold text-blue-600">2</p>
                  <p className="text-sm text-blue-700">Hà Nội, Hải Phòng</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <h4 className="font-semibold text-green-900">Central Region</h4>
                  <p className="text-2xl font-bold text-green-600">1</p>
                  <p className="text-sm text-green-700">Đà Nẵng</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <h4 className="font-semibold text-purple-900">Southern Region</h4>
                  <p className="text-2xl font-bold text-purple-600">5</p>
                  <p className="text-sm text-purple-700">TP.HCM, Bình Dương, Đồng Nai, Cần Thơ</p>
                </div>
              </div>
              
              <div className="text-center">
                <Button className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600">
                  Manage Depot Network
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-purple-600" />
                Advanced Analytics & Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Activity className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Logistics Intelligence</h3>
                <p className="text-gray-600 mb-6">
                  Advanced analytics and AI insights for Vietnamese logistics optimization
                </p>
                <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                  View Analytics Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Selected Location Details */}
      {selectedLocation && (
        <Card className="shadow-lg border-0 bg-gradient-to-r from-blue-50 to-purple-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-blue-600" />
              Selected Location: {selectedLocation.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-600">Address</p>
                <p className="text-gray-900">{selectedLocation.address}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Type</p>
                <Badge className={`${
                  selectedLocation.type === 'depot' ? 'bg-blue-100 text-blue-800' :
                  selectedLocation.type === 'warehouse' ? 'bg-green-100 text-green-800' :
                  selectedLocation.type === 'customer' ? 'bg-purple-100 text-purple-800' :
                  selectedLocation.type === 'port' ? 'bg-orange-100 text-orange-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {selectedLocation.type}
                </Badge>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Status</p>
                <Badge variant={selectedLocation.status === 'active' ? 'default' : 'secondary'}>
                  {selectedLocation.status}
                </Badge>
              </div>
              {selectedLocation.capacity && (
                <div>
                  <p className="text-sm font-medium text-gray-600">Capacity</p>
                  <p className="text-gray-900">{selectedLocation.capacity} vehicles</p>
                </div>
              )}
              {selectedLocation.operatingHours && (
                <div>
                  <p className="text-sm font-medium text-gray-600">Operating Hours</p>
                  <p className="text-gray-900">{selectedLocation.operatingHours}</p>
                </div>
              )}
              <div>
                <p className="text-sm font-medium text-gray-600">Coordinates</p>
                <p className="text-gray-900">
                  {selectedLocation.lat.toFixed(4)}, {selectedLocation.lng.toFixed(4)}
                </p>
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                View on Map
              </Button>
              <Button size="sm" variant="outline">
                Create Route
              </Button>
              <Button size="sm" variant="outline" onClick={() => setSelectedLocation(null)}>
                Close
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default ComprehensiveMappingSystem
