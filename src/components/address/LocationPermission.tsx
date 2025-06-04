
import React from 'react';
import { Button } from '@/components/ui/button';
import { MapPin, AlertCircle, Loader2 } from 'lucide-react';
import { useLocation } from '@/hooks/useLocation';

interface LocationPermissionProps {
  onLocationGranted: (position: { lat: number; lng: number }) => void;
}

const LocationPermission = ({ onLocationGranted }: LocationPermissionProps) => {
  const {
    permissionState,
    currentPosition,
    isLoading,
    error,
    requestPermissions,
    getCurrentLocation
  } = useLocation();

  const handleRequestLocation = async () => {
    if (permissionState.status === 'granted') {
      const position = await getCurrentLocation();
      if (position) {
        onLocationGranted({ lat: position.lat, lng: position.lng });
      }
    } else if (permissionState.canRequest) {
      const granted = await requestPermissions();
      if (granted) {
        const position = await getCurrentLocation();
        if (position) {
          onLocationGranted({ lat: position.lat, lng: position.lng });
        }
      }
    }
  };

  if (error) {
    return (
      <div className="glass-card p-6 text-center">
        <AlertCircle className="mx-auto text-red-400 mb-4" size={48} />
        <h3 className="text-lg font-medium text-white mb-2">Location Error</h3>
        <p className="text-white/70 mb-4">{error}</p>
        <Button
          onClick={handleRequestLocation}
          className="bg-green-500 hover:bg-green-600 text-white"
        >
          Try Again
        </Button>
      </div>
    );
  }

  if (permissionState.status === 'denied') {
    return (
      <div className="glass-card p-6 text-center">
        <MapPin className="mx-auto text-white/40 mb-4" size={48} />
        <h3 className="text-lg font-medium text-white mb-2">Location Access Denied</h3>
        <p className="text-white/70 mb-4">
          Please enable location access in your browser settings to automatically fill your address.
        </p>
      </div>
    );
  }

  return (
    <div className="glass-card p-6 text-center">
      <MapPin className="mx-auto text-green-400 mb-4" size={48} />
      <h3 className="text-lg font-medium text-white mb-2">Use Your Location</h3>
      <p className="text-white/70 mb-4">
        Allow location access to automatically detect and fill your address details.
      </p>
      <Button
        onClick={handleRequestLocation}
        disabled={isLoading}
        className="bg-green-500 hover:bg-green-600 text-white"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Getting Location...
          </>
        ) : (
          <>
            <MapPin className="mr-2 h-4 w-4" />
            Use My Location
          </>
        )}
      </Button>
    </div>
  );
};

export default LocationPermission;
