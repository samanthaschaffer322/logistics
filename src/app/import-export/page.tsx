'use client'

import React, { useState, useCallback, useRef } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import Layout from '@/components/Layout'
import { 
  FileText, Ship, Shield, Brain, Upload, Search, 
  MapPin, Calendar, Clock, AlertTriangle, DollarSign, 
  BarChart3, Loader2, RefreshCw 
} from 'lucide-react'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import { AILearningEngine } from '@/lib/aiLearningEngine'

interface Document {
  id: string
  name: string
  type: string
  status: string
  aiProcessed: boolean
  extractedData: {
    invoiceNumber?: string
    totalValue?: number
    supplier?: string
    items?: Array<{
      description: string
      quantity: number
      price: number
      hsCode?: string
    }>
    currency?: string
  }
  validationErrors: string[]
}

interface Shipment {
  id: string
  shipmentNumber: string
  origin: string
  destination: string
  status: string
  estimatedArrival: Date
  aiPredictions: {
    delayRisk: number
    customsDelay: number
    weatherImpact: number
  }
}

interface CustomsDeclaration {
  id: string
  description: string
  hsCode: string
  value: number
  currency: string
  status: string
  aiClassification: {
    taxRate: number
    confidence: number
    restrictions: string[]
  }
}

interface AIInsight {
  id: string
  type: string
  title: string
  description: string
  impact: 'low' | 'medium' | 'high'
  confidence: number
  actionRequired: string
  estimatedSavings?: number
}

export default function ImportExportPage() {
  const { language } = useLanguage()
  const [activeTab, setActiveTab] = useState<'documents' | 'tracking' | 'customs' | 'insights'>('documents')
  const [documents, setDocuments] = useState<Document[]>([])
  const [shipments, setShipments] = useState<Shipment[]>([])
  const [customsDeclarations, setCustomsDeclarations] = useState<CustomsDeclaration[]>([])
  const [aiInsights, setAiInsights] = useState<AIInsight[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [processingProgress, setProcessingProgress] = useState(0)
  const [isDragOver, setIsDragOver] = useState(false)
  const [trackingNumber, setTrackingNumber] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  // AI Service with learning capabilities
  const aiService = {
    processDocument: async (file: File): Promise<Document> => {
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const aiLearningEngine = new AILearningEngine(language)
      const learningResult = await aiLearningEngine.processAndLearn(file)
      
      return {
        id: Date.now().toString(),
        name: file.name,
        type: learningResult.documentType,
        status: 'processed',
        aiProcessed: true,
        extractedData: learningResult.extractedData,
        validationErrors: learningResult.anomalies
      }
    },

    automateCustomsDeclaration: async (data: any): Promise<CustomsDeclaration> => {
      await new Promise(resolve => setTimeout(resolve, 800))
      
      return {
        id: Date.now().toString(),
        description: data.description,
        hsCode: data.hsCode || '8517.12.00',
        value: data.value,
        currency: data.currency,
        status: 'pending',
        aiClassification: {
          taxRate: Math.floor(Math.random() * 15) + 5,
          confidence: Math.floor(Math.random() * 20) + 80,
          restrictions: Math.random() > 0.7 ? ['Requires import license', 'Subject to quality inspection'] : []
        }
      }
    },

    trackShipment: async (shipmentNumber: string): Promise<Shipment> => {
      await new Promise(resolve => setTimeout(resolve, 600))
      
      const origins = ['Ho Chi Minh City', 'Hanoi', 'Da Nang', 'Hai Phong']
      const destinations = ['Singapore', 'Hong Kong', 'Shanghai', 'Tokyo', 'Los Angeles']
      
      return {
        id: Date.now().toString(),
        shipmentNumber,
        origin: origins[Math.floor(Math.random() * origins.length)],
        destination: destinations[Math.floor(Math.random() * destinations.length)],
        status: ['in_transit', 'customs_clearance', 'delivered'][Math.floor(Math.random() * 3)],
        estimatedArrival: new Date(Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000),
        aiPredictions: {
          delayRisk: Math.floor(Math.random() * 30) + 10,
          customsDelay: Math.floor(Math.random() * 48) + 2,
          weatherImpact: Math.floor(Math.random() * 15) + 5
        }
      }
    },

    generateInsights: async (documents: Document[]): Promise<AIInsight[]> => {
      await new Promise(resolve => setTimeout(resolve, 1200))
      
      const insights: AIInsight[] = [
        {
          id: '1',
          type: 'cost_optimization',
          title: language === 'vi' ? 'Tối ưu hóa chi phí vận chuyển' : 'Shipping Cost Optimization',
          description: language === 'vi' 
            ? 'Phát hiện cơ hội giảm 15% chi phí vận chuyển bằng cách consolidate shipments'
            : 'Identified opportunity to reduce shipping costs by 15% through shipment consolidation',
          impact: 'high',
          confidence: 87,
          actionRequired: language === 'vi' 
            ? 'Xem xét gộp các lô hàng nhỏ thành container đầy'
            : 'Consider consolidating smaller shipments into full containers',
          estimatedSavings: 2500000
        },
        {
          id: '2',
          type: 'compliance_risk',
          title: language === 'vi' ? 'Rủi ro tuân thủ hải quan' : 'Customs Compliance Risk',
          description: language === 'vi'
            ? 'Phát hiện 3 tài liệu có thông tin không nhất quán có thể gây delay'
            : 'Detected 3 documents with inconsistent information that may cause delays',
          impact: 'medium',
          confidence: 92,
          actionRequired: language === 'vi'
            ? 'Kiểm tra và cập nhật thông tin HS Code và mô tả hàng hóa'
            : 'Review and update HS Code and product descriptions',
          estimatedSavings: 800000
        },
        {
          id: '3',
          type: 'route_optimization',
          title: language === 'vi' ? 'Tối ưu tuyến đường' : 'Route Optimization',
          description: language === 'vi'
            ? 'AI đề xuất tuyến đường mới có thể rút ngắn thời gian 2-3 ngày'
            : 'AI suggests new route that could reduce transit time by 2-3 days',
          impact: 'medium',
          confidence: 78,
          actionRequired: language === 'vi'
            ? 'Đánh giá tuyến đường qua Singapore thay vì Hong Kong'
            : 'Evaluate routing through Singapore instead of Hong Kong'
        }
      ]
      
      return insights
    }
  }

  const handleFileSelect = useCallback(async (files: FileList) => {
    if (files.length === 0) return
    
    setIsProcessing(true)
    setProcessingProgress(0)

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      setProcessingProgress((i / files.length) * 80)
      
      try {
        const processedDoc = await aiService.processDocument(file)
        setDocuments(prev => [...prev, processedDoc])

        if (processedDoc.type === 'invoice' || processedDoc.type === 'customs_declaration') {
          const customsData = {
            description: processedDoc.extractedData.items?.[0]?.description || 'Imported goods',
            value: processedDoc.extractedData.totalValue || 10000,
            currency: processedDoc.extractedData.currency || 'USD',
            hsCode: processedDoc.extractedData.items?.[0]?.hsCode
          }
          
          const customsDeclaration = await aiService.automateCustomsDeclaration(customsData)
          setCustomsDeclarations(prev => [...prev, customsDeclaration])
        }

        if (processedDoc.type === 'bill_of_lading') {
          const shipmentNumber = `SH-${Date.now()}-${Math.floor(Math.random() * 1000)}`
          const tracking = await aiService.trackShipment(shipmentNumber)
          setShipments(prev => [...prev, tracking])
        }

      } catch (error) {
        console.error('Error processing document:', error)
      }
    }

    setProcessingProgress(90)
    try {
      const insights = await aiService.generateInsights(documents)
      setAiInsights(insights)
    } catch (error) {
      console.error('Error generating insights:', error)
    }

    setProcessingProgress(100)
    setIsProcessing(false)

    alert(language === 'vi' 
      ? `Đã xử lý ${files.length} tài liệu và tự động tạo insights AI!`
      : `Processed ${files.length} documents and automatically generated AI insights!`
    )
  }, [language, documents])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    if (e.dataTransfer.files) {
      handleFileSelect(e.dataTransfer.files)
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

  const handleTrackShipment = useCallback(async () => {
    if (!trackingNumber.trim()) return
    
    setIsProcessing(true)
    try {
      const tracking = await aiService.trackShipment(trackingNumber)
      setShipments(prev => [...prev, tracking])
      setTrackingNumber('')
    } catch (error) {
      console.error('Error tracking shipment:', error)
    } finally {
      setIsProcessing(false)
    }
  }, [trackingNumber])

  const generateAIInsights = useCallback(async () => {
    setIsProcessing(true)
    try {
      // Use enhanced AI insights engine
      const { EnhancedAIInsightsEngine } = await import('@/lib/enhancedAIInsights')
      const insightsEngine = new EnhancedAIInsightsEngine(language)
      const enhancedInsights = await insightsEngine.generateEnhancedInsights()
      
      // Convert enhanced insights to regular insights format
      const insights = enhancedInsights.map(insight => ({
        id: insight.id,
        type: insight.type,
        title: insight.title,
        description: insight.description,
        impact: insight.impact,
        confidence: insight.confidence,
        actionRequired: insight.actionRequired,
        estimatedSavings: insight.estimatedSavings,
        routes: insight.routes,
        specificDetails: insight.specificDetails,
        realTimeData: insight.realTimeData
      }))
      
      setAiInsights(insights)
    } catch (error) {
      console.error('Error generating insights:', error)
      // Fallback to basic insights
      const basicInsights = await aiService.generateInsights(documents)
      setAiInsights(basicInsights)
    } finally {
      setIsProcessing(false)
    }
  }, [documents, language])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'processed':
      case 'delivered':
        return 'border-green-500 text-green-300 bg-green-500/10'
      case 'pending':
      case 'in_transit':
        return 'border-yellow-500 text-yellow-300 bg-yellow-500/10'
      case 'customs_clearance':
        return 'border-blue-500 text-blue-300 bg-blue-500/10'
      default:
        return 'border-slate-500 text-slate-300 bg-slate-500/10'
    }
  }

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'cost_optimization':
        return <DollarSign className="w-4 h-4 text-green-400" />
      case 'compliance_risk':
        return <AlertTriangle className="w-4 h-4 text-yellow-400" />
      case 'route_optimization':
        return <MapPin className="w-4 h-4 text-blue-400" />
      default:
        return <Brain className="w-4 h-4 text-indigo-400" />
    }
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold gradient-text flex items-center gap-3">
              <Ship className="w-8 h-8 text-indigo-400" />
              {language === 'vi' ? 'Trung tâm Xuất nhập khẩu AI' : 'AI Import-Export Center'}
            </h1>
            <p className="text-slate-400 mt-1">
              {language === 'vi' 
                ? 'Tự động hóa quy trình xuất nhập khẩu với AI và tích hợp VNACCS'
                : 'Automate import-export processes with AI and VNACCS integration'
              }
            </p>
          </div>
          <LanguageSwitcher />
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="dark-card p-4">
            <div className="flex items-center gap-3">
              <FileText className="w-8 h-8 text-blue-400" />
              <div>
                <div className="text-2xl font-bold text-white">{documents.length}</div>
                <div className="text-sm text-slate-400">
                  {language === 'vi' ? 'Tài liệu' : 'Documents'}
                </div>
              </div>
            </div>
          </div>

          <div className="dark-card p-4">
            <div className="flex items-center gap-3">
              <Ship className="w-8 h-8 text-green-400" />
              <div>
                <div className="text-2xl font-bold text-white">{shipments.length}</div>
                <div className="text-sm text-slate-400">
                  {language === 'vi' ? 'Lô hàng' : 'Shipments'}
                </div>
              </div>
            </div>
          </div>

          <div className="dark-card p-4">
            <div className="flex items-center gap-3">
              <Shield className="w-8 h-8 text-purple-400" />
              <div>
                <div className="text-2xl font-bold text-white">{customsDeclarations.length}</div>
                <div className="text-sm text-slate-400">
                  {language === 'vi' ? 'Tờ khai' : 'Declarations'}
                </div>
              </div>
            </div>
          </div>

          <div className="dark-card p-4">
            <div className="flex items-center gap-3">
              <Brain className="w-8 h-8 text-yellow-400" />
              <div>
                <div className="text-2xl font-bold text-white">{aiInsights.length}</div>
                <div className="text-sm text-slate-400">
                  {language === 'vi' ? 'AI Insights' : 'AI Insights'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="dark-card">
          <div className="flex border-b border-slate-700">
            {[
              { id: 'documents', label: language === 'vi' ? 'Tài liệu' : 'Documents', icon: FileText },
              { id: 'tracking', label: language === 'vi' ? 'Theo dõi' : 'Tracking', icon: MapPin },
              { id: 'customs', label: language === 'vi' ? 'Hải quan' : 'Customs', icon: Shield },
              { id: 'insights', label: 'AI Insights', icon: Brain }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'text-indigo-400 border-b-2 border-indigo-400 bg-indigo-500/5'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>

          <div className="p-6">
            {/* Documents Tab */}
            {activeTab === 'documents' && (
              <div className="space-y-6">
                {/* Upload Area */}
                <div
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
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
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
                          ? (language === 'vi' ? 'Thả tài liệu vào đây' : 'Drop documents here')
                          : (language === 'vi' ? 'Upload tài liệu xuất nhập khẩu' : 'Upload import-export documents')
                        }
                      </p>
                      <p className="text-sm text-slate-400">
                        {language === 'vi' 
                          ? 'Hỗ trợ: PDF, JPG, PNG, DOC, DOCX • AI sẽ tự động xử lý và trích xuất dữ liệu'
                          : 'Supported: PDF, JPG, PNG, DOC, DOCX • AI will automatically process and extract data'
                        }
                      </p>
                    </div>
                  </div>
                </div>

                {/* Processing Progress */}
                {isProcessing && (
                  <div className="bg-slate-800 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white font-medium">
                        {language === 'vi' ? 'AI đang xử lý tài liệu...' : 'AI processing documents...'}
                      </span>
                      <span className="text-indigo-400">{Math.round(processingProgress)}%</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${processingProgress}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Documents List */}
                {documents.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-white">
                      {language === 'vi' ? 'Tài liệu đã xử lý' : 'Processed Documents'}
                    </h3>
                    {documents.map(doc => (
                      <div key={doc.id} className="bg-slate-800 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <FileText className="w-5 h-5 text-blue-400" />
                            <div>
                              <h4 className="font-medium text-white">{doc.name}</h4>
                              <p className="text-sm text-slate-400 capitalize">{doc.type.replace('_', ' ')}</p>
                            </div>
                          </div>
                          <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(doc.status)}`}>
                            {doc.status.toUpperCase()}
                          </div>
                        </div>
                        
                        {doc.aiProcessed && (
                          <div className="mt-3 p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                              <Brain className="w-4 h-4 text-indigo-400" />
                              <span className="text-sm font-medium text-indigo-300">
                                {language === 'vi' ? 'Dữ liệu AI trích xuất' : 'AI Extracted Data'}
                              </span>
                            </div>
                            <div className="text-sm text-slate-300">
                              {doc.extractedData.invoiceNumber && (
                                <p>{language === 'vi' ? 'Số hóa đơn:' : 'Invoice:'} {doc.extractedData.invoiceNumber}</p>
                              )}
                              {doc.extractedData.totalValue && (
                                <p>{language === 'vi' ? 'Giá trị:' : 'Value:'} ${doc.extractedData.totalValue.toLocaleString()}</p>
                              )}
                              {doc.extractedData.supplier && (
                                <p>{language === 'vi' ? 'Nhà cung cấp:' : 'Supplier:'} {doc.extractedData.supplier}</p>
                              )}
                            </div>
                          </div>
                        )}

                        {doc.validationErrors.length > 0 && (
                          <div className="mt-3 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                              <AlertTriangle className="w-4 h-4 text-red-400" />
                              <span className="text-sm font-medium text-red-300">
                                {language === 'vi' ? 'Lỗi validation' : 'Validation Errors'}
                              </span>
                            </div>
                            <ul className="text-sm text-red-300 space-y-1">
                              {doc.validationErrors.map((error, index) => (
                                <li key={index}>• {error}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Other tabs content would go here */}
            {activeTab === 'insights' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-white">
                    {language === 'vi' ? 'AI Insights & Khuyến nghị' : 'AI Insights & Recommendations'}
                  </h3>
                  <button
                    onClick={generateAIInsights}
                    disabled={isProcessing}
                    className="gradient-button px-4 py-2 rounded-lg flex items-center gap-2"
                  >
                    {isProcessing ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <RefreshCw className="w-4 h-4" />
                    )}
                    {language === 'vi' ? 'Tạo Insights' : 'Generate Insights'}
                  </button>
                </div>

                {aiInsights.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {aiInsights.map(insight => (
                      <div key={insight.id} className="bg-slate-800 rounded-lg p-6">
                        <div className="flex items-start gap-3 mb-3">
                          <div className="p-2 bg-indigo-500/20 rounded-lg">
                            {getInsightIcon(insight.type)}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-white mb-1">{insight.title}</h4>
                            <p className="text-sm text-slate-400 mb-2">{insight.description}</p>
                            <div className="flex items-center gap-4 text-xs">
                              <span className={`px-2 py-1 rounded ${
                                insight.impact === 'high' ? 'bg-red-500/20 text-red-300' :
                                insight.impact === 'medium' ? 'bg-yellow-500/20 text-yellow-300' :
                                'bg-green-500/20 text-green-300'
                              }`}>
                                {insight.impact.toUpperCase()}
                              </span>
                              <span className="text-slate-500">
                                {language === 'vi' ? 'Độ tin cậy:' : 'Confidence:'} {insight.confidence}%
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Specific Route Details */}
                        {insight.routes && insight.routes.length > 0 && (
                          <div className="mb-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                            <div className="text-sm text-blue-300 font-medium mb-2">
                              {language === 'vi' ? 'Chi tiết tuyến đường:' : 'Route Details:'}
                            </div>
                            {insight.routes.map(route => (
                              <div key={route.id} className="mb-3 last:mb-0">
                                <div className="text-sm text-white font-medium">{route.routeName}</div>
                                <div className="text-xs text-slate-300 mt-1">
                                  <div>{route.origin} → {route.destination}</div>
                                  <div className="flex gap-4 mt-1">
                                    <span>{language === 'vi' ? 'Hiệu suất hiện tại:' : 'Current efficiency:'} {route.currentEfficiency}%</span>
                                    <span className="text-green-300">{language === 'vi' ? 'Cải thiện:' : 'Improvement:'} +{route.potentialImprovement}%</span>
                                  </div>
                                  <div className="flex gap-4 mt-1">
                                    <span>{language === 'vi' ? 'Tiết kiệm thời gian:' : 'Time savings:'} {route.estimatedSavings.timeMinutes} phút</span>
                                    <span>{language === 'vi' ? 'Tiết kiệm nhiên liệu:' : 'Fuel savings:'} {route.estimatedSavings.fuelLiters}L</span>
                                  </div>
                                  <div className="mt-1">
                                    <span className={`px-2 py-1 rounded text-xs ${
                                      route.trafficData.currentTraffic === 'light' ? 'bg-green-500/20 text-green-300' :
                                      route.trafficData.currentTraffic === 'moderate' ? 'bg-yellow-500/20 text-yellow-300' :
                                      'bg-red-500/20 text-red-300'
                                    }`}>
                                      {language === 'vi' ? 'Giao thông:' : 'Traffic:'} {route.trafficData.currentTraffic}
                                    </span>
                                    <span className="ml-2 text-slate-400">
                                      {language === 'vi' ? 'Tốc độ TB:' : 'Avg speed:'} {route.trafficData.averageSpeed}km/h
                                    </span>
                                  </div>
                                  {route.trafficData.congestionPoints.length > 0 && (
                                    <div className="mt-1 text-xs text-orange-300">
                                      {language === 'vi' ? 'Điểm tắc nghẽn:' : 'Congestion points:'} {route.trafficData.congestionPoints.join(', ')}
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Real-time Data */}
                        {insight.realTimeData && (
                          <div className="mb-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                            <div className="text-sm text-green-300 font-medium mb-1">
                              {language === 'vi' ? 'Dữ liệu thời gian thực:' : 'Real-time Data:'}
                            </div>
                            <div className="text-xs text-slate-300">
                              <div>{language === 'vi' ? 'Nguồn:' : 'Source:'} {insight.realTimeData.dataSource}</div>
                              <div>{language === 'vi' ? 'Độ chính xác:' : 'Accuracy:'} {insight.realTimeData.accuracy}%</div>
                              <div>{language === 'vi' ? 'Cập nhật lần cuối:' : 'Last updated:'} {insight.realTimeData.lastUpdated.toLocaleTimeString()}</div>
                            </div>
                          </div>
                        )}

                        <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-lg p-3">
                          <div className="text-sm text-indigo-300 font-medium mb-1">
                            {language === 'vi' ? 'Hành động cần thiết:' : 'Action Required:'}
                          </div>
                          <div className="text-sm text-slate-300">{insight.actionRequired}</div>
                          
                          {/* Implementation Steps */}
                          {insight.specificDetails && insight.specificDetails.implementation && (
                            <div className="mt-2">
                              <div className="text-xs text-indigo-300 font-medium mb-1">
                                {language === 'vi' ? 'Các bước triển khai:' : 'Implementation Steps:'}
                              </div>
                              <ul className="text-xs text-slate-300 space-y-1">
                                {insight.specificDetails.implementation.map((step, index) => (
                                  <li key={index}>• {step}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>

                        {insight.estimatedSavings && (
                          <div className="mt-3 text-center p-2 bg-green-500/10 rounded-lg">
                            <div className="text-green-400 font-bold">
                              {language === 'vi' ? 'Tiết kiệm:' : 'Savings:'} {(insight.estimatedSavings / 1000000).toFixed(1)}M VNĐ/tháng
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {aiInsights.length === 0 && !isProcessing && (
                  <div className="text-center py-12">
                    <Brain className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                    <p className="text-slate-500">
                      {language === 'vi' 
                        ? 'Upload tài liệu để AI tạo insights tự động'
                        : 'Upload documents for AI to generate automatic insights'
                      }
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}
