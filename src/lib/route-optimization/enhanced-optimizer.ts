/**
 * Enhanced Route Optimizer for Vietnamese Container Logistics
 * Supports 40ft containers with real-time traffic and restrictions
 */

export interface VietnamLocation {
  id: string
  name: string
  nameVi: string
  coordinates: { lat: number; lng: number }
  type: 'port' | 'depot' | 'industrial_zone' | 'city' | 'warehouse'
  containerCapacity?: {
    '20ft': number
    '40ft': number
    '45ft': number
  }
  operatingHours: {
    weekday: { open: string; close: string }
    weekend: { open: string; close: string }
  }
  restrictions: {
    containerTypes: string[]
    rushHourBan: boolean
    weightLimit: number
    heightLimit: number
  }
  facilities: string[]
  contactInfo?: {
    phone: string
    email: string
    address: string
  }
}

export interface TrafficCondition {
  routeSegment: string
  currentSpeed: number // km/h
  normalSpeed: number // km/h
  congestionLevel: 'low' | 'medium' | 'high' | 'severe'
  estimatedDelay: number // minutes
  lastUpdated: Date
}

export interface ContainerRestriction {
  containerType: '20ft' | '40ft' | '45ft'
  restrictedHours: Array<{ start: string; end: string }>
  allowedHours: Array<{ start: string; end: string }>
  restrictedRoads: string[]
  weightLimits: { max: number; unit: 'tons' }
  heightLimits: { max: number; unit: 'meters' }
  specialPermitRequired: boolean
}

export interface OptimizationRequest {
  departure: VietnamLocation
  destination: VietnamLocation
  emptyReturn?: VietnamLocation
  containerType: '20ft' | '40ft' | '45ft'
  cargoWeight: number // tons
  departureTime: Date
  priority: 'cost' | 'time' | 'fuel' | 'balanced'
  avoidTolls: boolean
  avoidRushHour: boolean
  includeEmptyReturn: boolean
  driverBreakRequirements: boolean
}

export interface OptimizedRoute {
  id: string
  request: OptimizationRequest
  waypoints: Array<{
    location: VietnamLocation
    arrivalTime: Date
    departureTime: Date
    stopDuration: number // minutes
    purpose: 'departure' | 'destination' | 'depot' | 'rest' | 'fuel' | 'empty_return'
    notes: string[]
  }>
  metrics: {
    totalDistance: number // km
    totalTime: number // minutes
    fuelConsumption: number // liters
    fuelCost: number // VND
    tollCosts: number // VND
    totalCost: number // VND
    co2Emissions: number // kg
  }
  savings: {
    distanceVsOriginal: number // km
    timeVsOriginal: number // minutes
    costVsOriginal: number // VND
    fuelVsOriginal: number // liters
  }
  trafficAnalysis: {
    currentConditions: TrafficCondition[]
    rushHourImpact: number // percentage
    recommendedDepartureTime: Date
    alternativeRoutes: number
  }
  restrictions: {
    containerRestrictions: ContainerRestriction
    violatedRestrictions: string[]
    requiredPermits: string[]
    warnings: string[]
  }
  confidence: number // 0-100
  lastUpdated: Date
}

// Comprehensive Vietnam locations database
export const VIETNAM_LOCATIONS: VietnamLocation[] = [
  // Major Ports
  {
    id: 'port_hcm_cat_lai',
    name: 'Cat Lai Port',
    nameVi: 'Cảng Cát Lái',
    coordinates: { lat: 10.7769, lng: 106.7634 },
    type: 'port',
    containerCapacity: { '20ft': 5000, '40ft': 3000, '45ft': 500 },
    operatingHours: {
      weekday: { open: '00:00', close: '23:59' },
      weekend: { open: '00:00', close: '23:59' }
    },
    restrictions: {
      containerTypes: ['20ft', '40ft', '45ft'],
      rushHourBan: false,
      weightLimit: 80,
      heightLimit: 4.2
    },
    facilities: ['Container Terminal', 'Customs', 'Warehouse', 'Fuel Station'],
    contactInfo: {
      phone: '+84-28-3742-3456',
      email: 'info@catlaiport.com.vn',
      address: 'Đường Đồng Văn Cống, Quận 2, TP.HCM'
    }
  },
  {
    id: 'port_hai_phong',
    name: 'Hai Phong Port',
    nameVi: 'Cảng Hải Phòng',
    coordinates: { lat: 20.8449, lng: 106.6881 },
    type: 'port',
    containerCapacity: { '20ft': 3000, '40ft': 2000, '45ft': 300 },
    operatingHours: {
      weekday: { open: '06:00', close: '22:00' },
      weekend: { open: '08:00', close: '18:00' }
    },
    restrictions: {
      containerTypes: ['20ft', '40ft', '45ft'],
      rushHourBan: true,
      weightLimit: 75,
      heightLimit: 4.0
    },
    facilities: ['Container Terminal', 'Customs', 'Cold Storage', 'Rail Connection'],
    contactInfo: {
      phone: '+84-225-3842-1234',
      email: 'info@haiphongport.vn',
      address: 'Đường Hoàng Quốc Việt, Hải Phòng'
    }
  },

  // Major Depots/Warehouses
  {
    id: 'depot_hcm_binh_duong',
    name: 'Binh Duong Logistics Center',
    nameVi: 'Trung tâm Logistics Bình Dương',
    coordinates: { lat: 10.9804, lng: 106.6519 },
    type: 'depot',
    containerCapacity: { '20ft': 2000, '40ft': 1500, '45ft': 200 },
    operatingHours: {
      weekday: { open: '06:00', close: '22:00' },
      weekend: { open: '08:00', close: '18:00' }
    },
    restrictions: {
      containerTypes: ['20ft', '40ft', '45ft'],
      rushHourBan: true,
      weightLimit: 80,
      heightLimit: 4.2
    },
    facilities: ['Container Storage', 'Maintenance', 'Fuel Station', 'Driver Rest Area'],
    contactInfo: {
      phone: '+84-274-3876-5432',
      email: 'info@binhduonglogistics.vn',
      address: 'KCN Việt Nam Singapore, Bình Dương'
    }
  },
  {
    id: 'depot_hanoi_long_bien',
    name: 'Long Bien Logistics Hub',
    nameVi: 'Trung tâm Logistics Long Biên',
    coordinates: { lat: 21.0435, lng: 105.8842 },
    type: 'depot',
    containerCapacity: { '20ft': 1500, '40ft': 1000, '45ft': 150 },
    operatingHours: {
      weekday: { open: '06:00', close: '22:00' },
      weekend: { open: '08:00', close: '18:00' }
    },
    restrictions: {
      containerTypes: ['20ft', '40ft', '45ft'],
      rushHourBan: true,
      weightLimit: 75,
      heightLimit: 4.0
    },
    facilities: ['Container Storage', 'Customs Clearance', 'Truck Parking', 'Cafeteria'],
    contactInfo: {
      phone: '+84-24-3876-9876',
      email: 'info@longbienlogistics.vn',
      address: 'Quận Long Biên, Hà Nội'
    }
  },

  // Industrial Zones
  {
    id: 'iz_dong_nai_nhon_trach',
    name: 'Nhon Trach Industrial Zone',
    nameVi: 'Khu Công Nghiệp Nhơn Trạch',
    coordinates: { lat: 10.7500, lng: 106.8500 },
    type: 'industrial_zone',
    containerCapacity: { '20ft': 800, '40ft': 600, '45ft': 100 },
    operatingHours: {
      weekday: { open: '06:00', close: '22:00' },
      weekend: { open: '08:00', close: '17:00' }
    },
    restrictions: {
      containerTypes: ['20ft', '40ft', '45ft'],
      rushHourBan: true,
      weightLimit: 80,
      heightLimit: 4.2
    },
    facilities: ['Manufacturing', 'Warehouse', 'Loading Dock', 'Security'],
    contactInfo: {
      phone: '+84-251-3567-8901',
      email: 'info@nhontrach-iz.vn',
      address: 'Huyện Nhơn Trạch, Đồng Nai'
    }
  },

  // Major Cities
  {
    id: 'city_ho_chi_minh',
    name: 'Ho Chi Minh City',
    nameVi: 'Thành phố Hồ Chí Minh',
    coordinates: { lat: 10.8231, lng: 106.6297 },
    type: 'city',
    containerCapacity: { '20ft': 10000, '40ft': 8000, '45ft': 1000 },
    operatingHours: {
      weekday: { open: '00:00', close: '23:59' },
      weekend: { open: '00:00', close: '23:59' }
    },
    restrictions: {
      containerTypes: ['20ft', '40ft', '45ft'],
      rushHourBan: true,
      weightLimit: 80,
      heightLimit: 4.2
    },
    facilities: ['Multiple Depots', 'Customs', 'Banks', 'Logistics Services'],
    contactInfo: {
      phone: '+84-28-1900-1234',
      email: 'info@hcmc-logistics.gov.vn',
      address: 'TP. Hồ Chí Minh'
    }
  },
  {
    id: 'city_hanoi',
    name: 'Hanoi',
    nameVi: 'Hà Nội',
    coordinates: { lat: 21.0285, lng: 105.8542 },
    type: 'city',
    containerCapacity: { '20ft': 8000, '40ft': 6000, '45ft': 800 },
    operatingHours: {
      weekday: { open: '00:00', close: '23:59' },
      weekend: { open: '00:00', close: '23:59' }
    },
    restrictions: {
      containerTypes: ['20ft', '40ft', '45ft'],
      rushHourBan: true,
      weightLimit: 75,
      heightLimit: 4.0
    },
    facilities: ['Multiple Depots', 'Government Offices', 'Banks', 'Logistics Services'],
    contactInfo: {
      phone: '+84-24-1900-5678',
      email: 'info@hanoi-logistics.gov.vn',
      address: 'Hà Nội'
    }
  },
  {
    id: 'city_da_nang',
    name: 'Da Nang',
    nameVi: 'Đà Nẵng',
    coordinates: { lat: 16.0544, lng: 108.2022 },
    type: 'city',
    containerCapacity: { '20ft': 3000, '40ft': 2500, '45ft': 400 },
    operatingHours: {
      weekday: { open: '00:00', close: '23:59' },
      weekend: { open: '00:00', close: '23:59' }
    },
    restrictions: {
      containerTypes: ['20ft', '40ft', '45ft'],
      rushHourBan: true,
      weightLimit: 75,
      heightLimit: 4.0
    },
    facilities: ['Port Access', 'Airport Cargo', 'Logistics Services', 'Tourism'],
    contactInfo: {
      phone: '+84-236-1900-9012',
      email: 'info@danang-logistics.gov.vn',
      address: 'Đà Nẵng'
    }
  },
  {
    id: 'city_can_tho',
    name: 'Can Tho',
    nameVi: 'Cần Thơ',
    coordinates: { lat: 10.0452, lng: 105.7469 },
    type: 'city',
    containerCapacity: { '20ft': 2000, '40ft': 1500, '45ft': 200 },
    operatingHours: {
      weekday: { open: '00:00', close: '23:59' },
      weekend: { open: '00:00', close: '23:59' }
    },
    restrictions: {
      containerTypes: ['20ft', '40ft', '45ft'],
      rushHourBan: false,
      weightLimit: 80,
      heightLimit: 4.2
    },
    facilities: ['River Port', 'Agricultural Processing', 'Logistics Services'],
    contactInfo: {
      phone: '+84-292-1900-3456',
      email: 'info@cantho-logistics.gov.vn',
      address: 'Cần Thơ'
    }
  }
]

// Container restrictions for Vietnam
export const CONTAINER_RESTRICTIONS: { [key: string]: ContainerRestriction } = {
  '20ft': {
    containerType: '20ft',
    restrictedHours: [],
    allowedHours: [{ start: '00:00', end: '23:59' }],
    restrictedRoads: [],
    weightLimits: { max: 30, unit: 'tons' },
    heightLimits: { max: 4.0, unit: 'meters' },
    specialPermitRequired: false
  },
  '40ft': {
    containerType: '40ft',
    restrictedHours: [
      { start: '06:00', end: '22:00' } // Restricted during day in major cities
    ],
    allowedHours: [
      { start: '22:00', end: '06:00' } // Allowed at night
    ],
    restrictedRoads: [
      'Inner city roads in HCMC',
      'Central Hanoi roads',
      'Airport access roads during peak hours'
    ],
    weightLimits: { max: 80, unit: 'tons' },
    heightLimits: { max: 4.2, unit: 'meters' },
    specialPermitRequired: true
  },
  '45ft': {
    containerType: '45ft',
    restrictedHours: [
      { start: '06:00', end: '22:00' }
    ],
    allowedHours: [
      { start: '22:00', end: '06:00' }
    ],
    restrictedRoads: [
      'Inner city roads in HCMC',
      'Central Hanoi roads',
      'Most urban areas',
      'Narrow bridges and tunnels'
    ],
    weightLimits: { max: 85, unit: 'tons' },
    heightLimits: { max: 4.2, unit: 'meters' },
    specialPermitRequired: true
  }
}
export class EnhancedRouteOptimizer {
  private static readonly FUEL_PRICE_VND_PER_LITER = 25000
  private static readonly AVERAGE_FUEL_EFFICIENCY = 3.5 // km per liter for container trucks
  private static readonly AVERAGE_SPEED_HIGHWAY = 80 // km/h
  private static readonly AVERAGE_SPEED_CITY = 40 // km/h
  private static readonly DRIVER_BREAK_INTERVAL = 240 // minutes (4 hours)
  private static readonly DRIVER_BREAK_DURATION = 30 // minutes

  static async optimizeRoute(request: OptimizationRequest): Promise<OptimizedRoute> {
    try {
      // Validate request
      this.validateRequest(request)

      // Get container restrictions
      const containerRestriction = CONTAINER_RESTRICTIONS[request.containerType]

      // Find optimal waypoints including depots
      const waypoints = await this.findOptimalWaypoints(request)

      // Calculate route metrics
      const metrics = this.calculateRouteMetrics(waypoints, request)

      // Analyze traffic conditions
      const trafficAnalysis = await this.analyzeTrafficConditions(waypoints, request.departureTime)

      // Calculate savings vs direct route
      const savings = this.calculateSavings(waypoints, request)

      // Check restrictions and generate warnings
      const restrictions = this.checkRestrictions(waypoints, request, containerRestriction)

      // Calculate confidence score
      const confidence = this.calculateConfidence(waypoints, trafficAnalysis, restrictions)

      return {
        id: `route_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        request,
        waypoints,
        metrics,
        savings,
        trafficAnalysis,
        restrictions,
        confidence,
        lastUpdated: new Date()
      }
    } catch (error) {
      console.error('Route optimization error:', error)
      throw new Error(`Route optimization failed: ${error}`)
    }
  }

  private static validateRequest(request: OptimizationRequest): void {
    if (!request.departure || !request.destination) {
      throw new Error('Departure and destination are required')
    }
    if (request.cargoWeight <= 0) {
      throw new Error('Cargo weight must be positive')
    }
    if (!['20ft', '40ft', '45ft'].includes(request.containerType)) {
      throw new Error('Invalid container type')
    }
  }

  private static async findOptimalWaypoints(request: OptimizationRequest): Promise<OptimizedRoute['waypoints']> {
    const waypoints: OptimizedRoute['waypoints'] = []
    let currentTime = new Date(request.departureTime)

    // Add departure point
    waypoints.push({
      location: request.departure,
      arrivalTime: currentTime,
      departureTime: currentTime,
      stopDuration: 30, // 30 minutes for loading
      purpose: 'departure',
      notes: ['Container loading', 'Document check', 'Vehicle inspection']
    })

    // Find optimal depot if needed
    const optimalDepot = this.findOptimalDepot(request.departure, request.destination, request.containerType)
    
    if (optimalDepot && this.shouldUseDepot(request.departure, request.destination, optimalDepot)) {
      const travelTimeToDepot = this.calculateTravelTime(request.departure, optimalDepot, request.departureTime)
      currentTime = new Date(currentTime.getTime() + travelTimeToDepot * 60000)

      waypoints.push({
        location: optimalDepot,
        arrivalTime: currentTime,
        departureTime: new Date(currentTime.getTime() + 45 * 60000), // 45 minutes stop
        stopDuration: 45,
        purpose: 'depot',
        notes: ['Fuel refill', 'Driver rest', 'Route optimization', 'Traffic update']
      })

      currentTime = new Date(currentTime.getTime() + 45 * 60000)
    }

    // Add driver break if needed
    const totalTravelTime = this.calculateTotalTravelTime(waypoints, request.destination)
    if (totalTravelTime > this.DRIVER_BREAK_INTERVAL) {
      const breakLocation = this.findBreakLocation(waypoints[waypoints.length - 1].location, request.destination)
      if (breakLocation) {
        const travelTimeToBreak = this.calculateTravelTime(waypoints[waypoints.length - 1].location, breakLocation, currentTime)
        currentTime = new Date(currentTime.getTime() + travelTimeToBreak * 60000)

        waypoints.push({
          location: breakLocation,
          arrivalTime: currentTime,
          departureTime: new Date(currentTime.getTime() + this.DRIVER_BREAK_DURATION * 60000),
          stopDuration: this.DRIVER_BREAK_DURATION,
          purpose: 'rest',
          notes: ['Mandatory driver break', 'Meal', 'Vehicle check']
        })

        currentTime = new Date(currentTime.getTime() + this.DRIVER_BREAK_DURATION * 60000)
      }
    }

    // Add destination
    const travelTimeToDestination = this.calculateTravelTime(
      waypoints[waypoints.length - 1].location, 
      request.destination, 
      currentTime
    )
    currentTime = new Date(currentTime.getTime() + travelTimeToDestination * 60000)

    waypoints.push({
      location: request.destination,
      arrivalTime: currentTime,
      departureTime: new Date(currentTime.getTime() + 60 * 60000), // 1 hour for unloading
      stopDuration: 60,
      purpose: 'destination',
      notes: ['Container unloading', 'Delivery confirmation', 'Document handover']
    })

    // Add empty return if specified
    if (request.includeEmptyReturn && request.emptyReturn) {
      currentTime = new Date(currentTime.getTime() + 60 * 60000)
      const travelTimeToEmpty = this.calculateTravelTime(request.destination, request.emptyReturn, currentTime)
      currentTime = new Date(currentTime.getTime() + travelTimeToEmpty * 60000)

      waypoints.push({
        location: request.emptyReturn,
        arrivalTime: currentTime,
        departureTime: new Date(currentTime.getTime() + 30 * 60000),
        stopDuration: 30,
        purpose: 'empty_return',
        notes: ['Empty container return', 'Container inspection', 'Documentation']
      })
    }

    return waypoints
  }

  private static findOptimalDepot(departure: VietnamLocation, destination: VietnamLocation, containerType: string): VietnamLocation | null {
    const depots = VIETNAM_LOCATIONS.filter(loc => 
      loc.type === 'depot' && 
      loc.restrictions.containerTypes.includes(containerType)
    )

    if (depots.length === 0) return null

    // Find depot that minimizes total distance
    let optimalDepot = depots[0]
    let minTotalDistance = Infinity

    for (const depot of depots) {
      const distanceToDepot = this.calculateDistance(departure.coordinates, depot.coordinates)
      const distanceFromDepot = this.calculateDistance(depot.coordinates, destination.coordinates)
      const totalDistance = distanceToDepot + distanceFromDepot

      if (totalDistance < minTotalDistance) {
        minTotalDistance = totalDistance
        optimalDepot = depot
      }
    }

    return optimalDepot
  }

  private static shouldUseDepot(departure: VietnamLocation, destination: VietnamLocation, depot: VietnamLocation): boolean {
    const directDistance = this.calculateDistance(departure.coordinates, destination.coordinates)
    const viaDepotDistance = 
      this.calculateDistance(departure.coordinates, depot.coordinates) +
      this.calculateDistance(depot.coordinates, destination.coordinates)

    // Use depot if it's not more than 20% longer and provides benefits
    return viaDepotDistance <= directDistance * 1.2 && directDistance > 200 // Only for long routes
  }

  private static findBreakLocation(from: VietnamLocation, to: VietnamLocation): VietnamLocation | null {
    const midpoint = {
      lat: (from.coordinates.lat + to.coordinates.lat) / 2,
      lng: (from.coordinates.lng + to.coordinates.lng) / 2
    }

    // Find nearest rest area or depot
    const restLocations = VIETNAM_LOCATIONS.filter(loc => 
      loc.type === 'depot' || loc.facilities.includes('Driver Rest Area')
    )

    let nearestLocation = restLocations[0]
    let minDistance = Infinity

    for (const location of restLocations) {
      const distance = this.calculateDistance(midpoint, location.coordinates)
      if (distance < minDistance) {
        minDistance = distance
        nearestLocation = location
      }
    }

    return nearestLocation || null
  }

  private static calculateDistance(point1: { lat: number; lng: number }, point2: { lat: number; lng: number }): number {
    const R = 6371 // Earth's radius in kilometers
    const dLat = this.toRadians(point2.lat - point1.lat)
    const dLng = this.toRadians(point2.lng - point1.lng)
    
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(point1.lat)) * Math.cos(this.toRadians(point2.lat)) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2)
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }

  private static toRadians(degrees: number): number {
    return degrees * (Math.PI / 180)
  }

  private static calculateTravelTime(from: VietnamLocation, to: VietnamLocation, departureTime: Date): number {
    const distance = this.calculateDistance(from.coordinates, to.coordinates)
    const hour = departureTime.getHours()
    
    // Adjust speed based on time and location type
    let avgSpeed = this.AVERAGE_SPEED_HIGHWAY
    
    if (from.type === 'city' || to.type === 'city') {
      avgSpeed = this.AVERAGE_SPEED_CITY
    }
    
    // Rush hour adjustment
    if ((hour >= 7 && hour <= 9) || (hour >= 17 && hour <= 19)) {
      avgSpeed *= 0.7 // 30% slower during rush hour
    }
    
    return (distance / avgSpeed) * 60 // Return minutes
  }

  private static calculateTotalTravelTime(waypoints: OptimizedRoute['waypoints'], destination: VietnamLocation): number {
    if (waypoints.length === 0) return 0
    
    const lastWaypoint = waypoints[waypoints.length - 1]
    const additionalTime = this.calculateTravelTime(lastWaypoint.location, destination, lastWaypoint.departureTime)
    
    const totalTime = waypoints.reduce((total, waypoint, index) => {
      if (index === 0) return waypoint.stopDuration
      
      const prevWaypoint = waypoints[index - 1]
      const travelTime = this.calculateTravelTime(prevWaypoint.location, waypoint.location, prevWaypoint.departureTime)
      return total + travelTime + waypoint.stopDuration
    }, 0)
    
    return totalTime + additionalTime
  }

  private static calculateRouteMetrics(waypoints: OptimizedRoute['waypoints'], request: OptimizationRequest): OptimizedRoute['metrics'] {
    let totalDistance = 0
    let totalTime = 0
    
    for (let i = 0; i < waypoints.length - 1; i++) {
      const distance = this.calculateDistance(waypoints[i].location.coordinates, waypoints[i + 1].location.coordinates)
      const travelTime = this.calculateTravelTime(waypoints[i].location, waypoints[i + 1].location, waypoints[i].departureTime)
      
      totalDistance += distance
      totalTime += travelTime + waypoints[i].stopDuration
    }
    
    // Add final stop duration
    if (waypoints.length > 0) {
      totalTime += waypoints[waypoints.length - 1].stopDuration
    }
    
    const fuelConsumption = totalDistance / this.AVERAGE_FUEL_EFFICIENCY
    const fuelCost = fuelConsumption * this.FUEL_PRICE_VND_PER_LITER
    const tollCosts = this.calculateTollCosts(totalDistance, request.avoidTolls)
    const totalCost = fuelCost + tollCosts
    const co2Emissions = fuelConsumption * 2.68 // kg CO2 per liter of diesel
    
    return {
      totalDistance: Math.round(totalDistance * 100) / 100,
      totalTime: Math.round(totalTime),
      fuelConsumption: Math.round(fuelConsumption * 100) / 100,
      fuelCost: Math.round(fuelCost),
      tollCosts: Math.round(tollCosts),
      totalCost: Math.round(totalCost),
      co2Emissions: Math.round(co2Emissions * 100) / 100
    }
  }

  private static calculateTollCosts(distance: number, avoidTolls: boolean): number {
    if (avoidTolls) return 0
    
    // Estimate toll costs based on distance (average 500 VND per km on highways)
    return distance * 500
  }

  private static async analyzeTrafficConditions(waypoints: OptimizedRoute['waypoints'], departureTime: Date): Promise<OptimizedRoute['trafficAnalysis']> {
    // Simulate traffic analysis (in real implementation, this would call traffic APIs)
    const currentConditions: TrafficCondition[] = []
    
    for (let i = 0; i < waypoints.length - 1; i++) {
      const segment = `${waypoints[i].location.nameVi} → ${waypoints[i + 1].location.nameVi}`
      const hour = departureTime.getHours()
      
      let congestionLevel: TrafficCondition['congestionLevel'] = 'low'
      let speedReduction = 1.0
      
      if ((hour >= 7 && hour <= 9) || (hour >= 17 && hour <= 19)) {
        congestionLevel = 'high'
        speedReduction = 0.6
      } else if ((hour >= 6 && hour <= 10) || (hour >= 16 && hour <= 20)) {
        congestionLevel = 'medium'
        speedReduction = 0.8
      }
      
      currentConditions.push({
        routeSegment: segment,
        currentSpeed: this.AVERAGE_SPEED_HIGHWAY * speedReduction,
        normalSpeed: this.AVERAGE_SPEED_HIGHWAY,
        congestionLevel,
        estimatedDelay: congestionLevel === 'high' ? 30 : congestionLevel === 'medium' ? 15 : 0,
        lastUpdated: new Date()
      })
    }
    
    const rushHourImpact = currentConditions.reduce((total, condition) => {
      return total + (condition.estimatedDelay / currentConditions.length)
    }, 0)
    
    // Recommend optimal departure time (avoid rush hours for 40ft containers)
    let recommendedDepartureTime = new Date(departureTime)
    if (departureTime.getHours() >= 6 && departureTime.getHours() <= 22) {
      recommendedDepartureTime.setHours(22, 0, 0, 0) // Recommend 10 PM departure
    }
    
    return {
      currentConditions,
      rushHourImpact,
      recommendedDepartureTime,
      alternativeRoutes: 2 // Number of alternative routes available
    }
  }

  private static calculateSavings(waypoints: OptimizedRoute['waypoints'], request: OptimizationRequest): OptimizedRoute['savings'] {
    // Calculate direct route metrics for comparison
    const directDistance = this.calculateDistance(request.departure.coordinates, request.destination.coordinates)
    const directTime = this.calculateTravelTime(request.departure, request.destination, request.departureTime)
    const directFuel = directDistance / this.AVERAGE_FUEL_EFFICIENCY
    const directCost = directFuel * this.FUEL_PRICE_VND_PER_LITER
    
    // Get optimized route metrics
    const optimizedDistance = waypoints.reduce((total, waypoint, index) => {
      if (index === 0) return 0
      return total + this.calculateDistance(waypoints[index - 1].location.coordinates, waypoint.location.coordinates)
    }, 0)
    
    const optimizedTime = waypoints.reduce((total, waypoint) => total + waypoint.stopDuration, 0) +
      waypoints.reduce((total, waypoint, index) => {
        if (index === 0) return 0
        return total + this.calculateTravelTime(waypoints[index - 1].location, waypoint.location, waypoints[index - 1].departureTime)
      }, 0)
    
    const optimizedFuel = optimizedDistance / this.AVERAGE_FUEL_EFFICIENCY
    const optimizedCost = optimizedFuel * this.FUEL_PRICE_VND_PER_LITER
    
    return {
      distanceVsOriginal: Math.round((directDistance - optimizedDistance) * 100) / 100,
      timeVsOriginal: Math.round(directTime - optimizedTime),
      costVsOriginal: Math.round(directCost - optimizedCost),
      fuelVsOriginal: Math.round((directFuel - optimizedFuel) * 100) / 100
    }
  }

  private static checkRestrictions(waypoints: OptimizedRoute['waypoints'], request: OptimizationRequest, containerRestriction: ContainerRestriction): OptimizedRoute['restrictions'] {
    const violatedRestrictions: string[] = []
    const requiredPermits: string[] = []
    const warnings: string[] = []
    
    // Check time restrictions
    for (const waypoint of waypoints) {
      const hour = waypoint.departureTime.getHours()
      const timeString = waypoint.departureTime.toTimeString().slice(0, 5)
      
      const isRestricted = containerRestriction.restrictedHours.some(restriction => {
        const startHour = parseInt(restriction.start.split(':')[0])
        const endHour = parseInt(restriction.end.split(':')[0])
        return hour >= startHour && hour < endHour
      })
      
      if (isRestricted && waypoint.location.type === 'city') {
        violatedRestrictions.push(`Container ${request.containerType} restricted in ${waypoint.location.nameVi} at ${timeString}`)
        warnings.push(`Consider departing after 22:00 to avoid restrictions`)
      }
    }
    
    // Check weight restrictions
    if (request.cargoWeight > containerRestriction.weightLimits.max) {
      violatedRestrictions.push(`Cargo weight ${request.cargoWeight}T exceeds limit ${containerRestriction.weightLimits.max}T`)
      requiredPermits.push('Overweight permit required')
    }
    
    // Check special permits
    if (containerRestriction.specialPermitRequired) {
      requiredPermits.push(`Special permit required for ${request.containerType} container`)
    }
    
    // Add general warnings
    if (request.containerType === '40ft') {
      warnings.push('40ft containers restricted 06:00-22:00 in major cities')
      warnings.push('Plan departure after 22:00 for optimal routing')
    }
    
    return {
      containerRestrictions: containerRestriction,
      violatedRestrictions,
      requiredPermits,
      warnings
    }
  }

  private static calculateConfidence(waypoints: OptimizedRoute['waypoints'], trafficAnalysis: OptimizedRoute['trafficAnalysis'], restrictions: OptimizedRoute['restrictions']): number {
    let confidence = 100
    
    // Reduce confidence for traffic issues
    if (trafficAnalysis.rushHourImpact > 20) {
      confidence -= 20
    } else if (trafficAnalysis.rushHourImpact > 10) {
      confidence -= 10
    }
    
    // Reduce confidence for restriction violations
    confidence -= restrictions.violatedRestrictions.length * 15
    confidence -= restrictions.warnings.length * 5
    
    // Reduce confidence for complex routes
    if (waypoints.length > 4) {
      confidence -= 10
    }
    
    return Math.max(confidence, 0)
  }

  // Utility method to get location by ID
  static getLocationById(id: string): VietnamLocation | null {
    return VIETNAM_LOCATIONS.find(loc => loc.id === id) || null
  }

  // Utility method to search locations
  static searchLocations(query: string): VietnamLocation[] {
    const lowerQuery = query.toLowerCase()
    return VIETNAM_LOCATIONS.filter(loc => 
      loc.name.toLowerCase().includes(lowerQuery) ||
      loc.nameVi.toLowerCase().includes(lowerQuery) ||
      loc.type.toLowerCase().includes(lowerQuery)
    )
  }

  // Utility method to get locations by type
  static getLocationsByType(type: VietnamLocation['type']): VietnamLocation[] {
    return VIETNAM_LOCATIONS.filter(loc => loc.type === type)
  }
}
