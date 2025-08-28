'use client'

export default function PaymentTrackingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-800">💰 Danh sách Thanh toán</h1>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
              Thêm mới
            </button>
          </div>
          
          <div className="space-y-4">
            {/* Nguyen Van Long */}
            <div className="border rounded-lg p-4 flex items-center justify-between">
              <div className="flex-1">
                <div className="font-semibold">Nguyen Van Long</div>
                <div className="text-sm text-gray-600">Long Transport & Logistics Co., Ltd</div>
                <div className="text-lg font-bold text-blue-600">45.000.000 ₫</div>
                <div className="text-xs text-gray-500">Ngày tạo: 15/8/2025</div>
                <div className="text-xs text-gray-500">Hạn thanh toán: 28/8/2025</div>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-sm bg-red-100 text-red-800">Quá hạn</span>
                <button 
                  onClick={() => alert('✅ Đã đánh dấu thanh toán hoàn tất cho Nguyen Van Long!')}
                  className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                >
                  ✅ Đã trả
                </button>
                <button 
                  onClick={() => alert('📧 Email report sent to andatecampion@proton.me!\n\nCustomer: Nguyen Van Long\nAmount: 45.000.000 ₫\nStatus: Overdue')}
                  className="border px-3 py-1 rounded text-sm hover:bg-gray-50"
                >
                  📧 Email
                </button>
              </div>
            </div>

            {/* AO Shipping Vietnam - PAID */}
            <div className="border rounded-lg p-4 flex items-center justify-between bg-green-50">
              <div className="flex-1">
                <div className="font-semibold">AO Shipping Vietnam</div>
                <div className="text-sm text-gray-600">AO International Shipping Co., Ltd</div>
                <div className="text-lg font-bold text-green-600">67.200.000 ₫</div>
                <div className="text-xs text-gray-500">Ngày tạo: 16/8/2025</div>
                <div className="text-xs text-gray-500">Hạn thanh toán: 30/8/2025</div>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">Đã trả ✅</span>
                <button 
                  onClick={() => alert('📧 Email report sent to andatecampion@proton.me!')}
                  className="border px-3 py-1 rounded text-sm hover:bg-gray-50"
                >
                  📧 Email
                </button>
              </div>
            </div>

            {/* CN */}
            <div className="border rounded-lg p-4 flex items-center justify-between">
              <div className="flex-1">
                <div className="font-semibold">CN</div>
                <div className="text-sm text-gray-600">CN</div>
                <div className="text-lg font-bold text-blue-600">67.000.000 ₫</div>
                <div className="text-xs text-gray-500">Ngày tạo: 28/8/2025</div>
                <div className="text-xs text-gray-500">Hạn thanh toán: 18/9/2025</div>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-sm bg-yellow-100 text-yellow-800">Chờ thanh toán</span>
                <button 
                  onClick={() => alert('✅ Đã đánh dấu thanh toán hoàn tất cho CN!')}
                  className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                >
                  ✅ Đã trả
                </button>
                <button 
                  onClick={() => alert('📧 Email report sent to andatecampion@proton.me!')}
                  className="border px-3 py-1 rounded text-sm hover:bg-gray-50"
                >
                  📧 Email
                </button>
              </div>
            </div>

            {/* Khang Phat */}
            <div className="border rounded-lg p-4 flex items-center justify-between">
              <div className="flex-1">
                <div className="font-semibold">Khang Phat</div>
                <div className="text-sm text-gray-600">KP</div>
                <div className="text-lg font-bold text-blue-600">98.000.000 ₫</div>
                <div className="text-xs text-gray-500">Ngày tạo: 28/8/2025</div>
                <div className="text-xs text-gray-500">Hạn thanh toán: 25/9/2025</div>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-sm bg-yellow-100 text-yellow-800">Chờ thanh toán</span>
                <button 
                  onClick={() => alert('✅ Đã đánh dấu thanh toán hoàn tất cho Khang Phat!')}
                  className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                >
                  ✅ Đã trả
                </button>
                <button 
                  onClick={() => alert('📧 Email report sent to andatecampion@proton.me!')}
                  className="border px-3 py-1 rounded text-sm hover:bg-gray-50"
                >
                  📧 Email
                </button>
              </div>
            </div>

            {/* DQM */}
            <div className="border rounded-lg p-4 flex items-center justify-between">
              <div className="flex-1">
                <div className="font-semibold">DQM</div>
                <div className="text-sm text-gray-600">DQM</div>
                <div className="text-lg font-bold text-blue-600">91.000.000 ₫</div>
                <div className="text-xs text-gray-500">Ngày tạo: 28/8/2025</div>
                <div className="text-xs text-gray-500">Hạn thanh toán: 25/9/2025</div>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-sm bg-yellow-100 text-yellow-800">Chờ thanh toán</span>
                <button 
                  onClick={() => alert('✅ Đã đánh dấu thanh toán hoàn tất cho DQM!')}
                  className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                >
                  ✅ Đã trả
                </button>
                <button 
                  onClick={() => alert('📧 Email report sent to andatecampion@proton.me!')}
                  className="border px-3 py-1 rounded text-sm hover:bg-gray-50"
                >
                  📧 Email
                </button>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <div className="text-sm text-blue-800">
              📊 Total: 5 companies | Paid: 1 (AO Shipping) | Pending: 4
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
