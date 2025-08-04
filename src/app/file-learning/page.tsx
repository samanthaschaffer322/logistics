'use client'

import React, { useState, useCallback, useRef } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { 
  Upload, 
  FileText, 
  Brain, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle, 
  X, 
  Download,
  Eye,
  BarChart3,
  FileSpreadsheet,
  File,
  FileJson
} from 'lucide-react'
import { FileProcessor, FileData, type FileInsights } from '@/lib/file-learning/file-processor'

interface UploadedFile extends FileData {
  file: File
  progress: number
}

export default function FileLearningPage() {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [isDragOver, setIsDragOver] = useState(false)
  const [selectedFile, setSelectedFile] = useState<UploadedFile | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const fileProcessor = new FileProcessor()

  // Handle drag and drop
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
    
    const files = Array.from(e.dataTransfer.files)
    await processFiles(files)
  }, [])

  const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    await processFiles(files)
  }, [])

  const processFiles = async (files: File[]) => {
    setIsProcessing(true)
    
    for (const file of files) {
      if (!fileProcessor.isFileSupported(file)) {
        alert(`File type not supported: ${file.name}`)
        continue
      }

      // Add file to list with processing status
      const uploadedFile: UploadedFile = {
        id: `temp_${Date.now()}`,
        fileName: file.name,
        fileType: file.type,
        uploadDate: new Date().toISOString(),
        processedData: {},
        insights: {
          summary: 'Processing...',
          keyMetrics: {
            overview: { totalShipments: 0 },
            performance: { deliveryRate: 0 },
            costs: { avgCostPerKg: 0 },
            risks: {}
          },
          recommendations: [],
          dataStructure: [],
          patterns: []
        },
        status: 'processing',
        file,
        progress: 0
      }

      setUploadedFiles(prev => [...prev, uploadedFile])

      try {
        // Simulate progress
        const progressInterval = setInterval(() => {
          setUploadedFiles(prev => prev.map(f => 
            f.id === uploadedFile.id 
              ? { ...f, progress: Math.min(f.progress + 10, 90) }
              : f
          ))
        }, 200)

        // Process the file
        const processedData = await fileProcessor.processFile(file)
        
        clearInterval(progressInterval)

        // Update with processed data
        setUploadedFiles(prev => prev.map(f => 
          f.id === uploadedFile.id 
            ? { ...processedData, file, progress: 100 }
            : f
        ))

        // Store in localStorage for other tabs to access
        const existingData = JSON.parse(localStorage.getItem('logiai_files') || '[]')
        existingData.push(processedData)
        localStorage.setItem('logiai_files', JSON.stringify(existingData))

      } catch (error) {
        console.error('File processing error:', error)
        setUploadedFiles(prev => prev.map(f => 
          f.id === uploadedFile.id 
            ? { ...f, status: 'error' as const, progress: 100 }
            : f
        ))
      }
    }
    
    setIsProcessing(false)
  }

  const removeFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId))
    if (selectedFile?.id === fileId) {
      setSelectedFile(null)
    }
    
    // Remove from localStorage
    const existingData = JSON.parse(localStorage.getItem('logiai_files') || '[]')
    const updatedData = existingData.filter((f: FileData) => f.id !== fileId)
    localStorage.setItem('logiai_files', JSON.stringify(updatedData))
  }

  const getFileIcon = (fileType: string) => {
    if (fileType.includes('spreadsheet') || fileType.includes('excel')) {
      return <FileSpreadsheet className="h-8 w-8 text-green-600" />
    }
    if (fileType.includes('pdf')) {
      return <File className="h-8 w-8 text-red-600" />
    }
    if (fileType.includes('json')) {
      return <FileJson className="h-8 w-8 text-blue-600" />
    }
    return <FileText className="h-8 w-8 text-gray-600" />
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case 'processing':
        return <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-600" />
      default:
        return null
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Brain className="mr-3 h-8 w-8 text-purple-600" />
            AI File Learning Engine
          </h1>
          <p className="text-gray-600 mt-2">
            Upload Excel, PDF, or CSV files to extract insights and optimize your logistics operations
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upload Area */}
        <div className="lg:col-span-2 space-y-6">
          {/* Drag and Drop Zone */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Upload className="mr-2 h-5 w-5" />
                Upload Files
              </CardTitle>
              <CardDescription>
                Drag and drop files or click to browse. Supports Excel (.xlsx, .xls), PDF, CSV, and JSON files.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  isDragOver 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-lg font-medium text-gray-900 mb-2">
                  Drop files here or click to browse
                </p>
                <p className="text-sm text-gray-500 mb-4">
                  Supported formats: {fileProcessor.getSupportedTypes().join(', ')}
                </p>
                <button
                  type="button"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  disabled={isProcessing}
                >
                  {isProcessing ? 'Processing...' : 'Select Files'}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept=".xlsx,.xls,.pdf,.csv,.json"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>
            </CardContent>
          </Card>

          {/* Uploaded Files List */}
          {uploadedFiles.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="mr-2 h-5 w-5" />
                  Uploaded Files ({uploadedFiles.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {uploadedFiles.map((file) => (
                    <div
                      key={file.id}
                      className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                        selectedFile?.id === file.id 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedFile(file)}
                    >
                      <div className="flex-shrink-0 mr-4">
                        {getFileIcon(file.fileType)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">
                          {file.fileName}
                        </p>
                        <p className="text-sm text-gray-500">
                          {new Date(file.uploadDate).toLocaleString()}
                        </p>
                        
                        {file.status === 'processing' && (
                          <div className="mt-2">
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${file.progress}%` }}
                              ></div>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(file.status)}
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            removeFile(file.id)
                          }}
                          className="text-gray-400 hover:text-red-600 transition-colors"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* File Details Panel */}
        <div className="space-y-6">
          {selectedFile ? (
            <>
              {/* File Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Eye className="mr-2 h-5 w-5" />
                    File Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="font-medium text-gray-900">{selectedFile.fileName}</p>
                    <p className="text-sm text-gray-500">
                      {(selectedFile.file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-700 mr-2">Status:</span>
                    <div className="flex items-center">
                      {getStatusIcon(selectedFile.status)}
                      <span className="ml-2 text-sm capitalize">{selectedFile.status}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Insights */}
              {selectedFile.status === 'completed' && (
                <>
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <TrendingUp className="mr-2 h-5 w-5" />
                        AI Insights
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Summary</h4>
                        <p className="text-sm text-gray-600">{selectedFile.insights.summary}</p>
                      </div>

                      {Object.keys(selectedFile.insights.keyMetrics).length > 0 && (
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Key Metrics</h4>
                          <div className="space-y-2">
                            {Object.entries(selectedFile.insights.keyMetrics).map(([key, value]) => (
                              <div key={key} className="flex justify-between text-sm">
                                <span className="text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                                <span className="font-medium">
                                  {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {selectedFile.insights.patterns.length > 0 && (
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Detected Patterns</h4>
                          <div className="space-y-2">
                            {selectedFile.insights.patterns.map((pattern, index) => (
                              <div key={index} className="p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center mb-1">
                                  <span className={`px-2 py-1 text-xs rounded-full ${
                                    pattern.type === 'trend' ? 'bg-blue-100 text-blue-800' :
                                    pattern.type === 'seasonal' ? 'bg-green-100 text-green-800' :
                                    pattern.type === 'anomaly' ? 'bg-red-100 text-red-800' :
                                    'bg-purple-100 text-purple-800'
                                  }`}>
                                    {pattern.type}
                                  </span>
                                  <span className="ml-2 text-xs text-gray-500">
                                    {Math.round(pattern.confidence * 100)}% confidence
                                  </span>
                                </div>
                                <p className="text-sm text-gray-700">{pattern.description}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <BarChart3 className="mr-2 h-5 w-5" />
                        Recommendations
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {selectedFile.insights.recommendations.map((rec, index) => (
                          <div key={index} className="flex items-start p-3 bg-blue-50 rounded-lg">
                            <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
                            <p className="text-sm text-blue-800">{rec}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}
            </>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-500">Select a file to view details and insights</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Usage Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>How to Use the AI File Learning Engine</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-blue-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                <Upload className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-medium text-gray-900 mb-2">1. Upload Files</h3>
              <p className="text-sm text-gray-600">
                Drag and drop or select Excel, PDF, or CSV files containing your logistics data
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-purple-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                <Brain className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-medium text-gray-900 mb-2">2. AI Analysis</h3>
              <p className="text-sm text-gray-600">
                Our AI engine automatically analyzes your data to extract insights and patterns
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-medium text-gray-900 mb-2">3. Get Insights</h3>
              <p className="text-sm text-gray-600">
                View detailed analytics, recommendations, and use the data across all platform features
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
