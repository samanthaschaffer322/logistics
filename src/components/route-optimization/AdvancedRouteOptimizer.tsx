'use client';

import React, { useState, useEffect, useCallback } from 'react';
import SimpleMap from './SimpleMap';
import { 
  AdvancedRouteOptimizer, 
  Location, 
  Vehicle, 
  OptimizationResult,
  RouteOptimizationRequest 
} from '@/lib/route-optimization/advanced-optimizer';
import { LogisticsAI, PredictionResult } from '@/lib/ai-learning/logistics-ai';
import { getRealTimeOptimizationService, RealTimeUpdate } from '@/lib/services/real-time-optimizer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui-components';
import { Button } from '@/components/ui-components';
import { Input } from '@/components/ui-components';
import { Label } from '@/components/ui-components';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui-components';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui-components';
import { Badge } from '@/components/ui-components';
import { Progress } from '@/components/ui-components';
import { Alert, AlertDescription } from '@/components/ui-components';
import { 
  Truck, 
  MapPin, 
  Clock, 
  DollarSign, 
  Route, 
  Zap, 
  Brain, 
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Users,
  Fuel,
  Navigation
} from 'lucide-react';

interface AdvancedRouteOptimizerProps {
  onOptimizationComplete?: (result: OptimizationResult) => void;
  onAIPrediction?: (prediction: PredictionResult) => void;
}

export default function AdvancedRouteOptimizerComponent({ 
  onOptimizationComplete, 
  onAIPrediction 
}: AdvancedRouteOptimizerProps) {
  const [optimizer] = useState(() => new AdvancedRouteOptimizer());
  const [logisticsAI] = useState(() => new LogisticsAI(process.env.NEXT_PUBLIC_OPENAI_API_KEY || ''));
  const [realTimeService] = useState(() => getRealTimeOptimizationService());
  
  const [locations, setLocations] = useState<Location[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [optimizationResult, setOptimizationResult] = useState<OptimizationResult | null>(null);
  const [aiPrediction, setAIPrediction] = useState<PredictionResult | null>(null);
  const [realTimeUpdates, setRealTimeUpdates] = useState<RealTimeUpdate[]>([]);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [isLearning, setIsLearning] = useState(false);
  const [learningProgress, setLearningProgress] = useState(0);
  const [selectedRoute, setSelectedRoute] = useState<number>(0);
  const [mapCenter, setMapCenter] = useState<[number, number]>([10.8231, 106.6297]); // Ho Chi Minh City
  const [mapZoom, setMapZoom] = useState(10);
  const [serviceStatus, setServiceStatus] = useState(realTimeService.getStatus());

  // Sample data for Vietnam logistics
  const sampleLocations: Location[] = [
    {
      id: 'depot-1',
      lat: 10.8231,
      lng: 106.6297,
      address: 'Cảng Sài Gòn, TP.HCM',
      type: 'depot',
      timeWindow: { start: '06:00', end: '18:00' },
      serviceTime: 30
    },
    {
      id: 'pickup-1',
      lat: 10.7769,
      lng: 106.7009,
      address: 'Khu Công Nghiệp Tân Bình',
      type: 'pickup',
      timeWindow: { start: '08:00', end: '16:00' },
      serviceTime: 45,
      containerType: '40ft',
      weight: 25000,
      volume: 67
    },
    {
      id: 'delivery-1',
      lat: 10.9804,
      lng: 106.6750,
      address: 'Khu Công Nghiệp Bình Dương',
      type: 'delivery',
      timeWindow: { start: '09:00', end: '17:00' },
      serviceTime: 30,
      containerType: '40ft'
    },
    {
      id: 'empty-return-1',
      lat: 10.7215,
      lng: 106.7441,
      address: 'Depot Rỗng Quận 7',
      type: 'empty_return',
      timeWindow: { start: '10:00', end: '18:00' },
      serviceTime: 20
    }
  ];

  const sampleVehicles: Vehicle[] = [
    {
      id: 'truck-1',
      name: 'Container Truck 40ft - 51C-12345',
      type: 'truck_40ft',
      capacity: { weight: 30000, volume: 76, containers: 1 },
      currentLocation: sampleLocations[0],
      workingHours: { start: '06:00', end: '18:00' },
      skills: ['container_40ft', 'hazmat'],
      costPerKm: 2.5,
      costPerHour: 25,
      maxDistance: 500,
      maxDuration: 720
    },
    {
      id: 'truck-2',
      name: 'Container Truck 20ft - 51C-67890',
      type: 'truck_20ft',
      capacity: { weight: 20000, volume: 33, containers: 1 },
      currentLocation: sampleLocations[0],
      workingHours: { start: '07:00', end: '19:00' },
      skills: ['container_20ft'],
      costPerKm: 2.0,
      costPerHour: 20,
      maxDistance: 400,
      maxDuration: 600
    }
  ];

  useEffect(() => {
    setLocations(sampleLocations);
    setVehicles(sampleVehicles);
    
    // Start real-time optimization service
    realTimeService.start();
    
    // Subscribe to real-time updates
    const unsubscribe = realTimeService.subscribe((update: RealTimeUpdate) => {
      setRealTimeUpdates(prev => [update, ...prev.slice(0, 9)]); // Keep last 10 updates
      
      // Update service status
      setServiceStatus(realTimeService.getStatus());
      
      // Handle specific update types
      if (update.type === 'optimization_complete' && update.data.result) {
        setOptimizationResult(update.data.result);
      }
    });
    
    // Cleanup on unmount
    return () => {
      unsubscribe();
      realTimeService.stop();
    };
  }, [realTimeService]);

  const handleOptimizeRoutes = async () => {
    if (locations.length === 0 || vehicles.length === 0) {
      alert('Please add locations and vehicles before optimizing.');
      return;
    }

    setIsOptimizing(true);
    
    try {
      const request: RouteOptimizationRequest = {
        vehicles,
        locations,
        constraints: {
          maxRouteTime: 8 * 60, // 8 hours
          maxRouteDistance: 500, // 500 km
          requireReturnToDepot: true,
          allowSplitDeliveries: false
        },
        objectives: {
          minimizeCost: 0.4,
          minimizeTime: 0.3,
          minimizeDistance: 0.2,
          maximizeUtilization: 0.1
        }
      };

      // Use real-time optimization service
      const result = await realTimeService.optimizeWithRealTime(request);
      setOptimizationResult(result);
      onOptimizationComplete?.(result);

      // Center map on first route
      if (result.routes.length > 0 && result.routes[0].locations.length > 0) {
        const firstLocation = result.routes[0].locations[0];
        setMapCenter([firstLocation.lat, firstLocation.lng]);
        setMapZoom(12);
      }
    } catch (error) {
      console.error('Optimization error:', error);
      alert('Error during optimization. Please try again.');
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleLearnFromFiles = async () => {
    setIsLearning(true);
    setLearningProgress(0);

    try {
      // Simulate learning progress
      const progressInterval = setInterval(() => {
        setLearningProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 500);

      // Learn from Excel files
      const excelFiles = [
        '/Users/aelitapham/Documents/Zalo Received Files/KẾ HOẠCH NGÀY.xlsx',
        '/Users/aelitapham/Documents/Zalo Received Files/KẾ HOẠCH NGÀY (1).xlsx',
        '/Users/aelitapham/Documents/Zalo Received Files/KẾ HOẠCH NGÀY (2).xlsx',
        '/Users/aelitapham/Documents/Zalo Received Files/KẾ HOẠCH NGÀY (3).xlsx',
        '/Users/aelitapham/Documents/Zalo Received Files/KẾ HOẠCH NGÀY (4).xlsx'
      ];

      await logisticsAI.learnFromExcelFiles(excelFiles);
      
      clearInterval(progressInterval);
      setLearningProgress(100);

      // Generate AI predictions
      const prediction = await logisticsAI.generatePredictions(
        new Date().toISOString().split('T')[0],
        {
          origin: 'Cảng Sài Gòn',
          destination: 'Bình Dương',
          containerType: '40ft',
          urgency: 'medium'
        }
      );

      setAIPrediction(prediction);
      onAIPrediction?.(prediction);

    } catch (error) {
      console.error('Learning error:', error);
      alert('Error during AI learning. Please check the file paths.');
    } finally {
      setIsLearning(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    return `${hours}h ${mins}m`;
  };

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Advanced Route Optimization</h1>
          <p className="text-gray-600 mt-2">AI-powered logistics optimization for Vietnamese container shipping</p>
        </div>
        <div className="flex gap-3">
          <Button 
            onClick={handleLearnFromFiles}
            disabled={isLearning}
            className="bg-purple-600 hover:bg-purple-700"
          >
            <Brain className="w-4 h-4 mr-2" />
            {isLearning ? 'Learning...' : 'Learn from Data'}
          </Button>
          <Button 
            onClick={handleOptimizeRoutes}
            disabled={isOptimizing || locations.length === 0}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Zap className="w-4 h-4 mr-2" />
            {isOptimizing ? 'Optimizing...' : 'Optimize Routes'}
          </Button>
        </div>
      </div>

      {/* Learning Progress */}
      {isLearning && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Learning from historical data...</span>
                <span className="text-sm text-gray-500">{learningProgress}%</span>
              </div>
              <Progress value={learningProgress} className="w-full" />
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Navigation className="w-5 h-5" />
                Route Visualization
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-96 rounded-lg overflow-hidden">
                <SimpleMap
                  center={mapCenter}
                  zoom={mapZoom}
                  locations={locations}
                  routes={optimizationResult?.routes || []}
                  selectedRoute={selectedRoute}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Controls and Summary */}
        <div className="space-y-6">
          {/* Quick Stats */}
          {optimizationResult && (
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-green-600" />
                    <div>
                      <p className="text-sm text-gray-600">Total Cost</p>
                      <p className="text-lg font-semibold">{formatCurrency(optimizationResult.totalCost)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-600">Total Time</p>
                      <p className="text-lg font-semibold">{formatDuration(optimizationResult.totalTime)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2">
                    <Route className="w-4 h-4 text-purple-600" />
                    <div>
                      <p className="text-sm text-gray-600">Distance</p>
                      <p className="text-lg font-semibold">{optimizationResult.totalDistance.toFixed(1)} km</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-orange-600" />
                    <div>
                      <p className="text-sm text-gray-600">Score</p>
                      <p className="text-lg font-semibold">{optimizationResult.optimizationScore.toFixed(1)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Vehicle Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="w-5 h-5" />
                Vehicles
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {vehicles.map((vehicle, index) => (
                  <div key={vehicle.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-sm">{vehicle.name}</p>
                      <p className="text-xs text-gray-600">
                        {vehicle.capacity.weight}kg • {vehicle.capacity.volume}m³
                      </p>
                    </div>
                    <Badge variant={optimizationResult?.routes[index] ? "default" : "secondary"}>
                      {optimizationResult?.routes[index] ? "Assigned" : "Available"}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Detailed Results */}
      {(optimizationResult || aiPrediction) && (
        <Card>
          <CardHeader>
            <CardTitle>Optimization Results & AI Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="routes" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="routes">Routes</TabsTrigger>
                <TabsTrigger value="ai-suggestions">AI Suggestions</TabsTrigger>
                <TabsTrigger value="staff">Staff</TabsTrigger>
                <TabsTrigger value="risks">Risks</TabsTrigger>
              </TabsList>
              
              <TabsContent value="routes" className="space-y-4">
                {optimizationResult?.routes.map((route, index) => (
                  <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow"
                        onClick={() => setSelectedRoute(index)}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <div 
                            className="w-4 h-4 rounded-full" 
                            style={{ backgroundColor: getRouteColor(index) }}
                          />
                          Route {index + 1} - {route.vehicleId}
                        </CardTitle>
                        <Badge variant="outline">
                          {route.utilization.toFixed(1)}% utilized
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-3 gap-4 mb-4">
                        <div className="text-center">
                          <p className="text-sm text-gray-600">Cost</p>
                          <p className="font-semibold">{formatCurrency(route.totalCost)}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-gray-600">Time</p>
                          <p className="font-semibold">{formatDuration(route.totalTime)}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-gray-600">Distance</p>
                          <p className="font-semibold">{route.totalDistance.toFixed(1)} km</p>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-700">Route Sequence:</p>
                        <div className="flex flex-wrap gap-2">
                          {route.locations.map((location, locIndex) => (
                            <Badge key={locIndex} variant="secondary" className="text-xs">
                              {locIndex + 1}. {location.address.split(',')[0]}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>
              
              <TabsContent value="ai-suggestions" className="space-y-4">
                {aiPrediction?.optimizationSuggestions.map((suggestion, index) => (
                  <Alert key={index}>
                    <TrendingUp className="h-4 w-4" />
                    <AlertDescription>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{suggestion.description}</span>
                          <Badge variant={suggestion.priority <= 2 ? "default" : "secondary"}>
                            {suggestion.potentialSavings}% savings
                          </Badge>
                        </div>
                        <div className="flex gap-2">
                          <Badge variant="outline" className="text-xs">
                            {suggestion.type}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {suggestion.implementationDifficulty} difficulty
                          </Badge>
                        </div>
                      </div>
                    </AlertDescription>
                  </Alert>
                ))}
              </TabsContent>
              
              <TabsContent value="staff" className="space-y-4">
                {aiPrediction?.staffReplacements.map((replacement, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Users className="w-5 h-5" />
                        Replacements for {replacement.originalStaff}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {replacement.suggestedReplacements.map((suggestion, suggIndex) => (
                          <div key={suggIndex} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div>
                              <p className="font-medium">{suggestion.name}</p>
                              <p className="text-sm text-gray-600">{suggestion.experienceLevel}</p>
                              <p className="text-xs text-gray-500">{suggestion.reasoning}</p>
                            </div>
                            <div className="text-right">
                              <Badge variant="default" className="mb-1">
                                {(suggestion.confidence * 100).toFixed(0)}% match
                              </Badge>
                              <p className="text-xs text-gray-600">
                                Skill: {(suggestion.skillMatch * 100).toFixed(0)}%
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>
              
              <TabsContent value="risks" className="space-y-4">
                {aiPrediction?.riskAssessments.map((risk, index) => (
                  <Alert key={index} variant={risk.probability > 0.3 ? "destructive" : "default"}>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{risk.riskType}</span>
                          <Badge variant={risk.probability > 0.3 ? "destructive" : "secondary"}>
                            {(risk.probability * 100).toFixed(0)}% probability
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">{risk.impact}</p>
                        <p className="text-sm font-medium text-green-700">
                          Mitigation: {risk.mitigation}
                        </p>
                      </div>
                    </AlertDescription>
                  </Alert>
                ))}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
