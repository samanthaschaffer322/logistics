'use client'

import React, { useState, useRef } from 'react'
import Layout from '@/components/Layout'
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  Button,
  Badge,
  Progress
} from '@/components/ui-components'
import { 
  FileText,
  Upload,
  Brain,
  Zap,
  CheckCircle,
  AlertTriangle,
  BarChart3,
  Download,
  Eye,
  Trash2
} from 'lucide-react'

interface UploadedFile {
  id: string
  name: string
  type: string
  size: number
  uploadDate: Date
  status: 'processing' | 'completed' | 'error'
  insights?: string[]
  confidence?: number
}

import unidecode from 'unidecode'

const FileLearningPage = () => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [dragActive, setDragActive] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [learnedKeywords, setLearnedKeywords] = useState<string[]>([])

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    const files = Array.from(e.dataTransfer.files)
    processFiles(files)
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    processFiles(files)
  }

  const processFiles = async (files: File[]) => {
    setIsProcessing(true)
    
    const newFiles: UploadedFile[] = files.map(file => ({
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      name: file.name,
      type: file.type,
      size: file.size,
      uploadDate: new Date(),
      status: 'processing'
    }))

    setUploadedFiles(prev => [...prev, ...newFiles])

    // Simulate AI processing
    for (const newFile of newFiles) {
      const normalizedName = unidecode(newFile.name.toLowerCase())
      const keywords = normalizedName.split(/[^a-z0-9]+/).filter(Boolean)
      setLearnedKeywords(prev => [...new Set([...prev, ...keywords])])

      setTimeout(() => {
        setUploadedFiles(prev => prev.map(f => 
          f.id === newFile.id 
            ? {
                ...f,
                status: 'completed',
                insights: [
                  'Identified logistics patterns in document structure',
                  'Found cost optimization opportunities',
                  'Detected route efficiency improvements',
                  'Extracted key performance metrics'
                ],
                confidence: 0.85 + Math.random() * 0.1
              }
            : f
        ))
      }, 2000 + Math.random() * 3000)
    }

    setIsProcessing(false)
  }

  const removeFile = (id: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== id))
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'processing':
        return <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case 'error':
        return <AlertTriangle className="w-4 h-4 text-red-600" />
      default:
        return <FileText className="w-4 h-4 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'processing': return 'bg-blue-100 text-blue-800'
      case 'completed': return 'bg-green-100 text-green-800'
      case 'error': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
              <Brain className="w-8 h-8 text-purple-600" />
              AI File Learning Engine
            </h1>
            <p className="text-gray-600 mt-1">
              Upload documents for AI analysis and intelligent insights extraction
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="bg-purple-100 text-purple-800">
              {uploadedFiles.length} Files Processed
            </Badge>
            <Button className="bg-purple-600 hover:bg-purple-700">
              <Download className="w-4 h-4 mr-2" />
              Export Insights
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Upload Area */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="w-5 h-5 text-blue-600" />
                  Document Upload
                </CardTitle>
                <CardDescription>
                  Drag and drop files or click to upload. Supports PDF, DOC, XLS, CSV, and image files.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                    dragActive 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    onChange={handleFileUpload}
                    className="hidden"
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.csv,.txt,.jpg,.jpeg,.png"
                  />
                  
                  <div className="space-y-4">
                    <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                      <Upload className="w-8 h-8 text-blue-600" />
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium text-slate-900 dark:text-white">
                        Upload your logistics documents
                      </h3>
                      <p className="text-gray-600 mt-1">
                        AI will analyze and extract valuable insights automatically
                      </p>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <Button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isProcessing}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Choose Files
                      </Button>
                      <Button variant="outline" disabled={isProcessing}>
                        <FileText className="w-4 h-4 mr-2" />
                        Browse Examples
                      </Button>
                    </div>
                    
                    <p className="text-sm text-gray-500">
                      Supported formats: PDF, DOC, DOCX, XLS, XLSX, CSV, TXT, JPG, PNG
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Uploaded Files */}
            {uploadedFiles.length > 0 && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-green-600" />
                    Uploaded Files
                  </CardTitle>
                  <CardDescription>
                    AI analysis results and extracted insights
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {uploadedFiles.map((file) => (
                      <div key={file.id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3 flex-1">
                            {getStatusIcon(file.status)}
                            <div className="flex-1">
                              <h4 className="font-medium text-slate-900 dark:text-white">{file.name}</h4>
                              <p className="text-sm text-gray-600">
                                {formatFileSize(file.size)} • {file.uploadDate.toLocaleString()}
                              </p>
                              
                              {file.status === 'completed' && file.confidence && (
                                <div className="mt-2">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="text-sm text-gray-600">Analysis Confidence:</span>
                                    <span className="text-sm font-medium">
                                      {Math.round(file.confidence * 100)}%
                                    </span>
                                  </div>
                                  <Progress value={file.confidence * 100} className="h-2 w-32" />
                                </div>
                              )}
                              
                              {file.insights && (
                                <div className="mt-3">
                                  <h5 className="text-sm font-medium text-slate-900 dark:text-white mb-2">
                                    AI Insights:
                                  </h5>
                                  <ul className="space-y-1">
                                    {file.insights.map((insight, index) => (
                                      <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                                        <Zap className="w-3 h-3 text-yellow-500 mt-0.5 flex-shrink-0" />
                                        {insight}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2 ml-4">
                            <Badge className={getStatusColor(file.status)}>
                              {file.status}
                            </Badge>
                            <div className="flex gap-1">
                              <Button size="sm" variant="outline">
                                <Eye className="w-3 h-3" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => removeFile(file.id)}
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Insights Panel */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-purple-600" />
                  Processing Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    {uploadedFiles.filter(f => f.status === 'completed').length}
                  </div>
                  <div className="text-sm text-purple-700">Files Analyzed</div>
                </div>
                
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {uploadedFiles.filter(f => f.status === 'processing').length}
                  </div>
                  <div className="text-sm text-blue-700">Processing</div>
                </div>
                
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {uploadedFiles.reduce((acc, f) => acc + (f.insights?.length || 0), 0)}
                  </div>
                  <div className="text-sm text-green-700">Insights Generated</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">AI Capabilities</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Document text extraction</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Pattern recognition</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Cost analysis</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Route optimization</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Performance metrics</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Predictive insights</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default FileLearningPage
