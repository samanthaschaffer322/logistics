'use client'

import React, { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { 
  Upload, 
  FileText, 
  Brain, 
  CheckCircle, 
  AlertCircle, 
  Loader2,
  Download,
  Eye,
  TrendingUp,
  BarChart3,
  FileSpreadsheet,
  Zap,
  Sparkles
} from 'lucide-react'
import { fileLearningSystem, ProcessedFileData, FileInsight } from '@/lib/fileLearningSystem'

interface FileUploadProcessorProps {
  onFilesProcessed?: (files: ProcessedFileData[]) => void
}

export default function FileUploadProcessor({ onFilesProcessed }: FileUploadProcessorProps) {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [processedFiles, setProcessedFiles] = useState<ProcessedFileData[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [processingStatus, setProcessingStatus] = useState<string>('')
  const [selectedFile, setSelectedFile] = useState<ProcessedFileData | null>(null)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setUploadedFiles(prev => [...prev, ...acceptedFiles])
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
      'text/csv': ['.csv']
    },
    multiple: true
  })

  const processFiles = async () => {
    if (uploadedFiles.length === 0) return

    setIsProcessing(true)
    setProcessingStatus('Đang phân tích các file...')

    try {
      const results = await fileLearningSystem.automateFileProcessing(uploadedFiles)
      setProcessedFiles(results)
      setProcessingStatus('Hoàn thành phân tích!')
      
      if (onFilesProcessed) {
        onFilesProcessed(results)
      }
    } catch (error) {
      console.error('Error processing files:', error)
      setProcessingStatus('Lỗi khi xử lý file')
    } finally {
      setIsProcessing(false)
    }
  }

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index))
  }

  const getFileTypeIcon = (fileName: string) => {
    if (fileName.includes('KẾ HOẠCH NGÀY')) return '📅'
    if (fileName.includes('FILE THEO DÕI XE')) return '🚛'
    if (fileName.includes('BKVC')) return '📊'
    if (fileName.includes('CÔNG NỢ')) return '💰'
    return '📄'
  }

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'cost_analysis': return <BarChart3 className="h-4 w-4 text-green-400" />
      case 'route_optimization': return <TrendingUp className="h-4 w-4 text-blue-400" />
      case 'vehicle_utilization': return <Zap className="h-4 w-4 text-yellow-400" />
      case 'payment_tracking': return <CheckCircle className="h-4 w-4 text-purple-400" />
      default: return <Sparkles className="h-4 w-4 text-gray-400" />
    }
  }

  return (
    <div className="space-y-6">
      {/* File Upload Area */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Upload className="h-6 w-6 text-blue-400" />
          <h3 className="text-xl font-semibold text-white">Tải lên và Phân tích File</h3>
          <div className="bg-blue-500/20 text-blue-400 border border-blue-500/30 px-2 py-1 rounded text-xs">
            AI-Powered
          </div>
        </div>

        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 cursor-pointer ${
            isDragActive 
              ? 'border-blue-400 bg-blue-500/10' 
              : 'border-gray-600 hover:border-gray-500 hover:bg-gray-700/30'
          }`}
        >
          <input {...getInputProps()} />
          <div className="space-y-4">
            <div className="flex justify-center">
              <div className="p-4 bg-gray-700/50 rounded-full">
                <FileSpreadsheet className="h-12 w-12 text-blue-400" />
              </div>
            </div>
            
            {isDragActive ? (
              <p className="text-blue-400 text-lg font-medium">Thả file vào đây...</p>
            ) : (
              <div>
                <p className="text-white text-lg font-medium mb-2">
                  Kéo thả file hoặc click để chọn
                </p>
                <p className="text-gray-400 text-sm">
                  Hỗ trợ: Excel (.xlsx, .xls), CSV (.csv)
                </p>
                <p className="text-gray-500 text-xs mt-2">
                  Tự động nhận diện: Kế hoạch ngày, File theo dõi xe, BKVC, Công nợ
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Uploaded Files List */}
        {uploadedFiles.length > 0 && (
          <div className="mt-6">
            <h4 className="text-lg font-medium text-white mb-3">File đã tải lên ({uploadedFiles.length})</h4>
            <div className="space-y-2">
              {uploadedFiles.map((file, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-700/30 rounded-lg p-3">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{getFileTypeIcon(file.name)}</span>
                    <div>
                      <p className="text-white font-medium">{file.name}</p>
                      <p className="text-gray-400 text-sm">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFile(index)}
                    className="text-red-400 hover:text-red-300 p-1"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            <button
              onClick={processFiles}
              disabled={isProcessing}
              className="mt-4 w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  {processingStatus}
                </>
              ) : (
                <>
                  <Brain className="h-5 w-5" />
                  Bắt đầu Phân tích AI
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Processing Results */}
      {processedFiles.length > 0 && (
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <CheckCircle className="h-6 w-6 text-green-400" />
            <h3 className="text-xl font-semibold text-white">Kết quả Phân tích</h3>
            <div className="bg-green-500/20 text-green-400 border border-green-500/30 px-2 py-1 rounded text-xs">
              {processedFiles.length} file đã xử lý
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {processedFiles.map((file, index) => (
              <div
                key={index}
                className="bg-gray-700/30 rounded-xl p-4 border border-gray-600/30 hover:border-gray-500/50 transition-all duration-300 cursor-pointer"
                onClick={() => setSelectedFile(file)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-xl">{getFileTypeIcon(file.fileName)}</span>
                    <div>
                      <h4 className="text-white font-medium text-sm">{file.fileName}</h4>
                      <p className="text-gray-400 text-xs">{file.fileType}</p>
                    </div>
                  </div>
                  <Eye className="h-4 w-4 text-gray-400" />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Số dòng:</span>
                    <span className="text-white">{file.metadata.totalRows}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Insights:</span>
                    <span className="text-blue-400">{file.insights.length}</span>
                  </div>
                </div>

                {file.insights.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-600/30">
                    <div className="flex items-center space-x-1">
                      {getInsightIcon(file.insights[0].type)}
                      <span className="text-xs text-gray-300">{file.insights[0].title}</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* File Detail Modal */}
      {selectedFile && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-2xl border border-gray-700 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{getFileTypeIcon(selectedFile.fileName)}</span>
                  <div>
                    <h3 className="text-xl font-semibold text-white">{selectedFile.fileName}</h3>
                    <p className="text-gray-400">{selectedFile.fileType}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedFile(null)}
                  className="text-gray-400 hover:text-white p-2"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* File Metadata */}
              <div className="bg-gray-700/30 rounded-xl p-4">
                <h4 className="text-lg font-medium text-white mb-3">Thông tin File</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-gray-400 text-sm">Tổng số dòng:</span>
                    <p className="text-white font-medium">{selectedFile.metadata.totalRows}</p>
                  </div>
                  <div>
                    <span className="text-gray-400 text-sm">Số cột:</span>
                    <p className="text-white font-medium">{selectedFile.metadata.columns.length}</p>
                  </div>
                </div>
              </div>

              {/* Insights */}
              <div>
                <h4 className="text-lg font-medium text-white mb-3">AI Insights</h4>
                <div className="space-y-3">
                  {selectedFile.insights.map((insight, index) => (
                    <div key={index} className="bg-gray-700/30 rounded-xl p-4">
                      <div className="flex items-start space-x-3">
                        {getInsightIcon(insight.type)}
                        <div className="flex-1">
                          <h5 className="text-white font-medium mb-1">{insight.title}</h5>
                          <p className="text-gray-300 text-sm mb-2">{insight.description}</p>
                          {insight.recommendation && (
                            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-2">
                              <p className="text-blue-300 text-sm">
                                💡 {insight.recommendation}
                              </p>
                            </div>
                          )}
                        </div>
                        {insight.trend && (
                          <div className={`px-2 py-1 rounded text-xs ${
                            insight.trend === 'up' ? 'bg-green-500/20 text-green-400' :
                            insight.trend === 'down' ? 'bg-red-500/20 text-red-400' :
                            'bg-gray-500/20 text-gray-400'
                          }`}>
                            {insight.trend === 'up' ? '↗️' : insight.trend === 'down' ? '↘️' : '→'}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Data Preview */}
              <div>
                <h4 className="text-lg font-medium text-white mb-3">Xem trước dữ liệu</h4>
                <div className="bg-gray-900/50 rounded-xl p-4 overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-700">
                        {selectedFile.metadata.columns.slice(0, 5).map((col, index) => (
                          <th key={index} className="text-left text-gray-400 py-2 px-3">
                            {col}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {selectedFile.data.slice(0, 5).map((row, index) => (
                        <tr key={index} className="border-b border-gray-800">
                          {selectedFile.metadata.columns.slice(0, 5).map((col, colIndex) => (
                            <td key={colIndex} className="text-gray-300 py-2 px-3">
                              {String(row[col] || '').slice(0, 50)}
                              {String(row[col] || '').length > 50 ? '...' : ''}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {selectedFile.data.length > 5 && (
                    <p className="text-gray-400 text-center mt-3">
                      ... và {selectedFile.data.length - 5} dòng khác
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
