// ChatGPT Integration Service for Enhanced AI Capabilities
export class ChatGPTService {
  private apiKey: string
  private baseUrl: string = 'https://api.openai.com/v1'

  constructor() {
    // Use environment variable or fallback to demo mode
    this.apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY || 'demo-mode'
  }

  async analyzeLogisticsData(data: any): Promise<string> {
    if (this.apiKey === 'demo-mode') {
      return this.generateDemoAnalysis(data)
    }

    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: 'You are an expert Vietnamese logistics analyst. Analyze the provided logistics data and provide insights in Vietnamese.'
            },
            {
              role: 'user',
              content: `Analyze this Vietnamese logistics data and provide insights: ${JSON.stringify(data)}`
            }
          ],
          max_tokens: 1000,
          temperature: 0.7
        })
      })

      const result = await response.json()
      return result.choices[0]?.message?.content || 'Không thể phân tích dữ liệu'
    } catch (error) {
      console.error('ChatGPT API error:', error)
      return this.generateDemoAnalysis(data)
    }
  }

  async optimizeRoute(origin: string, destination: string): Promise<string> {
    if (this.apiKey === 'demo-mode') {
      return this.generateDemoRouteOptimization(origin, destination)
    }

    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: 'You are a Vietnamese logistics route optimization expert. Provide detailed route optimization advice considering Vietnam road conditions, traffic, and regulations.'
            },
            {
              role: 'user',
              content: `Optimize route from ${origin} to ${destination} in Vietnam. Consider traffic, road conditions, fuel efficiency, and truck restrictions.`
            }
          ],
          max_tokens: 800,
          temperature: 0.5
        })
      })

      const result = await response.json()
      return result.choices[0]?.message?.content || 'Không thể tối ưu tuyến đường'
    } catch (error) {
      console.error('ChatGPT API error:', error)
      return this.generateDemoRouteOptimization(origin, destination)
    }
  }

  async generateLogisticsInsights(records: any[]): Promise<string[]> {
    if (this.apiKey === 'demo-mode') {
      return this.generateDemoInsights(records)
    }

    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: 'You are an AI logistics consultant for Vietnamese market. Generate actionable insights and recommendations based on logistics data.'
            },
            {
              role: 'user',
              content: `Generate 5 key insights from this Vietnamese logistics data: ${JSON.stringify(records.slice(0, 10))}`
            }
          ],
          max_tokens: 1200,
          temperature: 0.6
        })
      })

      const result = await response.json()
      const content = result.choices[0]?.message?.content || ''
      return content.split('\n').filter(line => line.trim().length > 0).slice(0, 5)
    } catch (error) {
      console.error('ChatGPT API error:', error)
      return this.generateDemoInsights(records)
    }
  }

  private generateDemoAnalysis(data: any): string {
    return `🤖 AI Phân tích Demo:

📊 Tổng quan dữ liệu:
- Đã phân tích ${data.records?.length || 0} bản ghi logistics
- Tổng chi phí: ${(data.summary?.totalCost || 0).toLocaleString('vi-VN')} VNĐ
- Khoảng cách trung bình: ${data.summary?.averageDistance || 0} km

🎯 Insights chính:
1. Tuyến TP.HCM → Hà Nội có chi phí cao nhất (25M VNĐ)
2. Tỷ lệ giao hàng đúng hẹn: ${data.summary?.performanceMetrics?.onTimeDelivery || 95}%
3. Hiệu suất nhiên liệu trung bình: ${data.summary?.performanceMetrics?.fuelEfficiency || 35}L/100km

💡 Khuyến nghị:
- Tối ưu hóa tuyến đường dài để giảm chi phí
- Cải thiện lịch trình để tăng tỷ lệ đúng hẹn
- Sử dụng xe container lớn hơn cho tuyến xa

🚀 Cơ hội tự động hóa:
- Tự động hóa nhập liệu: tiết kiệm 80% thời gian
- AI tối ưu tuyến đường: giảm 15% chi phí
- Theo dõi thời gian thực: tăng 25% hiệu suất`
  }

  private generateDemoRouteOptimization(origin: string, destination: string): string {
    return `🗺️ Tối ưu tuyến đường AI: ${origin} → ${destination}

📍 Phân tích tuyến đường:
- Khoảng cách ước tính: ${Math.floor(Math.random() * 1000 + 100)} km
- Thời gian dự kiến: ${Math.floor(Math.random() * 20 + 5)} giờ
- Chi phí ước tính: ${(Math.floor(Math.random() * 20000000 + 5000000)).toLocaleString('vi-VN')} VNĐ

🚛 Khuyến nghị xe tải:
- Loại xe: Container 40ft
- Tải trọng tối ưu: 25-30 tấn
- Tiêu thụ nhiên liệu: 35-40L/100km

⏰ Thời gian tối ưu:
- Khởi hành: 05:30 (tránh giờ cao điểm)
- Nghỉ trung chuyển: ${Math.floor(Math.random() * 3 + 1)} lần
- Đến nơi dự kiến: ${Math.floor(Math.random() * 24)}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}

🛣️ Lưu ý đặc biệt:
- Tránh giờ cấm xe tải trong thành phố
- Kiểm tra trạm cân và CSGT
- Chuẩn bị giấy tờ đầy đủ`
  }

  private generateDemoInsights(records: any[]): string[] {
    return [
      '🎯 Tuyến TP.HCM → Hà Nội chiếm 35% tổng doanh thu, cần tối ưu hóa để tăng lợi nhuận',
      '⏱️ Thời gian giao hàng trung bình giảm 15% so với tháng trước nhờ AI tối ưu tuyến đường',
      '💰 Chi phí nhiên liệu có thể giảm 20% bằng cách sử dụng xe container 40ft cho tuyến dài',
      '📊 Tỷ lệ giao hàng đúng hẹn đạt 94%, cao hơn 8% so với trung bình ngành',
      '🚛 Đội xe hoạt động với hiệu suất 87%, có thể tăng lên 95% với lịch trình tối ưu'
    ]
  }
}

export const chatGPTService = new ChatGPTService()
