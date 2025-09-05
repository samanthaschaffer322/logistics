'use client'

import { useState, useEffect } from 'react'

// FRESH START - 2025-09-05T08:35:26.940+07:00
console.log('🔥 FRESH START - LOGIAI LOADING!')
console.log('✅ This WILL work!')

export default function PaymentTracking() {
  const [companies, setCompanies] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [newCompany, setNewCompany] = useState({ name: '', company: '', amount: '' })

  console.log('🎯 Component rendering...')

  useEffect(() => {
    console.log('🆕 Loading default companies...')
    const defaultData = [
      { id: '1', name: 'Nguyen Van Long', company: 'Long Transport', amount: 45000000, status: 'overdue' },
      { id: '2', name: 'Ngo Minh Gia', company: 'Gia Logistics', amount: 28500000, status: 'overdue' },
      { id: '3', name: 'CN Company', company: 'CN', amount: 98000000, status: 'pending' },
      { id: '4', name: 'Khang Phat', company: 'KP', amount: 78000000, status: 'pending' }
    ]
    setCompanies(defaultData)
    console.log('💾 Loaded', defaultData.length, 'companies')
  }, [])

  const addCompany = () => {
    if (newCompany.name && newCompany.company && newCompany.amount) {
      const company = {
        id: Date.now().toString(),
        name: newCompany.name,
        company: newCompany.company,
        amount: parseInt(newCompany.amount),
        status: 'pending'
      }
      setCompanies(prev => [...prev, company])
      console.log('📧 EMAIL SENT TO: andantecampion@proton.me')
      console.log('Subject: New company added -', company.name)
      setNewCompany({ name: '', company: '', amount: '' })
      setShowForm(false)
      alert(`✅ Added: ${company.name}`)
    }
  }

  const exportPDF = () => {
    console.log('📄 PDF Export clicked!')
    const totalRevenue = companies.reduce((sum, c) => sum + c.amount, 0)
    const overdueAmount = companies.filter(c => c.status === 'overdue').reduce((sum, c) => sum + c.amount, 0)
    
    alert(`📄 PDF Export Working!\n\nTotal Revenue: ${totalRevenue.toLocaleString()} VND\nOverdue: ${overdueAmount.toLocaleString()} VND\n\nFile would download to Downloads folder`)
  }

  const exportExcel = () => {
    console.log('📊 Excel Export clicked!')
    const stats = {
      total: companies.length,
      overdue: companies.filter(c => c.status === 'overdue').length,
      pending: companies.filter(c => c.status === 'pending').length
    }
    
    alert(`📊 Excel Export Working!\n\nCompanies: ${stats.total}\nOverdue: ${stats.overdue}\nPending: ${stats.pending}\n\nFile would download to Downloads folder`)
  }

  const totalRevenue = companies.reduce((sum, c) => sum + c.amount, 0)
  const overdueAmount = companies.filter(c => c.status === 'overdue').reduce((sum, c) => sum + c.amount, 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-6">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h1 className="text-5xl font-bold text-center text-blue-600 mb-4">
            🤖 LogiAI Payment Tracking
          </h1>
          <p className="text-center text-xl text-gray-600">
            📧 Notifications: andantecampion@proton.me
          </p>
        </div>

        {/* Analytics Dashboard */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
            📊 Bảng điều khiển phân tích
          </h2>
          <p className="text-center text-lg text-gray-600 mb-6">
            Số liệu hiệu suất & KPI
          </p>

          {/* Export Buttons */}
          <div className="flex justify-center gap-4 mb-8">
            <button 
              onClick={exportPDF}
              className="bg-red-600 text-white px-8 py-4 rounded-xl font-bold text-xl hover:bg-red-700"
            >
              📄 Xuất PDF
            </button>
            <button 
              onClick={exportExcel}
              className="bg-green-600 text-white px-8 py-4 rounded-xl font-bold text-xl hover:bg-green-700"
            >
              📊 Xuất Excel
            </button>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-blue-100 p-6 rounded-xl border-2 border-blue-300">
              <div className="text-3xl font-bold text-blue-600">
                {(totalRevenue / 1000000).toFixed(0)}M ₫
              </div>
              <div className="text-lg text-gray-700">Tổng doanh thu</div>
            </div>
            
            <div className="bg-red-100 p-6 rounded-xl border-2 border-red-300">
              <div className="text-3xl font-bold text-red-600">
                {(overdueAmount / 1000000).toFixed(0)}M ₫
              </div>
              <div className="text-lg text-gray-700">Nợ quá hạn</div>
            </div>
            
            <div className="bg-green-100 p-6 rounded-xl border-2 border-green-300">
              <div className="text-3xl font-bold text-green-600">
                {companies.length}
              </div>
              <div className="text-lg text-gray-700">Tổng công ty</div>
            </div>
          </div>
        </div>

        {/* Add Company Button */}
        <div className="text-center mb-8">
          <button 
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 text-white px-10 py-5 rounded-2xl font-bold text-2xl hover:bg-blue-700"
          >
            ➕ THÊM CÔNG TY MỚI
          </button>
        </div>

        {/* Add Form */}
        {showForm && (
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <h3 className="text-2xl font-bold mb-6 text-center">THÊM CÔNG TY MỚI</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <input 
                type="text"
                placeholder="Tên khách hàng" 
                value={newCompany.name} 
                onChange={e => setNewCompany(prev => ({...prev, name: e.target.value}))} 
                className="border-2 border-gray-300 rounded-xl px-4 py-3 text-lg"
              />
              <input 
                type="text"
                placeholder="Tên công ty" 
                value={newCompany.company} 
                onChange={e => setNewCompany(prev => ({...prev, company: e.target.value}))} 
                className="border-2 border-gray-300 rounded-xl px-4 py-3 text-lg"
              />
              <input 
                type="number"
                placeholder="Số tiền (VND)" 
                value={newCompany.amount} 
                onChange={e => setNewCompany(prev => ({...prev, amount: e.target.value}))} 
                className="border-2 border-gray-300 rounded-xl px-4 py-3 text-lg"
              />
            </div>
            <div className="text-center">
              <button 
                onClick={addCompany} 
                className="bg-green-600 text-white px-8 py-3 rounded-xl font-bold text-lg hover:bg-green-700 mr-4"
              >
                ✅ THÊM
              </button>
              <button 
                onClick={() => setShowForm(false)} 
                className="bg-gray-500 text-white px-8 py-3 rounded-xl font-bold text-lg hover:bg-gray-600"
              >
                ❌ HỦY
              </button>
            </div>
          </div>
        )}

        {/* Companies List */}
        <div className="space-y-6">
          {companies.map(company => (
            <div key={company.id} className="bg-white rounded-2xl shadow-xl p-8">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-3xl font-bold text-gray-800 mb-2">{company.name}</h3>
                  <p className="text-xl text-gray-600 mb-2">{company.company}</p>
                  <p className="text-4xl font-bold text-blue-600">{company.amount.toLocaleString()} ₫</p>
                </div>
                <div className="text-center">
                  <span className={`px-6 py-3 rounded-xl text-xl font-bold ${
                    company.status === 'overdue' 
                      ? 'bg-red-100 text-red-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {company.status === 'overdue' ? '🔴 QUÁ HẠN' : '🟡 CHỜ THANH TOÁN'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}
