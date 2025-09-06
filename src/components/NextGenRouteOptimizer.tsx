'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import dynamic from 'next/dynamic'
import { 
  Navigation, Truck, MapPin, Clock, DollarSign, Fuel, 
  Brain, Zap, Target, TrendingUp, AlertTriangle, CheckCircle,
  Settings, Play, Pause, RotateCcw, Download, Share2
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { useLanguage } from '@/contexts/LanguageContext'

// Dynamic import for map components to avoid SSR issues
const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false })
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false })
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false })
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false })
const Polyline = dynamic(() => import('react-leaflet').then(mod => mod.Polyline), { ssr: false })

const NextGenRouteOptimizer = () => {
  const { language } = useLanguage()
  const [isOptimizing, setIsOptimizing] = useState(false)
  const [optimizationProgress, setOptimizationProgress] = useState(0)
  const [selectedRoute, setSelectedRoute] = useState(null)
  const [mapLoaded, setMapLoaded] = useState(false)
  const [aiSettings, setAiSettings] = useState({
    prioritizeFuel: true,
    prioritizeTime: true,
    prioritizeCost: true,
    trafficAware: true,
    weatherAware: true,
    realTimeUpdates: true
  })

  useEffect(() => {
    setMapLoaded(true)
  }, [])

  const routes = [
    {
      id: 1,
      name: 'HCM → Hà Nội Express',
      distance: '1,720 km',
      duration: '18h 30m',
      fuelCost: '₫2,450,000',
      optimizationScore: 95,
      status: 'optimized',
      waypoints: [
        { lat: 10.8231, lng: 106.6297, name: 'TP.HCM' },
        { lat: 12.2585, lng: 109.0526, name: 'Nha Trang' },
        { lat: 15.9750, lng: 108.2372, name: 'Đà Nẵng' },
        { lat: 18.7944, lng: 105.8800, name: 'Vinh' },
        { lat: 21.0285, lng: 105.8542, name: 'Hà Nội' }
      ],
      aiInsights: [
        'Tránh kẹt xe tại Đà Nẵng vào 7-9h sáng',
        'Tiết kiệm 12% nhiên liệu với tốc độ tối ưu',
        'Thời tiết thuận lợi trong 3 ngày tới'
      ]
    }
  ]

  const optimizationMetrics = [
    { label: 'Fuel Efficiency', value: 94, color: 'text-green-500', icon: Fuel },
    { label: 'Time Optimization', value: 87, color: 'text-blue-500', icon: Clock },
    { label: 'Cost Reduction', value: 91, color: 'text-yellow-500', icon: DollarSign },
    { label: 'Route Safety', value: 96, color: 'text-purple-500', icon: Target }
  ]

  const startOptimization = () => {
    setIsOptimizing(true)
    setOptimizationProgress(0)
    
    const interval = setInterval(() => {
      setOptimizationProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsOptimizing(false)
          return 100
        }
        return prev + Math.random() * 15
      })
    }, 200)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <motion.div 
          className="flex items-center justify-between"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur opacity-30"></div>
              <div className="relative bg-slate-700 p-3 rounded-full">
                <Navigation className="h-8 w-8 text-blue-400" />
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                {language === 'vi' ? 'Tối ưu hóa tuyến đường AI' : 'AI Route Optimizer'}
              </h1>
              <p className="text-slate-400">
                {language === 'vi' ? 'Tối ưu hóa thông minh với AI thế hệ mới' : 'Next-gen AI-powered route optimization'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30 px-3 py-1">
              <Brain className="w-4 h-4 mr-2" />
              AI Active
            </Badge>
            <Button 
              onClick={startOptimization}
              disabled={isOptimizing}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              {isOptimizing ? (
                <>
                  <Pause className="w-4 h-4 mr-2" />
                  {language === 'vi' ? 'Đang tối ưu...' : 'Optimizing...'}
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  {language === 'vi' ? 'Bắt đầu tối ưu' : 'Start Optimization'}
                </>
              )}
            </Button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Route List */}
          <motion.div 
            className="lg:col-span-1 space-y-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Navigation className="w-5 h-5" />
                  {language === 'vi' ? 'Tuyến đường' : 'Routes'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {routes.map((route) => (
                  <motion.div
                    key={route.id}
                    className={`p-4 rounded-lg border cursor-pointer transition-all ${
                      selectedRoute?.id === route.id
                        ? 'bg-blue-600/20 border-blue-500/50'
                        : 'bg-slate-700/30 border-slate-600/30 hover:bg-slate-700/50'
                    }`}
                    onClick={() => setSelectedRoute(route)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-white font-semibold text-sm">{route.name}</h3>
                      <Badge 
                        className={`${
                          route.status === 'optimized' 
                            ? 'bg-green-500/20 text-green-400 border-green-500/30' 
                            : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                        }`}
                      >
                        {route.status === 'optimized' ? (
                          <CheckCircle className="w-3 h-3 mr-1" />
                        ) : (
                          <AlertTriangle className="w-3 h-3 mr-1" />
                        )}
                        {route.status}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 text-xs text-slate-300">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {route.distance}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {route.duration}
                      </div>
                      <div className="flex items-center gap-1">
                        <Fuel className="w-3 h-3" />
                        {route.fuelCost}
                      </div>
                      <div className="flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        {route.optimizationScore}%
                      </div>
                    </div>

                    {route.aiInsights && (
                      <div className="mt-3 space-y-1">
                        <p className="text-xs text-blue-400 font-medium">AI Insights:</p>
                        {route.aiInsights.slice(0, 2).map((insight, index) => (
                          <p key={index} className="text-xs text-slate-400">• {insight}</p>
                        ))}
                      </div>
                    )}
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          {/* Map and Optimization */}
          <motion.div 
            className="lg:col-span-2 space-y-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            {/* Optimization Metrics */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {optimizationMetrics.map((metric, index) => (
                <motion.div
                  key={metric.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                >
                  <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <metric.icon className={`w-5 h-5 ${metric.color}`} />
                        <span className={`text-lg font-bold ${metric.color}`}>
                          {metric.value}%
                        </span>
                      </div>
                      <p className="text-xs text-slate-400">{metric.label}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Map Placeholder */}
            <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="h-96 rounded-lg bg-slate-700/30 flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="h-16 w-16 text-slate-500 mx-auto mb-4" />
                    <p className="text-slate-400 text-lg font-medium">Interactive Map</p>
                    <p className="text-slate-500 text-sm">Route visualization and optimization</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default NextGenRouteOptimizer
