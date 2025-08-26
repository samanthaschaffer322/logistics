// Enhanced Vietnamese Location Search with Accent Normalization
export interface LocationResult {
  id: string
  name: string
  nameEn: string
  nameVi: string
  coordinates: [number, number]
  type: 'city' | 'district' | 'ward' | 'port' | 'warehouse' | 'depot'
  province: string
  address?: string
  isDepot?: boolean
  capacity?: number
}

// Comprehensive Vietnamese locations database
export const VIETNAM_LOCATIONS: LocationResult[] = [
  // Major Ports
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
    capacity: 50000
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
    capacity: 30000
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
    capacity: 40000
  },

  // Major Cities
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
  {
    id: 'hai-phong',
    name: 'Hải Phòng',
    nameEn: 'Hai Phong',
    nameVi: 'Hải Phòng',
    coordinates: [20.8449, 106.6881],
    type: 'city',
    province: 'Hai Phong'
  },

  // Southern Vietnam Locations
  {
    id: 'long-an',
    name: 'Long An',
    nameEn: 'Long An',
    nameVi: 'Long An',
    coordinates: [10.6956, 106.2431],
    type: 'city',
    province: 'Long An'
  },
  {
    id: 'tien-giang',
    name: 'Tiền Giang',
    nameEn: 'Tien Giang',
    nameVi: 'Tiền Giang',
    coordinates: [10.3500, 106.3600],
    type: 'city',
    province: 'Tien Giang'
  },
  {
    id: 'hau-giang',
    name: 'Hậu Giang',
    nameEn: 'Hau Giang',
    nameVi: 'Hậu Giang',
    coordinates: [9.7570, 105.6420],
    type: 'city',
    province: 'Hau Giang'
  },
  {
    id: 'dong-nai',
    name: 'Đồng Nai',
    nameEn: 'Dong Nai',
    nameVi: 'Đồng Nai',
    coordinates: [10.9480, 106.8209],
    type: 'city',
    province: 'Dong Nai'
  },
  {
    id: 'binh-duong',
    name: 'Bình Dương',
    nameEn: 'Binh Duong',
    nameVi: 'Bình Dương',
    coordinates: [11.3254, 106.4770],
    type: 'city',
    province: 'Binh Duong'
  },

  // Warehouses and Depots
  {
    id: 'chim-en-depot',
    name: 'Chim Én',
    nameEn: 'Chim En Depot',
    nameVi: 'Kho Chim Én',
    coordinates: [10.7829, 106.6919],
    type: 'depot',
    province: 'Ho Chi Minh City',
    address: 'Đường Nguyễn Văn Linh, Quận 7, TP.HCM',
    isDepot: true,
    capacity: 25000
  },
  {
    id: 'tan-thuan-warehouse',
    name: 'Kho Tân Thuận',
    nameEn: 'Tan Thuan Warehouse',
    nameVi: 'Kho Tân Thuận',
    coordinates: [10.7300, 106.7100],
    type: 'warehouse',
    province: 'Ho Chi Minh City',
    isDepot: true,
    capacity: 15000
  },
  {
    id: 'ben-nghe-depot',
    name: 'Bến Nghé',
    nameEn: 'Ben Nghe Depot',
    nameVi: 'Kho Bến Nghé',
    coordinates: [10.7700, 106.7050],
    type: 'depot',
    province: 'Ho Chi Minh City',
    isDepot: true,
    capacity: 20000
  }
]

// Vietnamese accent normalization
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

// Enhanced search function
export function searchVietnameseLocations(query: string, limit: number = 10): LocationResult[] {
  if (!query || query.length < 2) return []

  const normalizedQuery = normalizeVietnamese(query.trim())
  const results: { location: LocationResult; score: number }[] = []

  VIETNAM_LOCATIONS.forEach(location => {
    const normalizedName = normalizeVietnamese(location.name)
    const normalizedNameEn = normalizeVietnamese(location.nameEn)
    const normalizedNameVi = normalizeVietnamese(location.nameVi)
    const normalizedAddress = location.address ? normalizeVietnamese(location.address) : ''

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
    // Address contains query gets lower score
    else if (normalizedAddress.includes(normalizedQuery)) {
      score = 40
    }

    // Boost score for depots/warehouses
    if (location.isDepot && score > 0) {
      score += 20
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

// Find nearest depot/warehouse
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

// Route optimization with depot integration
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

  // Calculate route through depot if beneficial
  const directDistance = calculateDistance(origin.coordinates, destination.coordinates)
  const viaDepotDistance = 
    calculateDistance(origin.coordinates, depot.coordinates) + 
    calculateDistance(depot.coordinates, destination.coordinates)

  const useDepot = viaDepotDistance < directDistance * 1.3 // Use depot if not more than 30% longer

  const waypoints: LocationResult[] = useDepot ? [depot] : []
  const totalDistance = useDepot ? viaDepotDistance : directDistance

  // Create route path
  const routePath: [number, number][] = [
    origin.coordinates,
    ...(useDepot ? [depot.coordinates] : []),
    destination.coordinates
  ]

  // Calculate estimates
  const estimatedTime = `${(totalDistance / 60).toFixed(1)}h` // Assuming 60 km/h average
  const estimatedCost = `${(totalDistance * 15000).toLocaleString('vi-VN')} VND` // 15,000 VND per km
  const fuelConsumption = `${(totalDistance * 0.7).toFixed(1)}L` // 0.7L per km
  const efficiency = Math.max(60, Math.min(95, 100 - (totalDistance / 10))) // Efficiency based on distance

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
    routePath
  }
}
