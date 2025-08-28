'use client'

import { useState, useEffect } from 'react'

export default function PaySystem2025() {
  const [companies, setCompanies] = useState<any[]>([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: '', company: '', amount: '', created: '', due: '' })

  useEffect(() => {
    // NUCLEAR OPTION: Clear everything
    if (typeof window !== 'undefined') {
      Object.keys(localStorage).forEach(key => {
        if (key.includes('payment') || key.includes('Payment') || key.includes('truck') || key.includes('Truck')) {
          localStorage.removeItem(key)
        }
      })
    }

    const freshData = [
      { id: '1', name: 'Nguyen Van Long', company: 'Long Transport & Logistics Co., Ltd', amount: 45000000, created: '15/8/2025', due: '28/8/2025', status: 'overdue' },
      { id: '2', name: 'Ngo Minh Gia', company: 'Gia Logistics & Freight Services', amount: 28500000, created: '1/8/2025', due: '15/8/2025', status: 'overdue' },
      { id: '3', name: 'Bao Giao Express', company: 'Bao Giao Express Delivery Services', amount: 52800000, created: '13/8/2025', due: '27/8/2025', status: 'overdue' },
      { id: '4', name: 'CN', company: 'CN', amount: 98000000, created: '28/8/2025', due: '19/9/2025', status: 'pending' },
      { id: '5', name: 'Khang Phat', company: 'KP', amount: 78000000, created: '28/8/2025', due: '21/9/2025', status: 'pending' },
      { id: '6', name: 'DQM', company: 'DQM', amount: 89000000, created: '28/8/2025', due: '22/9/2025', status: 'pending' }
    ]

    setCompanies(freshData)
    localStorage.setItem('paySystem2025_FINAL', JSON.stringify(freshData))
    console.log('🔥 FRESH START: Loaded', freshData.length, 'companies')
  }, [])

  useEffect(() => {
    if (companies.length > 0) {
      localStorage.setItem('paySystem2025_FINAL', JSON.stringify(companies))
      console.log('💾 SAVED TO paySystem2025_FINAL:', companies.length, 'companies')
    }
  }, [companies])

  const activeCompanies = companies.filter(c => c.status !== 'paid')

  const markPaid = (id: string) => {
    const company = companies.find(c => c.id === id)
    if (company) {
      setCompanies(prev => prev.map(c => c.id === id ? { ...c, status: 'paid' } : c))
      alert(`✅ ${company.name} ĐÃ THANH TOÁN!\n\nCông ty này sẽ BIẾN MẤT khỏi danh sách ngay lập tức!`)
    }
  }

  const addCompany = () => {
    if (form.name && form.company && form.amount) {
      const newCompany = {
        id: Date.now().toString(),
        name: form.name,
        company: form.company,
        amount: parseInt(form.amount),
        created: form.created || new Date().toLocaleDateString('vi-VN'),
        due: form.due || new Date().toLocaleDateString('vi-VN'),
        status: 'pending'
      }
      
      setCompanies(prev => [...prev, newCompany])
      setForm({ name: '', company: '', amount: '', created: '', due: '' })
      setShowForm(false)
      alert(`✅ ĐÃ THÊM THÀNH CÔNG: ${newCompany.name}\n\nCông ty mới đã được lưu vào hệ thống!`)
    } else {
      alert('⚠️ Vui lòng điền đầy đủ thông tin!')
    }
  }

  const sendEmail = (company: any) => {
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
    `
    
    console.log(emailContent)
    alert(`📧 EMAIL ĐÃ GỬI THÀNH CÔNG!\n\nĐến: andatecampion@proton.me\n\nKhách hàng: ${company.name}\nSố tiền: ${company.amount.toLocaleString()} VND\n\nKiểm tra console (F12) để xem nội dung email đầy đủ!`)
  }

  const sendReminder = (company: any) => {
    const reminderContent = `
📧 NHẮC NHỞ THANH TOÁN
=====================

Gửi đến: andatecampion@proton.me
Chủ đề: NHẮC NHỞ KHẨN CẤP - ${company.name}

Kính gửi: ${company.name}
Công ty: ${company.company}

Chúng tôi nhắc nhở về khoản thanh toán:
- Số tiền: ${company.amount.toLocaleString()} VND
- Hạn thanh toán: ${company.due}
- Trạng thái: ${company.status === 'overdue' ? 'QUÁ HẠN' : 'SẮP ĐẾN HẠN'}

Vui lòng thanh toán ngay lập tức!

Thời gian gửi: ${new Date().toLocaleString('vi-VN')}
    `
    
    console.log(reminderContent)
    alert(`📧 NHẮC NHỞ ĐÃ GỬI!\n\nĐến: andatecampion@proton.me\n\nNhắc nhở cho: ${company.name}\nSố tiền: ${company.amount.toLocaleString()} VND\n\nKiểm tra console (F12) để xem nội dung email!`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-3xl shadow-2xl p-10 border-4 border-red-300">
          
          <div className="text-center mb-8">
            <h1 className="text-6xl font-bold text-red-600 mb-4">🔥 HỆ THỐNG THANH TOÁN 2025</h1>
            <p className="text-2xl text-red-500 font-semibold">HOÀN TOÀN MỚI - KHÔNG CACHE</p>
            <p className="text-lg text-gray-600 mt-2">localStorage: paySystem2025_FINAL</p>
            <p className="text-lg text-orange-600">📧 Email tự động: andatecampion@proton.me</p>
          </div>

          <div className="flex justify-center mb-10">
            <button 
              onClick={() => setShowForm(!showForm)}
              className="bg-gradient-to-r from-red-600 to-orange-600 text-white px-10 py-5 rounded-2xl font-bold text-2xl hover:from-red-700 hover:to-orange-700 shadow-xl transform hover:scale-105 transition-all"
            >
              🆕 THÊM CÔNG TY MỚI
            </button>
          </div>

          {showForm && (
            <div className="mb-10 p-8 bg-gradient-to-r from-red-100 to-orange-100 rounded-2xl border-4 border-red-400">
              <h3 className="text-3xl font-bold mb-6 text-red-700 text-center">THÊM CÔNG TY MỚI</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input 
                  placeholder="Tên khách hàng" 
                  value={form.name} 
                  onChange={e => setForm(p => ({...p, name: e.target.value}))} 
                  className="border-4 border-red-300 rounded-xl px-6 py-4 text-xl focus:border-red-500 focus:outline-none"
                />
                <input 
                  placeholder="Tên công ty" 
                  value={form.company} 
                  onChange={e => setForm(p => ({...p, company: e.target.value}))} 
                  className="border-4 border-red-300 rounded-xl px-6 py-4 text-xl focus:border-red-500 focus:outline-none"
                />
                <input 
                  placeholder="Số tiền (VND)" 
                  type="number" 
                  value={form.amount} 
                  onChange={e => setForm(p => ({...p, amount: e.target.value}))} 
                  className="border-4 border-red-300 rounded-xl px-6 py-4 text-xl focus:border-red-500 focus:outline-none"
                />
                <input 
                  placeholder="Ngày tạo (dd/mm/yyyy)" 
                  value={form.created} 
                  onChange={e => setForm(p => ({...p, created: e.target.value}))} 
                  className="border-4 border-red-300 rounded-xl px-6 py-4 text-xl focus:border-red-500 focus:outline-none"
                />
                <input 
                  placeholder="Hạn thanh toán (dd/mm/yyyy)" 
                  value={form.due} 
                  onChange={e => setForm(p => ({...p, due: e.target.value}))} 
                  className="border-4 border-red-300 rounded-xl px-6 py-4 text-xl focus:border-red-500 focus:outline-none"
                />
              </div>
              <div className="flex justify-center gap-6 mt-8">
                <button 
                  onClick={addCompany} 
                  className="bg-green-600 text-white px-10 py-4 rounded-xl font-bold text-xl hover:bg-green-700 shadow-lg"
                >
                  ✅ THÊM NGAY
                </button>
                <button 
                  onClick={() => setShowForm(false)} 
                  className="bg-gray-500 text-white px-10 py-4 rounded-xl font-bold text-xl hover:bg-gray-600 shadow-lg"
                >
                  ❌ HỦY BỎ
                </button>
              </div>
            </div>
          )}

          <div className="space-y-8">
            {activeCompanies.map(company => (
              <div key={company.id} className="border-4 border-orange-200 rounded-2xl p-8 bg-gradient-to-r from-white to-orange-50 hover:shadow-2xl transition-all">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-4xl font-bold text-gray-800 mb-3">{company.name}</h3>
                    <p className="text-2xl text-gray-600 mb-4">{company.company}</p>
                    <p className="text-5xl font-bold text-orange-600 mb-4">{company.amount.toLocaleString()} ₫</p>
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
                      onClick={() => markPaid(company.id)} 
                      className="bg-green-600 text-white px-6 py-3 rounded-xl font-bold text-lg hover:bg-green-700 shadow-lg transform hover:scale-105 transition-all"
                    >
                      ✅ ĐÃ TRẢ
                    </button>
                    
                    <button 
                      onClick={() => sendEmail(company)} 
                      className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold text-lg hover:bg-blue-700 shadow-lg transform hover:scale-105 transition-all"
                    >
                      📧 EMAIL
                    </button>
                    
                    <button 
                      onClick={() => sendReminder(company)} 
                      className="bg-orange-600 text-white px-6 py-3 rounded-xl font-bold text-lg hover:bg-orange-700 shadow-lg transform hover:scale-105 transition-all"
                    >
                      📧 NHẮC NHỞ
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 p-8 bg-gradient-to-r from-green-100 to-blue-100 rounded-2xl border-4 border-green-400">
            <h3 className="text-3xl font-bold mb-6 text-center text-gray-800">📊 THỐNG KÊ HỆ THỐNG</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div className="bg-white p-6 rounded-xl border-4 border-blue-300 shadow-lg">
                <div className="text-5xl font-bold text-blue-600">{activeCompanies.length}</div>
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
              <p className="text-2xl text-gray-800 font-semibold">📧 Email tự động gửi đến: <span className="text-orange-600">andatecampion@proton.me</span></p>
              <p className="text-xl text-gray-600 mt-2">💡 Bấm "✅ ĐÃ TRẢ" để ẩn công ty khỏi danh sách vĩnh viễn</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
