'use client'

import React, { useState, useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { 
  MapPin, 
  Navigation, 
  AlertTriangle, 
  Fuel, 
  Clock, 
  Activity,
  Bell,
  Eye,
  CheckCircle,
  Truck,
  Zap
} from 'lucide-react'
import { useTranslation } from '@/lib/i18n/useTranslation'
import { RealTimeTrackingSystem, TrackingAlert, TrackingPoint } from '@/lib/tracking/real-time-tracking'

// Dynamic import for map components
const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false })
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false })
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false })
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false })
const Circle = dynamic(() => import('react-leaflet').then(mod => mod.Circle), { ssr: false })

export default function RealTimeTrackingPage() {
  const { t, locale } = useTranslation()
  const [trackingSystem] = useState(() => new RealTimeTrackingSystem())
  const [activeVehicles, setActiveVehicles] = useState<Array<{ vehicleId: string, lastPoint: TrackingPoint }>>([])
  const [alerts, setAlerts] = useState<TrackingAlert[]>([])
  const [trackingStats, setTrackingStats] = useState<any>(null)
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null)
  const [isMapLoaded, setIsMapLoaded] = useState(false)

  useEffect(() => {
    setIsMapLoaded(true)
    
    // Subscribe to real-time updates
    trackingSystem.subscribe('tracking-page', (update) => {
      if (update.event === 'location_update') {
        loadTrackingData()
      } else if (update.event === 'alert') {
        setAlerts(prev => [update.data, ...prev.slice(0, 19)])
      }
    })

    // Initial data load
    loadTrackingData()

    // Refresh data every 30 seconds
    const interval = setInterval(loadTrackingData, 30000)

    return () => {
      clearInterval(interval)
      trackingSystem.unsubscribe('tracking-page')
    }
  }, [])

  const loadTrackingData = () => {
    setActiveVehicles(trackingSystem.getActiveVehicles())
    setAlerts(trackingSystem.getRecentAlerts(20))
    setTrackingStats(trackingSystem.getTrackingStats())
  }

  const handleAcknowledgeAlert = (alertId: string) => {
    trackingSystem.acknowledgeAlert(alertId)
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, acknowledged: true } : alert
    ))
  }

  const getAlertSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200'
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'geofence': return <MapPin className="h-4 w-4" />
      case 'speed': return <Zap className="h-4 w-4" />
      case 'fuel': return <Fuel className="h-4 w-4" />
      case 'maintenance': return <AlertTriangle className="h-4 w-4" />
      default: return <Bell className="h-4 w-4" />
    }
  }

  const getVehicleStatusColor = (status: string) => {
    switch (status) {
      case 'moving': return 'text-green-600'
      case 'stopped': return 'text-red-600'
      case 'idle': return 'text-yellow-600'
      case 'offline': return 'text-gray-600'
      default: return 'text-gray-600'
    }
  }

  if (!isMapLoaded) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-lg">{t('common.loading')}</span>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Activity className="mr-3 h-8 w-8 text-green-600" />
            {locale === 'vi' ? 'Theo dõi Thời gian Thực' : 'Real-Time Tracking'}
          </h1>
          <p className="text-gray-600 mt-2">
            {locale === 'vi' 
              ? 'Theo dõi vị trí xe tải và tài xế theo thời gian thực'
              : 'Track vehicle and driver locations in real-time'
            }
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse mr-2"></div>
            <span className="text-sm text-gray-600">
              {locale === 'vi' ? 'Trực tuyến' : 'Live'}
            </span>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      {trackingStats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Truck className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    {locale === 'vi' ? 'Xe đang hoạt động' : 'Active Vehicles'}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">{trackingStats.activeVehicles}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <AlertTriangle className="h-8 w-8 text-orange-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    {locale === 'vi' ? 'Cảnh báo chưa xử lý' : 'Unacknowledged Alerts'}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">{trackingStats.unacknowledgedAlerts}</p>
                  <p className="text-xs text-red-600">
                    {trackingStats.criticalAlerts} {locale === 'vi' ? 'khẩn cấp' : 'critical'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Navigation className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    {locale === 'vi' ? 'Tốc độ TB' : 'Avg Speed'}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {Math.round(trackingStats.averageSpeed)} km/h
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Fuel className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    {locale === 'vi' ? 'Nhiên liệu TB' : 'Avg Fuel'}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {Math.round(trackingStats.averageFuelLevel)}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map */}
        <div className="lg:col-span-2">
          <Card className="h-[600px]">
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="mr-2 h-5 w-5" />
                {locale === 'vi' ? 'Bản đồ Theo dõi' : 'Tracking Map'}
              </CardTitle>
            </CardHeader>
            <CardContent className="h-full p-0">
              <div className="h-full rounded-lg overflow-hidden">
                <MapContainer
                  center={[16.0544, 108.2022]}
                  zoom={6}
                  style={{ height: '100%', width: '100%' }}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  
                  {/* Vehicle Markers */}
                  {activeVehicles.map(({ vehicleId, lastPoint }) => (
                    <Marker
                      key={vehicleId}
                      position={[lastPoint.location.lat, lastPoint.location.lng]}
                      eventHandlers={{
                        click: () => setSelectedVehicle(vehicleId)
                      }}
                    >
                      <Popup>
                        <div className="p-2">
                          <h3 className="font-bold">{vehicleId}</h3>
                          <p className="text-sm">
                            {locale === 'vi' ? 'Trạng thái:' : 'Status:'} 
                            <span className={`ml-1 ${getVehicleStatusColor(lastPoint.status)}`}>
                              {lastPoint.status}
                            </span>
                          </p>
                          <p className="text-sm">
                            {locale === 'vi' ? 'Tốc độ:' : 'Speed:'} {Math.round(lastPoint.location.speed || 0)} km/h
                          </p>
                          <p className="text-sm">
                            {locale === 'vi' ? 'Nhiên liệu:' : 'Fuel:'} {Math.round(lastPoint.fuelLevel)}%
                          </p>
                          <p className="text-xs text-gray-500">
                            {locale === 'vi' ? 'Cập nhật:' : 'Updated:'} {lastPoint.timestamp.toLocaleTimeString()}
                          </p>
                        </div>
                      </Popup>
                    </Marker>
                  ))}

                  {/* Geofences */}
                  {trackingSystem.getGeofences().map(geofence => (
                    geofence.type === 'circular' && geofence.center && geofence.radius && (
                      <Circle
                        key={geofence.id}
                        center={[geofence.center.lat, geofence.center.lng]}
                        radius={geofence.radius}
                        pathOptions={{
                          color: 'blue',
                          fillColor: 'blue',
                          fillOpacity: 0.1
                        }}
                      >
                        <Popup>
                          <div className="p-2">
                            <h3 className="font-bold">{geofence.name}</h3>
                            <p className="text-sm">
                              {locale === 'vi' ? 'Bán kính:' : 'Radius:'} {geofence.radius}m
                            </p>
                          </div>
                        </Popup>
                      </Circle>
                    )
                  ))}
                </MapContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Active Vehicles */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Truck className="mr-2 h-5 w-5" />
                {locale === 'vi' ? 'Xe đang hoạt động' : 'Active Vehicles'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {activeVehicles.map(({ vehicleId, lastPoint }) => (
                  <div
                    key={vehicleId}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedVehicle === vehicleId 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedVehicle(vehicleId)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-900">{vehicleId}</h3>
                      <span className={`text-sm ${getVehicleStatusColor(lastPoint.status)}`}>
                        ●
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <div className="flex items-center">
                        <Navigation className="h-3 w-3 mr-1" />
                        {Math.round(lastPoint.location.speed || 0)} km/h
                      </div>
                      <div className="flex items-center">
                        <Fuel className="h-3 w-3 mr-1" />
                        {Math.round(lastPoint.fuelLevel)}%
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {lastPoint.timestamp.toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Alerts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="mr-2 h-5 w-5" />
                {locale === 'vi' ? 'Cảnh báo Gần đây' : 'Recent Alerts'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {alerts.slice(0, 10).map((alert) => (
                  <div
                    key={alert.id}
                    className={`p-3 rounded-lg border ${getAlertSeverityColor(alert.severity)} ${
                      alert.acknowledged ? 'opacity-60' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center">
                        {getAlertIcon(alert.type)}
                        <span className="ml-2 font-medium text-sm">
                          {alert.vehicleId}
                        </span>
                      </div>
                      {!alert.acknowledged && (
                        <button
                          onClick={() => handleAcknowledgeAlert(alert.id)}
                          className="text-xs text-blue-600 hover:text-blue-800"
                        >
                          <CheckCircle className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                    <p className="text-sm mb-2">{alert.message}</p>
                    <p className="text-xs text-gray-500">
                      {alert.timestamp.toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
