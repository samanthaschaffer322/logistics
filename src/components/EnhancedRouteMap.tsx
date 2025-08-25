'use client'

import React, { useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import SimpleMapFallback from './SimpleMapFallback'

// Dynamically import Leaflet to avoid SSR issues
const LeafletMap = dynamic(() => import('./LeafletMapComponent'), {
  ssr: false,
  loading: () => <SimpleMapFallback />
})

interface RoutePoint {
  lat: number
  lng: number
  name: string
  type: 'origin' | 'destination' | 'waypoint'
}

interface EnhancedRouteMapProps {
  routes: RoutePoint[]
  selectedRoute?: string
  onRouteSelect?: (route: string) => void
  className?: string
}

const EnhancedRouteMap: React.FC<EnhancedRouteMapProps> = ({
  routes,
  selectedRoute = 'cat-lai-chim-en',
  onRouteSelect,
  className = ''
}) => {
  const [isClient, setIsClient] = useState(false)
  const [mapError, setMapError] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return (
      <div className={`relative ${className}`}>
        <SimpleMapFallback selectedRoute={selectedRoute} className="h-[400px]" />
      </div>
    )
  }

  if (mapError) {
    return (
      <div className={`relative ${className}`}>
        <div className="w-full h-full min-h-[400px] bg-slate-700 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mb-4 mx-auto">
              <span className="text-red-400 text-2xl">⚠️</span>
            </div>
            <h3 className="text-white font-medium mb-2">Không thể tải bản đồ</h3>
            <p className="text-slate-400 text-sm mb-4">Sử dụng chế độ xem thay thế</p>
            <SimpleMapFallback selectedRoute={selectedRoute} className="h-[300px]" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`relative ${className}`}>
      <div className="w-full h-full min-h-[400px]">
        <LeafletMap
          selectedRoute={selectedRoute}
          onRouteSelect={onRouteSelect}
        />
      </div>
    </div>
  )
}

export default EnhancedRouteMap
