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

  // Vietnamese locations database
  const vietnameseLocations = [
    { name: 'Hồ Chí Minh', lat: 10.8231, lng: 106.6297, province: 'Ho Chi Minh City', type: 'city' },
    { name: 'Hà Nội', lat: 21.0285, lng: 105.8542, province: 'Hanoi', type: 'city' },
    { name: 'Đà Nẵng', lat: 16.0471, lng: 108.2068, province: 'Da Nang', type: 'city' },
    { name: 'Cần Thơ', lat: 10.0452, lng: 105.7469, province: 'Can Tho', type: 'city' },
    { name: 'Biên Hòa', lat: 10.9460, lng: 106.8234, province: 'Dong Nai', type: 'city' },
    { name: 'Cảng Sài Gòn', lat: 10.7769, lng: 106.7009, province: 'Ho Chi Minh City', type: 'port' },
    { name: 'KCN Biên Hòa', lat: 10.9408, lng: 106.8228, province: 'Dong Nai', type: 'industrial' }
  ]

  const searchLocations = (query: string) => {
    if (!query.trim()) return []
    return vietnameseLocations.filter(location => 
      location.name.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 5)
  }

  const calculateRoute = async () => {
    if (!originQuery.trim() || !destinationQuery.trim()) {
      alert(language === 'vi' ? 'Vui lòng nhập điểm xuất phát và điểm đến' : 'Please enter both origin and destination locations')
      return
    }

    setIsCalculating(true)
    
    try {
      const originLocation = vietnameseLocations.find(loc => 
        loc.name.toLowerCase().includes(originQuery.toLowerCase())
      )
      const destinationLocation = vietnameseLocations.find(loc => 
        loc.name.toLowerCase().includes(destinationQuery.toLowerCase())
      )

      if (!originLocation || !destinationLocation) {
        alert(language === 'vi' ? 'Không tìm thấy địa điểm' : 'Location not found')
        setIsCalculating(false)
        return
      }

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
            {language === 'vi' ? 'Tối Ưu Tuyến Đường Pro' : 'Combined Route Optimizer Pro'}
          </h1>
          <p className="text-slate-300">
            {language === 'vi' 
              ? 'Giải pháp tối ưu tuyến đường toàn diện với AI, bản đồ tương tác và phân tích đa chiều'
              : 'Ultimate route optimization solution with AI, interactive maps and multi-dimensional analysis'
            }
          </p>
          <Badge className="mt-2 bg-green-500/20 text-green-400 border-green-500/30">
            LogiAI V4.0 - All Routing Features Integrated
          </Badge>
        </div>

        {/* Enhanced Tabs */}
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

          {/* Simple Route Tab */}
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
                    <input
                      type="text"
                      value={originQuery}
                      onChange={(e) => handleOriginChange(e.target.value)}
                      placeholder={language === 'vi' ? 'Nhập điểm xuất phát...' : 'Enter origin location...'}
                      className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none"
                    />
                    
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
                            <div className="text-xs text-slate-400">{location.province}</div>
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
                    <input
                      type="text"
                      value={destinationQuery}
                      onChange={(e) => handleDestinationChange(e.target.value)}
                      placeholder={language === 'vi' ? 'Nhập điểm đến...' : 'Enter destination location...'}
                      className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none"
                    />
                    
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
                            <div className="text-xs text-slate-400">{location.province}</div>
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

          {/* Other tabs with placeholder content */}
          <TabsContent value="multi" className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Multi-Stop Optimization</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-300">Multi-stop route optimization coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="advanced" className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Advanced AI Optimization</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-300">Advanced AI features coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="file" className="space-y-6">
            <FileBasedRouteOptimizer />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Route Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-300">Analytics dashboard coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
