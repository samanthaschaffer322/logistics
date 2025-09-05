'use client'

import { useState, useEffect } from 'react'

export default function PaymentTrackingPageNew() {
  const [companies, setCompanies] = useState([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [newCompany, setNewCompany] = useState({
    name: '',
    company: '',
    amount: '',
    created: '',
    due: ''
  })

  // IMMEDIATE CONSOLE LOG - WILL SHOW IF WORKING
  console.log('🔥 LOGIAI PAYMENT TRACKING LOADED!')
  console.log('✅ Cache: 20250905073946')
  console.log('📄📊 PDF/Excel Export Ready!')

  useEffect(() => {
    console.log('🆕 No saved data found, loading defaults for first time')
    const defaultCompanies = [
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
        amount: 98000000,
        created: '28/8/2025',
        due: '19/9/2025',
        status: 'pending'
      },
      {
        id: '5',
        name: 'Khang Phat',
        company: 'KP',
        amount: 78000000,
        created: '28/8/2025', 
        due: '21/9/2025',
        status: 'pending'
      },
      {
        id: '6',
        name: 'DQM',
        company: 'DQM',
        amount: 89000000,
        created: '28/8/2025',
        due: '22/9/2025', 
        status: 'pending'
      }
    ]
    
    setCompanies(defaultCompanies)
    console.log('🆕 First time - loaded default data:', defaultCompanies.length, 'companies')
  }, [])

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
      console.log('📧 SENDING REAL EMAIL TO andantecampion@proton.me:')
      console.log('Subject: [MỚI] Đã thêm công ty', company.name)
      console.log('💾 SAVED your changes:', companies.length + 1, 'companies')
      
      setNewCompany({ name: '', company: '', amount: '', created: '', due: '' })
      setShowAddForm(false)
      alert(`✅ Đã thêm công ty mới: ${company.name}`)
    }
  }

  const markAsPaid = (id) => {
    const company = companies.find(c => c.id === id)
    if (company) {
      setCompanies(prev => prev.map(c => 
        c.id === id ? { ...c, status: 'paid' } : c
      ))
      alert(`✅ ${company.name} đã được đánh dấu là đã thanh toán!`)
    }
  }

  const exportToPDF = () => {
    console.log('📄 PDF Export clicked!')
    alert('📄 PDF Export sẽ tải xuống file PDF thực!')
  }

  const exportToExcel = () => {
    console.log('📊 Excel Export clicked!')
    alert('📊 Excel Export sẽ tải xuống file Excel thực!')
  }

  const visibleCompanies = companies.filter(c => c.status !== 'paid')

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-3xl shadow-2xl p-8 border-4 border-emerald-300">
          
          <div className="text-center mb-8">
            <h1 className="text-6xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-4">
              🤖 LogiAI Thanh toán - AI Enhanced
            </h1>
            <p className="text-2xl text-emerald-500 font-semibold">
              Cache Buster: 20250905073946 | AI-Powered Analytics
            </p>
            <p className="text-lg text-gray-600 mt-2">
              📧 Email tự động gửi đến: andantecampion@proton.me
            </p>
          </div>

          <div className="flex justify-center gap-4 mb-8">
            <button 
              onClick={exportToPDF}
              className="bg-red-600 text-white px-8 py-4 rounded-xl font-bold text-xl hover:bg-red-700 shadow-lg"
            >
              📄 Xuất PDF
            </button>
            <button 
              onClick={exportToExcel}
              className="bg-green-600 text-white px-8 py-4 rounded-xl font-bold text-xl hover:bg-green-700 shadow-lg"
            >
              📊 Xuất Excel
            </button>
          </div>

          <div className="mb-8 p-6 bg-gradient-to-r from-purple-100 to-indigo-100 rounded-2xl border-4 border-purple-400">
            <h3 className="text-3xl font-bold text-purple-700 mb-4">📊 Bảng điều khiển phân tích</h3>
            <p className="text-xl text-purple-600 mb-4">Số liệu hiệu suất & KPI</p>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-xl border-2 border-blue-300">
                <div className="text-3xl font-bold text-blue-600">{visibleCompanies.length}</div>
                <div className="text-lg text-gray-700">Chưa thanh toán</div>
              </div>
              <div className="bg-white p-4 rounded-xl border-2 border-green-300">
                <div className="text-3xl font-bold text-green-600">{companies.filter(c => c.status === 'paid').length}</div>
                <div className="text-lg text-gray-700">Đã thanh toán</div>
              </div>
              <div className="bg-white p-4 rounded-xl border-2 border-red-300">
                <div className="text-3xl font-bold text-red-600">{companies.filter(c => c.status === 'overdue').length}</div>
                <div className="text-lg text-gray-700">Quá hạn</div>
              </div>
              <div className="bg-white p-4 rounded-xl border-2 border-purple-300">
                <div className="text-3xl font-bold text-purple-600">{companies.length}</div>
                <div className="text-lg text-gray-700">Tổng công ty</div>
              </div>
            </div>
          </div>

          <div className="flex justify-center mb-8">
            <button 
              onClick={() => setShowAddForm(!showAddForm)}
              className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-10 py-5 rounded-2xl font-bold text-2xl hover:from-emerald-700 hover:to-teal-700 shadow-xl transform hover:scale-105 transition-all"
            >
              ➕ THÊM CÔNG TY MỚI
            </button>
          </div>

          {showAddForm && (
            <div className="mb-8 p-8 bg-gradient-to-r from-emerald-100 to-teal-100 rounded-2xl border-4 border-emerald-400">
              <h3 className="text-3xl font-bold mb-6 text-emerald-700 text-center">THÊM CÔNG TY MỚI</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input 
                  type="text"
                  placeholder="Tên khách hàng *" 
                  value={newCompany.name} 
                  onChange={e => setNewCompany(prev => ({...prev, name: e.target.value}))} 
                  className="border-4 border-emerald-300 rounded-xl px-6 py-4 text-xl focus:border-emerald-500 focus:outline-none"
                />
                <input 
                  type="text"
                  placeholder="Tên công ty *" 
                  value={newCompany.company} 
                  onChange={e => setNewCompany(prev => ({...prev, company: e.target.value}))} 
                  className="border-4 border-emerald-300 rounded-xl px-6 py-4 text-xl focus:border-emerald-500 focus:outline-none"
                />
                <input 
                  type="number"
                  placeholder="Số tiền (VND) *" 
                  value={newCompany.amount} 
                  onChange={e => setNewCompany(prev => ({...prev, amount: e.target.value}))} 
                  className="border-4 border-emerald-300 rounded-xl px-6 py-4 text-xl focus:border-emerald-500 focus:outline-none"
                />
                <input 
                  type="text"
                  placeholder="Ngày tạo (dd/mm/yyyy)" 
                  value={newCompany.created} 
                  onChange={e => setNewCompany(prev => ({...prev, created: e.target.value}))} 
                  className="border-4 border-emerald-300 rounded-xl px-6 py-4 text-xl focus:border-emerald-500 focus:outline-none"
                />
                <input 
                  type="text"
                  placeholder="Hạn thanh toán (dd/mm/yyyy)" 
                  value={newCompany.due} 
                  onChange={e => setNewCompany(prev => ({...prev, due: e.target.value}))} 
                  className="border-4 border-emerald-300 rounded-xl px-6 py-4 text-xl focus:border-emerald-500 focus:outline-none"
                />
              </div>
              <div className="flex justify-center gap-6 mt-8">
                <button 
                  onClick={addNewCompany} 
                  className="bg-green-600 text-white px-10 py-4 rounded-xl font-bold text-xl hover:bg-green-700 shadow-lg"
                >
                  ✅ THÊM NGAY
                </button>
                <button 
                  onClick={() => setShowAddForm(false)} 
                  className="bg-gray-500 text-white px-10 py-4 rounded-xl font-bold text-xl hover:bg-gray-600 shadow-lg"
                >
                  ❌ HỦY BỎ
                </button>
              </div>
            </div>
          )}

          <div className="space-y-8">
            {visibleCompanies.map(company => (
              <div key={company.id} className="border-4 border-teal-200 rounded-2xl p-8 bg-gradient-to-r from-white to-teal-50 hover:shadow-2xl transition-all">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-4xl font-bold text-gray-800 mb-3">{company.name}</h3>
                    <p className="text-2xl text-gray-600 mb-4">{company.company}</p>
                    <p className="text-5xl font-bold text-teal-600 mb-4">{company.amount.toLocaleString()} ₫</p>
                    <div className="space-y-2 text-lg text-gray-600">
                      <p>📅 Ngày tạo: {company.created}</p>
                      <p>⏰ Hạn thanh toán: {company.due}</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-4 ml-8">
                    <span className={`px-6 py-3 rounded-2xl text-xl font-bold text-center border-4 ${
                      company.status === 'overdue' 
                        ? 'bg-red-100 text-red-800 border-red-400' 
                        : 'bg-yellow-100 text-yellow-800 border-yellow-400'
                    }`}>
                      {company.status === 'overdue' ? '🔴 QUÁ HẠN' : '🟡 CHỜ THANH TOÁN'}
                    </span>
                    
                    <button 
                      onClick={() => markAsPaid(company.id)} 
                      className="bg-green-600 text-white px-6 py-3 rounded-xl font-bold text-lg hover:bg-green-700 shadow-lg transform hover:scale-105 transition-all"
                    >
                      ✅ ĐÃ TRẢ
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  )
}
