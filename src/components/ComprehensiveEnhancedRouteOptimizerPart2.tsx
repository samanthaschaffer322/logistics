// Part 2: Vietnam Locations Tab for ComprehensiveEnhancedRouteOptimizer

const LocationsTabContent = ({ 
  state, 
  setState, 
  selectedProvince, 
  setSelectedProvince, 
  searchQuery, 
  setSearchQuery, 
  addPointFromLocation, 
  removePoint 
}: any) => {
  const provinces = vietnamAdminService.getAllProvinces();
  const filteredLocations = vietnamLogisticsLocations.filter(location => {
    const matchesSearch = location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         location.address.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesProvince = !selectedProvince || location.address.includes(selectedProvince);
    return matchesSearch && matchesProvince;
  });

  return (
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
                    {provinces.map(province => (
                      <SelectItem key={province.code} value={province.name}>
                        {province.name_with_type}
                      </SelectItem>
                    ))}
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
                    const count = vietnamLogisticsLocations.filter(loc => loc.type === type).length;
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
                Selected Points ({state.points.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {state.points.length === 0 ? (
                  <p className="text-gray-400 text-sm text-center py-4">
                    No points selected yet
                  </p>
                ) : (
                  state.points.map((point: OptimizationPoint) => (
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
                {filteredLocations.map(location => {
                  const isSelected = state.points.some((p: OptimizationPoint) => p.name === location.name);
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
                          onClick={() => addPointFromLocation(location.id)}
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

                        {location.contact?.phone && (
                          <div className="flex items-center justify-between">
                            <span className="text-gray-400 text-sm">Phone:</span>
                            <span className="text-gray-300 text-sm">{location.contact.phone}</span>
                          </div>
                        )}

                        {location.contact?.manager && (
                          <div className="flex items-center justify-between">
                            <span className="text-gray-400 text-sm">Manager:</span>
                            <span className="text-gray-300 text-sm">{location.contact.manager}</span>
                          </div>
                        )}

                        {location.operatingHours && (
                          <div className="flex items-center justify-between">
                            <span className="text-gray-400 text-sm">Hours:</span>
                            <span className="text-gray-300 text-sm">
                              {location.operatingHours.open} - {location.operatingHours.close}
                            </span>
                          </div>
                        )}

                        {location.services && location.services.length > 0 && (
                          <div className="mt-3">
                            <p className="text-gray-400 text-sm mb-2">Services:</p>
                            <div className="flex flex-wrap gap-1">
                              {location.services.slice(0, 3).map((service, index) => (
                                <Badge key={index} className="text-xs bg-purple-500/20 text-purple-400">
                                  {service}
                                </Badge>
                              ))}
                              {location.services.length > 3 && (
                                <Badge className="text-xs bg-gray-500/20 text-gray-400">
                                  +{location.services.length - 3} more
                                </Badge>
                              )}
                            </div>
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
};

export default LocationsTabContent;
