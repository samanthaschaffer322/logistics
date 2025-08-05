'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui-components'
import { Brain, TrendingUp, AlertTriangle, Target, Zap, BarChart3 } from 'lucide-react'
import { 
  aiHybridForecasting, 
  optimizeInventory, 
  optimizeRoute,
  type ForecastResult,
  type InventoryOptimization,
  type OptimizedRoute,
  type RoutePoint
} from '@/lib/ai/demand-forecasting'
import { 
  supplyChainAI, 
  type AIRecommendation, 
  type SupplyChainContext 
} from '@/lib/ai/openai-integration'

export default function AIOptimizationPage() {
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([])
  const [forecast, setForecast] = useState<ForecastResult[]>([])
  const [inventoryOptimization, setInventoryOptimization] = useState<InventoryOptimization | null>(null)
  const [optimizedRoute, setOptimizedRoute] = useState<OptimizedRoute | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'overview' | 'forecast' | 'inventory' | 'routing'>('overview')

  useEffect(() => {
    loadAIOptimizations()
  }, [])

  const loadAIOptimizations = async () => {
    setLoading(true)
    
    try {
      // Mock supply chain context
      const context: SupplyChainContext = {
        inventory: [
          { item: 'Widget A', currentStock: 150, reorderLevel: 200, demand: 300 },
          { item: 'Widget B', currentStock: 75, reorderLevel: 100, demand: 150 },
          { item: 'Widget C', currentStock: 300, reorderLevel: 150, demand: 200 }
        ],
        shipments: [
          { id: 'SH001', status: 'in_transit', destination: 'New York', priority: 'high' },
          { id: 'SH002', status: 'pending', destination: 'Los Angeles', priority: 'medium' },
          { id: 'SH003', status: 'delivered', destination: 'Chicago', priority: 'low' }
        ],
        suppliers: [
          { name: 'Supplier A', reliability: 95, leadTime: 7, cost: 10.50 },
          { name: 'Supplier B', reliability: 88, leadTime: 14, cost: 9.75 },
          { name: 'Supplier C', reliability: 92, leadTime: 10, cost: 11.25 }
        ],
        constraints: {
          budget: 100000,
          capacity: 5000,
          timeframe: '3 months'
        }
      }

      // Get AI recommendations
      const aiRecommendations = await supplyChainAI.getRecommendations(context)
      setRecommendations(aiRecommendations)

      // Generate demand forecast
      const historicalData = [
        { date: '2024-01-01', demand: 280, seasonality: 1.0, trend: 1.0 },
        { date: '2024-02-01', demand: 320, seasonality: 1.1, trend: 1.05 },
        { date: '2024-03-01', demand: 350, seasonality: 1.2, trend: 1.1 },
        { date: '2024-04-01', demand: 310, seasonality: 1.0, trend: 1.08 },
        { date: '2024-05-01', demand: 340, seasonality: 1.15, trend: 1.12 },
        { date: '2024-06-01', demand: 380, seasonality: 1.25, trend: 1.15 }
      ]

      const demandForecast = aiHybridForecasting(historicalData, {
        method: 'ai_hybrid',
        periods: 6,
        includeSeasonality: true
      })
      setForecast(demandForecast)

      // Optimize inventory
      const inventoryOpt = optimizeInventory(
        demandForecast,
        150, // current stock
        7,   // lead time
        0.95, // service level
        10.50, // unit cost
        0.25   // carrying cost rate
      )
      setInventoryOptimization(inventoryOpt)

      // Optimize route
      const startPoint: RoutePoint = {
        id: 'warehouse',
        address: 'Main Warehouse',
        lat: 40.7128,
        lng: -74.0060,
        priority: 10
      }

      const deliveryPoints: RoutePoint[] = [
        { id: 'del1', address: 'Customer A', lat: 40.7589, lng: -73.9851, priority: 8 },
        { id: 'del2', address: 'Customer B', lat: 40.6892, lng: -74.0445, priority: 6 },
        { id: 'del3', address: 'Customer C', lat: 40.7831, lng: -73.9712, priority: 9 },
        { id: 'del4', address: 'Customer D', lat: 40.7282, lng: -73.7949, priority: 7 }
      ]

      const routeOpt = optimizeRoute(startPoint, deliveryPoints, 1000, 0.15)
      setOptimizedRoute(routeOpt)

    } catch (error) {
      console.error('Error loading AI optimizations:', error)
    } finally {
      setLoading(false)
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'text-red-600 bg-red-50'
      case 'high': return 'text-orange-600 bg-orange-50'
      case 'medium': return 'text-yellow-600 bg-yellow-50'
      case 'low': return 'text-green-600 bg-green-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-lg">Loading AI optimizations...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Brain className="mr-3 h-8 w-8 text-blue-600" />
            AI Supply Chain Optimization
          </h1>
          <p className="text-gray-600 mt-2">
            Advanced AI-powered insights and recommendations for your logistics operations
          </p>
        </div>
        <button
          onClick={loadAIOptimizations}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
        >
          <Zap className="mr-2 h-4 w-4" />
          Refresh Analysis
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'forecast', label: 'Demand Forecast', icon: TrendingUp },
            { id: 'inventory', label: 'Inventory Optimization', icon: Target },
            { id: 'routing', icon: AlertTriangle }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as 'overview' | 'forecast' | 'inventory' | 'routing')}
              className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="mr-2 h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <TrendingUp className="h-8 w-8 text-green-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Forecast Accuracy</p>
                    <p className="text-2xl font-bold text-gray-900">94.2%</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Target className="h-8 w-8 text-blue-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Inventory Efficiency</p>
                    <p className="text-2xl font-bold text-gray-900">87.5%</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <AlertTriangle className="h-8 w-8 text-orange-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Route Efficiency</p>
                    <p className="text-2xl font-bold text-gray-900">91.8%</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Brain className="h-8 w-8 text-purple-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">AI Confidence</p>
                    <p className="text-2xl font-bold text-gray-900">89.3%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* AI Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Brain className="mr-2 h-5 w-5" />
                AI Recommendations
              </CardTitle>
              <CardDescription>
                Actionable insights generated by our AI optimization engine
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recommendations.map((rec, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(rec.priority)}`}>
                            {rec.priority.toUpperCase()}
                          </span>
                          <span className="ml-2 text-sm text-gray-500">
                            Confidence: {Math.round(rec.confidence * 100)}%
                          </span>
                        </div>
                        <h4 className="font-semibold text-gray-900 mb-2">{rec.title}</h4>
                        <p className="text-gray-600 mb-3">{rec.description}</p>
                        <div className="mb-3">
                          <p className="text-sm font-medium text-green-600">{rec.impact}</p>
                          {rec.estimatedSavings && (
                            <p className="text-sm text-gray-500">
                              Estimated savings: ${rec.estimatedSavings.toLocaleString()}
                            </p>
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-700 mb-1">Action Items:</p>
                          <ul className="text-sm text-gray-600 space-y-1">
                            {rec.actionItems?.map((item, idx) => (
                              <li key={idx} className="flex items-start">
                                <span className="mr-2">•</span>
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Forecast Tab */}
      {activeTab === 'forecast' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="mr-2 h-5 w-5" />
                AI Demand Forecast
              </CardTitle>
              <CardDescription>
                6-month demand prediction using hybrid AI algorithms
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm font-medium text-blue-600">Average Forecast</p>
                    <p className="text-2xl font-bold text-blue-900">
                      {Math.round(forecast.reduce((sum, f) => sum + f.predictedDemand, 0) / forecast.length || 0)}
                    </p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-sm font-medium text-green-600">Trend Direction</p>
                    <p className="text-2xl font-bold text-green-900 capitalize">
                      {forecast[0]?.trend || 'Stable'}
                    </p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <p className="text-sm font-medium text-purple-600">Avg Confidence</p>
                    <p className="text-2xl font-bold text-purple-900">
                      {Math.round((forecast.reduce((sum, f) => sum + f.confidence, 0) / forecast.length || 0) * 100)}%
                    </p>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Period
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Predicted Demand
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Confidence
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Seasonality Factor
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Trend
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {forecast.map((item, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {new Date(item.period).toLocaleDateString('en-US', { 
                              year: 'numeric', 
                              month: 'short' 
                            })}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {item.predictedDemand.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            <div className="flex items-center">
                              <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                                <div 
                                  className="bg-blue-600 h-2 rounded-full" 
                                  style={{ width: `${item.confidence * 100}%` }}
                                ></div>
                              </div>
                              {Math.round(item.confidence * 100)}%
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {item.seasonalityFactor.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              item.trend === 'increasing' ? 'bg-green-100 text-green-800' :
                              item.trend === 'decreasing' ? 'bg-red-100 text-red-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {item.trend}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Inventory Tab */}
      {activeTab === 'inventory' && inventoryOptimization && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="mr-2 h-5 w-5" />
                Inventory Optimization Analysis
              </CardTitle>
              <CardDescription>
                AI-powered inventory recommendations based on demand forecast
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm font-medium text-blue-600">Current Stock</p>
                  <p className="text-2xl font-bold text-blue-900">
                    {inventoryOptimization.currentStock.toLocaleString()}
                  </p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm font-medium text-green-600">Recommended Stock</p>
                  <p className="text-2xl font-bold text-green-900">
                    {inventoryOptimization.recommendedStock.toLocaleString()}
                  </p>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg">
                  <p className="text-sm font-medium text-orange-600">Reorder Point</p>
                  <p className="text-2xl font-bold text-orange-900">
                    {inventoryOptimization.reorderPoint.toLocaleString()}
                  </p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <p className="text-sm font-medium text-purple-600">EOQ</p>
                  <p className="text-2xl font-bold text-purple-900">
                    {inventoryOptimization.economicOrderQuantity.toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-red-50 p-4 rounded-lg">
                  <p className="text-sm font-medium text-red-600">Stockout Risk</p>
                  <div className="flex items-center mt-2">
                    <div className="w-full bg-red-200 rounded-full h-3 mr-3">
                      <div 
                        className="bg-red-600 h-3 rounded-full" 
                        style={{ width: `${inventoryOptimization.stockoutRisk * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-lg font-bold text-red-900">
                      {Math.round(inventoryOptimization.stockoutRisk * 100)}%
                    </span>
                  </div>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <p className="text-sm font-medium text-yellow-600">Carrying Cost</p>
                  <p className="text-2xl font-bold text-yellow-900">
                    ${inventoryOptimization.carryingCost.toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-3">Optimization Recommendations</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start">
                    <span className="mr-2 text-green-600">✓</span>
                    {inventoryOptimization.currentStock < inventoryOptimization.reorderPoint 
                      ? 'Immediate reorder recommended - stock below reorder point'
                      : 'Current stock levels are adequate'
                    }
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-blue-600">•</span>
                    Optimal order quantity: {inventoryOptimization.economicOrderQuantity} units
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-blue-600">•</span>
                    Maintain safety stock above {inventoryOptimization.reorderPoint} units
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-blue-600">•</span>
                    Monitor carrying costs - currently ${inventoryOptimization.carryingCost}/month
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Routing Tab */}
      {activeTab === 'routing' && optimizedRoute && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="mr-2 h-5 w-5" />
                Route Optimization Results
              </CardTitle>
              <CardDescription>
                AI-optimized delivery routes for maximum efficiency
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm font-medium text-blue-600">Total Distance</p>
                  <p className="text-2xl font-bold text-blue-900">
                    {optimizedRoute.totalDistance} km
                  </p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm font-medium text-green-600">Estimated Time</p>
                  <p className="text-2xl font-bold text-green-900">
                    {optimizedRoute.estimatedTime} min
                  </p>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg">
                  <p className="text-sm font-medium text-orange-600">Fuel Cost</p>
                  <p className="text-2xl font-bold text-orange-900">
                    ${optimizedRoute.fuelCost}
                  </p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <p className="text-sm font-medium text-purple-600">Efficiency</p>
                  <p className="text-2xl font-bold text-purple-900">
                    {optimizedRoute.efficiency}/100km
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-3">Optimized Route Sequence</h4>
                <div className="space-y-3">
                  {optimizedRoute.points.map((point, index) => (
                    <div key={point.id} className="flex items-center p-3 bg-white rounded-lg">
                      <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </div>
                      <div className="ml-4 flex-1">
                        <p className="font-medium text-gray-900">{point.address}</p>
                        <p className="text-sm text-gray-500">
                          Priority: {point.priority}/10 | 
                          Coordinates: {point.lat.toFixed(4)}, {point.lng.toFixed(4)}
                        </p>
                      </div>
                      {index < optimizedRoute.points.length - 1 && (
                        <div className="text-gray-400">
                          →
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 p-4 bg-green-50 rounded-lg">
                <h4 className="font-semibold text-green-900 mb-3">Optimization Benefits</h4>
                <ul className="space-y-2 text-sm text-green-700">
                  <li className="flex items-start">
                    <span className="mr-2">✓</span>
                    Route optimized for minimum distance and maximum efficiency
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">✓</span>
                    Priority-based sequencing ensures critical deliveries first
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">✓</span>
                    Estimated fuel savings: 15-20% compared to manual routing
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">✓</span>
                    Reduced delivery time and improved customer satisfaction
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
