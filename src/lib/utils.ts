import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number, currency: string = 'VND'): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
  }).format(amount)
}

export function formatDistance(meters: number): string {
  if (meters < 1000) {
    return `${Math.round(meters)} m`
  }
  return `${(meters / 1000).toFixed(1)} km`
}

export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`
  }
  return `${minutes}m`
}

export function generateId(): string {
  return Math.random().toString(36).substr(2, 9)
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

export function formatDate(date: Date | string): string {
  const d = new Date(date)
  return d.toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}

export function generateSKU(prefix: string = 'SKU'): string {
  const timestamp = Date.now().toString(36)
  const random = Math.random().toString(36).substr(2, 5)
  return `${prefix}-${timestamp}-${random}`.toUpperCase()
}

export function calculateReorderSuggestion(currentStock: number, minStock: number, avgConsumption: number): {
  shouldReorder: boolean
  suggestedQuantity: number
  urgency: 'low' | 'medium' | 'high'
} {
  const shouldReorder = currentStock <= minStock
  const suggestedQuantity = shouldReorder ? Math.max(avgConsumption * 30, minStock * 2) : 0
  
  let urgency: 'low' | 'medium' | 'high' = 'low'
  if (currentStock <= minStock * 0.5) urgency = 'high'
  else if (currentStock <= minStock * 0.8) urgency = 'medium'
  
  return { shouldReorder, suggestedQuantity, urgency }
}
