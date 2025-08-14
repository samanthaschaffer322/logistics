'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  MapPin, 
  Truck, 
  Route, 
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
  Activity
} from 'lucide-react';

import UnifiedRouteOptimizer, {
  UnifiedOptimizationConfig,
  UnifiedOptimizationRequest,
  UnifiedOptimizationResult,
  Location,
  Vehicle
} from '@/lib/unified-route-optimizer';

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

import { useLanguage } from '@/contexts/LanguageContext';

const EnhancedRouteOptimizer: React.FC<EnhancedRouteOptimizerProps> = ({
  className,
  onOptimizationComplete,
  onError
}) => {
  const { t } = useLanguage();
  // State management
  const [locations, setLocations] = useState<Location[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [optimizationState, setOptimizationState] = useState<OptimizationState>({
    isOptimizing: false,
    progress: 0,
    currentStep: t('common.ready')
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
            name: 'Main Depot',
            address: 'Depot Address',
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
            name: 'Secondary Depot',
            address: 'Secondary Depot Address',
            lat: 10.7769,
            lng: 106.7009,
            priority: 10
          },
          availableFrom: '07:00',
          availableTo: '19:00'
        }
      ]);
    }
  }, []);

  // Optimization function
  const runOptimization = useCallback(async () => {
    if (!optimizer || locations.length === 0 || vehicles.length === 0) {
      const error = t('route.addLocationsVehiclesPrompt');
      setOptimizationState(prev => ({ ...prev, error }));
      onError?.(error);
      return;
    }

    setOptimizationState({
      isOptimizing: true,
      progress: 0,
      currentStep: t('route.initializingOptimization'),
      error: undefined
    });

    try {
      // Simulate progress updates
      const progressSteps = [
        { progress: 10, step: 'Validating input data...' },
        { progress: 25, step: 'Calculating distance matrix...' },
        { progress: 40, step: 'Running genetic algorithm...' },
        { progress: 60, step: 'Applying simulated annealing...' },
        { progress: 75, step: 'Optimizing with AI insights...' },
        { progress: 90, step: 'Generating final routes...' },
        { progress: 100, step: 'Optimization complete!' }
      ];

      for (const { progress, step } of progressSteps) {
        setOptimizationState(prev => ({
          ...prev,
          progress,
          currentStep: step
        }));
        await new Promise(resolve => setTimeout(resolve, 500));
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
        currentStep: t('common.complete'),
        result
      });

      onOptimizationComplete?.(result);

    } catch (error) {
                const errorMessage = `${t('route.optimizationFailed')}${error.message}`;
      setOptimizationState({
        isOptimizing: false,
        progress: 0,
        currentStep: t('common.error'),
        error: errorMessage
      });
      onError?.(errorMessage);
    }
  }, [optimizer, locations, vehicles, onOptimizationComplete, onError]);

  // Add location
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

  // Remove location
  const removeLocation = useCallback((id: string) => {
    setLocations(prev => prev.filter(loc => loc.id !== id));
  }, []);

  // Update location
  const updateLocation = useCallback((id: string, updates: Partial<Location>) => {
    setLocations(prev => prev.map(loc => 
      loc.id === id ? { ...loc, ...updates } : loc
    ));
  }, []);

  // Add vehicle
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

  // Remove vehicle
  const removeVehicle = useCallback((id: string) => {
    setVehicles(prev => prev.filter(vehicle => vehicle.id !== id));
  }, []);

  // Update vehicle
  const updateVehicle = useCallback((id: string, updates: Partial<Vehicle>) => {
    setVehicles(prev => prev.map(vehicle => 
      vehicle.id === id ? { ...vehicle, ...updates } : vehicle
    ));
  }, []);

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-6 w-6 text-blue-600" />
            {t('route.enhancedTitle')}
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
                  {t('route.optimizing')}
                </>
              ) : (
                <>
                  <Play className="h-4 w-4" />
                  {t('route.optimize')}
                </>
              )}
            </Button>

            <Button variant="outline" onClick={() => setOptimizationState(prev => ({ ...prev, result: undefined, error: undefined }))}>
              <RotateCcw className="h-4 w-4 mr-2" />
              {t('common.reset')}
            </Button>

            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPin className="h-4 w-4" />
              {locations.length} {t('common.locations')}
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Truck className="h-4 w-4" />
              {vehicles.length} {t('common.vehicles')}
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
          <TabsTrigger value="locations">{t('route.locations')}</TabsTrigger>
          <TabsTrigger value="vehicles">{t('route.vehicles')}</TabsTrigger>
          <TabsTrigger value="settings">{t('route.settings')}</TabsTrigger>
          <TabsTrigger value="results">{t('route.results')}</TabsTrigger>
          <TabsTrigger value="insights">{t('route.insights')}</TabsTrigger>
        </TabsList>

        {/* Locations Tab */}
        <TabsContent value="locations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  {t('route.deliveryLocations')}
                </span>
                <Button onClick={addLocation} size="sm">
                  {t('route.addLocation')}
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {locations.map((location) => (
                  <Card key={location.id} className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor={`name-${location.id}`}>{t('common.name')}</Label>
                        <Input
                          id={`name-${location.id}`}
                          value={location.name}
                          onChange={(e) => updateLocation(location.id, { name: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor={`address-${location.id}`}>{t('common.address')}</Label>
                        <Input
                          id={`address-${location.id}`}
                          value={location.address}
                          onChange={(e) => updateLocation(location.id, { address: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor={`priority-${location.id}`}>{t('common.priority')}</Label>
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
                        <Label htmlFor={`lat-${location.id}`}>{t('common.latitude')}</Label>
                        <Input
                          id={`lat-${location.id}`}
                          type="number"
                          step="0.000001"
                          value={location.lat}
                          onChange={(e) => updateLocation(location.id, { lat: parseFloat(e.target.value) })}
                        />
                      </div>
                      <div>
                        <Label htmlFor={`lng-${location.id}`}>{t('common.longitude')}</Label>
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
                          {t('common.remove')}
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}

                {locations.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    {t('route.noLocationsAdded')}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Continue with other tabs... */}
      </Tabs>
    </div>
  );
};

export default EnhancedRouteOptimizer;
