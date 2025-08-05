'use client'

import React, { useState, useRef, useEffect, useCallback } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import Navigation from '@/components/Navigation'
import { 
  Brain, 
  Send, 
  User, 
  Bot, 
  Loader2, 
  RefreshCw, 
  MessageSquare,
  Lightbulb,
  TrendingUp,
  FileText,
  Image,
  Upload,
  Zap,
  Target,
  BarChart3,
  Settings,
  Sparkles,
  Cpu,
  Globe,
  Clock,
  DollarSign,
  CheckCircle,
  AlertTriangle,
  Info
} from 'lucide-react'

interface ChatMessage {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: Date
  model?: string
  reasoning?: string
  suggestions?: string[]
  actions?: any[]
  attachments?: any[]
  cost?: number
}

interface AIModel {
  id: string
  name: string
  provider: string
  capabilities: string[]
  maxTokens: number
  costPer1kTokens: number
  icon: React.ReactNode
}

export default function EnhancedAIPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Xin chào! Tôi là LogiAI Enhanced - trợ lý AI thông minh cho logistics Việt Nam. Tôi có thể giúp bạn:\n\n🚚 Tối ưu hóa tuyến đường và chi phí vận chuyển\n📊 Phân tích dữ liệu và tạo báo cáo chi tiết\n🗺️ Lập kế hoạch logistics cho toàn quốc\n📋 Xử lý tài liệu và hình ảnh logistics\n⚡ Đưa ra khuyến nghị thông minh theo thời gian thực\n\nHãy cho tôi biết bạn cần hỗ trợ gì!',
      timestamp: new Date(),
      model: 'gpt-4o-mini',
      suggestions: [
        'Tối ưu tuyến đường Hà Nội - TP.HCM',
        'Phân tích chi phí container 40ft',
        'Tạo báo cáo hiệu suất logistics',
        'Kiểm tra tình trạng giao thông'
      ]
    }
  ])
  
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [selectedModel, setSelectedModel] = useState('gpt-4o-mini')
  const [attachments, setAttachments] = useState<File[]>([])
  const [totalCost, setTotalCost] = useState(0)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const models: AIModel[] = [
    {
      id: 'gpt-4o',
      name: 'GPT-4 Omni',
      provider: 'OpenAI',
      capabilities: ['text', 'vision', 'code', 'analysis'],
      maxTokens: 128000,
      costPer1kTokens: 0.03,
      icon: <Sparkles className="w-4 h-4" />
    },
    {
      id: 'gpt-4o-mini',
      name: 'GPT-4 Omni Mini',
      provider: 'OpenAI',
      capabilities: ['text', 'vision', 'code', 'analysis'],
      maxTokens: 128000,
      costPer1kTokens: 0.0015,
      icon: <Zap className="w-4 h-4" />
    },
    {
      id: 'gpt-3.5-turbo',
      name: 'GPT-3.5 Turbo',
      provider: 'OpenAI',
      capabilities: ['text', 'code'],
      maxTokens: 16385,
      costPer1kTokens: 0.001,
      icon: <Cpu className="w-4 h-4" />
    }
  ]

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async () => {
    if (!inputMessage.trim() && attachments.length === 0) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage,
      timestamp: new Date(),
      attachments: attachments.map(file => ({
        name: file.name,
        type: file.type,
        size: file.size
      }))
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setAttachments([])
    setIsLoading(true)

    try {
      const response = await fetch('/api/enhanced-ai-assistant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputMessage,
          model: selectedModel,
          attachments: attachments.map(file => ({
            name: file.name,
            type: file.type,
            size: file.size
          })),
          chatHistory: messages.slice(-5)
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to get AI response')
      }

      const data = await response.json()
      
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response,
        timestamp: new Date(),
        model: selectedModel,
        reasoning: data.reasoning,
        suggestions: data.suggestions,
        actions: data.actions,
        cost: data.cost
      }

      setMessages(prev => [...prev, assistantMessage])
      setTotalCost(prev => prev + (data.cost || 0))

    } catch (error) {
      console.error('Error sending message:', error)
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Xin lỗi, tôi gặp lỗi khi xử lý yêu cầu của bạn. Vui lòng thử lại.',
        timestamp: new Date(),
        model: selectedModel
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setAttachments(prev => [...prev, ...files])
  }

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index))
  }

  const handleSuggestionClick = (suggestion: string) => {
    setInputMessage(suggestion)
  }

  const selectedModelInfo = models.find(m => m.id === selectedModel)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              LogiAI Enhanced
            </h1>
            <Badge variant="secondary" className="bg-gradient-to-r from-green-500 to-blue-500 text-white">
              <Sparkles className="w-3 h-3 mr-1" />
              Multi-Model AI
            </Badge>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Trợ lý AI thông minh với khả năng đa mô hình, xử lý hình ảnh, phân tích tài liệu và tối ưu hóa logistics Việt Nam
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* AI Model Selector & Stats */}
          <div className="lg:col-span-1 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  AI Model
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Select value={selectedModel} onValueChange={setSelectedModel}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {models.map((model) => (
                      <SelectItem key={model.id} value={model.id}>
                        <div className="flex items-center gap-2">
                          {model.icon}
                          <div>
                            <div className="font-medium">{model.name}</div>
                            <div className="text-xs text-gray-500">{model.provider}</div>
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                {selectedModelInfo && (
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Globe className="w-4 h-4" />
                      <span>Max: {selectedModelInfo.maxTokens.toLocaleString()} tokens</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <DollarSign className="w-4 h-4" />
                      <span>${selectedModelInfo.costPer1kTokens}/1K tokens</span>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {selectedModelInfo.capabilities.map((cap) => (
                        <Badge key={cap} variant="outline" className="text-xs">
                          {cap}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Session Stats
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Messages</span>
                    <span className="font-medium">{messages.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Total Cost</span>
                    <span className="font-medium">${totalCost.toFixed(4)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Model</span>
                    <Badge variant="outline">{selectedModelInfo?.name}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full justify-start"
                    onClick={() => handleSuggestionClick('Tối ưu tuyến đường Hà Nội - TP.HCM cho container 40ft')}
                  >
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Route Optimization
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full justify-start"
                    onClick={() => handleSuggestionClick('Phân tích chi phí logistics và đưa ra khuyến nghị')}
                  >
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Cost Analysis
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full justify-start"
                    onClick={() => handleSuggestionClick('Tạo báo cáo hiệu suất logistics tháng này')}
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Generate Report
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Chat Interface */}
          <div className="lg:col-span-3">
            <Card className="h-[700px] flex flex-col">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5" />
                    Enhanced AI Chat
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    {isLoading && (
                      <div className="flex items-center gap-2 text-blue-600">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span className="text-sm">Processing...</span>
                      </div>
                    )}
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Real-time
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="flex-1 flex flex-col">
                {/* Messages */}
                <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                  {messages.map((message) => (
                    <div key={message.id} className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`flex gap-3 max-w-[80%] ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          message.role === 'user' 
                            ? 'bg-blue-500 text-white' 
                            : 'bg-gradient-to-r from-purple-500 to-blue-500 text-white'
                        }`}>
                          {message.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                        </div>
                        
                        <div className={`rounded-lg p-4 ${
                          message.role === 'user' 
                            ? 'bg-blue-500 text-white' 
                            : 'bg-gray-50 border'
                        }`}>
                          <div className="whitespace-pre-wrap">{message.content}</div>
                          
                          {message.attachments && message.attachments.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-2">
                              {message.attachments.map((attachment, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  <FileText className="w-3 h-3 mr-1" />
                                  {attachment.name}
                                </Badge>
                              ))}
                            </div>
                          )}
                          
                          {message.suggestions && message.suggestions.length > 0 && (
                            <div className="mt-3 space-y-2">
                              <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
                                <Lightbulb className="w-4 h-4" />
                                Suggestions:
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {message.suggestions.map((suggestion, index) => (
                                  <Button
                                    key={index}
                                    variant="outline"
                                    size="sm"
                                    className="text-xs"
                                    onClick={() => handleSuggestionClick(suggestion)}
                                  >
                                    {suggestion}
                                  </Button>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          {message.actions && message.actions.length > 0 && (
                            <div className="mt-3 space-y-2">
                              <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
                                <Zap className="w-4 h-4" />
                                Actions:
                              </div>
                              <div className="space-y-1">
                                {message.actions.map((action, index) => (
                                  <div key={index} className="flex items-center gap-2 p-2 bg-white rounded border">
                                    {action.priority === 'high' && <AlertTriangle className="w-4 h-4 text-red-500" />}
                                    {action.priority === 'medium' && <Info className="w-4 h-4 text-yellow-500" />}
                                    {action.priority === 'low' && <CheckCircle className="w-4 h-4 text-green-500" />}
                                    <div>
                                      <div className="font-medium text-sm">{action.title}</div>
                                      <div className="text-xs text-gray-500">{action.description}</div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                            <span>{message.timestamp.toLocaleTimeString()}</span>
                            <div className="flex items-center gap-2">
                              {message.model && <Badge variant="outline" className="text-xs">{message.model}</Badge>}
                              {message.cost && <span>${message.cost.toFixed(4)}</span>}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                {/* Attachments Preview */}
                {attachments.length > 0 && (
                  <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Upload className="w-4 h-4" />
                      <span className="text-sm font-medium">Attachments ({attachments.length})</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {attachments.map((file, index) => (
                        <div key={index} className="flex items-center gap-2 bg-white p-2 rounded border">
                          {file.type.startsWith('image/') ? (
                            <Image className="w-4 h-4" />
                          ) : (
                            <FileText className="w-4 h-4" />
                          )}
                          <span className="text-sm">{file.name}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeAttachment(index)}
                            className="h-6 w-6 p-0"
                          >
                            ×
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Input Area */}
                <div className="flex gap-2">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    multiple
                    accept="image/*,.pdf,.xlsx,.xls,.csv,.txt"
                    className="hidden"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    className="shrink-0"
                  >
                    <Upload className="w-4 h-4" />
                  </Button>
                  <Input
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Nhập tin nhắn của bạn... (hỗ trợ tiếng Việt)"
                    disabled={isLoading}
                    className="flex-1"
                  />
                  <Button 
                    onClick={handleSendMessage} 
                    disabled={isLoading || (!inputMessage.trim() && attachments.length === 0)}
                    className="shrink-0"
                  >
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
