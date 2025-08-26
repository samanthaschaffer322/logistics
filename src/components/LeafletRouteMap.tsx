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

  // Ensure we're on client side
  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    // Only run on client side after component mounts
    if (!isClient || typeof window === 'undefined') return

    const initMap = async () => {
      try {
        setMapError(null)
        
        // Load Leaflet dynamically
        const L = await import('leaflet')
        
        // Ensure Leaflet CSS is loaded
        if (!document.querySelector('link[href*="leaflet.css"]')) {
          const link = document.createElement('link')
          link.rel = 'stylesheet'
          link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
          link.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY='
          link.crossOrigin = ''
          document.head.appendChild(link)
        }

        // Fix for default markers in Cloudflare deployment
        if (L.default) {
          const LeafletModule = L.default
          delete (LeafletModule.Icon.Default.prototype as any)._getIconUrl
          LeafletModule.Icon.Default.mergeOptions({
            iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
            iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
          })

          if (mapRef.current && !mapInstanceRef.current) {
            // Initialize map centered on Vietnam
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

            // Add OpenStreetMap tiles with error handling
            LeafletModule.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
              attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
              maxZoom: 18,
              minZoom: 5,
              errorTileUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=='
            }).addTo(map)

            mapInstanceRef.current = map
            setMapLoaded(true)

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
              
              const marker = LeafletModule.circleMarker([location.lat, location.lng], {
                radius: 8,
                fillColor: color,
                color: '#ffffff',
                weight: 2,
                opacity: 1,
                fillOpacity: 0.8
              }).addTo(map)

              marker.bindPopup(`
                <div style="font-family: system-ui, -apple-system, sans-serif; padding: 8px; min-width: 180px;">
                  <div style="font-weight: bold; color: ${color}; font-size: 14px; margin-bottom: 4px;">
                    ${location.name}
                  </div>
                  <div style="color: #666; font-size: 12px; margin-bottom: 4px;">
                    Type: ${location.type.charAt(0).toUpperCase() + location.type.slice(1)}
                  </div>
                  <div style="color: #888; font-size: 11px;">
                    ${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}
                  </div>
                </div>
              `)
            })

            // Map loaded successfully
            console.log('✅ Leaflet map initialized successfully for Cloudflare deployment')
          }
        }
      } catch (error) {
        console.error('❌ Error initializing Leaflet map:', error)
        setMapError('Failed to load map. Please refresh the page.')
      }
    }

    // Small delay to ensure DOM is ready
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

  // Update map when route changes
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

          // Add origin marker
          const originMarker = LeafletModule.marker([selectedRoute.origin.lat, selectedRoute.origin.lng], {
            icon: LeafletModule.divIcon({
              html: `<div style="background: #22c55e; color: white; border-radius: 50%; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; font-weight: bold; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3); font-size: 14px;">A</div>`,
              className: 'route-marker',
              iconSize: [32, 32],
              iconAnchor: [16, 16]
            })
          }).addTo(map)

          // Add destination marker
          const destMarker = LeafletModule.marker([selectedRoute.destination.lat, selectedRoute.destination.lng], {
            icon: LeafletModule.divIcon({
              html: `<div style="background: #ef4444; color: white; border-radius: 50%; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; font-weight: bold; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3); font-size: 14px;">B</div>`,
              className: 'route-marker',
              iconSize: [32, 32],
              iconAnchor: [16, 16]
            })
          }).addTo(map)

          // Add route line
          const routeLine = LeafletModule.polyline([
            [selectedRoute.origin.lat, selectedRoute.origin.lng],
            [selectedRoute.destination.lat, selectedRoute.destination.lng]
          ], {
            color: '#3b82f6',
            weight: 4,
            opacity: 0.8,
            className: 'route-line'
          }).addTo(map)

          // Add popups
          originMarker.bindPopup(`
            <div style="font-family: system-ui, -apple-system, sans-serif; padding: 10px; min-width: 200px;">
              <div style="color: #22c55e; font-size: 16px; font-weight: bold; margin-bottom: 6px;">
                🚀 ORIGIN
              </div>
              <div style="font-weight: bold; margin-bottom: 4px;">${selectedRoute.origin.name}</div>
              <div style="color: #666; font-size: 12px; margin-bottom: 8px;">${selectedRoute.origin.province}</div>
              <hr style="margin: 8px 0; border: none; border-top: 1px solid #eee;">
              <div style="font-size: 12px;">
                <strong>Route:</strong> ${selectedRoute.distance} • ${selectedRoute.time}
              </div>
            </div>
          `)

          destMarker.bindPopup(`
            <div style="font-family: system-ui, -apple-system, sans-serif; padding: 10px; min-width: 200px;">
              <div style="color: #ef4444; font-size: 16px; font-weight: bold; margin-bottom: 6px;">
                🎯 DESTINATION
              </div>
              <div style="font-weight: bold; margin-bottom: 4px;">${selectedRoute.destination.name}</div>
              <div style="color: #666; font-size: 12px; margin-bottom: 8px;">${selectedRoute.destination.province}</div>
              <hr style="margin: 8px 0; border: none; border-top: 1px solid #eee;">
              <div style="font-size: 12px;">
                <strong>Route:</strong> ${selectedRoute.distance} • ${selectedRoute.time}
              </div>
            </div>
          `)

          // Fit map to show both points with padding
          const group = LeafletModule.featureGroup([originMarker, destMarker, routeLine])
          map.fitBounds(group.getBounds(), { padding: [30, 30] })

        } catch (error) {
          console.error('Error updating route:', error)
        }
      }

      updateRoute()
    }
  }, [selectedRoute, mapLoaded])

  // Don't render anything on server side
  if (!isClient) {
    return (
      <div style={{
        height: '400px',
        background: 'rgba(30, 41, 59, 0.8)',
        borderRadius: '15px',
        border: '2px solid rgba(139, 92, 246, 0.3)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column'
      }}>
        <div style={{ fontSize: '48px', marginBottom: '15px' }}>🗺️</div>
        <div style={{ color: '#8b5cf6', fontSize: '18px', fontWeight: 'bold' }}>Initializing Map...</div>
      </div>
    )
  }

  return (
    <div className={className} style={{ position: 'relative' }}>
      <div 
        ref={mapRef} 
        style={{ 
          height: '400px', 
          width: '100%', 
          borderRadius: '15px',
          border: '2px solid rgba(139, 92, 246, 0.3)',
          overflow: 'hidden',
          background: '#1e293b'
        }} 
      />
      
      {/* Loading overlay */}
      {!mapLoaded && !mapError && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(30, 41, 59, 0.95)',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          borderRadius: '15px',
          zIndex: 1000
        }}>
          <div style={{ fontSize: '48px', marginBottom: '15px', animation: 'pulse 2s infinite' }}>🗺️</div>
          <div style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '5px' }}>Loading Interactive Map...</div>
          <div style={{ fontSize: '14px', color: '#94a3b8' }}>Initializing Leaflet with OpenStreetMap</div>
        </div>
      )}

      {/* Error overlay */}
      {mapError && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(30, 41, 59, 0.95)',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          borderRadius: '15px',
          zIndex: 1000
        }}>
          <div style={{ fontSize: '48px', marginBottom: '15px' }}>❌</div>
          <div style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '5px', color: '#ef4444' }}>Map Load Error</div>
          <div style={{ fontSize: '14px', color: '#94a3b8', textAlign: 'center', maxWidth: '300px' }}>{mapError}</div>
          <button 
            onClick={() => window.location.reload()} 
            style={{
              marginTop: '15px',
              padding: '8px 16px',
              background: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            Refresh Page
          </button>
        </div>
      )}

      {/* Instructions overlay when no route */}
      {mapLoaded && !selectedRoute && (
        <div style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          background: 'rgba(30, 41, 59, 0.9)',
          color: 'white',
          padding: '15px',
          borderRadius: '10px',
          border: '2px solid rgba(139, 92, 246, 0.5)',
          maxWidth: '280px',
          zIndex: 1000
        }}>
          <div style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '8px', color: '#8b5cf6' }}>
            🗺️ Interactive Vietnam Map
          </div>
          <div style={{ fontSize: '12px', color: '#94a3b8', lineHeight: '1.4' }}>
            • Click markers to see location details<br/>
            • Calculate a route to see path visualization<br/>
            • Zoom and pan to explore Vietnam
          </div>
        </div>
      )}
    </div>
  )
}

export default LeafletRouteMap
