// Professional Excel and PDF File Generator
import SmartExcelAnalyzer from './smartExcelAnalyzer';

export class FileGenerator {
  
  static async generateExcelFile(plan: any): Promise<void> {
    try {
      // Dynamic import for client-side compatibility
      const ExcelJS = await import('exceljs');
      
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('KẾ HOẠCH THỨC ĂN CHĂN NUÔI');
      
      const excelData = SmartExcelAnalyzer.generateExcelData(plan);
      
      // Add company header with styling
      worksheet.mergeCells('A1:L1');
      const titleCell = worksheet.getCell('A1');
      titleCell.value = excelData.companyInfo.name;
      titleCell.font = { size: 16, bold: true, color: { argb: 'FF0066CC' } };
      titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
      
      // Add address
      worksheet.mergeCells('A2:L2');
      const addressCell = worksheet.getCell('A2');
      addressCell.value = excelData.companyInfo.address;
      addressCell.font = { size: 12, italic: true };
      addressCell.alignment = { horizontal: 'center' };
      
      // Add tax code
      worksheet.mergeCells('A3:L3');
      const taxCell = worksheet.getCell('A3');
      taxCell.value = `${excelData.companyInfo.taxCode} | ${excelData.companyInfo.phone}`;
      taxCell.font = { size: 10 };
      taxCell.alignment = { horizontal: 'center' };
      
      // Add plan data
      let currentRow = 5;
      excelData.planData.forEach((row, index) => {
        if (index < 4) return; // Skip header rows (already added above)
        
        row.forEach((cell, colIndex) => {
          const excelCell = worksheet.getCell(currentRow, colIndex + 1);
          excelCell.value = cell;
          
          // Style headers
          if (typeof cell === 'string' && (
            cell.includes('KẾ HOẠCH') || 
            cell.includes('TỔNG QUAN') || 
            cell.includes('CHI TIẾT') ||
            cell.includes('KHUYẾN NGHỊ') ||
            cell.includes('GHI CHÚ')
          )) {
            excelCell.font = { bold: true, size: 12, color: { argb: 'FF0066CC' } };
          }
          
          // Style table headers
          if (cell === 'STT' || cell === 'ĐIỂM ĐI' || cell === 'ĐIỂM ĐẾN') {
            excelCell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
            excelCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0066CC' } };
            excelCell.alignment = { horizontal: 'center', vertical: 'middle' };
          }
        });
        currentRow++;
      });
      
      // Auto-fit columns
      worksheet.columns.forEach(column => {
        column.width = 15;
      });
      
      // Generate buffer and download
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], { 
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
      });
      
      this.downloadFile(blob, `${plan.title.replace(/[^a-z0-9]/gi, '_')}.xlsx`);
      
    } catch (error) {
      console.error('Excel generation error:', error);
      // Fallback to CSV
      this.generateCSVFile(plan);
    }
  }
  
  static generateCSVFile(plan: any): void {
    const excelData = SmartExcelAnalyzer.generateExcelData(plan);
    
    const csvContent = [
      // Company header
      [excelData.companyInfo.name],
      [excelData.companyInfo.address],
      [`${excelData.companyInfo.taxCode} | ${excelData.companyInfo.phone}`],
      [''],
      ...excelData.planData.slice(4) // Skip first 4 rows (already added above)
    ].map(row => 
      row.map(cell => `"${cell}"`).join(',')
    ).join('\n');
    
    const blob = new Blob(['\uFEFF' + csvContent], { 
      type: 'text/csv;charset=utf-8;' 
    });
    
    this.downloadFile(blob, `${plan.title.replace(/[^a-z0-9]/gi, '_')}.csv`);
  }
  
  static generatePDFFile(plan: any): void {
    const pdfContent = SmartExcelAnalyzer.generatePDFContent(plan);
    
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>${pdfContent.title}</title>
        <style>
          @page { 
            size: A4; 
            margin: 20mm; 
          }
          body { 
            font-family: 'Times New Roman', serif; 
            margin: 0; 
            padding: 0;
            line-height: 1.4;
            color: #333;
            font-size: 12px;
          }
          .header { 
            text-align: center; 
            margin-bottom: 30px; 
            border-bottom: 3px solid #0066CC;
            padding-bottom: 20px;
          }
          .company-name { 
            font-size: 18px; 
            font-weight: bold; 
            margin-bottom: 8px;
            color: #0066CC;
            text-transform: uppercase;
          }
          .company-info { 
            font-size: 11px; 
            color: #666;
            margin: 5px 0;
          }
          .plan-title { 
            font-size: 16px; 
            font-weight: bold; 
            margin: 15px 0 10px 0;
            text-transform: uppercase;
            color: #0066CC;
          }
          .plan-meta {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin: 15px 0;
            font-size: 11px;
          }
          .summary { 
            background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); 
            padding: 20px; 
            margin: 20px 0; 
            border-left: 5px solid #0066CC;
            border-radius: 5px;
          }
          .summary h3 {
            margin-top: 0;
            color: #0066CC;
            font-size: 14px;
          }
          .summary-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
            margin-top: 15px;
          }
          .summary-item {
            background: white;
            padding: 10px;
            border-radius: 5px;
            border: 1px solid #dee2e6;
          }
          .summary-label {
            font-weight: bold;
            color: #495057;
            font-size: 11px;
          }
          .summary-value {
            font-size: 14px;
            font-weight: bold;
            color: #0066CC;
            margin-top: 5px;
          }
          table { 
            width: 100%; 
            border-collapse: collapse; 
            margin: 20px 0; 
            font-size: 10px;
            background: white;
          }
          th, td { 
            border: 1px solid #dee2e6; 
            padding: 8px 6px; 
            text-align: left; 
            vertical-align: top;
          }
          th { 
            background: linear-gradient(135deg, #0066CC 0%, #004499 100%); 
            color: white; 
            font-weight: bold;
            text-align: center;
            font-size: 9px;
          }
          tr:nth-child(even) {
            background-color: #f8f9fa;
          }
          tr:hover {
            background-color: #e3f2fd;
          }
          .route-from {
            font-weight: bold;
            color: #0066CC;
          }
          .route-to {
            font-weight: bold;
            color: #28a745;
          }
          .cost {
            text-align: right;
            font-weight: bold;
            color: #dc3545;
          }
          .insights { 
            margin-top: 25px; 
            background: linear-gradient(135deg, #e8f5e8 0%, #f0f8f0 100%);
            padding: 20px;
            border-radius: 8px;
            border-left: 5px solid #28a745;
          }
          .insights h3 {
            color: #28a745;
            margin-top: 0;
            font-size: 14px;
          }
          .insights ol li { 
            margin: 10px 0; 
            line-height: 1.6;
            font-size: 11px;
          }
          .notes {
            margin-top: 25px;
            background: linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%);
            padding: 20px;
            border-radius: 8px;
            border-left: 5px solid #ffc107;
          }
          .notes h4 {
            color: #856404;
            margin-top: 0;
            font-size: 14px;
          }
          .notes ol li {
            margin: 8px 0;
            font-size: 11px;
            line-height: 1.5;
          }
          .signatures {
            margin-top: 40px;
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            gap: 30px;
            text-align: center;
          }
          .signature-box {
            border: 1px solid #dee2e6;
            padding: 15px;
            border-radius: 5px;
            background: #f8f9fa;
          }
          .signature-title {
            font-weight: bold;
            margin-bottom: 40px;
            font-size: 11px;
          }
          .signature-line {
            border-top: 1px solid #333;
            margin-top: 40px;
            padding-top: 5px;
            font-size: 10px;
            font-style: italic;
          }
          .footer {
            margin-top: 40px;
            text-align: center;
            font-size: 10px;
            color: #666;
            border-top: 1px solid #dee2e6;
            padding-top: 15px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="company-name">${pdfContent.company.name}</div>
          <div class="company-info">${pdfContent.company.address}</div>
          <div class="company-info">${pdfContent.company.taxCode} | ${pdfContent.company.phone}</div>
          <div class="plan-title">KẾ HOẠCH PHÂN PHỐI THỨC ĂN CHĂN NUÔI</div>
          <div class="plan-meta">
            <div><strong>📅 Ngày lập:</strong> ${pdfContent.date}</div>
            <div><strong>🕐 Giờ lập:</strong> ${pdfContent.time}</div>
            <div><strong>👤 Người lập:</strong> Hệ thống AI LogiAI</div>
            <div><strong>✅ Trạng thái:</strong> Chờ phê duyệt</div>
          </div>
        </div>
        
        <div class="summary">
          <h3>📊 TỔNG QUAN KẾ HOẠCH</h3>
          <div class="summary-grid">
            <div class="summary-item">
              <div class="summary-label">🚛 Tổng số tuyến đường</div>
              <div class="summary-value">${pdfContent.summary.totalRoutes} tuyến</div>
            </div>
            <div class="summary-item">
              <div class="summary-label">💰 Tổng chi phí dự kiến</div>
              <div class="summary-value">${pdfContent.totalCost}</div>
            </div>
            <div class="summary-item">
              <div class="summary-label">⚡ Hiệu suất dự kiến</div>
              <div class="summary-value">${pdfContent.summary.efficiency}%</div>
            </div>
            <div class="summary-item">
              <div class="summary-label">⏱️ Thời gian thực hiện</div>
              <div class="summary-value">${pdfContent.summary.estimatedTime}</div>
            </div>
          </div>
        </div>
        
        <h3 style="color: #0066CC; margin-top: 30px;">🚚 CHI TIẾT TUYẾN ĐƯỜNG PHÂN PHỐI</h3>
        <table>
          <thead>
            <tr>
              <th>STT</th>
              <th>ĐIỂM ĐI</th>
              <th>ĐIỂM ĐẾN</th>
              <th>LOẠI XE</th>
              <th>GIỜ GIAO</th>
              <th>CHI PHÍ (VNĐ)</th>
              <th>KM</th>
              <th>LOẠI THỨC ĂN</th>
              <th>KHÁCH HÀNG</th>
              <th>CONTAINER</th>
              <th>GHI CHÚ NGHIỆP VỤ</th>
            </tr>
          </thead>
          <tbody>
            ${pdfContent.routes.map((route: any, index: number) => `
              <tr>
                <td style="text-align: center; font-weight: bold;">${index + 1}</td>
                <td class="route-from">${route.from}</td>
                <td class="route-to">${route.to}</td>
                <td>${route.vehicle}</td>
                <td style="text-align: center; font-weight: bold;">${route.time}</td>
                <td class="cost">${new Intl.NumberFormat('vi-VN').format(route.cost)}</td>
                <td style="text-align: center;">${route.distance}</td>
                <td><strong>${route.feedType || 'Thức ăn chăn nuôi'}</strong></td>
                <td><em>${route.customer || 'Khách hàng'}</em></td>
                <td style="text-align: center;">${route.containerType || '20ft'}</td>
                <td style="font-size: 9px;"><em>${route.logic}</em></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        
        <div class="insights">
          <h3>🤖 KHUYẾN NGHỊ CỦA HỆ THỐNG AI</h3>
          <ol>
            ${pdfContent.insights.map((insight: string) => `<li>${insight}</li>`).join('')}
          </ol>
        </div>
        
        <div class="notes">
          <h4>📋 GHI CHÚ QUAN TRỌNG</h4>
          <ol>
            <li>Kiểm tra chất lượng thức ăn trước khi giao hàng</li>
            <li>Liên hệ khách hàng trước 30 phút khi đến điểm giao hàng</li>
            <li>Sử dụng xe chuyên dụng thức ăn chăn nuôi, không chở hàng hóa khác</li>
            <li>Báo cáo tình hình giao hàng về văn phòng sau khi hoàn thành</li>
            <li>Đảm bảo thời gian giao hàng theo yêu cầu của khách hàng</li>
          </ol>
        </div>
        
        <div class="signatures">
          <div class="signature-box">
            <div class="signature-title">Người lập kế hoạch</div>
            <div class="signature-line">(Ký, ghi rõ họ tên)</div>
          </div>
          <div class="signature-box">
            <div class="signature-title">Người phê duyệt</div>
            <div class="signature-line">(Ký, ghi rõ họ tên)</div>
          </div>
          <div class="signature-box">
            <div class="signature-title">Giám đốc điều hành</div>
            <div class="signature-line">(Ký, ghi rõ họ tên)</div>
          </div>
        </div>
        
        <div class="footer">
          <p><strong>Kế hoạch được tạo bởi Hệ thống AI LogiAI</strong></p>
          <p>Công ty Cổ phần Commodities Express - Chuyên phân phối thức ăn chăn nuôi</p>
          <p>📞 Hotline: (028) 3775 4567 | 📧 Email: info@commoditiesexpress.vn</p>
        </div>
      </body>
      </html>
    `;
    
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    this.downloadFile(blob, `${plan.title.replace(/[^a-z0-9]/gi, '_')}.html`);
  }
  
  private static downloadFile(blob: Blob, filename: string): void {
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}

export default FileGenerator;
