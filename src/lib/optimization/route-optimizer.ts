/**
 * Advanced Route Optimization System
 * Specialized for Vietnamese logistics with depot optimization
 */

export interface Location {
  id: string
  name: string
  nameVi: string
  address: string
  latitude: number
  longitude: number
  type: 'depot' | 'pickup' | 'delivery' | 'empty_return'
}

export interface Vehicle {
  id: string
  type: string
  capacity: number
  fuelConsumption: number // liters per 100km
  currentLocation: Location
  status: 'available' | 'busy' | 'maintenance'
}

export interface RouteSegment {
  from: Location
  to: Location
  distance: number // km
  estimatedTime: number // minutes
  fuelCost: number // VND
  tollCost: number // VND
}

export interface OptimizedRoute {
  id: string
  vehicle: Vehicle
  segments: RouteSegment[]
  totalDistance: number
  totalTime: number
  totalFuelCost: number
  totalTollCost: number
  totalCost: number
  efficiency: number // cost per km
  co2Emission: number // kg
  recommendations: string[]
  recommendationsVi: string[]
}

export interface RouteOptimizationRequest {
  pickupLocation: Location
  deliveryLocation: Location
  emptyReturnLocation?: Location
  vehicleType?: string
  prioritizeBy: 'cost' | 'time' | 'fuel' | 'distance'
  constraints?: {
    maxDistance?: number
    maxTime?: number
    avoidTolls?: boolean
    preferHighways?: boolean
  }
}

// Major Vietnamese logistics hubs and depots
export const VIETNAMESE_LOGISTICS_HUBS: Location[] = [
  // Ho Chi Minh City Area
  {
    id: 'hcm_cat_lai',
    name: 'Cat Lai Port',
    nameVi: 'Cảng Cát Lái',
    address: 'Đường Đồng Văn Cống, Quận 2, TP.HCM',
    latitude: 10.8076,
    longitude: 106.7441,
    type: 'depot'
  },
  {
    id: 'hcm_tan_son_nhat',
    name: 'Tan Son Nhat Airport',
    nameVi: 'Sân bay Tân Sơn Nhất',
    address: 'Sân bay Tân Sơn Nhất, TP.HCM',
    latitude: 10.8188,
    longitude: 106.6519,
    type: 'depot'
  },
  {
    id: 'hcm_binh_duong_depot',
    name: 'Binh Duong Logistics Center',
    nameVi: 'Trung tâm Logistics Bình Dương',
    address: 'KCN Việt Nam Singapore, Bình Dương',
    latitude: 10.9804,
    longitude: 106.6519,
    type: 'depot'
  },

  // Hanoi Area
  {
    id: 'hn_noi_bai',
    name: 'Noi Bai Airport',
    nameVi: 'Sân bay Nội Bài',
    address: 'Sân bay Nội Bài, Hà Nội',
    latitude: 21.2187,
    longitude: 105.8056,
    type: 'depot'
  },
  {
    id: 'hn_hai_phong_port',
    name: 'Hai Phong Port',
    nameVi: 'Cảng Hải Phòng',
    address: 'Cảng Hải Phòng, Hải Phòng',
    latitude: 20.8449,
    longitude: 106.6881,
    type: 'depot'
  },

  // Da Nang Area
  {
    id: 'dn_da_nang_port',
    name: 'Da Nang Port',
    nameVi: 'Cảng Đà Nẵng',
    address: 'Cảng Đà Nẵng, Đà Nẵng',
    latitude: 16.0544,
    longitude: 108.2022,
    type: 'depot'
  },

  // Can Tho Area
  {
    id: 'ct_can_tho_port',
    name: 'Can Tho Port',
    nameVi: 'Cảng Cần Thơ',
    address: 'Cảng Cần Thơ, Cần Thơ',
    latitude: 10.0452,
    longitude: 105.7469,
    type: 'depot'
  }
]

export class RouteOptimizer {
  private static readonly FUEL_PRICE_VND_PER_LITER = 24000 // Current diesel price in Vietnam
  private static readonly CO2_EMISSION_KG_PER_LITER = 2.68 // CO2 emission factor

  static async optimizeRoute(request: RouteOptimizationRequest): Promise<OptimizedRoute[]> {
    const availableDepots = this.findNearestDepots(request.pickupLocation, request.deliveryLocation)
    const routes: OptimizedRoute[] = []

    for (const depot of availableDepots) {
      const route = await this.calculateOptimalRoute(request, depot)
      if (route) {
        routes.push(route)
      }
    }

    // Sort routes based on priority
    return this.sortRoutesByPriority(routes, request.prioritizeBy)
  }

  private static findNearestDepots(pickup: Location, delivery: Location): Location[] {
    const pickupDepots = this.getDepotsNearLocation(pickup, 100) // Within 100km
    const deliveryDepots = this.getDepotsNearLocation(delivery, 100)
    
    // Combine and deduplicate
    const allDepots = [...pickupDepots, ...deliveryDepots]
    const uniqueDepots = allDepots.filter((depot, index, self) => 
      index === self.findIndex(d => d.id === depot.id)
    )

    return uniqueDepots.slice(0, 5) // Top 5 nearest depots
  }

  private static getDepotsNearLocation(location: Location, radiusKm: number): Location[] {
    return VIETNAMESE_LOGISTICS_HUBS.filter(depot => {
      const distance = this.calculateDistance(location, depot)
      return distance <= radiusKm
    }).sort((a, b) => {
      const distA = this.calculateDistance(location, a)
      const distB = this.calculateDistance(location, b)
      return distA - distB
    })
  }

  private static async calculateOptimalRoute(
    request: RouteOptimizationRequest, 
    depot: Location
  ): Promise<OptimizedRoute | null> {
    try {
      const segments: RouteSegment[] = []
      
      // Segment 1: Depot to Pickup
      const depotToPickup = await this.calculateSegment(depot, request.pickupLocation)
      segments.push(depotToPickup)

      // Segment 2: Pickup to Delivery
      const pickupToDelivery = await this.calculateSegment(request.pickupLocation, request.deliveryLocation)
      segments.push(pickupToDelivery)

      // Segment 3: Delivery to Empty Return (if specified) or back to depot
      const returnLocation = request.emptyReturnLocation || depot
      const deliveryToReturn = await this.calculateSegment(request.deliveryLocation, returnLocation)
      segments.push(deliveryToReturn)

      // Calculate totals
      const totalDistance = segments.reduce((sum, seg) => sum + seg.distance, 0)
      const totalTime = segments.reduce((sum, seg) => sum + seg.estimatedTime, 0)
      const totalFuelCost = segments.reduce((sum, seg) => sum + seg.fuelCost, 0)
      const totalTollCost = segments.reduce((sum, seg) => sum + seg.tollCost, 0)
      const totalCost = totalFuelCost + totalTollCost

      // Calculate efficiency and emissions
      const efficiency = totalCost / totalDistance
      const fuelUsed = totalDistance * 0.25 // Assume 25L/100km average
      const co2Emission = fuelUsed * this.CO2_EMISSION_KG_PER_LITER

      // Generate recommendations
      const recommendations = this.generateRecommendations(segments, request)
      const recommendationsVi = this.generateRecommendationsVi(segments, request)

      return {
        id: `route_${depot.id}_${Date.now()}`,
        vehicle: this.getOptimalVehicle(request.vehicleType),
        segments,
        totalDistance,
        totalTime,
        totalFuelCost,
        totalTollCost,
        totalCost,
        efficiency,
        co2Emission,
        recommendations,
        recommendationsVi
      }
    } catch (error) {
      console.error('Error calculating route:', error)
      return null
    }
  }

  private static async calculateSegment(from: Location, to: Location): Promise<RouteSegment> {
    const distance = this.calculateDistance(from, to)
    const estimatedTime = this.estimateTime(distance)
    const fuelCost = this.calculateFuelCost(distance)
    const tollCost = this.estimateTollCost(from, to, distance)

    return {
      from,
      to,
      distance,
      estimatedTime,
      fuelCost,
      tollCost
    }
  }

  private static calculateDistance(from: Location, to: Location): number {
    const R = 6371 // Earth's radius in km
    const dLat = this.toRadians(to.latitude - from.latitude)
    const dLon = this.toRadians(to.longitude - from.longitude)
    
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(this.toRadians(from.latitude)) * Math.cos(this.toRadians(to.latitude)) *
              Math.sin(dLon/2) * Math.sin(dLon/2)
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    const distance = R * c

    // Add 20% for actual road distance vs straight line
    return Math.round(distance * 1.2 * 10) / 10
  }

  private static toRadians(degrees: number): number {
    return degrees * (Math.PI / 180)
  }

  private static estimateTime(distance: number): number {
    // Estimate based on Vietnamese road conditions
    let avgSpeed = 50 // km/h average including traffic
    
    if (distance > 200) avgSpeed = 60 // Highway speeds for long distance
    if (distance < 50) avgSpeed = 35 // City traffic for short distance
    
    return Math.round((distance / avgSpeed) * 60) // Convert to minutes
  }

  private static calculateFuelCost(distance: number): number {
    const fuelConsumption = 25 // liters per 100km for trucks
    const fuelNeeded = (distance / 100) * fuelConsumption
    return Math.round(fuelNeeded * this.FUEL_PRICE_VND_PER_LITER)
  }

  private static estimateTollCost(from: Location, to: Location, distance: number): number {
    // Estimate toll costs based on Vietnamese highway system
    const isHighwayRoute = distance > 100
    const tollPerKm = isHighwayRoute ? 800 : 0 // VND per km on highways
    
    // Major routes with higher tolls
    const isHCMHanoiRoute = (from.latitude < 12 && to.latitude > 20) || (from.latitude > 20 && to.latitude < 12)
    const multiplier = isHCMHanoiRoute ? 1.5 : 1
    
    return Math.round(distance * tollPerKm * multiplier)
  }

  private static getOptimalVehicle(vehicleType?: string): Vehicle {
    // Return a mock optimal vehicle based on type
    const vehicles = {
      'small_truck': {
        id: 'truck_001',
        type: 'Small Truck (3.5T)',
        capacity: 3500,
        fuelConsumption: 20,
        currentLocation: VIETNAMESE_LOGISTICS_HUBS[0],
        status: 'available' as const
      },
      'medium_truck': {
        id: 'truck_002',
        type: 'Medium Truck (7T)',
        capacity: 7000,
        fuelConsumption: 25,
        currentLocation: VIETNAMESE_LOGISTICS_HUBS[0],
        status: 'available' as const
      },
      'large_truck': {
        id: 'truck_003',
        type: 'Large Truck (15T)',
        capacity: 15000,
        fuelConsumption: 35,
        currentLocation: VIETNAMESE_LOGISTICS_HUBS[0],
        status: 'available' as const
      }
    }

    return vehicles[vehicleType as keyof typeof vehicles] || vehicles.medium_truck
  }

  private static sortRoutesByPriority(routes: OptimizedRoute[], prioritizeBy: string): OptimizedRoute[] {
    return routes.sort((a, b) => {
      switch (prioritizeBy) {
        case 'cost':
          return a.totalCost - b.totalCost
        case 'time':
          return a.totalTime - b.totalTime
        case 'fuel':
          return a.totalFuelCost - b.totalFuelCost
        case 'distance':
          return a.totalDistance - b.totalDistance
        default:
          return a.efficiency - b.efficiency
      }
    })
  }

  private static generateRecommendations(segments: RouteSegment[], request: RouteOptimizationRequest): string[] {
    const recommendations: string[] = []
    const totalDistance = segments.reduce((sum, seg) => sum + seg.distance, 0)
    const totalTime = segments.reduce((sum, seg) => sum + seg.estimatedTime, 0)

    if (totalDistance > 500) {
      recommendations.push('Consider overnight rest for driver safety on long routes')
      recommendations.push('Plan fuel stops every 400km to avoid running low')
    }

    if (totalTime > 480) { // 8 hours
      recommendations.push('Route exceeds 8 hours - consider driver rotation')
    }

    const longestSegment = segments.reduce((max, seg) => seg.distance > max.distance ? seg : max)
    if (longestSegment.distance > 200) {
      recommendations.push(`Longest segment is ${longestSegment.distance}km - monitor traffic conditions`)
    }

    recommendations.push('Use GPS tracking for real-time monitoring')
    recommendations.push('Check vehicle maintenance before departure')

    return recommendations
  }

  private static generateRecommendationsVi(segments: RouteSegment[], request: RouteOptimizationRequest): string[] {
    const recommendations: string[] = []
    const totalDistance = segments.reduce((sum, seg) => sum + seg.distance, 0)
    const totalTime = segments.reduce((sum, seg) => sum + seg.estimatedTime, 0)

    if (totalDistance > 500) {
      recommendations.push('Nên nghỉ qua đêm để đảm bảo an toàn tài xế trên tuyến đường dài')
      recommendations.push('Lập kế hoạch đổ xăng mỗi 400km để tránh hết nhiên liệu')
    }

    if (totalTime > 480) { // 8 hours
      recommendations.push('Tuyến đường vượt quá 8 giờ - nên xem xét thay đổi tài xế')
    }

    const longestSegment = segments.reduce((max, seg) => seg.distance > max.distance ? seg : max)
    if (longestSegment.distance > 200) {
      recommendations.push(`Đoạn đường dài nhất là ${longestSegment.distance}km - theo dõi tình hình giao thông`)
    }

    recommendations.push('Sử dụng GPS để theo dõi thời gian thực')
    recommendations.push('Kiểm tra bảo trì xe trước khi khởi hành')

    return recommendations
  }

  // Public method to analyze uploaded route files
  static async analyzeRouteFile(fileData: any): Promise<{
    currentEfficiency: number
    optimizationOpportunities: string[]
    optimizationOpportunitiesVi: string[]
    potentialSavings: {
      fuelSavings: number
      timeSavings: number
      costSavings: number
    }
    recommendedRoutes: OptimizedRoute[]
  }> {
    const routes = fileData.records || []
    
    // Calculate current efficiency
    const totalDistance = routes.reduce((sum: number, route: any) => sum + (route.distance || 0), 0)
    const totalFuelCost = routes.reduce((sum: number, route: any) => sum + (route.fuelCost || 0), 0)
    const currentEfficiency = totalDistance > 0 ? totalFuelCost / totalDistance : 0

    // Identify optimization opportunities
    const opportunities: string[] = []
    const opportunitiesVi: string[] = []

    // Analyze for inefficiencies
    const highCostRoutes = routes.filter((route: any) => (route.fuelCost / route.distance) > currentEfficiency * 1.2)
    if (highCostRoutes.length > 0) {
      opportunities.push(`${highCostRoutes.length} routes have 20%+ higher fuel costs than average`)
      opportunitiesVi.push(`${highCostRoutes.length} tuyến đường có chi phí nhiên liệu cao hơn trung bình 20%+`)
    }

    // Check for depot optimization opportunities
    const uniqueDestinations = [...new Set(routes.map((r: any) => r.destination))]
    if (uniqueDestinations.length > 3) {
      opportunities.push('Multiple destinations detected - depot consolidation could reduce costs')
      opportunitiesVi.push('Phát hiện nhiều điểm đến - hợp nhất depot có thể giảm chi phí')
    }

    // Calculate potential savings
    const potentialSavings = {
      fuelSavings: Math.round(totalFuelCost * 0.2), // 20% potential fuel savings
      timeSavings: Math.round(routes.length * 30), // 30 minutes per route
      costSavings: Math.round(totalFuelCost * 0.25) // 25% total cost savings
    }

    // Generate recommended optimized routes (mock data for now)
    const recommendedRoutes: OptimizedRoute[] = []

    return {
      currentEfficiency,
      optimizationOpportunities: opportunities,
      optimizationOpportunitiesVi: opportunitiesVi,
      potentialSavings,
      recommendedRoutes
    }
  }
}
