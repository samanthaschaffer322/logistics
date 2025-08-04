/**
 * Vietnamese Import/Export Document Knowledge Base
 * Based on https://vinatrain.edu.vn/tai-lieu-xuat-nhap-khau/
 * Complete "Bộ Chứng Từ Xuất Nhập Khẩu" knowledge system
 */

export interface DocumentType {
  code: string
  name: string
  nameVi: string
  purpose: string
  purposeVi: string
  fields: DocumentField[]
  validationRules: ValidationRule[]
  sequence: number
  required: boolean
  dependencies: string[]
}

export interface DocumentField {
  name: string
  nameVi: string
  type: 'text' | 'number' | 'date' | 'select' | 'boolean'
  required: boolean
  validation?: string
  options?: string[]
}

export interface ValidationRule {
  field: string
  rule: string
  message: string
  messageVi: string
}

export interface WorkflowStep {
  step: number
  name: string
  nameVi: string
  description: string
  descriptionVi: string
  requiredDocuments: string[]
  automationPossible: boolean
  estimatedTime: string
}

// Complete Vietnamese Import/Export Document Package
export const VIETNAMESE_IMPORT_EXPORT_DOCUMENTS: { [key: string]: DocumentType } = {
  sales_contract: {
    code: 'sales_contract',
    name: 'Sales Contract',
    nameVi: 'Hợp đồng ngoại thương',
    purpose: 'International sales agreement between buyer and seller',
    purposeVi: 'Thỏa thuận mua bán quốc tế giữa buyer và seller',
    sequence: 1,
    required: true,
    dependencies: [],
    fields: [
      { name: 'contract_number', nameVi: 'Số hợp đồng', type: 'text', required: true },
      { name: 'contract_date', nameVi: 'Ngày ký hợp đồng', type: 'date', required: true },
      { name: 'buyer_name', nameVi: 'Tên người mua', type: 'text', required: true },
      { name: 'buyer_address', nameVi: 'Địa chỉ người mua', type: 'text', required: true },
      { name: 'seller_name', nameVi: 'Tên người bán', type: 'text', required: true },
      { name: 'seller_address', nameVi: 'Địa chỉ người bán', type: 'text', required: true },
      { name: 'goods_description', nameVi: 'Mô tả hàng hóa', type: 'text', required: true },
      { name: 'quantity', nameVi: 'Số lượng', type: 'number', required: true },
      { name: 'unit_price', nameVi: 'Đơn giá', type: 'number', required: true },
      { name: 'total_value', nameVi: 'Tổng giá trị', type: 'number', required: true },
      { name: 'currency', nameVi: 'Đơn vị tiền tệ', type: 'select', required: true, options: ['USD', 'EUR', 'VND'] },
      { name: 'payment_terms', nameVi: 'Điều kiện thanh toán', type: 'text', required: true },
      { name: 'delivery_terms', nameVi: 'Điều kiện giao hàng', type: 'text', required: true },
      { name: 'port_of_loading', nameVi: 'Cảng xếp hàng', type: 'text', required: true },
      { name: 'port_of_discharge', nameVi: 'Cảng dỡ hàng', type: 'text', required: true }
    ],
    validationRules: [
      {
        field: 'total_value',
        rule: 'equals_quantity_times_unit_price',
        message: 'Total value must equal quantity × unit price',
        messageVi: 'Tổng giá trị phải bằng số lượng × đơn giá'
      }
    ]
  },

  commercial_invoice: {
    code: 'commercial_invoice',
    name: 'Commercial Invoice',
    nameVi: 'Hóa đơn thương mại',
    purpose: 'Customs valuation basis and international payment',
    purposeVi: 'Căn cứ khai giá trị hải quan và thanh toán quốc tế',
    sequence: 2,
    required: true,
    dependencies: ['sales_contract'],
    fields: [
      { name: 'invoice_number', nameVi: 'Số hóa đơn', type: 'text', required: true },
      { name: 'issue_date', nameVi: 'Ngày phát hành', type: 'date', required: true },
      { name: 'exporter', nameVi: 'Người xuất khẩu', type: 'text', required: true },
      { name: 'exporter_address', nameVi: 'Địa chỉ người xuất khẩu', type: 'text', required: true },
      { name: 'importer', nameVi: 'Người nhập khẩu', type: 'text', required: true },
      { name: 'importer_address', nameVi: 'Địa chỉ người nhập khẩu', type: 'text', required: true },
      { name: 'goods_details', nameVi: 'Chi tiết hàng hóa', type: 'text', required: true },
      { name: 'hs_code', nameVi: 'Mã HS', type: 'text', required: true },
      { name: 'quantity', nameVi: 'Số lượng', type: 'number', required: true },
      { name: 'unit', nameVi: 'Đơn vị tính', type: 'text', required: true },
      { name: 'unit_price', nameVi: 'Đơn giá', type: 'number', required: true },
      { name: 'total_amount', nameVi: 'Tổng số tiền', type: 'number', required: true },
      { name: 'currency', nameVi: 'Đơn vị tiền tệ', type: 'select', required: true, options: ['USD', 'EUR', 'VND'] },
      { name: 'payment_terms', nameVi: 'Điều kiện thanh toán', type: 'text', required: true }
    ],
    validationRules: [
      {
        field: 'exporter',
        rule: 'matches_contract_seller',
        message: 'Exporter must match seller in sales contract',
        messageVi: 'Người xuất khẩu phải trùng với người bán trong hợp đồng'
      }
    ]
  },

  packing_list: {
    code: 'packing_list',
    name: 'Packing List',
    nameVi: 'Phiếu đóng gói (Packing List)',
    purpose: 'Detailed packing information for port and customs inspection',
    purposeVi: 'Chi tiết đóng gói để kiểm hàng tại cảng và hải quan',
    sequence: 3,
    required: true,
    dependencies: ['commercial_invoice'],
    fields: [
      { name: 'packing_list_number', nameVi: 'Số phiếu đóng gói', type: 'text', required: true },
      { name: 'date', nameVi: 'Ngày lập', type: 'date', required: true },
      { name: 'shipper', nameVi: 'Người gửi hàng', type: 'text', required: true },
      { name: 'consignee', nameVi: 'Người nhận hàng', type: 'text', required: true },
      { name: 'package_number', nameVi: 'Số kiện', type: 'number', required: true },
      { name: 'package_type', nameVi: 'Loại bao bì', type: 'text', required: true },
      { name: 'description', nameVi: 'Mô tả hàng hóa', type: 'text', required: true },
      { name: 'net_weight', nameVi: 'Trọng lượng tịnh (kg)', type: 'number', required: true },
      { name: 'gross_weight', nameVi: 'Trọng lượng thô (kg)', type: 'number', required: true },
      { name: 'volume', nameVi: 'Thể tích (m³)', type: 'number', required: true },
      { name: 'dimensions', nameVi: 'Kích thước (L×W×H)', type: 'text', required: true }
    ],
    validationRules: [
      {
        field: 'gross_weight',
        rule: 'greater_than_net_weight',
        message: 'Gross weight must be greater than net weight',
        messageVi: 'Trọng lượng thô phải lớn hơn trọng lượng tịnh'
      }
    ]
  },

  bill_of_lading: {
    code: 'bill_of_lading',
    name: 'Bill of Lading',
    nameVi: 'Vận đơn (Bill of Lading)',
    purpose: 'Transport document confirming goods loaded on vessel',
    purposeVi: 'Chứng từ vận tải xác nhận hàng đã lên tàu',
    sequence: 4,
    required: true,
    dependencies: ['packing_list'],
    fields: [
      { name: 'bl_number', nameVi: 'Số vận đơn', type: 'text', required: true },
      { name: 'issue_date', nameVi: 'Ngày phát hành', type: 'date', required: true },
      { name: 'vessel_name', nameVi: 'Tên tàu', type: 'text', required: true },
      { name: 'voyage', nameVi: 'Chuyến tàu', type: 'text', required: true },
      { name: 'shipper', nameVi: 'Người gửi hàng', type: 'text', required: true },
      { name: 'consignee', nameVi: 'Người nhận hàng', type: 'text', required: true },
      { name: 'notify_party', nameVi: 'Bên được thông báo', type: 'text', required: true },
      { name: 'port_of_loading', nameVi: 'Cảng xếp hàng', type: 'text', required: true },
      { name: 'port_of_discharge', nameVi: 'Cảng dỡ hàng', type: 'text', required: true },
      { name: 'place_of_delivery', nameVi: 'Nơi giao hàng', type: 'text', required: true },
      { name: 'freight_terms', nameVi: 'Điều kiện cước phí', type: 'select', required: true, options: ['Prepaid', 'Collect'] },
      { name: 'container_number', nameVi: 'Số container', type: 'text', required: false },
      { name: 'seal_number', nameVi: 'Số seal', type: 'text', required: false }
    ],
    validationRules: []
  },

  customs_declaration: {
    code: 'customs_declaration',
    name: 'Customs Declaration',
    nameVi: 'Tờ khai hải quan',
    purpose: 'Goods declaration for customs clearance procedures',
    purposeVi: 'Khai báo thông tin hàng hoá để làm thủ tục thông quan',
    sequence: 5,
    required: true,
    dependencies: ['bill_of_lading', 'commercial_invoice'],
    fields: [
      { name: 'declaration_number', nameVi: 'Số tờ khai', type: 'text', required: true },
      { name: 'declaration_date', nameVi: 'Ngày khai báo', type: 'date', required: true },
      { name: 'declaration_type', nameVi: 'Loại tờ khai', type: 'select', required: true, options: ['Import', 'Export'] },
      { name: 'declarant', nameVi: 'Người khai báo', type: 'text', required: true },
      { name: 'importer_exporter', nameVi: 'Người XNK', type: 'text', required: true },
      { name: 'hs_code', nameVi: 'Mã HS', type: 'text', required: true },
      { name: 'goods_description', nameVi: 'Mô tả hàng hóa', type: 'text', required: true },
      { name: 'origin_country', nameVi: 'Nước xuất xứ', type: 'text', required: true },
      { name: 'quantity', nameVi: 'Số lượng', type: 'number', required: true },
      { name: 'unit', nameVi: 'Đơn vị tính', type: 'text', required: true },
      { name: 'customs_value', nameVi: 'Giá trị hải quan', type: 'number', required: true },
      { name: 'currency', nameVi: 'Đơn vị tiền tệ', type: 'text', required: true },
      { name: 'tax_amount', nameVi: 'Số thuế phải nộp', type: 'number', required: true },
      { name: 'port_of_entry', nameVi: 'Cửa khẩu nhập', type: 'text', required: true }
    ],
    validationRules: [
      {
        field: 'customs_value',
        rule: 'matches_invoice_value',
        message: 'Customs value should match commercial invoice value',
        messageVi: 'Giá trị hải quan phải trùng với giá trị trên hóa đơn thương mại'
      }
    ]
  },

  letter_of_credit: {
    code: 'letter_of_credit',
    name: 'Letter of Credit',
    nameVi: 'Thư tín dụng (L/C)',
    purpose: 'International payment through bank guarantee',
    purposeVi: 'Thanh toán quốc tế qua ngân hàng đảm bảo',
    sequence: 6,
    required: false,
    dependencies: ['sales_contract'],
    fields: [
      { name: 'lc_number', nameVi: 'Số L/C', type: 'text', required: true },
      { name: 'issue_date', nameVi: 'Ngày phát hành', type: 'date', required: true },
      { name: 'expiry_date', nameVi: 'Ngày hết hạn', type: 'date', required: true },
      { name: 'issue_bank', nameVi: 'Ngân hàng phát hành', type: 'text', required: true },
      { name: 'advising_bank', nameVi: 'Ngân hàng thông báo', type: 'text', required: true },
      { name: 'applicant', nameVi: 'Người yêu cầu mở L/C', type: 'text', required: true },
      { name: 'beneficiary', nameVi: 'Người thụ hưởng', type: 'text', required: true },
      { name: 'amount', nameVi: 'Số tiền', type: 'number', required: true },
      { name: 'currency', nameVi: 'Đơn vị tiền tệ', type: 'text', required: true },
      { name: 'payment_terms', nameVi: 'Điều kiện thanh toán', type: 'text', required: true }
    ],
    validationRules: []
  },

  certificate_of_origin: {
    code: 'certificate_of_origin',
    name: 'Certificate of Origin',
    nameVi: 'Chứng nhận xuất xứ (C/O)',
    purpose: 'Proof of origin for tax preference benefits',
    purposeVi: 'Chứng minh xuất xứ để hưởng ưu đãi thuế',
    sequence: 7,
    required: true,
    dependencies: ['commercial_invoice'],
    fields: [
      { name: 'co_number', nameVi: 'Số C/O', type: 'text', required: true },
      { name: 'co_type', nameVi: 'Loại C/O', type: 'select', required: true, options: ['Form D', 'Form E', 'Form AK', 'General'] },
      { name: 'issuance_date', nameVi: 'Ngày cấp', type: 'date', required: true },
      { name: 'issuer', nameVi: 'Cơ quan cấp', type: 'text', required: true },
      { name: 'exporter', nameVi: 'Người xuất khẩu', type: 'text', required: true },
      { name: 'consignee', nameVi: 'Người nhận hàng', type: 'text', required: true },
      { name: 'goods_description', nameVi: 'Mô tả hàng hóa', type: 'text', required: true },
      { name: 'hs_code', nameVi: 'Mã HS', type: 'text', required: true },
      { name: 'goods_origin', nameVi: 'Xuất xứ hàng hóa', type: 'text', required: true },
      { name: 'quantity', nameVi: 'Số lượng', type: 'number', required: true },
      { name: 'gross_weight', nameVi: 'Trọng lượng thô', type: 'number', required: true }
    ],
    validationRules: []
  },

  quality_certificate: {
    code: 'quality_certificate',
    name: 'Quality Certificate',
    nameVi: 'Giấy chứng nhận chất lượng (C/Q)',
    purpose: 'Quality compliance confirmation per contract standards',
    purposeVi: 'Xác nhận chất lượng phù hợp theo tiêu chuẩn hợp đồng',
    sequence: 8,
    required: false,
    dependencies: ['sales_contract'],
    fields: [
      { name: 'cq_number', nameVi: 'Số C/Q', type: 'text', required: true },
      { name: 'issue_date', nameVi: 'Ngày cấp', type: 'date', required: true },
      { name: 'inspection_body', nameVi: 'Cơ quan kiểm tra', type: 'text', required: true },
      { name: 'inspection_date', nameVi: 'Ngày kiểm tra', type: 'date', required: true },
      { name: 'goods_description', nameVi: 'Mô tả hàng hóa', type: 'text', required: true },
      { name: 'quality_standard', nameVi: 'Tiêu chuẩn chất lượng', type: 'text', required: true },
      { name: 'test_results', nameVi: 'Kết quả kiểm tra', type: 'text', required: true },
      { name: 'compliance_result', nameVi: 'Kết quả tuân thủ', type: 'select', required: true, options: ['Passed', 'Failed'] }
    ],
    validationRules: []
  },

  insurance_certificate: {
    code: 'insurance_certificate',
    name: 'Insurance Certificate',
    nameVi: 'Chứng nhận bảo hiểm',
    purpose: 'Cargo insurance during international transport',
    purposeVi: 'Bảo hiểm hàng hóa trong vận chuyển quốc tế',
    sequence: 9,
    required: false,
    dependencies: ['commercial_invoice'],
    fields: [
      { name: 'policy_number', nameVi: 'Số đơn bảo hiểm', type: 'text', required: true },
      { name: 'issue_date', nameVi: 'Ngày phát hành', type: 'date', required: true },
      { name: 'insurer', nameVi: 'Công ty bảo hiểm', type: 'text', required: true },
      { name: 'insured', nameVi: 'Người được bảo hiểm', type: 'text', required: true },
      { name: 'coverage_type', nameVi: 'Loại bảo hiểm', type: 'select', required: true, options: ['All Risks', 'WPA', 'FPA'] },
      { name: 'insured_value', nameVi: 'Giá trị bảo hiểm', type: 'number', required: true },
      { name: 'currency', nameVi: 'Đơn vị tiền tệ', type: 'text', required: true },
      { name: 'voyage', nameVi: 'Hành trình', type: 'text', required: true }
    ],
    validationRules: []
  },

  import_export_license: {
    code: 'import_export_license',
    name: 'Import/Export License',
    nameVi: 'Giấy phép xuất nhập khẩu',
    purpose: 'Government authorization for restricted goods',
    purposeVi: 'Giấy phép của chính phủ cho hàng hóa hạn chế',
    sequence: 10,
    required: false,
    dependencies: [],
    fields: [
      { name: 'license_number', nameVi: 'Số giấy phép', type: 'text', required: true },
      { name: 'issue_date', nameVi: 'Ngày cấp', type: 'date', required: true },
      { name: 'expiry_date', nameVi: 'Ngày hết hạn', type: 'date', required: true },
      { name: 'issuing_authority', nameVi: 'Cơ quan cấp phép', type: 'text', required: true },
      { name: 'license_holder', nameVi: 'Người được cấp phép', type: 'text', required: true },
      { name: 'goods_description', nameVi: 'Mô tả hàng hóa', type: 'text', required: true },
      { name: 'authorized_quantity', nameVi: 'Số lượng được phép', type: 'number', required: true },
      { name: 'license_type', nameVi: 'Loại giấy phép', type: 'select', required: true, options: ['Import', 'Export', 'Transit'] }
    ],
    validationRules: []
  }
}

// Document processing workflow
export const DOCUMENT_WORKFLOW: WorkflowStep[] = [
  {
    step: 1,
    name: 'Contract Preparation',
    nameVi: 'Chuẩn bị hợp đồng',
    description: 'Prepare and sign sales contract with buyer/seller',
    descriptionVi: 'Chuẩn bị và ký hợp đồng mua bán với người mua/bán',
    requiredDocuments: ['sales_contract'],
    automationPossible: true,
    estimatedTime: '1-2 days'
  },
  {
    step: 2,
    name: 'Commercial Documentation',
    nameVi: 'Lập chứng từ thương mại',
    description: 'Prepare commercial invoice and packing list',
    descriptionVi: 'Lập hóa đơn thương mại và phiếu đóng gói',
    requiredDocuments: ['commercial_invoice', 'packing_list'],
    automationPossible: true,
    estimatedTime: '1 day'
  },
  {
    step: 3,
    name: 'Transport Arrangement',
    nameVi: 'Sắp xếp vận chuyển',
    description: 'Book shipping and obtain bill of lading',
    descriptionVi: 'Đặt chỗ vận chuyển và lấy vận đơn',
    requiredDocuments: ['bill_of_lading'],
    automationPossible: false,
    estimatedTime: '2-3 days'
  },
  {
    step: 4,
    name: 'Customs Declaration',
    nameVi: 'Khai báo hải quan',
    description: 'Submit customs declaration and supporting documents',
    descriptionVi: 'Nộp tờ khai hải quan và chứng từ hỗ trợ',
    requiredDocuments: ['customs_declaration', 'certificate_of_origin'],
    automationPossible: true,
    estimatedTime: '1-2 days'
  },
  {
    step: 5,
    name: 'Payment Processing',
    nameVi: 'Xử lý thanh toán',
    description: 'Process payment through L/C or other methods',
    descriptionVi: 'Xử lý thanh toán qua L/C hoặc phương thức khác',
    requiredDocuments: ['letter_of_credit'],
    automationPossible: false,
    estimatedTime: '3-5 days'
  }
]

// Automation opportunities
export const AUTOMATION_OPPORTUNITIES = [
  {
    process: 'Document Generation',
    processVi: 'Tạo chứng từ tự động',
    description: 'Auto-generate documents from contract data',
    descriptionVi: 'Tự động tạo chứng từ từ dữ liệu hợp đồng',
    priority: 'high' as const,
    estimatedSavings: '70% time reduction',
    estimatedSavingsVi: 'Giảm 70% thời gian',
    implementation: [
      'Create document templates',
      'Map contract data to document fields',
      'Implement validation rules',
      'Add digital signature integration'
    ],
    implementationVi: [
      'Tạo mẫu chứng từ',
      'Ánh xạ dữ liệu hợp đồng vào các trường chứng từ',
      'Triển khai quy tắc xác thực',
      'Tích hợp chữ ký số'
    ]
  },
  {
    process: 'Compliance Checking',
    processVi: 'Kiểm tra tuân thủ',
    description: 'Automated validation against Vietnamese regulations',
    descriptionVi: 'Tự động xác thực theo quy định Việt Nam',
    priority: 'high' as const,
    estimatedSavings: '80% error reduction',
    estimatedSavingsVi: 'Giảm 80% lỗi',
    implementation: [
      'Build regulatory database',
      'Implement validation rules',
      'Create alert system',
      'Add compliance reporting'
    ],
    implementationVi: [
      'Xây dựng cơ sở dữ liệu quy định',
      'Triển khai quy tắc xác thực',
      'Tạo hệ thống cảnh báo',
      'Thêm báo cáo tuân thủ'
    ]
  },
  {
    process: 'Workflow Automation',
    processVi: 'Tự động hóa quy trình',
    description: 'Automated workflow management and tracking',
    descriptionVi: 'Quản lý và theo dõi quy trình tự động',
    priority: 'medium' as const,
    estimatedSavings: '60% process time',
    estimatedSavingsVi: 'Giảm 60% thời gian quy trình',
    implementation: [
      'Design workflow engine',
      'Implement status tracking',
      'Add notification system',
      'Create progress dashboard'
    ],
    implementationVi: [
      'Thiết kế công cụ quy trình',
      'Triển khai theo dõi trạng thái',
      'Thêm hệ thống thông báo',
      'Tạo bảng điều khiển tiến độ'
    ]
  }
]
