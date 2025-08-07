'use client'

import React, { useEffect, useRef, useState } from 'react'
import { MapPin, Navigation, Truck, Target } from 'lucide-react'

interface MapProps {
  departure?: { lat: number; lng: number; name: string }
  destination?: { lat: number; lng: number; name: string }
  depot?: { lat: number; lng: number; name: string }
  optimizedRoute?: any
}

const InteractiveMap: React.FC<MapProps> = ({ departure, destination, depot, optimizedRoute }) => {
  const mapRef = useRef<HTMLDivElement>(null)
  const [mapLoaded, setMapLoaded] = useState(false)
  const [routeInfo, setRouteInfo] = useState<any>(null)

  useEffect(() => {
    // Simulate map loading
    const timer = setTimeout(() => {
      setMapLoaded(true)
      if (departure && destination) {
        calculateRoute()
      }
    }, 1000)

    return () => clearTimeout(timer)
  }, [departure, destination])

  const calculateRoute = () => {
    if (!departure || !destination) return

    // Calculate distance using Haversine formula
    const R = 6371 // Earth's radius in km
    const dLat = (destination.lat - departure.lat) * Math.PI / 180
    const dLng = (destination.lng - departure.lng) * Math.PI / 180
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(departure.lat * Math.PI / 180) * Math.cos(destination.lat * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    const distance = R * c

    // Calculate estimated time and cost
    const estimatedTime = Math.round(distance / 60 * 60) // Assuming 60km/h average
    const fuelCost = Math.round(distance * 35 / 100 * 25000) // 35L/100km * 25k VND/L
    const tollCost = Math.round(distance * 2500) // 2.5k VND/km
    const totalCost = fuelCost + tollCost

    setRouteInfo({
      distance: Math.round(distance),
      estimatedTime,
      fuelCost,
      tollCost,
      totalCost
    })
  }

  const getMapStyle = () => {
    if (!departure && !destination) {
      return {
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        backgroundImage: `
          radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
          radial-gradient(circle at 40% 80%, rgba(120, 119, 198, 0.2) 0%, transparent 50%)
        `
      }
    }

    return {
      background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      backgroundImage: `
        radial-gradient(circle at 30% 40%, rgba(255, 255, 255, 0.2) 0%, transparent 50%),
        radial-gradient(circle at 70% 60%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)
      `
    }
  }

  return (
    <div className="relative bg-slate-100 rounded-lg h-96 overflow-hidden" style={getMapStyle()}>
      {!mapLoaded ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
            <p className="text-sm">Đang tải bản đồ tương tác...</p>
          </div>
        </div>
      ) : (
        <>
          {/* Map Controls */}
          <div className="absolute top-4 right-4 flex flex-col gap-2">
            <button className="bg-white p-2 rounded shadow hover:bg-gray-50">
              <Plus className="w-4 h-4" />
            </button>
            <button className="bg-white p-2 rounded shadow hover:bg-gray-50">
              <Minus className="w-4 h-4" />
            </button>
          </div>

          {/* Location Markers */}
          {departure && (
            <div className="absolute" style={{ 
              left: '25%', 
              top: '70%',
              transform: 'translate(-50%, -50%)'
            }}>
              <div className="relative">
                <div className="bg-green-500 text-white p-2 rounded-full shadow-lg animate-pulse">
                  <MapPin className="w-6 h-6" />
                </div>
                <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded shadow text-xs font-medium whitespace-nowrap">
                  📍 {departure.name}
                </div>
              </div>
            </div>
          )}

          {destination && (
            <div className="absolute" style={{ 
              left: '75%', 
              top: '30%',
              transform: 'translate(-50%, -50%)'
            }}>
              <div className="relative">
                <div className="bg-red-500 text-white p-2 rounded-full shadow-lg animate-pulse">
                  <Target className="w-6 h-6" />
                </div>
                <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded shadow text-xs font-medium whitespace-nowrap">
                  🎯 {destination.name}
                </div>
              </div>
            </div>
          )}

          {depot && (
            <div className="absolute" style={{ 
              left: '50%', 
              top: '50%',
              transform: 'translate(-50%, -50%)'
            }}>
              <div className="relative">
                <div className="bg-purple-500 text-white p-2 rounded-full shadow-lg">
                  <Truck className="w-6 h-6" />
                </div>
                <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded shadow text-xs font-medium whitespace-nowrap">
                  🏭 {depot.name}
                </div>
              </div>
            </div>
          )}

          {/* Route Line */}
          {departure && destination && (
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              <defs>
                <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.8" />
                  <stop offset="50%" stopColor="#3b82f6" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#ef4444" stopOpacity="0.8" />
                </linearGradient>
              </defs>
              <path
                d={`M ${25}% ${70}% Q ${50}% ${40}% ${75}% ${30}%`}
                stroke="url(#routeGradient)"
                strokeWidth="4"
                fill="none"
                strokeDasharray="10,5"
                className="animate-pulse"
              />
              {/* Route direction arrow */}
              <polygon
                points="60,45 65,40 65,50"
                fill="#3b82f6"
                className="animate-bounce"
              />
            </svg>
          )}

          {/* Route Information Panel */}
          {routeInfo && (
            <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-lg">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{routeInfo.distance} km</div>
                  <div className="text-slate-600">Khoảng cách</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {Math.floor(routeInfo.estimatedTime / 60)}h {routeInfo.estimatedTime % 60}m
                  </div>
                  <div className="text-slate-600">Thời gian</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    {routeInfo.totalCost.toLocaleString('vi-VN')}
                  </div>
                  <div className="text-slate-600">Chi phí (VNĐ)</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {Math.round(routeInfo.distance * 35 / 100)} L
                  </div>
                  <div className="text-slate-600">Nhiên liệu</div>
                </div>
              </div>
            </div>
          )}

          {/* Map Legend */}
          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
            <div className="text-xs font-semibold mb-2">Chú thích:</div>
            <div className="space-y-1 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span>Điểm xuất phát</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span>Điểm đến</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <span>Depot tối ưu</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-1 bg-gradient-to-r from-green-500 to-red-500 rounded"></div>
                <span>Tuyến đường</span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

// Add missing icons
const Plus = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
)

const Minus = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
  </svg>
)

export default InteractiveMap
