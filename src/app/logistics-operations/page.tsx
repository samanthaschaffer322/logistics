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
  Navigation,
  Clock,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  BarChart3,
  Zap,
  Target,
  Package,
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
                    Automatically consolidate orders based on distance, cargo type, and truck capacity
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-6">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">
                          {orders.filter(o => o.status === 'pending').length}
                        </div>
                        <div className="text-sm text-slate-600">Pending Orders</div>
                      </div>
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">
                          {trucks.filter(t => t.status === 'available').length}
                        </div>
                        <div className="text-sm text-slate-600">Available Trucks</div>
                      </div>
                      <div className="text-center p-4 bg-purple-50 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">{trips.length}</div>
                        <div className="text-sm text-slate-600">Generated Trips</div>
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
                          Processing AI Consolidation...
                        </>
                      ) : (
                        <>
                          <Zap className="w-4 h-4 mr-2" />
                          Start AI Consolidation
                        </>
                      )}
                    </Button>
                  </div>

                  {/* Real-time Processing Status */}
                  {isProcessing && (
                    <div className="mb-6 p-4 bg-indigo-50 border border-indigo-200 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Brain className="w-5 h-5 text-indigo-600" />
                        <span className="font-medium text-indigo-800">AI Processing Status</span>
                      </div>
                      <div className="space-y-2 text-sm text-indigo-700">
                        <div>✓ Analyzing order locations and requirements</div>
                        <div>✓ Matching compatible cargo types</div>
                        <div>✓ Optimizing truck capacity utilization</div>
                        <div>⏳ Calculating optimal routes and schedules</div>
                      </div>
                    </div>
                  )}
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

            {/* Cost Calculation Tab */}
            <TabsContent value="cost-calculation" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calculator className="w-5 h-5" />
                    Advanced Cost Calculation
                  </CardTitle>
                  <CardDescription>
                    Real-time cost analysis for Vietnam logistics operations
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {trips.length > 0 ? (
                    <div className="space-y-6">
                      {/* Cost Overview */}
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                          <Fuel className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                          <p className="text-2xl font-bold text-blue-600">
                            {trips.reduce((sum, trip) => sum + trip.estimated_fuel_l, 0).toFixed(1)}L
                          </p>
                          <p className="text-sm text-slate-600">Total Fuel</p>
                        </div>
                        
                        <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                          <Navigation className="w-8 h-8 text-green-600 mx-auto mb-2" />
                          <p className="text-2xl font-bold text-green-600">
                            {trips.reduce((sum, trip) => sum + trip.total_distance_km, 0).toFixed(0)} km
                          </p>
                          <p className="text-sm text-slate-600">Total Distance</p>
                        </div>
                        
                        <div className="text-center p-4 bg-orange-50 rounded-lg border border-orange-200">
                          <DollarSign className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                          <p className="text-2xl font-bold text-orange-600">
                            {(trips.reduce((sum, trip) => sum + trip.estimated_toll_vnd, 0) / 1000000).toFixed(1)}M
                          </p>
                          <p className="text-sm text-slate-600">Toll Costs (VNĐ)</p>
                        </div>
                        
                        <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
                          <TrendingUp className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                          <p className="text-2xl font-bold text-purple-600">
                            {(trips.reduce((sum, trip) => sum + trip.total_cost_vnd, 0) / 1000000).toFixed(1)}M
                          </p>
                          <p className="text-sm text-slate-600">Total Cost (VNĐ)</p>
                        </div>
                      </div>

                      {/* Detailed Cost Breakdown */}
                      <div className="space-y-4">
                        <h4 className="font-semibold text-lg">Cost Breakdown by Trip</h4>
                        {trips.map((trip) => (
                          <div key={trip.id} className="p-4 border rounded-lg bg-slate-50">
                            <div className="flex items-center justify-between mb-3">
                              <div className="font-medium">{trip.id}</div>
                              <Badge className="bg-blue-100 text-blue-800">
                                {trip.orders.length} orders
                              </Badge>
                            </div>
                            
                            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                              <div>
                                <div className="font-medium text-slate-700">Distance</div>
                                <div className="text-slate-600">{trip.total_distance_km.toFixed(0)} km</div>
                              </div>
                              <div>
                                <div className="font-medium text-slate-700">Fuel</div>
                                <div className="text-slate-600">{trip.estimated_fuel_l.toFixed(1)}L</div>
                              </div>
                              <div>
                                <div className="font-medium text-slate-700">Fuel Cost</div>
                                <div className="text-slate-600">
                                  {(trip.estimated_fuel_l * 26500).toLocaleString()} VNĐ
                                </div>
                              </div>
                              <div>
                                <div className="font-medium text-slate-700">Toll</div>
                                <div className="text-slate-600">
                                  {trip.estimated_toll_vnd.toLocaleString()} VNĐ
                                </div>
                              </div>
                              <div>
                                <div className="font-medium text-slate-700">Total</div>
                                <div className="text-slate-600 font-bold">
                                  {trip.total_cost_vnd.toLocaleString()} VNĐ
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-slate-400">
                      <Calculator className="w-16 h-16 mx-auto mb-4 opacity-50" />
                      <p>Generate trips first to see cost calculations</p>
                      <Button 
                        onClick={() => setActiveTab('consolidation')}
                        className="mt-3"
                        variant="outline"
                      >
                        Go to Trip Consolidation
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Monitoring Tab */}
            <TabsContent value="monitoring" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    Real-time Operations Monitoring
                  </CardTitle>
                  <CardDescription>
                    Live tracking and monitoring of logistics operations
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {trips.length > 0 ? (
                    <div className="space-y-6">
                      {/* Status Overview */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                          <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                          <p className="text-2xl font-bold text-green-600">
                            {trips.filter(t => t.status === 'planned').length}
                          </p>
                          <p className="text-sm text-slate-600">Planned Trips</p>
                        </div>
                        
                        <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                          <Activity className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                          <p className="text-2xl font-bold text-blue-600">
                            {trips.filter(t => t.status === 'in_progress').length}
                          </p>
                          <p className="text-sm text-slate-600">In Progress</p>
                        </div>
                        
                        <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-200">
                          <Target className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                          <p className="text-2xl font-bold text-gray-600">
                            {trips.filter(t => t.status === 'completed').length}
                          </p>
                          <p className="text-sm text-slate-600">Completed</p>
                        </div>
                      </div>

                      {/* Live Trip Status */}
                      <div className="space-y-4">
                        <h4 className="font-semibold text-lg">Live Trip Status</h4>
                        {trips.map((trip) => (
                          <div key={trip.id} className="p-4 border rounded-lg">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-3">
                                <div className="font-medium">{trip.id}</div>
                                <Badge className={
                                  trip.status === 'planned' ? 'bg-yellow-100 text-yellow-800' :
                                  trip.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                                  'bg-green-100 text-green-800'
                                }>
                                  {trip.status.replace('_', ' ').toUpperCase()}
                                </Badge>
                              </div>
                              <div className="text-sm text-slate-600">
                                Driver: {trip.truck.driver_name}
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                              <div>
                                <div className="font-medium text-slate-700">Truck</div>
                                <div className="text-slate-600">{trip.truck.plate_number}</div>
                              </div>
                              <div>
                                <div className="font-medium text-slate-700">Orders</div>
                                <div className="text-slate-600">{trip.orders.length} items</div>
                              </div>
                              <div>
                                <div className="font-medium text-slate-700">Progress</div>
                                <div className="text-slate-600">
                                  {trip.status === 'planned' ? '0%' : 
                                   trip.status === 'in_progress' ? '45%' : '100%'}
                                </div>
                              </div>
                              <div>
                                <div className="font-medium text-slate-700">ETA</div>
                                <div className="text-slate-600">
                                  {new Date(trip.estimated_end_time).toLocaleTimeString()}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-slate-400">
                      <Activity className="w-16 h-16 mx-auto mb-4 opacity-50" />
                      <p>No active trips to monitor</p>
                      <Button 
                        onClick={() => setActiveTab('consolidation')}
                        className="mt-3"
                        variant="outline"
                      >
                        Create Trips to Monitor
                      </Button>
                    </div>
                  )}
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
