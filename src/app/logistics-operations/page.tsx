'use client'

import React, { useState, useEffect } from 'react'
import AuthGuard from '@/components/AuthGuard'
import { useLanguage } from '@/contexts/LanguageContext'
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  Button,
  Input,
  Label,
  Badge,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@/components/ui-components'
import { 
  Brain, 
  Truck, 
  MapPin, 
  Calculator,
  Fuel,
  Route,
  Clock,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  BarChart3,
  Zap,
  Target,
  Package,
  Navigation,
  Activity,
  RefreshCw,
  Play,
  Pause
} from 'lucide-react'
import { 
  consolidateTrips, 
  ConsolidationResult,
  calculateDistance,
  calculateFuelConsumption,
  estimateToll
} from '@/lib/logisticsAlgorithms'

// Types for logistics operations
interface Order {
  id: string
  pickup_location: { lat: number; lng: number; address: string }
  dropoff_location: { lat: number; lng: number; address: string }
  load_type: 'dry' | 'frozen' | 'fragile' | 'liquid'
  weight_kg: number
  volume_m3: number
  scheduled_time: string
  status: 'pending' | 'assigned' | 'in_transit' | 'delivered'
  customer_id: string
  priority: 'low' | 'medium' | 'high'
  special_requirements?: string
}

interface Truck {
  id: string
  plate_number: string
  capacity_kg: number
  volume_m3: number
  load_types: string[]
  current_location: { lat: number; lng: number }
  status: 'available' | 'on_trip' | 'maintenance'
  driver_name: string
  fuel_efficiency: number
}

interface Trip {
  id: string
  orders: Order[]
  truck: Truck
  total_distance_km: number
  estimated_fuel_l: number
  estimated_toll_vnd: number
  total_cost_vnd: number
  status: 'planned' | 'in_progress' | 'completed'
  start_time: string
  estimated_end_time: string
  route_optimization_score: number
}

const LogisticsOperationsPage = () => {
  const { t } = useLanguage()
  const [orders, setOrders] = useState<Order[]>([])
  const [trucks, setTrucks] = useState<Truck[]>([])
  const [trips, setTrips] = useState<Trip[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [activeTab, setActiveTab] = useState('consolidation')
  const [autoMode, setAutoMode] = useState(false)

  // Initialize sample data
  useEffect(() => {
    initializeSampleData()
  }, [])

  const initializeSampleData = () => {
    // Sample orders
    const sampleOrders: Order[] = [
      {
        id: 'ORD001',
        pickup_location: { lat: 21.0285, lng: 105.8542, address: 'Hà Nội' },
        dropoff_location: { lat: 10.8231, lng: 106.6297, address: 'TP.HCM' },
        load_type: 'dry',
        weight_kg: 15000,
        volume_m3: 45,
        scheduled_time: '2025-08-07T08:00:00',
        status: 'pending',
        customer_id: 'CUST001',
        priority: 'high'
      },
      {
        id: 'ORD002',
        pickup_location: { lat: 21.0285, lng: 105.8542, address: 'Hà Nội' },
        dropoff_location: { lat: 16.0544, lng: 108.2022, address: 'Đà Nẵng' },
        load_type: 'frozen',
        weight_kg: 8000,
        volume_m3: 25,
        scheduled_time: '2025-08-07T09:00:00',
        status: 'pending',
        customer_id: 'CUST002',
        priority: 'medium'
      }
    ]

    // Sample trucks
    const sampleTrucks: Truck[] = [
      {
        id: 'TRK001',
        plate_number: '29C-12345',
        capacity_kg: 32000,
        volume_m3: 76,
        load_types: ['dry', 'fragile'],
        current_location: { lat: 21.0285, lng: 105.8542 },
        status: 'available',
        driver_name: 'Nguyễn Văn A',
        fuel_efficiency: 0.35
      },
      {
        id: 'TRK002',
        plate_number: '30G-67890',
        capacity_kg: 25000,
        volume_m3: 60,
        load_types: ['frozen', 'liquid'],
        current_location: { lat: 21.0285, lng: 105.8542 },
        status: 'available',
        driver_name: 'Trần Thị B',
        fuel_efficiency: 0.38
      }
    ]

    setOrders(sampleOrders)
    setTrucks(sampleTrucks)
  }

  const handleConsolidation = async () => {
    setIsProcessing(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 2000))
      const result = consolidateTrips(orders, trucks)
      setTrips(result.trips)
    } catch (error) {
      console.error('Consolidation error:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-slate-900 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">
                  {t('logistics.title')}
                </h1>
                <p className="text-slate-400">
                  {t('logistics.subtitle')}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Label htmlFor="auto-mode" className="text-white">{t('logistics.autoMode')}</Label>
                  <Button
                    id="auto-mode"
                    variant={autoMode ? "default" : "outline"}
                    size="sm"
                    onClick={() => setAutoMode(!autoMode)}
                    className={autoMode ? "bg-green-600 hover:bg-green-700" : ""}
                  >
                    {autoMode ? <Play className="w-4 h-4 mr-2" /> : <Pause className="w-4 h-4 mr-2" />}
                    {autoMode ? 'ON' : 'OFF'}
                  </Button>
                </div>
                <Button 
                  onClick={() => window.location.reload()} 
                  variant="outline"
                  size="sm"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  {t('logistics.refresh')}
                </Button>
              </div>
            </div>
          </div>

          {/* Main Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-5 bg-slate-800">
              <TabsTrigger value="consolidation" className="data-[state=active]:bg-indigo-600">
                <Package className="w-4 h-4 mr-2" />
                Ghép Lệnh
              </TabsTrigger>
              <TabsTrigger value="cost-calculation" className="data-[state=active]:bg-indigo-600">
                <Calculator className="w-4 h-4 mr-2" />
                Tính Chi Phí
              </TabsTrigger>
              <TabsTrigger value="monitoring" className="data-[state=active]:bg-indigo-600">
                <Activity className="w-4 h-4 mr-2" />
                Giám Sát
              </TabsTrigger>
              <TabsTrigger value="incidents" className="data-[state=active]:bg-indigo-600">
                <AlertTriangle className="w-4 h-4 mr-2" />
                Xử Lý Sự Cố
              </TabsTrigger>
              <TabsTrigger value="analytics" className="data-[state=active]:bg-indigo-600">
                <BarChart3 className="w-4 h-4 mr-2" />
                Phân Tích
              </TabsTrigger>
            </TabsList>

            {/* Trip Consolidation Tab */}
            <TabsContent value="consolidation" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="w-5 h-5" />
                    AI Trip Consolidation Engine
                  </CardTitle>
                  <CardDescription>
                    Tự động ghép lệnh thông minh dựa trên khoảng cách, loại hàng và tải trọng
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">
                          {orders.filter(o => o.status === 'pending').length}
                        </div>
                        <div className="text-sm text-slate-600">Đơn chờ xử lý</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">
                          {trucks.filter(t => t.status === 'available').length}
                        </div>
                        <div className="text-sm text-slate-600">Xe sẵn sàng</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">{trips.length}</div>
                        <div className="text-sm text-slate-600">Chuyến đã tạo</div>
                      </div>
                    </div>
                    
                    <Button
                      onClick={handleConsolidation}
                      disabled={isProcessing || orders.filter(o => o.status === 'pending').length === 0}
                      className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                    >
                      {isProcessing ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Đang xử lý...
                        </>
                      ) : (
                        <>
                          <Zap className="w-4 h-4 mr-2" />
                          Ghép lệnh ngay
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Orders and Trucks Display */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Đơn hàng chờ xử lý</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {orders.filter(o => o.status === 'pending').map((order) => (
                        <div key={order.id} className="p-3 border rounded-lg">
                          <div className="font-medium">{order.id}</div>
                          <div className="text-sm text-slate-600">
                            {order.pickup_location.address} → {order.dropoff_location.address}
                          </div>
                          <div className="text-sm text-slate-500">
                            {order.weight_kg.toLocaleString()} kg • {order.volume_m3} m³
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Xe sẵn sàng</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {trucks.filter(t => t.status === 'available').map((truck) => (
                        <div key={truck.id} className="p-3 border rounded-lg">
                          <div className="font-medium">{truck.plate_number}</div>
                          <div className="text-sm text-slate-600">
                            Tài xế: {truck.driver_name}
                          </div>
                          <div className="text-sm text-slate-500">
                            {truck.capacity_kg.toLocaleString()} kg • {truck.volume_m3} m³
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Generated Trips */}
              {trips.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Chuyến đã tạo ({trips.length})</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {trips.map((trip) => (
                        <div key={trip.id} className="p-4 border rounded-lg bg-slate-50">
                          <div className="flex items-center justify-between mb-3">
                            <div className="font-medium">{trip.id}</div>
                            <Badge className="bg-blue-100 text-blue-800">
                              {trip.status.toUpperCase()}
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="text-center">
                              <div className="text-lg font-bold text-blue-600">{trip.orders.length}</div>
                              <div className="text-xs text-slate-600">Đơn hàng</div>
                            </div>
                            <div className="text-center">
                              <div className="text-lg font-bold text-green-600">
                                {trip.total_distance_km.toFixed(0)} km
                              </div>
                              <div className="text-xs text-slate-600">Khoảng cách</div>
                            </div>
                            <div className="text-center">
                              <div className="text-lg font-bold text-purple-600">
                                {trip.estimated_fuel_l.toFixed(1)}L
                              </div>
                              <div className="text-xs text-slate-600">Nhiên liệu</div>
                            </div>
                            <div className="text-center">
                              <div className="text-lg font-bold text-orange-600">
                                {(trip.total_cost_vnd / 1000000).toFixed(1)}M
                              </div>
                              <div className="text-xs text-slate-600">Chi phí (VNĐ)</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Other tabs with basic content */}
            <TabsContent value="cost-calculation" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calculator className="w-5 h-5" />
                    Tính toán chi phí
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-slate-400">
                    <Calculator className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p>Chức năng tính chi phí sẽ được kích hoạt khi có chuyến được tạo</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="monitoring" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    Giám sát thời gian thực
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-slate-400">
                    <Activity className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p>Hệ thống giám sát sẽ hiển thị khi có chuyến đang vận chuyển</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="incidents" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" />
                    Xử lý sự cố
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-slate-400">
                    <AlertTriangle className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p>Hiện tại không có sự cố nào cần xử lý</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Phân tích hiệu suất
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-slate-400">
                    <BarChart3 className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p>Dữ liệu phân tích sẽ hiển thị khi có đủ lịch sử hoạt động</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AuthGuard>
  )
}

export default LogisticsOperationsPage
