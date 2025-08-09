'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
import FunctionalCombinedRouteOptimizer from '@/components/FunctionalCombinedRouteOptimizer';

export default function CombinedRouteOptimizerPage() {
  return (
    <ProtectedRoute>
      <FunctionalCombinedRouteOptimizer />
    </ProtectedRoute>
  );
}
