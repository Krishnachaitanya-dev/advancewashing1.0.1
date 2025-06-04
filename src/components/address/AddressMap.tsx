
import React, { useEffect, useRef, useState } from 'react';
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

// Simple marker component that handles drag events
const DraggableMarker = ({ position, onPositionChange }: { 
  position: [number, number]; 
  onPositionChange: (pos: { lat: number; lng: number }) => void; 
}) => {
  const markerRef = useRef<any>(null);

  const eventHandlers = {
    dragend() {
      const marker = markerRef.current;
      if (marker != null) {
        const newPos = marker.getLatLng();
        onPositionChange({ lat: newPos.lat, lng: newPos.lng });
      }
    },
  };

  return (
    <Marker
      draggable={true}
      eventHandlers={eventHandlers}
      position={position}
      ref={markerRef}
    />
  );
};

const AddressMap = ({ initialPosition, onPositionChange, onAddressChange }: AddressMapProps) => {
  const [mapPosition, setMapPosition] = useState<[number, number]>([initialPosition.lat, initialPosition.lng]);

  const handlePositionChange = async (newPosition: { lat: number; lng: number }) => {
    console.log('Position changed:', newPosition);
    setMapPosition([newPosition.lat, newPosition.lng]);
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
    setMapPosition([initialPosition.lat, initialPosition.lng]);
  }, [initialPosition.lat, initialPosition.lng]);

  return (
    <div className="glass-card overflow-hidden">
      <div className="h-64 w-full">
        <MapContainer
          center={mapPosition}
          zoom={16}
          style={{ height: '100%', width: '100%' }}
          zoomControl={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <DraggableMarker 
            position={mapPosition} 
            onPositionChange={handlePositionChange}
          />
        </MapContainer>
      </div>
      <div className="p-3 bg-white/5">
        <p className="text-xs text-white/70 text-center">
          📍 Drag the pin to adjust your location
        </p>
      </div>
    </div>
  );
};

export default AddressMap;
