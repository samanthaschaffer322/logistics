'use client'

import React, { useState } from 'react'

export default function WorkingMapPage() {
  const [selectedRoute, setSelectedRoute] = useState('cat-lai-chim-en')

  const routes = {
    'cat-lai-chim-en': {
      name: 'Cát Lái → Chim Én',
      origin: 'Cảng Cát Lái',
      destination: 'Chim Én',
      distance: '25 km',
      time: '1.25h',
      waypoints: ['Đồng Văn Cống', 'Võ Chí Công', 'Nguyễn Văn Linh'],
      color: '#22c55e'
    },
    'vung-tau-long-an': {
      name: 'Vũng Tàu → Long An',
      origin: 'Cảng Vũng Tàu',
      destination: 'Long An',
      distance: '120 km',
      time: '3.0h',
      waypoints: ['QL51', 'QL1A'],
      color: '#3b82f6'
    },
    'chim-en-cp-tien-giang': {
      name: 'Chim Én → CP Tiền Giang',
      origin: 'Chim Én',
      destination: 'CP Tiền Giang',
      distance: '85 km',
      time: '2.5h',
      waypoints: ['QL50', 'QL57'],
      color: '#f59e0b'
    },
    'chim-en-rico-hau-giang': {
      name: 'Chim Én → Rico Hậu Giang',
      origin: 'Chim Én',
      destination: 'Rico Hậu Giang',
      distance: '180 km',
      time: '5.0h',
      waypoints: ['QL1A', 'QL80'],
      color: '#ef4444'
    }
  }

  const currentRoute = routes[selectedRoute as keyof typeof routes]

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#0f172a', 
      color: 'white', 
      padding: '20px',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      {/* Header */}
      <div style={{ 
        textAlign: 'center', 
        marginBottom: '30px',
        padding: '20px',
        backgroundColor: '#1e293b',
        borderRadius: '10px',
        border: '2px solid #22c55e'
      }}>
        <h1 style={{ fontSize: '32px', marginBottom: '10px' }}>
          🗺️ LogiAI Route Optimizer with Map
        </h1>
        <p style={{ fontSize: '18px', color: '#94a3b8' }}>
          Interactive Vietnamese Logistics Route Visualization
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {/* Route Selection */}
        <div style={{
          backgroundColor: '#1e293b',
          padding: '20px',
          borderRadius: '10px',
          border: '1px solid #334155'
        }}>
          <h2 style={{ fontSize: '24px', marginBottom: '20px', color: '#22c55e' }}>
            🚛 Chọn Tuyến Đường
          </h2>
          
          <div style={{ marginBottom: '20px' }}>
            {Object.entries(routes).map(([key, route]) => (
              <button
                key={key}
                onClick={() => setSelectedRoute(key)}
                style={{
                  display: 'block',
                  width: '100%',
                  padding: '15px',
                  marginBottom: '10px',
                  backgroundColor: selectedRoute === key ? route.color : '#374151',
                  color: 'white',
                  border: selectedRoute === key ? `2px solid ${route.color}` : '1px solid #4b5563',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: selectedRoute === key ? 'bold' : 'normal',
                  transition: 'all 0.2s'
                }}
              >
                <div style={{ textAlign: 'left' }}>
                  <div>{route.name}</div>
                  <div style={{ fontSize: '14px', opacity: 0.8 }}>
                    {route.distance} • {route.time}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Map Visualization */}
        <div style={{
          backgroundColor: '#1e293b',
          padding: '20px',
          borderRadius: '10px',
          border: '1px solid #334155'
        }}>
          <h2 style={{ fontSize: '24px', marginBottom: '20px', color: '#3b82f6' }}>
            🗺️ Bản Đồ Tuyến Đường
          </h2>
          
          {/* Map Container */}
          <div style={{
            backgroundColor: '#0f172a',
            border: `3px solid ${currentRoute.color}`,
            borderRadius: '10px',
            padding: '20px',
            minHeight: '400px',
            position: 'relative'
          }}>
            {/* Route Path Visualization */}
            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
              <h3 style={{ color: currentRoute.color, fontSize: '20px', marginBottom: '10px' }}>
                {currentRoute.name}
              </h3>
              <div style={{ fontSize: '16px', color: '#94a3b8' }}>
                {currentRoute.distance} • {currentRoute.time}
              </div>
            </div>

            {/* Visual Route */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }}>
              {/* Origin */}
              <div style={{ display: 'flex', alignItems: 'center', width: '100%', maxWidth: '300px' }}>
                <div style={{
                  width: '20px',
                  height: '20px',
                  backgroundColor: '#22c55e',
                  borderRadius: '50%',
                  border: '3px solid white',
                  marginRight: '15px',
                  flexShrink: 0
                }}></div>
                <div style={{
                  backgroundColor: '#22c55e20',
                  padding: '10px',
                  borderRadius: '8px',
                  border: '1px solid #22c55e',
                  flex: 1
                }}>
                  <div style={{ color: '#22c55e', fontSize: '14px', fontWeight: 'bold' }}>
                    Điểm xuất phát
                  </div>
                  <div style={{ color: 'white' }}>{currentRoute.origin}</div>
                </div>
              </div>

              {/* Waypoints */}
              {currentRoute.waypoints.map((waypoint, index) => (
                <div key={index} style={{ display: 'flex', alignItems: 'center', width: '100%', maxWidth: '300px' }}>
                  <div style={{
                    width: '16px',
                    height: '16px',
                    backgroundColor: '#3b82f6',
                    borderRadius: '50%',
                    border: '2px solid white',
                    marginRight: '15px',
                    flexShrink: 0,
                    marginLeft: '2px'
                  }}></div>
                  <div style={{
                    backgroundColor: '#3b82f620',
                    padding: '8px',
                    borderRadius: '6px',
                    border: '1px solid #3b82f6',
                    flex: 1
                  }}>
                    <div style={{ color: '#3b82f6', fontSize: '12px', fontWeight: 'bold' }}>
                      Điểm trung gian {index + 1}
                    </div>
                    <div style={{ color: '#94a3b8', fontSize: '14px' }}>{waypoint}</div>
                  </div>
                </div>
              ))}

              {/* Destination */}
              <div style={{ display: 'flex', alignItems: 'center', width: '100%', maxWidth: '300px' }}>
                <div style={{
                  width: '20px',
                  height: '20px',
                  backgroundColor: '#ef4444',
                  borderRadius: '50%',
                  border: '3px solid white',
                  marginRight: '15px',
                  flexShrink: 0
                }}></div>
                <div style={{
                  backgroundColor: '#ef444420',
                  padding: '10px',
                  borderRadius: '8px',
                  border: '1px solid #ef4444',
                  flex: 1
                }}>
                  <div style={{ color: '#ef4444', fontSize: '14px', fontWeight: 'bold' }}>
                    Điểm đến
                  </div>
                  <div style={{ color: 'white' }}>{currentRoute.destination}</div>
                </div>
              </div>
            </div>

            {/* Route Info */}
            <div style={{
              position: 'absolute',
              bottom: '20px',
              right: '20px',
              backgroundColor: '#374151',
              padding: '10px',
              borderRadius: '8px',
              border: '1px solid #4b5563'
            }}>
              <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '5px' }}>
                Trạng thái tuyến đường
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <div style={{
                  width: '8px',
                  height: '8px',
                  backgroundColor: '#22c55e',
                  borderRadius: '50%'
                }}></div>
                <span style={{ color: '#22c55e', fontSize: '14px', fontWeight: 'bold' }}>
                  Tối ưu
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Route Analysis */}
      <div style={{
        marginTop: '30px',
        backgroundColor: '#1e293b',
        padding: '20px',
        borderRadius: '10px',
        border: '1px solid #334155'
      }}>
        <h2 style={{ fontSize: '24px', marginBottom: '20px', color: '#f59e0b' }}>
          📊 Phân Tích Tuyến Đường
        </h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
          <div style={{
            backgroundColor: '#22c55e20',
            padding: '15px',
            borderRadius: '8px',
            border: '1px solid #22c55e',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#22c55e' }}>
              {currentRoute.distance}
            </div>
            <div style={{ fontSize: '14px', color: '#94a3b8' }}>Khoảng cách</div>
          </div>
          
          <div style={{
            backgroundColor: '#3b82f620',
            padding: '15px',
            borderRadius: '8px',
            border: '1px solid #3b82f6',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#3b82f6' }}>
              {currentRoute.time}
            </div>
            <div style={{ fontSize: '14px', color: '#94a3b8' }}>Thời gian tối ưu</div>
          </div>
          
          <div style={{
            backgroundColor: '#f59e0b20',
            padding: '15px',
            borderRadius: '8px',
            border: '1px solid #f59e0b',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#f59e0b' }}>
              {currentRoute.waypoints.length}
            </div>
            <div style={{ fontSize: '14px', color: '#94a3b8' }}>Điểm trung gian</div>
          </div>
          
          <div style={{
            backgroundColor: '#ef444420',
            padding: '15px',
            borderRadius: '8px',
            border: '1px solid #ef4444',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#ef4444' }}>
              15%
            </div>
            <div style={{ fontSize: '14px', color: '#94a3b8' }}>Tiết kiệm chi phí</div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{
        marginTop: '30px',
        textAlign: 'center',
        padding: '20px',
        backgroundColor: '#1e293b',
        borderRadius: '10px',
        border: '1px solid #334155'
      }}>
        <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#22c55e', marginBottom: '10px' }}>
          ✅ LogiAI Route Optimizer Working!
        </div>
        <div style={{ fontSize: '14px', color: '#94a3b8' }}>
          This is a working map visualization for Vietnamese logistics routes.
          <br />
          Access this page at: /working-map
        </div>
      </div>
    </div>
  )
}
