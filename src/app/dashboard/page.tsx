'use client'

import React, { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Package, Truck, Send, ShoppingCart, AlertTriangle, TrendingUp, Brain, FileText } from 'lucide-react'
import { supabase, isSupabaseConfigured } from '../../../supabase/client'
import { FileData } from '@/lib/file-learning/file-processor'

interface DashboardStats {
  totalInventory: number
  lowStockItems: number
  activeVehicles: number
  pendingOrders: number
  pendingProcurement: number
  uploadedFiles: number
  aiInsights: number
}

export default function DashboardPage() {
  const { user, userRole } = useAuth()
  const [stats, setStats] = useState<DashboardStats>({
    totalInventory: 0,
    lowStockItems: 0,
    activeVehicles: 0,
    pendingOrders: 0,
    pendingProcurement: 0,
    uploadedFiles: 0,
    aiInsights: 0
  })
  const [loading, setLoading] = useState(true)
  const [recentFiles, setRecentFiles] = useState<FileData[]>([])
  const [recentInsights, setRecentInsights] = useState<string[]>([])

  useEffect(() => {
    if (isSupabaseConfigured()) {
      fetchDashboardStats()
    } else {
      // Use mock data for build time or when Supabase is not configured
      setStats({
        totalInventory: 1250,
        lowStockItems: 23,
        activeVehicles: 15,
        pendingOrders: 42,
        pendingProcurement: 8,
        uploadedFiles: 0,
        aiInsights: 0
      })
      setLoading(false)
    }
    
    // Load file learning data
    loadFileLearningData()
  }, [])

  const loadFileLearningData = () => {
    try {
      const filesData = JSON.parse(localStorage.getItem('logiai_files') || '[]') as FileData[]
      const completedFiles = filesData.filter(f => f.status === 'completed')
      
      setRecentFiles(completedFiles.slice(-5)) // Last 5 files
      setStats(prev => ({
        ...prev,
        uploadedFiles: filesData.length,
        aiInsights: completedFiles.reduce((sum, f) => sum + f.insights.recommendations.length, 0)
      }))
      
      // Collect recent insights
      const insights = completedFiles
        .flatMap(f => f.insights.recommendations)
        .slice(-10) // Last 10 insights
      setRecentInsights(insights)
      
    } catch (error) {
      console.error('Error loading file learning data:', error)
    }
  }

  const fetchDashboardStats = async () => {
    if (!isSupabaseConfigured()) {
      // Use mock data when Supabase is not configured
      setStats(prev => ({
        ...prev,
        totalInventory: 1250,
        lowStockItems: 23,
        activeVehicles: 15,
        pendingOrders: 42,
        pendingProcurement: 8
      }))
      setLoading(false)
      return
    }

    try {
      // Fetch inventory stats
      const { data: inventoryData } = await supabase
        .from('inventory')
        .select('quantity, reorder_level')

      const totalInventory = inventoryData?.reduce((sum, item) => sum + item.quantity, 0) || 0
      const lowStockItems = inventoryData?.filter(item => item.quantity <= item.reorder_level).length || 0

      // Fetch fleet stats
      const { data: fleetData } = await supabase
        .from('fleet')
        .select('status')
        .eq('status', 'available')

      const activeVehicles = fleetData?.length || 0

      // Fetch distribution orders
      const { data: ordersData } = await supabase
        .from('distribution_orders')
        .select('status')
        .eq('status', 'pending')

      const pendingOrders = ordersData?.length || 0

      // Fetch procurement requests
      const { data: procurementData } = await supabase
        .from('procurement')
        .select('status')
        .eq('status', 'requested')

      const pendingProcurement = procurementData?.length || 0

      setStats(prev => ({
        ...prev,
        totalInventory,
        lowStockItems,
        activeVehicles,
        pendingOrders,
        pendingProcurement
      }))

    } catch (error) {
      console.error('Error fetching dashboard stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-lg">Loading dashboard...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.name || 'User'}!
          </h1>
          <p className="text-gray-600 mt-1">
            Here&apos;s what&apos;s happening with your logistics operations today.
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Last updated</p>
          <p className="text-sm font-medium">{new Date().toLocaleString()}</p>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Package className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Inventory</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalInventory.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <AlertTriangle className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Low Stock Items</p>
                <p className="text-2xl font-bold text-gray-900">{stats.lowStockItems}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Truck className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Vehicles</p>
                <p className="text-2xl font-bold text-gray-900">{stats.activeVehicles}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Send className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending Orders</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pendingOrders}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI File Learning Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-indigo-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Uploaded Files</p>
                <p className="text-2xl font-bold text-gray-900">{stats.uploadedFiles}</p>
                <p className="text-xs text-gray-500 mt-1">Files processed by AI engine</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Brain className="h-8 w-8 text-pink-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">AI Insights Generated</p>
                <p className="text-2xl font-bold text-gray-900">{stats.aiInsights}</p>
                <p className="text-xs text-gray-500 mt-1">Recommendations from file analysis</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Files */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="mr-2 h-5 w-5" />
              Recent File Analysis
            </CardTitle>
            <CardDescription>
              Latest files processed by the AI learning engine
            </CardDescription>
          </CardHeader>
          <CardContent>
            {recentFiles.length > 0 ? (
              <div className="space-y-3">
                {recentFiles.map((file) => (
                  <div key={file.id} className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <FileText className="h-4 w-4 text-gray-600 mr-3" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">{file.fileName}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(file.uploadDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-green-600">
                        {file.insights.recommendations.length} insights
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-500">No files uploaded yet</p>
                <p className="text-sm text-gray-400 mt-1">
                  Upload Excel, PDF, or CSV files to get AI insights
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent AI Insights */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Brain className="mr-2 h-5 w-5" />
              Latest AI Insights
            </CardTitle>
            <CardDescription>
              Recent recommendations from file analysis
            </CardDescription>
          </CardHeader>
          <CardContent>
            {recentInsights.length > 0 ? (
              <div className="space-y-3">
                {recentInsights.slice(0, 5).map((insight, index) => (
                  <div key={index} className="flex items-start p-3 bg-blue-50 rounded-lg">
                    <TrendingUp className="h-4 w-4 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                    <p className="text-sm text-blue-800">{insight}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Brain className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-500">No AI insights yet</p>
                <p className="text-sm text-gray-400 mt-1">
                  Upload files to generate AI-powered recommendations
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Common tasks and navigation shortcuts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <a
              href="/file-learning"
              className="flex items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
            >
              <Brain className="h-6 w-6 text-purple-600 mr-3" />
              <div>
                <p className="font-medium text-gray-900">Upload Files</p>
                <p className="text-sm text-gray-600">AI file analysis</p>
              </div>
            </a>

            <a
              href="/ai-optimization"
              className="flex items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <TrendingUp className="h-6 w-6 text-blue-600 mr-3" />
              <div>
                <p className="font-medium text-gray-900">AI Optimization</p>
                <p className="text-sm text-gray-600">Demand forecasting</p>
              </div>
            </a>

            <a
              href="/shipments"
              className="flex items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
            >
              <Send className="h-6 w-6 text-green-600 mr-3" />
              <div>
                <p className="font-medium text-gray-900">Shipments</p>
                <p className="text-sm text-gray-600">Manage deliveries</p>
              </div>
            </a>

            <a
              href="/ai-assistant"
              className="flex items-center p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors"
            >
              <Brain className="h-6 w-6 text-orange-600 mr-3" />
              <div>
                <p className="font-medium text-gray-900">AI Assistant</p>
                <p className="text-sm text-gray-600">Get help & insights</p>
              </div>
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
