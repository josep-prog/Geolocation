export interface Location {
  country: string;
  district: string;
  sector: string;
  cell: string;
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
  cell: string;
  address: string;
}

export interface LocationOption {
  label: string;
  value: string;
}