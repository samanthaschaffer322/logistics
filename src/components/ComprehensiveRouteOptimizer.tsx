'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui-components'
import { Button } from '@/components/ui-components'
import { Input } from '@/components/ui-components'
import { Label } from '@/components/ui-components'
import { Badge } from '@/components/ui-components'
import { 
  MapPin, 
  Navigation, 
  Clock, 
  Fuel, 
  AlertTriangle, 
  RefreshCw, 
  TrendingUp,
  DollarSign,
  Truck,
  Calendar,
  Target,
  CheckCircle,
  XCircle,
  Info
} from 'lucide-react'

interface RouteAnalysis {
  origin: string;
  destination: string;
  distance: number;
  baseDuration: number;
  optimizedDuration: number;
  constraints: string[];
  optimizedRoute: string[];
  bestDepartureTimes: string[];
  alternativeTimes: string[];
  costOptimization: string[];
  trafficAnalysis: {
    peakHours: string[];
    avoidRoads: string[];
    recommendedRoads: string[];
  };
  recommendations: string[];
}

const ComprehensiveRouteOptimizer = () => {
  const [selectedRoute, setSelectedRoute] = useState<string>('cat-lai-chim-en');
  const [routeAnalysis, setRouteAnalysis] = useState<RouteAnalysis | null>(null);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [customOrigin, setCustomOrigin] = useState('');
  const [customDestination, setCustomDestination] = useState('');

  const VIETNAMESE_ROUTES = {
    'cat-lai-chim-en': {
      name: 'Cảng Cát Lái → KHO CHIM ÉN',
      description: 'Tuyến container chính - 450+ lần/tháng'
    },
    'vung-tau-long-an': {
      name: 'Cảng Vũng Tàu → KHO LONG AN',
      description: 'Tuyến thủy sản - 38 lần/tháng'
    },
    'chim-en-cp-tien-giang': {
      name: 'KHO CHIM ÉN → CP TIỀN GIANG',
      description: 'Phân phối CP Group - 32 lần/tháng'
    },
    'chim-en-rico-hau-giang': {
      name: 'KHO CHIM ÉN → RICO HẬU GIANG',
      description: 'Tuyến ĐBSCL - 10 lần/tháng'
    },
    'custom': {
      name: 'Tuyến tùy chỉnh',
      description: 'Nhập địa điểm tùy chỉnh'
    }
  };

  useEffect(() => {
    if (selectedRoute !== 'custom') {
      analyzeRoute(selectedRoute);
    }
  }, [selectedRoute]);

  const analyzeRoute = async (routeKey: string) => {
    setIsOptimizing(true);
    
    // Simulate detailed analysis
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    let analysis: RouteAnalysis;
    
    switch (routeKey) {
      case 'cat-lai-chim-en':
        analysis = {
          origin: 'Cảng Cát Lái (Quận 2, TP.HCM)',
          destination: 'KHO CHIM ÉN (Bình Chánh, TP.HCM)',
          distance: 25,
          baseDuration: 1.5,
          optimizedDuration: 1.25,
          constraints: [
            'Container >10T cấm vào nội thành 06:00-09:00 và 16:00-20:00',
            'Cảng Cát Lái tắc nghẽn 05:30-08:30',
            'Đồng Văn Cống tắc nghiêm trọng buổi sáng',
            'Cầu Võ Chí Công điểm nghẽn chính'
          ],
          optimizedRoute: [
            'Cảng Cát Lái',
            'Đồng Văn Cống',
            'Võ Chí Công',
            'Cầu Võ Chí Công',
            'Nguyễn Văn Linh',
            'Quốc Lộ 50',
            'KHO CHIM ÉN'
          ],
          bestDepartureTimes: ['04:30', '04:45', '05:00'],
          alternativeTimes: ['13:30', '14:00', '14:30'],
          costOptimization: [
            'Giữ tốc độ ổn định ~50 km/h trên Nguyễn Văn Linh',
            'Sử dụng Nguyễn Văn Linh (có phí nhưng nhanh hơn)',
            'Tránh Đồng Văn Cống giờ cao điểm tiết kiệm 30 phút'
          ],
          trafficAnalysis: {
            peakHours: ['06:00-09:00', '16:00-20:00'],
            avoidRoads: ['Đồng Văn Cống (sáng)', 'Mai Chí Thọ → Võ Chí Công'],
            recommendedRoads: ['Nguyễn Văn Linh', 'Quốc Lộ 50', 'Cầu Võ Chí Công']
          },
          recommendations: [
            'Khởi hành 04:30-05:00 để tránh hàng đợi cảng',
            'Đến KHO CHIM ÉN lúc 06:00 (đúng giờ ca làm)',
            'Ca đêm 22:00-04:00: ít tắc nhất, tiết kiệm nhiên liệu',
            'Tích hợp GPS + API giao thông để tự động chuyển hướng'
          ]
        };
        break;
        
      case 'vung-tau-long-an':
        analysis = {
          origin: 'Cảng Vũng Tàu (Bà Rịa - Vũng Tàu)',
          destination: 'KHO LONG AN (Long An)',
          distance: 120,
          baseDuration: 3.5,
          optimizedDuration: 3.0,
          constraints: [
            'Cảng Vũng Tàu mở cửa 06:00-18:00',
            'Container thủy sản cần kiểm tra nghiêm ngặt',
            'Đường Vũng Tàu - Long An mùa mưa ngập',
            'Thức ăn thủy sản cần bảo quản lạnh <25°C'
          ],
          optimizedRoute: [
            'Cảng Vũng Tàu',
            'QL51',
            'Cao tốc TP.HCM - Long Thành',
            'QL1A',
            'Tỉnh lộ 830',
            'KHO LONG AN'
          ],
          bestDepartureTimes: ['05:00', '05:30', '06:00'],
          alternativeTimes: ['13:00', '13:30', '14:00'],
          costOptimization: [
            'Sử dụng cao tốc tiết kiệm 45 phút',
            'Container có hệ thống làm lạnh',
            'Tránh QL1A giờ cao điểm'
          ],
          trafficAnalysis: {
            peakHours: ['07:00-09:00', '17:00-19:00'],
            avoidRoads: ['QL1A (giờ cao điểm)', 'Đường tỉnh mùa mưa'],
            recommendedRoads: ['Cao tốc TP.HCM - Long Thành', 'QL51', 'Tỉnh lộ 830']
          },
          recommendations: [
            'Khởi hành 05:00 tránh nắng nóng ảnh hưởng chất lượng',
            'Container có hệ thống làm lạnh hoạt động',
            'Kiểm tra thời tiết trước khi khởi hành',
            'Liên hệ trước với KHO LONG AN để chuẩn bị nhận hàng lạnh'
          ]
        };
        break;
        
      case 'chim-en-cp-tien-giang':
        analysis = {
          origin: 'KHO CHIM ÉN (Bình Chánh, TP.HCM)',
          destination: 'CP TIỀN GIANG (Tiền Giang)',
          distance: 85,
          baseDuration: 2.8,
          optimizedDuration: 2.5,
          constraints: [
            'CP TIỀN GIANG nhận hàng từ 06:00',
            'Thức ăn heo tránh nắng nóng >35°C',
            'Cao tốc TP.HCM - Trung Lương tắc 07:30-08:30',
            'CP Group yêu cầu đúng giờ 100%'
          ],
          optimizedRoute: [
            'KHO CHIM ÉN',
            'Quốc Lộ 50',
            'Cao tốc TP.HCM - Trung Lương',
            'Quốc Lộ 1A',
            'Tỉnh lộ 866',
            'CP TIỀN GIANG'
          ],
          bestDepartureTimes: ['07:00', '07:15', '07:30'],
          alternativeTimes: ['13:00', '13:30', '14:00'],
          costOptimization: [
            'Cao tốc nhanh hơn 30 phút, đáng giá phí',
            'Tránh QL1A đoạn Tân An (tắc)',
            'Xe 15 tấn phù hợp tuyến này'
          ],
          trafficAnalysis: {
            peakHours: ['07:30-08:30', '17:00-18:30'],
            avoidRoads: ['QL1A đoạn Tân An', 'Tỉnh lộ nhỏ mùa mưa'],
            recommendedRoads: ['Cao tốc TP.HCM - Trung Lương', 'Tỉnh lộ 866']
          },
          recommendations: [
            'Khởi hành 07:00 đến CP đúng 09:30',
            'CP Group là khách hàng VIP - ưu tiên tuyệt đối',
            'Kiểm tra nhiệt độ thức ăn trước khi giao',
            'Liên hệ trước 30 phút để CP chuẩn bị nhận hàng'
          ]
        };
        break;
        
      case 'chim-en-rico-hau-giang':
        analysis = {
          origin: 'KHO CHIM ÉN (Bình Chánh, TP.HCM)',
          destination: 'RICO HẬU GIANG (Hậu Giang)',
          distance: 180,
          baseDuration: 4.5,
          optimizedDuration: 5.0,
          constraints: [
            'Tuyến ĐBSCL mùa mưa chậm +25-30%',
            'Rico Feed nhận hàng từ 08:00',
            'Thức ăn cá cần tránh ẩm ướt',
            'Cầu phao có thể đóng khi triều cường'
          ],
          optimizedRoute: [
            'KHO CHIM ÉN',
            'Quốc Lộ 50',
            'Cao tốc Trung Lương - Mỹ Thuận',
            'Quốc Lộ 1A',
            'Tỉnh lộ 922',
            'RICO HẬU GIANG'
          ],
          bestDepartureTimes: ['06:30', '07:00', '07:30'],
          alternativeTimes: ['13:00', '13:30'],
          costOptimization: [
            'Cao tốc Trung Lương - Mỹ Thuận tiết kiệm 1 giờ',
            'Xe chuyên dụng thức ăn cá có mui bạt',
            'Dự phòng thời gian mùa mưa'
          ],
          trafficAnalysis: {
            peakHours: ['Không rõ ràng ở ĐBSCL'],
            avoidRoads: ['Đường tỉnh lộ hẹp', 'Cầu phao khi triều cường'],
            recommendedRoads: ['Cao tốc Trung Lương - Mỹ Thuận', 'QL1A', 'Tỉnh lộ 922']
          },
          recommendations: [
            'Khởi hành 06:30 dự phòng thời tiết',
            'Kiểm tra tình hình triều cường trước khi đi',
            'Xe có mui bạt chống ẩm cho thức ăn cá',
            'Liên hệ Rico Feed để xác nhận tình hình đường'
          ]
        };
        break;
        
      default:
        analysis = {
          origin: customOrigin || 'Chưa chọn',
          destination: customDestination || 'Chưa chọn',
          distance: 0,
          baseDuration: 0,
          optimizedDuration: 0,
          constraints: [],
          optimizedRoute: [],
          bestDepartureTimes: [],
          alternativeTimes: [],
          costOptimization: [],
          trafficAnalysis: {
            peakHours: [],
            avoidRoads: [],
            recommendedRoads: []
          },
          recommendations: []
        };
    }
    
    setRouteAnalysis(analysis);
    setIsOptimizing(false);
  };

  const handleCustomAnalysis = () => {
    if (customOrigin && customDestination) {
      analyzeRoute('custom');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Tối Ưu Tuyến Đường Tổng Hợp</h2>
          <p className="text-slate-400">Phân tích chi tiết với 35 năm kinh nghiệm đường Việt Nam</p>
        </div>
        <Button 
          onClick={() => analyzeRoute(selectedRoute)}
          disabled={isOptimizing}
          className="bg-blue-500/20 text-blue-400 border border-blue-500/30 hover:bg-blue-500/30"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${isOptimizing ? 'animate-spin' : ''}`} />
          Phân tích lại
        </Button>
      </div>

      {/* Route Selection */}
      <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Navigation className="w-5 h-5 text-blue-400" />
            Chọn Tuyến Đường
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(VIETNAMESE_ROUTES).map(([key, route]) => (
              <Button
                key={key}
                onClick={() => setSelectedRoute(key)}
                className={`p-4 h-auto text-left ${
                  selectedRoute === key
                    ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                    : 'bg-slate-700/50 text-slate-300 hover:bg-slate-600/50'
                }`}
              >
                <div>
                  <div className="font-medium">{route.name}</div>
                  <div className="text-sm opacity-75">{route.description}</div>
                </div>
              </Button>
            ))}
          </div>

          {selectedRoute === 'custom' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-slate-700/30 rounded-lg">
              <div>
                <Label className="text-slate-300">Điểm đi</Label>
                <Input
                  value={customOrigin}
                  onChange={(e) => setCustomOrigin(e.target.value)}
                  placeholder="VD: Cảng Cát Lái"
                  className="bg-slate-700/50 border-slate-600 text-white"
                />
              </div>
              <div>
                <Label className="text-slate-300">Điểm đến</Label>
                <Input
                  value={customDestination}
                  onChange={(e) => setCustomDestination(e.target.value)}
                  placeholder="VD: KHO CHIM ÉN"
                  className="bg-slate-700/50 border-slate-600 text-white"
                />
              </div>
              <div className="md:col-span-2">
                <Button
                  onClick={handleCustomAnalysis}
                  disabled={!customOrigin || !customDestination || isOptimizing}
                  className="bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500/30"
                >
                  <Target className="w-4 h-4 mr-2" />
                  Phân tích tuyến tùy chỉnh
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Route Analysis Results */}
      {isOptimizing ? (
        <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50">
          <CardContent className="p-8 text-center">
            <RefreshCw className="w-8 h-8 text-blue-400 animate-spin mx-auto mb-4" />
            <p className="text-white font-medium">Đang phân tích tuyến đường...</p>
            <p className="text-slate-400 text-sm">Tính toán tối ưu với dữ liệu thực tế Việt Nam</p>
          </CardContent>
        </Card>
      ) : routeAnalysis && (
        <div className="space-y-6">
          {/* Route Overview */}
          <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <MapPin className="w-5 h-5 text-green-400" />
                📍 Phân Tích Tuyến Đường
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div>
                    <Label className="text-slate-400">Điểm đi</Label>
                    <p className="text-white font-medium">{routeAnalysis.origin}</p>
                  </div>
                  <div>
                    <Label className="text-slate-400">Điểm đến</Label>
                    <p className="text-white font-medium">{routeAnalysis.destination}</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <Label className="text-slate-400">Khoảng cách</Label>
                    <p className="text-white font-medium">~{routeAnalysis.distance} km</p>
                  </div>
                  <div>
                    <Label className="text-slate-400">Thời gian</Label>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400 line-through">{routeAnalysis.baseDuration}h</span>
                      <span className="text-green-400 font-medium">{routeAnalysis.optimizedDuration}h</span>
                      <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                        Tối ưu
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Constraints */}
          <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-orange-400" />
                ⚠️ Ràng Buộc Container/Truck
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {routeAnalysis.constraints.map((constraint, index) => (
                  <div key={index} className="flex items-start gap-2 p-2 bg-orange-500/10 border border-orange-500/30 rounded">
                    <AlertTriangle className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
                    <span className="text-orange-300 text-sm">{constraint}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Optimized Route */}
          <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Navigation className="w-5 h-5 text-blue-400" />
                🚛 Tuyến Đường Tối Ưu
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-2">
                  {routeAnalysis.optimizedRoute.map((point, index) => (
                    <React.Fragment key={index}>
                      <div className="flex items-center gap-2 px-3 py-1 bg-blue-500/20 border border-blue-500/30 rounded-full">
                        <MapPin className="w-3 h-3 text-blue-400" />
                        <span className="text-blue-300 text-sm">{point}</span>
                      </div>
                      {index < routeAnalysis.optimizedRoute.length - 1 && (
                        <span className="text-slate-400">→</span>
                      )}
                    </React.Fragment>
                  ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-slate-400">Giờ khởi hành tối ưu</Label>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {routeAnalysis.bestDepartureTimes.map((time, index) => (
                        <Badge key={index} className="bg-green-500/20 text-green-400 border-green-500/30">
                          <Clock className="w-3 h-3 mr-1" />
                          {time}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <Label className="text-slate-400">Giờ thay thế</Label>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {routeAnalysis.alternativeTimes.map((time, index) => (
                        <Badge key={index} className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                          <Clock className="w-3 h-3 mr-1" />
                          {time}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Cost Optimization */}
          <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-green-400" />
                💰 Tối Ưu Chi Phí
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {routeAnalysis.costOptimization.map((tip, index) => (
                  <div key={index} className="flex items-start gap-2 p-2 bg-green-500/10 border border-green-500/30 rounded">
                    <DollarSign className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span className="text-green-300 text-sm">{tip}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recommendations */}
          <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-purple-400" />
                📊 Khuyến Nghị Chi Tiết
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {routeAnalysis.recommendations.map((rec, index) => (
                  <div key={index} className="flex items-start gap-2 p-3 bg-purple-500/10 border border-purple-500/30 rounded">
                    <CheckCircle className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
                    <span className="text-purple-300 text-sm">{rec}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Final Answer */}
          <Card className="bg-gradient-to-r from-blue-500/10 to-green-500/10 border-blue-500/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Target className="w-5 h-5 text-blue-400" />
                ✅ Kết Luận Cuối Cùng
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-4 bg-blue-500/20 border border-blue-500/30 rounded-lg">
                  <p className="text-blue-300 font-medium">
                    👉 Tuyến tối ưu nhất: {routeAnalysis.optimizedRoute.join(' → ')}
                  </p>
                </div>
                <div className="p-4 bg-green-500/20 border border-green-500/30 rounded-lg">
                  <p className="text-green-300 font-medium">
                    ⏱️ Thời gian di chuyển: ~{routeAnalysis.optimizedDuration}h (thay vì {routeAnalysis.baseDuration}h ở giờ cao điểm)
                  </p>
                </div>
                <div className="p-4 bg-purple-500/20 border border-purple-500/30 rounded-lg">
                  <p className="text-purple-300 font-medium">
                    🕐 Khởi hành tối ưu: {routeAnalysis.bestDepartureTimes.join(' hoặc ')} để tránh cấm xe và tắc đường
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ComprehensiveRouteOptimizer;
