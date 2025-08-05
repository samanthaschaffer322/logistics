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
  Download
} from 'lucide-react'

const AnalyticsPage = () => {
  const [timeRange, setTimeRange] = useState('30d')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading analytics data
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [timeRange])

  const kpiData = [
    {
      title: 'Total Revenue',
      value: '₫2.85B',
      change: '+12.5%',
      trend: 'up',
      icon: DollarSign,
      color: 'text-green-600'
    },
    {
      title: 'Shipments Delivered',
      value: '1,247',
      change: '+8.3%',
      trend: 'up',
      icon: Package,
      color: 'text-blue-600'
    },
    {
      title: 'Average Delivery Time',
      value: '2.4 days',
      change: '-15.2%',
      trend: 'down',
      icon: Clock,
      color: 'text-purple-600'
    },
    {
      title: 'Fleet Utilization',
      value: '87.2%',
      change: '+5.1%',
      trend: 'up',
      icon: Truck,
      color: 'text-orange-600'
    }
  ]

  const routePerformance = [
    { route: 'HCMC → Hanoi', deliveries: 156, onTime: 94.5, avgCost: '₫2.1M' },
    { route: 'Da Nang → Hai Phong', deliveries: 89, onTime: 96.2, avgCost: '₫1.8M' },
    { route: 'Can Tho → Nha Trang', deliveries: 67, onTime: 91.8, avgCost: '₫1.5M' },
    { route: 'Hanoi → HCMC', deliveries: 134, onTime: 93.1, avgCost: '₫2.0M' },
    { route: 'Hai Phong → Da Nang', deliveries: 78, onTime: 95.4, avgCost: '₫1.7M' }
  ]

  const aiInsights = [
    {
      type: 'optimization',
      title: 'Route Efficiency Improvement',
      description: 'AI identified 15% fuel savings opportunity on HCMC-Hanoi route',
      impact: 'High',
      status: 'actionable'
    },
    {
      type: 'prediction',
      title: 'Demand Forecast',
      description: 'Expected 20% increase in shipments during Tet holiday season',
      impact: 'Medium',
      status: 'monitoring'
    },
    {
      type: 'risk',
      title: 'Weather Risk Alert',
      description: 'Monsoon season may affect southern routes in next 2 weeks',
      impact: 'High',
      status: 'warning'
    },
    {
      type: 'cost',
      title: 'Cost Optimization',
      description: 'Container consolidation could reduce costs by ₫500K/month',
      impact: 'Medium',
      status: 'actionable'
    }
  ]

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'optimization': return <Zap className="w-4 h-4 text-yellow-600" />
      case 'prediction': return <TrendingUp className="w-4 h-4 text-blue-600" />
      case 'risk': return <AlertTriangle className="w-4 h-4 text-red-600" />
      case 'cost': return <DollarSign className="w-4 h-4 text-green-600" />
      default: return <BarChart3 className="w-4 h-4 text-gray-600" />
    }
  }

  const getInsightColor = (status: string) => {
    switch (status) {
      case 'actionable': return 'bg-green-100 text-green-800'
      case 'warning': return 'bg-red-100 text-red-800'
      case 'monitoring': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (isLoading) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading analytics data...</p>
            </div>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <BarChart3 className="w-8 h-8 text-blue-600" />
              Analytics & Insights
            </h1>
            <p className="text-gray-600 mt-1">
              AI-powered analytics and performance insights
            </p>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last year</option>
            </select>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {kpiData.map((kpi, index) => {
            const Icon = kpi.icon
            return (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{kpi.title}</p>
                      <p className="text-2xl font-bold text-gray-900">{kpi.value}</p>
                    </div>
                    <Icon className={`w-8 h-8 ${kpi.color}`} />
                  </div>
                  <div className="mt-2 flex items-center">
                    {kpi.trend === 'up' ? (
                      <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-green-600 mr-1" />
                    )}
                    <span className="text-sm font-medium text-green-600">{kpi.change}</span>
                    <span className="text-sm text-gray-600 ml-1">vs last period</span>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <Tabs defaultValue="performance" className="space-y-4">
          <TabsList>
            <TabsTrigger value="performance">Route Performance</TabsTrigger>
            <TabsTrigger value="insights">AI Insights</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
          </TabsList>

          <TabsContent value="performance" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  Route Performance Analysis
                </CardTitle>
                <CardDescription>
                  Detailed performance metrics for major logistics routes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Route</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Deliveries</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">On-Time %</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Avg Cost</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Performance</th>
                      </tr>
                    </thead>
                    <tbody>
                      {routePerformance.map((route, index) => (
                        <tr key={index} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4 font-medium">{route.route}</td>
                          <td className="py-3 px-4">{route.deliveries}</td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <span>{route.onTime}%</span>
                              <Progress value={route.onTime} className="w-16 h-2" />
                            </div>
                          </td>
                          <td className="py-3 px-4">{route.avgCost}</td>
                          <td className="py-3 px-4">
                            <Badge className={route.onTime >= 95 ? 'bg-green-100 text-green-800' : 
                                             route.onTime >= 90 ? 'bg-yellow-100 text-yellow-800' : 
                                             'bg-red-100 text-red-800'}>
                              {route.onTime >= 95 ? 'Excellent' : 
                               route.onTime >= 90 ? 'Good' : 'Needs Improvement'}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="insights" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {aiInsights.map((insight, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      {getInsightIcon(insight.type)}
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-medium text-gray-900">{insight.title}</h3>
                          <Badge className={getInsightColor(insight.status)}>
                            {insight.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{insight.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">Impact: {insight.impact}</span>
                          {insight.status === 'actionable' && (
                            <Button size="sm" variant="outline">
                              Take Action
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="trends" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                    Monthly Growth Trends
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-600">Revenue Growth</span>
                        <span className="text-sm font-medium text-green-600">+12.5%</span>
                      </div>
                      <Progress value={75} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-600">Shipment Volume</span>
                        <span className="text-sm font-medium text-blue-600">+8.3%</span>
                      </div>
                      <Progress value={65} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-600">Customer Satisfaction</span>
                        <span className="text-sm font-medium text-purple-600">+6.1%</span>
                      </div>
                      <Progress value={85} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-600">Operational Efficiency</span>
                        <span className="text-sm font-medium text-orange-600">+9.7%</span>
                      </div>
                      <Progress value={70} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-blue-600" />
                    Seasonal Patterns
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <h4 className="font-medium text-blue-900">Peak Season (Oct-Dec)</h4>
                      <p className="text-sm text-blue-700">35% increase in shipment volume</p>
                      <p className="text-sm text-blue-600">Tet holiday preparation period</p>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg">
                      <h4 className="font-medium text-green-900">Stable Period (Mar-Sep)</h4>
                      <p className="text-sm text-green-700">Consistent demand patterns</p>
                      <p className="text-sm text-green-600">Optimal for route optimization</p>
                    </div>
                    <div className="p-3 bg-yellow-50 rounded-lg">
                      <h4 className="font-medium text-yellow-900">Low Season (Jan-Feb)</h4>
                      <p className="text-sm text-yellow-700">20% decrease during Tet</p>
                      <p className="text-sm text-yellow-600">Maintenance and planning period</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  )
}

export default AnalyticsPage
