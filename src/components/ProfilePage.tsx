
import React from 'react';
import AppLayout from './AppLayout';
import { Button } from '@/components/ui/button';
import { User, Settings, MapPin, Bell, Shield, FileText, Star, LogOut, ChevronRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

const ProfilePage = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear any user data/tokens here
    localStorage.clear();
    sessionStorage.clear();
    
    // Show success message
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of your account.",
    });
    
    // Navigate to login page
    navigate('/login');
  };

  const profileSections = [{
    title: 'Account',
    items: [{
      id: 'personal',
      name: 'Personal Information',
      icon: <User className="w-5 h-5" />,
      action: <ChevronRight className="w-5 h-5" />,
      href: '/profile/personal'
    }, {
      id: 'settings',
      name: 'Settings',
      icon: <Settings className="w-5 h-5" />,
      action: <ChevronRight className="w-5 h-5" />,
      href: '/profile/settings'
    }]
  }, {
    title: 'Preferences',
    items: [{
      id: 'address',
      name: 'My Addresses',
      icon: <MapPin className="w-5 h-5" />,
      action: <ChevronRight className="w-5 h-5" />,
      href: '/profile/addresses'
    }, {
      id: 'notifications',
      name: 'Notification Settings',
      icon: <Bell className="w-5 h-5" />,
      action: <ChevronRight className="w-5 h-5" />,
      href: '/profile/notifications'
    }]
  }, {
    title: 'Support & Legal',
    items: [{
      id: 'privacy',
      name: 'Privacy Policy',
      icon: <Shield className="w-5 h-5" />,
      action: <ChevronRight className="w-5 h-5" />,
      href: '/profile/privacy'
    }, {
      id: 'terms',
      name: 'Terms of Service',
      icon: <FileText className="w-5 h-5" />,
      action: <ChevronRight className="w-5 h-5" />,
      href: '/profile/terms'
    }, {
      id: 'rate',
      name: 'Rate Our App',
      icon: <Star className="w-5 h-5" />,
      action: <ChevronRight className="w-5 h-5" />,
      href: '/profile/rate'
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
              {section.items.map((item, index) => {
                const content = (
                  <div className={`flex items-center justify-between p-4 text-white hover:bg-white/10 cursor-pointer ${index !== section.items.length - 1 ? 'border-b border-white/10' : ''}`}>
                    <div className="flex items-center">
                      <span className="mr-3 text-white/80">{item.icon}</span>
                      <span>{item.name}</span>
                    </div>
                    <span className="text-white/60">{item.action}</span>
                  </div>
                );

                return (
                  <Link key={item.id} to={item.href}>
                    {content}
                  </Link>
                );
              })}
            </div>
          </div>)}
      </div>

      {/* Logout Button */}
      <div className="mt-8">
        <Button 
          variant="outline" 
          onClick={handleLogout}
          className="w-full border-white/20 flex items-center justify-center gap-2 text-zinc-950 hover:bg-red-500/10 hover:border-red-500/20 hover:text-red-400"
        >
          <LogOut className="w-5 h-5" />
          <span>Log Out</span>
        </Button>
      </div>
    </AppLayout>;
};

export default ProfilePage;
