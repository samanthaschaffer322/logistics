import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';
import { automationPlan, overallMetrics, businessImpact } from './automationPlan';

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

    // Add phase information (simplified for space)
    const phases = [
      { name: 'Phase 1: Foundation & Assessment', duration: '3 months', budget: 480000 },
      { name: 'Phase 2: Core System Implementation', duration: '4 months', budget: 720000 },
      { name: 'Phase 3: AI Integration & Optimization', duration: '3 months', budget: 600000 },
      { name: 'Phase 4: Advanced Analytics & Intelligence', duration: '4 months', budget: 480000 },
      { name: 'Phase 5: Full Automation & Scaling', duration: '4 months', budget: 120000 }
    ];

    phases.forEach((phase, index) => {
      checkNewPage(30);
      
      // Phase title
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      yPosition = addText(`${index + 1}. ${phase.name}`, margin, yPosition, { fontSize: 14, fontStyle: 'bold' });
      yPosition += 8;

      // Phase details
      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      yPosition = addText(`Duration: ${phase.duration}`, margin + 10, yPosition);
      yPosition += 5;
      yPosition = addText(`Budget: $${phase.budget.toLocaleString()}`, margin + 10, yPosition);
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
    yPosition = addText(`Expected ROI: ${overallMetrics.expectedROI}%`, margin, yPosition);
    yPosition += 8;
    yPosition = addText(`Payback Period: ${overallMetrics.paybackPeriod}`, margin, yPosition);
    yPosition += 15;

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
      [language === 'vi' ? 'ROI du kien' : 'Expected ROI', `${overallMetrics.expectedROI}%`],
      [language === 'vi' ? 'Thoi gian hoan von' : 'Payback Period', overallMetrics.paybackPeriod],
      [''],
      [language === 'vi' ? 'Loi ich Chinh' : 'Key Benefits'],
      [language === 'vi' ? 'Giam chi phi van hanh' : 'Operational Cost Reduction', '40%'],
      [language === 'vi' ? 'Tang hieu suat giao hang' : 'Delivery Efficiency Improvement', '60%'],
      [language === 'vi' ? 'Giam khoang cach tuyen duong' : 'Route Distance Reduction', '25%'],
      [language === 'vi' ? 'Su hai long khach hang' : 'Customer Satisfaction', '95%'],
      [language === 'vi' ? 'Tu dong hoa quy trinh' : 'Process Automation', '80%']
    ];

    const executiveSummarySheet = XLSX.utils.aoa_to_sheet(executiveSummaryData);
    XLSX.utils.book_append_sheet(workbook, executiveSummarySheet, language === 'vi' ? 'Tom tat' : 'Executive Summary');

    // Implementation Phases Sheet
    const phasesData = [
      [language === 'vi' ? 'Cac Giai doan Trien khai' : 'Implementation Phases'],
      [''],
      [
        language === 'vi' ? 'Giai doan' : 'Phase',
        language === 'vi' ? 'Ten' : 'Name',
        language === 'vi' ? 'Thoi gian' : 'Duration',
        language === 'vi' ? 'Ngan sach' : 'Budget',
        language === 'vi' ? 'Trang thai' : 'Status'
      ],
      ['1', 'Foundation & Assessment', '3 months', '$480,000', 'Planned'],
      ['2', 'Core System Implementation', '4 months', '$720,000', 'Planned'],
      ['3', 'AI Integration & Optimization', '3 months', '$600,000', 'Planned'],
      ['4', 'Advanced Analytics & Intelligence', '4 months', '$480,000', 'Planned'],
      ['5', 'Full Automation & Scaling', '4 months', '$120,000', 'Planned']
    ];

    const phasesSheet = XLSX.utils.aoa_to_sheet(phasesData);
    XLSX.utils.book_append_sheet(workbook, phasesSheet, language === 'vi' ? 'Giai doan' : 'Phases');

    // Budget Breakdown Sheet
    const budgetData = [
      [language === 'vi' ? 'Phan bo Ngan sach Chi tiet' : 'Detailed Budget Breakdown'],
      [''],
      [language === 'vi' ? 'Hang muc' : 'Category', language === 'vi' ? 'So tien' : 'Amount', language === 'vi' ? 'Phan tram' : 'Percentage']
    ];

    const budgetCategories = [
      { name: language === 'vi' ? 'Phan mem va Cong nghe' : 'Software & Technology', amount: 960000, percentage: '40%' },
      { name: language === 'vi' ? 'Phan cung va Ha tang' : 'Hardware & Infrastructure', amount: 720000, percentage: '30%' },
      { name: language === 'vi' ? 'Dao tao va Phat trien' : 'Training & Development', amount: 480000, percentage: '20%' },
      { name: language === 'vi' ? 'Quan ly Du an' : 'Project Management', amount: 240000, percentage: '10%' }
    ];

    budgetCategories.forEach(category => {
      budgetData.push([category.name, `$${category.amount.toLocaleString()}`, category.percentage]);
    });

    budgetData.push(['']);
    budgetData.push([language === 'vi' ? 'Tong cong' : 'Total', `$${overallMetrics.totalBudget.toLocaleString()}`, '100%']);

    const budgetSheet = XLSX.utils.aoa_to_sheet(budgetData);
    XLSX.utils.book_append_sheet(workbook, budgetSheet, language === 'vi' ? 'Ngan sach' : 'Budget');

    // Risk Assessment Sheet
    const riskData = [
      [language === 'vi' ? 'Danh gia Rui ro' : 'Risk Assessment'],
      [''],
      [
        language === 'vi' ? 'Rui ro' : 'Risk',
        language === 'vi' ? 'Muc do' : 'Level',
        language === 'vi' ? 'Tac dong' : 'Impact',
        language === 'vi' ? 'Giai phap Giam thieu' : 'Mitigation Strategy'
      ]
    ];

    const risks = [
      {
        risk: language === 'vi' ? 'Rui ro Ky thuat' : 'Technical Risk',
        level: language === 'vi' ? 'Trung binh' : 'Medium',
        impact: language === 'vi' ? 'Tre tien do' : 'Schedule Delay',
        mitigation: language === 'vi' ? 'Dao tao nhan vien va ho tro ky thuat' : 'Staff training and technical support'
      },
      {
        risk: language === 'vi' ? 'Rui ro Ngan sach' : 'Budget Risk',
        level: language === 'vi' ? 'Thap' : 'Low',
        impact: language === 'vi' ? 'Vuot ngan sach' : 'Budget Overrun',
        mitigation: language === 'vi' ? 'Quan ly ngan sach chat che' : 'Strict budget management'
      },
      {
        risk: language === 'vi' ? 'Rui ro Thoi gian' : 'Timeline Risk',
        level: language === 'vi' ? 'Trung binh' : 'Medium',
        impact: language === 'vi' ? 'Tre giao hang' : 'Delivery Delay',
        mitigation: language === 'vi' ? 'Quan ly du an chuyen nghiep' : 'Professional project management'
      }
    ];

    risks.forEach(risk => {
      riskData.push([risk.risk, risk.level, risk.impact, risk.mitigation]);
    });

    const riskSheet = XLSX.utils.aoa_to_sheet(riskData);
    XLSX.utils.book_append_sheet(workbook, riskSheet, language === 'vi' ? 'Rui ro' : 'Risks');

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
