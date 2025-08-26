'use client'

import React, { useState, useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'
import { Search, MapPin, Navigation, Truck, Zap, Clock, DollarSign, Fuel, Target } from 'lucide-react'
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

  const originInputRef = useRef<HTMLInputElement>(null)
  const destinationInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setMapReady(true)
  }, [])

  // Handle origin search
  const handleOriginSearch = (query: string) => {
    setOriginQuery(query)
    if (query.length >= 2) {
      const suggestions = searchVietnameseLocations(query, 8)
      setOriginSuggestions(suggestions)
      setShowOriginSuggestions(true)
    } else {
      setOriginSuggestions([])
      setShowOriginSuggestions(false)
    }
  }

  // Handle destination search
  const handleDestinationSearch = (query: string) => {
    setDestinationQuery(query)
    if (query.length >= 2) {
      const suggestions = searchVietnameseLocations(query, 8)
      setDestinationSuggestions(suggestions)
      setShowDestinationSuggestions(true)
    } else {
      setDestinationSuggestions([])
      setShowDestinationSuggestions(false)
    }
  }

  // Select origin suggestion
  const selectOriginSuggestion = (location: LocationResult) => {
    setOriginQuery(location.name)
    setOriginSuggestions([])
    setShowOriginSuggestions(false)
    calculateRoute(location.name, destinationQuery)
  }

  // Select destination suggestion
  const selectDestinationSuggestion = (location: LocationResult) => {
    setDestinationQuery(location.name)
    setDestinationSuggestions([])
    setShowDestinationSuggestions(false)
    calculateRoute(originQuery, location.name)
  }

  // Calculate optimized route
  const calculateRoute = async (origin: string, destination: string) => {
    if (!origin || !destination || origin.length < 2 || destination.length < 2) return

    setIsCalculating(true)
    
    // Simulate API delay for realistic experience
    await new Promise(resolve => setTimeout(resolve, 1000))

    const route = calculateOptimizedRoute(origin, destination)
    if (route) {
      setOptimizedRoute(route)
      // Center map on route
      const bounds = route.routePath
      const centerLat = bounds.reduce((sum, coord) => sum + coord[0], 0) / bounds.length
      const centerLng = bounds.reduce((sum, coord) => sum + coord[1], 0) / bounds.length
      setMapCenter([centerLat, centerLng])
      setMapZoom(9)
    }
    
    setIsCalculating(false)
  }

  // Handle route calculation button
  const handleCalculateRoute = () => {
    calculateRoute(originQuery, destinationQuery)
  }

  // Clear route
  const clearRoute = () => {
    setOptimizedRoute(null)
    setOriginQuery('')
    setDestinationQuery('')
    setMapCenter([10.7769, 106.7009])
    setMapZoom(10)
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Search Interface */}
      <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-green-400">
            <Search className="w-5 h-5" />
            <span>Vietnamese Route Search</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Origin Search */}
            <div className="relative">
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Điểm xuất phát (Origin)
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 w-4 h-4 text-green-400" />
                <Input
                  ref={originInputRef}
                  type="text"
                  placeholder="Nhập tên thành phố, cảng, kho... (VD: Cat Lai, Cang Cat Lai, Ho Chi Minh)"
                  value={originQuery}
                  onChange={(e) => handleOriginSearch(e.target.value)}
                  onFocus={() => originQuery.length >= 2 && setShowOriginSuggestions(true)}
                  className="pl-10 bg-slate-700/50 border-slate-600/50 text-white placeholder-slate-400"
                />
              </div>
              
              {/* Origin Suggestions */}
              {showOriginSuggestions && originSuggestions.length > 0 && (
                <div className="absolute z-50 w-full mt-1 bg-slate-800 border border-slate-600 rounded-lg shadow-xl max-h-60 overflow-y-auto">
                  {originSuggestions.map((location) => (
                    <button
                      key={location.id}
                      onClick={() => selectOriginSuggestion(location)}
                      className="w-full px-4 py-3 text-left hover:bg-slate-700 border-b border-slate-700 last:border-b-0"
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${
                          location.type === 'port' ? 'bg-blue-400' :
                          location.type === 'depot' ? 'bg-green-400' :
                          location.type === 'warehouse' ? 'bg-yellow-400' :
                          'bg-purple-400'
                        }`}></div>
                        <div>
                          <div className="text-white font-medium">{location.name}</div>
                          <div className="text-slate-400 text-sm">
                            {location.nameEn} • {location.province}
                            {location.isDepot && (
                              <Badge variant="secondary" className="ml-2 text-xs">
                                Depot
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
            <div className="relative">
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Điểm đến (Destination)
              </label>
              <div className="relative">
                <Target className="absolute left-3 top-3 w-4 h-4 text-red-400" />
                <Input
                  ref={destinationInputRef}
                  type="text"
                  placeholder="Nhập điểm đến... (VD: Long An, Vung Tau, Can Tho)"
                  value={destinationQuery}
                  onChange={(e) => handleDestinationSearch(e.target.value)}
                  onFocus={() => destinationQuery.length >= 2 && setShowDestinationSuggestions(true)}
                  className="pl-10 bg-slate-700/50 border-slate-600/50 text-white placeholder-slate-400"
                />
              </div>
              
              {/* Destination Suggestions */}
              {showDestinationSuggestions && destinationSuggestions.length > 0 && (
                <div className="absolute z-50 w-full mt-1 bg-slate-800 border border-slate-600 rounded-lg shadow-xl max-h-60 overflow-y-auto">
                  {destinationSuggestions.map((location) => (
                    <button
                      key={location.id}
                      onClick={() => selectDestinationSuggestion(location)}
                      className="w-full px-4 py-3 text-left hover:bg-slate-700 border-b border-slate-700 last:border-b-0"
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${
                          location.type === 'port' ? 'bg-blue-400' :
                          location.type === 'depot' ? 'bg-green-400' :
                          location.type === 'warehouse' ? 'bg-yellow-400' :
                          'bg-purple-400'
                        }`}></div>
                        <div>
                          <div className="text-white font-medium">{location.name}</div>
                          <div className="text-slate-400 text-sm">
                            {location.nameEn} • {location.province}
                            {location.isDepot && (
                              <Badge variant="secondary" className="ml-2 text-xs">
                                Depot
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
              className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white px-6 py-2"
            >
              {isCalculating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Calculating...
                </>
              ) : (
                <>
                  <Navigation className="w-4 h-4 mr-2" />
                  Calculate Route
                </>
              )}
            </Button>
            
            {optimizedRoute && (
              <Button
                onClick={clearRoute}
                variant="outline"
                className="border-slate-600 text-slate-300 hover:bg-slate-700"
              >
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
                <span className="text-blue-400 font-semibold">{optimizedRoute.depot.name}</span>
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
            </div>
          </CardContent>
        </Card>
      )}

      {/* Interactive Map */}
      <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-purple-400">
            <Zap className="w-5 h-5" />
            <span>🗺️ Enhanced Interactive Map</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="h-[600px] rounded-b-lg overflow-hidden relative">
            {/* Map Status */}
            <div className="absolute top-4 left-4 right-4 z-[1000] bg-slate-900/90 backdrop-blur-sm rounded-lg p-3 border border-purple-500/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse"></div>
                  <span className="text-purple-400 font-semibold">ENHANCED INTERACTIVE MAP</span>
                </div>
                <div className="text-slate-300 text-sm">
                  {optimizedRoute ? 
                    `Route: ${optimizedRoute.origin.name} → ${optimizedRoute.destination.name}` :
                    'Search Vietnamese locations above'
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
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                
                {/* Show all depots/warehouses */}
                {VIETNAM_LOCATIONS.filter(loc => loc.isDepot).map((depot) => (
                  <Marker key={depot.id} position={depot.coordinates}>
                    <Popup>
                      <div style={{ color: '#000', fontWeight: 'bold', minWidth: '200px' }}>
                        <div style={{ fontSize: '16px', marginBottom: '8px' }}>
                          🏭 {depot.name}
                        </div>
                        <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>
                          {depot.type === 'port' ? 'Cảng' : depot.type === 'depot' ? 'Kho' : 'Nhà kho'}
                        </div>
                        <div style={{ fontSize: '11px', color: '#888' }}>
                          Capacity: {depot.capacity?.toLocaleString()} tons
                        </div>
                        <div style={{ fontSize: '11px', color: '#888' }}>
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
                        <div style={{ color: '#000', fontWeight: 'bold', minWidth: '200px' }}>
                          <div style={{ fontSize: '16px', marginBottom: '8px' }}>
                            🔵 {optimizedRoute.depot.name}
                          </div>
                          <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>
                            Nearest Depot - Kho gần nhất
                          </div>
                          <div style={{ fontSize: '11px', color: '#888' }}>
                            Capacity: {optimizedRoute.depot.capacity?.toLocaleString()} tons
                          </div>
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
                      weight={5}
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
                  <p className="text-slate-400">Preparing Vietnamese logistics network</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
