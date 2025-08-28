'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Mail, Send, CheckCircle, XCircle, Clock } from 'lucide-react'

const PaymentTrackingAssistant = () => {
  const [email, setEmail] = useState('andatecampion@proton.me')
  const [isLoading, setIsLoading] = useState(false)
  const [reportSent, setReportSent] = useState(false)

  // Sample payment data
  const paymentData = {
    paid: [
      { company: 'Công ty TNHH Vận tải Sài Gòn', amount: '2.5 triệu VND', date: '2025-08-25' },
      { company: 'Công ty CP Logistics Miền Nam', amount: '1.8 triệu VND', date: '2025-08-24' },
      { company: 'Công ty TNHH Cảng Cát Lái', amount: '3.2 triệu VND', date: '2025-08-23' }
    ],
    unpaid: [
      { company: 'Công ty TNHH Vận tải Phú Mỹ', amount: '1.9 triệu VND', dueDate: '2025-08-20', overdue: 8 },
      { company: 'Công ty CP Logistics Đông Nam', amount: '2.7 triệu VND', dueDate: '2025-08-22', overdue: 6 },
      { company: 'Công ty TNHH Cảng Thị Vải', amount: '1.4 triệu VND', dueDate: '2025-08-26', overdue: 2 }
    ]
  }

  const sendPaymentReport = async () => {
    setIsLoading(true)
    
    // Simulate email sending
    setTimeout(() => {
      setIsLoading(false)
      setReportSent(true)
      
      // Reset after 3 seconds
      setTimeout(() => setReportSent(false), 3000)
    }, 2000)
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <CardTitle className="flex items-center gap-3">
          <Mail className="h-6 w-6" />
          Trợ lý Theo dõi Thanh toán
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Paid Companies */}
          <div>
            <h3 className="text-lg font-semibold text-green-600 mb-3 flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              Đã Thanh Toán ({paymentData.paid.length})
            </h3>
            <div className="space-y-2">
              {paymentData.paid.map((company, index) => (
                <div key={index} className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="font-medium text-green-800">{company.company}</div>
                  <div className="text-sm text-green-600">{company.amount} • {company.date}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Unpaid Companies */}
          <div>
            <h3 className="text-lg font-semibold text-red-600 mb-3 flex items-center gap-2">
              <XCircle className="h-5 w-5" />
              Chưa Thanh Toán ({paymentData.unpaid.length})
            </h3>
            <div className="space-y-2">
              {paymentData.unpaid.map((company, index) => (
                <div key={index} className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="font-medium text-red-800">{company.company}</div>
                  <div className="text-sm text-red-600">
                    {company.amount} • Quá hạn {company.overdue} ngày
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Email Report Section */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Send className="h-5 w-5" />
            Gửi Báo cáo qua Email
          </h3>
          
          <div className="flex gap-3 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-2">Email nhận báo cáo:</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your-email@example.com"
                className="w-full"
              />
            </div>
            <Button
              onClick={sendPaymentReport}
              disabled={isLoading || !email}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 animate-spin" />
                  Đang gửi...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Send className="h-4 w-4" />
                  Gửi Báo cáo
                </div>
              )}
            </Button>
          </div>

          {reportSent && (
            <div className="mt-4 p-4 bg-green-100 border border-green-300 rounded-lg">
              <div className="flex items-center gap-2 text-green-800">
                <CheckCircle className="h-5 w-5" />
                <span className="font-medium">
                  Báo cáo thanh toán đã được gửi thành công đến {email}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Summary */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-green-600">{paymentData.paid.length}</div>
              <div className="text-sm text-gray-600">Đã thanh toán</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-red-600">{paymentData.unpaid.length}</div>
              <div className="text-sm text-gray-600">Chưa thanh toán</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-600">
                {paymentData.unpaid.reduce((sum, company) => sum + company.overdue, 0)}
              </div>
              <div className="text-sm text-gray-600">Tổng ngày quá hạn</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default PaymentTrackingAssistant
