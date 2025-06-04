
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AddressLabelSelector from './AddressLabelSelector';
import LocationPermission from './LocationPermission';
import AddressMap from './AddressMap';
import { AddressFormData, Address } from '@/types/address';
import { MapPin } from 'lucide-react';

const addressSchema = z.object({
  doorNo: z.string().min(1, 'Door/Flat number is required'),
  street: z.string().min(1, 'Street/Area is required'),
  landmark: z.string().optional(),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  pincode: z.string().regex(/^\d{6}$/, 'Enter valid 6-digit pincode'),
  phone: z.string().regex(/^\d{10}$/, 'Enter valid 10-digit phone number'),
  name: z.string().optional(),
  label: z.enum(['home', 'work', 'other'])
});

interface AddressFormProps {
  onSubmit: (data: AddressFormData) => void;
  onCancel: () => void;
  initialData?: Address;
  isLoading?: boolean;
}

const AddressForm = ({ onSubmit, onCancel, initialData, isLoading }: AddressFormProps) => {
  const [showMap, setShowMap] = useState(false);
  const [mapPosition, setMapPosition] = useState({ lat: 28.6139, lng: 77.2090 }); // Default to Delhi
  
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors }
  } = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: initialData || {
      doorNo: '',
      street: '',
      landmark: '',
      city: '',
      state: '',
      pincode: '',
      phone: '',
      name: '',
      label: 'home'
    }
  });

  const selectedLabel = watch('label');

  const handleLocationGranted = (position: { lat: number; lng: number }) => {
    setMapPosition(position);
    setShowMap(true);
    // Trigger reverse geocoding
    reverseGeocode(position.lat, position.lng);
  };

  const reverseGeocode = async (lat: number, lng: number) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
      );
      const data = await response.json();
      
      if (data && data.address) {
        const address = data.address;
        
        // Auto-fill the form fields
        setValue('street', `${address.house_number || ''} ${address.road || address.pedestrian || ''}`.trim());
        setValue('city', address.city || address.town || address.village || '');
        setValue('state', address.state || '');
        setValue('pincode', address.postcode || '');
        if (address.amenity || address.shop) {
          setValue('landmark', address.amenity || address.shop);
        }
      }
    } catch (error) {
      console.error('Reverse geocoding failed:', error);
    }
  };

  const handleAddressChange = (addressData: any) => {
    if (addressData.street) setValue('street', addressData.street);
    if (addressData.city) setValue('city', addressData.city);
    if (addressData.state) setValue('state', addressData.state);
    if (addressData.pincode) setValue('pincode', addressData.pincode);
    if (addressData.landmark) setValue('landmark', addressData.landmark);
  };

  const handleMapPositionChange = (position: { lat: number; lng: number }) => {
    setMapPosition(position);
  };

  return (
    <div className="space-y-6">
      {/* Location Permission / Map Section */}
      {!showMap ? (
        <LocationPermission onLocationGranted={handleLocationGranted} />
      ) : (
        <AddressMap
          initialPosition={mapPosition}
          onPositionChange={handleMapPositionChange}
          onAddressChange={handleAddressChange}
        />
      )}

      {/* Manual Address Toggle */}
      {!showMap && (
        <div className="text-center">
          <Button
            type="button"
            variant="outline"
            onClick={() => setShowMap(true)}
            className="border-white/20 text-white hover:bg-white/10"
          >
            <MapPin className="mr-2 h-4 w-4" />
            Enter Address Manually
          </Button>
        </div>
      )}

      {/* Address Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Door/Flat Number */}
        <div className="space-y-2">
          <Label htmlFor="doorNo" className="text-white">Door/Flat Number *</Label>
          <Input
            id="doorNo"
            {...register('doorNo')}
            placeholder="e.g., 101, A-23"
            className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
          />
          {errors.doorNo && (
            <p className="text-red-400 text-sm">{errors.doorNo.message}</p>
          )}
        </div>

        {/* Street/Area */}
        <div className="space-y-2">
          <Label htmlFor="street" className="text-white">Street/Area *</Label>
          <Textarea
            id="street"
            {...register('street')}
            placeholder="Complete street address"
            className="bg-white/10 border-white/20 text-white placeholder:text-white/60 resize-none"
            rows={2}
          />
          {errors.street && (
            <p className="text-red-400 text-sm">{errors.street.message}</p>
          )}
        </div>

        {/* Landmark */}
        <div className="space-y-2">
          <Label htmlFor="landmark" className="text-white">Landmark (Optional)</Label>
          <Input
            id="landmark"
            {...register('landmark')}
            placeholder="e.g., Near Metro Station"
            className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
          />
        </div>

        {/* City, State, Pincode */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label htmlFor="city" className="text-white">City *</Label>
            <Input
              id="city"
              {...register('city')}
              placeholder="City"
              className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
            />
            {errors.city && (
              <p className="text-red-400 text-sm">{errors.city.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="state" className="text-white">State *</Label>
            <Input
              id="state"
              {...register('state')}
              placeholder="State"
              className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
            />
            {errors.state && (
              <p className="text-red-400 text-sm">{errors.state.message}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="pincode" className="text-white">Pincode *</Label>
          <Input
            id="pincode"
            {...register('pincode')}
            placeholder="123456"
            maxLength={6}
            className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
          />
          {errors.pincode && (
            <p className="text-red-400 text-sm">{errors.pincode.message}</p>
          )}
        </div>

        {/* Phone Number */}
        <div className="space-y-2">
          <Label htmlFor="phone" className="text-white">Phone Number *</Label>
          <Input
            id="phone"
            {...register('phone')}
            placeholder="9876543210"
            maxLength={10}
            className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
          />
          {errors.phone && (
            <p className="text-red-400 text-sm">{errors.phone.message}</p>
          )}
        </div>

        {/* Name */}
        <div className="space-y-2">
          <Label htmlFor="name" className="text-white">Contact Name (Optional)</Label>
          <Input
            id="name"
            {...register('name')}
            placeholder="John Doe"
            className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
          />
        </div>

        {/* Address Label */}
        <AddressLabelSelector
          selectedLabel={selectedLabel}
          onLabelChange={(label) => setValue('label', label)}
        />

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="flex-1 border-white/20 text-white hover:bg-white/10"
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="flex-1 bg-green-500 hover:bg-green-600 text-white"
            disabled={isLoading}
          >
            {isLoading ? 'Saving...' : initialData ? 'Update Address' : 'Save Address'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddressForm;
