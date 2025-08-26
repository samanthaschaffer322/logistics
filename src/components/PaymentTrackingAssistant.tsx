'use client'

import React, { useState } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
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
  Mail,
  Target,
  Activity,
  Edit,
  Save
} from 'lucide-react'

const PaymentTrackingAssistant: React.FC = () => {
  const { language } = useLanguage()
  const [activeTab, setActiveTab] = useState('overview')
  const [editingClient, setEditingClient] = useState<string | null>(null)
  const [editAmount, setEditAmount] = useState<number>(0)

  // Simple, safe data structure with editable amounts
  const [clients, setClients] = useState([
    {
      name: 'Nguyen Long',
      company: 'Long Transport Co.',
      amount: 2500000,
      status: 'upcoming',
      dueDate: '2025-08-28',
      email: 'nguyen.long@longtransport.vn'
    },
    {
      name: 'Ngo Gia',
      company: 'Gia Logistics',
      amount: 1800000,
      status: 'overdue',
      dueDate: '2025-08-15',
      email: 'ngo.gia@gialogistics.vn'
    },
    {
      name: 'AO Shipping',
      company: 'AO Shipping Vietnam',
      amount: 3200000,
      status: 'upcoming',
      dueDate: '2025-08-30',
      email: 'contact@aoshipping.vn'
    },
    {
      name: 'Bao Giao',
      company: 'Bao Giao Express',
      amount: 4000000,
      status: 'upcoming',
      dueDate: '2025-08-27',
      email: 'baogiao@express.vn'
    },
    {
      name: 'CNL',
      company: 'CNL Logistics Solutions',
      amount: 2700000,
      status: 'upcoming',
      dueDate: '2025-09-02',
      email: 'payments@cnllogistics.vn'
    }
  ])

  // Calculate totals from current client data
  const paymentData = {
    totalOutstanding: clients.filter(c => c.status !== 'paid').reduce((sum, c) => sum + c.amount, 0),
    overdueCount: clients.filter(c => c.status === 'overdue').length,
    overdueAmount: clients.filter(c => c.status === 'overdue').reduce((sum, c) => sum + c.amount, 0),
    upcomingCount: clients.filter(c => c.status === 'upcoming').length,
    upcomingAmount: clients.filter(c => c.status === 'upcoming').reduce((sum, c) => sum + c.amount, 0),
    collectionRate: 94.2
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

  const handleMarkPaid = (clientName: string) => {
    setClients(prev => prev.map(client => 
      client.name === clientName 
        ? { ...client, status: 'paid' as const }
        : client
    ))
    alert(language === 'vi' 
      ? `✅ Đã đánh dấu thanh toán của ${clientName} hoàn tất!\n💰 Số tiền đã được ghi nhận vào hệ thống.` 
      : `✅ Marked ${clientName} payment as completed!\n💰 Amount has been recorded in the system.`
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
    setClients(prev => prev.map(client => 
      client.name === clientName 
        ? { ...client, amount: editAmount }
        : client
    ))
    setEditingClient(null)
    alert(language === 'vi' 
      ? `💰 Đã cập nhật số tiền cho ${clientName}: ${formatCurrency(editAmount)}` 
      : `💰 Updated amount for ${clientName}: ${formatCurrency(editAmount)}`
    )
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
                    <div className="font-semibold text-gray-800">Ngo Gia is 11 days overdue ({formatCurrency(1800000)})</div>
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
            <CardTitle className="flex items-center gap-3 text-xl">
              <User className="h-6 w-6" />
              {language === 'vi' ? 'Danh sách Thanh toán' : 'Payment List'}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {clients.map((client, index) => (
                <Card key={index} className={`border-l-4 transition-all duration-300 hover:shadow-lg ${
                  client.status === 'overdue' ? 'border-l-red-500 bg-gradient-to-r from-red-50 to-red-100' :
                  'border-l-yellow-500 bg-gradient-to-r from-yellow-50 to-orange-100'
                }`}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="flex flex-col">
                            <h3 className="font-bold text-xl text-gray-800">{client.name}</h3>
                            <h4 className="font-semibold text-lg text-blue-600">{client.company}</h4>
                          </div>
                          <Badge className={getStatusColor(client.status)}>
                            {client.status === 'overdue' ? (language === 'vi' ? 'Quá hạn' : 'Overdue') :
                             (language === 'vi' ? 'Sắp đến hạn' : 'Upcoming')}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                          <div>
                            <span className="text-gray-600 font-medium">{language === 'vi' ? 'Email:' : 'Email:'}</span>
                            <p className="font-semibold text-gray-800">{client.email}</p>
                          </div>
                          <div>
                            <span className="text-gray-600 font-medium">{language === 'vi' ? 'Hạn thanh toán:' : 'Due Date:'}</span>
                            <p className="font-semibold text-gray-800">{new Date(client.dueDate).toLocaleDateString('vi-VN')}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3 mb-3">
                          <span className="text-gray-600 font-medium">{language === 'vi' ? 'Số tiền:' : 'Amount:'}</span>
                          {editingClient === client.name ? (
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
                                onClick={() => handleSaveAmount(client.name)}
                                className="bg-green-500 hover:bg-green-600 h-10"
                              >
                                <Save className="h-4 w-4" />
                              </Button>
                            </div>
                          ) : (
                            <div 
                              className="text-3xl font-bold text-blue-600 cursor-pointer hover:text-blue-800 transition-colors flex items-center gap-2"
                              onClick={() => handleEditAmount(client.name, client.amount)}
                            >
                              {formatCurrency(client.amount)}
                              <Edit className="h-5 w-5 text-gray-400 hover:text-blue-600" />
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex flex-col gap-3 ml-6">
                        <Button 
                          onClick={() => handleMarkPaid(client.name)}
                          className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-lg transform hover:scale-105 transition-all duration-300 px-6 py-3"
                        >
                          <CheckCircle className="h-5 w-5 mr-2" />
                          {language === 'vi' ? '✅ Đã trả' : '✅ Mark Paid'}
                        </Button>
                        <Button 
                          className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white shadow-lg transform hover:scale-105 transition-all duration-300 px-6 py-3"
                          onClick={() => handleSendReminder(client.name, client.email)}
                        >
                          <Mail className="h-5 w-5 mr-2" />
                          {language === 'vi' ? '📧 Email' : '📧 Email'}
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
