import React, { useState } from 'react';
import { Menu, Eye, BarChart2, Trash } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Navbar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('visualize');
  const [visualizeCoords, setVisualizeCoords] = useState([]);
  const [compareCoords, setCompareCoords] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [newLat, setNewLat] = useState('');
  const [newLng, setNewLng] = useState('');
  const [visualizedData, setVisualizedData] = useState(null);
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleAddCoordinates = () => {
    if (newLat && newLng) {
      const newCoord = { lat: parseFloat(newLat), lng: parseFloat(newLng) };
      if (activeTab === 'visualize') {
        setVisualizeCoords([...visualizeCoords, newCoord]);
      } else {
        setCompareCoords([...compareCoords, newCoord]);
      }
      setNewLat('');
      setNewLng('');
    }
  };

  const handleVisualize = async (coord) => {
    setIsLoading(true);
    try {
      const wmsUrl = new URL('https://services-uswest2.sentinel-hub.com/ogc/wms/5e4aad10-3a4f-4d0d-9c60-53a53b6ea5b2');
      
      const params = {
        SERVICE: 'WMS',
        REQUEST: 'GetMap',
        // FORMAT: 'image/png',
        LAYERS: 'NDVI',
        CRS: 'EPSG:4326',
        BBOX: `${coord.lng-0.005},${coord.lat-0.005},${coord.lng+0.005},${coord.lat+0.005}`,
        WIDTH: '512',
        HEIGHT: '512',
        VERSION: '1.3.0'
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

  const removeCoordinate = (index) => {
    if (activeTab === 'visualize') {
      setVisualizeCoords(visualizeCoords.filter((_, i) => i !== index));
    } else {
      setCompareCoords(compareCoords.filter((_, i) => i !== index));
    }
  };

  return (
    <div className="relative">
      {/* Main Navbar - fixed height */}
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
              onClick={handleLoginClick}
              className="px-4 py-1.5 bg-[#ccde2c] text-black rounded hover:bg-[#bfd012] transition-colors"
            >
              Login
            </button>
          </div>
        </div>
      </nav>

      {/* Sidebar - absolute positioning */}
      {isSidebarOpen && (
        <div className="absolute top-14 left-0 w-80 bg-[#2a2a2a] h-[calc(100vh-3.5rem)] z-50">
          {/* Tab Buttons */}
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
            {/* Input Fields */}
            <div className="mb-4">
              <input
                type="number"
                placeholder="Latitude"
                value={newLat}
                onChange={(e) => setNewLat(e.target.value)}
                className="w-full p-2 mb-2 bg-[#333333] text-white rounded"
              />
              <input
                type="number"
                placeholder="Longitude"
                value={newLng}
                onChange={(e) => setNewLng(e.target.value)}
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
                visualizeCoords.map((coord, index) => (
                  <div key={index} className="bg-[#333333] p-2 rounded">
                    <div className="flex justify-between items-center mb-2">
                      <div className="text-white">
                        <div>Lat: {coord.lat}</div>
                        <div>Lng: {coord.lng}</div>
                      </div>
                      <button
                        onClick={() => removeCoordinate(index)}
                        className="text-red-500 hover:text-red-400"
                      >
                        <Trash size={16} />
                      </button>
                    </div>
                    <button
                      onClick={() => handleVisualize(coord)}
                      className="w-full py-1 px-2 bg-[#ccde2c] text-black rounded hover:bg-[#bfd012] transition-colors flex items-center justify-center"
                    >
                      <Eye size={16} className="mr-1" />
                      Visualize
                    </button>
                  </div>
                ))
              ) : (
                compareCoords.map((coord, index) => (
                  <div key={index} className="bg-[#333333] p-2 rounded">
                    <div className="flex justify-between items-center">
                      <div className="text-white">
                        <div>Lat: {coord.lat}</div>
                        <div>Lng: {coord.lng}</div>
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

      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Visualization Overlay */}
      {(isLoading || visualizedData) && (
        <div className="fixed top-16 right-4 w-64 z-50">
          {isLoading && (
            <div className="bg-white p-4 rounded-lg shadow-lg flex justify-center items-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#ccde2c]"></div>
            </div>
          )}
          
          {visualizedData && (
            <div className="bg-white p-4 rounded-lg shadow-lg">
              <h2 className="text-lg font-semibold mb-2">Visualization Result</h2>
              <img
                src={visualizedData}
                alt="Satellite Visualization"
                className="w-full h-auto rounded"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}