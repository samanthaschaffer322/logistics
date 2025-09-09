'use client';

import React from 'react';
import EnhancedAIFinancialIntelligence from '@/components/EnhancedAIFinancialIntelligence';

export default function AIFinancialPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-400 to-violet-400 bg-clip-text text-transparent mb-2">
            AI Financial Intelligence Pro
          </h1>
          <p className="text-slate-300">
            Advanced AI-powered financial analysis with market predictions, risk assessment, and strategic insights for Vietnamese logistics
          </p>
          <div className="mt-4 flex gap-2">
            <span className="px-3 py-1 bg-pink-500/20 text-pink-400 rounded-full text-sm border border-pink-500/30">
              LogiAI V4.0 Enhanced
            </span>
            <span className="px-3 py-1 bg-violet-500/20 text-violet-400 rounded-full text-sm border border-violet-500/30">
              Real-time Market Data
            </span>
            <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm border border-blue-500/30">
              Predictive Analytics
            </span>
          </div>
        </div>
        
        <EnhancedAIFinancialIntelligence />
      </div>
    </div>
  );
}
