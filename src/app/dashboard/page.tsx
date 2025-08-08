'use client'

import ProtectedRoute from '@/components/ProtectedRoute'
import ComprehensiveDashboard from '@/components/ComprehensiveDashboard'

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <ComprehensiveDashboard />
    </ProtectedRoute>
  )
}
