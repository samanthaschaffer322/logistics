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
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import { 
  Download, Upload, AlertTriangle, CheckCircle, XCircle, 
  Brain, Database, FileText, TrendingUp, Shield, Search
} from 'lucide-react';
import CustomsTrainingSystem, { 
  CustomsDeclaration, 
  FraudDetectionModel,
  HSCodeClassification 
} from '@/lib/customsTraining';
import { useLanguage } from '@/contexts/LanguageContext';

const CustomsTraining: React.FC = () => {
  const { language, t } = useLanguage();
  const [trainingSystem] = useState(new CustomsTrainingSystem());
  const [isLoading, setIsLoading] = useState(false);
  const [trainingProgress, setTrainingProgress] = useState(0);
  const [model, setModel] = useState<FraudDetectionModel | null>(null);
  const [statistics, setStatistics] = useState<any>(null);
  const [selectedDeclaration, setSelectedDeclaration] = useState<Partial<CustomsDeclaration>>({});
  const [fraudAnalysis, setFraudAnalysis] = useState<any>(null);
  const [hsCodeSearch, setHsCodeSearch] = useState('');
  const [hsCodeResult, setHsCodeResult] = useState<HSCodeClassification | null>(null);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  useEffect(() => {
    initializeTraining();
  }, []);

  const initializeTraining = async () => {
    setIsLoading(true);
    try {
      // Load training data
      setTrainingProgress(20);
      await trainingSystem.loadTrainingData();
      
      // Train model
      setTrainingProgress(60);
      const trainedModel = await trainingSystem.trainFraudDetectionModel();
      setModel(trainedModel);
      
      // Get statistics
      setTrainingProgress(80);
      const stats = trainingSystem.getTrainingStatistics();
      setStatistics(stats);
      
      setTrainingProgress(100);
    } catch (error) {
      console.error('Training initialization failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFraudDetection = () => {
    if (!selectedDeclaration.hsCode || !selectedDeclaration.unitPrice) {
      return;
    }
    
    const analysis = trainingSystem.detectFraud(selectedDeclaration);
    setFraudAnalysis(analysis);
  };

  const handleHSCodeSearch = () => {
    const result = trainingSystem.classifyHSCode(hsCodeSearch);
    setHsCodeResult(result);
  };

  const handleExportExcel = async () => {
    setIsLoading(true);
    try {
      await trainingSystem.exportTrainingDataToExcel(language);
      alert(t('exportSuccess'));
    } catch (error) {
      console.error('Export failed:', error);
      alert(t('exportError'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportPDF = async () => {
    setIsLoading(true);
    try {
      await trainingSystem.exportAnalysisReportToPDF(language);
      alert(t('exportSuccess'));
    } catch (error) {
      console.error('Export failed:', error);
      alert(t('exportError'));
    } finally {
      setIsLoading(false);
    }
  };

  const getRiskBadgeColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'LOW': return 'bg-green-100 text-green-800';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800';
      case 'HIGH': return 'bg-orange-100 text-orange-800';
      case 'CRITICAL': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const performanceData = model ? [
    { name: t('accuracy'), value: model.accuracy * 100 },
    { name: t('precision'), value: model.precision * 100 },
    { name: t('recall'), value: model.recall * 100 },
    { name: t('f1Score'), value: model.f1Score * 100 }
  ] : [];

  const featureImportanceData = model ? 
    Object.entries(model.featureImportance).map(([feature, importance]) => ({
      name: t(feature) || feature,
      value: importance * 100
    })) : [];

  const fraudDistributionData = statistics ? [
    { name: t('legitimate'), value: statistics.totalDeclarations - statistics.fraudulentDeclarations },
    { name: t('fraudulent'), value: statistics.fraudulentDeclarations }
  ] : [];

  if (isLoading && trainingProgress < 100) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="w-full max-w-md">
          <h2 className="text-2xl font-bold text-center mb-6">
            {t('initializingCustomsTraining')}
          </h2>
          <Progress value={trainingProgress} className="mb-4" />
          <p className="text-center text-gray-600">
            {trainingProgress < 30 ? t('loadingTrainingData') :
             trainingProgress < 70 ? t('trainingModel') :
             trainingProgress < 90 ? t('generatingStatistics') :
             t('finalizingSetup')}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Shield className="h-8 w-8 text-blue-600" />
            {t('customsTrainingSystem')}
          </h1>
          <p className="text-gray-600 mt-2">
            {t('customsTrainingDescription')}
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleExportExcel} disabled={isLoading}>
            <Download className="h-4 w-4 mr-2" />
            {t('exportExcel')}
          </Button>
          <Button onClick={handleExportPDF} disabled={isLoading}>
            <FileText className="h-4 w-4 mr-2" />
            {t('exportPDF')}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">{t('overview')}</TabsTrigger>
          <TabsTrigger value="fraud-detection">{t('fraudDetection')}</TabsTrigger>
          <TabsTrigger value="hs-classification">{t('hsClassification')}</TabsTrigger>
          <TabsTrigger value="model-performance">{t('modelPerformance')}</TabsTrigger>
          <TabsTrigger value="analytics">{t('analytics')}</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {t('totalDeclarations')}
                </CardTitle>
                <Database className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {statistics?.totalDeclarations.toLocaleString()}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {t('fraudRate')}
                </CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  {statistics ? (statistics.fraudRate * 100).toFixed(1) : 0}%
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {t('modelAccuracy')}
                </CardTitle>
                <Brain className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {model ? (model.accuracy * 100).toFixed(1) : 0}%
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {t('averageValue')}
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${statistics ? statistics.averageValue.toLocaleString() : 0}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Fraud Distribution Chart */}
          <Card>
            <CardHeader>
              <CardTitle>{t('fraudDistribution')}</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={fraudDistributionData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {fraudDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Fraud Detection Tab */}
        <TabsContent value="fraud-detection" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('fraudDetectionAnalysis')}</CardTitle>
              <p className="text-sm text-gray-600">
                {t('enterDeclarationDetails')}
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="hsCode">{t('hsCode')}</Label>
                  <Input
                    id="hsCode"
                    value={selectedDeclaration.hsCode || ''}
                    onChange={(e) => setSelectedDeclaration({
                      ...selectedDeclaration,
                      hsCode: e.target.value
                    })}
                    placeholder="8703.23.00"
                  />
                </div>
                <div>
                  <Label htmlFor="unitPrice">{t('unitPrice')}</Label>
                  <Input
                    id="unitPrice"
                    type="number"
                    value={selectedDeclaration.unitPrice || ''}
                    onChange={(e) => setSelectedDeclaration({
                      ...selectedDeclaration,
                      unitPrice: parseFloat(e.target.value)
                    })}
                    placeholder="15000"
                  />
                </div>
                <div>
                  <Label htmlFor="quantity">{t('quantity')}</Label>
                  <Input
                    id="quantity"
                    type="number"
                    value={selectedDeclaration.quantity || ''}
                    onChange={(e) => setSelectedDeclaration({
                      ...selectedDeclaration,
                      quantity: parseInt(e.target.value)
                    })}
                    placeholder="100"
                  />
                </div>
                <div>
                  <Label htmlFor="countryOfOrigin">{t('countryOfOrigin')}</Label>
                  <Select
                    value={selectedDeclaration.countryOfOrigin || ''}
                    onValueChange={(value) => setSelectedDeclaration({
                      ...selectedDeclaration,
                      countryOfOrigin: value
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t('selectCountry')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="China">China</SelectItem>
                      <SelectItem value="Germany">Germany</SelectItem>
                      <SelectItem value="Japan">Japan</SelectItem>
                      <SelectItem value="South Korea">South Korea</SelectItem>
                      <SelectItem value="United States">United States</SelectItem>
                      <SelectItem value="Vietnam">Vietnam</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button onClick={handleFraudDetection} className="w-full">
                <Search className="h-4 w-4 mr-2" />
                {t('analyzeFraud')}
              </Button>

              {fraudAnalysis && (
                <Alert className={`mt-4 ${
                  fraudAnalysis.riskLevel === 'CRITICAL' ? 'border-red-500' :
                  fraudAnalysis.riskLevel === 'HIGH' ? 'border-orange-500' :
                  fraudAnalysis.riskLevel === 'MEDIUM' ? 'border-yellow-500' :
                  'border-green-500'
                }`}>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span>{t('riskLevel')}:</span>
                        <Badge className={getRiskBadgeColor(fraudAnalysis.riskLevel)}>
                          {t(fraudAnalysis.riskLevel.toLowerCase())}
                        </Badge>
                        <span>{t('fraudProbability')}: {(fraudAnalysis.fraudProbability * 100).toFixed(1)}%</span>
                      </div>
                      
                      {fraudAnalysis.anomalies.length > 0 && (
                        <div>
                          <strong>{t('detectedAnomalies')}:</strong>
                          <ul className="list-disc list-inside mt-1">
                            {fraudAnalysis.anomalies.map((anomaly: string, index: number) => (
                              <li key={index}>{t(anomaly.toLowerCase()) || anomaly}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {fraudAnalysis.recommendations.length > 0 && (
                        <div>
                          <strong>{t('recommendations')}:</strong>
                          <ul className="list-disc list-inside mt-1">
                            {fraudAnalysis.recommendations.map((rec: string, index: number) => (
                              <li key={index}>{rec}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* HS Classification Tab */}
        <TabsContent value="hs-classification" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('hsCodeClassification')}</CardTitle>
              <p className="text-sm text-gray-600">
                {t('enterProductDescription')}
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={hsCodeSearch}
                  onChange={(e) => setHsCodeSearch(e.target.value)}
                  placeholder={t('productDescriptionPlaceholder')}
                  className="flex-1"
                />
                <Button onClick={handleHSCodeSearch}>
                  <Search className="h-4 w-4 mr-2" />
                  {t('classify')}
                </Button>
              </div>

              {hsCodeResult && (
                <Card className="mt-4">
                  <CardContent className="pt-6">
                    <div className="space-y-3">
                      <div>
                        <strong>{t('hsCode')}:</strong> {hsCodeResult.code}
                      </div>
                      <div>
                        <strong>{t('description')}:</strong> {hsCodeResult.description}
                      </div>
                      <div>
                        <strong>{t('category')}:</strong> {hsCodeResult.category}
                      </div>
                      <div>
                        <strong>{t('tariffRate')}:</strong> {(hsCodeResult.tariffRate * 100).toFixed(1)}%
                      </div>
                      <div>
                        <strong>{t('restrictions')}:</strong>
                        <ul className="list-disc list-inside mt-1">
                          {hsCodeResult.restrictions.map((restriction, index) => (
                            <li key={index}>{restriction}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <strong>{t('commonFraudPatterns')}:</strong>
                        <ul className="list-disc list-inside mt-1">
                          {hsCodeResult.commonFraudPatterns.map((pattern, index) => (
                            <li key={index}>{pattern}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Model Performance Tab */}
        <TabsContent value="model-performance" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>{t('modelMetrics')}</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t('featureImportance')}</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={featureImportanceData} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={80} />
                    <Tooltip />
                    <Bar dataKey="value" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {model && (
            <Card>
              <CardHeader>
                <CardTitle>{t('confusionMatrix')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 max-w-md">
                  <div className="text-center">
                    <div className="text-sm text-gray-600">{t('predictedNegative')}</div>
                    <div className="text-sm text-gray-600">{t('predictedPositive')}</div>
                  </div>
                  <div></div>
                  <div className="text-sm text-gray-600 text-right">{t('actualNegative')}</div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-green-100 p-4 text-center font-bold">
                      {model.confusionMatrix[0][0]}
                    </div>
                    <div className="bg-red-100 p-4 text-center font-bold">
                      {model.confusionMatrix[0][1]}
                    </div>
                  </div>
                  <div className="text-sm text-gray-600 text-right">{t('actualPositive')}</div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-red-100 p-4 text-center font-bold">
                      {model.confusionMatrix[1][0]}
                    </div>
                    <div className="bg-green-100 p-4 text-center font-bold">
                      {model.confusionMatrix[1][1]}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>{t('topRiskCountries')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {statistics?.topRiskCountries.map((country: string, index: number) => (
                    <div key={index} className="flex justify-between items-center">
                      <span>{country}</span>
                      <Badge variant="outline">{index + 1}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t('topHSCodes')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {statistics?.topHSCodes.map((code: string, index: number) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="font-mono text-sm">{code}</span>
                      <Badge variant="outline">{index + 1}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CustomsTraining;
