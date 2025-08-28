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

          // Generate realistic Vietnamese highway route with detailed waypoints
          const generateRealisticRoute = (origin: any, destination: any) => {
            const waypoints = []
            
            // Specific route patterns for major Vietnamese logistics routes
            const routePatterns = {
              // Phú Hữu to Phú Mỹ/Cái Mép area
              'phu_huu_to_phu_my': {
                condition: (o: any, d: any) => 
                  (o.name.toLowerCase().includes('phú hữu') || o.name.toLowerCase().includes('phu huu')) &&
                  (d.name.toLowerCase().includes('phú mỹ') || d.name.toLowerCase().includes('phu my') || 
                   d.name.toLowerCase().includes('cái mép') || d.name.toLowerCase().includes('cai mep')),
                waypoints: [
                  [10.7800, 106.7900], // Phú Hữu start
                  [10.7600, 106.8200], // Exit to Ring Road 2
                  [10.7400, 106.8500], // Ring Road 2 south
                  [10.7200, 106.8800], // Towards Highway 1A
                  [10.7000, 106.9200], // Highway 1A junction
                  [10.6800, 106.9600], // Continue on Highway 1A
                  [10.6600, 107.0000], // Approach Nhà Bè
                  [10.6400, 107.0300], // Cross Nhà Bè Bridge
                  [10.6200, 107.0600], // Highway 51 junction
                  [10.6100, 107.0800], // Final approach to Phú Mỹ
                ]
              },
              
              // HCMC to Vung Tau area
              'hcmc_to_vungtau': {
                condition: (o: any, d: any) => 
                  o.province === 'Ho Chi Minh City' && d.province === 'Ba Ria - Vung Tau',
                waypoints: [
                  [10.7769, 106.7009], // HCMC center
                  [10.7500, 106.7500], // District 7
                  [10.7200, 106.8000], // Towards Nhà Bè
                  [10.6800, 106.8800], // Nhà Bè area
                  [10.6400, 107.0000], // Highway 51 start
                  [10.6200, 107.0500], // Highway 51 middle
                ]
              },
              
              // Inter-city routes
              'inter_city': {
                condition: (o: any, d: any) => o.province !== d.province,
                waypoints: [
                  [10.7769, 106.7009], // Via HCMC if needed
                  [10.8167, 107.0000], // Long Thành junction
                ]
              }
            }
            
            // Find matching route pattern
            let selectedPattern = null
            console.log('🗺️ Routing from:', origin.name, 'to:', destination.name)
            
            for (const [key, pattern] of Object.entries(routePatterns)) {
              if (pattern.condition(origin, destination)) {
                selectedPattern = pattern
                console.log('✅ Using route pattern:', key)
                break
              }
            }
            
            if (selectedPattern) {
              // Use predefined realistic waypoints
              console.log('🛣️ Adding', selectedPattern.waypoints.length, 'waypoints')
              waypoints.push(...selectedPattern.waypoints)
              // Adjust last waypoint to actual destination
              waypoints[waypoints.length - 1] = [destination.lat, destination.lng]
            } else {
              // Fallback: simple route with highway junction
              waypoints.push([origin.lat, origin.lng])
              
              // Add intermediate junction for longer routes
              const distance = Math.sqrt(
                Math.pow(destination.lat - origin.lat, 2) + 
                Math.pow(destination.lng - origin.lng, 2)
              )
              
              if (distance > 0.05) {
                // Major highway junctions
                const junctions = [
                  [10.7769, 106.7009], // HCMC Center
                  [10.8167, 107.0000], // Long Thành
                  [10.6400, 107.0200], // Nhà Bè Bridge
                ]
                
                // Find closest junction
                let bestJunction = junctions[0]
                let minDistance = Infinity
                
                junctions.forEach(junction => {
                  const dist = Math.sqrt(
                    Math.pow(junction[0] - (origin.lat + destination.lat) / 2, 2) +
                    Math.pow(junction[1] - (origin.lng + destination.lng) / 2, 2)
                  )
                  if (dist < minDistance) {
                    minDistance = dist
                    bestJunction = junction
                  }
                })
                
                waypoints.push(bestJunction)
              }
              
              waypoints.push([destination.lat, destination.lng])
            }
            
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
// Cache bust Thu 28 Aug 2025 11:17:19 +07
