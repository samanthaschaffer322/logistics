'use client'

import React, { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'

// Dynamic import for Leaflet to avoid SSR issues
const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false })
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false })
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false })
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false })
const Polyline = dynamic(() => import('react-leaflet').then(mod => mod.Polyline), { ssr: false })

export default function InteractiveMapProPage() {
  const [selectedRoute, setSelectedRoute] = useState('cat-lai-chim-en')
  const [mapReady, setMapReady] = useState(false)

  useEffect(() => {
    setMapReady(true)
  }, [])

  const routes = {
    'cat-lai-chim-en': {
      name: 'Cát Lái → Chim Én',
      origin: 'Cảng Cát Lái',
      destination: 'Chim Én',
      distance: '25 km',
      time: '1.25h',
      color: '#22c55e',
      coordinates: {
        origin: [10.7769, 106.7009],
        destination: [10.7829, 106.6919],
        waypoints: [
          [10.7789, 106.6989],
          [10.7809, 106.6969],
          [10.7819, 106.6949]
        ]
      },
      waypointNames: ['Đồng Văn Cống', 'Võ Chí Công', 'Nguyễn Văn Linh']
    },
    'vung-tau-long-an': {
      name: 'Vũng Tàu → Long An',
      origin: 'Cảng Vũng Tàu',
      destination: 'Long An',
      distance: '120 km',
      time: '3.0h',
      color: '#3b82f6',
      coordinates: {
        origin: [10.3460, 107.0843],
        destination: [10.6956, 106.2431],
        waypoints: [
          [10.4200, 106.8500],
          [10.5500, 106.5000]
        ]
      },
      waypointNames: ['QL51', 'QL1A']
    },
    'chim-en-cp-tien-giang': {
      name: 'Chim Én → CP Tiền Giang',
      origin: 'Chim Én',
      destination: 'CP Tiền Giang',
      distance: '85 km',
      time: '2.5h',
      color: '#f59e0b',
      coordinates: {
        origin: [10.7829, 106.6919],
        destination: [10.3500, 106.3600],
        waypoints: [
          [10.6500, 106.5500],
          [10.5000, 106.4500]
        ]
      },
      waypointNames: ['QL50', 'QL57']
    },
    'chim-en-rico-hau-giang': {
      name: 'Chim Én → Rico Hậu Giang',
      origin: 'Chim Én',
      destination: 'Rico Hậu Giang',
      distance: '180 km',
      time: '5.0h',
      color: '#ef4444',
      coordinates: {
        origin: [10.7829, 106.6919],
        destination: [9.7570, 105.6420],
        waypoints: [
          [10.5000, 106.4000],
          [10.0000, 106.0000]
        ]
      },
      waypointNames: ['QL1A', 'QL80']
    }
  }

  const currentRoute = routes[selectedRoute as keyof typeof routes]

  // Create polyline path
  const getPolylinePath = () => {
    const path = [
      currentRoute.coordinates.origin,
      ...currentRoute.coordinates.waypoints,
      currentRoute.coordinates.destination
    ]
    return path
  }

  return (
    <div style={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
      color: 'white',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      {/* Professional Header */}
      <div style={{
        background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
        padding: '30px 20px',
        borderBottom: '3px solid #22c55e',
        boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', textAlign: 'center' }}>
          <h1 style={{ 
            fontSize: '42px', 
            marginBottom: '12px',
            background: 'linear-gradient(135deg, #22c55e, #3b82f6)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: 'bold'
          }}>
            🗺️ LogiAI Interactive Map Pro
          </h1>
          <p style={{ 
            fontSize: '18px', 
            color: '#94a3b8',
            marginBottom: '20px'
          }}>
            Real-time Interactive Google Maps-like Experience for Vietnamese Logistics
          </p>
          
          {/* Feature badges */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            gap: '12px', 
            flexWrap: 'wrap'
          }}>
            {[
              { icon: '🌍', text: 'Live Interactive Map', color: '#22c55e' },
              { icon: '🛣️', text: 'Real Routes', color: '#3b82f6' },
              { icon: '📍', text: 'GPS Coordinates', color: '#f59e0b' },
              { icon: '⚡', text: 'Real-time Updates', color: '#ef4444' }
            ].map((badge, index) => (
              <div key={index} style={{
                backgroundColor: badge.color + '20',
                border: `2px solid ${badge.color}`,
                borderRadius: '20px',
                padding: '6px 14px',
                fontSize: '13px',
                fontWeight: 'bold',
                color: badge.color
              }}>
                {badge.icon} {badge.text}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ padding: '20px', maxWidth: '1400px', margin: '0 auto' }}>
        {/* Main Layout */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '320px 1fr', 
          gap: '20px',
          height: 'calc(100vh - 200px)'
        }}>
          {/* Left Sidebar */}
          <div style={{
            background: 'rgba(30, 41, 59, 0.8)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            padding: '20px',
            border: '1px solid rgba(51, 65, 85, 0.5)',
            height: 'fit-content'
          }}>
            <h2 style={{ 
              fontSize: '20px', 
              marginBottom: '16px', 
              color: '#22c55e',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              🚛 Route Selection
            </h2>
            
            {/* Route Buttons */}
            <div style={{ marginBottom: '20px' }}>
              {Object.entries(routes).map(([key, route]) => (
                <button
                  key={key}
                  onClick={() => setSelectedRoute(key)}
                  style={{
                    display: 'block',
                    width: '100%',
                    padding: '14px',
                    marginBottom: '8px',
                    background: selectedRoute === key 
                      ? `linear-gradient(135deg, ${route.color}20, ${route.color}10)` 
                      : 'rgba(55, 65, 81, 0.5)',
                    color: 'white',
                    border: selectedRoute === key ? `2px solid ${route.color}` : '1px solid rgba(75, 85, 99, 0.5)',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: selectedRoute === key ? '600' : '400',
                    transition: 'all 0.3s ease',
                    textAlign: 'left',
                    backdropFilter: 'blur(5px)'
                  }}
                >
                  <div style={{ fontWeight: '600', marginBottom: '4px', color: selectedRoute === key ? route.color : 'white' }}>
                    {route.name}
                  </div>
                  <div style={{ fontSize: '12px', opacity: 0.7 }}>
                    📏 {route.distance} • ⏱️ {route.time}
                  </div>
                </button>
              ))}
            </div>

            {/* Current Route Info */}
            <div style={{
              background: `linear-gradient(135deg, ${currentRoute.color}15, ${currentRoute.color}05)`,
              borderRadius: '12px',
              padding: '16px',
              border: `1px solid ${currentRoute.color}40`
            }}>
              <h3 style={{ color: currentRoute.color, marginBottom: '12px', fontSize: '16px', fontWeight: '600' }}>
                📊 Active Route
              </h3>
              <div style={{ fontSize: '13px', lineHeight: '1.5', color: '#e2e8f0' }}>
                <div style={{ marginBottom: '6px' }}>
                  <span style={{ color: currentRoute.color }}>🎯</span> <strong>{currentRoute.name}</strong>
                </div>
                <div style={{ marginBottom: '6px' }}>
                  <span style={{ color: '#22c55e' }}>📍</span> {currentRoute.origin}
                </div>
                <div style={{ marginBottom: '6px' }}>
                  <span style={{ color: '#ef4444' }}>🏁</span> {currentRoute.destination}
                </div>
                <div style={{ marginBottom: '6px' }}>
                  <span style={{ color: '#3b82f6' }}>📏</span> {currentRoute.distance}
                </div>
                <div>
                  <span style={{ color: '#f59e0b' }}>⏱️</span> {currentRoute.time}
                </div>
              </div>
            </div>

            {/* Map Controls */}
            <div style={{ marginTop: '20px' }}>
              <h3 style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '12px', fontWeight: '600' }}>
                🎛️ Map Controls
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <button style={{
                  padding: '8px 12px',
                  background: 'rgba(59, 130, 246, 0.2)',
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                  borderRadius: '8px',
                  color: '#3b82f6',
                  fontSize: '12px',
                  cursor: 'pointer'
                }}>
                  🔍 Zoom to Route
                </button>
                <button style={{
                  padding: '8px 12px',
                  background: 'rgba(34, 197, 94, 0.2)',
                  border: '1px solid rgba(34, 197, 94, 0.3)',
                  borderRadius: '8px',
                  color: '#22c55e',
                  fontSize: '12px',
                  cursor: 'pointer'
                }}>
                  📍 Show All Markers
                </button>
                <button style={{
                  padding: '8px 12px',
                  background: 'rgba(245, 158, 11, 0.2)',
                  border: '1px solid rgba(245, 158, 11, 0.3)',
                  borderRadius: '8px',
                  color: '#f59e0b',
                  fontSize: '12px',
                  cursor: 'pointer'
                }}>
                  🛣️ Traffic Layer
                </button>
              </div>
            </div>
          </div>

          {/* Interactive Map */}
          <div style={{
            background: 'rgba(30, 41, 59, 0.8)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            padding: '16px',
            border: '1px solid rgba(51, 65, 85, 0.5)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              position: 'absolute',
              top: '16px',
              left: '16px',
              right: '16px',
              zIndex: 1000,
              background: 'rgba(15, 23, 42, 0.9)',
              backdropFilter: 'blur(10px)',
              borderRadius: '12px',
              padding: '12px 16px',
              border: `1px solid ${currentRoute.color}40`
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ color: currentRoute.color, fontSize: '16px', fontWeight: '600', marginBottom: '2px' }}>
                    {currentRoute.name}
                  </h3>
                  <div style={{ fontSize: '12px', color: '#94a3b8' }}>
                    📏 {currentRoute.distance} • ⏱️ {currentRoute.time} • 🛣️ {currentRoute.waypointNames.length} stops
                  </div>
                </div>
                <div style={{
                  background: currentRoute.color,
                  color: 'white',
                  padding: '4px 8px',
                  borderRadius: '6px',
                  fontSize: '11px',
                  fontWeight: '600'
                }}>
                  LIVE
                </div>
              </div>
            </div>

            {/* Map Container */}
            <div style={{ 
              height: '100%', 
              borderRadius: '12px', 
              overflow: 'hidden',
              border: `2px solid ${currentRoute.color}30`
            }}>
              {mapReady ? (
                <MapContainer
                  center={currentRoute.coordinates.origin as [number, number]}
                  zoom={11}
                  style={{ height: '100%', width: '100%' }}
                  zoomControl={true}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  
                  {/* Origin Marker */}
                  <Marker position={currentRoute.coordinates.origin as [number, number]}>
                    <Popup>
                      <div style={{ color: '#000', fontWeight: 'bold' }}>
                        🟢 {currentRoute.origin}
                        <br />
                        <small>Điểm xuất phát</small>
                      </div>
                    </Popup>
                  </Marker>

                  {/* Waypoint Markers */}
                  {currentRoute.coordinates.waypoints.map((waypoint, index) => (
                    <Marker key={index} position={waypoint as [number, number]}>
                      <Popup>
                        <div style={{ color: '#000', fontWeight: 'bold' }}>
                          🔵 {currentRoute.waypointNames[index]}
                          <br />
                          <small>Điểm trung gian {index + 1}</small>
                        </div>
                      </Popup>
                    </Marker>
                  ))}

                  {/* Destination Marker */}
                  <Marker position={currentRoute.coordinates.destination as [number, number]}>
                    <Popup>
                      <div style={{ color: '#000', fontWeight: 'bold' }}>
                        🔴 {currentRoute.destination}
                        <br />
                        <small>Điểm đến</small>
                      </div>
                    </Popup>
                  </Marker>

                  {/* Route Polyline */}
                  <Polyline
                    positions={getPolylinePath() as [number, number][]}
                    color={currentRoute.color}
                    weight={4}
                    opacity={0.8}
                  />
                </MapContainer>
              ) : (
                <div style={{
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'rgba(15, 23, 42, 0.5)',
                  color: '#94a3b8'
                }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '48px', marginBottom: '16px' }}>🗺️</div>
                    <div style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>
                      Loading Interactive Map...
                    </div>
                    <div style={{ fontSize: '14px' }}>
                      Preparing real-time route visualization
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Stats */}
        <div style={{
          marginTop: '20px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px'
        }}>
          {[
            { icon: '📏', label: 'Distance', value: currentRoute.distance, color: '#22c55e' },
            { icon: '⏱️', label: 'Time', value: currentRoute.time, color: '#3b82f6' },
            { icon: '🛣️', label: 'Waypoints', value: currentRoute.waypointNames.length.toString(), color: '#f59e0b' },
            { icon: '💰', label: 'Cost Savings', value: '15%', color: '#ef4444' }
          ].map((stat, index) => (
            <div key={index} style={{
              background: `linear-gradient(135deg, ${stat.color}15, ${stat.color}05)`,
              backdropFilter: 'blur(10px)',
              padding: '16px',
              borderRadius: '12px',
              border: `1px solid ${stat.color}30`,
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '24px', marginBottom: '8px' }}>{stat.icon}</div>
              <div style={{ fontSize: '20px', fontWeight: 'bold', color: stat.color, marginBottom: '4px' }}>
                {stat.value}
              </div>
              <div style={{ fontSize: '12px', color: '#94a3b8' }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 1024px) {
          div[style*="gridTemplateColumns: 320px 1fr"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  )
}
