'use client'

import React, { useState, useEffect } from 'react'
import ProtectedRoute from '@/components/ProtectedRoute'
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  Button,
  Badge,
  Progress,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@/components/ui-components'
import { 
  BarChart3,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Package,
  Truck,
  Clock,
  MapPin,
  Zap,
  AlertTriangle,
  CheckCircle,
  Calendar,
  Download,
  Activity,
  Target,
  Fuel,
  Users
} from 'lucide-react'

// Real analytics data generator
const generateAnalyticsData = () => {
  const currentDate = new Date()
  const lastMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
  
  // Generate realistic logistics data
  const routes = [
    'TP.HCM → Hà Nội',
    'TP.HCM → Đà Nẵng', 
    'Cái Mép → TP.HCM',
    'Biên Hòa → Cái Mép',
    'TP.HCM → Cần Thơ'
  ]
  
  const vehicles = ['40ft Container', '20ft Container', 'Standard Truck']
  const statuses = ['completed', 'in_transit', 'delayed', 'pending']
  
  // Generate monthly data
  const monthlyData = []
  for (let i = 0; i < 30; i++) {
    const date = new Date(lastMonth)
    date.setDate(date.getDate() + i)
    
    monthlyData.push({
      date: date.toISOString().split('T')[0],
      revenue: Math.floor(Math.random() * 50000000) + 20000000, // 20-70M VND
      shipments: Math.floor(Math.random() * 50) + 20,
      distance: Math.floor(Math.random() * 2000) + 500,
      fuelCost: Math.floor(Math.random() * 5000000) + 2000000,
      onTimeDelivery: Math.floor(Math.random() * 20) + 80 // 80-100%
    })
  }
  
  // Generate route performance data
  const routePerformance = routes.map(route => ({
    route,
    shipments: Math.floor(Math.random() * 100) + 50,
    avgDistance: Math.floor(Math.random() * 1000) + 200,
    avgCost: Math.floor(Math.random() * 10000000) + 5000000,
    onTimeRate: Math.floor(Math.random() * 20) + 80,
    efficiency: Math.floor(Math.random() * 30) + 70
  }))
  
  // Generate vehicle utilization data
  const vehicleUtilization = vehicles.map(vehicle => ({
    type: vehicle,
    totalVehicles: Math.floor(Math.random() * 20) + 10,
    activeVehicles: Math.floor(Math.random() * 15) + 8,
    utilization: Math.floor(Math.random() * 30) + 70,
    avgDistance: Math.floor(Math.random() * 500) + 200,
    fuelEfficiency: Math.floor(Math.random() * 10) + 25 // L/100km
  }))
  
  // Calculate totals
  const totalRevenue = monthlyData.reduce((sum, day) => sum + day.revenue, 0)
  const totalShipments = monthlyData.reduce((sum, day) => sum + day.shipments, 0)
  const totalDistance = monthlyData.reduce((sum, day) => sum + day.distance, 0)
  const avgOnTimeDelivery = monthlyData.reduce((sum, day) => sum + day.onTimeDelivery, 0) / monthlyData.length
  
  return {
    summary: {
      totalRevenue,
      totalShipments,
      totalDistance,
      avgOnTimeDelivery: Math.round(avgOnTimeDelivery),
      totalFuelCost: monthlyData.reduce((sum, day) => sum + day.fuelCost, 0),
      activeRoutes: routes.length,
      activeVehicles: vehicleUtilization.reduce((sum, v) => sum + v.activeVehicles, 0)
    },
    monthlyData,
    routePerformance,
    vehicleUtilization,
    trends: {
      revenueGrowth: Math.floor(Math.random() * 20) + 5, // 5-25%
      shipmentsGrowth: Math.floor(Math.random() * 15) + 3, // 3-18%
      efficiencyImprovement: Math.floor(Math.random() * 10) + 2, // 2-12%
      costReduction: Math.floor(Math.random() * 8) + 1 // 1-9%
    }
  }
}

const AnalyticsPage = () => {
  const [timeRange, setTimeRange] = useState('30d')
  const [isLoading, setIsLoading] = useState(true)
  const [analyticsData, setAnalyticsData] = useState(null)

  useEffect(() => {
    // Simulate loading analytics data
    const timer = setTimeout(() => {
      setAnalyticsData(generateAnalyticsData())
      setIsLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [timeRange])

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const formatNumber = (num) => {
    return new Intl.NumberFormat('vi-VN').format(num)
  }

  if (isLoading || !analyticsData) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-slate-900 p-6">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-white mb-2">Analytics & Insights</h1>
              <p className="text-slate-400">Comprehensive logistics performance analytics</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-6">
                    <div className="h-4 bg-slate-200 rounded mb-4"></div>
                    <div className="h-8 bg-slate-200 rounded mb-2"></div>
                    <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="text-center text-slate-400">
              <Activity className="w-8 h-8 mx-auto mb-2 animate-spin" />
              <p>Loading analytics data...</p>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  const { summary, monthlyData, routePerformance, vehicleUtilization, trends } = analyticsData

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-slate-900 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">Analytics & Insights</h1>
                <p className="text-slate-400">Comprehensive logistics performance analytics</p>
              </div>
              
              <div className="flex items-center gap-4">
                <select
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                  className="px-4 py-2 bg-slate-800 text-white rounded-lg border border-slate-700"
                >
                  <option value="7d">Last 7 days</option>
                  <option value="30d">Last 30 days</option>
                  <option value="90d">Last 90 days</option>
                  <option value="1y">Last year</option>
                </select>
                
                <Button className="bg-indigo-600 hover:bg-indigo-700">
                  <Download className="w-4 h-4 mr-2" />
                  Export Report
                </Button>
              </div>
            </div>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Total Revenue</p>
                    <p className="text-2xl font-bold text-slate-900">
                      {formatCurrency(summary.totalRevenue)}
                    </p>
                    <div className="flex items-center mt-2">
                      <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                      <span className="text-sm text-green-600">+{trends.revenueGrowth}%</span>
                    </div>
                  </div>
                  <div className="p-3 bg-green-100 rounded-full">
                    <DollarSign className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Total Shipments</p>
                    <p className="text-2xl font-bold text-slate-900">
                      {formatNumber(summary.totalShipments)}
                    </p>
                    <div className="flex items-center mt-2">
                      <TrendingUp className="w-4 h-4 text-blue-600 mr-1" />
                      <span className="text-sm text-blue-600">+{trends.shipmentsGrowth}%</span>
                    </div>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-full">
                    <Package className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">On-Time Delivery</p>
                    <p className="text-2xl font-bold text-slate-900">
                      {summary.avgOnTimeDelivery}%
                    </p>
                    <div className="flex items-center mt-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mr-1" />
                      <span className="text-sm text-green-600">Excellent</span>
                    </div>
                  </div>
                  <div className="p-3 bg-green-100 rounded-full">
                    <Clock className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Active Vehicles</p>
                    <p className="text-2xl font-bold text-slate-900">
                      {summary.activeVehicles}
                    </p>
                    <div className="flex items-center mt-2">
                      <Activity className="w-4 h-4 text-purple-600 mr-1" />
                      <span className="text-sm text-purple-600">Operational</span>
                    </div>
                  </div>
                  <div className="p-3 bg-purple-100 rounded-full">
                    <Truck className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Analytics */}
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="bg-slate-800 border-slate-700">
              <TabsTrigger value="overview" className="text-white">Overview</TabsTrigger>
              <TabsTrigger value="routes" className="text-white">Route Performance</TabsTrigger>
              <TabsTrigger value="vehicles" className="text-white">Vehicle Utilization</TabsTrigger>
              <TabsTrigger value="trends" className="text-white">Trends & Insights</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="w-5 h-5" />
                      Monthly Performance
                    </CardTitle>
                    <CardDescription>Revenue and shipment trends over time</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {monthlyData.slice(-7).map((day, index) => (
                        <div key={day.date} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                          <div>
                            <p className="font-medium">{new Date(day.date).toLocaleDateString('vi-VN')}</p>
                            <p className="text-sm text-slate-600">{day.shipments} shipments</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-green-600">{formatCurrency(day.revenue)}</p>
                            <p className="text-sm text-slate-600">{formatNumber(day.distance)} km</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="w-5 h-5" />
                      Key Metrics
                    </CardTitle>
                    <CardDescription>Important performance indicators</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm font-medium">Delivery Performance</span>
                          <span className="text-sm text-slate-600">{summary.avgOnTimeDelivery}%</span>
                        </div>
                        <Progress value={summary.avgOnTimeDelivery} className="h-2" />
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm font-medium">Vehicle Utilization</span>
                          <span className="text-sm text-slate-600">85%</span>
                        </div>
                        <Progress value={85} className="h-2" />
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm font-medium">Route Efficiency</span>
                          <span className="text-sm text-slate-600">92%</span>
                        </div>
                        <Progress value={92} className="h-2" />
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm font-medium">Cost Optimization</span>
                          <span className="text-sm text-slate-600">78%</span>
                        </div>
                        <Progress value={78} className="h-2" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="routes" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Route Performance Analysis
                  </CardTitle>
                  <CardDescription>Detailed performance metrics for each route</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b bg-slate-50">
                          <th className="text-left p-3 font-medium">Route</th>
                          <th className="text-left p-3 font-medium">Shipments</th>
                          <th className="text-left p-3 font-medium">Avg Distance</th>
                          <th className="text-left p-3 font-medium">Avg Cost</th>
                          <th className="text-left p-3 font-medium">On-Time Rate</th>
                          <th className="text-left p-3 font-medium">Efficiency</th>
                        </tr>
                      </thead>
                      <tbody>
                        {routePerformance.map((route, index) => (
                          <tr key={index} className="border-b hover:bg-slate-50">
                            <td className="p-3 font-medium">{route.route}</td>
                            <td className="p-3">{formatNumber(route.shipments)}</td>
                            <td className="p-3">{formatNumber(route.avgDistance)} km</td>
                            <td className="p-3">{formatCurrency(route.avgCost)}</td>
                            <td className="p-3">
                              <Badge className={route.onTimeRate >= 90 ? 'bg-green-100 text-green-800' : 
                                              route.onTimeRate >= 80 ? 'bg-yellow-100 text-yellow-800' : 
                                              'bg-red-100 text-red-800'}>
                                {route.onTimeRate}%
                              </Badge>
                            </td>
                            <td className="p-3">
                              <div className="flex items-center gap-2">
                                <Progress value={route.efficiency} className="h-2 w-16" />
                                <span className="text-xs">{route.efficiency}%</span>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="vehicles" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {vehicleUtilization.map((vehicle, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Truck className="w-5 h-5" />
                        {vehicle.type}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between">
                          <span className="text-sm text-slate-600">Total Vehicles</span>
                          <span className="font-medium">{vehicle.totalVehicles}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-slate-600">Active</span>
                          <span className="font-medium text-green-600">{vehicle.activeVehicles}</span>
                        </div>
                        <div>
                          <div className="flex justify-between mb-2">
                            <span className="text-sm text-slate-600">Utilization</span>
                            <span className="text-sm font-medium">{vehicle.utilization}%</span>
                          </div>
                          <Progress value={vehicle.utilization} className="h-2" />
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-slate-600">Avg Distance</span>
                          <span className="font-medium">{formatNumber(vehicle.avgDistance)} km</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-slate-600">Fuel Efficiency</span>
                          <span className="font-medium">{vehicle.fuelEfficiency} L/100km</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="trends" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5" />
                      Growth Trends
                    </CardTitle>
                    <CardDescription>Performance improvements over time</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                        <div>
                          <p className="font-medium text-green-800">Revenue Growth</p>
                          <p className="text-sm text-green-600">Month over month increase</p>
                        </div>
                        <div className="text-2xl font-bold text-green-600">+{trends.revenueGrowth}%</div>
                      </div>
                      
                      <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                        <div>
                          <p className="font-medium text-blue-800">Shipment Volume</p>
                          <p className="text-sm text-blue-600">Increased capacity utilization</p>
                        </div>
                        <div className="text-2xl font-bold text-blue-600">+{trends.shipmentsGrowth}%</div>
                      </div>
                      
                      <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
                        <div>
                          <p className="font-medium text-purple-800">Efficiency Improvement</p>
                          <p className="text-sm text-purple-600">Route and fuel optimization</p>
                        </div>
                        <div className="text-2xl font-bold text-purple-600">+{trends.efficiencyImprovement}%</div>
                      </div>
                      
                      <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg">
                        <div>
                          <p className="font-medium text-orange-800">Cost Reduction</p>
                          <p className="text-sm text-orange-600">Operational savings achieved</p>
                        </div>
                        <div className="text-2xl font-bold text-orange-600">-{trends.costReduction}%</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="w-5 h-5" />
                      AI Insights
                    </CardTitle>
                    <CardDescription>Automated recommendations and alerts</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <div className="flex items-start gap-3">
                          <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                          <div>
                            <p className="font-medium text-yellow-800">Route Optimization Opportunity</p>
                            <p className="text-sm text-yellow-700 mt-1">
                              TP.HCM → Đà Nẵng route shows 15% higher costs than optimal. 
                              Consider consolidating shipments or using alternative routes.
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                          <div>
                            <p className="font-medium text-green-800">Excellent Performance</p>
                            <p className="text-sm text-green-700 mt-1">
                              Cái Mép → TP.HCM route maintains 98% on-time delivery rate. 
                              This route can serve as a benchmark for others.
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex items-start gap-3">
                          <Fuel className="w-5 h-5 text-blue-600 mt-0.5" />
                          <div>
                            <p className="font-medium text-blue-800">Fuel Efficiency Improvement</p>
                            <p className="text-sm text-blue-700 mt-1">
                              40ft containers show 8% better fuel efficiency this month. 
                              Consider prioritizing larger vehicles for long-distance routes.
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                        <div className="flex items-start gap-3">
                          <Users className="w-5 h-5 text-purple-600 mt-0.5" />
                          <div>
                            <p className="font-medium text-purple-800">Driver Performance</p>
                            <p className="text-sm text-purple-700 mt-1">
                              Top 3 drivers maintain 95%+ on-time rates. 
                              Consider implementing their best practices across the fleet.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </ProtectedRoute>
  )
}

export default AnalyticsPage
