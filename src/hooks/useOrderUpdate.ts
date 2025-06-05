
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface OrderUpdateData {
  status?: string;
  final_weight?: number;
  final_price?: number;
}

export const useOrderUpdate = () => {
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();

  const updateOrder = async (orderId: string, updateData: OrderUpdateData) => {
    try {
      setIsUpdating(true);

      // Update the main order
      const { error: orderError } = await supabase
        .from('orders')
        .update(updateData)
        .eq('id', orderId);

      if (orderError) {
        console.error('Error updating order:', orderError);
        toast({
          title: "Error",
          description: "Failed to update order",
          variant: "destructive"
        });
        return false;
      }

      // If we're updating weights, also update the individual order items
      if (updateData.final_weight) {
        console.log('Order updated with final weight:', updateData.final_weight);
        console.log('Order updated with final price:', updateData.final_price);
      }

      toast({
        title: "Success",
        description: "Order updated successfully",
      });
      return true;
    } catch (error: any) {
      console.error('Error updating order:', error);
      toast({
        title: "Error",
        description: "Failed to update order",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    updateOrder,
    isUpdating
  };
};
