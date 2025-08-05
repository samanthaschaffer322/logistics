export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
  accessCount: number;
  lastAccessed: number;
  priority: 'low' | 'medium' | 'high';
}

export interface CacheStats {
  totalEntries: number;
  hitRate: number;
  missRate: number;
  memoryUsage: number;
  oldestEntry: number;
  newestEntry: number;
}

export class SmartCache {
  private cache = new Map<string, CacheEntry<any>>();
  private maxSize: number;
  private hits = 0;
  private misses = 0;
  private cleanupInterval: NodeJS.Timeout | null = null;

  constructor(maxSize = 1000) {
    this.maxSize = maxSize;
    this.startCleanup();
  }

  // Get item from cache
  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      this.misses++;
      return null;
    }

    // Check if expired
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      this.misses++;
      return null;
    }

    // Update access statistics
    entry.accessCount++;
    entry.lastAccessed = Date.now();
    this.hits++;

    return entry.data;
  }

  // Set item in cache
  set<T>(key: string, data: T, ttl = 5 * 60 * 1000, priority: 'low' | 'medium' | 'high' = 'medium'): void {
    // If cache is full, make room
    if (this.cache.size >= this.maxSize) {
      this.evictLeastUsed();
    }

    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      ttl,
      accessCount: 1,
      lastAccessed: Date.now(),
      priority
    };

    this.cache.set(key, entry);
  }

  // Check if key exists and is valid
  has(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) return false;
    
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return false;
    }
    
    return true;
  }

  // Delete specific key
  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  // Clear all cache
  clear(): void {
    this.cache.clear();
    this.hits = 0;
    this.misses = 0;
  }

  // Get cache statistics
  getStats(): CacheStats {
    const entries = Array.from(this.cache.values());
    const now = Date.now();
    
    return {
      totalEntries: this.cache.size,
      hitRate: this.hits + this.misses > 0 ? this.hits / (this.hits + this.misses) : 0,
      missRate: this.hits + this.misses > 0 ? this.misses / (this.hits + this.misses) : 0,
      memoryUsage: this.estimateMemoryUsage(),
      oldestEntry: entries.length > 0 ? Math.min(...entries.map(e => now - e.timestamp)) : 0,
      newestEntry: entries.length > 0 ? Math.max(...entries.map(e => now - e.timestamp)) : 0
    };
  }

  // Get or set with factory function
  async getOrSet<T>(
    key: string, 
    factory: () => Promise<T>, 
    ttl = 5 * 60 * 1000,
    priority: 'low' | 'medium' | 'high' = 'medium'
  ): Promise<T> {
    const cached = this.get<T>(key);
    if (cached !== null) {
      return cached;
    }

    const data = await factory();
    this.set(key, data, ttl, priority);
    return data;
  }

  // Preload cache with predicted data
  async preload<T>(predictions: { key: string; factory: () => Promise<T>; priority?: 'low' | 'medium' | 'high' }[]): Promise<void> {
    const promises = predictions.map(async ({ key, factory, priority = 'low' }) => {
      if (!this.has(key)) {
        try {
          const data = await factory();
          this.set(key, data, 10 * 60 * 1000, priority); // 10 minutes TTL for preloaded data
        } catch (error) {
          console.warn(`Failed to preload cache key ${key}:`, error);
        }
      }
    });

    await Promise.allSettled(promises);
  }

  // Invalidate cache entries matching pattern
  invalidatePattern(pattern: RegExp): number {
    let count = 0;
    for (const key of this.cache.keys()) {
      if (pattern.test(key)) {
        this.cache.delete(key);
        count++;
      }
    }
    return count;
  }

  // Get cache keys matching pattern
  getKeysMatching(pattern: RegExp): string[] {
    return Array.from(this.cache.keys()).filter(key => pattern.test(key));
  }

  // Refresh specific cache entry
  async refresh<T>(key: string, factory: () => Promise<T>): Promise<T> {
    this.delete(key);
    const data = await factory();
    this.set(key, data);
    return data;
  }

  // Private methods
  private evictLeastUsed(): void {
    let leastUsedKey: string | null = null;
    let leastUsedScore = Infinity;

    for (const [key, entry] of this.cache.entries()) {
      // Calculate score based on access count, recency, and priority
      const priorityMultiplier = entry.priority === 'high' ? 3 : entry.priority === 'medium' ? 2 : 1;
      const recencyScore = (Date.now() - entry.lastAccessed) / 1000; // seconds since last access
      const score = recencyScore / (entry.accessCount * priorityMultiplier);

      if (score < leastUsedScore) {
        leastUsedScore = score;
        leastUsedKey = key;
      }
    }

    if (leastUsedKey) {
      this.cache.delete(leastUsedKey);
    }
  }

  private startCleanup(): void {
    // Clean up expired entries every minute
    this.cleanupInterval = setInterval(() => {
      this.cleanupExpired();
    }, 60 * 1000);
  }

  private cleanupExpired(): void {
    const now = Date.now();
    const keysToDelete: string[] = [];

    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        keysToDelete.push(key);
      }
    }

    keysToDelete.forEach(key => this.cache.delete(key));
  }

  private estimateMemoryUsage(): number {
    // Rough estimation of memory usage in bytes
    let size = 0;
    for (const [key, entry] of this.cache.entries()) {
      size += key.length * 2; // UTF-16 characters
      size += JSON.stringify(entry.data).length * 2;
      size += 64; // Overhead for entry metadata
    }
    return size;
  }

  // Cleanup on destruction
  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
    this.clear();
  }
}

// Specialized caches for different data types
export class RouteOptimizationCache extends SmartCache {
  constructor() {
    super(100); // Smaller cache for optimization results
  }

  generateRouteKey(vehicles: any[], locations: any[], constraints: any): string {
    const hash = btoa(JSON.stringify({
      vehicleCount: vehicles.length,
      locationCount: locations.length,
      constraints
    })).replace(/[^a-zA-Z0-9]/g, '');
    return `route_${hash}`;
  }
}

export class AIInsightsCache extends SmartCache {
  constructor() {
    super(200); // Medium cache for AI insights
  }

  generateInsightKey(context: any, date: string): string {
    const hash = btoa(JSON.stringify({ context, date })).replace(/[^a-zA-Z0-9]/g, '');
    return `ai_insight_${hash}`;
  }
}

export class MapDataCache extends SmartCache {
  constructor() {
    super(500); // Larger cache for map data
  }

  generateMapKey(bounds: any, zoom: number): string {
    const hash = btoa(JSON.stringify({ bounds, zoom })).replace(/[^a-zA-Z0-9]/g, '');
    return `map_${hash}`;
  }
}

// Global cache instances
let routeCache: RouteOptimizationCache | null = null;
let aiCache: AIInsightsCache | null = null;
let mapCache: MapDataCache | null = null;

export function getRouteCache(): RouteOptimizationCache {
  if (!routeCache) {
    routeCache = new RouteOptimizationCache();
  }
  return routeCache;
}

export function getAICache(): AIInsightsCache {
  if (!aiCache) {
    aiCache = new AIInsightsCache();
  }
  return aiCache;
}

export function getMapCache(): MapDataCache {
  if (!mapCache) {
    mapCache = new MapDataCache();
  }
  return mapCache;
}

export default SmartCache;
