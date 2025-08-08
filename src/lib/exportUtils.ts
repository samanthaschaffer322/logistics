import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';
import { automationPlan, overallMetrics, businessImpact, AutomationPhase } from './automationPlan';

// PDF Export Utility
export const exportToPDF = (language: 'en' | 'vi' = 'vi') => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  let yPosition = 20;

  // Helper function to add text with word wrap
  const addText = (text: string, x: number, y: number, maxWidth: number, fontSize: number = 12) => {
    doc.setFontSize(fontSize);
    const lines = doc.splitTextToSize(text, maxWidth);
    doc.text(lines, x, y);
    return y + (lines.length * fontSize * 0.4);
  };

  // Helper function to check if we need a new page
  const checkNewPage = (requiredSpace: number) => {
    if (yPosition + requiredSpace > pageHeight - 20) {
      doc.addPage();
      yPosition = 20;
    }
  };

  try {
    // Title
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    const title = language === 'vi' 
      ? 'Kế hoạch Tự động hóa Logistics Toàn diện'
      : 'Comprehensive Logistics Automation Plan';
    doc.text(title, pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 15;

    // Subtitle
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    const subtitle = language === 'vi'
      ? 'Lộ trình chiến lược cho việc số hóa hoàn toàn logistics và tích hợp AI'
      : 'Strategic roadmap for complete logistics digitization and AI integration';
    yPosition = addText(subtitle, pageWidth / 2 - 80, yPosition, 160);
    yPosition += 10;

    // Executive Summary
    checkNewPage(40);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    const summaryTitle = language === 'vi' ? 'Tóm tắt Điều hành' : 'Executive Summary';
    doc.text(summaryTitle, 20, yPosition);
    yPosition += 10;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    
    // Overall Metrics
    const metricsText = language === 'vi' 
      ? `Tổng ngân sách: $${overallMetrics.totalBudget.toLocaleString()}
Thời gian thực hiện: ${overallMetrics.totalDuration}
ROI dự kiến: ${overallMetrics.expectedROI}
Thời gian hoàn vốn: ${overallMetrics.paybackPeriod}
Mức độ rủi ro: ${overallMetrics.riskLevel}
Tiến độ tổng thể: ${overallMetrics.overallProgress}%`
      : `Total Budget: $${overallMetrics.totalBudget.toLocaleString()}
Implementation Duration: ${overallMetrics.totalDuration}
Expected ROI: ${overallMetrics.expectedROI}
Payback Period: ${overallMetrics.paybackPeriod}
Risk Level: ${overallMetrics.riskLevel}
Overall Progress: ${overallMetrics.overallProgress}%`;

    yPosition = addText(metricsText, 20, yPosition, pageWidth - 40, 10);
    yPosition += 15;

    // Business Impact
    checkNewPage(60);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    const impactTitle = language === 'vi' ? 'Tác động Kinh doanh' : 'Business Impact';
    doc.text(impactTitle, 20, yPosition);
    yPosition += 10;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    
    const impactText = language === 'vi'
      ? `Giảm chi phí: Mục tiêu ${businessImpact.costReduction.target}, Hiện tại ${businessImpact.costReduction.current}
Tăng hiệu quả: Mục tiêu ${businessImpact.efficiencyGains.target}, Hiện tại ${businessImpact.efficiencyGains.current}
Hài lòng khách hàng: Mục tiêu ${businessImpact.customerSatisfaction.target}, Hiện tại ${businessImpact.customerSatisfaction.current}`
      : `Cost Reduction: Target ${businessImpact.costReduction.target}, Current ${businessImpact.costReduction.current}
Efficiency Gains: Target ${businessImpact.efficiencyGains.target}, Current ${businessImpact.efficiencyGains.current}
Customer Satisfaction: Target ${businessImpact.customerSatisfaction.target}, Current ${businessImpact.customerSatisfaction.current}`;

    yPosition = addText(impactText, 20, yPosition, pageWidth - 40, 10);
    yPosition += 15;

    // Phases
    automationPlan.forEach((phase, index) => {
      checkNewPage(80);
      
      // Phase Title
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      const phaseTitle = language === 'vi' ? phase.nameVi : phase.name;
      doc.text(`${language === 'vi' ? 'Giai đoạn' : 'Phase'} ${index + 1}: ${phaseTitle}`, 20, yPosition);
      yPosition += 8;

      // Phase Details
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      
      const phaseDetails = language === 'vi'
        ? `Mô tả: ${phase.descriptionVi}
Thời gian: ${phase.duration}
Ngân sách: $${phase.budget.toLocaleString()}
Trạng thái: ${phase.status}
Tiến độ: ${phase.progress}%
Ngày bắt đầu: ${phase.startDate}
Ngày kết thúc: ${phase.endDate}`
        : `Description: ${phase.description}
Duration: ${phase.duration}
Budget: $${phase.budget.toLocaleString()}
Status: ${phase.status}
Progress: ${phase.progress}%
Start Date: ${phase.startDate}
End Date: ${phase.endDate}`;

      yPosition = addText(phaseDetails, 20, yPosition, pageWidth - 40, 9);
      yPosition += 5;

      // Deliverables
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      const deliverablesTitle = language === 'vi' ? 'Sản phẩm bàn giao:' : 'Deliverables:';
      doc.text(deliverablesTitle, 20, yPosition);
      yPosition += 5;

      doc.setFont('helvetica', 'normal');
      const deliverables = language === 'vi' ? phase.deliverablesVi : phase.deliverables;
      deliverables.forEach((deliverable, idx) => {
        checkNewPage(10);
        yPosition = addText(`• ${deliverable}`, 25, yPosition, pageWidth - 50, 9);
      });
      yPosition += 5;

      // Risks
      if (phase.risks.length > 0) {
        checkNewPage(30);
        doc.setFont('helvetica', 'bold');
        const risksTitle = language === 'vi' ? 'Rủi ro:' : 'Risks:';
        doc.text(risksTitle, 20, yPosition);
        yPosition += 5;

        doc.setFont('helvetica', 'normal');
        phase.risks.forEach((risk) => {
          checkNewPage(15);
          const riskText = language === 'vi'
            ? `• ${risk.descriptionVi} (Xác suất: ${risk.probability}, Tác động: ${risk.impact})`
            : `• ${risk.description} (Probability: ${risk.probability}, Impact: ${risk.impact})`;
          yPosition = addText(riskText, 25, yPosition, pageWidth - 50, 9);
        });
        yPosition += 5;
      }

      yPosition += 10;
    });

    // Footer
    const totalPages = doc.internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.text(`${language === 'vi' ? 'Trang' : 'Page'} ${i} ${language === 'vi' ? 'của' : 'of'} ${totalPages}`, pageWidth - 30, pageHeight - 10);
      doc.text(`${language === 'vi' ? 'Tạo ngày' : 'Generated on'}: ${new Date().toLocaleDateString()}`, 20, pageHeight - 10);
    }

    // Save the PDF
    const fileName = language === 'vi' 
      ? 'Ke_Hoach_Tu_Dong_Hoa_Logistics.pdf'
      : 'Logistics_Automation_Plan.pdf';
    doc.save(fileName);

    return true;
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Failed to generate PDF');
  }
};

// Excel Export Utility
export const exportToExcel = (language: 'en' | 'vi' = 'vi') => {
  try {
    const workbook = XLSX.utils.book_new();

    // Overview Sheet
    const overviewData = [
      [language === 'vi' ? 'Tổng quan Dự án' : 'Project Overview'],
      [],
      [language === 'vi' ? 'Chỉ số' : 'Metric', language === 'vi' ? 'Giá trị' : 'Value'],
      [language === 'vi' ? 'Tổng ngân sách' : 'Total Budget', `$${overallMetrics.totalBudget.toLocaleString()}`],
      [language === 'vi' ? 'Thời gian thực hiện' : 'Implementation Duration', overallMetrics.totalDuration],
      [language === 'vi' ? 'ROI dự kiến' : 'Expected ROI', overallMetrics.expectedROI],
      [language === 'vi' ? 'Thời gian hoàn vốn' : 'Payback Period', overallMetrics.paybackPeriod],
      [language === 'vi' ? 'Mức độ rủi ro' : 'Risk Level', overallMetrics.riskLevel],
      [language === 'vi' ? 'Tiến độ tổng thể' : 'Overall Progress', `${overallMetrics.overallProgress}%`],
      [],
      [language === 'vi' ? 'Tác động Kinh doanh' : 'Business Impact'],
      [],
      [language === 'vi' ? 'Giảm chi phí' : 'Cost Reduction', `${language === 'vi' ? 'Mục tiêu' : 'Target'}: ${businessImpact.costReduction.target}, ${language === 'vi' ? 'Hiện tại' : 'Current'}: ${businessImpact.costReduction.current}`],
      [language === 'vi' ? 'Tăng hiệu quả' : 'Efficiency Gains', `${language === 'vi' ? 'Mục tiêu' : 'Target'}: ${businessImpact.efficiencyGains.target}, ${language === 'vi' ? 'Hiện tại' : 'Current'}: ${businessImpact.efficiencyGains.current}`],
      [language === 'vi' ? 'Hài lòng khách hàng' : 'Customer Satisfaction', `${language === 'vi' ? 'Mục tiêu' : 'Target'}: ${businessImpact.customerSatisfaction.target}, ${language === 'vi' ? 'Hiện tại' : 'Current'}: ${businessImpact.customerSatisfaction.current}`]
    ];

    const overviewSheet = XLSX.utils.aoa_to_sheet(overviewData);
    XLSX.utils.book_append_sheet(workbook, overviewSheet, language === 'vi' ? 'Tổng quan' : 'Overview');

    // Phases Sheet
    const phasesHeaders = language === 'vi' 
      ? ['Giai đoạn', 'Tên', 'Mô tả', 'Thời gian', 'Ngân sách', 'Trạng thái', 'Tiến độ (%)', 'Ngày bắt đầu', 'Ngày kết thúc']
      : ['Phase', 'Name', 'Description', 'Duration', 'Budget', 'Status', 'Progress (%)', 'Start Date', 'End Date'];

    const phasesData = [phasesHeaders];
    
    automationPlan.forEach((phase, index) => {
      phasesData.push([
        `${language === 'vi' ? 'Giai đoạn' : 'Phase'} ${index + 1}`,
        language === 'vi' ? phase.nameVi : phase.name,
        language === 'vi' ? phase.descriptionVi : phase.description,
        phase.duration,
        phase.budget,
        phase.status,
        phase.progress,
        phase.startDate,
        phase.endDate
      ]);
    });

    const phasesSheet = XLSX.utils.aoa_to_sheet(phasesData);
    XLSX.utils.book_append_sheet(workbook, phasesSheet, language === 'vi' ? 'Giai đoạn' : 'Phases');

    // Deliverables Sheet
    const deliverablesHeaders = language === 'vi'
      ? ['Giai đoạn', 'Sản phẩm bàn giao']
      : ['Phase', 'Deliverable'];

    const deliverablesData = [deliverablesHeaders];
    
    automationPlan.forEach((phase, index) => {
      const deliverables = language === 'vi' ? phase.deliverablesVi : phase.deliverables;
      deliverables.forEach((deliverable) => {
        deliverablesData.push([
          `${language === 'vi' ? 'Giai đoạn' : 'Phase'} ${index + 1}`,
          deliverable
        ]);
      });
    });

    const deliverablesSheet = XLSX.utils.aoa_to_sheet(deliverablesData);
    XLSX.utils.book_append_sheet(workbook, deliverablesSheet, language === 'vi' ? 'Sản phẩm' : 'Deliverables');

    // Risks Sheet
    const risksHeaders = language === 'vi'
      ? ['Giai đoạn', 'Rủi ro', 'Xác suất', 'Tác động', 'Biện pháp giảm thiểu', 'Người chịu trách nhiệm']
      : ['Phase', 'Risk', 'Probability', 'Impact', 'Mitigation', 'Owner'];

    const risksData = [risksHeaders];
    
    automationPlan.forEach((phase, index) => {
      phase.risks.forEach((risk) => {
        risksData.push([
          `${language === 'vi' ? 'Giai đoạn' : 'Phase'} ${index + 1}`,
          language === 'vi' ? risk.descriptionVi : risk.description,
          risk.probability,
          risk.impact,
          language === 'vi' ? risk.mitigationVi : risk.mitigation,
          risk.owner
        ]);
      });
    });

    const risksSheet = XLSX.utils.aoa_to_sheet(risksData);
    XLSX.utils.book_append_sheet(workbook, risksSheet, language === 'vi' ? 'Rủi ro' : 'Risks');

    // Resources Sheet
    const resourcesHeaders = language === 'vi'
      ? ['Giai đoạn', 'Tài nguyên', 'Loại', 'Phân bổ', 'Chi phí']
      : ['Phase', 'Resource', 'Type', 'Allocation', 'Cost'];

    const resourcesData = [resourcesHeaders];
    
    automationPlan.forEach((phase, index) => {
      phase.resources.forEach((resource) => {
        resourcesData.push([
          `${language === 'vi' ? 'Giai đoạn' : 'Phase'} ${index + 1}`,
          resource.name,
          resource.type,
          resource.allocation,
          resource.cost
        ]);
      });
    });

    const resourcesSheet = XLSX.utils.aoa_to_sheet(resourcesData);
    XLSX.utils.book_append_sheet(workbook, resourcesSheet, language === 'vi' ? 'Tài nguyên' : 'Resources');

    // KPIs Sheet
    const kpisHeaders = language === 'vi'
      ? ['Giai đoạn', 'KPI', 'Mục tiêu', 'Hiện tại', 'Đơn vị', 'Xu hướng']
      : ['Phase', 'KPI', 'Target', 'Current', 'Unit', 'Trend'];

    const kpisData = [kpisHeaders];
    
    automationPlan.forEach((phase, index) => {
      phase.kpis.forEach((kpi) => {
        kpisData.push([
          `${language === 'vi' ? 'Giai đoạn' : 'Phase'} ${index + 1}`,
          language === 'vi' ? kpi.nameVi : kpi.name,
          kpi.target,
          kpi.current,
          kpi.unit,
          kpi.trend
        ]);
      });
    });

    const kpisSheet = XLSX.utils.aoa_to_sheet(kpisData);
    XLSX.utils.book_append_sheet(workbook, kpisSheet, 'KPIs');

    // Save the Excel file
    const fileName = language === 'vi' 
      ? 'Ke_Hoach_Tu_Dong_Hoa_Logistics.xlsx'
      : 'Logistics_Automation_Plan.xlsx';
    
    XLSX.writeFile(workbook, fileName);

    return true;
  } catch (error) {
    console.error('Error generating Excel:', error);
    throw new Error('Failed to generate Excel file');
  }
};
