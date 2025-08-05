'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Send, 
  MapPin, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  Truck, 
  Package,
  TrendingUp,
  Users,
  BarChart3
} from 'lucide-react'
import { useTranslation } from '@/lib/i18n/useTranslation'

interface DistributionOrder {
  id: string
  customerName: string
  destination: string
  items: number
  weight: number
  status: 'pending' | 'in_transit' | 'delivered' | 'delayed'
  priority: 'low' | 'medium' | 'high'
  orderDate: string
  expectedDelivery: string
  actualDelivery?: string
  driver: string
  vehicle: string
  cost: number
}

interface DeliveryMetrics {
  totalOrders: number
  delivered: number
  inTransit: number
  delayed: number
  onTimeRate: number
  avgDeliveryTime: number
  totalRevenue: number
}

export default function DistributionPage() {
  const { t, locale } = useTranslation()
  const [orders, setOrders] = useState<DistributionOrder[]>([])
  const [metrics, setMetrics] = useState<DeliveryMetrics | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedStatus, setSelectedStatus] = useState('all')

  useEffect(() => {
    loadDistributionData()
  }, [])

  const loadDistributionData = () => {
    // Mock data - in real app, this would come from API
    const mockOrders: DistributionOrder[] = [
      {
        id: 'DO001',
        customerName: locale === 'vi' ? 'Công ty TNHH ABC' : 'ABC Company Ltd',
        destination: locale === 'vi' ? 'Hà Nội' : 'Hanoi',
        items: 25,
        weight: 500,
        status: 'in_transit',
        priority: 'high',
        orderDate: '2024-08-01',
        expectedDelivery: '2024-08-05',
        driver: locale === 'vi' ? 'Nguyễn Văn A' : 'Nguyen Van A',
        vehicle: 'VN-001',
        cost: 15000000
      },
      {
        id: 'DO002',
        customerName: locale === 'vi' ? 'Siêu thị XYZ' : 'XYZ Supermarket',
        destination: locale === 'vi' ? 'TP. Hồ Chí Minh' : 'Ho Chi Minh City',
        items: 150,
        weight: 2000,
        status: 'delivered',
        priority: 'medium',
        orderDate: '2024-07-28',
        expectedDelivery: '2024-08-02',
        actualDelivery: '2024-08-02',
        driver: locale === 'vi' ? 'Trần Văn B' : 'Tran Van B',
        vehicle: 'VN-002',
        cost: 45000000
      },
      {
        id: 'DO003',
        customerName: locale === 'vi' ? 'Nhà máy DEF' : 'DEF Factory',
        destination: locale === 'vi' ? 'Đà Nẵng' : 'Da Nang',
        items: 75,
        weight: 1200,
        status: 'delayed',
        priority: 'high',
        orderDate: '2024-07-30',
        expectedDelivery: '2024-08-04',
        driver: locale === 'vi' ? 'Lê Văn C' : 'Le Van C',
        vehicle: 'VN-003',
        cost: 28000000
      },
      {
        id: 'DO004',
        customerName: locale === 'vi' ? 'Cửa hàng GHI' : 'GHI Store',
        destination: locale === 'vi' ? 'Cần Thơ' : 'Can Tho',
        items: 40,
        weight: 800,
        status: 'pending',
        priority: 'low',
        orderDate: '2024-08-03',
        expectedDelivery: '2024-08-08',
        driver: locale === 'vi' ? 'Phạm Văn D' : 'Pham Van D',
        vehicle: 'VN-004',
        cost: 20000000
      }
    ]

    const mockMetrics: DeliveryMetrics = {
      totalOrders: mockOrders.length,
      delivered: mockOrders.filter(o => o.status === 'delivered').length,
      inTransit: mockOrders.filter(o => o.status === 'in_transit').length,
      delayed: mockOrders.filter(o => o.status === 'delayed').length,
      onTimeRate: 85,
      avgDeliveryTime: 3.2,
      totalRevenue: mockOrders.reduce((sum, o) => sum + o.cost, 0)
    }

    setOrders(mockOrders)
    setMetrics(mockMetrics)
    setLoading(false)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-600" />
      case 'in_transit':
        return <Truck className="h-4 w-4 text-blue-600" />
      case 'delivered':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'delayed':
        return <AlertTriangle className="h-4 w-4 text-red-600" />
      default:
        return <Package className="h-4 w-4 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'in_transit':
        return 'bg-blue-100 text-blue-800'
      case 'delivered':
        return 'bg-green-100 text-green-800'
      case 'delayed':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800'
      case 'low':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(locale === 'vi' ? 'vi-VN' : 'en-US', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const filteredOrders = selectedStatus === 'all' 
    ? orders 
    : orders.filter(order => order.status === selectedStatus)

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-lg">{t('common.loading')}</span>
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
            <Send className="mr-3 h-8 w-8 text-blue-600" />
            {locale === 'vi' ? 'Quản lý Phân phối' : 'Distribution Management'}
          </h1>
          <p className="text-gray-600 mt-2">
            {locale === 'vi' 
              ? 'Theo dõi đơn hàng, giao hàng và hiệu suất phân phối'
              : 'Track orders, deliveries, and distribution performance'
            }
          </p>
        </div>
      </div>

      {/* Metrics Cards */}
      {metrics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Package className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    {locale === 'vi' ? 'Tổng đơn hàng' : 'Total Orders'}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">{metrics.totalOrders}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <CheckCircle className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    {locale === 'vi' ? 'Đã giao' : 'Delivered'}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">{metrics.delivered}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    {locale === 'vi' ? 'Tỷ lệ đúng hạn' : 'On-Time Rate'}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">{metrics.onTimeRate}%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <BarChart3 className="h-8 w-8 text-orange-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    {locale === 'vi' ? 'Doanh thu' : 'Revenue'}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(metrics.totalRevenue)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Orders Management */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <Truck className="mr-2 h-5 w-5" />
              {locale === 'vi' ? 'Đơn hàng Phân phối' : 'Distribution Orders'}
            </CardTitle>
            <div className="flex space-x-2">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">{locale === 'vi' ? 'Tất cả trạng thái' : 'All Status'}</option>
                <option value="pending">{locale === 'vi' ? 'Chờ xử lý' : 'Pending'}</option>
                <option value="in_transit">{locale === 'vi' ? 'Đang vận chuyển' : 'In Transit'}</option>
                <option value="delivered">{locale === 'vi' ? 'Đã giao' : 'Delivered'}</option>
                <option value="delayed">{locale === 'vi' ? 'Trễ hạn' : 'Delayed'}</option>
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <div key={order.id} className="border border-gray-200 rounded-lg p-6 hover:border-blue-300 transition-colors">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-semibold text-lg text-gray-900">{order.id}</h3>
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(order.status)}`}>
                        {locale === 'vi' 
                          ? (order.status === 'pending' ? 'Chờ xử lý' : 
                             order.status === 'in_transit' ? 'Đang vận chuyển' :
                             order.status === 'delivered' ? 'Đã giao' : 'Trễ hạn')
                          : order.status.replace('_', ' ').toUpperCase()
                        }
                      </span>
                      <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(order.priority)}`}>
                        {locale === 'vi' 
                          ? (order.priority === 'high' ? 'Cao' : order.priority === 'medium' ? 'Trung bình' : 'Thấp')
                          : order.priority.charAt(0).toUpperCase() + order.priority.slice(1)
                        }
                      </span>
                    </div>
                    <p className="text-gray-600 mb-3">{order.customerName}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-lg text-blue-600">{formatCurrency(order.cost)}</p>
                    <div className="flex items-center mt-1">
                      {getStatusIcon(order.status)}
                      <span className="ml-2 text-sm text-gray-600">
                        {locale === 'vi' ? 'Cập nhật:' : 'Updated:'} {new Date().toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="font-medium">{locale === 'vi' ? 'Điểm đến:' : 'Destination:'}</span>
                    </div>
                    <p className="text-gray-600 ml-6">{order.destination}</p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center">
                      <Package className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="font-medium">{locale === 'vi' ? 'Chi tiết:' : 'Details:'}</span>
                    </div>
                    <p className="text-gray-600 ml-6">
                      {order.items} {locale === 'vi' ? 'sản phẩm' : 'items'} • {order.weight}kg
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center">
                      <Users className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="font-medium">{locale === 'vi' ? 'Tài xế:' : 'Driver:'}</span>
                    </div>
                    <p className="text-gray-600 ml-6">{order.driver} • {order.vehicle}</p>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between text-sm">
                    <div>
                      <span className="font-medium text-gray-700">
                        {locale === 'vi' ? 'Ngày đặt:' : 'Order Date:'} 
                      </span>
                      <span className="ml-2 text-gray-600">
                        {new Date(order.orderDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">
                        {locale === 'vi' ? 'Dự kiến giao:' : 'Expected Delivery:'} 
                      </span>
                      <span className="ml-2 text-gray-600">
                        {new Date(order.expectedDelivery).toLocaleDateString()}
                      </span>
                    </div>
                    {order.actualDelivery && (
                      <div>
                        <span className="font-medium text-gray-700">
                          {locale === 'vi' ? 'Đã giao:' : 'Delivered:'} 
                        </span>
                        <span className="ml-2 text-green-600">
                          {new Date(order.actualDelivery).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
