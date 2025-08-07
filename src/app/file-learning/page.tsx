'use client'

import React, { useState, useEffect, useCallback } from 'react'
import AuthGuard from '@/components/AuthGuard'
import { useLanguage } from '@/contexts/LanguageContext'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import { chatGPTService } from '@/lib/chatgptService'
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  Button,
  Input,
  Label
} from '@/components/ui-components'
import { 
  Brain, 
  FileSpreadsheet, 
  Upload, 
  Download, 
  TrendingUp, 
  Calendar,
  Truck,
  MapPin,
  Clock,
  BarChart3,
  FileText,
  Lightbulb,
  AlertTriangle,
  CheckCircle,
  Target,
  Zap,
  X
} from 'lucide-react'
import { enhancedFileProcessor, LogisticsRecord, AIInsight, ProcessingResult } from '@/lib/enhancedFileProcessor'
import { aiProcessingEngine } from '@/lib/aiProcessingEngine'

const FilelearningPage = () => {
  const { t } = useLanguage()
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [processingResult, setProcessingResult] = useState<ProcessingResult | null>(null)
  const [processingProgress, setProcessingProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [isDragOver, setIsDragOver] = useState(false)

  // Drag and drop handlers
  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(false)
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(false)

    const files = Array.from(e.dataTransfer.files)
    const validFiles = files.filter(file => 
      file.name.endsWith('.xlsx') || 
      file.name.endsWith('.xls') || 
      file.name.endsWith('.csv')
    )

    if (validFiles.length !== files.length) {
      setError('Some files were skipped. Only Excel (.xlsx, .xls) and CSV files are supported.')
    } else {
      setError(null)
    }

    if (validFiles.length > 0) {
      setUploadedFiles(prev => [...prev, ...validFiles])
    }
  }, [])

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files) {
      const newFiles = Array.from(files).filter(file => 
        file.name.endsWith('.xlsx') || file.name.endsWith('.xls') || file.name.endsWith('.csv')
      )
      
      if (newFiles.length !== files.length) {
        setError('Some files were skipped. Only Excel (.xlsx, .xls) and CSV files are supported.')
      } else {
        setError(null)
      }
      
      setUploadedFiles(prev => [...prev, ...newFiles])
    }
  }

  const processFiles = async () => {
    if (uploadedFiles.length === 0) return
    
    setIsProcessing(true)
    setError(null)
    setProcessingProgress(0)
    
    try {
      // Set up progress tracking
      aiProcessingEngine.onProgress((progress, status) => {
        setProcessingProgress(progress)
        console.log(`Processing: ${progress}% - ${status}`)
      })
      
      // Use AI processing engine for comprehensive analysis
      const result = await aiProcessingEngine.processFiles(uploadedFiles)
      
      setProcessingResult(result)
    } catch (error) {
      console.error('File processing error:', error)
      setError(`Processing failed: ${error}. Please check your Excel files and try again.`)
    } finally {
      setIsProcessing(false)
      setTimeout(() => setProcessingProgress(0), 1000)
    }
  }

  const processSampleFile = async () => {
    setIsProcessing(true)
    setError(null)
    setProcessingProgress(0)
    
    try {
      // Set up progress tracking
      aiProcessingEngine.onProgress((progress, status) => {
        setProcessingProgress(progress)
        console.log(`Processing sample: ${progress}% - ${status}`)
      })
      
      // Process the sample file with enhanced AI
      const result = await aiProcessingEngine.processSampleFile('/Users/aelitapham/Downloads/KẾ HOẠCH NGÀY.xlsx')
      
      // Get additional AI insights from ChatGPT
      if (result.success && result.records.length > 0) {
        setProcessingProgress(95)
        const aiInsights = await chatGPTService.generateLogisticsInsights(result.records)
        
        // Add AI insights to the result
        const enhancedInsights = aiInsights.map((insight, index) => ({
          id: `ai_insight_${index}`,
          type: 'recommendation' as const,
          category: 'optimization' as const,
          title: `AI Insight ${index + 1}`,
          description: insight,
          impact: 'medium' as const,
          confidence: 85,
          actionable: true,
          suggestedActions: [`Implement: ${insight.substring(0, 50)}...`]
        }))
        
        result.insights = [...result.insights, ...enhancedInsights]
      }
      
      setProcessingResult(result)
    } catch (error) {
      console.error('Sample file processing error:', error)
      setError(`Sample processing failed: ${error.message}. This is a demo of AI analysis capabilities.`)
    } finally {
      setIsProcessing(false)
      setTimeout(() => setProcessingProgress(0), 1000)
    }
  }

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index))
  }

  const downloadResults = () => {
    if (!processingResult) return
    
    const dataStr = JSON.stringify(processingResult, null, 2)
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
    
    const exportFileDefaultName = `logistics_analysis_${new Date().toISOString().split('T')[0]}.json`
    
    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()
  }

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'text-red-600 bg-red-100 border-red-200'
      case 'medium': return 'text-yellow-600 bg-yellow-100 border-yellow-200'
      case 'low': return 'text-green-600 bg-green-100 border-green-200'
      default: return 'text-gray-600 bg-gray-100 border-gray-200'
    }
  }

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'optimization': return <TrendingUp className="w-4 h-4" />
      case 'prediction': return <BarChart3 className="w-4 h-4" />
      case 'recommendation': return <Lightbulb className="w-4 h-4" />
      case 'alert': return <AlertTriangle className="w-4 h-4" />
      default: return <Brain className="w-4 h-4" />
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'route': return <MapPin className="w-4 h-4" />
      case 'cost': return <TrendingUp className="w-4 h-4" />
      case 'time': return <Clock className="w-4 h-4" />
      case 'resource': return <Truck className="w-4 h-4" />
      case 'safety': return <AlertTriangle className="w-4 h-4" />
      default: return <Target className="w-4 h-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed': return 'bg-green-100 text-green-800'
      case 'in transit': return 'bg-blue-100 text-blue-800'
      case 'preparing': return 'bg-yellow-100 text-yellow-800'
      case 'delayed': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-slate-900 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">{t('file.title')}</h1>
                <p className="text-slate-400">{t('file.description')}</p>
              </div>
              <LanguageSwitcher />
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
              <AlertTriangle className="w-5 h-5" />
              <span>{error}</span>
            </div>
          )}

          {/* File Upload Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="w-5 h-5" />
                  Upload Files Kế Hoạch Logistics
                </CardTitle>
                <CardDescription>
                  Upload các file Excel kế hoạch ngày để AI phân tích và đưa ra khuyến nghị tối ưu
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div 
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300 ${
                    isDragOver 
                      ? 'border-indigo-500 bg-indigo-50 scale-105' 
                      : 'border-slate-300 hover:border-indigo-400'
                  }`}
                  onDragEnter={handleDragEnter}
                  onDragLeave={handleDragLeave}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                >
                  <FileSpreadsheet className={`w-12 h-12 mx-auto mb-4 transition-colors ${
                    isDragOver ? 'text-indigo-600' : 'text-slate-400'
                  }`} />
                  <Label htmlFor="file-upload" className="cursor-pointer">
                    <span className={`text-lg font-medium transition-colors ${
                      isDragOver 
                        ? 'text-indigo-700' 
                        : 'text-slate-700 hover:text-indigo-600'
                    }`}>
                      {isDragOver ? 'Thả files vào đây' : 'Kéo thả files hoặc click để chọn'}
                    </span>
                    <Input
                      id="file-upload"
                      type="file"
                      multiple
                      accept=".xlsx,.xls,.csv,.pdf"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </Label>
                  <p className={`text-sm mt-2 transition-colors ${
                    isDragOver ? 'text-indigo-600' : 'text-slate-500'
                  }`}>
                    Hỗ trợ: Excel (.xlsx, .xls), CSV, PDF • Tối đa 10MB mỗi file
                  </p>
                  {isDragOver && (
                    <div className="mt-4 text-indigo-600 font-medium animate-pulse">
                      📁 Sẵn sàng nhận files logistics...
                    </div>
                  )}
                </div>

                {uploadedFiles.length > 0 && (
                  <div className="mt-6">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium">Files đã upload ({uploadedFiles.length})</h4>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setUploadedFiles([])}
                        className="text-red-600 hover:text-red-700"
                      >
                        Xóa tất cả
                      </Button>
                    </div>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {uploadedFiles.map((file, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                          <FileText className="w-4 h-4 text-slate-600 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{file.name}</p>
                            <p className="text-xs text-slate-500">
                              {(file.size / 1024).toFixed(1)} KB • {file.type || 'Unknown type'}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFile(index)}
                            className="text-red-500 hover:text-red-700 flex-shrink-0"
                          >
                            ×
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5" />
                  AI Processing Engine
                </CardTitle>
                <CardDescription>
                  Phân tích thông minh với machine learning
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {isProcessing && processingProgress > 0 && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Processing...</span>
                        <span>{processingProgress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${processingProgress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                  
                  <Button 
                    onClick={processFiles}
                    disabled={uploadedFiles.length === 0 || isProcessing}
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                    size="lg"
                  >
                    {isProcessing ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Đang phân tích AI...
                      </>
                    ) : (
                      <>
                        <Zap className="w-4 h-4 mr-2" />
                        Bắt đầu phân tích AI
                      </>
                    )}
                  </Button>

                  <Button 
                    onClick={processSampleFile}
                    disabled={isProcessing}
                    variant="outline"
                    className="w-full border-purple-600 text-purple-600 hover:bg-purple-50"
                    size="lg"
                  >
                    <Brain className="w-4 h-4 mr-2" />
                    Demo với file mẫu
                  </Button>
                  
                  <div className="text-sm text-slate-600 space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Trích xuất dữ liệu từ Excel</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>Phân tích patterns & trends</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span>Tối ưu tuyến đường & chi phí</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      <span>Dự đoán nhu cầu tương lai</span>
                    </div>
                  </div>

                  {processingResult && (
                    <div className="pt-4 border-t">
                      <Button
                        onClick={downloadResults}
                        variant="outline"
                        className="w-full"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Tải xuống kết quả
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Processing Summary */}
          {processingResult && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">Tổng quan phân tích</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <FileText className="w-8 h-8 text-blue-600" />
                      <div>
                        <p className="text-2xl font-bold">{processingResult.summary.totalRecords}</p>
                        <p className="text-sm text-slate-600">Bản ghi</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <TrendingUp className="w-8 h-8 text-green-600" />
                      <div>
                        <p className="text-2xl font-bold">
                          {(processingResult.summary.totalCost / 1000000).toFixed(1)}M
                        </p>
                        <p className="text-sm text-slate-600">VNĐ tổng chi phí</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <MapPin className="w-8 h-8 text-purple-600" />
                      <div>
                        <p className="text-2xl font-bold">
                          {processingResult.summary.averageDistance.toFixed(0)}
                        </p>
                        <p className="text-sm text-slate-600">km trung bình</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-8 h-8 text-orange-600" />
                      <div>
                        <p className="text-2xl font-bold">
                          {processingResult.summary.performanceMetrics.onTimeDelivery.toFixed(0)}%
                        </p>
                        <p className="text-sm text-slate-600">Đúng giờ</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* AI Insights */}
          {processingResult?.insights && processingResult.insights.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">AI Insights & Recommendations</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {processingResult.insights.map((insight, index) => (
                  <Card key={index} className={`border-l-4 ${
                    insight.impact === 'high' ? 'border-l-red-500' :
                    insight.impact === 'medium' ? 'border-l-yellow-500' : 'border-l-green-500'
                  }`}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {getInsightIcon(insight.type)}
                          <CardTitle className="text-lg">{insight.title}</CardTitle>
                        </div>
                        <div className="flex items-center gap-2">
                          {getCategoryIcon(insight.category)}
                          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getImpactColor(insight.impact)}`}>
                            {insight.impact.toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-500">
                        <span>{insight.confidence}% confidence</span>
                        {insight.actionable && (
                          <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                            Actionable
                          </span>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-slate-600 mb-3">{insight.description}</p>
                      
                      {insight.suggestedActions && insight.suggestedActions.length > 0 && (
                        <div className="space-y-2">
                          <h5 className="font-medium text-sm text-slate-700">Suggested Actions:</h5>
                          <ul className="space-y-1">
                            {insight.suggestedActions.map((action, actionIndex) => (
                              <li key={actionIndex} className="text-sm text-slate-600 flex items-start gap-2">
                                <span className="text-indigo-500 mt-1">•</span>
                                <span>{action}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Analysis Results */}
          {processingResult?.records && processingResult.records.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-white">Dữ liệu đã xử lý</h2>
                <div className="flex items-center gap-2 text-slate-400">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {processingResult.summary.dateRange.start} - {processingResult.summary.dateRange.end}
                  </span>
                </div>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle>Logistics Records</CardTitle>
                  <CardDescription>
                    AI đã trích xuất và phân tích {processingResult.records.length} bản ghi từ các file Excel
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b bg-slate-50">
                          <th className="text-left p-3 font-medium">Ngày</th>
                          <th className="text-left p-3 font-medium">Tuyến đường</th>
                          <th className="text-left p-3 font-medium">Phương tiện</th>
                          <th className="text-left p-3 font-medium">Tài xế</th>
                          <th className="text-left p-3 font-medium">Hàng hóa</th>
                          <th className="text-left p-3 font-medium">Trạng thái</th>
                          <th className="text-left p-3 font-medium">Chi phí</th>
                          <th className="text-left p-3 font-medium">Khoảng cách</th>
                        </tr>
                      </thead>
                      <tbody>
                        {processingResult.records.slice(0, 20).map((record, index) => (
                          <tr key={record.id} className="border-b hover:bg-slate-50">
                            <td className="p-3">{record.date}</td>
                            <td className="p-3 max-w-xs truncate" title={record.route}>
                              {record.route}
                            </td>
                            <td className="p-3">{record.vehicle}</td>
                            <td className="p-3">{record.driver}</td>
                            <td className="p-3 max-w-xs truncate" title={record.cargo}>
                              {record.cargo}
                            </td>
                            <td className="p-3">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(record.status)}`}>
                                {record.status}
                              </span>
                            </td>
                            <td className="p-3">
                              {record.cost > 0 ? `${record.cost.toLocaleString('vi-VN')} VNĐ` : 'N/A'}
                            </td>
                            <td className="p-3">
                              {record.distance ? `${record.distance} km` : 'N/A'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    
                    {processingResult.records.length > 20 && (
                      <div className="mt-4 p-3 bg-slate-50 rounded-lg text-center text-slate-600">
                        Hiển thị 20/{processingResult.records.length} bản ghi. 
                        <Button variant="link" className="ml-2">
                          Xem tất cả
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Common Routes */}
              {processingResult.summary.commonRoutes.length > 0 && (
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="w-5 h-5" />
                      Tuyến đường phổ biến
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {processingResult.summary.commonRoutes.map((route, index) => (
                        <div key={index} className="p-3 bg-slate-50 rounded-lg">
                          <div className="flex items-center gap-2">
                            <span className="w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-sm font-medium">
                              {index + 1}
                            </span>
                            <span className="text-sm font-medium truncate">{route}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* AI Generated Future Schedule */}
              {processingResult.futureSchedule && processingResult.futureSchedule.length > 0 && (
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="w-5 h-5" />
                      Kế hoạch tương lai (AI Generated)
                    </CardTitle>
                    <CardDescription>
                      AI đã phân tích dữ liệu lịch sử và đề xuất lịch trình cho 7 ngày tới
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {processingResult.futureSchedule.map((schedule) => (
                        <div key={schedule.id} className="p-4 border rounded-lg bg-blue-50">
                          <div className="flex items-center justify-between mb-2">
                            <div className="font-medium">{schedule.date}</div>
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                              AI Suggestion
                            </span>
                          </div>
                          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                            <div>
                              <div className="font-medium text-slate-700">Tuyến đường</div>
                              <div className="text-slate-600">{schedule.route}</div>
                            </div>
                            <div>
                              <div className="font-medium text-slate-700">Hàng hóa</div>
                              <div className="text-slate-600">{schedule.cargo}</div>
                            </div>
                            <div>
                              <div className="font-medium text-slate-700">Trọng lượng</div>
                              <div className="text-slate-600">{schedule.weight.toLocaleString()} kg</div>
                            </div>
                            <div>
                              <div className="font-medium text-slate-700">Chi phí dự kiến</div>
                              <div className="text-slate-600">{schedule.cost.toLocaleString()} VND</div>
                            </div>
                          </div>
                          {schedule.notes && (
                            <div className="mt-2 text-xs text-blue-600 italic">
                              {schedule.notes}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                      <div className="flex items-start gap-2">
                        <Brain className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                        <div className="text-sm text-amber-800">
                          <div className="font-medium">AI Recommendation:</div>
                          <div>Các kế hoạch này được tạo dựa trên phân tích dữ liệu lịch sử. 
                          Vui lòng xem xét và điều chỉnh theo tình hình thực tế.</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
      </div>
    </AuthGuard>
  )
}

export default FilelearningPage
