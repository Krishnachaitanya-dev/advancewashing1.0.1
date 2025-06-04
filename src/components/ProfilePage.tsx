import React from 'react';
import AppLayout from './AppLayout';
import { Button } from '@/components/ui/button';
import { User, Settings, MapPin, CreditCard, Bell, HelpCircle, LogOut, ChevronRight } from 'lucide-react';
const ProfilePage = () => {
  const profileSections = [{
    title: 'Account',
    items: [{
      id: 'personal',
      name: 'Personal Information',
      icon: <User className="w-5 h-5" />,
      action: <ChevronRight className="w-5 h-5" />
    }, {
      id: 'settings',
      name: 'Settings',
      icon: <Settings className="w-5 h-5" />,
      action: <ChevronRight className="w-5 h-5" />
    }]
  }, {
    title: 'Preferences',
    items: [{
      id: 'address',
      name: 'My Addresses',
      icon: <MapPin className="w-5 h-5" />,
      action: <ChevronRight className="w-5 h-5" />
    }, {
      id: 'payment',
      name: 'Payment Methods',
      icon: <CreditCard className="w-5 h-5" />,
      action: <ChevronRight className="w-5 h-5" />
    }, {
      id: 'notifications',
      name: 'Notification Settings',
      icon: <Bell className="w-5 h-5" />,
      action: <ChevronRight className="w-5 h-5" />
    }]
  }, {
    title: 'Support',
    items: [{
      id: 'help',
      name: 'Help & Support',
      icon: <HelpCircle className="w-5 h-5" />,
      action: <ChevronRight className="w-5 h-5" />
    }]
  }];
  return <AppLayout>
      {/* Profile Header */}
      <div className="glass-card p-6 mb-6 flex items-center">
        <div className="w-16 h-16 rounded-full bg-blue-900/60 flex items-center justify-center mr-4">
          <User className="w-8 h-8 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">John Doe</h2>
          <p className="text-white/70">john.doe@example.com</p>
        </div>
      </div>

      {/* Profile Sections */}
      <div className="space-y-6">
        {profileSections.map(section => <div key={section.title}>
            <h3 className="text-white text-lg font-medium mb-3">{section.title}</h3>
            <div className="glass-card overflow-hidden">
              {section.items.map((item, index) => <div key={item.id} className={`flex items-center justify-between p-4 text-white hover:bg-white/10 cursor-pointer ${index !== section.items.length - 1 ? 'border-b border-white/10' : ''}`}>
                  <div className="flex items-center">
                    <span className="mr-3 text-white/80">{item.icon}</span>
                    <span>{item.name}</span>
                  </div>
                  <span className="text-white/60">{item.action}</span>
                </div>)}
            </div>
          </div>)}
      </div>

      {/* Logout Button */}
      <div className="mt-8">
        <Button variant="outline" className="w-full border-white/20 flex items-center justify-center gap-2 text-zinc-950">
          <LogOut className="w-5 h-5" />
          <span>Log Out</span>
        </Button>
      </div>
    </AppLayout>;
};
export default ProfilePage;