import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date) {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(date))
}

export function formatDateTime(date: string | Date) {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date))
}

export function generateSKU(itemName: string): string {
  const prefix = itemName.substring(0, 3).toUpperCase()
  const timestamp = Date.now().toString().slice(-6)
  return `${prefix}-${timestamp}`
}

export function calculateReorderSuggestion(
  currentStock: number,
  reorderLevel: number,
  averageDailyUsage: number = 5
): {
  shouldReorder: boolean
  suggestedQuantity: number
  urgency: 'low' | 'medium' | 'high'
} {
  const shouldReorder = currentStock <= reorderLevel
  const daysUntilEmpty = currentStock / averageDailyUsage
  
  let urgency: 'low' | 'medium' | 'high' = 'low'
  if (daysUntilEmpty <= 3) urgency = 'high'
  else if (daysUntilEmpty <= 7) urgency = 'medium'
  
  const suggestedQuantity = Math.max(reorderLevel * 2, 50)
  
  return {
    shouldReorder,
    suggestedQuantity,
    urgency
  }
}
