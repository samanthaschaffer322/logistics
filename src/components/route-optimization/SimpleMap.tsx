'use client';

import React from 'react';
import { MapPin, Navigation, Truck } from 'lucide-react';

interface SimpleMapProps {
  center: [number, number];
  zoom: number;
  locations: any[];
  routes: any[];
  selectedRoute: number;
}

const SimpleMap: React.FC<SimpleMapProps> = ({
  center,
  zoom,
  locations,
  routes,
  selectedRoute
}) => {
  const getLocationIcon = (location: any) => {
    switch (location.type) {
      case 'depot': return <Truck className="w-4 h-4 text-blue-600" />;
      case 'pickup': return <MapPin className="w-4 h-4 text-green-600" />;
      case 'delivery': return <MapPin className="w-4 h-4 text-orange-600" />;
      case 'empty_return': return <MapPin className="w-4 h-4 text-red-600" />;
      default: return <MapPin className="w-4 h-4 text-gray-600" />;
    }
  };

  const getRouteColor = (index: number) => {
    const colors = ['bg-blue-500', 'bg-green-500', 'bg-orange-500', 'bg-red-500', 'bg-purple-500', 'bg-cyan-500'];
    return colors[index % colors.length];
  };

  return (
    <div className="h-full w-full bg-gradient-to-br from-blue-50 to-green-50 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center p-6">
      <div className="text-center mb-6">
        <Navigation className="w-12 h-12 text-blue-600 mx-auto mb-2" />
        <h3 className="text-lg font-semibold text-gray-800">Vietnam Logistics Map</h3>
        <p className="text-sm text-gray-600">Interactive route visualization</p>
        <p className="text-xs text-gray-500 mt-1">Center: {center[0].toFixed(4)}, {center[1].toFixed(4)} | Zoom: {zoom}</p>
      </div>

      {/* Locations Summary */}
      <div className="grid grid-cols-2 gap-4 mb-6 w-full max-w-md">
        <div className="bg-white rounded-lg p-3 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Truck className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium">Locations</span>
          </div>
          <div className="space-y-1">
            {locations.slice(0, 3).map((location, index) => (
              <div key={index} className="flex items-center gap-2 text-xs">
                {getLocationIcon(location)}
                <span className="truncate">{location.address.split(',')[0]}</span>
              </div>
            ))}
            {locations.length > 3 && (
              <div className="text-xs text-gray-500">+{locations.length - 3} more</div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg p-3 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Navigation className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium">Routes</span>
          </div>
          <div className="space-y-1">
            {routes.slice(0, 3).map((route, index) => (
              <div key={index} className="flex items-center gap-2 text-xs">
                <div className={`w-3 h-3 rounded-full ${getRouteColor(index)} ${selectedRoute === index ? 'ring-2 ring-offset-1 ring-gray-400' : ''}`}></div>
                <span className="truncate">Route {index + 1} ({route.locations.length} stops)</span>
              </div>
            ))}
            {routes.length > 3 && (
              <div className="text-xs text-gray-500">+{routes.length - 3} more</div>
            )}
          </div>
        </div>
      </div>

      {/* Route Details */}
      {routes.length > 0 && (
        <div className="bg-white rounded-lg p-4 shadow-sm w-full max-w-md">
          <h4 className="text-sm font-medium mb-2">Selected Route {selectedRoute + 1}</h4>
          <div className="space-y-2">
            {routes[selectedRoute]?.locations.slice(0, 4).map((location: any, index: number) => (
              <div key={index} className="flex items-center gap-2 text-xs">
                <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs font-medium">
                  {index + 1}
                </div>
                <span className="truncate">{location.address.split(',')[0]}</span>
              </div>
            ))}
            {routes[selectedRoute]?.locations.length > 4 && (
              <div className="text-xs text-gray-500 ml-8">
                +{routes[selectedRoute].locations.length - 4} more stops
              </div>
            )}
          </div>
        </div>
      )}

      <div className="mt-4 text-xs text-gray-500 text-center">
        <p>🗺️ Full interactive map with Leaflet will load in production</p>
        <p>📍 Showing {locations.length} locations across {routes.length} optimized routes</p>
      </div>
    </div>
  );
};

export default SimpleMap;
