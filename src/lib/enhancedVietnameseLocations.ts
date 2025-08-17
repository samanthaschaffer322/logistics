// Enhanced Vietnamese Locations with Comprehensive Ports and Cities
export interface EnhancedLocation {
  id: string;
  name: string;
  nameEn: string;
  type: 'port' | 'city' | 'industrial_zone' | 'airport' | 'border_gate';
  coordinates: [number, number]; // [longitude, latitude]
  province: string;
  region: 'north' | 'central' | 'south';
  isInternational: boolean;
  facilities: string[];
  description: string;
}

export const ENHANCED_VIETNAM_LOCATIONS: EnhancedLocation[] = [
  // Major Ports - South
  {
    id: 'port_hcm_saigon',
    name: 'Cảng Sài Gòn',
    nameEn: 'Saigon Port',
    type: 'port',
    coordinates: [106.7017, 10.7769],
    province: 'TP. Hồ Chí Minh',
    region: 'south',
    isInternational: true,
    facilities: ['Container Terminal', 'Bulk Cargo', 'General Cargo', 'Passenger Terminal'],
    description: 'Largest port complex in Vietnam, handling over 70% of container traffic'
  },
  {
    id: 'port_cat_lai',
    name: 'Cảng Cát Lái',
    nameEn: 'Cat Lai Port',
    type: 'port',
    coordinates: [106.7631, 10.7831],
    province: 'TP. Hồ Chí Minh',
    region: 'south',
    isInternational: true,
    facilities: ['Container Terminal', 'Logistics Center', 'Warehouse'],
    description: 'Major container port serving Ho Chi Minh City metropolitan area'
  },
  {
    id: 'port_vung_tau',
    name: 'Cảng Vũng Tàu',
    nameEn: 'Vung Tau Port',
    type: 'port',
    coordinates: [107.0843, 10.3460],
    province: 'Bà Rịa - Vũng Tàu',
    region: 'south',
    isInternational: true,
    facilities: ['Oil Terminal', 'Container Terminal', 'Offshore Support'],
    description: 'Major oil and gas port, offshore support base'
  },
  {
    id: 'port_can_tho',
    name: 'Cảng Cần Thơ',
    nameEn: 'Can Tho Port',
    type: 'port',
    coordinates: [105.7851, 10.0340],
    province: 'Cần Thơ',
    region: 'south',
    isInternational: true,
    facilities: ['River Port', 'Agricultural Products', 'General Cargo'],
    description: 'Major Mekong Delta port for agricultural exports'
  },
  {
    id: 'port_my_tho',
    name: 'Cảng Mỹ Tho',
    nameEn: 'My Tho Port',
    type: 'port',
    coordinates: [106.3500, 10.3600],
    province: 'Tiền Giang',
    region: 'south',
    isInternational: false,
    facilities: ['River Port', 'Agricultural Products', 'Passenger Ferry'],
    description: 'Mekong Delta river port for regional trade'
  },

  // Major Ports - Central
  {
    id: 'port_da_nang',
    name: 'Cảng Đà Nẵng',
    nameEn: 'Da Nang Port',
    type: 'port',
    coordinates: [108.2022, 16.0544],
    province: 'Đà Nẵng',
    region: 'central',
    isInternational: true,
    facilities: ['Container Terminal', 'General Cargo', 'Passenger Terminal'],
    description: 'Central Vietnam\'s largest port, gateway to Laos and Cambodia'
  },
  {
    id: 'port_quy_nhon',
    name: 'Cảng Quy Nhon',
    nameEn: 'Quy Nhon Port',
    type: 'port',
    coordinates: [109.2189, 13.7563],
    province: 'Bình Định',
    region: 'central',
    isInternational: true,
    facilities: ['Deep Water Port', 'Container Terminal', 'Bulk Cargo'],
    description: 'Deep water port serving central highlands region'
  },
  {
    id: 'port_nha_trang',
    name: 'Cảng Nha Trang',
    nameEn: 'Nha Trang Port',
    type: 'port',
    coordinates: [109.1967, 12.2585],
    province: 'Khánh Hòa',
    region: 'central',
    isInternational: true,
    facilities: ['Tourist Port', 'Fishing Port', 'General Cargo'],
    description: 'Tourist and fishing port with cargo facilities'
  },
  {
    id: 'port_hue',
    name: 'Cảng Huế',
    nameEn: 'Hue Port',
    type: 'port',
    coordinates: [107.5955, 16.4637],
    province: 'Thừa Thiên Huế',
    region: 'central',
    isInternational: false,
    facilities: ['River Port', 'Tourist Boats', 'Small Cargo'],
    description: 'Historic river port on Perfume River'
  },

  // Major Ports - North
  {
    id: 'port_hai_phong',
    name: 'Cảng Hải Phòng',
    nameEn: 'Hai Phong Port',
    type: 'port',
    coordinates: [106.6881, 20.8648],
    province: 'Hải Phòng',
    region: 'north',
    isInternational: true,
    facilities: ['Container Terminal', 'Bulk Cargo', 'General Cargo', 'Coal Terminal'],
    description: 'Northern Vietnam\'s largest port, serving Hanoi region'
  },
  {
    id: 'port_cai_lan',
    name: 'Cảng Cái Lân',
    nameEn: 'Cai Lan Port',
    type: 'port',
    coordinates: [107.0831, 20.9500],
    province: 'Quảng Ninh',
    region: 'north',
    isInternational: true,
    facilities: ['Deep Water Port', 'Container Terminal', 'Coal Export'],
    description: 'Deep water port in Ha Long Bay area'
  },
  {
    id: 'port_hon_gai',
    name: 'Cảng Hòn Gai',
    nameEn: 'Hon Gai Port',
    type: 'port',
    coordinates: [107.0831, 20.9500],
    province: 'Quảng Ninh',
    region: 'north',
    isInternational: true,
    facilities: ['Coal Terminal', 'Tourist Port', 'General Cargo'],
    description: 'Coal export port and tourist gateway to Ha Long Bay'
  },

  // Major Cities
  {
    id: 'city_hanoi',
    name: 'Hà Nội',
    nameEn: 'Hanoi',
    type: 'city',
    coordinates: [105.8542, 21.0285],
    province: 'Hà Nội',
    region: 'north',
    isInternational: true,
    facilities: ['Capital City', 'Government Center', 'Business Hub', 'Universities'],
    description: 'Capital city and political center of Vietnam'
  },
  {
    id: 'city_hcm',
    name: 'TP. Hồ Chí Minh',
    nameEn: 'Ho Chi Minh City',
    type: 'city',
    coordinates: [106.6297, 10.8231],
    province: 'TP. Hồ Chí Minh',
    region: 'south',
    isInternational: true,
    facilities: ['Economic Center', 'Financial Hub', 'Manufacturing', 'Technology'],
    description: 'Largest city and economic center of Vietnam'
  },
  {
    id: 'city_da_nang',
    name: 'Đà Nẵng',
    nameEn: 'Da Nang',
    type: 'city',
    coordinates: [108.2022, 16.0544],
    province: 'Đà Nẵng',
    region: 'central',
    isInternational: true,
    facilities: ['Central Hub', 'Tourism', 'Technology Park', 'Port City'],
    description: 'Central Vietnam\'s largest city and technology hub'
  },
  {
    id: 'city_can_tho',
    name: 'Cần Thơ',
    nameEn: 'Can Tho',
    type: 'city',
    coordinates: [105.7851, 10.0340],
    province: 'Cần Thơ',
    region: 'south',
    isInternational: false,
    facilities: ['Mekong Delta Hub', 'Agriculture', 'River Transport', 'Universities'],
    description: 'Mekong Delta\'s largest city and agricultural center'
  },
  {
    id: 'city_hai_phong',
    name: 'Hải Phòng',
    nameEn: 'Hai Phong',
    type: 'city',
    coordinates: [106.6881, 20.8648],
    province: 'Hải Phòng',
    region: 'north',
    isInternational: true,
    facilities: ['Port City', 'Industrial Hub', 'Manufacturing', 'Logistics'],
    description: 'Major northern port city and industrial center'
  },

  // International Airports
  {
    id: 'airport_noi_bai',
    name: 'Sân bay Nội Bài',
    nameEn: 'Noi Bai International Airport',
    type: 'airport',
    coordinates: [105.8067, 21.2187],
    province: 'Hà Nội',
    region: 'north',
    isInternational: true,
    facilities: ['International Terminal', 'Domestic Terminal', 'Cargo Terminal'],
    description: 'Northern Vietnam\'s main international gateway'
  },
  {
    id: 'airport_tan_son_nhat',
    name: 'Sân bay Tân Sơn Nhất',
    nameEn: 'Tan Son Nhat International Airport',
    type: 'airport',
    coordinates: [106.6519, 10.8187],
    province: 'TP. Hồ Chí Minh',
    region: 'south',
    isInternational: true,
    facilities: ['International Terminal', 'Domestic Terminal', 'Cargo Hub'],
    description: 'Vietnam\'s busiest airport serving Ho Chi Minh City'
  },
  {
    id: 'airport_da_nang',
    name: 'Sân bay Đà Nẵng',
    nameEn: 'Da Nang International Airport',
    type: 'airport',
    coordinates: [108.1991, 16.0439],
    province: 'Đà Nẵng',
    region: 'central',
    isInternational: true,
    facilities: ['International Terminal', 'Domestic Terminal', 'Military Base'],
    description: 'Central Vietnam\'s main international airport'
  },

  // Industrial Zones
  {
    id: 'iz_vsip_binh_duong',
    name: 'KCN VSIP Bình Dương',
    nameEn: 'VSIP Binh Duong Industrial Park',
    type: 'industrial_zone',
    coordinates: [106.7500, 11.1667],
    province: 'Bình Dương',
    region: 'south',
    isInternational: true,
    facilities: ['Manufacturing', 'Logistics', 'Technology', 'Services'],
    description: 'Major industrial park near Ho Chi Minh City'
  },
  {
    id: 'iz_dong_nai',
    name: 'KCN Đồng Nai',
    nameEn: 'Dong Nai Industrial Zone',
    type: 'industrial_zone',
    coordinates: [106.8333, 10.9500],
    province: 'Đồng Nai',
    region: 'south',
    isInternational: true,
    facilities: ['Heavy Industry', 'Manufacturing', 'Logistics', 'Export Processing'],
    description: 'Large industrial complex in southern Vietnam'
  },

  // Border Gates
  {
    id: 'border_dong_dang',
    name: 'Cửa khẩu Đồng Đăng',
    nameEn: 'Dong Dang Border Gate',
    type: 'border_gate',
    coordinates: [106.7333, 21.6167],
    province: 'Lạng Sơn',
    region: 'north',
    isInternational: true,
    facilities: ['Customs', 'Immigration', 'Cargo Inspection', 'Passenger Terminal'],
    description: 'Major border crossing with China'
  },
  {
    id: 'border_lao_bao',
    name: 'Cửa khẩu Lao Bảo',
    nameEn: 'Lao Bao Border Gate',
    type: 'border_gate',
    coordinates: [106.6000, 16.6167],
    province: 'Quảng Trị',
    region: 'central',
    isInternational: true,
    facilities: ['Customs', 'Immigration', 'Cargo Terminal'],
    description: 'Main border crossing with Laos'
  },
  {
    id: 'border_moc_bai',
    name: 'Cửa khẩu Mộc Bài',
    nameEn: 'Moc Bai Border Gate',
    type: 'border_gate',
    coordinates: [106.2167, 11.1333],
    province: 'Tây Ninh',
    region: 'south',
    isInternational: true,
    facilities: ['Customs', 'Immigration', 'Commercial Hub'],
    description: 'Major border crossing with Cambodia'
  }
];

// Route calculation with Vietnamese road conditions
export interface RouteCalculation {
  distance: number;
  duration: number;
  fuelCost: number;
  tollCost: number;
  totalCost: number;
  route: string[];
  roadConditions: 'excellent' | 'good' | 'fair' | 'poor';
  trafficLevel: 'low' | 'medium' | 'high';
}

export const calculateEnhancedRoute = (
  from: string,
  to: string,
  vehicleType: '20ft' | '40ft' | 'truck' | 'van'
): RouteCalculation => {
  const fromLocation = ENHANCED_VIETNAM_LOCATIONS.find(loc => loc.id === from);
  const toLocation = ENHANCED_VIETNAM_LOCATIONS.find(loc => loc.id === to);
  
  if (!fromLocation || !toLocation) {
    throw new Error('Invalid location IDs');
  }

  // Calculate distance using Haversine formula
  const R = 6371; // Earth's radius in km
  const dLat = (toLocation.coordinates[1] - fromLocation.coordinates[1]) * Math.PI / 180;
  const dLon = (toLocation.coordinates[0] - fromLocation.coordinates[0]) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(fromLocation.coordinates[1] * Math.PI / 180) * Math.cos(toLocation.coordinates[1] * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c;

  // Vehicle-specific calculations
  const vehicleSpecs = {
    '20ft': { fuelConsumption: 0.25, tollMultiplier: 1.0, speedFactor: 1.0 },
    '40ft': { fuelConsumption: 0.35, tollMultiplier: 1.5, speedFactor: 0.9 },
    'truck': { fuelConsumption: 0.20, tollMultiplier: 0.8, speedFactor: 1.1 },
    'van': { fuelConsumption: 0.15, tollMultiplier: 0.6, speedFactor: 1.2 }
  };

  const specs = vehicleSpecs[vehicleType];
  const fuelPrice = 25000; // VND per liter
  const baseTollRate = 2000; // VND per km

  const duration = (distance / (60 * specs.speedFactor)); // hours
  const fuelCost = distance * specs.fuelConsumption * fuelPrice;
  const tollCost = distance * baseTollRate * specs.tollMultiplier;
  const totalCost = fuelCost + tollCost;

  // Determine road conditions and traffic based on regions
  let roadConditions: 'excellent' | 'good' | 'fair' | 'poor' = 'good';
  let trafficLevel: 'low' | 'medium' | 'high' = 'medium';

  if (fromLocation.region === 'south' && toLocation.region === 'south') {
    roadConditions = 'excellent';
    trafficLevel = 'high';
  } else if (fromLocation.region === 'north' && toLocation.region === 'north') {
    roadConditions = 'good';
    trafficLevel = 'medium';
  } else {
    roadConditions = 'fair';
    trafficLevel = 'low';
  }

  return {
    distance: Math.round(distance),
    duration: Math.round(duration * 100) / 100,
    fuelCost: Math.round(fuelCost),
    tollCost: Math.round(tollCost),
    totalCost: Math.round(totalCost),
    route: [fromLocation.name, toLocation.name],
    roadConditions,
    trafficLevel
  };
};

// Search and filter functions
export const searchEnhancedLocations = (query: string): EnhancedLocation[] => {
  const lowercaseQuery = query.toLowerCase();
  return ENHANCED_VIETNAM_LOCATIONS.filter(location =>
    location.name.toLowerCase().includes(lowercaseQuery) ||
    location.nameEn.toLowerCase().includes(lowercaseQuery) ||
    location.province.toLowerCase().includes(lowercaseQuery)
  );
};

export const getLocationsByType = (type: EnhancedLocation['type']): EnhancedLocation[] => {
  return ENHANCED_VIETNAM_LOCATIONS.filter(location => location.type === type);
};

export const getLocationsByRegion = (region: 'north' | 'central' | 'south'): EnhancedLocation[] => {
  return ENHANCED_VIETNAM_LOCATIONS.filter(location => location.region === region);
};

export const getInternationalLocations = (): EnhancedLocation[] => {
  return ENHANCED_VIETNAM_LOCATIONS.filter(location => location.isInternational);
};
