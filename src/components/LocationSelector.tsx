import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, X, Hospital } from 'lucide-react';
import { useLocation } from '../context/LocationContext';
import { getCurrentPosition } from '../utils/geoLocation';

interface Sector {
  name: string;
}

interface District {
  name: string;
  sectors: Sector[];
}

interface Province {
  name: string;
  districts: District[];
}

interface LocationData {
  provinces: Province[];
}

interface Hospital {
  id: string;
  name: string;
  type: string;
  province: string;
  district: string;
  sector: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  rating: number;
  reviewCount: number;
  services: string[];
  specialties: string[];
  contact: {
    phone: string;
    email: string;
    website: string;
  };
  workingHours: {
    emergency: string;
    regular: string;
  };
  distance?: number;
}

interface HospitalData {
  hospitals: Hospital[];
}

const LocationSelector: React.FC = () => {
  const {
    userLocation,
    setUserLocation,
    isLoading,
    setIsLoading,
    updateLocationCoordinates
  } = useLocation();

  const [locationData, setLocationData] = useState<LocationData | null>(null);
  const [hospitalData, setHospitalData] = useState<HospitalData | null>(null);
  
  const [selectedProvince, setSelectedProvince] = useState<string>('');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('');
  const [selectedSector, setSelectedSector] = useState<string>('');

  const [availableDistricts, setAvailableDistricts] = useState<District[]>([]);
  const [availableSectors, setAvailableSectors] = useState<Sector[]>([]);

  const [geoError, setGeoError] = useState<string>('');

  const [nearbyHospitals, setNearbyHospitals] = useState<Hospital[]>([]);
  const [showHospitals, setShowHospitals] = useState(false);

  // Load location and hospital data
  useEffect(() => {
    const loadData = async () => {
      try {
        const [locationsResponse, hospitalsResponse] = await Promise.all([
          fetch('/data/rw_locations.json'),
          fetch('/data/hospitals.json')
        ]);
        
        const locations = await locationsResponse.json();
        const hospitals = await hospitalsResponse.json();
        
        setLocationData(locations);
        setHospitalData(hospitals);
      } catch (error) {
        console.error('Error loading location data:', error);
        setGeoError('Failed to load location data');
      }
    };

    loadData();
  }, []);

  // Update available options when selections change
  useEffect(() => {
    if (locationData) {
      if (selectedProvince) {
        const province = locationData.provinces.find(p => p.name === selectedProvince);
        setAvailableDistricts(province?.districts || []);
      } else {
        setAvailableDistricts([]);
      }
    }
  }, [locationData, selectedProvince]);

  useEffect(() => {
    if (selectedDistrict && availableDistricts.length > 0) {
      const district = availableDistricts.find(d => d.name === selectedDistrict);
      setAvailableSectors(district?.sectors || []);
    } else {
      setAvailableSectors([]);
    }
  }, [availableDistricts, selectedDistrict]);

  const handleLocationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedProvince || !selectedDistrict || !selectedSector) {
      return;
    }

    const newLocation = {
      country: 'Rwanda',
      province: selectedProvince,
      district: selectedDistrict,
      sector: selectedSector,
      coordinates: userLocation?.coordinates
    };
    
    setUserLocation(newLocation);
  };

  const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedProvince(value);
    setSelectedDistrict('');
    setSelectedSector('');
  };

  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedDistrict(value);
    setSelectedSector('');
  };

  const handleSectorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedSector(value);
  };

  const findNearestLocation = (latitude: number, longitude: number): Hospital | null => {
    if (!hospitalData) return null;

    let nearestHospital: Hospital | null = null;
    let shortestDistance = Number.MAX_VALUE;

    hospitalData.hospitals.forEach(hospital => {
      const distance = Math.sqrt(
        Math.pow(hospital.coordinates.latitude - latitude, 2) +
        Math.pow(hospital.coordinates.longitude - longitude, 2)
      );
      if (distance < shortestDistance) {
        shortestDistance = distance;
        nearestHospital = hospital;
      }
    });

    return nearestHospital;
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
      
      const nearestHospital = findNearestLocation(coords.latitude, coords.longitude);
      
      if (nearestHospital) {
        setSelectedProvince(nearestHospital.province);
        setSelectedDistrict(nearestHospital.district);
        setSelectedSector(nearestHospital.sector);
        
        const newLocation = {
          country: 'Rwanda',
          province: nearestHospital.province,
          district: nearestHospital.district,
          sector: nearestHospital.sector,
          coordinates: coords
        };
        
        setUserLocation(newLocation);
      }
      
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
    setSelectedProvince('');
    setSelectedDistrict('');
    setSelectedSector('');
    setGeoError('');
    setUserLocation(null);
  };

  // Calculate distance between two coordinates in kilometers
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  // Find nearby hospitals based on selected location or coordinates
  const findNearbyHospitals = () => {
    if (!hospitalData || !userLocation?.coordinates?.latitude || !userLocation?.coordinates?.longitude) return;

    const { latitude, longitude } = userLocation.coordinates;

    const nearbyHospitals = hospitalData.hospitals
      .map(hospital => ({
        ...hospital,
        distance: calculateDistance(
          latitude,
          longitude,
          hospital.coordinates.latitude,
          hospital.coordinates.longitude
        )
      }))
      .sort((a, b) => (a.distance || 0) - (b.distance || 0))
      .slice(0, 5); // Get 5 nearest hospitals

    setNearbyHospitals(nearbyHospitals);
    setShowHospitals(true);
  };

  // Update nearby hospitals when location changes
  useEffect(() => {
    if (userLocation?.coordinates) {
      findNearbyHospitals();
    }
  }, [userLocation]);

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-md mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Your Location</h2>
        {(selectedProvince || selectedDistrict || selectedSector) && (
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
              Getting Location...
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
            <label htmlFor="province" className="block text-sm font-medium text-gray-700 mb-1">
              Province
            </label>
            <select
              id="province"
              value={selectedProvince}
              onChange={handleProvinceChange}
              className="w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select Province</option>
              {locationData?.provinces.map((province) => (
                <option key={province.name} value={province.name}>
                  {province.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="district" className="block text-sm font-medium text-gray-700 mb-1">
              District
            </label>
            <select
              id="district"
              value={selectedDistrict}
              onChange={handleDistrictChange}
              disabled={!selectedProvince}
              className="w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-500"
            >
              <option value="">Select District</option>
              {availableDistricts.map((district) => (
                <option key={district.name} value={district.name}>
                  {district.name}
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
                <option key={sector.name} value={sector.name}>
                  {sector.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-6">
            <button
              type="submit"
              disabled={!selectedProvince || !selectedDistrict || !selectedSector}
              className="w-full bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-md transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <MapPin size={18} />
              Set Location
            </button>
            {(!selectedProvince || !selectedDistrict || !selectedSector) && (
              <p className="mt-2 text-sm text-gray-600">
                Please select all location fields to continue
              </p>
            )}
          </div>
        </div>
      </form>

      {showHospitals && nearbyHospitals.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Hospital size={20} />
            Nearby Hospitals
          </h3>
          <div className="space-y-4">
            {nearbyHospitals.map((hospital) => (
              <div
                key={hospital.id}
                className="border border-gray-200 rounded-lg p-4 hover:border-blue-500 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold text-gray-800">{hospital.name}</h4>
                    <p className="text-sm text-gray-600">
                      {hospital.sector}, {hospital.district}
                    </p>
                  </div>
                  <span className="text-sm font-medium text-blue-600">
                    {hospital.distance?.toFixed(1) || 'N/A'} km
                  </span>
                </div>
                <div className="mt-2 text-sm text-gray-600">
                  <p className="flex items-center gap-2">
                    <span className="font-medium">Type:</span> {hospital.type}
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="font-medium">Rating:</span>
                    <span className="text-yellow-500">★</span>
                    {hospital.rating} ({hospital.reviewCount} reviews)
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="font-medium">Emergency:</span>
                    {hospital.workingHours.emergency}
                  </p>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {hospital.services.slice(0, 3).map((service, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                    >
                      {service}
                    </span>
                  ))}
                  {hospital.services.length > 3 && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      +{hospital.services.length - 3} more
                    </span>
                  )}
                </div>
                <div className="mt-3 flex gap-3">
                  <a
                    href={`tel:${hospital.contact.phone}`}
                    className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    {hospital.contact.phone}
                  </a>
                  <a
                    href={`https://${hospital.contact.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    Website
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationSelector;