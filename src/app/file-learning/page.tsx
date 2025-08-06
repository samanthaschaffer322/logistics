'use client'

import React, { useState, useEffect } from 'react'
import AuthGuard from '@/components/AuthGuard'
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
  Lightbulb
} from 'lucide-react'

interface LogisticsData {
  date: string
  route: string
  vehicle: string
  driver: string
  cargo: string
  destination: string
  status: string
  estimatedTime: string
  actualTime?: string
  cost: number
}

interface AIInsight {
  type: 'optimization' | 'prediction' | 'recommendation'
  title: string
  description: string
  impact: 'high' | 'medium' | 'low'
  confidence: number
}

const FilelearningPage = () => {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [analysisResults, setAnalysisResults] = useState<LogisticsData[]>([])
  const [aiInsights, setAiInsights] = useState<AIInsight[]>([])
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  // Simulated logistics data based on Vietnamese daily planning files
  const sampleLogisticsData: LogisticsData[] = [
    {
      date: '2025-08-06',
      route: 'TP.HCM - Hà Nội',
      vehicle: 'Container 40ft',
      driver: 'Nguyễn Văn A',
      cargo: 'Hàng điện tử',
      destination: 'Kho Hà Nội',
      status: 'Đang vận chuyển',
      estimatedTime: '18:00',
      cost: 15000000
    },
    {
      date: '2025-08-06',
      route: 'Đà Nẵng - TP.HCM',
      vehicle: 'Xe tải 10 tấn',
      driver: 'Trần Thị B',
      cargo: 'Thực phẩm đông lạnh',
      destination: 'Siêu thị Metro',
      status: 'Hoàn thành',
      estimatedTime: '14:00',
      actualTime: '13:45',
      cost: 8500000
    },
    {
      date: '2025-08-06',
      route: 'Cần Thơ - TP.HCM',
      vehicle: 'Container 20ft',
      driver: 'Lê Văn C',
      cargo: 'Nông sản',
      destination: 'Chợ đầu mối',
      status: 'Chuẩn bị',
      estimatedTime: '16:30',
      cost: 6200000
    }
  ]

  const generateAIInsights = (data: LogisticsData[]): AIInsight[] => {
    return [
      {
        type: 'optimization',
        title: 'Tối ưu hóa tuyến đường TP.HCM - Hà Nội',
        description: 'Phân tích cho thấy có thể tiết kiệm 15% thời gian bằng cách sử dụng tuyến đường qua Quốc lộ 1A thay vì cao tốc vào giờ cao điểm.',
        impact: 'high',
        confidence: 87
      },
      {
        type: 'prediction',
        title: 'Dự đoán nhu cầu vận chuyển tuần tới',
        description: 'Dựa trên dữ liệu lịch sử, nhu cầu vận chuyển hàng điện tử sẽ tăng 25% do mùa mua sắm.',
        impact: 'medium',
        confidence: 92
      },
      {
        type: 'recommendation',
        title: 'Khuyến nghị phân bổ xe',
        description: 'Nên tăng số lượng container 40ft cho tuyến TP.HCM - Hà Nội và giảm xe tải nhỏ cho tuyến ngắn.',
        impact: 'high',
        confidence: 78
      },
      {
        type: 'optimization',
        title: 'Tối ưu chi phí nhiên liệu',
        description: 'Thay đổi lịch trình có thể giảm 12% chi phí nhiên liệu bằng cách tránh giờ cao điểm.',
        impact: 'medium',
        confidence: 85
      }
    ]
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files) {
      const newFiles = Array.from(files)
      setUploadedFiles(prev => [...prev, ...newFiles])
    }
  }

  const processFiles = async () => {
    setIsProcessing(true)
    
    // Simulate AI processing of Excel files
    setTimeout(() => {
      setAnalysisResults(sampleLogisticsData)
      setAiInsights(generateAIInsights(sampleLogisticsData))
      setIsProcessing(false)
    }, 3000)
  }

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'text-red-600 bg-red-100'
      case 'medium': return 'text-yellow-600 bg-yellow-100'
      case 'low': return 'text-green-600 bg-green-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'optimization': return <TrendingUp className="w-4 h-4" />
      case 'prediction': return <BarChart3 className="w-4 h-4" />
      case 'recommendation': return <Lightbulb className="w-4 h-4" />
      default: return <Brain className="w-4 h-4" />
    }
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-slate-900 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">AI File Learning Engine</h1>
            <p className="text-slate-400">
              Upload và phân tích các file kế hoạch logistics để nhận insights thông minh
            </p>
          </div>

          {/* File Upload Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="w-5 h-5" />
                  Upload Files Kế Hoạch
                </CardTitle>
                <CardDescription>
                  Upload các file Excel kế hoạch ngày để AI phân tích và đưa ra khuyến nghị
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center">
                  <FileSpreadsheet className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                  <Label htmlFor="file-upload" className="cursor-pointer">
                    <span className="text-lg font-medium text-slate-700">
                      Kéo thả files hoặc click để chọn
                    </span>
                    <Input
                      id="file-upload"
                      type="file"
                      multiple
                      accept=".xlsx,.xls,.csv"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </Label>
                  <p className="text-sm text-slate-500 mt-2">
                    Hỗ trợ: Excel (.xlsx, .xls), CSV
                  </p>
                </div>

                {uploadedFiles.length > 0 && (
                  <div className="mt-4">
                    <h4 className="font-medium mb-2">Files đã upload:</h4>
                    <div className="space-y-2">
                      {uploadedFiles.map((file, index) => (
                        <div key={index} className="flex items-center gap-2 p-2 bg-slate-50 rounded">
                          <FileText className="w-4 h-4 text-slate-600" />
                          <span className="text-sm">{file.name}</span>
                          <span className="text-xs text-slate-500">
                            ({(file.size / 1024).toFixed(1)} KB)
                          </span>
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
                  AI Processing
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Button 
                    onClick={processFiles}
                    disabled={uploadedFiles.length === 0 || isProcessing}
                    className="w-full"
                  >
                    {isProcessing ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Đang phân tích...
                      </>
                    ) : (
                      <>
                        <Brain className="w-4 h-4 mr-2" />
                        Bắt đầu phân tích AI
                      </>
                    )}
                  </Button>
                  
                  <div className="text-sm text-slate-600 space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Phân tích patterns</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>Tối ưu tuyến đường</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span>Dự đoán nhu cầu</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* AI Insights */}
          {aiInsights.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">AI Insights & Recommendations</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {aiInsights.map((insight, index) => (
                  <Card key={index} className="border-l-4 border-l-indigo-500">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {getInsightIcon(insight.type)}
                          <CardTitle className="text-lg">{insight.title}</CardTitle>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getImpactColor(insight.impact)}`}>
                            {insight.impact.toUpperCase()}
                          </span>
                          <span className="text-xs text-slate-500">
                            {insight.confidence}% confidence
                          </span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-slate-600">{insight.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Analysis Results */}
          {analysisResults.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">Kết quả phân tích</h2>
              <Card>
                <CardHeader>
                  <CardTitle>Dữ liệu logistics đã xử lý</CardTitle>
                  <CardDescription>
                    AI đã phân tích và trích xuất thông tin từ các file kế hoạch
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-2">Ngày</th>
                          <th className="text-left p-2">Tuyến đường</th>
                          <th className="text-left p-2">Phương tiện</th>
                          <th className="text-left p-2">Tài xế</th>
                          <th className="text-left p-2">Hàng hóa</th>
                          <th className="text-left p-2">Trạng thái</th>
                          <th className="text-left p-2">Chi phí</th>
                        </tr>
                      </thead>
                      <tbody>
                        {analysisResults.map((item, index) => (
                          <tr key={index} className="border-b hover:bg-slate-50">
                            <td className="p-2">{item.date}</td>
                            <td className="p-2">{item.route}</td>
                            <td className="p-2">{item.vehicle}</td>
                            <td className="p-2">{item.driver}</td>
                            <td className="p-2">{item.cargo}</td>
                            <td className="p-2">
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                item.status === 'Hoàn thành' ? 'bg-green-100 text-green-800' :
                                item.status === 'Đang vận chuyển' ? 'bg-blue-100 text-blue-800' :
                                'bg-yellow-100 text-yellow-800'
                              }`}>
                                {item.status}
                              </span>
                            </td>
                            <td className="p-2">{item.cost.toLocaleString('vi-VN')} VNĐ</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </AuthGuard>
  )
}

export default FilelearningPage
