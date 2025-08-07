'use client'

import React, { useEffect, useRef, useState } from 'react'
import { MapPin, Navigation, MapIcon, Truck, AlertTriangle } from 'lucide-react'

interface RoutePoint {
  id: string
  name: string
  address: string
  lat: number
  lng: number
  type: 'pickup' | 'delivery' | 'warehouse'
  priority: number
}

interface OptimizedRoute {
  id: string
  points: RoutePoint[]
  distance: number
  estimatedTime: number
  fuelCost: number
  totalCost: number
}

interface InteractiveMapProps {
  departure?: RoutePoint | null
  destination?: RoutePoint | null
  optimizedRoute?: OptimizedRoute | null
  language: 'vi' | 'en'
}

const InteractiveMap: React.FC<InteractiveMapProps> = ({ 
  departure, 
  destination, 
  optimizedRoute,
  language 
}) => {
  const mapRef = useRef<HTMLDivElement>(null)
  const [mapLoaded, setMapLoaded] = useState(false)
  const [routeVisible, setRouteVisible] = useState(false)

  // Vietnam bounds
  const vietnamBounds = {
    north: 23.393395,
    south: 8.179,
    east: 109.464638,
    west: 102.144778
  }

  // Default center (Vietnam)
  const defaultCenter = { lat: 16.0583, lng: 106.0639 }

  useEffect(() => {
    // Simulate map loading
    const timer = setTimeout(() => {
      setMapLoaded(true)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (optimizedRoute) {
      const timer = setTimeout(() => {
        setRouteVisible(true)
      }, 500)
      return () => clearTimeout(timer)
    } else {
      setRouteVisible(false)
    }
  }, [optimizedRoute])

  const getMarkerColor = (type: string) => {
    switch (type) {
      case 'pickup':
      case 'departure':
        return 'bg-green-500'
      case 'delivery':
      case 'destination':
        return 'bg-red-500'
      case 'warehouse':
        return 'bg-purple-500'
      default:
        return 'bg-blue-500'
    }
  }

  const getMarkerIcon = (type: string) => {
    switch (type) {
      case 'pickup':
      case 'departure':
        return <MapPin className="w-4 h-4 text-white" />
      case 'delivery':
      case 'destination':
        return <Navigation className="w-4 h-4 text-white" />
      case 'warehouse':
        return <Truck className="w-4 h-4 text-white" />
      default:
        return <MapPin className="w-4 h-4 text-white" />
    }
  }

  const calculateMapPosition = (point: RoutePoint) => {
    // Convert lat/lng to percentage position on Vietnam map
    const latPercent = ((point.lat - vietnamBounds.south) / (vietnamBounds.north - vietnamBounds.south)) * 100
    const lngPercent = ((point.lng - vietnamBounds.west) / (vietnamBounds.east - vietnamBounds.west)) * 100
    
    return {
      top: `${100 - latPercent}%`,
      left: `${lngPercent}%`
    }
  }

  return (
    <div className="relative w-full h-full bg-slate-800 rounded-xl overflow-hidden">
      {/* Map Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900">
        {/* Vietnam Map Outline */}
        <svg 
          className="absolute inset-0 w-full h-full opacity-20" 
          viewBox="0 0 400 600"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Simplified Vietnam outline */}
          <path
            d="M200 50 L220 80 L240 120 L250 160 L260 200 L270 240 L280 280 L290 320 L300 360 L310 400 L320 440 L330 480 L340 520 L350 560 L340 580 L320 590 L300 585 L280 580 L260 575 L240 570 L220 565 L200 560 L180 555 L160 550 L140 545 L120 540 L100 535 L80 530 L60 525 L50 520 L45 500 L50 480 L55 460 L60 440 L65 420 L70 400 L75 380 L80 360 L85 340 L90 320 L95 300 L100 280 L105 260 L110 240 L115 220 L120 200 L125 180 L130 160 L135 140 L140 120 L150 100 L160 80 L180 60 Z"
            fill="currentColor"
            stroke="currentColor"
            strokeWidth="2"
          />
        </svg>

        {/* Grid Lines */}
        <div className="absolute inset-0 opacity-10">
          {[...Array(10)].map((_, i) => (
            <div key={`h-${i}`} className="absolute w-full border-t border-slate-600" style={{ top: `${i * 10}%` }} />
          ))}
          {[...Array(10)].map((_, i) => (
            <div key={`v-${i}`} className="absolute h-full border-l border-slate-600" style={{ left: `${i * 10}%` }} />
          ))}
        </div>
      </div>

      {/* Loading State */}
      {!mapLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-800/80">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-400 mx-auto mb-2"></div>
            <p className="text-slate-400 text-sm">
              {language === 'vi' ? 'Đang tải bản đồ...' : 'Loading map...'}
            </p>
          </div>
        </div>
      )}

      {/* Map Content */}
      {mapLoaded && (
        <>
          {/* Departure Marker */}
          {departure && (
            <div
              className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10"
              style={calculateMapPosition(departure)}
            >
              <div className={`${getMarkerColor('departure')} rounded-full p-2 shadow-lg animate-bounce`}>
                {getMarkerIcon('departure')}
              </div>
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 bg-slate-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                {departure.name}
              </div>
            </div>
          )}

          {/* Destination Marker */}
          {destination && (
            <div
              className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10"
              style={calculateMapPosition(destination)}
            >
              <div className={`${getMarkerColor('destination')} rounded-full p-2 shadow-lg animate-pulse`}>
                {getMarkerIcon('destination')}
              </div>
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 bg-slate-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                {destination.name}
              </div>
            </div>
          )}

          {/* Route Line */}
          {routeVisible && departure && destination && (
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-5">
              <defs>
                <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.8" />
                  <stop offset="50%" stopColor="#3b82f6" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.8" />
                </linearGradient>
              </defs>
              
              {/* Animated route line */}
              <line
                x1={`${((departure.lng - vietnamBounds.west) / (vietnamBounds.east - vietnamBounds.west)) * 100}%`}
                y1={`${100 - ((departure.lat - vietnamBounds.south) / (vietnamBounds.north - vietnamBounds.south)) * 100}%`}
                x2={`${((destination.lng - vietnamBounds.west) / (vietnamBounds.east - vietnamBounds.west)) * 100}%`}
                y2={`${100 - ((destination.lat - vietnamBounds.south) / (vietnamBounds.north - vietnamBounds.south)) * 100}%`}
                stroke="url(#routeGradient)"
                strokeWidth="4"
                strokeDasharray="10,5"
                className="animate-pulse"
              />
              
              {/* Route direction arrow */}
              <defs>
                <marker id="arrowhead" markerWidth="10" markerHeight="7" 
                        refX="9" refY="3.5" orient="auto">
                  <polygon points="0 0, 10 3.5, 0 7" fill="#3b82f6" />
                </marker>
              </defs>
              
              <line
                x1={`${((departure.lng - vietnamBounds.west) / (vietnamBounds.east - vietnamBounds.west)) * 100}%`}
                y1={`${100 - ((departure.lat - vietnamBounds.south) / (vietnamBounds.north - vietnamBounds.south)) * 100}%`}
                x2={`${((destination.lng - vietnamBounds.west) / (vietnamBounds.east - vietnamBounds.west)) * 100}%`}
                y2={`${100 - ((destination.lat - vietnamBounds.south) / (vietnamBounds.north - vietnamBounds.south)) * 100}%`}
                stroke="transparent"
                strokeWidth="2"
                markerEnd="url(#arrowhead)"
              />
            </svg>
          )}

          {/* Route Information Panel */}
          {optimizedRoute && (
            <div className="absolute top-4 left-4 bg-slate-900/90 backdrop-blur-sm rounded-xl p-4 max-w-xs">
              <h4 className="text-white font-semibold mb-2 flex items-center gap-2">
                <MapIcon className="w-4 h-4 text-indigo-400" />
                {language === 'vi' ? 'Thông tin tuyến đường' : 'Route Information'}
              </h4>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">
                    {language === 'vi' ? 'Khoảng cách:' : 'Distance:'}
                  </span>
                  <span className="text-white">{optimizedRoute.distance} km</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-slate-400">
                    {language === 'vi' ? 'Thời gian:' : 'Time:'}
                  </span>
                  <span className="text-white">{optimizedRoute.estimatedTime}h</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-slate-400">
                    {language === 'vi' ? 'Chi phí:' : 'Cost:'}
                  </span>
                  <span className="text-white">
                    {(optimizedRoute.totalCost / 1000000).toFixed(1)}M VNĐ
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Map Controls */}
          <div className="absolute bottom-4 right-4 flex flex-col gap-2">
            <button className="bg-slate-900/80 hover:bg-slate-800 text-white p-2 rounded-lg transition-colors">
              <MapPin className="w-4 h-4" />
            </button>
            <button className="bg-slate-900/80 hover:bg-slate-800 text-white p-2 rounded-lg transition-colors">
              <Navigation className="w-4 h-4" />
            </button>
          </div>

          {/* Legend */}
          <div className="absolute bottom-4 left-4 bg-slate-900/90 backdrop-blur-sm rounded-xl p-3">
            <h5 className="text-white text-sm font-semibold mb-2">
              {language === 'vi' ? 'Chú thích' : 'Legend'}
            </h5>
            <div className="space-y-1 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-slate-300">
                  {language === 'vi' ? 'Điểm đi' : 'Departure'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-slate-300">
                  {language === 'vi' ? 'Điểm đến' : 'Destination'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <span className="text-slate-300">
                  {language === 'vi' ? 'Kho bãi' : 'Warehouse'}
                </span>
              </div>
            </div>
          </div>

          {/* No Route Selected State */}
          {!departure && !destination && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-slate-400">
                <MapPin className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium mb-2">
                  {language === 'vi' ? 'Chọn điểm đi và điểm đến' : 'Select departure and destination'}
                </p>
                <p className="text-sm">
                  {language === 'vi' 
                    ? 'Sử dụng bảng điều khiển bên trái để chọn tuyến đường'
                    : 'Use the left panel to select your route'
                  }
                </p>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default InteractiveMap
