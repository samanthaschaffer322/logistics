// Enhanced File Processor with Vietnamese Logistics Knowledge
import * as XLSX from 'xlsx'

export interface LogisticsRecord {
  id: string
  date: string
  origin: string
  destination: string
  truckId?: string
  driver?: string
  cargo?: string
  weight?: number
  volume?: number
  status: 'pending' | 'in_transit' | 'completed' | 'delayed'
  cost?: number
  distance?: number
  fuelConsumption?: number
  scheduledTime?: string
  actualTime?: string
  notes?: string
}

export interface AIInsight {
  type: 'route_optimization' | 'schedule_optimization' | 'resource_optimization' | 'cost_optimization'
  title: string
  description: string
  impact: 'high' | 'medium' | 'low'
  recommendation: string
  confidence: number
}

export interface ProcessingResult {
  success: boolean
  totalRecords: number
  validRecords: number
  errors: string[]
  data: LogisticsRecord[]
  insights: AIInsight[]
  summary: {
    totalFiles: number
    totalRecords: number
    successRate: number
    processingTime: number
  }
}

class EnhancedFileProcessor {
  async processFile(file: File): Promise<ProcessingResult> {
    try {
      const data = await this.readExcelFile(file)
      const records = this.parseLogisticsData(data)
      const insights = this.generateInsights(records)
      
      return {
        success: true,
        totalRecords: data.length,
        validRecords: records.length,
        errors: [],
        data: records,
        insights,
        summary: {
          totalFiles: 1,
          totalRecords: records.length,
          successRate: (records.length / Math.max(data.length, 1)) * 100,
          processingTime: Date.now()
        }
      }
    } catch (error) {
      return {
        success: false,
        totalRecords: 0,
        validRecords: 0,
        errors: [`Failed to process ${file.name}: ${error}`],
        data: [],
        insights: [],
        summary: {
          totalFiles: 1,
          totalRecords: 0,
          successRate: 0,
          processingTime: Date.now()
        }
      }
    }
  }

  private async readExcelFile(file: File): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer)
          const workbook = XLSX.read(data, { type: 'array' })
          const sheetName = workbook.SheetNames[0]
          const worksheet = workbook.Sheets[sheetName]
          const jsonData = XLSX.utils.sheet_to_json(worksheet)
          resolve(jsonData)
        } catch (error) {
          reject(error)
        }
      }
      
      reader.onerror = () => reject(new Error('Failed to read file'))
      reader.readAsArrayBuffer(file)
    })
  }

  private parseLogisticsData(rawData: any[]): LogisticsRecord[] {
    const records: LogisticsRecord[] = []
    
    rawData.forEach((row, index) => {
      try {
        // Try to map common Vietnamese logistics column names
        const record: LogisticsRecord = {
          id: row['ID'] || row['Mã'] || row['STT'] || `RECORD_${index + 1}`,
          date: this.parseDate(row['Ngày'] || row['Date'] || row['Thời gian'] || new Date().toISOString()),
          origin: row['Điểm đi'] || row['Origin'] || row['Xuất phát'] || row['Từ'] || 'Unknown',
          destination: row['Điểm đến'] || row['Destination'] || row['Đến'] || row['Nơi đến'] || 'Unknown',
          truckId: row['Xe'] || row['Truck'] || row['Biển số'] || row['Vehicle'],
          driver: row['Tài xế'] || row['Driver'] || row['Lái xe'],
          cargo: row['Hàng hóa'] || row['Cargo'] || row['Loại hàng'] || row['Goods'],
          weight: this.parseNumber(row['Trọng lượng'] || row['Weight'] || row['Tải trọng']),
          volume: this.parseNumber(row['Thể tích'] || row['Volume'] || row['Khối lượng']),
          status: this.parseStatus(row['Trạng thái'] || row['Status'] || 'pending'),
          cost: this.parseNumber(row['Chi phí'] || row['Cost'] || row['Giá']),
          distance: this.parseNumber(row['Khoảng cách'] || row['Distance'] || row['Km']),
          scheduledTime: row['Giờ hẹn'] || row['Scheduled'] || row['Thời gian dự kiến'],
          notes: row['Ghi chú'] || row['Notes'] || row['Note']
        }
        
        records.push(record)
      } catch (error) {
        console.warn(`Failed to parse row ${index + 1}:`, error)
      }
    })
    
    return records
  }

  private parseDate(value: any): string {
    if (!value) return new Date().toISOString()
    
    try {
      // Handle Excel date numbers
      if (typeof value === 'number') {
        const date = new Date((value - 25569) * 86400 * 1000)
        return date.toISOString()
      }
      
      // Handle string dates
      const date = new Date(value)
      return isNaN(date.getTime()) ? new Date().toISOString() : date.toISOString()
    } catch {
      return new Date().toISOString()
    }
  }

  private parseNumber(value: any): number | undefined {
    if (value === null || value === undefined || value === '') return undefined
    
    const num = typeof value === 'string' ? 
      parseFloat(value.replace(/[^\d.-]/g, '')) : 
      Number(value)
    
    return isNaN(num) ? undefined : num
  }

  private parseStatus(value: any): 'pending' | 'in_transit' | 'completed' | 'delayed' {
    if (!value) return 'pending'
    
    const status = String(value).toLowerCase()
    
    if (status.includes('hoàn thành') || status.includes('completed') || status.includes('done')) {
      return 'completed'
    }
    if (status.includes('đang') || status.includes('transit') || status.includes('progress')) {
      return 'in_transit'
    }
    if (status.includes('trễ') || status.includes('delay') || status.includes('late')) {
      return 'delayed'
    }
    
    return 'pending'
  }

  private generateInsights(records: LogisticsRecord[]): AIInsight[] {
    const insights: AIInsight[] = []
    
    if (records.length === 0) return insights
    
    // Route frequency analysis
    const routeFrequency = records.reduce((acc, record) => {
      const route = `${record.origin} → ${record.destination}`
      acc[route] = (acc[route] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    
    const mostFrequentRoute = Object.entries(routeFrequency)
      .sort(([,a], [,b]) => b - a)[0]
    
    if (mostFrequentRoute && mostFrequentRoute[1] > 2) {
      insights.push({
        type: 'route_optimization',
        title: 'Frequent Route Detected',
        description: `Route "${mostFrequentRoute[0]}" appears ${mostFrequentRoute[1]} times in your data.`,
        impact: 'high',
        recommendation: 'Consider setting up a dedicated schedule for this route to optimize costs and efficiency.',
        confidence: 0.85
      })
    }
    
    // Cost analysis
    const costsWithData = records.filter(r => r.cost && r.distance).map(r => ({
      costPerKm: r.cost! / r.distance!,
      record: r
    }))
    
    if (costsWithData.length > 0) {
      const avgCostPerKm = costsWithData.reduce((sum, item) => sum + item.costPerKm, 0) / costsWithData.length
      const highCostRoutes = costsWithData.filter(item => item.costPerKm > avgCostPerKm * 1.2)
      
      if (highCostRoutes.length > 0) {
        insights.push({
          type: 'cost_optimization',
          title: 'High-Cost Routes Identified',
          description: `${highCostRoutes.length} routes have costs 20% above average (${avgCostPerKm.toFixed(0)} VND/km).`,
          impact: 'medium',
          recommendation: 'Review these routes for potential optimization or alternative paths.',
          confidence: 0.78
        })
      }
    }
    
    // Status analysis
    const statusCounts = records.reduce((acc, record) => {
      acc[record.status] = (acc[record.status] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    
    const delayedCount = statusCounts.delayed || 0
    const totalCount = records.length
    
    if (delayedCount > totalCount * 0.1) {
      insights.push({
        type: 'schedule_optimization',
        title: 'High Delay Rate Detected',
        description: `${delayedCount} out of ${totalCount} deliveries (${((delayedCount/totalCount)*100).toFixed(1)}%) are delayed.`,
        impact: 'high',
        recommendation: 'Review scheduling practices and consider adding buffer time to prevent delays.',
        confidence: 0.82
      })
    }
    
    // Truck utilization
    const truckUsage = records.reduce((acc, record) => {
      if (record.truckId) {
        acc[record.truckId] = (acc[record.truckId] || 0) + 1
      }
      return acc
    }, {} as Record<string, number>)
    
    const trucks = Object.keys(truckUsage)
    if (trucks.length > 0) {
      const avgUsage = Object.values(truckUsage).reduce((a, b) => a + b, 0) / trucks.length
      const underutilized = trucks.filter(truck => truckUsage[truck] < avgUsage * 0.7)
      
      if (underutilized.length > 0) {
        insights.push({
          type: 'resource_optimization',
          title: 'Underutilized Vehicles',
          description: `${underutilized.length} vehicles are used less than 70% of average capacity.`,
          impact: 'medium',
          recommendation: 'Consider redistributing routes or optimizing fleet size.',
          confidence: 0.75
        })
      }
    }
    
    return insights
  }

  async processFiles(files: File[]): Promise<ProcessingResult> {
    const results = await Promise.all(files.map(file => this.processFile(file)))
    
    return {
      success: results.every(r => r.success),
      totalRecords: results.reduce((sum, r) => sum + r.totalRecords, 0),
      validRecords: results.reduce((sum, r) => sum + r.validRecords, 0),
      errors: results.flatMap(r => r.errors),
      data: results.flatMap(r => r.data),
      insights: results.flatMap(r => r.insights),
      summary: {
        totalFiles: files.length,
        totalRecords: results.reduce((sum, r) => sum + r.totalRecords, 0),
        successRate: results.reduce((sum, r) => sum + r.validRecords, 0) / Math.max(results.reduce((sum, r) => sum + r.totalRecords, 0), 1) * 100,
        processingTime: Date.now()
      }
    }
  }
}

export const enhancedFileProcessor = new EnhancedFileProcessor()
