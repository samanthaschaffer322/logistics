'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { 
  ShoppingCart, 
  Plus, 
  Search, 
  Filter, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign,
  Package,
  Users
} from 'lucide-react'
import { useTranslation } from '@/lib/i18n/useTranslation'

interface ProcurementRequest {
  id: string
  item: string
  quantity: number
  urgency: 'low' | 'medium' | 'high'
  status: 'pending' | 'approved' | 'ordered' | 'received'
  requestDate: string
  expectedDate: string
  supplier: string
  estimatedCost: number
  department: string
}

interface Supplier {
  id: string
  name: string
  category: string
  rating: number
  totalOrders: number
  onTimeDelivery: number
  qualityScore: number
}

export default function ProcurementPage() {
  const { t, locale } = useTranslation()
  const [procurementRequests, setProcurementRequests] = useState<ProcurementRequest[]>([])
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  useEffect(() => {
    // Load procurement data
    loadProcurementData()
  }, [])

  const loadProcurementData = () => {
    // Mock data - in real app, this would come from API
    const mockRequests: ProcurementRequest[] = [
      {
        id: 'PR001',
        item: locale === 'vi' ? 'Pallet gỗ' : 'Wooden Pallets',
        quantity: 500,
        urgency: 'high',
        status: 'pending',
        requestDate: '2024-08-01',
        expectedDate: '2024-08-15',
        supplier: 'Vietnam Wood Co.',
        estimatedCost: 25000000,
        department: locale === 'vi' ? 'Kho hàng' : 'Warehouse'
      },
      {
        id: 'PR002',
        item: locale === 'vi' ? 'Băng tải' : 'Conveyor Belts',
        quantity: 10,
        urgency: 'medium',
        status: 'approved',
        requestDate: '2024-07-28',
        expectedDate: '2024-08-20',
        supplier: 'Industrial Equipment Ltd.',
        estimatedCost: 150000000,
        department: locale === 'vi' ? 'Sản xuất' : 'Production'
      },
      {
        id: 'PR003',
        item: locale === 'vi' ? 'Xe nâng' : 'Forklift',
        quantity: 2,
        urgency: 'low',
        status: 'ordered',
        requestDate: '2024-07-25',
        expectedDate: '2024-09-01',
        supplier: 'Heavy Machinery Vietnam',
        estimatedCost: 800000000,
        department: locale === 'vi' ? 'Logistics' : 'Logistics'
      }
    ]

    const mockSuppliers: Supplier[] = [
      {
        id: 'SUP001',
        name: 'Vietnam Wood Co.',
        category: locale === 'vi' ? 'Vật liệu' : 'Materials',
        rating: 4.5,
        totalOrders: 156,
        onTimeDelivery: 92,
        qualityScore: 88
      },
      {
        id: 'SUP002',
        name: 'Industrial Equipment Ltd.',
        category: locale === 'vi' ? 'Thiết bị' : 'Equipment',
        rating: 4.2,
        totalOrders: 89,
        onTimeDelivery: 87,
        qualityScore: 91
      },
      {
        id: 'SUP003',
        name: 'Heavy Machinery Vietnam',
        category: locale === 'vi' ? 'Máy móc' : 'Machinery',
        rating: 4.8,
        totalOrders: 45,
        onTimeDelivery: 95,
        qualityScore: 94
      }
    ]

    setProcurementRequests(mockRequests)
    setSuppliers(mockSuppliers)
    setLoading(false)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-600" />
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'ordered':
        return <Package className="h-4 w-4 text-blue-600" />
      case 'received':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-600" />
    }
  }

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
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

  const filteredRequests = procurementRequests.filter(request => {
    const matchesSearch = request.item.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.supplier.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || request.status === statusFilter
    return matchesSearch && matchesStatus
  })

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
            <ShoppingCart className="mr-3 h-8 w-8 text-green-600" />
            {locale === 'vi' ? 'Quản lý Mua sắm' : 'Procurement Management'}
          </h1>
          <p className="text-gray-600 mt-2">
            {locale === 'vi' 
              ? 'Quản lý yêu cầu mua sắm, nhà cung cấp và quy trình phê duyệt'
              : 'Manage procurement requests, suppliers, and approval processes'
            }
          </p>
        </div>
        <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center">
          <Plus className="mr-2 h-4 w-4" />
          {locale === 'vi' ? 'Yêu cầu mới' : 'New Request'}
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  {locale === 'vi' ? 'Chờ phê duyệt' : 'Pending Approval'}
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {procurementRequests.filter(r => r.status === 'pending').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Package className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  {locale === 'vi' ? 'Đã đặt hàng' : 'Ordered'}
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {procurementRequests.filter(r => r.status === 'ordered').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  {locale === 'vi' ? 'Tổng giá trị' : 'Total Value'}
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(procurementRequests.reduce((sum, r) => sum + r.estimatedCost, 0))}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  {locale === 'vi' ? 'Nhà cung cấp' : 'Suppliers'}
                </p>
                <p className="text-2xl font-bold text-gray-900">{suppliers.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Procurement Requests */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{locale === 'vi' ? 'Yêu cầu Mua sắm' : 'Procurement Requests'}</span>
                <div className="flex space-x-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input
                      type="text"
                      placeholder={locale === 'vi' ? 'Tìm kiếm...' : 'Search...'}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="all">{locale === 'vi' ? 'Tất cả' : 'All Status'}</option>
                    <option value="pending">{locale === 'vi' ? 'Chờ xử lý' : 'Pending'}</option>
                    <option value="approved">{locale === 'vi' ? 'Đã phê duyệt' : 'Approved'}</option>
                    <option value="ordered">{locale === 'vi' ? 'Đã đặt hàng' : 'Ordered'}</option>
                    <option value="received">{locale === 'vi' ? 'Đã nhận' : 'Received'}</option>
                  </select>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredRequests.map((request) => (
                  <div key={request.id} className="border border-gray-200 rounded-lg p-4 hover:border-green-300 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-semibold text-gray-900">{request.item}</h3>
                          <span className={`px-2 py-1 text-xs rounded-full ${getUrgencyColor(request.urgency)}`}>
                            {locale === 'vi' 
                              ? (request.urgency === 'high' ? 'Cao' : request.urgency === 'medium' ? 'Trung bình' : 'Thấp')
                              : request.urgency.charAt(0).toUpperCase() + request.urgency.slice(1)
                            }
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                          <div>
                            <span className="font-medium">{locale === 'vi' ? 'Số lượng:' : 'Quantity:'}</span> {request.quantity.toLocaleString()}
                          </div>
                          <div>
                            <span className="font-medium">{locale === 'vi' ? 'Nhà cung cấp:' : 'Supplier:'}</span> {request.supplier}
                          </div>
                          <div>
                            <span className="font-medium">{locale === 'vi' ? 'Phòng ban:' : 'Department:'}</span> {request.department}
                          </div>
                          <div>
                            <span className="font-medium">{locale === 'vi' ? 'Dự kiến:' : 'Expected:'}</span> {new Date(request.expectedDate).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="mt-2 flex items-center justify-between">
                          <span className="font-semibold text-green-600">{formatCurrency(request.estimatedCost)}</span>
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(request.status)}
                            <span className="text-sm capitalize">
                              {locale === 'vi' 
                                ? (request.status === 'pending' ? 'Chờ xử lý' : 
                                   request.status === 'approved' ? 'Đã phê duyệt' :
                                   request.status === 'ordered' ? 'Đã đặt hàng' : 'Đã nhận')
                                : request.status
                              }
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Suppliers */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>{locale === 'vi' ? 'Nhà cung cấp Hàng đầu' : 'Top Suppliers'}</CardTitle>
              <CardDescription>
                {locale === 'vi' ? 'Hiệu suất nhà cung cấp' : 'Supplier performance metrics'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {suppliers.map((supplier) => (
                  <div key={supplier.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-gray-900">{supplier.name}</h3>
                        <p className="text-sm text-gray-600">{supplier.category}</p>
                      </div>
                      <div className="flex items-center">
                        <span className="text-yellow-500">★</span>
                        <span className="ml-1 text-sm font-medium">{supplier.rating}</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                      <div>
                        <span className="font-medium">{locale === 'vi' ? 'Đơn hàng:' : 'Orders:'}</span> {supplier.totalOrders}
                      </div>
                      <div>
                        <span className="font-medium">{locale === 'vi' ? 'Đúng hạn:' : 'On-time:'}</span> {supplier.onTimeDelivery}%
                      </div>
                      <div className="col-span-2">
                        <span className="font-medium">{locale === 'vi' ? 'Chất lượng:' : 'Quality:'}</span> {supplier.qualityScore}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
