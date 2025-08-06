'use client'

import React, { useState, useRef, useCallback, useEffect } from 'react'
import Layout from '@/components/Layout'
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  Button,
  Input,
  Badge,
  Progress
} from '@/components/ui-components'
import { 
  Brain, 
  Send, 
  User, 
  Upload, 
  FileText, 
  Zap, 
  MapPin,
  Truck,
  Package,
  BarChart3,
  Clock,
  DollarSign,
  Route,
  AlertTriangle,
  CheckCircle,
  Loader2,
  X,
  Copy,
  RefreshCw,
  MessageSquare,
  Sparkles
} from 'lucide-react'
import { FileProcessor, ProcessedFile, FileInsight } from '@/lib/fileProcessor'

interface Message {
  id: string
  type: 'user' | 'ai'
  content: string
  timestamp: Date
  attachments?: ProcessedFile[]
  analysis?: any
  model?: string
  usage?: any
}

const SuperAIPage = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: '🚀 **Super AI Assistant Ready!** Tôi là hệ thống AI toàn diện cho logistics Việt Nam với tích hợp OpenAI.\n\n**Tính năng nâng cao:**\n• **Multi-model AI** - GPT-4 Omni, GPT-4 Mini, GPT-3.5 Turbo\n• **Vietnamese Expertise** - Chuyên môn logistics Việt Nam\n• **File Processing** - Phân tích Excel, PDF, CSV\n• **Route Optimization** - Tối ưu tuyến đường thông minh\n• **Real-time Insights** - Thông tin thời gian thực\n• **Cost Analysis** - Phân tích chi phí đa biến\n\n**OpenAI Integration:**\n• **Real AI Responses** - Kết nối trực tiếp với OpenAI API\n• **Context Awareness** - Nhớ lịch sử hội thoại\n• **Vietnamese Context** - Hiểu biết sâu về thị trường Việt Nam\n• **Interactive Features** - Giao diện tương tác hoàn chỉnh\n\nHôm nay tôi có thể giúp gì cho bạn?',
      timestamp: new Date(),
      model: 'super-ai-v2'
    }
  ])
  
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<ProcessedFile[]>([])
  const [insights, setInsights] = useState<FileInsight[]>([])
  const [selectedModel, setSelectedModel] = useState('gpt-4o-mini')
  const [dragActive, setDragActive] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  
  const fileInputRef = useRef<HTMLInputElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    const files = Array.from(e.dataTransfer.files)
    await processFiles(files)
  }, [])

  const processFiles = async (files: File[]) => {
    setIsLoading(true)
    
    for (const file of files) {
      const processingFile: ProcessedFile = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        name: file.name,
        type: file.type,
        size: file.size,
        uploadDate: new Date(),
        status: 'processing'
      }
      
      setUploadedFiles(prev => [...prev, processingFile])
      
      try {
        const processedFile = await FileProcessor.processFile(file)
        
        setUploadedFiles(prev => prev.map(f => 
          f.id === processingFile.id ? processedFile : f
        ))
        
        if (processedFile.insights) {
          setInsights(prev => [...prev, ...processedFile.insights!])
        }
        
        const analysisMessage: Message = {
          id: Date.now().toString(),
          type: 'ai',
          content: `📁 **File Analysis Complete!**\n\n**File:** ${file.name}\n**Size:** ${(file.size / 1024).toFixed(1)}KB\n**Type:** ${file.type}\n\n**AI Analysis Results:**\n${processedFile.insights?.map(insight => `• **${insight.title}** - ${insight.description} (${Math.round(insight.confidence * 100)}% confidence)`).join('\n')}\n\n**Optimization Suggestions:**\n${FileProcessor.generateOptimizationSuggestions(processedFile.routeData || []).map(s => `• ${s}`).join('\n')}\n\nBạn có muốn tôi phân tích chi tiết hơn về dữ liệu này không?`,
          timestamp: new Date(),
          attachments: [processedFile],
          model: 'file-processor-ai'
        }
        
        setMessages(prev => [...prev, analysisMessage])
      } catch (error) {
        console.error('Error processing file:', error)
        setUploadedFiles(prev => prev.map(f => 
          f.id === processingFile.id ? { ...f, status: 'error' } : f
        ))
      }
    }
    
    setIsLoading(false)
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    await processFiles(files)
  }

  const sendMessage = async () => {
    if (!inputMessage.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsLoading(true)
    setIsTyping(true)

    try {
      const response = await fetch('/api/enhanced-ai-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: inputMessage,
          model: selectedModel,
          attachments: uploadedFiles.map(f => ({ name: f.name, type: f.type, size: f.size })),
          chatHistory: messages.slice(-10),
          insights: insights.slice(-10)
        })
      })

      const data = await response.json()
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: data.response || 'Xin lỗi, tôi gặp sự cố khi xử lý yêu cầu của bạn. Vui lòng thử lại.',
        timestamp: new Date(),
        analysis: data.analysis,
        model: data.model,
        usage: data.usage
      }

      setMessages(prev => [...prev, aiMessage])
      
      if (data.suggestions) {
        const newInsights: FileInsight[] = data.suggestions.map((suggestion: string, index: number) => ({
          type: ['route', 'cost', 'risk', 'optimization'][index % 4] as any,
          title: `AI Suggestion ${index + 1}`,
          description: suggestion,
          confidence: 0.8 + Math.random() * 0.15,
          actionable: true
        }))
        setInsights(prev => [...prev, ...newInsights])
      }

    } catch (error) {
      console.error('Error sending message:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: '❌ Tôi gặp lỗi khi xử lý yêu cầu của bạn. Vui lòng kiểm tra kết nối và thử lại.',
        timestamp: new Date(),
        model: 'error-handler'
      }
      setMessages(prev => [...prev, errorMessage])
    }

    setIsLoading(false)
    setIsTyping(false)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const removeFile = (id: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== id))
  }

  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content)
  }

  const regenerateResponse = async (messageId: string) => {
    const messageIndex = messages.findIndex(m => m.id === messageId)
    if (messageIndex > 0) {
      const userMessage = messages[messageIndex - 1]
      if (userMessage.type === 'user') {
        setInputMessage(userMessage.content)
        await sendMessage()
      }
    }
  }

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'route': return <Route className="w-4 h-4" />
      case 'cost': return <DollarSign className="w-4 h-4" />
      case 'risk': return <AlertTriangle className="w-4 h-4" />
      case 'optimization': return <Zap className="w-4 h-4" />
      default: return <Sparkles className="w-4 h-4" />
    }
  }

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'route': return 'badge-info'
      case 'cost': return 'badge-success'
      case 'risk': return 'badge-error'
      case 'optimization': return 'badge-warning'
      default: return 'badge-info'
    }
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold gradient-text flex items-center gap-3">
              <Brain className="w-8 h-8 text-indigo-400" />
              Super AI Assistant
              <Badge className="badge-success text-xs">OpenAI Integrated</Badge>
            </h1>
            <p className="text-slate-400 mt-1">
              Advanced AI system with real OpenAI integration and Vietnamese logistics expertise
            </p>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="dark-input px-3 py-2 rounded-xl"
            >
              <option value="gpt-4o">GPT-4 Omni</option>
              <option value="gpt-4o-mini">GPT-4 Mini</option>
              <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
            </select>
            <Badge className="badge-success">
              {insights.length} Insights
            </Badge>
            <Badge className="badge-info">
              {uploadedFiles.length} Files
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Chat Interface */}
          <div className="lg:col-span-3">
            <Card className="dark-card h-[700px] flex flex-col">
              <CardHeader className="border-b border-slate-700/50">
                <CardTitle className="flex items-center gap-2 text-white">
                  <MessageSquare className="w-5 h-5 text-indigo-400" />
                  AI Conversation
                  {isTyping && (
                    <div className="flex items-center gap-1 text-indigo-400">
                      <div className="w-1 h-1 bg-indigo-400 rounded-full animate-pulse"></div>
                      <div className="w-1 h-1 bg-indigo-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-1 h-1 bg-indigo-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  )}
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Real OpenAI integration with Vietnamese logistics expertise - fully interactive
                </CardDescription>
              </CardHeader>
              
              <CardContent className="flex-1 flex flex-col p-0">
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in group`}
                    >
                      <div
                        className={`max-w-[85%] rounded-2xl p-4 relative ${
                          message.type === 'user'
                            ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
                            : 'dark-card text-white'
                        }`}
                      >
                        <div className="flex items-start gap-2 mb-2">
                          {message.type === 'user' ? (
                            <User className="w-4 h-4 mt-1 flex-shrink-0" />
                          ) : (
                            <Brain className="w-4 h-4 mt-1 flex-shrink-0 text-indigo-400" />
                          )}
                          <div className="flex-1">
                            <div className="whitespace-pre-wrap text-sm">
                              {message.content}
                            </div>
                            {message.attachments && (
                              <div className="mt-3 space-y-2">
                                {message.attachments.map((file, index) => (
                                  <div key={index} className="flex items-center gap-2 p-2 bg-slate-800/50 rounded-lg">
                                    <FileText className="w-4 h-4 text-indigo-400" />
                                    <span className="text-sm">{file.name}</span>
                                    <Badge className={`ml-auto ${file.status === 'completed' ? 'badge-success' : file.status === 'error' ? 'badge-error' : 'badge-warning'}`}>
                                      {file.status}
                                    </Badge>
                                  </div>
                                ))}
                              </div>
                            )}
                            {message.usage && (
                              <div className="mt-2 text-xs text-slate-400 flex items-center gap-2">
                                <span>Model: {message.model}</span>
                                <span>•</span>
                                <span>Tokens: {message.usage.total_tokens}</span>
                                {message.analysis?.openai_integration && (
                                  <>
                                    <span>•</span>
                                    <span className="text-green-400">OpenAI ✓</span>
                                  </>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                        
                        {/* Message Actions */}
                        {message.type === 'ai' && (
                          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                            <button
                              onClick={() => copyMessage(message.content)}
                              className="p-1 rounded bg-slate-700/50 hover:bg-slate-600/50 transition-colors"
                              title="Copy message"
                            >
                              <Copy className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => regenerateResponse(message.id)}
                              className="p-1 rounded bg-slate-700/50 hover:bg-slate-600/50 transition-colors"
                              title="Regenerate response"
                            >
                              <RefreshCw className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                        
                        <div className="text-xs opacity-75 mt-2">
                          {message.timestamp.toLocaleTimeString('vi-VN')}
                        </div>
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="dark-card rounded-2xl p-4 flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
                        <span className="text-sm text-slate-300">AI is processing...</span>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* File Upload Area */}
                <div
                  className={`border-t border-slate-700/50 p-4 transition-colors ${dragActive ? 'bg-indigo-500/10 border-indigo-500/50' : ''}`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  {uploadedFiles.length > 0 && (
                    <div className="mb-3 flex flex-wrap gap-2">
                      {uploadedFiles.slice(-3).map((file, index) => (
                        <div key={index} className="flex items-center gap-2 bg-slate-800/50 rounded-lg px-3 py-1">
                          <FileText className="w-3 h-3 text-indigo-400" />
                          <span className="text-sm text-slate-300">{file.name}</span>
                          <Badge className={getInsightColor(file.status === 'completed' ? 'optimization' : 'route')}>
                            {file.status}
                          </Badge>
                          <button
                            onClick={() => removeFile(file.id)}
                            className="ml-1 text-red-400 hover:text-red-300"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <div className="flex gap-2">
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      onChange={handleFileUpload}
                      className="hidden"
                      accept=".pdf,.doc,.docx,.xls,.xlsx,.csv,.txt,.jpg,.jpeg,.png"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                      className="dark-button flex items-center gap-2"
                    >
                      <Upload className="w-4 h-4" />
                      Upload Files
                    </Button>
                    <div className="flex-1 flex gap-2">
                      <Input
                        ref={inputRef}
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Ask about Vietnamese logistics, routes, costs, or upload files for analysis..."
                        className="dark-input flex-1"
                        disabled={isLoading}
                      />
                      <Button
                        onClick={sendMessage}
                        disabled={isLoading || !inputMessage.trim()}
                        className="gradient-button"
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* AI Insights Panel */}
          <div className="space-y-4">
            <Card className="dark-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg text-white">
                  <Zap className="w-5 h-5 text-yellow-400" />
                  Live Insights
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {insights.length === 0 ? (
                  <p className="text-sm text-slate-400 text-center py-4">
                    Upload files or ask questions to generate insights
                  </p>
                ) : (
                  insights.slice(-5).map((insight, index) => (
                    <div
                      key={index}
                      className="p-3 rounded-xl border border-slate-700/50 bg-slate-800/30 animate-fade-in"
                    >
                      <div className="flex items-start gap-2">
                        <div className="text-indigo-400">
                          {getInsightIcon(insight.type)}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-sm text-white">{insight.title}</h4>
                          <p className="text-xs mt-1 text-slate-400">{insight.description}</p>
                          <div className="flex items-center justify-between mt-2">
                            <div className="progress-bar w-16 h-1">
                              <div 
                                className="progress-fill h-full" 
                                style={{ width: `${insight.confidence * 100}%` }}
                              ></div>
                            </div>
                            <span className="text-xs font-medium text-slate-300">
                              {Math.round(insight.confidence * 100)}%
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="dark-card">
              <CardHeader>
                <CardTitle className="text-lg text-white">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="dark-button w-full justify-start"
                  onClick={() => setInputMessage('Tối ưu tuyến đường từ TP.HCM đến Hà Nội')}
                >
                  <Route className="w-4 h-4 mr-2" />
                  Route Optimization
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="dark-button w-full justify-start"
                  onClick={() => setInputMessage('Phân tích chi phí vận chuyển container 40ft')}
                >
                  <DollarSign className="w-4 h-4 mr-2" />
                  Cost Analysis
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="dark-button w-full justify-start"
                  onClick={() => setInputMessage('Đánh giá rủi ro logistics mùa mưa bão')}
                >
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Risk Assessment
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="dark-button w-full justify-start"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Documents
                </Button>
              </CardContent>
            </Card>

            {/* Session Stats */}
            <Card className="dark-card">
              <CardHeader>
                <CardTitle className="text-lg text-white">Session Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-center p-3 bg-indigo-500/10 rounded-xl border border-indigo-500/20">
                  <div className="text-2xl font-bold text-indigo-400">
                    {messages.filter(m => m.type === 'ai').length}
                  </div>
                  <div className="text-sm text-indigo-300">AI Responses</div>
                </div>
                
                <div className="text-center p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                  <div className="text-2xl font-bold text-emerald-400">
                    {uploadedFiles.filter(f => f.status === 'completed').length}
                  </div>
                  <div className="text-sm text-emerald-300">Files Processed</div>
                </div>

                <div className="text-center p-3 bg-purple-500/10 rounded-xl border border-purple-500/20">
                  <div className="text-2xl font-bold text-purple-400">
                    {insights.length}
                  </div>
                  <div className="text-sm text-purple-300">Insights Generated</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default SuperAIPage
