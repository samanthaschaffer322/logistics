'use client'

import React, { useState, useRef, useCallback } from 'react'
import Layout from '@/components/Layout'
import { useLanguage } from '@/contexts/LanguageContext'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import { 
  Upload, 
  FileText, 
  Brain, 
  Zap, 
  Download, 
  X, 
  CheckCircle, 
  AlertTriangle,
  Loader2,
  BarChart3,
  TrendingUp,
  MapPin,
  DollarSign,
  Clock,
  Truck,
  Package,
  Activity,
  Lightbulb,
  FileSpreadsheet,
  Eye,
  Trash2
} from 'lucide-react'

interface UploadedFile {
  id: string
  name: string
  size: number
  type: string
  content?: string
  uploadedAt: Date
  status: 'uploaded' | 'processing' | 'completed' | 'error'
  progress?: number
}

interface AIInsight {
  id: string
  type: 'cost_optimization' | 'route_efficiency' | 'demand_forecast' | 'risk_analysis'
  title: string
  description: string
  impact: 'high' | 'medium' | 'low'
  savings?: number
  confidence: number
}

const FilelearningPage = () => {
  const { language, t } = useLanguage()
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [processingProgress, setProcessingProgress] = useState(0)
  const [aiInsights, setAiInsights] = useState<AIInsight[]>([])
  const [isDragOver, setIsDragOver] = useState(false)
  const [analysisResults, setAnalysisResults] = useState<any>(null)
  
  const fileInputRef = useRef<HTMLInputElement>(null)
  const dropZoneRef = useRef<HTMLDivElement>(null)

  const handleFileSelect = useCallback((files: FileList) => {
    const newFiles: UploadedFile[] = Array.from(files).map(file => ({
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: file.size,
      type: file.type,
      uploadedAt: new Date(),
      status: 'uploaded'
    }))

    setUploadedFiles(prev => [...prev, ...newFiles])

    // Read file contents
    newFiles.forEach(fileObj => {
      const file = files[Array.from(files).findIndex(f => f.name === fileObj.name)]
      const reader = new FileReader()
      
      reader.onload = (e) => {
        const content = e.target?.result as string
        setUploadedFiles(prev => prev.map(f => 
          f.id === fileObj.id ? { ...f, content } : f
        ))
      }
      
      reader.readAsText(file)
    })
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    
    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleFileSelect(files)
    }
  }, [handleFileSelect])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const removeFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId))
  }

  const removeAllFiles = () => {
    setUploadedFiles([])
    setAiInsights([])
    setAnalysisResults(null)
  }

  const startAIAnalysis = async () => {
    if (uploadedFiles.length === 0) {
      alert(language === 'vi' ? 'Vui lòng upload file trước' : 'Please upload files first')
      return
    }

    setIsProcessing(true)
    setProcessingProgress(0)

    // Simulate processing steps
    const steps = [
      { progress: 20, message: language === 'vi' ? 'Trích xuất dữ liệu từ Excel' : 'Extracting data from Excel' },
      { progress: 40, message: language === 'vi' ? 'Phân tích patterns & trends' : 'Analyzing patterns & trends' },
      { progress: 60, message: language === 'vi' ? 'Tối ưu tuyến đường & chi phí' : 'Optimizing routes & costs' },
      { progress: 80, message: language === 'vi' ? 'Dự đoán nhu cầu tương lai' : 'Predicting future demand' },
      { progress: 100, message: language === 'vi' ? 'Hoàn thành phân tích' : 'Analysis complete' }
    ]

    for (const step of steps) {
      await new Promise(resolve => setTimeout(resolve, 1000))
      setProcessingProgress(step.progress)
    }

    // Generate AI insights
    const insights: AIInsight[] = [
      {
        id: '1',
        type: 'cost_optimization',
        title: language === 'vi' ? 'Tối ưu chi phí vận chuyển' : 'Transportation Cost Optimization',
        description: language === 'vi' 
          ? 'Phát hiện cơ hội tiết kiệm 15% chi phí bằng cách tối ưu tuyến đường và consolidation'
          : 'Identified 15% cost savings opportunity through route optimization and consolidation',
        impact: 'high',
        savings: 2500000,
        confidence: 92
      },
      {
        id: '2',
        type: 'route_efficiency',
        title: language === 'vi' ? 'Hiệu suất tuyến đường' : 'Route Efficiency',
        description: language === 'vi'
          ? 'Tuyến TP.HCM - Hà Nội có thể cải thiện 20% thời gian giao hàng'
          : 'HCMC - Hanoi route can improve delivery time by 20%',
        impact: 'high',
        confidence: 88
      },
      {
        id: '3',
        type: 'demand_forecast',
        title: language === 'vi' ? 'Dự báo nhu cầu' : 'Demand Forecast',
        description: language === 'vi'
          ? 'Nhu cầu vận chuyển dự kiến tăng 25% trong Q4'
          : 'Transportation demand expected to increase 25% in Q4',
        impact: 'medium',
        confidence: 85
      },
      {
        id: '4',
        type: 'risk_analysis',
        title: language === 'vi' ? 'Phân tích rủi ro' : 'Risk Analysis',
        description: language === 'vi'
          ? 'Cảnh báo: Tuyến miền Trung có nguy cơ delay cao do thời tiết'
          : 'Warning: Central region routes have high delay risk due to weather',
        impact: 'medium',
        confidence: 78
      }
    ]

    setAiInsights(insights)

    // Generate analysis results
    const results = {
      totalRecords: uploadedFiles.length * 150 + Math.floor(Math.random() * 100),
      totalCost: 45000000 + Math.floor(Math.random() * 10000000),
      avgDistance: 280 + Math.floor(Math.random() * 50),
      efficiency: 87 + Math.floor(Math.random() * 10),
      onTimeDelivery: 92 + Math.floor(Math.random() * 5),
      fuelEfficiency: 35 + Math.floor(Math.random() * 5)
    }

    setAnalysisResults(results)
    setIsProcessing(false)
  }

  const demoWithSampleFile = async () => {
    // Add a demo file
    const demoFile: UploadedFile = {
      id: 'demo-' + Date.now(),
      name: 'ke-hoach-ngay-demo.xlsx',
      size: 45678,
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      content: 'demo-content',
      uploadedAt: new Date(),
      status: 'uploaded'
    }

    setUploadedFiles([demoFile])
    
    // Start analysis immediately
    setTimeout(() => {
      startAIAnalysis()
    }, 500)
  }

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'cost_optimization':
        return <DollarSign className="w-5 h-5" />
      case 'route_efficiency':
        return <MapPin className="w-5 h-5" />
      case 'demand_forecast':
        return <TrendingUp className="w-5 h-5" />
      case 'risk_analysis':
        return <AlertTriangle className="w-5 h-5" />
      default:
        return <Lightbulb className="w-5 h-5" />
    }
  }

  const getInsightColor = (impact: string) => {
    switch (impact) {
      case 'high':
        return 'border-red-500/20 bg-red-500/10 text-red-300'
      case 'medium':
        return 'border-yellow-500/20 bg-yellow-500/10 text-yellow-300'
      case 'low':
        return 'border-green-500/20 bg-green-500/10 text-green-300'
      default:
        return 'border-blue-500/20 bg-blue-500/10 text-blue-300'
    }
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold gradient-text flex items-center gap-3">
              <Brain className="w-8 h-8 text-indigo-400" />
              {language === 'vi' ? 'AI File Learning Engine' : 'AI File Learning Engine'}
            </h1>
            <p className="text-slate-400 mt-1">
              {language === 'vi' 
                ? 'Upload và phân tích các file kế hoạch logistics để nhận insights thông minh từ AI'
                : 'Upload and analyze logistics planning files to receive intelligent AI insights'
              }
            </p>
          </div>
          <LanguageSwitcher />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* File Upload Section */}
          <div className="lg:col-span-2 space-y-4">
            {/* Upload Area */}
            <div className="dark-card p-6">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <Upload className="w-6 h-6 text-indigo-400" />
                {language === 'vi' ? 'Upload Files Kế Hoạch Logistics' : 'Upload Logistics Planning Files'}
              </h2>
              <p className="text-slate-400 mb-6">
                {language === 'vi' 
                  ? 'Upload các file Excel kế hoạch ngày để AI phân tích và đưa ra khuyến nghị tối ưu'
                  : 'Upload Excel daily planning files for AI analysis and optimization recommendations'
                }
              </p>

              {/* Drop Zone */}
              <div
                ref={dropZoneRef}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300 ${
                  isDragOver 
                    ? 'border-indigo-400 bg-indigo-500/10' 
                    : 'border-slate-600 hover:border-slate-500 hover:bg-slate-800/50'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept=".xlsx,.xls,.csv,.pdf"
                  onChange={(e) => e.target.files && handleFileSelect(e.target.files)}
                  className="hidden"
                />
                
                <div className="space-y-4">
                  <div className="mx-auto w-16 h-16 bg-indigo-500/20 rounded-full flex items-center justify-center">
                    <Upload className="w-8 h-8 text-indigo-400" />
                  </div>
                  
                  <div>
                    <p className="text-lg font-medium text-white mb-2">
                      {isDragOver 
                        ? (language === 'vi' ? 'Thả files vào đây' : 'Drop files here')
                        : (language === 'vi' ? 'Kéo thả files hoặc click để chọn' : 'Drag and drop files or click to select')
                      }
                    </p>
                    <p className="text-sm text-slate-400">
                      {language === 'vi' 
                        ? 'Hỗ trợ: Excel (.xlsx, .xls), CSV, PDF • Tối đa 10MB mỗi file'
                        : 'Supported: Excel (.xlsx, .xls), CSV, PDF • Max 10MB per file'
                      }
                    </p>
                  </div>
                </div>
              </div>

              {/* Demo Button */}
              <div className="mt-4 text-center">
                <button
                  onClick={demoWithSampleFile}
                  className="dark-button px-6 py-2 rounded-xl text-sm"
                >
                  <FileSpreadsheet className="w-4 h-4 mr-2" />
                  {language === 'vi' ? 'Demo với file mẫu' : 'Demo with sample file'}
                </button>
              </div>
            </div>

            {/* Uploaded Files */}
            {uploadedFiles.length > 0 && (
              <div className="dark-card p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <FileText className="w-5 h-5 text-green-400" />
                    {language === 'vi' ? 'Files đã upload' : 'Files uploaded'} ({uploadedFiles.length})
                  </h3>
                  <button
                    onClick={removeAllFiles}
                    className="text-red-400 hover:text-red-300 text-sm flex items-center gap-1"
                  >
                    <Trash2 className="w-4 h-4" />
                    {language === 'vi' ? 'Xóa tất cả' : 'Remove all'}
                  </button>
                </div>

                <div className="space-y-2">
                  {uploadedFiles.map(file => (
                    <div key={file.id} className="flex items-center justify-between p-3 bg-slate-800 rounded-lg">
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-blue-400" />
                        <div>
                          <p className="text-white text-sm font-medium">{file.name}</p>
                          <p className="text-slate-400 text-xs">
                            {(file.size / 1024).toFixed(1)} KB • {file.uploadedAt.toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {file.status === 'completed' && <CheckCircle className="w-4 h-4 text-green-400" />}
                        {file.status === 'processing' && <Loader2 className="w-4 h-4 text-indigo-400 animate-spin" />}
                        {file.status === 'error' && <AlertTriangle className="w-4 h-4 text-red-400" />}
                        <button
                          onClick={() => removeFile(file.id)}
                          className="text-slate-400 hover:text-red-400"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* AI Processing Engine */}
            <div className="dark-card p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Brain className="w-5 h-5 text-purple-400" />
                {language === 'vi' ? 'AI Processing Engine' : 'AI Processing Engine'}
              </h3>
              <p className="text-slate-400 mb-6">
                {language === 'vi' 
                  ? 'Phân tích thông minh với machine learning'
                  : 'Intelligent analysis with machine learning'
                }
              </p>

              {!isProcessing && uploadedFiles.length === 0 && (
                <div className="text-center py-8">
                  <Brain className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                  <p className="text-slate-500">
                    {language === 'vi' 
                      ? 'Sẵn sàng nhận files logistics...'
                      : 'Ready to receive logistics files...'
                    }
                  </p>
                </div>
              )}

              {!isProcessing && uploadedFiles.length > 0 && (
                <button
                  onClick={startAIAnalysis}
                  className="gradient-button w-full py-3 rounded-xl font-semibold flex items-center justify-center gap-2"
                >
                  <Zap className="w-5 h-5" />
                  {language === 'vi' ? 'Bắt đầu phân tích AI' : 'Start AI Analysis'}
                </button>
              )}

              {isProcessing && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-white font-medium">
                      {language === 'vi' ? 'Đang phân tích AI...' : 'Analyzing with AI...'}
                    </span>
                    <span className="text-indigo-400">{processingProgress}%</span>
                  </div>
                  
                  <div className="w-full bg-slate-700 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-indigo-500 to-purple-500 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${processingProgress}%` }}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2 text-slate-300">
                      <FileSpreadsheet className="w-4 h-4" />
                      {language === 'vi' ? 'Trích xuất dữ liệu từ Excel' : 'Extract data from Excel'}
                    </div>
                    <div className="flex items-center gap-2 text-slate-300">
                      <BarChart3 className="w-4 h-4" />
                      {language === 'vi' ? 'Phân tích patterns & trends' : 'Analyze patterns & trends'}
                    </div>
                    <div className="flex items-center gap-2 text-slate-300">
                      <MapPin className="w-4 h-4" />
                      {language === 'vi' ? 'Tối ưu tuyến đường & chi phí' : 'Optimize routes & costs'}
                    </div>
                    <div className="flex items-center gap-2 text-slate-300">
                      <TrendingUp className="w-4 h-4" />
                      {language === 'vi' ? 'Dự đoán nhu cầu tương lai' : 'Predict future demand'}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Results Panel */}
          <div className="space-y-4">
            {/* Analysis Summary */}
            {analysisResults && (
              <div className="dark-card p-4">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-green-400" />
                  {language === 'vi' ? 'Tóm tắt phân tích' : 'Analysis Summary'}
                </h3>
                
                <div className="space-y-3">
                  <div className="text-center p-3 bg-blue-500/10 rounded-xl border border-blue-500/20">
                    <div className="text-2xl font-bold text-blue-400">{analysisResults.totalRecords}</div>
                    <div className="text-xs text-blue-300">
                      {language === 'vi' ? 'Bản ghi' : 'Records'}
                    </div>
                  </div>
                  
                  <div className="text-center p-3 bg-green-500/10 rounded-xl border border-green-500/20">
                    <div className="text-2xl font-bold text-green-400">
                      {(analysisResults.totalCost / 1000000).toFixed(1)}M
                    </div>
                    <div className="text-xs text-green-300">VNĐ</div>
                  </div>
                  
                  <div className="text-center p-3 bg-purple-500/10 rounded-xl border border-purple-500/20">
                    <div className="text-2xl font-bold text-purple-400">{analysisResults.efficiency}%</div>
                    <div className="text-xs text-purple-300">
                      {language === 'vi' ? 'Hiệu suất' : 'Efficiency'}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* AI Insights */}
            {aiInsights.length > 0 && (
              <div className="dark-card p-4">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-yellow-400" />
                  {language === 'vi' ? 'AI Insights' : 'AI Insights'}
                </h3>
                
                <div className="space-y-3">
                  {aiInsights.map(insight => (
                    <div key={insight.id} className={`p-3 rounded-xl border ${getInsightColor(insight.impact)}`}>
                      <div className="flex items-start gap-2 mb-2">
                        {getInsightIcon(insight.type)}
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">{insight.title}</h4>
                          <p className="text-xs opacity-80 mt-1">{insight.description}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between text-xs">
                        <span className="opacity-60">
                          {language === 'vi' ? 'Độ tin cậy:' : 'Confidence:'} {insight.confidence}%
                        </span>
                        {insight.savings && (
                          <span className="font-medium">
                            {language === 'vi' ? 'Tiết kiệm:' : 'Savings:'} {(insight.savings / 1000000).toFixed(1)}M VNĐ
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <button className="dark-button w-full mt-4 py-2 text-sm">
                  <Download className="w-4 h-4 mr-2" />
                  {language === 'vi' ? 'Tải xuống kết quả' : 'Download results'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default FilelearningPage
