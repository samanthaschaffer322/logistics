import { NextRequest, NextResponse } from 'next/server';
import { enhancedAI, LogisticsContext } from '@/lib/ai/enhanced-ai-assistant';

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

    // Build logistics context from current session/user data
    const context: LogisticsContext = {
      // In a real app, you'd fetch this from your database/session
      currentRoute: null,
      vehicleData: null,
      warehouseInfo: null,
      shipmentDetails: null,
      performanceMetrics: null
    };

    // Process the message with enhanced AI
    const result = await enhancedAI.processMessage(
      message,
      context,
      model,
      attachments,
      chatHistory
    );

    // Estimate cost
    const cost = await enhancedAI.estimateCost(message, model);

    return NextResponse.json({
      response: result.response,
      reasoning: result.reasoning,
      suggestions: result.suggestions || [],
      actions: result.actions || [],
      sources: result.sources || [],
      cost: cost,
      model: model,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Enhanced AI Assistant API Error:', error);
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        response: 'Xin lỗi, tôi gặp lỗi khi xử lý yêu cầu của bạn. Vui lòng thử lại sau.',
        suggestions: [
          'Thử lại với câu hỏi khác',
          'Kiểm tra kết nối internet',
          'Liên hệ hỗ trợ kỹ thuật'
        ]
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const models = enhancedAI.getAvailableModels();
    
    return NextResponse.json({
      models,
      features: [
        'Multi-model AI support',
        'Vietnamese logistics expertise',
        'Document and image analysis',
        'Real-time optimization',
        'Cost estimation',
        'Smart suggestions',
        'Actionable insights'
      ],
      status: 'operational'
    });
  } catch (error) {
    console.error('Enhanced AI Assistant API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
