'use client';

import React, { useCallback } from 'react';
import { MapContainer, GeoJSON, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import { LatLngExpression } from 'leaflet';
import { useLanguage } from '@/contexts/LanguageContext';

// Import the GeoJSON data (assuming it's in public and accessible)
import vietnamGeoJson from '../../../public/vietnam.json'; 

interface VietnamMapProps {
  center?: LatLngExpression;
  zoom?: number;
  onMapClick?: (latlng: { lat: number; lng: number }) => void;
  selectedLocation?: { lat: number; lng: number; name?: string };
  locations?: MapLocation[]; // Add locations prop
}

interface MapLocation {
  id: string;
  name: string;
  lat: number;
  lng: number;
  type?: string; // Optional, as VietnamMap might not need it
  status?: string; // Optional
}

const VietnamMap: React.FC<VietnamMapProps> = ({
  center = [16.047079, 108.20623], // Default center of Vietnam
  zoom = 6,
  onMapClick,
  selectedLocation,
}) => {
  const { t } = useLanguage();

  const onEachFeatureHandler = useCallback((feature: any, layer: any) => {
    // You can add interactive features here, e.g., tooltips or popups
    // based on feature properties.
    if (feature.properties && feature.properties.name) {
      layer.bindPopup(feature.properties.name);
    }
  }, []);

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      scrollWheelZoom={true} // Enable scroll wheel zoom
      doubleClickZoom={true} // Enable double click zoom
      dragging={true} // Enable dragging
      zoomControl={true} // Enable zoom control buttons
      style={{ height: '100%', width: '100%' }} // Use 100% height/width for responsiveness
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <GeoJSON
        data={vietnamGeoJson as any} // Cast to any for now, as GeoJSON type might be complex
        style={{
          color: '#ebdfe6',
          weight: 1,
          fillColor: '#CBA7BD',
          fillOpacity: 0.7, // Slightly transparent fill
        }}
        onEachFeature={onEachFeatureHandler}
      />

      {locations && locations.map(loc => (
        <Marker key={loc.id} position={[loc.lat, loc.lng]}>
          <Popup>
            {loc.name}
          </Popup>
        </Marker>
      ))}

      {selectedLocation && (
        <Marker position={[selectedLocation.lat, selectedLocation.lng]}>
          <Popup>
            {selectedLocation.name || t('map.selectedLocation')}
          </Popup>
        </Marker>
      )}

      {/* Add a click handler for the map */}
      {onMapClick && (
        <MapClickHandler onMapClick={onMapClick} />
      )}
    </MapContainer>
  );
};

// Helper component to handle map clicks
const MapClickHandler: React.FC<{ onMapClick: (latlng: { lat: number; lng: number }) => void }> = ({ onMapClick }) => {
  const map = useMapEvents({
    click: (e) => {
      onMapClick({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });
  return null;
};

export default VietnamMap;
