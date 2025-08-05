export interface PerformanceMetrics {
  loadTime: number;
  renderTime: number;
  optimizationTime: number;
  memoryUsage: number;
  networkLatency: number;
  fps: number;
  timestamp: string;
}

export interface PerformanceAlert {
  type: 'slow_render' | 'high_memory' | 'network_delay' | 'optimization_timeout';
  severity: 'low' | 'medium' | 'high';
  message: string;
  metrics: Partial<PerformanceMetrics>;
  suggestions: string[];
}

export class PerformanceMonitor {
  private metrics: PerformanceMetrics[] = [];
  private alerts: PerformanceAlert[] = [];
  private subscribers: ((alert: PerformanceAlert) => void)[] = [];
  private isMonitoring = false;
  private frameCount = 0;
  private lastFrameTime = 0;
  private currentFPS = 0;

  constructor() {
    this.bindPerformanceObserver();
  }

  // Start performance monitoring
  start(): void {
    if (this.isMonitoring) return;
    
    this.isMonitoring = true;
    console.log('📊 Performance monitoring started');
    
    // Start FPS monitoring
    this.startFPSMonitoring();
    
    // Monitor every 5 seconds
    setInterval(() => {
      this.collectMetrics();
    }, 5000);
  }

  // Stop monitoring
  stop(): void {
    this.isMonitoring = false;
    console.log('📊 Performance monitoring stopped');
  }

  // Subscribe to performance alerts
  subscribe(callback: (alert: PerformanceAlert) => void): () => void {
    this.subscribers.push(callback);
    return () => {
      const index = this.subscribers.indexOf(callback);
      if (index > -1) {
        this.subscribers.splice(index, 1);
      }
    };
  }

  // Measure optimization performance
  measureOptimization<T>(operation: () => Promise<T>): Promise<T & { performanceMetrics: { duration: number; memory: number } }> {
    return new Promise(async (resolve, reject) => {
      const startTime = performance.now();
      const startMemory = this.getMemoryUsage();
      
      try {
        const result = await operation();
        const endTime = performance.now();
        const endMemory = this.getMemoryUsage();
        
        const duration = endTime - startTime;
        const memoryDelta = endMemory - startMemory;
        
        // Check for performance issues
        if (duration > 5000) { // More than 5 seconds
          this.triggerAlert({
            type: 'optimization_timeout',
            severity: 'high',
            message: `Optimization took ${Math.round(duration)}ms - consider reducing complexity`,
            metrics: { optimizationTime: duration },
            suggestions: [
              'Reduce the number of locations or vehicles',
              'Use cached results when possible',
              'Consider breaking large optimizations into smaller chunks'
            ]
          });
        }
        
        resolve({
          ...result,
          performanceMetrics: {
            duration,
            memory: memoryDelta
          }
        } as T & { performanceMetrics: { duration: number; memory: number } });
        
      } catch (error) {
        reject(error);
      }
    });
  }

  // Measure render performance
  measureRender(componentName: string, renderFunction: () => void): void {
    const startTime = performance.now();
    
    renderFunction();
    
    const endTime = performance.now();
    const renderTime = endTime - startTime;
    
    if (renderTime > 100) { // More than 100ms
      this.triggerAlert({
        type: 'slow_render',
        severity: renderTime > 500 ? 'high' : 'medium',
        message: `${componentName} render took ${Math.round(renderTime)}ms`,
        metrics: { renderTime },
        suggestions: [
          'Consider memoizing expensive calculations',
          'Use React.memo for component optimization',
          'Implement virtual scrolling for large lists',
          'Lazy load heavy components'
        ]
      });
    }
  }

  // Get current performance metrics
  getCurrentMetrics(): PerformanceMetrics {
    return {
      loadTime: this.getPageLoadTime(),
      renderTime: this.getAverageRenderTime(),
      optimizationTime: this.getAverageOptimizationTime(),
      memoryUsage: this.getMemoryUsage(),
      networkLatency: this.getNetworkLatency(),
      fps: this.currentFPS,
      timestamp: new Date().toISOString()
    };
  }

  // Get performance history
  getMetricsHistory(): PerformanceMetrics[] {
    return [...this.metrics];
  }

  // Get recent alerts
  getRecentAlerts(): PerformanceAlert[] {
    return [...this.alerts].slice(0, 10);
  }

  // Clear alerts
  clearAlerts(): void {
    this.alerts = [];
  }

  // Private methods
  private bindPerformanceObserver(): void {
    if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry) => {
            if (entry.entryType === 'navigation') {
              const navEntry = entry as PerformanceNavigationTiming;
              if (navEntry.loadEventEnd - navEntry.navigationStart > 3000) {
                this.triggerAlert({
                  type: 'network_delay',
                  severity: 'medium',
                  message: `Page load took ${Math.round(navEntry.loadEventEnd - navEntry.navigationStart)}ms`,
                  metrics: { loadTime: navEntry.loadEventEnd - navEntry.navigationStart },
                  suggestions: [
                    'Optimize bundle size',
                    'Enable code splitting',
                    'Use CDN for static assets',
                    'Implement service worker caching'
                  ]
                });
              }
            }
          });
        });
        
        observer.observe({ entryTypes: ['navigation', 'measure'] });
      } catch (error) {
        console.warn('Performance Observer not supported:', error);
      }
    }
  }

  private startFPSMonitoring(): void {
    if (typeof window === 'undefined') return;
    
    const measureFPS = () => {
      if (!this.isMonitoring) return;
      
      const now = performance.now();
      this.frameCount++;
      
      if (now - this.lastFrameTime >= 1000) {
        this.currentFPS = Math.round((this.frameCount * 1000) / (now - this.lastFrameTime));
        this.frameCount = 0;
        this.lastFrameTime = now;
        
        // Alert if FPS is too low
        if (this.currentFPS < 30) {
          this.triggerAlert({
            type: 'slow_render',
            severity: this.currentFPS < 15 ? 'high' : 'medium',
            message: `Low FPS detected: ${this.currentFPS} fps`,
            metrics: { fps: this.currentFPS },
            suggestions: [
              'Reduce map complexity',
              'Limit number of markers displayed',
              'Use canvas rendering for large datasets',
              'Implement viewport culling'
            ]
          });
        }
      }
      
      requestAnimationFrame(measureFPS);
    };
    
    requestAnimationFrame(measureFPS);
  }

  private collectMetrics(): void {
    if (!this.isMonitoring) return;
    
    const metrics = this.getCurrentMetrics();
    this.metrics.push(metrics);
    
    // Keep only last 100 metrics
    if (this.metrics.length > 100) {
      this.metrics = this.metrics.slice(-100);
    }
    
    // Check for memory issues
    if (metrics.memoryUsage > 100) { // More than 100MB
      this.triggerAlert({
        type: 'high_memory',
        severity: metrics.memoryUsage > 200 ? 'high' : 'medium',
        message: `High memory usage: ${Math.round(metrics.memoryUsage)}MB`,
        metrics: { memoryUsage: metrics.memoryUsage },
        suggestions: [
          'Clear optimization cache periodically',
          'Limit number of routes displayed',
          'Use pagination for large datasets',
          'Implement memory cleanup on component unmount'
        ]
      });
    }
  }

  private triggerAlert(alert: PerformanceAlert): void {
    this.alerts.unshift(alert);
    
    // Keep only last 50 alerts
    if (this.alerts.length > 50) {
      this.alerts = this.alerts.slice(0, 50);
    }
    
    // Notify subscribers
    this.subscribers.forEach(callback => {
      try {
        callback(alert);
      } catch (error) {
        console.error('Error in performance alert callback:', error);
      }
    });
  }

  private getPageLoadTime(): number {
    if (typeof window !== 'undefined' && window.performance && window.performance.timing) {
      return window.performance.timing.loadEventEnd - window.performance.timing.navigationStart;
    }
    return 0;
  }

  private getAverageRenderTime(): number {
    const renderMetrics = this.metrics.filter(m => m.renderTime > 0);
    if (renderMetrics.length === 0) return 0;
    return renderMetrics.reduce((sum, m) => sum + m.renderTime, 0) / renderMetrics.length;
  }

  private getAverageOptimizationTime(): number {
    const optimizationMetrics = this.metrics.filter(m => m.optimizationTime > 0);
    if (optimizationMetrics.length === 0) return 0;
    return optimizationMetrics.reduce((sum, m) => sum + m.optimizationTime, 0) / optimizationMetrics.length;
  }

  private getMemoryUsage(): number {
    if (typeof window !== 'undefined' && 'performance' in window && 'memory' in (window.performance as any)) {
      const memory = (window.performance as any).memory;
      return memory.usedJSHeapSize / 1024 / 1024; // Convert to MB
    }
    return 0;
  }

  private getNetworkLatency(): number {
    if (typeof window !== 'undefined' && window.performance && window.performance.timing) {
      return window.performance.timing.responseStart - window.performance.timing.requestStart;
    }
    return 0;
  }
}

// Singleton instance
let globalPerformanceMonitor: PerformanceMonitor | null = null;

export function getPerformanceMonitor(): PerformanceMonitor {
  if (!globalPerformanceMonitor) {
    globalPerformanceMonitor = new PerformanceMonitor();
  }
  return globalPerformanceMonitor;
}

export default PerformanceMonitor;
