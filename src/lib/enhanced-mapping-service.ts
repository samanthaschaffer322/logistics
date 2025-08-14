/**
 * Enhanced Mapping Service for Vietnamese Truck Logistics
 * Integrates multiple free mapping services for optimal route planning
 * Features: Leaflet + React-Leaflet, OpenRouteService, Vietnam GeoJSON, Multiple algorithms
 */

import axios from 'axios';
import { ORSIntegration } from './ors-integration';
import { VIETNAM_LOCATIONS, DetailedLocation } from './vietnamLocations';

// ==================== INTERFACES ====================

export interface MapLocation {
  id: string;
  name: string;
  lat: number;
  lng: number;
  type: 'depot' | 'destination' | 'waypoint' | 'truck' | 'port' | 'warehouse';
  address?: string;
  province?: string;
  region?: 'north' | 'central' | 'south';
}

export interface TruckSpecs {
  weight: number; // tons
  height: number; // meters
  width: number; // meters
  length: number; // meters
  axles: number;
  hazardousMaterials: boolean;
  type: 'container' | 'flatbed' | 'tanker' | 'refrigerated';
}

export interface RouteOptions {
  profile: 'driving-hgv' | 'driving-car';
  preference: 'fastest' | 'shortest' | 'eco';
  avoidTolls: boolean;
  avoidFerries: boolean;
  avoidHighways: boolean;
  truckSpecs?: TruckSpecs;
}

export interface RouteSegment {
  distance: number; // meters
  duration: number; // seconds
  geometry: any; // GeoJSON LineString
  instructions: RouteInstruction[];
  tollCost?: number;
  fuelCost?: number;
}

export interface RouteInstruction {
  text: string;
  distance: number;
  duration: number;
  type: string;
  modifier?: string;
}

export interface OptimizedRoute {
  id: string;
  locations: MapLocation[];
  segments: RouteSegment[];
  totalDistance: number;
  totalDuration: number;
  totalCost: number;
  fuelConsumption: number;
  co2Emissions: number;
  truckRestrictions: string[];
  alternativeRoutes?: OptimizedRoute[];
}

export interface TrafficInfo {
  congestionLevel: 'low' | 'medium' | 'high' | 'severe';
  delayMinutes: number;
  incidents: TrafficIncident[];
}

export interface TrafficIncident {
  type: 'accident' | 'construction' | 'closure' | 'weather';
  severity: 'minor' | 'moderate' | 'major';
  description: string;
  location: { lat: number; lng: number };
  estimatedClearTime?: Date;
}

// ==================== MAPPING PROVIDERS ====================

class OpenRouteServiceProvider {
  private apiKey: string;
  private baseUrl = 'https://api.openrouteservice.org';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async getRoute(locations: MapLocation[], options: RouteOptions): Promise<OptimizedRoute> {
    const coordinates = locations.map(loc => [loc.lng, loc.lat]);
    
    const requestBody = {
      coordinates,
      profile: options.profile,
      preference: options.preference,
      format: 'geojson',
      instructions: true,
      elevation: true,
      extra_info: ['tollways', 'surface', 'steepness'],
      options: {
        avoid_features: this.buildAvoidFeatures(options),
        vehicle_type: options.profile === 'driving-hgv' ? 'hgv' : 'car',
        ...(options.truckSpecs && {
          profile_params: {
            weight: options.truckSpecs.weight,
            height: options.truckSpecs.height,
            width: options.truckSpecs.width,
            length: options.truckSpecs.length,
            axleload: options.truckSpecs.weight / options.truckSpecs.axles,
            hazmat: options.truckSpecs.hazardousMaterials
          }
        })
      }
    };

    try {
      const response = await axios.post(
        `${this.baseUrl}/v2/directions/${options.profile}/geojson`,
        requestBody,
        {
          headers: {
            'Authorization': this.apiKey,
            'Content-Type': 'application/json'
          }
        }
      );

      return this.parseORSResponse(response.data, locations);
    } catch (error) {
      console.error('ORS API Error:', error);
      throw new Error('Failed to get route from OpenRouteService');
    }
  }

  private buildAvoidFeatures(options: RouteOptions): string[] {
    const features: string[] = [];
    if (options.avoidTolls) features.push('tollways');
    if (options.avoidFerries) features.push('ferries');
    if (options.avoidHighways) features.push('highways');
    return features;
  }

  private parseORSResponse(data: any, locations: MapLocation[]): OptimizedRoute {
    const route = data.routes[0];
    const segments: RouteSegment[] = route.segments.map((segment: any) => ({
      distance: segment.distance,
      duration: segment.duration,
      geometry: segment.geometry,
      instructions: segment.steps?.map((step: any) => ({
        text: step.instruction,
        distance: step.distance,
        duration: step.duration,
        type: step.type,
        modifier: step.modifier
      })) || []
    }));

    return {
      id: `ors-${Date.now()}`,
      locations,
      segments,
      totalDistance: route.summary.distance,
      totalDuration: route.summary.duration,
      totalCost: this.calculateCost(route.summary.distance, route.summary.duration),
      fuelConsumption: this.calculateFuelConsumption(route.summary.distance),
      co2Emissions: this.calculateCO2Emissions(route.summary.distance),
      truckRestrictions: this.extractTruckRestrictions(route)
    };
  }

  private calculateCost(distance: number, duration: number): number {
    // Vietnamese truck operating costs (VND per km)
    const fuelCostPerKm = 8000; // ~8,000 VND per km
    const driverCostPerHour = 50000; // ~50,000 VND per hour
    const maintenanceCostPerKm = 2000; // ~2,000 VND per km
    
    const distanceKm = distance / 1000;
    const durationHours = duration / 3600;
    
    return (distanceKm * fuelCostPerKm) + 
           (durationHours * driverCostPerHour) + 
           (distanceKm * maintenanceCostPerKm);
  }

  private calculateFuelConsumption(distance: number): number {
    // Average truck fuel consumption: 25L/100km
    const fuelConsumptionPer100km = 25;
    return (distance / 1000) * (fuelConsumptionPer100km / 100);
  }

  private calculateCO2Emissions(distance: number): number {
    // Average CO2 emissions: 2.6 kg per liter of diesel
    const fuelConsumption = this.calculateFuelConsumption(distance);
    return fuelConsumption * 2.6;
  }

  private extractTruckRestrictions(route: any): string[] {
    const restrictions: string[] = [];
    // Parse route extras for truck restrictions
    if (route.extras?.tollways?.values?.length > 0) {
      restrictions.push('Toll roads present');
    }
    return restrictions;
  }
}

class OSMNominatimProvider {
  private baseUrl = 'https://nominatim.openstreetmap.org';

  async geocode(address: string, countryCode = 'VN'): Promise<MapLocation[]> {
    try {
      const response = await axios.get(`${this.baseUrl}/search`, {
        params: {
          q: address,
          countrycodes: countryCode,
          format: 'json',
          limit: 5,
          addressdetails: 1
        },
        headers: {
          'User-Agent': 'TruckInsightV2/1.0'
        }
      });

      return response.data.map((result: any, index: number) => ({
        id: `osm-${result.place_id}`,
        name: result.display_name,
        lat: parseFloat(result.lat),
        lng: parseFloat(result.lon),
        type: 'destination' as const,
        address: result.display_name,
        province: result.address?.state || result.address?.province
      }));
    } catch (error) {
      console.error('Nominatim Geocoding Error:', error);
      return [];
    }
  }

  async reverseGeocode(lat: number, lng: number): Promise<MapLocation | null> {
    try {
      const response = await axios.get(`${this.baseUrl}/reverse`, {
        params: {
          lat,
          lon: lng,
          format: 'json',
          addressdetails: 1
        },
        headers: {
          'User-Agent': 'TruckInsightV2/1.0'
        }
      });

      const result = response.data;
      return {
        id: `osm-reverse-${result.place_id}`,
        name: result.display_name,
        lat,
        lng,
        type: 'destination',
        address: result.display_name,
        province: result.address?.state || result.address?.province
      };
    } catch (error) {
      console.error('Reverse Geocoding Error:', error);
      return null;
    }
  }
}

// ==================== MAIN SERVICE ====================

export class EnhancedMappingService {
  private orsProvider: OpenRouteServiceProvider;
  private osmProvider: OSMNominatimProvider;
  private vietnamBounds = {
    north: 23.393395,
    south: 8.179255,
    east: 109.464638,
    west: 102.144847
  };

  constructor(orsApiKey: string) {
    this.orsProvider = new OpenRouteServiceProvider(orsApiKey);
    this.osmProvider = new OSMNominatimProvider();
  }

  // ==================== ROUTE OPTIMIZATION ====================

  async optimizeRoute(
    locations: MapLocation[], 
    options: RouteOptions = {
      profile: 'driving-hgv',
      preference: 'fastest',
      avoidTolls: false,
      avoidFerries: false,
      avoidHighways: false
    }
  ): Promise<OptimizedRoute> {
    // Validate locations are within Vietnam
    const validLocations = locations.filter(loc => this.isWithinVietnam(loc));
    
    if (validLocations.length < 2) {
      throw new Error('At least 2 valid locations within Vietnam are required');
    }

    // Get primary route
    const primaryRoute = await this.orsProvider.getRoute(validLocations, options);

    // Get alternative routes with different preferences
    const alternatives: OptimizedRoute[] = [];
    
    if (options.preference !== 'shortest') {
      try {
        const shortestRoute = await this.orsProvider.getRoute(validLocations, {
          ...options,
          preference: 'shortest'
        });
        alternatives.push(shortestRoute);
      } catch (error) {
        console.warn('Failed to get shortest route alternative');
      }
    }

    if (options.preference !== 'eco') {
      try {
        const ecoRoute = await this.orsProvider.getRoute(validLocations, {
          ...options,
          preference: 'eco' as any
        });
        alternatives.push(ecoRoute);
      } catch (error) {
        console.warn('Failed to get eco route alternative');
      }
    }

    primaryRoute.alternativeRoutes = alternatives;
    return primaryRoute;
  }

  // ==================== GEOCODING ====================

  async searchLocations(query: string): Promise<MapLocation[]> {
    const results = await this.osmProvider.geocode(query);
    return results.filter(loc => this.isWithinVietnam(loc));
  }

  async getLocationDetails(lat: number, lng: number): Promise<MapLocation | null> {
    if (!this.isWithinVietnam({ lat, lng } as MapLocation)) {
      return null;
    }
    return await this.osmProvider.reverseGeocode(lat, lng);
  }

  // ==================== VIETNAM-SPECIFIC FEATURES ====================

  getVietnameseProvinces(): Array<{name: string, nameEn: string, center: {lat: number, lng: number}}> {
    return [
      { name: 'TP. Hồ Chí Minh', nameEn: 'Ho Chi Minh City', center: { lat: 10.8231, lng: 106.6297 } },
      { name: 'Hà Nội', nameEn: 'Hanoi', center: { lat: 21.0285, lng: 105.8542 } },
      { name: 'Đà Nẵng', nameEn: 'Da Nang', center: { lat: 16.0544, lng: 108.2022 } },
      { name: 'Hải Phòng', nameEn: 'Hai Phong', center: { lat: 20.8449, lng: 106.6881 } },
      { name: 'Cần Thơ', nameEn: 'Can Tho', center: { lat: 10.0452, lng: 105.7469 } },
      { name: 'Biên Hòa', nameEn: 'Bien Hoa', center: { lat: 10.9447, lng: 106.8241 } },
      { name: 'Nha Trang', nameEn: 'Nha Trang', center: { lat: 12.2388, lng: 109.1967 } },
      { name: 'Huế', nameEn: 'Hue', center: { lat: 16.4637, lng: 107.5909 } },
      { name: 'Vũng Tàu', nameEn: 'Vung Tau', center: { lat: 10.4113, lng: 107.1365 } },
      { name: 'Quy Nhon', nameEn: 'Quy Nhon', center: { lat: 13.7563, lng: 109.2297 } }
    ];
  }

  getMajorPorts(): MapLocation[] {
    return [
      {
        id: 'port-hcm',
        name: 'Cảng Sài Gòn',
        lat: 10.7769,
        lng: 106.7009,
        type: 'port',
        address: 'Quận 4, TP. Hồ Chí Minh',
        province: 'TP. Hồ Chí Minh'
      },
      {
        id: 'port-haiphong',
        name: 'Cảng Hải Phòng',
        lat: 20.8449,
        lng: 106.6881,
        type: 'port',
        address: 'Hải Phòng',
        province: 'Hải Phòng'
      },
      {
        id: 'port-danang',
        name: 'Cảng Đà Nẵng',
        lat: 16.0544,
        lng: 108.2022,
        type: 'port',
        address: 'Đà Nẵng',
        province: 'Đà Nẵng'
      }
    ];
  }

  // ==================== UTILITY METHODS ====================

  private isWithinVietnam(location: MapLocation): boolean {
    return location.lat >= this.vietnamBounds.south &&
           location.lat <= this.vietnamBounds.north &&
           location.lng >= this.vietnamBounds.west &&
           location.lng <= this.vietnamBounds.east;
  }

  calculateDistance(loc1: MapLocation, loc2: MapLocation): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.toRadians(loc2.lat - loc1.lat);
    const dLng = this.toRadians(loc2.lng - loc1.lng);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(this.toRadians(loc1.lat)) * Math.cos(this.toRadians(loc2.lat)) *
              Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  // ==================== TRAFFIC & REAL-TIME DATA ====================

  async getTrafficInfo(route: OptimizedRoute): Promise<TrafficInfo> {
    // Simulate traffic data - in production, integrate with real traffic APIs
    const congestionLevels = ['low', 'medium', 'high'] as const;
    const randomCongestion = congestionLevels[Math.floor(Math.random() * congestionLevels.length)];
    
    return {
      congestionLevel: randomCongestion,
      delayMinutes: randomCongestion === 'high' ? 30 : randomCongestion === 'medium' ? 15 : 0,
      incidents: []
    };
  }

  // ==================== EXPORT METHODS ====================

  exportRouteToGPX(route: OptimizedRoute): string {
    const waypoints = route.locations.map(loc => 
      `<wpt lat="${loc.lat}" lon="${loc.lng}"><name>${loc.name}</name></wpt>`
    ).join('\n');

    return `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="TruckInsightV2">
  <metadata>
    <name>Truck Route - ${route.id}</name>
    <desc>Optimized truck route for Vietnamese logistics</desc>
  </metadata>
  ${waypoints}
</gpx>`;
  }

  exportRouteToKML(route: OptimizedRoute): string {
    const placemarks = route.locations.map(loc => `
      <Placemark>
        <name>${loc.name}</name>
        <Point>
          <coordinates>${loc.lng},${loc.lat},0</coordinates>
        </Point>
      </Placemark>
    `).join('');

    return `<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2">
  <Document>
    <name>Truck Route - ${route.id}</name>
    <description>Optimized truck route for Vietnamese logistics</description>
    ${placemarks}
  </Document>
</kml>`;
  }
}

export default EnhancedMappingService;
