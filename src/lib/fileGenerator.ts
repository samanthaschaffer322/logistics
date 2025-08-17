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
      
      // Table Headers - Staff Level Detail
      const headers = [
        'STT', 'NGÀY', 'SỐ XE', 'SĐT LÁI XE', 'TÊN LÁI XE', 'SỐ CONT', 
        'SEAL', 'CHỦ HÀNG', 'ĐỊA ĐIỂM', 'T.GIAN Y/C', 'VỊ TRÍ XE 7H', 
        'BILL - BOOK', 'CẢNG HẠ', 'CHI PHÍ (VNĐ)', 'KM', 'LOẠI THỨC ĂN'
      ];
      headers.forEach((header, index) => {
        const cell = worksheet.getCell(row, index + 1);
        cell.value = header;
        cell.font = { bold: true, size: 10 };
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE6F3FF' } };
        cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
      });
      row++;
      
      // Routes Data - Staff Level Detail
      plan.routes.forEach((route: any, index: number) => {
        const rowData = [
          index + 1,
          new Date().toLocaleDateString('vi-VN'),
          route.vehiclePlate || 'N/A',
          route.driverPhone || 'N/A',
          route.driverName || 'N/A',
          route.containerNumber || '',
          route.sealNumber || '',
          route.customer || 'Khách hàng',
          route.to,
          route.time,
          route.vehiclePosition7h || route.from,
          route.billNumber || 'N/A',
          route.portUnload || '',
          new Intl.NumberFormat('vi-VN').format(route.cost),
          route.distance + ' km',
          route.feedType || 'Thức ăn chăn nuôi'
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
  
  static async generatePDFFile(plan: any): Promise<void> {
    try {
      // Dynamic import for client-side compatibility
      const jsPDF = (await import('jspdf')).default;
      const autoTable = (await import('jspdf-autotable')).default;
      
      const doc = new jsPDF();
      
      // Company Header
      doc.setFontSize(16);
      doc.setTextColor(0, 102, 204);
      doc.text('CÔNG TY CỔ PHẦN COMMODITIES EXPRESS', 105, 20, { align: 'center' });
      
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text('Số 03 Nguyễn Lương Bằng, Phường Tân Phú, Quận 7, TP.HCM', 105, 30, { align: 'center' });
      doc.text('MST: 0318034219 | ĐT: (028) 3775 4567', 105, 40, { align: 'center' });
      
      // Plan Title
      doc.setFontSize(14);
      doc.setTextColor(0, 102, 204);
      doc.text(plan.title, 105, 55, { align: 'center' });
      
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      doc.text(`Ngày lập: ${new Date().toLocaleDateString('vi-VN')} | Người lập: Hệ thống AI LogiAI`, 105, 65, { align: 'center' });
      
      // Summary Section
      let yPosition = 80;
      doc.setFontSize(12);
      doc.setTextColor(0, 102, 204);
      doc.text('TỔNG QUAN KẾ HOẠCH LOGISTICS', 20, yPosition);
      
      yPosition += 10;
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      doc.text(`Tổng số tuyến: ${plan.summary.totalRoutes} tuyến`, 20, yPosition);
      doc.text(`Hiệu suất dự kiến: ${plan.summary.efficiency}%`, 120, yPosition);
      
      yPosition += 8;
      doc.text(`Tổng chi phí: ${new Intl.NumberFormat('vi-VN').format(plan.summary.totalCost)} VNĐ`, 20, yPosition);
      doc.text(`Thời gian thực hiện: ${plan.summary.estimatedTime}`, 120, yPosition);
      
      // Routes Table
      yPosition += 20;
      doc.setFontSize(12);
      doc.setTextColor(0, 102, 204);
      doc.text('CHI TIẾT TUYẾN ĐƯỜNG THỨC ĂN CHĂN NUÔI', 20, yPosition);
      
      const tableData = plan.routes.map((route: any, index: number) => [
        (index + 1).toString(),
        new Date().toLocaleDateString('vi-VN'),
        route.vehiclePlate || 'N/A',
        route.driverPhone || 'N/A', 
        route.driverName || 'N/A',
        route.containerNumber || '',
        route.customer || 'Khách hàng',
        route.to,
        route.time,
        new Intl.NumberFormat('vi-VN').format(route.cost),
        `${route.distance} km`,
        route.feedType || 'Thức ăn chăn nuôi'
      ]);
      
      autoTable(doc, {
        head: [['STT', 'NGÀY', 'SỐ XE', 'SĐT LÁI XE', 'TÊN LÁI XE', 'SỐ CONT', 'CHỦ HÀNG', 'ĐỊA ĐIỂM', 'GIỜ GIAO', 'CHI PHÍ (VNĐ)', 'KM', 'LOẠI THỨC ĂN']],
        body: tableData,
        startY: yPosition + 10,
        styles: { fontSize: 8, cellPadding: 2 },
        headStyles: { fillColor: [0, 102, 204], textColor: 255 },
        alternateRowStyles: { fillColor: [245, 245, 245] },
        margin: { left: 10, right: 10 }
      });
      
      // Get the final Y position after the table
      const finalY = (doc as any).lastAutoTable.finalY + 20;
      
      // Recommendations
      doc.setFontSize(12);
      doc.setTextColor(40, 167, 69);
      doc.text('KHUYẾN NGHỊ THÔNG MINH CỦA HỆ THỐNG AI', 20, finalY);
      
      let recommendationY = finalY + 10;
      doc.setFontSize(9);
      doc.setTextColor(0, 0, 0);
      
      plan.insights.forEach((insight: string, index: number) => {
        const lines = doc.splitTextToSize(`${index + 1}. ${insight}`, 170);
        doc.text(lines, 20, recommendationY);
        recommendationY += lines.length * 5;
      });
      
      // Footer
      const pageHeight = doc.internal.pageSize.height;
      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);
      doc.text('Kế hoạch được tạo bởi Hệ thống AI LogiAI - Commodities Express', 105, pageHeight - 20, { align: 'center' });
      doc.text('Chuyên nghiệp • Thông minh • Tối ưu chi phí • Logistics thức ăn chăn nuôi miền Nam', 105, pageHeight - 10, { align: 'center' });
      
      // Save the PDF
      doc.save(`${plan.title.replace(/[^a-z0-9]/gi, '_')}.pdf`);
      
    } catch (error) {
      console.error('PDF generation error:', error);
      throw new Error('Không thể tạo file PDF. Vui lòng thử lại.');
    }
  }
}

export default FileGenerator;
