'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { Loader2 } from 'lucide-react';

// Dynamic import to ensure proper client-side rendering
const ComprehensiveEnhancedRouteOptimizer = dynamic(
  () => import('@/components/ComprehensiveEnhancedRouteOptimizer'),
  {
    loading: () => (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-400 mx-auto mb-4" />
          <p className="text-white text-lg">Loading Route Optimizer...</p>
        </div>
      </div>
    ),
    ssr: false
  }
);

export default function CombinedRouteOptimizerPage() {
  return <ComprehensiveEnhancedRouteOptimizer />;
}