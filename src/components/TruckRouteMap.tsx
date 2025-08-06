'use client'

import React, { useEffect, useRef, useState } from 'react';
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import OSM from 'ol/source/OSM';
import { Feature } from 'ol';
import { Point, LineString, Polygon } from 'ol/geom';
import { Style, Fill, Stroke, Circle, Icon, Text } from 'ol/style';
import { fromLonLat, toLonLat } from 'ol/proj';
import { defaults as defaultControls, ScaleLine } from 'ol/control';
import { RoutePoint, RouteResponse, VIETNAM_ROAD_RESTRICTIONS } from '@/lib/truckRoutingEngine';

interface TruckRouteMapProps {
  origin?: RoutePoint;
  destination?: RoutePoint;
  route?: RouteResponse;
  onMapClick?: (coordinates: [number, number]) => void;
  showRestrictions?: boolean;
  showDepots?: boolean;
  className?: string;
}

const TruckRouteMap: React.FC<TruckRouteMapProps> = ({
  origin,
  destination,
  route,
  onMapClick,
  showRestrictions = true,
  showDepots = true,
  className = "w-full h-96"
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<Map | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Vietnam depot locations
  const vietnamDepots = [
    { lat: 10.8505, lng: 106.7717, name: 'HCMC Central Depot', type: 'main' },
    { lat: 21.0285, lng: 105.8542, name: 'Hanoi Central Depot', type: 'main' },
    { lat: 16.0544, lng: 108.2022, name: 'Da Nang Depot', type: 'regional' },
    { lat: 10.7378, lng: 106.7230, name: 'Tan Thuan Industrial Depot', type: 'industrial' },
    { lat: 10.8833, lng: 106.5917, name: 'Hoc Mon Wholesale Depot', type: 'wholesale' }
  ];

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Initialize map
    const map = new Map({
      target: mapRef.current,
      layers: [
        // Base layer - OpenStreetMap
        new TileLayer({
          source: new OSM({
            url: 'https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png'
          })
        })
      ],
      view: new View({
        center: fromLonLat([106.6297, 10.8231]), // Center on Vietnam
        zoom: 6,
        minZoom: 5,
        maxZoom: 18
      }),
      controls: defaultControls().extend([
        new ScaleLine({
          units: 'metric'
        })
      ])
    });

    mapInstanceRef.current = map;

    // Add click handler
    if (onMapClick) {
      map.on('click', (event) => {
        const coordinates = toLonLat(event.coordinate);
        onMapClick([coordinates[0], coordinates[1]]);
      });
    }

    setIsLoaded(true);

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.setTarget(undefined);
        mapInstanceRef.current = null;
      }
    };
  }, [onMapClick]);

  // Add restriction zones layer
  useEffect(() => {
    if (!mapInstanceRef.current || !isLoaded || !showRestrictions) return;

    const restrictionSource = new VectorSource();
    
    // Add restriction zones
    Object.values(VIETNAM_ROAD_RESTRICTIONS.cities).forEach(city => {
      city.restricted_zones.forEach(zone => {
        const polygon = new Polygon([zone.polygon.map(coord => fromLonLat([coord[0], coord[1]]))]);
        const feature = new Feature({
          geometry: polygon,
          name: zone.name,
          restriction: zone.restriction_type
        });

        feature.setStyle(new Style({
          fill: new Fill({
            color: 'rgba(255, 0, 0, 0.2)'
          }),
          stroke: new Stroke({
            color: '#ff0000',
            width: 2,
            lineDash: [5, 5]
          }),
          text: new Text({
            text: zone.name,
            font: '12px Arial',
            fill: new Fill({ color: '#ff0000' }),
            stroke: new Stroke({ color: '#ffffff', width: 2 })
          })
        }));

        restrictionSource.addFeature(feature);
      });
    });

    const restrictionLayer = new VectorLayer({
      source: restrictionSource,
      zIndex: 1
    });

    mapInstanceRef.current.addLayer(restrictionLayer);

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.removeLayer(restrictionLayer);
      }
    };
  }, [isLoaded, showRestrictions]);

  // Add depot markers layer
  useEffect(() => {
    if (!mapInstanceRef.current || !isLoaded || !showDepots) return;

    const depotSource = new VectorSource();

    vietnamDepots.forEach(depot => {
      const point = new Point(fromLonLat([depot.lng, depot.lat]));
      const feature = new Feature({
        geometry: point,
        name: depot.name,
        type: depot.type
      });

      const color = depot.type === 'main' ? '#0066cc' : 
                   depot.type === 'regional' ? '#00cc66' : 
                   depot.type === 'industrial' ? '#cc6600' : '#cc0066';

      feature.setStyle(new Style({
        image: new Circle({
          radius: 8,
          fill: new Fill({ color }),
          stroke: new Stroke({ color: '#ffffff', width: 2 })
        }),
        text: new Text({
          text: depot.name,
          font: '11px Arial',
          offsetY: -20,
          fill: new Fill({ color: '#000000' }),
          stroke: new Stroke({ color: '#ffffff', width: 2 })
        })
      }));

      depotSource.addFeature(feature);
    });

    const depotLayer = new VectorLayer({
      source: depotSource,
      zIndex: 3
    });

    mapInstanceRef.current.addLayer(depotLayer);

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.removeLayer(depotLayer);
      }
    };
  }, [isLoaded, showDepots]);

  // Add origin and destination markers
  useEffect(() => {
    if (!mapInstanceRef.current || !isLoaded || (!origin && !destination)) return;

    const markerSource = new VectorSource();

    if (origin) {
      const originPoint = new Point(fromLonLat([origin.lng, origin.lat]));
      const originFeature = new Feature({
        geometry: originPoint,
        name: origin.name,
        type: 'origin'
      });

      originFeature.setStyle(new Style({
        image: new Circle({
          radius: 10,
          fill: new Fill({ color: '#00ff00' }),
          stroke: new Stroke({ color: '#ffffff', width: 3 })
        }),
        text: new Text({
          text: 'START',
          font: 'bold 12px Arial',
          offsetY: -25,
          fill: new Fill({ color: '#00ff00' }),
          stroke: new Stroke({ color: '#ffffff', width: 2 })
        })
      }));

      markerSource.addFeature(originFeature);
    }

    if (destination) {
      const destPoint = new Point(fromLonLat([destination.lng, destination.lat]));
      const destFeature = new Feature({
        geometry: destPoint,
        name: destination.name,
        type: 'destination'
      });

      destFeature.setStyle(new Style({
        image: new Circle({
          radius: 10,
          fill: new Fill({ color: '#ff0000' }),
          stroke: new Stroke({ color: '#ffffff', width: 3 })
        }),
        text: new Text({
          text: 'END',
          font: 'bold 12px Arial',
          offsetY: -25,
          fill: new Fill({ color: '#ff0000' }),
          stroke: new Stroke({ color: '#ffffff', width: 2 })
        })
      }));

      markerSource.addFeature(destFeature);
    }

    const markerLayer = new VectorLayer({
      source: markerSource,
      zIndex: 4
    });

    mapInstanceRef.current.addLayer(markerLayer);

    // Fit view to markers
    if (origin && destination) {
      const extent = markerSource.getExtent();
      mapInstanceRef.current.getView().fit(extent, {
        padding: [50, 50, 50, 50],
        maxZoom: 12
      });
    } else if (origin || destination) {
      const point = origin || destination!;
      mapInstanceRef.current.getView().setCenter(fromLonLat([point.lng, point.lat]));
      mapInstanceRef.current.getView().setZoom(10);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.removeLayer(markerLayer);
      }
    };
  }, [isLoaded, origin, destination]);

  // Add route layer
  useEffect(() => {
    if (!mapInstanceRef.current || !isLoaded || !route) return;

    const routeSource = new VectorSource();

    // Add route line
    const routeLine = new LineString(
      route.route.coordinates.map(coord => fromLonLat([coord[0], coord[1]]))
    );
    const routeFeature = new Feature({
      geometry: routeLine,
      type: 'route'
    });

    // Style based on restrictions
    const hasViolations = route.restrictions.violations.some(v => v.severity === 'error');
    const routeColor = hasViolations ? '#ff6600' : '#0066ff';

    routeFeature.setStyle(new Style({
      stroke: new Stroke({
        color: routeColor,
        width: 4,
        lineDash: hasViolations ? [10, 5] : undefined
      })
    }));

    routeSource.addFeature(routeFeature);

    // Add instruction points
    route.route.instructions.forEach((instruction, index) => {
      const point = new Point(fromLonLat([instruction.coordinates[0], instruction.coordinates[1]]));
      const feature = new Feature({
        geometry: point,
        instruction: instruction.instruction,
        index: index + 1
      });

      feature.setStyle(new Style({
        image: new Circle({
          radius: 6,
          fill: new Fill({ color: '#ffffff' }),
          stroke: new Stroke({ color: routeColor, width: 2 })
        }),
        text: new Text({
          text: (index + 1).toString(),
          font: 'bold 10px Arial',
          fill: new Fill({ color: routeColor })
        })
      }));

      routeSource.addFeature(feature);
    });

    const routeLayer = new VectorLayer({
      source: routeSource,
      zIndex: 2
    });

    mapInstanceRef.current.addLayer(routeLayer);

    // Fit view to route
    const extent = routeSource.getExtent();
    mapInstanceRef.current.getView().fit(extent, {
      padding: [50, 50, 50, 50],
      maxZoom: 14
    });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.removeLayer(routeLayer);
      }
    };
  }, [isLoaded, route]);

  return (
    <div className={className}>
      <div ref={mapRef} className="w-full h-full rounded-lg border border-gray-300" />
      
      {/* Map Legend */}
      <div className="absolute top-2 right-2 bg-white p-3 rounded-lg shadow-lg text-xs">
        <div className="font-semibold mb-2">Map Legend</div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>Origin</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span>Destination</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span>Main Depot</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-1 bg-red-500 opacity-50"></div>
            <span>Restricted Zone</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-1 bg-blue-500"></div>
            <span>Optimized Route</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TruckRouteMap;
