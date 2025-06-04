
import React, { useState } from 'react';
import AppLayout from './AppLayout';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Bell, Mail, Smartphone, Package, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

const NotificationSettingsPage = () => {
  const [notifications, setNotifications] = useState({
    orderUpdates: true,
    promotions: false,
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    reviewReminders: true
  });

  const handleToggle = (setting: string) => {
    setNotifications(prev => ({
      ...prev,
      [setting]: !prev[setting as keyof typeof prev]
    }));
  };

  const notificationSettings = [
    {
      id: 'orderUpdates',
      title: 'Order Updates',
      description: 'Get notified about order status changes',
      icon: <Package className="w-5 h-5 text-white/70" />
    },
    {
      id: 'promotions',
      title: 'Promotions & Offers',
      description: 'Receive special offers and discounts',
      icon: <Star className="w-5 h-5 text-white/70" />
    },
    {
      id: 'reviewReminders',
      title: 'Review Reminders',
      description: 'Reminders to review completed orders',
      icon: <Star className="w-5 h-5 text-white/70" />
    }
  ];

  const communicationMethods = [
    {
      id: 'emailNotifications',
      title: 'Email Notifications',
      description: 'Receive notifications via email',
      icon: <Mail className="w-5 h-5 text-white/70" />
    },
    {
      id: 'pushNotifications',
      title: 'Push Notifications',
      description: 'Get app notifications on your device',
      icon: <Smartphone className="w-5 h-5 text-white/70" />
    },
    {
      id: 'smsNotifications',
      title: 'SMS Notifications',
      description: 'Receive important updates via SMS',
      icon: <Smartphone className="w-5 h-5 text-white/70" />
    }
  ];

  return (
    <AppLayout>
      <div className="mb-6 flex items-center">
        <Link to="/profile" className="mr-4 text-white">
          <ArrowLeft size={24} />
        </Link>
        <h1 className="text-2xl font-bold text-white">Notification Settings</h1>
      </div>

      <div className="space-y-6">
        <div className="glass-card p-4">
          <h3 className="text-white text-lg font-medium mb-4 flex items-center">
            <Bell className="w-5 h-5 mr-2" />
            Notification Types
          </h3>
          
          <div className="space-y-3">
            {notificationSettings.map(setting => (
              <div key={setting.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <div className="flex items-center">
                  {setting.icon}
                  <div className="ml-3">
                    <p className="text-white">{setting.title}</p>
                    <p className="text-white/60 text-sm">{setting.description}</p>
                  </div>
                </div>
                <Button
                  onClick={() => handleToggle(setting.id)}
                  variant="outline"
                  size="sm"
                  className={`border-white/20 ${
                    notifications[setting.id as keyof typeof notifications] 
                      ? 'bg-green-600/20 text-green-400 border-green-500/20' 
                      : 'text-white'
                  }`}
                >
                  {notifications[setting.id as keyof typeof notifications] ? 'On' : 'Off'}
                </Button>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card p-4">
          <h3 className="text-white text-lg font-medium mb-4">Communication Methods</h3>
          
          <div className="space-y-3">
            {communicationMethods.map(method => (
              <div key={method.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <div className="flex items-center">
                  {method.icon}
                  <div className="ml-3">
                    <p className="text-white">{method.title}</p>
                    <p className="text-white/60 text-sm">{method.description}</p>
                  </div>
                </div>
                <Button
                  onClick={() => handleToggle(method.id)}
                  variant="outline"
                  size="sm"
                  className={`border-white/20 ${
                    notifications[method.id as keyof typeof notifications] 
                      ? 'bg-green-600/20 text-green-400 border-green-500/20' 
                      : 'text-white'
                  }`}
                >
                  {notifications[method.id as keyof typeof notifications] ? 'Enabled' : 'Disabled'}
                </Button>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card p-4">
          <Button className="w-full bg-blue-900 hover:bg-blue-800 text-white">
            Save Notification Preferences
          </Button>
        </div>
      </div>
    </AppLayout>
  );
};

export default NotificationSettingsPage;
