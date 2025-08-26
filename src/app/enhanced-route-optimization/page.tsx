'use client'

import React, { Suspense, useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { MapPin, Navigation, Zap, Globe, Truck, Clock, DollarSign } from 'lucide-react'
import dynamic from 'next/dynamic'

// Dynamic import for Leaflet to avoid SSR issues
const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false })
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false })
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false })
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false })
const Polyline = dynamic(() => import('react-leaflet').then(mod => mod.Polyline), { ssr: false })

interface RouteOptimizationPageProps {
  onRouteOptimized?: (route: any) => void
  onError?: (error: string) => void
}

export default function EnhancedRouteOptimizationPage({ 
  onRouteOptimized, 
  onError 
}: RouteOptimizationPageProps) {
  const [selectedRoute, setSelectedRoute] = useState('cat-lai-chim-en')
  const [mapReady, setMapReady] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    setMapReady(true)
  }, [])

  const routes = {
    'cat-lai-chim-en': {
      name: 'Cát Lái → Chim Én',
      origin: 'Cảng Cát Lái',
      destination: 'Chim Én',
      distance: '25 km',
      time: '1.25h',
      cost: '450,000 VND',
      fuel: '18L',
      color: '#22c55e',
      coordinates: {
        origin: [10.7769, 106.7009],
        destination: [10.7829, 106.6919],
        waypoints: [
          [10.7789, 106.6989],
          [10.7809, 106.6969],
          [10.7819, 106.6949]
        ]
      },
      waypoints: ['Đồng Văn Cống', 'Võ Chí Công', 'Nguyễn Văn Linh'],
      traffic: 'Moderate',
      efficiency: 92
    },
    'vung-tau-long-an': {
      name: 'Vũng Tàu → Long An',
      origin: 'Cảng Vũng Tàu',
      destination: 'Long An',
      distance: '120 km',
      time: '3.0h',
      cost: '1,200,000 VND',
      fuel: '85L',
      color: '#3b82f6',
      coordinates: {
        origin: [10.3460, 107.0843],
        destination: [10.6956, 106.2431],
        waypoints: [
          [10.4200, 106.8500],
          [10.5500, 106.5000]
        ]
      },
      waypoints: ['QL51', 'QL1A'],
      traffic: 'Heavy',
      efficiency: 78
    },
    'chim-en-cp-tien-giang': {
      name: 'Chim Én → CP Tiền Giang',
      origin: 'Chim Én',
      destination: 'CP Tiền Giang',
      distance: '85 km',
      time: '2.5h',
      cost: '850,000 VND',
      fuel: '62L',
      color: '#f59e0b',
      coordinates: {
        origin: [10.7829, 106.6919],
        destination: [10.3500, 106.3600],
        waypoints: [
          [10.6500, 106.5500],
          [10.5000, 106.4500]
        ]
      },
      waypoints: ['QL50', 'QL57'],
      traffic: 'Light',
      efficiency: 88
    },
    'chim-en-rico-hau-giang': {
      name: 'Chim Én → Rico Hậu Giang',
      origin: 'Chim Én',
      destination: 'Rico Hậu Giang',
      distance: '180 km',
      time: '5.0h',
      cost: '1,800,000 VND',
      fuel: '125L',
      color: '#ef4444',
      coordinates: {
        origin: [10.7829, 106.6919],
        destination: [9.7570, 105.6420],
        waypoints: [
          [10.5000, 106.4000],
          [10.0000, 106.0000]
        ]
      },
      waypoints: ['QL1A', 'QL80'],
      traffic: 'Moderate',
      efficiency: 85
    }
  }

  const currentRoute = routes[selectedRoute as keyof typeof routes]

  // Create polyline path
  const getPolylinePath = () => {
    const path = [
      currentRoute.coordinates.origin,
      ...currentRoute.coordinates.waypoints,
      currentRoute.coordinates.destination
    ]
    return path
  }

  const handleOptimizeRoute = () => {
    if (onRouteOptimized) {
      onRouteOptimized({
        route: currentRoute,
        optimizationScore: currentRoute.efficiency,
        estimatedSavings: '15%'
      })
    }
  }

  const handleError = (errorMessage: string) => {
    if (onError) {
      onError(errorMessage)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
            <Navigation className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Enhanced Route Optimization
          </h1>
        </div>
        <p className="text-xl text-slate-400 max-w-3xl mx-auto">
          Advanced AI-powered route optimization with real-time interactive mapping for Vietnamese logistics operations
        </p>
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            icon: <MapPin className="w-6 h-6" />,
            title: "Interactive Mapping",
            description: "Real-time Leaflet maps with GPS coordinates",
            color: "from-green-500 to-emerald-500"
          },
          {
            icon: <Navigation className="w-6 h-6" />,
            title: "Route Intelligence",
            description: "AI-powered route optimization algorithms",
            color: "from-blue-500 to-cyan-500"
          },
          {
            icon: <Globe className="w-6 h-6" />,
            title: "Vietnam Coverage",
            description: "Comprehensive Vietnamese logistics network",
            color: "from-purple-500 to-pink-500"
          },
          {
            icon: <Zap className="w-6 h-6" />,
            title: "Real-time Updates",
            description: "Live traffic and route condition monitoring",
            color: "from-orange-500 to-red-500"
          }
        ].map((feature, index) => (
          <Card key={index} className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50 hover:border-slate-600/50 transition-all duration-300">
            <CardContent className="p-6">
              <div className={`w-12 h-12 bg-gradient-to-r ${feature.color} rounded-lg flex items-center justify-center mb-4`}>
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-slate-400 text-sm">{feature.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-slate-800/50 backdrop-blur-sm">
          <TabsTrigger value="overview" className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400">
            Overview
          </TabsTrigger>
          <TabsTrigger value="interactive-map" className="data-[state=active]:bg-green-500/20 data-[state=active]:text-green-400">
            Interactive Map
          </TabsTrigger>
          <TabsTrigger value="analytics" className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-400">
            Analytics
          </TabsTrigger>
          <TabsTrigger value="optimization" className="data-[state=active]:bg-orange-500/20 data-[state=active]:text-orange-400">
            Optimization
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Route Selection */}
            <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-green-400">
                  <Truck className="w-5 h-5" />
                  <span>Route Selection</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(routes).map(([key, route]) => (
                  <Button
                    key={key}
                    variant={selectedRoute === key ? "default" : "outline"}
                    className={`w-full justify-start text-left h-auto p-4 ${
                      selectedRoute === key 
                        ? `bg-gradient-to-r from-${route.color.slice(1)}/20 to-${route.color.slice(1)}/10 border-${route.color.slice(1)}/50` 
                        : 'bg-slate-700/30 border-slate-600/50 hover:bg-slate-600/30'
                    }`}
                    onClick={() => setSelectedRoute(key)}
                  >
                    <div className="space-y-1">
                      <div className="font-semibold">{route.name}</div>
                      <div className="text-sm opacity-70">
                        {route.distance} • {route.time} • {route.cost}
                      </div>
                    </div>
                  </Button>
                ))}
              </CardContent>
            </Card>

            {/* Route Details */}
            <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-blue-400">
                  <MapPin className="w-5 h-5" />
                  <span>Route Details</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Origin:</span>
                    <span className="text-green-400">{currentRoute.origin}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Destination:</span>
                    <span className="text-red-400">{currentRoute.destination}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Distance:</span>
                    <span className="text-white">{currentRoute.distance}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Time:</span>
                    <span className="text-white">{currentRoute.time}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Cost:</span>
                    <span className="text-white">{currentRoute.cost}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Fuel:</span>
                    <span className="text-white">{currentRoute.fuel}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Traffic:</span>
                    <Badge variant={currentRoute.traffic === 'Light' ? 'default' : currentRoute.traffic === 'Moderate' ? 'secondary' : 'destructive'}>
                      {currentRoute.traffic}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Performance Metrics */}
            <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-purple-400">
                  <Zap className="w-5 h-5" />
                  <span>Performance</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Efficiency</span>
                      <span className="text-white">{currentRoute.efficiency}%</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${currentRoute.efficiency}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 pt-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-400">15%</div>
                      <div className="text-xs text-slate-400">Cost Savings</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-400">{currentRoute.waypoints.length}</div>
                      <div className="text-xs text-slate-400">Waypoints</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Interactive Map Tab */}
        <TabsContent value="interactive-map" className="space-y-6">
          <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-green-400">
                <Globe className="w-5 h-5" />
                <span>Real-time Interactive Map - {currentRoute.name}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="h-[600px] rounded-b-lg overflow-hidden">
                {mapReady ? (
                  <MapContainer
                    center={currentRoute.coordinates.origin as [number, number]}
                    zoom={11}
                    style={{ height: '100%', width: '100%' }}
                    zoomControl={true}
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    
                    {/* Origin Marker */}
                    <Marker position={currentRoute.coordinates.origin as [number, number]}>
                      <Popup>
                        <div style={{ color: '#000', fontWeight: 'bold' }}>
                          🟢 {currentRoute.origin}
                          <br />
                          <small>Điểm xuất phát</small>
                        </div>
                      </Popup>
                    </Marker>

                    {/* Waypoint Markers */}
                    {currentRoute.coordinates.waypoints.map((waypoint, index) => (
                      <Marker key={index} position={waypoint as [number, number]}>
                        <Popup>
                          <div style={{ color: '#000', fontWeight: 'bold' }}>
                            🔵 {currentRoute.waypoints[index]}
                            <br />
                            <small>Điểm trung gian {index + 1}</small>
                          </div>
                        </Popup>
                      </Marker>
                    ))}

                    {/* Destination Marker */}
                    <Marker position={currentRoute.coordinates.destination as [number, number]}>
                      <Popup>
                        <div style={{ color: '#000', fontWeight: 'bold' }}>
                          🔴 {currentRoute.destination}
                          <br />
                          <small>Điểm đến</small>
                        </div>
                      </Popup>
                    </Marker>

                    {/* Route Polyline */}
                    <Polyline
                      positions={getPolylinePath() as [number, number][]}
                      color={currentRoute.color}
                      weight={4}
                      opacity={0.8}
                    />
                  </MapContainer>
                ) : (
                  <div className="h-full flex items-center justify-center bg-slate-900/50">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-400 mx-auto mb-4"></div>
                      <p className="text-slate-400">Loading interactive map...</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: <Clock className="w-6 h-6" />, label: 'Time', value: currentRoute.time, color: 'text-blue-400' },
              { icon: <MapPin className="w-6 h-6" />, label: 'Distance', value: currentRoute.distance, color: 'text-green-400' },
              { icon: <DollarSign className="w-6 h-6" />, label: 'Cost', value: currentRoute.cost, color: 'text-yellow-400' },
              { icon: <Truck className="w-6 h-6" />, label: 'Fuel', value: currentRoute.fuel, color: 'text-red-400' }
            ].map((stat, index) => (
              <Card key={index} className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50">
                <CardContent className="p-6 text-center">
                  <div className={`${stat.color} mb-2`}>{stat.icon}</div>
                  <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-sm text-slate-400">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Optimization Tab */}
        <TabsContent value="optimization" className="space-y-6">
          <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-orange-400">
                <Zap className="w-5 h-5" />
                <span>Route Optimization</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <Button 
                  onClick={handleOptimizeRoute}
                  className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-3 text-lg"
                >
                  <Zap className="w-5 h-5 mr-2" />
                  Optimize Current Route
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-400 mb-2">{currentRoute.efficiency}%</div>
                  <div className="text-slate-400">Current Efficiency</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-400 mb-2">15%</div>
                  <div className="text-slate-400">Potential Savings</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-400 mb-2">A+</div>
                  <div className="text-slate-400">Optimization Grade</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
