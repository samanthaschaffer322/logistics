'use client';

import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers
delete (Icon.Default.prototype as any)._getIconUrl;
Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface LeafletMapProps {
  center: [number, number];
  zoom: number;
  locations: any[];
  routes: any[];
  selectedRoute: number;
  getLocationIcon: (location: any) => Icon;
  getRouteColor: (index: number) => string;
}

const LeafletMap: React.FC<LeafletMapProps> = ({
  center,
  zoom,
  locations,
  routes,
  selectedRoute,
  getLocationIcon,
  getRouteColor
}) => {
  return (
    <MapContainer
      center={center}
      zoom={zoom}
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      
      {/* Location markers */}
      {locations.map((location) => (
        <Marker
          key={location.id}
          position={[location.lat, location.lng]}
          icon={getLocationIcon(location)}
        >
          <Popup>
            <div className="p-2">
              <h3 className="font-semibold">{location.address}</h3>
              <p className="text-sm text-gray-600">Type: {location.type}</p>
              {location.timeWindow && (
                <p className="text-sm text-gray-600">
                  Hours: {location.timeWindow.start} - {location.timeWindow.end}
                </p>
              )}
              {location.containerType && (
                <p className="text-sm text-gray-600">Container: {location.containerType}</p>
              )}
            </div>
          </Popup>
        </Marker>
      ))}

      {/* Route lines */}
      {routes.map((route, routeIndex) => {
        const routePositions = route.locations.map((loc: any) => [loc.lat, loc.lng] as [number, number]);
        return (
          <Polyline
            key={`route-${routeIndex}`}
            positions={routePositions}
            color={getRouteColor(routeIndex)}
            weight={4}
            opacity={selectedRoute === routeIndex ? 1 : 0.6}
          />
        );
      })}
    </MapContainer>
  );
};

export default LeafletMap;
