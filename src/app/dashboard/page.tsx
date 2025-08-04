'use client'

import React, { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Package, Truck, Send, ShoppingCart, AlertTriangle, TrendingUp } from 'lucide-react'
import { supabase, isSupabaseConfigured } from '../../../supabase/client'

interface DashboardStats {
  totalInventory: number
  lowStockItems: number
  activeVehicles: number
  pendingOrders: number
  pendingProcurement: number
}

export default function DashboardPage() {
  const { user, userRole } = useAuth()
  const [stats, setStats] = useState<DashboardStats>({
    totalInventory: 0,
    lowStockItems: 0,
    activeVehicles: 0,
    pendingOrders: 0,
    pendingProcurement: 0,
  })
  const [loading, setLoading] = useState(true)

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
      })
      setLoading(false)
    }
  }, [])

  const fetchDashboardStats = async () => {
    if (!isSupabaseConfigured()) {
      // Use mock data when Supabase is not configured
      setStats({
        totalInventory: 1250,
        lowStockItems: 23,
        activeVehicles: 15,
        pendingOrders: 42,
        pendingProcurement: 8,
      })
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

      // Fetch distribution stats
      const { data: ordersData } = await supabase
        .from('distribution_orders')
        .select('status')
        .eq('status', 'pending')

      const pendingOrders = ordersData?.length || 0

      // Fetch procurement stats
      const { data: procurementData } = await supabase
        .from('procurement')
        .select('status')
        .eq('status', 'requested')

      const pendingProcurement = procurementData?.length || 0

      setStats({
        totalInventory,
        lowStockItems,
        activeVehicles,
        pendingOrders,
        pendingProcurement,
      })
    } catch (error) {
      console.error('Error fetching dashboard stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 18) return 'Good afternoon'
    return 'Good evening'
  }

  const getRoleDisplayName = (role: string) => {
    const roleNames = {
      admin: 'Administrator',
      warehouse: 'Warehouse Manager',
      transport: 'Transportation Manager',
      distribution: 'Distribution Manager',
      procurement: 'Procurement Manager',
    }
    return roleNames[role as keyof typeof roleNames] || role
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          {getGreeting()}, {user?.email}
        </h1>
        <p className="text-gray-600">
          {getRoleDisplayName(userRole || '')} Dashboard
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Inventory</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalInventory.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Items in stock
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.lowStockItems}</div>
            <p className="text-xs text-muted-foreground">
              Items need reordering
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Vehicles</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeVehicles}</div>
            <p className="text-xs text-muted-foreground">
              Available for dispatch
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
            <Send className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingOrders}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting dispatch
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common tasks for your role
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {(userRole === 'admin' || userRole === 'warehouse') && (
              <a
                href="/warehouse"
                className="flex items-center p-3 rounded-lg border hover:bg-gray-50 transition-colors"
              >
                <Package className="h-5 w-5 mr-3 text-blue-600" />
                <div>
                  <p className="font-medium">Manage Inventory</p>
                  <p className="text-sm text-gray-600">Add, update, or track stock levels</p>
                </div>
              </a>
            )}
            
            {(userRole === 'admin' || userRole === 'transport') && (
              <a
                href="/transportation"
                className="flex items-center p-3 rounded-lg border hover:bg-gray-50 transition-colors"
              >
                <Truck className="h-5 w-5 mr-3 text-green-600" />
                <div>
                  <p className="font-medium">Fleet Management</p>
                  <p className="text-sm text-gray-600">Track vehicles and assign drivers</p>
                </div>
              </a>
            )}
            
            {(userRole === 'admin' || userRole === 'procurement') && (
              <a
                href="/procurement"
                className="flex items-center p-3 rounded-lg border hover:bg-gray-50 transition-colors"
              >
                <ShoppingCart className="h-5 w-5 mr-3 text-purple-600" />
                <div>
                  <p className="font-medium">Procurement</p>
                  <p className="text-sm text-gray-600">Manage purchase orders and suppliers</p>
                </div>
              </a>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>AI Insights</CardTitle>
            <CardDescription>
              Smart recommendations for your operations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.lowStockItems > 0 && (
                <div className="flex items-start space-x-3 p-3 bg-orange-50 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-orange-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-orange-800">Stock Alert</p>
                    <p className="text-sm text-orange-700">
                      {stats.lowStockItems} items are running low. Consider reordering soon.
                    </p>
                  </div>
                </div>
              )}
              
              <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                <TrendingUp className="h-5 w-5 text-blue-500 mt-0.5" />
                <div>
                  <p className="font-medium text-blue-800">Optimization Tip</p>
                  <p className="text-sm text-blue-700">
                    Upload your logistics plans to get AI-powered optimization suggestions.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
