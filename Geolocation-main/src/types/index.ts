export interface Location {
  country: string;
  province: string;
  district: string;
  sector: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

export interface Hospital {
  id: string;
  name: string;
  availableSlots: number;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  district: string;
  sector: string;
  address: string;
  rating: number;
  reviewCount: number;
  specialties: string[];
  phoneNumber: string;
}

export interface LocationOption {
  label: string;
  value: string;
}

export type SortOption = 'distance' | 'rating';