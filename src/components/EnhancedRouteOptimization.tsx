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
  CheckCircle, TrendingUp, Users, Zap, Target
} from 'lucide-react';
import AWSRouteAccelerator, { 
  Vehicle, Order, OptimizationResult, OptimizationConfiguration,
  Location, VehicleCapacity, OrderRequirements, TimeWindow
} from '@/lib/awsRouteAccelerator';
import { useLanguage } from '@/contexts/LanguageContext';

const EnhancedRouteOptimization: React.FC = () => {
  const { language, t } = useLanguage();
  const [routeAccelerator] = useState(new AWSRouteAccelerator());
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizationProgress, setOptimizationProgress] = useState(0);
  const [optimizationResult, setOptimizationResult] = useState<OptimizationResult | null>(null);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [configuration, setConfiguration] = useState<Partial<OptimizationConfiguration>>({});
  const [selectedScenario, setSelectedScenario] = useState<string>('default');

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82ca9d'];

  useEffect(() => {
    initializeDefaultData();
  }, []);

  const initializeDefaultData = () => {
    // Initialize with sample Vietnamese logistics data
    const sampleVehicles: Vehicle[] = [
      {
        id: 'truck_001',
        name: 'Xe tải Thành phố 1',
        startingLocation: {
          latitude: 10.8231,
          longitude: 106.6297,
          address: 'Quận 1, TP.HCM',
          name: 'Kho trung tâm TP.HCM'
        },
        limits: {
          maxDistance: 300000, // 300km
          maxTime: 28800, // 8 hours
          capacity: {
            weight: 5000, // 5 tons
            volume: 50, // 50 m³
            maxOrders: 30
          }
        },
        attributes: ['refrigerated', 'fragile_goods'],
        backToOrigin: true,
        groupId: 'urban_delivery'
      },
      {
        id: 'truck_002',
        name: 'Xe tải Miền Đông',
        startingLocation: {
          latitude: 10.9804,
          longitude: 106.6750,
          address: 'Thủ Đức, TP.HCM',
          name: 'Kho Thủ Đức'
        },
        limits: {
          maxDistance: 500000, // 500km
          maxTime: 36000, // 10 hours
          capacity: {
            weight: 8000, // 8 tons
            volume: 80, // 80 m³
            maxOrders: 50
          }
        },
        attributes: ['heavy_goods', 'long_distance'],
        backToOrigin: true,
        groupId: 'regional_delivery'
      },
      {
        id: 'van_001',
        name: 'Xe van nội thành',
        startingLocation: {
          latitude: 10.7769,
          longitude: 106.7009,
          address: 'Quận 2, TP.HCM',
          name: 'Trung tâm phân phối Q2'
        },
        limits: {
          maxDistance: 150000, // 150km
          maxTime: 21600, // 6 hours
          capacity: {
            weight: 1500, // 1.5 tons
            volume: 15, // 15 m³
            maxOrders: 20
          }
        },
        attributes: ['express_delivery', 'small_packages'],
        backToOrigin: true,
        groupId: 'express_delivery'
      }
    ];

    const sampleOrders: Order[] = [
      {
        id: 'order_001',
        location: {
          latitude: 10.8142,
          longitude: 106.6438,
          address: '123 Nguyễn Huệ, Q1, TP.HCM',
          name: 'Khách hàng A'
        },
        requirements: {
          weight: 50,
          volume: 2,
          serviceTime: 600, // 10 minutes
          attributes: ['fragile_goods']
        },
        priority: 9,
        type: 'DELIVERY'
      },
      {
        id: 'order_002',
        location: {
          latitude: 10.7858,
          longitude: 106.6667,
          address: '456 Lê Lợi, Q1, TP.HCM',
          name: 'Khách hàng B'
        },
        requirements: {
          weight: 25,
          volume: 1,
          serviceTime: 300, // 5 minutes
          attributes: ['express_delivery']
        },
        priority: 8,
        type: 'DELIVERY'
      },
      {
        id: 'order_003',
        location: {
          latitude: 10.8030,
          longitude: 106.6438,
          address: '789 Đồng Khởi, Q1, TP.HCM',
          name: 'Khách hàng C'
        },
        requirements: {
          weight: 100,
          volume: 5,
          serviceTime: 900, // 15 minutes
          attributes: ['heavy_goods']
        },
        priority: 7,
        type: 'DELIVERY'
      },
      {
        id: 'order_004',
        location: {
          latitude: 10.9804,
          longitude: 106.6750,
          address: 'Khu công nghệ cao, Thủ Đức',
          name: 'Công ty D'
        },
        requirements: {
          weight: 200,
          volume: 8,
          serviceTime: 1200, // 20 minutes
          attributes: ['refrigerated']
        },
        priority: 9,
        type: 'DELIVERY'
      },
      {
        id: 'order_005',
        location: {
          latitude: 10.7308,
          longitude: 106.7175,
          address: 'Quận 7, TP.HCM',
          name: 'Khách hàng E'
        },
        requirements: {
          weight: 75,
          volume: 3,
          serviceTime: 450, // 7.5 minutes
          attributes: ['small_packages']
        },
        priority: 6,
        type: 'DELIVERY'
      }
    ];

    setVehicles(sampleVehicles);
    setOrders(sampleOrders);
  };

  const handleOptimization = async () => {
    if (vehicles.length === 0 || orders.length === 0) {
      alert(t('noVehiclesOrOrders'));
      return;
    }

    setIsOptimizing(true);
    setOptimizationProgress(0);

    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setOptimizationProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + Math.random() * 15;
        });
      }, 500);

      const result = await routeAccelerator.optimizeRoutes(vehicles, orders, configuration);
      
      clearInterval(progressInterval);
      setOptimizationProgress(100);
      setOptimizationResult(result);
      
      console.log('✅ Optimization completed:', result);
    } catch (error) {
      console.error('❌ Optimization failed:', error);
      alert(t('optimizationError'));
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleBatchOptimization = async () => {
    setIsOptimizing(true);
    setOptimizationProgress(0);

    try {
      const scenarios = [
        {
          name: 'Scenario 1: Peak Hours',
          vehicles: vehicles,
          orders: orders,
          configuration: {
            ...configuration,
            maxSolverDuration: 180,
            constraints: {
              ...configuration.constraints,
              travelTime: { weight: 8 }
            }
          }
        },
        {
          name: 'Scenario 2: Cost Optimized',
          vehicles: vehicles,
          orders: orders,
          configuration: {
            ...configuration,
            maxSolverDuration: 300,
            constraints: {
              ...configuration.constraints,
              travelDistance: { weight: 10 }
            }
          }
        },
        {
          name: 'Scenario 3: Balanced',
          vehicles: vehicles,
          orders: orders,
          configuration: configuration
        }
      ];

      const results = await routeAccelerator.batchOptimize(scenarios);
      
      // Use the best result
      const bestResult = results.reduce((best, current) => 
        current.statistics.orderFulfillment > best.statistics.orderFulfillment ? current : best
      );
      
      setOptimizationProgress(100);
      setOptimizationResult(bestResult);
      
      console.log('✅ Batch optimization completed:', results);
    } catch (error) {
      console.error('❌ Batch optimization failed:', error);
      alert(t('optimizationError'));
    } finally {
      setIsOptimizing(false);
    }
  };

  const addVehicle = () => {
    const newVehicle: Vehicle = {
      id: `vehicle_${Date.now()}`,
      name: `${t('newVehicle')} ${vehicles.length + 1}`,
      startingLocation: {
        latitude: 10.8231,
        longitude: 106.6297,
        address: 'TP.HCM',
        name: 'Depot'
      },
      limits: {
        maxDistance: 300000,
        maxTime: 28800,
        capacity: {
          weight: 5000,
          volume: 50,
          maxOrders: 30
        }
      },
      attributes: [],
      backToOrigin: true
    };
    
    setVehicles([...vehicles, newVehicle]);
  };

  const addOrder = () => {
    const newOrder: Order = {
      id: `order_${Date.now()}`,
      location: {
        latitude: 10.8231 + (Math.random() - 0.5) * 0.1,
        longitude: 106.6297 + (Math.random() - 0.5) * 0.1,
        address: `${t('newAddress')} ${orders.length + 1}`,
        name: `${t('customer')} ${orders.length + 1}`
      },
      requirements: {
        weight: Math.floor(Math.random() * 100) + 10,
        volume: Math.floor(Math.random() * 5) + 1,
        serviceTime: 300 + Math.floor(Math.random() * 600),
        attributes: []
      },
      priority: Math.floor(Math.random() * 10) + 1,
      type: 'DELIVERY'
    };
    
    setOrders([...orders, newOrder]);
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'bg-green-100 text-green-800';
      case 'RUNNING': return 'bg-blue-100 text-blue-800';
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'FAILED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDistance = (meters: number): string => {
    if (meters >= 1000) {
      return `${(meters / 1000).toFixed(1)} km`;
    }
    return `${Math.round(meters)} m`;
  };

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Navigation className="h-8 w-8 text-blue-600" />
            {t('enhancedRouteOptimization')}
          </h1>
          <p className="text-gray-600 mt-2">
            {t('awsRouteAcceleratorDescription')}
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleOptimization} disabled={isOptimizing}>
            <Play className="h-4 w-4 mr-2" />
            {isOptimizing ? t('optimizing') : t('optimize')}
          </Button>
          <Button onClick={handleBatchOptimization} disabled={isOptimizing} variant="outline">
            <Zap className="h-4 w-4 mr-2" />
            {t('batchOptimize')}
          </Button>
        </div>
      </div>

      {/* Optimization Progress */}
      {isOptimizing && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{t('optimizationProgress')}</span>
                <span className="text-sm text-gray-500">{Math.round(optimizationProgress)}%</span>
              </div>
              <Progress value={optimizationProgress} className="w-full" />
              <p className="text-sm text-gray-600">
                {optimizationProgress < 30 ? t('analyzingData') :
                 optimizationProgress < 60 ? t('calculatingRoutes') :
                 optimizationProgress < 90 ? t('optimizingSolution') :
                 t('finalizingResults')}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="setup" className="w-full">
        {/* Setup Tab */}
        <TabsContent value="setup" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {t('totalVehicles')}
                </CardTitle>
                <Truck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{vehicles.length}</div>
                <p className="text-xs text-muted-foreground">
                  {t('availableForOptimization')}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {t('totalOrders')}
                </CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{orders.length}</div>
                <p className="text-xs text-muted-foreground">
                  {t('pendingDelivery')}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {t('optimizationStatus')}
                </CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {optimizationResult ? (
                    <Badge className={getStatusBadgeColor(optimizationResult.status)}>
                      {t(optimizationResult.status.toLowerCase())}
                    </Badge>
                  ) : (
                    <Badge variant="outline">{t('notStarted')}</Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>{t('quickActions')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button onClick={addVehicle} variant="outline" className="h-20 flex-col">
                  <Truck className="h-6 w-6 mb-2" />
                  {t('addVehicle')}
                </Button>
                <Button onClick={addOrder} variant="outline" className="h-20 flex-col">
                  <Package className="h-6 w-6 mb-2" />
                  {t('addOrder')}
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <Upload className="h-6 w-6 mb-2" />
                  {t('importData')}
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <Download className="h-6 w-6 mb-2" />
                  {t('exportResults')}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Vehicles Tab */}
        <TabsContent value="vehicles" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>{t('vehicleFleet')}</CardTitle>
              <Button onClick={addVehicle}>
                <Truck className="h-4 w-4 mr-2" />
                {t('addVehicle')}
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {vehicles.map((vehicle, index) => (
                  <Card key={vehicle.id} className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <Label className="text-sm font-medium">{t('vehicleName')}</Label>
                        <p className="text-sm">{vehicle.name}</p>
                        <p className="text-xs text-gray-500">{vehicle.id}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">{t('capacity')}</Label>
                        <div className="text-sm space-y-1">
                          <p>{t('weight')}: {vehicle.limits?.capacity?.weight || 0} kg</p>
                          <p>{t('volume')}: {vehicle.limits?.capacity?.volume || 0} m³</p>
                          <p>{t('maxOrders')}: {vehicle.limits?.capacity?.maxOrders || 0}</p>
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">{t('limits')}</Label>
                        <div className="text-sm space-y-1">
                          <p>{t('maxDistance')}: {formatDistance(vehicle.limits?.maxDistance || 0)}</p>
                          <p>{t('maxTime')}: {formatTime(vehicle.limits?.maxTime || 0)}</p>
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">{t('attributes')}</Label>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {vehicle.attributes?.map((attr, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {t(attr) || attr}
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

        {/* Orders Tab */}
        <TabsContent value="orders" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>{t('orderManagement')}</CardTitle>
              <Button onClick={addOrder}>
                <Package className="h-4 w-4 mr-2" />
                {t('addOrder')}
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {orders.map((order, index) => (
                  <Card key={order.id} className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                      <div>
                        <Label className="text-sm font-medium">{t('orderInfo')}</Label>
                        <p className="text-sm font-medium">{order.location.name}</p>
                        <p className="text-xs text-gray-500">{order.id}</p>
                        <Badge 
                          variant={order.priority >= 8 ? "destructive" : order.priority >= 6 ? "default" : "secondary"}
                          className="text-xs mt-1"
                        >
                          {t('priority')}: {order.priority}
                        </Badge>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">{t('location')}</Label>
                        <p className="text-sm">{order.location.address}</p>
                        <p className="text-xs text-gray-500">
                          {order.location.latitude.toFixed(4)}, {order.location.longitude.toFixed(4)}
                        </p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">{t('requirements')}</Label>
                        <div className="text-sm space-y-1">
                          <p>{t('weight')}: {order.requirements?.weight || 0} kg</p>
                          <p>{t('volume')}: {order.requirements?.volume || 0} m³</p>
                          <p>{t('serviceTime')}: {formatTime(order.requirements?.serviceTime || 0)}</p>
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">{t('type')}</Label>
                        <Badge variant="outline" className="text-xs">
                          {t(order.type?.toLowerCase() || 'delivery')}
                        </Badge>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">{t('attributes')}</Label>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {order.requirements?.attributes?.map((attr, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {t(attr) || attr}
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

        {/* Configuration Tab */}
        <TabsContent value="configuration" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>{t('basicSettings')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="distanceMatrix">{t('distanceMatrixType')}</Label>
                  <Select
                    value={configuration.distanceMatrixType || 'ROAD_DISTANCE'}
                    onValueChange={(value) => setConfiguration({
                      ...configuration,
                      distanceMatrixType: value as 'ROAD_DISTANCE' | 'STRAIGHT_LINE'
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ROAD_DISTANCE">{t('roadDistance')}</SelectItem>
                      <SelectItem value="STRAIGHT_LINE">{t('straightLine')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="avoidTolls"
                    checked={configuration.avoidTolls || false}
                    onCheckedChange={(checked) => setConfiguration({
                      ...configuration,
                      avoidTolls: checked
                    })}
                  />
                  <Label htmlFor="avoidTolls">{t('avoidTolls')}</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="backToOrigin"
                    checked={configuration.backToOrigin !== false}
                    onCheckedChange={(checked) => setConfiguration({
                      ...configuration,
                      backToOrigin: checked
                    })}
                  />
                  <Label htmlFor="backToOrigin">{t('backToOrigin')}</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="explain"
                    checked={configuration.explain || false}
                    onCheckedChange={(checked) => setConfiguration({
                      ...configuration,
                      explain: checked
                    })}
                  />
                  <Label htmlFor="explain">{t('explainSolution')}</Label>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t('solverSettings')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>{t('maxSolverDuration')}: {configuration.maxSolverDuration || 300}s</Label>
                  <Slider
                    value={[configuration.maxSolverDuration || 300]}
                    onValueChange={([value]) => setConfiguration({
                      ...configuration,
                      maxSolverDuration: value
                    })}
                    max={600}
                    min={60}
                    step={30}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label>{t('maxUnimprovedDuration')}: {configuration.maxUnimprovedSolverDuration || 60}s</Label>
                  <Slider
                    value={[configuration.maxUnimprovedSolverDuration || 60]}
                    onValueChange={([value]) => setConfiguration({
                      ...configuration,
                      maxUnimprovedSolverDuration: value
                    })}
                    max={180}
                    min={10}
                    step={10}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="maxOrders">{t('maxOrders')}</Label>
                  <Input
                    id="maxOrders"
                    type="number"
                    value={configuration.maxOrders || ''}
                    onChange={(e) => setConfiguration({
                      ...configuration,
                      maxOrders: parseInt(e.target.value) || undefined
                    })}
                    placeholder="100"
                  />
                </div>

                <div>
                  <Label htmlFor="maxDistance">{t('maxDistance')} (m)</Label>
                  <Input
                    id="maxDistance"
                    type="number"
                    value={configuration.maxDistance || ''}
                    onChange={(e) => setConfiguration({
                      ...configuration,
                      maxDistance: parseInt(e.target.value) || undefined
                    })}
                    placeholder="500000"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>{t('constraintWeights')}</CardTitle>
              <p className="text-sm text-gray-600">{t('constraintWeightsDescription')}</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  'travelTime', 'travelDistance', 'lateArrival', 'earlyArrival',
                  'vehicleWeight', 'vehicleVolume', 'maxTime', 'maxDistance'
                ].map((constraint) => (
                  <div key={constraint}>
                    <Label className="text-sm">
                      {t(constraint)}: {configuration.constraints?.[constraint as keyof OptimizationConstraints]?.weight || 1}
                    </Label>
                    <Slider
                      value={[configuration.constraints?.[constraint as keyof OptimizationConstraints]?.weight || 1]}
                      onValueChange={([value]) => setConfiguration({
                        ...configuration,
                        constraints: {
                          ...configuration.constraints,
                          [constraint]: { weight: value }
                        }
                      })}
                      max={10}
                      min={0.1}
                      step={0.1}
                      className="mt-1"
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        {/* Results Tab */}
        <TabsContent value="results" className="space-y-6">
          {optimizationResult ? (
            <>
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      {t('totalRoutes')}
                    </CardTitle>
                    <Navigation className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{optimizationResult.routes.length}</div>
                    <p className="text-xs text-muted-foreground">
                      {t('optimizedRoutes')}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      {t('orderFulfillment')}
                    </CardTitle>
                    <CheckCircle className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">
                      {optimizationResult.statistics.orderFulfillment.toFixed(1)}%
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {optimizationResult.routes.reduce((sum, route) => sum + route.stops.length, 0)} / {orders.length} {t('orders')}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      {t('totalDistance')}
                    </CardTitle>
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {formatDistance(optimizationResult.statistics.totalDistance)}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {t('totalTravelDistance')}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      {t('totalCost')}
                    </CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {formatCurrency(optimizationResult.statistics.totalCost)}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {t('estimatedTotalCost')}
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Performance Metrics */}
              <Card>
                <CardHeader>
                  <CardTitle>{t('performanceMetrics')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {optimizationResult.performance.solutionScore.toFixed(1)}
                      </div>
                      <p className="text-sm text-gray-600">{t('solutionScore')}</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {optimizationResult.performance.solverDuration.toFixed(1)}s
                      </div>
                      <p className="text-sm text-gray-600">{t('solverDuration')}</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">
                        {optimizationResult.performance.improvementCount}
                      </div>
                      <p className="text-sm text-gray-600">{t('improvements')}</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">
                        {optimizationResult.performance.feasibilityScore.toFixed(1)}%
                      </div>
                      <p className="text-sm text-gray-600">{t('feasibilityScore')}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <Navigation className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {t('noOptimizationResults')}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {t('runOptimizationToSeeResults')}
                  </p>
                  <Button onClick={handleOptimization} disabled={isOptimizing}>
                    <Play className="h-4 w-4 mr-2" />
                    {t('startOptimization')}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          {optimizationResult ? (
            <>
              {/* KPI Charts */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>{t('routeDistribution')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={optimizationResult.routes.map((route, index) => ({
                            name: route.vehicleName,
                            value: route.stops.length,
                            color: COLORS[index % COLORS.length]
                          }))}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {optimizationResult.routes.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>{t('vehicleUtilization')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={optimizationResult.routes.map(route => ({
                        name: route.vehicleName.substring(0, 10) + '...',
                        weight: route.utilization.weight * 100,
                        volume: route.utilization.volume * 100,
                        capacity: route.utilization.capacity * 100
                      }))}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="weight" fill="#8884d8" name={t('weight')} />
                        <Bar dataKey="volume" fill="#82ca9d" name={t('volume')} />
                        <Bar dataKey="capacity" fill="#ffc658" name={t('capacity')} />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>

              {/* Optimization Report */}
              <Card>
                <CardHeader>
                  <CardTitle>{t('optimizationReport')}</CardTitle>
                </CardHeader>
                <CardContent>
                  {(() => {
                    const report = routeAccelerator.generateOptimizationReport(optimizationResult);
                    return (
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium mb-2">{t('summary')}</h4>
                          <p className="text-sm text-gray-600 whitespace-pre-line">{report.summary}</p>
                        </div>
                        
                        <div>
                          <h4 className="font-medium mb-2">{t('keyPerformanceIndicators')}</h4>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {Object.entries(report.kpis).map(([key, value]) => (
                              <div key={key} className="text-center p-3 bg-gray-50 rounded">
                                <div className="text-lg font-bold">{value}</div>
                                <div className="text-xs text-gray-600">{key}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-medium mb-2">{t('recommendations')}</h4>
                          <ul className="space-y-1">
                            {report.recommendations.map((rec, index) => (
                              <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                                <TrendingUp className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                                {rec}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    );
                  })()}
                </CardContent>
              </Card>
            </>
          ) : (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {t('noAnalyticsData')}
                  </h3>
                  <p className="text-gray-600">
                    {t('runOptimizationToSeeAnalytics')}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnhancedRouteOptimization;
