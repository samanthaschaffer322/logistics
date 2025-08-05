import { NextRequest, NextResponse } from 'next/server';

// Required for static export
export const dynamic = 'force-static'
export const revalidate = false

// Mock response for static export
export async function GET() {
  return NextResponse.json({
    message: "Enhanced AI Assistant is ready! This is a static version for Cloudflare Pages deployment.",
    status: "ready",
    features: [
      "Multi-model AI support (GPT-4 Omni, GPT-4 Mini, GPT-3.5 Turbo)",
      "Vietnamese logistics expertise", 
      "Smart route optimization",
      "Document and image analysis",
      "Real-time cost estimation",
      "Interactive suggestions"
    ]
  })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, model = 'gpt-4o-mini', attachments = [], chatHistory = [] } = body;

    if (!message && attachments.length === 0) {
      return NextResponse.json(
        { error: 'Message or attachments required' },
        { status: 400 }
      );
    }

    // Mock enhanced AI response for static deployment
    const mockResponse = {
      response: `🚀 **Enhanced AI Logistics Assistant** (Static Demo Mode)

**Your Query:** "${message}"

**Vietnamese Logistics Analysis:**

🇻🇳 **Market Context:**
- Major ports: Ho Chi Minh City (Cat Lai, Tan Cang), Hai Phong, Da Nang
- Key routes: National Highways AH1, AH16, AH17
- Current season considerations and traffic patterns

📊 **Smart Recommendations:**
1. **Route Optimization:** Consider alternative paths via Highway 1A for better fuel efficiency
2. **Cost Analysis:** 20ft container: ~$800-1,200, 40ft container: ~$1,400-2,000
3. **Risk Assessment:** Monitor weather conditions and holiday schedules
4. **Regulatory Compliance:** Ensure proper customs documentation

💡 **AI-Powered Insights:**
- Predicted delivery time: 2-3 business days
- Optimal departure time: Early morning (6-8 AM)
- Fuel cost estimate: $150-200 for 500km route
- Risk level: Low-Medium

**Note:** This is a demonstration version. For full AI capabilities with real-time data, please configure your OpenAI API key in the environment variables.

**Available Models:** GPT-4 Omni, GPT-4 Mini, GPT-3.5 Turbo
**Current Model:** ${model}`,
      
      model: model,
      usage: {
        prompt_tokens: 150,
        completion_tokens: 300,
        total_tokens: 450
      },
      suggestions: [
        "Optimize route for fuel efficiency",
        "Check weather conditions",
        "Review container availability",
        "Calculate total logistics cost"
      ],
      attachmentAnalysis: attachments.length > 0 ? {
        count: attachments.length,
        types: ["Document analysis available in full version"],
        insights: ["Upload functionality ready for production deployment"]
      } : null
    };
    
    return NextResponse.json(mockResponse);
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}
