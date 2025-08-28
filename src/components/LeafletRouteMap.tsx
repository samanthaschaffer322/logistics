'use client'

import React, { useEffect, useRef, useState } from 'react'

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
        
        if (!document.querySelector('link[href*="leaflet.css"]')) {
          const link = document.createElement('link')
          link.rel = 'stylesheet'
          link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
          document.head.appendChild(link)
        }

        if (L.default) {
          const LeafletModule = L.default
          delete (LeafletModule.Icon.Default.prototype as any)._getIconUrl
          LeafletModule.Icon.Default.mergeOptions({
            iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
            iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
          })

          if (mapRef.current && !mapInstanceRef.current) {
            const map = LeafletModule.map(mapRef.current, {
              center: [10.8231, 106.6297],
              zoom: 7,
              zoomControl: true,
              scrollWheelZoom: true,
              doubleClickZoom: true,
              boxZoom: true,
              keyboard: true,
              dragging: true,
              touchZoom: true
            })

            LeafletModule.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
              attribution: '© OpenStreetMap contributors',
              maxZoom: 18,
              minZoom: 5
            }).addTo(map)

            mapInstanceRef.current = map
            setMapLoaded(true)
            console.log('✅ Leaflet map initialized successfully for Cloudflare deployment')
          }
        }
      } catch (error) {
        console.error('❌ Error initializing Leaflet map:', error)
        setMapError('Failed to load map. Please refresh the page.')
      }
    }

    const timer = setTimeout(initMap, 100)
    return () => {
      clearTimeout(timer)
      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.remove()
          mapInstanceRef.current = null
        } catch (e) {
          console.warn('Map cleanup warning:', e)
        }
      }
    }
  }, [isClient])

  // Update map when route changes - with realistic Vietnamese routing
  useEffect(() => {
    if (selectedRoute && mapInstanceRef.current && mapLoaded) {
      const updateRoute = async () => {
        try {
          const L = await import('leaflet')
          const LeafletModule = L.default
          const map = mapInstanceRef.current

          // Clear existing route layers
          map.eachLayer((layer: any) => {
            if (layer.options && (layer.options.className === 'route-line' || layer.options.className === 'route-marker')) {
              map.removeLayer(layer)
            }
          })

          // Generate realistic Vietnamese highway route
          const generateRealisticRoute = (origin: any, destination: any) => {
            const waypoints = [[origin.lat, origin.lng]]

            // Major Vietnamese highway nodes for realistic routing
            const highwayNodes = [
              { lat: 10.7769, lng: 106.7009, name: 'HCMC Center' },
              { lat: 10.8500, lng: 106.7500, name: 'Thu Duc Junction' },
              { lat: 10.8167, lng: 107.0000, name: 'Long Thanh Junction' },
              { lat: 10.6500, lng: 107.0200, name: 'Vung Tau Highway' },
              { lat: 10.7200, lng: 106.9800, name: 'Nha Be Junction' }
            ]

            const distance = Math.sqrt(
              Math.pow(destination.lat - origin.lat, 2) + 
              Math.pow(destination.lng - origin.lng, 2)
            )

            // Add intermediate waypoints for longer routes
            if (distance > 0.05) {
              let bestNode = null
              let minDetour = Infinity

              highwayNodes.forEach(node => {
                const detour = Math.sqrt(Math.pow(node.lat - origin.lat, 2) + Math.pow(node.lng - origin.lng, 2)) +
                              Math.sqrt(Math.pow(destination.lat - node.lat, 2) + Math.pow(destination.lng - node.lng, 2))
                
                if (detour < minDetour && detour < distance * 1.4) {
                  minDetour = detour
                  bestNode = node
                }
              })

              if (bestNode) {
                waypoints.push([bestNode.lat, bestNode.lng])
              }
            }

            waypoints.push([destination.lat, destination.lng])
            return waypoints
          }

          const routePoints = generateRealisticRoute(selectedRoute.origin, selectedRoute.destination)

          // Add origin marker
          LeafletModule.marker([selectedRoute.origin.lat, selectedRoute.origin.lng], {
            icon: LeafletModule.divIcon({
              html: `<div style="background: #22c55e; color: white; border-radius: 50%; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; font-weight: bold; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);">A</div>`,
              className: 'route-marker',
              iconSize: [32, 32],
              iconAnchor: [16, 16]
            })
          }).addTo(map)

          // Add destination marker
          LeafletModule.marker([selectedRoute.destination.lat, selectedRoute.destination.lng], {
            icon: LeafletModule.divIcon({
              html: `<div style="background: #ef4444; color: white; border-radius: 50%; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; font-weight: bold; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);">B</div>`,
              className: 'route-marker',
              iconSize: [32, 32],
              iconAnchor: [16, 16]
            })
          }).addTo(map)

          // Draw realistic route line
          LeafletModule.polyline(routePoints, {
            color: '#3b82f6',
            weight: 6,
            opacity: 0.8,
            className: 'route-line',
            smoothFactor: 2.0,
            lineCap: 'round',
            lineJoin: 'round'
          }).addTo(map)

          // Fit map to show the route
          const group = new LeafletModule.featureGroup([
            LeafletModule.marker([selectedRoute.origin.lat, selectedRoute.origin.lng]),
            LeafletModule.marker([selectedRoute.destination.lat, selectedRoute.destination.lng])
          ])
          map.fitBounds(group.getBounds().pad(0.1))

        } catch (error) {
          console.error('Error updating route:', error)
        }
      }

      updateRoute()
    }
  }, [selectedRoute, mapLoaded])

  if (!isClient) {
    return <div className={`h-96 bg-gray-100 rounded-lg flex items-center justify-center ${className}`}>
      <div className="text-gray-500">Loading map...</div>
    </div>
  }

  return (
    <div className={`relative ${className}`}>
      {mapError && (
        <div className="absolute inset-0 bg-red-50 border border-red-200 rounded-lg flex items-center justify-center z-10">
          <div className="text-red-600 text-center p-4">
            <div className="font-semibold mb-2">Map Error</div>
            <div className="text-sm">{mapError}</div>
          </div>
        </div>
      )}
      <div 
        ref={mapRef} 
        className="h-96 w-full rounded-lg border border-gray-200"
        style={{ minHeight: '400px' }}
      />
      {selectedRoute && (
        <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg p-3 z-10 max-w-xs">
          <div className="text-sm font-semibold text-gray-800 mb-1">
            {selectedRoute.origin.name} → {selectedRoute.destination.name}
          </div>
          <div className="text-xs text-gray-600">
            {selectedRoute.distance} • {selectedRoute.time}
          </div>
        </div>
      )}
    </div>
  )
}

export default LeafletRouteMap
