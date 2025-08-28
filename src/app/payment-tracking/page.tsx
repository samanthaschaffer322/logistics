import PaymentTrackingAssistant from '@/components/PaymentTrackingAssistant'

export default function PaymentTrackingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Trợ lý Theo dõi Thanh toán
          </h1>
          <p className="text-lg text-gray-600">
            Theo dõi thanh toán từ các công ty và gửi báo cáo qua email
          </p>
        </div>
        
        <PaymentTrackingAssistant />
      </div>
    </div>
  )
}
// Force cache refresh Thu 28 Aug 2025 15:12:36 +07
