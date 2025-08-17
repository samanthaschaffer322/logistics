'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui-components'
import { Badge } from '@/components/ui-components'
import { Button } from '@/components/ui-components'
import { Progress } from '@/components/ui-components'
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
  Fuel
} from 'lucide-react'

interface VietnamDelivery {
  id: string;
  driver: string;
  vehicle: string;
  phone: string;
  currentLocation: string;
  nextStop: string;
  progress: number;
  packagesDelivered: number;
  totalPackages: number;
  estimatedCompletion: string;
  status: "Đang giao" | "Đang tải" | "Giao hàng" | "Chậm trễ" | "Nghỉ";
  speed: number;
  lastUpdate: Date;
  batteryLevel: number;
  temperature: number;
  feedType: string;
  customer: string;
  route: string;
}

const EnhancedTracking = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeDeliveries, setActiveDeliveries] = useState<VietnamDelivery[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  // Initialize with Vietnamese logistics data
  useEffect(() => {
    generateVietnameseDeliveries();
    const timeInterval = setInterval(() => setCurrentTime(new Date()), 1000);
    const updateInterval = setInterval(updateDeliveryStatus, 5000);
    
    return () => {
      clearInterval(timeInterval);
      clearInterval(updateInterval);
    };
  }, []);

  const generateVietnameseDeliveries = () => {
    const vietnameseRoutes = [
      {
        id: "VN001",
        driver: "Nguyễn Văn Minh",
        vehicle: "51C-63836",
        phone: "0909 123 456",
        currentLocation: "Quận 7, TP.HCM",
        nextStop: "KHO CHIM ÉN",
        progress: 75,
        packagesDelivered: 3,
        totalPackages: 5,
        estimatedCompletion: "14:30",
        status: "Đang giao" as const,
        speed: 45,
        lastUpdate: new Date(),
        batteryLevel: 85,
        temperature: 32,
        feedType: "Thức ăn heo",
        customer: "CP Việt Nam",
        route: "Cảng Cát Lái → KHO CHIM ÉN"
      },
      {
        id: "VN002", 
        driver: "Trần Thị Lan",
        vehicle: "50H-53777",
        phone: "0908 987 654",
        currentLocation: "Tiền Giang",
        nextStop: "CP TIỀN GIANG",
        progress: 90,
        packagesDelivered: 4,
        totalPackages: 4,
        estimatedCompletion: "15:15",
        status: "Giao hàng" as const,
        speed: 35,
        lastUpdate: new Date(),
        batteryLevel: 92,
        temperature: 28,
        feedType: "Thức ăn gà",
        customer: "CP Việt Nam",
        route: "KHO CHIM ÉN → CP TIỀN GIANG"
      },
      {
        id: "VN003",
        driver: "Lê Văn Hùng", 
        vehicle: "48H-01595",
        phone: "0907 555 333",
        currentLocation: "Đồng Tháp",
        nextStop: "HÙNG CÁ ĐỒNG THÁP",
        progress: 60,
        packagesDelivered: 2,
        totalPackages: 6,
        estimatedCompletion: "16:45",
        status: "Đang giao" as const,
        speed: 40,
        lastUpdate: new Date(),
        batteryLevel: 78,
        temperature: 30,
        feedType: "Thức ăn cá tra",
        customer: "Hùng Cá",
        route: "KHO LONG AN → HÙNG CÁ ĐỒNG THÁP"
      }
    ];
    
    setActiveDeliveries(vietnameseRoutes);
  };

  const updateDeliveryStatus = () => {
    setActiveDeliveries(prev => prev.map(delivery => ({
      ...delivery,
      progress: Math.min(100, delivery.progress + Math.random() * 5),
      speed: 30 + Math.random() * 20,
      batteryLevel: Math.max(20, delivery.batteryLevel - Math.random() * 2),
      temperature: 25 + Math.random() * 10,
      lastUpdate: new Date()
    })));
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    updateDeliveryStatus();
    setRefreshing(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Đang giao": return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "Giao hàng": return "bg-green-500/20 text-green-400 border-green-500/30";
      case "Chậm trễ": return "bg-red-500/20 text-red-400 border-red-500/30";
      case "Đang tải": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      default: return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Theo Dõi Thời Gian Thực</h2>
          <p className="text-slate-400">Giám sát logistics thức ăn chăn nuôi miền Nam</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-sm text-slate-400">Cập nhật lần cuối</div>
            <div className="text-white font-mono">{currentTime.toLocaleTimeString('vi-VN')}</div>
          </div>
          <Button 
            onClick={handleRefresh}
            disabled={refreshing}
            className="bg-blue-500/20 text-blue-400 border border-blue-500/30 hover:bg-blue-500/30"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Làm mới
          </Button>
        </div>
      </div>

      {/* Active Deliveries */}
      <div className="grid gap-4">
        {activeDeliveries.map((delivery) => (
          <Card key={delivery.id} className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <Truck className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <CardTitle className="text-white text-lg">{delivery.driver}</CardTitle>
                    <CardDescription className="text-slate-400">
                      {delivery.vehicle} • {delivery.feedType}
                    </CardDescription>
                  </div>
                </div>
                <Badge className={getStatusColor(delivery.status)}>
                  {delivery.status}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Route Progress */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-300">{delivery.route}</span>
                  <span className="text-blue-400 font-medium">{delivery.progress.toFixed(0)}%</span>
                </div>
                <Progress value={delivery.progress} className="h-2" />
              </div>

              {/* Location & Customer Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-green-400" />
                    <span className="text-slate-300">Vị trí hiện tại:</span>
                    <span className="text-white font-medium">{delivery.currentLocation}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm">
                    <Navigation2 className="w-4 h-4 text-blue-400" />
                    <span className="text-slate-300">Điểm đến:</span>
                    <span className="text-white font-medium">{delivery.nextStop}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm">
                    <User className="w-4 h-4 text-purple-400" />
                    <span className="text-slate-300">Khách hàng:</span>
                    <span className="text-white font-medium">{delivery.customer}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Package className="w-4 h-4 text-orange-400" />
                    <span className="text-slate-300">Giao hàng:</span>
                    <span className="text-white font-medium">
                      {delivery.packagesDelivered}/{delivery.totalPackages} đơn
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4 text-yellow-400" />
                    <span className="text-slate-300">Dự kiến hoàn thành:</span>
                    <span className="text-white font-medium">{delivery.estimatedCompletion}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="w-4 h-4 text-green-400" />
                    <span className="text-slate-300">Liên hệ:</span>
                    <span className="text-white font-medium">{delivery.phone}</span>
                  </div>
                </div>
              </div>

              {/* Vehicle Status */}
              <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Fuel className="w-4 h-4 text-blue-400" />
                    <span className="text-slate-300">Tốc độ:</span>
                    <span className="text-white font-medium">{delivery.speed.toFixed(0)} km/h</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm">
                    <Battery className="w-4 h-4 text-green-400" />
                    <span className="text-slate-300">Pin:</span>
                    <span className="text-white font-medium">{delivery.batteryLevel.toFixed(0)}%</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm">
                    <Thermometer className="w-4 h-4 text-red-400" />
                    <span className="text-slate-300">Nhiệt độ:</span>
                    <span className="text-white font-medium">{delivery.temperature.toFixed(0)}°C</span>
                  </div>
                </div>
                
                <div className="text-xs text-slate-400">
                  Cập nhật: {delivery.lastUpdate.toLocaleTimeString('vi-VN')}
                </div>
              </div>

              {/* Alerts */}
              {delivery.temperature > 35 && (
                <div className="flex items-center gap-2 p-2 bg-red-500/10 border border-red-500/30 rounded-lg">
                  <AlertTriangle className="w-4 h-4 text-red-400" />
                  <span className="text-red-400 text-sm">
                    Cảnh báo: Nhiệt độ cao có thể ảnh hưởng chất lượng thức ăn chăn nuôi
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

export default EnhancedTracking;
