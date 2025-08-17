'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui-components'
import { Button } from '@/components/ui-components'
import { Input } from '@/components/ui-components'
import { Label } from '@/components/ui-components'
import { Badge } from '@/components/ui-components'
import { 
  Plus, 
  Wrench, 
  MapPin, 
  Download, 
  Calendar,
  Truck,
  User,
  Phone,
  FileText,
  AlertTriangle,
  CheckCircle,
  X
} from 'lucide-react'

interface Vehicle {
  id: string;
  licensePlate: string;
  driverName: string;
  driverPhone: string;
  vehicleType: string;
  status: string;
}

interface MaintenanceSchedule {
  id: string;
  vehicleId: string;
  licensePlate: string;
  type: string;
  scheduledDate: string;
  description: string;
  estimatedCost: number;
  status: 'Scheduled' | 'In Progress' | 'Completed';
}

const InteractiveFleetActions = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([
    {
      id: 'VH001',
      licensePlate: '50H53777',
      driverName: 'Nguyễn Văn Minh',
      driverPhone: '0909 123 456',
      vehicleType: 'Container 40ft',
      status: 'Active'
    },
    {
      id: 'VH002',
      licensePlate: '51C63836',
      driverName: 'Trần Thị Lan',
      driverPhone: '0908 987 654',
      vehicleType: 'Truck 15 tấn',
      status: 'Loading'
    }
  ]);

  const [maintenanceSchedules, setMaintenanceSchedules] = useState<MaintenanceSchedule[]>([
    {
      id: 'MT001',
      vehicleId: 'VH001',
      licensePlate: '50H53777',
      type: 'Engine Service',
      scheduledDate: '2025-08-25',
      description: 'Bảo dưỡng động cơ định kỳ',
      estimatedCost: 8500000,
      status: 'Scheduled'
    }
  ]);

  const [showAddVehicle, setShowAddVehicle] = useState(false);
  const [showScheduleMaintenance, setShowScheduleMaintenance] = useState(false);
  const [showTrackLocation, setShowTrackLocation] = useState(false);
  const [newVehicle, setNewVehicle] = useState({
    licensePlate: '',
    driverName: '',
    driverPhone: '',
    vehicleType: 'Truck 15 tấn'
  });
  const [newMaintenance, setNewMaintenance] = useState({
    vehicleId: '',
    type: '',
    scheduledDate: '',
    description: '',
    estimatedCost: 0
  });

  const handleAddVehicle = () => {
    if (newVehicle.licensePlate && newVehicle.driverName) {
      const vehicle: Vehicle = {
        id: `VH${String(vehicles.length + 1).padStart(3, '0')}`,
        licensePlate: newVehicle.licensePlate,
        driverName: newVehicle.driverName,
        driverPhone: newVehicle.driverPhone,
        vehicleType: newVehicle.vehicleType,
        status: 'Idle'
      };
      
      setVehicles([...vehicles, vehicle]);
      setNewVehicle({
        licensePlate: '',
        driverName: '',
        driverPhone: '',
        vehicleType: 'Truck 15 tấn'
      });
      setShowAddVehicle(false);
      
      // Show success message
      alert('✅ Đã thêm xe thành công!');
    }
  };

  const handleScheduleMaintenance = () => {
    if (newMaintenance.vehicleId && newMaintenance.type && newMaintenance.scheduledDate) {
      const selectedVehicle = vehicles.find(v => v.id === newMaintenance.vehicleId);
      if (selectedVehicle) {
        const maintenance: MaintenanceSchedule = {
          id: `MT${String(maintenanceSchedules.length + 1).padStart(3, '0')}`,
          vehicleId: newMaintenance.vehicleId,
          licensePlate: selectedVehicle.licensePlate,
          type: newMaintenance.type,
          scheduledDate: newMaintenance.scheduledDate,
          description: newMaintenance.description,
          estimatedCost: newMaintenance.estimatedCost,
          status: 'Scheduled'
        };
        
        setMaintenanceSchedules([...maintenanceSchedules, maintenance]);
        setNewMaintenance({
          vehicleId: '',
          type: '',
          scheduledDate: '',
          description: '',
          estimatedCost: 0
        });
        setShowScheduleMaintenance(false);
        
        alert('✅ Đã lên lịch bảo trì thành công!');
      }
    }
  };

  const handleExportReport = () => {
    const reportData = {
      vehicles: vehicles,
      maintenanceSchedules: maintenanceSchedules,
      generatedAt: new Date().toISOString(),
      summary: {
        totalVehicles: vehicles.length,
        activeVehicles: vehicles.filter(v => v.status === 'Active').length,
        scheduledMaintenance: maintenanceSchedules.filter(m => m.status === 'Scheduled').length,
        totalMaintenanceCost: maintenanceSchedules.reduce((sum, m) => sum + m.estimatedCost, 0)
      }
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `fleet-report-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    
    alert('✅ Đã xuất báo cáo thành công!');
  };

  const handleTrackLocation = (vehicleId: string) => {
    const vehicle = vehicles.find(v => v.id === vehicleId);
    if (vehicle) {
      // Simulate GPS tracking
      const locations = [
        'Cảng Cát Lái, TP.HCM',
        'Quận 2, TP.HCM', 
        'KHO CHIM ÉN, Quận 7',
        'Cao tốc TP.HCM - Trung Lương',
        'Tiền Giang'
      ];
      const currentLocation = locations[Math.floor(Math.random() * locations.length)];
      
      alert(`📍 Vị trí hiện tại của xe ${vehicle.licensePlate}:\n${currentLocation}\n\nLái xe: ${vehicle.driverName}\nĐiện thoại: ${vehicle.driverPhone}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Action Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Button
          onClick={() => setShowAddVehicle(true)}
          className="bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500/30 p-6 h-auto flex flex-col items-center gap-2"
        >
          <Plus className="w-6 h-6" />
          <span className="font-medium">Thêm Xe</span>
          <span className="text-xs opacity-75">Đăng ký xe mới</span>
        </Button>

        <Button
          onClick={() => setShowScheduleMaintenance(true)}
          className="bg-orange-500/20 text-orange-400 border border-orange-500/30 hover:bg-orange-500/30 p-6 h-auto flex flex-col items-center gap-2"
        >
          <Wrench className="w-6 h-6" />
          <span className="font-medium">Lên Lịch Bảo Trì</span>
          <span className="text-xs opacity-75">Quản lý bảo dưỡng</span>
        </Button>

        <Button
          onClick={() => setShowTrackLocation(true)}
          className="bg-blue-500/20 text-blue-400 border border-blue-500/30 hover:bg-blue-500/30 p-6 h-auto flex flex-col items-center gap-2"
        >
          <MapPin className="w-6 h-6" />
          <span className="font-medium">Theo Dõi Vị Trí</span>
          <span className="text-xs opacity-75">GPS tracking</span>
        </Button>

        <Button
          onClick={handleExportReport}
          className="bg-purple-500/20 text-purple-400 border border-purple-500/30 hover:bg-purple-500/30 p-6 h-auto flex flex-col items-center gap-2"
        >
          <Download className="w-6 h-6" />
          <span className="font-medium">Xuất Báo Cáo</span>
          <span className="text-xs opacity-75">Tải dữ liệu</span>
        </Button>
      </div>

      {/* Add Vehicle Modal */}
      {showAddVehicle && (
        <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-green-400" />
                Thêm Xe Mới
              </CardTitle>
              <Button
                onClick={() => setShowAddVehicle(false)}
                className="bg-slate-700/50 text-slate-400 hover:bg-slate-600/50 p-2"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-slate-300">Biển số xe</Label>
                <Input
                  value={newVehicle.licensePlate}
                  onChange={(e) => setNewVehicle({...newVehicle, licensePlate: e.target.value})}
                  placeholder="VD: 50H53777"
                  className="bg-slate-700/50 border-slate-600 text-white"
                />
              </div>
              <div>
                <Label className="text-slate-300">Loại xe</Label>
                <select
                  value={newVehicle.vehicleType}
                  onChange={(e) => setNewVehicle({...newVehicle, vehicleType: e.target.value})}
                  className="w-full p-2 bg-slate-700/50 border border-slate-600 rounded text-white"
                >
                  <option value="Truck 15 tấn">Truck 15 tấn</option>
                  <option value="Truck 12 tấn">Truck 12 tấn</option>
                  <option value="Container 40ft">Container 40ft</option>
                  <option value="Container 20ft">Container 20ft</option>
                </select>
              </div>
              <div>
                <Label className="text-slate-300">Tên lái xe</Label>
                <Input
                  value={newVehicle.driverName}
                  onChange={(e) => setNewVehicle({...newVehicle, driverName: e.target.value})}
                  placeholder="VD: Nguyễn Văn Nam"
                  className="bg-slate-700/50 border-slate-600 text-white"
                />
              </div>
              <div>
                <Label className="text-slate-300">Số điện thoại</Label>
                <Input
                  value={newVehicle.driverPhone}
                  onChange={(e) => setNewVehicle({...newVehicle, driverPhone: e.target.value})}
                  placeholder="VD: 0909 123 456"
                  className="bg-slate-700/50 border-slate-600 text-white"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleAddVehicle}
                className="bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500/30"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Thêm Xe
              </Button>
              <Button
                onClick={() => setShowAddVehicle(false)}
                className="bg-slate-700/50 text-slate-400 hover:bg-slate-600/50"
              >
                Hủy
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Schedule Maintenance Modal */}
      {showScheduleMaintenance && (
        <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-white flex items-center gap-2">
                <Wrench className="w-5 h-5 text-orange-400" />
                Lên Lịch Bảo Trì
              </CardTitle>
              <Button
                onClick={() => setShowScheduleMaintenance(false)}
                className="bg-slate-700/50 text-slate-400 hover:bg-slate-600/50 p-2"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-slate-300">Chọn xe</Label>
                <select
                  value={newMaintenance.vehicleId}
                  onChange={(e) => setNewMaintenance({...newMaintenance, vehicleId: e.target.value})}
                  className="w-full p-2 bg-slate-700/50 border border-slate-600 rounded text-white"
                >
                  <option value="">Chọn xe...</option>
                  {vehicles.map(vehicle => (
                    <option key={vehicle.id} value={vehicle.id}>
                      {vehicle.licensePlate} - {vehicle.driverName}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label className="text-slate-300">Loại bảo trì</Label>
                <select
                  value={newMaintenance.type}
                  onChange={(e) => setNewMaintenance({...newMaintenance, type: e.target.value})}
                  className="w-full p-2 bg-slate-700/50 border border-slate-600 rounded text-white"
                >
                  <option value="">Chọn loại...</option>
                  <option value="Engine Service">Bảo dưỡng động cơ</option>
                  <option value="Brake Check">Kiểm tra phanh</option>
                  <option value="Tire Replacement">Thay lốp xe</option>
                  <option value="Oil Change">Thay dầu máy</option>
                  <option value="General Inspection">Kiểm tra tổng quát</option>
                </select>
              </div>
              <div>
                <Label className="text-slate-300">Ngày bảo trì</Label>
                <Input
                  type="date"
                  value={newMaintenance.scheduledDate}
                  onChange={(e) => setNewMaintenance({...newMaintenance, scheduledDate: e.target.value})}
                  className="bg-slate-700/50 border-slate-600 text-white"
                />
              </div>
              <div>
                <Label className="text-slate-300">Chi phí ước tính (VNĐ)</Label>
                <Input
                  type="number"
                  value={newMaintenance.estimatedCost}
                  onChange={(e) => setNewMaintenance({...newMaintenance, estimatedCost: Number(e.target.value)})}
                  placeholder="VD: 5000000"
                  className="bg-slate-700/50 border-slate-600 text-white"
                />
              </div>
            </div>
            <div>
              <Label className="text-slate-300">Mô tả</Label>
              <Input
                value={newMaintenance.description}
                onChange={(e) => setNewMaintenance({...newMaintenance, description: e.target.value})}
                placeholder="Mô tả chi tiết công việc bảo trì..."
                className="bg-slate-700/50 border-slate-600 text-white"
              />
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleScheduleMaintenance}
                className="bg-orange-500/20 text-orange-400 border border-orange-500/30 hover:bg-orange-500/30"
              >
                <Calendar className="w-4 h-4 mr-2" />
                Lên Lịch
              </Button>
              <Button
                onClick={() => setShowScheduleMaintenance(false)}
                className="bg-slate-700/50 text-slate-400 hover:bg-slate-600/50"
              >
                Hủy
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Track Location Modal */}
      {showTrackLocation && (
        <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-white flex items-center gap-2">
                <MapPin className="w-5 h-5 text-blue-400" />
                Theo Dõi Vị Trí Xe
              </CardTitle>
              <Button
                onClick={() => setShowTrackLocation(false)}
                className="bg-slate-700/50 text-slate-400 hover:bg-slate-600/50 p-2"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              {vehicles.map(vehicle => (
                <div key={vehicle.id} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Truck className="w-5 h-5 text-blue-400" />
                    <div>
                      <div className="text-white font-medium">{vehicle.licensePlate}</div>
                      <div className="text-slate-400 text-sm">{vehicle.driverName}</div>
                    </div>
                  </div>
                  <Button
                    onClick={() => handleTrackLocation(vehicle.id)}
                    className="bg-blue-500/20 text-blue-400 border border-blue-500/30 hover:bg-blue-500/30"
                  >
                    <MapPin className="w-4 h-4 mr-2" />
                    Xem Vị Trí
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Current Vehicles */}
      <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-white">Danh Sách Xe Hiện Tại</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3">
            {vehicles.map(vehicle => (
              <div key={vehicle.id} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <Truck className="w-5 h-5 text-blue-400" />
                  <div>
                    <div className="text-white font-medium">{vehicle.licensePlate} - {vehicle.vehicleType}</div>
                    <div className="text-slate-400 text-sm">{vehicle.driverName} • {vehicle.driverPhone}</div>
                  </div>
                </div>
                <Badge className={`${
                  vehicle.status === 'Active' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                  vehicle.status === 'Loading' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' :
                  'bg-gray-500/20 text-gray-400 border-gray-500/30'
                }`}>
                  {vehicle.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Maintenance Schedule */}
      <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-white">Lịch Bảo Trì</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3">
            {maintenanceSchedules.map(maintenance => (
              <div key={maintenance.id} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <Wrench className="w-5 h-5 text-orange-400" />
                  <div>
                    <div className="text-white font-medium">{maintenance.licensePlate} - {maintenance.type}</div>
                    <div className="text-slate-400 text-sm">{maintenance.description}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-white font-medium">
                    {new Intl.NumberFormat('vi-VN').format(maintenance.estimatedCost)} ₫
                  </div>
                  <div className="text-slate-400 text-sm">{maintenance.scheduledDate}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InteractiveFleetActions;
