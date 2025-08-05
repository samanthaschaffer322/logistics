import { AdvancedRouteOptimizer, OptimizationResult, RouteOptimizationRequest } from '@/lib/route-optimization/advanced-optimizer';
import { LogisticsAI, PredictionResult } from '@/lib/ai-learning/logistics-ai';

export interface RealTimeUpdate {
  timestamp: string;
  type: 'route_update' | 'traffic_alert' | 'weather_warning' | 'optimization_complete' | 'ai_insight';
  data: any;
  priority: 'low' | 'medium' | 'high' | 'critical';
  actionRequired: boolean;
}

export interface OptimizationCache {
  [key: string]: {
    result: OptimizationResult;
    timestamp: number;
    ttl: number;
  };
}

export class RealTimeOptimizationService {
  private optimizer: AdvancedRouteOptimizer;
  private ai: LogisticsAI;
  private cache: OptimizationCache = {};
  private subscribers: ((update: RealTimeUpdate) => void)[] = [];
  private isRunning = false;
  private updateInterval: NodeJS.Timeout | null = null;

  constructor(openaiApiKey?: string) {
    this.optimizer = new AdvancedRouteOptimizer();
    this.ai = new LogisticsAI(openaiApiKey || process.env.NEXT_PUBLIC_OPENAI_API_KEY || '');
  }

  // Subscribe to real-time updates
  subscribe(callback: (update: RealTimeUpdate) => void): () => void {
    this.subscribers.push(callback);
    
    // Return unsubscribe function
    return () => {
      const index = this.subscribers.indexOf(callback);
      if (index > -1) {
        this.subscribers.splice(index, 1);
      }
    };
  }

  // Broadcast update to all subscribers
  private broadcast(update: RealTimeUpdate): void {
    this.subscribers.forEach(callback => {
      try {
        callback(update);
      } catch (error) {
        console.error('Error in subscriber callback:', error);
      }
    });
  }

  // Start real-time optimization service
  start(): void {
    if (this.isRunning) return;
    
    this.isRunning = true;
    console.log('🚀 Real-time optimization service started');
    
    // Start periodic updates
    this.updateInterval = setInterval(() => {
      this.performPeriodicOptimization();
    }, 30000); // Every 30 seconds

    // Simulate initial traffic and weather updates
    this.simulateRealTimeUpdates();
  }

  // Stop the service
  stop(): void {
    if (!this.isRunning) return;
    
    this.isRunning = false;
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
    
    console.log('⏹️ Real-time optimization service stopped');
  }

  // Optimize routes with caching and real-time updates
  async optimizeWithRealTime(request: RouteOptimizationRequest): Promise<OptimizationResult> {
    const cacheKey = this.generateCacheKey(request);
    const cached = this.cache[cacheKey];
    
    // Check cache validity (5 minutes TTL)
    if (cached && Date.now() - cached.timestamp < cached.ttl) {
      this.broadcast({
        timestamp: new Date().toISOString(),
        type: 'optimization_complete',
        data: { source: 'cache', result: cached.result },
        priority: 'low',
        actionRequired: false
      });
      
      return cached.result;
    }

    // Perform optimization
    const startTime = Date.now();
    const result = await this.optimizer.optimize(request);
    const optimizationTime = Date.now() - startTime;

    // Cache the result
    this.cache[cacheKey] = {
      result,
      timestamp: Date.now(),
      ttl: 5 * 60 * 1000 // 5 minutes
    };

    // Broadcast completion
    this.broadcast({
      timestamp: new Date().toISOString(),
      type: 'optimization_complete',
      data: { 
        source: 'fresh', 
        result, 
        optimizationTime,
        performance: this.analyzePerformance(result, optimizationTime)
      },
      priority: result.optimizationScore > 80 ? 'high' : 'medium',
      actionRequired: result.unassignedLocations.length > 0
    });

    return result;
  }

  // Generate AI insights in real-time
  async generateRealTimeInsights(context: any): Promise<PredictionResult> {
    try {
      const prediction = await this.ai.generatePredictions(
        new Date().toISOString().split('T')[0],
        context
      );

      this.broadcast({
        timestamp: new Date().toISOString(),
        type: 'ai_insight',
        data: prediction,
        priority: 'medium',
        actionRequired: prediction.riskAssessments.some(risk => risk.probability > 0.7)
      });

      return prediction;
    } catch (error) {
      console.error('Error generating real-time insights:', error);
      throw error;
    }
  }

  // Perform periodic optimization checks
  private async performPeriodicOptimization(): Promise<void> {
    try {
      // Simulate checking for optimization opportunities
      const opportunities = this.detectOptimizationOpportunities();
      
      if (opportunities.length > 0) {
        this.broadcast({
          timestamp: new Date().toISOString(),
          type: 'optimization_complete',
          data: { opportunities },
          priority: 'medium',
          actionRequired: true
        });
      }

      // Clean up expired cache entries
      this.cleanupCache();
      
    } catch (error) {
      console.error('Error in periodic optimization:', error);
    }
  }

  // Simulate real-time traffic and weather updates
  private simulateRealTimeUpdates(): void {
    // Simulate traffic updates
    setTimeout(() => {
      this.broadcast({
        timestamp: new Date().toISOString(),
        type: 'traffic_alert',
        data: {
          location: 'Đường Nguyễn Văn Linh, TP.HCM',
          severity: 'medium',
          delay: '15-20 phút',
          alternativeRoute: 'Sử dụng đường Võ Văn Kiệt',
          affectedRoutes: ['Route-001', 'Route-003']
        },
        priority: 'medium',
        actionRequired: true
      });
    }, 5000);

    // Simulate weather warning
    setTimeout(() => {
      this.broadcast({
        timestamp: new Date().toISOString(),
        type: 'weather_warning',
        data: {
          condition: 'Mưa lớn',
          area: 'Khu vực Bình Dương - Đồng Nai',
          impact: 'Giảm tốc độ 20-30%',
          duration: '2-3 giờ',
          recommendation: 'Điều chỉnh lịch trình giao hàng'
        },
        priority: 'high',
        actionRequired: true
      });
    }, 10000);

    // Simulate route updates
    setTimeout(() => {
      this.broadcast({
        timestamp: new Date().toISOString(),
        type: 'route_update',
        data: {
          routeId: 'Route-002',
          status: 'optimized',
          improvement: '12% tiết kiệm chi phí',
          newEstimatedTime: '3h 45m',
          fuelSavings: '150,000 VND'
        },
        priority: 'high',
        actionRequired: false
      });
    }, 15000);
  }

  // Detect optimization opportunities
  private detectOptimizationOpportunities(): any[] {
    const opportunities = [];
    
    // Simulate detecting opportunities
    if (Math.random() > 0.7) {
      opportunities.push({
        type: 'route_consolidation',
        description: 'Có thể gộp 2 tuyến gần nhau để tiết kiệm chi phí',
        potentialSavings: 200000,
        routes: ['Route-004', 'Route-005']
      });
    }

    if (Math.random() > 0.8) {
      opportunities.push({
        type: 'depot_optimization',
        description: 'Sử dụng depot gần hơn có thể giảm 15km quãng đường',
        potentialSavings: 75000,
        affectedRoutes: ['Route-001']
      });
    }

    return opportunities;
  }

  // Analyze optimization performance
  private analyzePerformance(result: OptimizationResult, optimizationTime: number): any {
    return {
      optimizationTime: `${optimizationTime}ms`,
      efficiency: result.optimizationScore > 90 ? 'excellent' : 
                 result.optimizationScore > 75 ? 'good' : 
                 result.optimizationScore > 60 ? 'fair' : 'needs_improvement',
      routeUtilization: result.routes.reduce((sum, route) => sum + route.utilization, 0) / result.routes.length,
      costEfficiency: result.totalCost / result.totalDistance,
      recommendations: this.generatePerformanceRecommendations(result)
    };
  }

  // Generate performance recommendations
  private generatePerformanceRecommendations(result: OptimizationResult): string[] {
    const recommendations = [];
    
    if (result.optimizationScore < 70) {
      recommendations.push('Cân nhắc tăng số lượng xe để cải thiện hiệu quả');
    }
    
    if (result.unassignedLocations.length > 0) {
      recommendations.push(`Cần xử lý ${result.unassignedLocations.length} địa điểm chưa được phân công`);
    }
    
    const avgUtilization = result.routes.reduce((sum, route) => sum + route.utilization, 0) / result.routes.length;
    if (avgUtilization < 0.7) {
      recommendations.push('Tăng tỷ lệ sử dụng xe bằng cách gộp các tuyến gần nhau');
    }
    
    return recommendations;
  }

  // Generate cache key for optimization requests
  private generateCacheKey(request: RouteOptimizationRequest): string {
    const key = {
      vehicles: request.vehicles.length,
      locations: request.locations.length,
      constraints: request.constraints,
      objectives: request.objectives
    };
    
    return btoa(JSON.stringify(key)).replace(/[^a-zA-Z0-9]/g, '');
  }

  // Clean up expired cache entries
  private cleanupCache(): void {
    const now = Date.now();
    Object.keys(this.cache).forEach(key => {
      const entry = this.cache[key];
      if (now - entry.timestamp > entry.ttl) {
        delete this.cache[key];
      }
    });
  }

  // Get service status
  getStatus(): {
    isRunning: boolean;
    subscribers: number;
    cacheSize: number;
    uptime: string;
  } {
    return {
      isRunning: this.isRunning,
      subscribers: this.subscribers.length,
      cacheSize: Object.keys(this.cache).length,
      uptime: this.isRunning ? 'Active' : 'Stopped'
    };
  }

  // Force cache clear
  clearCache(): void {
    this.cache = {};
    this.broadcast({
      timestamp: new Date().toISOString(),
      type: 'optimization_complete',
      data: { message: 'Cache cleared, fresh optimizations will be performed' },
      priority: 'low',
      actionRequired: false
    });
  }
}

// Singleton instance for global use
let globalOptimizationService: RealTimeOptimizationService | null = null;

export function getRealTimeOptimizationService(): RealTimeOptimizationService {
  if (!globalOptimizationService) {
    globalOptimizationService = new RealTimeOptimizationService();
  }
  return globalOptimizationService;
}

export default RealTimeOptimizationService;
