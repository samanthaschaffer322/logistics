'use client'

export interface FleetVehicle {
  id: string
  name: string
  type: 'container_40ft' | 'container_20ft' | 'flatbed' | 'refrigerated' | 'tanker'
  status: 'active' | 'maintenance' | 'idle' | 'emergency'
  location: {
    lat: number
    lng: number
    address: string
    timestamp: Date
  }
  driver: {
    name: string
    license: string
    phone: string
    experience: number
  }
  route: {
    from: string
    to: string
    distance: number
    estimatedTime: number
    progress: number
  }
  performance: {
    fuel: number
    speed: number
    efficiency: number
    temperature?: number
    mileage: number
  }
  maintenance: {
    lastService: Date
    nextService: Date
    issues: string[]
    cost: number
  }
  cargo: {
    type: string
    weight: number
    value: number
    hazardous: boolean
  }
}

export interface FleetOperation {
  id: string
  type: 'delivery' | 'pickup' | 'transfer' | 'maintenance' | 'emergency'
  priority: 'critical' | 'high' | 'medium' | 'low'
  status: 'pending' | 'in_progress' | 'completed' | 'delayed' | 'cancelled'
  vehicleId: string
  route: {
    origin: string
    destination: string
    waypoints: string[]
    distance: number
    estimatedTime: number
    actualTime?: number
  }
  cargo: {
    description: string
    weight: number
    volume: number
    value: number
    specialRequirements: string[]
  }
  timeline: {
    created: Date
    started?: Date
    completed?: Date
    estimatedCompletion: Date
  }
  cost: {
    fuel: number
    driver: number
    maintenance: number
    tolls: number
    total: number
  }
  aiRecommendations: string[]
}

export interface FleetAnalytics {
  totalVehicles: number
  activeVehicles: number
  utilizationRate: number
  averageEfficiency: number
  totalOperations: number
  completedOperations: number
  onTimeDeliveryRate: number
  totalCost: number
  fuelConsumption: number
  maintenanceCost: number
  insights: FleetInsight[]
}

export interface FleetInsight {
  type: 'efficiency' | 'cost' | 'maintenance' | 'route' | 'driver' | 'fuel'
  title: string
  description: string
  impact: 'high' | 'medium' | 'low'
  recommendation: string
  potentialSavings?: number
  affectedVehicles: string[]
}

export class FleetDataProcessor {
  private vehicles: FleetVehicle[] = []
  private operations: FleetOperation[] = []
  private language: 'vi' | 'en'

  constructor(language: 'vi' | 'en' = 'vi') {
    this.language = language
    this.loadStoredData()
  }

  async processFleetFile(file: File): Promise<{
    vehicles: FleetVehicle[]
    operations: FleetOperation[]
    analytics: FleetAnalytics
    insights: FleetInsight[]
  }> {
    const content = await this.readFileContent(file)
    const data = this.parseFleetData(content, file.name)
    
    // Process vehicles
    const vehicles = this.extractVehicles(data)
    const operations = this.extractOperations(data)
    
    // Update internal data
    this.vehicles = [...this.vehicles, ...vehicles]
    this.operations = [...this.operations, ...operations]
    
    // Generate analytics and insights
    const analytics = this.generateAnalytics()
    const insights = this.generateInsights()
    
    // Save to storage
    this.saveToStorage()
    
    return {
      vehicles,
      operations,
      analytics,
      insights
    }
  }

  private async readFileContent(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => resolve(e.target?.result as string || '')
      reader.onerror = reject
      reader.readAsText(file)
    })
  }

  private parseFleetData(content: string, fileName: string): any[] {
    try {
      // Try JSON first
      if (fileName.endsWith('.json')) {
        return JSON.parse(content)
      }
      
      // Try CSV
      if (fileName.endsWith('.csv')) {
        return this.parseCSV(content)
      }
      
      // Default to CSV parsing
      return this.parseCSV(content)
    } catch (error) {
      console.error('Error parsing fleet data:', error)
      return []
    }
  }

  private parseCSV(content: string): any[] {
    const lines = content.split('\n').filter(line => line.trim())
    if (lines.length < 2) return []

    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''))
    const data = []

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''))
      const row: any = {}
      headers.forEach((header, index) => {
        row[header] = values[index] || ''
      })
      data.push(row)
    }

    return data
  }

  private extractVehicles(data: any[]): FleetVehicle[] {
    return data.map((row, index) => {
      const vehicleId = row['Vehicle ID'] || row['ID'] || `VN-${String(index + 1).padStart(3, '0')}`
      
      return {
        id: vehicleId,
        name: row['Vehicle Name'] || row['Name'] || `Vehicle ${vehicleId}`,
        type: this.determineVehicleType(row['Type'] || row['Vehicle Type'] || 'container_40ft'),
        status: this.determineStatus(row['Status'] || 'active'),
        location: {
          lat: parseFloat(row['Latitude'] || row['Lat']) || (10.8231 + Math.random() * 10),
          lng: parseFloat(row['Longitude'] || row['Lng']) || (106.6297 + Math.random() * 5),
          address: row['Location'] || row['Address'] || 'Vietnam',
          timestamp: new Date()
        },
        driver: {
          name: row['Driver'] || row['Driver Name'] || `Driver ${index + 1}`,
          license: row['License'] || `DL${Date.now().toString().slice(-6)}`,
          phone: row['Phone'] || `+84${Math.floor(Math.random() * 1000000000)}`,
          experience: parseInt(row['Experience']) || Math.floor(Math.random() * 10) + 1
        },
        route: {
          from: row['Origin'] || row['From'] || 'TP.HCM',
          to: row['Destination'] || row['To'] || 'Hà Nội',
          distance: parseFloat(row['Distance']) || Math.floor(Math.random() * 1000) + 100,
          estimatedTime: parseFloat(row['Time']) || Math.floor(Math.random() * 20) + 2,
          progress: parseFloat(row['Progress']) || Math.floor(Math.random() * 100)
        },
        performance: {
          fuel: parseFloat(row['Fuel']) || Math.floor(Math.random() * 100),
          speed: parseFloat(row['Speed']) || Math.floor(Math.random() * 50) + 30,
          efficiency: parseFloat(row['Efficiency']) || Math.floor(Math.random() * 30) + 70,
          temperature: row['Temperature'] ? parseFloat(row['Temperature']) : undefined,
          mileage: parseFloat(row['Mileage']) || Math.floor(Math.random() * 500000) + 50000
        },
        maintenance: {
          lastService: new Date(row['Last Service'] || Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000),
          nextService: new Date(Date.now() + Math.random() * 90 * 24 * 60 * 60 * 1000),
          issues: (row['Issues'] || '').split(';').filter(Boolean),
          cost: parseFloat(row['Maintenance Cost']) || Math.floor(Math.random() * 50000000) + 10000000
        },
        cargo: {
          type: row['Cargo Type'] || row['Cargo'] || 'General Goods',
          weight: parseFloat(row['Weight']) || Math.floor(Math.random() * 25000) + 5000,
          value: parseFloat(row['Value']) || Math.floor(Math.random() * 500000) + 50000,
          hazardous: (row['Hazardous'] || '').toLowerCase() === 'true'
        }
      }
    })
  }

  private extractOperations(data: any[]): FleetOperation[] {
    return data.map((row, index) => {
      const operationId = row['Operation ID'] || `OP-${Date.now()}-${index}`
      
      return {
        id: operationId,
        type: this.determineOperationType(row['Operation Type'] || row['Type'] || 'delivery'),
        priority: this.determinePriority(row['Priority'] || 'medium'),
        status: this.determineOperationStatus(row['Status'] || 'pending'),
        vehicleId: row['Vehicle ID'] || row['Vehicle'] || `VN-${String(index + 1).padStart(3, '0')}`,
        route: {
          origin: row['Origin'] || row['From'] || 'TP.HCM',
          destination: row['Destination'] || row['To'] || 'Hà Nội',
          waypoints: (row['Waypoints'] || '').split(';').filter(Boolean),
          distance: parseFloat(row['Distance']) || Math.floor(Math.random() * 1000) + 100,
          estimatedTime: parseFloat(row['Estimated Time']) || Math.floor(Math.random() * 20) + 2,
          actualTime: row['Actual Time'] ? parseFloat(row['Actual Time']) : undefined
        },
        cargo: {
          description: row['Cargo Description'] || row['Cargo'] || 'General Goods',
          weight: parseFloat(row['Weight']) || Math.floor(Math.random() * 25000) + 5000,
          volume: parseFloat(row['Volume']) || Math.floor(Math.random() * 100) + 10,
          value: parseFloat(row['Value']) || Math.floor(Math.random() * 500000) + 50000,
          specialRequirements: (row['Special Requirements'] || '').split(';').filter(Boolean)
        },
        timeline: {
          created: new Date(row['Created'] || Date.now()),
          started: row['Started'] ? new Date(row['Started']) : undefined,
          completed: row['Completed'] ? new Date(row['Completed']) : undefined,
          estimatedCompletion: new Date(row['Estimated Completion'] || Date.now() + 24 * 60 * 60 * 1000)
        },
        cost: {
          fuel: parseFloat(row['Fuel Cost']) || Math.floor(Math.random() * 5000000) + 1000000,
          driver: parseFloat(row['Driver Cost']) || Math.floor(Math.random() * 3000000) + 500000,
          maintenance: parseFloat(row['Maintenance Cost']) || Math.floor(Math.random() * 2000000) + 200000,
          tolls: parseFloat(row['Toll Cost']) || Math.floor(Math.random() * 1000000) + 100000,
          total: 0 // Will be calculated
        },
        aiRecommendations: this.generateOperationRecommendations(row)
      }
    }).map(op => ({
      ...op,
      cost: {
        ...op.cost,
        total: op.cost.fuel + op.cost.driver + op.cost.maintenance + op.cost.tolls
      }
    }))
  }

  private generateAnalytics(): FleetAnalytics {
    const totalVehicles = this.vehicles.length
    const activeVehicles = this.vehicles.filter(v => v.status === 'active').length
    const totalOperations = this.operations.length
    const completedOperations = this.operations.filter(op => op.status === 'completed').length
    
    return {
      totalVehicles,
      activeVehicles,
      utilizationRate: totalVehicles > 0 ? (activeVehicles / totalVehicles) * 100 : 0,
      averageEfficiency: this.vehicles.reduce((sum, v) => sum + v.performance.efficiency, 0) / totalVehicles || 0,
      totalOperations,
      completedOperations,
      onTimeDeliveryRate: totalOperations > 0 ? (completedOperations / totalOperations) * 100 : 0,
      totalCost: this.operations.reduce((sum, op) => sum + op.cost.total, 0),
      fuelConsumption: this.operations.reduce((sum, op) => sum + op.cost.fuel, 0),
      maintenanceCost: this.vehicles.reduce((sum, v) => sum + v.maintenance.cost, 0),
      insights: this.generateInsights()
    }
  }

  private generateInsights(): FleetInsight[] {
    const insights: FleetInsight[] = []
    
    // Efficiency insight
    const lowEfficiencyVehicles = this.vehicles.filter(v => v.performance.efficiency < 75)
    if (lowEfficiencyVehicles.length > 0) {
      insights.push({
        type: 'efficiency',
        title: this.language === 'vi' ? 'Cải thiện Hiệu suất' : 'Efficiency Improvement',
        description: this.language === 'vi'
          ? `${lowEfficiencyVehicles.length} xe có hiệu suất thấp (<75%). Có thể cải thiện 15-20% hiệu suất.`
          : `${lowEfficiencyVehicles.length} vehicles have low efficiency (<75%). Can improve 15-20% efficiency.`,
        impact: 'high',
        recommendation: this.language === 'vi'
          ? 'Thực hiện bảo trì định kỳ và đào tạo tài xế về lái xe tiết kiệm nhiên liệu'
          : 'Perform regular maintenance and train drivers on fuel-efficient driving',
        potentialSavings: lowEfficiencyVehicles.length * 2000000,
        affectedVehicles: lowEfficiencyVehicles.map(v => v.id)
      })
    }

    // Maintenance insight
    const maintenanceDueVehicles = this.vehicles.filter(v => 
      v.maintenance.nextService.getTime() - Date.now() < 7 * 24 * 60 * 60 * 1000
    )
    if (maintenanceDueVehicles.length > 0) {
      insights.push({
        type: 'maintenance',
        title: this.language === 'vi' ? 'Bảo trì Định kỳ' : 'Scheduled Maintenance',
        description: this.language === 'vi'
          ? `${maintenanceDueVehicles.length} xe cần bảo trì trong 7 ngày tới.`
          : `${maintenanceDueVehicles.length} vehicles need maintenance within 7 days.`,
        impact: 'medium',
        recommendation: this.language === 'vi'
          ? 'Lên lịch bảo trì ngay để tránh hỏng hóc bất ngờ'
          : 'Schedule maintenance immediately to avoid unexpected breakdowns',
        affectedVehicles: maintenanceDueVehicles.map(v => v.id)
      })
    }

    // Cost optimization insight
    const highCostOperations = this.operations.filter(op => op.cost.total > 20000000)
    if (highCostOperations.length > 0) {
      insights.push({
        type: 'cost',
        title: this.language === 'vi' ? 'Tối ưu Chi phí' : 'Cost Optimization',
        description: this.language === 'vi'
          ? `${highCostOperations.length} hoạt động có chi phí cao (>20M VNĐ). Có thể tiết kiệm 10-15%.`
          : `${highCostOperations.length} operations have high costs (>20M VND). Can save 10-15%.`,
        impact: 'high',
        recommendation: this.language === 'vi'
          ? 'Tối ưu tuyến đường và consolidation để giảm chi phí'
          : 'Optimize routes and consolidation to reduce costs',
        potentialSavings: highCostOperations.reduce((sum, op) => sum + op.cost.total * 0.125, 0),
        affectedVehicles: highCostOperations.map(op => op.vehicleId)
      })
    }

    return insights
  }

  private generateOperationRecommendations(row: any): string[] {
    const recommendations: string[] = []
    
    if (this.language === 'vi') {
      recommendations.push(
        '🚛 Tối ưu tuyến đường để giảm thời gian di chuyển',
        '⛽ Giám sát tiêu thụ nhiên liệu real-time',
        '📱 Cập nhật trạng thái định kỳ cho khách hàng',
        '🔧 Kiểm tra bảo trì trước khi khởi hành'
      )
    } else {
      recommendations.push(
        '🚛 Optimize route to reduce travel time',
        '⛽ Monitor fuel consumption in real-time',
        '📱 Provide regular status updates to customers',
        '🔧 Check maintenance before departure'
      )
    }

    return recommendations
  }

  // Helper methods
  private determineVehicleType(type: string): FleetVehicle['type'] {
    const lowerType = type.toLowerCase()
    if (lowerType.includes('40ft') || lowerType.includes('40')) return 'container_40ft'
    if (lowerType.includes('20ft') || lowerType.includes('20')) return 'container_20ft'
    if (lowerType.includes('flatbed')) return 'flatbed'
    if (lowerType.includes('refrigerated') || lowerType.includes('reefer')) return 'refrigerated'
    if (lowerType.includes('tanker')) return 'tanker'
    return 'container_40ft'
  }

  private determineStatus(status: string): FleetVehicle['status'] {
    const lowerStatus = status.toLowerCase()
    if (lowerStatus.includes('active')) return 'active'
    if (lowerStatus.includes('maintenance')) return 'maintenance'
    if (lowerStatus.includes('idle')) return 'idle'
    if (lowerStatus.includes('emergency')) return 'emergency'
    return 'active'
  }

  private determineOperationType(type: string): FleetOperation['type'] {
    const lowerType = type.toLowerCase()
    if (lowerType.includes('delivery')) return 'delivery'
    if (lowerType.includes('pickup')) return 'pickup'
    if (lowerType.includes('transfer')) return 'transfer'
    if (lowerType.includes('maintenance')) return 'maintenance'
    if (lowerType.includes('emergency')) return 'emergency'
    return 'delivery'
  }

  private determinePriority(priority: string): FleetOperation['priority'] {
    const lowerPriority = priority.toLowerCase()
    if (lowerPriority.includes('critical')) return 'critical'
    if (lowerPriority.includes('high')) return 'high'
    if (lowerPriority.includes('low')) return 'low'
    return 'medium'
  }

  private determineOperationStatus(status: string): FleetOperation['status'] {
    const lowerStatus = status.toLowerCase()
    if (lowerStatus.includes('completed')) return 'completed'
    if (lowerStatus.includes('progress')) return 'in_progress'
    if (lowerStatus.includes('delayed')) return 'delayed'
    if (lowerStatus.includes('cancelled')) return 'cancelled'
    return 'pending'
  }

  private loadStoredData(): void {
    try {
      const storedVehicles = localStorage.getItem('fleet_vehicles')
      const storedOperations = localStorage.getItem('fleet_operations')
      
      if (storedVehicles) {
        this.vehicles = JSON.parse(storedVehicles)
      }
      if (storedOperations) {
        this.operations = JSON.parse(storedOperations)
      }
    } catch (error) {
      console.error('Failed to load stored fleet data:', error)
    }
  }

  private saveToStorage(): void {
    try {
      localStorage.setItem('fleet_vehicles', JSON.stringify(this.vehicles))
      localStorage.setItem('fleet_operations', JSON.stringify(this.operations))
    } catch (error) {
      console.error('Failed to save fleet data:', error)
    }
  }

  // Public methods
  public getVehicles(): FleetVehicle[] {
    return this.vehicles
  }

  public getOperations(): FleetOperation[] {
    return this.operations
  }

  public getAnalytics(): FleetAnalytics {
    return this.generateAnalytics()
  }
}
