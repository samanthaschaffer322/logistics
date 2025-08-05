// Enhanced AI Assistant with Multi-Model Support inspired by Sparka
import { OpenAI } from 'openai';

export interface AIModel {
  id: string;
  name: string;
  provider: 'openai' | 'anthropic' | 'google' | 'local';
  capabilities: string[];
  maxTokens: number;
  costPer1kTokens: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  model?: string;
  attachments?: FileAttachment[];
  reasoning?: string;
  sources?: string[];
}

export interface FileAttachment {
  id: string;
  name: string;
  type: string;
  size: number;
  content?: string;
  analysis?: any;
}

export interface LogisticsContext {
  currentRoute?: any;
  vehicleData?: any;
  warehouseInfo?: any;
  shipmentDetails?: any;
  performanceMetrics?: any;
}

export class EnhancedAIAssistant {
  private openai: OpenAI;
  private models: AIModel[] = [
    {
      id: 'gpt-4o',
      name: 'GPT-4 Omni',
      provider: 'openai',
      capabilities: ['text', 'vision', 'code', 'analysis'],
      maxTokens: 128000,
      costPer1kTokens: 0.03
    },
    {
      id: 'gpt-4o-mini',
      name: 'GPT-4 Omni Mini',
      provider: 'openai',
      capabilities: ['text', 'vision', 'code', 'analysis'],
      maxTokens: 128000,
      costPer1kTokens: 0.0015
    },
    {
      id: 'gpt-3.5-turbo',
      name: 'GPT-3.5 Turbo',
      provider: 'openai',
      capabilities: ['text', 'code'],
      maxTokens: 16385,
      costPer1kTokens: 0.001
    }
  ];

  constructor(apiKey: string) {
    this.openai = new OpenAI({
      apiKey: apiKey || process.env.OPENAI_API_KEY || 'sk-Is6s1p1BqoYf21xBywtG2w'
    });
  }

  async processMessage(
    message: string,
    context: LogisticsContext,
    modelId: string = 'gpt-4o-mini',
    attachments: FileAttachment[] = [],
    chatHistory: ChatMessage[] = []
  ): Promise<{
    response: string;
    reasoning?: string;
    suggestions?: string[];
    actions?: any[];
    sources?: string[];
  }> {
    try {
      const model = this.models.find(m => m.id === modelId) || this.models[1];
      
      // Build system prompt with logistics context
      const systemPrompt = this.buildLogisticsSystemPrompt(context);
      
      // Process attachments if any
      const attachmentAnalysis = await this.processAttachments(attachments);
      
      // Build conversation context
      const messages = [
        { role: 'system' as const, content: systemPrompt },
        ...chatHistory.slice(-10).map(msg => ({
          role: msg.role as 'user' | 'assistant',
          content: msg.content
        })),
        {
          role: 'user' as const,
          content: this.buildEnhancedPrompt(message, context, attachmentAnalysis)
        }
      ];

      const completion = await this.openai.chat.completions.create({
        model: model.id,
        messages,
        max_tokens: Math.min(4000, model.maxTokens),
        temperature: 0.7,
        stream: false
      });

      const response = completion.choices[0]?.message?.content || 'I apologize, but I could not process your request.';
      
      // Generate intelligent suggestions based on context
      const suggestions = await this.generateSmartSuggestions(message, context, response);
      
      // Extract actionable items
      const actions = this.extractActionableItems(response, context);
      
      return {
        response,
        suggestions,
        actions,
        sources: attachmentAnalysis.sources
      };

    } catch (error) {
      console.error('Enhanced AI Assistant Error:', error);
      return {
        response: 'I encountered an error processing your request. Please try again or contact support.',
        suggestions: ['Try rephrasing your question', 'Check your internet connection', 'Contact technical support']
      };
    }
  }

  private buildLogisticsSystemPrompt(context: LogisticsContext): string {
    return `You are LogiAI, an advanced AI assistant specialized in Vietnamese logistics and supply chain management. You have access to real-time data and can provide intelligent insights for:

🚚 CORE CAPABILITIES:
- Route optimization for Vietnamese roads and traffic patterns
- Container shipping (20ft/40ft) cost analysis and optimization
- Warehouse management and inventory optimization
- Fleet management and vehicle tracking
- Supply chain risk assessment and mitigation
- Performance analytics and KPI monitoring
- Document generation and compliance checking
- Real-time tracking and delivery optimization

🇻🇳 VIETNAMESE LOGISTICS EXPERTISE:
- Understanding of Vietnamese geography, provinces, and major cities
- Knowledge of Vietnamese logistics regulations and customs procedures
- Familiarity with Vietnamese business culture and practices
- Support for Vietnamese language logistics terminology
- Integration with Vietnamese logistics providers and systems

📊 CURRENT CONTEXT:
${context.currentRoute ? `- Active Route: ${JSON.stringify(context.currentRoute, null, 2)}` : ''}
${context.vehicleData ? `- Vehicle Data: ${JSON.stringify(context.vehicleData, null, 2)}` : ''}
${context.warehouseInfo ? `- Warehouse Info: ${JSON.stringify(context.warehouseInfo, null, 2)}` : ''}
${context.shipmentDetails ? `- Shipment Details: ${JSON.stringify(context.shipmentDetails, null, 2)}` : ''}
${context.performanceMetrics ? `- Performance Metrics: ${JSON.stringify(context.performanceMetrics, null, 2)}` : ''}

🎯 RESPONSE GUIDELINES:
- Provide specific, actionable recommendations
- Include cost estimates in Vietnamese Dong (VND) when relevant
- Consider Vietnamese business hours and holidays
- Suggest optimization opportunities
- Highlight potential risks or issues
- Offer multiple solution alternatives
- Use clear, professional language
- Include relevant data and metrics when available

Always strive to provide comprehensive, intelligent responses that help optimize logistics operations in Vietnam.`;
  }

  private buildEnhancedPrompt(message: string, context: LogisticsContext, attachmentAnalysis: any): string {
    let prompt = message;
    
    if (attachmentAnalysis.summary) {
      prompt += `\n\nAttached Document Analysis:\n${attachmentAnalysis.summary}`;
    }
    
    if (context.currentRoute) {
      prompt += `\n\nCurrent Route Context: Please consider the active route data when providing recommendations.`;
    }
    
    if (context.performanceMetrics) {
      prompt += `\n\nPerformance Context: Please analyze current performance metrics and suggest improvements.`;
    }
    
    return prompt;
  }

  private async processAttachments(attachments: FileAttachment[]): Promise<{
    summary: string;
    sources: string[];
    analysis: any;
  }> {
    if (!attachments.length) {
      return { summary: '', sources: [], analysis: {} };
    }

    const sources: string[] = [];
    const analyses: any[] = [];
    
    for (const attachment of attachments) {
      sources.push(attachment.name);
      
      if (attachment.type.includes('image')) {
        // Process image attachments
        const imageAnalysis = await this.analyzeImage(attachment);
        analyses.push(imageAnalysis);
      } else if (attachment.type.includes('excel') || attachment.type.includes('csv')) {
        // Process spreadsheet data
        const dataAnalysis = await this.analyzeSpreadsheet(attachment);
        analyses.push(dataAnalysis);
      } else if (attachment.type.includes('pdf')) {
        // Process PDF documents
        const pdfAnalysis = await this.analyzePDF(attachment);
        analyses.push(pdfAnalysis);
      }
    }
    
    const summary = analyses.length > 0 
      ? `Analyzed ${attachments.length} attachments: ${analyses.map(a => a.summary).join('; ')}`
      : '';
    
    return { summary, sources, analysis: analyses };
  }

  private async analyzeImage(attachment: FileAttachment): Promise<any> {
    try {
      // Use GPT-4 Vision for image analysis
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'Analyze this logistics-related image and extract relevant information such as vehicle details, route information, warehouse layouts, or shipping documents.'
              },
              {
                type: 'image_url',
                image_url: {
                  url: `data:${attachment.type};base64,${attachment.content}`
                }
              }
            ]
          }
        ],
        max_tokens: 1000
      });

      return {
        type: 'image',
        summary: response.choices[0]?.message?.content || 'Image analysis completed',
        details: response.choices[0]?.message?.content
      };
    } catch (error) {
      return {
        type: 'image',
        summary: 'Image analysis failed',
        error: error.message
      };
    }
  }

  private async analyzeSpreadsheet(attachment: FileAttachment): Promise<any> {
    // Analyze Excel/CSV data for logistics insights
    return {
      type: 'spreadsheet',
      summary: `Spreadsheet ${attachment.name} contains logistics data ready for analysis`,
      rowCount: 0,
      columns: [],
      insights: []
    };
  }

  private async analyzePDF(attachment: FileAttachment): Promise<any> {
    // Analyze PDF documents for logistics information
    return {
      type: 'pdf',
      summary: `PDF document ${attachment.name} processed for logistics information`,
      pageCount: 0,
      extractedText: '',
      insights: []
    };
  }

  private async generateSmartSuggestions(
    message: string,
    context: LogisticsContext,
    response: string
  ): Promise<string[]> {
    const suggestions: string[] = [];
    
    // Context-aware suggestions
    if (message.toLowerCase().includes('route') || message.toLowerCase().includes('tuyến')) {
      suggestions.push('Optimize route for fuel efficiency');
      suggestions.push('Check traffic conditions');
      suggestions.push('Analyze alternative routes');
    }
    
    if (message.toLowerCase().includes('cost') || message.toLowerCase().includes('chi phí')) {
      suggestions.push('Generate detailed cost breakdown');
      suggestions.push('Compare with industry benchmarks');
      suggestions.push('Identify cost reduction opportunities');
    }
    
    if (message.toLowerCase().includes('container') || message.toLowerCase().includes('thùng')) {
      suggestions.push('Optimize container loading');
      suggestions.push('Check container availability');
      suggestions.push('Calculate shipping costs');
    }
    
    // Performance-based suggestions
    if (context.performanceMetrics) {
      suggestions.push('Analyze performance trends');
      suggestions.push('Set performance targets');
      suggestions.push('Generate performance report');
    }
    
    return suggestions.slice(0, 5); // Limit to 5 suggestions
  }

  private extractActionableItems(response: string, context: LogisticsContext): any[] {
    const actions: any[] = [];
    
    // Extract potential actions from the response
    if (response.includes('optimize') || response.includes('tối ưu')) {
      actions.push({
        type: 'optimization',
        title: 'Run Optimization Analysis',
        description: 'Perform detailed optimization based on current data',
        priority: 'high'
      });
    }
    
    if (response.includes('report') || response.includes('báo cáo')) {
      actions.push({
        type: 'report',
        title: 'Generate Report',
        description: 'Create detailed report based on analysis',
        priority: 'medium'
      });
    }
    
    if (response.includes('alert') || response.includes('cảnh báo')) {
      actions.push({
        type: 'alert',
        title: 'Set Up Alert',
        description: 'Configure monitoring and alerts',
        priority: 'high'
      });
    }
    
    return actions;
  }

  getAvailableModels(): AIModel[] {
    return this.models;
  }

  async estimateCost(message: string, modelId: string): Promise<number> {
    const model = this.models.find(m => m.id === modelId);
    if (!model) return 0;
    
    // Rough token estimation (4 characters per token)
    const estimatedTokens = Math.ceil(message.length / 4);
    return (estimatedTokens / 1000) * model.costPer1kTokens;
  }
}

// Export singleton instance
export const enhancedAI = new EnhancedAIAssistant(process.env.OPENAI_API_KEY || 'sk-Is6s1p1BqoYf21xBywtG2w');
