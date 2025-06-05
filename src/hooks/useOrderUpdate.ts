
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

      const { error } = await supabase
        .from('orders')
        .update(updateData)
        .eq('id', orderId);

      if (error) {
        console.error('Error updating order:', error);
        toast({
          title: "Error",
          description: "Failed to update order",
          variant: "destructive"
        });
        return false;
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
