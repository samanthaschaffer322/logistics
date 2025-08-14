// Interactive Mapping Service for LogiAI with OpenRouteService Integration
// Enhanced for Vietnamese logistics with truck routing capabilities

export interface MapLocation {
  id: string;
  name: string;
  lat: number;
  lng: number;
  type: 'depot' | 'port' | 'warehouse' | 'customer' | 'fuel_station' | 'rest_area';
  address: string;
  contact?: {
    phone?: string;
    email?: string;
    manager?: string;
  };
  services?: string[];
  operatingHours?: {
    open: string;
    close: string;
    days: string[];
  };
}

export interface RouteOptions {
  profile: 'driving-hgv' | 'driving-car' | 'cycling-regular' | 'foot-walking';
  avoid_features?: string[];
  avoid_polygons?: number[][][];
  vehicle_type?: 'hgv' | 'agricultural' | 'delivery' | 'forestry' | 'goods';
  weight?: number; // in tons
  height?: number; // in meters
  width?: number; // in meters
  length?: number; // in meters
  axleload?: number; // in tons
  hazmat?: boolean;
}

export interface RouteResult {
  distance: number; // in kilometers
  duration: number; // in seconds
  geometry: number[][]; // [lng, lat] coordinates
  instructions: RouteInstruction[];
  summary: {
    distance: number;
    duration: number;
    ascent?: number;
    descent?: number;
  };
  waypoints: number[][];
  cost?: {
    fuel: number;
    tolls: number;
    driver: number;
    maintenance: number;
    total: number;
  };
  environmental?: {
    co2Emissions: number;
    fuelConsumption: number;
  };
}

export interface RouteInstruction {
  distance: number;
  duration: number;
  type: number;
  instruction: string;
  name: string;
  way_points: number[];
}

// Comprehensive Vietnamese Logistics Locations Database for LogiAI
export const vietnamLogisticsLocations: MapLocation[] = [
  // Major Ports
  {
    id: 'port-catlai',
    name: 'Cảng Cát Lái',
    lat: 10.7769,
    lng: 106.7009,
    type: 'port',
    address: 'Cát Lái, Quận 2, TP.HCM',
    contact: {
      phone: '+84 28 3740 6666',
      email: 'info@catlaiport.com.vn',
      manager: 'Nguyễn Văn Hải'
    },
    services: ['Container handling', 'Cargo storage', 'Customs clearance'],
    operatingHours: {
      open: '06:00',
      close: '22:00',
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    }
  },
  {
    id: 'port-haiphong',
    name: 'Cảng Hải Phòng',
    lat: 20.8648,
    lng: 106.6881,
    type: 'port',
    address: 'Hải Phòng, Việt Nam',
    contact: {
      phone: '+84 225 3842 888',
      email: 'info@haiphongport.vn'
    },
    services: ['International shipping', 'Container terminal', 'Bulk cargo'],
    operatingHours: {
      open: '24/7',
      close: '24/7',
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    }
  },
  {
    id: 'port-danang',
    name: 'Cảng Đà Nẵng',
    lat: 16.0678,
    lng: 108.2208,
    type: 'port',
    address: 'Đà Nẵng, Việt Nam',
    contact: {
      phone: '+84 236 3822 722',
      email: 'info@danangport.vn'
    },
    services: ['Container services', 'General cargo', 'Passenger terminal'],
    operatingHours: {
      open: '06:00',
      close: '18:00',
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    }
  },

  // Major Depots and Warehouses
  {
    id: 'depot-binhthanh',
    name: 'Kho Bình Thạnh',
    lat: 10.8014,
    lng: 106.7109,
    type: 'depot',
    address: 'Quận Bình Thạnh, TP.HCM',
    contact: {
      phone: '+84 28 3899 1234',
      manager: 'Trần Thị Lan'
    },
    services: ['Warehousing', 'Distribution', 'Cross-docking'],
    operatingHours: {
      open: '07:00',
      close: '19:00',
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    }
  },
  {
    id: 'warehouse-binhduong',
    name: 'Kho Bình Dương',
    lat: 10.9804,
    lng: 106.6519,
    type: 'warehouse',
    address: 'Bình Dương, Việt Nam',
    contact: {
      phone: '+84 274 3888 999',
      email: 'warehouse@binhduong.com'
    },
    services: ['Cold storage', 'Dry goods', 'Packaging'],
    operatingHours: {
      open: '06:00',
      close: '20:00',
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    }
  },
  {
    id: 'depot-dongnam',
    name: 'Kho Đông Nam',
    lat: 10.8500,
    lng: 106.6300,
    type: 'depot',
    address: 'Khu Công Nghiệp Đông Nam, TP.HCM',
    contact: {
      phone: '+84 28 3756 8888',
      manager: 'Lê Văn Minh'
    },
    services: ['Heavy machinery storage', 'Equipment rental', 'Maintenance'],
    operatingHours: {
      open: '05:00',
      close: '21:00',
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    }
  },

  // Industrial Zones
  {
    id: 'industrial-tanhuan',
    name: 'KCN Tân Thuận',
    lat: 10.7331,
    lng: 106.7072,
    type: 'warehouse',
    address: 'KCN Tân Thuận, Quận 7, TP.HCM',
    contact: {
      phone: '+84 28 3771 5555',
      email: 'info@tanthuan.com.vn'
    },
    services: ['Manufacturing', 'Export processing', 'Logistics services'],
    operatingHours: {
      open: '06:00',
      close: '22:00',
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    }
  },
  {
    id: 'industrial-linh-trung',
    name: 'KCN Linh Trung',
    lat: 10.8708,
    lng: 106.8006,
    type: 'warehouse',
    address: 'KCN Linh Trung, TP. Thủ Đức, TP.HCM',
    contact: {
      phone: '+84 28 3725 4444',
      email: 'contact@linhtrung.vn'
    },
    services: ['Technology manufacturing', 'Assembly', 'Quality control'],
    operatingHours: {
      open: '07:00',
      close: '19:00',
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
    }
  },

  // Fuel Stations
  {
    id: 'fuel-petrolimex-1',
    name: 'Petrolimex Xa Lộ Hà Nội',
    lat: 10.8231,
    lng: 106.6897,
    type: 'fuel_station',
    address: 'Xa Lộ Hà Nội, TP.HCM',
    contact: {
      phone: '+84 28 3896 7777'
    },
    services: ['Diesel', 'Gasoline', 'Truck services', 'Rest area'],
    operatingHours: {
      open: '24/7',
      close: '24/7',
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    }
  },
  {
    id: 'fuel-shell-highway',
    name: 'Shell Cao Tốc Long Thành',
    lat: 10.8156,
    lng: 106.8742,
    type: 'fuel_station',
    address: 'Cao Tốc Long Thành - Dầu Giây',
    contact: {
      phone: '+84 28 3123 4567'
    },
    services: ['Premium fuel', 'Truck parking', 'Convenience store', 'ATM'],
    operatingHours: {
      open: '24/7',
      close: '24/7',
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    }
  },

  // Rest Areas
  {
    id: 'rest-area-bienhoa',
    name: 'Trạm Dừng Chân Biên Hòa',
    lat: 10.9471,
    lng: 106.8238,
    type: 'rest_area',
    address: 'Cao Tốc TP.HCM - Long Thành - Dầu Giây',
    contact: {
      phone: '+84 251 3123 456'
    },
    services: ['Parking', 'Restaurant', 'Restrooms', 'Truck wash'],
    operatingHours: {
      open: '24/7',
      close: '24/7',
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    }
  },

  // Customer Locations
  {
    id: 'customer-bigc-q1',
    name: 'BigC Quận 1',
    lat: 10.7769,
    lng: 106.7009,
    type: 'customer',
    address: '42 Nguyễn Thị Minh Khai, Quận 1, TP.HCM',
    contact: {
      phone: '+84 28 3829 1234',
      manager: 'Phạm Văn Đức'
    },
    services: ['Retail delivery', 'Scheduled pickup'],
    operatingHours: {
      open: '08:00',
      close: '22:00',
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    }
  },
  {
    id: 'customer-coopmart-q7',
    name: 'Co.opmart Quận 7',
    lat: 10.7331,
    lng: 106.7072,
    type: 'customer',
    address: 'Quận 7, TP.HCM',
    contact: {
      phone: '+84 28 3771 9999',
      manager: 'Nguyễn Thị Hoa'
    },
    services: ['Grocery delivery', 'Bulk orders'],
    operatingHours: {
      open: '07:00',
      close: '21:00',
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    }
  }
];

export class InteractiveMappingService {
  private apiKey: string;
  private baseUrl: string = 'https://api.openrouteservice.org';

  constructor() {
    this.apiKey = process.env.NEXT_PUBLIC_ORS_API_KEY || 
                  '5b3ce3597851110001cf6248a4b8b8b8b8b8b8b8b8b8b8b8b8b8b8b8b8b8';
  }

  // Get route between two points with truck-specific options
  async getRoute(
    start: [number, number], 
    end: [number, number], 
    options: RouteOptions = { profile: 'driving-hgv' }
  ): Promise<RouteResult> {
    try {
      const coordinates = [start, end];
      
      const requestBody = {
        coordinates,
        ...options,
        format: 'json',
        instructions: true,
        geometry: true,
        elevation: true
      };

      const response = await fetch(`${this.baseUrl}/v2/directions/${options.profile}`, {
        method: 'POST',
        headers: {
          'Authorization': this.apiKey,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        throw new Error(`OpenRouteService API error: ${response.status}`);
      }

      const data = await response.json();
      const route = data.routes[0];

      // Calculate costs in Vietnamese Dong
      const distance = route.summary.distance / 1000; // Convert to km
      const duration = route.summary.duration / 3600; // Convert to hours
      
      const cost = this.calculateRouteCost(distance, duration, options);
      const environmental = this.calculateEnvironmentalImpact(distance, options);

      return {
        distance,
        duration: route.summary.duration,
        geometry: route.geometry.coordinates,
        instructions: route.segments[0]?.steps || [],
        summary: route.summary,
        waypoints: route.waypoints,
        cost,
        environmental
      };
    } catch (error) {
      console.error('Route calculation error:', error);
      throw error;
    }
  }

  // Calculate route cost in Vietnamese Dong
  private calculateRouteCost(distance: number, duration: number, options: RouteOptions) {
    const fuelPrice = 25000; // VND per liter
    const fuelConsumption = options.profile === 'driving-hgv' ? 0.35 : 0.08; // L/km
    const driverWage = 50000; // VND per hour
    const maintenanceCost = 2000; // VND per km
    const tollCost = distance > 50 ? distance * 1500 : 0; // VND

    const fuel = distance * fuelConsumption * fuelPrice;
    const driver = duration * driverWage;
    const maintenance = distance * maintenanceCost;
    const tolls = tollCost;

    return {
      fuel: Math.round(fuel),
      driver: Math.round(driver),
      maintenance: Math.round(maintenance),
      tolls: Math.round(tolls),
      total: Math.round(fuel + driver + maintenance + tolls)
    };
  }

  // Calculate environmental impact
  private calculateEnvironmentalImpact(distance: number, options: RouteOptions) {
    const co2Factor = options.profile === 'driving-hgv' ? 0.8 : 0.2; // kg CO2 per km
    const fuelConsumption = options.profile === 'driving-hgv' ? 0.35 : 0.08; // L/km

    return {
      co2Emissions: Math.round(distance * co2Factor * 100) / 100, // kg
      fuelConsumption: Math.round(distance * fuelConsumption * 100) / 100 // liters
    };
  }

  // Get multiple routes with different optimization criteria
  async getOptimizedRoutes(
    start: [number, number], 
    end: [number, number], 
    waypoints: [number, number][] = []
  ): Promise<{ [key: string]: RouteResult }> {
    const coordinates = [start, ...waypoints, end];
    
    const routeTypes = {
      fastest: { profile: 'driving-hgv' as const, preference: 'fastest' },
      shortest: { profile: 'driving-hgv' as const, preference: 'shortest' },
      recommended: { profile: 'driving-hgv' as const, preference: 'recommended' }
    };

    const results: { [key: string]: RouteResult } = {};

    for (const [type, options] of Object.entries(routeTypes)) {
      try {
        const result = await this.getRoute(start, end, options);
        results[type] = result;
      } catch (error) {
        console.error(`Error calculating ${type} route:`, error);
      }
    }

    return results;
  }

  // Search for locations by name or type
  searchLocations(query: string, type?: string): MapLocation[] {
    const searchTerm = query.toLowerCase();
    
    return vietnamLogisticsLocations.filter(location => {
      const matchesQuery = location.name.toLowerCase().includes(searchTerm) ||
                          location.address.toLowerCase().includes(searchTerm);
      const matchesType = !type || location.type === type;
      
      return matchesQuery && matchesType;
    });
  }

  // Get locations by type
  getLocationsByType(type: string): MapLocation[] {
    return vietnamLogisticsLocations.filter(location => location.type === type);
  }

  // Get location by ID
  getLocationById(id: string): MapLocation | undefined {
    return vietnamLogisticsLocations.find(location => location.id === id);
  }

  // Get nearby locations
  getNearbyLocations(lat: number, lng: number, radius: number = 50): MapLocation[] {
    return vietnamLogisticsLocations.filter(location => {
      const distance = this.calculateDistance(lat, lng, location.lat, location.lng);
      return distance <= radius;
    });
  }

  // Calculate distance between two points (Haversine formula)
  private calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  // Check if API is configured and working
  async checkApiStatus(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/health`, {
        headers: {
          'Authorization': this.apiKey
        }
      });
      return response.ok;
    } catch (error) {
      console.error('API status check failed:', error);
      return false;
    }
  }
}

export const mappingService = new InteractiveMappingService();
