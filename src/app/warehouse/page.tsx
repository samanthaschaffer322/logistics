'use client'

import React, { useEffect, useState } from 'react'
import { supabase } from '../../../supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { Package, Plus, AlertTriangle, Search, Edit, Trash2 } from 'lucide-react'
import { generateSKU, calculateReorderSuggestion } from '@/lib/utils'

interface InventoryItem {
  id: string
  item_name: string
  sku: string
  quantity: number
  reorder_level: number
  warehouse_id: string
  updated_at: string
}

interface Warehouse {
  id: string
  name: string
  location: string
}

export default function WarehousePage() {
  const [inventory, setInventory] = useState<InventoryItem[]>([])
  const [warehouses, setWarehouses] = useState<Warehouse[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null)

  // Form state
  const [formData, setFormData] = useState({
    item_name: '',
    quantity: '',
    reorder_level: '',
    warehouse_id: '',
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      // Fetch inventory
      const { data: inventoryData, error: inventoryError } = await supabase
        .from('inventory')
        .select('*')
        .order('updated_at', { ascending: false })

      if (inventoryError) throw inventoryError

      // Fetch warehouses
      const { data: warehouseData, error: warehouseError } = await supabase
        .from('warehouse')
        .select('*')

      if (warehouseError) throw warehouseError

      setInventory(inventoryData || [])
      setWarehouses(warehouseData || [])
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const itemData = {
        item_name: formData.item_name,
        sku: editingItem ? editingItem.sku : generateSKU(formData.item_name),
        quantity: parseInt(formData.quantity),
        reorder_level: parseInt(formData.reorder_level),
        warehouse_id: formData.warehouse_id,
      }

      if (editingItem) {
        // Update existing item
        const { error } = await supabase
          .from('inventory')
          .update(itemData)
          .eq('id', editingItem.id)

        if (error) throw error
      } else {
        // Add new item
        const { error } = await supabase
          .from('inventory')
          .insert([itemData])

        if (error) throw error
      }

      // Reset form and refresh data
      setFormData({ item_name: '', quantity: '', reorder_level: '', warehouse_id: '' })
      setShowAddForm(false)
      setEditingItem(null)
      fetchData()
    } catch (error) {
      console.error('Error saving item:', error)
    }
  }

  const handleEdit = (item: InventoryItem) => {
    setEditingItem(item)
    setFormData({
      item_name: item.item_name,
      quantity: item.quantity.toString(),
      reorder_level: item.reorder_level.toString(),
      warehouse_id: item.warehouse_id,
    })
    setShowAddForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return

    try {
      const { error } = await supabase
        .from('inventory')
        .delete()
        .eq('id', id)

      if (error) throw error
      fetchData()
    } catch (error) {
      console.error('Error deleting item:', error)
    }
  }

  const filteredInventory = inventory.filter(item =>
    item.item_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.sku.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const lowStockItems = inventory.filter(item => item.quantity <= item.reorder_level)

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
          <h1 className="text-2xl font-bold text-gray-900">Warehouse Management</h1>
          <p className="text-gray-600">Manage inventory and track stock levels</p>
        </div>
        <Button onClick={() => setShowAddForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Item
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inventory.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Stock</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {inventory.reduce((sum, item) => sum + item.quantity, 0).toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{lowStockItems.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Low Stock Alerts */}
      {lowStockItems.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-orange-500 mr-2" />
              Low Stock Alerts
            </CardTitle>
            <CardDescription>
              Items that need immediate attention
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {lowStockItems.map((item) => {
                const suggestion = calculateReorderSuggestion(item.quantity, item.reorder_level)
                return (
                  <div key={item.id} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                    <div>
                      <p className="font-medium text-orange-800">{item.item_name}</p>
                      <p className="text-sm text-orange-700">
                        Current: {item.quantity} | Reorder Level: {item.reorder_level}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-orange-800">
                        Suggested: {suggestion.suggestedQuantity}
                      </p>
                      <p className="text-xs text-orange-600 capitalize">
                        {suggestion.urgency} priority
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Add/Edit Form */}
      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingItem ? 'Edit Item' : 'Add New Item'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Item Name"
                  value={formData.item_name}
                  onChange={(e) => setFormData({ ...formData, item_name: e.target.value })}
                  required
                />
                <Input
                  label="Quantity"
                  type="number"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  required
                />
                <Input
                  label="Reorder Level"
                  type="number"
                  value={formData.reorder_level}
                  onChange={(e) => setFormData({ ...formData, reorder_level: e.target.value })}
                  required
                />
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Warehouse</label>
                  <select
                    className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.warehouse_id}
                    onChange={(e) => setFormData({ ...formData, warehouse_id: e.target.value })}
                    required
                  >
                    <option value="">Select Warehouse</option>
                    {warehouses.map((warehouse) => (
                      <option key={warehouse.id} value={warehouse.id}>
                        {warehouse.name} - {warehouse.location}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button type="submit">
                  {editingItem ? 'Update Item' : 'Add Item'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowAddForm(false)
                    setEditingItem(null)
                    setFormData({ item_name: '', quantity: '', reorder_level: '', warehouse_id: '' })
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Inventory List */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Inventory Items</CardTitle>
              <CardDescription>Manage your stock levels</CardDescription>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search items..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Item Name</th>
                  <th className="text-left py-2">SKU</th>
                  <th className="text-left py-2">Quantity</th>
                  <th className="text-left py-2">Reorder Level</th>
                  <th className="text-left py-2">Status</th>
                  <th className="text-left py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredInventory.map((item) => (
                  <tr key={item.id} className="border-b">
                    <td className="py-2 font-medium">{item.item_name}</td>
                    <td className="py-2 text-gray-600">{item.sku}</td>
                    <td className="py-2">{item.quantity}</td>
                    <td className="py-2">{item.reorder_level}</td>
                    <td className="py-2">
                      {item.quantity <= item.reorder_level ? (
                        <span className="px-2 py-1 text-xs bg-orange-100 text-orange-800 rounded-full">
                          Low Stock
                        </span>
                      ) : (
                        <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                          In Stock
                        </span>
                      )}
                    </td>
                    <td className="py-2">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(item)}
                          className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
