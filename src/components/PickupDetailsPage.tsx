import React, { useState } from 'react';
import AppLayout from './AppLayout';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, ChevronDown } from 'lucide-react';
import { useSupabaseAddresses } from '@/hooks/useSupabaseAddresses';
import { useOrderCreation } from '@/hooks/useOrderCreation';
import AddressCard from './address/AddressCard';
import { Address } from '@/types/address';

interface Service {
  id: string; // Changed from number to string to handle UUIDs
  name: string;
  price: string;
  color: string;
}

// Helper function to convert SupabaseAddress to Address
const convertSupabaseAddressToAddress = (supabaseAddr: any): Address => {
  return {
    id: supabaseAddr.id,
    doorNo: supabaseAddr.door_no,
    street: supabaseAddr.street,
    landmark: supabaseAddr.landmark,
    city: supabaseAddr.city,
    state: supabaseAddr.state,
    pincode: supabaseAddr.pincode,
    phone: supabaseAddr.phone,
    name: supabaseAddr.name,
    label: supabaseAddr.label,
    coordinates: supabaseAddr.coordinates,
    isDefault: supabaseAddr.is_default,
    createdAt: new Date(supabaseAddr.created_at),
    updatedAt: new Date(supabaseAddr.updated_at)
  };
};

const PickupDetailsPage = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedSlot, setSelectedSlot] = useState<string>('');
  const [instructions, setInstructions] = useState('');
  const [showAddressSelection, setShowAddressSelection] = useState(false);
  
  const { toast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();
  const { addresses, isLoading: addressesLoading } = useSupabaseAddresses();
  const { createOrder, isCreating } = useOrderCreation();

  const { selectedServices, total } = location.state || { selectedServices: [], total: 0 };

  // Get default address and convert to Address type
  const selectedSupabaseAddress = addresses.find(addr => addr.is_default) || addresses[0];
  const selectedAddress = selectedSupabaseAddress ? convertSupabaseAddressToAddress(selectedSupabaseAddress) : null;

  const timeSlots = ['9:00 AM - 11:00 AM', '11:00 AM - 1:00 PM', '1:00 PM - 3:00 PM', '3:00 PM - 5:00 PM', '5:00 PM - 7:00 PM'];

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      toast({
        title: "Address Required",
        description: "Please select a delivery address",
        variant: "destructive"
      });
      return;
    }

    if (!selectedDate) {
      toast({
        title: "Date Required",
        description: "Please select a pickup date",
        variant: "destructive"
      });
      return;
    }

    if (!selectedSlot) {
      toast({
        title: "Time Slot Required",
        description: "Please select a pickup time slot",
        variant: "destructive"
      });
      return;
    }

    // Prepare order data with proper service_id handling - keep as UUID string
    const orderData = {
      pickup_date: selectedDate.toISOString().split('T')[0],
      pickup_time: selectedSlot,
      special_instructions: instructions,
      address_id: selectedAddress.id,
      estimated_total: total,
      items: selectedServices.map((service: Service) => ({
        service_id: service.id, // Keep as UUID string, don't convert to string
        item_name: service.name,
        quantity: 1,
        estimated_weight: 1
      }))
    };

    console.log('Submitting order data:', orderData);
    
    const result = await createOrder(orderData);
    
    if (result.success) {
      navigate('/orders');
    }
  };

  const handleAddressSelect = (address: any) => {
    // This would update the selected address if multiple addresses were supported
    setShowAddressSelection(false);
  };

  if (addressesLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[200px]">
          <div className="text-white text-lg">Loading...</div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center mb-6">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="text-white mr-3 hover:bg-white/10">
            <ArrowLeft size={20} />
          </Button>
          <h1 className="text-xl font-semibold text-white">Pickup Details</h1>
        </div>

        {/* Address Selection */}
        <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
          <h3 className="text-base font-medium text-white mb-3">📍 Delivery Address</h3>
          
          {selectedAddress ? (
            <div className="space-y-3">
              <AddressCard 
                address={selectedAddress} 
                onEdit={() => {}} 
                onDelete={() => {}} 
                onSetDefault={() => {}}
                showActions={false}
              />
              
              {addresses.length > 1 && (
                <Button
                  variant="outline"
                  onClick={() => setShowAddressSelection(!showAddressSelection)}
                  className="w-full border-white/20 text-white hover:bg-white/10 flex items-center justify-between"
                >
                  <span>Change Address</span>
                  <ChevronDown size={16} className={`transition-transform ${showAddressSelection ? 'rotate-180' : ''}`} />
                </Button>
              )}
            </div>
          ) : (
            <div className="text-center py-4">
              <MapPin size={32} className="mx-auto text-white/40 mb-2" />
              <p className="text-white/70 mb-3">No address found</p>
              <Button
                onClick={() => navigate('/address-management')}
                className="bg-green-500 hover:bg-green-600 text-white"
              >
                Add Address
              </Button>
            </div>
          )}

          {/* Address Selection Dropdown */}
          {showAddressSelection && addresses.length > 1 && (
            <div className="mt-3 space-y-2 max-h-60 overflow-y-auto">
              <p className="text-sm text-white/70 mb-2">Select a different address:</p>
              {addresses
                .filter(addr => addr.id !== selectedSupabaseAddress?.id)
                .map(address => (
                  <div key={address.id} className="cursor-pointer">
                    <AddressCard 
                      address={convertSupabaseAddressToAddress(address)} 
                      onEdit={() => {}} 
                      onDelete={() => {}} 
                      onSetDefault={() => {}}
                      showActions={false}
                      onClick={handleAddressSelect}
                    />
                  </div>
                ))}
            </div>
          )}
        </div>

        {/* Minimum Order Information Box */}
        {total < 500 && (
          <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 backdrop-blur-sm rounded-2xl p-4 border border-yellow-400/30">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                <span className="text-yellow-900 text-sm font-bold">!</span>
              </div>
              <div>
                <h3 className="text-base font-medium text-yellow-100 mb-1">
                  Minimum Order Information
                </h3>
                <p className="text-sm text-yellow-200">
                  Our recommended minimum order value is ₹500 🚀
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Pickup Date */}
        <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
          <h3 className="text-base font-medium text-white mb-3">📅 Select Pickup Date</h3>
          <div className="bg-white rounded-xl p-3 shadow-lg">
            <Calendar 
              mode="single" 
              selected={selectedDate} 
              onSelect={setSelectedDate} 
              disabled={date => date < new Date() || date > new Date(new Date().getTime() + 14 * 24 * 60 * 60 * 1000)} 
              className="rounded-md border-0 w-full" 
            />
          </div>
        </div>

        {/* Time Slots */}
        <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
          <h3 className="text-base font-medium text-white mb-3">⏰ Select Time Slot</h3>
          <div className="grid grid-cols-1 gap-3">
            {timeSlots.map(slot => (
              <Button 
                key={slot} 
                type="button" 
                className={`text-sm py-3 rounded-xl transition-all duration-200 ${
                  selectedSlot === slot 
                    ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg transform scale-105' 
                    : 'bg-white/10 border border-white/20 text-white hover:bg-white/20 hover:scale-102'
                }`} 
                onClick={() => setSelectedSlot(slot)}
              >
                {slot}
              </Button>
            ))}
          </div>
        </div>

        {/* Special Instructions */}
        <div className="bg-gradient-to-br from-pink-500/20 to-pink-600/20 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
          <h3 className="text-base font-medium text-white mb-3">📝 Special Instructions (Optional)</h3>
          <Textarea 
            placeholder="Any specific instructions for pickup? (e.g., Gate number, specific timing, etc.)" 
            value={instructions} 
            onChange={e => setInstructions(e.target.value)} 
            className="resize-none bg-white/10 border-white/20 text-white placeholder:text-white/60 rounded-xl min-h-[100px] focus:bg-white/20 transition-all duration-200" 
          />
        </div>

        {/* Order Summary */}
        <div className="bg-gradient-to-br from-orange-500/20 to-orange-600/20 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
          <h3 className="text-base font-medium text-white mb-3">📋 Order Summary</h3>
          <div className="space-y-3">
            {selectedServices.map((service: Service) => (
              <div key={service.id} className="flex justify-between text-sm bg-white/10 rounded-lg p-3">
                <span className="text-white/90">{service.name}</span>
                <span className="text-white font-medium">{service.price}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Place Order Button */}
        <div className="pb-6">
          <Button 
            onClick={handlePlaceOrder} 
            disabled={isCreating || !selectedAddress}
            className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-4 rounded-xl font-medium text-lg shadow-lg transform transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isCreating ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                Placing Order...
              </div>
            ) : (
              '🛒 Place Order'
            )}
          </Button>
        </div>
      </div>
    </AppLayout>
  );
};

export default PickupDetailsPage;
