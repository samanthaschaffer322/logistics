'use client'

import React from 'react'

export default function TestMapPage() {
  return (
    <div style={{
      width: '100%',
      height: '100vh',
      backgroundColor: 'red',
      border: '20px solid yellow',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '32px',
      fontWeight: 'bold',
      color: 'white',
      textAlign: 'center'
    }}>
      <div style={{ marginBottom: '20px' }}>🔴 TEST MAP PAGE 🔴</div>
      <div style={{ fontSize: '24px', marginBottom: '20px' }}>
        If you can see this, the deployment is working!
      </div>
      <div style={{ fontSize: '18px', backgroundColor: 'blue', padding: '20px', borderRadius: '10px' }}>
        URL: /test-map
      </div>
      <div style={{ fontSize: '16px', marginTop: '20px', backgroundColor: 'green', padding: '15px', borderRadius: '10px' }}>
        This page should be visible at: your-domain.com/test-map
      </div>
    </div>
  )
}
