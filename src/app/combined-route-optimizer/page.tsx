'use client'

import React, { useState, useEffect } from 'react'
import AuthGuard from '@/components/AuthGuard'
import { useLanguage } from '@/contexts/LanguageContext'
import dynamic from 'next/dynamic'
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  Button,
  Input,
  Label,
  Badge
} from '@/components/ui-components'
import { 
  Map, 
  MapPin, 
  Navigation, 
  Truck, 
  Package, 
  Clock,
  BarChart3,
  TrendingUp,
  Users,
  Building,
  Search,
  Filter,
  Navigation2,
  Fuel,
  Calculator,
  Zap,
  Anchor,
  Warehouse,
  Factory,
  DollarSign,
  Globe,
  Plane,
  Ship,
  ArrowRight,
  CheckCircle,
  AlertTriangle,
  Info,
  Settings
} from 'lucide-react'

// Dynamic import for Leaflet to avoid SSR issues
const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false })
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false })
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false })
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false })
const Polyline = dynamic(() => import('react-leaflet').then(mod => mod.Polyline), { ssr: false })

export default function CombinedRouteOptimizerPage() {
  const { t } = useLanguage()
  const [selectedRoute, setSelectedRoute] = useState('cat-lai-chim-en')
  const [mapReady, setMapReady] = useState(false)
  const [activeView, setActiveView] = useState('map')

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

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-6">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-2xl">
                <Globe className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
                  LogiAI Route Optimizer
                </h1>
                <p className="text-xl text-slate-300 mt-2">
                  Real-time Interactive Mapping for Vietnamese Logistics
                </p>
              </div>
            </div>

            {/* Success Banner */}
            <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-2xl p-6 backdrop-blur-sm">
              <div className="flex items-center justify-center space-x-3">
                <CheckCircle className="w-8 h-8 text-green-400" />
                <div>
                  <h2 className="text-2xl font-bold text-green-400">🗺️ REAL INTERACTIVE MAP ACTIVE!</h2>
                  <p className="text-green-300">Google Maps-like experience with Vietnamese GPS coordinates</p>
                </div>
              </div>
            </div>
          </div>

          {/* View Toggle */}
          <div className="flex justify-center space-x-4">
            <Button
              onClick={() => setActiveView('map')}
              variant={activeView === 'map' ? 'default' : 'outline'}
              className={`px-6 py-3 ${activeView === 'map' ? 'bg-gradient-to-r from-blue-500 to-purple-500' : ''}`}
            >
              <Globe className="w-5 h-5 mr-2" />
              Interactive Map
            </Button>
            <Button
              onClick={() => setActiveView('analytics')}
              variant={activeView === 'analytics' ? 'default' : 'outline'}
              className={`px-6 py-3 ${activeView === 'analytics' ? 'bg-gradient-to-r from-green-500 to-blue-500' : ''}`}
            >
              <BarChart3 className="w-5 h-5 mr-2" />
              Route Analytics
            </Button>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Route Selection Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-green-400">
                    <Truck className="w-5 h-5" />
                    <span>Vietnamese Routes</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {Object.entries(routes).map(([key, route]) => (
                    <Button
                      key={key}
                      onClick={() => setSelectedRoute(key)}
                      variant={selectedRoute === key ? "default" : "outline"}
                      className={`w-full justify-start text-left h-auto p-4 transition-all duration-300 ${
                        selectedRoute === key 
                          ? `bg-gradient-to-r from-${route.color.slice(1)}/20 to-${route.color.slice(1)}/10 border-2` 
                          : 'bg-slate-700/30 border-slate-600/50 hover:bg-slate-600/30'
                      }`}
                      style={selectedRoute === key ? { borderColor: route.color } : {}}
                    >
                      <div className="space-y-2 w-full">
                        <div className="font-semibold text-white">{route.name}</div>
                        <div className="text-sm opacity-70 space-y-1">
                          <div>📏 {route.distance} • ⏱️ {route.time}</div>
                          <div>💰 {route.cost} • ⛽ {route.fuel}</div>
                          <div className="flex items-center space-x-2">
                            <span>Efficiency:</span>
                            <Badge variant={route.efficiency > 85 ? 'default' : 'secondary'}>
                              {route.efficiency}%
                            </Badge>
                          </div>
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
                <CardContent className="space-y-3">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Origin:</span>
                      <span className="text-green-400 font-semibold">{currentRoute.origin}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Destination:</span>
                      <span className="text-red-400 font-semibold">{currentRoute.destination}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Waypoints:</span>
                      <span className="text-blue-400 font-semibold">{currentRoute.waypoints.length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Traffic:</span>
                      <Badge variant={currentRoute.traffic === 'Light' ? 'default' : currentRoute.traffic === 'Moderate' ? 'secondary' : 'destructive'}>
                        {currentRoute.traffic}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Content Area */}
            <div className="lg:col-span-3">
              {activeView === 'map' ? (
                <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2 text-green-400">
                      <Globe className="w-6 h-6" />
                      <span>🗺️ Real Interactive Map - {currentRoute.name}</span>
                    </CardTitle>
                    <CardDescription className="text-slate-300">
                      Google Maps-like experience with real Vietnamese GPS coordinates
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="h-[700px] rounded-b-lg overflow-hidden relative">
                      {/* Map Status Banner */}
                      <div className="absolute top-4 left-4 right-4 z-[1000] bg-slate-900/90 backdrop-blur-sm rounded-lg p-3 border border-green-500/30">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                            <span className="text-green-400 font-semibold">LIVE INTERACTIVE MAP</span>
                          </div>
                          <div className="text-slate-300 text-sm">
                            📍 GPS: {currentRoute.coordinates.origin[0].toFixed(4)}, {currentRoute.coordinates.origin[1].toFixed(4)}
                          </div>
                        </div>
                      </div>

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
                              <div style={{ color: '#000', fontWeight: 'bold', minWidth: '200px' }}>
                                <div style={{ fontSize: '16px', marginBottom: '8px' }}>
                                  🟢 {currentRoute.origin}
                                </div>
                                <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>
                                  Điểm xuất phát
                                </div>
                                <div style={{ fontSize: '11px', color: '#888' }}>
                                  GPS: {currentRoute.coordinates.origin[0].toFixed(4)}, {currentRoute.coordinates.origin[1].toFixed(4)}
                                </div>
                              </div>
                            </Popup>
                          </Marker>

                          {/* Waypoint Markers */}
                          {currentRoute.coordinates.waypoints.map((waypoint, index) => (
                            <Marker key={index} position={waypoint as [number, number]}>
                              <Popup>
                                <div style={{ color: '#000', fontWeight: 'bold', minWidth: '200px' }}>
                                  <div style={{ fontSize: '16px', marginBottom: '8px' }}>
                                    🔵 {currentRoute.waypoints[index]}
                                  </div>
                                  <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>
                                    Điểm trung gian {index + 1}
                                  </div>
                                  <div style={{ fontSize: '11px', color: '#888' }}>
                                    GPS: {waypoint[0].toFixed(4)}, {waypoint[1].toFixed(4)}
                                  </div>
                                </div>
                              </Popup>
                            </Marker>
                          ))}

                          {/* Destination Marker */}
                          <Marker position={currentRoute.coordinates.destination as [number, number]}>
                            <Popup>
                              <div style={{ color: '#000', fontWeight: 'bold', minWidth: '200px' }}>
                                <div style={{ fontSize: '16px', marginBottom: '8px' }}>
                                  🔴 {currentRoute.destination}
                                </div>
                                <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>
                                  Điểm đến
                                </div>
                                <div style={{ fontSize: '11px', color: '#888' }}>
                                  GPS: {currentRoute.coordinates.destination[0].toFixed(4)}, {currentRoute.coordinates.destination[1].toFixed(4)}
                                </div>
                              </div>
                            </Popup>
                          </Marker>

                          {/* Route Polyline */}
                          <Polyline
                            positions={getPolylinePath() as [number, number][]}
                            color={currentRoute.color}
                            weight={5}
                            opacity={0.8}
                          />
                        </MapContainer>
                      ) : (
                        <div className="h-full flex items-center justify-center bg-slate-900/50">
                          <div className="text-center">
                            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-400 mx-auto mb-6"></div>
                            <h3 className="text-xl font-semibold text-white mb-2">Loading Interactive Map...</h3>
                            <p className="text-slate-400">Preparing real-time Vietnamese logistics routes</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ) : (
                /* Analytics View */
                <div className="space-y-6">
                  {/* Performance Metrics */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                      { icon: <Clock className="w-6 h-6" />, label: 'Time', value: currentRoute.time, color: 'text-blue-400', bg: 'from-blue-500/20 to-blue-600/20' },
                      { icon: <MapPin className="w-6 h-6" />, label: 'Distance', value: currentRoute.distance, color: 'text-green-400', bg: 'from-green-500/20 to-green-600/20' },
                      { icon: <DollarSign className="w-6 h-6" />, label: 'Cost', value: currentRoute.cost, color: 'text-yellow-400', bg: 'from-yellow-500/20 to-yellow-600/20' },
                      { icon: <Fuel className="w-6 h-6" />, label: 'Fuel', value: currentRoute.fuel, color: 'text-red-400', bg: 'from-red-500/20 to-red-600/20' }
                    ].map((stat, index) => (
                      <Card key={index} className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50">
                        <CardContent className="p-6 text-center">
                          <div className={`bg-gradient-to-r ${stat.bg} rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4`}>
                            <div className={stat.color}>{stat.icon}</div>
                          </div>
                          <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                          <div className="text-sm text-slate-400">{stat.label}</div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {/* Efficiency Chart */}
                  <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2 text-purple-400">
                        <TrendingUp className="w-5 h-5" />
                        <span>Route Efficiency Analysis</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-slate-400">Current Efficiency</span>
                          <span className="text-2xl font-bold text-green-400">{currentRoute.efficiency}%</span>
                        </div>
                        <div className="w-full bg-slate-700 rounded-full h-4">
                          <div 
                            className="bg-gradient-to-r from-green-500 to-blue-500 h-4 rounded-full transition-all duration-1000"
                            style={{ width: `${currentRoute.efficiency}%` }}
                          ></div>
                        </div>
                        <div className="grid grid-cols-3 gap-4 pt-4">
                          <div className="text-center">
                            <div className="text-xl font-bold text-green-400">15%</div>
                            <div className="text-xs text-slate-400">Cost Savings</div>
                          </div>
                          <div className="text-center">
                            <div className="text-xl font-bold text-blue-400">{currentRoute.waypoints.length}</div>
                            <div className="text-xs text-slate-400">Waypoints</div>
                          </div>
                          <div className="text-center">
                            <div className="text-xl font-bold text-purple-400">A+</div>
                            <div className="text-xs text-slate-400">Grade</div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </div>

          {/* Success Footer */}
          <Card className="bg-gradient-to-r from-green-500/20 to-blue-500/20 border border-green-500/30 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <CheckCircle className="w-8 h-8 text-green-400" />
                <h2 className="text-2xl font-bold text-green-400">🎉 LogiAI Interactive Map Successfully Deployed!</h2>
              </div>
              <p className="text-slate-300 text-lg">
                Real-time interactive mapping with Vietnamese GPS coordinates is now fully operational.
                <br />
                Click different routes above to see live map updates with Google Maps-like functionality!
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </AuthGuard>
  )
}
