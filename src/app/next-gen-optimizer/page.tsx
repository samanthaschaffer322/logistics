'use client'

import ProtectedRoute from '@/components/ProtectedRoute'
import NextGenRouteOptimizer from '@/components/NextGenRouteOptimizer'

export default function NextGenOptimizerPage() {
  return (
    <ProtectedRoute>
      <NextGenRouteOptimizer />
    </ProtectedRoute>
  )
}
