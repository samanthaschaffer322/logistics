'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  MapPin, 
  Truck, 
  Brain, 
  Play,
  Pause,
  RotateCcw,
  AlertTriangle
} from 'lucide-react';

import UnifiedRouteOptimizer, {
  UnifiedOptimizationConfig,
  UnifiedOptimizationRequest,
  UnifiedOptimizationResult,
  Location,
  Vehicle
} from '@/lib/unified-route-optimizer';

import {
  VehiclesTab,
  SettingsTab,
  ResultsTab,
  InsightsTab
} from './EnhancedRouteOptimizerTabs';

interface EnhancedRouteOptimizerProps {
  className?: string;
  onOptimizationComplete?: (result: UnifiedOptimizationResult) => void;
  onError?: (error: string) => void;
}

interface OptimizationState {
  isOptimizing: boolean;
  progress: number;
  currentStep: string;
  result?: UnifiedOptimizationResult;
  error?: string;
}

const EnhancedRouteOptimizerComplete: React.FC<EnhancedRouteOptimizerProps> = ({
  className,
  onOptimizationComplete,
  onError
}) => {
  // State management
  const [locations, setLocations] = useState<Location[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [optimizationState, setOptimizationState] = useState<OptimizationState>({
    isOptimizing: false,
    progress: 0,
    currentStep: 'Ready'
  });
  
  const [config, setConfig] = useState<UnifiedOptimizationConfig>({
    preferences: {
      primaryAlgorithm: 'hybrid',
      fallbackAlgorithms: ['enhanced', 'aws'],
      realTimeTracking: true,
      aiInsights: true,
      cloudSync: true,
      cacheResults: true,
      maxComputeTime: 300,
      qualityThreshold: 85
    }
  });

  const [optimizer, setOptimizer] = useState<UnifiedRouteOptimizer | null>(null);
  const [activeTab, setActiveTab] = useState('locations');

  // Initialize optimizer
  useEffect(() => {
    try {
      const optimizerInstance = new UnifiedRouteOptimizer(config);
      setOptimizer(optimizerInstance);
    } catch (error) {
      console.error('Failed to initialize optimizer:', error);
      setOptimizationState(prev => ({
        ...prev,
        error: `Failed to initialize optimizer: ${error.message}`
      }));
    }
  }, [config]);

  // Add sample data for testing
  useEffect(() => {
    if (locations.length === 0) {
      setLocations([
        {
          id: 'loc1',
          name: 'Hà Nội Central',
          address: '1 Đinh Tiên Hoàng, Hoàn Kiếm, Hà Nội',
          lat: 21.0285,
          lng: 105.8542,
          priority: 9,
          timeWindow: { start: '08:00', end: '18:00' },
          serviceTime: 30,
          demand: 100
        },
        {
          id: 'loc2',
          name: 'Hồ Chí Minh City Hub',
          address: '1 Nguyễn Huệ, Quận 1, TP.HCM',
          lat: 10.7769,
          lng: 106.7009,
          priority: 8,
          timeWindow: { start: '09:00', end: '17:00' },
          serviceTime: 45,
          demand: 150
        },
        {
          id: 'loc3',
          name: 'Đà Nẵng Distribution',
          address: 'Cầu Rồng, Hải Châu, Đà Nẵng',
          lat: 16.0544,
          lng: 108.2022,
          priority: 7,
          timeWindow: { start: '08:30', end: '17:30' },
          serviceTime: 25,
          demand: 80
        },
        {
          id: 'loc4',
          name: 'Cần Thơ Warehouse',
          address: 'Ninh Kiều, Cần Thơ',
          lat: 10.0452,
          lng: 105.7469,
          priority: 6,
          timeWindow: { start: '08:00', end: '17:00' },
          serviceTime: 35,
          demand: 120
        },
        {
          id: 'loc5',
          name: 'Hải Phòng Port',
          address: 'Hồng Bàng, Hải Phòng',
          lat: 20.8449,
          lng: 106.6881,
          priority: 8,
          timeWindow: { start: '07:00', end: '16:00' },
          serviceTime: 40,
          demand: 200
        }
      ]);
    }

    if (vehicles.length === 0) {
      setVehicles([
        {
          id: 'vehicle1',
          name: 'Truck Alpha',
          capacity: 1000,
          maxDistance: 500,
          costPerKm: 2.5,
          startLocation: {
            id: 'depot1',
            name: 'Main Depot Hà Nội',
            address: 'Long Biên, Hà Nội',
            lat: 21.0285,
            lng: 105.8542,
            priority: 10
          },
          availableFrom: '06:00',
          availableTo: '20:00'
        },
        {
          id: 'vehicle2',
          name: 'Van Beta',
          capacity: 500,
          maxDistance: 300,
          costPerKm: 1.8,
          startLocation: {
            id: 'depot2',
            name: 'Southern Depot TP.HCM',
            address: 'Quận 7, TP.HCM',
            lat: 10.7769,
            lng: 106.7009,
            priority: 10
          },
          availableFrom: '07:00',
          availableTo: '19:00'
        },
        {
          id: 'vehicle3',
          name: 'Truck Gamma',
          capacity: 800,
          maxDistance: 400,
          costPerKm: 2.2,
          startLocation: {
            id: 'depot3',
            name: 'Central Depot Đà Nẵng',
            address: 'Hải Châu, Đà Nẵng',
            lat: 16.0544,
            lng: 108.2022,
            priority: 10
          },
          availableFrom: '06:30',
          availableTo: '19:30'
        }
      ]);
    }
  }, []);

  // Optimization function
  const runOptimization = useCallback(async () => {
    if (!optimizer || locations.length === 0 || vehicles.length === 0) {
      const error = 'Please add locations and vehicles before optimizing';
      setOptimizationState(prev => ({ ...prev, error }));
      onError?.(error);
      return;
    }

    setOptimizationState({
      isOptimizing: true,
      progress: 0,
      currentStep: 'Initializing optimization...',
      error: undefined
    });

    try {
      // Simulate progress updates
      const progressSteps = [
        { progress: 10, step: 'Validating input data...' },
        { progress: 20, step: 'Geocoding addresses...' },
        { progress: 30, step: 'Calculating distance matrix...' },
        { progress: 45, step: 'Running genetic algorithm...' },
        { progress: 60, step: 'Applying simulated annealing...' },
        { progress: 75, step: 'Optimizing with AI insights...' },
        { progress: 85, step: 'Generating route geometries...' },
        { progress: 95, step: 'Finalizing results...' },
        { progress: 100, step: 'Optimization complete!' }
      ];

      for (const { progress, step } of progressSteps) {
        setOptimizationState(prev => ({
          ...prev,
          progress,
          currentStep: step
        }));
        await new Promise(resolve => setTimeout(resolve, 800));
      }

      const request: UnifiedOptimizationRequest = {
        locations,
        vehicles,
        constraints: {
          maxRouteTime: 480, // 8 hours
          maxRouteDistance: 500, // 500 km
          timeWindows: true,
          vehicleCapacities: true,
          driverWorkingHours: true
        },
        objectives: {
          minimizeDistance: 0.3,
          minimizeTime: 0.3,
          minimizeCost: 0.2,
          maximizeEfficiency: 0.2
        },
        options: {
          useRealTimeTraffic: true,
          considerWeather: true,
          prioritizeCustomerSatisfaction: true,
          balanceWorkload: true
        }
      };

      const result = await optimizer.optimizeRoutes(request);

      setOptimizationState({
        isOptimizing: false,
        progress: 100,
        currentStep: 'Complete',
        result
      });

      onOptimizationComplete?.(result);
      setActiveTab('results'); // Switch to results tab

    } catch (error) {
      const errorMessage = `Optimization failed: ${error.message}`;
      setOptimizationState({
        isOptimizing: false,
        progress: 0,
        currentStep: 'Error',
        error: errorMessage
      });
      onError?.(errorMessage);
    }
  }, [optimizer, locations, vehicles, onOptimizationComplete, onError]);

  // Location management functions
  const addLocation = useCallback(() => {
    const newLocation: Location = {
      id: `loc${locations.length + 1}`,
      name: `Location ${locations.length + 1}`,
      address: '',
      lat: 21.0285 + (Math.random() - 0.5) * 0.1,
      lng: 105.8542 + (Math.random() - 0.5) * 0.1,
      priority: 5,
      timeWindow: { start: '08:00', end: '18:00' },
      serviceTime: 30,
      demand: 100
    };
    setLocations(prev => [...prev, newLocation]);
  }, [locations.length]);

  const removeLocation = useCallback((id: string) => {
    setLocations(prev => prev.filter(loc => loc.id !== id));
  }, []);

  const updateLocation = useCallback((id: string, updates: Partial<Location>) => {
    setLocations(prev => prev.map(loc => 
      loc.id === id ? { ...loc, ...updates } : loc
    ));
  }, []);

  // Vehicle management functions
  const addVehicle = useCallback(() => {
    const newVehicle: Vehicle = {
      id: `vehicle${vehicles.length + 1}`,
      name: `Vehicle ${vehicles.length + 1}`,
      capacity: 500,
      maxDistance: 300,
      costPerKm: 2.0,
      startLocation: {
        id: 'depot',
        name: 'Depot',
        address: 'Depot Address',
        lat: 21.0285,
        lng: 105.8542,
        priority: 10
      },
      availableFrom: '08:00',
      availableTo: '18:00'
    };
    setVehicles(prev => [...prev, newVehicle]);
  }, [vehicles.length]);

  const removeVehicle = useCallback((id: string) => {
    setVehicles(prev => prev.filter(vehicle => vehicle.id !== id));
  }, []);

  const updateVehicle = useCallback((id: string, updates: Partial<Vehicle>) => {
    setVehicles(prev => prev.map(vehicle => 
      vehicle.id === id ? { ...vehicle, ...updates } : vehicle
    ));
  }, []);

  const updateConfig = useCallback((updates: Partial<UnifiedOptimizationConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }));
  }, []);

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-6 w-6 text-blue-600" />
            Enhanced AI Route Optimizer
            <Badge variant="secondary" className="ml-2">
              {config.preferences.primaryAlgorithm.toUpperCase()}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 items-center">
            <Button 
              onClick={runOptimization}
              disabled={optimizationState.isOptimizing || locations.length === 0 || vehicles.length === 0}
              className="flex items-center gap-2"
            >
              {optimizationState.isOptimizing ? (
                <>
                  <Pause className="h-4 w-4" />
                  Optimizing...
                </>
              ) : (
                <>
                  <Play className="h-4 w-4" />
                  Optimize Routes
                </>
              )}
            </Button>
            
            <Button 
              variant="outline" 
              onClick={() => setOptimizationState(prev => ({ 
                ...prev, 
                result: undefined, 
                error: undefined 
              }))}
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
            
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPin className="h-4 w-4" />
              {locations.length} locations
            </div>
            
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Truck className="h-4 w-4" />
              {vehicles.length} vehicles
            </div>
          </div>
          
          {optimizationState.isOptimizing && (
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span>{optimizationState.currentStep}</span>
                <span>{optimizationState.progress}%</span>
              </div>
              <Progress value={optimizationState.progress} className="w-full" />
            </div>
          )}
          
          {optimizationState.error && (
            <Alert className="mt-4" variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{optimizationState.error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="locations">Locations</TabsTrigger>
          <TabsTrigger value="vehicles">Vehicles</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="results">Results</TabsTrigger>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
        </TabsList>

        {/* Locations Tab */}
        <TabsContent value="locations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Delivery Locations
                </span>
                <Button onClick={addLocation} size="sm">
                  Add Location
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {locations.map((location) => (
                  <Card key={location.id} className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor={`name-${location.id}`}>Name</Label>
                        <Input
                          id={`name-${location.id}`}
                          value={location.name}
                          onChange={(e) => updateLocation(location.id, { name: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor={`address-${location.id}`}>Address</Label>
                        <Input
                          id={`address-${location.id}`}
                          value={location.address}
                          onChange={(e) => updateLocation(location.id, { address: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor={`priority-${location.id}`}>Priority (1-10)</Label>
                        <Input
                          id={`priority-${location.id}`}
                          type="number"
                          min="1"
                          max="10"
                          value={location.priority}
                          onChange={(e) => updateLocation(location.id, { priority: parseInt(e.target.value) })}
                        />
                      </div>
                      <div>
                        <Label htmlFor={`lat-${location.id}`}>Latitude</Label>
                        <Input
                          id={`lat-${location.id}`}
                          type="number"
                          step="0.000001"
                          value={location.lat}
                          onChange={(e) => updateLocation(location.id, { lat: parseFloat(e.target.value) })}
                        />
                      </div>
                      <div>
                        <Label htmlFor={`lng-${location.id}`}>Longitude</Label>
                        <Input
                          id={`lng-${location.id}`}
                          type="number"
                          step="0.000001"
                          value={location.lng}
                          onChange={(e) => updateLocation(location.id, { lng: parseFloat(e.target.value) })}
                        />
                      </div>
                      <div className="flex items-end">
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => removeLocation(location.id)}
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
                
                {locations.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No locations added yet. Click "Add Location" to get started.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Other Tabs */}
        <VehiclesTab
          vehicles={vehicles}
          onUpdateVehicle={updateVehicle}
          onRemoveVehicle={removeVehicle}
          onAddVehicle={addVehicle}
        />

        <SettingsTab
          config={config}
          onUpdateConfig={updateConfig}
        />

        <ResultsTab
          result={optimizationState.result}
        />

        <InsightsTab
          result={optimizationState.result}
        />
      </Tabs>
    </div>
  );
};

export default EnhancedRouteOptimizerComplete;
