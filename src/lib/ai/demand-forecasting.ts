/**
 * AI-Powered Demand Forecasting Module
 * Inspired by logistics-ai-optimization repository
 * Implements multiple forecasting algorithms for logistics optimization
 */

export interface HistoricalData {
  date: string
  demand: number
  seasonality?: number
  trend?: number
}

export interface ForecastResult {
  period: string
  predictedDemand: number
  confidence: number
  trend: 'increasing' | 'decreasing' | 'stable'
  seasonalityFactor: number
}

export interface ForecastOptions {
  method: 'moving_average' | 'exponential_smoothing' | 'linear_regression' | 'ai_hybrid'
  windowSize?: number
  alpha?: number // For exponential smoothing
  periods?: number // Number of periods to forecast
  includeSeasonality?: boolean
}

/**
 * Moving Average Forecasting
 */
export function movingAverageForecasting(
  historicalData: number[],
  windowSize: number = 3
): number[] {
  const forecast: number[] = []
  const dataLength = historicalData.length

  // Calculate moving average for each period
  for (let i = 0; i <= dataLength - windowSize; i++) {
    const window = historicalData.slice(i, i + windowSize)
    const average = window.reduce((sum, value) => sum + value, 0) / windowSize
    forecast.push(average)
  }

  // Extend forecast for future periods
  if (forecast.length > 0) {
    const lastAverage = forecast[forecast.length - 1]
    const remainingPeriods = Math.max(0, dataLength - forecast.length)
    for (let i = 0; i < remainingPeriods; i++) {
      forecast.push(lastAverage)
    }
  }

  return forecast
}

/**
 * Exponential Smoothing Forecasting
 */
export function exponentialSmoothingForecasting(
  historicalData: number[],
  alpha: number = 0.3
): number[] {
  if (historicalData.length === 0) return []
  
  const forecast: number[] = [historicalData[0]]
  
  for (let i = 1; i < historicalData.length; i++) {
    const smoothed = alpha * historicalData[i] + (1 - alpha) * forecast[i - 1]
    forecast.push(smoothed)
  }
  
  return forecast
}

/**
 * Linear Regression Forecasting
 */
export function linearRegressionForecasting(
  historicalData: number[],
  periods: number = 1
): number[] {
  const n = historicalData.length
  if (n < 2) return historicalData

  // Calculate linear regression coefficients
  const xValues = Array.from({ length: n }, (_, i) => i + 1)
  const yValues = historicalData

  const sumX = xValues.reduce((sum, x) => sum + x, 0)
  const sumY = yValues.reduce((sum, y) => sum + y, 0)
  const sumXY = xValues.reduce((sum, x, i) => sum + x * yValues[i], 0)
  const sumXX = xValues.reduce((sum, x) => sum + x * x, 0)

  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX)
  const intercept = (sumY - slope * sumX) / n

  // Generate forecast
  const forecast: number[] = []
  for (let i = 1; i <= n + periods; i++) {
    forecast.push(slope * i + intercept)
  }

  return forecast
}

/**
 * Advanced AI Hybrid Forecasting
 * Combines multiple methods with confidence weighting
 */
export function aiHybridForecasting(
  historicalData: HistoricalData[],
  options: ForecastOptions = {}
): ForecastResult[] {
  const {
    periods = 6,
    windowSize = 3,
    alpha = 0.3,
    includeSeasonality = true
  } = options

  const demands = historicalData.map(d => d.demand)
  
  // Apply different forecasting methods
  const maForecast = movingAverageForecasting(demands, windowSize)
  const esForecast = exponentialSmoothingForecasting(demands, alpha)
  const lrForecast = linearRegressionForecasting(demands, periods)

  // Calculate trend
  const trend = calculateTrend(demands)
  
  // Calculate seasonality if requested
  const seasonality = includeSeasonality ? calculateSeasonality(historicalData) : null

  // Combine forecasts with weighted average
  const results: ForecastResult[] = []
  const startDate = new Date(historicalData[historicalData.length - 1]?.date || new Date())

  for (let i = 0; i < periods; i++) {
    const futureDate = new Date(startDate)
    futureDate.setMonth(futureDate.getMonth() + i + 1)

    // Weighted combination of forecasts
    const maWeight = 0.3
    const esWeight = 0.4
    const lrWeight = 0.3

    const maValue = maForecast[Math.min(i + demands.length, maForecast.length - 1)] || 0
    const esValue = esForecast[Math.min(i + demands.length, esForecast.length - 1)] || 0
    const lrValue = lrForecast[Math.min(i + demands.length, lrForecast.length - 1)] || 0

    let predictedDemand = maWeight * maValue + esWeight * esValue + lrWeight * lrValue

    // Apply seasonality adjustment
    const seasonalityFactor = seasonality ? getSeasonalityFactor(seasonality, futureDate.getMonth()) : 1
    predictedDemand *= seasonalityFactor

    // Calculate confidence based on historical variance
    const confidence = calculateConfidence(demands, predictedDemand)

    results.push({
      period: futureDate.toISOString().split('T')[0],
      predictedDemand: Math.max(0, Math.round(predictedDemand)),
      confidence,
      trend,
      seasonalityFactor
    })
  }

  return results
}

/**
 * Calculate trend direction
 */
function calculateTrend(data: number[]): 'increasing' | 'decreasing' | 'stable' {
  if (data.length < 2) return 'stable'

  const recentData = data.slice(-6) // Last 6 periods
  const firstHalf = recentData.slice(0, Math.floor(recentData.length / 2))
  const secondHalf = recentData.slice(Math.floor(recentData.length / 2))

  const firstAvg = firstHalf.reduce((sum, val) => sum + val, 0) / firstHalf.length
  const secondAvg = secondHalf.reduce((sum, val) => sum + val, 0) / secondHalf.length

  const changePercent = ((secondAvg - firstAvg) / firstAvg) * 100

  if (changePercent > 5) return 'increasing'
  if (changePercent < -5) return 'decreasing'
  return 'stable'
}

/**
 * Calculate seasonality patterns
 */
function calculateSeasonality(data: HistoricalData[]): number[] {
  const monthlyData: { [month: number]: number[] } = {}

  // Group data by month
  data.forEach(item => {
    const month = new Date(item.date).getMonth()
    if (!monthlyData[month]) monthlyData[month] = []
    monthlyData[month].push(item.demand)
  })

  // Calculate average for each month
  const seasonalityFactors: number[] = new Array(12).fill(1)
  const overallAverage = data.reduce((sum, item) => sum + item.demand, 0) / data.length

  for (let month = 0; month < 12; month++) {
    if (monthlyData[month] && monthlyData[month].length > 0) {
      const monthAverage = monthlyData[month].reduce((sum, val) => sum + val, 0) / monthlyData[month].length
      seasonalityFactors[month] = monthAverage / overallAverage
    }
  }

  return seasonalityFactors
}

/**
 * Get seasonality factor for a specific month
 */
function getSeasonalityFactor(seasonality: number[], month: number): number {
  return seasonality[month] || 1
}

/**
 * Calculate confidence level based on historical variance
 */
function calculateConfidence(historicalData: number[], prediction: number): number {
  if (historicalData.length < 2) return 0.5

  // Calculate variance
  const mean = historicalData.reduce((sum, val) => sum + val, 0) / historicalData.length
  const variance = historicalData.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / historicalData.length
  const standardDeviation = Math.sqrt(variance)

  // Calculate confidence based on how close prediction is to historical mean
  const deviationFromMean = Math.abs(prediction - mean)
  const normalizedDeviation = deviationFromMean / (standardDeviation || 1)

  // Convert to confidence score (0-1)
  const confidence = Math.max(0.1, Math.min(0.95, 1 - (normalizedDeviation / 3)))
  
  return Math.round(confidence * 100) / 100
}

/**
 * Inventory Optimization based on demand forecast
 */
export interface InventoryOptimization {
  itemId: string
  currentStock: number
  recommendedStock: number
  reorderPoint: number
  economicOrderQuantity: number
  stockoutRisk: number
  carryingCost: number
}

export function optimizeInventory(
  forecast: ForecastResult[],
  currentStock: number,
  leadTime: number = 7, // days
  serviceLevel: number = 0.95,
  unitCost: number = 1,
  carryingCostRate: number = 0.25
): InventoryOptimization {
  // Calculate average demand and standard deviation
  const avgDemand = forecast.reduce((sum, f) => sum + f.predictedDemand, 0) / forecast.length
  const demandVariance = forecast.reduce((sum, f) => sum + Math.pow(f.predictedDemand - avgDemand, 2), 0) / forecast.length
  const demandStdDev = Math.sqrt(demandVariance)

  // Calculate safety stock
  const zScore = getZScore(serviceLevel)
  const safetyStock = zScore * demandStdDev * Math.sqrt(leadTime / 30) // Convert to monthly

  // Calculate reorder point
  const reorderPoint = (avgDemand * leadTime / 30) + safetyStock

  // Calculate Economic Order Quantity (EOQ)
  const annualDemand = avgDemand * 12
  const orderingCost = 50 // Assumed ordering cost
  const eoq = Math.sqrt((2 * annualDemand * orderingCost) / (unitCost * carryingCostRate))

  // Calculate stockout risk
  const stockoutRisk = currentStock < reorderPoint ? 
    Math.min(0.95, (reorderPoint - currentStock) / reorderPoint) : 0

  // Calculate carrying cost
  const carryingCost = currentStock * unitCost * carryingCostRate

  return {
    itemId: 'default',
    currentStock,
    recommendedStock: Math.ceil(reorderPoint + eoq / 2),
    reorderPoint: Math.ceil(reorderPoint),
    economicOrderQuantity: Math.ceil(eoq),
    stockoutRisk: Math.round(stockoutRisk * 100) / 100,
    carryingCost: Math.round(carryingCost * 100) / 100
  }
}

/**
 * Get Z-score for service level
 */
function getZScore(serviceLevel: number): number {
  const zScores: { [key: number]: number } = {
    0.90: 1.28,
    0.95: 1.65,
    0.99: 2.33
  }
  
  return zScores[serviceLevel] || 1.65
}

/**
 * Route Optimization using AI
 */
export interface RoutePoint {
  id: string
  address: string
  lat: number
  lng: number
  priority: number
  timeWindow?: {
    start: string
    end: string
  }
}

export interface OptimizedRoute {
  routeId: string
  points: RoutePoint[]
  totalDistance: number
  estimatedTime: number
  fuelCost: number
  efficiency: number
}

export function optimizeRoute(
  startPoint: RoutePoint,
  deliveryPoints: RoutePoint[],
  vehicleCapacity: number = 1000,
  fuelCostPerKm: number = 0.15
): OptimizedRoute {
  // Simple nearest neighbor algorithm with improvements
  const optimizedPoints: RoutePoint[] = [startPoint]
  const remainingPoints = [...deliveryPoints]
  let currentPoint = startPoint
  let totalDistance = 0

  // Sort by priority first
  remainingPoints.sort((a, b) => b.priority - a.priority)

  while (remainingPoints.length > 0) {
    let nearestIndex = 0
    let nearestDistance = Infinity

    // Find nearest point considering priority
    remainingPoints.forEach((point, index) => {
      const distance = calculateDistance(currentPoint, point)
      const priorityWeight = point.priority / 10 // Adjust priority influence
      const weightedDistance = distance / (1 + priorityWeight)

      if (weightedDistance < nearestDistance) {
        nearestDistance = distance
        nearestIndex = index
      }
    })

    const nextPoint = remainingPoints.splice(nearestIndex, 1)[0]
    optimizedPoints.push(nextPoint)
    totalDistance += nearestDistance
    currentPoint = nextPoint
  }

  // Return to start
  totalDistance += calculateDistance(currentPoint, startPoint)
  optimizedPoints.push(startPoint)

  const estimatedTime = totalDistance / 50 * 60 // Assuming 50 km/h average speed
  const fuelCost = totalDistance * fuelCostPerKm
  const efficiency = deliveryPoints.length / (totalDistance / 100) // Deliveries per 100km

  return {
    routeId: `route_${Date.now()}`,
    points: optimizedPoints,
    totalDistance: Math.round(totalDistance * 100) / 100,
    estimatedTime: Math.round(estimatedTime),
    fuelCost: Math.round(fuelCost * 100) / 100,
    efficiency: Math.round(efficiency * 100) / 100
  }
}

/**
 * Calculate distance between two points (Haversine formula)
 */
function calculateDistance(point1: RoutePoint, point2: RoutePoint): number {
  const R = 6371 // Earth's radius in kilometers
  const dLat = (point2.lat - point1.lat) * Math.PI / 180
  const dLng = (point2.lng - point1.lng) * Math.PI / 180
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(point1.lat * Math.PI / 180) * Math.cos(point2.lat * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}
