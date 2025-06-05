
import React, { memo } from 'react';
import AppLayout from './AppLayout';
import { Button } from '@/components/ui/button';
import { User, Settings, MapPin, CreditCard, Bell, Star, Shield, FileText, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

const ProfilePage = memo(() => {
  const { user, signOut, isAdmin } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  const menuItems = [
    {
      icon: <User className="w-5 h-5" />,
      label: 'Personal Information',
      path: '/personal-information',
      description: 'Update your profile details'
    },
    {
      icon: <MapPin className="w-5 h-5" />,
      label: 'Address Management',
      path: '/address-management',
      description: 'Manage your delivery addresses'
    },
    {
      icon: <CreditCard className="w-5 h-5" />,
      label: 'Payment Methods',
      path: '/payment-methods',
      description: 'Manage payment options'
    },
    {
      icon: <Bell className="w-5 h-5" />,
      label: 'Notification Settings',
      path: '/notification-settings',
      description: 'Control your notifications'
    },
    {
      icon: <Settings className="w-5 h-5" />,
      label: 'Settings',
      path: '/settings',
      description: 'App preferences and settings'
    }
  ];

  const supportItems = [
    {
      icon: <Star className="w-5 h-5" />,
      label: 'Rate Our App',
      path: '/rate-app',
      description: 'Share your feedback'
    },
    {
      icon: <Shield className="w-5 h-5" />,
      label: 'Privacy Policy',
      path: '/privacy-policy',
      description: 'How we protect your data'
    },
    {
      icon: <FileText className="w-5 h-5" />,
      label: 'Terms of Service',
      path: '/terms-of-service',
      description: 'App terms and conditions'
    }
  ];

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Profile Header */}
        <div className="glass-card p-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-blue-900/60 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-white">
                {user?.user_metadata?.name || user?.email?.split('@')[0] || 'User'}
              </h2>
              <p className="text-white/80 text-sm">{user?.email}</p>
              {isAdmin && (
                <span className="inline-block mt-1 px-2 py-1 bg-yellow-600/60 text-yellow-100 text-xs font-medium rounded">
                  Admin
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Account Section */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Account</h3>
          <div className="space-y-3">
            {menuItems.map((item, index) => (
              <Link key={index} to={item.path}>
                <div className="flex items-center space-x-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                  <div className="text-white/80">
                    {item.icon}
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-medium text-sm">{item.label}</p>
                    <p className="text-white/60 text-xs">{item.description}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Support Section */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Support</h3>
          <div className="space-y-3">
            {supportItems.map((item, index) => (
              <Link key={index} to={item.path}>
                <div className="flex items-center space-x-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                  <div className="text-white/80">
                    {item.icon}
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-medium text-sm">{item.label}</p>
                    <p className="text-white/60 text-xs">{item.description}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Sign Out */}
        <div className="glass-card p-6">
          <Button 
            onClick={handleSignOut}
            variant="outline" 
            className="w-full border-red-500/50 text-red-300 hover:bg-red-500/20 flex items-center justify-center space-x-2"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </Button>
        </div>

        {/* App Version */}
        <div className="text-center text-white/60 text-xs">
          Advance Washing v1.0.0
        </div>
      </div>
    </AppLayout>
  );
});

ProfilePage.displayName = 'ProfilePage';
export default ProfilePage;
