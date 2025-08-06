// AWS Lambda function for truck routing service
// This would be deployed as a separate Lambda function

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DynamoDBClient, GetItemCommand, PutItemCommand, QueryCommand } from '@aws-sdk/client-dynamodb';
import { LocationClient, CalculateRouteCommand } from '@aws-sdk/client-location';

// Types
interface TruckRoutingRequest {
  origin: { lat: number; lng: number; address: string };
  destination: { lat: number; lng: number; address: string };
  truck_specs: {
    type: '20ft' | '40ft' | 'container_truck';
    weight_kg: number;
    fuel_consumption_l_per_100km: number;
  };
  departure_time: string;
  avoid_tolls?: boolean;
  avoid_highways?: boolean;
}

interface TruckRoutingResponse {
  route: {
    coordinates: [number, number][];
    distance_km: number;
    duration_minutes: number;
    instructions: any[];
  };
  cost_analysis: {
    fuel_cost_vnd: number;
    toll_cost_vnd: number;
    total_cost_vnd: number;
    co2_emission_kg: number;
  };
  restrictions: {
    violations: any[];
    warnings: string[];
    alternative_times: string[];
  };
  traffic_analysis: {
    congestion_level: 'low' | 'medium' | 'high';
    delay_minutes: number;
    rush_hour_impact: boolean;
  };
}

// AWS clients
const dynamoClient = new DynamoDBClient({ region: process.env.AWS_REGION || 'ap-southeast-1' });
const locationClient = new LocationClient({ region: process.env.AWS_REGION || 'ap-southeast-1' });

// Constants
const FUEL_PRICE_VND = 26500;
const CO2_FACTOR_KG_PER_LITER = 2.68;
const VIETNAM_RESTRICTIONS_TABLE = process.env.RESTRICTIONS_TABLE || 'vietnam-truck-restrictions';
const LOCATION_MAP_NAME = process.env.LOCATION_MAP_NAME || 'vietnam-truck-routing';

// Vietnam truck restrictions data
const VIETNAM_TRUCK_RESTRICTIONS = {
  cities: {
    'ho_chi_minh': {
      name: 'Ho Chi Minh City',
      truck_ban_hours: [
        { start: '06:00', end: '09:00', days: ['mon', 'tue', 'wed', 'thu', 'fri'] },
        { start: '16:00', end: '20:00', days: ['mon', 'tue', 'wed', 'thu', 'fri'] }
      ],
      weight_limits: {
        inner_city: 10000,
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
      weight_limits: {
        inner_city: 8000,
        ring_roads: 32000,
        highways: 40000
      }
    }
  }
};

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    // Parse request
    if (!event.body) {
      return createErrorResponse(400, 'Request body is required');
    }

    const request: TruckRoutingRequest = JSON.parse(event.body);
    
    // Validate request
    const validationError = validateRequest(request);
    if (validationError) {
      return createErrorResponse(400, validationError);
    }

    // Calculate route using AWS Location Service
    const routeResult = await calculateRouteWithAWS(request);
    
    // Check Vietnam-specific restrictions
    const restrictions = await checkVietnameseRestrictions(request);
    
    // Analyze traffic conditions
    const trafficAnalysis = analyzeTrafficConditions(request);
    
    // Calculate costs
    const costAnalysis = calculateRouteCosts(routeResult, request.truck_specs);
    
    // Build response
    const response: TruckRoutingResponse = {
      route: routeResult,
      cost_analysis: costAnalysis,
      restrictions,
      traffic_analysis: trafficAnalysis
    };

    // Cache result in DynamoDB
    await cacheRouteResult(request, response);

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      },
      body: JSON.stringify(response)
    };

  } catch (error) {
    console.error('Route calculation error:', error);
    return createErrorResponse(500, 'Internal server error');
  }
};

async function calculateRouteWithAWS(request: TruckRoutingRequest) {
  try {
    const command = new CalculateRouteCommand({
      CalculatorName: LOCATION_MAP_NAME,
      DeparturePosition: [request.origin.lng, request.origin.lat],
      DestinationPosition: [request.destination.lng, request.destination.lat],
      TravelMode: 'Truck',
      TruckModeOptions: {
        AvoidFerries: true,
        AvoidTolls: request.avoid_tolls || false,
        Dimensions: {
          Height: request.truck_specs.type === '40ft' ? 2.59 : 2.44,
          Length: request.truck_specs.type === '40ft' ? 12.2 : 6.1,
          Unit: 'Meters',
          Width: 2.44
        },
        Weight: {
          Total: request.truck_specs.weight_kg,
          Unit: 'Kilograms'
        }
      },
      DepartureTime: new Date(request.departure_time),
      IncludeLegGeometry: true
    });

    const result = await locationClient.send(command);
    
    if (!result.Legs || result.Legs.length === 0) {
      throw new Error('No route found');
    }

    const leg = result.Legs[0];
    const coordinates: [number, number][] = [];
    
    // Extract coordinates from geometry
    if (leg.Geometry && leg.Geometry.LineString) {
      leg.Geometry.LineString.forEach(coord => {
        coordinates.push([coord[0], coord[1]]);
      });
    }

    // Build instructions from steps
    const instructions = leg.Steps?.map((step, index) => ({
      distance_km: (step.Distance || 0) / 1000,
      duration_minutes: (step.DurationSeconds || 0) / 60,
      instruction: step.GeometryOffset ? `Step ${index + 1}` : 'Continue straight',
      coordinates: coordinates[step.GeometryOffset || 0] || [0, 0]
    })) || [];

    return {
      coordinates,
      distance_km: (leg.Distance || 0) / 1000,
      duration_minutes: (leg.DurationSeconds || 0) / 60,
      instructions
    };

  } catch (error) {
    console.error('AWS Location Service error:', error);
    // Fallback to simple calculation
    return calculateFallbackRoute(request);
  }
}

function calculateFallbackRoute(request: TruckRoutingRequest) {
  // Simple great circle distance calculation as fallback
  const R = 6371; // Earth's radius in km
  const dLat = (request.destination.lat - request.origin.lat) * Math.PI / 180;
  const dLng = (request.destination.lng - request.origin.lng) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(request.origin.lat * Math.PI / 180) * Math.cos(request.destination.lat * Math.PI / 180) *
            Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c;

  const coordinates: [number, number][] = [
    [request.origin.lng, request.origin.lat],
    [request.destination.lng, request.destination.lat]
  ];

  const avgSpeed = 45; // km/h
  const duration = (distance / avgSpeed) * 60;

  return {
    coordinates,
    distance_km: distance,
    duration_minutes: duration,
    instructions: [
      {
        distance_km: distance,
        duration_minutes: duration,
        instruction: `Head towards ${request.destination.address}`,
        coordinates: [request.origin.lng, request.origin.lat]
      }
    ]
  };
}

async function checkVietnameseRestrictions(request: TruckRoutingRequest) {
  const violations = [];
  const warnings = [];
  const alternativeTimes = [];

  const departureTime = new Date(request.departure_time);
  const hour = departureTime.getHours();
  const minute = departureTime.getMinutes();
  const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
  const dayOfWeek = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'][departureTime.getDay()];

  // Check Ho Chi Minh City restrictions
  if (isInHoChiMinhCity(request.origin) || isInHoChiMinhCity(request.destination)) {
    const hcmRestrictions = VIETNAM_TRUCK_RESTRICTIONS.cities.ho_chi_minh;
    
    for (const banPeriod of hcmRestrictions.truck_ban_hours) {
      if (banPeriod.days.includes(dayOfWeek) && 
          isTimeInRange(timeString, banPeriod.start, banPeriod.end)) {
        violations.push({
          type: 'time_restriction',
          location: 'Ho Chi Minh City',
          description: `40ft trucks banned from ${banPeriod.start} to ${banPeriod.end}`,
          severity: 'error'
        });
      }
    }

    if (request.truck_specs.weight_kg > hcmRestrictions.weight_limits.inner_city) {
      warnings.push('Truck weight exceeds inner city limit. Use ring roads.');
    }
  }

  // Check Hanoi restrictions
  if (isInHanoi(request.origin) || isInHanoi(request.destination)) {
    const hanoiRestrictions = VIETNAM_TRUCK_RESTRICTIONS.cities.hanoi;
    
    for (const banPeriod of hanoiRestrictions.truck_ban_hours) {
      if (banPeriod.days.includes(dayOfWeek) && 
          isTimeInRange(timeString, banPeriod.start, banPeriod.end)) {
        violations.push({
          type: 'time_restriction',
          location: 'Hanoi',
          description: `40ft trucks banned from ${banPeriod.start} to ${banPeriod.end}`,
          severity: 'error'
        });
      }
    }
  }

  // Suggest alternative times
  if (violations.length > 0) {
    alternativeTimes.push('05:30', '09:30', '14:00', '21:30');
  }

  return { violations, warnings, alternative_times: alternativeTimes };
}

function analyzeTrafficConditions(request: TruckRoutingRequest) {
  const departureTime = new Date(request.departure_time);
  const hour = departureTime.getHours();
  
  const isRushHour = (hour >= 6 && hour < 9) || (hour >= 16 && hour < 20);
  
  let congestionLevel: 'low' | 'medium' | 'high' = 'low';
  let delayMinutes = 0;

  if (isRushHour) {
    congestionLevel = 'high';
    delayMinutes = 45; // Base delay during rush hour
  } else if (hour >= 9 && hour < 16) {
    congestionLevel = 'medium';
    delayMinutes = 15;
  }

  return {
    congestion_level: congestionLevel,
    delay_minutes: delayMinutes,
    rush_hour_impact: isRushHour
  };
}

function calculateRouteCosts(route: any, truckSpecs: any) {
  const fuelConsumptionLiters = (route.distance_km * truckSpecs.fuel_consumption_l_per_100km) / 100;
  const fuelCostVND = fuelConsumptionLiters * FUEL_PRICE_VND;
  const tollCostVND = route.distance_km * 2500; // Average toll rate
  const co2EmissionKg = fuelConsumptionLiters * CO2_FACTOR_KG_PER_LITER;

  return {
    fuel_cost_vnd: Math.round(fuelCostVND),
    toll_cost_vnd: Math.round(tollCostVND),
    total_cost_vnd: Math.round(fuelCostVND + tollCostVND),
    co2_emission_kg: Math.round(co2EmissionKg * 100) / 100
  };
}

async function cacheRouteResult(request: TruckRoutingRequest, response: TruckRoutingResponse) {
  try {
    const cacheKey = generateCacheKey(request);
    const command = new PutItemCommand({
      TableName: 'route-cache',
      Item: {
        cache_key: { S: cacheKey },
        result: { S: JSON.stringify(response) },
        ttl: { N: (Math.floor(Date.now() / 1000) + 3600).toString() }, // 1 hour TTL
        created_at: { S: new Date().toISOString() }
      }
    });

    await dynamoClient.send(command);
  } catch (error) {
    console.error('Cache error:', error);
    // Don't fail the request if caching fails
  }
}

// Helper functions
function validateRequest(request: TruckRoutingRequest): string | null {
  if (!request.origin || !request.destination) {
    return 'Origin and destination are required';
  }
  
  if (!request.truck_specs || !request.truck_specs.type) {
    return 'Truck specifications are required';
  }
  
  if (!request.departure_time) {
    return 'Departure time is required';
  }
  
  return null;
}

function createErrorResponse(statusCode: number, message: string): APIGatewayProxyResult {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({ error: message })
  };
}

function isInHoChiMinhCity(point: { lat: number; lng: number }): boolean {
  // Simplified bounding box for Ho Chi Minh City
  return point.lat >= 10.6 && point.lat <= 10.9 && 
         point.lng >= 106.5 && point.lng <= 106.9;
}

function isInHanoi(point: { lat: number; lng: number }): boolean {
  // Simplified bounding box for Hanoi
  return point.lat >= 20.9 && point.lat <= 21.1 && 
         point.lng >= 105.7 && point.lng <= 105.9;
}

function isTimeInRange(time: string, start: string, end: string): boolean {
  const timeMinutes = timeToMinutes(time);
  const startMinutes = timeToMinutes(start);
  const endMinutes = timeToMinutes(end);
  
  return timeMinutes >= startMinutes && timeMinutes <= endMinutes;
}

function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

function generateCacheKey(request: TruckRoutingRequest): string {
  return `${request.origin.lat},${request.origin.lng}-${request.destination.lat},${request.destination.lng}-${request.truck_specs.type}-${request.departure_time}`;
}

// Export for local testing
export { calculateRouteWithAWS, checkVietnameseRestrictions, analyzeTrafficConditions };
