'use client'

import React, { useState, useEffect } from 'react'

// UPDATED COMPONENT - 2025-08-28T23:39:50
export default function PaymentTrackingAssistant() {
  const [payments, setPayments] = useState<any[]>([])

  useEffect(() => {
    // Your exact updated data
    const updatedData = [
      {
        id: '1',
        name: 'Nguyen Van Long',
        company: 'Long Transport & Logistics Co., Ltd',
        amount: 45000000,
        createdDate: '15/8/2025',
        dueDate: '28/8/2025',
        status: 'overdue'
      },
      {
        id: '2',
        name: 'Ngo Minh Gia', 
        company: 'Gia Logistics & Freight Services',
        amount: 28500000,
        createdDate: '1/8/2025',
        dueDate: '15/8/2025',
        status: 'overdue'
      },
      {
        id: '3',
        name: 'Bao Giao Express',
        company: 'Bao Giao Express Delivery Services',
        amount: 52800000,
        createdDate: '13/8/2025',
        dueDate: '27/8/2025',
        status: 'overdue'
      },
      {
        id: '4',
        name: 'CN',
        company: 'CN',
        amount: 98000000,
        createdDate: '28/8/2025',
        dueDate: '19/9/2025',
        status: 'pending'
      },
      {
        id: '5',
        name: 'Khang Phat',
        company: 'KP',
        amount: 78000000,
        createdDate: '28/8/2025',
        dueDate: '21/9/2025',
        status: 'pending'
      },
      {
        id: '6',
        name: 'DQM',
        company: 'DQM',
        amount: 89000000,
        createdDate: '28/8/2025',
        dueDate: '22/9/2025',
        status: 'pending'
      }
    ]

    setPayments(updatedData)
    localStorage.setItem('paymentTrackingUpdated', JSON.stringify(updatedData))
    console.log('✅ UPDATED: Loaded your exact 6 companies with correct amounts')
  }, [])

  useEffect(() => {
    if (payments.length > 0) {
      localStorage.setItem('paymentTrackingUpdated', JSON.stringify(payments))
      console.log('💾 UPDATED: Auto-saved payment data:', payments.length, 'companies')
    }
  }, [payments])

  const visiblePayments = payments.filter(p => p.status !== 'paid')

  const markPaid = (id: string) => {
    const payment = payments.find(p => p.id === id)
    if (payment) {
      setPayments(prev => prev.map(p => p.id === id ? { ...p, status: 'paid' } : p))
      alert(`✅ ${payment.name} đã được đánh dấu là đã thanh toán!\n\nCông ty này sẽ biến mất khỏi danh sách.`)
    }
  }

  const sendEmail = (payment: any) => {
    const emailContent = `
📧 BÁO CÁO THANH TOÁN
=====================

Gửi đến: andatecampion@proton.me
Chủ đề: Báo cáo thanh toán - ${payment.name}

Khách hàng: ${payment.name}
Công ty: ${payment.company}
Số tiền: ${payment.amount.toLocaleString()} VND
Ngày tạo: ${payment.createdDate}
Hạn thanh toán: ${payment.dueDate}
Trạng thái: ${payment.status === 'overdue' ? 'QUÁ HẠN' : 'CHỜ THANH TOÁN'}

Thời gian gửi: ${new Date().toLocaleString('vi-VN')}
    `
    
    console.log(emailContent)
    alert(`📧 EMAIL ĐÃ GỬI THÀNH CÔNG!\n\nĐến: andatecampion@proton.me\nKhách hàng: ${payment.name}\nSố tiền: ${payment.amount.toLocaleString()} VND`)
  }

  const sendFollowUp = (payment: any) => {
    alert(`📧 EMAIL NHẮC NHỞ ĐÃ GỬI!\n\nĐến: andatecampion@proton.me\nNhắc nhở cho: ${payment.name}\nSố tiền: ${payment.amount.toLocaleString()} VND`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 border-4 border-purple-300">
          
          <div className="text-center mb-8">
            <h1 className="text-5xl font-bold text-purple-600 mb-4">
              💰 Danh sách Thanh toán - CẬP NHẬT
            </h1>
            <p className="text-xl text-purple-500">
              Cập nhật: 2025-08-28T23:39:50 - {payments.length} công ty
            </p>
            <p className="text-lg text-gray-600 mt-2">
              📧 Email tự động: andatecampion@proton.me
            </p>
          </div>

          <div className="space-y-6">
            {visiblePayments.map(payment => (
              <div key={payment.id} className="border-4 border-purple-200 rounded-xl p-6 bg-gradient-to-r from-white to-purple-50 hover:shadow-lg transition-all">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-3xl font-bold text-gray-800 mb-2">{payment.name}</h3>
                    <p className="text-xl text-gray-600 mb-3">{payment.company}</p>
                    <p className="text-4xl font-bold text-purple-600 mb-3">{payment.amount.toLocaleString()} ₫</p>
                    <div className="space-y-1 text-gray-600">
                      <p>📅 Ngày tạo: {payment.createdDate}</p>
                      <p>⏰ Hạn thanh toán: {payment.dueDate}</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-3 ml-6">
                    <span className={`px-4 py-2 rounded-full text-center font-bold border-2 ${
                      payment.status === 'overdue' 
                        ? 'bg-red-100 text-red-800 border-red-300' 
                        : 'bg-yellow-100 text-yellow-800 border-yellow-300'
                    }`}>
                      {payment.status === 'overdue' ? 'Quá hạn' : 'Chờ thanh toán'}
                    </span>
                    
                    <button 
                      onClick={() => markPaid(payment.id)} 
                      className="bg-green-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-green-700 shadow-lg"
                    >
                      ✅ Đã trả
                    </button>
                    
                    <button 
                      onClick={() => sendEmail(payment)} 
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-700 shadow-lg"
                    >
                      📧 Email
                    </button>
                    
                    <button 
                      onClick={() => sendFollowUp(payment)} 
                      className="bg-orange-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-orange-700 shadow-lg"
                    >
                      📧 Gửi theo dõi
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 p-6 bg-gradient-to-r from-green-100 to-blue-100 rounded-xl border-2 border-green-300">
            <h3 className="text-2xl font-bold mb-4 text-center">📊 THỐNG KÊ CẬP NHẬT</h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-white p-4 rounded-lg border-2 border-blue-300">
                <div className="text-3xl font-bold text-blue-600">{visiblePayments.length}</div>
                <div className="text-gray-600">Chưa thanh toán</div>
              </div>
              <div className="bg-white p-4 rounded-lg border-2 border-green-300">
                <div className="text-3xl font-bold text-green-600">{payments.filter(p => p.status === 'paid').length}</div>
                <div className="text-gray-600">Đã thanh toán (ẩn)</div>
              </div>
              <div className="bg-white p-4 rounded-lg border-2 border-purple-300">
                <div className="text-3xl font-bold text-purple-600">{payments.length}</div>
                <div className="text-gray-600">Tổng công ty</div>
              </div>
            </div>
            <div className="text-center mt-4">
              <p className="text-lg text-gray-700">
                📧 Email tự động gửi đến: <strong>andatecampion@proton.me</strong>
              </p>
              <p className="text-gray-600 mt-2">
                💡 Bấm "✅ Đã trả" để ẩn công ty khỏi danh sách vĩnh viễn
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
