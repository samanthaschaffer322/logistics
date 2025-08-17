'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui-components'
import { Badge } from '@/components/ui-components'
import { Button } from '@/components/ui-components'
import { Progress } from '@/components/ui-components'
import { Input } from '@/components/ui-components'
import { 
  Truck, 
  MapPin, 
  Clock, 
  Package, 
  User, 
  Phone, 
  RefreshCw, 
  AlertTriangle,
  Navigation2,
  Thermometer,
  Battery,
  Fuel,
  Settings,
  Calendar,
  FileText,
  BarChart3,
  Shield,
  Wrench,
  DollarSign
} from 'lucide-react'

interface VehicleDetails {
  id: string;
  licensePlate: string;
  driverName: string;
  driverPhone: string;
  vehicleType: string;
  currentLocation: string;
  destination: string;
  status: 'Active' | 'Maintenance' | 'Idle' | 'Loading' | 'Delivering';
  fuelLevel: number;
  batteryLevel: number;
  temperature: number;
  speed: number;
  mileage: number;
  lastMaintenance: Date;
  nextMaintenance: Date;
  totalTrips: number;
  totalRevenue: number;
  efficiency: number;
  containerNumber?: string;
  billNumber?: string;
  customer: string;
  feedType: string;
  loadCapacity: number;
  currentLoad: number;
}

interface MaintenanceAlert {
  vehicleId: string;
  licensePlate: string;
  type: 'Engine' | 'Brakes' | 'Tires' | 'Oil' | 'Battery';
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  description: string;
  dueDate: Date;
  estimatedCost: number;
}

const AdvancedFleetManagement = () => {
  const [vehicles, setVehicles] = useState<VehicleDetails[]>([]);
  const [maintenanceAlerts, setMaintenanceAlerts] = useState<MaintenanceAlert[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleDetails | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    generateFleetData();
    const interval = setInterval(updateVehicleStatus, 10000);
    return () => clearInterval(interval);
  }, []);

  const generateFleetData = () => {
    const vietnameseFleet: VehicleDetails[] = [
      {
        id: 'VH001',
        licensePlate: '50H53777',
        driverName: 'Nguyễn Văn Minh',
        driverPhone: '0909 123 456',
        vehicleType: 'Container 40ft',
        currentLocation: 'Cảng Cát Lái',
        destination: 'KHO CHIM ÉN',
        status: 'Delivering',
        fuelLevel: 85,
        batteryLevel: 92,
        temperature: 28,
        speed: 45,
        mileage: 125000,
        lastMaintenance: new Date('2025-07-15'),
        nextMaintenance: new Date('2025-09-15'),
        totalTrips: 1247,
        totalRevenue: 450000000,
        efficiency: 94.5,
        containerNumber: 'CBHU9513264',
        billNumber: 'OOLU2753948410',
        customer: 'Khai Anh CE (N)',
        feedType: 'Nguyên liệu thức ăn chăn nuôi',
        loadCapacity: 28000,
        currentLoad: 26500
      },
      {
        id: 'VH002',
        licensePlate: '51C63836',
        driverName: 'Trần Thị Lan',
        driverPhone: '0908 987 654',
        vehicleType: 'Truck 15 tấn',
        currentLocation: 'KHO CHIM ÉN',
        destination: 'CP TIỀN GIANG',
        status: 'Loading',
        fuelLevel: 78,
        batteryLevel: 88,
        temperature: 32,
        speed: 0,
        mileage: 98000,
        lastMaintenance: new Date('2025-06-20'),
        nextMaintenance: new Date('2025-08-20'),
        totalTrips: 892,
        totalRevenue: 320000000,
        efficiency: 91.2,
        customer: 'CP Việt Nam',
        feedType: 'Thức ăn heo',
        loadCapacity: 15000,
        currentLoad: 12000
      },
      {
        id: 'VH003',
        licensePlate: '48H01595',
        driverName: 'Lê Văn Hùng',
        driverPhone: '0907 555 333',
        vehicleType: 'Container 20ft',
        currentLocation: 'Cảng Vũng Tàu',
        destination: 'KHO LONG AN',
        status: 'Active',
        fuelLevel: 65,
        batteryLevel: 75,
        temperature: 35,
        speed: 55,
        mileage: 156000,
        lastMaintenance: new Date('2025-05-10'),
        nextMaintenance: new Date('2025-08-25'),
        totalTrips: 1456,
        totalRevenue: 580000000,
        efficiency: 89.8,
        containerNumber: 'CCLU5168766',
        billNumber: 'CEM0128784',
        customer: 'GAD',
        feedType: 'Nguyên liệu thủy sản',
        loadCapacity: 18000,
        currentLoad: 17500
      },
      {
        id: 'VH004',
        licensePlate: '51C76124',
        driverName: 'Phạm Thị Mai',
        driverPhone: '0906 777 888',
        vehicleType: 'Truck 12 tấn',
        currentLocation: 'JAPFA BÌNH THUẬN',
        destination: 'KHO HÀM TÂN',
        status: 'Maintenance',
        fuelLevel: 45,
        batteryLevel: 60,
        temperature: 40,
        speed: 0,
        mileage: 187000,
        lastMaintenance: new Date('2025-08-10'),
        nextMaintenance: new Date('2025-10-10'),
        totalTrips: 1678,
        totalRevenue: 420000000,
        efficiency: 87.3,
        customer: 'Japfa Comfeed',
        feedType: 'Thức ăn heo con',
        loadCapacity: 12000,
        currentLoad: 0
      }
    ];

    const alerts: MaintenanceAlert[] = [
      {
        vehicleId: 'VH003',
        licensePlate: '48H01595',
        type: 'Engine',
        severity: 'High',
        description: 'Động cơ cần bảo dưỡng định kỳ - đã chạy 156,000 km',
        dueDate: new Date('2025-08-25'),
        estimatedCost: 8500000
      },
      {
        vehicleId: 'VH004',
        licensePlate: '51C76124',
        type: 'Brakes',
        severity: 'Critical',
        description: 'Hệ thống phanh cần thay thế ngay lập tức',
        dueDate: new Date('2025-08-18'),
        estimatedCost: 12000000
      },
      {
        vehicleId: 'VH002',
        licensePlate: '51C63836',
        type: 'Tires',
        severity: 'Medium',
        description: 'Lốp xe cần kiểm tra và có thể cần thay',
        dueDate: new Date('2025-09-01'),
        estimatedCost: 6000000
      }
    ];

    setVehicles(vietnameseFleet);
    setMaintenanceAlerts(alerts);
  };

  const updateVehicleStatus = () => {
    setVehicles(prev => prev.map(vehicle => ({
      ...vehicle,
      fuelLevel: Math.max(20, vehicle.fuelLevel - Math.random() * 2),
      batteryLevel: Math.max(30, vehicle.batteryLevel - Math.random() * 1),
      temperature: 25 + Math.random() * 15,
      speed: vehicle.status === 'Active' || vehicle.status === 'Delivering' 
        ? 30 + Math.random() * 30 
        : 0
    })));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'Delivering': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'Loading': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'Maintenance': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'Idle': return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Critical': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'High': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'Medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'Low': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const filteredVehicles = filterStatus === 'all' 
    ? vehicles 
    : vehicles.filter(v => v.status.toLowerCase() === filterStatus.toLowerCase());

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Quản Lý Đội Xe Nâng Cao</h2>
          <p className="text-slate-400">Giám sát và quản lý toàn bộ đội xe logistics thức ăn chăn nuôi</p>
        </div>
        <div className="flex items-center gap-2">
          {['all', 'active', 'delivering', 'loading', 'maintenance', 'idle'].map((status) => (
            <Button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1 text-sm capitalize ${
                filterStatus === status
                  ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                  : 'bg-slate-700/50 text-slate-400 hover:bg-slate-600/50'
              }`}
            >
              {status === 'all' ? 'Tất cả' : status}
            </Button>
          ))}
        </div>
      </div>

      {/* Fleet Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Tổng số xe</p>
                <p className="text-2xl font-bold text-white">{vehicles.length}</p>
              </div>
              <Truck className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Xe hoạt động</p>
                <p className="text-2xl font-bold text-green-400">
                  {vehicles.filter(v => v.status === 'Active' || v.status === 'Delivering').length}
                </p>
              </div>
              <Activity className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Cảnh báo bảo trì</p>
                <p className="text-2xl font-bold text-red-400">{maintenanceAlerts.length}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Hiệu suất TB</p>
                <p className="text-2xl font-bold text-purple-400">
                  {(vehicles.reduce((sum, v) => sum + v.efficiency, 0) / vehicles.length).toFixed(1)}%
                </p>
              </div>
              <BarChart3 className="w-8 h-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Maintenance Alerts */}
      {maintenanceAlerts.length > 0 && (
        <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Wrench className="w-5 h-5 text-red-400" />
              Cảnh Báo Bảo Trì Khẩn Cấp
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {maintenanceAlerts.map((alert, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="w-5 h-5 text-red-400" />
                    <div>
                      <div className="text-white font-medium">{alert.licensePlate} - {alert.type}</div>
                      <div className="text-slate-400 text-sm">{alert.description}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className={getSeverityColor(alert.severity)}>
                      {alert.severity}
                    </Badge>
                    <div className="text-right">
                      <div className="text-white font-medium">
                        {new Intl.NumberFormat('vi-VN').format(alert.estimatedCost)} ₫
                      </div>
                      <div className="text-slate-400 text-sm">
                        {alert.dueDate.toLocaleDateString('vi-VN')}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Vehicle Fleet */}
      <div className="grid gap-4">
        {filteredVehicles.map((vehicle) => (
          <Card key={vehicle.id} className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <Truck className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <CardTitle className="text-white text-lg">{vehicle.licensePlate}</CardTitle>
                    <CardDescription className="text-slate-400">
                      {vehicle.driverName} • {vehicle.vehicleType}
                    </CardDescription>
                  </div>
                </div>
                <Badge className={getStatusColor(vehicle.status)}>
                  {vehicle.status}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Route & Customer Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-green-400" />
                    <span className="text-slate-300">Vị trí:</span>
                    <span className="text-white font-medium">{vehicle.currentLocation}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm">
                    <Navigation2 className="w-4 h-4 text-blue-400" />
                    <span className="text-slate-300">Đích đến:</span>
                    <span className="text-white font-medium">{vehicle.destination}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm">
                    <User className="w-4 h-4 text-purple-400" />
                    <span className="text-slate-300">Khách hàng:</span>
                    <span className="text-white font-medium">{vehicle.customer}</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <Package className="w-4 h-4 text-orange-400" />
                    <span className="text-slate-300">Loại hàng:</span>
                    <span className="text-white font-medium">{vehicle.feedType}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="w-4 h-4 text-green-400" />
                    <span className="text-slate-300">Liên hệ:</span>
                    <span className="text-white font-medium">{vehicle.driverPhone}</span>
                  </div>
                  
                  {vehicle.containerNumber && (
                    <div className="flex items-center gap-2 text-sm">
                      <FileText className="w-4 h-4 text-cyan-400" />
                      <span className="text-slate-300">Container:</span>
                      <span className="text-white font-medium">{vehicle.containerNumber}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-2 text-sm">
                    <DollarSign className="w-4 h-4 text-green-400" />
                    <span className="text-slate-300">Doanh thu:</span>
                    <span className="text-white font-medium">
                      {new Intl.NumberFormat('vi-VN', { notation: 'compact' }).format(vehicle.totalRevenue)} ₫
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <BarChart3 className="w-4 h-4 text-purple-400" />
                    <span className="text-slate-300">Hiệu suất:</span>
                    <span className="text-white font-medium">{vehicle.efficiency}%</span>
                  </div>
                </div>
              </div>

              {/* Load Capacity */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-300">Tải trọng</span>
                  <span className="text-white font-medium">
                    {new Intl.NumberFormat('vi-VN').format(vehicle.currentLoad)} / {new Intl.NumberFormat('vi-VN').format(vehicle.loadCapacity)} kg
                  </span>
                </div>
                <Progress value={(vehicle.currentLoad / vehicle.loadCapacity) * 100} className="h-2" />
              </div>

              {/* Vehicle Status */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-3 bg-slate-700/30 rounded-lg">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Fuel className="w-4 h-4 text-blue-400" />
                    <span className="text-xs text-slate-300">Nhiên liệu</span>
                  </div>
                  <div className="text-white font-medium">{vehicle.fuelLevel.toFixed(0)}%</div>
                </div>
                
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Battery className="w-4 h-4 text-green-400" />
                    <span className="text-xs text-slate-300">Pin</span>
                  </div>
                  <div className="text-white font-medium">{vehicle.batteryLevel.toFixed(0)}%</div>
                </div>
                
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Thermometer className="w-4 h-4 text-red-400" />
                    <span className="text-xs text-slate-300">Nhiệt độ</span>
                  </div>
                  <div className="text-white font-medium">{vehicle.temperature.toFixed(0)}°C</div>
                </div>

                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Navigation2 className="w-4 h-4 text-purple-400" />
                    <span className="text-xs text-slate-300">Tốc độ</span>
                  </div>
                  <div className="text-white font-medium">{vehicle.speed.toFixed(0)} km/h</div>
                </div>
              </div>

              {/* Alerts */}
              {vehicle.temperature > 35 && (
                <div className="flex items-center gap-2 p-2 bg-red-500/10 border border-red-500/30 rounded-lg">
                  <AlertTriangle className="w-4 h-4 text-red-400" />
                  <span className="text-red-400 text-sm">
                    Cảnh báo: Nhiệt độ cao có thể ảnh hưởng chất lượng thức ăn chăn nuôi
                  </span>
                </div>
              )}

              {vehicle.fuelLevel < 30 && (
                <div className="flex items-center gap-2 p-2 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                  <Fuel className="w-4 h-4 text-yellow-400" />
                  <span className="text-yellow-400 text-sm">
                    Cảnh báo: Mức nhiên liệu thấp - cần tiếp nhiên liệu sớm
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdvancedFleetManagement;
