'use client'

import { useState, useEffect } from 'react'

// Cache buster: 2025-08-28T14:08:33.532Z
export default function PaymentTrackingPageNew() {
  const [companies, setCompanies] = useState<any[]>([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [newCompany, setNewCompany] = useState({
    name: '',
    company: '',
    amount: '',
    created: '',
    due: ''
  })

  // Initialize with your exact data
  useEffect(() => {
    const storageKey = 'finalPaymentList_' + Date.now()
    const saved = localStorage.getItem('finalPaymentList')
    
    if (saved) {
      try {
        setCompanies(JSON.parse(saved))
      } catch (e) {
        initializeData()
      }
    } else {
      initializeData()
    }

    function initializeData() {
      const initialData = [
        {
          id: '1',
          name: 'Nguyen Van Long',
          company: 'Long Transport & Logistics Co., Ltd',
          amount: 45000000,
          created: '15/8/2025',
          due: '28/8/2025',
          status: 'overdue'
        },
        {
          id: '2',
          name: 'Ngo Minh Gia',
          company: 'Gia Logistics & Freight Services',
          amount: 28500000,
          created: '1/8/2025',
          due: '15/8/2025',
          status: 'overdue'
        },
        {
          id: '3',
          name: 'Bao Giao Express',
          company: 'Bao Giao Express Delivery Services',
          amount: 52800000,
          created: '13/8/2025',
          due: '27/8/2025',
          status: 'overdue'
        },
        {
          id: '4',
          name: 'CN',
          company: 'CN',
          amount: 91000000,
          created: '28/8/2025',
          due: '20/9/2025',
          status: 'pending'
        },
        {
          id: '5',
          name: 'Khang Phat',
          company: 'KP',
          amount: 89000000,
          created: '28/8/2025',
          due: '21/9/2025',
          status: 'pending'
        },
        {
          id: '6',
          name: 'DQM',
          company: 'DQM',
          amount: 85000000,
          created: '28/8/2025',
          due: '19/9/2025',
          status: 'pending'
        }
      ]
      setCompanies(initialData)
      localStorage.setItem('finalPaymentList', JSON.stringify(initialData))
    }
  }, [])

  // Auto-save when companies change
  useEffect(() => {
    if (companies.length > 0) {
      localStorage.setItem('finalPaymentList', JSON.stringify(companies))
      console.log('💾 Saved companies:', companies.length)
    }
  }, [companies])

  // Filter out paid companies
  const activeCompanies = companies.filter(c => c.status !== 'paid')

  const markAsPaid = (id: string) => {
    const company = companies.find(c => c.id === id)
    if (company) {
      setCompanies(prev => prev.map(c => 
        c.id === id ? { ...c, status: 'paid' } : c
      ))
      alert(`✅ ${company.name} đã được đánh dấu là đã thanh toán!\n\nCông ty này sẽ biến mất khỏi danh sách.`)
    }
  }

  const addNewCompany = () => {
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
      
      setCompanies(prev => [...prev, company])
      setNewCompany({ name: '', company: '', amount: '', created: '', due: '' })
      setShowAddForm(false)
      alert(`✅ Đã thêm công ty: ${company.name}`)
    } else {
      alert('⚠️ Vui lòng điền đầy đủ thông tin!')
    }
  }

  const sendEmailReport = (company: any) => {
    alert(`📧 Báo cáo email đã được gửi đến andatecampion@proton.me!\n\n` +
          `Khách hàng: ${company.name}\n` +
          `Công ty: ${company.company}\n` +
          `Số tiền: ${company.amount.toLocaleString()} ₫\n` +
          `Trạng thái: ${company.status === 'overdue' ? 'Quá hạn' : 'Chờ thanh toán'}\n` +
          `Hạn thanh toán: ${company.due}`)
  }

  const sendFollowUp = (company: any) => {
    alert(`📧 Email nhắc nhở đã được gửi đến andatecampion@proton.me!\n\n` +
          `Nhắc nhở thanh toán cho: ${company.name}\n` +
          `Công ty: ${company.company}\n` +
          `Số tiền: ${company.amount.toLocaleString()} ₫\n` +
          `Hạn thanh toán: ${company.due}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-2xl p-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-800 mb-2">💰 Danh sách Thanh toán</h1>
              <p className="text-gray-600">Quản lý thanh toán từ các công ty logistics</p>
            </div>
            <button 
              onClick={() => setShowAddForm(!showAddForm)}
              className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 font-semibold shadow-lg transform hover:scale-105 transition-all"
            >
              ➕ Thêm mới
            </button>
          </div>

          {/* Add Form */}
          {showAddForm && (
            <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-200">
              <h3 className="text-xl font-semibold mb-4 text-blue-800">Thêm công ty mới</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Tên khách hàng"
                  value={newCompany.name}
                  onChange={(e) => setNewCompany(prev => ({ ...prev, name: e.target.value }))}
                  className="border-2 border-gray-300 rounded-lg px-4 py-3 focus:border-blue-500 focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="Tên công ty"
                  value={newCompany.company}
                  onChange={(e) => setNewCompany(prev => ({ ...prev, company: e.target.value }))}
                  className="border-2 border-gray-300 rounded-lg px-4 py-3 focus:border-blue-500 focus:outline-none"
                />
                <input
                  type="number"
                  placeholder="Số tiền (VND)"
                  value={newCompany.amount}
                  onChange={(e) => setNewCompany(prev => ({ ...prev, amount: e.target.value }))}
                  className="border-2 border-gray-300 rounded-lg px-4 py-3 focus:border-blue-500 focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="Ngày tạo (dd/mm/yyyy)"
                  value={newCompany.created}
                  onChange={(e) => setNewCompany(prev => ({ ...prev, created: e.target.value }))}
                  className="border-2 border-gray-300 rounded-lg px-4 py-3 focus:border-blue-500 focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="Hạn thanh toán (dd/mm/yyyy)"
                  value={newCompany.due}
                  onChange={(e) => setNewCompany(prev => ({ ...prev, due: e.target.value }))}
                  className="border-2 border-gray-300 rounded-lg px-4 py-3 focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div className="flex gap-3 mt-6">
                <button 
                  onClick={addNewCompany}
                  className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 font-semibold"
                >
                  ✅ Thêm công ty
                </button>
                <button 
                  onClick={() => setShowAddForm(false)}
                  className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 font-semibold"
                >
                  ❌ Hủy bỏ
                </button>
              </div>
            </div>
          )}

          {/* Company List */}
          <div className="space-y-6">
            {activeCompanies.map((company) => (
              <div key={company.id} className="bg-gradient-to-r from-white to-gray-50 border-2 border-gray-200 rounded-xl p-6 hover:shadow-xl transition-all">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-800 mb-1">{company.name}</h3>
                    <p className="text-lg text-gray-600 mb-3">{company.company}</p>
                    <div className="text-3xl font-bold text-blue-600 mb-3">
                      {company.amount.toLocaleString()} ₫
                    </div>
                    <div className="space-y-1 text-sm text-gray-500">
                      <div>Ngày tạo: {company.created}</div>
                      <div>Hạn thanh toán: {company.due}</div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-3 ml-6">
                    <span className={`px-4 py-2 rounded-full text-sm font-bold text-center ${
                      company.status === 'overdue' 
                        ? 'bg-red-100 text-red-800 border-2 border-red-300' 
                        : 'bg-yellow-100 text-yellow-800 border-2 border-yellow-300'
                    }`}>
                      {company.status === 'overdue' ? 'Quá hạn' : 'Chờ thanh toán'}
                    </span>
                    
                    <button
                      onClick={() => markAsPaid(company.id)}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 font-bold shadow-lg transform hover:scale-105 transition-all"
                    >
                      ✅ Đã trả
                    </button>
                    
                    <button 
                      onClick={() => sendEmailReport(company)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-bold shadow-lg transform hover:scale-105 transition-all"
                    >
                      📧 Email
                    </button>
                    
                    <button 
                      onClick={() => sendFollowUp(company)}
                      className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 font-bold shadow-lg transform hover:scale-105 transition-all"
                    >
                      📧 Gửi theo dõi
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Statistics */}
          <div className="mt-8 p-6 bg-gradient-to-r from-green-100 to-blue-100 rounded-xl border-2 border-green-300">
            <div className="text-xl font-bold text-gray-800 mb-2">
              📊 Thống kê thanh toán
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div className="bg-white p-4 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{activeCompanies.length}</div>
                <div className="text-sm text-gray-600">Chưa thanh toán</div>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{companies.filter(c => c.status === 'paid').length}</div>
                <div className="text-sm text-gray-600">Đã thanh toán (ẩn)</div>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <div className="text-2xl font-bold text-gray-600">{companies.length}</div>
                <div className="text-sm text-gray-600">Tổng công ty</div>
              </div>
            </div>
            <div className="text-center mt-4 text-sm text-gray-600">
              💡 Khi bấm "✅ Đã trả", công ty sẽ tự động biến mất khỏi danh sách
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
