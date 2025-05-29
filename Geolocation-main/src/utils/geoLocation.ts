/**
 * Calculate distance between two coordinates using the Haversine formula
 * @param lat1 First latitude
 * @param lon1 First longitude
 * @param lat2 Second latitude
 * @param lon2 Second longitude
 * @returns Distance in kilometers
 */
export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in kilometers
  
  return Math.round(distance * 100) / 100; // Round to 2 decimal places
};

const toRad = (degrees: number): number => {
  return degrees * (Math.PI / 180);
};

/**
 * Get location using IP address as fallback
 */
const getLocationByIP = async (): Promise<{ latitude: number; longitude: number }> => {
  try {
    const response = await fetch('https://ipapi.co/json/');
    const data = await response.json();
    return {
      latitude: parseFloat(data.latitude),
      longitude: parseFloat(data.longitude)
    };
  } catch (error) {
    throw new Error('Failed to get location from IP');
  }
};

// Create coordinates object with required toJSON method
const createCoordinates = (
  latitude: number,
  longitude: number,
  accuracy: number
): GeolocationCoordinates => ({
  latitude,
  longitude,
  accuracy,
  altitude: null,
  altitudeAccuracy: null,
  heading: null,
  speed: null,
  toJSON() {
    return {
      latitude: this.latitude,
      longitude: this.longitude,
      accuracy: this.accuracy,
      altitude: this.altitude,
      altitudeAccuracy: this.altitudeAccuracy,
      heading: this.heading,
      speed: this.speed
    };
  }
});

// Create GeolocationPosition object with required toJSON method
const createPosition = (coords: GeolocationCoordinates, timestamp: number): GeolocationPosition => ({
  coords,
  timestamp,
  toJSON() {
    return {
      coords: this.coords.toJSON(),
      timestamp: this.timestamp
    };
  }
});

/**
 * Get current geolocation with fallback to IP-based location
 * @returns Promise with coordinates
 */
export const getCurrentPosition = async (): Promise<GeolocationPosition> => {
  return new Promise(async (resolve, reject) => {
    if (!navigator.geolocation) {
      // Try IP-based location if geolocation is not supported
      try {
        const ipLocation = await getLocationByIP();
        resolve(createPosition(
          createCoordinates(ipLocation.latitude, ipLocation.longitude, 5000),
          Date.now()
        ));
        return;
      } catch (error) {
        reject(new Error('Location services are not available'));
        return;
      }
    }

    // Options for high accuracy GPS/Satellite positioning
    const options: PositionOptions = {
      enableHighAccuracy: true, // Use GPS if available
      timeout: 15000, // Wait up to 15 seconds
      maximumAge: 0 // Always get fresh location
    };

    let hasResolved = false;

    // Try GPS first
    navigator.geolocation.getCurrentPosition(
      (position) => {
        if (hasResolved) return;
        hasResolved = true;
        resolve(position);
      },
      async (error) => {
        if (hasResolved) return;
        
        // If GPS fails, try IP-based location
        try {
          const ipLocation = await getLocationByIP();
          hasResolved = true;
          resolve(createPosition(
            createCoordinates(ipLocation.latitude, ipLocation.longitude, 5000),
            Date.now()
          ));
        } catch (ipError) {
          // If both GPS and IP location fail, return the original GPS error
          let errorMessage = 'Failed to get your location';
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Please allow location access to use GPS positioning';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Location information is unavailable. Please check your internet connection.';
              break;
            case error.TIMEOUT:
              errorMessage = 'Location request timed out. Please try again.';
              break;
          }
          reject(new Error(errorMessage));
        }
      },
      options
    );

    // Set a backup timeout
    setTimeout(() => {
      if (hasResolved) return;
      hasResolved = true;
      getLocationByIP()
        .then(ipLocation => {
          resolve(createPosition(
            createCoordinates(ipLocation.latitude, ipLocation.longitude, 5000),
            Date.now()
          ));
        })
        .catch(() => {
          reject(new Error('Location services timed out. Please try again.'));
        });
    }, options.timeout);
  });
};

/**
 * Format distance for display
 * @param distance Distance in kilometers
 * @returns Formatted distance string
 */
export const formatDistance = (distance: number): string => {
  if (distance < 1) {
    return `${(distance * 1000).toFixed(0)} m`;
  }
  return `${distance.toFixed(1)} km`;
};