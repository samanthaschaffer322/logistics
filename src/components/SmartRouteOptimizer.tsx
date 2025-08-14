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
  Target
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
          <p className="text-gray-600">Loading Interactive Map...</p>
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

interface SmartRouteOptimizerProps {
  className?: string;
  orsApiKey: string;
  onOptimizationComplete?: (result: OptimizedRoute) => void;
  onError?: (error: string) => void;
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

const SmartRouteOptimizer: React.FC<SmartRouteOptimizerProps> = ({
  className = '',
  orsApiKey,
  onOptimizationComplete,
  onError
}) => {
  const [state, setState] = useState<OptimizationState>({
    isOptimizing: false,
    progress: 0,
    currentStep: '',
    results: [],
    selectedRoute: null,
    locations: [],
    truckSpecs: {
      weight: 25, // tons
      height: 4.2, // meters
      width: 2.5, // meters
      length: 16.5, // meters
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

  const [activeTab, setActiveTab] = useState('map');
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);

  // Handle route optimization from map
  const handleRouteOptimized = useCallback((route: OptimizedRoute) => {
    setState(prev => ({
      ...prev,
      results: [route, ...prev.results.slice(0, 4)], // Keep last 5 results
      selectedRoute: route
    }));
    onOptimizationComplete?.(route);
  }, [onOptimizationComplete]);

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

  // Export route data
  const exportRouteData = useCallback((format: 'json' | 'csv' | 'excel') => {
    if (!state.selectedRoute) return;

    const data = {
      route: state.selectedRoute,
      truckSpecs: state.truckSpecs,
      routeOptions: state.routeOptions,
      exportedAt: new Date().toISOString()
    };

    let content: string;
    let mimeType: string;
    let extension: string;

    switch (format) {
      case 'json':
        content = JSON.stringify(data, null, 2);
        mimeType = 'application/json';
        extension = 'json';
        break;
      case 'csv':
        const csvRows = [
          'Location,Latitude,Longitude,Type,Address',
          ...state.selectedRoute.locations.map(loc => 
            `"${loc.name}",${loc.lat},${loc.lng},"${loc.type}","${loc.address || ''}"`
          )
        ];
        content = csvRows.join('\n');
        mimeType = 'text/csv';
        extension = 'csv';
        break;
      default:
        return;
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `route-optimization-${Date.now()}.${extension}`;
    a.click();
    URL.revokeObjectURL(url);
  }, [state.selectedRoute, state.truckSpecs, state.routeOptions]);

  return (
    <div className={`smart-route-optimizer ${className}`}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Smart Route Optimizer</h2>
            <p className="text-gray-600">AI-powered route optimization for Vietnamese truck logistics</p>
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
          </div>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="map" className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Interactive Map
            </TabsTrigger>
            <TabsTrigger value="specs" className="flex items-center gap-2">
              <Truck className="w-4 h-4" />
              Truck Specs
            </TabsTrigger>
            <TabsTrigger value="results" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Results
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <Activity className="w-4 h-4" />
              Analytics
            </TabsTrigger>
          </TabsList>

          {/* Interactive Map Tab */}
          <TabsContent value="map" className="space-y-4">
            <EnhancedTruckMap
              orsApiKey={orsApiKey}
              onRouteOptimized={handleRouteOptimized}
              truckSpecs={state.truckSpecs}
              className="h-[600px]"
            />
          </TabsContent>

          {/* Truck Specifications Tab */}
          <TabsContent value="specs" className="space-y-4">
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

                  <Button
                    onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
                    variant="outline"
                    className="w-full"
                  >
                    {showAdvancedOptions ? 'Hide' : 'Show'} Advanced Options
                  </Button>

                  {showAdvancedOptions && (
                    <div className="space-y-3 pt-3 border-t">
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
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Results Tab */}
          <TabsContent value="results" className="space-y-4">
            {state.results.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <RouteIcon className="w-12 h-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Routes Optimized Yet</h3>
                  <p className="text-gray-600 text-center mb-4">
                    Use the Interactive Map tab to add locations and optimize your first route.
                  </p>
                  <Button onClick={() => setActiveTab('map')}>
                    Go to Map
                  </Button>
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
                          <RouteIcon className="w-5 h-5" />
                          Route {index + 1}
                          {index === 0 && <Badge>Latest</Badge>}
                        </CardTitle>
                        <div className="flex items-center gap-2">
                          <Button
                            onClick={(e) => {
                              e.stopPropagation();
                              exportRouteData('json');
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
                        <div className="text-sm text-gray-500 mb-2">Locations ({route.locations.length})</div>
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <DollarSign className="w-5 h-5" />
                      Cost Breakdown
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>Fuel Cost</span>
                        <span>{(state.selectedRoute.totalCost * 0.6).toLocaleString('vi-VN')} VND</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Driver Cost</span>
                        <span>{(state.selectedRoute.totalCost * 0.3).toLocaleString('vi-VN')} VND</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Maintenance</span>
                        <span>{(state.selectedRoute.totalCost * 0.1).toLocaleString('vi-VN')} VND</span>
                      </div>
                      <div className="border-t pt-2 flex justify-between font-medium">
                        <span>Total</span>
                        <span>{state.selectedRoute.totalCost.toLocaleString('vi-VN')} VND</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Leaf className="w-5 h-5" />
                      Environmental Impact
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>CO2 Emissions</span>
                        <span>{state.selectedRoute.co2Emissions.toFixed(1)} kg</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Fuel Consumption</span>
                        <span>{state.selectedRoute.fuelConsumption.toFixed(1)} L</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Efficiency</span>
                        <span>
                          {(state.selectedRoute.fuelConsumption / (state.selectedRoute.totalDistance / 1000) * 100).toFixed(1)} L/100km
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5" />
                      Route Warnings
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
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
                    </div>
                  </CardContent>
                </Card>
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
        </Tabs>
      </div>
    </div>
  );
};

export default SmartRouteOptimizer;
