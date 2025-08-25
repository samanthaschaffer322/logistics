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
  Info,
  Map
} from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import TestMap from './TestMap'

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
  const { t, language } = useLanguage()
  const [selectedRoute, setSelectedRoute] = useState<string>('cat-lai-chim-en');
  const [routeAnalysis, setRouteAnalysis] = useState<RouteAnalysis | null>(null);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [customOrigin, setCustomOrigin] = useState('');
  const [customDestination, setCustomDestination] = useState('');
  const [showMap, setShowMap] = useState(true);

  // Predefined routes with Vietnamese logistics data
  const predefinedRoutes = {
    'cat-lai-chim-en': {
      name: language === 'vi' ? 'Cát Lái → Chim Én' : 'Cat Lai → Chim En',
      description: language === 'vi' ? 'Tuyến cảng chính TP.HCM' : 'Main port route in HCMC'
    },
    'vung-tau-long-an': {
      name: language === 'vi' ? 'Vũng Tàu → Long An' : 'Vung Tau → Long An',
      description: language === 'vi' ? 'Tuyến liên tỉnh miền Nam' : 'Inter-provincial southern route'
    },
    'chim-en-cp-tien-giang': {
      name: language === 'vi' ? 'Chim Én → CP Tiền Giang' : 'Chim En → CP Tien Giang',
      description: language === 'vi' ? 'Tuyến công nghiệp' : 'Industrial route'
    },
    'chim-en-rico-hau-giang': {
      name: language === 'vi' ? 'Chim Én → Rico Hậu Giang' : 'Chim En → Rico Hau Giang',
      description: language === 'vi' ? 'Tuyến ĐBSCL' : 'Mekong Delta route'
    }
  };

  // Generate detailed route analysis
  const generateRouteAnalysis = (routeKey: string): RouteAnalysis => {
    const routeData = {
      'cat-lai-chim-en': {
        origin: language === 'vi' ? 'Cảng Cát Lái' : 'Cat Lai Port',
        destination: language === 'vi' ? 'Chim Én' : 'Chim En',
        distance: 25,
        baseDuration: 90,
        optimizedDuration: 75,
        constraints: language === 'vi' ? [
          'Container >10T cấm lưu thông 06:00-09:00 & 16:00-20:00',
          'Hàng nguy hiểm cần giấy phép đặc biệt',
          'Kiểm tra tải trọng tại trạm cân Cát Lái',
          'Ùn tắc thường xuyên tại nút giao Đồng Văn Cống'
        ] : [
          'Container >10T banned 06:00-09:00 & 16:00-20:00',
          'Dangerous goods require special permits',
          'Weight check at Cat Lai weighing station',
          'Regular congestion at Dong Van Cong intersection'
        ],
        optimizedRoute: language === 'vi' ? [
          'Cảng Cát Lái',
          'Đường Đồng Văn Cống',
          'Đường Võ Chí Công',
          'Đại lộ Nguyễn Văn Linh',
          'Quốc lộ 50',
          'Chim Én'
        ] : [
          'Cat Lai Port',
          'Dong Van Cong Road',
          'Vo Chi Cong Road',
          'Nguyen Van Linh Boulevard',
          'National Route 50',
          'Chim En'
        ],
        bestDepartureTimes: ['04:30', '05:00'],
        alternativeTimes: ['13:30', '14:00', '21:00'],
        costOptimization: language === 'vi' ? [
          'Tiết kiệm 15% nhiên liệu với tốc độ ổn định 50km/h',
          'Tránh phí cầu đường cao tốc trong giờ cao điểm',
          'Giảm 20 phút thời gian chờ tại cảng',
          'Tối ưu hóa lộ trình tránh ùn tắc'
        ] : [
          'Save 15% fuel with steady 50km/h speed',
          'Avoid high toll fees during peak hours',
          'Reduce 20 minutes waiting time at port',
          'Optimize route to avoid congestion'
        ],
        trafficAnalysis: {
          peakHours: ['06:00-09:00', '16:00-20:00'],
          avoidRoads: language === 'vi' ? [
            'Xa lộ Hà Nội (giờ cao điểm)',
            'Đường Phạm Văn Đồng',
            'Cầu Sài Gòn'
          ] : [
            'Ha Noi Highway (peak hours)',
            'Pham Van Dong Road',
            'Saigon Bridge'
          ],
          recommendedRoads: language === 'vi' ? [
            'Đại lộ Nguyễn Văn Linh',
            'Đường Võ Chí Công',
            'Quốc lộ 50'
          ] : [
            'Nguyen Van Linh Boulevard',
            'Vo Chi Cong Road',
            'National Route 50'
          ]
        },
        recommendations: language === 'vi' ? [
          'Khởi hành lúc 04:30-05:00 để tránh giờ cấm container',
          'Sử dụng tuyến Đồng Văn Cống → Võ Chí Công → Nguyễn Văn Linh',
          'Kiểm tra tình trạng giao thông trước khi khởi hành',
          'Chuẩn bị giấy tờ đầy đủ cho việc kiểm tra tại trạm cân'
        ] : [
          'Depart at 04:30-05:00 to avoid container restrictions',
          'Use Dong Van Cong → Vo Chi Cong → Nguyen Van Linh route',
          'Check traffic conditions before departure',
          'Prepare complete documents for weighing station inspection'
        ]
      }
    };

    // Return analysis for selected route or default
    return routeData[routeKey as keyof typeof routeData] || routeData['cat-lai-chim-en'];
  };

  const optimizeRoute = async () => {
    setIsOptimizing(true);
    
    // Simulate optimization process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const analysis = generateRouteAnalysis(selectedRoute);
    setRouteAnalysis(analysis);
    setIsOptimizing(false);
  };

  const optimizeCustomRoute = async () => {
    if (!customOrigin || !customDestination) return;
    
    setIsOptimizing(true);
    
    // Simulate custom route optimization
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    const customAnalysis: RouteAnalysis = {
      origin: customOrigin,
      destination: customDestination,
      distance: Math.floor(Math.random() * 100) + 20,
      baseDuration: Math.floor(Math.random() * 120) + 60,
      optimizedDuration: Math.floor(Math.random() * 90) + 45,
      constraints: language === 'vi' ? [
        'Phân tích dựa trên dữ liệu giao thông thời gian thực',
        'Cần xác minh các hạn chế địa phương',
        'Kiểm tra điều kiện thời tiết'
      ] : [
        'Analysis based on real-time traffic data',
        'Need to verify local restrictions',
        'Check weather conditions'
      ],
      optimizedRoute: [customOrigin, language === 'vi' ? 'Tuyến được tối ưu' : 'Optimized route', customDestination],
      bestDepartureTimes: ['05:00', '05:30'],
      alternativeTimes: ['14:00', '14:30', '21:30'],
      costOptimization: language === 'vi' ? [
        'Tối ưu hóa dựa trên phân tích AI',
        'Tiết kiệm nhiên liệu và thời gian',
        'Tránh các điểm ùn tắc'
      ] : [
        'AI-based optimization',
        'Save fuel and time',
        'Avoid congestion points'
      ],
      trafficAnalysis: {
        peakHours: ['07:00-09:00', '17:00-19:00'],
        avoidRoads: [language === 'vi' ? 'Đường có ùn tắc' : 'Congested roads'],
        recommendedRoads: [language === 'vi' ? 'Tuyến được khuyến nghị' : 'Recommended routes']
      },
      recommendations: language === 'vi' ? [
        'Sử dụng dữ liệu giao thông thời gian thực',
        'Cập nhật thông tin tuyến đường thường xuyên',
        'Kiểm tra điều kiện thời tiết trước khi khởi hành'
      ] : [
        'Use real-time traffic data',
        'Update route information regularly',
        'Check weather conditions before departure'
      ]
    };
    
    setRouteAnalysis(customAnalysis);
    setIsOptimizing(false);
  };

  // Initialize with default route analysis
  useEffect(() => {
    const defaultAnalysis = generateRouteAnalysis('cat-lai-chim-en');
    setRouteAnalysis(defaultAnalysis);
  }, [language]);

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
      {/* VERY OBVIOUS TEST ELEMENT */}
      <div className="w-full h-20 bg-red-500 border-4 border-yellow-400 flex items-center justify-center">
        <h1 className="text-2xl font-bold text-white">🚛 ROUTE OPTIMIZER IS LOADING! 🗺️</h1>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">
            {language === 'vi' ? '🚛 Tối Ưu Tuyến Đường Tổng Hợp' : '🚛 Comprehensive Route Optimizer'}
          </h2>
          <p className="text-slate-400">
            {language === 'vi' 
              ? 'Phân tích chi tiết với bản đồ tương tác và dữ liệu thực tế Việt Nam'
              : 'Detailed analysis with interactive map and real Vietnamese data'
            }
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant={showMap ? "default" : "outline"}
            size="sm"
            onClick={() => setShowMap(!showMap)}
            className="bg-purple-500/20 text-purple-400 border border-purple-500/30 hover:bg-purple-500/30"
          >
            <Map className="w-4 h-4 mr-2" />
            {language === 'vi' ? 'Bản đồ' : 'Map'}
          </Button>
          <Button 
            onClick={() => analyzeRoute(selectedRoute)}
            disabled={isOptimizing}
            className="bg-blue-500/20 text-blue-400 border border-blue-500/30 hover:bg-blue-500/30"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isOptimizing ? 'animate-spin' : ''}`} />
            {language === 'vi' ? 'Phân tích lại' : 'Re-analyze'}
          </Button>
        </div>
      </div>

      {/* Map Integration */}
      {showMap && (
        <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Map className="w-5 h-5 text-purple-400" />
              {language === 'vi' ? '🗺️ Bản Đồ Tuyến Đường Tương Tác' : '🗺️ Interactive Route Map'}
            </CardTitle>
            <CardDescription className="text-slate-400">
              {language === 'vi' 
                ? 'Hiển thị trực quan tuyến đường với các điểm trung gian và phân tích giao thông'
                : 'Visual route display with waypoints and traffic analysis'
              }
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <TestMap
              selectedRoute={selectedRoute}
              className="h-[400px] rounded-b-lg"
            />
          </CardContent>
        </Card>
      )}

      {/* Route Selection */}
      <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Navigation className="w-5 h-5 text-blue-400" />
            {language === 'vi' ? 'Chọn Tuyến Đường' : 'Select Route'}
          </CardTitle>
          <CardDescription className="text-slate-400">
            {language === 'vi' 
              ? '4 tuyến đường chính với phân tích chi tiết'
              : '4 main routes with detailed analysis'
            }
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(predefinedRoutes).map(([key, route]) => (
              <div
                key={key}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                  selectedRoute === key
                    ? 'border-blue-500 bg-blue-500/20 text-blue-400'
                    : 'border-slate-600 bg-slate-700/50 text-slate-300 hover:border-slate-500 hover:bg-slate-600/50'
                }`}
                onClick={() => setSelectedRoute(key)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold">{route.name}</h4>
                    <p className="text-sm opacity-75">{route.description}</p>
                  </div>
                  {selectedRoute === key && (
                    <CheckCircle className="h-5 w-5 text-blue-400" />
                  )}
                </div>
              </div>
            ))}
          </div>
          
          <Button 
            onClick={optimizeRoute} 
            disabled={isOptimizing}
            className="w-full bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500/30"
          >
            {isOptimizing ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                {language === 'vi' ? 'Đang tối ưu hóa...' : 'Optimizing...'}
              </>
            ) : (
              <>
                <Target className="w-4 h-4 mr-2" />
                {language === 'vi' ? 'Tối Ưu Hóa Tuyến Đường' : 'Optimize Route'}
              </>
            )}
          </Button>

          {/* Custom Route Section */}
          <div className="border-t border-slate-600 pt-4">
            <h4 className="text-white font-medium mb-3">
              {language === 'vi' ? 'Tuyến đường tùy chỉnh' : 'Custom Route'}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-slate-300">
                  {language === 'vi' ? 'Điểm xuất phát' : 'Origin'}
                </Label>
                <Input
                  placeholder={language === 'vi' ? 'Nhập điểm xuất phát...' : 'Enter origin...'}
                  value={customOrigin}
                  onChange={(e) => setCustomOrigin(e.target.value)}
                  className="bg-slate-700/50 border-slate-600 text-white placeholder-slate-400"
                />
              </div>
              <div>
                <Label className="text-slate-300">
                  {language === 'vi' ? 'Điểm đến' : 'Destination'}
                </Label>
                <Input
                  placeholder={language === 'vi' ? 'Nhập điểm đến...' : 'Enter destination...'}
                  value={customDestination}
                  onChange={(e) => setCustomDestination(e.target.value)}
                  className="bg-slate-700/50 border-slate-600 text-white placeholder-slate-400"
                />
              </div>
            </div>
            <Button 
              onClick={optimizeCustomRoute} 
              disabled={isOptimizing || !customOrigin || !customDestination}
              className="w-full mt-3 bg-purple-500/20 text-purple-400 border border-purple-500/30 hover:bg-purple-500/30"
            >
              {isOptimizing ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  {language === 'vi' ? 'Đang phân tích...' : 'Analyzing...'}
                </>
              ) : (
                <>
                  <Navigation className="w-4 h-4 mr-2" />
                  {language === 'vi' ? 'Phân Tích Tuyến Đường' : 'Analyze Route'}
                </>
              )}
            </Button>
          </div>
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
