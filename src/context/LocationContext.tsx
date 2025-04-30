import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Location, Hospital } from '../types';
import { calculateDistance } from '../utils/geoLocation';
import { mockHospitals } from '../data/mockData';

interface LocationContextType {
  userLocation: Location | null;
  setUserLocation: (location: Location) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  hospitals: Hospital[];
  nearbyHospitals: (Hospital & { distance: number })[];
  updateLocationCoordinates: (coords: { latitude: number; longitude: number }) => void;
  resetLocation: () => void;
}

const defaultLocation: Location = {
  country: 'Rwanda',
  district: '',
  sector: '',
  cell: '',
  coordinates: undefined
};

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const LocationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userLocation, setUserLocation] = useState<Location | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Filter hospitals based on user's district
  const hospitals = userLocation
    ? mockHospitals.filter(
        (hospital) => hospital.district.toLowerCase() === userLocation.district.toLowerCase()
      )
    : [];

  // Calculate distance for each hospital and sort by proximity
  const nearbyHospitals = userLocation?.coordinates
    ? hospitals
        .map((hospital) => {
          const distance = calculateDistance(
            userLocation.coordinates!.latitude,
            userLocation.coordinates!.longitude,
            hospital.coordinates.latitude,
            hospital.coordinates.longitude
          );
          return { ...hospital, distance };
        })
        .sort((a, b) => a.distance - b.distance)
    : [];

  const updateLocationCoordinates = (coords: { latitude: number; longitude: number }) => {
    if (userLocation) {
      setUserLocation({
        ...userLocation,
        coordinates: coords
      });
    } else {
      setUserLocation({
        ...defaultLocation,
        coordinates: coords
      });
    }
  };

  const resetLocation = () => {
    setUserLocation(null);
  };

  return (
    <LocationContext.Provider
      value={{
        userLocation,
        setUserLocation,
        isLoading,
        setIsLoading,
        hospitals,
        nearbyHospitals,
        updateLocationCoordinates,
        resetLocation
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = (): LocationContextType => {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
};