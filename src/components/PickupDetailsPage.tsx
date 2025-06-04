
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
            className="text-white mr-3"
          >
            <ArrowLeft size={20} />
          </Button>
          <h1 className="text-xl font-semibold text-white">Pickup Details</h1>
        </div>

        {/* Pickup Date */}
        <div className="glass-card p-4">
          <h3 className="text-base font-medium text-white mb-3">Select Pickup Date</h3>
          <div className="bg-white rounded-lg p-2">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              disabled={(date) => date < new Date() || date > new Date(new Date().getTime() + 14 * 24 * 60 * 60 * 1000)}
              className="rounded-md border-0"
            />
          </div>
        </div>

        {/* Time Slots */}
        <div className="glass-card p-4">
          <h3 className="text-base font-medium text-white mb-3">Select Time Slot</h3>
          <div className="grid grid-cols-1 gap-2">
            {timeSlots.map((slot) => (
              <Button
                key={slot}
                type="button"
                variant={selectedSlot === slot ? 'default' : 'outline'}
                className={`text-sm py-3 ${
                  selectedSlot === slot 
                    ? 'bg-blue-600 text-white border-blue-600' 
                    : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
                }`}
                onClick={() => setSelectedSlot(slot)}
              >
                {slot}
              </Button>
            ))}
          </div>
        </div>

        {/* Special Instructions */}
        <div className="glass-card p-4">
          <h3 className="text-base font-medium text-white mb-3">Special Instructions (Optional)</h3>
          <Textarea
            placeholder="Any specific instructions for pickup?"
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            className="resize-none bg-white/10 border-white/20 text-white placeholder:text-white/60"
          />
        </div>

        {/* Order Summary */}
        <div className="glass-card p-4">
          <h3 className="text-base font-medium text-white mb-3">Order Summary</h3>
          <div className="space-y-2">
            {selectedServices.map((service: Service) => (
              <div key={service.id} className="flex justify-between text-sm">
                <span className="text-white/80">{service.name}</span>
                <span className="text-white font-medium">{service.price}</span>
              </div>
            ))}
            <div className="border-t border-white/20 my-2 pt-2"></div>
            <div className="flex justify-between font-semibold">
              <span className="text-white">Total</span>
              <span className="text-blue-300 text-lg">₹{total}</span>
            </div>
          </div>
        </div>

        {/* Place Order Button */}
        <div className="pb-6">
          <Button 
            onClick={handlePlaceOrder} 
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 rounded-xl font-medium text-lg"
          >
            Place Order
          </Button>
        </div>
      </div>
    </AppLayout>
  );
};

export default PickupDetailsPage;
