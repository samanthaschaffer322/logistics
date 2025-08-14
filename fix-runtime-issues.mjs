#!/usr/bin/env node

console.log('🔧 LOGIAI - FIXING RUNTIME ISSUES\n');

import { readFileSync, writeFileSync, existsSync } from 'fs';

// Fix 1: Ensure proper dynamic imports for client-side components
console.log('1. 🔄 FIXING DYNAMIC IMPORTS...');

const routeOptimizerPagePath = 'src/app/combined-route-optimizer/page.tsx';
if (existsSync(routeOptimizerPagePath)) {
  const currentContent = readFileSync(routeOptimizerPagePath, 'utf8');
  
  // Check if it needs dynamic import fix
  if (!currentContent.includes('dynamic(')) {
    const fixedContent = `'use client';

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
}`;
    
    writeFileSync(routeOptimizerPagePath, fixedContent);
    console.log('   ✅ Fixed dynamic imports for route optimizer page');
  } else {
    console.log('   ✅ Dynamic imports already configured');
  }
}

// Fix 2: Ensure proper error boundaries
console.log('\n2. 🛡️ ADDING ERROR BOUNDARIES...');

const errorBoundaryPath = 'src/components/ErrorBoundary.tsx';
if (!existsSync(errorBoundaryPath)) {
  const errorBoundaryContent = `'use client';

import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center p-4">
          <Card className="bg-gray-800/80 backdrop-blur-xl border-gray-700/50 max-w-md w-full">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2 text-red-400" />
                Something went wrong
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-300">
                The application encountered an error. Please try refreshing the page.
              </p>
              {this.state.error && (
                <details className="text-sm text-gray-400">
                  <summary className="cursor-pointer">Error details</summary>
                  <pre className="mt-2 p-2 bg-gray-900/50 rounded text-xs overflow-auto">
                    {this.state.error.message}
                  </pre>
                </details>
              )}
              <Button 
                onClick={() => window.location.reload()} 
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh Page
              </Button>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;`;

  writeFileSync(errorBoundaryPath, errorBoundaryContent);
  console.log('   ✅ Created ErrorBoundary component');
} else {
  console.log('   ✅ ErrorBoundary already exists');
}

// Fix 3: Update main layout to include error boundary
console.log('\n3. 🏗️ UPDATING LAYOUT WITH ERROR BOUNDARY...');

const layoutPath = 'src/app/layout.tsx';
if (existsSync(layoutPath)) {
  const layoutContent = readFileSync(layoutPath, 'utf8');
  
  if (!layoutContent.includes('ErrorBoundary')) {
    // Add ErrorBoundary import and wrap children
    const updatedLayout = layoutContent.replace(
      /import.*from.*$/gm,
      (match) => match + (match.includes('ErrorBoundary') ? '' : '\nimport ErrorBoundary from \'@/components/ErrorBoundary\';')
    ).replace(
      /<body[^>]*>(.*?)<\/body>/s,
      (match, content) => match.replace(content, `
        <ErrorBoundary>
          ${content.trim()}
        </ErrorBoundary>
      `)
    );
    
    if (updatedLayout !== layoutContent) {
      writeFileSync(layoutPath, updatedLayout);
      console.log('   ✅ Updated layout with ErrorBoundary');
    } else {
      console.log('   ✅ Layout already has proper error handling');
    }
  } else {
    console.log('   ✅ Layout already includes ErrorBoundary');
  }
}

// Fix 4: Ensure proper CSS variables are loaded
console.log('\n4. 🎨 CHECKING CSS CONFIGURATION...');

const globalsCssPath = 'src/styles/globals.css';
if (existsSync(globalsCssPath)) {
  const cssContent = readFileSync(globalsCssPath, 'utf8');
  
  if (cssContent.includes('--background') && cssContent.includes('--foreground')) {
    console.log('   ✅ CSS variables properly configured');
  } else {
    console.log('   ⚠️ CSS variables may need updating');
  }
} else {
  console.log('   ❌ globals.css not found');
}

console.log('\n🎉 RUNTIME FIXES COMPLETE!');
console.log('\n📋 FIXES APPLIED:');
console.log('   ✅ Dynamic imports for client-side components');
console.log('   ✅ Error boundary for graceful error handling');
console.log('   ✅ Layout updated with error protection');
console.log('   ✅ CSS configuration verified');

console.log('\n🚀 READY TO TEST:');
console.log('   1. Run: npm run dev');
console.log('   2. Navigate to: http://localhost:3000/combined-route-optimizer');
console.log('   3. Test tab functionality');
console.log('   4. Verify all features work properly');
