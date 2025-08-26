'use client'

import React from 'react'
import AuthGuard from '@/components/AuthGuard'
import PaymentTrackingAssistant from '@/components/PaymentTrackingAssistant'

export default function RealTimeTrackingPage() {
  return (
    <AuthGuard>
      <PaymentTrackingAssistant />
    </AuthGuard>
  )
}
