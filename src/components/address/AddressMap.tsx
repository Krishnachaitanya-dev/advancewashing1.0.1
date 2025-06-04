
import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in React-Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface AddressMapProps {
  initialPosition: { lat: number; lng: number };
  onPositionChange: (position: { lat: number; lng: number }) => void;
  onAddressChange: (address: any) => void;
}

const reverseGeocode = async (lat: number, lng: number) => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
    );
    const data = await response.json();
    
    if (data && data.address) {
      const address = data.address;
      return {
        street: `${address.house_number || ''} ${address.road || address.pedestrian || ''}`.trim(),
        city: address.city || address.town || address.village || '',
        state: address.state || '',
        pincode: address.postcode || '',
        landmark: address.amenity || address.shop || ''
      };
    }
  } catch (error) {
    console.error('Reverse geocoding failed:', error);
  }
  return null;
};

const AddressMap = ({ initialPosition, onPositionChange, onAddressChange }: AddressMapProps) => {
  const [markerPosition, setMarkerPosition] = useState<[number, number]>([
    initialPosition.lat, 
    initialPosition.lng
  ]);
  const mapRef = useRef<L.Map | null>(null);

  const handlePositionChange = async (newPosition: { lat: number; lng: number }) => {
    console.log('Position changed:', newPosition);
    setMarkerPosition([newPosition.lat, newPosition.lng]);
    onPositionChange(newPosition);
    
    try {
      const address = await reverseGeocode(newPosition.lat, newPosition.lng);
      if (address) {
        console.log('Address found:', address);
        onAddressChange(address);
      }
    } catch (error) {
      console.error('Error in reverse geocoding:', error);
    }
  };

  useEffect(() => {
    console.log('Map position updated:', initialPosition);
    setMarkerPosition([initialPosition.lat, initialPosition.lng]);
  }, [initialPosition.lat, initialPosition.lng]);

  // Handle map ready callback
  const handleMapReady = () => {
    // Use setTimeout to ensure the map is fully initialized
    setTimeout(() => {
      if (mapRef.current) {
        console.log('Map ready, adding click listener');
        mapRef.current.on('click', async (e: L.LeafletMouseEvent) => {
          const { lat, lng } = e.latlng;
          console.log('Map clicked:', { lat, lng });
          await handlePositionChange({ lat, lng });
        });
      }
    }, 100);
  };

  return (
    <div className="glass-card overflow-hidden">
      <div className="h-64 w-full">
        <MapContainer
          ref={mapRef}
          center={markerPosition}
          zoom={16}
          style={{ height: '100%', width: '100%' }}
          zoomControl={true}
          whenReady={handleMapReady}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={markerPosition} />
        </MapContainer>
      </div>
      <div className="p-3 bg-white/5">
        <p className="text-xs text-white/70 text-center">
          📍 Click on the map to set your location
        </p>
      </div>
    </div>
  );
};

export default AddressMap;
