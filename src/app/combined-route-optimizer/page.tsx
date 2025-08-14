'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { Card, CardContent } from '@/components/ui/card';
import DemoSetup from '@/components/DemoSetup';

// Dynamic import to prevent SSR issues
const ComprehensiveRouteOptimizer = dynamic(
  () => import('@/components/ComprehensiveRouteOptimizer'),
  { 
    ssr: false,
    loading: () => (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-600 text-lg">Loading Comprehensive Route Optimizer...</p>
            <p className="text-gray-500 text-sm mt-2">Initializing enhanced mapping features...</p>
          </CardContent>
        </Card>
      </div>
    )
  }
);

const CombinedRouteOptimizerPage: React.FC = () => {
  const [showDemo, setShowDemo] = useState(true);

  if (showDemo) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <DemoSetup onComplete={() => setShowDemo(false)} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <ComprehensiveRouteOptimizer />
      </div>
    </div>
  );
};

export default CombinedRouteOptimizerPage;
