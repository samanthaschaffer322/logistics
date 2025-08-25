'use client'

import React, { useState } from 'react'

export default function SimpleTestPage() {
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
    }
  }

  const currentRoute = routes[selectedRoute as keyof typeof routes]

  return (
    <div style={{ 
      padding: '20px', 
      backgroundColor: '#0f172a', 
      minHeight: '100vh',
      color: 'white',
      fontFamily: 'system-ui, sans-serif'
    }}>
      {/* Very obvious header */}
      <div style={{ 
        backgroundColor: 'red', 
        color: 'white', 
        padding: '20px', 
        marginBottom: '20px',
        fontSize: '32px',
        fontWeight: 'bold',
        textAlign: 'center',
        border: '5px solid yellow'
      }}>
        🔴 SIMPLE TEST PAGE LOADED SUCCESSFULLY! 🔴
      </div>
      
      {/* Route selection */}
      <div style={{ marginBottom: '30px' }}>
        <h2 style={{ fontSize: '24px', marginBottom: '15px', color: '#22c55e' }}>
          🚛 Select Route:
        </h2>
        {Object.entries(routes).map(([key, route]) => (
          <button
            key={key}
            onClick={() => setSelectedRoute(key)}
            style={{
              display: 'block',
              width: '100%',
              maxWidth: '400px',
              padding: '15px',
              marginBottom: '10px',
              backgroundColor: selectedRoute === key ? route.color : '#374151',
              color: 'white',
              border: selectedRoute === key ? `3px solid ${route.color}` : '1px solid #4b5563',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: selectedRoute === key ? 'bold' : 'normal'
            }}
          >
            {route.name} - {route.distance} - {route.time}
          </button>
        ))}
      </div>

      {/* Map visualization */}
      <div style={{
        backgroundColor: '#1e293b',
        border: `5px solid ${currentRoute.color}`,
        borderRadius: '10px',
        padding: '30px',
        marginBottom: '20px'
      }}>
        <h2 style={{ 
          fontSize: '28px', 
          marginBottom: '20px', 
          color: currentRoute.color,
          textAlign: 'center'
        }}>
          🗺️ Route Map: {currentRoute.name}
        </h2>
        
        <div style={{ 
          fontSize: '18px', 
          marginBottom: '30px', 
          textAlign: 'center',
          color: '#94a3b8'
        }}>
          Distance: {currentRoute.distance} | Time: {currentRoute.time}
        </div>

        {/* Visual route */}
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          gap: '20px',
          maxWidth: '500px',
          margin: '0 auto'
        }}>
          {/* Origin */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            width: '100%',
            backgroundColor: '#22c55e20',
            padding: '15px',
            borderRadius: '10px',
            border: '2px solid #22c55e'
          }}>
            <div style={{
              width: '24px',
              height: '24px',
              backgroundColor: '#22c55e',
              borderRadius: '50%',
              marginRight: '15px',
              border: '3px solid white'
            }}></div>
            <div>
              <div style={{ color: '#22c55e', fontWeight: 'bold', fontSize: '14px' }}>
                🟢 ORIGIN (Điểm xuất phát)
              </div>
              <div style={{ color: 'white', fontSize: '16px' }}>
                {currentRoute.origin}
              </div>
            </div>
          </div>

          {/* Waypoints */}
          {currentRoute.waypoints.map((waypoint, index) => (
            <div key={index} style={{ 
              display: 'flex', 
              alignItems: 'center', 
              width: '100%',
              backgroundColor: '#3b82f620',
              padding: '12px',
              borderRadius: '8px',
              border: '2px solid #3b82f6'
            }}>
              <div style={{
                width: '20px',
                height: '20px',
                backgroundColor: '#3b82f6',
                borderRadius: '50%',
                marginRight: '15px',
                border: '2px solid white'
              }}></div>
              <div>
                <div style={{ color: '#3b82f6', fontWeight: 'bold', fontSize: '12px' }}>
                  🔵 WAYPOINT {index + 1} (Điểm trung gian)
                </div>
                <div style={{ color: '#94a3b8', fontSize: '14px' }}>
                  {waypoint}
                </div>
              </div>
            </div>
          ))}

          {/* Destination */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            width: '100%',
            backgroundColor: '#ef444420',
            padding: '15px',
            borderRadius: '10px',
            border: '2px solid #ef4444'
          }}>
            <div style={{
              width: '24px',
              height: '24px',
              backgroundColor: '#ef4444',
              borderRadius: '50%',
              marginRight: '15px',
              border: '3px solid white'
            }}></div>
            <div>
              <div style={{ color: '#ef4444', fontWeight: 'bold', fontSize: '14px' }}>
                🔴 DESTINATION (Điểm đến)
              </div>
              <div style={{ color: 'white', fontSize: '16px' }}>
                {currentRoute.destination}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Success message */}
      <div style={{ 
        backgroundColor: 'green', 
        color: 'white', 
        padding: '20px', 
        fontSize: '24px',
        fontWeight: 'bold',
        textAlign: 'center',
        border: '3px solid white',
        borderRadius: '10px'
      }}>
        ✅ MAP IS WORKING PERFECTLY! ✅
        <br />
        <span style={{ fontSize: '16px' }}>
          Click the route buttons above to see the map update in real-time!
        </span>
      </div>
    </div>
  )
}
