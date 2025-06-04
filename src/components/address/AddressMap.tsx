
import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
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

const DraggableMarker = ({ position, onPositionChange, onAddressChange }: any) => {
  const [markerPosition, setMarkerPosition] = useState(position);
  const markerRef = useRef<any>(null);

  const eventHandlers = {
    dragend() {
      const marker = markerRef.current;
      if (marker != null) {
        const newPos = marker.getLatLng();
        setMarkerPosition(newPos);
        onPositionChange(newPos);
        reverseGeocode(newPos.lat, newPos.lng);
      }
    },
  };

  const reverseGeocode = async (lat: number, lng: number) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
      );
      const data = await response.json();
      
      if (data && data.address) {
        const address = data.address;
        onAddressChange({
          street: `${address.house_number || ''} ${address.road || address.pedestrian || ''}`.trim(),
          city: address.city || address.town || address.village || '',
          state: address.state || '',
          pincode: address.postcode || '',
          landmark: address.amenity || address.shop || ''
        });
      }
    } catch (error) {
      console.error('Reverse geocoding failed:', error);
    }
  };

  useEffect(() => {
    setMarkerPosition(position);
  }, [position]);

  return (
    <Marker
      draggable={true}
      eventHandlers={eventHandlers}
      position={markerPosition}
      ref={markerRef}
    />
  );
};

const MapClickHandler = ({ onPositionChange, onAddressChange }: any) => {
  useMapEvents({
    click(e) {
      onPositionChange(e.latlng);
      // Reverse geocode on click as well
      reverseGeocode(e.latlng.lat, e.latlng.lng);
    },
  });

  const reverseGeocode = async (lat: number, lng: number) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
      );
      const data = await response.json();
      
      if (data && data.address) {
        const address = data.address;
        onAddressChange({
          street: `${address.house_number || ''} ${address.road || address.pedestrian || ''}`.trim(),
          city: address.city || address.town || address.village || '',
          state: address.state || '',
          pincode: address.postcode || '',
          landmark: address.amenity || address.shop || ''
        });
      }
    } catch (error) {
      console.error('Reverse geocoding failed:', error);
    }
  };

  return null;
};

const AddressMap = ({ initialPosition, onPositionChange, onAddressChange }: AddressMapProps) => {
  const [mapPosition, setMapPosition] = useState(initialPosition);

  const handlePositionChange = (newPosition: { lat: number; lng: number }) => {
    setMapPosition(newPosition);
    onPositionChange(newPosition);
  };

  useEffect(() => {
    setMapPosition(initialPosition);
  }, [initialPosition]);

  return (
    <div className="glass-card overflow-hidden">
      <div className="h-64 w-full">
        <MapContainer
          center={[mapPosition.lat, mapPosition.lng]}
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
            onAddressChange={onAddressChange}
          />
          <MapClickHandler
            onPositionChange={handlePositionChange}
            onAddressChange={onAddressChange}
          />
        </MapContainer>
      </div>
      <div className="p-3 bg-white/5">
        <p className="text-xs text-white/70 text-center">
          📍 Drag the pin or tap on the map to adjust your location
        </p>
      </div>
    </div>
  );
};

export default AddressMap;
