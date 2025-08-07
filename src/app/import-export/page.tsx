'use client'

import React, { useState, useRef, useCallback } from 'react'
import Layout from '@/components/Layout'
import { useLanguage } from '@/contexts/LanguageContext'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import { ImportExportAI, ImportExportDocument, ShipmentTracking, CustomsAutomation, AIInsight } from '@/lib/importExportAI'
import {
  Upload,
  FileText,
  Ship,
  Package,
  CheckCircle,
  AlertTriangle,
  Clock,
  DollarSign,
  TrendingUp,
  Brain,
  Zap,
  Search,
  Download,
  Eye,
  RefreshCw,
  Globe,
  Shield,
  Truck,
  MapPin,
  Calendar,
  BarChart3,
  Loader2,
  X,
  Plus
} from 'lucide-react'

const ImportExportPage = () => {
  const { language, t } = useLanguage()
  const [activeTab, setActiveTab] = useState<'documents' | 'tracking' | 'customs' | 'insights'>('documents')
  const [documents, setDocuments] = useState<ImportExportDocument[]>([])
  const [shipments, setShipments] = useState<ShipmentTracking[]>([])
  const [customsDeclarations, setCustomsDeclarations] = useState<CustomsAutomation[]>([])
  const [aiInsights, setAiInsights] = useState<AIInsight[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [processingProgress, setProcessingProgress] = useState(0)
  const [isDragOver, setIsDragOver] = useState(false)
  const [trackingNumber, setTrackingNumber] = useState('')
  
  const fileInputRef = useRef<HTMLInputElement>(null)
  const aiService = new ImportExportAI(language)

  const handleFileSelect = useCallback(async (files: FileList) => {
    setIsProcessing(true)
    setProcessingProgress(0)

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      setProcessingProgress((i / files.length) * 80) // 80% for processing
      
      try {
        // Process document with AI
        const processedDoc = await aiService.processDocument(file)
        setDocuments(prev => [...prev, processedDoc])

        // Auto-trigger customs automation if it's an invoice or declaration
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

        // Auto-create shipment tracking if it's a bill of lading
        if (processedDoc.type === 'bill_of_lading') {
          const shipmentNumber = `SH-${Date.now()}-${Math.floor(Math.random() * 1000)}`
          const tracking = await aiService.trackShipment(shipmentNumber)
          setShipments(prev => [...prev, tracking])
        }

      } catch (error) {
        console.error('Error processing document:', error)
      }
    }

    // Generate AI insights automatically
    setProcessingProgress(90)
    try {
      const insights = await aiService.generateInsights([...documents])
      setAiInsights(insights)
    } catch (error) {
      console.error('Error generating insights:', error)
    }

    setProcessingProgress(100)
    setIsProcessing(false)

    // Show success message
    alert(language === 'vi' 
      ? `Đã xử lý ${files.length} tài liệu và tự động tạo insights AI!`
      : `Processed ${files.length} documents and automatically generated AI insights!`
    )
  }, [aiService, documents, language])

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

  const handleTrackShipment = async () => {
    if (!trackingNumber.trim()) return

    setIsProcessing(true)
    try {
      const tracking = await aiService.trackShipment(trackingNumber)
      setShipments(prev => [...prev, tracking])
      setTrackingNumber('')
    } catch (error) {
      console.error('Error tracking shipment:', error)
    }
    setIsProcessing(false)
  }

  const generateAIInsights = async () => {
    setIsProcessing(true)
    try {
      const insights = await aiService.generateInsights([...documents, ...shipments])
      setAiInsights(insights)
    } catch (error) {
      console.error('Error generating insights:', error)
    }
    setIsProcessing(false)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
      case 'delivered':
      case 'cleared':
        return 'text-green-400 bg-green-500/10 border-green-500/20'
      case 'pending':
      case 'in_transit':
      case 'draft':
        return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20'
      case 'rejected':
      case 'held':
        return 'text-red-400 bg-red-500/10 border-red-500/20'
      case 'processing':
      case 'customs':
        return 'text-blue-400 bg-blue-500/10 border-blue-500/20'
      default:
        return 'text-slate-400 bg-slate-500/10 border-slate-500/20'
    }
  }

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'cost_optimization':
        return <DollarSign className="w-5 h-5" />
      case 'compliance_risk':
        return <Shield className="w-5 h-5" />
      case 'delay_prediction':
        return <Clock className="w-5 h-5" />
      case 'document_automation':
        return <FileText className="w-5 h-5" />
      default:
        return <Brain className="w-5 h-5" />
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

            {/* Tracking Tab */}
            {activeTab === 'tracking' && (
              <div className="space-y-6">
                {/* Tracking Input */}
                <div className="flex gap-4">
                  <input
                    type="text"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    placeholder={language === 'vi' ? 'Nhập số tracking...' : 'Enter tracking number...'}
                    className="dark-input flex-1 px-4 py-3 rounded-xl"
                  />
                  <button
                    onClick={handleTrackShipment}
                    disabled={isProcessing || !trackingNumber.trim()}
                    className="gradient-button px-6 py-3 rounded-xl flex items-center gap-2"
                  >
                    {isProcessing ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Search className="w-4 h-4" />
                    )}
                    {language === 'vi' ? 'Theo dõi' : 'Track'}
                  </button>
                </div>

                {/* Shipments List */}
                {shipments.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white">
                      {language === 'vi' ? 'Lô hàng đang theo dõi' : 'Tracked Shipments'}
                    </h3>
                    {shipments.map(shipment => (
                      <div key={shipment.id} className="bg-slate-800 rounded-lg p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h4 className="font-semibold text-white text-lg">{shipment.shipmentNumber}</h4>
                            <p className="text-slate-400">{shipment.origin} → {shipment.destination}</p>
                          </div>
                          <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(shipment.status)}`}>
                            {shipment.status.toUpperCase()}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div className="text-center p-3 bg-blue-500/10 rounded-lg">
                            <Calendar className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                            <div className="text-sm text-slate-400">
                              {language === 'vi' ? 'Dự kiến đến' : 'ETA'}
                            </div>
                            <div className="text-white font-semibold">
                              {shipment.estimatedArrival.toLocaleDateString()}
                            </div>
                          </div>

                          <div className="text-center p-3 bg-yellow-500/10 rounded-lg">
                            <AlertTriangle className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
                            <div className="text-sm text-slate-400">
                              {language === 'vi' ? 'Rủi ro delay' : 'Delay Risk'}
                            </div>
                            <div className="text-yellow-400 font-semibold">
                              {shipment.aiPredictions.delayRisk}%
                            </div>
                          </div>

                          <div className="text-center p-3 bg-purple-500/10 rounded-lg">
                            <Clock className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                            <div className="text-sm text-slate-400">
                              {language === 'vi' ? 'Delay hải quan' : 'Customs Delay'}
                            </div>
                            <div className="text-purple-400 font-semibold">
                              {shipment.aiPredictions.customsDelay}h
                            </div>
                          </div>
                        </div>

                        <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-lg p-3">
                          <div className="flex items-center gap-2 mb-2">
                            <Brain className="w-4 h-4 text-indigo-400" />
                            <span className="text-sm font-medium text-indigo-300">
                              {language === 'vi' ? 'AI Predictions' : 'AI Predictions'}
                            </span>
                          </div>
                          <div className="text-sm text-slate-300">
                            {language === 'vi' 
                              ? `Dự báo thời tiết có thể ảnh hưởng ${shipment.aiPredictions.weatherImpact}% đến lịch trình`
                              : `Weather may impact schedule by ${shipment.aiPredictions.weatherImpact}%`
                            }
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Customs Tab */}
            {activeTab === 'customs' && (
              <div className="space-y-6">
                {customsDeclarations.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white">
                      {language === 'vi' ? 'Tờ khai hải quan' : 'Customs Declarations'}
                    </h3>
                    {customsDeclarations.map(declaration => (
                      <div key={declaration.id} className="bg-slate-800 rounded-lg p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h4 className="font-semibold text-white">{declaration.description}</h4>
                            <p className="text-slate-400">HS Code: {declaration.hsCode}</p>
                          </div>
                          <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(declaration.status)}`}>
                            {declaration.status.toUpperCase()}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div className="text-center p-3 bg-green-500/10 rounded-lg">
                            <DollarSign className="w-6 h-6 text-green-400 mx-auto mb-2" />
                            <div className="text-sm text-slate-400">
                              {language === 'vi' ? 'Giá trị' : 'Value'}
                            </div>
                            <div className="text-white font-semibold">
                              ${declaration.value.toLocaleString()} {declaration.currency}
                            </div>
                          </div>

                          <div className="text-center p-3 bg-blue-500/10 rounded-lg">
                            <BarChart3 className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                            <div className="text-sm text-slate-400">
                              {language === 'vi' ? 'Thuế suất' : 'Tax Rate'}
                            </div>
                            <div className="text-blue-400 font-semibold">
                              {declaration.aiClassification.taxRate}%
                            </div>
                          </div>

                          <div className="text-center p-3 bg-purple-500/10 rounded-lg">
                            <Brain className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                            <div className="text-sm text-slate-400">
                              {language === 'vi' ? 'Độ tin cậy AI' : 'AI Confidence'}
                            </div>
                            <div className="text-purple-400 font-semibold">
                              {declaration.aiClassification.confidence}%
                            </div>
                          </div>
                        </div>

                        {declaration.aiClassification.restrictions.length > 0 && (
                          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                            <div className="flex items-center gap-2 mb-2">
                              <AlertTriangle className="w-4 h-4 text-red-400" />
                              <span className="text-sm font-medium text-red-300">
                                {language === 'vi' ? 'Hạn chế' : 'Restrictions'}
                              </span>
                            </div>
                            <ul className="text-sm text-red-300 space-y-1">
                              {declaration.aiClassification.restrictions.map((restriction, index) => (
                                <li key={index}>• {restriction}</li>
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

            {/* AI Insights Tab */}
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

                        <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-lg p-3">
                          <div className="text-sm text-indigo-300 font-medium mb-1">
                            {language === 'vi' ? 'Hành động cần thiết:' : 'Action Required:'}
                          </div>
                          <div className="text-sm text-slate-300">{insight.actionRequired}</div>
                        </div>

                        {insight.estimatedSavings && (
                          <div className="mt-3 text-center p-2 bg-green-500/10 rounded-lg">
                            <div className="text-green-400 font-bold">
                              {language === 'vi' ? 'Tiết kiệm:' : 'Savings:'} {(insight.estimatedSavings / 1000000).toFixed(1)}M VNĐ
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

export default ImportExportPage
