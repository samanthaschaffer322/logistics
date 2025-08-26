'use client'

import React, { useState, useEffect } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { 
  Calendar,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  Clock,
  User,
  Bell,
  TrendingUp,
  FileText,
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  Mail,
  Phone,
  Building,
  CreditCard,
  Target,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react'

interface Payment {
  id: string
  clientName: string
  clientCompany: string
  amount: number
  currency: string
  dueDate: string
  invoiceNumber: string
  status: 'overdue' | 'upcoming' | 'paid' | 'pending'
  description: string
  clientEmail?: string
  clientPhone?: string
  paymentHistory: PaymentHistory[]
  notes: string
  priority: 'low' | 'medium' | 'high'
  recurring?: {
    frequency: 'monthly' | 'quarterly' | 'yearly'
    nextDue: string
  }
}

interface PaymentHistory {
  date: string
  amount: number
  method: string
  notes?: string
}

interface ClientProfile {
  name: string
  company: string
  email: string
  phone: string
  totalOutstanding: number
  paymentPattern: 'on-time' | 'usually-late' | 'high-risk'
  averageDelayDays: number
  lastPaymentDate: string
  totalPaid: number
}

const PaymentTrackingAssistant: React.FC = () => {
  const { t, language } = useLanguage()
  const [activeTab, setActiveTab] = useState('calendar')
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month')
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'overdue' | 'upcoming' | 'paid'>('all')

  // Sample payment data with Vietnamese clients
  const [payments, setPayments] = useState<Payment[]>([
    {
      id: '1',
      clientName: 'Nguyen Long',
      clientCompany: 'Long Transport Co.',
      amount: 2500000,
      currency: 'VND',
      dueDate: '2025-08-28',
      invoiceNumber: 'INV-2025-001',
      status: 'upcoming',
      description: 'Container transport services - August',
      clientEmail: 'nguyen.long@longtransport.vn',
      clientPhone: '+84 901 234 567',
      paymentHistory: [
        { date: '2025-07-30', amount: 2300000, method: 'Bank Transfer' },
        { date: '2025-06-28', amount: 2100000, method: 'Cash' }
      ],
      notes: 'Usually pays on time, reliable client',
      priority: 'medium'
    },
    {
      id: '2',
      clientName: 'Ngo Gia',
      clientCompany: 'Gia Logistics',
      amount: 1800000,
      currency: 'VND',
      dueDate: '2025-08-15',
      invoiceNumber: 'INV-2025-002',
      status: 'overdue',
      description: 'Freight forwarding services',
      clientEmail: 'ngo.gia@gialogistics.vn',
      clientPhone: '+84 902 345 678',
      paymentHistory: [
        { date: '2025-06-30', amount: 2000000, method: 'Bank Transfer' },
        { date: '2025-05-25', amount: 1750000, method: 'Bank Transfer' }
      ],
      notes: 'Usually pays 5-7 days late, but reliable',
      priority: 'high'
    },
    {
      id: '3',
      clientName: 'AO Shipping',
      clientCompany: 'AO Shipping Vietnam',
      amount: 3200000,
      currency: 'VND',
      dueDate: '2025-08-30',
      invoiceNumber: 'INV-2025-003',
      status: 'upcoming',
      description: 'Port handling and customs clearance',
      clientEmail: 'contact@aoshipping.vn',
      clientPhone: '+84 903 456 789',
      paymentHistory: [
        { date: '2025-07-28', amount: 3100000, method: 'Bank Transfer' },
        { date: '2025-06-30', amount: 2900000, method: 'Bank Transfer' }
      ],
      notes: 'Premium client, always pays on time',
      priority: 'low',
      recurring: {
        frequency: 'monthly',
        nextDue: '2025-09-30'
      }
    },
    {
      id: '4',
      clientName: 'Bao Giao',
      clientCompany: 'Bao Giao Express',
      amount: 4000000,
      currency: 'VND',
      dueDate: '2025-08-27',
      invoiceNumber: 'INV-2025-004',
      status: 'upcoming',
      description: 'Last-mile delivery services',
      clientEmail: 'baogiao@express.vn',
      clientPhone: '+84 904 567 890',
      paymentHistory: [
        { date: '2025-07-25', amount: 3800000, method: 'Cash' },
        { date: '2025-06-27', amount: 3600000, method: 'Bank Transfer' }
      ],
      notes: 'Large volume client, negotiate payment terms',
      priority: 'high'
    },
    {
      id: '5',
      clientName: 'CNL',
      clientCompany: 'CNL Logistics Solutions',
      amount: 2700000,
      currency: 'VND',
      dueDate: '2025-09-02',
      invoiceNumber: 'INV-2025-005',
      status: 'upcoming',
      description: 'Warehouse management services',
      clientEmail: 'payments@cnllogistics.vn',
      clientPhone: '+84 905 678 901',
      paymentHistory: [
        { date: '2025-08-01', amount: 2500000, method: 'Bank Transfer' },
        { date: '2025-07-02', amount: 2400000, method: 'Bank Transfer' }
      ],
      notes: 'Corporate client, requires formal invoicing',
      priority: 'medium',
      recurring: {
        frequency: 'monthly',
        nextDue: '2025-10-02'
      }
    }
  ])

  // Calculate summary statistics
  const summaryStats = {
    totalOutstanding: payments.filter(p => p.status !== 'paid').reduce((sum, p) => sum + p.amount, 0),
    overdueCount: payments.filter(p => p.status === 'overdue').length,
    overdueAmount: payments.filter(p => p.status === 'overdue').reduce((sum, p) => sum + p.amount, 0),
    upcomingCount: payments.filter(p => p.status === 'upcoming').length,
    upcomingAmount: payments.filter(p => p.status === 'upcoming').reduce((sum, p) => sum + p.amount, 0),
    paidThisMonth: payments.filter(p => p.status === 'paid' && new Date(p.dueDate).getMonth() === new Date().getMonth()).length
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'overdue': return 'bg-red-100 text-red-800 border-red-200'
      case 'upcoming': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'paid': return 'bg-green-100 text-green-800 border-green-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500'
      case 'medium': return 'bg-yellow-500'
      case 'low': return 'bg-green-500'
      default: return 'bg-gray-500'
    }
  }

  const markAsPaid = (paymentId: string) => {
    setPayments(prev => prev.map(payment => 
      payment.id === paymentId 
        ? { ...payment, status: 'paid' as const }
        : payment
    ))
  }

  const getDaysUntilDue = (dueDate: string) => {
    const today = new Date()
    const due = new Date(dueDate)
    const diffTime = due.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const getSmartReminders = () => {
    const today = new Date()
    const reminders = []

    payments.forEach(payment => {
      const daysUntil = getDaysUntilDue(payment.dueDate)
      
      if (payment.status === 'overdue') {
        reminders.push({
          type: 'overdue',
          message: `${payment.clientName} is ${Math.abs(daysUntil)} days overdue (${formatCurrency(payment.amount)})`,
          priority: 'high',
          action: 'Send follow-up reminder'
        })
      } else if (daysUntil <= 3 && payment.status === 'upcoming') {
        reminders.push({
          type: 'due-soon',
          message: `${payment.clientName} payment due in ${daysUntil} days (${formatCurrency(payment.amount)})`,
          priority: 'medium',
          action: 'Send payment reminder'
        })
      }
    })

    return reminders
  }

  return (
    <div className="space-y-6 p-6 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            💰 {language === 'vi' ? 'Trợ lý Theo dõi Thanh toán' : 'Payment Tracking Assistant'}
          </h1>
          <p className="text-gray-600 mt-1">
            {language === 'vi' 
              ? 'Quản lý thanh toán thông minh - Không bao giờ mất tiền' 
              : 'Smart payment management - Never lose money again'
            }
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700">
            <Plus className="h-4 w-4 mr-2" />
            {language === 'vi' ? 'Thêm Thanh toán' : 'Add Payment'}
          </Button>
        </div>
      </div>

      {/* Smart Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white border-0 shadow-lg hover:shadow-xl transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-100 text-sm font-medium">
                  {language === 'vi' ? 'Quá hạn' : 'Overdue'}
                </p>
                <p className="text-2xl font-bold">{formatCurrency(summaryStats.overdueAmount)}</p>
                <div className="flex items-center mt-2">
                  <AlertTriangle className="h-4 w-4 mr-1" />
                  <span className="text-sm">{summaryStats.overdueCount} {language === 'vi' ? 'khoản' : 'payments'}</span>
                </div>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white border-0 shadow-lg hover:shadow-xl transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-100 text-sm font-medium">
                  {language === 'vi' ? 'Sắp đến hạn' : 'Upcoming'}
                </p>
                <p className="text-2xl font-bold">{formatCurrency(summaryStats.upcomingAmount)}</p>
                <div className="flex items-center mt-2">
                  <Clock className="h-4 w-4 mr-1" />
                  <span className="text-sm">{summaryStats.upcomingCount} {language === 'vi' ? 'khoản' : 'payments'}</span>
                </div>
              </div>
              <Clock className="h-8 w-8 text-yellow-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-lg hover:shadow-xl transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">
                  {language === 'vi' ? 'Tổng chưa thu' : 'Total Outstanding'}
                </p>
                <p className="text-2xl font-bold">{formatCurrency(summaryStats.totalOutstanding)}</p>
                <div className="flex items-center mt-2">
                  <DollarSign className="h-4 w-4 mr-1" />
                  <span className="text-sm">{language === 'vi' ? 'Cần thu' : 'To collect'}</span>
                </div>
              </div>
              <DollarSign className="h-8 w-8 text-blue-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0 shadow-lg hover:shadow-xl transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">
                  {language === 'vi' ? 'Đã thu tháng này' : 'Collected This Month'}
                </p>
                <p className="text-2xl font-bold">{summaryStats.paidThisMonth}</p>
                <div className="flex items-center mt-2">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  <span className="text-sm">{language === 'vi' ? 'khoản' : 'payments'}</span>
                </div>
              </div>
              <CheckCircle className="h-8 w-8 text-green-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Smart Reminders */}
      {getSmartReminders().length > 0 && (
        <Card className="bg-gradient-to-r from-orange-50 to-red-50 border-orange-200 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-800">
              <Bell className="h-5 w-5" />
              🤖 {language === 'vi' ? 'Trợ lý Thông minh' : 'Smart Assistant'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {getSmartReminders().map((reminder, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg border border-orange-200">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${reminder.priority === 'high' ? 'bg-red-500' : 'bg-yellow-500'}`} />
                    <span className="text-gray-800">{reminder.message}</span>
                  </div>
                  <Button size="sm" variant="outline" className="text-orange-700 border-orange-300 hover:bg-orange-100">
                    {reminder.action}
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-white shadow-sm border">
          <TabsTrigger value="calendar" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
            <Calendar className="h-4 w-4 mr-2" />
            {language === 'vi' ? 'Lịch' : 'Calendar'}
          </TabsTrigger>
          <TabsTrigger value="clients" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
            <User className="h-4 w-4 mr-2" />
            {language === 'vi' ? 'Khách hàng' : 'Clients'}
          </TabsTrigger>
          <TabsTrigger value="payments" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
            <CreditCard className="h-4 w-4 mr-2" />
            {language === 'vi' ? 'Thanh toán' : 'Payments'}
          </TabsTrigger>
          <TabsTrigger value="analytics" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
            <BarChart3 className="h-4 w-4 mr-2" />
            {language === 'vi' ? 'Phân tích' : 'Analytics'}
          </TabsTrigger>
        </TabsList>

        {/* Calendar Tab */}
        <TabsContent value="calendar" className="space-y-6">
          <Card className="shadow-lg border-0">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  {language === 'vi' ? 'Lịch Thanh toán' : 'Payment Calendar'}
                </CardTitle>
                <div className="flex items-center gap-2">
                  <select 
                    value={viewMode} 
                    onChange={(e) => setViewMode(e.target.value as 'month' | 'week' | 'day')}
                    className="px-3 py-1 border border-gray-200 rounded-lg bg-white text-sm"
                  >
                    <option value="month">{language === 'vi' ? 'Tháng' : 'Month'}</option>
                    <option value="week">{language === 'vi' ? 'Tuần' : 'Week'}</option>
                    <option value="day">{language === 'vi' ? 'Ngày' : 'Day'}</option>
                  </select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-2 mb-4">
                {['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'].map((day) => (
                  <div key={day} className="text-center font-semibold text-gray-600 p-2">
                    {day}
                  </div>
                ))}
                
                {/* Calendar Days */}
                {Array.from({ length: 35 }, (_, i) => {
                  const date = new Date(2025, 7, i - 5) // August 2025
                  const dayPayments = payments.filter(p => 
                    new Date(p.dueDate).toDateString() === date.toDateString()
                  )
                  
                  return (
                    <div 
                      key={i} 
                      className={`min-h-[80px] p-2 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer ${
                        date.getMonth() !== 7 ? 'bg-gray-100 text-gray-400' : 'bg-white'
                      }`}
                    >
                      <div className="text-sm font-medium mb-1">{date.getDate()}</div>
                      <div className="space-y-1">
                        {dayPayments.map((payment) => (
                          <div 
                            key={payment.id}
                            className={`text-xs p-1 rounded text-white truncate ${
                              payment.status === 'overdue' ? 'bg-red-500' :
                              payment.status === 'upcoming' ? 'bg-yellow-500' :
                              'bg-green-500'
                            }`}
                            title={`${payment.clientName}: ${formatCurrency(payment.amount)}`}
                          >
                            {payment.clientName}
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
              
              {/* Legend */}
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded"></div>
                  <span>{language === 'vi' ? 'Quá hạn' : 'Overdue'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                  <span>{language === 'vi' ? 'Sắp đến hạn' : 'Upcoming'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded"></div>
                  <span>{language === 'vi' ? 'Đã thanh toán' : 'Paid'}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Clients Tab */}
        <TabsContent value="clients" className="space-y-6">
          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-green-600" />
                {language === 'vi' ? 'Hồ sơ Khách hàng' : 'Client Profiles'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from(new Set(payments.map(p => p.clientName))).map((clientName) => {
                  const clientPayments = payments.filter(p => p.clientName === clientName)
                  const totalOutstanding = clientPayments.filter(p => p.status !== 'paid').reduce((sum, p) => sum + p.amount, 0)
                  const overdueCount = clientPayments.filter(p => p.status === 'overdue').length
                  const client = clientPayments[0]
                  
                  return (
                    <Card key={clientName} className="border-2 hover:shadow-lg transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h3 className="font-semibold text-gray-900">{clientName}</h3>
                            <p className="text-sm text-gray-600">{client.clientCompany}</p>
                          </div>
                          <div className={`w-3 h-3 rounded-full ${overdueCount > 0 ? 'bg-red-500' : 'bg-green-500'}`} />
                        </div>
                        
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">{language === 'vi' ? 'Chưa thanh toán:' : 'Outstanding:'}</span>
                            <span className="font-semibold">{formatCurrency(totalOutstanding)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">{language === 'vi' ? 'Số khoản:' : 'Payments:'}</span>
                            <span>{clientPayments.length}</span>
                          </div>
                          {overdueCount > 0 && (
                            <div className="flex justify-between text-red-600">
                              <span>{language === 'vi' ? 'Quá hạn:' : 'Overdue:'}</span>
                              <span>{overdueCount}</span>
                            </div>
                          )}
                        </div>
                        
                        <div className="mt-3 pt-3 border-t border-gray-200">
                          <p className="text-xs text-gray-500">{client.notes}</p>
                        </div>
                        
                        <div className="flex gap-2 mt-3">
                          <Button size="sm" variant="outline" className="flex-1">
                            <Mail className="h-3 w-3 mr-1" />
                            {language === 'vi' ? 'Email' : 'Email'}
                          </Button>
                          <Button size="sm" variant="outline" className="flex-1">
                            <Phone className="h-3 w-3 mr-1" />
                            {language === 'vi' ? 'Gọi' : 'Call'}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payments Tab */}
        <TabsContent value="payments" className="space-y-6">
          <Card className="shadow-lg border-0">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-purple-600" />
                  {language === 'vi' ? 'Danh sách Thanh toán' : 'Payment List'}
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Input
                    placeholder={language === 'vi' ? 'Tìm kiếm...' : 'Search...'}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-64"
                  />
                  <select 
                    value={filterStatus} 
                    onChange={(e) => setFilterStatus(e.target.value as any)}
                    className="px-3 py-2 border border-gray-200 rounded-lg bg-white"
                  >
                    <option value="all">{language === 'vi' ? 'Tất cả' : 'All'}</option>
                    <option value="overdue">{language === 'vi' ? 'Quá hạn' : 'Overdue'}</option>
                    <option value="upcoming">{language === 'vi' ? 'Sắp đến hạn' : 'Upcoming'}</option>
                    <option value="paid">{language === 'vi' ? 'Đã thanh toán' : 'Paid'}</option>
                  </select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {payments
                  .filter(payment => 
                    (filterStatus === 'all' || payment.status === filterStatus) &&
                    (searchQuery === '' || 
                     payment.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                     payment.clientCompany.toLowerCase().includes(searchQuery.toLowerCase())
                    )
                  )
                  .map((payment) => (
                    <Card key={payment.id} className={`border-l-4 ${
                      payment.status === 'overdue' ? 'border-l-red-500 bg-red-50' :
                      payment.status === 'upcoming' ? 'border-l-yellow-500 bg-yellow-50' :
                      'border-l-green-500 bg-green-50'
                    }`}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-semibold text-lg">{payment.clientName}</h3>
                              <Badge className={getStatusColor(payment.status)}>
                                {payment.status === 'overdue' ? (language === 'vi' ? 'Quá hạn' : 'Overdue') :
                                 payment.status === 'upcoming' ? (language === 'vi' ? 'Sắp đến hạn' : 'Upcoming') :
                                 (language === 'vi' ? 'Đã thanh toán' : 'Paid')}
                              </Badge>
                              <div className={`w-2 h-2 rounded-full ${getPriorityColor(payment.priority)}`} />
                            </div>
                            
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                              <div>
                                <span className="text-gray-600">{language === 'vi' ? 'Công ty:' : 'Company:'}</span>
                                <p className="font-medium">{payment.clientCompany}</p>
                              </div>
                              <div>
                                <span className="text-gray-600">{language === 'vi' ? 'Số tiền:' : 'Amount:'}</span>
                                <p className="font-bold text-lg">{formatCurrency(payment.amount)}</p>
                              </div>
                              <div>
                                <span className="text-gray-600">{language === 'vi' ? 'Hạn thanh toán:' : 'Due Date:'}</span>
                                <p className="font-medium">{new Date(payment.dueDate).toLocaleDateString('vi-VN')}</p>
                              </div>
                              <div>
                                <span className="text-gray-600">{language === 'vi' ? 'Số hóa đơn:' : 'Invoice:'}</span>
                                <p className="font-medium">{payment.invoiceNumber}</p>
                              </div>
                            </div>
                            
                            <div className="mt-3">
                              <p className="text-sm text-gray-600">{payment.description}</p>
                              {payment.notes && (
                                <p className="text-xs text-gray-500 mt-1">💡 {payment.notes}</p>
                              )}
                            </div>
                            
                            {payment.status === 'overdue' && (
                              <div className="mt-2 p-2 bg-red-100 border border-red-200 rounded-lg">
                                <p className="text-red-800 text-sm font-medium">
                                  ⚠️ {language === 'vi' ? 'Quá hạn' : 'Overdue by'} {Math.abs(getDaysUntilDue(payment.dueDate))} {language === 'vi' ? 'ngày' : 'days'}
                                </p>
                              </div>
                            )}
                          </div>
                          
                          <div className="flex flex-col gap-2 ml-4">
                            {payment.status !== 'paid' && (
                              <Button 
                                onClick={() => markAsPaid(payment.id)}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                <CheckCircle className="h-4 w-4 mr-2" />
                                {language === 'vi' ? 'Đánh dấu đã thanh toán' : 'Mark as Paid'}
                              </Button>
                            )}
                            <Button variant="outline" size="sm">
                              <Mail className="h-4 w-4 mr-2" />
                              {language === 'vi' ? 'Gửi nhắc nhở' : 'Send Reminder'}
                            </Button>
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4 mr-2" />
                              {language === 'vi' ? 'Chỉnh sửa' : 'Edit'}
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-blue-600" />
                  {language === 'vi' ? 'Xu hướng Thu tiền' : 'Collection Trends'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                    <h3 className="text-2xl font-bold text-blue-600">{formatCurrency(summaryStats.totalOutstanding)}</h3>
                    <p className="text-gray-600">{language === 'vi' ? 'Tổng cần thu' : 'Total Outstanding'}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-red-50 rounded-lg">
                      <h4 className="text-lg font-bold text-red-600">{summaryStats.overdueCount}</h4>
                      <p className="text-sm text-gray-600">{language === 'vi' ? 'Quá hạn' : 'Overdue'}</p>
                    </div>
                    <div className="text-center p-4 bg-yellow-50 rounded-lg">
                      <h4 className="text-lg font-bold text-yellow-600">{summaryStats.upcomingCount}</h4>
                      <p className="text-sm text-gray-600">{language === 'vi' ? 'Sắp đến hạn' : 'Upcoming'}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-green-600" />
                  {language === 'vi' ? 'Hiệu suất Thu tiền' : 'Collection Performance'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
                    <h3 className="text-2xl font-bold text-green-600">
                      {((payments.filter(p => p.status === 'paid').length / payments.length) * 100).toFixed(1)}%
                    </h3>
                    <p className="text-gray-600">{language === 'vi' ? 'Tỷ lệ thu tiền' : 'Collection Rate'}</p>
                  </div>
                  
                  <div className="space-y-3">
                    {Array.from(new Set(payments.map(p => p.clientName))).map((clientName) => {
                      const clientPayments = payments.filter(p => p.clientName === clientName)
                      const paidCount = clientPayments.filter(p => p.status === 'paid').length
                      const rate = (paidCount / clientPayments.length) * 100
                      
                      return (
                        <div key={clientName} className="flex items-center justify-between">
                          <span className="text-sm font-medium">{clientName}</span>
                          <div className="flex items-center gap-2">
                            <div className="w-20 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-green-500 h-2 rounded-full" 
                                style={{ width: `${rate}%` }}
                              />
                            </div>
                            <span className="text-sm text-gray-600">{rate.toFixed(0)}%</span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default PaymentTrackingAssistant
