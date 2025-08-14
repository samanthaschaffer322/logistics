'use client';

import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { readabilityClasses } from '@/lib/improved-theme';
import { 
  MapPin, 
  Truck, 
  Zap, 
  Shield, 
  Globe, 
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Info,
  Navigation,
  Brain,
  Layers,
  Target,
  Map,
  Navigation2
} from 'lucide-react';

// Dynamic import to prevent SSR issues with Leaflet
const ComprehensiveRouteOptimizer = dynamic(
  () => import('@/components/ComprehensiveRouteOptimizer'),
  { 
    ssr: false,
    loading: () => (
      <Card className={readabilityClasses.card}>
        <CardContent className="flex flex-col items-center justify-center py-16">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
          <p className={`${readabilityClasses.textSecondary} text-center`}>
            Loading Comprehensive Route Optimizer with Vietnam Map Integration...
          </p>
        </CardContent>
      </Card>
    )
  }
);

const CombinedRouteOptimizerPage: React.FC = () => {
  // Check if ORS API key is configured
  const orsApiKey = process.env.NEXT_PUBLIC_ORS_API_KEY;
  const hasApiKey = orsApiKey && orsApiKey.length > 0;

  const handleOptimizationComplete = (route: any) => {
    console.log('Route optimization completed:', route);
    // Additional handling for combined optimizer
  };

  const handleError = (error: string) => {
    console.error('Route optimization error:', error);
    // Handle errors appropriately
  };

  return (
    <div className={`min-h-screen ${readabilityClasses.bgPrimary}`}>
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="text-center space-y-6">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
              <Navigation2 className="w-8 h-8 text-white" />
            </div>
            <h1 className={`text-4xl font-bold ${readabilityClasses.textPrimary}`}>
              Comprehensive Route Optimizer
            </h1>
          </div>
          
          <p className={`text-xl ${readabilityClasses.textSecondary} max-w-4xl mx-auto leading-relaxed`}>
            Advanced AI-powered route optimization combining interactive mapping, Vietnam logistics database, 
            and intelligent routing algorithms for professional truck logistics operations
          </p>
          
          <div className="flex justify-center gap-3 flex-wrap">
            <Badge variant="outline" className="flex items-center gap-2 px-4 py-2 text-sm font-medium">
              <Zap className="w-4 h-4 text-yellow-500" />
              AI Enhanced
            </Badge>
            <Badge variant="outline" className="flex items-center gap-2 px-4 py-2 text-sm font-medium">
              <Layers className="w-4 h-4 text-blue-500" />
              Leaflet + React-Leaflet
            </Badge>
            <Badge variant="outline" className="flex items-center gap-2 px-4 py-2 text-sm font-medium">
              <Navigation className="w-4 h-4 text-green-500" />
              OpenRouteService
            </Badge>
            <Badge variant="outline" className="flex items-center gap-2 px-4 py-2 text-sm font-medium">
              <Globe className="w-4 h-4 text-purple-500" />
              Vietnam GeoJSON
            </Badge>
            <Badge variant="outline" className="flex items-center gap-2 px-4 py-2 text-sm font-medium">
              <Target className="w-4 h-4 text-orange-500" />
              Multiple Algorithms
            </Badge>
            <Badge variant="outline" className="flex items-center gap-2 px-4 py-2 text-sm font-medium">
              <Truck className="w-4 h-4 text-indigo-500" />
              Truck Optimized
            </Badge>
            <Badge variant="outline" className="flex items-center gap-2 px-4 py-2 text-sm font-medium">
              <Shield className="w-4 h-4 text-emerald-500" />
              Production Ready
            </Badge>
          </div>
        </div>

        {/* API Key Status */}
        {!hasApiKey && (
          <Alert className={`${readabilityClasses.statusWarning} border-l-4 border-l-yellow-500`}>
            <AlertTriangle className="h-5 w-5" />
            <AlertDescription className="text-base leading-relaxed">
              <strong className="font-semibold">Setup Required:</strong> To use the enhanced mapping features, configure your OpenRouteService API key.
              <br />
              <a 
                href="https://openrouteservice.org/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-yellow-700 dark:text-yellow-300 hover:text-yellow-800 dark:hover:text-yellow-200 underline font-medium"
              >
                Get your free API key here
              </a> and add it to your environment variables as <code className="bg-yellow-100 dark:bg-yellow-900/30 px-2 py-1 rounded text-sm font-mono">NEXT_PUBLIC_ORS_API_KEY</code>.
            </AlertDescription>
          </Alert>
        )}

        {hasApiKey && (
          <Alert className={`${readabilityClasses.statusSuccess} border-l-4 border-l-green-500`}>
            <CheckCircle className="h-5 w-5" />
            <AlertDescription className="text-base leading-relaxed">
              <strong className="font-semibold">Ready to go!</strong> OpenRouteService API key is configured. All enhanced mapping and Vietnam route features are available.
            </AlertDescription>
          </Alert>
        )}

        {/* Features Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className={`${readabilityClasses.card} ${readabilityClasses.cardHover} border-l-4 border-l-blue-500`}>
            <CardHeader className="pb-3">
              <CardTitle className={`flex items-center gap-3 text-lg ${readabilityClasses.textPrimary}`}>
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <Map className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                Interactive Mapping
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className={`text-sm ${readabilityClasses.textSecondary} leading-relaxed`}>
                Advanced Leaflet integration with multiple tile providers, Vietnamese location search, 
                and click-to-add waypoints for intuitive route planning.
              </p>
            </CardContent>
          </Card>

          <Card className={`${readabilityClasses.card} ${readabilityClasses.cardHover} border-l-4 border-l-green-500`}>
            <CardHeader className="pb-3">
              <CardTitle className={`flex items-center gap-3 text-lg ${readabilityClasses.textPrimary}`}>
                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <Navigation className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                Smart Routing
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className={`text-sm ${readabilityClasses.textSecondary} leading-relaxed`}>
                OpenRouteService integration for professional truck routing with weight, height, 
                and width restrictions optimized for Vietnamese road conditions.
              </p>
            </CardContent>
          </Card>

          <Card className={`${readabilityClasses.card} ${readabilityClasses.cardHover} border-l-4 border-l-purple-500`}>
            <CardHeader className="pb-3">
              <CardTitle className={`flex items-center gap-3 text-lg ${readabilityClasses.textPrimary}`}>
                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <Globe className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                Vietnam Database
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className={`text-sm ${readabilityClasses.textSecondary} leading-relaxed`}>
                Comprehensive database with 28+ Vietnamese logistics locations including major ports, 
                depots, and industrial zones with complete contact information.
              </p>
            </CardContent>
          </Card>

          <Card className={`${readabilityClasses.card} ${readabilityClasses.cardHover} border-l-4 border-l-orange-500`}>
            <CardHeader className="pb-3">
              <CardTitle className={`flex items-center gap-3 text-lg ${readabilityClasses.textPrimary}`}>
                <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                </div>
                Cost Analytics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className={`text-sm ${readabilityClasses.textSecondary} leading-relaxed`}>
                Detailed cost breakdown in Vietnamese Dong including fuel, driver wages, 
                maintenance, and environmental impact analysis.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Component */}
        {hasApiKey ? (
          <Suspense fallback={
            <Card className={readabilityClasses.card}>
              <CardContent className="flex flex-col items-center justify-center py-16">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-6"></div>
                <h3 className={`text-xl font-semibold ${readabilityClasses.textPrimary} mb-2`}>
                  Loading Comprehensive Route Optimizer
                </h3>
                <p className={`${readabilityClasses.textSecondary} text-center max-w-md`}>
                  Initializing interactive mapping, Vietnam locations database, and optimization algorithms...
                </p>
              </CardContent>
            </Card>
          }>
            <ComprehensiveRouteOptimizer
              onRouteOptimized={handleOptimizationComplete}
              onError={handleError}
              className="min-h-screen"
            />
          </Suspense>
        ) : (
          <Card className={readabilityClasses.card}>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="p-4 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-6">
                <Info className="w-16 h-16 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className={`text-2xl font-semibold ${readabilityClasses.textPrimary} mb-4`}>
                API Key Required
              </h3>
              <p className={`${readabilityClasses.textSecondary} text-center max-w-md mb-8 leading-relaxed`}>
                To use the comprehensive mapping features, please configure your OpenRouteService API key. 
                It's free and takes just a few minutes to set up.
              </p>
              
              <div className="space-y-6 text-sm max-w-3xl">
                <div className={`${readabilityClasses.bgSecondary} p-6 rounded-xl`}>
                  <h4 className={`font-semibold ${readabilityClasses.textPrimary} mb-4 flex items-center gap-2`}>
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    Quick Setup Guide:
                  </h4>
                  <ol className={`list-decimal list-inside space-y-2 ${readabilityClasses.textSecondary} leading-relaxed`}>
                    <li>Visit <a href="https://openrouteservice.org/" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">openrouteservice.org</a></li>
                    <li>Sign up for a free account (no credit card required)</li>
                    <li>Generate an API key from your dashboard</li>
                    <li>Add <code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded text-xs font-mono">NEXT_PUBLIC_ORS_API_KEY=your_key</code> to your <code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded text-xs font-mono">.env.local</code> file</li>
                    <li>Restart your development server</li>
                  </ol>
                </div>
                
                <div className={`${readabilityClasses.statusInfo} p-6 rounded-xl`}>
                  <h4 className={`font-semibold ${readabilityClasses.textPrimary} mb-4 flex items-center gap-2`}>
                    <Shield className="w-5 h-5 text-blue-500" />
                    Free Tier Includes:
                  </h4>
                  <ul className={`list-disc list-inside space-y-1 ${readabilityClasses.textSecondary} leading-relaxed`}>
                    <li>40 requests per minute</li>
                    <li>2,000 requests per day</li>
                    <li>All routing profiles (car, truck, bike, walking)</li>
                    <li>Truck-specific routing with restrictions</li>
                    <li>No credit card required</li>
                  </ul>
                </div>

                <div className={`${readabilityClasses.statusSuccess} p-6 rounded-xl`}>
                  <h4 className={`font-semibold ${readabilityClasses.textPrimary} mb-4 flex items-center gap-2`}>
                    <Zap className="w-5 h-5 text-green-500" />
                    Enhanced Features Available:
                  </h4>
                  <ul className={`list-disc list-inside space-y-1 ${readabilityClasses.textSecondary} leading-relaxed`}>
                    <li>✅ Interactive Leaflet + React-Leaflet mapping</li>
                    <li>✅ OpenRouteService integration for truck routing</li>
                    <li>✅ Vietnam GeoJSON data with 28+ locations</li>
                    <li>✅ Comprehensive Vietnam locations database</li>
                    <li>✅ Multiple route optimization algorithms</li>
                    <li>✅ Cost analysis in Vietnamese Dong (VND)</li>
                    <li>✅ Environmental impact calculations</li>
                    <li>✅ Truck restriction warnings and recommendations</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Usage Tips */}
        <Card className={readabilityClasses.card}>
          <CardHeader>
            <CardTitle className={`${readabilityClasses.textPrimary} flex items-center gap-2`}>
              <Brain className="w-5 h-5 text-purple-500" />
              💡 Usage Tips & Advanced Features
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className={`font-semibold ${readabilityClasses.textPrimary} mb-3 flex items-center gap-2`}>
                  <Target className="w-4 h-4 text-blue-500" />
                  Getting Started
                </h4>
                <ul className={`text-sm ${readabilityClasses.textSecondary} space-y-2 leading-relaxed`}>
                  <li>• Search and add Vietnamese locations from the comprehensive database</li>
                  <li>• Click anywhere on the interactive map to add custom waypoints</li>
                  <li>• Configure truck specifications (20ft/40ft containers, flatbed, tanker)</li>
                  <li>• Choose optimization algorithm (fastest, shortest, eco, cost, balanced)</li>
                  <li>• Set route preferences (avoid tolls, highways, ferries)</li>
                  <li>• Click "Optimize Route" to generate intelligent routes</li>
                </ul>
              </div>
              <div>
                <h4 className={`font-semibold ${readabilityClasses.textPrimary} mb-3 flex items-center gap-2`}>
                  <Zap className="w-4 h-4 text-green-500" />
                  Advanced Features
                </h4>
                <ul className={`text-sm ${readabilityClasses.textSecondary} space-y-2 leading-relaxed`}>
                  <li>• Switch between map providers (OSM, Satellite, Terrain, Transport)</li>
                  <li>• View detailed cost breakdown in Vietnamese Dong (VND)</li>
                  <li>• Analyze environmental impact and CO2 emissions</li>
                  <li>• Get truck-specific warnings and AI recommendations</li>
                  <li>• Export optimized routes as JSON files with metadata</li>
                  <li>• Real-time route efficiency scoring and performance metrics</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CombinedRouteOptimizerPage;
