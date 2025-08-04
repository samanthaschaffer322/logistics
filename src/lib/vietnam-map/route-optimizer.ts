/**
 * AI Route Optimization Engine for 40ft Container Trucks in Vietnam
 * Finds optimal routes considering traffic, costs, and container restrictions
 */

import { vietnamLocations, vietnamRoutes, VietnamLocation, VietnamRoute } from './data'

export interface RouteOptimizationRequest {
  departure: string // location ID
  destination: string // location ID
  containerType: '20ft' | '40ft' | '45ft'
  cargoWeight: number // tons
  priority: 'cost' | 'time' | 'fuel' | 'balanced'
  avoidTolls: boolean
  avoidRushHour: boolean
  departureTime?: Date
}

export interface OptimizedRoute {
  id: string
  waypoints: RouteWaypoint[]
  totalDistance: number
  totalDuration: number // minutes
  totalCost: number // VND
  fuelCost: number
  tollCost: number
  confidence: number // 0-1
  warnings: string[]
  recommendations: string[]
  alternativeRoutes: OptimizedRoute[]
}

export interface RouteWaypoint {
  location: VietnamLocation
  arrivalTime: Date
  departureTime: Date
  stopDuration: number // minutes
  services: string[]
  notes: string
}

interface RouteResult {
  path: string[];
  totalDistance: number;
  totalDuration: number;
  totalCost: number;
  fuelCost: number;
  tollCost: number;
  viaDepot?: string;
}

export class VietnamRouteOptimizer {
  private locations: Map<string, VietnamLocation>
  private routes: Map<string, VietnamRoute[]>

  constructor() {
    this.locations = new Map()
    this.routes = new Map()
    
    // Index locations
    vietnamLocations.forEach(location => {
      this.locations.set(location.id, location)
    })
    
    // Index routes by origin
    vietnamRoutes.forEach(route => {
      if (!this.routes.has(route.from)) {
        this.routes.set(route.from, [])
      }
      this.routes.get(route.from)!.push(route)
    })
  }

  /**
   * Find optimal route for 40ft container truck
   */
  async optimizeRoute(request: RouteOptimizationRequest): Promise<OptimizedRoute> {
    const departure = this.locations.get(request.departure)
    const destination = this.locations.get(request.destination)

    if (!departure || !destination) {
      throw new Error('Invalid departure or destination location')
    }

    // Validate 40ft container access
    if (!departure.truckAccess40ft || !destination.truckAccess40ft) {
      throw new Error('40ft container truck access not available at specified locations')
    }

    // Find all possible routes using Dijkstra's algorithm
    const allRoutes = this.findAllRoutes(request.departure, request.destination, request)
    
    // Score and rank routes based on priority
    const scoredRoutes = allRoutes.map(route => ({
      ...route,
      score: this.calculateRouteScore(route, request)
    }))

    // Sort by score (higher is better)
    scoredRoutes.sort((a, b) => b.score - a.score)

    const bestRoute = scoredRoutes[0]
    const alternatives = scoredRoutes.slice(1, 4) // Top 3 alternatives

    // Add AI insights and recommendations
    const optimizedRoute: OptimizedRoute = {
      id: `route_${Date.now()}`,
      waypoints: await this.generateWaypoints(bestRoute, request),
      totalDistance: bestRoute.totalDistance,
      totalDuration: bestRoute.totalDuration,
      totalCost: bestRoute.totalCost,
      fuelCost: bestRoute.fuelCost,
      tollCost: bestRoute.tollCost,
      confidence: this.calculateConfidence(bestRoute, request),
      warnings: this.generateWarnings(bestRoute, request),
      recommendations: this.generateRecommendations(bestRoute, request),
      alternativeRoutes: alternatives.map(alt => ({
        id: `alt_${Date.now()}_${Math.random()}`,
        waypoints: [],
        totalDistance: alt.totalDistance,
        totalDuration: alt.totalDuration,
        totalCost: alt.totalCost,
        fuelCost: alt.fuelCost,
        tollCost: alt.tollCost,
        confidence: this.calculateConfidence(alt, request),
        warnings: [],
        recommendations: [],
        alternativeRoutes: []
      }))
    }

    return optimizedRoute
  }

  /**
   * Find all possible routes between two points
   */
  private findAllRoutes(from: string, to: string, request: RouteOptimizationRequest): RouteResult[] {
    const visited = new Set<string>()
    const routes: any[] = []

    const dfs = (current: string, path: string[], distance: number, duration: number, cost: number) => {
      if (current === to) {
        routes.push({
          path: [...path, current],
          totalDistance: distance,
          totalDuration: duration,
          totalCost: cost,
          fuelCost: cost * 0.7, // Estimate 70% fuel, 30% other costs
          tollCost: cost * 0.3
        })
        return
      }

      if (visited.has(current) || path.length > 5) return // Prevent cycles and limit depth

      visited.add(current)
      const availableRoutes = this.routes.get(current) || []

      for (const route of availableRoutes) {
        if (!this.isRouteValid(route, request)) continue

        const routeCost = this.calculateRouteCost(route, request)
        dfs(
          route.to,
          [...path, current],
          distance + route.distance,
          duration + route.duration,
          cost + routeCost
        )
      }

      visited.delete(current)
    }

    dfs(from, [], 0, 0, 0)

    // If no direct routes found, try with intermediate depots
    if (routes.length === 0) {
      return this.findRoutesWithDepots(from, to, request)
    }

    return routes
  }

  /**
   * Find routes through intermediate depots
   */
  private findRoutesWithDepots(from: string, to: string, request: RouteOptimizationRequest): RouteResult[] {
    const depots = vietnamLocations.filter(loc => 
      loc.type === 'depot' && 
      loc.truckAccess40ft &&
      loc.id !== from && 
      loc.id !== to
    )

    const routes: any[] = []

    for (const depot of depots) {
      const firstLeg = this.findDirectRoute(from, depot.id, request)
      const secondLeg = this.findDirectRoute(depot.id, to, request)

      if (firstLeg && secondLeg) {
        routes.push({
          path: [from, depot.id, to],
          totalDistance: firstLeg.distance + secondLeg.distance,
          totalDuration: firstLeg.duration + secondLeg.duration + 60, // 1 hour depot stop
          totalCost: firstLeg.cost + secondLeg.cost + 200000, // Depot handling fee
          fuelCost: (firstLeg.cost + secondLeg.cost) * 0.7,
          tollCost: (firstLeg.cost + secondLeg.cost) * 0.3,
          viaDepot: depot.id
        })
      }
    }

    return routes
  }

  /**
   * Find direct route between two locations
   */
  private findDirectRoute(from: string, to: string, request: RouteOptimizationRequest): { distance: number, duration: number, cost: number } | null {
    const route = vietnamRoutes.find(r => r.from === from && r.to === to)
    if (!route || !this.isRouteValid(route, request)) return null

    return {
      distance: route.distance,
      duration: route.duration,
      cost: this.calculateRouteCost(route, request)
    }
  }

  /**
   * Check if route is valid for 40ft container
   */
  private isRouteValid(route: VietnamRoute, request: RouteOptimizationRequest): boolean {
    // Check container restrictions
    if (request.containerType === '40ft' && route.truckRestrictions.includes('no_40ft')) {
      return false
    }

    // Check toll avoidance
    if (request.avoidTolls && route.tollCost > 0) {
      return false
    }

    // Check rush hour avoidance
    if (request.avoidRushHour && route.truckRestrictions.includes('rush_hour_restrictions')) {
      const departureHour = request.departureTime?.getHours() || 8
      if ((departureHour >= 7 && departureHour <= 9) || (departureHour >= 17 && departureHour <= 19)) {
        return false
      }
    }

    return true
  }

  /**
   * Calculate route cost based on distance, fuel, tolls, and cargo weight
   */
  private calculateRouteCost(route: VietnamRoute, request: RouteOptimizationRequest): number {
    const baseCost = route.fuelCost + route.tollCost

    // Weight factor (heavier cargo = more fuel)
    const weightFactor = 1 + (request.cargoWeight / 30) * 0.2 // Max 20% increase for 30-ton cargo

    // Road type factor
    const roadTypeFactor = route.roadType === 'highway' ? 1.0 : 
                          route.roadType === 'national' ? 1.1 : 1.3

    return Math.round(baseCost * weightFactor * roadTypeFactor)
  }

  /**
   * Calculate route score based on priority
   */
  private calculateRouteScore(route: RouteResult, request: RouteOptimizationRequest): number {
    const normalizedDistance = route.totalDistance / 2000 // Normalize to 0-1 (max 2000km)
    const normalizedDuration = route.totalDuration / 1440 // Normalize to 0-1 (max 24 hours)
    const normalizedCost = route.totalCost / 5000000 // Normalize to 0-1 (max 5M VND)

    switch (request.priority) {
      case 'cost':
        return (1 - normalizedCost) * 0.7 + (1 - normalizedDistance) * 0.2 + (1 - normalizedDuration) * 0.1
      case 'time':
        return (1 - normalizedDuration) * 0.7 + (1 - normalizedDistance) * 0.2 + (1 - normalizedCost) * 0.1
      case 'fuel':
        return (1 - normalizedDistance) * 0.6 + (1 - normalizedCost) * 0.3 + (1 - normalizedDuration) * 0.1
      case 'balanced':
      default:
        return (1 - normalizedCost) * 0.33 + (1 - normalizedDuration) * 0.33 + (1 - normalizedDistance) * 0.34
    }
  }

  /**
   * Generate waypoints with timing and services
   */
  private async generateWaypoints(route: RouteResult, request: RouteOptimizationRequest): Promise<RouteWaypoint[]> {
    const waypoints: RouteWaypoint[] = []
    const departureTime = request.departureTime || new Date()

    let currentTime = new Date(departureTime)

    for (let i = 0; i < route.path.length; i++) {
      const locationId = route.path[i]
      const location = this.locations.get(locationId)!
      
      const isFirst = i === 0
      const isLast = i === route.path.length - 1
      
      // Calculate stop duration
      let stopDuration = 0
      if (!isFirst && !isLast) {
        stopDuration = location.type === 'depot' ? 60 : 30 // 1 hour for depot, 30 min for others
      }

      // Determine available services
      const services = this.getAvailableServices(location, request)
      
      // Generate notes
      const notes = this.generateLocationNotes(location, request)

      waypoints.push({
        location,
        arrivalTime: new Date(currentTime),
        departureTime: new Date(currentTime.getTime() + stopDuration * 60000),
        stopDuration,
        services,
        notes
      })

      // Add travel time to next location
      if (i < route.path.length - 1) {
        const nextLocationId = route.path[i + 1]
        const routeSegment = vietnamRoutes.find(r => r.from === locationId && r.to === nextLocationId)
        if (routeSegment) {
          currentTime = new Date(currentTime.getTime() + (routeSegment.duration + stopDuration) * 60000)
        }
      }
    }

    return waypoints
  }

  /**
   * Get available services at location
   */
  private getAvailableServices(location: VietnamLocation, request: RouteOptimizationRequest): string[] {
    const services: string[] = []
    
    if (location.facilities.includes('fuel_station')) services.push('Refueling')
    if (location.facilities.includes('customs')) services.push('Customs clearance')
    if (location.facilities.includes('warehouse')) services.push('Cargo handling')
    if (location.facilities.includes('repair_shop')) services.push('Maintenance')
    if (location.facilities.includes('container_yard')) services.push('Container services')
    
    return services
  }

  /**
   * Generate location-specific notes
   */
  private generateLocationNotes(location: VietnamLocation, request: RouteOptimizationRequest): string {
    const notes: string[] = []
    
    if (location.type === 'port') {
      notes.push('Port facility - allow extra time for customs')
    }
    if (location.type === 'depot') {
      notes.push('Logistics depot - container handling available')
    }
    if (!location.truckAccess40ft) {
      notes.push('WARNING: 40ft container access may be restricted')
    }
    if (location.facilities.includes('repair_shop')) {
      notes.push('Maintenance services available')
    }
    
    return notes.join('. ')
  }

  /**
   * Calculate confidence score for route
   */
  private calculateConfidence(route: RouteResult, request: RouteOptimizationRequest): number {
    let confidence = 0.8 // Base confidence
    
    // Reduce confidence for longer routes
    if (route.totalDistance > 1000) confidence -= 0.1
    if (route.totalDistance > 1500) confidence -= 0.1
    
    // Reduce confidence for routes with many waypoints
    if (route.path.length > 3) confidence -= 0.1
    
    // Increase confidence for highway routes
    if (route.path.length === 2) confidence += 0.1 // Direct route
    
    return Math.max(0.5, Math.min(1.0, confidence))
  }

  /**
   * Generate warnings for route
   */
  private generateWarnings(route: RouteResult, request: RouteOptimizationRequest): string[] {
    const warnings: string[] = []
    
    if (route.totalDistance > 1500) {
      warnings.push('Long distance route - consider driver rest requirements')
    }
    
    if (route.totalDuration > 720) { // 12 hours
      warnings.push('Extended driving time - mandatory rest stops required')
    }
    
    if (route.viaDepot) {
      warnings.push('Route includes depot stop - verify container handling availability')
    }
    
    if (request.cargoWeight > 25) {
      warnings.push('Heavy cargo - check bridge and road weight limits')
    }
    
    return warnings
  }

  /**
   * Generate AI recommendations
   */
  private generateRecommendations(route: RouteResult, request: RouteOptimizationRequest): string[] {
    const recommendations: string[] = []
    
    if (request.priority === 'cost' && route.tollCost > route.fuelCost * 0.5) {
      recommendations.push('Consider alternative routes to reduce toll costs')
    }
    
    if (request.priority === 'time' && route.totalDuration > 480) {
      recommendations.push('Consider splitting journey with overnight rest for safety')
    }
    
    if (route.totalDistance > 1000) {
      recommendations.push('Schedule fuel stops every 400-500km for optimal efficiency')
    }
    
    recommendations.push('Monitor traffic conditions and weather forecasts before departure')
    recommendations.push('Ensure all documentation is prepared for customs checkpoints')
    
    return recommendations
  }

  /**
   * Find nearest depot to a location
   */
  findNearestDepot(locationId: string): VietnamLocation | null {
    const location = this.locations.get(locationId)
    if (!location) return null

    const depots = vietnamLocations.filter(loc => 
      loc.type === 'depot' && 
      loc.truckAccess40ft &&
      loc.id !== locationId
    )

    if (depots.length === 0) return null

    // Simple distance calculation (Haversine formula would be more accurate)
    let nearestDepot = depots[0]
    let minDistance = this.calculateDistance(location, nearestDepot)

    for (const depot of depots.slice(1)) {
      const distance = this.calculateDistance(location, depot)
      if (distance < minDistance) {
        minDistance = distance
        nearestDepot = depot
      }
    }

    return nearestDepot
  }

  /**
   * Calculate approximate distance between two locations
   */
  private calculateDistance(loc1: VietnamLocation, loc2: VietnamLocation): number {
    const R = 6371 // Earth's radius in km
    const dLat = (loc2.lat - loc1.lat) * Math.PI / 180
    const dLng = (loc2.lng - loc1.lng) * Math.PI / 180
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(loc1.lat * Math.PI / 180) * Math.cos(loc2.lat * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    return R * c
  }
}
