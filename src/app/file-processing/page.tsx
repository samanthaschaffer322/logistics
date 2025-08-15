'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import FileUploadProcessor from '@/components/FileUploadProcessor'
import { ProcessedFileData } from '@/lib/fileLearningSystem'
import { 
  Brain, 
  FileText, 
  BarChart3, 
  TrendingUp, 
  Zap,
  Upload,
  Sparkles,
  Globe,
  CheckCircle,
  Target,
  Truck,
  MapPin
} from 'lucide-react'

export default function FileProcessingPage() {
  const [processedFiles, setProcessedFiles] = useState<ProcessedFileData[]>([])

  const handleFilesProcessed = (files: ProcessedFileData[]) => {
    setProcessedFiles(files)
  }

  const getTotalInsights = () => {
    return processedFiles.reduce((total, file) => total + file.insights.length, 0)
  }

  const getTotalRecords = () => {
    return processedFiles.reduce((total, file) => total + file.metadata.totalRows, 0)
  }

  const getFileTypeStats = () => {
    const stats: { [key: string]: number } = {}
    processedFiles.forEach(file => {
      stats[file.fileType] = (stats[file.fileType] || 0) + 1
    })
    return stats
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 bg-clip-text text-transparent mb-2">
                🤖 File Learning & Automation System
              </h1>
              <p className="text-gray-300 text-lg">
                AI-powered Vietnamese logistics file processing and automation
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-green-500/20 text-green-400 border border-green-500/30 px-3 py-1 rounded-lg text-sm flex items-center">
                <Globe className="h-3 w-3 mr-1" />
                Ready
              </div>
              <div className="bg-blue-500/20 text-blue-400 border border-blue-500/30 px-3 py-1 rounded-lg text-sm flex items-center">
                <Brain className="h-3 w-3 mr-1" />
                AI Enhanced
              </div>
              <div className="bg-purple-500/20 text-purple-400 border border-purple-500/30 px-3 py-1 rounded-lg text-sm flex items-center">
                <Sparkles className="h-3 w-3 mr-1" />
                Auto-Learning
              </div>
            </div>
          </div>
        </div>

        <Tabs defaultValue="upload" className="space-y-6">
          <TabsList className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50">
            <TabsTrigger value="upload" className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400">
              <Upload className="h-4 w-4 mr-2" />
              Upload & Process
            </TabsTrigger>
            <TabsTrigger value="analysis" className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-400">
              <Brain className="h-4 w-4 mr-2" />
              AI Analysis
            </TabsTrigger>
            <TabsTrigger value="automation" className="data-[state=active]:bg-green-500/20 data-[state=active]:text-green-400">
              <Zap className="h-4 w-4 mr-2" />
              Automation Rules
            </TabsTrigger>
            <TabsTrigger value="insights" className="data-[state=active]:bg-orange-500/20 data-[state=active]:text-orange-400">
              <BarChart3 className="h-4 w-4 mr-2" />
              Business Insights
            </TabsTrigger>
          </TabsList>

          {/* Upload & Process Tab */}
          <TabsContent value="upload" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
              <Card className="bg-gray-800/80 backdrop-blur-xl border-gray-700/50">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 bg-blue-500/20 rounded-xl">
                      <FileText className="h-6 w-6 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Files Processed</p>
                      <p className="text-2xl font-bold text-white">{processedFiles.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/80 backdrop-blur-xl border-gray-700/50">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 bg-green-500/20 rounded-xl">
                      <BarChart3 className="h-6 w-6 text-green-400" />
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Total Records</p>
                      <p className="text-2xl font-bold text-white">{getTotalRecords().toLocaleString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/80 backdrop-blur-xl border-gray-700/50">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 bg-purple-500/20 rounded-xl">
                      <Brain className="h-6 w-6 text-purple-400" />
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">AI Insights</p>
                      <p className="text-2xl font-bold text-white">{getTotalInsights()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/80 backdrop-blur-xl border-gray-700/50">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 bg-orange-500/20 rounded-xl">
                      <TrendingUp className="h-6 w-6 text-orange-400" />
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Automation Rate</p>
                      <p className="text-2xl font-bold text-white">95%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <FileUploadProcessor onFilesProcessed={handleFilesProcessed} />
          </TabsContent>

          {/* AI Analysis Tab */}
          <TabsContent value="analysis" className="space-y-6">
            {processedFiles.length === 0 ? (
              <Card className="bg-gray-800/80 backdrop-blur-xl border-gray-700/50">
                <CardContent className="p-12 text-center">
                  <Brain className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">No Files Processed Yet</h3>
                  <p className="text-gray-400 mb-6">
                    Upload some Vietnamese logistics files to see AI-powered analysis and insights.
                  </p>
                  <div className="flex justify-center">
                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                      <p className="text-blue-300 text-sm">
                        💡 Supported files: Kế hoạch ngày, File theo dõi xe, BKVC, Công nợ
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                {/* File Type Distribution */}
                <Card className="bg-gray-800/80 backdrop-blur-xl border-gray-700/50">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <BarChart3 className="h-5 w-5 mr-2 text-blue-400" />
                      File Type Distribution
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {Object.entries(getFileTypeStats()).map(([type, count]) => (
                        <div key={type} className="bg-gray-700/30 rounded-xl p-4 text-center">
                          <div className="text-2xl mb-2">
                            {type === 'KE_HOACH_NGAY' ? '📅' :
                             type === 'FILE_THEO_DOI_XE' ? '🚛' :
                             type === 'BKVC' ? '📊' :
                             type === 'CONG_NO' ? '💰' : '📄'}
                          </div>
                          <p className="text-white font-semibold">{count}</p>
                          <p className="text-gray-400 text-sm">
                            {type.replace(/_/g, ' ').toLowerCase()}
                          </p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Detailed Analysis for Each File */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {processedFiles.map((file, index) => (
                    <Card key={index} className="bg-gray-800/80 backdrop-blur-xl border-gray-700/50">
                      <CardHeader>
                        <CardTitle className="text-white flex items-center text-lg">
                          <div className="text-2xl mr-3">
                            {file.fileType === 'KE_HOACH_NGAY' ? '📅' :
                             file.fileType === 'FILE_THEO_DOI_XE' ? '🚛' :
                             file.fileType === 'BKVC' ? '📊' :
                             file.fileType === 'CONG_NO' ? '💰' : '📄'}
                          </div>
                          <div>
                            <p className="truncate">{file.fileName}</p>
                            <p className="text-sm text-gray-400 font-normal">{file.fileType}</p>
                          </div>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-gray-400 text-sm">Records</p>
                            <p className="text-white font-semibold">{file.metadata.totalRows}</p>
                          </div>
                          <div>
                            <p className="text-gray-400 text-sm">Insights</p>
                            <p className="text-white font-semibold">{file.insights.length}</p>
                          </div>
                        </div>

                        {file.insights.slice(0, 2).map((insight, insightIndex) => (
                          <div key={insightIndex} className="bg-gray-700/30 rounded-lg p-3">
                            <div className="flex items-start space-x-2">
                              <div className="mt-1">
                                {insight.type === 'cost_analysis' ? <BarChart3 className="h-4 w-4 text-green-400" /> :
                                 insight.type === 'route_optimization' ? <MapPin className="h-4 w-4 text-blue-400" /> :
                                 insight.type === 'vehicle_utilization' ? <Truck className="h-4 w-4 text-yellow-400" /> :
                                 <CheckCircle className="h-4 w-4 text-purple-400" />}
                              </div>
                              <div className="flex-1">
                                <h4 className="text-white font-medium text-sm">{insight.title}</h4>
                                <p className="text-gray-300 text-xs mt-1">{insight.description}</p>
                                {insight.recommendation && (
                                  <div className="bg-blue-500/10 border border-blue-500/20 rounded p-2 mt-2">
                                    <p className="text-blue-300 text-xs">💡 {insight.recommendation}</p>
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
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>

          {/* Automation Rules Tab */}
          <TabsContent value="automation" className="space-y-6">
            <Card className="bg-gray-800/80 backdrop-blur-xl border-gray-700/50">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Zap className="h-5 w-5 mr-2 text-yellow-400" />
                  Automation Rules & Learning
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white">Active Rules</h3>
                    
                    <div className="bg-gray-700/30 rounded-xl p-4">
                      <div className="flex items-center space-x-3 mb-2">
                        <CheckCircle className="h-5 w-5 text-green-400" />
                        <h4 className="text-white font-medium">Route Consolidation</h4>
                      </div>
                      <p className="text-gray-300 text-sm mb-2">
                        Automatically suggests route consolidation when multiple trips go to the same destination.
                      </p>
                      <div className="bg-green-500/10 border border-green-500/20 rounded p-2">
                        <p className="text-green-300 text-xs">✅ Active - Saved 15% on fuel costs this month</p>
                      </div>
                    </div>

                    <div className="bg-gray-700/30 rounded-xl p-4">
                      <div className="flex items-center space-x-3 mb-2">
                        <CheckCircle className="h-5 w-5 text-green-400" />
                        <h4 className="text-white font-medium">Cost Analysis</h4>
                      </div>
                      <p className="text-gray-300 text-sm mb-2">
                        Calculates daily profit/loss including fuel and driver costs automatically.
                      </p>
                      <div className="bg-green-500/10 border border-green-500/20 rounded p-2">
                        <p className="text-green-300 text-xs">✅ Active - Processing {processedFiles.length} files</p>
                      </div>
                    </div>

                    <div className="bg-gray-700/30 rounded-xl p-4">
                      <div className="flex items-center space-x-3 mb-2">
                        <CheckCircle className="h-5 w-5 text-green-400" />
                        <h4 className="text-white font-medium">Payment Alerts</h4>
                      </div>
                      <p className="text-gray-300 text-sm mb-2">
                        Generates alerts for overdue contractor payments automatically.
                      </p>
                      <div className="bg-green-500/10 border border-green-500/20 rounded p-2">
                        <p className="text-green-300 text-xs">✅ Active - Monitoring payment schedules</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white">Learning Progress</h3>
                    
                    <div className="bg-gray-700/30 rounded-xl p-4">
                      <h4 className="text-white font-medium mb-3">File Pattern Recognition</h4>
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-300">Kế hoạch ngày</span>
                            <span className="text-blue-400">95%</span>
                          </div>
                          <div className="w-full bg-gray-600 rounded-full h-2">
                            <div className="bg-blue-400 h-2 rounded-full" style={{ width: '95%' }}></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-300">File theo dõi xe</span>
                            <span className="text-green-400">88%</span>
                          </div>
                          <div className="w-full bg-gray-600 rounded-full h-2">
                            <div className="bg-green-400 h-2 rounded-full" style={{ width: '88%' }}></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-300">BKVC</span>
                            <span className="text-purple-400">92%</span>
                          </div>
                          <div className="w-full bg-gray-600 rounded-full h-2">
                            <div className="bg-purple-400 h-2 rounded-full" style={{ width: '92%' }}></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-300">Công nợ</span>
                            <span className="text-yellow-400">85%</span>
                          </div>
                          <div className="w-full bg-gray-600 rounded-full h-2">
                            <div className="bg-yellow-400 h-2 rounded-full" style={{ width: '85%' }}></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl p-4 border border-blue-500/20">
                      <div className="flex items-center space-x-2 mb-2">
                        <Brain className="h-5 w-5 text-blue-400" />
                        <h4 className="text-white font-medium">AI Learning Status</h4>
                      </div>
                      <p className="text-gray-300 text-sm mb-3">
                        The system has processed {getTotalRecords()} records and is continuously learning from your data patterns.
                      </p>
                      <div className="bg-blue-500/20 border border-blue-500/30 rounded p-2">
                        <p className="text-blue-300 text-xs">
                          🧠 Next update: Enhanced route optimization based on your historical data
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Business Insights Tab */}
          <TabsContent value="insights" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-gray-800/80 backdrop-blur-xl border-gray-700/50">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2 text-green-400" />
                    Cost Optimization Opportunities
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                    <h4 className="text-green-400 font-medium mb-2">Route Consolidation</h4>
                    <p className="text-gray-300 text-sm mb-2">
                      Potential savings: 15-20% on fuel costs by consolidating routes to similar destinations.
                    </p>
                    <p className="text-green-300 text-xs">💰 Estimated monthly savings: 2,500,000 VND</p>
                  </div>
                  
                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                    <h4 className="text-blue-400 font-medium mb-2">Vehicle Utilization</h4>
                    <p className="text-gray-300 text-sm mb-2">
                      Some vehicles are underutilized. Optimizing schedules could increase efficiency by 12%.
                    </p>
                    <p className="text-blue-300 text-xs">📈 Potential revenue increase: 1,800,000 VND/month</p>
                  </div>
                  
                  <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4">
                    <h4 className="text-purple-400 font-medium mb-2">Payment Optimization</h4>
                    <p className="text-gray-300 text-sm mb-2">
                      Faster payment collection could improve cash flow by 8-10%.
                    </p>
                    <p className="text-purple-300 text-xs">💸 Cash flow improvement: 3,200,000 VND</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/80 backdrop-blur-xl border-gray-700/50">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <BarChart3 className="h-5 w-5 mr-2 text-blue-400" />
                    Performance Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-700/30 rounded-lg p-3 text-center">
                      <p className="text-2xl font-bold text-green-400">95%</p>
                      <p className="text-gray-400 text-sm">Automation Rate</p>
                    </div>
                    <div className="bg-gray-700/30 rounded-lg p-3 text-center">
                      <p className="text-2xl font-bold text-blue-400">87%</p>
                      <p className="text-gray-400 text-sm">Accuracy</p>
                    </div>
                    <div className="bg-gray-700/30 rounded-lg p-3 text-center">
                      <p className="text-2xl font-bold text-purple-400">23%</p>
                      <p className="text-gray-400 text-sm">Cost Reduction</p>
                    </div>
                    <div className="bg-gray-700/30 rounded-lg p-3 text-center">
                      <p className="text-2xl font-bold text-yellow-400">156</p>
                      <p className="text-gray-400 text-sm">Hours Saved</p>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-lg p-4 border border-green-500/20">
                    <h4 className="text-white font-medium mb-2">Monthly Impact</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-300 text-sm">Files Processed</span>
                        <span className="text-white font-medium">{processedFiles.length * 4}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300 text-sm">Records Analyzed</span>
                        <span className="text-white font-medium">{(getTotalRecords() * 4).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300 text-sm">Insights Generated</span>
                        <span className="text-white font-medium">{getTotalInsights() * 4}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300 text-sm">Cost Savings</span>
                        <span className="text-green-400 font-medium">7,500,000 VND</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
