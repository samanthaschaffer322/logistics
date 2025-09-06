'use client'

import ProtectedRoute from '@/components/ProtectedRoute'
import NextGenDashboard from '@/components/NextGenDashboard'

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <NextGenDashboard />
    </ProtectedRoute>
  )
}
