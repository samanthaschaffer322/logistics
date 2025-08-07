'use client'

import React, { useState, useRef, useEffect } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import Layout from '@/components/Layout'
import { 
  Send, Bot, User, Zap, Brain, Sparkles, 
  MessageSquare, Settings, Copy, ThumbsUp, 
  ThumbsDown, RotateCcw, Mic, MicOff 
} from 'lucide-react'
import LanguageSwitcher from '@/components/LanguageSwitcher'

interface Message {
  id: string
  type: 'user' | 'ai'
  content: string
  timestamp: Date
  model?: string
  usage?: {
    tokens: number
    cost: number
  }
}

export default function SuperAIPage() {
  const { language } = useLanguage()
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [selectedModel, setSelectedModel] = useState('gpt-4')
  const [isListening, setIsListening] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const models = [
    { id: 'gpt-4', name: 'GPT-4', description: 'Most capable model' },
    { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', description: 'Fast and efficient' },
    { id: 'claude-3', name: 'Claude 3', description: 'Anthropic\'s latest' },
    { id: 'gemini-pro', name: 'Gemini Pro', description: 'Google\'s advanced AI' }
  ]

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    // Add welcome message
    if (messages.length === 0) {
      const welcomeMessage: Message = {
        id: 'welcome',
        type: 'ai',
        content: language === 'vi' 
          ? 'Xin chào! Tôi là Super AI Assistant cho logistics. Tôi có thể giúp bạn với phân tích dữ liệu, tối ưu hóa tuyến đường, dự báo nhu cầu, và nhiều tác vụ logistics khác. Bạn cần hỗ trợ gì?'
          : 'Hello! I\'m your Super AI Assistant for logistics. I can help you with data analysis, route optimization, demand forecasting, and many other logistics tasks. How can I assist you today?',
        timestamp: new Date(),
        model: 'super-ai'
      }
      setMessages([welcomeMessage])
    }
  }, [language])

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

    let aiMessage: Message

    try {
      // Try to call external AI service first
      const response = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputMessage,
          model: selectedModel,
          language: language,
          context: 'logistics'
        }),
      })

      if (response.ok) {
        const data = await response.json()
        aiMessage = {
          id: (Date.now() + 1).toString(),
          type: 'ai',
          content: data.response || generateIntelligentResponse(inputMessage, language),
          timestamp: new Date(),
          model: data.model || selectedModel,
          usage: data.usage
        }
      } else {
        // Fallback to local intelligent response
        aiMessage = {
          id: (Date.now() + 1).toString(),
          type: 'ai',
          content: generateIntelligentResponse(inputMessage, language),
          timestamp: new Date(),
          model: 'local-ai'
        }
      }

      setMessages(prev => [...prev, aiMessage])
    } catch (error) {
      console.error('AI Error:', error)
      
      // Generate intelligent fallback response
      aiMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: generateIntelligentResponse(inputMessage, language),
        timestamp: new Date(),
        model: 'fallback-ai'
      }

      setMessages(prev => [...prev, aiMessage])
    } finally {
      setIsLoading(false)
      setIsTyping(false)
    }
  }

  const generateIntelligentResponse = (input: string, lang: 'vi' | 'en'): string => {
    const lowerInput = input.toLowerCase()
    
    // Logistics-specific responses
    if (lowerInput.includes('route') || lowerInput.includes('tuyến') || lowerInput.includes('đường')) {
      return lang === 'vi' 
        ? 'Tôi có thể giúp bạn tối ưu hóa tuyến đường bằng cách phân tích dữ liệu giao thông, khoảng cách, và chi phí nhiên liệu. Bạn có thể cung cấp điểm xuất phát và điểm đến không?'
        : 'I can help optimize your routes by analyzing traffic data, distances, and fuel costs. Could you provide the starting and destination points?'
    }
    
    if (lowerInput.includes('cost') || lowerInput.includes('chi phí') || lowerInput.includes('giá')) {
      return lang === 'vi'
        ? 'Để phân tích chi phí logistics, tôi cần thông tin về: loại hàng hóa, khoảng cách vận chuyển, phương tiện, và thời gian giao hàng. Điều gì bạn muốn tối ưu hóa?'
        : 'For logistics cost analysis, I need information about: cargo type, shipping distance, transportation mode, and delivery timeline. What would you like to optimize?'
    }
    
    if (lowerInput.includes('inventory') || lowerInput.includes('kho') || lowerInput.includes('tồn kho')) {
      return lang === 'vi'
        ? 'Tôi có thể giúp quản lý tồn kho thông qua dự báo nhu cầu, tối ưu hóa mức tồn kho, và phân tích ABC. Bạn đang gặp vấn đề gì với quản lý kho?'
        : 'I can help with inventory management through demand forecasting, stock level optimization, and ABC analysis. What inventory challenges are you facing?'
    }
    
    if (lowerInput.includes('forecast') || lowerInput.includes('dự báo') || lowerInput.includes('predict')) {
      return lang === 'vi'
        ? 'Tôi có thể tạo dự báo nhu cầu dựa trên dữ liệu lịch sử, xu hướng thị trường, và các yếu tố mùa vụ. Bạn có dữ liệu bán hàng trong quá khứ không?'
        : 'I can create demand forecasts based on historical data, market trends, and seasonal factors. Do you have past sales data available?'
    }
    
    if (lowerInput.includes('track') || lowerInput.includes('theo dõi') || lowerInput.includes('shipment')) {
      return lang === 'vi'
        ? 'Hệ thống theo dõi của chúng tôi có thể cung cấp thông tin real-time về vị trí hàng hóa, thời gian giao hàng dự kiến, và cảnh báo delay. Bạn cần theo dõi lô hàng nào?'
        : 'Our tracking system provides real-time cargo location, estimated delivery times, and delay alerts. Which shipment do you need to track?'
    }
    
    // General helpful responses
    const generalResponses = lang === 'vi' ? [
      'Tôi hiểu câu hỏi của bạn. Trong lĩnh vực logistics, tôi có thể hỗ trợ phân tích dữ liệu, tối ưu hóa quy trình, và đưa ra khuyến nghị cụ thể. Bạn có thể chia sẻ thêm chi tiết không?',
      'Đây là một câu hỏi thú vị về logistics. Tôi có thể giúp bạn phân tích vấn đề này từ nhiều góc độ khác nhau. Bạn muốn tập trung vào khía cạnh nào?',
      'Dựa trên kinh nghiệm trong logistics, tôi nghĩ chúng ta nên xem xét các yếu tố như chi phí, thời gian, và chất lượng dịch vụ. Bạn ưu tiên yếu tố nào nhất?'
    ] : [
      'I understand your question. In logistics, I can help with data analysis, process optimization, and specific recommendations. Could you share more details?',
      'That\'s an interesting logistics question. I can help analyze this from multiple perspectives. Which aspect would you like to focus on?',
      'Based on logistics experience, I think we should consider factors like cost, time, and service quality. Which factor is your top priority?'
    ]
    
    return generalResponses[Math.floor(Math.random() * generalResponses.length)]
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

  const regenerateResponse = (messageId: string) => {
    const messageIndex = messages.findIndex(m => m.id === messageId)
    if (messageIndex > 0) {
      const userMessage = messages[messageIndex - 1]
      if (userMessage.type === 'user') {
        setInputMessage(userMessage.content)
        sendMessage()
      }
    }
  }

  return (
    <Layout>
      <div className="max-w-6xl mx-auto h-[calc(100vh-120px)] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold gradient-text flex items-center gap-3">
              <Bot className="w-8 h-8 text-indigo-400" />
              {language === 'vi' ? 'Super AI Assistant' : 'Super AI Assistant'}
            </h1>
            <p className="text-slate-400 mt-1">
              {language === 'vi' 
                ? 'AI thông minh cho logistics với khả năng phân tích và tối ưu hóa'
                : 'Intelligent AI for logistics with analysis and optimization capabilities'
              }
            </p>
          </div>
          <div className="flex items-center gap-4">
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="dark-input px-3 py-2 rounded-lg text-sm"
            >
              {models.map(model => (
                <option key={model.id} value={model.id}>
                  {model.name}
                </option>
              ))}
            </select>
            <LanguageSwitcher />
          </div>
        </div>

        {/* Chat Container */}
        <div className="flex-1 dark-card flex flex-col">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-4 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.type === 'ai' && (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                )}
                
                <div className={`max-w-3xl ${message.type === 'user' ? 'order-1' : ''}`}>
                  <div
                    className={`rounded-2xl px-4 py-3 ${
                      message.type === 'user'
                        ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white'
                        : 'bg-slate-800 text-slate-100'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{message.content}</p>
                  </div>
                  
                  <div className="flex items-center gap-2 mt-2 text-xs text-slate-500">
                    <span>{message.timestamp.toLocaleTimeString()}</span>
                    {message.model && (
                      <span className="px-2 py-1 bg-slate-700 rounded text-slate-300">
                        {message.model}
                      </span>
                    )}
                    {message.type === 'ai' && (
                      <div className="flex items-center gap-1 ml-auto">
                        <button
                          onClick={() => copyMessage(message.content)}
                          className="p-1 hover:bg-slate-700 rounded"
                          title="Copy"
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => regenerateResponse(message.id)}
                          className="p-1 hover:bg-slate-700 rounded"
                          title="Regenerate"
                        >
                          <RotateCcw className="w-3 h-3" />
                        </button>
                        <button className="p-1 hover:bg-slate-700 rounded" title="Like">
                          <ThumbsUp className="w-3 h-3" />
                        </button>
                        <button className="p-1 hover:bg-slate-700 rounded" title="Dislike">
                          <ThumbsDown className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {message.type === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 text-slate-300" />
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-4 justify-start">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="bg-slate-800 rounded-2xl px-4 py-3">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-slate-700 p-4">
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <textarea
                  ref={inputRef}
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={language === 'vi' ? 'Nhập câu hỏi về logistics...' : 'Ask about logistics...'}
                  className="dark-input w-full px-4 py-3 pr-12 rounded-xl resize-none"
                  rows={1}
                  style={{ minHeight: '48px', maxHeight: '120px' }}
                />
                <button
                  onClick={() => setIsListening(!isListening)}
                  className={`absolute right-3 top-3 p-1 rounded ${
                    isListening ? 'text-red-400' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </button>
              </div>
              <button
                onClick={sendMessage}
                disabled={isLoading || !inputMessage.trim()}
                className="gradient-button px-6 py-3 rounded-xl flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
                {language === 'vi' ? 'Gửi' : 'Send'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
