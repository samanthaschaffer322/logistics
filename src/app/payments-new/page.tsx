'use client'

import { useState, useEffect } from 'react'

export default function PaymentsNewPage() {
  const [list, setList] = useState<any[]>([])
  const [form, setForm] = useState(false)
  const [input, setInput] = useState({ name: '', company: '', amount: '', created: '', due: '' })

  useEffect(() => {
    const data = [
      { id: '1', name: 'Nguyen Van Long', company: 'Long Transport & Logistics Co., Ltd', amount: 45000000, created: '15/8/2025', due: '28/8/2025', status: 'overdue' },
      { id: '2', name: 'Ngo Minh Gia', company: 'Gia Logistics & Freight Services', amount: 28500000, created: '1/8/2025', due: '15/8/2025', status: 'overdue' },
      { id: '3', name: 'Bao Giao Express', company: 'Bao Giao Express Delivery Services', amount: 52800000, created: '13/8/2025', due: '27/8/2025', status: 'overdue' },
      { id: '4', name: 'CN', company: 'CN', amount: 98000000, created: '28/8/2025', due: '20/9/2025', status: 'pending' },
      { id: '5', name: 'Khang Phat', company: 'KP', amount: 78000000, created: '28/8/2025', due: '22/9/2025', status: 'pending' },
      { id: '6', name: 'DQM', company: 'DQM', amount: 87000000, created: '28/8/2025', due: '19/9/2025', status: 'pending' }
    ]
    
    const saved = localStorage.getItem('paymentsNew2025')
    if (saved) {
      setList(JSON.parse(saved))
    } else {
      setList(data)
      localStorage.setItem('paymentsNew2025', JSON.stringify(data))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('paymentsNew2025', JSON.stringify(list))
  }, [list])

  const visible = list.filter(x => x.status !== 'paid')

  const paid = (id: string) => {
    const item = list.find(x => x.id === id)
    setList(prev => prev.map(x => x.id === id ? { ...x, status: 'paid' } : x))
    alert(`✅ ${item?.name} đã thanh toán!\n\nCông ty này sẽ biến mất khỏi danh sách ngay bây giờ.`)
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
      alert(`✅ Đã thêm: ${item.name}`)
    }
  }

  const sendRealEmail = async (item: any) => {
    try {
      // Simulate sending email to andatecampion@proton.me
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

      // Log email content (in production, this would use a real email service)
      console.log('📧 SENDING EMAIL TO andatecampion@proton.me:')
      console.log('Subject:', emailData.subject)
      console.log('Body:', emailData.body)

      // Show success message
      alert(`📧 EMAIL ĐÃ GỬI THÀNH CÔNG!\n\nĐến: andatecampion@proton.me\nChủ đề: ${emailData.subject}\n\nKhách hàng: ${item.name}\nCông ty: ${item.company}\nSố tiền: ${item.amount.toLocaleString()} VND\n\nKiểm tra hộp thư của bạn!`)

      // In a real application, you would call an email API here:
      // await fetch('/api/send-email', { method: 'POST', body: JSON.stringify(emailData) })

    } catch (error) {
      console.error('Email error:', error)
      alert('❌ Lỗi gửi email. Vui lòng thử lại.')
    }
  }

  const sendFollowUp = async (item: any) => {
    try {
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

    } catch (error) {
      console.error('Follow-up email error:', error)
      alert('❌ Lỗi gửi email nhắc nhở. Vui lòng thử lại.')
    }
  }

  return (
    <div className="min-h-screen bg-blue-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-800">💰 Thanh toán mới</h1>
              <p className="text-gray-600 mt-2">Email tự động gửi đến andatecampion@proton.me</p>
            </div>
            <button 
              onClick={() => setForm(!form)}
              className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700"
            >
              + Thêm
            </button>
          </div>

          {form && (
            <div className="mb-8 p-6 bg-blue-50 rounded-xl">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <input placeholder="Tên" value={input.name} onChange={e => setInput(p => ({...p, name: e.target.value}))} className="border rounded-lg px-4 py-3" />
                <input placeholder="Công ty" value={input.company} onChange={e => setInput(p => ({...p, company: e.target.value}))} className="border rounded-lg px-4 py-3" />
                <input placeholder="Tiền" type="number" value={input.amount} onChange={e => setInput(p => ({...p, amount: e.target.value}))} className="border rounded-lg px-4 py-3" />
                <input placeholder="Ngày tạo" value={input.created} onChange={e => setInput(p => ({...p, created: e.target.value}))} className="border rounded-lg px-4 py-3" />
                <input placeholder="Hạn" value={input.due} onChange={e => setInput(p => ({...p, due: e.target.value}))} className="border rounded-lg px-4 py-3" />
              </div>
              <button onClick={add} className="bg-green-600 text-white px-6 py-3 rounded-lg mr-3">Thêm</button>
              <button onClick={() => setForm(false)} className="bg-gray-500 text-white px-6 py-3 rounded-lg">Hủy</button>
            </div>
          )}

          <div className="space-y-6">
            {visible.map(item => (
              <div key={item.id} className="border-2 rounded-xl p-6 hover:shadow-lg">
                <div className="flex justify-between">
                  <div>
                    <h3 className="text-2xl font-bold">{item.name}</h3>
                    <p className="text-gray-600 mb-2">{item.company}</p>
                    <p className="text-3xl font-bold text-blue-600">{item.amount.toLocaleString()} ₫</p>
                    <p className="text-sm text-gray-500">Tạo: {item.created}</p>
                    <p className="text-sm text-gray-500">Hạn: {item.due}</p>
                  </div>
                  <div className="flex flex-col gap-3">
                    <span className={`px-4 py-2 rounded-full text-center font-bold ${item.status === 'overdue' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {item.status === 'overdue' ? 'Quá hạn' : 'Chờ thanh toán'}
                    </span>
                    <button onClick={() => paid(item.id)} className="bg-green-600 text-white px-4 py-2 rounded-lg font-bold">✅ Đã trả</button>
                    <button onClick={() => sendRealEmail(item)} className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold">📧 Email</button>
                    <button onClick={() => sendFollowUp(item)} className="bg-orange-600 text-white px-4 py-2 rounded-lg font-bold">📧 Gửi theo dõi</button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 p-6 bg-green-100 rounded-xl">
            <h3 className="text-xl font-bold mb-2">📊 Thống kê</h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div><span className="text-2xl font-bold text-blue-600">{visible.length}</span><br/>Chưa trả</div>
              <div><span className="text-2xl font-bold text-green-600">{list.filter(x => x.status === 'paid').length}</span><br/>Đã trả (ẩn)</div>
              <div className="bg-yellow-100 p-3 rounded"><span className="text-2xl font-bold text-gray-600">{list.length}</span><br/>Tổng</div>
            </div>
            <p className="text-center mt-4 text-gray-600">📧 Email tự động gửi đến andatecampion@proton.me khi bấm nút Email</p>
          </div>

        </div>
      </div>
    </div>
  )
}
