'use client'

import React, { useEffect, useState } from 'react'
import { supabase } from '../../../supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui-components'
import { Button } from '@/components/ui-components'
import { Input } from '@/components/ui-components'
import { Truck, Plus, MapPin, User, AlertCircle } from 'lucide-react'

interface Vehicle {
  id: string
  vehicle_id: string
  driver_id: string
  capacity: number
  status: 'available' | 'in_transit' | 'maintenance'
  current_location: string
}

interface Driver {
  id: string
  email: string
}

export default function TransportationPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [drivers, setDrivers] = useState<Driver[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null)

  // Form state
  const [formData, setFormData] = useState({
    vehicle_id: '',
    driver_id: '',
    capacity: '',
    status: 'available' as Vehicle['status'],
    current_location: '',
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      // Fetch vehicles
      const { data: vehicleData, error: vehicleError } = await supabase
        .from('fleet')
        .select('*')
        .order('vehicle_id')

      if (vehicleError) throw vehicleError

      // Fetch drivers (users with transport role)
      const { data: driverData, error: driverError } = await supabase
        .from('users')
        .select('id, email')
        .eq('role', 'transport')

      if (driverError) throw driverError

      setVehicles(vehicleData || [])
      setDrivers(driverData || [])
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const vehicleData = {
        vehicle_id: formData.vehicle_id,
        driver_id: formData.driver_id || null,
        capacity: parseInt(formData.capacity),
        status: formData.status,
        current_location: formData.current_location,
      }

      if (editingVehicle) {
        // Update existing vehicle
        const { error } = await supabase
          .from('fleet')
          .update(vehicleData)
          .eq('id', editingVehicle.id)

        if (error) throw error
      } else {
        // Add new vehicle
        const { error } = await supabase
          .from('fleet')
          .insert([vehicleData])

        if (error) throw error
      }

      // Reset form and refresh data
      setFormData({
        vehicle_id: '',
        driver_id: '',
        capacity: '',
        status: 'available',
        current_location: '',
      })
      setShowAddForm(false)
      setEditingVehicle(null)
      fetchData()
    } catch (error) {
      console.error('Error saving vehicle:', error)
    }
  }

  const handleEdit = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle)
    setFormData({
      vehicle_id: vehicle.vehicle_id,
      driver_id: vehicle.driver_id || '',
      capacity: vehicle.capacity.toString(),
      status: vehicle.status,
      current_location: vehicle.current_location || '',
    })
    setShowAddForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this vehicle?')) return

    try {
      const { error } = await supabase
        .from('fleet')
        .delete()
        .eq('id', id)

      if (error) throw error
      fetchData()
    } catch (error) {
      console.error('Error deleting vehicle:', error)
    }
  }

  const getStatusColor = (status: Vehicle['status']) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800'
      case 'in_transit':
        return 'bg-blue-100 text-blue-800'
      case 'maintenance':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getDriverEmail = (driverId: string) => {
    const driver = drivers.find(d => d.id === driverId)
    return driver?.email || 'Unassigned'
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
          <h1 className="text-2xl font-bold text-gray-900">Transportation Management</h1>
          <p className="text-gray-600">Manage your fleet and track vehicle status</p>
        </div>
        <Button onClick={() => setShowAddForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Vehicle
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Vehicles</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{vehicles.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available</CardTitle>
            <Truck className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {vehicles.filter(v => v.status === 'available').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Transit</CardTitle>
            <Truck className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {vehicles.filter(v => v.status === 'in_transit').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Maintenance</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {vehicles.filter(v => v.status === 'maintenance').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingVehicle ? 'Edit Vehicle' : 'Add New Vehicle'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Vehicle ID"
                  value={formData.vehicle_id}
                  onChange={(e) => setFormData({ ...formData, vehicle_id: e.target.value })}
                  placeholder="e.g., TRK-001"
                  required
                />
                
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Driver</label>
                  <select
                    className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.driver_id}
                    onChange={(e) => setFormData({ ...formData, driver_id: e.target.value })}
                  >
                    <option value="">Select Driver</option>
                    {drivers.map((driver) => (
                      <option key={driver.id} value={driver.id}>
                        {driver.email}
                      </option>
                    ))}
                  </select>
                </div>

                <Input
                  label="Capacity (kg)"
                  type="number"
                  value={formData.capacity}
                  onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                  required
                />

                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Status</label>
                  <select
                    className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as Vehicle['status'] })}
                  >
                    <option value="available">Available</option>
                    <option value="in_transit">In Transit</option>
                    <option value="maintenance">Maintenance</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <Input
                    label="Current Location"
                    value={formData.current_location}
                    onChange={(e) => setFormData({ ...formData, current_location: e.target.value })}
                    placeholder="e.g., Warehouse A, Ho Chi Minh City"
                  />
                </div>
              </div>
              
              <div className="flex space-x-2">
                <Button type="submit">
                  {editingVehicle ? 'Update Vehicle' : 'Add Vehicle'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowAddForm(false)
                    setEditingVehicle(null)
                    setFormData({
                      vehicle_id: '',
                      driver_id: '',
                      capacity: '',
                      status: 'available',
                      current_location: '',
                    })
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Vehicle List */}
      <Card>
        <CardHeader>
          <CardTitle>Fleet Overview</CardTitle>
          <CardDescription>Manage your vehicles and track their status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {vehicles.map((vehicle) => (
              <Card key={vehicle.id} className="border-l-4 border-l-blue-500">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-lg">{vehicle.vehicle_id}</h3>
                      <p className="text-sm text-gray-600">Capacity: {vehicle.capacity} kg</p>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(vehicle.status)}`}>
                      {vehicle.status.replace('_', ' ')}
                    </span>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <User className="h-4 w-4 mr-2" />
                      {getDriverEmail(vehicle.driver_id)}
                    </div>
                    
                    {vehicle.current_location && (
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="h-4 w-4 mr-2" />
                        {vehicle.current_location}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(vehicle)}
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => handleDelete(vehicle.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {vehicles.length === 0 && (
            <div className="text-center py-8">
              <Truck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No vehicles found. Add your first vehicle to get started.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
