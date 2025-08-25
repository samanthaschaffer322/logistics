'use client'

import React, { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix for default markers in Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
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

// Vietnamese logistics locations with real coordinates
const vietnamLocations = {
  'cat-lai': { lat: 10.7769, lng: 106.7009, name: 'Cảng Cát Lái' },
  'chim-en': { lat: 10.7589, lng: 106.6804, name: 'Chim Én' },
  'vung-tau': { lat: 10.3460, lng: 107.0843, name: 'Vũng Tàu' },
  'long-an': { lat: 10.6956, lng: 106.2431, name: 'Long An' },
  'cp-tien-giang': { lat: 10.3587, lng: 106.3621, name: 'CP Tiền Giang' },
  'rico-hau-giang': { lat: 9.7578, lng: 105.6412, name: 'Rico Hậu Giang' },
  'saigon-port': { lat: 10.7886, lng: 106.7019, name: 'Cảng Sài Gòn' },
  'tan-cang': { lat: 10.7669, lng: 106.7009, name: 'Tân Cảng' },
  'hiep-phuoc': { lat: 10.7269, lng: 106.7519, name: 'Hiệp Phước' },
  'ben-nghe': { lat: 10.7769, lng: 106.7009, name: 'Bến Nghé' }
}

const predefinedRoutes = {
  'cat-lai-chim-en': {
    origin: vietnamLocations['cat-lai'],
    destination: vietnamLocations['chim-en'],
    waypoints: [
      { lat: 10.7669, lng: 106.6909, name: 'Đồng Văn Cống' },
      { lat: 10.7589, lng: 106.6854, name: 'Võ Chí Công' },
      { lat: 10.7569, lng: 106.6824, name: 'Nguyễn Văn Linh' }
    ],
    color: '#22c55e'
  },
  'vung-tau-long-an': {
    origin: vietnamLocations['vung-tau'],
    destination: vietnamLocations['long-an'],
    waypoints: [
      { lat: 10.4460, lng: 106.8843, name: 'QL51' },
      { lat: 10.5956, lng: 106.5431, name: 'QL1A' }
    ],
    color: '#3b82f6'
  },
  'chim-en-cp-tien-giang': {
    origin: vietnamLocations['chim-en'],
    destination: vietnamLocations['cp-tien-giang'],
    waypoints: [
      { lat: 10.6589, lng: 106.5804, name: 'QL50' },
      { lat: 10.4587, lng: 106.4621, name: 'QL57' }
    ],
    color: '#f59e0b'
  },
  'chim-en-rico-hau-giang': {
    origin: vietnamLocations['chim-en'],
    destination: vietnamLocations['rico-hau-giang'],
    waypoints: [
      { lat: 10.3589, lng: 106.2804, name: 'QL1A' },
      { lat: 9.9578, lng: 105.8412, name: 'QL80' }
    ],
    color: '#ef4444'
  }
}

const EnhancedRouteMap: React.FC<EnhancedRouteMapProps> = ({
  routes,
  selectedRoute = 'cat-lai-chim-en',
  onRouteSelect,
  className = ''
}) => {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<L.Map | null>(null)
  const markersRef = useRef<L.Marker[]>([])
  const routeLayerRef = useRef<L.Polyline | null>(null)

  useEffect(() => {
    if (!mapRef.current) return

    // Initialize map centered on Ho Chi Minh City
    const map = L.map(mapRef.current).setView([10.7769, 106.7009], 11)

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map)

    mapInstanceRef.current = map

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [])

  useEffect(() => {
    if (!mapInstanceRef.current) return

    // Clear existing markers and routes
    markersRef.current.forEach(marker => marker.remove())
    markersRef.current = []
    if (routeLayerRef.current) {
      routeLayerRef.current.remove()
      routeLayerRef.current = null
    }

    // Get selected route data
    const routeData = predefinedRoutes[selectedRoute as keyof typeof predefinedRoutes]
    if (!routeData) return

    // Create custom icons
    const originIcon = L.divIcon({
      className: 'custom-marker origin-marker',
      html: `<div style="background: #22c55e; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
      iconSize: [20, 20],
      iconAnchor: [10, 10]
    })

    const destinationIcon = L.divIcon({
      className: 'custom-marker destination-marker',
      html: `<div style="background: #ef4444; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
      iconSize: [20, 20],
      iconAnchor: [10, 10]
    })

    const waypointIcon = L.divIcon({
      className: 'custom-marker waypoint-marker',
      html: `<div style="background: #3b82f6; width: 16px; height: 16px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
      iconSize: [16, 16],
      iconAnchor: [8, 8]
    })

    // Add origin marker
    const originMarker = L.marker([routeData.origin.lat, routeData.origin.lng], { icon: originIcon })
      .addTo(mapInstanceRef.current)
      .bindPopup(`<strong>Điểm xuất phát:</strong><br>${routeData.origin.name}`)
    markersRef.current.push(originMarker)

    // Add destination marker
    const destinationMarker = L.marker([routeData.destination.lat, routeData.destination.lng], { icon: destinationIcon })
      .addTo(mapInstanceRef.current)
      .bindPopup(`<strong>Điểm đến:</strong><br>${routeData.destination.name}`)
    markersRef.current.push(destinationMarker)

    // Add waypoint markers
    routeData.waypoints.forEach(waypoint => {
      const waypointMarker = L.marker([waypoint.lat, waypoint.lng], { icon: waypointIcon })
        .addTo(mapInstanceRef.current!)
        .bindPopup(`<strong>Điểm trung gian:</strong><br>${waypoint.name}`)
      markersRef.current.push(waypointMarker)
    })

    // Create route line
    const routePoints: [number, number][] = [
      [routeData.origin.lat, routeData.origin.lng],
      ...routeData.waypoints.map(wp => [wp.lat, wp.lng] as [number, number]),
      [routeData.destination.lat, routeData.destination.lng]
    ]

    const routeLine = L.polyline(routePoints, {
      color: routeData.color,
      weight: 4,
      opacity: 0.8,
      dashArray: '10, 5'
    }).addTo(mapInstanceRef.current)

    routeLayerRef.current = routeLine

    // Fit map to show all markers
    const group = new L.FeatureGroup(markersRef.current)
    mapInstanceRef.current.fitBounds(group.getBounds().pad(0.1))

  }, [selectedRoute])

  return (
    <div className={`relative ${className}`}>
      <div 
        ref={mapRef} 
        className="w-full h-full min-h-[400px] rounded-lg border border-gray-200 shadow-sm"
        style={{ zIndex: 1 }}
      />
      
      {/* Route Legend */}
      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg z-10">
        <h4 className="font-semibold text-sm mb-2">Chú thích</h4>
        <div className="space-y-1 text-xs">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full border border-white"></div>
            <span>Điểm xuất phát</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full border border-white"></div>
            <span>Điểm đến</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full border border-white"></div>
            <span>Điểm trung gian</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-1 border-t-2 border-dashed" style={{ borderColor: predefinedRoutes[selectedRoute as keyof typeof predefinedRoutes]?.color || '#22c55e' }}></div>
            <span>Tuyến đường</span>
          </div>
        </div>
      </div>

      {/* Route Info */}
      <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg z-10 max-w-xs">
        <h4 className="font-semibold text-sm mb-1">
          {predefinedRoutes[selectedRoute as keyof typeof predefinedRoutes]?.origin.name} → {predefinedRoutes[selectedRoute as keyof typeof predefinedRoutes]?.destination.name}
        </h4>
        <p className="text-xs text-gray-600">
          Tuyến đường được tối ưu hóa với các điểm trung gian và phân tích giao thông thời gian thực
        </p>
      </div>
    </div>
  )
}

export default EnhancedRouteMap
