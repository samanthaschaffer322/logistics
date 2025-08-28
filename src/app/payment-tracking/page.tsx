'use client'

import { useEffect } from 'react'

export default function PaymentTrackingPage() {
  useEffect(() => {
    // Force redirect to new system
    window.location.href = '/pay-system-2025?cache=' + Date.now()
  }, [])

  return (
    <div className="min-h-screen bg-red-500 flex items-center justify-center">
      <div className="text-white text-center">
        <h1 className="text-6xl font-bold mb-4">🔄 REDIRECTING...</h1>
        <p className="text-2xl">Chuyển hướng đến hệ thống mới...</p>
        <p className="text-lg mt-4">Nếu không tự động chuyển, <a href="/pay-system-2025" className="underline">click here</a></p>
      </div>
    </div>
  )
}
