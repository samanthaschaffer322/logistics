'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { MessageSquare, Send, Bot, User, Zap, Brain, TrendingUp, AlertTriangle } from 'lucide-react'
import { supplyChainAI, type ChatMessage } from '@/lib/ai/openai-integration'

interface Message extends ChatMessage {
  id: string
  isUser: boolean
}

const quickPrompts = [
  {
    icon: TrendingUp,
    title: "Demand Forecasting",
    prompt: "How can I improve my demand forecasting accuracy for seasonal products?"
  },
  {
    icon: Brain,
    title: "Inventory Optimization",
    prompt: "What's the best approach to optimize inventory levels while minimizing carrying costs?"
  },
  {
    icon: AlertTriangle,
    title: "Supply Chain Risk",
    prompt: "How can I identify and mitigate supply chain risks in my operations?"
  },
  {
    icon: Zap,
    title: "Route Optimization",
    prompt: "What strategies can I use to optimize delivery routes and reduce transportation costs?"
  }
]

export default function AIAssistantPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hello! I'm your AI Supply Chain Assistant. I specialize in logistics optimization, inventory management, demand forecasting, and supply chain strategy. How can I help you optimize your operations today?",
      isUser: false,
      timestamp: new Date().toISOString()
    }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async (message?: string) => {
    const messageToSend = message || inputMessage.trim()
    if (!messageToSend || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: messageToSend,
      isUser: true,
      timestamp: new Date().toISOString()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsLoading(true)

    try {
      const response = await supplyChainAI.chat(messageToSend)
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        isUser: false,
        timestamp: new Date().toISOString()
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('Error sending message:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I apologize, but I'm having trouble processing your request right now. Please try again or ask about inventory management, transportation optimization, demand forecasting, or other supply chain topics.",
        isUser: false,
        timestamp: new Date().toISOString()
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

  const handleQuickPrompt = (prompt: string) => {
    handleSendMessage(prompt)
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center">
          <MessageSquare className="mr-3 h-8 w-8 text-blue-600" />
          AI Supply Chain Assistant
        </h1>
        <p className="text-gray-600 mt-2">
          Get expert advice on logistics optimization, inventory management, and supply chain strategy
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Quick Prompts Sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Topics</CardTitle>
              <CardDescription>
                Click on any topic to get started
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {quickPrompts.map((prompt, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickPrompt(prompt.prompt)}
                    className="w-full p-3 text-left bg-gray-50 hover:bg-blue-50 rounded-lg transition-colors group"
                    disabled={isLoading}
                  >
                    <div className="flex items-start">
                      <prompt.icon className="h-5 w-5 text-blue-600 mt-0.5 mr-3 group-hover:text-blue-700" />
                      <div>
                        <p className="font-medium text-gray-900 text-sm group-hover:text-blue-900">
                          {prompt.title}
                        </p>
                        <p className="text-xs text-gray-500 mt-1 group-hover:text-blue-600">
                          {prompt.prompt.substring(0, 60)}...
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* AI Capabilities */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Brain className="mr-2 h-5 w-5" />
                AI Capabilities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3"></div>
                  <div>
                    <p className="font-medium text-gray-900">Demand Forecasting</p>
                    <p className="text-gray-600">AI-powered predictions</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3"></div>
                  <div>
                    <p className="font-medium text-gray-900">Inventory Optimization</p>
                    <p className="text-gray-600">Smart stock management</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3"></div>
                  <div>
                    <p className="font-medium text-gray-900">Route Planning</p>
                    <p className="text-gray-600">Efficient delivery routes</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3"></div>
                  <div>
                    <p className="font-medium text-gray-900">Risk Analysis</p>
                    <p className="text-gray-600">Supply chain risk assessment</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Chat Interface */}
        <div className="lg:col-span-3">
          <Card className="h-[700px] flex flex-col">
            <CardHeader className="border-b">
              <CardTitle className="flex items-center">
                <Bot className="mr-2 h-5 w-5 text-blue-600" />
                Chat with AI Assistant
              </CardTitle>
              <CardDescription>
                Ask me anything about supply chain optimization and logistics management
              </CardDescription>
            </CardHeader>

            {/* Messages */}
            <CardContent className="flex-1 overflow-y-auto p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-4 ${
                        message.isUser
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <div className="flex items-start">
                        {!message.isUser && (
                          <Bot className="h-5 w-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                        )}
                        {message.isUser && (
                          <User className="h-5 w-5 text-white mr-2 mt-0.5 flex-shrink-0" />
                        )}
                        <div className="flex-1">
                          <p className="whitespace-pre-wrap">{message.content}</p>
                          <p className={`text-xs mt-2 ${
                            message.isUser ? 'text-blue-100' : 'text-gray-500'
                          }`}>
                            {new Date(message.timestamp || '').toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 rounded-lg p-4 max-w-[80%]">
                      <div className="flex items-center">
                        <Bot className="h-5 w-5 text-blue-600 mr-2" />
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </CardContent>

            {/* Input */}
            <div className="border-t p-4">
              <div className="flex space-x-2">
                <textarea
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me about inventory optimization, demand forecasting, route planning, or any supply chain topic..."
                  className="flex-1 resize-none border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={2}
                  disabled={isLoading}
                />
                <button
                  onClick={() => handleSendMessage()}
                  disabled={!inputMessage.trim() || isLoading}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Press Enter to send, Shift+Enter for new line
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
