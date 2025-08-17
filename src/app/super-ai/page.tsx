'use client'

import React, { useState, useCallback } from 'react'
import AuthGuard from '@/components/AuthGuard'
import { useLanguage } from '@/contexts/LanguageContext'
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  Button,
  Input,
  Label,
  Badge,
  Textarea
} from '@/components/ui-components'
import { 
  Brain, 
  Upload, 
  FileSpreadsheet, 
  Download, 
  Zap,
  CheckCircle,
  AlertTriangle,
  Info,
  Loader2,
  FileText,
  Calendar,
  Truck,
  MapPin,
  Clock,
  DollarSign,
  BarChart3,
  Settings,
  Sparkles,
  Database,
  FileCheck,
  Target,
  TrendingUp,
  Activity
} from 'lucide-react'

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadedAt: Date;
  status: 'processing' | 'completed' | 'error';
  insights?: string[];
}

interface GeneratedPlan {
  id: string;
  title: string;
  generatedAt: Date;
  routes: Array<{
    from: string;
    to: string;
    vehicle: string;
    time: string;
    cost: number;
  }>;
  summary: {
    totalRoutes: number;
    totalCost: number;
    estimatedTime: string;
    efficiency: number;
  };
}

const SuperAIAssistant = () => {
  const { t, language } = useLanguage()
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [generatedPlans, setGeneratedPlans] = useState<GeneratedPlan[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [aiPrompt, setAiPrompt] = useState('')

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files)
    }
  }, [])

  const handleFiles = async (files: FileList) => {
    setIsProcessing(true)
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const newFile: UploadedFile = {
        id: Date.now().toString() + i,
        name: file.name,
        size: file.size,
        type: file.type,
        uploadedAt: new Date(),
        status: 'processing'
      }
      
      setUploadedFiles(prev => [...prev, newFile])
      
      // Simulate AI processing
      setTimeout(() => {
        const insights = [
          language === 'vi' ? 'Phát hiện 15 tuyến đường logistics' : 'Detected 15 logistics routes',
          language === 'vi' ? 'Tối ưu hóa chi phí 23%' : 'Cost optimization 23%',
          language === 'vi' ? 'Hiệu suất vận chuyển 94.2%' : 'Transport efficiency 94.2%',
          language === 'vi' ? 'Thời gian giao hàng trung bình 2.5h' : 'Average delivery time 2.5h'
        ]
        
        setUploadedFiles(prev => 
          prev.map(f => 
            f.id === newFile.id 
              ? { ...f, status: 'completed', insights }
              : f
          )
        )
      }, 2000 + i * 500)
    }
    
    setIsProcessing(false)
  }

  const generateAIPlan = async () => {
    if (uploadedFiles.length === 0) {
      alert(language === 'vi' ? 'Vui lòng tải lên ít nhất một file để AI học hỏi' : 'Please upload at least one file for AI to learn from')
      return
    }
    
    setIsGenerating(true)
    
    // Simulate AI plan generation
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    const newPlan: GeneratedPlan = {
      id: Date.now().toString(),
      title: language === 'vi' 
        ? `Kế hoạch AI - ${new Date().toLocaleDateString('vi-VN')}`
        : `AI Plan - ${new Date().toLocaleDateString('en-US')}`,
      generatedAt: new Date(),
      routes: [
        {
          from: 'TP. Hồ Chí Minh',
          to: 'Hà Nội',
          vehicle: '40ft Container',
          time: '18:00',
          cost: 15000000
        },
        {
          from: 'Đà Nẵng',
          to: 'Cần Thơ',
          vehicle: '20ft Container',
          time: '14:30',
          cost: 8500000
        },
        {
          from: 'Hải Phòng',
          to: 'Đà Nẵng',
          vehicle: 'Truck',
          time: '09:15',
          cost: 12000000
        }
      ],
      summary: {
        totalRoutes: 3,
        totalCost: 35500000,
        estimatedTime: '12.5h',
        efficiency: 96.8
      }
    }
    
    setGeneratedPlans(prev => [newPlan, ...prev])
    setIsGenerating(false)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount)
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-4">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  {language === 'vi' ? 'Trợ Lý AI Siêu Thông Minh' : 'Super AI Assistant'}
                </h1>
                <p className="text-xl text-slate-300 mt-2">
                  {language === 'vi' 
                    ? 'Học hỏi từ file Excel và tự động tạo kế hoạch logistics'
                    : 'Learn from Excel files and automatically generate logistics plans'
                  }
                </p>
              </div>
            </div>
            
            <div className="flex items-center justify-center gap-4">
              <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 px-4 py-2">
                <Sparkles className="w-4 h-4 mr-2" />
                {language === 'vi' ? 'AI Học Máy' : 'Machine Learning'}
              </Badge>
              <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 px-4 py-2">
                <FileSpreadsheet className="w-4 h-4 mr-2" />
                {language === 'vi' ? 'Xử lý Excel' : 'Excel Processing'}
              </Badge>
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30 px-4 py-2">
                <Target className="w-4 h-4 mr-2" />
                {language === 'vi' ? 'Tự động hóa' : 'Automation'}
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* File Upload Section */}
            <div className="space-y-6">
              <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-white">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                      <Upload className="w-4 h-4 text-white" />
                    </div>
                    {language === 'vi' ? 'Tải lên File Kế Hoạch' : 'Upload Planning Files'}
                  </CardTitle>
                  <CardDescription className="text-slate-400">
                    {language === 'vi' 
                      ? 'Kéo thả hoặc chọn file Excel (.xlsx) để AI học hỏi'
                      : 'Drag & drop or select Excel files (.xlsx) for AI to learn from'
                    }
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div
                    className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
                      dragActive 
                        ? 'border-blue-400 bg-blue-500/10' 
                        : 'border-slate-600 hover:border-slate-500'
                    }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                  >
                    <div className="space-y-4">
                      <div className="w-16 h-16 bg-slate-700/50 rounded-2xl flex items-center justify-center mx-auto">
                        <FileSpreadsheet className="w-8 h-8 text-slate-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-2">
                          {language === 'vi' ? 'Kéo thả file vào đây' : 'Drag files here'}
                        </h3>
                        <p className="text-slate-400 mb-4">
                          {language === 'vi' 
                            ? 'Hỗ trợ: KẾ HOẠCH NGÀY.xlsx, Excel files'
                            : 'Supported: KẾ HOẠCH NGÀY.xlsx, Excel files'
                          }
                        </p>
                        <input
                          type="file"
                          multiple
                          accept=".xlsx,.xls"
                          onChange={(e) => e.target.files && handleFiles(e.target.files)}
                          className="hidden"
                          id="file-upload"
                        />
                        <label htmlFor="file-upload">
                          <Button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white cursor-pointer">
                            <Upload className="w-4 h-4 mr-2" />
                            {language === 'vi' ? 'Chọn File' : 'Select Files'}
                          </Button>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Processing Status */}
                  {isProcessing && (
                    <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
                      <div className="flex items-center gap-3">
                        <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />
                        <span className="text-blue-400 font-medium">
                          {language === 'vi' ? 'AI đang phân tích file...' : 'AI is analyzing files...'}
                        </span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Uploaded Files List */}
              {uploadedFiles.length > 0 && (
                <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50 shadow-xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-white">
                      <FileCheck className="w-5 h-5" />
                      {language === 'vi' ? 'File Đã Tải Lên' : 'Uploaded Files'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {uploadedFiles.map((file) => (
                      <div key={file.id} className="bg-slate-700/30 rounded-xl p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <FileSpreadsheet className="w-5 h-5 text-green-400" />
                            <div>
                              <p className="text-white font-medium">{file.name}</p>
                              <p className="text-slate-400 text-sm">
                                {(file.size / 1024).toFixed(1)} KB • {file.uploadedAt.toLocaleTimeString()}
                              </p>
                            </div>
                          </div>
                          <Badge className={`${
                            file.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                            file.status === 'processing' ? 'bg-blue-500/20 text-blue-400' :
                            'bg-red-500/20 text-red-400'
                          }`}>
                            {file.status === 'completed' ? (
                              language === 'vi' ? 'Hoàn thành' : 'Completed'
                            ) : file.status === 'processing' ? (
                              language === 'vi' ? 'Đang xử lý' : 'Processing'
                            ) : (
                              language === 'vi' ? 'Lỗi' : 'Error'
                            )}
                          </Badge>
                        </div>
                        
                        {file.insights && (
                          <div className="mt-3 space-y-2">
                            <p className="text-slate-300 text-sm font-medium">
                              {language === 'vi' ? 'Thông tin AI phân tích:' : 'AI Insights:'}
                            </p>
                            {file.insights.map((insight, index) => (
                              <div key={index} className="flex items-center gap-2 text-sm">
                                <CheckCircle className="w-3 h-3 text-green-400" />
                                <span className="text-slate-300">{insight}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}
            </div>

            {/* AI Generation Section */}
            <div className="space-y-6">
              <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-white">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                      <Brain className="w-4 h-4 text-white" />
                    </div>
                    {language === 'vi' ? 'Tạo Kế Hoạch AI' : 'Generate AI Plan'}
                  </CardTitle>
                  <CardDescription className="text-slate-400">
                    {language === 'vi' 
                      ? 'AI sẽ học từ file đã tải và tạo kế hoạch tương tự'
                      : 'AI will learn from uploaded files and create similar plans'
                    }
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label className="text-slate-200 font-medium">
                      {language === 'vi' ? 'Yêu cầu đặc biệt (tùy chọn)' : 'Special Requirements (Optional)'}
                    </Label>
                    <textarea
                      placeholder={language === 'vi' 
                        ? 'VD: Tối ưu cho chi phí, ưu tiên tuyến ngắn, tránh giờ cao điểm...'
                        : 'e.g., Optimize for cost, prefer short routes, avoid rush hours...'
                      }
                      value={aiPrompt}
                      onChange={(e) => setAiPrompt(e.target.value)}
                      className="w-full bg-slate-700/50 border border-slate-600/50 text-white placeholder-slate-400 rounded-xl p-4 min-h-[100px] resize-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 focus:outline-none transition-all duration-300"
                    />
                  </div>

                  <Button 
                    onClick={generateAIPlan}
                    disabled={isGenerating || uploadedFiles.length === 0}
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3 rounded-xl"
                  >
                    {isGenerating ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        {language === 'vi' ? 'AI đang tạo kế hoạch...' : 'AI is generating plan...'}
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-5 h-5" />
                        {language === 'vi' ? 'Tạo Kế Hoạch Thông Minh' : 'Generate Smart Plan'}
                      </div>
                    )}
                  </Button>

                  {uploadedFiles.length === 0 && (
                    <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
                      <div className="flex items-center gap-3">
                        <Info className="w-5 h-5 text-yellow-400" />
                        <span className="text-yellow-400 text-sm">
                          {language === 'vi' 
                            ? 'Tải lên file để AI có thể học hỏi và tạo kế hoạch'
                            : 'Upload files for AI to learn and generate plans'
                          }
                        </span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Generated Plans */}
              {generatedPlans.length > 0 && (
                <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50 shadow-xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-white">
                      <Calendar className="w-5 h-5" />
                      {language === 'vi' ? 'Kế Hoạch AI Đã Tạo' : 'Generated AI Plans'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {generatedPlans.map((plan) => (
                      <div key={plan.id} className="bg-slate-700/30 rounded-xl p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-semibold text-white">{plan.title}</h3>
                          <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                            {language === 'vi' ? 'Mới tạo' : 'New'}
                          </Badge>
                        </div>

                        {/* Summary Stats */}
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div className="bg-slate-600/30 rounded-lg p-3 text-center">
                            <div className="text-2xl font-bold text-blue-400">{plan.summary.totalRoutes}</div>
                            <div className="text-slate-400 text-sm">
                              {language === 'vi' ? 'Tuyến đường' : 'Routes'}
                            </div>
                          </div>
                          <div className="bg-slate-600/30 rounded-lg p-3 text-center">
                            <div className="text-2xl font-bold text-green-400">{plan.summary.efficiency}%</div>
                            <div className="text-slate-400 text-sm">
                              {language === 'vi' ? 'Hiệu suất' : 'Efficiency'}
                            </div>
                          </div>
                        </div>

                        {/* Routes */}
                        <div className="space-y-2 mb-4">
                          <h4 className="text-white font-medium">
                            {language === 'vi' ? 'Tuyến đường:' : 'Routes:'}
                          </h4>
                          {plan.routes.map((route, index) => (
                            <div key={index} className="flex items-center justify-between bg-slate-600/20 rounded-lg p-3">
                              <div className="flex items-center gap-3">
                                <Truck className="w-4 h-4 text-blue-400" />
                                <span className="text-white text-sm">
                                  {route.from} → {route.to}
                                </span>
                              </div>
                              <div className="flex items-center gap-4 text-sm">
                                <span className="text-slate-400">{route.vehicle}</span>
                                <span className="text-slate-400">{route.time}</span>
                                <span className="text-green-400 font-medium">
                                  {formatCurrency(route.cost)}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2">
                          <Button className="bg-blue-500/20 text-blue-400 border border-blue-500/30 hover:bg-blue-500/30">
                            <Download className="w-4 h-4 mr-2" />
                            {language === 'vi' ? 'Tải xuống' : 'Download'}
                          </Button>
                          <Button className="bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500/30">
                            <CheckCircle className="w-4 h-4 mr-2" />
                            {language === 'vi' ? 'Áp dụng' : 'Apply'}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  )
}

export default SuperAIAssistant
