'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
import CombinedRouteOptimizer from '@/components/CombinedRouteOptimizer';

export default function CombinedRouteOptimizerPage() {
  return (
    <ProtectedRoute>
      <CombinedRouteOptimizer />
    </ProtectedRoute>
  );
}
