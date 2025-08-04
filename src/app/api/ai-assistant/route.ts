import { NextRequest, NextResponse } from 'next/server'

const OPENAI_API_KEY = 'sk-Is6s1p1BqoYf21xBywtG2w'

export async function POST(request: NextRequest) {
  let locale = 'en' // Default locale
  
  try {
    const { message, history, locale: requestLocale } = await request.json()
    locale = requestLocale || 'en'

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    // Prepare system prompt based on locale
    const systemPrompt = locale === 'vi' 
      ? `Bạn là một chuyên gia AI về chuỗi cung ứng và logistics tại Việt Nam. Bạn có kiến thức sâu về:
- Quản lý kho hàng và tồn kho
- Tối ưu hóa tuyến đường vận chuyển
- Dự báo nhu cầu và lập kế hoạch
- Quản lý chi phí logistics
- Quy định và thực tiễn logistics tại Việt Nam
- Công nghệ và tự động hóa trong logistics

Hãy trả lời bằng tiếng Việt một cách chuyên nghiệp, cung cấp lời khuyên thực tế và có thể áp dụng được. Sử dụng số liệu và ví dụ cụ thể khi có thể.`
      : `You are an AI expert in supply chain and logistics. You have deep knowledge of:
- Warehouse and inventory management
- Transportation route optimization
- Demand forecasting and planning
- Logistics cost management
- Vietnam logistics regulations and practices
- Technology and automation in logistics

Provide professional, practical, and actionable advice. Use specific data and examples when possible.`

    // Prepare conversation history
    const messages = [
      { role: 'system', content: systemPrompt },
      ...history.slice(-5).map((msg: { role: 'system' | 'user' | 'assistant', content: string }) => ({
        role: msg.role,
        content: msg.content
      })),
      { role: 'user', content: message }
    ]

    // Call OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: messages,
        max_tokens: 1000,
        temperature: 0.7,
        stream: false
      }),
    })

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`)
    }

    const data = await response.json()
    const aiResponse = data.choices[0]?.message?.content || 'Sorry, I could not generate a response.'

    return NextResponse.json({ response: aiResponse })

  } catch (error) {
    console.error('AI Assistant API error:', error)
    
    // Fallback response
    const fallbackResponse = locale === 'vi'
      ? 'Xin lỗi, tôi đang gặp sự cố kỹ thuật. Vui lòng thử lại sau hoặc liên hệ với bộ phận hỗ trợ.'
      : 'Sorry, I\'m experiencing technical difficulties. Please try again later or contact support.'
    
    return NextResponse.json({ response: fallbackResponse })
  }
}
