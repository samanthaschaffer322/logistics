'use client'

import React from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  MapPin, Truck, DollarSign, BarChart3, Package, Navigation, 
  FileText, Brain, Globe, Settings, Users, Calendar, Target,
  Zap, Activity, TrendingUp, Shield, Database, Cpu, Mail
} from 'lucide-react'

const FeatureNavigation = () => {
  const features = [
    {
      title: 'Combined Route Optimizer',
      description: 'Advanced AI route optimization with Vietnamese locations',
      href: '/combined-route-optimizer',
      icon: Navigation,
      color: 'bg-blue-500',
      category: 'Core Features'
    },
    {
      title: 'Payment Tracking',
      description: 'Track payments, export PDF/Excel, manage companies',
      href: '/payment-tracking',
      icon: DollarSign,
      color: 'bg-green-500',
      category: 'Core Features'
    },
    {
      title: 'Enhanced Optimizer',
      description: 'V4.0 AI-powered route optimization with OpenAI',
      href: '/enhanced-optimizer',
      icon: Zap,
      color: 'bg-purple-500',
      category: 'Core Features'
    },
    {
      title: 'File Processing',
      description: 'AI analysis of Vietnamese logistics files',
      href: '/file-processing',
      icon: FileText,
      color: 'bg-orange-500',
      category: 'Core Features'
    },
    {
      title: 'Fleet Management',
      description: 'Manage vehicles, drivers, and fleet operations',
      href: '/fleet-management',
      icon: Truck,
      color: 'bg-red-500',
      category: 'Operations'
    },
    {
      title: 'Real-time Tracking',
      description: 'Live GPS tracking with coordinates',
      href: '/real-time-tracking',
      icon: MapPin,
      color: 'bg-cyan-500',
      category: 'Operations'
    },
    {
      title: 'AI Financial',
      description: 'AI-powered financial analysis and insights',
      href: '/ai-financial',
      icon: Brain,
      color: 'bg-pink-500',
      category: 'Analytics'
    },
    {
      title: 'Analytics Dashboard',
      description: 'Comprehensive business analytics',
      href: '/analytics',
      icon: BarChart3,
      color: 'bg-indigo-500',
      category: 'Analytics'
    },
    {
      title: 'Customs Training',
      description: 'HS codes and customs procedures training',
      href: '/customs-training',
      icon: Shield,
      color: 'bg-yellow-500',
      category: 'Training'
    },
    {
      title: 'Import Export',
      description: 'Trade management and documentation',
      href: '/import-export',
      icon: Globe,
      color: 'bg-teal-500',
      category: 'Trade'
    },
    {
      title: 'Logistics Operations',
      description: 'Complete logistics operations management',
      href: '/logistics-operations',
      icon: Package,
      color: 'bg-emerald-500',
      category: 'Operations'
    },
    {
      title: 'Super AI',
      description: 'Advanced AI assistant for logistics',
      href: '/super-ai',
      icon: Cpu,
      color: 'bg-violet-500',
      category: 'AI Tools'
    },
    {
      title: 'Route Optimization',
      description: 'Standard route optimization tools',
      href: '/route-optimization',
      icon: Target,
      color: 'bg-blue-600',
      category: 'Routing'
    },
    {
      title: 'Comprehensive Route Optimizer',
      description: 'Full-featured route optimization suite',
      href: '/comprehensive-route-optimizer',
      icon: Activity,
      color: 'bg-purple-600',
      category: 'Routing'
    },
    {
      title: 'Shipments',
      description: 'Shipment tracking and management',
      href: '/shipments',
      icon: Package,
      color: 'bg-orange-600',
      category: 'Operations'
    },
    {
      title: 'Warehouse',
      description: 'Warehouse management system',
      href: '/warehouse',
      icon: Database,
      color: 'bg-gray-500',
      category: 'Operations'
    }
  ]

  const categories = [...new Set(features.map(f => f.category))]

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
          LogiAI V4.0 - All Features
        </h2>
        <p className="text-slate-400">Access all your upgraded logistics management tools</p>
        <Badge className="mt-2 bg-green-500/20 text-green-400 border-green-500/30">
          {features.length} Features Available
        </Badge>
      </div>

      {categories.map(category => (
        <div key={category} className="space-y-4">
          <h3 className="text-xl font-semibold text-white border-b border-slate-700 pb-2">
            {category}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {features
              .filter(feature => feature.category === category)
              .map((feature, index) => {
                const IconComponent = feature.icon
                return (
                  <Link key={index} href={feature.href}>
                    <Card className="bg-slate-800/50 border-slate-700 hover:bg-slate-700/50 transition-all duration-200 hover:scale-105 cursor-pointer">
                      <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-3 text-white">
                          <div className={`p-2 rounded-lg ${feature.color}`}>
                            <IconComponent className="w-5 h-5 text-white" />
                          </div>
                          <span className="text-sm font-medium">{feature.title}</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-slate-400 text-sm">{feature.description}</p>
                      </CardContent>
                    </Card>
                  </Link>
                )
              })}
          </div>
        </div>
      ))}
    </div>
  )
}

export default FeatureNavigation
