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
      setProcessingProgress((i / files.length) * 100)
      
      try {
        const processedDoc = await aiService.processDocument(file)
        setDocuments(prev => [...prev, processedDoc])
      } catch (error) {
        console.error('Error processing document:', error)
      }
    }

    setProcessingProgress(100)
    setIsProcessing(false)
  }, [aiService])

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

            {/* Other tabs content will be added in the next part */}
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default ImportExportPage
