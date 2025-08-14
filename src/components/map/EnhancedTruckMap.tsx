'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap, useMapEvents } from 'react-leaflet';
import L, { LatLngExpression, Icon } from 'leaflet';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { 
  MapPin, 
  Truck, 
  Navigation, 
  Settings, 
  Layers, 
  Navigation as RouteIcon,
  Clock,
  DollarSign,
  Fuel,
  AlertTriangle,
  Download,
  Search,
  Plus,
  Minus,
  RotateCcw,
  Target,
  Zap
} from 'lucide-react';

import EnhancedMappingService, { 
  MapLocation, 
  OptimizedRoute, 
  RouteOptions, 
  TruckSpecs 
} from '@/lib/enhanced-mapping-service';

// Fix Leaflet default markers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom icons for different location types
const createCustomIcon = (type: string, color: string) => new Icon({
  iconUrl: `data:image/svg+xml;base64,${btoa(`
    <svg width="25" height="41" viewBox="0 0 25 41" xmlns="http://www.w3.org/2000/svg">
      <path fill="${color}" stroke="#fff" stroke-width="2" d="M12.5 0C5.6 0 0 5.6 0 12.5c0 12.5 12.5 28.5 12.5 28.5s12.5-16 12.5-28.5C25 5.6 19.4 0 12.5 0z"/>
      <circle fill="#fff" cx="12.5" cy="12.5" r="6"/>
      <text x="12.5" y="17" text-anchor="middle" font-size="8" fill="${color}">
        ${type === 'depot' ? 'D' : type === 'truck' ? 'T' : type === 'port' ? 'P' : 'W'}
      </text>
    </svg>
  `)}`,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const LOCATION_ICONS = {
  depot: createCustomIcon('depot', '#3B82F6'),
  destination: createCustomIcon('destination', '#10B981'),
  waypoint: createCustomIcon('waypoint', '#F59E0B'),
  truck: createCustomIcon('truck', '#EF4444'),
  port: createCustomIcon('port', '#8B5CF6'),
  warehouse: createCustomIcon('warehouse', '#6B7280')
};

// Map tile providers
const MAP_PROVIDERS = {
  osm: {
    name: 'OpenStreetMap',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '© OpenStreetMap contributors'
  },
  satellite: {
    name: 'Satellite',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: '© Esri'
  },
  terrain: {
    name: 'Terrain',
    url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
    attribution: '© OpenTopoMap contributors'
  },
  transport: {
    name: 'Transport',
    url: 'https://{s}.tile.thunderforest.com/transport/{z}/{x}/{y}.png?apikey=YOUR_API_KEY',
    attribution: '© Thunderforest'
  }
};

interface EnhancedTruckMapProps {
  className?: string;
  orsApiKey: string;
  onRouteOptimized?: (route: OptimizedRoute) => void;
  initialLocations?: MapLocation[];
  truckSpecs?: TruckSpecs;
}

interface MapState {
  locations: MapLocation[];
  optimizedRoute: OptimizedRoute | null;
  isOptimizing: boolean;
  selectedLocation: MapLocation | null;
  mapProvider: keyof typeof MAP_PROVIDERS;
  showTraffic: boolean;
  showRestrictions: boolean;
  searchQuery: string;
  searchResults: MapLocation[];
}

// Map event handler component
const MapEventHandler: React.FC<{
  onMapClick: (latlng: { lat: number; lng: number }) => void;
}> = ({ onMapClick }) => {
  useMapEvents({
    click: (e) => {
      onMapClick({ lat: e.latlng.lat, lng: e.latlng.lng });
    }
  });
  return null;
};

// Route display component
const RouteDisplay: React.FC<{ route: OptimizedRoute }> = ({ route }) => {
  const routeCoordinates: LatLngExpression[] = [];
  
  // Extract coordinates from route segments
  route.segments.forEach(segment => {
    if (segment.geometry && segment.geometry.coordinates) {
      segment.geometry.coordinates.forEach((coord: [number, number]) => {
        routeCoordinates.push([coord[1], coord[0]]); // Leaflet uses [lat, lng]
      });
    }
  });

  return (
    <>
      {routeCoordinates.length > 0 && (
        <Polyline
          positions={routeCoordinates}
          color="#3B82F6"
          weight={4}
          opacity={0.8}
        />
      )}
    </>
  );
};

const EnhancedTruckMap: React.FC<EnhancedTruckMapProps> = ({
  className = '',
  orsApiKey,
  onRouteOptimized,
  initialLocations = [],
  truckSpecs
}) => {
  const [state, setState] = useState<MapState>({
    locations: initialLocations,
    optimizedRoute: null,
    isOptimizing: false,
    selectedLocation: null,
    mapProvider: 'osm',
    showTraffic: false,
    showRestrictions: true,
    searchQuery: '',
    searchResults: []
  });

  const [routeOptions, setRouteOptions] = useState<RouteOptions>({
    profile: 'driving-hgv',
    preference: 'fastest',
    avoidTolls: false,
    avoidFerries: false,
    avoidHighways: false,
    truckSpecs
  });

  const mappingService = useRef<EnhancedMappingService | null>(null);
  const mapRef = useRef<L.Map | null>(null);

  // Initialize mapping service
  useEffect(() => {
    if (orsApiKey) {
      mappingService.current = new EnhancedMappingService(orsApiKey);
    }
  }, [orsApiKey]);

  // Handle map click to add locations
  const handleMapClick = useCallback(async (latlng: { lat: number; lng: number }) => {
    if (!mappingService.current) return;

    try {
      const locationDetails = await mappingService.current.getLocationDetails(latlng.lat, latlng.lng);
      if (locationDetails) {
        setState(prev => ({
          ...prev,
          locations: [...prev.locations, {
            ...locationDetails,
            type: prev.locations.length === 0 ? 'depot' : 'destination'
          }]
        }));
      }
    } catch (error) {
      console.error('Failed to get location details:', error);
    }
  }, []);

  // Search for locations
  const handleSearch = useCallback(async () => {
    if (!mappingService.current || !state.searchQuery.trim()) return;

    try {
      const results = await mappingService.current.searchLocations(state.searchQuery);
      setState(prev => ({ ...prev, searchResults: results }));
    } catch (error) {
      console.error('Search failed:', error);
    }
  }, [state.searchQuery]);

  // Add location from search results
  const addLocationFromSearch = useCallback((location: MapLocation) => {
    setState(prev => ({
      ...prev,
      locations: [...prev.locations, {
        ...location,
        type: prev.locations.length === 0 ? 'depot' : 'destination'
      }],
      searchResults: []
    }));
  }, []);

  // Optimize route
  const optimizeRoute = useCallback(async () => {
    if (!mappingService.current || state.locations.length < 2) return;

    setState(prev => ({ ...prev, isOptimizing: true }));

    try {
      const optimizedRoute = await mappingService.current.optimizeRoute(
        state.locations,
        routeOptions
      );

      setState(prev => ({ ...prev, optimizedRoute, isOptimizing: false }));
      onRouteOptimized?.(optimizedRoute);
    } catch (error) {
      console.error('Route optimization failed:', error);
      setState(prev => ({ ...prev, isOptimizing: false }));
    }
  }, [state.locations, routeOptions, onRouteOptimized]);

  // Remove location
  const removeLocation = useCallback((locationId: string) => {
    setState(prev => ({
      ...prev,
      locations: prev.locations.filter(loc => loc.id !== locationId),
      optimizedRoute: null
    }));
  }, []);

  // Clear all locations
  const clearAllLocations = useCallback(() => {
    setState(prev => ({
      ...prev,
      locations: [],
      optimizedRoute: null,
      selectedLocation: null
    }));
  }, []);

  // Add major Vietnamese cities
  const addMajorCities = useCallback(() => {
    if (!mappingService.current) return;

    const provinces = mappingService.current.getVietnameseProvinces();
    const majorCities: MapLocation[] = provinces.slice(0, 5).map((province, index) => ({
      id: `city-${index}`,
      name: province.name,
      lat: province.center.lat,
      lng: province.center.lng,
      type: index === 0 ? 'depot' : 'destination',
      province: province.name
    }));

    setState(prev => ({
      ...prev,
      locations: [...prev.locations, ...majorCities]
    }));
  }, []);

  // Export route
  const exportRoute = useCallback((format: 'gpx' | 'kml') => {
    if (!mappingService.current || !state.optimizedRoute) return;

    const exportData = format === 'gpx' 
      ? mappingService.current.exportRouteToGPX(state.optimizedRoute)
      : mappingService.current.exportRouteToKML(state.optimizedRoute);

    const blob = new Blob([exportData], { type: 'text/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `truck-route-${Date.now()}.${format}`;
    a.click();
    URL.revokeObjectURL(url);
  }, [state.optimizedRoute]);

  return (
    <div className={`enhanced-truck-map ${className}`}>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 h-screen">
        {/* Control Panel */}
        <div className="lg:col-span-1 space-y-4 p-4 bg-white overflow-y-auto">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="w-5 h-5" />
                Location Search
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Search Vietnamese locations..."
                  value={state.searchQuery}
                  onChange={(e) => setState(prev => ({ ...prev, searchQuery: e.target.value }))}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
                <Button onClick={handleSearch} size="sm">
                  <Search className="w-4 h-4" />
                </Button>
              </div>

              {state.searchResults.length > 0 && (
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {state.searchResults.map((result) => (
                    <div
                      key={result.id}
                      className="p-2 border rounded cursor-pointer hover:bg-gray-50"
                      onClick={() => addLocationFromSearch(result)}
                    >
                      <div className="font-medium text-sm">{result.name}</div>
                      <div className="text-xs text-gray-500">{result.address}</div>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex gap-2">
                <Button onClick={addMajorCities} variant="outline" size="sm">
                  Add Major Cities
                </Button>
                <Button onClick={clearAllLocations} variant="outline" size="sm">
                  Clear All
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Locations ({state.locations.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {state.locations.map((location, index) => (
                  <div key={location.id} className="flex items-center justify-between p-2 border rounded">
                    <div className="flex-1">
                      <div className="font-medium text-sm">{location.name}</div>
                      <div className="text-xs text-gray-500">
                        {location.type} • {location.province}
                      </div>
                    </div>
                    <Button
                      onClick={() => removeLocation(location.id)}
                      variant="ghost"
                      size="sm"
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Route Options
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Vehicle Profile</Label>
                <Select
                  value={routeOptions.profile}
                  onValueChange={(value: 'driving-hgv' | 'driving-car') =>
                    setRouteOptions(prev => ({ ...prev, profile: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="driving-hgv">Heavy Goods Vehicle</SelectItem>
                    <SelectItem value="driving-car">Car</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Route Preference</Label>
                <Select
                  value={routeOptions.preference}
                  onValueChange={(value: 'fastest' | 'shortest' | 'eco') =>
                    setRouteOptions(prev => ({ ...prev, preference: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fastest">Fastest Route</SelectItem>
                    <SelectItem value="shortest">Shortest Route</SelectItem>
                    <SelectItem value="eco">Eco-Friendly</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Avoid Tolls</Label>
                  <Switch
                    checked={routeOptions.avoidTolls}
                    onCheckedChange={(checked) =>
                      setRouteOptions(prev => ({ ...prev, avoidTolls: checked }))
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Avoid Ferries</Label>
                  <Switch
                    checked={routeOptions.avoidFerries}
                    onCheckedChange={(checked) =>
                      setRouteOptions(prev => ({ ...prev, avoidFerries: checked }))
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Avoid Highways</Label>
                  <Switch
                    checked={routeOptions.avoidHighways}
                    onCheckedChange={(checked) =>
                      setRouteOptions(prev => ({ ...prev, avoidHighways: checked }))
                    }
                  />
                </div>
              </div>

              <Button
                onClick={optimizeRoute}
                disabled={state.locations.length < 2 || state.isOptimizing}
                className="w-full"
              >
                {state.isOptimizing ? (
                  <>
                    <Zap className="w-4 h-4 mr-2 animate-spin" />
                    Optimizing...
                  </>
                ) : (
                  <>
                    <RouteIcon className="w-4 h-4 mr-2" />
                    Optimize Route
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {state.optimizedRoute && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <RouteIcon className="w-5 h-5" />
                  Route Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-gray-500">Distance</div>
                    <div className="font-medium">
                      {(state.optimizedRoute.totalDistance / 1000).toFixed(1)} km
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-500">Duration</div>
                    <div className="font-medium">
                      {Math.round(state.optimizedRoute.totalDuration / 60)} min
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-500">Cost</div>
                    <div className="font-medium">
                      {state.optimizedRoute.totalCost.toLocaleString('vi-VN')} VND
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-500">Fuel</div>
                    <div className="font-medium">
                      {state.optimizedRoute.fuelConsumption.toFixed(1)} L
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={() => exportRoute('gpx')}
                    variant="outline"
                    size="sm"
                  >
                    <Download className="w-4 h-4 mr-1" />
                    GPX
                  </Button>
                  <Button
                    onClick={() => exportRoute('kml')}
                    variant="outline"
                    size="sm"
                  >
                    <Download className="w-4 h-4 mr-1" />
                    KML
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Map Container */}
        <div className="lg:col-span-3 relative">
          <div className="absolute top-4 right-4 z-[1000] space-y-2">
            <Select
              value={state.mapProvider}
              onValueChange={(value: keyof typeof MAP_PROVIDERS) =>
                setState(prev => ({ ...prev, mapProvider: value }))
              }
            >
              <SelectTrigger className="w-40 bg-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(MAP_PROVIDERS).map(([key, provider]) => (
                  <SelectItem key={key} value={key}>
                    {provider.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <MapContainer
            center={[16.047079, 108.20623]} // Center of Vietnam
            zoom={6}
            className="h-full w-full"
            ref={mapRef}
          >
            <TileLayer
              url={MAP_PROVIDERS[state.mapProvider].url}
              attribution={MAP_PROVIDERS[state.mapProvider].attribution}
            />

            <MapEventHandler onMapClick={handleMapClick} />

            {/* Location markers */}
            {state.locations.map((location) => (
              <Marker
                key={location.id}
                position={[location.lat, location.lng]}
                icon={LOCATION_ICONS[location.type]}
              >
                <Popup>
                  <div className="p-2">
                    <div className="font-medium">{location.name}</div>
                    <div className="text-sm text-gray-600">{location.address}</div>
                    <Badge variant="outline" className="mt-1">
                      {location.type}
                    </Badge>
                  </div>
                </Popup>
              </Marker>
            ))}

            {/* Optimized route */}
            {state.optimizedRoute && <RouteDisplay route={state.optimizedRoute} />}
          </MapContainer>
        </div>
      </div>
    </div>
  );
};

export default EnhancedTruckMap;
