import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date): string {
  const d = new Date(date)
  return d.toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}

export function generateSKU(): string {
  const timestamp = Date.now().toString(36)
  const random = Math.random().toString(36).substr(2, 5)
  return `SKU-${timestamp}-${random}`.toUpperCase()
}

export function calculateReorderSuggestion(currentStock: number, minStock: number, avgUsage: number): {
  shouldReorder: boolean
  suggestedQuantity: number
  urgency: 'low' | 'medium' | 'high'
} {
  const shouldReorder = currentStock <= minStock
  const suggestedQuantity = Math.max(0, (avgUsage * 30) - currentStock) // 30 days supply
  
  let urgency: 'low' | 'medium' | 'high' = 'low'
  if (currentStock <= minStock * 0.5) urgency = 'high'
  else if (currentStock <= minStock * 0.8) urgency = 'medium'
  
  return {
    shouldReorder,
    suggestedQuantity,
    urgency
  }
}
