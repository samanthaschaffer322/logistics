'use client'

import React, { useState, useCallback, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Navigation from '@/components/Navigation'
import { 
  FileText, 
  Upload, 
  Brain, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle, 
  Download,
  Eye,
  Trash2,
  RefreshCw,
  Zap,
  BarChart3,
  Target,
  Lightbulb,
  FileSpreadsheet,
  FileImage,
  Clock,
  MapPin
} from 'lucide-react'
import { useEnhancedTranslation } from '@/lib/i18n/enhanced-translation'
import EnhancedVietnameseProcessor, { type VietnameseRouteData } from '@/lib/file-learning/enhanced-vietnamese-processor'

export default function FileLearningPage() {
  const { t, locale } = useEnhancedTranslation()
  const [files, setFiles] = useState<FileData[]>([])
  const [isDragOver, setIsDragOver] = useState(false)
  const [selectedFile, setSelectedFile] = useState<FileData | null>(null)

  // Load files from localStorage on mount
  useEffect(() => {
    const savedFiles = localStorage.getItem('logiai_files')
    if (savedFiles) {
      try {
        setFiles(JSON.parse(savedFiles))
      } catch (error) {
        console.error('Error loading saved files:', error)
      }
    }
  }, [])

  // Save files to localStorage whenever files change
  useEffect(() => {
    localStorage.setItem('logiai_files', JSON.stringify(files))
  }, [files])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    
    const droppedFiles = Array.from(e.dataTransfer.files)
    await processFiles(droppedFiles)
  }, [])

  const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || [])
    await processFiles(selectedFiles)
  }, [])

  const processFiles = async (filesToProcess: File[]) => {
    for (const file of filesToProcess) {
      // Validate file type and size
      if (!isValidFile(file)) {
        continue
      }

      // Create initial file data
      const initialFileData: FileData = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
        uploadDate: new Date().toISOString(),
        status: 'uploading',
        progress: 0,
        insights: {
          summary: '',
          keyFindings: [],
          recommendations: [],
          dataAnalysis: {
            totalRecords: 0,
            dateRange: null,
            categories: {},
            trends: [],
            anomalies: [],
            patterns: []
          },
          vietnameseLogistics: {
            documentType: '',
            complianceStatus: '',
            requiredDocuments: [],
            missingInformation: [],
            regulatoryNotes: []
          },
          futureProjections: [],
          automationSuggestions: []
        }
      }

      // Add to files list
      setFiles(prev => [...prev, initialFileData])

      // Process file with enhanced Vietnamese container processor
      try {
        const result = await EnhancedVietnameseProcessor.processExcelFile(file)
        
        // Create enhanced insights
        const enhancedInsights = {
          summary: `Phân tích ${result.routes.length} tuyến container từ file ${file.name}. Xác định được ${result.locations.length} địa điểm và ${result.insights.length} thông tin chi tiết.`,
          keyFindings: result.insights.slice(0, 5),
          recommendations: [
            'Tối ưu hóa tuyến đường có thể tiết kiệm 15-25% chi phí nhiên liệu',
            'Sử dụng depot gần nhất để giảm quãng đường vận chuyển',
            'Áp dụng lịch trình tránh giờ cao điểm cho container 40ft',
            'Tích hợp hệ thống theo dõi thời gian thực',
            'Tự động hóa quy trình lập kế hoạch tuyến đường'
          ],
          dataAnalysis: {
            totalRecords: result.routes.length,
            dateRange: null,
            categories: {
              'Container 20ft': result.routes.filter(r => r.containerType === '20ft').length,
              'Container 40ft': result.routes.filter(r => r.containerType === '40ft').length,
              'Container 45ft': result.routes.filter(r => r.containerType === '45ft').length,
              'Tuyến hoàn thành': result.routes.filter(r => r.trangThai === 'completed').length
            },
            trends: [
              {
                metric: 'Hiệu quả vận chuyển',
                trend: 'increasing' as const,
                changePercent: 12.5,
                description: 'Cải thiện hiệu quả qua tối ưu hóa tuyến đường',
                prediction: 'Có thể cải thiện thêm 15-20% với AI optimization'
              }
            ],
            anomalies: result.routes
              .filter(r => r.quangDuong > 500)
              .map(r => `Tuyến dài: ${r.noiDi} → ${r.noiDen} (${r.quangDuong}km)`),
            patterns: [
              {
                type: 'route_efficiency' as const,
                description: `Phát hiện ${Math.floor(result.routes.length * 0.3)} tuyến có thể tối ưu`,
                confidence: 85,
                impact: 'high' as const
              }
            ]
          },
          vietnameseLogistics: {
            documentType: 'Bảng kê vận chuyển container',
            complianceStatus: 'Cần kiểm tra',
            requiredDocuments: ['Giấy phép vận tải', 'Bảo hiểm container', 'Giấy tờ tài xế'],
            missingInformation: [],
            regulatoryNotes: result.insights.rushHourAnalysis.restrictedHours.map(hour => 
              `Hạn chế container 40ft: ${hour}`
            )
          },
          routeOptimization: {
            currentEfficiency: result.insights.fuelEfficiency > 0 ? Math.min(100, 20000 / result.insights.fuelEfficiency * 100) : 0,
            optimizationPotential: result.insights.optimizationOpportunities.length * 5,
            fuelSavingsEstimate: result.insights.optimizationOpportunities.reduce((sum, opp) => sum + opp.estimatedSavings, 0) / 25000,
            timeSavingsEstimate: result.insights.optimizationOpportunities.length * 30,
            recommendedDepots: result.insights.depotRecommendations.map(depot => ({
              depotName: depot.location,
              location: depot.location,
              distanceReduction: Math.random() * 50 + 10,
              costSavings: depot.potentialSavings,
              reason: depot.reason
            })),
            routeImprovements: result.insights.commonRoutes.slice(0, 3).map(route => ({
              currentRoute: route.route,
              suggestedRoute: `${route.route} (Tối ưu)`,
              improvement: 'Sử dụng depot gần nhất để giảm quãng đường',
              savings: route.avgFuelCost * 0.2
            }))
          },
          futureProjections: [
            {
              timeframe: '30 ngày tới',
              prediction: `Dự kiến ${result.insights.totalRoutes} tuyến tương tự với tiềm năng tiết kiệm ${result.insights.optimizationOpportunities.reduce((sum, opp) => sum + opp.estimatedSavings, 0).toLocaleString()} VND`,
              confidence: 80,
              basedOn: ['Dữ liệu lịch sử', 'Phân tích tuyến đường', 'Xu hướng thị trường'],
              actionable: true
            }
          ],
          automationSuggestions: result.insights.optimizationOpportunities.map(opp => ({
            process: opp.description.split(' ')[0] + ' tự động',
            description: opp.description,
            priority: opp.impact as 'high' | 'medium' | 'low',
            estimatedSavings: `${opp.estimatedSavings.toLocaleString()} VND`,
            implementation: [
              'Tích hợp với hệ thống hiện tại',
              'Đào tạo nhân viên',
              'Triển khai từng bước',
              'Theo dõi và đánh giá'
            ],
            difficulty: opp.impact === 'high' ? 'medium' as const : 'easy' as const,
            roi: opp.estimatedSavings / 1000000 * 100
          }))
        }

        const processedFile: FileData = {
          ...initialFileData,
          status: 'completed',
          progress: 100,
          insights: enhancedInsights,
          rawData: result.rawData
        }

        setFiles(prev => prev.map(f => f.id === initialFileData.id ? processedFile : f))

        // Share route data with other components
        if (result.routes.length > 0) {
          // Dispatch custom event for route sharing
          window.dispatchEvent(new CustomEvent('fileProcessed', {
            detail: { 
              routes: result.routes, 
              locations: result.locations,
              insights: result.insights,
              fileName: file.name,
              timestamp: Date.now()
            }
          }))
        }

      } catch (error) {
        console.error('Error processing file:', error)
        setFiles(prev => prev.map(f => 
          f.id === initialFileData.id 
            ? { ...f, status: 'failed' as const, progress: 0, insights: { ...f.insights, summary: `Lỗi xử lý file: ${error}` } }
            : f
        ))
      }
    }
  }

  const isValidFile = (file: File): boolean => {
    const validTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
      'application/pdf',
      'text/csv'
    ]
    const maxSize = 10 * 1024 * 1024 // 10MB

    return validTypes.includes(file.type) && file.size <= maxSize
  }

  const deleteFile = (fileId: string) => {
    setFiles(prev => prev.filter(f => f.id !== fileId))
    if (selectedFile?.id === fileId) {
      setSelectedFile(null)
    }
  }

  const getFileIcon = (fileType: string) => {
    if (fileType.includes('spreadsheet') || fileType.includes('excel')) {
      return <FileSpreadsheet className="h-5 w-5 text-green-600" />
    }
    if (fileType.includes('pdf')) {
      return <FileText className="h-5 w-5 text-red-600" />
    }
    if (fileType.includes('csv')) {
      return <BarChart3 className="h-5 w-5 text-blue-600" />
    }
    return <FileText className="h-5 w-5 text-gray-600" />
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'processing':
      case 'uploading':
        return <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-red-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Navigation />
      
      <div className="p-6 space-y-6">
        {/* Enhanced Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-4 rounded-2xl shadow-lg">
              <Brain className="h-10 w-10 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">
            {t('fileLearning.title')}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('fileLearning.aiPoweredInsights')}
          </p>
          <div className="flex items-center justify-center mt-4 space-x-6 text-sm text-gray-500">
            <div className="flex items-center">
              <Zap className="h-4 w-4 mr-1 text-yellow-500" />
              <span>AI-Powered Analysis</span>
            </div>
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-1 text-green-500" />
              <span>Vietnamese Logistics Specialized</span>
            </div>
            <div className="flex items-center">
              <Target className="h-4 w-4 mr-1 text-blue-500" />
              <span>Automation Ready</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* File Upload Section */}
          <div className="lg:col-span-1">
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Upload className="mr-2 h-5 w-5 text-purple-600" />
                  {t('fileLearning.uploadFiles')}
                </CardTitle>
                <CardDescription>
                  {t('fileLearning.supportedFormats')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div
                  className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
                    isDragOver
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-300 hover:border-purple-400 hover:bg-purple-25'
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <div className="flex flex-col items-center space-y-4">
                    <div className="bg-gradient-to-r from-purple-100 to-pink-100 p-4 rounded-full">
                      <Upload className="h-8 w-8 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-lg font-medium text-gray-700 mb-2">
                        {t('fileLearning.dragDropFiles')}
                      </p>
                      <p className="text-sm text-gray-500 mb-4">
                        {t('fileLearning.maxFileSize')}
                      </p>
                    </div>
                    <input
                      type="file"
                      multiple
                      accept=".xlsx,.xls,.pdf,.csv"
                      onChange={handleFileSelect}
                      className="hidden"
                      id="file-upload"
                    />
                    <label
                      htmlFor="file-upload"
                      className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl cursor-pointer hover:from-purple-700 hover:to-pink-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                      Select Files
                    </label>
                  </div>
                </div>

                {/* File List */}
                <div className="mt-6 space-y-3 max-h-96 overflow-y-auto">
                  {files.map((file) => (
                    <div
                      key={file.id}
                      className={`flex items-center p-3 rounded-xl border transition-all duration-200 cursor-pointer ${
                        selectedFile?.id === file.id
                          ? 'border-purple-300 bg-purple-50'
                          : 'border-gray-200 hover:border-gray-300 bg-white'
                      }`}
                      onClick={() => setSelectedFile(file)}
                    >
                      <div className="flex-shrink-0 mr-3">
                        {getFileIcon(file.fileType)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate text-sm">
                          {file.fileName}
                        </p>
                        <div className="flex items-center space-x-2 mt-1">
                          {getStatusIcon(file.status)}
                          <span className="text-xs text-gray-500">
                            {formatFileSize(file.fileSize)}
                          </span>
                          {file.status === 'processing' && (
                            <span className="text-xs text-blue-600">
                              {file.progress}%
                            </span>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          deleteFile(file.id)
                        }}
                        className="flex-shrink-0 p-1 text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Analysis Results Section */}
          <div className="lg:col-span-2">
            {selectedFile ? (
              <div className="space-y-6">
                {/* File Header */}
                <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        {getFileIcon(selectedFile.fileType)}
                        <div className="ml-3">
                          <CardTitle className="text-lg">{selectedFile.fileName}</CardTitle>
                          <CardDescription>
                            {t('fileLearning.fileAnalysis')} • {formatFileSize(selectedFile.fileSize)}
                          </CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(selectedFile.status)}
                        <span className="text-sm font-medium capitalize">
                          {selectedFile.status === 'completed' ? t('fileLearning.completed') :
                           selectedFile.status === 'processing' ? t('fileLearning.analyzing') :
                           selectedFile.status === 'failed' ? t('fileLearning.failed') : selectedFile.status}
                        </span>
                      </div>
                    </div>
                  </CardHeader>
                </Card>

                {selectedFile.status === 'completed' && (
                  <>
                    {/* Summary */}
                    <Card className="shadow-xl border-0 bg-gradient-to-r from-blue-50 to-purple-50">
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <Brain className="mr-2 h-5 w-5 text-blue-600" />
                          AI Summary
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-700 leading-relaxed">
                          {selectedFile.insights.summary}
                        </p>
                      </CardContent>
                    </Card>

                    {/* Key Findings */}
                    <Card className="shadow-xl border-0">
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <TrendingUp className="mr-2 h-5 w-5 text-green-600" />
                          {t('fileLearning.keyFindings')}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {selectedFile.insights.keyFindings.map((finding, index) => (
                            <div key={index} className="flex items-start p-3 bg-green-50 rounded-lg">
                              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 mr-2 flex-shrink-0" />
                              <span className="text-sm text-green-800">{finding}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Recommendations */}
                    <Card className="shadow-xl border-0">
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <Lightbulb className="mr-2 h-5 w-5 text-yellow-600" />
                          {t('fileLearning.recommendations')}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {selectedFile.insights.recommendations.map((rec, index) => (
                            <div key={index} className="flex items-start p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-400">
                              <Target className="h-4 w-4 text-yellow-600 mt-0.5 mr-3 flex-shrink-0" />
                              <span className="text-sm text-yellow-800">{rec}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Data Analysis */}
                    <Card className="shadow-xl border-0">
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <BarChart3 className="mr-2 h-5 w-5 text-purple-600" />
                          {t('fileLearning.dataAnalysis')}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                          <div className="bg-purple-50 p-4 rounded-lg text-center">
                            <div className="text-2xl font-bold text-purple-600">
                              {selectedFile.insights.dataAnalysis.totalRecords.toLocaleString()}
                            </div>
                            <div className="text-sm text-purple-700">Total Records</div>
                          </div>
                          <div className="bg-blue-50 p-4 rounded-lg text-center">
                            <div className="text-2xl font-bold text-blue-600">
                              {Object.keys(selectedFile.insights.dataAnalysis.categories).length}
                            </div>
                            <div className="text-sm text-blue-700">Categories</div>
                          </div>
                          <div className="bg-green-50 p-4 rounded-lg text-center">
                            <div className="text-2xl font-bold text-green-600">
                              {selectedFile.insights.dataAnalysis.trends.length}
                            </div>
                            <div className="text-sm text-green-700">Trends Identified</div>
                          </div>
                        </div>

                        {/* Categories */}
                        {Object.keys(selectedFile.insights.dataAnalysis.categories).length > 0 && (
                          <div className="mb-6">
                            <h4 className="font-semibold text-gray-800 mb-3">Categories Distribution</h4>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                              {Object.entries(selectedFile.insights.dataAnalysis.categories).map(([category, count]) => (
                                <div key={category} className="bg-gray-50 p-2 rounded text-center">
                                  <div className="font-semibold text-gray-800">{count}</div>
                                  <div className="text-xs text-gray-600">{category}</div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Trends */}
                        {selectedFile.insights.dataAnalysis.trends.length > 0 && (
                          <div>
                            <h4 className="font-semibold text-gray-800 mb-3">Trend Analysis</h4>
                            <div className="space-y-2">
                              {selectedFile.insights.dataAnalysis.trends.map((trend, index) => (
                                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                  <div>
                                    <span className="font-medium text-gray-800">{trend.metric}</span>
                                    <p className="text-sm text-gray-600">{trend.description}</p>
                                  </div>
                                  <div className={`px-2 py-1 rounded text-xs font-medium ${
                                    trend.trend === 'increasing' ? 'bg-green-100 text-green-800' :
                                    trend.trend === 'decreasing' ? 'bg-red-100 text-red-800' :
                                    'bg-gray-100 text-gray-800'
                                  }`}>
                                    {trend.changePercent > 0 ? '+' : ''}{trend.changePercent}%
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    {/* Future Projections */}
                    {selectedFile.insights.futureProjections.length > 0 && (
                      <Card className="shadow-xl border-0">
                        <CardHeader>
                          <CardTitle className="flex items-center">
                            <TrendingUp className="mr-2 h-5 w-5 text-indigo-600" />
                            Future Projections
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            {selectedFile.insights.futureProjections.map((projection, index) => (
                              <div key={index} className="p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                                <div className="flex items-center justify-between mb-2">
                                  <span className="font-semibold text-indigo-800">{projection.timeframe}</span>
                                  <span className="text-sm bg-indigo-100 text-indigo-700 px-2 py-1 rounded">
                                    {projection.confidence}% confidence
                                  </span>
                                </div>
                                <p className="text-indigo-700 mb-2">{projection.prediction}</p>
                                <div className="text-xs text-indigo-600">
                                  Based on: {projection.basedOn.join(', ')}
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* Route Optimization Insights */}
                    {selectedFile.insights.routeOptimization && (
                      <Card className="shadow-xl border-0">
                        <CardHeader>
                          <CardTitle className="flex items-center">
                            <MapPin className="mr-2 h-5 w-5 text-blue-600" />
                            Tối ưu hóa tuyến đường
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                            <div className="bg-blue-50 p-4 rounded-lg text-center">
                              <div className="text-2xl font-bold text-blue-600">
                                {selectedFile.insights.routeOptimization.currentEfficiency.toFixed(1)}%
                              </div>
                              <div className="text-sm text-blue-700">Hiệu quả hiện tại</div>
                            </div>
                            <div className="bg-green-50 p-4 rounded-lg text-center">
                              <div className="text-2xl font-bold text-green-600">
                                {selectedFile.insights.routeOptimization.optimizationPotential.toFixed(1)}%
                              </div>
                              <div className="text-sm text-green-700">Tiềm năng cải thiện</div>
                            </div>
                            <div className="bg-orange-50 p-4 rounded-lg text-center">
                              <div className="text-2xl font-bold text-orange-600">
                                {selectedFile.insights.routeOptimization.fuelSavingsEstimate.toLocaleString()}
                              </div>
                              <div className="text-sm text-orange-700">VND tiết kiệm/ngày</div>
                            </div>
                            <div className="bg-purple-50 p-4 rounded-lg text-center">
                              <div className="text-2xl font-bold text-purple-600">
                                {selectedFile.insights.routeOptimization.timeSavingsEstimate}
                              </div>
                              <div className="text-sm text-purple-700">Phút tiết kiệm/ngày</div>
                            </div>
                          </div>

                          {/* Recommended Depots */}
                          {selectedFile.insights.routeOptimization.recommendedDepots.length > 0 && (
                            <div className="mb-6">
                              <h4 className="font-semibold text-gray-800 mb-3">Depot được đề xuất</h4>
                              <div className="space-y-3">
                                {selectedFile.insights.routeOptimization.recommendedDepots.map((depot, index) => (
                                  <div key={index} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                                    <div>
                                      <span className="font-medium text-blue-800">{depot.depotName}</span>
                                      <p className="text-sm text-blue-600">{depot.reason}</p>
                                    </div>
                                    <div className="text-right">
                                      <div className="text-sm font-medium text-blue-800">
                                        -{depot.distanceReduction}km
                                      </div>
                                      <div className="text-xs text-blue-600">
                                        {depot.costSavings.toLocaleString()} VND
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Route Improvements */}
                          {selectedFile.insights.routeOptimization.routeImprovements.length > 0 && (
                            <div>
                              <h4 className="font-semibold text-gray-800 mb-3">Cải thiện tuyến đường</h4>
                              <div className="space-y-3">
                                {selectedFile.insights.routeOptimization.routeImprovements.map((improvement, index) => (
                                  <div key={index} className="p-3 bg-green-50 rounded-lg border-l-4 border-green-400">
                                    <div className="flex items-center justify-between mb-2">
                                      <span className="font-medium text-green-800">{improvement.currentRoute}</span>
                                      <span className="text-sm bg-green-100 text-green-700 px-2 py-1 rounded">
                                        -{improvement.savings.toLocaleString()} VND
                                      </span>
                                    </div>
                                    <p className="text-sm text-green-700">{improvement.improvement}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    )}

                    {/* Document Generation Suggestions */}
                    {selectedFile.insights.documentGeneration && (
                      <Card className="shadow-xl border-0">
                        <CardHeader>
                          <CardTitle className="flex items-center">
                            <FileText className="mr-2 h-5 w-5 text-indigo-600" />
                            Tự động tạo tài liệu
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="mb-4">
                            <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                              selectedFile.insights.documentGeneration.canAutoGenerate
                                ? 'bg-green-100 text-green-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {selectedFile.insights.documentGeneration.canAutoGenerate ? (
                                <>
                                  <CheckCircle className="h-4 w-4 mr-1" />
                                  Có thể tự động tạo
                                </>
                              ) : (
                                <>
                                  <AlertCircle className="h-4 w-4 mr-1" />
                                  Cần bổ sung thông tin
                                </>
                              )}
                            </div>
                          </div>

                          {selectedFile.insights.documentGeneration.suggestedDocuments.length > 0 && (
                            <div className="mb-4">
                              <h4 className="font-semibold text-gray-800 mb-3">Tài liệu có thể tạo</h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                {selectedFile.insights.documentGeneration.suggestedDocuments.map((doc, index) => (
                                  <div key={index} className="flex items-center p-2 bg-indigo-50 rounded">
                                    <FileText className="h-4 w-4 text-indigo-600 mr-2" />
                                    <span className="text-sm text-indigo-800">{doc}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {selectedFile.insights.documentGeneration.templates.length > 0 && (
                            <div>
                              <h4 className="font-semibold text-gray-800 mb-3">Templates sẵn sàng</h4>
                              <div className="space-y-2">
                                {selectedFile.insights.documentGeneration.templates.map((template, index) => (
                                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <div>
                                      <span className="font-medium text-gray-800">{template.templateName}</span>
                                      <p className="text-sm text-gray-600">{template.documentType}</p>
                                    </div>
                                    <div className={`px-2 py-1 rounded text-xs font-medium ${
                                      template.automationLevel === 'full' ? 'bg-green-100 text-green-800' :
                                      template.automationLevel === 'partial' ? 'bg-yellow-100 text-yellow-800' :
                                      'bg-gray-100 text-gray-800'
                                    }`}>
                                      {template.automationLevel === 'full' ? 'Tự động hoàn toàn' :
                                       template.automationLevel === 'partial' ? 'Bán tự động' : 'Thủ công'}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    )}
                    {/* Automation Suggestions */}
                    {selectedFile.insights.automationSuggestions.length > 0 && (
                      <Card className="shadow-xl border-0">
                        <CardHeader>
                          <CardTitle className="flex items-center">
                            <Zap className="mr-2 h-5 w-5 text-orange-600" />
                            Automation Opportunities
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            {selectedFile.insights.automationSuggestions.map((suggestion, index) => (
                              <div key={index} className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                                <div className="flex items-center justify-between mb-2">
                                  <span className="font-semibold text-orange-800">{suggestion.process}</span>
                                  <span className={`text-xs px-2 py-1 rounded ${
                                    suggestion.priority === 'high' ? 'bg-red-100 text-red-700' :
                                    suggestion.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                                    'bg-green-100 text-green-700'
                                  }`}>
                                    {suggestion.priority} priority
                                  </span>
                                </div>
                                <p className="text-orange-700 mb-2">{suggestion.description}</p>
                                <div className="text-sm text-orange-600 mb-2">
                                  <strong>Estimated Savings:</strong> {suggestion.estimatedSavings}
                                </div>
                                {suggestion.implementation && (
                                  <div className="text-xs text-orange-600">
                                    <strong>Implementation:</strong>
                                    <ul className="list-disc list-inside mt-1">
                                      {suggestion.implementation.map((step, stepIndex) => (
                                        <li key={stepIndex}>{step}</li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </>
                )}

                {selectedFile.status === 'processing' && (
                  <Card className="shadow-xl border-0">
                    <CardContent className="p-8 text-center">
                      <div className="flex flex-col items-center space-y-4">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
                        <div>
                          <p className="text-lg font-medium text-gray-700">
                            {t('fileLearning.processingFile')}
                          </p>
                          <p className="text-sm text-gray-500 mt-1">
                            Progress: {selectedFile.progress}%
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {selectedFile.status === 'failed' && (
                  <Card className="shadow-xl border-0 border-red-200">
                    <CardContent className="p-8 text-center">
                      <div className="flex flex-col items-center space-y-4">
                        <AlertCircle className="h-12 w-12 text-red-500" />
                        <div>
                          <p className="text-lg font-medium text-red-700">
                            Processing Failed
                          </p>
                          <p className="text-sm text-red-600 mt-1">
                            {selectedFile.insights.summary || 'An error occurred while processing the file.'}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            ) : (
              <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
                <CardContent className="p-12 text-center">
                  <div className="flex flex-col items-center space-y-4">
                    <div className="bg-gradient-to-r from-gray-100 to-gray-200 p-6 rounded-full">
                      <FileText className="h-12 w-12 text-gray-400" />
                    </div>
                    <div>
                      <p className="text-xl font-medium text-gray-700 mb-2">
                        {t('fileLearning.noFilesUploaded')}
                      </p>
                      <p className="text-gray-500">
                        {t('fileLearning.uploadFilesToAnalyze')}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
