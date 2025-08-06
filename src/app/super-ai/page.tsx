'use client'

import React, { useState, useRef, useCallback, useEffect } from 'react'
import Layout from '@/components/Layout'
import { 
  Brain, 
  Send, 
  User, 
  Upload, 
  FileText, 
  Zap, 
  Navigation,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  Loader2,
  X,
  Copy,
  RefreshCw,
  MessageSquare,
  Sparkles
} from 'lucide-react'

interface Message {
  id: string
  type: 'user' | 'ai'
  content: string
  timestamp: Date
  model?: string
  usage?: any
}

const SuperAIPage = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: '🚀 **Super AI Assistant Ready!** Tôi là hệ thống AI toàn diện cho logistics Việt Nam với tích hợp OpenAI.\n\n**Tính năng nâng cao:**\n• **Multi-model AI** - GPT-4 Omni, GPT-4 Mini, GPT-3.5 Turbo\n• **Vietnamese Expertise** - Chuyên môn logistics Việt Nam\n• **Interactive Interface** - Giao diện tương tác hoàn chỉnh\n• **Real-time Responses** - Phản hồi thời gian thực\n• **Cost Analysis** - Phân tích chi phí đa biến\n• **Route Optimization** - Tối ưu tuyến đường thông minh\n\n**OpenAI Integration:**\n• **Real AI Responses** - Kết nối trực tiếp với OpenAI API\n• **Context Awareness** - Nhớ lịch sử hội thoại\n• **Vietnamese Context** - Hiểu biết sâu về thị trường Việt Nam\n• **Interactive Features** - Giao diện tương tác hoàn chỉnh\n\nHôm nay tôi có thể giúp gì cho bạn?',
      timestamp: new Date(),
      model: 'super-ai-v2'
    }
  ])
  
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [selectedModel, setSelectedModel] = useState('gpt-4o-mini')
  const [isTyping, setIsTyping] = useState(false)
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

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
          chatHistory: messages.slice(-10)
        })
      })

      const data = await response.json()
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: data.response || 'Xin lỗi, tôi gặp sự cố khi xử lý yêu cầu của bạn. Vui lòng thử lại.',
        timestamp: new Date(),
        model: data.model,
        usage: data.usage
      }

      setMessages(prev => [...prev, aiMessage])

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

  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content)
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
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                OpenAI Integrated
              </span>
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
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Chat Interface */}
          <div className="lg:col-span-3">
            <div className="dark-card h-[700px] flex flex-col">
              <div className="border-b border-slate-700/50 p-4">
                <h2 className="flex items-center gap-2 text-white text-lg font-semibold">
                  <MessageSquare className="w-5 h-5 text-indigo-400" />
                  AI Conversation
                  {isTyping && (
                    <div className="flex items-center gap-1 text-indigo-400">
                      <div className="w-1 h-1 bg-indigo-400 rounded-full animate-pulse"></div>
                      <div className="w-1 h-1 bg-indigo-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-1 h-1 bg-indigo-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  )}
                </h2>
                <p className="text-slate-400 text-sm">
                  Real OpenAI integration with Vietnamese logistics expertise - fully interactive
                </p>
              </div>
              
              <div className="flex-1 flex flex-col">
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
                            {message.usage && (
                              <div className="mt-2 text-xs text-slate-400 flex items-center gap-2">
                                <span>Model: {message.model}</span>
                                <span>•</span>
                                <span>Tokens: {message.usage.total_tokens}</span>
                                <span>•</span>
                                <span className="text-green-400">OpenAI ✓</span>
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

                {/* Input Area */}
                <div className="border-t border-slate-700/50 p-4">
                  <div className="flex gap-2">
                    <div className="flex-1 flex gap-2">
                      <input
                        ref={inputRef}
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Ask about Vietnamese logistics, routes, costs, or optimization..."
                        className="dark-input flex-1 px-4 py-3 rounded-xl"
                        disabled={isLoading}
                      />
                      <button
                        onClick={sendMessage}
                        disabled={isLoading || !inputMessage.trim()}
                        className="gradient-button px-6 py-3 rounded-xl"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions Panel */}
          <div className="space-y-4">
            <div className="dark-card p-4">
              <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <button
                  className="dark-button w-full justify-start p-3 rounded-xl text-left"
                  onClick={() => setInputMessage('Tối ưu tuyến đường từ TP.HCM đến Hà Nội')}
                >
                  <Navigation className="w-4 h-4 mr-2" />
                  Route Optimization
                </button>
                <button
                  className="dark-button w-full justify-start p-3 rounded-xl text-left"
                  onClick={() => setInputMessage('Phân tích chi phí vận chuyển container 40ft')}
                >
                  <DollarSign className="w-4 h-4 mr-2" />
                  Cost Analysis
                </button>
                <button
                  className="dark-button w-full justify-start p-3 rounded-xl text-left"
                  onClick={() => setInputMessage('Đánh giá rủi ro logistics mùa mưa bão')}
                >
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Risk Assessment
                </button>
              </div>
            </div>

            {/* Session Stats */}
            <div className="dark-card p-4">
              <h3 className="text-lg font-semibold text-white mb-4">Session Stats</h3>
              <div className="space-y-3">
                <div className="text-center p-3 bg-indigo-500/10 rounded-xl border border-indigo-500/20">
                  <div className="text-2xl font-bold text-indigo-400">
                    {messages.filter(m => m.type === 'ai').length}
                  </div>
                  <div className="text-sm text-indigo-300">AI Responses</div>
                </div>
                
                <div className="text-center p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                  <div className="text-2xl font-bold text-emerald-400">
                    {messages.filter(m => m.usage?.openai_integration).length}
                  </div>
                  <div className="text-sm text-emerald-300">OpenAI Calls</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default SuperAIPage
