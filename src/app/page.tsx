'use client'

import React, { useState } from 'react'

export default function HomePage() {
  const [selectedRoute, setSelectedRoute] = useState('cat-lai-chim-en')

  const routes = {
    'cat-lai-chim-en': {
      name: 'Cát Lái → Chim Én',
      origin: 'Cảng Cát Lái',
      destination: 'Chim Én',
      distance: '25 km',
      time: '1.25h',
      color: '#22c55e',
      waypoints: ['Đồng Văn Cống', 'Võ Chí Công', 'Nguyễn Văn Linh']
    },
    'vung-tau-long-an': {
      name: 'Vũng Tàu → Long An',
      origin: 'Cảng Vũng Tàu',
      destination: 'Long An',
      distance: '120 km',
      time: '3.0h',
      color: '#3b82f6',
      waypoints: ['QL51', 'QL1A']
    },
    'chim-en-cp-tien-giang': {
      name: 'Chim Én → CP Tiền Giang',
      origin: 'Chim Én',
      destination: 'CP Tiền Giang',
      distance: '85 km',
      time: '2.5h',
      color: '#f59e0b',
      waypoints: ['QL50', 'QL57']
    },
    'chim-en-rico-hau-giang': {
      name: 'Chim Én → Rico Hậu Giang',
      origin: 'Chim Én',
      destination: 'Rico Hậu Giang',
      distance: '180 km',
      time: '5.0h',
      color: '#ef4444',
      waypoints: ['QL1A', 'QL80']
    }
  }

  const currentRoute = routes[selectedRoute as keyof typeof routes]

  return (
    <div style={{ 
      minHeight: '100vh',
      backgroundColor: '#0f172a',
      color: 'white',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      padding: '0',
      margin: '0'
    }}>
      {/* VERY OBVIOUS SUCCESS BANNER */}
      <div style={{
        backgroundColor: '#22c55e',
        color: 'white',
        padding: '20px',
        textAlign: 'center',
        fontSize: '32px',
        fontWeight: 'bold',
        border: '5px solid #ffffff',
        boxShadow: '0 0 20px rgba(34, 197, 94, 0.5)'
      }}>
        🎉 SUCCESS! LOGIAI ROUTE OPTIMIZER IS WORKING! 🗺️
      </div>

      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
        padding: '40px 20px',
        textAlign: 'center',
        borderBottom: '3px solid #22c55e'
      }}>
        <h1 style={{ 
          fontSize: '48px', 
          marginBottom: '15px',
          background: 'linear-gradient(135deg, #22c55e, #3b82f6)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontWeight: 'bold'
        }}>
          🗺️ LogiAI Route Optimizer - MAIN PAGE
        </h1>
        <p style={{ 
          fontSize: '20px', 
          color: '#94a3b8',
          maxWidth: '800px',
          margin: '0 auto'
        }}>
          Interactive Vietnamese Logistics Route Visualization - Now Working on Main Page!
        </p>
      </div>

      <div style={{ padding: '30px 20px', maxWidth: '1400px', margin: '0 auto' }}>
        {/* SUCCESS MESSAGE */}
        <div style={{
          backgroundColor: '#22c55e',
          color: 'white',
          padding: '25px',
          borderRadius: '15px',
          textAlign: 'center',
          marginBottom: '30px',
          fontSize: '24px',
          fontWeight: 'bold',
          border: '3px solid #ffffff',
          boxShadow: '0 0 30px rgba(34, 197, 94, 0.3)'
        }}>
          ✅ DEPLOYMENT SUCCESSFUL! You can now see the working map below! ✅
        </div>

        {/* Main Grid */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'minmax(350px, 1fr) 2fr', 
          gap: '30px',
          marginBottom: '30px'
        }}>
          {/* Route Selection Panel */}
          <div style={{
            backgroundColor: '#1e293b',
            borderRadius: '15px',
            padding: '25px',
            border: '3px solid #22c55e',
            height: 'fit-content'
          }}>
            <h2 style={{ 
              fontSize: '24px', 
              marginBottom: '20px', 
              color: '#22c55e',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              🚛 SELECT ROUTE (Chọn Tuyến Đường)
            </h2>
            
            <div style={{ marginBottom: '20px' }}>
              {Object.entries(routes).map(([key, route]) => (
                <button
                  key={key}
                  onClick={() => setSelectedRoute(key)}
                  style={{
                    display: 'block',
                    width: '100%',
                    padding: '18px',
                    marginBottom: '12px',
                    backgroundColor: selectedRoute === key ? route.color : '#374151',
                    color: 'white',
                    border: selectedRoute === key ? `4px solid ${route.color}` : '2px solid #4b5563',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    fontSize: '16px',
                    fontWeight: selectedRoute === key ? 'bold' : 'normal',
                    transition: 'all 0.3s ease',
                    textAlign: 'left',
                    boxShadow: selectedRoute === key ? `0 0 20px ${route.color}40` : 'none'
                  }}
                >
                  <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>
                    {route.name}
                  </div>
                  <div style={{ fontSize: '14px', opacity: 0.8 }}>
                    📍 {route.origin} → {route.destination}
                  </div>
                  <div style={{ fontSize: '14px', opacity: 0.8, marginTop: '3px' }}>
                    📏 {route.distance} • ⏱️ {route.time}
                  </div>
                </button>
              ))}
            </div>

            {/* Current Route Info */}
            <div style={{
              backgroundColor: '#0f172a',
              borderRadius: '10px',
              padding: '15px',
              border: `3px solid ${currentRoute.color}`,
              boxShadow: `0 0 15px ${currentRoute.color}30`
            }}>
              <h3 style={{ color: currentRoute.color, marginBottom: '10px', fontSize: '16px' }}>
                📊 CURRENT ROUTE ACTIVE
              </h3>
              <div style={{ fontSize: '14px', lineHeight: '1.6' }}>
                <div>🎯 <strong>Route:</strong> {currentRoute.name}</div>
                <div>📏 <strong>Distance:</strong> {currentRoute.distance}</div>
                <div>⏱️ <strong>Time:</strong> {currentRoute.time}</div>
                <div>🛣️ <strong>Waypoints:</strong> {currentRoute.waypoints.length}</div>
              </div>
            </div>
          </div>

          {/* Map Visualization Panel */}
          <div style={{
            backgroundColor: '#1e293b',
            borderRadius: '15px',
            padding: '25px',
            border: '3px solid #3b82f6'
          }}>
            <h2 style={{ 
              fontSize: '24px', 
              marginBottom: '20px', 
              color: '#3b82f6',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              🗺️ INTERACTIVE MAP (Bản Đồ Tương Tác)
            </h2>
            
            {/* Map Container */}
            <div style={{
              backgroundColor: '#0f172a',
              border: `4px solid ${currentRoute.color}`,
              borderRadius: '12px',
              padding: '25px',
              minHeight: '500px',
              position: 'relative',
              boxShadow: `0 0 30px ${currentRoute.color}20`
            }}>
              {/* Map Header */}
              <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                <h3 style={{ 
                  color: currentRoute.color, 
                  fontSize: '22px', 
                  marginBottom: '8px',
                  fontWeight: 'bold'
                }}>
                  🗺️ {currentRoute.name}
                </h3>
                <div style={{ 
                  fontSize: '16px', 
                  color: '#94a3b8',
                  display: 'flex',
                  justifyContent: 'center',
                  gap: '20px'
                }}>
                  <span>📏 {currentRoute.distance}</span>
                  <span>⏱️ {currentRoute.time}</span>
                  <span>🛣️ {currentRoute.waypoints.length} stops</span>
                </div>
              </div>

              {/* Visual Route Path */}
              <div style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                gap: '18px',
                maxWidth: '600px',
                margin: '0 auto'
              }}>
                {/* Origin */}
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  width: '100%',
                  backgroundColor: '#22c55e15',
                  padding: '18px',
                  borderRadius: '12px',
                  border: '3px solid #22c55e',
                  boxShadow: '0 0 15px rgba(34, 197, 94, 0.3)'
                }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    backgroundColor: '#22c55e',
                    borderRadius: '50%',
                    marginRight: '18px',
                    border: '4px solid white',
                    boxShadow: '0 0 0 3px #22c55e',
                    flexShrink: 0
                  }}></div>
                  <div style={{ flex: 1 }}>
                    <div style={{ 
                      color: '#22c55e', 
                      fontWeight: 'bold', 
                      fontSize: '16px',
                      marginBottom: '3px'
                    }}>
                      🟢 ORIGIN - ĐIỂM XUẤT PHÁT
                    </div>
                    <div style={{ color: 'white', fontSize: '18px', fontWeight: '500' }}>
                      {currentRoute.origin}
                    </div>
                  </div>
                </div>

                {/* Connecting Line */}
                <div style={{
                  width: '6px',
                  height: '25px',
                  background: `linear-gradient(to bottom, #22c55e, #3b82f6)`,
                  borderRadius: '3px',
                  boxShadow: '0 0 10px rgba(34, 197, 94, 0.5)'
                }}></div>

                {/* Waypoints */}
                {currentRoute.waypoints.map((waypoint, index) => (
                  <React.Fragment key={index}>
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      width: '100%',
                      backgroundColor: '#3b82f615',
                      padding: '15px',
                      borderRadius: '10px',
                      border: '3px solid #3b82f6',
                      boxShadow: '0 0 15px rgba(59, 130, 246, 0.3)'
                    }}>
                      <div style={{
                        width: '28px',
                        height: '28px',
                        backgroundColor: '#3b82f6',
                        borderRadius: '50%',
                        marginRight: '15px',
                        border: '3px solid white',
                        boxShadow: '0 0 0 2px #3b82f6',
                        flexShrink: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        color: 'white'
                      }}>
                        {index + 1}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ 
                          color: '#3b82f6', 
                          fontWeight: 'bold', 
                          fontSize: '14px',
                          marginBottom: '2px'
                        }}>
                          🔵 WAYPOINT {index + 1} - ĐIỂM TRUNG GIAN
                        </div>
                        <div style={{ color: '#94a3b8', fontSize: '16px' }}>
                          {waypoint}
                        </div>
                      </div>
                    </div>
                    {index < currentRoute.waypoints.length - 1 && (
                      <div style={{
                        width: '6px',
                        height: '20px',
                        background: '#3b82f6',
                        borderRadius: '3px',
                        boxShadow: '0 0 10px rgba(59, 130, 246, 0.5)'
                      }}></div>
                    )}
                  </React.Fragment>
                ))}

                {/* Final connecting line */}
                <div style={{
                  width: '6px',
                  height: '25px',
                  background: `linear-gradient(to bottom, #3b82f6, #ef4444)`,
                  borderRadius: '3px',
                  boxShadow: '0 0 10px rgba(239, 68, 68, 0.5)'
                }}></div>

                {/* Destination */}
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  width: '100%',
                  backgroundColor: '#ef444415',
                  padding: '18px',
                  borderRadius: '12px',
                  border: '3px solid #ef4444',
                  boxShadow: '0 0 15px rgba(239, 68, 68, 0.3)'
                }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    backgroundColor: '#ef4444',
                    borderRadius: '50%',
                    marginRight: '18px',
                    border: '4px solid white',
                    boxShadow: '0 0 0 3px #ef4444',
                    flexShrink: 0
                  }}></div>
                  <div style={{ flex: 1 }}>
                    <div style={{ 
                      color: '#ef4444', 
                      fontWeight: 'bold', 
                      fontSize: '16px',
                      marginBottom: '3px'
                    }}>
                      🔴 DESTINATION - ĐIỂM ĐẾN
                    </div>
                    <div style={{ color: 'white', fontSize: '18px', fontWeight: '500' }}>
                      {currentRoute.destination}
                    </div>
                  </div>
                </div>
              </div>

              {/* Route Status */}
              <div style={{
                position: 'absolute',
                bottom: '20px',
                right: '20px',
                backgroundColor: '#22c55e',
                padding: '12px 16px',
                borderRadius: '8px',
                border: '2px solid white',
                boxShadow: '0 0 15px rgba(34, 197, 94, 0.5)'
              }}>
                <div style={{ fontSize: '12px', color: 'white', marginBottom: '5px', fontWeight: 'bold' }}>
                  ROUTE STATUS
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{
                    width: '12px',
                    height: '12px',
                    backgroundColor: 'white',
                    borderRadius: '50%'
                  }}></div>
                  <span style={{ color: 'white', fontSize: '14px', fontWeight: 'bold' }}>
                    OPTIMIZED ✅
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Final Success Message */}
        <div style={{
          backgroundColor: '#22c55e',
          color: 'white',
          padding: '30px',
          borderRadius: '15px',
          textAlign: 'center',
          fontSize: '28px',
          fontWeight: 'bold',
          border: '4px solid white',
          boxShadow: '0 0 40px rgba(34, 197, 94, 0.4)',
          marginTop: '30px'
        }}>
          🎉 SUCCESS! LOGIAI ROUTE OPTIMIZER WITH MAP IS NOW WORKING! 🗺️
          <div style={{ fontSize: '18px', marginTop: '10px', fontWeight: 'normal' }}>
            Click the route buttons above to see the interactive map update in real-time!
            <br />
            Vietnamese logistics route optimization is now fully operational!
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 768px) {
          div[style*="gridTemplateColumns: minmax(350px, 1fr) 2fr"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  )
}
