'use client';

import React from 'react';
import AdvancedRouteOptimizerComponent from '@/components/route-optimization/AdvancedRouteOptimizer';
import { OptimizationResult } from '@/lib/route-optimization/advanced-optimizer';
import { PredictionResult } from '@/lib/ai-learning/logistics-ai';

export default function AdvancedOptimizationPage() {
  const handleOptimizationComplete = (result: OptimizationResult) => {
    console.log('Optimization completed:', result);
    // You can add additional logic here, such as saving to database
  };

  const handleAIPrediction = (prediction: PredictionResult) => {
    console.log('AI prediction generated:', prediction);
    // You can add additional logic here, such as displaying notifications
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <AdvancedRouteOptimizerComponent
          onOptimizationComplete={handleOptimizationComplete}
          onAIPrediction={handleAIPrediction}
        />
      </div>
    </div>
  );
}
