'use client'

import React from 'react'
import VisibleRouteMap from '@/components/VisibleRouteMap'

export default function DebugTestPage() {
  return (
    <div style={{ padding: '20px', backgroundColor: '#0f172a', minHeight: '100vh' }}>
      <div style={{ 
        backgroundColor: 'red', 
        color: 'white', 
        padding: '20px', 
        marginBottom: '20px',
        fontSize: '24px',
        fontWeight: 'bold',
        textAlign: 'center'
      }}>
        🔴 DEBUG TEST PAGE - If you see this, the page is loading!
      </div>
      
      <div style={{ 
        backgroundColor: 'blue', 
        color: 'white', 
        padding: '20px', 
        marginBottom: '20px',
        fontSize: '18px'
      }}>
        Testing VisibleRouteMap component below:
      </div>
      
      <div style={{ border: '5px solid yellow', padding: '10px' }}>
        <VisibleRouteMap selectedRoute="cat-lai-chim-en" />
      </div>
      
      <div style={{ 
        backgroundColor: 'green', 
        color: 'white', 
        padding: '20px', 
        marginTop: '20px',
        fontSize: '18px'
      }}>
        If you see a map above with route visualization, the component is working!
      </div>
    </div>
  )
}
