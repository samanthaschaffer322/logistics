// Professional Excel and PDF File Generator
export class FileGenerator {
  
  static async generateExcelFile(plan: any): Promise<void> {
    try {
      // Dynamic import for client-side compatibility
      const ExcelJS = await import('exceljs');
      
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('KẾ HOẠCH LOGISTICS');
      
      // Company Header
      worksheet.mergeCells('A1:J1');
      const titleCell = worksheet.getCell('A1');
      titleCell.value = 'CÔNG TY CỔ PHẦN COMMODITIES EXPRESS';
      titleCell.font = { size: 16, bold: true, color: { argb: 'FF0066CC' } };
      titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
      
      worksheet.mergeCells('A2:J2');
      const addressCell = worksheet.getCell('A2');
      addressCell.value = 'Số 03 Nguyễn Lương Bằng, Phường Tân Phú, Quận 7, TP.HCM';
      addressCell.font = { size: 12 };
      addressCell.alignment = { horizontal: 'center' };
      
      worksheet.mergeCells('A3:J3');
      const planTitleCell = worksheet.getCell('A3');
      planTitleCell.value = plan.title;
      planTitleCell.font = { size: 14, bold: true };
      planTitleCell.alignment = { horizontal: 'center' };
      
      // Summary Section
      let row = 5;
      worksheet.getCell(`A${row}`).value = 'TỔNG QUAN KẾ HOẠCH';
      worksheet.getCell(`A${row}`).font = { bold: true, size: 12 };
      row++;
      
      worksheet.getCell(`A${row}`).value = 'Tổng số tuyến:';
      worksheet.getCell(`B${row}`).value = plan.summary.totalRoutes;
      row++;
      
      worksheet.getCell(`A${row}`).value = 'Tổng chi phí:';
      worksheet.getCell(`B${row}`).value = new Intl.NumberFormat('vi-VN').format(plan.summary.totalCost) + ' VNĐ';
      row++;
      
      worksheet.getCell(`A${row}`).value = 'Hiệu suất:';
      worksheet.getCell(`B${row}`).value = plan.summary.efficiency + '%';
      row += 2;
      
      // Routes Header
      worksheet.getCell(`A${row}`).value = 'CHI TIẾT TUYẾN ĐƯỜNG';
      worksheet.getCell(`A${row}`).font = { bold: true, size: 12 };
      row++;
      
      // Table Headers
      const headers = ['STT', 'ĐIỂM ĐI', 'ĐIỂM ĐẾN', 'LOẠI XE', 'GIỜ GIAO', 'CHI PHÍ (VNĐ)', 'KM', 'LOẠI THỨC ĂN', 'KHÁCH HÀNG', 'GHI CHÚ'];
      headers.forEach((header, index) => {
        const cell = worksheet.getCell(row, index + 1);
        cell.value = header;
        cell.font = { bold: true };
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE6F3FF' } };
        cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
      });
      row++;
      
      // Routes Data
      plan.routes.forEach((route: any, index: number) => {
        const rowData = [
          index + 1,
          route.from,
          route.to,
          route.vehicle,
          route.time,
          new Intl.NumberFormat('vi-VN').format(route.cost),
          route.distance + ' km',
          route.feedType || 'Thức ăn chăn nuôi',
          route.customer || 'Khách hàng',
          route.logic || 'Tuyến logistics'
        ];
        
        rowData.forEach((data, colIndex) => {
          const cell = worksheet.getCell(row, colIndex + 1);
          cell.value = data;
          cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        });
        row++;
      });
      
      // Recommendations
      row += 2;
      worksheet.getCell(`A${row}`).value = 'KHUYẾN NGHỊ CỦA HỆ THỐNG AI';
      worksheet.getCell(`A${row}`).font = { bold: true, size: 12 };
      row++;
      
      plan.insights.forEach((insight: string, index: number) => {
        worksheet.getCell(`A${row}`).value = `${index + 1}. ${insight}`;
        row++;
      });
      
      // Auto-fit columns
      worksheet.columns.forEach(column => {
        column.width = 15;
      });
      
      // Generate Excel file
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], { 
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
      });
      
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `${plan.title.replace(/[^a-z0-9]/gi, '_')}.xlsx`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error('Excel generation error:', error);
      throw new Error('Không thể tạo file Excel. Vui lòng thử lại.');
    }
  }
  
  static generatePDFFile(plan: any): void {
    try {
      // Generate professional PDF content
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>${plan.title}</title>
          <style>
            @page { size: A4; margin: 20mm; }
            body { 
              font-family: 'Times New Roman', serif; 
              margin: 0; 
              line-height: 1.4;
              color: #333;
              font-size: 12px;
            }
            .header { 
              text-align: center; 
              margin-bottom: 30px; 
              border-bottom: 2px solid #0066CC;
              padding-bottom: 20px;
            }
            .company { 
              font-size: 18px; 
              font-weight: bold; 
              margin-bottom: 10px;
              color: #0066CC;
              text-transform: uppercase;
            }
            .plan-title { 
              font-size: 16px; 
              font-weight: bold; 
              margin: 15px 0;
              text-transform: uppercase;
            }
            .summary { 
              background: #f8f9fa; 
              padding: 15px; 
              margin: 20px 0; 
              border-left: 4px solid #0066CC;
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
              margin-top: 10px;
            }
            table { 
              width: 100%; 
              border-collapse: collapse; 
              margin: 20px 0; 
              font-size: 10px;
            }
            th, td { 
              border: 1px solid #ddd; 
              padding: 8px; 
              text-align: left; 
              vertical-align: top;
            }
            th { 
              background-color: #0066CC; 
              color: white; 
              font-weight: bold;
              text-align: center;
              font-size: 9px;
            }
            .insights { 
              margin-top: 20px; 
              background: #f8f9fa;
              padding: 15px;
              border-radius: 5px;
              border-left: 4px solid #28a745;
            }
            .insights h3 {
              color: #28a745;
              margin-top: 0;
              font-size: 14px;
            }
            .insights ol li { 
              margin: 8px 0; 
              line-height: 1.5;
              font-size: 11px;
            }
            .footer {
              margin-top: 30px;
              text-align: center;
              font-size: 10px;
              color: #666;
              border-top: 1px solid #ddd;
              padding-top: 15px;
            }
            .cost { font-weight: bold; color: #28a745; }
            .priority-high { background-color: #fff3cd; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="company">CÔNG TY CỔ PHẦN COMMODITIES EXPRESS</div>
            <div>Số 03 Nguyễn Lương Bằng, Phường Tân Phú, Quận 7, TP.HCM</div>
            <div>MST: 0318034219 | ĐT: (028) 3775 4567</div>
            <div class="plan-title">${plan.title}</div>
            <p><strong>Ngày lập:</strong> ${new Date().toLocaleDateString('vi-VN')} | <strong>Người lập:</strong> Hệ thống AI LogiAI</p>
          </div>
          
          <div class="summary">
            <h3>📊 TỔNG QUAN KẾ HOẠCH LOGISTICS</h3>
            <div class="summary-grid">
              <div>
                <p><strong>🚛 Tổng số tuyến:</strong> ${plan.summary.totalRoutes} tuyến</p>
                <p><strong>💰 Tổng chi phí:</strong> <span class="cost">${new Intl.NumberFormat('vi-VN').format(plan.summary.totalCost)} VNĐ</span></p>
              </div>
              <div>
                <p><strong>⚡ Hiệu suất dự kiến:</strong> ${plan.summary.efficiency}%</p>
                <p><strong>⏱️ Thời gian thực hiện:</strong> ${plan.summary.estimatedTime}</p>
              </div>
            </div>
          </div>
          
          <h3>🚚 CHI TIẾT TUYẾN ĐƯỜNG THỨC ĂN CHĂN NUÔI</h3>
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
                <th>GHI CHÚ LOGISTICS</th>
              </tr>
            </thead>
            <tbody>
              ${plan.routes.map((route: any, index: number) => `
                <tr class="${route.priority === 'HIGH' ? 'priority-high' : ''}">
                  <td style="text-align: center;">${index + 1}</td>
                  <td><strong>${route.from}</strong></td>
                  <td><strong>${route.to}</strong></td>
                  <td>${route.vehicle}</td>
                  <td style="text-align: center;">${route.time}</td>
                  <td style="text-align: right;" class="cost">${new Intl.NumberFormat('vi-VN').format(route.cost)}</td>
                  <td style="text-align: center;">${route.distance} km</td>
                  <td>${route.feedType || 'Thức ăn chăn nuôi'}</td>
                  <td>${route.customer || 'Khách hàng'}</td>
                  <td><em>${route.logic}</em></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          
          <div class="insights">
            <h3>🤖 KHUYẾN NGHỊ THÔNG MINH CỦA HỆ THỐNG AI</h3>
            <ol>
              ${plan.insights.map((insight: string) => `<li>${insight}</li>`).join('')}
            </ol>
          </div>
          
          <div class="footer">
            <p><strong>Kế hoạch được tạo bởi Hệ thống AI LogiAI - Commodities Express</strong></p>
            <p>Chuyên nghiệp • Thông minh • Tối ưu chi phí • Logistics thức ăn chăn nuôi miền Nam</p>
          </div>
        </body>
        </html>
      `;
      
      // Create proper PDF blob
      const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `${plan.title.replace(/[^a-z0-9]/gi, '_')}.html`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      // Note: For true PDF generation, we would need a PDF library like jsPDF or puppeteer
      // This creates an HTML file that can be printed to PDF by the browser
      
    } catch (error) {
      console.error('PDF generation error:', error);
      throw new Error('Không thể tạo file PDF. Vui lòng thử lại.');
    }
  }
}

export default FileGenerator;
