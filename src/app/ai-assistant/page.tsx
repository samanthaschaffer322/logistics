'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { Brain, Send, User, Bot } from 'lucide-react'

interface Message {
  id: string
  type: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export default function AIAssistantPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: 'Hello! I\'m your LogiAI assistant. I can help you with inventory management, route optimization, procurement suggestions, and more. What would you like to know?',
      timestamp: new Date(),
    },
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputMessage.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setLoading(true)

    // Simulate AI response (in real implementation, this would call Ollama API)
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: getAIResponse(inputMessage),
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, aiResponse])
      setLoading(false)
    }, 1000)
  }

  const getAIResponse = (userInput: string): string => {
    const input = userInput.toLowerCase()
    
    if (input.includes('inventory') || input.includes('stock')) {
      return 'I can help you with inventory management! Here are some things I can assist with:\n\n• Check current stock levels\n• Identify low stock items\n• Generate reorder suggestions\n• Analyze inventory trends\n\nWould you like me to check your current inventory status?'
    }
    
    if (input.includes('route') || input.includes('delivery') || input.includes('transport')) {
      return 'For transportation and route optimization, I can:\n\n• Suggest optimal delivery routes\n• Track vehicle locations\n• Schedule driver assignments\n• Predict delivery times\n\nWhat specific transportation challenge can I help you with?'
    }
    
    if (input.includes('procurement') || input.includes('purchase') || input.includes('supplier')) {
      return 'I can assist with procurement decisions:\n\n• Analyze supplier performance\n• Suggest optimal purchase quantities\n• Evaluate Incoterm conditions\n• Generate purchase orders\n\nWhat procurement task would you like help with?'
    }
    
    if (input.includes('upload') || input.includes('file') || input.includes('excel')) {
      return 'I can learn from your uploaded logistics files! Upload your Excel files containing:\n\n• Daily logistics plans\n• Inventory reports\n• Delivery schedules\n• Procurement data\n\nI\'ll analyze the patterns and provide intelligent suggestions based on your data.'
    }
    
    return 'I understand you\'re asking about logistics operations. I can help with:\n\n• **Inventory Management** - Stock tracking, reorder suggestions\n• **Transportation** - Route optimization, fleet management\n• **Distribution** - Order fulfillment, delivery scheduling\n• **Procurement** - Supplier analysis, purchase recommendations\n• **File Learning** - Upload and analyze your logistics data\n\nCould you be more specific about what you need help with?'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center">
          <Brain className="h-6 w-6 mr-2 text-blue-600" />
          AI Assistant
        </h1>
        <p className="text-gray-600">
          Get intelligent insights and recommendations for your logistics operations
        </p>
      </div>

      {/* Chat Interface */}
      <Card className="h-[600px] flex flex-col">
        <CardHeader>
          <CardTitle>LogiAI Chat</CardTitle>
          <CardDescription>
            Ask questions about inventory, transportation, procurement, and more
          </CardDescription>
        </CardHeader>
        
        <CardContent className="flex-1 flex flex-col">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto space-y-4 mb-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.type === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <div className="flex items-start space-x-2">
                    {message.type === 'assistant' && (
                      <Bot className="h-4 w-4 mt-0.5 text-blue-600" />
                    )}
                    {message.type === 'user' && (
                      <User className="h-4 w-4 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <p className="whitespace-pre-line">{message.content}</p>
                      <p className={`text-xs mt-1 ${
                        message.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                      }`}>
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-lg p-3">
                  <div className="flex items-center space-x-2">
                    <Bot className="h-4 w-4 text-blue-600" />
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input Form */}
          <form onSubmit={handleSendMessage} className="flex space-x-2">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask me about your logistics operations..."
              className="flex-1"
              disabled={loading}
            />
            <Button type="submit" disabled={loading || !inputMessage.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setInputMessage('Check my inventory status')}>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <Brain className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-sm">Inventory Analysis</p>
                <p className="text-xs text-gray-600">Check stock levels</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setInputMessage('Optimize my delivery routes')}>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <Brain className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-sm">Route Optimization</p>
                <p className="text-xs text-gray-600">Improve delivery efficiency</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setInputMessage('Generate procurement suggestions')}>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <Brain className="h-4 w-4 text-purple-600" />
              </div>
              <div>
                <p className="font-medium text-sm">Procurement Help</p>
                <p className="text-xs text-gray-600">Smart purchasing advice</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setInputMessage('How do I upload my logistics files?')}>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                <Brain className="h-4 w-4 text-orange-600" />
              </div>
              <div>
                <p className="font-medium text-sm">File Learning</p>
                <p className="text-xs text-gray-600">Upload & analyze data</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
