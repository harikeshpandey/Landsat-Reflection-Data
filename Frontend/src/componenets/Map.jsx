import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { CheckCircle } from 'lucide-react';

// Fix the default marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

function LocationMarker() {
  const [position, setPosition] = useState(null);
  const [copied, setCopied] = useState(false);

  const map = useMapEvents({
    click(e) {
      setPosition(e.latlng);
      setCopied(false);
      
      // Automatically copy coordinates to clipboard
      const coordinates = `${e.latlng.lat.toFixed(6)}, ${e.latlng.lng.toFixed(6)}`;
      navigator.clipboard.writeText(coordinates).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  });

  return position === null ? null : (
    <Marker position={position}>
      <Popup>
        <div className="text-center">
          <div className="mb-2">
            <div><strong>Coordinates copied!</strong></div>
            <div>Latitude: {position.lat.toFixed(6)}</div>
            <div>Longitude: {position.lng.toFixed(6)}</div>
            <div className="mt-2">
              {copied && (
                <span className="flex items-center justify-center text-green-600">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Copied to clipboard!
                </span>
              )}
            </div>
          </div>
        </div>
      </Popup>
    </Marker>
  );
}

export default function MapView() {
  return (
    <div className="border rounded-lg p-4 shadow-sm">
      <div className="mb-4 text-sm text-gray-600">
        Click anywhere on the map to get coordinates. They will be automatically copied to your clipboard.
      </div>
      <div style={{ height: '500px', width: '100%' }}>
        <MapContainer 
          center={[29.0229039, 79.4942425]} 
          zoom={16}  
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <LocationMarker />
        </MapContainer>
      </div>
    </div>
  );
}