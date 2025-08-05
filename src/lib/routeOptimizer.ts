// Enhanced Route Optimization for Vietnam Logistics
export interface Location {
  name: string
  address: string
  lat: number
  lng: number
  type: 'departure' | 'destination' | 'depot' | 'warehouse'
}

export interface RouteOptimizationRequest {
  departure: Location
  destination: Location
  depots?: Location[]
  vehicleType: 'truck' | 'van' | 'car'
  constraints?: {
    maxDistance?: number
    maxDuration?: number
    avoidTolls?: boolean
    avoidHighways?: boolean
  }
}

export interface OptimizedRoute {
  id: string
  waypoints: Location[]
  distance: number
  duration: number
  cost: {
    fuel: number
    tolls: number
    driver: number
    total: number
  }
  riskLevel: 'low' | 'medium' | 'high'
  recommendations: string[]
  polyline?: string
}

export class RouteOptimizer {
  private static vietnamLocations: Location[] = [
    // Major Cities
    { name: 'TP. Hồ Chí Minh', address: 'Ho Chi Minh City, Vietnam', lat: 10.8231, lng: 106.6297, type: 'departure' },
    { name: 'Hà Nội', address: 'Hanoi, Vietnam', lat: 21.0285, lng: 105.8542, type: 'departure' },
    { name: 'Đà Nẵng', address: 'Da Nang, Vietnam', lat: 16.0544, lng: 108.2022, type: 'departure' },
    { name: 'Hải Phòng', address: 'Hai Phong, Vietnam', lat: 20.8449, lng: 106.6881, type: 'departure' },
    { name: 'Cần Thơ', address: 'Can Tho, Vietnam', lat: 10.0452, lng: 105.7469, type: 'departure' },
    { name: 'Biên Hòa', address: 'Bien Hoa, Dong Nai, Vietnam', lat: 10.9460, lng: 106.8234, type: 'departure' },
    { name: 'Huế', address: 'Hue, Vietnam', lat: 16.4637, lng: 107.5909, type: 'departure' },
    { name: 'Nha Trang', address: 'Nha Trang, Khanh Hoa, Vietnam', lat: 12.2388, lng: 109.1967, type: 'departure' },
    { name: 'Buôn Ma Thuột', address: 'Buon Ma Thuot, Dak Lak, Vietnam', lat: 12.6667, lng: 108.0500, type: 'departure' },
    { name: 'Quy Nhon', address: 'Quy Nhon, Binh Dinh, Vietnam', lat: 13.7563, lng: 109.2297, type: 'departure' },
    { name: 'Vũng Tàu', address: 'Vung Tau, Ba Ria-Vung Tau, Vietnam', lat: 10.4113, lng: 107.1365, type: 'departure' },
    { name: 'Nam Định', address: 'Nam Dinh, Vietnam', lat: 20.4388, lng: 106.1621, type: 'departure' },
    { name: 'Phan Thiết', address: 'Phan Thiet, Binh Thuan, Vietnam', lat: 10.9280, lng: 108.1020, type: 'departure' },
    { name: 'Long Xuyên', address: 'Long Xuyen, An Giang, Vietnam', lat: 10.3861, lng: 105.4358, type: 'departure' },
    { name: 'Thái Nguyên', address: 'Thai Nguyen, Vietnam', lat: 21.5944, lng: 105.8480, type: 'departure' },
    { name: 'Thanh Hóa', address: 'Thanh Hoa, Vietnam', lat: 19.8067, lng: 105.7851, type: 'departure' },
    { name: 'Rạch Giá', address: 'Rach Gia, Kien Giang, Vietnam', lat: 10.0120, lng: 105.0804, type: 'departure' },
    { name: 'Cam Ranh', address: 'Cam Ranh, Khanh Hoa, Vietnam', lat: 11.9214, lng: 109.1593, type: 'departure' },
    { name: 'Vĩnh Long', address: 'Vinh Long, Vietnam', lat: 10.2397, lng: 105.9571, type: 'departure' },
    { name: 'Mỹ Tho', address: 'My Tho, Tien Giang, Vietnam', lat: 10.3600, lng: 106.3600, type: 'departure' },

    // Major Depots/Warehouses
    { name: 'Kho Bình Dương', address: 'Binh Duong Industrial Park, Vietnam', lat: 10.9804, lng: 106.6519, type: 'depot' },
    { name: 'Kho Đồng Nai', address: 'Dong Nai Industrial Zone, Vietnam', lat: 10.9460, lng: 106.8234, type: 'depot' },
    { name: 'Kho Long An', address: 'Long An Logistics Center, Vietnam', lat: 10.6956, lng: 106.2431, type: 'depot' },
    { name: 'Kho Hà Đông', address: 'Ha Dong Warehouse, Hanoi, Vietnam', lat: 20.9721, lng: 105.7851, type: 'depot' },
    { name: 'Kho Đà Nẵng', address: 'Da Nang Port Warehouse, Vietnam', lat: 16.0544, lng: 108.2022, type: 'depot' },
    { name: 'Kho Cát Lái', address: 'Cat Lai Port, Ho Chi Minh City, Vietnam', lat: 10.7804, lng: 106.7980, type: 'depot' },
    { name: 'Kho Tân Cảng', address: 'Tan Cang Port, Ho Chi Minh City, Vietnam', lat: 10.7669, lng: 106.7009, type: 'depot' },
    { name: 'Kho Hải Phòng', address: 'Hai Phong Port Warehouse, Vietnam', lat: 20.8449, lng: 106.6881, type: 'depot' }
  ]

  static searchLocations(query: string): Location[] {
    if (!query.trim()) return this.vietnamLocations.slice(0, 10)
    
    const normalizedQuery = query.toLowerCase()
    return this.vietnamLocations.filter(location => 
      location.name.toLowerCase().includes(normalizedQuery) ||
      location.address.toLowerCase().includes(normalizedQuery)
    ).slice(0, 10)
  }

  static async optimizeRoute(request: RouteOptimizationRequest): Promise<OptimizedRoute> {
    // Calculate base distance using Haversine formula
    const distance = this.calculateDistance(
      request.departure.lat, request.departure.lng,
      request.destination.lat, request.destination.lng
    )

    // Find optimal depot if not specified
    let optimalDepot: Location | null = null
    if (request.depots && request.depots.length > 0) {
      optimalDepot = this.findOptimalDepot(request.departure, request.destination, request.depots)
    }

    // Calculate route with depot if applicable
    const waypoints: Location[] = [request.departure]
    let totalDistance = distance
    
    if (optimalDepot) {
      const depotDistance1 = this.calculateDistance(
        request.departure.lat, request.departure.lng,
        optimalDepot.lat, optimalDepot.lng
      )
      const depotDistance2 = this.calculateDistance(
        optimalDepot.lat, optimalDepot.lng,
        request.destination.lat, request.destination.lng
      )
      
      // Only use depot if it's beneficial (not too much detour)
      if (depotDistance1 + depotDistance2 < distance * 1.3) {
        waypoints.push(optimalDepot)
        totalDistance = depotDistance1 + depotDistance2
      }
    }
    
    waypoints.push(request.destination)

    // Calculate costs based on vehicle type and distance
    const costs = this.calculateCosts(totalDistance, request.vehicleType)
    
    // Assess risk level
    const riskLevel = this.assessRiskLevel(totalDistance, waypoints)
    
    // Generate recommendations
    const recommendations = this.generateRecommendations(request, totalDistance, optimalDepot)

    return {
      id: Date.now().toString(),
      waypoints,
      distance: Math.round(totalDistance),
      duration: Math.round(totalDistance / this.getAverageSpeed(request.vehicleType)),
      cost: costs,
      riskLevel,
      recommendations,
      polyline: this.generatePolyline(waypoints)
    }
  }

  private static calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371 // Earth's radius in kilometers
    const dLat = this.toRadians(lat2 - lat1)
    const dLng = this.toRadians(lng2 - lng1)
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) *
              Math.sin(dLng / 2) * Math.sin(dLng / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }

  private static toRadians(degrees: number): number {
    return degrees * (Math.PI / 180)
  }

  private static findOptimalDepot(departure: Location, destination: Location, depots: Location[]): Location {
    let optimalDepot = depots[0]
    let minTotalDistance = Infinity

    for (const depot of depots) {
      const distance1 = this.calculateDistance(departure.lat, departure.lng, depot.lat, depot.lng)
      const distance2 = this.calculateDistance(depot.lat, depot.lng, destination.lat, destination.lng)
      const totalDistance = distance1 + distance2

      if (totalDistance < minTotalDistance) {
        minTotalDistance = totalDistance
        optimalDepot = depot
      }
    }

    return optimalDepot
  }

  private static calculateCosts(distance: number, vehicleType: string) {
    const fuelConsumption = vehicleType === 'truck' ? 0.25 : vehicleType === 'van' ? 0.15 : 0.08 // L/km
    const fuelPrice = 24000 // VND per liter
    const tollRate = vehicleType === 'truck' ? 800 : vehicleType === 'van' ? 600 : 400 // VND per km
    const driverRate = vehicleType === 'truck' ? 500 : vehicleType === 'van' ? 400 : 300 // VND per km

    const fuel = Math.round(distance * fuelConsumption * fuelPrice)
    const tolls = Math.round(distance * tollRate)
    const driver = Math.round(distance * driverRate)
    const total = fuel + tolls + driver

    return { fuel, tolls, driver, total }
  }

  private static getAverageSpeed(vehicleType: string): number {
    switch (vehicleType) {
      case 'truck': return 45 // km/h
      case 'van': return 55 // km/h
      case 'car': return 65 // km/h
      default: return 50 // km/h
    }
  }

  private static assessRiskLevel(distance: number, waypoints: Location[]): 'low' | 'medium' | 'high' {
    let riskScore = 0

    // Distance factor
    if (distance > 1000) riskScore += 2
    else if (distance > 500) riskScore += 1

    // Route complexity
    if (waypoints.length > 2) riskScore += 1

    // Weather/seasonal factors (simplified)
    const month = new Date().getMonth()
    if (month >= 8 && month <= 11) riskScore += 1 // Rainy season

    if (riskScore >= 3) return 'high'
    if (riskScore >= 2) return 'medium'
    return 'low'
  }

  private static generateRecommendations(
    request: RouteOptimizationRequest, 
    distance: number, 
    depot: Location | null
  ): string[] {
    const recommendations: string[] = []

    // Time recommendations
    recommendations.push('Khởi hành lúc 5:00-7:00 sáng để tránh kẹt xe')

    // Fuel recommendations
    const fuelStops = Math.ceil(distance / 400)
    if (fuelStops > 1) {
      recommendations.push(`Cần ${fuelStops} điểm dừng đổ xăng trên tuyến đường`)
    }

    // Weather recommendations
    const month = new Date().getMonth()
    if (month >= 8 && month <= 11) {
      recommendations.push('Kiểm tra thời tiết - mùa mưa bão có thể ảnh hưởng')
    }

    // Depot recommendations
    if (depot) {
      recommendations.push(`Sử dụng ${depot.name} để tối ưu hóa chi phí và thời gian`)
    }

    // Route alternatives
    if (distance > 500) {
      recommendations.push('Có thể xem xét tuyến đường thay thế qua quốc lộ khác')
    }

    // Vehicle recommendations
    if (request.vehicleType === 'truck' && distance < 200) {
      recommendations.push('Xem xét sử dụng xe van để tiết kiệm chi phí cho tuyến ngắn')
    }

    return recommendations
  }

  private static generatePolyline(waypoints: Location[]): string {
    // Simplified polyline generation (in real implementation, use Google Maps API)
    return waypoints.map(wp => `${wp.lat},${wp.lng}`).join('|')
  }

  static getAvailableDepots(): Location[] {
    return this.vietnamLocations.filter(loc => loc.type === 'depot')
  }

  static getPopularRoutes(): Array<{departure: string, destination: string, frequency: number}> {
    return [
      { departure: 'TP. Hồ Chí Minh', destination: 'Hà Nội', frequency: 95 },
      { departure: 'Đà Nẵng', destination: 'TP. Hồ Chí Minh', frequency: 87 },
      { departure: 'Hà Nội', destination: 'Hải Phòng', frequency: 82 },
      { departure: 'TP. Hồ Chí Minh', destination: 'Cần Thơ', frequency: 78 },
      { departure: 'Biên Hòa', destination: 'Vũng Tàu', frequency: 71 },
      { departure: 'Đà Nẵng', destination: 'Hà Nội', frequency: 69 },
      { departure: 'Nha Trang', destination: 'TP. Hồ Chí Minh', frequency: 65 },
      { departure: 'Hải Phòng', destination: 'Đà Nẵng', frequency: 58 }
    ]
  }
}
