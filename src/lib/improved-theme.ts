/**
 * Improved Theme System for Better UI/UX and Readability
 * Addresses text readability issues and provides consistent styling
 */

export const improvedTheme = {
  // Color palette with better contrast ratios
  colors: {
    // Primary colors with WCAG AA compliance
    primary: {
      50: '#f0f9ff',
      100: '#e0f2fe',
      200: '#bae6fd',
      300: '#7dd3fc',
      400: '#38bdf8',
      500: '#0ea5e9',
      600: '#0284c7',
      700: '#0369a1',
      800: '#075985',
      900: '#0c4a6e',
    },
    
    // Gray scale with improved readability
    gray: {
      50: '#f9fafb',
      100: '#f3f4f6',
      200: '#e5e7eb',
      300: '#d1d5db',
      400: '#9ca3af',
      500: '#6b7280',
      600: '#4b5563',
      700: '#374151',
      800: '#1f2937',
      900: '#111827',
    },
    
    // Success colors
    success: {
      50: '#f0fdf4',
      100: '#dcfce7',
      200: '#bbf7d0',
      300: '#86efac',
      400: '#4ade80',
      500: '#22c55e',
      600: '#16a34a',
      700: '#15803d',
      800: '#166534',
      900: '#14532d',
    },
    
    // Warning colors
    warning: {
      50: '#fffbeb',
      100: '#fef3c7',
      200: '#fde68a',
      300: '#fcd34d',
      400: '#fbbf24',
      500: '#f59e0b',
      600: '#d97706',
      700: '#b45309',
      800: '#92400e',
      900: '#78350f',
    },
    
    // Error colors
    error: {
      50: '#fef2f2',
      100: '#fee2e2',
      200: '#fecaca',
      300: '#fca5a5',
      400: '#f87171',
      500: '#ef4444',
      600: '#dc2626',
      700: '#b91c1c',
      800: '#991b1b',
      900: '#7f1d1d',
    },
  },
  
  // Typography with improved readability
  typography: {
    fontFamily: {
      sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      mono: ['JetBrains Mono', 'Fira Code', 'Monaco', 'Consolas', 'monospace'],
    },
    
    fontSize: {
      xs: ['0.75rem', { lineHeight: '1.5', letterSpacing: '0.025em' }],
      sm: ['0.875rem', { lineHeight: '1.6', letterSpacing: '0.025em' }],
      base: ['1rem', { lineHeight: '1.6', letterSpacing: '0.025em' }],
      lg: ['1.125rem', { lineHeight: '1.6', letterSpacing: '0.025em' }],
      xl: ['1.25rem', { lineHeight: '1.6', letterSpacing: '0.025em' }],
      '2xl': ['1.5rem', { lineHeight: '1.5', letterSpacing: '0.025em' }],
      '3xl': ['1.875rem', { lineHeight: '1.4', letterSpacing: '0.025em' }],
      '4xl': ['2.25rem', { lineHeight: '1.3', letterSpacing: '0.025em' }],
    },
    
    fontWeight: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
  },
  
  // Spacing system
  spacing: {
    px: '1px',
    0: '0',
    1: '0.25rem',
    2: '0.5rem',
    3: '0.75rem',
    4: '1rem',
    5: '1.25rem',
    6: '1.5rem',
    8: '2rem',
    10: '2.5rem',
    12: '3rem',
    16: '4rem',
    20: '5rem',
    24: '6rem',
  },
  
  // Border radius
  borderRadius: {
    none: '0',
    sm: '0.125rem',
    base: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    '2xl': '1rem',
    '3xl': '1.5rem',
    full: '9999px',
  },
  
  // Shadows with better depth perception
  boxShadow: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
  },
};

// CSS classes for improved readability
export const readabilityClasses = {
  // Text with high contrast
  textPrimary: 'text-gray-900 dark:text-gray-100',
  textSecondary: 'text-gray-700 dark:text-gray-300',
  textMuted: 'text-gray-600 dark:text-gray-400',
  textDisabled: 'text-gray-400 dark:text-gray-600',
  
  // Background colors with proper contrast
  bgPrimary: 'bg-white dark:bg-gray-900',
  bgSecondary: 'bg-gray-50 dark:bg-gray-800',
  bgTertiary: 'bg-gray-100 dark:bg-gray-700',
  
  // Interactive elements
  interactive: 'hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200',
  interactiveStrong: 'hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200',
  
  // Focus states
  focusRing: 'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900',
  
  // Borders
  border: 'border-gray-200 dark:border-gray-700',
  borderStrong: 'border-gray-300 dark:border-gray-600',
  
  // Cards and containers
  card: 'bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm',
  cardHover: 'hover:shadow-md transition-shadow duration-200',
  
  // Buttons
  buttonPrimary: 'bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
  buttonSecondary: 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100 font-medium px-4 py-2 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2',
  buttonOutline: 'border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium px-4 py-2 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2',
  
  // Form elements
  input: 'block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
  select: 'block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
  
  // Status indicators
  statusSuccess: 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200 border border-green-200 dark:border-green-800',
  statusWarning: 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200 border border-yellow-200 dark:border-yellow-800',
  statusError: 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 border border-red-200 dark:border-red-800',
  statusInfo: 'bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200 border border-blue-200 dark:border-blue-800',
};

// Utility functions for theme management
export const themeUtils = {
  // Get contrast ratio compliant text color
  getTextColor: (background: 'light' | 'dark' | 'colored') => {
    switch (background) {
      case 'light':
        return 'text-gray-900';
      case 'dark':
        return 'text-gray-100';
      case 'colored':
        return 'text-white';
      default:
        return 'text-gray-900';
    }
  },
  
  // Get appropriate background color
  getBackgroundColor: (variant: 'primary' | 'secondary' | 'tertiary') => {
    switch (variant) {
      case 'primary':
        return 'bg-white dark:bg-gray-900';
      case 'secondary':
        return 'bg-gray-50 dark:bg-gray-800';
      case 'tertiary':
        return 'bg-gray-100 dark:bg-gray-700';
      default:
        return 'bg-white dark:bg-gray-900';
    }
  },
  
  // Generate status color classes
  getStatusClasses: (status: 'success' | 'warning' | 'error' | 'info') => {
    const baseClasses = 'px-3 py-1 rounded-full text-sm font-medium';
    switch (status) {
      case 'success':
        return `${baseClasses} ${readabilityClasses.statusSuccess}`;
      case 'warning':
        return `${baseClasses} ${readabilityClasses.statusWarning}`;
      case 'error':
        return `${baseClasses} ${readabilityClasses.statusError}`;
      case 'info':
        return `${baseClasses} ${readabilityClasses.statusInfo}`;
      default:
        return `${baseClasses} ${readabilityClasses.statusInfo}`;
    }
  },
};

export default improvedTheme;
