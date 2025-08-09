import React, { useState, useEffect } from 'react';
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
  Fuel, Leaf, Route, Activity, BarChart3
} from 'lucide-react';
import EnhancedRouteOptimizer, { 
  Location, Vehicle, RouteOptimizationConfig, OptimizationResult
} from '@/lib/enhancedRouteOptimizer';
import { useLanguage } from '@/contexts/LanguageContext';

const CombinedRouteOptimizer: React.FC = () => {
  const { language, t } = useLanguage();
  const [optimizer] = useState(new EnhancedRouteOptimizer());
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizationProgress, setOptimizationProgress] = useState(0);
  const [optimizationResult, setOptimizationResult] = useState<OptimizationResult | null>(null);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [config, setConfig] = useState<Partial<RouteOptimizationConfig>>({});
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<string>('hybrid');
  const [mapView, setMapView] = useState<'vietnam' | 'detailed'>('vietnam');

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82ca9d'];

  // Vietnam major cities for initial data
  const vietnamCities = [
    { id: 'hcm', name: 'TP. Hồ Chí Minh', latitude: 10.8231, longitude: 106.6297, type: 'depot' as const },
    { id: 'hanoi', name: 'Hà Nội', latitude: 21.0285, longitude: 105.8542, type: 'customer' as const },
    { id: 'danang', name: 'Đà Nẵng', latitude: 16.0544, longitude: 108.2022, type: 'customer' as const },
    { id: 'cantho', name: 'Cần Thơ', latitude: 10.0452, longitude: 105.7469, type: 'customer' as const },
    { id: 'haiphong', name: 'Hải Phòng', latitude: 20.8449, longitude: 106.6881, type: 'customer' as const },
    { id: 'nhatrang', name: 'Nha Trang', latitude: 12.2388, longitude: 109.1967, type: 'customer' as const },
    { id: 'vungtau', name: 'Vũng Tàu', latitude: 10.4113, longitude: 107.1365, type: 'customer' as const },
    { id: 'dalat', name: 'Đà Lạt', latitude: 11.9404, longitude: 108.4583, type: 'customer' as const }
  ];

  useEffect(() => {
    initializeDefaultData();
  }, []);

  const initializeDefaultData = () => {
    // Initialize with Vietnam logistics data
    const sampleVehicles: Vehicle[] = [
      {
        id: 'truck_001',
        name: 'Xe tải lớn TP.HCM',
        capacity: 5000,
        maxDistance: 800,
        maxTime: 600,
        costPerKm: 0.8,
        costPerHour: 15,
        startLocation: vietnamCities[0],
        endLocation: vietnamCities[0],
        skills: ['heavy_cargo', 'long_distance']
      },
      {
        id: 'truck_002',
        name: 'Xe tải trung Hà Nội',
        capacity: 3000,
        maxDistance: 500,
        maxTime: 480,
        costPerKm: 0.6,
        costPerHour: 12,
        startLocation: vietnamCities[1],
        endLocation: vietnamCities[1],
        skills: ['medium_cargo', 'urban_delivery']
      },
      {
        id: 'van_001',
        name: 'Xe van nhanh Đà Nẵng',
        capacity: 1000,
        maxDistance: 300,
        maxTime: 360,
        costPerKm: 0.4,
        costPerHour: 10,
        startLocation: vietnamCities[2],
        endLocation: vietnamCities[2],
        skills: ['express_delivery', 'small_packages']
      }
    ];

    const sampleLocations: Location[] = vietnamCities.slice(1).map((city, index) => ({
      ...city,
      address: `${city.name}, Việt Nam`,
      demand: Math.floor(Math.random() * 500) + 100,
      priority: Math.floor(Math.random() * 10) + 1,
      serviceTime: Math.floor(Math.random() * 60) + 30,
      timeWindow: {
        start: '08:00',
        end: '17:00'
      }
    }));

    setVehicles(sampleVehicles);
    setLocations(sampleLocations);
    
    // Set default configuration
    setConfig({
      algorithm: 'hybrid',
      objectives: {
        minimizeDistance: 0.3,
        minimizeTime: 0.3,
        minimizeCost: 0.2,
        maximizeCustomerSatisfaction: 0.2
      },
      constraints: {
        vehicleCapacity: true,
        timeWindows: true,
        maxRouteDistance: true,
        maxRouteTime: true,
        driverBreaks: true
      },
      vietnamSpecific: {
        avoidTolls: false,
        considerTraffic: true,
        weatherConditions: true,
        roadConditions: true,
        fuelStations: true
      }
    });
  };

  const handleOptimization = async () => {
    if (vehicles.length === 0 || locations.length === 0) {
      alert(t('noVehiclesOrOrders'));
      return;
    }

    setIsOptimizing(true);
    setOptimizationProgress(0);

    try {
      // Create optimizer with current config
      const enhancedOptimizer = new EnhancedRouteOptimizer(config);
      
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setOptimizationProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + Math.random() * 10;
        });
      }, 500);

      const result = await enhancedOptimizer.optimizeRoutes(vehicles, locations);
      
      clearInterval(progressInterval);
      setOptimizationProgress(100);
      setOptimizationResult(result);
      
      console.log('✅ Enhanced optimization completed:', result);
    } catch (error) {
      console.error('❌ Optimization failed:', error);
      alert(t('optimizationError'));
    } finally {
      setIsOptimizing(false);
    }
  };

  const addVehicle = () => {
    const newVehicle: Vehicle = {
      id: `vehicle_${Date.now()}`,
      name: `${t('newVehicle')} ${vehicles.length + 1}`,
      capacity: 2000,
      maxDistance: 400,
      maxTime: 480,
      costPerKm: 0.5,
      costPerHour: 10,
      startLocation: vietnamCities[0],
      skills: ['standard_delivery']
    };
    
    setVehicles([...vehicles, newVehicle]);
  };

  const addLocation = () => {
    const randomCity = vietnamCities[Math.floor(Math.random() * vietnamCities.length)];
    const newLocation: Location = {
      id: `location_${Date.now()}`,
      name: `${t('customer')} ${locations.length + 1}`,
      latitude: randomCity.latitude + (Math.random() - 0.5) * 0.1,
      longitude: randomCity.longitude + (Math.random() - 0.5) * 0.1,
      address: `${randomCity.name}, Việt Nam`,
      type: 'customer',
      demand: Math.floor(Math.random() * 300) + 50,
      priority: Math.floor(Math.random() * 10) + 1,
      serviceTime: Math.floor(Math.random() * 45) + 15,
      timeWindow: {
        start: '09:00',
        end: '16:00'
      }
    };
    
    setLocations([...locations, newLocation]);
  };

  const formatDistance = (meters: number): string => {
    if (meters >= 1000) {
      return `${(meters / 1000).toFixed(1)} km`;
    }
    return `${Math.round(meters)} m`;
  };

  const formatTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = Math.floor(minutes % 60);
    
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 p-6">
      <div className="container mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-2">
              <Navigation className="h-8 w-8 text-blue-400" />
              {t('enhancedRouteOptimization')}
            </h1>
            <p className="text-blue-200 mt-2">
              Enhanced Route Optimizer with Vietnam Map Integration
            </p>
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={handleOptimization} 
              disabled={isOptimizing}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <Play className="h-4 w-4 mr-2" />
              {isOptimizing ? t('optimizing') : t('optimize')}
            </Button>
            <Button 
              variant="outline" 
              className="bg-white/20 backdrop-blur-sm text-white border-white/30 hover:bg-white/30"
            >
              <Map className="h-4 w-4 mr-2" />
              Vietnam Map
            </Button>
          </div>
        </div>

        {/* Optimization Progress */}
        {isOptimizing && (
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-white">{t('optimizationProgress')}</span>
                  <span className="text-sm text-white/70">{Math.round(optimizationProgress)}%</span>
                </div>
                <Progress value={optimizationProgress} className="w-full" />
                <p className="text-sm text-white/80">
                  {optimizationProgress < 20 ? 'Initializing enhanced algorithms...' :
                   optimizationProgress < 40 ? 'Running Dijkstra analysis...' :
                   optimizationProgress < 60 ? 'Applying genetic optimization...' :
                   optimizationProgress < 80 ? 'Fine-tuning with simulated annealing...' :
                   optimizationProgress < 95 ? 'Final ant colony optimization...' :
                   'Generating Vietnam-specific insights...'}
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        <Tabs defaultValue="setup" className="w-full">
          {/* Setup Tab */}
          <TabsContent value="setup" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-white">
                    {t('totalVehicles')}
                  </CardTitle>
                  <Truck className="h-4 w-4 text-white/60" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{vehicles.length}</div>
                  <p className="text-xs text-white/60">
                    {t('availableForOptimization')}
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-white">
                    Total Locations
                  </CardTitle>
                  <MapPin className="h-4 w-4 text-white/60" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{locations.length}</div>
                  <p className="text-xs text-white/60">
                    Delivery destinations
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-white">
                    Algorithm
                  </CardTitle>
                  <Zap className="h-4 w-4 text-white/60" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white capitalize">{selectedAlgorithm}</div>
                  <p className="text-xs text-white/60">
                    Optimization method
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button onClick={addVehicle} variant="outline" className="h-20 flex-col bg-white/10 border-white/30 text-white hover:bg-white/20">
                    <Truck className="h-6 w-6 mb-2" />
                    Add Vehicle
                  </Button>
                  <Button onClick={addLocation} variant="outline" className="h-20 flex-col bg-white/10 border-white/30 text-white hover:bg-white/20">
                    <MapPin className="h-6 w-6 mb-2" />
                    Add Location
                  </Button>
                  <Button variant="outline" className="h-20 flex-col bg-white/10 border-white/30 text-white hover:bg-white/20">
                    <Upload className="h-6 w-6 mb-2" />
                    Import Data
                  </Button>
                  <Button variant="outline" className="h-20 flex-col bg-white/10 border-white/30 text-white hover:bg-white/20">
                    <Download className="h-6 w-6 mb-2" />
                    Export Results
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Vehicles Tab */}
          <TabsContent value="vehicles" className="space-y-6">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-white">Vehicle Fleet</CardTitle>
                <Button onClick={addVehicle} className="bg-blue-600 hover:bg-blue-700">
                  <Truck className="h-4 w-4 mr-2" />
                  Add Vehicle
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {vehicles.map((vehicle, index) => (
                    <Card key={vehicle.id} className="p-4 bg-white/5 border-white/10">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                          <Label className="text-sm font-medium text-white">Vehicle Info</Label>
                          <p className="text-sm text-white/90">{vehicle.name}</p>
                          <p className="text-xs text-white/60">{vehicle.id}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-white">Capacity & Limits</Label>
                          <div className="text-sm space-y-1 text-white/80">
                            <p>Capacity: {vehicle.capacity} kg</p>
                            <p>Max Distance: {vehicle.maxDistance} km</p>
                            <p>Max Time: {formatTime(vehicle.maxTime || 0)}</p>
                          </div>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-white">Costs</Label>
                          <div className="text-sm space-y-1 text-white/80">
                            <p>Per km: ${vehicle.costPerKm}</p>
                            <p>Per hour: ${vehicle.costPerHour}</p>
                          </div>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-white">Skills</Label>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {vehicle.skills?.map((skill, idx) => (
                              <Badge key={idx} variant="secondary" className="text-xs bg-blue-500/20 text-blue-300">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Locations Tab */}
          <TabsContent value="locations" className="space-y-6">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-white">Delivery Locations</CardTitle>
                <Button onClick={addLocation} className="bg-green-600 hover:bg-green-700">
                  <MapPin className="h-4 w-4 mr-2" />
                  Add Location
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {locations.map((location, index) => (
                    <Card key={location.id} className="p-4 bg-white/5 border-white/10">
                      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                        <div>
                          <Label className="text-sm font-medium text-white">Location Info</Label>
                          <p className="text-sm font-medium text-white/90">{location.name}</p>
                          <p className="text-xs text-white/60">{location.id}</p>
                          <Badge 
                            variant={location.priority >= 8 ? "destructive" : location.priority >= 6 ? "default" : "secondary"}
                            className="text-xs mt-1"
                          >
                            Priority: {location.priority}
                          </Badge>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-white">Address</Label>
                          <p className="text-sm text-white/80">{location.address}</p>
                          <p className="text-xs text-white/60">
                            {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
                          </p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-white">Demand</Label>
                          <div className="text-sm space-y-1 text-white/80">
                            <p>Weight: {location.demand} kg</p>
                            <p>Service: {formatTime(location.serviceTime || 0)}</p>
                          </div>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-white">Time Window</Label>
                          <div className="text-sm text-white/80">
                            <p>{location.timeWindow?.start} - {location.timeWindow?.end}</p>
                          </div>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-white">Type</Label>
                          <Badge variant="outline" className="text-xs text-white border-white/30">
                            {location.type}
                          </Badge>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Configuration Tab */}
          <TabsContent value="config" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <CardTitle className="text-white">Algorithm Selection</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="algorithm" className="text-white">Optimization Algorithm</Label>
                    <Select
                      value={selectedAlgorithm}
                      onValueChange={(value) => {
                        setSelectedAlgorithm(value);
                        setConfig({
                          ...config,
                          algorithm: value as any
                        });
                      }}
                    >
                      <SelectTrigger className="bg-white/20 border-white/30 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="dijkstra">Dijkstra (Shortest Path)</SelectItem>
                        <SelectItem value="genetic">Genetic Algorithm</SelectItem>
                        <SelectItem value="simulated_annealing">Simulated Annealing</SelectItem>
                        <SelectItem value="ant_colony">Ant Colony Optimization</SelectItem>
                        <SelectItem value="hybrid">Hybrid (Recommended)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-4">
                    <Label className="text-white">Optimization Objectives</Label>
                    
                    <div>
                      <Label className="text-sm text-white">Distance: {((config.objectives?.minimizeDistance || 0.3) * 100).toFixed(0)}%</Label>
                      <Slider
                        value={[(config.objectives?.minimizeDistance || 0.3) * 100]}
                        onValueChange={([value]) => setConfig({
                          ...config,
                          objectives: {
                            ...config.objectives,
                            minimizeDistance: value / 100,
                            minimizeTime: config.objectives?.minimizeTime || 0.3,
                            minimizeCost: config.objectives?.minimizeCost || 0.2,
                            maximizeCustomerSatisfaction: config.objectives?.maximizeCustomerSatisfaction || 0.2
                          }
                        })}
                        max={100}
                        min={0}
                        step={5}
                        className="mt-2"
                      />
                    </div>

                    <div>
                      <Label className="text-sm text-white">Time: {((config.objectives?.minimizeTime || 0.3) * 100).toFixed(0)}%</Label>
                      <Slider
                        value={[(config.objectives?.minimizeTime || 0.3) * 100]}
                        onValueChange={([value]) => setConfig({
                          ...config,
                          objectives: {
                            ...config.objectives,
                            minimizeDistance: config.objectives?.minimizeDistance || 0.3,
                            minimizeTime: value / 100,
                            minimizeCost: config.objectives?.minimizeCost || 0.2,
                            maximizeCustomerSatisfaction: config.objectives?.maximizeCustomerSatisfaction || 0.2
                          }
                        })}
                        max={100}
                        min={0}
                        step={5}
                        className="mt-2"
                      />
                    </div>

                    <div>
                      <Label className="text-sm text-white">Cost: {((config.objectives?.minimizeCost || 0.2) * 100).toFixed(0)}%</Label>
                      <Slider
                        value={[(config.objectives?.minimizeCost || 0.2) * 100]}
                        onValueChange={([value]) => setConfig({
                          ...config,
                          objectives: {
                            ...config.objectives,
                            minimizeDistance: config.objectives?.minimizeDistance || 0.3,
                            minimizeTime: config.objectives?.minimizeTime || 0.3,
                            minimizeCost: value / 100,
                            maximizeCustomerSatisfaction: config.objectives?.maximizeCustomerSatisfaction || 0.2
                          }
                        })}
                        max={100}
                        min={0}
                        step={5}
                        className="mt-2"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <CardTitle className="text-white">Vietnam-Specific Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="avoidTolls"
                      checked={config.vietnamSpecific?.avoidTolls || false}
                      onCheckedChange={(checked) => setConfig({
                        ...config,
                        vietnamSpecific: {
                          ...config.vietnamSpecific,
                          avoidTolls: checked,
                          considerTraffic: config.vietnamSpecific?.considerTraffic || true,
                          weatherConditions: config.vietnamSpecific?.weatherConditions || true,
                          roadConditions: config.vietnamSpecific?.roadConditions || true,
                          fuelStations: config.vietnamSpecific?.fuelStations || true
                        }
                      })}
                    />
                    <Label htmlFor="avoidTolls" className="text-white">Avoid Toll Roads</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="considerTraffic"
                      checked={config.vietnamSpecific?.considerTraffic !== false}
                      onCheckedChange={(checked) => setConfig({
                        ...config,
                        vietnamSpecific: {
                          ...config.vietnamSpecific,
                          avoidTolls: config.vietnamSpecific?.avoidTolls || false,
                          considerTraffic: checked,
                          weatherConditions: config.vietnamSpecific?.weatherConditions || true,
                          roadConditions: config.vietnamSpecific?.roadConditions || true,
                          fuelStations: config.vietnamSpecific?.fuelStations || true
                        }
                      })}
                    />
                    <Label htmlFor="considerTraffic" className="text-white">Consider Traffic Patterns</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="weatherConditions"
                      checked={config.vietnamSpecific?.weatherConditions !== false}
                      onCheckedChange={(checked) => setConfig({
                        ...config,
                        vietnamSpecific: {
                          ...config.vietnamSpecific,
                          avoidTolls: config.vietnamSpecific?.avoidTolls || false,
                          considerTraffic: config.vietnamSpecific?.considerTraffic || true,
                          weatherConditions: checked,
                          roadConditions: config.vietnamSpecific?.roadConditions || true,
                          fuelStations: config.vietnamSpecific?.fuelStations || true
                        }
                      })}
                    />
                    <Label htmlFor="weatherConditions" className="text-white">Weather Impact</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="roadConditions"
                      checked={config.vietnamSpecific?.roadConditions !== false}
                      onCheckedChange={(checked) => setConfig({
                        ...config,
                        vietnamSpecific: {
                          ...config.vietnamSpecific,
                          avoidTolls: config.vietnamSpecific?.avoidTolls || false,
                          considerTraffic: config.vietnamSpecific?.considerTraffic || true,
                          weatherConditions: config.vietnamSpecific?.weatherConditions || true,
                          roadConditions: checked,
                          fuelStations: config.vietnamSpecific?.fuelStations || true
                        }
                      })}
                    />
                    <Label htmlFor="roadConditions" className="text-white">Road Conditions</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="fuelStations"
                      checked={config.vietnamSpecific?.fuelStations !== false}
                      onCheckedChange={(checked) => setConfig({
                        ...config,
                        vietnamSpecific: {
                          ...config.vietnamSpecific,
                          avoidTolls: config.vietnamSpecific?.avoidTolls || false,
                          considerTraffic: config.vietnamSpecific?.considerTraffic || true,
                          weatherConditions: config.vietnamSpecific?.weatherConditions || true,
                          roadConditions: config.vietnamSpecific?.roadConditions || true,
                          fuelStations: checked
                        }
                      })}
                    />
                    <Label htmlFor="fuelStations" className="text-white">Fuel Station Planning</Label>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          {/* Results Tab */}
          <TabsContent value="results" className="space-y-6">
            {optimizationResult ? (
              <>
                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-white">
                        Total Routes
                      </CardTitle>
                      <Navigation className="h-4 w-4 text-white/60" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-white">{optimizationResult.routes.length}</div>
                      <p className="text-xs text-white/60">
                        Optimized routes
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-white">
                        Total Distance
                      </CardTitle>
                      <MapPin className="h-4 w-4 text-white/60" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-white">
                        {formatDistance(optimizationResult.totalDistance * 1000)}
                      </div>
                      <p className="text-xs text-white/60">
                        Total travel distance
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-white">
                        Total Cost
                      </CardTitle>
                      <DollarSign className="h-4 w-4 text-white/60" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-white">
                        {formatCurrency(optimizationResult.totalCost)}
                      </div>
                      <p className="text-xs text-white/60">
                        Estimated total cost
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-white">
                        Efficiency
                      </CardTitle>
                      <Target className="h-4 w-4 text-white/60" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-green-400">
                        {(optimizationResult.overallEfficiency * 100).toFixed(1)}%
                      </div>
                      <p className="text-xs text-white/60">
                        Overall efficiency
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Vietnam Insights */}
                <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white">Vietnam-Specific Insights</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-yellow-400">
                          {formatCurrency(optimizationResult.vietnamInsights.tollCosts)}
                        </div>
                        <p className="text-sm text-white/60">Toll Costs</p>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-red-400">
                          {formatTime(optimizationResult.vietnamInsights.trafficDelays)}
                        </div>
                        <p className="text-sm text-white/60">Traffic Delays</p>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-400">
                          {formatTime(optimizationResult.vietnamInsights.weatherImpact)}
                        </div>
                        <p className="text-sm text-white/60">Weather Impact</p>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-400">
                          {(optimizationResult.vietnamInsights.roadConditionImpact * 100).toFixed(1)}%
                        </div>
                        <p className="text-sm text-white/60">Road Impact</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardContent className="pt-6">
                  <div className="text-center py-8">
                    <Navigation className="h-12 w-12 text-white/40 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-white mb-2">
                      No Optimization Results
                    </h3>
                    <p className="text-white/60 mb-4">
                      Run optimization to see detailed results and Vietnam-specific insights
                    </p>
                    <Button onClick={handleOptimization} disabled={isOptimizing} className="bg-blue-600 hover:bg-blue-700">
                      <Play className="h-4 w-4 mr-2" />
                      Start Enhanced Optimization
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Vietnam Map Tab */}
          <TabsContent value="map" className="space-y-6">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Vietnam Route Visualization</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-96 bg-white/5 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <Map className="h-16 w-16 text-white/40 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-white mb-2">
                      Interactive Vietnam Map
                    </h3>
                    <p className="text-white/60 mb-4">
                      Visualize optimized routes on Vietnam map with real-time traffic and road conditions
                    </p>
                    <div className="flex gap-2 justify-center">
                      <Button variant="outline" className="bg-white/10 border-white/30 text-white hover:bg-white/20">
                        <MapPin className="h-4 w-4 mr-2" />
                        Show All Locations
                      </Button>
                      <Button variant="outline" className="bg-white/10 border-white/30 text-white hover:bg-white/20">
                        <Navigation className="h-4 w-4 mr-2" />
                        Show Routes
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CombinedRouteOptimizer;
