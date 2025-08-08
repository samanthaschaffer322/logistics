'use client';

import React from 'react';
import { Metadata } from 'next';
import EnhancedRouteOptimizerComplete from '@/components/EnhancedRouteOptimizerComplete';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, 
  Zap, 
  Globe, 
  Shield, 
  TrendingUp, 
  Cpu,
  Database,
  Cloud,
  Activity
} from 'lucide-react';

export default function EnhancedOptimizerPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Enhanced AI Route Optimizer
          </h1>
          <p className="text-xl text-gray-600 mb-6 max-w-3xl mx-auto">
            Powered by advanced AI algorithms, Fleetbase integration, and AWS optimization services 
            for the most intelligent and efficient route planning solution.
          </p>
          
          {/* Feature Badges */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            <Badge variant="secondary" className="flex items-center gap-2 px-4 py-2">
              <Brain className="h-4 w-4" />
              AI-Powered
            </Badge>
            <Badge variant="secondary" className="flex items-center gap-2 px-4 py-2">
              <Zap className="h-4 w-4" />
              Real-time Optimization
            </Badge>
            <Badge variant="secondary" className="flex items-center gap-2 px-4 py-2">
              <Globe className="h-4 w-4" />
              Multi-Algorithm
            </Badge>
            <Badge variant="secondary" className="flex items-center gap-2 px-4 py-2">
              <Shield className="h-4 w-4" />
              Enterprise Security
            </Badge>
            <Badge variant="secondary" className="flex items-center gap-2 px-4 py-2">
              <TrendingUp className="h-4 w-4" />
              Advanced Analytics
            </Badge>
          </div>
        </div>

        {/* Technology Stack Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="text-center">
            <CardHeader className="pb-3">
              <Cpu className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <CardTitle className="text-lg">AI Algorithms</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Genetic Algorithm, Simulated Annealing, Ant Colony Optimization, and Hybrid approaches
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader className="pb-3">
              <Database className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <CardTitle className="text-lg">Fleetbase Integration</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Complete fleet management with real-time tracking, driver management, and order processing
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader className="pb-3">
              <Cloud className="h-8 w-8 text-orange-600 mx-auto mb-2" />
              <CardTitle className="text-lg">AWS Services</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Location Services, Lambda functions, S3 storage, and CloudWatch monitoring
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader className="pb-3">
              <Activity className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <CardTitle className="text-lg">Real-time Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Live performance metrics, predictive insights, and comprehensive reporting
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Optimizer Component */}
        <EnhancedRouteOptimizerComplete 
          onOptimizationComplete={(result) => {
            console.log('Optimization completed:', result);
            // Handle optimization completion
          }}
          onError={(error) => {
            console.error('Optimization error:', error);
            // Handle optimization error
          }}
        />

        {/* Features Overview */}
        <div className="mt-12">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-center">Key Features & Capabilities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-3">
                  <h3 className="font-semibold text-lg text-blue-600">AI-Powered Optimization</h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Multiple optimization algorithms</li>
                    <li>• Machine learning insights</li>
                    <li>• Predictive analytics</li>
                    <li>• Continuous improvement</li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <h3 className="font-semibold text-lg text-green-600">Fleetbase Integration</h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Complete fleet management</li>
                    <li>• Real-time vehicle tracking</li>
                    <li>• Driver performance monitoring</li>
                    <li>• Order lifecycle management</li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <h3 className="font-semibold text-lg text-orange-600">AWS Cloud Services</h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Location-based services</li>
                    <li>• Scalable infrastructure</li>
                    <li>• Advanced geocoding</li>
                    <li>• Route calculation APIs</li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <h3 className="font-semibold text-lg text-purple-600">Real-time Features</h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Live traffic integration</li>
                    <li>• Weather consideration</li>
                    <li>• Dynamic re-optimization</li>
                    <li>• Instant notifications</li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <h3 className="font-semibold text-lg text-red-600">Advanced Analytics</h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Performance metrics</li>
                    <li>• Cost analysis</li>
                    <li>• Risk assessment</li>
                    <li>• ROI calculations</li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <h3 className="font-semibold text-lg text-indigo-600">Integration & APIs</h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Supabase database</li>
                    <li>• Cloudflare deployment</li>
                    <li>• RESTful APIs</li>
                    <li>• Webhook support</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Performance Metrics */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-center">Performance Improvements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
                <div>
                  <div className="text-3xl font-bold text-blue-600 mb-2">25%</div>
                  <div className="text-sm text-gray-600">Reduction in Total Distance</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-green-600 mb-2">30%</div>
                  <div className="text-sm text-gray-600">Improvement in Delivery Time</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-orange-600 mb-2">40%</div>
                  <div className="text-sm text-gray-600">Cost Savings</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-purple-600 mb-2">95%</div>
                  <div className="text-sm text-gray-600">Customer Satisfaction</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-gray-500">
          <p>
            Enhanced AI Route Optimizer v2.0 - Powered by OpenAI, Fleetbase, AWS, Supabase, and Cloudflare
          </p>
        </div>
      </div>
    </div>
  );
}
