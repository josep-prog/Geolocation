import React, { useState, useEffect } from 'react';
import { Guitar as Hospital, Navigation, Phone, Star, ChevronDown, MapPin, Globe, Clock } from 'lucide-react';
import { useLocation } from '../context/LocationContext';
import { formatDistance, calculateDistance } from '../utils/geoLocation';
import { Hospital as HospitalType, SortOption } from '../types';
import HospitalMap from './HospitalMap';
import HospitalConnections from './HospitalConnections';

interface HospitalWithDistance extends HospitalType {
  distance: number;
}

interface HospitalData {
  hospitals: HospitalType[];
}

interface HospitalCardProps {
  hospital: HospitalWithDistance;
  onDirectionsClick: () => void;
}

const HospitalList: React.FC = () => {
  const { userLocation } = useLocation();
  const [hospitals, setHospitals] = useState<HospitalType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showMap, setShowMap] = useState(false);
  const [showConnections, setShowConnections] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('distance');
  const [selectedHospital, setSelectedHospital] = useState<string | undefined>();

  useEffect(() => {
    const loadHospitals = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/data/hospitals.json');
        const data: HospitalData = await response.json();
        setHospitals(data.hospitals);
        setError(null);
      } catch (err) {
        setError('Failed to load hospital data');
        console.error('Error loading hospitals:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadHospitals();
  }, []);

  const filteredAndSortedHospitals = React.useMemo<HospitalWithDistance[]>(() => {
    if (!userLocation || !hospitals.length) return [];

    // Only show hospitals if we have a complete location selection
    if (!userLocation.province || !userLocation.district || !userLocation.sector) {
      return [];
    }

    const filtered = hospitals
      .filter(hospital => {
        // Filter based on selected location hierarchy
        const matchesDistrict = hospital.district === userLocation.district;
        const matchesSector = hospital.sector === userLocation.sector;

        // Start with exact matches
        if (matchesSector) return true;
        if (matchesDistrict) return true;

        // If no exact matches and we have coordinates, include all hospitals
        // They will be sorted by distance anyway
        return userLocation.coordinates !== undefined;
      })
      .map(hospital => ({
        ...hospital,
        distance: userLocation.coordinates && hospital.coordinates
          ? calculateDistance(
              userLocation.coordinates.latitude,
              userLocation.coordinates.longitude,
              hospital.coordinates.latitude,
              hospital.coordinates.longitude
            )
          : Number.MAX_VALUE
      }));

    // Sort hospitals
    return filtered.sort((a, b) => {
      if (sortBy === 'distance') {
        return a.distance - b.distance;
      }
      return b.rating - a.rating;
    });
  }, [hospitals, userLocation, sortBy]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-600 bg-red-50 rounded-lg">
        <p>{error}</p>
      </div>
    );
  }

  if (!userLocation || !userLocation.province || !userLocation.district || !userLocation.sector) {
    return (
      <div className="p-4 text-gray-600 bg-gray-50 rounded-lg">
        <p>Please select your complete location (province, district, and sector) to see nearby hospitals.</p>
      </div>
    );
  }

  if (filteredAndSortedHospitals.length === 0) {
    return (
      <div className="p-4 text-gray-600 bg-gray-50 rounded-lg">
        <p>No hospitals found in or near {userLocation.sector}, {userLocation.district}.</p>
      </div>
    );
  }

  const locationName = `${userLocation.sector}, ${userLocation.district}`;

  const handleDirectionsClick = (hospital: HospitalType) => {
    if (userLocation.coordinates && hospital.coordinates) {
      const url = `https://www.google.com/maps/dir/?api=1&origin=${userLocation.coordinates.latitude},${userLocation.coordinates.longitude}&destination=${hospital.coordinates.latitude},${hospital.coordinates.longitude}`;
      window.open(url, '_blank');
    }
  };

  return (
    <div className="mt-8 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">
          {filteredAndSortedHospitals.length} hospitals found near {locationName}
        </h2>
        <div className="flex gap-4">
          <button
            onClick={() => setShowConnections(!showConnections)}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors flex items-center gap-2"
          >
            <Hospital size={18} />
            {showConnections ? 'Hide Connections' : 'Show Connections'}
          </button>
          <button
            onClick={() => setShowMap(!showMap)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <MapPin size={18} />
            {showMap ? 'Hide Map' : 'Show Map'}
          </button>
        </div>
      </div>

      {showConnections && (
        <div className="mb-6">
          <HospitalConnections />
        </div>
      )}

      {showMap && userLocation.coordinates && (
        <div className="mb-6">
          <HospitalMap
            userLocation={userLocation}
            hospitals={filteredAndSortedHospitals}
            selectedHospital={selectedHospital}
            onHospitalSelect={setSelectedHospital}
          />
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-800">Nearby Hospitals</h3>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">Sort By:</span>
            <div className="flex gap-2">
              <button
                onClick={() => setSortBy('distance')}
                className={`px-3 py-1.5 rounded-md flex items-center gap-1 ${
                  sortBy === 'distance'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Navigation size={16} />
                Distance
              </button>
              <button
                onClick={() => setSortBy('rating')}
                className={`px-3 py-1.5 rounded-md flex items-center gap-1 ${
                  sortBy === 'rating'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Star size={16} />
                Rating
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {filteredAndSortedHospitals.map((hospital) => (
          <div
            key={hospital.id}
            className={`bg-white rounded-lg shadow-sm p-6 ${
              selectedHospital === hospital.id ? 'ring-2 ring-blue-500' : ''
            }`}
            onClick={() => setSelectedHospital(hospital.id)}
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-semibold text-gray-800">{hospital.name}</h3>
                <p className="text-gray-600 mt-1">{hospital.address}</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-right">
                  <div className="flex items-center text-yellow-500">
                    <Star size={18} className="fill-current" />
                    <span className="ml-1 font-semibold">{hospital.rating}</span>
                    <span className="text-gray-500 text-sm ml-1">
                      ({hospital.reviewCount})
                    </span>
                  </div>
                  {hospital.distance < Number.MAX_VALUE && (
                    <div className="text-sm text-gray-500 mt-1">
                      {formatDistance(hospital.distance)}
                    </div>
                  )}
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDirectionsClick(hospital);
                  }}
                  className="ml-4 p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                >
                  <Navigation size={20} />
                </button>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {hospital.specialties.map((specialty, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm"
                >
                  {specialty}
                </span>
              ))}
            </div>

            <div className="mt-4 flex items-center gap-6 text-gray-600">
              <div className="flex items-center gap-2">
                <Phone size={16} />
                <span>{hospital.phoneNumber}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={16} />
                <span>Available Slots: {hospital.availableSlots}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HospitalList;