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
  Label,
  Badge
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
  Zap,
  Anchor,
  Warehouse,
  Factory,
  DollarSign
} from 'lucide-react'
import {
  VIETNAM_LOCATIONS,
  ENHANCED_PROVINCES,
  COMMON_ROUTES,
  searchLocations,
  getLocationsByType,
  calculateDetailedRoute,
  DetailedLocation,
  EnhancedProvince
} from '@/lib/vietnamLocations'

const VietnamMapPage = () => {
  const { t } = useLanguage()
  const [selectedLocation, setSelectedLocation] = useState<DetailedLocation | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState<string>('all')
  const [selectedRegion, setSelectedRegion] = useState<string>('all')
  const [departure, setDeparture] = useState<DetailedLocation | null>(null)
  const [destination, setDestination] = useState<DetailedLocation | null>(null)
  const [routeCalculation, setRouteCalculation] = useState<any>(null)
  const [isCalculating, setIsCalculating] = useState(false)
  const [filteredLocations, setFilteredLocations] = useState<DetailedLocation[]>(VIETNAM_LOCATIONS)

  // Filter locations based on search and filters
  useEffect(() => {
    let filtered = searchLocations(searchTerm)
    
    if (selectedType !== 'all') {
      filtered = filtered.filter(loc => loc.type === selectedType)
    }
    
    if (selectedRegion !== 'all') {
      filtered = filtered.filter(loc => loc.region === selectedRegion)
    }
    
    setFilteredLocations(filtered)
  }, [searchTerm, selectedType, selectedRegion])

  const calculateRoute = async () => {
    if (!departure || !destination) return
    
    setIsCalculating(true)
    try {
      // Simulate calculation time
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      const result = calculateDetailedRoute(departure, destination, '40ft')
      setRouteCalculation(result)
    } catch (error) {
      console.error('Route calculation error:', error)
    } finally {
      setIsCalculating(false)
    }
  }

  const getLocationIcon = (type: string) => {
    switch (type) {
      case 'port': return <Anchor className="w-4 h-4" />
      case 'depot': return <Truck className="w-4 h-4" />
      case 'warehouse': return <Warehouse className="w-4 h-4" />
      case 'industrial_zone': return <Factory className="w-4 h-4" />
      case 'logistics_hub': return <Package className="w-4 h-4" />
      default: return <MapPin className="w-4 h-4" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'port': return 'bg-blue-100 text-blue-800'
      case 'depot': return 'bg-green-100 text-green-800'
      case 'warehouse': return 'bg-purple-100 text-purple-800'
      case 'industrial_zone': return 'bg-orange-100 text-orange-800'
      case 'logistics_hub': return 'bg-indigo-100 text-indigo-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-slate-900 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold gradient-text mb-2">
              Enhanced Vietnam Logistics Map
            </h1>
            <p className="text-slate-400">
              Detailed logistics network with ports, depots, and industrial zones
            </p>
          </div>

          {/* Search and Filters */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="w-5 h-5" />
                Search & Filter Locations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="search">Search</Label>
                  <Input
                    id="search"
                    placeholder="Search locations, ports, depots..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="type">Type</Label>
                  <select 
                    id="type"
                    value={selectedType} 
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="mt-1 w-full p-2 border border-gray-300 rounded-md bg-white"
                  >
                    <option value="all">All types</option>
                    <option value="port">Ports</option>
                    <option value="depot">Depots</option>
                    <option value="warehouse">Warehouses</option>
                    <option value="industrial_zone">Industrial Zones</option>
                    <option value="logistics_hub">Logistics Hubs</option>
                  </select>
                </div>
                
                <div>
                  <Label htmlFor="region">Region</Label>
                  <select 
                    id="region"
                    value={selectedRegion} 
                    onChange={(e) => setSelectedRegion(e.target.value)}
                    className="mt-1 w-full p-2 border border-gray-300 rounded-md bg-white"
                  >
                    <option value="all">All regions</option>
                    <option value="north">Northern Vietnam</option>
                    <option value="central">Central Vietnam</option>
                    <option value="south">Southern Vietnam</option>
                  </select>
                </div>
                
                <div className="flex items-end">
                  <Button 
                    onClick={() => {
                      setSearchTerm('')
                      setSelectedType('all')
                      setSelectedRegion('all')
                    }}
                    variant="outline"
                    className="w-full"
                  >
                    Clear Filters
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Route Calculator */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Navigation className="w-5 h-5" />
                Route Calculator (40ft Container)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="departure">Departure</Label>
                  <select 
                    id="departure"
                    value={departure?.id || ''} 
                    onChange={(e) => {
                      const location = VIETNAM_LOCATIONS.find(loc => loc.id === e.target.value)
                      setDeparture(location || null)
                    }}
                    className="mt-1 w-full p-2 border border-gray-300 rounded-md bg-white"
                  >
                    <option value="">Select departure</option>
                    {VIETNAM_LOCATIONS.map((location) => (
                      <option key={location.id} value={location.id}>
                        {location.name} ({location.type})
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <Label htmlFor="destination">Destination</Label>
                  <select 
                    id="destination"
                    value={destination?.id || ''} 
                    onChange={(e) => {
                      const location = VIETNAM_LOCATIONS.find(loc => loc.id === e.target.value)
                      setDestination(location || null)
                    }}
                    className="mt-1 w-full p-2 border border-gray-300 rounded-md bg-white"
                  >
                    <option value="">Select destination</option>
                    {VIETNAM_LOCATIONS.map((location) => (
                      <option key={location.id} value={location.id}>
                        {location.name} ({location.type})
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="flex items-end">
                  <Button 
                    onClick={calculateRoute}
                    disabled={!departure || !destination || isCalculating}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                  >
                    {isCalculating ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Calculating...
                      </>
                    ) : (
                      <>
                        <Calculator className="w-4 h-4 mr-2" />
                        Calculate Route
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Route Results */}
          {routeCalculation && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Navigation2 className="w-5 h-5" />
                  Route Calculation Results
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{routeCalculation.distance} km</div>
                    <div className="text-sm text-slate-600">Distance</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{routeCalculation.estimatedTime}h</div>
                    <div className="text-sm text-slate-600">Estimated Time</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">
                      {(routeCalculation.fuelCost / 1000).toFixed(0)}K
                    </div>
                    <div className="text-sm text-slate-600">Fuel Cost (VND)</div>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">
                      {(routeCalculation.totalCost / 1000000).toFixed(1)}M
                    </div>
                    <div className="text-sm text-slate-600">Total Cost (VND)</div>
                  </div>
                </div>

                {/* Recommendations */}
                {routeCalculation.recommendations.length > 0 && (
                  <div className="mb-4">
                    <h4 className="font-medium mb-2">AI Recommendations:</h4>
                    <div className="space-y-2">
                      {routeCalculation.recommendations.map((rec: string, index: number) => (
                        <div key={index} className="flex items-start gap-2 p-2 bg-amber-50 rounded">
                          <Zap className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-amber-800">{rec}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Nearest Depots */}
                {routeCalculation.nearestDepots.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Nearest Depots:</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {routeCalculation.nearestDepots.map((depot: DetailedLocation) => (
                        <div key={depot.id} className="p-3 border rounded-lg bg-slate-50">
                          <div className="flex items-center gap-2 mb-1">
                            <Truck className="w-4 h-4 text-green-600" />
                            <span className="font-medium text-sm">{depot.name}</span>
                          </div>
                          <div className="text-xs text-slate-600">{depot.operatingHours}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Locations Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Locations List */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Logistics Locations ({filteredLocations.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {filteredLocations.map((location) => (
                      <div 
                        key={location.id}
                        className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                          selectedLocation?.id === location.id ? 'bg-blue-50 border-blue-200' : 'hover:bg-slate-50'
                        }`}
                        onClick={() => setSelectedLocation(location)}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            {getLocationIcon(location.type)}
                            <span className="font-medium">{location.name}</span>
                          </div>
                          <Badge className={getTypeColor(location.type)}>
                            {location.type.replace('_', ' ').toUpperCase()}
                          </Badge>
                        </div>
                        
                        <div className="text-sm text-slate-600 space-y-1">
                          <div>{location.nameEn}</div>
                          <div className="flex items-center gap-4">
                            <span>{location.province}</span>
                            <span className="capitalize">{location.region}</span>
                            <span>{location.operatingHours}</span>
                          </div>
                          {location.specialties && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {location.specialties.slice(0, 3).map((specialty, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {specialty.replace('_', ' ')}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                    
                    {filteredLocations.length === 0 && (
                      <div className="text-center py-8 text-slate-500">
                        <MapPin className="w-12 h-12 mx-auto mb-3 opacity-50" />
                        <p>No locations found matching your criteria</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Location Details */}
            <div>
              {selectedLocation ? (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      {getLocationIcon(selectedLocation.type)}
                      {selectedLocation.name}
                    </CardTitle>
                    <CardDescription>{selectedLocation.nameEn}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <Badge className={getTypeColor(selectedLocation.type)}>
                          {selectedLocation.type.replace('_', ' ').toUpperCase()}
                        </Badge>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">Location Details</h4>
                        <div className="text-sm space-y-1">
                          <div><span className="font-medium">Province:</span> {selectedLocation.province}</div>
                          <div><span className="font-medium">Region:</span> {selectedLocation.region}</div>
                          <div><span className="font-medium">Operating Hours:</span> {selectedLocation.operatingHours}</div>
                          {selectedLocation.capacity && (
                            <div><span className="font-medium">Capacity:</span> {selectedLocation.capacity.toLocaleString()} TEU</div>
                          )}
                        </div>
                      </div>

                      {selectedLocation.services.length > 0 && (
                        <div>
                          <h4 className="font-medium mb-2">Services</h4>
                          <div className="flex flex-wrap gap-1">
                            {selectedLocation.services.map((service, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {service.replace('_', ' ')}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {selectedLocation.specialties && selectedLocation.specialties.length > 0 && (
                        <div>
                          <h4 className="font-medium mb-2">Specialties</h4>
                          <div className="flex flex-wrap gap-1">
                            {selectedLocation.specialties.map((specialty, index) => (
                              <Badge key={index} variant="outline" className="text-xs bg-blue-50">
                                {specialty.replace('_', ' ')}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {selectedLocation.equipment && selectedLocation.equipment.length > 0 && (
                        <div>
                          <h4 className="font-medium mb-2">Equipment</h4>
                          <div className="text-sm space-y-1">
                            {selectedLocation.equipment.map((equipment, index) => (
                              <div key={index}>• {equipment.replace('_', ' ')}</div>
                            ))}
                          </div>
                        </div>
                      )}

                      {selectedLocation.contactInfo && (
                        <div>
                          <h4 className="font-medium mb-2">Contact Information</h4>
                          <div className="text-sm space-y-1">
                            <div>{selectedLocation.contactInfo.address}</div>
                            {selectedLocation.contactInfo.phone && (
                              <div><span className="font-medium">Phone:</span> {selectedLocation.contactInfo.phone}</div>
                            )}
                            {selectedLocation.contactInfo.email && (
                              <div><span className="font-medium">Email:</span> {selectedLocation.contactInfo.email}</div>
                            )}
                          </div>
                        </div>
                      )}

                      <div className="pt-4 border-t">
                        <div className="grid grid-cols-2 gap-2">
                          <Button
                            onClick={() => setDeparture(selectedLocation)}
                            variant="outline"
                            size="sm"
                          >
                            Set as Departure
                          </Button>
                          <Button
                            onClick={() => setDestination(selectedLocation)}
                            variant="outline"
                            size="sm"
                          >
                            Set as Destination
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <MapPin className="w-16 h-16 mx-auto mb-4 opacity-50 text-slate-400" />
                    <p className="text-slate-500">Select a location to view details</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Common Routes */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Navigation className="w-5 h-5" />
                Common Logistics Routes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {COMMON_ROUTES.map((route) => (
                  <div key={route.id} className="p-4 border rounded-lg bg-slate-50">
                    <div className="font-medium mb-2">{route.name}</div>
                    <div className="text-sm text-slate-600 space-y-1">
                      <div className="flex items-center gap-2">
                        <Navigation className="w-3 h-3" />
                        {route.distance} km • {route.estimatedTime}h
                      </div>
                      <div className="flex items-center gap-2">
                        <Fuel className="w-3 h-3" />
                        Fuel: {(route.fuelCost / 1000).toFixed(0)}K VND
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-3 h-3" />
                        Toll: {(route.tollCost / 1000).toFixed(0)}K VND
                      </div>
                      <div className="text-xs text-slate-500 mt-2">
                        Frequency: {route.frequency}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AuthGuard>
  )
}

export default VietnamMapPage
