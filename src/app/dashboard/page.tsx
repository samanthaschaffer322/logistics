'use client'

import ProtectedRoute from '@/components/ProtectedRoute'
import NextGenDashboard from '@/components/NextGenDashboard'

// LogiAI V4.0 Enhanced - Comprehensive Business Analytics Dashboard
export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        {/* Enhanced Analytics Dashboard with AI Intelligence and Comprehensive Business Insights */}
        <NextGenDashboard />
      </div>
    </ProtectedRoute>
  )
}
