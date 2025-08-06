// VNACCS Document Generation System
// Generates PDF and Excel documents for Vietnam Customs (VNACCS/E-CUS) integration

export interface VNACCSDocument {
  id: string
  type: DocumentType
  shipment_id: string
  status: 'draft' | 'ready' | 'submitted' | 'approved'
  data: any
  generated_at: string
  pdf_url?: string
  excel_url?: string
}

export type DocumentType = 
  | 'commercial_invoice'
  | 'packing_list' 
  | 'bill_of_lading'
  | 'certificate_of_origin'
  | 'chemical_declaration'
  | 'fumigation_request'
  | 'import_permit'
  | 'export_permit'

export interface CommercialInvoiceData {
  // Thông tin chung (General Information)
  invoice_number: string
  invoice_date: string
  seller: {
    name: string
    address: string
    tax_code: string
    phone: string
    email: string
  }
  buyer: {
    name: string
    address: string
    tax_code: string
    phone: string
    email: string
  }
  
  // Danh sách hàng (Goods List)
  goods: Array<{
    item_number: number
    description: string
    hs_code: string
    quantity: number
    unit: string
    unit_price: number
    total_amount: number
    origin_country: string
  }>
  
  // Thông tin vận chuyển (Transport Information)
  transport: {
    terms_of_delivery: string // FOB, CIF, etc.
    port_of_loading: string
    port_of_discharge: string
    vessel_name: string
    voyage_number: string
    container_number: string
  }
  
  // Tổng cộng (Totals)
  subtotal: number
  tax_amount: number
  total_amount: number
  currency: string
  
  // Chữ ký (Signatures)
  authorized_signature: {
    name: string
    position: string
    date: string
  }
}

export interface PackingListData {
  // Thông tin chung
  packing_list_number: string
  date: string
  shipper: {
    name: string
    address: string
  }
  consignee: {
    name: string
    address: string
  }
  
  // Container information
  container_info: {
    container_number: string
    seal_number: string
    container_type: string
    gross_weight: number
    net_weight: number
    measurement: number
  }
  
  // Packing details
  packages: Array<{
    package_number: number
    description: string
    quantity: number
    gross_weight: number
    net_weight: number
    dimensions: {
      length: number
      width: number
      height: number
    }
  }>
  
  // Totals
  total_packages: number
  total_gross_weight: number
  total_net_weight: number
  total_measurement: number
}

export interface BillOfLadingData {
  // B/L Information
  bl_number: string
  bl_date: string
  bl_type: 'original' | 'copy'
  
  // Parties
  shipper: {
    name: string
    address: string
  }
  consignee: {
    name: string
    address: string
  }
  notify_party: {
    name: string
    address: string
  }
  
  // Vessel & Voyage
  vessel_name: string
  voyage_number: string
  port_of_loading: string
  port_of_discharge: string
  place_of_delivery: string
  
  // Cargo details
  cargo: {
    description: string
    marks_and_numbers: string
    number_of_packages: number
    gross_weight: number
    measurement: number
  }
  
  // Freight
  freight_payable_at: string
  freight_amount: number
  freight_currency: string
  
  // Clauses
  clauses: string[]
}

// VNACCS Field Mapping
export const VNACCS_FIELD_MAPPING = {
  // Tab: Thông tin chung (General Information)
  general_info: {
    company_tax_code: 'company_info.tax_code',
    company_name: 'company_info.name',
    company_address: 'company_info.address',
    contact_person: 'company_info.contact_person',
    phone: 'company_info.phone',
    email: 'company_info.email',
    declaration_date: 'created_at',
    customs_office: 'customs_office_code'
  },
  
  // Tab: Danh sách hàng (Goods List)
  goods_list: {
    item_sequence: 'goods[].id',
    commodity_name: 'goods[].name',
    hs_code: 'goods[].hs_code',
    quantity: 'goods[].quantity',
    unit: 'goods[].unit',
    unit_price: 'goods[].unit_price',
    total_value: 'goods[].total_value',
    origin_country: 'goods[].origin_country',
    description: 'goods[].description'
  },
  
  // Tab: Vận đơn (Transport Document)
  transport_document: {
    bl_number: 'transport_info.bl_number',
    vessel_name: 'transport_info.vessel_name',
    voyage_number: 'transport_info.voyage_number',
    port_of_loading: 'transport_info.port_of_loading',
    port_of_discharge: 'transport_info.port_of_discharge',
    estimated_arrival: 'transport_info.estimated_arrival'
  },
  
  // Tab: Container
  container: {
    container_number: 'container_info.container_number',
    seal_number: 'container_info.seal_number',
    container_type: 'container_info.container_type',
    gross_weight: 'container_info.gross_weight',
    net_weight: 'container_info.net_weight'
  }
}

// Document Templates
export const DOCUMENT_TEMPLATES = {
  commercial_invoice: {
    title: 'COMMERCIAL INVOICE',
    sections: [
      'general_information',
      'seller_buyer_details', 
      'goods_description',
      'transport_terms',
      'payment_terms',
      'totals',
      'signatures'
    ]
  },
  
  packing_list: {
    title: 'PACKING LIST',
    sections: [
      'general_information',
      'shipper_consignee',
      'container_details',
      'package_breakdown',
      'weight_measurement_summary'
    ]
  },
  
  bill_of_lading: {
    title: 'BILL OF LADING',
    sections: [
      'bl_header',
      'parties_information',
      'vessel_voyage_details',
      'cargo_description',
      'freight_charges',
      'terms_conditions'
    ]
  }
}

// Generate VNACCS-compatible data structure
export function generateVNACCSData(shipment: any): any {
  return {
    // Thông tin chung
    thong_tin_chung: {
      ma_doanh_nghiep: shipment.company_info.tax_code,
      ten_doanh_nghiep: shipment.company_info.name,
      dia_chi: shipment.company_info.address,
      nguoi_lien_he: shipment.company_info.contact_person,
      dien_thoai: shipment.company_info.phone,
      email: shipment.company_info.email,
      ngay_khai_bao: new Date().toISOString().split('T')[0],
      cua_khau: 'VNHCM' // Ho Chi Minh Port
    },
    
    // Danh sách hàng
    danh_sach_hang: shipment.goods.map((good: any, index: number) => ({
      stt: index + 1,
      ten_hang: good.name,
      ma_hs: good.hs_code,
      so_luong: good.quantity,
      don_vi: good.unit,
      don_gia: good.unit_price,
      thanh_tien: good.total_value,
      xuat_xu: good.origin_country,
      mo_ta: good.description
    })),
    
    // Vận đơn
    van_don: {
      so_van_don: shipment.transport_info.bl_number || 'BL' + Date.now(),
      ten_tau: shipment.transport_info.vessel_name,
      chuyen_tau: shipment.transport_info.voyage_number,
      cang_xuat: shipment.transport_info.port_of_loading,
      cang_den: shipment.transport_info.port_of_discharge,
      ngay_den_du_kien: shipment.transport_info.estimated_arrival
    },
    
    // Container
    container: {
      so_container: shipment.container_info.container_number,
      so_seal: shipment.container_info.seal_number,
      loai_container: shipment.container_info.container_type,
      trong_luong_tong: shipment.container_info.gross_weight,
      trong_luong_rong: shipment.container_info.net_weight
    }
  }
}

// Generate PDF content for manual input
export function generateVNACCSPDFContent(shipment: any): string {
  const vnaccsData = generateVNACCSData(shipment)
  
  return `
=== VNACCS/E-CUS DATA ENTRY GUIDE ===
Shipment: ${shipment.reference_number}
Generated: ${new Date().toLocaleString('vi-VN')}

=== TAB: THÔNG TIN CHUNG ===
Mã doanh nghiệp: ${vnaccsData.thong_tin_chung.ma_doanh_nghiep}
Tên doanh nghiệp: ${vnaccsData.thong_tin_chung.ten_doanh_nghiep}
Địa chỉ: ${vnaccsData.thong_tin_chung.dia_chi}
Người liên hệ: ${vnaccsData.thong_tin_chung.nguoi_lien_he}
Điện thoại: ${vnaccsData.thong_tin_chung.dien_thoai}
Email: ${vnaccsData.thong_tin_chung.email}
Ngày khai báo: ${vnaccsData.thong_tin_chung.ngay_khai_bao}
Cửa khẩu: ${vnaccsData.thong_tin_chung.cua_khau}

=== TAB: DANH SÁCH HÀNG ===
${vnaccsData.danh_sach_hang.map((item: any) => `
${item.stt}. ${item.ten_hang}
   - Mã HS: ${item.ma_hs}
   - Số lượng: ${item.so_luong.toLocaleString()} ${item.don_vi}
   - Đơn giá: ${item.don_gia.toLocaleString()} VND
   - Thành tiền: ${item.thanh_tien.toLocaleString()} VND
   - Xuất xứ: ${item.xuat_xu}
   - Mô tả: ${item.mo_ta}
`).join('')}

=== TAB: VẬN ĐƠN ===
Số vận đơn: ${vnaccsData.van_don.so_van_don}
Tên tàu: ${vnaccsData.van_don.ten_tau}
Chuyến tàu: ${vnaccsData.van_don.chuyen_tau}
Cảng xuất: ${vnaccsData.van_don.cang_xuat}
Cảng đến: ${vnaccsData.van_don.cang_den}
Ngày đến dự kiến: ${new Date(vnaccsData.van_don.ngay_den_du_kien).toLocaleDateString('vi-VN')}

=== TAB: CONTAINER ===
Số container: ${vnaccsData.container.so_container}
Số seal: ${vnaccsData.container.so_seal}
Loại container: ${vnaccsData.container.loai_container}
Trọng lượng tổng: ${vnaccsData.container.trong_luong_tong.toLocaleString()} kg
Trọng lượng ròng: ${vnaccsData.container.trong_luong_rong.toLocaleString()} kg

=== HƯỚNG DẪN SỬ DỤNG ===
1. Đăng nhập vào hệ thống VNACCS/E-CUS
2. Tạo tờ khai mới
3. Copy từng phần dữ liệu vào đúng tab tương ứng
4. Kiểm tra và xác nhận thông tin
5. Nộp tờ khai

=== GHI CHÚ ===
- Tất cả thông tin đã được định dạng theo chuẩn VNACCS
- Kiểm tra lại mã HS code trước khi nộp
- Đảm bảo tài liệu đính kèm đầy đủ
- Liên hệ bộ phận hải quan nếu có thắc mắc

Generated by LogiAI Import-Export Center
`
}

// Generate Excel data for VNACCS import
export function generateVNACCSExcelData(shipment: any): any {
  const vnaccsData = generateVNACCSData(shipment)
  
  return {
    // Sheet 1: General Information
    general_info: [
      ['Field', 'Value'],
      ['Mã doanh nghiệp', vnaccsData.thong_tin_chung.ma_doanh_nghiep],
      ['Tên doanh nghiệp', vnaccsData.thong_tin_chung.ten_doanh_nghiep],
      ['Địa chỉ', vnaccsData.thong_tin_chung.dia_chi],
      ['Người liên hệ', vnaccsData.thong_tin_chung.nguoi_lien_he],
      ['Điện thoại', vnaccsData.thong_tin_chung.dien_thoai],
      ['Email', vnaccsData.thong_tin_chung.email],
      ['Ngày khai báo', vnaccsData.thong_tin_chung.ngay_khai_bao],
      ['Cửa khẩu', vnaccsData.thong_tin_chung.cua_khau]
    ],
    
    // Sheet 2: Goods List
    goods_list: [
      ['STT', 'Tên hàng', 'Mã HS', 'Số lượng', 'Đơn vị', 'Đơn giá', 'Thành tiền', 'Xuất xứ', 'Mô tả'],
      ...vnaccsData.danh_sach_hang.map((item: any) => [
        item.stt,
        item.ten_hang,
        item.ma_hs,
        item.so_luong,
        item.don_vi,
        item.don_gia,
        item.thanh_tien,
        item.xuat_xu,
        item.mo_ta
      ])
    ],
    
    // Sheet 3: Transport Document
    transport_doc: [
      ['Field', 'Value'],
      ['Số vận đơn', vnaccsData.van_don.so_van_don],
      ['Tên tàu', vnaccsData.van_don.ten_tau],
      ['Chuyến tàu', vnaccsData.van_don.chuyen_tau],
      ['Cảng xuất', vnaccsData.van_don.cang_xuat],
      ['Cảng đến', vnaccsData.van_don.cang_den],
      ['Ngày đến dự kiến', vnaccsData.van_don.ngay_den_du_kien]
    ],
    
    // Sheet 4: Container
    container_info: [
      ['Field', 'Value'],
      ['Số container', vnaccsData.container.so_container],
      ['Số seal', vnaccsData.container.so_seal],
      ['Loại container', vnaccsData.container.loai_container],
      ['Trọng lượng tổng (kg)', vnaccsData.container.trong_luong_tong],
      ['Trọng lượng ròng (kg)', vnaccsData.container.trong_luong_rong]
    ]
  }
}

// Validate shipment data for VNACCS compliance
export function validateVNACCSCompliance(shipment: any): {
  isValid: boolean
  errors: string[]
  warnings: string[]
} {
  const errors: string[] = []
  const warnings: string[] = []
  
  // Required fields validation
  if (!shipment.company_info.tax_code) {
    errors.push('Mã số thuế doanh nghiệp là bắt buộc')
  }
  
  if (!shipment.company_info.name) {
    errors.push('Tên doanh nghiệp là bắt buộc')
  }
  
  if (!shipment.goods || shipment.goods.length === 0) {
    errors.push('Phải có ít nhất một mặt hàng')
  }
  
  // Validate goods
  shipment.goods?.forEach((good: any, index: number) => {
    if (!good.hs_code) {
      errors.push(`Mặt hàng ${index + 1}: Thiếu mã HS`)
    } else if (!/^\d{4}\.\d{2}\.\d{2}$/.test(good.hs_code)) {
      warnings.push(`Mặt hàng ${index + 1}: Mã HS không đúng định dạng (xxxx.xx.xx)`)
    }
    
    if (!good.quantity || good.quantity <= 0) {
      errors.push(`Mặt hàng ${index + 1}: Số lượng phải lớn hơn 0`)
    }
    
    if (!good.unit_price || good.unit_price <= 0) {
      errors.push(`Mặt hàng ${index + 1}: Đơn giá phải lớn hơn 0`)
    }
  })
  
  // Container validation
  if (!shipment.container_info.container_number) {
    errors.push('Số container là bắt buộc')
  }
  
  // Transport validation
  if (!shipment.transport_info.vessel_name) {
    warnings.push('Tên tàu chưa được cung cấp')
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings
  }
}

// Generate document summary for staff
export function generateDocumentSummary(shipment: any): string {
  const totalValue = shipment.goods.reduce((sum: number, good: any) => sum + good.total_value, 0)
  const totalWeight = shipment.container_info.gross_weight
  
  return `
SHIPMENT SUMMARY: ${shipment.reference_number}
=====================================
Company: ${shipment.company_info.name}
Tax Code: ${shipment.company_info.tax_code}
Type: ${shipment.type.toUpperCase()}
Status: ${shipment.status.replace('_', ' ').toUpperCase()}

GOODS OVERVIEW:
- Total Items: ${shipment.goods.length}
- Total Value: ${totalValue.toLocaleString()} VND
- Total Weight: ${totalWeight.toLocaleString()} kg

CONTAINER: ${shipment.container_info.container_number}
VESSEL: ${shipment.transport_info.vessel_name}
ROUTE: ${shipment.transport_info.port_of_loading} → ${shipment.transport_info.port_of_discharge}

DOCUMENTS REQUIRED:
✓ Commercial Invoice
✓ Packing List  
✓ Bill of Lading
✓ Certificate of Origin
${shipment.goods.some((g: any) => g.hs_code.startsWith('28') || g.hs_code.startsWith('29')) ? '✓ Chemical Declaration' : ''}

NEXT STEPS:
1. Generate VNACCS PDF
2. Review and validate data
3. Submit to VNACCS/E-CUS
4. Track customs clearance status
`
}
