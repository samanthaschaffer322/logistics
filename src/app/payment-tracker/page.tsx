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

export default function PaymentTrackerPage() {
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
    const saved = localStorage.getItem('paymentTrackerData')
    if (saved) {
      setPayments(JSON.parse(saved))
    } else {
      // Your exact updated list
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
      localStorage.setItem('paymentTrackerData', JSON.stringify(defaultPayments))
    }
  }, [])

  // Save to localStorage whenever payments change
  useEffect(() => {
    if (payments.length > 0) {
      localStorage.setItem('paymentTrackerData', JSON.stringify(payments))
      console.log('💾 Saved payments:', payments.length)
    }
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
      alert(`✅ Đã thêm: ${payment.name}`)
    }
  }

  const markPaid = (id: string) => {
    const payment = payments.find(p => p.id === id)
    if (payment) {
      setPayments(prev => prev.map(p => 
        p.id === id ? { ...p, status: 'paid' as const } : p
      ))
      alert(`✅ Đã đánh dấu ${payment.name} đã thanh toán!\nCông ty sẽ biến mất khỏi danh sách.`)
    }
  }

  const sendEmail = (payment: Payment) => {
    alert(`📧 Email đã gửi đến andatecampion@proton.me!\n\nKhách hàng: ${payment.name}\nCông ty: ${payment.company}\nSố tiền: ${payment.amount.toLocaleString()} ₫\nTrạng thái: ${payment.status === 'overdue' ? 'Quá hạn' : 'Chờ thanh toán'}`)
  }

  const sendFollowUp = (payment: Payment) => {
    alert(`📧 Email nhắc nhở đã gửi đến andatecampion@proton.me!\n\nNhắc nhở thanh toán cho: ${payment.name}\nSố tiền: ${payment.amount.toLocaleString()} ₫\nQuá hạn từ: ${payment.dueDate}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-800">💰 Danh sách Thanh toán (Mới)</h1>
            <button 
              onClick={() => setShowAddForm(!showAddForm)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Thêm mới
            </button>
          </div>

          {showAddForm && (
            <div className="mb-6 p-4 border rounded-lg bg-gray-50">
              <h3 className="font-semibold mb-3">Thêm công ty mới</h3>
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
                  placeholder="Ngày tạo (dd/mm/yyyy)"
                  value={newPayment.createdDate}
                  onChange={(e) => setNewPayment(prev => ({ ...prev, createdDate: e.target.value }))}
                  className="border rounded px-3 py-2"
                />
                <input
                  placeholder="Hạn thanh toán (dd/mm/yyyy)"
                  value={newPayment.dueDate}
                  onChange={(e) => setNewPayment(prev => ({ ...prev, dueDate: e.target.value }))}
                  className="border rounded px-3 py-2"
                />
              </div>
              <div className="flex gap-2 mt-4">
                <button onClick={addPayment} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                  Thêm
                </button>
                <button onClick={() => setShowAddForm(false)} className="border px-4 py-2 rounded hover:bg-gray-100">
                  Hủy
                </button>
              </div>
            </div>
          )}
          
          <div className="space-y-4">
            {unpaidPayments.map((payment) => (
              <div key={payment.id} className="border rounded-lg p-4 flex items-center justify-between hover:bg-gray-50">
                <div className="flex-1">
                  <div className="font-semibold text-lg">{payment.name}</div>
                  <div className="text-sm text-gray-600">{payment.company}</div>
                  <div className="text-xl font-bold text-blue-600">{payment.amount.toLocaleString()} ₫</div>
                  <div className="text-xs text-gray-500">Ngày tạo: {payment.createdDate}</div>
                  <div className="text-xs text-gray-500">Hạn thanh toán: {payment.dueDate}</div>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    payment.status === 'overdue' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {payment.status === 'overdue' ? 'Quá hạn' : 'Chờ thanh toán'}
                  </span>
                  
                  <button
                    onClick={() => markPaid(payment.id)}
                    className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 font-medium"
                  >
                    ✅ Đã trả
                  </button>
                  
                  <button 
                    onClick={() => sendEmail(payment)}
                    className="border border-blue-300 px-3 py-1 rounded text-sm hover:bg-blue-50 text-blue-600"
                  >
                    📧 Email
                  </button>
                  
                  <button 
                    onClick={() => sendFollowUp(payment)}
                    className="border border-orange-300 px-3 py-1 rounded text-sm hover:bg-orange-50 text-orange-600"
                  >
                    📧 Gửi theo dõi
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <div className="text-sm text-blue-800">
              📊 Hiển thị: {unpaidPayments.length} công ty chưa thanh toán | 
              Đã thanh toán (ẩn): {payments.filter(p => p.status === 'paid').length} | 
              Tổng cộng: {payments.length}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
