'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { Card, CardContent } from '@/components/ui/card';

// Dynamic import to prevent SSR issues
const ComprehensiveRouteOptimizer = dynamic(
  () => import('@/components/ComprehensiveRouteOptimizer'),
  { 
    ssr: false,
    loading: () => (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <Card className="shadow-xl border-0">
          <CardContent className="flex flex-col items-center justify-center py-16 px-8">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200"></div>
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600 absolute top-0 left-0"></div>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-2">
              Loading Comprehensive Route Optimizer
            </h3>
            <p className="text-gray-600 text-center max-w-md">
              Initializing enhanced mapping features, Vietnam data, and AI-powered route optimization...
            </p>
            <div className="flex items-center gap-2 mt-4">
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }
);

const CombinedRouteOptimizerPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <ComprehensiveRouteOptimizer />
      </div>
    </div>
  );
};

export default CombinedRouteOptimizerPage;
