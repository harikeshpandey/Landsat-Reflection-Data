import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Copy, CheckCircle } from 'lucide-react';

// Fix the default marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

function LocationMarker() {
  const [position, setPosition] = useState(null);
  const [copiedLat, setCopiedLat] = useState(false);
  const [copiedLng, setCopiedLng] = useState(false);

  const map = useMapEvents({
    click(e) {
      setPosition(e.latlng);
      setCopiedLat(false);
      setCopiedLng(false);
    }
  });

  const copyLatitude = () => {
    if (position) {
      navigator.clipboard.writeText(position.lat.toFixed(6));
      setCopiedLat(true);
      setTimeout(() => setCopiedLat(false), 2000);
    }
  };

  const copyLongitude = () => {
    if (position) {
      navigator.clipboard.writeText(position.lng.toFixed(6));
      setCopiedLng(true);
      setTimeout(() => setCopiedLng(false), 2000);
    }
  };

  return position === null ? null : (
    <Marker position={position}>
      <Popup>
        <div className="text-center">
          <div className="mb-2">
            <div><strong>Latitude:</strong> {position.lat.toFixed(6)}</div>
            <button 
              onClick={copyLatitude}
              className="w-full flex items-center justify-center bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 mb-2"
            >
              {copiedLat ? (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Copied Latitude!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Latitude
                </>
              )}
            </button>
            <div><strong>Longitude:</strong> {position.lng.toFixed(6)}</div>
            <button 
              onClick={copyLongitude}
              className="w-full flex items-center justify-center bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              {copiedLng ? (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Copied Longitude!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Longitude
                </>
              )}
            </button>
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
        Click anywhere on the map to get coordinates. Click the marker to copy them.
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
