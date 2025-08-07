'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

type Language = 'vi' | 'en'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const translations = {
  vi: {
    // Navigation
    'nav.dashboard': 'Bảng điều khiển',
    'nav.analytics': 'Phân tích',
    'nav.route_optimization': 'Tối ưu tuyến đường',
    'nav.file_learning': 'AI Học file',
    'nav.import_export': 'Xuất nhập khẩu',
    'nav.logistics_operations': 'Vận hành logistics',
    'nav.fleet_management': 'Quản lý đội xe',
    'nav.warehouse': 'Kho bãi',
    'nav.real_time_tracking': 'Theo dõi thời gian thực',
    
    // Common
    'common.loading': 'Đang tải...',
    'common.save': 'Lưu',
    'common.cancel': 'Hủy',
    'common.delete': 'Xóa',
    'common.edit': 'Sửa',
    'common.view': 'Xem',
    'common.download': 'Tải xuống',
    'common.upload': 'Tải lên',
    'common.search': 'Tìm kiếm',
    'common.filter': 'Lọc',
    'common.export': 'Xuất',
    'common.import': 'Nhập',
    'common.add': 'Thêm',
    'common.new': 'Mới',
    'common.status': 'Trạng thái',
    'common.date': 'Ngày',
    'common.time': 'Thời gian',
    'common.cost': 'Chi phí',
    'common.distance': 'Khoảng cách',
    'common.weight': 'Trọng lượng',
    'common.driver': 'Tài xế',
    'common.vehicle': 'Phương tiện',
    'common.cargo': 'Hàng hóa',
    'common.route': 'Tuyến đường',
    'common.departure': 'Điểm đi',
    'common.destination': 'Điểm đến',
    'common.depot': 'Depot',
    'common.warehouse': 'Kho',
    'common.efficiency': 'Hiệu suất',
    'common.optimization': 'Tối ưu hóa',
    'common.analysis': 'Phân tích',
    'common.insights': 'Thông tin chi tiết',
    'common.recommendations': 'Khuyến nghị',
    'common.performance': 'Hiệu suất',
    'common.total': 'Tổng',
    'common.average': 'Trung bình',
    'common.active': 'Hoạt động',
    'common.inactive': 'Không hoạt động',
    'common.completed': 'Hoàn thành',
    'common.pending': 'Đang chờ',
    'common.in_progress': 'Đang thực hiện',
    'common.failed': 'Thất bại',
    'common.success': 'Thành công',
    
    // Route Optimization
    'route.title': 'Tối ưu tuyến đường AI cho xe container 40ft',
    'route.description': 'Định tuyến xe tải tiên tiến với ràng buộc đường bộ Việt Nam, phân tích giao thông và tối ưu nhiên liệu',
    'route.select_departure': 'Chọn điểm xuất phát...',
    'route.select_destination': 'Chọn điểm đến...',
    'route.truck_config': 'Cấu hình xe tải',
    'route.departure_time': 'Thời gian khởi hành',
    'route.optimize_button': 'Tối ưu tuyến đường xe 40ft',
    'route.optimizing': 'Đang tối ưu tuyến đường Việt Nam...',
    'route.nearest_depot': 'Depot gần nhất được đề xuất',
    'route.direct_route': 'Tuyến trực tiếp',
    'route.via_depot': 'Qua Depot',
    'route.savings': 'Tiết kiệm',
    'route.no_depot': 'Tuyến trực tiếp hiệu quả hơn',
    'route.no_optimization': 'Không có tối ưu depot cho tuyến này',
    
    // AI File Learning
    'file.title': 'AI File Learning Engine',
    'file.description': 'Upload và phân tích các file kế hoạch logistics để nhận insights thông minh từ AI',
    'file.upload_title': 'Upload Files Kế Hoạch Logistics',
    'file.upload_description': 'Upload các file Excel kế hoạch ngày để AI phân tích và đưa ra khuyến nghị tối ưu',
    'file.drag_drop': 'Kéo thả files hoặc click để chọn',
    'file.drop_here': 'Thả files vào đây',
    'file.supported_formats': 'Hỗ trợ: Excel (.xlsx, .xls), CSV, PDF • Tối đa 10MB mỗi file',
    'file.ready_to_receive': 'Sẵn sàng nhận files logistics...',
    'file.files_uploaded': 'Files đã upload',
    'file.remove_all': 'Xóa tất cả',
    'file.ai_processing': 'AI Processing Engine',
    'file.ai_description': 'Phân tích thông minh với machine learning',
    'file.start_analysis': 'Bắt đầu phân tích AI',
    'file.analyzing': 'Đang phân tích AI...',
    'file.demo_sample': 'Demo với file mẫu',
    'file.extract_data': 'Trích xuất dữ liệu từ Excel',
    'file.analyze_patterns': 'Phân tích patterns & trends',
    'file.optimize_routes': 'Tối ưu tuyến đường & chi phí',
    'file.predict_demand': 'Dự đoán nhu cầu tương lai',
    'file.download_results': 'Tải xuống kết quả',
    
    // Analytics
    'analytics.title': 'Analytics & Insights',
    'analytics.description': 'Phân tích hiệu suất logistics toàn diện',
    'analytics.total_revenue': 'Tổng doanh thu',
    'analytics.total_shipments': 'Tổng lô hàng',
    'analytics.on_time_delivery': 'Giao hàng đúng hẹn',
    'analytics.active_vehicles': 'Xe hoạt động',
    'analytics.export_report': 'Xuất báo cáo',
    'analytics.overview': 'Tổng quan',
    'analytics.routes': 'Hiệu suất tuyến đường',
    'analytics.vehicles': 'Sử dụng phương tiện',
    'analytics.trends': 'Xu hướng & Thông tin chi tiết',
    
    // Import Export
    'import_export.title': 'Trung tâm Xuất nhập khẩu',
    'import_export.description': 'Tích hợp VNACCS và quản lý tài liệu hải quan',
    'import_export.new_shipment': 'Lô hàng mới',
    'import_export.total_shipments': 'Tổng lô hàng',
    'import_export.total_value': 'Tổng giá trị',
    'import_export.imports': 'Nhập khẩu',
    'import_export.exports': 'Xuất khẩu',
    'import_export.vnaccs_connected': 'VNACCS đã kết nối',
    'import_export.system_operational': 'Hệ thống hoạt động',
    'import_export.documents_ready': 'Tài liệu sẵn sàng',
    'import_export.pending_clearance': 'Chờ thông quan',
    
    // Logistics Operations
    'operations.title': 'Vận hành Logistics',
    'operations.description': 'Quản lý và tối ưu hóa vận hành thời gian thực',
    'operations.active_operations': 'Hoạt động đang diễn ra',
    'operations.fleet_utilization': 'Sử dụng đội xe',
    'operations.avg_efficiency': 'Hiệu suất trung bình',
    'operations.total_cost': 'Tổng chi phí',
    'operations.new_operation': 'Hoạt động mới',
    'operations.pause_updates': 'Tạm dừng cập nhật',
    'operations.resume_updates': 'Tiếp tục cập nhật',
    'operations.fleet': 'Đội xe',
    'operations.drivers': 'Tài xế',
    'operations.system_status': 'Trạng thái hệ thống',
    'operations.gps_tracking': 'Theo dõi GPS',
    'operations.maintenance_due': 'Đến hạn bảo trì',
    'operations.fuel_monitoring': 'Giám sát nhiên liệu'
  },
  en: {
    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.analytics': 'Analytics',
    'nav.route_optimization': 'Route Optimization',
    'nav.file_learning': 'AI File Learning',
    'nav.import_export': 'Import Export',
    'nav.logistics_operations': 'Logistics Operations',
    'nav.fleet_management': 'Fleet Management',
    'nav.warehouse': 'Warehouse',
    'nav.real_time_tracking': 'Real-time Tracking',
    
    // Common
    'common.loading': 'Loading...',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.view': 'View',
    'common.download': 'Download',
    'common.upload': 'Upload',
    'common.search': 'Search',
    'common.filter': 'Filter',
    'common.export': 'Export',
    'common.import': 'Import',
    'common.add': 'Add',
    'common.new': 'New',
    'common.status': 'Status',
    'common.date': 'Date',
    'common.time': 'Time',
    'common.cost': 'Cost',
    'common.distance': 'Distance',
    'common.weight': 'Weight',
    'common.driver': 'Driver',
    'common.vehicle': 'Vehicle',
    'common.cargo': 'Cargo',
    'common.route': 'Route',
    'common.departure': 'Departure',
    'common.destination': 'Destination',
    'common.depot': 'Depot',
    'common.warehouse': 'Warehouse',
    'common.efficiency': 'Efficiency',
    'common.optimization': 'Optimization',
    'common.analysis': 'Analysis',
    'common.insights': 'Insights',
    'common.recommendations': 'Recommendations',
    'common.performance': 'Performance',
    'common.total': 'Total',
    'common.average': 'Average',
    'common.active': 'Active',
    'common.inactive': 'Inactive',
    'common.completed': 'Completed',
    'common.pending': 'Pending',
    'common.in_progress': 'In Progress',
    'common.failed': 'Failed',
    'common.success': 'Success',
    
    // Route Optimization
    'route.title': 'AI Route Optimization for 40ft Container Trucks',
    'route.description': 'Advanced truck routing with Vietnam road constraints, traffic analysis, and fuel optimization',
    'route.select_departure': 'Select departure point...',
    'route.select_destination': 'Select destination...',
    'route.truck_config': 'Truck Configuration',
    'route.departure_time': 'Departure Time',
    'route.optimize_button': 'Optimize 40ft Truck Route',
    'route.optimizing': 'Optimizing Vietnam Route...',
    'route.nearest_depot': 'Suggested nearest depot',
    'route.direct_route': 'Direct Route',
    'route.via_depot': 'Via Depot',
    'route.savings': 'Savings',
    'route.no_depot': 'Direct route is more efficient',
    'route.no_optimization': 'No depot optimization available for this route',
    
    // AI File Learning
    'file.title': 'AI File Learning Engine',
    'file.description': 'Upload and analyze logistics planning files to receive intelligent AI insights',
    'file.upload_title': 'Upload Logistics Planning Files',
    'file.upload_description': 'Upload Excel daily planning files for AI analysis and optimization recommendations',
    'file.drag_drop': 'Drag and drop files or click to select',
    'file.drop_here': 'Drop files here',
    'file.supported_formats': 'Supported: Excel (.xlsx, .xls), CSV, PDF • Max 10MB per file',
    'file.ready_to_receive': 'Ready to receive logistics files...',
    'file.files_uploaded': 'Files uploaded',
    'file.remove_all': 'Remove all',
    'file.ai_processing': 'AI Processing Engine',
    'file.ai_description': 'Intelligent analysis with machine learning',
    'file.start_analysis': 'Start AI Analysis',
    'file.analyzing': 'Analyzing with AI...',
    'file.demo_sample': 'Demo with sample file',
    'file.extract_data': 'Extract data from Excel',
    'file.analyze_patterns': 'Analyze patterns & trends',
    'file.optimize_routes': 'Optimize routes & costs',
    'file.predict_demand': 'Predict future demand',
    'file.download_results': 'Download results',
    
    // Analytics
    'analytics.title': 'Analytics & Insights',
    'analytics.description': 'Comprehensive logistics performance analytics',
    'analytics.total_revenue': 'Total Revenue',
    'analytics.total_shipments': 'Total Shipments',
    'analytics.on_time_delivery': 'On-Time Delivery',
    'analytics.active_vehicles': 'Active Vehicles',
    'analytics.export_report': 'Export Report',
    'analytics.overview': 'Overview',
    'analytics.routes': 'Route Performance',
    'analytics.vehicles': 'Vehicle Utilization',
    'analytics.trends': 'Trends & Insights',
    
    // Import Export
    'import_export.title': 'Import-Export Center',
    'import_export.description': 'VNACCS integration and customs documentation management',
    'import_export.new_shipment': 'New Shipment',
    'import_export.total_shipments': 'Total Shipments',
    'import_export.total_value': 'Total Value',
    'import_export.imports': 'Imports',
    'import_export.exports': 'Exports',
    'import_export.vnaccs_connected': 'VNACCS Connected',
    'import_export.system_operational': 'System operational',
    'import_export.documents_ready': 'Documents Ready',
    'import_export.pending_clearance': 'Pending Clearance',
    
    // Logistics Operations
    'operations.title': 'Logistics Operations',
    'operations.description': 'Real-time operations management and optimization',
    'operations.active_operations': 'Active Operations',
    'operations.fleet_utilization': 'Fleet Utilization',
    'operations.avg_efficiency': 'Avg Efficiency',
    'operations.total_cost': 'Total Cost',
    'operations.new_operation': 'New Operation',
    'operations.pause_updates': 'Pause Updates',
    'operations.resume_updates': 'Resume Updates',
    'operations.fleet': 'Fleet',
    'operations.drivers': 'Drivers',
    'operations.system_status': 'System Status',
    'operations.gps_tracking': 'GPS Tracking',
    'operations.maintenance_due': 'Maintenance Due',
    'operations.fuel_monitoring': 'Fuel Monitoring'
  }
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('vi')

  useEffect(() => {
    // Load saved language from localStorage
    const savedLanguage = localStorage.getItem('language') as Language
    if (savedLanguage && (savedLanguage === 'vi' || savedLanguage === 'en')) {
      setLanguage(savedLanguage)
    }
  }, [])

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang)
    localStorage.setItem('language', lang)
  }

  const t = (key: string): string => {
    return translations[language][key] || key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
