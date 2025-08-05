// Smart Route Optimizer with AI capabilities inspired by Sparka
import { OpenAI } from 'openai';

export interface SmartRouteRequest {
  origin: {
    lat: number;
    lng: number;
    address: string;
    province: string;
  };
  destination: {
    lat: number;
    lng: number;
    address: string;
    province: string;
  };
  waypoints?: Array<{
    lat: number;
    lng: number;
    address: string;
    province: string;
    priority: 'high' | 'medium' | 'low';
    timeWindow?: {
      start: string;
      end: string;
    };
  }>;
  vehicleType: '20ft' | '40ft' | 'truck' | 'van';
  cargoWeight: number;
  cargoType: string;
  urgency: 'urgent' | 'normal' | 'flexible';
  preferences: {
    prioritize: 'time' | 'cost' | 'fuel' | 'safety';
    avoidTolls: boolean;
    avoidTraffic: boolean;
    preferHighways: boolean;
  };
}

export interface SmartRouteResult {
  routes: Array<{
    id: string;
    name: string;
    distance: number;
    duration: number;
    cost: number;
    fuelConsumption: number;
    tollCosts: number;
    confidence: number;
    waypoints: Array<{
      lat: number;
      lng: number;
      address: string;
      estimatedArrival: string;
      estimatedDeparture: string;
    }>;
    risks: Array<{
      type: 'traffic' | 'weather' | 'road' | 'security';
      severity: 'low' | 'medium' | 'high';
      description: string;
      mitigation: string;
    }>;
    aiInsights: {
      recommendation: string;
      reasoning: string;
      alternatives: string[];
      optimizations: string[];
    };
  }>;
  summary: {
    bestRoute: string;
    totalSavings: number;
    estimatedDelivery: string;
    weatherImpact: string;
    trafficImpact: string;
  };
  aiAnalysis: {
    marketInsights: string;
    seasonalFactors: string;
    recommendations: string[];
    riskAssessment: string;
  };
}

export class SmartRouteOptimizer {
  private openai: OpenAI;
  private vietnamProvinces = [
    'Hà Nội', 'TP. Hồ Chí Minh', 'Đà Nẵng', 'Hải Phòng', 'Cần Thơ',
    'An Giang', 'Bà Rịa - Vũng Tàu', 'Bắc Giang', 'Bắc Kạn', 'Bạc Liêu',
    'Bắc Ninh', 'Bến Tre', 'Bình Định', 'Bình Dương', 'Bình Phước',
    'Bình Thuận', 'Cà Mau', 'Cao Bằng', 'Đắk Lắk', 'Đắk Nông',
    'Điện Biên', 'Đồng Nai', 'Đồng Tháp', 'Gia Lai', 'Hà Giang',
    'Hà Nam', 'Hà Tĩnh', 'Hải Dương', 'Hậu Giang', 'Hòa Bình',
    'Hưng Yên', 'Khánh Hòa', 'Kiên Giang', 'Kon Tum', 'Lai Châu',
    'Lâm Đồng', 'Lạng Sơn', 'Lào Cai', 'Long An', 'Nam Định',
    'Nghệ An', 'Ninh Bình', 'Ninh Thuận', 'Phú Thọ', 'Phú Yên',
    'Quảng Bình', 'Quảng Nam', 'Quảng Ngãi', 'Quảng Ninh', 'Quảng Trị',
    'Sóc Trăng', 'Sơn La', 'Tây Ninh', 'Thái Bình', 'Thái Nguyên',
    'Thanh Hóa', 'Thừa Thiên Huế', 'Tiền Giang', 'Trà Vinh', 'Tuyên Quang',
    'Vĩnh Long', 'Vĩnh Phúc', 'Yên Bái'
  ];

  constructor(apiKey?: string) {
    this.openai = new OpenAI({
      apiKey: apiKey || process.env.OPENAI_API_KEY || 'sk-Is6s1p1BqoYf21xBywtG2w'
    });
  }

  async optimizeRoute(request: SmartRouteRequest): Promise<SmartRouteResult> {
    try {
      // Generate multiple route options using AI
      const routes = await this.generateSmartRoutes(request);
      
      // Analyze each route with AI insights
      const analyzedRoutes = await Promise.all(
        routes.map(route => this.analyzeRouteWithAI(route, request))
      );

      // Generate overall AI analysis
      const aiAnalysis = await this.generateAIAnalysis(request, analyzedRoutes);

      // Determine best route
      const bestRoute = this.selectBestRoute(analyzedRoutes, request.preferences.prioritize);

      return {
        routes: analyzedRoutes,
        summary: {
          bestRoute: bestRoute.id,
          totalSavings: this.calculateSavings(analyzedRoutes),
          estimatedDelivery: bestRoute.waypoints[bestRoute.waypoints.length - 1]?.estimatedArrival || '',
          weatherImpact: await this.getWeatherImpact(request),
          trafficImpact: await this.getTrafficImpact(request)
        },
        aiAnalysis
      };

    } catch (error) {
      console.error('Smart Route Optimizer Error:', error);
      throw new Error('Failed to optimize route');
    }
  }

  private async generateSmartRoutes(request: SmartRouteRequest): Promise<any[]> {
    // Generate base routes using different algorithms
    const routes = [
      {
        id: 'fastest',
        name: 'Tuyến nhanh nhất',
        distance: this.calculateDistance(request.origin, request.destination),
        duration: 0,
        cost: 0,
        fuelConsumption: 0,
        tollCosts: 0,
        confidence: 0.9,
        waypoints: []
      },
      {
        id: 'cheapest',
        name: 'Tuyến tiết kiệm nhất',
        distance: this.calculateDistance(request.origin, request.destination) * 1.1,
        duration: 0,
        cost: 0,
        fuelConsumption: 0,
        tollCosts: 0,
        confidence: 0.85,
        waypoints: []
      },
      {
        id: 'balanced',
        name: 'Tuyến cân bằng',
        distance: this.calculateDistance(request.origin, request.destination) * 1.05,
        duration: 0,
        cost: 0,
        fuelConsumption: 0,
        tollCosts: 0,
        confidence: 0.95,
        waypoints: []
      }
    ];

    // Calculate detailed metrics for each route
    return routes.map(route => ({
      ...route,
      duration: this.estimateDuration(route.distance, request.vehicleType),
      cost: this.calculateRouteCost(route.distance, request.vehicleType, request.cargoWeight),
      fuelConsumption: this.calculateFuelConsumption(route.distance, request.vehicleType),
      tollCosts: this.estimateTollCosts(route.distance, request.preferences.avoidTolls),
      waypoints: this.generateWaypoints(request.origin, request.destination, request.waypoints)
    }));
  }

  private async analyzeRouteWithAI(route: any, request: SmartRouteRequest): Promise<any> {
    try {
      const prompt = `Analyze this logistics route in Vietnam:

Route: ${route.name}
Origin: ${request.origin.address}, ${request.origin.province}
Destination: ${request.destination.address}, ${request.destination.province}
Distance: ${route.distance}km
Vehicle: ${request.vehicleType}
Cargo: ${request.cargoWeight}kg of ${request.cargoType}
Priority: ${request.preferences.prioritize}

Provide insights on:
1. Route efficiency and optimization opportunities
2. Potential risks (traffic, weather, road conditions)
3. Cost optimization suggestions
4. Alternative route recommendations
5. Vietnamese logistics considerations (regulations, customs, etc.)

Format as JSON with: recommendation, reasoning, alternatives, optimizations, risks`;

      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a Vietnamese logistics expert AI. Provide detailed route analysis with local knowledge.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 1500,
        temperature: 0.3
      });

      const aiResponse = completion.choices[0]?.message?.content;
      let aiInsights;

      try {
        aiInsights = JSON.parse(aiResponse || '{}');
      } catch {
        aiInsights = {
          recommendation: aiResponse || 'Route analysis completed',
          reasoning: 'AI analysis provided general recommendations',
          alternatives: ['Consider alternative timing', 'Check traffic conditions'],
          optimizations: ['Optimize loading', 'Plan fuel stops']
        };
      }

      // Generate risk assessment
      const risks = await this.assessRouteRisks(route, request);

      return {
        ...route,
        risks,
        aiInsights
      };

    } catch (error) {
      console.error('AI Route Analysis Error:', error);
      return {
        ...route,
        risks: [],
        aiInsights: {
          recommendation: 'Route analysis unavailable',
          reasoning: 'AI analysis temporarily unavailable',
          alternatives: [],
          optimizations: []
        }
      };
    }
  }

  private async generateAIAnalysis(request: SmartRouteRequest, routes: any[]): Promise<any> {
    try {
      const prompt = `Provide comprehensive logistics analysis for Vietnam route optimization:

Origin Province: ${request.origin.province}
Destination Province: ${request.destination.province}
Vehicle Type: ${request.vehicleType}
Cargo: ${request.cargoWeight}kg of ${request.cargoType}
Urgency: ${request.urgency}

Routes analyzed: ${routes.length}
Best route distance: ${Math.min(...routes.map(r => r.distance))}km

Provide analysis on:
1. Market insights for this route corridor
2. Seasonal factors affecting logistics
3. Strategic recommendations
4. Risk assessment summary
5. Vietnamese logistics market considerations

Keep response concise and actionable.`;

      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a Vietnamese logistics market expert. Provide strategic insights.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 800,
        temperature: 0.4
      });

      const response = completion.choices[0]?.message?.content || '';

      return {
        marketInsights: this.extractSection(response, 'market') || 'Market analysis completed',
        seasonalFactors: this.extractSection(response, 'seasonal') || 'Seasonal factors considered',
        recommendations: this.extractRecommendations(response),
        riskAssessment: this.extractSection(response, 'risk') || 'Risk assessment completed'
      };

    } catch (error) {
      console.error('AI Analysis Error:', error);
      return {
        marketInsights: 'Market analysis temporarily unavailable',
        seasonalFactors: 'Seasonal analysis temporarily unavailable',
        recommendations: ['Optimize route timing', 'Monitor traffic conditions', 'Plan fuel stops'],
        riskAssessment: 'Risk assessment temporarily unavailable'
      };
    }
  }

  private async assessRouteRisks(route: any, request: SmartRouteRequest): Promise<any[]> {
    const risks = [];

    // Traffic risk assessment
    if (route.distance > 500) {
      risks.push({
        type: 'traffic',
        severity: 'medium',
        description: 'Long-distance route may encounter heavy traffic',
        mitigation: 'Plan departure during off-peak hours'
      });
    }

    // Weather risk for certain seasons
    const currentMonth = new Date().getMonth();
    if (currentMonth >= 5 && currentMonth <= 9) { // Rainy season
      risks.push({
        type: 'weather',
        severity: 'medium',
        description: 'Rainy season may cause delays',
        mitigation: 'Monitor weather forecasts and plan extra time'
      });
    }

    // Road condition risks for certain provinces
    const mountainousProvinces = ['Lào Cai', 'Hà Giang', 'Cao Bằng', 'Lai Châu', 'Điện Biên'];
    if (mountainousProvinces.includes(request.origin.province) || 
        mountainousProvinces.includes(request.destination.province)) {
      risks.push({
        type: 'road',
        severity: 'high',
        description: 'Mountainous terrain with challenging road conditions',
        mitigation: 'Use experienced drivers and check vehicle condition'
      });
    }

    // Security risks for high-value cargo
    if (request.cargoWeight > 10000 || request.cargoType.toLowerCase().includes('electronics')) {
      risks.push({
        type: 'security',
        severity: 'medium',
        description: 'High-value cargo requires additional security measures',
        mitigation: 'Consider GPS tracking and security escort'
      });
    }

    return risks;
  }

  private calculateDistance(origin: any, destination: any): number {
    // Haversine formula for distance calculation
    const R = 6371; // Earth's radius in km
    const dLat = this.toRad(destination.lat - origin.lat);
    const dLon = this.toRad(destination.lng - origin.lng);
    const lat1 = this.toRad(origin.lat);
    const lat2 = this.toRad(destination.lat);

    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    
    return Math.round(R * c);
  }

  private toRad(value: number): number {
    return value * Math.PI / 180;
  }

  private estimateDuration(distance: number, vehicleType: string): number {
    const speedMap = {
      '20ft': 45, // km/h average
      '40ft': 40,
      'truck': 50,
      'van': 55
    };
    
    const avgSpeed = speedMap[vehicleType as keyof typeof speedMap] || 45;
    return Math.round((distance / avgSpeed) * 60); // minutes
  }

  private calculateRouteCost(distance: number, vehicleType: string, cargoWeight: number): number {
    const baseCostPerKm = {
      '20ft': 15000, // VND per km
      '40ft': 20000,
      'truck': 12000,
      'van': 8000
    };

    const base = baseCostPerKm[vehicleType as keyof typeof baseCostPerKm] || 15000;
    const weightMultiplier = 1 + (cargoWeight / 20000); // Increase cost for heavier cargo
    
    return Math.round(distance * base * weightMultiplier);
  }

  private calculateFuelConsumption(distance: number, vehicleType: string): number {
    const fuelEfficiency = {
      '20ft': 8, // km per liter
      '40ft': 6,
      'truck': 10,
      'van': 12
    };

    const efficiency = fuelEfficiency[vehicleType as keyof typeof fuelEfficiency] || 8;
    return Math.round((distance / efficiency) * 100) / 100; // liters
  }

  private estimateTollCosts(distance: number, avoidTolls: boolean): number {
    if (avoidTolls) return 0;
    
    // Estimate toll costs based on distance (Vietnam highway tolls)
    const tollPerKm = 1000; // VND per km on highways
    return Math.round(distance * 0.6 * tollPerKm); // Assume 60% highway usage
  }

  private generateWaypoints(origin: any, destination: any, waypoints?: any[]): any[] {
    const result = [
      {
        lat: origin.lat,
        lng: origin.lng,
        address: origin.address,
        estimatedArrival: new Date().toISOString(),
        estimatedDeparture: new Date(Date.now() + 30 * 60000).toISOString() // 30 min loading
      }
    ];

    if (waypoints) {
      waypoints.forEach((wp, index) => {
        result.push({
          lat: wp.lat,
          lng: wp.lng,
          address: wp.address,
          estimatedArrival: new Date(Date.now() + (index + 2) * 60 * 60000).toISOString(),
          estimatedDeparture: new Date(Date.now() + (index + 2.5) * 60 * 60000).toISOString()
        });
      });
    }

    result.push({
      lat: destination.lat,
      lng: destination.lng,
      address: destination.address,
      estimatedArrival: new Date(Date.now() + 8 * 60 * 60000).toISOString(), // 8 hours later
      estimatedDeparture: new Date(Date.now() + 8 * 60 * 60000).toISOString()
    });

    return result;
  }

  private selectBestRoute(routes: any[], priority: string): any {
    switch (priority) {
      case 'time':
        return routes.reduce((best, current) => 
          current.duration < best.duration ? current : best
        );
      case 'cost':
        return routes.reduce((best, current) => 
          current.cost < best.cost ? current : best
        );
      case 'fuel':
        return routes.reduce((best, current) => 
          current.fuelConsumption < best.fuelConsumption ? current : best
        );
      default:
        return routes.reduce((best, current) => 
          current.confidence > best.confidence ? current : best
        );
    }
  }

  private calculateSavings(routes: any[]): number {
    if (routes.length < 2) return 0;
    
    const costs = routes.map(r => r.cost);
    const maxCost = Math.max(...costs);
    const minCost = Math.min(...costs);
    
    return maxCost - minCost;
  }

  private async getWeatherImpact(request: SmartRouteRequest): Promise<string> {
    // In a real implementation, you'd call a weather API
    return 'Thời tiết thuận lợi cho vận chuyển';
  }

  private async getTrafficImpact(request: SmartRouteRequest): Promise<string> {
    // In a real implementation, you'd call a traffic API
    return 'Giao thông bình thường';
  }

  private extractSection(text: string, keyword: string): string {
    const lines = text.split('\n');
    const sectionStart = lines.findIndex(line => 
      line.toLowerCase().includes(keyword.toLowerCase())
    );
    
    if (sectionStart === -1) return '';
    
    const sectionLines = [];
    for (let i = sectionStart + 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line && !line.match(/^\d+\./)) {
        sectionLines.push(line);
      } else if (sectionLines.length > 0) {
        break;
      }
    }
    
    return sectionLines.join(' ').substring(0, 200);
  }

  private extractRecommendations(text: string): string[] {
    const recommendations = [];
    const lines = text.split('\n');
    
    for (const line of lines) {
      if (line.match(/^[\d\-\*]\s*/) || line.toLowerCase().includes('recommend')) {
        const clean = line.replace(/^[\d\-\*\s]*/, '').trim();
        if (clean.length > 10) {
          recommendations.push(clean.substring(0, 100));
        }
      }
    }
    
    return recommendations.slice(0, 5);
  }
}

// Export singleton instance
export const smartRouteOptimizer = new SmartRouteOptimizer();
