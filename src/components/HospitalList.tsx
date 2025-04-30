import React from 'react';
import { Guitar as Hospital } from 'lucide-react';
import { useLocation } from '../context/LocationContext';
import { formatDistance } from '../utils/geoLocation';

const HospitalList: React.FC = () => {
  const { nearbyHospitals, userLocation } = useLocation();

  if (!userLocation || nearbyHospitals.length === 0) {
    return null;
  }

  const districtName = districts.find(d => d.value === userLocation.district)?.label;

  return (
    <div className="mt-8 max-w-2xl mx-auto">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Hospitals in {districtName || userLocation.district}
      </h2>

      {nearbyHospitals.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <p className="text-gray-600">No hospitals found in this district.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {nearbyHospitals.map((hospital) => (
            <HospitalCard key={hospital.id} hospital={hospital} />
          ))}
        </div>
      )}
    </div>
  );
};

interface HospitalCardProps {
  hospital: typeof import('../context/LocationContext').useLocation extends () => infer T
    ? T['nearbyHospitals'][number]
    : never;
}

const HospitalCard: React.FC<HospitalCardProps> = ({ hospital }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="border-l-4 border-blue-500 p-6">
        <div className="flex justify-between items-start">
          <div className="flex items-start gap-3">
            <Hospital className="text-blue-500 mt-1" size={22} />
            <div>
              <h3 className="font-semibold text-lg text-gray-800">{hospital.name}</h3>
              <p className="text-gray-600 text-sm mt-1">{hospital.address}</p>
            </div>
          </div>
          <div className="text-right">
            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
              {formatDistance(hospital.distance)} away
            </span>
          </div>
        </div>
        
        <div className="mt-4 flex justify-between items-center">
          <div className="flex items-center">
            <span className="text-gray-700 text-sm">Available slots:</span>
            <span className="ml-2 bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
              {hospital.availableSlots}
            </span>
          </div>
          
          <button className="bg-blue-500 hover:bg-blue-600 text-white text-sm py-1.5 px-3 rounded transition-colors">
            Book Appointment
          </button>
        </div>
      </div>
    </div>
  );
};

// Mock data for the district names display
const districts = [
  { value: 'gasabo', label: 'Gasabo' },
  { value: 'kicukiro', label: 'Kicukiro' },
  { value: 'nyarugenge', label: 'Nyarugenge' },
  { value: 'rusizi', label: 'Rusizi' }
];

export default HospitalList;