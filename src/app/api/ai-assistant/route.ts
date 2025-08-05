export const dynamic = 'force-static';
export const revalidate = false;

import { NextRequest } from 'next/server'
import { withSecurity, createSecureResponse } from '@/lib/security/api-security'
import { fileUploadRateLimiter, securityLogger } from '@/lib/security/middleware'
import { sanitizeInput } from '@/lib/security/encryption'

// OpenAI configuration with security - NEVER expose API keys in code
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || process.env.NEXT_PUBLIC_OPENAI_API_KEY

if (!OPENAI_API_KEY) {
  console.warn('OpenAI API key not configured. AI features will be limited.')
}

async function handleAIRequest(req: NextRequest) {
  try {
    const user = (req as any).user
    const clientIP = req.headers.get('x-forwarded-for') || 'unknown'
    
    // Rate limiting for AI requests
    if (!fileUploadRateLimiter.isAllowed(clientIP)) {
      securityLogger.log({
        type: 'rate_limit',
        identifier: clientIP,
        details: 'AI assistant rate limit exceeded',
        severity: 'medium'
      })
      return createSecureResponse(
        { error: 'Too many AI requests. Please wait before trying again.' },
        429
      )
    }

    const body = await req.json()
    const { message, history = [], locale = 'en' } = body

    // Validate and sanitize input
    if (!message || typeof message !== 'string') {
      return createSecureResponse(
        { error: 'Message is required and must be a string' },
        400
      )
    }

    const sanitizedMessage = sanitizeInput(message)

    // Check message length
    if (sanitizedMessage.length > 2000) {
      return createSecureResponse(
        { error: 'Message too long. Maximum 2000 characters allowed.' },
        400
      )
    }

    // Sanitize history
    const sanitizedHistory = history.slice(-5).map((msg: any) => ({
      role: msg.role === 'user' || msg.role === 'assistant' ? msg.role : 'user',
      content: sanitizeInput(msg.content || '')
    }))

    // Log AI request
    securityLogger.log({
      type: 'auth_attempt',
      identifier: user.email,
      details: `AI assistant request: ${sanitizedMessage.substring(0, 100)}...`,
      severity: 'low'
    })

    // If OpenAI is not configured, return a mock response
    if (!OPENAI_API_KEY) {
      const mockResponse = generateMockAIResponse(sanitizedMessage, locale)
      return createSecureResponse({
        response: mockResponse,
        timestamp: new Date().toISOString(),
        model: 'mock-ai-assistant'
      })
    }

    // Prepare system prompt based on locale
    const systemPrompt = locale === 'vi' 
      ? `Bạn là LogiAI, một chuyên gia AI về chuỗi cung ứng và logistics tại Việt Nam. Bạn có kiến thức sâu về:
- Quản lý kho hàng và tồn kho
- Tối ưu hóa tuyến đường vận chuyển
- Dự báo nhu cầu và lập kế hoạch
- Quản lý chi phí logistics
- Quy định và thực tiễn logistics tại Việt Nam
- Công nghệ và tự động hóa trong logistics

Hãy trả lời bằng tiếng Việt một cách chuyên nghiệp, cung cấp lời khuyên thực tế và có thể áp dụng được. Giữ phản hồi ngắn gọn và tập trung.`
      : `You are LogiAI, an AI expert in supply chain and logistics. You have deep knowledge of:
- Warehouse and inventory management
- Transportation route optimization
- Demand forecasting and planning
- Logistics cost management
- Vietnam logistics regulations and practices
- Technology and automation in logistics

Provide professional, practical, and actionable advice. Keep responses concise and focused.`

    // Prepare conversation messages
    const messages = [
      { role: 'system', content: systemPrompt },
      ...sanitizedHistory,
      { role: 'user', content: sanitizedMessage }
    ]

    // Make OpenAI API call with security measures
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: messages,
        max_tokens: 800,
        temperature: 0.7,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
        stream: false
      }),
    })

    if (!openaiResponse.ok) {
      securityLogger.log({
        type: 'invalid_request',
        identifier: user.email,
        details: `OpenAI API error: ${openaiResponse.status}`,
        severity: 'medium'
      })
      
      // Return fallback response
      const fallbackResponse = locale === 'vi'
        ? 'Xin lỗi, tôi đang gặp sự cố kỹ thuật. Vui lòng thử lại sau.'
        : 'Sorry, I\'m experiencing technical difficulties. Please try again later.'
      
      return createSecureResponse({
        response: fallbackResponse,
        timestamp: new Date().toISOString(),
        model: 'fallback'
      })
    }

    const data = await openaiResponse.json()
    const aiResponse = data.choices?.[0]?.message?.content || 'I apologize, but I could not generate a response at this time.'

    // Sanitize AI response
    const sanitizedResponse = sanitizeInput(aiResponse)

    return createSecureResponse({
      response: sanitizedResponse,
      timestamp: new Date().toISOString(),
      model: data.model || 'gpt-3.5-turbo',
      usage: data.usage
    })

  } catch (error) {
    securityLogger.log({
      type: 'invalid_request',
      identifier: (req as any).user?.email || 'unknown',
      details: `AI assistant error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      severity: 'high'
    })

    const locale = 'en' // Default fallback
    const fallbackResponse = locale === 'vi'
      ? 'Xin lỗi, tôi đang gặp sự cố kỹ thuật. Vui lòng thử lại sau.'
      : 'Sorry, I\'m experiencing technical difficulties. Please try again later.'

    return createSecureResponse({
      response: fallbackResponse,
      timestamp: new Date().toISOString(),
      model: 'error-fallback'
    })
  }
}

function generateMockAIResponse(message: string, locale: string): string {
  const responses = {
    en: {
      greeting: "Hello! I'm LogiAI, your logistics assistant. How can I help you optimize your supply chain today?",
      fleet: "For fleet management, I recommend implementing GPS tracking, regular maintenance schedules, and driver performance monitoring to improve efficiency and reduce costs.",
      route: "Route optimization can reduce fuel costs by 15-20%. Consider factors like traffic patterns, delivery windows, and vehicle capacity when planning routes.",
      warehouse: "Effective warehouse management includes ABC analysis for inventory, proper layout design, and automated systems for tracking stock levels.",
      vietnam: "Vietnam's logistics market is growing rapidly. Key opportunities include e-commerce fulfillment, cross-border trade, and cold chain development.",
      default: "I'm here to help with your logistics needs. Could you please provide more specific details about your question?"
    },
    vi: {
      greeting: "Xin chào! Tôi là LogiAI, trợ lý logistics của bạn. Tôi có thể giúp bạn tối ưu hóa chuỗi cung ứng như thế nào?",
      fleet: "Để quản lý đội xe hiệu quả, tôi khuyên bạn nên triển khai theo dõi GPS, lịch bảo trì định kỳ và giám sát hiệu suất tài xế.",
      route: "Tối ưu hóa tuyến đường có thể giảm chi phí nhiên liệu 15-20%. Hãy xem xét các yếu tố như mật độ giao thông, khung giờ giao hàng và sức chứa xe.",
      warehouse: "Quản lý kho hiệu quả bao gồm phân tích ABC cho hàng tồn kho, thiết kế bố trí hợp lý và hệ thống tự động theo dõi mức tồn kho.",
      vietnam: "Thị trường logistics Việt Nam đang phát triển nhanh chóng. Cơ hội chính bao gồm thực hiện thương mại điện tử, thương mại xuyên biên giới và phát triển chuỗi lạnh.",
      default: "Tôi ở đây để hỗ trợ nhu cầu logistics của bạn. Bạn có thể cung cấp thêm chi tiết cụ thể về câu hỏi của mình không?"
    }
  }

  const langResponses = responses[locale as keyof typeof responses] || responses.en
  const lowerMessage = message.toLowerCase()

  if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('xin chào')) {
    return langResponses.greeting
  } else if (lowerMessage.includes('fleet') || lowerMessage.includes('đội xe')) {
    return langResponses.fleet
  } else if (lowerMessage.includes('route') || lowerMessage.includes('tuyến đường')) {
    return langResponses.route
  } else if (lowerMessage.includes('warehouse') || lowerMessage.includes('kho')) {
    return langResponses.warehouse
  } else if (lowerMessage.includes('vietnam') || lowerMessage.includes('việt nam')) {
    return langResponses.vietnam
  } else {
    return langResponses.default
  }
}

// Export the secured handler
export const POST = withSecurity(handleAIRequest, {
  requireAuth: true,
  rateLimit: true,
  allowedMethods: ['POST'],
  maxBodySize: 15000, // 15KB max for AI requests with history
  validateCSRF: false // CSRF not needed for API calls
})
