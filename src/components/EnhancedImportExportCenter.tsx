'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  FileText, Ship, Shield, Brain, Upload, Search, 
  MapPin, Calendar, Clock, AlertTriangle, DollarSign, 
  BarChart3, Loader2, RefreshCw, CheckCircle, XCircle,
  Eye, Download, Plus, Trash2, Edit, Save
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface CustomsDeclaration {
  id: string;
  declarationNumber: string;
  hsCode: string;
  productDescription: string;
  unitPrice: number;
  quantity: number;
  totalValue: number;
  countryOfOrigin: string;
  declarationDate: string;
  status: 'pending' | 'approved' | 'rejected' | 'under_review';
  fraudRisk: {
    probability: number;
    level: 'low' | 'medium' | 'high' | 'critical';
    detectedAnomalies: string[];
    confidence: number;
  };
  aiAnalysis: {
    priceAnomaly: boolean;
    quantityAnomaly: boolean;
    patternAnomaly: boolean;
    documentInconsistency: boolean;
    riskFactors: string[];
  };
}

interface VNACCSDocument {
  id: string;
  type: 'import' | 'export';
  documentNumber: string;
  status: 'draft' | 'submitted' | 'processing' | 'approved' | 'rejected';
  submissionDate: string;
  processingTime: number;
  customsValue: number;
  tariffRate: number;
  totalTax: number;
  aiValidation: {
    isValid: boolean;
    confidence: number;
    issues: string[];
    suggestions: string[];
  };
}

interface FraudDetectionResult {
  declarationId: string;
  fraudProbability: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  detectedAnomalies: string[];
  recommendations: string[];
  confidence: number;
  processingTime: number;
}

const EnhancedImportExportCenter: React.FC = () => {
  const { language, t } = useLanguage();
  const [activeTab, setActiveTab] = useState('vnaccs');
  const [declarations, setDeclarations] = useState<CustomsDeclaration[]>([]);
  const [vnaccsDocuments, setVNACCSDocuments] = useState<VNACCSDocument[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [selectedDeclaration, setSelectedDeclaration] = useState<CustomsDeclaration | null>(null);
  const [fraudAnalysisResult, setFraudAnalysisResult] = useState<FraudDetectionResult | null>(null);

  // Sample data initialization
  useEffect(() => {
    initializeSampleData();
  }, []);

  const initializeSampleData = () => {
    const sampleDeclarations: CustomsDeclaration[] = [
      {
        id: 'DECL001',
        declarationNumber: 'VN2025001234',
        hsCode: '8517.12.00',
        productDescription: 'Smartphones, Android OS',
        unitPrice: 299.99,
        quantity: 1000,
        totalValue: 299990,
        countryOfOrigin: 'China',
        declarationDate: '2025-01-15',
        status: 'under_review',
        fraudRisk: {
          probability: 0.15,
          level: 'low',
          detectedAnomalies: [],
          confidence: 0.92
        },
        aiAnalysis: {
          priceAnomaly: false,
          quantityAnomaly: false,
          patternAnomaly: false,
          documentInconsistency: false,
          riskFactors: []
        }
      },
      {
        id: 'DECL002',
        declarationNumber: 'VN2025001235',
        hsCode: '6109.10.00',
        productDescription: 'Cotton T-shirts',
        unitPrice: 2.50,
        quantity: 50000,
        totalValue: 125000,
        countryOfOrigin: 'Bangladesh',
        declarationDate: '2025-01-16',
        status: 'pending',
        fraudRisk: {
          probability: 0.78,
          level: 'high',
          detectedAnomalies: ['potential_undervaluation', 'unusually_high_quantity'],
          confidence: 0.89
        },
        aiAnalysis: {
          priceAnomaly: true,
          quantityAnomaly: true,
          patternAnomaly: false,
          documentInconsistency: false,
          riskFactors: ['Price below market average', 'Quantity exceeds normal patterns']
        }
      },
      {
        id: 'DECL003',
        declarationNumber: 'VN2025001236',
        hsCode: '0901.21.00',
        productDescription: 'Roasted coffee beans',
        unitPrice: 4.20,
        quantity: 10000,
        totalValue: 42000,
        countryOfOrigin: 'Vietnam',
        declarationDate: '2025-01-17',
        status: 'approved',
        fraudRisk: {
          probability: 0.05,
          level: 'low',
          detectedAnomalies: [],
          confidence: 0.96
        },
        aiAnalysis: {
          priceAnomaly: false,
          quantityAnomaly: false,
          patternAnomaly: false,
          documentInconsistency: false,
          riskFactors: []
        }
      }
    ];

    const sampleVNACCS: VNACCSDocument[] = [
      {
        id: 'VNACCS001',
        type: 'import',
        documentNumber: 'IMP2025001',
        status: 'approved',
        submissionDate: '2025-01-15',
        processingTime: 24,
        customsValue: 299990,
        tariffRate: 0.15,
        totalTax: 44998.50,
        aiValidation: {
          isValid: true,
          confidence: 0.95,
          issues: [],
          suggestions: []
        }
      },
      {
        id: 'VNACCS002',
        type: 'export',
        documentNumber: 'EXP2025001',
        status: 'processing',
        submissionDate: '2025-01-16',
        processingTime: 12,
        customsValue: 125000,
        tariffRate: 0.05,
        totalTax: 6250,
        aiValidation: {
          isValid: false,
          confidence: 0.87,
          issues: ['Price verification required', 'Quantity validation needed'],
          suggestions: ['Provide additional documentation', 'Verify supplier credentials']
        }
      }
    ];

    setDeclarations(sampleDeclarations);
    setVNACCSDocuments(sampleVNACCS);
  };

  const analyzeFraudRisk = async (declaration: CustomsDeclaration) => {
    setIsProcessing(true);
    setProcessingProgress(0);
    setSelectedDeclaration(declaration);

    try {
      // Simulate AI fraud detection processing
      const progressSteps = [
        { progress: 20, message: 'Analyzing price patterns...' },
        { progress: 40, message: 'Checking quantity anomalies...' },
        { progress: 60, message: 'Validating document consistency...' },
        { progress: 80, message: 'Applying DATE model analysis...' },
        { progress: 100, message: 'Generating fraud risk assessment...' }
      ];

      for (const step of progressSteps) {
        await new Promise(resolve => setTimeout(resolve, 800));
        setProcessingProgress(step.progress);
      }

      // Generate fraud detection result
      const result: FraudDetectionResult = {
        declarationId: declaration.id,
        fraudProbability: declaration.fraudRisk.probability,
        riskLevel: declaration.fraudRisk.level,
        detectedAnomalies: declaration.fraudRisk.detectedAnomalies,
        recommendations: generateRecommendations(declaration),
        confidence: declaration.fraudRisk.confidence,
        processingTime: 3.2
      };

      setFraudAnalysisResult(result);
    } catch (error) {
      console.error('Fraud analysis failed:', error);
    } finally {
      setIsProcessing(false);
      setProcessingProgress(0);
    }
  };

  const generateRecommendations = (declaration: CustomsDeclaration): string[] => {
    const recommendations: string[] = [];

    if (declaration.fraudRisk.level === 'high' || declaration.fraudRisk.level === 'critical') {
      recommendations.push('Conduct physical inspection of goods');
      recommendations.push('Verify supplier credentials and documentation');
      recommendations.push('Cross-check with similar declarations');
    }

    if (declaration.aiAnalysis.priceAnomaly) {
      recommendations.push('Verify market price with industry standards');
      recommendations.push('Request additional pricing documentation');
    }

    if (declaration.aiAnalysis.quantityAnomaly) {
      recommendations.push('Validate quantity with shipping documents');
      recommendations.push('Check importer capacity and history');
    }

    if (recommendations.length === 0) {
      recommendations.push('Declaration appears legitimate - proceed with standard processing');
    }

    return recommendations;
  };

  const processVNACCSDocument = async (document: VNACCSDocument) => {
    setIsProcessing(true);
    setProcessingProgress(0);

    try {
      const progressSteps = [
        { progress: 25, message: 'Validating document format...' },
        { progress: 50, message: 'Checking customs regulations...' },
        { progress: 75, message: 'Calculating taxes and duties...' },
        { progress: 100, message: 'Finalizing VNACCS submission...' }
      ];

      for (const step of progressSteps) {
        await new Promise(resolve => setTimeout(resolve, 600));
        setProcessingProgress(step.progress);
      }

      // Update document status
      const updatedDocuments = vnaccsDocuments.map(doc => 
        doc.id === document.id 
          ? { ...doc, status: 'approved' as const, processingTime: doc.processingTime + 2 }
          : doc
      );
      setVNACCSDocuments(updatedDocuments);

    } catch (error) {
      console.error('VNACCS processing failed:', error);
    } finally {
      setIsProcessing(false);
      setProcessingProgress(0);
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-green-400 bg-green-500/20';
      case 'medium': return 'text-yellow-400 bg-yellow-500/20';
      case 'high': return 'text-orange-400 bg-orange-500/20';
      case 'critical': return 'text-red-400 bg-red-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'text-green-400 bg-green-500/20';
      case 'pending': return 'text-yellow-400 bg-yellow-500/20';
      case 'under_review': return 'text-blue-400 bg-blue-500/20';
      case 'rejected': return 'text-red-400 bg-red-500/20';
      case 'processing': return 'text-purple-400 bg-purple-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 p-6">
      <div className="container mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-2">
              <Ship className="h-8 w-8 text-blue-400" />
              Enhanced Import-Export Center
            </h1>
            <p className="text-blue-200 mt-2">
              VNACCS processing with integrated AI fraud detection system
            </p>
          </div>
          <div className="flex gap-2">
            <Button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
              <Plus className="h-4 w-4 mr-2" />
              New Declaration
            </Button>
            <Button variant="outline" className="bg-white/20 backdrop-blur-sm text-white border-white/30 hover:bg-white/30">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Processing Progress */}
        {isProcessing && (
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-white">AI Processing</span>
                  <span className="text-sm text-white/70">{Math.round(processingProgress)}%</span>
                </div>
                <Progress value={processingProgress} className="w-full" />
                <p className="text-sm text-white/80 flex items-center gap-2">
                  <Brain className="h-4 w-4 animate-pulse" />
                  Processing with DATE model fraud detection...
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-white/10 backdrop-blur-sm border-white/20">
            <TabsTrigger value="vnaccs" className="text-white data-[state=active]:bg-white/20 data-[state=active]:text-white">VNACCS Processing</TabsTrigger>
            <TabsTrigger value="fraud-detection" className="text-white data-[state=active]:bg-white/20 data-[state=active]:text-white">AI Fraud Detection</TabsTrigger>
            <TabsTrigger value="declarations" className="text-white data-[state=active]:bg-white/20 data-[state=active]:text-white">Customs Declarations</TabsTrigger>
            <TabsTrigger value="analytics" className="text-white data-[state=active]:bg-white/20 data-[state=active]:text-white">Analytics</TabsTrigger>
          </TabsList>
          {/* VNACCS Processing Tab */}
          <TabsContent value="vnaccs" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-white">Total Documents</CardTitle>
                  <FileText className="h-4 w-4 text-white/60" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{vnaccsDocuments.length}</div>
                  <p className="text-xs text-white/60">VNACCS submissions</p>
                </CardContent>
              </Card>

              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-white">Processing Time</CardTitle>
                  <Clock className="h-4 w-4 text-white/60" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">18h</div>
                  <p className="text-xs text-white/60">Average processing</p>
                </CardContent>
              </Card>

              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-white">Success Rate</CardTitle>
                  <CheckCircle className="h-4 w-4 text-white/60" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-400">94.2%</div>
                  <p className="text-xs text-white/60">Approval rate</p>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-white">VNACCS Document Processing</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {vnaccsDocuments.map((document) => (
                    <Card key={document.id} className="p-4 bg-white/5 border-white/10">
                      <div className="flex items-center justify-between">
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 flex-1">
                          <div>
                            <Label className="text-sm font-medium text-white">Document Info</Label>
                            <p className="text-sm text-white/90">{document.documentNumber}</p>
                            <p className="text-xs text-white/60">{document.type.toUpperCase()}</p>
                          </div>
                          <div>
                            <Label className="text-sm font-medium text-white">Status</Label>
                            <Badge className={getStatusColor(document.status)}>
                              {document.status.replace('_', ' ')}
                            </Badge>
                          </div>
                          <div>
                            <Label className="text-sm font-medium text-white">Values</Label>
                            <div className="text-sm text-white/80">
                              <p>Customs: ${document.customsValue.toLocaleString()}</p>
                              <p>Tax: ${document.totalTax.toLocaleString()}</p>
                            </div>
                          </div>
                          <div>
                            <Label className="text-sm font-medium text-white">AI Validation</Label>
                            <div className="flex items-center gap-2">
                              {document.aiValidation.isValid ? (
                                <CheckCircle className="h-4 w-4 text-green-400" />
                              ) : (
                                <XCircle className="h-4 w-4 text-red-400" />
                              )}
                              <span className="text-xs text-white/70">
                                {(document.aiValidation.confidence * 100).toFixed(1)}% confidence
                              </span>
                            </div>
                          </div>
                          <div>
                            <Label className="text-sm font-medium text-white">Processing</Label>
                            <div className="text-sm text-white/80">
                              <p>Time: {document.processingTime}h</p>
                              <p>Rate: {document.tariffRate * 100}%</p>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2 ml-4">
                          <Button 
                            onClick={() => processVNACCSDocument(document)} 
                            disabled={isProcessing || document.status === 'approved'}
                            size="sm" 
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Process
                          </Button>
                          <Button size="sm" variant="outline" className="bg-white/10 border-white/30 text-white hover:bg-white/20">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      {document.aiValidation.issues.length > 0 && (
                        <div className="mt-4 p-3 bg-red-500/20 rounded-lg border border-red-500/30">
                          <h5 className="text-sm font-medium text-red-300 mb-2">Validation Issues:</h5>
                          <ul className="text-xs text-red-200 space-y-1">
                            {document.aiValidation.issues.map((issue, idx) => (
                              <li key={idx}>• {issue}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* AI Fraud Detection Tab */}
          <TabsContent value="fraud-detection" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-white">Detection Rate</CardTitle>
                  <Shield className="h-4 w-4 text-white/60" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-400">94.7%</div>
                  <p className="text-xs text-white/60">Fraud detection accuracy</p>
                </CardContent>
              </Card>

              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-white">High Risk</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-white/60" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-400">
                    {declarations.filter(d => d.fraudRisk.level === 'high' || d.fraudRisk.level === 'critical').length}
                  </div>
                  <p className="text-xs text-white/60">Flagged declarations</p>
                </CardContent>
              </Card>

              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-white">Processing Speed</CardTitle>
                  <Brain className="h-4 w-4 text-white/60" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-400">2.8s</div>
                  <p className="text-xs text-white/60">Average analysis time</p>
                </CardContent>
              </Card>

              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-white">Model Confidence</CardTitle>
                  <BarChart3 className="h-4 w-4 text-white/60" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-400">92.1%</div>
                  <p className="text-xs text-white/60">Average confidence</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <CardTitle className="text-white">Fraud Risk Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {declarations.map((declaration) => (
                      <Card key={declaration.id} className="p-4 bg-white/5 border-white/10">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <p className="font-medium text-white">{declaration.declarationNumber}</p>
                            <p className="text-sm text-white/60">{declaration.productDescription}</p>
                          </div>
                          <Badge className={getRiskColor(declaration.fraudRisk.level)}>
                            {declaration.fraudRisk.level.toUpperCase()} RISK
                          </Badge>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-white/80">Fraud Probability</span>
                            <span className="text-white">{(declaration.fraudRisk.probability * 100).toFixed(1)}%</span>
                          </div>
                          <Progress value={declaration.fraudRisk.probability * 100} className="h-2" />
                          <div className="flex justify-between text-sm">
                            <span className="text-white/80">AI Confidence</span>
                            <span className="text-white">{(declaration.fraudRisk.confidence * 100).toFixed(1)}%</span>
                          </div>
                        </div>
                        <div className="mt-3 flex gap-2">
                          <Button 
                            onClick={() => analyzeFraudRisk(declaration)} 
                            disabled={isProcessing}
                            size="sm" 
                            className="bg-red-600 hover:bg-red-700"
                          >
                            <Shield className="h-4 w-4 mr-2" />
                            Analyze
                          </Button>
                          <Button size="sm" variant="outline" className="bg-white/10 border-white/30 text-white hover:bg-white/20">
                            <Eye className="h-4 w-4 mr-2" />
                            Details
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {fraudAnalysisResult && (
                <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white">Fraud Analysis Result</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-white/80">Declaration ID</span>
                        <span className="text-white font-mono">{fraudAnalysisResult.declarationId}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-white/80">Risk Level</span>
                        <Badge className={getRiskColor(fraudAnalysisResult.riskLevel)}>
                          {fraudAnalysisResult.riskLevel.toUpperCase()}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-white/80">Fraud Probability</span>
                        <span className="text-white">{(fraudAnalysisResult.fraudProbability * 100).toFixed(1)}%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-white/80">Processing Time</span>
                        <span className="text-white">{fraudAnalysisResult.processingTime}s</span>
                      </div>

                      {fraudAnalysisResult.detectedAnomalies.length > 0 && (
                        <div>
                          <h5 className="font-medium text-white mb-2">Detected Anomalies:</h5>
                          <ul className="space-y-1">
                            {fraudAnalysisResult.detectedAnomalies.map((anomaly, idx) => (
                              <li key={idx} className="text-sm text-red-300 flex items-center gap-2">
                                <AlertTriangle className="h-3 w-3" />
                                {anomaly.replace('_', ' ')}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <div>
                        <h5 className="font-medium text-white mb-2">AI Recommendations:</h5>
                        <ul className="space-y-1">
                          {fraudAnalysisResult.recommendations.map((rec, idx) => (
                            <li key={idx} className="text-sm text-blue-300 flex items-center gap-2">
                              <CheckCircle className="h-3 w-3" />
                              {rec}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Customs Declarations Tab */}
          <TabsContent value="declarations" className="space-y-6">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Customs Declarations Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {declarations.map((declaration) => (
                    <Card key={declaration.id} className="p-4 bg-white/5 border-white/10">
                      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                        <div>
                          <Label className="text-sm font-medium text-white">Declaration</Label>
                          <p className="text-sm text-white/90">{declaration.declarationNumber}</p>
                          <p className="text-xs text-white/60">HS: {declaration.hsCode}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-white">Product</Label>
                          <p className="text-sm text-white/80">{declaration.productDescription}</p>
                          <p className="text-xs text-white/60">Origin: {declaration.countryOfOrigin}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-white">Quantity & Price</Label>
                          <p className="text-sm text-white/80">{declaration.quantity.toLocaleString()} units</p>
                          <p className="text-xs text-white/60">${declaration.unitPrice}/unit</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-white">Total Value</Label>
                          <p className="text-sm font-bold text-white">${declaration.totalValue.toLocaleString()}</p>
                          <p className="text-xs text-white/60">{declaration.declarationDate}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-white">Status</Label>
                          <Badge className={getStatusColor(declaration.status)}>
                            {declaration.status.replace('_', ' ')}
                          </Badge>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-white">Fraud Risk</Label>
                          <Badge className={getRiskColor(declaration.fraudRisk.level)}>
                            {declaration.fraudRisk.level}
                          </Badge>
                          <p className="text-xs text-white/60 mt-1">
                            {(declaration.fraudRisk.probability * 100).toFixed(1)}% probability
                          </p>
                        </div>
                      </div>
                      {declaration.aiAnalysis.riskFactors.length > 0 && (
                        <div className="mt-4 p-3 bg-yellow-500/20 rounded-lg border border-yellow-500/30">
                          <h5 className="text-sm font-medium text-yellow-300 mb-2">Risk Factors:</h5>
                          <ul className="text-xs text-yellow-200 space-y-1">
                            {declaration.aiAnalysis.riskFactors.map((factor, idx) => (
                              <li key={idx}>• {factor}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <CardTitle className="text-white">Fraud Detection Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-white/80">Total Declarations Processed</span>
                      <span className="text-white font-bold">{declarations.length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white/80">High Risk Detected</span>
                      <span className="text-red-400 font-bold">
                        {declarations.filter(d => d.fraudRisk.level === 'high' || d.fraudRisk.level === 'critical').length}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white/80">Average Processing Time</span>
                      <span className="text-white font-bold">2.8s</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white/80">Model Accuracy</span>
                      <span className="text-green-400 font-bold">94.7%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <CardTitle className="text-white">VNACCS Processing Stats</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-white/80">Documents Processed</span>
                      <span className="text-white font-bold">{vnaccsDocuments.length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white/80">Approval Rate</span>
                      <span className="text-green-400 font-bold">94.2%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white/80">Average Processing Time</span>
                      <span className="text-white font-bold">18 hours</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white/80">Total Customs Value</span>
                      <span className="text-white font-bold">
                        ${vnaccsDocuments.reduce((sum, doc) => sum + doc.customsValue, 0).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-white">AI Model Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-400 mb-2">94.7%</div>
                    <p className="text-sm text-white/60">Detection Accuracy</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-400 mb-2">92.1%</div>
                    <p className="text-sm text-white/60">Average Confidence</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-400 mb-2">2.8s</div>
                    <p className="text-sm text-white/60">Processing Speed</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default EnhancedImportExportCenter;
