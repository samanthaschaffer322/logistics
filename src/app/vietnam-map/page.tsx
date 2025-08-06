'use client'

import React, { useState, useEffect } from 'react'
import AuthGuard from '@/components/AuthGuard'
import { useLanguage } from '@/contexts/LanguageContext'
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  Button,
  Input,
  Label
} from '@/components/ui-components'
import { 
  Map, 
  MapPin, 
  Navigation, 
  Truck, 
  Package, 
  Clock,
  BarChart3,
  TrendingUp,
  Users,
  Building,
  Search,
  Filter,
  Navigation2,
  Fuel,
  Calculator,
  Zap
} from 'lucide-react'

interface Province {
  id: string
  name: string
  nameEn: string
  region: 'north' | 'central' | 'south'
  population: number
  area: number
  economicZones: number
  ports: number
  airports: number
  coordinates: { lat: number; lng: number }
  logistics: {
    warehouses: number
    distributionCenters: number
    activeRoutes: number
    monthlyVolume: number
  }
  depots: Array<{
    id: string
    name: string
    nameEn: string
    coordinates: { lat: number; lng: number }
    capacity: number
    operatingHours: string
  }>
}

interface RouteCalculation {
  departure: Province
  destination: Province
  distance: number
  estimatedTime: number
  fuelCost: number
  nearestDepot: Province['depots'][0]
  operationFees: number
  totalCost: number
  truckingHours: {
    allowed: string[]
    restricted: string[]
  }
  routeDetails: {
    highways: string[]
    tollFees: number
    restStops: number
  }
}

const VietnamMapPage = () => {
  const { t } = useLanguage()
  const [selectedProvince, setSelectedProvince] = useState<Province | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedRegion, setSelectedRegion] = useState<string>('all')
  const [departure, setDeparture] = useState<Province | null>(null)
  const [destination, setDestination] = useState<Province | null>(null)
  const [routeCalculation, setRouteCalculation] = useState<RouteCalculation | null>(null)
  const [isCalculating, setIsCalculating] = useState(false)

  // Enhanced Vietnam provinces data with depots
  const provinces: Province[] = [
    {
      id: 'hcm',
      name: 'TP. Hồ Chí Minh',
      nameEn: 'Ho Chi Minh City',
      region: 'south',
      population: 9000000,
      area: 2095,
      economicZones: 15,
      ports: 3,
      airports: 2,
      coordinates: { lat: 10.8231, lng: 106.6297 },
      logistics: {
        warehouses: 450,
        distributionCenters: 85,
        activeRoutes: 1200,
        monthlyVolume: 2500000
      },
      depots: [
        {
          id: 'hcm_depot_1',
          name: 'Kho Tân Thuận',
          nameEn: 'Tan Thuan Depot',
          coordinates: { lat: 10.7378, lng: 106.7230 },
          capacity: 50000,
          operatingHours: '06:00-22:00'
        },
        {
          id: 'hcm_depot_2',
          name: 'Kho Cát Lái',
          nameEn: 'Cat Lai Depot',
          coordinates: { lat: 10.7950, lng: 106.7767 },
          capacity: 75000,
          operatingHours: '24/7'
        }
      ]
    },
    {
      id: 'hanoi',
      name: 'Hà Nội',
      nameEn: 'Hanoi',
      region: 'north',
      population: 8000000,
      area: 3359,
      economicZones: 12,
      ports: 0,
      airports: 1,
      coordinates: { lat: 21.0285, lng: 105.8542 },
      logistics: {
        warehouses: 380,
        distributionCenters: 65,
        activeRoutes: 950,
        monthlyVolume: 1800000
      },
      depots: [
        {
          id: 'hanoi_depot_1',
          name: 'Kho Gia Lâm',
          nameEn: 'Gia Lam Depot',
          coordinates: { lat: 21.0411, lng: 105.8660 },
          capacity: 40000,
          operatingHours: '06:00-22:00'
        }
      ]
    },
    {
      id: 'danang',
      name: 'Đà Nẵng',
      nameEn: 'Da Nang',
      region: 'central',
      population: 1200000,
      area: 1285,
      economicZones: 8,
      ports: 1,
      airports: 1,
      coordinates: { lat: 16.0544, lng: 108.2022 },
      logistics: {
        warehouses: 120,
        distributionCenters: 25,
        activeRoutes: 350,
        monthlyVolume: 450000
      },
      depots: [
        {
          id: 'danang_depot_1',
          name: 'Kho Liên Chiểu',
          nameEn: 'Lien Chieu Depot',
          coordinates: { lat: 16.0755, lng: 108.1509 },
          capacity: 25000,
          operatingHours: '06:00-20:00'
        }
      ]
    },
    {
      id: 'haiphong',
      name: 'Hải Phòng',
      nameEn: 'Hai Phong',
      region: 'north',
      population: 2000000,
      area: 1523,
      economicZones: 6,
      ports: 2,
      airports: 1,
      coordinates: { lat: 20.8449, lng: 106.6881 },
      logistics: {
        warehouses: 180,
        distributionCenters: 35,
        activeRoutes: 480,
        monthlyVolume: 850000
      },
      depots: [
        {
          id: 'haiphong_depot_1',
          name: 'Kho Đình Vũ',
          nameEn: 'Dinh Vu Depot',
          coordinates: { lat: 20.8058, lng: 106.7581 },
          capacity: 60000,
          operatingHours: '24/7'
        }
      ]
    },
    {
      id: 'cantho',
      name: 'Cần Thơ',
      nameEn: 'Can Tho',
      region: 'south',
      population: 1200000,
      area: 1409,
      economicZones: 4,
      ports: 1,
      airports: 1,
      coordinates: { lat: 10.0452, lng: 105.7469 },
      logistics: {
        warehouses: 95,
        distributionCenters: 18,
        activeRoutes: 280,
        monthlyVolume: 320000
      },
      depots: [
        {
          id: 'cantho_depot_1',
          name: 'Kho Trà Nóc',
          nameEn: 'Tra Noc Depot',
          coordinates: { lat: 10.0621, lng: 105.7851 },
          capacity: 30000,
          operatingHours: '06:00-20:00'
        }
      ]
    },
    {
      id: 'binhduong',
      name: 'Bình Dương',
      nameEn: 'Binh Duong',
      region: 'south',
      population: 2500000,
      area: 2695,
      economicZones: 10,
      ports: 0,
      airports: 0,
      coordinates: { lat: 11.3254, lng: 106.4770 },
      logistics: {
        warehouses: 220,
        distributionCenters: 42,
        activeRoutes: 650,
        monthlyVolume: 980000
      },
      depots: [
        {
          id: 'binhduong_depot_1',
          name: 'Kho Mỹ Phước',
          nameEn: 'My Phuoc Depot',
          coordinates: { lat: 11.2845, lng: 106.4234 },
          capacity: 45000,
          operatingHours: '06:00-22:00'
        }
      ]
    }
  ]

  // Calculate distance between two coordinates using Haversine formula
  const calculateDistance = (coord1: { lat: number; lng: number }, coord2: { lat: number; lng: number }): number => {
    const R = 6371 // Earth's radius in km
    const dLat = (coord2.lat - coord1.lat) * Math.PI / 180
    const dLng = (coord2.lng - coord1.lng) * Math.PI / 180
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(coord1.lat * Math.PI / 180) * Math.cos(coord2.lat * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    return R * c
  }

  // Find nearest depot to destination
  const findNearestDepot = (destination: Province): Province['depots'][0] => {
    let nearestDepot = destination.depots[0]
    let minDistance = Infinity

    destination.depots.forEach(depot => {
      const distance = calculateDistance(destination.coordinates, depot.coordinates)
      if (distance < minDistance) {
        minDistance = distance
        nearestDepot = depot
      }
    })

    return nearestDepot
  }

  // Calculate optimal route for 40ft container
  const calculateRoute = async () => {
    if (!departure || !destination) return

    setIsCalculating(true)

    // Simulate AI calculation
    setTimeout(() => {
      const distance = calculateDistance(departure.coordinates, destination.coordinates)
      const nearestDepot = findNearestDepot(destination)
      
      // Calculate costs for 40ft container
      const fuelConsumption = 0.35 // liters per km for 40ft container
      const fuelPrice = 25000 // VND per liter
      const fuelCost = distance * fuelConsumption * fuelPrice
      
      // Calculate estimated time considering truck restrictions
      const avgSpeed = 65 // km/h on highways
      const citySpeed = 25 // km/h in cities
      const estimatedTime = (distance * 0.7 / avgSpeed) + (distance * 0.3 / citySpeed) // 70% highway, 30% city
      
      // Operation fees
      const baseFee = 500000 // Base operation fee
      const distanceFee = distance * 8000 // Per km fee
      const depotFee = nearestDepot.capacity > 50000 ? 200000 : 100000 // Depot handling fee
      const operationFees = baseFee + distanceFee + depotFee
      
      const totalCost = fuelCost + operationFees

      const routeCalc: RouteCalculation = {
        departure,
        destination,
        distance: Math.round(distance),
        estimatedTime: Math.round(estimatedTime * 60), // in minutes
        fuelCost: Math.round(fuelCost),
        nearestDepot,
        operationFees: Math.round(operationFees),
        totalCost: Math.round(totalCost),
        truckingHours: {
          allowed: ['06:00-22:00', 'Weekdays', 'Avoid rush hours: 07:00-09:00, 17:00-19:00'],
          restricted: ['22:00-06:00', 'City center restrictions', 'Weekend limitations']
        },
        routeDetails: {
          highways: ['AH1', 'CT.01', 'QL1A'],
          tollFees: Math.round(distance * 1200), // VND per km
          restStops: Math.floor(distance / 200) // Every 200km
        }
      }

      setRouteCalculation(routeCalc)
      setIsCalculating(false)
    }, 2000)
  }

  const filteredProvinces = provinces.filter(province => {
    const matchesSearch = province.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         province.nameEn.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRegion = selectedRegion === 'all' || province.region === selectedRegion
    return matchesSearch && matchesRegion
  })

  const getRegionColor = (region: string) => {
    switch (region) {
      case 'north': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'central': return 'bg-green-100 text-green-800 border-green-200'
      case 'south': return 'bg-orange-100 text-orange-800 border-orange-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getRegionName = (region: string) => {
    switch (region) {
      case 'north': return t('map.north')
      case 'central': return t('map.central')
      case 'south': return t('map.south')
      default: return region
    }
  }

  const totalStats = provinces.reduce((acc, province) => ({
    warehouses: acc.warehouses + province.logistics.warehouses,
    distributionCenters: acc.distributionCenters + province.logistics.distributionCenters,
    activeRoutes: acc.activeRoutes + province.logistics.activeRoutes,
    monthlyVolume: acc.monthlyVolume + province.logistics.monthlyVolume
  }), { warehouses: 0, distributionCenters: 0, activeRoutes: 0, monthlyVolume: 0 })

  return (
    <AuthGuard>
      <div className="min-h-screen bg-slate-900 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">{t('map.title')}</h1>
            <p className="text-slate-400">
              {t('map.subtitle')}
            </p>
          </div>

          {/* Overview Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Building className="w-8 h-8 text-blue-600" />
                  <div>
                    <p className="text-2xl font-bold">{totalStats.warehouses.toLocaleString()}</p>
                    <p className="text-sm text-slate-600">{t('map.warehouses')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Truck className="w-8 h-8 text-green-600" />
                  <div>
                    <p className="text-2xl font-bold">{totalStats.distributionCenters.toLocaleString()}</p>
                    <p className="text-sm text-slate-600">{t('map.distributionCenters')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Navigation className="w-8 h-8 text-purple-600" />
                  <div>
                    <p className="text-2xl font-bold">{totalStats.activeRoutes.toLocaleString()}</p>
                    <p className="text-sm text-slate-600">{t('map.routes')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Package className="w-8 h-8 text-orange-600" />
                  <div>
                    <p className="text-2xl font-bold">
                      {(totalStats.monthlyVolume / 1000000).toFixed(1)}M
                    </p>
                    <p className="text-sm text-slate-600">{t('map.monthlyVolume')} ({t('common.tons')})</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Search and Route Calculator */}
            <div className="lg:col-span-1 space-y-6">
              {/* Search and Filter */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Search className="w-5 h-5" />
                    {t('map.search')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="search">{t('map.searchProvince')}</Label>
                    <Input
                      id="search"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder={t('map.searchPlaceholder')}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="region">{t('map.region')}</Label>
                    <select
                      id="region"
                      value={selectedRegion}
                      onChange={(e) => setSelectedRegion(e.target.value)}
                      className="w-full p-2 border rounded-md"
                    >
                      <option value="all">{t('map.allRegions')}</option>
                      <option value="north">{t('map.north')}</option>
                      <option value="central">{t('map.central')}</option>
                      <option value="south">{t('map.south')}</option>
                    </select>
                  </div>
                </CardContent>
              </Card>

              {/* Route Calculator for 40ft Container */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calculator className="w-5 h-5" />
                    40ft Container Route Calculator
                  </CardTitle>
                  <CardDescription>
                    Calculate optimal route with depot selection and operation costs
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>{t('map.departure')}</Label>
                    <select
                      value={departure?.id || ''}
                      onChange={(e) => {
                        const selected = provinces.find(p => p.id === e.target.value)
                        setDeparture(selected || null)
                      }}
                      className="w-full p-2 border rounded-md"
                    >
                      <option value="">{t('map.selectDeparture')}</option>
                      {provinces.map(province => (
                        <option key={province.id} value={province.id}>
                          {province.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label>{t('map.destination')}</Label>
                    <select
                      value={destination?.id || ''}
                      onChange={(e) => {
                        const selected = provinces.find(p => p.id === e.target.value)
                        setDestination(selected || null)
                      }}
                      className="w-full p-2 border rounded-md"
                    >
                      <option value="">{t('map.selectDestination')}</option>
                      {provinces.map(province => (
                        <option key={province.id} value={province.id}>
                          {province.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <Button
                    onClick={calculateRoute}
                    disabled={!departure || !destination || isCalculating}
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                  >
                    {isCalculating ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        {t('map.calculating')}
                      </>
                    ) : (
                      <>
                        <Navigation2 className="w-4 h-4 mr-2" />
                        {t('map.calculateRoute')}
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              {/* Route Calculation Results */}
              {routeCalculation && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="w-5 h-5 text-green-600" />
                      {t('map.routeResults')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <p className="text-2xl font-bold text-blue-600">{routeCalculation.distance} {t('common.km')}</p>
                        <p className="text-xs text-slate-600">{t('map.distance')}</p>
                      </div>
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <p className="text-2xl font-bold text-green-600">
                          {Math.floor(routeCalculation.estimatedTime / 60)}h {routeCalculation.estimatedTime % 60}m
                        </p>
                        <p className="text-xs text-slate-600">{t('map.estimatedTime')}</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-2 bg-slate-50 rounded">
                        <span className="text-sm">{t('map.fuelCost')}:</span>
                        <span className="font-semibold">{routeCalculation.fuelCost.toLocaleString()} {t('common.vnd')}</span>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-slate-50 rounded">
                        <span className="text-sm">{t('map.operationFees')}:</span>
                        <span className="font-semibold">{routeCalculation.operationFees.toLocaleString()} {t('common.vnd')}</span>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-indigo-50 rounded border border-indigo-200">
                        <span className="text-sm font-semibold">{t('map.totalCost')}:</span>
                        <span className="font-bold text-indigo-600">{routeCalculation.totalCost.toLocaleString()} {t('common.vnd')}</span>
                      </div>
                    </div>

                    <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                      <h4 className="font-semibold text-green-800 mb-2">{t('map.nearestDepot')}</h4>
                      <p className="text-sm text-green-700">{routeCalculation.nearestDepot.name}</p>
                      <p className="text-xs text-green-600">{t('map.operatingHours')}: {routeCalculation.nearestDepot.operatingHours}</p>
                    </div>

                    <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                      <h4 className="font-semibold text-yellow-800 mb-2">40ft Container Restrictions</h4>
                      <div className="text-xs text-yellow-700 space-y-1">
                        <p>• Allowed hours: {routeCalculation.truckingHours.allowed.join(', ')}</p>
                        <p>• Toll fees: {routeCalculation.routeDetails.tollFees.toLocaleString()} {t('common.vnd')}</p>
                        <p>• Rest stops: {routeCalculation.routeDetails.restStops}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Province List */}
              <Card>
                <CardHeader>
                  <CardTitle>Danh sách tỉnh/thành ({filteredProvinces.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {filteredProvinces.map((province) => (
                      <div
                        key={province.id}
                        onClick={() => setSelectedProvince(province)}
                        className={`p-3 rounded-lg cursor-pointer transition-colors ${
                          selectedProvince?.id === province.id
                            ? 'bg-indigo-100 border-indigo-300 border'
                            : 'bg-slate-50 hover:bg-slate-100'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">{province.name}</h4>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getRegionColor(province.region)}`}>
                            {getRegionName(province.region)}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs text-slate-600">
                          <div>{t('map.population')}: {(province.population / 1000000).toFixed(1)}M</div>
                          <div>{t('map.warehouses')}: {province.logistics.warehouses}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Province Details */}
            <div className="lg:col-span-2 space-y-6">
              {selectedProvince ? (
                <>
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <MapPin className="w-5 h-5" />
                        {selectedProvince.name}
                      </CardTitle>
                      <CardDescription>
                        Thông tin chi tiết về hạ tầng logistics
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        <div className="text-center p-3 bg-blue-50 rounded-lg">
                          <Users className="w-6 h-6 text-blue-600 mx-auto mb-1" />
                          <p className="text-lg font-bold text-blue-600">
                            {(selectedProvince.population / 1000000).toFixed(1)}M
                          </p>
                          <p className="text-xs text-slate-600">{t('map.population')}</p>
                        </div>
                        
                        <div className="text-center p-3 bg-green-50 rounded-lg">
                          <Map className="w-6 h-6 text-green-600 mx-auto mb-1" />
                          <p className="text-lg font-bold text-green-600">
                            {selectedProvince.area.toLocaleString()} km²
                          </p>
                          <p className="text-xs text-slate-600">{t('map.area')}</p>
                        </div>
                        
                        <div className="text-center p-3 bg-purple-50 rounded-lg">
                          <Building className="w-6 h-6 text-purple-600 mx-auto mb-1" />
                          <p className="text-lg font-bold text-purple-600">
                            {selectedProvince.economicZones}
                          </p>
                          <p className="text-xs text-slate-600">{t('map.economicZones')}</p>
                        </div>
                        
                        <div className="text-center p-3 bg-orange-50 rounded-lg">
                          <TrendingUp className="w-6 h-6 text-orange-600 mx-auto mb-1" />
                          <p className="text-lg font-bold text-orange-600">
                            {(selectedProvince.logistics.monthlyVolume / 1000).toLocaleString()}K
                          </p>
                          <p className="text-xs text-slate-600">{t('map.monthlyVolume')}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="p-3 border rounded-lg">
                          <p className="text-2xl font-bold text-slate-800">
                            {selectedProvince.logistics.warehouses}
                          </p>
                          <p className="text-sm text-slate-600">{t('map.warehouses')}</p>
                        </div>
                        
                        <div className="p-3 border rounded-lg">
                          <p className="text-2xl font-bold text-slate-800">
                            {selectedProvince.logistics.distributionCenters}
                          </p>
                          <p className="text-sm text-slate-600">{t('map.distributionCenters')}</p>
                        </div>
                        
                        <div className="p-3 border rounded-lg">
                          <p className="text-2xl font-bold text-slate-800">
                            {selectedProvince.logistics.activeRoutes}
                          </p>
                          <p className="text-sm text-slate-600">{t('map.routes')}</p>
                        </div>
                        
                        <div className="p-3 border rounded-lg">
                          <p className="text-2xl font-bold text-slate-800">
                            {selectedProvince.ports + selectedProvince.airports}
                          </p>
                          <p className="text-sm text-slate-600">{t('map.ports')}/{t('map.airports')}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Logistics Depots</CardTitle>
                      <CardDescription>
                        Các kho logistics chính tại {selectedProvince.name}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {selectedProvince.depots.map((depot) => (
                          <div key={depot.id} className="flex items-center gap-3 p-3 border rounded-lg">
                            <div className="p-2 rounded-full bg-blue-100 text-blue-600">
                              <Building className="w-4 h-4" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium">{depot.name}</h4>
                              <p className="text-sm text-slate-600">
                                Capacity: {depot.capacity.toLocaleString()} tons
                              </p>
                              <p className="text-xs text-slate-500">
                                Hours: {depot.operatingHours}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </>
              ) : (
                <Card>
                  <CardContent className="p-12 text-center">
                    <Map className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                    <h3 className="text-xl font-medium text-slate-600 mb-2">
                      {t('map.selectProvince')}
                    </h3>
                    <p className="text-slate-500">
                      {t('map.selectProvinceDesc')}
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  )
}

export default VietnamMapPage
