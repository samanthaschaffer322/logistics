'use client'

import React, { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
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
  Badge
} from '@/components/ui-components'
import { 
  Map, 
  MapPin, 
  Navigation, 
  Truck, 
  Package, 
  Clock,
  BarChart3,
  TrendingUp,
  Users,
  Building,
  Search,
  Filter,
  Navigation2,
  Fuel,
  Calculator,
  Zap,
  Anchor,
  Warehouse,
  Factory,
  DollarSign,
  Brain,
  Target,
  CheckCircle,
  Plus,
  X,
  Loader2,
  Activity,
  Lightbulb,
  AlertTriangle,
  Navigation2 as Route,
  Settings,
  Globe,
  Sparkles
} from 'lucide-react'

// Dynamic import to prevent SSR issues
const InteractiveMap = dynamic(
  () => import('@/components/InteractiveMap'),
  { 
    ssr: false,
    loading: () => (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
        <p className="text-gray-600">Loading Interactive Map...</p>
      </div>
    )
  }
)

const ComprehensiveRouteOptimizerPage = () => {
  const { t, language } = useLanguage()
  const [activeTab, setActiveTab] = useState<'overview' | 'optimizer' | 'results'>('overview')
  const [isOptimizing, setIsOptimizing] = useState(false)
  const [optimizationProgress, setOptimizationProgress] = useState(0)

  const optimizeRoute = async () => {
    setIsOptimizing(true)
    setOptimizationProgress(0)
    setActiveTab('results')

    // Simulate optimization progress
    const progressInterval = setInterval(() => {
      setOptimizationProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval)
          return 90
        }
        return prev + 10
      })
    }, 200)

    try {
      // Simulate AI optimization
      await new Promise(resolve => setTimeout(resolve, 2500))
      setOptimizationProgress(100)
    } catch (error) {
      console.error('Optimization error:', error)
    } finally {
      setIsOptimizing(false)
      clearInterval(progressInterval)
    }
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-slate-900 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold gradient-text mb-2 flex items-center gap-3">
              <div className="relative">
                <Route className="w-10 h-10 text-indigo-400" />
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full flex items-center justify-center">
                  <Sparkles className="w-2 h-2 text-white" />
                </div>
              </div>
              {language === 'vi' ? 'Tối Ưu Tuyến Đường Toàn Diện' : 'Comprehensive Route Optimizer'}
            </h1>
            <p className="text-slate-400">
              {language === 'vi' 
                ? 'Hệ thống tối ưu tuyến đường AI kết hợp bản đồ Việt Nam với phân tích logistics chi tiết'
                : 'AI-powered route optimization system combining Vietnam map with detailed logistics analysis'
              }
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="flex space-x-1 mb-6 bg-slate-800 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
                activeTab === 'overview'
                  ? 'bg-indigo-600 text-white shadow-lg'
                  : 'text-slate-400 hover:text-white hover:bg-slate-700'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <Map className="w-4 h-4" />
                {language === 'vi' ? 'Tổng Quan' : 'Overview'}
              </div>
            </button>
            <button
              onClick={() => setActiveTab('optimizer')}
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
                activeTab === 'optimizer'
                  ? 'bg-indigo-600 text-white shadow-lg'
                  : 'text-slate-400 hover:text-white hover:bg-slate-700'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <Settings className="w-4 h-4" />
                {language === 'vi' ? 'Tối Ưu Hóa' : 'Optimizer'}
              </div>
            </button>
            <button
              onClick={() => setActiveTab('results')}
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
                activeTab === 'results'
                  ? 'bg-indigo-600 text-white shadow-lg'
                  : 'text-slate-400 hover:text-white hover:bg-slate-700'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <BarChart3 className="w-4 h-4" />
                {language === 'vi' ? 'Kết Quả' : 'Results'}
              </div>
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Features Overview */}
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Brain className="w-5 h-5 text-indigo-400" />
                    {language === 'vi' ? 'Tính Năng AI' : 'AI Features'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-blue-500/20 rounded-lg">
                        <Map className="w-5 h-5 text-blue-400" />
                      </div>
                      <div>
                        <h4 className="font-medium text-white">
                          {language === 'vi' ? 'Bản Đồ Việt Nam Tích Hợp' : 'Integrated Vietnam Map'}
                        </h4>
                        <p className="text-sm text-slate-400">
                          {language === 'vi' 
                            ? '28+ địa điểm logistics bao gồm cảng, kho, depot'
                            : '28+ logistics locations including ports, warehouses, depots'
                          }
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-green-500/20 rounded-lg">
                        <Navigation className="w-5 h-5 text-green-400" />
                      </div>
                      <div>
                        <h4 className="font-medium text-white">
                          {language === 'vi' ? 'Tối Ưu Tuyến Đường AI' : 'AI Route Optimization'}
                        </h4>
                        <p className="text-sm text-slate-400">
                          {language === 'vi' 
                            ? 'Thuật toán AI tối ưu chi phí, thời gian, nhiên liệu'
                            : 'AI algorithms optimizing cost, time, and fuel consumption'
                          }
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-purple-500/20 rounded-lg">
                        <BarChart3 className="w-5 h-5 text-purple-400" />
                      </div>
                      <div>
                        <h4 className="font-medium text-white">
                          {language === 'vi' ? 'Phân Tích Chi Tiết' : 'Detailed Analytics'}
                        </h4>
                        <p className="text-sm text-slate-400">
                          {language === 'vi' 
                            ? 'Báo cáo chi phí, giao thông, hiệu suất chi tiết'
                            : 'Comprehensive cost, traffic, and efficiency reports'
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Activity className="w-5 h-5 text-green-400" />
                    {language === 'vi' ? 'Thống Kê Nhanh' : 'Quick Stats'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-blue-500/10 rounded-xl border border-blue-500/20">
                      <div className="text-2xl font-bold text-blue-400">28+</div>
                      <div className="text-sm text-blue-300">
                        {language === 'vi' ? 'Địa điểm' : 'Locations'}
                      </div>
                    </div>
                    <div className="text-center p-4 bg-green-500/10 rounded-xl border border-green-500/20">
                      <div className="text-2xl font-bold text-green-400">5</div>
                      <div className="text-sm text-green-300">
                        {language === 'vi' ? 'Thuật toán' : 'Algorithms'}
                      </div>
                    </div>
                    <div className="text-center p-4 bg-purple-500/10 rounded-xl border border-purple-500/20">
                      <div className="text-2xl font-bold text-purple-400">15%</div>
                      <div className="text-sm text-purple-300">
                        {language === 'vi' ? 'Tiết kiệm' : 'Savings'}
                      </div>
                    </div>
                    <div className="text-center p-4 bg-orange-500/10 rounded-xl border border-orange-500/20">
                      <div className="text-2xl font-bold text-orange-400">24/7</div>
                      <div className="text-sm text-orange-300">
                        {language === 'vi' ? 'Hoạt động' : 'Available'}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Interactive Map Preview */}
              <Card className="lg:col-span-2 bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Globe className="w-5 h-5 text-indigo-400" />
                    {language === 'vi' ? 'Bản Đồ Tương Tác' : 'Interactive Map'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-96 rounded-xl overflow-hidden">
                    <InteractiveMap 
                      departure={null}
                      destination={null}
                      optimizedRoute={null}
                      language={language}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'optimizer' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Configuration Panel */}
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Settings className="w-5 h-5 text-blue-400" />
                    {language === 'vi' ? 'Cấu Hình Tối Ưu' : 'Optimization Configuration'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label className="text-slate-300 mb-2 block">
                        {language === 'vi' ? 'Điểm xuất phát' : 'Departure Point'}
                      </Label>
                      <select className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white">
                        <option value="">
                          {language === 'vi' ? 'Chọn điểm xuất phát...' : 'Select departure point...'}
                        </option>
                        <option value="hcm">Ho Chi Minh City Port</option>
                        <option value="hanoi">Hanoi Depot</option>
                        <option value="danang">Da Nang Port</option>
                      </select>
                    </div>

                    <div>
                      <Label className="text-slate-300 mb-2 block">
                        {language === 'vi' ? 'Điểm đến' : 'Destination'}
                      </Label>
                      <select className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white">
                        <option value="">
                          {language === 'vi' ? 'Chọn điểm đến...' : 'Select destination...'}
                        </option>
                        <option value="hcm">Ho Chi Minh City Port</option>
                        <option value="hanoi">Hanoi Depot</option>
                        <option value="danang">Da Nang Port</option>
                      </select>
                    </div>

                    <div>
                      <Label className="text-slate-300 mb-2 block">
                        {language === 'vi' ? 'Loại xe' : 'Truck Type'}
                      </Label>
                      <select className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white">
                        <option value="20ft">20ft Container</option>
                        <option value="40ft">40ft Container</option>
                        <option value="container_truck">Container Truck</option>
                      </select>
                    </div>

                    <div>
                      <Label className="text-slate-300 mb-2 block">
                        {language === 'vi' ? 'Tối ưu cho' : 'Optimize For'}
                      </Label>
                      <select className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white">
                        <option value="cost">{language === 'vi' ? 'Chi phí' : 'Cost'}</option>
                        <option value="time">{language === 'vi' ? 'Thời gian' : 'Time'}</option>
                        <option value="distance">{language === 'vi' ? 'Khoảng cách' : 'Distance'}</option>
                        <option value="fuel">{language === 'vi' ? 'Nhiên liệu' : 'Fuel'}</option>
                      </select>
                    </div>

                    <button
                      onClick={optimizeRoute}
                      disabled={isOptimizing}
                      className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
                    >
                      {isOptimizing ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          {language === 'vi' ? 'Đang tối ưu...' : 'Optimizing...'}
                        </>
                      ) : (
                        <>
                          <Brain className="w-5 h-5" />
                          {language === 'vi' ? 'Tối Ưu AI' : 'AI Optimize'}
                        </>
                      )}
                    </button>

                    {/* Progress Bar */}
                    {isOptimizing && (
                      <div className="mt-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-slate-300">
                            {language === 'vi' ? 'Tiến trình' : 'Progress'}
                          </span>
                          <span className="text-sm text-indigo-400">{optimizationProgress}%</span>
                        </div>
                        <div className="w-full bg-slate-700 rounded-full h-3">
                          <div 
                            className="bg-gradient-to-r from-indigo-500 to-purple-500 h-3 rounded-full transition-all duration-300"
                            style={{ width: `${optimizationProgress}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Map Preview */}
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Map className="w-5 h-5 text-green-400" />
                    {language === 'vi' ? 'Xem Trước' : 'Preview'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-96 rounded-xl overflow-hidden">
                    <InteractiveMap 
                      departure={null}
                      destination={null}
                      optimizedRoute={null}
                      language={language}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'results' && (
            <div className="space-y-6">
              {optimizationProgress === 100 ? (
                <>
                  {/* AI Summary */}
                  <Card className="bg-gradient-to-r from-indigo-900/50 to-purple-900/50 border-indigo-500/30">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-indigo-500/20 rounded-xl">
                          <Brain className="w-6 h-6 text-indigo-400" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-white mb-2">
                            {language === 'vi' ? 'Kết Quả Tối Ưu AI' : 'AI Optimization Results'}
                          </h3>
                          <p className="text-indigo-200">
                            {language === 'vi' 
                              ? '🤖 AI đã phân tích 28+ địa điểm logistics và tối ưu tuyến đường. Tiết kiệm 15% chi phí và 20% thời gian so với tuyến thông thường.'
                              : '🤖 AI analyzed 28+ logistics locations and optimized the route. Saves 15% cost and 20% time compared to standard routes.'
                            }
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Key Metrics */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Card className="bg-slate-800 border-slate-700">
                      <CardContent className="p-4 text-center">
                        <div className="p-3 bg-blue-500/20 rounded-xl w-fit mx-auto mb-3">
                          <Navigation className="w-6 h-6 text-blue-400" />
                        </div>
                        <div className="text-2xl font-bold text-blue-400">245</div>
                        <div className="text-sm text-blue-300">
                          {language === 'vi' ? 'Kilomet' : 'Kilometers'}
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-slate-800 border-slate-700">
                      <CardContent className="p-4 text-center">
                        <div className="p-3 bg-green-500/20 rounded-xl w-fit mx-auto mb-3">
                          <Clock className="w-6 h-6 text-green-400" />
                        </div>
                        <div className="text-2xl font-bold text-green-400">4.2</div>
                        <div className="text-sm text-green-300">
                          {language === 'vi' ? 'Giờ' : 'Hours'}
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-slate-800 border-slate-700">
                      <CardContent className="p-4 text-center">
                        <div className="p-3 bg-yellow-500/20 rounded-xl w-fit mx-auto mb-3">
                          <Fuel className="w-6 h-6 text-yellow-400" />
                        </div>
                        <div className="text-2xl font-bold text-yellow-400">2.1M</div>
                        <div className="text-sm text-yellow-300">VNĐ</div>
                      </CardContent>
                    </Card>

                    <Card className="bg-slate-800 border-slate-700">
                      <CardContent className="p-4 text-center">
                        <div className="p-3 bg-purple-500/20 rounded-xl w-fit mx-auto mb-3">
                          <Activity className="w-6 h-6 text-purple-400" />
                        </div>
                        <div className="text-2xl font-bold text-purple-400">92%</div>
                        <div className="text-sm text-purple-300">
                          {language === 'vi' ? 'Hiệu Suất' : 'Efficiency'}
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Optimized Route Map */}
                  <Card className="bg-slate-800 border-slate-700">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-white">
                        <Map className="w-5 h-5 text-indigo-400" />
                        {language === 'vi' ? 'Tuyến Đường Tối Ưu' : 'Optimized Route'}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-96 rounded-xl overflow-hidden">
                        <InteractiveMap 
                          departure={null}
                          destination={null}
                          optimizedRoute={null}
                          language={language}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </>
              ) : (
                <Card className="bg-slate-800 border-slate-700">
                  <CardContent className="p-12 text-center">
                    <Calculator className="w-16 h-16 mx-auto mb-4 opacity-50 text-slate-400" />
                    <h3 className="text-xl font-semibold text-white mb-2">
                      {language === 'vi' ? 'Chưa có kết quả' : 'No Results Yet'}
                    </h3>
                    <p className="text-slate-400 mb-6">
                      {language === 'vi' 
                        ? 'Vui lòng chạy tối ưu để xem kết quả'
                        : 'Please run optimization to see results'
                      }
                    </p>
                    <Button 
                      onClick={() => setActiveTab('optimizer')}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white"
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      {language === 'vi' ? 'Đi đến tối ưu' : 'Go to Optimizer'}
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
      </div>
    </AuthGuard>
  )
}

export default ComprehensiveRouteOptimizerPage
