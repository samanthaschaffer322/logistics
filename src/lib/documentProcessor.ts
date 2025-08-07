'use client'

export interface DocumentAnalysis {
  id: string
  fileName: string
  fileType: string
  fileSize: number
  uploadedAt: Date
  status: 'processing' | 'completed' | 'error'
  extractedData: {
    documentType: 'invoice' | 'bill_of_lading' | 'customs_declaration' | 'packing_list' | 'certificate' | 'other'
    confidence: number
    keyFields: { [key: string]: string }
    entities: DocumentEntity[]
    summary: string
  }
  aiInsights: AIInsight[]
  recommendations: string[]
}

export interface DocumentEntity {
  type: 'company' | 'product' | 'amount' | 'date' | 'location' | 'container' | 'weight'
  value: string
  confidence: number
  position: { x: number; y: number; width: number; height: number }
}

export interface AIInsight {
  type: 'compliance' | 'cost_optimization' | 'risk_assessment' | 'process_improvement'
  title: string
  description: string
  impact: 'high' | 'medium' | 'low'
  actionable: boolean
  recommendation: string
}

export class DocumentProcessor {
  private language: 'vi' | 'en'

  constructor(language: 'vi' | 'en' = 'vi') {
    this.language = language
  }

  async processDocument(file: File): Promise<DocumentAnalysis> {
    // Simulate document processing
    await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 3000))

    const analysis: DocumentAnalysis = {
      id: `doc-${Date.now()}`,
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size,
      uploadedAt: new Date(),
      status: 'completed',
      extractedData: this.extractDocumentData(file),
      aiInsights: this.generateAIInsights(file),
      recommendations: this.generateRecommendations(file)
    }

    return analysis
  }

  private extractDocumentData(file: File): DocumentAnalysis['extractedData'] {
    const fileName = file.name.toLowerCase()
    
    // Determine document type based on filename
    let documentType: DocumentAnalysis['extractedData']['documentType'] = 'other'
    if (fileName.includes('invoice') || fileName.includes('hóa đơn')) {
      documentType = 'invoice'
    } else if (fileName.includes('bill') || fileName.includes('vận đơn')) {
      documentType = 'bill_of_lading'
    } else if (fileName.includes('customs') || fileName.includes('hải quan')) {
      documentType = 'customs_declaration'
    } else if (fileName.includes('packing') || fileName.includes('đóng gói')) {
      documentType = 'packing_list'
    } else if (fileName.includes('certificate') || fileName.includes('chứng nhận')) {
      documentType = 'certificate'
    }

    // Generate realistic extracted data based on document type
    const keyFields = this.generateKeyFields(documentType)
    const entities = this.generateEntities(documentType)
    const summary = this.generateSummary(documentType, keyFields)

    return {
      documentType,
      confidence: 85 + Math.random() * 10,
      keyFields,
      entities,
      summary
    }
  }

  private generateKeyFields(docType: DocumentAnalysis['extractedData']['documentType']): { [key: string]: string } {
    const baseFields = {
      'Document Number': `DOC-${Date.now().toString().slice(-6)}`,
      'Date': new Date().toLocaleDateString('vi-VN'),
      'Company': 'Công ty TNHH Logistics Việt Nam',
      'Contact': '+84 28 1234 5678'
    }

    switch (docType) {
      case 'invoice':
        return {
          ...baseFields,
          'Invoice Number': `INV-${Date.now().toString().slice(-6)}`,
          'Total Amount': '125,500,000 VNĐ',
          'Currency': 'VND',
          'Payment Terms': '30 days',
          'Tax Rate': '10%',
          'Shipping Address': 'TP. Hồ Chí Minh, Việt Nam',
          'Delivery Date': new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('vi-VN')
        }
      
      case 'bill_of_lading':
        return {
          ...baseFields,
          'B/L Number': `BL-${Date.now().toString().slice(-6)}`,
          'Vessel': 'MV VIETNAM EXPRESS',
          'Voyage': 'VN-2024-08',
          'Port of Loading': 'Cảng Sài Gòn (VNSGN)',
          'Port of Discharge': 'Cảng Hải Phòng (VNHPH)',
          'Container': '40ft HC (TCLU1234567)',
          'Gross Weight': '28,500 kg',
          'Measurement': '67.2 CBM'
        }
      
      case 'customs_declaration':
        return {
          ...baseFields,
          'Declaration Number': `CD-${Date.now().toString().slice(-6)}`,
          'HS Code': '8471.30.00',
          'Commodity': 'Computer Equipment',
          'Origin Country': 'Vietnam',
          'Destination': 'Singapore',
          'Declared Value': '85,000 USD',
          'Duty Rate': '5%',
          'Tax Amount': '4,250 USD'
        }
      
      case 'packing_list':
        return {
          ...baseFields,
          'Packing List No': `PL-${Date.now().toString().slice(-6)}`,
          'Total Packages': '150 cartons',
          'Net Weight': '2,450 kg',
          'Gross Weight': '2,680 kg',
          'Dimensions': '120x80x60 cm per carton',
          'Container Type': '20ft Standard',
          'Seal Number': 'VN123456'
        }
      
      case 'certificate':
        return {
          ...baseFields,
          'Certificate No': `CERT-${Date.now().toString().slice(-6)}`,
          'Certificate Type': 'Certificate of Origin',
          'Issuing Authority': 'Vietnam Chamber of Commerce',
          'Valid Until': new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toLocaleDateString('vi-VN'),
          'Product Category': 'Manufactured Goods',
          'Compliance Status': 'Approved'
        }
      
      default:
        return baseFields
    }
  }

  private generateEntities(docType: DocumentAnalysis['extractedData']['documentType']): DocumentEntity[] {
    const entities: DocumentEntity[] = [
      {
        type: 'company',
        value: 'Công ty TNHH Logistics Việt Nam',
        confidence: 95,
        position: { x: 50, y: 100, width: 200, height: 20 }
      },
      {
        type: 'date',
        value: new Date().toLocaleDateString('vi-VN'),
        confidence: 98,
        position: { x: 400, y: 50, width: 100, height: 15 }
      },
      {
        type: 'amount',
        value: '125,500,000 VNĐ',
        confidence: 92,
        position: { x: 350, y: 300, width: 120, height: 18 }
      }
    ]

    if (docType === 'bill_of_lading') {
      entities.push(
        {
          type: 'container',
          value: 'TCLU1234567',
          confidence: 88,
          position: { x: 200, y: 250, width: 100, height: 15 }
        },
        {
          type: 'weight',
          value: '28,500 kg',
          confidence: 90,
          position: { x: 150, y: 280, width: 80, height: 15 }
        }
      )
    }

    return entities
  }

  private generateSummary(docType: DocumentAnalysis['extractedData']['documentType'], keyFields: { [key: string]: string }): string {
    if (this.language === 'vi') {
      switch (docType) {
        case 'invoice':
          return `Hóa đơn thương mại số ${keyFields['Invoice Number']} với tổng giá trị ${keyFields['Total Amount']}. Điều khoản thanh toán: ${keyFields['Payment Terms']}. Địa chỉ giao hàng: ${keyFields['Shipping Address']}.`
        
        case 'bill_of_lading':
          return `Vận đơn số ${keyFields['B/L Number']} cho tàu ${keyFields['Vessel']}, chuyến ${keyFields['Voyage']}. Container ${keyFields['Container']} với trọng lượng ${keyFields['Gross Weight']}.`
        
        case 'customs_declaration':
          return `Tờ khai hải quan số ${keyFields['Declaration Number']} cho hàng hóa mã HS ${keyFields['HS Code']}. Giá trị khai báo: ${keyFields['Declared Value']}.`
        
        case 'packing_list':
          return `Danh sách đóng gói số ${keyFields['Packing List No']} gồm ${keyFields['Total Packages']} với trọng lượng tịnh ${keyFields['Net Weight']}.`
        
        case 'certificate':
          return `Chứng nhận số ${keyFields['Certificate No']} loại ${keyFields['Certificate Type']} do ${keyFields['Issuing Authority']} cấp.`
        
        default:
          return `Tài liệu được xử lý thành công với độ tin cậy cao. Đã trích xuất các thông tin chính và phân tích nội dung.`
      }
    } else {
      switch (docType) {
        case 'invoice':
          return `Commercial invoice ${keyFields['Invoice Number']} with total value ${keyFields['Total Amount']}. Payment terms: ${keyFields['Payment Terms']}. Shipping address: ${keyFields['Shipping Address']}.`
        
        case 'bill_of_lading':
          return `Bill of lading ${keyFields['B/L Number']} for vessel ${keyFields['Vessel']}, voyage ${keyFields['Voyage']}. Container ${keyFields['Container']} with gross weight ${keyFields['Gross Weight']}.`
        
        case 'customs_declaration':
          return `Customs declaration ${keyFields['Declaration Number']} for goods HS code ${keyFields['HS Code']}. Declared value: ${keyFields['Declared Value']}.`
        
        case 'packing_list':
          return `Packing list ${keyFields['Packing List No']} containing ${keyFields['Total Packages']} with net weight ${keyFields['Net Weight']}.`
        
        case 'certificate':
          return `Certificate ${keyFields['Certificate No']} type ${keyFields['Certificate Type']} issued by ${keyFields['Issuing Authority']}.`
        
        default:
          return `Document processed successfully with high confidence. Key information extracted and content analyzed.`
      }
    }
  }

  private generateAIInsights(file: File): AIInsight[] {
    const insights: AIInsight[] = []
    const fileName = file.name.toLowerCase()

    // Compliance insights
    insights.push({
      type: 'compliance',
      title: this.language === 'vi' ? 'Tuân thủ VNACCS' : 'VNACCS Compliance',
      description: this.language === 'vi' 
        ? 'Tài liệu tuân thủ 95% yêu cầu VNACCS. Cần bổ sung thông tin mã HS chi tiết và chứng từ gốc.'
        : 'Document complies with 95% of VNACCS requirements. Need to supplement detailed HS code and original certificates.',
      impact: 'high',
      actionable: true,
      recommendation: this.language === 'vi'
        ? 'Cập nhật mã HS code theo danh mục mới nhất và chuẩn bị chứng từ gốc cho thủ tục hải quan.'
        : 'Update HS code according to latest catalog and prepare original certificates for customs procedures.'
    })

    // Cost optimization
    insights.push({
      type: 'cost_optimization',
      title: this.language === 'vi' ? 'Tối ưu chi phí vận chuyển' : 'Transportation Cost Optimization',
      description: this.language === 'vi'
        ? 'Phát hiện cơ hội tiết kiệm 15-20% chi phí thông qua consolidation và tối ưu tuyến đường.'
        : 'Identified opportunity to save 15-20% costs through consolidation and route optimization.',
      impact: 'medium',
      actionable: true,
      recommendation: this.language === 'vi'
        ? 'Xem xét gộp chung container với các lô hàng khác cùng tuyến để giảm chi phí.'
        : 'Consider consolidating containers with other shipments on the same route to reduce costs.'
    })

    // Risk assessment
    if (fileName.includes('import') || fileName.includes('nhập')) {
      insights.push({
        type: 'risk_assessment',
        title: this.language === 'vi' ? 'Đánh giá rủi ro nhập khẩu' : 'Import Risk Assessment',
        description: this.language === 'vi'
          ? 'Rủi ro thấp. Hàng hóa thuộc danh mục được ưu tiên, thời gian thông quan dự kiến 2-3 ngày.'
          : 'Low risk. Goods are in priority category, expected clearance time 2-3 days.',
        impact: 'low',
        actionable: false,
        recommendation: this.language === 'vi'
          ? 'Duy trì quy trình hiện tại. Theo dõi cập nhật chính sách hải quan.'
          : 'Maintain current process. Monitor customs policy updates.'
      })
    }

    // Process improvement
    insights.push({
      type: 'process_improvement',
      title: this.language === 'vi' ? 'Cải tiến quy trình' : 'Process Improvement',
      description: this.language === 'vi'
        ? 'Có thể tự động hóa 80% quy trình xử lý tài liệu này bằng AI và RPA.'
        : 'Can automate 80% of this document processing workflow using AI and RPA.',
      impact: 'high',
      actionable: true,
      recommendation: this.language === 'vi'
        ? 'Triển khai hệ thống AI document processing để giảm thời gian xử lý từ 4 giờ xuống 30 phút.'
        : 'Deploy AI document processing system to reduce processing time from 4 hours to 30 minutes.'
    })

    return insights
  }

  private generateRecommendations(file: File): string[] {
    const recommendations: string[] = []

    if (this.language === 'vi') {
      recommendations.push(
        '🔍 Kiểm tra và cập nhật thông tin mã HS code theo danh mục mới nhất',
        '📋 Chuẩn bị đầy đủ chứng từ gốc để tránh chậm trễ thông quan',
        '💰 Xem xét consolidation với các lô hàng khác để tối ưu chi phí',
        '🤖 Triển khai AI document processing để tăng hiệu quả',
        '📊 Thiết lập dashboard theo dõi real-time cho quy trình này',
        '🔔 Cài đặt cảnh báo tự động cho các thay đổi chính sách hải quan'
      )
    } else {
      recommendations.push(
        '🔍 Verify and update HS code information according to latest catalog',
        '📋 Prepare complete original documents to avoid customs delays',
        '💰 Consider consolidation with other shipments to optimize costs',
        '🤖 Deploy AI document processing to increase efficiency',
        '📊 Set up real-time monitoring dashboard for this process',
        '🔔 Configure automatic alerts for customs policy changes'
      )
    }

    return recommendations
  }
}
