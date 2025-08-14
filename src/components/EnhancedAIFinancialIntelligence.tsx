'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, 
  TrendingUp, 
  DollarSign, 
  Calculator, 
  PieChart,
  BarChart3,
  Target,
  AlertTriangle,
  CheckCircle,
  Zap,
  FileText,
  Download,
  RefreshCw,
  User,
  Users,
  Building,
  Briefcase
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart as RechartsPieChart, Pie, Cell, LineChart, Line, Area, AreaChart
} from 'recharts';

// AI Financial Analysis Engine
class AIFinancialIntelligence {
  // CFO Analysis
  generateCFOAnalysis(data: any): any {
    return {
      executive_summary: {
        total_revenue: data.total_revenue || 15000000000,
        total_expenses: data.total_expenses || 12000000000,
        net_profit: (data.total_revenue || 15000000000) - (data.total_expenses || 12000000000),
        profit_margin: data.total_revenue ? (((data.total_revenue - data.total_expenses) / data.total_revenue) * 100) : 20,
        growth_rate: 12.5,
        cash_flow_status: 'positive'
      },
      key_insights: [
        'Doanh thu tăng 12.5% so với tháng trước',
        'Chi phí nhiên liệu chiếm 35% tổng chi phí',
        'Hiệu quả vận hành cải thiện 8%',
        'Cần tối ưu hóa tuyến đường để giảm chi phí'
      ],
      strategic_recommendations: [
        'Đầu tư vào hệ thống GPS để tối ưu tuyến đường',
        'Đàm phán lại hợp đồng với nhà cung cấp nhiên liệu',
        'Mở rộng hoạt động tại khu vực miền Trung',
        'Tăng cường đào tạo tài xế để tiết kiệm nhiên liệu'
      ],
      risk_assessment: {
        level: 'medium',
        factors: [
          'Biến động giá nhiên liệu',
          'Cạnh tranh thị trường',
          'Quy định giao thông mới'
        ]
      }
    };
  }
  
  // Accountant Analysis
  generateAccountantAnalysis(data: any): any {
    return {
      accounts_receivable: {
        total: 2500000000,
        overdue_30_days: 150000000,
        overdue_60_days: 75000000,
        collection_rate: 94.2
      },
      accounts_payable: {
        total: 1800000000,
        due_this_week: 300000000,
        due_next_week: 450000000,
        payment_terms_compliance: 96.8
      },
      working_capital: {
        current_assets: 3200000000,
        current_liabilities: 1800000000,
        working_capital: 1400000000,
        ratio: 1.78
      },
      expense_breakdown: [
        { category: 'Nhiên liệu', amount: 1200000000, percentage: 35 },
        { category: 'Lương tài xế', amount: 800000000, percentage: 23 },
        { category: 'Bảo trì xe', amount: 400000000, percentage: 12 },
        { category: 'Bảo hiểm', amount: 300000000, percentage: 9 },
        { category: 'Khác', amount: 700000000, percentage: 21 }
      ],
      compliance_status: {
        tax_compliance: 'compliant',
        audit_status: 'up_to_date',
        regulatory_compliance: 'compliant'
      }
    };
  }
  
  // Financial Advisor Analysis
  generateFinancialAdvisorAnalysis(data: any): any {
    return {
      investment_opportunities: [
        {
          type: 'Mở rộng đội xe',
          investment: 5000000000,
          expected_return: 18,
          payback_period: 3.2,
          risk_level: 'medium'
        },
        {
          type: 'Hệ thống quản lý nhiên liệu',
          investment: 500000000,
          expected_return: 25,
          payback_period: 1.8,
          risk_level: 'low'
        },
        {
          type: 'Kho bãi logistics',
          investment: 8000000000,
          expected_return: 15,
          payback_period: 4.5,
          risk_level: 'high'
        }
      ],
      cash_flow_projections: {
        next_3_months: [
          { month: 'Tháng 9', inflow: 3500000000, outflow: 2800000000, net: 700000000 },
          { month: 'Tháng 10', inflow: 3800000000, outflow: 3000000000, net: 800000000 },
          { month: 'Tháng 11', inflow: 4200000000, outflow: 3200000000, net: 1000000000 }
        ]
      },
      cost_optimization: [
        {
          area: 'Tối ưu tuyến đường',
          potential_savings: 200000000,
          implementation_cost: 50000000,
          timeline: '2-3 tháng'
        },
        {
          area: 'Đàm phán hợp đồng nhiên liệu',
          potential_savings: 150000000,
          implementation_cost: 10000000,
          timeline: '1 tháng'
        }
      ],
      financial_health_score: 82
    };
  }
  
  // Business Analyst Report
  generateBusinessAnalystReport(data: any): any {
    return {
      kpi_dashboard: {
        revenue_per_km: 2500,
        cost_per_km: 1800,
        profit_per_km: 700,
        fleet_utilization: 87.5,
        on_time_delivery: 94.2,
        customer_satisfaction: 4.6
      },
      trend_analysis: {
        revenue_trend: 'increasing',
        cost_trend: 'stable',
        efficiency_trend: 'improving',
        market_share_trend: 'growing'
      },
      competitive_analysis: {
        market_position: 'strong',
        competitive_advantages: [
          'Mạng lưới rộng khắp',
          'Công nghệ hiện đại',
          'Dịch vụ khách hàng tốt'
        ],
        areas_for_improvement: [
          'Chi phí vận hành',
          'Thời gian giao hàng',
          'Đa dạng hóa dịch vụ'
        ]
      },
      forecasting: {
        next_quarter_revenue: 12500000000,
        growth_projection: 15.2,
        market_expansion_potential: 'high'
      }
    };
  }
}

// CFO Dashboard Component
const CFODashboard: React.FC<{ analysis: any }> = ({ analysis }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {(analysis.executive_summary.total_revenue / 1000000000).toFixed(1)}B
              </div>
              <div className="text-sm text-gray-600">Tổng doanh thu</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {(analysis.executive_summary.total_expenses / 1000000000).toFixed(1)}B
              </div>
              <div className="text-sm text-gray-600">Tổng chi phí</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {(analysis.executive_summary.net_profit / 1000000000).toFixed(1)}B
              </div>
              <div className="text-sm text-gray-600">Lợi nhuận ròng</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {analysis.executive_summary.profit_margin.toFixed(1)}%
              </div>
              <div className="text-sm text-gray-600">Tỷ suất lợi nhuận</div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Thông tin chủ chốt</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {analysis.key_insights.map((insight: string, index: number) => (
                <div key={index} className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 mt-0.5 text-green-600" />
                  <span className="text-sm">{insight}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Khuyến nghị chiến lược</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {analysis.strategic_recommendations.map((rec: string, index: number) => (
                <div key={index} className="flex items-start gap-2">
                  <Target className="h-4 w-4 mt-0.5 text-blue-600" />
                  <span className="text-sm">{rec}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Accountant View Component
const AccountantView: React.FC<{ analysis: any }> = ({ analysis }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Công nợ phải thu</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Tổng cộng:</span>
                <span className="font-medium">{(analysis.accounts_receivable.total / 1000000000).toFixed(1)}B</span>
              </div>
              <div className="flex justify-between">
                <span>Quá hạn 30 ngày:</span>
                <span className="font-medium text-orange-600">{(analysis.accounts_receivable.overdue_30_days / 1000000).toFixed(0)}M</span>
              </div>
              <div className="flex justify-between">
                <span>Quá hạn 60 ngày:</span>
                <span className="font-medium text-red-600">{(analysis.accounts_receivable.overdue_60_days / 1000000).toFixed(0)}M</span>
              </div>
              <div className="flex justify-between">
                <span>Tỷ lệ thu hồi:</span>
                <span className="font-medium text-green-600">{analysis.accounts_receivable.collection_rate}%</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Công nợ phải trả</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Tổng cộng:</span>
                <span className="font-medium">{(analysis.accounts_payable.total / 1000000000).toFixed(1)}B</span>
              </div>
              <div className="flex justify-between">
                <span>Đến hạn tuần này:</span>
                <span className="font-medium text-orange-600">{(analysis.accounts_payable.due_this_week / 1000000).toFixed(0)}M</span>
              </div>
              <div className="flex justify-between">
                <span>Đến hạn tuần sau:</span>
                <span className="font-medium text-blue-600">{(analysis.accounts_payable.due_next_week / 1000000).toFixed(0)}M</span>
              </div>
              <div className="flex justify-between">
                <span>Tuân thủ điều khoản:</span>
                <span className="font-medium text-green-600">{analysis.accounts_payable.payment_terms_compliance}%</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Vốn lưu động</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Tài sản ngắn hạn:</span>
                <span className="font-medium">{(analysis.working_capital.current_assets / 1000000000).toFixed(1)}B</span>
              </div>
              <div className="flex justify-between">
                <span>Nợ ngắn hạn:</span>
                <span className="font-medium">{(analysis.working_capital.current_liabilities / 1000000000).toFixed(1)}B</span>
              </div>
              <div className="flex justify-between">
                <span>Vốn lưu động:</span>
                <span className="font-medium text-green-600">{(analysis.working_capital.working_capital / 1000000000).toFixed(1)}B</span>
              </div>
              <div className="flex justify-between">
                <span>Tỷ số thanh khoản:</span>
                <span className="font-medium">{analysis.working_capital.ratio}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Phân tích chi phí</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {analysis.expense_breakdown.map((expense: any, index: number) => (
              <div key={index} className="space-y-1">
                <div className="flex justify-between">
                  <span>{expense.category}</span>
                  <span className="font-medium">{(expense.amount / 1000000).toFixed(0)}M ({expense.percentage}%)</span>
                </div>
                <Progress value={expense.percentage} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Main Enhanced AI Financial Intelligence Component
const EnhancedAIFinancialIntelligence: React.FC = () => {
  const [aiEngine] = useState(new AIFinancialIntelligence());
  const [activeTab, setActiveTab] = useState('cfo');
  const [loading, setLoading] = useState(false);
  const [analyses, setAnalyses] = useState<any>({});
  
  // Sample data for demonstration
  const sampleData = {
    total_revenue: 15000000000,
    total_expenses: 12000000000,
  };
  
  useEffect(() => {
    generateAllAnalyses();
  }, []);
  
  const generateAllAnalyses = async () => {
    setLoading(true);
    try {
      const cfoAnalysis = aiEngine.generateCFOAnalysis(sampleData);
      const accountantAnalysis = aiEngine.generateAccountantAnalysis(sampleData);
      const advisorAnalysis = aiEngine.generateFinancialAdvisorAnalysis(sampleData);
      const analystAnalysis = aiEngine.generateBusinessAnalystReport(sampleData);
      
      setAnalyses({
        cfo: cfoAnalysis,
        accountant: accountantAnalysis,
        advisor: advisorAnalysis,
        analyst: analystAnalysis
      });
    } catch (error) {
      console.error('Analysis generation error:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const exportAnalysis = () => {
    if (!analyses) return;
    
    const data = {
      analyses,
      export_time: new Date().toISOString(),
      company: 'LogiAI Logistics'
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `financial-intelligence-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Đang phân tích dữ liệu tài chính...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              AI Financial Intelligence System
            </span>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">
                <Zap className="h-3 w-3 mr-1" />
                AI-Powered
              </Badge>
              <Button variant="outline" size="sm" onClick={exportAnalysis}>
                <Download className="h-4 w-4 mr-2" />
                Xuất báo cáo
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
      </Card>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="cfo" className="flex items-center gap-2">
            <Briefcase className="h-4 w-4" />
            CFO Analysis
          </TabsTrigger>
          <TabsTrigger value="accountant" className="flex items-center gap-2">
            <Calculator className="h-4 w-4" />
            Accountant View
          </TabsTrigger>
          <TabsTrigger value="advisor" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Financial Advisor
          </TabsTrigger>
          <TabsTrigger value="analyst" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Business Analyst
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="cfo" className="space-y-4">
          <Alert>
            <Briefcase className="h-4 w-4" />
            <AlertDescription>
              Phân tích tài chính cấp cao từ góc nhìn Giám đốc Tài chính (CFO)
            </AlertDescription>
          </Alert>
          {analyses.cfo && <CFODashboard analysis={analyses.cfo} />}
        </TabsContent>
        
        <TabsContent value="accountant" className="space-y-4">
          <Alert>
            <Calculator className="h-4 w-4" />
            <AlertDescription>
              Phân tích kế toán chi tiết về công nợ, vốn lưu động và tuân thủ
            </AlertDescription>
          </Alert>
          {analyses.accountant && <AccountantView analysis={analyses.accountant} />}
        </TabsContent>
        
        <TabsContent value="advisor" className="space-y-4">
          <Alert>
            <TrendingUp className="h-4 w-4" />
            <AlertDescription>
              Tư vấn tài chính về đầu tư, dòng tiền và tối ưu hóa chi phí
            </AlertDescription>
          </Alert>
          <div className="text-center py-8">
            <p className="text-gray-500">Financial Advisor view coming soon...</p>
          </div>
        </TabsContent>
        
        <TabsContent value="analyst" className="space-y-4">
          <Alert>
            <BarChart3 className="h-4 w-4" />
            <AlertDescription>
              Phân tích kinh doanh về KPI, xu hướng và dự báo thị trường
            </AlertDescription>
          </Alert>
          <div className="text-center py-8">
            <p className="text-gray-500">Business Analyst view coming soon...</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnhancedAIFinancialIntelligence;
