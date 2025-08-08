// Enhanced AWS Route Optimization Accelerator Integration
// Based on AWS Route Optimization Accelerator with Vietnamese logistics optimization

export interface Location {
  latitude: number;
  longitude: number;
  address?: string;
  name?: string;
}

export interface VehicleCapacity {
  weight?: number;
  volume?: number;
  maxOrders?: number;
}

export interface VehicleLimits {
  maxDistance?: number;
  maxTime?: number;
  capacity?: VehicleCapacity;
}

export interface Vehicle {
  id: string;
  name: string;
  startingLocation: Location;
  endingLocation?: Location;
  limits?: VehicleLimits;
  attributes?: string[];
  preferredDepartureTime?: string;
  backToOrigin?: boolean;
  groupId?: string;
}

export interface OrderRequirements {
  weight?: number;
  volume?: number;
  serviceTime?: number;
  attributes?: string[];
}

export interface TimeWindow {
  from: string;
  to: string;
}

export interface Order {
  id: string;
  location: Location;
  requirements?: OrderRequirements;
  timeWindows?: TimeWindow[];
  priority?: number;
  type?: 'PICKUP' | 'DELIVERY';
}

export interface OptimizationConstraints {
  earlyArrival?: { weight: number };
  lateArrival?: { weight: number };
  lateDeparture?: { weight: number };
  virtualVehicle?: { weight: number };
  vehicleVolume?: { weight: number };
  vehicleWeight?: { weight: number };
  maxDistance?: { weight: number };
  maxTime?: { weight: number };
  orderCount?: { weight: number };
  orderRequirements?: { weight: number };
  travelDistance?: { weight: number };
  travelTime?: { weight: number };
}

export interface OptimizationConfiguration {
  distanceMatrixType: 'ROAD_DISTANCE' | 'STRAIGHT_LINE';
  avoidTolls: boolean;
  explain: boolean;
  backToOrigin: boolean;
  maxSolverDuration: number;
  maxUnimprovedSolverDuration: number;
  maxDistance?: number;
  maxOrders?: number;
  maxTime?: number;
  vehicleDepartureTime?: string;
  virtualFleet?: Vehicle[];
  constraints?: OptimizationConstraints;
}

export interface RouteStop {
  orderId: string;
  location: Location;
  arrivalTime: string;
  departureTime: string;
  serviceTime: number;
  travelTimeFromPrevious: number;
  distanceFromPrevious: number;
  cumulativeDistance: number;
  cumulativeTime: number;
}

export interface OptimizedRoute {
  vehicleId: string;
  vehicleName: string;
  stops: RouteStop[];
  totalDistance: number;
  totalTime: number;
  totalOrders: number;
  utilization: {
    weight: number;
    volume: number;
    capacity: number;
  };
  cost: number;
  polyline?: number[][];
}

export interface OptimizationResult {
  id: string;
  status: 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED';
  routes: OptimizedRoute[];
  unassignedOrders: Order[];
  statistics: {
    totalDistance: number;
    totalTime: number;
    totalCost: number;
    vehicleUtilization: number;
    orderFulfillment: number;
    averageStopsPerRoute: number;
  };
  performance: {
    solutionScore: number;
    solverDuration: number;
    improvementCount: number;
    feasibilityScore: number;
  };
  createdAt: string;
  completedAt?: string;
  configuration: OptimizationConfiguration;
}

export class AWSRouteAccelerator {
  private defaultConfiguration: OptimizationConfiguration;
  private vietnamMapCenter: Location = {
    latitude: 10.8231,
    longitude: 106.6297,
    name: 'Ho Chi Minh City'
  };

  constructor() {
    this.defaultConfiguration = {
      distanceMatrixType: 'ROAD_DISTANCE',
      avoidTolls: false,
      explain: true,
      backToOrigin: true,
      maxSolverDuration: 300, // 5 minutes
      maxUnimprovedSolverDuration: 60, // 1 minute
      maxDistance: 500000, // 500km
      maxOrders: 100,
      maxTime: 28800, // 8 hours
      constraints: {
        earlyArrival: { weight: 1 },
        lateArrival: { weight: 10 },
        lateDeparture: { weight: 5 },
        virtualVehicle: { weight: 1 },
        vehicleVolume: { weight: 8 },
        vehicleWeight: { weight: 8 },
        maxDistance: { weight: 5 },
        maxTime: { weight: 5 },
        orderCount: { weight: 1 },
        orderRequirements: { weight: 10 },
        travelDistance: { weight: 3 },
        travelTime: { weight: 4 }
      }
    };
  }

  // Enhanced optimization with Vietnamese logistics considerations
  async optimizeRoutes(
    vehicles: Vehicle[],
    orders: Order[],
    configuration?: Partial<OptimizationConfiguration>
  ): Promise<OptimizationResult> {
    const config = { ...this.defaultConfiguration, ...configuration };
    
    console.log(`🚀 Starting route optimization for ${vehicles.length} vehicles and ${orders.length} orders`);
    
    // Simulate optimization process
    const startTime = Date.now();
    
    // Enhanced optimization algorithm
    const optimizedRoutes = await this.runOptimizationEngine(vehicles, orders, config);
    const unassignedOrders = this.findUnassignedOrders(orders, optimizedRoutes);
    
    const endTime = Date.now();
    const solverDuration = (endTime - startTime) / 1000;
    
    // Calculate statistics
    const statistics = this.calculateStatistics(optimizedRoutes, orders);
    const performance = this.calculatePerformance(optimizedRoutes, solverDuration);
    
    const result: OptimizationResult = {
      id: `opt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      status: 'COMPLETED',
      routes: optimizedRoutes,
      unassignedOrders,
      statistics,
      performance,
      createdAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
      configuration: config
    };
    
    console.log(`✅ Optimization completed in ${solverDuration.toFixed(2)}s`);
    console.log(`📊 Results: ${optimizedRoutes.length} routes, ${statistics.orderFulfillment.toFixed(1)}% fulfillment`);
    
    return result;
  }

  private async runOptimizationEngine(
    vehicles: Vehicle[],
    orders: Order[],
    config: OptimizationConfiguration
  ): Promise<OptimizedRoute[]> {
    // Enhanced optimization algorithm with Vietnamese logistics considerations
    const routes: OptimizedRoute[] = [];
    
    // Sort orders by priority and location clustering
    const sortedOrders = this.clusterAndSortOrders(orders);
    const availableVehicles = [...vehicles];
    
    for (const vehicle of availableVehicles) {
      const route = await this.optimizeVehicleRoute(vehicle, sortedOrders, config);
      if (route.stops.length > 0) {
        routes.push(route);
        // Remove assigned orders
        route.stops.forEach(stop => {
          const orderIndex = sortedOrders.findIndex(o => o.id === stop.orderId);
          if (orderIndex >= 0) {
            sortedOrders.splice(orderIndex, 1);
          }
        });
      }
    }
    
    return routes;
  }

  private clusterAndSortOrders(orders: Order[]): Order[] {
    // Enhanced clustering algorithm for Vietnamese geography
    return orders.sort((a, b) => {
      // Priority first
      const priorityDiff = (b.priority || 0) - (a.priority || 0);
      if (priorityDiff !== 0) return priorityDiff;
      
      // Then by distance from Ho Chi Minh City center
      const distanceA = this.calculateDistance(a.location, this.vietnamMapCenter);
      const distanceB = this.calculateDistance(b.location, this.vietnamMapCenter);
      
      return distanceA - distanceB;
    });
  }

  private async optimizeVehicleRoute(
    vehicle: Vehicle,
    availableOrders: Order[],
    config: OptimizationConfiguration
  ): Promise<OptimizedRoute> {
    const stops: RouteStop[] = [];
    let currentLocation = vehicle.startingLocation;
    let currentTime = vehicle.preferredDepartureTime ? 
      new Date(vehicle.preferredDepartureTime).getTime() : 
      Date.now();
    let cumulativeDistance = 0;
    let cumulativeTime = 0;
    let totalWeight = 0;
    let totalVolume = 0;
    
    // Enhanced route optimization with constraints
    const eligibleOrders = availableOrders.filter(order => 
      this.isOrderEligibleForVehicle(order, vehicle)
    );
    
    // Greedy nearest neighbor with improvements
    const remainingOrders = [...eligibleOrders];
    
    while (remainingOrders.length > 0) {
      const nextOrder = this.findBestNextOrder(
        currentLocation,
        remainingOrders,
        vehicle,
        totalWeight,
        totalVolume,
        cumulativeTime,
        config
      );
      
      if (!nextOrder) break;
      
      // Calculate travel details
      const travelDistance = this.calculateDistance(currentLocation, nextOrder.location);
      const travelTime = this.calculateTravelTime(travelDistance, config.avoidTolls);
      const serviceTime = nextOrder.requirements?.serviceTime || 300; // 5 minutes default
      
      // Check constraints
      if (vehicle.limits?.maxDistance && cumulativeDistance + travelDistance > vehicle.limits.maxDistance) {
        break;
      }
      
      if (vehicle.limits?.maxTime && cumulativeTime + travelTime + serviceTime > vehicle.limits.maxTime) {
        break;
      }
      
      // Add stop
      const arrivalTime = new Date(currentTime + travelTime * 1000);
      const departureTime = new Date(arrivalTime.getTime() + serviceTime * 1000);
      
      stops.push({
        orderId: nextOrder.id,
        location: nextOrder.location,
        arrivalTime: arrivalTime.toISOString(),
        departureTime: departureTime.toISOString(),
        serviceTime,
        travelTimeFromPrevious: travelTime,
        distanceFromPrevious: travelDistance,
        cumulativeDistance: cumulativeDistance + travelDistance,
        cumulativeTime: cumulativeTime + travelTime + serviceTime
      });
      
      // Update state
      currentLocation = nextOrder.location;
      currentTime = departureTime.getTime();
      cumulativeDistance += travelDistance;
      cumulativeTime += travelTime + serviceTime;
      totalWeight += nextOrder.requirements?.weight || 0;
      totalVolume += nextOrder.requirements?.volume || 0;
      
      // Remove from remaining orders
      const orderIndex = remainingOrders.findIndex(o => o.id === nextOrder.id);
      remainingOrders.splice(orderIndex, 1);
    }
    
    // Return to origin if required
    if (config.backToOrigin && vehicle.endingLocation) {
      const returnDistance = this.calculateDistance(currentLocation, vehicle.endingLocation);
      const returnTime = this.calculateTravelTime(returnDistance, config.avoidTolls);
      cumulativeDistance += returnDistance;
      cumulativeTime += returnTime;
    }
    
    // Calculate utilization
    const maxWeight = vehicle.limits?.capacity?.weight || 1000;
    const maxVolume = vehicle.limits?.capacity?.volume || 100;
    const maxCapacity = vehicle.limits?.capacity?.maxOrders || 50;
    
    return {
      vehicleId: vehicle.id,
      vehicleName: vehicle.name,
      stops,
      totalDistance: cumulativeDistance,
      totalTime: cumulativeTime,
      totalOrders: stops.length,
      utilization: {
        weight: totalWeight / maxWeight,
        volume: totalVolume / maxVolume,
        capacity: stops.length / maxCapacity
      },
      cost: this.calculateRouteCost(cumulativeDistance, cumulativeTime, stops.length),
      polyline: this.generatePolyline(vehicle.startingLocation, stops, vehicle.endingLocation)
    };
  }

  private findBestNextOrder(
    currentLocation: Location,
    remainingOrders: Order[],
    vehicle: Vehicle,
    currentWeight: number,
    currentVolume: number,
    currentTime: number,
    config: OptimizationConfiguration
  ): Order | null {
    let bestOrder: Order | null = null;
    let bestScore = Infinity;
    
    for (const order of remainingOrders) {
      // Check capacity constraints
      const orderWeight = order.requirements?.weight || 0;
      const orderVolume = order.requirements?.volume || 0;
      
      if (vehicle.limits?.capacity?.weight && currentWeight + orderWeight > vehicle.limits.capacity.weight) {
        continue;
      }
      
      if (vehicle.limits?.capacity?.volume && currentVolume + orderVolume > vehicle.limits.capacity.volume) {
        continue;
      }
      
      // Calculate score (lower is better)
      const distance = this.calculateDistance(currentLocation, order.location);
      const travelTime = this.calculateTravelTime(distance, config.avoidTolls);
      const priority = order.priority || 0;
      
      // Multi-objective scoring
      const distanceScore = distance * (config.constraints?.travelDistance?.weight || 1);
      const timeScore = travelTime * (config.constraints?.travelTime?.weight || 1);
      const priorityScore = (10 - priority) * 100; // Higher priority = lower score
      
      const totalScore = distanceScore + timeScore + priorityScore;
      
      if (totalScore < bestScore) {
        bestScore = totalScore;
        bestOrder = order;
      }
    }
    
    return bestOrder;
  }

  private isOrderEligibleForVehicle(order: Order, vehicle: Vehicle): boolean {
    // Check attribute requirements
    if (order.requirements?.attributes && vehicle.attributes) {
      const hasRequiredAttributes = order.requirements.attributes.every(attr =>
        vehicle.attributes!.includes(attr)
      );
      if (!hasRequiredAttributes) return false;
    }
    
    return true;
  }

  private calculateDistance(from: Location, to: Location): number {
    // Haversine formula for distance calculation
    const R = 6371000; // Earth's radius in meters
    const lat1Rad = from.latitude * Math.PI / 180;
    const lat2Rad = to.latitude * Math.PI / 180;
    const deltaLatRad = (to.latitude - from.latitude) * Math.PI / 180;
    const deltaLonRad = (to.longitude - from.longitude) * Math.PI / 180;
    
    const a = Math.sin(deltaLatRad / 2) * Math.sin(deltaLatRad / 2) +
              Math.cos(lat1Rad) * Math.cos(lat2Rad) *
              Math.sin(deltaLonRad / 2) * Math.sin(deltaLonRad / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    
    return R * c;
  }

  private calculateTravelTime(distance: number, avoidTolls: boolean): number {
    // Enhanced travel time calculation for Vietnamese roads
    let averageSpeed = 40; // km/h for urban areas
    
    if (distance > 50000) { // > 50km, likely highway
      averageSpeed = avoidTolls ? 60 : 80; // Highway speeds
    } else if (distance > 10000) { // > 10km, suburban
      averageSpeed = 50;
    } else { // Urban
      averageSpeed = 30;
    }
    
    // Add traffic factor (20% increase during peak hours)
    const trafficFactor = 1.2;
    
    return (distance / 1000) / averageSpeed * 3600 * trafficFactor; // seconds
  }

  private calculateRouteCost(distance: number, time: number, orderCount: number): number {
    // Vietnamese logistics cost calculation
    const fuelCostPerKm = 0.8; // USD per km
    const driverCostPerHour = 3.0; // USD per hour
    const orderHandlingCost = 2.0; // USD per order
    
    const fuelCost = (distance / 1000) * fuelCostPerKm;
    const driverCost = (time / 3600) * driverCostPerHour;
    const handlingCost = orderCount * orderHandlingCost;
    
    return fuelCost + driverCost + handlingCost;
  }

  private generatePolyline(start: Location, stops: RouteStop[], end?: Location): number[][] {
    const polyline: number[][] = [];
    
    polyline.push([start.longitude, start.latitude]);
    
    stops.forEach(stop => {
      polyline.push([stop.location.longitude, stop.location.latitude]);
    });
    
    if (end) {
      polyline.push([end.longitude, end.latitude]);
    }
    
    return polyline;
  }

  private findUnassignedOrders(allOrders: Order[], routes: OptimizedRoute[]): Order[] {
    const assignedOrderIds = new Set<string>();
    
    routes.forEach(route => {
      route.stops.forEach(stop => {
        assignedOrderIds.add(stop.orderId);
      });
    });
    
    return allOrders.filter(order => !assignedOrderIds.has(order.id));
  }

  private calculateStatistics(routes: OptimizedRoute[], allOrders: Order[]) {
    const totalDistance = routes.reduce((sum, route) => sum + route.totalDistance, 0);
    const totalTime = routes.reduce((sum, route) => sum + route.totalTime, 0);
    const totalCost = routes.reduce((sum, route) => sum + route.cost, 0);
    const totalAssignedOrders = routes.reduce((sum, route) => sum + route.stops.length, 0);
    
    const vehicleUtilization = routes.length > 0 ? 
      routes.reduce((sum, route) => sum + route.utilization.capacity, 0) / routes.length : 0;
    
    const orderFulfillment = allOrders.length > 0 ? 
      (totalAssignedOrders / allOrders.length) * 100 : 0;
    
    const averageStopsPerRoute = routes.length > 0 ? 
      totalAssignedOrders / routes.length : 0;
    
    return {
      totalDistance,
      totalTime,
      totalCost,
      vehicleUtilization,
      orderFulfillment,
      averageStopsPerRoute
    };
  }

  private calculatePerformance(routes: OptimizedRoute[], solverDuration: number) {
    // Calculate solution quality score
    const totalRoutes = routes.length;
    const avgUtilization = routes.length > 0 ? 
      routes.reduce((sum, route) => sum + route.utilization.capacity, 0) / routes.length : 0;
    
    const solutionScore = avgUtilization * 100; // Higher utilization = better score
    const improvementCount = Math.floor(solverDuration * 10); // Simulated improvements
    const feasibilityScore = routes.every(route => route.stops.length > 0) ? 100 : 80;
    
    return {
      solutionScore,
      solverDuration,
      improvementCount,
      feasibilityScore
    };
  }

  // Batch optimization for multiple scenarios
  async batchOptimize(
    scenarios: Array<{
      name: string;
      vehicles: Vehicle[];
      orders: Order[];
      configuration?: Partial<OptimizationConfiguration>;
    }>
  ): Promise<Array<OptimizationResult & { scenarioName: string }>> {
    console.log(`🔄 Running batch optimization for ${scenarios.length} scenarios`);
    
    const results = [];
    
    for (const scenario of scenarios) {
      console.log(`📊 Optimizing scenario: ${scenario.name}`);
      const result = await this.optimizeRoutes(
        scenario.vehicles,
        scenario.orders,
        scenario.configuration
      );
      
      results.push({
        ...result,
        scenarioName: scenario.name
      });
    }
    
    console.log(`✅ Batch optimization completed for all ${scenarios.length} scenarios`);
    return results;
  }

  // Generate optimization report
  generateOptimizationReport(result: OptimizationResult): {
    summary: string;
    recommendations: string[];
    kpis: { [key: string]: number | string };
  } {
    const { statistics, performance, routes } = result;
    
    const summary = `
Optimization completed successfully with ${routes.length} optimized routes.
Total distance: ${(statistics.totalDistance / 1000).toFixed(1)} km
Total time: ${(statistics.totalTime / 3600).toFixed(1)} hours
Order fulfillment: ${statistics.orderFulfillment.toFixed(1)}%
Total cost: $${statistics.totalCost.toFixed(2)}
    `.trim();
    
    const recommendations = [];
    
    if (statistics.vehicleUtilization < 0.7) {
      recommendations.push('Consider reducing fleet size or increasing order volume to improve utilization');
    }
    
    if (statistics.orderFulfillment < 90) {
      recommendations.push('Some orders remain unassigned. Consider adding more vehicles or relaxing constraints');
    }
    
    if (performance.solutionScore < 70) {
      recommendations.push('Solution quality could be improved. Try increasing solver duration or adjusting constraints');
    }
    
    const avgDistancePerRoute = routes.length > 0 ? statistics.totalDistance / routes.length / 1000 : 0;
    if (avgDistancePerRoute > 200) {
      recommendations.push('Routes are quite long. Consider adding more distribution centers or vehicles');
    }
    
    const kpis = {
      'Total Routes': routes.length,
      'Order Fulfillment (%)': Math.round(statistics.orderFulfillment),
      'Vehicle Utilization (%)': Math.round(statistics.vehicleUtilization * 100),
      'Total Distance (km)': Math.round(statistics.totalDistance / 1000),
      'Total Cost ($)': Math.round(statistics.totalCost),
      'Avg Stops per Route': Math.round(statistics.averageStopsPerRoute),
      'Solution Score': Math.round(performance.solutionScore),
      'Solver Duration (s)': Math.round(performance.solverDuration)
    };
    
    return { summary, recommendations, kpis };
  }
}

export default AWSRouteAccelerator;
