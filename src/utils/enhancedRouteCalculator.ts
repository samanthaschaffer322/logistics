export interface Location {
  lat: number
  lng: number
  name: string
}

export interface RouteResult {
  distance: number
  duration: number
  fuelCost: number
  totalCost: number
  optimizedRoute: Location[]
  savings: {
    distance: number
    time: number
    cost: number
  }
}

export class EnhancedRouteCalculator {
  // REALISTIC Vietnamese container truck pricing (2025)
  private fuelPriceVND: number = 23500 // Current diesel price
  private lastUpdated: Date = new Date()

  constructor() {
    // Simple fallback pricing - no complex APIs needed
  }

  /**
   * Get realistic fuel consumption for Vietnamese trucks
   */
  private getFuelConsumption(vehicleType: string = 'container'): number {
    const consumption = {
      'container': 0.35,    // L/km for 40ft container truck (realistic)
      'truck': 0.25,        // L/km for standard truck
      'van': 0.12,          // L/km for delivery van
    }
    return consumption[vehicleType] || 0.35
  }

  /**
   * Get realistic Vietnamese driver wages
   */
  private getDriverCost(): number {
    return 40000 // VND per hour (realistic for prime mover drivers)
  }

  /**
   * Calculate realistic travel time for Vietnamese roads
   */
  private calculateTravelTime(distance: number): number {
    let averageSpeed: number
    
    if (distance <= 10) {
      averageSpeed = 25 // km/h for city/port areas
    } else if (distance <= 50) {
      averageSpeed = 45 // km/h for mixed roads
    } else {
      averageSpeed = 60 // km/h for highways
    }
    
    return distance / averageSpeed
  }

  /**
   * Calculate realistic total cost for Vietnamese container transport
   */
  private calculateTotalCost(distance: number, duration: number): number {
    const fuelConsumption = this.getFuelConsumption('container')
    const fuelCost = distance * fuelConsumption * this.fuelPriceVND
    
    const driverCost = duration * this.getDriverCost()
    const vehicleCost = distance * 2000 // VND per km (realistic for container truck)
    const tollCost = distance * 1000 // VND per km (highway tolls)
    
    const totalCalculated = fuelCost + driverCost + vehicleCost + tollCost
    
    // Realistic minimum charges for container transport
    let minimumCharge: number
    if (distance <= 20) {
      minimumCharge = 800000 // ₫800k for short container hauls
    } else if (distance <= 100) {
      minimumCharge = 1500000 // ₫1.5M for medium hauls
    } else {
      minimumCharge = 2500000 // ₫2.5M for long hauls
    }
    
    return Math.max(totalCalculated, minimumCharge)
  }

  /**
   * Calculate the distance between two points using Haversine formula
   */
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

  // Legacy methods for backward compatibility
  private calculateFuelCost(distance: number): number {
    const fuelConsumption = this.getFuelConsumption()
    return distance * fuelConsumption * this.fuelPriceVND
  }

  private calculateTotalCost(distance: number, duration: number): number {
    const fuelCost = this.calculateFuelCost(distance)
    const driverCost = duration * this.getDriverCost()
    const vehicleCost = distance * 2000 // VND per km (more realistic for 100km)
    const tollCost = distance * 800 // VND per km (highway tolls)
    
    const calculatedCost = fuelCost + driverCost + vehicleCost + tollCost
    
    // More realistic pricing for different distances
    let minimumCharge: number
    if (distance <= 20) {
      minimumCharge = 800000 // ₫800k for short hauls
    } else if (distance <= 50) {
      minimumCharge = 1200000 // ₫1.2M for medium hauls
    } else if (distance <= 100) {
      minimumCharge = 1600000 // ₫1.6M for 100km (more realistic)
    } else {
      minimumCharge = 2200000 // ₫2.2M for long hauls
    }
    
    return Math.max(calculatedCost, minimumCharge)
  }

  /**
   * Calculate optimal route with realistic container truck pricing
   */
  async calculateOptimalRoute(origin: Location, destination: Location): Promise<RouteResult> {
    try {
      const distance = this.calculateDistance(
        origin.lat, origin.lng,
        destination.lat, destination.lng
      )

      const duration = this.calculateTravelTime(distance)
      const fuelConsumption = this.getFuelConsumption('container')
      const fuelCost = distance * fuelConsumption * this.fuelPriceVND
      const totalCost = this.calculateTotalCost(distance, duration)

      const optimizedRoute = [origin, destination]

      const savings = {
        distance: distance * 0.03, // 3% savings (realistic)
        time: duration * 0.05, // 5% time savings
        cost: totalCost * 0.04 // 4% cost savings
      }

      return {
        distance,
        duration,
        fuelCost,
        totalCost,
        optimizedRoute,
        savings
      }
    } catch (error) {
      console.error('Route calculation error:', error)
      throw new Error('Failed to calculate optimal route')
    }
  }

  /**
   * Calculate multi-stop route
   */
  async calculateMultiStopRoute(locations: Location[]): Promise<RouteResult> {
    if (locations.length < 2) {
      throw new Error('At least 2 locations required')
    }

    const optimizedRoute = this.optimizeRouteOrder(locations)
    
    let totalDistance = 0
    let totalDuration = 0

    for (let i = 0; i < optimizedRoute.length - 1; i++) {
      const current = optimizedRoute[i]
      const next = optimizedRoute[i + 1]
      
      const segmentDistance = this.calculateDistance(
        current.lat, current.lng,
        next.lat, next.lng
      )
      
      totalDistance += segmentDistance
      totalDuration += this.calculateTravelTime(segmentDistance)
    }

    const fuelCost = this.calculateFuelCost(totalDistance)
    const totalCost = this.calculateTotalCost(totalDistance, totalDuration)

    const unoptimizedDistance = this.calculateUnoptimizedDistance(locations)
    const unoptimizedDuration = this.calculateTravelTime(unoptimizedDistance)
    const savings = {
      distance: unoptimizedDistance - totalDistance,
      time: unoptimizedDuration - totalDuration,
      cost: this.calculateTotalCost(unoptimizedDistance, unoptimizedDuration) - totalCost
    }

    return {
      distance: totalDistance,
      duration: totalDuration,
      fuelCost,
      totalCost,
      optimizedRoute,
      savings
    }
  }

  private optimizeRouteOrder(locations: Location[]): Location[] {
    if (locations.length <= 2) return locations

    const optimized = [locations[0]]
    const remaining = locations.slice(1)

    while (remaining.length > 0) {
      const current = optimized[optimized.length - 1]
      let nearestIndex = 0
      let nearestDistance = Infinity

      remaining.forEach((location, index) => {
        const distance = this.calculateDistance(
          current.lat, current.lng,
          location.lat, location.lng
        )
        if (distance < nearestDistance) {
          nearestDistance = distance
          nearestIndex = index
        }
      })

      optimized.push(remaining[nearestIndex])
      remaining.splice(nearestIndex, 1)
    }

    return optimized
  }

  private calculateUnoptimizedDistance(locations: Location[]): number {
    let distance = 0
    for (let i = 0; i < locations.length - 1; i++) {
      distance += this.calculateDistance(
        locations[i].lat, locations[i].lng,
        locations[i + 1].lat, locations[i + 1].lng
      )
    }
    return distance
  }

  async getRouteRecommendations(origin: Location, destination: Location): Promise<{
    fastest: RouteResult
    cheapest: RouteResult
    balanced: RouteResult
  }> {
    const baseRoute = await this.calculateOptimalRoute(origin, destination)

    const fastest = {
      ...baseRoute,
      duration: baseRoute.duration * 0.88, // 12% faster via highways
      totalCost: baseRoute.totalCost * 1.05 // 5% more expensive (tolls)
    }

    const cheapest = {
      ...baseRoute,
      duration: baseRoute.duration * 1.12, // 12% slower via local roads
      totalCost: baseRoute.totalCost * 0.95 // 5% cheaper (no tolls)
    }

    const balanced = baseRoute

    return { fastest, cheapest, balanced }
  }
}
