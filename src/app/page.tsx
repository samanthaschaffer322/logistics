'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { readabilityClasses } from '@/lib/improved-theme';
import { 
  Brain, 
  Map, 
  FileText, 
  Zap, 
  TrendingUp,
  Navigation,
  Users,
  Settings,
  Globe,
  Truck,
  BarChart3,
  Shield,
  CheckCircle,
  ArrowRight,
  Sparkles,
  Target,
  Activity
} from 'lucide-react';

const HomePage: React.FC = () => {
  const enhancedFeatures = [
    {
      title: 'Comprehensive Route Optimizer',
      description: 'Advanced AI-powered route optimization with Vietnam map integration, OpenRouteService API, and multiple optimization algorithms.',
      href: '/combined-route-optimizer',
      icon: <Navigation className="w-8 h-8 text-blue-600" />,
      features: ['Vietnam Map Integration', 'OpenRouteService API', '5 Optimization Algorithms', 'Cost Analysis in VND'],
      status: 'Enhanced',
      color: 'blue'
    },
    {
      title: 'File Learning & Automation',
      description: 'Intelligent file processing system with AI learning, automation planning, and performance analytics.',
      href: '/file-learning',
      icon: <Brain className="w-8 h-8 text-purple-600" />,
      features: ['AI File Processing', 'Automation Planning', 'Performance Analytics', 'Vietnamese Data Support'],
      status: 'AI Enhanced',
      color: 'purple'
    },
    {
      title: 'Interactive Dashboard',
      description: 'Comprehensive dashboard with functional Quick Actions for system management and user administration.',
      href: '/dashboard',
      icon: <BarChart3 className="w-8 h-8 text-green-600" />,
      features: ['Export System Logs', 'Import Configuration', 'System Settings', 'User Management'],
      status: 'Functional',
      color: 'green'
    },
    {
      title: 'AI Financial Intelligence',
      description: 'Multi-perspective financial analysis with CFO, Accountant, Financial Advisor, and Business Analyst views.',
      href: '/ai-financial',
      icon: <TrendingUp className="w-8 h-8 text-emerald-600" />,
      features: ['CFO Analysis', 'Accountant View', 'Financial Advisor', 'Business Analyst'],
      status: 'Professional',
      color: 'emerald'
    },
    {
      title: 'UI/UX Enhancements',
      description: 'Improved user interface with better readability, theme management, and accessibility features.',
      href: '/ui-enhancements',
      icon: <Sparkles className="w-8 h-8 text-pink-600" />,
      features: ['Improved Readability', 'Theme Management', 'Accessibility', 'Responsive Design'],
      status: 'Enhanced',
      color: 'pink'
    },
    {
      title: 'Vietnam Map System',
      description: 'Detailed Vietnam logistics map with 28+ locations, ports, depots, and industrial zones.',
      href: '/vietnam-map',
      icon: <Map className="w-8 h-8 text-indigo-600" />,
      features: ['28+ Locations', 'Major Ports', 'Logistics Hubs', 'Contact Information'],
      status: 'Complete',
      color: 'indigo'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Enhanced': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'AI Enhanced': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
      case 'Functional': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'Professional': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300';
      case 'Complete': return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };

  return (
    <div className={`min-h-screen ${readabilityClasses.bgPrimary}`}>
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Hero Section */}
        <div className="text-center space-y-6">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="p-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl">
              <Truck className="w-12 h-12 text-white" />
            </div>
            <div>
              <h1 className={`text-5xl font-bold ${readabilityClasses.textPrimary} mb-2`}>
                LogiAI Enhanced
              </h1>
              <p className={`text-xl ${readabilityClasses.textSecondary}`}>
                AI-Powered Vietnamese Logistics Management Platform
              </p>
            </div>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <p className={`text-lg ${readabilityClasses.textSecondary} leading-relaxed mb-6`}>
              Experience the next generation of logistics management with comprehensive AI-powered features, 
              enhanced UI/UX design, interactive mapping, and intelligent automation systems.
            </p>
            
            <div className="flex justify-center gap-4 flex-wrap">
              <Badge className="px-4 py-2 text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                <CheckCircle className="w-4 h-4 mr-2" />
                All Features Working
              </Badge>
              <Badge className="px-4 py-2 text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                <Globe className="w-4 h-4 mr-2" />
                OpenRouteService Integrated
              </Badge>
              <Badge className="px-4 py-2 text-sm font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
                <Brain className="w-4 h-4 mr-2" />
                AI Enhanced
              </Badge>
              <Badge className="px-4 py-2 text-sm font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300">
                <Shield className="w-4 h-4 mr-2" />
                Production Ready
              </Badge>
            </div>
          </div>
        </div>

        {/* Quick Access Buttons */}
        <div className="flex justify-center gap-4 flex-wrap">
          <Link href="/combined-route-optimizer">
            <Button className={`${readabilityClasses.buttonPrimary} px-6 py-3 text-lg`}>
              <Navigation className="w-5 h-5 mr-2" />
              Try Route Optimizer
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button variant="outline" className="px-6 py-3 text-lg">
              <Activity className="w-5 h-5 mr-2" />
              View Dashboard
            </Button>
          </Link>
        </div>

        {/* Enhanced Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {enhancedFeatures.map((feature, index) => (
            <Card key={index} className={`${readabilityClasses.card} ${readabilityClasses.cardHover} group transition-all duration-300 hover:scale-105`}>
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-3 bg-${feature.color}-100 dark:bg-${feature.color}-900/30 rounded-xl`}>
                    {feature.icon}
                  </div>
                  <Badge className={getStatusColor(feature.status)}>
                    {feature.status}
                  </Badge>
                </div>
                <CardTitle className={`text-xl ${readabilityClasses.textPrimary} group-hover:text-${feature.color}-600 transition-colors`}>
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className={`${readabilityClasses.textSecondary} leading-relaxed`}>
                  {feature.description}
                </p>
                
                <div className="space-y-2">
                  <h5 className={`font-semibold ${readabilityClasses.textPrimary} text-sm`}>
                    Key Features:
                  </h5>
                  <ul className="space-y-1">
                    {feature.features.map((item, idx) => (
                      <li key={idx} className={`flex items-center gap-2 text-sm ${readabilityClasses.textSecondary}`}>
                        <CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <Link href={feature.href}>
                  <Button className="w-full group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 transition-all duration-300">
                    Explore Feature
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* System Status */}
        <Card className={`${readabilityClasses.card} border-l-4 border-l-green-500`}>
          <CardHeader>
            <CardTitle className={`${readabilityClasses.textPrimary} flex items-center gap-2`}>
              <Activity className="w-5 h-5 text-green-500" />
              System Status & Capabilities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
                  100%
                </div>
                <div className={`text-sm ${readabilityClasses.textMuted}`}>
                  Features Working
                </div>
              </div>
              
              <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                  28+
                </div>
                <div className={`text-sm ${readabilityClasses.textMuted}`}>
                  Vietnam Locations
                </div>
              </div>
              
              <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                  5
                </div>
                <div className={`text-sm ${readabilityClasses.textMuted}`}>
                  AI Algorithms
                </div>
              </div>
              
              <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                <div className="text-3xl font-bold text-orange-600 dark:text-orange-400 mb-2">
                  API
                </div>
                <div className={`text-sm ${readabilityClasses.textMuted}`}>
                  Fully Integrated
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <div className="text-center space-y-4">
          <h2 className={`text-3xl font-bold ${readabilityClasses.textPrimary}`}>
            Ready to Experience Enhanced LogiAI?
          </h2>
          <p className={`text-lg ${readabilityClasses.textSecondary} max-w-2xl mx-auto`}>
            All features are fully functional and ready for use. Start exploring the enhanced 
            capabilities of your Vietnamese logistics management platform.
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <Link href="/combined-route-optimizer">
              <Button size="lg" className="px-8 py-4 text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                <Target className="w-5 h-5 mr-2" />
                Start Route Optimization
              </Button>
            </Link>
            <Link href="/file-learning">
              <Button size="lg" variant="outline" className="px-8 py-4 text-lg">
                <Brain className="w-5 h-5 mr-2" />
                Try AI File Learning
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
