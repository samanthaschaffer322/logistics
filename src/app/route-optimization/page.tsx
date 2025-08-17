'use client'

import React, { useState } from 'react'
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
  Navigation, 
  Map, 
  Brain, 
  Zap,
  MapPin,
  Truck,
  Calculator,
  Route,
  Globe,
  Target,
  TrendingUp,
  BarChart3,
  Settings,
  CheckCircle,
  Clock,
  DollarSign,
  Fuel,
  ArrowRight,
  Layers,
  Activity
} from 'lucide-react'

const RouteOptimizationPage = () => {
  const { language } = useLanguage()
  const [activeOptimizer, setActiveOptimizer] = useState('combined')

  const optimizers = [
    {
      id: 'combined',
      title: language === 'vi' ? 'Tối Ưu Tổng Hợp' : 'Combined Optimizer',
      description: language === 'vi' 
        ? 'Hệ thống tối ưu hóa toàn diện với bản đồ Việt Nam và AI'
        : 'Comprehensive optimization system with Vietnam map and AI',
      icon: Navigation,
      color: 'from-blue-500 to-purple-500',
      features: [
        language === 'vi' ? '50+ địa điểm Việt Nam' : '50+ Vietnam locations',
        language === 'vi' ? 'Tính toán chi phí thực tế' : 'Real cost calculations',
        language === 'vi' ? 'Tối ưu đa mục tiêu' : 'Multi-objective optimization',
        language === 'vi' ? 'Phân tích giao thông' : 'Traffic analysis'
      ],
      href: '/combined-route-optimizer'
    },
    {
      id: 'vietnam-map',
      title: language === 'vi' ? 'Bản Đồ Việt Nam' : 'Vietnam Map',
      description: language === 'vi' 
        ? 'Hệ thống bản đồ tương tác với các cảng và thành phố'
        : 'Interactive map system with ports and cities',
      icon: Map,
      color: 'from-green-500 to-emerald-500',
      features: [
        language === 'vi' ? '28+ cảng biển chính' : '28+ major ports',
        language === 'vi' ? 'Khu công nghiệp' : 'Industrial zones',
        language === 'vi' ? 'Sân bay quốc tế' : 'International airports',
        language === 'vi' ? 'Cửa khẩu biên giới' : 'Border gates'
      ],
      href: '/vietnam-map'
    },
    {
      id: 'ai-optimizer',
      title: language === 'vi' ? 'AI Thông Minh' : 'Smart AI',
      description: language === 'vi' 
        ? 'Tối ưu hóa bằng trí tuệ nhân tạo và machine learning'
        : 'AI-powered optimization with machine learning',
      icon: Brain,
      color: 'from-purple-500 to-pink-500',
      features: [
        language === 'vi' ? 'Học máy từ dữ liệu' : 'Machine learning from data',
        language === 'vi' ? 'Dự đoán giao thông' : 'Traffic prediction',
        language === 'vi' ? 'Tối ưu thời gian thực' : 'Real-time optimization',
        language === 'vi' ? 'Phân tích xu hướng' : 'Trend analysis'
      ],
      href: '/super-ai'
    },
    {
      id: 'comprehensive',
      title: language === 'vi' ? 'Tối Ưu Nâng Cao' : 'Advanced Optimizer',
      description: language === 'vi' 
        ? 'Hệ thống tối ưu hóa nâng cao với nhiều thuật toán'
        : 'Advanced optimization system with multiple algorithms',
      icon: Zap,
      color: 'from-orange-500 to-red-500',
      features: [
        language === 'vi' ? 'Nhiều thuật toán' : 'Multiple algorithms',
        language === 'vi' ? 'Tối ưu phức tạp' : 'Complex optimization',
        language === 'vi' ? 'Phân tích chi tiết' : 'Detailed analysis',
        language === 'vi' ? 'Báo cáo chuyên sâu' : 'In-depth reports'
      ],
      href: '/comprehensive-route-optimizer'
    }
  ]

  const quickStats = [
    {
      label: language === 'vi' ? 'Tuyến đường đã tối ưu' : 'Routes Optimized',
      value: '2,847',
      icon: Navigation,
      color: 'text-blue-400'
    },
    {
      label: language === 'vi' ? 'Tiết kiệm chi phí' : 'Cost Savings',
      value: '23%',
      icon: DollarSign,
      color: 'text-green-400'
    },
    {
      label: language === 'vi' ? 'Hiệu suất trung bình' : 'Average Efficiency',
      value: '94.2%',
      icon: TrendingUp,
      color: 'text-purple-400'
    },
    {
      label: language === 'vi' ? 'Thời gian tiết kiệm' : 'Time Saved',
      value: '18.5h',
      icon: Clock,
      color: 'text-yellow-400'
    }
  ]

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-4">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center">
                <Navigation className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  {language === 'vi' ? 'Tối Ưu Hóa Tuyến Đường' : 'Route Optimization'}
                </h1>
                <p className="text-xl text-slate-300 mt-2">
                  {language === 'vi' 
                    ? 'Hệ thống tối ưu hóa tuyến đường thông minh và toàn diện'
                    : 'Intelligent and comprehensive route optimization system'
                  }
                </p>
              </div>
            </div>
            
            <div className="flex items-center justify-center gap-4">
              <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 px-4 py-2">
                <Navigation className="w-4 h-4 mr-2" />
                {language === 'vi' ? 'Đa thuật toán' : 'Multi-Algorithm'}
              </Badge>
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30 px-4 py-2">
                <Map className="w-4 h-4 mr-2" />
                {language === 'vi' ? 'Bản đồ VN' : 'Vietnam Map'}
              </Badge>
              <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 px-4 py-2">
                <Brain className="w-4 h-4 mr-2" />
                {language === 'vi' ? 'AI Thông minh' : 'Smart AI'}
              </Badge>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {quickStats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <Card key={index} className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50 shadow-xl group hover:transform hover:scale-105 transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-slate-400 text-sm font-medium mb-1">{stat.label}</p>
                        <p className="text-3xl font-bold text-white">{stat.value}</p>
                      </div>
                      <Icon className={`w-8 h-8 ${stat.color} group-hover:scale-110 transition-transform duration-300`} />
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Main Content */}
          <Tabs value={activeOptimizer} onValueChange={setActiveOptimizer} className="space-y-8">
            <TabsList className="grid w-full grid-cols-4 bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-2 h-16">
              {optimizers.map((optimizer) => {
                const Icon = optimizer.icon
                return (
                  <TabsTrigger 
                    key={optimizer.id}
                    value={optimizer.id}
                    className="text-slate-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white rounded-xl font-semibold transition-all duration-300 h-12 flex items-center gap-2"
                  >
                    <Icon className="w-4 h-4" />
                    <span className="hidden sm:inline">{optimizer.title}</span>
                  </TabsTrigger>
                )
              })}
            </TabsList>

            {optimizers.map((optimizer) => {
              const Icon = optimizer.icon
              return (
                <TabsContent key={optimizer.id} value={optimizer.id} className="space-y-6">
                  <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50 shadow-xl">
                    <CardHeader>
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 bg-gradient-to-r ${optimizer.color} rounded-xl flex items-center justify-center`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-2xl text-white">{optimizer.title}</CardTitle>
                          <CardDescription className="text-slate-300 text-lg">
                            {optimizer.description}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Features */}
                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold text-white mb-4">
                            {language === 'vi' ? 'Tính năng chính:' : 'Key Features:'}
                          </h3>
                          <div className="space-y-3">
                            {optimizer.features.map((feature, index) => (
                              <div key={index} className="flex items-center gap-3">
                                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                                <span className="text-slate-300">{feature}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Preview/Demo */}
                        <div className="bg-slate-700/30 rounded-xl p-6">
                          <h3 className="text-lg font-semibold text-white mb-4">
                            {language === 'vi' ? 'Xem trước:' : 'Preview:'}
                          </h3>
                          <div className="space-y-4">
                            {optimizer.id === 'combined' && (
                              <div className="space-y-3">
                                <div className="flex items-center justify-between bg-slate-600/30 rounded-lg p-3">
                                  <span className="text-slate-300">
                                    {language === 'vi' ? 'TP.HCM → Hà Nội' : 'Ho Chi Minh → Hanoi'}
                                  </span>
                                  <span className="text-green-400 font-medium">1,720 km</span>
                                </div>
                                <div className="flex items-center justify-between bg-slate-600/30 rounded-lg p-3">
                                  <span className="text-slate-300">
                                    {language === 'vi' ? 'Chi phí tối ưu' : 'Optimized Cost'}
                                  </span>
                                  <span className="text-blue-400 font-medium">₫15.2M</span>
                                </div>
                                <div className="flex items-center justify-between bg-slate-600/30 rounded-lg p-3">
                                  <span className="text-slate-300">
                                    {language === 'vi' ? 'Tiết kiệm' : 'Savings'}
                                  </span>
                                  <span className="text-purple-400 font-medium">23%</span>
                                </div>
                              </div>
                            )}
                            
                            {optimizer.id === 'vietnam-map' && (
                              <div className="space-y-3">
                                <div className="flex items-center gap-2 text-slate-300">
                                  <MapPin className="w-4 h-4 text-blue-400" />
                                  <span>{language === 'vi' ? 'Cảng Sài Gòn' : 'Saigon Port'}</span>
                                </div>
                                <div className="flex items-center gap-2 text-slate-300">
                                  <MapPin className="w-4 h-4 text-green-400" />
                                  <span>{language === 'vi' ? 'Cảng Hải Phòng' : 'Hai Phong Port'}</span>
                                </div>
                                <div className="flex items-center gap-2 text-slate-300">
                                  <MapPin className="w-4 h-4 text-purple-400" />
                                  <span>{language === 'vi' ? 'Cảng Đà Nẵng' : 'Da Nang Port'}</span>
                                </div>
                              </div>
                            )}
                            
                            {optimizer.id === 'ai-optimizer' && (
                              <div className="space-y-3">
                                <div className="flex items-center gap-2 text-slate-300">
                                  <Brain className="w-4 h-4 text-purple-400" />
                                  <span>{language === 'vi' ? 'Học máy: 94.2%' : 'ML Accuracy: 94.2%'}</span>
                                </div>
                                <div className="flex items-center gap-2 text-slate-300">
                                  <Activity className="w-4 h-4 text-blue-400" />
                                  <span>{language === 'vi' ? 'Dự đoán thời gian thực' : 'Real-time Prediction'}</span>
                                </div>
                                <div className="flex items-center gap-2 text-slate-300">
                                  <TrendingUp className="w-4 h-4 text-green-400" />
                                  <span>{language === 'vi' ? 'Tối ưu liên tục' : 'Continuous Optimization'}</span>
                                </div>
                              </div>
                            )}
                            
                            {optimizer.id === 'comprehensive' && (
                              <div className="space-y-3">
                                <div className="flex items-center gap-2 text-slate-300">
                                  <Layers className="w-4 h-4 text-orange-400" />
                                  <span>{language === 'vi' ? '5 thuật toán' : '5 Algorithms'}</span>
                                </div>
                                <div className="flex items-center gap-2 text-slate-300">
                                  <BarChart3 className="w-4 h-4 text-red-400" />
                                  <span>{language === 'vi' ? 'Phân tích sâu' : 'Deep Analysis'}</span>
                                </div>
                                <div className="flex items-center gap-2 text-slate-300">
                                  <Target className="w-4 h-4 text-yellow-400" />
                                  <span>{language === 'vi' ? 'Tối ưu đa mục tiêu' : 'Multi-objective'}</span>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Action Button */}
                      <div className="mt-8 flex justify-center">
                        <a href={optimizer.href}>
                          <Button className={`bg-gradient-to-r ${optimizer.color} hover:opacity-90 text-white font-semibold px-8 py-3 rounded-xl text-lg`}>
                            <Icon className="w-5 h-5 mr-2" />
                            {language === 'vi' ? 'Sử dụng ngay' : 'Use Now'}
                            <ArrowRight className="w-5 h-5 ml-2" />
                          </Button>
                        </a>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              )
            })}
          </Tabs>

          {/* Quick Access Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {optimizers.map((optimizer) => {
              const Icon = optimizer.icon
              return (
                <a key={optimizer.id} href={optimizer.href}>
                  <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50 shadow-xl group hover:transform hover:scale-105 transition-all duration-300 cursor-pointer">
                    <CardContent className="p-6 text-center">
                      <div className={`w-12 h-12 bg-gradient-to-r ${optimizer.color} rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-blue-100 transition-colors">
                        {optimizer.title}
                      </h3>
                      <p className="text-slate-400 text-sm group-hover:text-slate-300 transition-colors">
                        {optimizer.description}
                      </p>
                    </CardContent>
                  </Card>
                </a>
              )
            })}
          </div>
        </div>
      </div>
    </AuthGuard>
  )
}

export default RouteOptimizationPage
