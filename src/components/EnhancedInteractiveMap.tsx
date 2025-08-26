'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import dynamic from 'next/dynamic'
import { Search, MapPin, Navigation, Truck, Zap, Clock, DollarSign, Fuel, Target, X, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  searchVietnameseLocations,
  calculateOptimizedRoute,
  LocationResult,
  OptimizedRoute,
  VIETNAM_LOCATIONS
} from '@/utils/vietnameseLocationSearch'

// Dynamic imports for Leaflet
const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false })
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false })
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false })
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false })
const Polyline = dynamic(() => import('react-leaflet').then(mod => mod.Polyline), { ssr: false })

interface EnhancedInteractiveMapProps {
  className?: string
}

export default function EnhancedInteractiveMap({ className = '' }: EnhancedInteractiveMapProps) {
  const [mapReady, setMapReady] = useState(false)
  const [originQuery, setOriginQuery] = useState('')
  const [destinationQuery, setDestinationQuery] = useState('')
  const [originSuggestions, setOriginSuggestions] = useState<LocationResult[]>([])
  const [destinationSuggestions, setDestinationSuggestions] = useState<LocationResult[]>([])
  const [showOriginSuggestions, setShowOriginSuggestions] = useState(false)
  const [showDestinationSuggestions, setShowDestinationSuggestions] = useState(false)
  const [optimizedRoute, setOptimizedRoute] = useState<OptimizedRoute | null>(null)
  const [isCalculating, setIsCalculating] = useState(false)
  const [mapCenter, setMapCenter] = useState<[number, number]>([10.7769, 106.7009])
  const [mapZoom, setMapZoom] = useState(10)
  const [searchError, setSearchError] = useState<string | null>(null)

  const originInputRef = useRef<HTMLInputElement>(null)
  const destinationInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setMapReady(true)
  }, [])

  // Debounced search function
  const debounceSearch = useCallback((func: Function, delay: number) => {
    let timeoutId: NodeJS.Timeout
    return (...args: any[]) => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => func.apply(null, args), delay)
    }
  }, [])

  // Handle origin search with debouncing
  const handleOriginSearch = useCallback(debounceSearch((query: string) => {
    setOriginQuery(query)
    setSearchError(null)
    
    if (query.length >= 2) {
      try {
        const suggestions = searchVietnameseLocations(query, 8)
        setOriginSuggestions(suggestions)
        setShowOriginSuggestions(true)
      } catch (error) {
        setSearchError('Error searching locations')
        setOriginSuggestions([])
      }
    } else {
      setOriginSuggestions([])
      setShowOriginSuggestions(false)
    }
  }, 300), [])

  // Handle destination search with debouncing
  const handleDestinationSearch = useCallback(debounceSearch((query: string) => {
    setDestinationQuery(query)
    setSearchError(null)
    
    if (query.length >= 2) {
      try {
        const suggestions = searchVietnameseLocations(query, 8)
        setDestinationSuggestions(suggestions)
        setShowDestinationSuggestions(true)
      } catch (error) {
        setSearchError('Error searching locations')
        setDestinationSuggestions([])
      }
    } else {
      setDestinationSuggestions([])
      setShowDestinationSuggestions(false)
    }
  }, 300), [])

  // Select origin suggestion
  const selectOriginSuggestion = useCallback((location: LocationResult) => {
    setOriginQuery(location.name)
    setOriginSuggestions([])
    setShowOriginSuggestions(false)
    if (destinationQuery.length >= 2) {
      calculateRoute(location.name, destinationQuery)
    }
  }, [destinationQuery])

  // Select destination suggestion
  const selectDestinationSuggestion = useCallback((location: LocationResult) => {
    setDestinationQuery(location.name)
    setDestinationSuggestions([])
    setShowDestinationSuggestions(false)
    if (originQuery.length >= 2) {
      calculateRoute(originQuery, location.name)
    }
  }, [originQuery])

  // Calculate optimized route
  const calculateRoute = useCallback(async (origin: string, destination: string) => {
    if (!origin || !destination || origin.length < 2 || destination.length < 2) return

    setIsCalculating(true)
    setSearchError(null)
    
    try {
      // Simulate realistic API delay
      await new Promise(resolve => setTimeout(resolve, 1200))

      const route = calculateOptimizedRoute(origin, destination)
      if (route) {
        setOptimizedRoute(route)
        // Center map on route
        const bounds = route.routePath
        const centerLat = bounds.reduce((sum, coord) => sum + coord[0], 0) / bounds.length
        const centerLng = bounds.reduce((sum, coord) => sum + coord[1], 0) / bounds.length
        setMapCenter([centerLat, centerLng])
        setMapZoom(9)
      } else {
        setSearchError('Could not find route between these locations')
      }
    } catch (error) {
      setSearchError('Error calculating route. Please try again.')
    } finally {
      setIsCalculating(false)
    }
  }, [])

  // Handle route calculation button
  const handleCalculateRoute = useCallback(() => {
    calculateRoute(originQuery, destinationQuery)
  }, [originQuery, destinationQuery, calculateRoute])

  // Clear route
  const clearRoute = useCallback(() => {
    setOptimizedRoute(null)
    setOriginQuery('')
    setDestinationQuery('')
    setMapCenter([10.7769, 106.7009])
    setMapZoom(10)
    setSearchError(null)
  }, [])

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (originInputRef.current && !originInputRef.current.contains(event.target as Node)) {
        setShowOriginSuggestions(false)
      }
      if (destinationInputRef.current && !destinationInputRef.current.contains(event.target as Node)) {
        setShowDestinationSuggestions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Search Interface */}
      <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-green-400">
            <Search className="w-5 h-5" />
            <span>Enhanced Vietnamese Route Search</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search Error */}
          {searchError && (
            <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-3 flex items-center space-x-2">
              <X className="w-4 h-4 text-red-400" />
              <span className="text-red-400 text-sm">{searchError}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSearchError(null)}
                className="ml-auto text-red-400 hover:text-red-300"
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Origin Search */}
            <div className="relative" ref={originInputRef}>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Điểm xuất phát (Origin)
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 w-4 h-4 text-green-400" />
                <Input
                  type="text"
                  placeholder="VD: Cat Lai, Cang Cat Lai, Ho Chi Minh, Saigon..."
                  value={originQuery}
                  onChange={(e) => {
                    setOriginQuery(e.target.value)
                    handleOriginSearch(e.target.value)
                  }}
                  onFocus={() => originQuery.length >= 2 && setShowOriginSuggestions(true)}
                  className="pl-10 bg-slate-700/50 border-slate-600/50 text-white placeholder-slate-400 focus:border-green-400 focus:ring-green-400/20"
                />
                {originQuery && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setOriginQuery('')
                      setOriginSuggestions([])
                      setShowOriginSuggestions(false)
                    }}
                    className="absolute right-2 top-2 text-slate-400 hover:text-white"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                )}
              </div>
              
              {/* Origin Suggestions */}
              {showOriginSuggestions && originSuggestions.length > 0 && (
                <div className="absolute z-50 w-full mt-1 bg-slate-800 border border-slate-600 rounded-lg shadow-xl max-h-60 overflow-y-auto">
                  {originSuggestions.map((location) => (
                    <button
                      key={location.id}
                      onClick={() => selectOriginSuggestion(location)}
                      className="w-full px-4 py-3 text-left hover:bg-slate-700 border-b border-slate-700 last:border-b-0 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${
                          location.type === 'port' ? 'bg-blue-400' :
                          location.type === 'depot' ? 'bg-green-400' :
                          location.type === 'warehouse' ? 'bg-yellow-400' :
                          location.type === 'logistics_center' ? 'bg-purple-400' :
                          'bg-slate-400'
                        }`}></div>
                        <div className="flex-1">
                          <div className="text-white font-medium">{location.name}</div>
                          <div className="text-slate-400 text-sm flex items-center space-x-2">
                            <span>{location.nameEn} • {location.province}</span>
                            {location.isDepot && (
                              <Badge variant="secondary" className="text-xs">
                                {location.type === 'port' ? 'Port' : 
                                 location.type === 'logistics_center' ? 'Logistics' : 'Depot'}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Destination Search */}
            <div className="relative" ref={destinationInputRef}>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Điểm đến (Destination)
              </label>
              <div className="relative">
                <Target className="absolute left-3 top-3 w-4 h-4 text-red-400" />
                <Input
                  type="text"
                  placeholder="VD: Long An, Vung Tau, Can Tho, Da Nang..."
                  value={destinationQuery}
                  onChange={(e) => {
                    setDestinationQuery(e.target.value)
                    handleDestinationSearch(e.target.value)
                  }}
                  onFocus={() => destinationQuery.length >= 2 && setShowDestinationSuggestions(true)}
                  className="pl-10 bg-slate-700/50 border-slate-600/50 text-white placeholder-slate-400 focus:border-red-400 focus:ring-red-400/20"
                />
                {destinationQuery && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setDestinationQuery('')
                      setDestinationSuggestions([])
                      setShowDestinationSuggestions(false)
                    }}
                    className="absolute right-2 top-2 text-slate-400 hover:text-white"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                )}
              </div>
              
              {/* Destination Suggestions */}
              {showDestinationSuggestions && destinationSuggestions.length > 0 && (
                <div className="absolute z-50 w-full mt-1 bg-slate-800 border border-slate-600 rounded-lg shadow-xl max-h-60 overflow-y-auto">
                  {destinationSuggestions.map((location) => (
                    <button
                      key={location.id}
                      onClick={() => selectDestinationSuggestion(location)}
                      className="w-full px-4 py-3 text-left hover:bg-slate-700 border-b border-slate-700 last:border-b-0 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${
                          location.type === 'port' ? 'bg-blue-400' :
                          location.type === 'depot' ? 'bg-green-400' :
                          location.type === 'warehouse' ? 'bg-yellow-400' :
                          location.type === 'logistics_center' ? 'bg-purple-400' :
                          'bg-slate-400'
                        }`}></div>
                        <div className="flex-1">
                          <div className="text-white font-medium">{location.name}</div>
                          <div className="text-slate-400 text-sm flex items-center space-x-2">
                            <span>{location.nameEn} • {location.province}</span>
                            {location.isDepot && (
                              <Badge variant="secondary" className="text-xs">
                                {location.type === 'port' ? 'Port' : 
                                 location.type === 'logistics_center' ? 'Logistics' : 'Depot'}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4">
            <Button
              onClick={handleCalculateRoute}
              disabled={!originQuery || !destinationQuery || isCalculating}
              className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white px-6 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isCalculating ? (
                <>
                  <Loader2 className="animate-spin h-4 w-4 mr-2" />
                  Calculating Route...
                </>
              ) : (
                <>
                  <Navigation className="w-4 h-4 mr-2" />
                  Calculate Optimized Route
                </>
              )}
            </Button>
            
            {optimizedRoute && (
              <Button
                onClick={clearRoute}
                variant="outline"
                className="border-slate-600 text-slate-300 hover:bg-slate-700"
              >
                <X className="w-4 h-4 mr-2" />
                Clear Route
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Route Information */}
      {optimizedRoute && (
        <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-blue-400">
              <Truck className="w-5 h-5" />
              <span>Optimized Route Information</span>
              <Badge variant={optimizedRoute.routeType === 'via_depot' ? 'default' : 'secondary'}>
                {optimizedRoute.routeType === 'via_depot' ? 'Via Depot' : 'Direct Route'}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="bg-gradient-to-r from-green-500/20 to-green-600/20 border border-green-500/30 rounded-lg p-4 text-center">
                <Clock className="w-6 h-6 text-green-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-green-400">{optimizedRoute.estimatedTime}</div>
                <div className="text-sm text-slate-400">Estimated Time</div>
              </div>
              <div className="bg-gradient-to-r from-blue-500/20 to-blue-600/20 border border-blue-500/30 rounded-lg p-4 text-center">
                <MapPin className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-blue-400">{optimizedRoute.totalDistance.toFixed(1)} km</div>
                <div className="text-sm text-slate-400">Total Distance</div>
              </div>
              <div className="bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 border border-yellow-500/30 rounded-lg p-4 text-center">
                <DollarSign className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-yellow-400">{optimizedRoute.estimatedCost}</div>
                <div className="text-sm text-slate-400">Estimated Cost</div>
              </div>
              <div className="bg-gradient-to-r from-red-500/20 to-red-600/20 border border-red-500/30 rounded-lg p-4 text-center">
                <Fuel className="w-6 h-6 text-red-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-red-400">{optimizedRoute.fuelConsumption}</div>
                <div className="text-sm text-slate-400">Fuel Consumption</div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Origin:</span>
                <span className="text-green-400 font-semibold">{optimizedRoute.origin.name}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Nearest Depot:</span>
                <div className="flex items-center space-x-2">
                  <span className="text-blue-400 font-semibold">{optimizedRoute.depot.name}</span>
                  <Badge variant="outline" className="text-xs">
                    {optimizedRoute.depot.capacity?.toLocaleString()} tons
                  </Badge>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Destination:</span>
                <span className="text-red-400 font-semibold">{optimizedRoute.destination.name}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Route Efficiency:</span>
                <Badge variant={optimizedRoute.efficiency > 85 ? 'default' : 'secondary'}>
                  {optimizedRoute.efficiency.toFixed(0)}%
                </Badge>
              </div>
              {optimizedRoute.depot.services && (
                <div className="flex justify-between items-start">
                  <span className="text-slate-400">Depot Services:</span>
                  <div className="flex flex-wrap gap-1 max-w-xs">
                    {optimizedRoute.depot.services.map((service, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {service}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Enhanced Interactive Map with OpenFreeMap */}
      <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-purple-400">
            <Zap className="w-5 h-5" />
            <span>🗺️ Enhanced Interactive Map (OpenFreeMap)</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="h-[700px] rounded-b-lg overflow-hidden relative">
            {/* Map Status */}
            <div className="absolute top-4 left-4 right-4 z-[1000] bg-slate-900/90 backdrop-blur-sm rounded-lg p-3 border border-purple-500/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse"></div>
                  <span className="text-purple-400 font-semibold">ENHANCED INTERACTIVE MAP</span>
                  <Badge variant="outline" className="text-xs">OpenFreeMap</Badge>
                </div>
                <div className="text-slate-300 text-sm">
                  {optimizedRoute ? 
                    `${optimizedRoute.origin.name} → ${optimizedRoute.destination.name} (${optimizedRoute.totalDistance.toFixed(1)}km)` :
                    `${VIETNAM_LOCATIONS.filter(l => l.isDepot).length} depots available`
                  }
                </div>
              </div>
            </div>

            {mapReady ? (
              <MapContainer
                center={mapCenter}
                zoom={mapZoom}
                style={{ height: '100%', width: '100%' }}
                zoomControl={true}
              >
                {/* OpenFreeMap Tiles */}
                <TileLayer
                  attribution='&copy; <a href="https://openfreemap.org">OpenFreeMap</a> contributors'
                  url="https://tiles.openfreemap.org/osm/{z}/{x}/{y}.png"
                />
                
                {/* Show all depots/warehouses when no route */}
                {!optimizedRoute && VIETNAM_LOCATIONS.filter(loc => loc.isDepot).map((depot) => (
                  <Marker key={depot.id} position={depot.coordinates}>
                    <Popup>
                      <div style={{ color: '#000', fontWeight: 'bold', minWidth: '250px' }}>
                        <div style={{ fontSize: '16px', marginBottom: '8px' }}>
                          {depot.type === 'port' ? '🚢' : depot.type === 'logistics_center' ? '🏭' : '🏪'} {depot.name}
                        </div>
                        <div style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>
                          {depot.type === 'port' ? 'Cảng biển' : 
                           depot.type === 'logistics_center' ? 'Trung tâm Logistics' : 
                           depot.type === 'depot' ? 'Kho hàng' : 'Nhà kho'}
                        </div>
                        <div style={{ fontSize: '11px', color: '#888', marginBottom: '4px' }}>
                          <strong>Capacity:</strong> {depot.capacity?.toLocaleString()} tons
                        </div>
                        {depot.services && (
                          <div style={{ fontSize: '11px', color: '#888', marginBottom: '4px' }}>
                            <strong>Services:</strong> {depot.services.join(', ')}
                          </div>
                        )}
                        {depot.operatingHours && (
                          <div style={{ fontSize: '11px', color: '#888', marginBottom: '4px' }}>
                            <strong>Hours:</strong> {depot.operatingHours}
                          </div>
                        )}
                        <div style={{ fontSize: '10px', color: '#999' }}>
                          GPS: {depot.coordinates[0].toFixed(4)}, {depot.coordinates[1].toFixed(4)}
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                ))}

                {/* Show optimized route */}
                {optimizedRoute && (
                  <>
                    {/* Origin Marker */}
                    <Marker position={optimizedRoute.origin.coordinates}>
                      <Popup>
                        <div style={{ color: '#000', fontWeight: 'bold', minWidth: '200px' }}>
                          <div style={{ fontSize: '16px', marginBottom: '8px' }}>
                            🟢 {optimizedRoute.origin.name}
                          </div>
                          <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>
                            Origin - Điểm xuất phát
                          </div>
                          <div style={{ fontSize: '11px', color: '#888' }}>
                            {optimizedRoute.origin.province}
                          </div>
                        </div>
                      </Popup>
                    </Marker>

                    {/* Depot Marker */}
                    <Marker position={optimizedRoute.depot.coordinates}>
                      <Popup>
                        <div style={{ color: '#000', fontWeight: 'bold', minWidth: '250px' }}>
                          <div style={{ fontSize: '16px', marginBottom: '8px' }}>
                            🔵 {optimizedRoute.depot.name}
                          </div>
                          <div style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>
                            Nearest Depot - Kho gần nhất
                          </div>
                          <div style={{ fontSize: '11px', color: '#888', marginBottom: '4px' }}>
                            <strong>Capacity:</strong> {optimizedRoute.depot.capacity?.toLocaleString()} tons
                          </div>
                          {optimizedRoute.depot.services && (
                            <div style={{ fontSize: '11px', color: '#888', marginBottom: '4px' }}>
                              <strong>Services:</strong> {optimizedRoute.depot.services.join(', ')}
                            </div>
                          )}
                          {optimizedRoute.depot.operatingHours && (
                            <div style={{ fontSize: '11px', color: '#888' }}>
                              <strong>Hours:</strong> {optimizedRoute.depot.operatingHours}
                            </div>
                          )}
                        </div>
                      </Popup>
                    </Marker>

                    {/* Destination Marker */}
                    <Marker position={optimizedRoute.destination.coordinates}>
                      <Popup>
                        <div style={{ color: '#000', fontWeight: 'bold', minWidth: '200px' }}>
                          <div style={{ fontSize: '16px', marginBottom: '8px' }}>
                            🔴 {optimizedRoute.destination.name}
                          </div>
                          <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>
                            Destination - Điểm đến
                          </div>
                          <div style={{ fontSize: '11px', color: '#888' }}>
                            {optimizedRoute.destination.province}
                          </div>
                        </div>
                      </Popup>
                    </Marker>

                    {/* Route Polyline */}
                    <Polyline
                      positions={optimizedRoute.routePath}
                      color="#8b5cf6"
                      weight={6}
                      opacity={0.8}
                    />
                  </>
                )}
              </MapContainer>
            ) : (
              <div className="h-full flex items-center justify-center bg-slate-900/50">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-400 mx-auto mb-6"></div>
                  <h3 className="text-xl font-semibold text-white mb-2">Loading Enhanced Map...</h3>
                  <p className="text-slate-400">Preparing comprehensive Vietnamese logistics network</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
