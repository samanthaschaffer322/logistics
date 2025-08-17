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
  Target,
  AlertTriangle,
  CheckCircle,
  Navigation2,
  Thermometer,
  Battery,
  Fuel,
  Settings,
  Calendar,
  FileText,
  Shield,
  Wrench,
  Plus,
  Download,
  RefreshCw,
  Phone,
  User
} from 'lucide-react'
import ComprehensiveRouteOptimizer from './ComprehensiveRouteOptimizer'
import InteractiveVietnamMap from './InteractiveVietnamMap'
import InteractiveOperationsPanel from './InteractiveOperationsPanel'
import EnhancedAnalytics from './EnhancedAnalytics'
import EnhancedTracking from './EnhancedTracking'
import AdvancedFleetManagement from './AdvancedFleetManagement'

interface OperationalMetric {
  title: string;
  value: string;
  change: number;
  trend: 'up' | 'down';
  icon: React.ReactNode;
  color: string;
  status: 'excellent' | 'good' | 'warning' | 'critical';
}

interface LiveAlert {
  id: string;
  type: 'traffic' | 'weather' | 'maintenance' | 'customs' | 'customer';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  location: string;
  timestamp: Date;
  vehicleAffected?: string;
}

const ComprehensiveLogisticsCenter = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [operationalMetrics, setOperationalMetrics] = useState<OperationalMetric[]>([]);
  const [liveAlerts, setLiveAlerts] = useState<LiveAlert[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    generateOperationalData();
    const interval = setInterval(generateOperationalData, 15000);
    return () => clearInterval(interval);
  }, []);

  const generateOperationalData = () => {
    // Real-time operational metrics
    const metrics: OperationalMetric[] = [
      {
        title: 'Doanh Thu Hôm Nay',
        value: '₫ 847M',
        change: 15.2,
        trend: 'up',
        icon: <DollarSign className="w-5 h-5" />,
        color: 'text-green-400',
        status: 'excellent'
      },
      {
        title: 'Đơn Hàng Hoàn Thành',
        value: '156/162',
        change: 96.3,
        trend: 'up',
        icon: <CheckCircle className="w-5 h-5" />,
        color: 'text-blue-400',
        status: 'excellent'
      },
      {
        title: 'Xe Đang Hoạt Động',
        value: '23/28',
        change: 82.1,
        trend: 'up',
        icon: <Truck className="w-5 h-5" />,
        color: 'text-purple-400',
        status: 'good'
      },
      {
        title: 'Hiệu Suất Trung Bình',
        value: '94.7%',
        change: 2.3,
        trend: 'up',
        icon: <Target className="w-5 h-5" />,
        color: 'text-cyan-400',
        status: 'excellent'
      },
      {
        title: 'Cảnh Báo Bảo Trì',
        value: '3',
        change: -25.0,
        trend: 'down',
        icon: <AlertTriangle className="w-5 h-5" />,
        color: 'text-orange-400',
        status: 'warning'
      },
      {
        title: 'Khách Hàng Hài Lòng',
        value: '97.2%',
        change: 1.8,
        trend: 'up',
        icon: <Users className="w-5 h-5" />,
        color: 'text-pink-400',
        status: 'excellent'
      }
    ];

    // Live alerts based on Vietnamese logistics experience
    const alerts: LiveAlert[] = [
      {
        id: 'AL001',
        type: 'traffic',
        severity: 'high',
        message: 'Tắc đường nghiêm trọng Quận 7 - Cảng Cát Lái, chậm 45 phút',
        location: 'Cầu Phú Mỹ',
        timestamp: new Date(),
        vehicleAffected: '50H53777'
      },
      {
        id: 'AL002',
        type: 'weather',
        severity: 'medium',
        message: 'Mưa lớn tại ĐBSCL, tuyến Hậu Giang có thể chậm 30%',
        location: 'Hậu Giang',
        timestamp: new Date(Date.now() - 300000),
        vehicleAffected: '51C76124'
      },
      {
        id: 'AL003',
        type: 'customs',
        severity: 'low',
        message: 'Hải quan Cát Lái kiểm tra ngẫu nhiên, dự kiến +20 phút',
        location: 'Cảng Cát Lái',
        timestamp: new Date(Date.now() - 600000)
      },
      {
        id: 'AL004',
        type: 'customer',
        severity: 'high',
        message: 'CP TIỀN GIANG yêu cầu giao hàng sớm 30 phút',
        location: 'CP TIỀN GIANG',
        timestamp: new Date(Date.now() - 900000),
        vehicleAffected: '51C63836'
      }
    ];

    setOperationalMetrics(metrics);
    setLiveAlerts(alerts);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'border-green-500/30 bg-green-500/10';
      case 'good': return 'border-blue-500/30 bg-blue-500/10';
      case 'warning': return 'border-yellow-500/30 bg-yellow-500/10';
      case 'critical': return 'border-red-500/30 bg-red-500/10';
      default: return 'border-gray-500/30 bg-gray-500/10';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'high': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'low': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'traffic': return <Navigation2 className="w-4 h-4" />;
      case 'weather': return <Thermometer className="w-4 h-4" />;
      case 'maintenance': return <Wrench className="w-4 h-4" />;
      case 'customs': return <FileText className="w-4 h-4" />;
      case 'customer': return <Users className="w-4 h-4" />;
      default: return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    generateOperationalData();
    setRefreshing(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Trung Tâm Vận Hành Logistics</h1>
          <p className="text-slate-400">Được hỗ trợ bởi AI với 35 năm kinh nghiệm logistics Việt Nam</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-sm text-slate-400">Cập nhật lần cuối</div>
            <div className="text-white font-mono">{new Date().toLocaleTimeString('vi-VN')}</div>
          </div>
          <Button 
            onClick={handleRefresh}
            disabled={refreshing}
            className="bg-blue-500/20 text-blue-400 border border-blue-500/30 hover:bg-blue-500/30"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Làm mới
          </Button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2">
        {[
          { id: 'overview', label: 'Tổng Quan', icon: <BarChart3 className="w-4 h-4" /> },
          { id: 'operations', label: 'Điều Khiển Vận Hành', icon: <Settings className="w-4 h-4" /> },
          { id: 'routes', label: 'Tối Ưu Tuyến Đường', icon: <Navigation2 className="w-4 h-4" /> },
          { id: 'map', label: 'Bản Đồ Tương Tác', icon: <MapPin className="w-4 h-4" /> },
          { id: 'tracking', label: 'Theo Dõi Real-time', icon: <Activity className="w-4 h-4" /> },
          { id: 'fleet', label: 'Quản Lý Đội Xe', icon: <Truck className="w-4 h-4" /> },
          { id: 'analytics', label: 'Phân Tích Thông Minh', icon: <PieChart className="w-4 h-4" /> }
        ].map((tab) => (
          <Button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 ${
              activeTab === tab.id
                ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                : 'bg-slate-700/50 text-slate-400 hover:bg-slate-600/50'
            }`}
          >
            {tab.icon}
            {tab.label}
          </Button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Real-time Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {operationalMetrics.map((metric, index) => (
              <Card key={index} className={`bg-slate-800/50 backdrop-blur-sm border-slate-700/50 ${getStatusColor(metric.status)}`}>
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
                        <span className="text-slate-400 text-sm">hôm nay</span>
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

          {/* Live Alerts */}
          <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-orange-400" />
                Cảnh Báo Trực Tiếp
              </CardTitle>
              <CardDescription className="text-slate-400">
                Thông tin real-time về tình hình giao thông, thời tiết, và vận hành
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {liveAlerts.map((alert) => (
                  <div key={alert.id} className="flex items-start gap-3 p-3 bg-slate-700/30 rounded-lg">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${getSeverityColor(alert.severity)}`}>
                      {getAlertIcon(alert.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-white font-medium">{alert.location}</span>
                        <Badge className={getSeverityColor(alert.severity)}>
                          {alert.severity.toUpperCase()}
                        </Badge>
                        {alert.vehicleAffected && (
                          <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                            {alert.vehicleAffected}
                          </Badge>
                        )}
                      </div>
                      <p className="text-slate-300 text-sm">{alert.message}</p>
                      <p className="text-slate-400 text-xs mt-1">
                        {alert.timestamp.toLocaleTimeString('vi-VN')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Activity className="w-5 h-5 text-green-400" />
                  Hiệu Suất Hôm Nay
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { label: 'Đúng giờ giao hàng', value: 96.3, color: 'bg-green-400' },
                    { label: 'Tối ưu hóa tuyến đường', value: 94.7, color: 'bg-blue-400' },
                    { label: 'Tiết kiệm nhiên liệu', value: 87.2, color: 'bg-purple-400' },
                    { label: 'Hài lòng khách hàng', value: 97.2, color: 'bg-pink-400' }
                  ].map((item, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-300 text-sm">{item.label}</span>
                        <span className="text-white font-medium">{item.value}%</span>
                      </div>
                      <div className="w-full bg-slate-600/50 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${item.color}`}
                          style={{ width: `${item.value}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-blue-400" />
                  Tình Hình Vùng Miền
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { region: 'TP. Hồ Chí Minh', status: 'Bình thường', vehicles: 12, color: 'text-green-400' },
                    { region: 'ĐBSCL', status: 'Mưa nhẹ', vehicles: 8, color: 'text-yellow-400' },
                    { region: 'Đông Nam Bộ', status: 'Tốt', vehicles: 6, color: 'text-green-400' },
                    { region: 'Miền Trung', status: 'Bình thường', vehicles: 2, color: 'text-green-400' }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-slate-700/30 rounded">
                      <div>
                        <div className="text-white font-medium">{item.region}</div>
                        <div className={`text-sm ${item.color}`}>{item.status}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-white font-medium">{item.vehicles} xe</div>
                        <div className="text-slate-400 text-sm">đang hoạt động</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Other Tabs */}
      {activeTab === 'operations' && <InteractiveOperationsPanel />}
      {activeTab === 'routes' && <ComprehensiveRouteOptimizer />}
      {activeTab === 'map' && <InteractiveVietnamMap />}
      {activeTab === 'tracking' && <EnhancedTracking />}
      {activeTab === 'fleet' && <AdvancedFleetManagement />}
      {activeTab === 'analytics' && <EnhancedAnalytics />}
    </div>
  );
};

export default ComprehensiveLogisticsCenter;
