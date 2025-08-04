'use client'

import React, { useState, useRef } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { FileText, Upload, Brain, Download, AlertCircle, CheckCircle } from 'lucide-react'
import { supabase } from '../../../supabase/client'
import { useAuth } from '@/contexts/AuthContext'

interface UploadedFile {
  id: string
  file_name: string
  storage_path: string
  parsed_json: any
  created_at: string
}

export default function FileLearningPage() {
  const { user } = useAuth()
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [uploading, setUploading] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  React.useEffect(() => {
    fetchUploadedFiles()
  }, [])

  const fetchUploadedFiles = async () => {
    try {
      const { data, error } = await supabase
        .from('uploaded_plans')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setUploadedFiles(data || [])
    } catch (error) {
      console.error('Error fetching files:', error)
    }
  }

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
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0])
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0])
    }
  }

  const handleFileUpload = async (file: File) => {
    if (!user) return

    // Validate file type
    const allowedTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
      'application/vnd.ms-excel', // .xls
      'text/csv', // .csv
    ]

    if (!allowedTypes.includes(file.type)) {
      alert('Please upload only Excel (.xlsx, .xls) or CSV files')
      return
    }

    setUploading(true)

    try {
      // Upload file to Supabase Storage
      const fileName = `${Date.now()}-${file.name}`
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('logistics-files')
        .upload(fileName, file)

      if (uploadError) throw uploadError

      // Simulate file parsing (in real implementation, this would call a backend service)
      const mockParsedData = {
        fileName: file.name,
        fileSize: file.size,
        uploadDate: new Date().toISOString(),
        sheets: ['Daily Plan', 'Inventory', 'Routes'],
        totalRows: Math.floor(Math.random() * 1000) + 100,
        columns: ['Date', 'Item', 'Quantity', 'Location', 'Status'],
        insights: [
          'Peak delivery hours: 9-11 AM and 2-4 PM',
          'Most frequent routes: Route A (35%), Route B (28%)',
          'Average delivery time: 45 minutes',
          'Inventory turnover rate: 2.3x per month'
        ]
      }

      // Save file metadata to database
      const { error: dbError } = await supabase
        .from('uploaded_plans')
        .insert([
          {
            file_name: file.name,
            storage_path: uploadData.path,
            uploaded_by: user.id,
            parsed_json: mockParsedData,
          },
        ])

      if (dbError) throw dbError

      // Refresh the file list
      fetchUploadedFiles()
      
      // Show analysis result
      setAnalysisResult(`Successfully analyzed ${file.name}! Found ${mockParsedData.totalRows} rows of data with valuable logistics insights.`)
      
    } catch (error) {
      console.error('Error uploading file:', error)
      alert('Error uploading file. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  const analyzeWithAI = async (fileId: string) => {
    setAnalyzing(true)
    
    // Simulate AI analysis
    setTimeout(() => {
      setAnalysisResult(`AI Analysis Complete! 
      
🔍 **Key Insights:**
• Identified 3 optimization opportunities
• Predicted 15% reduction in delivery time
• Suggested inventory reorder points for 12 items
• Recommended route consolidation for 20% fuel savings

📊 **Recommendations:**
• Implement dynamic routing based on traffic patterns
• Adjust inventory levels for seasonal demand
• Optimize warehouse layout for faster picking
• Schedule deliveries during off-peak hours`)
      
      setAnalyzing(false)
    }, 3000)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center">
          <Brain className="h-6 w-6 mr-2 text-purple-600" />
          File Learning Engine
        </h1>
        <p className="text-gray-600">
          Upload your logistics files and let AI learn from your data to provide intelligent insights
        </p>
      </div>

      {/* Upload Area */}
      <Card>
        <CardHeader>
          <CardTitle>Upload Logistics Files</CardTitle>
          <CardDescription>
            Upload Excel files (.xlsx, .xls) or CSV files containing your logistics data
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
            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-lg font-medium text-gray-900 mb-2">
              Drop your files here, or click to browse
            </p>
            <p className="text-sm text-gray-600 mb-4">
              Supports: Excel (.xlsx, .xls), CSV files up to 10MB
            </p>
            <Button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              loading={uploading}
            >
              {uploading ? 'Uploading...' : 'Choose Files'}
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept=".xlsx,.xls,.csv"
              onChange={handleFileSelect}
            />
          </div>
        </CardContent>
      </Card>

      {/* Analysis Result */}
      {analysisResult && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
              Analysis Complete
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <pre className="whitespace-pre-wrap text-sm text-green-800">
                {analysisResult}
              </pre>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Uploaded Files */}
      <Card>
        <CardHeader>
          <CardTitle>Uploaded Files</CardTitle>
          <CardDescription>
            Your uploaded logistics files and their analysis status
          </CardDescription>
        </CardHeader>
        <CardContent>
          {uploadedFiles.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No files uploaded yet. Upload your first logistics file to get started.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {uploadedFiles.map((file) => (
                <div key={file.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <FileText className="h-8 w-8 text-blue-600" />
                      <div>
                        <h3 className="font-medium text-gray-900">{file.file_name}</h3>
                        <p className="text-sm text-gray-600">
                          Uploaded on {new Date(file.created_at).toLocaleDateString()}
                        </p>
                        {file.parsed_json && (
                          <p className="text-sm text-green-600">
                            ✓ Analyzed - {file.parsed_json.totalRows} rows processed
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => analyzeWithAI(file.id)}
                        disabled={analyzing}
                        loading={analyzing}
                      >
                        <Brain className="h-4 w-4 mr-1" />
                        AI Analysis
                      </Button>
                    </div>
                  </div>
                  
                  {file.parsed_json && file.parsed_json.insights && (
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                      <h4 className="font-medium text-blue-900 mb-2">Key Insights:</h4>
                      <ul className="text-sm text-blue-800 space-y-1">
                        {file.parsed_json.insights.map((insight: string, index: number) => (
                          <li key={index} className="flex items-start">
                            <span className="text-blue-600 mr-2">•</span>
                            {insight}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* AI Learning Status */}
      <Card>
        <CardHeader>
          <CardTitle>AI Learning Status</CardTitle>
          <CardDescription>
            How the AI is learning from your uploaded data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{uploadedFiles.length}</div>
              <p className="text-sm text-blue-800">Files Processed</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {uploadedFiles.reduce((sum, file) => sum + (file.parsed_json?.totalRows || 0), 0).toLocaleString()}
              </div>
              <p className="text-sm text-green-800">Data Points Learned</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {Math.min(uploadedFiles.length * 3, 100)}%
              </div>
              <p className="text-sm text-purple-800">Model Accuracy</p>
            </div>
          </div>
          
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start">
              <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 mr-2" />
              <div>
                <h4 className="font-medium text-yellow-800">AI Learning Tips</h4>
                <ul className="text-sm text-yellow-700 mt-1 space-y-1">
                  <li>• Upload files regularly to improve AI accuracy</li>
                  <li>• Include diverse data types (inventory, routes, schedules)</li>
                  <li>• Consistent file formats help the AI learn better</li>
                  <li>• More historical data leads to better predictions</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
