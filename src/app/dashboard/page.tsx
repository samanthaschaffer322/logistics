'use client'

import ProtectedRoute from '@/components/ProtectedRoute'
import NextGenDashboard from '@/components/NextGenDashboard'

// LogiAI V4.0 Analytics Dashboard with comprehensive overview and insights
export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        {/* Analytics Dashboard Overview with real-time insights */}
        <NextGenDashboard />
      </div>
    </ProtectedRoute>
  )
}
