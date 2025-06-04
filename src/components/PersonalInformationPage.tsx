
import React, { useState } from 'react';
import AppLayout from './AppLayout';
import { Button } from '@/components/ui/button';
import { ArrowLeft, User, Mail, Phone, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

const PersonalInformationPage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [userInfo, setUserInfo] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+91 9876543210',
    dateOfBirth: '1990-01-15'
  });

  const handleSave = () => {
    // Here you would typically save to backend
    console.log('Saving user info:', userInfo);
    setIsEditing(false);
  };

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
              <h2 className="text-xl font-bold text-white">{userInfo.firstName} {userInfo.lastName}</h2>
              <p className="text-white/70">Member since 2023</p>
            </div>
          </div>
          <Button 
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            className="bg-blue-900 hover:bg-blue-800 text-white"
          >
            {isEditing ? 'Save' : 'Edit'}
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
                  value={userInfo.firstName}
                  onChange={(e) => setUserInfo({...userInfo, firstName: e.target.value})}
                  className="w-full bg-transparent text-white border-b border-white/20 focus:border-white outline-none"
                />
              ) : (
                <p className="text-white">{userInfo.firstName}</p>
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
                  value={userInfo.lastName}
                  onChange={(e) => setUserInfo({...userInfo, lastName: e.target.value})}
                  className="w-full bg-transparent text-white border-b border-white/20 focus:border-white outline-none"
                />
              ) : (
                <p className="text-white">{userInfo.lastName}</p>
              )}
            </div>
          </div>

          <div className="flex items-center p-4 bg-white/5 rounded-lg">
            <Mail className="w-5 h-5 text-white/70 mr-3" />
            <div className="flex-1">
              <label className="text-white/70 text-sm">Email</label>
              {isEditing ? (
                <input
                  type="email"
                  value={userInfo.email}
                  onChange={(e) => setUserInfo({...userInfo, email: e.target.value})}
                  className="w-full bg-transparent text-white border-b border-white/20 focus:border-white outline-none"
                />
              ) : (
                <p className="text-white">{userInfo.email}</p>
              )}
            </div>
          </div>

          <div className="flex items-center p-4 bg-white/5 rounded-lg">
            <Phone className="w-5 h-5 text-white/70 mr-3" />
            <div className="flex-1">
              <label className="text-white/70 text-sm">Phone</label>
              {isEditing ? (
                <input
                  type="tel"
                  value={userInfo.phone}
                  onChange={(e) => setUserInfo({...userInfo, phone: e.target.value})}
                  className="w-full bg-transparent text-white border-b border-white/20 focus:border-white outline-none"
                />
              ) : (
                <p className="text-white">{userInfo.phone}</p>
              )}
            </div>
          </div>

          <div className="flex items-center p-4 bg-white/5 rounded-lg">
            <Calendar className="w-5 h-5 text-white/70 mr-3" />
            <div className="flex-1">
              <label className="text-white/70 text-sm">Date of Birth</label>
              {isEditing ? (
                <input
                  type="date"
                  value={userInfo.dateOfBirth}
                  onChange={(e) => setUserInfo({...userInfo, dateOfBirth: e.target.value})}
                  className="w-full bg-transparent text-white border-b border-white/20 focus:border-white outline-none"
                />
              ) : (
                <p className="text-white">{new Date(userInfo.dateOfBirth).toLocaleDateString()}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default PersonalInformationPage;
