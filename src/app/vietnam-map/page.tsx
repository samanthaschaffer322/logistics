'use client'

import React, { useState, useEffect } from 'react'
import Layout from '@/components/Layout'
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  Button,
  Input,
  Badge,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui-components'
import { 
  Map, 
  Navigation, 
  MapPin, 
  Route, 
  Clock, 
  DollarSign, 
  Fuel, 
  AlertTriangle,
  CheckCircle,
  Truck,
  Calculator,
  Zap
} from 'lucide-react'

interface RouteData {
  distance: number
  duration: string
  fuelCost: number
  tollCost: number
  totalCost: number
  riskLevel: 'low' | 'medium' | 'high'
  recommendations: string[]
}

const VietnamMapPage = () => {
  const [departure, setDeparture] = useState('')
  const [destination, setDestination] = useState('')
  const [vehicleType, setVehicleType] = useState('truck')
  const [routeData, setRouteData] = useState<RouteData | null>(null)
  const [isCalculating, setIsCalculating] = useState(false)
  const [mapCenter, setMapCenter] = useState({ lat: 16.0583, lng: 108.2772 }) // Vietnam center

  // Major Vietnamese cities for suggestions
  const majorCities = [
    'Ho Chi Minh City', 'Hanoi', 'Da Nang', 'Hai Phong', 'Can Tho',
    'Bien Hoa', 'Hue', 'Nha Trang', 'Buon Ma Thuot', 'Quy Nhon',
    'Vung Tau', 'Nam Dinh', 'Phan Thiet', 'Long Xuyen', 'Thai Nguyen',
    'Thanh Hoa', 'Rach Gia', 'Cam Ranh', 'Vinh Long', 'My Tho'
  ]

  const calculateRoute = async () => {
    if (!departure.trim() || !destination.trim()) {
      alert('Please enter both departure and destination locations')
      return
    }

    setIsCalculating(true)
    
    // Simulate route calculation with realistic Vietnamese logistics data
    setTimeout(() => {
      const distance = Math.floor(Math.random() * 1500) + 100 // 100-1600 km
      const baseSpeed = vehicleType === 'truck' ? 45 : 60 // km/h
      const duration = Math.ceil(distance / baseSpeed)
      
      const fuelConsumption = vehicleType === 'truck' ? 0.25 : 0.15 // L/km
      const fuelPrice = 24000 // VND per liter
      const fuelCost = distance * fuelConsumption * fuelPrice
      
      const tollCost = distance * (vehicleType === 'truck' ? 800 : 500) // VND per km
      const totalCost = fuelCost + tollCost
      
      // Determine risk level based on distance and route
      let riskLevel: 'low' | 'medium' | 'high' = 'low'
      if (distance > 800) riskLevel = 'medium'
      if (distance > 1200) riskLevel = 'high'
      
      const recommendations = [
        `Optimal departure time: 5:00-7:00 AM to avoid traffic`,
        `Estimated fuel stops: ${Math.ceil(distance / 400)} stops needed`,
        `Weather check recommended for ${destination}`,
        `Alternative route via Highway ${Math.floor(Math.random() * 20) + 1} available`
      ]

      setRouteData({
        distance,
        duration: `${duration} hours`,
        fuelCost: Math.round(fuelCost),
        tollCost: Math.round(tollCost),
        totalCost: Math.round(totalCost),
        riskLevel,
        recommendations
      })
      
      setIsCalculating(false)
    }, 2000)
  }

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low': return 'bg-green-100 text-green-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'high': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount)
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Map className="w-8 h-8 text-blue-600" />
              Vietnam Map & Route Optimization
            </h1>
            <p className="text-gray-600 mt-1">
              Smart route planning with real-time optimization for Vietnamese logistics
            </p>
          </div>
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            AI-Powered Routing
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Route Planning Panel */}
          <div className="lg:col-span-1 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Navigation className="w-5 h-5 text-blue-600" />
                  Route Planning
                </CardTitle>
                <CardDescription>
                  Enter departure and destination for optimal route calculation
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Departure Location
                  </label>
                  <Input
                    value={departure}
                    onChange={(e) => setDeparture(e.target.value)}
                    placeholder="Enter departure city (e.g., Ho Chi Minh City)"
                    className="w-full"
                    list="cities-list"
                  />
                  <datalist id="cities-list">
                    {majorCities.map(city => (
                      <option key={city} value={city} />
                    ))}
                  </datalist>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Destination Location
                  </label>
                  <Input
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    placeholder="Enter destination city (e.g., Hanoi)"
                    className="w-full"
                    list="cities-list"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Vehicle Type
                  </label>
                  <Select value={vehicleType} onValueChange={setVehicleType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="truck">Truck (Heavy)</SelectItem>
                      <SelectItem value="van">Van (Medium)</SelectItem>
                      <SelectItem value="car">Car (Light)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  onClick={calculateRoute}
                  disabled={isCalculating || !departure.trim() || !destination.trim()}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  {isCalculating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Calculating Route...
                    </>
                  ) : (
                    <>
                      <Route className="w-4 h-4 mr-2" />
                      Calculate Optimal Route
                    </>
                  )}
                </Button>

                {/* Quick Route Buttons */}
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700">Quick Routes:</p>
                  <div className="grid grid-cols-1 gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setDeparture('Ho Chi Minh City')
                        setDestination('Hanoi')
                      }}
                      className="text-left justify-start"
                    >
                      HCMC → Hanoi
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setDeparture('Da Nang')
                        setDestination('Ho Chi Minh City')
                      }}
                      className="text-left justify-start"
                    >
                      Da Nang → HCMC
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setDeparture('Hanoi')
                        setDestination('Hai Phong')
                      }}
                      className="text-left justify-start"
                    >
                      Hanoi → Hai Phong
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Route Results */}
            {routeData && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calculator className="w-5 h-5 text-green-600" />
                    Route Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <MapPin className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                      <p className="text-sm text-gray-600">Distance</p>
                      <p className="font-bold text-blue-600">{routeData.distance} km</p>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <Clock className="w-5 h-5 text-green-600 mx-auto mb-1" />
                      <p className="text-sm text-gray-600">Duration</p>
                      <p className="font-bold text-green-600">{routeData.duration}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Fuel Cost:</span>
                      <span className="font-medium">{formatCurrency(routeData.fuelCost)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Toll Cost:</span>
                      <span className="font-medium">{formatCurrency(routeData.tollCost)}</span>
                    </div>
                    <div className="flex justify-between items-center border-t pt-2">
                      <span className="font-medium">Total Cost:</span>
                      <span className="font-bold text-lg text-blue-600">
                        {formatCurrency(routeData.totalCost)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Risk Level:</span>
                    <Badge className={getRiskColor(routeData.riskLevel)}>
                      {routeData.riskLevel.toUpperCase()}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Map Display */}
          <div className="lg:col-span-2">
            <Card className="h-[600px]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Map className="w-5 h-5 text-blue-600" />
                  Interactive Vietnam Map
                </CardTitle>
                <CardDescription>
                  Visual route display with real-time traffic and logistics data
                </CardDescription>
              </CardHeader>
              <CardContent className="h-full p-0">
                <div className="w-full h-full bg-gradient-to-br from-blue-50 to-green-50 rounded-b-lg flex items-center justify-center relative overflow-hidden">
                  {/* Simplified Vietnam Map Representation */}
                  <div className="relative w-full h-full flex items-center justify-center">
                    <div className="text-center space-y-4">
                      <div className="w-64 h-96 bg-green-200 rounded-lg relative mx-auto shadow-lg">
                        {/* Vietnam shape approximation */}
                        <div className="absolute inset-0 bg-gradient-to-b from-green-300 to-green-400 rounded-lg">
                          {/* Major cities markers */}
                          <div className="absolute top-8 left-1/2 transform -translate-x-1/2">
                            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                            <span className="text-xs font-medium text-gray-700 absolute -bottom-5 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                              Hanoi
                            </span>
                          </div>
                          <div className="absolute bottom-8 right-8">
                            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                            <span className="text-xs font-medium text-gray-700 absolute -bottom-5 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                              HCMC
                            </span>
                          </div>
                          <div className="absolute top-1/2 right-4 transform -translate-y-1/2">
                            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                            <span className="text-xs font-medium text-gray-700 absolute -bottom-5 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                              Da Nang
                            </span>
                          </div>
                          
                          {/* Route line if both locations are set */}
                          {departure && destination && routeData && (
                            <div className="absolute inset-0">
                              <svg className="w-full h-full">
                                <path
                                  d="M 128 60 Q 140 200 180 320"
                                  stroke="#3B82F6"
                                  strokeWidth="3"
                                  fill="none"
                                  strokeDasharray="5,5"
                                  className="animate-pulse"
                                />
                              </svg>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {!departure || !destination ? (
                        <div className="text-gray-500">
                          <MapPin className="w-8 h-8 mx-auto mb-2" />
                          <p className="font-medium">Enter departure and destination</p>
                          <p className="text-sm">to see route visualization</p>
                        </div>
                      ) : routeData ? (
                        <div className="bg-white rounded-lg p-4 shadow-lg max-w-sm mx-auto">
                          <div className="flex items-center gap-2 mb-2">
                            <CheckCircle className="w-5 h-5 text-green-600" />
                            <span className="font-medium">Route Calculated</span>
                          </div>
                          <p className="text-sm text-gray-600">
                            {departure} → {destination}
                          </p>
                          <p className="text-lg font-bold text-blue-600">
                            {routeData.distance} km • {routeData.duration}
                          </p>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* AI Recommendations */}
        {routeData && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-500" />
                AI-Powered Recommendations
              </CardTitle>
              <CardDescription>
                Smart insights and optimization suggestions for your route
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {routeData.recommendations.map((rec, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
                    <Zap className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-gray-700">{rec}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  )
}

export default VietnamMapPage
