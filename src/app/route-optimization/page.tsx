'use client'

import React, { useState, useEffect } from 'react'
import AuthGuard from '@/components/AuthGuard'
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  Button,
  Input,
  Label
} from '@/components/ui-components'
import { 
  MapPin, 
  Navigation2, 
  Clock, 
  Fuel, 
  TrendingDown, 
  Navigation,
  Truck,
  Calculator,
  BarChart3,
  CheckCircle
} from 'lucide-react'

interface RoutePoint {
  id: string
  name: string
  address: string
  lat: number
  lng: number
  type: 'pickup' | 'delivery' | 'warehouse'
}

interface OptimizedRoute {
  id: string
  points: RoutePoint[]
  distance: number
  estimatedTime: number
  fuelCost: number
  savings: {
    distance: number
    time: number
    fuel: number
  }
}

const RouteOptimizationPage = () => {
  const [routes, setRoutes] = useState<RoutePoint[]>([])
  const [optimizedRoute, setOptimizedRoute] = useState<OptimizedRoute | null>(null)
  const [isOptimizing, setIsOptimizing] = useState(false)
  const [newPoint, setNewPoint] = useState({ name: '', address: '', type: 'pickup' as const })

  // Sample Vietnamese locations
  const sampleRoutes: RoutePoint[] = [
    {
      id: '1',
      name: 'Kho trung tâm TP.HCM',
      address: 'Quận 7, TP. Hồ Chí Minh',
      lat: 10.7769,
      lng: 106.7009,
      type: 'warehouse'
    },
    {
      id: '2',
      name: 'Siêu thị Metro Thủ Đức',
      address: 'TP. Thủ Đức, TP. Hồ Chí Minh',
      lat: 10.8411,
      lng: 106.8098,
      type: 'delivery'
    },
    {
      id: '3',
      name: 'Chợ Bến Thành',
      address: 'Quận 1, TP. Hồ Chí Minh',
      lat: 10.7720,
      lng: 106.6980,
      type: 'pickup'
    },
    {
      id: '4',
      name: 'Cảng Cát Lái',
      address: 'Quận 2, TP. Hồ Chí Minh',
      lat: 10.7950,
      lng: 106.7767,
      type: 'pickup'
    },
    {
      id: '5',
      name: 'Khu công nghiệp Tân Thuận',
      address: 'Quận 7, TP. Hồ Chí Minh',
      lat: 10.7378,
      lng: 106.7230,
      type: 'delivery'
    }
  ]

  useEffect(() => {
    setRoutes(sampleRoutes)
  }, [])

  const optimizeRoute = async () => {
    setIsOptimizing(true)
    
    // Simulate AI route optimization
    setTimeout(() => {
      const optimized: OptimizedRoute = {
        id: 'opt-1',
        points: [
          routes[0], // Start from warehouse
          routes[2], // Chợ Bến Thành
          routes[3], // Cảng Cát Lái
          routes[4], // KCN Tân Thuận
          routes[1], // Metro Thủ Đức
          routes[0]  // Return to warehouse
        ],
        distance: 85.5,
        estimatedTime: 180, // minutes
        fuelCost: 425000, // VND
        savings: {
          distance: 23.2,
          time: 45,
          fuel: 125000
        }
      }
      
      setOptimizedRoute(optimized)
      setIsOptimizing(false)
    }, 3000)
  }

  const addRoutePoint = () => {
    if (newPoint.name && newPoint.address) {
      const point: RoutePoint = {
        id: Date.now().toString(),
        name: newPoint.name,
        address: newPoint.address,
        lat: 10.7769 + (Math.random() - 0.5) * 0.1,
        lng: 106.7009 + (Math.random() - 0.5) * 0.1,
        type: newPoint.type
      }
      
      setRoutes(prev => [...prev, point])
      setNewPoint({ name: '', address: '', type: 'pickup' })
    }
  }

  const getPointTypeColor = (type: string) => {
    switch (type) {
      case 'warehouse': return 'bg-blue-100 text-blue-800'
      case 'pickup': return 'bg-green-100 text-green-800'
      case 'delivery': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPointTypeIcon = (type: string) => {
    switch (type) {
      case 'warehouse': return <MapPin className="w-4 h-4" />
      case 'pickup': return <Navigation className="w-4 h-4" />
      case 'delivery': return <Truck className="w-4 h-4" />
      default: return <MapPin className="w-4 h-4" />
    }
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-slate-900 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Route Optimization</h1>
            <p className="text-slate-400">
              Tối ưu hóa tuyến đường vận chuyển với AI để tiết kiệm thời gian và chi phí
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Route Points Management */}
            <div className="lg:col-span-1 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Điểm trên tuyến
                  </CardTitle>
                  <CardDescription>
                    Quản lý các điểm pickup và delivery
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="point-name">Tên điểm</Label>
                      <Input
                        id="point-name"
                        value={newPoint.name}
                        onChange={(e) => setNewPoint(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Nhập tên điểm"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="point-address">Địa chỉ</Label>
                      <Input
                        id="point-address"
                        value={newPoint.address}
                        onChange={(e) => setNewPoint(prev => ({ ...prev, address: e.target.value }))}
                        placeholder="Nhập địa chỉ"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="point-type">Loại điểm</Label>
                      <select
                        id="point-type"
                        value={newPoint.type}
                        onChange={(e) => setNewPoint(prev => ({ ...prev, type: e.target.value as any }))}
                        className="w-full p-2 border rounded-md"
                      >
                        <option value="pickup">Pickup</option>
                        <option value="delivery">Delivery</option>
                        <option value="warehouse">Warehouse</option>
                      </select>
                    </div>
                    
                    <Button onClick={addRoutePoint} className="w-full">
                      <MapPin className="w-4 h-4 mr-2" />
                      Thêm điểm
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Danh sách điểm</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {routes.map((point) => (
                      <div key={point.id} className="flex items-center gap-2 p-2 bg-slate-50 rounded">
                        {getPointTypeIcon(point.type)}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{point.name}</p>
                          <p className="text-xs text-slate-500 truncate">{point.address}</p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPointTypeColor(point.type)}`}>
                          {point.type}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Optimization Results */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Navigation2 className="w-5 h-5" />
                    AI Route Optimization
                  </CardTitle>
                  <CardDescription>
                    Sử dụng thuật toán AI để tối ưu tuyến đường
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    onClick={optimizeRoute}
                    disabled={routes.length < 2 || isOptimizing}
                    className="w-full mb-4"
                    size="lg"
                  >
                    {isOptimizing ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Đang tối ưu hóa...
                      </>
                    ) : (
                      <>
                        <Calculator className="w-4 h-4 mr-2" />
                        Tối ưu tuyến đường
                      </>
                    )}
                  </Button>

                  {optimizedRoute && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-3 gap-4">
                        <div className="text-center p-4 bg-blue-50 rounded-lg">
                          <Navigation2 className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                          <p className="text-2xl font-bold text-blue-600">{optimizedRoute.distance} km</p>
                          <p className="text-sm text-slate-600">Tổng quãng đường</p>
                        </div>
                        
                        <div className="text-center p-4 bg-green-50 rounded-lg">
                          <Clock className="w-8 h-8 text-green-600 mx-auto mb-2" />
                          <p className="text-2xl font-bold text-green-600">{Math.floor(optimizedRoute.estimatedTime / 60)}h {optimizedRoute.estimatedTime % 60}m</p>
                          <p className="text-sm text-slate-600">Thời gian ước tính</p>
                        </div>
                        
                        <div className="text-center p-4 bg-orange-50 rounded-lg">
                          <Fuel className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                          <p className="text-2xl font-bold text-orange-600">{optimizedRoute.fuelCost.toLocaleString('vi-VN')}</p>
                          <p className="text-sm text-slate-600">Chi phí nhiên liệu (VNĐ)</p>
                        </div>
                      </div>

                      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <h4 className="font-semibold text-green-800 mb-2 flex items-center gap-2">
                          <TrendingDown className="w-4 h-4" />
                          Tiết kiệm được
                        </h4>
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="font-medium text-green-700">{optimizedRoute.savings.distance} km</p>
                            <p className="text-green-600">Quãng đường</p>
                          </div>
                          <div>
                            <p className="font-medium text-green-700">{optimizedRoute.savings.time} phút</p>
                            <p className="text-green-600">Thời gian</p>
                          </div>
                          <div>
                            <p className="font-medium text-green-700">{optimizedRoute.savings.fuel.toLocaleString('vi-VN')} VNĐ</p>
                            <p className="text-green-600">Chi phí nhiên liệu</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {optimizedRoute && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5" />
                      Tuyến đường tối ưu
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {optimizedRoute.points.map((point, index) => (
                        <div key={`${point.id}-${index}`} className="flex items-center gap-3">
                          <div className="flex-shrink-0 w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-sm font-medium">
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">{point.name}</p>
                            <p className="text-sm text-slate-500">{point.address}</p>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPointTypeColor(point.type)}`}>
                            {point.type}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  )
}

export default RouteOptimizationPage
