
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from './useAuth';

interface PersonalInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
}

export const usePersonalInformation = () => {
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchPersonalInfo = async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        // Use auth data as fallback
        setPersonalInfo({
          firstName: user.user_metadata?.name?.split(' ')[0] || '',
          lastName: user.user_metadata?.name?.split(' ').slice(1).join(' ') || '',
          email: user.email || '',
          phone: user.user_metadata?.phone || '',
          dateOfBirth: ''
        });
      } else if (profile) {
        setPersonalInfo({
          firstName: profile.first_name || user.user_metadata?.name?.split(' ')[0] || '',
          lastName: profile.last_name || user.user_metadata?.name?.split(' ').slice(1).join(' ') || '',
          email: user.email || '',
          phone: profile.phone || user.user_metadata?.phone || '',
          dateOfBirth: profile.date_of_birth || ''
        });
      }
    } catch (error: any) {
      console.error('Error fetching personal info:', error);
      toast({
        title: "Error",
        description: "Failed to load personal information",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updatePersonalInfo = async (updatedInfo: PersonalInfo) => {
    if (!user) return;

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          first_name: updatedInfo.firstName,
          last_name: updatedInfo.lastName,
          phone: updatedInfo.phone,
          date_of_birth: updatedInfo.dateOfBirth || null,
          updated_at: new Date().toISOString()
        });

      if (error) {
        console.error('Error updating profile:', error);
        toast({
          title: "Error",
          description: "Failed to update personal information",
          variant: "destructive"
        });
        throw error;
      }

      setPersonalInfo(updatedInfo);
      toast({
        title: "Success",
        description: "Personal information updated successfully",
      });
    } catch (error: any) {
      console.error('Error updating personal info:', error);
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    fetchPersonalInfo();
  }, [user]);

  return {
    personalInfo,
    setPersonalInfo,
    isLoading,
    isSaving,
    updatePersonalInfo
  };
};
