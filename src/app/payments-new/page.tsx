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
      { id: '4', name: 'CN', company: 'CN', amount: 91000000, created: '28/8/2025', due: '20/9/2025', status: 'pending' },
      { id: '5', name: 'Khang Phat', company: 'KP', amount: 89000000, created: '28/8/2025', due: '21/9/2025', status: 'pending' },
      { id: '6', name: 'DQM', company: 'DQM', amount: 85000000, created: '28/8/2025', due: '19/9/2025', status: 'pending' }
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

  const email = (item: any) => {
    alert(`📧 Email gửi đến andatecampion@proton.me!\n\n${item.name}\n${item.company}\n${item.amount.toLocaleString()} ₫`)
  }

  return (
    <div className="min-h-screen bg-blue-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800">💰 Thanh toán mới</h1>
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
                    <button onClick={() => email(item)} className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold">📧 Email</button>
                    <button onClick={() => alert(`📧 Nhắc nhở gửi cho ${item.name}`)} className="bg-orange-600 text-white px-4 py-2 rounded-lg font-bold">📧 Theo dõi</button>
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
              <div><span className="text-2xl font-bold text-gray-600">{list.length}</span><br/>Tổng</div>
            </div>
            <p className="text-center mt-4 text-gray-600">💡 Bấm "✅ Đã trả" để ẩn công ty khỏi danh sách</p>
          </div>

        </div>
      </div>
    </div>
  )
}
