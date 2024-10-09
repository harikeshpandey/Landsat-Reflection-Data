import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { CheckCircle } from 'lucide-react';
import 'leaflet-control-geocoder/dist/Control.Geocoder.css';
import 'leaflet-control-geocoder';

// Fix the default marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

// Marker component to display the current location
function LocationMarker({ position }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (position) {
      const coordinates = `${position.lat.toFixed(6)}, ${position.lng.toFixed(6)}`;
      navigator.clipboard.writeText(coordinates).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  }, [position]);

  return position === null ? null : (
    <Marker position={position}>
      <Popup>
        <div className="text-center">
          <div><strong>Coordinates copied!</strong></div>
          <div>Latitude: {position.lat.toFixed(6)}</div>
          <div>Longitude: {position.lng.toFixed(6)}</div>
          {copied && (
            <span className="flex items-center justify-center text-green-600">
              <CheckCircle className="w-4 h-4 mr-1" />
              Copied to clipboard!
            </span>
          )}
        </div>
      </Popup>
    </Marker>
  );
}

// Search control component for geocoding
const SearchControl = ({ setMarkerPosition }) => {
  const map = useMap(); // Use the correct hook

  useEffect(() => {
    const geocoder = L.Control.geocoder({
      position: 'topright', // Changed to top right
      defaultMarkGeocode: false,
    })
      .on('markgeocode', function (e) {
        const bbox = e.geocode.bbox;
        const poly = L.polygon([
          bbox.getSouthEast(),
          bbox.getNorthEast(),
          bbox.getNorthWest(),
          bbox.getSouthWest(),
        ]);
        map.fitBounds(poly.getBounds());

        // Update marker position based on search result
        setMarkerPosition(e.geocode.center);
      })
      .addTo(map);

    // Cleanup geocoder control on unmount
    return () => {
      map.removeControl(geocoder);
    };
  }, [map, setMarkerPosition]);

  return null;
};

// Map events component to manage marker position updates
const MapEvents = ({ setMarkerPosition }) => {
  useMapEvents({
    click(e) {
      setMarkerPosition(e.latlng); // Update marker position on map click
    },
  });

  return null;
};

export default function MapView() {
  const [markerPosition, setMarkerPosition] = useState(null);

  return (
    <div className="border rounded-lg p-4 shadow-sm h-full w-full">
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
          {/* Adding the Search Control and Map Events Components */}
          <SearchControl setMarkerPosition={setMarkerPosition} />
          <MapEvents setMarkerPosition={setMarkerPosition} />
          <LocationMarker position={markerPosition} />
        </MapContainer>
      </div>
    </div>
  );
}
