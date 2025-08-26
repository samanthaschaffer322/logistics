'use client'

import React, { useState } from 'react'
import AuthGuard from '@/components/AuthGuard'
import { useLanguage } from '@/contexts/LanguageContext'
import EnhancedInteractiveMap from '@/components/EnhancedInteractiveMap'
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  Button
} from '@/components/ui-components'
import { 
  Globe,
  BarChart3,
  CheckCircle,
  Search,
  MapPin,
  Navigation,
  Truck,
  Zap,
  TrendingUp,
  Clock,
  DollarSign,
  Fuel,
  Target
} from 'lucide-react'

export default function CombinedRouteOptimizerPage() {
  const { t } = useLanguage()
  const [activeView, setActiveView] = useState('map')

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-6">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-2xl">
                <Globe className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
                  LogiAI Enhanced Route Optimizer
                </h1>
                <p className="text-xl text-slate-300 mt-2">
                  Advanced Vietnamese Logistics with Real-time Interactive Mapping
                </p>
              </div>
            </div>

            {/* Success Banner */}
            <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-2xl p-6 backdrop-blur-sm">
              <div className="flex items-center justify-center space-x-3">
                <CheckCircle className="w-8 h-8 text-green-400" />
                <div>
                  <h2 className="text-2xl font-bold text-green-400">🗺️ ENHANCED INTERACTIVE MAP ACTIVE!</h2>
                  <p className="text-green-300">Search Vietnamese locations with or without accents • Real-time route optimization • Nearest depot integration</p>
                </div>
              </div>
            </div>
          </div>

          {/* Feature Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <Search className="w-6 h-6" />,
                title: "Vietnamese Search",
                description: "Type with or without accents",
                color: "from-green-500 to-emerald-500"
              },
              {
                icon: <Navigation className="w-6 h-6" />,
                title: "Smart Routing",
                description: "Optimized with nearest depot",
                color: "from-blue-500 to-cyan-500"
              },
              {
                icon: <MapPin className="w-6 h-6" />,
                title: "Real GPS Data",
                description: "Accurate Vietnamese coordinates",
                color: "from-purple-500 to-pink-500"
              },
              {
                icon: <Zap className="w-6 h-6" />,
                title: "Live Updates",
                description: "Real-time route calculation",
                color: "from-orange-500 to-red-500"
              }
            ].map((feature, index) => (
              <Card key={index} className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50 hover:border-slate-600/50 transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <div className={`w-12 h-12 bg-gradient-to-r ${feature.color} rounded-lg flex items-center justify-center mx-auto mb-4`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-slate-400 text-sm">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* View Toggle */}
          <div className="flex justify-center space-x-4">
            <Button
              onClick={() => setActiveView('map')}
              variant={activeView === 'map' ? 'default' : 'outline'}
              className={`px-8 py-4 text-lg transition-all duration-300 ${
                activeView === 'map' 
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 shadow-lg transform scale-105' 
                  : 'border-slate-600 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <Globe className="w-5 h-5 mr-2" />
              Interactive Map
            </Button>
            <Button
              onClick={() => setActiveView('analytics')}
              variant={activeView === 'analytics' ? 'default' : 'outline'}
              className={`px-8 py-4 text-lg transition-all duration-300 ${
                activeView === 'analytics' 
                  ? 'bg-gradient-to-r from-green-500 to-blue-500 shadow-lg transform scale-105' 
                  : 'border-slate-600 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <BarChart3 className="w-5 h-5 mr-2" />
              Route Analytics
            </Button>
          </div>

          {/* Main Content */}
          {activeView === 'map' ? (
            <div className="space-y-6">
              {/* Instructions */}
              <Card className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/30 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Target className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2">How to Use Enhanced Route Search</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-slate-300">
                        <div>
                          <h4 className="font-semibold text-blue-400 mb-1">Vietnamese Input Examples:</h4>
                          <ul className="text-sm space-y-1">
                            <li>• "Cat Lai" or "Cát Lái" or "cat lai"</li>
                            <li>• "Ho Chi Minh" or "Hồ Chí Minh"</li>
                            <li>• "Vung Tau" or "Vũng Tàu"</li>
                            <li>• "Can Tho" or "Cần Thơ"</li>
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold text-green-400 mb-1">Smart Features:</h4>
                          <ul className="text-sm space-y-1">
                            <li>• Auto-suggests as you type</li>
                            <li>• Finds nearest depot/warehouse</li>
                            <li>• Calculates optimized routes</li>
                            <li>• Shows real GPS coordinates</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Enhanced Interactive Map */}
              <EnhancedInteractiveMap />
            </div>
          ) : (
            /* Analytics View */
            <div className="space-y-6">
              {/* Analytics Dashboard */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2 text-green-400">
                      <TrendingUp className="w-5 h-5" />
                      <span>Route Efficiency</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <div className="text-4xl font-bold text-green-400 mb-2">92%</div>
                      <div className="text-slate-400">Average Efficiency</div>
                      <div className="w-full bg-slate-700 rounded-full h-2 mt-4">
                        <div className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full" style={{ width: '92%' }}></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2 text-blue-400">
                      <Clock className="w-5 h-5" />
                      <span>Time Savings</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <div className="text-4xl font-bold text-blue-400 mb-2">2.5h</div>
                      <div className="text-slate-400">Average Saved</div>
                      <div className="text-sm text-green-400 mt-2">↑ 15% improvement</div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2 text-yellow-400">
                      <DollarSign className="w-5 h-5" />
                      <span>Cost Reduction</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <div className="text-4xl font-bold text-yellow-400 mb-2">18%</div>
                      <div className="text-slate-400">Average Savings</div>
                      <div className="text-sm text-green-400 mt-2">↑ 3% this month</div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Depot Network Overview */}
              <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-purple-400">
                    <Truck className="w-5 h-5" />
                    <span>Vietnamese Depot Network</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[
                      { name: 'Cảng Cát Lái', type: 'Port', capacity: '50,000 tons', status: 'Active', color: 'green' },
                      { name: 'Cảng Vũng Tàu', type: 'Port', capacity: '30,000 tons', status: 'Active', color: 'green' },
                      { name: 'Kho Chim Én', type: 'Depot', capacity: '25,000 tons', status: 'Active', color: 'blue' },
                      { name: 'Cảng Sài Gòn', type: 'Port', capacity: '40,000 tons', status: 'Active', color: 'green' },
                      { name: 'Kho Tân Thuận', type: 'Warehouse', capacity: '15,000 tons', status: 'Active', color: 'yellow' },
                      { name: 'Kho Bến Nghé', type: 'Depot', capacity: '20,000 tons', status: 'Active', color: 'blue' }
                    ].map((depot, index) => (
                      <div key={index} className="bg-slate-700/50 rounded-lg p-4 border border-slate-600/50">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-white">{depot.name}</h4>
                          <div className={`w-3 h-3 rounded-full bg-${depot.color}-400`}></div>
                        </div>
                        <div className="text-sm text-slate-400 space-y-1">
                          <div>Type: {depot.type}</div>
                          <div>Capacity: {depot.capacity}</div>
                          <div className="flex items-center space-x-2">
                            <span>Status:</span>
                            <span className="text-green-400">{depot.status}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Success Footer */}
          <Card className="bg-gradient-to-r from-green-500/20 to-blue-500/20 border border-green-500/30 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <CheckCircle className="w-8 h-8 text-green-400" />
                <h2 className="text-2xl font-bold text-green-400">🎉 Enhanced LogiAI Successfully Deployed!</h2>
              </div>
              <p className="text-slate-300 text-lg">
                Advanced Vietnamese route optimization with intelligent search, nearest depot integration, and real-time interactive mapping is now fully operational.
                <br />
                <strong>Try typing Vietnamese locations with or without accents in the search above!</strong>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </AuthGuard>
  )
}
