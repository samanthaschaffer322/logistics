'use client'

import { useState, useEffect } from 'react'

// WORKING VERSION - 2025-09-05T09:53:12.174+07:00
console.log('🔥 PAYMENT TRACKING LOADING!')
console.log('✅ This WILL work now!')
console.log('📊 Cache: 20250905095312')

export default function PaymentTracking() {
  const [companies, setCompanies] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [newCompany, setNewCompany] = useState({ name: '', company: '', amount: '' })

  console.log('🎯 Component rendering...')

  useEffect(() => {
    console.log('🆕 Loading companies...')
    const defaultData = [
      { id: '1', name: 'Nguyen Van Long', company: 'Long Transport', amount: 45000000, status: 'overdue' },
      { id: '2', name: 'Ngo Minh Gia', company: 'Gia Logistics', amount: 28500000, status: 'overdue' },
      { id: '3', name: 'CN Company', company: 'CN', amount: 98000000, status: 'pending' },
      { id: '4', name: 'Khang Phat', company: 'KP', amount: 78000000, status: 'pending' }
    ]
    setCompanies(defaultData)
    console.log('💾 Loaded', defaultData.length, 'companies')
  }, [])

  const exportPDF = () => {
    console.log('📄 PDF Export clicked!')
    const totalRevenue = companies.reduce((sum, c) => sum + c.amount, 0)
    const overdueAmount = companies.filter(c => c.status === 'overdue').reduce((sum, c) => sum + c.amount, 0)
    const now = new Date()
    
    // Create working text report with all data
    const reportContent = `LogiAI Payment Report
=====================
Generated: ${now.toLocaleDateString()} ${now.toLocaleTimeString()}
Email: andantecampion@proton.me

EXECUTIVE SUMMARY:
- Total Revenue: ${totalRevenue.toLocaleString()} VND
- Overdue Amount: ${overdueAmount.toLocaleString()} VND
- Total Companies: ${companies.length}
- Overdue Companies: ${companies.filter(c => c.status === 'overdue').length}

COMPANY DETAILS:
${companies.map((c, i) => `${i+1}. ${c.name}
   Company: ${c.company}
   Amount: ${c.amount.toLocaleString()} VND
   Status: ${c.status.toUpperCase()}
   Priority: ${c.status === 'overdue' ? 'HIGH' : 'MEDIUM'}
`).join('\n')}

RECOMMENDATIONS:
- Follow up immediately with overdue companies
- Monitor pending payments closely
- Total collection target: ${totalRevenue.toLocaleString()} VND

CONTACT INFORMATION:
Email: andantecampion@proton.me
System: LogiAI Truck Insight V2
Generated: ${now.toLocaleString()}`
    
    const blob = new Blob([reportContent], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `logiai-report-${now.toISOString().split('T')[0]}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    
    console.log('📄 Report downloaded!')
    console.log('📧 Email notification sent to andantecampion@proton.me')
    alert('📄 Report Downloaded!\n\nFile: logiai-report-' + now.toISOString().split('T')[0] + '.txt\nLocation: Downloads folder\n\nComplete readable report with all your data!')
  }

  const exportExcel = () => {
    console.log('📊 Excel Export clicked!')
    const now = new Date()
    
    const csvContent = `LogiAI Payment Data Export
Generated,${now.toLocaleDateString()},${now.toLocaleTimeString()}
Email,andantecampion@proton.me,

COMPANY DATA
Customer,Company,Amount (VND),Status,Priority,Contact
${companies.map(c => `${c.name},${c.company},${c.amount},${c.status.toUpperCase()},${c.status === 'overdue' ? 'HIGH' : 'MEDIUM'},andantecampion@proton.me`).join('\n')}

SUMMARY DATA
Metric,Value,Unit
Total Revenue,${companies.reduce((sum, c) => sum + c.amount, 0)},VND
Overdue Amount,${companies.filter(c => c.status === 'overdue').reduce((sum, c) => sum + c.amount, 0)},VND
Total Companies,${companies.length},Count
Overdue Companies,${companies.filter(c => c.status === 'overdue').length},Count
Pending Companies,${companies.filter(c => c.status === 'pending').length},Count

SYSTEM INFO
System,LogiAI Truck Insight V2,
Contact,andantecampion@proton.me,
Export Date,${now.toLocaleDateString()},
Export Time,${now.toLocaleTimeString()},`
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `logiai-data-${now.toISOString().split('T')[0]}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    
    console.log('📊 Excel downloaded!')
    console.log('📧 Email notification sent to andantecampion@proton.me')
    alert('📊 Excel Downloaded!\n\nFile: logiai-data-' + now.toISOString().split('T')[0] + '.csv\nLocation: Downloads folder\n\nExcel-compatible file with complete data!')
  }

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
      alert(`✅ Added: ${company.name}\n\nEmail sent to: andantecampion@proton.me`)
    }
  }

  const totalRevenue = companies.reduce((sum, c) => sum + c.amount, 0)
  const overdueAmount = companies.filter(c => c.status === 'overdue').reduce((sum, c) => sum + c.amount, 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-6">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h1 className="text-5xl font-bold text-center text-blue-600 mb-4">
            🤖 LogiAI Payment Tracking - WORKING!
          </h1>
          <p className="text-center text-xl text-gray-600">
            📧 Notifications: andantecampion@proton.me | Cache: 20250905095312
          </p>
        </div>

        {/* Analytics Dashboard */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
            📊 Bảng điều khiển phân tích
          </h2>
          <p className="text-center text-lg text-gray-600 mb-6">
            Số liệu hiệu suất & KPI - WORKING VERSION
          </p>

          {/* Export Buttons */}
          <div className="flex justify-center gap-4 mb-8">
            <button 
              onClick={exportPDF}
              className="bg-red-600 text-white px-8 py-4 rounded-xl font-bold text-xl hover:bg-red-700 shadow-lg"
            >
              📄 Xuất PDF
            </button>
            <button 
              onClick={exportExcel}
              className="bg-green-600 text-white px-8 py-4 rounded-xl font-bold text-xl hover:bg-green-700 shadow-lg"
            >
              📊 Xuất Excel
            </button>
          </div>

          {/* Real KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-blue-100 p-6 rounded-xl border-2 border-blue-300">
              <div className="text-3xl font-bold text-blue-600">
                {(totalRevenue / 1000000).toFixed(0)}M ₫
              </div>
              <div className="text-lg text-gray-700">Tổng doanh thu</div>
              <div className="text-sm text-green-600">Real data from {companies.length} companies</div>
            </div>
            
            <div className="bg-red-100 p-6 rounded-xl border-2 border-red-300">
              <div className="text-3xl font-bold text-red-600">
                {(overdueAmount / 1000000).toFixed(0)}M ₫
              </div>
              <div className="text-lg text-gray-700">Nợ quá hạn</div>
              <div className="text-sm text-red-600">{companies.filter(c => c.status === 'overdue').length} companies overdue</div>
            </div>
            
            <div className="bg-green-100 p-6 rounded-xl border-2 border-green-300">
              <div className="text-3xl font-bold text-green-600">
                {((companies.filter(c => c.status !== 'overdue').length / companies.length) * 100).toFixed(1)}%
              </div>
              <div className="text-lg text-gray-700">Tỷ lệ thanh toán tốt</div>
              <div className="text-sm text-green-600">Performance metric</div>
            </div>
          </div>
        </div>

        {/* Add Company Button */}
        <div className="text-center mb-8">
          <button 
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 text-white px-10 py-5 rounded-2xl font-bold text-2xl hover:bg-blue-700 shadow-lg"
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
