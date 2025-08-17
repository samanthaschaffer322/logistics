'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'vi' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  vi: {
    // Navigation
    'nav.dashboard': 'Bảng điều khiển',
    'nav.overview': 'Tổng quan',
    'nav.operations': 'Vận hành',
    'nav.analytics': 'Phân tích',
    'nav.fleet': 'Đội xe',
    'nav.system': 'Hệ thống',
    'nav.route-optimization': 'Tối ưu tuyến đường',
    'nav.vietnam-map': 'Bản đồ Việt Nam',
    'nav.super-ai': 'Trợ lý AI',
    'nav.logout': 'Đăng xuất',

    // Dashboard
    'dashboard.welcome': 'Chào mừng trở lại',
    'dashboard.overview': 'Tổng quan hệ thống',
    'dashboard.quick-actions': 'Thao tác nhanh',
    'dashboard.recent-activities': 'Hoạt động gần đây',
    'dashboard.system-status': 'Trạng thái hệ thống',

    // Authentication
    'auth.login': 'Đăng nhập',
    'auth.email': 'Email',
    'auth.password': 'Mật khẩu',
    'auth.signin': 'Đăng nhập',
    'auth.welcome-back': 'Chào mừng trở lại',
    'auth.enter-email': 'Nhập địa chỉ email',
    'auth.enter-password': 'Nhập mật khẩu',
    'auth.invalid-credentials': 'Thông tin đăng nhập không hợp lệ',

    // Route Optimization
    'route.optimization': 'Tối ưu hóa tuyến đường',
    'route.from': 'Điểm xuất phát',
    'route.to': 'Điểm đến',
    'route.vehicle-type': 'Loại xe',
    'route.optimize-for': 'Tối ưu cho',
    'route.cost': 'Chi phí',
    'route.time': 'Thời gian',
    'route.distance': 'Khoảng cách',
    'route.calculate': 'Tính toán',
    'route.results': 'Kết quả',

    // Common
    'common.search': 'Tìm kiếm',
    'common.filter': 'Lọc',
    'common.export': 'Xuất',
    'common.import': 'Nhập',
    'common.save': 'Lưu',
    'common.cancel': 'Hủy',
    'common.delete': 'Xóa',
    'common.edit': 'Sửa',
    'common.add': 'Thêm',
    'common.loading': 'Đang tải...',
    'common.success': 'Thành công',
    'common.error': 'Lỗi',
    'common.warning': 'Cảnh báo',
    'common.info': 'Thông tin',

    // Status
    'status.online': 'Trực tuyến',
    'status.offline': 'Ngoại tuyến',
    'status.active': 'Hoạt động',
    'status.inactive': 'Không hoạt động',
    'status.processing': 'Đang xử lý',
    'status.completed': 'Hoàn thành',
    'status.pending': 'Đang chờ',
    'status.failed': 'Thất bại',

    // Units
    'units.km': 'km',
    'units.hours': 'giờ',
    'units.minutes': 'phút',
    'units.vnd': 'VNĐ',
    'units.percent': '%',

    // Locations
    'location.ho-chi-minh': 'TP. Hồ Chí Minh',
    'location.hanoi': 'Hà Nội',
    'location.da-nang': 'Đà Nẵng',
    'location.can-tho': 'Cần Thơ',
    'location.hai-phong': 'Hải Phòng',

    // Vehicle Types
    'vehicle.20ft-container': 'Container 20ft',
    'vehicle.40ft-container': 'Container 40ft',
    'vehicle.truck': 'Xe tải',
    'vehicle.van': 'Xe van',

    // AI Assistant
    'ai.assistant': 'Trợ lý AI',
    'ai.upload-files': 'Tải lên file',
    'ai.generate-plan': 'Tạo kế hoạch',
    'ai.learning': 'Đang học...',
    'ai.analyzing': 'Đang phân tích...',
    'ai.generating': 'Đang tạo...',
  },
  en: {
    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.overview': 'Overview',
    'nav.operations': 'Operations',
    'nav.analytics': 'Analytics',
    'nav.fleet': 'Fleet',
    'nav.system': 'System',
    'nav.route-optimization': 'Route Optimization',
    'nav.vietnam-map': 'Vietnam Map',
    'nav.super-ai': 'Super AI',
    'nav.logout': 'Logout',

    // Dashboard
    'dashboard.welcome': 'Welcome back',
    'dashboard.overview': 'System Overview',
    'dashboard.quick-actions': 'Quick Actions',
    'dashboard.recent-activities': 'Recent Activities',
    'dashboard.system-status': 'System Status',

    // Authentication
    'auth.login': 'Login',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.signin': 'Sign In',
    'auth.welcome-back': 'Welcome Back',
    'auth.enter-email': 'Enter your email address',
    'auth.enter-password': 'Enter your password',
    'auth.invalid-credentials': 'Invalid credentials',

    // Route Optimization
    'route.optimization': 'Route Optimization',
    'route.from': 'From',
    'route.to': 'To',
    'route.vehicle-type': 'Vehicle Type',
    'route.optimize-for': 'Optimize For',
    'route.cost': 'Cost',
    'route.time': 'Time',
    'route.distance': 'Distance',
    'route.calculate': 'Calculate',
    'route.results': 'Results',

    // Common
    'common.search': 'Search',
    'common.filter': 'Filter',
    'common.export': 'Export',
    'common.import': 'Import',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.add': 'Add',
    'common.loading': 'Loading...',
    'common.success': 'Success',
    'common.error': 'Error',
    'common.warning': 'Warning',
    'common.info': 'Information',

    // Status
    'status.online': 'Online',
    'status.offline': 'Offline',
    'status.active': 'Active',
    'status.inactive': 'Inactive',
    'status.processing': 'Processing',
    'status.completed': 'Completed',
    'status.pending': 'Pending',
    'status.failed': 'Failed',

    // Units
    'units.km': 'km',
    'units.hours': 'hours',
    'units.minutes': 'minutes',
    'units.vnd': 'VND',
    'units.percent': '%',

    // Locations
    'location.ho-chi-minh': 'Ho Chi Minh City',
    'location.hanoi': 'Hanoi',
    'location.da-nang': 'Da Nang',
    'location.can-tho': 'Can Tho',
    'location.hai-phong': 'Hai Phong',

    // Vehicle Types
    'vehicle.20ft-container': '20ft Container',
    'vehicle.40ft-container': '40ft Container',
    'vehicle.truck': 'Truck',
    'vehicle.van': 'Van',

    // AI Assistant
    'ai.assistant': 'AI Assistant',
    'ai.upload-files': 'Upload Files',
    'ai.generate-plan': 'Generate Plan',
    'ai.learning': 'Learning...',
    'ai.analyzing': 'Analyzing...',
    'ai.generating': 'Generating...',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('vi'); // Default to Vietnamese

  useEffect(() => {
    // Load saved language preference
    const savedLanguage = localStorage.getItem('logiai_language') as Language;
    if (savedLanguage && (savedLanguage === 'vi' || savedLanguage === 'en')) {
      setLanguageState(savedLanguage);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('logiai_language', lang);
  };

  const t = (key: string): string => {
    const keys = key.split('.');
    let value: any = translations[language];
    
    for (const k of keys) {
      value = value?.[k];
    }
    
    return value || key; // Return key if translation not found
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
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
