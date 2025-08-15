'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
  Activity,
  LogIn
} from 'lucide-react';

const HomePage: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    // Force dark mode
    document.documentElement.classList.add('dark');
    document.body.classList.add('dark');
    
    // Check if user is already logged in
    const isAuthenticated = sessionStorage.getItem('logiai_authenticated');
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [router]);

  const enhancedFeatures = [
    {
      title: 'Comprehensive Route Optimizer',
      description: 'Advanced AI-powered route optimization combining Vietnam map system with detailed logistics analysis and real-time traffic data.',
      href: '/comprehensive-route-optimizer',
      icon: <Navigation className="w-8 h-8 text-blue-400" />,
      badge: 'NEW',
      color: 'from-blue-500 to-indigo-600',
      features: ['Vietnam Map Integration', 'AI Route Optimization', 'Real-time Traffic', 'Cost Analysis']
    },
    {
      title: 'Vietnam Map System',
      description: 'Interactive map with 28+ logistics locations including ports, depots, warehouses, and industrial zones across Vietnam.',
      href: '/vietnam-map',
      icon: <Map className="w-8 h-8 text-green-400" />,
      badge: 'ENHANCED',
      color: 'from-green-500 to-emerald-600',
      features: ['28+ Locations', 'Port Integration', 'Depot Network', 'Industrial Zones']
    },
    {
      title: 'Route Optimization',
      description: 'Advanced route optimization with Vietnam map integration, OpenRouteService API, and multiple optimization algorithms.',
      href: '/route-optimization',
      icon: <Navigation className="w-8 h-8 text-blue-400" />,
      badge: 'ENHANCED',
      color: 'from-blue-500 to-indigo-600',
      features: ['Vietnam Map Integration', 'OpenRouteService API', '5 Optimization Algorithms', 'Cost Analysis in VND']
    },
    {
      title: 'File Learning & Automation',
      description: 'Intelligent file processing system with AI learning for Vietnamese logistics files like KẾ HOẠCH NGÀY.',
      href: '/file-processing',
      icon: <Brain className="w-8 h-8 text-purple-400" />,
      features: ['AI File Processing', 'Vietnamese File Support', 'Automation Planning', 'Business Insights'],
      status: 'AI Enhanced',
      color: 'purple'
    },
    {
      title: 'Interactive Dashboard',
      description: 'Comprehensive dashboard with functional Quick Actions for system management and user administration.',
      href: '/dashboard',
      icon: <BarChart3 className="w-8 h-8 text-green-400" />,
      features: ['Export System Logs', 'Import Configuration', 'System Settings', 'User Management'],
      status: 'Functional',
      color: 'green'
    },
    {
      title: 'AI Financial Intelligence',
      description: 'Multi-perspective financial analysis with CFO, Accountant, Financial Advisor, and Business Analyst views.',
      href: '/ai-financial',
      icon: <TrendingUp className="w-8 h-8 text-emerald-400" />,
      features: ['CFO Analysis', 'Accountant View', 'Financial Advisor', 'Business Analyst'],
      status: 'Professional',
      color: 'emerald'
    },
    {
      title: 'Vietnam Map System',
      description: 'Detailed Vietnam logistics map with 28+ locations, ports, depots, and industrial zones.',
      href: '/vietnam-map',
      icon: <Map className="w-8 h-8 text-indigo-400" />,
      features: ['28+ Locations', 'Major Ports', 'Logistics Hubs', 'Contact Information'],
      status: 'Complete',
      color: 'indigo'
    },
    {
      title: 'Customs Training',
      description: 'AI-powered customs fraud detection and training system for Vietnamese import/export operations.',
      href: '/customs-training',
      icon: <Shield className="w-8 h-8 text-red-400" />,
      features: ['Fraud Detection', 'Training Modules', 'Compliance Check', 'Risk Assessment'],
      status: 'Security',
      color: 'red'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Enhanced': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'AI Enhanced': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'Functional': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'Professional': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'Complete': return 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30';
      case 'Security': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 space-y-8">
        {/* Hero Section */}
        <div className="text-center space-y-6">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="p-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-2xl">
              <Truck className="w-12 h-12 text-white" />
            </div>
            <div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 bg-clip-text text-transparent mb-2">
                LogiAI Enhanced
              </h1>
              <p className="text-xl text-gray-300">
                AI-Powered Vietnamese Logistics Management Platform
              </p>
            </div>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <p className="text-lg text-gray-300 leading-relaxed mb-6">
              Experience the next generation of logistics management with comprehensive AI-powered features, 
              enhanced UI/UX design, interactive mapping, and intelligent automation systems.
            </p>
            
            <div className="flex justify-center gap-4 flex-wrap">
              <div className="bg-green-500/20 text-green-400 border border-green-500/30 px-4 py-2 rounded-lg text-sm flex items-center">
                <CheckCircle className="w-4 h-4 mr-2" />
                All Features Working
              </div>
              <div className="bg-blue-500/20 text-blue-400 border border-blue-500/30 px-4 py-2 rounded-lg text-sm flex items-center">
                <Globe className="w-4 h-4 mr-2" />
                OpenRouteService Integrated
              </div>
              <div className="bg-purple-500/20 text-purple-400 border border-purple-500/30 px-4 py-2 rounded-lg text-sm flex items-center">
                <Brain className="w-4 h-4 mr-2" />
                AI Enhanced
              </div>
              <div className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-4 py-2 rounded-lg text-sm flex items-center">
                <Shield className="w-4 h-4 mr-2" />
                Production Ready
              </div>
            </div>
          </div>
        </div>

        {/* Quick Access Buttons */}
        <div className="flex justify-center gap-4 flex-wrap">
          <Link href="/login">
            <Button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold px-8 py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <LogIn className="w-5 h-5 mr-2" />
              Sign In to LogiAI
            </Button>
          </Link>
          <Link href="/combined-route-optimizer">
            <Button variant="outline" className="bg-gray-800/50 border-gray-600/50 text-white hover:bg-gray-700/50 px-8 py-4 text-lg rounded-xl">
              <Navigation className="w-5 h-5 mr-2" />
              Try Route Optimizer
            </Button>
          </Link>
        </div>

        {/* Enhanced Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {enhancedFeatures.map((feature, index) => (
            <Card key={index} className="bg-gray-800/80 backdrop-blur-xl border-gray-700/50 shadow-2xl rounded-xl hover:border-gray-600/50 transition-all duration-300 hover:transform hover:scale-105 group">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-3 bg-gray-700/50 rounded-xl">
                    {feature.icon}
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(feature.status)}`}>
                    {feature.status}
                  </div>
                </div>
                <CardTitle className="text-xl text-white group-hover:text-blue-400 transition-colors">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-300 leading-relaxed">
                  {feature.description}
                </p>
                
                <div className="space-y-2">
                  <h5 className="font-semibold text-white text-sm">
                    Key Features:
                  </h5>
                  <ul className="space-y-1">
                    {feature.features.map((item, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm text-gray-400">
                        <CheckCircle className="w-3 h-3 text-green-400 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <Link href={feature.href}>
                  <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group-hover:transform group-hover:scale-105">
                    Explore Feature
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* System Status */}
        <Card className="bg-gray-800/80 backdrop-blur-xl border-gray-700/50 shadow-2xl rounded-xl border-l-4 border-l-green-400">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-green-400" />
              System Status & Capabilities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                <div className="text-3xl font-bold text-green-400 mb-2">
                  100%
                </div>
                <div className="text-sm text-gray-400">
                  Features Working
                </div>
              </div>
              
              <div className="text-center p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                <div className="text-3xl font-bold text-blue-400 mb-2">
                  28+
                </div>
                <div className="text-sm text-gray-400">
                  Vietnam Locations
                </div>
              </div>
              
              <div className="text-center p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                <div className="text-3xl font-bold text-purple-400 mb-2">
                  5
                </div>
                <div className="text-sm text-gray-400">
                  AI Algorithms
                </div>
              </div>
              
              <div className="text-center p-4 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                <div className="text-3xl font-bold text-orange-400 mb-2">
                  API
                </div>
                <div className="text-sm text-gray-400">
                  Fully Integrated
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold text-white">
            Ready to Experience Enhanced LogiAI?
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            All features are fully functional and ready for use. Sign in to start exploring the enhanced 
            capabilities of your Vietnamese logistics management platform.
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <Link href="/login">
              <Button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold px-8 py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <LogIn className="w-5 h-5 mr-2" />
                Sign In Now
              </Button>
            </Link>
            <Link href="/file-processing">
              <Button variant="outline" className="bg-gray-800/50 border-gray-600/50 text-white hover:bg-gray-700/50 px-8 py-4 text-lg rounded-xl">
                <Brain className="w-5 h-5 mr-2" />
                Try AI File Learning
              </Button>
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center pt-8 border-t border-gray-700/50">
          <p className="text-gray-400 text-sm">
            © 2025 LogiAI. Advanced AI-Powered Vietnamese Logistics Platform
          </p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
