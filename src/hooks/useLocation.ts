
import { useState, useEffect } from 'react';
import { Geolocation } from '@capacitor/geolocation';
import { LocationPermissionState, MapPosition } from '@/types/address';

export const useLocation = () => {
  const [permissionState, setPermissionState] = useState<LocationPermissionState>({
    status: 'unknown',
    canRequest: true
  });
  const [currentPosition, setCurrentPosition] = useState<MapPosition | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkPermissions = async () => {
    try {
      const permissions = await Geolocation.checkPermissions();
      setPermissionState({
        status: permissions.location as LocationPermissionState['status'],
        canRequest: permissions.location !== 'denied'
      });
      return permissions.location;
    } catch (err) {
      console.error('Error checking permissions:', err);
      setError('Failed to check location permissions');
      return 'unknown';
    }
  };

  const requestPermissions = async () => {
    try {
      setIsLoading(true);
      const permissions = await Geolocation.requestPermissions();
      setPermissionState({
        status: permissions.location as LocationPermissionState['status'],
        canRequest: permissions.location !== 'denied'
      });
      return permissions.location === 'granted';
    } catch (err) {
      console.error('Error requesting permissions:', err);
      setError('Failed to request location permissions');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const getCurrentLocation = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const position = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 10000
      });

      const newPosition: MapPosition = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
        zoom: 16
      };

      setCurrentPosition(newPosition);
      return newPosition;
    } catch (err) {
      console.error('Error getting location:', err);
      setError('Failed to get current location');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkPermissions();
  }, []);

  return {
    permissionState,
    currentPosition,
    isLoading,
    error,
    checkPermissions,
    requestPermissions,
    getCurrentLocation
  };
};
