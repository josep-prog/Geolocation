import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Hospital, Location } from '../types';

// Custom markers
const userIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const hospitalIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

interface HospitalMapProps {
  userLocation: Location;
  hospitals: (Hospital & { distance: number })[];
  selectedHospital?: string;
  onHospitalSelect?: (hospitalId: string) => void;
}

// Component to handle map center updates
function MapCenter({ position }: { position: [number, number] }) {
  const map = useMap();
  React.useEffect(() => {
    map.setView(position, 13);
  }, [map, position]);
  return null;
}

const HospitalMap: React.FC<HospitalMapProps> = ({
  userLocation,
  hospitals,
  selectedHospital,
  onHospitalSelect
}) => {
  // Return null if coordinates are not available
  if (!userLocation.coordinates) return null;

  const selectedHospitalData = hospitals.find(h => h.id === selectedHospital);
  const center: [number, number] = selectedHospitalData
    ? [selectedHospitalData.coordinates.latitude, selectedHospitalData.coordinates.longitude]
    : [userLocation.coordinates.latitude, userLocation.coordinates.longitude];

  // Initialize default icon options
  React.useEffect(() => {
    L.Icon.Default.imagePath = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/';
  }, []);

  return (
    <div className="h-[400px] w-full bg-white rounded-lg shadow-md overflow-hidden">
      <MapContainer
        center={center}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* User location marker */}
        <Marker 
          position={[userLocation.coordinates.latitude, userLocation.coordinates.longitude]}
          icon={userIcon}
        >
          <Popup>
            <div className="font-semibold">Your Location</div>
          </Popup>
        </Marker>

        {/* Hospital markers */}
        {hospitals.map((hospital) => (
          <Marker
            key={hospital.id}
            position={[hospital.coordinates.latitude, hospital.coordinates.longitude]}
            icon={hospitalIcon}
            eventHandlers={{
              click: () => onHospitalSelect?.(hospital.id)
            }}
          >
            <Popup>
              <div className="max-w-xs">
                <h3 className="font-semibold text-lg">{hospital.name}</h3>
                <p className="text-sm text-gray-600 mt-1">{hospital.address}</p>
                <div className="mt-2 flex items-center gap-1">
                  <span className="text-sm font-medium">Rating:</span>
                  <div className="flex items-center text-yellow-500">
                    {hospital.rating}
                    <span className="text-gray-500 text-xs ml-1">
                      ({hospital.reviewCount} reviews)
                    </span>
                  </div>
                </div>
                <div className="mt-2">
                  <span className="text-sm font-medium">Available Slots:</span>
                  <span className="ml-1 text-green-600">{hospital.availableSlots}</span>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Update map center when selection changes */}
        <MapCenter position={center} />
      </MapContainer>
    </div>
  );
};

export default HospitalMap; 