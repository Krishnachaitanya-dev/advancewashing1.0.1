
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AddressFormData } from '@/types/address';
import AddressLabelSelector from './AddressLabelSelector';
import AddressMap from './AddressMap';
import { useLocation } from '@/hooks/useLocation';

interface AddressFormProps {
  onSubmit: (data: AddressFormData) => void;
  onCancel: () => void;
  initialData?: AddressFormData;
  isLoading?: boolean;
  onCoordinatesChange?: (coords: { lat: number; lng: number }) => void;
  initialCoordinates?: { lat: number; lng: number };
}

const AddressForm: React.FC<AddressFormProps> = ({
  onSubmit,
  onCancel,
  initialData,
  isLoading = false,
  onCoordinatesChange,
  initialCoordinates
}) => {
  const [formData, setFormData] = useState<AddressFormData>({
    doorNo: '',
    street: '',
    landmark: '',
    city: '',
    state: '',
    pincode: '',
    phone: '',
    name: '',
    label: 'home',
    ...initialData
  });

  const [mapPosition, setMapPosition] = useState({ lat: 17.6868, lng: 83.2185, zoom: 12 });
  const { getCurrentLocation } = useLocation();

  useEffect(() => {
    if (initialCoordinates) {
      setMapPosition({ ...initialCoordinates, zoom: 16 });
    } else {
      getCurrentLocation().then(position => {
        if (position) {
          setMapPosition({ ...position, zoom: 16 });
        }
      });
    }
  }, [initialCoordinates]);

  const handleInputChange = (field: keyof AddressFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleMapPositionChange = (position: { lat: number; lng: number }) => {
    setMapPosition({ ...position, zoom: 16 });
    if (onCoordinatesChange) {
      onCoordinatesChange(position);
    }
  };

  const handleMapAddressChange = (address: any) => {
    if (address) {
      setFormData(prev => ({
        ...prev,
        street: address.street || prev.street,
        city: address.city || prev.city,
        state: address.state || prev.state,
        pincode: address.pincode || prev.pincode,
        landmark: address.landmark || prev.landmark
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Map Section */}
      <div>
        <Label className="text-white mb-2 block">Location</Label>
        <AddressMap
          initialPosition={mapPosition}
          onPositionChange={handleMapPositionChange}
          onAddressChange={handleMapAddressChange}
        />
      </div>

      {/* Contact Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name" className="text-white">Contact Name</Label>
          <Input
            id="name"
            type="text"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            className="bg-white/10 border-white/20 text-white placeholder-white/50"
            placeholder="Enter contact name"
          />
        </div>
        <div>
          <Label htmlFor="phone" className="text-white">Phone Number *</Label>
          <Input
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            className="bg-white/10 border-white/20 text-white placeholder-white/50"
            placeholder="Enter phone number"
            required
          />
        </div>
      </div>

      {/* Address Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="doorNo" className="text-white">Door/House Number *</Label>
          <Input
            id="doorNo"
            type="text"
            value={formData.doorNo}
            onChange={(e) => handleInputChange('doorNo', e.target.value)}
            className="bg-white/10 border-white/20 text-white placeholder-white/50"
            placeholder="Enter door/house number"
            required
          />
        </div>
        <div>
          <Label htmlFor="street" className="text-white">Street Address *</Label>
          <Input
            id="street"
            type="text"
            value={formData.street}
            onChange={(e) => handleInputChange('street', e.target.value)}
            className="bg-white/10 border-white/20 text-white placeholder-white/50"
            placeholder="Enter street address"
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="landmark" className="text-white">Landmark</Label>
        <Input
          id="landmark"
          type="text"
          value={formData.landmark}
          onChange={(e) => handleInputChange('landmark', e.target.value)}
          className="bg-white/10 border-white/20 text-white placeholder-white/50"
          placeholder="Near landmark (optional)"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="city" className="text-white">City *</Label>
          <Input
            id="city"
            type="text"
            value={formData.city}
            onChange={(e) => handleInputChange('city', e.target.value)}
            className="bg-white/10 border-white/20 text-white placeholder-white/50"
            placeholder="Enter city"
            required
          />
        </div>
        <div>
          <Label htmlFor="state" className="text-white">State *</Label>
          <Input
            id="state"
            type="text"
            value={formData.state}
            onChange={(e) => handleInputChange('state', e.target.value)}
            className="bg-white/10 border-white/20 text-white placeholder-white/50"
            placeholder="Enter state"
            required
          />
        </div>
        <div>
          <Label htmlFor="pincode" className="text-white">Pincode *</Label>
          <Input
            id="pincode"
            type="text"
            value={formData.pincode}
            onChange={(e) => handleInputChange('pincode', e.target.value)}
            className="bg-white/10 border-white/20 text-white placeholder-white/50"
            placeholder="Enter pincode"
            required
          />
        </div>
      </div>

      {/* Address Label */}
      <div>
        <Label className="text-white mb-2 block">Address Label</Label>
        <AddressLabelSelector
          value={formData.label}
          onChange={(label) => handleInputChange('label', label)}
        />
      </div>

      {/* Form Actions */}
      <div className="flex space-x-4">
        <Button
          type="submit"
          disabled={isLoading}
          className="flex-1 bg-green-500 hover:bg-green-600 text-white"
        >
          {isLoading ? 'Saving...' : 'Save Address'}
        </Button>
        <Button
          type="button"
          onClick={onCancel}
          variant="outline"
          className="flex-1 border-white/20 text-white hover:bg-white/10"
        >
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default AddressForm;
