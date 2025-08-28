'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { CheckCircle, Plus, Mail } from 'lucide-react'

interface Payment {
  id: string
  name: string
  company: string
  amount: number
  dueDate: string
  status: 'pending' | 'paid' | 'overdue'
}

const SimplePaymentTracker = () => {
  // Load from localStorage or use your companies
  const [payments, setPayments] = useState<Payment[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('simplePaymentTracker')
      if (saved) {
        console.log('📂 Loaded saved payments')
        return JSON.parse(saved)
      }
    }
    
    // Your companies as default
    return [
      { id: '1', name: 'Nguyen Van Long', company: 'Long Transport & Logistics Co., Ltd', amount: 45000000, dueDate: '2025-08-28', status: 'overdue' as const },
      { id: '2', name: 'Ngo Minh Gia', company: 'Gia Logistics & Freight Services', amount: 28500000, dueDate: '2025-08-15', status: 'overdue' as const },
      { id: '3', name: 'AO Shipping Vietnam', company: 'AO International Shipping Co., Ltd', amount: 67200000, dueDate: '2025-08-30', status: 'pending' as const },
      { id: '4', name: 'Bao Giao Express', company: 'Bao Giao Express Delivery Services', amount: 52800000, dueDate: '2025-08-27', status: 'overdue' as const },
      { id: '5', name: 'CN', company: 'CN', amount: 90000000, dueDate: '2025-09-20', status: 'pending' as const },
      { id: '6', name: 'Khang Phat', company: 'KP', amount: 82000000, dueDate: '2025-09-20', status: 'pending' as const },
      { id: '7', name: 'DQM', company: 'DQM', amount: 78000000, dueDate: '2025-09-22', status: 'pending' as const }
    ]
  })

  const [newPayment, setNewPayment] = useState({ name: '', company: '', amount: '', dueDate: '' })
  const [showAddForm, setShowAddForm] = useState(false)

  // Save to localStorage whenever payments change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('simplePaymentTracker', JSON.stringify(payments))
      console.log('💾 Saved', payments.length, 'payments to localStorage')
    }
  }, [payments])

  const addPayment = () => {
    if (newPayment.name && newPayment.company && newPayment.amount && newPayment.dueDate) {
      const payment: Payment = {
        id: Date.now().toString(),
        name: newPayment.name,
        company: newPayment.company,
        amount: parseInt(newPayment.amount),
        dueDate: newPayment.dueDate,
        status: 'pending'
      }
      
      setPayments(prev => [...prev, payment])
      setNewPayment({ name: '', company: '', amount: '', dueDate: '' })
      setShowAddForm(false)
      alert(`✅ Added: ${payment.name} - ${payment.amount.toLocaleString()} VND`)
    }
  }

  const markPaid = (id: string) => {
    setPayments(prev => prev.map(p => 
      p.id === id ? { ...p, status: 'paid' as const } : p
    ))
    alert('✅ Marked as paid!')
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN').format(amount) + ' ₫'
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800'
      case 'overdue': return 'bg-red-100 text-red-800'
      default: return 'bg-yellow-100 text-yellow-800'
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>💰 Trợ lý Theo dõi Thanh toán</span>
            <Button onClick={() => setShowAddForm(!showAddForm)} className="bg-blue-600">
              <Plus className="h-4 w-4 mr-2" />
              Add New
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {showAddForm && (
            <div className="mb-6 p-4 border rounded-lg bg-gray-50">
              <div className="grid grid-cols-2 gap-4">
                <Input
                  placeholder="Customer Name"
                  value={newPayment.name}
                  onChange={(e) => setNewPayment(prev => ({ ...prev, name: e.target.value }))}
                />
                <Input
                  placeholder="Company Name"
                  value={newPayment.company}
                  onChange={(e) => setNewPayment(prev => ({ ...prev, company: e.target.value }))}
                />
                <Input
                  placeholder="Amount (VND)"
                  type="number"
                  value={newPayment.amount}
                  onChange={(e) => setNewPayment(prev => ({ ...prev, amount: e.target.value }))}
                />
                <Input
                  placeholder="Due Date"
                  type="date"
                  value={newPayment.dueDate}
                  onChange={(e) => setNewPayment(prev => ({ ...prev, dueDate: e.target.value }))}
                />
              </div>
              <div className="flex gap-2 mt-4">
                <Button onClick={addPayment} className="bg-green-600">Add Payment</Button>
                <Button onClick={() => setShowAddForm(false)} variant="outline">Cancel</Button>
              </div>
            </div>
          )}

          <div className="space-y-4">
            {payments.map((payment) => (
              <div key={payment.id} className="border rounded-lg p-4 flex items-center justify-between">
                <div className="flex-1">
                  <div className="font-semibold">{payment.name}</div>
                  <div className="text-sm text-gray-600">{payment.company}</div>
                  <div className="text-lg font-bold text-blue-600">{formatCurrency(payment.amount)}</div>
                  <div className="text-sm">Due: {payment.dueDate}</div>
                </div>
                
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(payment.status)}`}>
                    {payment.status === 'paid' ? 'Paid' : payment.status === 'overdue' ? 'Overdue' : 'Pending'}
                  </span>
                  
                  {payment.status !== 'paid' && (
                    <Button
                      onClick={() => markPaid(payment.id)}
                      className="bg-green-600 hover:bg-green-700"
                      size="sm"
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      ✅ Mark Paid
                    </Button>
                  )}
                  
                  <Button variant="outline" size="sm">
                    <Mail className="h-4 w-4 mr-1" />
                    📧 Email
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <div className="text-sm text-blue-800">
              📊 Total: {payments.length} companies | 
              Paid: {payments.filter(p => p.status === 'paid').length} | 
              Pending: {payments.filter(p => p.status === 'pending').length} | 
              Overdue: {payments.filter(p => p.status === 'overdue').length}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default SimplePaymentTracker
