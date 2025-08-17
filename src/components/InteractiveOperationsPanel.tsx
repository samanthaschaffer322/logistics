'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui-components'
import { Button } from '@/components/ui-components'
import { Badge } from '@/components/ui-components'
import { Progress } from '@/components/ui-components'
import { 
  Truck, 
  Package, 
  Navigation, 
  AlertTriangle,
  CheckCircle,
  Clock,
  MapPin,
  Phone,
  User,
  RefreshCw,
  Play,
  Pause,
  Square,
  Settings
} from 'lucide-react'

interface FleetStatus {
  id: string;
  licensePlate: string;
  driver: string;
  status: 'active' | 'loading' | 'delivering' | 'maintenance' | 'idle';
  location: string;
  destination: string;
  progress: number;
  eta: string;
}

interface Shipment {
  id: string;
  from: string;
  to: string;
  customer: string;
  status: 'pending' | 'in-transit' | 'delivered' | 'delayed';
  priority: 'high' | 'medium' | 'low';
  vehicle: string;
  estimatedDelivery: string;
}

interface Alert {
  id: string;
  type: 'traffic' | 'weather' | 'maintenance' | 'delay';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  location: string;
  timestamp: Date;
  acknowledged: boolean;
}

const InteractiveOperationsPanel = () => {
  const [fleetStatus, setFleetStatus] = useState<FleetStatus[]>([]);
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null);
  const [isLiveMode, setIsLiveMode] = useState(true);

  useEffect(() => {
    generateOperationalData();
    const interval = setInterval(() => {
      if (isLiveMode) {
        updateOperationalData();
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [isLiveMode]);

  const generateOperationalData = () => {
    const fleet: FleetStatus[] = [
      {
        id: 'VH001',
        licensePlate: '50H53777',
        driver: 'Nguyễn Văn Minh',
        status: 'delivering',
        location: 'Quận 7, TP.HCM',
        destination: 'KHO CHIM ÉN',
        progress: 75,
        eta: '14:30'
      },
      {
        id: 'VH002',
        licensePlate: '51C63836',
        driver: 'Trần Thị Lan',
        status: 'loading',
        location: 'KHO CHIM ÉN',
        destination: 'CP TIỀN GIANG',
        progress: 25,
        eta: '16:00'
      },
      {
        id: 'VH003',
        licensePlate: '48H01595',
        driver: 'Lê Văn Hùng',
        status: 'active',
        location: 'Cảng Vũng Tàu',
        destination: 'KHO LONG AN',
        progress: 60,
        eta: '15:45'
      },
      {
        id: 'VH004',
        licensePlate: '51C76124',
        driver: 'Phạm Thị Mai',
        status: 'maintenance',
        location: 'Garage Bình Thuận',
        destination: 'N/A',
        progress: 0,
        eta: 'N/A'
      }
    ];

    const shipmentList: Shipment[] = [
      {
        id: 'SH001',
        from: 'Cảng Cát Lái',
        to: 'KHO CHIM ÉN',
        customer: 'Khai Anh CE',
        status: 'in-transit',
        priority: 'high',
        vehicle: '50H53777',
        estimatedDelivery: '14:30'
      },
      {
        id: 'SH002',
        from: 'KHO CHIM ÉN',
        to: 'CP TIỀN GIANG',
        customer: 'CP Việt Nam',
        status: 'pending',
        priority: 'high',
        vehicle: '51C63836',
        estimatedDelivery: '16:00'
      },
      {
        id: 'SH003',
        from: 'Cảng Vũng Tàu',
        to: 'KHO LONG AN',
        customer: 'GAD',
        status: 'in-transit',
        priority: 'medium',
        vehicle: '48H01595',
        estimatedDelivery: '15:45'
      },
      {
        id: 'SH004',
        from: 'KHO CHIM ÉN',
        to: 'RICO HẬU GIANG',
        customer: 'Rico Feed',
        status: 'delayed',
        priority: 'medium',
        vehicle: 'N/A',
        estimatedDelivery: '18:00'
      }
    ];

    const alertList: Alert[] = [
      {
        id: 'AL001',
        type: 'traffic',
        severity: 'high',
        message: 'Tắc đường nghiêm trọng Cầu Phú Mỹ, chậm 30 phút',
        location: 'Cầu Phú Mỹ',
        timestamp: new Date(),
        acknowledged: false
      },
      {
        id: 'AL002',
        type: 'maintenance',
        severity: 'critical',
        message: 'Xe 51C76124 cần bảo trì phanh khẩn cấp',
        location: 'Bình Thuận',
        timestamp: new Date(Date.now() - 300000),
        acknowledged: false
      },
      {
        id: 'AL003',
        type: 'weather',
        severity: 'medium',
        message: 'Mưa lớn tại ĐBSCL, có thể ảnh hưởng giao hàng',
        location: 'Hậu Giang',
        timestamp: new Date(Date.now() - 600000),
        acknowledged: true
      }
    ];

    setFleetStatus(fleet);
    setShipments(shipmentList);
    setAlerts(alertList);
  };

  const updateOperationalData = () => {
    setFleetStatus(prev => prev.map(vehicle => ({
      ...vehicle,
      progress: vehicle.status === 'delivering' || vehicle.status === 'active' 
        ? Math.min(100, vehicle.progress + Math.random() * 5)
        : vehicle.progress,
      location: vehicle.status === 'delivering' 
        ? `Đang di chuyển đến ${vehicle.destination}`
        : vehicle.location
    })));
  };

  const handleVehicleAction = (vehicleId: string, action: 'start' | 'pause' | 'stop') => {
    setFleetStatus(prev => prev.map(vehicle => {
      if (vehicle.id === vehicleId) {
        let newStatus = vehicle.status;
        switch (action) {
          case 'start':
            newStatus = vehicle.status === 'idle' ? 'active' : vehicle.status;
            break;
          case 'pause':
            newStatus = vehicle.status === 'active' ? 'idle' : vehicle.status;
            break;
          case 'stop':
            newStatus = 'idle';
            break;
        }
        return { ...vehicle, status: newStatus };
      }
      return vehicle;
    }));
    
    alert(`✅ Đã ${action === 'start' ? 'khởi động' : action === 'pause' ? 'tạm dừng' : 'dừng'} xe ${vehicleId}`);
  };

  const handleShipmentAction = (shipmentId: string, action: 'assign' | 'track' | 'update') => {
    switch (action) {
      case 'assign':
        const availableVehicles = fleetStatus.filter(v => v.status === 'idle');
        if (availableVehicles.length > 0) {
          alert(`✅ Đã phân công xe ${availableVehicles[0].licensePlate} cho đơn hàng ${shipmentId}`);
        } else {
          alert('⚠️ Không có xe nào sẵn sàng');
        }
        break;
      case 'track':
        const shipment = shipments.find(s => s.id === shipmentId);
        if (shipment) {
          alert(`📍 Đơn hàng ${shipmentId}:\nTừ: ${shipment.from}\nĐến: ${shipment.to}\nXe: ${shipment.vehicle}\nDự kiến: ${shipment.estimatedDelivery}`);
        }
        break;
      case 'update':
        alert(`📝 Cập nhật trạng thái đơn hàng ${shipmentId}`);
        break;
    }
  };

  const handleAlertAction = (alertId: string, action: 'acknowledge' | 'resolve') => {
    setAlerts(prev => prev.map(alert => {
      if (alert.id === alertId) {
        return { 
          ...alert, 
          acknowledged: action === 'acknowledge' ? true : alert.acknowledged 
        };
      }
      return alert;
    }));
    
    alert(`✅ Đã ${action === 'acknowledge' ? 'xác nhận' : 'giải quyết'} cảnh báo ${alertId}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'delivering': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'loading': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'maintenance': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'idle': return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      case 'in-transit': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'delivered': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'delayed': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'pending': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'high': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'low': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Bảng Điều Khiển Vận Hành</h2>
          <p className="text-slate-400">Quản lý và giám sát hoạt động logistics real-time</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => setIsLiveMode(!isLiveMode)}
            className={`${
              isLiveMode
                ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                : 'bg-slate-700/50 text-slate-400'
            }`}
          >
            {isLiveMode ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
            {isLiveMode ? 'Tạm dừng' : 'Bật live'}
          </Button>
          <Button
            onClick={generateOperationalData}
            className="bg-blue-500/20 text-blue-400 border border-blue-500/30 hover:bg-blue-500/30"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Làm mới
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Fleet Status */}
        <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Truck className="w-5 h-5 text-blue-400" />
              Trạng Thái Đội Xe ({fleetStatus.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {fleetStatus.map((vehicle) => (
                <div key={vehicle.id} className="p-3 bg-slate-700/30 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Truck className="w-4 h-4 text-blue-400" />
                      <span className="text-white font-medium">{vehicle.licensePlate}</span>
                      <Badge className={getStatusColor(vehicle.status)}>
                        {vehicle.status}
                      </Badge>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        onClick={() => handleVehicleAction(vehicle.id, 'start')}
                        className="p-1 bg-green-500/20 text-green-400 hover:bg-green-500/30"
                        disabled={vehicle.status === 'maintenance'}
                      >
                        <Play className="w-3 h-3" />
                      </Button>
                      <Button
                        onClick={() => handleVehicleAction(vehicle.id, 'pause')}
                        className="p-1 bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30"
                        disabled={vehicle.status === 'maintenance'}
                      >
                        <Pause className="w-3 h-3" />
                      </Button>
                      <Button
                        onClick={() => handleVehicleAction(vehicle.id, 'stop')}
                        className="p-1 bg-red-500/20 text-red-400 hover:bg-red-500/30"
                        disabled={vehicle.status === 'maintenance'}
                      >
                        <Square className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="text-sm text-slate-400 mb-2">
                    <div className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      {vehicle.driver}
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {vehicle.location} → {vehicle.destination}
                    </div>
                    {vehicle.eta !== 'N/A' && (
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        ETA: {vehicle.eta}
                      </div>
                    )}
                  </div>
                  
                  {vehicle.progress > 0 && (
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-400">Tiến độ</span>
                        <span className="text-white">{vehicle.progress.toFixed(0)}%</span>
                      </div>
                      <Progress value={vehicle.progress} className="h-1" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Shipments */}
        <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Package className="w-5 h-5 text-green-400" />
              Đơn Hàng ({shipments.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {shipments.map((shipment) => (
                <div key={shipment.id} className="p-3 bg-slate-700/30 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Package className="w-4 h-4 text-green-400" />
                      <span className="text-white font-medium">{shipment.id}</span>
                      <Badge className={getStatusColor(shipment.status)}>
                        {shipment.status}
                      </Badge>
                      <Badge className={
                        shipment.priority === 'high' ? 'bg-red-500/20 text-red-400 border-red-500/30' :
                        shipment.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' :
                        'bg-blue-500/20 text-blue-400 border-blue-500/30'
                      }>
                        {shipment.priority}
                      </Badge>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        onClick={() => handleShipmentAction(shipment.id, 'assign')}
                        className="p-1 bg-blue-500/20 text-blue-400 hover:bg-blue-500/30"
                      >
                        <Settings className="w-3 h-3" />
                      </Button>
                      <Button
                        onClick={() => handleShipmentAction(shipment.id, 'track')}
                        className="p-1 bg-green-500/20 text-green-400 hover:bg-green-500/30"
                      >
                        <Navigation className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="text-sm text-slate-400">
                    <div>{shipment.from} → {shipment.to}</div>
                    <div>Khách hàng: {shipment.customer}</div>
                    <div>Xe: {shipment.vehicle}</div>
                    <div>Dự kiến: {shipment.estimatedDelivery}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts */}
      <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-400" />
            Cảnh Báo Hệ Thống ({alerts.filter(a => !a.acknowledged).length} chưa xử lý)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {alerts.map((alert) => (
              <div key={alert.id} className={`p-3 rounded-lg border ${
                alert.acknowledged ? 'bg-slate-700/20 border-slate-600/50' : 'bg-slate-700/30 border-slate-600'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className={`w-4 h-4 ${
                      alert.severity === 'critical' ? 'text-red-400' :
                      alert.severity === 'high' ? 'text-orange-400' :
                      alert.severity === 'medium' ? 'text-yellow-400' : 'text-blue-400'
                    }`} />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-white font-medium">{alert.location}</span>
                        <Badge className={getSeverityColor(alert.severity)}>
                          {alert.severity}
                        </Badge>
                        {alert.acknowledged && (
                          <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                            Đã xử lý
                          </Badge>
                        )}
                      </div>
                      <p className="text-slate-300 text-sm">{alert.message}</p>
                      <p className="text-slate-400 text-xs">{alert.timestamp.toLocaleTimeString('vi-VN')}</p>
                    </div>
                  </div>
                  {!alert.acknowledged && (
                    <div className="flex gap-1">
                      <Button
                        onClick={() => handleAlertAction(alert.id, 'acknowledge')}
                        className="p-1 bg-green-500/20 text-green-400 hover:bg-green-500/30"
                      >
                        <CheckCircle className="w-3 h-3" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InteractiveOperationsPanel;
