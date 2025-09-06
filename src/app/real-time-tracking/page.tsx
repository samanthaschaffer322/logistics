'use client'

import React, { useState, useEffect } from 'react'
import AuthGuard from '@/components/AuthGuard'
import PaymentTrackingAssistant from '@/components/PaymentTrackingAssistant'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MapPin, Truck, Clock, Navigation } from 'lucide-react'

// Real-time GPS tracking component for LogiAI V4.0
export default function RealTimeTrackingPage() {
  const [vehicles, setVehicles] = useState([
    { id: 'VN-001', location: 'Ho Chi Minh City', status: 'active', gps: { lat: 10.8231, lng: 106.6297 } },
    { id: 'VN-002', location: 'Bien Hoa', status: 'active', gps: { lat: 10.9460, lng: 106.8234 } },
    { id: 'VN-003', location: 'Binh Duong', status: 'idle', gps: { lat: 11.1271, lng: 106.6504 } }
  ])

  // Simulate real-time GPS updates
  useEffect(() => {
    const interval = setInterval(() => {
      setVehicles(prev => prev.map(vehicle => ({
        ...vehicle,
        gps: {
          lat: vehicle.gps.lat + (Math.random() - 0.5) * 0.001,
          lng: vehicle.gps.lng + (Math.random() - 0.5) * 0.001
        }
      })))
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
              Real-time GPS Tracking
            </h1>
            <p className="text-slate-300">Monitor your fleet with live GPS tracking and analytics</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {vehicles.map(vehicle => (
              <Card key={vehicle.id} className="bg-slate-800/50 border-slate-700">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Truck className="w-5 h-5" />
                    {vehicle.id}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-slate-300">
                      <MapPin className="w-4 h-4" />
                      <span>{vehicle.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-300">
                      <Navigation className="w-4 h-4" />
                      <span>GPS: {vehicle.gps.lat.toFixed(4)}, {vehicle.gps.lng.toFixed(4)}</span>
                    </div>
                    <Badge variant={vehicle.status === 'active' ? 'default' : 'secondary'}>
                      {vehicle.status}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <PaymentTrackingAssistant />
        </div>
      </div>
    </AuthGuard>
  )
}
