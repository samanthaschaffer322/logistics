// Enhanced Vietnam Locations Database
// Includes detailed ports, depots, logistics hubs, and industrial zones

export interface DetailedLocation {
  id: string
  name: string
  nameEn: string
  type: 'port' | 'depot' | 'industrial_zone' | 'logistics_hub' | 'warehouse' | 'distribution_center'
  coordinates: { lat: number; lng: number }
  province: string
  region: 'north' | 'central' | 'south'
  capacity?: number
  operatingHours: string
  services: string[]
  contactInfo?: {
    phone?: string
    email?: string
    address: string
  }
  specialties?: string[]
  equipment?: string[]
}

export interface EnhancedProvince {
  id: string
  name: string
  nameEn: string
  region: 'north' | 'central' | 'south'
  coordinates: { lat: number; lng: number }
  population: number
  area: number
  economicZones: number
  logistics: {
    warehouses: number
    distributionCenters: number
    activeRoutes: number
    monthlyVolume: number
  }
  locations: DetailedLocation[]
}

// Comprehensive Vietnam logistics locations database
export const VIETNAM_LOCATIONS: DetailedLocation[] = [
  // Ho Chi Minh City Area
  {
    id: 'hcm_port',
    name: 'Cảng Sài Gòn',
    nameEn: 'Saigon Port',
    type: 'port',
    coordinates: { lat: 10.7769, lng: 106.7009 },
    province: 'TP. Hồ Chí Minh',
    region: 'south',
    capacity: 1000000,
    operatingHours: '24/7',
    services: ['container_handling', 'bulk_cargo', 'ro_ro', 'customs_clearance'],
    contactInfo: {
      phone: '+84 28 3829 3056',
      address: '5 Nguyễn Tất Thành, Quận 4, TP.HCM'
    },
    specialties: ['container_terminal', 'international_shipping'],
    equipment: ['gantry_cranes', 'reach_stackers', 'container_trucks']
  },
  {
    id: 'cai_mep_port',
    name: 'Cảng Cái Mép',
    nameEn: 'Cai Mep Port',
    type: 'port',
    coordinates: { lat: 10.5167, lng: 107.0833 },
    province: 'Bà Rịa - Vũng Tàu',
    region: 'south',
    capacity: 2000000,
    operatingHours: '24/7',
    services: ['deep_sea_container', 'transshipment', 'logistics_services'],
    contactInfo: {
      phone: '+84 254 3861 888',
      address: 'Cái Mép, Phường Phước Hòa, TX Phú Mỹ, BR-VT'
    },
    specialties: ['deep_water_port', 'large_vessels'],
    equipment: ['super_post_panamax_cranes', 'automated_systems']
  },
  {
    id: 'sinovnl_tan_van',
    name: 'Sinovnl Tân Vạn',
    nameEn: 'Sinovnl Tan Van Terminal',
    type: 'port',
    coordinates: { lat: 10.5200, lng: 107.0900 },
    province: 'Bà Rịa - Vũng Tàu',
    region: 'south',
    capacity: 500000,
    operatingHours: '24/7',
    services: ['container_terminal', 'logistics_services', 'warehousing'],
    contactInfo: {
      phone: '+84 254 3861 999',
      address: 'Khu Kinh tế Phú Mỹ, TX Phú Mỹ, BR-VT'
    },
    specialties: ['sino_vietnam_cooperation', 'modern_terminal'],
    equipment: ['modern_cranes', 'automated_handling']
  },
  {
    id: 'hcm_depot_central',
    name: 'Kho trung tâm TP.HCM',
    nameEn: 'Ho Chi Minh City Central Depot',
    type: 'depot',
    coordinates: { lat: 10.8505, lng: 106.7717 },
    province: 'TP. Hồ Chí Minh',
    region: 'south',
    capacity: 50000,
    operatingHours: '06:00-22:00',
    services: ['container_storage', 'truck_loading', 'customs_clearance', 'warehousing'],
    contactInfo: {
      phone: '+84 28 3825 1234',
      address: 'Khu Công nghệ cao, Quận 9, TP.HCM'
    },
    specialties: ['high_tech_logistics', 'e_commerce_fulfillment'],
    equipment: ['forklifts', 'loading_docks', 'container_handlers']
  },
  {
    id: 'kho_chim_en',
    name: 'Kho Chim Én',
    nameEn: 'Chim En Warehouse',
    type: 'warehouse',
    coordinates: { lat: 10.7500, lng: 106.6500 },
    province: 'TP. Hồ Chí Minh',
    region: 'south',
    capacity: 50000,
    operatingHours: '06:00-22:00',
    services: ['storage', 'distribution', 'cross_docking'],
    contactInfo: {
      address: 'Khu vực Chim Én, Quận 7, TP.HCM'
    },
    specialties: ['food_storage', 'temperature_controlled'],
    equipment: ['forklifts', 'conveyor_systems']
  },
  {
    id: 'cat_lai_port',
    name: 'Cảng Cát Lái',
    nameEn: 'Cat Lai Port',
    type: 'port',
    coordinates: { lat: 10.8167, lng: 106.8000 },
    province: 'TP. Hồ Chí Minh',
    region: 'south',
    capacity: 800000,
    operatingHours: '24/7',
    services: ['container_handling', 'inland_port', 'river_transport'],
    contactInfo: {
      phone: '+84 28 3740 6666',
      address: 'Cát Lái, Quận 2, TP.HCM'
    },
    specialties: ['river_port', 'inland_container_depot'],
    equipment: ['mobile_cranes', 'container_handlers']
  },

  // Hanoi Area
  {
    id: 'noi_bai_cargo',
    name: 'Kho hàng Nội Bài',
    nameEn: 'Noi Bai Cargo Terminal',
    type: 'logistics_hub',
    coordinates: { lat: 21.2187, lng: 105.8067 },
    province: 'Hà Nội',
    region: 'north',
    capacity: 200000,
    operatingHours: '24/7',
    services: ['air_cargo', 'customs_clearance', 'warehousing'],
    contactInfo: {
      phone: '+84 24 3827 2222',
      address: 'Sân bay Nội Bài, Sóc Sơn, Hà Nội'
    },
    specialties: ['air_freight', 'express_delivery'],
    equipment: ['cargo_loaders', 'temperature_controlled_storage']
  },
  {
    id: 'hai_phong_port',
    name: 'Cảng Hải Phòng',
    nameEn: 'Hai Phong Port',
    type: 'port',
    coordinates: { lat: 20.8648, lng: 106.6837 },
    province: 'Hải Phòng',
    region: 'north',
    capacity: 1500000,
    operatingHours: '24/7',
    services: ['container_terminal', 'bulk_cargo', 'general_cargo'],
    contactInfo: {
      phone: '+84 225 3842 888',
      address: 'Đình Vũ, Hải An, Hải Phòng'
    },
    specialties: ['northern_gateway', 'china_trade'],
    equipment: ['container_cranes', 'bulk_handlers']
  },
  {
    id: 'lach_huyen_port',
    name: 'Cảng Lạch Huyện',
    nameEn: 'Lach Huyen Port',
    type: 'port',
    coordinates: { lat: 20.9167, lng: 106.8000 },
    province: 'Hải Phòng',
    region: 'north',
    capacity: 1000000,
    operatingHours: '24/7',
    services: ['deep_water_terminal', 'container_handling', 'transshipment'],
    contactInfo: {
      phone: '+84 225 3555 888',
      address: 'Lạch Huyện, An Dương, Hải Phòng'
    },
    specialties: ['deep_water_access', 'modern_facilities'],
    equipment: ['post_panamax_cranes', 'automated_systems']
  },

  // Central Vietnam
  {
    id: 'da_nang_port',
    name: 'Cảng Đà Nẵng',
    nameEn: 'Da Nang Port',
    type: 'port',
    coordinates: { lat: 16.0544, lng: 108.2022 },
    province: 'Đà Nẵng',
    region: 'central',
    capacity: 500000,
    operatingHours: '24/7',
    services: ['container_terminal', 'general_cargo', 'passenger_terminal'],
    contactInfo: {
      phone: '+84 236 3822 722',
      address: 'Bạch Đằng, Hải Châu, Đà Nẵng'
    },
    specialties: ['central_hub', 'tourism_gateway'],
    equipment: ['container_cranes', 'ro_ro_facilities']
  },
  {
    id: 'quy_nhon_port',
    name: 'Cảng Quy Nhon',
    nameEn: 'Quy Nhon Port',
    type: 'port',
    coordinates: { lat: 13.7667, lng: 109.2333 },
    province: 'Bình Định',
    region: 'central',
    capacity: 300000,
    operatingHours: '24/7',
    services: ['general_cargo', 'bulk_cargo', 'container_handling'],
    contactInfo: {
      phone: '+84 256 3821 555',
      address: 'Quy Nhon, Bình Định'
    },
    specialties: ['agricultural_exports', 'industrial_cargo'],
    equipment: ['mobile_cranes', 'conveyor_systems']
  },

  // Major Depots and Distribution Centers
  {
    id: 'binh_duong_depot',
    name: 'Depot Bình Dương',
    nameEn: 'Binh Duong Depot',
    type: 'depot',
    coordinates: { lat: 10.9804, lng: 106.6519 },
    province: 'Bình Dương',
    region: 'south',
    capacity: 100000,
    operatingHours: '05:00-23:00',
    services: ['truck_parking', 'maintenance', 'fuel_station', 'driver_rest'],
    contactInfo: {
      phone: '+84 274 3123 456',
      address: 'KCN Việt Nam Singapore, Thuận An, Bình Dương'
    },
    specialties: ['truck_services', 'industrial_zone_access'],
    equipment: ['maintenance_bays', 'fuel_pumps', 'parking_spaces']
  },
  {
    id: 'dong_nai_depot',
    name: 'Depot Đồng Nai',
    nameEn: 'Dong Nai Depot',
    type: 'depot',
    coordinates: { lat: 10.9500, lng: 106.8400 },
    province: 'Đồng Nai',
    region: 'south',
    capacity: 80000,
    operatingHours: '24/7',
    services: ['container_storage', 'truck_services', 'customs_support'],
    contactInfo: {
      phone: '+84 251 3123 789',
      address: 'KCN Biên Hòa, Đồng Nai'
    },
    specialties: ['container_depot', 'export_processing'],
    equipment: ['reach_stackers', 'empty_handlers']
  },
  {
    id: 'long_an_depot',
    name: 'Depot Long An',
    nameEn: 'Long An Depot',
    type: 'depot',
    coordinates: { lat: 10.6950, lng: 106.2431 },
    province: 'Long An',
    region: 'south',
    capacity: 60000,
    operatingHours: '05:00-22:00',
    services: ['agricultural_storage', 'cold_storage', 'processing'],
    contactInfo: {
      phone: '+84 272 3456 123',
      address: 'Tân An, Long An'
    },
    specialties: ['agricultural_products', 'mekong_delta_access'],
    equipment: ['cold_storage_units', 'processing_equipment']
  },

  // Industrial Zones and Logistics Hubs
  {
    id: 'vsip_binh_duong',
    name: 'VSIP Bình Dương',
    nameEn: 'Vietnam Singapore Industrial Park Binh Duong',
    type: 'industrial_zone',
    coordinates: { lat: 10.9700, lng: 106.7200 },
    province: 'Bình Dương',
    region: 'south',
    capacity: 200000,
    operatingHours: '24/7',
    services: ['manufacturing', 'logistics', 'warehousing', 'customs'],
    contactInfo: {
      phone: '+84 274 3765 000',
      address: 'VSIP, Thuận An, Bình Dương'
    },
    specialties: ['electronics', 'automotive', 'textiles'],
    equipment: ['modern_factories', 'logistics_centers']
  },
  {
    id: 'amata_dong_nai',
    name: 'Amata Đồng Nai',
    nameEn: 'Amata Industrial Park Dong Nai',
    type: 'industrial_zone',
    coordinates: { lat: 10.8800, lng: 106.8100 },
    province: 'Đồng Nai',
    region: 'south',
    capacity: 150000,
    operatingHours: '24/7',
    services: ['manufacturing', 'logistics_services', 'utilities'],
    contactInfo: {
      phone: '+84 251 3512 345',
      address: 'Amata, Biên Hòa, Đồng Nai'
    },
    specialties: ['japanese_investment', 'high_tech'],
    equipment: ['advanced_infrastructure', 'logistics_facilities']
  }
]

// Enhanced provinces with detailed locations
export const ENHANCED_PROVINCES: EnhancedProvince[] = [
  {
    id: 'hcm',
    name: 'TP. Hồ Chí Minh',
    nameEn: 'Ho Chi Minh City',
    region: 'south',
    coordinates: { lat: 10.8231, lng: 106.6297 },
    population: 9000000,
    area: 2095,
    economicZones: 15,
    logistics: {
      warehouses: 450,
      distributionCenters: 120,
      activeRoutes: 2500,
      monthlyVolume: 850000
    },
    locations: VIETNAM_LOCATIONS.filter(loc => loc.province === 'TP. Hồ Chí Minh')
  },
  {
    id: 'ba_ria_vung_tau',
    name: 'Bà Rịa - Vũng Tàu',
    nameEn: 'Ba Ria - Vung Tau',
    region: 'south',
    coordinates: { lat: 10.5417, lng: 107.2431 },
    population: 1200000,
    area: 1989,
    economicZones: 8,
    logistics: {
      warehouses: 180,
      distributionCenters: 45,
      activeRoutes: 800,
      monthlyVolume: 1200000
    },
    locations: VIETNAM_LOCATIONS.filter(loc => loc.province === 'Bà Rịa - Vũng Tàu')
  },
  {
    id: 'binh_duong',
    name: 'Bình Dương',
    nameEn: 'Binh Duong',
    region: 'south',
    coordinates: { lat: 11.3254, lng: 106.4775 },
    population: 2500000,
    area: 2695,
    economicZones: 25,
    logistics: {
      warehouses: 320,
      distributionCenters: 85,
      activeRoutes: 1800,
      monthlyVolume: 650000
    },
    locations: VIETNAM_LOCATIONS.filter(loc => loc.province === 'Bình Dương')
  },
  {
    id: 'dong_nai',
    name: 'Đồng Nai',
    nameEn: 'Dong Nai',
    region: 'south',
    coordinates: { lat: 11.0686, lng: 107.1676 },
    population: 3200000,
    area: 5907,
    economicZones: 32,
    logistics: {
      warehouses: 280,
      distributionCenters: 70,
      activeRoutes: 1500,
      monthlyVolume: 580000
    },
    locations: VIETNAM_LOCATIONS.filter(loc => loc.province === 'Đồng Nai')
  },
  {
    id: 'hanoi',
    name: 'Hà Nội',
    nameEn: 'Hanoi',
    region: 'north',
    coordinates: { lat: 21.0285, lng: 105.8542 },
    population: 8000000,
    area: 3359,
    economicZones: 18,
    logistics: {
      warehouses: 380,
      distributionCenters: 95,
      activeRoutes: 2200,
      monthlyVolume: 720000
    },
    locations: VIETNAM_LOCATIONS.filter(loc => loc.province === 'Hà Nội')
  },
  {
    id: 'hai_phong',
    name: 'Hải Phòng',
    nameEn: 'Hai Phong',
    region: 'north',
    coordinates: { lat: 20.8449, lng: 106.6881 },
    population: 2000000,
    area: 1523,
    economicZones: 12,
    logistics: {
      warehouses: 220,
      distributionCenters: 55,
      activeRoutes: 1200,
      monthlyVolume: 950000
    },
    locations: VIETNAM_LOCATIONS.filter(loc => loc.province === 'Hải Phòng')
  },
  {
    id: 'da_nang',
    name: 'Đà Nẵng',
    nameEn: 'Da Nang',
    region: 'central',
    coordinates: { lat: 16.0544, lng: 108.2022 },
    population: 1200000,
    area: 1285,
    economicZones: 8,
    logistics: {
      warehouses: 150,
      distributionCenters: 35,
      activeRoutes: 800,
      monthlyVolume: 420000
    },
    locations: VIETNAM_LOCATIONS.filter(loc => loc.province === 'Đà Nẵng')
  }
]

// Common routes based on logistics files analysis
export const COMMON_ROUTES = [
  {
    id: 'hcm_hanoi',
    name: 'TP.HCM - Hà Nội',
    nameEn: 'Ho Chi Minh City - Hanoi',
    departure: 'hcm',
    destination: 'hanoi',
    distance: 1710,
    estimatedTime: 24,
    frequency: 'daily',
    truckTypes: ['40ft', '20ft', 'bulk'],
    majorStops: ['Đồng Nai', 'Bình Thuận', 'Khánh Hòa', 'Bình Định', 'Quảng Nam', 'Thừa Thiên Huế', 'Thanh Hóa', 'Nam Định'],
    tollCost: 2052000,
    fuelCost: 4275000
  },
  {
    id: 'hcm_hai_phong',
    name: 'TP.HCM - Hải Phòng',
    nameEn: 'Ho Chi Minh City - Hai Phong',
    departure: 'hcm',
    destination: 'hai_phong',
    distance: 1750,
    estimatedTime: 25,
    frequency: 'daily',
    truckTypes: ['container', '40ft'],
    majorStops: ['Đồng Nai', 'Bình Thuận', 'Khánh Hòa', 'Bình Định', 'Quảng Nam', 'Thừa Thiên Huế', 'Thanh Hóa'],
    tollCost: 2100000,
    fuelCost: 4375000
  },
  {
    id: 'hcm_da_nang',
    name: 'TP.HCM - Đà Nẵng',
    nameEn: 'Ho Chi Minh City - Da Nang',
    departure: 'hcm',
    destination: 'da_nang',
    distance: 964,
    estimatedTime: 14,
    frequency: 'daily',
    truckTypes: ['40ft', '20ft', 'refrigerated'],
    majorStops: ['Đồng Nai', 'Bình Thuận', 'Khánh Hòa', 'Bình Định'],
    tollCost: 1156800,
    fuelCost: 2409000
  },
  {
    id: 'cai_mep_hcm',
    name: 'Cái Mép - TP.HCM',
    nameEn: 'Cai Mep Port - Ho Chi Minh City',
    departure: 'ba_ria_vung_tau',
    destination: 'hcm',
    distance: 85,
    estimatedTime: 2,
    frequency: 'multiple_daily',
    truckTypes: ['container', '40ft', '20ft'],
    majorStops: ['Nhà Bè', 'Quận 7'],
    tollCost: 102000,
    fuelCost: 212500
  },
  {
    id: 'binh_duong_cai_mep',
    name: 'Bình Dương - Cái Mép',
    nameEn: 'Binh Duong - Cai Mep Port',
    departure: 'binh_duong',
    destination: 'ba_ria_vung_tau',
    distance: 120,
    estimatedTime: 2.5,
    frequency: 'multiple_daily',
    truckTypes: ['container', 'export_cargo'],
    majorStops: ['TP.HCM', 'Nhà Bè'],
    tollCost: 144000,
    fuelCost: 300000
  }
]

// Search function for locations
export function searchLocations(query: string): DetailedLocation[] {
  const searchTerm = query.toLowerCase().trim()
  if (!searchTerm) return VIETNAM_LOCATIONS

  return VIETNAM_LOCATIONS.filter(location => 
    location.name.toLowerCase().includes(searchTerm) ||
    location.nameEn.toLowerCase().includes(searchTerm) ||
    location.province.toLowerCase().includes(searchTerm) ||
    location.type.toLowerCase().includes(searchTerm) ||
    location.services.some(service => service.toLowerCase().includes(searchTerm)) ||
    location.specialties?.some(specialty => specialty.toLowerCase().includes(searchTerm))
  )
}

// Get locations by type
export function getLocationsByType(type: DetailedLocation['type']): DetailedLocation[] {
  return VIETNAM_LOCATIONS.filter(location => location.type === type)
}

// Get locations by province
export function getLocationsByProvince(provinceId: string): DetailedLocation[] {
  const province = ENHANCED_PROVINCES.find(p => p.id === provinceId)
  if (!province) return []
  return VIETNAM_LOCATIONS.filter(location => location.province === province.name)
}

// Calculate route between two locations
export function calculateDetailedRoute(
  departure: DetailedLocation, 
  destination: DetailedLocation,
  containerType: '20ft' | '40ft' | 'bulk' = '40ft'
): {
  distance: number
  estimatedTime: number
  fuelCost: number
  tollCost: number
  totalCost: number
  nearestDepots: DetailedLocation[]
  recommendations: string[]
} {
  // Haversine distance calculation
  const R = 6371 // Earth's radius in km
  const dLat = (destination.coordinates.lat - departure.coordinates.lat) * Math.PI / 180
  const dLng = (destination.coordinates.lng - departure.coordinates.lng) * Math.PI / 180
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(departure.coordinates.lat * Math.PI / 180) * Math.cos(destination.coordinates.lat * Math.PI / 180) * 
    Math.sin(dLng/2) * Math.sin(dLng/2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  const distance = R * c

  // Enhanced calculations for 40ft containers
  const baseRate = 0.35 // L/km for 40ft container
  const weightFactor = containerType === '40ft' ? 1.2 : containerType === '20ft' ? 0.8 : 1.0
  const fuelConsumption = distance * baseRate * weightFactor
  const fuelCost = fuelConsumption * 27000 // VND per liter

  // Vietnam highway toll calculation
  const tollRate = 1200 // VND per km for highways
  const tollCost = distance * tollRate

  // Operation fees
  const operationFees = distance * 500 // VND per km

  const totalCost = fuelCost + tollCost + operationFees
  const estimatedTime = distance / 70 // Average speed 70 km/h

  // Find nearest depots along the route
  const nearestDepots = VIETNAM_LOCATIONS
    .filter(loc => loc.type === 'depot')
    .sort((a, b) => {
      const distA = Math.abs(a.coordinates.lat - departure.coordinates.lat) + 
                   Math.abs(a.coordinates.lng - departure.coordinates.lng)
      const distB = Math.abs(b.coordinates.lat - departure.coordinates.lat) + 
                   Math.abs(b.coordinates.lng - departure.coordinates.lng)
      return distA - distB
    })
    .slice(0, 3)

  // Generate recommendations
  const recommendations: string[] = []
  
  if (distance > 500) {
    recommendations.push('Chuyến đường dài - cần nghỉ tại depot trung gian')
  }
  
  if (estimatedTime > 8) {
    recommendations.push('Thời gian vận chuyển > 8 giờ - cần 2 tài xế hoặc nghỉ đêm')
  }
  
  if (departure.type === 'port' || destination.type === 'port') {
    recommendations.push('Chuyến cảng - kiểm tra giờ làm việc và thủ tục hải quan')
  }

  return {
    distance: Math.round(distance),
    estimatedTime: Math.round(estimatedTime * 10) / 10,
    fuelCost: Math.round(fuelCost),
    tollCost: Math.round(tollCost),
    totalCost: Math.round(totalCost),
    nearestDepots,
    recommendations
  }
}
