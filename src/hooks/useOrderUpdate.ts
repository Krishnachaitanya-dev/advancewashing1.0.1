
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface OrderUpdateData {
  status?: string;
  final_weight?: number;
  final_price?: number;
  order_items_weights?: Record<string, number>;
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
        .update({
          status: updateData.status,
          final_weight: updateData.final_weight,
          final_price: updateData.final_price
        })
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
      if (updateData.final_weight && updateData.order_items_weights) {
        console.log('Updating individual order item weights:', updateData.order_items_weights);
        
        // Update each order item with its final weight
        const updatePromises = Object.entries(updateData.order_items_weights).map(([itemId, weight]) => 
          supabase
            .from('order_items')
            .update({ final_weight: weight })
            .eq('id', itemId)
        );

        const results = await Promise.all(updatePromises);
        const hasErrors = results.some(result => result.error);
        
        if (hasErrors) {
          console.error('Some order items failed to update');
          toast({
            title: "Warning",
            description: "Order updated but some item weights may not have saved",
            variant: "destructive"
          });
        }
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
