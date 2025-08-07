'use client'

import React, { useState, useRef, useCallback } from 'react'
import Layout from '@/components/Layout'
import { useLanguage } from '@/contexts/LanguageContext'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import { IntelligentFileProcessor, FileAnalysisResult, AIInsight, AutomationOpportunity } from '@/lib/intelligentFileProcessor'
import { AutomationPlanGenerator, AutomationPlan } from '@/lib/automationPlanGenerator'
import AutomationPlanPreview from '@/components/AutomationPlanPreview'
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
  Trash2,
  Users,
  Cog,
  Target,
  TrendingDown,
  Gauge
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
  analysisResult?: FileAnalysisResult
}

const FilelearningPage = () => {
  const { language, t } = useLanguage()
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [processingProgress, setProcessingProgress] = useState(0)
  const [currentProcessingStep, setCurrentProcessingStep] = useState('')
  const [isDragOver, setIsDragOver] = useState(false)
  const [analysisResults, setAnalysisResults] = useState<FileAnalysisResult | null>(null)
  const [automationPlan, setAutomationPlan] = useState<AutomationPlan | null>(null)
  const [showPlanPreview, setShowPlanPreview] = useState(false)
  
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
    setAnalysisResults(null)
    setAutomationPlan(null)
  }

  const handleDownloadPlan = (format: 'pdf' | 'excel') => {
    if (!automationPlan) return

    const planGenerator = new AutomationPlanGenerator(language)
    let blob: Blob
    let filename: string

    if (format === 'pdf') {
      blob = planGenerator.exportToPDF(automationPlan)
      filename = `automation-plan-${Date.now()}.html`
    } else {
      blob = planGenerator.exportToExcel(automationPlan)
      filename = `automation-plan-${Date.now()}.csv`
    }

    // Create and download file
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.style.display = 'none'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    // Show success message
    alert(language === 'vi' 
      ? `✅ Đã tải xuống ${filename} thành công! File có thể mở bằng ${format === 'pdf' ? 'trình duyệt web' : 'Excel/LibreOffice'}.`
      : `✅ Successfully downloaded ${filename}! File can be opened with ${format === 'pdf' ? 'web browser' : 'Excel/LibreOffice'}.`
    )
  }

  const handlePreviewPlan = () => {
    setShowPlanPreview(true)
  }

  const startIntelligentAnalysis = async () => {
    if (uploadedFiles.length === 0) {
      alert(language === 'vi' ? 'Vui lòng upload file trước' : 'Please upload files first')
      return
    }

    setIsProcessing(true)
    setProcessingProgress(0)

    const processor = new IntelligentFileProcessor(language)
    
    // Processing steps with language support
    const steps = [
      { 
        progress: 15, 
        message: language === 'vi' ? 'Phân tích cấu trúc file và trích xuất dữ liệu...' : 'Analyzing file structure and extracting data...' 
      },
      { 
        progress: 30, 
        message: language === 'vi' ? 'Nhận diện patterns và xu hướng trong dữ liệu...' : 'Identifying patterns and trends in data...' 
      },
      { 
        progress: 50, 
        message: language === 'vi' ? 'Phân tích hiệu suất tuyến đường và chi phí...' : 'Analyzing route performance and costs...' 
      },
      { 
        progress: 70, 
        message: language === 'vi' ? 'Xây dựng mô hình dự báo AI...' : 'Building AI predictive models...' 
      },
      { 
        progress: 85, 
        message: language === 'vi' ? 'Tìm kiếm cơ hội tự động hóa...' : 'Identifying automation opportunities...' 
      },
      { 
        progress: 100, 
        message: language === 'vi' ? 'Tạo insights và khuyến nghị thông minh...' : 'Generating intelligent insights and recommendations...' 
      }
    ]

    for (const step of steps) {
      setCurrentProcessingStep(step.message)
      await new Promise(resolve => setTimeout(resolve, 1200))
      setProcessingProgress(step.progress)
    }

    try {
      // Process the first file with actual intelligent analysis
      const firstFile = uploadedFiles[0]
      if (firstFile.content) {
        const file = new File([firstFile.content], firstFile.name, { type: firstFile.type })
        const result = await processor.processFile(file, firstFile.content)
        
        console.log('Analysis result:', result) // Debug log
        setAnalysisResults(result)
        
        // Generate automation plan
        const planGenerator = new AutomationPlanGenerator(language)
        const plan = planGenerator.generateComprehensivePlan(result)
        console.log('Generated automation plan:', plan) // Debug log
        setAutomationPlan(plan)
        
        // Update file status
        setUploadedFiles(prev => prev.map(f => 
          f.id === firstFile.id 
            ? { ...f, status: 'completed', analysisResult: result }
            : f
        ))

        // Show success message
        setTimeout(() => {
          alert(language === 'vi' 
            ? `✅ Phân tích hoàn thành! Tìm thấy ${result.automationOpportunities.length} cơ hội tự động hóa và ${result.insights.length} insights thông minh.`
            : `✅ Analysis complete! Found ${result.automationOpportunities.length} automation opportunities and ${result.insights.length} intelligent insights.`
          )
        }, 500)
      }
    } catch (error) {
      console.error('Analysis error:', error)
      alert(language === 'vi' ? 'Lỗi khi phân tích file: ' + error.message : 'Error analyzing file: ' + error.message)
    } finally {
      setIsProcessing(false)
    }
  }

  const demoWithSampleFile = async () => {
    // Create a realistic demo file with Vietnamese logistics data
    const demoContent = `Ngày,Tuyến đường,Xe,Tài xế,Chi phí,Thời gian,Khoảng cách,Nhiên liệu
2024-08-01,TP.HCM - Hà Nội,VN-001,Nguyễn Văn A,15000000,12,1700,680
2024-08-02,TP.HCM - Đà Nẵng,VN-002,Trần Văn B,8000000,8,950,380
2024-08-03,Hà Nội - Hải Phòng,VN-003,Lê Văn C,3000000,3,120,48
2024-08-04,TP.HCM - Cần Thơ,VN-004,Phạm Văn D,4500000,4,170,68
2024-08-05,Đà Nẵng - Huế,VN-005,Hoàng Văn E,2500000,2.5,105,42`

    const demoFile: UploadedFile = {
      id: 'demo-' + Date.now(),
      name: language === 'vi' ? 'ke-hoach-logistics-demo.csv' : 'logistics-plan-demo.csv',
      size: demoContent.length,
      type: 'text/csv',
      content: demoContent,
      uploadedAt: new Date(),
      status: 'uploaded'
    }

    setUploadedFiles([demoFile])
    
    // Start analysis immediately with a small delay to show the file was added
    setTimeout(async () => {
      await startIntelligentAnalysis()
    }, 800)
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
      case 'automation':
        return <Cog className="w-5 h-5" />
      case 'performance':
        return <Gauge className="w-5 h-5" />
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

  const getAutomationIcon = (complexity: string) => {
    switch (complexity) {
      case 'low':
        return <CheckCircle className="w-4 h-4 text-green-400" />
      case 'medium':
        return <Clock className="w-4 h-4 text-yellow-400" />
      case 'high':
        return <AlertTriangle className="w-4 h-4 text-red-400" />
      default:
        return <Cog className="w-4 h-4 text-blue-400" />
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
                ? 'Upload và phân tích các file kế hoạch logistics để AI học hỏi và tự động hóa quy trình thay thế nhân sự'
                : 'Upload and analyze logistics planning files for AI learning and process automation to replace human staff'
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
                  ? 'AI sẽ học từ các file Excel/CSV để hiểu quy trình và tự động hóa công việc của nhân viên'
                  : 'AI will learn from Excel/CSV files to understand processes and automate staff work'
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
                  ? 'Phân tích thông minh với machine learning để học hỏi và tự động hóa quy trình'
                  : 'Intelligent analysis with machine learning to learn and automate processes'
                }
              </p>

              {!isProcessing && uploadedFiles.length === 0 && (
                <div className="text-center py-8">
                  <Brain className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                  <p className="text-slate-500">
                    {language === 'vi' 
                      ? 'Sẵn sàng học từ files logistics...'
                      : 'Ready to learn from logistics files...'
                    }
                  </p>
                </div>
              )}

              {!isProcessing && uploadedFiles.length > 0 && (
                <button
                  onClick={startIntelligentAnalysis}
                  className="gradient-button w-full py-3 rounded-xl font-semibold flex items-center justify-center gap-2"
                >
                  <Zap className="w-5 h-5" />
                  {language === 'vi' ? 'Bắt đầu phân tích thông minh' : 'Start Intelligent Analysis'}
                </button>
              )}

              {isProcessing && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-white font-medium">
                      {language === 'vi' ? 'Đang phân tích thông minh...' : 'Intelligent analysis in progress...'}
                    </span>
                    <span className="text-indigo-400">{processingProgress}%</span>
                  </div>
                  
                  <div className="w-full bg-slate-700 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-indigo-500 to-purple-500 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${processingProgress}%` }}
                    />
                  </div>

                  <div className="text-sm text-slate-300 text-center">
                    {currentProcessingStep}
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
                    <div className="text-2xl font-bold text-blue-400">{analysisResults.recordCount}</div>
                    <div className="text-xs text-blue-300">
                      {language === 'vi' ? 'Bản ghi' : 'Records'}
                    </div>
                  </div>
                  
                  <div className="text-center p-3 bg-green-500/10 rounded-xl border border-green-500/20">
                    <div className="text-2xl font-bold text-green-400">{analysisResults.patterns.routePatterns.length}</div>
                    <div className="text-xs text-green-300">
                      {language === 'vi' ? 'Tuyến đường' : 'Routes'}
                    </div>
                  </div>
                  
                  <div className="text-center p-3 bg-purple-500/10 rounded-xl border border-purple-500/20">
                    <div className="text-2xl font-bold text-purple-400">{analysisResults.automationOpportunities.length}</div>
                    <div className="text-xs text-purple-300">
                      {language === 'vi' ? 'Cơ hội tự động' : 'Automation Ops'}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* AI Insights */}
            {analysisResults && analysisResults.insights.length > 0 && (
              <div className="dark-card p-4">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-yellow-400" />
                  {language === 'vi' ? 'AI Insights' : 'AI Insights'}
                </h3>
                
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {analysisResults.insights.map(insight => (
                    <div key={insight.id} className={`p-3 rounded-xl border ${getInsightColor(insight.impact)}`}>
                      <div className="flex items-start gap-2 mb-2">
                        {getInsightIcon(insight.type)}
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">{insight.title}</h4>
                          <p className="text-xs opacity-80 mt-1">{insight.description}</p>
                          <p className="text-xs opacity-60 mt-1">
                            {language === 'vi' ? 'Triển khai:' : 'Implementation:'} {insight.implementation}
                          </p>
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
              </div>
            )}

            {/* Automation Opportunities */}
            {analysisResults && analysisResults.automationOpportunities.length > 0 && (
              <div className="dark-card p-4">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Cog className="w-5 h-5 text-indigo-400" />
                  {language === 'vi' ? 'Cơ hội tự động hóa' : 'Automation Opportunities'}
                </h3>
                
                <div className="space-y-3 max-h-80 overflow-y-auto">
                  {analysisResults.automationOpportunities.map(opportunity => (
                    <div key={opportunity.id} className="p-3 bg-slate-800 rounded-xl border border-slate-700">
                      <div className="flex items-start gap-2 mb-2">
                        {getAutomationIcon(opportunity.complexity)}
                        <div className="flex-1">
                          <h4 className="font-medium text-sm text-white">{opportunity.process}</h4>
                          <p className="text-xs text-slate-400 mt-1">
                            {language === 'vi' ? 'Hiện tại:' : 'Current:'} {opportunity.currentMethod}
                          </p>
                          <p className="text-xs text-green-400 mt-1">
                            {language === 'vi' ? 'Tự động:' : 'Automated:'} {opportunity.automatedMethod}
                          </p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 text-xs mt-2">
                        <div className="text-center p-2 bg-green-500/10 rounded">
                          <div className="font-bold text-green-400">{opportunity.timeSaving}%</div>
                          <div className="text-green-300">{language === 'vi' ? 'Tiết kiệm TG' : 'Time Saved'}</div>
                        </div>
                        <div className="text-center p-2 bg-blue-500/10 rounded">
                          <div className="font-bold text-blue-400">{(opportunity.costSaving / 1000000).toFixed(1)}M</div>
                          <div className="text-blue-300">{language === 'vi' ? 'Tiết kiệm CP' : 'Cost Saved'}</div>
                        </div>
                      </div>

                      {/* Human Replacement Info */}
                      <div className="mt-3 p-2 bg-red-500/10 border border-red-500/20 rounded">
                        <h5 className="text-xs font-medium text-red-300 mb-1">
                          {language === 'vi' ? 'Thay thế nhân sự:' : 'Human Replacement:'}
                        </h5>
                        <div className="text-xs text-red-200">
                          <p>{language === 'vi' ? 'Vị trí:' : 'Roles:'} {opportunity.humanReplacement.roles.join(', ')}</p>
                          <p>{language === 'vi' ? 'Hiệu quả:' : 'Efficiency:'} {opportunity.humanReplacement.efficiency}%</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2 mt-4">
                  <button 
                    onClick={handlePreviewPlan}
                    className="flex-1 dark-button py-2 text-sm flex items-center justify-center gap-2"
                  >
                    <Eye className="w-4 h-4" />
                    {language === 'vi' ? 'Xem trước kế hoạch' : 'Preview plan'}
                  </button>
                  <button 
                    onClick={() => handleDownloadPlan('pdf')}
                    className="flex-1 gradient-button py-2 text-sm flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    {language === 'vi' ? 'Tải xuống kế hoạch tự động hóa' : 'Download automation plan'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Automation Plan Preview Modal */}
        {showPlanPreview && automationPlan && (
          <AutomationPlanPreview
            plan={automationPlan}
            language={language}
            onClose={() => setShowPlanPreview(false)}
            onDownload={handleDownloadPlan}
          />
        )}
      </div>
    </Layout>
  )
}

export default FilelearningPage
