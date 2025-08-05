/**
 * Enhanced Vietnamese Container File Processor
 * Specialized for BKVC (Bảng kê vận chuyển) and container logistics files
 */

import * as XLSX from 'xlsx'

export interface ContainerRouteData {
  id: string
  noiDi: string // Departure location
  noiDen: string // Destination location
  noiHaRong: string // Empty return location
  containerType: '20ft' | '40ft' | '45ft'
  containerNumber?: string
  taiXe?: string // Driver
  phuongTien?: string // Vehicle
  ngayVanChuyen?: string // Transport date
  trongLuong?: number // Weight
  chiPhiNhienLieu?: number // Fuel cost
  quangDuong?: number // Distance
  thoiGianDuKien?: string // Estimated time
  ghiChu?: string // Notes
  trangThai?: 'pending' | 'in_progress' | 'completed' | 'cancelled'
}

export interface RoutePattern {
  route: string
  frequency: number
  avgDistance: number
  avgFuelCost: number
  avgTime: number
  commonDepots: string[]
  peakHours: string[]
  restrictions: string[]
}

export interface ContainerInsights {
  totalRoutes: number
  uniqueDestinations: string[]
  commonRoutes: RoutePattern[]
  fuelEfficiency: number
  averageDistance: number
  containerUtilization: {
    '20ft': number
    '40ft': number
    '45ft': number
  }
  depotRecommendations: Array<{
    location: string
    reason: string
    potentialSavings: number
  }>
  rushHourAnalysis: {
    restrictedHours: string[]
    allowedHours: string[]
    trafficImpact: number
  }
  optimizationOpportunities: Array<{
    type: 'route' | 'depot' | 'scheduling' | 'fuel'
    description: string
    impact: 'high' | 'medium' | 'low'
    estimatedSavings: number
  }>
}

export class VietnameseContainerProcessor {
  
  static async processContainerFile(file: File): Promise<{
    routes: ContainerRouteData[]
    insights: ContainerInsights
    rawData: any
  }> {
    try {
      const rawData = await this.extractFileData(file)
      const routes = this.parseContainerRoutes(rawData, file.name)
      const insights = this.generateContainerInsights(routes)
      
      return { routes, insights, rawData }
    } catch (error) {
      console.error('Error processing container file:', error)
      throw new Error(`Failed to process container file: ${error}`)
    }
  }

  private static async extractFileData(file: File): Promise<any> {
    if (file.name.includes('.xlsx') || file.name.includes('.xls')) {
      return this.extractExcelData(file)
    } else if (file.name.includes('.pdf')) {
      return this.extractPdfData(file)
    } else if (file.name.includes('.csv')) {
      return this.extractCsvData(file)
    }
    throw new Error('Unsupported file format')
  }

  private static async extractExcelData(file: File): Promise<any> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer)
          const workbook = XLSX.read(data, { type: 'array' })
          
          const result: any = {
            sheets: workbook.SheetNames,
            records: []
          }

          // Process all sheets to find container data
          for (const sheetName of workbook.SheetNames) {
            const worksheet = workbook.Sheets[sheetName]
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 })
            
            if (jsonData.length > 1) {
              const headers = jsonData[0] as string[]
              const rows = jsonData.slice(1) as any[][]
              
              const sheetRecords = rows.map((row, index) => {
                const record: any = { _sheet: sheetName, _row: index + 2 }
                headers.forEach((header, colIndex) => {
                  if (header && row[colIndex] !== undefined && row[colIndex] !== null) {
                    const normalizedKey = this.normalizeFieldName(header)
                    record[normalizedKey] = row[colIndex]
                  }
                })
                return record
              }).filter(record => Object.keys(record).length > 2) // More than just _sheet and _row

              result.records.push(...sheetRecords)
            }
          }

          resolve(result)
        } catch (error) {
          reject(error)
        }
      }

      reader.onerror = () => reject(new Error('Failed to read Excel file'))
      reader.readAsArrayBuffer(file)
    })
  }

  private static async extractPdfData(file: File): Promise<any> {
    // For PDF files, we'll simulate extraction since we can't use pdf-parse in browser
    return {
      records: [],
      text: `PDF content from ${file.name}`,
      metadata: { pages: 1 }
    }
  }

  private static async extractCsvData(file: File): Promise<any> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      
      reader.onload = (e) => {
        try {
          const text = e.target?.result as string
          const lines = text.split('\n').filter(line => line.trim())
          
          if (lines.length === 0) {
            resolve({ records: [] })
            return
          }

          const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''))
          const records = lines.slice(1).map((line, index) => {
            const values = line.split(',').map(v => v.trim().replace(/"/g, ''))
            const record: any = { _row: index + 2 }
            headers.forEach((header, colIndex) => {
              if (header && values[colIndex] !== undefined) {
                record[this.normalizeFieldName(header)] = values[colIndex]
              }
            })
            return record
          }).filter(record => Object.keys(record).length > 1)

          resolve({ records })
        } catch (error) {
          reject(error)
        }
      }

      reader.onerror = () => reject(new Error('Failed to read CSV file'))
      reader.readAsText(file, 'utf-8')
    })
  }

  private static normalizeFieldName(header: string): string {
    // Handle Vietnamese field names and normalize them
    const vietnameseFieldMap: { [key: string]: string } = {
      'nơi đi': 'noi_di',
      'noi di': 'noi_di',
      'điểm đi': 'noi_di',
      'diem di': 'noi_di',
      'xuất phát': 'noi_di',
      'xuat phat': 'noi_di',
      
      'nơi đến': 'noi_den',
      'noi den': 'noi_den',
      'điểm đến': 'noi_den',
      'diem den': 'noi_den',
      'đích': 'noi_den',
      'dich': 'noi_den',
      
      'nơi hạ rỗng': 'noi_ha_rong',
      'noi ha rong': 'noi_ha_rong',
      'hạ rỗng': 'noi_ha_rong',
      'ha rong': 'noi_ha_rong',
      'empty return': 'noi_ha_rong',
      
      'container': 'container_number',
      'cont': 'container_number',
      'số container': 'container_number',
      'so container': 'container_number',
      
      'tài xế': 'tai_xe',
      'tai xe': 'tai_xe',
      'driver': 'tai_xe',
      'lái xe': 'tai_xe',
      'lai xe': 'tai_xe',
      
      'phương tiện': 'phuong_tien',
      'phuong tien': 'phuong_tien',
      'vehicle': 'phuong_tien',
      'xe': 'phuong_tien',
      'truck': 'phuong_tien',
      
      'ngày': 'ngay_van_chuyen',
      'ngay': 'ngay_van_chuyen',
      'date': 'ngay_van_chuyen',
      'ngày vận chuyển': 'ngay_van_chuyen',
      'ngay van chuyen': 'ngay_van_chuyen',
      
      'trọng lượng': 'trong_luong',
      'trong luong': 'trong_luong',
      'weight': 'trong_luong',
      'tải trọng': 'trong_luong',
      'tai trong': 'trong_luong',
      
      'chi phí nhiên liệu': 'chi_phi_nhien_lieu',
      'chi phi nhien lieu': 'chi_phi_nhien_lieu',
      'fuel cost': 'chi_phi_nhien_lieu',
      'nhiên liệu': 'chi_phi_nhien_lieu',
      'nhien lieu': 'chi_phi_nhien_lieu',
      
      'quãng đường': 'quang_duong',
      'quang duong': 'quang_duong',
      'distance': 'quang_duong',
      'km': 'quang_duong',
      
      'thời gian': 'thoi_gian_du_kien',
      'thoi gian': 'thoi_gian_du_kien',
      'time': 'thoi_gian_du_kien',
      'duration': 'thoi_gian_du_kien',
      
      'ghi chú': 'ghi_chu',
      'ghi chu': 'ghi_chu',
      'note': 'ghi_chu',
      'notes': 'ghi_chu',
      'remark': 'ghi_chu'
    }

    const lowerHeader = header.toLowerCase().trim()
    
    // Check for direct Vietnamese mapping
    if (vietnameseFieldMap[lowerHeader]) {
      return vietnameseFieldMap[lowerHeader]
    }

    // Check for partial matches
    for (const [vn, en] of Object.entries(vietnameseFieldMap)) {
      if (lowerHeader.includes(vn) || vn.includes(lowerHeader)) {
        return en
      }
    }

    // Default normalization
    return lowerHeader
      .replace(/[àáạảãâầấậẩẫăằắặẳẵ]/g, 'a')
      .replace(/[èéẹẻẽêềếệểễ]/g, 'e')
      .replace(/[ìíịỉĩ]/g, 'i')
      .replace(/[òóọỏõôồốộổỗơờớợởỡ]/g, 'o')
      .replace(/[ùúụủũưừứựửữ]/g, 'u')
      .replace(/[ỳýỵỷỹ]/g, 'y')
      .replace(/đ/g, 'd')
      .replace(/[^a-z0-9]/g, '_')
      .replace(/_+/g, '_')
      .replace(/^_|_$/g, '')
  }

  private static parseContainerRoutes(rawData: any, fileName: string): ContainerRouteData[] {
    const routes: ContainerRouteData[] = []
    const records = rawData.records || []

    for (const record of records) {
      // Extract route information from the record
      const route: ContainerRouteData = {
        id: `${fileName}_${record._row || routes.length}`,
        noiDi: this.extractLocation(record, ['noi_di', 'departure', 'from', 'origin']),
        noiDen: this.extractLocation(record, ['noi_den', 'destination', 'to', 'dest']),
        noiHaRong: this.extractLocation(record, ['noi_ha_rong', 'empty_return', 'return_location']),
        containerType: this.extractContainerType(record),
        containerNumber: this.extractValue(record, ['container_number', 'container', 'cont']),
        taiXe: this.extractValue(record, ['tai_xe', 'driver', 'driver_name']),
        phuongTien: this.extractValue(record, ['phuong_tien', 'vehicle', 'truck']),
        ngayVanChuyen: this.extractDate(record),
        trongLuong: this.extractNumber(record, ['trong_luong', 'weight']),
        chiPhiNhienLieu: this.extractNumber(record, ['chi_phi_nhien_lieu', 'fuel_cost']),
        quangDuong: this.extractNumber(record, ['quang_duong', 'distance', 'km']),
        thoiGianDuKien: this.extractValue(record, ['thoi_gian_du_kien', 'time', 'duration']),
        ghiChu: this.extractValue(record, ['ghi_chu', 'note', 'notes', 'remark']),
        trangThai: 'pending'
      }

      // Only add routes with at least departure and destination
      if (route.noiDi && route.noiDen) {
        routes.push(route)
      }
    }

    return routes
  }

  private static extractLocation(record: any, possibleKeys: string[]): string {
    for (const key of possibleKeys) {
      const value = record[key]
      if (value && typeof value === 'string' && value.trim()) {
        return value.trim()
      }
    }
    return ''
  }

  private static extractValue(record: any, possibleKeys: string[]): string {
    for (const key of possibleKeys) {
      const value = record[key]
      if (value !== undefined && value !== null) {
        return String(value).trim()
      }
    }
    return ''
  }

  private static extractNumber(record: any, possibleKeys: string[]): number {
    for (const key of possibleKeys) {
      const value = record[key]
      if (value !== undefined && value !== null) {
        const num = parseFloat(String(value).replace(/[^\d.-]/g, ''))
        if (!isNaN(num)) {
          return num
        }
      }
    }
    return 0
  }

  private static extractDate(record: any): string {
    const dateKeys = ['ngay_van_chuyen', 'date', 'ngay', 'transport_date']
    for (const key of dateKeys) {
      const value = record[key]
      if (value) {
        if (value instanceof Date) {
          return value.toISOString().split('T')[0]
        }
        if (typeof value === 'string') {
          const date = new Date(value)
          if (!isNaN(date.getTime())) {
            return date.toISOString().split('T')[0]
          }
        }
        if (typeof value === 'number') {
          // Excel date serial number
          const date = new Date((value - 25569) * 86400 * 1000)
          if (!isNaN(date.getTime())) {
            return date.toISOString().split('T')[0]
          }
        }
      }
    }
    return new Date().toISOString().split('T')[0]
  }

  private static extractContainerType(record: any): '20ft' | '40ft' | '45ft' {
    const containerKeys = ['container_type', 'type', 'container_number', 'container']
    
    for (const key of containerKeys) {
      const value = String(record[key] || '').toLowerCase()
      if (value.includes('40') || value.includes('40ft')) return '40ft'
      if (value.includes('45') || value.includes('45ft')) return '45ft'
      if (value.includes('20') || value.includes('20ft')) return '20ft'
    }

    // Default to 40ft for Vietnamese container operations
    return '40ft'
  }

  private static generateContainerInsights(routes: ContainerRouteData[]): ContainerInsights {
    if (routes.length === 0) {
      return this.getEmptyInsights()
    }

    const uniqueDestinations = [...new Set(routes.map(r => r.noiDen).filter(Boolean))]
    const commonRoutes = this.analyzeRoutePatterns(routes)
    const containerUtilization = this.analyzeContainerUtilization(routes)
    const depotRecommendations = this.generateDepotRecommendations(routes)
    const rushHourAnalysis = this.analyzeRushHourImpact(routes)
    const optimizationOpportunities = this.identifyOptimizationOpportunities(routes)

    const totalDistance = routes.reduce((sum, r) => sum + (r.quangDuong || 0), 0)
    const totalFuelCost = routes.reduce((sum, r) => sum + (r.chiPhiNhienLieu || 0), 0)
    const averageDistance = totalDistance / routes.length
    const fuelEfficiency = totalDistance > 0 ? totalFuelCost / totalDistance : 0

    return {
      totalRoutes: routes.length,
      uniqueDestinations,
      commonRoutes,
      fuelEfficiency,
      averageDistance,
      containerUtilization,
      depotRecommendations,
      rushHourAnalysis,
      optimizationOpportunities
    }
  }

  private static analyzeRoutePatterns(routes: ContainerRouteData[]): RoutePattern[] {
    const routeMap = new Map<string, {
      count: number
      distances: number[]
      fuelCosts: number[]
      depots: string[]
    }>()

    routes.forEach(route => {
      const routeKey = `${route.noiDi} → ${route.noiDen}`
      if (!routeMap.has(routeKey)) {
        routeMap.set(routeKey, { count: 0, distances: [], fuelCosts: [], depots: [] })
      }
      
      const routeData = routeMap.get(routeKey)!
      routeData.count++
      if (route.quangDuong) routeData.distances.push(route.quangDuong)
      if (route.chiPhiNhienLieu) routeData.fuelCosts.push(route.chiPhiNhienLieu)
      if (route.noiHaRong) routeData.depots.push(route.noiHaRong)
    })

    return Array.from(routeMap.entries())
      .map(([route, data]) => ({
        route,
        frequency: data.count,
        avgDistance: data.distances.length > 0 ? data.distances.reduce((a, b) => a + b, 0) / data.distances.length : 0,
        avgFuelCost: data.fuelCosts.length > 0 ? data.fuelCosts.reduce((a, b) => a + b, 0) / data.fuelCosts.length : 0,
        avgTime: 0, // Calculate based on distance and average speed
        commonDepots: [...new Set(data.depots)],
        peakHours: ['07:00-09:00', '17:00-19:00'], // Standard rush hours
        restrictions: data.route.includes('40ft') ? ['Rush hour restrictions', 'Weight limits'] : []
      }))
      .sort((a, b) => b.frequency - a.frequency)
      .slice(0, 10) // Top 10 most common routes
  }

  private static analyzeContainerUtilization(routes: ContainerRouteData[]): { '20ft': number; '40ft': number; '45ft': number } {
    const utilization = { '20ft': 0, '40ft': 0, '45ft': 0 }
    
    routes.forEach(route => {
      utilization[route.containerType]++
    })

    return utilization
  }

  private static generateDepotRecommendations(routes: ContainerRouteData[]): Array<{
    location: string
    reason: string
    potentialSavings: number
  }> {
    const destinationCounts = new Map<string, number>()
    routes.forEach(route => {
      const count = destinationCounts.get(route.noiDen) || 0
      destinationCounts.set(route.noiDen, count + 1)
    })

    const topDestinations = Array.from(destinationCounts.entries())
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)

    return topDestinations.map(([destination, count]) => ({
      location: destination,
      reason: `${count} chuyến đến ${destination}, nên thiết lập depot gần đây`,
      potentialSavings: count * 500000 // Estimated savings per route
    }))
  }

  private static analyzeRushHourImpact(routes: ContainerRouteData[]): {
    restrictedHours: string[]
    allowedHours: string[]
    trafficImpact: number
  } {
    return {
      restrictedHours: ['06:00-22:00'], // Standard container restrictions in Vietnam
      allowedHours: ['22:00-06:00'],
      trafficImpact: 25 // Estimated 25% time increase during restricted hours
    }
  }

  private static identifyOptimizationOpportunities(routes: ContainerRouteData[]): Array<{
    type: 'route' | 'depot' | 'scheduling' | 'fuel'
    description: string
    impact: 'high' | 'medium' | 'low'
    estimatedSavings: number
  }> {
    const opportunities = []

    // Route optimization
    const avgFuelCost = routes.reduce((sum, r) => sum + (r.chiPhiNhienLieu || 0), 0) / routes.length
    if (avgFuelCost > 2000000) { // > 2M VND average
      opportunities.push({
        type: 'route' as const,
        description: 'Tối ưu hóa tuyến đường để giảm chi phí nhiên liệu cao',
        impact: 'high' as const,
        estimatedSavings: routes.length * 500000
      })
    }

    // Depot optimization
    const uniqueDestinations = new Set(routes.map(r => r.noiDen)).size
    if (uniqueDestinations > 5) {
      opportunities.push({
        type: 'depot' as const,
        description: 'Thiết lập depot trung chuyển để giảm quãng đường',
        impact: 'high' as const,
        estimatedSavings: routes.length * 300000
      })
    }

    // Scheduling optimization
    opportunities.push({
      type: 'scheduling' as const,
      description: 'Tối ưu lịch trình để tránh giờ cấm container 40ft',
      impact: 'medium' as const,
      estimatedSavings: routes.filter(r => r.containerType === '40ft').length * 200000
    })

    // Fuel optimization
    opportunities.push({
      type: 'fuel' as const,
      description: 'Cải thiện hiệu suất nhiên liệu thông qua đào tạo tài xế',
      impact: 'medium' as const,
      estimatedSavings: routes.length * 150000
    })

    return opportunities
  }

  private static getEmptyInsights(): ContainerInsights {
    return {
      totalRoutes: 0,
      uniqueDestinations: [],
      commonRoutes: [],
      fuelEfficiency: 0,
      averageDistance: 0,
      containerUtilization: { '20ft': 0, '40ft': 0, '45ft': 0 },
      depotRecommendations: [],
      rushHourAnalysis: {
        restrictedHours: ['06:00-22:00'],
        allowedHours: ['22:00-06:00'],
        trafficImpact: 25
      },
      optimizationOpportunities: []
    }
  }
}
