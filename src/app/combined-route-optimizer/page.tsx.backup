'use client'

import React, { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { useLanguage } from '@/contexts/LanguageContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { 
  Navigation, 
  MapPin, 
  Truck, 
  Clock, 
  DollarSign, 
  Target,
  Zap,
  BarChart3,
  CheckCircle,
  Plus,
  Minus,
  Settings,
  Brain,
  FileText,
  Calculator,
  Download,
  Edit,
  Save,
  X
} from 'lucide-react'
import FileBasedRouteOptimizer from '@/components/FileBasedRouteOptimizer'
import { EnhancedRouteCalculator } from '@/utils/enhancedRouteCalculator'

// Dynamic import for Leaflet map to avoid SSR issues
const LeafletRouteMap = dynamic(() => import('@/components/LeafletRouteMap'), {
  ssr: false,
  loading: () => (
    <div style={{
      height: '400px',
      background: 'rgba(30, 41, 59, 0.8)',
      borderRadius: '15px',
      border: '2px solid rgba(139, 92, 246, 0.3)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column'
    }}>
      <div style={{ fontSize: '48px', marginBottom: '15px' }}>🗺️</div>
      <div style={{ color: '#8b5cf6', fontSize: '18px', fontWeight: 'bold' }}>Loading Interactive Map...</div>
    </div>
  )
})

export default function CombinedRouteOptimizerPage() {
  const { language } = useLanguage()
  const [activeView, setActiveView] = useState('simple')
  const [originQuery, setOriginQuery] = useState('')
  const [destinationQuery, setDestinationQuery] = useState('')
  const [selectedRoute, setSelectedRoute] = useState<any>(null)
  const [isCalculating, setIsCalculating] = useState(false)
  const [originSuggestions, setOriginSuggestions] = useState<any[]>([])
  const [destinationSuggestions, setDestinationSuggestions] = useState<any[]>([])
  const [showOriginSuggestions, setShowOriginSuggestions] = useState(false)
  const [showDestinationSuggestions, setShowDestinationSuggestions] = useState(false)
  
  // Multi-stop routing state
  const [multiStopLocations, setMultiStopLocations] = useState<any[]>([
    { id: '1', name: '', address: '', lat: 0, lng: 0, type: 'origin' },
    { id: '2', name: '', address: '', lat: 0, lng: 0, type: 'destination' }
  ])
  const [optimizedMultiRoute, setOptimizedMultiRoute] = useState<any>(null)
  
  // Vehicle configuration
  const [vehicleConfig, setVehicleConfig] = useState({
    type: 'truck',
    capacity: 10000, // kg
    fuelConsumption: 0.25, // L/km
    maxDistance: 500, // km per day
    driverCostPerHour: 50000 // VND
  })

  // Vietnamese locations database
  const vietnameseLocations = [
    // Major Cities
    { name: 'Hồ Chí Minh', lat: 10.8231, lng: 106.6297, province: 'Ho Chi Minh City', type: 'city' },
    { name: 'Hà Nội', lat: 21.0285, lng: 105.8542, province: 'Hanoi', type: 'city' },
    { name: 'Đà Nẵng', lat: 16.0471, lng: 108.2068, province: 'Da Nang', type: 'city' },
    { name: 'Cần Thơ', lat: 10.0452, lng: 105.7469, province: 'Can Tho', type: 'city' },
    { name: 'Hải Phòng', lat: 20.8449, lng: 106.6881, province: 'Hai Phong', type: 'city' },
    
    // Ports
    { name: 'Cảng Sài Gòn', lat: 10.7769, lng: 106.7009, province: 'Ho Chi Minh City', type: 'port' },
    { name: 'Cảng Cát Lái', lat: 10.7900, lng: 106.8100, province: 'Ho Chi Minh City', type: 'port' },
    { name: 'Cảng Hải Phòng', lat: 20.8658, lng: 106.6881, province: 'Hai Phong', type: 'port' },
    { name: 'Cảng Đà Nẵng', lat: 16.0678, lng: 108.2208, province: 'Da Nang', type: 'port' },
    
    // Industrial Zones
    { name: 'KCN Biên Hòa', lat: 10.9408, lng: 106.8228, province: 'Dong Nai', type: 'industrial' },
    { name: 'KCN Long Thành', lat: 10.8167, lng: 107.0000, province: 'Dong Nai', type: 'industrial' },
    { name: 'KCN Vsip Bình Dương', lat: 11.1271, lng: 106.6504, province: 'Binh Duong', type: 'industrial' },
    
    // Warehouses & Logistics Centers
    { name: 'Kho Hiệp Phước', lat: 10.7200, lng: 106.7500, province: 'Ho Chi Minh City', type: 'warehouse' },
    { name: 'Trung tâm Logistics Sóng Thần', lat: 10.8800, lng: 106.6200, province: 'Binh Duong', type: 'logistics' },
    
    // Additional common locations
    { name: 'TP. Hồ Chí Minh', lat: 10.8231, lng: 106.6297, province: 'Ho Chi Minh City', type: 'city' },
    { name: 'Ho Chi Minh City', lat: 10.8231, lng: 106.6297, province: 'Ho Chi Minh City', type: 'city' },
    { name: 'HCMC', lat: 10.8231, lng: 106.6297, province: 'Ho Chi Minh City', type: 'city' },
    { name: 'Saigon', lat: 10.8231, lng: 106.6297, province: 'Ho Chi Minh City', type: 'city' },
    { name: 'Biên Hòa', lat: 10.9460, lng: 106.8234, province: 'Dong Nai', type: 'city' },
    { name: 'Bien Hoa', lat: 10.9460, lng: 106.8234, province: 'Dong Nai', type: 'city' }
  ]

  const searchLocations = (query: string) => {
    if (!query.trim()) return []
    
    const normalizedQuery = query.toLowerCase()
      .replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a')
      .replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e')
      .replace(/ì|í|ị|ỉ|ĩ/g, 'i')
      .replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o')
      .replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u')
      .replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y')
      .replace(/đ/g, 'd')
    
    return vietnameseLocations.filter(location => {
      const normalizedName = location.name.toLowerCase()
        .replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a')
        .replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e')
        .replace(/ì|í|ị|ỉ|ĩ/g, 'i')
        .replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o')
        .replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u')
        .replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y')
        .replace(/đ/g, 'd')
      
      return normalizedName.includes(normalizedQuery) || 
             location.province.toLowerCase().includes(normalizedQuery)
    }).slice(0, 5)
  }

  const calculateRoute = async () => {
    if (!originQuery.trim() || !destinationQuery.trim()) {
      alert(language === 'vi' ? 'Vui lòng nhập điểm xuất phát và điểm đến' : 'Please enter both origin and destination locations')
      return
    }

    setIsCalculating(true)
    
    try {
      // Find coordinates for origin and destination
      const originLocation = vietnameseLocations.find(loc => 
        loc.name.toLowerCase().includes(originQuery.toLowerCase())
      )
      const destinationLocation = vietnameseLocations.find(loc => 
        loc.name.toLowerCase().includes(destinationQuery.toLowerCase())
      )

      if (!originLocation || !destinationLocation) {
        alert(language === 'vi' ? 'Không tìm thấy địa điểm. Vui lòng chọn từ danh sách gợi ý.' : 'Location not found. Please select from suggestions.')
        setIsCalculating(false)
        return
      }

      // Calculate route using enhanced calculator
      const calculator = new EnhancedRouteCalculator()
      const routeResult = await calculator.calculateOptimalRoute(
        { lat: originLocation.lat, lng: originLocation.lng, name: originLocation.name },
        { lat: destinationLocation.lat, lng: destinationLocation.lng, name: destinationLocation.name }
      )

      setSelectedRoute({
        ...routeResult,
        origin: originLocation,
        destination: destinationLocation
      })

    } catch (error) {
      console.error('Route calculation error:', error)
      alert(language === 'vi' ? 'Lỗi tính toán tuyến đường' : 'Route calculation error')
    } finally {
      setIsCalculating(false)
    }
  }

  const calculateMultiStopRoute = async () => {
    const validLocations = multiStopLocations.filter(loc => loc.name && loc.lat && loc.lng)
    if (validLocations.length < 2) {
      alert(language === 'vi' ? 'Cần ít nhất 2 địa điểm hợp lệ' : 'Need at least 2 valid locations')
      return
    }

    setIsCalculating(true)
    try {
      const calculator = new EnhancedRouteCalculator()
      const result = await calculator.calculateMultiStopRoute(validLocations)
      setOptimizedMultiRoute(result)
    } catch (error) {
      console.error('Multi-stop calculation error:', error)
      alert(language === 'vi' ? 'Lỗi tính toán tuyến đường đa điểm' : 'Multi-stop route calculation error')
    } finally {
      setIsCalculating(false)
    }
  }

  const addLocation = () => {
    const newId = (multiStopLocations.length + 1).toString()
    setMultiStopLocations([...multiStopLocations, {
      id: newId,
      name: '',
      address: '',
      lat: 0,
      lng: 0,
      type: 'waypoint'
    }])
  }

  const removeLocation = (id: string) => {
    if (multiStopLocations.length > 2) {
      setMultiStopLocations(multiStopLocations.filter(loc => loc.id !== id))
    }
  }

  const updateLocation = (id: string, field: string, value: any) => {
    setMultiStopLocations(multiStopLocations.map(loc => 
      loc.id === id ? { ...loc, [field]: value } : loc
    ))
  }
    if (!originQuery.trim() || !destinationQuery.trim()) {
      alert(language === 'vi' ? 'Vui lòng nhập điểm xuất phát và điểm đến' : 'Please enter both origin and destination locations')
      return
    }

    setIsCalculating(true)
    
    try {
      // Find coordinates for origin and destination
      const originLocation = vietnameseLocations.find(loc => 
        loc.name.toLowerCase().includes(originQuery.toLowerCase())
      )
      const destinationLocation = vietnameseLocations.find(loc => 
        loc.name.toLowerCase().includes(destinationQuery.toLowerCase())
      )

      if (!originLocation || !destinationLocation) {
        alert(language === 'vi' ? 'Không tìm thấy địa điểm. Vui lòng chọn từ danh sách gợi ý.' : 'Location not found. Please select from suggestions.')
        setIsCalculating(false)
        return
      }

      // Calculate route using enhanced calculator
      const calculator = new EnhancedRouteCalculator()
      const routeResult = await calculator.calculateOptimalRoute(
        { lat: originLocation.lat, lng: originLocation.lng, name: originLocation.name },
        { lat: destinationLocation.lat, lng: destinationLocation.lng, name: destinationLocation.name }
      )

      setSelectedRoute({
        ...routeResult,
        origin: originLocation,
        destination: destinationLocation
      })

    } catch (error) {
      console.error('Route calculation error:', error)
      alert(language === 'vi' ? 'Lỗi tính toán tuyến đường' : 'Route calculation error')
    } finally {
      setIsCalculating(false)
    }
  }

  // Handle input changes with suggestions
  const handleOriginChange = (value: string) => {
    setOriginQuery(value)
    if (value.trim()) {
      const suggestions = searchLocations(value)
      setOriginSuggestions(suggestions)
      setShowOriginSuggestions(suggestions.length > 0)
    } else {
      setShowOriginSuggestions(false)
    }
  }

  const handleDestinationChange = (value: string) => {
    setDestinationQuery(value)
    if (value.trim()) {
      const suggestions = searchLocations(value)
      setDestinationSuggestions(suggestions)
      setShowDestinationSuggestions(suggestions.length > 0)
    } else {
      setShowDestinationSuggestions(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
            {language === 'vi' ? 'Tối Ưu Tuyến Đường Kết Hợp' : 'Combined Route Optimizer Pro'}
          </h1>
          <p className="text-slate-300">
            {language === 'vi' 
              ? 'Tối ưu hóa tuyến đường thông minh với bản đồ tương tác và phân tích file'
              : 'Smart route optimization with interactive maps and file analysis'
            }
          </p>
          <Badge className="mt-2 bg-green-500/20 text-green-400 border-green-500/30">
            LogiAI V4.0 Enhanced
          </Badge>
        </div>

        {/* Enhanced View Toggle with Tabs */}
        <Tabs value={activeView} onValueChange={setActiveView} className="w-full">
          <TabsList className="grid w-full grid-cols-5 bg-slate-800/50 border border-slate-700">
            <TabsTrigger value="simple" className="data-[state=active]:bg-blue-600">
              <Navigation className="w-4 h-4 mr-2" />
              {language === 'vi' ? 'Đơn giản' : 'Simple'}
            </TabsTrigger>
            <TabsTrigger value="multi" className="data-[state=active]:bg-blue-600">
              <MapPin className="w-4 h-4 mr-2" />
              {language === 'vi' ? 'Đa điểm' : 'Multi-Stop'}
            </TabsTrigger>
            <TabsTrigger value="advanced" className="data-[state=active]:bg-blue-600">
              <Brain className="w-4 h-4 mr-2" />
              {language === 'vi' ? 'Nâng cao' : 'Advanced'}
            </TabsTrigger>
            <TabsTrigger value="file" className="data-[state=active]:bg-blue-600">
              <FileText className="w-4 h-4 mr-2" />
              {language === 'vi' ? 'File' : 'File Analysis'}
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-blue-600">
              <BarChart3 className="w-4 h-4 mr-2" />
              {language === 'vi' ? 'Phân tích' : 'Analytics'}
            </TabsTrigger>
          </TabsList>

          {/* Simple Route Optimizer Tab */}
          <TabsContent value="simple" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Route Input Panel */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Target className="w-5 h-5" />
                  {language === 'vi' ? 'Nhập Tuyến Đường' : 'Route Input'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Origin Input */}
                <div className="relative">
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    {language === 'vi' ? 'Điểm xuất phát' : 'Origin'}
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={originQuery}
                      onChange={(e) => handleOriginChange(e.target.value)}
                      onFocus={() => originQuery && setShowOriginSuggestions(true)}
                      placeholder={language === 'vi' ? 'Nhập điểm xuất phát...' : 'Enter origin location...'}
                      className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none"
                    />
                    <MapPin className="absolute right-3 top-2.5 w-4 h-4 text-slate-400" />
                  </div>
                  
                  {/* Origin Suggestions */}
                  {showOriginSuggestions && originSuggestions.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-slate-700 border border-slate-600 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                      {originSuggestions.map((location, index) => (
                        <div
                          key={index}
                          onClick={() => {
                            setOriginQuery(location.name)
                            setShowOriginSuggestions(false)
                          }}
                          className="px-4 py-2 hover:bg-slate-600 cursor-pointer text-white border-b border-slate-600 last:border-b-0"
                        >
                          <div className="font-medium">{location.name}</div>
                          <div className="text-xs text-slate-400">{location.province} • {location.type}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Destination Input */}
                <div className="relative">
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    {language === 'vi' ? 'Điểm đến' : 'Destination'}
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={destinationQuery}
                      onChange={(e) => handleDestinationChange(e.target.value)}
                      onFocus={() => destinationQuery && setShowDestinationSuggestions(true)}
                      placeholder={language === 'vi' ? 'Nhập điểm đến...' : 'Enter destination location...'}
                      className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none"
                    />
                    <MapPin className="absolute right-3 top-2.5 w-4 h-4 text-slate-400" />
                  </div>
                  
                  {/* Destination Suggestions */}
                  {showDestinationSuggestions && destinationSuggestions.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-slate-700 border border-slate-600 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                      {destinationSuggestions.map((location, index) => (
                        <div
                          key={index}
                          onClick={() => {
                            setDestinationQuery(location.name)
                            setShowDestinationSuggestions(false)
                          }}
                          className="px-4 py-2 hover:bg-slate-600 cursor-pointer text-white border-b border-slate-600 last:border-b-0"
                        >
                          <div className="font-medium">{location.name}</div>
                          <div className="text-xs text-slate-400">{location.province} • {location.type}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Calculate Button */}
                <Button
                  onClick={calculateRoute}
                  disabled={isCalculating || !originQuery.trim() || !destinationQuery.trim()}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                >
                  {isCalculating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      {language === 'vi' ? 'Đang tính toán...' : 'Calculating...'}
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 mr-2" />
                      {language === 'vi' ? 'Tính Toán Tuyến Đường' : 'Calculate Route'}
                    </>
                  )}
                </Button>

                {/* Route Results */}
                {selectedRoute && (
                  <div className="mt-6 p-4 bg-slate-700/50 rounded-lg border border-slate-600">
                    <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-400" />
                      {language === 'vi' ? 'Kết Quả Tối Ưu' : 'Optimization Results'}
                    </h3>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-slate-400">{language === 'vi' ? 'Khoảng cách:' : 'Distance:'}</span>
                        <div className="text-white font-medium">{selectedRoute.distance?.toFixed(1)} km</div>
                      </div>
                      <div>
                        <span className="text-slate-400">{language === 'vi' ? 'Thời gian:' : 'Duration:'}</span>
                        <div className="text-white font-medium">{selectedRoute.duration?.toFixed(1)} giờ</div>
                      </div>
                      <div>
                        <span className="text-slate-400">{language === 'vi' ? 'Chi phí nhiên liệu:' : 'Fuel Cost:'}</span>
                        <div className="text-white font-medium">₫{selectedRoute.fuelCost?.toLocaleString()}</div>
                      </div>
                      <div>
                        <span className="text-slate-400">{language === 'vi' ? 'Tổng chi phí:' : 'Total Cost:'}</span>
                        <div className="text-white font-medium">₫{selectedRoute.totalCost?.toLocaleString()}</div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Interactive Map */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <MapPin className="w-5 h-5" />
                  {language === 'vi' ? 'Bản Đồ Tương Tác' : 'Interactive Map'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <LeafletRouteMap
                  origin={selectedRoute?.origin}
                  destination={selectedRoute?.destination}
                  route={selectedRoute}
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Multi-Stop Route Optimizer Tab */}
        <TabsContent value="multi" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Multi-Stop Input Panel */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <MapPin className="w-5 h-5" />
                  {language === 'vi' ? 'Tối Ưu Đa Điểm' : 'Multi-Stop Optimization'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {multiStopLocations.map((location, index) => (
                  <div key={location.id} className="p-4 bg-slate-700/50 rounded-lg border border-slate-600">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-slate-300">
                        {index === 0 ? (language === 'vi' ? 'Điểm xuất phát' : 'Origin') :
                         index === multiStopLocations.length - 1 ? (language === 'vi' ? 'Điểm đến' : 'Destination') :
                         `${language === 'vi' ? 'Điểm dừng' : 'Stop'} ${index}`}
                      </span>
                      {multiStopLocations.length > 2 && index > 0 && index < multiStopLocations.length - 1 && (
                        <Button
                          onClick={() => removeLocation(location.id)}
                          size="sm"
                          variant="outline"
                          className="h-6 w-6 p-0"
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      )}
                    </div>
                    <Input
                      placeholder={language === 'vi' ? 'Nhập tên địa điểm...' : 'Enter location name...'}
                      value={location.name}
                      onChange={(e) => updateLocation(location.id, 'name', e.target.value)}
                      className="bg-slate-600 border-slate-500 text-white"
                    />
                  </div>
                ))}
                
                <div className="flex gap-2">
                  <Button
                    onClick={addLocation}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    {language === 'vi' ? 'Thêm điểm dừng' : 'Add Stop'}
                  </Button>
                  <Button
                    onClick={calculateMultiStopRoute}
                    disabled={isCalculating}
                    className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500"
                  >
                    {isCalculating ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                      <Calculator className="w-4 h-4" />
                    )}
                    {language === 'vi' ? 'Tối ưu tuyến đường' : 'Optimize Route'}
                  </Button>
                </div>

                {optimizedMultiRoute && (
                  <div className="mt-6 p-4 bg-slate-700/50 rounded-lg border border-slate-600">
                    <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-400" />
                      {language === 'vi' ? 'Tuyến đường tối ưu' : 'Optimized Route'}
                    </h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-slate-400">{language === 'vi' ? 'Tổng khoảng cách:' : 'Total Distance:'}</span>
                        <div className="text-white font-medium">{optimizedMultiRoute.distance?.toFixed(1)} km</div>
                      </div>
                      <div>
                        <span className="text-slate-400">{language === 'vi' ? 'Tổng thời gian:' : 'Total Time:'}</span>
                        <div className="text-white font-medium">{optimizedMultiRoute.duration?.toFixed(1)} giờ</div>
                      </div>
                      <div>
                        <span className="text-slate-400">{language === 'vi' ? 'Tiết kiệm:' : 'Savings:'}</span>
                        <div className="text-green-400 font-medium">₫{optimizedMultiRoute.savings?.cost?.toLocaleString()}</div>
                      </div>
                      <div>
                        <span className="text-slate-400">{language === 'vi' ? 'Tổng chi phí:' : 'Total Cost:'}</span>
                        <div className="text-white font-medium">₫{optimizedMultiRoute.totalCost?.toLocaleString()}</div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Multi-Stop Map */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <MapPin className="w-5 h-5" />
                  {language === 'vi' ? 'Bản đồ đa điểm' : 'Multi-Stop Map'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <LeafletRouteMap
                  origin={optimizedMultiRoute?.optimizedRoute?.[0]}
                  destination={optimizedMultiRoute?.optimizedRoute?.[optimizedMultiRoute.optimizedRoute.length - 1]}
                  route={optimizedMultiRoute}
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Advanced AI Optimizer Tab */}
        <TabsContent value="advanced" className="space-y-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Brain className="w-5 h-5" />
                {language === 'vi' ? 'Tối Ưu AI Nâng Cao' : 'Advanced AI Optimization'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Vehicle Configuration */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    {language === 'vi' ? 'Loại xe' : 'Vehicle Type'}
                  </label>
                  <select
                    value={vehicleConfig.type}
                    onChange={(e) => setVehicleConfig({...vehicleConfig, type: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                  >
                    <option value="truck">{language === 'vi' ? 'Xe tải' : 'Truck'}</option>
                    <option value="van">{language === 'vi' ? 'Xe van' : 'Van'}</option>
                    <option value="container">{language === 'vi' ? 'Container' : 'Container'}</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    {language === 'vi' ? 'Tải trọng (kg)' : 'Capacity (kg)'}
                  </label>
                  <Input
                    type="number"
                    value={vehicleConfig.capacity}
                    onChange={(e) => setVehicleConfig({...vehicleConfig, capacity: parseInt(e.target.value)})}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    {language === 'vi' ? 'Tiêu hao nhiên liệu (L/km)' : 'Fuel Consumption (L/km)'}
                  </label>
                  <Input
                    type="number"
                    step="0.01"
                    value={vehicleConfig.fuelConsumption}
                    onChange={(e) => setVehicleConfig({...vehicleConfig, fuelConsumption: parseFloat(e.target.value)})}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    {language === 'vi' ? 'Chi phí lái xe (VND/giờ)' : 'Driver Cost (VND/hour)'}
                  </label>
                  <Input
                    type="number"
                    value={vehicleConfig.driverCostPerHour}
                    onChange={(e) => setVehicleConfig({...vehicleConfig, driverCostPerHour: parseInt(e.target.value)})}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                  <Brain className="w-4 h-4 mr-2" />
                  {language === 'vi' ? 'Tối ưu AI' : 'AI Optimize'}
                </Button>
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  {language === 'vi' ? 'Xuất báo cáo' : 'Export Report'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* File Analysis Tab */}
        <TabsContent value="file" className="space-y-6">
          <FileBasedRouteOptimizer />
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">
                  {language === 'vi' ? 'Hiệu suất tối ưu' : 'Optimization Performance'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-400">{language === 'vi' ? 'Tiết kiệm khoảng cách:' : 'Distance Saved:'}</span>
                    <span className="text-green-400">15.2%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">{language === 'vi' ? 'Tiết kiệm thời gian:' : 'Time Saved:'}</span>
                    <span className="text-green-400">12.8%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">{language === 'vi' ? 'Tiết kiệm chi phí:' : 'Cost Saved:'}</span>
                    <span className="text-green-400">18.5%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">
                  {language === 'vi' ? 'Thống kê tuyến đường' : 'Route Statistics'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-400">{language === 'vi' ? 'Tuyến đường đã tối ưu:' : 'Routes Optimized:'}</span>
                    <span className="text-white">247</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">{language === 'vi' ? 'Tổng tiết kiệm:' : 'Total Savings:'}</span>
                    <span className="text-white">₫2.4M</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">{language === 'vi' ? 'Độ chính xác AI:' : 'AI Accuracy:'}</span>
                    <span className="text-white">94.2%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">
                  {language === 'vi' ? 'Xu hướng hiệu suất' : 'Performance Trends'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-400">{language === 'vi' ? 'Tuần này:' : 'This Week:'}</span>
                    <span className="text-green-400">+5.2%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">{language === 'vi' ? 'Tháng này:' : 'This Month:'}</span>
                    <span className="text-green-400">+12.8%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">{language === 'vi' ? 'Năm này:' : 'This Year:'}</span>
                    <span className="text-green-400">+28.4%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
