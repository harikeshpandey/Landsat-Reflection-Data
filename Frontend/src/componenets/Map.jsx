import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { CheckCircle, Search } from 'lucide-react'; // Import Search icon from lucide-react

// Fix the default marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

function LocationMarker({ position }) {
  return position === null ? null : (
    <Marker position={position}>
      <Popup>
        <div className="text-center">
          <div className="mb-2">
            <div><strong>Coordinates:</strong></div>
            <div>Latitude: {position.lat.toFixed(6)}</div>
            <div>Longitude: {position.lng.toFixed(6)}</div>
          </div>
        </div>
      </Popup>
    </Marker>
  );
}

// Custom Search Box Component with Real-Time Suggestions
function SearchBox({ setPosition }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const map = useMap();

  // Fetch suggestions from a geocoding API
  const fetchSuggestions = async (query) => {
    if (!query) return setSuggestions([]);
    
    const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${query}`);
    const data = await response.json();
    setSuggestions(data);
  };

  useEffect(() => {
    if (searchQuery) {
      fetchSuggestions(searchQuery);
    } else {
      setSuggestions([]);
    }
  }, [searchQuery]);

  // Handle suggestion click
  const handleSuggestionClick = (lat, lon) => {
    const newPosition = { lat: parseFloat(lat), lng: parseFloat(lon) };

    setPosition(newPosition);
    map.setView(newPosition, 14);
    setSuggestions([]);
    setSearchQuery('');
  };

  return (
    <div style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 1000 }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Search style={{ marginRight: '8px' }} /> {/* Search icon */}
        <input
          type="text"
          placeholder="Search for a location..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ padding: '8px', width: '250px', borderRadius: '4px', border: '1px solid #ccc' }}
        />
      </div>
      {/* Suggestions Dropdown */}
      {suggestions.length > 0 && (
        <ul style={{ listStyleType: 'none', padding: 0, margin: '5px 0', backgroundColor: 'white', border: '1px solid #ccc', width: '250px', maxHeight: '150px', overflowY: 'auto' }}>
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              onClick={() => handleSuggestionClick(suggestion.lat, suggestion.lon)}
              style={{
                padding: '8px',
                cursor: 'pointer',
                borderBottom: '1px solid #eee',
              }}
            >
              {suggestion.display_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function MapView() {
  const [position, setPosition] = useState(null);

  return (
    <div className="border rounded-lg p-4 shadow-sm">
      <div className="mb-4 text-sm text-gray-600">
        Click anywhere on the map to get coordinates. You can also search for locations in real-time.
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
          {/* Adding the Search Box Component */}
          <SearchBox setPosition={setPosition} />
          <LocationMarker position={position} />
        </MapContainer>
      </div>
    </div>
  );
}
