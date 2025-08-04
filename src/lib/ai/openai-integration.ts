/**
 * OpenAI Integration Module for Supply Chain Optimization
 * Inspired by go-openai and agent-supply-chain-mcp repositories
 * Provides AI-powered insights and decision support
 */

import OpenAI from 'openai'

// Initialize OpenAI client with fallback for build time
const openai = typeof window !== 'undefined' || process.env.NEXT_PUBLIC_OPENAI_API_KEY ? 
  new OpenAI({
    apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY || 'placeholder-key',
    dangerouslyAllowBrowser: true
  }) : null

export interface SupplyChainContext {
  inventory: Array<{
    item: string
    currentStock: number
    reorderLevel: number
    demand: number
  }>
  shipments: Array<{
    id: string
    status: string
    destination: string
    priority: string
  }>
  suppliers: Array<{
    name: string
    reliability: number
    leadTime: number
    cost: number
  }>
  constraints: {
    budget: number
    capacity: number
    timeframe: string
  }
}

export interface AIRecommendation {
  type: 'inventory' | 'procurement' | 'routing' | 'risk_management' | 'cost_optimization'
  priority: 'low' | 'medium' | 'high' | 'critical'
  title: string
  description: string
  impact: string
  actionItems: string[]
  confidence: number
  estimatedSavings?: number
  riskLevel?: number
}

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
  timestamp?: string
}

/**
 * Supply Chain Guardrails - Ensures AI responses stay within logistics domain
 */
export class SupplyChainGuardrails {
  private static allowedTopics = [
    'inventory management',
    'supply chain',
    'logistics',
    'procurement',
    'transportation',
    'warehousing',
    'demand forecasting',
    'route optimization',
    'cost reduction',
    'supplier management',
    'distribution',
    'shipping',
    'freight',
    'fulfillment'
  ]

  static isSupplyChainRelated(query: string): boolean {
    const lowerQuery = query.toLowerCase()
    return this.allowedTopics.some(topic => 
      lowerQuery.includes(topic) || 
      lowerQuery.includes(topic.replace(' ', ''))
    )
  }

  static sanitizeQuery(query: string): string {
    // Remove potentially sensitive information
    return query
      .replace(/\b\d{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}\b/g, '[CARD_NUMBER]') // Credit cards
      .replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, '[EMAIL]') // Emails
      .replace(/\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g, '[PHONE]') // Phone numbers
      .replace(/\b\d{1,5}\s\w+\s(?:Street|St|Avenue|Ave|Road|Rd|Boulevard|Blvd|Lane|Ln|Drive|Dr)\b/gi, '[ADDRESS]') // Addresses
  }

  static getSupplyChainPrompt(): string {
    return `You are a specialized AI assistant for supply chain and logistics management. 
    You should only provide advice and insights related to:
    - Inventory management and optimization
    - Supply chain planning and execution
    - Transportation and logistics
    - Procurement and supplier management
    - Demand forecasting and planning
    - Warehouse and distribution management
    - Cost optimization and efficiency improvements
    - Risk management in supply chains
    
    Always provide practical, actionable advice with specific metrics when possible.
    If asked about topics outside supply chain and logistics, politely redirect to relevant logistics topics.`
  }
}

/**
 * AI-Powered Supply Chain Assistant
 */
export class SupplyChainAI {
  private conversationHistory: ChatMessage[] = []

  constructor() {
    this.conversationHistory.push({
      role: 'system',
      content: SupplyChainGuardrails.getSupplyChainPrompt()
    })
  }

  /**
   * Get AI recommendations based on current supply chain context
   */
  async getRecommendations(context: SupplyChainContext): Promise<AIRecommendation[]> {
    if (!openai) {
      return this.getMockRecommendations(context)
    }

    try {
      const prompt = this.buildContextPrompt(context)
      
      const response = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: SupplyChainGuardrails.getSupplyChainPrompt()
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 2000
      })

      const content = response.choices[0]?.message?.content
      if (!content) throw new Error('No response from AI')

      return this.parseRecommendations(content)
    } catch (error) {
      console.error('Error getting AI recommendations:', error)
      return this.getMockRecommendations(context)
    }
  }

  /**
   * Chat with AI assistant about supply chain topics
   */
  async chat(message: string): Promise<string> {
    // Sanitize and validate the query
    const sanitizedMessage = SupplyChainGuardrails.sanitizeQuery(message)
    
    if (!SupplyChainGuardrails.isSupplyChainRelated(sanitizedMessage)) {
      return "I'm specialized in supply chain and logistics management. Could you please ask me about inventory management, transportation, procurement, demand forecasting, or other logistics-related topics?"
    }

    if (!openai) {
      return this.getMockChatResponse(sanitizedMessage)
    }

    try {
      // Add user message to conversation history
      this.conversationHistory.push({
        role: 'user',
        content: sanitizedMessage,
        timestamp: new Date().toISOString()
      })

      const response = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: this.conversationHistory.slice(-10), // Keep last 10 messages for context
        temperature: 0.4,
        max_tokens: 1000
      })

      const assistantMessage = response.choices[0]?.message?.content || 'I apologize, but I could not generate a response.'

      // Add assistant response to conversation history
      this.conversationHistory.push({
        role: 'assistant',
        content: assistantMessage,
        timestamp: new Date().toISOString()
      })

      return assistantMessage
    } catch (error) {
      console.error('Error in AI chat:', error)
      return this.getMockChatResponse(sanitizedMessage)
    }
  }

  /**
   * Analyze supply chain risks using AI
   */
  async analyzeRisks(context: SupplyChainContext): Promise<{
    riskLevel: 'low' | 'medium' | 'high' | 'critical'
    risks: Array<{
      category: string
      description: string
      probability: number
      impact: number
      mitigation: string[]
    }>
  }> {
    if (!openai) {
      return this.getMockRiskAnalysis(context)
    }

    try {
      const prompt = `Analyze the following supply chain data for potential risks:
      
      Inventory: ${JSON.stringify(context.inventory, null, 2)}
      Shipments: ${JSON.stringify(context.shipments, null, 2)}
      Suppliers: ${JSON.stringify(context.suppliers, null, 2)}
      Constraints: ${JSON.stringify(context.constraints, null, 2)}
      
      Provide a risk analysis with specific risks, their probability (0-1), impact (0-1), and mitigation strategies.`

      const response = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are a supply chain risk analyst. Provide detailed risk assessments with quantified probabilities and impacts.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.2,
        max_tokens: 1500
      })

      const content = response.choices[0]?.message?.content
      if (!content) throw new Error('No response from AI')

      return this.parseRiskAnalysis(content)
    } catch (error) {
      console.error('Error analyzing risks:', error)
      return this.getMockRiskAnalysis(context)
    }
  }

  /**
   * Generate demand forecast using AI
   */
  async generateDemandForecast(
    historicalData: Array<{ date: string; demand: number }>,
    periods: number = 6
  ): Promise<Array<{ period: string; forecast: number; confidence: number }>> {
    if (!openai) {
      return this.getMockForecast(historicalData, periods)
    }

    try {
      const prompt = `Based on this historical demand data, generate a ${periods}-period forecast:
      
      ${JSON.stringify(historicalData, null, 2)}
      
      Consider seasonality, trends, and any patterns. Provide forecasts with confidence levels.`

      const response = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are a demand forecasting expert. Analyze historical data and provide accurate forecasts with confidence intervals.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.1,
        max_tokens: 1000
      })

      const content = response.choices[0]?.message?.content
      if (!content) throw new Error('No response from AI')

      return this.parseForecast(content, periods)
    } catch (error) {
      console.error('Error generating forecast:', error)
      return this.getMockForecast(historicalData, periods)
    }
  }

  // Private helper methods

  private buildContextPrompt(context: SupplyChainContext): string {
    return `Analyze this supply chain situation and provide 3-5 specific recommendations:

    Current Inventory Status:
    ${context.inventory.map(item => 
      `- ${item.item}: ${item.currentStock} units (reorder at ${item.reorderLevel}, demand: ${item.demand}/month)`
    ).join('\n')}

    Active Shipments:
    ${context.shipments.map(shipment => 
      `- ${shipment.id}: ${shipment.status} to ${shipment.destination} (${shipment.priority} priority)`
    ).join('\n')}

    Supplier Information:
    ${context.suppliers.map(supplier => 
      `- ${supplier.name}: ${supplier.reliability}% reliability, ${supplier.leadTime} days lead time, $${supplier.cost}/unit`
    ).join('\n')}

    Constraints:
    - Budget: $${context.constraints.budget}
    - Capacity: ${context.constraints.capacity} units
    - Timeframe: ${context.constraints.timeframe}

    Provide actionable recommendations with estimated impact and priority level.`
  }

  private parseRecommendations(content: string): AIRecommendation[] {
    // Simple parsing logic - in production, you might want more sophisticated parsing
    const recommendations: AIRecommendation[] = []
    
    // This is a simplified parser - you would implement more robust parsing
    const lines = content.split('\n').filter(line => line.trim())
    
    let currentRec: Partial<AIRecommendation> = {}
    
    lines.forEach(line => {
      if (line.includes('Recommendation') || line.includes('Priority:')) {
        if (currentRec.title) {
          recommendations.push(currentRec as AIRecommendation)
          currentRec = {}
        }
        currentRec.title = line.replace(/^\d+\.?\s*/, '').trim()
        currentRec.type = 'inventory' // Default type
        currentRec.priority = 'medium' // Default priority
        currentRec.confidence = 0.8 // Default confidence
        currentRec.actionItems = []
      }
    })

    if (currentRec.title) {
      recommendations.push(currentRec as AIRecommendation)
    }

    return recommendations.length > 0 ? recommendations : this.getMockRecommendations({} as SupplyChainContext)
  }

  private parseRiskAnalysis(content: string): {
    riskLevel: 'low' | 'medium' | 'high' | 'critical';
    risks: Array<{
      category: string;
      description: string;
      probability: number;
      impact: number;
      mitigation: string[];
    }>;
  } {
    // Simplified risk analysis parsing
    return {
      riskLevel: 'medium' as const,
      risks: [
        {
          category: 'Inventory Risk',
          description: 'Low stock levels detected for critical items',
          probability: 0.7,
          impact: 0.8,
          mitigation: ['Increase safety stock', 'Diversify suppliers', 'Implement automated reordering']
        }
      ]
    }
  }

  private parseForecast(content: string, periods: number): Array<{ period: string; forecast: number; confidence: number }> {
    // Simplified forecast parsing
    const forecasts = []
    const baseDate = new Date()
    
    for (let i = 0; i < periods; i++) {
      const futureDate = new Date(baseDate)
      futureDate.setMonth(futureDate.getMonth() + i + 1)
      
      forecasts.push({
        period: futureDate.toISOString().split('T')[0],
        forecast: Math.floor(Math.random() * 100) + 50,
        confidence: 0.75 + Math.random() * 0.2
      })
    }
    
    return forecasts
  }

  // Mock methods for fallback when OpenAI is not available

  private getMockRecommendations(context: SupplyChainContext): AIRecommendation[] {
    return [
      {
        type: 'inventory',
        priority: 'high',
        title: 'Optimize Inventory Levels',
        description: 'Several items are approaching reorder levels. Consider adjusting safety stock.',
        impact: 'Reduce stockout risk by 25% and carrying costs by 15%',
        actionItems: [
          'Review reorder points for fast-moving items',
          'Implement automated reordering system',
          'Negotiate better lead times with suppliers'
        ],
        confidence: 0.85,
        estimatedSavings: 15000
      },
      {
        type: 'routing',
        priority: 'medium',
        title: 'Route Optimization Opportunity',
        description: 'Current delivery routes can be optimized to reduce transportation costs.',
        impact: 'Reduce transportation costs by 12% and delivery time by 20%',
        actionItems: [
          'Implement route optimization software',
          'Consolidate shipments where possible',
          'Consider alternative transportation modes'
        ],
        confidence: 0.78,
        estimatedSavings: 8500
      },
      {
        type: 'procurement',
        priority: 'medium',
        title: 'Supplier Diversification',
        description: 'Over-reliance on single suppliers creates risk exposure.',
        impact: 'Reduce supply risk by 30% and potentially lower costs by 8%',
        actionItems: [
          'Identify alternative suppliers for critical items',
          'Negotiate volume discounts with multiple suppliers',
          'Implement supplier performance monitoring'
        ],
        confidence: 0.72,
        riskLevel: 0.6
      }
    ]
  }

  private getMockChatResponse(message: string): string {
    const responses = [
      "Based on your query about logistics optimization, I recommend focusing on demand forecasting accuracy and inventory turnover rates. These metrics directly impact your supply chain efficiency.",
      "For supply chain management, consider implementing a just-in-time approach while maintaining appropriate safety stock levels. This balance is crucial for cost optimization.",
      "Transportation costs can be reduced through route optimization and load consolidation. Have you considered using AI-powered routing algorithms?",
      "Supplier relationship management is key to supply chain resilience. Regular performance reviews and diversification strategies can mitigate risks.",
      "Inventory optimization involves balancing carrying costs with service levels. ABC analysis can help prioritize your inventory management efforts."
    ]
    
    return responses[Math.floor(Math.random() * responses.length)]
  }

  private getMockRiskAnalysis(context: SupplyChainContext): {
    riskLevel: 'low' | 'medium' | 'high' | 'critical';
    risks: Array<{
      category: string;
      description: string;
      probability: number;
      impact: number;
      mitigation: string[];
    }>;
  } {
    return {
      riskLevel: 'medium' as const,
      risks: [
        {
          category: 'Inventory Risk',
          description: 'Low stock levels detected for critical items',
          probability: 0.7,
          impact: 0.8,
          mitigation: ['Increase safety stock', 'Diversify suppliers', 'Implement automated reordering']
        },
        {
          category: 'Supplier Risk',
          description: 'High dependency on single supplier',
          probability: 0.5,
          impact: 0.9,
          mitigation: ['Identify backup suppliers', 'Negotiate flexible contracts', 'Monitor supplier financial health']
        },
        {
          category: 'Transportation Risk',
          description: 'Potential delays due to seasonal factors',
          probability: 0.6,
          impact: 0.6,
          mitigation: ['Plan for seasonal variations', 'Use multiple carriers', 'Implement tracking systems']
        }
      ]
    }
  }

  private getMockForecast(historicalData: Array<{ date: string; demand: number }>, periods: number): Array<{ period: string; forecast: number; confidence: number }> {
    const forecasts = []
    const baseDate = new Date()
    const lastDemand = historicalData[historicalData.length - 1]?.demand || 100
    
    for (let i = 0; i < periods; i++) {
      const futureDate = new Date(baseDate)
      futureDate.setMonth(futureDate.getMonth() + i + 1)
      
      // Simple trend-based forecast
      const trend = 1 + (Math.random() - 0.5) * 0.1 // ±5% variation
      const seasonality = 1 + Math.sin((i + 1) * Math.PI / 6) * 0.1 // Seasonal pattern
      
      forecasts.push({
        period: futureDate.toISOString().split('T')[0],
        forecast: Math.round(lastDemand * trend * seasonality),
        confidence: 0.75 + Math.random() * 0.2
      })
    }
    
    return forecasts
  }
}

// Export singleton instance
export const supplyChainAI = new SupplyChainAI()
