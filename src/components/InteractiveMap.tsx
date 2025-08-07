'use client'

import React, { useEffect, useRef, useState } from 'react'
import { MapPin, Navigation, MapIcon, Truck, AlertTriangle, Plus, Minus, Maximize, RotateCcw } from 'lucide-react'

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
  const [zoomLevel, setZoomLevel] = useState(6)
  const [mapCenter, setMapCenter] = useState({ lat: 16.0583, lng: 106.0639 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [mapOffset, setMapOffset] = useState({ x: 0, y: 0 })
  const [showTraffic, setShowTraffic] = useState(false)
  const [showSatellite, setShowSatellite] = useState(false)
  const [animationFrame, setAnimationFrame] = useState(0)

  // Vietnam bounds
  const vietnamBounds = {
    north: 23.393395,
    south: 8.179,
    east: 109.464638,
    west: 102.144778
  }

  // Major Vietnamese cities for reference
  const majorCities = [
    { name: 'TP.HCM', lat: 10.8231, lng: 106.6297, population: '9M' },
    { name: 'Hà Nội', lat: 21.0285, lng: 105.8542, population: '8M' },
    { name: 'Đà Nẵng', lat: 16.0544, lng: 108.2022, population: '1.2M' },
    { name: 'Hải Phòng', lat: 20.8449, lng: 106.6881, population: '2M' },
    { name: 'Cần Thơ', lat: 10.0452, lng: 105.7469, population: '1.2M' }
  ]

  useEffect(() => {
    // Simulate realistic map loading
    const timer = setTimeout(() => {
      setMapLoaded(true)
    }, 1200)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (optimizedRoute) {
      const timer = setTimeout(() => {
        setRouteVisible(true)
      }, 800)
      return () => clearTimeout(timer)
    } else {
      setRouteVisible(false)
    }
  }, [optimizedRoute])

  // Animation loop for route visualization
  useEffect(() => {
    if (routeVisible) {
      const interval = setInterval(() => {
        setAnimationFrame(prev => (prev + 1) % 100)
      }, 100)
      return () => clearInterval(interval)
    }
  }, [routeVisible])

  const getMarkerColor = (type: string) => {
    switch (type) {
      case 'pickup':
      case 'departure':
        return 'bg-green-500 shadow-green-500/50'
      case 'delivery':
      case 'destination':
        return 'bg-red-500 shadow-red-500/50'
      case 'warehouse':
        return 'bg-purple-500 shadow-purple-500/50'
      default:
        return 'bg-blue-500 shadow-blue-500/50'
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
    const latPercent = ((point.lat - vietnamBounds.south) / (vietnamBounds.north - vietnamBounds.south)) * 100
    const lngPercent = ((point.lng - vietnamBounds.west) / (vietnamBounds.east - vietnamBounds.west)) * 100
    
    // Apply zoom and offset
    const zoomFactor = zoomLevel / 6
    const adjustedLat = 50 + (latPercent - 50) * zoomFactor + mapOffset.y
    const adjustedLng = 50 + (lngPercent - 50) * zoomFactor + mapOffset.x
    
    return {
      top: `${100 - adjustedLat}%`,
      left: `${adjustedLng}%`
    }
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    setDragStart({ x: e.clientX, y: e.clientY })
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      const deltaX = (e.clientX - dragStart.x) * 0.1
      const deltaY = (e.clientY - dragStart.y) * 0.1
      setMapOffset(prev => ({
        x: Math.max(-20, Math.min(20, prev.x + deltaX)),
        y: Math.max(-20, Math.min(20, prev.y + deltaY))
      }))
      setDragStart({ x: e.clientX, y: e.clientY })
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const zoomIn = () => {
    setZoomLevel(prev => Math.min(12, prev + 1))
  }

  const zoomOut = () => {
    setZoomLevel(prev => Math.max(3, prev - 1))
  }

  const resetView = () => {
    setZoomLevel(6)
    setMapOffset({ x: 0, y: 0 })
    setMapCenter({ lat: 16.0583, lng: 106.0639 })
  }

  const focusOnRoute = () => {
    if (departure && destination) {
      const centerLat = (departure.lat + destination.lat) / 2
      const centerLng = (departure.lng + destination.lng) / 2
      setMapCenter({ lat: centerLat, lng: centerLng })
      setZoomLevel(7)
      setMapOffset({ x: 0, y: 0 })
    }
  }

  return (
    <div className="relative w-full h-full bg-slate-800 rounded-xl overflow-hidden">
      {/* Map Background */}
      <div 
        className={`absolute inset-0 transition-all duration-300 cursor-${isDragging ? 'grabbing' : 'grab'}`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{
          background: showSatellite 
            ? 'linear-gradient(45deg, #2d5016 0%, #4a7c59 25%, #2d5016 50%, #4a7c59 75%, #2d5016 100%)'
            : 'linear-gradient(to br, #1e293b, #334155, #475569)'
        }}
      >
        {/* Vietnam Map Outline with Enhanced Detail */}
        <svg 
          className={`absolute inset-0 w-full h-full transition-opacity duration-300 ${showSatellite ? 'opacity-30' : 'opacity-20'}`}
          viewBox="0 0 400 600"
          preserveAspectRatio="xMidYMid meet"
          style={{
            transform: `scale(${zoomLevel / 6}) translate(${mapOffset.x * 10}px, ${mapOffset.y * 10}px)`
          }}
        >
          {/* Detailed Vietnam outline */}
          <path
            d="M200 50 L220 80 L240 120 L250 160 L260 200 L270 240 L280 280 L290 320 L300 360 L310 400 L320 440 L330 480 L340 520 L350 560 L340 580 L320 590 L300 585 L280 580 L260 575 L240 570 L220 565 L200 560 L180 555 L160 550 L140 545 L120 540 L100 535 L80 530 L60 525 L50 520 L45 500 L50 480 L55 460 L60 440 L65 420 L70 400 L75 380 L80 360 L85 340 L90 320 L95 300 L100 280 L105 260 L110 240 L115 220 L120 200 L125 180 L130 160 L135 140 L140 120 L150 100 L160 80 L180 60 Z"
            fill="currentColor"
            stroke="currentColor"
            strokeWidth="2"
            className="text-slate-600"
          />
          
          {/* Major highways */}
          <g className="text-slate-500" strokeWidth="1" fill="none">
            <path d="M200 560 L200 400 L180 300 L160 200 L180 100" stroke="currentColor" strokeDasharray="5,5" />
            <path d="M150 400 L300 380" stroke="currentColor" strokeDasharray="3,3" />
            <path d="M180 300 L280 320" stroke="currentColor" strokeDasharray="3,3" />
          </g>
        </svg>

        {/* Grid Lines with Zoom Responsiveness */}
        <div className="absolute inset-0 opacity-5">
          {[...Array(Math.floor(zoomLevel * 2))].map((_, i) => (
            <div key={`h-${i}`} className="absolute w-full border-t border-slate-600" style={{ top: `${i * (100 / (zoomLevel * 2))}%` }} />
          ))}
          {[...Array(Math.floor(zoomLevel * 2))].map((_, i) => (
            <div key={`v-${i}`} className="absolute h-full border-l border-slate-600" style={{ left: `${i * (100 / (zoomLevel * 2))}%` }} />
          ))}
        </div>

        {/* Traffic Layer */}
        {showTraffic && (
          <div className="absolute inset-0 opacity-60">
            <div className="absolute top-1/4 left-1/4 w-1/2 h-1 bg-red-500 rounded animate-pulse"></div>
            <div className="absolute top-1/2 left-1/3 w-1/3 h-1 bg-yellow-500 rounded animate-pulse"></div>
            <div className="absolute top-3/4 left-1/5 w-2/5 h-1 bg-green-500 rounded animate-pulse"></div>
          </div>
        )}

        {/* Major Cities */}
        {zoomLevel >= 5 && majorCities.map(city => (
          <div
            key={city.name}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 z-5"
            style={calculateMapPosition({ 
              id: city.name, 
              name: city.name, 
              address: '', 
              lat: city.lat, 
              lng: city.lng, 
              type: 'warehouse', 
              priority: 1 
            })}
          >
            <div className="bg-slate-700 text-white text-xs px-2 py-1 rounded shadow-lg border border-slate-600">
              <div className="font-medium">{city.name}</div>
              <div className="text-slate-300">{city.population}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Loading State */}
      {!mapLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-800/90 backdrop-blur-sm">
          <div className="text-center">
            <div className="relative">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-400 mx-auto mb-4"></div>
              <div className="absolute inset-0 rounded-full h-12 w-12 border-t-2 border-purple-400 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
            </div>
            <p className="text-slate-400 text-sm animate-pulse">
              {language === 'vi' ? 'Đang tải bản đồ tương tác...' : 'Loading interactive map...'}
            </p>
            <div className="mt-2 flex justify-center space-x-1">
              <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
          </div>
        </div>
      )}

      {/* Map Content */}
      {mapLoaded && (
        <>
          {/* Departure Marker with Enhanced Animation */}
          {departure && (
            <div
              className="absolute transform -translate-x-1/2 -translate-y-1/2 z-20"
              style={calculateMapPosition(departure)}
            >
              <div className={`${getMarkerColor('departure')} rounded-full p-3 shadow-2xl animate-bounce`}>
                {getMarkerIcon('departure')}
                <div className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-30"></div>
              </div>
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-slate-900/95 backdrop-blur-sm text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap shadow-xl border border-green-500/30">
                <div className="font-semibold text-green-400">{departure.name}</div>
                <div className="text-slate-300">{language === 'vi' ? 'Điểm đi' : 'Departure'}</div>
              </div>
            </div>
          )}

          {/* Destination Marker with Enhanced Animation */}
          {destination && (
            <div
              className="absolute transform -translate-x-1/2 -translate-y-1/2 z-20"
              style={calculateMapPosition(destination)}
            >
              <div className={`${getMarkerColor('destination')} rounded-full p-3 shadow-2xl animate-pulse`}>
                {getMarkerIcon('destination')}
                <div className="absolute inset-0 rounded-full bg-red-400 animate-ping opacity-30"></div>
              </div>
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-slate-900/95 backdrop-blur-sm text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap shadow-xl border border-red-500/30">
                <div className="font-semibold text-red-400">{destination.name}</div>
                <div className="text-slate-300">{language === 'vi' ? 'Điểm đến' : 'Destination'}</div>
              </div>
            </div>
          )}

          {/* Enhanced Route Line with Animation */}
          {routeVisible && departure && destination && (
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-15">
              <defs>
                <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.9" />
                  <stop offset="50%" stopColor="#3b82f6" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.9" />
                </linearGradient>
                <linearGradient id="routeGlow" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
                  <stop offset="50%" stopColor="#3b82f6" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.3" />
                </linearGradient>
              </defs>
              
              {/* Glow effect */}
              <line
                x1={`${((departure.lng - vietnamBounds.west) / (vietnamBounds.east - vietnamBounds.west)) * 100}%`}
                y1={`${100 - ((departure.lat - vietnamBounds.south) / (vietnamBounds.north - vietnamBounds.south)) * 100}%`}
                x2={`${((destination.lng - vietnamBounds.west) / (vietnamBounds.east - vietnamBounds.west)) * 100}%`}
                y2={`${100 - ((destination.lat - vietnamBounds.south) / (vietnamBounds.north - vietnamBounds.south)) * 100}%`}
                stroke="url(#routeGlow)"
                strokeWidth="12"
                className="animate-pulse"
              />
              
              {/* Main route line */}
              <line
                x1={`${((departure.lng - vietnamBounds.west) / (vietnamBounds.east - vietnamBounds.west)) * 100}%`}
                y1={`${100 - ((departure.lat - vietnamBounds.south) / (vietnamBounds.north - vietnamBounds.south)) * 100}%`}
                x2={`${((destination.lng - vietnamBounds.west) / (vietnamBounds.east - vietnamBounds.west)) * 100}%`}
                y2={`${100 - ((destination.lat - vietnamBounds.south) / (vietnamBounds.north - vietnamBounds.south)) * 100}%`}
                stroke="url(#routeGradient)"
                strokeWidth="6"
                strokeDasharray="15,10"
                strokeDashoffset={-animationFrame}
                className="transition-all duration-100"
              />
              
              {/* Direction arrows */}
              <defs>
                <marker id="arrowhead" markerWidth="12" markerHeight="8" 
                        refX="11" refY="4" orient="auto" markerUnits="strokeWidth">
                  <polygon points="0 0, 12 4, 0 8" fill="#3b82f6" />
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

          {/* Enhanced Route Information Panel with Real-time Updates */}
          {optimizedRoute && (
            <div className="absolute top-4 left-4 bg-slate-900/95 backdrop-blur-sm rounded-xl p-4 max-w-xs shadow-2xl border border-slate-700 animate-fade-in">
              <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                <MapIcon className="w-5 h-5 text-indigo-400 animate-pulse" />
                {language === 'vi' ? 'Thông tin tuyến đường' : 'Route Information'}
                <div className="w-2 h-2 bg-green-400 rounded-full animate-ping ml-auto"></div>
              </h4>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center p-3 bg-gradient-to-r from-blue-500/10 to-blue-600/10 rounded-lg border border-blue-500/20">
                  <span className="text-slate-300 flex items-center gap-2">
                    <MapPin className="w-4 h-4 animate-bounce" />
                    {language === 'vi' ? 'Khoảng cách:' : 'Distance:'}
                  </span>
                  <span className="text-blue-400 font-bold text-lg">{optimizedRoute.distance} km</span>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-gradient-to-r from-green-500/10 to-green-600/10 rounded-lg border border-green-500/20">
                  <span className="text-slate-300 flex items-center gap-2">
                    <Navigation className="w-4 h-4 animate-spin" style={{ animationDuration: '3s' }} />
                    {language === 'vi' ? 'Thời gian:' : 'Time:'}
                  </span>
                  <span className="text-green-400 font-bold text-lg">{optimizedRoute.estimatedTime}h</span>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-gradient-to-r from-purple-500/10 to-purple-600/10 rounded-lg border border-purple-500/20">
                  <span className="text-slate-300 flex items-center gap-2">
                    <Truck className="w-4 h-4" />
                    {language === 'vi' ? 'Chi phí:' : 'Cost:'}
                  </span>
                  <span className="text-purple-400 font-bold text-lg">
                    {(optimizedRoute.totalCost / 1000000).toFixed(1)}M VNĐ
                  </span>
                </div>

                {/* Real-time Traffic Info */}
                <div className="p-2 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                  <div className="flex items-center gap-2 text-yellow-400 text-xs">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                    {language === 'vi' ? 'Giao thông: Trung bình' : 'Traffic: Moderate'}
                  </div>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-slate-700">
                <div className="text-xs text-slate-400 text-center flex items-center justify-center gap-1">
                  <div className="w-1 h-1 bg-green-400 rounded-full animate-ping"></div>
                  {language === 'vi' ? 'Cập nhật thời gian thực' : 'Real-time updates'}
                </div>
              </div>
            </div>
          )}

          {/* Enhanced Map Controls */}
          <div className="absolute bottom-4 right-4 flex flex-col gap-2">
            <div className="bg-slate-900/90 backdrop-blur-sm rounded-lg p-1 shadow-xl border border-slate-700">
              <button 
                onClick={zoomIn}
                className="block p-2 text-white hover:bg-slate-700 rounded transition-colors"
                title={language === 'vi' ? 'Phóng to' : 'Zoom in'}
              >
                <Plus className="w-4 h-4" />
              </button>
              <div className="text-center text-xs text-slate-400 py-1">{zoomLevel}x</div>
              <button 
                onClick={zoomOut}
                className="block p-2 text-white hover:bg-slate-700 rounded transition-colors"
                title={language === 'vi' ? 'Thu nhỏ' : 'Zoom out'}
              >
                <Minus className="w-4 h-4" />
              </button>
            </div>
            
            <button 
              onClick={resetView}
              className="bg-slate-900/90 backdrop-blur-sm hover:bg-slate-800 text-white p-2 rounded-lg transition-colors shadow-xl border border-slate-700"
              title={language === 'vi' ? 'Đặt lại view' : 'Reset view'}
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            
            {departure && destination && (
              <button 
                onClick={focusOnRoute}
                className="bg-indigo-600/90 backdrop-blur-sm hover:bg-indigo-700 text-white p-2 rounded-lg transition-colors shadow-xl"
                title={language === 'vi' ? 'Focus tuyến đường' : 'Focus route'}
              >
                <Maximize className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Map Layer Controls */}
          <div className="absolute top-4 right-4 bg-slate-900/90 backdrop-blur-sm rounded-lg p-2 shadow-xl border border-slate-700">
            <div className="flex flex-col gap-2">
              <button
                onClick={() => setShowTraffic(!showTraffic)}
                className={`px-3 py-2 text-xs rounded transition-colors ${
                  showTraffic 
                    ? 'bg-red-600 text-white' 
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                {language === 'vi' ? 'Giao thông' : 'Traffic'}
              </button>
              <button
                onClick={() => setShowSatellite(!showSatellite)}
                className={`px-3 py-2 text-xs rounded transition-colors ${
                  showSatellite 
                    ? 'bg-green-600 text-white' 
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                {language === 'vi' ? 'Vệ tinh' : 'Satellite'}
              </button>
            </div>
          </div>

          {/* Enhanced Legend */}
          <div className="absolute bottom-4 left-4 bg-slate-900/95 backdrop-blur-sm rounded-xl p-3 shadow-2xl border border-slate-700">
            <h5 className="text-white text-sm font-semibold mb-2 flex items-center gap-2">
              <MapIcon className="w-4 h-4 text-indigo-400" />
              {language === 'vi' ? 'Chú thích' : 'Legend'}
            </h5>
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full shadow-lg"></div>
                <span className="text-slate-300">
                  {language === 'vi' ? 'Điểm đi' : 'Departure'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full shadow-lg"></div>
                <span className="text-slate-300">
                  {language === 'vi' ? 'Điểm đến' : 'Destination'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-purple-500 rounded-full shadow-lg"></div>
                <span className="text-slate-300">
                  {language === 'vi' ? 'Kho bãi' : 'Warehouse'}
                </span>
              </div>
              {routeVisible && (
                <div className="flex items-center gap-2">
                  <div className="w-3 h-1 bg-gradient-to-r from-green-500 to-purple-500 rounded"></div>
                  <span className="text-slate-300">
                    {language === 'vi' ? 'Tuyến đường' : 'Route'}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* No Route Selected State */}
          {!departure && !destination && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-slate-400 bg-slate-900/80 backdrop-blur-sm rounded-xl p-8 shadow-2xl border border-slate-700">
                <MapPin className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="text-xl font-medium mb-2">
                  {language === 'vi' ? 'Chọn điểm đi và điểm đến' : 'Select departure and destination'}
                </p>
                <p className="text-sm">
                  {language === 'vi' 
                    ? 'Sử dụng bảng điều khiển bên trái để chọn tuyến đường và xem bản đồ tương tác'
                    : 'Use the left panel to select your route and view the interactive map'
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
