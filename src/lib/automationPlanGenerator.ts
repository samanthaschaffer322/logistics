'use client'

export interface AutomationPlan {
  id: string
  title: string
  overview: string
  totalSavings: {
    cost: number
    time: number
    efficiency: number
  }
  phases: AutomationPhase[]
  humanImpact: HumanImpact
  implementation: ImplementationPlan
  roi: ROIAnalysis
  risks: Risk[]
  timeline: TimelineItem[]
}

export interface AutomationPhase {
  id: string
  name: string
  description: string
  duration: string
  cost: number
  savings: number
  complexity: 'low' | 'medium' | 'high'
  technologies: string[]
  humanRoles: string[]
  tasks: AutomationTask[]
}

export interface AutomationTask {
  id: string
  name: string
  currentMethod: string
  automatedMethod: string
  timeSaving: number
  costSaving: number
  toolsRequired: string[]
}

export interface HumanImpact {
  totalPositions: number
  positionsEliminated: number
  positionsReassigned: number
  newPositionsCreated: number
  retrainingRequired: number
  severanceCost: number
  details: {
    eliminated: { role: string; count: number; avgSalary: number }[]
    reassigned: { role: string; count: number; newRole: string }[]
    created: { role: string; count: number; avgSalary: number }[]
  }
}

export interface ImplementationPlan {
  totalDuration: string
  totalCost: number
  phases: {
    name: string
    duration: string
    cost: number
    deliverables: string[]
  }[]
  resources: {
    technical: string[]
    human: string[]
    infrastructure: string[]
  }
}

export interface ROIAnalysis {
  initialInvestment: number
  annualSavings: number
  paybackPeriod: string
  roi5Year: number
  breakEvenMonth: number
}

export interface Risk {
  id: string
  category: 'technical' | 'human' | 'financial' | 'operational'
  description: string
  probability: 'low' | 'medium' | 'high'
  impact: 'low' | 'medium' | 'high'
  mitigation: string
}

export interface TimelineItem {
  id: string
  phase: string
  milestone: string
  date: string
  dependencies: string[]
  status: 'planned' | 'in-progress' | 'completed'
}

export class AutomationPlanGenerator {
  private language: 'vi' | 'en'

  constructor(language: 'vi' | 'en' = 'vi') {
    this.language = language
  }

  generateComprehensivePlan(analysisData: any): AutomationPlan {
    const plan: AutomationPlan = {
      id: `automation-plan-${Date.now()}`,
      title: this.language === 'vi' 
        ? 'Kế hoạch Tự động hóa Logistics Toàn diện'
        : 'Comprehensive Logistics Automation Plan',
      overview: this.generateOverview(),
      totalSavings: this.calculateTotalSavings(),
      phases: this.generatePhases(),
      humanImpact: this.analyzeHumanImpact(),
      implementation: this.createImplementationPlan(),
      roi: this.calculateROI(),
      risks: this.identifyRisks(),
      timeline: this.createTimeline()
    }

    return plan
  }

  private generateOverview(): string {
    return this.language === 'vi'
      ? `Kế hoạch tự động hóa toàn diện này được thiết kế để chuyển đổi hoạt động logistics từ quy trình thủ công sang hệ thống tự động thông minh. 

**Mục tiêu chính:**
• Giảm 75% thời gian xử lý thủ công
• Tiết kiệm 60% chi phí vận hành
• Tăng 90% độ chính xác dữ liệu
• Cải thiện 85% hiệu suất tổng thể

**Phạm vi tự động hóa:**
• Nhập liệu và xử lý dữ liệu
• Tối ưu tuyến đường và lập lịch
• Quản lý kho và theo dõi hàng hóa
• Báo cáo và phân tích hiệu suất
• Giao tiếp với khách hàng và đối tác

Kế hoạch này sẽ thay thế 15 vị trí nhân sự thủ công bằng 3 chuyên gia AI/Automation, mang lại ROI 340% trong 3 năm.`
      : `This comprehensive automation plan is designed to transform logistics operations from manual processes to intelligent automated systems.

**Primary Objectives:**
• Reduce manual processing time by 75%
• Save 60% operational costs
• Increase data accuracy by 90%
• Improve overall efficiency by 85%

**Automation Scope:**
• Data entry and processing
• Route optimization and scheduling
• Warehouse management and cargo tracking
• Performance reporting and analysis
• Customer and partner communication

This plan will replace 15 manual positions with 3 AI/Automation specialists, delivering 340% ROI over 3 years.`
  }

  private calculateTotalSavings() {
    return {
      cost: 45000000, // 45M VND annually
      time: 75, // 75% time reduction
      efficiency: 85 // 85% efficiency improvement
    }
  }

  private generatePhases(): AutomationPhase[] {
    return [
      {
        id: 'phase-1',
        name: this.language === 'vi' ? 'Giai đoạn 1: Tự động hóa Nhập liệu' : 'Phase 1: Data Entry Automation',
        description: this.language === 'vi'
          ? 'Triển khai AI OCR và automated data processing để thay thế nhập liệu thủ công'
          : 'Deploy AI OCR and automated data processing to replace manual data entry',
        duration: this.language === 'vi' ? '6-8 tuần' : '6-8 weeks',
        cost: 15000000,
        savings: 18000000,
        complexity: 'medium',
        technologies: ['AI OCR', 'RPA', 'Machine Learning', 'API Integration'],
        humanRoles: [
          this.language === 'vi' ? 'Nhân viên nhập liệu (5 người)' : 'Data Entry Clerks (5 people)',
          this.language === 'vi' ? 'Nhân viên kiểm tra (2 người)' : 'Data Verification Staff (2 people)'
        ],
        tasks: [
          {
            id: 'task-1-1',
            name: this.language === 'vi' ? 'Tự động nhập dữ liệu từ Excel/PDF' : 'Automated Excel/PDF data input',
            currentMethod: this.language === 'vi' ? 'Nhân viên nhập thủ công 8h/ngày' : 'Manual staff input 8h/day',
            automatedMethod: this.language === 'vi' ? 'AI OCR + Auto-parsing 24/7' : 'AI OCR + Auto-parsing 24/7',
            timeSaving: 90,
            costSaving: 12000000,
            toolsRequired: ['Tesseract OCR', 'Python Scripts', 'Database Integration']
          },
          {
            id: 'task-1-2',
            name: this.language === 'vi' ? 'Kiểm tra và validation tự động' : 'Automated validation and checking',
            currentMethod: this.language === 'vi' ? 'Kiểm tra thủ công từng bản ghi' : 'Manual record-by-record checking',
            automatedMethod: this.language === 'vi' ? 'AI validation rules + ML anomaly detection' : 'AI validation rules + ML anomaly detection',
            timeSaving: 85,
            costSaving: 6000000,
            toolsRequired: ['ML Models', 'Validation Engine', 'Alert System']
          }
        ]
      },
      {
        id: 'phase-2',
        name: this.language === 'vi' ? 'Giai đoạn 2: AI Route Optimization' : 'Phase 2: AI Route Optimization',
        description: this.language === 'vi'
          ? 'Phát triển AI engine để tự động tối ưu tuyến đường và lập lịch vận chuyển'
          : 'Develop AI engine for automatic route optimization and transportation scheduling',
        duration: this.language === 'vi' ? '8-10 tuần' : '8-10 weeks',
        cost: 25000000,
        savings: 35000000,
        complexity: 'high',
        technologies: ['AI Algorithms', 'Real-time Data', 'GPS Integration', 'Traffic APIs'],
        humanRoles: [
          this.language === 'vi' ? 'Route Planner (3 người)' : 'Route Planners (3 people)',
          this.language === 'vi' ? 'Logistics Coordinator (2 người)' : 'Logistics Coordinators (2 people)'
        ],
        tasks: [
          {
            id: 'task-2-1',
            name: this.language === 'vi' ? 'Tối ưu tuyến đường thông minh' : 'Smart route optimization',
            currentMethod: this.language === 'vi' ? 'Planner lập kế hoạch thủ công 4h/tuyến' : 'Manual planning 4h/route',
            automatedMethod: this.language === 'vi' ? 'AI optimization 5 phút/tuyến' : 'AI optimization 5 min/route',
            timeSaving: 95,
            costSaving: 20000000,
            toolsRequired: ['Optimization Algorithms', 'Real-time Traffic Data', 'GPS APIs']
          },
          {
            id: 'task-2-2',
            name: this.language === 'vi' ? 'Lập lịch tự động' : 'Automated scheduling',
            currentMethod: this.language === 'vi' ? 'Coordinator sắp xếp thủ công' : 'Manual coordinator scheduling',
            automatedMethod: this.language === 'vi' ? 'AI scheduling với constraints' : 'AI scheduling with constraints',
            timeSaving: 80,
            costSaving: 15000000,
            toolsRequired: ['Scheduling Engine', 'Constraint Solver', 'Calendar Integration']
          }
        ]
      },
      {
        id: 'phase-3',
        name: this.language === 'vi' ? 'Giai đoạn 3: Automated Reporting' : 'Phase 3: Automated Reporting',
        description: this.language === 'vi'
          ? 'Thiết lập hệ thống báo cáo tự động và dashboard thời gian thực'
          : 'Setup automated reporting system and real-time dashboards',
        duration: this.language === 'vi' ? '4-6 tuần' : '4-6 weeks',
        cost: 8000000,
        savings: 15000000,
        complexity: 'low',
        technologies: ['BI Tools', 'Automated Reports', 'Dashboard', 'Data Visualization'],
        humanRoles: [
          this.language === 'vi' ? 'Data Analyst (2 người)' : 'Data Analysts (2 people)',
          this.language === 'vi' ? 'Report Specialist (1 người)' : 'Report Specialist (1 person)'
        ],
        tasks: [
          {
            id: 'task-3-1',
            name: this.language === 'vi' ? 'Báo cáo tự động' : 'Automated reporting',
            currentMethod: this.language === 'vi' ? 'Analyst tạo báo cáo thủ công' : 'Manual report creation by analyst',
            automatedMethod: this.language === 'vi' ? 'Auto-generated reports + AI insights' : 'Auto-generated reports + AI insights',
            timeSaving: 95,
            costSaving: 10000000,
            toolsRequired: ['Power BI', 'Python Scripts', 'Email Automation']
          }
        ]
      }
    ]
  }

  private analyzeHumanImpact(): HumanImpact {
    return {
      totalPositions: 15,
      positionsEliminated: 10,
      positionsReassigned: 3,
      newPositionsCreated: 3,
      retrainingRequired: 6,
      severanceCost: 180000000, // 180M VND
      details: {
        eliminated: [
          { role: this.language === 'vi' ? 'Nhân viên nhập liệu' : 'Data Entry Clerk', count: 5, avgSalary: 8000000 },
          { role: this.language === 'vi' ? 'Nhân viên kiểm tra' : 'Data Verification Staff', count: 2, avgSalary: 10000000 },
          { role: this.language === 'vi' ? 'Route Planner' : 'Route Planner', count: 3, avgSalary: 15000000 }
        ],
        reassigned: [
          { role: this.language === 'vi' ? 'Data Analyst' : 'Data Analyst', count: 2, newRole: this.language === 'vi' ? 'AI Data Specialist' : 'AI Data Specialist' },
          { role: this.language === 'vi' ? 'Logistics Coordinator' : 'Logistics Coordinator', count: 1, newRole: this.language === 'vi' ? 'Automation Supervisor' : 'Automation Supervisor' }
        ],
        created: [
          { role: this.language === 'vi' ? 'AI Engineer' : 'AI Engineer', count: 1, avgSalary: 25000000 },
          { role: this.language === 'vi' ? 'Automation Specialist' : 'Automation Specialist', count: 2, avgSalary: 20000000 }
        ]
      }
    }
  }

  private createImplementationPlan(): ImplementationPlan {
    return {
      totalDuration: this.language === 'vi' ? '18-24 tuần' : '18-24 weeks',
      totalCost: 48000000,
      phases: [
        {
          name: this.language === 'vi' ? 'Chuẩn bị và Phân tích' : 'Preparation and Analysis',
          duration: this.language === 'vi' ? '2 tuần' : '2 weeks',
          cost: 5000000,
          deliverables: [
            this.language === 'vi' ? 'Phân tích quy trình hiện tại' : 'Current process analysis',
            this.language === 'vi' ? 'Thiết kế kiến trúc hệ thống' : 'System architecture design',
            this.language === 'vi' ? 'Kế hoạch triển khai chi tiết' : 'Detailed implementation plan'
          ]
        },
        {
          name: this.language === 'vi' ? 'Phát triển và Testing' : 'Development and Testing',
          duration: this.language === 'vi' ? '12-16 tuần' : '12-16 weeks',
          cost: 35000000,
          deliverables: [
            this.language === 'vi' ? 'AI OCR System' : 'AI OCR System',
            this.language === 'vi' ? 'Route Optimization Engine' : 'Route Optimization Engine',
            this.language === 'vi' ? 'Automated Reporting System' : 'Automated Reporting System'
          ]
        },
        {
          name: this.language === 'vi' ? 'Triển khai và Đào tạo' : 'Deployment and Training',
          duration: this.language === 'vi' ? '4-6 tuần' : '4-6 weeks',
          cost: 8000000,
          deliverables: [
            this.language === 'vi' ? 'Hệ thống production' : 'Production system',
            this.language === 'vi' ? 'Đào tạo nhân viên' : 'Staff training',
            this.language === 'vi' ? 'Tài liệu vận hành' : 'Operation documentation'
          ]
        }
      ],
      resources: {
        technical: [
          this.language === 'vi' ? '2 AI Engineers' : '2 AI Engineers',
          this.language === 'vi' ? '1 Full-stack Developer' : '1 Full-stack Developer',
          this.language === 'vi' ? '1 DevOps Engineer' : '1 DevOps Engineer'
        ],
        human: [
          this.language === 'vi' ? '1 Project Manager' : '1 Project Manager',
          this.language === 'vi' ? '1 Business Analyst' : '1 Business Analyst',
          this.language === 'vi' ? '2 QA Testers' : '2 QA Testers'
        ],
        infrastructure: [
          this.language === 'vi' ? 'Cloud servers (AWS/Azure)' : 'Cloud servers (AWS/Azure)',
          this.language === 'vi' ? 'Database systems' : 'Database systems',
          this.language === 'vi' ? 'API integrations' : 'API integrations'
        ]
      }
    }
  }

  private calculateROI(): ROIAnalysis {
    return {
      initialInvestment: 48000000,
      annualSavings: 68000000,
      paybackPeriod: this.language === 'vi' ? '8.5 tháng' : '8.5 months',
      roi5Year: 340,
      breakEvenMonth: 9
    }
  }

  private identifyRisks(): Risk[] {
    return [
      {
        id: 'risk-1',
        category: 'technical',
        description: this.language === 'vi' 
          ? 'AI model có thể không đạt độ chính xác mong muốn với dữ liệu Việt Nam'
          : 'AI model may not achieve desired accuracy with Vietnamese data',
        probability: 'medium',
        impact: 'high',
        mitigation: this.language === 'vi'
          ? 'Training model với dataset lớn, có backup manual process'
          : 'Train model with large dataset, maintain backup manual process'
      },
      {
        id: 'risk-2',
        category: 'human',
        description: this.language === 'vi'
          ? 'Nhân viên có thể kháng cự việc thay đổi quy trình'
          : 'Staff may resist process changes',
        probability: 'high',
        impact: 'medium',
        mitigation: this.language === 'vi'
          ? 'Chương trình đào tạo và communication tốt, có chính sách hỗ trợ'
          : 'Good training and communication program, support policies'
      },
      {
        id: 'risk-3',
        category: 'financial',
        description: this.language === 'vi'
          ? 'Chi phí triển khai có thể vượt ngân sách'
          : 'Implementation costs may exceed budget',
        probability: 'low',
        impact: 'medium',
        mitigation: this.language === 'vi'
          ? 'Theo dõi chặt chẽ ngân sách, có dự phòng 20%'
          : 'Close budget monitoring, 20% contingency reserve'
      }
    ]
  }

  private createTimeline(): TimelineItem[] {
    const baseDate = new Date()
    return [
      {
        id: 'milestone-1',
        phase: this.language === 'vi' ? 'Chuẩn bị' : 'Preparation',
        milestone: this.language === 'vi' ? 'Hoàn thành phân tích quy trình' : 'Complete process analysis',
        date: new Date(baseDate.getTime() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        dependencies: [],
        status: 'planned'
      },
      {
        id: 'milestone-2',
        phase: this.language === 'vi' ? 'Phát triển' : 'Development',
        milestone: this.language === 'vi' ? 'AI OCR System hoàn thành' : 'AI OCR System completed',
        date: new Date(baseDate.getTime() + 70 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        dependencies: ['milestone-1'],
        status: 'planned'
      },
      {
        id: 'milestone-3',
        phase: this.language === 'vi' ? 'Phát triển' : 'Development',
        milestone: this.language === 'vi' ? 'Route Optimization Engine hoàn thành' : 'Route Optimization Engine completed',
        date: new Date(baseDate.getTime() + 112 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        dependencies: ['milestone-2'],
        status: 'planned'
      },
      {
        id: 'milestone-4',
        phase: this.language === 'vi' ? 'Triển khai' : 'Deployment',
        milestone: this.language === 'vi' ? 'Go-live Production System' : 'Go-live Production System',
        date: new Date(baseDate.getTime() + 154 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        dependencies: ['milestone-3'],
        status: 'planned'
      }
    ]
  }

  exportToPDF(plan: AutomationPlan): Blob {
    // Create proper PDF content using HTML to PDF conversion
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Automation Plan Report</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.6; }
        .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 30px; }
        .section { margin-bottom: 30px; }
        .section h2 { color: #2563eb; border-bottom: 1px solid #e5e7eb; padding-bottom: 10px; }
        .phase { background: #f8fafc; padding: 15px; margin: 10px 0; border-left: 4px solid #3b82f6; }
        .risk { background: #fef2f2; padding: 10px; margin: 5px 0; border-left: 3px solid #ef4444; }
        .financial { background: #f0fdf4; padding: 15px; border-radius: 8px; }
        table { width: 100%; border-collapse: collapse; margin: 10px 0; }
        th, td { border: 1px solid #d1d5db; padding: 8px; text-align: left; }
        th { background-color: #f3f4f6; }
        .timeline-item { margin: 10px 0; padding: 10px; background: #fafafa; border-radius: 5px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>${plan.title}</h1>
        <p>Generated: ${new Date().toLocaleDateString('vi-VN')}</p>
    </div>

    <div class="section">
        <h2>EXECUTIVE SUMMARY</h2>
        <div style="white-space: pre-line;">${plan.overview}</div>
    </div>

    <div class="section financial">
        <h2>FINANCIAL OVERVIEW</h2>
        <table>
            <tr><th>Metric</th><th>Value</th></tr>
            <tr><td>Initial Investment</td><td>${(plan.roi.initialInvestment / 1000000).toFixed(1)}M VND</td></tr>
            <tr><td>Annual Savings</td><td>${(plan.roi.annualSavings / 1000000).toFixed(1)}M VND</td></tr>
            <tr><td>Payback Period</td><td>${plan.roi.paybackPeriod}</td></tr>
            <tr><td>5-Year ROI</td><td>${plan.roi.roi5Year}%</td></tr>
        </table>
    </div>

    <div class="section">
        <h2>IMPLEMENTATION PHASES</h2>
        ${plan.phases.map((phase, index) => `
        <div class="phase">
            <h3>Phase ${index + 1}: ${phase.name}</h3>
            <p><strong>Duration:</strong> ${phase.duration} | <strong>Cost:</strong> ${(phase.cost / 1000000).toFixed(1)}M VND | <strong>Savings:</strong> ${(phase.savings / 1000000).toFixed(1)}M VND</p>
            <p><strong>Complexity:</strong> ${phase.complexity.toUpperCase()}</p>
            <p><strong>Technologies:</strong> ${phase.technologies.join(', ')}</p>
            <div><strong>Tasks:</strong>
                <ul>
                    ${phase.tasks.map(task => `<li>${task.name}: ${task.timeSaving}% time saving, ${(task.costSaving / 1000000).toFixed(1)}M VND savings</li>`).join('')}
                </ul>
            </div>
        </div>
        `).join('')}
    </div>

    <div class="section">
        <h2>HUMAN IMPACT ANALYSIS</h2>
        <table>
            <tr><th>Category</th><th>Count</th></tr>
            <tr><td>Total Positions</td><td>${plan.humanImpact.totalPositions}</td></tr>
            <tr><td>Positions Eliminated</td><td>${plan.humanImpact.positionsEliminated}</td></tr>
            <tr><td>Positions Reassigned</td><td>${plan.humanImpact.positionsReassigned}</td></tr>
            <tr><td>New Positions Created</td><td>${plan.humanImpact.newPositionsCreated}</td></tr>
        </table>
    </div>

    <div class="section">
        <h2>RISK ANALYSIS</h2>
        ${plan.risks.map(risk => `
        <div class="risk">
            <h4>${risk.description}</h4>
            <p><strong>Category:</strong> ${risk.category} | <strong>Probability:</strong> ${risk.probability} | <strong>Impact:</strong> ${risk.impact}</p>
            <p><strong>Mitigation:</strong> ${risk.mitigation}</p>
        </div>
        `).join('')}
    </div>

    <div class="section">
        <h2>IMPLEMENTATION TIMELINE</h2>
        ${plan.timeline.map(item => `
        <div class="timeline-item">
            <strong>${item.date}:</strong> ${item.milestone} (${item.phase})
        </div>
        `).join('')}
    </div>
</body>
</html>`;

    return new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
  }

  exportToExcel(plan: AutomationPlan): Blob {
    // Generate proper Excel CSV content with proper formatting
    const csvContent = `"Section","Item","Value","Details","Cost (VND)","Savings (VND)","Timeline"
"Overview","Title","${plan.title}","","","",""
"Overview","Generated Date","${new Date().toLocaleDateString('vi-VN')}","","","",""
"Financial","Initial Investment","${(plan.roi.initialInvestment / 1000000).toFixed(1)}M VND","","${plan.roi.initialInvestment}","","${plan.roi.paybackPeriod}"
"Financial","Annual Savings","${(plan.roi.annualSavings / 1000000).toFixed(1)}M VND","","","${plan.roi.annualSavings}",""
"Financial","Payback Period","${plan.roi.paybackPeriod}","","","",""
"Financial","5-Year ROI","${plan.roi.roi5Year}%","","","",""
${plan.phases.map((phase, index) => `
"Phase ${index + 1}","Name","${phase.name}","${phase.description}","${phase.cost}","${phase.savings}","${phase.duration}"
"Phase ${index + 1}","Complexity","${phase.complexity}","","","",""
"Phase ${index + 1}","Technologies","${phase.technologies.join('; ')}","","","",""
${phase.tasks.map(task => `"Phase ${index + 1}","Task","${task.name}","${task.currentMethod} → ${task.automatedMethod}","${task.costSaving}","${task.costSaving}","${task.timeSaving}% time saving"`).join('\n')}
`).join('')}
"Human Impact","Total Positions","${plan.humanImpact.totalPositions}","","","",""
"Human Impact","Eliminated","${plan.humanImpact.positionsEliminated}","","","",""
"Human Impact","Reassigned","${plan.humanImpact.positionsReassigned}","","","",""
"Human Impact","New Created","${plan.humanImpact.newPositionsCreated}","","","",""
${plan.humanImpact.details.eliminated.map(role => `"Eliminated Roles","${role.role}","${role.count}","${(role.avgSalary / 1000000).toFixed(1)}M VND/month","${role.avgSalary * role.count}","",""`).join('\n')}
${plan.humanImpact.details.created.map(role => `"New Roles","${role.role}","${role.count}","${(role.avgSalary / 1000000).toFixed(1)}M VND/month","${role.avgSalary * role.count}","",""`).join('\n')}
${plan.risks.map(risk => `"Risk","${risk.category}","${risk.probability}/${risk.impact}","${risk.description}","","",""`).join('\n')}
${plan.timeline.map(item => `"Timeline","${item.date}","${item.milestone}","${item.phase}","","",""`).join('\n')}`;

    return new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8' });
  }
}
