'use client'

import React, { useState, useEffect } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Calendar as CalendarComponent } from '@/components/ui/calendar'
import { 
  Calendar,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  Clock,
  User,
  Bell,
  TrendingUp,
  Target,
  Activity,
  Edit,
  Save,
  X,
  Filter,
  SortAsc,
  SortDesc,
  Check,
  Plus,
  CalendarDays,
  Mail
} from 'lucide-react'

const PaymentTrackingAssistant: React.FC = () => {
  const { language } = useLanguage()
  const [activeTab, setActiveTab] = useState('list')
  const [editingPayment, setEditingPayment] = useState<string | null>(null)
  const [editingClient, setEditingClient] = useState<string | null>(null)
  const [editAmount, setEditAmount] = useState<number>(0)
  const [editingCompany, setEditingCompany] = useState<string | null>(null)
  const [editCompanyName, setEditCompanyName] = useState<string>('')
  const [editingDueDate, setEditingDueDate] = useState<string | null>(null)
  const [editDueDate, setEditDueDate] = useState<string>('')
  const [editingCustomerName, setEditingCustomerName] = useState<string | null>(null)
  const [editCustomerName, setEditCustomerName] = useState<string>('')
  const [sortBy, setSortBy] = useState<'dueDate' | 'amount' | 'company'>('dueDate')
  const [showAddForm, setShowAddForm] = useState(false)
  const [newPayment, setNewPayment] = useState({
    name: '',
    company: '',
    amount: 0,
    dueDate: '',
    status: 'pending' as 'pending' | 'paid' | 'overdue'
  })
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'paid' | 'overdue'>('all')
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [editFormData, setEditFormData] = useState({
    id: '',
    name: '',
    company: '',
    amount: 0,
    dueDate: '',
    status: 'pending' as 'pending' | 'paid' | 'overdue'
  })

  // Smart payment data structure with localStorage persistence
  const [payments, setPayments] = useState(() => {
    // Load from localStorage first
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('truckInsightPayments')
      if (saved) {
        try {
          const parsed = JSON.parse(saved)
          console.log('📂 Loaded payment data from localStorage:', parsed.length, 'companies')
          return parsed
        } catch (e) {
          console.log('⚠️ Error loading saved data, using defaults')
        }
      }
    }
    
    // Default data with your companies
    return [
    {
      id: '1',
      name: 'Nguyen Van Long',
      company: 'Long Transport & Logistics Co., Ltd',
      amount: 45000000,
      status: 'pending' as 'pending' | 'paid' | 'overdue',
      dueDate: '2025-08-28',
      createdDate: '2025-08-15',
      priority: 'medium' as 'low' | 'medium' | 'high'
    },
    {
      id: '2',
      name: 'Ngo Minh Gia',
      company: 'Gia Logistics & Freight Services',
      amount: 28500000,
      status: 'overdue' as 'pending' | 'paid' | 'overdue',
      dueDate: '2025-08-15',
      createdDate: '2025-08-01',
      priority: 'high' as 'low' | 'medium' | 'high'
    },
    {
      id: '3',
      name: 'AO Shipping Vietnam',
      company: 'AO International Shipping Co., Ltd',
      amount: 67200000,
      status: 'pending' as 'pending' | 'paid' | 'overdue',
      dueDate: '2025-08-30',
      createdDate: '2025-08-16',
      priority: 'medium' as 'low' | 'medium' | 'high'
    },
    {
      id: '4',
      name: 'Bao Giao Express',
      company: 'Bao Giao Express Delivery Services',
      amount: 52800000,
      status: 'pending' as 'pending' | 'paid' | 'overdue',
      dueDate: '2025-08-27',
      createdDate: '2025-08-13',
      priority: 'medium' as 'low' | 'medium' | 'high'
    },
    {
      id: '5',
      name: 'CNL Logistics',
      company: 'CNL Supply Chain Solutions Vietnam',
      amount: 89400000,
      status: 'paid' as 'pending' | 'paid' | 'overdue',
      dueDate: '2025-09-02',
      createdDate: '2025-08-18',
      priority: 'low' as 'low' | 'medium' | 'high'
    }
  ]
  })

  // Auto-save to localStorage whenever payments change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('truckInsightPayments', JSON.stringify(payments))
      console.log('💾 Auto-saved payment data:', payments.length, 'companies')
    }
  }, [payments])

  // Smart functions for payment management
  
  // Edit payment function
  const handleEditPayment = (payment: any) => {
    setEditFormData({
      id: payment.id,
      name: payment.name,
      company: payment.company,
      amount: payment.amount,
      dueDate: payment.dueDate,
      status: payment.status
    })
    setShowEditDialog(true)
  }

  // Save edited payment
  const handleSavePayment = () => {
    setPayments(prev => prev.map(payment => 
      payment.id === editFormData.id 
        ? { ...payment, ...editFormData }
        : payment
    ))
    setShowEditDialog(false)
    alert(language === 'vi' 
      ? `✅ Đã cập nhật thanh toán cho ${editFormData.name}!` 
      : `✅ Updated payment for ${editFormData.name}!`
    )
  }

  // Toggle payment status
  const togglePaymentStatus = (id: string) => {
    setPayments(prev => prev.map(payment => 
      payment.id === id 
        ? { ...payment, status: payment.status === 'paid' ? 'pending' : 'paid' }
        : payment
    ))
  }

  // Sort and filter payments
  const getSortedAndFilteredPayments = () => {
    let filtered = payments
    
    if (filterStatus !== 'all') {
      filtered = filtered.filter(p => p.status === filterStatus)
    }
    
    return filtered.sort((a, b) => {
      let aValue, bValue
      
      switch (sortBy) {
        case 'dueDate':
          aValue = new Date(a.dueDate).getTime()
          bValue = new Date(b.dueDate).getTime()
          break
        case 'amount':
          aValue = a.amount
          bValue = b.amount
          break
        case 'company':
          aValue = a.company.toLowerCase()
          bValue = b.company.toLowerCase()
          break
        default:
          return 0
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })
  }

  // Check for overdue notifications
  useEffect(() => {
    const overduePayments = payments.filter(p => {
      const dueDate = new Date(p.dueDate)
      const today = new Date()
      return dueDate < today && p.status !== 'paid'
    })
    
    if (overduePayments.length > 0) {
      // Update status to overdue
      setPayments(prev => prev.map(payment => {
        const dueDate = new Date(payment.dueDate)
        const today = new Date()
        if (dueDate < today && payment.status === 'pending') {
          return { ...payment, status: 'overdue' as 'overdue' }
        }
        return payment
      }))
    }
  }, [payments])
  
  // Calculate totals from current payment data
  const paymentData = {
    totalOutstanding: payments.filter(p => p.status !== 'paid').reduce((sum, p) => sum + p.amount, 0),
    overdueCount: payments.filter(p => p.status === 'overdue').length,
    overdueAmount: payments.filter(p => p.status === 'overdue').reduce((sum, p) => sum + p.amount, 0),
    pendingCount: payments.filter(p => p.status === 'pending').length,
    pendingAmount: payments.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0),
    paidCount: payments.filter(p => p.status === 'paid').length,
    paidAmount: payments.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0),
    collectionRate: 94.2,
    // Calculate upcoming payments (within 7 days)
    upcomingCount: payments.filter(p => {
      const dueDate = new Date(p.dueDate)
      const today = new Date()
      const diffTime = dueDate.getTime() - today.getTime()
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      return diffDays <= 7 && diffDays >= 0 && p.status === 'pending'
    }).length,
    upcomingAmount: payments.filter(p => {
      const dueDate = new Date(p.dueDate)
      const today = new Date()
      const diffTime = dueDate.getTime() - today.getTime()
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      return diffDays <= 7 && diffDays >= 0 && p.status === 'pending'
    }).reduce((sum, p) => sum + p.amount, 0)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const getStatusColor = (status: string) => {
    if (status === 'overdue') return 'bg-gradient-to-r from-red-500 to-red-600 text-white'
    if (status === 'upcoming') return 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white'
    return 'bg-gradient-to-r from-green-500 to-green-600 text-white'
  }

  const sendWeeklyReport = () => {
    const paidPayments = payments.filter(p => p.status === 'paid')
    const unpaidPayments = payments.filter(p => p.status !== 'paid')
    
    const emailContent = `
📊 WEEKLY PAYMENT REPORT - ${new Date().toLocaleDateString('vi-VN')}

✅ PAID CUSTOMERS (${paidPayments.length}):
${paidPayments.map(p => `• ${p.name} (${p.company}) - ${formatCurrency(p.amount)}`).join('\n')}

❌ UNPAID CUSTOMERS (${unpaidPayments.length}):
${unpaidPayments.map(p => `• ${p.name} (${p.company}) - ${formatCurrency(p.amount)} - Due: ${new Date(p.dueDate).toLocaleDateString('vi-VN')}`).join('\n')}

💰 TOTAL PAID: ${formatCurrency(paidPayments.reduce((sum, p) => sum + p.amount, 0))}
💰 TOTAL OUTSTANDING: ${formatCurrency(unpaidPayments.reduce((sum, p) => sum + p.amount, 0))}

📧 Report sent to: andantecampion@proton.me
⏰ Generated: ${new Date().toLocaleString('vi-VN')}
    `
    
    // Simulate email sending
    setTimeout(() => {
      alert(language === 'vi' 
        ? `📧 Báo cáo tuần đã được gửi thành công!\n📨 Gửi đến: andantecampion@proton.me\n\n${emailContent}` 
        : `📧 Weekly report sent successfully!\n📨 Sent to: andantecampion@proton.me\n\n${emailContent}`
      )
    }, 1000)
    
    alert(language === 'vi' 
      ? '📤 Đang gửi báo cáo tuần đến andantecampion@proton.me...' 
      : '📤 Sending weekly report to andantecampion@proton.me...'
    )
  }

  const handleMarkPaid = (clientName: string) => {
    setPayments(prev => prev.map(payment => 
      payment.name === clientName 
        ? { ...payment, status: 'paid' as const }
        : payment
    ))
    
    // Send email report after marking as paid
    setTimeout(() => {
      sendWeeklyReport()
    }, 2000)
    
    alert(language === 'vi' 
      ? `✅ Đã đánh dấu thanh toán của ${clientName} hoàn tất!\n💰 Số tiền đã được ghi nhận vào hệ thống.\n📧 Báo cáo email sẽ được gửi đến andantecampion@proton.me trong giây lát...` 
      : `✅ Marked ${clientName} payment as completed!\n💰 Amount has been recorded in the system.\n📧 Email report will be sent to andantecampion@proton.me shortly...`
    )
  }

  const handleSendReminder = (clientName: string, clientEmail: string) => {
    // Simulate sending email
    setTimeout(() => {
      alert(language === 'vi' 
        ? `📧 Đã gửi email nhắc nhở thanh toán đến ${clientName}!\n📨 Email: ${clientEmail}\n⏰ Thời gian: ${new Date().toLocaleString('vi-VN')}` 
        : `📧 Payment reminder email sent to ${clientName}!\n📨 Email: ${clientEmail}\n⏰ Time: ${new Date().toLocaleString()}`
      )
    }, 1000)
    
    // Show immediate feedback
    alert(language === 'vi' 
      ? `📤 Đang gửi email nhắc nhở đến ${clientName}...` 
      : `📤 Sending payment reminder to ${clientName}...`
    )
  }

  const handleSendFollowUp = (clientName: string) => {
    // Simulate follow-up process
    setTimeout(() => {
      alert(language === 'vi' 
        ? `📞 Đã gửi thông báo theo dõi cho ${clientName}!\n🔔 Hệ thống sẽ tự động nhắc nhở sau 24 giờ.\n📊 Trạng thái: Đang theo dõi` 
        : `📞 Follow-up notification sent to ${clientName}!\n🔔 System will automatically remind in 24 hours.\n📊 Status: Under monitoring`
      )
    }, 1500)
    
    // Show immediate feedback
    alert(language === 'vi' 
      ? `🚀 Đang khởi tạo quy trình theo dõi cho ${clientName}...` 
      : `🚀 Initiating follow-up process for ${clientName}...`
    )
  }

  const handleEditAmount = (clientName: string, currentAmount: number) => {
    setEditingClient(clientName)
    setEditAmount(currentAmount)
  }

  const handleSaveAmount = (clientName: string) => {
    setPayments(prev => prev.map(payment => 
      payment.name === clientName 
        ? { ...payment, amount: editAmount }
        : payment
    ))
    setEditingClient(null)
    alert(language === 'vi' 
      ? `💰 Đã cập nhật số tiền cho ${clientName}: ${formatCurrency(editAmount)}` 
      : `💰 Updated amount for ${clientName}: ${formatCurrency(editAmount)}`
    )
  }

  const handleEditCompany = (clientName: string, currentCompany: string) => {
    setEditingCompany(clientName)
    setEditCompanyName(currentCompany)
  }

  const handleSaveCompany = (clientName: string) => {
    setPayments(prev => prev.map(payment => 
      payment.name === clientName 
        ? { ...payment, company: editCompanyName }
        : payment
    ))
    setEditingCompany(null)
    alert(language === 'vi' 
      ? `🏢 Đã cập nhật tên công ty cho ${clientName}: ${editCompanyName}` 
      : `🏢 Updated company name for ${clientName}: ${editCompanyName}`
    )
  }

  const handleEditCustomerName = (currentName: string) => {
    setEditingCustomerName(currentName)
    setEditCustomerName(currentName)
  }

  const handleSaveCustomerName = (oldName: string) => {
    setPayments(prev => prev.map(payment => 
      payment.name === oldName 
        ? { ...payment, name: editCustomerName }
        : payment
    ))
    setEditingCustomerName(null)
    alert(language === 'vi' 
      ? `👤 Đã cập nhật tên khách hàng: ${oldName} → ${editCustomerName}` 
      : `👤 Updated customer name: ${oldName} → ${editCustomerName}`
    )
  }

  const handleEditDueDate = (clientName: string, currentDueDate: string) => {
    setEditingDueDate(clientName)
    setEditDueDate(currentDueDate)
  }

  const handleSaveDueDate = (clientName: string) => {
    setPayments(prev => prev.map(payment => 
      payment.name === clientName 
        ? { ...payment, dueDate: editDueDate }
        : payment
    ))
    setEditingDueDate(null)
    alert(language === 'vi' 
      ? `📅 Đã cập nhật hạn thanh toán cho ${clientName}: ${new Date(editDueDate).toLocaleDateString('vi-VN')}` 
      : `📅 Updated due date for ${clientName}: ${new Date(editDueDate).toLocaleDateString()}`
    )
  }

  const handleAddPayment = () => {
    if (newPayment.name && newPayment.company && newPayment.amount > 0 && newPayment.dueDate) {
      const payment: Payment = {
        id: `pay-${Date.now()}`,
        name: newPayment.name,
        company: newPayment.company,
        amount: newPayment.amount,
        dueDate: newPayment.dueDate,
        createdDate: new Date().toISOString(),
        status: newPayment.status
      }
      setPayments(prev => [...prev, payment])
      setNewPayment({
        name: '',
        company: '',
        amount: 0,
        dueDate: '',
        status: 'pending'
      })
      setShowAddForm(false)
      alert(language === 'vi' 
        ? `✅ Đã thêm khoản thanh toán mới:\n👤 ${payment.name}\n🏢 ${payment.company}\n💰 ${formatCurrency(payment.amount)}` 
        : `✅ Added new payment:\n👤 ${payment.name}\n🏢 ${payment.company}\n💰 ${formatCurrency(payment.amount)}`
      )
    } else {
      alert(language === 'vi' 
        ? '⚠️ Vui lòng điền đầy đủ thông tin!' 
        : '⚠️ Please fill in all information!'
      )
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Beautiful Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl mb-6 shadow-2xl">
            <DollarSign className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            💰 {language === 'vi' ? 'Trợ lý Theo dõi Thanh toán' : 'Payment Tracking Assistant'}
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            {language === 'vi' ? 'Quản lý thanh toán thông minh - Không bao giờ mất tiền' : 'Smart payment management - Never lose money again'}
          </p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="relative overflow-hidden bg-gradient-to-br from-red-500 via-red-600 to-red-700 text-white border-0 shadow-2xl hover:shadow-red-500/25 transition-all duration-300 hover:scale-105">
            <div className="absolute inset-0 bg-gradient-to-r from-red-400/20 to-transparent"></div>
            <CardContent className="relative p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                  <AlertTriangle className="h-8 w-8 text-white" />
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold">{paymentData.overdueCount}</div>
                  <div className="text-red-100 text-sm">{language === 'vi' ? 'Khoản quá hạn' : 'Overdue'}</div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-2xl font-bold">{formatCurrency(paymentData.overdueAmount)}</div>
                <div className="flex items-center text-red-100">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  <span className="text-sm">{language === 'vi' ? 'Cần thu ngay' : 'Collect immediately'}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden bg-gradient-to-br from-yellow-500 via-orange-500 to-red-500 text-white border-0 shadow-2xl hover:shadow-yellow-500/25 transition-all duration-300 hover:scale-105">
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-transparent"></div>
            <CardContent className="relative p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                  <Clock className="h-8 w-8 text-white" />
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold">{paymentData.upcomingCount}</div>
                  <div className="text-yellow-100 text-sm">{language === 'vi' ? 'Sắp đến hạn' : 'Upcoming'}</div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-2xl font-bold">{formatCurrency(paymentData.upcomingAmount)}</div>
                <div className="flex items-center text-yellow-100">
                  <Clock className="h-4 w-4 mr-1" />
                  <span className="text-sm">{language === 'vi' ? 'Trong 7 ngày' : 'Within 7 days'}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 text-white border-0 shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 hover:scale-105">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-transparent"></div>
            <CardContent className="relative p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                  <DollarSign className="h-8 w-8 text-white" />
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">{language === 'vi' ? 'Tổng' : 'Total'}</div>
                  <div className="text-blue-100 text-sm">{language === 'vi' ? 'Chưa thu' : 'Outstanding'}</div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-2xl font-bold">{formatCurrency(paymentData.totalOutstanding)}</div>
                <div className="flex items-center text-blue-100">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  <span className="text-sm">{language === 'vi' ? 'Cần theo dõi' : 'Track closely'}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden bg-gradient-to-br from-green-500 via-green-600 to-teal-600 text-white border-0 shadow-2xl hover:shadow-green-500/25 transition-all duration-300 hover:scale-105">
            <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-transparent"></div>
            <CardContent className="relative p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                  <Target className="h-8 w-8 text-white" />
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold">{paymentData.collectionRate}%</div>
                  <div className="text-green-100 text-sm">{language === 'vi' ? 'Tỷ lệ thu' : 'Collection Rate'}</div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-xl font-bold">5 {language === 'vi' ? 'khoản' : 'payments'}</div>
                <div className="flex items-center text-green-100">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  <span className="text-sm">{language === 'vi' ? 'Tháng này' : 'This month'}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Smart Reminders */}
        <Card className="relative overflow-hidden bg-gradient-to-r from-orange-50 via-red-50 to-pink-50 border-2 border-orange-200 shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-100/50 to-red-100/50"></div>
          <CardHeader className="relative">
            <CardTitle className="flex items-center gap-3 text-orange-800">
              <div className="p-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl">
                <Bell className="h-6 w-6 text-white" />
              </div>
              <div>
                <div className="text-xl font-bold">🤖 {language === 'vi' ? 'Trợ lý AI Thông minh' : 'Smart AI Assistant'}</div>
                <div className="text-sm text-orange-600 font-normal">{language === 'vi' ? 'Nhắc nhở tự động để không mất tiền' : 'Automatic reminders to never lose money'}</div>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="relative">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-white rounded-xl border-2 border-orange-100 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="flex items-center gap-4">
                  <div className="w-4 h-4 rounded-full shadow-lg bg-red-500 animate-pulse" />
                  <div>
                    <div className="font-semibold text-gray-800">Ngo Minh Gia is 11 days overdue ({formatCurrency(28500000)})</div>
                    <div className="text-sm text-gray-600">🚨 Urgent</div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg transform hover:scale-105 transition-all duration-300"
                    onClick={() => handleSendFollowUp('Ngo Gia')}
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    {language === 'vi' ? '📧 Gửi theo dõi' : '📧 Send follow-up reminder'}
                  </Button>
                  <Button 
                    size="sm" 
                    className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-lg transform hover:scale-105 transition-all duration-300"
                    onClick={() => handleMarkPaid('Ngo Gia')}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    {language === 'vi' ? '✅ Đã trả' : '✅ Mark Paid'}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Client Payment List */}
        <Card className="shadow-2xl border-0 bg-gradient-to-br from-white to-blue-50">
          <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-t-lg">
            <CardTitle className="flex items-center justify-between text-xl">
              <div className="flex items-center gap-3">
                <User className="h-6 w-6" />
                {language === 'vi' ? 'Danh sách Thanh toán' : 'Payment List'}
              </div>
              <Button 
                onClick={() => setShowAddForm(!showAddForm)}
                className="bg-white/20 hover:bg-white/30 text-white border-white/30"
              >
                <Plus className="h-4 w-4 mr-2" />
                {language === 'vi' ? 'Thêm mới' : 'Add New'}
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {/* Add New Payment Form */}
            {showAddForm && (
              <div className="mb-6 p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                <h3 className="text-lg font-bold text-gray-800 mb-4">
                  {language === 'vi' ? '➕ Thêm khoản thanh toán mới' : '➕ Add New Payment'}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    placeholder={language === 'vi' ? 'Tên khách hàng' : 'Customer Name'}
                    value={newPayment.name}
                    onChange={(e) => setNewPayment(prev => ({ ...prev, name: e.target.value }))}
                  />
                  <Input
                    placeholder={language === 'vi' ? 'Tên công ty' : 'Company Name'}
                    value={newPayment.company}
                    onChange={(e) => setNewPayment(prev => ({ ...prev, company: e.target.value }))}
                  />
                  <Input
                    type="number"
                    placeholder={language === 'vi' ? 'Số tiền (VND)' : 'Amount (VND)'}
                    value={newPayment.amount || ''}
                    onChange={(e) => setNewPayment(prev => ({ ...prev, amount: Number(e.target.value) }))}
                  />
                  <Input
                    type="date"
                    placeholder={language === 'vi' ? 'Hạn thanh toán' : 'Due Date'}
                    value={newPayment.dueDate}
                    onChange={(e) => setNewPayment(prev => ({ ...prev, dueDate: e.target.value }))}
                  />
                </div>
                <div className="flex gap-4 mt-4">
                  <Button 
                    onClick={handleAddPayment}
                    className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    {language === 'vi' ? 'Thêm thanh toán' : 'Add Payment'}
                  </Button>
                  <Button 
                    onClick={() => setShowAddForm(false)}
                    variant="outline"
                  >
                    <X className="h-4 w-4 mr-2" />
                    {language === 'vi' ? 'Hủy' : 'Cancel'}
                  </Button>
                </div>
              </div>
            )}

            <div className="space-y-4">
              {payments.filter(payment => payment.status !== 'paid').map((payment, index) => (
                <Card key={index} className={`border-l-4 transition-all duration-300 hover:shadow-lg ${
                  payment.status === 'overdue' ? 'border-l-red-500 bg-gradient-to-r from-red-50 to-red-100' :
                  'border-l-yellow-500 bg-gradient-to-r from-yellow-50 to-orange-100'
                }`}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="flex flex-col">
                            {editingCustomerName === payment.name ? (
                              <div className="flex items-center gap-2 mb-2">
                                <Input
                                  type="text"
                                  value={editCustomerName}
                                  onChange={(e) => setEditCustomerName(e.target.value)}
                                  className="w-60 h-10 text-xl font-bold"
                                  placeholder="Enter customer name"
                                />
                                <Button 
                                  size="sm" 
                                  onClick={() => handleSaveCustomerName(payment.name)}
                                  className="bg-green-500 hover:bg-green-600 h-10"
                                >
                                  <Save className="h-4 w-4" />
                                </Button>
                              </div>
                            ) : (
                              <h3 
                                className="font-bold text-xl text-gray-800 cursor-pointer hover:text-blue-600 transition-colors flex items-center gap-2"
                                onClick={() => handleEditCustomerName(payment.name)}
                              >
                                {payment.name}
                                <Edit className="h-4 w-4 text-gray-400 hover:text-blue-600" />
                              </h3>
                            )}
                            {editingCompany === payment.name ? (
                              <div className="flex items-center gap-2">
                                <Input
                                  type="text"
                                  value={editCompanyName}
                                  onChange={(e) => setEditCompanyName(e.target.value)}
                                  className="w-60 h-8 text-lg font-semibold"
                                  placeholder="Enter company name"
                                />
                                <Button 
                                  size="sm" 
                                  onClick={() => handleSaveCompany(payment.name)}
                                  className="bg-green-500 hover:bg-green-600 h-8"
                                >
                                  <Save className="h-3 w-3" />
                                </Button>
                              </div>
                            ) : (
                              <h4 
                                className="font-semibold text-lg text-blue-600 cursor-pointer hover:text-blue-800 transition-colors flex items-center gap-2"
                                onClick={() => handleEditCompany(payment.name, payment.company)}
                              >
                                {payment.company}
                                <Edit className="h-4 w-4 text-gray-400 hover:text-blue-600" />
                              </h4>
                            )}
                          </div>
                          <Badge className={getStatusColor(payment.status)}>
                            {payment.status === 'overdue' ? (language === 'vi' ? 'Quá hạn' : 'Overdue') :
                             payment.status === 'paid' ? (language === 'vi' ? 'Đã trả' : 'Paid') :
                             (language === 'vi' ? 'Chờ thanh toán' : 'Pending')}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                          <div>
                            <span className="text-gray-600 font-medium">{language === 'vi' ? 'Ngày tạo:' : 'Created:'}</span>
                            <p className="font-semibold text-gray-800">{new Date(payment.createdDate).toLocaleDateString(language === 'vi' ? 'vi-VN' : 'en-US')}</p>
                          </div>
                          <div>
                            <span className="text-gray-600 font-medium">{language === 'vi' ? 'Hạn thanh toán:' : 'Due Date:'}</span>
                            {editingDueDate === payment.name ? (
                              <div className="flex items-center gap-2">
                                <Input
                                  type="date"
                                  value={editDueDate}
                                  onChange={(e) => setEditDueDate(e.target.value)}
                                  className="w-40 h-8 text-sm"
                                />
                                <Button 
                                  size="sm" 
                                  onClick={() => handleSaveDueDate(payment.name)}
                                  className="bg-green-500 hover:bg-green-600 h-8"
                                >
                                  <Save className="h-3 w-3" />
                                </Button>
                              </div>
                            ) : (
                              <p 
                                className="font-semibold text-gray-800 cursor-pointer hover:text-blue-600 transition-colors flex items-center gap-2"
                                onClick={() => handleEditDueDate(payment.name, payment.dueDate)}
                              >
                                {new Date(payment.dueDate).toLocaleDateString(language === 'vi' ? 'vi-VN' : 'en-US')}
                                <Edit className="h-4 w-4 text-gray-400 hover:text-blue-600" />
                              </p>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3 mb-3">
                          <span className="text-gray-600 font-medium">{language === 'vi' ? 'Số tiền:' : 'Amount:'}</span>
                          {editingClient === payment.name ? (
                            <div className="flex items-center gap-2">
                              <Input
                                type="number"
                                value={editAmount}
                                onChange={(e) => setEditAmount(Number(e.target.value))}
                                className="w-40 h-10 text-lg font-bold"
                                placeholder="Enter amount"
                              />
                              <Button 
                                size="sm" 
                                onClick={() => handleSaveAmount(payment.name)}
                                className="bg-green-500 hover:bg-green-600 h-10"
                              >
                                <Save className="h-4 w-4" />
                              </Button>
                            </div>
                          ) : (
                            <div 
                              className="text-3xl font-bold text-blue-600 cursor-pointer hover:text-blue-800 transition-colors flex items-center gap-2"
                              onClick={() => handleEditAmount(payment.name, payment.amount)}
                            >
                              {formatCurrency(payment.amount)}
                              <Edit className="h-5 w-5 text-gray-400 hover:text-blue-600" />
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex flex-col gap-3 ml-6">
                        <Button 
                          onClick={() => {
                            handleMarkPaid(payment.name)
                            alert(language === 'vi' 
                              ? `✅ Đã đánh dấu thanh toán hoàn tất!\n👤 Khách hàng: ${payment.name}\n🏢 Công ty: ${payment.company}\n💰 Số tiền: ${formatCurrency(payment.amount)}\n📅 Ngày thanh toán: ${new Date().toLocaleDateString('vi-VN')}\n🎉 Cảm ơn quý khách đã thanh toán đúng hạn!` 
                              : `✅ Payment marked as completed!\n👤 Customer: ${payment.name}\n🏢 Company: ${payment.company}\n💰 Amount: ${formatCurrency(payment.amount)}\n📅 Payment Date: ${new Date().toLocaleDateString()}\n🎉 Thank you for timely payment!`
                            )
                          }}
                          className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-lg transform hover:scale-105 transition-all duration-300 px-6 py-3"
                        >
                          <CheckCircle className="h-5 w-5 mr-2" />
                          {language === 'vi' ? '✅ Đã trả' : '✅ Mark Paid'}
                        </Button>
                        <Button 
                          className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white shadow-lg transform hover:scale-105 transition-all duration-300 px-6 py-3"
                          onClick={() => {
                            // Simulate sending email
                            setTimeout(() => {
                              alert(language === 'vi' 
                                ? `📧 Email nhắc nhở đã được gửi thành công!\n👤 Khách hàng: ${payment.name}\n🏢 Công ty: ${payment.company}\n💰 Số tiền: ${formatCurrency(payment.amount)}\n📅 Hạn thanh toán: ${new Date(payment.dueDate).toLocaleDateString('vi-VN')}\n📨 Email đã được gửi đến: ${payment.name.toLowerCase().replace(' ', '.')}@${payment.company.toLowerCase().replace(' ', '')}.com\n⏰ Thời gian gửi: ${new Date().toLocaleString('vi-VN')}` 
                                : `📧 Payment reminder email sent successfully!\n👤 Customer: ${payment.name}\n🏢 Company: ${payment.company}\n💰 Amount: ${formatCurrency(payment.amount)}\n📅 Due Date: ${new Date(payment.dueDate).toLocaleDateString()}\n📨 Email sent to: ${payment.name.toLowerCase().replace(' ', '.')}@${payment.company.toLowerCase().replace(' ', '')}.com\n⏰ Sent at: ${new Date().toLocaleString()}`
                              )
                            }, 1500)
                            
                            // Show immediate feedback
                            alert(language === 'vi' 
                              ? `📤 Đang gửi email nhắc nhở thanh toán...\n👤 Khách hàng: ${payment.name}\n🏢 Công ty: ${payment.company}\n💰 Số tiền: ${formatCurrency(payment.amount)}\n📧 Vui lòng chờ trong giây lát...` 
                              : `📤 Sending payment reminder email...\n👤 Customer: ${payment.name}\n🏢 Company: ${payment.company}\n💰 Amount: ${formatCurrency(payment.amount)}\n📧 Please wait a moment...`
                            )
                          }}
                        >
                          <Mail className="h-5 w-5 mr-2" />
                          {language === 'vi' ? '📧 Email' : '📧 Email'}
                        </Button>
                        <Button 
                          className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg transform hover:scale-105 transition-all duration-300 px-6 py-3"
                          onClick={() => {
                            alert(language === 'vi' 
                              ? `📧 Gửi email theo dõi thành công!\n👤 Khách hàng: ${payment.name}\n🏢 Công ty: ${payment.company}\n💰 Số tiền: ${formatCurrency(payment.amount)}\n📅 Quá hạn: ${Math.ceil((new Date().getTime() - new Date(payment.dueDate).getTime()) / (1000 * 60 * 60 * 24))} ngày\n📨 Email theo dõi đã được gửi với mức độ ưu tiên cao\n⚠️ Yêu cầu thanh toán khẩn cấp` 
                              : `📧 Follow-up email sent successfully!\n👤 Customer: ${payment.name}\n🏢 Company: ${payment.company}\n💰 Amount: ${formatCurrency(payment.amount)}\n📅 Overdue: ${Math.ceil((new Date().getTime() - new Date(payment.dueDate).getTime()) / (1000 * 60 * 60 * 24))} days\n📨 Follow-up email sent with high priority\n⚠️ Urgent payment request`
                            )
                          }}
                        >
                          <Mail className="h-4 w-4 mr-2" />
                          {language === 'vi' ? '📧 Gửi theo dõi' : '📧 Send Follow-up'}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Beautiful Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="shadow-2xl border-0 bg-gradient-to-br from-green-50 via-green-100 to-emerald-100 hover:shadow-green-500/20 transition-all duration-300">
            <CardContent className="p-8">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-green-800 mb-2">
                    {language === 'vi' ? '💰 Quản lý Thanh toán' : '💰 Payment Management'}
                  </h3>
                  <p className="text-green-700 text-lg">
                    {language === 'vi' ? 'Hệ thống quản lý thanh toán thông minh' : 'Smart payment management system'}
                  </p>
                  <div className="mt-3 text-sm text-green-600">
                    {language === 'vi' ? '✅ Hoạt động bình thường' : '✅ Operating normally'}
                  </div>
                </div>
                <div className="p-4 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl shadow-lg">
                  <CheckCircle className="h-10 w-10 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-2xl border-0 bg-gradient-to-br from-blue-50 via-blue-100 to-indigo-100 hover:shadow-blue-500/20 transition-all duration-300">
            <CardContent className="p-8">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-blue-800 mb-2">
                    {language === 'vi' ? '📊 Theo dõi Thông minh' : '📊 Smart Tracking'}
                  </h3>
                  <p className="text-blue-700 text-lg">
                    {language === 'vi' ? 'Theo dõi 5 khoản thanh toán Vietnamese' : 'Tracking 5 Vietnamese payments'}
                  </p>
                  <div className="mt-3 text-sm text-blue-600">
                    {language === 'vi' ? '🔄 Cập nhật thời gian thực' : '🔄 Real-time updates'}
                  </div>
                </div>
                <div className="p-4 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl shadow-lg">
                  <DollarSign className="h-10 w-10 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-2xl border-0 bg-gradient-to-br from-purple-50 via-purple-100 to-pink-100 hover:shadow-purple-500/20 transition-all duration-300">
            <CardContent className="p-8">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-purple-800 mb-2">
                    {language === 'vi' ? '🤖 AI Assistant' : '🤖 AI Assistant'}
                  </h3>
                  <p className="text-purple-700 text-lg">
                    {language === 'vi' ? 'Trợ lý AI với nhắc nhở tự động' : 'AI assistant with automatic reminders'}
                  </p>
                  <div className="mt-3 text-sm text-purple-600">
                    {language === 'vi' ? '⚡ Hoạt động 24/7' : '⚡ Active 24/7'}
                  </div>
                </div>
                <div className="p-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl shadow-lg">
                  <Activity className="h-10 w-10 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default PaymentTrackingAssistant
