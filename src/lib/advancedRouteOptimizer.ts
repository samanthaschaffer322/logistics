// Advanced Route Optimizer with Vietnamese Logistics Support
import axios from 'axios'

export interface RoutePoint {
  id: string
  name: string
  address: string
  lat: number
  lng: number
  type: 'origin' | 'destination' | 'waypoint' | 'depot'
  priority?: number
  timeWindow?: {
    start: string
    end: string
  }
}

export interface TruckSpecs {
  type: '20ft' | '40ft' | 'container_truck'
  weight_kg: number
  length_m: number
  width_m: number
  height_m: number
  fuel_consumption_l_per_100km: number
  max_speed_kmh: number
  cost_per_km: number
}

export interface RouteOptimizationRequest {
  origin: RoutePoint
  destination: RoutePoint
  waypoints?: RoutePoint[]
  truck_specs: TruckSpecs
  departure_time: string
  avoid_tolls?: boolean
  avoid_highways?: boolean
  optimize_for?: 'time' | 'distance' | 'cost' | 'fuel'
}

export interface RouteSegment {
  from: RoutePoint
  to: RoutePoint
  distance_km: number
  duration_minutes: number
  fuel_consumption_l: number
  cost_vnd: number
  instructions: string[]
  traffic_conditions: 'light' | 'moderate' | 'heavy'
  restrictions: string[]
}

export interface OptimizedRoute {
  id: string
  segments: RouteSegment[]
  total_distance_km: number
  total_duration_minutes: number
  total_fuel_consumption_l: number
  total_cost_vnd: number
  total_co2_emission_kg: number
  efficiency_score: number
  route_polyline: string
  alternative_routes?: OptimizedRoute[]
  warnings: string[]
  recommendations: string[]
  traffic_analysis: {
    current_conditions: 'light' | 'moderate' | 'heavy'
    predicted_conditions: 'light' | 'moderate' | 'heavy'
    rush_hour_impact: boolean
    delay_minutes: number
    best_departure_times: string[]
  }
  cost_breakdown: {
    fuel_cost: number
    toll_cost: number
    driver_cost: number
    maintenance_cost: number
    total_cost: number
  }
}

// Vietnam-specific truck specifications
export const VIETNAM_TRUCK_SPECS: Record<string, TruckSpecs> = {
  '20ft': {
    type: '20ft',
    weight_kg: 24000,
    length_m: 6.1,
    width_m: 2.44,
    height_m: 2.59,
    fuel_consumption_l_per_100km: 28,
    max_speed_kmh: 80,
    cost_per_km: 18000 // VND per km
  },
  '40ft': {
    type: '40ft',
    weight_kg: 32000,
    length_m: 12.2,
    width_m: 2.44,
    height_m: 2.59,
    fuel_consumption_l_per_100km: 35,
    max_speed_kmh: 80,
    cost_per_km: 22000 // VND per km
  },
  'container_truck': {
    type: 'container_truck',
    weight_kg: 35000,
    length_m: 16.5,
    width_m: 2.5,
    height_m: 4.0,
    fuel_consumption_l_per_100km: 40,
    max_speed_kmh: 70,
    cost_per_km: 25000 // VND per km
  }
}

// Vietnam road restrictions and regulations
export const VIETNAM_ROAD_RESTRICTIONS = {
  cities: {
    'ho_chi_minh': {
      name: 'Ho Chi Minh City',
      center: { lat: 10.8231, lng: 106.6297 },
      radius_km: 30,
      truck_ban_hours: [
        { start: '06:00', end: '09:00', days: ['mon', 'tue', 'wed', 'thu', 'fri'] },
        { start: '16:00', end: '20:00', days: ['mon', 'tue', 'wed', 'thu', 'fri'] }
      ],
      weight_limits: {
        inner_city: 10000,
        ring_roads: 32000,
        highways: 40000
      },
      designated_routes: [
        'Ring Road 2', 'Ring Road 3', 'Highway 1A', 'Vo Van Kiet Boulevard'
      ]
    },
    'hanoi': {
      name: 'Hanoi',
      center: { lat: 21.0285, lng: 105.8542 },
      radius_km: 25,
      truck_ban_hours: [
        { start: '06:00', end: '09:00', days: ['mon', 'tue', 'wed', 'thu', 'fri'] },
        { start: '15:00', end: '21:00', days: ['mon', 'tue', 'wed', 'thu', 'fri'] }
      ],
      weight_limits: {
        inner_city: 8000,
        ring_roads: 32000,
        highways: 40000
      },
      designated_routes: [
        'Ring Road 3', 'Ring Road 4', 'Highway 5', 'Thang Long Boulevard'
      ]
    },
    'da_nang': {
      name: 'Da Nang',
      center: { lat: 16.0544, lng: 108.2022 },
      radius_km: 15,
      truck_ban_hours: [
        { start: '07:00', end: '09:00', days: ['mon', 'tue', 'wed', 'thu', 'fri'] },
        { start: '17:00', end: '19:00', days: ['mon', 'tue', 'wed', 'thu', 'fri'] }
      ],
      weight_limits: {
        inner_city: 15000,
        ring_roads: 32000,
        highways: 40000
      },
      designated_routes: [
        'Vo Nguyen Giap', 'Nguyen Tat Thanh', 'Highway 1A'
      ]
    }
  },
  highways: {
    'highway_1a': {
      name: 'Highway 1A',
      toll_rate_vnd_per_km: 2500,
      speed_limit_kmh: 90,
      truck_restrictions: {
        max_weight_kg: 40000,
        max_height_m: 4.5,
        banned_hours: []
      }
    },
    'ho_chi_minh_highway': {
      name: 'Ho Chi Minh Highway',
      toll_rate_vnd_per_km: 3000,
      speed_limit_kmh: 100,
      truck_restrictions: {
        max_weight_kg: 40000,
        max_height_m: 4.5,
        banned_hours: []
      }
    }
  }
}

// Vietnam fuel and cost constants
export const VIETNAM_LOGISTICS_COSTS = {
  fuel_price_vnd_per_liter: 26500,
  co2_factor_kg_per_liter: 2.68,
  driver_cost_vnd_per_hour: 50000,
  maintenance_cost_vnd_per_km: 2000,
  toll_average_vnd_per_km: 2500
}

export class AdvancedRouteOptimizer {
  private apiKey: string | null = null

  constructor(apiKey?: string) {
    this.apiKey = apiKey || null
  }

  async optimizeRoute(request: RouteOptimizationRequest): Promise<OptimizedRoute> {
    try {
      // Validate request
      this.validateRequest(request)

      // Check Vietnam-specific restrictions
      const restrictions = this.checkVietnameseRestrictions(request)

      // Calculate route using multiple methods
      const route = await this.calculateOptimalRoute(request)

      // Apply traffic analysis
      const trafficAnalysis = await this.analyzeTraffic(request, route)

      // Calculate detailed costs
      const costBreakdown = this.calculateDetailedCosts(route, request.truck_specs)

      // Generate recommendations
      const recommendations = this.generateRecommendations(request, route, restrictions)

      // Calculate efficiency score
      const efficiencyScore = this.calculateEfficiencyScore(route, request)

      return {
        id: `route_${Date.now()}`,
        segments: route.segments,
        total_distance_km: route.total_distance_km,
        total_duration_minutes: route.total_duration_minutes + trafficAnalysis.delay_minutes,
        total_fuel_consumption_l: route.total_fuel_consumption_l,
        total_cost_vnd: costBreakdown.total_cost,
        total_co2_emission_kg: route.total_fuel_consumption_l * VIETNAM_LOGISTICS_COSTS.co2_factor_kg_per_liter,
        efficiency_score: efficiencyScore,
        route_polyline: route.route_polyline,
        warnings: restrictions.warnings,
        recommendations,
        traffic_analysis: trafficAnalysis,
        cost_breakdown: costBreakdown
      }
    } catch (error) {
      throw new Error(`Route optimization failed: ${error}`)
    }
  }

  private validateRequest(request: RouteOptimizationRequest): void {
    if (!request.origin || !request.destination) {
      throw new Error('Origin and destination are required')
    }

    if (!request.truck_specs) {
      throw new Error('Truck specifications are required')
    }

    if (!request.departure_time) {
      throw new Error('Departure time is required')
    }

    // Validate coordinates
    if (Math.abs(request.origin.lat) > 90 || Math.abs(request.origin.lng) > 180) {
      throw new Error('Invalid origin coordinates')
    }

    if (Math.abs(request.destination.lat) > 90 || Math.abs(request.destination.lng) > 180) {
      throw new Error('Invalid destination coordinates')
    }
  }

  private checkVietnameseRestrictions(request: RouteOptimizationRequest): {
    violations: string[]
    warnings: string[]
    alternativeTimes: string[]
  } {
    const violations: string[] = []
    const warnings: string[] = []
    const alternativeTimes: string[] = []

    const departureTime = new Date(request.departure_time)
    const hour = departureTime.getHours()
    const dayOfWeek = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'][departureTime.getDay()]

    // Check each major city for restrictions
    Object.values(VIETNAM_ROAD_RESTRICTIONS.cities).forEach(city => {
      const originDistance = this.calculateDistance(
        request.origin.lat, request.origin.lng,
        city.center.lat, city.center.lng
      )
      const destDistance = this.calculateDistance(
        request.destination.lat, request.destination.lng,
        city.center.lat, city.center.lng
      )

      // Check if route passes through this city
      if (originDistance <= city.radius_km || destDistance <= city.radius_km) {
        // Check time restrictions
        city.truck_ban_hours.forEach(banPeriod => {
          if (banPeriod.days.includes(dayOfWeek)) {
            const startHour = parseInt(banPeriod.start.split(':')[0])
            const endHour = parseInt(banPeriod.end.split(':')[0])

            if (hour >= startHour && hour <= endHour) {
              violations.push(`${request.truck_specs.type} trucks banned in ${city.name} from ${banPeriod.start} to ${banPeriod.end}`)
            }
          }
        })

        // Check weight restrictions
        if (request.truck_specs.weight_kg > city.weight_limits.inner_city) {
          warnings.push(`Truck weight (${request.truck_specs.weight_kg}kg) exceeds ${city.name} inner city limit (${city.weight_limits.inner_city}kg). Use designated truck routes.`)
        }
      }
    })

    // Generate alternative times if violations exist
    if (violations.length > 0) {
      alternativeTimes.push('05:30', '09:30', '14:00', '21:30')
    }

    return { violations, warnings, alternativeTimes }
  }

  private async calculateOptimalRoute(request: RouteOptimizationRequest): Promise<{
    segments: RouteSegment[]
    total_distance_km: number
    total_duration_minutes: number
    total_fuel_consumption_l: number
    route_polyline: string
  }> {
    // For now, use direct calculation. In production, integrate with Google Maps API or similar
    const segments: RouteSegment[] = []
    let totalDistance = 0
    let totalDuration = 0
    let totalFuelConsumption = 0

    // Create route segments
    const points = [request.origin, ...(request.waypoints || []), request.destination]
    
    for (let i = 0; i < points.length - 1; i++) {
      const from = points[i]
      const to = points[i + 1]
      
      const distance = this.calculateDistance(from.lat, from.lng, to.lat, to.lng)
      const duration = this.calculateDuration(distance, request.truck_specs)
      const fuelConsumption = (distance * request.truck_specs.fuel_consumption_l_per_100km) / 100
      const cost = distance * request.truck_specs.cost_per_km

      const segment: RouteSegment = {
        from,
        to,
        distance_km: distance,
        duration_minutes: duration,
        fuel_consumption_l: fuelConsumption,
        cost_vnd: cost,
        instructions: this.generateInstructions(from, to, distance),
        traffic_conditions: this.estimateTrafficConditions(from, to, request.departure_time),
        restrictions: this.getSegmentRestrictions(from, to, request.truck_specs)
      }

      segments.push(segment)
      totalDistance += distance
      totalDuration += duration
      totalFuelConsumption += fuelConsumption
    }

    return {
      segments,
      total_distance_km: totalDistance,
      total_duration_minutes: totalDuration,
      total_fuel_consumption_l: totalFuelConsumption,
      route_polyline: this.generatePolyline(points)
    }
  }

  private calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371 // Earth's radius in kilometers
    const dLat = this.toRadians(lat2 - lat1)
    const dLng = this.toRadians(lng2 - lng1)
    
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) *
              Math.sin(dLng / 2) * Math.sin(dLng / 2)
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }

  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180)
  }

  private calculateDuration(distance: number, truckSpecs: TruckSpecs): number {
    // Average speed in Vietnam considering traffic, road conditions, and truck limitations
    const averageSpeed = Math.min(truckSpecs.max_speed_kmh * 0.7, 45) // 70% of max speed or 45 km/h, whichever is lower
    return (distance / averageSpeed) * 60 // Convert to minutes
  }

  private generateInstructions(from: RoutePoint, to: RoutePoint, distance: number): string[] {
    const bearing = this.calculateBearing(from.lat, from.lng, to.lat, to.lng)
    const direction = this.getDirection(bearing)
    
    return [
      `Head ${direction} from ${from.name}`,
      `Continue for ${distance.toFixed(1)} km`,
      `Arrive at ${to.name}`
    ]
  }

  private calculateBearing(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const dLng = this.toRadians(lng2 - lng1)
    const lat1Rad = this.toRadians(lat1)
    const lat2Rad = this.toRadians(lat2)
    
    const y = Math.sin(dLng) * Math.cos(lat2Rad)
    const x = Math.cos(lat1Rad) * Math.sin(lat2Rad) - Math.sin(lat1Rad) * Math.cos(lat2Rad) * Math.cos(dLng)
    
    return (Math.atan2(y, x) * 180 / Math.PI + 360) % 360
  }

  private getDirection(bearing: number): string {
    const directions = ['north', 'northeast', 'east', 'southeast', 'south', 'southwest', 'west', 'northwest']
    const index = Math.round(bearing / 45) % 8
    return directions[index]
  }

  private estimateTrafficConditions(from: RoutePoint, to: RoutePoint, departureTime: string): 'light' | 'moderate' | 'heavy' {
    const hour = new Date(departureTime).getHours()
    
    // Check if route passes through major cities during rush hours
    const isRushHour = (hour >= 6 && hour <= 9) || (hour >= 16 && hour <= 20)
    const passesThroughCity = this.checkIfPassesThroughMajorCity(from, to)
    
    if (isRushHour && passesThroughCity) {
      return 'heavy'
    } else if (isRushHour || passesThroughCity) {
      return 'moderate'
    } else {
      return 'light'
    }
  }

  private checkIfPassesThroughMajorCity(from: RoutePoint, to: RoutePoint): boolean {
    const majorCities = Object.values(VIETNAM_ROAD_RESTRICTIONS.cities)
    
    return majorCities.some(city => {
      const fromDistance = this.calculateDistance(from.lat, from.lng, city.center.lat, city.center.lng)
      const toDistance = this.calculateDistance(to.lat, to.lng, city.center.lat, city.center.lng)
      return fromDistance <= city.radius_km || toDistance <= city.radius_km
    })
  }

  private getSegmentRestrictions(from: RoutePoint, to: RoutePoint, truckSpecs: TruckSpecs): string[] {
    const restrictions: string[] = []
    
    // Check weight restrictions
    Object.values(VIETNAM_ROAD_RESTRICTIONS.cities).forEach(city => {
      const fromDistance = this.calculateDistance(from.lat, from.lng, city.center.lat, city.center.lng)
      const toDistance = this.calculateDistance(to.lat, to.lng, city.center.lat, city.center.lng)
      
      if (fromDistance <= city.radius_km || toDistance <= city.radius_km) {
        if (truckSpecs.weight_kg > city.weight_limits.inner_city) {
          restrictions.push(`Use designated truck routes in ${city.name}`)
        }
      }
    })
    
    return restrictions
  }

  private generatePolyline(points: RoutePoint[]): string {
    // Simplified polyline generation - in production, use proper encoding
    return points.map(p => `${p.lat},${p.lng}`).join('|')
  }

  private async analyzeTraffic(request: RouteOptimizationRequest, route: any): Promise<{
    current_conditions: 'light' | 'moderate' | 'heavy'
    predicted_conditions: 'light' | 'moderate' | 'heavy'
    rush_hour_impact: boolean
    delay_minutes: number
    best_departure_times: string[]
  }> {
    const departureTime = new Date(request.departure_time)
    const hour = departureTime.getHours()
    
    const isRushHour = (hour >= 6 && hour <= 9) || (hour >= 16 && hour <= 20)
    const passesThroughCity = this.checkIfPassesThroughMajorCity(request.origin, request.destination)
    
    let currentConditions: 'light' | 'moderate' | 'heavy' = 'light'
    let delayMinutes = 0
    
    if (isRushHour && passesThroughCity) {
      currentConditions = 'heavy'
      delayMinutes = Math.round(route.total_duration_minutes * 0.6) // 60% delay
    } else if (isRushHour || passesThroughCity) {
      currentConditions = 'moderate'
      delayMinutes = Math.round(route.total_duration_minutes * 0.3) // 30% delay
    }
    
    return {
      current_conditions: currentConditions,
      predicted_conditions: currentConditions,
      rush_hour_impact: isRushHour,
      delay_minutes: delayMinutes,
      best_departure_times: ['05:30', '09:30', '14:00', '21:30']
    }
  }

  private calculateDetailedCosts(route: any, truckSpecs: TruckSpecs): {
    fuel_cost: number
    toll_cost: number
    driver_cost: number
    maintenance_cost: number
    total_cost: number
  } {
    const fuelCost = route.total_fuel_consumption_l * VIETNAM_LOGISTICS_COSTS.fuel_price_vnd_per_liter
    const tollCost = route.total_distance_km * VIETNAM_LOGISTICS_COSTS.toll_average_vnd_per_km
    const driverCost = (route.total_duration_minutes / 60) * VIETNAM_LOGISTICS_COSTS.driver_cost_vnd_per_hour
    const maintenanceCost = route.total_distance_km * VIETNAM_LOGISTICS_COSTS.maintenance_cost_vnd_per_km
    
    return {
      fuel_cost: Math.round(fuelCost),
      toll_cost: Math.round(tollCost),
      driver_cost: Math.round(driverCost),
      maintenance_cost: Math.round(maintenanceCost),
      total_cost: Math.round(fuelCost + tollCost + driverCost + maintenanceCost)
    }
  }

  private generateRecommendations(request: RouteOptimizationRequest, route: any, restrictions: any): string[] {
    const recommendations: string[] = []
    
    if (restrictions.violations.length > 0) {
      recommendations.push('Consider departing at a different time to avoid truck restrictions')
    }
    
    if (route.total_distance_km > 500) {
      recommendations.push('Long distance route - consider overnight rest stops for driver safety')
    }
    
    if (route.total_fuel_consumption_l > 100) {
      recommendations.push('High fuel consumption - consider route optimization or load reduction')
    }
    
    const hour = new Date(request.departure_time).getHours()
    if (hour >= 6 && hour <= 9) {
      recommendations.push('Departing during morning rush hour - expect significant delays')
    }
    
    return recommendations
  }

  private calculateEfficiencyScore(route: any, request: RouteOptimizationRequest): number {
    // Calculate efficiency based on distance, fuel consumption, and time
    const directDistance = this.calculateDistance(
      request.origin.lat, request.origin.lng,
      request.destination.lat, request.destination.lng
    )
    
    const distanceEfficiency = (directDistance / route.total_distance_km) * 100
    const fuelEfficiency = Math.max(0, 100 - (route.total_fuel_consumption_l / route.total_distance_km * 10))
    const timeEfficiency = Math.max(0, 100 - (route.total_duration_minutes / (route.total_distance_km * 1.5)))
    
    return Math.round((distanceEfficiency + fuelEfficiency + timeEfficiency) / 3)
  }
}

// Export singleton instance
export const advancedRouteOptimizer = new AdvancedRouteOptimizer()
