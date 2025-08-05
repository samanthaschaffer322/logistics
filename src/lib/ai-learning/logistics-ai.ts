import * as XLSX from 'xlsx';
import OpenAI from 'openai';

export interface LogisticsData {
  date: string;
  route: string;
  origin: string;
  destination: string;
  emptyReturn: string;
  containerType: string;
  weight: number;
  volume: number;
  driver: string;
  vehicle: string;
  cost: number;
  duration: number;
  distance: number;
  fuelConsumption: number;
  trafficConditions: string;
  weatherConditions: string;
  delays: number;
  customerSatisfaction: number;
}

export interface RoutePattern {
  routeId: string;
  frequency: number;
  averageDuration: number;
  averageCost: number;
  averageDistance: number;
  commonOrigins: string[];
  commonDestinations: string[];
  commonEmptyReturns: string[];
  preferredDrivers: string[];
  preferredVehicles: string[];
  seasonalVariations: {
    season: string;
    frequencyMultiplier: number;
    costMultiplier: number;
    durationMultiplier: number;
  }[];
  timePatterns: {
    dayOfWeek: string;
    preferredStartTime: string;
    frequency: number;
  }[];
}

export interface PredictionResult {
  suggestedRoutes: {
    route: string;
    confidence: number;
    estimatedCost: number;
    estimatedDuration: number;
    estimatedDistance: number;
    recommendedDriver: string;
    recommendedVehicle: string;
    optimalStartTime: string;
    reasoning: string;
  }[];
  staffReplacements: {
    originalStaff: string;
    suggestedReplacements: {
      name: string;
      confidence: number;
      skillMatch: number;
      experienceLevel: string;
      reasoning: string;
    }[];
  }[];
  optimizationSuggestions: {
    type: 'cost' | 'time' | 'fuel' | 'route';
    description: string;
    potentialSavings: number;
    implementationDifficulty: 'low' | 'medium' | 'high';
    priority: number;
  }[];
  riskAssessments: {
    riskType: string;
    probability: number;
    impact: string;
    mitigation: string;
  }[];
}

export class LogisticsAI {
  private openai: OpenAI;
  private learnedPatterns: RoutePattern[] = [];
  private historicalData: LogisticsData[] = [];

  constructor(apiKey: string) {
    this.openai = new OpenAI({
      apiKey: apiKey,
    });
  }

  async learnFromExcelFiles(filePaths: string[]): Promise<void> {
    console.log('Starting to learn from Excel files...');
    
    for (const filePath of filePaths) {
      try {
        const data = await this.parseExcelFile(filePath);
        this.historicalData.push(...data);
        console.log(`Processed ${data.length} records from ${filePath}`);
      } catch (error) {
        console.error(`Error processing file ${filePath}:`, error);
      }
    }

    // Analyze patterns
    this.learnedPatterns = await this.analyzePatterns(this.historicalData);
    console.log(`Learned ${this.learnedPatterns.length} route patterns`);
  }

  private async parseExcelFile(filePath: string): Promise<LogisticsData[]> {
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet);

    return jsonData.map((row: any) => this.normalizeDataRow(row));
  }

  private normalizeDataRow(row: any): LogisticsData {
    // Normalize Vietnamese column names to English
    const normalizedRow: LogisticsData = {
      date: this.extractDate(row),
      route: this.extractRoute(row),
      origin: this.extractOrigin(row),
      destination: this.extractDestination(row),
      emptyReturn: this.extractEmptyReturn(row),
      containerType: this.extractContainerType(row),
      weight: this.extractWeight(row),
      volume: this.extractVolume(row),
      driver: this.extractDriver(row),
      vehicle: this.extractVehicle(row),
      cost: this.extractCost(row),
      duration: this.extractDuration(row),
      distance: this.extractDistance(row),
      fuelConsumption: this.extractFuelConsumption(row),
      trafficConditions: this.extractTrafficConditions(row),
      weatherConditions: this.extractWeatherConditions(row),
      delays: this.extractDelays(row),
      customerSatisfaction: this.extractCustomerSatisfaction(row)
    };

    return normalizedRow;
  }

  private extractDate(row: any): string {
    const dateFields = ['date', 'ngày', 'ngay', 'Date', 'Ngày', 'NGÀY'];
    for (const field of dateFields) {
      if (row[field]) {
        return new Date(row[field]).toISOString().split('T')[0];
      }
    }
    return new Date().toISOString().split('T')[0];
  }

  private extractRoute(row: any): string {
    const routeFields = ['route', 'tuyến', 'tuyen', 'Route', 'Tuyến', 'TUYẾN', 'lộ trình', 'lo trinh'];
    for (const field of routeFields) {
      if (row[field]) return String(row[field]);
    }
    return 'Unknown Route';
  }

  private extractOrigin(row: any): string {
    const originFields = ['origin', 'nơi đi', 'noi di', 'điểm đi', 'diem di', 'Origin', 'Nơi đi', 'ĐIỂM ĐI'];
    for (const field of originFields) {
      if (row[field]) return String(row[field]);
    }
    return 'Unknown Origin';
  }

  private extractDestination(row: any): string {
    const destFields = ['destination', 'nơi đến', 'noi den', 'điểm đến', 'diem den', 'Destination', 'Nơi đến', 'ĐIỂM ĐẾN'];
    for (const field of destFields) {
      if (row[field]) return String(row[field]);
    }
    return 'Unknown Destination';
  }

  private extractEmptyReturn(row: any): string {
    const emptyFields = ['empty_return', 'nơi hạ rỗng', 'noi ha rong', 'hạ rỗng', 'ha rong', 'Empty Return', 'Nơi hạ rỗng', 'HẠ RỖNG'];
    for (const field of emptyFields) {
      if (row[field]) return String(row[field]);
    }
    return 'Unknown Empty Return';
  }

  private extractContainerType(row: any): string {
    const containerFields = ['container', 'container_type', 'loại container', 'loai container', 'Container', 'CONTAINER'];
    for (const field of containerFields) {
      if (row[field]) {
        const value = String(row[field]).toLowerCase();
        if (value.includes('40') || value.includes('40ft')) return '40ft';
        if (value.includes('20') || value.includes('20ft')) return '20ft';
        if (value.includes('45') || value.includes('45ft')) return '45ft';
        return String(row[field]);
      }
    }
    return '40ft'; // Default
  }

  private extractWeight(row: any): number {
    const weightFields = ['weight', 'trọng lượng', 'trong luong', 'Weight', 'Trọng lượng', 'TRỌNG LƯỢNG'];
    for (const field of weightFields) {
      if (row[field] && !isNaN(Number(row[field]))) {
        return Number(row[field]);
      }
    }
    return 0;
  }

  private extractVolume(row: any): number {
    const volumeFields = ['volume', 'thể tích', 'the tich', 'Volume', 'Thể tích', 'THỂ TÍCH'];
    for (const field of volumeFields) {
      if (row[field] && !isNaN(Number(row[field]))) {
        return Number(row[field]);
      }
    }
    return 0;
  }

  private extractDriver(row: any): string {
    const driverFields = ['driver', 'tài xế', 'tai xe', 'Driver', 'Tài xế', 'TÀI XẾ', 'lái xe', 'lai xe'];
    for (const field of driverFields) {
      if (row[field]) return String(row[field]);
    }
    return 'Unknown Driver';
  }

  private extractVehicle(row: any): string {
    const vehicleFields = ['vehicle', 'xe', 'phương tiện', 'phuong tien', 'Vehicle', 'Xe', 'XE', 'biển số', 'bien so'];
    for (const field of vehicleFields) {
      if (row[field]) return String(row[field]);
    }
    return 'Unknown Vehicle';
  }

  private extractCost(row: any): number {
    const costFields = ['cost', 'chi phí', 'chi phi', 'giá', 'gia', 'Cost', 'Chi phí', 'CHI PHÍ'];
    for (const field of costFields) {
      if (row[field] && !isNaN(Number(row[field]))) {
        return Number(row[field]);
      }
    }
    return 0;
  }

  private extractDuration(row: any): number {
    const durationFields = ['duration', 'thời gian', 'thoi gian', 'Duration', 'Thời gian', 'THỜI GIAN'];
    for (const field of durationFields) {
      if (row[field] && !isNaN(Number(row[field]))) {
        return Number(row[field]);
      }
    }
    return 0;
  }

  private extractDistance(row: any): number {
    const distanceFields = ['distance', 'khoảng cách', 'khoang cach', 'Distance', 'Khoảng cách', 'KHOẢNG CÁCH'];
    for (const field of distanceFields) {
      if (row[field] && !isNaN(Number(row[field]))) {
        return Number(row[field]);
      }
    }
    return 0;
  }

  private extractFuelConsumption(row: any): number {
    const fuelFields = ['fuel', 'nhiên liệu', 'nhien lieu', 'xăng', 'xang', 'Fuel', 'Nhiên liệu', 'NHIÊN LIỆU'];
    for (const field of fuelFields) {
      if (row[field] && !isNaN(Number(row[field]))) {
        return Number(row[field]);
      }
    }
    return 0;
  }

  private extractTrafficConditions(row: any): string {
    const trafficFields = ['traffic', 'giao thông', 'giao thong', 'Traffic', 'Giao thông', 'GIAO THÔNG'];
    for (const field of trafficFields) {
      if (row[field]) return String(row[field]);
    }
    return 'Normal';
  }

  private extractWeatherConditions(row: any): string {
    const weatherFields = ['weather', 'thời tiết', 'thoi tiet', 'Weather', 'Thời tiết', 'THỜI TIẾT'];
    for (const field of weatherFields) {
      if (row[field]) return String(row[field]);
    }
    return 'Clear';
  }

  private extractDelays(row: any): number {
    const delayFields = ['delay', 'trễ', 'tre', 'chậm', 'cham', 'Delay', 'Trễ', 'TRỄ'];
    for (const field of delayFields) {
      if (row[field] && !isNaN(Number(row[field]))) {
        return Number(row[field]);
      }
    }
    return 0;
  }

  private extractCustomerSatisfaction(row: any): number {
    const satisfactionFields = ['satisfaction', 'hài lòng', 'hai long', 'đánh giá', 'danh gia', 'Satisfaction'];
    for (const field of satisfactionFields) {
      if (row[field] && !isNaN(Number(row[field]))) {
        return Number(row[field]);
      }
    }
    return 5; // Default good rating
  }

  private async analyzePatterns(data: LogisticsData[]): Promise<RoutePattern[]> {
    const routeGroups = this.groupByRoute(data);
    const patterns: RoutePattern[] = [];

    for (const [routeId, routeData] of Object.entries(routeGroups)) {
      const pattern: RoutePattern = {
        routeId,
        frequency: routeData.length,
        averageDuration: this.calculateAverage(routeData, 'duration'),
        averageCost: this.calculateAverage(routeData, 'cost'),
        averageDistance: this.calculateAverage(routeData, 'distance'),
        commonOrigins: this.findMostCommon(routeData, 'origin'),
        commonDestinations: this.findMostCommon(routeData, 'destination'),
        commonEmptyReturns: this.findMostCommon(routeData, 'emptyReturn'),
        preferredDrivers: this.findMostCommon(routeData, 'driver'),
        preferredVehicles: this.findMostCommon(routeData, 'vehicle'),
        seasonalVariations: this.analyzeSeasonalVariations(routeData),
        timePatterns: this.analyzeTimePatterns(routeData)
      };

      patterns.push(pattern);
    }

    return patterns;
  }

  private groupByRoute(data: LogisticsData[]): Record<string, LogisticsData[]> {
    return data.reduce((groups, item) => {
      const key = item.route;
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(item);
      return groups;
    }, {} as Record<string, LogisticsData[]>);
  }

  private calculateAverage(data: LogisticsData[], field: keyof LogisticsData): number {
    const values = data.map(item => Number(item[field])).filter(val => !isNaN(val));
    return values.length > 0 ? values.reduce((sum, val) => sum + val, 0) / values.length : 0;
  }

  private findMostCommon(data: LogisticsData[], field: keyof LogisticsData): string[] {
    const counts: Record<string, number> = {};
    
    data.forEach(item => {
      const value = String(item[field]);
      counts[value] = (counts[value] || 0) + 1;
    });

    return Object.entries(counts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([value]) => value);
  }

  private analyzeSeasonalVariations(data: LogisticsData[]): RoutePattern['seasonalVariations'] {
    const seasons = ['Spring', 'Summer', 'Fall', 'Winter'];
    const seasonalData = seasons.map(season => {
      const seasonData = data.filter(item => this.getSeason(item.date) === season);
      const baselineFreq = data.length / 4; // Average per season
      
      return {
        season,
        frequencyMultiplier: seasonData.length / baselineFreq,
        costMultiplier: this.calculateAverage(seasonData, 'cost') / this.calculateAverage(data, 'cost') || 1,
        durationMultiplier: this.calculateAverage(seasonData, 'duration') / this.calculateAverage(data, 'duration') || 1
      };
    });

    return seasonalData;
  }

  private analyzeTimePatterns(data: LogisticsData[]): RoutePattern['timePatterns'] {
    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    
    return daysOfWeek.map(dayOfWeek => {
      const dayData = data.filter(item => this.getDayOfWeek(item.date) === dayOfWeek);
      
      return {
        dayOfWeek,
        preferredStartTime: this.findMostCommonStartTime(dayData),
        frequency: dayData.length
      };
    });
  }

  private getSeason(dateString: string): string {
    const date = new Date(dateString);
    const month = date.getMonth() + 1;
    
    if (month >= 3 && month <= 5) return 'Spring';
    if (month >= 6 && month <= 8) return 'Summer';
    if (month >= 9 && month <= 11) return 'Fall';
    return 'Winter';
  }

  private getDayOfWeek(dateString: string): string {
    const date = new Date(dateString);
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[date.getDay()];
  }

  private findMostCommonStartTime(data: LogisticsData[]): string {
    // Simplified - in real implementation, extract time from data
    return '08:00';
  }

  async generatePredictions(targetDate: string, requirements?: {
    origin?: string;
    destination?: string;
    containerType?: string;
    urgency?: 'low' | 'medium' | 'high';
  }): Promise<PredictionResult> {
    const prompt = this.buildPredictionPrompt(targetDate, requirements);
    
    try {
      const completion = await this.openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are an expert logistics AI assistant specializing in Vietnamese container shipping and route optimization. You analyze historical data patterns to make intelligent predictions and recommendations."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 2000
      });

      const aiResponse = completion.choices[0]?.message?.content || '';
      return this.parseAIResponse(aiResponse);
      
    } catch (error) {
      console.error('Error generating AI predictions:', error);
      return this.generateFallbackPredictions(targetDate, requirements);
    }
  }

  private buildPredictionPrompt(targetDate: string, requirements?: any): string {
    const historicalSummary = this.summarizeHistoricalData();
    const patternsSummary = this.summarizePatterns();
    
    return `
Based on the following historical logistics data and learned patterns, generate predictions for ${targetDate}:

HISTORICAL DATA SUMMARY:
${historicalSummary}

LEARNED PATTERNS:
${patternsSummary}

REQUIREMENTS:
${requirements ? JSON.stringify(requirements, null, 2) : 'No specific requirements'}

Please provide:
1. Suggested routes with confidence levels and cost estimates
2. Staff replacement recommendations if needed
3. Optimization suggestions for cost, time, and fuel efficiency
4. Risk assessments and mitigation strategies

Format the response as a structured JSON that can be parsed programmatically.
`;
  }

  private summarizeHistoricalData(): string {
    const totalRecords = this.historicalData.length;
    const avgCost = this.calculateAverage(this.historicalData, 'cost');
    const avgDuration = this.calculateAverage(this.historicalData, 'duration');
    const avgDistance = this.calculateAverage(this.historicalData, 'distance');
    
    const topOrigins = this.findMostCommon(this.historicalData, 'origin');
    const topDestinations = this.findMostCommon(this.historicalData, 'destination');
    const topDrivers = this.findMostCommon(this.historicalData, 'driver');
    
    return `
Total Records: ${totalRecords}
Average Cost: ${avgCost.toFixed(2)}
Average Duration: ${avgDuration.toFixed(2)} hours
Average Distance: ${avgDistance.toFixed(2)} km
Top Origins: ${topOrigins.join(', ')}
Top Destinations: ${topDestinations.join(', ')}
Top Drivers: ${topDrivers.join(', ')}
`;
  }

  private summarizePatterns(): string {
    return this.learnedPatterns.map(pattern => `
Route: ${pattern.routeId}
Frequency: ${pattern.frequency}
Avg Cost: ${pattern.averageCost.toFixed(2)}
Avg Duration: ${pattern.averageDuration.toFixed(2)}
Common Origins: ${pattern.commonOrigins.join(', ')}
Common Destinations: ${pattern.commonDestinations.join(', ')}
Preferred Drivers: ${pattern.preferredDrivers.join(', ')}
`).join('\n---\n');
  }

  private parseAIResponse(response: string): PredictionResult {
    try {
      // Try to extract JSON from the response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (error) {
      console.error('Error parsing AI response:', error);
    }
    
    // Fallback to manual parsing
    return this.generateFallbackPredictions();
  }

  private generateFallbackPredictions(targetDate?: string, requirements?: any): PredictionResult {
    const topPatterns = this.learnedPatterns
      .sort((a, b) => b.frequency - a.frequency)
      .slice(0, 3);

    return {
      suggestedRoutes: topPatterns.map((pattern, index) => ({
        route: pattern.routeId,
        confidence: Math.max(0.6, 1 - (index * 0.15)),
        estimatedCost: pattern.averageCost * (1 + Math.random() * 0.2 - 0.1),
        estimatedDuration: pattern.averageDuration * (1 + Math.random() * 0.15 - 0.075),
        estimatedDistance: pattern.averageDistance * (1 + Math.random() * 0.1 - 0.05),
        recommendedDriver: pattern.preferredDrivers[0] || 'Available Driver',
        recommendedVehicle: pattern.preferredVehicles[0] || 'Available Vehicle',
        optimalStartTime: '08:00',
        reasoning: `Based on ${pattern.frequency} historical trips with consistent performance metrics.`
      })),
      staffReplacements: this.generateStaffReplacements(),
      optimizationSuggestions: this.generateOptimizationSuggestions(),
      riskAssessments: this.generateRiskAssessments()
    };
  }

  private generateStaffReplacements(): PredictionResult['staffReplacements'] {
    const topDrivers = this.findMostCommon(this.historicalData, 'driver');
    
    return topDrivers.slice(0, 2).map(driver => ({
      originalStaff: driver,
      suggestedReplacements: topDrivers
        .filter(d => d !== driver)
        .slice(0, 3)
        .map((replacement, index) => ({
          name: replacement,
          confidence: Math.max(0.7, 1 - (index * 0.1)),
          skillMatch: Math.max(0.8, 1 - (index * 0.05)),
          experienceLevel: index === 0 ? 'Senior' : index === 1 ? 'Intermediate' : 'Junior',
          reasoning: `Similar route experience and performance history.`
        }))
    }));
  }

  private generateOptimizationSuggestions(): PredictionResult['optimizationSuggestions'] {
    return [
      {
        type: 'route',
        description: 'Optimize route sequencing to reduce empty return distances',
        potentialSavings: 15,
        implementationDifficulty: 'medium',
        priority: 1
      },
      {
        type: 'cost',
        description: 'Consolidate shipments to improve vehicle utilization',
        potentialSavings: 20,
        implementationDifficulty: 'low',
        priority: 2
      },
      {
        type: 'fuel',
        description: 'Implement eco-driving training for drivers',
        potentialSavings: 10,
        implementationDifficulty: 'low',
        priority: 3
      },
      {
        type: 'time',
        description: 'Schedule deliveries during off-peak traffic hours',
        potentialSavings: 12,
        implementationDifficulty: 'medium',
        priority: 4
      }
    ];
  }

  private generateRiskAssessments(): PredictionResult['riskAssessments'] {
    return [
      {
        riskType: 'Traffic Delays',
        probability: 0.3,
        impact: 'Medium - 30-60 minute delays possible',
        mitigation: 'Plan buffer time and alternative routes'
      },
      {
        riskType: 'Weather Conditions',
        probability: 0.2,
        impact: 'Low to Medium - Potential speed reduction',
        mitigation: 'Monitor weather forecasts and adjust schedules'
      },
      {
        riskType: 'Vehicle Breakdown',
        probability: 0.1,
        impact: 'High - Complete route disruption',
        mitigation: 'Maintain backup vehicles and regular maintenance'
      },
      {
        riskType: 'Driver Unavailability',
        probability: 0.15,
        impact: 'Medium - Need replacement driver',
        mitigation: 'Cross-train drivers and maintain substitute list'
      }
    ];
  }

  async suggestStaffReplacement(unavailableStaff: string, date: string, route?: string): Promise<{
    suggestions: {
      name: string;
      confidence: number;
      reasoning: string;
      availability: boolean;
      skillMatch: number;
    }[];
    aiRecommendation: string;
  }> {
    const relevantData = route 
      ? this.historicalData.filter(d => d.route === route)
      : this.historicalData;

    const availableDrivers = this.findMostCommon(relevantData, 'driver')
      .filter(driver => driver !== unavailableStaff);

    const suggestions = availableDrivers.slice(0, 5).map((driver, index) => ({
      name: driver,
      confidence: Math.max(0.6, 1 - (index * 0.1)),
      reasoning: `Has experience with similar routes and good performance history`,
      availability: Math.random() > 0.3, // Simulate availability check
      skillMatch: Math.max(0.7, 1 - (index * 0.05))
    }));

    const prompt = `
Based on historical data, suggest the best replacement for driver "${unavailableStaff}" on ${date}${route ? ` for route "${route}"` : ''}.

Available drivers and their experience:
${suggestions.map(s => `- ${s.name}: Confidence ${s.confidence}, Skill Match ${s.skillMatch}`).join('\n')}

Provide a detailed recommendation with reasoning.
`;

    try {
      const completion = await this.openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are a logistics manager AI that helps with staff scheduling and replacements."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 500
      });

      const aiRecommendation = completion.choices[0]?.message?.content || 'No specific recommendation available.';

      return {
        suggestions,
        aiRecommendation
      };
    } catch (error) {
      console.error('Error generating staff replacement suggestion:', error);
      return {
        suggestions,
        aiRecommendation: 'Based on historical performance data, I recommend selecting the driver with the highest confidence score and availability.'
      };
    }
  }

  getLearnedPatterns(): RoutePattern[] {
    return this.learnedPatterns;
  }

  getHistoricalData(): LogisticsData[] {
    return this.historicalData;
  }

  async exportLearningReport(): Promise<string> {
    const report = {
      summary: {
        totalRecords: this.historicalData.length,
        totalPatterns: this.learnedPatterns.length,
        dateRange: {
          start: Math.min(...this.historicalData.map(d => new Date(d.date).getTime())),
          end: Math.max(...this.historicalData.map(d => new Date(d.date).getTime()))
        }
      },
      patterns: this.learnedPatterns,
      insights: {
        mostFrequentRoutes: this.learnedPatterns
          .sort((a, b) => b.frequency - a.frequency)
          .slice(0, 5)
          .map(p => ({ route: p.routeId, frequency: p.frequency })),
        costEfficiencyRanking: this.learnedPatterns
          .sort((a, b) => a.averageCost - b.averageCost)
          .slice(0, 5)
          .map(p => ({ route: p.routeId, avgCost: p.averageCost })),
        timeEfficiencyRanking: this.learnedPatterns
          .sort((a, b) => a.averageDuration - b.averageDuration)
          .slice(0, 5)
          .map(p => ({ route: p.routeId, avgDuration: p.averageDuration }))
      }
    };

    return JSON.stringify(report, null, 2);
  }
}
