import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in React-Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Component to auto-center map when location updates
const RecenterMap = ({ position }) => {
    const map = useMap();
    useEffect(() => {
        if (position) {
            map.setView(position);
        }
    }, [position, map]);
    return null;
};

const TrackingMap = ({ currentPosition, routeHistory }) => {
    const [mapType, setMapType] = useState('street'); // 'street' or 'satellite'

    // Custom TILE LAYERS for Google Maps aesthetic
    const tiles = {
        street: "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
        satellite: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
    };

    const center = currentPosition ? [currentPosition.latitude, currentPosition.longitude] : [0, 0];
    const polylinePath = routeHistory.map(p => [p.latitude, p.longitude]);

    return (
        <div className="tracking-map-container" style={{ position: 'relative' }}>
            <div className="map-layer-selector" style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                zIndex: 1000,
                display: 'flex',
                gap: '5px'
            }}>
                <button
                    onClick={() => setMapType('street')}
                    className={`layer-btn ${mapType === 'street' ? 'active' : ''}`}
                >
                    Street
                </button>
                <button
                    onClick={() => setMapType('satellite')}
                    className={`layer-btn ${mapType === 'satellite' ? 'active' : ''}`}
                >
                    Satellite
                </button>
            </div>

            <MapContainer
                center={center}
                zoom={16}
                style={{ height: '300px', width: '100%', borderRadius: '12px' }}
                zoomControl={false}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url={tiles[mapType]}
                />

                {/* Draw the tracked route */}
                <Polyline
                    positions={polylinePath}
                    color="#3b82f6"
                    weight={5}
                    opacity={0.8}
                />

                {/* Current Location Marker */}
                {currentPosition && (
                    <Marker position={center} />
                )}

                <RecenterMap position={center} />
            </MapContainer>

            <style>{`
        .tracking-map-container {
          margin: 15px 0;
          overflow: hidden;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }
        .map-layer-selector button {
          padding: 6px 12px;
          font-size: 12px;
          font-weight: 600;
          border-radius: 6px;
          border: 1px solid #cbd5e1;
          background: white;
          color: #475569;
          cursor: pointer;
          transition: all 0.2s;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .map-layer-selector button.active {
          background: #1e293b;
          color: white;
          border-color: #1e293b;
        }
      `}</style>
        </div>
    );
};

export default TrackingMap;
