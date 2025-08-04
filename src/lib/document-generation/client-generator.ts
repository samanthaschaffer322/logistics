/**
 * Client-side Document Generator
 * Generates Vietnamese logistics documents without server-side API
 */

export interface DocumentTemplate {
  type: string
  nameVi: string
  nameEn: string
  fields: Array<{
    name: string
    labelVi: string
    labelEn: string
    required: boolean
    type: 'text' | 'number' | 'date' | 'select' | 'textarea'
  }>
  template: string
}

export interface GeneratedDocument {
  type: string
  title: string
  content: string
  format: 'html' | 'json'
  generatedAt: string
  data: { [key: string]: any }
}

// Vietnamese logistics document templates
const DOCUMENT_TEMPLATES: { [key: string]: DocumentTemplate } = {
  daily_plan: {
    type: 'daily_plan',
    nameVi: 'Kế hoạch vận tải hàng ngày',
    nameEn: 'Daily Transportation Plan',
    fields: [
      { name: 'plan_date', labelVi: 'Ngày kế hoạch', labelEn: 'Plan Date', required: true, type: 'date' },
      { name: 'vehicle_code', labelVi: 'Mã phương tiện', labelEn: 'Vehicle Code', required: true, type: 'text' },
      { name: 'driver_name', labelVi: 'Tên tài xế', labelEn: 'Driver Name', required: true, type: 'text' },
      { name: 'route', labelVi: 'Tuyến đường', labelEn: 'Route', required: true, type: 'text' },
      { name: 'cargo', labelVi: 'Hàng hóa', labelEn: 'Cargo', required: true, type: 'text' },
      { name: 'destination', labelVi: 'Điểm đến', labelEn: 'Destination', required: true, type: 'text' },
      { name: 'distance', labelVi: 'Quãng đường (km)', labelEn: 'Distance (km)', required: false, type: 'number' },
      { name: 'fuel_cost', labelVi: 'Chi phí nhiên liệu (VND)', labelEn: 'Fuel Cost (VND)', required: false, type: 'number' }
    ],
    template: `
      <div class="document-header">
        <h1>{{title}}</h1>
        <p><strong>Ngày:</strong> {{plan_date}}</p>
        <p><strong>Số kế hoạch:</strong> KH-{{plan_date}}-{{vehicle_code}}</p>
      </div>
      <div class="document-body">
        <h3>Thông tin vận tải</h3>
        <table class="info-table">
          <tr><td>Mã phương tiện:</td><td>{{vehicle_code}}</td></tr>
          <tr><td>Tài xế:</td><td>{{driver_name}}</td></tr>
          <tr><td>Tuyến đường:</td><td>{{route}}</td></tr>
          <tr><td>Hàng hóa:</td><td>{{cargo}}</td></tr>
          <tr><td>Điểm đến:</td><td>{{destination}}</td></tr>
          <tr><td>Quãng đường:</td><td>{{distance}} km</td></tr>
          <tr><td>Chi phí nhiên liệu dự kiến:</td><td>{{fuel_cost}} VND</td></tr>
        </table>
        
        <h3>Ghi chú</h3>
        <ul>
          <li>Kiểm tra giấy tờ phương tiện trước khi khởi hành</li>
          <li>Đảm bảo tài xế có đủ giấy phép lái xe phù hợp</li>
          <li>Liên hệ điều phối khi có thay đổi lộ trình</li>
        </ul>
      </div>
      <div class="document-footer">
        <p>Người lập kế hoạch: ________________</p>
        <p>Ngày lập: {{current_date}}</p>
      </div>
    `
  },

  transportation_manifest: {
    type: 'transportation_manifest',
    nameVi: 'Bảng kê vận chuyển',
    nameEn: 'Transportation Manifest',
    fields: [
      { name: 'manifest_number', labelVi: 'Số bảng kê', labelEn: 'Manifest Number', required: true, type: 'text' },
      { name: 'issue_date', labelVi: 'Ngày lập', labelEn: 'Issue Date', required: true, type: 'date' },
      { name: 'vehicle_info', labelVi: 'Thông tin xe', labelEn: 'Vehicle Info', required: true, type: 'text' },
      { name: 'driver_info', labelVi: 'Thông tin tài xế', labelEn: 'Driver Info', required: true, type: 'text' },
      { name: 'cargo_list', labelVi: 'Danh sách hàng hóa', labelEn: 'Cargo List', required: true, type: 'textarea' },
      { name: 'total_weight', labelVi: 'Tổng trọng lượng (kg)', labelEn: 'Total Weight (kg)', required: true, type: 'number' },
      { name: 'pickup_address', labelVi: 'Địa chỉ lấy hàng', labelEn: 'Pickup Address', required: true, type: 'textarea' },
      { name: 'delivery_address', labelVi: 'Địa chỉ giao hàng', labelEn: 'Delivery Address', required: true, type: 'textarea' }
    ],
    template: `
      <div class="document-header">
        <h1>{{title}}</h1>
        <p><strong>Số bảng kê:</strong> {{manifest_number}}</p>
        <p><strong>Ngày lập:</strong> {{issue_date}}</p>
      </div>
      <div class="document-body">
        <h3>Thông tin vận chuyển</h3>
        <table class="info-table">
          <tr><td>Phương tiện:</td><td>{{vehicle_info}}</td></tr>
          <tr><td>Tài xế:</td><td>{{driver_info}}</td></tr>
          <tr><td>Tổng trọng lượng:</td><td>{{total_weight}} kg</td></tr>
        </table>
        
        <h3>Địa chỉ</h3>
        <table class="info-table">
          <tr><td>Lấy hàng:</td><td>{{pickup_address}}</td></tr>
          <tr><td>Giao hàng:</td><td>{{delivery_address}}</td></tr>
        </table>
        
        <h3>Danh sách hàng hóa</h3>
        <div class="cargo-list">{{cargo_list}}</div>
        
        <h3>Xác nhận</h3>
        <div class="signature-section">
          <div class="signature-box">
            <p>Người giao hàng</p>
            <p>Ký tên: ________________</p>
            <p>Ngày: ________________</p>
          </div>
          <div class="signature-box">
            <p>Người nhận hàng</p>
            <p>Ký tên: ________________</p>
            <p>Ngày: ________________</p>
          </div>
        </div>
      </div>
    `
  },

  route_optimization_report: {
    type: 'route_optimization_report',
    nameVi: 'Báo cáo tối ưu hóa tuyến đường',
    nameEn: 'Route Optimization Report',
    fields: [
      { name: 'report_date', labelVi: 'Ngày báo cáo', labelEn: 'Report Date', required: true, type: 'date' },
      { name: 'total_routes', labelVi: 'Tổng số tuyến', labelEn: 'Total Routes', required: true, type: 'number' },
      { name: 'distance_saved', labelVi: 'Quãng đường tiết kiệm (km)', labelEn: 'Distance Saved (km)', required: true, type: 'number' },
      { name: 'fuel_saved', labelVi: 'Nhiên liệu tiết kiệm (L)', labelEn: 'Fuel Saved (L)', required: true, type: 'number' },
      { name: 'cost_saved', labelVi: 'Chi phí tiết kiệm (VND)', labelEn: 'Cost Saved (VND)', required: true, type: 'number' },
      { name: 'time_saved', labelVi: 'Thời gian tiết kiệm (phút)', labelEn: 'Time Saved (minutes)', required: true, type: 'number' },
      { name: 'recommendations', labelVi: 'Khuyến nghị', labelEn: 'Recommendations', required: false, type: 'textarea' }
    ],
    template: `
      <div class="document-header">
        <h1>{{title}}</h1>
        <p><strong>Ngày báo cáo:</strong> {{report_date}}</p>
        <p><strong>Phạm vi:</strong> Tối ưu hóa {{total_routes}} tuyến đường</p>
      </div>
      <div class="document-body">
        <h3>Tóm tắt kết quả</h3>
        <div class="summary-grid">
          <div class="summary-item">
            <h4>Quãng đường tiết kiệm</h4>
            <p class="big-number">{{distance_saved}} km</p>
          </div>
          <div class="summary-item">
            <h4>Nhiên liệu tiết kiệm</h4>
            <p class="big-number">{{fuel_saved}} L</p>
          </div>
          <div class="summary-item">
            <h4>Chi phí tiết kiệm</h4>
            <p class="big-number">{{cost_saved}} VND</p>
          </div>
          <div class="summary-item">
            <h4>Thời gian tiết kiệm</h4>
            <p class="big-number">{{time_saved}} phút</p>
          </div>
        </div>
        
        <h3>Khuyến nghị</h3>
        <div class="recommendations">{{recommendations}}</div>
        
        <h3>Kết luận</h3>
        <p>Việc tối ưu hóa tuyến đường đã mang lại hiệu quả tích cực, giúp tiết kiệm chi phí và thời gian vận chuyển. 
        Khuyến nghị tiếp tục áp dụng các giải pháp tối ưu hóa để nâng cao hiệu quả hoạt động.</p>
      </div>
      <div class="document-footer">
        <p>Người lập báo cáo: ________________</p>
        <p>Chức vụ: ________________</p>
        <p>Ngày: {{current_date}}</p>
      </div>
    `
  }
}

export class ClientDocumentGenerator {
  
  static getAvailableTemplates(): DocumentTemplate[] {
    return Object.values(DOCUMENT_TEMPLATES)
  }

  static getTemplate(type: string): DocumentTemplate | null {
    return DOCUMENT_TEMPLATES[type] || null
  }

  static generateDocument(
    templateType: string,
    data: { [key: string]: any },
    language: 'vi' | 'en' = 'vi',
    format: 'html' | 'json' = 'html'
  ): GeneratedDocument | null {
    const template = DOCUMENT_TEMPLATES[templateType]
    if (!template) {
      return null
    }

    // Validate required fields
    const missingFields = template.fields
      .filter(field => field.required && !data[field.name])
      .map(field => field.name)

    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(', ')}`)
    }

    // Prepare template data
    const templateData = {
      ...data,
      title: language === 'vi' ? template.nameVi : template.nameEn,
      current_date: new Date().toLocaleDateString('vi-VN')
    }

    let content: string

    if (format === 'json') {
      content = JSON.stringify({
        documentType: template.type,
        title: templateData.title,
        data: templateData,
        fields: template.fields.map(field => ({
          name: field.name,
          label: language === 'vi' ? field.labelVi : field.labelEn,
          value: templateData[field.name] || null,
          type: field.type
        }))
      }, null, 2)
    } else {
      // Generate HTML
      content = this.processTemplate(template.template, templateData)
      content = this.addDocumentStyles(content)
    }

    return {
      type: template.type,
      title: templateData.title,
      content,
      format,
      generatedAt: new Date().toISOString(),
      data: templateData
    }
  }

  static generateFromFileData(
    fileData: any[],
    templateType: string = 'daily_plan'
  ): GeneratedDocument[] {
    const documents: GeneratedDocument[] = []

    if (templateType === 'daily_plan' && fileData.length > 0) {
      // Generate daily plans from route data
      for (const record of fileData.slice(0, 10)) { // Limit to 10 documents
        try {
          const doc = this.generateDocument('daily_plan', {
            plan_date: record.date || record.plan_date || record.ngay || new Date().toISOString().split('T')[0],
            vehicle_code: record.vehicle || record.phuong_tien || record.vehicle_code || 'TBD',
            driver_name: record.driver || record.tai_xe || record.driver_name || 'TBD',
            route: record.route || record.tuyen_duong || record.tuyến_đường || 'TBD',
            cargo: record.cargo || record.hang_hoa || record.hàng_hóa || 'TBD',
            destination: record.destination || record.diem_den || record.điểm_đến || 'TBD',
            distance: record.distance || record.quang_duong || record.quãng_đường || 0,
            fuel_cost: record.fuel_cost || record.chi_phi_nhien_lieu || record.chi_phí_nhiên_liệu || 0
          })

          if (doc) {
            documents.push(doc)
          }
        } catch (error) {
          console.warn('Failed to generate document for record:', record, error)
        }
      }
    }

    return documents
  }

  static generateRouteOptimizationReport(optimizationResults: {
    totalDistanceSaved: number
    totalFuelSaved: number
    totalCostSaved: number
    totalTimeSaved: number
    totalRoutes: number
    recommendations: string[]
  }): GeneratedDocument | null {
    return this.generateDocument('route_optimization_report', {
      report_date: new Date().toLocaleDateString('vi-VN'),
      total_routes: optimizationResults.totalRoutes,
      distance_saved: optimizationResults.totalDistanceSaved,
      fuel_saved: optimizationResults.totalFuelSaved,
      cost_saved: optimizationResults.totalCostSaved,
      time_saved: optimizationResults.totalTimeSaved,
      recommendations: optimizationResults.recommendations.join('\n• ')
    })
  }

  private static processTemplate(template: string, data: { [key: string]: any }): string {
    let processed = template

    // Replace template variables
    Object.entries(data).forEach(([key, value]) => {
      const regex = new RegExp(`{{${key}}}`, 'g')
      processed = processed.replace(regex, String(value || ''))
    })

    return processed
  }

  private static addDocumentStyles(content: string): string {
    const styles = `
      <style>
        body { 
          font-family: 'Times New Roman', serif; 
          max-width: 800px; 
          margin: 0 auto; 
          padding: 20px; 
          line-height: 1.6;
          color: #333;
        }
        .document-header { 
          text-align: center; 
          margin-bottom: 30px; 
          border-bottom: 2px solid #333; 
          padding-bottom: 20px; 
        }
        .document-header h1 { 
          color: #333; 
          margin: 0; 
          font-size: 24px; 
          text-transform: uppercase;
          font-weight: bold;
        }
        .document-header p { 
          color: #666; 
          margin: 10px 0 0 0; 
          font-size: 14px;
        }
        .document-body { 
          margin: 20px 0; 
        }
        .document-body h3 { 
          color: #333; 
          border-bottom: 1px solid #ccc; 
          padding-bottom: 5px; 
          margin: 25px 0 15px 0; 
          font-size: 16px;
        }
        .info-table { 
          width: 100%; 
          border-collapse: collapse; 
          margin: 15px 0; 
        }
        .info-table td { 
          padding: 8px 12px; 
          border-bottom: 1px solid #eee; 
          vertical-align: top;
        }
        .info-table td:first-child { 
          font-weight: bold; 
          width: 200px; 
          background-color: #f9f9f9;
        }
        .summary-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
          margin: 20px 0;
        }
        .summary-item {
          text-align: center;
          padding: 15px;
          border: 1px solid #ddd;
          border-radius: 5px;
          background-color: #f9f9f9;
        }
        .summary-item h4 {
          margin: 0 0 10px 0;
          color: #666;
          font-size: 14px;
        }
        .big-number {
          font-size: 24px;
          font-weight: bold;
          color: #333;
          margin: 0;
        }
        .cargo-list {
          background-color: #f9f9f9;
          padding: 15px;
          border-radius: 5px;
          white-space: pre-line;
        }
        .signature-section {
          display: flex;
          justify-content: space-between;
          margin-top: 30px;
        }
        .signature-box {
          text-align: center;
          width: 45%;
          border: 1px solid #ddd;
          padding: 20px;
          border-radius: 5px;
        }
        .signature-box p {
          margin: 10px 0;
        }
        .document-footer {
          margin-top: 40px;
          text-align: right;
          border-top: 1px solid #ccc;
          padding-top: 20px;
        }
        .document-footer p {
          margin: 5px 0;
        }
        .recommendations {
          background-color: #f0f8ff;
          padding: 15px;
          border-left: 4px solid #007bff;
          white-space: pre-line;
        }
        ul {
          padding-left: 20px;
        }
        li {
          margin: 5px 0;
        }
        @media print {
          body { margin: 0; padding: 15px; }
          .document-header { page-break-after: avoid; }
          .signature-section { page-break-inside: avoid; }
        }
      </style>
    `

    return styles + content
  }

  // Utility function to download generated document
  static downloadDocument(document: GeneratedDocument, filename?: string): void {
    const blob = new Blob([document.content], { 
      type: document.format === 'json' ? 'application/json' : 'text/html' 
    })
    
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename || `${document.type}_${new Date().toISOString().split('T')[0]}.${document.format}`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // Utility function to print document
  static printDocument(document: GeneratedDocument): void {
    if (document.format === 'html') {
      const printWindow = window.open('', '_blank')
      if (printWindow) {
        printWindow.document.write(document.content)
        printWindow.document.close()
        printWindow.focus()
        printWindow.print()
      }
    }
  }
}
