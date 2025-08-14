// Additional tabs for WorkingComprehensiveRouteOptimizer

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { TabsContent } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  MapPin, 
  Search,
  Plus,
  Minus,
  CheckCircle,
  Globe,
  Truck,
  BarChart3,
  TrendingUp,
  DollarSign,
  Clock,
  Target,
  Fuel,
  AlertTriangle
} from 'lucide-react';

// Vietnam Locations Tab
export const VietnamLocationsTab = ({ 
  searchQuery, 
  setSearchQuery, 
  selectedProvince, 
  setSelectedProvince, 
  filteredLocations, 
  selectedPoints, 
  addPointFromLocation, 
  removePoint 
}: any) => (
  <TabsContent value="locations" className="space-y-6">
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Search and Filters */}
      <div className="lg:col-span-1 space-y-6">
        <Card className="bg-gray-800/80 backdrop-blur-xl border-gray-700/50">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Search className="h-5 w-5 mr-2 text-blue-400" />
              Search Locations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-gray-300">Search Query</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search locations..."
                  className="pl-10 bg-gray-700/50 border-gray-600/50 text-white placeholder-gray-400"
                />
              </div>
            </div>

            <div>
              <Label className="text-gray-300">Province Filter</Label>
              <Select value={selectedProvince} onValueChange={setSelectedProvince}>
                <SelectTrigger className="bg-gray-700/50 border-gray-600/50 text-white">
                  <SelectValue placeholder="All provinces" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-600">
                  <SelectItem value="">All Provinces</SelectItem>
                  <SelectItem value="TP.HCM">TP. Hồ Chí Minh</SelectItem>
                  <SelectItem value="Hà Nội">Hà Nội</SelectItem>
                  <SelectItem value="Đà Nẵng">Đà Nẵng</SelectItem>
                  <SelectItem value="Hải Phòng">Hải Phòng</SelectItem>
                  <SelectItem value="Bình Dương">Bình Dương</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="pt-4 border-t border-gray-700">
              <h4 className="text-white font-medium mb-3">Location Types</h4>
              <div className="space-y-2">
                {[
                  { type: 'port', label: 'Ports', icon: '🚢', color: 'blue' },
                  { type: 'depot', label: 'Depots', icon: '🏭', color: 'green' },
                  { type: 'warehouse', label: 'Warehouses', icon: '🏪', color: 'purple' },
                  { type: 'fuel_station', label: 'Fuel Stations', icon: '⛽', color: 'yellow' },
                  { type: 'customer', label: 'Customers', icon: '🏢', color: 'orange' }
                ].map(({ type, label, icon, color }) => {
                  const count = filteredLocations.filter((loc: any) => loc.type === type).length;
                  return (
                    <div key={type} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">{icon}</span>
                        <span className="text-gray-300 text-sm">{label}</span>
                      </div>
                      <Badge className={`bg-${color}-500/20 text-${color}-400 border-${color}-500/30`}>
                        {count}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Selected Points */}
        <Card className="bg-gray-800/80 backdrop-blur-xl border-gray-700/50">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Target className="h-5 w-5 mr-2 text-green-400" />
              Selected Points ({selectedPoints.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {selectedPoints.length === 0 ? (
                <p className="text-gray-400 text-sm text-center py-4">
                  No points selected yet
                </p>
              ) : (
                selectedPoints.map((point: any) => (
                  <div key={point.id} className="flex items-center justify-between bg-gray-700/50 rounded-lg p-3">
                    <div className="flex-1">
                      <p className="text-white text-sm font-medium">{point.name}</p>
                      <p className="text-gray-400 text-xs">{point.address}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge className="text-xs bg-blue-500/20 text-blue-400">
                          {point.type}
                        </Badge>
                        <Badge className="text-xs bg-purple-500/20 text-purple-400">
                          Priority: {point.priority}
                        </Badge>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removePoint(point.id)}
                      className="text-red-400 hover:text-red-300 hover:bg-red-500/20"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Locations List */}
      <div className="lg:col-span-2">
        <Card className="bg-gray-800/80 backdrop-blur-xl border-gray-700/50">
          <CardHeader>
            <CardTitle className="text-white flex items-center justify-between">
              <div className="flex items-center">
                <MapPin className="h-5 w-5 mr-2 text-blue-400" />
                Vietnam Logistics Locations ({filteredLocations.length})
              </div>
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                <Globe className="h-3 w-3 mr-1" />
                28+ Locations
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
              {filteredLocations.map((location: any) => {
                const isSelected = selectedPoints.some((p: any) => p.name === location.name);
                const typeIcons = {
                  port: '🚢',
                  depot: '🏭',
                  warehouse: '🏪',
                  fuel_station: '⛽',
                  customer: '🏢',
                  rest_area: '🛣️'
                };

                return (
                  <div key={location.id} className="bg-gray-700/50 rounded-xl p-4 hover:bg-gray-700/70 transition-all duration-300">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="text-2xl">{typeIcons[location.type as keyof typeof typeIcons]}</div>
                        <div>
                          <h4 className="text-white font-medium">{location.name}</h4>
                          <p className="text-gray-400 text-sm">{location.address}</p>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => addPointFromLocation(location)}
                        disabled={isSelected}
                        className={`${
                          isSelected 
                            ? 'bg-green-500/20 text-green-400 border-green-500/30' 
                            : 'bg-blue-500/20 text-blue-400 border-blue-500/30 hover:bg-blue-500/30'
                        }`}
                      >
                        {isSelected ? (
                          <CheckCircle className="h-4 w-4" />
                        ) : (
                          <Plus className="h-4 w-4" />
                        )}
                      </Button>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400 text-sm">Type:</span>
                        <Badge className="text-xs bg-blue-500/20 text-blue-400 capitalize">
                          {location.type.replace('_', ' ')}
                        </Badge>
                      </div>

                      {location.phone && (
                        <div className="flex items-center justify-between">
                          <span className="text-gray-400 text-sm">Phone:</span>
                          <span className="text-gray-300 text-sm">{location.phone}</span>
                        </div>
                      )}

                      {location.manager && (
                        <div className="flex items-center justify-between">
                          <span className="text-gray-400 text-sm">Manager:</span>
                          <span className="text-gray-300 text-sm">{location.manager}</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  </TabsContent>
);

// Fleet Management Tab
export const FleetManagementTab = ({ selectedVehicles, setSelectedVehicles, sampleVehicles }: any) => (
  <TabsContent value="vehicles" className="space-y-6">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="bg-gray-800/80 backdrop-blur-xl border-gray-700/50">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Truck className="h-5 w-5 mr-2 text-green-400" />
            Available Vehicles ({sampleVehicles.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sampleVehicles.map((vehicle: any) => {
              const isSelected = selectedVehicles.some((v: any) => v.id === vehicle.id);
              return (
                <div key={vehicle.id} className="bg-gray-700/50 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="text-white font-medium">{vehicle.name}</h4>
                      <p className="text-gray-400 text-sm">{vehicle.type}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={`text-xs ${
                        vehicle.status === 'Available' 
                          ? 'bg-green-500/20 text-green-400' 
                          : 'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {vehicle.status}
                      </Badge>
                      <Button
                        size="sm"
                        onClick={() => {
                          if (isSelected) {
                            setSelectedVehicles((prev: any) => prev.filter((v: any) => v.id !== vehicle.id));
                          } else {
                            setSelectedVehicles((prev: any) => [...prev, vehicle]);
                          }
                        }}
                        className={`${
                          isSelected 
                            ? 'bg-green-500/20 text-green-400' 
                            : 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30'
                        }`}
                      >
                        {isSelected ? <CheckCircle className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-400">Capacity</p>
                      <p className="text-white font-medium">{vehicle.capacity.weight.toLocaleString()} kg</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Volume</p>
                      <p className="text-white font-medium">{vehicle.capacity.volume} m³</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Cost/km</p>
                      <p className="text-green-400 font-medium">{vehicle.costs.perKm.toLocaleString()} VND</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Cost/hour</p>
                      <p className="text-blue-400 font-medium">{vehicle.costs.perHour.toLocaleString()} VND</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gray-800/80 backdrop-blur-xl border-gray-700/50">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Target className="h-5 w-5 mr-2 text-purple-400" />
            Selected Fleet ({selectedVehicles.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {selectedVehicles.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-8">
                No vehicles selected yet
              </p>
            ) : (
              selectedVehicles.map((vehicle: any) => (
                <div key={vehicle.id} className="bg-gray-700/50 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-white font-medium">{vehicle.name}</h4>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setSelectedVehicles((prev: any) => prev.filter((v: any) => v.id !== vehicle.id))}
                      className="text-red-400 hover:text-red-300 hover:bg-red-500/20"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-gray-400">Capacity: </span>
                      <span className="text-white">{vehicle.capacity.weight.toLocaleString()} kg</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Fixed Cost: </span>
                      <span className="text-green-400">{vehicle.costs.fixed.toLocaleString()} VND</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  </TabsContent>
);

// Analytics Tab
export const AnalyticsTab = ({ optimizationResult, selectedPoints, selectedVehicles }: any) => (
  <TabsContent value="analytics" className="space-y-6">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="bg-gray-800/80 backdrop-blur-xl border-gray-700/50">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <BarChart3 className="h-5 w-5 mr-2 text-blue-400" />
            Performance Metrics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-500/10 rounded-lg p-3 border border-blue-500/20">
                <p className="text-blue-400 text-sm">Total Locations</p>
                <p className="text-white text-2xl font-bold">{selectedPoints.length}</p>
              </div>
              <div className="bg-green-500/10 rounded-lg p-3 border border-green-500/20">
                <p className="text-green-400 text-sm">Active Vehicles</p>
                <p className="text-white text-2xl font-bold">{selectedVehicles.length}</p>
              </div>
            </div>

            {optimizationResult && (
              <div className="space-y-3">
                <div className="bg-purple-500/10 rounded-lg p-3 border border-purple-500/20">
                  <p className="text-purple-400 text-sm">Algorithm Used</p>
                  <p className="text-white font-medium capitalize">{optimizationResult.algorithm}</p>
                </div>
                <div className="bg-orange-500/10 rounded-lg p-3 border border-orange-500/20">
                  <p className="text-orange-400 text-sm">Routes Generated</p>
                  <p className="text-white font-medium">{optimizationResult.routes.length} routes</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gray-800/80 backdrop-blur-xl border-gray-700/50">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <TrendingUp className="h-5 w-5 mr-2 text-green-400" />
            Cost Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          {optimizationResult ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-3">
                <div className="bg-green-500/10 rounded-lg p-3 border border-green-500/20">
                  <div className="flex items-center justify-between">
                    <p className="text-green-400 text-sm">Total Cost</p>
                    <DollarSign className="h-5 w-5 text-green-400" />
                  </div>
                  <p className="text-white text-xl font-bold">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(optimizationResult.summary.totalCost)}
                  </p>
                </div>
                <div className="bg-blue-500/10 rounded-lg p-3 border border-blue-500/20">
                  <div className="flex items-center justify-between">
                    <p className="text-blue-400 text-sm">Total Distance</p>
                    <Navigation className="h-5 w-5 text-blue-400" />
                  </div>
                  <p className="text-white text-xl font-bold">{optimizationResult.summary.totalDistance.toFixed(1)} km</p>
                </div>
                <div className="bg-purple-500/10 rounded-lg p-3 border border-purple-500/20">
                  <div className="flex items-center justify-between">
                    <p className="text-purple-400 text-sm">Total Time</p>
                    <Clock className="h-5 w-5 text-purple-400" />
                  </div>
                  <p className="text-white text-xl font-bold">
                    {Math.floor(optimizationResult.summary.totalTime)}h {Math.floor((optimizationResult.summary.totalTime % 1) * 60)}m
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-700">
                <h4 className="text-white font-medium mb-3">Environmental Impact</h4>
                <div className="space-y-2">
                  {optimizationResult.routes.map((route: any, index: number) => (
                    <div key={route.vehicleId} className="bg-gray-700/30 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-white text-sm font-medium">{route.vehicleId}</span>
                        <Badge className="text-xs bg-blue-500/20 text-blue-400">
                          Route {index + 1}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-gray-400">CO₂: </span>
                          <span className="text-red-400">{route.environmental.co2Emissions.toFixed(1)} kg</span>
                        </div>
                        <div>
                          <span className="text-gray-400">Fuel: </span>
                          <span className="text-yellow-400">{route.environmental.fuelConsumption.toFixed(1)} L</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <AlertTriangle className="h-12 w-12 text-gray-500 mx-auto mb-4" />
              <p className="text-gray-400">Run optimization to see cost analysis</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  </TabsContent>
);
