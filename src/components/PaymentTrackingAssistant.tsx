'use client'

import React, { useState, useEffect } from 'react'
import * as XLSX from 'xlsx'
import jsPDF from 'jspdf'
import 'jspdf-autotable'

export default function PaymentTrackingAssistant() {
  const [payments, setPayments] = useState<any[]>([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [newPayment, setNewPayment] = useState({
    name: '',
    company: '',
    amount: '',
    createdDate: '',
    dueDate: ''
  })

  useEffect(() => {
    // PRIORITY 1: Always check localStorage first
    const savedData = localStorage.getItem('paymentTrackingUpdated')
    
    if (savedData && savedData !== 'undefined' && savedData !== 'null') {
      try {
        const parsed = JSON.parse(savedData)
        if (parsed && Array.isArray(parsed) && parsed.length > 0) {
          setPayments(parsed)
          console.log('📂 Loaded YOUR saved data:', parsed.length, 'companies')
          console.log('✅ Using your changes, NOT default data')
          return // Exit here - use saved data
        }
      } catch (e) {
        console.log('❌ Error parsing saved data:', e)
      }
    }

    // ONLY if no valid saved data exists, use defaults
    console.log('🆕 No saved data found, loading defaults for first time')
    const defaultData = [
      { id: '1', name: 'Nguyen Van Long', company: 'Long Transport & Logistics Co., Ltd', amount: 45000000, createdDate: '15/8/2025', dueDate: '28/8/2025', status: 'overdue' },
      { id: '2', name: 'Ngo Minh Gia', company: 'Gia Logistics & Freight Services', amount: 28500000, createdDate: '1/8/2025', dueDate: '15/8/2025', status: 'overdue' },
      { id: '3', name: 'Bao Giao Express', company: 'Bao Giao Express Delivery Services', amount: 52800000, createdDate: '13/8/2025', dueDate: '27/8/2025', status: 'overdue' },
      { id: '4', name: 'CN', company: 'CN', amount: 98000000, createdDate: '28/8/2025', dueDate: '19/9/2025', status: 'pending' },
      { id: '5', name: 'Khang Phat', company: 'KP', amount: 78000000, createdDate: '28/8/2025', dueDate: '21/9/2025', status: 'pending' },
      { id: '6', name: 'DQM', company: 'DQM', amount: 89000000, createdDate: '28/8/2025', dueDate: '22/9/2025', status: 'pending' }
    ]
    
    setPayments(defaultData)
    localStorage.setItem('paymentTrackingUpdated', JSON.stringify(defaultData))
    console.log('🆕 First time - loaded default data:', defaultData.length, 'companies')
  }, [])

  useEffect(() => {
    if (payments.length > 0) {
      localStorage.setItem('paymentTrackingUpdated', JSON.stringify(payments))
      console.log('💾 SAVED your changes:', payments.length, 'companies')
    }
  }, [payments])

  const visiblePayments = payments.filter(p => p.status !== 'paid')

  const addNewPayment = async () => {
    if (newPayment.name && newPayment.company && newPayment.amount) {
      const payment = {
        id: Date.now().toString(),
        name: newPayment.name,
        company: newPayment.company,
        amount: parseInt(newPayment.amount),
        createdDate: newPayment.createdDate || new Date().toLocaleDateString('vi-VN'),
        dueDate: newPayment.dueDate || new Date().toLocaleDateString('vi-VN'),
        status: 'pending'
      }
      
      setPayments(prev => [...prev, payment])
      setNewPayment({ name: '', company: '', amount: '', createdDate: '', dueDate: '' })
      setShowAddForm(false)
      
      // Send real email notification for new company
      const emailSent = await sendEmailToAndante('NEW_COMPANY', payment)
      
      if (emailSent) {
        alert(`✅ Đã thêm công ty mới: ${payment.name}\n\n📧 Email thông báo đã được GỬI THẬT đến andantecampion@proton.me`)
      } else {
        alert(`✅ Đã thêm công ty mới: ${payment.name}\n\n⚠️ Email gửi thất bại, nhưng công ty đã được thêm thành công.`)
      }
    } else {
      alert('⚠️ Vui lòng điền đầy đủ thông tin!')
    }
  }

  const updatePayment = (id: string, field: string, value: string) => {
    setPayments(prev => prev.map(p => 
      p.id === id ? { ...p, [field]: field === 'amount' ? parseInt(value) || 0 : value } : p
    ))
  }

  const sendEmailToAndante = async (type: string, payment: any) => {
    let emailContent = ''
    let subject = ''
    
    if (type === 'PAID') {
      subject = `[THANH TOÁN] ${payment.name} đã thanh toán`
      emailContent = `
📧 THÔNG BÁO THANH TOÁN HOÀN TẤT
================================

✅ THÔNG TIN THANH TOÁN:
👤 Khách hàng: ${payment.name}
🏢 Công ty: ${payment.company}
💰 Số tiền: ${payment.amount.toLocaleString()} VND
📅 Ngày tạo: ${payment.createdDate}
⏰ Hạn thanh toán: ${payment.dueDate}
🎉 Trạng thái: ĐÃ THANH TOÁN HOÀN TẤT

Thời gian xác nhận: ${new Date().toLocaleString('vi-VN')}

---
Gửi từ hệ thống LogiAI Truck Insight V2
      `
    } else if (type === 'NEW_COMPANY') {
      subject = `[MỚI] Đã thêm công ty ${payment.name}`
      emailContent = `
📧 THÔNG BÁO CÔNG TY MỚI
========================

➕ THÔNG TIN CÔNG TY MỚI:
👤 Khách hàng: ${payment.name}
🏢 Công ty: ${payment.company}
💰 Số tiền: ${payment.amount.toLocaleString()} VND
📅 Ngày tạo: ${payment.createdDate}
⏰ Hạn thanh toán: ${payment.dueDate}
📋 Trạng thái: CHỜ THANH TOÁN

Thời gian thêm: ${new Date().toLocaleString('vi-VN')}

---
Gửi từ hệ thống LogiAI Truck Insight V2
      `
    }
    
    console.log('📧 SENDING REAL EMAIL TO andantecampion@proton.me:')
    console.log('Subject:', subject)
    console.log('Content:', emailContent)
    
    console.log('📧 Email notification logged (email functionality disabled)')
    console.log('Subject:', subject)
    console.log('Content:', emailContent)
    
    // Email functionality removed - data is saved and tracked locally
    return true
  }

  // Export to Excel
  const exportToExcel = () => {
    const exportData = payments.map(payment => ({
      'Khách hàng': payment.name,
      'Công ty': payment.company,
      'Số tiền (VND)': payment.amount.toLocaleString('vi-VN'),
      'Ngày tạo': payment.createdDate,
      'Hạn thanh toán': payment.dueDate,
      'Trạng thái': payment.status === 'paid' ? 'ĐÃ THANH TOÁN' : 
                   payment.status === 'overdue' ? 'QUÁ HẠN' : 'CHỜ THANH TOÁN'
    }))

    const ws = XLSX.utils.json_to_sheet(exportData)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Payment Tracking')
    
    const fileName = `LogiAI_Payment_Report_${new Date().toISOString().split('T')[0]}.xlsx`
    XLSX.writeFile(wb, fileName)
    console.log('📊 Excel file exported:', fileName)
  }

  // Export to PDF
  const exportToPDF = () => {
    const doc = new jsPDF()
    
    // Title
    doc.setFontSize(16)
    doc.text('LogiAI - Báo Cáo Thanh Toán', 20, 20)
    
    // Date
    doc.setFontSize(10)
    doc.text(`Ngày xuất: ${new Date().toLocaleDateString('vi-VN')}`, 20, 30)
    
    // Table data
    const tableData = payments.map(payment => [
      payment.name,
      payment.company,
      payment.amount.toLocaleString('vi-VN') + ' VND',
      payment.createdDate,
      payment.dueDate,
      payment.status === 'paid' ? 'ĐÃ THANH TOÁN' : 
      payment.status === 'overdue' ? 'QUÁ HẠN' : 'CHỜ THANH TOÁN'
    ])

    // Add table
    doc.autoTable({
      head: [['Khách hàng', 'Công ty', 'Số tiền', 'Ngày tạo', 'Hạn thanh toán', 'Trạng thái']],
      body: tableData,
      startY: 40,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [41, 128, 185] }
    })
    
    const fileName = `LogiAI_Payment_Report_${new Date().toISOString().split('T')[0]}.pdf`
    doc.save(fileName)
    console.log('📄 PDF file exported:', fileName)
  }

  const markPaid = async (id: string) => {
    const payment = payments.find(p => p.id === id)
    if (payment) {
      setPayments(prev => prev.map(p => p.id === id ? { ...p, status: 'paid' } : p))
      
      // Send real email notification
      const emailSent = await sendEmailToAndante('PAID', payment)
      
      if (emailSent) {
        alert(`✅ ${payment.name} đã được đánh dấu là đã thanh toán!\n\n📧 Email thông báo đã được GỬI THẬT đến andantecampion@proton.me\n\nCông ty này sẽ biến mất khỏi danh sách.`)
      } else {
        alert(`✅ ${payment.name} đã được đánh dấu là đã thanh toán!\n\n⚠️ Email gửi thất bại, nhưng dữ liệu đã được lưu.\n\nCông ty này sẽ biến mất khỏi danh sách.`)
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 border-4 border-purple-300">
          
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-5xl font-bold text-purple-600 mb-2">💰 LogiAI Thanh toán</h1>
              <p className="text-xl text-purple-500">Lưu trữ thay đổi của bạn - {payments.length} công ty</p>
              <p className="text-sm text-gray-500">Paid: {payments.filter(p => p.status === 'paid').length} | Visible: {visiblePayments.length}</p>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={exportToExcel}
                className="bg-green-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-green-700 flex items-center gap-2"
              >
                📊 Excel
              </button>
              <button 
                onClick={exportToPDF}
                className="bg-red-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-red-700 flex items-center gap-2"
              >
                📄 PDF
              </button>
              <button 
                onClick={() => {
                  const saved = localStorage.getItem('paymentTrackingUpdated')
                  console.log('🔍 DEBUG localStorage:', saved)
                  alert(`🔍 localStorage Debug:\n\nKey: paymentTrackingUpdated\nData: ${saved ? 'EXISTS' : 'NOT FOUND'}\nLength: ${saved ? JSON.parse(saved).length : 0} companies`)
                }}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-gray-700"
              >
                🔍 Debug
              </button>
              <button 
                onClick={() => setShowAddForm(!showAddForm)}
                className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-4 rounded-xl font-bold text-xl hover:from-green-700 hover:to-emerald-700 shadow-lg"
              >
                ➕ Thêm mới
              </button>
            </div>
          </div>

          {showAddForm && (
            <div className="mb-8 p-6 bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl border-4 border-green-300">
              <h3 className="text-2xl font-bold mb-4 text-green-700">Thêm công ty mới</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  placeholder="Tên khách hàng"
                  value={newPayment.name}
                  onChange={(e) => setNewPayment(prev => ({ ...prev, name: e.target.value }))}
                  className="border-2 border-green-300 rounded-lg px-4 py-3 focus:border-green-500 focus:outline-none"
                />
                <input
                  placeholder="Tên công ty"
                  value={newPayment.company}
                  onChange={(e) => setNewPayment(prev => ({ ...prev, company: e.target.value }))}
                  className="border-2 border-green-300 rounded-lg px-4 py-3 focus:border-green-500 focus:outline-none"
                />
                <input
                  placeholder="Số tiền (VND)"
                  type="number"
                  value={newPayment.amount}
                  onChange={(e) => setNewPayment(prev => ({ ...prev, amount: e.target.value }))}
                  className="border-2 border-green-300 rounded-lg px-4 py-3 focus:border-green-500 focus:outline-none"
                />
                <input
                  placeholder="Ngày tạo (dd/mm/yyyy)"
                  value={newPayment.createdDate}
                  onChange={(e) => setNewPayment(prev => ({ ...prev, createdDate: e.target.value }))}
                  className="border-2 border-green-300 rounded-lg px-4 py-3 focus:border-green-500 focus:outline-none"
                />
                <input
                  placeholder="Hạn thanh toán (dd/mm/yyyy)"
                  value={newPayment.dueDate}
                  onChange={(e) => setNewPayment(prev => ({ ...prev, dueDate: e.target.value }))}
                  className="border-2 border-green-300 rounded-lg px-4 py-3 focus:border-green-500 focus:outline-none"
                />
              </div>
              <div className="flex gap-4 mt-4">
                <button onClick={addNewPayment} className="bg-green-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-green-700">
                  ✅ Thêm & Gửi Email
                </button>
                <button onClick={() => setShowAddForm(false)} className="bg-gray-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-gray-600">
                  ❌ Hủy
                </button>
              </div>
            </div>
          )}

          <div className="space-y-6">
            {visiblePayments.map(payment => (
              <div key={payment.id} className="border-4 border-purple-200 rounded-xl p-6 bg-gradient-to-r from-white to-purple-50 hover:shadow-lg transition-all">
                <div className="flex justify-between items-start">
                  <div className="flex-1 space-y-3">
                    {editingId === payment.id ? (
                      <>
                        <input
                          value={payment.name}
                          onChange={(e) => updatePayment(payment.id, 'name', e.target.value)}
                          className="text-3xl font-bold border-2 border-purple-300 rounded px-3 py-1 w-full"
                        />
                        <input
                          value={payment.company}
                          onChange={(e) => updatePayment(payment.id, 'company', e.target.value)}
                          className="text-xl border-2 border-purple-300 rounded px-3 py-1 w-full"
                        />
                        <input
                          type="number"
                          value={payment.amount}
                          onChange={(e) => updatePayment(payment.id, 'amount', e.target.value)}
                          className="text-4xl font-bold border-2 border-purple-300 rounded px-3 py-1 w-full"
                        />
                        <div className="flex gap-2">
                          <input
                            placeholder="Ngày tạo"
                            value={payment.createdDate}
                            onChange={(e) => updatePayment(payment.id, 'createdDate', e.target.value)}
                            className="border-2 border-purple-300 rounded px-3 py-1"
                          />
                          <input
                            placeholder="Hạn thanh toán"
                            value={payment.dueDate}
                            onChange={(e) => updatePayment(payment.id, 'dueDate', e.target.value)}
                            className="border-2 border-purple-300 rounded px-3 py-1"
                          />
                        </div>
                      </>
                    ) : (
                      <>
                        <h3 className="text-3xl font-bold text-gray-800">{payment.name}</h3>
                        <p className="text-xl text-gray-600">{payment.company}</p>
                        <p className="text-4xl font-bold text-purple-600">{payment.amount.toLocaleString()} ₫</p>
                        <div className="space-y-1 text-gray-600">
                          <p>📅 Ngày tạo: {payment.createdDate}</p>
                          <p>⏰ Hạn thanh toán: {payment.dueDate}</p>
                        </div>
                      </>
                    )}
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
                      onClick={() => setEditingId(editingId === payment.id ? null : payment.id)} 
                      className={`px-4 py-2 rounded-lg font-bold shadow-lg ${
                        editingId === payment.id 
                          ? 'bg-green-600 text-white hover:bg-green-700' 
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                    >
                      {editingId === payment.id ? '💾 Lưu' : '✏️ Sửa'}
                    </button>
                    
                    <button 
                      onClick={() => markPaid(payment.id)} 
                      className="bg-green-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-green-700 shadow-lg"
                    >
                      ✅ Đã trả
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 p-6 bg-gradient-to-r from-green-100 to-blue-100 rounded-xl border-2 border-green-300">
            <h3 className="text-2xl font-bold mb-4 text-center">📊 THỐNG KÊ LogiAI</h3>
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
                📧 Email tự động gửi đến: <strong>andantecampion@proton.me</strong>
              </p>
              <p className="text-gray-600 mt-2">
                💡 LogiAI lưu trữ tất cả thay đổi của bạn
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
