'use client'

import React, { useState, useEffect } from 'react'
import AuthGuard from '@/components/AuthGuard'
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  Button,
  Input,
  Label,
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
  Zap,
  Activity
} from 'lucide-react'

// Generate realistic import-export data
const generateImportExportData = () => {
  const shipments = [
    {
      id: 'IMP-2025-001',
      reference: 'VN-IMP-240801-001',
      type: 'import',
      status: 'customs_cleared',
      company: 'Công ty TNHH ABC Import',
      goods: 'Electronic Components',
      container: 'MSKU-1234567',
      value: 125000,
      origin: 'China',
      destination: 'TP.HCM',
      created_at: '2025-01-15',
      customs_code: 'VNACCS-IMP-001',
      documents: ['Commercial Invoice', 'Packing List', 'Bill of Lading', 'Certificate of Origin']
    },
    {
      id: 'EXP-2025-002',
      reference: 'VN-EXP-240802-002',
      type: 'export',
      status: 'submitted_vnaccs',
      company: 'Công ty CP XYZ Export',
      goods: 'Coffee Beans',
      container: 'TCLU-9876543',
      value: 89000,
      origin: 'Đắk Lắk',
      destination: 'Germany',
      created_at: '2025-01-20',
      customs_code: 'VNACCS-EXP-002',
      documents: ['Commercial Invoice', 'Packing List', 'Phytosanitary Certificate', 'Certificate of Origin']
    },
    {
      id: 'IMP-2025-003',
      reference: 'VN-IMP-240803-003',
      type: 'import',
      status: 'preparing',
      company: 'Công ty TNHH DEF Trading',
      goods: 'Textile Materials',
      container: 'HLBU-5555555',
      value: 67000,
      origin: 'India',
      destination: 'Hà Nội',
      created_at: '2025-01-25',
      customs_code: 'VNACCS-IMP-003',
      documents: ['Commercial Invoice', 'Packing List', 'Quality Certificate']
    }
  ]

  const documents = [
    {
      id: 'DOC-001',
      name: 'Commercial Invoice Template',
      type: 'commercial_invoice',
      status: 'active',
      description: 'Standard commercial invoice for import/export operations',
      last_updated: '2025-01-10'
    },
    {
      id: 'DOC-002',
      name: 'VNACCS Declaration Form',
      type: 'vnaccs_declaration',
      status: 'active',
      description: 'Vietnam Automated Cargo and Customs System declaration',
      last_updated: '2025-01-12'
    },
    {
      id: 'DOC-003',
      name: 'Certificate of Origin',
      type: 'certificate_origin',
      status: 'active',
      description: 'Certificate of origin for goods verification',
      last_updated: '2025-01-08'
    }
  ]

  const statistics = {
    totalShipments: shipments.length,
    importShipments: shipments.filter(s => s.type === 'import').length,
    exportShipments: shipments.filter(s => s.type === 'export').length,
    totalValue: shipments.reduce((sum, s) => sum + s.value, 0),
    clearedShipments: shipments.filter(s => s.status === 'customs_cleared').length,
    pendingShipments: shipments.filter(s => s.status !== 'customs_cleared').length
  }

  return { shipments, documents, statistics }
}

const ImportExportPage = () => {
  const [activeTab, setActiveTab] = useState('overview')
  const [isLoading, setIsLoading] = useState(true)
  const [data, setData] = useState(null)
  const [selectedShipment, setSelectedShipment] = useState(null)
  const [showNewShipmentForm, setShowNewShipmentForm] = useState(false)

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setData(generateImportExportData())
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const getStatusColor = (status) => {
    switch (status) {
      case 'customs_cleared': return 'bg-green-100 text-green-800'
      case 'submitted_vnaccs': return 'bg-blue-100 text-blue-800'
      case 'preparing': return 'bg-yellow-100 text-yellow-800'
      case 'documents_ready': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'customs_cleared': return <CheckCircle className="w-4 h-4" />
      case 'submitted_vnaccs': return <Clock className="w-4 h-4" />
      case 'preparing': return <AlertTriangle className="w-4 h-4" />
      default: return <Package className="w-4 h-4" />
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount)
  }

  if (isLoading || !data) {
    return (
      <AuthGuard>
        <div className="min-h-screen bg-slate-900 p-6">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-white mb-2">Import-Export Center</h1>
              <p className="text-slate-400">VNACCS integration and customs documentation</p>
            </div>
            
            <div className="text-center text-slate-400">
              <Package className="w-8 h-8 mx-auto mb-2 animate-spin" />
              <p>Loading import-export data...</p>
            </div>
          </div>
        </div>
      </AuthGuard>
    )
  }

  const { shipments, documents, statistics } = data

  return (
    <AuthGuard>
      <div className="min-h-screen bg-slate-900 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">Import-Export Center</h1>
                <p className="text-slate-400">VNACCS integration and customs documentation management</p>
              </div>
              
              <div className="flex items-center gap-4">
                <Button 
                  onClick={() => setShowNewShipmentForm(true)}
                  className="bg-indigo-600 hover:bg-indigo-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  New Shipment
                </Button>
                
                <Button variant="outline" className="text-white border-slate-600">
                  <Download className="w-4 h-4 mr-2" />
                  Export Report
                </Button>
              </div>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Total Shipments</p>
                    <p className="text-2xl font-bold text-slate-900">{statistics.totalShipments}</p>
                    <p className="text-sm text-slate-500">Active operations</p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-full">
                    <Package className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Total Value</p>
                    <p className="text-2xl font-bold text-slate-900">{formatCurrency(statistics.totalValue)}</p>
                    <p className="text-sm text-slate-500">Customs declared</p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-full">
                    <Globe className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Imports</p>
                    <p className="text-2xl font-bold text-slate-900">{statistics.importShipments}</p>
                    <p className="text-sm text-slate-500">Inbound shipments</p>
                  </div>
                  <div className="p-3 bg-purple-100 rounded-full">
                    <Download className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Exports</p>
                    <p className="text-2xl font-bold text-slate-900">{statistics.exportShipments}</p>
                    <p className="text-sm text-slate-500">Outbound shipments</p>
                  </div>
                  <div className="p-3 bg-orange-100 rounded-full">
                    <Upload className="w-6 h-6 text-orange-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="bg-slate-800 border-slate-700">
              <TabsTrigger value="overview" className="text-white">Overview</TabsTrigger>
              <TabsTrigger value="shipments" className="text-white">Shipments</TabsTrigger>
              <TabsTrigger value="documents" className="text-white">Documents</TabsTrigger>
              <TabsTrigger value="vnaccs" className="text-white">VNACCS Integration</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="w-5 h-5" />
                      Recent Activity
                    </CardTitle>
                    <CardDescription>Latest import-export operations</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {shipments.slice(0, 5).map((shipment) => (
                        <div key={shipment.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            {getStatusIcon(shipment.status)}
                            <div>
                              <p className="font-medium">{shipment.reference}</p>
                              <p className="text-sm text-slate-600">{shipment.company}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge className={getStatusColor(shipment.status)}>
                              {shipment.status.replace('_', ' ')}
                            </Badge>
                            <p className="text-sm text-slate-600 mt-1">{formatCurrency(shipment.value)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="w-5 h-5" />
                      Compliance Status
                    </CardTitle>
                    <CardDescription>VNACCS and customs compliance overview</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <CheckCircle className="w-5 h-5 text-green-600" />
                          <div>
                            <p className="font-medium text-green-800">VNACCS Connected</p>
                            <p className="text-sm text-green-600">System operational</p>
                          </div>
                        </div>
                        <Badge className="bg-green-100 text-green-800">Active</Badge>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <FileText className="w-5 h-5 text-blue-600" />
                          <div>
                            <p className="font-medium text-blue-800">Documents Ready</p>
                            <p className="text-sm text-blue-600">{documents.length} templates available</p>
                          </div>
                        </div>
                        <Badge className="bg-blue-100 text-blue-800">Ready</Badge>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Clock className="w-5 h-5 text-yellow-600" />
                          <div>
                            <p className="font-medium text-yellow-800">Pending Clearance</p>
                            <p className="text-sm text-yellow-600">{statistics.pendingShipments} shipments</p>
                          </div>
                        </div>
                        <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="shipments" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Truck className="w-5 h-5" />
                    Shipment Management
                  </CardTitle>
                  <CardDescription>Track and manage all import-export shipments</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b bg-slate-50">
                          <th className="text-left p-3 font-medium">Reference</th>
                          <th className="text-left p-3 font-medium">Type</th>
                          <th className="text-left p-3 font-medium">Company</th>
                          <th className="text-left p-3 font-medium">Goods</th>
                          <th className="text-left p-3 font-medium">Value</th>
                          <th className="text-left p-3 font-medium">Status</th>
                          <th className="text-left p-3 font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {shipments.map((shipment) => (
                          <tr key={shipment.id} className="border-b hover:bg-slate-50">
                            <td className="p-3 font-medium">{shipment.reference}</td>
                            <td className="p-3">
                              <Badge className={shipment.type === 'import' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}>
                                {shipment.type.toUpperCase()}
                              </Badge>
                            </td>
                            <td className="p-3">{shipment.company}</td>
                            <td className="p-3">{shipment.goods}</td>
                            <td className="p-3">{formatCurrency(shipment.value)}</td>
                            <td className="p-3">
                              <Badge className={getStatusColor(shipment.status)}>
                                {shipment.status.replace('_', ' ')}
                              </Badge>
                            </td>
                            <td className="p-3">
                              <div className="flex items-center gap-2">
                                <Button size="sm" variant="outline">
                                  <Eye className="w-4 h-4" />
                                </Button>
                                <Button size="sm" variant="outline">
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button size="sm" variant="outline">
                                  <Download className="w-4 h-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="documents" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {documents.map((doc) => (
                  <Card key={doc.id}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="w-5 h-5" />
                        {doc.name}
                      </CardTitle>
                      <CardDescription>{doc.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between">
                          <span className="text-sm text-slate-600">Type</span>
                          <Badge className="bg-slate-100 text-slate-800">
                            {doc.type.replace('_', ' ')}
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-slate-600">Status</span>
                          <Badge className="bg-green-100 text-green-800">{doc.status}</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-slate-600">Updated</span>
                          <span className="text-sm">{doc.last_updated}</span>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" className="flex-1">
                            <Download className="w-4 h-4 mr-2" />
                            Download
                          </Button>
                          <Button size="sm" variant="outline">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="vnaccs" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="w-5 h-5" />
                    VNACCS Integration
                  </CardTitle>
                  <CardDescription>Vietnam Automated Cargo and Customs System integration</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="font-semibold">System Status</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            <span className="text-sm">Connection Status</span>
                          </div>
                          <Badge className="bg-green-100 text-green-800">Connected</Badge>
                        </div>
                        
                        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                          <div className="flex items-center gap-2">
                            <Zap className="w-4 h-4 text-blue-600" />
                            <span className="text-sm">API Status</span>
                          </div>
                          <Badge className="bg-blue-100 text-blue-800">Active</Badge>
                        </div>
                        
                        <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                          <div className="flex items-center gap-2">
                            <RefreshCw className="w-4 h-4 text-yellow-600" />
                            <span className="text-sm">Last Sync</span>
                          </div>
                          <span className="text-sm">2 minutes ago</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="font-semibold">Quick Actions</h3>
                      <div className="space-y-2">
                        <Button className="w-full justify-start">
                          <FileSpreadsheet className="w-4 h-4 mr-2" />
                          Generate VNACCS Declaration
                        </Button>
                        <Button className="w-full justify-start" variant="outline">
                          <Upload className="w-4 h-4 mr-2" />
                          Submit to Customs
                        </Button>
                        <Button className="w-full justify-start" variant="outline">
                          <Download className="w-4 h-4 mr-2" />
                          Download Clearance Certificate
                        </Button>
                        <Button className="w-full justify-start" variant="outline">
                          <RefreshCw className="w-4 h-4 mr-2" />
                          Sync with VNACCS
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AuthGuard>
  )
}

export default ImportExportPage
