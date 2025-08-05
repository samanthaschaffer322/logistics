'use client'

import React, { useState, useRef, useCallback } from 'react'
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
  Progress,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@/components/ui-components'
import { 
  Brain, 
  Send, 
  User, 
  Upload, 
  FileText, 
  Image as ImageIcon, 
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
  Loader2
} from 'lucide-react'

interface Message {
  id: string
  type: 'user' | 'ai'
  content: string
  timestamp: Date
  attachments?: File[]
  analysis?: any
}

interface AIInsight {
  type: 'route' | 'cost' | 'risk' | 'optimization'
  title: string
  content: string
  confidence: number
  actionable: boolean
}

const SuperAIPage = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: '🚀 **Super AI Assistant Ready!** I\'m your comprehensive Vietnamese logistics intelligence system. I can help with:\n\n• **Route Optimization** - Smart path planning with real-time data\n• **Document Analysis** - Upload and analyze logistics documents\n• **Cost Optimization** - Multi-variable cost analysis\n• **Risk Assessment** - Predictive risk analysis\n• **File Learning** - Learn from your uploaded data\n• **Real-time Insights** - Live recommendations across all systems\n\nHow can I optimize your logistics operations today?',
      timestamp: new Date()
    }
  ])
  
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [insights, setInsights] = useState<AIInsight[]>([])
  const [selectedModel, setSelectedModel] = useState('gpt-4o')
  const [dragActive, setDragActive] = useState(false)
  
  const fileInputRef = useRef<HTMLInputElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    const files = Array.from(e.dataTransfer.files)
    setUploadedFiles(prev => [...prev, ...files])
    
    // Trigger AI analysis of uploaded files
    analyzeUploadedFiles(files)
  }, [])

  const analyzeUploadedFiles = async (files: File[]) => {
    // Simulate AI analysis of uploaded files
    const newInsights: AIInsight[] = files.map(file => ({
      type: 'optimization',
      title: `Analysis: ${file.name}`,
      content: `Analyzed ${file.type} file. Found optimization opportunities in logistics data.`,
      confidence: 0.85 + Math.random() * 0.1,
      actionable: true
    }))
    
    setInsights(prev => [...prev, ...newInsights])
    
    // Add AI message about file analysis
    const analysisMessage: Message = {
      id: Date.now().toString(),
      type: 'ai',
      content: `📁 **File Analysis Complete!**\n\nI've analyzed ${files.length} file(s) and found several optimization opportunities:\n\n${files.map(f => `• **${f.name}** - ${f.type} (${(f.size / 1024).toFixed(1)}KB)`).join('\n')}\n\n**Key Insights:**\n• Route efficiency can be improved by 15-20%\n• Cost savings potential: $2,500-4,000/month\n• Risk factors identified and mitigation suggested\n\nWould you like detailed analysis of any specific file?`,
      timestamp: new Date(),
      attachments: files
    }
    
    setMessages(prev => [...prev, analysisMessage])
    setTimeout(scrollToBottom, 100)
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setUploadedFiles(prev => [...prev, ...files])
    analyzeUploadedFiles(files)
  }

  const sendMessage = async () => {
    if (!inputMessage.trim() && uploadedFiles.length === 0) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date(),
      attachments: uploadedFiles.length > 0 ? uploadedFiles : undefined
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/enhanced-ai-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: inputMessage,
          model: selectedModel,
          attachments: uploadedFiles.map(f => ({ name: f.name, type: f.type, size: f.size })),
          chatHistory: messages.slice(-5)
        })
      })

      const data = await response.json()
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: data.response || 'I apologize, but I encountered an issue processing your request. Please try again.',
        timestamp: new Date(),
        analysis: data.analysis
      }

      setMessages(prev => [...prev, aiMessage])
      
      // Generate insights based on AI response
      if (data.suggestions) {
        const newInsights: AIInsight[] = data.suggestions.map((suggestion: string, index: number) => ({
          type: ['route', 'cost', 'risk', 'optimization'][index % 4] as any,
          title: `AI Suggestion ${index + 1}`,
          content: suggestion,
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
        content: '❌ I encountered an error processing your request. Please check your connection and try again.',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    }

    setIsLoading(false)
    setUploadedFiles([])
    setTimeout(scrollToBottom, 100)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'route': return <Route className="w-4 h-4" />
      case 'cost': return <DollarSign className="w-4 h-4" />
      case 'risk': return <AlertTriangle className="w-4 h-4" />
      default: return <Zap className="w-4 h-4" />
    }
  }

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'route': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'cost': return 'bg-green-100 text-green-800 border-green-200'
      case 'risk': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-purple-100 text-purple-800 border-purple-200'
    }
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Brain className="w-8 h-8 text-purple-600" />
              Super AI Assistant
            </h1>
            <p className="text-gray-600 mt-1">
              Comprehensive AI-powered logistics intelligence system
            </p>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="gpt-4o">GPT-4 Omni</option>
              <option value="gpt-4o-mini">GPT-4 Mini</option>
              <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
            </select>
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              {insights.length} Active Insights
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Chat Interface */}
          <div className="lg:col-span-3">
            <Card className="h-[600px] flex flex-col">
              <CardHeader className="border-b">
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-purple-600" />
                  AI Conversation
                </CardTitle>
                <CardDescription>
                  Upload files, ask questions, get intelligent logistics insights
                </CardDescription>
              </CardHeader>
              
              <CardContent className="flex-1 flex flex-col p-0">
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg p-4 ${
                          message.type === 'user'
                            ? 'bg-purple-600 text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        <div className="flex items-start gap-2 mb-2">
                          {message.type === 'user' ? (
                            <User className="w-4 h-4 mt-1 flex-shrink-0" />
                          ) : (
                            <Brain className="w-4 h-4 mt-1 flex-shrink-0 text-purple-600" />
                          )}
                          <div className="flex-1">
                            <div className="whitespace-pre-wrap text-sm">
                              {message.content}
                            </div>
                            {message.attachments && (
                              <div className="mt-2 space-y-1">
                                {message.attachments.map((file, index) => (
                                  <div key={index} className="flex items-center gap-2 text-xs opacity-75">
                                    <FileText className="w-3 h-3" />
                                    {file.name}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="text-xs opacity-75">
                          {message.timestamp.toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-gray-100 rounded-lg p-4 flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin text-purple-600" />
                        <span className="text-sm text-gray-600">AI is thinking...</span>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* File Upload Area */}
                <div
                  className={`border-t p-4 ${dragActive ? 'bg-purple-50 border-purple-300' : ''}`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  {uploadedFiles.length > 0 && (
                    <div className="mb-3 flex flex-wrap gap-2">
                      {uploadedFiles.map((file, index) => (
                        <Badge key={index} variant="secondary" className="flex items-center gap-1">
                          <FileText className="w-3 h-3" />
                          {file.name}
                          <button
                            onClick={() => setUploadedFiles(prev => prev.filter((_, i) => i !== index))}
                            className="ml-1 text-red-500 hover:text-red-700"
                          >
                            ×
                          </button>
                        </Badge>
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
                      className="flex items-center gap-2"
                    >
                      <Upload className="w-4 h-4" />
                      Upload Files
                    </Button>
                    <div className="flex-1 flex gap-2">
                      <Input
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Ask about routes, costs, optimization, or upload files for analysis..."
                        className="flex-1"
                        disabled={isLoading}
                      />
                      <Button
                        onClick={sendMessage}
                        disabled={isLoading || (!inputMessage.trim() && uploadedFiles.length === 0)}
                        className="bg-purple-600 hover:bg-purple-700"
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
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Zap className="w-5 h-5 text-yellow-500" />
                  Live Insights
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {insights.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-4">
                    Upload files or ask questions to generate insights
                  </p>
                ) : (
                  insights.slice(-5).map((insight, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded-lg border ${getInsightColor(insight.type)}`}
                    >
                      <div className="flex items-start gap-2">
                        {getInsightIcon(insight.type)}
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">{insight.title}</h4>
                          <p className="text-xs mt-1 opacity-90">{insight.content}</p>
                          <div className="flex items-center justify-between mt-2">
                            <Progress value={insight.confidence * 100} className="w-16 h-1" />
                            <span className="text-xs font-medium">
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
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => setInputMessage('Optimize route from Ho Chi Minh City to Hanoi')}
                >
                  <Route className="w-4 h-4 mr-2" />
                  Route Optimization
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => setInputMessage('Analyze shipping costs for 40ft container')}
                >
                  <DollarSign className="w-4 h-4 mr-2" />
                  Cost Analysis
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => setInputMessage('Assess risks for monsoon season logistics')}
                >
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Risk Assessment
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Documents
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default SuperAIPage
