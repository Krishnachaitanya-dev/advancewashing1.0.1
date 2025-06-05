
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from './useAuth';

interface OrderItem {
  service_id: string;
  item_name: string;
  quantity: number;
  estimated_weight: number;
}

interface CreateOrderData {
  pickup_date: string;
  pickup_time: string;
  special_instructions?: string;
  address_id: string;
  items: OrderItem[];
  estimated_total: number;
}

export const useOrderCreation = () => {
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  // Helper function to convert time slot to 24-hour format
  const convertTimeSlotToTime = (timeSlot: string) => {
    const startTime = timeSlot.split(' - ')[0];
    
    // Convert to 24-hour format
    const [time, period] = startTime.split(' ');
    const [hours, minutes] = time.split(':');
    let hour24 = parseInt(hours);
    
    if (period === 'PM' && hour24 !== 12) {
      hour24 += 12;
    } else if (period === 'AM' && hour24 === 12) {
      hour24 = 0;
    }
    
    return `${hour24.toString().padStart(2, '0')}:${minutes}:00`;
  };

  // Helper function to create proper timestamp for database
  const createPickupTimestamp = (date: string, timeSlot: string) => {
    const time = convertTimeSlotToTime(timeSlot);
    return `${date}T${time}`;
  };

  const createOrder = async (orderData: CreateOrderData) => {
    if (!user) {
      toast({
        title: "Authentication Error",
        description: "Please log in to place an order",
        variant: "destructive"
      });
      return { success: false };
    }

    console.log('Creating order with data:', orderData);

    try {
      setIsCreating(true);

      // Validate address exists
      const { data: addressCheck, error: addressError } = await supabase
        .from('addresses')
        .select('id')
        .eq('id', orderData.address_id)
        .eq('user_id', user.id)
        .single();

      if (addressError || !addressCheck) {
        console.error('Address validation error:', addressError);
        toast({
          title: "Address Error",
          description: "Selected address is not valid",
          variant: "destructive"
        });
        return { success: false };
      }

      // Create proper pickup timestamp
      const pickupTimestamp = createPickupTimestamp(orderData.pickup_date, orderData.pickup_time);
      console.log('Pickup timestamp:', pickupTimestamp);

      // Create booking with correct status value
      const bookingData = {
        user_id: user.id,
        address_id: orderData.address_id,
        pickup_time: pickupTimestamp,
        special_note: orderData.special_instructions || null,
        status: 'confirmed' // Using 'confirmed' instead of 'pending'
      };

      console.log('Creating booking with data:', bookingData);

      const { data: booking, error: bookingError } = await supabase
        .from('bookings')
        .insert(bookingData)
        .select()
        .single();

      if (bookingError) {
        console.error('Error creating booking:', bookingError);
        toast({
          title: "Booking Error",
          description: `Failed to create booking: ${bookingError.message}`,
          variant: "destructive"
        });
        return { success: false };
      }

      console.log('Booking created successfully:', booking);

      // Generate order number
      const orderNumber = `AW${Date.now()}`;

      // Create order with correct status
      const orderDataToInsert = {
        user_id: user.id,
        booking_id: booking.id,
        order_number: orderNumber,
        status: 'confirmed', // Using 'confirmed' instead of 'pending'
        estimated_price: orderData.estimated_total,
        estimated_weight: orderData.items.reduce((sum, item) => sum + item.estimated_weight, 0)
      };

      console.log('Creating order with data:', orderDataToInsert);

      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert(orderDataToInsert)
        .select()
        .single();

      if (orderError) {
        console.error('Error creating order:', orderError);
        toast({
          title: "Order Error",
          description: `Failed to create order: ${orderError.message}`,
          variant: "destructive"
        });
        return { success: false };
      }

      console.log('Order created successfully:', order);

      // Create order items with proper service_id validation
      const orderItems = orderData.items.map(item => {
        // Ensure service_id is valid - if invalid, use a default service id of '1'
        let validServiceId = item.service_id;
        if (!validServiceId || validServiceId === 'NaN' || validServiceId === 'undefined') {
          validServiceId = '1'; // Default service id
        }

        return {
          order_id: order.id,
          service_id: validServiceId,
          item_name: item.item_name,
          quantity: item.quantity,
          estimated_weight: item.estimated_weight
        };
      });

      console.log('Creating order items:', orderItems);

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) {
        console.error('Error creating order items:', itemsError);
        toast({
          title: "Order Items Error",
          description: `Failed to create order items: ${itemsError.message}`,
          variant: "destructive"
        });
        return { success: false };
      }

      console.log('Order items created successfully');

      toast({
        title: "Order Placed Successfully!",
        description: `Your order ${orderNumber} has been placed`,
      });

      return { success: true, orderNumber };
    } catch (error: any) {
      console.error('Error creating order:', error);
      toast({
        title: "Error",
        description: `An unexpected error occurred: ${error.message}`,
        variant: "destructive"
      });
      return { success: false };
    } finally {
      setIsCreating(false);
    }
  };

  return {
    createOrder,
    isCreating
  };
};
