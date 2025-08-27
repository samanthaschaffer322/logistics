// Enhanced Route Calculator with Vietnamese Logistics Factors
export interface RouteFactors {
  weather: 'clear' | 'rain' | 'storm' | 'fog'
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night'
  dayOfWeek: 'weekday' | 'weekend'
  trafficLevel: 'light' | 'moderate' | 'heavy' | 'severe'
  roadType: 'highway' | 'city' | 'rural' | 'mixed'
  containerRestrictions: boolean
}

export interface EnhancedRouteResult {
  baseDistance: number
  actualDistance: number
  baseTime: number
  actualTime: number
  baseFuelConsumption: number
  actualFuelConsumption: number
  baseCost: number
  actualCost: number
  efficiency: number
  weatherImpact: number
  trafficImpact: number
  timeRestrictionImpact: number
  factors: RouteFactors
  recommendations: string[]
}

export class EnhancedRouteCalculator {
  // Vietnamese container truck operating restrictions
  private static readonly CONTAINER_RESTRICTED_HOURS = {
    weekday: { start: 6, end: 22 }, // 6 AM to 10 PM
    weekend: { start: 8, end: 20 }  // 8 AM to 8 PM
  }

  // Vietnamese highway speed limits and conditions
  private static readonly SPEED_LIMITS = {
    highway: { clear: 90, rain: 70, storm: 50, fog: 40 },
    city: { clear: 50, rain: 40, storm: 30, fog: 25 },
    rural: { clear: 60, rain: 50, storm: 35, fog: 30 }
  }

  // Traffic impact factors for Vietnamese routes
  private static readonly TRAFFIC_FACTORS = {
    light: 1.0,
    moderate: 1.3,
    heavy: 1.8,
    severe: 2.5
  }

  // Weather impact on fuel consumption
  private static readonly WEATHER_FUEL_IMPACT = {
    clear: 1.0,
    rain: 1.15,
    storm: 1.35,
    fog: 1.25
  }

  // Vietnamese fuel prices and costs (VND per liter)
  private static readonly FUEL_PRICE = 24500 // Current Vietnamese diesel price

  static calculateEnhancedRoute(
    origin: string,
    destination: string,
    baseDistance: number,
    factors: RouteFactors
  ): EnhancedRouteResult {
    // Base calculations
    const baseTime = this.calculateBaseTime(baseDistance, factors.roadType)
    const baseFuelConsumption = this.calculateBaseFuelConsumption(baseDistance)
    const baseCost = this.calculateBaseCost(baseFuelConsumption, baseDistance)

    // Apply Vietnamese logistics factors
    const weatherImpact = this.calculateWeatherImpact(factors.weather)
    const trafficImpact = this.calculateTrafficImpact(factors.trafficLevel, factors.timeOfDay)
    const timeRestrictionImpact = this.calculateTimeRestrictionImpact(factors)

    // Calculate actual values with all factors
    const actualDistance = baseDistance * (1 + (weatherImpact - 1) * 0.1)
    const actualTime = baseTime * trafficImpact * weatherImpact * timeRestrictionImpact
    const actualFuelConsumption = baseFuelConsumption * this.WEATHER_FUEL_IMPACT[factors.weather] * trafficImpact
    const actualCost = this.calculateActualCost(actualFuelConsumption, actualDistance, actualTime)

    // Calculate efficiency
    const efficiency = Math.max(30, Math.min(95, 100 - ((actualTime - baseTime) / baseTime * 100)))

    // Generate recommendations
    const recommendations = this.generateRecommendations(factors, weatherImpact, trafficImpact)

    return {
      baseDistance,
      actualDistance: Math.round(actualDistance),
      baseTime: Math.round(baseTime),
      actualTime: Math.round(actualTime),
      baseFuelConsumption: Math.round(baseFuelConsumption * 10) / 10,
      actualFuelConsumption: Math.round(actualFuelConsumption * 10) / 10,
      baseCost,
      actualCost: Math.round(actualCost),
      efficiency: Math.round(efficiency),
      weatherImpact: Math.round((weatherImpact - 1) * 100),
      trafficImpact: Math.round((trafficImpact - 1) * 100),
      timeRestrictionImpact: Math.round((timeRestrictionImpact - 1) * 100),
      factors,
      recommendations
    }
  }

  private static calculateBaseTime(distance: number, roadType: string): number {
    const baseSpeed = roadType === 'highway' ? 80 : roadType === 'city' ? 45 : 55
    return (distance / baseSpeed) * 60 // minutes
  }

  private static calculateBaseFuelConsumption(distance: number): number {
    // Container truck fuel consumption: 32L/100km average
    return (distance / 100) * 32
  }

  private static calculateBaseCost(fuelConsumption: number, distance: number): number {
    const fuelCost = fuelConsumption * this.FUEL_PRICE
    const tollCost = distance * 1200 // VND per km for Vietnamese highways
    const driverCost = 150000 // Base driver cost for the trip
    return fuelCost + tollCost + driverCost
  }

  private static calculateWeatherImpact(weather: string): number {
    switch (weather) {
      case 'clear': return 1.0
      case 'rain': return 1.25
      case 'storm': return 1.6
      case 'fog': return 1.4
      default: return 1.0
    }
  }

  private static calculateTrafficImpact(trafficLevel: string, timeOfDay: string): number {
    let baseFactor = this.TRAFFIC_FACTORS[trafficLevel as keyof typeof this.TRAFFIC_FACTORS] || 1.0
    
    // Rush hour adjustments for Vietnamese traffic
    if (timeOfDay === 'morning' || timeOfDay === 'evening') {
      baseFactor *= 1.2
    }
    
    return baseFactor
  }

  private static calculateTimeRestrictionImpact(factors: RouteFactors): number {
    if (!factors.containerRestrictions) return 1.0

    const currentHour = new Date().getHours()
    const restrictions = factors.dayOfWeek === 'weekend' 
      ? this.CONTAINER_RESTRICTED_HOURS.weekend 
      : this.CONTAINER_RESTRICTED_HOURS.weekday

    // If operating outside allowed hours, add delay factor
    if (currentHour < restrictions.start || currentHour > restrictions.end) {
      return 1.3 // 30% time penalty for restricted hours
    }

    return 1.0
  }

  private static calculateActualCost(fuelConsumption: number, distance: number, timeMinutes: number): number {
    const fuelCost = fuelConsumption * this.FUEL_PRICE
    const tollCost = distance * 1200
    const driverCost = (timeMinutes / 60) * 50000 // VND per hour
    const weatherPenalty = 50000 // Additional cost for adverse conditions
    
    return fuelCost + tollCost + driverCost + weatherPenalty
  }

  private static generateRecommendations(
    factors: RouteFactors, 
    weatherImpact: number, 
    trafficImpact: number
  ): string[] {
    const recommendations: string[] = []

    if (weatherImpact > 1.3) {
      recommendations.push('Consider delaying trip due to severe weather conditions')
      recommendations.push('Increase following distance and reduce speed for safety')
    }

    if (trafficImpact > 1.5) {
      recommendations.push('Avoid peak hours (7-9 AM, 5-7 PM) for better efficiency')
      recommendations.push('Consider alternative routes through less congested areas')
    }

    if (factors.containerRestrictions) {
      recommendations.push('Ensure departure time complies with container truck restrictions')
      recommendations.push('Plan rest stops within allowed operating hours')
    }

    if (factors.timeOfDay === 'night') {
      recommendations.push('Ensure proper lighting and driver rest for night operations')
      recommendations.push('Consider security measures for night transport')
    }

    return recommendations
  }

  // Get current Vietnamese traffic and weather conditions
  static getCurrentConditions(): RouteFactors {
    const hour = new Date().getHours()
    const day = new Date().getDay()
    
    return {
      weather: this.getWeatherCondition(),
      timeOfDay: this.getTimeOfDay(hour),
      dayOfWeek: (day === 0 || day === 6) ? 'weekend' : 'weekday',
      trafficLevel: this.getTrafficLevel(hour, day),
      roadType: 'mixed',
      containerRestrictions: true
    }
  }

  private static getWeatherCondition(): 'clear' | 'rain' | 'storm' | 'fog' {
    // Simulate Vietnamese weather patterns
    const conditions = ['clear', 'clear', 'clear', 'rain', 'fog']
    return conditions[Math.floor(Math.random() * conditions.length)] as any
  }

  private static getTimeOfDay(hour: number): 'morning' | 'afternoon' | 'evening' | 'night' {
    if (hour >= 6 && hour < 12) return 'morning'
    if (hour >= 12 && hour < 17) return 'afternoon'
    if (hour >= 17 && hour < 22) return 'evening'
    return 'night'
  }

  private static getTrafficLevel(hour: number, day: number): 'light' | 'moderate' | 'heavy' | 'severe' {
    // Weekend traffic is generally lighter
    if (day === 0 || day === 6) return 'light'
    
    // Weekday rush hours
    if ((hour >= 7 && hour <= 9) || (hour >= 17 && hour <= 19)) {
      return 'heavy'
    }
    
    // Business hours
    if (hour >= 10 && hour <= 16) return 'moderate'
    
    return 'light'
  }
}
