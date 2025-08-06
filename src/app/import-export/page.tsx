'use client'

import React, { useState, useEffect } from 'react'
import AuthGuard from '@/components/AuthGuard'
import { useLanguage } from '@/contexts/LanguageContext'
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  Button,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Badge,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Textarea
} from '@/components/ui-components'
import { 
  FileText, 
  Download, 
  Upload,
  CheckCircle,
  AlertTriangle,
  Clock,
  Truck,
  Package,
  Globe,
  Shield,
  FileSpreadsheet,
  Printer,
  Eye,
  Plus,
  Trash2,
  Edit,
  Save,
  RefreshCw,
  Brain,
  Zap
} from 'lucide-react'
import { 
  generateVNACCSData,
  generateVNACCSPDFContent,
  generateVNACCSExcelData,
  validateVNACCSCompliance,
  generateDocumentSummary,
  DocumentType
} from '@/lib/vnaccsDocuments'

// Types for Import-Export operations
interface CustomsDocument {
  id: string
  type: 'commercial_invoice' | 'packing_list' | 'bill_of_lading' | 'certificate_of_origin' | 'chemical_declaration' | 'fumigation_request'
  status: 'draft' | 'ready' | 'submitted' | 'approved' | 'rejected'
  shipment_id: string
  created_at: string
  updated_at: string
  data: any
}

interface Shipment {
  id: string
  reference_number: string
  type: 'import' | 'export'
  status: 'preparing' | 'documents_ready' | 'submitted_vnaccs' | 'customs_cleared' | 'completed'
  company_info: {
    name: string
    tax_code: string
    address: string
    contact_person: string
    phone: string
    email: string
  }
  goods: Array<{
    id: string
    name: string
    hs_code: string
    quantity: number
    unit: string
    unit_price: number
    total_value: number
    origin_country: string
    description: string
  }>
  container_info: {
    container_number: string
    seal_number: string
    container_type: string
    gross_weight: number
    net_weight: number
  }
  transport_info: {
    vessel_name: string
    voyage_number: string
    port_of_loading: string
    port_of_discharge: string
    estimated_arrival: string
  }
  documents: CustomsDocument[]
  created_at: string
  updated_at: string
}

const ImportExportPage = () => {
  const { t } = useLanguage()
  const [shipments, setShipments] = useState<Shipment[]>([])
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null)
  const [activeTab, setActiveTab] = useState('shipments')
  const [isGenerating, setIsGenerating] = useState(false)
  const [showNewShipmentForm, setShowNewShipmentForm] = useState(false)

  // Initialize sample data
  useEffect(() => {
    initializeSampleData()
  }, [])

  const initializeSampleData = () => {
    const sampleShipments: Shipment[] = [
      {
        id: 'SHP001',
        reference_number: 'EXP-2025-001',
        type: 'export',
        status: 'preparing',
        company_info: {
          name: 'Vietnam Export Co., Ltd',
          tax_code: '0301234567',
          address: '123 Nguyen Hue St, District 1, Ho Chi Minh City',
          contact_person: 'Nguyen Van A',
          phone: '+84 28 1234 5678',
          email: 'export@vietnam-export.com'
        },
        goods: [
          {
            id: 'G001',
            name: 'Rice (Jasmine)',
            hs_code: '1006.30.21',
            quantity: 1000,
            unit: 'KG',
            unit_price: 25000,
            total_value: 25000000,
            origin_country: 'Vietnam',
            description: 'Premium Jasmine Rice, Grade A'
          },
          {
            id: 'G002',
            name: 'Coffee Beans (Robusta)',
            hs_code: '0901.21.00',
            quantity: 500,
            unit: 'KG',
            unit_price: 45000,
            total_value: 22500000,
            origin_country: 'Vietnam',
            description: 'Robusta Coffee Beans, Premium Quality'
          }
        ],
        container_info: {
          container_number: 'TEMU1234567',
          seal_number: 'SL789456',
          container_type: '20FT',
          gross_weight: 18500,
          net_weight: 1500
        },
        transport_info: {
          vessel_name: 'EVER GIVEN',
          voyage_number: 'EG2025001',
          port_of_loading: 'Ho Chi Minh Port',
          port_of_discharge: 'Long Beach Port',
          estimated_arrival: '2025-08-20T10:00:00'
        },
        documents: [],
        created_at: '2025-08-06T08:00:00',
        updated_at: '2025-08-06T08:00:00'
      }
    ]

    setShipments(sampleShipments)
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-slate-900 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">
                  {t('importExport.title')}
                </h1>
                <p className="text-slate-400">
                  {t('importExport.subtitle')}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <Button 
                  onClick={() => setShowNewShipmentForm(true)}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  New Shipment
                </Button>
                <Button 
                  onClick={() => window.location.reload()} 
                  variant="outline"
                  size="sm"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh
                </Button>
              </div>
            </div>
          </div>

          {/* Main Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 bg-slate-800">
              <TabsTrigger value="shipments" className="data-[state=active]:bg-blue-600">
                <Package className="w-4 h-4 mr-2" />
                Shipments
              </TabsTrigger>
              <TabsTrigger value="documents" className="data-[state=active]:bg-blue-600">
                <FileText className="w-4 h-4 mr-2" />
                Documents
              </TabsTrigger>
              <TabsTrigger value="vnaccs" className="data-[state=active]:bg-blue-600">
                <Globe className="w-4 h-4 mr-2" />
                VNACCS Integration
              </TabsTrigger>
              <TabsTrigger value="compliance" className="data-[state=active]:bg-blue-600">
                <Shield className="w-4 h-4 mr-2" />
                Compliance
              </TabsTrigger>
            </TabsList>

            {/* Shipments Tab */}
            <TabsContent value="shipments" className="space-y-6">
              <ShipmentsTab 
                shipments={shipments}
                setShipments={setShipments}
                selectedShipment={selectedShipment}
                setSelectedShipment={setSelectedShipment}
                showNewShipmentForm={showNewShipmentForm}
                setShowNewShipmentForm={setShowNewShipmentForm}
              />
            </TabsContent>

            {/* Documents Tab */}
            <TabsContent value="documents" className="space-y-6">
              <DocumentsTab 
                selectedShipment={selectedShipment}
                isGenerating={isGenerating}
                setIsGenerating={setIsGenerating}
              />
            </TabsContent>

            {/* VNACCS Integration Tab */}
            <TabsContent value="vnaccs" className="space-y-6">
              <VNACCSTab selectedShipment={selectedShipment} />
            </TabsContent>

            {/* Compliance Tab */}
            <TabsContent value="compliance" className="space-y-6">
              <ComplianceTab selectedShipment={selectedShipment} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AuthGuard>
  )
}

// Shipments Tab Component
const ShipmentsTab = ({ 
  shipments, 
  setShipments, 
  selectedShipment, 
  setSelectedShipment,
  showNewShipmentForm,
  setShowNewShipmentForm
}: {
  shipments: Shipment[]
  setShipments: (shipments: Shipment[]) => void
  selectedShipment: Shipment | null
  setSelectedShipment: (shipment: Shipment | null) => void
  showNewShipmentForm: boolean
  setShowNewShipmentForm: (show: boolean) => void
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'preparing': return 'bg-orange-100 text-orange-800'
      case 'documents_ready': return 'bg-blue-100 text-blue-800'
      case 'submitted_vnaccs': return 'bg-purple-100 text-purple-800'
      case 'customs_cleared': return 'bg-green-100 text-green-800'
      case 'completed': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeColor = (type: string) => {
    return type === 'export' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
  }

  return (
    <div className="space-y-6">
      {/* Shipments Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Package className="w-8 h-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{shipments.length}</p>
                <p className="text-sm text-slate-600">Total Shipments</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Clock className="w-8 h-8 text-orange-600" />
              <div>
                <p className="text-2xl font-bold">
                  {shipments.filter(s => s.status === 'preparing').length}
                </p>
                <p className="text-sm text-slate-600">Preparing</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <FileText className="w-8 h-8 text-purple-600" />
              <div>
                <p className="text-2xl font-bold">
                  {shipments.filter(s => s.status === 'documents_ready').length}
                </p>
                <p className="text-sm text-slate-600">Documents Ready</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-8 h-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold">
                  {shipments.filter(s => s.status === 'customs_cleared').length}
                </p>
                <p className="text-sm text-slate-600">Cleared</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Shipments List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            Active Shipments
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {shipments.map((shipment) => (
              <div 
                key={shipment.id} 
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  selectedShipment?.id === shipment.id ? 'bg-blue-50 border-blue-200' : 'hover:bg-slate-50'
                }`}
                onClick={() => setSelectedShipment(shipment)}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="font-medium text-lg">{shipment.reference_number}</div>
                    <Badge className={getTypeColor(shipment.type)}>
                      {shipment.type.toUpperCase()}
                    </Badge>
                    <Badge className={getStatusColor(shipment.status)}>
                      {shipment.status.replace('_', ' ').toUpperCase()}
                    </Badge>
                  </div>
                  <div className="text-sm text-slate-600">
                    {new Date(shipment.created_at).toLocaleDateString()}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <div className="font-medium text-slate-700">Company</div>
                    <div className="text-slate-600">{shipment.company_info.name}</div>
                  </div>
                  <div>
                    <div className="font-medium text-slate-700">Goods</div>
                    <div className="text-slate-600">{shipment.goods.length} items</div>
                  </div>
                  <div>
                    <div className="font-medium text-slate-700">Container</div>
                    <div className="text-slate-600">{shipment.container_info.container_number}</div>
                  </div>
                </div>
              </div>
            ))}
            
            {shipments.length === 0 && (
              <div className="text-center py-8 text-slate-500">
                <Package className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No shipments found</p>
                <Button 
                  onClick={() => setShowNewShipmentForm(true)}
                  className="mt-3"
                  variant="outline"
                >
                  Create First Shipment
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Selected Shipment Details */}
      {selectedShipment && (
        <Card>
          <CardHeader>
            <CardTitle>Shipment Details - {selectedShipment.reference_number}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-3">Company Information</h4>
                <div className="space-y-2 text-sm">
                  <div><span className="font-medium">Name:</span> {selectedShipment.company_info.name}</div>
                  <div><span className="font-medium">Tax Code:</span> {selectedShipment.company_info.tax_code}</div>
                  <div><span className="font-medium">Address:</span> {selectedShipment.company_info.address}</div>
                  <div><span className="font-medium">Contact:</span> {selectedShipment.company_info.contact_person}</div>
                  <div><span className="font-medium">Phone:</span> {selectedShipment.company_info.phone}</div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-3">Transport Information</h4>
                <div className="space-y-2 text-sm">
                  <div><span className="font-medium">Vessel:</span> {selectedShipment.transport_info.vessel_name}</div>
                  <div><span className="font-medium">Voyage:</span> {selectedShipment.transport_info.voyage_number}</div>
                  <div><span className="font-medium">From:</span> {selectedShipment.transport_info.port_of_loading}</div>
                  <div><span className="font-medium">To:</span> {selectedShipment.transport_info.port_of_discharge}</div>
                  <div><span className="font-medium">ETA:</span> {new Date(selectedShipment.transport_info.estimated_arrival).toLocaleString()}</div>
                </div>
              </div>
            </div>
            
            <div className="mt-6">
              <h4 className="font-medium mb-3">Goods ({selectedShipment.goods.length} items)</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-slate-50">
                      <th className="text-left p-2">Name</th>
                      <th className="text-left p-2">HS Code</th>
                      <th className="text-left p-2">Quantity</th>
                      <th className="text-left p-2">Unit Price</th>
                      <th className="text-left p-2">Total Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedShipment.goods.map((good) => (
                      <tr key={good.id} className="border-b">
                        <td className="p-2">{good.name}</td>
                        <td className="p-2 font-mono">{good.hs_code}</td>
                        <td className="p-2">{good.quantity.toLocaleString()} {good.unit}</td>
                        <td className="p-2">{good.unit_price.toLocaleString()} VND</td>
                        <td className="p-2 font-medium">{good.total_value.toLocaleString()} VND</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

// Documents Tab Component
const DocumentsTab = ({ 
  selectedShipment, 
  isGenerating, 
  setIsGenerating 
}: {
  selectedShipment: Shipment | null
  isGenerating: boolean
  setIsGenerating: (generating: boolean) => void
}) => {
  const [generatedDocuments, setGeneratedDocuments] = useState<any[]>([])
  const [validationResult, setValidationResult] = useState<any>(null)

  useEffect(() => {
    if (selectedShipment) {
      const validation = validateVNACCSCompliance(selectedShipment)
      setValidationResult(validation)
    }
  }, [selectedShipment])

  const generateDocument = async (type: DocumentType) => {
    if (!selectedShipment) return

    setIsGenerating(true)
    try {
      // Simulate document generation
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const vnaccsData = generateVNACCSData(selectedShipment)
      const pdfContent = generateVNACCSPDFContent(selectedShipment)
      const excelData = generateVNACCSExcelData(selectedShipment)
      
      const newDocument = {
        id: `DOC_${Date.now()}`,
        type,
        shipment_id: selectedShipment.id,
        status: 'ready',
        generated_at: new Date().toISOString(),
        pdf_content: pdfContent,
        excel_data: excelData,
        vnaccs_data: vnaccsData
      }
      
      setGeneratedDocuments(prev => [...prev, newDocument])
    } catch (error) {
      console.error('Document generation error:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const downloadPDF = (document: any) => {
    const blob = new Blob([document.pdf_content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${document.type}_${selectedShipment?.reference_number}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const downloadExcel = (document: any) => {
    // Simulate Excel download
    const csvContent = Object.entries(document.excel_data)
      .map(([sheetName, data]: [string, any]) => {
        return `=== ${sheetName.toUpperCase()} ===\n` + 
               data.map((row: any[]) => row.join('\t')).join('\n')
      }).join('\n\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${document.type}_${selectedShipment?.reference_number}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  if (!selectedShipment) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Document Generation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-slate-400">
            <Package className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p>Please select a shipment to generate documents</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const documentTypes: { type: DocumentType; name: string; description: string; required: boolean }[] = [
    { type: 'commercial_invoice', name: 'Commercial Invoice', description: 'Invoice for customs valuation', required: true },
    { type: 'packing_list', name: 'Packing List', description: 'Detailed packing information', required: true },
    { type: 'bill_of_lading', name: 'Bill of Lading', description: 'Transport document', required: true },
    { type: 'certificate_of_origin', name: 'Certificate of Origin', description: 'Origin certification', required: false },
    { type: 'chemical_declaration', name: 'Chemical Declaration', description: 'For chemical products', required: false },
    { type: 'fumigation_request', name: 'Fumigation Request', description: 'For agricultural products', required: false }
  ]

  return (
    <div className="space-y-6">
      {/* Validation Status */}
      {validationResult && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              VNACCS Compliance Check
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                {validationResult.isValid ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                )}
                <span className={`font-medium ${validationResult.isValid ? 'text-green-700' : 'text-red-700'}`}>
                  {validationResult.isValid ? 'Ready for VNACCS submission' : 'Issues found - please fix before submission'}
                </span>
              </div>
              
              {validationResult.errors.length > 0 && (
                <div>
                  <h4 className="font-medium text-red-700 mb-2">Errors (must fix):</h4>
                  <ul className="space-y-1">
                    {validationResult.errors.map((error: string, index: number) => (
                      <li key={index} className="text-sm text-red-600 flex items-start gap-2">
                        <AlertTriangle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                        {error}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {validationResult.warnings.length > 0 && (
                <div>
                  <h4 className="font-medium text-yellow-700 mb-2">Warnings (recommended to fix):</h4>
                  <ul className="space-y-1">
                    {validationResult.warnings.map((warning: string, index: number) => (
                      <li key={index} className="text-sm text-yellow-600 flex items-start gap-2">
                        <AlertTriangle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                        {warning}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Document Generation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Generate VNACCS Documents
          </CardTitle>
          <CardDescription>
            Generate PDF and Excel documents for manual input into VNACCS/E-CUS system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {documentTypes.map((docType) => {
              const isGenerated = generatedDocuments.some(doc => doc.type === docType.type)
              
              return (
                <div key={docType.type} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      <span className="font-medium">{docType.name}</span>
                    </div>
                    {docType.required && (
                      <Badge variant="outline" className="text-xs">Required</Badge>
                    )}
                  </div>
                  
                  <p className="text-sm text-slate-600 mb-3">{docType.description}</p>
                  
                  <div className="space-y-2">
                    <Button
                      onClick={() => generateDocument(docType.type)}
                      disabled={isGenerating || (validationResult && !validationResult.isValid)}
                      className="w-full"
                      size="sm"
                    >
                      {isGenerating ? (
                        <>
                          <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-2"></div>
                          Generating...
                        </>
                      ) : isGenerated ? (
                        <>
                          <CheckCircle className="w-3 h-3 mr-2" />
                          Regenerate
                        </>
                      ) : (
                        <>
                          <Zap className="w-3 h-3 mr-2" />
                          Generate
                        </>
                      )}
                    </Button>
                    
                    {isGenerated && (
                      <div className="flex gap-1">
                        <Button
                          onClick={() => {
                            const doc = generatedDocuments.find(d => d.type === docType.type)
                            if (doc) downloadPDF(doc)
                          }}
                          variant="outline"
                          size="sm"
                          className="flex-1"
                        >
                          <Download className="w-3 h-3 mr-1" />
                          PDF
                        </Button>
                        <Button
                          onClick={() => {
                            const doc = generatedDocuments.find(d => d.type === docType.type)
                            if (doc) downloadExcel(doc)
                          }}
                          variant="outline"
                          size="sm"
                          className="flex-1"
                        >
                          <FileSpreadsheet className="w-3 h-3 mr-1" />
                          Excel
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Generated Documents List */}
      {generatedDocuments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              Generated Documents ({generatedDocuments.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {generatedDocuments.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between p-3 border rounded-lg bg-green-50">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <div>
                      <div className="font-medium">{doc.type.replace('_', ' ').toUpperCase()}</div>
                      <div className="text-sm text-slate-600">
                        Generated: {new Date(doc.generated_at).toLocaleString()}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      onClick={() => downloadPDF(doc)}
                      variant="outline"
                      size="sm"
                    >
                      <Download className="w-3 h-3 mr-1" />
                      PDF
                    </Button>
                    <Button
                      onClick={() => downloadExcel(doc)}
                      variant="outline"
                      size="sm"
                    >
                      <FileSpreadsheet className="w-3 h-3 mr-1" />
                      Excel
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Shipment Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="w-5 h-5" />
            Shipment Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="text-sm bg-slate-50 p-4 rounded-lg overflow-x-auto whitespace-pre-wrap">
            {generateDocumentSummary(selectedShipment)}
          </pre>
        </CardContent>
      </Card>
    </div>
  )
}

const VNACCSTab = ({ selectedShipment }: { selectedShipment: Shipment | null }) => {
  const [vnaccsData, setVnaccsData] = useState<any>(null)
  const [copyStatus, setCopyStatus] = useState<{ [key: string]: boolean }>({})

  useEffect(() => {
    if (selectedShipment) {
      const data = generateVNACCSData(selectedShipment)
      setVnaccsData(data)
    }
  }, [selectedShipment])

  const copyToClipboard = async (text: string, section: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopyStatus(prev => ({ ...prev, [section]: true }))
      setTimeout(() => {
        setCopyStatus(prev => ({ ...prev, [section]: false }))
      }, 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  if (!selectedShipment || !vnaccsData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5" />
            VNACCS Integration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-slate-400">
            <Package className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p>Please select a shipment to view VNACCS data</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const CopyButton = ({ text, section }: { text: string; section: string }) => (
    <Button
      onClick={() => copyToClipboard(text, section)}
      variant="outline"
      size="sm"
      className="ml-2"
    >
      {copyStatus[section] ? (
        <>
          <CheckCircle className="w-3 h-3 mr-1" />
          Copied!
        </>
      ) : (
        <>
          <FileText className="w-3 h-3 mr-1" />
          Copy
        </>
      )}
    </Button>
  )

  return (
    <div className="space-y-6">
      {/* VNACCS Integration Guide */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5" />
            VNACCS/E-CUS Integration Guide
          </CardTitle>
          <CardDescription>
            Copy data sections below and paste into corresponding VNACCS tabs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-800 mb-2">How to use:</h4>
            <ol className="text-sm text-blue-700 space-y-1">
              <li>1. Login to VNACCS/E-CUS system</li>
              <li>2. Create new customs declaration</li>
              <li>3. Copy each section below to the corresponding tab in VNACCS</li>
              <li>4. Verify all information before submission</li>
              <li>5. Submit declaration and track status</li>
            </ol>
          </div>
        </CardContent>
      </Card>

      {/* Tab: Thông tin chung */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              TAB: Thông tin chung (General Information)
            </span>
            <CopyButton 
              text={Object.entries(vnaccsData.thong_tin_chung)
                .map(([key, value]) => `${key}: ${value}`)
                .join('\n')}
              section="general"
            />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(vnaccsData.thong_tin_chung).map(([key, value]) => (
              <div key={key} className="flex justify-between p-2 bg-slate-50 rounded">
                <span className="font-medium">{key}:</span>
                <span className="text-slate-700">{value as string}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tab: Danh sách hàng */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Package className="w-5 h-5" />
              TAB: Danh sách hàng (Goods List)
            </span>
            <CopyButton 
              text={vnaccsData.danh_sach_hang
                .map((item: any) => 
                  `${item.stt}. ${item.ten_hang} | HS: ${item.ma_hs} | ${item.so_luong} ${item.don_vi} | ${item.don_gia.toLocaleString()} VND | ${item.thanh_tien.toLocaleString()} VND | ${item.xuat_xu}`
                )
                .join('\n')}
              section="goods"
            />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-slate-50">
                  <th className="text-left p-2">STT</th>
                  <th className="text-left p-2">Tên hàng</th>
                  <th className="text-left p-2">Mã HS</th>
                  <th className="text-left p-2">Số lượng</th>
                  <th className="text-left p-2">Đơn vị</th>
                  <th className="text-left p-2">Đơn giá</th>
                  <th className="text-left p-2">Thành tiền</th>
                  <th className="text-left p-2">Xuất xứ</th>
                </tr>
              </thead>
              <tbody>
                {vnaccsData.danh_sach_hang.map((item: any) => (
                  <tr key={item.stt} className="border-b">
                    <td className="p-2">{item.stt}</td>
                    <td className="p-2">{item.ten_hang}</td>
                    <td className="p-2 font-mono">{item.ma_hs}</td>
                    <td className="p-2">{item.so_luong.toLocaleString()}</td>
                    <td className="p-2">{item.don_vi}</td>
                    <td className="p-2">{item.don_gia.toLocaleString()} VND</td>
                    <td className="p-2 font-medium">{item.thanh_tien.toLocaleString()} VND</td>
                    <td className="p-2">{item.xuat_xu}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Tab: Vận đơn */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Truck className="w-5 h-5" />
              TAB: Vận đơn (Transport Document)
            </span>
            <CopyButton 
              text={Object.entries(vnaccsData.van_don)
                .map(([key, value]) => `${key}: ${value}`)
                .join('\n')}
              section="transport"
            />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(vnaccsData.van_don).map(([key, value]) => (
              <div key={key} className="flex justify-between p-2 bg-slate-50 rounded">
                <span className="font-medium">{key}:</span>
                <span className="text-slate-700">
                  {key === 'ngay_den_du_kien' 
                    ? new Date(value as string).toLocaleDateString('vi-VN')
                    : value as string
                  }
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tab: Container */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Package className="w-5 h-5" />
              TAB: Container
            </span>
            <CopyButton 
              text={Object.entries(vnaccsData.container)
                .map(([key, value]) => `${key}: ${value}`)
                .join('\n')}
              section="container"
            />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(vnaccsData.container).map(([key, value]) => (
              <div key={key} className="flex justify-between p-2 bg-slate-50 rounded">
                <span className="font-medium">{key}:</span>
                <span className="text-slate-700">
                  {typeof value === 'number' && (key.includes('trong_luong'))
                    ? `${(value as number).toLocaleString()} kg`
                    : value as string
                  }
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              onClick={() => {
                const fullData = generateVNACCSPDFContent(selectedShipment)
                copyToClipboard(fullData, 'full')
              }}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <FileText className="w-4 h-4 mr-2" />
              Copy All Data
            </Button>
            
            <Button
              onClick={() => {
                const summary = generateDocumentSummary(selectedShipment)
                copyToClipboard(summary, 'summary')
              }}
              variant="outline"
            >
              <Eye className="w-4 h-4 mr-2" />
              Copy Summary
            </Button>
            
            <Button
              onClick={() => {
                window.open('https://vnaccs.gov.vn', '_blank')
              }}
              variant="outline"
            >
              <Globe className="w-4 h-4 mr-2" />
              Open VNACCS
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Status Tracking */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Submission Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span>Documents prepared</span>
              <Badge className="bg-green-100 text-green-800">Completed</Badge>
            </div>
            
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-orange-600" />
              <span>VNACCS submission</span>
              <Badge className="bg-orange-100 text-orange-800">Pending</Badge>
            </div>
            
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-gray-400" />
              <span>Customs clearance</span>
              <Badge variant="outline">Waiting</Badge>
            </div>
            
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-gray-400" />
              <span>Release notification</span>
              <Badge variant="outline">Waiting</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

const ComplianceTab = ({ selectedShipment }: any) => (
  <Card>
    <CardHeader>
      <CardTitle>Compliance Check</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="text-center py-8 text-slate-400">
        <Shield className="w-16 h-16 mx-auto mb-4 opacity-50" />
        <p>Compliance checking features will be implemented next</p>
      </div>
    </CardContent>
  </Card>
)

export default ImportExportPage
