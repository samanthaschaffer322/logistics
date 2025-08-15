/**
 * Elegant & Beautiful Theme System
 * Designed for perfect readability and visual appeal
 */

export const elegantTheme = {
  // High contrast color palette for perfect readability
  colors: {
    // Text colors with maximum readability
    text: {
      primary: 'text-slate-900 dark:text-slate-50',
      secondary: 'text-slate-700 dark:text-slate-200', 
      muted: 'text-slate-600 dark:text-slate-300',
      accent: 'text-blue-700 dark:text-blue-300',
      success: 'text-emerald-700 dark:text-emerald-300',
      warning: 'text-amber-700 dark:text-amber-300',
      error: 'text-red-700 dark:text-red-300',
    },
    
    // Background colors with perfect contrast
    background: {
      primary: 'bg-white dark:bg-slate-900',
      secondary: 'bg-slate-50 dark:bg-slate-800',
      tertiary: 'bg-slate-100 dark:bg-slate-700',
      accent: 'bg-blue-50 dark:bg-blue-950',
      success: 'bg-emerald-50 dark:bg-emerald-950',
      warning: 'bg-amber-50 dark:bg-amber-950',
      error: 'bg-red-50 dark:bg-red-950',
    },
    
    // Border colors
    border: {
      primary: 'border-slate-200 dark:border-slate-700',
      secondary: 'border-slate-300 dark:border-slate-600',
      accent: 'border-blue-200 dark:border-blue-800',
      success: 'border-emerald-200 dark:border-emerald-800',
      warning: 'border-amber-200 dark:border-amber-800',
      error: 'border-red-200 dark:border-red-800',
    }
  },
  
  // Typography with perfect readability
  typography: {
    // Font sizes with optimal line heights
    text: {
      xs: 'text-xs leading-5 tracking-wide',
      sm: 'text-sm leading-6 tracking-wide',
      base: 'text-base leading-7 tracking-wide',
      lg: 'text-lg leading-8 tracking-wide',
      xl: 'text-xl leading-9 tracking-wide',
      '2xl': 'text-2xl leading-10 tracking-wide',
      '3xl': 'text-3xl leading-tight tracking-wide',
      '4xl': 'text-4xl leading-tight tracking-wide',
    },
    
    // Font weights
    weight: {
      normal: 'font-normal',
      medium: 'font-medium',
      semibold: 'font-semibold',
      bold: 'font-bold',
    }
  },
  
  // Spacing system
  spacing: {
    xs: 'p-2',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
    xl: 'p-8',
    '2xl': 'p-12',
  },
  
  // Shadow system for depth
  shadows: {
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl',
    elegant: 'shadow-lg shadow-slate-200/50 dark:shadow-slate-900/50',
  }
};

// Elegant component classes
export const elegantClasses = {
  // Page layouts
  page: {
    container: 'min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900',
    content: 'container mx-auto px-6 py-8 max-w-7xl',
    section: 'space-y-8',
  },
  
  // Typography with perfect readability
  text: {
    // Headings with strong contrast
    h1: 'text-4xl md:text-5xl font-bold text-slate-900 dark:text-slate-50 leading-tight tracking-tight',
    h2: 'text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-50 leading-tight tracking-tight',
    h3: 'text-2xl md:text-3xl font-semibold text-slate-900 dark:text-slate-50 leading-tight',
    h4: 'text-xl md:text-2xl font-semibold text-slate-900 dark:text-slate-50 leading-snug',
    h5: 'text-lg md:text-xl font-semibold text-slate-900 dark:text-slate-50 leading-snug',
    
    // Body text with excellent readability
    body: 'text-base md:text-lg text-slate-700 dark:text-slate-200 leading-relaxed tracking-wide',
    bodyLarge: 'text-lg md:text-xl text-slate-700 dark:text-slate-200 leading-relaxed tracking-wide',
    caption: 'text-sm md:text-base text-slate-600 dark:text-slate-300 leading-relaxed tracking-wide',
    small: 'text-xs md:text-sm text-slate-600 dark:text-slate-300 leading-relaxed tracking-wide',
    
    // Special text styles
    accent: 'text-blue-700 dark:text-blue-300 font-semibold',
    success: 'text-emerald-700 dark:text-emerald-300 font-medium',
    warning: 'text-amber-700 dark:text-amber-300 font-medium',
    error: 'text-red-700 dark:text-red-300 font-medium',
  },
  
  // Cards with elegant design
  card: {
    base: 'bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-lg shadow-slate-200/50 dark:shadow-slate-900/50 transition-all duration-300',
    hover: 'hover:shadow-xl hover:shadow-slate-200/60 dark:hover:shadow-slate-900/60 hover:-translate-y-1',
    interactive: 'cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors duration-200',
    
    // Card sections
    header: 'p-6 pb-4 border-b border-slate-100 dark:border-slate-700',
    content: 'p-6',
    footer: 'p-6 pt-4 border-t border-slate-100 dark:border-slate-700',
  },
  
  // Buttons with elegant styling
  button: {
    // Primary button with gradient
    primary: 'inline-flex items-center justify-center px-6 py-3 text-base font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900',
    
    // Secondary button
    secondary: 'inline-flex items-center justify-center px-6 py-3 text-base font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-slate-400 dark:hover:border-slate-500 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900',
    
    // Outline button
    outline: 'inline-flex items-center justify-center px-6 py-3 text-base font-semibold text-blue-700 dark:text-blue-300 bg-transparent border-2 border-blue-300 dark:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950 hover:border-blue-400 dark:hover:border-blue-600 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900',
    
    // Small button
    small: 'inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200',
  },
  
  // Form elements with better visibility
  form: {
    input: 'block w-full px-4 py-3 text-base text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 rounded-xl shadow-sm focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all duration-200 placeholder:text-slate-500 dark:placeholder:text-slate-400',
    
    select: 'block w-full px-4 py-3 text-base text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 rounded-xl shadow-sm focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all duration-200',
    
    textarea: 'block w-full px-4 py-3 text-base text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 rounded-xl shadow-sm focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all duration-200 placeholder:text-slate-500 dark:placeholder:text-slate-400 resize-none',
    
    label: 'block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2 tracking-wide',
  },
  
  // Status indicators with high contrast
  status: {
    success: 'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800',
    warning: 'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200 border border-amber-200 dark:border-amber-800',
    error: 'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 border border-red-200 dark:border-red-800',
    info: 'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 border border-blue-200 dark:border-blue-800',
  },
  
  // Navigation elements
  nav: {
    link: 'inline-flex items-center px-4 py-2 text-base font-medium text-slate-700 dark:text-slate-200 hover:text-blue-700 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-950 rounded-lg transition-all duration-200',
    active: 'inline-flex items-center px-4 py-2 text-base font-semibold text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-900/30 rounded-lg',
  },
  
  // Alerts with better visibility
  alert: {
    base: 'p-4 rounded-xl border-l-4 shadow-md',
    success: 'bg-emerald-50 dark:bg-emerald-950 border-emerald-500 text-emerald-800 dark:text-emerald-200',
    warning: 'bg-amber-50 dark:bg-amber-950 border-amber-500 text-amber-800 dark:text-amber-200',
    error: 'bg-red-50 dark:bg-red-950 border-red-500 text-red-800 dark:text-red-200',
    info: 'bg-blue-50 dark:bg-blue-950 border-blue-500 text-blue-800 dark:text-blue-200',
  },
  
  // Loading states
  loading: {
    spinner: 'animate-spin rounded-full border-2 border-slate-300 border-t-blue-600',
    pulse: 'animate-pulse bg-slate-200 dark:bg-slate-700 rounded',
  },
  
  // Interactive elements
  interactive: {
    hover: 'hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors duration-200',
    focus: 'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900',
    active: 'active:scale-95 transition-transform duration-100',
  }
};

// Utility functions for elegant design
export const elegantUtils = {
  // Get text color based on background
  getTextColor: (background: 'light' | 'dark' | 'colored') => {
    switch (background) {
      case 'light': return elegantClasses.text.body;
      case 'dark': return 'text-slate-100';
      case 'colored': return 'text-white';
      default: return elegantClasses.text.body;
    }
  },
  
  // Get card classes with hover effects
  getCardClasses: (interactive = false) => {
    return `${elegantClasses.card.base} ${interactive ? elegantClasses.card.hover + ' ' + elegantClasses.card.interactive : ''}`;
  },
  
  // Get button classes by variant
  getButtonClasses: (variant: 'primary' | 'secondary' | 'outline' = 'primary', size: 'normal' | 'small' = 'normal') => {
    const baseClass = elegantClasses.button[variant];
    return size === 'small' ? `${elegantClasses.button.small} ${baseClass}` : baseClass;
  },
  
  // Get status classes
  getStatusClasses: (status: 'success' | 'warning' | 'error' | 'info') => {
    return elegantClasses.status[status];
  }
};

export default elegantTheme;
