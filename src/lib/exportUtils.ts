import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';

// Sample automation plan data for export
const sampleAutomationPlan = {
  phases: [
    {
      id: 'phase1',
      name: 'Foundation & Assessment',
      nameVi: 'Nền tảng & Đánh giá',
      description: 'Initial assessment and foundation setup',
      descriptionVi: 'Đánh giá ban đầu và thiết lập nền tảng',
      duration: '3 months',
      budget: 480000,
      status: 'planned' as const,
      progress: 0,
      startDate: '2025-01-01',
      endDate: '2025-03-31',
      deliverables: [
        'Current state assessment report',
        'Technology stack evaluation',
        'Infrastructure requirements analysis',
        'Project roadmap and timeline'
      ],
      deliverablesVi: [
        'Báo cáo đánh giá tình trạng hiện tại',
        'Đánh giá ngăn xếp công nghệ',
        'Phân tích yêu cầu cơ sở hạ tầng',
        'Lộ trình dự án và thời gian biểu'
      ]
    },
    {
      id: 'phase2',
      name: 'Core System Implementation',
      nameVi: 'Triển khai Hệ thống Cốt lõi',
      description: 'Implementation of core logistics systems',
      descriptionVi: 'Triển khai các hệ thống logistics cốt lõi',
      duration: '4 months',
      budget: 720000,
      status: 'planned' as const,
      progress: 0,
      startDate: '2025-04-01',
      endDate: '2025-07-31',
      deliverables: [
        'Route optimization system',
        'Fleet management platform',
        'Real-time tracking system',
        'Basic analytics dashboard'
      ],
      deliverablesVi: [
        'Hệ thống tối ưu hóa tuyến đường',
        'Nền tảng quản lý đội xe',
        'Hệ thống theo dõi thời gian thực',
        'Bảng điều khiển phân tích cơ bản'
      ]
    },
    {
      id: 'phase3',
      name: 'AI Integration & Optimization',
      nameVi: 'Tích hợp AI & Tối ưu hóa',
      description: 'Integration of AI capabilities and optimization',
      descriptionVi: 'Tích hợp khả năng AI và tối ưu hóa',
      duration: '3 months',
      budget: 600000,
      status: 'planned' as const,
      progress: 0,
      startDate: '2025-08-01',
      endDate: '2025-10-31',
      deliverables: [
        'AI-powered route optimization',
        'Predictive analytics system',
        'Machine learning models',
        'Advanced reporting tools'
      ],
      deliverablesVi: [
        'Tối ưu hóa tuyến đường được hỗ trợ bởi AI',
        'Hệ thống phân tích dự đoán',
        'Mô hình học máy',
        'Công cụ báo cáo nâng cao'
      ]
    },
    {
      id: 'phase4',
      name: 'Advanced Analytics & Intelligence',
      nameVi: 'Phân tích Nâng cao & Trí tuệ',
      description: 'Advanced analytics and business intelligence',
      descriptionVi: 'Phân tích nâng cao và trí tuệ kinh doanh',
      duration: '4 months',
      budget: 480000,
      status: 'planned' as const,
      progress: 0,
      startDate: '2025-11-01',
      endDate: '2026-02-28',
      deliverables: [
        'Business intelligence platform',
        'Advanced analytics dashboard',
        'Performance monitoring system',
        'Custom reporting tools'
      ],
      deliverablesVi: [
        'Nền tảng trí tuệ kinh doanh',
        'Bảng điều khiển phân tích nâng cao',
        'Hệ thống giám sát hiệu suất',
        'Công cụ báo cáo tùy chỉnh'
      ]
    },
    {
      id: 'phase5',
      name: 'Full Automation & Scaling',
      nameVi: 'Tự động hóa Hoàn toàn & Mở rộng',
      description: 'Complete automation and system scaling',
      descriptionVi: 'Tự động hóa hoàn toàn và mở rộng hệ thống',
      duration: '4 months',
      budget: 120000,
      status: 'planned' as const,
      progress: 0,
      startDate: '2026-03-01',
      endDate: '2026-06-30',
      deliverables: [
        'Fully automated logistics system',
        'Scalable infrastructure',
        'Integration with external systems',
        'Training and documentation'
      ],
      deliverablesVi: [
        'Hệ thống logistics tự động hoàn toàn',
        'Cơ sở hạ tầng có thể mở rộng',
        'Tích hợp với các hệ thống bên ngoài',
        'Đào tạo và tài liệu'
      ]
    }
  ]
};

const overallMetrics = {
  totalBudget: 2400000,
  timeline: '18 months',
  expectedROI: '300%',
  paybackPeriod: '12 months'
};

// Enhanced PDF Export with proper content and formatting
export const exportToPDF = (language: 'en' | 'vi' = 'vi') => {
  try {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    let yPosition = 20;
    const margin = 20;
    const maxWidth = pageWidth - (margin * 2);

    // Set default font
    doc.setFont('helvetica');

    // Helper function to add text with proper encoding
    const addText = (text: string, x: number, y: number, options: any = {}) => {
      const fontSize = options.fontSize || 12;
      const fontStyle = options.fontStyle || 'normal';
      const align = options.align || 'left';
      
      doc.setFontSize(fontSize);
      doc.setFont('helvetica', fontStyle);
      
      // Handle Vietnamese characters by converting to ASCII-safe format
      const safeText = text.replace(/[^\x00-\x7F]/g, function(char) {
        const charMap: { [key: string]: string } = {
          'ă': 'a', 'â': 'a', 'á': 'a', 'à': 'a', 'ả': 'a', 'ã': 'a', 'ạ': 'a',
          'ắ': 'a', 'ằ': 'a', 'ẳ': 'a', 'ẵ': 'a', 'ặ': 'a',
          'ấ': 'a', 'ầ': 'a', 'ẩ': 'a', 'ẫ': 'a', 'ậ': 'a',
          'đ': 'd',
          'é': 'e', 'è': 'e', 'ẻ': 'e', 'ẽ': 'e', 'ẹ': 'e',
          'ê': 'e', 'ế': 'e', 'ề': 'e', 'ể': 'e', 'ễ': 'e', 'ệ': 'e',
          'í': 'i', 'ì': 'i', 'ỉ': 'i', 'ĩ': 'i', 'ị': 'i',
          'ó': 'o', 'ò': 'o', 'ỏ': 'o', 'õ': 'o', 'ọ': 'o',
          'ô': 'o', 'ố': 'o', 'ồ': 'o', 'ổ': 'o', 'ỗ': 'o', 'ộ': 'o',
          'ơ': 'o', 'ớ': 'o', 'ờ': 'o', 'ở': 'o', 'ỡ': 'o', 'ợ': 'o',
          'ú': 'u', 'ù': 'u', 'ủ': 'u', 'ũ': 'u', 'ụ': 'u',
          'ư': 'u', 'ứ': 'u', 'ừ': 'u', 'ử': 'u', 'ữ': 'u', 'ự': 'u',
          'ý': 'y', 'ỳ': 'y', 'ỷ': 'y', 'ỹ': 'y', 'ỵ': 'y'
        };
        return charMap[char] || char;
      });
      
      if (align === 'center') {
        doc.text(safeText, x, y, { align: 'center' });
      } else {
        const lines = doc.splitTextToSize(safeText, maxWidth);
        doc.text(lines, x, y);
        return y + (lines.length * fontSize * 0.4);
      }
      return y + fontSize * 0.4;
    };

    // Helper function to check if we need a new page
    const checkNewPage = (requiredSpace: number) => {
      if (yPosition + requiredSpace > pageHeight - margin) {
        doc.addPage();
        yPosition = margin;
      }
    };

    // Title Page
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    const title = language === 'vi' 
      ? 'Ke hoach Tu dong hoa Logistics Toan dien'
      : 'Comprehensive Logistics Automation Plan';
    doc.text(title, pageWidth / 2, yPosition + 20, { align: 'center' });
    
    doc.setFontSize(14);
    doc.setFont('helvetica', 'normal');
    const subtitle = language === 'vi'
      ? 'Lo trinh chien luoc cho viec so hoa hoan toan logistics va tich hop AI'
      : 'Strategic roadmap for complete logistics digitization and AI integration';
    doc.text(subtitle, pageWidth / 2, yPosition + 40, { align: 'center' });

    // Date and version
    doc.setFontSize(10);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, pageWidth / 2, yPosition + 60, { align: 'center' });
    doc.text('Version: 2.0', pageWidth / 2, yPosition + 70, { align: 'center' });

    // Add new page for content
    doc.addPage();
    yPosition = margin;

    // Executive Summary
    checkNewPage(40);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    yPosition = addText(language === 'vi' ? 'Tom tat Dieu hanh' : 'Executive Summary', margin, yPosition, { fontSize: 18, fontStyle: 'bold' });
    yPosition += 10;

    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    const executiveSummary = language === 'vi' 
      ? 'Ke hoach tu dong hoa logistics toan dien nay trinh bay lo trinh chien luoc de chuyen doi hoan toan cac hoat dong logistics sang nen tang so hoa duoc ho tro boi AI. Voi ngan sach 2.4 trieu USD va thoi gian thuc hien 18 thang, du an nay du kien mang lai ROI 300% trong vong 12 thang dau tien.'
      : 'This comprehensive logistics automation plan outlines a strategic roadmap to transform logistics operations into a fully digitized, AI-powered platform. With a budget of $2.4M and 18-month implementation timeline, this project is expected to deliver 300% ROI within the first 12 months.';
    
    yPosition = addText(executiveSummary, margin, yPosition);
    yPosition += 15;

    // Key Benefits
    checkNewPage(60);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    yPosition = addText(language === 'vi' ? 'Loi ich Chinh' : 'Key Benefits', margin, yPosition, { fontSize: 16, fontStyle: 'bold' });
    yPosition += 10;

    const benefits = [
      language === 'vi' ? '• Giam 40% chi phi van hanh' : '• 40% reduction in operational costs',
      language === 'vi' ? '• Tang 60% hieu suat giao hang' : '• 60% improvement in delivery efficiency',
      language === 'vi' ? '• Giam 25% khoang cach tuyen duong' : '• 25% reduction in route distances',
      language === 'vi' ? '• Tang 95% su hai long khach hang' : '• 95% customer satisfaction rate',
      language === 'vi' ? '• Tu dong hoa 80% quy trinh thu cong' : '• 80% automation of manual processes'
    ];

    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    benefits.forEach(benefit => {
      checkNewPage(15);
      yPosition = addText(benefit, margin, yPosition);
      yPosition += 5;
    });
    yPosition += 10;

    // Implementation Phases
    checkNewPage(40);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    yPosition = addText(language === 'vi' ? 'Cac Giai doan Trien khai' : 'Implementation Phases', margin, yPosition, { fontSize: 16, fontStyle: 'bold' });
    yPosition += 10;

    sampleAutomationPlan.phases.forEach((phase, index) => {
      checkNewPage(80);
      
      // Phase title
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      const phaseTitle = language === 'vi' ? phase.nameVi : phase.name;
      yPosition = addText(`${index + 1}. ${phaseTitle}`, margin, yPosition, { fontSize: 14, fontStyle: 'bold' });
      yPosition += 8;

      // Phase details
      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      yPosition = addText(`Duration: ${phase.duration}`, margin + 10, yPosition);
      yPosition += 5;
      yPosition = addText(`Budget: $${phase.budget.toLocaleString()}`, margin + 10, yPosition);
      yPosition += 5;

      // Key deliverables
      const deliverables = language === 'vi' ? phase.deliverablesVi : phase.deliverables;
      yPosition = addText('Key Deliverables:', margin + 10, yPosition, { fontStyle: 'bold' });
      yPosition += 5;
      
      deliverables.slice(0, 3).forEach(deliverable => {
        checkNewPage(15);
        yPosition = addText(`• ${deliverable}`, margin + 15, yPosition);
        yPosition += 5;
      });
      yPosition += 10;
    });

    // Budget Breakdown
    checkNewPage(60);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    yPosition = addText(language === 'vi' ? 'Phan bo Ngan sach' : 'Budget Breakdown', margin, yPosition, { fontSize: 16, fontStyle: 'bold' });
    yPosition += 10;

    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    yPosition = addText(`Total Budget: $${overallMetrics.totalBudget.toLocaleString()}`, margin, yPosition);
    yPosition += 8;
    yPosition = addText(`Expected ROI: ${overallMetrics.expectedROI}`, margin, yPosition);
    yPosition += 8;
    yPosition = addText(`Payback Period: ${overallMetrics.paybackPeriod}`, margin, yPosition);
    yPosition += 15;

    // Why, How, Alternative Solutions
    checkNewPage(80);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    yPosition = addText(language === 'vi' ? 'Tai sao, Cach thuc, Giai phap Thay the' : 'Why, How, Alternative Solutions', margin, yPosition, { fontSize: 16, fontStyle: 'bold' });
    yPosition += 10;

    // Why
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    yPosition = addText(language === 'vi' ? 'Tai sao can Tu dong hoa?' : 'Why Automation?', margin, yPosition, { fontSize: 14, fontStyle: 'bold' });
    yPosition += 8;

    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    const whyText = language === 'vi' 
      ? 'Nganh logistics Viet Nam dang doi mat voi nhieu thach thuc: chi phi van hanh cao, hieu suat thap, thieu minh bach trong quy trinh. Tu dong hoa se giai quyet cac van de nay bang cach toi uu hoa tuyen duong, giam thieu sai sot con nguoi, va cung cap thong tin thoi gian thuc.'
      : 'Vietnam logistics industry faces challenges: high operational costs, low efficiency, lack of process transparency. Automation addresses these by optimizing routes, reducing human errors, and providing real-time information.';
    yPosition = addText(whyText, margin, yPosition);
    yPosition += 15;

    // How
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    yPosition = addText(language === 'vi' ? 'Cach thuc Thuc hien?' : 'How to Implement?', margin, yPosition, { fontSize: 14, fontStyle: 'bold' });
    yPosition += 8;

    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    const howText = language === 'vi' 
      ? 'Thuc hien theo 5 giai doan: (1) Danh gia va thiet lap nen tang, (2) Trien khai he thong cot loi, (3) Tich hop AI va toi uu hoa, (4) Phan tich nang cao va tri tue, (5) Tu dong hoa hoan toan va mo rong. Moi giai doan co muc tieu ro rang va KPI cu the.'
      : 'Implementation in 5 phases: (1) Assessment and foundation, (2) Core system deployment, (3) AI integration and optimization, (4) Advanced analytics and intelligence, (5) Full automation and scaling. Each phase has clear objectives and specific KPIs.';
    yPosition = addText(howText, margin, yPosition);
    yPosition += 15;

    // Alternative Solutions
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    yPosition = addText(language === 'vi' ? 'Giai phap Thay the?' : 'Alternative Solutions?', margin, yPosition, { fontSize: 14, fontStyle: 'bold' });
    yPosition += 8;

    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    const alternativeText = language === 'vi' 
      ? 'Cac lua chon khac bao gom: (1) Nang cap tung buoc - chi phi thap hon nhung hieu qua cham, (2) Su dung giai phap ben thu ba - nhanh hon nhung phu thuoc cao, (3) Phat trien noi bo - kiem soat tot hon nhung can nhieu tai nguyen. Giai phap hien tai la toi uu nhat cho dieu kien Viet Nam.'
      : 'Alternatives include: (1) Gradual upgrade - lower cost but slower results, (2) Third-party solutions - faster but high dependency, (3) In-house development - better control but resource-intensive. Current solution is optimal for Vietnam conditions.';
    yPosition = addText(alternativeText, margin, yPosition);

    // Footer
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.text(`Page ${i} of ${pageCount}`, pageWidth - margin, pageHeight - 10, { align: 'right' });
      doc.text('LogiAI - Comprehensive Logistics Automation Plan', margin, pageHeight - 10);
    }

    // Save the PDF
    const fileName = language === 'vi' 
      ? 'Ke-hoach-Tu-dong-hoa-Logistics-Toan-dien.pdf'
      : 'Comprehensive-Logistics-Automation-Plan.pdf';
    
    doc.save(fileName);
    return true;

  } catch (error) {
    console.error('PDF Export Error:', error);
    throw new Error('Failed to generate PDF. Please try again.');
  }
};
// Enhanced Excel Export with proper content and formatting
export const exportToExcel = (language: 'en' | 'vi' = 'vi') => {
  try {
    const workbook = XLSX.utils.book_new();

    // Executive Summary Sheet
    const executiveSummaryData = [
      [language === 'vi' ? 'Ke hoach Tu dong hoa Logistics Toan dien' : 'Comprehensive Logistics Automation Plan'],
      [''],
      [language === 'vi' ? 'Tom tat Dieu hanh' : 'Executive Summary'],
      [language === 'vi' ? 'Tong ngan sach' : 'Total Budget', `$${overallMetrics.totalBudget.toLocaleString()}`],
      [language === 'vi' ? 'Thoi gian thuc hien' : 'Implementation Timeline', overallMetrics.timeline],
      [language === 'vi' ? 'ROI du kien' : 'Expected ROI', overallMetrics.expectedROI],
      [language === 'vi' ? 'Thoi gian hoan von' : 'Payback Period', overallMetrics.paybackPeriod],
      [''],
      [language === 'vi' ? 'Loi ich Chinh' : 'Key Benefits'],
      [language === 'vi' ? 'Giam chi phi van hanh' : 'Operational Cost Reduction', '40%'],
      [language === 'vi' ? 'Tang hieu suat giao hang' : 'Delivery Efficiency Improvement', '60%'],
      [language === 'vi' ? 'Giam khoang cach tuyen duong' : 'Route Distance Reduction', '25%'],
      [language === 'vi' ? 'Su hai long khach hang' : 'Customer Satisfaction', '95%'],
      [language === 'vi' ? 'Tu dong hoa quy trinh' : 'Process Automation', '80%'],
      [''],
      [language === 'vi' ? 'Tai sao can Tu dong hoa?' : 'Why Automation?'],
      [language === 'vi' ? 
        'Nganh logistics Viet Nam dang doi mat voi nhieu thach thuc: chi phi van hanh cao, hieu suat thap, thieu minh bach trong quy trinh.' :
        'Vietnam logistics industry faces challenges: high operational costs, low efficiency, lack of process transparency.'
      ],
      [''],
      [language === 'vi' ? 'Cach thuc Thuc hien?' : 'How to Implement?'],
      [language === 'vi' ? 
        'Thuc hien theo 5 giai doan voi muc tieu ro rang va KPI cu the cho moi giai doan.' :
        'Implementation in 5 phases with clear objectives and specific KPIs for each phase.'
      ],
      [''],
      [language === 'vi' ? 'Giai phap Thay the?' : 'Alternative Solutions?'],
      [language === 'vi' ? 
        'Da xem xet cac lua chon khac nhung giai phap hien tai la toi uu nhat cho dieu kien Viet Nam.' :
        'Alternative options considered but current solution is optimal for Vietnam conditions.'
      ]
    ];

    const executiveSummarySheet = XLSX.utils.aoa_to_sheet(executiveSummaryData);
    XLSX.utils.book_append_sheet(workbook, executiveSummarySheet, language === 'vi' ? 'Tom tat' : 'Executive Summary');

    // Implementation Phases Sheet
    const phasesData = [
      [language === 'vi' ? 'Cac Giai doan Trien khai Chi tiet' : 'Detailed Implementation Phases'],
      [''],
      [
        language === 'vi' ? 'Giai doan' : 'Phase',
        language === 'vi' ? 'Ten' : 'Name',
        language === 'vi' ? 'Mo ta' : 'Description',
        language === 'vi' ? 'Thoi gian' : 'Duration',
        language === 'vi' ? 'Ngan sach' : 'Budget',
        language === 'vi' ? 'Trang thai' : 'Status',
        language === 'vi' ? 'Ngay bat dau' : 'Start Date',
        language === 'vi' ? 'Ngay ket thuc' : 'End Date'
      ]
    ];

    sampleAutomationPlan.phases.forEach((phase, index) => {
      phasesData.push([
        `${index + 1}`,
        language === 'vi' ? phase.nameVi : phase.name,
        language === 'vi' ? phase.descriptionVi : phase.description,
        phase.duration,
        `$${phase.budget.toLocaleString()}`,
        phase.status,
        phase.startDate,
        phase.endDate
      ]);
    });

    const phasesSheet = XLSX.utils.aoa_to_sheet(phasesData);
    XLSX.utils.book_append_sheet(workbook, phasesSheet, language === 'vi' ? 'Giai doan' : 'Phases');

    // Detailed Deliverables Sheet
    const deliverablesData = [
      [language === 'vi' ? 'San pham Ban giao Chi tiet' : 'Detailed Deliverables'],
      [''],
      [
        language === 'vi' ? 'Giai doan' : 'Phase',
        language === 'vi' ? 'San pham Ban giao' : 'Deliverable',
        language === 'vi' ? 'Mo ta' : 'Description'
      ]
    ];

    sampleAutomationPlan.phases.forEach((phase, index) => {
      const deliverables = language === 'vi' ? phase.deliverablesVi : phase.deliverables;
      deliverables.forEach((deliverable) => {
        deliverablesData.push([
          `${language === 'vi' ? 'Giai doan' : 'Phase'} ${index + 1}`,
          deliverable,
          language === 'vi' ? 'Chi tiet san pham ban giao' : 'Detailed deliverable description'
        ]);
      });
    });

    const deliverablesSheet = XLSX.utils.aoa_to_sheet(deliverablesData);
    XLSX.utils.book_append_sheet(workbook, deliverablesSheet, language === 'vi' ? 'San pham' : 'Deliverables');

    // Budget Breakdown Sheet
    const budgetData = [
      [language === 'vi' ? 'Phan bo Ngan sach Chi tiet' : 'Detailed Budget Breakdown'],
      [''],
      [language === 'vi' ? 'Hang muc' : 'Category', language === 'vi' ? 'So tien' : 'Amount', language === 'vi' ? 'Phan tram' : 'Percentage', language === 'vi' ? 'Mo ta' : 'Description']
    ];

    const budgetCategories = [
      { 
        name: language === 'vi' ? 'Phan mem va Cong nghe' : 'Software & Technology', 
        amount: 960000, 
        percentage: '40%',
        description: language === 'vi' ? 'Cac giai phap phan mem va cong nghe AI' : 'Software solutions and AI technology'
      },
      { 
        name: language === 'vi' ? 'Phan cung va Ha tang' : 'Hardware & Infrastructure', 
        amount: 720000, 
        percentage: '30%',
        description: language === 'vi' ? 'May chu, thiet bi mang va ha tang IT' : 'Servers, network equipment and IT infrastructure'
      },
      { 
        name: language === 'vi' ? 'Dao tao va Phat trien' : 'Training & Development', 
        amount: 480000, 
        percentage: '20%',
        description: language === 'vi' ? 'Dao tao nhan vien va phat trien ky nang' : 'Staff training and skill development'
      },
      { 
        name: language === 'vi' ? 'Quan ly Du an' : 'Project Management', 
        amount: 240000, 
        percentage: '10%',
        description: language === 'vi' ? 'Quan ly du an va tu van' : 'Project management and consulting'
      }
    ];

    budgetCategories.forEach(category => {
      budgetData.push([category.name, `$${category.amount.toLocaleString()}`, category.percentage, category.description]);
    });

    budgetData.push(['']);
    budgetData.push([language === 'vi' ? 'Tong cong' : 'Total', `$${overallMetrics.totalBudget.toLocaleString()}`, '100%', language === 'vi' ? 'Tong ngan sach du an' : 'Total project budget']);

    const budgetSheet = XLSX.utils.aoa_to_sheet(budgetData);
    XLSX.utils.book_append_sheet(workbook, budgetSheet, language === 'vi' ? 'Ngan sach' : 'Budget');

    // Risk Assessment Sheet
    const riskData = [
      [language === 'vi' ? 'Danh gia Rui ro Chi tiet' : 'Detailed Risk Assessment'],
      [''],
      [
        language === 'vi' ? 'Rui ro' : 'Risk',
        language === 'vi' ? 'Muc do' : 'Level',
        language === 'vi' ? 'Tac dong' : 'Impact',
        language === 'vi' ? 'Giai phap Giam thieu' : 'Mitigation Strategy',
        language === 'vi' ? 'Nguoi chiu trach nhiem' : 'Owner'
      ]
    ];

    const risks = [
      {
        risk: language === 'vi' ? 'Rui ro Ky thuat' : 'Technical Risk',
        level: language === 'vi' ? 'Trung binh' : 'Medium',
        impact: language === 'vi' ? 'Tre tien do du an' : 'Project schedule delay',
        mitigation: language === 'vi' ? 'Dao tao nhan vien va ho tro ky thuat chuyen nghiep' : 'Professional staff training and technical support',
        owner: language === 'vi' ? 'Truong phong Ky thuat' : 'Technical Manager'
      },
      {
        risk: language === 'vi' ? 'Rui ro Ngan sach' : 'Budget Risk',
        level: language === 'vi' ? 'Thap' : 'Low',
        impact: language === 'vi' ? 'Vuot ngan sach du an' : 'Project budget overrun',
        mitigation: language === 'vi' ? 'Quan ly ngan sach chat che va theo doi chi tiet' : 'Strict budget management and detailed monitoring',
        owner: language === 'vi' ? 'Quan ly Du an' : 'Project Manager'
      },
      {
        risk: language === 'vi' ? 'Rui ro Thoi gian' : 'Timeline Risk',
        level: language === 'vi' ? 'Trung binh' : 'Medium',
        impact: language === 'vi' ? 'Tre giao hang san pham' : 'Product delivery delay',
        mitigation: language === 'vi' ? 'Quan ly du an chuyen nghiep va theo doi tien do' : 'Professional project management and progress monitoring',
        owner: language === 'vi' ? 'Quan ly Du an' : 'Project Manager'
      },
      {
        risk: language === 'vi' ? 'Rui ro Thay doi Yeu cau' : 'Requirements Change Risk',
        level: language === 'vi' ? 'Cao' : 'High',
        impact: language === 'vi' ? 'Tang chi phi va thoi gian' : 'Increased cost and time',
        mitigation: language === 'vi' ? 'Xac dinh yeu cau ro rang va quy trinh thay doi' : 'Clear requirements definition and change process',
        owner: language === 'vi' ? 'Chu du an' : 'Project Owner'
      }
    ];

    risks.forEach(risk => {
      riskData.push([risk.risk, risk.level, risk.impact, risk.mitigation, risk.owner]);
    });

    const riskSheet = XLSX.utils.aoa_to_sheet(riskData);
    XLSX.utils.book_append_sheet(workbook, riskSheet, language === 'vi' ? 'Rui ro' : 'Risks');

    // Success Metrics Sheet
    const metricsData = [
      [language === 'vi' ? 'Chi so Thanh cong' : 'Success Metrics'],
      [''],
      [
        language === 'vi' ? 'Chi so' : 'Metric',
        language === 'vi' ? 'Hien tai' : 'Current',
        language === 'vi' ? 'Muc tieu' : 'Target',
        language === 'vi' ? 'Cai thien' : 'Improvement',
        language === 'vi' ? 'Thoi gian dat duoc' : 'Timeline'
      ],
      [
        language === 'vi' ? 'Chi phi van hanh' : 'Operational Cost',
        '$1,000,000',
        '$600,000',
        '40% reduction',
        language === 'vi' ? '12 thang' : '12 months'
      ],
      [
        language === 'vi' ? 'Hieu suat giao hang' : 'Delivery Efficiency',
        '70%',
        '95%',
        '25% improvement',
        language === 'vi' ? '18 thang' : '18 months'
      ],
      [
        language === 'vi' ? 'Su hai long khach hang' : 'Customer Satisfaction',
        '75%',
        '95%',
        '20% improvement',
        language === 'vi' ? '12 thang' : '12 months'
      ],
      [
        language === 'vi' ? 'Thoi gian xu ly don hang' : 'Order Processing Time',
        '4 hours',
        '30 minutes',
        '87.5% reduction',
        language === 'vi' ? '6 thang' : '6 months'
      ]
    ];

    const metricsSheet = XLSX.utils.aoa_to_sheet(metricsData);
    XLSX.utils.book_append_sheet(workbook, metricsSheet, language === 'vi' ? 'Chi so' : 'Metrics');

    // Save the Excel file
    const fileName = language === 'vi' 
      ? 'Ke-hoach-Tu-dong-hoa-Logistics-Toan-dien.xlsx'
      : 'Comprehensive-Logistics-Automation-Plan.xlsx';
    
    XLSX.writeFile(workbook, fileName);
    return true;

  } catch (error) {
    console.error('Excel Export Error:', error);
    throw new Error('Failed to generate Excel file. Please try again.');
  }
};
