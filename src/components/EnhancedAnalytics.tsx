'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui-components'
import { Badge } from '@/components/ui-components'
import { Button } from '@/components/ui-components'
import { Progress } from '@/components/ui-components'
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Package, 
  Truck, 
  Clock,
  MapPin,
  Users,
  BarChart3,
  PieChart,
  Activity,
  Target
} from 'lucide-react'

interface PerformanceMetric {
  title: string;
  value: string;
  change: number;
  trend: 'up' | 'down';
  icon: React.ReactNode;
  color: string;
}

interface RegionPerformance {
  region: string;
  deliveries: number;
  revenue: number;
  efficiency: number;
  mainCustomers: string[];
}

const EnhancedAnalytics = () => {
  const [timeRange, setTimeRange] = useState('7d');
  const [metrics, setMetrics] = useState<PerformanceMetric[]>([]);
  const [regionData, setRegionData] = useState<RegionPerformance[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    generateVietnameseAnalytics();
    const interval = setInterval(generateVietnameseAnalytics, 30000);
    return () => clearInterval(interval);
  }, [timeRange]);

  const generateVietnameseAnalytics = () => {
    // Vietnamese logistics performance metrics
    const performanceMetrics: PerformanceMetric[] = [
      {
        title: 'Tổng Doanh Thu',
        value: '₫ 2.8 tỷ',
        change: 12.5,
        trend: 'up',
        icon: <DollarSign className="w-5 h-5" />,
        color: 'text-green-400'
      },
      {
        title: 'Đơn Hàng Hoàn Thành',
        value: '1,247',
        change: 8.3,
        trend: 'up',
        icon: <Package className="w-5 h-5" />,
        color: 'text-blue-400'
      },
      {
        title: 'Hiệu Suất Giao Hàng',
        value: '94.2%',
        change: 2.1,
        trend: 'up',
        icon: <Target className="w-5 h-5" />,
        color: 'text-purple-400'
      },
      {
        title: 'Thời Gian Trung Bình',
        value: '2.4h',
        change: -5.7,
        trend: 'down',
        icon: <Clock className="w-5 h-5" />,
        color: 'text-orange-400'
      },
      {
        title: 'Xe Hoạt Động',
        value: '156',
        change: 4.2,
        trend: 'up',
        icon: <Truck className="w-5 h-5" />,
        color: 'text-cyan-400'
      },
      {
        title: 'Khách Hàng Hài Lòng',
        value: '96.8%',
        change: 1.9,
        trend: 'up',
        icon: <Users className="w-5 h-5" />,
        color: 'text-pink-400'
      }
    ];

    // Vietnamese regions performance
    const vietnameseRegions: RegionPerformance[] = [
      {
        region: 'TP. Hồ Chí Minh',
        deliveries: 450,
        revenue: 1200000000,
        efficiency: 96.5,
        mainCustomers: ['CP Việt Nam', 'Khai Anh CE', 'GAD']
      },
      {
        region: 'Đồng Bằng Sông Cửu Long',
        deliveries: 320,
        revenue: 850000000,
        efficiency: 92.3,
        mainCustomers: ['Rico Feed', 'Hùng Cá', 'Phát Tiến']
      },
      {
        region: 'Đông Nam Bộ',
        deliveries: 280,
        revenue: 750000000,
        efficiency: 94.1,
        mainCustomers: ['Japfa Comfeed', 'Vina Feed', 'Uni-President']
      },
      {
        region: 'Miền Trung',
        deliveries: 197,
        revenue: 520000000,
        efficiency: 89.7,
        mainCustomers: ['CJ Feed', 'Mavin', 'Sojitz']
      }
    ];

    setMetrics(performanceMetrics);
    setRegionData(vietnameseRegions);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      notation: 'compact'
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Phân Tích Thông Minh</h2>
          <p className="text-slate-400">Dashboard analytics cho logistics thức ăn chăn nuôi</p>
        </div>
        <div className="flex items-center gap-2">
          {['24h', '7d', '30d', '90d'].map((range) => (
            <Button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1 text-sm ${
                timeRange === range
                  ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                  : 'bg-slate-700/50 text-slate-400 hover:bg-slate-600/50'
              }`}
            >
              {range}
            </Button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {metrics.map((metric, index) => (
          <Card key={index} className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-slate-400 text-sm font-medium">{metric.title}</p>
                  <p className="text-2xl font-bold text-white">{metric.value}</p>
                  <div className="flex items-center gap-2">
                    {metric.trend === 'up' ? (
                      <TrendingUp className="w-4 h-4 text-green-400" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-400" />
                    )}
                    <span className={`text-sm font-medium ${
                      metric.trend === 'up' ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {metric.change > 0 ? '+' : ''}{metric.change}%
                    </span>
                    <span className="text-slate-400 text-sm">so với tuần trước</span>
                  </div>
                </div>
                <div className={`w-12 h-12 rounded-lg bg-slate-700/50 flex items-center justify-center ${metric.color}`}>
                  {metric.icon}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Regional Performance */}
      <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <MapPin className="w-5 h-5 text-blue-400" />
            Hiệu Suất Theo Vùng Miền
          </CardTitle>
          <CardDescription className="text-slate-400">
            Phân tích logistics theo các vùng kinh tế Việt Nam
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {regionData.map((region, index) => (
              <div key={index} className="p-4 bg-slate-700/30 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="text-white font-semibold">{region.region}</h3>
                    <p className="text-slate-400 text-sm">
                      Khách hàng chính: {region.mainCustomers.join(', ')}
                    </p>
                  </div>
                  <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                    {region.efficiency}% hiệu suất
                  </Badge>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">{region.deliveries}</div>
                    <div className="text-slate-400 text-sm">Đơn hàng</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-400">
                      {formatCurrency(region.revenue)}
                    </div>
                    <div className="text-slate-400 text-sm">Doanh thu</div>
                  </div>
                  <div className="text-center">
                    <div className="w-full bg-slate-600/50 rounded-full h-2 mb-2">
                      <div 
                        className="bg-blue-400 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${region.efficiency}%` }}
                      ></div>
                    </div>
                    <div className="text-slate-400 text-sm">Hiệu suất giao hàng</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Feed Types Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <PieChart className="w-5 h-5 text-purple-400" />
              Phân Loại Thức Ăn Chăn Nuôi
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { type: 'Thức ăn heo', percentage: 35, color: 'bg-blue-400' },
                { type: 'Thức ăn gà', percentage: 28, color: 'bg-green-400' },
                { type: 'Thức ăn cá tra', percentage: 22, color: 'bg-purple-400' },
                { type: 'Thức ăn bò', percentage: 15, color: 'bg-orange-400' }
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                    <span className="text-slate-300">{item.type}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-20 bg-slate-600/50 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${item.color}`}
                        style={{ width: `${item.percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-white font-medium w-10 text-right">{item.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-cyan-400" />
              Xu Hướng Hoạt Động
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-5 h-5 text-green-400" />
                  <div>
                    <div className="text-white font-medium">Tăng trưởng mạnh</div>
                    <div className="text-green-400 text-sm">Thức ăn thủy sản ĐBSCL</div>
                  </div>
                </div>
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                  +18.5%
                </Badge>
              </div>

              <div className="flex items-center justify-between p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <BarChart3 className="w-5 h-5 text-blue-400" />
                  <div>
                    <div className="text-white font-medium">Ổn định</div>
                    <div className="text-blue-400 text-sm">CP Group logistics</div>
                  </div>
                </div>
                <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                  +5.2%
                </Badge>
              </div>

              <div className="flex items-center justify-between p-3 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <Target className="w-5 h-5 text-purple-400" />
                  <div>
                    <div className="text-white font-medium">Cải thiện</div>
                    <div className="text-purple-400 text-sm">Hiệu suất giao hàng</div>
                  </div>
                </div>
                <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                  +3.1%
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EnhancedAnalytics;
