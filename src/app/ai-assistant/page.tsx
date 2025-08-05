'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
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
  Package,
  Truck,
  Shield
} from 'lucide-react'
import { useTranslation } from '@/lib/i18n/useTranslation'
import { useAuth } from '@/contexts/AuthContext'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface QuickPrompt {
  id: string
  title: string
  titleVi: string
  prompt: string
  icon: React.ReactNode
  category: string
}

const quickPrompts: QuickPrompt[] = [
  {
    id: 'inventory-optimization',
    title: 'Optimize Inventory Levels',
    titleVi: 'Tối ưu hóa Mức tồn kho',
    prompt: 'How can I optimize my inventory levels to reduce carrying costs while maintaining service levels?',
    icon: <Package className="h-4 w-4" />,
    category: 'inventory'
  },
  {
    id: 'route-planning',
    title: 'Route Planning Strategy',
    titleVi: 'Chiến lược Lập kế hoạch Tuyến đường',
    prompt: 'What are the best practices for route planning and optimization in Vietnam logistics?',
    icon: <Truck className="h-4 w-4" />,
    category: 'transportation'
  },
  {
    id: 'cost-reduction',
    title: 'Cost Reduction Ideas',
    titleVi: 'Ý tưởng Giảm Chi phí',
    prompt: 'Suggest cost reduction strategies for my logistics operations without compromising quality.',
    icon: <TrendingUp className="h-4 w-4" />,
    category: 'optimization'
  },
  {
    id: 'demand-forecasting',
    title: 'Demand Forecasting',
    titleVi: 'Dự báo Nhu cầu',
    prompt: 'How can I improve demand forecasting accuracy for better inventory planning?',
    icon: <Brain className="h-4 w-4" />,
    category: 'planning'
  }
]

export default function AIAssistantPage() {
  const { user } = useAuth()
  const { t, locale } = useTranslation()
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: locale === 'vi' 
        ? 'Xin chào! Tôi là LogiAI, trợ lý AI chuyên về chuỗi cung ứng và logistics. Tôi có thể giúp bạn tối ưu hóa hoạt động, giảm chi phí và cải thiện hiệu quả. Bạn cần hỗ trợ gì hôm nay?'
        : 'Hello! I\'m LogiAI, your AI Supply Chain Assistant. I can help you optimize operations, reduce costs, and improve efficiency. What can I help you with today?',
      timestamp: new Date()
    }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: content.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsLoading(true)

    try {
      // Get session token for authentication
      const sessionToken = localStorage.getItem('logiai_session_token')
      
      const response = await fetch('/api/ai-assistant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionToken}`,
        },
        body: JSON.stringify({
          message: content,
          history: messages.slice(-5), // Send last 5 messages for context
          locale: locale
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to get AI response')
      }

      const data = await response.json()
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response || (locale === 'vi' 
          ? 'Xin lỗi, tôi không thể xử lý yêu cầu của bạn lúc này. Vui lòng thử lại sau.'
          : 'Sorry, I couldn\'t process your request right now. Please try again later.'),
        timestamp: new Date()
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('AI Assistant error:', error)
      
      // Fallback response with logistics expertise
      const fallbackResponse = generateFallbackResponse(content, locale)
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: fallbackResponse,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, assistantMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    sendMessage(inputMessage)
  }

  const handleQuickPrompt = (prompt: string) => {
    sendMessage(prompt)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  const clearChat = () => {
    setMessages([
      {
        id: '1',
        role: 'assistant',
        content: locale === 'vi' 
          ? 'Xin chào! Tôi là LogiAI, trợ lý AI chuyên về chuỗi cung ứng và logistics. Tôi có thể giúp bạn tối ưu hóa hoạt động, giảm chi phí và cải thiện hiệu quả. Bạn cần hỗ trợ gì hôm nay?'
          : 'Hello! I\'m LogiAI, your AI Supply Chain Assistant. I can help you optimize operations, reduce costs, and improve efficiency. What can I help you with today?',
        timestamp: new Date()
      }
    ])
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <Brain className="mr-3 h-8 w-8 text-purple-600" />
              {locale === 'vi' ? 'Trợ lý AI LogiAI' : 'LogiAI Assistant'}
            </h1>
            <p className="text-gray-600 mt-2">
              {locale === 'vi' 
                ? 'Nhận tư vấn chuyên môn về logistics và tối ưu hóa chuỗi cung ứng'
                : 'Get expert advice on logistics and supply chain optimization'
              }
            </p>
            <div className="flex items-center mt-2 text-sm text-gray-500">
              <Shield className="h-4 w-4 mr-1" />
              <span>
                {locale === 'vi' 
                  ? 'Được bảo vệ bởi bảo mật cấp doanh nghiệp'
                  : 'Protected by enterprise-grade security'
                }
              </span>
            </div>
          </div>
          <button
            onClick={clearChat}
            className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            {locale === 'vi' ? 'Xóa cuộc trò chuyện' : 'Clear Chat'}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Quick Prompts */}
          <div className="lg:col-span-1">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Lightbulb className="mr-2 h-5 w-5" />
                  {locale === 'vi' ? 'Gợi ý nhanh' : 'Quick Prompts'}
                </CardTitle>
                <CardDescription>
                  {locale === 'vi' 
                    ? 'Nhấp để bắt đầu cuộc trò chuyện'
                    : 'Click to start a conversation'
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {quickPrompts.map((prompt) => (
                    <button
                      key={prompt.id}
                      onClick={() => handleQuickPrompt(prompt.prompt)}
                      disabled={isLoading}
                      className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed group"
                    >
                      <div className="flex items-start">
                        <div className="text-purple-600 mr-3 mt-0.5 group-hover:scale-110 transition-transform">
                          {prompt.icon}
                        </div>
                        <div>
                          <p className="font-medium text-sm text-gray-900">
                            {locale === 'vi' ? prompt.titleVi : prompt.title}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Chat Interface */}
          <div className="lg:col-span-3">
            <Card className="h-[700px] flex flex-col hover:shadow-lg transition-shadow">
              <CardHeader className="flex-shrink-0">
                <CardTitle className="flex items-center">
                  <MessageSquare className="mr-2 h-5 w-5" />
                  {locale === 'vi' ? 'Cuộc trò chuyện' : 'Conversation'}
                </CardTitle>
                <CardDescription>
                  {locale === 'vi' 
                    ? `Đang trò chuyện với ${user?.name || 'User'}`
                    : `Chatting with ${user?.name || 'User'}`
                  }
                </CardDescription>
              </CardHeader>
              
              {/* Messages */}
              <CardContent className="flex-1 flex flex-col p-0">
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg p-4 ${
                          message.role === 'user'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        <div className="flex items-start space-x-2">
                          <div className="flex-shrink-0">
                            {message.role === 'user' ? (
                              <User className="h-4 w-4 mt-0.5" />
                            ) : (
                              <Bot className="h-4 w-4 mt-0.5" />
                            )}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                            <p className={`text-xs mt-2 ${
                              message.role === 'user' ? 'text-blue-100' : 'text-gray-500'
                            }`}>
                              {message.timestamp.toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-gray-100 rounded-lg p-4">
                        <div className="flex items-center space-x-2">
                          <Bot className="h-4 w-4" />
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span className="text-sm text-gray-600">
                            {locale === 'vi' ? 'LogiAI đang suy nghĩ...' : 'LogiAI is thinking...'}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>

                {/* Input Form */}
                <div className="border-t border-gray-200 p-4">
                  <form onSubmit={handleSubmit} className="flex space-x-2">
                    <div className="flex-1">
                      <textarea
                        ref={inputRef}
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder={locale === 'vi' 
                          ? 'Hỏi LogiAI về logistics, chuỗi cung ứng, tối ưu hóa...'
                          : 'Ask LogiAI about logistics, supply chain, optimization...'
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                        rows={2}
                        disabled={isLoading}
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={!inputMessage.trim() || isLoading}
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center transition-colors"
                    >
                      {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Send className="h-4 w-4" />
                      )}
                    </button>
                  </form>
                  <p className="text-xs text-gray-500 mt-2">
                    {locale === 'vi' 
                      ? 'Nhấn Enter để gửi, Shift+Enter để xuống dòng'
                      : 'Press Enter to send, Shift+Enter for new line'
                    }
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

// Fallback response generator for when API is not available
function generateFallbackResponse(userMessage: string, locale: string): string {
  const message = userMessage.toLowerCase()
  
  // Inventory related
  if (message.includes('inventory') || message.includes('stock') || message.includes('tồn kho')) {
    return locale === 'vi' 
      ? `Về quản lý tồn kho, tôi khuyên bạn nên:\n\n1. Sử dụng phương pháp ABC để phân loại hàng hóa\n2. Áp dụng mô hình EOQ (Economic Order Quantity)\n3. Thiết lập điểm đặt hàng lại tự động\n4. Theo dõi tỷ lệ quay vòng hàng tồn kho\n5. Sử dụng dự báo nhu cầu để tối ưu hóa mức tồn kho\n\nBạn có muốn tôi giải thích chi tiết về bất kỳ điểm nào không?`
      : `For inventory management, I recommend:\n\n1. Use ABC analysis to categorize items\n2. Apply EOQ (Economic Order Quantity) model\n3. Set up automatic reorder points\n4. Monitor inventory turnover ratios\n5. Use demand forecasting to optimize stock levels\n\nWould you like me to explain any of these points in detail?`
  }
  
  // Route optimization
  if (message.includes('route') || message.includes('transport') || message.includes('tuyến đường')) {
    return locale === 'vi'
      ? `Để tối ưu hóa tuyến đường vận chuyển:\n\n1. Sử dụng thuật toán tối ưu hóa tuyến đường (VRP)\n2. Xem xét consolidation để giảm chi phí\n3. Tránh giờ cao điểm và kẹt xe\n4. Sử dụng GPS và traffic data real-time\n5. Lập kế hoạch bảo trì xe định kỳ\n6. Tối ưu hóa tải trọng và dung tích\n\nViệt Nam có nhiều thách thức về giao thông, bạn cần lưu ý gì đặc biệt?`
      : `For route optimization:\n\n1. Use Vehicle Routing Problem (VRP) algorithms\n2. Consider consolidation to reduce costs\n3. Avoid rush hours and traffic congestion\n4. Use real-time GPS and traffic data\n5. Plan regular vehicle maintenance\n6. Optimize load capacity and weight\n\nWhat specific challenges are you facing with your routes?`
  }
  
  // Cost reduction
  if (message.includes('cost') || message.includes('reduce') || message.includes('chi phí')) {
    return locale === 'vi'
      ? `Chiến lược giảm chi phí logistics:\n\n1. Tối ưu hóa mạng lưới phân phối\n2. Đàm phán hợp đồng dài hạn với nhà cung cấp\n3. Sử dụng công nghệ tự động hóa\n4. Cải thiện dự báo nhu cầu\n5. Tối ưu hóa packaging và loading\n6. Xem xét outsourcing cho các hoạt động không cốt lõi\n\nBạn muốn tập trung vào lĩnh vực nào trước?`
      : `Cost reduction strategies for logistics:\n\n1. Optimize distribution network\n2. Negotiate long-term supplier contracts\n3. Implement automation technologies\n4. Improve demand forecasting\n5. Optimize packaging and loading\n6. Consider outsourcing non-core activities\n\nWhich area would you like to focus on first?`
  }
  
  // Default response
  return locale === 'vi'
    ? `Cảm ơn bạn đã hỏi về "${userMessage}". Tôi hiểu bạn quan tâm đến vấn đề này trong logistics.\n\nMột số nguyên tắc chung tôi khuyên bạn nên áp dụng:\n\n1. Luôn dựa trên dữ liệu để ra quyết định\n2. Tối ưu hóa từng khâu trong chuỗi cung ứng\n3. Đầu tư vào công nghệ và tự động hóa\n4. Xây dựng mối quan hệ tốt với đối tác\n5. Liên tục theo dõi và cải thiện KPI\n\nBạn có thể chia sẻ thêm chi tiết về tình huống cụ thể để tôi tư vấn chính xác hơn không?`
    : `Thank you for asking about "${userMessage}". I understand this is an important logistics concern.\n\nHere are some general principles I recommend:\n\n1. Always base decisions on data\n2. Optimize each link in the supply chain\n3. Invest in technology and automation\n4. Build strong partnerships\n5. Continuously monitor and improve KPIs\n\nCould you share more specific details about your situation so I can provide more targeted advice?`
}
