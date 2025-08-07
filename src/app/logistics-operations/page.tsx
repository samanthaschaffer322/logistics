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
  Label,
  Badge,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Progress
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
  Pause,
  Plus,
  X,
  Users,
  Gauge
} from 'lucide-react'

// Generate realistic logistics operations data
const generateOperationsData = () => {
  const operations = [
    {
      id: 'OP-001',
      name: 'TP.HCM → Hà Nội Express',
      status: 'active',
      type: 'long_haul',
      vehicles: 5,
      distance: 1720,
      duration: 28,
      cost: 45000000,
      efficiency: 92,
      fuel_consumption: 35.2,
      on_time_rate: 94,
      cargo_types: ['Electronics', 'Textiles', 'Food Products'],
      last_updated: '2025-01-07 14:30'
    },
    {
      id: 'OP-002', 
      name: 'Cái Mép Port Distribution',
      status: 'active',
      type: 'port_distribution',
      vehicles: 12,
      distance: 85,
      duration: 2.5,
      cost: 8500000,
      efficiency: 88,
      fuel_consumption: 28.7,
      on_time_rate: 98,
      cargo_types: ['Containers', 'Import Goods', 'Export Goods'],
      last_updated: '2025-01-07 15:45'
    },
    {
      id: 'OP-003',
      name: 'Mekong Delta Circuit',
      status: 'planning',
      type: 'regional',
      vehicles: 8,
      distance: 450,
      duration: 12,
      cost: 18000000,
      efficiency: 85,
      fuel_consumption: 32.1,
      on_time_rate: 89,
      cargo_types: ['Agricultural Products', 'Seafood', 'Rice'],
      last_updated: '2025-01-07 10:15'
    },
    {
      id: 'OP-004',
      name: 'Industrial Zone Shuttle',
      status: 'active',
      type: 'shuttle',
      vehicles: 15,
      distance: 25,
      duration: 1,
      cost: 3200000,
      efficiency: 95,
      fuel_consumption: 22.5,
      on_time_rate: 96,
      cargo_types: ['Manufacturing Parts', 'Raw Materials', 'Finished Goods'],
      last_updated: '2025-01-07 16:20'
    }
  ]

  const vehicles = [
    {
      id: 'VH-001',
      license_plate: '51A-12345',
      type: '40ft Container',
      status: 'in_transit',
      driver: 'Nguyễn Văn A',
      current_location: 'Đồng Nai',
      destination: 'TP.HCM',
      cargo: 'Electronics',
      fuel_level: 75,
      maintenance_due: '2025-02-15',
      last_service: '2024-12-20'
    },
    {
      id: 'VH-002',
      license_plate: '29B-67890',
      type: '20ft Container',
      status: 'loading',
      driver: 'Trần Thị B',
      current_location: 'Cái Mép Port',
      destination: 'Biên Hòa',
      cargo: 'Import Goods',
      fuel_level: 90,
      maintenance_due: '2025-03-10',
      last_service: '2025-01-05'
    },
    {
      id: 'VH-003',
      license_plate: '43C-11111',
      type: 'Standard Truck',
      status: 'available',
      driver: 'Lê Văn C',
      current_location: 'Depot Tân Vạn',
      destination: null,
      cargo: null,
      fuel_level: 85,
      maintenance_due: '2025-01-20',
      last_service: '2024-11-15'
    }
  ]

  const drivers = [
    {
      id: 'DR-001',
      name: 'Nguyễn Văn A',
      license: 'B2, C, D',
      experience: 8,
      rating: 4.8,
      trips_completed: 1250,
      on_time_rate: 96,
      safety_score: 98,
      current_status: 'driving',
      phone: '0901234567'
    },
    {
      id: 'DR-002',
      name: 'Trần Thị B',
      license: 'B2, C',
      experience: 5,
      rating: 4.6,
      trips_completed: 890,
      on_time_rate: 94,
      safety_score: 95,
      current_status: 'loading',
      phone: '0907654321'
    },
    {
      id: 'DR-003',
      name: 'Lê Văn C',
      license: 'B2, C, D, E',
      experience: 12,
      rating: 4.9,
      trips_completed: 2100,
      on_time_rate: 98,
      safety_score: 99,
      current_status: 'available',
      phone: '0909876543'
    }
  ]

  const statistics = {
    totalOperations: operations.length,
    activeOperations: operations.filter(op => op.status === 'active').length,
    totalVehicles: vehicles.length,
    activeVehicles: vehicles.filter(v => v.status !== 'available').length,
    totalDrivers: drivers.length,
    availableDrivers: drivers.filter(d => d.current_status === 'available').length,
    avgEfficiency: Math.round(operations.reduce((sum, op) => sum + op.efficiency, 0) / operations.length),
    totalDistance: operations.reduce((sum, op) => sum + op.distance, 0),
    totalCost: operations.reduce((sum, op) => sum + op.cost, 0)
  }

  return { operations, vehicles, drivers, statistics }
}

const LogisticsOperationsPage = () => {
  const [activeTab, setActiveTab] = useState('overview')
  const [isLoading, setIsLoading] = useState(true)
  const [data, setData] = useState(null)
  const [selectedOperation, setSelectedOperation] = useState(null)
  const [realTimeUpdates, setRealTimeUpdates] = useState(true)

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setData(generateOperationsData())
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  // Simulate real-time updates
  useEffect(() => {
    if (!realTimeUpdates || !data) return

    const interval = setInterval(() => {
      setData(prevData => {
        const newData = { ...prevData }
        // Update vehicle fuel levels and locations randomly
        newData.vehicles = newData.vehicles.map(vehicle => ({
          ...vehicle,
          fuel_level: Math.max(20, vehicle.fuel_level - Math.random() * 2)
        }))
        return newData
      })
    }, 5000)

    return () => clearInterval(interval)
  }, [realTimeUpdates, data])

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'planning': return 'bg-yellow-100 text-yellow-800'
      case 'paused': return 'bg-red-100 text-red-800'
      case 'in_transit': return 'bg-blue-100 text-blue-800'
      case 'loading': return 'bg-purple-100 text-purple-800'
      case 'available': return 'bg-gray-100 text-gray-800'
      case 'driving': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active': return <Play className="w-4 h-4" />
      case 'planning': return <Clock className="w-4 h-4" />
      case 'paused': return <Pause className="w-4 h-4" />
      case 'in_transit': return <Truck className="w-4 h-4" />
      case 'loading': return <Package className="w-4 h-4" />
      case 'available': return <CheckCircle className="w-4 h-4" />
      case 'driving': return <Navigation className="w-4 h-4" />
      default: return <Activity className="w-4 h-4" />
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0
    }).format(amount)
  }

  if (isLoading || !data) {
    return (
      <AuthGuard>
        <div className="min-h-screen bg-slate-900 p-6">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-white mb-2">Logistics Operations</h1>
              <p className="text-slate-400">Real-time operations management and optimization</p>
            </div>
            
            <div className="text-center text-slate-400">
              <Truck className="w-8 h-8 mx-auto mb-2 animate-spin" />
              <p>Loading operations data...</p>
            </div>
          </div>
        </div>
      </AuthGuard>
    )
  }

  const { operations, vehicles, drivers, statistics } = data

  return (
    <AuthGuard>
      <div className="min-h-screen bg-slate-900 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">Logistics Operations</h1>
                <p className="text-slate-400">Real-time operations management and optimization</p>
              </div>
              
              <div className="flex items-center gap-4">
                <Button
                  onClick={() => setRealTimeUpdates(!realTimeUpdates)}
                  variant={realTimeUpdates ? "default" : "outline"}
                  className={realTimeUpdates ? "bg-green-600 hover:bg-green-700" : "text-white border-slate-600"}
                >
                  {realTimeUpdates ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                  {realTimeUpdates ? 'Pause Updates' : 'Resume Updates'}
                </Button>
                
                <Button className="bg-indigo-600 hover:bg-indigo-700">
                  <Plus className="w-4 h-4 mr-2" />
                  New Operation
                </Button>
              </div>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Active Operations</p>
                    <p className="text-2xl font-bold text-slate-900">{statistics.activeOperations}</p>
                    <p className="text-sm text-slate-500">of {statistics.totalOperations} total</p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-full">
                    <Activity className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Fleet Utilization</p>
                    <p className="text-2xl font-bold text-slate-900">
                      {Math.round((statistics.activeVehicles / statistics.totalVehicles) * 100)}%
                    </p>
                    <p className="text-sm text-slate-500">{statistics.activeVehicles}/{statistics.totalVehicles} vehicles</p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-full">
                    <Truck className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Avg Efficiency</p>
                    <p className="text-2xl font-bold text-slate-900">{statistics.avgEfficiency}%</p>
                    <p className="text-sm text-slate-500">Operational efficiency</p>
                  </div>
                  <div className="p-3 bg-purple-100 rounded-full">
                    <Target className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Total Cost</p>
                    <p className="text-2xl font-bold text-slate-900">
                      {formatCurrency(statistics.totalCost)}
                    </p>
                    <p className="text-sm text-slate-500">Daily operations</p>
                  </div>
                  <div className="p-3 bg-orange-100 rounded-full">
                    <DollarSign className="w-6 h-6 text-orange-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="bg-slate-800 border-slate-700">
              <TabsTrigger value="overview" className="text-white">Overview</TabsTrigger>
              <TabsTrigger value="operations" className="text-white">Operations</TabsTrigger>
              <TabsTrigger value="vehicles" className="text-white">Fleet</TabsTrigger>
              <TabsTrigger value="drivers" className="text-white">Drivers</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="w-5 h-5" />
                      Operations Performance
                    </CardTitle>
                    <CardDescription>Real-time performance metrics</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {operations.map((operation) => (
                        <div key={operation.id} className="p-4 bg-slate-50 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              {getStatusIcon(operation.status)}
                              <span className="font-medium">{operation.name}</span>
                            </div>
                            <Badge className={getStatusColor(operation.status)}>
                              {operation.status}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-3 gap-4 text-sm">
                            <div>
                              <span className="text-slate-600">Efficiency:</span>
                              <div className="flex items-center gap-2 mt-1">
                                <Progress value={operation.efficiency} className="h-2 flex-1" />
                                <span className="font-medium">{operation.efficiency}%</span>
                              </div>
                            </div>
                            <div>
                              <span className="text-slate-600">Vehicles:</span>
                              <p className="font-medium">{operation.vehicles} active</p>
                            </div>
                            <div>
                              <span className="text-slate-600">On-time:</span>
                              <p className="font-medium">{operation.on_time_rate}%</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Gauge className="w-5 h-5" />
                      Real-time Monitoring
                    </CardTitle>
                    <CardDescription>Live system status and alerts</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-5 h-5 text-green-600" />
                          <span className="text-sm font-medium">System Status</span>
                        </div>
                        <Badge className="bg-green-100 text-green-800">Operational</Badge>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <Activity className="w-5 h-5 text-blue-600" />
                          <span className="text-sm font-medium">GPS Tracking</span>
                        </div>
                        <Badge className="bg-blue-100 text-blue-800">Active</Badge>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="w-5 h-5 text-yellow-600" />
                          <span className="text-sm font-medium">Maintenance Due</span>
                        </div>
                        <Badge className="bg-yellow-100 text-yellow-800">1 Vehicle</Badge>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <Fuel className="w-5 h-5 text-purple-600" />
                          <span className="text-sm font-medium">Fuel Monitoring</span>
                        </div>
                        <Badge className="bg-purple-100 text-purple-800">Normal</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="operations" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Operations Management
                  </CardTitle>
                  <CardDescription>Monitor and control all logistics operations</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b bg-slate-50">
                          <th className="text-left p-3 font-medium">Operation</th>
                          <th className="text-left p-3 font-medium">Type</th>
                          <th className="text-left p-3 font-medium">Status</th>
                          <th className="text-left p-3 font-medium">Vehicles</th>
                          <th className="text-left p-3 font-medium">Distance</th>
                          <th className="text-left p-3 font-medium">Efficiency</th>
                          <th className="text-left p-3 font-medium">Cost</th>
                          <th className="text-left p-3 font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {operations.map((operation) => (
                          <tr key={operation.id} className="border-b hover:bg-slate-50">
                            <td className="p-3 font-medium">{operation.name}</td>
                            <td className="p-3">
                              <Badge className="bg-slate-100 text-slate-800">
                                {operation.type.replace('_', ' ')}
                              </Badge>
                            </td>
                            <td className="p-3">
                              <Badge className={getStatusColor(operation.status)}>
                                {operation.status}
                              </Badge>
                            </td>
                            <td className="p-3">{operation.vehicles}</td>
                            <td className="p-3">{operation.distance} km</td>
                            <td className="p-3">
                              <div className="flex items-center gap-2">
                                <Progress value={operation.efficiency} className="h-2 w-16" />
                                <span className="text-xs">{operation.efficiency}%</span>
                              </div>
                            </td>
                            <td className="p-3">{formatCurrency(operation.cost)}</td>
                            <td className="p-3">
                              <div className="flex items-center gap-2">
                                <Button size="sm" variant="outline">
                                  <Play className="w-4 h-4" />
                                </Button>
                                <Button size="sm" variant="outline">
                                  <Pause className="w-4 h-4" />
                                </Button>
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
                {vehicles.map((vehicle) => (
                  <Card key={vehicle.id}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Truck className="w-5 h-5" />
                        {vehicle.license_plate}
                      </CardTitle>
                      <CardDescription>{vehicle.type}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between">
                          <span className="text-sm text-slate-600">Status</span>
                          <Badge className={getStatusColor(vehicle.status)}>
                            {vehicle.status.replace('_', ' ')}
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-slate-600">Driver</span>
                          <span className="font-medium">{vehicle.driver}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-slate-600">Location</span>
                          <span className="font-medium">{vehicle.current_location}</span>
                        </div>
                        {vehicle.destination && (
                          <div className="flex justify-between">
                            <span className="text-sm text-slate-600">Destination</span>
                            <span className="font-medium">{vehicle.destination}</span>
                          </div>
                        )}
                        <div>
                          <div className="flex justify-between mb-2">
                            <span className="text-sm text-slate-600">Fuel Level</span>
                            <span className="text-sm font-medium">{Math.round(vehicle.fuel_level)}%</span>
                          </div>
                          <Progress 
                            value={vehicle.fuel_level} 
                            className={`h-2 ${vehicle.fuel_level < 30 ? 'bg-red-200' : 'bg-green-200'}`} 
                          />
                        </div>
                        {vehicle.cargo && (
                          <div className="flex justify-between">
                            <span className="text-sm text-slate-600">Cargo</span>
                            <span className="font-medium">{vehicle.cargo}</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="drivers" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {drivers.map((driver) => (
                  <Card key={driver.id}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Users className="w-5 h-5" />
                        {driver.name}
                      </CardTitle>
                      <CardDescription>License: {driver.license}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between">
                          <span className="text-sm text-slate-600">Status</span>
                          <Badge className={getStatusColor(driver.current_status)}>
                            {driver.current_status}
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-slate-600">Experience</span>
                          <span className="font-medium">{driver.experience} years</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-slate-600">Rating</span>
                          <span className="font-medium">⭐ {driver.rating}/5.0</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-slate-600">Trips</span>
                          <span className="font-medium">{driver.trips_completed.toLocaleString()}</span>
                        </div>
                        <div>
                          <div className="flex justify-between mb-2">
                            <span className="text-sm text-slate-600">On-time Rate</span>
                            <span className="text-sm font-medium">{driver.on_time_rate}%</span>
                          </div>
                          <Progress value={driver.on_time_rate} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between mb-2">
                            <span className="text-sm text-slate-600">Safety Score</span>
                            <span className="text-sm font-medium">{driver.safety_score}%</span>
                          </div>
                          <Progress value={driver.safety_score} className="h-2" />
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-slate-600">Phone</span>
                          <span className="font-medium">{driver.phone}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AuthGuard>
  )
}

export default LogisticsOperationsPage
