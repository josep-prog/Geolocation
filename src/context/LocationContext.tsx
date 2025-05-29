import React, { createContext, useContext, useState } from 'react';

interface Coordinates {
  latitude: number;
  longitude: number;
}

interface Location {
  country: string;
  province: string;
  district: string;
  sector: string;
  coordinates?: Coordinates;
}

interface LocationContextType {
  userLocation: Location | null;
  setUserLocation: (location: Location | null) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  updateLocationCoordinates: (coordinates: Coordinates) => void;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

// Create a named function for the hook
export function useLocation() {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
}

// Export the provider component
export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userLocation, setUserLocation] = useState<Location | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const updateLocationCoordinates = (coordinates: Coordinates) => {
    if (userLocation) {
      setUserLocation({
        ...userLocation,
        coordinates
      });
    }
  };

  return (
    <LocationContext.Provider
      value={{
        userLocation,
        setUserLocation,
        isLoading,
        setIsLoading,
        updateLocationCoordinates
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export type { Location, Coordinates };