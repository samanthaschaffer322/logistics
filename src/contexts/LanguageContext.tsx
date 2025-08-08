'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'vi';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Comprehensive translations
const translations = {
  en: {
    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.routeOptimization': 'Route Optimization',
    'nav.enhancedOptimizer': 'Enhanced AI Optimizer',
    'nav.fleetManagement': 'Fleet Management',
    'nav.shipments': 'Shipments',
    'nav.warehouse': 'Warehouse',
    'nav.analytics': 'Analytics',
    'nav.realTimeTracking': 'Real-time Tracking',
    'nav.vietnamMap': 'Vietnam Map',
    'nav.interactiveMap': 'Interactive Map',
    'nav.logisticsOperations': 'Logistics Operations',
    'nav.importExport': 'Import/Export',
    'nav.distribution': 'Distribution',
    'nav.transportation': 'Transportation',
    'nav.procurement': 'Procurement',
    'nav.superAI': 'Super AI',
    'nav.fileLearning': 'File Learning',
    'nav.login': 'Login',

    // Common
    'common.loading': 'Loading...',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.add': 'Add',
    'common.search': 'Search',
    'common.filter': 'Filter',
    'common.export': 'Export',
    'common.import': 'Import',
    'common.download': 'Download',
    'common.upload': 'Upload',
    'common.submit': 'Submit',
    'common.reset': 'Reset',
    'common.close': 'Close',
    'common.open': 'Open',
    'common.view': 'View',
    'common.details': 'Details',
    'common.status': 'Status',
    'common.date': 'Date',
    'common.time': 'Time',
    'common.location': 'Location',
    'common.distance': 'Distance',
    'common.duration': 'Duration',
    'common.cost': 'Cost',
    'common.total': 'Total',
    'common.average': 'Average',
    'common.minimum': 'Minimum',
    'common.maximum': 'Maximum',
    'common.success': 'Success',
    'common.error': 'Error',
    'common.warning': 'Warning',
    'common.info': 'Information',

    // Dashboard
    'dashboard.title': 'Logistics Dashboard',
    'dashboard.welcome': 'Welcome to LogiAI',
    'dashboard.subtitle': 'Your AI-Powered Logistics Management Platform',
    'dashboard.totalShipments': 'Total Shipments',
    'dashboard.activeRoutes': 'Active Routes',
    'dashboard.fleetUtilization': 'Fleet Utilization',
    'dashboard.costSavings': 'Cost Savings',
    'dashboard.recentActivity': 'Recent Activity',
    'dashboard.performanceMetrics': 'Performance Metrics',
    'dashboard.quickActions': 'Quick Actions',

    // Route Optimization
    'route.title': 'Route Optimization',
    'route.enhancedTitle': 'Enhanced AI Route Optimizer',
    'route.optimize': 'Optimize Routes',
    'route.optimizing': 'Optimizing...',
    'route.optimizationComplete': 'Optimization Complete',
    'route.locations': 'Locations',
    'route.vehicles': 'Vehicles',
    'route.settings': 'Settings',
    'route.results': 'Results',
    'route.insights': 'AI Insights',
    'route.addLocation': 'Add Location',
    'route.addVehicle': 'Add Vehicle',
    'route.totalDistance': 'Total Distance',
    'route.totalTime': 'Total Time',
    'route.totalCost': 'Total Cost',
    'route.efficiency': 'Efficiency',
    'route.carbonFootprint': 'Carbon Footprint',
    'route.customerSatisfaction': 'Customer Satisfaction',
    'route.algorithm': 'Algorithm',
    'route.aiRecommendations': 'AI Recommendations',
    'route.performanceMetrics': 'Performance Metrics',
    'route.costAnalysis': 'Cost Analysis',
    'route.riskAssessment': 'Risk Assessment',

    // Automation Plan
    'automation.title': 'Comprehensive Logistics Automation Plan',
    'automation.subtitle': 'Strategic roadmap for complete logistics digitization and AI integration',
    'automation.phase1': 'Phase 1: Foundation & Assessment',
    'automation.phase2': 'Phase 2: Core System Implementation',
    'automation.phase3': 'Phase 3: AI Integration & Optimization',
    'automation.phase4': 'Phase 4: Advanced Analytics & Intelligence',
    'automation.phase5': 'Phase 5: Full Automation & Scaling',
    'automation.currentStatus': 'Current Implementation Status',
    'automation.nextSteps': 'Next Steps',
    'automation.timeline': 'Implementation Timeline',
    'automation.budget': 'Budget Allocation',
    'automation.roi': 'Expected ROI',
    'automation.risks': 'Risk Assessment',
    'automation.mitigation': 'Mitigation Strategies',
    'automation.downloadPlan': 'Download Complete Plan',
    'automation.exportExcel': 'Export to Excel',
    'automation.exportPDF': 'Export to PDF',

    // Fleet Management
    'fleet.title': 'Fleet Management',
    'fleet.vehicles': 'Vehicles',
    'fleet.drivers': 'Drivers',
    'fleet.maintenance': 'Maintenance',
    'fleet.tracking': 'Tracking',
    'fleet.performance': 'Performance',
    'fleet.addVehicle': 'Add Vehicle',
    'fleet.addDriver': 'Add Driver',
    'fleet.vehicleStatus': 'Vehicle Status',
    'fleet.driverStatus': 'Driver Status',
    'fleet.fuelConsumption': 'Fuel Consumption',
    'fleet.maintenanceSchedule': 'Maintenance Schedule',

    // Shipments
    'shipments.title': 'Shipments',
    'shipments.create': 'Create Shipment',
    'shipments.track': 'Track Shipment',
    'shipments.pending': 'Pending',
    'shipments.inTransit': 'In Transit',
    'shipments.delivered': 'Delivered',
    'shipments.cancelled': 'Cancelled',
    'shipments.origin': 'Origin',
    'shipments.destination': 'Destination',
    'shipments.weight': 'Weight',
    'shipments.dimensions': 'Dimensions',
    'shipments.priority': 'Priority',
    'shipments.estimatedDelivery': 'Estimated Delivery',

    // Warehouse
    'warehouse.title': 'Warehouse Management',
    'warehouse.inventory': 'Inventory',
    'warehouse.receiving': 'Receiving',
    'warehouse.shipping': 'Shipping',
    'warehouse.stockLevel': 'Stock Level',
    'warehouse.reorderPoint': 'Reorder Point',
    'warehouse.location': 'Location',
    'warehouse.category': 'Category',
    'warehouse.supplier': 'Supplier',

    // Analytics
    'analytics.title': 'Analytics & Reports',
    'analytics.overview': 'Overview',
    'analytics.performance': 'Performance',
    'analytics.trends': 'Trends',
    'analytics.forecasting': 'Forecasting',
    'analytics.customReports': 'Custom Reports',
    'analytics.realTimeData': 'Real-time Data',
    'analytics.historicalData': 'Historical Data',

    // Language Selector
    'language.select': 'Select Language',
    'language.english': 'English',
    'language.vietnamese': 'Tiếng Việt',
  },
  vi: {
    // Navigation
    'nav.dashboard': 'Bảng Điều Khiển',
    'nav.routeOptimization': 'Tối Ưu Hóa Tuyến Đường',
    'nav.enhancedOptimizer': 'Bộ Tối Ưu AI Nâng Cao',
    'nav.fleetManagement': 'Quản Lý Đội Xe',
    'nav.shipments': 'Lô Hàng',
    'nav.warehouse': 'Kho Bãi',
    'nav.analytics': 'Phân Tích',
    'nav.realTimeTracking': 'Theo Dõi Thời Gian Thực',
    'nav.vietnamMap': 'Bản Đồ Việt Nam',
    'nav.interactiveMap': 'Bản Đồ Tương Tác',
    'nav.logisticsOperations': 'Hoạt Động Logistics',
    'nav.importExport': 'Xuất Nhập Khẩu',
    'nav.distribution': 'Phân Phối',
    'nav.transportation': 'Vận Chuyển',
    'nav.procurement': 'Mua Sắm',
    'nav.superAI': 'Siêu AI',
    'nav.fileLearning': 'Học Từ Tệp',
    'nav.login': 'Đăng Nhập',

    // Common
    'common.loading': 'Đang tải...',
    'common.save': 'Lưu',
    'common.cancel': 'Hủy',
    'common.delete': 'Xóa',
    'common.edit': 'Chỉnh sửa',
    'common.add': 'Thêm',
    'common.search': 'Tìm kiếm',
    'common.filter': 'Lọc',
    'common.export': 'Xuất',
    'common.import': 'Nhập',
    'common.download': 'Tải xuống',
    'common.upload': 'Tải lên',
    'common.submit': 'Gửi',
    'common.reset': 'Đặt lại',
    'common.close': 'Đóng',
    'common.open': 'Mở',
    'common.view': 'Xem',
    'common.details': 'Chi tiết',
    'common.status': 'Trạng thái',
    'common.date': 'Ngày',
    'common.time': 'Thời gian',
    'common.location': 'Vị trí',
    'common.distance': 'Khoảng cách',
    'common.duration': 'Thời lượng',
    'common.cost': 'Chi phí',
    'common.total': 'Tổng cộng',
    'common.average': 'Trung bình',
    'common.minimum': 'Tối thiểu',
    'common.maximum': 'Tối đa',
    'common.success': 'Thành công',
    'common.error': 'Lỗi',
    'common.warning': 'Cảnh báo',
    'common.info': 'Thông tin',

    // Dashboard
    'dashboard.title': 'Bảng Điều Khiển Logistics',
    'dashboard.welcome': 'Chào mừng đến với LogiAI',
    'dashboard.subtitle': 'Nền tảng Quản lý Logistics được hỗ trợ bởi AI',
    'dashboard.totalShipments': 'Tổng Lô Hàng',
    'dashboard.activeRoutes': 'Tuyến Đường Hoạt Động',
    'dashboard.fleetUtilization': 'Sử Dụng Đội Xe',
    'dashboard.costSavings': 'Tiết Kiệm Chi Phí',
    'dashboard.recentActivity': 'Hoạt Động Gần Đây',
    'dashboard.performanceMetrics': 'Chỉ Số Hiệu Suất',
    'dashboard.quickActions': 'Hành Động Nhanh',

    // Route Optimization
    'route.title': 'Tối Ưu Hóa Tuyến Đường',
    'route.enhancedTitle': 'Bộ Tối Ưu AI Nâng Cao',
    'route.optimize': 'Tối Ưu Hóa Tuyến Đường',
    'route.optimizing': 'Đang tối ưu hóa...',
    'route.optimizationComplete': 'Hoàn Thành Tối Ưu Hóa',
    'route.locations': 'Địa Điểm',
    'route.vehicles': 'Phương Tiện',
    'route.settings': 'Cài Đặt',
    'route.results': 'Kết Quả',
    'route.insights': 'Thông Tin AI',
    'route.addLocation': 'Thêm Địa Điểm',
    'route.addVehicle': 'Thêm Phương Tiện',
    'route.totalDistance': 'Tổng Khoảng Cách',
    'route.totalTime': 'Tổng Thời Gian',
    'route.totalCost': 'Tổng Chi Phí',
    'route.efficiency': 'Hiệu Suất',
    'route.carbonFootprint': 'Dấu Chân Carbon',
    'route.customerSatisfaction': 'Sự Hài Lòng Khách Hàng',
    'route.algorithm': 'Thuật Toán',
    'route.aiRecommendations': 'Khuyến Nghị AI',
    'route.performanceMetrics': 'Chỉ Số Hiệu Suất',
    'route.costAnalysis': 'Phân Tích Chi Phí',
    'route.riskAssessment': 'Đánh Giá Rủi Ro',

    // Automation Plan
    'automation.title': 'Kế Hoạch Tự Động Hóa Logistics Toàn Diện',
    'automation.subtitle': 'Lộ trình chiến lược cho việc số hóa hoàn toàn logistics và tích hợp AI',
    'automation.phase1': 'Giai đoạn 1: Nền tảng & Đánh giá',
    'automation.phase2': 'Giai đoạn 2: Triển khai Hệ thống Cốt lõi',
    'automation.phase3': 'Giai đoạn 3: Tích hợp AI & Tối ưu hóa',
    'automation.phase4': 'Giai đoạn 4: Phân tích Nâng cao & Trí tuệ',
    'automation.phase5': 'Giai đoạn 5: Tự động hóa Hoàn toàn & Mở rộng',
    'automation.currentStatus': 'Tình Trạng Triển Khai Hiện Tại',
    'automation.nextSteps': 'Các Bước Tiếp Theo',
    'automation.timeline': 'Lịch Trình Triển Khai',
    'automation.budget': 'Phân Bổ Ngân Sách',
    'automation.roi': 'ROI Dự Kiến',
    'automation.risks': 'Đánh Giá Rủi Ro',
    'automation.mitigation': 'Chiến Lược Giảm Thiểu',
    'automation.downloadPlan': 'Tải Xuống Kế Hoạch Hoàn Chỉnh',
    'automation.exportExcel': 'Xuất ra Excel',
    'automation.exportPDF': 'Xuất ra PDF',

    // Fleet Management
    'fleet.title': 'Quản Lý Đội Xe',
    'fleet.vehicles': 'Phương Tiện',
    'fleet.drivers': 'Tài Xế',
    'fleet.maintenance': 'Bảo Trì',
    'fleet.tracking': 'Theo Dõi',
    'fleet.performance': 'Hiệu Suất',
    'fleet.addVehicle': 'Thêm Phương Tiện',
    'fleet.addDriver': 'Thêm Tài Xế',
    'fleet.vehicleStatus': 'Trạng Thái Phương Tiện',
    'fleet.driverStatus': 'Trạng Thái Tài Xế',
    'fleet.fuelConsumption': 'Tiêu Thụ Nhiên Liệu',
    'fleet.maintenanceSchedule': 'Lịch Bảo Trì',

    // Shipments
    'shipments.title': 'Lô Hàng',
    'shipments.create': 'Tạo Lô Hàng',
    'shipments.track': 'Theo Dõi Lô Hàng',
    'shipments.pending': 'Chờ Xử Lý',
    'shipments.inTransit': 'Đang Vận Chuyển',
    'shipments.delivered': 'Đã Giao',
    'shipments.cancelled': 'Đã Hủy',
    'shipments.origin': 'Điểm Xuất Phát',
    'shipments.destination': 'Điểm Đến',
    'shipments.weight': 'Trọng Lượng',
    'shipments.dimensions': 'Kích Thước',
    'shipments.priority': 'Ưu Tiên',
    'shipments.estimatedDelivery': 'Dự Kiến Giao Hàng',

    // Warehouse
    'warehouse.title': 'Quản Lý Kho Bãi',
    'warehouse.inventory': 'Tồn Kho',
    'warehouse.receiving': 'Nhận Hàng',
    'warehouse.shipping': 'Giao Hàng',
    'warehouse.stockLevel': 'Mức Tồn Kho',
    'warehouse.reorderPoint': 'Điểm Đặt Hàng Lại',
    'warehouse.location': 'Vị Trí',
    'warehouse.category': 'Danh Mục',
    'warehouse.supplier': 'Nhà Cung Cấp',

    // Analytics
    'analytics.title': 'Phân Tích & Báo Cáo',
    'analytics.overview': 'Tổng Quan',
    'analytics.performance': 'Hiệu Suất',
    'analytics.trends': 'Xu Hướng',
    'analytics.forecasting': 'Dự Báo',
    'analytics.customReports': 'Báo Cáo Tùy Chỉnh',
    'analytics.realTimeData': 'Dữ Liệu Thời Gian Thực',
    'analytics.historicalData': 'Dữ Liệu Lịch Sử',

    // Language Selector
    'language.select': 'Chọn Ngôn Ngữ',
    'language.english': 'English',
    'language.vietnamese': 'Tiếng Việt',
  }
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('vi'); // Default to Vietnamese

  useEffect(() => {
    // Load saved language from localStorage
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'vi')) {
      setLanguage(savedLanguage);
    }
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
