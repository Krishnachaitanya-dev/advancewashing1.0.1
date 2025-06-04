import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AddressLabelSelector from './AddressLabelSelector';
import SimpleMap from './SimpleMap';
import { AddressFormData, Address } from '@/types/address';
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
const AddressForm = ({
  onSubmit,
  onCancel,
  initialData,
  isLoading
}: AddressFormProps) => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: {
      errors
    }
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
  const handleMapAddressSelect = (addressData: any) => {
    if (addressData.street) setValue('street', addressData.street);
    if (addressData.city) setValue('city', addressData.city);
    if (addressData.state) setValue('state', addressData.state);
    if (addressData.pincode) setValue('pincode', addressData.pincode);
    if (addressData.landmark) setValue('landmark', addressData.landmark);
  };
  return <div className="space-y-6">
      {/* Interactive Map */}
      <SimpleMap onAddressSelect={handleMapAddressSelect} />

      {/* Address Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Door/Flat Number */}
        <div className="space-y-2">
          <Label htmlFor="doorNo" className="text-white">Door/Flat Number *</Label>
          <Input id="doorNo" {...register('doorNo')} placeholder="e.g., 101, A-23" className="bg-white/10 border-white/20 text-white placeholder:text-white/60" />
          {errors.doorNo && <p className="text-red-400 text-sm">{errors.doorNo.message}</p>}
        </div>

        {/* Street/Area */}
        <div className="space-y-2">
          <Label htmlFor="street" className="text-white">Street/Area *</Label>
          <Textarea id="street" {...register('street')} placeholder="Complete street address" className="bg-white/10 border-white/20 text-white placeholder:text-white/60 resize-none" rows={2} />
          {errors.street && <p className="text-red-400 text-sm">{errors.street.message}</p>}
        </div>

        {/* Landmark */}
        <div className="space-y-2">
          <Label htmlFor="landmark" className="text-white">Landmark (Optional)</Label>
          <Input id="landmark" {...register('landmark')} placeholder="e.g., Near Metro Station" className="bg-white/10 border-white/20 text-white placeholder:text-white/60" />
        </div>

        {/* City, State, Pincode */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label htmlFor="city" className="text-white">City *</Label>
            <Input id="city" {...register('city')} placeholder="City" className="bg-white/10 border-white/20 text-white placeholder:text-white/60" />
            {errors.city && <p className="text-red-400 text-sm">{errors.city.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="state" className="text-white">State *</Label>
            <Input id="state" {...register('state')} placeholder="State" className="bg-white/10 border-white/20 text-white placeholder:text-white/60" />
            {errors.state && <p className="text-red-400 text-sm">{errors.state.message}</p>}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="pincode" className="text-white">Pincode *</Label>
          <Input id="pincode" {...register('pincode')} placeholder="530012" maxLength={6} className="bg-white/10 border-white/20 text-white placeholder:text-white/60" />
          {errors.pincode && <p className="text-red-400 text-sm">{errors.pincode.message}</p>}
        </div>

        {/* Phone Number */}
        <div className="space-y-2">
          <Label htmlFor="phone" className="text-white">Phone Number *</Label>
          <Input id="phone" {...register('phone')} placeholder="9876543210" maxLength={10} className="bg-white/10 border-white/20 text-white placeholder:text-white/60" />
          {errors.phone && <p className="text-red-400 text-sm">{errors.phone.message}</p>}
        </div>

        {/* Name */}
        <div className="space-y-2">
          <Label htmlFor="name" className="text-white">Contact Name (Optional)</Label>
          <Input id="name" {...register('name')} placeholder="John Doe" className="bg-white/10 border-white/20 text-white placeholder:text-white/60" />
        </div>

        {/* Address Label */}
        <AddressLabelSelector selectedLabel={selectedLabel} onLabelChange={label => setValue('label', label)} />

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading} className="flex-1 border-white/20 hover:bg-white/10 text-zinc-950">
            Cancel
          </Button>
          <Button type="submit" className="flex-1 bg-green-500 hover:bg-green-600 text-white" disabled={isLoading}>
            {isLoading ? 'Saving...' : initialData ? 'Update Address' : 'Save Address'}
          </Button>
        </div>
      </form>
    </div>;
};
export default AddressForm;