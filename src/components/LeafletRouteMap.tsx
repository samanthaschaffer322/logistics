'use client'

import React, { useEffect, useRef } from 'react'

interface LeafletRouteMapProps {
  selectedRoute?: {
    origin: { name: string; lat: number; lng: number; province: string }
    destination: { name: string; lat: number; lng: number; province: string }
    distance: string
    time: string
  } | null
  className?: string
}

const LeafletRouteMap: React.FC<LeafletRouteMapProps> = ({ selectedRoute, className }) => {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return

    const initMap = async () => {
      try {
        // Dynamic import of Leaflet for client-side only
        const L = (await import('leaflet')).default

        // Fix for default markers
        delete (L.Icon.Default.prototype as any)._getIconUrl
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
          iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
        })

        if (mapRef.current && !mapInstanceRef.current) {
          // Initialize map centered on Vietnam
          const map = L.map(mapRef.current).setView([10.8231, 106.6297], 7)

          // Add OpenStreetMap tiles
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 18,
          }).addTo(map)

          mapInstanceRef.current = map

          // Add Vietnamese locations as markers
          const locations = [
            { name: 'Cảng Cát Lái', lat: 10.8067, lng: 106.7784, type: 'port' },
            { name: 'Cảng Cái Mép', lat: 10.5833, lng: 107.0833, type: 'port' },
            { name: 'Phú Hữu', lat: 10.8231, lng: 106.7297, type: 'depot' },
            { name: 'Cảng Vũng Tàu', lat: 10.3460, lng: 107.0843, type: 'port' },
            { name: 'Cảng Sài Gòn', lat: 10.7769, lng: 106.7009, type: 'port' },
            { name: 'Long An', lat: 10.6956, lng: 106.2431, type: 'warehouse' },
            { name: 'Cần Thơ', lat: 10.0452, lng: 105.7469, type: 'depot' },
            { name: 'Hà Nội', lat: 21.0285, lng: 105.8542, type: 'depot' },
            { name: 'Hải Phòng', lat: 20.8449, lng: 106.6881, type: 'port' },
            { name: 'Đà Nẵng', lat: 16.0544, lng: 108.2022, type: 'depot' }
          ]

          // Add markers for all locations
          locations.forEach(location => {
            const color = location.type === 'port' ? '#ef4444' : 
                         location.type === 'depot' ? '#3b82f6' : '#22c55e'
            
            const marker = L.circleMarker([location.lat, location.lng], {
              radius: 8,
              fillColor: color,
              color: '#ffffff',
              weight: 2,
              opacity: 1,
              fillOpacity: 0.8
            }).addTo(map)

            marker.bindPopup(`
              <div style="font-family: system-ui; padding: 5px;">
                <strong style="color: ${color};">${location.name}</strong><br>
                <small style="color: #666;">Type: ${location.type}</small><br>
                <small style="color: #666;">Lat: ${location.lat.toFixed(4)}, Lng: ${location.lng.toFixed(4)}</small>
              </div>
            `)
          })
        }
      } catch (error) {
        console.error('Error initializing map:', error)
      }
    }

    initMap()

    // Cleanup
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [])

  // Update map when route changes
  useEffect(() => {
    if (selectedRoute && mapInstanceRef.current) {
      const L = require('leaflet')
      const map = mapInstanceRef.current

      // Clear existing route layers
      map.eachLayer((layer: any) => {
        if (layer.options && layer.options.className === 'route-line') {
          map.removeLayer(layer)
        }
      })

      // Add origin and destination markers
      const originMarker = L.marker([selectedRoute.origin.lat, selectedRoute.origin.lng], {
        icon: L.divIcon({
          html: `<div style="background: #22c55e; color: white; border-radius: 50%; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; font-weight: bold; border: 3px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3);">A</div>`,
          className: 'custom-marker',
          iconSize: [30, 30],
          iconAnchor: [15, 15]
        })
      }).addTo(map)

      const destMarker = L.marker([selectedRoute.destination.lat, selectedRoute.destination.lng], {
        icon: L.divIcon({
          html: `<div style="background: #ef4444; color: white; border-radius: 50%; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; font-weight: bold; border: 3px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3);">B</div>`,
          className: 'custom-marker',
          iconSize: [30, 30],
          iconAnchor: [15, 15]
        })
      }).addTo(map)

      // Add route line
      const routeLine = L.polyline([
        [selectedRoute.origin.lat, selectedRoute.origin.lng],
        [selectedRoute.destination.lat, selectedRoute.destination.lng]
      ], {
        color: '#3b82f6',
        weight: 4,
        opacity: 0.8,
        className: 'route-line'
      }).addTo(map)

      // Add popup to origin
      originMarker.bindPopup(`
        <div style="font-family: system-ui; padding: 8px; min-width: 200px;">
          <strong style="color: #22c55e; font-size: 16px;">🚀 ORIGIN</strong><br>
          <strong>${selectedRoute.origin.name}</strong><br>
          <small style="color: #666;">${selectedRoute.origin.province}</small><br>
          <hr style="margin: 8px 0; border: none; border-top: 1px solid #eee;">
          <small><strong>Route:</strong> ${selectedRoute.distance} • ${selectedRoute.time}</small>
        </div>
      `)

      // Add popup to destination
      destMarker.bindPopup(`
        <div style="font-family: system-ui; padding: 8px; min-width: 200px;">
          <strong style="color: #ef4444; font-size: 16px;">🎯 DESTINATION</strong><br>
          <strong>${selectedRoute.destination.name}</strong><br>
          <small style="color: #666;">${selectedRoute.destination.province}</small><br>
          <hr style="margin: 8px 0; border: none; border-top: 1px solid #eee;">
          <small><strong>Route:</strong> ${selectedRoute.distance} • ${selectedRoute.time}</small>
        </div>
      `)

      // Fit map to show both points
      const group = L.featureGroup([originMarker, destMarker, routeLine])
      map.fitBounds(group.getBounds(), { padding: [20, 20] })
    }
  }, [selectedRoute])

  return (
    <div className={className}>
      <div 
        ref={mapRef} 
        style={{ 
          height: '400px', 
          width: '100%', 
          borderRadius: '15px',
          border: '2px solid rgba(139, 92, 246, 0.3)',
          overflow: 'hidden'
        }} 
      />
      {!selectedRoute && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'rgba(30, 41, 59, 0.9)',
          color: 'white',
          padding: '20px',
          borderRadius: '10px',
          textAlign: 'center',
          border: '2px solid rgba(139, 92, 246, 0.5)',
          pointerEvents: 'none'
        }}>
          <div style={{ fontSize: '24px', marginBottom: '10px' }}>🗺️</div>
          <div style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '5px' }}>Interactive Vietnam Map</div>
          <div style={{ fontSize: '12px', color: '#94a3b8' }}>Calculate a route to see the path visualization</div>
        </div>
      )}
    </div>
  )
}

export default LeafletRouteMap
