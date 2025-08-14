'use client';

import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { readabilityClasses } from '@/lib/improved-theme';
import { 
  Brain, 
  FileText, 
  Zap, 
  TrendingUp,
  Database,
  Cpu,
  Target,
  Shield,
  CheckCircle
} from 'lucide-react';

// Dynamic import to prevent SSR issues
const ComprehensiveFileLearningSystem = dynamic(
  () => import('@/components/ComprehensiveFileLearningSystem'),
  { 
    ssr: false,
    loading: () => (
      <Card className={readabilityClasses.card}>
        <CardContent className="flex flex-col items-center justify-center py-16">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
          <p className={`${readabilityClasses.textSecondary} text-center`}>
            Loading Comprehensive File Learning & Automation System...
          </p>
        </CardContent>
      </Card>
    )
  }
);

const FileLearningPage: React.FC = () => {
  return (
    <div className={`min-h-screen ${readabilityClasses.bgPrimary}`}>
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="text-center space-y-6">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <h1 className={`text-4xl font-bold ${readabilityClasses.textPrimary}`}>
              File Learning & Automation System
            </h1>
          </div>
          
          <p className={`text-xl ${readabilityClasses.textSecondary} max-w-4xl mx-auto leading-relaxed`}>
            Intelligent file processing system that learns from your Vietnamese logistics data, 
            generates AI insights, and automatically creates optimization plans and automation workflows
          </p>
          
          <div className="flex justify-center gap-3 flex-wrap">
            <Badge variant="outline" className="flex items-center gap-2 px-4 py-2 text-sm font-medium">
              <Brain className="w-4 h-4 text-purple-500" />
              AI Learning
            </Badge>
            <Badge variant="outline" className="flex items-center gap-2 px-4 py-2 text-sm font-medium">
              <FileText className="w-4 h-4 text-blue-500" />
              File Processing
            </Badge>
            <Badge variant="outline" className="flex items-center gap-2 px-4 py-2 text-sm font-medium">
              <Zap className="w-4 h-4 text-yellow-500" />
              Automation Planning
            </Badge>
            <Badge variant="outline" className="flex items-center gap-2 px-4 py-2 text-sm font-medium">
              <TrendingUp className="w-4 h-4 text-green-500" />
              Performance Analytics
            </Badge>
            <Badge variant="outline" className="flex items-center gap-2 px-4 py-2 text-sm font-medium">
              <Database className="w-4 h-4 text-indigo-500" />
              Vietnamese Data
            </Badge>
            <Badge variant="outline" className="flex items-center gap-2 px-4 py-2 text-sm font-medium">
              <Shield className="w-4 h-4 text-emerald-500" />
              Enterprise Ready
            </Badge>
          </div>
        </div>

        {/* Features Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className={`${readabilityClasses.card} ${readabilityClasses.cardHover} border-l-4 border-l-purple-500`}>
            <CardHeader className="pb-3">
              <CardTitle className={`flex items-center gap-3 text-lg ${readabilityClasses.textPrimary}`}>
                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <FileText className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                Smart File Processing
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className={`text-sm ${readabilityClasses.textSecondary} leading-relaxed`}>
                Intelligent processing of Vietnamese logistics files with automatic data extraction, 
                pattern recognition, and insight generation.
              </p>
            </CardContent>
          </Card>

          <Card className={`${readabilityClasses.card} ${readabilityClasses.cardHover} border-l-4 border-l-blue-500`}>
            <CardHeader className="pb-3">
              <CardTitle className={`flex items-center gap-3 text-lg ${readabilityClasses.textPrimary}`}>
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <Brain className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                AI Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className={`text-sm ${readabilityClasses.textSecondary} leading-relaxed`}>
                Advanced AI analysis that learns from your data patterns to provide actionable 
                insights and optimization recommendations.
              </p>
            </CardContent>
          </Card>

          <Card className={`${readabilityClasses.card} ${readabilityClasses.cardHover} border-l-4 border-l-yellow-500`}>
            <CardHeader className="pb-3">
              <CardTitle className={`flex items-center gap-3 text-lg ${readabilityClasses.textPrimary}`}>
                <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                  <Zap className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                </div>
                Automation Planning
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className={`text-sm ${readabilityClasses.textSecondary} leading-relaxed`}>
                Automatically creates and manages automation workflows based on your data patterns 
                and business requirements.
              </p>
            </CardContent>
          </Card>

          <Card className={`${readabilityClasses.card} ${readabilityClasses.cardHover} border-l-4 border-l-green-500`}>
            <CardHeader className="pb-3">
              <CardTitle className={`flex items-center gap-3 text-lg ${readabilityClasses.textPrimary}`}>
                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                Performance Analytics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className={`text-sm ${readabilityClasses.textSecondary} leading-relaxed`}>
                Comprehensive analytics and reporting on system performance, cost savings, 
                and automation effectiveness.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Component */}
        <Suspense fallback={
          <Card className={readabilityClasses.card}>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mb-6"></div>
              <h3 className={`text-xl font-semibold ${readabilityClasses.textPrimary} mb-2`}>
                Loading File Learning System
              </h3>
              <p className={`${readabilityClasses.textSecondary} text-center max-w-md`}>
                Initializing AI processing engine, automation planner, and analytics dashboard...
              </p>
            </CardContent>
          </Card>
        }>
          <ComprehensiveFileLearningSystem />
        </Suspense>

        {/* System Capabilities */}
        <Card className={readabilityClasses.card}>
          <CardHeader>
            <CardTitle className={`${readabilityClasses.textPrimary} flex items-center gap-2`}>
              <Cpu className="w-5 h-5 text-blue-500" />
              💡 System Capabilities & Features
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className={`font-semibold ${readabilityClasses.textPrimary} mb-3 flex items-center gap-2`}>
                  <Target className="w-4 h-4 text-purple-500" />
                  File Processing Features
                </h4>
                <ul className={`text-sm ${readabilityClasses.textSecondary} space-y-2 leading-relaxed`}>
                  <li>• Automatic Vietnamese logistics file recognition and parsing</li>
                  <li>• Support for Excel (.xlsx, .xls) and CSV file formats</li>
                  <li>• Intelligent data extraction and pattern recognition</li>
                  <li>• Real-time processing with progress tracking</li>
                  <li>• Batch processing for multiple files simultaneously</li>
                  <li>• Data validation and error detection</li>
                </ul>
              </div>
              <div>
                <h4 className={`font-semibold ${readabilityClasses.textPrimary} mb-3 flex items-center gap-2`}>
                  <Zap className="w-4 h-4 text-yellow-500" />
                  Automation & AI Features
                </h4>
                <ul className={`text-sm ${readabilityClasses.textSecondary} space-y-2 leading-relaxed`}>
                  <li>• AI-powered insight generation and recommendations</li>
                  <li>• Automatic creation of optimization and automation plans</li>
                  <li>• Intelligent workflow triggers and action sequences</li>
                  <li>• Performance monitoring and efficiency tracking</li>
                  <li>• Cost savings analysis and ROI calculations</li>
                  <li>• Continuous learning from new data patterns</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Supported File Types */}
        <Card className={readabilityClasses.card}>
          <CardHeader>
            <CardTitle className={`${readabilityClasses.textPrimary} flex items-center gap-2`}>
              <Database className="w-5 h-5 text-indigo-500" />
              📁 Supported Vietnamese Logistics File Types
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className={`p-4 ${readabilityClasses.bgSecondary} rounded-lg`}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h5 className={`font-semibold ${readabilityClasses.textPrimary}`}>
                    Daily Planning Files
                  </h5>
                </div>
                <p className={`text-sm ${readabilityClasses.textSecondary} mb-2`}>
                  <strong>Format:</strong> KẾ HOẠCH NGÀY.xlsx
                </p>
                <p className={`text-sm ${readabilityClasses.textSecondary}`}>
                  Daily operational schedules, route planning, and resource allocation data.
                </p>
              </div>

              <div className={`p-4 ${readabilityClasses.bgSecondary} rounded-lg`}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                    <FileText className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <h5 className={`font-semibold ${readabilityClasses.textPrimary}`}>
                    Vehicle Tracking Files
                  </h5>
                </div>
                <p className={`text-sm ${readabilityClasses.textSecondary} mb-2`}>
                  <strong>Format:</strong> FILE THEO DÕI XE.xlsx
                </p>
                <p className={`text-sm ${readabilityClasses.textSecondary}`}>
                  Vehicle performance, fuel consumption, maintenance records, and efficiency metrics.
                </p>
              </div>

              <div className={`p-4 ${readabilityClasses.bgSecondary} rounded-lg`}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                    <FileText className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h5 className={`font-semibold ${readabilityClasses.textPrimary}`}>
                    Transport Cost Files
                  </h5>
                </div>
                <p className={`text-sm ${readabilityClasses.textSecondary} mb-2`}>
                  <strong>Format:</strong> BKVC PS.xlsx
                </p>
                <p className={`text-sm ${readabilityClasses.textSecondary}`}>
                  Transportation cost statements, route profitability, and financial analysis.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FileLearningPage;
