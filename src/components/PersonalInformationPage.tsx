
import React, { useState } from 'react';
import AppLayout from './AppLayout';
import { Button } from '@/components/ui/button';
import { ArrowLeft, User, Mail, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import { usePersonalInformation } from '@/hooks/usePersonalInformation';

const PersonalInformationPage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const { personalInfo, setPersonalInfo, isLoading, isSaving, updatePersonalInfo } = usePersonalInformation();

  const handleSave = async () => {
    try {
      await updatePersonalInfo(personalInfo);
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving personal info:', error);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setPersonalInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[200px]">
          <div className="text-white text-lg">Loading...</div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="mb-6 flex items-center">
        <Link to="/profile" className="mr-4 text-white">
          <ArrowLeft size={24} />
        </Link>
        <h1 className="text-2xl font-bold text-white">Personal Information</h1>
      </div>

      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className="w-16 h-16 rounded-full bg-blue-900/60 flex items-center justify-center mr-4">
              <User className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">{personalInfo.firstName} {personalInfo.lastName}</h2>
              <p className="text-white/70">Member since 2023</p>
            </div>
          </div>
          <Button 
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            disabled={isSaving}
            className="bg-blue-900 hover:bg-blue-800 text-white"
          >
            {isSaving ? 'Saving...' : (isEditing ? 'Save' : 'Edit')}
          </Button>
        </div>

        <div className="space-y-4">
          <div className="flex items-center p-4 bg-white/5 rounded-lg">
            <User className="w-5 h-5 text-white/70 mr-3" />
            <div className="flex-1">
              <label className="text-white/70 text-sm">First Name</label>
              {isEditing ? (
                <input
                  type="text"
                  value={personalInfo.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  className="w-full bg-transparent text-white border-b border-white/20 focus:border-white outline-none"
                />
              ) : (
                <p className="text-white">{personalInfo.firstName}</p>
              )}
            </div>
          </div>

          <div className="flex items-center p-4 bg-white/5 rounded-lg">
            <User className="w-5 h-5 text-white/70 mr-3" />
            <div className="flex-1">
              <label className="text-white/70 text-sm">Last Name</label>
              {isEditing ? (
                <input
                  type="text"
                  value={personalInfo.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  className="w-full bg-transparent text-white border-b border-white/20 focus:border-white outline-none"
                />
              ) : (
                <p className="text-white">{personalInfo.lastName}</p>
              )}
            </div>
          </div>

          <div className="flex items-center p-4 bg-white/5 rounded-lg">
            <Mail className="w-5 h-5 text-white/70 mr-3" />
            <div className="flex-1">
              <label className="text-white/70 text-sm">Email</label>
              <p className="text-white">{personalInfo.email}</p>
              <p className="text-white/50 text-xs mt-1">Email cannot be changed</p>
            </div>
          </div>

          <div className="flex items-center p-4 bg-white/5 rounded-lg">
            <Phone className="w-5 h-5 text-white/70 mr-3" />
            <div className="flex-1">
              <label className="text-white/70 text-sm">Phone</label>
              {isEditing ? (
                <input
                  type="tel"
                  value={personalInfo.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="w-full bg-transparent text-white border-b border-white/20 focus:border-white outline-none"
                />
              ) : (
                <p className="text-white">{personalInfo.phone}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default PersonalInformationPage;
