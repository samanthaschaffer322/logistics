import * as XLSX from 'xlsx'

export interface LogisticsRecord {
  id: string
  date: string
  route: string
  vehicle: string
  driver: string
  cargo: string
  destination: string
  status: string
  estimatedTime: string
  actualTime?: string
  cost: number
  distance?: number
  fuelConsumption?: number
  notes?: string
}

export interface AIInsight {
  type: 'optimization' | 'prediction' | 'recommendation' | 'alert'
  title: string
  description: string
  impact: 'high' | 'medium' | 'low'
  confidence: number
  category: 'route' | 'cost' | 'time' | 'resource' | 'safety'
  actionable: boolean
  suggestedActions?: string[]
}

export interface ProcessingResult {
  records: LogisticsRecord[]
  insights: AIInsight[]
  summary: {
    totalRecords: number
    dateRange: { start: string; end: string }
    totalCost: number
    averageDistance: number
    commonRoutes: string[]
    performanceMetrics: {
      onTimeDelivery: number
      costEfficiency: number
      routeOptimization: number
    }
  }
}

export class AIFileProcessor {
  private vietnameseRoutePatterns = [
    /tp\.?\s*h(ồ|o)\s*ch(í|i)\s*minh/i,
    /h(à|a)\s*n(ộ|o)i/i,
    /đ(à|a)\s*n(ẵ|a)ng/i,
    /c(ầ|a)n\s*th(ơ|o)/i,
    /h(ả|a)i\s*ph(ò|o)ng/i,
    /b(ì|i)nh\s*d(ư|u)(ơ|o)ng/i,
    /qu(ậ|a)ng\s*ninh/i,
    /nha\s*trang/i,
    /hu(ế|e)/i,
    /v(ũ|u)ng\s*t(à|a)u/i
  ]

  private vehiclePatterns = [
    /container\s*\d+ft/i,
    /xe\s*t(ả|a)i\s*\d+\s*t(ấ|a)n/i,
    /truck/i,
    /trailer/i,
    /van/i
  ]

  async processExcelFile(file: File): Promise<LogisticsRecord[]> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer)
          const workbook = XLSX.read(data, { type: 'array' })
          
          const records: LogisticsRecord[] = []
          
          // Process each worksheet
          workbook.SheetNames.forEach(sheetName => {
            const worksheet = workbook.Sheets[sheetName]
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 })
            
            // Skip header row and process data
            for (let i = 1; i < jsonData.length; i++) {
              const row = jsonData[i] as any[]
              if (row.length > 0 && row[0]) {
                const record = this.parseRowToRecord(row, i)
                if (record) {
                  records.push(record)
                }
              }
            }
          })
          
          resolve(records)
        } catch (error) {
          reject(error)
        }
      }
      
      reader.onerror = () => reject(new Error('Failed to read file'))
      reader.readAsArrayBuffer(file)
    })
  }

  private parseRowToRecord(row: any[], index: number): LogisticsRecord | null {
    try {
      // Flexible parsing for Vietnamese logistics data
      const record: LogisticsRecord = {
        id: `record_${Date.now()}_${index}`,
        date: this.parseDate(row[0]) || new Date().toISOString().split('T')[0],
        route: this.parseRoute(row) || 'Unknown Route',
        vehicle: this.parseVehicle(row) || 'Unknown Vehicle',
        driver: this.parseDriver(row) || 'Unknown Driver',
        cargo: this.parseCargo(row) || 'General Cargo',
        destination: this.parseDestination(row) || 'Unknown Destination',
        status: this.parseStatus(row) || 'Pending',
        estimatedTime: this.parseTime(row, 'estimated') || '00:00',
        actualTime: this.parseTime(row, 'actual'),
        cost: this.parseCost(row) || 0,
        distance: this.parseDistance(row),
        fuelConsumption: this.parseFuelConsumption(row),
        notes: this.parseNotes(row)
      }
      
      return record
    } catch (error) {
      console.warn(`Failed to parse row ${index}:`, error)
      return null
    }
  }

  private parseDate(value: any): string | null {
    if (!value) return null
    
    try {
      // Handle Excel date serial numbers
      if (typeof value === 'number') {
        const date = XLSX.SSF.parse_date_code(value)
        return `${date.y}-${String(date.m).padStart(2, '0')}-${String(date.d).padStart(2, '0')}`
      }
      
      // Handle string dates
      if (typeof value === 'string') {
        const date = new Date(value)
        if (!isNaN(date.getTime())) {
          return date.toISOString().split('T')[0]
        }
      }
    } catch (error) {
      console.warn('Date parsing error:', error)
    }
    
    return null
  }

  private parseRoute(row: any[]): string | null {
    // Look for route patterns in all columns
    for (const cell of row) {
      if (typeof cell === 'string') {
        for (const pattern of this.vietnameseRoutePatterns) {
          if (pattern.test(cell)) {
            return cell.trim()
          }
        }
        
        // Check for route indicators like "-", "->", "đến", "tới"
        if (cell.includes('-') || cell.includes('→') || cell.includes('đến') || cell.includes('tới')) {
          return cell.trim()
        }
      }
    }
    
    return null
  }

  private parseVehicle(row: any[]): string | null {
    for (const cell of row) {
      if (typeof cell === 'string') {
        for (const pattern of this.vehiclePatterns) {
          if (pattern.test(cell)) {
            return cell.trim()
          }
        }
      }
    }
    
    return null
  }

  private parseDriver(row: any[]): string | null {
    // Look for Vietnamese names (typically 2-4 words with Vietnamese characters)
    const namePattern = /^[A-ZÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ][a-zàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]+(\s+[A-ZÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ][a-zàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]+){1,3}$/
    
    for (const cell of row) {
      if (typeof cell === 'string' && namePattern.test(cell.trim())) {
        return cell.trim()
      }
    }
    
    return null
  }

  private parseCargo(row: any[]): string | null {
    const cargoKeywords = ['hàng', 'cargo', 'goods', 'sản phẩm', 'thực phẩm', 'điện tử', 'may mặc', 'nông sản']
    
    for (const cell of row) {
      if (typeof cell === 'string') {
        for (const keyword of cargoKeywords) {
          if (cell.toLowerCase().includes(keyword)) {
            return cell.trim()
          }
        }
      }
    }
    
    return null
  }

  private parseDestination(row: any[]): string | null {
    // Similar to route parsing but look for single locations
    for (const cell of row) {
      if (typeof cell === 'string') {
        for (const pattern of this.vietnameseRoutePatterns) {
          if (pattern.test(cell) && !cell.includes('-')) {
            return cell.trim()
          }
        }
      }
    }
    
    return null
  }

  private parseStatus(row: any[]): string | null {
    const statusKeywords = {
      'hoàn thành': 'Completed',
      'completed': 'Completed',
      'đang vận chuyển': 'In Transit',
      'in transit': 'In Transit',
      'chuẩn bị': 'Preparing',
      'preparing': 'Preparing',
      'pending': 'Pending',
      'delayed': 'Delayed',
      'trễ': 'Delayed'
    }
    
    for (const cell of row) {
      if (typeof cell === 'string') {
        const cellLower = cell.toLowerCase()
        for (const [keyword, status] of Object.entries(statusKeywords)) {
          if (cellLower.includes(keyword)) {
            return status
          }
        }
      }
    }
    
    return null
  }

  private parseTime(row: any[], type: 'estimated' | 'actual'): string | null {
    // Look for time patterns (HH:MM)
    const timePattern = /\d{1,2}:\d{2}/
    
    for (const cell of row) {
      if (typeof cell === 'string' && timePattern.test(cell)) {
        return cell.match(timePattern)?.[0] || null
      }
      
      // Handle Excel time serial numbers
      if (typeof cell === 'number' && cell < 1) {
        const hours = Math.floor(cell * 24)
        const minutes = Math.floor((cell * 24 * 60) % 60)
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
      }
    }
    
    return null
  }

  private parseCost(row: any[]): number | null {
    for (const cell of row) {
      if (typeof cell === 'number' && cell > 1000) {
        return cell
      }
      
      if (typeof cell === 'string') {
        // Remove Vietnamese currency symbols and parse
        const cleanedValue = cell.replace(/[^\d.,]/g, '').replace(/,/g, '')
        const numValue = parseFloat(cleanedValue)
        if (!isNaN(numValue) && numValue > 1000) {
          return numValue
        }
      }
    }
    
    return null
  }

  private parseDistance(row: any[]): number | null {
    for (const cell of row) {
      if (typeof cell === 'string' && cell.toLowerCase().includes('km')) {
        const match = cell.match(/(\d+(?:\.\d+)?)\s*km/i)
        if (match) {
          return parseFloat(match[1])
        }
      }
    }
    
    return null
  }

  private parseFuelConsumption(row: any[]): number | null {
    for (const cell of row) {
      if (typeof cell === 'string' && (cell.toLowerCase().includes('lít') || cell.toLowerCase().includes('liter'))) {
        const match = cell.match(/(\d+(?:\.\d+)?)\s*(lít|liter)/i)
        if (match) {
          return parseFloat(match[1])
        }
      }
    }
    
    return null
  }

  private parseNotes(row: any[]): string | null {
    // Look for the longest text field as notes
    let longestText = ''
    
    for (const cell of row) {
      if (typeof cell === 'string' && cell.length > longestText.length && cell.length > 20) {
        longestText = cell
      }
    }
    
    return longestText || null
  }

  generateAIInsights(records: LogisticsRecord[]): AIInsight[] {
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
    
    return insights.sort((a, b) => b.confidence - a.confidence)
  }

  private analyzeRoutes(records: LogisticsRecord[]): AIInsight[] {
    const insights: AIInsight[] = []
    const routeFrequency = new Map<string, number>()
    const routeCosts = new Map<string, number[]>()
    
    records.forEach(record => {
      routeFrequency.set(record.route, (routeFrequency.get(record.route) || 0) + 1)
      
      if (!routeCosts.has(record.route)) {
        routeCosts.set(record.route, [])
      }
      routeCosts.get(record.route)!.push(record.cost)
    })
    
    // Find most frequent routes
    const sortedRoutes = Array.from(routeFrequency.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
    
    if (sortedRoutes.length > 0) {
      insights.push({
        type: 'optimization',
        title: `Tối ưu tuyến đường phổ biến: ${sortedRoutes[0][0]}`,
        description: `Tuyến ${sortedRoutes[0][0]} được sử dụng ${sortedRoutes[0][1]} lần. Có thể tối ưu bằng cách consolidate shipments hoặc sử dụng xe lớn hơn.`,
        impact: 'high',
        confidence: 85,
        category: 'route',
        actionable: true,
        suggestedActions: [
          'Consolidate multiple shipments on this route',
          'Consider using larger vehicles',
          'Optimize departure times to avoid traffic'
        ]
      })
    }
    
    return insights
  }

  private analyzeCosts(records: LogisticsRecord[]): AIInsight[] {
    const insights: AIInsight[] = []
    const costs = records.map(r => r.cost).filter(c => c > 0)
    
    if (costs.length > 0) {
      const avgCost = costs.reduce((a, b) => a + b, 0) / costs.length
      const highCostRecords = records.filter(r => r.cost > avgCost * 1.5)
      
      if (highCostRecords.length > 0) {
        insights.push({
          type: 'alert',
          title: 'Chi phí cao bất thường',
          description: `Phát hiện ${highCostRecords.length} chuyến có chi phí cao hơn 50% so với trung bình (${avgCost.toLocaleString('vi-VN')} VNĐ).`,
          impact: 'medium',
          confidence: 78,
          category: 'cost',
          actionable: true,
          suggestedActions: [
            'Review high-cost shipments for optimization opportunities',
            'Negotiate better rates with carriers',
            'Consider alternative routes or methods'
          ]
        })
      }
    }
    
    return insights
  }

  private analyzePerformance(records: LogisticsRecord[]): AIInsight[] {
    const insights: AIInsight[] = []
    const completedRecords = records.filter(r => r.status === 'Completed' && r.actualTime && r.estimatedTime)
    
    if (completedRecords.length > 0) {
      let onTimeCount = 0
      
      completedRecords.forEach(record => {
        const estimated = this.timeToMinutes(record.estimatedTime)
        const actual = this.timeToMinutes(record.actualTime!)
        
        if (actual <= estimated + 30) { // 30 minutes tolerance
          onTimeCount++
        }
      })
      
      const onTimeRate = (onTimeCount / completedRecords.length) * 100
      
      insights.push({
        type: 'prediction',
        title: 'Hiệu suất giao hàng đúng giờ',
        description: `Tỷ lệ giao hàng đúng giờ hiện tại là ${onTimeRate.toFixed(1)}%. ${onTimeRate < 80 ? 'Cần cải thiện để đạt mục tiêu 80%.' : 'Hiệu suất tốt!'}`,
        impact: onTimeRate < 80 ? 'high' : 'low',
        confidence: 92,
        category: 'time',
        actionable: onTimeRate < 80,
        suggestedActions: onTimeRate < 80 ? [
          'Analyze delayed shipments for common patterns',
          'Adjust estimated delivery times',
          'Improve route planning and traffic analysis'
        ] : undefined
      })
    }
    
    return insights
  }

  private generatePredictions(records: LogisticsRecord[]): AIInsight[] {
    const insights: AIInsight[] = []
    
    // Seasonal demand prediction
    const monthlyVolume = new Map<string, number>()
    records.forEach(record => {
      const month = record.date.substring(0, 7) // YYYY-MM
      monthlyVolume.set(month, (monthlyVolume.get(month) || 0) + 1)
    })
    
    if (monthlyVolume.size >= 2) {
      const volumes = Array.from(monthlyVolume.values())
      const avgVolume = volumes.reduce((a, b) => a + b, 0) / volumes.length
      const lastVolume = volumes[volumes.length - 1]
      
      const trend = lastVolume > avgVolume * 1.1 ? 'tăng' : lastVolume < avgVolume * 0.9 ? 'giảm' : 'ổn định'
      
      insights.push({
        type: 'prediction',
        title: `Dự đoán xu hướng nhu cầu: ${trend}`,
        description: `Dựa trên dữ liệu lịch sử, nhu cầu vận chuyển đang có xu hướng ${trend}. Khối lượng trung bình: ${avgVolume.toFixed(0)} chuyến/tháng.`,
        impact: 'medium',
        confidence: 75,
        category: 'resource',
        actionable: true,
        suggestedActions: [
          trend === 'tăng' ? 'Prepare additional capacity' : 'Optimize resource allocation',
          'Review staffing levels',
          'Update demand forecasting models'
        ]
      })
    }
    
    return insights
  }

  private timeToMinutes(timeStr: string): number {
    const [hours, minutes] = timeStr.split(':').map(Number)
    return hours * 60 + minutes
  }

  async processMultipleFiles(files: File[]): Promise<ProcessingResult> {
    const allRecords: LogisticsRecord[] = []
    
    for (const file of files) {
      try {
        const records = await this.processExcelFile(file)
        allRecords.push(...records)
      } catch (error) {
        console.error(`Failed to process file ${file.name}:`, error)
      }
    }
    
    const insights = this.generateAIInsights(allRecords)
    const summary = this.generateSummary(allRecords)
    
    return {
      records: allRecords,
      insights,
      summary
    }
  }

  private generateSummary(records: LogisticsRecord[]) {
    const dates = records.map(r => r.date).filter(d => d).sort()
    const costs = records.map(r => r.cost).filter(c => c > 0)
    const distances = records.map(r => r.distance).filter(d => d && d > 0)
    
    const routeFrequency = new Map<string, number>()
    records.forEach(record => {
      routeFrequency.set(record.route, (routeFrequency.get(record.route) || 0) + 1)
    })
    
    const commonRoutes = Array.from(routeFrequency.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([route]) => route)
    
    const completedRecords = records.filter(r => r.status === 'Completed')
    const onTimeDelivery = completedRecords.length > 0 ? 
      (completedRecords.filter(r => r.actualTime && r.estimatedTime).length / completedRecords.length) * 100 : 0
    
    return {
      totalRecords: records.length,
      dateRange: {
        start: dates[0] || '',
        end: dates[dates.length - 1] || ''
      },
      totalCost: costs.reduce((a, b) => a + b, 0),
      averageDistance: distances.length > 0 ? distances.reduce((a, b) => a + b, 0) / distances.length : 0,
      commonRoutes,
      performanceMetrics: {
        onTimeDelivery,
        costEfficiency: 85, // Placeholder calculation
        routeOptimization: 78 // Placeholder calculation
      }
    }
  }
}

export const fileProcessor = new AIFileProcessor()
