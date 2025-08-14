'use client';

import React from 'react';
import SmartRouteOptimizer from '@/components/SmartRouteOptimizer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  MapPin, 
  Truck, 
  Zap, 
  Shield, 
  Globe, 
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Info
} from 'lucide-react';

const EnhancedRouteOptimizationPage: React.FC = () => {
  // Check if ORS API key is configured
  const orsApiKey = process.env.NEXT_PUBLIC_ORS_API_KEY;
  const hasApiKey = orsApiKey && orsApiKey.length > 0;

  const handleOptimizationComplete = (route: any) => {
    console.log('Route optimization completed:', route);
    // You can add additional handling here, such as:
    // - Saving to database
    // - Sending notifications
    // - Updating fleet management system
  };

  const handleError = (error: string) => {
    console.error('Route optimization error:', error);
    // Handle errors appropriately
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-900">
          Enhanced Route Optimization
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          AI-powered route optimization with intelligent mapping for Vietnamese truck logistics
        </p>
        
        <div className="flex justify-center gap-2 flex-wrap">
          <Badge variant="outline" className="flex items-center gap-1">
            <Zap className="w-4 h-4" />
            AI Enhanced
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1">
            <Truck className="w-4 h-4" />
            Truck Optimized
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1">
            <Globe className="w-4 h-4" />
            Vietnam Focused
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1">
            <Shield className="w-4 h-4" />
            Free & Open Source
          </Badge>
        </div>
      </div>

      {/* API Key Status */}
      {!hasApiKey && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Setup Required:</strong> To use the enhanced mapping features, you need to configure an OpenRouteService API key. 
            <br />
            <a 
              href="https://openrouteservice.org/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Get your free API key here
            </a> and add it to your environment variables as <code>NEXT_PUBLIC_ORS_API_KEY</code>.
          </AlertDescription>
        </Alert>
      )}

      {hasApiKey && (
        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>Ready to go!</strong> OpenRouteService API key is configured. You can now use all enhanced mapping features.
          </AlertDescription>
        </Alert>
      )}

      {/* Features Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <MapPin className="w-5 h-5 text-blue-600" />
              Smart Mapping
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              Interactive maps with multiple providers, Vietnamese location search, and click-to-add waypoints.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Truck className="w-5 h-5 text-green-600" />
              Truck Routing
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              Specialized routing for heavy goods vehicles with weight, height, and width restrictions.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <TrendingUp className="w-5 h-5 text-purple-600" />
              Cost Analytics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              Detailed cost breakdown in VND including fuel, driver wages, and maintenance costs.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Globe className="w-5 h-5 text-orange-600" />
              Vietnam Ready
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              Pre-loaded with Vietnamese provinces, major ports, and logistics hubs for instant use.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Component */}
      {hasApiKey ? (
        <SmartRouteOptimizer
          orsApiKey={orsApiKey}
          onOptimizationComplete={handleOptimizationComplete}
          onError={handleError}
          className="min-h-screen"
        />
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Info className="w-16 h-16 text-gray-400 mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              API Key Required
            </h3>
            <p className="text-gray-600 text-center max-w-md mb-6">
              To use the enhanced mapping features, please configure your OpenRouteService API key. 
              It's free and takes just a few minutes to set up.
            </p>
            
            <div className="space-y-4 text-sm">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Quick Setup:</h4>
                <ol className="list-decimal list-inside space-y-1 text-gray-600">
                  <li>Visit <a href="https://openrouteservice.org/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">openrouteservice.org</a></li>
                  <li>Sign up for a free account</li>
                  <li>Generate an API key</li>
                  <li>Add <code className="bg-gray-200 px-1 rounded">NEXT_PUBLIC_ORS_API_KEY=your_key</code> to your <code className="bg-gray-200 px-1 rounded">.env.local</code> file</li>
                  <li>Restart your development server</li>
                </ol>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2 text-blue-900">Free Tier Includes:</h4>
                <ul className="list-disc list-inside space-y-1 text-blue-800">
                  <li>40 requests per minute</li>
                  <li>2,000 requests per day</li>
                  <li>All routing profiles (car, truck, bike, walking)</li>
                  <li>Truck-specific routing with restrictions</li>
                  <li>No credit card required</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Usage Tips */}
      <Card>
        <CardHeader>
          <CardTitle>💡 Usage Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-2">Getting Started</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Click on the map to add locations</li>
                <li>• Use the search bar to find Vietnamese cities</li>
                <li>• Configure your truck specifications</li>
                <li>• Click "Optimize Route" to generate routes</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Advanced Features</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Switch between map providers (OSM, Satellite, Terrain)</li>
                <li>• Export routes as GPX or KML files</li>
                <li>• View detailed cost and environmental analytics</li>
                <li>• Compare multiple route alternatives</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedRouteOptimizationPage;
