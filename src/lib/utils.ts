import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Date formatting utility
export function formatDate(date: string | Date, locale: string = 'en-US'): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

// SKU generation utility
export function generateSKU(prefix: string = 'SKU', length: number = 8): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = prefix + '-';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Reorder suggestion calculation
export function calculateReorderSuggestion(
  currentStock: number,
  minStock: number,
  maxStock: number,
  averageDailyUsage: number,
  leadTimeDays: number = 7
): {
  shouldReorder: boolean;
  suggestedQuantity: number;
  urgency: 'low' | 'medium' | 'high';
  daysUntilStockout: number;
} {
  const daysUntilStockout = Math.floor(currentStock / averageDailyUsage);
  const shouldReorder = currentStock <= minStock;
  const suggestedQuantity = shouldReorder ? maxStock - currentStock : 0;
  
  let urgency: 'low' | 'medium' | 'high' = 'low';
  if (daysUntilStockout <= leadTimeDays) {
    urgency = 'high';
  } else if (daysUntilStockout <= leadTimeDays * 2) {
    urgency = 'medium';
  }

  return {
    shouldReorder,
    suggestedQuantity,
    urgency,
    daysUntilStockout
  };
}
