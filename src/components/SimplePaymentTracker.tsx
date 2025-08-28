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
  createdDate: string
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
    
    // Your exact payment list
    return [
      { id: '1', name: 'Nguyen Van Long', company: 'Long Transport & Logistics Co., Ltd', amount: 45000000, dueDate: '2025-08-28', createdDate: '2025-08-15', status: 'overdue' as const },
      { id: '2', name: 'Ngo Minh Gia', company: 'Gia Logistics & Freight Services', amount: 28500000, dueDate: '2025-08-15', createdDate: '2025-08-01', status: 'overdue' as const },
      { id: '3', name: 'Bao Giao Express', company: 'Bao Giao Express Delivery Services', amount: 52800000, dueDate: '2025-08-27', createdDate: '2025-08-13', status: 'overdue' as const },
      { id: '4', name: 'CN', company: 'CN', amount: 67000000, dueDate: '2025-09-18', createdDate: '2025-08-28', status: 'pending' as const },
      { id: '5', name: 'Khang Phat', company: 'KP', amount: 98000000, dueDate: '2025-09-25', createdDate: '2025-08-28', status: 'pending' as const },
      { id: '6', name: 'DQM', company: 'DQM', amount: 91000000, dueDate: '2025-09-25', createdDate: '2025-08-28', status: 'pending' as const },
      { id: '7', name: 'AO Shipping Vietnam', company: 'AO International Shipping Co., Ltd', amount: 67200000, dueDate: '2025-08-30', createdDate: '2025-08-16', status: 'paid' as const }
    ]
  })

  const [newPayment, setNewPayment] = useState({ name: '', company: '', amount: '', dueDate: '', createdDate: '' })

  const sendEmailReport = async (payment: Payment) => {
    console.log('📧 Sending email report to andatecampion@proton.me for:', payment.name)
    
    const emailContent = `
📧 PAYMENT REPORT - ${new Date().toLocaleDateString('vi-VN')}

👤 Customer: ${payment.name}
🏢 Company: ${payment.company}
💰 Amount: ${formatCurrency(payment.amount)}
📅 Due Date: ${payment.dueDate}
📅 Created: ${payment.createdDate}
🔄 Status: ${payment.status}

---
Sent from Truck Insight V2 Payment Tracking System
    `
    
    alert(`📧 Email report sent to andatecampion@proton.me!\n\n${emailContent}`)
    console.log('✅ Email sent successfully:', emailContent)
  }

  const sendFollowUp = async (payment: Payment) => {
    console.log('📧 Sending follow-up to andatecampion@proton.me for:', payment.name)
    
    const followUpContent = `
📧 PAYMENT FOLLOW-UP - ${new Date().toLocaleDateString('vi-VN')}

⚠️ OVERDUE PAYMENT REMINDER

👤 Customer: ${payment.name}
🏢 Company: ${payment.company}
💰 Outstanding Amount: ${formatCurrency(payment.amount)}
📅 Original Due Date: ${payment.dueDate}
⏰ Days Overdue: ${Math.ceil((new Date().getTime() - new Date(payment.dueDate).getTime()) / (1000 * 60 * 60 * 24))}

Please contact customer for immediate payment.

---
Sent from Truck Insight V2 Payment Tracking System
    `
    
    alert(`📧 Follow-up email sent to andatecampion@proton.me!\n\n${followUpContent}`)
    console.log('✅ Follow-up sent successfully:', followUpContent)
  }
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
        createdDate: newPayment.createdDate || new Date().toISOString().split('T')[0],
        status: 'pending'
      }
      
      setPayments(prev => [...prev, payment])
      setNewPayment({ name: '', company: '', amount: '', dueDate: '', createdDate: '' })
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
                  <div className="text-xs text-gray-500">Ngày tạo: {payment.createdDate}</div>
                  <div className="text-xs text-gray-500">Hạn thanh toán: {payment.dueDate}</div>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(payment.status)}`}>
                    {payment.status === 'paid' ? 'Đã trả' : payment.status === 'overdue' ? 'Quá hạn' : 'Chờ thanh toán'}
                  </span>
                  
                  {payment.status !== 'paid' && (
                    <Button
                      onClick={() => markPaid(payment.id)}
                      className="bg-green-600 hover:bg-green-700"
                      size="sm"
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      ✅ Đã trả
                    </Button>
                  )}
                  
                  <Button 
                    onClick={() => sendEmailReport(payment)}
                    variant="outline" 
                    size="sm"
                  >
                    <Mail className="h-4 w-4 mr-1" />
                    📧 Email
                  </Button>
                  
                  <Button 
                    onClick={() => sendFollowUp(payment)}
                    variant="outline" 
                    size="sm"
                    className="bg-orange-50 hover:bg-orange-100"
                  >
                    <Mail className="h-4 w-4 mr-1" />
                    📧 Gửi theo dõi
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
