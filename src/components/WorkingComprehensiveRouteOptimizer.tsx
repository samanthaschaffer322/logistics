'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  MapPin, 
  Navigation, 
  Truck, 
  Clock, 
  DollarSign,
  Settings,
  Play,
  Target,
  BarChart3,
  TrendingUp,
  Loader2,
  Map as MapIcon,
  Brain,
  Sparkles,
  Globe,
  Star,
  Zap,
  Search,
  Plus,
  Minus,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

// Vietnam logistics locations data
const vietnamLogisticsLocations = [
  { id: 'port-catlai', name: 'Cảng Cát Lái', lat: 10.7769, lng: 106.7009, type: 'port', address: 'Cát Lái, Quận 2, TP.HCM', phone: '+84 28 3740 6666', manager: 'Nguyễn Văn Hải' },
  { id: 'depot-binhthanh', name: 'Kho Bình Thạnh', lat: 10.8014, lng: 106.7109, type: 'depot', address: 'Quận Bình Thạnh, TP.HCM', phone: '+84 28 3899 1234', manager: 'Trần Thị Lan' },
  { id: 'warehouse-binhduong', name: 'Kho Bình Dương', lat: 10.9804, lng: 106.6519, type: 'warehouse', address: 'Bình Dương, Việt Nam', phone: '+84 274 3888 999' },
  { id: 'industrial-tanhuan', name: 'KCN Tân Thuận', lat: 10.7331, lng: 106.7072, type: 'warehouse', address: 'KCN Tân Thuận, Quận 7, TP.HCM', phone: '+84 28 3771 5555' },
  { id: 'fuel-petrolimex-1', name: 'Petrolimex Xa Lộ Hà Nội', lat: 10.8231, lng: 106.6897, type: 'fuel_station', address: 'Xa Lộ Hà Nội, TP.HCM', phone: '+84 28 3896 7777' },
  { id: 'port-haiphong', name: 'Cảng Hải Phòng', lat: 20.8648, lng: 106.6881, type: 'port', address: 'Hải Phòng, Việt Nam', phone: '+84 225 3842 888' },
  { id: 'port-danang', name: 'Cảng Đà Nẵng', lat: 16.0678, lng: 108.2208, type: 'port', address: 'Đà Nẵng, Việt Nam', phone: '+84 236 3822 722' },
  { id: 'industrial-linh-trung', name: 'KCN Linh Trung', lat: 10.8708, lng: 106.8006, type: 'warehouse', address: 'KCN Linh Trung, TP. Thủ Đức, TP.HCM', phone: '+84 28 3725 4444' },
  { id: 'fuel-shell-highway', name: 'Shell Cao Tốc Long Thành', lat: 10.8156, lng: 106.8742, type: 'fuel_station', address: 'Cao Tốc Long Thành - Dầu Giây', phone: '+84 28 3123 4567' },
  { id: 'rest-area-bienhoa', name: 'Trạm Dừng Chân Biên Hòa', lat: 10.9471, lng: 106.8238, type: 'rest_area', address: 'Cao Tốc TP.HCM - Long Thành - Dầu Giây', phone: '+84 251 3123 456' },
  { id: 'customer-bigc-q1', name: 'BigC Quận 1', lat: 10.7769, lng: 106.7009, type: 'customer', address: '42 Nguyễn Thị Minh Khai, Quận 1, TP.HCM', phone: '+84 28 3829 1234', manager: 'Phạm Văn Đức' },
  { id: 'customer-coopmart-q7', name: 'Co.opmart Quận 7', lat: 10.7331, lng: 106.7072, type: 'customer', address: 'Quận 7, TP.HCM', phone: '+84 28 3771 9999', manager: 'Nguyễn Thị Hoa' },
  { id: 'depot-dongnam', name: 'Kho Đông Nam', lat: 10.8500, lng: 106.6300, type: 'depot', address: 'Khu Công Nghiệp Đông Nam, TP.HCM', phone: '+84 28 3756 8888', manager: 'Lê Văn Minh' }
];

// Sample vehicles data
const sampleVehicles = [
  {
    id: 'truck-001',
    name: 'Xe Tải Lớn 001',
    type: 'Heavy Truck',
    capacity: { weight: 10000, volume: 50 },
    costs: { perKm: 8000, perHour: 50000, fixed: 200000 },
    status: 'Available'
  },
  {
    id: 'truck-002',
    name: 'Xe Tải Trung 002',
    type: 'Medium Truck',
    capacity: { weight: 5000, volume: 25 },
    costs: { perKm: 5000, perHour: 35000, fixed: 150000 },
    status: 'Available'
  },
  {
    id: 'truck-003',
    name: 'Xe Tải Nhỏ 003',
    type: 'Light Truck',
    capacity: { weight: 2000, volume: 15 },
    costs: { perKm: 3000, perHour: 25000, fixed: 100000 },
    status: 'In Use'
  }
];

const WorkingComprehensiveRouteOptimizer: React.FC = () => {
  const [activeTab, setActiveTab] = useState('optimizer');
  const [selectedPoints, setSelectedPoints] = useState<any[]>([]);
  const [selectedVehicles, setSelectedVehicles] = useState<any[]>([]);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizationProgress, setOptimizationProgress] = useState(0);
  const [optimizationResult, setOptimizationResult] = useState<any>(null);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState('genetic');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProvince, setSelectedProvince] = useState('');

  // Initialize with sample data
  useEffect(() => {
    const initialPoints = vietnamLogisticsLocations.slice(0, 5).map((location, index) => ({
      id: location.id,
      name: location.name,
      lat: location.lat,
      lng: location.lng,
      type: location.type === 'depot' ? 'depot' : 
            location.type === 'port' ? 'pickup' : 
            location.type === 'warehouse' ? 'delivery' : 'pickup',
      priority: Math.floor(Math.random() * 10) + 1,
      address: location.address,
      timeWindow: { start: '08:00', end: '17:00' },
      serviceTime: 30 + Math.floor(Math.random() * 60),
      demand: Math.floor(Math.random() * 1000) + 100
    }));

    setSelectedPoints(initialPoints);
    setSelectedVehicles(sampleVehicles.slice(0, 2));
  }, []);

  const handleOptimizeRoutes = async () => {
    if (selectedPoints.length === 0 || selectedVehicles.length === 0) {
      alert('Vui lòng thêm điểm giao hàng và phương tiện trước khi tối ưu hóa!');
      return;
    }

    setIsOptimizing(true);
    setOptimizationProgress(0);

    // Simulate optimization process
    const progressInterval = setInterval(() => {
      setOptimizationProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 200);

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Generate mock optimization result
    const mockResult = {
      routes: [
        {
          vehicleId: 'truck-001',
          points: selectedPoints.slice(0, 3),
          totalDistance: 45.2,
          totalTime: 3.5,
          totalCost: 850000,
          efficiency: 92,
          environmental: { co2Emissions: 36.2, fuelConsumption: 15.8 }
        },
        {
          vehicleId: 'truck-002',
          points: selectedPoints.slice(2),
          totalDistance: 32.8,
          totalTime: 2.8,
          totalCost: 620000,
          efficiency: 88,
          environmental: { co2Emissions: 26.2, fuelConsumption: 11.5 }
        }
      ],
      summary: {
        totalDistance: 78.0,
        totalTime: 6.3,
        totalCost: 1470000,
        efficiency: 90
      },
      algorithm: selectedAlgorithm
    };

    clearInterval(progressInterval);
    setOptimizationProgress(100);
    setOptimizationResult(mockResult);
    setIsOptimizing(false);
  };

  const addPointFromLocation = (location: any) => {
    const newPoint = {
      id: `point-${Date.now()}`,
      name: location.name,
      lat: location.lat,
      lng: location.lng,
      type: 'delivery',
      priority: 5,
      address: location.address,
      timeWindow: { start: '08:00', end: '17:00' },
      serviceTime: 30,
      demand: 500
    };

    setSelectedPoints(prev => [...prev, newPoint]);
  };

  const removePoint = (pointId: string) => {
    setSelectedPoints(prev => prev.filter(p => p.id !== pointId));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const formatDistance = (distance: number) => `${distance.toFixed(1)} km`;
  const formatTime = (hours: number) => {
    const h = Math.floor(hours);
    const m = Math.floor((hours - h) * 60);
    return `${h}h ${m}m`;
  };

  const filteredLocations = vietnamLogisticsLocations.filter(location => {
    const matchesSearch = location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         location.address.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesProvince = !selectedProvince || location.address.includes(selectedProvince);
    return matchesSearch && matchesProvince;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 bg-clip-text text-transparent mb-2">
                🚛 Comprehensive Route Optimizer
              </h1>
              <p className="text-gray-300 text-lg">
                Advanced AI-powered route optimization for Vietnamese logistics with multiple algorithms
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                <Globe className="h-3 w-3 mr-1" />
                API Ready
              </Badge>
              <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                <Brain className="h-3 w-3 mr-1" />
                AI Enhanced
              </Badge>
              <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                <Sparkles className="h-3 w-3 mr-1" />
                Multi-Algorithm
              </Badge>
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50">
            <TabsTrigger value="optimizer" className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400">
              <Target className="h-4 w-4 mr-2" />
              Route Optimizer
            </TabsTrigger>
            <TabsTrigger value="locations" className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-400">
              <MapPin className="h-4 w-4 mr-2" />
              Vietnam Locations
            </TabsTrigger>
            <TabsTrigger value="vehicles" className="data-[state=active]:bg-green-500/20 data-[state=active]:text-green-400">
              <Truck className="h-4 w-4 mr-2" />
              Fleet Management
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-orange-500/20 data-[state=active]:text-orange-400">
              <BarChart3 className="h-4 w-4 mr-2" />
              Analytics
            </TabsTrigger>
          </TabsList>

          {/* Route Optimizer Tab */}
          <TabsContent value="optimizer" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Control Panel */}
              <div className="lg:col-span-1 space-y-6">
                <Card className="bg-gray-800/80 backdrop-blur-xl border-gray-700/50">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <Settings className="h-5 w-5 mr-2 text-blue-400" />
                      Optimization Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label className="text-gray-300">Algorithm</Label>
                      <Select value={selectedAlgorithm} onValueChange={setSelectedAlgorithm}>
                        <SelectTrigger className="bg-gray-700/50 border-gray-600/50 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-600">
                          <SelectItem value="genetic">
                            <div className="flex items-center">
                              <Brain className="h-4 w-4 mr-2 text-blue-400" />
                              Genetic Algorithm
                            </div>
                          </SelectItem>
                          <SelectItem value="ant-colony">
                            <div className="flex items-center">
                              <Target className="h-4 w-4 mr-2 text-green-400" />
                              Ant Colony Optimization
                            </div>
                          </SelectItem>
                          <SelectItem value="simulated-annealing">
                            <div className="flex items-center">
                              <Zap className="h-4 w-4 mr-2 text-yellow-400" />
                              Simulated Annealing
                            </div>
                          </SelectItem>
                          <SelectItem value="multi-objective">
                            <div className="flex items-center">
                              <Star className="h-4 w-4 mr-2 text-purple-400" />
                              Multi-Objective
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Button
                      onClick={handleOptimizeRoutes}
                      disabled={isOptimizing || selectedPoints.length === 0}
                      className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      {isOptimizing ? (
                        <div className="flex items-center space-x-2">
                          <Loader2 className="h-5 w-5 animate-spin" />
                          <span>Optimizing... {optimizationProgress}%</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <Play className="h-5 w-5" />
                          <span>Optimize Routes</span>
                        </div>
                      )}
                    </Button>

                    {isOptimizing && (
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${optimizationProgress}%` }}
                        />
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Quick Stats */}
                <Card className="bg-gray-800/80 backdrop-blur-xl border-gray-700/50">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <BarChart3 className="h-5 w-5 mr-2 text-green-400" />
                      Quick Stats
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-400">{selectedPoints.length}</div>
                        <div className="text-sm text-gray-400">Delivery Points</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-400">{selectedVehicles.length}</div>
                        <div className="text-sm text-gray-400">Vehicles</div>
                      </div>
                      {optimizationResult && (
                        <>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-green-400">
                              {formatDistance(optimizationResult.summary.totalDistance)}
                            </div>
                            <div className="text-sm text-gray-400">Total Distance</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-orange-400">
                              {formatCurrency(optimizationResult.summary.totalCost)}
                            </div>
                            <div className="text-sm text-gray-400">Total Cost</div>
                          </div>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Map and Results */}
              <div className="lg:col-span-2 space-y-6">
                {/* Interactive Map Placeholder */}
                <Card className="bg-gray-800/80 backdrop-blur-xl border-gray-700/50">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <MapIcon className="h-5 w-5 mr-2 text-blue-400" />
                      Interactive Vietnam Map
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-96 bg-gray-700/50 rounded-xl flex items-center justify-center border-2 border-dashed border-gray-600">
                      <div className="text-center">
                        <MapIcon className="h-16 w-16 text-gray-500 mx-auto mb-4" />
                        <p className="text-gray-400 text-lg">Interactive Leaflet Map</p>
                        <p className="text-gray-500 text-sm">Vietnam logistics locations with optimized routes</p>
                        <div className="mt-4 flex items-center justify-center space-x-4">
                          <Badge className="bg-blue-500/20 text-blue-400">
                            <MapPin className="h-3 w-3 mr-1" />
                            {selectedPoints.length} Points
                          </Badge>
                          <Badge className="bg-green-500/20 text-green-400">
                            <Navigation className="h-3 w-3 mr-1" />
                            {optimizationResult?.routes.length || 0} Routes
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Optimization Results */}
                {optimizationResult && (
                  <Card className="bg-gray-800/80 backdrop-blur-xl border-gray-700/50">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center">
                        <TrendingUp className="h-5 w-5 mr-2 text-green-400" />
                        Optimization Results
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                        <div className="bg-blue-500/10 rounded-xl p-4 border border-blue-500/20">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-blue-400 text-sm font-medium">Total Distance</p>
                              <p className="text-white text-xl font-bold">
                                {formatDistance(optimizationResult.summary.totalDistance)}
                              </p>
                            </div>
                            <Navigation className="h-8 w-8 text-blue-400" />
                          </div>
                        </div>

                        <div className="bg-green-500/10 rounded-xl p-4 border border-green-500/20">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-green-400 text-sm font-medium">Total Cost</p>
                              <p className="text-white text-xl font-bold">
                                {formatCurrency(optimizationResult.summary.totalCost)}
                              </p>
                            </div>
                            <DollarSign className="h-8 w-8 text-green-400" />
                          </div>
                        </div>

                        <div className="bg-purple-500/10 rounded-xl p-4 border border-purple-500/20">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-purple-400 text-sm font-medium">Total Time</p>
                              <p className="text-white text-xl font-bold">
                                {formatTime(optimizationResult.summary.totalTime)}
                              </p>
                            </div>
                            <Clock className="h-8 w-8 text-purple-400" />
                          </div>
                        </div>

                        <div className="bg-orange-500/10 rounded-xl p-4 border border-orange-500/20">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-orange-400 text-sm font-medium">Efficiency</p>
                              <p className="text-white text-xl font-bold">
                                {optimizationResult.summary.efficiency.toFixed(1)}%
                              </p>
                            </div>
                            <Target className="h-8 w-8 text-orange-400" />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h4 className="text-white font-semibold">Route Details</h4>
                        {optimizationResult.routes.map((route: any, index: number) => (
                          <div key={route.vehicleId} className="bg-gray-700/50 rounded-xl p-4">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                                  <span className="text-white text-sm font-bold">{index + 1}</span>
                                </div>
                                <div>
                                  <p className="text-white font-medium">{route.vehicleId}</p>
                                  <p className="text-gray-400 text-sm">{route.points.length} stops</p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-white font-medium">{formatCurrency(route.totalCost)}</p>
                                <p className="text-gray-400 text-sm">{formatDistance(route.totalDistance)}</p>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-3 gap-4 text-sm">
                              <div>
                                <p className="text-gray-400">CO₂ Emissions</p>
                                <p className="text-red-400 font-medium">{route.environmental.co2Emissions.toFixed(1)} kg</p>
                              </div>
                              <div>
                                <p className="text-gray-400">Fuel Consumption</p>
                                <p className="text-yellow-400 font-medium">{route.environmental.fuelConsumption.toFixed(1)} L</p>
                              </div>
                              <div>
                                <p className="text-gray-400">Efficiency Score</p>
                                <p className="text-green-400 font-medium">{route.efficiency.toFixed(1)}%</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Continue with other tabs in next part... */}
        </Tabs>
      </div>
    </div>
  );
};

export default WorkingComprehensiveRouteOptimizer;
