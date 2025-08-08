'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react'

type Locale = 'en' | 'vi'

interface TranslationContextType {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: string) => string
  isLoading: boolean
}

// Comprehensive translations with all Vietnamese logistics terms
const translations = {
  en: {
    // Navigation
    navigation: {
      dashboard: 'Dashboard',
      fleetManagement: 'Fleet Management',
      realTimeTracking: 'Real-Time Tracking',
      shipments: 'Shipments',
      warehouse: 'Warehouse',
      transportation: 'Transportation',
      procurement: 'Procurement',
      distribution: 'Distribution',
      vietnamMap: 'Vietnam Map & Route Optimization',
      aiOptimization: 'AI Optimization',
      aiAssistant: 'AI Assistant',
      fileLearning: 'AI File Learning Engine',
      customsTraining: 'Customs Training System',
      logout: 'Logout',
      more: 'More',
      language: 'Language',
      english: 'English',
      vietnamese: 'Vietnamese'
    },

    // Vietnam Map & Route Optimization
    vietnamMap: {
      title: 'Vietnam Map & Route Optimization',
      subtitle: 'AI-powered route optimization for 40ft containers',
      routeOptimization: 'Route Optimization',
      findOptimalRoutes: 'Find optimal routes for 40ft containers',
      departure: 'Departure Location',
      destination: 'Destination Location',
      selectDeparture: 'Select departure location',
      selectDestination: 'Select destination location',
      containerType: 'Container Type',
      cargoWeight: 'Cargo Weight (tons)',
      priority: 'Optimization Priority',
      departureTime: 'Departure Time',
      avoidTolls: 'Avoid Tolls',
      avoidRushHour: 'Avoid Rush Hour',
      optimizeRoute: 'Optimize Route',
      optimizing: 'Optimizing...',
      routeResults: 'Route Optimization Results',
      originalDistance: 'Original Distance',
      optimizedDistance: 'Optimized Distance',
      distanceSaved: 'Distance Saved',
      fuelSaved: 'Fuel Saved',
      costSaved: 'Cost Saved',
      timeSaved: 'Time Saved',
      nearestDepot: 'Nearest Depot',
      routeDetails: 'Route Details',
      trafficConditions: 'Traffic Conditions',
      containerRestrictions: 'Container Restrictions',
      rushHourWarning: 'Rush hour restrictions apply for 40ft containers',
      allowedHours: 'Allowed Hours: 22:00 - 06:00',
      currentTraffic: 'Current Traffic',
      estimatedArrival: 'Estimated Arrival',
      fuelEfficiency: 'Fuel Efficiency',
      emptyReturn: 'Empty Return Location'
    },

    // File Learning
    fileLearning: {
      title: 'AI File Learning Engine',
      subtitle: 'Upload your logistics files for intelligent analysis and automation',
      aiPoweredInsights: 'AI-powered insights for Vietnamese logistics operations',
      uploadFiles: 'Upload Files',
      supportedFormats: 'Supports Excel, PDF, CSV files',
      dragDropFiles: 'Drag & drop files here or click to browse',
      maxFileSize: 'Maximum file size: 10MB',
      analyzing: 'Analyzing...',
      completed: 'Analysis Complete',
      failed: 'Analysis Failed',
      fileAnalysis: 'File Analysis',
      noFilesUploaded: 'No files uploaded yet',
      uploadFilesToAnalyze: 'Upload files to start intelligent analysis',
      keyFindings: 'Key Findings',
      recommendations: 'AI Recommendations',
      dataAnalysis: 'Data Analysis',
      routeOptimization: 'Route Optimization Insights',
      documentGeneration: 'Document Generation',
      automationSuggestions: 'Automation Opportunities',
      processingFile: 'Processing file...',
      vietnameseLogistics: 'Vietnamese Logistics Analysis',
      complianceCheck: 'Compliance Check',
      missingInformation: 'Missing Information',
      regulatoryNotes: 'Regulatory Notes',
      futureProjections: 'Future Projections',
      learningFromData: 'Learning from your data patterns...',
      smartSuggestions: 'Smart suggestions based on your operations',
      autoOptimization: 'Automatic optimization recommendations'
    },

    // Route Optimization Terms
    routeOptimization: {
      currentEfficiency: 'Current Efficiency',
      optimizationPotential: 'Optimization Potential',
      fuelSavingsEstimate: 'Fuel Savings/Day',
      timeSavingsEstimate: 'Time Savings/Day',
      recommendedDepots: 'Recommended Depots',
      routeImprovements: 'Route Improvements',
      depotOptimization: 'Depot Optimization',
      trafficAnalysis: 'Traffic Analysis',
      containerScheduling: 'Container Scheduling',
      emptyContainerReturn: 'Empty Container Return',
      costAnalysis: 'Cost Analysis',
      efficiencyMetrics: 'Efficiency Metrics'
    },

    // Vietnamese Logistics Terms
    logistics: {
      noiDi: 'Departure Point',
      noiDen: 'Destination Point',
      noiHaRong: 'Empty Return Location',
      bkvc: 'Container Manifest',
      keHoachNgay: 'Daily Plan',
      bangKeVanChuyen: 'Transportation List',
      container40ft: '40ft Container',
      container20ft: '20ft Container',
      taiXe: 'Driver',
      phuongTien: 'Vehicle',
      tuyenDuong: 'Route',
      chiPhiNhienLieu: 'Fuel Cost',
      quangDuong: 'Distance',
      thoiGian: 'Time',
      depot: 'Depot/Warehouse',
      cangBien: 'Seaport',
      kcnCongNghiep: 'Industrial Zone',
      gioCanh: 'Rush Hour',
      hanCheContainer: 'Container Restrictions'
    }
  },

  vi: {
    // Navigation
    navigation: {
      dashboard: 'Bảng điều khiển',
      fleetManagement: 'Quản lý đội xe',
      realTimeTracking: 'Theo dõi thời gian thực',
      shipments: 'Lô hàng',
      warehouse: 'Kho bãi',
      transportation: 'Vận tải',
      procurement: 'Mua sắm',
      distribution: 'Phân phối',
      vietnamMap: 'Bản đồ Việt Nam & Tối ưu tuyến đường',
      aiOptimization: 'Tối ưu hóa AI',
      aiAssistant: 'Trợ lý AI',
      fileLearning: 'Công cụ học tập file AI',
      customsTraining: 'Hệ thống đào tạo hải quan',
      logout: 'Đăng xuất',
      more: 'Thêm',
      language: 'Ngôn ngữ',
      english: 'Tiếng Anh',
      vietnamese: 'Tiếng Việt'
    },

    // Vietnam Map & Route Optimization
    vietnamMap: {
      title: 'Bản đồ Việt Nam & Tối ưu tuyến đường',
      subtitle: 'Tối ưu hóa tuyến đường bằng AI cho container 40ft',
      routeOptimization: 'Tối ưu hóa tuyến đường',
      findOptimalRoutes: 'Tìm tuyến đường tối ưu cho container 40ft',
      departure: 'Nơi đi',
      destination: 'Nơi đến',
      selectDeparture: 'Chọn nơi đi',
      selectDestination: 'Chọn nơi đến',
      containerType: 'Loại container',
      cargoWeight: 'Trọng lượng hàng (tấn)',
      priority: 'Ưu tiên tối ưu',
      departureTime: 'Thời gian khởi hành',
      avoidTolls: 'Tránh trạm thu phí',
      avoidRushHour: 'Tránh giờ cao điểm',
      optimizeRoute: 'Tối ưu tuyến đường',
      optimizing: 'Đang tối ưu...',
      routeResults: 'Kết quả tối ưu tuyến đường',
      originalDistance: 'Quãng đường gốc',
      optimizedDistance: 'Quãng đường tối ưu',
      distanceSaved: 'Quãng đường tiết kiệm',
      fuelSaved: 'Nhiên liệu tiết kiệm',
      costSaved: 'Chi phí tiết kiệm',
      timeSaved: 'Thời gian tiết kiệm',
      nearestDepot: 'Depot gần nhất',
      routeDetails: 'Chi tiết tuyến đường',
      trafficConditions: 'Tình hình giao thông',
      containerRestrictions: 'Hạn chế container',
      rushHourWarning: 'Áp dụng hạn chế giờ cao điểm cho container 40ft',
      allowedHours: 'Giờ cho phép: 22:00 - 06:00',
      currentTraffic: 'Giao thông hiện tại',
      estimatedArrival: 'Thời gian đến dự kiến',
      fuelEfficiency: 'Hiệu suất nhiên liệu',
      emptyReturn: 'Nơi hạ rỗng'
    },

    // File Learning
    fileLearning: {
      title: 'Công cụ học tập file AI',
      subtitle: 'Tải lên file logistics để phân tích thông minh và tự động hóa',
      aiPoweredInsights: 'Thông tin chi tiết được hỗ trợ bởi AI cho hoạt động logistics Việt Nam',
      uploadFiles: 'Tải lên file',
      supportedFormats: 'Hỗ trợ file Excel, PDF, CSV',
      dragDropFiles: 'Kéo thả file vào đây hoặc nhấp để duyệt',
      maxFileSize: 'Kích thước file tối đa: 10MB',
      analyzing: 'Đang phân tích...',
      completed: 'Phân tích hoàn tất',
      failed: 'Phân tích thất bại',
      fileAnalysis: 'Phân tích file',
      noFilesUploaded: 'Chưa có file nào được tải lên',
      uploadFilesToAnalyze: 'Tải lên file để bắt đầu phân tích thông minh',
      keyFindings: 'Phát hiện chính',
      recommendations: 'Khuyến nghị AI',
      dataAnalysis: 'Phân tích dữ liệu',
      routeOptimization: 'Thông tin tối ưu tuyến đường',
      documentGeneration: 'Tạo tài liệu',
      automationSuggestions: 'Cơ hội tự động hóa',
      processingFile: 'Đang xử lý file...',
      vietnameseLogistics: 'Phân tích Logistics Việt Nam',
      complianceCheck: 'Kiểm tra tuân thủ',
      missingInformation: 'Thông tin thiếu',
      regulatoryNotes: 'Ghi chú quy định',
      futureProjections: 'Dự báo tương lai',
      learningFromData: 'Học từ các mẫu dữ liệu của bạn...',
      smartSuggestions: 'Gợi ý thông minh dựa trên hoạt động của bạn',
      autoOptimization: 'Khuyến nghị tối ưu hóa tự động'
    },

    // Route Optimization Terms
    routeOptimization: {
      currentEfficiency: 'Hiệu quả hiện tại',
      optimizationPotential: 'Tiềm năng tối ưu',
      fuelSavingsEstimate: 'Tiết kiệm nhiên liệu/Ngày',
      timeSavingsEstimate: 'Tiết kiệm thời gian/Ngày',
      recommendedDepots: 'Depot được đề xuất',
      routeImprovements: 'Cải thiện tuyến đường',
      depotOptimization: 'Tối ưu depot',
      trafficAnalysis: 'Phân tích giao thông',
      containerScheduling: 'Lập lịch container',
      emptyContainerReturn: 'Trả container rỗng',
      costAnalysis: 'Phân tích chi phí',
      efficiencyMetrics: 'Chỉ số hiệu quả'
    },

    // Vietnamese Logistics Terms
    logistics: {
      noiDi: 'Nơi đi',
      noiDen: 'Nơi đến',
      noiHaRong: 'Nơi hạ rỗng',
      bkvc: 'Bảng kê vận chuyển',
      keHoachNgay: 'Kế hoạch ngày',
      bangKeVanChuyen: 'Bảng kê vận chuyển',
      container40ft: 'Container 40ft',
      container20ft: 'Container 20ft',
      taiXe: 'Tài xế',
      phuongTien: 'Phương tiện',
      tuyenDuong: 'Tuyến đường',
      chiPhiNhienLieu: 'Chi phí nhiên liệu',
      quangDuong: 'Quãng đường',
      thoiGian: 'Thời gian',
      depot: 'Depot/Kho',
      cangBien: 'Cảng biển',
      kcnCongNghiep: 'Khu công nghiệp',
      gioCanh: 'Giờ cao điểm',
      hanCheContainer: 'Hạn chế container'
    }
  }
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined)

export function EnhancedTranslationProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('en')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Load saved locale from localStorage immediately
    const savedLocale = localStorage.getItem('logiai_locale') as Locale
    if (savedLocale && (savedLocale === 'en' || savedLocale === 'vi')) {
      setLocaleState(savedLocale)
    }
  }, [])

  const setLocale = useCallback(async (newLocale: Locale) => {
    if (newLocale === locale) return // No change needed
    
    setIsLoading(true)
    
    try {
      // Immediate state update for responsive UI
      setLocaleState(newLocale)
      localStorage.setItem('logiai_locale', newLocale)
      
      // Update document language
      document.documentElement.lang = newLocale
      
      // Update page title based on language
      const title = newLocale === 'vi' 
        ? 'LogiAI - Nền tảng Quản lý Logistics được hỗ trợ bởi AI'
        : 'LogiAI - AI-Powered Logistics Management Platform'
      document.title = title
      
      // Small delay to show loading state, then complete
      await new Promise(resolve => setTimeout(resolve, 200))
      
      // Force re-render of components
      window.dispatchEvent(new CustomEvent('languageChanged', { 
        detail: { locale: newLocale, timestamp: Date.now() } 
      }))
      
    } catch (error) {
      console.error('Language switching error:', error)
      // Revert on error
      setLocaleState(locale)
    } finally {
      setIsLoading(false)
    }
  }, [locale])

  const t = useCallback((key: string): string => {
    const keys = key.split('.')
    let value: any = translations[locale]
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k]
      } else {
        // Fallback to English if key not found
        value = translations.en
        for (const fallbackKey of keys) {
          if (value && typeof value === 'object' && fallbackKey in value) {
            value = value[fallbackKey]
          } else {
            return key // Return key if not found in fallback
          }
        }
        break
      }
    }
    
    return typeof value === 'string' ? value : key
  }, [locale])

  const contextValue: TranslationContextType = {
    locale,
    setLocale,
    t,
    isLoading
  }

  return React.createElement(
    TranslationContext.Provider,
    { value: contextValue },
    children
  )
}

export function useEnhancedTranslation() {
  const context = useContext(TranslationContext)
  if (context === undefined) {
    throw new Error('useEnhancedTranslation must be used within an EnhancedTranslationProvider')
  }
  return context
}

// Export the translations for direct access if needed
export { translations }
