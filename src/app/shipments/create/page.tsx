'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase, isSupabaseConfigured } from '../../../../supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { ArrowLeft, Save, Calculator, MapPin, Package, User, Truck, DollarSign } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

interface Customer {
  id: string
  company_name: string
  contact_person: string
  email: string
  phone: string
  billing_address: string
}

interface Vehicle {
  id: string
  vehicle_id: string
  driver_id: string
  capacity: number
  status: string
}

export default function CreateDocketPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [customers, setCustomers] = useState<Customer[]>([])
  const [vehicles, setVehicles] = useState<Vehicle[]>([])

  // Form state
  const [formData, setFormData] = useState({
    // Package details
    package_contact_person: '',
    package_contact_phone: '',
    package_type: '',
    package_weight: '',
    package_dimensions: '',
    package_description: '',
    pickup_address: '',
    delivery_address: '',
    
    // Customer details
    sender_id: '',
    receiver_id: '',
    
    // Transport details
    transport_company: '',
    transport_driver: '',
    transport_driver_phone: '',
    transport_vehicle: '',
    vehicle_id: '',
    
    // Financial details
    charge_transportation: '',
    charge_handling: '',
    charge_insurance: '',
    charge_fuel: '',
    charge_tax_percent: '',
    
    // Dates and priority
    pickup_date: '',
    estimated_delivery: '',
    priority: 'normal',
    
    // Payment
    payment_type: 'cash',
    bill_to: '',
    
    // Additional info
    special_instructions: '',
    notes: '',
  })

  const [calculatedCharges, setCalculatedCharges] = useState({
    tax_amount: 0,
    total: 0,
  })

  useEffect(() => {
    if (isSupabaseConfigured()) {
      fetchData()
    } else {
      setCustomers([])
      setVehicles([])
    }
  }, [])

  useEffect(() => {
    calculateCharges()
  }, [
    formData.charge_transportation,
    formData.charge_handling,
    formData.charge_insurance,
    formData.charge_fuel,
    formData.charge_tax_percent,
  ])

  const fetchData = async () => {
    if (!isSupabaseConfigured()) {
      setCustomers([])
      setVehicles([])
      return
    }

    try {
      // Fetch customers
      const { data: customerData, error: customerError } = await supabase
        .from('customers')
        .select('*')
        .eq('status', 'active')

      if (customerError) throw customerError

      // Fetch available vehicles
      const { data: vehicleData, error: vehicleError } = await supabase
        .from('fleet')
        .select('*')
        .eq('status', 'available')

      if (vehicleError) throw vehicleError

      setCustomers(customerData || [])
      setVehicles(vehicleData || [])
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  const calculateCharges = () => {
    const transportation = parseFloat(formData.charge_transportation) || 0
    const handling = parseFloat(formData.charge_handling) || 0
    const insurance = parseFloat(formData.charge_insurance) || 0
    const fuel = parseFloat(formData.charge_fuel) || 0
    const taxPercent = parseFloat(formData.charge_tax_percent) || 0

    const subtotal = transportation + handling + insurance + fuel
    const taxAmount = (subtotal * taxPercent) / 100
    const total = subtotal + taxAmount

    setCalculatedCharges({
      tax_amount: taxAmount,
      total: total,
    })
  }

  const generateDocketNumber = () => {
    const date = new Date()
    const year = date.getFullYear().toString().slice(-2)
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const day = date.getDate().toString().padStart(2, '0')
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
    return `DOC${year}${month}${day}${random}`
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setLoading(true)

    try {
      const docketNo = generateDocketNumber()
      
      const shipmentData = {
        docket_no: docketNo,
        sender_id: formData.sender_id || null,
        receiver_id: formData.receiver_id || null,
        
        // Package details
        package_contact_person: formData.package_contact_person,
        package_contact_phone: formData.package_contact_phone,
        package_type: formData.package_type,
        package_weight: parseFloat(formData.package_weight) || null,
        package_dimensions: formData.package_dimensions,
        package_description: formData.package_description,
        pickup_address: formData.pickup_address,
        delivery_address: formData.delivery_address,
        
        // Transport details
        transport_company: formData.transport_company,
        transport_driver: formData.transport_driver,
        transport_driver_phone: formData.transport_driver_phone,
        transport_vehicle: formData.transport_vehicle,
        vehicle_id: formData.vehicle_id || null,
        
        // Financial details
        charge_transportation: parseFloat(formData.charge_transportation) || 0,
        charge_handling: parseFloat(formData.charge_handling) || 0,
        charge_insurance: parseFloat(formData.charge_insurance) || 0,
        charge_fuel: parseFloat(formData.charge_fuel) || 0,
        charge_tax_percent: parseFloat(formData.charge_tax_percent) || 0,
        charge_tax_amount: calculatedCharges.tax_amount,
        charge_total: calculatedCharges.total,
        charge_balance: calculatedCharges.total, // Initially, balance equals total
        
        // Dates and status
        pickup_date: formData.pickup_date || null,
        estimated_delivery: formData.estimated_delivery || null,
        priority: formData.priority,
        status: 'pending',
        
        // Payment
        payment_type: formData.payment_type,
        payment_status: 'pending',
        bill_to: formData.bill_to,
        
        // Additional info
        special_instructions: formData.special_instructions,
        notes: formData.notes,
      }

      const { data, error } = await supabase
        .from('shipments')
        .insert([shipmentData])
        .select()
        .single()

      if (error) throw error

      // Create initial status history entry
      await supabase
        .from('shipment_status_history')
        .insert([{
          shipment_id: data.id,
          status: 'pending',
          notes: 'Docket created',
          updated_by: user.email,
        }])

      // Show success message and redirect
      alert(`Docket ${docketNo} created successfully!`)
      router.push(`/shipments/${data.id}`)
      
    } catch (error) {
      console.error('Error creating docket:', error)
      alert('Error creating docket. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Create New Docket</h1>
            <p className="text-gray-600">Create a new shipment docket with all details</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Package Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Package className="h-5 w-5 mr-2" />
              Package Information
            </CardTitle>
            <CardDescription>
              Details about the package to be shipped
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Contact Person *"
                value={formData.package_contact_person}
                onChange={(e) => handleInputChange('package_contact_person', e.target.value)}
                required
                placeholder="Enter contact person name"
              />
              <Input
                label="Contact Phone *"
                value={formData.package_contact_phone}
                onChange={(e) => handleInputChange('package_contact_phone', e.target.value)}
                required
                placeholder="Enter phone number"
              />
              <Input
                label="Package Type"
                value={formData.package_type}
                onChange={(e) => handleInputChange('package_type', e.target.value)}
                placeholder="e.g., Electronics, Furniture, Documents"
              />
              <Input
                label="Weight (kg)"
                type="number"
                step="0.01"
                value={formData.package_weight}
                onChange={(e) => handleInputChange('package_weight', e.target.value)}
                placeholder="Enter weight in kg"
              />
              <Input
                label="Dimensions"
                value={formData.package_dimensions}
                onChange={(e) => handleInputChange('package_dimensions', e.target.value)}
                placeholder="e.g., 100x50x30 cm"
              />
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Priority</label>
                <select
                  className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.priority}
                  onChange={(e) => handleInputChange('priority', e.target.value)}
                >
                  <option value="low">Low</option>
                  <option value="normal">Normal</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Package Description</label>
              <textarea
                className="mt-1 flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                value={formData.package_description}
                onChange={(e) => handleInputChange('package_description', e.target.value)}
                placeholder="Detailed description of the package contents"
              />
            </div>
          </CardContent>
        </Card>

        {/* Pickup & Delivery Addresses */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MapPin className="h-5 w-5 mr-2" />
              Pickup & Delivery Addresses
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Pickup Address *</label>
              <textarea
                className="mt-1 flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                value={formData.pickup_address}
                onChange={(e) => handleInputChange('pickup_address', e.target.value)}
                required
                placeholder="Enter complete pickup address"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Delivery Address *</label>
              <textarea
                className="mt-1 flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                value={formData.delivery_address}
                onChange={(e) => handleInputChange('delivery_address', e.target.value)}
                required
                placeholder="Enter complete delivery address"
              />
            </div>
          </CardContent>
        </Card>

        {/* Customer Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="h-5 w-5 mr-2" />
              Customer Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Sender</label>
                <select
                  className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.sender_id}
                  onChange={(e) => handleInputChange('sender_id', e.target.value)}
                >
                  <option value="">Select Sender</option>
                  {customers.map((customer) => (
                    <option key={customer.id} value={customer.id}>
                      {customer.company_name} - {customer.contact_person}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Receiver</label>
                <select
                  className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.receiver_id}
                  onChange={(e) => handleInputChange('receiver_id', e.target.value)}
                >
                  <option value="">Select Receiver</option>
                  {customers.map((customer) => (
                    <option key={customer.id} value={customer.id}>
                      {customer.company_name} - {customer.contact_person}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Transport Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Truck className="h-5 w-5 mr-2" />
              Transport Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Transport Company"
                value={formData.transport_company}
                onChange={(e) => handleInputChange('transport_company', e.target.value)}
                placeholder="Enter transport company name"
              />
              <Input
                label="Driver Name"
                value={formData.transport_driver}
                onChange={(e) => handleInputChange('transport_driver', e.target.value)}
                placeholder="Enter driver name"
              />
              <Input
                label="Driver Phone"
                value={formData.transport_driver_phone}
                onChange={(e) => handleInputChange('transport_driver_phone', e.target.value)}
                placeholder="Enter driver phone number"
              />
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Assign Vehicle</label>
                <select
                  className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.vehicle_id}
                  onChange={(e) => handleInputChange('vehicle_id', e.target.value)}
                >
                  <option value="">Select Vehicle</option>
                  {vehicles.map((vehicle) => (
                    <option key={vehicle.id} value={vehicle.id}>
                      {vehicle.vehicle_id} - Capacity: {vehicle.capacity}kg
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Financial Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <DollarSign className="h-5 w-5 mr-2" />
              Financial Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Transportation Charge"
                type="number"
                step="0.01"
                value={formData.charge_transportation}
                onChange={(e) => handleInputChange('charge_transportation', e.target.value)}
                placeholder="0.00"
              />
              <Input
                label="Handling Charge"
                type="number"
                step="0.01"
                value={formData.charge_handling}
                onChange={(e) => handleInputChange('charge_handling', e.target.value)}
                placeholder="0.00"
              />
              <Input
                label="Insurance Charge"
                type="number"
                step="0.01"
                value={formData.charge_insurance}
                onChange={(e) => handleInputChange('charge_insurance', e.target.value)}
                placeholder="0.00"
              />
              <Input
                label="Fuel Surcharge"
                type="number"
                step="0.01"
                value={formData.charge_fuel}
                onChange={(e) => handleInputChange('charge_fuel', e.target.value)}
                placeholder="0.00"
              />
              <Input
                label="Tax Percentage (%)"
                type="number"
                step="0.01"
                value={formData.charge_tax_percent}
                onChange={(e) => handleInputChange('charge_tax_percent', e.target.value)}
                placeholder="0.00"
              />
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Payment Type</label>
                <select
                  className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.payment_type}
                  onChange={(e) => handleInputChange('payment_type', e.target.value)}
                >
                  <option value="cash">Cash</option>
                  <option value="credit">Credit</option>
                  <option value="online">Online</option>
                  <option value="cheque">Cheque</option>
                </select>
              </div>
            </div>

            {/* Calculated Totals */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                <Calculator className="h-4 w-4 mr-2" />
                Calculated Charges
              </h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Tax Amount:</span>
                  <span className="float-right font-medium">₫{calculatedCharges.tax_amount.toLocaleString()}</span>
                </div>
                <div className="border-t pt-2">
                  <span className="text-gray-900 font-medium">Total Amount:</span>
                  <span className="float-right font-bold text-lg">₫{calculatedCharges.total.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Dates and Additional Information */}
        <Card>
          <CardHeader>
            <CardTitle>Dates & Additional Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Pickup Date"
                type="date"
                value={formData.pickup_date}
                onChange={(e) => handleInputChange('pickup_date', e.target.value)}
              />
              <Input
                label="Estimated Delivery Date"
                type="date"
                value={formData.estimated_delivery}
                onChange={(e) => handleInputChange('estimated_delivery', e.target.value)}
              />
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-700">Special Instructions</label>
              <textarea
                className="mt-1 flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                value={formData.special_instructions}
                onChange={(e) => handleInputChange('special_instructions', e.target.value)}
                placeholder="Any special handling instructions or requirements"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-700">Notes</label>
              <textarea
                className="mt-1 flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                placeholder="Internal notes and comments"
              />
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" loading={loading}>
            <Save className="h-4 w-4 mr-2" />
            Create Docket
          </Button>
        </div>
      </form>
    </div>
  )
}
