'use client';

import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  CheckCircle, 
  AlertTriangle, 
  Globe, 
  MapPin, 
  Truck, 
  Navigation,
  Zap,
  Info
} from 'lucide-react';

interface DemoSetupProps {
  onComplete: () => void;
}

const DemoSetup: React.FC<DemoSetupProps> = ({ onComplete }) => {
  const [setupStep, setSetupStep] = React.useState(0);
  const [isComplete, setIsComplete] = React.useState(false);

  const setupSteps = [
    {
      title: 'Initializing Enhanced Mapping',
      description: 'Loading mapping services and Vietnamese location data...',
      icon: <Globe className="w-5 h-5" />,
      duration: 1000
    },
    {
      title: 'Loading Vietnam Geographic Data',
      description: 'Loading 63 provinces, major cities, and logistics hubs...',
      icon: <MapPin className="w-5 h-5" />,
      duration: 1500
    },
    {
      title: 'Configuring Truck Routing',
      description: 'Setting up HGV profiles and Vietnamese road networks...',
      icon: <Truck className="w-5 h-5" />,
      duration: 1200
    },
    {
      title: 'Optimizing Route Algorithms',
      description: 'Preparing AI-powered route optimization engines...',
      icon: <Navigation className="w-5 h-5" />,
      duration: 800
    },
    {
      title: 'Ready to Optimize!',
      description: 'All systems ready for comprehensive route optimization.',
      icon: <CheckCircle className="w-5 h-5" />,
      duration: 500
    }
  ];

  useEffect(() => {
    if (setupStep < setupSteps.length - 1) {
      const timer = setTimeout(() => {
        setSetupStep(prev => prev + 1);
      }, setupSteps[setupStep].duration);
      return () => clearTimeout(timer);
    } else if (setupStep === setupSteps.length - 1) {
      const timer = setTimeout(() => {
        setIsComplete(true);
      }, setupSteps[setupStep].duration);
      return () => clearTimeout(timer);
    }
  }, [setupStep]);

  const orsApiKey = process.env.NEXT_PUBLIC_ORS_API_KEY || '';
  const hasApiKey = orsApiKey && orsApiKey.length > 0 && orsApiKey !== 'your_ors_api_key_here';

  if (isComplete) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-green-100 rounded-full">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </div>
          <CardTitle className="text-2xl text-green-900">Setup Complete!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <p className="text-gray-600 mb-4">
              Your comprehensive route optimizer is ready with all enhanced features.
            </p>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Globe className="w-4 h-4 text-blue-600" />
                  <span className="font-medium text-blue-900">Enhanced Mapping</span>
                </div>
                <p className="text-sm text-blue-700">Interactive maps with multiple providers</p>
              </div>
              
              <div className="p-3 bg-green-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Truck className="w-4 h-4 text-green-600" />
                  <span className="font-medium text-green-900">Truck Routing</span>
                </div>
                <p className="text-sm text-green-700">HGV-specific route optimization</p>
              </div>
              
              <div className="p-3 bg-purple-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="w-4 h-4 text-purple-600" />
                  <span className="font-medium text-purple-900">Vietnam Data</span>
                </div>
                <p className="text-sm text-purple-700">63 provinces and major logistics hubs</p>
              </div>
              
              <div className="p-3 bg-orange-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-4 h-4 text-orange-600" />
                  <span className="font-medium text-orange-900">AI Analytics</span>
                </div>
                <p className="text-sm text-orange-700">Cost analysis and optimization</p>
              </div>
            </div>

            {!hasApiKey && (
              <Alert className="mb-4">
                <Info className="h-4 w-4" />
                <AlertDescription>
                  <strong>Optional:</strong> Configure OpenRouteService API key for enhanced routing features.
                  <a 
                    href="https://openrouteservice.org/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline ml-1"
                  >
                    Get free API key
                  </a>
                </AlertDescription>
              </Alert>
            )}

            <Button onClick={onComplete} size="lg" className="w-full">
              Start Route Optimization
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Setting Up Enhanced Route Optimizer</CardTitle>
        <p className="text-gray-600">Preparing comprehensive mapping and optimization features...</p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          {setupSteps.map((step, index) => (
            <div 
              key={index}
              className={`flex items-center gap-4 p-4 rounded-lg transition-all ${
                index === setupStep 
                  ? 'bg-blue-50 border-2 border-blue-200' 
                  : index < setupStep 
                    ? 'bg-green-50 border border-green-200' 
                    : 'bg-gray-50 border border-gray-200'
              }`}
            >
              <div className={`p-2 rounded-full ${
                index === setupStep 
                  ? 'bg-blue-100 text-blue-600' 
                  : index < setupStep 
                    ? 'bg-green-100 text-green-600' 
                    : 'bg-gray-100 text-gray-400'
              }`}>
                {index < setupStep ? <CheckCircle className="w-5 h-5" /> : step.icon}
              </div>
              <div className="flex-1">
                <div className={`font-medium ${
                  index === setupStep 
                    ? 'text-blue-900' 
                    : index < setupStep 
                      ? 'text-green-900' 
                      : 'text-gray-500'
                }`}>
                  {step.title}
                </div>
                <div className={`text-sm ${
                  index === setupStep 
                    ? 'text-blue-700' 
                    : index < setupStep 
                      ? 'text-green-700' 
                      : 'text-gray-400'
                }`}>
                  {step.description}
                </div>
              </div>
              {index === setupStep && (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
              )}
            </div>
          ))}
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Setup Progress</span>
            <span className="text-sm text-gray-600">
              {Math.round(((setupStep + 1) / setupSteps.length) * 100)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((setupStep + 1) / setupSteps.length) * 100}%` }}
            ></div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DemoSetup;
