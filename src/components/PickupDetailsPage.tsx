
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
  const {
    toast
  } = useToast();
  const location = useLocation();
  const navigate = useNavigate();
  const {
    addresses,
    isLoading: addressesLoading
  } = useSupabaseAddresses();
  const {
    createOrder,
    isCreating
  } = useOrderCreation();
  const {
    selectedServices,
    total
  } = location.state || {
    selectedServices: [],
    total: 0
  };

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
        service_id: service.id,
        // Keep as UUID string, don't convert to string
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
    return <AppLayout>
        <div className="flex items-center justify-center min-h-[200px]">
          <div className="text-blue-600 text-lg">Loading...</div>
        </div>
      </AppLayout>;
  }

  return <AppLayout>
      <div className="space-y-3 my-0 py-0 mx-0">
        {/* Address Selection - more compact */}
        <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 backdrop-blur-sm rounded-xl p-3 border border-green-300/30">
          <h3 className="text-sm font-medium text-green-700 mb-2">📍 Delivery Address</h3>
          
          {selectedAddress ? <div className="space-y-2">
              <AddressCard address={selectedAddress} onEdit={() => {}} onDelete={() => {}} onSetDefault={() => {}} showActions={false} />
              
              {addresses.length > 1 && <Button variant="outline" onClick={() => setShowAddressSelection(!showAddressSelection)} className="w-full border-green-300 text-green-700 hover:bg-green-50 flex items-center justify-between text-sm py-1.5">
                  <span>Change Address</span>
                  <ChevronDown size={14} className={`transition-transform ${showAddressSelection ? 'rotate-180' : ''}`} />
                </Button>}
            </div> : <div className="text-center py-3">
              <MapPin size={24} className="mx-auto text-green-400 mb-1" />
              <p className="text-green-600 mb-2 text-sm">No address found</p>
              <Button onClick={() => navigate('/address-management')} className="bg-green-500 hover:bg-green-600 text-white text-sm py-1.5">
                Add Address
              </Button>
            </div>}

          {/* Address Selection Dropdown - more compact */}
          {showAddressSelection && addresses.length > 1 && <div className="mt-2 space-y-2 max-h-48 overflow-y-auto">
              <p className="text-xs text-green-600 mb-1">Select a different address:</p>
              {addresses.filter(addr => addr.id !== selectedSupabaseAddress?.id).map(address => <div key={address.id} className="cursor-pointer">
                    <AddressCard address={convertSupabaseAddressToAddress(address)} onEdit={() => {}} onDelete={() => {}} onSetDefault={() => {}} showActions={false} onClick={handleAddressSelect} />
                  </div>)}
            </div>}
        </div>

        {/* Minimum Order Information Box - more compact */}
        {total < 500 && <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 backdrop-blur-sm rounded-xl p-3 border border-yellow-400/30">
            <div className="flex items-start space-x-2">
              <div className="flex-shrink-0 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center">
                <span className="text-yellow-900 text-xs font-bold">!</span>
              </div>
              <div>
                <h3 className="text-sm font-medium text-yellow-700 mb-0.5">
                  Minimum Order Information
                </h3>
                <p className="text-xs text-yellow-600">
                  Our recommended minimum order value is ₹500 🚀
                </p>
              </div>
            </div>
          </div>}

        {/* Pickup Date - more compact */}
        <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 backdrop-blur-sm rounded-xl p-3 border border-purple-300/30">
          <h3 className="text-sm font-medium text-purple-700 mb-2">📅 Select Pickup Date</h3>
          <div className="bg-white rounded-lg p-2 shadow-lg">
            <Calendar mode="single" selected={selectedDate} onSelect={setSelectedDate} disabled={date => date < new Date() || date > new Date(new Date().getTime() + 14 * 24 * 60 * 60 * 1000)} className="rounded-md border-0 w-full text-sm" />
          </div>
        </div>

        {/* Time Slots - more compact */}
        <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 backdrop-blur-sm rounded-xl p-3 border border-blue-300/30">
          <h3 className="text-sm font-medium text-blue-700 mb-2">⏰ Select Time Slot</h3>
          <div className="grid grid-cols-1 gap-2">
            {timeSlots.map(slot => <Button key={slot} type="button" className={`text-xs py-2 rounded-lg transition-all duration-200 ${selectedSlot === slot ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg transform scale-105' : 'bg-white/10 border border-blue-300 text-blue-600 hover:bg-blue-50 hover:scale-102'}`} onClick={() => setSelectedSlot(slot)}>
                {slot}
              </Button>)}
          </div>
        </div>

        {/* Special Instructions - more compact */}
        <div className="bg-gradient-to-br from-pink-500/20 to-pink-600/20 backdrop-blur-sm rounded-xl p-3 border border-pink-300/30">
          <h3 className="text-sm font-medium text-pink-700 mb-2">📝 Special Instructions (Optional)</h3>
          <Textarea placeholder="Any specific instructions for pickup? (e.g., Gate number, specific timing, etc.)" value={instructions} onChange={e => setInstructions(e.target.value)} className="resize-none bg-white/80 border-pink-300 text-pink-700 placeholder:text-pink-500 rounded-lg min-h-[80px] focus:bg-white transition-all duration-200 text-sm" />
        </div>

        {/* Order Summary - more compact */}
        <div className="bg-gradient-to-br from-orange-500/20 to-orange-600/20 backdrop-blur-sm rounded-xl p-3 border border-orange-300/30">
          <h3 className="text-sm font-medium text-orange-700 mb-2">📋 Order Summary</h3>
          <div className="space-y-2">
            {selectedServices.map((service: Service) => <div key={service.id} className="flex justify-between text-xs bg-white/80 rounded-lg p-2">
                <span className="text-orange-700">{service.name}</span>
                <span className="text-orange-600 font-medium">{service.price}</span>
              </div>)}
          </div>
        </div>

        {/* Place Order Button - more compact */}
        <div className="pb-4">
          <Button onClick={handlePlaceOrder} disabled={isCreating || !selectedAddress} className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-3 rounded-lg font-medium text-base shadow-lg transform transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed">
            {isCreating ? <div className="flex items-center justify-center">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                Placing Order...
              </div> : '🛒 Place Order'}
          </Button>
        </div>
      </div>
    </AppLayout>;
};

export default PickupDetailsPage;
