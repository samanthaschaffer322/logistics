'use client'

import React, { useEffect, useState } from 'react'
import { supabase, isSupabaseConfigured } from '../../../supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui'
import { Button } from '@/components/ui'
import { Input } from '@/components/ui'
import { 
  Package, 
  Plus, 
  Search, 
  Eye, 
  Edit, 
  Truck, 
  MapPin, 
  Clock, 
  DollarSign,
  AlertCircle,
  CheckCircle,
  XCircle,
  Filter
} from 'lucide-react'
import { formatDate } from '@/lib/utils'

interface Shipment {
  id: string
  docket_no: string
  sender_id: string
  receiver_id: string
  package_contact_person: string
  package_contact_phone: string
  package_type: string
  package_weight: number
  pickup_address: string
  delivery_address: string
  transport_company: string
  transport_driver: string
  transport_vehicle: string
  charge_total: number
  charge_advance_paid: number
  charge_balance: number
  status: 'pending' | 'picked_up' | 'in_transit' | 'out_for_delivery' | 'delivered' | 'cancelled'
  priority: 'low' | 'normal' | 'high' | 'urgent'
  pickup_date: string
  delivery_date: string
  estimated_delivery: string
  payment_status: 'pending' | 'partial' | 'paid' | 'overdue'
  current_location: string
  notes: string
  created_at: string
}

interface Customer {
  id: string
  company_name: string
  contact_person: string
  email: string
  phone: string
}

export default function ShipmentsPage() {
  const [shipments, setShipments] = useState<Shipment[]>([])
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [priorityFilter, setPriorityFilter] = useState<string>('all')

  useEffect(() => {
    if (isSupabaseConfigured()) {
      fetchData()
    } else {
      // Use mock data for build time
      setShipments([])
      setCustomers([])
      setLoading(false)
    }
  }, [])

  const fetchData = async () => {
    if (!isSupabaseConfigured()) {
      setShipments([])
      setCustomers([])
      setLoading(false)
      return
    }

    try {
      // Fetch shipments
      const { data: shipmentData, error: shipmentError } = await supabase
        .from('shipments')
        .select('*')
        .order('created_at', { ascending: false })

      if (shipmentError) throw shipmentError

      // Fetch customers
      const { data: customerData, error: customerError } = await supabase
        .from('customers')
        .select('*')
        .eq('status', 'active')

      if (customerError) throw customerError

      setShipments(shipmentData || [])
      setCustomers(customerData || [])
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: Shipment['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'picked_up':
        return 'bg-blue-100 text-blue-800'
      case 'in_transit':
        return 'bg-purple-100 text-purple-800'
      case 'out_for_delivery':
        return 'bg-orange-100 text-orange-800'
      case 'delivered':
        return 'bg-green-100 text-green-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority: Shipment['priority']) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-800'
      case 'high':
        return 'bg-orange-100 text-orange-800'
      case 'normal':
        return 'bg-blue-100 text-blue-800'
      case 'low':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: Shipment['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />
      case 'picked_up':
      case 'in_transit':
        return <Truck className="h-4 w-4" />
      case 'out_for_delivery':
        return <MapPin className="h-4 w-4" />
      case 'delivered':
        return <CheckCircle className="h-4 w-4" />
      case 'cancelled':
        return <XCircle className="h-4 w-4" />
      default:
        return <Package className="h-4 w-4" />
    }
  }

  const filteredShipments = shipments.filter(shipment => {
    const matchesSearch = 
      shipment.docket_no.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.package_contact_person?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.pickup_address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.delivery_address?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === 'all' || shipment.status === statusFilter
    const matchesPriority = priorityFilter === 'all' || shipment.priority === priorityFilter

    return matchesSearch && matchesStatus && matchesPriority
  })

  const stats = {
    total: shipments.length,
    pending: shipments.filter(s => s.status === 'pending').length,
    inTransit: shipments.filter(s => ['picked_up', 'in_transit', 'out_for_delivery'].includes(s.status)).length,
    delivered: shipments.filter(s => s.status === 'delivered').length,
    totalRevenue: shipments.reduce((sum, s) => sum + (s.charge_total || 0), 0),
    pendingPayments: shipments.filter(s => s.payment_status !== 'paid').length,
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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Shipment Management</h1>
          <p className="text-gray-600">Track and manage all your shipments and dockets</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => window.location.href = '/shipments/track'}>
            <Search className="h-4 w-4 mr-2" />
            Track Shipment
          </Button>
          <Button onClick={() => window.location.href = '/shipments/create'}>
            <Plus className="h-4 w-4 mr-2" />
            Create Docket
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Shipments</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Transit</CardTitle>
            <Truck className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.inTransit}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Delivered</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.delivered}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₫{stats.totalRevenue.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
            <AlertCircle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.pendingPayments}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by docket number, contact person, or address..."
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <select
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="picked_up">Picked Up</option>
                <option value="in_transit">In Transit</option>
                <option value="out_for_delivery">Out for Delivery</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>

              <select
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
              >
                <option value="all">All Priority</option>
                <option value="urgent">Urgent</option>
                <option value="high">High</option>
                <option value="normal">Normal</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Shipments List */}
      <Card>
        <CardHeader>
          <CardTitle>Shipments ({filteredShipments.length})</CardTitle>
          <CardDescription>
            Manage and track all your shipments
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredShipments.length === 0 ? (
            <div className="text-center py-8">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">
                {searchTerm || statusFilter !== 'all' || priorityFilter !== 'all' 
                  ? 'No shipments match your filters.' 
                  : 'No shipments found. Create your first docket to get started.'
                }
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredShipments.map((shipment) => (
                <div key={shipment.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-semibold text-lg text-blue-600">
                          {shipment.docket_no}
                        </h3>
                        <span className={`px-2 py-1 text-xs rounded-full flex items-center ${getStatusColor(shipment.status)}`}>
                          {getStatusIcon(shipment.status)}
                          <span className="ml-1 capitalize">{shipment.status.replace('_', ' ')}</span>
                        </span>
                        <span className={`px-2 py-1 text-xs rounded-full capitalize ${getPriorityColor(shipment.priority)}`}>
                          {shipment.priority}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Contact Person</p>
                          <p className="font-medium">{shipment.package_contact_person || 'N/A'}</p>
                          <p className="text-gray-500">{shipment.package_contact_phone}</p>
                        </div>
                        
                        <div>
                          <p className="text-gray-600">Route</p>
                          <p className="font-medium">
                            {shipment.pickup_address?.substring(0, 30)}...
                          </p>
                          <p className="text-gray-500">
                            → {shipment.delivery_address?.substring(0, 30)}...
                          </p>
                        </div>
                        
                        <div>
                          <p className="text-gray-600">Transport</p>
                          <p className="font-medium">{shipment.transport_company || 'Not assigned'}</p>
                          <p className="text-gray-500">{shipment.transport_driver}</p>
                        </div>
                        
                        <div>
                          <p className="text-gray-600">Financial</p>
                          <p className="font-medium">₫{shipment.charge_total?.toLocaleString() || '0'}</p>
                          <p className={`text-sm ${
                            shipment.payment_status === 'paid' ? 'text-green-600' : 'text-orange-600'
                          }`}>
                            {shipment.payment_status === 'paid' ? 'Paid' : `Balance: ₫${shipment.charge_balance?.toLocaleString() || '0'}`}
                          </p>
                        </div>
                      </div>

                      {shipment.current_location && (
                        <div className="mt-2 flex items-center text-sm text-gray-600">
                          <MapPin className="h-4 w-4 mr-1" />
                          Current Location: {shipment.current_location}
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col space-y-2 ml-4">
                      <Button size="sm" variant="outline" onClick={() => window.location.href = `/shipments/${shipment.id}`}>
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => window.location.href = `/shipments/${shipment.id}/edit`}>
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t flex justify-between items-center text-sm text-gray-500">
                    <div>
                      Created: {formatDate(shipment.created_at)}
                      {shipment.pickup_date && (
                        <span className="ml-4">
                          Pickup: {formatDate(shipment.pickup_date)}
                        </span>
                      )}
                      {shipment.estimated_delivery && (
                        <span className="ml-4">
                          Est. Delivery: {formatDate(shipment.estimated_delivery)}
                        </span>
                      )}
                    </div>
                    
                    {shipment.package_weight && (
                      <div>
                        Weight: {shipment.package_weight} kg
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
