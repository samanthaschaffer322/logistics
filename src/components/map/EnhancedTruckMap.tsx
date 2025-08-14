'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap, useMapEvents } from 'react-leaflet';
import L, { LatLngExpression, Icon } from 'leaflet';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
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
  Zap,
  Anchor,
  Warehouse,
  Factory
} from 'lucide-react';

import { ORSIntegration } from '@/lib/ors-integration';
import { VIETNAM_LOCATIONS, DetailedLocation } from '@/lib/vietnamLocations';

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
        ${type === 'depot' ? 'D' : type === 'truck' ? 'T' : type === 'port' ? 'P' : type === 'warehouse' ? 'W' : 'L'}
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
  warehouse: createCustomIcon('warehouse', '#6B7280'),
  industrial_zone: createCustomIcon('industrial_zone', '#F97316'),
  logistics_hub: createCustomIcon('logistics_hub', '#06B6D4'),
  distribution_center: createCustomIcon('distribution_center', '#84CC16')
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
    url: 'https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png',
    attribution: '© OpenStreetMap France'
  }
};

interface RouteLocation {
  id: string;
  name: string;
  lat: number;
  lng: number;
  type: 'depot' | 'destination' | 'waypoint' | 'truck' | 'port' | 'warehouse' | 'industrial_zone' | 'logistics_hub' | 'distribution_center';
  address?: string;
  province?: string;
}

interface OptimizedRoute {
  id: string;
  locations: RouteLocation[];
  totalDistance: number;
  totalDuration: number;
  totalCost: number;
  routeGeometry?: any;
}

interface EnhancedTruckMapProps {
  className?: string;
  orsApiKey: string;
  locations?: RouteLocation[];
  optimizedRoute?: OptimizedRoute | null;
  mapProvider?: string;
  onLocationAdd?: (location: RouteLocation) => void;
  onLocationRemove?: (locationId: string) => void;
}

// Map click handler component
const MapClickHandler: React.FC<{
  onLocationAdd?: (location: RouteLocation) => void;
}> = ({ onLocationAdd }) => {
  useMapEvents({
    click: (e) => {
      if (onLocationAdd) {
        const newLocation: RouteLocation = {
          id: `custom_${Date.now()}`,
          name: `Custom Location (${e.latlng.lat.toFixed(4)}, ${e.latlng.lng.toFixed(4)})`,
          lat: e.latlng.lat,
          lng: e.latlng.lng,
          type: 'waypoint',
          address: `Lat: ${e.latlng.lat.toFixed(4)}, Lng: ${e.latlng.lng.toFixed(4)}`
        };
        onLocationAdd(newLocation);
      }
    }
  });
  return null;
};

// Route display component
const RouteDisplay: React.FC<{
  route?: OptimizedRoute | null;
}> = ({ route }) => {
  if (!route || !route.routeGeometry) return null;

  // Convert GeoJSON to Leaflet coordinates
  const coordinates: LatLngExpression[] = route.routeGeometry.coordinates.map(
    (coord: [number, number]) => [coord[1], coord[0]] as LatLngExpression
  );

  return (
    <Polyline
      positions={coordinates}
      color="#3B82F6"
      weight={4}
      opacity={0.8}
    />
  );
};

const EnhancedTruckMap: React.FC<EnhancedTruckMapProps> = ({
  className = '',
  orsApiKey,
  locations = [],
  optimizedRoute,
  mapProvider = 'osm',
  onLocationAdd,
  onLocationRemove
}) => {
  const [currentProvider, setCurrentProvider] = useState(mapProvider);
  const [showVietnamLocations, setShowVietnamLocations] = useState(true);
  const [showRoute, setShowRoute] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredVietnamLocations, setFilteredVietnamLocations] = useState<DetailedLocation[]>(VIETNAM_LOCATIONS);
  const [mapCenter, setMapCenter] = useState<[number, number]>([16.0544, 108.2022]); // Vietnam center
  const [mapZoom, setMapZoom] = useState(6);

  // Filter Vietnam locations based on search
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredVietnamLocations(VIETNAM_LOCATIONS);
    } else {
      const filtered = VIETNAM_LOCATIONS.filter(location =>
        location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        location.nameEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
        location.province.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredVietnamLocations(filtered);
    }
  }, [searchTerm]);

  // Get icon for location type
  const getLocationIcon = (type: string) => {
    return LOCATION_ICONS[type as keyof typeof LOCATION_ICONS] || LOCATION_ICONS.waypoint;
  };

  // Add Vietnam location to route
  const addVietnamLocation = (location: DetailedLocation) => {
    if (onLocationAdd) {
      const routeLocation: RouteLocation = {
        id: location.id,
        name: location.name,
        lat: location.coordinates.lat,
        lng: location.coordinates.lng,
        type: location.type as RouteLocation['type'],
        address: location.contactInfo?.address,
        province: location.province
      };
      onLocationAdd(routeLocation);
    }
  };

  // Center map on locations
  const centerOnLocations = () => {
    if (locations.length > 0) {
      const bounds = L.latLngBounds(locations.map(loc => [loc.lat, loc.lng]));
      setMapCenter([bounds.getCenter().lat, bounds.getCenter().lng]);
      setMapZoom(8);
    }
  };

  // Reset map view
  const resetMapView = () => {
    setMapCenter([16.0544, 108.2022]);
    setMapZoom(6);
  };

  const provider = MAP_PROVIDERS[currentProvider as keyof typeof MAP_PROVIDERS] || MAP_PROVIDERS.osm;

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Map Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Layers className="w-5 h-5" />
            Map Controls
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="map-provider">Map Provider</Label>
              <Select value={currentProvider} onValueChange={setCurrentProvider}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="osm">OpenStreetMap</SelectItem>
                  <SelectItem value="satellite">Satellite</SelectItem>
                  <SelectItem value="terrain">Terrain</SelectItem>
                  <SelectItem value="transport">Transport</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="vietnam-search">Search Vietnam Locations</Label>
              <Input
                id="vietnam-search"
                placeholder="Search ports, depots..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="show-vietnam"
                  checked={showVietnamLocations}
                  onCheckedChange={setShowVietnamLocations}
                />
                <Label htmlFor="show-vietnam">Show Vietnam Locations</Label>
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={centerOnLocations} variant="outline" size="sm">
                <Target className="w-4 h-4 mr-1" />
                Center
              </Button>
              <Button onClick={resetMapView} variant="outline" size="sm">
                <RotateCcw className="w-4 h-4 mr-1" />
                Reset
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Vietnam Locations Quick Add */}
      {searchTerm && filteredVietnamLocations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Search className="w-5 h-5" />
              Search Results ({filteredVietnamLocations.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 max-h-32 overflow-y-auto">
              {filteredVietnamLocations.slice(0, 9).map((location) => (
                <Button
                  key={location.id}
                  variant="outline"
                  size="sm"
                  onClick={() => addVietnamLocation(location)}
                  className="justify-start text-left"
                >
                  <div className="flex items-center gap-2">
                    {location.type === 'port' && <Anchor className="w-4 h-4" />}
                    {location.type === 'depot' && <Truck className="w-4 h-4" />}
                    {location.type === 'warehouse' && <Warehouse className="w-4 h-4" />}
                    {location.type === 'industrial_zone' && <Factory className="w-4 h-4" />}
                    <div>
                      <div className="font-medium text-xs">{location.name}</div>
                      <div className="text-xs text-gray-500">{location.province}</div>
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Interactive Map */}
      <Card>
        <CardContent className="p-0">
          <div className="h-96 w-full rounded-lg overflow-hidden">
            <MapContainer
              center={mapCenter}
              zoom={mapZoom}
              style={{ height: '100%', width: '100%' }}
              className="z-0"
            >
              <TileLayer
                url={provider.url}
                attribution={provider.attribution}
              />

              {/* Map click handler */}
              <MapClickHandler onLocationAdd={onLocationAdd} />

              {/* Vietnam locations */}
              {showVietnamLocations && filteredVietnamLocations.map((location) => (
                <Marker
                  key={`vietnam_${location.id}`}
                  position={[location.coordinates.lat, location.coordinates.lng]}
                  icon={getLocationIcon(location.type)}
                >
                  <Popup>
                    <div className="space-y-2">
                      <div>
                        <h3 className="font-medium">{location.name}</h3>
                        <p className="text-sm text-gray-600">{location.nameEn}</p>
                      </div>
                      <div className="text-sm">
                        <p><strong>Type:</strong> {location.type.replace('_', ' ')}</p>
                        <p><strong>Province:</strong> {location.province}</p>
                        <p><strong>Hours:</strong> {location.operatingHours}</p>
                      </div>
                      {location.services.length > 0 && (
                        <div className="text-sm">
                          <p><strong>Services:</strong></p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {location.services.slice(0, 3).map((service, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {service.replace('_', ' ')}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      <Button
                        onClick={() => addVietnamLocation(location)}
                        size="sm"
                        className="w-full"
                      >
                        <Plus className="w-3 h-3 mr-1" />
                        Add to Route
                      </Button>
                    </div>
                  </Popup>
                </Marker>
              ))}

              {/* Route locations */}
              {locations.map((location, index) => (
                <Marker
                  key={location.id}
                  position={[location.lat, location.lng]}
                  icon={getLocationIcon(location.type)}
                >
                  <Popup>
                    <div className="space-y-2">
                      <div>
                        <h3 className="font-medium">
                          {index + 1}. {location.name}
                        </h3>
                        {location.address && (
                          <p className="text-sm text-gray-600">{location.address}</p>
                        )}
                      </div>
                      <div className="text-sm">
                        <p><strong>Type:</strong> {location.type.replace('_', ' ')}</p>
                        {location.province && (
                          <p><strong>Province:</strong> {location.province}</p>
                        )}
                        <p><strong>Coordinates:</strong> {location.lat.toFixed(4)}, {location.lng.toFixed(4)}</p>
                      </div>
                      {onLocationRemove && (
                        <Button
                          onClick={() => onLocationRemove(location.id)}
                          size="sm"
                          variant="destructive"
                          className="w-full"
                        >
                          <Minus className="w-3 h-3 mr-1" />
                          Remove
                        </Button>
                      )}
                    </div>
                  </Popup>
                </Marker>
              ))}

              {/* Optimized route */}
              {showRoute && optimizedRoute && (
                <RouteDisplay route={optimizedRoute} />
              )}
            </MapContainer>
          </div>
        </CardContent>
      </Card>

      {/* Map Legend */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <MapPin className="w-5 h-5" />
            Map Legend
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
              <span>Depots</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-purple-500 rounded-full"></div>
              <span>Ports</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-500 rounded-full"></div>
              <span>Warehouses</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
              <span>Industrial Zones</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded-full"></div>
              <span>Destinations</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
              <span>Waypoints</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-500 rounded-full"></div>
              <span>Trucks</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-cyan-500 rounded-full"></div>
              <span>Logistics Hubs</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Usage Instructions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Navigation className="w-5 h-5" />
            How to Use
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-medium mb-2">Adding Locations:</h4>
              <ul className="space-y-1 text-gray-600">
                <li>• Click anywhere on the map to add a custom waypoint</li>
                <li>• Search for Vietnam locations using the search box</li>
                <li>• Click "Add to Route" in location popups</li>
                <li>• Use the quick-add buttons for search results</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Map Features:</h4>
              <ul className="space-y-1 text-gray-600">
                <li>• Switch between different map providers</li>
                <li>• Toggle Vietnam locations visibility</li>
                <li>• Center map on your route locations</li>
                <li>• View detailed location information in popups</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedTruckMap;
