'use client';

import React, { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Switch } from '@/components/ui/switch';
import { 
  MapPin, 
  Truck, 
  Navigation as RouteIcon, 
  Clock, 
  DollarSign, 
  Zap, 
  Brain, 
  Settings,
  Play,
  Pause,
  RotateCcw,
  Download,
  Upload,
  Eye,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Activity,
  Navigation,
  Fuel,
  Leaf,
  Shield,
  Target,
  Map,
  Layers,
  Search,
  Plus,
  Minus,
  Globe
} from 'lucide-react';

// Dynamic import to prevent SSR issues
const EnhancedTruckMap = dynamic(
  () => import('./map/EnhancedTruckMap'),
  { 
    ssr: false,
    loading: () => (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Loading Enhanced Mapping System...</p>
        </CardContent>
      </Card>
    )
  }
);

import { VIETNAM_LOCATIONS, DetailedLocation } from '@/lib/vietnamLocations';
import { ORSIntegration } from '@/lib/ors-integration';

interface RouteLocation {
  id: string;
  name: string;
  lat: number;
  lng: number;
  type: 'depot' | 'destination' | 'waypoint' | 'truck' | 'port' | 'warehouse';
  address?: string;
  province?: string;
}

interface TruckSpecs {
  weight: number; // tons
  height: number; // meters
  width: number; // meters
  length: number; // meters
  type: 'container_20ft' | 'container_40ft' | 'flatbed' | 'tanker';
}

interface OptimizedRoute {
  id: string;
  locations: RouteLocation[];
  totalDistance: number; // km
  totalDuration: number; // hours
  totalCost: number; // VND
  fuelCost: number; // VND
  tollCost: number; // VND
  driverCost: number; // VND
  maintenanceCost: number; // VND
  co2Emissions: number; // kg
  efficiency: number; // percentage
  warnings: string[];
  recommendations: string[];
  routeGeometry?: any;
}

interface ComprehensiveRouteOptimizerProps {
  className?: string;
  onRouteOptimized?: (route: OptimizedRoute) => void;
  onError?: (error: string) => void;
}

const TRUCK_SPECIFICATIONS = {
  container_20ft: { weight: 24, height: 4.0, width: 2.4, length: 12.2 },
  container_40ft: { weight: 32, height: 4.0, width: 2.4, length: 16.5 },
  flatbed: { weight: 25, height: 3.5, width: 2.5, length: 15.0 },
  tanker: { weight: 35, height: 4.2, width: 2.5, length: 16.0 }
};

const OPTIMIZATION_ALGORITHMS = [
  { id: 'fastest', name: 'Fastest Route', description: 'Minimize travel time' },
  { id: 'shortest', name: 'Shortest Distance', description: 'Minimize total distance' },
  { id: 'eco', name: 'Eco-Friendly', description: 'Minimize fuel consumption and emissions' },
  { id: 'cost', name: 'Cost Optimized', description: 'Minimize total operational cost' },
  { id: 'balanced', name: 'Balanced', description: 'Balance time, distance, and cost' }
];

const ComprehensiveRouteOptimizer: React.FC<ComprehensiveRouteOptimizerProps> = ({
  className = '',
  onRouteOptimized,
  onError
}) => {
  // State management
  const [locations, setLocations] = useState<RouteLocation[]>([]);
  const [selectedTruckType, setSelectedTruckType] = useState<keyof typeof TRUCK_SPECIFICATIONS>('container_40ft');
  const [optimizationAlgorithm, setOptimizationAlgorithm] = useState('balanced');
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizationProgress, setOptimizationProgress] = useState(0);
  const [optimizedRoute, setOptimizedRoute] = useState<OptimizedRoute | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredLocations, setFilteredLocations] = useState<DetailedLocation[]>(VIETNAM_LOCATIONS);
  
  // Route options
  const [avoidTolls, setAvoidTolls] = useState(false);
  const [avoidHighways, setAvoidHighways] = useState(false);
  const [avoidFerries, setAvoidFerries] = useState(false);
  const [departureTime, setDepartureTime] = useState('08:00');
  
  // Map settings
  const [mapProvider, setMapProvider] = useState('osm');
  const [showTraffic, setShowTraffic] = useState(false);
  const [showRestrictions, setShowRestrictions] = useState(true);

  // ORS API key check
  const orsApiKey = process.env.NEXT_PUBLIC_ORS_API_KEY;
  const hasApiKey = orsApiKey && orsApiKey.length > 0;

  // Filter locations based on search
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredLocations(VIETNAM_LOCATIONS);
    } else {
      const filtered = VIETNAM_LOCATIONS.filter(location =>
        location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        location.nameEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
        location.province.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredLocations(filtered);
    }
  }, [searchTerm]);

  // Add location to route
  const addLocation = useCallback((location: DetailedLocation | RouteLocation) => {
    const newLocation: RouteLocation = {
      id: location.id,
      name: location.name,
      lat: 'coordinates' in location ? location.coordinates.lat : location.lat,
      lng: 'coordinates' in location ? location.coordinates.lng : location.lng,
      type: location.type as RouteLocation['type'],
      address: 'contactInfo' in location ? location.contactInfo?.address : location.address,
      province: location.province
    };

    setLocations(prev => {
      const exists = prev.find(loc => loc.id === newLocation.id);
      if (exists) return prev;
      return [...prev, newLocation];
    });
  }, []);

  // Remove location from route
  const removeLocation = useCallback((locationId: string) => {
    setLocations(prev => prev.filter(loc => loc.id !== locationId));
  }, []);

  // Calculate route costs
  const calculateRouteCosts = (distance: number, duration: number, truckType: keyof typeof TRUCK_SPECIFICATIONS) => {
    const specs = TRUCK_SPECIFICATIONS[truckType];
    
    // Fuel consumption (liters per 100km)
    const fuelConsumptionPer100km = specs.weight > 30 ? 40 : specs.weight > 25 ? 35 : 30;
    const fuelConsumed = (distance / 100) * fuelConsumptionPer100km;
    const fuelCost = fuelConsumed * 25000; // VND per liter
    
    // Driver cost (VND per hour)
    const driverCost = duration * 50000;
    
    // Toll cost (estimated VND per km)
    const tollCost = avoidTolls ? 0 : distance * 2000;
    
    // Maintenance cost (VND per km)
    const maintenanceCost = distance * 1500;
    
    const totalCost = fuelCost + driverCost + tollCost + maintenanceCost;
    
    return {
      fuelCost: Math.round(fuelCost),
      driverCost: Math.round(driverCost),
      tollCost: Math.round(tollCost),
      maintenanceCost: Math.round(maintenanceCost),
      totalCost: Math.round(totalCost),
      co2Emissions: Math.round(fuelConsumed * 2.6) // kg CO2 per liter
    };
  };

  // Optimize route using multiple algorithms
  const optimizeRoute = async () => {
    if (locations.length < 2) {
      onError?.('Please add at least 2 locations to optimize route');
      return;
    }

    if (!hasApiKey) {
      onError?.('OpenRouteService API key is required for route optimization');
      return;
    }

    setIsOptimizing(true);
    setOptimizationProgress(0);

    try {
      const orsService = new ORSIntegration(orsApiKey!);
      const truckSpecs = TRUCK_SPECIFICATIONS[selectedTruckType];
      
      // Progress simulation
      const progressInterval = setInterval(() => {
        setOptimizationProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      // Prepare coordinates for ORS
      const coordinates: [number, number][] = locations.map(loc => [loc.lng, loc.lat]);
      
      // ORS routing options
      const routeOptions = {
        profile: 'driving-hgv' as const,
        preference: optimizationAlgorithm === 'fastest' ? 'fastest' as const : 'shortest' as const,
        options: {
          avoid_features: [
            ...(avoidTolls ? ['tollways'] : []),
            ...(avoidHighways ? ['highways'] : []),
            ...(avoidFerries ? ['ferries'] : [])
          ],
          vehicle_type: 'hgv' as const,
          profile_params: {
            weight: truckSpecs.weight,
            height: truckSpecs.height,
            width: truckSpecs.width,
            length: truckSpecs.length
          }
        }
      };

      // Get route from ORS
      const orsResponse = await orsService.getDirections(coordinates, routeOptions);
      
      if (!orsResponse.routes || orsResponse.routes.length === 0) {
        throw new Error('No route found');
      }

      const route = orsResponse.routes[0];
      const distanceKm = route.summary.distance / 1000;
      const durationHours = route.summary.duration / 3600;

      // Calculate costs
      const costs = calculateRouteCosts(distanceKm, durationHours, selectedTruckType);

      // Generate warnings and recommendations
      const warnings: string[] = [];
      const recommendations: string[] = [];

      if (truckSpecs.weight > 25) {
        warnings.push('Heavy vehicle - check bridge weight limits');
      }
      if (truckSpecs.height > 4.0) {
        warnings.push('High vehicle - check tunnel and bridge clearances');
      }
      if (distanceKm > 500) {
        recommendations.push('Consider overnight rest stops for driver safety');
      }
      if (costs.fuelCost > 2000000) {
        recommendations.push('High fuel cost - consider fuel-efficient driving techniques');
      }

      // Calculate efficiency score
      const baseDistance = Math.sqrt(
        Math.pow(locations[locations.length - 1].lat - locations[0].lat, 2) +
        Math.pow(locations[locations.length - 1].lng - locations[0].lng, 2)
      ) * 111; // Rough km conversion
      
      const efficiency = Math.max(0, Math.min(100, (baseDistance / distanceKm) * 100));

      const optimizedRoute: OptimizedRoute = {
        id: Date.now().toString(),
        locations,
        totalDistance: Math.round(distanceKm),
        totalDuration: Math.round(durationHours * 10) / 10,
        ...costs,
        efficiency: Math.round(efficiency),
        warnings,
        recommendations,
        routeGeometry: route.geometry
      };

      clearInterval(progressInterval);
      setOptimizationProgress(100);
      setOptimizedRoute(optimizedRoute);
      onRouteOptimized?.(optimizedRoute);

    } catch (error) {
      console.error('Route optimization error:', error);
      onError?.(error instanceof Error ? error.message : 'Route optimization failed');
    } finally {
      setIsOptimizing(false);
    }
  };

  // Export route data
  const exportRoute = () => {
    if (!optimizedRoute) return;
    
    const exportData = {
      route: optimizedRoute,
      settings: {
        truckType: selectedTruckType,
        algorithm: optimizationAlgorithm,
        options: { avoidTolls, avoidHighways, avoidFerries }
      },
      exportedAt: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `route-${optimizedRoute.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-6 h-6 text-blue-600" />
            Comprehensive Route Optimizer
            <Badge variant="outline" className="ml-2">AI Enhanced</Badge>
          </CardTitle>
          <p className="text-gray-600">
            Advanced route optimization with Leaflet mapping, OpenRouteService integration, 
            Vietnam GeoJSON data, and multiple optimization algorithms.
          </p>
        </CardHeader>
      </Card>

      {/* API Key Status */}
      {!hasApiKey && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Setup Required:</strong> Configure your OpenRouteService API key to enable advanced routing features.
            <br />
            <a 
              href="https://openrouteservice.org/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Get your free API key here
            </a>
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Configuration Panel */}
        <div className="lg:col-span-1 space-y-4">
          {/* Location Search */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Search className="w-5 h-5" />
                Add Locations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="search">Search Vietnam Locations</Label>
                <Input
                  id="search"
                  placeholder="Search ports, depots, cities..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="max-h-48 overflow-y-auto space-y-2">
                {filteredLocations.slice(0, 10).map((location) => (
                  <div
                    key={location.id}
                    className="p-2 border rounded cursor-pointer hover:bg-gray-50 text-sm"
                    onClick={() => addLocation(location)}
                  >
                    <div className="font-medium">{location.name}</div>
                    <div className="text-gray-500 text-xs">
                      {location.province} • {location.type}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Current Route */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <RouteIcon className="w-5 h-5" />
                Route ({locations.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {locations.map((location, index) => (
                  <div key={location.id} className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm">
                    <div>
                      <span className="font-medium">{index + 1}. {location.name}</span>
                      <div className="text-gray-500 text-xs">{location.province}</div>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeLocation(location.id)}
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                {locations.length === 0 && (
                  <p className="text-gray-500 text-sm text-center py-4">
                    No locations added yet
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Truck Configuration */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Truck className="w-5 h-5" />
                Truck Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="truck-type">Truck Type</Label>
                <Select value={selectedTruckType} onValueChange={(value: any) => setSelectedTruckType(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="container_20ft">20ft Container</SelectItem>
                    <SelectItem value="container_40ft">40ft Container</SelectItem>
                    <SelectItem value="flatbed">Flatbed Truck</SelectItem>
                    <SelectItem value="tanker">Tanker Truck</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="algorithm">Optimization Algorithm</Label>
                <Select value={optimizationAlgorithm} onValueChange={setOptimizationAlgorithm}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {OPTIMIZATION_ALGORITHMS.map((algo) => (
                      <SelectItem key={algo.id} value={algo.id}>
                        {algo.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="avoid-tolls">Avoid Tolls</Label>
                  <Switch
                    id="avoid-tolls"
                    checked={avoidTolls}
                    onCheckedChange={setAvoidTolls}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="avoid-highways">Avoid Highways</Label>
                  <Switch
                    id="avoid-highways"
                    checked={avoidHighways}
                    onCheckedChange={setAvoidHighways}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="avoid-ferries">Avoid Ferries</Label>
                  <Switch
                    id="avoid-ferries"
                    checked={avoidFerries}
                    onCheckedChange={setAvoidFerries}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Optimize Button */}
          <Button
            onClick={optimizeRoute}
            disabled={isOptimizing || locations.length < 2 || !hasApiKey}
            className="w-full"
            size="lg"
          >
            {isOptimizing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Optimizing...
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 mr-2" />
                Optimize Route
              </>
            )}
          </Button>

          {/* Progress */}
          {isOptimizing && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>{optimizationProgress}%</span>
              </div>
              <Progress value={optimizationProgress} />
            </div>
          )}
        </div>

        {/* Map and Results */}
        <div className="lg:col-span-3 space-y-4">
          {/* Interactive Map */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Map className="w-5 h-5" />
                Interactive Map
                <div className="ml-auto flex gap-2">
                  <Select value={mapProvider} onValueChange={setMapProvider}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="osm">OpenStreetMap</SelectItem>
                      <SelectItem value="satellite">Satellite</SelectItem>
                      <SelectItem value="terrain">Terrain</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-96 rounded-lg overflow-hidden">
                {hasApiKey ? (
                  <EnhancedTruckMap
                    orsApiKey={orsApiKey!}
                    locations={locations}
                    optimizedRoute={optimizedRoute}
                    mapProvider={mapProvider}
                    onLocationAdd={addLocation}
                    onLocationRemove={removeLocation}
                  />
                ) : (
                  <div className="h-full flex items-center justify-center bg-gray-100 text-gray-500">
                    <div className="text-center">
                      <Globe className="w-16 h-16 mx-auto mb-4 opacity-50" />
                      <p>Configure ORS API key to enable interactive mapping</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Route Results */}
          {optimizedRoute && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  Optimization Results
                  <div className="ml-auto">
                    <Button onClick={exportRoute} variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="overview">
                  <TabsList>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="costs">Cost Analysis</TabsTrigger>
                    <TabsTrigger value="environmental">Environmental</TabsTrigger>
                    <TabsTrigger value="warnings">Warnings</TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview" className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">
                          {optimizedRoute.totalDistance} km
                        </div>
                        <div className="text-sm text-gray-600">Total Distance</div>
                      </div>
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">
                          {optimizedRoute.totalDuration}h
                        </div>
                        <div className="text-sm text-gray-600">Duration</div>
                      </div>
                      <div className="text-center p-4 bg-purple-50 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">
                          {(optimizedRoute.totalCost / 1000000).toFixed(1)}M
                        </div>
                        <div className="text-sm text-gray-600">Total Cost (VND)</div>
                      </div>
                      <div className="text-center p-4 bg-orange-50 rounded-lg">
                        <div className="text-2xl font-bold text-orange-600">
                          {optimizedRoute.efficiency}%
                        </div>
                        <div className="text-sm text-gray-600">Efficiency</div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="costs" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Fuel Cost:</span>
                          <span className="font-medium">{(optimizedRoute.fuelCost / 1000).toFixed(0)}K VND</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Driver Cost:</span>
                          <span className="font-medium">{(optimizedRoute.driverCost / 1000).toFixed(0)}K VND</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Toll Cost:</span>
                          <span className="font-medium">{(optimizedRoute.tollCost / 1000).toFixed(0)}K VND</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Maintenance:</span>
                          <span className="font-medium">{(optimizedRoute.maintenanceCost / 1000).toFixed(0)}K VND</span>
                        </div>
                        <div className="flex justify-between font-bold border-t pt-2">
                          <span>Total:</span>
                          <span>{(optimizedRoute.totalCost / 1000000).toFixed(1)}M VND</span>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="environmental" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <Leaf className="w-8 h-8 text-green-600 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-green-600">
                          {optimizedRoute.co2Emissions} kg
                        </div>
                        <div className="text-sm text-gray-600">CO2 Emissions</div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="warnings" className="space-y-4">
                    {optimizedRoute.warnings.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="font-medium text-orange-600">Warnings:</h4>
                        {optimizedRoute.warnings.map((warning, index) => (
                          <div key={index} className="flex items-start gap-2 p-2 bg-orange-50 rounded">
                            <AlertTriangle className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-orange-800">{warning}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {optimizedRoute.recommendations.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="font-medium text-blue-600">Recommendations:</h4>
                        {optimizedRoute.recommendations.map((rec, index) => (
                          <div key={index} className="flex items-start gap-2 p-2 bg-blue-50 rounded">
                            <Brain className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-blue-800">{rec}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default ComprehensiveRouteOptimizer;
