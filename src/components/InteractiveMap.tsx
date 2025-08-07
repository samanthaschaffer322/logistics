'use client'

import React, { useState, useEffect } from 'react'
import { MapPin, Truck, Navigation, Clock, DollarSign, Fuel, AlertTriangle } from 'lucide-react'

interface MapLocation {
  id: string
  name: string
  lat: number
  lng: number
  type: 'depot' | 'destination' | 'truck'
  status: 'active' | 'inactive' | 'warning'
}

interface Route {
  id: string
  from: string
  to: string
  distance: number
  duration: number
  cost: number
  fuel: number
  status: 'active' | 'completed' | 'delayed'
  truck: string
}

const InteractiveMap: React.FC = () => {
  const [selectedLocation, setSelectedLocation] = useState<MapLocation | null>(null)
  const [activeRoutes, setActiveRoutes] = useState<Route[]>([])
  const [mapView, setMapView] = useState<'satellite' | 'roadmap' | 'traffic'>('roadmap')

  // Vietnam logistics locations
  const locations: MapLocation[] = [
    { id: 'hcm', name: 'TP. Hồ Chí Minh', lat: 10.8231, lng: 106.6297, type: 'depot', status: 'active' },
    { id: 'hanoi', name: 'Hà Nội', lat: 21.0285, lng: 105.8542, type: 'depot', status: 'active' },
    { id: 'danang', name: 'Đà Nẵng', lat: 16.0544, lng: 108.2022, type: 'depot', status: 'active' },
    { id: 'cantho', name: 'Cần Thơ', lat: 10.0452, lng: 105.7469, type: 'destination', status: 'active' },
    { id: 'haiphong', name: 'Hải Phòng', lat: 20.8449, lng: 106.6881, type: 'destination', status: 'active' },
    { id: 'truck1', name: 'VN-001 (Container 40ft)', lat: 11.2, lng: 106.8, type: 'truck', status: 'active' },
    { id: 'truck2', name: 'VN-002 (Container 20ft)', lat: 20.5, lng: 106.2, type: 'truck', status: 'warning' },
    { id: 'truck3', name: 'VN-003 (Flatbed)', lat: 16.5, lng: 107.8, type: 'truck', status: 'active' }
  ]

  const routes: Route[] = [
    {
      id: 'route1',
      from: 'TP.HCM',
      to: 'Hà Nội',
      distance: 1720,
      duration: 18,
      cost: 15000000,
      fuel: 680,
      status: 'active',
      truck: 'VN-001'
    },
    {
      id: 'route2',
      from: 'Đà Nẵng',
      to: 'TP.HCM',
      distance: 950,
      duration: 12,
      cost: 8500000,
      fuel: 380,
      status: 'active',
      truck: 'VN-002'
    },
    {
      id: 'route3',
      from: 'Hà Nội',
      to: 'Hải Phòng',
      distance: 120,
      duration: 2.5,
      cost: 2800000,
      fuel: 48,
      status: 'completed',
      truck: 'VN-003'
    }
  ]

  useEffect(() => {
    setActiveRoutes(routes)
    
    // Simulate real-time updates
    const interval = setInterval(() => {
      setActiveRoutes(prev => prev.map(route => ({
        ...route,
        status: Math.random() > 0.8 ? 'delayed' : route.status
      })))
    }, 10000)

    return () => clearInterval(interval)
  }, [])

  const getLocationIcon = (location: MapLocation) => {
    switch (location.type) {
      case 'depot':
        return <MapPin className={`w-6 h-6 ${location.status === 'active' ? 'text-blue-400' : 'text-gray-400'}`} />
      case 'destination':
        return <Navigation className={`w-6 h-6 ${location.status === 'active' ? 'text-green-400' : 'text-gray-400'}`} />
      case 'truck':
        return <Truck className={`w-6 h-6 ${
          location.status === 'active' ? 'text-indigo-400' : 
          location.status === 'warning' ? 'text-yellow-400' : 'text-gray-400'
        }`} />
      default:
        return <MapPin className="w-6 h-6 text-gray-400" />
    }
  }

  const getRouteStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-400 bg-green-500/10'
      case 'delayed': return 'text-red-400 bg-red-500/10'
      case 'completed': return 'text-blue-400 bg-blue-500/10'
      default: return 'text-gray-400 bg-gray-500/10'
    }
  }

  return (
    <div className="space-y-6">
      {/* Map Controls */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Interactive Vietnam Logistics Map</h2>
        <div className="flex gap-2">
          {(['roadmap', 'satellite', 'traffic'] as const).map(view => (
            <button
              key={view}
              onClick={() => setMapView(view)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                mapView === view
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              {view.charAt(0).toUpperCase() + view.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Interactive Map Display */}
        <div className="lg:col-span-2">
          <div className="dark-card p-6">
            <div className="relative bg-slate-800 rounded-xl overflow-hidden" style={{ height: '500px' }}>
              {/* Map Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-slate-700 to-slate-900">
                <div className="absolute inset-0 opacity-20">
                  <svg viewBox="0 0 400 300" className="w-full h-full">
                    {/* Vietnam coastline approximation */}
                    <path
                      d="M100 50 Q120 40 140 60 L160 80 Q180 100 200 120 L220 140 Q240 160 260 180 L280 200 Q300 220 320 240 L340 260 Q320 280 300 270 L280 260 Q260 250 240 240 L220 230 Q200 220 180 210 L160 200 Q140 190 120 180 L100 170 Q80 160 70 140 L60 120 Q50 100 60 80 L70 60 Q80 50 100 50 Z"
                      fill="rgba(34, 197, 94, 0.2)"
                      stroke="rgba(34, 197, 94, 0.4)"
                      strokeWidth="2"
                    />
                  </svg>
                </div>
              </div>

              {/* Location Markers */}
              {locations.map(location => (
                <div
                  key={location.id}
                  className={`absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 hover:scale-110 ${
                    selectedLocation?.id === location.id ? 'scale-125 z-10' : 'z-5'
                  }`}
                  style={{
                    left: `${((location.lng - 102) / 10) * 100}%`,
                    top: `${((23 - location.lat) / 13) * 100}%`
                  }}
                  onClick={() => setSelectedLocation(location)}
                >
                  <div className={`p-2 rounded-full ${
                    location.status === 'active' ? 'bg-indigo-500/20 border-2 border-indigo-400' :
                    location.status === 'warning' ? 'bg-yellow-500/20 border-2 border-yellow-400' :
                    'bg-gray-500/20 border-2 border-gray-400'
                  } backdrop-blur-sm`}>
                    {getLocationIcon(location)}
                  </div>
                  
                  {/* Location Label */}
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1">
                    <div className="bg-slate-900/90 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                      {location.name}
                    </div>
                  </div>

                  {/* Animated pulse for active locations */}
                  {location.status === 'active' && (
                    <div className="absolute inset-0 rounded-full border-2 border-indigo-400 animate-ping opacity-75"></div>
                  )}
                </div>
              ))}

              {/* Route Lines */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                {activeRoutes.filter(route => route.status === 'active').map(route => {
                  const fromLoc = locations.find(l => l.name === route.from)
                  const toLoc = locations.find(l => l.name === route.to)
                  if (!fromLoc || !toLoc) return null

                  const x1 = ((fromLoc.lng - 102) / 10) * 100
                  const y1 = ((23 - fromLoc.lat) / 13) * 100
                  const x2 = ((toLoc.lng - 102) / 10) * 100
                  const y2 = ((23 - toLoc.lat) / 13) * 100

                  return (
                    <g key={route.id}>
                      <line
                        x1={`${x1}%`}
                        y1={`${y1}%`}
                        x2={`${x2}%`}
                        y2={`${y2}%`}
                        stroke="rgba(99, 102, 241, 0.6)"
                        strokeWidth="3"
                        strokeDasharray="10,5"
                        className="animate-pulse"
                      />
                      {/* Animated truck icon moving along route */}
                      <circle
                        cx={`${x1 + (x2 - x1) * 0.6}%`}
                        cy={`${y1 + (y2 - y1) * 0.6}%`}
                        r="4"
                        fill="rgba(99, 102, 241, 0.8)"
                        className="animate-bounce"
                      />
                    </g>
                  )
                })}
              </svg>

              {/* Map Legend */}
              <div className="absolute bottom-4 left-4 bg-slate-900/90 backdrop-blur-sm rounded-lg p-3">
                <div className="text-xs text-white space-y-1">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-blue-400" />
                    <span>Depot</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Navigation className="w-4 h-4 text-green-400" />
                    <span>Destination</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-indigo-400" />
                    <span>Active Truck</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Location Details & Route Info */}
        <div className="space-y-4">
          {/* Selected Location Info */}
          {selectedLocation && (
            <div className="dark-card p-4">
              <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                {getLocationIcon(selectedLocation)}
                {selectedLocation.name}
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">Type:</span>
                  <span className="text-white capitalize">{selectedLocation.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Status:</span>
                  <span className={`capitalize ${
                    selectedLocation.status === 'active' ? 'text-green-400' :
                    selectedLocation.status === 'warning' ? 'text-yellow-400' :
                    'text-gray-400'
                  }`}>
                    {selectedLocation.status}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Coordinates:</span>
                  <span className="text-white">{selectedLocation.lat.toFixed(4)}, {selectedLocation.lng.toFixed(4)}</span>
                </div>
              </div>
            </div>
          )}

          {/* Active Routes */}
          <div className="dark-card p-4">
            <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
              <Navigation className="w-5 h-5 text-indigo-400" />
              Active Routes
            </h3>
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {activeRoutes.map(route => (
                <div key={route.id} className="bg-slate-800 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm font-medium text-white">
                      {route.from} → {route.to}
                    </div>
                    <div className={`px-2 py-1 rounded text-xs ${getRouteStatusColor(route.status)}`}>
                      {route.status}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex items-center gap-1 text-slate-400">
                      <Navigation className="w-3 h-3" />
                      {route.distance}km
                    </div>
                    <div className="flex items-center gap-1 text-slate-400">
                      <Clock className="w-3 h-3" />
                      {route.duration}h
                    </div>
                    <div className="flex items-center gap-1 text-slate-400">
                      <DollarSign className="w-3 h-3" />
                      {(route.cost / 1000000).toFixed(1)}M
                    </div>
                    <div className="flex items-center gap-1 text-slate-400">
                      <Fuel className="w-3 h-3" />
                      {route.fuel}L
                    </div>
                  </div>
                  
                  <div className="mt-2 text-xs text-slate-500">
                    Truck: {route.truck}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Real-time Alerts */}
          <div className="dark-card p-4">
            <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-yellow-400" />
              Live Alerts
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-start gap-2 p-2 bg-yellow-500/10 rounded">
                <AlertTriangle className="w-4 h-4 text-yellow-400 mt-0.5" />
                <div>
                  <div className="text-yellow-400 font-medium">Traffic Delay</div>
                  <div className="text-slate-400">VN-002 delayed 30min on Route QL1A</div>
                </div>
              </div>
              <div className="flex items-start gap-2 p-2 bg-green-500/10 rounded">
                <Clock className="w-4 h-4 text-green-400 mt-0.5" />
                <div>
                  <div className="text-green-400 font-medium">On Schedule</div>
                  <div className="text-slate-400">VN-001 arriving Hà Nội in 2h</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default InteractiveMap
