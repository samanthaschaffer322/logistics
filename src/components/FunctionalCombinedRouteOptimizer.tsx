'use client';

import React, { useState, useEffect, useCallback } from 'react';
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
  Fuel, Leaf, Route, Activity, BarChart3, Plus, Trash2,
  Edit, Save, X, RefreshCw, Eye, EyeOff
} from 'lucide-react';
import FunctionalRouteOptimizer, { 
  Location, Vehicle, OptimizationResult, vietnamCities
} from '@/lib/functionalRouteOptimizer';
import { useLanguage } from '@/contexts/LanguageContext';

const FunctionalCombinedRouteOptimizer: React.FC = () => {
  const { language, t } = useLanguage();
  const [optimizer] = useState(new FunctionalRouteOptimizer());
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizationProgress, setOptimizationProgress] = useState(0);
  const [progressMessage, setProgressMessage] = useState('');
  const [optimizationResult, setOptimizationResult] = useState<OptimizationResult | null>(null);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [activeTab, setActiveTab] = useState('setup');
  const [showMap, setShowMap] = useState(true);
  const [editingVehicle, setEditingVehicle] = useState<string | null>(null);
  const [editingLocation, setEditingLocation] = useState<string | null>(null);

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

  useEffect(() => {
    initializeData();
    setupOptimizer();
  }, []);

  const initializeData = () => {
    console.log('🔄 Initializing sample data...');
    const sampleVehicles = optimizer.generateSampleVehicles();
    const sampleLocations = optimizer.generateSampleLocations();
    
    setVehicles(sampleVehicles);
    setLocations(sampleLocations);
    
    console.log(`✅ Initialized ${sampleVehicles.length} vehicles and ${sampleLocations.length} locations`);
  };

  const setupOptimizer = () => {
    optimizer.setProgressCallback((progress: number, message: string) => {
      setOptimizationProgress(progress);
      setProgressMessage(message);
    });
  };

  const handleOptimization = useCallback(async () => {
    if (vehicles.length === 0 || locations.length === 0) {
      alert('Please add vehicles and locations before optimizing');
      return;
    }

    setIsOptimizing(true);
    setOptimizationProgress(0);
    setProgressMessage('Starting optimization...');

    try {
      console.log('🚀 Starting route optimization...');
      const result = await optimizer.optimizeRoutes(vehicles, locations);
      
      setOptimizationResult(result);
      setActiveTab('results');
      
      console.log('✅ Optimization completed successfully:', result);
    } catch (error) {
      console.error('❌ Optimization failed:', error);
      alert(`Optimization failed: ${error.message}`);
    } finally {
      setIsOptimizing(false);
      setOptimizationProgress(0);
      setProgressMessage('');
    }
  }, [vehicles, locations, optimizer]);

  const addVehicle = () => {
    const newVehicle: Vehicle = {
      id: `vehicle_${Date.now()}`,
      name: `New Vehicle ${vehicles.length + 1}`,
      capacity: 2000,
      maxDistance: 400,
      maxTime: 480,
      costPerKm: 0.5,
      costPerHour: 10,
      startLocation: {
        id: `depot_${Date.now()}`,
        name: 'New Depot',
        latitude: vietnamCities[0].latitude,
        longitude: vietnamCities[0].longitude,
        address: vietnamCities[0].address,
        type: 'depot',
        serviceTime: 0,
        demand: 0,
        priority: 10
      },
      skills: ['standard_delivery'],
      currentLoad: 0,
      isActive: true
    };
    
    setVehicles([...vehicles, newVehicle]);
    console.log('➕ Added new vehicle:', newVehicle.name);
  };

  const addLocation = () => {
    const randomCity = vietnamCities[Math.floor(Math.random() * vietnamCities.length)];
    const newLocation: Location = {
      id: `location_${Date.now()}`,
      name: `Customer ${locations.length + 1}`,
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
    console.log('➕ Added new location:', newLocation.name);
  };

  const removeVehicle = (vehicleId: string) => {
    setVehicles(vehicles.filter(v => v.id !== vehicleId));
    console.log('🗑️ Removed vehicle:', vehicleId);
  };

  const removeLocation = (locationId: string) => {
    setLocations(locations.filter(l => l.id !== locationId));
    console.log('🗑️ Removed location:', locationId);
  };

  const updateVehicle = (vehicleId: string, updates: Partial<Vehicle>) => {
    setVehicles(vehicles.map(v => v.id === vehicleId ? { ...v, ...updates } : v));
    setEditingVehicle(null);
    console.log('✏️ Updated vehicle:', vehicleId);
  };

  const updateLocation = (locationId: string, updates: Partial<Location>) => {
    setLocations(locations.map(l => l.id === locationId ? { ...l, ...updates } : l));
    setEditingLocation(null);
    console.log('✏️ Updated location:', locationId);
  };

  const resetData = () => {
    initializeData();
    setOptimizationResult(null);
    console.log('🔄 Reset all data');
  };

  const exportResults = () => {
    if (!optimizationResult) return;
    
    const data = {
      timestamp: new Date().toISOString(),
      vehicles,
      locations,
      result: optimizationResult
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `route-optimization-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    console.log('💾 Exported optimization results');
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
              Enhanced Route Optimizer
            </h1>
            <p className="text-blue-200 mt-2">
              Functional multi-algorithm optimization with Vietnam map integration
            </p>
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={handleOptimization} 
              disabled={isOptimizing || vehicles.length === 0 || locations.length === 0}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <Play className="h-4 w-4 mr-2" />
              {isOptimizing ? 'Optimizing...' : 'Optimize Routes'}
            </Button>
            <Button 
              variant="outline" 
              onClick={resetData}
              className="bg-white/20 backdrop-blur-sm text-white border-white/30 hover:bg-white/30"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Reset
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setShowMap(!showMap)}
              className="bg-white/20 backdrop-blur-sm text-white border-white/30 hover:bg-white/30"
            >
              {showMap ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
              {showMap ? 'Hide Map' : 'Show Map'}
            </Button>
          </div>
        </div>

        {/* Optimization Progress */}
        {isOptimizing && (
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-white">Optimization Progress</span>
                  <span className="text-sm text-white/70">{Math.round(optimizationProgress)}%</span>
                </div>
                <Progress value={optimizationProgress} className="w-full" />
                <p className="text-sm text-white/80 flex items-center gap-2">
                  <Activity className="h-4 w-4 animate-spin" />
                  {progressMessage}
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Vehicles</CardTitle>
              <Truck className="h-4 w-4 text-white/60" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{vehicles.length}</div>
              <p className="text-xs text-white/60">Active vehicles</p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Locations</CardTitle>
              <MapPin className="h-4 w-4 text-white/60" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{locations.length}</div>
              <p className="text-xs text-white/60">Delivery points</p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Total Capacity</CardTitle>
              <Package className="h-4 w-4 text-white/60" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {vehicles.reduce((sum, v) => sum + v.capacity, 0).toLocaleString()} kg
              </div>
              <p className="text-xs text-white/60">Fleet capacity</p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Total Demand</CardTitle>
              <Target className="h-4 w-4 text-white/60" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {locations.reduce((sum, l) => sum + l.demand, 0).toLocaleString()} kg
              </div>
              <p className="text-xs text-white/60">Customer demand</p>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 bg-white/10 backdrop-blur-sm border-white/20">
            <TabsTrigger value="setup" className="text-white data-[state=active]:bg-white/20 data-[state=active]:text-white">Setup</TabsTrigger>
            <TabsTrigger value="vehicles" className="text-white data-[state=active]:bg-white/20 data-[state=active]:text-white">Vehicles</TabsTrigger>
            <TabsTrigger value="locations" className="text-white data-[state=active]:bg-white/20 data-[state=active]:text-white">Locations</TabsTrigger>
            <TabsTrigger value="results" className="text-white data-[state=active]:bg-white/20 data-[state=active]:text-white">Results</TabsTrigger>
            <TabsTrigger value="map" className="text-white data-[state=active]:bg-white/20 data-[state=active]:text-white">Vietnam Map</TabsTrigger>
          </TabsList>
          {/* Setup Tab */}
          <TabsContent value="setup" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <CardTitle className="text-white">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Button onClick={addVehicle} className="h-20 flex-col bg-blue-600 hover:bg-blue-700">
                      <Truck className="h-6 w-6 mb-2" />
                      Add Vehicle
                    </Button>
                    <Button onClick={addLocation} className="h-20 flex-col bg-green-600 hover:bg-green-700">
                      <MapPin className="h-6 w-6 mb-2" />
                      Add Location
                    </Button>
                    <Button onClick={resetData} variant="outline" className="h-20 flex-col bg-white/10 border-white/30 text-white hover:bg-white/20">
                      <RefreshCw className="h-6 w-6 mb-2" />
                      Reset Data
                    </Button>
                    <Button onClick={exportResults} disabled={!optimizationResult} variant="outline" className="h-20 flex-col bg-white/10 border-white/30 text-white hover:bg-white/20">
                      <Download className="h-6 w-6 mb-2" />
                      Export Results
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <CardTitle className="text-white">Optimization Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-white/80">Ready to Optimize</span>
                    <Badge className={vehicles.length > 0 && locations.length > 0 ? "bg-green-500/20 text-green-300" : "bg-red-500/20 text-red-300"}>
                      {vehicles.length > 0 && locations.length > 0 ? "Ready" : "Not Ready"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/80">Algorithm</span>
                    <Badge className="bg-blue-500/20 text-blue-300">
                      Multi-Algorithm TSP
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/80">Vietnam Integration</span>
                    <Badge className="bg-purple-500/20 text-purple-300">
                      Active
                    </Badge>
                  </div>
                  {optimizationResult && (
                    <div className="flex items-center justify-between">
                      <span className="text-white/80">Last Optimization</span>
                      <Badge className="bg-green-500/20 text-green-300">
                        {optimizationResult.routes.length} routes
                      </Badge>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {optimizationResult && (
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <CardTitle className="text-white">Latest Results Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-400">
                        {optimizationResult.routes.length}
                      </div>
                      <p className="text-sm text-white/60">Routes</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-400">
                        {formatDistance(optimizationResult.totalDistance * 1000)}
                      </div>
                      <p className="text-sm text-white/60">Distance</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-yellow-400">
                        {formatCurrency(optimizationResult.totalCost)}
                      </div>
                      <p className="text-sm text-white/60">Cost</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-400">
                        {(optimizationResult.overallEfficiency * 100).toFixed(1)}%
                      </div>
                      <p className="text-sm text-white/60">Efficiency</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Vehicles Tab */}
          <TabsContent value="vehicles" className="space-y-6">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-white">Vehicle Fleet Management</CardTitle>
                <Button onClick={addVehicle} className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Vehicle
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {vehicles.map((vehicle) => (
                    <Card key={vehicle.id} className="p-4 bg-white/5 border-white/10">
                      {editingVehicle === vehicle.id ? (
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label className="text-white">Vehicle Name</Label>
                              <Input
                                value={vehicle.name}
                                onChange={(e) => updateVehicle(vehicle.id, { name: e.target.value })}
                                className="bg-white/20 border-white/30 text-white"
                              />
                            </div>
                            <div>
                              <Label className="text-white">Capacity (kg)</Label>
                              <Input
                                type="number"
                                value={vehicle.capacity}
                                onChange={(e) => updateVehicle(vehicle.id, { capacity: parseInt(e.target.value) })}
                                className="bg-white/20 border-white/30 text-white"
                              />
                            </div>
                            <div>
                              <Label className="text-white">Cost per km ($)</Label>
                              <Input
                                type="number"
                                step="0.1"
                                value={vehicle.costPerKm}
                                onChange={(e) => updateVehicle(vehicle.id, { costPerKm: parseFloat(e.target.value) })}
                                className="bg-white/20 border-white/30 text-white"
                              />
                            </div>
                            <div>
                              <Label className="text-white">Cost per hour ($)</Label>
                              <Input
                                type="number"
                                step="0.1"
                                value={vehicle.costPerHour}
                                onChange={(e) => updateVehicle(vehicle.id, { costPerHour: parseFloat(e.target.value) })}
                                className="bg-white/20 border-white/30 text-white"
                              />
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button onClick={() => setEditingVehicle(null)} size="sm" className="bg-green-600 hover:bg-green-700">
                              <Save className="h-4 w-4 mr-2" />
                              Save
                            </Button>
                            <Button onClick={() => setEditingVehicle(null)} variant="outline" size="sm" className="bg-white/10 border-white/30 text-white hover:bg-white/20">
                              <X className="h-4 w-4 mr-2" />
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between">
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 flex-1">
                            <div>
                              <Label className="text-sm font-medium text-white">Vehicle Info</Label>
                              <p className="text-sm text-white/90">{vehicle.name}</p>
                              <p className="text-xs text-white/60">{vehicle.id}</p>
                            </div>
                            <div>
                              <Label className="text-sm font-medium text-white">Capacity & Limits</Label>
                              <div className="text-sm space-y-1 text-white/80">
                                <p>Capacity: {vehicle.capacity.toLocaleString()} kg</p>
                                <p>Max Distance: {vehicle.maxDistance} km</p>
                                <p>Max Time: {formatTime(vehicle.maxTime)}</p>
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
                              <Label className="text-sm font-medium text-white">Status</Label>
                              <div className="flex flex-wrap gap-1 mt-1">
                                <Badge className={vehicle.isActive ? "bg-green-500/20 text-green-300" : "bg-red-500/20 text-red-300"}>
                                  {vehicle.isActive ? "Active" : "Inactive"}
                                </Badge>
                                <Badge className="bg-blue-500/20 text-blue-300">
                                  {vehicle.currentLoad}/{vehicle.capacity} kg
                                </Badge>
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2 ml-4">
                            <Button onClick={() => setEditingVehicle(vehicle.id)} size="sm" variant="outline" className="bg-white/10 border-white/30 text-white hover:bg-white/20">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button onClick={() => removeVehicle(vehicle.id)} size="sm" variant="outline" className="bg-red-500/20 border-red-500/30 text-red-300 hover:bg-red-500/30">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </Card>
                  ))}
                  {vehicles.length === 0 && (
                    <div className="text-center py-8">
                      <Truck className="h-12 w-12 text-white/40 mx-auto mb-4" />
                      <p className="text-white/60 mb-4">No vehicles added yet</p>
                      <Button onClick={addVehicle} className="bg-blue-600 hover:bg-blue-700">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Your First Vehicle
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Locations Tab */}
          <TabsContent value="locations" className="space-y-6">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-white">Location Management</CardTitle>
                <Button onClick={addLocation} className="bg-green-600 hover:bg-green-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Location
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {locations.map((location) => (
                    <Card key={location.id} className="p-4 bg-white/5 border-white/10">
                      {editingLocation === location.id ? (
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label className="text-white">Location Name</Label>
                              <Input
                                value={location.name}
                                onChange={(e) => updateLocation(location.id, { name: e.target.value })}
                                className="bg-white/20 border-white/30 text-white"
                              />
                            </div>
                            <div>
                              <Label className="text-white">Address</Label>
                              <Input
                                value={location.address}
                                onChange={(e) => updateLocation(location.id, { address: e.target.value })}
                                className="bg-white/20 border-white/30 text-white"
                              />
                            </div>
                            <div>
                              <Label className="text-white">Demand (kg)</Label>
                              <Input
                                type="number"
                                value={location.demand}
                                onChange={(e) => updateLocation(location.id, { demand: parseInt(e.target.value) })}
                                className="bg-white/20 border-white/30 text-white"
                              />
                            </div>
                            <div>
                              <Label className="text-white">Priority (1-10)</Label>
                              <Input
                                type="number"
                                min="1"
                                max="10"
                                value={location.priority}
                                onChange={(e) => updateLocation(location.id, { priority: parseInt(e.target.value) })}
                                className="bg-white/20 border-white/30 text-white"
                              />
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button onClick={() => setEditingLocation(null)} size="sm" className="bg-green-600 hover:bg-green-700">
                              <Save className="h-4 w-4 mr-2" />
                              Save
                            </Button>
                            <Button onClick={() => setEditingLocation(null)} variant="outline" size="sm" className="bg-white/10 border-white/30 text-white hover:bg-white/20">
                              <X className="h-4 w-4 mr-2" />
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between">
                          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 flex-1">
                            <div>
                              <Label className="text-sm font-medium text-white">Location Info</Label>
                              <p className="text-sm font-medium text-white/90">{location.name}</p>
                              <p className="text-xs text-white/60">{location.id}</p>
                              <Badge 
                                className={
                                  location.priority >= 8 ? "bg-red-500/20 text-red-300" :
                                  location.priority >= 6 ? "bg-yellow-500/20 text-yellow-300" :
                                  "bg-green-500/20 text-green-300"
                                }
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
                                <p>Service: {formatTime(location.serviceTime)}</p>
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
                              <Badge variant="outline" className="text-white border-white/30">
                                {location.type}
                              </Badge>
                            </div>
                          </div>
                          <div className="flex gap-2 ml-4">
                            <Button onClick={() => setEditingLocation(location.id)} size="sm" variant="outline" className="bg-white/10 border-white/30 text-white hover:bg-white/20">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button onClick={() => removeLocation(location.id)} size="sm" variant="outline" className="bg-red-500/20 border-red-500/30 text-red-300 hover:bg-red-500/30">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </Card>
                  ))}
                  {locations.length === 0 && (
                    <div className="text-center py-8">
                      <MapPin className="h-12 w-12 text-white/40 mx-auto mb-4" />
                      <p className="text-white/60 mb-4">No locations added yet</p>
                      <Button onClick={addLocation} className="bg-green-600 hover:bg-green-700">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Your First Location
                      </Button>
                    </div>
                  )}
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
                  <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-white">Total Routes</CardTitle>
                      <Navigation className="h-4 w-4 text-white/60" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-white">{optimizationResult.routes.length}</div>
                      <p className="text-xs text-white/60">Optimized routes</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-white">Total Distance</CardTitle>
                      <MapPin className="h-4 w-4 text-white/60" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-white">
                        {formatDistance(optimizationResult.totalDistance * 1000)}
                      </div>
                      <p className="text-xs text-white/60">Total travel distance</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-white">Total Cost</CardTitle>
                      <DollarSign className="h-4 w-4 text-white/60" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-white">
                        {formatCurrency(optimizationResult.totalCost)}
                      </div>
                      <p className="text-xs text-white/60">Estimated total cost</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-white">Efficiency</CardTitle>
                      <Target className="h-4 w-4 text-white/60" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-green-400">
                        {(optimizationResult.overallEfficiency * 100).toFixed(1)}%
                      </div>
                      <p className="text-xs text-white/60">Overall efficiency</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Performance Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                    <CardHeader>
                      <CardTitle className="text-white">Algorithm Performance</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-white/80">Execution Time</span>
                          <span className="text-sm font-medium text-white">
                            {optimizationResult.algorithmPerformance.executionTime}ms
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-white/80">Solution Quality</span>
                          <span className="text-sm font-medium text-green-400">
                            {(optimizationResult.algorithmPerformance.solutionQuality * 100).toFixed(1)}%
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-white/80">Convergence Rate</span>
                          <span className="text-sm font-medium text-blue-400">
                            {(optimizationResult.algorithmPerformance.convergenceRate * 100).toFixed(1)}%
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-white/80">Iterations</span>
                          <span className="text-sm font-medium text-white">
                            {optimizationResult.algorithmPerformance.iterationsCount}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                    <CardHeader>
                      <CardTitle className="text-white">Environmental Impact</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-white/80">Fuel Consumption</span>
                          <span className="text-sm font-medium text-white">
                            {optimizationResult.environmentalImpact.totalFuelConsumption.toFixed(1)}L
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-white/80">Carbon Emission</span>
                          <span className="text-sm font-medium text-orange-400">
                            {optimizationResult.environmentalImpact.totalCarbonEmission.toFixed(1)}kg CO₂
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-white/80">Green Score</span>
                          <span className="text-sm font-medium text-green-400">
                            {(optimizationResult.environmentalImpact.greenScore * 100).toFixed(1)}%
                          </span>
                        </div>
                      </div>
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

                {/* Route Details */}
                <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white">Detailed Route Analysis</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {optimizationResult.routes.map((route, index) => (
                        <Card key={route.vehicleId} className="p-4 bg-white/5 border-white/10">
                          <div className="space-y-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-semibold text-white flex items-center gap-2">
                                  <Truck className="h-4 w-4" />
                                  {route.vehicleName}
                                </h4>
                                <p className="text-sm text-white/60">{route.vehicleId}</p>
                              </div>
                              <div className="text-right">
                                <Badge className="mb-2 bg-blue-500/20 text-blue-300">
                                  {route.locations.length} stops
                                </Badge>
                                <div className="text-sm space-y-1 text-white/80">
                                  <p>Distance: {formatDistance(route.totalDistance * 1000)}</p>
                                  <p>Time: {formatTime(route.totalTime)}</p>
                                  <p>Cost: {formatCurrency(route.totalCost)}</p>
                                </div>
                              </div>
                            </div>

                            {/* Performance Metrics */}
                            <div className="grid grid-cols-3 gap-4">
                              <div>
                                <div className="flex justify-between text-sm mb-1">
                                  <span className="text-white/80">Utilization</span>
                                  <span className="text-white">{(route.utilization * 100).toFixed(1)}%</span>
                                </div>
                                <Progress value={route.utilization * 100} className="h-2" />
                              </div>
                              <div>
                                <div className="flex justify-between text-sm mb-1">
                                  <span className="text-white/80">Efficiency</span>
                                  <span className="text-white">{(route.efficiency * 100).toFixed(1)}%</span>
                                </div>
                                <Progress value={route.efficiency * 100} className="h-2" />
                              </div>
                              <div>
                                <div className="flex justify-between text-sm mb-1">
                                  <span className="text-white/80">Satisfaction</span>
                                  <span className="text-white">{(route.customerSatisfaction * 100).toFixed(1)}%</span>
                                </div>
                                <Progress value={route.customerSatisfaction * 100} className="h-2" />
                              </div>
                            </div>

                            {/* Route Stops */}
                            <div>
                              <h5 className="font-medium mb-2 text-white flex items-center gap-2">
                                <MapPin className="h-4 w-4" />
                                Route Stops
                              </h5>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-32 overflow-y-auto">
                                {route.locations.map((location, stopIndex) => (
                                  <div key={location.id} className="flex items-center justify-between p-2 bg-white/5 rounded">
                                    <div className="flex items-center gap-2">
                                      <Badge variant="outline" className="text-xs text-white border-white/30">
                                        {stopIndex + 1}
                                      </Badge>
                                      <div>
                                        <p className="text-sm font-medium text-white">{location.name}</p>
                                        <p className="text-xs text-white/60">{location.type}</p>
                                      </div>
                                    </div>
                                    <div className="text-right text-xs text-white/80">
                                      <p>Demand: {location.demand}kg</p>
                                      <p>Priority: {location.priority}</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Route Instructions */}
                            <div>
                              <h5 className="font-medium mb-2 text-white flex items-center gap-2">
                                <Navigation className="h-4 w-4" />
                                Turn-by-Turn Instructions
                              </h5>
                              <div className="space-y-1 max-h-24 overflow-y-auto">
                                {route.instructions.slice(0, 3).map((instruction, idx) => (
                                  <div key={idx} className="text-xs text-white/70 p-1 bg-white/5 rounded">
                                    {instruction.step}. {instruction.instruction} ({formatDistance(instruction.distance * 1000)}, {formatTime(instruction.time)})
                                  </div>
                                ))}
                                {route.instructions.length > 3 && (
                                  <div className="text-xs text-white/50 text-center">
                                    ... and {route.instructions.length - 3} more steps
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </Card>
                      ))}
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
                    <Button 
                      onClick={handleOptimization} 
                      disabled={isOptimizing || vehicles.length === 0 || locations.length === 0} 
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Start Optimization
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
                <div className="h-96 bg-white/5 rounded-lg flex items-center justify-center border-2 border-dashed border-white/20">
                  <div className="text-center">
                    <Map className="h-16 w-16 text-white/40 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-white mb-2">
                      Interactive Vietnam Map
                    </h3>
                    <p className="text-white/60 mb-4">
                      Visualize optimized routes on Vietnam map with real-time data
                    </p>
                    {optimizationResult ? (
                      <div className="space-y-2">
                        <p className="text-sm text-white/80">
                          Showing {optimizationResult.routes.length} optimized routes
                        </p>
                        <div className="flex gap-2 justify-center">
                          <Button variant="outline" className="bg-white/10 border-white/30 text-white hover:bg-white/20">
                            <MapPin className="h-4 w-4 mr-2" />
                            Show All Locations ({locations.length})
                          </Button>
                          <Button variant="outline" className="bg-white/10 border-white/30 text-white hover:bg-white/20">
                            <Navigation className="h-4 w-4 mr-2" />
                            Show Routes ({optimizationResult.routes.length})
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <p className="text-sm text-white/80">
                          Run optimization to see routes on map
                        </p>
                        <Button 
                          onClick={handleOptimization} 
                          disabled={isOptimizing || vehicles.length === 0 || locations.length === 0}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          <Play className="h-4 w-4 mr-2" />
                          Optimize Routes
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Map Legend */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <CardTitle className="text-white text-sm">Map Legend</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-white text-sm">Depot/Warehouse</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-white text-sm">Customer Location</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <span className="text-white text-sm">High Priority</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-1 bg-purple-500"></div>
                    <span className="text-white text-sm">Optimized Route</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <CardTitle className="text-white text-sm">Vietnam Cities</CardTitle>
                </CardHeader>
                <CardContent className="space-y-1 max-h-32 overflow-y-auto">
                  {vietnamCities.slice(0, 6).map((city) => (
                    <div key={city.id} className="text-xs text-white/70">
                      {city.name}
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <CardTitle className="text-white text-sm">Route Statistics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {optimizationResult ? (
                    <>
                      <div className="flex justify-between text-xs">
                        <span className="text-white/70">Total Routes:</span>
                        <span className="text-white">{optimizationResult.routes.length}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-white/70">Avg Efficiency:</span>
                        <span className="text-white">{(optimizationResult.overallEfficiency * 100).toFixed(1)}%</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-white/70">Total Distance:</span>
                        <span className="text-white">{formatDistance(optimizationResult.totalDistance * 1000)}</span>
                      </div>
                    </>
                  ) : (
                    <div className="text-xs text-white/50">
                      No optimization data available
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default FunctionalCombinedRouteOptimizer;
