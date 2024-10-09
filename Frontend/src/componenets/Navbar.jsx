import React, { useState } from 'react';
import { Menu, Eye, BarChart2, Trash , Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Navbar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('visualize');
  const [visualizeCoords, setVisualizeCoords] = useState([]);
  const [compareCoords, setCompareCoords] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [newLat, setNewLat] = useState('');
  const [newLng, setNewLng] = useState('');
  const [compareData , setCompareData] = useState(null);
  const [visualizedData, setVisualizedData] = useState(null);
  const [selectedLayer, setSelectedLayer] = useState('NDVI');
  
  // const [satellitePasses , setSatellitePasses] = useState({});

  const [satelliteData , setSatelliteData] = useState({});

  const navigate = useNavigate();

  const layerOptions = [
    { value: 'NDVI', label: 'NDVI (Normalized Difference Vegetation Index)' },
    { value: 'FALSE-COLOR', label: 'False Color Vegetation' },
    { value: 'TRUE-COLOR-S2L2A', label: 'True Color S2L2A' },
    { value: 'MOISTURE-INDEX', label: 'Moisture Index' },
    {value : 'BATHYMETRIC' , label : 'Bathymetric'},
    { value : 'AGRICULTURE' , label : 'Agriculture'},
    { value : 'GEOLOGY' , label : 'GEOLOGY'},
    { value : 'FALSE-COLOR-URBAN' , label : 'False Color Urban'},
    { value : 'NATURAL-COLOR' , label : 'Natural Color (True Color)'},
    { value : 'TEMPERATURE' , label : 'Temperature Burn Out Index'}
  ];

  const fetchSatellitePasses = async (lat, lng) => {
    try {
      const url = 'http://localhost:3456/api/v1/user/n2yo';
      console.log('Fetching satellite passes from:', url);
  
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ lat, lng })
      });
  
      const data = await response.json();
  
      console.log('Satellite API response:', data);
  
      if (data.error) {
        console.error('API Error:', data.error);
        return null;
      }
  
      return data;
    } catch (error) {
      console.error('Error fetching satellite passes:', error);
      return [];
    }
  };
  
  const handleLoginClick = () => {
    navigate('/login');
  };
  
  const handleNotiClick =() =>{
    navigate('/notification')
  }
  const getRandomFutureTimestamp = () => {
    const now = Date.now(); // Current time in milliseconds
    const daysToAdd = Math.floor(Math.random() * (16 - 2 + 1)) + 2; // Random days between 2 and 16
    const futureDate = new Date(now + daysToAdd * 24 * 60 * 60 * 1000); // Convert days to milliseconds
    return Math.floor(futureDate.getTime() / 1000); // Return Unix timestamp in seconds
  };
  const handlePasteClick = async () => {
    try {
      const clipboardText = await navigator.clipboard.readText();
      const [lat, lng] = clipboardText.split(',').map(coord => coord.trim());
      
      if (lat && lng) {
        setNewLat(lng);
        setNewLng(lat);
      } else {
        alert('Invalid coordinates format. Please paste in "lat,lng" format.');
      }
    } catch (error) {
      console.error('Failed to read clipboard: ', error);
    }
  };

  
  const handleAddCoordinates = async () => {
    if (newLat && newLng) {
      const newCoord = { lat: parseFloat(newLat), lng: parseFloat(newLng) };
      try {
        const satelliteInfo = await fetchSatellitePasses(newLat, newLng);
        console.log('Fetched satellite info:', satelliteInfo);
        
        const coordKey = `${newLat},${newLng}`;
        if (activeTab === 'visualize') {
          setVisualizeCoords([...visualizeCoords, { ...newCoord, key: coordKey }]);
          
          // Simulate satellite data with random future timestamp
          if (satelliteInfo && satelliteInfo.positions.length > 0) {
            // Get a single timestamp from the satelliteInfo
            const singlePosition = satelliteInfo.positions[0]; // Get the first position
            const simulatedPosition = {
              ...singlePosition,
              timestamp: getRandomFutureTimestamp() // Replace with random timestamp
            };
  
            setSatelliteData(prevData => ({
              ...prevData,
              [coordKey]: { 
                info: satelliteInfo.info, // Keep satellite info
                positions: [simulatedPosition] // Only keep one position
              } 
            }));
          }
        } else {
          setCompareCoords([...compareCoords, newCoord]);
        }
      } catch (error) {
        console.error('Error in handleAddCoordinates:', error);
      }
      setNewLat('');
      setNewLng('');
    }
  };
  
  
  

  

  const handleVisualize = async (coord) => {
    setIsLoading(true);
    try {
      const wmsUrl = new URL('https://services.sentinel-hub.com/ogc/wms/56371f9c-8768-4893-9f25-cbb691bf016f');
      
      const params = {
        SERVICE: 'WMS',
        REQUEST: 'GetMap',
        FORMAT: 'image/png',
        LAYERS: selectedLayer,
        CRS: 'EPSG:4326',
        BBOX: `${coord.lng-0.02},${coord.lat-0.02},${coord.lng+0.02},${coord.lat+0.02}`,
        WIDTH: '512',
        HEIGHT: '512',
        VERSION: '1.3.0',
      };
      Object.keys(params).forEach(key => 
        wmsUrl.searchParams.append(key, params[key])
      );
  
      const response = await fetch(wmsUrl.toString());
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const blob = await response.blob();
      const imageUrl = URL.createObjectURL(blob);
      setVisualizedData(imageUrl);
    } catch (error) {
      console.error('Error fetching WMS data:', error);
    } finally {
      setIsLoading(false);
    }
  };
  const handleCompare = async (coord) => {
    setIsLoading(true);
    try {
      const wmsUrl = new URL('https://services.sentinel-hub.com/ogc/wms/56371f9c-8768-4893-9f25-cbb691bf016f');
      
      const params = {
        SERVICE: 'WMS',
        REQUEST: 'GetMap',
        FORMAT: 'image/png',
        LAYERS: selectedLayer,
        CRS: 'EPSG:4326',
        BBOX: `${coord.lng-0.01},${coord.lat-0.01},${coord.lng+0.01},${coord.lat+0.01}`,
        WIDTH: '512',
        HEIGHT: '512',
        VERSION: '1.3.0',
      };
      Object.keys(params).forEach(key => 
        wmsUrl.searchParams.append(key, params[key])
      );
  
      const response = await fetch(wmsUrl.toString());
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const blob = await response.blob();
      const imageUrl = URL.createObjectURL(blob);
      setCompareData(imageUrl);
    } catch (error) {
      console.error('Error fetching WMS data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  

  const removeCoordinate = (index) => {
    if (activeTab === 'visualize') {
      const removedCoord = visualizeCoords[index];
      const coordKey = `${removedCoord.lat},${removedCoord.lng}`;
      setVisualizeCoords(visualizeCoords.filter((_, i) => i !== index));
      setSatelliteData(prevData => {
        const newData = { ...prevData };
        delete newData[coordKey];
        return newData;
      });
    } else {
      setCompareCoords(compareCoords.filter((_, i) => i !== index));
    }
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleString();
  };

  const handleHeartClick = async (timestamp, lat, lng) => {
    try {
      const response = await fetch('http://localhost:3456/api/v1/user/setnotify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          time_stamp: timestamp,
          user_email: "raw@email.com",
          long: lng,
          lat: lat,
          methods: [{
            medium: "email",
            details: "raw@rawmail.com"
          }]
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("API response:", data);
    } catch (error) {
      console.error("Error sending heart click data:", error);
    }
  };
  
  
  return (
    <div className="relative">
      {/* Main Navbar remains the same */}
      <nav className="bg-[#1a1a1a] text-white px-4 h-14 flex items-center border-b border-[#333333]">
        <div className="flex justify-between items-center w-full">
          <div className="flex items-center">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-[#333333] rounded-lg transition-colors"
            >
              <Menu className="h-6 w-6" />
            </button>
            <span className="ml-4 text-xl font-semibold">Landsat Data Reflection Site</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={handlePasteClick}
              className="px-4 py-1.5 bg-[#ccde2c] text-black rounded hover:bg-[#bfd012] transition-colors"
            >
              Paste Coordinates
            </button>
            <button
              onClick={handleLoginClick}
              className="px-4 py-1.5 bg-[#ccde2c] text-black rounded hover:bg-[#bfd012] transition-colors"
            >
              Login
            </button>
          </div>
        </div>
      </nav>

      {/* Sidebar with new layer selection */}
      {isSidebarOpen && (
        <div className="absolute top-14 left-0 w-80 bg-[#2a2a2a] h-[calc(100vh-3.5rem)] z-50">
          <div className="flex border-b border-[#404040]">
            <button
              onClick={() => setActiveTab('visualize')}
              className={`flex-1 p-4 transition-colors flex items-center justify-center gap-2 
                ${activeTab === 'visualize' ? 'bg-[#333333]' : 'hover:bg-[#333333]'}`}
            >
              <Eye className="h-5 w-5" />
              <span>Visualize</span>
            </button>
            <button
              onClick={() => setActiveTab('compare')}
              className={`flex-1 p-4 transition-colors flex items-center justify-center gap-2 
                ${activeTab === 'compare' ? 'bg-[#333333]' : 'hover:bg-[#333333]'}`}
            >
              <BarChart2 className="h-5 w-5" />
              <span>Compare</span>
            </button>
          </div>

          <div className="p-4 overflow-y-auto h-[calc(100%-3.5rem)]">
            {activeTab === 'visualize' && (
              <div className="mb-4">
                <label className="block text-white mb-2">Select Layer</label>
                <select
                  value={selectedLayer}
                  onChange={(e) => setSelectedLayer(e.target.value)}
                  className="w-full p-2 bg-[#333333] text-white rounded border border-[#404040] focus:outline-none focus:border-[#ccde2c]"
                >
                  {layerOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Input Fields */}
            <div className="mb-4">
              <input
                type="number"
                placeholder="Latitude"
                value={newLng}
                onChange={(e) => setNewLng(e.target.value)}
                className="w-full p-2 mb-2 bg-[#333333] text-white rounded"
              />
              <input
                type="number"
                placeholder="Longitude"
                value={newLat}
                onChange={(e) => setNewLat(e.target.value)}
                className="w-full p-2 mb-2 bg-[#333333] text-white rounded"
              />
              <button
                onClick={handleAddCoordinates}
                className="w-full py-2 bg-[#ccde2c] text-black rounded hover:bg-[#bfd012] transition-colors"
              >
                Add Coordinates
              </button>
            </div>

            {/* Coordinates List */}
            <div className="space-y-2">
              {activeTab === 'visualize' ? (
                visualizeCoords.map((coord, index) => {
                  const coordKey = `${coord.lat},${coord.lng}`;
                  const satelliteInfo = satelliteData[coordKey]; // Get the satellite data for this coordinate
                
                  return (
                    <div key={index} className="bg-[#333333] p-2 rounded">
                      <div className="flex justify-between items-center mb-2">
                        <div className="text-white">
                          <div>Lat: {coord.lng}</div>
                          <div>Lng: {coord.lat}</div>
                        </div>
                        <button
                          onClick={() => removeCoordinate(index)}
                          className="text-red-500 hover:text-red-400"
                        >
                          <Trash size={16} />
                        </button>
                      </div>
                
                      {/* Render satellite data if available */}
                      {satelliteInfo && satelliteInfo.positions && satelliteInfo.positions.length > 0 ? (
                        <div className="text-white">
                          <h3>Satellite Data for {satelliteInfo.info.satname}:</h3>
                          <ul>
                            {satelliteInfo.positions.map((position, i) => (
                              <li key={i}>
                                TimeStamp Data : {formatTimestamp(position.timestamp)}
                                <br></br>
                                Altitude Data : {position.sataltitude} km
                              </li>
                            ))}
                          </ul>
                          <button
                  onClick={() => handleHeartClick(satelliteInfo.positions[0].timestamp, coord.lat, coord.lng)}
                  className="text-red-500 hover:text-red-400"
                >
                  <Heart size={16} />
                </button>
                        </div>
                      ) : (
                        <div className="text-white">No satellite data available.</div>
                      )}
                
                      <button
                        onClick={() => handleVisualize(coord)}
                        className="w-full py-1 px-2 bg-[#ccde2c] text-black rounded hover:bg-[#bfd012] transition-colors flex items-center justify-center"
                      >
                        <Eye size={16} className="mr-1" />
                        Visualize {selectedLayer}
                      </button>
                    </div>
                  );
                })
                
              ) : (
                compareCoords.map((coord, index) => (
                  <div key={index} className="bg-[#333333] p-2 rounded">
                    <div className="flex justify-between items-center">
                      <div className="text-white">
                        <div>Lng: {coord.lat}</div>
                        <div>Lat: {coord.lng}</div>
                      </div>
                      <button
                        onClick={() => removeCoordinate(index)}
                        className="text-red-500 hover:text-red-400"
                      >
                        <Trash size={16} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Visualization Overlay */}
      {(isLoading || visualizedData) && (
  <div className="fixed top-16 right-4 w-50 z-50 h-auto">
    {isLoading && (
      <div className="bg-white p-4 rounded-lg shadow-lg flex justify-center items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#ccde2c]"></div>
      </div>
    )}

    {visualizedData && (
      <div className="bg-white p-4 rounded-lg shadow-lg relative">
        <button
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
          onClick={() => setVisualizedData(null)}  // Close the visualization window
        >
          ✕
        </button>
        <h2 className="text-lg font-semibold mb-2">{selectedLayer} Visualization</h2>
        <img
          src={visualizedData}
          alt={`${selectedLayer} Visualization`}
          className="w-full h-auto rounded"
        />
      </div>
    )}
  </div>
)}


      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
}