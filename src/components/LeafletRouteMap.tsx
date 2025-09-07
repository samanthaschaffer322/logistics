'use client'

import React, { useEffect, useRef, useState } from 'react'

interface LeafletRouteMapProps {
  origin?: { name: string; lat: number; lng: number; province?: string }
  destination?: { name: string; lat: number; lng: number; province?: string }
  route?: any
  className?: string
}

const LeafletRouteMap: React.FC<LeafletRouteMapProps> = ({ origin, destination, route, className }) => {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const [isClient, setIsClient] = useState(false)
  const [mapLoaded, setMapLoaded] = useState(false)
  const [mapError, setMapError] = useState<string | null>(null)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (!isClient || typeof window === 'undefined') return

    const initMap = async () => {
      try {
        setMapError(null)
        const L = await import('leaflet')
        
        // Add Leaflet CSS if not already present
        if (!document.querySelector('link[href*="leaflet.css"]')) {
          const link = document.createElement('link')
          link.rel = 'stylesheet'
          link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
          document.head.appendChild(link)
        }

        if (L.default) {
          const LeafletModule = L.default
          
          // Fix default marker icons
          delete (LeafletModule.Icon.Default.prototype as any)._getIconUrl
          LeafletModule.Icon.Default.mergeOptions({
            iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
            iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
          })

          if (mapRef.current && !mapInstanceRef.current) {
            // Initialize map centered on Vietnam
            const map = LeafletModule.map(mapRef.current).setView([14.0583, 108.2772], 6)
            
            // Add OpenStreetMap tiles
            LeafletModule.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
              attribution: '© OpenStreetMap contributors',
              maxZoom: 18,
            }).addTo(map)

            mapInstanceRef.current = map
            setMapLoaded(true)
          }
        }
      } catch (error) {
        console.error('Map initialization error:', error)
        setMapError('Failed to load map')
      }
    }

    initMap()

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [isClient])

  // Update map when route changes
  useEffect(() => {
    if (!mapInstanceRef.current || !origin || !destination) return

    const L = require('leaflet')
    const map = mapInstanceRef.current

    // Clear existing markers and routes
    map.eachLayer((layer: any) => {
      if (layer instanceof L.Marker || layer instanceof L.Polyline) {
        map.removeLayer(layer)
      }
    })

    try {
      // Add origin marker (green)
      const originIcon = L.divIcon({
        html: `<div style="background-color: #10b981; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white; display: flex; align-items: center; justify-content: center; color: white; font-size: 12px; font-weight: bold;">A</div>`,
        className: 'custom-div-icon',
        iconSize: [20, 20],
        iconAnchor: [10, 10]
      })
      
      const originMarker = L.marker([origin.lat, origin.lng], { icon: originIcon }).addTo(map)
      originMarker.bindPopup(`<b>Origin:</b> ${origin.name}<br/><small>${origin.province || ''}</small>`)

      // Add destination marker (red)
      const destinationIcon = L.divIcon({
        html: `<div style="background-color: #ef4444; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white; display: flex; align-items: center; justify-content: center; color: white; font-size: 12px; font-weight: bold;">B</div>`,
        className: 'custom-div-icon',
        iconSize: [20, 20],
        iconAnchor: [10, 10]
      })
      
      const destinationMarker = L.marker([destination.lat, destination.lng], { icon: destinationIcon }).addTo(map)
      destinationMarker.bindPopup(`<b>Destination:</b> ${destination.name}<br/><small>${destination.province || ''}</small>`)

      // Draw route line
      const routeLine = L.polyline([
        [origin.lat, origin.lng],
        [destination.lat, destination.lng]
      ], {
        color: '#3b82f6',
        weight: 4,
        opacity: 0.8,
        dashArray: '10, 5'
      }).addTo(map)

      // Fit map to show both markers
      const group = L.featureGroup([originMarker, destinationMarker, routeLine])
      map.fitBounds(group.getBounds(), { padding: [20, 20] })

      // Add route info popup at midpoint
      if (route) {
        const midLat = (origin.lat + destination.lat) / 2
        const midLng = (origin.lng + destination.lng) / 2
        
        const routeInfoIcon = L.divIcon({
          html: `<div style="background-color: #1e293b; color: white; padding: 8px; border-radius: 8px; border: 1px solid #3b82f6; font-size: 12px; white-space: nowrap;">
            <div><b>Distance:</b> ${route.distance?.toFixed(1) || 'N/A'} km</div>
            <div><b>Duration:</b> ${route.duration?.toFixed(1) || 'N/A'} hrs</div>
            <div><b>Cost:</b> ₫${route.totalCost?.toLocaleString() || 'N/A'}</div>
          </div>`,
          className: 'route-info-popup',
          iconSize: [150, 60],
          iconAnchor: [75, 30]
        })
        
        L.marker([midLat, midLng], { icon: routeInfoIcon }).addTo(map)
      }

    } catch (error) {
      console.error('Error updating map:', error)
    }
  }, [origin, destination, route])

  if (!isClient) {
    return (
      <div className={`h-96 bg-slate-800 rounded-lg flex items-center justify-center ${className}`}>
        <div className="text-slate-400">Loading map...</div>
      </div>
    )
  }

  if (mapError) {
    return (
      <div className={`h-96 bg-slate-800 rounded-lg flex items-center justify-center ${className}`}>
        <div className="text-red-400">Map failed to load: {mapError}</div>
      </div>
    )
  }

  return (
    <div className={`relative ${className}`}>
      <div 
        ref={mapRef} 
        className="h-96 w-full rounded-lg border border-slate-600"
        style={{ minHeight: '400px' }}
      />
      {!mapLoaded && (
        <div className="absolute inset-0 bg-slate-800 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
            <div className="text-slate-400">Loading interactive map...</div>
          </div>
        </div>
      )}
    </div>
  )
}

export default LeafletRouteMap
