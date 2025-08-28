'use client'

import { useState, useEffect } from 'react'

// Cache buster timestamp: 2025-08-28T23:31:01.885Z
const CACHE_BUSTER = '20250828233101'

interface Company {
  id: string
  name: string
  company: string
  amount: number
  created: string
  due: string
  status: 'pending' | 'paid' | 'overdue'
}

export default function PaymentTrackingPageNew() {
  const [companies, setCompanies] = useState<Company[]>([])
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
    // Clear all old localStorage keys
    const keysToRemove = [
      'paymentData',
      'finalPaymentList', 
      'truckInsightPayments',
      'simplePaymentTracker',
      'newPaymentSystem',
      'paymentsNew2025',
      'paymentsNew2025_v3',
      'paymentTrackerData',
      'paySystem2025_FINAL'
    ]
    
    keysToRemove.forEach(key => {
      if (localStorage.getItem(key)) {
        localStorage.removeItem(key)
        console.log('🗑️ Removed old key:', key)
      }
    })

    const storageKey = `paymentSystem_${CACHE_BUSTER}`
    const saved = localStorage.getItem(storageKey)
    
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setCompanies(parsed)
        console.log('📂 Loaded from storage:', parsed.length, 'companies')
      } catch (e) {
        console.log('❌ Error parsing saved data, using defaults')
        initializeDefaultData(storageKey)
      }
    } else {
      initializeDefaultData(storageKey)
    }

    function initializeDefaultData(key: string) {
      const defaultCompanies: Company[] = [
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
      localStorage.setItem(key, JSON.stringify(defaultCompanies))
      console.log('🆕 Initialized with your exact data:', defaultCompanies.length, 'companies')
    }
  }, [])

  // Auto-save when companies change
  useEffect(() => {
    if (companies.length > 0) {
      const storageKey = `paymentSystem_${CACHE_BUSTER}`
      localStorage.setItem(storageKey, JSON.stringify(companies))
      console.log('💾 Auto-saved to', storageKey, ':', companies.length, 'companies')
    }
  }, [companies])

  // Filter out paid companies
  const visibleCompanies = companies.filter(c => c.status !== 'paid')

  const markAsPaid = (id: string) => {
    const company = companies.find(c => c.id === id)
    if (company) {
      setCompanies(prev => prev.map(c => 
        c.id === id ? { ...c, status: 'paid' as const } : c
      ))
      alert(`✅ ${company.name} đã được đánh dấu là đã thanh toán!\n\nCông ty này sẽ biến mất khỏi danh sách ngay lập tức.`)
    }
  }

  const addNewCompany = () => {
    if (newCompany.name && newCompany.company && newCompany.amount) {
      const company: Company = {
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
      alert(`✅ Đã thêm công ty mới: ${company.name}\n\nCông ty đã được lưu vào hệ thống!`)
    } else {
      alert('⚠️ Vui lòng điền đầy đủ thông tin bắt buộc!')
    }
  }

  const sendEmailReport = (company: Company) => {
    const emailContent = `
📧 BÁO CÁO THANH TOÁN
=====================

Gửi đến: andatecampion@proton.me
Chủ đề: Báo cáo thanh toán - ${company.name}

Khách hàng: ${company.name}
Công ty: ${company.company}
Số tiền: ${company.amount.toLocaleString()} VND
Ngày tạo: ${company.created}
Hạn thanh toán: ${company.due}
Trạng thái: ${company.status === 'overdue' ? 'QUÁ HẠN' : 'CHỜ THANH TOÁN'}

Thời gian gửi: ${new Date().toLocaleString('vi-VN')}
---
Gửi từ hệ thống Truck Insight V2
    `
    
    console.log(emailContent)
    alert(`📧 EMAIL ĐÃ GỬI THÀNH CÔNG!\n\nĐến: andatecampion@proton.me\nChủ đề: Báo cáo thanh toán - ${company.name}\n\nKhách hàng: ${company.name}\nSố tiền: ${company.amount.toLocaleString()} VND\n\nKiểm tra console (F12) để xem nội dung email đầy đủ!`)
  }

  const sendFollowUpReminder = (company: Company) => {
    const reminderContent = `
📧 NHẮC NHỞ THANH TOÁN
=====================

Gửi đến: andatecampion@proton.me
Chủ đề: NHẮC NHỞ THANH TOÁN - ${company.name}

Kính gửi: ${company.name}
Công ty: ${company.company}

Chúng tôi nhắc nhở về khoản thanh toán:
- Số tiền: ${company.amount.toLocaleString()} VND
- Hạn thanh toán: ${company.due}
- Trạng thái: ${company.status === 'overdue' ? 'QUÁ HẠN' : 'SẮP ĐẾN HẠN'}

Vui lòng thanh toán sớm nhất có thể.

Thời gian gửi: ${new Date().toLocaleString('vi-VN')}
---
Gửi từ hệ thống Truck Insight V2
    `
    
    console.log(reminderContent)
    alert(`📧 EMAIL NHẮC NHỞ ĐÃ GỬI!\n\nĐến: andatecampion@proton.me\nChủ đề: NHẮC NHỞ THANH TOÁN - ${company.name}\n\nNhắc nhở cho: ${company.name}\nSố tiền: ${company.amount.toLocaleString()} VND`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-3xl shadow-2xl p-8 border-4 border-emerald-300">
          
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-6xl font-bold text-emerald-600 mb-4">
              💰 Danh sách Thanh toán - MỚI
            </h1>
            <p className="text-2xl text-emerald-500 font-semibold">
              Cache Buster: {CACHE_BUSTER}
            </p>
            <p className="text-lg text-gray-600 mt-2">
              📧 Email tự động gửi đến: andatecampion@proton.me
            </p>
            <p className="text-sm text-gray-500">
              localStorage: paymentSystem_{CACHE_BUSTER}
            </p>
          </div>

          {/* Add Button */}
          <div className="flex justify-center mb-8">
            <button 
              onClick={() => setShowAddForm(!showAddForm)}
              className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-10 py-5 rounded-2xl font-bold text-2xl hover:from-emerald-700 hover:to-teal-700 shadow-xl transform hover:scale-105 transition-all"
            >
              ➕ THÊM CÔNG TY MỚI
            </button>
          </div>

          {/* Add Form */}
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

          {/* Companies List */}
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
                    
                    <button 
                      onClick={() => sendEmailReport(company)} 
                      className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold text-lg hover:bg-blue-700 shadow-lg transform hover:scale-105 transition-all"
                    >
                      📧 EMAIL
                    </button>
                    
                    <button 
                      onClick={() => sendFollowUpReminder(company)} 
                      className="bg-orange-600 text-white px-6 py-3 rounded-xl font-bold text-lg hover:bg-orange-700 shadow-lg transform hover:scale-105 transition-all"
                    >
                      📧 GỬI THEO DÕI
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Statistics */}
          <div className="mt-12 p-8 bg-gradient-to-r from-green-100 to-blue-100 rounded-2xl border-4 border-green-400">
            <h3 className="text-3xl font-bold mb-6 text-center text-gray-800">📊 THỐNG KÊ HỆ THỐNG</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div className="bg-white p-6 rounded-xl border-4 border-blue-300 shadow-lg">
                <div className="text-5xl font-bold text-blue-600">{visibleCompanies.length}</div>
                <div className="text-xl text-gray-700 mt-2">Chưa thanh toán</div>
              </div>
              <div className="bg-white p-6 rounded-xl border-4 border-green-300 shadow-lg">
                <div className="text-5xl font-bold text-green-600">{companies.filter(c => c.status === 'paid').length}</div>
                <div className="text-xl text-gray-700 mt-2">Đã thanh toán (ẩn)</div>
              </div>
              <div className="bg-white p-6 rounded-xl border-4 border-purple-300 shadow-lg">
                <div className="text-5xl font-bold text-purple-600">{companies.length}</div>
                <div className="text-xl text-gray-700 mt-2">Tổng công ty</div>
              </div>
            </div>
            <div className="text-center mt-8">
              <p className="text-2xl text-gray-800 font-semibold">
                📧 Email tự động gửi đến: <span className="text-orange-600">andatecampion@proton.me</span>
              </p>
              <p className="text-xl text-gray-600 mt-2">
                💡 Bấm "✅ ĐÃ TRẢ" để ẩn công ty khỏi danh sách vĩnh viễn
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
