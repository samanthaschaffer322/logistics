export interface AutomationPhase {
  id: string;
  name: string;
  nameVi: string;
  description: string;
  descriptionVi: string;
  duration: string;
  budget: number;
  status: 'completed' | 'in-progress' | 'planned' | 'delayed';
  progress: number;
  startDate: string;
  endDate: string;
  deliverables: string[];
  deliverablesVi: string[];
  risks: Risk[];
  dependencies: string[];
  resources: Resource[];
  kpis: KPI[];
}

export interface Risk {
  id: string;
  description: string;
  descriptionVi: string;
  probability: 'low' | 'medium' | 'high';
  impact: 'low' | 'medium' | 'high';
  mitigation: string;
  mitigationVi: string;
  owner: string;
}

export interface Resource {
  id: string;
  name: string;
  type: 'human' | 'technology' | 'financial';
  allocation: string;
  cost: number;
}

export interface KPI {
  id: string;
  name: string;
  nameVi: string;
  target: string;
  current: string;
  unit: string;
  trend: 'up' | 'down' | 'stable';
}

export const automationPlan: AutomationPhase[] = [
  {
    id: 'phase1',
    name: 'Foundation & Assessment',
    nameVi: 'Nền tảng & Đánh giá',
    description: 'Comprehensive assessment of current logistics operations, infrastructure evaluation, and foundation setup for digital transformation.',
    descriptionVi: 'Đánh giá toàn diện các hoạt động logistics hiện tại, đánh giá cơ sở hạ tầng và thiết lập nền tảng cho chuyển đổi số.',
    duration: '3 months',
    budget: 150000,
    status: 'completed',
    progress: 100,
    startDate: '2024-01-01',
    endDate: '2024-03-31',
    deliverables: [
      'Current State Assessment Report',
      'Technology Infrastructure Audit',
      'Gap Analysis Documentation',
      'Digital Transformation Roadmap',
      'Stakeholder Alignment Plan',
      'Change Management Strategy',
      'Risk Assessment Matrix',
      'Budget and Resource Planning'
    ],
    deliverablesVi: [
      'Báo cáo Đánh giá Tình trạng Hiện tại',
      'Kiểm toán Cơ sở hạ tầng Công nghệ',
      'Tài liệu Phân tích Khoảng cách',
      'Lộ trình Chuyển đổi Số',
      'Kế hoạch Đồng thuận Bên liên quan',
      'Chiến lược Quản lý Thay đổi',
      'Ma trận Đánh giá Rủi ro',
      'Lập kế hoạch Ngân sách và Tài nguyên'
    ],
    risks: [
      {
        id: 'r1-1',
        description: 'Resistance to change from existing staff',
        descriptionVi: 'Sự kháng cự thay đổi từ nhân viên hiện tại',
        probability: 'medium',
        impact: 'medium',
        mitigation: 'Comprehensive training and change management program',
        mitigationVi: 'Chương trình đào tạo và quản lý thay đổi toàn diện',
        owner: 'HR Manager'
      },
      {
        id: 'r1-2',
        description: 'Legacy system integration challenges',
        descriptionVi: 'Thách thức tích hợp hệ thống cũ',
        probability: 'high',
        impact: 'high',
        mitigation: 'Phased migration approach with parallel systems',
        mitigationVi: 'Phương pháp di chuyển theo giai đoạn với hệ thống song song',
        owner: 'IT Director'
      }
    ],
    dependencies: [],
    resources: [
      { id: 'r1-1', name: 'Business Analysts', type: 'human', allocation: '2 FTE', cost: 80000 },
      { id: 'r1-2', name: 'IT Consultants', type: 'human', allocation: '3 FTE', cost: 120000 },
      { id: 'r1-3', name: 'Assessment Tools', type: 'technology', allocation: 'Licenses', cost: 25000 }
    ],
    kpis: [
      { id: 'k1-1', name: 'Assessment Completion', nameVi: 'Hoàn thành Đánh giá', target: '100%', current: '100%', unit: '%', trend: 'stable' },
      { id: 'k1-2', name: 'Stakeholder Buy-in', nameVi: 'Sự đồng thuận của Bên liên quan', target: '90%', current: '95%', unit: '%', trend: 'up' }
    ]
  },
  {
    id: 'phase2',
    name: 'Core System Implementation',
    nameVi: 'Triển khai Hệ thống Cốt lõi',
    description: 'Implementation of core logistics management systems including WMS, TMS, and basic automation tools.',
    descriptionVi: 'Triển khai các hệ thống quản lý logistics cốt lõi bao gồm WMS, TMS và các công cụ tự động hóa cơ bản.',
    duration: '6 months',
    budget: 500000,
    status: 'in-progress',
    progress: 75,
    startDate: '2024-04-01',
    endDate: '2024-09-30',
    deliverables: [
      'Warehouse Management System (WMS)',
      'Transportation Management System (TMS)',
      'Inventory Management System',
      'Order Management System',
      'Basic Reporting Dashboard',
      'User Training Programs',
      'System Integration Framework',
      'Data Migration Completion'
    ],
    deliverablesVi: [
      'Hệ thống Quản lý Kho (WMS)',
      'Hệ thống Quản lý Vận tải (TMS)',
      'Hệ thống Quản lý Tồn kho',
      'Hệ thống Quản lý Đơn hàng',
      'Bảng điều khiển Báo cáo Cơ bản',
      'Chương trình Đào tạo Người dùng',
      'Khung tích hợp Hệ thống',
      'Hoàn thành Di chuyển Dữ liệu'
    ],
    risks: [
      {
        id: 'r2-1',
        description: 'System integration complexity',
        descriptionVi: 'Độ phức tạp tích hợp hệ thống',
        probability: 'high',
        impact: 'high',
        mitigation: 'Dedicated integration team and thorough testing',
        mitigationVi: 'Đội ngũ tích hợp chuyên dụng và kiểm tra kỹ lưỡng',
        owner: 'Integration Manager'
      },
      {
        id: 'r2-2',
        description: 'Data quality issues during migration',
        descriptionVi: 'Vấn đề chất lượng dữ liệu trong quá trình di chuyển',
        probability: 'medium',
        impact: 'high',
        mitigation: 'Data cleansing and validation processes',
        mitigationVi: 'Quy trình làm sạch và xác thực dữ liệu',
        owner: 'Data Manager'
      }
    ],
    dependencies: ['phase1'],
    resources: [
      { id: 'r2-1', name: 'System Developers', type: 'human', allocation: '8 FTE', cost: 320000 },
      { id: 'r2-2', name: 'Software Licenses', type: 'technology', allocation: 'Enterprise', cost: 150000 },
      { id: 'r2-3', name: 'Hardware Infrastructure', type: 'technology', allocation: 'Servers & Network', cost: 100000 }
    ],
    kpis: [
      { id: 'k2-1', name: 'System Uptime', nameVi: 'Thời gian Hoạt động Hệ thống', target: '99.5%', current: '99.2%', unit: '%', trend: 'up' },
      { id: 'k2-2', name: 'User Adoption Rate', nameVi: 'Tỷ lệ Chấp nhận Người dùng', target: '85%', current: '78%', unit: '%', trend: 'up' },
      { id: 'k2-3', name: 'Data Accuracy', nameVi: 'Độ chính xác Dữ liệu', target: '98%', current: '96%', unit: '%', trend: 'up' }
    ]
  },
  {
    id: 'phase3',
    name: 'AI Integration & Optimization',
    nameVi: 'Tích hợp AI & Tối ưu hóa',
    description: 'Integration of AI-powered optimization engines, machine learning algorithms, and intelligent automation systems.',
    descriptionVi: 'Tích hợp các công cụ tối ưu hóa được hỗ trợ bởi AI, thuật toán học máy và hệ thống tự động hóa thông minh.',
    duration: '8 months',
    budget: 750000,
    status: 'in-progress',
    progress: 45,
    startDate: '2024-07-01',
    endDate: '2025-02-28',
    deliverables: [
      'AI Route Optimization Engine',
      'Predictive Analytics Platform',
      'Machine Learning Models',
      'Intelligent Demand Forecasting',
      'Automated Decision Systems',
      'Real-time Optimization Algorithms',
      'AI-powered Customer Service',
      'Advanced Analytics Dashboard'
    ],
    deliverablesVi: [
      'Công cụ Tối ưu hóa Tuyến đường AI',
      'Nền tảng Phân tích Dự đoán',
      'Mô hình Học máy',
      'Dự báo Nhu cầu Thông minh',
      'Hệ thống Quyết định Tự động',
      'Thuật toán Tối ưu hóa Thời gian thực',
      'Dịch vụ Khách hàng được hỗ trợ AI',
      'Bảng điều khiển Phân tích Nâng cao'
    ],
    risks: [
      {
        id: 'r3-1',
        description: 'AI model accuracy and reliability',
        descriptionVi: 'Độ chính xác và độ tin cậy của mô hình AI',
        probability: 'medium',
        impact: 'high',
        mitigation: 'Extensive testing and continuous model improvement',
        mitigationVi: 'Kiểm tra mở rộng và cải tiến mô hình liên tục',
        owner: 'AI Team Lead'
      },
      {
        id: 'r3-2',
        description: 'Data privacy and security concerns',
        descriptionVi: 'Mối quan tâm về quyền riêng tư và bảo mật dữ liệu',
        probability: 'medium',
        impact: 'high',
        mitigation: 'Robust security framework and compliance measures',
        mitigationVi: 'Khung bảo mật mạnh mẽ và các biện pháp tuân thủ',
        owner: 'Security Officer'
      }
    ],
    dependencies: ['phase2'],
    resources: [
      { id: 'r3-1', name: 'AI/ML Engineers', type: 'human', allocation: '6 FTE', cost: 480000 },
      { id: 'r3-2', name: 'Data Scientists', type: 'human', allocation: '4 FTE', cost: 320000 },
      { id: 'r3-3', name: 'AI Platform Licenses', type: 'technology', allocation: 'Enterprise AI', cost: 200000 }
    ],
    kpis: [
      { id: 'k3-1', name: 'Route Optimization Efficiency', nameVi: 'Hiệu quả Tối ưu hóa Tuyến đường', target: '25%', current: '18%', unit: '% improvement', trend: 'up' },
      { id: 'k3-2', name: 'Prediction Accuracy', nameVi: 'Độ chính xác Dự đoán', target: '90%', current: '85%', unit: '%', trend: 'up' },
      { id: 'k3-3', name: 'AI Model Performance', nameVi: 'Hiệu suất Mô hình AI', target: '95%', current: '88%', unit: '%', trend: 'up' }
    ]
  },
  {
    id: 'phase4',
    name: 'Advanced Analytics & Intelligence',
    nameVi: 'Phân tích Nâng cao & Trí tuệ',
    description: 'Implementation of advanced analytics, business intelligence, and real-time monitoring systems.',
    descriptionVi: 'Triển khai phân tích nâng cao, trí tuệ kinh doanh và hệ thống giám sát thời gian thực.',
    duration: '5 months',
    budget: 400000,
    status: 'planned',
    progress: 0,
    startDate: '2025-01-01',
    endDate: '2025-05-31',
    deliverables: [
      'Business Intelligence Platform',
      'Real-time Monitoring System',
      'Advanced Reporting Suite',
      'Performance Analytics Dashboard',
      'Predictive Maintenance System',
      'Customer Analytics Platform',
      'Supply Chain Visibility Tools',
      'Executive Decision Support System'
    ],
    deliverablesVi: [
      'Nền tảng Trí tuệ Kinh doanh',
      'Hệ thống Giám sát Thời gian thực',
      'Bộ Báo cáo Nâng cao',
      'Bảng điều khiển Phân tích Hiệu suất',
      'Hệ thống Bảo trì Dự đoán',
      'Nền tảng Phân tích Khách hàng',
      'Công cụ Hiển thị Chuỗi cung ứng',
      'Hệ thống Hỗ trợ Quyết định Điều hành'
    ],
    risks: [
      {
        id: 'r4-1',
        description: 'Data integration complexity',
        descriptionVi: 'Độ phức tạp tích hợp dữ liệu',
        probability: 'medium',
        impact: 'medium',
        mitigation: 'Standardized data formats and APIs',
        mitigationVi: 'Định dạng dữ liệu và API được chuẩn hóa',
        owner: 'Data Architect'
      }
    ],
    dependencies: ['phase3'],
    resources: [
      { id: 'r4-1', name: 'BI Developers', type: 'human', allocation: '4 FTE', cost: 240000 },
      { id: 'r4-2', name: 'Analytics Platform', type: 'technology', allocation: 'Enterprise License', cost: 120000 },
      { id: 'r4-3', name: 'Visualization Tools', type: 'technology', allocation: 'Professional', cost: 40000 }
    ],
    kpis: [
      { id: 'k4-1', name: 'Report Generation Time', nameVi: 'Thời gian Tạo Báo cáo', target: '< 5 min', current: 'N/A', unit: 'minutes', trend: 'stable' },
      { id: 'k4-2', name: 'Data Freshness', nameVi: 'Độ tươi mới Dữ liệu', target: '< 1 hour', current: 'N/A', unit: 'hours', trend: 'stable' }
    ]
  },
  {
    id: 'phase5',
    name: 'Full Automation & Scaling',
    nameVi: 'Tự động hóa Hoàn toàn & Mở rộng',
    description: 'Complete automation implementation, system scaling, and continuous improvement processes.',
    descriptionVi: 'Triển khai tự động hóa hoàn chỉnh, mở rộng hệ thống và quy trình cải tiến liên tục.',
    duration: '6 months',
    budget: 600000,
    status: 'planned',
    progress: 0,
    startDate: '2025-04-01',
    endDate: '2025-09-30',
    deliverables: [
      'Fully Automated Warehouse Operations',
      'Autonomous Vehicle Integration',
      'IoT Sensor Network',
      'Blockchain Supply Chain',
      'Advanced Robotics Systems',
      'Continuous Improvement Framework',
      'Scalability Architecture',
      'Global Expansion Readiness'
    ],
    deliverablesVi: [
      'Hoạt động Kho hoàn toàn Tự động',
      'Tích hợp Phương tiện Tự động',
      'Mạng Cảm biến IoT',
      'Chuỗi cung ứng Blockchain',
      'Hệ thống Robot Nâng cao',
      'Khung Cải tiến Liên tục',
      'Kiến trúc Khả năng mở rộng',
      'Sẵn sàng Mở rộng Toàn cầu'
    ],
    risks: [
      {
        id: 'r5-1',
        description: 'Technology obsolescence',
        descriptionVi: 'Lỗi thời công nghệ',
        probability: 'low',
        impact: 'medium',
        mitigation: 'Modular architecture and regular technology updates',
        mitigationVi: 'Kiến trúc mô-đun và cập nhật công nghệ thường xuyên',
        owner: 'Technology Director'
      }
    ],
    dependencies: ['phase4'],
    resources: [
      { id: 'r5-1', name: 'Automation Engineers', type: 'human', allocation: '6 FTE', cost: 360000 },
      { id: 'r5-2', name: 'Robotics Systems', type: 'technology', allocation: 'Industrial Robots', cost: 200000 },
      { id: 'r5-3', name: 'IoT Infrastructure', type: 'technology', allocation: 'Sensors & Network', cost: 100000 }
    ],
    kpis: [
      { id: 'k5-1', name: 'Automation Level', nameVi: 'Mức độ Tự động hóa', target: '95%', current: 'N/A', unit: '%', trend: 'stable' },
      { id: 'k5-2', name: 'System Scalability', nameVi: 'Khả năng mở rộng Hệ thống', target: '10x', current: 'N/A', unit: 'capacity', trend: 'stable' }
    ]
  }
];

export const overallMetrics = {
  totalBudget: 2400000,
  totalDuration: '24 months',
  expectedROI: '300%',
  paybackPeriod: '18 months',
  riskLevel: 'Medium',
  overallProgress: 55,
  completedPhases: 1,
  activePhases: 2,
  plannedPhases: 2
};

export const businessImpact = {
  costReduction: {
    target: '40%',
    current: '25%',
    areas: [
      'Transportation costs',
      'Inventory holding costs',
      'Labor costs',
      'Administrative overhead'
    ]
  },
  efficiencyGains: {
    target: '50%',
    current: '30%',
    areas: [
      'Order processing time',
      'Delivery accuracy',
      'Warehouse throughput',
      'Route optimization'
    ]
  },
  customerSatisfaction: {
    target: '95%',
    current: '88%',
    metrics: [
      'On-time delivery',
      'Order accuracy',
      'Customer service response',
      'Shipment visibility'
    ]
  }
};
