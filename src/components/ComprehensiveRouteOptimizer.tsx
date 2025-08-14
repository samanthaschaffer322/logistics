'use client';

import React, { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Area, AreaChart
} from 'recharts';
import { 
  Truck, MapPin, Clock, DollarSign, Package, Navigation, 
  Settings, Play, Download, Upload, AlertTriangle, 
  CheckCircle, TrendingUp, Users, Zap, Target, Map,
  Fuel, Leaf, Activity, BarChart3, Globe, Shield,
  Search, Plus, Minus, RotateCcw, Eye, Brain
} from 'lucide-react';

// Dynamic imports to prevent SSR issues
const EnhancedTruckMap = dynamic(
  () => import('./map/EnhancedTruckMap'),
  { 
    ssr: false,
    loading: () => (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Loading Interactive Map...</p>
        </CardContent>
      </Card>
    )
  }
);

const VietnamMap = dynamic(
  () => import('./map/VietnamMap'),
  { 
    ssr: false,
    loading: () => (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Loading Vietnam Map...</p>
        </CardContent>
      </Card>
    )
  }
);

import EnhancedMappingService, { 
  MapLocation, 
  OptimizedRoute, 
  RouteOptions, 
  TruckSpecs 
} from '@/lib/enhanced-mapping-service';

interface ComprehensiveRouteOptimizerProps {
  className?: string;
}

interface OptimizationState {
  isOptimizing: boolean;
  progress: number;
  currentStep: string;
  results: OptimizedRoute[];
  selectedRoute: OptimizedRoute | null;
  locations: MapLocation[];
  truckSpecs: TruckSpecs;
  routeOptions: RouteOptions;
}

const ComprehensiveRouteOptimizer: React.FC<ComprehensiveRouteOptimizerProps> = ({
  className = ''
}) => {
  const [state, setState] = useState<OptimizationState>({
    isOptimizing: false,
    progress: 0,
    currentStep: '',
    results: [],
    selectedRoute: null,
    locations: [],
    truckSpecs: {
      weight: 25,
      height: 4.2,
      width: 2.5,
      length: 16.5,
      axles: 5,
      hazardousMaterials: false,
      type: 'container'
    },
    routeOptions: {
      profile: 'driving-hgv',
      preference: 'fastest',
      avoidTolls: false,
      avoidFerries: false,
      avoidHighways: false
    }
  });

  const [activeTab, setActiveTab] = useState('enhanced-map');
  const [mapView, setMapView] = useState<'enhanced' | 'vietnam'>('enhanced');
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);

  // Get ORS API key from environment
  const orsApiKey = process.env.NEXT_PUBLIC_ORS_API_KEY || '';
  const hasApiKey = orsApiKey && orsApiKey.length > 0 && orsApiKey !== 'your_ors_api_key_here';

  // Vietnam major cities for quick setup
  const vietnamCities: MapLocation[] = [
    { id: 'hcm', name: 'TP. Hồ Chí Minh', lat: 10.8231, lng: 106.6297, type: 'depot', province: 'TP. Hồ Chí Minh' },
    { id: 'hanoi', name: 'Hà Nội', lat: 21.0285, lng: 105.8542, type: 'destination', province: 'Hà Nội' },
    { id: 'danang', name: 'Đà Nẵng', lat: 16.0544, lng: 108.2022, type: 'destination', province: 'Đà Nẵng' },
    { id: 'cantho', name: 'Cần Thơ', lat: 10.0452, lng: 105.7469, type: 'destination', province: 'Cần Thơ' },
    { id: 'haiphong', name: 'Hải Phòng', lat: 20.8449, lng: 106.6881, type: 'destination', province: 'Hải Phòng' },
    { id: 'nhatrang', name: 'Nha Trang', lat: 12.2388, lng: 109.1967, type: 'destination', province: 'Khánh Hòa' },
    { id: 'vungtau', name: 'Vũng Tàu', lat: 10.4113, lng: 107.1365, type: 'destination', province: 'Bà Rịa - Vũng Tàu' },
  ];

  // Handle route optimization from map
  const handleRouteOptimized = useCallback((route: OptimizedRoute) => {
    setState(prev => ({
      ...prev,
      results: [route, ...prev.results.slice(0, 4)],
      selectedRoute: route
    }));
  }, []);

  // Add Vietnam cities for quick demo
  const addVietnamCities = useCallback(() => {
    setState(prev => ({
      ...prev,
      locations: [...prev.locations, ...vietnamCities.slice(0, 5)]
    }));
  }, []);

  // Clear all locations
  const clearAllLocations = useCallback(() => {
    setState(prev => ({
      ...prev,
      locations: [],
      selectedRoute: null,
      results: []
    }));
  }, []);

  // Update truck specifications
  const updateTruckSpecs = useCallback((field: keyof TruckSpecs, value: any) => {
    setState(prev => ({
      ...prev,
      truckSpecs: { ...prev.truckSpecs, [field]: value }
    }));
  }, []);

  // Update route options
  const updateRouteOptions = useCallback((field: keyof RouteOptions, value: any) => {
    setState(prev => ({
      ...prev,
      routeOptions: { ...prev.routeOptions, [field]: value }
    }));
  }, []);

  // Sample data for charts
  const costBreakdownData = state.selectedRoute ? [
    { name: 'Fuel', value: state.selectedRoute.totalCost * 0.6, color: '#0088FE' },
    { name: 'Driver', value: state.selectedRoute.totalCost * 0.3, color: '#00C49F' },
    { name: 'Maintenance', value: state.selectedRoute.totalCost * 0.1, color: '#FFBB28' }
  ] : [];

  const performanceData = state.results.map((route, index) => ({
    name: `Route ${index + 1}`,
    distance: route.totalDistance / 1000,
    duration: route.totalDuration / 60,
    cost: route.totalCost / 1000,
    fuel: route.fuelConsumption
  }));

  return (
    <div className={`comprehensive-route-optimizer ${className}`}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Comprehensive Route Optimizer</h2>
            <p className="text-gray-600">AI-powered route optimization with enhanced mapping for Vietnamese logistics</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="flex items-center gap-1">
              <Brain className="w-4 h-4" />
              AI Enhanced
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <Shield className="w-4 h-4" />
              Truck Optimized
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <Globe className="w-4 h-4" />
              Vietnam Ready
            </Badge>
          </div>
        </div>

        {/* API Key Status */}
        {!hasApiKey && (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Setup Required:</strong> To use enhanced mapping features, configure your OpenRouteService API key. 
              <a 
                href="https://openrouteservice.org/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline ml-1"
              >
                Get your free API key here
              </a>
            </AlertDescription>
          </Alert>
        )}

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-4">
          <Button onClick={addVietnamCities} variant="outline" className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Vietnam Cities
          </Button>
          <Button onClick={clearAllLocations} variant="outline" className="flex items-center gap-2">
            <RotateCcw className="w-4 h-4" />
            Clear All
          </Button>
          <div className="flex items-center gap-2">
            <Label>Map View:</Label>
            <Select value={mapView} onValueChange={(value: 'enhanced' | 'vietnam') => setMapView(value)}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="enhanced">Enhanced Map</SelectItem>
                <SelectItem value="vietnam">Vietnam Map</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="enhanced-map" className="flex items-center gap-2">
              <Map className="w-4 h-4" />
              Enhanced Map
            </TabsTrigger>
            <TabsTrigger value="vietnam-map" className="flex items-center gap-2">
              <Globe className="w-4 h-4" />
              Vietnam Map
            </TabsTrigger>
            <TabsTrigger value="truck-specs" className="flex items-center gap-2">
              <Truck className="w-4 h-4" />
              Truck Specs
            </TabsTrigger>
            <TabsTrigger value="results" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Results
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Enhanced Map Tab */}
          <TabsContent value="enhanced-map" className="space-y-4">
            {hasApiKey ? (
              <EnhancedTruckMap
                orsApiKey={orsApiKey}
                onRouteOptimized={handleRouteOptimized}
                truckSpecs={state.truckSpecs}
                initialLocations={state.locations}
                className="h-[700px]"
              />
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <AlertTriangle className="w-16 h-16 text-orange-400 mb-4" />
                  <h3 className="text-xl font-medium text-gray-900 mb-2">
                    Enhanced Map Requires API Key
                  </h3>
                  <p className="text-gray-600 text-center max-w-md mb-4">
                    Configure your OpenRouteService API key to access enhanced mapping features.
                  </p>
                  <Button 
                    onClick={() => window.open('https://openrouteservice.org/', '_blank')}
                    className="flex items-center gap-2"
                  >
                    <Globe className="w-4 h-4" />
                    Get Free API Key
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Truck Specifications Tab */}
          <TabsContent value="truck-specs" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Truck className="w-5 h-5" />
                    Vehicle Specifications
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Weight (tons)</Label>
                      <Input
                        type="number"
                        value={state.truckSpecs.weight}
                        onChange={(e) => updateTruckSpecs('weight', parseFloat(e.target.value))}
                        min="1"
                        max="100"
                        step="0.5"
                      />
                    </div>
                    <div>
                      <Label>Height (meters)</Label>
                      <Input
                        type="number"
                        value={state.truckSpecs.height}
                        onChange={(e) => updateTruckSpecs('height', parseFloat(e.target.value))}
                        min="1"
                        max="6"
                        step="0.1"
                      />
                    </div>
                    <div>
                      <Label>Width (meters)</Label>
                      <Input
                        type="number"
                        value={state.truckSpecs.width}
                        onChange={(e) => updateTruckSpecs('width', parseFloat(e.target.value))}
                        min="1"
                        max="4"
                        step="0.1"
                      />
                    </div>
                    <div>
                      <Label>Length (meters)</Label>
                      <Input
                        type="number"
                        value={state.truckSpecs.length}
                        onChange={(e) => updateTruckSpecs('length', parseFloat(e.target.value))}
                        min="5"
                        max="25"
                        step="0.5"
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Vehicle Type</Label>
                    <Select
                      value={state.truckSpecs.type}
                      onValueChange={(value: TruckSpecs['type']) => updateTruckSpecs('type', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="container">Container Truck</SelectItem>
                        <SelectItem value="flatbed">Flatbed Truck</SelectItem>
                        <SelectItem value="tanker">Tanker Truck</SelectItem>
                        <SelectItem value="refrigerated">Refrigerated Truck</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <Label>Hazardous Materials</Label>
                    <Switch
                      checked={state.truckSpecs.hazardousMaterials}
                      onCheckedChange={(checked) => updateTruckSpecs('hazardousMaterials', checked)}
                    />
                  </div>

                  <div>
                    <Label>Number of Axles</Label>
                    <Input
                      type="number"
                      value={state.truckSpecs.axles}
                      onChange={(e) => updateTruckSpecs('axles', parseInt(e.target.value))}
                      min="2"
                      max="8"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    Route Preferences
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Optimization Goal</Label>
                    <Select
                      value={state.routeOptions.preference}
                      onValueChange={(value: RouteOptions['preference']) => 
                        updateRouteOptions('preference', value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fastest">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            Fastest Route
                          </div>
                        </SelectItem>
                        <SelectItem value="shortest">
                          <div className="flex items-center gap-2">
                            <Navigation className="w-4 h-4" />
                            Shortest Distance
                          </div>
                        </SelectItem>
                        <SelectItem value="eco">
                          <div className="flex items-center gap-2">
                            <Leaf className="w-4 h-4" />
                            Eco-Friendly
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label>Avoid Toll Roads</Label>
                      <Switch
                        checked={state.routeOptions.avoidTolls}
                        onCheckedChange={(checked) => updateRouteOptions('avoidTolls', checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Avoid Ferries</Label>
                      <Switch
                        checked={state.routeOptions.avoidFerries}
                        onCheckedChange={(checked) => updateRouteOptions('avoidFerries', checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Avoid Highways</Label>
                      <Switch
                        checked={state.routeOptions.avoidHighways}
                        onCheckedChange={(checked) => updateRouteOptions('avoidHighways', checked)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Results Tab */}
          <TabsContent value="results" className="space-y-4">
            {state.results.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Navigation className="w-12 h-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Routes Optimized Yet</h3>
                  <p className="text-gray-600 text-center mb-4">
                    Use the Enhanced Map or Vietnam Map tabs to add locations and optimize routes.
                  </p>
                  <div className="flex gap-2">
                    <Button onClick={() => setActiveTab('enhanced-map')}>
                      Enhanced Map
                    </Button>
                    <Button onClick={() => setActiveTab('vietnam-map')} variant="outline">
                      Vietnam Map
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {state.results.map((route, index) => (
                  <Card 
                    key={route.id} 
                    className={`cursor-pointer transition-colors ${
                      state.selectedRoute?.id === route.id ? 'ring-2 ring-blue-500' : ''
                    }`}
                    onClick={() => setState(prev => ({ ...prev, selectedRoute: route }))}
                  >
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                          <Navigation className="w-5 h-5" />
                          Route {index + 1}
                          {index === 0 && <Badge>Latest</Badge>}
                        </CardTitle>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">
                            {route.locations.length} stops
                          </Badge>
                          <Button
                            onClick={(e) => {
                              e.stopPropagation();
                              // Export functionality can be added here
                            }}
                            variant="outline"
                            size="sm"
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <div className="text-gray-500">Distance</div>
                          <div className="font-medium">
                            {(route.totalDistance / 1000).toFixed(1)} km
                          </div>
                        </div>
                        <div>
                          <div className="text-gray-500">Duration</div>
                          <div className="font-medium">
                            {Math.round(route.totalDuration / 60)} min
                          </div>
                        </div>
                        <div>
                          <div className="text-gray-500">Cost</div>
                          <div className="font-medium">
                            {route.totalCost.toLocaleString('vi-VN')} VND
                          </div>
                        </div>
                        <div>
                          <div className="text-gray-500">Fuel</div>
                          <div className="font-medium">
                            {route.fuelConsumption.toFixed(1)} L
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-4">
                        <div className="text-sm text-gray-500 mb-2">Route</div>
                        <div className="flex flex-wrap gap-1">
                          {route.locations.map((location, locIndex) => (
                            <Badge key={location.id} variant="outline" className="text-xs">
                              {locIndex + 1}. {location.name}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-4">
            {state.selectedRoute ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Cost Breakdown */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <DollarSign className="w-5 h-5" />
                      Cost Breakdown
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={costBreakdownData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={100}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {costBreakdownData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip 
                            formatter={(value: number) => [
                              `${value.toLocaleString('vi-VN')} VND`, 
                              'Cost'
                            ]}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="space-y-2 mt-4">
                      {costBreakdownData.map((item, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-3 h-3 rounded-full" 
                              style={{ backgroundColor: item.color }}
                            />
                            <span className="text-sm">{item.name}</span>
                          </div>
                          <span className="text-sm font-medium">
                            {item.value.toLocaleString('vi-VN')} VND
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Environmental Impact */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Leaf className="w-5 h-5" />
                      Environmental Impact
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span>CO2 Emissions</span>
                        <span className="font-medium">
                          {state.selectedRoute.co2Emissions.toFixed(1)} kg
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Fuel Consumption</span>
                        <span className="font-medium">
                          {state.selectedRoute.fuelConsumption.toFixed(1)} L
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Efficiency</span>
                        <span className="font-medium">
                          {(state.selectedRoute.fuelConsumption / (state.selectedRoute.totalDistance / 1000) * 100).toFixed(1)} L/100km
                        </span>
                      </div>
                      
                      {/* Environmental Score */}
                      <div className="mt-4">
                        <div className="flex justify-between items-center mb-2">
                          <span>Environmental Score</span>
                          <span className="font-medium">B+</span>
                        </div>
                        <Progress value={75} className="h-2" />
                        <p className="text-xs text-gray-500 mt-1">
                          Better than 75% of similar routes
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Route Warnings */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5" />
                      Route Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {state.selectedRoute.truckRestrictions.length > 0 ? (
                        state.selectedRoute.truckRestrictions.map((restriction, index) => (
                          <Alert key={index}>
                            <AlertTriangle className="h-4 w-4" />
                            <AlertDescription>{restriction}</AlertDescription>
                          </Alert>
                        ))
                      ) : (
                        <div className="flex items-center gap-2 text-green-600">
                          <CheckCircle className="w-4 h-4" />
                          <span>No restrictions found</span>
                        </div>
                      )}
                      
                      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                        <h4 className="font-medium text-blue-900 mb-2">Route Insights</h4>
                        <ul className="text-sm text-blue-800 space-y-1">
                          <li>• Optimal for {state.truckSpecs.type} trucks</li>
                          <li>• {state.routeOptions.avoidTolls ? 'Toll-free' : 'Includes toll roads'}</li>
                          <li>• Estimated delivery time: {Math.round(state.selectedRoute.totalDuration / 3600)}h {Math.round((state.selectedRoute.totalDuration % 3600) / 60)}m</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Performance Comparison */}
                {state.results.length > 1 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BarChart3 className="w-5 h-5" />
                        Route Comparison
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={performanceData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="distance" fill="#0088FE" name="Distance (km)" />
                            <Bar dataKey="cost" fill="#00C49F" name="Cost (k VND)" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Activity className="w-12 h-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Route Selected</h3>
                  <p className="text-gray-600 text-center">
                    Select a route from the Results tab to view detailed analytics.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    Application Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Show Advanced Options</Label>
                    <Switch
                      checked={showAdvancedOptions}
                      onCheckedChange={setShowAdvancedOptions}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label>Auto-save Routes</Label>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label>Real-time Updates</Label>
                    <Switch defaultChecked />
                  </div>
                  
                  <div>
                    <Label>Default Map Provider</Label>
                    <Select defaultValue="osm">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="osm">OpenStreetMap</SelectItem>
                        <SelectItem value="satellite">Satellite</SelectItem>
                        <SelectItem value="terrain">Terrain</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="w-5 h-5" />
                    API Configuration
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>OpenRouteService API Key</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Input 
                        type="password" 
                        value={hasApiKey ? '••••••••••••••••' : ''} 
                        placeholder="Enter your ORS API key"
                        readOnly
                      />
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => window.open('https://openrouteservice.org/', '_blank')}
                      >
                        Get Key
                      </Button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {hasApiKey ? 'API key configured' : 'Configure in .env.local file'}
                    </p>
                  </div>

                  <div className="p-3 bg-gray-50 rounded-lg">
                    <h4 className="font-medium mb-2">API Status</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>OpenRouteService:</span>
                        <Badge variant={hasApiKey ? "default" : "secondary"}>
                          {hasApiKey ? 'Connected' : 'Not configured'}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>OpenStreetMap:</span>
                        <Badge variant="default">Available</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ComprehensiveRouteOptimizer;
