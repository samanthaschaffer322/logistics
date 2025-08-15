import * as XLSX from 'xlsx';

export interface FilePattern {
  id: string;
  name: string;
  type: 'KE_HOACH_NGAY' | 'FILE_THEO_DOI_XE' | 'BKVC' | 'CONG_NO';
  patterns: string[];
  columns: string[];
  dataStructure: any;
  automationRules: AutomationRule[];
}

export interface AutomationRule {
  id: string;
  condition: string;
  action: string;
  parameters: any;
}

export interface ProcessedFileData {
  fileName: string;
  fileType: string;
  data: any[];
  metadata: {
    totalRows: number;
    columns: string[];
    dateRange?: { start: Date; end: Date };
    summary: any;
  };
  insights: FileInsight[];
}

export interface FileInsight {
  type: 'cost_analysis' | 'route_optimization' | 'vehicle_utilization' | 'payment_tracking';
  title: string;
  description: string;
  value: number | string;
  trend?: 'up' | 'down' | 'stable';
  recommendation?: string;
}

class FileLearningSystem {
  private patterns: FilePattern[] = [];
  private processedFiles: Map<string, ProcessedFileData> = new Map();

  constructor() {
    this.initializePatterns();
  }

  private initializePatterns() {
    // Kế hoạch ngày (Daily Planning) pattern
    this.patterns.push({
      id: 'ke_hoach_ngay',
      name: 'Kế hoạch ngày',
      type: 'KE_HOACH_NGAY',
      patterns: ['KẾ HOẠCH NGÀY', 'KE HOACH NGAY', 'DAILY PLAN'],
      columns: ['Ngày', 'Tuyến đường', 'Xe', 'Tài xế', 'Hàng hóa', 'Khối lượng', 'Giá cước'],
      dataStructure: {
        date: 'string',
        route: 'string',
        vehicle: 'string',
        driver: 'string',
        cargo: 'string',
        weight: 'number',
        rate: 'number'
      },
      automationRules: [
        {
          id: 'route_optimization',
          condition: 'multiple_routes_same_destination',
          action: 'suggest_route_consolidation',
          parameters: { threshold: 2 }
        },
        {
          id: 'cost_analysis',
          condition: 'daily_cost_calculation',
          action: 'calculate_daily_profit_loss',
          parameters: { include_fuel: true, include_driver_cost: true }
        }
      ]
    });

    // File theo dõi xe (Vehicle Tracking) pattern
    this.patterns.push({
      id: 'file_theo_doi_xe',
      name: 'File theo dõi xe',
      type: 'FILE_THEO_DOI_XE',
      patterns: ['FILE THEO DÕI XE', 'VEHICLE TRACKING', 'THEO DOI XE'],
      columns: ['Biển số', 'Ứng tiền', 'Nhiên liệu', 'Bảo dưỡng', 'Tổng chi phí'],
      dataStructure: {
        vehicleNumber: 'string',
        advance: 'number',
        fuel: 'number',
        maintenance: 'number',
        totalCost: 'number'
      },
      automationRules: [
        {
          id: 'vehicle_cost_analysis',
          condition: 'monthly_vehicle_costs',
          action: 'analyze_vehicle_efficiency',
          parameters: { cost_per_km: true, fuel_efficiency: true }
        }
      ]
    });

    // BKVC (Bảng kê vận chuyển) pattern
    this.patterns.push({
      id: 'bkvc',
      name: 'Bảng kê vận chuyển',
      type: 'BKVC',
      patterns: ['BKVC', 'BẢNG KÊ VẬN CHUYỂN', 'TRANSPORT STATEMENT'],
      columns: ['Ngày', 'Tuyến', 'Xe', 'Cước phí', 'Chi phí', 'Lợi nhuận'],
      dataStructure: {
        date: 'string',
        route: 'string',
        vehicle: 'string',
        revenue: 'number',
        cost: 'number',
        profit: 'number'
      },
      automationRules: [
        {
          id: 'profit_analysis',
          condition: 'monthly_profit_calculation',
          action: 'generate_profit_report',
          parameters: { include_trends: true }
        }
      ]
    });

    // Công nợ (Contractor Payments) pattern
    this.patterns.push({
      id: 'cong_no',
      name: 'Công nợ',
      type: 'CONG_NO',
      patterns: ['CÔNG NỢ', 'CONG NO', 'CONTRACTOR PAYMENT'],
      columns: ['Nhà thầu', 'Số tiền', 'Ngày đáo hạn', 'Trạng thái'],
      dataStructure: {
        contractor: 'string',
        amount: 'number',
        dueDate: 'string',
        status: 'string'
      },
      automationRules: [
        {
          id: 'payment_tracking',
          condition: 'overdue_payments',
          action: 'generate_payment_alerts',
          parameters: { days_overdue: 7 }
        }
      ]
    });
  }

  async processFile(file: File): Promise<ProcessedFileData> {
    try {
      const buffer = await file.arrayBuffer();
      const workbook = XLSX.read(buffer, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(worksheet);

      // Detect file pattern
      const pattern = this.detectFilePattern(file.name, data);
      
      if (!pattern) {
        throw new Error('Unknown file pattern');
      }

      // Process data according to pattern
      const processedData = this.processDataByPattern(data, pattern);
      
      // Generate insights
      const insights = this.generateInsights(processedData, pattern);

      const result: ProcessedFileData = {
        fileName: file.name,
        fileType: pattern.type,
        data: processedData,
        metadata: {
          totalRows: data.length,
          columns: Object.keys(data[0] || {}),
          summary: this.generateSummary(processedData, pattern)
        },
        insights
      };

      // Store for future learning
      this.processedFiles.set(file.name, result);

      return result;
    } catch (error) {
      console.error('Error processing file:', error);
      throw error;
    }
  }

  private detectFilePattern(fileName: string, data: any[]): FilePattern | null {
    const upperFileName = fileName.toUpperCase();
    
    for (const pattern of this.patterns) {
      if (pattern.patterns.some(p => upperFileName.includes(p))) {
        return pattern;
      }
    }

    // Try to detect by column names if filename doesn't match
    if (data.length > 0) {
      const columns = Object.keys(data[0]).map(col => col.toUpperCase());
      
      for (const pattern of this.patterns) {
        const matchingColumns = pattern.columns.filter(col => 
          columns.some(dataCol => dataCol.includes(col.toUpperCase()))
        );
        
        if (matchingColumns.length >= pattern.columns.length * 0.6) {
          return pattern;
        }
      }
    }

    return null;
  }

  private processDataByPattern(data: any[], pattern: FilePattern): any[] {
    return data.map(row => {
      const processedRow: any = {};
      
      // Map columns based on pattern
      Object.keys(row).forEach(key => {
        const value = row[key];
        
        // Apply data type conversion based on pattern structure
        if (typeof value === 'string' && value.includes('VND')) {
          processedRow[key] = this.parseVietnameseCurrency(value);
        } else if (typeof value === 'string' && this.isDate(value)) {
          processedRow[key] = new Date(value);
        } else {
          processedRow[key] = value;
        }
      });

      return processedRow;
    });
  }

  private generateInsights(data: any[], pattern: FilePattern): FileInsight[] {
    const insights: FileInsight[] = [];

    switch (pattern.type) {
      case 'KE_HOACH_NGAY':
        insights.push(...this.generateDailyPlanInsights(data));
        break;
      case 'FILE_THEO_DOI_XE':
        insights.push(...this.generateVehicleTrackingInsights(data));
        break;
      case 'BKVC':
        insights.push(...this.generateTransportInsights(data));
        break;
      case 'CONG_NO':
        insights.push(...this.generatePaymentInsights(data));
        break;
    }

    return insights;
  }

  private generateDailyPlanInsights(data: any[]): FileInsight[] {
    const insights: FileInsight[] = [];
    
    // Route frequency analysis
    const routeFrequency = this.analyzeRouteFrequency(data);
    insights.push({
      type: 'route_optimization',
      title: 'Tuyến đường phổ biến nhất',
      description: `Tuyến ${routeFrequency.mostFrequent} xuất hiện ${routeFrequency.count} lần`,
      value: routeFrequency.count,
      recommendation: 'Xem xét tối ưu hóa tuyến đường này để tăng hiệu quả'
    });

    // Vehicle utilization
    const vehicleUtil = this.analyzeVehicleUtilization(data);
    insights.push({
      type: 'vehicle_utilization',
      title: 'Tỷ lệ sử dụng xe',
      description: `Trung bình ${vehicleUtil.averageTrips} chuyến/xe/ngày`,
      value: vehicleUtil.averageTrips,
      trend: vehicleUtil.trend,
      recommendation: vehicleUtil.recommendation
    });

    return insights;
  }

  private generateVehicleTrackingInsights(data: any[]): FileInsight[] {
    const insights: FileInsight[] = [];
    
    // Cost analysis
    const totalCost = data.reduce((sum, row) => sum + (row.totalCost || 0), 0);
    insights.push({
      type: 'cost_analysis',
      title: 'Tổng chi phí xe',
      description: `Tổng chi phí trong tháng: ${this.formatCurrency(totalCost)}`,
      value: totalCost,
      recommendation: 'Theo dõi chi phí để tối ưu hóa ngân sách'
    });

    // Fuel efficiency
    const fuelEfficiency = this.analyzeFuelEfficiency(data);
    insights.push({
      type: 'cost_analysis',
      title: 'Hiệu quả nhiên liệu',
      description: `Trung bình ${fuelEfficiency.average} VND/km`,
      value: fuelEfficiency.average,
      trend: fuelEfficiency.trend
    });

    return insights;
  }

  private generateTransportInsights(data: any[]): FileInsight[] {
    const insights: FileInsight[] = [];
    
    // Profit analysis
    const totalProfit = data.reduce((sum, row) => sum + (row.profit || 0), 0);
    const totalRevenue = data.reduce((sum, row) => sum + (row.revenue || 0), 0);
    const profitMargin = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;

    insights.push({
      type: 'cost_analysis',
      title: 'Tỷ suất lợi nhuận',
      description: `Lợi nhuận: ${profitMargin.toFixed(2)}%`,
      value: profitMargin,
      trend: profitMargin > 15 ? 'up' : profitMargin > 10 ? 'stable' : 'down',
      recommendation: profitMargin < 10 ? 'Cần tối ưu hóa chi phí để tăng lợi nhuận' : 'Duy trì hiệu quả hoạt động'
    });

    return insights;
  }

  private generatePaymentInsights(data: any[]): FileInsight[] {
    const insights: FileInsight[] = [];
    
    // Overdue payments
    const overduePayments = data.filter(row => {
      const dueDate = new Date(row.dueDate);
      return dueDate < new Date() && row.status !== 'Đã thanh toán';
    });

    insights.push({
      type: 'payment_tracking',
      title: 'Thanh toán quá hạn',
      description: `${overduePayments.length} khoản thanh toán quá hạn`,
      value: overduePayments.length,
      trend: overduePayments.length > 0 ? 'down' : 'up',
      recommendation: overduePayments.length > 0 ? 'Cần liên hệ nhà thầu để thu hồi công nợ' : 'Tình hình thanh toán tốt'
    });

    return insights;
  }

  // Helper methods
  private parseVietnameseCurrency(value: string): number {
    return parseFloat(value.replace(/[^\d.-]/g, '')) || 0;
  }

  private isDate(value: string): boolean {
    return !isNaN(Date.parse(value));
  }

  private formatCurrency(amount: number): string {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  }

  private analyzeRouteFrequency(data: any[]): { mostFrequent: string; count: number } {
    const routeCounts: { [key: string]: number } = {};
    
    data.forEach(row => {
      const route = row.route || row['Tuyến đường'] || row['Tuyến'];
      if (route) {
        routeCounts[route] = (routeCounts[route] || 0) + 1;
      }
    });

    const mostFrequent = Object.keys(routeCounts).reduce((a, b) => 
      routeCounts[a] > routeCounts[b] ? a : b
    );

    return {
      mostFrequent,
      count: routeCounts[mostFrequent] || 0
    };
  }

  private analyzeVehicleUtilization(data: any[]): { 
    averageTrips: number; 
    trend: 'up' | 'down' | 'stable';
    recommendation: string;
  } {
    const vehicleCounts: { [key: string]: number } = {};
    
    data.forEach(row => {
      const vehicle = row.vehicle || row['Xe'] || row['Biển số'];
      if (vehicle) {
        vehicleCounts[vehicle] = (vehicleCounts[vehicle] || 0) + 1;
      }
    });

    const totalVehicles = Object.keys(vehicleCounts).length;
    const totalTrips = Object.values(vehicleCounts).reduce((sum, count) => sum + count, 0);
    const averageTrips = totalVehicles > 0 ? Math.round(totalTrips / totalVehicles) : 0;

    let trend: 'up' | 'down' | 'stable' = 'stable';
    let recommendation = 'Duy trì hiệu quả sử dụng xe hiện tại';

    if (averageTrips > 3) {
      trend = 'up';
      recommendation = 'Hiệu quả sử dụng xe tốt, có thể mở rộng hoạt động';
    } else if (averageTrips < 2) {
      trend = 'down';
      recommendation = 'Cần tối ưu hóa lịch trình để tăng hiệu quả sử dụng xe';
    }

    return { averageTrips, trend, recommendation };
  }

  private analyzeFuelEfficiency(data: any[]): { average: number; trend: 'up' | 'down' | 'stable' } {
    const fuelCosts = data.map(row => row.fuel || row['Nhiên liệu'] || 0).filter(cost => cost > 0);
    const average = fuelCosts.length > 0 ? 
      Math.round(fuelCosts.reduce((sum, cost) => sum + cost, 0) / fuelCosts.length) : 0;

    // Simple trend analysis (would be more sophisticated with historical data)
    const trend: 'up' | 'down' | 'stable' = 'stable';

    return { average, trend };
  }

  private generateSummary(data: any[], pattern: FilePattern): any {
    const summary: any = {
      totalRecords: data.length,
      fileType: pattern.name,
      processedAt: new Date().toISOString()
    };

    // Add pattern-specific summary data
    switch (pattern.type) {
      case 'KE_HOACH_NGAY':
        summary.totalRoutes = new Set(data.map(row => row.route || row['Tuyến đường'])).size;
        summary.totalVehicles = new Set(data.map(row => row.vehicle || row['Xe'])).size;
        break;
      case 'FILE_THEO_DOI_XE':
        summary.totalCost = data.reduce((sum, row) => sum + (row.totalCost || 0), 0);
        summary.averageCostPerVehicle = summary.totalCost / data.length;
        break;
      case 'BKVC':
        summary.totalRevenue = data.reduce((sum, row) => sum + (row.revenue || 0), 0);
        summary.totalProfit = data.reduce((sum, row) => sum + (row.profit || 0), 0);
        break;
      case 'CONG_NO':
        summary.totalAmount = data.reduce((sum, row) => sum + (row.amount || 0), 0);
        summary.pendingPayments = data.filter(row => row.status !== 'Đã thanh toán').length;
        break;
    }

    return summary;
  }

  // Public methods for automation
  public async automateFileProcessing(files: File[]): Promise<ProcessedFileData[]> {
    const results: ProcessedFileData[] = [];
    
    for (const file of files) {
      try {
        const processed = await this.processFile(file);
        results.push(processed);
        
        // Apply automation rules
        await this.applyAutomationRules(processed);
      } catch (error) {
        console.error(`Error processing file ${file.name}:`, error);
      }
    }

    return results;
  }

  private async applyAutomationRules(processedData: ProcessedFileData): Promise<void> {
    const pattern = this.patterns.find(p => p.type === processedData.fileType);
    if (!pattern) return;

    for (const rule of pattern.automationRules) {
      try {
        await this.executeAutomationRule(rule, processedData);
      } catch (error) {
        console.error(`Error executing automation rule ${rule.id}:`, error);
      }
    }
  }

  private async executeAutomationRule(rule: AutomationRule, data: ProcessedFileData): Promise<void> {
    switch (rule.action) {
      case 'suggest_route_consolidation':
        // Implementation for route consolidation suggestions
        break;
      case 'calculate_daily_profit_loss':
        // Implementation for daily P&L calculation
        break;
      case 'analyze_vehicle_efficiency':
        // Implementation for vehicle efficiency analysis
        break;
      case 'generate_profit_report':
        // Implementation for profit report generation
        break;
      case 'generate_payment_alerts':
        // Implementation for payment alerts
        break;
    }
  }

  public getProcessedFiles(): ProcessedFileData[] {
    return Array.from(this.processedFiles.values());
  }

  public getFileInsights(fileName: string): FileInsight[] {
    const file = this.processedFiles.get(fileName);
    return file ? file.insights : [];
  }
}

export const fileLearningSystem = new FileLearningSystem();
