'use client';

import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { readabilityClasses } from '@/lib/improved-theme';
import { 
  FileText, 
  Upload, 
  Brain, 
  Zap, 
  CheckCircle, 
  AlertTriangle,
  Download,
  Settings,
  Play,
  Pause,
  RotateCcw,
  TrendingUp,
  Activity,
  Target,
  Lightbulb,
  Database,
  Cpu,
  BarChart3,
  FileSpreadsheet,
  Calendar,
  Clock,
  Users,
  Building,
  Truck,
  Package
} from 'lucide-react';

interface FileData {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadedAt: Date;
  processed: boolean;
  insights: string[];
  automationSuggestions: string[];
}

interface AutomationPlan {
  id: string;
  name: string;
  description: string;
  triggers: string[];
  actions: string[];
  status: 'draft' | 'active' | 'paused';
  efficiency: number;
  estimatedSavings: number;
}

const ComprehensiveFileLearningSystem: React.FC = () => {
  const [uploadedFiles, setUploadedFiles] = useState<FileData[]>([]);
  const [automationPlans, setAutomationPlans] = useState<AutomationPlan[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [selectedTab, setSelectedTab] = useState('upload');

  // Sample data for demonstration
  const sampleFiles: FileData[] = [
    {
      id: '1',
      name: 'KẾ HOẠCH NGÀY 15-08-2025.xlsx',
      type: 'daily_planning',
      size: 245760,
      uploadedAt: new Date('2025-08-14'),
      processed: true,
      insights: [
        'Phát hiện 15 tuyến đường có thể tối ưu hóa',
        'Tiết kiệm 12% chi phí nhiên liệu nếu áp dụng AI routing',
        'Thời gian giao hàng có thể giảm 8% với lịch trình mới'
      ],
      automationSuggestions: [
        'Tự động tối ưu tuyến đường hàng ngày',
        'Cảnh báo khi có tắc đường trên tuyến chính',
        'Đồng bộ với hệ thống GPS xe tải'
      ]
    },
    {
      id: '2',
      name: 'FILE THEO DÕI XE THÁNG 8.xlsx',
      type: 'vehicle_tracking',
      size: 512000,
      uploadedAt: new Date('2025-08-13'),
      processed: true,
      insights: [
        'Xe VN-001 có hiệu suất nhiên liệu tốt nhất (8.2L/100km)',
        'Phát hiện 3 xe cần bảo trì định kỳ trong tuần tới',
        'Chi phí vận hành trung bình: 2.8M VNĐ/xe/ngày'
      ],
      automationSuggestions: [
        'Tự động lập lịch bảo trì dựa trên km đã đi',
        'Cảnh báo khi tiêu thụ nhiên liệu bất thường',
        'Báo cáo hiệu suất xe hàng tuần'
      ]
    }
  ];

  const sampleAutomationPlans: AutomationPlan[] = [
    {
      id: '1',
      name: 'Tối ưu tuyến đường tự động',
      description: 'Tự động phân tích và tối ưu tuyến đường dựa trên dữ liệu giao thông thời gian thực',
      triggers: ['Khi có đơn hàng mới', 'Mỗi sáng lúc 6:00', 'Khi có cảnh báo tắc đường'],
      actions: ['Tính toán tuyến đường tối ưu', 'Gửi thông báo cho tài xế', 'Cập nhật GPS'],
      status: 'active',
      efficiency: 85,
      estimatedSavings: 2500000
    },
    {
      id: '2',
      name: 'Quản lý bảo trì thông minh',
      description: 'Theo dõi tình trạng xe và tự động lập lịch bảo trì dựa trên AI prediction',
      triggers: ['Khi đạt số km định trước', 'Phát hiện bất thường', 'Lịch định kỳ'],
      actions: ['Tạo lịch bảo trì', 'Đặt phụ tùng', 'Thông báo garage'],
      status: 'draft',
      efficiency: 92,
      estimatedSavings: 1800000
    }
  ];

  // Initialize with sample data
  React.useEffect(() => {
    setUploadedFiles(sampleFiles);
    setAutomationPlans(sampleAutomationPlans);
  }, []);

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    setIsProcessing(true);
    setProcessingProgress(0);

    // Simulate file processing
    const interval = setInterval(() => {
      setProcessingProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsProcessing(false);
          
          // Add processed files
          const newFiles: FileData[] = Array.from(files).map((file, index) => ({
            id: Date.now().toString() + index,
            name: file.name,
            type: file.name.includes('KẾ HOẠCH') ? 'daily_planning' : 
                  file.name.includes('THEO DÕI') ? 'vehicle_tracking' :
                  file.name.includes('BKVC') ? 'transport_cost' : 'other',
            size: file.size,
            uploadedAt: new Date(),
            processed: true,
            insights: [
              'AI đã phân tích thành công dữ liệu logistics',
              'Phát hiện cơ hội tối ưu hóa chi phí',
              'Đề xuất cải thiện hiệu suất vận hành'
            ],
            automationSuggestions: [
              'Tự động hóa quy trình xử lý dữ liệu',
              'Thiết lập cảnh báo thông minh',
              'Tích hợp với hệ thống ERP'
            ]
          }));

          setUploadedFiles(prev => [...prev, ...newFiles]);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  }, []);

  const createAutomationPlan = (fileId: string) => {
    const file = uploadedFiles.find(f => f.id === fileId);
    if (!file) return;

    const newPlan: AutomationPlan = {
      id: Date.now().toString(),
      name: `Tự động hóa ${file.name}`,
      description: `Quy trình tự động cho file ${file.type}`,
      triggers: file.automationSuggestions,
      actions: ['Xử lý dữ liệu', 'Tạo báo cáo', 'Gửi thông báo'],
      status: 'draft',
      efficiency: Math.floor(Math.random() * 20) + 80,
      estimatedSavings: Math.floor(Math.random() * 2000000) + 1000000
    };

    setAutomationPlans(prev => [...prev, newPlan]);
    setSelectedTab('automation');
  };

  const togglePlanStatus = (planId: string) => {
    setAutomationPlans(prev => prev.map(plan => 
      plan.id === planId 
        ? { ...plan, status: plan.status === 'active' ? 'paused' : 'active' }
        : plan
    ));
  };

  const getFileTypeIcon = (type: string) => {
    switch (type) {
      case 'daily_planning': return <Calendar className="w-5 h-5 text-blue-500" />;
      case 'vehicle_tracking': return <Truck className="w-5 h-5 text-green-500" />;
      case 'transport_cost': return <BarChart3 className="w-5 h-5 text-purple-500" />;
      default: return <FileText className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'paused': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'draft': return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className={readabilityClasses.card}>
        <CardHeader>
          <CardTitle className={`flex items-center gap-3 ${readabilityClasses.textPrimary}`}>
            <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
              <Brain className="w-6 h-6 text-white" />
            </div>
            Comprehensive File Learning & Automation System
            <Badge variant="outline" className="ml-2">AI Enhanced</Badge>
          </CardTitle>
          <p className={`${readabilityClasses.textSecondary} leading-relaxed`}>
            Intelligent file processing system that learns from your Vietnamese logistics data 
            and automatically creates optimization plans and automation workflows.
          </p>
        </CardHeader>
      </Card>

      {/* Main Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="upload" className="flex items-center gap-2">
            <Upload className="w-4 h-4" />
            File Upload & Processing
          </TabsTrigger>
          <TabsTrigger value="insights" className="flex items-center gap-2">
            <Lightbulb className="w-4 h-4" />
            AI Insights
          </TabsTrigger>
          <TabsTrigger value="automation" className="flex items-center gap-2">
            <Zap className="w-4 h-4" />
            Automation Planning
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Performance Analytics
          </TabsTrigger>
        </TabsList>

        {/* File Upload & Processing Tab */}
        <TabsContent value="upload" className="space-y-6">
          <Card className={readabilityClasses.card}>
            <CardHeader>
              <CardTitle className={`flex items-center gap-2 ${readabilityClasses.textPrimary}`}>
                <Upload className="w-5 h-5" />
                Upload Vietnamese Logistics Files
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className={`border-2 border-dashed ${readabilityClasses.border} rounded-lg p-8 text-center`}>
                <div className="flex flex-col items-center gap-4">
                  <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                    <FileSpreadsheet className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className={`text-lg font-semibold ${readabilityClasses.textPrimary} mb-2`}>
                      Drop your logistics files here
                    </h3>
                    <p className={`${readabilityClasses.textSecondary} mb-4`}>
                      Supports: Excel (.xlsx, .xls), CSV files
                    </p>
                    <Input
                      type="file"
                      multiple
                      accept=".xlsx,.xls,.csv"
                      onChange={handleFileUpload}
                      className="max-w-xs mx-auto"
                    />
                  </div>
                </div>
              </div>

              {isProcessing && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className={readabilityClasses.textSecondary}>Processing files...</span>
                    <span className={readabilityClasses.textSecondary}>{processingProgress}%</span>
                  </div>
                  <Progress value={processingProgress} />
                </div>
              )}

              {/* Uploaded Files List */}
              <div className="space-y-3">
                <h4 className={`font-semibold ${readabilityClasses.textPrimary}`}>
                  Processed Files ({uploadedFiles.length})
                </h4>
                {uploadedFiles.map((file) => (
                  <Card key={file.id} className={`${readabilityClasses.card} ${readabilityClasses.cardHover}`}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {getFileTypeIcon(file.type)}
                          <div>
                            <h5 className={`font-medium ${readabilityClasses.textPrimary}`}>
                              {file.name}
                            </h5>
                            <p className={`text-sm ${readabilityClasses.textMuted}`}>
                              {(file.size / 1024).toFixed(1)} KB • {file.uploadedAt.toLocaleDateString('vi-VN')}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {file.processed && (
                            <Badge className={readabilityClasses.statusSuccess}>
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Processed
                            </Badge>
                          )}
                          <Button
                            onClick={() => createAutomationPlan(file.id)}
                            size="sm"
                            variant="outline"
                          >
                            <Zap className="w-3 h-3 mr-1" />
                            Create Automation
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* AI Insights Tab */}
        <TabsContent value="insights" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {uploadedFiles.filter(f => f.processed).map((file) => (
              <Card key={file.id} className={readabilityClasses.card}>
                <CardHeader>
                  <CardTitle className={`flex items-center gap-2 ${readabilityClasses.textPrimary}`}>
                    {getFileTypeIcon(file.type)}
                    {file.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h5 className={`font-semibold ${readabilityClasses.textPrimary} mb-2`}>
                      AI Insights:
                    </h5>
                    <ul className="space-y-2">
                      {file.insights.map((insight, index) => (
                        <li key={index} className={`flex items-start gap-2 text-sm ${readabilityClasses.textSecondary}`}>
                          <Lightbulb className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                          {insight}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h5 className={`font-semibold ${readabilityClasses.textPrimary} mb-2`}>
                      Automation Suggestions:
                    </h5>
                    <ul className="space-y-2">
                      {file.automationSuggestions.map((suggestion, index) => (
                        <li key={index} className={`flex items-start gap-2 text-sm ${readabilityClasses.textSecondary}`}>
                          <Zap className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                          {suggestion}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Automation Planning Tab */}
        <TabsContent value="automation" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {automationPlans.map((plan) => (
              <Card key={plan.id} className={readabilityClasses.card}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className={`${readabilityClasses.textPrimary}`}>
                      {plan.name}
                    </CardTitle>
                    <Badge className={getStatusColor(plan.status)}>
                      {plan.status}
                    </Badge>
                  </div>
                  <p className={`${readabilityClasses.textSecondary} text-sm`}>
                    {plan.description}
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div className={`text-2xl font-bold text-blue-600 dark:text-blue-400`}>
                        {plan.efficiency}%
                      </div>
                      <div className={`text-sm ${readabilityClasses.textMuted}`}>
                        Efficiency
                      </div>
                    </div>
                    <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <div className={`text-2xl font-bold text-green-600 dark:text-green-400`}>
                        {(plan.estimatedSavings / 1000000).toFixed(1)}M
                      </div>
                      <div className={`text-sm ${readabilityClasses.textMuted}`}>
                        VNĐ Savings/Month
                      </div>
                    </div>
                  </div>

                  <div>
                    <h5 className={`font-semibold ${readabilityClasses.textPrimary} mb-2`}>
                      Triggers:
                    </h5>
                    <div className="flex flex-wrap gap-1">
                      {plan.triggers.slice(0, 2).map((trigger, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {trigger}
                        </Badge>
                      ))}
                      {plan.triggers.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{plan.triggers.length - 2} more
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={() => togglePlanStatus(plan.id)}
                      size="sm"
                      variant={plan.status === 'active' ? 'destructive' : 'default'}
                    >
                      {plan.status === 'active' ? (
                        <>
                          <Pause className="w-3 h-3 mr-1" />
                          Pause
                        </>
                      ) : (
                        <>
                          <Play className="w-3 h-3 mr-1" />
                          Activate
                        </>
                      )}
                    </Button>
                    <Button size="sm" variant="outline">
                      <Settings className="w-3 h-3 mr-1" />
                      Configure
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Performance Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className={readabilityClasses.card}>
              <CardContent className="p-6 text-center">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full w-fit mx-auto mb-4">
                  <Database className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
                <div className={`text-3xl font-bold ${readabilityClasses.textPrimary} mb-2`}>
                  {uploadedFiles.length}
                </div>
                <div className={`text-sm ${readabilityClasses.textMuted}`}>
                  Files Processed
                </div>
              </CardContent>
            </Card>

            <Card className={readabilityClasses.card}>
              <CardContent className="p-6 text-center">
                <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full w-fit mx-auto mb-4">
                  <Zap className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
                <div className={`text-3xl font-bold ${readabilityClasses.textPrimary} mb-2`}>
                  {automationPlans.filter(p => p.status === 'active').length}
                </div>
                <div className={`text-sm ${readabilityClasses.textMuted}`}>
                  Active Automations
                </div>
              </CardContent>
            </Card>

            <Card className={readabilityClasses.card}>
              <CardContent className="p-6 text-center">
                <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-full w-fit mx-auto mb-4">
                  <TrendingUp className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                </div>
                <div className={`text-3xl font-bold ${readabilityClasses.textPrimary} mb-2`}>
                  {(automationPlans.reduce((sum, plan) => sum + plan.estimatedSavings, 0) / 1000000).toFixed(1)}M
                </div>
                <div className={`text-sm ${readabilityClasses.textMuted}`}>
                  VNĐ Total Savings/Month
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className={readabilityClasses.card}>
            <CardHeader>
              <CardTitle className={`${readabilityClasses.textPrimary}`}>
                System Performance Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className={readabilityClasses.textSecondary}>Processing Efficiency</span>
                    <span className={readabilityClasses.textSecondary}>94%</span>
                  </div>
                  <Progress value={94} />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className={readabilityClasses.textSecondary}>Automation Success Rate</span>
                    <span className={readabilityClasses.textSecondary}>87%</span>
                  </div>
                  <Progress value={87} />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className={readabilityClasses.textSecondary}>Cost Optimization</span>
                    <span className={readabilityClasses.textSecondary}>76%</span>
                  </div>
                  <Progress value={76} />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ComprehensiveFileLearningSystem;
