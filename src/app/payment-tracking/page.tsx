'use client'

import React, { useState, useEffect } from 'react'

interface Payment {
  id: string
  name: string
  company: string
  amount: number
  createdDate: string
  dueDate: string
  status: 'pending' | 'paid' | 'overdue'
}

export default function PaymentTrackingPage() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [newPayment, setNewPayment] = useState({
    name: '',
    company: '',
    amount: '',
    createdDate: '',
    dueDate: ''
  })

  // Load data on mount
  useEffect(() => {
    const saved = localStorage.getItem('paymentData')
    if (saved) {
      setPayments(JSON.parse(saved))
    } else {
      // Your exact list as default
      const defaultPayments: Payment[] = [
        {
          id: '1',
          name: 'Nguyen Van Long',
          company: 'Long Transport & Logistics Co., Ltd',
          amount: 45000000,
          createdDate: '15/8/2025',
          dueDate: '28/8/2025',
          status: 'overdue'
        },
        {
          id: '2',
          name: 'Ngo Minh Gia',
          company: 'Gia Logistics & Freight Services',
          amount: 28500000,
          createdDate: '1/8/2025',
          dueDate: '15/8/2025',
          status: 'overdue'
        },
        {
          id: '3',
          name: 'Bao Giao Express',
          company: 'Bao Giao Express Delivery Services',
          amount: 52800000,
          createdDate: '13/8/2025',
          dueDate: '27/8/2025',
          status: 'overdue'
        },
        {
          id: '4',
          name: 'CN',
          company: 'CN',
          amount: 91000000,
          createdDate: '28/8/2025',
          dueDate: '20/9/2025',
          status: 'pending'
        },
        {
          id: '5',
          name: 'Khang Phat',
          company: 'KP',
          amount: 87000000,
          createdDate: '28/8/2025',
          dueDate: '21/9/2025',
          status: 'pending'
        },
        {
          id: '6',
          name: 'DQM',
          company: 'DQM',
          amount: 99000000,
          createdDate: '28/8/2025',
          dueDate: '25/9/2025',
          status: 'pending'
        }
      ]
      setPayments(defaultPayments)
      localStorage.setItem('paymentData', JSON.stringify(defaultPayments))
    }
  }, [])

  // Save to localStorage whenever payments change
  useEffect(() => {
    localStorage.setItem('paymentData', JSON.stringify(payments))
  }, [payments])

  // Only show unpaid companies
  const unpaidPayments = payments.filter(p => p.status !== 'paid')

  const addPayment = () => {
    if (newPayment.name && newPayment.company && newPayment.amount) {
      const payment: Payment = {
        id: Date.now().toString(),
        name: newPayment.name,
        company: newPayment.company,
        amount: parseInt(newPayment.amount),
        createdDate: newPayment.createdDate || new Date().toLocaleDateString('vi-VN'),
        dueDate: newPayment.dueDate || new Date().toLocaleDateString('vi-VN'),
        status: 'pending'
      }
      
      setPayments(prev => [...prev, payment])
      setNewPayment({ name: '', company: '', amount: '', createdDate: '', dueDate: '' })
      setShowAddForm(false)
    }
  }

  const markPaid = (id: string) => {
    setPayments(prev => prev.map(p => 
      p.id === id ? { ...p, status: 'paid' as const } : p
    ))
  }

  const sendEmail = (payment: Payment) => {
    alert(`📧 Email sent to andatecampion@proton.me!\n\nCustomer: ${payment.name}\nCompany: ${payment.company}\nAmount: ${payment.amount.toLocaleString()} ₫\nStatus: ${payment.status}`)
  }

  const sendFollowUp = (payment: Payment) => {
    alert(`📧 Follow-up sent to andatecampion@proton.me!\n\nOverdue reminder for: ${payment.name}\nAmount: ${payment.amount.toLocaleString()} ₫`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-800">💰 Danh sách Thanh toán</h1>
            <button 
              onClick={() => setShowAddForm(!showAddForm)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Thêm mới
            </button>
          </div>

          {showAddForm && (
            <div className="mb-6 p-4 border rounded-lg bg-gray-50">
              <div className="grid grid-cols-2 gap-4">
                <input
                  placeholder="Tên khách hàng"
                  value={newPayment.name}
                  onChange={(e) => setNewPayment(prev => ({ ...prev, name: e.target.value }))}
                  className="border rounded px-3 py-2"
                />
                <input
                  placeholder="Tên công ty"
                  value={newPayment.company}
                  onChange={(e) => setNewPayment(prev => ({ ...prev, company: e.target.value }))}
                  className="border rounded px-3 py-2"
                />
                <input
                  placeholder="Số tiền (VND)"
                  type="number"
                  value={newPayment.amount}
                  onChange={(e) => setNewPayment(prev => ({ ...prev, amount: e.target.value }))}
                  className="border rounded px-3 py-2"
                />
                <input
                  placeholder="Ngày tạo"
                  value={newPayment.createdDate}
                  onChange={(e) => setNewPayment(prev => ({ ...prev, createdDate: e.target.value }))}
                  className="border rounded px-3 py-2"
                />
                <input
                  placeholder="Hạn thanh toán"
                  value={newPayment.dueDate}
                  onChange={(e) => setNewPayment(prev => ({ ...prev, dueDate: e.target.value }))}
                  className="border rounded px-3 py-2"
                />
              </div>
              <div className="flex gap-2 mt-4">
                <button onClick={addPayment} className="bg-green-600 text-white px-4 py-2 rounded">
                  Thêm
                </button>
                <button onClick={() => setShowAddForm(false)} className="border px-4 py-2 rounded">
                  Hủy
                </button>
              </div>
            </div>
          )}
          
          <div className="space-y-4">
            {unpaidPayments.map((payment) => (
              <div key={payment.id} className="border rounded-lg p-4 flex items-center justify-between">
                <div className="flex-1">
                  <div className="font-semibold">{payment.name}</div>
                  <div className="text-sm text-gray-600">{payment.company}</div>
                  <div className="text-lg font-bold text-blue-600">{payment.amount.toLocaleString()} ₫</div>
                  <div className="text-xs text-gray-500">Ngày tạo: {payment.createdDate}</div>
                  <div className="text-xs text-gray-500">Hạn thanh toán: {payment.dueDate}</div>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    payment.status === 'overdue' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {payment.status === 'overdue' ? 'Quá hạn' : 'Chờ thanh toán'}
                  </span>
                  
                  <button
                    onClick={() => markPaid(payment.id)}
                    className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                  >
                    ✅ Đã trả
                  </button>
                  
                  <button 
                    onClick={() => sendEmail(payment)}
                    className="border px-3 py-1 rounded text-sm hover:bg-gray-50"
                  >
                    📧 Email
                  </button>
                  
                  <button 
                    onClick={() => sendFollowUp(payment)}
                    className="border px-3 py-1 rounded text-sm hover:bg-orange-50"
                  >
                    📧 Gửi theo dõi
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <div className="text-sm text-blue-800">
              📊 Total: {unpaidPayments.length} companies | 
              Paid companies are hidden | 
              Total paid: {payments.filter(p => p.status === 'paid').length}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
