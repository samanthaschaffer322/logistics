'use client'

import React from 'react'
import AuthGuard from '@/components/AuthGuard'
import EnhancedAnalyticsDashboard from '@/components/EnhancedAnalyticsDashboard'

export default function LogisticsOperationsPage() {
  return (
    <AuthGuard>
      <EnhancedAnalyticsDashboard />
    </AuthGuard>
  )
}
