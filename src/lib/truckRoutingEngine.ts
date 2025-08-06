import * as turf from '@turf/turf';

// Types for truck routing
export interface TruckSpecs {
  type: '20ft' | '40ft' | 'container_truck';
  weight_kg: number;
  length_m: number;
  width_m: number;
  height_m: number;
  fuel_consumption_l_per_100km: number;
  max_speed_kmh: number;
}

export interface RoutePoint {
  lat: number;
  lng: number;
  address: string;
  name: string;
  type: 'origin' | 'destination' | 'depot' | 'stop';
}

export interface RouteRequest {
  origin: RoutePoint;
  destination: RoutePoint;
  truck_specs: TruckSpecs;
  departure_time: string; // ISO format
  stops?: RoutePoint[];
  avoid_tolls?: boolean;
  avoid_highways?: boolean;
}

export interface RouteResponse {
  route: {
    coordinates: [number, number][];
    distance_km: number;
    duration_minutes: number;
    instructions: RouteInstruction[];
  };
  cost_analysis: {
    fuel_cost_vnd: number;
    toll_cost_vnd: number;
    total_cost_vnd: number;
    co2_emission_kg: number;
  };
  restrictions: {
    violations: RestrictionViolation[];
    warnings: string[];
    alternative_times: string[];
  };
  traffic_analysis: {
    congestion_level: 'low' | 'medium' | 'high';
    delay_minutes: number;
    rush_hour_impact: boolean;
  };
}

export interface RouteInstruction {
  distance_km: number;
  duration_minutes: number;
  instruction: string;
  coordinates: [number, number];
  restriction_warning?: string;
}

export interface RestrictionViolation {
  type: 'time_restriction' | 'weight_restriction' | 'size_restriction' | 'zone_restriction';
  location: string;
  description: string;
  severity: 'error' | 'warning';
  suggested_alternative?: string;
}

// Vietnam truck specifications
export const VIETNAM_TRUCK_SPECS: Record<string, TruckSpecs> = {
  '20ft': {
    type: '20ft',
    weight_kg: 24000, // Max gross weight
    length_m: 6.1,
    width_m: 2.44,
    height_m: 2.59,
    fuel_consumption_l_per_100km: 28,
    max_speed_kmh: 80
  },
  '40ft': {
    type: '40ft',
    weight_kg: 32000, // Max gross weight for Vietnam roads
    length_m: 12.2,
    width_m: 2.44,
    height_m: 2.59,
    fuel_consumption_l_per_100km: 35,
    max_speed_kmh: 80
  },
  'container_truck': {
    type: 'container_truck',
    weight_kg: 35000,
    length_m: 16.5,
    width_m: 2.5,
    height_m: 4.0,
    fuel_consumption_l_per_100km: 40,
    max_speed_kmh: 70
  }
};

// Vietnam road restrictions database
export const VIETNAM_ROAD_RESTRICTIONS = {
  cities: {
    'ho_chi_minh': {
      name: 'Ho Chi Minh City',
      truck_ban_hours: [
        { start: '06:00', end: '09:00', days: ['mon', 'tue', 'wed', 'thu', 'fri'] },
        { start: '16:00', end: '20:00', days: ['mon', 'tue', 'wed', 'thu', 'fri'] }
      ],
      restricted_zones: [
        {
          name: 'District 1 Center',
          polygon: [
            [106.6917, 10.7769], [106.7031, 10.7769],
            [106.7031, 10.7831], [106.6917, 10.7831], [106.6917, 10.7769]
          ],
          restriction_type: 'no_trucks_over_10_tons',
          hours: 'all_day'
        },
        {
          name: 'Nguyen Hue Walking Street',
          polygon: [
            [106.7017, 10.7743], [106.7031, 10.7743],
            [106.7031, 10.7769], [106.7017, 10.7769], [106.7017, 10.7743]
          ],
          restriction_type: 'no_trucks',
          hours: 'all_day'
        }
      ],
      designated_truck_routes: [
        'Ring Road 2', 'Ring Road 3', 'Highway 1A', 'Vo Van Kiet Boulevard',
        'Nguyen Van Linh Parkway', 'East-West Highway'
      ],
      weight_limits: {
        inner_city: 10000, // kg
        ring_roads: 32000,
        highways: 40000
      }
    },
    'hanoi': {
      name: 'Hanoi',
      truck_ban_hours: [
        { start: '06:00', end: '09:00', days: ['mon', 'tue', 'wed', 'thu', 'fri'] },
        { start: '15:00', end: '21:00', days: ['mon', 'tue', 'wed', 'thu', 'fri'] }
      ],
      restricted_zones: [
        {
          name: 'Old Quarter',
          polygon: [
            [105.8469, 21.0354], [105.8542, 21.0354],
            [105.8542, 21.0408], [105.8469, 21.0408], [105.8469, 21.0354]
          ],
          restriction_type: 'no_trucks_over_5_tons',
          hours: 'all_day'
        }
      ],
      designated_truck_routes: [
        'Ring Road 3', 'Ring Road 4', 'Highway 5', 'Thang Long Boulevard'
      ],
      weight_limits: {
        inner_city: 8000,
        ring_roads: 32000,
        highways: 40000
      }
    },
    'da_nang': {
      name: 'Da Nang',
      truck_ban_hours: [
        { start: '07:00', end: '09:00', days: ['mon', 'tue', 'wed', 'thu', 'fri'] },
        { start: '17:00', end: '19:00', days: ['mon', 'tue', 'wed', 'thu', 'fri'] }
      ],
      restricted_zones: [
        {
          name: 'Han Market Area',
          polygon: [
            [108.2167, 16.0678], [108.2208, 16.0678],
            [108.2208, 16.0708], [108.2167, 16.0708], [108.2167, 16.0678]
          ],
          restriction_type: 'no_trucks_over_15_tons',
          hours: '06:00-22:00'
        }
      ],
      designated_truck_routes: [
        'Vo Nguyen Giap', 'Nguyen Tat Thanh', 'Highway 1A'
      ],
      weight_limits: {
        inner_city: 15000,
        ring_roads: 32000,
        highways: 40000
      }
    }
  },
  highways: {
    'highway_1a': {
      name: 'Highway 1A',
      weight_limit_kg: 40000,
      height_limit_m: 4.5,
      speed_limit_kmh: 90,
      toll_rate_vnd_per_km: 2500
    },
    'ho_chi_minh_highway': {
      name: 'Ho Chi Minh Highway',
      weight_limit_kg: 40000,
      height_limit_m: 4.5,
      speed_limit_kmh: 100,
      toll_rate_vnd_per_km: 3000
    }
  }
};

// Traffic patterns for Vietnam
export const VIETNAM_TRAFFIC_PATTERNS = {
  rush_hours: {
    morning: { start: '06:30', end: '09:00' },
    evening: { start: '16:30', end: '19:30' }
  },
  speed_factors: {
    rush_hour: 0.4, // 40% of normal speed
    normal: 1.0,
    night: 1.2 // 20% faster at night
  },
  congestion_zones: [
    {
      name: 'HCMC Center',
      bounds: [[106.6917, 10.7769], [106.7031, 10.7831]],
      congestion_factor: 0.3
    },
    {
      name: 'Hanoi Center',
      bounds: [[105.8469, 21.0354], [105.8542, 21.0408]],
      congestion_factor: 0.35
    }
  ]
};

export class TruckRoutingEngine {
  private fuelPriceVND = 26500; // Current diesel price in Vietnam
  private co2FactorKgPerLiter = 2.68; // CO2 emission factor for diesel

  constructor() {}

  async calculateRoute(request: RouteRequest): Promise<RouteResponse> {
    try {
      // 1. Validate truck specifications and restrictions
      const violations = this.checkRestrictions(request);
      
      // 2. Calculate base route using road network
      const baseRoute = await this.calculateBaseRoute(request);
      
      // 3. Apply traffic analysis
      const trafficAnalysis = this.analyzeTraffic(request, baseRoute);
      
      // 4. Calculate costs
      const costAnalysis = this.calculateCosts(baseRoute, request.truck_specs);
      
      // 5. Generate optimized route with instructions
      const optimizedRoute = this.optimizeRoute(baseRoute, request, trafficAnalysis);
      
      return {
        route: optimizedRoute,
        cost_analysis: costAnalysis,
        restrictions: {
          violations,
          warnings: this.generateWarnings(request, violations),
          alternative_times: this.suggestAlternativeTimes(request, violations)
        },
        traffic_analysis: trafficAnalysis
      };
    } catch (error) {
      throw new Error(`Route calculation failed: ${error}`);
    }
  }

  private checkRestrictions(request: RouteRequest): RestrictionViolation[] {
    const violations: RestrictionViolation[] = [];
    const departureTime = new Date(request.departure_time);
    const hour = departureTime.getHours();
    const minute = departureTime.getMinutes();
    const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
    const dayOfWeek = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'][departureTime.getDay()];

    // Check city restrictions
    Object.values(VIETNAM_ROAD_RESTRICTIONS.cities).forEach(city => {
      // Check time restrictions
      city.truck_ban_hours.forEach(banPeriod => {
        if (banPeriod.days.includes(dayOfWeek) && 
            this.isTimeInRange(timeString, banPeriod.start, banPeriod.end)) {
          violations.push({
            type: 'time_restriction',
            location: city.name,
            description: `40ft trucks banned in ${city.name} from ${banPeriod.start} to ${banPeriod.end}`,
            severity: 'error',
            suggested_alternative: `Depart after ${banPeriod.end} or before ${banPeriod.start}`
          });
        }
      });

      // Check weight restrictions
      if (request.truck_specs.weight_kg > city.weight_limits.inner_city) {
        violations.push({
          type: 'weight_restriction',
          location: `${city.name} inner city`,
          description: `Truck weight ${request.truck_specs.weight_kg}kg exceeds limit ${city.weight_limits.inner_city}kg`,
          severity: 'warning',
          suggested_alternative: 'Use designated truck routes or ring roads'
        });
      }

      // Check zone restrictions
      city.restricted_zones.forEach(zone => {
        if (this.isPointInPolygon(request.origin, zone.polygon) || 
            this.isPointInPolygon(request.destination, zone.polygon)) {
          violations.push({
            type: 'zone_restriction',
            location: zone.name,
            description: `${zone.restriction_type} in ${zone.name}`,
            severity: 'error',
            suggested_alternative: 'Use alternative pickup/delivery location outside restricted zone'
          });
        }
      });
    });

    return violations;
  }

  private async calculateBaseRoute(request: RouteRequest): Promise<{
    coordinates: [number, number][];
    distance_km: number;
    duration_minutes: number;
    instructions: RouteInstruction[];
  }> {
    // Simulate route calculation (in production, use OSRM, GraphHopper, or similar)
    const start = turf.point([request.origin.lng, request.origin.lat]);
    const end = turf.point([request.destination.lng, request.destination.lat]);
    const distance = turf.distance(start, end, { units: 'kilometers' });
    
    // Generate route coordinates (simplified - in production use actual routing service)
    const coordinates: [number, number][] = [
      [request.origin.lng, request.origin.lat],
      [request.destination.lng, request.destination.lat]
    ];

    // Add intermediate points for more realistic route
    const midLng = (request.origin.lng + request.destination.lng) / 2;
    const midLat = (request.origin.lat + request.destination.lat) / 2;
    coordinates.splice(1, 0, [midLng, midLat]);

    const baseSpeed = 45; // km/h average speed in Vietnam
    const duration = (distance / baseSpeed) * 60; // minutes

    const instructions: RouteInstruction[] = [
      {
        distance_km: distance * 0.3,
        duration_minutes: duration * 0.3,
        instruction: `Head ${this.getDirection(request.origin, request.destination)} on local roads`,
        coordinates: [request.origin.lng, request.origin.lat]
      },
      {
        distance_km: distance * 0.4,
        duration_minutes: duration * 0.4,
        instruction: 'Continue on Highway 1A',
        coordinates: [midLng, midLat],
        restriction_warning: 'Truck route - follow designated lanes'
      },
      {
        distance_km: distance * 0.3,
        duration_minutes: duration * 0.3,
        instruction: `Turn towards ${request.destination.name}`,
        coordinates: [request.destination.lng, request.destination.lat]
      }
    ];

    return {
      coordinates,
      distance_km: distance,
      duration_minutes: duration,
      instructions
    };
  }

  private analyzeTraffic(request: RouteRequest, route: any): {
    congestion_level: 'low' | 'medium' | 'high';
    delay_minutes: number;
    rush_hour_impact: boolean;
  } {
    const departureTime = new Date(request.departure_time);
    const hour = departureTime.getHours();
    const minute = departureTime.getMinutes();
    
    // Check if departure is during rush hour
    const isRushHour = (
      (hour >= 6 && hour < 9) || // Morning rush
      (hour >= 16 && hour < 20)   // Evening rush
    );

    let congestionLevel: 'low' | 'medium' | 'high' = 'low';
    let delayMinutes = 0;

    if (isRushHour) {
      congestionLevel = 'high';
      delayMinutes = route.duration_minutes * 0.6; // 60% delay during rush hour
    } else if (hour >= 9 && hour < 16) {
      congestionLevel = 'medium';
      delayMinutes = route.duration_minutes * 0.2; // 20% delay during day
    }

    return {
      congestion_level: congestionLevel,
      delay_minutes: delayMinutes,
      rush_hour_impact: isRushHour
    };
  }

  private calculateCosts(route: any, truckSpecs: TruckSpecs): {
    fuel_cost_vnd: number;
    toll_cost_vnd: number;
    total_cost_vnd: number;
    co2_emission_kg: number;
  } {
    // Fuel cost calculation
    const fuelConsumptionLiters = (route.distance_km * truckSpecs.fuel_consumption_l_per_100km) / 100;
    const fuelCostVND = fuelConsumptionLiters * this.fuelPriceVND;

    // Toll cost calculation (simplified)
    const tollCostVND = route.distance_km * 2500; // Average toll rate

    // CO2 emission calculation
    const co2EmissionKg = fuelConsumptionLiters * this.co2FactorKgPerLiter;

    return {
      fuel_cost_vnd: Math.round(fuelCostVND),
      toll_cost_vnd: Math.round(tollCostVND),
      total_cost_vnd: Math.round(fuelCostVND + tollCostVND),
      co2_emission_kg: Math.round(co2EmissionKg * 100) / 100
    };
  }

  private optimizeRoute(baseRoute: any, request: RouteRequest, trafficAnalysis: any): {
    coordinates: [number, number][];
    distance_km: number;
    duration_minutes: number;
    instructions: RouteInstruction[];
  } {
    // Apply traffic delays to duration
    const optimizedDuration = baseRoute.duration_minutes + trafficAnalysis.delay_minutes;

    return {
      ...baseRoute,
      duration_minutes: Math.round(optimizedDuration)
    };
  }

  private generateWarnings(request: RouteRequest, violations: RestrictionViolation[]): string[] {
    const warnings: string[] = [];

    if (violations.some(v => v.type === 'time_restriction')) {
      warnings.push('Route includes time-restricted areas. Consider alternative departure time.');
    }

    if (request.truck_specs.weight_kg > 30000) {
      warnings.push('Heavy truck detected. Ensure proper permits for city center access.');
    }

    const departureHour = new Date(request.departure_time).getHours();
    if (departureHour >= 6 && departureHour < 9) {
      warnings.push('Departure during morning rush hour. Expect significant delays.');
    }

    return warnings;
  }

  private suggestAlternativeTimes(request: RouteRequest, violations: RestrictionViolation[]): string[] {
    const alternatives: string[] = [];
    const departureTime = new Date(request.departure_time);

    // Suggest times outside rush hours
    if (violations.some(v => v.type === 'time_restriction')) {
      alternatives.push('05:30', '09:30', '14:00', '21:30');
    }

    return alternatives;
  }

  // Helper methods
  private isTimeInRange(time: string, start: string, end: string): boolean {
    const timeMinutes = this.timeToMinutes(time);
    const startMinutes = this.timeToMinutes(start);
    const endMinutes = this.timeToMinutes(end);
    
    return timeMinutes >= startMinutes && timeMinutes <= endMinutes;
  }

  private timeToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }

  private isPointInPolygon(point: RoutePoint, polygon: number[][]): boolean {
    // Simple point-in-polygon check using turf.js
    const turfPoint = turf.point([point.lng, point.lat]);
    const turfPolygon = turf.polygon([polygon.map(p => [p[0], p[1]])]);
    return turf.booleanPointInPolygon(turfPoint, turfPolygon);
  }

  private getDirection(from: RoutePoint, to: RoutePoint): string {
    const bearing = turf.bearing(
      turf.point([from.lng, from.lat]),
      turf.point([to.lng, to.lat])
    );

    if (bearing >= -22.5 && bearing < 22.5) return 'north';
    if (bearing >= 22.5 && bearing < 67.5) return 'northeast';
    if (bearing >= 67.5 && bearing < 112.5) return 'east';
    if (bearing >= 112.5 && bearing < 157.5) return 'southeast';
    if (bearing >= 157.5 || bearing < -157.5) return 'south';
    if (bearing >= -157.5 && bearing < -112.5) return 'southwest';
    if (bearing >= -112.5 && bearing < -67.5) return 'west';
    return 'northwest';
  }
}

// Export singleton instance
export const truckRoutingEngine = new TruckRoutingEngine();
