import React, { useEffect, useState } from 'react';
import { MapPin, Navigation } from 'lucide-react';

interface Hospital {
  id: string;
  name: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
}

interface NearbyHospital {
  id: string;
  name: string;
  distance_km: number;
  direction: string;
}

interface HospitalCluster {
  name: string;
  hospitals: {
    id: string;
    name: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
    nearby_hospitals: NearbyHospital[];
  }[];
}

interface HospitalConnections {
  hospital_connections: {
    [key: string]: HospitalCluster;
  };
  clusters_summary: {
    [key: string]: {
      total_hospitals: number;
      average_distance_km: number;
      hospitals: string[];
    };
  };
}

const HospitalConnections: React.FC = () => {
  const [connections, setConnections] = useState<HospitalConnections | null>(null);
  const [selectedCluster, setSelectedCluster] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadConnections = async () => {
      try {
        const response = await fetch('/data/kigali_hospital_connections.json');
        const data = await response.json();
        setConnections(data);
      } catch (err) {
        setError('Failed to load hospital connections');
        console.error('Error loading hospital connections:', err);
      }
    };

    loadConnections();
  }, []);

  if (error) {
    return (
      <div className="p-4 text-red-600 bg-red-50 rounded-lg">
        <p>{error}</p>
      </div>
    );
  }

  if (!connections) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const handleDirectionsClick = (from: Hospital, to: Hospital) => {
    const url = `https://www.google.com/maps/dir/?api=1&origin=${from.coordinates.latitude},${from.coordinates.longitude}&destination=${to.coordinates.latitude},${to.coordinates.longitude}`;
    window.open(url, '_blank');
  };

  return (
    <div className="max-w-4xl mx-auto mt-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Hospital Clusters in Kigali</h2>
      
      <div className="grid grid-cols-1 gap-6">
        {Object.entries(connections.hospital_connections).map(([clusterId, cluster]) => (
          <div
            key={clusterId}
            className={`bg-white rounded-lg shadow-sm p-6 ${
              selectedCluster === clusterId ? 'ring-2 ring-blue-500' : ''
            }`}
            onClick={() => setSelectedCluster(clusterId)}
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-800">{cluster.name}</h3>
                <p className="text-gray-600 mt-1">
                  {connections.clusters_summary[clusterId].total_hospitals} hospitals &bull;{' '}
                  Average distance: {connections.clusters_summary[clusterId].average_distance_km} km
                </p>
              </div>
              <button
                className="text-blue-600 hover:text-blue-800"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedCluster(selectedCluster === clusterId ? null : clusterId);
                }}
              >
                {selectedCluster === clusterId ? 'Show Less' : 'Show More'}
              </button>
            </div>

            {selectedCluster === clusterId && (
              <div className="space-y-6">
                {cluster.hospitals.map((hospital) => (
                  <div key={hospital.id} className="border-t pt-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold text-gray-800">{hospital.name}</h4>
                        <p className="text-sm text-gray-600">
                          {hospital.coordinates.latitude}, {hospital.coordinates.longitude}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin size={18} className="text-gray-500" />
                      </div>
                    </div>

                    {hospital.nearby_hospitals.length > 0 && (
                      <div className="mt-3">
                        <h5 className="text-sm font-medium text-gray-700 mb-2">Nearby Hospitals:</h5>
                        <div className="space-y-2">
                          {hospital.nearby_hospitals.map((nearby) => (
                            <div
                              key={nearby.id}
                              className="flex items-center justify-between bg-gray-50 p-2 rounded-lg"
                            >
                              <div>
                                <p className="text-sm font-medium text-gray-800">{nearby.name}</p>
                                <p className="text-xs text-gray-600">
                                  {nearby.distance_km} km &bull; {nearby.direction}
                                </p>
                              </div>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const toHospital = cluster.hospitals.find(h => h.id === nearby.id) ||
                                    Object.values(connections.hospital_connections)
                                      .flatMap(c => c.hospitals)
                                      .find(h => h.id === nearby.id);
                                  
                                  if (toHospital) {
                                    handleDirectionsClick(hospital, toHospital);
                                  }
                                }}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                              >
                                <Navigation size={16} />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default HospitalConnections; 