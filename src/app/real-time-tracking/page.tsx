'use client'

import React, { useState, useEffect } from 'react'
import Layout from '@/components/Layout'
import { 
  MapPin, 
  Truck, 
  Package, 
  Clock, 
  Navigation, 
  AlertTriangle,
  CheckCircle,
  RefreshCw
} from 'lucide-react'

const RealTimeTrackingPage = () => {
  const [selectedShipment, setSelectedShipment] = useState<string | null>(null)
  const [lastUpdate, setLastUpdate] = useState(new Date())

  // Mock shipment data
  const shipments = [
    {
      id: 'SH-2024-001',
      status: 'in_transit',
      origin: 'TP. Hồ Chí Minh',
      destination: 'Hà Nội',
      driver: 'Nguyễn Văn A',
      vehicle: 'Truck 29A-12345',
      progress: 65,
      estimatedArrival: '2024-08-07 14:30',
      currentLocation: 'Vinh, Nghệ An',
      distance: { total: 1700, remaining: 595 }
    },
    {
      id: 'SH-2024-002',
      status: 'delivered',
      origin: 'Đà Nẵng',
      destination: 'TP. Hồ Chí Minh',
      driver: 'Trần Thị B',
      vehicle: 'Truck 43A-67890',
      progress: 100,
      estimatedArrival: '2024-08-06 16:00',
      currentLocation: 'TP. Hồ Chí Minh',
      distance: { total: 964, remaining: 0 }
    },
    {
      id: 'SH-2024-003',
      status: 'loading',
      origin: 'Hải Phòng',
      destination: 'Cần Thơ',
      driver: 'Lê Văn C',
      vehicle: 'Truck 31A-11111',
      progress: 5,
      estimatedArrival: '2024-08-08 10:00',
      currentLocation: 'Hải Phòng Port',
      distance: { total: 1200, remaining: 1140 }
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'text-green-400 bg-green-500/20 border-green-500/30'
      case 'in_transit': return 'text-blue-400 bg-blue-500/20 border-blue-500/30'
      case 'loading': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30'
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/30'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered': return <CheckCircle className="w-4 h-4" />
      case 'in_transit': return <Truck className="w-4 h-4" />
      case 'loading': return <Package className="w-4 h-4" />
      default: return <AlertTriangle className="w-4 h-4" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'delivered': return 'Đã giao hàng'
      case 'in_transit': return 'Đang vận chuyển'
      case 'loading': return 'Đang xếp hàng'
      default: return 'Không xác định'
    }
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdate(new Date())
    }, 30000) // Update every 30 seconds

    return () => clearInterval(interval)
  }, [])

  return (
    <Layout>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold gradient-text flex items-center gap-3">
              <MapPin className="w-8 h-8 text-indigo-400" />
              Real-time Tracking
            </h1>
            <p className="text-slate-400 mt-1">
              Monitor your shipments in real-time across Vietnam
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setLastUpdate(new Date())}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
            <div className="text-sm text-slate-400">
              Last update: {lastUpdate.toLocaleTimeString('vi-VN')}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Shipments List */}
          <div className="lg:col-span-2">
            <div className="dark-card p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Active Shipments</h2>
              <div className="space-y-4">
                {shipments.map((shipment) => (
                  <div
                    key={shipment.id}
                    className={`p-4 rounded-xl border transition-all cursor-pointer ${
                      selectedShipment === shipment.id
                        ? 'border-indigo-500 bg-indigo-500/10'
                        : 'border-slate-700 bg-slate-800/30 hover:bg-slate-800/50'
                    }`}
                    onClick={() => setSelectedShipment(shipment.id)}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(shipment.status)}`}>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(shipment.status)}
                            {getStatusText(shipment.status)}
                          </div>
                        </div>
                        <span className="font-semibold text-white">{shipment.id}</span>
                      </div>
                      <div className="text-sm text-slate-400">
                        {shipment.progress}% complete
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-3">
                      <div>
                        <p className="text-xs text-slate-400">From</p>
                        <p className="text-white font-medium">{shipment.origin}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-400">To</p>
                        <p className="text-white font-medium">{shipment.destination}</p>
                      </div>
                    </div>

                    <div className="mb-3">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-slate-400">Progress</span>
                        <span className="text-white">{shipment.progress}%</span>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-2">
                        <div
                          className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${shipment.progress}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-slate-400">Driver</p>
                        <p className="text-white">{shipment.driver}</p>
                      </div>
                      <div>
                        <p className="text-slate-400">Vehicle</p>
                        <p className="text-white">{shipment.vehicle}</p>
                      </div>
                      <div>
                        <p className="text-slate-400">ETA</p>
                        <p className="text-white">{shipment.estimatedArrival}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Shipment Details */}
          <div className="space-y-6">
            {selectedShipment ? (
              (() => {
                const shipment = shipments.find(s => s.id === selectedShipment)!
                return (
                  <>
                    <div className="dark-card p-6">
                      <h3 className="text-lg font-semibold text-white mb-4">Shipment Details</h3>
                      <div className="space-y-4">
                        <div>
                          <p className="text-slate-400 text-sm">Shipment ID</p>
                          <p className="text-white font-semibold">{shipment.id}</p>
                        </div>
                        <div>
                          <p className="text-slate-400 text-sm">Current Location</p>
                          <p className="text-white font-semibold flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-indigo-400" />
                            {shipment.currentLocation}
                          </p>
                        </div>
                        <div>
                          <p className="text-slate-400 text-sm">Distance</p>
                          <p className="text-white">
                            {shipment.distance.remaining}km remaining of {shipment.distance.total}km
                          </p>
                        </div>
                        <div>
                          <p className="text-slate-400 text-sm">Estimated Arrival</p>
                          <p className="text-white flex items-center gap-2">
                            <Clock className="w-4 h-4 text-green-400" />
                            {shipment.estimatedArrival}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="dark-card p-6">
                      <h3 className="text-lg font-semibold text-white mb-4">Route Information</h3>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg">
                          <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                          <div>
                            <p className="text-white font-medium">{shipment.origin}</p>
                            <p className="text-slate-400 text-sm">Origin</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg">
                          <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
                          <div>
                            <p className="text-white font-medium">{shipment.currentLocation}</p>
                            <p className="text-slate-400 text-sm">Current Location</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg">
                          <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                          <div>
                            <p className="text-white font-medium">{shipment.destination}</p>
                            <p className="text-slate-400 text-sm">Destination</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )
              })()
            ) : (
              <div className="dark-card p-6 text-center">
                <Navigation className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-400">Select a shipment to view details</p>
              </div>
            )}
          </div>
        </div>

        {/* Map Placeholder */}
        <div className="dark-card p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Vietnam Logistics Map</h2>
          <div className="bg-slate-800/50 rounded-xl p-8 text-center border-2 border-dashed border-slate-600">
            <MapPin className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-400 text-lg mb-2">Interactive Map View</p>
            <p className="text-slate-500">Real-time tracking visualization for Vietnamese logistics routes</p>
            <div className="mt-4 text-sm text-slate-400">
              Features: GPS tracking, route optimization, traffic updates, weather alerts
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default RealTimeTrackingPage
