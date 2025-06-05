
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
      console.log('Fetching profile for user:', user.id);
      
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      console.log('Profile data:', profile, 'Error:', error);

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        console.error('Error fetching profile:', error);
      }

      // Always try to populate from available data
      const authName = user.user_metadata?.name || user.user_metadata?.full_name || '';
      const profileName = profile?.name || '';
      const finalName = profileName || authName;
      
      const nameParts = finalName.split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      setPersonalInfo({
        firstName,
        lastName,
        email: user.email || '',
        phone: profile?.phone || user.user_metadata?.phone || '',
        dateOfBirth: profile?.date_of_birth || ''
      });

      console.log('Set personal info:', {
        firstName,
        lastName,
        email: user.email,
        phone: profile?.phone || user.user_metadata?.phone,
        profileName,
        authName
      });

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
      const fullName = `${updatedInfo.firstName} ${updatedInfo.lastName}`.trim();
      
      console.log('Updating profile with:', {
        id: user.id,
        name: fullName,
        phone: updatedInfo.phone,
        date_of_birth: updatedInfo.dateOfBirth || null
      });
      
      const { data, error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          email: user.email || '',
          name: fullName,
          phone: updatedInfo.phone,
          date_of_birth: updatedInfo.dateOfBirth || null,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'id'
        });

      console.log('Update result:', data, 'Error:', error);

      if (error) {
        console.error('Error updating profile:', error);
        toast({
          title: "Error",
          description: `Failed to update personal information: ${error.message}`,
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
