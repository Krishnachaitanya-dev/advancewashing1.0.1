
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from './useAuth';

export interface Order {
  id: string;
  user_id: string;
  booking_id: string;
  order_number: string;
  status: string;
  estimated_weight: number | null;
  final_weight: number | null;
  estimated_price: number | null;
  final_price: number | null;
  created_at: string;
  updated_at: string;
  bookings?: {
    pickup_time: string;
    special_note: string | null;
    addresses?: {
      door_no: string;
      street: string;
      city: string;
    };
  };
  order_items?: {
    id: string;
    service_id: string;
    item_name: string | null;
    quantity: number;
    estimated_weight: number | null;
    final_weight: number | null;
    services?: {
      name: string;
      base_price_per_kg: number;
    };
  }[];
}

export const useOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user, isAdmin } = useAuth();

  const fetchOrders = async () => {
    if (!user) {
      setOrders([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      let query = supabase
        .from('orders')
        .select(`
          *,
          bookings!inner(
            pickup_time,
            special_note,
            addresses!inner(
              door_no,
              street,
              city
            )
          ),
          order_items(
            id,
            service_id,
            item_name,
            quantity,
            estimated_weight,
            services!inner(
              name,
              base_price_per_kg
            )
          )
        `)
        .order('created_at', { ascending: false });

      // If not admin, only fetch user's own orders
      if (!isAdmin) {
        query = query.eq('user_id', user.id);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching orders:', error);
        toast({
          title: "Error",
          description: "Failed to load orders",
          variant: "destructive"
        });
        return;
      }

      setOrders(data || []);
    } catch (error: any) {
      console.error('Error fetching orders:', error);
      toast({
        title: "Error",
        description: "Failed to load orders",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [user, isAdmin]);

  return {
    orders,
    loading,
    refetch: fetchOrders
  };
};
