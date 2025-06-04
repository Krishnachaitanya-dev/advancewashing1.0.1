
import React, { useState } from 'react';
import AppLayout from './AppLayout';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

interface Service {
  id: number;
  name: string;
  price: string;
  color: string;
  icon: any;
}

const PickupDetailsPage = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedSlot, setSelectedSlot] = useState<string>('');
  const [instructions, setInstructions] = useState('');
  const { toast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();
  
  const { selectedServices, total } = location.state || { selectedServices: [], total: 0 };

  const timeSlots = [
    '9:00 AM - 11:00 AM',
    '11:00 AM - 1:00 PM',
    '1:00 PM - 3:00 PM',
    '3:00 PM - 5:00 PM',
    '5:00 PM - 7:00 PM'
  ];

  const handlePlaceOrder = () => {
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

    toast({
      title: "Order Placed Successfully!",
      description: `Your pickup is scheduled for ${selectedDate.toDateString()} between ${selectedSlot}`
    });

    navigate('/orders');
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="text-white mr-3 hover:bg-white/10"
          >
            <ArrowLeft size={20} />
          </Button>
          <h1 className="text-xl font-semibold text-white">Pickup Details</h1>
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
                  Our recommended minimum order value is ₹500. 
                  You can still proceed with your order.
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
              disabled={(date) => date < new Date() || date > new Date(new Date().getTime() + 14 * 24 * 60 * 60 * 1000)}
              className="rounded-md border-0 w-full"
            />
          </div>
        </div>

        {/* Time Slots */}
        <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
          <h3 className="text-base font-medium text-white mb-3">⏰ Select Time Slot</h3>
          <div className="grid grid-cols-1 gap-3">
            {timeSlots.map((slot) => (
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
            onChange={(e) => setInstructions(e.target.value)}
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
            <div className="border-t border-white/20 my-3 pt-3"></div>
            <div className="flex justify-between font-semibold bg-white/10 rounded-lg p-3">
              <span className="text-white">Total Amount</span>
              <span className="text-green-300 text-lg">₹{total}</span>
            </div>
          </div>
        </div>

        {/* Place Order Button */}
        <div className="pb-6">
          <Button 
            onClick={handlePlaceOrder} 
            className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-4 rounded-xl font-medium text-lg shadow-lg transform transition-all duration-200 hover:scale-105"
          >
            🛒 Place Order
          </Button>
        </div>
      </div>
    </AppLayout>
  );
};

export default PickupDetailsPage;
