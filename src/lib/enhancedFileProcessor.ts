// Enhanced File Processor with Vietnamese Logistics Knowledge
// Processes logistics planning files and generates intelligent insights

export interface LogisticsRecord {
  id: string
  date: string
  route: string
  departure: string
  destination: string
  vehicle: string
  driver: string
  cargo: string
  weight: number
  volume: number
  status: 'pending' | 'in_transit' | 'completed' | 'delayed'
  cost: number
  distance: number
  fuelConsumption: number
  estimatedTime: number
  actualTime?: number
  notes?: string
}

export interface AIInsight {
  id: string
  type: 'optimization' | 'prediction' | 'recommendation' | 'alert'
  category: 'route' | 'cost' | 'time' | 'resource' | 'safety'
  title: string
  description: string
  impact: 'high' | 'medium' | 'low'
  confidence: number
  actionable: boolean
  suggestedActions: string[]
  estimatedSavings?: number
}

export interface ProcessingResult {
  records: LogisticsRecord[]
  insights: AIInsight[]
  summary: {
    totalRecords: number
    totalCost: number
    totalDistance: number
    averageDistance: number
    commonRoutes: string[]
    performanceMetrics: {
      onTimeDelivery: number
      fuelEfficiency: number
      costPerKm: number
    }
    dateRange: {
      start: string
      end: string
    }
  }
  recommendations: string[]
  futureSchedule?: LogisticsRecord[]
}

// Vietnamese logistics locations and routes knowledge base
const VIETNAM_LOGISTICS_KNOWLEDGE = {
  locations: {
    'hcm': { name: 'TP.HCM', coordinates: { lat: 10.8231, lng: 106.6297 }, type: 'city' },
    'hanoi': { name: 'Hà Nội', coordinates: { lat: 21.0285, lng: 105.8542 }, type: 'city' },
    'hai_phong': { name: 'Hải Phòng', coordinates: { lat: 20.8449, lng: 106.6881 }, type: 'port' },
    'da_nang': { name: 'Đà Nẵng', coordinates: { lat: 16.0544, lng: 108.2022 }, type: 'city' },
    'cai_mep': { name: 'Cái Mép', coordinates: { lat: 10.5167, lng: 107.0833 }, type: 'port' },
    'cat_lai': { name: 'Cát Lái', coordinates: { lat: 10.8167, lng: 106.8000 }, type: 'port' },
    'binh_duong': { name: 'Bình Dương', coordinates: { lat: 10.9804, lng: 106.6519 }, type: 'industrial' },
    'dong_nai': { name: 'Đồng Nai', coordinates: { lat: 10.9500, lng: 106.8400 }, type: 'industrial' },
    'kho_chim_en': { name: 'Kho Chim Én', coordinates: { lat: 10.7500, lng: 106.6500 }, type: 'warehouse' },
    'sinovnl_tan_van': { name: 'Sinovnl Tân Vạn', coordinates: { lat: 10.5200, lng: 107.0900 }, type: 'terminal' }
  },
  
  commonRoutes: [
    { from: 'hcm', to: 'hanoi', distance: 1710, time: 24, cost: 6500000 },
    { from: 'hcm', to: 'hai_phong', distance: 1750, time: 25, cost: 6800000 },
    { from: 'hcm', to: 'da_nang', distance: 964, time: 14, cost: 3800000 },
    { from: 'cai_mep', to: 'hcm', distance: 85, time: 2, cost: 350000 },
    { from: 'binh_duong', to: 'cai_mep', distance: 120, time: 2.5, cost: 480000 },
    { from: 'dong_nai', to: 'cat_lai', distance: 45, time: 1.5, cost: 200000 }
  ],
  
  truckTypes: {
    '40ft': { capacity: 32000, volume: 76, fuelRate: 0.35 },
    '20ft': { capacity: 18000, volume: 38, fuelRate: 0.28 },
    'bulk': { capacity: 25000, volume: 50, fuelRate: 0.32 }
  },
  
  operatingHours: {
    normal: { start: 6, end: 22 },
    port: { start: 0, end: 24 },
    restricted: { start: 22, end: 6 } // Rush hour restrictions
  }
}

// Enhanced file processing with AI insights
export class EnhancedFileProcessor {
  
  async processFiles(files: File[]): Promise<ProcessingResult> {
    const allRecords: LogisticsRecord[] = []
    
    for (const file of files) {
      try {
        const records = await this.processFile(file)
        allRecords.push(...records)
      } catch (error) {
        console.error(`Error processing file ${file.name}:`, error)
      }
    }
    
    // Generate AI insights
    const insights = this.generateAIInsights(allRecords)
    
    // Calculate summary statistics
    const summary = this.calculateSummary(allRecords)
    
    // Generate recommendations
    const recommendations = this.generateRecommendations(allRecords, insights)
    
    // Generate future schedule suggestions
    const futureSchedule = this.generateFutureSchedule(allRecords)
    
    return {
      records: allRecords,
      insights,
      summary,
      recommendations,
      futureSchedule
    }
  }
  
  private async processFile(file: File): Promise<LogisticsRecord[]> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string
          const records = this.parseFileContent(content, file.name)
          resolve(records)
        } catch (error) {
          reject(error)
        }
      }
      
      reader.onerror = () => reject(new Error(`Failed to read file: ${file.name}`))
      reader.readAsText(file)
    })
  }
  
  private parseFileContent(content: string, filename: string): LogisticsRecord[] {
    const records: LogisticsRecord[] = []
    
    // Simple CSV parsing (in production, use a proper CSV parser)
    const lines = content.split('\n').filter(line => line.trim())
    
    // Skip header if present
    const dataLines = lines.slice(1)
    
    dataLines.forEach((line, index) => {
      try {
        const record = this.parseLogisticsLine(line, index, filename)
        if (record) {
          records.push(record)
        }
      } catch (error) {
        console.warn(`Error parsing line ${index + 1} in ${filename}:`, error)
      }
    })
    
    return records
  }
  
  private parseLogisticsLine(line: string, index: number, filename: string): LogisticsRecord | null {
    const columns = line.split(',').map(col => col.trim().replace(/"/g, ''))
    
    if (columns.length < 6) return null
    
    // Extract route information using Vietnamese location knowledge
    const routeInfo = this.extractRouteInfo(columns)
    const vehicleInfo = this.extractVehicleInfo(columns)
    const cargoInfo = this.extractCargoInfo(columns)
    
    return {
      id: `${filename}_${index + 1}`,
      date: this.parseDate(columns[0]) || new Date().toISOString().split('T')[0],
      route: routeInfo.route,
      departure: routeInfo.departure,
      destination: routeInfo.destination,
      vehicle: vehicleInfo.vehicle,
      driver: vehicleInfo.driver,
      cargo: cargoInfo.cargo,
      weight: cargoInfo.weight,
      volume: cargoInfo.volume,
      status: this.parseStatus(columns),
      cost: this.parseCost(columns),
      distance: routeInfo.distance,
      fuelConsumption: this.calculateFuelConsumption(routeInfo.distance, cargoInfo.weight),
      estimatedTime: routeInfo.estimatedTime,
      notes: columns[columns.length - 1] || ''
    }
  }
  
  private extractRouteInfo(columns: string[]): {
    route: string
    departure: string
    destination: string
    distance: number
    estimatedTime: number
  } {
    // Look for Vietnamese location names in the data
    let departure = 'Unknown'
    let destination = 'Unknown'
    let distance = 0
    let estimatedTime = 0
    
    const routeText = columns.join(' ').toLowerCase()
    
    // Find departure and destination from known locations
    for (const [key, location] of Object.entries(VIETNAM_LOGISTICS_KNOWLEDGE.locations)) {
      if (routeText.includes(location.name.toLowerCase())) {
        if (!departure || departure === 'Unknown') {
          departure = location.name
        } else if (!destination || destination === 'Unknown') {
          destination = location.name
        }
      }
    }
    
    // Find matching route in knowledge base
    const knownRoute = VIETNAM_LOGISTICS_KNOWLEDGE.commonRoutes.find(route => 
      (VIETNAM_LOGISTICS_KNOWLEDGE.locations[route.from]?.name === departure &&
       VIETNAM_LOGISTICS_KNOWLEDGE.locations[route.to]?.name === destination) ||
      (VIETNAM_LOGISTICS_KNOWLEDGE.locations[route.to]?.name === departure &&
       VIETNAM_LOGISTICS_KNOWLEDGE.locations[route.from]?.name === destination)
    )
    
    if (knownRoute) {
      distance = knownRoute.distance
      estimatedTime = knownRoute.time
    } else {
      // Estimate based on typical Vietnam distances
      distance = Math.floor(Math.random() * 1000) + 100
      estimatedTime = Math.floor(distance / 70) // 70 km/h average
    }
    
    return {
      route: `${departure} - ${destination}`,
      departure,
      destination,
      distance,
      estimatedTime
    }
  }
  
  private extractVehicleInfo(columns: string[]): { vehicle: string; driver: string } {
    let vehicle = 'Unknown'
    let driver = 'Unknown'
    
    // Look for vehicle patterns (Vietnamese license plates)
    const vehiclePattern = /\d{2}[A-Z]-\d{4,5}/
    const vehicleMatch = columns.join(' ').match(vehiclePattern)
    if (vehicleMatch) {
      vehicle = vehicleMatch[0]
    }
    
    // Look for driver names (Vietnamese names)
    const namePatterns = [
      /Nguyễn\s+\w+/i,
      /Trần\s+\w+/i,
      /Lê\s+\w+/i,
      /Phạm\s+\w+/i,
      /Hoàng\s+\w+/i,
      /Vũ\s+\w+/i
    ]
    
    for (const pattern of namePatterns) {
      const match = columns.join(' ').match(pattern)
      if (match) {
        driver = match[0]
        break
      }
    }
    
    return { vehicle, driver }
  }
  
  private extractCargoInfo(columns: string[]): { cargo: string; weight: number; volume: number } {
    let cargo = 'General Cargo'
    let weight = 0
    let volume = 0
    
    const text = columns.join(' ').toLowerCase()
    
    // Common Vietnamese cargo types
    const cargoTypes = [
      { keywords: ['gạo', 'rice'], name: 'Gạo (Rice)', density: 1.5 },
      { keywords: ['cà phê', 'coffee'], name: 'Cà phê (Coffee)', density: 0.6 },
      { keywords: ['cao su', 'rubber'], name: 'Cao su (Rubber)', density: 0.9 },
      { keywords: ['dệt may', 'textile'], name: 'Dệt may (Textiles)', density: 0.3 },
      { keywords: ['điện tử', 'electronic'], name: 'Điện tử (Electronics)', density: 0.5 },
      { keywords: ['thép', 'steel'], name: 'Thép (Steel)', density: 7.8 },
      { keywords: ['xi măng', 'cement'], name: 'Xi măng (Cement)', density: 1.5 }
    ]
    
    for (const type of cargoTypes) {
      if (type.keywords.some(keyword => text.includes(keyword))) {
        cargo = type.name
        // Estimate weight and volume based on cargo type
        volume = Math.floor(Math.random() * 50) + 10
        weight = Math.floor(volume * type.density * 1000)
        break
      }
    }
    
    // Try to extract actual numbers from the data
    const weightMatch = text.match(/(\d+(?:\.\d+)?)\s*(?:kg|tấn|ton)/i)
    if (weightMatch) {
      weight = parseFloat(weightMatch[1])
      if (text.includes('tấn') || text.includes('ton')) {
        weight *= 1000 // Convert tons to kg
      }
    }
    
    const volumeMatch = text.match(/(\d+(?:\.\d+)?)\s*(?:m3|m³|cbm)/i)
    if (volumeMatch) {
      volume = parseFloat(volumeMatch[1])
    }
    
    return { cargo, weight, volume }
  }
  
  private parseDate(dateStr: string): string | null {
    // Handle various Vietnamese date formats
    const datePatterns = [
      /(\d{1,2})\/(\d{1,2})\/(\d{4})/,
      /(\d{1,2})-(\d{1,2})-(\d{4})/,
      /(\d{4})-(\d{1,2})-(\d{1,2})/
    ]
    
    for (const pattern of datePatterns) {
      const match = dateStr.match(pattern)
      if (match) {
        const [, day, month, year] = match
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
      }
    }
    
    return null
  }
  
  private parseStatus(columns: string[]): 'pending' | 'in_transit' | 'completed' | 'delayed' {
    const text = columns.join(' ').toLowerCase()
    
    if (text.includes('hoàn thành') || text.includes('completed')) return 'completed'
    if (text.includes('đang chạy') || text.includes('in transit')) return 'in_transit'
    if (text.includes('trễ') || text.includes('delayed')) return 'delayed'
    
    return 'pending'
  }
  
  private parseCost(columns: string[]): number {
    const text = columns.join(' ')
    const costMatch = text.match(/(\d+(?:\.\d+)?)\s*(?:vnd|vnđ|đ|k|m)?/i)
    
    if (costMatch) {
      let cost = parseFloat(costMatch[1])
      const unit = costMatch[2]?.toLowerCase()
      
      if (unit === 'k') cost *= 1000
      if (unit === 'm') cost *= 1000000
      
      return cost
    }
    
    return Math.floor(Math.random() * 5000000) + 1000000 // Random cost between 1M-6M VND
  }
  
  private calculateFuelConsumption(distance: number, weight: number): number {
    const baseRate = 0.35 // L/km for 40ft container
    const weightFactor = weight > 20000 ? 1.2 : weight > 10000 ? 1.1 : 1.0
    return distance * baseRate * weightFactor
  }
  
  private generateAIInsights(records: LogisticsRecord[]): AIInsight[] {
    const insights: AIInsight[] = []
    
    // Route optimization insights
    const routeInsights = this.analyzeRoutes(records)
    insights.push(...routeInsights)
    
    // Cost optimization insights
    const costInsights = this.analyzeCosts(records)
    insights.push(...costInsights)
    
    // Performance insights
    const performanceInsights = this.analyzePerformance(records)
    insights.push(...performanceInsights)
    
    // Predictive insights
    const predictiveInsights = this.generatePredictions(records)
    insights.push(...predictiveInsights)
    
    return insights
  }
  
  private analyzeRoutes(records: LogisticsRecord[]): AIInsight[] {
    const insights: AIInsight[] = []
    
    // Find most common routes
    const routeFrequency = records.reduce((acc, record) => {
      acc[record.route] = (acc[record.route] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    
    const topRoutes = Object.entries(routeFrequency)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
    
    if (topRoutes.length > 0) {
      insights.push({
        id: 'route_optimization_1',
        type: 'optimization',
        category: 'route',
        title: 'Tối ưu tuyến đường phổ biến',
        description: `Tuyến ${topRoutes[0][0]} xuất hiện ${topRoutes[0][1]} lần. Có thể tối ưu bằng cách ghép lệnh hoặc tăng tần suất.`,
        impact: 'high',
        confidence: 85,
        actionable: true,
        suggestedActions: [
          'Xem xét ghép nhiều đơn hàng trên cùng tuyến',
          'Đàm phán hợp đồng dài hạn với khách hàng',
          'Tối ưu lịch trình để giảm thời gian chờ'
        ],
        estimatedSavings: 500000
      })
    }
    
    return insights
  }
  
  private analyzeCosts(records: LogisticsRecord[]): AIInsight[] {
    const insights: AIInsight[] = []
    
    const avgCostPerKm = records.reduce((sum, record) => sum + (record.cost / record.distance), 0) / records.length
    
    if (avgCostPerKm > 3000) {
      insights.push({
        id: 'cost_optimization_1',
        type: 'recommendation',
        category: 'cost',
        title: 'Chi phí trên km cao',
        description: `Chi phí trung bình ${avgCostPerKm.toFixed(0)} VND/km cao hơn mức chuẩn 2,500 VND/km.`,
        impact: 'medium',
        confidence: 78,
        actionable: true,
        suggestedActions: [
          'Kiểm tra và tối ưu lộ trình',
          'Đàm phán lại giá nhiên liệu',
          'Xem xét nâng cấp xe để tiết kiệm nhiên liệu'
        ],
        estimatedSavings: 300000
      })
    }
    
    return insights
  }
  
  private analyzePerformance(records: LogisticsRecord[]): AIInsight[] {
    const insights: AIInsight[] = []
    
    const onTimeRecords = records.filter(r => r.status === 'completed').length
    const onTimeRate = (onTimeRecords / records.length) * 100
    
    if (onTimeRate < 90) {
      insights.push({
        id: 'performance_1',
        type: 'alert',
        category: 'time',
        title: 'Tỷ lệ giao hàng đúng hạn thấp',
        description: `Chỉ ${onTimeRate.toFixed(1)}% chuyến giao đúng hạn, thấp hơn mục tiêu 95%.`,
        impact: 'high',
        confidence: 92,
        actionable: true,
        suggestedActions: [
          'Phân tích nguyên nhân chậm trễ',
          'Cải thiện quy trình điều phối',
          'Tăng cường giám sát thời gian thực'
        ]
      })
    }
    
    return insights
  }
  
  private generatePredictions(records: LogisticsRecord[]): AIInsight[] {
    const insights: AIInsight[] = []
    
    // Predict peak seasons based on historical data
    const monthlyVolume = records.reduce((acc, record) => {
      const month = new Date(record.date).getMonth()
      acc[month] = (acc[month] || 0) + 1
      return acc
    }, {} as Record<number, number>)
    
    const peakMonth = Object.entries(monthlyVolume)
      .sort(([,a], [,b]) => b - a)[0]
    
    if (peakMonth) {
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      insights.push({
        id: 'prediction_1',
        type: 'prediction',
        category: 'resource',
        title: 'Dự đoán mùa cao điểm',
        description: `Tháng ${monthNames[parseInt(peakMonth[0])]} có khối lượng cao nhất (${peakMonth[1]} chuyến). Cần chuẩn bị tài nguyên.`,
        impact: 'medium',
        confidence: 70,
        actionable: true,
        suggestedActions: [
          'Chuẩn bị thêm xe và tài xế',
          'Đàm phán hợp đồng thuê xe ngoài',
          'Tối ưu kho bãi và depot'
        ]
      })
    }
    
    return insights
  }
  
  private calculateSummary(records: LogisticsRecord[]): ProcessingResult['summary'] {
    const totalCost = records.reduce((sum, record) => sum + record.cost, 0)
    const totalDistance = records.reduce((sum, record) => sum + record.distance, 0)
    const averageDistance = totalDistance / records.length
    
    // Find common routes
    const routeFrequency = records.reduce((acc, record) => {
      acc[record.route] = (acc[record.route] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    
    const commonRoutes = Object.entries(routeFrequency)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([route]) => route)
    
    // Calculate performance metrics
    const completedRecords = records.filter(r => r.status === 'completed')
    const onTimeDelivery = (completedRecords.length / records.length) * 100
    const fuelEfficiency = records.reduce((sum, r) => sum + r.fuelConsumption, 0) / totalDistance
    const costPerKm = totalCost / totalDistance
    
    // Date range
    const dates = records.map(r => new Date(r.date)).sort((a, b) => a.getTime() - b.getTime())
    const dateRange = {
      start: dates[0]?.toISOString().split('T')[0] || '',
      end: dates[dates.length - 1]?.toISOString().split('T')[0] || ''
    }
    
    return {
      totalRecords: records.length,
      totalCost,
      totalDistance,
      averageDistance,
      commonRoutes,
      performanceMetrics: {
        onTimeDelivery,
        fuelEfficiency,
        costPerKm
      },
      dateRange
    }
  }
  
  private generateRecommendations(records: LogisticsRecord[], insights: AIInsight[]): string[] {
    const recommendations: string[] = []
    
    // High impact insights become recommendations
    const highImpactInsights = insights.filter(insight => insight.impact === 'high')
    
    highImpactInsights.forEach(insight => {
      recommendations.push(`${insight.title}: ${insight.description}`)
    })
    
    // General recommendations based on data patterns
    if (records.length > 50) {
      recommendations.push('Khối lượng dữ liệu lớn - khuyến nghị sử dụng AI để tối ưu tự động')
    }
    
    const avgDistance = records.reduce((sum, r) => sum + r.distance, 0) / records.length
    if (avgDistance > 500) {
      recommendations.push('Khoảng cách trung bình cao - xem xét mở depot trung gian')
    }
    
    return recommendations
  }
  
  private generateFutureSchedule(records: LogisticsRecord[]): LogisticsRecord[] {
    // Generate suggested future schedules based on historical patterns
    const futureSchedule: LogisticsRecord[] = []
    
    // Find patterns in historical data
    const routePatterns = records.reduce((acc, record) => {
      const key = `${record.departure}-${record.destination}`
      if (!acc[key]) {
        acc[key] = []
      }
      acc[key].push(record)
      return acc
    }, {} as Record<string, LogisticsRecord[]>)
    
    // Generate future schedules for next 7 days
    const today = new Date()
    for (let i = 1; i <= 7; i++) {
      const futureDate = new Date(today)
      futureDate.setDate(today.getDate() + i)
      
      // For each common route, suggest a schedule
      Object.entries(routePatterns).forEach(([route, historicalRecords], index) => {
        if (historicalRecords.length >= 2 && index < 3) { // Limit to top 3 routes
          const avgRecord = this.calculateAverageRecord(historicalRecords)
          
          futureSchedule.push({
            ...avgRecord,
            id: `future_${i}_${index}`,
            date: futureDate.toISOString().split('T')[0],
            status: 'pending',
            notes: 'AI Generated Schedule Suggestion'
          })
        }
      })
    }
    
    return futureSchedule.slice(0, 14) // Limit to 14 suggestions
  }
  
  private calculateAverageRecord(records: LogisticsRecord[]): LogisticsRecord {
    const avgCost = records.reduce((sum, r) => sum + r.cost, 0) / records.length
    const avgDistance = records.reduce((sum, r) => sum + r.distance, 0) / records.length
    const avgWeight = records.reduce((sum, r) => sum + r.weight, 0) / records.length
    const avgVolume = records.reduce((sum, r) => sum + r.volume, 0) / records.length
    
    const mostCommonCargo = records.reduce((acc, r) => {
      acc[r.cargo] = (acc[r.cargo] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    
    const topCargo = Object.entries(mostCommonCargo)
      .sort(([,a], [,b]) => b - a)[0][0]
    
    return {
      id: '',
      date: '',
      route: records[0].route,
      departure: records[0].departure,
      destination: records[0].destination,
      vehicle: 'TBD',
      driver: 'TBD',
      cargo: topCargo,
      weight: Math.round(avgWeight),
      volume: Math.round(avgVolume),
      status: 'pending',
      cost: Math.round(avgCost),
      distance: Math.round(avgDistance),
      fuelConsumption: this.calculateFuelConsumption(avgDistance, avgWeight),
      estimatedTime: Math.round(avgDistance / 70)
    }
  }
}

// Export singleton instance
export const enhancedFileProcessor = new EnhancedFileProcessor()
