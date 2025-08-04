/**
 * Vietnam Map Data
 * Major cities, ports, and logistics depots for 40ft container routing
 */

export interface VietnamLocation {
  id: string
  name: string
  nameVi: string
  lat: number
  lng: number
  type: 'city' | 'port' | 'depot' | 'industrial_zone'
  province: string
  provinceVi: string
  containerCapacity?: number
  truckAccess40ft: boolean
  facilities: string[]
}

export interface VietnamRoute {
  id: string
  from: string
  to: string
  distance: number // km
  duration: number // minutes
  roadType: 'highway' | 'national' | 'provincial'
  truckRestrictions: string[]
  tollCost: number // VND
  fuelCost: number // VND
}

export const vietnamLocations: VietnamLocation[] = [
  // Major Cities
  {
    id: 'hanoi',
    name: 'Hanoi',
    nameVi: 'Hà Nội',
    lat: 21.0285,
    lng: 105.8542,
    type: 'city',
    province: 'Hanoi',
    provinceVi: 'Hà Nội',
    containerCapacity: 10000,
    truckAccess40ft: true,
    facilities: ['customs', 'warehouse', 'container_yard', 'fuel_station']
  },
  {
    id: 'ho_chi_minh',
    name: 'Ho Chi Minh City',
    nameVi: 'Thành phố Hồ Chí Minh',
    lat: 10.8231,
    lng: 106.6297,
    type: 'city',
    province: 'Ho Chi Minh City',
    provinceVi: 'TP. Hồ Chí Minh',
    containerCapacity: 15000,
    truckAccess40ft: true,
    facilities: ['customs', 'warehouse', 'container_yard', 'fuel_station', 'repair_shop']
  },
  {
    id: 'da_nang',
    name: 'Da Nang',
    nameVi: 'Đà Nẵng',
    lat: 16.0544,
    lng: 108.2022,
    type: 'city',
    province: 'Da Nang',
    provinceVi: 'Đà Nẵng',
    containerCapacity: 5000,
    truckAccess40ft: true,
    facilities: ['customs', 'warehouse', 'container_yard', 'fuel_station']
  },
  {
    id: 'hai_phong',
    name: 'Hai Phong',
    nameVi: 'Hải Phòng',
    lat: 20.8449,
    lng: 106.6881,
    type: 'port',
    province: 'Hai Phong',
    provinceVi: 'Hải Phòng',
    containerCapacity: 8000,
    truckAccess40ft: true,
    facilities: ['port', 'customs', 'warehouse', 'container_yard', 'fuel_station']
  },
  {
    id: 'can_tho',
    name: 'Can Tho',
    nameVi: 'Cần Thơ',
    lat: 10.0452,
    lng: 105.7469,
    type: 'city',
    province: 'Can Tho',
    provinceVi: 'Cần Thơ',
    containerCapacity: 3000,
    truckAccess40ft: true,
    facilities: ['warehouse', 'container_yard', 'fuel_station']
  },

  // Major Ports
  {
    id: 'cat_lai_port',
    name: 'Cat Lai Port',
    nameVi: 'Cảng Cát Lái',
    lat: 10.7804,
    lng: 106.7634,
    type: 'port',
    province: 'Ho Chi Minh City',
    provinceVi: 'TP. Hồ Chí Minh',
    containerCapacity: 20000,
    truckAccess40ft: true,
    facilities: ['port', 'customs', 'warehouse', 'container_yard', 'fuel_station', 'repair_shop']
  },
  {
    id: 'tan_cang_port',
    name: 'Tan Cang Port',
    nameVi: 'Cảng Tân Cảng',
    lat: 10.7669,
    lng: 106.7056,
    type: 'port',
    province: 'Ho Chi Minh City',
    provinceVi: 'TP. Hồ Chí Minh',
    containerCapacity: 15000,
    truckAccess40ft: true,
    facilities: ['port', 'customs', 'warehouse', 'container_yard', 'fuel_station']
  },
  {
    id: 'cai_mep_port',
    name: 'Cai Mep Port',
    nameVi: 'Cảng Cái Mép',
    lat: 10.5167,
    lng: 107.0833,
    type: 'port',
    province: 'Ba Ria - Vung Tau',
    provinceVi: 'Bà Rịa - Vũng Tàu',
    containerCapacity: 25000,
    truckAccess40ft: true,
    facilities: ['port', 'customs', 'warehouse', 'container_yard', 'fuel_station', 'repair_shop']
  },
  {
    id: 'tien_sa_port',
    name: 'Tien Sa Port',
    nameVi: 'Cảng Tiên Sa',
    lat: 16.0833,
    lng: 108.2167,
    type: 'port',
    province: 'Da Nang',
    provinceVi: 'Đà Nẵng',
    containerCapacity: 8000,
    truckAccess40ft: true,
    facilities: ['port', 'customs', 'warehouse', 'container_yard', 'fuel_station']
  },

  // Major Depots and Industrial Zones
  {
    id: 'bien_hoa_depot',
    name: 'Bien Hoa Logistics Depot',
    nameVi: 'Kho Logistics Biên Hòa',
    lat: 10.9500,
    lng: 106.8167,
    type: 'depot',
    province: 'Dong Nai',
    provinceVi: 'Đồng Nai',
    containerCapacity: 5000,
    truckAccess40ft: true,
    facilities: ['warehouse', 'container_yard', 'fuel_station', 'repair_shop']
  },
  {
    id: 'long_thanh_depot',
    name: 'Long Thanh Depot',
    nameVi: 'Kho Long Thành',
    lat: 10.8167,
    lng: 107.0000,
    type: 'depot',
    province: 'Dong Nai',
    provinceVi: 'Đồng Nai',
    containerCapacity: 7000,
    truckAccess40ft: true,
    facilities: ['warehouse', 'container_yard', 'fuel_station', 'customs']
  },
  {
    id: 'tan_thuan_depot',
    name: 'Tan Thuan Depot',
    nameVi: 'Kho Tân Thuận',
    lat: 10.7333,
    lng: 106.7167,
    type: 'depot',
    province: 'Ho Chi Minh City',
    provinceVi: 'TP. Hồ Chí Minh',
    containerCapacity: 6000,
    truckAccess40ft: true,
    facilities: ['warehouse', 'container_yard', 'fuel_station']
  },
  {
    id: 'vsip_hanoi',
    name: 'VSIP Hanoi',
    nameVi: 'VSIP Hà Nội',
    lat: 21.1167,
    lng: 105.7333,
    type: 'industrial_zone',
    province: 'Hanoi',
    provinceVi: 'Hà Nội',
    containerCapacity: 4000,
    truckAccess40ft: true,
    facilities: ['warehouse', 'container_yard', 'fuel_station', 'customs']
  },
  {
    id: 'vsip_binhduong',
    name: 'VSIP Binh Duong',
    nameVi: 'VSIP Bình Dương',
    lat: 10.9833,
    lng: 106.6500,
    type: 'industrial_zone',
    province: 'Binh Duong',
    provinceVi: 'Bình Dương',
    containerCapacity: 8000,
    truckAccess40ft: true,
    facilities: ['warehouse', 'container_yard', 'fuel_station', 'customs', 'repair_shop']
  }
]

export const vietnamRoutes: VietnamRoute[] = [
  // North-South Highway Routes
  {
    id: 'hanoi_hcm',
    from: 'hanoi',
    to: 'ho_chi_minh',
    distance: 1710,
    duration: 1200, // 20 hours
    roadType: 'highway',
    truckRestrictions: [],
    tollCost: 850000,
    fuelCost: 3420000
  },
  {
    id: 'hanoi_danang',
    from: 'hanoi',
    to: 'da_nang',
    distance: 763,
    duration: 540, // 9 hours
    roadType: 'highway',
    truckRestrictions: [],
    tollCost: 380000,
    fuelCost: 1526000
  },
  {
    id: 'danang_hcm',
    from: 'da_nang',
    to: 'ho_chi_minh',
    distance: 947,
    duration: 660, // 11 hours
    roadType: 'highway',
    truckRestrictions: [],
    tollCost: 470000,
    fuelCost: 1894000
  },

  // Port to City Routes
  {
    id: 'haiphong_hanoi',
    from: 'hai_phong',
    to: 'hanoi',
    distance: 102,
    duration: 120, // 2 hours
    roadType: 'highway',
    truckRestrictions: [],
    tollCost: 50000,
    fuelCost: 204000
  },
  {
    id: 'catlai_hcm',
    from: 'cat_lai_port',
    to: 'ho_chi_minh',
    distance: 25,
    duration: 45, // 45 minutes
    roadType: 'national',
    truckRestrictions: ['rush_hour_restrictions'],
    tollCost: 0,
    fuelCost: 50000
  },
  {
    id: 'caimep_hcm',
    from: 'cai_mep_port',
    to: 'ho_chi_minh',
    distance: 80,
    duration: 90, // 1.5 hours
    roadType: 'highway',
    truckRestrictions: [],
    tollCost: 40000,
    fuelCost: 160000
  },

  // Depot Routes
  {
    id: 'bienhoa_hcm',
    from: 'bien_hoa_depot',
    to: 'ho_chi_minh',
    distance: 35,
    duration: 60, // 1 hour
    roadType: 'national',
    truckRestrictions: ['rush_hour_restrictions'],
    tollCost: 0,
    fuelCost: 70000
  },
  {
    id: 'longthanh_catlai',
    from: 'long_thanh_depot',
    to: 'cat_lai_port',
    distance: 45,
    duration: 75, // 1.25 hours
    roadType: 'national',
    truckRestrictions: [],
    tollCost: 20000,
    fuelCost: 90000
  }
]

// Vietnam provinces for administrative boundaries
export const vietnamProvinces = [
  { code: 'HN', name: 'Hanoi', nameVi: 'Hà Nội' },
  { code: 'HCM', name: 'Ho Chi Minh City', nameVi: 'TP. Hồ Chí Minh' },
  { code: 'DN', name: 'Da Nang', nameVi: 'Đà Nẵng' },
  { code: 'HP', name: 'Hai Phong', nameVi: 'Hải Phòng' },
  { code: 'CT', name: 'Can Tho', nameVi: 'Cần Thơ' },
  { code: 'BD', name: 'Binh Duong', nameVi: 'Bình Dương' },
  { code: 'DN2', name: 'Dong Nai', nameVi: 'Đồng Nai' },
  { code: 'BRVT', name: 'Ba Ria - Vung Tau', nameVi: 'Bà Rịa - Vũng Tàu' }
]
