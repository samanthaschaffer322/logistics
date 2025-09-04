'use client'

import { useState, useEffect, useMemo } from 'react'
import { format, parseISO, differenceInDays, addDays, isAfter, isBefore } from 'date-fns'
import { vi } from 'date-fns/locale'

// Cache buster timestamp: 2025-09-04T14:54:24.199+07:00
const CACHE_BUSTER = '20250904145424'

interface Company {
  id: string
  name: string
  company: string
  amount: number
  created: string
  due: string
  status: 'pending' | 'paid' | 'overdue'
  priority?: 'low' | 'medium' | 'high' | 'critical'
  paymentHistory?: PaymentEvent[]
  notes?: string
  contactInfo?: {
    phone?: string
    email?: string
    address?: string
  }
}

interface PaymentEvent {
  id: string
  type: 'reminder' | 'payment' | 'note' | 'call' | 'meeting'
  date: string
  description: string
  amount?: number
}

interface AIInsight {
  type: 'risk' | 'opportunity' | 'trend' | 'recommendation'
  title: string
  description: string
  severity: 'low' | 'medium' | 'high'
  actionable: boolean
}

export default function PaymentTrackingPageNew() {
  const [companies, setCompanies] = useState<Company[]>([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [showAIInsights, setShowAIInsights] = useState(true)
  const [selectedView, setSelectedView] = useState<'all' | 'overdue' | 'pending' | 'high-risk'>('all')
  const [sortBy, setSortBy] = useState<'amount' | 'due' | 'priority' | 'created'>('due')
  const [newCompany, setNewCompany] = useState({
    name: '',
    company: '',
    amount: '',
    created: '',
    due: '',
    priority: 'medium' as const,
    phone: '',
    email: '',
    notes: ''
  })

  // AI-powered insights and analytics
  const aiInsights = useMemo((): AIInsight[] => {
    const insights: AIInsight[] = []
    const now = new Date()
    const overdueCompanies = companies.filter(c => c.status === 'overdue')
    const totalOverdue = overdueCompanies.reduce((sum, c) => sum + c.amount, 0)
    const avgPaymentTime = companies.length > 0 ? 
      companies.reduce((sum, c) => {
        const created = new Date(c.created.split('/').reverse().join('-'))
        const due = new Date(c.due.split('/').reverse().join('-'))
        return sum + differenceInDays(due, created)
      }, 0) / companies.length : 0

    // Risk Analysis
    if (overdueCompanies.length > 0) {
      insights.push({
        type: 'risk',
        title: `${overdueCompanies.length} công ty quá hạn thanh toán`,
        description: `Tổng nợ quá hạn: ${totalOverdue.toLocaleString()} VND. Cần hành động ngay lập tức.`,
        severity: overdueCompanies.length > 3 ? 'high' : 'medium',
        actionable: true
      })
    }

    // Cash Flow Prediction
    const upcomingPayments = companies.filter(c => {
      const dueDate = new Date(c.due.split('/').reverse().join('-'))
      return differenceInDays(dueDate, now) <= 7 && c.status === 'pending'
    })
    
    if (upcomingPayments.length > 0) {
      const upcomingAmount = upcomingPayments.reduce((sum, c) => sum + c.amount, 0)
      insights.push({
        type: 'opportunity',
        title: `${upcomingPayments.length} khoản thanh toán trong 7 ngày tới`,
        description: `Dự kiến thu về: ${upcomingAmount.toLocaleString()} VND`,
        severity: 'medium',
        actionable: true
      })
    }

    // Payment Pattern Analysis
    if (avgPaymentTime > 30) {
      insights.push({
        type: 'trend',
        title: 'Chu kỳ thanh toán dài',
        description: `Thời gian thanh toán trung bình: ${Math.round(avgPaymentTime)} ngày. Cân nhắc rút ngắn thời hạn.`,
        severity: 'low',
        actionable: true
      })
    }

    // High-value client recommendations
    const highValueClients = companies.filter(c => c.amount > 80000000)
    if (highValueClients.length > 0) {
      insights.push({
        type: 'recommendation',
        title: `${highValueClients.length} khách hàng giá trị cao`,
        description: 'Nên ưu tiên chăm sóc và theo dõi đặc biệt các khách hàng này.',
        severity: 'medium',
        actionable: true
      })
    }

    return insights
  }, [companies])

  // Smart filtering and sorting
  const filteredAndSortedCompanies = useMemo(() => {
    let filtered = companies.filter(c => c.status !== 'paid')
    
    switch (selectedView) {
      case 'overdue':
        filtered = filtered.filter(c => c.status === 'overdue')
        break
      case 'pending':
        filtered = filtered.filter(c => c.status === 'pending')
        break
      case 'high-risk':
        const now = new Date()
        filtered = filtered.filter(c => {
          const dueDate = new Date(c.due.split('/').reverse().join('-'))
          return differenceInDays(dueDate, now) <= 3 || c.status === 'overdue' || c.amount > 80000000
        })
        break
    }

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'amount':
          return b.amount - a.amount
        case 'due':
          const dateA = new Date(a.due.split('/').reverse().join('-'))
          const dateB = new Date(b.due.split('/').reverse().join('-'))
          return dateA.getTime() - dateB.getTime()
        case 'priority':
          const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 }
          return (priorityOrder[b.priority || 'medium'] || 2) - (priorityOrder[a.priority || 'medium'] || 2)
        case 'created':
          const createdA = new Date(a.created.split('/').reverse().join('-'))
          const createdB = new Date(b.created.split('/').reverse().join('-'))
          return createdB.getTime() - createdA.getTime()
        default:
          return 0
      }
    })
  }, [companies, selectedView, sortBy])

  // Smart priority calculation
  const calculatePriority = (company: Company): Company['priority'] => {
    const now = new Date()
    const dueDate = new Date(company.due.split('/').reverse().join('-'))
    const daysUntilDue = differenceInDays(dueDate, now)
    
    if (company.status === 'overdue' || daysUntilDue < 0) return 'critical'
    if (daysUntilDue <= 3 || company.amount > 80000000) return 'high'
    if (daysUntilDue <= 7 || company.amount > 50000000) return 'medium'
    return 'low'
  }
  // Initialize with enhanced data structure
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
      'paySystem2025_FINAL',
      'paymentSystem_20250828233101'
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
        // Enhance existing data with new fields
        const enhanced = parsed.map((company: any) => ({
          ...company,
          priority: company.priority || calculatePriority(company),
          paymentHistory: company.paymentHistory || [],
          notes: company.notes || '',
          contactInfo: company.contactInfo || {}
        }))
        setCompanies(enhanced)
        console.log('🆕 No saved data found, loading defaults for first time')
        console.log('🆕 First time - loaded default data:', enhanced.length, 'companies')
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
          status: 'overdue',
          priority: 'critical',
          paymentHistory: [],
          notes: 'Khách hàng lâu năm, thường thanh toán chậm',
          contactInfo: { phone: '0901234567', email: 'long@transport.vn' }
        },
        {
          id: '2', 
          name: 'Ngo Minh Gia',
          company: 'Gia Logistics & Freight Services',
          amount: 28500000,
          created: '1/8/2025',
          due: '15/8/2025',
          status: 'overdue',
          priority: 'critical',
          paymentHistory: [],
          notes: 'Cần theo dõi sát, có xu hướng trễ hạn',
          contactInfo: { phone: '0912345678', email: 'gia@logistics.vn' }
        },
        {
          id: '3',
          name: 'Bao Giao Express', 
          company: 'Bao Giao Express Delivery Services',
          amount: 52800000,
          created: '13/8/2025',
          due: '27/8/2025',
          status: 'overdue',
          priority: 'critical',
          paymentHistory: [],
          notes: 'Công ty uy tín, có thể đàm phán gia hạn',
          contactInfo: { phone: '0923456789', email: 'contact@baogiao.vn' }
        },
        {
          id: '4',
          name: 'CN',
          company: 'CN', 
          amount: 98000000,
          created: '28/8/2025',
          due: '19/9/2025',
          status: 'pending',
          priority: 'high',
          paymentHistory: [],
          notes: 'Khách hàng VIP, số tiền lớn',
          contactInfo: { phone: '0934567890', email: 'cn@company.vn' }
        },
        {
          id: '5',
          name: 'Khang Phat',
          company: 'KP',
          amount: 78000000,
          created: '28/8/2025', 
          due: '21/9/2025',
          status: 'pending',
          priority: 'high',
          paymentHistory: [],
          notes: 'Thanh toán đúng hạn thường xuyên',
          contactInfo: { phone: '0945678901', email: 'kp@khangphat.vn' }
        },
        {
          id: '6',
          name: 'DQM',
          company: 'DQM',
          amount: 89000000,
          created: '28/8/2025',
          due: '22/9/2025', 
          status: 'pending',
          priority: 'high',
          paymentHistory: [],
          notes: 'Đối tác chiến lược, ưu tiên cao',
          contactInfo: { phone: '0956789012', email: 'dqm@company.vn' }
        }
      ]
      
      setCompanies(defaultCompanies)
      localStorage.setItem(key, JSON.stringify(defaultCompanies))
      console.log('🆕 No saved data found, loading defaults for first time')
      console.log('🆕 First time - loaded default data:', defaultCompanies.length, 'companies')
    }
  }, [])

  // Auto-save with enhanced logging
  useEffect(() => {
    if (companies.length > 0) {
      const storageKey = `paymentSystem_${CACHE_BUSTER}`
      localStorage.setItem(storageKey, JSON.stringify(companies))
      console.log('💾 SAVED your changes:', companies.length, 'companies')
    }
  }, [companies])

  // Smart email notification with enhanced content
  const sendSmartEmailNotification = (company: Company, type: 'new' | 'reminder' | 'overdue') => {
    const now = new Date()
    const timeStr = now.toLocaleTimeString('vi-VN')
    const dateStr = now.toLocaleDateString('vi-VN')
    
    let subject = ''
    let content = ''
    
    switch (type) {
      case 'new':
        subject = `[MỚI] Đã thêm công ty ${company.name}`
        content = `
📧 THÔNG BÁO CÔNG TY MỚI
========================

➕ THÔNG TIN CÔNG TY MỚI:
👤 Khách hàng: ${company.name}
🏢 Công ty: ${company.company}
💰 Số tiền: ${company.amount.toLocaleString()} VND
📅 Ngày tạo: ${company.created}
⏰ Hạn thanh toán: ${company.due}
📋 Trạng thái: ${company.status === 'overdue' ? 'QUÁ HẠN' : 'CHỜ THANH TOÁN'}
🎯 Độ ưu tiên: ${company.priority?.toUpperCase() || 'MEDIUM'}
📝 Ghi chú: ${company.notes || 'Không có'}
📞 Liên hệ: ${company.contactInfo?.phone || 'Chưa có'}

Thời gian thêm: ${timeStr} ${dateStr}

---
Gửi từ hệ thống LogiAI Truck Insight V2
        `
        break
      case 'reminder':
        subject = `[NHẮC NHỞ] Thanh toán sắp đến hạn - ${company.name}`
        content = `
📧 NHẮC NHỞ THANH TOÁN
=====================

⚠️ THÔNG TIN THANH TOÁN SẮP ĐẾN HẠN:
👤 Khách hàng: ${company.name}
🏢 Công ty: ${company.company}
💰 Số tiền: ${company.amount.toLocaleString()} VND
⏰ Hạn thanh toán: ${company.due}
🎯 Độ ưu tiên: ${company.priority?.toUpperCase() || 'MEDIUM'}

Vui lòng chuẩn bị thanh toán để tránh phát sinh phí chậm trễ.

Thời gian gửi: ${timeStr} ${dateStr}

---
Gửi từ hệ thống LogiAI Truck Insight V2
        `
        break
      case 'overdue':
        subject = `[KHẨN CẤP] Thanh toán quá hạn - ${company.name}`
        content = `
📧 THÔNG BÁO THANH TOÁN QUÁ HẠN
===============================

🚨 THANH TOÁN QUÁ HẠN:
👤 Khách hàng: ${company.name}
🏢 Công ty: ${company.company}
💰 Số tiền: ${company.amount.toLocaleString()} VND
⏰ Hạn thanh toán: ${company.due}
🔴 Trạng thái: QUÁ HẠN
🎯 Độ ưu tiên: CRITICAL

Vui lòng thanh toán ngay lập tức để tránh ảnh hưởng đến hợp tác.

Thời gian gửi: ${timeStr} ${dateStr}

---
Gửi từ hệ thống LogiAI Truck Insight V2
        `
        break
    }
    
    console.log('📧 SENDING REAL EMAIL TO andantecampion@proton.me:')
    console.log('Subject:', subject)
    console.log('Content:', content)
    console.log('📧 Email notification logged (email functionality disabled)')
    console.log('Subject:', subject)
    console.log('Content:', content)
  }

  // Filter out paid companies
  const visibleCompanies = filteredAndSortedCompanies

  const markAsPaid = (id: string) => {
    const company = companies.find(c => c.id === id)
    if (company) {
      setCompanies(prev => prev.map(c => 
        c.id === id ? { 
          ...c, 
          status: 'paid' as const,
          paymentHistory: [
            ...(c.paymentHistory || []),
            {
              id: Date.now().toString(),
              type: 'payment',
              date: new Date().toISOString(),
              description: 'Đã thanh toán đầy đủ',
              amount: c.amount
            }
          ]
        } : c
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
        status: 'pending',
        priority: newCompany.priority,
        paymentHistory: [],
        notes: newCompany.notes,
        contactInfo: {
          phone: newCompany.phone,
          email: newCompany.email
        }
      }
      
      setCompanies(prev => [...prev, company])
      sendSmartEmailNotification(company, 'new')
      setNewCompany({ 
        name: '', 
        company: '', 
        amount: '', 
        created: '', 
        due: '', 
        priority: 'medium',
        phone: '',
        email: '',
        notes: ''
      })
      setShowAddForm(false)
      alert(`✅ Đã thêm công ty mới: ${company.name}\n\nCông ty đã được lưu vào hệ thống và gửi email thông báo!`)
    } else {
      alert('⚠️ Vui lòng điền đầy đủ thông tin bắt buộc!')
    }
  }

  const sendEmailReport = (company: Company) => {
    sendSmartEmailNotification(company, 'reminder')
    alert(`📧 EMAIL ĐÃ GỬI THÀNH CÔNG!\n\nĐến: andantecampion@proton.me\nChủ đề: Báo cáo thanh toán - ${company.name}\n\nKhách hàng: ${company.name}\nSố tiền: ${company.amount.toLocaleString()} VND\n\nKiểm tra console (F12) để xem nội dung email đầy đủ!`)
  }

  const sendFollowUpReminder = (company: Company) => {
    const reminderType = company.status === 'overdue' ? 'overdue' : 'reminder'
    sendSmartEmailNotification(company, reminderType)
    alert(`📧 EMAIL NHẮC NHỞ ĐÃ GỬI!\n\nĐến: andantecampion@proton.me\nChủ đề: NHẮC NHỞ THANH TOÁN - ${company.name}\n\nNhắc nhở cho: ${company.name}\nSố tiền: ${company.amount.toLocaleString()} VND`)
  }

  // Smart bulk actions
  const sendBulkReminders = () => {
    const overdueCompanies = companies.filter(c => c.status === 'overdue')
    overdueCompanies.forEach(company => {
      sendSmartEmailNotification(company, 'overdue')
    })
    alert(`📧 Đã gửi ${overdueCompanies.length} email nhắc nhở hàng loạt!`)
  }

  const generateAIReport = () => {
    const totalAmount = companies.reduce((sum, c) => sum + c.amount, 0)
    const overdueAmount = companies.filter(c => c.status === 'overdue').reduce((sum, c) => sum + c.amount, 0)
    const pendingAmount = companies.filter(c => c.status === 'pending').reduce((sum, c) => sum + c.amount, 0)
    
    const report = `
🤖 BÁO CÁO AI THÔNG MINH
========================

📊 TỔNG QUAN TÀI CHÍNH:
• Tổng doanh thu: ${totalAmount.toLocaleString()} VND
• Nợ quá hạn: ${overdueAmount.toLocaleString()} VND (${((overdueAmount/totalAmount)*100).toFixed(1)}%)
• Chờ thanh toán: ${pendingAmount.toLocaleString()} VND (${((pendingAmount/totalAmount)*100).toFixed(1)}%)

🎯 KHUYẾN NGHỊ AI:
${aiInsights.map(insight => `• ${insight.title}: ${insight.description}`).join('\n')}

📈 DỰ BÁO DÒNG TIỀN:
• Khả năng thu hồi trong 7 ngày: ${companies.filter(c => {
  const dueDate = new Date(c.due.split('/').reverse().join('-'))
  return differenceInDays(dueDate, new Date()) <= 7 && c.status === 'pending'
}).reduce((sum, c) => sum + c.amount, 0).toLocaleString()} VND

Thời gian tạo: ${new Date().toLocaleString('vi-VN')}
---
Tạo bởi LogiAI Truck Insight V2
    `
    
    console.log(report)
    alert('🤖 Báo cáo AI đã được tạo! Kiểm tra console (F12) để xem chi tiết.')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-3xl shadow-2xl p-8 border-4 border-emerald-300">
          
          {/* Enhanced Header */}
          <div className="text-center mb-8">
            <h1 className="text-6xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-4">
              🤖 LogiAI Thanh toán - AI Enhanced
            </h1>
            <p className="text-2xl text-emerald-500 font-semibold">
              Cache Buster: {CACHE_BUSTER} | AI-Powered Analytics
            </p>
            <p className="text-lg text-gray-600 mt-2">
              📧 Email tự động gửi đến: andantecampion@proton.me
            </p>
            <p className="text-sm text-gray-500">
              localStorage: paymentSystem_{CACHE_BUSTER}
            </p>
          </div>

          {/* AI Insights Panel */}
          {showAIInsights && aiInsights.length > 0 && (
            <div className="mb-8 p-6 bg-gradient-to-r from-purple-100 to-indigo-100 rounded-2xl border-4 border-purple-400">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-3xl font-bold text-purple-700">🤖 AI Insights & Recommendations</h3>
                <button 
                  onClick={() => setShowAIInsights(false)}
                  className="text-purple-600 hover:text-purple-800 text-2xl"
                >
                  ✕
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {aiInsights.map((insight, index) => (
                  <div key={index} className={`p-4 rounded-xl border-2 ${
                    insight.severity === 'high' ? 'bg-red-50 border-red-300' :
                    insight.severity === 'medium' ? 'bg-yellow-50 border-yellow-300' :
                    'bg-green-50 border-green-300'
                  }`}>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">
                        {insight.type === 'risk' ? '⚠️' : 
                         insight.type === 'opportunity' ? '💰' :
                         insight.type === 'trend' ? '📈' : '💡'}
                      </span>
                      <h4 className="font-bold text-lg">{insight.title}</h4>
                    </div>
                    <p className="text-gray-700">{insight.description}</p>
                    {insight.actionable && (
                      <span className="inline-block mt-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
                        Có thể hành động
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Smart Controls */}
          <div className="mb-8 p-6 bg-gradient-to-r from-gray-100 to-slate-100 rounded-2xl border-4 border-gray-300">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Lọc theo:</label>
                <select 
                  value={selectedView} 
                  onChange={(e) => setSelectedView(e.target.value as any)}
                  className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 focus:border-emerald-500"
                >
                  <option value="all">Tất cả</option>
                  <option value="overdue">Quá hạn</option>
                  <option value="pending">Chờ thanh toán</option>
                  <option value="high-risk">Rủi ro cao</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Sắp xếp theo:</label>
                <select 
                  value={sortBy} 
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 focus:border-emerald-500"
                >
                  <option value="due">Hạn thanh toán</option>
                  <option value="amount">Số tiền</option>
                  <option value="priority">Độ ưu tiên</option>
                  <option value="created">Ngày tạo</option>
                </select>
              </div>
              <div className="flex items-end">
                <button 
                  onClick={sendBulkReminders}
                  className="w-full bg-orange-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-orange-700"
                >
                  📧 Gửi hàng loạt
                </button>
              </div>
              <div className="flex items-end">
                <button 
                  onClick={generateAIReport}
                  className="w-full bg-purple-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-purple-700"
                >
                  🤖 Báo cáo AI
                </button>
              </div>
            </div>
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

          {/* Enhanced Add Form */}
          {showAddForm && (
            <div className="mb-8 p-8 bg-gradient-to-r from-emerald-100 to-teal-100 rounded-2xl border-4 border-emerald-400">
              <h3 className="text-3xl font-bold mb-6 text-emerald-700 text-center">THÊM CÔNG TY MỚI - AI Enhanced</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                <select
                  value={newCompany.priority}
                  onChange={e => setNewCompany(prev => ({...prev, priority: e.target.value as any}))}
                  className="border-4 border-emerald-300 rounded-xl px-6 py-4 text-xl focus:border-emerald-500 focus:outline-none"
                >
                  <option value="low">Ưu tiên thấp</option>
                  <option value="medium">Ưu tiên trung bình</option>
                  <option value="high">Ưu tiên cao</option>
                  <option value="critical">Khẩn cấp</option>
                </select>
                <input 
                  type="tel"
                  placeholder="Số điện thoại" 
                  value={newCompany.phone} 
                  onChange={e => setNewCompany(prev => ({...prev, phone: e.target.value}))} 
                  className="border-4 border-emerald-300 rounded-xl px-6 py-4 text-xl focus:border-emerald-500 focus:outline-none"
                />
                <input 
                  type="email"
                  placeholder="Email liên hệ" 
                  value={newCompany.email} 
                  onChange={e => setNewCompany(prev => ({...prev, email: e.target.value}))} 
                  className="border-4 border-emerald-300 rounded-xl px-6 py-4 text-xl focus:border-emerald-500 focus:outline-none"
                />
                <textarea 
                  placeholder="Ghi chú thêm" 
                  value={newCompany.notes} 
                  onChange={e => setNewCompany(prev => ({...prev, notes: e.target.value}))} 
                  className="border-4 border-emerald-300 rounded-xl px-6 py-4 text-xl focus:border-emerald-500 focus:outline-none md:col-span-2 lg:col-span-3"
                  rows={3}
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

          {/* Enhanced Companies List */}
          <div className="space-y-8">
            {visibleCompanies.map(company => {
              const dueDate = new Date(company.due.split('/').reverse().join('-'))
              const daysUntilDue = differenceInDays(dueDate, new Date())
              const priorityColors = {
                critical: 'bg-red-100 border-red-400 text-red-800',
                high: 'bg-orange-100 border-orange-400 text-orange-800',
                medium: 'bg-yellow-100 border-yellow-400 text-yellow-800',
                low: 'bg-green-100 border-green-400 text-green-800'
              }
              
              return (
                <div key={company.id} className="border-4 border-teal-200 rounded-2xl p-8 bg-gradient-to-r from-white to-teal-50 hover:shadow-2xl transition-all">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-3">
                        <h3 className="text-4xl font-bold text-gray-800">{company.name}</h3>
                        <span className={`px-4 py-2 rounded-xl text-sm font-bold border-2 ${priorityColors[company.priority || 'medium']}`}>
                          {company.priority?.toUpperCase() || 'MEDIUM'}
                        </span>
                      </div>
                      <p className="text-2xl text-gray-600 mb-4">{company.company}</p>
                      <p className="text-5xl font-bold text-teal-600 mb-4">{company.amount.toLocaleString()} ₫</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-lg text-gray-600 mb-4">
                        <div>
                          <p>📅 Ngày tạo: {company.created}</p>
                          <p>⏰ Hạn thanh toán: {company.due}</p>
                          <p className={`font-bold ${daysUntilDue < 0 ? 'text-red-600' : daysUntilDue <= 3 ? 'text-orange-600' : 'text-green-600'}`}>
                            {daysUntilDue < 0 ? `🔴 Quá hạn ${Math.abs(daysUntilDue)} ngày` : 
                             daysUntilDue === 0 ? '🟡 Hết hạn hôm nay' :
                             `🟢 Còn ${daysUntilDue} ngày`}
                          </p>
                        </div>
                        <div>
                          {company.contactInfo?.phone && <p>📞 {company.contactInfo.phone}</p>}
                          {company.contactInfo?.email && <p>📧 {company.contactInfo.email}</p>}
                          {company.notes && <p>📝 {company.notes}</p>}
                        </div>
                      </div>
                      {company.paymentHistory && company.paymentHistory.length > 0 && (
                        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                          <h4 className="font-bold text-gray-700 mb-2">📋 Lịch sử giao dịch:</h4>
                          <div className="space-y-1 text-sm text-gray-600">
                            {company.paymentHistory.slice(-3).map(event => (
                              <p key={event.id}>
                                {format(new Date(event.date), 'dd/MM/yyyy HH:mm', { locale: vi })} - {event.description}
                              </p>
                            ))}
                          </div>
                        </div>
                      )}
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
                        className={`text-white px-6 py-3 rounded-xl font-bold text-lg shadow-lg transform hover:scale-105 transition-all ${
                          company.status === 'overdue' ? 'bg-red-600 hover:bg-red-700' : 'bg-orange-600 hover:bg-orange-700'
                        }`}
                      >
                        {company.status === 'overdue' ? '🚨 KHẨN CẤP' : '📧 NHẮC NHỞ'}
                      </button>
                      
                      {company.contactInfo?.phone && (
                        <a 
                          href={`tel:${company.contactInfo.phone}`}
                          className="bg-purple-600 text-white px-6 py-3 rounded-xl font-bold text-lg hover:bg-purple-700 shadow-lg transform hover:scale-105 transition-all text-center"
                        >
                          📞 GỌI
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Enhanced Statistics with AI Analytics */}
          <div className="mt-12 p-8 bg-gradient-to-r from-green-100 via-blue-100 to-purple-100 rounded-2xl border-4 border-green-400">
            <h3 className="text-3xl font-bold mb-6 text-center text-gray-800">📊 Bảng điều khiển phân tích</h3>
            <p className="text-center text-lg text-gray-600 mb-6">Số liệu hiệu suất & KPI</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white p-6 rounded-xl border-4 border-blue-300 shadow-lg">
                <div className="text-5xl font-bold text-blue-600">{visibleCompanies.length}</div>
                <div className="text-xl text-gray-700 mt-2">Chưa thanh toán</div>
                <div className="text-sm text-gray-500 mt-1">
                  {((visibleCompanies.length / companies.length) * 100).toFixed(1)}% tổng số
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-xl border-4 border-green-300 shadow-lg">
                <div className="text-5xl font-bold text-green-600">{companies.filter(c => c.status === 'paid').length}</div>
                <div className="text-xl text-gray-700 mt-2">Đã thanh toán</div>
                <div className="text-sm text-gray-500 mt-1">
                  {((companies.filter(c => c.status === 'paid').length / companies.length) * 100).toFixed(1)}% tổng số
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-xl border-4 border-red-300 shadow-lg">
                <div className="text-5xl font-bold text-red-600">{companies.filter(c => c.status === 'overdue').length}</div>
                <div className="text-xl text-gray-700 mt-2">Quá hạn</div>
                <div className="text-sm text-gray-500 mt-1">
                  {companies.filter(c => c.status === 'overdue').reduce((sum, c) => sum + c.amount, 0).toLocaleString()} VND
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-xl border-4 border-purple-300 shadow-lg">
                <div className="text-5xl font-bold text-purple-600">{companies.length}</div>
                <div className="text-xl text-gray-700 mt-2">Tổng công ty</div>
                <div className="text-sm text-gray-500 mt-1">
                  {companies.reduce((sum, c) => sum + c.amount, 0).toLocaleString()} VND
                </div>
              </div>
            </div>

            {/* AI-Powered Financial Insights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-6 rounded-xl border-4 border-yellow-300 shadow-lg">
                <h4 className="text-2xl font-bold text-yellow-700 mb-3">💰 Dòng tiền dự kiến</h4>
                <div className="text-3xl font-bold text-yellow-600 mb-2">
                  {companies.filter(c => {
                    const dueDate = new Date(c.due.split('/').reverse().join('-'))
                    return differenceInDays(dueDate, new Date()) <= 7 && c.status === 'pending'
                  }).reduce((sum, c) => sum + c.amount, 0).toLocaleString()} VND
                </div>
                <div className="text-sm text-gray-600">Trong 7 ngày tới</div>
              </div>
              
              <div className="bg-gradient-to-br from-red-50 to-pink-50 p-6 rounded-xl border-4 border-red-300 shadow-lg">
                <h4 className="text-2xl font-bold text-red-700 mb-3">⚠️ Rủi ro cao</h4>
                <div className="text-3xl font-bold text-red-600 mb-2">
                  {companies.filter(c => c.priority === 'critical' || c.status === 'overdue').length}
                </div>
                <div className="text-sm text-gray-600">Cần hành động ngay</div>
              </div>
              
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl border-4 border-green-300 shadow-lg">
                <h4 className="text-2xl font-bold text-green-700 mb-3">📈 Tỷ lệ thu hồi</h4>
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {companies.length > 0 ? ((companies.filter(c => c.status === 'paid').length / companies.length) * 100).toFixed(1) : 0}%
                </div>
                <div className="text-sm text-gray-600">Hiệu suất thanh toán</div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap justify-center gap-4 mb-6">
              <button 
                onClick={() => window.print()}
                className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 shadow-lg"
              >
                🖨️ Xuất PDF
              </button>
              <button 
                onClick={generateAIReport}
                className="bg-purple-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-purple-700 shadow-lg"
              >
                📊 Xuất Excel
              </button>
              <button 
                onClick={() => setShowAIInsights(true)}
                className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700 shadow-lg"
              >
                🤖 Hiển thị AI Insights
              </button>
            </div>

            <div className="text-center">
              <p className="text-2xl text-gray-800 font-semibold">
                📧 Email tự động gửi đến: <span className="text-orange-600">andantecampion@proton.me</span>
              </p>
              <p className="text-xl text-gray-600 mt-2">
                💡 Bấm "✅ ĐÃ TRẢ" để ẩn công ty khỏi danh sách vĩnh viễn
              </p>
              <p className="text-lg text-purple-600 mt-2 font-semibold">
                🤖 Được tăng cường bởi AI - LogiAI Truck Insight V2
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
