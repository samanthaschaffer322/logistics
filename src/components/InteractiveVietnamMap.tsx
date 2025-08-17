'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui-components'
import { Button } from '@/components/ui-components'
import { Input } from '@/components/ui-components'
import { Badge } from '@/components/ui-components'
import { 
  MapPin, 
  Search, 
  Navigation, 
  Truck, 
  Package,
  Clock,
  Target,
  Zap,
  AlertTriangle,
  CheckCircle
} from 'lucide-react'

interface Location {
  id: string;
  name: string;
  type: 'port' | 'warehouse' | 'customer' | 'city';
  coordinates: { x: number; y: number };
  description: string;
  status: 'active' | 'busy' | 'closed';
  vehicles?: number;
}

interface Route {
  id: string;
  from: string;
  to: string;
  distance: number;
  duration: number;
  status: 'active' | 'congested' | 'optimal';
}

const InteractiveVietnamMap = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [showRoutes, setShowRoutes] = useState(false);
  const [filteredLocations, setFilteredLocations] = useState<Location[]>([]);

  const VIETNAM_LOCATIONS: Location[] = [
    // Ports
    {
      id: 'cat-lai',
      name: 'Cảng Cát Lái',
      type: 'port',
      coordinates: { x: 68, y: 78 },
      description: 'Cảng container lớn nhất miền Nam - 450+ chuyến/tháng',
      status: 'active',
      vehicles: 12
    },
    {
      id: 'vung-tau',
      name: 'Cảng Vũng Tàu',
      type: 'port',
      coordinates: { x: 72, y: 85 },
      description: 'Cảng thủy sản chính - 38 chuyến/tháng',
      status: 'busy',
      vehicles: 8
    },
    {
      id: 'sai-gon',
      name: 'Cảng Sài Gòn',
      type: 'port',
      coordinates: { x: 65, y: 78 },
      description: 'Cảng trung tâm TP.HCM',
      status: 'active',
      vehicles: 6
    },

    // Warehouses
    {
      id: 'kho-chim-en',
      name: 'KHO CHIM ÉN',
      type: 'warehouse',
      coordinates: { x: 62, y: 80 },
      description: 'Kho trung tâm phân phối thức ăn chăn nuôi',
      status: 'active',
      vehicles: 15
    },
    {
      id: 'kho-long-an',
      name: 'KHO LONG AN',
      type: 'warehouse',
      coordinates: { x: 58, y: 75 },
      description: 'Kho thủy sản miền Tây',
      status: 'active',
      vehicles: 8
    },
    {
      id: 'kho-ham-tan',
      name: 'KHO HÀM TÂN',
      type: 'warehouse',
      coordinates: { x: 75, y: 82 },
      description: 'Kho phân phối Bình Thuận',
      status: 'active',
      vehicles: 5
    },

    // Major Customers
    {
      id: 'cp-tien-giang',
      name: 'CP TIỀN GIANG',
      type: 'customer',
      coordinates: { x: 55, y: 72 },
      description: 'Nhà máy thức ăn heo CP Group - 32 chuyến/tháng',
      status: 'active',
      vehicles: 4
    },
    {
      id: 'cp-binh-duong',
      name: 'CP BÌNH DƯƠNG',
      type: 'customer',
      coordinates: { x: 60, y: 68 },
      description: 'Trang trại gà CP Group - 17 chuyến/tháng',
      status: 'active',
      vehicles: 3
    },
    {
      id: 'cp-dong-nai',
      name: 'CP ĐỒNG NAI',
      type: 'customer',
      coordinates: { x: 70, y: 75 },
      description: 'Trang trại heo CP Group - 13 chuyến/tháng',
      status: 'active',
      vehicles: 2
    },
    {
      id: 'japfa-binh-thuan',
      name: 'JAPFA BÌNH THUẬN',
      type: 'customer',
      coordinates: { x: 78, y: 80 },
      description: 'Nhà máy Japfa Comfeed - 23 chuyến/tháng',
      status: 'active',
      vehicles: 3
    },
    {
      id: 'rico-hau-giang',
      name: 'RICO HẬU GIANG',
      type: 'customer',
      coordinates: { x: 48, y: 85 },
      description: 'Nhà máy thức ăn cá tra Rico - 10 chuyến/tháng',
      status: 'active',
      vehicles: 2
    },

    // Cities
    {
      id: 'ho-chi-minh',
      name: 'TP. Hồ Chí Minh',
      type: 'city',
      coordinates: { x: 65, y: 78 },
      description: 'Trung tâm logistics miền Nam',
      status: 'active',
      vehicles: 25
    },
    {
      id: 'can-tho',
      name: 'Cần Thơ',
      type: 'city',
      coordinates: { x: 50, y: 82 },
      description: 'Trung tâm ĐBSCL',
      status: 'active',
      vehicles: 8
    },
    {
      id: 'dong-thap',
      name: 'Đồng Tháp',
      type: 'city',
      coordinates: { x: 52, y: 78 },
      description: 'Trung tâm thủy sản',
      status: 'active',
      vehicles: 6
    }
  ];

  const ACTIVE_ROUTES: Route[] = [
    {
      id: 'route-1',
      from: 'cat-lai',
      to: 'kho-chim-en',
      distance: 25,
      duration: 1.25,
      status: 'optimal'
    },
    {
      id: 'route-2',
      from: 'kho-chim-en',
      to: 'cp-tien-giang',
      distance: 85,
      duration: 2.5,
      status: 'active'
    },
    {
      id: 'route-3',
      from: 'vung-tau',
      to: 'kho-long-an',
      distance: 120,
      duration: 3.0,
      status: 'active'
    },
    {
      id: 'route-4',
      from: 'kho-chim-en',
      to: 'rico-hau-giang',
      distance: 180,
      duration: 5.0,
      status: 'congested'
    }
  ];

  useEffect(() => {
    if (searchTerm) {
      const filtered = VIETNAM_LOCATIONS.filter(location =>
        location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        location.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredLocations(filtered);
    } else {
      setFilteredLocations([]);
    }
  }, [searchTerm]);

  const getLocationColor = (type: string, status: string) => {
    const baseColors = {
      port: 'text-blue-400',
      warehouse: 'text-green-400',
      customer: 'text-purple-400',
      city: 'text-yellow-400'
    };
    
    if (status === 'busy') return 'text-orange-400';
    if (status === 'closed') return 'text-red-400';
    
    return baseColors[type as keyof typeof baseColors] || 'text-gray-400';
  };

  const getLocationIcon = (type: string) => {
    switch (type) {
      case 'port': return '🚢';
      case 'warehouse': return '🏭';
      case 'customer': return '🏢';
      case 'city': return '🏙️';
      default: return '📍';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'busy': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'closed': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const handleLocationClick = (location: Location) => {
    setSelectedLocation(location);
  };

  const handleSearch = (location: Location) => {
    setSelectedLocation(location);
    setSearchTerm('');
    setFilteredLocations([]);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Bản Đồ Việt Nam Tương Tác</h2>
          <p className="text-slate-400">Theo dõi logistics thức ăn chăn nuôi toàn quốc</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => setShowRoutes(!showRoutes)}
            className={`${
              showRoutes
                ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                : 'bg-slate-700/50 text-slate-400 hover:bg-slate-600/50'
            }`}
          >
            <Navigation className="w-4 h-4 mr-2" />
            {showRoutes ? 'Ẩn tuyến' : 'Hiện tuyến'}
          </Button>
        </div>
      </div>

      {/* Search */}
      <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm kiếm địa điểm (VD: Cảng Cát Lái, KHO CHIM ÉN, CP TIỀN GIANG...)"
              className="pl-10 bg-slate-700/50 border-slate-600 text-white"
            />
            
            {/* Search Results */}
            {filteredLocations.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-10 max-h-60 overflow-y-auto">
                {filteredLocations.map((location) => (
                  <button
                    key={location.id}
                    onClick={() => handleSearch(location)}
                    className="w-full text-left p-3 hover:bg-slate-700/50 border-b border-slate-700/50 last:border-b-0"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{getLocationIcon(location.type)}</span>
                      <div>
                        <div className="text-white font-medium">{location.name}</div>
                        <div className="text-slate-400 text-sm">{location.description}</div>
                      </div>
                      <Badge className={getStatusBadge(location.status)}>
                        {location.status}
                      </Badge>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map */}
        <div className="lg:col-span-2">
          <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <MapPin className="w-5 h-5 text-blue-400" />
                Bản Đồ Logistics Việt Nam
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative w-full h-96 bg-gradient-to-b from-blue-900/20 to-green-900/20 rounded-lg border border-slate-700/50 overflow-hidden">
                {/* Vietnam Map Outline */}
                <svg
                  viewBox="0 0 100 100"
                  className="absolute inset-0 w-full h-full"
                  style={{ filter: 'drop-shadow(0 0 10px rgba(59, 130, 246, 0.3))' }}
                >
                  {/* Simplified Vietnam outline */}
                  <path
                    d="M45 10 L55 10 L60 15 L65 20 L70 25 L75 35 L80 45 L85 55 L80 65 L75 70 L70 75 L65 80 L60 85 L55 90 L50 95 L45 90 L40 85 L35 80 L30 75 L35 70 L40 65 L45 60 L50 55 L45 50 L40 45 L35 40 L40 35 L45 30 L50 25 L45 20 L45 10 Z"
                    fill="rgba(59, 130, 246, 0.1)"
                    stroke="rgba(59, 130, 246, 0.3)"
                    strokeWidth="0.5"
                  />
                </svg>

                {/* Location Markers */}
                {VIETNAM_LOCATIONS.map((location) => (
                  <button
                    key={location.id}
                    onClick={() => handleLocationClick(location)}
                    className={`absolute transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full border-2 transition-all duration-200 hover:scale-125 ${
                      selectedLocation?.id === location.id
                        ? 'bg-yellow-400 border-yellow-300 shadow-lg shadow-yellow-400/50'
                        : location.status === 'active'
                        ? 'bg-green-400 border-green-300'
                        : location.status === 'busy'
                        ? 'bg-orange-400 border-orange-300'
                        : 'bg-red-400 border-red-300'
                    }`}
                    style={{
                      left: `${location.coordinates.x}%`,
                      top: `${location.coordinates.y}%`
                    }}
                    title={location.name}
                  >
                    <span className="text-xs font-bold text-white">
                      {location.vehicles || 0}
                    </span>
                  </button>
                ))}

                {/* Route Lines */}
                {showRoutes && ACTIVE_ROUTES.map((route) => {
                  const fromLocation = VIETNAM_LOCATIONS.find(l => l.id === route.from);
                  const toLocation = VIETNAM_LOCATIONS.find(l => l.id === route.to);
                  
                  if (!fromLocation || !toLocation) return null;
                  
                  return (
                    <svg
                      key={route.id}
                      className="absolute inset-0 w-full h-full pointer-events-none"
                      viewBox="0 0 100 100"
                    >
                      <line
                        x1={fromLocation.coordinates.x}
                        y1={fromLocation.coordinates.y}
                        x2={toLocation.coordinates.x}
                        y2={toLocation.coordinates.y}
                        stroke={
                          route.status === 'optimal' ? '#10b981' :
                          route.status === 'congested' ? '#f59e0b' : '#3b82f6'
                        }
                        strokeWidth="0.5"
                        strokeDasharray={route.status === 'congested' ? '2,2' : '0'}
                        opacity="0.8"
                      />
                    </svg>
                  );
                })}

                {/* Legend */}
                <div className="absolute bottom-4 left-4 bg-slate-800/90 backdrop-blur-sm border border-slate-700/50 rounded-lg p-3">
                  <div className="text-white text-sm font-medium mb-2">Chú thích</div>
                  <div className="space-y-1 text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                      <span className="text-slate-300">Hoạt động</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-orange-400 rounded-full"></div>
                      <span className="text-slate-300">Bận</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                      <span className="text-slate-300">Đã chọn</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Location Details */}
        <div>
          <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Target className="w-5 h-5 text-purple-400" />
                Chi Tiết Địa Điểm
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedLocation ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{getLocationIcon(selectedLocation.type)}</span>
                    <div>
                      <h3 className="text-white font-bold">{selectedLocation.name}</h3>
                      <Badge className={getStatusBadge(selectedLocation.status)}>
                        {selectedLocation.status}
                      </Badge>
                    </div>
                  </div>

                  <p className="text-slate-300 text-sm">{selectedLocation.description}</p>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-slate-700/30 rounded-lg">
                      <Truck className="w-5 h-5 text-blue-400 mx-auto mb-1" />
                      <div className="text-white font-bold">{selectedLocation.vehicles || 0}</div>
                      <div className="text-slate-400 text-xs">Xe đang hoạt động</div>
                    </div>
                    <div className="text-center p-3 bg-slate-700/30 rounded-lg">
                      <Package className="w-5 h-5 text-green-400 mx-auto mb-1" />
                      <div className="text-white font-bold">
                        {selectedLocation.type === 'port' ? '24/7' :
                         selectedLocation.type === 'warehouse' ? '5-18h' : '6-17h'}
                      </div>
                      <div className="text-slate-400 text-xs">Giờ hoạt động</div>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="space-y-2">
                    <Button className="w-full bg-blue-500/20 text-blue-400 border border-blue-500/30 hover:bg-blue-500/30">
                      <Navigation className="w-4 h-4 mr-2" />
                      Tạo tuyến đến đây
                    </Button>
                    <Button className="w-full bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500/30">
                      <Truck className="w-4 h-4 mr-2" />
                      Xem xe tại đây
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <MapPin className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-400">Chọn một địa điểm trên bản đồ để xem chi tiết</p>
                  <p className="text-slate-500 text-sm mt-2">Hoặc sử dụng tìm kiếm ở trên</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50 mt-4">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-400" />
                Thống Kê Nhanh
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Tổng địa điểm</span>
                  <span className="text-white font-bold">{VIETNAM_LOCATIONS.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Xe đang hoạt động</span>
                  <span className="text-green-400 font-bold">
                    {VIETNAM_LOCATIONS.reduce((sum, loc) => sum + (loc.vehicles || 0), 0)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Tuyến đường</span>
                  <span className="text-blue-400 font-bold">{ACTIVE_ROUTES.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Cảng hoạt động</span>
                  <span className="text-purple-400 font-bold">
                    {VIETNAM_LOCATIONS.filter(l => l.type === 'port').length}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default InteractiveVietnamMap;
