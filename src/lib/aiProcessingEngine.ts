// AI Processing Engine for Logistics Data Analysis
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
  id: string
  type: 'optimization' | 'prediction' | 'recommendation' | 'alert'
  category: 'route' | 'cost' | 'time' | 'resource' | 'safety'
  title: string
  description: string
  impact: 'high' | 'medium' | 'low'
  confidence: number
  actionable: boolean
  suggestedActions?: string[]
  potential_savings?: number
  automation_level?: number
  staff_replacement_suggestion?: {
    current_role: string
    replacement_type: 'ai_automation' | 'process_optimization' | 'system_integration'
    estimated_efficiency_gain: number
    implementation_timeline: string
  }
}

export interface ProcessingResult {
  success: boolean
  totalRecords: number
  validRecords: number
  errors: string[]
  records: LogisticsRecord[] // Changed from 'data' to 'records'
  insights: AIInsight[]
  summary: {
    totalFiles: number
    totalRecords: number
    totalCost: number
    averageDistance: number
    successRate: number
    processingTime: number
    dataQuality: 'excellent' | 'good' | 'fair' | 'poor'
    patterns_detected: string[]
    automation_opportunities: number
    dateRange: {
      start: string
      end: string
    }
    commonRoutes: string[]
    performanceMetrics: {
      onTimeDelivery: number
      averageCost: number
      fuelEfficiency: number
    }
  }
  staff_analysis: {
    repetitive_tasks: string[]
    automation_candidates: string[]
    efficiency_improvements: string[]
    cost_reduction_potential: number
  }
  futureSchedule?: {
    id: string
    date: string
    route: string
    cargo: string
    weight: number
    cost: number
    notes?: string
  }[]
}

// Vietnamese logistics patterns and knowledge base
const VIETNAM_LOGISTICS_PATTERNS = {
  common_routes: [
    { from: 'TP.HCM', to: 'Hà Nội', avg_distance: 1720, avg_time: 28, frequency: 'high' },
    { from: 'TP.HCM', to: 'Đà Nẵng', avg_distance: 964, avg_time: 16, frequency: 'medium' },
    { from: 'Cái Mép', to: 'TP.HCM', avg_distance: 85, avg_time: 2, frequency: 'very_high' },
    { from: 'Biên Hòa', to: 'Cái Mép', avg_distance: 50, avg_time: 1.5, frequency: 'high' }
  ],
  cargo_types: [
    { name: 'Gạo', density: 1.5, value_per_kg: 25000, seasonality: 'harvest_dependent' },
    { name: 'Cà phê', density: 0.6, value_per_kg: 45000, seasonality: 'export_peak' },
    { name: 'Cao su', density: 0.9, value_per_kg: 35000, seasonality: 'stable' },
    { name: 'Dệt may', density: 0.3, value_per_kg: 150000, seasonality: 'order_based' },
    { name: 'Điện tử', density: 0.5, value_per_kg: 500000, seasonality: 'stable' }
  ],
  time_patterns: {
    rush_hours: ['06:00-09:00', '16:00-20:00'],
    optimal_departure: ['05:30', '09:30', '14:00', '21:30'],
    peak_seasons: ['Q4', 'Tet_period', 'harvest_season']
  },
  cost_benchmarks: {
    fuel_cost_per_km: 2650, // VND
    toll_cost_per_km: 2500, // VND
    driver_cost_per_hour: 50000, // VND
    maintenance_cost_per_km: 2000 // VND
  }
}

export class AIProcessingEngine {
  private processingCallbacks: ((progress: number, status: string) => void)[] = []

  onProgress(callback: (progress: number, status: string) => void) {
    this.processingCallbacks.push(callback)
  }

  private updateProgress(progress: number, status: string) {
    this.processingCallbacks.forEach(callback => callback(progress, status))
  }

  async processFiles(files: File[]): Promise<ProcessingResult> {
    this.updateProgress(0, 'Starting AI analysis...')
    
    try {
      const allRecords: LogisticsRecord[] = []
      const allErrors: string[] = []
      
      // Process each file
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        this.updateProgress(10 + (i * 30 / files.length), `Processing ${file.name}...`)
        
        try {
          const records = await this.processExcelFile(file)
          allRecords.push(...records)
        } catch (error) {
          allErrors.push(`Error processing ${file.name}: ${error}`)
        }
      }

      this.updateProgress(50, 'Analyzing patterns with AI...')
      
      // AI Analysis
      const insights = await this.generateAIInsights(allRecords)
      
      this.updateProgress(70, 'Generating staff analysis...')
      
      // Staff analysis
      const staffAnalysis = this.analyzeStaffReplacementOpportunities(allRecords, insights)
      
      this.updateProgress(85, 'Generating future schedule with AI...')
      
      // Generate AI future schedule
      const futureSchedule = this.generateFutureSchedule(allRecords)
      
      this.updateProgress(95, 'Finalizing analysis...')
      
      // Summary analysis
      const summary = this.generateSummary(allRecords, files.length)
      
      this.updateProgress(100, 'Analysis complete!')
      
      return {
        success: allErrors.length === 0,
        totalRecords: allRecords.length,
        validRecords: allRecords.filter(r => r.origin !== 'Unknown' && r.destination !== 'Unknown').length,
        errors: allErrors,
        records: allRecords, // Changed from 'data' to 'records'
        insights,
        summary,
        staff_analysis: staffAnalysis,
        futureSchedule
      }
    } catch (error) {
      throw new Error(`AI processing failed: ${error}`)
    }
  }

  private async processExcelFile(file: File): Promise<LogisticsRecord[]> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer)
          const workbook = XLSX.read(data, { type: 'array' })
          const sheetName = workbook.SheetNames[0]
          const worksheet = workbook.Sheets[sheetName]
          const jsonData = XLSX.utils.sheet_to_json(worksheet)
          
          const records = this.parseLogisticsData(jsonData, file.name)
          resolve(records)
        } catch (error) {
          reject(error)
        }
      }
      
      reader.onerror = () => reject(new Error('Failed to read file'))
      reader.readAsArrayBuffer(file)
    })
  }

  private parseLogisticsData(rawData: any[], fileName: string): LogisticsRecord[] {
    const records: LogisticsRecord[] = []
    
    rawData.forEach((row, index) => {
      try {
        // Enhanced Vietnamese column mapping
        const record: LogisticsRecord = {
          id: row['ID'] || row['Mã'] || row['STT'] || row['Số thứ tự'] || `${fileName}_${index + 1}`,
          date: this.parseDate(row['Ngày'] || row['Date'] || row['Thời gian'] || row['Ngày tháng'] || new Date().toISOString()),
          origin: this.parseLocation(row['Điểm đi'] || row['Origin'] || row['Xuất phát'] || row['Từ'] || row['Nơi đi'] || 'Unknown'),
          destination: this.parseLocation(row['Điểm đến'] || row['Destination'] || row['Đến'] || row['Nơi đến'] || row['Điểm giao'] || 'Unknown'),
          truckId: row['Xe'] || row['Truck'] || row['Biển số'] || row['Vehicle'] || row['Phương tiện'],
          driver: row['Tài xế'] || row['Driver'] || row['Lái xe'] || row['Người lái'],
          cargo: this.parseCargo(row['Hàng hóa'] || row['Cargo'] || row['Loại hàng'] || row['Goods'] || row['Sản phẩm']),
          weight: this.parseNumber(row['Trọng lượng'] || row['Weight'] || row['Tải trọng'] || row['Khối lượng']),
          volume: this.parseNumber(row['Thể tích'] || row['Volume'] || row['Dung tích']),
          status: this.parseStatus(row['Trạng thái'] || row['Status'] || row['Tình trạng'] || 'pending'),
          cost: this.parseNumber(row['Chi phí'] || row['Cost'] || row['Giá'] || row['Phí']),
          distance: this.parseNumber(row['Khoảng cách'] || row['Distance'] || row['Km'] || row['Quãng đường']),
          scheduledTime: row['Giờ hẹn'] || row['Scheduled'] || row['Thời gian dự kiến'] || row['Giờ giao'],
          actualTime: row['Giờ thực tế'] || row['Actual'] || row['Thời gian thực tế'],
          notes: row['Ghi chú'] || row['Notes'] || row['Note'] || row['Chú thích']
        }
        
        // Enhance record with AI predictions
        this.enhanceRecordWithAI(record)
        
        records.push(record)
      } catch (error) {
        console.warn(`Failed to parse row ${index + 1} in ${fileName}:`, error)
      }
    })
    
    return records
  }

  private parseLocation(value: any): string {
    if (!value || value === 'Unknown') return 'Unknown'
    
    const location = String(value).trim()
    
    // Normalize Vietnamese location names
    const locationMappings = {
      'hcm': 'TP.HCM',
      'ho chi minh': 'TP.HCM',
      'saigon': 'TP.HCM',
      'hanoi': 'Hà Nội',
      'ha noi': 'Hà Nội',
      'danang': 'Đà Nẵng',
      'da nang': 'Đà Nẵng',
      'cai mep': 'Cái Mép',
      'cat lai': 'Cát Lái',
      'bien hoa': 'Biên Hòa',
      'tan van': 'Tân Vạn'
    }
    
    const normalized = location.toLowerCase()
    for (const [key, value] of Object.entries(locationMappings)) {
      if (normalized.includes(key)) {
        return value
      }
    }
    
    return location
  }

  private parseCargo(value: any): string {
    if (!value) return 'General Cargo'
    
    const cargo = String(value).toLowerCase()
    
    // Map Vietnamese cargo types
    const cargoMappings = {
      'gạo': 'Gạo (Rice)',
      'rice': 'Gạo (Rice)',
      'cà phê': 'Cà phê (Coffee)',
      'coffee': 'Cà phê (Coffee)',
      'cao su': 'Cao su (Rubber)',
      'rubber': 'Cao su (Rubber)',
      'dệt may': 'Dệt may (Textiles)',
      'textile': 'Dệt may (Textiles)',
      'điện tử': 'Điện tử (Electronics)',
      'electronic': 'Điện tử (Electronics)',
      'thép': 'Thép (Steel)',
      'steel': 'Thép (Steel)',
      'xi măng': 'Xi măng (Cement)',
      'cement': 'Xi măng (Cement)'
    }
    
    for (const [key, value] of Object.entries(cargoMappings)) {
      if (cargo.includes(key)) {
        return value
      }
    }
    
    return String(value)
  }

  private parseDate(value: any): string {
    if (!value) return new Date().toISOString()
    
    try {
      // Handle Excel date numbers
      if (typeof value === 'number') {
        const date = new Date((value - 25569) * 86400 * 1000)
        return date.toISOString()
      }
      
      // Handle Vietnamese date formats
      const dateStr = String(value)
      const vietnameseDatePatterns = [
        /(\d{1,2})\/(\d{1,2})\/(\d{4})/,
        /(\d{1,2})-(\d{1,2})-(\d{4})/,
        /(\d{4})-(\d{1,2})-(\d{1,2})/,
        /(\d{1,2})\.(\d{1,2})\.(\d{4})/
      ]
      
      for (const pattern of vietnameseDatePatterns) {
        const match = dateStr.match(pattern)
        if (match) {
          const [, day, month, year] = match
          const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
          return date.toISOString()
        }
      }
      
      // Fallback to standard parsing
      const date = new Date(value)
      return isNaN(date.getTime()) ? new Date().toISOString() : date.toISOString()
    } catch {
      return new Date().toISOString()
    }
  }

  private parseNumber(value: any): number | undefined {
    if (value === null || value === undefined || value === '') return undefined
    
    // Handle Vietnamese number formats
    const numStr = String(value).replace(/[^\d.,]/g, '').replace(',', '.')
    const num = parseFloat(numStr)
    
    return isNaN(num) ? undefined : num
  }

  private parseStatus(value: any): 'pending' | 'in_transit' | 'completed' | 'delayed' {
    if (!value) return 'pending'
    
    const status = String(value).toLowerCase()
    
    // Vietnamese status mappings
    if (status.includes('hoàn thành') || status.includes('completed') || status.includes('xong')) {
      return 'completed'
    }
    if (status.includes('đang') || status.includes('transit') || status.includes('chạy')) {
      return 'in_transit'
    }
    if (status.includes('trễ') || status.includes('delay') || status.includes('chậm')) {
      return 'delayed'
    }
    
    return 'pending'
  }

  private enhanceRecordWithAI(record: LogisticsRecord): void {
    // AI-enhanced distance calculation if missing
    if (!record.distance && record.origin !== 'Unknown' && record.destination !== 'Unknown') {
      const route = VIETNAM_LOGISTICS_PATTERNS.common_routes.find(r => 
        (r.from === record.origin && r.to === record.destination) ||
        (r.to === record.origin && r.from === record.destination)
      )
      if (route) {
        record.distance = route.avg_distance
      }
    }

    // AI-enhanced cost calculation if missing
    if (!record.cost && record.distance) {
      const estimatedCost = record.distance * (
        VIETNAM_LOGISTICS_PATTERNS.cost_benchmarks.fuel_cost_per_km +
        VIETNAM_LOGISTICS_PATTERNS.cost_benchmarks.toll_cost_per_km +
        VIETNAM_LOGISTICS_PATTERNS.cost_benchmarks.maintenance_cost_per_km
      )
      record.cost = Math.round(estimatedCost)
    }

    // AI-enhanced fuel consumption if missing
    if (!record.fuelConsumption && record.distance) {
      record.fuelConsumption = (record.distance * 35) / 100 // 35L/100km for 40ft truck
    }
  }

  private async generateAIInsights(records: LogisticsRecord[]): Promise<AIInsight[]> {
    const insights: AIInsight[] = []
    
    if (records.length === 0) return insights
    
    // Route optimization insights
    insights.push(...this.analyzeRouteOptimization(records))
    
    // Schedule optimization insights
    insights.push(...this.analyzeScheduleOptimization(records))
    
    // Resource optimization insights
    insights.push(...this.analyzeResourceOptimization(records))
    
    // Cost optimization insights
    insights.push(...this.analyzeCostOptimization(records))
    
    // Staff replacement insights
    insights.push(...this.analyzeStaffReplacementOpportunities(records))
    
    return insights
  }

  private analyzeRouteOptimization(records: LogisticsRecord[]): AIInsight[] {
    const insights: AIInsight[] = []
    
    // Route frequency analysis
    const routeFrequency = records.reduce((acc, record) => {
      const route = `${record.origin} → ${record.destination}`
      acc[route] = (acc[route] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    
    const topRoutes = Object.entries(routeFrequency)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
    
    topRoutes.forEach(([route, frequency], index) => {
      if (frequency > 2) {
        insights.push({
          id: `route_opt_${index}`,
          type: 'optimization',
          category: 'route',
          title: `High-Frequency Route Detected: ${route}`,
          description: `This route appears ${frequency} times in your data, representing ${((frequency / records.length) * 100).toFixed(1)}% of all shipments.`,
          impact: frequency > 10 ? 'high' : frequency > 5 ? 'medium' : 'low',
          confidence: 0.85,
          actionable: true,
          suggestedActions: [
            'Establish a dedicated schedule for this route',
            'Consolidate shipments to reduce costs by 15-25%',
            'Consider using larger vehicles for better efficiency',
            'Negotiate better rates with frequent customers'
          ],
          potential_savings: frequency * 500000, // VND
          automation_level: 80
        })
      }
    })
    
    return insights
  }

  private analyzeScheduleOptimization(records: LogisticsRecord[]): AIInsight[] {
    const insights: AIInsight[] = []
    
    // Time pattern analysis
    const timePatterns = records.reduce((acc, record) => {
      if (record.scheduledTime) {
        const hour = new Date(record.scheduledTime).getHours()
        const timeSlot = hour < 6 ? 'early_morning' : 
                      hour < 12 ? 'morning' : 
                      hour < 18 ? 'afternoon' : 'evening'
        acc[timeSlot] = (acc[timeSlot] || 0) + 1
      }
      return acc
    }, {} as Record<string, number>)
    
    const peakTime = Object.entries(timePatterns)
      .sort(([,a], [,b]) => b - a)[0]
    
    if (peakTime && peakTime[1] > records.length * 0.4) {
      insights.push({
        id: 'schedule_opt_1',
        type: 'schedule_optimization',
        title: 'Schedule Concentration Detected',
        description: `${((peakTime[1] / records.length) * 100).toFixed(1)}% of shipments are scheduled in the ${peakTime[0].replace('_', ' ')}.`,
        impact: 'medium',
        recommendation: 'Distribute shipments more evenly throughout the day to reduce congestion and improve efficiency.',
        confidence: 0.78,
        potential_savings: peakTime[1] * 200000,
        automation_level: 90,
        staff_replacement_suggestion: {
          current_role: 'Schedule Coordinator',
          replacement_type: 'ai_automation',
          estimated_efficiency_gain: 60,
          implementation_timeline: '2-3 months'
        }
      })
    }
    
    return insights
  }

  private analyzeResourceOptimization(records: LogisticsRecord[]): AIInsight[] {
    const insights: AIInsight[] = []
    
    // Truck utilization analysis
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
          id: 'resource_opt_1',
          type: 'resource_optimization',
          title: 'Underutilized Vehicles Detected',
          description: `${underutilized.length} vehicles (${underutilized.join(', ')}) are used less than 70% of average capacity.`,
          impact: 'high',
          recommendation: 'Consider redistributing routes, selling underutilized vehicles, or using them for backup/maintenance rotation.',
          confidence: 0.82,
          potential_savings: underutilized.length * 2000000,
          automation_level: 70,
          staff_replacement_suggestion: {
            current_role: 'Fleet Manager',
            replacement_type: 'system_integration',
            estimated_efficiency_gain: 45,
            implementation_timeline: '1-2 months'
          }
        })
      }
    }
    
    return insights
  }

  private analyzeCostOptimization(records: LogisticsRecord[]): AIInsight[] {
    const insights: AIInsight[] = []
    
    // Cost per km analysis
    const costsWithDistance = records.filter(r => r.cost && r.distance && r.distance > 0)
    
    if (costsWithDistance.length > 0) {
      const costPerKm = costsWithDistance.map(r => r.cost! / r.distance!)
      const avgCostPerKm = costPerKm.reduce((a, b) => a + b, 0) / costPerKm.length
      const benchmark = VIETNAM_LOGISTICS_PATTERNS.cost_benchmarks.fuel_cost_per_km + 
                      VIETNAM_LOGISTICS_PATTERNS.cost_benchmarks.toll_cost_per_km + 
                      VIETNAM_LOGISTICS_PATTERNS.cost_benchmarks.maintenance_cost_per_km
      
      if (avgCostPerKm > benchmark * 1.2) {
        insights.push({
          id: 'cost_opt_1',
          type: 'cost_optimization',
          title: 'High Operating Costs Detected',
          description: `Average cost per km (${avgCostPerKm.toFixed(0)} VND) is ${(((avgCostPerKm / benchmark) - 1) * 100).toFixed(1)}% above industry benchmark.`,
          impact: 'high',
          recommendation: 'Review fuel efficiency, negotiate better toll rates, optimize maintenance schedules, and consider route consolidation.',
          confidence: 0.88,
          potential_savings: records.length * (avgCostPerKm - benchmark) * 100,
          automation_level: 85
        })
      }
    }
    
    return insights
  }

  private analyzeStaffReplacementOpportunities(records: LogisticsRecord[]): AIInsight[] {
    const insights: AIInsight[] = []
    
    // Identify repetitive tasks that can be automated
    const repetitiveTasks = this.identifyRepetitiveTasks(records)
    
    if (repetitiveTasks.length > 0) {
      insights.push({
        id: 'staff_replacement_1',
        type: 'optimization',
        category: 'resource',
        title: 'Automation Opportunities Identified',
        description: `${repetitiveTasks.length} repetitive tasks detected that can be automated, potentially replacing 1-2 staff members.`,
        impact: 'high',
        confidence: 92,
        actionable: true,
        suggestedActions: [
          'Implement AI-driven automation for data entry',
          'Automate route planning and optimization',
          'Set up automatic status tracking',
          'Deploy automated report generation'
        ],
        potential_savings: 24000000, // 2 staff * 12M VND/year
        automation_level: 95,
        staff_replacement_suggestion: {
          current_role: 'Data Entry Clerk / Route Planner',
          replacement_type: 'ai_automation',
          estimated_efficiency_gain: 75,
          implementation_timeline: '3-4 months'
        }
      })
    }
    
    return insights
  }

  private identifyRepetitiveTasks(records: LogisticsRecord[]): string[] {
    const tasks: string[] = []
    
    // Check for data entry patterns
    const dataEntryPatterns = records.filter(r => 
      r.origin !== 'Unknown' && 
      r.destination !== 'Unknown' && 
      r.truckId && 
      r.driver
    ).length
    
    if (dataEntryPatterns > records.length * 0.8) {
      tasks.push('Manual data entry for shipment records')
    }
    
    // Check for route planning patterns
    const routePlanningPatterns = records.filter(r => r.distance && r.cost).length
    
    if (routePlanningPatterns > records.length * 0.6) {
      tasks.push('Manual route planning and cost calculation')
    }
    
    // Check for status tracking patterns
    const statusTrackingPatterns = records.filter(r => r.status !== 'pending').length
    
    if (statusTrackingPatterns > records.length * 0.5) {
      tasks.push('Manual status tracking and updates')
    }
    
    return tasks
  }

  private analyzeStaffReplacementOpportunities(records: LogisticsRecord[], insights: AIInsight[]): {
    repetitive_tasks: string[]
    automation_candidates: string[]
    efficiency_improvements: string[]
    cost_reduction_potential: number
  } {
    const repetitiveTasks = this.identifyRepetitiveTasks(records)
    
    const automationCandidates = [
      'Data entry and validation',
      'Route optimization calculations',
      'Cost estimation and billing',
      'Status tracking and notifications',
      'Report generation',
      'Schedule coordination'
    ]
    
    const efficiencyImprovements = [
      'Reduce data entry time by 80%',
      'Automate route optimization saving 4 hours/day',
      'Eliminate manual cost calculations',
      'Real-time status updates without human intervention',
      'Automated report generation saving 2 hours/day'
    ]
    
    // Safely calculate cost reduction potential
    const costReductionPotential = insights && Array.isArray(insights)
      ? insights
          .filter(i => i && typeof i.potential_savings === 'number')
          .reduce((sum, i) => sum + (i.potential_savings || 0), 0)
      : 0
    
    return {
      repetitive_tasks: repetitiveTasks,
      automation_candidates: automationCandidates,
      efficiency_improvements: efficiencyImprovements,
      cost_reduction_potential: costReductionPotential
    }
  }

  // Method to process the sample file
  async processSampleFile(filePath: string): Promise<ProcessingResult> {
    try {
      // For the sample file, we'll create mock data that represents what would be extracted
      const mockRecords: LogisticsRecord[] = [
        {
          id: 'KH-001',
          date: '2025-01-07',
          origin: 'TP.HCM',
          destination: 'Hà Nội',
          truckId: '51A-12345',
          driver: 'Nguyễn Văn A',
          cargo: 'Điện tử',
          weight: 15000,
          status: 'completed',
          cost: 25000000,
          distance: 1720,
          scheduledTime: '06:00',
          actualTime: '06:15',
          notes: 'Giao hàng đúng hẹn'
        },
        {
          id: 'KH-002',
          date: '2025-01-07',
          origin: 'Cái Mép',
          destination: 'TP.HCM',
          truckId: '29B-67890',
          driver: 'Trần Thị B',
          cargo: 'Container',
          weight: 20000,
          status: 'completed',
          cost: 8500000,
          distance: 85,
          scheduledTime: '08:00',
          actualTime: '07:45',
          notes: 'Sớm hơn dự kiến'
        },
        {
          id: 'KH-003',
          date: '2025-01-07',
          origin: 'Biên Hòa',
          destination: 'Đà Nẵng',
          truckId: '43C-11111',
          driver: 'Lê Văn C',
          cargo: 'Dệt may',
          weight: 12000,
          status: 'in_transit',
          cost: 18000000,
          distance: 964,
          scheduledTime: '14:00',
          actualTime: '14:30',
          notes: 'Đang vận chuyển'
        }
      ]

      // Generate insights for the sample data
      const insights = await this.generateAIInsights(mockRecords)
      
      // Generate staff analysis
      const staffAnalysis = this.analyzeStaffReplacementOpportunities(mockRecords, insights)
      
      // Generate future schedule
      const futureSchedule = this.generateFutureSchedule(mockRecords)
      
      // Generate summary
      const summary = this.generateSummary(mockRecords, 1)

      return {
        success: true,
        totalRecords: mockRecords.length,
        validRecords: mockRecords.length,
        errors: [],
        records: mockRecords,
        insights,
        summary,
        staff_analysis: staffAnalysis,
        futureSchedule
      }
    } catch (error) {
      throw new Error(`Failed to process sample file: ${error}`)
    }
  }

  private generateFutureSchedule(records: LogisticsRecord[]): ProcessingResult['futureSchedule'] {
    if (records.length === 0) return []
    
    const futureSchedule = []
    const today = new Date()
    
    // Analyze patterns from historical data
    const routeFrequency = records.reduce((acc, record) => {
      const route = `${record.origin} → ${record.destination}`
      acc[route] = (acc[route] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    
    const cargoTypes = records.reduce((acc, record) => {
      if (record.cargo) {
        acc[record.cargo] = (acc[record.cargo] || 0) + 1
      }
      return acc
    }, {} as Record<string, number>)
    
    const topRoutes = Object.entries(routeFrequency)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
    
    const topCargo = Object.entries(cargoTypes)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
    
    // Generate 7 days of future schedule
    for (let i = 1; i <= 7; i++) {
      const futureDate = new Date(today)
      futureDate.setDate(today.getDate() + i)
      
      // Select route based on frequency and day pattern
      const selectedRoute = topRoutes[i % topRoutes.length]
      const selectedCargo = topCargo[i % topCargo.length]
      
      if (selectedRoute && selectedCargo) {
        // Calculate estimated cost based on historical data
        const similarRecords = records.filter(r => 
          r.cargo === selectedCargo[0] && 
          `${r.origin} → ${r.destination}` === selectedRoute[0]
        )
        
        const avgCost = similarRecords.length > 0 
          ? similarRecords.reduce((sum, r) => sum + (r.cost || 0), 0) / similarRecords.length
          : 2000000 // Default estimate
        
        const avgWeight = similarRecords.length > 0
          ? similarRecords.reduce((sum, r) => sum + (r.weight || 0), 0) / similarRecords.length
          : 15000 // Default 15 tons
        
        futureSchedule.push({
          id: `future_${i}`,
          date: futureDate.toLocaleDateString('vi-VN'),
          route: selectedRoute[0],
          cargo: selectedCargo[0],
          weight: Math.round(avgWeight),
          cost: Math.round(avgCost),
          notes: `AI prediction based on ${selectedRoute[1]} similar trips`
        })
      }
    }
    
    return futureSchedule
  }
  private generateSummary(records: LogisticsRecord[], fileCount: number): ProcessingResult['summary'] {
    const validRecords = records.filter(r => r.origin !== 'Unknown' && r.destination !== 'Unknown')
    const successRate = (validRecords.length / Math.max(records.length, 1)) * 100
    
    // Calculate total cost and average distance
    const recordsWithCost = records.filter(r => r.cost && r.cost > 0)
    const totalCost = recordsWithCost.reduce((sum, r) => sum + (r.cost || 0), 0)
    const averageCost = recordsWithCost.length > 0 ? totalCost / recordsWithCost.length : 0
    
    const recordsWithDistance = records.filter(r => r.distance && r.distance > 0)
    const averageDistance = recordsWithDistance.length > 0 
      ? recordsWithDistance.reduce((sum, r) => sum + (r.distance || 0), 0) / recordsWithDistance.length
      : 0
    
    // Date range analysis
    const dates = records.map(r => new Date(r.date)).filter(d => !isNaN(d.getTime()))
    const startDate = dates.length > 0 ? new Date(Math.min(...dates.map(d => d.getTime()))) : new Date()
    const endDate = dates.length > 0 ? new Date(Math.max(...dates.map(d => d.getTime()))) : new Date()
    
    // Data quality assessment
    let dataQuality: 'excellent' | 'good' | 'fair' | 'poor' = 'poor'
    if (successRate >= 90) dataQuality = 'excellent'
    else if (successRate >= 75) dataQuality = 'good'
    else if (successRate >= 50) dataQuality = 'fair'
    
    // Pattern detection
    const patternsDetected = []
    
    // Route patterns
    const routeFrequency = records.reduce((acc, record) => {
      const route = `${record.origin} → ${record.destination}`
      acc[route] = (acc[route] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    
    const frequentRoutes = Object.entries(routeFrequency).filter(([, freq]) => freq > 2).length
    if (frequentRoutes > 0) {
      patternsDetected.push(`${frequentRoutes} frequent routes identified`)
    }
    
    // Time patterns
    const timePatterns = records.filter(r => r.scheduledTime).length
    if (timePatterns > records.length * 0.5) {
      patternsDetected.push('Consistent scheduling patterns detected')
    }
    
    // Cost patterns
    const costPatterns = records.filter(r => r.cost).length
    if (costPatterns > records.length * 0.7) {
      patternsDetected.push('Comprehensive cost tracking detected')
    }
    
    // Common routes
    const commonRoutes = Object.entries(routeFrequency)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([route]) => route)
    
    // Performance metrics
    const completedRecords = records.filter(r => r.status === 'completed')
    const onTimeDelivery = completedRecords.length > 0 
      ? (completedRecords.length / records.length) * 100 
      : 85 // Default assumption
    
    const recordsWithFuel = records.filter(r => r.fuelConsumption && r.distance)
    const fuelEfficiency = recordsWithFuel.length > 0
      ? recordsWithFuel.reduce((sum, r) => sum + ((r.fuelConsumption || 0) / (r.distance || 1)), 0) / recordsWithFuel.length
      : 35 // Default 35L/100km
    
    // Automation opportunities
    const automationOpportunities = Math.min(10, Math.floor(records.length / 10))
    
    return {
      totalFiles: fileCount,
      totalRecords: records.length,
      totalCost,
      averageDistance,
      successRate: Math.round(successRate),
      processingTime: Date.now(),
      dataQuality,
      patterns_detected: patternsDetected,
      automation_opportunities: automationOpportunities,
      dateRange: {
        start: startDate.toLocaleDateString('vi-VN'),
        end: endDate.toLocaleDateString('vi-VN')
      },
      commonRoutes,
      performanceMetrics: {
        onTimeDelivery: Math.round(onTimeDelivery),
        averageCost: Math.round(averageCost),
        fuelEfficiency: Math.round(fuelEfficiency * 100) / 100
      }
    }
  }
}

// Export singleton instance
export const aiProcessingEngine = new AIProcessingEngine()
