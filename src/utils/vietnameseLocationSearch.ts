// Enhanced Vietnamese Location Search with Comprehensive Depot Network
export interface LocationResult {
  id: string
  name: string
  nameEn: string
  nameVi: string
  coordinates: [number, number]
  type: 'city' | 'district' | 'ward' | 'port' | 'warehouse' | 'depot' | 'industrial_zone' | 'logistics_center'
  province: string
  address?: string
  isDepot?: boolean
  capacity?: number
  services?: string[]
  operatingHours?: string
  contactInfo?: string
}

// Comprehensive Vietnamese locations database with extensive depot network
export const VIETNAM_LOCATIONS: LocationResult[] = [
  // MAJOR PORTS - SOUTHERN VIETNAM
  {
    id: 'cat-lai-port',
    name: 'Cảng Cát Lái',
    nameEn: 'Cat Lai Port',
    nameVi: 'Cảng Cát Lái',
    coordinates: [10.7769, 106.7009],
    type: 'port',
    province: 'Ho Chi Minh City',
    address: 'Đường Đồng Văn Cống, Cát Lái, Quận 2, TP.HCM',
    isDepot: true,
    capacity: 50000,
    services: ['Container', 'Bulk Cargo', 'Warehousing', 'Customs'],
    operatingHours: '24/7',
    contactInfo: '+84 28 3740 5555'
  },
  {
    id: 'vung-tau-port',
    name: 'Cảng Vũng Tàu',
    nameEn: 'Vung Tau Port',
    nameVi: 'Cảng Vũng Tàu',
    coordinates: [10.3460, 107.0843],
    type: 'port',
    province: 'Ba Ria - Vung Tau',
    address: 'Đường Hạ Long, Phường 2, TP. Vũng Tàu',
    isDepot: true,
    capacity: 30000,
    services: ['Oil & Gas', 'Container', 'General Cargo'],
    operatingHours: '24/7',
    contactInfo: '+84 254 3856 405'
  },
  {
    id: 'saigon-port',
    name: 'Cảng Sài Gòn',
    nameEn: 'Saigon Port',
    nameVi: 'Cảng Sài Gòn',
    coordinates: [10.7580, 106.7020],
    type: 'port',
    province: 'Ho Chi Minh City',
    address: 'Đường Nguyễn Tất Thành, Quận 4, TP.HCM',
    isDepot: true,
    capacity: 40000,
    services: ['Container', 'Break Bulk', 'Logistics'],
    operatingHours: '24/7',
    contactInfo: '+84 28 3829 3056'
  },
  {
    id: 'hiep-phuoc-port',
    name: 'Cảng Hiệp Phước',
    nameEn: 'Hiep Phuoc Port',
    nameVi: 'Cảng Hiệp Phước',
    coordinates: [10.6800, 106.7500],
    type: 'port',
    province: 'Ho Chi Minh City',
    address: 'Khu công nghiệp Hiệp Phước, Nhà Bè, TP.HCM',
    isDepot: true,
    capacity: 35000,
    services: ['Container', 'Industrial Cargo', 'Logistics'],
    operatingHours: '24/7',
    contactInfo: '+84 28 3775 4321'
  },

  // MAJOR PORTS - NORTHERN VIETNAM
  {
    id: 'hai-phong-port',
    name: 'Cảng Hải Phòng',
    nameEn: 'Hai Phong Port',
    nameVi: 'Cảng Hải Phòng',
    coordinates: [20.8449, 106.6881],
    type: 'port',
    province: 'Hai Phong',
    address: 'Đường Điện Biên Phủ, Hải Phòng',
    isDepot: true,
    capacity: 45000,
    services: ['Container', 'Coal', 'General Cargo'],
    operatingHours: '24/7',
    contactInfo: '+84 225 3842 286'
  },
  {
    id: 'cai-mep-port',
    name: 'Cảng Cái Mép',
    nameEn: 'Cai Mep Port',
    nameVi: 'Cảng Cái Mép',
    coordinates: [10.4500, 107.0200],
    type: 'port',
    province: 'Ba Ria - Vung Tau',
    address: 'Cái Mép, Phú Mỹ, Bà Rịa - Vũng Tàu',
    isDepot: true,
    capacity: 60000,
    services: ['Deep Sea Container', 'Transshipment'],
    operatingHours: '24/7',
    contactInfo: '+84 254 3681 888'
  },

  // MAJOR CITIES
  {
    id: 'ho-chi-minh-city',
    name: 'Thành phố Hồ Chí Minh',
    nameEn: 'Ho Chi Minh City',
    nameVi: 'Thành phố Hồ Chí Minh',
    coordinates: [10.7769, 106.7009],
    type: 'city',
    province: 'Ho Chi Minh City'
  },
  {
    id: 'hanoi',
    name: 'Hà Nội',
    nameEn: 'Hanoi',
    nameVi: 'Hà Nội',
    coordinates: [21.0285, 105.8542],
    type: 'city',
    province: 'Hanoi'
  },
  {
    id: 'da-nang',
    name: 'Đà Nẵng',
    nameEn: 'Da Nang',
    nameVi: 'Đà Nẵng',
    coordinates: [16.0544, 108.2022],
    type: 'city',
    province: 'Da Nang'
  },
  {
    id: 'can-tho',
    name: 'Cần Thơ',
    nameEn: 'Can Tho',
    nameVi: 'Cần Thơ',
    coordinates: [10.0452, 105.7469],
    type: 'city',
    province: 'Can Tho'
  },

  // COMPREHENSIVE SOUTHERN VIETNAM DEPOT NETWORK
  {
    id: 'chim-en-depot',
    name: 'Kho Chim Én',
    nameEn: 'Chim En Depot',
    nameVi: 'Kho Chim Én',
    coordinates: [10.7829, 106.6919],
    type: 'depot',
    province: 'Ho Chi Minh City',
    address: 'Đường Nguyễn Văn Linh, Quận 7, TP.HCM',
    isDepot: true,
    capacity: 25000,
    services: ['Warehousing', 'Distribution', 'Cross-docking'],
    operatingHours: '6:00-22:00',
    contactInfo: '+84 28 3776 8888'
  },
  {
    id: 'tan-thuan-warehouse',
    name: 'Kho Tân Thuận',
    nameEn: 'Tan Thuan Warehouse',
    nameVi: 'Kho Tân Thuận',
    coordinates: [10.7300, 106.7100],
    type: 'warehouse',
    province: 'Ho Chi Minh City',
    address: 'Khu chế xuất Tân Thuận, Quận 7, TP.HCM',
    isDepot: true,
    capacity: 15000,
    services: ['Export Processing', 'Bonded Storage'],
    operatingHours: '7:00-19:00',
    contactInfo: '+84 28 3776 5432'
  },
  {
    id: 'ben-nghe-depot',
    name: 'Kho Bến Nghé',
    nameEn: 'Ben Nghe Depot',
    nameVi: 'Kho Bến Nghé',
    coordinates: [10.7700, 106.7050],
    type: 'depot',
    province: 'Ho Chi Minh City',
    address: 'Đường Tôn Đức Thắng, Quận 1, TP.HCM',
    isDepot: true,
    capacity: 20000,
    services: ['Urban Distribution', 'Last Mile'],
    operatingHours: '5:00-21:00',
    contactInfo: '+84 28 3829 7777'
  },
  {
    id: 'linh-trung-logistics',
    name: 'Trung tâm Logistics Linh Trung',
    nameEn: 'Linh Trung Logistics Center',
    nameVi: 'Trung tâm Logistics Linh Trung',
    coordinates: [10.8700, 106.8000],
    type: 'logistics_center',
    province: 'Ho Chi Minh City',
    address: 'Khu công nghệ cao, Quận 9, TP.HCM',
    isDepot: true,
    capacity: 40000,
    services: ['E-commerce', 'Cold Chain', 'Tech Logistics'],
    operatingHours: '24/7',
    contactInfo: '+84 28 3715 9999'
  },
  {
    id: 'binh-chanh-depot',
    name: 'Kho Bình Chánh',
    nameEn: 'Binh Chanh Depot',
    nameVi: 'Kho Bình Chánh',
    coordinates: [10.7400, 106.6200],
    type: 'depot',
    province: 'Ho Chi Minh City',
    address: 'Huyện Bình Chánh, TP.HCM',
    isDepot: true,
    capacity: 30000,
    services: ['Agricultural Products', 'Food Distribution'],
    operatingHours: '4:00-20:00',
    contactInfo: '+84 28 3756 4444'
  },

  // DONG NAI PROVINCE DEPOTS
  {
    id: 'bien-hoa-depot',
    name: 'Kho Biên Hòa',
    nameEn: 'Bien Hoa Depot',
    nameVi: 'Kho Biên Hòa',
    coordinates: [10.9480, 106.8209],
    type: 'depot',
    province: 'Dong Nai',
    address: 'Thành phố Biên Hòa, Đồng Nai',
    isDepot: true,
    capacity: 35000,
    services: ['Industrial Goods', 'Manufacturing Support'],
    operatingHours: '6:00-22:00',
    contactInfo: '+84 251 3836 777'
  },
  {
    id: 'long-thanh-logistics',
    name: 'Trung tâm Logistics Long Thành',
    nameEn: 'Long Thanh Logistics Center',
    nameVi: 'Trung tâm Logistics Long Thành',
    coordinates: [10.8200, 106.9500],
    type: 'logistics_center',
    province: 'Dong Nai',
    address: 'Huyện Long Thành, Đồng Nai',
    isDepot: true,
    capacity: 50000,
    services: ['Airport Cargo', 'International Logistics'],
    operatingHours: '24/7',
    contactInfo: '+84 251 3681 555'
  },

  // BINH DUONG PROVINCE DEPOTS
  {
    id: 'thu-dau-mot-depot',
    name: 'Kho Thủ Dầu Một',
    nameEn: 'Thu Dau Mot Depot',
    nameVi: 'Kho Thủ Dầu Một',
    coordinates: [11.3254, 106.4770],
    type: 'depot',
    province: 'Binh Duong',
    address: 'Thành phố Thủ Dầu Một, Bình Dương',
    isDepot: true,
    capacity: 28000,
    services: ['Textile', 'Electronics', 'Automotive'],
    operatingHours: '6:00-22:00',
    contactInfo: '+84 274 3822 666'
  },
  {
    id: 'vsip-depot',
    name: 'Kho VSIP Bình Dương',
    nameEn: 'VSIP Binh Duong Depot',
    nameVi: 'Kho VSIP Bình Dương',
    coordinates: [11.1800, 106.6200],
    type: 'industrial_zone',
    province: 'Binh Duong',
    address: 'Khu công nghiệp VSIP, Thuận An, Bình Dương',
    isDepot: true,
    capacity: 45000,
    services: ['Manufacturing', 'Export Processing'],
    operatingHours: '24/7',
    contactInfo: '+84 274 3765 888'
  },

  // MEKONG DELTA DEPOTS
  {
    id: 'long-an-depot',
    name: 'Kho Long An',
    nameEn: 'Long An Depot',
    nameVi: 'Kho Long An',
    coordinates: [10.6956, 106.2431],
    type: 'depot',
    province: 'Long An',
    address: 'Thành phố Tân An, Long An',
    isDepot: true,
    capacity: 22000,
    services: ['Agricultural Products', 'Rice Distribution'],
    operatingHours: '5:00-19:00',
    contactInfo: '+84 272 3841 333'
  },
  {
    id: 'tien-giang-depot',
    name: 'Kho Tiền Giang',
    nameEn: 'Tien Giang Depot',
    nameVi: 'Kho Tiền Giang',
    coordinates: [10.3500, 106.3600],
    type: 'depot',
    province: 'Tien Giang',
    address: 'Thành phố Mỹ Tho, Tiền Giang',
    isDepot: true,
    capacity: 18000,
    services: ['Fruits', 'Seafood', 'Cold Storage'],
    operatingHours: '4:00-18:00',
    contactInfo: '+84 273 3876 222'
  },
  {
    id: 'can-tho-depot',
    name: 'Kho Cần Thơ',
    nameEn: 'Can Tho Depot',
    nameVi: 'Kho Cần Thơ',
    coordinates: [10.0452, 105.7469],
    type: 'depot',
    province: 'Can Tho',
    address: 'Thành phố Cần Thơ',
    isDepot: true,
    capacity: 32000,
    services: ['Mekong Hub', 'River Transport', 'Agricultural'],
    operatingHours: '24/7',
    contactInfo: '+84 292 3831 777'
  },
  {
    id: 'hau-giang-depot',
    name: 'Kho Hậu Giang',
    nameEn: 'Hau Giang Depot',
    nameVi: 'Kho Hậu Giang',
    coordinates: [9.7570, 105.6420],
    type: 'depot',
    province: 'Hau Giang',
    address: 'Thành phố Vị Thanh, Hậu Giang',
    isDepot: true,
    capacity: 15000,
    services: ['Rice Processing', 'Aquaculture'],
    operatingHours: '5:00-19:00',
    contactInfo: '+84 293 3876 111'
  },
  {
    id: 'an-giang-depot',
    name: 'Kho An Giang',
    nameEn: 'An Giang Depot',
    nameVi: 'Kho An Giang',
    coordinates: [10.3880, 105.4350],
    type: 'depot',
    province: 'An Giang',
    address: 'Thành phố Long Xuyên, An Giang',
    isDepot: true,
    capacity: 25000,
    services: ['Border Trade', 'Cambodia Transit'],
    operatingHours: '6:00-20:00',
    contactInfo: '+84 296 3841 888'
  },

  // CENTRAL VIETNAM DEPOTS
  {
    id: 'da-nang-depot',
    name: 'Kho Đà Nẵng',
    nameEn: 'Da Nang Depot',
    nameVi: 'Kho Đà Nẵng',
    coordinates: [16.0544, 108.2022],
    type: 'depot',
    province: 'Da Nang',
    address: 'Thành phố Đà Nẵng',
    isDepot: true,
    capacity: 30000,
    services: ['Central Hub', 'Tourism Logistics'],
    operatingHours: '24/7',
    contactInfo: '+84 236 3821 999'
  },

  // NORTHERN VIETNAM DEPOTS
  {
    id: 'hanoi-depot',
    name: 'Kho Hà Nội',
    nameEn: 'Hanoi Depot',
    nameVi: 'Kho Hà Nội',
    coordinates: [21.0285, 105.8542],
    type: 'depot',
    province: 'Hanoi',
    address: 'Thành phố Hà Nội',
    isDepot: true,
    capacity: 40000,
    services: ['Northern Hub', 'Government Logistics'],
    operatingHours: '24/7',
    contactInfo: '+84 24 3826 7777'
  },
  {
    id: 'hai-phong-depot',
    name: 'Kho Hải Phòng',
    nameEn: 'Hai Phong Depot',
    nameVi: 'Kho Hải Phòng',
    coordinates: [20.8449, 106.6881],
    type: 'depot',
    province: 'Hai Phong',
    address: 'Thành phố Hải Phòng',
    isDepot: true,
    capacity: 35000,
    services: ['Port Logistics', 'Industrial Support'],
    operatingHours: '24/7',
    contactInfo: '+84 225 3842 888'
  }
]

// Vietnamese accent normalization (enhanced)
export function normalizeVietnamese(text: string): string {
  const accents: { [key: string]: string } = {
    'à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ': 'a',
    'è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ': 'e',
    'ì|í|ị|ỉ|ĩ': 'i',
    'ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ': 'o',
    'ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ': 'u',
    'ỳ|ý|ỵ|ỷ|ỹ': 'y',
    'đ': 'd',
    'À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ': 'A',
    'È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ': 'E',
    'Ì|Í|Ị|Ỉ|Ĩ': 'I',
    'Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ': 'O',
    'Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ': 'U',
    'Ỳ|Ý|Ỵ|Ỷ|Ỹ': 'Y',
    'Đ': 'D'
  }

  let normalized = text.toLowerCase()
  for (const [accented, plain] of Object.entries(accents)) {
    const regex = new RegExp(`[${accented}]`, 'g')
    normalized = normalized.replace(regex, plain)
  }
  return normalized
}

// Enhanced search function with better scoring
export function searchVietnameseLocations(query: string, limit: number = 10): LocationResult[] {
  if (!query || query.length < 2) return []

  const normalizedQuery = normalizeVietnamese(query.trim())
  const results: { location: LocationResult; score: number }[] = []

  VIETNAM_LOCATIONS.forEach(location => {
    const normalizedName = normalizeVietnamese(location.name)
    const normalizedNameEn = normalizeVietnamese(location.nameEn)
    const normalizedNameVi = normalizeVietnamese(location.nameVi)
    const normalizedAddress = location.address ? normalizeVietnamese(location.address) : ''
    const normalizedProvince = normalizeVietnamese(location.province)

    let score = 0

    // Exact match gets highest score
    if (normalizedName === normalizedQuery || normalizedNameEn === normalizedQuery) {
      score = 100
    }
    // Starts with query gets high score
    else if (normalizedName.startsWith(normalizedQuery) || normalizedNameEn.startsWith(normalizedQuery)) {
      score = 80
    }
    // Contains query gets medium score
    else if (normalizedName.includes(normalizedQuery) || normalizedNameEn.includes(normalizedQuery) || normalizedNameVi.includes(normalizedQuery)) {
      score = 60
    }
    // Province match gets medium score
    else if (normalizedProvince.includes(normalizedQuery)) {
      score = 50
    }
    // Address contains query gets lower score
    else if (normalizedAddress.includes(normalizedQuery)) {
      score = 40
    }

    // Boost score for depots/warehouses/ports
    if (location.isDepot && score > 0) {
      score += 25
    }
    if (location.type === 'port' && score > 0) {
      score += 20
    }
    if (location.type === 'logistics_center' && score > 0) {
      score += 15
    }

    if (score > 0) {
      results.push({ location, score })
    }
  })

  // Sort by score and return top results
  return results
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(result => result.location)
}

// Find nearest depot/warehouse with enhanced logic
export function findNearestDepot(coordinates: [number, number]): LocationResult | null {
  const depots = VIETNAM_LOCATIONS.filter(loc => loc.isDepot)
  if (depots.length === 0) return null

  let nearest = depots[0]
  let minDistance = calculateDistance(coordinates, nearest.coordinates)

  depots.forEach(depot => {
    const distance = calculateDistance(coordinates, depot.coordinates)
    if (distance < minDistance) {
      minDistance = distance
      nearest = depot
    }
  })

  return nearest
}

// Calculate distance between two coordinates (Haversine formula)
export function calculateDistance(coord1: [number, number], coord2: [number, number]): number {
  const R = 6371 // Earth's radius in kilometers
  const dLat = (coord2[0] - coord1[0]) * Math.PI / 180
  const dLon = (coord2[1] - coord1[1]) * Math.PI / 180
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(coord1[0] * Math.PI / 180) * Math.cos(coord2[0] * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  return R * c
}

// Route optimization with enhanced depot integration
export interface OptimizedRoute {
  origin: LocationResult
  destination: LocationResult
  depot: LocationResult
  waypoints: LocationResult[]
  totalDistance: number
  estimatedTime: string
  estimatedCost: string
  fuelConsumption: string
  efficiency: number
  routePath: [number, number][]
  routeType: 'direct' | 'via_depot' | 'multi_depot'
  savings: {
    distance: number
    time: string
    cost: string
  }
}

export function calculateOptimizedRoute(
  originQuery: string, 
  destinationQuery: string
): OptimizedRoute | null {
  const originResults = searchVietnameseLocations(originQuery, 1)
  const destinationResults = searchVietnameseLocations(destinationQuery, 1)

  if (originResults.length === 0 || destinationResults.length === 0) {
    return null
  }

  const origin = originResults[0]
  const destination = destinationResults[0]
  
  // Find nearest depot to origin
  const depot = findNearestDepot(origin.coordinates)
  if (!depot) return null

  // Calculate different route options
  const directDistance = calculateDistance(origin.coordinates, destination.coordinates)
  const viaDepotDistance = 
    calculateDistance(origin.coordinates, depot.coordinates) + 
    calculateDistance(depot.coordinates, destination.coordinates)

  // Use depot if it's beneficial (within 20% increase and provides services)
  const useDepot = viaDepotDistance < directDistance * 1.2

  const waypoints: LocationResult[] = useDepot ? [depot] : []
  const totalDistance = useDepot ? viaDepotDistance : directDistance
  const routeType: 'direct' | 'via_depot' | 'multi_depot' = useDepot ? 'via_depot' : 'direct'

  // Create route path
  const routePath: [number, number][] = [
    origin.coordinates,
    ...(useDepot ? [depot.coordinates] : []),
    destination.coordinates
  ]

  // Calculate estimates with Vietnamese logistics factors
  const avgSpeed = 45 // km/h average for Vietnamese roads
  const estimatedTime = `${(totalDistance / avgSpeed).toFixed(1)}h`
  const costPerKm = 18000 // VND per km (updated for 2025)
  const estimatedCost = `${(totalDistance * costPerKm).toLocaleString('vi-VN')} VND`
  const fuelConsumption = `${(totalDistance * 0.8).toFixed(1)}L` // 0.8L per km for trucks
  
  // Calculate efficiency based on multiple factors
  let efficiency = 85 // Base efficiency
  if (useDepot) efficiency += 10 // Depot usage bonus
  if (totalDistance < 50) efficiency += 5 // Short distance bonus
  if (depot.type === 'port') efficiency += 5 // Port access bonus
  efficiency = Math.min(98, Math.max(60, efficiency))

  // Calculate savings
  const directTime = directDistance / avgSpeed
  const optimizedTime = totalDistance / avgSpeed
  const timeSavings = useDepot ? `+${(optimizedTime - directTime).toFixed(1)}h` : '0h'
  const costSavings = useDepot ? `+${((viaDepotDistance - directDistance) * costPerKm).toLocaleString('vi-VN')} VND` : '0 VND'

  return {
    origin,
    destination,
    depot,
    waypoints,
    totalDistance,
    estimatedTime,
    estimatedCost,
    fuelConsumption,
    efficiency,
    routePath,
    routeType,
    savings: {
      distance: useDepot ? viaDepotDistance - directDistance : 0,
      time: timeSavings,
      cost: costSavings
    }
  }
}
