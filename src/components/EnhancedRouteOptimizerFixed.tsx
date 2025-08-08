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
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  MapPin, 
  Truck, 
  Brain, 
  Play,
  Pause,
  RotateCcw,
  AlertTriangle,
  Plus,
  Trash2,
  Settings,
  BarChart3,
  Clock,
  DollarSign,
  TrendingUp
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

const EnhancedRouteOptimizerFixed: React.FC<EnhancedRouteOptimizerProps> = ({
  className,
  onOptimizationComplete,
  onError
}) => {
  const { t, language } = useLanguage();
  
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
          name: language === 'vi' ? 'Trung tâm Hà Nội' : 'Hanoi Central',
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
          name: language === 'vi' ? 'Trung tâm TP.HCM' : 'Ho Chi Minh City Hub',
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
          name: language === 'vi' ? 'Phân phối Đà Nẵng' : 'Da Nang Distribution',
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
          name: language === 'vi' ? 'Xe tải Alpha' : 'Truck Alpha',
          capacity: 1000,
          maxDistance: 500,
          costPerKm: 2.5,
          startLocation: {
            id: 'depot1',
            name: language === 'vi' ? 'Kho chính Hà Nội' : 'Main Depot Hanoi',
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
          name: language === 'vi' ? 'Xe van Beta' : 'Van Beta',
          capacity: 500,
          maxDistance: 300,
          costPerKm: 1.8,
          startLocation: {
            id: 'depot2',
            name: language === 'vi' ? 'Kho phụ TP.HCM' : 'Secondary Depot HCMC',
            address: 'Quận 7, TP.HCM',
            lat: 10.7769,
            lng: 106.7009,
            priority: 10
          },
          availableFrom: '07:00',
          availableTo: '19:00'
        }
      ]);
    }
  }, [language]);

  // Optimization function
  const runOptimization = useCallback(async () => {
    if (!optimizer || locations.length === 0 || vehicles.length === 0) {
      const error = language === 'vi' 
        ? 'Vui lòng thêm địa điểm và phương tiện trước khi tối ưu hóa'
        : 'Please add locations and vehicles before optimizing';
      setOptimizationState(prev => ({ ...prev, error }));
      onError?.(error);
      return;
    }

    setOptimizationState({
      isOptimizing: true,
      progress: 0,
      currentStep: language === 'vi' ? 'Đang khởi tạo tối ưu hóa...' : 'Initializing optimization...',
      error: undefined
    });

    try {
      // Simulate progress updates
      const progressSteps = language === 'vi' ? [
        { progress: 10, step: 'Đang xác thực dữ liệu đầu vào...' },
        { progress: 25, step: 'Đang tính toán ma trận khoảng cách...' },
        { progress: 40, step: 'Đang chạy thuật toán di truyền...' },
        { progress: 60, step: 'Đang áp dụng luyện kim mô phỏng...' },
        { progress: 75, step: 'Đang tối ưu hóa với AI...' },
        { progress: 90, step: 'Đang tạo tuyến đường cuối cùng...' },
        { progress: 100, step: 'Hoàn thành tối ưu hóa!' }
      ] : [
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
        currentStep: language === 'vi' ? 'Hoàn thành' : 'Complete',
        result
      });

      onOptimizationComplete?.(result);
      setActiveTab('results'); // Switch to results tab

    } catch (error) {
      const errorMessage = language === 'vi' 
        ? `Tối ưu hóa thất bại: ${error.message}`
        : `Optimization failed: ${error.message}`;
      setOptimizationState({
        isOptimizing: false,
        progress: 0,
        currentStep: language === 'vi' ? 'Lỗi' : 'Error',
        error: errorMessage
      });
      onError?.(errorMessage);
    }
  }, [optimizer, locations, vehicles, onOptimizationComplete, onError, language]);

  // Location management functions
  const addLocation = useCallback(() => {
    const newLocation: Location = {
      id: `loc${locations.length + 1}`,
      name: language === 'vi' ? `Địa điểm ${locations.length + 1}` : `Location ${locations.length + 1}`,
      address: '',
      lat: 21.0285 + (Math.random() - 0.5) * 0.1,
      lng: 105.8542 + (Math.random() - 0.5) * 0.1,
      priority: 5,
      timeWindow: { start: '08:00', end: '18:00' },
      serviceTime: 30,
      demand: 100
    };
    setLocations(prev => [...prev, newLocation]);
  }, [locations.length, language]);

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
      name: language === 'vi' ? `Phương tiện ${vehicles.length + 1}` : `Vehicle ${vehicles.length + 1}`,
      capacity: 500,
      maxDistance: 300,
      costPerKm: 2.0,
      startLocation: {
        id: 'depot',
        name: language === 'vi' ? 'Kho' : 'Depot',
        address: language === 'vi' ? 'Địa chỉ kho' : 'Depot Address',
        lat: 21.0285,
        lng: 105.8542,
        priority: 10
      },
      availableFrom: '08:00',
      availableTo: '18:00'
    };
    setVehicles(prev => [...prev, newVehicle]);
  }, [vehicles.length, language]);

  const removeVehicle = useCallback((id: string) => {
    setVehicles(prev => prev.filter(vehicle => vehicle.id !== id));
  }, []);

  const updateVehicle = useCallback((id: string, updates: Partial<Vehicle>) => {
    setVehicles(prev => prev.map(vehicle => 
      vehicle.id === id ? { ...vehicle, ...updates } : vehicle
    ));
  }, []);

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Brain className="h-8 w-8 text-blue-600" />
            <span className="text-gray-800">{t('route.enhancedTitle')}</span>
            <Badge variant="secondary" className="ml-2 bg-blue-100 text-blue-800">
              {config.preferences.primaryAlgorithm.toUpperCase()}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 items-center">
            <Button 
              onClick={runOptimization}
              disabled={optimizationState.isOptimizing || locations.length === 0 || vehicles.length === 0}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 text-lg"
              size="lg"
            >
              {optimizationState.isOptimizing ? (
                <>
                  <Pause className="h-5 w-5" />
                  {language === 'vi' ? 'Đang tối ưu hóa...' : 'Optimizing...'}
                </>
              ) : (
                <>
                  <Play className="h-5 w-5" />
                  {t('route.optimize')}
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
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              {language === 'vi' ? 'Đặt lại' : 'Reset'}
            </Button>
            
            <div className="flex items-center gap-4 text-lg">
              <div className="flex items-center gap-2 text-blue-700 bg-blue-100 px-3 py-2 rounded-lg">
                <MapPin className="h-5 w-5" />
                <span className="font-semibold">{locations.length}</span>
                <span>{language === 'vi' ? 'địa điểm' : 'locations'}</span>
              </div>
              
              <div className="flex items-center gap-2 text-green-700 bg-green-100 px-3 py-2 rounded-lg">
                <Truck className="h-5 w-5" />
                <span className="font-semibold">{vehicles.length}</span>
                <span>{language === 'vi' ? 'phương tiện' : 'vehicles'}</span>
              </div>
            </div>
          </div>
          
          {optimizationState.isOptimizing && (
            <div className="mt-6 space-y-3">
              <div className="flex justify-between text-lg font-medium text-gray-700">
                <span>{optimizationState.currentStep}</span>
                <span>{optimizationState.progress}%</span>
              </div>
              <Progress value={optimizationState.progress} className="w-full h-3" />
            </div>
          )}
          
          {optimizationState.error && (
            <Alert className="mt-4 border-red-200 bg-red-50" variant="destructive">
              <AlertTriangle className="h-5 w-5" />
              <AlertDescription className="text-red-800 text-lg">
                {optimizationState.error}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5 h-12 bg-gray-100">
          <TabsTrigger value="locations" className="text-lg font-medium">
            {language === 'vi' ? 'Địa điểm' : 'Locations'}
          </TabsTrigger>
          <TabsTrigger value="vehicles" className="text-lg font-medium">
            {language === 'vi' ? 'Phương tiện' : 'Vehicles'}
          </TabsTrigger>
          <TabsTrigger value="settings" className="text-lg font-medium">
            {language === 'vi' ? 'Cài đặt' : 'Settings'}
          </TabsTrigger>
          <TabsTrigger value="results" className="text-lg font-medium">
            {language === 'vi' ? 'Kết quả' : 'Results'}
          </TabsTrigger>
          <TabsTrigger value="insights" className="text-lg font-medium">
            {language === 'vi' ? 'AI Insights' : 'AI Insights'}
          </TabsTrigger>
        </TabsList>

        {/* Locations Tab */}
        <TabsContent value="locations" className="space-y-4">
          <Card>
            <CardHeader className="bg-blue-50">
              <CardTitle className="flex items-center justify-between text-xl">
                <span className="flex items-center gap-2 text-blue-800">
                  <MapPin className="h-6 w-6" />
                  {language === 'vi' ? 'Địa điểm giao hàng' : 'Delivery Locations'}
                </span>
                <Button onClick={addLocation} size="lg" className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-5 w-5 mr-2" />
                  {language === 'vi' ? 'Thêm địa điểm' : 'Add Location'}
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                {locations.map((location) => (
                  <Card key={location.id} className="p-6 border-2 border-gray-200 hover:border-blue-300 transition-colors">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <Label htmlFor={`name-${location.id}`} className="text-lg font-medium text-gray-700">
                          {language === 'vi' ? 'Tên' : 'Name'}
                        </Label>
                        <Input
                          id={`name-${location.id}`}
                          value={location.name}
                          onChange={(e) => updateLocation(location.id, { name: e.target.value })}
                          className="mt-2 text-lg p-3 border-2"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`address-${location.id}`} className="text-lg font-medium text-gray-700">
                          {language === 'vi' ? 'Địa chỉ' : 'Address'}
                        </Label>
                        <Input
                          id={`address-${location.id}`}
                          value={location.address}
                          onChange={(e) => updateLocation(location.id, { address: e.target.value })}
                          className="mt-2 text-lg p-3 border-2"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`priority-${location.id}`} className="text-lg font-medium text-gray-700">
                          {language === 'vi' ? 'Ưu tiên (1-10)' : 'Priority (1-10)'}
                        </Label>
                        <Input
                          id={`priority-${location.id}`}
                          type="number"
                          min="1"
                          max="10"
                          value={location.priority}
                          onChange={(e) => updateLocation(location.id, { priority: parseInt(e.target.value) })}
                          className="mt-2 text-lg p-3 border-2"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`lat-${location.id}`} className="text-lg font-medium text-gray-700">
                          {language === 'vi' ? 'Vĩ độ' : 'Latitude'}
                        </Label>
                        <Input
                          id={`lat-${location.id}`}
                          type="number"
                          step="0.000001"
                          value={location.lat}
                          onChange={(e) => updateLocation(location.id, { lat: parseFloat(e.target.value) })}
                          className="mt-2 text-lg p-3 border-2"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`lng-${location.id}`} className="text-lg font-medium text-gray-700">
                          {language === 'vi' ? 'Kinh độ' : 'Longitude'}
                        </Label>
                        <Input
                          id={`lng-${location.id}`}
                          type="number"
                          step="0.000001"
                          value={location.lng}
                          onChange={(e) => updateLocation(location.id, { lng: parseFloat(e.target.value) })}
                          className="mt-2 text-lg p-3 border-2"
                        />
                      </div>
                      <div className="flex items-end">
                        <Button 
                          variant="destructive" 
                          size="lg"
                          onClick={() => removeLocation(location.id)}
                          className="w-full"
                        >
                          <Trash2 className="h-5 w-5 mr-2" />
                          {language === 'vi' ? 'Xóa' : 'Remove'}
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
                
                {locations.length === 0 && (
                  <div className="text-center py-12 text-gray-500 text-xl">
                    {language === 'vi' 
                      ? 'Chưa có địa điểm nào. Nhấp "Thêm địa điểm" để bắt đầu.'
                      : 'No locations added yet. Click "Add Location" to get started.'
                    }
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

export default EnhancedRouteOptimizerFixed;
