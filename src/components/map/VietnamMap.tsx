'use client';

import React, { useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import { LatLngExpression, Icon } from 'leaflet';
import L from 'leaflet';

// Fix Leaflet default markers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface MapLocation {
  id: string;
  name: string;
  lat: number;
  lng: number;
  type?: 'depot' | 'destination' | 'waypoint' | 'truck' | 'port' | 'warehouse';
  province?: string;
}

interface VietnamMapProps {
  center?: LatLngExpression;
  zoom?: number;
  onMapClick?: (latlng: { lat: number; lng: number }) => void;
  selectedLocation?: { lat: number; lng: number; name?: string };
  locations?: MapLocation[];
  className?: string;
}

// Custom icons for different location types
const createCustomIcon = (type: string, color: string) => new Icon({
  iconUrl: `data:image/svg+xml;base64,${btoa(`
    <svg width="25" height="41" viewBox="0 0 25 41" xmlns="http://www.w3.org/2000/svg">
      <path fill="${color}" stroke="#fff" stroke-width="2" d="M12.5 0C5.6 0 0 5.6 0 12.5c0 12.5 12.5 28.5 12.5 28.5s12.5-16 12.5-28.5C25 5.6 19.4 0 12.5 0z"/>
      <circle fill="#fff" cx="12.5" cy="12.5" r="6"/>
      <text x="12.5" y="17" text-anchor="middle" font-size="8" fill="${color}">
        ${type === 'depot' ? 'D' : type === 'truck' ? 'T' : type === 'port' ? 'P' : 'W'}
      </text>
    </svg>
  `)}`,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const LOCATION_ICONS = {
  depot: createCustomIcon('depot', '#3B82F6'),
  destination: createCustomIcon('destination', '#10B981'),
  waypoint: createCustomIcon('waypoint', '#F59E0B'),
  truck: createCustomIcon('truck', '#EF4444'),
  port: createCustomIcon('port', '#8B5CF6'),
  warehouse: createCustomIcon('warehouse', '#6B7280')
};

// Map event handler component
const MapEventHandler: React.FC<{
  onMapClick?: (latlng: { lat: number; lng: number }) => void;
}> = ({ onMapClick }) => {
  useMapEvents({
    click: (e) => {
      if (onMapClick) {
        onMapClick({ lat: e.latlng.lat, lng: e.latlng.lng });
      }
    }
  });
  return null;
};

const VietnamMap: React.FC<VietnamMapProps> = ({
  center = [16.047079, 108.20623], // Default center of Vietnam
  zoom = 6,
  onMapClick,
  selectedLocation,
  locations = [],
  className = ''
}) => {
  return (
    <div className={`vietnam-map ${className}`}>
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={true}
        doubleClickZoom={true}
        dragging={true}
        className="h-full w-full min-h-[500px] rounded-lg"
        style={{ height: '500px', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        <MapEventHandler onMapClick={onMapClick} />

        {/* Render location markers */}
        {locations.map((location) => (
          <Marker
            key={location.id}
            position={[location.lat, location.lng]}
            icon={LOCATION_ICONS[location.type || 'destination']}
          >
            <Popup>
              <div className="p-2">
                <div className="font-medium">{location.name}</div>
                {location.province && (
                  <div className="text-sm text-gray-600">{location.province}</div>
                )}
                <div className="text-xs text-gray-500 mt-1">
                  {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
                </div>
                {location.type && (
                  <div className="mt-1">
                    <span className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                      {location.type}
                    </span>
                  </div>
                )}
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Selected location marker */}
        {selectedLocation && (
          <Marker
            position={[selectedLocation.lat, selectedLocation.lng]}
            icon={LOCATION_ICONS.destination}
          >
            <Popup>
              <div className="p-2">
                <div className="font-medium">
                  {selectedLocation.name || 'Selected Location'}
                </div>
                <div className="text-xs text-gray-500">
                  {selectedLocation.lat.toFixed(4)}, {selectedLocation.lng.toFixed(4)}
                </div>
              </div>
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
};

export default VietnamMap;
