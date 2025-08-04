/**
 * Advanced File Learning System
 * Processes Excel, PDF, and other files to extract logistics data
 * Integrates with AI optimization features
 */

import * as XLSX from 'xlsx'
import { KeyMetrics } from './ai-insights-generator'

export interface PdfProcessedData {
  text: string;
  pages: number;
  metadata: { [key: string]: any };
}

export interface CsvProcessedData {
  headers: string[];
  data: string[][];
  rowCount: number;
}

export interface FileData {
  id: string
  fileName: string
  fileType: string
  uploadDate: string
  processedData: LogisticsData | PdfProcessedData | CsvProcessedData
  insights: FileInsights
  status: 'processing' | 'completed' | 'error'
}

export interface FileInsights {
  summary: string
  keyMetrics: KeyMetrics
  recommendations: string[]
  dataStructure: DataStructure[]
  patterns: Pattern[]
}

export interface DataStructure {
  sheetName?: string
  columns: string[]
  rowCount: number
  dataTypes: { [column: string]: string }
}

export interface Pattern {
  type: 'trend' | 'seasonal' | 'anomaly' | 'correlation'
  description: string
  confidence: number
  data: any
}

export interface LogisticsData {
  shipments?: ShipmentData[]
  inventory?: InventoryData[]
  routes?: RouteData[]
  costs?: CostData[]
  performance?: PerformanceData[]
  [key: string]: any
}

export interface ShipmentData {
  id: string
  date: string
  origin: string
  destination: string
  weight: number
  cost: number
  status: string
  deliveryTime: number
}

export interface InventoryData {
  item: string
  quantity: number
  location: string
  cost: number
  reorderLevel: number
  supplier: string
}

export interface RouteData {
  routeId: string
  distance: number
  duration: number
  cost: number
  efficiency: number
  stops: string[]
}

export interface CostData {
  category: string
  amount: number
  date: string
  description: string
}

export interface PerformanceData {
  metric: string
  value: number
  target: number
  variance: number
  trend: 'up' | 'down' | 'stable'
}

/**
 * Main File Processor Class
 */
export class FileProcessor {
  private supportedTypes = [
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
    'application/vnd.ms-excel', // .xls
    'application/pdf',
    'text/csv',
    'application/json'
  ]

  /**
   * Process uploaded file and extract logistics data
   */
  async processFile(file: File): Promise<FileData> {
    const fileId = this.generateFileId()
    
    try {
      let processedData: any = {}
      let insights: FileInsights

      switch (file.type) {
        case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
        case 'application/vnd.ms-excel':
          processedData = await this.processExcelFile(file)
          insights = await this.generateExcelInsights(processedData)
          break
        case 'application/pdf':
          processedData = await this.processPDFFile(file)
          insights = await this.generatePDFInsights(processedData)
          break
        case 'text/csv':
          processedData = await this.processCSVFile(file)
          insights = await this.generateCSVInsights(processedData)
          break
        default:
          throw new Error(`Unsupported file type: ${file.type}`)
      }

      return {
        id: fileId,
        fileName: file.name,
        fileType: file.type,
        uploadDate: new Date().toISOString(),
        processedData,
        insights,
        status: 'completed'
      }
    } catch (error) {
      console.error('File processing error:', error)
      return {
        id: fileId,
        fileName: file.name,
        fileType: file.type,
        uploadDate: new Date().toISOString(),
        processedData: {},
        insights: this.generateErrorInsights(error as Error),
        status: 'error'
      }
    }
  }

  /**
   * Process Excel files (like the Vietnamese logistics plans)
   */
  private async processExcelFile(file: File): Promise<LogisticsData> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer)
          const workbook = XLSX.read(data, { type: 'array' })
          
          const result: any = {}
          
          workbook.SheetNames.forEach(sheetName => {
            const worksheet = workbook.Sheets[sheetName]
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 })
            
            // Process Vietnamese logistics data
            result[sheetName] = this.processVietnameseLogisticsData(jsonData as string[][], sheetName)
          })
          
          resolve(result)
        } catch (error) {
          reject(error)
        }
      }
      
      reader.onerror = () => reject(new Error('Failed to read file'))
      reader.readAsArrayBuffer(file)
    })
  }

  /**
   * Process Vietnamese logistics planning data
   */
  private processVietnameseLogisticsData(data: string[][], sheetName: string): LogisticsData {
    const logisticsData: LogisticsData = {
      shipments: [],
      inventory: [],
      routes: [],
      costs: [],
      performance: []
    }

    if (data.length < 2) return logisticsData

    const headers = data[0] as string[]
    const rows = data.slice(1)

    // Detect data type based on headers and content
    const dataType = this.detectVietnameseDataType(headers, sheetName)

    rows.forEach((row, index) => {
      if (row.length === 0) return

      switch (dataType) {
        case 'shipment':
          const shipment = this.parseShipmentData(headers, row, index)
          if (shipment) logisticsData.shipments?.push(shipment)
          break
        case 'inventory':
          const inventory = this.parseInventoryData(headers, row, index)
          if (inventory) logisticsData.inventory?.push(inventory)
          break
        case 'route':
          const route = this.parseRouteData(headers, row, index)
          if (route) logisticsData.routes?.push(route)
          break
        case 'cost':
          const cost = this.parseCostData(headers, row, index)
          if (cost) logisticsData.costs?.push(cost)
          break
        case 'performance':
          const performance = this.parsePerformanceData(headers, row, index)
          if (performance) logisticsData.performance?.push(performance)
          break
      }
    })

    return logisticsData
  }

  /**
   * Detect Vietnamese logistics data type
   */
  private detectVietnameseDataType(headers: string[], sheetName: string): string {
    const headerStr = headers.join(' ').toLowerCase()
    const sheetStr = sheetName.toLowerCase()

    // Vietnamese keywords for different data types
    if (headerStr.includes('giao hàng') || headerStr.includes('vận chuyển') || 
        headerStr.includes('đơn hàng') || sheetStr.includes('giao hàng')) {
      return 'shipment'
    }
    if (headerStr.includes('kho') || headerStr.includes('tồn kho') || 
        headerStr.includes('hàng hóa') || sheetStr.includes('kho')) {
      return 'inventory'
    }
    if (headerStr.includes('tuyến') || headerStr.includes('lộ trình') || 
        headerStr.includes('đường') || sheetStr.includes('tuyến')) {
      return 'route'
    }
    if (headerStr.includes('chi phí') || headerStr.includes('giá') || 
        headerStr.includes('tiền') || sheetStr.includes('chi phí')) {
      return 'cost'
    }
    if (headerStr.includes('hiệu suất') || headerStr.includes('kpi') || 
        headerStr.includes('chỉ số') || sheetStr.includes('hiệu suất')) {
      return 'performance'
    }

    return 'general'
  }

  /**
   * Parse shipment data from Vietnamese Excel
   */
  private parseShipmentData(headers: string[], row: string[], index: number): ShipmentData | null {
    try {
      return {
        id: `shipment_${index}`,
        date: this.extractDate(row, headers) || new Date().toISOString(),
        origin: this.extractValue(row, headers, ['điểm đi', 'nơi gửi', 'xuất phát']) || '',
        destination: this.extractValue(row, headers, ['điểm đến', 'nơi nhận', 'đích']) || '',
        weight: this.extractNumber(row, headers, ['trọng lượng', 'khối lượng', 'tải']) || 0,
        cost: this.extractNumber(row, headers, ['chi phí', 'giá', 'tiền']) || 0,
        status: this.extractValue(row, headers, ['trạng thái', 'tình trạng']) || 'pending',
        deliveryTime: this.extractNumber(row, headers, ['thời gian', 'ngày giao']) || 0
      }
    } catch (error) {
      return null
    }
  }

  /**
   * Parse inventory data from Vietnamese Excel
   */
  private parseInventoryData(headers: string[], row: string[], index: number): InventoryData | null {
    try {
      return {
        item: this.extractValue(row, headers, ['hàng hóa', 'sản phẩm', 'mặt hàng']) || `item_${index}`,
        quantity: this.extractNumber(row, headers, ['số lượng', 'tồn kho', 'sl']) || 0,
        location: this.extractValue(row, headers, ['kho', 'vị trí', 'địa điểm']) || '',
        cost: this.extractNumber(row, headers, ['giá', 'chi phí', 'tiền']) || 0,
        reorderLevel: this.extractNumber(row, headers, ['mức đặt lại', 'tối thiểu']) || 0,
        supplier: this.extractValue(row, headers, ['nhà cung cấp', 'supplier']) || ''
      }
    } catch (error) {
      return null
    }
  }

  /**
   * Parse route data from Vietnamese Excel
   */
  private parseRouteData(headers: string[], row: string[], index: number): RouteData | null {
    try {
      return {
        routeId: `route_${index}`,
        distance: this.extractNumber(row, headers, ['khoảng cách', 'km', 'distance']) || 0,
        duration: this.extractNumber(row, headers, ['thời gian', 'giờ', 'phút']) || 0,
        cost: this.extractNumber(row, headers, ['chi phí', 'giá', 'tiền']) || 0,
        efficiency: this.extractNumber(row, headers, ['hiệu suất', 'efficiency']) || 0,
        stops: this.extractArray(row, headers, ['điểm dừng', 'trạm']) || []
      }
    } catch (error) {
      return null
    }
  }

  /**
   * Parse cost data from Vietnamese Excel
   */
  private parseCostData(headers: string[], row: string[], index: number): CostData | null {
    try {
      return {
        category: this.extractValue(row, headers, ['loại', 'danh mục', 'category']) || 'general',
        amount: this.extractNumber(row, headers, ['số tiền', 'chi phí', 'giá']) || 0,
        date: this.extractDate(row, headers) || new Date().toISOString(),
        description: this.extractValue(row, headers, ['mô tả', 'ghi chú', 'description']) || ''
      }
    } catch (error) {
      return null
    }
  }

  /**
   * Parse performance data from Vietnamese Excel
   */
  private parsePerformanceData(headers: string[], row: string[], index: number): PerformanceData | null {
    try {
      const value = this.extractNumber(row, headers, ['giá trị', 'value', 'số']) || 0
      const target = this.extractNumber(row, headers, ['mục tiêu', 'target']) || 0
      
      return {
        metric: this.extractValue(row, headers, ['chỉ số', 'metric', 'kpi']) || `metric_${index}`,
        value,
        target,
        variance: target > 0 ? ((value - target) / target) * 100 : 0,
        trend: this.determineTrend(value, target)
      }
    } catch (error) {
      return null
    }
  }

  /**
   * Helper methods for data extraction
   */
  private extractValue(row: string[], headers: string[], keywords: string[]): string | null {
    for (const keyword of keywords) {
      const index = headers.findIndex(h => h.toLowerCase().includes(keyword.toLowerCase()))
      if (index !== -1 && row[index] !== undefined) {
        return String(row[index]).trim()
      }
    }
    return null
  }

  private extractNumber(row: string[], headers: string[], keywords: string[]): number | null {
    const value = this.extractValue(row, headers, keywords)
    if (value === null) return null
    
    const num = parseFloat(value.replace(/[^\d.-]/g, ''))
    return isNaN(num) ? null : num
  }

  private extractDate(row: string[], headers: string[]): string | null {
    const dateKeywords = ['ngày', 'date', 'thời gian', 'time']
    const value = this.extractValue(row, headers, dateKeywords)
    if (!value) return null
    
    try {
      const date = new Date(value)
      return isNaN(date.getTime()) ? null : date.toISOString()
    } catch {
      return null
    }
  }

  private extractArray(row: string[], headers: string[], keywords: string[]): string[] {
    const value = this.extractValue(row, headers, keywords)
    if (!value) return []
    
    return value.split(/[,;|]/).map(s => s.trim()).filter(s => s.length > 0)
  }

  private determineTrend(value: number, target: number): 'up' | 'down' | 'stable' {
    const variance = Math.abs(value - target) / Math.max(target, 1)
    if (variance < 0.05) return 'stable'
    return value > target ? 'up' : 'down'
  }

  /**
   * Generate insights from processed Excel data
   */
  private async generateExcelInsights(data: LogisticsData): Promise<FileInsights> {
    const aiGenerator = new (await import('./ai-insights-generator')).AIInsightsGenerator()
    
    // Convert processed data to LogisticsData format
    const logisticsData: LogisticsData = {
      shipments: [],
      inventory: [],
      routes: [],
      costs: [],
      performance: []
    }

    // Aggregate data from all sheets
    Object.keys(data).forEach(sheetName => {
      const sheetData = data[sheetName] as LogisticsData
      if (sheetData && typeof sheetData === 'object') {
        if (sheetData.shipments) logisticsData.shipments?.push(...sheetData.shipments)
        if (sheetData.inventory) logisticsData.inventory?.push(...sheetData.inventory)
        if (sheetData.routes) logisticsData.routes?.push(...sheetData.routes)
        if (sheetData.costs) logisticsData.costs?.push(...sheetData.costs)
        if (sheetData.performance) logisticsData.performance?.push(...sheetData.performance)
      }
    })

    // Generate comprehensive insights using AI
    return await aiGenerator.generateInsights(logisticsData, 'Excel File')
  }

  private getDataColumns(data: LogisticsData): string[] {
    const columns: string[] = []
    if (data.shipments?.length) columns.push('shipments')
    if (data.inventory?.length) columns.push('inventory')
    if (data.routes?.length) columns.push('routes')
    if (data.costs?.length) columns.push('costs')
    if (data.performance?.length) columns.push('performance')
    return columns
  }

  private getDataRowCount(data: LogisticsData): number {
    return (data.shipments?.length || 0) +
           (data.inventory?.length || 0) +
           (data.routes?.length || 0) +
           (data.costs?.length || 0) +
           (data.performance?.length || 0)
  }

  private getDataTypes(data: LogisticsData): { [column: string]: string } {
    const types: { [column: string]: string } = {}
    if (data.shipments?.length) types.shipments = 'ShipmentData[]'
    if (data.inventory?.length) types.inventory = 'InventoryData[]'
    if (data.routes?.length) types.routes = 'RouteData[]'
    if (data.costs?.length) types.costs = 'CostData[]'
    if (data.performance?.length) types.performance = 'PerformanceData[]'
    return types
  }

  private calculateSheetMetrics(data: LogisticsData): KeyMetrics {
    const metrics: any = {}

    if (data.shipments?.length) {
      metrics.totalShipments = data.shipments.length
      metrics.averageCost = data.shipments.reduce((sum, s) => sum + s.cost, 0) / data.shipments.length
      metrics.averageWeight = data.shipments.reduce((sum, s) => sum + s.weight, 0) / data.shipments.length
    }

    if (data.inventory?.length) {
      metrics.totalItems = data.inventory.length
      metrics.totalValue = data.inventory.reduce((sum, i) => sum + (i.quantity * i.cost), 0)
      metrics.lowStockItems = data.inventory.filter(i => i.quantity <= i.reorderLevel).length
    }

    if (data.routes?.length) {
      metrics.totalRoutes = data.routes.length
      metrics.averageDistance = data.routes.reduce((sum, r) => sum + r.distance, 0) / data.routes.length
      metrics.averageEfficiency = data.routes.reduce((sum, r) => sum + r.efficiency, 0) / data.routes.length
    }

    if (data.costs?.length) {
      metrics.totalCosts = data.costs.reduce((sum, c) => sum + c.amount, 0)
      metrics.costCategories = [...new Set(data.costs.map(c => c.category))].length
    }

    return metrics
  }

  private detectPatterns(data: LogisticsData, sheetName: string): Pattern[] {
    const patterns: Pattern[] = []

    // Detect cost trends
    if (data.costs?.length && data.costs.length > 5) {
      const sortedCosts = data.costs.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      const trend = this.analyzeTrend(sortedCosts.map(c => c.amount))
      
      patterns.push({
        type: 'trend',
        description: `Cost trend in ${sheetName}: ${trend.direction} with ${trend.strength}% confidence`,
        confidence: trend.strength / 100,
        data: { trend: trend.direction, values: sortedCosts.map(c => c.amount) }
      })
    }

    // Detect seasonal patterns in shipments
    if (data.shipments?.length && data.shipments.length > 10) {
      const monthlyData = this.groupByMonth(data.shipments)
      if (this.hasSeasonalPattern(monthlyData)) {
        patterns.push({
          type: 'seasonal',
          description: `Seasonal pattern detected in shipment data for ${sheetName}`,
          confidence: 0.75,
          data: monthlyData
        })
      }
    }

    return patterns
  }

  private analyzeTrend(values: number[]): { direction: string, strength: number } {
    if (values.length < 3) return { direction: 'stable', strength: 0 }

    const firstHalf = values.slice(0, Math.floor(values.length / 2))
    const secondHalf = values.slice(Math.floor(values.length / 2))

    const firstAvg = firstHalf.reduce((sum, v) => sum + v, 0) / firstHalf.length
    const secondAvg = secondHalf.reduce((sum, v) => sum + v, 0) / secondHalf.length

    const change = ((secondAvg - firstAvg) / firstAvg) * 100
    const strength = Math.min(Math.abs(change) * 2, 100)

    return {
      direction: Math.abs(change) < 5 ? 'stable' : change > 0 ? 'increasing' : 'decreasing',
      strength: Math.round(strength)
    }
  }

  private groupByMonth(shipments: ShipmentData[]): { [month: string]: number } {
    const monthly: { [month: string]: number } = {}
    
    shipments.forEach(shipment => {
      const month = new Date(shipment.date).toISOString().substring(0, 7) // YYYY-MM
      monthly[month] = (monthly[month] || 0) + 1
    })

    return monthly
  }

  private hasSeasonalPattern(monthlyData: { [month: string]: number }): boolean {
    const values = Object.values(monthlyData)
    if (values.length < 6) return false

    const avg = values.reduce((sum, v) => sum + v, 0) / values.length
    const variance = values.reduce((sum, v) => sum + Math.pow(v - avg, 2), 0) / values.length
    const stdDev = Math.sqrt(variance)

    return stdDev / avg > 0.3 // High coefficient of variation suggests seasonality
  }

  private generateSummary(insights: FileInsights): string {
    const totalSheets = insights.dataStructure.length
    const totalRows = insights.dataStructure.reduce((sum, ds) => sum + ds.rowCount, 0)
    const dataTypes = [...new Set(insights.dataStructure.flatMap(ds => Object.values(ds.dataTypes)))].length

    return `Processed ${totalSheets} sheet(s) containing ${totalRows} total records across ${dataTypes} different data types. ` +
           `Detected ${insights.patterns.length} significant patterns in the logistics data.`
  }

  private generateRecommendations(insights: FileInsights): string[] {
    const recommendations: string[] = []

    // Analyze patterns for recommendations
    insights.patterns.forEach(pattern => {
      switch (pattern.type) {
        case 'trend':
          if (pattern.data.trend === 'increasing' && pattern.description.includes('cost')) {
            recommendations.push('Cost optimization needed: Implement cost reduction strategies to control rising expenses')
          }
          break
        case 'seasonal':
          recommendations.push('Seasonal planning: Adjust inventory and capacity planning based on detected seasonal patterns')
          break
      }
    })

    // Analyze metrics for recommendations
    Object.values(insights.keyMetrics).forEach((metrics: KeyMetrics['overview'] & KeyMetrics['performance'] & KeyMetrics['costs'] & KeyMetrics['inventory'] & KeyMetrics['routes']) => {
      if (metrics.lowStockItems > 0) {
        recommendations.push(`Inventory alert: ${metrics.lowStockItems} items are below reorder level`)
      }
      if (metrics.avgEfficiency && metrics.avgEfficiency < 70) {
        recommendations.push('Route optimization: Average route efficiency is below optimal levels')
      }
    })

    if (recommendations.length === 0) {
      recommendations.push('Data quality is good. Continue monitoring key performance indicators.')
    }

    return recommendations
  }

  /**
   * Process PDF files
   */
  private async processPDFFile(file: File): Promise<PdfProcessedData> {
    // PDF processing would be implemented here
    // For now, return basic structure
    return {
      text: 'PDF processing not yet implemented',
      pages: 1,
      metadata: {}
    }
  }

  /**
   * Process CSV files
   */
  private async processCSVFile(file: File): Promise<CsvProcessedData> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      
      reader.onload = (e) => {
        try {
          const text = e.target?.result as string
          const lines = text.split('\n')
          const headers = lines[0].split(',')
          const data = lines.slice(1).map(line => line.split(','))
          
          resolve({ headers, data, rowCount: data.length })
        } catch (error) {
          reject(error)
        }
      }
      
      reader.onerror = () => reject(new Error('Failed to read CSV file'))
      reader.readAsText(file)
    })
  }

  private generatePDFInsights(data: PdfProcessedData): FileInsights {
    return {
      summary: 'PDF file processed successfully',
      keyMetrics: { 
        overview: { totalShipments: 0 },
        performance: { deliveryRate: 0 },
        costs: { avgCostPerKg: 0 },
        risks: {}
      },
      recommendations: ['PDF analysis capabilities will be enhanced in future updates'],
      dataStructure: [{ columns: ['text'], rowCount: 1, dataTypes: { text: 'string' } }],
      patterns: []
    }
  }

  private generateCSVInsights(data: CsvProcessedData): FileInsights {
    return {
      summary: `CSV file with ${data.headers.length} columns and ${data.rowCount} rows`,
      keyMetrics: { 
        overview: { totalShipments: data.rowCount },
        performance: { deliveryRate: 0 },
        costs: { avgCostPerKg: 0 },
        risks: {}
      },
      recommendations: ['CSV data ready for analysis'],
      dataStructure: [{ 
        columns: data.headers, 
        rowCount: data.rowCount, 
        dataTypes: data.headers.reduce((acc: any, h: string) => ({ ...acc, [h]: 'string' }), {})
      }],
      patterns: []
    }
  }

  private generateErrorInsights(error: Error): FileInsights {
    return {
      summary: `File processing failed: ${error.message}`,
      keyMetrics: {
        overview: { totalShipments: 0 },
        performance: { deliveryRate: 0 },
        costs: { avgCostPerKg: 0 },
        risks: {}
      },
      recommendations: ['Please check file format and try again'],
      dataStructure: [],
      patterns: []
    }
  }

  private generateFileId(): string {
    return `file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  /**
   * Check if file type is supported
   */
  isFileSupported(file: File): boolean {
    return this.supportedTypes.includes(file.type)
  }

  /**
   * Get supported file types for display
   */
  getSupportedTypes(): string[] {
    return ['.xlsx', '.xls', '.pdf', '.csv', '.json']
  }
}
