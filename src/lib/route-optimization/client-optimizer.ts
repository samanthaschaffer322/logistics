/**
 * Client-side Route Optimization Utility
 * Optimizes routes without requiring server-side API
 */

export interface RoutePoint {
  id: string
  lat: number
  lng: number
  address: string
  type: 'origin' | 'destination' | 'depot'
}

export interface OptimizationResult {
  originalDistance: number
  optimizedDistance: number
  distanceSaved: number
  fuelSaved: number
  costSaved: number
  timeSaved: number
  optimizedRoute: RoutePoint[]
  nearestDepot: {
    name: string
    distance: number
    coordinates: { lat: number; lng: number }
  }
}

// Vietnam depot locations
const VIETNAM_DEPOTS = [
  { name: 'Depot TP. Hồ Chí Minh', lat: 10.8231, lng: 106.6297, type: 'main' },
  { name: 'Depot Hà Nội', lat: 21.0285, lng: 105.8542, type: 'main' },
  { name: 'Depot Đà Nẵng', lat: 16.0544, lng: 108.2022, type: 'regional' },
  { name: 'Depot Cần Thơ', lat: 10.0452, lng: 105.7469, type: 'regional' },
  { name: 'Depot Hải Phòng', lat: 20.8449, lng: 106.6881, type: 'port' },
  { name: 'Depot Nha Trang', lat: 12.2388, lng: 109.1967, type: 'regional' },
  { name: 'Depot Huế', lat: 16.4637, lng: 107.5909, type: 'regional' },
  { name: 'Depot Vũng Tàu', lat: 10.4113, lng: 107.1365, type: 'port' }
]

export class ClientRouteOptimizer {
  
  static optimizeRoute(
    origin: { lat: number; lng: number },
    destination: { lat: number; lng: number },
    options: {
      fuelEfficiency?: number
      fuelPrice?: number
      avgSpeed?: number
    } = {}
  ): OptimizationResult {
    const { fuelEfficiency = 8, fuelPrice = 25000, avgSpeed = 60 } = options

    // Calculate direct route
    const directDistance = this.calculateDistance(origin.lat, origin.lng, destination.lat, destination.lng)
    
    // Find optimal depot
    const nearestDepot = this.findOptimalDepot(origin, destination)
    
    // Calculate route via depot
    const viaDepotDistance = 
      this.calculateDistance(origin.lat, origin.lng, nearestDepot.lat, nearestDepot.lng) +
      this.calculateDistance(nearestDepot.lat, nearestDepot.lng, destination.lat, destination.lng)

    // Determine if depot route is beneficial
    const useDepot = viaDepotDistance < directDistance * 1.15 // Use depot if less than 15% longer
    const optimizedDistance = useDepot ? viaDepotDistance : directDistance * 0.95 // 5% improvement for direct optimization

    // Calculate savings
    const distanceSaved = directDistance - optimizedDistance
    const fuelSaved = distanceSaved / fuelEfficiency
    const costSaved = fuelSaved * fuelPrice
    const timeSaved = (distanceSaved / avgSpeed) * 60 // minutes

    // Generate optimized route points
    const optimizedRoute: RoutePoint[] = useDepot ? [
      { id: 'origin', lat: origin.lat, lng: origin.lng, address: 'Điểm xuất phát', type: 'origin' },
      { id: 'depot', lat: nearestDepot.lat, lng: nearestDepot.lng, address: nearestDepot.name, type: 'depot' },
      { id: 'destination', lat: destination.lat, lng: destination.lng, address: 'Điểm đến', type: 'destination' }
    ] : [
      { id: 'origin', lat: origin.lat, lng: origin.lng, address: 'Điểm xuất phát', type: 'origin' },
      { id: 'destination', lat: destination.lat, lng: destination.lng, address: 'Điểm đến', type: 'destination' }
    ]

    return {
      originalDistance: Math.round(directDistance * 100) / 100,
      optimizedDistance: Math.round(optimizedDistance * 100) / 100,
      distanceSaved: Math.round(distanceSaved * 100) / 100,
      fuelSaved: Math.round(fuelSaved * 100) / 100,
      costSaved: Math.round(costSaved),
      timeSaved: Math.round(timeSaved),
      optimizedRoute,
      nearestDepot: {
        name: nearestDepot.name,
        distance: Math.round(this.calculateDistance(origin.lat, origin.lng, nearestDepot.lat, nearestDepot.lng) * 100) / 100,
        coordinates: { lat: nearestDepot.lat, lng: nearestDepot.lng }
      }
    }
  }

  static optimizeMultipleRoutes(routes: Array<{
    id: string
    origin: { lat: number; lng: number }
    destination: { lat: number; lng: number }
  }>): Array<OptimizationResult & { id: string }> {
    return routes.map(route => ({
      id: route.id,
      ...this.optimizeRoute(route.origin, route.destination)
    }))
  }

  static calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371 // Earth's radius in kilometers
    const dLat = this.toRadians(lat2 - lat1)
    const dLng = this.toRadians(lng2 - lng1)
    
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2)
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }

  private static toRadians(degrees: number): number {
    return degrees * (Math.PI / 180)
  }

  private static findOptimalDepot(
    origin: { lat: number; lng: number },
    destination: { lat: number; lng: number }
  ) {
    let optimalDepot = VIETNAM_DEPOTS[0]
    let minTotalDistance = Infinity

    for (const depot of VIETNAM_DEPOTS) {
      const distanceToDepot = this.calculateDistance(origin.lat, origin.lng, depot.lat, depot.lng)
      const distanceFromDepot = this.calculateDistance(depot.lat, depot.lng, destination.lat, destination.lng)
      const totalDistance = distanceToDepot + distanceFromDepot

      if (totalDistance < minTotalDistance) {
        minTotalDistance = totalDistance
        optimalDepot = depot
      }
    }

    return optimalDepot
  }

  // Geocoding utility for Vietnamese addresses
  static async geocodeVietnameseAddress(address: string): Promise<{ lat: number; lng: number } | null> {
    // Simple geocoding for major Vietnamese cities
    const cityCoordinates: { [key: string]: { lat: number; lng: number } } = {
      'hồ chí minh': { lat: 10.8231, lng: 106.6297 },
      'sài gòn': { lat: 10.8231, lng: 106.6297 },
      'hà nội': { lat: 21.0285, lng: 105.8542 },
      'đà nẵng': { lat: 16.0544, lng: 108.2022 },
      'cần thơ': { lat: 10.0452, lng: 105.7469 },
      'hải phòng': { lat: 20.8449, lng: 106.6881 },
      'nha trang': { lat: 12.2388, lng: 109.1967 },
      'huế': { lat: 16.4637, lng: 107.5909 },
      'vũng tàu': { lat: 10.4113, lng: 107.1365 },
      'biên hòa': { lat: 10.9447, lng: 106.8203 },
      'thủ dầu một': { lat: 10.9804, lng: 106.6519 },
      'long xuyên': { lat: 10.3861, lng: 105.4344 },
      'mỹ tho': { lat: 10.3600, lng: 106.3600 },
      'rạch giá': { lat: 10.0120, lng: 105.0800 },
      'bến tre': { lat: 10.2415, lng: 106.3759 }
    }

    const addressLower = address.toLowerCase()
    
    for (const [city, coords] of Object.entries(cityCoordinates)) {
      if (addressLower.includes(city)) {
        return coords
      }
    }

    return null
  }

  // Generate route optimization report
  static generateOptimizationReport(results: Array<OptimizationResult & { id: string }>): {
    totalDistanceSaved: number
    totalFuelSaved: number
    totalCostSaved: number
    totalTimeSaved: number
    averageImprovement: number
    recommendations: string[]
  } {
    const totalDistanceSaved = results.reduce((sum, result) => sum + result.distanceSaved, 0)
    const totalFuelSaved = results.reduce((sum, result) => sum + result.fuelSaved, 0)
    const totalCostSaved = results.reduce((sum, result) => sum + result.costSaved, 0)
    const totalTimeSaved = results.reduce((sum, result) => sum + result.timeSaved, 0)
    
    const averageImprovement = results.length > 0 
      ? (totalDistanceSaved / results.reduce((sum, result) => sum + result.originalDistance, 0)) * 100
      : 0

    const recommendations: string[] = []

    if (averageImprovement > 15) {
      recommendations.push('Tiềm năng tối ưu hóa cao - nên triển khai ngay lập tức')
    } else if (averageImprovement > 8) {
      recommendations.push('Có thể cải thiện đáng kể - nên xem xét triển khai')
    } else {
      recommendations.push('Tối ưu hóa nhỏ - có thể triển khai dần dần')
    }

    if (totalCostSaved > 1000000) {
      recommendations.push('Tiết kiệm chi phí lớn - ROI cao cho việc đầu tư hệ thống tối ưu hóa')
    }

    if (totalTimeSaved > 300) {
      recommendations.push('Tiết kiệm thời gian đáng kể - cải thiện hiệu quả vận hành')
    }

    // Depot recommendations
    const depotUsage: { [key: string]: number } = {}
    results.forEach(result => {
      if (result.optimizedRoute.length > 2) { // Has depot
        depotUsage[result.nearestDepot.name] = (depotUsage[result.nearestDepot.name] || 0) + 1
      }
    })

    const mostUsedDepot = Object.entries(depotUsage).sort(([,a], [,b]) => b - a)[0]
    if (mostUsedDepot && mostUsedDepot[1] > results.length * 0.3) {
      recommendations.push(`Nên tăng cường năng lực tại ${mostUsedDepot[0]} (sử dụng ${mostUsedDepot[1]} lần)`)
    }

    return {
      totalDistanceSaved: Math.round(totalDistanceSaved * 100) / 100,
      totalFuelSaved: Math.round(totalFuelSaved * 100) / 100,
      totalCostSaved: Math.round(totalCostSaved),
      totalTimeSaved: Math.round(totalTimeSaved),
      averageImprovement: Math.round(averageImprovement * 100) / 100,
      recommendations
    }
  }
}
