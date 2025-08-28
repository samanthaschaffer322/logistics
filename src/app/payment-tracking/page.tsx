'use client'

import { useState, useEffect } from 'react'

export default function PaymentTrackingPage() {
  const [payments, setPayments] = useState<any[]>([])
  const [showForm, setShowForm] = useState(false)
  const [newCompany, setNewCompany] = useState({ name: '', company: '', amount: '', created: '', due: '' })

  useEffect(() => {
    const saved = localStorage.getItem('newPaymentSystem')
    if (saved) {
      setPayments(JSON.parse(saved))
    } else {
      const initial = [
        { id: '1', name: 'Nguyen Van Long', company: 'Long Transport & Logistics Co., Ltd', amount: 45000000, created: '15/8/2025', due: '28/8/2025', status: 'overdue' },
        { id: '2', name: 'Ngo Minh Gia', company: 'Gia Logistics & Freight Services', amount: 28500000, created: '1/8/2025', due: '15/8/2025', status: 'overdue' },
        { id: '3', name: 'Bao Giao Express', company: 'Bao Giao Express Delivery Services', amount: 52800000, created: '13/8/2025', due: '27/8/2025', status: 'overdue' },
        { id: '4', name: 'CN', company: 'CN', amount: 91000000, created: '28/8/2025', due: '20/9/2025', status: 'pending' },
        { id: '5', name: 'Khang Phat', company: 'KP', amount: 87000000, created: '28/8/2025', due: '21/9/2025', status: 'pending' },
        { id: '6', name: 'DQM', company: 'DQM', amount: 99000000, created: '28/8/2025', due: '25/9/2025', status: 'pending' }
      ]
      setPayments(initial)
      localStorage.setItem('newPaymentSystem', JSON.stringify(initial))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('newPaymentSystem', JSON.stringify(payments))
  }, [payments])

  const unpaid = payments.filter(p => p.status !== 'paid')

  const markPaid = (id: string) => {
    setPayments(prev => prev.map(p => p.id === id ? { ...p, status: 'paid' } : p))
    alert('✅ Đã đánh dấu thanh toán! Công ty sẽ biến mất khỏi danh sách.')
  }

  const addCompany = () => {
    if (newCompany.name && newCompany.company && newCompany.amount) {
      const company = {
        id: Date.now().toString(),
        name: newCompany.name,
        company: newCompany.company,
        amount: parseInt(newCompany.amount),
        created: newCompany.created || new Date().toLocaleDateString('vi-VN'),
        due: newCompany.due || new Date().toLocaleDateString('vi-VN'),
        status: 'pending'
      }
      setPayments(prev => [...prev, company])
      setNewCompany({ name: '', company: '', amount: '', created: '', due: '' })
      setShowForm(false)
      alert(`✅ Đã thêm ${company.name}`)
    }
  }

  const sendEmail = (payment: any) => {
    alert(`📧 Email đã gửi đến andatecampion@proton.me!\n\nKhách hàng: ${payment.name}\nCông ty: ${payment.company}\nSố tiền: ${payment.amount.toLocaleString()} ₫`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">💰 Danh sách Thanh toán (V2)</h1>
            <button 
              onClick={() => setShowForm(!showForm)}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-semibold"
            >
              + Thêm mới
            </button>
          </div>

          {showForm && (
            <div className="mb-6 p-6 border-2 border-blue-200 rounded-lg bg-blue-50">
              <h3 className="text-lg font-semibold mb-4 text-blue-800">Thêm công ty mới</h3>
              <div className="grid grid-cols-2 gap-4">
                <input
                  placeholder="Tên khách hàng"
                  value={newCompany.name}
                  onChange={(e) => setNewCompany(prev => ({ ...prev, name: e.target.value }))}
                  className="border-2 rounded-lg px-4 py-3 focus:border-blue-500 outline-none"
                />
                <input
                  placeholder="Tên công ty"
                  value={newCompany.company}
                  onChange={(e) => setNewCompany(prev => ({ ...prev, company: e.target.value }))}
                  className="border-2 rounded-lg px-4 py-3 focus:border-blue-500 outline-none"
                />
                <input
                  placeholder="Số tiền (VND)"
                  type="number"
                  value={newCompany.amount}
                  onChange={(e) => setNewCompany(prev => ({ ...prev, amount: e.target.value }))}
                  className="border-2 rounded-lg px-4 py-3 focus:border-blue-500 outline-none"
                />
                <input
                  placeholder="Ngày tạo"
                  value={newCompany.created}
                  onChange={(e) => setNewCompany(prev => ({ ...prev, created: e.target.value }))}
                  className="border-2 rounded-lg px-4 py-3 focus:border-blue-500 outline-none"
                />
                <input
                  placeholder="Hạn thanh toán"
                  value={newCompany.due}
                  onChange={(e) => setNewCompany(prev => ({ ...prev, due: e.target.value }))}
                  className="border-2 rounded-lg px-4 py-3 focus:border-blue-500 outline-none"
                />
              </div>
              <div className="flex gap-3 mt-4">
                <button onClick={addCompany} className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 font-semibold">
                  ✅ Thêm
                </button>
                <button onClick={() => setShowForm(false)} className="border-2 border-gray-300 px-6 py-3 rounded-lg hover:bg-gray-100 font-semibold">
                  ❌ Hủy
                </button>
              </div>
            </div>
          )}
          
          <div className="space-y-4">
            {unpaid.map((payment) => (
              <div key={payment.id} className="border-2 rounded-xl p-6 hover:shadow-lg transition-all bg-gradient-to-r from-white to-gray-50">
                <div className="flex justify-between items-center">
                  <div className="flex-1">
                    <div className="text-xl font-bold text-gray-800">{payment.name}</div>
                    <div className="text-gray-600 mb-2">{payment.company}</div>
                    <div className="text-2xl font-bold text-blue-600 mb-2">{payment.amount.toLocaleString()} ₫</div>
                    <div className="text-sm text-gray-500">Ngày tạo: {payment.created}</div>
                    <div className="text-sm text-gray-500">Hạn thanh toán: {payment.due}</div>
                  </div>
                  
                  <div className="flex flex-col gap-3">
                    <span className={`px-4 py-2 rounded-full text-sm font-bold text-center ${
                      payment.status === 'overdue' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {payment.status === 'overdue' ? '🔴 Quá hạn' : '🟡 Chờ thanh toán'}
                    </span>
                    
                    <button
                      onClick={() => markPaid(payment.id)}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 font-bold"
                    >
                      ✅ Đã trả
                    </button>
                    
                    <button 
                      onClick={() => sendEmail(payment)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-bold"
                    >
                      📧 Email
                    </button>
                    
                    <button 
                      onClick={() => alert(`📧 Nhắc nhở đã gửi đến andatecampion@proton.me cho ${payment.name}`)}
                      className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 font-bold"
                    >
                      📧 Gửi theo dõi
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 p-6 bg-gradient-to-r from-blue-100 to-green-100 rounded-xl">
            <div className="text-lg font-bold text-gray-800">
              📊 Thống kê: {unpaid.length} công ty chưa thanh toán | 
              Đã thanh toán (ẩn): {payments.filter(p => p.status === 'paid').length} | 
              Tổng: {payments.length}
            </div>
            <div className="text-sm text-gray-600 mt-2">
              💡 Khi bấm "✅ Đã trả", công ty sẽ biến mất khỏi danh sách
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
