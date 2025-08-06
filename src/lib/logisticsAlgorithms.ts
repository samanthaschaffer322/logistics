// Logistics Operations Algorithms
// AI-powered trip consolidation, cost calculation, and optimization

export interface Location {
  lat: number
  lng: number
  address?: string
}

export interface Order {
  id: string
  pickup_location: Location
  dropoff_location: Location
  load_type: 'dry' | 'frozen' | 'fragile' | 'liquid'
  weight_kg: number
  volume_m3: number
  scheduled_time: string
  status: 'pending' | 'assigned' | 'in_transit' | 'delivered'
  customer_id: string
  priority: 'low' | 'medium' | 'high'
  special_requirements?: string
}

export interface Truck {
  id: string
  plate_number: string
  capacity_kg: number
  volume_m3: number
  load_types: string[]
  current_location: Location
  status: 'available' | 'on_trip' | 'maintenance'
  driver_name: string
  fuel_efficiency: number // liters per km
}

export interface Trip {
  id: string
  orders: Order[]
  truck: Truck
  total_distance_km: number
  estimated_fuel_l: number
  estimated_toll_vnd: number
  total_cost_vnd: number
  status: 'planned' | 'in_progress' | 'completed'
  start_time: string
  estimated_end_time: string
  route_optimization_score: number
  fuel_allowance_vnd: number
  toll_allowance_vnd: number
}

export interface ConsolidationResult {
  trips: Trip[]
  unassigned_orders: Order[]
  efficiency_score: number
  cost_savings_vnd: number
  recommendations: string[]
}

// Haversine distance calculation
export function calculateDistance(loc1: Location, loc2: Location): number {
  const R = 6371 // Earth's radius in km
  const dLat = (loc2.lat - loc1.lat) * Math.PI / 180
  const dLng = (loc2.lng - loc1.lng) * Math.PI / 180
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(loc1.lat * Math.PI / 180) * Math.cos(loc2.lat * Math.PI / 180) * 
    Math.sin(dLng/2) * Math.sin(dLng/2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  return R * c
}

// Enhanced fuel calculation for 40ft trucks
export function calculateFuelConsumption(distance_km: number, weight_kg: number): number {
  const base_rate = 0.3 // liters/km when empty
  const weight_factor = 0.000004 // scaling for heavy trucks
  return distance_km * (base_rate + weight_factor * weight_kg)
}

// Toll estimation based on Vietnam highway system
export function estimateToll(distance_km: number, route_type: 'highway' | 'normal' = 'highway'): number {
  const toll_rates = {
    highway: 1200, // VND per km for highways
    normal: 400    // VND per km for normal roads
  }
  return distance_km * toll_rates[route_type]
}

// Group orders by proximity using spatial clustering
export function groupOrdersByProximity(orders: Order[], radius_km: number = 50): Order[][] {
  const groups: Order[][] = []
  const unassigned = [...orders]
  
  while (unassigned.length > 0) {
    const base = unassigned.shift()!
    const group = [base]
    
    // Find orders within radius of base order's dropoff location
    for (let i = unassigned.length - 1; i >= 0; i--) {
      const order = unassigned[i]
      const distance = calculateDistance(base.dropoff_location, order.dropoff_location)
      
      if (distance <= radius_km && order.load_type === base.load_type) {
        group.push(order)
        unassigned.splice(i, 1)
      }
    }
    
    groups.push(group)
  }
  
  return groups
}

// Select optimal truck for a group of orders
export function selectOptimalTruck(orderGroup: Order[], availableTrucks: Truck[]): Truck | null {
  const totalWeight = orderGroup.reduce((sum, order) => sum + order.weight_kg, 0)
  const totalVolume = orderGroup.reduce((sum, order) => sum + order.volume_m3, 0)
  const loadType = orderGroup[0].load_type
  
  // Filter compatible trucks
  const compatibleTrucks = availableTrucks.filter(truck => 
    truck.status === 'available' &&
    truck.capacity_kg >= totalWeight &&
    truck.volume_m3 >= totalVolume &&
    truck.load_types.includes(loadType)
  )
  
  if (compatibleTrucks.length === 0) return null
  
  // Select truck with best efficiency score
  return compatibleTrucks.reduce((best, current) => {
    const bestScore = calculateTruckEfficiencyScore(best, orderGroup)
    const currentScore = calculateTruckEfficiencyScore(current, orderGroup)
    return currentScore > bestScore ? current : best
  })
}

// Calculate truck efficiency score
function calculateTruckEfficiencyScore(truck: Truck, orders: Order[]): number {
  const totalWeight = orders.reduce((sum, order) => sum + order.weight_kg, 0)
  const totalVolume = orders.reduce((sum, order) => sum + order.volume_m3, 0)
  
  // Efficiency factors
  const weightUtilization = totalWeight / truck.capacity_kg
  const volumeUtilization = totalVolume / truck.volume_m3
  const fuelEfficiency = 1 / truck.fuel_efficiency // Lower fuel consumption = higher score
  
  // Weighted score (prefer high utilization but not overloading)
  return (weightUtilization * 0.4 + volumeUtilization * 0.4 + fuelEfficiency * 0.2) * 100
}

// Calculate route distance for multiple stops
export function calculateRouteDistance(locations: Location[]): number {
  if (locations.length < 2) return 0
  
  let totalDistance = 0
  for (let i = 0; i < locations.length - 1; i++) {
    totalDistance += calculateDistance(locations[i], locations[i + 1])
  }
  return totalDistance
}

// Optimize delivery sequence using nearest neighbor heuristic
export function optimizeDeliverySequence(orders: Order[], startLocation: Location): Order[] {
  if (orders.length <= 1) return orders
  
  const optimized: Order[] = []
  const remaining = [...orders]
  let currentLocation = startLocation
  
  while (remaining.length > 0) {
    // Find nearest order
    let nearestIndex = 0
    let nearestDistance = calculateDistance(currentLocation, remaining[0].dropoff_location)
    
    for (let i = 1; i < remaining.length; i++) {
      const distance = calculateDistance(currentLocation, remaining[i].dropoff_location)
      if (distance < nearestDistance) {
        nearestDistance = distance
        nearestIndex = i
      }
    }
    
    // Add nearest order to optimized sequence
    const nearestOrder = remaining.splice(nearestIndex, 1)[0]
    optimized.push(nearestOrder)
    currentLocation = nearestOrder.dropoff_location
  }
  
  return optimized
}

// Main trip consolidation algorithm
export function consolidateTrips(orders: Order[], trucks: Truck[]): ConsolidationResult {
  const availableTrucks = trucks.filter(truck => truck.status === 'available')
  const pendingOrders = orders.filter(order => order.status === 'pending')
  
  // Group orders by proximity and load type
  const orderGroups = groupOrdersByProximity(pendingOrders)
  
  const trips: Trip[] = []
  const unassignedOrders: Order[] = []
  let totalCostSavings = 0
  
  for (const group of orderGroups) {
    const truck = selectOptimalTruck(group, availableTrucks)
    
    if (truck) {
      // Optimize delivery sequence
      const optimizedOrders = optimizeDeliverySequence(group, truck.current_location)
      
      // Calculate route
      const locations = [
        truck.current_location,
        ...optimizedOrders.map(order => order.pickup_location),
        ...optimizedOrders.map(order => order.dropoff_location)
      ]
      
      const totalDistance = calculateRouteDistance(locations)
      const totalWeight = optimizedOrders.reduce((sum, order) => sum + order.weight_kg, 0)
      const estimatedFuel = calculateFuelConsumption(totalDistance, totalWeight)
      const estimatedToll = estimateToll(totalDistance)
      
      // Calculate costs
      const fuelCost = estimatedFuel * 27000 // 27,000 VND per liter
      const tollCost = estimatedToll
      const totalCost = fuelCost + tollCost
      
      // Create trip
      const trip: Trip = {
        id: `TRIP_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        orders: optimizedOrders,
        truck,
        total_distance_km: totalDistance,
        estimated_fuel_l: estimatedFuel,
        estimated_toll_vnd: tollCost,
        total_cost_vnd: totalCost,
        status: 'planned',
        start_time: new Date().toISOString(),
        estimated_end_time: new Date(Date.now() + (totalDistance / 60) * 60 * 60 * 1000).toISOString(),
        route_optimization_score: calculateRouteOptimizationScore(optimizedOrders, totalDistance),
        fuel_allowance_vnd: Math.ceil(fuelCost * 1.1), // 10% buffer
        toll_allowance_vnd: Math.ceil(tollCost * 1.05)  // 5% buffer
      }
      
      trips.push(trip)
      
      // Remove truck from available list
      const truckIndex = availableTrucks.findIndex(t => t.id === truck.id)
      if (truckIndex !== -1) {
        availableTrucks.splice(truckIndex, 1)
      }
      
      // Calculate cost savings (vs individual trips)
      const individualCost = optimizedOrders.reduce((sum, order) => {
        const distance = calculateDistance(truck.current_location, order.dropoff_location) * 2
        const fuel = calculateFuelConsumption(distance, order.weight_kg)
        return sum + (fuel * 27000) + estimateToll(distance)
      }, 0)
      
      totalCostSavings += individualCost - totalCost
      
    } else {
      unassignedOrders.push(...group)
    }
  }
  
  // Calculate efficiency score
  const assignedOrders = trips.reduce((sum, trip) => sum + trip.orders.length, 0)
  const efficiencyScore = (assignedOrders / pendingOrders.length) * 100
  
  // Generate recommendations
  const recommendations = generateRecommendations(trips, unassignedOrders, trucks)
  
  return {
    trips,
    unassigned_orders: unassignedOrders,
    efficiency_score: efficiencyScore,
    cost_savings_vnd: totalCostSavings,
    recommendations
  }
}

// Calculate route optimization score
function calculateRouteOptimizationScore(orders: Order[], totalDistance: number): number {
  if (orders.length <= 1) return 100
  
  // Calculate theoretical minimum distance (straight line)
  const directDistance = orders.reduce((sum, order) => 
    sum + calculateDistance(order.pickup_location, order.dropoff_location), 0
  )
  
  // Score based on how close actual route is to theoretical minimum
  const efficiency = (directDistance / totalDistance) * 100
  return Math.min(100, Math.max(0, efficiency))
}

// Generate AI recommendations
function generateRecommendations(trips: Trip[], unassignedOrders: Order[], trucks: Truck[]): string[] {
  const recommendations: string[] = []
  
  if (unassignedOrders.length > 0) {
    recommendations.push(`${unassignedOrders.length} đơn hàng chưa được phân công. Cần thêm xe hoặc điều chỉnh lịch trình.`)
  }
  
  const maintenanceTrucks = trucks.filter(t => t.status === 'maintenance').length
  if (maintenanceTrucks > 0) {
    recommendations.push(`${maintenanceTrucks} xe đang bảo trì. Cân nhắc thuê xe ngoài nếu cần thiết.`)
  }
  
  const lowEfficiencyTrips = trips.filter(t => t.route_optimization_score < 70)
  if (lowEfficiencyTrips.length > 0) {
    recommendations.push(`${lowEfficiencyTrips.length} chuyến có hiệu suất tuyến đường thấp. Xem xét tối ưu lại.`)
  }
  
  const highCostTrips = trips.filter(t => t.total_cost_vnd > 5000000)
  if (highCostTrips.length > 0) {
    recommendations.push(`${highCostTrips.length} chuyến có chi phí cao (>5M VND). Kiểm tra tối ưu hóa.`)
  }
  
  if (recommendations.length === 0) {
    recommendations.push('Tất cả chuyến đã được tối ưu hóa tốt. Hệ thống hoạt động hiệu quả.')
  }
  
  return recommendations
}

// Real-time monitoring functions
export function calculateTripProgress(trip: Trip): number {
  const now = new Date()
  const start = new Date(trip.start_time)
  const end = new Date(trip.estimated_end_time)
  
  const totalDuration = end.getTime() - start.getTime()
  const elapsed = now.getTime() - start.getTime()
  
  return Math.min(100, Math.max(0, (elapsed / totalDuration) * 100))
}

export function detectDelays(trips: Trip[]): Trip[] {
  const now = new Date()
  return trips.filter(trip => {
    const estimatedEnd = new Date(trip.estimated_end_time)
    const progress = calculateTripProgress(trip)
    
    // Consider delayed if progress is significantly behind schedule
    const expectedProgress = Math.min(100, ((now.getTime() - new Date(trip.start_time).getTime()) / 
      (estimatedEnd.getTime() - new Date(trip.start_time).getTime())) * 100)
    
    return progress < expectedProgress - 20 // 20% tolerance
  })
}

// Cost analysis functions
export function analyzeCostEfficiency(trips: Trip[]): {
  averageCostPerKm: number
  averageFuelEfficiency: number
  totalSavings: number
  recommendations: string[]
} {
  if (trips.length === 0) {
    return {
      averageCostPerKm: 0,
      averageFuelEfficiency: 0,
      totalSavings: 0,
      recommendations: ['Không có dữ liệu chuyến để phân tích']
    }
  }
  
  const totalDistance = trips.reduce((sum, trip) => sum + trip.total_distance_km, 0)
  const totalCost = trips.reduce((sum, trip) => sum + trip.total_cost_vnd, 0)
  const totalFuel = trips.reduce((sum, trip) => sum + trip.estimated_fuel_l, 0)
  
  const averageCostPerKm = totalCost / totalDistance
  const averageFuelEfficiency = totalFuel / totalDistance
  
  // Calculate potential savings
  const potentialSavings = trips.reduce((sum, trip) => {
    const currentEfficiency = trip.estimated_fuel_l / trip.total_distance_km
    const optimalEfficiency = 0.35 // Target efficiency
    const savingsL = Math.max(0, (currentEfficiency - optimalEfficiency) * trip.total_distance_km)
    return sum + (savingsL * 27000)
  }, 0)
  
  const recommendations: string[] = []
  
  if (averageFuelEfficiency > 0.4) {
    recommendations.push('Hiệu suất nhiên liệu thấp. Cần kiểm tra bảo trì xe và tối ưu tuyến đường.')
  }
  
  if (averageCostPerKm > 15000) {
    recommendations.push('Chi phí trên km cao. Xem xét tối ưu hóa tuyến đường và tải trọng.')
  }
  
  if (potentialSavings > 1000000) {
    recommendations.push(`Có thể tiết kiệm ${(potentialSavings/1000000).toFixed(1)}M VND bằng cách tối ưu hiệu suất nhiên liệu.`)
  }
  
  return {
    averageCostPerKm,
    averageFuelEfficiency,
    totalSavings: potentialSavings,
    recommendations
  }
}
