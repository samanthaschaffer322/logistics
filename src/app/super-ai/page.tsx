'use client'

import React, { useState, useCallback } from 'react'
import AuthGuard from '@/components/AuthGuard'
import { useLanguage } from '@/contexts/LanguageContext'
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  Button,
  Input,
  Label,
  Badge
} from '@/components/ui-components'
import { 
  Brain, 
  Upload, 
  FileSpreadsheet, 
  Download, 
  Zap,
  CheckCircle,
  AlertTriangle,
  Info,
  Loader2,
  FileText,
  Calendar,
  Truck,
  MapPin,
  Clock,
  DollarSign,
  BarChart3,
  Settings,
  Sparkles,
  Database,
  FileCheck,
  Target,
  TrendingUp,
  Activity
} from 'lucide-react'
import SmartExcelAnalyzer from '@/lib/smartExcelAnalyzer'

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadedAt: Date;
  status: 'processing' | 'completed' | 'error';
  insights?: string[];
  rawData?: any[];
}

interface GeneratedPlan {
  id: string;
  title: string;
  generatedAt: Date;
  routes: Array<{
    from: string;
    to: string;
    vehicle: string;
    time: string;
    cost: number;
    distance?: number;
    duration?: number;
  }>;
  summary: {
    totalRoutes: number;
    totalCost: number;
    estimatedTime: string;
    efficiency: number;
  };
  insights?: string[];
}

const SuperAIAssistant = () => {
  const { language } = useLanguage()
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [generatedPlans, setGeneratedPlans] = useState<GeneratedPlan[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [aiPrompt, setAiPrompt] = useState('')

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files)
    }
  }, [])

  const handleFiles = async (files: FileList) => {
    setIsProcessing(true)
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const newFile: UploadedFile = {
        id: Date.now().toString() + i,
        name: file.name,
        size: file.size,
        type: file.type,
        uploadedAt: new Date(),
        status: 'processing'
      }
      
      setUploadedFiles(prev => [...prev, newFile])
      
      // Simulate reading Excel file and smart analysis
      setTimeout(async () => {
        try {
          // Simulate Excel data extraction
          const mockExcelData = [
            ['STT', 'NGÀY', 'SỐ XE', 'SĐT', 'TÊN LÁI XE', 'SỐ CONT', 'SEAL', 'CHỦ HÀNG', 'ĐỊA ĐIỂM', 'T.GIAN Y/C', 'Vị TRÍ XE 7h', 'BILL - BOOK', 'CẢNG HẠ'],
            [1, '17/03/2025', '50H53777', '', '', 'CBHU9513264', '', 'Khai Anh CE (N)', 'KHO CHIM ÉN', '08:00', 'XONG', 'OOLU2753948410', 'Cảng Cát Lái'],
            [2, '17/03/2025', '48H01595', '', '', 'CCLU5168766', '', 'Khai Anh CE (N)', 'KCN Binh Duong', '09:30', 'XONG', 'OOLU2753948410', 'Cảng Sài Gòn'],
            [3, '17/03/2025', '51C63836', '', '', 'CCLU5206660', '', 'Commodities Express', 'Cảng Vũng Tàu', '14:00', 'XONG', 'OOLU2753948410', 'Cảng Vũng Tàu'],
            [4, '17/03/2025', '51C76124', '', '', 'CCLU5256471', '', 'Khai Anh CE (N)', 'KCN Dong Nai', '10:15', 'XONG', 'OOLU2753948410', 'Cảng Cát Lái'],
            [5, '17/03/2025', '51C58240', '', '', 'CCLU5261441', '', 'Commodities Express', 'Cần Thơ', '16:30', 'XONG', 'OOLU2753948410', 'Cảng Cần Thơ']
          ];
          
          // Smart analysis using the new analyzer
          const smartInsights = SmartExcelAnalyzer.analyzeLogisticsFile(mockExcelData);
          
          const insights = [
            language === 'vi' 
              ? `Phát hiện ${smartInsights.totalRoutes} tuyến đường logistics miền Nam`
              : `Detected ${smartInsights.totalRoutes} Southern Vietnam logistics routes`,
            language === 'vi' 
              ? `Địa điểm chính: ${smartInsights.commonLocations.slice(0, 2).join(', ')}`
              : `Main locations: ${smartInsights.commonLocations.slice(0, 2).join(', ')}`,
            language === 'vi' 
              ? `Hiệu suất tối ưu: ${smartInsights.efficiency.toFixed(1)}%`
              : `Optimized efficiency: ${smartInsights.efficiency.toFixed(1)}%`,
            language === 'vi' 
              ? `Chi phí trung bình: ${new Intl.NumberFormat('vi-VN').format(smartInsights.averageCost)} VNĐ`
              : `Average cost: ${new Intl.NumberFormat('vi-VN').format(smartInsights.averageCost)} VND`
          ];
          
          setUploadedFiles(prev => 
            prev.map(f => 
              f.id === newFile.id 
                ? { ...f, status: 'completed', insights, rawData: mockExcelData }
                : f
            )
          )
        } catch (error) {
          setUploadedFiles(prev => 
            prev.map(f => 
              f.id === newFile.id 
                ? { ...f, status: 'error' }
                : f
            )
          )
        }
      }, 2000 + i * 500)
    }
    
    setIsProcessing(false)
  }

  const generateAIPlan = async () => {
    if (uploadedFiles.length === 0) {
      alert(language === 'vi' ? 'Vui lòng tải lên ít nhất một file để AI học hỏi' : 'Please upload at least one file for AI to learn from')
      return
    }
    
    setIsGenerating(true)
    
    // Simulate AI plan generation with smart analysis
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    try {
      // Get the most recent file's data for analysis
      const latestFile = uploadedFiles.find(f => f.status === 'completed' && f.rawData);
      if (!latestFile?.rawData) {
        throw new Error('No valid data found');
      }
      
      // Use smart analyzer to generate realistic plan
      const smartInsights = SmartExcelAnalyzer.analyzeLogisticsFile(latestFile.rawData);
      const realisticPlan = SmartExcelAnalyzer.generateRealisticPlan(smartInsights, language);
      
      setGeneratedPlans(prev => [realisticPlan, ...prev])
    } catch (error) {
      console.error('Plan generation error:', error);
      alert(language === 'vi' ? 'Có lỗi xảy ra khi tạo kế hoạch' : 'Error occurred while generating plan');
    } finally {
      setIsGenerating(false)
    }
  }

  const downloadPlan = (plan: GeneratedPlan, format: 'excel' | 'pdf' = 'excel') => {
    if (format === 'excel') {
      // Generate proper Excel file using XLSX
      const excelData = SmartExcelAnalyzer.generateExcelData(plan);
      
      // Create workbook
      const wb = {
        SheetNames: [excelData.sheetName],
        Sheets: {}
      };
      
      // Create worksheet
      const ws = {};
      
      // Add data to worksheet
      excelData.data.forEach((row, rowIndex) => {
        row.forEach((cell, colIndex) => {
          const cellAddress = String.fromCharCode(65 + colIndex) + (rowIndex + 1);
          ws[cellAddress] = { v: cell, t: typeof cell === 'number' ? 'n' : 's' };
        });
      });
      
      // Set worksheet range
      const range = `A1:${String.fromCharCode(65 + Math.max(...excelData.data.map(row => row.length)) - 1)}${excelData.data.length}`;
      ws['!ref'] = range;
      
      wb.Sheets[excelData.sheetName] = ws;
      
      // Generate Excel file
      try {
        // Use dynamic import for client-side
        import('xlsx').then(XLSX => {
          const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
          const blob = new Blob([wbout], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
          
          const link = document.createElement('a');
          const url = URL.createObjectURL(blob);
          link.setAttribute('href', url);
          link.setAttribute('download', `${plan.title.replace(/[^a-z0-9]/gi, '_')}.xlsx`);
          link.style.visibility = 'hidden';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        });
      } catch (error) {
        // Fallback to CSV if XLSX fails
        const csvContent = excelData.data.map(row => 
          row.map(cell => `"${cell}"`).join(',')
        ).join('\n');
        
        const blob = new Blob(['\uFEFF' + csvContent], { 
          type: 'text/csv;charset=utf-8;' 
        });
        
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `${plan.title.replace(/[^a-z0-9]/gi, '_')}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
      
    } else if (format === 'pdf') {
      // Generate professional PDF content
      const pdfContent = SmartExcelAnalyzer.generatePDFContent(plan);
      
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>${pdfContent.title}</title>
          <style>
            body { 
              font-family: 'Times New Roman', serif; 
              margin: 20px; 
              line-height: 1.4;
              color: #333;
            }
            .header { 
              text-align: center; 
              margin-bottom: 30px; 
              border-bottom: 2px solid #333;
              padding-bottom: 20px;
            }
            .company { 
              font-size: 16px; 
              font-weight: bold; 
              margin-bottom: 10px;
              text-transform: uppercase;
            }
            .plan-title { 
              font-size: 18px; 
              font-weight: bold; 
              margin: 10px 0;
              text-transform: uppercase;
            }
            .summary { 
              background: #f8f9fa; 
              padding: 15px; 
              margin: 20px 0; 
              border-left: 4px solid #007bff;
            }
            .summary h3 {
              margin-top: 0;
              color: #007bff;
            }
            table { 
              width: 100%; 
              border-collapse: collapse; 
              margin: 20px 0; 
              font-size: 12px;
            }
            th, td { 
              border: 1px solid #ddd; 
              padding: 8px; 
              text-align: left; 
              vertical-align: top;
            }
            th { 
              background-color: #007bff; 
              color: white; 
              font-weight: bold;
              text-align: center;
            }
            .insights { 
              margin-top: 20px; 
              background: #f8f9fa;
              padding: 15px;
              border-radius: 5px;
            }
            .insights h3 {
              color: #28a745;
              margin-top: 0;
            }
            .insights ol li { 
              margin: 8px 0; 
              line-height: 1.5;
            }
            .notes {
              margin-top: 20px;
              font-size: 11px;
              color: #666;
              border-top: 1px solid #ddd;
              padding-top: 15px;
            }
            .notes h4 {
              color: #dc3545;
              margin-bottom: 10px;
            }
            .footer {
              margin-top: 30px;
              text-align: center;
              font-size: 10px;
              color: #666;
              border-top: 1px solid #ddd;
              padding-top: 10px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="company">${pdfContent.company}</div>
            <div class="plan-title">${pdfContent.planType}</div>
            <p><strong>Ngày lập:</strong> ${pdfContent.date}</p>
            <p><strong>Người lập:</strong> Hệ thống AI LogiAI</p>
          </div>
          
          <div class="summary">
            <h3>📊 TỔNG QUAN KẾ HOẠCH</h3>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
              <div>
                <p><strong>🚛 Tổng số tuyến:</strong> ${pdfContent.summary.totalRoutes} tuyến</p>
                <p><strong>💰 Tổng chi phí:</strong> ${pdfContent.totalCost}</p>
              </div>
              <div>
                <p><strong>⚡ Hiệu suất dự kiến:</strong> ${pdfContent.summary.efficiency}%</p>
                <p><strong>⏱️ Thời gian thực hiện:</strong> ${pdfContent.summary.estimatedTime}</p>
              </div>
            </div>
          </div>
          
          <h3>🚚 CHI TIẾT TUYẾN ĐƯỜNG</h3>
          <table>
            <thead>
              <tr>
                <th>STT</th>
                <th>ĐIỂM ĐI</th>
                <th>ĐIỂM ĐẾN</th>
                <th>LOẠI XE</th>
                <th>GIỜ GIAO</th>
                <th>CHI PHÍ (VNĐ)</th>
                <th>KM</th>
                <th>LOẠI THỨC ĂN</th>
                <th>KHÁCH HÀNG</th>
                <th>GHI CHÚ</th>
              </tr>
            </thead>
            <tbody>
              ${pdfContent.routes.map((route: any, index: number) => `
                <tr>
                  <td style="text-align: center;">${index + 1}</td>
                  <td><strong>${route.from}</strong></td>
                  <td><strong>${route.to}</strong></td>
                  <td>${route.vehicle}</td>
                  <td style="text-align: center;">${route.time}</td>
                  <td style="text-align: right;"><strong>${new Intl.NumberFormat('vi-VN').format(route.cost)}</strong></td>
                  <td style="text-align: center;">${route.distance}</td>
                  <td>${route.feedType || 'Thức ăn chăn nuôi'}</td>
                  <td>${route.customer || 'Khách hàng'}</td>
                  <td><em>${route.logic}</em></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          
          <div class="insights">
            <h3>🤖 KHUYẾN NGHỊ CỦA HỆ THỐNG AI</h3>
            <ol>
              ${pdfContent.insights.map((insight: string) => `<li>${insight}</li>`).join('')}
            </ol>
          </div>
          
          <div class="notes">
            <h4>📋 GHI CHÚ QUAN TRỌNG:</h4>
            <ul>
              <li>Thời gian giao hàng có thể thay đổi tùy theo tình hình giao thông</li>
              <li>Cần kiểm tra chất lượng thức ăn trước khi giao hàng</li>
              <li>Liên hệ khách hàng trước 30 phút khi đến điểm giao hàng</li>
              <li>Báo cáo tình hình giao hàng về văn phòng sau khi hoàn thành</li>
              <li>Đảm bảo xe chuyên dụng thức ăn chăn nuôi, không chở hàng hóa khác</li>
            </ul>
          </div>
          
          <div class="footer">
            <p>Kế hoạch được tạo bởi Hệ thống AI LogiAI - Công ty Cổ phần Commodities Express</p>
            <p>Địa chỉ: Số 03 Nguyễn Lương Bằng, Phường Tân Phú, Quận 7, TP.HCM</p>
          </div>
        </body>
        </html>
      `;
      
      // Create blob and download
      const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `${plan.title.replace(/[^a-z0-9]/gi, '_')}.html`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const applyPlan = (plan: GeneratedPlan) => {
    // Simulate applying the plan to the system
    alert(language === 'vi' 
      ? `Đã áp dụng kế hoạch "${plan.title}" vào hệ thống. ${plan.summary.totalRoutes} tuyến đường đã được cập nhật.`
      : `Applied plan "${plan.title}" to system. ${plan.summary.totalRoutes} routes have been updated.`
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount)
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-4">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  {language === 'vi' ? 'AI Thức Ăn Chăn Nuôi Thông Minh' : 'Smart Feed Logistics AI'}
                </h1>
                <p className="text-xl text-slate-300 mt-2">
                  {language === 'vi' 
                    ? 'Hệ thống AI chuyên biệt cho logistics thức ăn chăn nuôi miền Nam Việt Nam'
                    : 'Specialized AI system for Southern Vietnam feed logistics operations'
                  }
                </p>
              </div>
            </div>
            
            <div className="flex items-center justify-center gap-4">
              <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 px-4 py-2">
                <Sparkles className="w-4 h-4 mr-2" />
                {language === 'vi' ? 'AI Chuyên biệt' : 'Specialized AI'}
              </Badge>
              <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 px-4 py-2">
                <FileSpreadsheet className="w-4 h-4 mr-2" />
                {language === 'vi' ? 'Thức ăn chăn nuôi' : 'Feed Logistics'}
              </Badge>
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30 px-4 py-2">
                <Target className="w-4 h-4 mr-2" />
                {language === 'vi' ? 'Miền Nam VN' : 'Southern Vietnam'}
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* File Upload Section */}
            <div className="space-y-6">
              <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-white">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                      <Upload className="w-4 h-4 text-white" />
                    </div>
                    {language === 'vi' ? 'Tải lên File Kế Hoạch' : 'Upload Planning Files'}
                  </CardTitle>
                  <CardDescription className="text-slate-400">
                    {language === 'vi' 
                      ? 'Kéo thả file KẾ HOẠCH NGÀY.xlsx để AI phân tích thông minh'
                      : 'Drag & drop KẾ HOẠCH NGÀY.xlsx files for smart AI analysis'
                    }
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div
                    className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
                      dragActive 
                        ? 'border-blue-400 bg-blue-500/10' 
                        : 'border-slate-600 hover:border-slate-500'
                    }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                  >
                    <div className="space-y-4">
                      <div className="w-16 h-16 bg-slate-700/50 rounded-2xl flex items-center justify-center mx-auto">
                        <FileSpreadsheet className="w-8 h-8 text-slate-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-2">
                          {language === 'vi' ? 'Kéo thả file vào đây' : 'Drag files here'}
                        </h3>
                        <p className="text-slate-400 mb-4">
                          {language === 'vi' 
                            ? 'Hỗ trợ: KẾ HOẠCH NGÀY.xlsx, file logistics miền Nam'
                            : 'Supported: KẾ HOẠCH NGÀY.xlsx, Southern Vietnam logistics files'
                          }
                        </p>
                        <input
                          type="file"
                          multiple
                          accept=".xlsx,.xls"
                          onChange={(e) => e.target.files && handleFiles(e.target.files)}
                          className="hidden"
                          id="file-upload"
                        />
                        <label htmlFor="file-upload">
                          <Button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white cursor-pointer">
                            <Upload className="w-4 h-4 mr-2" />
                            {language === 'vi' ? 'Chọn File' : 'Select Files'}
                          </Button>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Processing Status */}
                  {isProcessing && (
                    <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
                      <div className="flex items-center gap-3">
                        <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />
                        <span className="text-blue-400 font-medium">
                          {language === 'vi' ? 'AI đang phân tích thông minh...' : 'AI is performing smart analysis...'}
                        </span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Uploaded Files List */}
              {uploadedFiles.length > 0 && (
                <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50 shadow-xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-white">
                      <FileCheck className="w-5 h-5" />
                      {language === 'vi' ? 'File Đã Phân Tích' : 'Analyzed Files'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {uploadedFiles.map((file) => (
                      <div key={file.id} className="bg-slate-700/30 rounded-xl p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <FileSpreadsheet className="w-5 h-5 text-green-400" />
                            <div>
                              <p className="text-white font-medium">{file.name}</p>
                              <p className="text-slate-400 text-sm">
                                {(file.size / 1024).toFixed(1)} KB • {file.uploadedAt.toLocaleTimeString()}
                              </p>
                            </div>
                          </div>
                          <Badge className={`${
                            file.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                            file.status === 'processing' ? 'bg-blue-500/20 text-blue-400' :
                            'bg-red-500/20 text-red-400'
                          }`}>
                            {file.status === 'completed' ? (
                              language === 'vi' ? 'Đã phân tích' : 'Analyzed'
                            ) : file.status === 'processing' ? (
                              language === 'vi' ? 'Đang phân tích' : 'Analyzing'
                            ) : (
                              language === 'vi' ? 'Lỗi' : 'Error'
                            )}
                          </Badge>
                        </div>
                        
                        {file.insights && (
                          <div className="mt-3 space-y-2">
                            <p className="text-slate-300 text-sm font-medium">
                              {language === 'vi' ? 'Phân tích thông minh AI:' : 'Smart AI Analysis:'}
                            </p>
                            {file.insights.map((insight, index) => (
                              <div key={index} className="flex items-center gap-2 text-sm">
                                <CheckCircle className="w-3 h-3 text-green-400" />
                                <span className="text-slate-300">{insight}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}
            </div>

            {/* AI Generation Section */}
            <div className="space-y-6">
              <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-white">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                      <Brain className="w-4 h-4 text-white" />
                    </div>
                    {language === 'vi' ? 'Tạo Kế Hoạch AI Thông Minh' : 'Generate Smart AI Plan'}
                  </CardTitle>
                  <CardDescription className="text-slate-400">
                    {language === 'vi' 
                      ? 'AI sẽ phân tích dữ liệu miền Nam và tạo kế hoạch logistics thực tế'
                      : 'AI will analyze Southern Vietnam data and create realistic logistics plans'
                    }
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label className="text-slate-200 font-medium">
                      {language === 'vi' ? 'Yêu cầu đặc biệt (tùy chọn)' : 'Special Requirements (Optional)'}
                    </Label>
                    <textarea
                      placeholder={language === 'vi' 
                        ? 'VD: Tập trung miền Nam, tối ưu chi phí, ưu tiên cảng Cát Lái...'
                        : 'e.g., Focus on Southern Vietnam, optimize costs, prioritize Cat Lai port...'
                      }
                      value={aiPrompt}
                      onChange={(e) => setAiPrompt(e.target.value)}
                      className="w-full bg-slate-700/50 border border-slate-600/50 text-white placeholder-slate-400 rounded-xl p-4 min-h-[100px] resize-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 focus:outline-none transition-all duration-300"
                    />
                  </div>

                  <Button 
                    onClick={generateAIPlan}
                    disabled={isGenerating || uploadedFiles.length === 0}
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3 rounded-xl"
                  >
                    {isGenerating ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        {language === 'vi' ? 'AI đang tạo kế hoạch thông minh...' : 'AI is generating smart plan...'}
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-5 h-5" />
                        {language === 'vi' ? 'Tạo Kế Hoạch Miền Nam' : 'Generate Southern Plan'}
                      </div>
                    )}
                  </Button>

                  {uploadedFiles.length === 0 && (
                    <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
                      <div className="flex items-center gap-3">
                        <Info className="w-5 h-5 text-yellow-400" />
                        <span className="text-yellow-400 text-sm">
                          {language === 'vi' 
                            ? 'Tải lên file KẾ HOẠCH NGÀY để AI phân tích và tạo kế hoạch thực tế'
                            : 'Upload KẾ HOẠCH NGÀY files for AI to analyze and create realistic plans'
                          }
                        </span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Generated Plans */}
              {generatedPlans.length > 0 && (
                <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50 shadow-xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-white">
                      <Calendar className="w-5 h-5" />
                      {language === 'vi' ? 'Kế Hoạch AI Đã Tạo' : 'Generated AI Plans'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {generatedPlans.map((plan) => (
                      <div key={plan.id} className="bg-slate-700/30 rounded-xl p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-semibold text-white">{plan.title}</h3>
                          <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                            {language === 'vi' ? 'Mới tạo' : 'New'}
                          </Badge>
                        </div>

                        {/* Summary Stats */}
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div className="bg-slate-600/30 rounded-lg p-3 text-center">
                            <div className="text-2xl font-bold text-blue-400">{plan.summary.totalRoutes}</div>
                            <div className="text-slate-400 text-sm">
                              {language === 'vi' ? 'Tuyến đường' : 'Routes'}
                            </div>
                          </div>
                          <div className="bg-slate-600/30 rounded-lg p-3 text-center">
                            <div className="text-2xl font-bold text-green-400">{plan.summary.efficiency}%</div>
                            <div className="text-slate-400 text-sm">
                              {language === 'vi' ? 'Hiệu suất' : 'Efficiency'}
                            </div>
                          </div>
                        </div>

                        {/* Routes */}
                        <div className="space-y-2 mb-4">
                          <h4 className="text-white font-medium">
                            {language === 'vi' ? 'Tuyến đường:' : 'Routes:'}
                          </h4>
                          {plan.routes.map((route, index) => (
                            <div key={index} className="bg-slate-600/20 rounded-lg p-4 space-y-2">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <Truck className="w-4 h-4 text-blue-400" />
                                  <span className="text-white font-medium">
                                    {route.from} → {route.to}
                                  </span>
                                </div>
                                <div className="flex items-center gap-4 text-sm">
                                  <span className="text-slate-400">{route.vehicle}</span>
                                  <span className="text-slate-400">{route.time}</span>
                                  <span className="text-green-400 font-medium">
                                    {formatCurrency(route.cost)}
                                  </span>
                                </div>
                              </div>
                              {/* Business Logic Display */}
                              {(route as any).logic && (
                                <div className="flex items-center gap-2 text-xs">
                                  <Info className="w-3 h-3 text-blue-400" />
                                  <span className="text-blue-300 italic">{(route as any).logic}</span>
                                </div>
                              )}
                              {/* Distance and Duration */}
                              {(route as any).distance && (
                                <div className="flex items-center gap-4 text-xs text-slate-400">
                                  <span>📏 {(route as any).distance} km</span>
                                  <span>⏱️ {(route as any).duration} giờ</span>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>

                        {/* Insights */}
                        {plan.insights && plan.insights.length > 0 && (
                          <div className="mb-4">
                            <h4 className="text-white font-medium mb-2">
                              {language === 'vi' ? 'Khuyến nghị AI:' : 'AI Recommendations:'}
                            </h4>
                            <div className="space-y-1">
                              {plan.insights.map((insight, index) => (
                                <div key={index} className="flex items-center gap-2 text-sm">
                                  <CheckCircle className="w-3 h-3 text-green-400" />
                                  <span className="text-slate-300">{insight}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Enhanced Functional Actions */}
                        <div className="flex gap-2">
                          <div className="flex gap-1">
                            <Button 
                              onClick={() => downloadPlan(plan, 'excel')}
                              className="bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500/30 transition-all duration-300"
                            >
                              <FileSpreadsheet className="w-4 h-4 mr-2" />
                              {language === 'vi' ? 'Excel' : 'Excel'}
                            </Button>
                            <Button 
                              onClick={() => downloadPlan(plan, 'pdf')}
                              className="bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30 transition-all duration-300"
                            >
                              <FileText className="w-4 h-4 mr-2" />
                              {language === 'vi' ? 'PDF' : 'PDF'}
                            </Button>
                          </div>
                          <Button 
                            onClick={() => applyPlan(plan)}
                            className="bg-blue-500/20 text-blue-400 border border-blue-500/30 hover:bg-blue-500/30 transition-all duration-300"
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            {language === 'vi' ? 'Áp dụng' : 'Apply'}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  )
}

export default SuperAIAssistant
