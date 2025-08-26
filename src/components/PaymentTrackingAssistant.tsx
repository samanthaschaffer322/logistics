'use client'

import React, { useState, useEffect } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, AreaChart, Area, RadialBarChart, RadialBar
} from 'recharts'
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
  PieChart as PieChartIcon,
  Activity,
  Zap,
  Star,
  ArrowUp,
  ArrowDown,
  RefreshCw
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

const PaymentTrackingAssistant: React.FC = () => {
  const { t, language } = useLanguage()
  const [activeTab, setActiveTab] = useState('overview')
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month')
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'overdue' | 'upcoming' | 'paid'>('all')
  const [editingPayment, setEditingPayment] = useState<string | null>(null)
  const [editAmount, setEditAmount] = useState<number>(0)

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
    paidThisMonth: payments.filter(p => p.status === 'paid' && new Date(p.dueDate).getMonth() === new Date().getMonth()).length,
    collectionRate: ((payments.filter(p => p.status === 'paid').length / payments.length) * 100).toFixed(1)
  }

  // Chart data for analytics
  const chartData = [
    { name: 'Jan', collected: 8500000, outstanding: 2100000 },
    { name: 'Feb', collected: 9200000, outstanding: 1800000 },
    { name: 'Mar', collected: 7800000, outstanding: 2400000 },
    { name: 'Apr', collected: 10100000, outstanding: 1600000 },
    { name: 'May', collected: 9800000, outstanding: 1900000 },
    { name: 'Jun', collected: 11200000, outstanding: 1400000 },
  ]

  const clientPerformanceData = payments.map(p => ({
    name: p.clientName,
    amount: p.amount,
    status: p.status,
    daysOverdue: p.status === 'overdue' ? Math.abs(getDaysUntilDue(p.dueDate)) : 0
  }))

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'overdue': return 'bg-gradient-to-r from-red-500 to-red-600 text-white'
      case 'upcoming': return 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white'
      case 'paid': return 'bg-gradient-to-r from-green-500 to-green-600 text-white'
      default: return 'bg-gradient-to-r from-gray-500 to-gray-600 text-white'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500 shadow-red-200'
      case 'medium': return 'bg-yellow-500 shadow-yellow-200'
      case 'low': return 'bg-green-500 shadow-green-200'
      default: return 'bg-gray-500 shadow-gray-200'
    }
  }

  const markAsPaid = (paymentId: string) => {
    setPayments(prev => prev.map(payment => 
      payment.id === paymentId 
        ? { ...payment, status: 'paid' as const }
        : payment
    ))
  }

  const updatePaymentAmount = (paymentId: string, newAmount: number) => {
    setPayments(prev => prev.map(payment => 
      payment.id === paymentId 
        ? { ...payment, amount: newAmount }
        : payment
    ))
    setEditingPayment(null)
  }

  const getDaysUntilDue = (dueDate: string) => {
    const today = new Date()
    const due = new Date(dueDate)
    const diffTime = due.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const getSmartReminders = () => {
    const reminders = []

    payments.forEach(payment => {
      const daysUntil = getDaysUntilDue(payment.dueDate)
      
      if (payment.status === 'overdue') {
        reminders.push({
          type: 'overdue',
          message: `${payment.clientName} is ${Math.abs(daysUntil)} days overdue (${formatCurrency(payment.amount)})`,
          priority: 'high',
          action: 'Send follow-up reminder',
          paymentId: payment.id
        })
      } else if (daysUntil <= 3 && payment.status === 'upcoming') {
        reminders.push({
          type: 'due-soon',
          message: `${payment.clientName} payment due in ${daysUntil} days (${formatCurrency(payment.amount)})`,
          priority: 'medium',
          action: 'Send payment reminder',
          paymentId: payment.id
        })
      }
    })

    return reminders
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
            💰 {t('payment.tracking')}
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            {t('payment.subtitle')} - {language === 'vi' ? 'Không bao giờ mất tiền' : 'Never lose money again'}
          </p>
        </div>

        {/* Stunning KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="relative overflow-hidden bg-gradient-to-br from-red-500 via-red-600 to-red-700 text-white border-0 shadow-2xl hover:shadow-red-500/25 transition-all duration-300 hover:scale-105">
            <div className="absolute inset-0 bg-gradient-to-r from-red-400/20 to-transparent"></div>
            <CardContent className="relative p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                  <AlertTriangle className="h-8 w-8 text-white" />
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold">{summaryStats.overdueCount}</div>
                  <div className="text-red-100 text-sm">{language === 'vi' ? 'Khoản quá hạn' : 'Overdue'}</div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-2xl font-bold">{formatCurrency(summaryStats.overdueAmount)}</div>
                <div className="flex items-center text-red-100">
                  <ArrowUp className="h-4 w-4 mr-1" />
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
                  <div className="text-3xl font-bold">{summaryStats.upcomingCount}</div>
                  <div className="text-yellow-100 text-sm">{language === 'vi' ? 'Sắp đến hạn' : 'Upcoming'}</div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-2xl font-bold">{formatCurrency(summaryStats.upcomingAmount)}</div>
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
                <div className="text-2xl font-bold">{formatCurrency(summaryStats.totalOutstanding)}</div>
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
                  <div className="text-3xl font-bold">{summaryStats.collectionRate}%</div>
                  <div className="text-green-100 text-sm">{language === 'vi' ? 'Tỷ lệ thu' : 'Collection Rate'}</div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-xl font-bold">{summaryStats.paidThisMonth} {language === 'vi' ? 'khoản' : 'payments'}</div>
                <div className="flex items-center text-green-100">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  <span className="text-sm">{language === 'vi' ? 'Tháng này' : 'This month'}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        {/* Smart AI Assistant Reminders */}
        {getSmartReminders().length > 0 && (
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
                {getSmartReminders().map((reminder, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-white rounded-xl border-2 border-orange-100 shadow-lg hover:shadow-xl transition-all duration-300">
                    <div className="flex items-center gap-4">
                      <div className={`w-4 h-4 rounded-full shadow-lg ${reminder.priority === 'high' ? 'bg-red-500 animate-pulse' : 'bg-yellow-500'}`} />
                      <div>
                        <div className="font-semibold text-gray-800">{reminder.message}</div>
                        <div className="text-sm text-gray-600">{reminder.priority === 'high' ? '🚨 Urgent' : '⏰ Reminder'}</div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg"
                        onClick={() => alert(`Sending reminder to client...`)}
                      >
                        <Mail className="h-4 w-4 mr-2" />
                        {reminder.action}
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="border-orange-300 text-orange-700 hover:bg-orange-50"
                        onClick={() => markAsPaid(reminder.paymentId)}
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        {language === 'vi' ? 'Đánh dấu đã trả' : 'Mark Paid'}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Beautiful Interactive Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-4 bg-white/80 backdrop-blur-sm shadow-2xl border-2 border-blue-100 rounded-2xl p-2 h-16">
            <TabsTrigger 
              value="overview" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl font-semibold transition-all duration-300 h-12"
            >
              <BarChart3 className="h-5 w-5 mr-2" />
              {language === 'vi' ? 'Tổng quan' : 'Overview'}
            </TabsTrigger>
            <TabsTrigger 
              value="calendar" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-teal-500 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl font-semibold transition-all duration-300 h-12"
            >
              <Calendar className="h-5 w-5 mr-2" />
              {t('payment.calendar')}
            </TabsTrigger>
            <TabsTrigger 
              value="clients" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl font-semibold transition-all duration-300 h-12"
            >
              <User className="h-5 w-5 mr-2" />
              {t('payment.clients')}
            </TabsTrigger>
            <TabsTrigger 
              value="analytics" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl font-semibold transition-all duration-300 h-12"
            >
              <Activity className="h-5 w-5 mr-2" />
              {t('payment.analytics')}
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Interactive Payment List */}
              <Card className="shadow-2xl border-0 bg-gradient-to-br from-white to-blue-50">
                <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-t-lg">
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <CreditCard className="h-6 w-6" />
                    {language === 'vi' ? 'Danh sách Thanh toán' : 'Payment List'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {payments.slice(0, 5).map((payment) => (
                      <div key={payment.id} className={`p-4 rounded-xl border-l-4 transition-all duration-300 hover:shadow-lg ${
                        payment.status === 'overdue' ? 'border-l-red-500 bg-gradient-to-r from-red-50 to-red-100' :
                        payment.status === 'upcoming' ? 'border-l-yellow-500 bg-gradient-to-r from-yellow-50 to-orange-100' :
                        'border-l-green-500 bg-gradient-to-r from-green-50 to-green-100'
                      }`}>
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-bold text-lg text-gray-800">{payment.clientName}</h3>
                              <Badge className={`${getStatusColor(payment.status)} shadow-lg`}>
                                {payment.status === 'overdue' ? (language === 'vi' ? 'Quá hạn' : 'Overdue') :
                                 payment.status === 'upcoming' ? (language === 'vi' ? 'Sắp đến hạn' : 'Upcoming') :
                                 (language === 'vi' ? 'Đã thanh toán' : 'Paid')}
                              </Badge>
                              <div className={`w-3 h-3 rounded-full shadow-lg ${getPriorityColor(payment.priority)}`} />
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                              <div>
                                <span className="text-gray-600 font-medium">{language === 'vi' ? 'Công ty:' : 'Company:'}</span>
                                <p className="font-semibold text-gray-800">{payment.clientCompany}</p>
                              </div>
                              <div>
                                <span className="text-gray-600 font-medium">{language === 'vi' ? 'Hạn:' : 'Due:'}</span>
                                <p className="font-semibold text-gray-800">{new Date(payment.dueDate).toLocaleDateString('vi-VN')}</p>
                              </div>
                            </div>
                            
                            <div className="flex items-center justify-between">
                              {editingPayment === payment.id ? (
                                <div className="flex items-center gap-2">
                                  <Input
                                    type="number"
                                    value={editAmount}
                                    onChange={(e) => setEditAmount(Number(e.target.value))}
                                    className="w-32 h-8 text-sm"
                                  />
                                  <Button 
                                    size="sm" 
                                    onClick={() => updatePaymentAmount(payment.id, editAmount)}
                                    className="bg-green-500 hover:bg-green-600 h-8"
                                  >
                                    <CheckCircle className="h-3 w-3" />
                                  </Button>
                                </div>
                              ) : (
                                <div 
                                  className="text-2xl font-bold text-blue-600 cursor-pointer hover:text-blue-800 transition-colors"
                                  onClick={() => {
                                    setEditingPayment(payment.id)
                                    setEditAmount(payment.amount)
                                  }}
                                >
                                  {formatCurrency(payment.amount)}
                                </div>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex flex-col gap-2 ml-4">
                            {payment.status !== 'paid' && (
                              <Button 
                                onClick={() => markAsPaid(payment.id)}
                                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-lg"
                              >
                                <CheckCircle className="h-4 w-4 mr-2" />
                                {language === 'vi' ? 'Đã trả' : 'Mark Paid'}
                              </Button>
                            )}
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="border-blue-300 text-blue-700 hover:bg-blue-50"
                              onClick={() => alert(`Sending email to ${payment.clientEmail}`)}
                            >
                              <Mail className="h-4 w-4 mr-2" />
                              {language === 'vi' ? 'Email' : 'Email'}
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Beautiful Analytics Chart */}
              <Card className="shadow-2xl border-0 bg-gradient-to-br from-white to-purple-50">
                <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-t-lg">
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <BarChart3 className="h-6 w-6" />
                    {language === 'vi' ? 'Xu hướng Thu tiền' : 'Collection Trends'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient id="colorCollected" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
                        </linearGradient>
                        <linearGradient id="colorOutstanding" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#ef4444" stopOpacity={0.1}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="name" stroke="#64748b" />
                      <YAxis tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`} stroke="#64748b" />
                      <Tooltip 
                        formatter={(value) => [formatCurrency(Number(value)), language === 'vi' ? 'Số tiền' : 'Amount']}
                        contentStyle={{ 
                          backgroundColor: 'white', 
                          border: '2px solid #e2e8f0', 
                          borderRadius: '12px',
                          boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
                        }}
                      />
                      <Area type="monotone" dataKey="collected" stroke="#10b981" fillOpacity={1} fill="url(#colorCollected)" strokeWidth={3} />
                      <Area type="monotone" dataKey="outstanding" stroke="#ef4444" fillOpacity={1} fill="url(#colorOutstanding)" strokeWidth={3} />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Calendar Tab */}
          <TabsContent value="calendar" className="space-y-6">
            <Card className="shadow-2xl border-0 bg-gradient-to-br from-white to-green-50">
              <CardHeader className="bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <Calendar className="h-6 w-6" />
                  {t('payment.calendar')} - {language === 'vi' ? 'Tháng 8, 2025' : 'August 2025'}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-7 gap-2 mb-6">
                  {['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'].map((day) => (
                    <div key={day} className="text-center font-bold text-gray-700 p-3 bg-gray-100 rounded-lg">
                      {day}
                    </div>
                  ))}
                  
                  {Array.from({ length: 35 }, (_, i) => {
                    const date = new Date(2025, 7, i - 5)
                    const dayPayments = payments.filter(p => 
                      new Date(p.dueDate).toDateString() === date.toDateString()
                    )
                    
                    return (
                      <div 
                        key={i} 
                        className={`min-h-[100px] p-3 border-2 rounded-xl hover:shadow-lg transition-all duration-300 cursor-pointer ${
                          date.getMonth() !== 7 ? 'bg-gray-50 text-gray-400 border-gray-200' : 'bg-white border-blue-200 hover:border-blue-400'
                        }`}
                      >
                        <div className="text-lg font-bold mb-2 text-gray-800">{date.getDate()}</div>
                        <div className="space-y-1">
                          {dayPayments.map((payment) => (
                            <div 
                              key={payment.id}
                              className={`text-xs p-2 rounded-lg text-white font-medium shadow-lg ${
                                payment.status === 'overdue' ? 'bg-gradient-to-r from-red-500 to-red-600' :
                                payment.status === 'upcoming' ? 'bg-gradient-to-r from-yellow-500 to-orange-500' :
                                'bg-gradient-to-r from-green-500 to-green-600'
                              }`}
                              title={`${payment.clientName}: ${formatCurrency(payment.amount)}`}
                            >
                              <div className="font-bold">{payment.clientName}</div>
                              <div className="text-xs opacity-90">{formatCurrency(payment.amount)}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                  })}
                </div>
                
                <div className="flex items-center justify-center gap-6 text-sm font-medium">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-gradient-to-r from-red-500 to-red-600 rounded-full shadow-lg"></div>
                    <span>{language === 'vi' ? 'Quá hạn' : 'Overdue'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full shadow-lg"></div>
                    <span>{language === 'vi' ? 'Sắp đến hạn' : 'Upcoming'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-gradient-to-r from-green-500 to-green-600 rounded-full shadow-lg"></div>
                    <span>{language === 'vi' ? 'Đã thanh toán' : 'Paid'}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Clients Tab */}
          <TabsContent value="clients" className="space-y-6">
            <Card className="shadow-2xl border-0 bg-gradient-to-br from-white to-purple-50">
              <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <User className="h-6 w-6" />
                  {t('payment.clients')} - {language === 'vi' ? 'Hồ sơ Khách hàng' : 'Client Profiles'}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Array.from(new Set(payments.map(p => p.clientName))).map((clientName) => {
                    const clientPayments = payments.filter(p => p.clientName === clientName)
                    const totalOutstanding = clientPayments.filter(p => p.status !== 'paid').reduce((sum, p) => sum + p.amount, 0)
                    const overdueCount = clientPayments.filter(p => p.status === 'overdue').length
                    const client = clientPayments[0]
                    
                    return (
                      <Card key={clientName} className="border-2 border-purple-200 hover:shadow-2xl transition-all duration-300 hover:scale-105 bg-gradient-to-br from-white to-purple-50">
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                                {clientName.charAt(0)}
                              </div>
                              <div>
                                <h3 className="font-bold text-lg text-gray-800">{clientName}</h3>
                                <p className="text-sm text-gray-600">{client.clientCompany}</p>
                              </div>
                            </div>
                            <div className={`w-4 h-4 rounded-full shadow-lg ${overdueCount > 0 ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`} />
                          </div>
                          
                          <div className="space-y-3 mb-4">
                            <div className="flex justify-between items-center p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                              <span className="text-gray-700 font-medium">{language === 'vi' ? 'Chưa thanh toán:' : 'Outstanding:'}</span>
                              <span className="font-bold text-lg text-blue-600">{formatCurrency(totalOutstanding)}</span>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-gradient-to-r from-green-50 to-teal-50 rounded-lg">
                              <span className="text-gray-700 font-medium">{language === 'vi' ? 'Tổng khoản:' : 'Total Payments:'}</span>
                              <span className="font-bold text-green-600">{clientPayments.length}</span>
                            </div>
                            {overdueCount > 0 && (
                              <div className="flex justify-between items-center p-3 bg-gradient-to-r from-red-50 to-pink-50 rounded-lg">
                                <span className="text-red-700 font-medium">{language === 'vi' ? 'Quá hạn:' : 'Overdue:'}</span>
                                <span className="font-bold text-red-600">{overdueCount}</span>
                              </div>
                            )}
                          </div>
                          
                          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                            <p className="text-xs text-gray-600 italic">💡 {client.notes}</p>
                          </div>
                          
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 shadow-lg"
                              onClick={() => alert(`Calling ${client.clientPhone}`)}
                            >
                              <Phone className="h-3 w-3 mr-1" />
                              {language === 'vi' ? 'Gọi' : 'Call'}
                            </Button>
                            <Button 
                              size="sm" 
                              className="flex-1 bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 shadow-lg"
                              onClick={() => alert(`Sending email to ${client.clientEmail}`)}
                            >
                              <Mail className="h-3 w-3 mr-1" />
                              {language === 'vi' ? 'Email' : 'Email'}
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

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="shadow-2xl border-0 bg-gradient-to-br from-white to-orange-50">
                <CardHeader className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-t-lg">
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <PieChartIcon className="h-6 w-6" />
                    {language === 'vi' ? 'Phân tích Khách hàng' : 'Client Analysis'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={clientPerformanceData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => `${name}: ${formatCurrency(value)}`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="amount"
                      >
                        {clientPerformanceData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={
                            entry.status === 'overdue' ? '#ef4444' :
                            entry.status === 'upcoming' ? '#f59e0b' : '#10b981'
                          } />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [formatCurrency(Number(value)), language === 'vi' ? 'Số tiền' : 'Amount']} />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="shadow-2xl border-0 bg-gradient-to-br from-white to-green-50">
                <CardHeader className="bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-t-lg">
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <Target className="h-6 w-6" />
                    {language === 'vi' ? 'Hiệu suất Thu tiền' : 'Collection Performance'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    <div className="text-center p-6 bg-gradient-to-r from-green-100 to-teal-100 rounded-xl">
                      <h3 className="text-4xl font-bold text-green-600 mb-2">{summaryStats.collectionRate}%</h3>
                      <p className="text-gray-700 font-medium">{language === 'vi' ? 'Tỷ lệ thu tiền tổng thể' : 'Overall Collection Rate'}</p>
                    </div>
                    
                    <div className="space-y-4">
                      {Array.from(new Set(payments.map(p => p.clientName))).map((clientName) => {
                        const clientPayments = payments.filter(p => p.clientName === clientName)
                        const paidCount = clientPayments.filter(p => p.status === 'paid').length
                        const rate = (paidCount / clientPayments.length) * 100
                        
                        return (
                          <div key={clientName} className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="font-semibold text-gray-800">{clientName}</span>
                              <span className="text-sm font-bold text-gray-600">{rate.toFixed(0)}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-3 shadow-inner">
                              <div 
                                className="bg-gradient-to-r from-green-500 to-teal-500 h-3 rounded-full shadow-lg transition-all duration-500" 
                                style={{ width: `${rate}%` }}
                              />
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
    </div>
  )
}

export default PaymentTrackingAssistant
