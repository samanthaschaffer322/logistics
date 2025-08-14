'use client';

import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Area, AreaChart
} from 'recharts';
import { 
  FileText, Upload, Download, Package, Truck, Ship, 
  Plane, CheckCircle, AlertTriangle, Clock, DollarSign,
  Globe, Shield, Brain, Zap, Target, TrendingUp,
  Search, Filter, Eye, Settings, RefreshCw, Plus,
  Minus, Edit, Trash2, Copy, Share, Star, Award,
  Sparkles, Activity, BarChart3, PieChart as PieChartIcon,
  FileCheck, FileX, FilePlus, FileSearch, Layers,
  MapPin, Navigation, Route, Fuel, Leaf
} from 'lucide-react';

interface ImportExportDocument {
  id: string;
  type: 'import' | 'export';
  documentType: 'invoice' | 'packing_list' | 'bill_of_lading' | 'certificate' | 'customs_declaration';
  title: string;
  description: string;
  status: 'pending' | 'processing' | 'approved' | 'rejected' | 'completed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  value: number;
  currency: 'VND' | 'USD' | 'EUR';
  origin: string;
  destination: string;
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
  aiInsights?: string[];
  riskScore?: number;
  complianceScore?: number;
}

interface SmartInsight {
  id: string;
  type: 'cost_optimization' | 'compliance_alert' | 'route_suggestion' | 'risk_warning' | 'efficiency_tip';
  title: string;
  description: string;
  impact: 'low' | 'medium' | 'high';
  actionRequired: boolean;
  estimatedSavings?: number;
  deadline?: Date;
}

const EnhancedImportExportCenter: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [documents, setDocuments] = useState<ImportExportDocument[]>([]);
  const [smartInsights, setSmartInsights] = useState<SmartInsight[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');

  // Sample data based on Vietnamese import/export patterns
  const sampleDocuments: ImportExportDocument[] = [
    {
      id: '1',
      type: 'import',
      documentType: 'invoice',
      title: 'Electronics Import - Samsung Components',
      description: 'Import of electronic components from South Korea',
      status: 'processing',
      priority: 'high',
      value: 2500000000,
      currency: 'VND',
      origin: 'Seoul, South Korea',
      destination: 'Ho Chi Minh City, Vietnam',
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-16'),
      tags: ['electronics', 'components', 'korea'],
      aiInsights: [
        'Optimal shipping route via Busan Port',
        'Consider consolidating with other electronics imports',
        'Duty rate: 5% - within expected range'
      ],
      riskScore: 25,
      complianceScore: 95
    },
    {
      id: '2',
      type: 'export',
      documentType: 'packing_list',
      title: 'Textile Export - Cotton Products',
      description: 'Export of cotton textiles to European markets',
      status: 'approved',
      priority: 'medium',
      value: 1800000000,
      currency: 'VND',
      origin: 'Ho Chi Minh City, Vietnam',
      destination: 'Hamburg, Germany',
      createdAt: new Date('2024-01-14'),
      updatedAt: new Date('2024-01-16'),
      tags: ['textiles', 'cotton', 'europe'],
      aiInsights: [
        'EU textile regulations compliant',
        'Consider eco-friendly packaging for better market appeal',
        'Peak season shipping - book early'
      ],
      riskScore: 15,
      complianceScore: 98
    },
    {
      id: '3',
      type: 'import',
      documentType: 'customs_declaration',
      title: 'Machinery Import - Manufacturing Equipment',
      description: 'Import of industrial machinery from Japan',
      status: 'pending',
      priority: 'urgent',
      value: 5200000000,
      currency: 'VND',
      origin: 'Osaka, Japan',
      destination: 'Hanoi, Vietnam',
      createdAt: new Date('2024-01-16'),
      updatedAt: new Date('2024-01-16'),
      tags: ['machinery', 'industrial', 'japan'],
      aiInsights: [
        'Requires special handling permit',
        'Installation support available from supplier',
        'Consider duty exemption for manufacturing equipment'
      ],
      riskScore: 45,
      complianceScore: 88
    }
  ];

  const sampleInsights: SmartInsight[] = [
    {
      id: '1',
      type: 'cost_optimization',
      title: 'Consolidation Opportunity',
      description: 'Combine 3 electronics imports from Korea to save 15% on shipping costs',
      impact: 'high',
      actionRequired: true,
      estimatedSavings: 375000000,
      deadline: new Date('2024-01-20')
    },
    {
      id: '2',
      type: 'compliance_alert',
      title: 'New EU Regulations',
      description: 'Updated textile labeling requirements effective February 1st',
      impact: 'medium',
      actionRequired: true,
      deadline: new Date('2024-02-01')
    },
    {
      id: '3',
      type: 'route_suggestion',
      title: 'Alternative Shipping Route',
      description: 'Route via Singapore port could reduce transit time by 2 days',
      impact: 'medium',
      actionRequired: false,
      estimatedSavings: 150000000
    }
  ];

  // Initialize with sample data
  React.useEffect(() => {
    setDocuments(sampleDocuments);
    setSmartInsights(sampleInsights);
  }, []);

  // Filter documents based on search and filters
  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doc.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doc.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesStatus = filterStatus === 'all' || doc.status === filterStatus;
    const matchesType = filterType === 'all' || doc.type === filterType;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  // Calculate statistics
  const stats = {
    totalDocuments: documents.length,
    pendingDocuments: documents.filter(d => d.status === 'pending').length,
    processingDocuments: documents.filter(d => d.status === 'processing').length,
    completedDocuments: documents.filter(d => d.status === 'completed').length,
    totalValue: documents.reduce((sum, doc) => sum + doc.value, 0),
    averageRiskScore: documents.reduce((sum, doc) => sum + (doc.riskScore || 0), 0) / documents.length,
    averageComplianceScore: documents.reduce((sum, doc) => sum + (doc.complianceScore || 0), 0) / documents.length
  };

  // Chart data
  const statusChartData = [
    { name: 'Pending', value: stats.pendingDocuments, color: '#F59E0B' },
    { name: 'Processing', value: stats.processingDocuments, color: '#3B82F6' },
    { name: 'Completed', value: stats.completedDocuments, color: '#10B981' },
    { name: 'Others', value: documents.length - stats.pendingDocuments - stats.processingDocuments - stats.completedDocuments, color: '#6B7280' }
  ];

  const typeChartData = [
    { name: 'Import', value: documents.filter(d => d.type === 'import').length, color: '#8B5CF6' },
    { name: 'Export', value: documents.filter(d => d.type === 'export').length, color: '#EC4899' }
  ];

  const valueChartData = documents.map((doc, index) => ({
    name: `Doc ${index + 1}`,
    value: doc.value / 1000000000,
    type: doc.type
  }));

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    setIsProcessing(true);
    
    // Simulate AI processing
    setTimeout(() => {
      const newDocuments = Array.from(files).map((file, index) => ({
        id: `new-${Date.now()}-${index}`,
        type: Math.random() > 0.5 ? 'import' : 'export' as 'import' | 'export',
        documentType: 'invoice' as const,
        title: file.name.replace(/\.[^/.]+$/, ""),
        description: `AI-processed document: ${file.name}`,
        status: 'processing' as const,
        priority: 'medium' as const,
        value: Math.floor(Math.random() * 5000000000) + 1000000000,
        currency: 'VND' as const,
        origin: 'Vietnam',
        destination: 'International',
        createdAt: new Date(),
        updatedAt: new Date(),
        tags: ['ai-processed', 'new'],
        aiInsights: [
          'Document automatically classified',
          'Compliance check in progress',
          'Risk assessment completed'
        ],
        riskScore: Math.floor(Math.random() * 50) + 10,
        complianceScore: Math.floor(Math.random() * 20) + 80
      }));

      setDocuments(prev => [...newDocuments, ...prev]);
      setIsProcessing(false);
    }, 2000);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'processing': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'approved': return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
      case 'completed': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'bg-gray-100 text-gray-600';
      case 'medium': return 'bg-blue-100 text-blue-700';
      case 'high': return 'bg-orange-100 text-orange-700';
      case 'urgent': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getRiskColor = (score: number) => {
    if (score < 20) return 'text-green-600';
    if (score < 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="enhanced-import-export-center space-y-8">
      {/* Enhanced Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-indigo-600 via-blue-600 to-purple-600 rounded-2xl p-8 text-white shadow-2xl">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                  <Globe className="w-8 h-8" />
                </div>
                <h1 className="text-4xl font-bold">Enhanced Import/Export Center</h1>
              </div>
              <p className="text-blue-100 text-lg max-w-2xl">
                AI-powered document processing, compliance monitoring, and intelligent insights for Vietnamese international trade operations.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30 backdrop-blur-sm">
                  <Brain className="w-4 h-4 mr-1" />
                  AI Processing
                </Badge>
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30 backdrop-blur-sm">
                  <Shield className="w-4 h-4 mr-1" />
                  Compliance Ready
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30 backdrop-blur-sm">
                  <Zap className="w-4 h-4 mr-1" />
                  Smart Insights
                </Badge>
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30 backdrop-blur-sm">
                  <Award className="w-4 h-4 mr-1" />
                  Enterprise Grade
                </Badge>
              </div>
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="shadow-lg border-0 bg-gradient-to-br from-blue-50 to-indigo-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Total Documents</p>
                <p className="text-3xl font-bold text-blue-900">{stats.totalDocuments}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0 bg-gradient-to-br from-green-50 to-emerald-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Total Value</p>
                <p className="text-2xl font-bold text-green-900">
                  {(stats.totalValue / 1000000000).toFixed(1)}B VND
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0 bg-gradient-to-br from-purple-50 to-pink-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Compliance Score</p>
                <p className="text-3xl font-bold text-purple-900">{stats.averageComplianceScore.toFixed(0)}%</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <Shield className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0 bg-gradient-to-br from-orange-50 to-red-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600">Risk Score</p>
                <p className="text-3xl font-bold text-orange-900">{stats.averageRiskScore.toFixed(0)}</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-full">
                <AlertTriangle className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 h-14 bg-white shadow-lg rounded-xl border-0">
          <TabsTrigger 
            value="dashboard" 
            className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white rounded-lg font-medium"
          >
            <BarChart3 className="w-5 h-5" />
            <span className="hidden sm:inline">Dashboard</span>
          </TabsTrigger>
          <TabsTrigger 
            value="documents" 
            className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-600 data-[state=active]:to-emerald-600 data-[state=active]:text-white rounded-lg font-medium"
          >
            <FileText className="w-5 h-5" />
            <span className="hidden sm:inline">Documents</span>
          </TabsTrigger>
          <TabsTrigger 
            value="ai-insights" 
            className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600 data-[state=active]:text-white rounded-lg font-medium"
          >
            <Brain className="w-5 h-5" />
            <span className="hidden sm:inline">AI Insights</span>
          </TabsTrigger>
          <TabsTrigger 
            value="compliance" 
            className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-600 data-[state=active]:to-red-600 data-[state=active]:text-white rounded-lg font-medium"
          >
            <Shield className="w-5 h-5" />
            <span className="hidden sm:inline">Compliance</span>
          </TabsTrigger>
          <TabsTrigger 
            value="automation" 
            className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-gray-600 data-[state=active]:to-slate-600 data-[state=active]:text-white rounded-lg font-medium"
          >
            <Zap className="w-5 h-5" />
            <span className="hidden sm:inline">Automation</span>
          </TabsTrigger>
        </TabsList>

        {/* Dashboard Tab */}
        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Document Status Chart */}
            <Card className="shadow-xl border-0">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <PieChartIcon className="w-5 h-5" />
                  Document Status Distribution
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={statusChartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {statusChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Smart Insights Preview */}
            <Card className="shadow-xl border-0">
              <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Brain className="w-5 h-5" />
                  AI Smart Insights
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {smartInsights.slice(0, 3).map((insight) => (
                    <div key={insight.id} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-gray-900 text-sm">{insight.title}</h4>
                        <Badge className={`text-xs ${
                          insight.impact === 'high' ? 'bg-red-100 text-red-700' :
                          insight.impact === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {insight.impact}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-600">{insight.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Documents Tab */}
        <TabsContent value="documents" className="space-y-6">
          <Card className="shadow-lg border-0">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search documents..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx,.xlsx,.xls,.jpg,.png"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                  />
                  <Button
                    onClick={() => document.getElementById('file-upload')?.click()}
                    disabled={isProcessing}
                    className="bg-gradient-to-r from-blue-600 to-purple-600"
                  >
                    {isProcessing ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Documents
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredDocuments.map((doc) => (
              <Card key={doc.id} className="shadow-lg border-0 hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-2">{doc.title}</h3>
                      <p className="text-sm text-gray-600 mb-3">{doc.description}</p>
                      <div className="flex flex-wrap gap-2">
                        <Badge className={doc.type === 'import' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}>
                          {doc.type.toUpperCase()}
                        </Badge>
                        <Badge className={getStatusColor(doc.status)}>
                          {doc.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Value:</span>
                      <span className="font-semibold">{(doc.value / 1000000000).toFixed(2)}B {doc.currency}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Risk:</span>
                      <span className={`font-semibold ${getRiskColor(doc.riskScore || 0)}`}>
                        {doc.riskScore}/100
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* AI Insights Tab */}
        <TabsContent value="ai-insights" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {smartInsights.map((insight) => (
              <Card key={insight.id} className="shadow-xl border-0">
                <CardHeader className={`p-4 text-white ${
                  insight.type === 'cost_optimization' ? 'bg-gradient-to-r from-green-600 to-emerald-600' :
                  insight.type === 'compliance_alert' ? 'bg-gradient-to-r from-orange-600 to-red-600' :
                  insight.type === 'route_suggestion' ? 'bg-gradient-to-r from-blue-600 to-indigo-600' :
                  insight.type === 'risk_warning' ? 'bg-gradient-to-r from-red-600 to-pink-600' :
                  'bg-gradient-to-r from-purple-600 to-indigo-600'
                }`}>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    {insight.type === 'cost_optimization' && <DollarSign className="w-5 h-5" />}
                    {insight.type === 'compliance_alert' && <Shield className="w-5 h-5" />}
                    {insight.type === 'route_suggestion' && <Navigation className="w-5 h-5" />}
                    {insight.type === 'risk_warning' && <AlertTriangle className="w-5 h-5" />}
                    {insight.type === 'efficiency_tip' && <Zap className="w-5 h-5" />}
                    {insight.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <p className="text-gray-700 mb-4">{insight.description}</p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <Badge className={`${
                      insight.impact === 'high' ? 'bg-red-100 text-red-700' :
                      insight.impact === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {insight.impact} impact
                    </Badge>
                    {insight.actionRequired && (
                      <Badge className="bg-orange-100 text-orange-700">
                        Action Required
                      </Badge>
                    )}
                  </div>

                  {insight.estimatedSavings && (
                    <div className="p-3 bg-green-50 rounded-lg border border-green-200 mb-4">
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-green-600" />
                        <span className="font-medium text-green-800">
                          Potential Savings: {(insight.estimatedSavings / 1000000).toFixed(1)}M VND
                        </span>
                      </div>
                    </div>
                  )}

                  {insight.deadline && (
                    <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-orange-600" />
                        <span className="font-medium text-orange-800">
                          Deadline: {insight.deadline.toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Compliance Tab */}
        <TabsContent value="compliance" className="space-y-6">
          <Card className="shadow-xl border-0">
            <CardHeader className="bg-gradient-to-r from-orange-600 to-red-600 text-white p-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Shield className="w-5 h-5" />
                Compliance Monitoring Dashboard
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-6 bg-green-50 rounded-xl border border-green-200">
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    {stats.averageComplianceScore.toFixed(0)}%
                  </div>
                  <div className="text-green-700 font-medium">Average Compliance</div>
                  <div className="text-xs text-green-600 mt-1">Across all documents</div>
                </div>
                
                <div className="text-center p-6 bg-orange-50 rounded-xl border border-orange-200">
                  <div className="text-3xl font-bold text-orange-600 mb-2">
                    {stats.averageRiskScore.toFixed(0)}
                  </div>
                  <div className="text-orange-700 font-medium">Risk Score</div>
                  <div className="text-xs text-orange-600 mt-1">Lower is better</div>
                </div>
                
                <div className="text-center p-6 bg-blue-50 rounded-xl border border-blue-200">
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    {documents.filter(d => d.status === 'approved').length}
                  </div>
                  <div className="text-blue-700 font-medium">Approved</div>
                  <div className="text-xs text-blue-600 mt-1">Ready for processing</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Automation Tab */}
        <TabsContent value="automation" className="space-y-6">
          <Card className="shadow-xl border-0">
            <CardHeader className="bg-gradient-to-r from-gray-600 to-slate-600 text-white p-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Zap className="w-5 h-5" />
                Automation & File Learning
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                    <Brain className="w-5 h-5 text-purple-600" />
                    AI Learning Progress
                  </h3>
                  
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Document Classification</span>
                        <span className="font-medium">95%</span>
                      </div>
                      <Progress value={95} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Compliance Detection</span>
                        <span className="font-medium">88%</span>
                      </div>
                      <Progress value={88} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Risk Assessment</span>
                        <span className="font-medium">92%</span>
                      </div>
                      <Progress value={92} className="h-2" />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-blue-600" />
                    Automation Rules
                  </h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-700">Auto-classify documents</span>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-700">Risk alerts</span>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-700">Compliance monitoring</span>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-700">Cost optimization suggestions</span>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnhancedImportExportCenter;
