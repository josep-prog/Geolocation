import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, X } from 'lucide-react';
import { useLocation } from '../context/LocationContext';
import { districts, sectors, cells } from '../data/mockData';
import { getCurrentPosition } from '../utils/geoLocation';

const LocationSelector: React.FC = () => {
  const {
    userLocation,
    setUserLocation,
    isLoading,
    setIsLoading,
    updateLocationCoordinates
  } = useLocation();

  const [selectedDistrict, setSelectedDistrict] = useState<string>('');
  const [selectedSector, setSelectedSector] = useState<string>('');
  const [selectedCell, setSelectedCell] = useState<string>('');
  const [availableSectors, setAvailableSectors] = useState<{ label: string; value: string }[]>([]);
  const [availableCells, setAvailableCells] = useState<{ label: string; value: string }[]>([]);
  const [geoError, setGeoError] = useState<string>('');

  useEffect(() => {
    if (selectedDistrict) {
      setAvailableSectors(sectors[selectedDistrict] || []);
      setSelectedSector('');
      setSelectedCell('');
    } else {
      setAvailableSectors([]);
    }
  }, [selectedDistrict]);

  useEffect(() => {
    if (selectedSector) {
      setAvailableCells(cells[selectedSector] || []);
      setSelectedCell('');
    } else {
      setAvailableCells([]);
    }
  }, [selectedSector]);

  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDistrict(e.target.value);
  };

  const handleSectorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSector(e.target.value);
  };

  const handleCellChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCell(e.target.value);
  };

  const handleLocationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedDistrict) {
      return;
    }

    const newLocation = {
      country: 'Rwanda',
      district: selectedDistrict,
      sector: selectedSector,
      cell: selectedCell,
      coordinates: userLocation?.coordinates
    };

    setUserLocation(newLocation);
  };

  const detectLocation = async () => {
    setGeoError('');
    setIsLoading(true);
    
    try {
      const position = await getCurrentPosition();
      const coords = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      };
      
      updateLocationCoordinates(coords);
      
      // In a real app, we would use reverse geocoding to get district/sector/cell
      // For now, we'll just use Kigali as a demo
      setSelectedDistrict('gasabo');
      setTimeout(() => {
        setSelectedSector('remera');
        setSelectedCell('rukiri_i');
      }, 300);
      
    } catch (error) {
      if (error instanceof Error) {
        setGeoError(error.message);
      } else {
        setGeoError('Failed to get your location');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setSelectedDistrict('');
    setSelectedSector('');
    setSelectedCell('');
    setGeoError('');
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-md mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Your Location</h2>
        {(selectedDistrict || selectedSector || selectedCell) && (
          <button
            onClick={resetForm}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X size={20} />
          </button>
        )}
      </div>

      <div className="mb-6">
        <button
          onClick={detectLocation}
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-md transition-colors disabled:bg-blue-300"
        >
          {isLoading ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Detecting...
            </span>
          ) : (
            <>
              <Navigation size={18} />
              <span>Auto-detect my location</span>
            </>
          )}
        </button>

        {geoError && (
          <p className="mt-2 text-sm text-red-600">{geoError}</p>
        )}
      </div>

      <div className="relative my-4 flex items-center">
        <div className="flex-grow border-t border-gray-300"></div>
        <span className="flex-shrink mx-4 text-gray-500 text-sm">OR</span>
        <div className="flex-grow border-t border-gray-300"></div>
      </div>

      <form onSubmit={handleLocationSubmit}>
        <div className="space-y-4">
          <div>
            <label htmlFor="district" className="block text-sm font-medium text-gray-700 mb-1">
              District
            </label>
            <select
              id="district"
              value={selectedDistrict}
              onChange={handleDistrictChange}
              className="w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select District</option>
              {districts.map((district) => (
                <option key={district.value} value={district.value}>
                  {district.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="sector" className="block text-sm font-medium text-gray-700 mb-1">
              Sector
            </label>
            <select
              id="sector"
              value={selectedSector}
              onChange={handleSectorChange}
              disabled={!selectedDistrict}
              className="w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-500"
            >
              <option value="">Select Sector</option>
              {availableSectors.map((sector) => (
                <option key={sector.value} value={sector.value}>
                  {sector.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="cell" className="block text-sm font-medium text-gray-700 mb-1">
              Cell
            </label>
            <select
              id="cell"
              value={selectedCell}
              onChange={handleCellChange}
              disabled={!selectedSector}
              className="w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-500"
            >
              <option value="">Select Cell</option>
              {availableCells.map((cell) => (
                <option key={cell.value} value={cell.value}>
                  {cell.label}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            disabled={!selectedDistrict}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md transition-colors disabled:bg-blue-300 mt-2 flex items-center justify-center gap-2"
          >
            <MapPin size={18} />
            <span>Find Nearby Hospitals</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default LocationSelector;