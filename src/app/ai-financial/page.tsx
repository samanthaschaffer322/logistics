'use client';

import React from 'react';
import EnhancedAIFinancialIntelligence from '@/components/EnhancedAIFinancialIntelligence';

export default function AIFinancialPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          AI Financial Intelligence
        </h1>
        <p className="text-gray-600">
          Comprehensive financial analysis with AI-powered insights from multiple professional perspectives
        </p>
      </div>
      
      <EnhancedAIFinancialIntelligence />
    </div>
  );
}
