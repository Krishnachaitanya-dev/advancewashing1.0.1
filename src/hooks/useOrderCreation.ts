
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

  const createOrder = async (orderData: CreateOrderData) => {
    if (!user) {
      toast({
        title: "Authentication Error",
        description: "Please log in to place an order",
        variant: "destructive"
      });
      return { success: false };
    }

    try {
      setIsCreating(true);

      // Create booking first
      const { data: booking, error: bookingError } = await supabase
        .from('bookings')
        .insert({
          user_id: user.id,
          address_id: orderData.address_id,
          pickup_time: `${orderData.pickup_date} ${orderData.pickup_time}`,
          special_note: orderData.special_instructions,
          status: 'pending'
        })
        .select()
        .single();

      if (bookingError) {
        console.error('Error creating booking:', bookingError);
        toast({
          title: "Error",
          description: "Failed to create booking",
          variant: "destructive"
        });
        return { success: false };
      }

      // Generate order number
      const orderNumber = `AW${Date.now()}`;

      // Create order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          booking_id: booking.id,
          order_number: orderNumber,
          status: 'pending',
          estimated_price: orderData.estimated_total,
          estimated_weight: orderData.items.reduce((sum, item) => sum + item.estimated_weight, 0)
        })
        .select()
        .single();

      if (orderError) {
        console.error('Error creating order:', orderError);
        toast({
          title: "Error",
          description: "Failed to create order",
          variant: "destructive"
        });
        return { success: false };
      }

      // Create order items
      const orderItems = orderData.items.map(item => ({
        order_id: order.id,
        service_id: item.service_id,
        item_name: item.item_name,
        quantity: item.quantity,
        estimated_weight: item.estimated_weight
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) {
        console.error('Error creating order items:', itemsError);
        toast({
          title: "Error",
          description: "Failed to create order items",
          variant: "destructive"
        });
        return { success: false };
      }

      toast({
        title: "Order Placed Successfully!",
        description: `Your order ${orderNumber} has been placed`,
      });

      return { success: true, orderNumber };
    } catch (error: any) {
      console.error('Error creating order:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
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
