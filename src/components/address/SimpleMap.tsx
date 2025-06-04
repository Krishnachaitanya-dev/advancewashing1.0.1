
import React, { useEffect, useRef, useState } from 'react';
import { MapPin, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SimpleMapProps {
  onAddressSelect: (address: any) => void;
  initialPosition?: { lat: number; lng: number };
}

const SimpleMap = ({ onAddressSelect, initialPosition }: SimpleMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [mapInstance, setMapInstance] = useState<any>(null);
  const [markerInstance, setMarkerInstance] = useState<any>(null);

  // Initialize map when component mounts
  useEffect(() => {
    const initMap = async () => {
      if (!mapRef.current) return;

      // Dynamically import Leaflet to avoid SSR issues
      const L = await import('leaflet');
      
      // Fix default marker icons
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
      });

      // Create map
      const defaultPos = initialPosition || { lat: 20.5937, lng: 78.9629 }; // India center
      const map = L.map(mapRef.current).setView([defaultPos.lat, defaultPos.lng], 13);

      // Add tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);

      // Add marker
      const marker = L.marker([defaultPos.lat, defaultPos.lng]).addTo(map);

      // Handle map clicks
      map.on('click', async (e: any) => {
        const { lat, lng } = e.latlng;
        marker.setLatLng([lat, lng]);
        await reverseGeocode(lat, lng);
      });

      setMapInstance(map);
      setMarkerInstance(marker);
    };

    initMap();

    // Cleanup
    return () => {
      if (mapInstance) {
        mapInstance.remove();
      }
    };
  }, []);

  const reverseGeocode = async (lat: number, lng: number) => {
    try {
      setIsLoading(true);
      console.log('Reverse geocoding for:', { lat, lng });
      
      // Use multiple geocoding services for better accuracy
      const nominatimResponse = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1&accept-language=en`
      );
      const nominatimData = await nominatimResponse.json();
      
      if (nominatimData && nominatimData.address) {
        const addr = nominatimData.address;
        
        // Try to get more accurate pincode from higher zoom level
        const detailedResponse = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=20&addressdetails=1&accept-language=en`
        );
        const detailedData = await detailedResponse.json();
        
        const address = {
          street: `${addr.house_number || ''} ${addr.road || addr.pedestrian || addr.suburb || ''}`.trim(),
          city: addr.city || addr.town || addr.village || addr.county || '',
          state: addr.state || '',
          pincode: detailedData?.address?.postcode || addr.postcode || '',
          landmark: addr.amenity || addr.shop || addr.tourism || ''
        };
        
        console.log('Address found:', address);
        onAddressSelect(address);
      }
    } catch (error) {
      console.error('Reverse geocoding failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getCurrentLocation = async () => {
    if (!navigator.geolocation || !mapInstance || !markerInstance) return;
    
    setIsLoading(true);
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          resolve,
          reject,
          {
            enableHighAccuracy: true,
            timeout: 15000,
            maximumAge: 60000 // 1 minute
          }
        );
      });

      const { latitude: lat, longitude: lng } = position.coords;
      
      // Update map view and marker
      mapInstance.setView([lat, lng], 16);
      markerInstance.setLatLng([lat, lng]);
      
      // Get address for this location
      await reverseGeocode(lat, lng);
    } catch (error) {
      console.error('Error getting location:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="glass-card overflow-hidden">
      <div className="p-3 bg-white/5 border-b border-white/10">
        <div className="flex items-center justify-between">
          <p className="text-sm text-white/70">
            📍 Click on map or use current location
          </p>
          <Button
            type="button"
            size="sm"
            onClick={getCurrentLocation}
            disabled={isLoading}
            className="bg-green-500 hover:bg-green-600 text-white text-xs"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                Locating...
              </>
            ) : (
              <>
                <MapPin className="mr-1 h-3 w-3" />
                My Location
              </>
            )}
          </Button>
        </div>
      </div>
      
      <div 
        ref={mapRef} 
        className="h-64 w-full"
        style={{ minHeight: '256px' }}
      />
      
      {isLoading && (
        <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
          <div className="bg-white/90 px-3 py-2 rounded-lg flex items-center">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            <span className="text-sm">Getting address...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default SimpleMap;
