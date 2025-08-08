'use client';

import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import LanguageSelector from '@/components/LanguageSelector';
import EnhancedRouteOptimizerComplete from '@/components/EnhancedRouteOptimizerComplete';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, 
  Zap, 
  Globe, 
  Shield, 
  TrendingUp, 
  Cpu,
  Database,
  Cloud,
  Activity
} from 'lucide-react';

export default function EnhancedOptimizerPage() {
  const { t, language } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Brain className="h-8 w-8 text-blue-600" />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {t('route.enhancedTitle')}
                  </h1>
                  <p className="text-sm text-gray-600">
                    {language === 'vi' 
                      ? 'Được hỗ trợ bởi thuật toán AI tiên tiến, tích hợp Fleetbase và dịch vụ tối ưu hóa AWS'
                      : 'Powered by advanced AI algorithms, Fleetbase integration, and AWS optimization services'
                    }
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <LanguageSelector />
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Feature Badges */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          <Badge variant="secondary" className="flex items-center gap-2 px-4 py-2">
            <Brain className="h-4 w-4" />
            {language === 'vi' ? 'Được hỗ trợ AI' : 'AI-Powered'}
          </Badge>
          <Badge variant="secondary" className="flex items-center gap-2 px-4 py-2">
            <Zap className="h-4 w-4" />
            {language === 'vi' ? 'Tối ưu hóa Thời gian thực' : 'Real-time Optimization'}
          </Badge>
          <Badge variant="secondary" className="flex items-center gap-2 px-4 py-2">
            <Globe className="h-4 w-4" />
            {language === 'vi' ? 'Đa thuật toán' : 'Multi-Algorithm'}
          </Badge>
          <Badge variant="secondary" className="flex items-center gap-2 px-4 py-2">
            <Shield className="h-4 w-4" />
            {language === 'vi' ? 'Bảo mật Doanh nghiệp' : 'Enterprise Security'}
          </Badge>
          <Badge variant="secondary" className="flex items-center gap-2 px-4 py-2">
            <TrendingUp className="h-4 w-4" />
            {language === 'vi' ? 'Phân tích Nâng cao' : 'Advanced Analytics'}
          </Badge>
        </div>

        {/* Technology Stack Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="text-center">
            <CardHeader className="pb-3">
              <Cpu className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <CardTitle className="text-lg">
                {language === 'vi' ? 'Thuật toán AI' : 'AI Algorithms'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                {language === 'vi' 
                  ? 'Thuật toán Di truyền, Luyện kim Mô phỏng, Tối ưu hóa Đàn kiến và phương pháp Lai'
                  : 'Genetic Algorithm, Simulated Annealing, Ant Colony Optimization, and Hybrid approaches'
                }
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader className="pb-3">
              <Database className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <CardTitle className="text-lg">
                {language === 'vi' ? 'Tích hợp Fleetbase' : 'Fleetbase Integration'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                {language === 'vi' 
                  ? 'Quản lý đội xe hoàn chỉnh với theo dõi thời gian thực, quản lý tài xế và xử lý đơn hàng'
                  : 'Complete fleet management with real-time tracking, driver management, and order processing'
                }
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader className="pb-3">
              <Cloud className="h-8 w-8 text-orange-600 mx-auto mb-2" />
              <CardTitle className="text-lg">
                {language === 'vi' ? 'Dịch vụ AWS' : 'AWS Services'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                {language === 'vi' 
                  ? 'Dịch vụ Vị trí, hàm Lambda, lưu trữ S3 và giám sát CloudWatch'
                  : 'Location Services, Lambda functions, S3 storage, and CloudWatch monitoring'
                }
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader className="pb-3">
              <Activity className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <CardTitle className="text-lg">
                {language === 'vi' ? 'Phân tích Thời gian thực' : 'Real-time Analytics'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                {language === 'vi' 
                  ? 'Chỉ số hiệu suất trực tiếp, thông tin dự đoán và báo cáo toàn diện'
                  : 'Live performance metrics, predictive insights, and comprehensive reporting'
                }
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Optimizer Component */}
        <EnhancedRouteOptimizerComplete 
          onOptimizationComplete={(result) => {
            console.log('Optimization completed:', result);
            // Handle optimization completion
          }}
          onError={(error) => {
            console.error('Optimization error:', error);
            // Handle optimization error
          }}
        />

        {/* Features Overview */}
        <div className="mt-12">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-center">
                {language === 'vi' ? 'Tính năng & Khả năng Chính' : 'Key Features & Capabilities'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-3">
                  <h3 className="font-semibold text-lg text-blue-600">
                    {language === 'vi' ? 'Tối ưu hóa được hỗ trợ AI' : 'AI-Powered Optimization'}
                  </h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• {language === 'vi' ? 'Nhiều thuật toán tối ưu hóa' : 'Multiple optimization algorithms'}</li>
                    <li>• {language === 'vi' ? 'Thông tin học máy' : 'Machine learning insights'}</li>
                    <li>• {language === 'vi' ? 'Phân tích dự đoán' : 'Predictive analytics'}</li>
                    <li>• {language === 'vi' ? 'Cải tiến liên tục' : 'Continuous improvement'}</li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <h3 className="font-semibold text-lg text-green-600">
                    {language === 'vi' ? 'Tích hợp Fleetbase' : 'Fleetbase Integration'}
                  </h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• {language === 'vi' ? 'Quản lý đội xe hoàn chỉnh' : 'Complete fleet management'}</li>
                    <li>• {language === 'vi' ? 'Theo dõi phương tiện thời gian thực' : 'Real-time vehicle tracking'}</li>
                    <li>• {language === 'vi' ? 'Giám sát hiệu suất tài xế' : 'Driver performance monitoring'}</li>
                    <li>• {language === 'vi' ? 'Quản lý vòng đời đơn hàng' : 'Order lifecycle management'}</li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <h3 className="font-semibold text-lg text-orange-600">
                    {language === 'vi' ? 'Dịch vụ AWS Cloud' : 'AWS Cloud Services'}
                  </h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• {language === 'vi' ? 'Dịch vụ dựa trên vị trí' : 'Location-based services'}</li>
                    <li>• {language === 'vi' ? 'Cơ sở hạ tầng có thể mở rộng' : 'Scalable infrastructure'}</li>
                    <li>• {language === 'vi' ? 'Mã hóa địa lý nâng cao' : 'Advanced geocoding'}</li>
                    <li>• {language === 'vi' ? 'API tính toán tuyến đường' : 'Route calculation APIs'}</li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <h3 className="font-semibold text-lg text-purple-600">
                    {language === 'vi' ? 'Tính năng Thời gian thực' : 'Real-time Features'}
                  </h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• {language === 'vi' ? 'Tích hợp giao thông trực tiếp' : 'Live traffic integration'}</li>
                    <li>• {language === 'vi' ? 'Xem xét thời tiết' : 'Weather consideration'}</li>
                    <li>• {language === 'vi' ? 'Tối ưu hóa lại động' : 'Dynamic re-optimization'}</li>
                    <li>• {language === 'vi' ? 'Thông báo tức thì' : 'Instant notifications'}</li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <h3 className="font-semibold text-lg text-red-600">
                    {language === 'vi' ? 'Phân tích Nâng cao' : 'Advanced Analytics'}
                  </h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• {language === 'vi' ? 'Chỉ số hiệu suất' : 'Performance metrics'}</li>
                    <li>• {language === 'vi' ? 'Phân tích chi phí' : 'Cost analysis'}</li>
                    <li>• {language === 'vi' ? 'Đánh giá rủi ro' : 'Risk assessment'}</li>
                    <li>• {language === 'vi' ? 'Tính toán ROI' : 'ROI calculations'}</li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <h3 className="font-semibold text-lg text-indigo-600">
                    {language === 'vi' ? 'Tích hợp & API' : 'Integration & APIs'}
                  </h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• {language === 'vi' ? 'Cơ sở dữ liệu Supabase' : 'Supabase database'}</li>
                    <li>• {language === 'vi' ? 'Triển khai Cloudflare' : 'Cloudflare deployment'}</li>
                    <li>• {language === 'vi' ? 'API RESTful' : 'RESTful APIs'}</li>
                    <li>• {language === 'vi' ? 'Hỗ trợ Webhook' : 'Webhook support'}</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Performance Metrics */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-center">
                {language === 'vi' ? 'Cải thiện Hiệu suất' : 'Performance Improvements'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
                <div>
                  <div className="text-3xl font-bold text-blue-600 mb-2">25%</div>
                  <div className="text-sm text-gray-600">
                    {language === 'vi' ? 'Giảm Tổng Khoảng cách' : 'Reduction in Total Distance'}
                  </div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-green-600 mb-2">30%</div>
                  <div className="text-sm text-gray-600">
                    {language === 'vi' ? 'Cải thiện Thời gian Giao hàng' : 'Improvement in Delivery Time'}
                  </div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-orange-600 mb-2">40%</div>
                  <div className="text-sm text-gray-600">
                    {language === 'vi' ? 'Tiết kiệm Chi phí' : 'Cost Savings'}
                  </div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-purple-600 mb-2">95%</div>
                  <div className="text-sm text-gray-600">
                    {language === 'vi' ? 'Hài lòng Khách hàng' : 'Customer Satisfaction'}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-gray-500">
          <p>
            {language === 'vi' 
              ? 'Bộ Tối ưu Tuyến đường AI Nâng cao v2.0 - Được hỗ trợ bởi OpenAI, Fleetbase, AWS, Supabase và Cloudflare'
              : 'Enhanced AI Route Optimizer v2.0 - Powered by OpenAI, Fleetbase, AWS, Supabase, and Cloudflare'
            }
          </p>
        </div>
      </div>
    </div>
  );
}
