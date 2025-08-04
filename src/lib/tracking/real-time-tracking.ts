/**
 * Real-time Tracking System
 * GPS tracking, geofencing, and live updates
 */

export interface TrackingPoint {
  id: string
  vehicleId: string
  driverId: string
  location: {
    lat: number
    lng: number
    accuracy: number
    altitude?: number
    heading?: number
    speed?: number
  }
  timestamp: Date
  address?: string
  status: 'moving' | 'stopped' | 'idle' | 'offline'
  engineStatus: 'on' | 'off'
  fuelLevel: number
  temperature?: number
  odometer: number
}

export interface Geofence {
  id: string
  name: string
  type: 'circular' | 'polygon'
  center?: { lat: number, lng: number }
  radius?: number // meters
  coordinates?: Array<{ lat: number, lng: number }>
  alerts: {
    onEnter: boolean
    onExit: boolean
    onDwell: boolean
    dwellTime?: number // minutes
  }
  vehicles: string[] // vehicle IDs to monitor
}

export interface TrackingAlert {
  id: string
  type: 'geofence' | 'speed' | 'fuel' | 'maintenance' | 'panic' | 'route_deviation'
  severity: 'low' | 'medium' | 'high' | 'critical'
  vehicleId: string
  driverId?: string
  message: string
  timestamp: Date
  location: { lat: number, lng: number }
  acknowledged: boolean
  resolvedAt?: Date
}

export interface RouteProgress {
  tripId: string
  vehicleId: string
  totalDistance: number
  completedDistance: number
  remainingDistance: number
  progress: number // percentage
  estimatedArrival: Date
  delays: Array<{
    type: 'traffic' | 'weather' | 'mechanical' | 'other'
    duration: number // minutes
    reason: string
  }>
  nextWaypoint: {
    name: string
    eta: Date
    distance: number
  }
}

export interface TrackingUpdateData {
  event: string;
  data: any;
}

export class RealTimeTrackingSystem {
  private trackingPoints: Map<string, TrackingPoint[]> = new Map()
  private geofences: Map<string, Geofence> = new Map()
  private alerts: TrackingAlert[] = []
  private routeProgress: Map<string, RouteProgress> = new Map()
  private subscribers: Map<string, (data: any) => void> = new Map()

  constructor() {
    this.initializeGeofences()
    this.startSimulation()
  }

  /**
   * Initialize sample geofences
   */
  private initializeGeofences() {
    const sampleGeofences: Geofence[] = [
      {
        id: 'GF001',
        name: 'Ho Chi Minh City Port',
        type: 'circular',
        center: { lat: 10.7804, lng: 106.7634 },
        radius: 1000,
        alerts: {
          onEnter: true,
          onExit: true,
          onDwell: true,
          dwellTime: 30
        },
        vehicles: ['VH001', 'VH002']
      },
      {
        id: 'GF002',
        name: 'Hanoi Distribution Center',
        type: 'circular',
        center: { lat: 21.0285, lng: 105.8542 },
        radius: 500,
        alerts: {
          onEnter: true,
          onExit: true,
          onDwell: false
        },
        vehicles: ['VH001', 'VH002']
      },
      {
        id: 'GF003',
        name: 'Da Nang Logistics Hub',
        type: 'circular',
        center: { lat: 16.0544, lng: 108.2022 },
        radius: 800,
        alerts: {
          onEnter: true,
          onExit: true,
          onDwell: true,
          dwellTime: 45
        },
        vehicles: ['VH001', 'VH002']
      }
    ]

    sampleGeofences.forEach(geofence => {
      this.geofences.set(geofence.id, geofence)
    })
  }

  /**
   * Start real-time simulation
   */
  private startSimulation() {
    // Simulate vehicle movements every 30 seconds
    setInterval(() => {
      this.simulateVehicleMovements()
    }, 30000)

    // Check for alerts every 10 seconds
    setInterval(() => {
      this.checkAlerts()
    }, 10000)
  }

  /**
   * Simulate vehicle movements for demo
   */
  private simulateVehicleMovements() {
    const vehicles = ['VH001', 'VH002']
    
    vehicles.forEach(vehicleId => {
      const lastPoint = this.getLastTrackingPoint(vehicleId)
      const newPoint = this.generateNextTrackingPoint(vehicleId, lastPoint)
      
      this.addTrackingPoint(newPoint)
      this.notifySubscribers({ event: 'location_update', data: { vehicleId, point: newPoint } })
    })
  }

  /**
   * Generate next tracking point for simulation
   */
  private generateNextTrackingPoint(vehicleId: string, lastPoint?: TrackingPoint): TrackingPoint {
    const baseLocations = {
      'VH001': { lat: 10.8231, lng: 106.6297 },
      'VH002': { lat: 21.0285, lng: 105.8542 }
    }

    const base = baseLocations[vehicleId as keyof typeof baseLocations] || baseLocations['VH001']
    
    // Add some random movement
    const latOffset = (Math.random() - 0.5) * 0.01
    const lngOffset = (Math.random() - 0.5) * 0.01
    
    const newLat = lastPoint ? lastPoint.location.lat + latOffset : base.lat + latOffset
    const newLng = lastPoint ? lastPoint.location.lng + lngOffset : base.lng + lngOffset

    return {
      id: `TP${Date.now()}_${vehicleId}`,
      vehicleId,
      driverId: vehicleId === 'VH001' ? 'DR001' : 'DR002',
      location: {
        lat: newLat,
        lng: newLng,
        accuracy: Math.random() * 10 + 5,
        heading: Math.random() * 360,
        speed: Math.random() * 80 + 20
      },
      timestamp: new Date(),
      status: Math.random() > 0.8 ? 'stopped' : 'moving',
      engineStatus: 'on',
      fuelLevel: Math.max(20, Math.random() * 100),
      odometer: (lastPoint?.odometer || 45000) + Math.random() * 5
    }
  }

  /**
   * Add tracking point
   */
  addTrackingPoint(point: TrackingPoint) {
    if (!this.trackingPoints.has(point.vehicleId)) {
      this.trackingPoints.set(point.vehicleId, [])
    }
    
    const points = this.trackingPoints.get(point.vehicleId)!
    points.push(point)
    
    // Keep only last 100 points per vehicle
    if (points.length > 100) {
      points.shift()
    }
    
    this.trackingPoints.set(point.vehicleId, points)
  }

  /**
   * Get last tracking point for vehicle
   */
  getLastTrackingPoint(vehicleId: string): TrackingPoint | undefined {
    const points = this.trackingPoints.get(vehicleId)
    return points && points.length > 0 ? points[points.length - 1] : undefined
  }

  /**
   * Get tracking history for vehicle
   */
  getTrackingHistory(vehicleId: string, hours: number = 24): TrackingPoint[] {
    const points = this.trackingPoints.get(vehicleId) || []
    const cutoffTime = new Date(Date.now() - hours * 60 * 60 * 1000)
    
    return points.filter(point => point.timestamp >= cutoffTime)
  }

  /**
   * Get all active vehicles with their last known positions
   */
  getActiveVehicles(): Array<{ vehicleId: string, lastPoint: TrackingPoint }> {
    const activeVehicles: Array<{ vehicleId: string, lastPoint: TrackingPoint }> = []
    
    this.trackingPoints.forEach((points, vehicleId) => {
      if (points.length > 0) {
        const lastPoint = points[points.length - 1]
        const timeDiff = Date.now() - lastPoint.timestamp.getTime()
        
        // Consider vehicle active if last update was within 10 minutes
        if (timeDiff < 10 * 60 * 1000) {
          activeVehicles.push({ vehicleId, lastPoint })
        }
      }
    })
    
    return activeVehicles
  }

  /**
   * Check for geofence violations and other alerts
   */
  private checkAlerts() {
    const activeVehicles = this.getActiveVehicles()
    
    activeVehicles.forEach(({ vehicleId, lastPoint }) => {
      // Check geofence violations
      this.checkGeofenceAlerts(vehicleId, lastPoint)
      
      // Check speed violations
      this.checkSpeedAlerts(vehicleId, lastPoint)
      
      // Check fuel alerts
      this.checkFuelAlerts(vehicleId, lastPoint)
    })
  }

  /**
   * Check geofence alerts
   */
  private checkGeofenceAlerts(vehicleId: string, point: TrackingPoint) {
    this.geofences.forEach(geofence => {
      if (!geofence.vehicles.includes(vehicleId)) return
      
      const isInside = this.isPointInGeofence(point.location, geofence)
      const wasInside = this.wasVehicleInGeofence(vehicleId, geofence.id)
      
      if (isInside && !wasInside && geofence.alerts.onEnter) {
        this.createAlert({
          type: 'geofence',
          severity: 'medium',
          vehicleId,
          driverId: point.driverId,
          message: `Vehicle entered geofence: ${geofence.name}`,
          timestamp: new Date(),
          location: { lat: point.location.lat, lng: point.location.lng },
          acknowledged: false
        })
      } else if (!isInside && wasInside && geofence.alerts.onExit) {
        this.createAlert({
          type: 'geofence',
          severity: 'medium',
          vehicleId,
          driverId: point.driverId,
          message: `Vehicle exited geofence: ${geofence.name}`,
          timestamp: new Date(),
          location: { lat: point.location.lat, lng: point.location.lng },
          acknowledged: false
        })
      }
    })
  }

  /**
   * Check if point is inside geofence
   */
  private isPointInGeofence(location: { lat: number, lng: number }, geofence: Geofence): boolean {
    if (geofence.type === 'circular' && geofence.center && geofence.radius) {
      const distance = this.calculateDistance(location, geofence.center)
      return distance <= geofence.radius
    }
    
    // For polygon geofences, implement point-in-polygon algorithm
    // Simplified implementation for demo
    return false
  }

  /**
   * Calculate distance between two points in meters
   */
  private calculateDistance(point1: { lat: number, lng: number }, point2: { lat: number, lng: number }): number {
    const R = 6371000 // Earth's radius in meters
    const dLat = (point2.lat - point1.lat) * Math.PI / 180
    const dLng = (point2.lng - point1.lng) * Math.PI / 180
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(point1.lat * Math.PI / 180) * Math.cos(point2.lat * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    return R * c
  }

  /**
   * Check if vehicle was previously in geofence
   */
  private wasVehicleInGeofence(vehicleId: string, geofenceId: string): boolean {
    // Simplified check - in real implementation, track geofence states
    return false
  }

  /**
   * Check speed alerts
   */
  private checkSpeedAlerts(vehicleId: string, point: TrackingPoint) {
    const speedLimit = 80 // km/h
    
    if (point.location.speed && point.location.speed > speedLimit) {
      this.createAlert({
        type: 'speed',
        severity: 'high',
        vehicleId,
        driverId: point.driverId,
        message: `Speed violation: ${Math.round(point.location.speed)}km/h (limit: ${speedLimit}km/h)`,
        timestamp: new Date(),
        location: { lat: point.location.lat, lng: point.location.lng },
        acknowledged: false
      })
    }
  }

  /**
   * Check fuel alerts
   */
  private checkFuelAlerts(vehicleId: string, point: TrackingPoint) {
    if (point.fuelLevel < 20) {
      this.createAlert({
        type: 'fuel',
        severity: point.fuelLevel < 10 ? 'critical' : 'medium',
        vehicleId,
        driverId: point.driverId,
        message: `Low fuel level: ${Math.round(point.fuelLevel)}%`,
        timestamp: new Date(),
        location: { lat: point.location.lat, lng: point.location.lng },
        acknowledged: false
      })
    }
  }

  /**
   * Create alert
   */
  private createAlert(alertData: Omit<TrackingAlert, 'id'>) {
    const alert: TrackingAlert = {
      ...alertData,
      id: `ALERT${Date.now()}`
    }
    
    this.alerts.unshift(alert)
    
    // Keep only last 100 alerts
    if (this.alerts.length > 100) {
      this.alerts.pop()
    }
    
    this.notifySubscribers({ event: 'alert', data: alert })
  }

  /**
   * Get recent alerts
   */
  getRecentAlerts(limit: number = 20): TrackingAlert[] {
    return this.alerts.slice(0, limit)
  }

  /**
   * Get unacknowledged alerts
   */
  getUnacknowledgedAlerts(): TrackingAlert[] {
    return this.alerts.filter(alert => !alert.acknowledged)
  }

  /**
   * Acknowledge alert
   */
  acknowledgeAlert(alertId: string): boolean {
    const alert = this.alerts.find(a => a.id === alertId)
    if (alert) {
      alert.acknowledged = true
      return true
    }
    return false
  }

  /**
   * Subscribe to real-time updates
   */
  subscribe(id: string, callback: (data: TrackingUpdateData) => void) {
    this.subscribers.set(id, callback)
  }

  /**
   * Unsubscribe from updates
   */
  unsubscribe(id: string) {
    this.subscribers.delete(id)
  }

  /**
   * Notify subscribers
   */
  private notifySubscribers(updateData: TrackingUpdateData) {
    this.subscribers.forEach(callback => {
      callback(updateData)
    })
  }

  /**
   * Get geofences
   */
  getGeofences(): Geofence[] {
    return Array.from(this.geofences.values())
  }

  /**
   * Add geofence
   */
  addGeofence(geofence: Geofence) {
    this.geofences.set(geofence.id, geofence)
  }

  /**
   * Update route progress
   */
  updateRouteProgress(progress: RouteProgress) {
    this.routeProgress.set(progress.tripId, progress)
    this.notifySubscribers({ event: 'route_progress', data: progress })
  }

  /**
   * Get route progress
   */
  getRouteProgress(tripId: string): RouteProgress | undefined {
    return this.routeProgress.get(tripId)
  }

  /**
   * Get tracking statistics
   */
  getTrackingStats() {
    const activeVehicles = this.getActiveVehicles()
    const unacknowledgedAlerts = this.getUnacknowledgedAlerts()
    
    return {
      activeVehicles: activeVehicles.length,
      totalAlerts: this.alerts.length,
      unacknowledgedAlerts: unacknowledgedAlerts.length,
      criticalAlerts: unacknowledgedAlerts.filter(a => a.severity === 'critical').length,
      geofences: this.geofences.size,
      averageSpeed: activeVehicles.reduce((sum, v) => sum + (v.lastPoint.location.speed || 0), 0) / Math.max(activeVehicles.length, 1),
      averageFuelLevel: activeVehicles.reduce((sum, v) => sum + v.lastPoint.fuelLevel, 0) / Math.max(activeVehicles.length, 1)
    }
  }
}
