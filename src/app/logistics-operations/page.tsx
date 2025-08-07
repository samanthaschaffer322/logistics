'use client'

import React, { useState, useEffect } from 'react'
import Layout from '@/components/Layout'
import { useLanguage } from '@/contexts/LanguageContext'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import { 
  Truck, 
  MapPin, 
  Clock, 
  DollarSign, 
  Fuel, 
  AlertTriangle,
  CheckCircle,
  Activity,
  Users,
  Package,
  Navigation,
  Zap,
  BarChart3,
  TrendingUp,
  Gauge,
  Wrench,
  Shield,
  Radio,
  Wifi,
  Battery,
  Thermometer
} from 'lucide-react'

interface Vehicle {
  id: string
  name: string
  type: 'container_40ft' | 'container_20ft' | 'flatbed' | 'refrigerated'
  status: 'active' | 'maintenance' | 'idle' | 'emergency'
  location: { lat: number; lng: number; address: string }
  driver: string
  route: string
  progress: number
  fuel: number
  speed: number
  temperature?: number
  lastUpdate: Date
}

interface Operation {
  id: string
  type: 'delivery' | 'pickup' | 'transfer' | 'maintenance'
  priority: 'high' | 'medium' | 'low'
  status: 'pending' | 'in_progress' | 'completed' | 'delayed'
  vehicle: string
  route: string
  estimatedTime: number
  actualTime?: number
  cost: number
  cargo: string
  weight: number
}

const LogisticsOperationsPage = () => {
  const { language, t } = useLanguage()
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [operations, setOperations] = useState<Operation[]>([])
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null)
  const [isRealTimeActive, setIsRealTimeActive] = useState(true)

  // Initialize data
  useEffect(() => {
    const initialVehicles: Vehicle[] = [
      {
        id: 'VN-001',
        name: 'Container Truck 001',
        type: 'container_40ft',
        status: 'active',
        location: { lat: 10.8231, lng: 106.6297, address: 'TP. Hồ Chí Minh' },
        driver: 'Nguyễn Văn A',
        route: 'TP.HCM → Hà Nội',
        progress: 65,
        fuel: 78,
        speed: 65,
        lastUpdate: new Date()
      },
      {
        id: 'VN-002',
        name: 'Container Truck 002',
        type: 'container_20ft',
        status: 'active',
        location: { lat: 16.0544, lng: 108.2022, address: 'Đà Nẵng' },
        driver: 'Trần Văn B',
        route: 'Đà Nẵng → TP.HCM',
        progress: 45,
        fuel: 45,
        speed: 58,
        lastUpdate: new Date()
      },
      {
        id: 'VN-003',
        name: 'Refrigerated Truck 003',
        type: 'refrigerated',
        status: 'active',
        location: { lat: 21.0285, lng: 105.8542, address: 'Hà Nội' },
        driver: 'Lê Văn C',
        route: 'Hà Nội → Hải Phòng',
        progress: 80,
        fuel: 92,
        speed: 45,
        temperature: -18,
        lastUpdate: new Date()
      },
      {
        id: 'VN-004',
        name: 'Flatbed Truck 004',
        type: 'flatbed',
        status: 'maintenance',
        location: { lat: 10.0452, lng: 105.7469, address: 'Cần Thơ' },
        driver: 'Phạm Văn D',
        route: 'Depot Cần Thơ',
        progress: 0,
        fuel: 25,
        speed: 0,
        lastUpdate: new Date()
      }
    ]

    const initialOperations: Operation[] = [
      {
        id: 'OP-001',
        type: 'delivery',
        priority: 'high',
        status: 'in_progress',
        vehicle: 'VN-001',
        route: 'TP.HCM → Hà Nội',
        estimatedTime: 18,
        cost: 15000000,
        cargo: 'Electronics',
        weight: 28500
      },
      {
        id: 'OP-002',
        type: 'pickup',
        priority: 'medium',
        status: 'pending',
        vehicle: 'VN-002',
        route: 'Đà Nẵng → TP.HCM',
        estimatedTime: 12,
        cost: 8500000,
        cargo: 'Textiles',
        weight: 15200
      },
      {
        id: 'OP-003',
        type: 'delivery',
        priority: 'high',
        status: 'in_progress',
        vehicle: 'VN-003',
        route: 'Hà Nội → Hải Phòng',
        estimatedTime: 3,
        cost: 2800000,
        cargo: 'Frozen Food',
        weight: 12000
      },
      {
        id: 'OP-004',
        type: 'maintenance',
        priority: 'low',
        status: 'pending',
        vehicle: 'VN-004',
        route: 'Depot Cần Thơ',
        estimatedTime: 8,
        cost: 5000000,
        cargo: 'N/A',
        weight: 0
      }
    ]

    setVehicles(initialVehicles)
    setOperations(initialOperations)
  }, [])

  // Real-time updates simulation
  useEffect(() => {
    if (!isRealTimeActive) return

    const interval = setInterval(() => {
      setVehicles(prev => prev.map(vehicle => {
        if (vehicle.status === 'active') {
          return {
            ...vehicle,
            progress: Math.min(100, vehicle.progress + Math.random() * 2),
            fuel: Math.max(10, vehicle.fuel - Math.random() * 0.5),
            speed: 45 + Math.random() * 30,
            lastUpdate: new Date()
          }
        }
        return vehicle
      }))
    }, 5000)

    return () => clearInterval(interval)
  }, [isRealTimeActive])

  const getVehicleStatusColor = (status: Vehicle['status']) => {
    switch (status) {
      case 'active': return 'text-green-400 bg-green-500/10 border-green-500/20'
      case 'maintenance': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20'
      case 'idle': return 'text-blue-400 bg-blue-500/10 border-blue-500/20'
      case 'emergency': return 'text-red-400 bg-red-500/10 border-red-500/20'
      default: return 'text-gray-400 bg-gray-500/10 border-gray-500/20'
    }
  }

  const getOperationStatusColor = (status: Operation['status']) => {
    switch (status) {
      case 'completed': return 'text-green-400 bg-green-500/10'
      case 'in_progress': return 'text-blue-400 bg-blue-500/10'
      case 'delayed': return 'text-red-400 bg-red-500/10'
      case 'pending': return 'text-yellow-400 bg-yellow-500/10'
      default: return 'text-gray-400 bg-gray-500/10'
    }
  }

  const getPriorityColor = (priority: Operation['priority']) => {
    switch (priority) {
      case 'high': return 'text-red-400'
      case 'medium': return 'text-yellow-400'
      case 'low': return 'text-green-400'
      default: return 'text-gray-400'
    }
  }

  const getVehicleIcon = (type: Vehicle['type']) => {
    switch (type) {
      case 'container_40ft':
      case 'container_20ft':
        return <Package className="w-5 h-5" />
      case 'refrigerated':
        return <Thermometer className="w-5 h-5" />
      case 'flatbed':
        return <Truck className="w-5 h-5" />
      default:
        return <Truck className="w-5 h-5" />
    }
  }

  const activeVehicles = vehicles.filter(v => v.status === 'active').length
  const totalOperations = operations.length
  const completedOperations = operations.filter(op => op.status === 'completed').length
  const avgEfficiency = Math.round((completedOperations / totalOperations) * 100) || 85

  return (
    <Layout>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold gradient-text flex items-center gap-3">
              <Activity className="w-8 h-8 text-indigo-400" />
              {language === 'vi' ? 'Trung tâm Vận hành Logistics' : 'Logistics Operations Center'}
            </h1>
            <p className="text-slate-400 mt-1">
              {language === 'vi' 
                ? 'Quản lý và tối ưu hóa vận hành thời gian thực với AI'
                : 'Real-time operations management and optimization with AI'
              }
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${isRealTimeActive ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`}></div>
              <span className="text-sm text-slate-400">
                {isRealTimeActive ? (language === 'vi' ? 'Trực tuyến' : 'Live') : (language === 'vi' ? 'Tạm dừng' : 'Paused')}
              </span>
              <button
                onClick={() => setIsRealTimeActive(!isRealTimeActive)}
                className="text-indigo-400 hover:text-indigo-300 text-sm"
              >
                {isRealTimeActive ? (language === 'vi' ? 'Tạm dừng' : 'Pause') : (language === 'vi' ? 'Tiếp tục' : 'Resume')}
              </button>
            </div>
            <LanguageSwitcher />
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="dark-card p-4">
            <div className="flex items-center gap-3">
              <Truck className="w-8 h-8 text-blue-400" />
              <div>
                <div className="text-2xl font-bold text-white">{activeVehicles}</div>
                <div className="text-sm text-slate-400">
                  {language === 'vi' ? 'Xe hoạt động' : 'Active Vehicles'}
                </div>
              </div>
            </div>
          </div>

          <div className="dark-card p-4">
            <div className="flex items-center gap-3">
              <Activity className="w-8 h-8 text-green-400" />
              <div>
                <div className="text-2xl font-bold text-white">{totalOperations}</div>
                <div className="text-sm text-slate-400">
                  {language === 'vi' ? 'Hoạt động' : 'Operations'}
                </div>
              </div>
            </div>
          </div>

          <div className="dark-card p-4">
            <div className="flex items-center gap-3">
              <Gauge className="w-8 h-8 text-purple-400" />
              <div>
                <div className="text-2xl font-bold text-white">{avgEfficiency}%</div>
                <div className="text-sm text-slate-400">
                  {language === 'vi' ? 'Hiệu suất' : 'Efficiency'}
                </div>
              </div>
            </div>
          </div>

          <div className="dark-card p-4">
            <div className="flex items-center gap-3">
              <DollarSign className="w-8 h-8 text-yellow-400" />
              <div>
                <div className="text-2xl font-bold text-white">
                  {(operations.reduce((sum, op) => sum + op.cost, 0) / 1000000).toFixed(1)}M
                </div>
                <div className="text-sm text-slate-400">
                  {language === 'vi' ? 'Tổng giá trị' : 'Total Value'}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Vehicle Fleet Status */}
          <div className="lg:col-span-2 dark-card p-6">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <Truck className="w-6 h-6 text-indigo-400" />
              {language === 'vi' ? 'Trạng thái Đội xe' : 'Fleet Status'}
            </h2>
            
            <div className="space-y-4">
              {vehicles.map(vehicle => (
                <div 
                  key={vehicle.id}
                  className={`p-4 rounded-xl border cursor-pointer transition-all duration-300 hover:scale-[1.02] ${
                    selectedVehicle?.id === vehicle.id 
                      ? 'border-indigo-500 bg-indigo-500/10' 
                      : 'border-slate-700 bg-slate-800/50'
                  }`}
                  onClick={() => setSelectedVehicle(vehicle)}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${getVehicleStatusColor(vehicle.status)}`}>
                        {getVehicleIcon(vehicle.type)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">{vehicle.name}</h3>
                        <p className="text-sm text-slate-400">{vehicle.driver}</p>
                      </div>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getVehicleStatusColor(vehicle.status)}`}>
                      {vehicle.status.toUpperCase()}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-slate-400" />
                      <span className="text-slate-300">{vehicle.location.address}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Navigation className="w-4 h-4 text-slate-400" />
                      <span className="text-slate-300">{vehicle.progress}%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Fuel className="w-4 h-4 text-slate-400" />
                      <span className={`${vehicle.fuel < 30 ? 'text-red-400' : 'text-slate-300'}`}>
                        {vehicle.fuel}%
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Gauge className="w-4 h-4 text-slate-400" />
                      <span className="text-slate-300">{vehicle.speed} km/h</span>
                    </div>
                  </div>

                  {vehicle.type === 'refrigerated' && vehicle.temperature && (
                    <div className="mt-2 flex items-center gap-2 text-sm">
                      <Thermometer className="w-4 h-4 text-blue-400" />
                      <span className="text-blue-300">{vehicle.temperature}°C</span>
                    </div>
                  )}

                  <div className="mt-3">
                    <div className="flex justify-between text-xs text-slate-400 mb-1">
                      <span>{language === 'vi' ? 'Tiến độ' : 'Progress'}</span>
                      <span>{vehicle.progress}%</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${vehicle.progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Operations & Alerts */}
          <div className="space-y-6">
            {/* Current Operations */}
            <div className="dark-card p-4">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5 text-green-400" />
                {language === 'vi' ? 'Hoạt động hiện tại' : 'Current Operations'}
              </h3>
              
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {operations.map(operation => (
                  <div key={operation.id} className="p-3 bg-slate-800 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-sm font-medium text-white">
                        {operation.vehicle} - {operation.route}
                      </div>
                      <div className={`px-2 py-1 rounded text-xs ${getOperationStatusColor(operation.status)}`}>
                        {operation.status}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="text-slate-400">
                        {language === 'vi' ? 'Hàng hóa:' : 'Cargo:'} {operation.cargo}
                      </div>
                      <div className="text-slate-400">
                        {language === 'vi' ? 'Trọng lượng:' : 'Weight:'} {operation.weight}kg
                      </div>
                      <div className="text-slate-400">
                        {language === 'vi' ? 'Thời gian:' : 'Time:'} {operation.estimatedTime}h
                      </div>
                      <div className={`${getPriorityColor(operation.priority)}`}>
                        {language === 'vi' ? 'Ưu tiên:' : 'Priority:'} {operation.priority}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* System Alerts */}
            <div className="dark-card p-4">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-yellow-400" />
                {language === 'vi' ? 'Cảnh báo hệ thống' : 'System Alerts'}
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-start gap-2 p-2 bg-yellow-500/10 rounded">
                  <Fuel className="w-4 h-4 text-yellow-400 mt-0.5" />
                  <div>
                    <div className="text-yellow-400 font-medium text-sm">
                      {language === 'vi' ? 'Nhiên liệu thấp' : 'Low Fuel'}
                    </div>
                    <div className="text-slate-400 text-xs">
                      VN-002: {language === 'vi' ? 'Còn 45% nhiên liệu' : '45% fuel remaining'}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-2 p-2 bg-red-500/10 rounded">
                  <Wrench className="w-4 h-4 text-red-400 mt-0.5" />
                  <div>
                    <div className="text-red-400 font-medium text-sm">
                      {language === 'vi' ? 'Bảo trì định kỳ' : 'Scheduled Maintenance'}
                    </div>
                    <div className="text-slate-400 text-xs">
                      VN-004: {language === 'vi' ? 'Cần bảo trì trong 2 ngày' : 'Maintenance due in 2 days'}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-2 p-2 bg-green-500/10 rounded">
                  <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
                  <div>
                    <div className="text-green-400 font-medium text-sm">
                      {language === 'vi' ? 'Hoàn thành' : 'Completed'}
                    </div>
                    <div className="text-slate-400 text-xs">
                      VN-003: {language === 'vi' ? 'Giao hàng thành công' : 'Delivery completed'}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Recommendations */}
            <div className="dark-card p-4">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-purple-400" />
                {language === 'vi' ? 'Khuyến nghị AI' : 'AI Recommendations'}
              </h3>
              
              <div className="space-y-3 text-sm">
                <div className="p-3 bg-purple-500/10 rounded border border-purple-500/20">
                  <div className="text-purple-400 font-medium mb-1">
                    {language === 'vi' ? 'Tối ưu tuyến đường' : 'Route Optimization'}
                  </div>
                  <div className="text-slate-300">
                    {language === 'vi' 
                      ? 'Có thể tiết kiệm 15% chi phí bằng cách điều chỉnh tuyến VN-001'
                      : 'Can save 15% costs by adjusting VN-001 route'
                    }
                  </div>
                </div>

                <div className="p-3 bg-blue-500/10 rounded border border-blue-500/20">
                  <div className="text-blue-400 font-medium mb-1">
                    {language === 'vi' ? 'Dự báo nhu cầu' : 'Demand Forecast'}
                  </div>
                  <div className="text-slate-300">
                    {language === 'vi' 
                      ? 'Nhu cầu vận chuyển tăng 20% tuần tới'
                      : 'Transportation demand will increase 20% next week'
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default LogisticsOperationsPage
