
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from './useAuth';
import { AddressFormData } from '@/types/address';

export interface SupabaseAddress {
  id: string;
  user_id: string;
  door_no: string;
  street: string;
  landmark: string | null;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  name: string | null;
  label: string;
  coordinates: { lat: number; lng: number } | null;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export const useSupabaseAddresses = () => {
  const [addresses, setAddresses] = useState<SupabaseAddress[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchAddresses = async () => {
    if (!user) {
      setAddresses([]);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('addresses')
        .select('*')
        .eq('user_id', user.id)
        .order('is_default', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching addresses:', error);
        toast({
          title: "Error",
          description: "Failed to load addresses",
          variant: "destructive"
        });
        return;
      }

      setAddresses(data || []);
    } catch (error: any) {
      console.error('Error fetching addresses:', error);
      toast({
        title: "Error",
        description: "Failed to load addresses",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const addAddress = async (formData: AddressFormData) => {
    if (!user) return null;

    try {
      // If this is the first address, make it default
      const isFirstAddress = addresses.length === 0;

      const { data, error } = await supabase
        .from('addresses')
        .insert({
          user_id: user.id,
          door_no: formData.doorNo,
          street: formData.street,
          landmark: formData.landmark,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
          phone: formData.phone,
          name: formData.name,
          label: formData.label,
          is_default: isFirstAddress
        })
        .select()
        .single();

      if (error) {
        toast({
          title: "Error",
          description: "Failed to add address",
          variant: "destructive"
        });
        return null;
      }

      toast({
        title: "Success",
        description: "Address added successfully"
      });

      await fetchAddresses();
      return data;
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to add address",
        variant: "destructive"
      });
      return null;
    }
  };

  const updateAddress = async (id: string, updates: Partial<AddressFormData>) => {
    try {
      const { error } = await supabase
        .from('addresses')
        .update(updates)
        .eq('id', id);

      if (error) {
        toast({
          title: "Error",
          description: "Failed to update address",
          variant: "destructive"
        });
        return false;
      }

      toast({
        title: "Success",
        description: "Address updated successfully"
      });

      await fetchAddresses();
      return true;
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to update address",
        variant: "destructive"
      });
      return false;
    }
  };

  const deleteAddress = async (id: string) => {
    try {
      const { error } = await supabase
        .from('addresses')
        .delete()
        .eq('id', id);

      if (error) {
        toast({
          title: "Error",
          description: "Failed to delete address",
          variant: "destructive"
        });
        return false;
      }

      toast({
        title: "Success",
        description: "Address deleted successfully"
      });

      await fetchAddresses();
      return true;
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to delete address",
        variant: "destructive"
      });
      return false;
    }
  };

  const setDefaultAddress = async (id: string) => {
    try {
      // First, remove default from all addresses
      await supabase
        .from('addresses')
        .update({ is_default: false })
        .eq('user_id', user?.id);

      // Then set the selected address as default
      const { error } = await supabase
        .from('addresses')
        .update({ is_default: true })
        .eq('id', id);

      if (error) {
        toast({
          title: "Error",
          description: "Failed to set default address",
          variant: "destructive"
        });
        return false;
      }

      toast({
        title: "Success",
        description: "Default address updated"
      });

      await fetchAddresses();
      return true;
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to set default address",
        variant: "destructive"
      });
      return false;
    }
  };

  const getDefaultAddress = () => {
    return addresses.find(addr => addr.is_default) || addresses[0] || null;
  };

  useEffect(() => {
    fetchAddresses();
  }, [user]);

  return {
    addresses,
    loading,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
    getDefaultAddress,
    refetch: fetchAddresses
  };
};
