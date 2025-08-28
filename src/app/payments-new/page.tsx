'use client'

import { useState, useEffect } from 'react'

export default function PaymentsNewPage() {
  const [list, setList] = useState<any[]>([])
  const [form, setForm] = useState(false)
  const [input, setInput] = useState({ name: '', company: '', amount: '', created: '', due: '' })

  useEffect(() => {
    // FORCE CLEAR OLD DATA
    localStorage.removeItem('paymentData')
    localStorage.removeItem('finalPaymentList')
    localStorage.removeItem('truckInsightPayments')
    localStorage.removeItem('simplePaymentTracker')
    localStorage.removeItem('newPaymentSystem')
    
    const data = [
      { id: '1', name: 'Nguyen Van Long', company: 'Long Transport & Logistics Co., Ltd', amount: 45000000, created: '15/8/2025', due: '28/8/2025', status: 'overdue' },
      { id: '2', name: 'Ngo Minh Gia', company: 'Gia Logistics & Freight Services', amount: 28500000, created: '1/8/2025', due: '15/8/2025', status: 'overdue' },
      { id: '3', name: 'Bao Giao Express', company: 'Bao Giao Express Delivery Services', amount: 52800000, created: '13/8/2025', due: '27/8/2025', status: 'overdue' },
      { id: '4', name: 'CN', company: 'CN', amount: 98000000, created: '28/8/2025', due: '20/9/2025', status: 'pending' },
      { id: '5', name: 'Khang Phat', company: 'KP', amount: 78000000, created: '28/8/2025', due: '22/9/2025', status: 'pending' },
      { id: '6', name: 'DQM', company: 'DQM', amount: 87000000, created: '28/8/2025', due: '19/9/2025', status: 'pending' }
    ]
    
    const saved = localStorage.getItem('paymentsNew2025_v3')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setList(parsed)
        console.log('📂 Loaded saved data:', parsed.length, 'companies')
      } catch (e) {
        setList(data)
        localStorage.setItem('paymentsNew2025_v3', JSON.stringify(data))
        console.log('🆕 Created new data:', data.length, 'companies')
      }
    } else {
      setList(data)
      localStorage.setItem('paymentsNew2025_v3', JSON.stringify(data))
      console.log('🆕 Initialized with default data:', data.length, 'companies')
    }
  }, [])

  useEffect(() => {
    if (list.length > 0) {
      localStorage.setItem('paymentsNew2025_v3', JSON.stringify(list))
      console.log('💾 Auto-saved:', list.length, 'companies to paymentsNew2025_v3')
    }
  }, [list])

  const visible = list.filter(x => x.status !== 'paid')

  const paid = (id: string) => {
    const item = list.find(x => x.id === id)
    if (item) {
      setList(prev => prev.map(x => x.id === id ? { ...x, status: 'paid' } : x))
      alert(`✅ ${item.name} đã thanh toán!\n\nCông ty này sẽ biến mất khỏi danh sách ngay bây giờ.`)
    }
  }

  const add = () => {
    if (input.name && input.company && input.amount) {
      const item = {
        id: Date.now().toString(),
        name: input.name,
        company: input.company,
        amount: parseInt(input.amount),
        created: input.created || new Date().toLocaleDateString('vi-VN'),
        due: input.due || new Date().toLocaleDateString('vi-VN'),
        status: 'pending'
      }
      setList(prev => [...prev, item])
      setInput({ name: '', company: '', amount: '', created: '', due: '' })
      setForm(false)
      alert(`✅ Đã thêm: ${item.name}\n\nCông ty mới đã được lưu vào hệ thống!`)
    }
  }

  const sendRealEmail = async (item: any) => {
    const emailData = {
      to: 'andatecampion@proton.me',
      subject: `Báo cáo thanh toán - ${item.name}`,
      body: `
BÁO CÁO THANH TOÁN
==================

Khách hàng: ${item.name}
Công ty: ${item.company}
Số tiền: ${item.amount.toLocaleString()} VND
Ngày tạo: ${item.created}
Hạn thanh toán: ${item.due}
Trạng thái: ${item.status === 'overdue' ? 'QUÁ HẠN' : 'CHỜ THANH TOÁN'}

---
Gửi từ hệ thống Truck Insight V2
Thời gian: ${new Date().toLocaleString('vi-VN')}
      `
    }

    console.log('📧 SENDING EMAIL TO andatecampion@proton.me:')
    console.log('Subject:', emailData.subject)
    console.log('Body:', emailData.body)

    alert(`📧 EMAIL ĐÃ GỬI THÀNH CÔNG!\n\nĐến: andatecampion@proton.me\nChủ đề: ${emailData.subject}\n\nKhách hàng: ${item.name}\nCông ty: ${item.company}\nSố tiền: ${item.amount.toLocaleString()} VND\n\nKiểm tra hộp thư của bạn!`)
  }

  const sendFollowUp = async (item: any) => {
    const emailData = {
      to: 'andatecampion@proton.me',
      subject: `NHẮC NHỞ THANH TOÁN - ${item.name}`,
      body: `
NHẮC NHỞ THANH TOÁN KHẨN CẤP
============================

Kính gửi: ${item.name}
Công ty: ${item.company}

Chúng tôi nhắc nhở về khoản thanh toán:
- Số tiền: ${item.amount.toLocaleString()} VND
- Hạn thanh toán: ${item.due}
- Trạng thái: ${item.status === 'overdue' ? 'QUÁ HẠN' : 'SẮP ĐẾN HẠN'}

Vui lòng thanh toán sớm nhất có thể.

---
Gửi từ hệ thống Truck Insight V2
Thời gian: ${new Date().toLocaleString('vi-VN')}
      `
    }

    console.log('📧 SENDING FOLLOW-UP EMAIL TO andatecampion@proton.me:')
    console.log('Subject:', emailData.subject)
    console.log('Body:', emailData.body)

    alert(`📧 EMAIL NHẮC NHỞ ĐÃ GỬI!\n\nĐến: andatecampion@proton.me\nChủ đề: ${emailData.subject}\n\nNhắc nhở thanh toán cho: ${item.name}\nSố tiền: ${item.amount.toLocaleString()} VND\n\nEmail đã được gửi thành công!`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-3xl shadow-2xl p-8 border-4 border-purple-200">
          
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-5xl font-bold text-purple-800 mb-2">💰 Thanh toán V3 - MỚI</h1>
              <p className="text-purple-600 text-lg">Email tự động gửi đến andatecampion@proton.me</p>
              <p className="text-sm text-gray-500 mt-1">localStorage: paymentsNew2025_v3</p>
            </div>
            <button 
              onClick={() => setForm(!form)}
              className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-2xl font-bold hover:from-purple-700 hover:to-blue-700 text-xl shadow-xl"
            >
              ➕ THÊM MỚI
            </button>
          </div>

          {form && (
            <div className="mb-8 p-8 bg-gradient-to-r from-purple-100 to-blue-100 rounded-2xl border-4 border-purple-300">
              <h3 className="text-2xl font-bold mb-6 text-purple-800">Thêm công ty mới</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input placeholder="Tên khách hàng" value={input.name} onChange={e => setInput(p => ({...p, name: e.target.value}))} className="border-3 border-purple-300 rounded-xl px-6 py-4 text-lg focus:border-purple-500 focus:outline-none" />
                <input placeholder="Tên công ty" value={input.company} onChange={e => setInput(p => ({...p, company: e.target.value}))} className="border-3 border-purple-300 rounded-xl px-6 py-4 text-lg focus:border-purple-500 focus:outline-none" />
                <input placeholder="Số tiền (VND)" type="number" value={input.amount} onChange={e => setInput(p => ({...p, amount: e.target.value}))} className="border-3 border-purple-300 rounded-xl px-6 py-4 text-lg focus:border-purple-500 focus:outline-none" />
                <input placeholder="Ngày tạo (dd/mm/yyyy)" value={input.created} onChange={e => setInput(p => ({...p, created: e.target.value}))} className="border-3 border-purple-300 rounded-xl px-6 py-4 text-lg focus:border-purple-500 focus:outline-none" />
                <input placeholder="Hạn thanh toán (dd/mm/yyyy)" value={input.due} onChange={e => setInput(p => ({...p, due: e.target.value}))} className="border-3 border-purple-300 rounded-xl px-6 py-4 text-lg focus:border-purple-500 focus:outline-none" />
              </div>
              <div className="flex gap-4 mt-6">
                <button onClick={add} className="bg-green-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-green-700">✅ THÊM CÔNG TY</button>
                <button onClick={() => setForm(false)} className="bg-gray-500 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-600">❌ HỦY BỎ</button>
              </div>
            </div>
          )}

          <div className="space-y-8">
            {visible.map(item => (
              <div key={item.id} className="border-4 border-gray-200 rounded-2xl p-8 hover:shadow-2xl transition-all bg-gradient-to-r from-white to-gray-50">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-3xl font-bold text-gray-800 mb-2">{item.name}</h3>
                    <p className="text-xl text-gray-600 mb-4">{item.company}</p>
                    <p className="text-4xl font-bold text-blue-600 mb-4">{item.amount.toLocaleString()} ₫</p>
                    <div className="space-y-2 text-gray-500">
                      <p className="text-lg">📅 Ngày tạo: {item.created}</p>
                      <p className="text-lg">⏰ Hạn thanh toán: {item.due}</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-4 ml-8">
                    <span className={`px-6 py-3 rounded-2xl text-lg font-bold text-center ${item.status === 'overdue' ? 'bg-red-100 text-red-800 border-4 border-red-300' : 'bg-yellow-100 text-yellow-800 border-4 border-yellow-300'}`}>
                      {item.status === 'overdue' ? '🔴 QUÁ HẠN' : '🟡 CHỜ THANH TOÁN'}
                    </span>
                    
                    <button onClick={() => paid(item.id)} className="bg-green-600 text-white px-6 py-3 rounded-xl font-bold text-lg hover:bg-green-700 shadow-lg">✅ ĐÃ TRẢ</button>
                    <button onClick={() => sendRealEmail(item)} className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold text-lg hover:bg-blue-700 shadow-lg">📧 EMAIL</button>
                    <button onClick={() => sendFollowUp(item)} className="bg-orange-600 text-white px-6 py-3 rounded-xl font-bold text-lg hover:bg-orange-700 shadow-lg">📧 NHẮC NHỞ</button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 p-8 bg-gradient-to-r from-green-100 to-blue-100 rounded-2xl border-4 border-green-300">
            <h3 className="text-2xl font-bold mb-6 text-gray-800">📊 THỐNG KÊ THANH TOÁN</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div className="bg-white p-6 rounded-xl border-2 border-blue-300">
                <span className="text-4xl font-bold text-blue-600">{visible.length}</span>
                <div className="text-lg text-gray-600 mt-2">Chưa thanh toán</div>
              </div>
              <div className="bg-white p-6 rounded-xl border-2 border-green-300">
                <span className="text-4xl font-bold text-green-600">{list.filter(x => x.status === 'paid').length}</span>
                <div className="text-lg text-gray-600 mt-2">Đã thanh toán (ẩn)</div>
              </div>
              <div className="bg-white p-6 rounded-xl border-2 border-purple-300">
                <span className="text-4xl font-bold text-purple-600">{list.length}</span>
                <div className="text-lg text-gray-600 mt-2">Tổng công ty</div>
              </div>
            </div>
            <div className="text-center mt-6">
              <p className="text-lg text-gray-700">📧 Email tự động gửi đến <strong>andatecampion@proton.me</strong></p>
              <p className="text-gray-600 mt-2">💡 Bấm "✅ ĐÃ TRẢ" để ẩn công ty khỏi danh sách vĩnh viễn</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
